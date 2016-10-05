//Constant to convert degrees in radians
deg2rad = Math.PI / 180
/*
 * DSXSceneGraph
 * @constructor
 * @param filename filename of the scene
 * @param CGFscene object
*/
function DSXSceneGraph(filename, scene) {
    if (typeof scene.onGraphLoaded !== 'function') {
		console.error("onGraphLoaded not defined in scene");
		return;
	}
	this.loadedOk = null;
	this.filename = 'scenes/'+filename;

  //***************UPDATE LATER*************
  this.scene = new Scene();
  this.illumination = new Illumination();
  this.omni = [];
  this.spots = [];
  this.textures = [];
  this.materials = [];
  this.leaves = [];
  this.nodes = [];
  this.scene = scene;
  scene.graph=this;
  //***************UPDATE LATER*************

	//File reader
	this.reader = new DSXReader();


	//Reads content of filename. Returns message erros in case of fail
	this.reader.open(this.filename, this);
}

/*
 * Function called if the XML was sucessful read
 */
DSXSceneGraph.prototype.onXMLReady=function()
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;


	var error = this.parseSceneGraph(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;

	this.scene.onGraphLoaded();
};

/*
 *@param rootElement SCENE tag from DSX
 * Parser of the DSX file
 */
DSXSceneGraph.prototype.parseSceneGraph = function(rootElement) {


    if (rootElement.nodeName != "SCENE") {
        return "Not a SCENE file";
    }
	/*
	//The order must be correct
  //
	if (
      rootElement.children[0].nodeName != "scene" ||
  		rootElement.children[1].nodeName != "views" ||
  		rootElement.children[2].nodeName != "illumination" ||
  		rootElement.children[3].nodeName != "lights" ||
  		rootElement.children[4].nodeName != "textures" ||
  		rootElement.children[5].nodeName != "materials" ||
      rootElement.children[6].nodeName != "transformations" ||
      rootElement.children[7].nodeName != "primitives" ||
  		rootElement.children[8].nodeName != "components"){
			error = "The order of the TAGS is wrong";
			return error;
	}
	*/

  /*
  console.log("*******SCENE*******");
    //var error = this.parseScene(rootElement);
    if (error) {
        return error;
    }
  */
  console.log("*******VIEWS*******");
    var error = this.parseViews(rootElement);
    if (error) {
        return error;
    }
  /*
	console.log("*******ILLUMINATION*******");
    error = this.parseIllumination(rootElement);
    if (error) {
        return error;
    }

 	console.log("*******LIGHTS*******");
    error = this.parseLights(rootElement);
    if (error) {
        return error;
    }

	console.log("*******TEXTURES*******");
    error = this.parseTextures(rootElement);
    if (error) {
        return error;
    }

	console.log("*******MATERIALS*******");
    error = this.parseMaterials(rootElement);
    if (error) {
        return error;
    }

    console.log("*******TRANSFORMATIONS*******");
    //  error = this.parseTransformations(rootElement);
      if (error) {
          return error;
      }

	console.log("*******PRIMITIVES*******");
    //error = this.parsePrimitives(rootElement);
    if (error) {
        return error;
    }

	console.log("*******COMPONENTS*******");
    //error = this.parseNodes(rootElement);
    if (error) {
        return error;
    }
    */
	console.log("**************");

    this.loadedOk = true;
}



