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
		 var xdesl = new_x-this.x;
		 var zdesl = new_z- this.z;
     var ydesl = new_y- this.y;
     //acrescentar deslocamento y para subir antes de mover na horizontal
     //ponto de subida
     //deslocamento horizontal
     //ponto de descida
     //mudar para offboard a peça em caso de captura
		 if(xdesl==0 && zdesl!=0)
			 var PCs = [[0,0,0], [0,3,0], [0,3,zdesl*2], [0,0,zdesl*2]];
		 else if(xdesl != 0 && zdesl==0)
			 var PCs = [[0,0,0], [0,3,0], [xdesl*2,3,0], [xdesl*2,0,0]];
		 else if(xdesl == 0 && zdesl==0)
			 var PCs = [[0,0,0], [0,3,0], [0,0,0]];
		 else
			var PCs = [[0,0,0], [0,3,0], [xdesl*2, 3, 0], [xdesl*2, 3, zdesl*2], [xdesl*2, 0, zdesl*2]];
		 var llinAnim = new LinearAnimation(this.scene, 2, PCs);
		 this.addAnimation(llinAnim);
		 this.nextx = new_x;
		 this.nextz = new_z;
 };

 MyChecker.prototype.addAnimation = function(Anim){
	 this.LinAnim = Anim;
 };
