var CHARACTER_LINE_COUNT = 'char_numlines';

d3.tsv( 'tsv/index.tsv', function( data ) {
    var Crossfilter = crossfilter( data );

    var thingie = function( label ) {
	var dimension_unfiltered = Crossfilter.dimension( function( d ) { return d.nomen; } );
	var dimension_filtered = Crossfilter.dimension( function( d ) { return d.nomen; } );
	var selection_filtered = dimension_unfiltered
	    .group().reduceSum( function( d ) { return d[ CHARACTER_LINE_COUNT ] } ).all();

	// for component, precompile a list of all possible 'name' values
	// populate the controller's filter array with these values
	
	dimension_filtered.filter( 'Acroteleutium' );
	
	console.log( dimension_filtered.top( Infinity ) );
	console.log( selection_filtered );
    }

    thingie( 'nomen' );

} );
