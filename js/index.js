var COMPONENT_LABELS = [
    'poeta', 'fabulae', 'genera', 'nomen', 'meter', 'meter_type', 'meter_before',
    'meter_after', 'verse', 'detail'
];
var LINE_COUNT = 'numlines';
var CHARACTER_LINE_COUNT = 'char_numlines';
var FPID = 'fpid';

var crossfilter;
var population;

var Population = function() {
    this.components = {};
    var l, i, label;

    for( l = COMPONENT_LABELS.length, i = 0; i < l; ++i ) {
	label = COMPONENT_LABELS[ i ];

	switch( label ) {
	case 'poeta':
	case 'fabulae':
	case 'genera':
	case 'meter':
	case 'meter_type':
	case 'meter_before':
	case 'meter_after':
	    this.components[ label ] = new ComponentA( label );
	    break;
	case 'nomen':
	    this.components[ label ] = new ComponentB( label );
	    break;
	case 'verse':
	    this.components[ label ] = new ComponentC( label );
	    break;
	case 'detail':
	    this.components[ label ] = new ComponentD( label );
	    break;
	}
    }
}
Population.prototype.setup = function() {
    var property, component, model, data, controller;

    for( property in this.components ) {
	component = this.components[ property ];
	controller = component.controller;
	data = component.model.data;
	if( controller instanceof ControllerA ) {
	    controller.setup( data );
	}	    
    }
}

var Component = function( label ) {
    this.label = label;
    this.model;
    this.view;
    this.controller;
}

var ComponentA = function( label ) {
    Component.call( this, label );

    this.model = new ModelA( this.label );
    this.view = new ViewA( this.label );
    this.controller = new ControllerA( this.label );
}
ComponentA.prototype = Object.create( Component.prototype );
ComponentA.prototype.constructor = ComponentA;
ComponentA.prototype.update = function() {}

var ComponentB = function( label ) {
    Component.call( this, label );

    this.model = new ModelB( this.label );
    this.view = new ViewA( this.label );
    this.controller = new ControllerA( this.label );
}
ComponentB.prototype = Object.create( Component.prototype );
ComponentB.prototype.constructor = ComponentB;
ComponentB.prototype.update = function() {}

var ComponentC = function( label ) {
    Component.call( this, label );

    this.model = new ModelC( this.label );
    this.view = new ViewA( this.label );
    this.controller = new ControllerB( this.label );
}
ComponentC.prototype = Object.create( Component.prototype );
ComponentC.prototype.constructor = ComponentC;
ComponentC.prototype.update = function() {}

var ComponentD = function( label ) {
    Component.call( this, label );

    this.model = new ModelC1( this.label );
    this.view = new ViewC( this.label );
    this.controller = new ControllerC( this.label );
}
ComponentD.prototype = Object.create( Component.prototype );
ComponentD.prototype.constructor = ComponentD;
ComponentD.prototype.update = function() {}

var Model = function( label ) {
    this.label = label;
    this.operable;
    this.reference;
    this.group;
    this.schema;
    this.data;
}
Model.prototype.transmute = function() {
    this.data = [];

    var l, i, packet, group, property, value;

    for( l = this.group.length, i = 0; i < l; ++i ) {
	packet = {};
	group = this.group[ i ];
	for( property in this.schema ) {
	    value = this.schema[ property ]
	    if( value instanceof Array ) {
		packet[ property ] = group[ value[ 0 ] ][ value[ 1 ] ];
	    } else {
		packet[ property ] = group[ value ];
	    }
	}
	this.data.push( packet );
    }
}

var ModelA = function( label ) {
    Model.call( this, label );

    var label = this.label

    this.operable = crossfilter
	.dimension( function( d ) { return d[ label ]; } );
    this.reference = crossfilter
	.dimension( function( d ) { return d[ label ]; } );
    this.group = this.reference.group()
	.reduce( this.add, this.remove, this.init )
	.all();
    this.schema = { 'Name': 'key', 'Lines': [ 'value', 'line_count' ] };

    this.transmute();
}
ModelA.prototype = Object.create( Model.prototype );
ModelA.prototype.constructor = ModelA;
ModelA.prototype.add = function( p, v ) {
    if( p.fpids.includes( v[ FPID ] ) ) {
	return p;
    } else {
	p.fpids.push( v[ FPID ] );
	p.line_count += +v[ LINE_COUNT ];
	return p;
    }
}
ModelA.prototype.remove = function( p, v ) {
    if( p.fpids.includes( v[ FPID ] ) ) {
	p.fpids.splice( p.fpids.indexOf( v[ FPID ] ), 1 );
	p.line_count -= +v[ LINE_COUNT ];
	return p;
    } else {
	return p;
    }
}
ModelA.prototype.init = function( p, v ) {
    return { fpids: [], line_count: 0 }
}

var ModelB = function( label ) {
    Model.call( this, label );

    var label = this.label
    
    this.operable = crossfilter
	.dimension( function( d ) { return d[ label ]; } );
    this.reference = crossfilter
	.dimension( function( d ) { return d[ label ]; } );
    this.group = this.reference.group()
	.reduceSum( function ( d ) { return d[ CHARACTER_LINE_COUNT ]; } )
	.all();
    this.schema = { 'Name': 'key', 'Lines': 'value' }


    this.transmute();
}
ModelB.prototype = Object.create( Model.prototype );
ModelB.prototype.constructor = ModelB;

