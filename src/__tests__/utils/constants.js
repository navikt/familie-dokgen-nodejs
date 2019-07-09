export const dir1 = {
    '/templates': {
        'tem1': {
            'tem1.md':
                '<h1 id="heiname">Hei, {{name}}!</h1>\n' +
                '<h2 id="test">Test</h2>\n' +
                '<p>Dette er en test.</p>',
            'tem1.json':
                JSON.stringify({'name': 'string'})
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
