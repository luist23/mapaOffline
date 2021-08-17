const Fs = require('fs');
const axios = require('axios');
const Path = require('path')
var mkdirp = require('mkdirp');
const shell = require('shelljs')

var download = async (uri,dir, filename, callback) => {
    console.log("in download", uri);
    shell.mkdir('-p',dir)
    const path = Path.resolve(dir, filename)
    const writer = Fs.createWriteStream(path)

    const response = await axios({
        method: 'GET',
        url: uri,
        headers: {
            'User-Agent': 'Chromium/91.0.4'
        },
        responseType: 'stream'
    })

    response.data.pipe(writer)

    /*return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })*/

};

module.exports = {
    download
};