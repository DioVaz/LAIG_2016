function View() {
    this.root = "ss";
    this.referenceLength = 0;
};

Scene.prototype = Object.create(Object.prototype);
Scene.prototype.constructor = View;
