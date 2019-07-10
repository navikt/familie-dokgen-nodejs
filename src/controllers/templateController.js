import templateService from '../services/templateService';
import pdfaStreamGen from "../utils/pdfaStreamGen";

export default {

    async getTemplate(req, res) {
        const templateName = req.query.templateName;

        try{
            await templateService.findMarkdownTemplate(templateName)
                .then((template) => {
                    template ? res.status(201).send(template)
                        :
                        res.status(400).send("Could not find specified letter.")})
                .catch((error) => {return error});
        }
        catch(error){
            res.status(500).send(error);
        }
    },

    async createTemplate(req, res) {
        const templateName = req.body.templateName.toString();
        const markdownContent = req.body.markdownContent.toString();
        const interleavingFields = req.body.interleavingFields.toString();
        const format = req.body.format.toString();

        try{
            await templateService.findMarkdownTemplate(templateName)
                .then((template) => {
                    !template ? templateService.createMarkdownTemplate(templateName, markdownContent, interleavingFields, format)
                            .then((letter) => {
                                if(format === "html"){
                                    res.status(201).send(letter)
                                }
                                else{
                                    pdfaStreamGen(res, templateName, letter)
                                }
                            })
                            .catch((error) => res.status(400).send(error))
                        :
                        res.status(400).send("A letter with that name already exists.");
                })
                .catch((error) => {res.status(500).send(error)});
        }
        catch(error){
            res.status(500).send(error);
        }
    },

    async updateTemplate(req, res) {
        const templateName = req.body.templateName.toString();
        const markdownContent = req.body.markdownContent.toString();
        const interleavingFields = req.body.interleavingFields.toString();
        const format = req.body.format.toString();

        try{
            await templateService.findMarkdownTemplate(templateName)
                .then((template) => {
                    template ? templateService.updateMarkdownTemplate(templateName, markdownContent, interleavingFields, format)
                            .then((letter) => {
                                if(format === "html"){
                                    res.status(201).send(letter)
                                }
                                else{
                                    pdfaStreamGen(res, templateName, letter)
                                }
                            })
                            .catch((error) => res.status(400).send(error))
                        :
                        res.status(404).send("Could not find specified letter.");
                })
                .catch((error) => {res.status(500).send(error)});
        }
        catch(error){
            res.status(500).send(error);
        }
    },

    deleteTemplate(req, res) {
        const templateName = req.body.templateName.toString();

        try{
            templateService.deleteTemplate(templateName);
            res.status(204).send({});
        }
        catch(error){
            res.status(400).send(error);
        }
    }

}
