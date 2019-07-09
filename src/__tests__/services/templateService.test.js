import sinon from "sinon";
import mockFs from "mock-fs";
import { expect } from "chai";
import letterService from "../../services/letterService";
import InterleavingFieldsError from "../../utils/Exceptions/InterleavingFieldsError";
import {dir1, interleavingFields1, markdown1, markdown2} from "../utils/constants";
import templateService from '../../services/templateService';


function getMarkdownTemplatePath(templateName){
    return `/templates/${templateName}/${templateName}.md`;
}

function getJsonSchemaPath(templateName){
    return `/templates/${templateName}/${templateName}.json`;
}

function getTemplatePath(templateName){
    return `/templates/${templateName}/`;
}

function getMockDirectory(){
    return mockFs.getMockRoot()._items['\\\\?\\c:']._items.templates._items
}

describe('When using template service,', () => {

    beforeEach(() => {
        sinon.stub(templateService, "getMarkdownTemplatePath").callsFake(getMarkdownTemplatePath);
        sinon.stub(letterService, "getJsonSchemaPath").callsFake(getJsonSchemaPath);
    });

    afterEach(() => {
        templateService.getMarkdownTemplatePath.restore();
        letterService.getJsonSchemaPath.restore();
    });

    describe('searching for template', () => {
        beforeEach(() => {
            mockFs(dir1, {createCwd: true, createTmp: true});
        });

        afterEach(() => {
            mockFs.restore();
        });

        it('should return HTML file when requesting existing file', () => {
            return templateService.findMarkdownTemplate('tem1')
                .then( (data) =>
                    expect(String(data)).to.equal(
                        '<h1>Hei, {{name}}!</h1>\n' +
                        '<h2>Test</h2>\n' +
                        '<p>Dette er en test.</p>')
                )
        });
        it('should return false when requesting non-existing file', () => {
            return templateService.findMarkdownTemplate('tem2')
                .then( (data) =>
                    expect(data).to.equal(false)
                )
        });
    });

    describe("creating a template", () => {
        beforeEach(() => {
            sinon.stub(templateService, "getTemplatePath").callsFake(getTemplatePath);
            mockFs({'/templates':{}}, {createCwd: true, createTmp: true});
        });

        afterEach(() => {
            templateService.getTemplatePath.restore();
            mockFs.restore();
        });

        it("should return the created template", () => {
            return templateService.createMarkdownTemplate('tem1', markdown1, interleavingFields1)
                .then( (data) =>
                    expect(String(data)).to.equal(
                        '<h1>Hei, Jonas!</h1>\n' +
                        '<h2>Test</h2>\n' +
                        '<p>Dette er en test.</p>')
                )
        });
        it("should return empty template if input is empty", () => {
            return templateService.createMarkdownTemplate('tem1', '')
                .then( (data) =>
                    expect(String(data)).to.be.empty
                )
        });
    });

    describe("updating a template", () => {
        beforeEach(() => {
            sinon.stub(templateService, "getTemplatePath").callsFake(getTemplatePath);
            mockFs(dir1, {createCwd: true, createTmp: true});
        });

        afterEach(() => {
            templateService.getTemplatePath.restore();
            mockFs.restore();
        });

        it("should return the updated template", () => {
            return templateService.updateMarkdownTemplate('tem1', markdown2, interleavingFields1)
                .then((data) =>
                    expect(String(data)).to.equal(
                        '<h1>Hello, Jonas!</h1>\n' +
                        '<h2>Test</h2>\n' +
                        '<p>This is a test.</p>')
                )
        });
        it("should return field error if input is empty and fields are required", () => {
            return templateService.updateMarkdownTemplate('tem1', '')
                .catch((error) => {
                    expect(error).to.exist;
                    expect(error instanceof InterleavingFieldsError).to.be.true;
                    expect(error.errorCode).to.be.equal("FieldError");
                    expect(error.value[0].message).to.be.equal("should have required property 'name'");
                })
        });
    });

    describe("deleting a template", () => {
        beforeEach(() => {
            sinon.stub(templateService, "getTemplatePath").callsFake(getTemplatePath);
        });

        afterEach(() => {
            templateService.getTemplatePath.restore();
            mockFs.restore();
        });

        it("should return ok if the template folder does not exist", () => {
            mockFs({'/templates':{}}, {createCwd: true, createTmp: true});
            expect(mockFs.getMockRoot()).to.be.not.equal({});
            expect(() => templateService.deleteTemplate("tem1")).to.be.ok;
        });
        it("should delete the template from the file system", async () => {
            mockFs(dir1, {createCwd: true, createTmp: true});

            expect(getMockDirectory().tem1).to.exist;
            await templateService.deleteTemplate('tem1');
            expect(getMockDirectory().tem1).to.not.exist;
        });
    });
});
