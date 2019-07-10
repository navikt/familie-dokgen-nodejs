import letterService from "../services/letterService";
import pdfaStreamGen from "../utils/pdfaStreamGen";

export default {

    async getLetter(req, res){
        const templateName = req.body.templateName;
        const interleavingFields = req.body.interleavingFields;
        const format = req.body.format;

        try {
            await letterService.createLetter(templateName, interleavingFields, true, format)
                .then((letter) => {
                    if(format === "html"){
                        res.status(201).send(letter);
                    }
                    else{
                        pdfaStreamGen(res, templateName, letter);
                    }
                })
                .catch((error) => res.status(400).send(error));
        }
        catch (error) {
            res.status(500).send(error);
        }
    }
}
