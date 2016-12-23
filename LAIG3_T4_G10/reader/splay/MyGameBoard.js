/**
 * MyGameBoard
 * @constructor
 */
 function MyGameBoard(scene) {
 	CGFobject.call(this, scene);
	this.quad_vec=[];
	for(var i=0; i<8; i++) {
		this.quad_vec[i] = new Array(8);
	}
	this.initBoard();
	this.x = -7;
	this.z = -7;
	this.boardtex = new CGFappearance(scene);
	this.boardtex.loadTexture("scenes/textures/post.png");
 };

 MyGameBoard.prototype = Object.create(CGFobject.prototype);
 MyGameBoard.prototype.constructor = MyGameBoard;

 MyGameBoard.prototype.display = function() {
	 var p = 1;
 	for(i=0; i < 8; i++){
		for(j=0;j<8;j++){
			this.scene.pushMatrix();
				this.boardtex.apply();
				this.scene.translate(this.x, 0.2,this.z);
				this.scene.rotate(-Math.PI/2, 1,0,0);
				this.scene.scale(2,2,2);
				this.scene.registerForPick(p, this.quad_vec[i][j]);
				p++;
				this.quad_vec[i][j].display();
			this.scene.popMatrix();
			this.z+=2;
		}
		this.z = -7;
		this.x+=2;
	}
	this.x = -7;
	this.z = -7;

 };

 MyGameBoard.prototype.initBoard = function(){
	 for(i=0; i < 8; i++){
		for(j=0;j<8;j++){
			var quad = new MyQuad(this.scene, i, j);
			this.quad_vec[i][j] = quad;
		}
	}
 }
