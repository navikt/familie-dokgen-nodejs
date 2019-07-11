//////// EVAL ////////

export const schema1 = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Person",
    "properties": {
        "name": {
            "type": "string"
        }
    },
    "required": ["name"]
};

export const htmlMainTemplate =
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <title>Main HTML template</title>\n' +
    '    <link rel="stylesheet" type="text/css" href="styling.css">\n' +
    '\n' +
    '</head>\n' +
    '<body>\n' +
    '    {{#if header}}\n' +
    '        <div id="header">\n' +
    '            <p>Header</p>\n' +
    '        </div>\n' +
    '    {{/if}}\n' +
    '\n' +
    '    {{> content}}\n' +
    '\n' +
    '    {{#if footer}}\n' +
    '        <div id="footer">\n' +
    '            <p>Footer</p>\n' +
    '        </div>\n' +
    '    {{/if}}\n' +
    '</body>\n' +
    '</html>';

export const dir1 = {
    '/templates': {
        'tem1': {
            'tem1.md':
                '#Hei, {{name}}!\n' +
                '##Test\n' +
                'Dette er en test.',
            'tem1.json':
                JSON.stringify(schema1)
        },
    },
    '/utils': {
        'TemplateExtensions': {
            'main.hbs': htmlMainTemplate
        }
    }
};

export const dir2 = {
    '/templates': {},
    '/utils': {
        'TemplateExtensions': {
            'main.hbs': htmlMainTemplate
        }
    }
};

export const markdown1 =
    '#Hei, {{name}}!\n' +
    '##Test\n' +
    'Dette er en test.';

export const markdown2 =
    '#Hello, {{name}}!\n' +
    '##Test\n' +
    'This is a test.';

export const interleavingFields1 = {name: 'Jonas'};

export const interleavingFields2 = {name: 15};

//////// EXPECTED ////////

export const expected0 =
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <title>Main HTML template</title>\n' +
    '    <link rel="stylesheet" type="text/css" href="styling.css">\n' +
    '\n' +
    '</head>\n' +
    '<body>\n' +
    '        <div id="header">\n' +
    '            <p>Header</p>\n' +
    '        </div>\n' +
    '\n' +
    '\n' +
    '        <div id="footer">\n' +
    '            <p>Footer</p>\n' +
    '        </div>\n' +
    '</body>\n' +
    '</html>'

export const expected1 =
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <title>Main HTML template</title>\n' +
    '    <link rel="stylesheet" type="text/css" href="styling.css">\n' +
    '\n' +
    '</head>\n' +
    '<body>\n' +
    '        <div id="header">\n' +
    '            <p>Header</p>\n' +
    '        </div>\n' +
    '\n' +
    '    <h1>Hei, Jonas!</h1>\n' +
    '    <h2>Test</h2>\n' +
    '    <p>Dette er en test.</p>\n' +
    '        <div id="footer">\n' +
    '            <p>Footer</p>\n' +
    '        </div>\n' +
    '</body>\n' +
    '</html>';

export const expected2 =
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <title>Main HTML template</title>\n' +
    '    <link rel="stylesheet" type="text/css" href="styling.css">\n' +
    '\n' +
    '</head>\n' +
    '<body>\n' +
    '        <div id="header">\n' +
    '            <p>Header</p>\n' +
    '        </div>\n' +
    '\n' +
    '    <h1>Hello, Jonas!</h1>\n' +
    '    <h2>Test</h2>\n' +
    '    <p>This is a test.</p>\n' +
    '        <div id="footer">\n' +
    '            <p>Footer</p>\n' +
    '        </div>\n' +
    '</body>\n' +
    '</html>';
