import showdown from 'showdown';
import Handlebars from 'handlebars';
import fs from 'mz/fs';
import path from 'path';

export default {

    async findHandlebarsTemplate(templateName){
        const path = this.getTemplatePath(templateName);
        return await fs.readFile(path, "utf-8")
            .then(data => {
                return data;
            })
            .catch((err) => {
                if(err.code === "ENOENT"){
                    return false;
                }
            });
    },

    createHandlebarsTemplate(templateName, markdownContent){
        const converter = new showdown.Converter();
        const html = converter.makeHtml(markdownContent);
        this.saveHandlebarsTemplate(templateName, html);

        const template = Handlebars.compile(html);
        return template();
    },

    async saveHandlebarsTemplate(templateName, template){
        await this.getTemplateFolder(path.join(__dirname + `/../templates/${templateName}/`));

        try {
            fs.writeFile(this.getTemplatePath(templateName), template, (err) => {
                if(err) {
                    throw new Error("Could not save file: " + err.message);
                }
            });
        }
        catch (err) {
            throw new Error("Could not save file: " + err.message);
        }
    },

    getTemplatePath(templateName){
        return path.join(__dirname + `/../templates/${templateName}/${templateName}.hbs`);
    },

    getTemplateFolder(path){
        fs.mkdir(path, err => {
            if (err && err.code !== 'EEXIST'){
                 throw new Error("Error retrieving folder: " + err.message);
            }
        });
    }
}
