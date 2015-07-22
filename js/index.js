var FPID = 'fpid';
var POETA = 'poeta'
var FABULAE = 'fabulae';
var LINE_COUNT = 'numlines';
var STARTING_LINE_NUMBER_LABEL = 'line_number_first_label';
var STARTING_LINE_NUMBER_ORDINATE = 'line_number_first_ordinate';
var STARTING_LINE = 'line_first';
var ENDING_LINE_NUMBER_LABEL = 'line_number_last_label';
var ENDING_LINE_NUMBER_ORDINATE = 'line_number_last_ordinate';
var ENDING_LINE = 'line_last';
var CLOSURE = 'closure';
var COMMENTS_ON_LENGTH = 'comments_on_length';
var COMMENTS_ON_OTHER = 'comments_other';
var NOMEN = 'nomen';
var NOMEN_LINE_COUNT = 'char_numlines';
var GENERA = 'genera';
var METER = 'meter';
var METER_TYPE = 'meter_type';
var METER_BEFORE = 'meter_before';
var METER_AFTER = 'meter_after';
var COMPONENT_LABELS = [
    POETA, FABULAE, GENERA, NOMEN, METER, METER_TYPE, METER_BEFORE, METER_AFTER,
    'verse', 'detail'
];

var crossfilter;
var population;

var CROSSFILTER = {
    index_search: function( p, v ) {
	var lost = p.length;

	if( lost == false ) { return false; }
	
	do {
	    if( p[ lost - 1 ][ FPID ] == v[ FPID ] ) {
		return ( lost - 1 );
	    } else {
		--lost;
	    }
	} while ( lost )
    }
}

