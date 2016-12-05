function CentroBot(scene, orderU, orderV, partsU, partsV) {
    CGFobject.call(this,scene);

    this.orderU = orderU;
    this.orderV = orderV;
    this.partsU = partsU;
    this.partsV = partsV;
	this.controlPoints = 
    [	
					     [ // V = 0..1;
                             [  -3 , -1, 0, 1 ],
                             [ -3, -1, 1, 1 ],
							 [ -3, -1, 2, 1 ],
							 [ -3, -1, 3, 1 ],
							 [ -3, -0.4, 3, 1 ],
							 [ -3, 1.5, 2.85, 1 ]                                               
                        ],
                        // U = 1
                        [ // V = 0..1
                            [   -2, -1, 0, 1 ],
                             [  -2, -1, 1, 1 ],
							 [  -2, -1, 2, 1 ],
							 [  -2,0-1, 3, 1 ],
							 [  -2, -0.4, 3, 1 ],
							 [  -2, 1.5, 2.85, 1 ]                                               
                        ],
                        // U = 2
                        [ // V = 0..1                            
                                 [  -1 , -1, 0, 1 ],
                             [ -1, -1, 1, 1 ],
							 [ -1, -1, 2, 1 ],
							 [ -1, -1, 3, 1 ],
							 [ -1, -0.4, 3, 1 ],
							 [ -1, 1.5, 2.85, 1 ]                                               
                        ],
						[
						     [  0 , -1, 0, 1 ],
                             [ 0, -1, 1, 1 ],
							 [ 0, -1, 2, 1 ],
							 [ 0, -1, 3, 1 ],
							 [ 0, -0.4, 3, 1 ],
							 [ 0, 1.5, 2.85, 1 ]                                               
                        ],
						
						[
						     [  1 , -1, 0, 1 ],
                             [ 1, -1, 1, 1 ],
							 [ 1, -1, 2, 1 ],
							 [ 1, -1, 3, 1 ],
							 [ 1, -0.4, 3, 1 ],
							 [ 1, 1.5, 2.85, 1 ]                                               
                        ],
						
						[
						     [  2 , -1, 0, 1 ],
                             [ 2, -1, 1, 1 ],
							 [ 2, -1, 2, 1 ],
							 [ 2, -1, 3, 1 ],
							 [ 2, -0.4, 3, 1 ],
							 [ 2, 1.5, 2.85, 1 ]                                               
                        ],
						
						[
						     [  3 , -1, 0, 1 ],
                             [ 3, -1, 1, 1 ],
							 [ 3, -1, 2, 1 ],
							 [ 3, -1, 3, 1 ],
							 [ 3, -0.4, 3, 1 ],
							 [ 3, 1.5, 2.85, 1 ]                                               
                        ],
						
					
						
						
					];
					
					
	this.centroBot = new Patch(scene,orderU, orderV, partsU, partsV,this.controlPoints);


    this.centroBot.initBuffers();

};

CentroBot.prototype = Object.create(CGFobject.prototype);
CentroBot.prototype.constructor = CentroBot;

CentroBot.prototype.display = function()
{
	this.scene.pushMatrix();
	this.centroBot.display();
	this.scene.rotate(Math.PI,0,1,0);
	this.centroBot.display();
	this.scene.popMatrix();
}