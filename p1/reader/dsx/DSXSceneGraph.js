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
  //this.scene = new Scene();
  this.views = [];
  this.defaultView;
  this.illumination = new Illumination();
  this.omnis = [];
  this.spots = [];
  this.textures = [];
  this.materials = [];
  this.transformations = [];
  this.primitives = [];
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
 *@param rootElement SCENE tag from dsx
 * Parser of the dsx file
 */
DSXSceneGraph.prototype.parseSceneGraph = function(rootElement) {


    if (rootElement.nodeName != "SCENE") {
        return "Not a SCENE file";
    }

	//The order must be correct
  //
    /*
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

  console.log("*******SCENE*******");
    var error = this.parseScene(rootElement);
    if (error) {
        return error;
    }

  console.log("*******VIEWS*******");
    var error = this.parseViews(rootElement);
    if (error) {
        return error;
    }

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
      error = this.parseTransformations(rootElement);
      if (error) {
          return error;
      }

	console.log("*******PRIMITIVES*******");
    error = this.parsePrimitives(rootElement);
    if (error) {
        return error;
    }

	console.log("*******COMPONENTS*******");
    //error = this.parseNodes(rootElement);
    if (error) {
        return error;
    }

	console.log("**************");

    this.loadedOk = true;
}



DSXSceneGraph.prototype.parseViews = function (rootElement) {
  var viewsElement = rootElement.getElementsByTagName('views');
  this.defaultView=this.reader.getString(viewsElement[0],'default',1);
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

        fromTag = perspectivesCollection[i].getElementsByTagName('from');
        console.log(fromTag[0]);
        if(fromTag != null && fromTag.length != 0){
            if(this.reader.hasAttribute(fromTag[0],'x')) {
			}

            from[0] = this.reader.getFloat(fromTag[0], 'x', 1);
            from[1] = this.reader.getFloat(fromTag[0],'y',1);
            from[2] = this.reader.getFloat(fromTag[0],'z',1);
            //console.log(from);

        }

		toTag = perspectivesCollection[i].getElementsByTagName('to');
		console.log(toTag[0]);
		if(toTag != null && toTag.length != 0){
			if(this.reader.hasAttribute(toTag[0],'x')) {

			}

			to[0] = this.reader.getFloat(toTag[0], 'x', 1);


			to[1] = this.reader.getFloat(toTag[0],'y',1);
			to[2] = this.reader.getFloat(toTag[0],'z',1);
			//console.log(to);

		}
        this.views.push(new CGFcamera(angle,near,far,from,to));
        this.views.id = id;
		fromTag = null;
		toTag = null;
		from = [];
		to = [];
		id = null;
		near = null;
		far = null;
		angle = null;

	}

    return 0;
};

/*
 *@param rootElement SCENE tag from dsx
 * Parse tag SCENE from dsx
 */


DSXSceneGraph.prototype.parseScene = function(rootElement) {
  //Get SCENE
  var sceneTemp =  rootElement.getElementsByTagName("scene");
  if (sceneTemp == null) {
    return "SCENE is missing";
  }

  if (sceneTemp.length != 1) {
    return "Only one SCENE is allowed";
  }

  var scene = sceneTemp[0];
	/*
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
    return "axis_length is NaN.";*/
}


 /*@param rootElement SCENE tag from dsx
 * Parse tag ILLUMINATION from dsx
 */
DSXSceneGraph.prototype.parseIllumination = function(rootElement) {
	//Get ILLUMINATION
	var tempIllum =  rootElement.getElementsByTagName("illumination");
	if (tempIllum == null) {
		return "ILLUMINATION is missing.";
	}
    console.log("illumination length"+tempIllum.length);
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
/!*
 *@param rootElement SCENE tag from dsx
 * Parse tag LIGHTS from dsx
 *!/
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
    //!****OMNI*********************
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
    //!*****************************
	}
  j=0;
	//!****SPOT*********************
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
      /!*!/this.spot[j].setTarget/!*!/console.log("targuet x="+data[0]+ " y="+data[1]+" z="+ data[2] +" w="+ data[3]);

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
      //!*****************************
  	}

  	console.log(this.omnis);
    console.log(this.spots);
    debugger;

}*/



