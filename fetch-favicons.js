const fs = require('fs');
const http = require('http');
const https = require('https');
const yaml = require('js-yaml')
const getWebsiteFavicons = require('get-website-favicon')
var Favicon = require('node-get-favicon')

// IF changed, this should be changed in themes/salient/layouts/partials/standard.html
const FAVICON_DIR = "./assets/favicons/";

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

var favicon = new Favicon({
    verboseMode: false
})

/**
 * Downloads file from remote HTTP[S] host and puts its contents to the
 * specified location.
 */
async function download(url, filePath) {
    const proto = !url.charAt(4).localeCompare('s') ? https : http;

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        let fileInfo = null;

        const request = proto.get(url, response => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }

            fileInfo = {
                mime: response.headers['content-type'],
                size: parseInt(response.headers['content-length'], 10),
            };

            response.pipe(file);
        });

        // The destination stream is ended by the time it's called
        file.on('finish', () => resolve(fileInfo));

        request.on('error', err => {
            fs.unlink(filePath, () => reject(err));
        });

        file.on('error', err => {
            fs.unlink(filePath, () => reject(err));
        });

        request.end();
    });
}

try {
    const doc = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));

    if (!doc.params.standard) return;

    if (!fs.existsSync(FAVICON_DIR)) {
        fs.mkdirSync(FAVICON_DIR, { recursive: true }, (err) => {
            if (err) throw err;
        });
    }

    doc.params.standard.forEach(column => {
        if (!column.items) return;

        column.items.forEach(item => {
            try {
                const url = new URL(item.url);

                getWebsiteFavicons(item.url).then(data => {
                    if (data.icons.length) {
                        const itemURL = new URL(data.icons[0].src);
                        download(data.icons[0].src, FAVICON_DIR + item.name + "." + itemURL.pathname.split('.').pop()).then(function (response) {
                            console.log('✅ Downloaded favicon for ' + item.name)
                        }).catch(e => {
                            console.log('🛑 Could not download icon for '+ item.name +". You should define a font-awesome icon or logo manually in config.yaml");
                        });
                    } else {
                        favicon.getFavicon(url.origin)
                            .then(function (data) {
                                const itemURL = new URL(data.data);
                                download(data.data, FAVICON_DIR + item.name + "." + itemURL.pathname.split('.').pop()).then(function (response) {
                                    console.log('✅ Downloaded favicon (alt) for ' + item.name)
                                }).catch(e => {
                                    console.log('🛑 Could not find icon for '+ item.name +". You should define a font-awesome icon or logo manually in config.yaml");
                                });
                            })
                    }
                }).catch(e => {
                    console.log(e)
                    return
                })
            } catch (e) {
                console.log(e);
            }
        })
    });
} catch (e) {
    console.log(e);
}
