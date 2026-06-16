const estimateBiomass = (
    canopyArea,
    meanHeight
) => {

    
    const biomassFactor =
        0.15;

    const biomassEstimate =
        canopyArea *
        meanHeight *
        biomassFactor;

    return {

        biomassEstimate,

        biomassFactor
    };
};

module.exports = {
    estimateBiomass
};