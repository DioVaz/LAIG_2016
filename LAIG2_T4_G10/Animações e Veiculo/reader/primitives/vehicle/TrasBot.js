function TrasBot(scene, orderU, orderV, partsU, partsV) {
    CGFobject.call(this,scene);

    this.orderU = orderU;
    this.orderV = orderV;
    this.partsU = partsU;
    this.partsV = partsV;
	this.controlPoints = 
    [	
					  
                        // U = 1
                        [ // V = 0..1
                            [   0, -1, 0, 1 ],
                             [  0, -1, 1, 1 ],
							 [  0, -1, 2, 1 ],
							 [  0,  -1, 3, 1 ],
							 [  0, -0.4, 3, 1 ],
							 [  0, 1.5, 2.85, 1 ]                                               
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
						
						   [ // V = 0..1;
                             [ 2 , -1, 0, 1 ],
                             [ 2, -1, 0, 1 ],
							 [ 2, -1, 0, 1 ],
							 [ 2, -1, 0, 1 ],
							 [ 2, -0.4, 0, 1 ],
							 [ 2, 1.5, 0, 1 ]                                               
                        ],
						
						[ // V = 0..1                            
                                 [  1 , -1, 0, 1 ],
                             [ 1, -1, -1, 1 ],
							 [ 1, -1, -2, 1 ],
							 [ 1, -1, -3, 1 ],
							 [ 1, -0.4, -3, 1 ],
							 [ 1, 1.5, -2.85, 1 ]                                               
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
					
					
	this.trasBotton = new Patch(this.scene,4,5,30,30,this.controlPoints);


    this.trasBotton.initBuffers();

};

TrasBot.prototype = Object.create(CGFobject.prototype);
TrasBot.prototype.constructor = TrasBot;

TrasBot.prototype.display = function() {
	this.trasBotton.display();
}