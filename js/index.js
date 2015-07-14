var CHARACTER_LINE_COUNT = 'char_numlines';

d3.tsv( 'tsv/index.tsv', function( data ) {
    var Crossfilter = crossfilter( data );

    var thingie = function( label ) {

	var dimension1 = Crossfilter.dimension( function( d ) { return d.nomen; } );
	var dimension2 = Crossfilter.dimension( function( d ) { return d.fabulae; } );
	console.log( dimension1 );

	var filter = dimension2.filter( 'Adelphoe' );
	
	var selection = dimension1
	    .group()
	    .reduceSum( function( d ) { return d[ CHARACTER_LINE_COUNT ] } )
	    .all();
	console.log( selection );
	

	/*
	var dimension_unfiltered = Crossfilter.dimension( function( d ) { return d.nomen; } );
	console.log( dimension_unfiltered );
	console.log( dimension_unfiltered.top( Infinity ) );

	var selection_unfiltered = dimension_unfiltered
	    .group().reduceSum( function( d ) { return d[ CHARACTER_LINE_COUNT ] } ).all();
	console.log( selection_unfiltered );
	console.log( dimension_unfiltered.top( Infinity ) );


	var dimension_filtered = Crossfilter.dimension( function( d ) { return d.nomen; } );
	console.log( dimension_filtered );
	console.log( dimension_filtered.top( Infinity ) );

	var selection_filtered = dimension_filtered
	    .group().reduceSum( function( d ) { return d[ CHARACTER_LINE_COUNT ] } ).all();
	console.log( selection_filtered );
	console.log( dimension_filtered.top( Infinity ) );

	dimension_filtered.filter( 'Acroteleutium' );
	console.log( dimension_filtered.top( Infinity ) );
	*/
	
	// for component, precompile a list of all possible 'name' values
	// populate the controller's filter array with these values
    }

    thingie( 'nomen' );

} );
