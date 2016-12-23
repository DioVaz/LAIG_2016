var degToRad = Math.PI / 180.0;
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

   // this.initLights();
    this.primitives;
    this.views;
    this.components;
    this.loadedOk;


    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
   this.setGlobalAmbientLight(0.5,0.5,0.5,0.5);
    this.texture = new CGFappearance(this);
    this.texture.loadTexture("scenes/texture/stoneWall.png");
    this.enableTextures(true);
	this.axis=new CGFaxis(this);
};



XMLscene.prototype.initLights = function () {

	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].setSpecular(1,1,1,1);
    this.lights[0].enable();
    this.lights[0].update();
};

XMLscene.prototype.initCameras = function () {

    //CGFcamera(CGFcamera( fov, near, far, position, target ));
    //fov = angle
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(1,1,100), vec3.fromValues(0, 0, 0));
};








XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function ()
{
	/*this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);*/
	this.lights[0].setVisible(true);
    this.lights[0].enable();
    //console.log(this.grapg.views.length);
    this.primitives = this.graph.primitives;
    this.components = this.graph.components;
    this.tranformations = this.graph.transformations;


    console.log("HELLLO!");
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();
   // var torus = new Torus();
     var sphere = new MySphere(this,1,4,2);
    var torus = new MyTorus(this,0.5,3,10,10);
     var cylinder = new MyCylinder(this,3,3,3,10,10);
   //  var triangulo = new MyTriangle(this,0,0,0,3,0,0,0,3,0);
     var rectangulo = new MyRectangle(this,4,4,0,0);
   // var fullCylinder = new MyCylinder(this,4,2,2,16,16);


   // this.setDefaultAppearance();


	 //Draw axis
	this.axis.display();
  //  fullCylinder.display();
  // this.texture.apply();


  // torus.display();

//  rectangulo.display();

    //triangulo.display();

    //sphere.display();

//  cylinder.display();

    //console.log("posicao camera: "+this.camera.getCurrentPosition());
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it


	if (this.loadedOk)
	{
	   // console.log("entrou");
		//this.lights[0].update();

        //console.log(this.components);
        this.displayComponents();


     }


};

XMLscene.prototype.displayComponents = function ()
{
    for(c in this.components) {
        this.pushMatrix();


        this.displayComponent(c);

        this.popMatrix();

    }

}



XMLscene.prototype.displayComponent = function(componentName)
{
    var component,componentsRef, transformationsRef, primitivesRef,ref;
    //console.log(this.components[componentName].isPainted());

    if(!this.components[componentName].isPainte())
    {
        component = this.components[componentName];
        transformationsRef = component.transformationsRef;

        if(!transformationsRef.length);
        this.pushTransformations(transformationsRef);

        this.multMatrix(component.localTransformations);

        primitivesRef = component.getPrimitivesRef();
        this.displayPrimitives(primitivesRef);

        componentsRef = component.getComponentsRef();

        for(c in componentsRef)
            this.displayComponent(componentsRef[c]);

    }

    this.components[componentName].paint();
}

XMLscene.prototype.pushTransformations= function (transformations)
{
    for(t in transformations)
        this.multMatrix((this.tranformations[transformations[t]]).localTransformations);

}

XMLscene.prototype.displayPrimitives = function (primitivesRef)
{
    for (p in primitivesRef)
    {
        ref = primitivesRef[p];
        this.primitives[ref].display();
    }
}
