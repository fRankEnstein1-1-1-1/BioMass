const GeoTIFF = require("geotiff");
const fs = require("fs");

const readGeoTiff = async (filePath) => {



    try {

        const buffer =
            fs.readFileSync(filePath);

        const arrayBuffer =
            buffer.buffer.slice(
                buffer.byteOffset,
                buffer.byteOffset + buffer.byteLength
            );

const tiff =
    await GeoTIFF.fromArrayBuffer(
        arrayBuffer
    );

const image =
    await tiff.getImage();

const boundingBox =
    image.getBoundingBox();

const origin =
    image.getOrigin();

const resolution =
    image.getResolution();

const width =
    image.getWidth();

const height =
    image.getHeight();

        const rasters =
            await image.readRasters();

        const rasterData =
            rasters[0];

        const noDataValue =
            image.getGDALNoData();

        let validPixelCount = 0;
        let noDataPixelCount = 0;

        const sampleValues = [];

        for (
            let i = 0;
            i < rasterData.length;
            i++
        ) {

            const value =
                rasterData[i];

            if (
                value === noDataValue ||
                value === -9999
            ) {

                noDataPixelCount++;

            } else {

                validPixelCount++;

                if (
                    sampleValues.length < 10
                ) {

                    sampleValues.push(
                        value
                    );
                }
            }
        }

        return {

    width,
    height,

    rasterData,

    noDataValue,

    validPixelCount,

    noDataPixelCount,

    sampleValues,

    metadata: {

        samplesPerPixel:
            image.getSamplesPerPixel(),

        tileWidth:
            image.getTileWidth(),

        tileHeight:
            image.getTileHeight(),

        boundingBox,

        origin,

        resolution,

        pixelWidth:
            resolution
                ? Math.abs(resolution[0])
                : null,

        pixelHeight:
            resolution
                ? Math.abs(resolution[1])
                : null
    }
};

    } catch (error) {

        console.error(
            "GeoTIFF Read Error:",
            error
        );

        throw error;
    }
};


const generateCHM = async (
    dsmPath,
    dtmPath
) => {

const dsm =
    await readGeoTiff(dsmPath);

const dtm =
    await readGeoTiff(dtmPath);

console.log("DSM:");
console.log(
    dsm.width,
    dsm.height
);

console.log("DTM:");
console.log(
    dtm.width,
    dtm.height
);

const width =
    Math.min(
        dsm.width,
        dtm.width
    );

const height =
    Math.min(
        dsm.height,
        dtm.height
    );

console.log(
    "Using dimensions:",
    width,
    height
);
const chm = [];

let validPixels = 0;

let minHeight =
    Number.MAX_VALUE;

let maxHeight =
    Number.MIN_VALUE;

let totalHeight = 0;

for (
    let row = 0;
    row < height;
    row++
) {

    for (
        let col = 0;
        col < width;
        col++
    ) {

        const index =
            row * dsm.width + col;

        const dsmValue =
            dsm.rasterData[index];

        const dtmValue =
            dtm.rasterData[index];

        if (
            dsmValue === -9999 ||
            dtmValue === -9999
        ) {

            chm.push(-9999);

            continue;
        }

        const canopyHeight =
            dsmValue - dtmValue;

        chm.push(
            canopyHeight
        );

        validPixels++;

        totalHeight +=
            canopyHeight;

        if (
            canopyHeight < minHeight
        ) {
            minHeight =
                canopyHeight;
        }

        if (
            canopyHeight > maxHeight
        ) {
            maxHeight =
                canopyHeight;
        }
    }
}

    const meanHeight =
        validPixels > 0
            ? totalHeight / validPixels
            : 0;

            console.log("DSM:");
console.log(
    dsm.width,
    dsm.height
);

console.log("DTM:");
console.log(
    dtm.width,
    dtm.height
);

    return {

    width,

    height,

    validPixels,

    minHeight,

    maxHeight,

    meanHeight,

    chm,

    noDataValue: -9999,

    metadata: {

        pixelWidth:
            dsm.metadata.pixelWidth,

        pixelHeight:
            dsm.metadata.pixelHeight,

        resolution:
            dsm.metadata.resolution,

        boundingBox:
            dsm.metadata.boundingBox
    }
};
};

module.exports = {
    readGeoTiff,
    generateCHM
};