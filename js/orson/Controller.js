var Controller = function( label ) {
    this.label = label;
    this.model;
    this.view;
}
Controller.prototype.setup = function() {
    this.model.setup();
}
Controller.prototype.update = function() {
    this.model.update();
    this.view.update( this.model );
}

var ControllerA = function( label ) {
    Controller.call( this, label );

    this.model = new ModelA1( this.label );
    this.view = new ViewA1( this.label );
}
ControllerA.prototype = Object.create( Controller.prototype );
ControllerA.prototype.constructor = ControllerA;

var ControllerB = function( label ) {
    Controller.call( this, label );

    this.model = new ModelA2( this.label );
    this.view = new ViewA1( this.label );
}
ControllerB.prototype = Object.create( Controller.prototype );
ControllerB.prototype.constructor = ControllerB;

var ControllerC = function( label ) {
    Controller.call( this, label );

    this.model = new ModelB1( this.label );
    this.view = new ViewA2( this.label );
}
ControllerC.prototype = Object.create( Controller.prototype );
ControllerC.prototype.constructor = ControllerC;

var ControllerD = function( label ) {
    Controller.call( this, label );

    this.model = new ModelB2( this.label );
    this.view = new ViewB( this.label );
}
ControllerD.prototype = Object.create( Controller.prototype );
ControllerD.prototype.constructor = ControllerD;
