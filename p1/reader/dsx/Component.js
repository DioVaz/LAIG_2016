/**
 * Created by ruben on 12/10/2016.
 */

/**
 * Node
 * @constructor
 * @id node id
 */
function Component() {
    this.id;
    this.material = [];
    this.texture;
    this.transformationsRef = [];
    this.localTransformations = mat4.create();
    mat4.identity(this.localTransformations);
    this.componentsRef = [];
    this.primitivesRef = [];
    this.painted = false;
};

Component.prototype = Object.create(Object.prototype);
Component.prototype.constructor = Component;



Component.prototype.setId = function(id) {
    this.id = id;
};

/*
 * Sets the material of the node
 * @param material
 */

Component.prototype.setMaterial = function(material) {
    this.material = material;
};

/*
 * Sets the texture of the node
 * @param texture
 */
Component.prototype.setTexture = function(texture) {
    this.texture = texture;
};

/*
 * Add a new child to the node
 * @param child
 */
Component.prototype.addChild = function(child) {
    this.children.push(child);
};

/*
 * Applies a rotation to the axis x
 * @param rad degrees in radians
 */
Component.prototype.rotateX = function(rad) {
    mat4.rotateX(this.localTransformations, this.localTransformations, rad);
};

/*
 * Applies a rotation to the axis y
 * @param rad degrees in radians
 */
Component.prototype.rotateY = function(rad) {
     mat4.rotateY(this.localTransformations, this.localTransformations, rad);
};

/*
 * Applies a rotation to the axis z
 * @param rad degrees in radians
 */
Component.prototype.rotateZ = function(rad) {
    mat4.rotateZ(this.localTransformations, this.localTransformations, rad);
};

/*
 * Applies a scaling to the node
 * @param sx
 * @param sy
 * @param sz
 */
Component.prototype.scale = function(sx, sy, sz) {
    mat4.scale(this.localTransformations, this.localTransformations, vec3.fromValues(sx,sy,sz));
};

/*
 * Applies a translation to the node
 * @param x
 * @param y
 * @param z
 */
Component.prototype.translate = function(x, y, z) {
    mat4.translate(this.localTransformations, this.localTransformations, vec3.fromValues(x, y, z));
};


Component.prototype.addPrimitiveRef = function (primitiveRef) {
    this.primitivesRef.push(primitiveRef);
};

Component.prototype.addComponentRef = function (componentRef) {
    this.primitivesRef.push(componentRef);
};

Component.prototype.setPrimitivesRefs = function (primitivesRef) {
    this.primitivesRef = primitivesRef;

};

Component.prototype.setComponentsRefs = function (componentsRef) {
    this.componentsRef = componentsRef;

};

Component.prototype.addTransformationsRef = function (id) {
    this.transformationsRef.push(id);

};


Component.prototype.getComponentsRef = function () {
    return this.componentsRef;
};

Component.prototype.getPrimitivesRef = function () {
    return this.primitivesRef;
};

Component.prototype.paint = function () {
    this.isPainted = true;
};

Component.prototype.isPainte = function () {
    return this.painted;
};


