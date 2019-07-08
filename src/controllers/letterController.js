import letterService from "../services/letterService";

export default {

    async getLetter(req, res){
        const templateName = req.query.templateName;
        const interleavingFields = req.query.interleavingFields;

        try {
            await letterService.createLetter(templateName, interleavingFields)
                .then((letter) => {
                    res.status(200).send(letter);
                })
                .catch((error) => {
                    res.status(400).send("Could not generate letter: " + error.message);
                })
        }
        catch (error) {
            res.status(400).send("Could not generate letter: " + error.message);
        }
    }
}
