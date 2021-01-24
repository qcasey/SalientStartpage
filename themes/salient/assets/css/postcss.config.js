//
// Lifted from https://github.com/dirkolbrich/hugo-theme-tailwindcss-starter/blob/main/assets/css/postcss.config.js
//
const themeDir = __dirname + '/../../';

const purgecss = require('@fullhuman/postcss-purgecss')({

    // Specify the paths to all of the template files in your project
    content: [ './hugo_stats.json' ],

    // This is the function used to extract class names from your templates
    defaultExtractor: content => {
        let els = JSON.parse(content).htmlElements;
        return els.tags.concat(els.classes, els.ids);
    }
})

module.exports = {    
    plugins: [        
        require('postcss-import')({
            path: [themeDir]
            }), 
        require('tailwindcss')(themeDir + 'assets/css/tailwind.config.js'),
        require('autoprefixer')({
            path: [themeDir]
        }),
        ...(process.env.HUGO_ENVIRONMENT === 'production' ? [purgecss] : [])
    ]
}