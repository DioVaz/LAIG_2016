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


/*
 * Process node
 * @param parentTexture receives the texture from the parent
 * @param parentMaterial receives the materialsRef from the parent
 */
DSXScene.prototype.processNode = function(node, parentTexture, parentMaterial) {
	//Node is leaf

  if (node in this.primitives) {

  this.primitives[node].display();
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
