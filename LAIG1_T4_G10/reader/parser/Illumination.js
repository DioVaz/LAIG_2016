/**
 * Created by ruben on 27/09/2016.
 */

function Illumination() {
    this.ambient = [0, 0, 0, 1];
    this.background = [0, 0, 0, 1];
}

Illumination.prototype = Object.create(Object.prototype);
Illumination.prototype.constructor = Illumination;