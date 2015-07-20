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
    var property, component, controller, data, view;

    for( property in this.components ) {
	component = this.components[ property ];
	model = component.model;
	view = component.view;
	controller = component.controller;

	model.transmute();
	
	if( controller instanceof ControllerA ) {
	    controller.setup();
	    model.setup();
	}
	if( !( component instanceof ComponentD ) ) {
	    view.setup();
	}
    }
}
Population.prototype.update = function() {
    for( property in this.components ) {
	this.components[ property ].update();
    }
}

var Component = function( label ) {
    this.label = label;
    this.model;
    this.view;
    this.controller;
}
Component.prototype.update = function() {
    if( !( this instanceof ComponentD ) ) {
	console.log( this.label );
	this.view.erase();
    }
    if( this instanceof ComponentA ||
	this instanceof ComponentB ) {
	this.controller.filter();
	console.log( this.label );
    }
    this.model.transmute();
    /*
    if( !( this instanceof ComponentD ) ) {
	this.view.draw();
    }
    */
}

var ComponentA = function( label ) {
    Component.call( this, label );

    this.model = new ModelA( this.label );
    this.view = new ViewA( this.label );
    this.controller = new ControllerA( this.label );
}
ComponentA.prototype = Object.create( Component.prototype );
ComponentA.prototype.constructor = ComponentA;

var ComponentB = function( label ) {
    Component.call( this, label );

    this.model = new ModelB( this.label );
    this.view = new ViewA( this.label );
    this.controller = new ControllerA( this.label );
}
ComponentB.prototype = Object.create( Component.prototype );
ComponentB.prototype.constructor = ComponentB;

var ComponentC = function( label ) {
    Component.call( this, label );

    this.model = new ModelC1( this.label );
    this.view = new ViewB( this.label );
    this.controller = new ControllerB( this.label );
}
ComponentC.prototype = Object.create( Component.prototype );
ComponentC.prototype.constructor = ComponentC;

var ComponentD = function( label ) {
    Component.call( this, label );

    this.model = new ModelC2( this.label );
    this.view = new ViewC( this.label );
    this.controller = new ControllerC( this.label );
}
ComponentD.prototype = Object.create( Component.prototype );
ComponentD.prototype.constructor = ComponentD;

