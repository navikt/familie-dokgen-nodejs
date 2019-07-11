import handlebars from "handlebars";
import jsonValidation from "../utils/jsonValidation";
import showdownOptions from "../utils/showdownOptions";
import templateService from "./templateService";
import showdown from 'showdown';
import puppeteer from 'puppeteer';

export default {

    async createLetter(templateName, interleavingFields = {}, verify = true, format){
        const markdownTemplate = await templateService.findMarkdownTemplate(templateName);

        if(!format){
            throw new Error("No letter format specified.")
        }

        try {
            return await jsonValidation.processJson(templateName, interleavingFields, verify)
                .then( (jsonData) => {
                    const hbs = handlebars.compile(markdownTemplate);
                    const compiledHbs = hbs(jsonData);

                    if(format === "html"){
                        return this.generateHtml(compiledHbs);
                    }
                    else if(format === "pdf" || format === "pdfa"){
                        return this.generatePdfa(compiledHbs)
                            .then((pdfa) => {
                                return pdfa;
                            })
                            .catch((error) => {throw error});
                    }
                })
                .catch((error) => {throw error});
        }
        catch (error) {throw error;}
    },

    generateHtml(compiledHbs){
        const converter = new showdown.Converter(showdownOptions);
        return converter.makeHtml(compiledHbs);
    },

    async generatePdfa(compiledHbs){
        const html = this.generateHtml(compiledHbs);
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true
        });
        const page = await browser.newPage();
        await page.goto(`data:text/html;charset=UTF-8,${html}`, {
            waitUntil: 'domcontentloaded'
        });

        return page.pdf({format: 'A4'})
            .then( (pdfa) => {
                browser.close();
                return pdfa;
            });
    },
}
