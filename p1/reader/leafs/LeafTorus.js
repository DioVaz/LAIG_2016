/**
 * LeafCylinder
 * @constructor
 * @param id of cylinder
 * @param h height of the cylinder
 * @param bottomR radius of bottom
 * @param topR radius of top
 * @param sections number of sections
 * @param parts number of parts
 */
function LeafTorus(id, inner, outer, slices, loops) {
    Leaf.call(this, id, "torus");
    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.loops = loops;
}

LeafCylinder.prototype = Object.create(Leaf.prototype);
LeafCylinder.prototype.constructor = LeafCylinder;
