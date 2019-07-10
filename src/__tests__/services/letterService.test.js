import sinon from "sinon";
import mockFs from "mock-fs";
import { expect } from "chai";
import letterService from "../../services/letterService";
import templateService from "../../services/templateService";
import InterleavingFieldsError from "../../utils/Exceptions/InterleavingFieldsError";
import {dir1, interleavingFields1, interleavingFields2, schema1} from "../utils/constants";

function getMarkdownTemplatePath(templateName){
    const tempName = templateName.toLocaleLowerCase();
    return `/templates/${tempName}/${tempName}.md`;
}

function getJsonSchemaPath(templateName){
    const tempName = templateName.toLocaleLowerCase();
    return `/templates/${tempName}/${tempName}.json`;
}

describe('When using letter service,', () => {

    beforeEach(() => {
        sinon.stub(templateService, "getMarkdownTemplatePath").callsFake(getMarkdownTemplatePath);
        sinon.stub(letterService, "getJsonSchemaPath").callsFake(getJsonSchemaPath);
        mockFs(dir1, {createCwd: true, createTmp: true});
    });

    afterEach(() => {
        templateService.getMarkdownTemplatePath.restore();
        letterService.getJsonSchemaPath.restore();
        mockFs.restore();
    });

    describe('creating a letter', () => {

        it('should return a letter with the correct fields', () => {
            return letterService.createLetter('tem1', interleavingFields1, true, "html")
                .then((data) => {
                    expect(typeof data === 'string').to.be.true;
                    expect(String(data)).to.equal(
                        '<h1>Hei, Jonas!</h1>\n' +
                        '<h2>Test</h2>\n' +
                        '<p>Dette er en test.</p>')
                })
        });
        it('should return an error when fields are required, but not provided', () => {
            return letterService.createLetter('tem1', {}, true, "html")
                .catch((error) => {
                    expect(error).to.exist;
                    expect(error instanceof InterleavingFieldsError).to.be.true;
                    expect(error.errorCode).to.be.equal("FieldError");
                    expect(error.value[0].message).to.be.equal("should have required property 'name'");
                })
        })
    });

    describe('processing JSON', () => {

        it('should return the JSON data when input structure is ok', () => {
            return letterService.processJson('tem1', interleavingFields1)
                .then((data) => {
                    expect(data.constructor === {}.constructor).to.be.true;
                    expect(JSON.stringify(data)).to.be.equal(JSON.stringify(interleavingFields1));
                })
        });

        it('should return an error when the input structure is not ok', () => {
            return letterService.processJson('tem1', interleavingFields2)
                .catch((error) => {
                    expect(error).to.exist;
                    expect(error instanceof InterleavingFieldsError).to.be.true;
                    expect(error.errorCode).to.be.equal("FieldError");
                    expect(error.value[0].dataPath).to.be.equal('.name');
                    expect(error.value[0].message).to.be.equal("should be string");
                })
        });

        it('should return the JSON data when verify is set to false', () => {
            return letterService.processJson('tem1', interleavingFields1, false, "html")
                .then((data) => {
                    expect(data.constructor === {}.constructor).to.be.true;
                    expect(JSON.stringify(data)).to.be.equal(JSON.stringify(interleavingFields1));
                })
        });
    });

    describe('validating JSON', () => {

        it('should return the JSON data when input structure is ok', () => {
            const valJson = JSON.stringify(schema1);
            const testJson = JSON.stringify(interleavingFields1);
            const result = letterService.validateJson(JSON.parse(valJson), JSON.parse(testJson));

            expect(result.constructor === {}.constructor).to.be.true;
            expect(JSON.stringify(result)).to.be.equal(JSON.stringify(interleavingFields1));
        });

        it('should return an error when the input structure is not ok', () => {
            return letterService.processJson('tem1', interleavingFields2)
                .catch((error) => {
                    expect(error).to.exist;
                    expect(error instanceof InterleavingFieldsError).to.be.true;
                    expect(error.errorCode).to.be.equal("FieldError");
                    expect(error.value[0].dataPath).to.be.equal('.name');
                    expect(error.value[0].message).to.be.equal("should be string");
                })
        });
    });
});