DSXSceneGraph.prototype.parseViews = function (rootElement) {
  var viewsElement = rootElement.getElementsByTagName('views');
  var perspectivesCollection = viewsElement[0].getElementsByTagName('perspective');
  var perspectivesLength = perspectivesCollection.length;

  console.log(perspectivesLength);
    var i, id, near, far, angle;
    var to = [];
	var from = [];
    var fromTag, toTag;


    for(i=0;i<perspectivesLength;i++){
        id = this.reader.getString(perspectivesCollection[i],'id',1);
        console.log("id: "+id);

        near = this.reader.getFloat(perspectivesCollection[i], 'near', 1);
        console.log("near: "+near);


        far = this.reader.getFloat(perspectivesCollection[i], 'far', 1);
        console.log("far: "+ far);


        angle = this.reader.getFloat(perspectivesCollection[i], 'angle', 1);
        console.log("angle: "+ angle);

        fromTag = perspectivesCollection[0].getElementsByTagName('from');
        console.log(fromTag[0]);
        if(fromTag != null && fromTag.length != 0){
            if(this.reader.hasAttribute(fromTag[0],'x')) {
				console.log("entrou111");
			}

            from[0] = this.reader.getFloat(fromTag[0], 'x', 1);
            console.log("passou");

            from[1] = this.reader.getFloat(fromTag[0],'y',1);
            from[2] = this.reader.getFloat(fromTag[0],'z',1);
            console.log(from);

        }

		toTag = perspectivesCollection[0].getElementsByTagName('to');
		console.log(toTag[0]);
		if(toTag != null && toTag.length != 0){
			if(this.reader.hasAttribute(toTag[0],'x')) {
				console.log("entrou111");
			}

			to[0] = this.reader.getFloat(toTag[0], 'x', 1);
			console.log("passou");

			to[1] = this.reader.getFloat(toTag[0],'y',1);
			to[2] = this.reader.getFloat(toTag[0],'z',1);
			console.log(to);

		}

		fromTag = null;
		toTag = null;
		from = null;
		to = null;
		id = null;
		near = null;
		far = null;
		angle = null;

	}


};

/*
 *@param rootElement SCENE tag from DSX
 * Parse tag SCENE from DSX
 */


DSXSceneGraph.prototype.parseScene = function(rootElement) {
  //Get SCENE
  var sceneTemp =  rootElement.getElementsByTagName("SCENE");
  if (sceneTemp == null) {
    return "SCENE is missing";
  }

  if (sceneTemp.length != 1) {
    return "Only one SCENE is allowed";
  }

  var scene = sceneTemp[0];

  //Get SCENE - root
  this.scene.root = this.reader.getString(scene, "root");
  if (this.scene.root == null)
    return "Root is missing.";
  if (isNaN(this.scene.root))
    return "Root is NaN.";


  //Get SCENE - axis_length
  this.scene.axis_length = this.reader.getString(scene, "axis_length");
  if (this.scene.axis_length == null)
    return "axis_length is missing.";
  if (isNaN(this.scene.axis_length))
    return "axis_length is NaN.";
}


 *@param rootElement SCENE tag from DSX
 * Parse tag ILLUMINATION from DSX
 */
DSXSceneGraph.prototype.parseIllumination = function(rootElement) {
	//Get ILLUMINATION
	var tempIllum =  rootElement.getElementsByTagName("illumination");
	if (tempIllum == null) {
		return "ILLUMINATION is missing.";
	}

	if (tempIllum.length != 1) {
		return "only one ILLUMINATION is allowed.";
	}

	var illumination = tempIllum[0];

  //Get ILLUMINATION - doublesided
  this.illumination.doublesided = this.reader.getString(illumination, "doublesided");
  if (this.illumination.doublesided == null)
    return "ILLUMINATION without doublesided.";

  //Get ILLUMINATION - local
  this.illumination.local = this.reader.getString(illumination, "local");
  if (this.illumination.local == null)
    return "ILLUMINATION without local.";

	//Get global ambient light
    tempAmb = illumination.getElementsByTagName("ambient");
    if (tempAmb == null) {
		return "ambient in ILLUMINATION is missing.";
	}

	if (tempAmb.length != 1) {
		return "only one ambient in ILLUMINATION is allowed.";
	}

	var ambient = tempAmb[0];
	this.illumination.ambient = this.reader.getRGBA(ambient);

	//Get background color
    tempBack = illumination.getElementsByTagName("background");
    if (tempBack == null) {
		return "background in ILLUMINATION is missing.";
	}

	if (tempBack.length != 1) {
		return "only one background in ILLUMINATION is allowed.";
	}

	var background = tempBack[0];
	this.illumination.background = this.reader.getRGBA(background);

}

/*
 *@param rootElement SCENE tag from DSX
 * Parse tag LIGHTS from DSX
 */
