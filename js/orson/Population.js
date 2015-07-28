var Population = function() {
    this.controllers = {};
    var l, i, label;

    for( l = CONTROLLER_LABELS.length, i = 0; i < l; ++i ) {
	label = CONTROLLER_LABELS[ i ];

	switch( label ) {
	case POETA:
	case FABULAE:
	case GENERA:
	case METER:
	case METER_TYPE:
	case METER_BEFORE:
	case METER_AFTER:
	    this.controllers[ label ] = new ControllerA( label );
	    break;
	case NOMEN:
	    this.controllers[ label ] = new ControllerB( label );
	    break;
	case FRAGMENT:
	    this.controllers[ label ] = new ControllerC( label );
	    break;
	case DETAIL:
	    this.controllers[ label ] = new ControllerD( label );
	    break;
	}
    }
}
Population.prototype.setup = function() {
    var property;

    for( property in this.controllers ) {
	this.controllers[ property ].setup();
    }
}
Population.prototype.update = function() {
    var property;

    for( property in this.controllers ) {
	this.controllers[ property ].update();
    }
}
