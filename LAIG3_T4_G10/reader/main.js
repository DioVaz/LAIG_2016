//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}

deg2rad = Math.PI / 180;

serialInclude(['../lib/CGF.js',
'primitives/vehicle/CentroTop.js',
'primitives/vehicle/CentroBot.js',
'primitives/vehicle/FrenteTop.js',
'primitives/vehicle/FrenteBot.js',
'primitives/vehicle/TrasTop.js',
'primitives/vehicle/TrasBot.js',
'primitives/vehicle.js',
'primitives/MyTriangle.js',
'primitives/MyChessboard.js',
'primitives/MyRectangle.js',
'primitives/MyCylinder.js',
'primitives/MyCircle.js',
'primitives/MyCylinderAux.js',
'primitives/MyPatch.js',
'primitives/Patch.js',
'primitives/MyPlane.js',
'primitives/MySphere.js',
'primitives/MyTorus.js',
'primitives/MyQuad.js',
'interface/MyInterface.js',
'dsx/GraphSceneDSX.js',
'dsx/GraphDSX.js',
'dsx/Component.js',
'dsx/DSXscene.js',
'parser/Illumination.js',
'parser/Texture.js',
'parser/Material.js',
'parser/Transformation.js',
'animations/Animation.js',
'animations/CircularAnimation.js',
'animations/LinearAnimation.js',
'splay/MyChecker.js',
'splay/MyGameBoard.js',


main=function()
{

    console.log("START");
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myScene = new DSXScene();

    var myInterface = new MyInterface();

    app.init();

    app.setInterface(myInterface);
    app.setScene(myScene);
	myScene.setInterface(myInterface);
	  myInterface.setScene(myScene);

    myInterface.setActiveCamera(myScene.camera);

	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml
	// or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor)

	var filename=getUrlVars()['file'] || "tabuleiro.dsx";

	//Loads the graph from dsx filename
	var myGraph = new GraphSceneDSX(filename, myScene);

	// start
    app.run();
}

]);
