const imagenDownload = require('./imagenDownload').download
const fs = require('fs');
const filesDir = __dirname + '\\'
let total = 0
var descargando = 0;
var existencia = 0
var listPoints = new Array
const mLimit = 15
const nLimit = 15
let progress = 0
let fallas = 0

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

async function doWork() {
    defineFullMap()
    console.log("to preocess");
    console.log("poinst", listPoints)
    console.log("total", total)
    processMap()
    
}

async function processMap(){
    var flagList = 0
    //var flagForOne = 0
    //var flagForTwo = 0
    for (k = nLimit; k <= mLimit; k++) {
        for (i = listPoints[flagList].x; i <= listPoints[flagList + 1].x; i++) {
            //flagForOne++;
            var divide = listPoints[flagList + 1].y - listPoints[flagList].y
            divide /= 10
            divide = Math.trunc(divide)
            if (divide == 0) {
                divide = 1
            }
            var initialvalue = listPoints[flagList].y
            //var threads = new Array
            while (initialvalue < listPoints[flagList + 1].y) {
                await downloadPart(i, k, initialvalue, initialvalue + divide);
                //flagForTwo += divide;
                //await downloadPart(i, k, initialvalue, initialvalue + divide);
                //progress ++
                initialvalue += divide
            } 
            /*if (threads.length > 3){
                await threads[threads.length - 2]
            } else {
                await threads[0]
            }*/
            
        }
        flagList += 2
    }
    console.log("FINISH");
    //console.log("for one", flagForOne)
    //console.log("for two", flagForTwo)
}

async function downloadPart(i, k, a, b) {
    var flag = 0;
    const totalint = b-a
    for (j = a; j <= b; j++) {
        let exceptione = await downloadTileImage(i, j, k);
        if (exceptione != null) {
            fallas++;
            break
        }
        flag++
        console.log(`de ${a} a ${b}.  ${flag}/${totalint}. fallas ${fallas}. progreso ${progress}/${total}, existen: ${existencia}, , descarga ${descargando}`)
    }
    progress += flag
}

function defineFullMap() {
    var latTemp = null
    var longTemp = null
    var flag = 0
    for (i = mLimit; i <= nLimit; i++) {
        latTemp = 14.4179
        longTemp = -90.1397
        listPoints.push(new Point(getXm(longTemp, i), getYm(latTemp, i)))
        latTemp = 13.14
        longTemp = -87.7112
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
        } else {
            descargando++;
            let urls = `https://a.tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
            await imagenDownload(urls, getTileFileDir(x, zoom), `${y}.png`, () => {
                console.log(`Tile download: ${urls}`);
            })
        }
        return null;
    } catch (e) {
        return e
    }
}

function getTileFileDir(x, zoom) {
    return `${filesDir}map\\${zoom}\\${x}\\`
}

function getTileFileDir2(x, zoom) {
    return `/map/${zoom}/${x}/`
}

module.exports = { doWork };