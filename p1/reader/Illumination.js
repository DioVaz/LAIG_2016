/**
 * Illumination
 * @constructor
 */
function Illumination() {
    this.doublesided = null;
    this.local = null;
    this.ambient = [0, 0, 0, 0];
    this.background = [0, 0, 0, 0];
}

Illumination.prototype = Object.create(Object.prototype);
Illumination.prototype.constructor = Illumination;
