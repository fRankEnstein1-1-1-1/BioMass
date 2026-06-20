const JUCKER_COEFFICIENTS = {
    gymnosperm: { a: 0.093, b: -0.223 },
    angiosperm: { a: 0, b: 0 }
};

const BIAS_CORRECTION = Math.exp((0.204 ** 2) / 2); // ≈ 1.0210


/**
 * Estimate aboveground biomass (AGB) for a single tree using
 * Jucker et al. (2017) height + crown diameter allometry.
 *
 * Reference: T. Jucker et al., "Allometric equations for integrating
 * remote sensing imagery into forest monitoring programmes",
 * Global Change Biology, 23(1), pp. 177-190, 2017.
 *
 * @param {number} height - tree height in meters
 * @param {number} crownDiameter - crown diameter in meters
 * @param {'gymnosperm'|'angiosperm'} speciesGroup - defaults to angiosperm
 *        when species is unknown (reasonable default for mixed/broadleaf canopy)
 * @returns {number} AGB in kilograms
 */
const estimateTreeBiomass = (
    height,
    crownDiameter,
    speciesGroup = "angiosperm"
) => {

    const {
        a,
        b
    } = JUCKER_COEFFICIENTS[speciesGroup];

    const coefficient =
        0.016 + a;

    const exponent =
        2.013 + b;

    const agbKg =
        coefficient *
        Math.pow(height * crownDiameter, exponent) *
        BIAS_CORRECTION;

    return agbKg;
};


/**
 * Estimate total biomass across all segmented trees.
 *
 * Expects per-tree data (height + canopy area) — see
 * treeSegmentationService.segmentTrees for how to produce this from
 * a CHM. The allometric equation is non-linear, so it must be applied
 * per tree and summed, not on aggregated mean height / total canopy area.
 *
 * @param {Array<{height: number, canopyArea: number, speciesGroup?: string}>} trees
 * @returns {{
 *   biomassEstimate: number,   // total biomass in tons (kept as the key
 *                               // name carbonestimateService.js expects)
 *   totalBiomassKg: number,
 *   treeCount: number
 * }}
 */
const estimateBiomass = (
    trees
) => {

    let totalBiomassKg = 0;

    trees.forEach(({
        height,
        canopyArea,
        speciesGroup = "angiosperm"
    }) => {

        const crownDiameter =
            2 * Math.sqrt(canopyArea / Math.PI);

        totalBiomassKg +=
            estimateTreeBiomass(
                height,
                crownDiameter,
                speciesGroup
            );
    });

    const biomassEstimate =
        totalBiomassKg / 1000;

    return {

        biomassEstimate,

        totalBiomassKg,

        treeCount: trees.length
    };
};


module.exports = {
    estimateTreeBiomass,
    estimateBiomass
};
