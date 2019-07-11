import fs from "mz/fs";
import path from "path";
import sinon from "sinon";
import mockFs from "mock-fs";
import { expect } from "chai";
import letterService from "../../services/letterService";
import jsonValidation from "../../utils/jsonValidation";
import InterleavingFieldsError from "../../utils/Exceptions/InterleavingFieldsError";
import {
    dir1,
    dir2,
    expected0,
    expected1,
    expected2,
    interleavingFields1,
    markdown1,
    markdown2
} from "../utils/constants";
import templateService from '../../services/templateService';


function getMarkdownTemplatePath(templateName){
    return `/templates/${templateName}/${templateName}.md`;
}

function getJsonSchemaPath(templateName){
    return `/templates/${templateName}/${templateName}.json`;
}

async function getMainHtmlTemplate(){
    return await fs.readFile(path.join(`/../utils/TemplateExtensions/main.hbs`), 'utf-8')
        .then(data => {
            return data;
        })
        .catch((err) => {throw err});
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
        sinon.stub(jsonValidation, "getJsonSchemaPath").callsFake(getJsonSchemaPath);
        sinon.stub(letterService, "getMainHtmlTemplate").callsFake(getMainHtmlTemplate);
    });

    afterEach(() => {
        templateService.getMarkdownTemplatePath.restore();
        jsonValidation.getJsonSchemaPath.restore();
        letterService.getMainHtmlTemplate.restore();
    });

    describe('searching for template', () => {
        beforeEach(() => {
            mockFs(dir1, {createCwd: true, createTmp: true});
        });

        afterEach(() => {
            mockFs.restore();
        });

        it('should return markdown file when requesting existing file', () => {
            return templateService.findMarkdownTemplate('tem1')
                .then( (data) =>
                    expect(String(data)).to.equal(
                        '#Hei, {{name}}!\n' +
                        '##Test\n' +
                        'Dette er en test.')
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
            mockFs(dir2, {createCwd: true, createTmp: true});
        });

        afterEach(() => {
            templateService.getTemplatePath.restore();
            mockFs.restore();
        });

        it("should return the created template", () => {
            return templateService.createMarkdownTemplate('tem1', markdown1, interleavingFields1, "html")
                .then( (data) =>
                    expect(String(data)).to.equal(expected1)
                )
        });
        it("should return template with header and footer if input is empty", () => {
            return templateService.createMarkdownTemplate('tem1', '', {}, "html")
                .then( (data) =>
                    expect(String(data)).to.equal(expected0)
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
            return templateService.updateMarkdownTemplate('tem1', markdown2, interleavingFields1, "html")
                .then((data) =>
                    expect(String(data)).to.equal(expected2)
                )
        });
        it("should return field error if input is empty and fields are required", () => {
            return templateService.updateMarkdownTemplate('tem1', '', {}, "html")
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
