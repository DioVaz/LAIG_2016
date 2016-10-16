/**
 * Created by ruben on 27/09/2016.
 */

function GraphSceneDSX(filename, scene) {
    this.loadedOk = null;

    this.scene = scene;
    this.illumination =new Illumination();
    this.graph = new GraphDSX();
    scene.graph = this.graph;
    this.reader = new CGFXMLreader();
    this.filename = 'scenes/'+filename;

    this.reader.open('scenes/'+filename, this);

};




/*
 * Function called if the XML was sucessful read
 */
GraphSceneDSX.prototype.onXMLReady=function()
{
    console.log("XML Loading finished.");

    var rootElement = this.reader.xmlDoc.documentElement;


    var error = this.parseSceneGraph(rootElement);

    if (error != null) {
        this.onXMLError(error);
        return;
    }

    this.loadedOk=true;
    this.scene.loadedOk = true;
    console.log("loadedd true");

    this.scene.onGraphLoaded();
};


/*
 *@param rootElement SCENE tag from dsx
 * Parser of the dsx file
 */
GraphSceneDSX.prototype.parseSceneGraph = function(rootElement) {


    if (rootElement.nodeName != "dsx") {
        return "Not a DSX file";
    }

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
    error = this.parseComponents(rootElement);
    if (error) {
        return error;
    }

    console.log("**************");
    console.log(this.graph);
    this.loadedOk = true;
}


GraphSceneDSX.prototype.parseScene = function(rootElement) {
    //Get SCENE
    var sceneTemp =  rootElement.getElementsByTagName("scene");
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


    //Get SCENE - axis_length
    this.graph.referenceLength = this.reader.getString(scene, "axis_length");
    if (this.graph.referenceLength == null)
        return "axis_length is missing.";
    if (isNaN(this.graph.referenceLength))
        return "axis_length is NaN.";
}



GraphSceneDSX.prototype.parseViews = function (rootElement) {

    var viewsElement = rootElement.getElementsByTagName('views');
    var perspectivesCollection = viewsElement[0].getElementsByTagName('perspective');
    var perspectivesLength = perspectivesCollection.length;


    var i, id, near, far, angle, fromTag, toTag;
    var to = [];
    var from = [];


    for(i=0;i<perspectivesLength;i++){

        id = this.reader.getString(perspectivesCollection[i],'id',1);
        near = this.reader.getFloat(perspectivesCollection[i], 'near', 1);
        far = this.reader.getFloat(perspectivesCollection[i], 'far', 1);
        angle = this.reader.getFloat(perspectivesCollection[i], 'angle', 1);
        fromTag = perspectivesCollection[0].getElementsByTagName('from');

        if(fromTag != null && fromTag.length != 0){

            from[0] = this.reader.getFloat(fromTag[0],'x',1);
            from[1] = this.reader.getFloat(fromTag[0],'y',1);
            from[2] = this.reader.getFloat(fromTag[0],'z',1);

        }

        toTag = perspectivesCollection[0].getElementsByTagName('to');

        if(toTag != null && toTag.length != 0){

            to[0] = this.reader.getFloat(toTag[0], 'x', 1);
            to[1] = this.reader.getFloat(toTag[0],'y',1);
            to[2] = this.reader.getFloat(toTag[0],'z',1);

        }

        this.graph.addView(angle,near,far,from,to,id);

        fromTag = null;
        toTag = null;
        from = [];
        to = [];
        id = null;
        near = null;
        far = null;
        angle = null;

    }


}

GraphSceneDSX.prototype.parseIllumination = function(rootElement) {
    //console.log("parseIllumination");

    var illuminationTag = rootElement.getElementsByTagName('illumination');

    if(illuminationTag == null) {
        return "illumination tag not founded";
    }

    var ambientValues = illuminationTag[0].getElementsByTagName('ambient');
    if(ambientValues == null){
        return "ambient tag is missing.";
    }

    var backgroundValues = illuminationTag[0].getElementsByTagName('background');

    if(backgroundValues == null){
        return "background tag is missing";
    }


    var ambient = [];
    var background = [];


    ambient[0] = this.reader.getFloat(ambientValues[0], 'r', 1);
    ambient[1] = this.reader.getFloat(ambientValues[0], 'g', 1);
    ambient[2] = this.reader.getFloat(ambientValues[0], 'b', 1);
    ambient[3] = this.reader.getFloat(ambientValues[0], 'a', 1);
    if(this.notRGBA(ambient[0],ambient[1],ambient[2],ambient[3]))
        return "ambient values are wrong!";

    background[0] = this.reader.getFloat(backgroundValues[0], 'r', 1);
    background[1] = this.reader.getFloat(backgroundValues[0], 'g', 1);
    background[2] = this.reader.getFloat(backgroundValues[0], 'b', 1);
    background[3] = this.reader.getFloat(backgroundValues[0], 'a', 1);

    if(this.notRGBA(background[0],background[1],background[2],background[3]))
        return "background values are wrong!";

    this.illumination.background = background;
    this.illumination.ambient = ambient;
    this.graph.illumination = this.illumination;
    return 0;

};


