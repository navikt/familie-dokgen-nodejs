import sinon from "sinon";
import mockFs from "mock-fs";
import { expect } from "chai";
import {dir1, interleavingFields1, markdown1, markdown2} from "../utils/constants";
import templateService from '../../services/templateService';


function getMarkdownTemplatePath(templateName){
    return `/templates/${templateName}/${templateName}.md`;
}

function getTemplatePath(templateName){
    return `/templates/${templateName}/`;
}

beforeEach(() => {
    sinon.stub(templateService, "getMarkdownTemplatePath").callsFake(getMarkdownTemplatePath);
});

afterEach(() => {
    templateService.getMarkdownTemplatePath.restore();
});

describe('When using template service,', () => {

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
                        '<h1 id="heiname">Hei, {{name}}!</h1>\n' +
                        '<h2 id="test">Test</h2>\n' +
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
                        '<h1 id="heiname">Hei, Jonas!</h1>\n' +
                        '<h2 id="test">Test</h2>\n' +
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
                        '<h1 id="helloname">Hello, Jonas!</h1>\n' +
                        '<h2 id="test">Test</h2>\n' +
                        '<p>This is a test.</p>')
                )
        });
        it("should return empty template if input is empty", () => {
            return templateService.updateMarkdownTemplate('tem1', '')
                .then((data) =>
                    expect(String(data)).to.be.empty
                )
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
        it("should return empty template if input is empty", () => {
            mockFs(dir1, {createCwd: true, createTmp: true});
            templateService.deleteTemplate('tem1');
            expect(mockFs.getMockRoot().toString()).to.not.contain("tem1");
        });
    });
});