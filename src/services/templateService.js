import fs from 'mz/fs';
import rimraf from 'rimraf';
import path from 'path';
import InterleavingFieldsError from "../utils/Exceptions/InterleavingFieldsError";
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

    async createMarkdownTemplate(templateName, markdownContent, interleavingFields, format){
        try {
            await this.saveMarkdownTemplate(templateName, markdownContent);
            return await letterService.createLetter(templateName, interleavingFields, false, format);
        }
        catch (error) {
            if(error instanceof InterleavingFieldsError){
                throw(error);
            }
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

    async updateMarkdownTemplate(templateName, markdownContent, interleavingFields, format){
        try {
            await this.saveMarkdownTemplate(templateName, markdownContent);
            return await letterService.createLetter(templateName, interleavingFields, true, format);
        }
        catch (error) {
            if(error instanceof InterleavingFieldsError){
                throw(error);
            }
            throw new Error("Could not return generated letter: " + error.message);
        }
    },

    async deleteTemplate(templateName){
        this.deleteTemplateFolder(this.getTemplatePath(templateName));
    },

    getTemplatePath(templateName){
        const tempName = templateName.toLocaleLowerCase();
        return path.join(__dirname + `/../templates/${tempName}/`);
    },

    getMarkdownTemplatePath(templateName){
        const tempName = templateName.toLocaleLowerCase();
        return path.join(__dirname + `/../templates/${tempName}/${tempName}.md`);
    },

    getTemplateFolder(path){
        fs.mkdir(path, err => {
            if (err && err.code !== 'EEXIST'){
                 throw new Error("Error retrieving folder: " + err.message);
            }
        });
    },

    async deleteTemplateFolder(path){
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