GraphSceneDSX.prototype.parseLights = function (rootElement) {

    //console.log("parsing ligths!!");

    var lightsTag = rootElement.getElementsByTagName('lights');

    if(lightsTag == null)
        return "Lights tag not founded!";

    var omnis = lightsTag[0].getElementsByTagName('omni');
    if(omnis[0] == null)
        return "any omnis founded";

    var spots = lightsTag[0].getElementsByTagName('spot');
    if(spots[0] == null)
        return "any spots founded";



    var parseOmnisReturn = this.parseOmnis(omnis);
    /*if(parseOmnisReturn != 0)
     return parseOmnisReturn;*/
    this.parseSpots(spots);

    return 0;

};

GraphSceneDSX.prototype.parseOmnis = function(omnisElement) {

    var omnisLength = omnisElement.length;

    var location,ambient, diffuse, specular = [];
    var i, id, enable;

    for( i =0; i < omnisLength; i++){

        id = this.reader.getString(omnisElement[i],'id',1);

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

    this.graph.addOmni(this.scene,id,location,ambient,diffuse,specular,enable);

    }

};

GraphSceneDSX.prototype.parseSpots = function(spotsElement) {


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

        this.graph.addSpot(this.scene,id,location,ambient,diffuse,specular,enable,expoente,angle,target);

    }




};

/*
 *@param rootElement SCENE tag from dsx
 * Parse tag TEXTURES from dsx
 */


GraphSceneDSX.prototype.parseTextures = function(rootElement) {
    //Get TEXTURES
    var tempText =  rootElement.getElementsByTagName("textures");
    if (tempText == null) {
        return "TEXTURES is missing.";
    }

    var textures = tempText[0];

    var texture = textures.getElementsByTagName("texture");

    if (texture == null) {
        return ("TEXTURE in TEXTURES missing");
        return;
    }
    if (texture.length == 0) {
        return ("No Texture in TEXTURES.");
        return;
    }

    //Relative path to file with textures (images)
    var pathRel = this.filename.substring(0, this.filename.lastIndexOf("/"));

    for (var i = 0; i < texture.length; ++i) {
        var NewTexture = texture[i];
        var id = this.reader.getString(NewTexture, "id");
        if (id in this.graph.textures)
            return "Duplicate texture id: " + id;

        var path = pathRel + '/' + this.reader.getString(NewTexture, "file");
        var s = this.reader.getFloat(NewTexture, "length_s");
        var t = this.reader.getFloat(NewTexture, "length_t");
        this.graph.textures[id] = new Texture(this.scene, path, id);
        this.graph.textures[id].setAmplifyFactor(s,t);
    }
};


/*
 *@param rootElement SCENE tag from dsx
 * Parse tag MATERIALS from dsx
 */
GraphSceneDSX.prototype.parseMaterials = function(rootElement) {
    //Get MATERIALS
    var tempMat =  rootElement.getElementsByTagName("materials");
    if (tempMat == null) {
        return "MATERIALS is missing.";
    }


    var materials = tempMat[0].getElementsByTagName('material');
    var emission = [];
    var ambient = [];
    var specular = [];
    var diffuse = [];
    var material,data;
    //Get each material
    for(var i = 0; i < materials.length; ++i){

        var materialTag = materials[i];

        var id = this.reader.getString(materialTag,"id");

        if (id in this.graph.materials)
            return "Duplicate material id: " + id;

        material = new Material(this.scene,id);



        emission = this.getRGBA(materialTag.getElementsByTagName('emission')[0]);
        material.setEmission(emission[0],emission[1],emission[2],emission[3]);

        ambient = this.getRGBA(materialTag.getElementsByTagName('ambient')[0]);
        material.setAmbient(ambient[0],ambient[1],ambient[2],ambient[3]);

        diffuse = this.getRGBA(materialTag.getElementsByTagName('diffuse')[0]);
        material.setDiffuse(diffuse[0],diffuse[1],diffuse[2],diffuse[3]);

        specular = this.getRGBA(materialTag.getElementsByTagName('specular')[0]);
        material.setSpecular(specular[0],specular[1],specular[2],specular[3]);


        var shininess = materialTag.getElementsByTagName('shininess')[0];
        var value= this.reader.getFloat(shininess,"value");
        material.setShininess(value);
        this.graph.materials[id] = material;
    }
};