DSXSceneGraph.prototype.parseLights = function(rootElement) { //por testar
	//Get LIGHTS
    var tempLights =  rootElement.getElementsByTagName("lights");
	if (tempLights == null) {
		return "LIGHTS element is missing.";
	}

	if (tempLights.length != 1) {
		return "only one LIGHTS is allowed.";
	}

	//Get LIGHTS - LIGHT
	var lights = tempLights[0];
  var j =0;

	for (var i = 0; i < lights.children.length; ++i) {
		var light = lights.children[i];
		if (light.nodeName != "omni" && i == 0)
			return "expected omni in LIGHTS: " + light.nodeName;
    //****OMNI*********************
    else if (light.nodeName == "omni"){
      var id = this.reader.getString(omni, "id");
      if (id == null)
        return "OMNI without id.";
      var enable = this.reader.getBoolean(omni, "enabled");

      this.omni.push(new Light(this.scene, j, id)); //CRIAR CLASSE OMNI
      if (enable)
  			this.omni[j].enable();
  		else
  			this.omni[j].disable();

      var data = [];
      //location of light
      data.push(this.reader.getFloat(light.children[1], "x"));
      data.push(this.reader.getFloat(light.children[1], "y"));
      data.push(this.reader.getFloat(light.children[1], "z"));
      data.push(this.reader.getFloat(light.children[1], "w"));
      this.omni[j].setPosition(data[0], data[1], data[2], data[3]);

      //components of light
      //ambient
      data = this.reader.getRGBA(light.children[2]);
      this.omni[j].setAmbient(data[0], data[1], data[2], data[3]);
      //diffuse
      data = this.reader.getRGBA(light.children[3]);
      this.omni[j].setDiffuse(data[0], data[1], data[2], data[3]);
      //specular
      data = this.reader.getRGBA(light.children[4]);
      this.omni[j].setSpecular(data[0], data[1], data[2], data[3]);
    }
    //*****************************
	}
  j=0;
	//****SPOT*********************
  for (var i = 0; i < lights.children.length; ++i) {
		var light = lights.children[i];
		if (light.nodeName == "spot"){
      var id = this.reader.getString(spot, "id");
      if (id == null)
        return "SPOT without id.";
      var enable = this.reader.getBoolean(spot, "enabled");
      var angle = this.reader.getFloat(spot, "angle");
      var exponent = this.reader.getFloat(spot, "exponent");
      console.log(enable + " " + angle + " " + exponent);
      this.spot.push(new Light(this.scene, j, id)); //CRIAR CLASSE OMNI
      if (enable)
  			this.spot[j].enable();
  		else
  			this.spot[j].disable();

      var data = [];
      //target of light
      data.push(this.reader.getFloat(light.children[1], "x"));
      data.push(this.reader.getFloat(light.children[1], "y"));
      data.push(this.reader.getFloat(light.children[1], "z"));
      data.push(this.reader.getFloat(light.children[1], "w"));
      /*/this.spot[j].setTarget/*/console.log("targuet x="+data[0]+ " y="+data[1]+" z="+ data[2] +" w="+ data[3]);

      //location of light
      data.push(this.reader.getFloat(light.children[2], "x"));
      data.push(this.reader.getFloat(light.children[2], "y"));
      data.push(this.reader.getFloat(light.children[2], "z"));
      data.push(this.reader.getFloat(light.children[2], "w"));
      this.spot[j].setPosition(data[0], data[1], data[2], data[3]);

      //components of light
      //ambient
      data = this.reader.getRGBA(light.children[3]);
      this.spot[j].setAmbient(data[0], data[1], data[2], data[3]);
      //diffuse
      data = this.reader.getRGBA(light.children[4]);
      this.spot[j].setDiffuse(data[0], data[1], data[2], data[3]);
      //specular
      data = this.reader.getRGBA(light.children[5]);
      this.spot[j].setSpecular(data[0], data[1], data[2], data[3]);
    }
      //*****************************
  	}

}

/*
 *@param rootElement SCENE tag from DSX
 * Parse tag TEXTURES from DSX
 */
DSXSceneGraph.prototype.parseTextures = function(rootElement) {
	//Get TEXTURES
    var tempText =  rootElement.getElementsByTagName("textures");
	if (tempText == null) {
		return "TEXTURES is missing.";
	}

	if (tempText.length != 1) {
		return "Only one TEXTURES is allowed.";
	}

	var textures = tempText[0];

	texture = textures.getElementsByTagName("texture");

	if (texture == null) {
		console.log("TEXTURE in TEXTURES missing");
		return;
	}
	if (texture.length == 0) {
		console.log("No Texture in TEXTURES.");
		return;
	}

	//Relative path to file with textures (images)
	var pathRel = this.filename.substring(0, this.filename.lastIndexOf("/"));

	for (var i = 0; i < texture.length; ++i) {
		var NewTexture = texture[i];
		var id = this.reader.getString(NewTexture, "id");
		if (id in this.textures)
			return "Duplicate texture id: " + id;

		var path = pathRel + '/' + this.reader.getString(NewTexture, "file");
		var s = this.reader.getFloat(NewTexture, "length_s");
		var t = this.reader.getFloat(NewTexture, "length_t");
		this.textures[id] = new Texture(this.scene, path, id);
		this.textures[id].setAmplifyFactor(s,t);
	}
}


