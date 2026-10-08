'use strict';

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const root = path.resolve(__dirname, '..');
const directory = path.join(root, 'dist');
fs.mkdirSync(directory, { recursive: true });
const destination = path.join(directory, 'smart-commerce-metadata.zip');
const output = fs.createWriteStream(destination);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function () {
    console.log('Created dist/smart-commerce-metadata.zip (' + archive.pointer() + ' bytes).');
});
output.on('error', function (error) { throw error; });
archive.on('error', function (error) { throw error; });
archive.on('warning', function (error) { throw error; });
archive.pipe(output);
['meta/custom-objecttype-definitions.xml', 'meta/system-objecttype-extensions.xml', 'jobs.xml'].forEach(function (file) {
    archive.file(path.join(root, 'metadata/smart-commerce', file), { name: 'smart-commerce/' + file });
});
archive.finalize();