GraphSceneDSX.prototype.parseTransformations = function(rootElement) {

    var transformationElement = rootElement.getElementsByTagName('transformations');

    var transformationsElement = transformationElement[0].getElementsByTagName('transformation');
    var transformationsLength = transformationsElement.length;



    var id, i;
    var translate,rotate,scale = [];
    var translateTag,rotateTag,scaleTag;
    var transformation = new Transformation();
    for( i = 0 ; i < transformationsLength ; i++ )
    {
        transformation = new Transformation();
        id = this.reader.getString(transformationsElement[i],'id',1);
        if(id == null)
            return "id not founded in parse transformations";

        translateTag = transformationsElement[i].getElementsByTagName('translate');
        if(translateTag != null && translateTag.length > 0) {
            translate = this.getArray(translateTag, "translate");
            transformation.translate(translate[0], translate[1], translate[2]);
        }


        scaleTag = transformationsElement[i].getElementsByTagName('scale')
        console.log(scaleTag);
        if(scaleTag != null && scaleTag.length > 0) {
            scale = this.getArray(scaleTag, "scale");
            transformation.scale(scale[0], scale[1], scale[2]);
        }

        rotateTag = transformationsElement[i].getElementsByTagName('rotate');
        if(rotateTag != null && rotateTag.length > 0) {
            rotate = this.getArray(rotateTag, "rotate");

            switch (rotate[0]) {
                case 'x':
                    transformation.rotateX(rotate[1]);
                    break;
                case 'y':
                    transformation.rotateY(rotate[1]);
                    break;
                case 'z':
                    transformation.rotateZ(rotate[1]);
                    break;

            }
        }
        transformation.id = id;
        this.graph.transformations[id] = transformation;
        translateTag = null;
        scaleTag = null;
        rotateTag = null;
        translate = [];
        scale = [];
        rotate = [];


    }
    return 0;
};

GraphSceneDSX.prototype.parsePrimitives = function(rootElement)
{
    var primitiveElement = rootElement.getElementsByTagName('primitives');
    var primitivesCollection = (primitiveElement[0].getElementsByTagName('primitive'));
    var primitivesLength = primitivesCollection.length;

    var i,id,auxiliarTag;
    var primitive;
    var type;
    for( i = 0; i < primitivesLength ; i++)
    {
        id = this.reader.getString(primitivesCollection[i],'id',1);
        if (id in this.graph.primitives)
            return "Duplicate primitive id: " + id;


        type = primitivesCollection[i].children[0].nodeName;

        primitive = this.getPrimitive(primitivesCollection[i].children[0],type);
        if(primitive == "getting primitive atributes")
            return "error parsing " + id;
        this.graph.primitives[id] = primitive;


    }


    return 0;

};



/*
 *@param rootElement SCENE tag from dsx
 * Parse tag NODES from dsx
 */
GraphSceneDSX.prototype.parseComponents = function(rootElement) {
  //Get components
    var tempComponents =  rootElement.getElementsByTagName("components");
  if (tempComponents == null) {
    return "Components is missing.";
  }

  if (tempComponents.length != 1) {
    return "Only one components is allowed";
  }

  var components = tempComponents[0].getElementsByTagName("component");

  if (components == null) {
    return "Component in Components missing";
  }
  if (components.length == 0) {
    return "No Components found."
  }

  for (var i = 0; i < components.length; ++i) {
    var component = components[i];

    error = this.parseComponent(component);
    if (error)
      return error;
  }

  if (!(this.scene.root in this.graph.components))
    return "Component with root id missing";

  for (key in this.graph.components) {
    for (var i = 0; i < this.graph.components[key].children.length; ++i) {
      var child = this.graph.components[key].children[i];
      if (!((child in this.graph.components) || (child in this.graph.primitives)))
        return "Child " + child + " is missing";
    }
  }
};

