function Patch(scene, orderU, orderV, partsU, partsV,controlPoints) {
    CGFobject.call(this,scene);

    this.orderU = orderU;
    this.orderV = orderV;
    this.partsU = partsU;
    this.partsV = partsV;
	this.controlPoints = controlPoints;
    /*[	
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
						
					
						
						
					];*/
					
					



    this.initBuffers();

};

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.initBuffers = function () {
	this.patch = this.makeSurface(this.orderU, this.orderV, this.partsU, this.partsV, this.controlPoints);
};

Patch.prototype.getKnotsVector = function(degree) { 
	
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	 
	return v;
}

Patch.prototype.makeSurface = function (degree1, degree2, parts1, parts2, controlvertexes) {
		
	var knots1 = this.getKnotsVector(degree1); 
	var knots2 = this.getKnotsVector(degree2); 

		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes); 
	
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	return new CGFnurbsObject(this.scene, getSurfacePoint, parts1,parts2);	
}

Patch.prototype.display = function ()
{
	this.patch.display();
};


Patch.prototype.parseControlPoints = function(cP) {
	var result = [];
	for(var i = 0; i <= this.orderU; i++){
		var temp = [];
		for(var j = 0; j <= this.orderV; j++){
			if(cP[0].x != null)
				temp.push([cP[i+j*this.orderV].x, cP[i+j*this.orderV].y, cP[i+j*this.orderV].z, 1]); //quando os valores vem do parser
			else{
				console.log("tentamos");
			temp.push([cP[i+j*this.orderV][0], cP[i+j*this.orderV][1], cP[i+j*this.orderV][2], 1]); //quando os valores vem do vehicle
			}
		}
		result.push(temp);
	}

	return result;

}