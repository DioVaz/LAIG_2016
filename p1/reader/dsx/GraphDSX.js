/**
 * Para guardar dados retirados do dsx.
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

    this.views[id] = new CGFcamera(angle,near,far,vec3.fromValues(from[0],from[1],from[2]),vec3.fromValues(to[0],to[1],to[2]));

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
    omni.setPosition(location[0],location[1],location[2],location[3]);
    omni.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
    omni.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
    omni.setSpecular(specular[0],specular[1],specular[2],specular[3]);
   // console.log(specular);
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
    spot.setPosition(location[0],location[1],location[2],location[3]);
    spot.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
    spot.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
    spot.setSpecular(specular[0],specular[1],specular[2],specular[3]);
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