DSXSceneGraph.prototype.parseLights = function (rootElement) {

    console.log("parsing ligths!!");

    var lightsTag = rootElement.getElementsByTagName('lights');

    if(lightsTag == null)
        return "Lights tag not founded!";

    var omnis = lightsTag[0].getElementsByTagName('omni');
    if(omnis[0] == null)
        return "any omnis founded";

    var spots = lightsTag[0].getElementsByTagName('spot');
    if(spots[0] == null)
        return "any spots founded";

    /*
     console.log("omnis: "+omnis.length);
     console.log("spots: "+spots.length);
     */

    var parseOmnisReturn = this.parseOmnis(omnis);
    /*if(parseOmnisReturn != 0)
     return parseOmnisReturn;*/
    this.parseSpots(spots);

    return 0;

};

DSXSceneGraph.prototype.parseOmnis = function(omnisElement) {

    console.log("parsing Omnis");
    var omnisLength = omnisElement.length;

    var location,ambient, diffuse, specular = [];

    var i, id, enable;
    for( i =0; i < omnisLength; i++){

        id = this.reader.getString(omnisElement[i],'id',1);
        console.log(id);

        enable = this.reader.getBoolean(omnisElement[i],'enabled',1);
        if(this.notBoolean(enable))
            return "enable em omni nao é um boolean";


        location = this.getArray(omnisElement[i].getElementsByTagName('location'),"location");
        if(location == 1 || location == 0)
            return "parseOmnis -> tag não encontrada";

        ambient = this.getArray(omnisElement[i].getElementsByTagName('ambient'),"ambient");
        if(ambient == 1 || ambient == 0)
            return "parseOmnis -> tag não encontrada ou rgb invalido";

        diffuse = this.getArray(omnisElement[i].getElementsByTagName('diffuse'),"diffuse");
        if(diffuse == 1 || diffuse == 0)
            return "parseOmnis -> tag não encontrada ou rgb invalido ";


        specular = this.getArray(omnisElement[i].getElementsByTagName('specular'),"specular");
        if(specular == 1 || specular == 0)
            return "parseOmnis -> tag não encontrada ou rgb invalido";


        var light = new CGFlight(this.scene,id);
        light.setPosition(location);
        light.setAmbient(ambient);
        light.setDiffuse(diffuse);
        light.setSpecular(specular);
        enable ? light.enable() : light.disable();
        this.omnis.push(light);



    }
    console.log(this.omnis);
    return 0;



};

DSXSceneGraph.prototype.parseSpots = function(spotsElement) {

    console.log("parseSpots");
    var spotsLength = spotsElement.length;

    var target,location,ambient, diffuse, specular = [];
    var id, enable, angle, expoente, i;
    for( i =0; i < spotsLength; i++){

        id = this.reader.getString(spotsElement[i],'id',1);

        enable = this.reader.getBoolean(spotsElement[i],'enabled',1);
        if(this.notBoolean(enable))
            return "enable em omni nao é um boolean";

        angle = this.reader.getFloat(spotsElement[i],'angle',1);




        expoente = this.reader.getFloat(spotsElement[i],'expoente',1);

        target = this.getArray(spotsElement[i].getElementsByTagName('target'),"target");
        if(target == 1 || target == 0)
            return "parseSpots-> target não encontrada";

        location = this.getArray(spotsElement[i].getElementsByTagName('location'),"location");
        if(location == 1 || location == 0)
            return "parseSpots- -> location não encontrada";


        ambient = this.getArray(spotsElement[i].getElementsByTagName('ambient'),"ambient");
        if(ambient == 1 || ambient == 0)
            return "parseSpots- -> ambient não encontrada ou rgb invalido";


        diffuse = this.getArray(spotsElement[i].getElementsByTagName('diffuse'),"diffuse");
        if(diffuse == 1 || diffuse == 0)
            return "parseSpots- -> diffuse não encontrada ou rgb invalido ";


        specular = this.getArray(spotsElement[i].getElementsByTagName('specular'),"specular");
        if(specular == 1 || specular == 0)
            return "parseSpots- -> specular não encontrada ou rgb invalido";



        var light = new CGFlight(this.scene,id);
        light.setSpotExponent(expoente);
        light.setSpotCutOff(angle);
        light.setPosition(location);
        light.setAmbient(ambient);
        light.setDiffuse(diffuse);
        light.setSpecular(specular);
        enable ? light.enable() : light.disable();
        this.spots.push(light);



    }
    console.log(this.spots);
    return 0;


};

