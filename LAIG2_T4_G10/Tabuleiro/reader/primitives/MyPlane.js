function MyPlane(scene, dx, dy, partsx, partsy) {
	this.scene = scene;

	this.dx = parseInt(dx);
	this.dy = parseInt(dy);
	this.partsx = parseInt(partsx);
	this.partsy = parseInt(partsy);

	var knots = [0, 0, 1, 1];
	var controlPoints = [
							[
								[-dx/2, -dy/2, 0, 1],
								[-dx/2, dy/2, 0, 1]
							],
							[
								[dx/2, -dy/2, 0, 1],
								[dx/2, dy/2, 0, 1]
							]
						];

	var nurbsSurface = new CGFnurbsSurface(1, 1, knots, knots, controlPoints);

	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.plane = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsx, this.partsy);

}

MyPlane.prototype = Object.create(CGFobject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.display = function() {
		this.plane.display();
}

MyPlane.prototype.scaleTexCoords = function (ampS, ampT) {}
