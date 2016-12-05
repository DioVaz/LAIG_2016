function FrenteTop(scene, orderU, orderV, partsU, partsV) {
    CGFobject.call(this,scene);

    this.orderU = orderU;
    this.orderV = orderV;
    this.partsU = partsU;
    this.partsV = partsV;
	this.controlPoints = 
    [	
					  
                     
					
					
			
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
						
				
						
						   [ // V = 0..1                            
                                 [  -3 , -1, 0, 1 ],
                                 [ -3, -1, 1, 1 ],
							     [ -3, -1, 2, 1 ],
							     [ -3, -1, 3, 1 ],
							    [ -4.3, -0.4, 3, 1 ],
							    [ -7, 1.5, 2.85, 1 ]                                               
                        ],
						
							[ // V = 0..1;
                             [ -3 , -1, 0, 0 ],
                             [ -3, -1, 0, 0 ],
							 [ -3, -1, 0, 0 ],
							 [ -3, -1, 0, 0 ],
							 [ -5, -0.4, 0, 0 ],
							 [ -16.42, 1.5, 0, 0 ]                                               
                        ],
						
						[ // V = 0..1                            
                                 [  -3 , -1, 0, 1 ],
                             [ -3, -1, -1, 1 ],
							 [ -3, -1, -2, 1 ],
							 [ -3, -1, -3, 1 ],
							 [ -4.3, -0.4, -3, 1 ],
							 [ -7, 1.5, -2.85, 1 ]                                               
                        ],
						
						
						[ // V = 0..1                            
                                 [  0 , -1, 0, 1 ],
                             [ 0, -1, -1, 1 ],
							 [ 0, -1, -2, 1 ],
							 [ 0, -1, -3, 1 ],
							 [ 0, -0.4, -3, 1 ],
							 [ 0, 1.5, -2.85, 1 ]                                               
                        ],
						
			
						
						
					];
					
	this.patch = new Patch(scene, orderU, orderV, partsU, partsV, this.controlPoints);

    this.patch.initBuffers();

};

FrenteTop.prototype = Object.create(CGFobject.prototype);
FrenteTop.prototype.constructor = FrenteTop;


FrenteTop.prototype.display = function() {
	this.patch.display();
}
