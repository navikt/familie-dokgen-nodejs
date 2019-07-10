import {Readable} from "readable-stream";

export default function(res, templateName, letter) {
    let filename = `${templateName}.pdf`;
    filename = encodeURIComponent(filename);
    res.status(201);
    res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    const stream = new Readable();
    stream.push(letter);
    stream.push(null);
    stream.pipe(res);
}
