import path from "path";
import letterController from "../controllers/letterController";
import templateController from '../controllers/templateController';

export default (app) => {
    app.get('/', (req, res) => res.status(200).sendFile(
        path.join(__dirname + '/../../public/form.html')
    ));

    app.get('/template', templateController.getTemplate.bind(templateController));
    app.post('/template', templateController.createTemplate.bind(templateController));
    app.put('/template', templateController.updateTemplate.bind(templateController));
    app.delete('/template', templateController.deleteTemplate.bind(templateController));

    app.get('/letter', letterController.getLetter.bind(letterController));
}
