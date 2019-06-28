import showdown from 'showdown';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export default {

    createHandlebarsTemplate(templateName, markdownContent){
        // create new template from markdown
        const converter = new showdown.Converter();
        const html = converter.makeHtml(markdownContent);
        this.saveHandlebarsTemplate(templateName, html);

        const template = Handlebars.compile(html);
        return template();
    },

    saveHandlebarsTemplate(templateName, template){
        const dirpath = this.getTemplateFolder(path.join(__dirname + `/../templates/${templateName}/`));

        try {
            fs.writeFile(`${dirpath}/${templateName}.hbs`, template, (err) => {
                if(err) {
                    throw new Error("Could not save file: " + err.message);
                }
            });
        }
        catch (err) {
            throw new Error("Could not save file: " + err.message);
        }
    },

    getTemplateFolder(path){
        fs.mkdir(path, err => {
            if (err && err.code !== 'EEXIST'){
                 throw new Error("Error retrieving folder: " + err.message);
            }
        });
        return path;
    }
}
