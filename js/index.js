var COMPONENT_LABELS = [
    'poeta', 'fabulae',// 'nomen', 'genera',
//    'meter', 'meter_type', 'meter_before', 'meter_after',
    'raw' /*, 'refined', 'popup'*/
];
var DIMENSION_LABELS = [
    'poeta', 'fabulae', 'nomen', 'genera',
    'meter', 'meter_type', 'meter_before', 'meter_after'
];
var SELECTION_SCHEMAS = {
    type_one: { 'Name': 'key', 'Lines': [ 'value', 'line_count' ] },
    type_two: { 'Name': 'key', 'Lines': 'value' },
    type_three: { 'Poeta': 'poeta', 'Fabulae': 'fabulae', 'Nomen': 'nomen',
		  'Genera': 'genera', 'Start': 'line_number_first_label',
		  'End': 'line_number_last_label', 'Lines': 'numlines',
		  'Meter': 'meter', 'Meter Type': 'meter_type',
		  'Meter Before': 'meter_before', 'Meter After': 'meter_after' }
};
var LINE_COUNT = 'numlines';
var CHARACTER_LINE_COUNT = 'char_numlines';
var FPID = 'fpid';

var dimensions;
var population;

var Population = function() {
    this.components = {};

    for( var l = COMPONENT_LABELS.length, i = 0; i < l; ++i ) {
	var label = COMPONENT_LABELS[ i ];
	this.components[ label ] = new Component( label );
    }

    for( var property in this.components ) {
	this.components[property].update();
    }
}

var Component = function( label ) {
    this.label = label;
    this.model = new Model( label );
    this.view = new View( label );
    this.controller = new Controller( label );
}
Component.prototype.update = function() {
    this.view.clear_canvas();
    this.controller.filter();
    this.model.transmute();
    this.view.draw( this.model.data );
}

var Model = function( label ) {
    this.label = label;
    this.dimension;
    this.selection;
    this.transmutation;
    this.data;

    this.populate();
}
Model.prototype.populate = function() {
    var reference_dimension = dimensions[ 'poeta' ];
    
    switch( this.label ) {
    case 'poeta':
    case 'fabulae':
    case 'genera':
    case 'meter':
    case 'meter_type':
    case 'meter_before':
    case 'meter_after':
	this.dimension = dimensions[ this.label ];
	this.selection = this.dimension.group()
	    .reduce( Reduction.add, Reduction.remove, Reduction.init )
	    .all();
	this.transmutation = SELECTION_SCHEMAS[ 'type_one' ];
	break;
    case 'nomen':
	this.dimension = dimensions[ this.label ];
	this.selection = this.dimension.group()
	    .reduceSum( function( d ) { return d[ CHARACTER_LINE_COUNT ]; })
	    .all();
	this.transmutation = SELECTION_SCHEMAS[ 'type_two' ];
	break;
    case 'raw':
	this.dimension = reference_dimension;
	this.selection = this.dimension.top( 200 ); // SWITCH TO ALL RESULTS
	this.transmutation = SELECTION_SCHEMAS[ 'type_three' ];
	break;
	/*
    case 'popup':
	this.dimension = reference_dimension;
	this.selection = this.dimension.top(Infinity);
	this.transmutation = DATA_SCHEMAS[ 'type_four' ];
	break;
	*/
    }

    this.transmute();
}
Model.prototype.transmute = function() {
    this.data = [];
    
    for( var l = this.selection.length, i = 0; i < l; ++i ) {
	var packet = {};
	
	for( var property in this.transmutation ) {
	    if( this.transmutation[ property ] instanceof Array ) {
		packet[ property ] =
		    this.selection[ i ]
		[ this.transmutation[ property ][ 0 ] ]
		[ this.transmutation[ property ][ 1 ] ];
	    } else {
		packet[ property ] = this.selection[ i ]
		[ this.transmutation[ property ] ];
	    }
	}

	this.data.push( packet );
    }
}

var Reduction = {
    add: function(p, v) {
	if(p.fpids.includes(v[FPID])) {
	    return p;
	} else {
	    p.fpids.push(v[FPID]);
	    p.line_count += +v[LINE_COUNT];
	    return p;
	}
    },
    remove: function(p, v) {},
    init: function(p, v) {
	return { fpids: [], line_count: 0 };
    }
}

var View = function( label ) {
    this.label = label;
    this.location = d3.select( '#' + label );
}
View.prototype.draw = function( data ) {
    var columns = Object.keys( data[0] );
    var location = this.location;
    var label = this.label;

    var table = this.location.append( 'table' );
    var thead = table
	.append( 'thead' )
	.append( 'tr' )
	.classed( 'label', true )
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
	    console.log( facet );
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
View.prototype.clear_canvas = function() {
    this.location.select( 'table' ).remove();
}

var Controller = function( label ) {
    this.label = label;
    this.filters = [];
}
Controller.prototype.toggle = function( facet ) {
    console.log( facet );
    if( this.filters.includes( facet ) ) {
	console.log( 'removed' );
	this.remove( facet );
    } else {
	console.log( 'added' );
	this.add( facet );
    }
    console.log( this.filters );
}
Controller.prototype.add = function( facet ) {
    this.filters.push( facet );
    dimensions[ this.label ].filter( facet );
    this.update();
}
Controller.prototype.remove = function( facet ) {
    var index = this.filters.indexOf( facet );
    
    this.filters.splice( index, 1 );
    dimensions[ this.label ].filterAll();
    this.update();
}
Controller.prototype.filter = function() {
    for( var l = this.filters.length, i = 0; i < l; ++i ) {
	dimensions[ this.label ].filter( this.filters[ i ] );
    }
}
Controller.prototype.update = function() {
    population.components[ this.label ].update();
    population.components[ 'raw' ].update();
    // population.components[ 'popup' ].update();
}

d3.tsv( 'tsv/index.tsv', function( data ) {
    var Crossfilter = crossfilter( data );

    dimensions = {};
    for(var l = DIMENSION_LABELS.length, i = 0; i < l; ++i) {
	var label = DIMENSION_LABELS[ i ];
	dimensions[ label ] = Crossfilter
	    .dimension( function( d ) { return d[ label ]; } );
    }

    population = new Population();
});
