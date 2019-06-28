import path from "path";
import templateController from '../controllers/templateController';

export default (app) => {
    app.get('/', (req, res) => res.status(200).sendFile(
        path.join(__dirname + '/../../public/form.html')
    ));

    app.post('/template', templateController.createTemplate.bind(templateController));
}
