import Handlebars from "handlebars";
import templateService from "./templateService";
import showdown from 'showdown';

export default {

    async createLetter(templateName, interleavingFields){
        const markdownTemplate = await templateService.findMarkdownTemplate(templateName);
        const jsonData = JSON.parse(interleavingFields);

        const converter = new showdown.Converter();
        const html = converter.makeHtml(markdownTemplate);
        const hbsTemplate = Handlebars.compile(html);
        return hbsTemplate(jsonData);
    }
}
