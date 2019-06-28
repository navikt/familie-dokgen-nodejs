import templateService from '../services/templateService';

export default {
    async getTemplate(req, res) {
        const templateName = req.query.templateName;
        try{
            await templateService.findHandlebarsTemplate(templateName)
                .then((template) => {
                    template ? res.status(201).send(template)
                        :
                        res.status(400).send("Could not find specified letter.")})
                .catch((error) => {return error.message});
        }
        catch(error){
            res.status(500).send(error.message);
        }
    },

    async createTemplate(req, res) {
        const templateName = req.body.templateName.toString();
        const markdownContent = req.body.markdownContent.toString();

        try{
            await templateService.findHandlebarsTemplate(templateName)
                .then((template) => {
                    const result = !template ? templateService.createHandlebarsTemplate(templateName, markdownContent)
                        :
                        res.status(400).send("A letter with that name already exists.");
                    res.status(201).send(result);})
                .catch((error) => {return error.message});
        }
        catch(error){
            res.status(500).send(error.message);
        }
    },

    async updateTemplate(req, res) {
        const templateName = req.body.templateName.toString();
        const markdownContent = req.body.markdownContent.toString();

        try{
            await templateService.findHandlebarsTemplate(templateName)
                .then((template) => {
                    const result = template ? templateService.updateHandlebarsTemplate(templateName, markdownContent)
                        :
                        res.status(400).send("Could not find specified letter.");
                    res.status(200).send(result);})
                .catch((error) => {return error.message});
        }
        catch(error){
            res.status(500).send(error.message);
        }
    },

    deleteTemplate(req, res) {
        const templateName = req.body.templateName.toString();

        try{
            templateService.deleteTemplate(templateName);
            res.status(204).send({});
        }
        catch(error){
            res.status(400).send(error.message);
        }
    }

}
