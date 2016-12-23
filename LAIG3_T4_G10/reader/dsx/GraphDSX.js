/**
 * Para guardar dados retirados do dsx.
 */

function GraphDSX()
{
    this.views = [];
    this.defaultView;
    this.omnis = [];
    this.spots = [];
    this.textures = [];
    this.materials = [];
    this.transformations = [];
    this.primitives = [];
    this.components = [];
    this.viewsID = [];
    this.animations = [];
    this.splayBoard;
    this.whiteCheckers = [];
    this.blackCheckers = [];
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
        return 0;
    else
        return this.spots[indice];
};

GraphDSX.prototype.addTransformations = function(transformation)
{
    this.transformations.push(transformation);
}

GraphDSX.prototype.addNewCheckers = function(scene, appW, appB){
  var idW = 0;
  var idB = 0;
  //por colunas
  for(var i = 1; i<7 ;i++){
    //whiteCheckers
    var Wchecker1 = new MyChecker (scene, appW, 0, 1, i, 0);
    var Wchecker2 = new MyChecker (scene, appW, 0, 1, i, 1);
    var Wchecker3 = new MyChecker (scene, appW, 0, 2, i, 0);
    this.whiteCheckers[idW] = Wchecker1; idW++;
    this.whiteCheckers[idW] = Wchecker2; idW++;
    this.whiteCheckers[idW] = Wchecker3; idW++;

    //whiteCheckers
    var Bchecker1 = new MyChecker (scene, appB, 1, 6, i, 0);
    var Bchecker2 = new MyChecker (scene, appB, 1, 6, i, 1);
    var Bchecker3 = new MyChecker (scene, appB, 1, 5, i, 0);
    this.blackCheckers[idB] = Bchecker1; idB++;
    this.blackCheckers[idB] = Bchecker2; idB++;
    this.blackCheckers[idB] = Bchecker3; idB++;
  }
}
