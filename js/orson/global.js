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
var FRAGMENT = 'fragment';
var DETAIL = 'detail';
var CONTROLLER_LABELS = [
    POETA, FABULAE, GENERA, NOMEN, METER, METER_TYPE, METER_BEFORE, METER_AFTER,
    FRAGMENT, DETAIL
];

var crossfilter;
var population;

var CROSSFILTER = {
    index_search_add: function( p, v ) {
	var lost = p.length;

	if( lost == false ) { return false; }
	
	do {
	    if( p[ lost - 1 ][ FPID ] == v[ FPID ] ) {
		return ( lost - 1 );
	    } else {
		--lost;
	    }
	} while ( lost )
    },
    index_search_remove_sup: function( p, sup ) {
	var lost, copy;

	lost = p.length;

	do {
	    copy = JSON.parse( JSON.stringify( p[ lost - 1 ] ) );
	    delete copy.sub;

	    if( JSON.stringify( copy ) === JSON.stringify( sup ) ) {
		return lost;
	    } else {
		--lost;
	    }
	} while ( lost )
    },
    index_search_remove_sub: function( sup, sub ) {
	var lost = sup.length;

	do {
	    if( JSON.stringify( sup[ lost - 1 ] ) === JSON.stringify( sub ) ) {
		return lost;
	    } else {
		--lost;
	    }
	} while ( lost )
    }
}

d3.tsv( 'tsv/index.tsv', function( data ) {
    crossfilter = crossfilter( data );

    population = new Population();
    population.setup();
    population.update();
} );
