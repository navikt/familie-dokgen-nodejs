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

export const dir1 = {
    '/templates': {
        'tem1': {
            'tem1.md':
                '<h1>Hei, {{name}}!</h1>\n' +
                '<h2>Test</h2>\n' +
                '<p>Dette er en test.</p>',
            'tem1.json':
                JSON.stringify(schema1)
        },
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
