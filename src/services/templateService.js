import fs from 'mz/fs';
import rimraf from 'rimraf';
import path from 'path';
import letterService from "./letterService";

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

    async createMarkdownTemplate(templateName, markdownContent, interleavingFields){
        try {
            await this.saveMarkdownTemplate(templateName, markdownContent);
            return await letterService.createLetter(templateName, interleavingFields, false);
        }
        catch (error) {
            throw new Error("Could not return generated letter: " + error.message);
        }
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

    async updateMarkdownTemplate(templateName, markdownContent, interleavingFields){
        try {
            await this.saveMarkdownTemplate(templateName, markdownContent);
            return await letterService.createLetter(templateName, interleavingFields);
        }
        catch (error) {
            throw new Error("Could not return generated letter: " + error.message);
        }
    },

    deleteTemplate(templateName){
        this.deleteTemplateFolder(this.getTemplatePath(templateName));
    },

    getTemplatePath(templateName){
        return path.join(__dirname + `/../templates/${templateName}/`);
    },

    getMarkdownTemplatePath(templateName){
        return path.join(__dirname + `/../templates/${templateName}/${templateName}.md`);
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