/*
 *@param rootElement SCENE tag from DSX
 * Parse tag MATERIALS from DSX
 */
DSXSceneGraph.prototype.parseMaterials = function(rootElement) {
	//Get MATERIALS
    var tempMat =  rootElement.getElementsByTagName("materials");
	if (tempMat == null) {
		return "MATERIALS is missing.";
	}

	if (tempMat.length != 1) {
		return "Only one MATERIALS is allowed.";
	}

	var materials = tempMat[0];

	//Get each material
	for(var i = 0; i < materials.children.length; ++i){
		var material = materials.children[i];
		var id = this.reader.getString(material,"id");
		if (id in this.materials)
			return "Duplicate material id: " + id;

		this.materials[id] = new Material(this.scene,id);

		data = this.reader.getRGBA(material.children[0]);
		this.materials[id].setEmission(data[0],data[1],data[2],data[3]);
    data = this.reader.getRGBA(material.children[1]);
		this.materials[id].setAmbient(data[0],data[1],data[2],data[3]);
    data = this.reader.getRGBA(material.children[2]);
		this.materials[id].setDiffuse(data[0],data[1],data[2],data[3]);
    var data = this.reader.getRGBA(material.children[3]);
		this.materials[id].setSpecular(data[0],data[1],data[2],data[3]);
    var shininess = this.reader.getFloat(material.children[4],"value");
    this.materials[id].setShininess(shininess);
	}
}

/*
 *@param rootElement SCENE tag from DSX
 * Parse tag LEAVES from DSX - sets all primitives for the scene
 */
DSXSceneGraph.prototype.parseLeaves = function(rootElement) {
	//Get LEAVES - primitives to be drawn
    var tempLeaves =  rootElement.getElementsByTagName("LEAVES");
	if (tempLeaves == null) {
		return "LEAVES is missing.";
	}

	if (tempLeaves.length != 1) {
		return "Only one LEAVES is allowed.";
	}

	var leaves = tempLeaves[0];

	allLeaf = leaves.getElementsByTagName("LEAF");

	if (allLeaf == null) {
		return "LEAF in LEAVES missing";
	}
	if (allLeaf.length == 0) {
		return "No LEAF found."
	}

	//Get each leaf
	for (var i = 0; i < allLeaf.length; ++i) {
		var leaf = allLeaf[i]
		var id = this.reader.getString(leaf, "id");
		if (id in this.leaves)
			return "Duplicate leaf id: " + id;

		var type = this.reader.getString(leaf, "type");
		var data;

		//Different types of primitives
		switch (type) {
			case "rectangle":
				data = this.reader.getArrayOfFloats(leaf, "args", 4);
				if (data == null)
					return "rectangle with error " + id;
				this.leaves[id] = new LeafRectangle(id, data[0], data[1], data[2], data[3]);
				break;
			case "cylinder":
				data = this.reader.getArrayOfFloats(leaf, "args", 5);
				if (data == null)
					return "cylinder with error " + id;
				if(data[3] % 1 != 0  || data[4] % 1 != 0 )
					return "cylinder " + id + " 4th/5th arg must be integer.";
				this.leaves[id] = new LeafCylinder(id, data[0], data[1], data[2], data[3], data[4]);
				break;
			case "sphere":
				data = this.reader.getArrayOfFloats(leaf, "args", 3);
				if (data == null)
					return "sphere with error " + id;
				if(data[1] % 1 != 0  || data[2] % 1 != 0 )
					return "sphere " + id + " 2nd/3rd arg must be integer.";
				this.leaves[id] = new LeafSphere(id, data[0], data[1], data[2]);
				break;
			case "triangle":
				data = this.reader.getArrayOfFloats(leaf, "args", 9);
				if (data == null)
					return "triangle with error" + id;
				this.leaves[id] = new LeafTriangle(id, data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8]);
				break;
			default:
				return "Leaf type unknown: " + type;
		}
	}
}

