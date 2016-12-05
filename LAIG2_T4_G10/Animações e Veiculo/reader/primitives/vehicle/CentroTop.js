function CentroTop(scene, orderU, orderV, partsU, partsV) {
    CGFobject.call(this,scene);

    this.orderU = orderU;
    this.orderV = orderV;
    this.partsU = partsU;
    this.partsV = partsV;
	this.controlPoints = 
    [	
			
						[
						     [  3 , -1, 0, 1 ],
                             [ 3, -1, 1, 1 ],
							 [ 3, -1, 2, 1 ],
							 [ 3, -1, 3, 1 ],
							 [ 3, -0.4, 3, 1 ],
							 [ 3, 1.5, 2.85, 1 ]                                               
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
						     [  1 , -1, 0, 1 ],
                             [ 1, -1, 1, 1 ],
							 [ 1, -1, 2, 1 ],
							 [ 1, -1, 3, 1 ],
							 [ 1, -0.4, 3, 1 ],
							 [ 1, 1.5, 2.85, 1 ]                                               
						],
							[
						     [  0 , -1, 0, 1 ],
                             [ 0, -1, 1, 1 ],
							 [ 0, -1, 2, 1 ],
							 [ 0, -1, 3, 1 ],
							 [ 0, -0.4, 3, 1 ],
							 [ 0, 1.5, 2.85, 1 ]                                               
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
						
						     // U = 1
                        [ // V = 0..1
                            [   -2, -1, 0, 1 ],
                             [  -2, -1, 1, 1 ],
							 [  -2, -1, 2, 1 ],
							 [  -2,0-1, 3, 1 ],
							 [  -2, -0.4, 3, 1 ],
							 [  -2, 1.5, 2.85, 1 ]                                               
                        ],
						
						
                   
                     [
						     [  -3 , -1, 0, 1 ],
                             [ -3, -1, 1, 1 ],
							 [ -3, -1, 2, 1 ],
							 [ -3, -1, 3, 1 ],
							 [ -3, -0.4, 3, 1 ],
							 [ -3, 1.5, 2.85, 1 ]                                               
                        ],
						
					
						
						
					];
					
					
	this.centroTop = new Patch(scene,orderU, orderV, partsU, partsV,this.controlPoints);


    this.centroTop.initBuffers();

};

CentroTop.prototype = Object.create(CGFobject.prototype);
CentroTop.prototype.constructor = CentroTop;

CentroTop.prototype.display = function()
{
	this.scene.pushMatrix();
	this.centroTop.display();
	this.scene.rotate(Math.PI,0,1,0);
	this.centroTop.display();
	this.scene.popMatrix();
	
}