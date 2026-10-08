'use strict';

const path = require('path');
const webpack = require('webpack');

const cartridge = path.resolve(__dirname, '../cartridges/plugin_smartcommerce/cartridge');

// The storefront provides jQuery globally; this bundle contains only the Smart Commerce behavior.
const compiler = webpack({
    mode: 'production',
    entry: path.join(cartridge, 'client/default/js/smart-commerce.js'),
    output: { path: path.join(cartridge, 'static/default/js'), filename: 'smart-commerce.js' }
});

compiler.run(function (error, stats) {
    compiler.close(function (closeError) {
        if (error || closeError || stats.hasErrors()) {
            console.error(error || closeError || stats.toString({ all: false, errors: true }));
            process.exitCode = 1;
            return;
        }
        console.log('Built smart-commerce.js in cartridge/static/default/js.');
    });
});
