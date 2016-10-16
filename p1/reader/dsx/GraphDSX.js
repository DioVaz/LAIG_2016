/**
 * Created by ruben on 12/10/2016.
 */

function GraphDSX()
{
    this.views = [];
    this.defaultView;
    //this.illumination = new Illumination();
    this.omnis = [];
    this.spots = [];
    this.textures = [];
    this.materials = [];
    this.transformations = [];
    this.primitives = [];
    this.components = [];

};

GraphDSX.prototype.addView = function(angle, near, far, from, to, id) {
    this.views[id] = new CGFcamera(angle,near,far,from,to);

};


GraphDSX.prototype.getView = function(indice) {
    if(this.views.length >= indice)
        return 0
    else
    return this.views[indice];
};


GraphDSX.prototype.addOmni = function(scene, id, location, ambient, diffuse, specular, enable) {
    var omni = new CGFlight(scene,id);
    omni.id=id;
    omni.setPosition(location);
    omni.setAmbient(ambient);
    omni.setDiffuse(diffuse);
    omni.setSpecular(specular);
    enable ? omni.enable() : omni.disable();
    this.omnis.push(omni);
};


GraphDSX.prototype.getOmni = function(indice) {
    if(this.omnis.length >= indice)
        return 0
    else
        return this.omnis[indice];
};

GraphDSX.prototype.addSpot= function(scene, id, location, ambient, diffuse, specular, enable, expoente, angle, target) {
    var spot = new CGFlight(scene,id);
    spot.id=id;
    spot.setSpotExponent(expoente);
    spot.setSpotCutOff(angle);
    spot.setSpotDirection(target);
    spot.setPosition(location);
    spot.setAmbient(ambient);
    spot.setDiffuse(diffuse);
    spot.setSpecular(specular);
    enable ? spot.enable() : spot.disable();
    this.spots.push(spot);

};

GraphDSX.prototype.getSpot = function(indice) {
    if(this.spots.length >= indice)
        return 0
    else
        return this.spots[indice];
};

GraphDSX.prototype.addTransformations = function(transformation)
{
    this.transformations.push(transformation);
}
