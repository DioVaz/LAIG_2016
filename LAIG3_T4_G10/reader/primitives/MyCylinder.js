/**
 * MyCylinder
 * @constructor
 */
function MyCylinder(scene, height, bRadius, tRadius, stacks, slices) {
	 CGFobject.call(this,scene);
	 
    this.slices = slices || 16;
    this.stacks = stacks || 16;
    this.tRadius = tRadius || 1;
    this.bRadius = bRadius || 1;
    this.height = height || 1;


    this.cylinder = new MyCylinderAux(scene, this.height, this.bRadius, this.tRadius, this.stacks, this.slices) ;
    this.cylinder.initBuffers();

    this.topFace = new MyCircle(scene, this.tRadius, this.slices);
 	 this.topFace.initBuffers();

    this.botFace = new MyCircle(scene, this.bRadius, this.slices);
 	this.botFace.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.display = function()
{
    this.scene.pushMatrix();
	
	this.scene.rotate(Math.PI/2,1,0,0);
    this.scene.translate(0, 0, this.height/2);

    this.scene.pushMatrix();
    this.scene.translate(0, 0, this.height/2);
    this.topFace.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, 0, -this.height/2);
    this.scene.rotate(Math.PI,1,0,0);
    this.botFace.display();    
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.cylinder.display();
    this.scene.popMatrix();
    this.scene.popMatrix();
};

MyCylinder.prototype.scaleTexCoords = function(S, T) {
    this.cylinder.scaleTexCoords(S, T);
};