/*
 *@param rootElement SCENE tag from dsx
 * Parse tag TEXTURES from dsx
 */
DSXSceneGraph.prototype.parseTextures = function(rootElement) {
	//Get TEXTURES
    var tempText =  rootElement.getElementsByTagName("textures");
	if (tempText == null) {
		return "TEXTURES is missing.";
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
	console.log(pathRel);
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
 *@param rootElement SCENE tag from dsx
 * Parse tag MATERIALS from dsx
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

		var data = this.reader.getRGBA(material.children[0]);
		this.materials[id].setEmission(data[0],data[1],data[2],data[3]);
    data = this.reader.getRGBA(material.children[1]);
		this.materials[id].setAmbient(data[0],data[1],data[2],data[3]);
    data = this.reader.getRGBA(material.children[2]);
		this.materials[id].setDiffuse(data[0],data[1],data[2],data[3]);
    data = this.reader.getRGBA(material.children[3]);
		this.materials[id].setSpecular(data[0],data[1],data[2],data[3]);
    var shininess = this.reader.getFloat(material.children[4],"value");
    this.materials[id].setShininess(shininess);
	}
}

/*
 *@param rootElement SCENE tag from dsx
 * Parse tag TRANSFORMATIONS from dsx
 */


DSXSceneGraph.prototype.parseTransformations = function(rootElement) {

	var transformationElement = rootElement.getElementsByTagName('transformations');

	var transformationsElement = transformationElement[0].getElementsByTagName('transformation');
	var transformationsLength = transformationsElement.length;
	console.log("transformationsLength: "+ transformationsLength);

	var id, i;
	var translate,rotate,scale = [];
	var translateTag,rotateTag,scaleTag;
	for( i = 0 ; i < transformationsLength ; i++ )
	{
		id = this.reader.getString(transformationsElement[i],'id',1);
		if(id == null)
			return "id not founded in parse transformations";

		translateTag = transformationsElement[i].getElementsByTagName('translate');
		if(translateTag != null && translateTag.length != 0)
			translate = this.getArray(translateTag,"translate");


		scaleTag = transformationsElement[i].getElementsByTagName('scale');
		if(scaleTag != null && scaleTag != [])
			scale = this.getArray(scaleTag,"scale");
		console.log(scale);

		rotateTag = transformationsElement[i].getElementsByTagName('rotate');
		if(rotateTag != null && rotateTag != [])
			rotate = this.getArray(rotateTag,"rotate");
		console.log(rotate);

		translateTag = [];
		scaleTag = [];
		rotateTag = [];
		translate = [];
		scale = [];
		rotate = [];

	}
	return 0;
}

/*
 *@param rootElement SCENE tag from dsx
 * Parse tag PRIMITIVES from dsx - sets all primitives for the scene
 */
