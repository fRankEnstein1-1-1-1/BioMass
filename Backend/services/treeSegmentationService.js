/**
 * Segments individual tree crowns from a Canopy Height Model (CHM) grid
 * using connected-component labeling (flood fill on adjacent above-threshold
 * pixels, 8-connectivity).
 *
 * This turns a single aggregated "canopy blob" into a list of individual
 * trees, each with its own height and crown area — which is what the
 * Jucker et al. (2017) biomass allometry needs as input (it is non-linear,
 * so it must be applied per tree and summed, not on aggregate totals).
 *
 * Note: this is a basic crown-segmentation approach (threshold + connected
 * components). It will under-segment adjacent/touching tree crowns (treats
 * a merged clump of touching canopies as one "tree"). For most canopy
 * cover scenarios this is a reasonable first pass; local-maxima/watershed
 * segmentation is a future improvement if individual crowns are frequently
 * touching (e.g. dense closed-canopy forest).
 */

const DEFAULT_MIN_CROWN_PIXELS = 3;

// Sanity cap: no realistically-surveyed tree should exceed this height.
// The tallest tree ever reliably measured is ~115.7m (a single record
// coast redwood) — 70m comfortably covers virtually all real-world trees
// while rejecting DSM/DTM misalignment artifacts, unmasked structures,
// or reconstruction noise that would otherwise be treated as a "tree."
const DEFAULT_MAX_PLAUSIBLE_HEIGHT = 70;

/**
 * @param {object} chmResult - output of geotiffService.generateCHM
 * @param {number} threshold - minimum height (m) to be considered vegetation
 * @param {number} minCrownPixels - minimum connected pixel count to count
 *        as a tree (filters out single-pixel noise)
 * @param {number} maxPlausibleHeight - crowns with a max height above this
 *        are excluded as likely DSM/DTM artifacts rather than real trees
 * @returns {Array<{ height: number, canopyArea: number, pixelCount: number }>}
 */
const segmentTrees = (
    chmResult,
    threshold = 0.5,
    minCrownPixels = DEFAULT_MIN_CROWN_PIXELS,
    maxPlausibleHeight = DEFAULT_MAX_PLAUSIBLE_HEIGHT
) => {

    const {
        chm,
        width,
        height,
        metadata
    } = chmResult;

    const pixelArea =
        metadata.pixelWidth * metadata.pixelHeight;

    const visited = new Uint8Array(chm.length);

    const trees = [];

    let rejectedAsImplausible = 0;

    // 8-connected neighbor offsets (row, col)
    const neighbors = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {

            const startIndex = row * width + col;

            if (visited[startIndex]) {
                continue;
            }

            const startValue = chm[startIndex];

            if (startValue === -9999 || startValue <= threshold) {
                visited[startIndex] = 1;
                continue;
            }

            // Flood fill this crown (iterative, stack-based — avoids
            // recursion depth issues on large rasters)
            const stack = [[row, col]];
            visited[startIndex] = 1;

            let pixelCount = 0;
            let maxHeight = 0;
            let totalHeight = 0;

            while (stack.length > 0) {

                const [r, c] = stack.pop();
                const index = r * width + c;
                const value = chm[index];

                pixelCount++;
                totalHeight += value;

                if (value > maxHeight) {
                    maxHeight = value;
                }

                for (const [dr, dc] of neighbors) {

                    const nr = r + dr;
                    const nc = c + dc;

                    if (nr < 0 || nr >= height || nc < 0 || nc >= width) {
                        continue;
                    }

                    const nIndex = nr * width + nc;

                    if (visited[nIndex]) {
                        continue;
                    }

                    const nValue = chm[nIndex];

                    visited[nIndex] = 1;

                    if (nValue === -9999 || nValue <= threshold) {
                        continue;
                    }

                    stack.push([nr, nc]);
                }
            }

            if (pixelCount < minCrownPixels) {
                continue;
            }

            if (maxHeight > maxPlausibleHeight) {
                // Likely DSM/DTM noise, misalignment, or an unmasked
                // structure rather than a real tree — skip it rather
                // than letting it dominate the biomass total.
                rejectedAsImplausible++;
                continue;
            }

            const canopyArea = pixelCount * pixelArea;

            // Use max height within the crown as the tree height proxy —
            // the CHM peak within a crown footprint approximates the
            // treetop, which is what Jucker's H term expects.
            trees.push({
                height: maxHeight,
                canopyArea,
                pixelCount
            });
        }
    }

    if (rejectedAsImplausible > 0) {
        console.warn(
            `segmentTrees: rejected ${rejectedAsImplausible} crown(s) exceeding ${maxPlausibleHeight}m as likely DSM/DTM noise rather than real trees`
        );
    }

    return trees;
};

module.exports = {
    segmentTrees
};
