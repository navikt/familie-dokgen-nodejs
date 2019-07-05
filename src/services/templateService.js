import showdown from 'showdown';
import Handlebars from 'handlebars';
import fs from 'mz/fs';
import rimraf from 'rimraf';
import path from 'path';

export default {

    async findMarkdownTemplate(templateName){
        const path = this.getMarkdownTemplatePath(templateName);
        return await fs.readFile(path, 'utf-8')
            .then(data => {
                return data;
            })
            .catch((err) => {
                if(err.code === "ENOENT"){
                    return false;
                }
            });
    },

    async createMarkdownTemplate(templateName, markdownContent){
        const converter = new showdown.Converter();
        const html = converter.makeHtml(markdownContent);
        const savedTemplate = await this.saveMarkdownTemplate(templateName, html);

        //TODO: compile and return through a letter service
        const hbsTemplate = Handlebars.compile(savedTemplate);
        return hbsTemplate();
    },

    async saveMarkdownTemplate(templateName, template){
        await this.getTemplateFolder(this.getTemplatePath(templateName));

        return await fs.writeFile(this.getMarkdownTemplatePath(templateName), template, 'utf-8')
            .then(() => {
                return template;
            })
            .catch((error) => {
                throw new Error("Could not save file: " + error.message);
            })
    },

    async updateMarkdownTemplate(templateName, markdownContent){
        const converter = new showdown.Converter();
        const html = converter.makeHtml(markdownContent);
        await this.saveMarkdownTemplate(templateName, html);

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

    getMarkdownTemplatePath(templateName){
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
