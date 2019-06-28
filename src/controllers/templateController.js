import templateService from '../services/templateService';

export default {
    createTemplate(req, res) {
        const templateName = req.body.templateName.toString();
        const markdownContent = req.body.markdownContent.toString();

        try{
            const result = templateService.createHandlebarsTemplate(templateName, markdownContent);
            res.status(201).send(result);
        }
        catch(err){
            res.status(500).send(err.message);
        }
    }
}