var Population = function() {
    this.components = {};
    var l, i, label;

    for( l = COMPONENT_LABELS.length, i = 0; i < l; ++i ) {
	label = COMPONENT_LABELS[ i ];

	switch( label ) {
	case POETA:
	case FABULAE:
	case GENERA:
	case METER:
	case METER_TYPE:
	case METER_BEFORE:
	case METER_AFTER:
	    this.components[ label ] = new ComponentA( label );
	    break;
	case NOMEN:
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
    var property;
    
    for( property in this.components ) {
	this.components[ property ].setup();
    }
}
Population.prototype.update = function() {
    var property;

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
Component.prototype.setup = function() {
    if( this.model instanceof ModelC ) {
	this.model.setup();
    }

    this.model.transmute();

    if( this.controller instanceof ControllerA ) {
	this.controller.setup( this.model.data );
    }
}
Component.prototype.update = function() {
    this.view.erase();

    if( this.controller instanceof ControllerA ) {
	this.model.filter( this.controller.filters_active );
    }

    this.model.transmute();

    if( !( this instanceof ComponentD ) ) {
	this.view.draw( this.controller, this.model.data );
    }
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
    this.filterable;
    this.reference;
    this.group;
    this.schema;
    this.data;
}
Model.prototype.filter = function( filters ) {
    this.filterable.filter(
	function( d ) { return filters.indexOf( d ) > -1; }
    );
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

    var label = this.label;
    
    this.filterable = crossfilter
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
    
    this.filterable = crossfilter
	.dimension( function( d ) { return d[ label ]; } );
    this.reference = crossfilter
	.dimension( function( d ) { return d[ label ]; } );
    this.group = this.reference
	.group()
	.reduceSum( function( d ) { return d[ NOMEN_LINE_COUNT ]; } )
 	.all();
    this.schema = { 'Name': 'key', 'Lines': 'value' }
}
ModelB.prototype = Object.create( Model.prototype );
ModelB.prototype.constructor = ModelB;

var ModelC = function( label ) {
    Model.call( this, label );
}
ModelC.prototype = Object.create( Model.prototype );
ModelC.prototype.constructor = ModelC;
ModelC.prototype.setup = function() {
    this.reference = population.components[ POETA ].model.reference;
    this.group = this.reference
	.groupAll()
	.reduce( this.add, this.remove, this.init )
	.value();
}

var ModelC1 = function( label ) {
    ModelC.call( this, label );

    this.schema = {
	'Poeta': POETA, 'Fabulae': FABULAE, 'Genera': GENERA,
	'Nomen': NOMEN, 'Meter': METER, 'Meter Type': METER_TYPE,
	'Meter Before': METER_BEFORE, 'Meter After': METER_AFTER,
	'Start': STARTING_LINE_NUMBER_LABEL, 'End': ENDING_LINE_NUMBER_LABEL,
	'Lines': LINE_COUNT, 'Character Lines': NOMEN_LINE_COUNT
    }
}
ModelC1.prototype = Object.create( ModelC.prototype );
ModelC1.prototype.constructor = ModelC1;
ModelC1.prototype.add = function( p, v ) {
    var sup, sub, found;

    sup = {
	fabulae: v[ FABULAE ],
	starting_line_number: v[ STARTING_LINE_NUMBER_LABEL ],
	ending_line_number: v[ ENDING_LINE_NUMBER_LABEL ],
	line_count: v[ NOMEN_LINE_COUNT ],
	starting_line: v[ STARTING_LINE ],
	ending_line: v[ ENDING_LINE ],
	poeta: v[ POETA ],
	fpid: v[ FPID ]
    }

    sub = {
	nomen: v[ NOMEN ],
	genera: v[ GENERA ],
	line_count: v[ NOMEN_LINE_COUNT ],
	meter: v[ METER ],
	meter_type: v[ METER_TYPE ],
	meter_before: v[ METER_BEFORE ],
	meter_after: v[ METER_AFTER ]
    }

    found = CROSSFILTER.index_search( p, v );

    if( found ) {
	p[ found ].sub.push( sub );
    } else {
	sup.sub = [ sub ];
	p.push( sup );
    }

    return p;
}
ModelC1.prototype.remove = function( p, v ) {
    return p;
}
ModelC1.prototype.init = function( p, v ) {
    return [];
}
ModelC1.prototype.transmute = function() {
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
var ModelC2 = function( label ) {
    ModelC.call( this, label );

    this.schema = {
	'FPID': FPID, 'Poeta': POETA, 'Fabulae': FABULAE, 'Nomen': NOMEN,
	'Genera': GENERA, 'Meter': METER, 'Meter Type': METER_TYPE,
	'Meter Before': METER_BEFORE, 'Meter After': METER_AFTER,
	'Start': STARTING_LINE_NUMBER_LABEL, 'End': ENDING_LINE_NUMBER_LABEL,
	'Line Count': LINE_COUNT, 'Line Count per Character': NOMEN_LINE_COUNT,
	'First Line': STARTING_LINE, 'Last Line': ENDING_LINE,
	'Closure': CLOSURE, 'Comments on Length': COMMENTS_ON_LENGTH,
	'Other Comments': COMMENTS_ON_OTHER
    }
}
ModelC2.prototype = Object.create( ModelC.prototype );
ModelC2.prototype.constructor = ModelC2;
ModelC2.prototype.add = function( p, v ) {
    return p;
}
ModelC2.prototype.remove = function( p, v ) {
    return p;
}
ModelC2.prototype.init = function( p, v ) {
    return [];
}

var View = function( label ) {
    this.label = label;
}
View.prototype.erase = function() {
    d3.select( '#' + this.label ).remove();
}

var ViewA = function( label ) {
    View.call( this, label );
}
ViewA.prototype = Object.create( View.prototype );
ViewA.prototype.constructor = ViewA;
ViewA.prototype.draw = function( controller, data ) {
    var columns, label, table, thead, tbody, rows, cells;
    
    columns = Object.keys( data[0] );
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
	.data( data )
	.enter()
	.append( 'tr' )
	.classed( 'facet', true )
	.on('click', function( facet, index ) {
	    controller.toggle( facet.Name );
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

var ViewB = function( label ) {
    View.call( this, label );
}
ViewB.prototype = Object.create( View.prototype );
ViewB.prototype.constructor = ViewB;
ViewB.prototype.draw = function( data ) {
    var verses, verse, title,
	section1, fabula, starts, ends, total, poeta,
	section2, first, last,
	section3, nomen, genera, ch_lines, meter, meter_t, meter_b, meter_a;
    
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

    this.filters_all;
    this.filters_active;
}
ControllerA.prototype = Object.create( Controller.prototype );
ControllerA.prototype.constructor = ControllerA;
ControllerA.prototype.setup = function( data ) {
    var filters, l, i;

    filters = [];

    for( l = data.length, i = 0; i < l; ++i ) {
	filters.push( data[ i ].Name );
    }

    this.filters_all = filters;
    this.filters_active = filters;
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
    population.update();
});
