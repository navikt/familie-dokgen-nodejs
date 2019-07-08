import handlebars from "handlebars";
//import markdown from 'handlebars-helpers';
import templateService from "./templateService";
import showdown from 'showdown';

export default {

    async createLetter(templateName, interleavingFields = {}){
        const markdownTemplate = await templateService.findMarkdownTemplate(templateName);
        const converter = new showdown.Converter();
        const html = converter.makeHtml(markdownTemplate);
        //handlebars.registerHelper("markdown", helpers.markdown({handlebars: handlebars}));

        interleavingFields = typeof interleavingFields !== "string"
            ? JSON.stringify(interleavingFields) : interleavingFields;
        const jsonData = JSON.parse(interleavingFields);

        const hbs = handlebars.compile(html);
        return hbs(jsonData);
    }
}
