    const bufferSize = 16 * 1024
    const filesDir = __dirname + '\\'
    var total = 0
    var listPoints = new Array
    const mLimit = 12
    const nLimit = 19
    const round = 0.05
    var progress = 0
    var data = null
    var fallas = 0
    var exception = null

    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    async function doWork() {
        console.log("in doWork init");
        defineFullMap()
        console.log("mapa definido")
        progress = 0
        var flagList = 0
        for (k=12; 12<=19; k++) {
            for (i=listPoints[flagList].x; i <= listPoints[flagList + 1].x; i++) {
                var divide = listPoints[flagList + 1].y - listPoints[flagList].y
                divide /= 20
                divide = Math.trunc(divide)
                if (divide == 0){
                    divide = 1
                }
                var initialvalue =  listPoints[flagList].y
                var corrutines = new Array
                //await downloadPart(i, k, initialvalue, initialvalue + divide)
                while (initialvalue < listPoints[flagList + 1].y){
                    corrutines.push(downloadPart(i, k, initialvalue, initialvalue + divide))
                        //progress += await 
                        console.log("progreso", progress);
                    initialvalue += divide
                    if (exception != null){
                        console.log("descarga mapa","fallo por inter")
                        return Result.failure()
                    }
                }
                await corrutines[0]
                if (exception != null){
                    console.log("descarga mapa","fallo por inter")
                    return Result.failure()
                }
            }
            flagList += 2
            if (exception != null){
                return Result.failure()
            }
        }

        return Result.success()
    }

    async function downloadPart(i, k, a, b) {
        var flag = 0;
        for (j=a; a<=b; a++) {
            let exceptione = await downloadTileImage(i, j, k);
            sleep(1000)
            if (exceptione != null) {
                exception = exceptione
                console.log("descarga mapa","fallo por inter")
                break
            }
            flag++
        }
        return flag
    }

    function defineFullMap(){
        var latTemp = null
        var longTemp = null
        var flag = 0
        for (i=mLimit; i <= nLimit; i++) {
            latTemp = 14.4179
            longTemp = -90.1397
            listPoints.push(new Point(getXm(longTemp, i), getYm(latTemp, i)))
            latTemp = 13.14
            longTemp = -87.7112
            listPoints.push(new Point(getXm(longTemp, i), getYm(latTemp, i)))
            //console.log("listpoint",listPoints);
            total +=
                (listPoints[flag].x - listPoints[flag + 1].x) * (listPoints[flag].y - listPoints[flag + 1].y)
            flag += 2
        }
    }

    function getXm(longitude, i) {
        return (Math.floor((longitude + 180) / 360 * (2**i)))
    }

    function getYm(latitude, i) {
        return Math.floor(
            (1 - Math.log(
                ((latitude)*Math.PI/180)
                        + (1 / Math.cos((latitude*Math.PI/180)))
            ) / Math.PI
                    ) * (2**(i - 1))
        )
    }

    const imagenDownload = require('./imagenDownload').download

    const fs = require('fs');

    async function downloadTileImage(x, y, zoom) {
        console.log("donwload tile", `progreso: ${progress}, fallas: ${fallas}, total: ${total}`)
        //let name = getTileFileDir(x, zoom) + `${y}.png`
        //console.log("nombre de archivo", name);
        try {
            console.log("prede-verifique file")
            try {
                if (fs.accessSync(getTileFileDir, `${y}.png`)) {
                    console.log(`${urls} Tile Exist!!`);
                    return null
                }
            } catch (error) {
                let urls =`https://a.tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
                console.log("pre download")
                await imagenDownload(urls, getTileFileDir(x, zoom), `${y}.png`, ()=>{
                    console.log(`${urls} Tile download!!`);
                })
                sleep(1000)
            }
        } catch (e) {
            console.log("tileP", "outmemory", e)
            e.printStackTrace()
        }
        return null
    }

    function getTileFileDir(x, zoom) {
        return `${filesDir}map\\${zoom}\\${x}\\`
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    module.exports = {
        doWork
    };