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
var DIMENSIONS = 'dimensions';
var VERSE_GROUPS = 'verse_groups';
var VERSE_DETAIL = 'verse_detail';
var CONTROLS = [
    DIMENSIONS, POETA, FABULAE, GENERA, NOMEN, METER, METER_TYPE, METER_BEFORE,
    METER_AFTER
]
var PRESENTER_LABELS = [
    POETA, FABULAE, GENERA, NOMEN, METER, METER_TYPE, METER_BEFORE, METER_AFTER,
    VERSE_GROUPS, VERSE_DETAIL
];

var crossfilter;
var population;

d3.tsv( 'tsv/index.tsv', function( data ) {
    crossfilter = crossfilter( data );

    population = new Population();
    population.setup();
    population.update();
} );

var enable = function( dimension ) {
    var l, i;
    
    if( dimension == 'all' ) {
	for( l = CONTROLS.length, i = 1; i < l; ++i ) {
	    control( CONTROLS[ i ], true );
	}
    } else {
	control( dimension, true );
    }
}
var disable = function( dimension ) {
    if( dimension == 'all' ) {
	for( l = CONTROLS.length, i = 1; i < l; ++i ) {
	    control( CONTROLS[ i ], false );
	}
    } else {
	control( dimension, false );
    }
}
var control = function( dimension, state ) {
    var model;
    
    model = population.presenters[ dimension ].model;
    facets = model.facets;
    state ? model.filters_active = model.filters_all : model.filters_active = [];
    model.filter();
    for( property in facets ) {
	facets[ property ] = state;
    }
    population.update();
}
var next = function() {
    if( population.page < population.pages ) {
	++population.page;
	population.update();
    }
}
var previous = function() {
    if( population.page > 1 ) {
	--population.page;
	population.update();
    }
}
var dimension_toggle = function( dimension ) {
    if( population.display_status[ dimension ] == 0 ) {
	population.display_status[ dimension ] = 1;
    } else {
	population.display_status[ dimension ] = 0;
    }

    d3.select( '.' + dimension ).toggle();
}
var popup = function( id ) {
    var selection1, selection2;
 
    selection1 = d3.selectAll( '.none' );
    selection1.hide();
    
    selection2 = d3.select( '#' + id );
    selection2.toggle();
}
var toggle = function( id ) {
    var selection;

    selection = d3.select( '#' + id );
    selection.toggle();
}
var toggle_facet_state = function( model, facet, index ) {
    var dimension, facet_status, selection, facet_name;

    dimension = model.label;
    facet_status = model.facets[ facet ];
    selection_label = '#' + dimension + ' #' + dimension + '_' + index;
    selection = d3.select( selection_label );

    if( facet_status ) { 
	selection.classed( 'facet-on', false );
	selection.classed( 'facet-off', true );
	model.facets[ facet ] = false;
    } else {
	selection.classed( 'facet-on', true );
	selection.classed( 'facet-off', false );
	model.facets[ facet ] = true;
    }
}
