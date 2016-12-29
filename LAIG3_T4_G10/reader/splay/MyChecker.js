/**
 * MyChecker
 * @constructor
 */
 function MyChecker(scene, app, rb, x, z, y) {    // rb ->  1 = black, 0 = white
 	CGFobject.call(this, scene);

	this.rb = rb;
	this.tex = app;
	this.picked = 0;
	this.where_at = 0; // Board = 0; OffBoard = 1;
	this.x = x;
	this.z = z;
  	this.y = y;
	this.x_coord;
	this.z_coord;
  	this.y_coord;
	this.nextx;
	this.nextz;
  	this.nexty;
	this.LinAnim;
 	this.piece = new  MyCylinder(scene, 0.5, 0.8, 0.8, 10, 20);
 };

 MyChecker.prototype = Object.create(CGFobject.prototype);
 MyChecker.prototype.constructor = MyChecker;

 MyChecker.prototype.display = function() {
	 //if it is in board
	 this.tex.apply();
	 if(this.where_at == 0){
  	 this.calculate_spacial_coords();
  	 this.scene.pushMatrix();
  		this.scene.translate(this.x_coord,this.y_coord,this.z_coord);
  		 if(this.LinAnim != null && this.LinAnim.end == 0){
  			this.LinAnim.doAnimation();
  			this.scene.multMatrix(this.LinAnim.move());
  		 }
  		 if((this.rb == 0 && this.scene.registerbluestones) || (this.rb == 1 && this.scene.registerredstones))
  			this.scene.clearPickRegistration();
  		this.piece.display();
  	this.scene.popMatrix();
	 }
 	// TO DO
 };


 MyChecker.prototype.calculate_spacial_coords = function(){
	 this.x_coord = -7 + (this.x * 2);
	 this.z_coord = -7 + (this.z * 2);
	 this.y_coord = 0.7 + (this.y * 0.5);
 };

 MyChecker.prototype.change_coords = function(new_x, new_z, new_y){
     var new_x_coord = -7 + (new_x * 2);
     var new_z_coord = -7 + (new_z * 2);
     var new_y_coord = 0.7 + (new_y * 0.5);
     //PC's = [[origem],[subir em y],[deslocamento xz],[descer em y]]
     var PCs = [[this.x_coord,this.y_coord,this.z_coord],[this.x_coord,5.7,this.z_coord],[new_x_coord,5.7,new_z_coord],[new_x_coord,new_y_coord,new_z_coord]];
		 var llinAnim = new LinearAnimation(this.scene, 7, PCs);
		 this.addAnimation(llinAnim);
		 this.x = new_x;
		 this.z = new_z;
		 this.y = new_y;
 };

 MyChecker.prototype.addAnimation = function(Anim){
	 this.LinAnim = Anim;
 };
