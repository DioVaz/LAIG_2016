/**
 * MyQuad
 * @constructor
 */
 function MyQuad(scene, x, z, mins, maxs,mint, maxt) {
 	CGFobject.call(this,scene);

	this.x = x || 0;
	this.z = z || 0;
	this.mins = mins||0.0;
	this.mint = mint||0.0;
	this.maxs = maxs||1.0;
	this.maxt = maxt||1.0;
 	this.initBuffers();
 };

 MyQuad.prototype = Object.create(CGFobject.prototype);
 MyQuad.prototype.constructor = MyQuad;

 MyQuad.prototype.initBuffers = function() {
 	this.vertices = [
 	-0.5, -0.5, 0,
 	0.5, -0.5, 0,
 	-0.5, 0.5, 0,
 	0.5, 0.5, 0
 	];

 	this.indices = [
 	0, 1, 2,
 	3, 2, 1
 	];


    this.texCoords = [
		this.mins, this.maxt,
		this.maxs, this.maxt,
		this.mins, this.mint,
		this.maxs, this.mint
	];
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

 MyQuad.prototype.changecoords = function(x,z){
	 this.x = x;
	 this.z = z;
 }
