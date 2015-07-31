var Presenter = function( label ) {
    this.label = label;
    this.model;
    this.view;
}
Presenter.prototype.setup = function() {
    this.model.setup();
}
Presenter.prototype.update = function() {
    this.model.update();
    this.view.update( this.model );
}

var PresenterA = function( label ) {
    Presenter.call( this, label );

    this.model = new ModelA1( this.label );
    this.view = new ViewA1( this.label );
}
PresenterA.prototype = Object.create( Presenter.prototype );
PresenterA.prototype.constructor = PresenterA;

var PresenterB = function( label ) {
    Presenter.call( this, label );

    this.model = new ModelA2( this.label );
    this.view = new ViewA1( this.label );
}
PresenterB.prototype = Object.create( Presenter.prototype );
PresenterB.prototype.constructor = PresenterB;

var PresenterC = function( label ) {
    Presenter.call( this, label );

    this.model = new ModelB1( this.label );
    this.view = new ViewA2( this.label );
}
PresenterC.prototype = Object.create( Presenter.prototype );
PresenterC.prototype.constructor = PresenterC;

var PresenterD = function( label ) {
    Presenter.call( this, label );

    this.model = new ModelB2( this.label );
    this.view = new ViewB( this.label );
}
PresenterD.prototype = Object.create( Presenter.prototype );
PresenterD.prototype.constructor = PresenterD;
