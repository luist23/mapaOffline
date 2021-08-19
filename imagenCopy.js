const Fs = require('fs');
const Path = require('path')
const shell = require('shelljs')

var download = async (toDir,dir, filename) => {
    //console.log("in download", uri);
    shell.mkdir('-p',toDir)
    const path = Path.resolve(dir, filename)
    const toPath = Path.resolve(toDir, filename)
    const writer = Fs.createWriteStream(toPath)
    const read = Fs.createReadStream(path)

    read.addListener("data", (data)=>{
        writer.write(data)
    })

    read.addListener("close", ()=>{
        writer.close()
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