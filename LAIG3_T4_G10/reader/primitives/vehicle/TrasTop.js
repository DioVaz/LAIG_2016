function TrasTop(scene, orderU, orderV, partsU, partsV) {
    CGFobject.call(this,scene);

    this.orderU = orderU;
    this.orderV = orderV;
    this.partsU = partsU;
    this.partsV = partsV;
	this.controlPoints = 
    [	
					  
              
						
						
					
						
						[ // V = 0..1                            
                                 [  0 , -1, 0, 1 ],
                             [ 0, -1, -1, 1 ],
							 [ 0, -1, -2, 1 ],
							 [ 0, -1, -3, 1 ],
							 [ 0, -0.4, -3, 1 ],
							 [ 0, 1.5, -2.85, 1 ]                                               
                        ],
						
						 
						
							[ // V = 0..1                            
                                 [  1 , -1, 0, 1 ],
                             [ 1, -1, -1, 1 ],
							 [ 1, -1, -2, 1 ],
							 [ 1, -1, -3, 1 ],
							 [ 1, -0.4, -3, 1 ],
							 [ 1, 1.5, -2.85, 1 ]                                               
                        ],
						
						  [ // V = 0..1;
                             [ 2 , -1, 0, 1 ],
                             [ 2, -1, 0, 1 ],
							 [ 2, -1, 0, 1 ],
							 [ 2, -1, 0, 1 ],
							 [ 2, -0.4, 0, 1 ],
							 [ 2, 1.5, 0, 1 ]                                               
                        ],
			
						    // U = 2
                        [ // V = 0..1                            
                                 [  1 , -1, 0, 1 ],
                             [ 1, -1, 1, 1 ],
							 [ 1, -1, 2, 1 ],
							 [ 1, -1, 3, 1 ],
							 [ 1, -0.4, 3, 1 ],
							 [ 1, 1.5, 2.85, 1 ]                                               
                        ],
						
						          // U = 1
                        [ // V = 0..1
                            [   0, -1, 0, 1 ],
                             [  0, -1, 1, 1 ],
							 [  0, -1, 2, 1 ],
							 [  0,  -1, 3, 1 ],
							 [  0, -0.4, 3, 1 ],
							 [  0, 1.5, 2.85, 1 ]                                               
                        ],
                    
						
						
					];
					
					
	this.trasBot= new Patch(this.scene,4,5,30,30,this.controlPoints);


    this.trasBot.initBuffers();

};

TrasTop.prototype = Object.create(CGFobject.prototype);
TrasTop.prototype.constructor = TrasTop;


TrasTop.prototype.display = function() {
	this.trasBot.display();
};

