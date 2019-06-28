import templateService from '../services/templateService';

export default {
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
                .catch((error) => {res.status(500).send("Could not generate template: " + error.message)});
        }
        catch(error){
            res.status(500).send(error.message);
        }
    }
}
