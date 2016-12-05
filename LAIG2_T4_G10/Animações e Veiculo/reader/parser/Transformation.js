/**
 * Tranformation
 */

function Transformation() {
    this.id;
    this.localTransformations = mat4.create();
    mat4.identity(this.localTransformations);
}

Transformation.prototype.reset= function () {
    mat4.identity(this.localTransformations);
}

/*
 * Applies a rotation to the axis x
 * @param rad degrees in radians
 */
Transformation.prototype.rotateX = function(rad) {
    mat4.rotateX(this.localTransformations, this.localTransformations, rad);
}

/*
 * Applies a rotation to the axis y
 * @param rad degrees in radians
 */
Transformation.prototype.rotateY = function(rad) {
    mat4.rotateY(this.localTransformations, this.localTransformations, rad);
}

/*
 * Applies a rotation to the axis z
 * @param rad degrees in radians
 */
Transformation.prototype.rotateZ = function(rad) {
    mat4.rotateZ(this.localTransformations, this.localTransformations, rad);
}

/*
 * Applies a scaling to the node
 * @param sx
 * @param sy
 * @param sz
 */
Transformation.prototype.scale = function(sx, sy, sz) {
    mat4.scale(this.localTransformations, this.localTransformations, vec3.fromValues(sx,sy,sz));
}

/*
 * Applies a translation to the node
 * @param x
 * @param y
 * @param z
 */
Transformation.prototype.translate = function(x, y, z) {
    mat4.translate(this.localTransformations, this.localTransformations, vec3.fromValues(x, y, z));
}