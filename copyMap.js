const imagenDownload = require('./imagenCopy').download

class DepartmentMap {
  constructor(x, y, departamento) {
    this.x = x;
    this.y = y;
    this.departamento = departamento;
  }
}

const fs = require('fs');
const filesDir = __dirname + '/'
let total = 0
let descargando = 0;
let existencia = 0;
let listPoints = [];
const mLimit = 18;
const nLimit = 15;
let progress = 0
let fallas = 0
let punto;
const limite = 0.05

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

async function doWork() {
  console.log("punto", punto);
  defineFullMap();
  console.log("poinst", listPoints);
  console.log("total", total);
  await processMap();
}

async function copyMaps() {
  let list = [];
  list.push(new DepartmentMap(-89.279274, 13.676027, "santaTecla"));
  // list.push(new DepartmentMap(-89.203484, 13.699763, "sanSalvador"));
  // list.push(new DepartmentMap(-89.125745, 13.705742, "soyapango"));
  // list.push(new DepartmentMap(-89.178365, 13.801453, "apopa"));
  // list.push(new DepartmentMap(-89.125745, 13.705742, "soyapango"));
  // list.push(new DepartmentMap(-89.376742, 13.728885, "lourdes"));
  for (const e of list) {
    punto = e;
    await doWork();
  }
}

async function processMap() {
  let flagList = 0;
  for (let k = nLimit; k <= mLimit; k++) {
    for (let i = listPoints[flagList].x; i <= listPoints[flagList + 1].x; i++) {
      let divide = listPoints[flagList + 1].y - listPoints[flagList].y;
      divide /= 10;
      divide = Math.trunc(divide);
      if (divide === 0) {
        divide = 1
      }
      let initialvalue = listPoints[flagList].y;
      while (initialvalue < listPoints[flagList + 1].y) {
        if (initialvalue + divide > listPoints[flagList + 1].y) {
          await downloadPart(i, k, initialvalue, listPoints[flagList + 1].y);
        } else {
          await downloadPart(i, k, initialvalue, initialvalue + divide);
        }
        initialvalue += divide
      }
    }
    flagList += 2;
  }
}

async function downloadPart(i, k, a, b) {
  let flag = 0;
  const totalint = b - a
  for (let j = a; j <= b; j++) {
    let exceptione = await downloadTileImage(i, j, k);
    if (exceptione != null) {
      fallas++;
      break;
    }
    flag++
    console.log(`zoom ${nLimit}  ${flag}/${totalint}. copiados ${fallas}. progreso ${progress}/${total}, existen: ${existencia}, no existen ${descargando}`)
  }
  progress += flag
}

function defineFullMap() {
  var latTemp = null
  var longTemp = null
  var flag = 0
  for (let i = nLimit; i <= mLimit; i++) {
    latTemp = punto.y + limite
    longTemp = punto.x - limite // -88.1397//-89.1397 //-90.1397//
    listPoints.push(new Point(getXm(longTemp, i), getYm(latTemp, i)))
    latTemp = punto.y - limite
    longTemp = punto.x + limite//-88.1397//-87.7112
    listPoints.push(new Point(getXm(longTemp, i), getYm(latTemp, i)))
    total +=
      (listPoints[flag].x - listPoints[flag + 1].x) * (listPoints[flag].y - listPoints[flag + 1].y)
    flag += 2
  }
  console.log("mapa definido");
}

function getXm(longitude, i) {
  return (Math.floor((longitude + 180) / 360 * (2 ** i)))
}

function getYm(latitude, i) {
  return Math.floor(
    (1 - Math.log(
        ((latitude) * Math.PI / 180)
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
      await imagenDownload(getTileFileNewDir(x, zoom), getTileFileDir(x, zoom), `${y}.png`)
    }
    descargando++
    return null;
  } catch (e) {
    return e
  }
}

function getTileFileDir(x, zoom) {
  return `${filesDir}map/${zoom}/${x}/`
}

function getTileFileNewDir(x, zoom) {
  return `${filesDir}zonas/${punto.departamento}/map/${zoom}/${x}/`
}

module.exports = {doWork, copyMaps};