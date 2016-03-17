var Population = function() {
    this.controls;
    this.presenters;
    var l, i, label;

    this.presenters = {};
    this.instances;
    this.pages;
    this.page = 1;
    this.display_status = {
	poeta: 0,
	fabulae: 0,
	genera: 0,
	nomen: 0,
	meter: 0,
	meter_type: 0,
	meter_before: 0,
	meter_after: 0
    }
    
    for( l = PRESENTER_LABELS.length, i = 0; i < l; ++i ) {
	label = PRESENTER_LABELS[ i ];

	switch( label ) {
	case POETA:
	case FABULAE:
	case METER:
	case METER_BEFORE:
	case METER_AFTER:
	case METER_TYPE:
	    this.presenters[ label ] = new PresenterA( label );
	    break;
	case GENERA:
	case NOMEN:
	    this.presenters[ label ] = new PresenterB( label );
	    break;
	case VERSE_GROUPS:
	    this.presenters[ label ] = new PresenterC( label );
	    break;
	case VERSE_DETAIL:
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
    this.activate_status();
}

Population.prototype.activate_status = function() {
    var property, value;
    
    for( property in this.display_status ) {
	value = this.display_status[ property ];
	selection = d3.select( '.' + property );

	if( value == 0 ) {
	    selection.style( 'display', 'none' );
	} else {
	    selection.style( 'display', 'block' );
	}
    }
}
