var Population = function() {
    this.controls;
    this.presenters;
    var l, i, label;

    this.controls = new ViewC( DIMENSIONS );
    this.presenters = {};
    
    for( l = PRESENTER_LABELS.length, i = 0; i < l; ++i ) {
	label = PRESENTER_LABELS[ i ];

	switch( label ) {
	case POETA:
	case FABULAE:
	case GENERA:
	case METER:
	case METER_TYPE:
	case METER_BEFORE:
	case METER_AFTER:
	    this.presenters[ label ] = new PresenterA( label );
	    break;
	case NOMEN:
	    this.presenters[ label ] = new PresenterB( label );
	    break;
	case FRAGMENT:
	    this.presenters[ label ] = new PresenterC( label );
	    break;
	case DETAIL:
	    this.presenters[ label ] = new PresenterD( label );
	    break;
	}
    }
}
Population.prototype.setup = function() {
    var property;

    for( property in this.presenters ) {
	this.presenters[ property ].setup();
    }
}
Population.prototype.update = function() {
    var property;

    for( property in this.presenters ) {
	this.presenters[ property ].update();
    }
}