DSXSceneGraph.prototype.parsePrimitives = function(rootElement) {
	//Get primitives to be drawn
    var tempPrimitives =  rootElement.getElementsByTagName("primitives");
	if (tempPrimitives == null) {
		return "PRIMITIVES is missing.";
	}

	if (tempPrimitives.length != 1) {
		return "Only one PRIMITIVES is allowed.";
	}

	var primitives = tempPrimitives[0];

	allPrimitive = primitives.getElementsByTagName("primitive");

	if (allPrimitive == null) {
		return "PRIMITIVE in LEAVES missing";
	}
	if (allPrimitive.length == 0) {
		return "No PRIMITIVES found."
	}

	//Get each Primitive
	for (var i = 0; i < allPrimitive.length; ++i) {
		var primitive = allPrimitive[i]
		var id = this.reader.getString(primitive, "id");
		if (id in this.primitives)
			return "Duplicate primitive id: " + id;

		var type = primitive.children[0].nodeName;
		var primitiveT = primitive.children[0];
		var data=[];
        var param;
        var count = 0;

		//Different types of primitives
		switch (type) {
			case "rectangle":
        if (primitiveT.getAttribute('x1') != null) {
              data[count] = this.reader.getFloat(primitiveT, 'x1', 1);
              count++;
        }
        if (primitiveT.getAttribute('y1') != null && count == 1) {
              data[count] = this.reader.getFloat(primitiveT, 'y1', 1);
              count++;
        }
        if (primitiveT.getAttribute('x2') != null && count == 2) {
              data[count] = this.reader.getFloat(primitiveT, 'x2', 1);
              count++;
        }
        if (primitiveT.getAttribute('y2') != null && count == 3) {
              data[count] = this.reader.getFloat(primitiveT, 'y2', 1);
              count++;
        }
        if (count != 4)
					return "Rectangle with error " + id;
				this.primitives[id] = new LeafRectangle(id, data[0], data[1], data[2], data[3]);
				break;
		case "cylinder":
        if (primitiveT.getAttribute('base') != null) {
              data[count] = this.reader.getFloat(primitiveT, 'base', 1);
              count++;
        }
        if (primitiveT.getAttribute('top') != null && count == 1) {
              data[count] = this.reader.getFloat(primitiveT, 'top', 1);
              count++;
        }
        if (primitiveT.getAttribute('height') != null && count == 2) {
              data[count] = this.reader.getFloat(primitiveT, 'height', 1);
              count++;
        }
        if (primitiveT.getAttribute('slices') != null && count == 3) {
              data[count] = this.reader.getInteger(primitiveT, 'slices', 1);
              count++;
        }
        if (primitiveT.getAttribute('stacks') != null && count == 4) {
              data[count] = this.reader.getInteger(primitiveT, 'stacks', 1);
              count++;
        }
        if (count != 5)
          return "Cylinder with error " + id;
				this.primitives[id] = new LeafCylinder(id, data[0], data[1], data[2], data[3], data[4]);
				break;
			case "sphere":
        if (primitiveT.getAttribute('radius') != null) {
              data[count] = this.reader.getFloat(primitiveT, 'radius', 1);
              count++;
        }
        if (primitiveT.getAttribute('slices') != null && count == 1) {
              data[count] = this.reader.getInteger(primitiveT, 'slices', 1);
              count++;
        }
        if (primitiveT.getAttribute('stacks') != null && count == 2) {
              data[count] = this.reader.getInteger(primitiveT, 'stacks', 1);
              count++;
        }
        if (count != 3)
          return "Sphere with error " + id;
				this.primitives[id] = new LeafSphere(id, data[0], data[1], data[2]);
				break;
      case "torus":
        if (primitiveT.getAttribute('inner') != null) {
              data[count] = this.reader.getFloat(primitiveT, 'inner', 1);
              count++;
        }
        if (primitiveT.getAttribute('outer') != null && count == 1) {
              data[count] = this.reader.getFloat(primitiveT, 'outer', 1);
              count++;
        }
        if (primitiveT.getAttribute('slices') != null && count == 2) {
              data[count] = this.reader.getInteger(primitiveT, 'slices', 1);
              count++;
        }
        if (primitiveT.getAttribute('loops') != null && count == 3) {
              data[count] = this.reader.getInteger(primitiveT, 'loops', 1);
              count++;
        }
        if (count != 4)
          return "Torus with error " + id;
				//this.primitives[id] = new LeafTorus(id, data[0], data[1], data[2], data[3]);
				break;
			case "triangle":
        if (primitiveT.getAttribute('x1') != null) {
              data[count] = this.reader.getFloat(primitiveT, 'x1', 1);
              count++;
        }
        if (primitiveT.getAttribute('y1') != null && count == 1) {
              data[count] = this.reader.getFloat(primitiveT, 'y1', 1);
              count++;
        }
        if (primitiveT.getAttribute('z1') != null && count == 2) {
              data[count] = this.reader.getFloat(primitiveT, 'z1', 1);
              count++;
        }
        if (primitiveT.getAttribute('x2') != null && count == 3) {
              data[count] = this.reader.getFloat(primitiveT, 'x2', 1);
              count++;
        }
        if (primitiveT.getAttribute('y2') != null && count == 4) {
              data[count] = this.reader.getFloat(primitiveT, 'y2', 1);
              count++;
        }
        if (primitiveT.getAttribute('z2') != null && count == 5) {
              data[count] = this.reader.getFloat(primitiveT, 'z2', 1);
              count++;
        }
        if (primitiveT.getAttribute('x3') != null && count == 6) {
              data[count] = this.reader.getFloat(primitiveT, 'x3', 1);
              count++;
        }
        if (primitiveT.getAttribute('y3') != null && count == 7) {
              data[count] = this.reader.getFloat(primitiveT, 'y3', 1);
              count++;
        }
        if (primitiveT.getAttribute('z3') != null && count == 8) {
              data[count] = this.reader.getFloat(primitiveT, 'z3', 1);
              count++;
        }

        if (count != 9)
          return "Rectangle with error " + id;
				this.primitives[id] = new LeafTriangle(id, data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8]);
				break;
			default:
				return "Primitive type unknown: " + type;
		}
	}
}





