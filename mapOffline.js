const imagenDownload = require('./imagenDownload').download
const fs = require('fs');
const filesDir = __dirname + '/'
let total = 0
var descargando = 0;
var existencia = 0;
var listPoints = [];
const mLimit = 16;
const nLimit = mLimit;
let progress = 0
let fallas = 0

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

async function doWork() {
  defineFullMap(-90.1397, -87.7112, 13.14, 14.4179);
  console.log("to preocess");
  console.log("poinst", listPoints)
  console.log("total", total)
  await processMap()
}

async function processMap() {
  let flagList = 0
  for (k = nLimit; k <= mLimit; k++) {
    for (i = listPoints[flagList].x; i <= listPoints[flagList + 1].x; i++) {
      await downloadPart(i, k, listPoints[flagList].y, listPoints[flagList + 1].y);
    }
    flagList += 2;
  }
}

async function downloadPart(i, k, a, b) {
  //let flag = 0;
  //const totalint = b - a
  for (j = a; j <= b; j++) {
    let exceptione = await downloadTileImage(i, j, k);
    if (exceptione != null) {
      fallas++;
      //break;
    }
    progress++
    console.log(`zoom ${nLimit} fallas ${fallas}. progreso ${progress}/${total}, existen: ${existencia}, descarga ${descargando}`)
  }
  //progress += flag
}

function defineFullMap(xmin, xmax, ymin, ymax) {
  let latTemp = null;
  let longTemp = null;
  let flag = 0;
  for (i = mLimit; i <= nLimit; i++) {
    latTemp = ymax;
    longTemp = xmin
    listPoints.push(new Point(getXm(longTemp, i), getYm(latTemp, i)))
    latTemp = ymin;
    longTemp = xmax;
    listPoints.push(new Point(getXm(longTemp, i), getYm(latTemp, i)))
    total +=
      (listPoints[flag].x - listPoints[flag + 1].x) * (listPoints[flag].y - listPoints[flag + 1].y)
    flag += 2
  }
  console.log("mapa definido")
}

function getXm(longitude, i) {
  return (Math.floor((longitude + 180) / 360 * (2 ** i)))
}

function getYm(latitude, i) {
  return Math.floor(
    (1 - Math.log(
        Math.tan((latitude) * Math.PI / 180)
        + (1 / Math.cos((latitude * Math.PI / 180)))
      ) / Math.PI
    ) * (2 ** (i - 1))
  )
}

async function downloadTileImage(x, y, zoom) {
  let name = getTileFileDir(x, zoom) + `${y}.png`
  try {
    if (fs.existsSync(name) && fs.readFileSync.length > 0) {
      existencia++;
    } else {
      descargando++;
      let urls = `https://a.tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
      await imagenDownload(urls, getTileFileDir(x, zoom), `${y}.png`)
    }
    return null;
  } catch (e) {
    return e
  }
}

function getTileFileDir(x, zoom) {
  return `${filesDir}map/${zoom}/${x}/`
}

module.exports = {doWork};