var ModelC = function( label ) {
    Model.call( this, label );
    
    var label = this.label;
    
    this.reference = crossfilter
	.dimension( function( d ) { return d[ label ]; } );
    this.group = this.reference.top( Infinity );
    this.schema = {
	'Poeta': 'poeta', 'Fabulae': 'fabulae', 'Genera': 'genera',
	'Nomen': 'nomen', 'Meter': 'meter', 'Meter Type': 'meter_type',
	'Meter Before': 'meter_before', 'Meter After': 'meter_after',
	'Start': 'line_number_first_label', 'End': 'line_number_last_label',
	'Lines': 'numlines', 'Character Lines': 'char_numlines'	
    }
    
    this.transmute();
}
ModelC.prototype = Object.create( Model.prototype );
ModelC.prototype.constructor = ModelC;

var ModelC1 = function( label ) {
    ModelC.call( this, label );

    this.schema = {
	'FPID': 'fpid', 'Poeta': 'poeta', 'Fabulae': 'fabulae', 'Nomen': 'nomen',
	'Genera': 'genera', 'Meter': 'meter', 'Meter Type': 'meter_type',
	'Meter Before': 'meter_before',	'Meter After': 'meter_after',
	'Start': 'line_number_first_label', 'End': 'line_number_last_label',
	'Line Count': 'numlines', 'Line Count per Character': 'char_numlines',
	'First Line': 'line_first', 'Last Line': 'line_last',
	'Closure': 'closure', 'Comments on Length': 'comments_on_length',
	'Other Comments': 'comments_other'	
    };

    this.transmute();
}
ModelC1.prototype = Object.create( ModelC.prototype );
ModelC1.prototype.constructor = ModelC1;

var View = function( label ) {
    this.label = label;
    this.location = d3.select( '#' + this.label );
}

var ViewA = function( label ) {
    View.call( this, label );
}
ViewA.prototype = Object.create( View.prototype );
ViewA.prototype.constructor = ViewA;
ViewA.prototype.draw = function( data ) {
    var columns = Object.keys( data[0] );
    var label = this.label;

    var table = this.location.append( 'table' );
    var thead = table
	.append( 'thead' )
	.append( 'tr' )
	.classed( label, true )
	.selectAll( 'th' )
	.data( columns )
	.enter()
	.append( 'th' )
	.attr( 'class', function( d ) { return d; } )
	.html( function( d ) { return d; } );
    var tbody = table.append( 'tbody' );
    var rows = tbody
	.selectAll( 'tr' )
	.data( data )
	.enter()
	.append( 'tr' )
	.classed( 'facet', true )
	.on('click', function( facet, index ) {
	    population.components[ label ].controller.toggle( facet.Name );
	} );
    var cells = rows
	.selectAll( 'td' )
	.data( function( row ) {
	    return columns.map( function( column ) {
		return { name: column, value: row[ column ] };
	    } );
	} )
	.enter()
	.append( 'td' )
	.attr( 'class', function( d ) { return d.name; } )
	.html( function( d ) { return d.value; } );
}

var ViewB = function( label ) {
    View.call( this, label );
}
ViewB.prototype = Object.create( View.prototype );
ViewB.prototype.constructor = ViewB;
ViewB.prototype.draw = function( data ) {
    // View for main area
}

var ViewC = function( label ) {
    View.call( this, label );
}
ViewC.prototype = Object.create( View.prototype );
ViewC.prototype.constructor = ViewC;
ViewC.prototype.draw = function( data ) {
    // View for pop-up details
}

var Controller = function( label ) {
    this.label = label;
}

var ControllerA = function( label ) {
    Controller.call( this, label );
    this.filters_all = [];
    this.filters_active = [];
}
ControllerA.prototype = Object.create( Controller.prototype );
ControllerA.prototype.constructor = ControllerA;
ControllerA.prototype.setup = function( data ) {
    // grab full list of possible filters from data
    // insert into this.filters_all
}
ControllerA.prototype.filter = function() {
    var filters = this.filters;

    population.components[ this.label ].model.operable.filter(
	function( d ) { return filters.indexOf( d ) > -1; }
    );
}
ControllerA.prototype.toggle = function( facet ) {
    if( this.filters.includes( facet ) ) {
	this.remove( facet );
    } else {
	this.add( facet );
    }
}
ControllerA.prototype.add = function( facet ) {
    this.filters.push( facet );
}
ControllerA.prototype.remove = function( facet ) {
    var index = this.filters.indexOf( facet );
    
    this.filters.splice( index, 1 );
}

var ControllerB = function( label ) {
    Controller.call( this, label );
}
ControllerB.prototype = Object.create( Controller.prototype );
ControllerB.prototype.constructor = ControllerB;

var ControllerC = function( label ) {
    Controller.call( this, label );
}
ControllerC.prototype = Object.create( Controller.prototype );
ControllerC.prototype.constructor = ControllerC;

d3.tsv( 'tsv/index.tsv', function( data ) {
    crossfilter = crossfilter( data );

    population = new Population();
    population.setup();
});
