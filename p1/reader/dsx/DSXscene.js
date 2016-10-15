/*
 * DSXScene extends CFGscene
 * @constructor
 * @param application CFGapplication
 */
function DSXScene(application) {
    CGFscene.call(this);
}

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


    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.gl.enable(this.gl.BLEND);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	this.setGlobalAmbientLight(0.5,0.5,0.5,0.5);

    this.enableTextures(true);
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
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(50, 80, 130), vec3.fromValues(0, 0, 0));
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

    if (this.graph.referenceLength > 0)
	   this.axis = new CGFaxis(this, this.graph.referenceLength);

	this.gl.clearColor(this.graph.illumination.background[0],this.graph.illumination.background[1],this.graph.illumination.background[2],this.graph.illumination.background[3]);
	this.setGlobalAmbientLight(this.graph.illumination.ambient[0],this.graph.illumination.ambient[1],this.graph.illumination.ambient[2],this.graph.illumination.ambient[3]);

	this.lights = [];

	//load lights from the Grahps
	//All lights are invisible, enabled or not depends from the dsx

	for (var i = 0; i < this.graph.omnis.length; ++i) {
		this.lights.push(this.graph.omnis[i]);
		this.lights[i].setVisible(false);
		this.lightsEnabled[this.lights[i].id] = this.lights[i].enabled;
	}

	for (var i = 0; i < this.graph.spots.length; ++i) {
		this.lights.push(this.graph.spots[i]);
		this.lights[i].setVisible(false);
		this.lightsEnabled[this.lights[i].id] = this.lights[i].enabled;
	}


	//controls all lights
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

	//sets primitives
    for (key in this.graph.leaves) {
    	var leaf = this.graph.leaves[key];
    	switch (leaf.type) {
    		case "rectangle":
    			this.primitives[key] = new MyRectangle(this, leaf.x0, leaf.y0, leaf.x1, leaf.y1);
    			break;
    		case "triangle":
    			this.primitives[key] = new MyTriangle(this, leaf.v1[0], leaf.v1[1], leaf.v1[2], leaf.v2[0], leaf.v2[1], leaf.v2[2], leaf.v3[0], leaf.v3[1], leaf.v3[2]);
    			break;
    		case "cylinder":
				this.primitives[key] = new MyFullCylinder(this, leaf.height, leaf.bottomRadius, leaf.topRadius, leaf.sections, leaf.parts);
				break;
			case "sphere":
				this.primitives[key] = new MySphere(this, leaf.radius, leaf.stacks, leaf.sections);
				break;
    	}
    }
};

/*
 * Draws the scene. Updates with changes
 */
DSXScene.prototype.display = function () {
    this.shader.bind();

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	//View position initialization is equal to identity
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations from the camera setup
	this.applyViewMatrix();
	var torus = new MyTorus(this,1,4,10,10);
	torus.display();



	//this.setDefaultAppearance();
	//Process scene if dsx read ok

	if (this.graph != null && this.graph.loadedOk)
	{
		console.log("entrou");
		console.log("numero de views: "+ this.graph.views.length );

		for (var i = 0; i < this.lights.length; ++i)
			this.lights[i].update();


		// Draw axis
		if (this.axis)
	   		this.axis.display();

	   	//Set default appearance
		this.setDefaultAppearance();

		//Draws the scene from the graph by processing all nodes starting from the root
		this.processScene();
		console.log(this.lights.length);
	}


    this.shader.unbind();
};

/*
 * Process graph starting from root
 */
DSXScene.prototype.processScene = function() {
	this.processNode(this.root, "clear", "null");
	this.setDefaultAppearance();
}

/*
 * Process node
 * @param parentTexture receives the texture from the parent
 * @param parentMaterial receives the material from the parent
 */
DSXScene.prototype.processNode = function(node, parentTexture, parentMaterial) {
	//Node is leaf
	if (node in this.graph.primitives) {
		//set materials
		if (parentMaterial != "null")
			this.graph.materials[parentMaterial].apply();
		else
			this.setDefaultAppearance();

		//set texture
		var texture;

		if (parentTexture != "clear")
		{
			texture = this.graph.textures[parentTexture];
			this.graph.primitives[node].scaleTexCoords(texture.amplifyFactor.s, texture.amplifyFactor.t);
			texture.bind();
		}
		//get primitive to draw
		this.graph.primitives[node].display();

		if (texture)
			texture.unbind();
		return;
	}

	//Applies transformations
	this.pushMatrix();

	this.multMatrix(this.graph.nodes[node].localTransformations);

	//Receives material and texture from parent?
	var material = this.graph.nodes[node].material.id;
	if (material == "null")
		material = parentMaterial;

	var texture = this.graph.nodes[node].texture;
	if (texture == "null")
		texture = parentTexture;

	//Process the node's children
	var children = this.graph.nodes[node].children;
	for (var i = 0; i < children.length; ++i) {
		this.processNode(children[i], texture, material);
	}

	this.popMatrix();
}


/*
 * Updates lights from the interface
 * @param lightId
 * @param enable boolean
 */

/*
DSXScene.prototype.updateLight = function(lightId, enable) {

	//Switch only one light
	if(lightId != this.allLights){
		console.log("Changing light " + lightId);
		for (var i = 0; i < this.graph.lights.length; ++i) {
			if (this.lights[i].id == lightId) {
				var light = this.lights[i];
				enable ? light.enable() : light.disable();
				return;
			}
		}
	}else{
		//Switch all lights
		console.log("Changing all lights");
		for (var i = 0; i < this.graph.lights.length; ++i) {
			var light = this.lights[i];
			enable ? light.enable() : light.disable();

		}

	}
}
*/

DSXScene.prototype.updateLights = function(lightId,enable) {
		this.updateOmnis(lightId,enable);
		this.updateSpots(lightId,enable);


}

DSXScene.prototype.updateOmnis = function(lightId,enable) {
	if(lightId != this.allLights) {
	for (var i = 0; i < this.graph.omnis.length; ++i) {
		if (this.lights[i].id == lightId) {
			var light = this.lights[i];
			enable ? light.enable() : light.disable();
			return ;
		}
	}
	}else
	{
		for (var i = 0; i < this.graph.omnis.length; ++i) {
				var light = this.lights[i];
				enable ? light.enable() : light.disable();
		}
	}
}

DSXScene.prototype.updateSpots = function(lightId,enable) {
	if(lightId != this.allLights) {
		for (var i = this.getSpotsBegin() ; i < this.graph.spots.length; ++i) {
			if (this.lights[i].id == lightId) {
				var light = this.lights[i];
				enable ? light.enable() : light.disable();
				return ;
			}
		}
	}else
	{
		for (var i = this.getSpotsBegin() ; i < this.getSpotsEnd(); ++i) {
			var light = this.lights[i];
			enable ? light.enable() : light.disable();
		}
	}
}

DSXScene.prototype.getSpotsBegin = function() {
	return this.graph.omnis.length;
}

DSXScene.prototype.getSpotsEnd = function() {
	return this.graph.omnis.length + this.graph.spots.length;
}
