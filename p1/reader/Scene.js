/**
 * Scene
 * @constructor
 */
function Scene() {
    this.frustum = {near: 0, far: 0};

    this.localTransformations = mat4.create();
    mat4.identity(this.localTransformations);
    
    this.referenceLength = 0;
};

Scene.prototype = Object.create(Object.prototype);
Scene.prototype.constructor = Scene;