var Model = function( label ) {
    this.label = label;
    this.operable;
    this.reference;
    this.group;
    this.schema;
    this.data;
}
Model.prototype.setup = function() {
    this.zero_out();
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
Model.prototype.zero_out = function() {
    var l, i;

    for( l = this.data.length, i = 0; i < l; ++i ) {
	this.data[ i ].Lines = 0;
    }
}

var ModelA = function( label ) {
    Model.call( this, label );

    var label = this.label

    this.operable = crossfilter
	.dimension( function( d ) { return d[ label ]; } );
    this.reference = crossfilter
	.dimension( function( d ) { return d[ label ]; } );
    this.group = this.reference
	.group()
	.reduce( this.add, this.remove, this.init )
	.all();
    this.schema = { 'Name': 'key', 'Lines': [ 'value', 'line_count' ] };
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
    this.group = this.reference
	.group()
	.reduceSum( function ( d ) { return d[ CHARACTER_LINE_COUNT ]; } )
	.all();
    this.schema = { 'Name': 'key', 'Lines': 'value' }
}
ModelB.prototype = Object.create( Model.prototype );
ModelB.prototype.constructor = ModelB;

var ModelC = function( label ) {
    Model.call( this, label );

    var label = this.label;
    
    this.reference = crossfilter
	.dimension( function( d ) { return d[ label ]; } );
}
ModelC.prototype = Object.create( Model.prototype );
ModelC.prototype.constructor = ModelC;

var ModelC1 = function( label ) {
    ModelC.call( this, label );

    this.group = this.reference.group().top( Infinity );
    this.schema = {
	'Poeta': 'poeta', 'Fabulae': 'fabulae', 'Genera': 'genera',
	'Nomen': 'nomen', 'Meter': 'meter', 'Meter Type': 'meter_type',
	'Meter Before': 'meter_before', 'Meter After': 'meter_after',
	'Start': 'line_number_first_label', 'End': 'line_number_last_label',
	'Lines': 'numlines', 'Character Lines': 'char_numlines'	
    };
}
ModelC1.prototype = Object.create( ModelC.prototype );
ModelC1.prototype.constructor = ModelC1;
ModelC1.prototype.add = function( p, v ) {
    if( !p.v[FPID] ) {
	p.v[FPID] = [];
    }
    p[FPID].push( {
	poeta: 'poeta',
	fabulae: 'fabulae',
	genera: 'genera',
	nomen: 'nomen',
	meter: 'meter',
	meter_type: 'meter_type',
	meter_after: 'meter_after',
	meter_before: 'meter_before',
	start: 'line_number_first_label',
	end: 'line_number_last_label',
	numlines: 'numlines'
    } );
}
ModelC1.prototype.remove = function( p, v ) {
    // removal code
}
ModelC1.prototype.init = function( p, v ) {
    return {};
}

var ModelC2 = function( label ) {
    ModelC.call( this, label );

    this.group = this.reference.group().top( Infinity );
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
}
ModelC2.prototype = Object.create( ModelC.prototype );
ModelC2.prototype.constructor = ModelC2;

var View = function( label ) {
    this.label = label;
    this.data;
}
View.prototype.erase = function() {
    d3.select( '#' + this.label ).remove();
}

var ViewA = function( label ) {
    View.call( this, label );
}
ViewA.prototype = Object.create( View.prototype );
ViewA.prototype.constructor = ViewA;
ViewA.prototype.setup = function() {
    var columns, label, table, thead, tbody, rows, cells;

    this.data = population.components[ this.label ].model.data;
    columns = Object.keys( this.data[0] );
    label = this.label;

    dimensions = d3.select( '#dimensions' );
    dimension = dimensions.append( 'div' )
	.classed( 'dimension', true )
	.attr( 'id', this.label);
    title = dimension.append( 'h3' )
	.html( this.label );
    table = dimension.append( 'table' );
    thead = table
	.append( 'thead' )
	.append( 'tr' )
	.classed( label, true )
	.selectAll( 'th' )
	.data( columns )
	.enter()
	.append( 'th' )
	.attr( 'class', function( d ) { return d; } )
	.html( function( d ) { return d; } );
    tbody = table.append( 'tbody' );
    rows = tbody
	.selectAll( 'tr' )
	.data( this.data )
	.enter()
	.append( 'tr' )
	.classed( 'facet', true )
	.on('click', function( facet, index ) {
	    population.components[ label ].controller.toggle( facet.Name );
	} );
    cells = rows
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
ViewA.prototype.draw = function() {
    // values should have been changed
    // repopulate values
}

var ViewB = function( label ) {
    View.call( this, label );
}
ViewB.prototype = Object.create( View.prototype );
ViewB.prototype.constructor = ViewB;
ViewB.prototype.setup = function() {
    var verses, verse, title,
	section1, fabula, starts, ends, total, poeta,
	section2, first, last,
	section3, nomen, genera, ch_lines, meter, meter_t, meter_b, meter_a;
    
    this.data = population.components[ this.label ].model.data;

    verses = d3.select( '#verses' );
    verse = verses.append( 'div' )
	.classed( 'verse', true )
	.attr( 'id', this.label );
    title = verse.append( 'h3' )
	.html( this.label );

    section1 =    verse.append( 'div' ).classed( 'row', true );
    fabula   = section1.append( 'div' ).classed( 'col-5-1', true )
    fabula             .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Fabula:' );
    fabula             .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Example' );
    starts   = section1.append( 'div' ).classed( 'col-5-1', true )
    starts             .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Starts at Line:' );
    starts             .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Example' );
    ends     = section1.append( 'div' ).classed( 'col-5-1', true )
    ends               .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Ends at Line:' );
    ends               .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Example' );
    total    = section1.append( 'div' ).classed( 'col-5-1', true )
    total              .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Total Lines:' );
    total              .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Example' );
    poeta    = section1.append( 'div' ).classed( 'col-5-1', true )
    poeta              .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Poeta:' );
    poeta              .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Example' );

    section2 = verse   .append( 'div' ).classed( 'row', true );
    first    = section2.append( 'div' ).classed( 'row', true )
    first              .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'First Line:' );
    first              .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Example' );
    last     = section2.append( 'div' ).classed( 'row', true )
    last               .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Last Line:' );
    last               .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Example' );

    section3 = verse   .append( 'div' ).classed( 'row', true );
    nomen    = section3.append( 'div' ).classed( 'col-7-1', true )
    nomen              .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Nomen:' );
    nomen              .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Example' );
    genera   = section3.append( 'div' ).classed( 'col-7-1', true )
    genera             .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Genera:' );
    genera             .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Example' );
    ch_lines = section3.append( 'div' ).classed( 'col-7-1', true )
    ch_lines           .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Character Lines:' );
    ch_lines           .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Example' );
    meter    = section3.append( 'div' ).classed( 'col-7-1', true )
    meter              .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Meter:' );
    meter              .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Example' );
    meter_t  = section3.append( 'div' ).classed( 'col-7-1', true )
    meter_t            .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Meter Type:' );
    meter_t            .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Example' );
    meter_b  = section3.append( 'div' ).classed( 'col-7-1', true )
    meter_b            .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Meter Before:' );
    meter_b            .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Example' );
    meter_a  = section3.append( 'div' ).classed( 'col-7-1', true )
    meter_a            .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Meter After:' );
    meter_a            .append( 'div' ).classed( 'col-2-1 label', true )
	.html( 'Example' );
}
ViewB.prototype.draw = function() {}

var ViewC = function( label ) {
    View.call( this, label );
}
ViewC.prototype = Object.create( View.prototype );
ViewC.prototype.constructor = ViewC;
ViewC.prototype.setup = function() {
    this.data = population.components[ this.label ].model.data;
}    
ViewC.prototype.draw = function() {
    // View for pop-up details
}

var Controller = function( label ) {
    this.label = label;
}

var ControllerA = function( label ) {
    Controller.call( this, label );

    this.data;
    this.filters_all;
    this.filters_active;
}
ControllerA.prototype = Object.create( Controller.prototype );
ControllerA.prototype.constructor = ControllerA;
ControllerA.prototype.setup = function() {
    var l, data, i;

    this.data = population.components[ this.label ].model.data;
    this.filters_all = [];
    this.filters_active = [];
    
    for( l = this.data.length, i = 0; i < l; ++i ) {
	this.filters_all.push( this.data[ i ].Name );
    }

}
ControllerA.prototype.toggle = function( facet ) {
    if( this.filters_active.includes( facet ) ) {
	this.remove( facet );
    } else {
	this.add( facet );
    }
    population.update();
}
ControllerA.prototype.add = function( facet ) {
    this.filters_active.push( facet );
}
ControllerA.prototype.remove = function( facet ) {
    var index = this.filters_active.indexOf( facet );
    
    this.filters_active.splice( index, 1 );
}
ControllerA.prototype.filter = function() {
    var filters_active = this.filters_active;

    population.components[ this.label ].model.operable.filter(
	function( d ) { return filters_active.indexOf( d ) > -1; }
    );
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
