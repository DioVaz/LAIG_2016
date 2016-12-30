/*
 * DSXScene extends CFGscene
 * @constructor
 * @param application CFGapplication
 */
function DSXScene(application) {
    CGFscene.call(this);
};

DSXScene.prototype = Object.create(CGFscene.prototype);
DSXScene.prototype.constructor = DSXScene;

/*
 * Initializes content of scene
 * @param application CFGapplication
 */
DSXScene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.myinterface = null;


    this.initCameras(); //Set default configuration of camera view

	this.allLights = 'All'; //ID To control all lights
  this.lightsEnabled = []; //Control every single light

	this.primitives = [];
	this.textures = [];
	this.primitives  = [];
	this.materials;


	this.actualTexture = null;
	this.actualMaterial = null;


    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.gl.enable(this.gl.BLEND);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	this.setGlobalAmbientLight(1,1,1,1);

    this.enableTextures(true);

    this.timer = 0;
    this.setUpdatePeriod(100/6);

    //splay related
    this.setPickEnabled(true);
    this.gameOn = true;
    this.playerToMove = 0; //white = 0; black = 1
    this.playMode = 0; //move = 0 or splay = 1, change on interface
    this.playModes = [];
    this.whiteCaptures = [];
    this.blackCaptures = [];

    //click related
    this.x1;
    this.z1;
    this.x2;
    this.z2;
};
/*
 * Sets the interface of the scene
 */
DSXScene.prototype.setInterface = function(myinterface) {
	this.myinterface = myinterface;
}

/*
 * Create camera in default position
 */
DSXScene.prototype.initCameras = function () {
    this.camera = new CGFcamera(1, 1, 300, vec3.fromValues(3, 180, 1), vec3.fromValues(1, 1, 1));


};

/*
 * Defines default apperence
 */
DSXScene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.5, 0.5, 0.5, 1);
    this.setDiffuse(0.5, 0.5, 0.5, 1);
    this.setSpecular(0.5, 0.5, 0.5, 1);
    this.setShininess(10.0);
};

/*
 * Called on the graph is loaded ok
 */
DSXScene.prototype.onGraphLoaded = function ()
{

	this.textures = this.graph.textures;
	this.primitives = this.graph.primitives;
	this.components = this.graph.components;
	this.materials = this.graph.materials;


    if (this.graph.referenceLength > 0)
	   this.axis = new CGFaxis(this, this.graph.referenceLength);

	this.gl.clearColor(this.graph.illumination.background[0],this.graph.illumination.background[1],this.graph.illumination.background[2],this.graph.illumination.background[3]);
	this.setGlobalAmbientLight(this.graph.illumination.ambient[0],this.graph.illumination.ambient[1],this.graph.illumination.ambient[2],this.graph.illumination.ambient[3]);

	this.updateCamera(this.graph.defaultView);

	this.lights = [];

  //load lights from the Grahps
	//All lights are invisible, enabled or not depends from the dsx
	var j = 0;
	for (var i = 0; i < this.graph.omnis.length; ++i) {

		this.lights.push(this.graph.omnis[i]);
		this.lights[i].setVisible(false);
		this.lights[i].update();
		this.lightsEnabled[this.lights[i].id] = this.lights[i].enabled;
		j++;
	}


	for (var i = 0; i < this.graph.spots.length; ++i) {
		this.lights.push(this.graph.spots[i]);
		this.lights[j].setVisible(false);
		this.lights[j].update();
		this.lightsEnabled[this.lights[j].id] = this.lights[j].enabled;
    	j++;
	}



    this.lightsEnabled[this.allLights] = false;
	for (i in this.lights) {
    	if(this.lights[i].enabled){
			 this.lightsEnabled[this.allLights] = true;
			 break;
		}
    }

	//loads interface
	if (this.myinterface != null)
	    this.myinterface.onGraphLoaded();
};

/*
 * Draws the scene. Updates with changes
 */
DSXScene.prototype.display = function () {
    this.logPicking();
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	//View position initialization is equal to identity
	this.updateProjectionMatrix();
    this.loadIdentity();




	// Apply transformations from the camera setup
	this.applyViewMatrix();



	//Process scene if dsx read ok

	if (this.loadedOk > 0)
	{


		for (var i = 0; i < this.lights.length; ++i)
			this.lights[i].update();


		// Draw axis
		if (this.axis)
	   		this.axis.display();



		//Draws the scene from the graph by processing all nodes starting from the roo
		this.processScene();

	}
};

/*
 * Process graph starting from root
 */
DSXScene.prototype.processScene = function() {
	this.processNode(this.root, "none","none");
};