GraphSceneDSX.prototype.parseComponent = function (component) {
  //Id of node
  var id = this.reader.getString(component, "id");
  console.log(id);
  var test1 = this.graph.primitives[id];
  var teste = this.graph.components[id];
  if (test1 != null)
    return "Copy id primitive " + id;
  if (teste != null)
    return "Copy id node " + id;

  var newComponent = new Component();
  newComponent.setId(id);

  //Get Local Transformations of Node
  var childNode = component.children[0];
  for (var i = 0; i < childNode.children.length; ++i) {
    var transformation = childNode.children[i];
    var type = transformation.nodeName;
    if(childNode.children.length ==1 && type=="transformationref"){
      var idRef = this.reader.getString(transformation, "id");
    }
    else{
      switch (type) {
        case "rotate":
          var axis = this.reader.getString(transformation, "axis");
          var angle = this.reader.getFloat(transformation, "angle");
            switch (axis) {

              case "x":
                newComponent.rotateX(angle * deg2rad);
                break;
              case "y":
                newComponent.rotateY(angle * deg2rad);
                break;
              case "z":
                newComponent.rotateZ(angle *deg2rad);
                break;
              default:
                return "Unknown rotation axis: " + axis;
            }
          break;
        case "scale":
          var x = this.reader.getFloat(transformation, "x");
          var y = this.reader.getFloat(transformation, "y");
          var z = this.reader.getFloat(transformation, "z");
          newComponent.scale(x, y, z);
          break;
        case "translate":
          var x = this.reader.getFloat(transformation, "x");
          var y = this.reader.getFloat(transformation, "y");
          var z = this.reader.getFloat(transformation, "z");
          newComponent.translate(x, y, z);
          break;
        default:
          return "Unknown transformation: " + type;
      }
    }
  }
  //Get NODE MATERIALS
  var childNode = component.children[1];
  if (childNode.nodeName != "materials")
    return "Expected MATERIAL in COMPONENT " + id + "in 2st child.";
  for (var i = 0; i < childNode.children.length; ++i) {
     var material = childNode.children[i];
     var materialID = this.reader.getString(material, "id");

      if(!(materialID in this.graph.materials) && materialID != "inherit")
        return "No MATERIAL " + materialID +  " for COMPONENT " + id;
      if(i==0)
      newComponent.setMaterial(material);
  }
  //Get NODE TEXTURE
  childNode = component.children[2];
  if (childNode.nodeName != "texture")
    return "Expected TEXTURE in NODE " + id + "in 3rd child.";
  var texture = this.reader.getString(childNode, "id");

  if(!(texture in this.graph.textures) && texture != "null" && texture != "clear")
    return "No TEXTURE " + texture +  " for NODE " + id;

  newComponent.setTexture(texture);

  //Get children of NODE
  var new_children = component.children[3];
  if (new_children.nodeName != "children")
    return "Expected CHILDREN tag in NODE " + id;

  if (new_children.children.length == 0)
    return "COMPONENT " + id + " as no children";
  for (var i = 0; i < new_children.children.length; ++i) {
    var new_child = this.reader.getString(new_children.children[i], "id");
    newComponent.addChild(new_child);
  }
  this.graph.components[id] = newComponent;
};



