import showdown from 'showdown';
import Handlebars from 'handlebars';
import fs from 'mz/fs';
import rimraf from 'rimraf';
import path from 'path';

export default {

    async findHandlebarsTemplate(templateName){
        const path = this.getHandlebarsTemplatePath(templateName);
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

    async createHandlebarsTemplate(templateName, markdownContent){
        const converter = new showdown.Converter();
        const html = converter.makeHtml(markdownContent);
        await this.saveHandlebarsTemplate(templateName, html);

        //TODO: compile and return through a letter service
        const hbsTemplate = Handlebars.compile(html);
        return hbsTemplate();
    },

    async saveHandlebarsTemplate(templateName, template){
        await this.getTemplateFolder(this.getTemplatePath(templateName));

        try {
            fs.writeFile(this.getHandlebarsTemplatePath(templateName), template, (err) => {
                if(err) {
                    throw new Error("Could not save file: " + err.message);
                }
            });
        }
        catch (err) {
            throw new Error("Could not save file: " + err.message);
        }
    },

    async updateHandlebarsTemplate(templateName, markdownContent){
        const converter = new showdown.Converter();
        const html = converter.makeHtml(markdownContent);
        await this.saveHandlebarsTemplate(templateName, html);

        //TODO: compile and return through a letter service
        const hbsTemplate = Handlebars.compile(html);
        return hbsTemplate();
    },

    deleteTemplate(templateName){
        this.deleteTemplateFolder(this.getTemplatePath(templateName));
    },

    getTemplatePath(templateName){
        return path.join(__dirname + `/../templates/${templateName}/`);
    },

    getHandlebarsTemplatePath(templateName){
        return path.join(__dirname + `/../templates/${templateName}/${templateName}.hbs`);
    },

    getTemplateFolder(path){
        fs.mkdir(path, err => {
            if (err && err.code !== 'EEXIST'){
                 throw new Error("Error retrieving folder: " + err.message);
            }
        });
    },

    deleteTemplateFolder(path){
        rimraf(path, fs, err => {
            if (err && err.code === 'EEXIST'){
                throw new Error("Template folder does not exist.");
            }
            else if(err){
                throw new Error("Error deleting folder: " + err.message);
            }
        });
    }
}
