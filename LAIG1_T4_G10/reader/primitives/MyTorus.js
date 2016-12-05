/**
 * Created by ruben on 04/10/2016.
 */


function MyTorus(scene, inner, outer, slices, loops){

    CGFobject.call(this,scene);

    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.loops = loops;

   
    this.initBuffers();

};

MyTorus.prototype = Object.create(CGFobject.prototype);
MyTorus.prototype.constructor = MyTorus;

MyTorus.prototype.initBuffers = function () {

    this.indices = [];
    this.vertices = [];
    this.normals = [];
    this.texCoords = [];

    this.ang_interno = (2 * Math.PI)/this.slices;
    this.ang_central = (2* Math.PI)/this.loops;
    this.ang = Math.PI/2;

    var c,i;
    var x,y,z;

    var x1,x2,y1,y2,z1,z2;
    for(c = 0; c <= this.loops; c += 1)
    {

        for(i=0; i<= this.slices ; i += 1)
        {

            x = (this.outer +  this.inner * Math.cos(i * this.ang_interno)) * Math.cos(c * this.ang_central);
            y = (this.outer + this.inner * Math.cos(i * this.ang_interno)) * Math.sin(c * this.ang_central);
            z = this.inner * Math.sin(i * this.ang_interno);


            this.vertices.push(x);
            this.vertices.push(y);
            this.vertices.push(z);


            this.normals.push(x);
            this.normals.push(y);
            this.normals.push(z);

            this.texCoords.push(c/this.loops,i/this.slices);



        }
    }

    for(c = 0; c < this.loops  ; c += 1)
    {

        for(i=0; i < this.slices  ; i += 1) {

            x1 = (this.loops+1) * c + i ;
            y1 = (1+ this.loops)*(c+1) + i ;
            z1 = (c*(this.loops +1))+1 + i ;
            this.indices.push(x1,y1,z1);
            this.indices.push(z1,y1,y1+1);




        }
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();




};

MyTorus.prototype.scaleTexCoords = function(ampS, ampT) {
    this.updateTexCoordsGLBuffers();
}

