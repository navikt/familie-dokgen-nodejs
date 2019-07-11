import handlebars from "handlebars";
import fs from "mz/fs";
import path from "path";
import InterleavingFieldsError from "../utils/Exceptions/InterleavingFieldsError";
import showdownOptions from "../utils/showdownOptions";
import templateService from "./templateService";
import showdown from 'showdown';
import Ajv from 'ajv';
import puppeteer from 'puppeteer';

export default {

    async createLetter(templateName, interleavingFields = {}, verify = true, format){
        const markdownTemplate = await templateService.findMarkdownTemplate(templateName);

        if(!format){
            throw new Error("No letter format specified.")
        }

        try {
            return await this.processJson(templateName, interleavingFields, verify)
                .then( (jsonData) => {

                    if(format === "html"){
                        return this.generateHtml(markdownTemplate, jsonData);
                    }
                    else if(format === "pdf" || format === "pdfa"){
                        return this.generatePdfa(markdownTemplate, jsonData)
                            .then((pdfa) => {
                                return pdfa;
                            })
                            .catch((error) => {throw error});
                    }
                })
                .catch((error) => {throw error;});
        }
        catch (error) {throw error;}
    },

    async generatePdfa(markdownTemplate, jsonData){
        const html = await this.generateHtml(markdownTemplate, jsonData);
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true
        });
        const page = await browser.newPage();
        await page.goto(`data:text/html;charset=UTF-8,${html}`, {
            waitUntil: 'networkidle2'
        });
        await page.addStyleTag({path: "public/styling.css"});

        return page.pdf({format: 'A4', printBackground: true})
            .then( (pdfa) => {
                browser.close();
                return pdfa;
            });
    },

    generateHtml(markdownTemplate, jsonData, header = true, footer = true){
        const hbs = handlebars.compile(markdownTemplate);
        const compiledHbs = hbs(jsonData);
        const converter = new showdown.Converter(showdownOptions);
        const html = converter.makeHtml(compiledHbs);

        return this.beautifyHtml(html, header, footer);
    },

    async beautifyHtml(html, header, footer){
        const mainTemplate = await this.getMainHtmlTemplate();
        const hbs = handlebars.compile(mainTemplate);

        handlebars.registerPartial("content", html);
        return hbs({header: header, footer: footer});
    },

    async getMainHtmlTemplate(){
        return await fs.readFile(path.join(__dirname + `/../utils/TemplateExtensions/main.hbs`), 'utf-8')
            .then(data => {
                return data;
            })
            .catch((err) => {throw err});
    },

    async processJson(templateName, interleavingFields, verify = true){
        interleavingFields = typeof interleavingFields !== "string"
            ? JSON.stringify(interleavingFields) : interleavingFields;
        const jsonData = JSON.parse(interleavingFields);

        if(verify){
            try {
                return await this.findJsonSchema(templateName)
                    .then((schema) => {
                        const validationSchema = JSON.parse(schema);
                        return this.validateJson(validationSchema, jsonData);
                    })
                    .catch((error) => {throw error;});
            }
            catch (error) {throw error;}
        }
        return jsonData;
    },

    validateJson(schema, jsonData){
        const ajv = new Ajv({allErrors: true});
        const validator = ajv.compile(schema);
        const valid = validator(jsonData);
        if(!valid){
            throw new InterleavingFieldsError(validator.errors);
        }
        return jsonData;
    },

    getJsonSchemaPath(templateName){
        const tempName = templateName.toLocaleLowerCase();
        return path.join(__dirname + `/../templates/${tempName}/${tempName}.json`);
    },

    async findJsonSchema(templateName){
        const path = this.getJsonSchemaPath(templateName);
        return await fs.readFile(path, 'utf-8')
            .then(data => {
                return data;
            })
            .catch((err) => {
                if(err.code === "ENOENT"){
                    throw new Error("Could not find JSON schema to validate on.")
                }
            });
    },
}
