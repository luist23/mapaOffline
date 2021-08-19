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
var descargando = 0;
var existencia = 0;
var listPoints = [];
const mLimit = 16
const nLimit = 16
let progress = 0
let fallas = 0
let punto = new DepartmentMap(-90.0, 14.0, "libertad")
const limite = 0.01

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

async function doWork() {
    console.log("punto", punto)
    defineFullMap()
    console.log("to preocess");
    console.log("poinst", listPoints)
    console.log("total", total)
    await processMap()
}

async function copyMaps(){
    let list = new Array
    list.push(new DepartmentMap(-90.0, 14.0, "libertad"))
    list.push(new DepartmentMap(-90.0, 14.0, "sanSalvador"))
    list.forEach((e)=>{
        punto = e;
        doWork();
    })

}

async function processMap(){
    var flagList = 0
    for (k = nLimit; k <= mLimit; k++) {
        for (i = listPoints[flagList].x; i <= listPoints[flagList + 1].x; i++) {
            var divide = listPoints[flagList + 1].y - listPoints[flagList].y
            divide /= 10
            divide = Math.trunc(divide)
            if (divide === 0) {
                divide = 1
            }
            var initialvalue = listPoints[flagList].y
            while (initialvalue < listPoints[flagList + 1].y) {
                if(initialvalue + divide > listPoints[flagList + 1].y){
                    await downloadPart(i, k, initialvalue, listPoints[flagList + 1].y);
                } else {
                    await downloadPart(i, k, initialvalue, initialvalue + divide);
                }
                //progress ++
                initialvalue += divide
            }

        }
        flagList += 2
    }
}

async function downloadPart(i, k, a, b) {
    var flag = 0;
    const totalint = b-a
    for (j = a; j <= b; j++) {
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
    for (i = mLimit; i <= nLimit; i++) {
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
    console.log("mapa definido")
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
            //console.log(`Cache hit: ${getTileFileDir2(x, zoom) + `${y}.png`}`);
            existencia++;
            await imagenDownload(getTileFileNewDir(x,zoom),getTileFileDir(x,zoom),`${y}.png`)
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
    return `zonas/${punto.departamento}/map/${zoom}/${x}/`
}

module.exports = { doWork, copyMaps };