/*
 *@param rootElement SCENE tag from dsx
 * Parse tag NODES from dsx
 */
DSXSceneGraph.prototype.parseComponents = function(rootElement) {
	//Get components
    var tempComponents =  rootElement.getElementsByTagName("components");
	if (tempComponents == null) {
		return "Components is missing.";
	}

	if (tempComponents.length != 1) {
		return "Only one components is allowed";
	}

	var components = tempComponents[0];

	tempComponent = components.getElementsByTagName("components");

	if (tempComponent == null) {
		return "Component in Components missing";
	}
	if (tempComponents.length == 0) {
		return "No Components found."
	}

	for (var i = 0; i < tempComponent.length; ++i) {
		var component = tempComponent[i];

		error = this.parseComponent(component);
		if (error)
			return error;
	}

	if (!(this.scene.root in this.nodes)) //verificar mais tarde
		return "Component with root id missing";

	for (key in this.nodes) {
		for (var i = 0; i < this.nodes[key].children.length; ++i) {
			var child = this.nodes[key].children[i];
			if (!((child in this.nodes) || (child in this.primitives)))
				return "Child " + child + " is missing";
		}
	}
}

/*
 *@param component
 * Parse each component
 * Called by parseComponents
 */
DSXSceneGraph.prototype.parseComponent = function(component) {
	//Id of node
	var id = this.reader.getString(node, "id");
	console.log(id);
	if (id in this.primitives)
		return "Copy id primitive " + id;
	if (id in this.nodes)
		return "Copy id node " + id;

	this.nodes[id] = new Node(id);

  //Get Local Transformations of Node
  var childNode = node.children[0];
	for (var i = 0; i < childNode.length; ++i) {
		var transformation = childNode.children[i];
		var type = transformation.nodeName;
    if(childNode.length ==1 && type=="transformationref"){
      var idRef = this.reader.getString(transformation, "id");
    }
    else{
  		switch (type) {
  			case "rotate":
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
  			case "scale":
  				var x = this.reader.getFloat(transformation, "x");
  				var y = this.reader.getFloat(transformation, "y");
  				var z = this.reader.getFloat(transformation, "z");
  				this.nodes[id].scale(x, y, z);
  				break;
  			case "translate":
  				var x = this.reader.getFloat(transformation, "x");
  				var y = this.reader.getFloat(transformation, "y");
  				var z = this.reader.getFloat(transformation, "z");
  				this.nodes[id].translate(x, y, z);
  				break;
  			default:
  				return "Unknown transformation: " + type;
  		}
    }
	}
  //Get NODE MATERIALS
	var childNode = node.children[1];
	if (childNode.nodeName != "materials")
		return "Expected MATERIAL in COMPONENT " + id + "in 2st child.";
  for (var i = 0; i < childNode.length; ++i) {
	   var material = childNode.children[i];
     var materialID = this.reader.getString(material, "id");

    	if(!(materialID in this.materials) && materialID != "null")
    		return "No MATERIAL " + materialID +  " for COMPONENT " + id;
      if(i==0)
    	this.nodes[id].setMaterial(material);
  }
	//Get NODE TEXTURE
	childNode = node.children[2];
	if (childNode.nodeName != "texture")
		return "Expected TEXTURE in NODE " + id + "in 3rd child.";
	var texture = this.reader.getString(childNode, "id");

	if(!(texture in this.textures) && texture != "null" && texture != "clear")
		return "No TEXTURE " + texture +  " for NODE " + id;

	this.nodes[id].setTexture(texture);

	//Get children of NODE
	var new_children = node.children[3];
	if (new_children.nodeName != "children")
		return "Expected CHILDREN tag in NODE " + id;

	if (new_children.children.length == 0)
		return "COMPONENT " + id + " as no children";
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

/*
 Vai buscar um array para diversos atributos.
 */
DSXSceneGraph.prototype.getArray = function(element,type) {

	var pos = [];
	var count = 0;

	console.log("type in get array: " + type);

	if(type == "location" || type == "target" || type == "translate" || type =="scale") {


		if (element[0].getAttribute('x') != null) {
			pos[count] = this.reader.getFloat(element[0], 'x', 1);
			count++;
		}

		if (element[0].getAttribute('y') != null) {
			pos[count] = this.reader.getFloat(element[0], 'y', 1);
			count++;
		}

		if (element[0].getAttribute('z') != null) {
			pos[count] = this.reader.getFloat(element[0], 'z', 1);
			count++;
		}

		if (element[0].getAttribute('w') != null) {
			pos[count] = this.reader.getFloat(element[0], 'w', 1);
			count++;
		}

		return pos;
	}

	if(type == "ambient" || type == "diffuse" || type == "specular" || type == "emission")
	{

		if (element[0].getAttribute('r') != null) {
			pos[count] = this.reader.getFloat(element[0], 'r', 1);
			count++;
		}

		if (element[0].getAttribute('g') != null) {
			pos[count] = this.reader.getFloat(element[0], 'g', 1);
			count++;
		}

		if (element[0].getAttribute('b') != null) {
			pos[count] = this.reader.getFloat(element[0], 'b', 1);
			count++;
		}

		if (element[0].getAttribute('a') != null) {
			pos[count] = this.reader.getFloat(element[0], 'a', 1);
			count++;
		}
		if(this.notRGBA(pos[0],pos[1],pos[2],pos[3]))
			return 1;

		return pos;
	}

	if(type == "rotate")
	{
		var axis;
		if(element[0].getAttribute('axis') != null) {


			axis = this.reader.getString(element[0],'axis',1);
			console.log(axis);
			if (axis != "x" && axis != "y" && axis != "z")
				return "eixo inexistente no rotate!";
			else {
				pos[count] = axis;
				count++;
			}
		}

		if(element[0].getAttribute('angle') != null)
		{
			pos[count] = this.reader.getFloat(element[0],'angle', 1);
			count++;
		}
		return pos;
	}

	return 0;

};


DSXSceneGraph.prototype.getPrimitive = function(element,type)
{
    var pos = [];
    var count = 0;

    if(type == "rectangle" || type== "triangle")
    {
        if (element[0].getAttribute('x1') != null) {
            pos[count] = this.reader.getFloat(element[0], 'x1', 1);
            count++;
        }

        if (element[0].getAttribute('y1') != null) {
            pos[count] = this.reader.getFloat(element[0], 'y1', 1);
            count++;
        }

        if(type == "triangle")
        {
            if (element[0].getAttribute('z1') != null) {
                pos[count] = this.reader.getFloat(element[0], 'z1', 1);
                count++;
            }
        }


        if (element[0].getAttribute('x2') != null) {
            pos[count] = this.reader.getFloat(element[0], 'x2', 1);
            count++;
        }

        if (element[0].getAttribute('y2') != null) {
            pos[count] = this.reader.getFloat(element[0], 'y2', 1);
            count++;
        }

        if(type == "triangle")
        {
            if (element[0].getAttribute('z2') != null) {
                pos[count] = this.reader.getFloat(element[0], 'z2', 1);
                count++;
            }

            if (element[0].getAttribute('x3') != null) {
                pos[count] = this.reader.getFloat(element[0], 'x3', 1);
                count++;
            }

            if (element[0].getAttribute('y3') != null) {
                pos[count] = this.reader.getFloat(element[0], 'y3', 1);
                count++;
            }

            if (element[0].getAttribute('z3') != null) {
                pos[count] = this.reader.getFloat(element[0], 'z3', 1);
                count++;
            }
        }

        return pos;

    }
}

DSXSceneGraph.prototype.notBoolean = function(bool)
{
    if(bool == 0 || bool == 1)
        return false;
    return true;
};


/**
 * Verifica se os valores de RGB são válidos.
 */
DSXSceneGraph.prototype.notRGBA = function (r, g, b, a) {
    if(r < 0 || r > 1 || isNaN(r))
        return true;
    if(g < 0 || g > 1 || isNaN(g))
        return true;
    if(b < 0 || b > 1 || isNaN(b))
        return true;
    if(a < 0 || a> 1 || isNaN(a))
        return true;
    return false;
};