/*
 *@param rootElement SCENE tag from DSX
 * Parse tag NODES from DSX
 */
DSXSceneGraph.prototype.parseNodes = function(rootElement) {
	//Get NODES
    var tempNodes =  rootElement.getElementsByTagName("NODES");
	if (tempNodes == null) {
		return "NODES is missing.";
	}

	if (tempNodes.length != 1) {
		return "Only one NODES is allowed";
	}

	var nodes = tempNodes[0];
	this.root = this.reader.getString(nodes.children[0], "id");

	tempNode = nodes.getElementsByTagName("NODE");

	if (tempNode == null) {
		return "NODE in NODES missing";
	}
	if (tempNode.length == 0) {
		return "No NODE found."
	}

	for (var i = 0; i < tempNode.length; ++i) {
		var node = tempNode[i];

		error = this.parseNode(node);
		if (error)
			return error;
	}

	if (!(this.root in this.nodes))
		return "Node with root id missing";

	for (key in this.nodes) {
		for (var i = 0; i < this.nodes[key].children.length; ++i) {
			var child = this.nodes[key].children[i];
			if (!((child in this.nodes) || (child in this.leaves)))
				return "Child " + child + " is missing";
		}
	}
}

/*
 *@param node
 * Parse each NODE
 * Called by parseNodes
 */
DSXSceneGraph.prototype.parseNode = function(node) {
	//Id of node
	var id = this.reader.getString(node, "id");
	console.log(id);
	if (id in this.leaves)
		return "Copy id leaf " + id;
	if (id in this.nodes)
		return "Copy id node " + id;

	this.nodes[id] = new Node(id);

	//Get NODE MATERIAL
	var childNode = node.children[0];
	if (childNode.nodeName != "material")
		return "Expected MATERIAL in NODE " + id + "in 1st child.";
	var material = this.reader.getString(childNode, "id");

	if(!(material in this.materials) && material != "null")
		return "No MATERIAL " + material +  " for NODE " + id;
	this.nodes[id].setMaterial(material);

	//Get NODE TEXTURE
	childNode = node.children[1];
	if (childNode.nodeName != "TEXTURE")
		return "Expected TEXTURE in NODE " + id + "in 2nd child.";
	var texture = this.reader.getString(childNode, "id");

	if(!(texture in this.textures) && texture != "null" && texture != "clear")
		return "No TEXTURE " + texture +  " for NODE " + id;

	this.nodes[id].setTexture(texture);

	//Get Local Transformations of Node - OPTIONAL
	for (var i = 2; i < node.children.length - 1; ++i) {
		var transformation = node.children[i];
		var type = transformation.nodeName;
		switch (type) {
			case "ROTATION":
				var axis = this.reader.getString(transformation, "axis");
				var angle = this.reader.getFloat(transformation, "angle");
					switch (axis) {

						case "x":
							this.nodes[id].rotateX(angle * deg2rad);
							break;
						case "y":
							this.nodes[id].rotateY(angle * deg2rad);
							break;
						case "z":
							this.nodes[id].rotateZ(angle *deg2rad);
							break;
						default:
							return "Unknown rotation axis: " + axis;
					}
				break;
			case "SCALE":
				var sx = this.reader.getFloat(transformation, "sx");
				var sy = this.reader.getFloat(transformation, "sy");
				var sz = this.reader.getFloat(transformation, "sz");
				this.nodes[id].scale(sx, sy, sz);
				break;
			case "TRANSLATION":
				var x = this.reader.getFloat(transformation, "x");
				var y = this.reader.getFloat(transformation, "y");
				var z = this.reader.getFloat(transformation, "z");
				this.nodes[id].translate(x, y, z);
				break;
			default:
				return "Unknown transformation: " + type;
		}
	}

	//Get children of NODE
	var new_children = node.children[node.children.length - 1];
	if (new_children.nodeName != "DESCENDANTS")
		return "Expected DESCENDANTS tag in NODE " + id;

	if (new_children.children.length == 0)
		return "NODE " + id + " as no descendants";

	for (var i = 0; i < new_children.children.length; ++i) {
		var new_child = this.reader.getString(new_children.children[i], "id");
		this.nodes[id].addChild(new_child);
	}
}

/*
 * Callback to be executed on any read error
 */

DSXSceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
};