GraphSceneDSX.prototype.getPrimitive = function(primitive, type)
{
    var error = "getting primitive atributes";
    var slices,stacks;
    if(type == "rectangle" || type== "triangle")
    {
        var x1;
        if (primitive.getAttribute('x1') != null)
            x1 = this.reader.getFloat(primitive, 'x1', 1);
        else
            return error + "x1";

        var y1;
        if (primitive.getAttribute('y1') != null)
            y1 = this.reader.getFloat(primitive, 'y1', 1);
        else
            return error + "y1";



        if(type == "triangle")
        {

            var z1;
            if (primitive.getAttribute('z1') != null)
                z1 = this.reader.getFloat(primitive, 'z1', 1);
            else
                return error+ " z1";

        }

        var x2;
        if (primitive.getAttribute('x2') != null)
            x2 = this.reader.getFloat(primitive, 'x2', 1);
        else
            return error + " x2";

        var y2;
        if (primitive.getAttribute('y2') != null)
            y2 = this.reader.getFloat(primitive, 'y2', 1);
        else
            return error + "y2";


        if(type == "triangle")
        {
            var error = "parsing triangle";

            var z2,x3,y3,z3;
            if (primitive.getAttribute('z2') != null)
               z2 = this.reader.getFloat(primitive, 'z2', 1);
            else
            return error + " z2";

            if (primitive.getAttribute('x3') != null)
                x3 = this.reader.getFloat(primitive, 'x3', 1);
            else
                return error + "x3";

            if (primitive.getAttribute('y3') != null)
               y3 = this.reader.getFloat(primitive, 'y3', 1);
            else
                return error + "y3";

            if (primitive.getAttribute('z3') != null)
               z3 = this.reader.getFloat(primitive, 'z3', 1);
            else
                return error + " z3";

            return (new MyTriangle(this.scene,x1,y1,z1,x2,y2,z2,x3,y3,z3));
        }

            var rectangle = new MyRectangle(this.scene,x1,y1,x2,y2);
           return rectangle;


    }

    if(type == "cylinder") {

        var base, top, height;

        if (primitive.getAttribute('base') != null)
            base = this.reader.getFloat(primitive, 'base', 1);
        else
            return error;

        if (primitive.getAttribute('top') != null)
            top = this.reader.getFloat(primitive, 'top', 1);
        else
            return error;

        if (primitive.getAttribute('height') != null)
            height = this.reader.getFloat(primitive, 'height', 1);
        else
            return error;

        if (primitive.getAttribute('slices') != null)
            slices = this.reader.getInteger(primitive, 'slices', 1);
        else
            return error;

        if (primitive.getAttribute('stacks') != null)
            stacks = this.reader.getInteger(primitive, 'stacks', 1);
        else
            return error;

        var cylinder = new MyCylinder(this.scene, height, base, top, stacks, slices);
        return cylinder;
    }
    if(type == "sphere")
    {

        var radius;
        if (primitive.getAttribute('radius') != null)
            radius = this.reader.getFloat(primitive, 'radius', 1);
        else
            return error;


        if (primitive.getAttribute('slices') != null)
            slices = this.reader.getInteger(primitive, 'slices', 1);
        else
            return error;

        if (primitive.getAttribute('stacks') != null)
            stacks = this.reader.getInteger(primitive, 'stacks', 1);
        else
            return error;
        console.log(radius + " " + slices + " " + stacks);
        var sphere = new MySphere(this.scene,radius,slices,stacks);
        return sphere;
    }

    if(type == "torus")
    {

        var inner,outer,loops;
        if (primitive.getAttribute('inner') != null)
            inner = this.reader.getFloat(primitive, 'inner', 1);
        else
            return error;

        if (primitive.getAttribute('outer') != null)
            outer = this.reader.getFloat(primitive, 'outer', 1);
        else
            return error;

        if (primitive.getAttribute('slices') != null)
            slices = this.reader.getInteger(primitive, 'slices', 1);
        else
            return error;

        if (primitive.getAttribute('loops') != null)
            loops = this.reader.getInteger(primitive, 'loops', 1);
        else
            return error;

        var torus = new MyTorus(this.scene,inner,outer,slices,loops);
        return torus;
    }


};





GraphSceneDSX.prototype.getArray = function(element, type) {

    var pos = [];
    var count = 0;



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


GraphSceneDSX.prototype.getRGBA = function(color) {

    var r,b,g,a;
    if (color == null) {
        console.error("color is null");
        return null;
    }


    r = this.reader.getFloat(color,'r',1);
    if (r == null) {
        console.error("R is null");
        return null;
    }

    g = this.reader.getFloat(color,'g',1);
    if (g == null) {
        console.error("G is null");
        return null;
    }

    b = this.reader.getFloat(color,'b',1);
    if (b == null) {
        console.error("B is null");
        return null;
    }

    a = this.reader.getFloat(color,'a',1);;
    if (a == null) {
        console.error("A is null");
        return null;
    }

    return [r,g,b,a];
}

GraphSceneDSX.prototype.notNumeric = function(num) {
    if(num==null)
        return true;
    for(var i = 0; i < arguments.length ; i++)
    {
        if(isNaN(num[i]))
            return true;
    }
    return false;
};





/**
 * Verifica se os valores de RGB são válidos.
 */
GraphSceneDSX.prototype.notRGBA = function (r, g, b, a) {
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

/*
 * Callback to be executed on any read error
 */


GraphSceneDSX.prototype.notBoolean = function(bool)
{
    if(bool == 0 || bool == 1)
        return false;
    return true;
};


GraphSceneDSX.prototype.onXMLError = function (message) {
    console.error("XML Loading Error: "+message);
    this.loadedOk=false;
};
