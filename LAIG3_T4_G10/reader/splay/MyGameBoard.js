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
	this.selected = 0;
	this.initBoard();
	this.x = -7;
	this.z = -7;
	this.boardtex = new CGFappearance(scene);
	this.boardtex.loadTexture("scenes/textures/post.png");
	this.selectedtex = new CGFappearance(scene);
	this.selectedtex.loadTexture("scenes/textures/quad_selected.jpg");

  this.dataBoard= [[[],[],[],[],[],[],[],[]],
	                 [[],[],[],[],[],[],[],[]],
                   [[],[],[],[],[],[],[],[]],
                   [[],[],[],[],[],[],[],[]],
                   [[],[],[],[],[],[],[],[]],
                   [[],[],[],[],[],[],[],[]],
                   [[],[],[],[],[],[],[],[]],
                   [[],[],[],[],[],[],[],[]]];
 };

 MyGameBoard.prototype = Object.create(CGFobject.prototype);
 MyGameBoard.prototype.constructor = MyGameBoard;

 MyGameBoard.prototype.display = function() {
	 var p = 1;
 	for(i=0; i < 8; i++){
		for(j=0;j<8;j++){
			this.scene.pushMatrix();
				if (p == this.selected){this.selectedtex.apply();}
				else{this.boardtex.apply();}
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

 MyGameBoard.prototype.changeSelected=function(selectedID){
 	this.selected = selectedID;
 }

 MyGameBoard.prototype.addCheckerToDB=function(checkerID,x,z){
   var y = this.dataBoard[x][z].length;
   this.dataBoard[x][z][y] = checkerID;
   return y;
 }

 MyGameBoard.prototype.getCheckers=function(x,z){
   return this.dataBoard[x][z];
 }

 MyGameBoard.prototype.emptyHouse=function(x,z){
   this.dataBoard[x][z] = [];
 }

  MyGameBoard.prototype.getCheckers=function(x,z){
   return this.dataBoard[x][z];
 }

  MyGameBoard.prototype.deleteChecker=function(x,z,y){
   var checkerSize = this.dataBoard[x][z].length;
   var newtop = [];
   var j=0;
   for (var i = y;i<checkerSize-1;i++){
   	this.dataBoard[x][z][i] = this.dataBoard[x][z][i+1];
   	newtop[j] = this.dataBoard[x][z][i+1];
   	j++;

   }
   this.dataBoard[x][z][checkerSize-1] = [];
   return newtop;
 }

	MyGameBoard.prototype.checkColor=function(x,z){
		if(this.dataBoard[x][z][this.dataBoard[x][z].length-1]>82) return 1;
		return 0;
	}

	MyGameBoard.prototype.getBoardInString=function(){
		var boardinstring = "[";
			for(var z = 0;z<this.dataBoard[x].length;z++){
				}
			}
		return boardinstring;
	}

	MyGameBoard.prototype.getColor=function(x,z,y){
		if(this.dataBoard[x][z][y]>82) return 1;
		else if(this.dataBoard[x][z][y]<83) return 0;
	}