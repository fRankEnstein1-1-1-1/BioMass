const analyzeCanopyArea = (
    chmResult,
    threshold = 0.5
) => {

    const {
        chm,
        validPixels,
        metadata
    } = chmResult;

    let vegetationPixels = 0;

    let totalVegetationHeight = 0;

    let maxVegetationHeight = 0;

    for (
        let i = 0;
        i < chm.length;
        i++
    ) {

        const value =
            chm[i];

        if (
            value === -9999
        ) {
            continue;
        }

        if (
            value > threshold
        ) {

            vegetationPixels++;

            totalVegetationHeight +=
                value;

            if (
                value >
                maxVegetationHeight
            ) {

                maxVegetationHeight =
                    value;
            }
        }
    }

    const pixelArea =
        metadata.pixelWidth *
        metadata.pixelHeight;

    const canopyArea =
        vegetationPixels *
        pixelArea;

    const canopyPercentage =
        (
            vegetationPixels /
            validPixels
        ) * 100;

    const meanVegetationHeight =
        vegetationPixels > 0
            ? totalVegetationHeight /
              vegetationPixels
            : 0;

    return {

        vegetationPixels,

        pixelArea,

        canopyArea,

        canopyPercentage,

        meanVegetationHeight,

        maxVegetationHeight
    };
};

module.exports = {
    analyzeCanopyArea
};