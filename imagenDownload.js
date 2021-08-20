const Fs = require('fs');
const axios = require('axios');
const Path = require('path')
const shell = require('shelljs')

const download = async (uri, dir, filename) => {
  shell.mkdir('-p', dir)
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
};

module.exports = {
    download
};