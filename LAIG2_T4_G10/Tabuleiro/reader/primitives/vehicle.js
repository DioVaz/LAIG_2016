function Vehicle(scene)
{
	CGFobject.call(this,scene);
	this.scene = scene;
	this.frenteBot = new FrenteBot(scene,4,5,30,30);
	this.frenteTop = new FrenteTop(this.scene,4,5,30,30);
	
	this.centroTop = new CentroTop(this.scene,6,5,30,30);
	this.centroBoT = new CentroBot(this.scene,6,5,30,30);
	this.trasTop = new TrasTop(this.scene,4,5,30,30);
	this.trasBot = new TrasBot(this.scene,4,5,30,30);

	
	
	
}

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.display = function() {
	this.scene.pushMatrix();
	this.scene.translate(-2.9,0,0);
	this.frenteBot.display();
	this.frenteTop.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.scene.translate(3,0,0);
	this.trasTop.display();
	this.trasBot.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	this.centroBoT.display();
	this.centroTop.display();
	this.scene.popMatrix();
	
}
Vehicle.prototype.scaleTexCoords = function(ampS, ampT) {
}
