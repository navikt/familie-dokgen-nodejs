import handlebars from "handlebars";
import fs from "mz/fs";
import path from "path";
import InterleavingFieldsError from "../utils/Exceptions/InterleavingFieldsError";
import showdownOptions from "../utils/showdownOptions";
import templateService from "./templateService";
import showdown from 'showdown';
import Ajv from 'ajv';

export default {

    async createLetter(templateName, interleavingFields = {}, verify = true){
        const markdownTemplate = await templateService.findMarkdownTemplate(templateName);

        try {
            return await this.processJson(templateName, interleavingFields, verify)
                .then( (jsonData) => {
                    const hbs = handlebars.compile(markdownTemplate);
                    const compiledHbs = hbs(jsonData);
                    const converter = new showdown.Converter(showdownOptions);
                    return converter.makeHtml(compiledHbs);
                })
                .catch((error) => {throw error;});
        }
        catch (error) {throw error;}
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
