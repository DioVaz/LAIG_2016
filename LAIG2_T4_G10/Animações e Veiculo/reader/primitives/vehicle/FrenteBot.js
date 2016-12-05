function FrenteBot(scene, orderU, orderV, partsU, partsV) {
    CGFobject.call(this,scene);

    this.orderU = orderU;
    this.orderV = orderV;
    this.partsU = partsU;
    this.partsV = partsV;
	this.controlPoints = 
    [	
					  
                     
					
					
					//1	
							[ // V = 0..1                            
                                 [  0 , -1, 0, 1 ],
                             [ 0, -1, -1, 1 ],
							 [ 0, -1, -2, 1 ],
							 [ 0, -1, -3, 1 ],
							 [ 0, -0.4, -3, 1 ],
							 [ 0, 1.5, -2.85, 1 ]                                               
                        ],
						
						//2			
						[ // V = 0..1                            
                                 [  -3 , -1, 0, 1 ],
                             [ -3, -1, -1, 1 ],
							 [ -3, -1, -2, 1 ],
							 [ -3, -1, -3, 1 ],
							 [ -4.3, -0.4, -3, 1 ],
							 [ -7, 1.5, -2.85, 1 ]                                               
                        ],
						//3
						
							[ // V = 0..1;
                             [ -3 , -1, 0, 0 ],
                             [ -3, -1, 0, 0 ],
							 [ -3, -1, 0, 0 ],
							 [ -3, -1, 0, 0 ],
							 [ -5, -0.4, 0, 0 ],
							 [ -16.42, 1.5, 0, 0 ]                                               
                        ],
						
						   //4       // U = 2
                        [ // V = 0..1                            
                                 [  -3 , -1, 0, 1 ],
                                 [ -3, -1, 1, 1 ],
							     [ -3, -1, 2, 1 ],
							     [ -3, -1, 3, 1 ],
							    [ -4.3, -0.4, 3, 1 ],
							    [ -7, 1.5, 2.85, 1 ]                                               
                        ],
						
						
						//5
						
						   // U = 1
                        [ // V = 0..1
                            [   0, -1, 0, 1 ],
                             [  0, -1, 1, 1 ],
							 [  0, -1, 2, 1 ],
							 [  0, -1, 3, 1 ],
							 [  0, -0.4, 3, 1 ],
							 [  0, 1.5, 2.85, 1 ]                                               
                        ],
						
				

						
			
						
						
					];
					
	this.patch = new Patch(scene, orderU, orderV, partsU, partsV, this.controlPoints);

	this.patch.initBuffers();

};

FrenteBot.prototype = Object.create(CGFobject.prototype);
FrenteBot.prototype.constructor = FrenteBot;


FrenteBot.prototype.display = function() {
	this.patch.display();
}