DSXScene.prototype.splayDisplay = function() {
  //todo
  //board
  this.graph.splayBoard.display();
  //whiteCheckers
  for(id in this.graph.whiteCheckers){
    this.graph.whiteCheckers[id].display();
    this.registerForPick(id, this.graph.whiteCheckers[id]);
  }
  //blackCheckers
  for(id in this.graph.blackCheckers){
    this.graph.blackCheckers[id].display();
    this.registerForPick(id, this.graph.blackCheckers[id]);
  }
}

/*
 * Process node
 * @param parentTexture receives the texture from the parent
 * @param parentMaterial receives the materialsRef from the parent
 */
DSXScene.prototype.processNode = function(node, parentTexture, parentMaterial) {
	//Node is leaf

  if (node in this.primitives) {
    if(node=='splay'){
      this.splayDisplay();
    }
    else{
      this.primitives[node].display();
    }

    this.popMatrix();
    return;
  }

	animation = this.components[node].update(this.timer);
	this.components[node].update(this.timer);
	this.pushMatrix();
	if(animation != 'null')
		this.multMatrix(animation);

	this.multMatrix(this.graph.components[node].localTransformations);

	var component = this.components[node];
	var textureId = this.components[node].texture;

	var texture;

	var materialDefault = this.components[node].materialDefault;

	var material;
	if(materialDefault == "inherit")
		material = parentMaterial;
	else
		material = materialDefault;
	this.materials[material].apply();


	if(textureId == "none")
	{
		if(this.actualTexture != null)
		this.actualTexture.unbind();
		texture = textureId;
	}
	else if(textureId == "inherit")
	{
		if(parentTexture != "none" )
		{
			if(this.actualTexture != null)
				this.actualTexture.unbind();
			this.actualTexture = this.textures[parentTexture];
			this.actualTexture.bind();

		}
		texture = parentTexture;
	}
	else
	{
		if(this.actualTexture != null)
			this.actualTexture.unbind();
		this.actualTexture = this.textures[textureId];
		this.actualTexture.bind();
		texture = textureId;

	}
//Process the node's children
	var children = this.graph.components[node].children;
	for (var i = 0; i < children.length; ++i) {

		this.processNode(children[i], texture, material);
	}
}


DSXScene.prototype.update = function(currTime) {
	if (this.lastUpdate != 0)
		this.timer += (currTime - this.lastUpdate) / 1000;
}

/*
 * Updates lights from the interface
 * @param lightId
 * @param enable boolean
 */


DSXScene.prototype.updateLight = function(lightId, enable) {
  	//Switch only one light
  	if(lightId != this.allLights){
  		console.log("Changing light " + lightId);
  		for (var i = 0; i < this.lights.length; ++i) {
  			if (this.lights[i].id == lightId) {
  				var light = this.lights[i];
  				enable ? light.enable() : light.disable();
  				return;
  			}
  		}
  	}else{
  		//Switch all lights
  		console.log("Changing all lights");
  		for (var i = 0; i < this.lights.length; ++i) {
  			var light = this.lights[i];
  			enable ? light.enable() : light.disable();

  		}

  	}
}

/*
 * Updates play mode from the interface
 * @param splay boolean
 */


DSXScene.prototype.updatePlayMode = function() {
  	//Switch only one light
  	if(this.playMode==0){
  		this.playMode = 1;
  	}else{
  		this.playMode = 0;
  	}
}

DSXScene.prototype.updateCamera = function (idCamera) {


	var camera = this.graph.views[idCamera];

	this.camera.fov = camera.fov;
	this.camera.near = camera.near;
	this.camera.far =  camera.far;
	this.camera.position = camera.position;
	this.camera.target = camera.target;

};

/*
 * switch materials default
 * @param materialsID boolean
 */


DSXScene.prototype.changeMaterials = function(materialsID) {
	this.changeNodeMaterial(this.root, materialsID);
}
/*
 * switch materials default
 * @param lightId
 * @param enable boolean
 */


DSXScene.prototype.changeNodeMaterial = function(node, materialsID) {
	if (node in this.primitives) {return;}
	else if(this.components[node].materialsRef.length>1){
		this.components[node].materialDefault=this.components[node].materialsRef[materialsID].id;
	}
	var children = this.graph.components[node].children;
	for (var i = 0; i < children.length; ++i) {
		this.changeNodeMaterial(children[i], materialsID);

	}
}

DSXScene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
					var customId = this.pickResults[i][1];
					if(customId>63){customId++;}
					console.log("Picked object: " + customId);
					if(this.gameOn)
					this.logPickingAux(customId,obj);
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	}
}

