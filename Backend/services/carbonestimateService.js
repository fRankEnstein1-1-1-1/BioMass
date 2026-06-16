const estimateCarbon = (
    biomass
) => {

    const carbonFraction =
        0.47;

    const carbonEstimate =
        biomass *
        carbonFraction;

    return {

        carbonEstimate,

        carbonFraction
    };
};

module.exports = {
    estimateCarbon
};