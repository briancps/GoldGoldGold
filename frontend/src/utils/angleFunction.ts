/* 
Note that in the actual usage of the function, the landmark
object (ie. "point") will have an x-coord, y-coord, z-coord, and visibility.
We only need the x-coord and y-coord to calculate the angle.
We will use vectors to do so.
*/
export function calculateAngle(
    pointA: {x: number; y: number},
    pointB: {x: number; y: number},  // pointB is where we want the angle subtended at to be calculated (i.e. the joint)
    pointC: {x: number; y: number}
): number { // returns the angle in degrees, a number
    const vectorBA = {x: pointA.x - pointB.x, y: pointA.y - pointB.y};
    const vectorBC = {x: pointC.x - pointB.x, y: pointC.y - pointB.y};
    const BAdotProductBC = vectorBA.x * vectorBC.x + vectorBA.y * vectorBC.y;
    const magnitudeBA = Math.sqrt(vectorBA.x ** 2 + vectorBA.y ** 2);
    const magnitudeBC = Math.sqrt(vectorBC.x ** 2 + vectorBC.y ** 2);
    // avoid divide-by-zero
    if (magnitudeBA === 0 || magnitudeBC === 0) { // triple equals === for strict equality
        throw new Error("Cannot calculate angle with zero-length vector");
    }
    const cosTheta = BAdotProductBC / (magnitudeBA * magnitudeBC); // using vector formula: cosTheta = [(a dot b) / |a||b|]
    // floating point errors can push the value slightly outside [-1, 1], which will result in Math.acos to return NaN (Not a Number).
    // hence, we do the following, called clamping, to restrict the value to be [-1, 1].
    const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta));
    const angleInRadians = Math.acos(clampedCosTheta);
    return angleInRadians * (180 / Math.PI);  // pi radians = 180 degrees
}