DSXScene.prototype.logPickingAux=function (idObject,obj){
	//tranlate to board position
	var x = this.getXpos(idObject,obj);
	var z = this.getZpos(idObject,obj);
	console.log(x+','+z);
	if(this.graph.splayBoard.selected==0){
		//first click
		var chekers = this.graph.splayBoard.getCheckers(x,z);
		if(chekers.length == 0){}//if empty dont select
		else if (this.graph.splayBoard.checkColor(x,z)!=this.playerToMove){}//dont select if not valid pick
		else{
			var houseID =z+ (x*8)+1;
			this.graph.splayBoard.selected = houseID;
			this.x1 = x;
			this.z1 = z;
		}
	}
	else{
		//second click
		this.graph.splayBoard.selected = 0;
		this.x2 = x;
		this.z2 = z;
		var valid = this.sendMove();
		if(valid){
			var checkers = this.graph.splayBoard.getCheckers(this.x1,this.z1);
			//change databoard and moveCheckers
			this.changeBoard(checkers);
			if(this.checkWinner()){this.gameOn=false;}
			else{
				this.switchPlayer();
				}
		}
	}
}

DSXScene.prototype.sendMove= function(){
	if(this.x1==this.x2 && this.z1==this.z2){
		return false;
	}
	return true;
}

DSXScene.prototype.getXpos=function(idObject,obj){
	if(idObject>82){return this.graph.blackCheckers[idObject].x;}
	else if(idObject>64){return this.graph.whiteCheckers[idObject].x;}
	else
	 return obj.x;
}

DSXScene.prototype.getZpos=function(idObject,obj){
	if(idObject>82){return this.graph.blackCheckers[idObject].z;}
	else if(idObject>64){return this.graph.whiteCheckers[idObject].z;}
	else
	 return obj.z;
}

DSXScene.prototype.changeBoard=function(checkers){
	//save board to undo play
	//TODO
	//
	//move
	if(this.playMode==0){
		for(var i =0; i<checkers.length;i++){
			if(this.checkCapture(checkers[i])){}
			else{
				var y = this.graph.splayBoard.addCheckerToDB(checkers[i],this.x2,this.z2);
				this.moveChecker(checkers[i],this.x2,this.z2,y);
			}
		}
	}
	//splay
	else{
    var deslX = this.x2-this.x1;
    var deslZ = this.z2-this.z1;
    numpecas= checkers.length;
    var deslUX = deslX/numpecas;
    var deslUZ = deslZ/numpecas;
		for(var i=0;i<checkers.length;i++){
		  var new_x = this.x1+deslUX*(i+1);
		  var new_z = this.z1+deslUZ*(i+1);
		  var j = numpecas-i-1;
		  var y = this.graph.splayBoard.addCheckerToDB(checkers[j],new_x,new_z);
		  if(i==checkers.length-1 && this.checkCapture(checkers[0])){}
		  else{
		   this.moveChecker(checkers[j],new_x,new_z,y);
		  }
		}
	}
	//empty house
	this.graph.splayBoard.emptyHouse(this.x1,this.z1);
}

DSXScene.prototype.checkCapture = function(checkerID){
	if(checkerID>82 && this.x2==7){
		var y = this.graph.blackCheckers[checkerID].y;
		var pos = this.blackCaptures.length;
		this.blackCaptures[pos]=checkerID;
		this.graph.blackCheckers[checkerID].change_coords(7-pos,-1,0);
		this.graph.blackCheckers[checkerID].captureC();
		return true;
		}
	else if(checkerID<83 && this.x2==0){
		var y = this.graph.whiteCheckers[checkerID].y;
		var pos = this.whiteCaptures.length;
		this.whiteCaptures[pos]=checkerID;
		this.graph.whiteCheckers[checkerID].change_coords(pos,8,0);
		this.graph.whiteCheckers[checkerID].captureC();
		return true;
		}
	else
	return false;
}

DSXScene.prototype.moveChecker=function(checkerID,x,z,y){
	if(checkerID>82){this.graph.blackCheckers[checkerID].change_coords(x,z,y);}
	else
	this.graph.whiteCheckers[checkerID].change_coords(x,z,y);
}

DSXScene.prototype.moveChecker=function(checkerID,x,z,y){
	if(checkerID>82){this.graph.blackCheckers[checkerID].change_coords(x,z,y);}
	else
	this.graph.whiteCheckers[checkerID].change_coords(x,z,y);
}

DSXScene.prototype.switchPlayer = function (){
	this.playerToMove++;
	var views = [];
	var i = 0;
	for(id in this.graph.viewsID){
		views[i] = id;
		i++;
	}
	if(this.playerToMove==2) this.playerToMove=0;
	this.updateCamera(views[this.playerToMove]);
}

DSXScene.prototype.checkWinner = function (){
	if(this.whiteCaptures.length>7 || this.blackCaptures.length>7) return true;
	else return false;
}