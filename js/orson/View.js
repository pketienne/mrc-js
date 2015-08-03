var View = function( label ) {
    this.label = label;
}

var ViewA = function( label ) {
    View.call( this, label );
}
ViewA.prototype = Object.create( View.prototype );
ViewA.prototype.constructor = ViewA;
ViewA.prototype.update = function( model ) {
    this.erase();
    this.draw( model );
}

var ViewA1 = function( label ) {
    ViewA.call( this, label );
}
ViewA1.prototype = Object.create( ViewA.prototype );
ViewA1.prototype.constructor = ViewA1;
ViewA1.prototype.erase = function() {
    d3.select( '#' + this.label ).remove();
}
ViewA1.prototype.draw = function( model ) {
    var columns, dimensions, dimension, title, table, rows, cells;

    columns = Object.keys( model.data[ 0 ] );

    dimensions = d3.select( '#dimensions' );
    dimension = dimensions
	.append( 'div' )
	.classed( 'dimension', true )
	.attr( 'id', this.label);
    title = dimension
	.append( 'h3' )
	.html( this.label );
    table = dimension
	.append( 'table' );
    rows = table
	.selectAll( 'tr' )
	.data( model.data )
	.enter()
	.append( 'tr' )
	.classed( 'facet', true )
	.on('click', function( facet, index ) {
	    model.toggle( facet.Name );
	    model.filter();
	    population.update();
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

var ViewA2 = function( label ) {
    ViewA.call( this, label );
}
ViewA2.prototype = Object.create( ViewA.prototype );
ViewA2.prototype.constructor = ViewA2;
ViewA2.prototype.erase = function() {
    d3.selectAll( '.' + this.label ).remove();
}
ViewA2.prototype.draw = function( model ) {
    var sup_data, sup_columns, sub_data, sub_columns,
	fragments, title, fragment, rows, cells, l, i;

    sup_data = model.data;
    sup_columns = Object.keys( sup_data[ 0 ] ).splice( 0, 7 );
    sup_column_labels = [
	'Fabulae', 'Starting Line', 'Ending Line', 'Line Count', 'Poeta',
	'Starting Text', 'Ending Text'
    ];
    sub_data = sup_data.map( function( d ) { return d.sub; } );
    sub_columns = Object.keys( sup_data[ 0 ] );
    sub_column_labels = [
	'Nomen', 'Line Count', 'Genera', 'Meter', 'Meter Type',
	'Meter Before', 'Meter After'
    ];
    fragments = d3.select( '#' + this.label + 's' );
    title = fragments
	.append( 'h3' )
	.classed( this.label, true )
	.html( this.label + 's' );
    fragment = fragments
	.append( 'div' )
	.classed( this.label + ' table', true );
    rows = fragment
	.selectAll( 'div' )
	.data( model.data )
	.enter()
	.append( 'div' )
	.classed( 'tr sup', true )
	.attr( 'id', function( d ) { return 'FPID-' + d[ FPID ]; } );
    cells = rows
	.selectAll( 'div' )
	.data( function( sup_row ) {
	    return sup_columns.map( function( sup_column ) {
		return { name: sup_column, value: sup_row[ sup_column ] };
	    } );
	} )
	.enter()
	.append( 'div' )
	.attr( 'class', function( d ) { return 'td sup ' + d.name; } )
	.html( function( d ) { return d.value; } );

    for( a = sup_data.length, n = 0; n < a; ++n ) {
	sup_datum = sup_data[ n ];
	fpid = sup_datum[ FPID ];
	css_id = '#FPID-' + fpid;
	selection = d3.select( css_id );

	for( d = sup_datum.sub.length, q = 0; q < d; ++q ) {
	    sub_datum = sup_datum.sub[ q ];
	    sub_rows = selection
		.after( 'div' )
		.classed( 'tr sub', true )
	    for( property in sub_datum ) {
		value = sub_datum[ property ];
		sub_rows
		    .append( 'div' )
		    .classed( 'td sub ' + property, true )
		    .html( value );
	    }
	}

	sup_legend = selection
	    .before( 'div' )
	    .classed( 'tr sup legend', true )
	sub_legend = selection
	    .after( 'div' )
	    .classed( 'tr sub legend', true )

	
	for( b = sup_column_labels.length, o = 0; o < b; ++o ) {
	    sup_legend
		.append( 'div' )
		.classed( 'td sup legend', true )
		.html( sup_column_labels[ o ] );
	}
	for( c = sub_column_labels.length, p = 0; p < o; ++p ) {
	    sub_legend
		.append( 'div' )
		.classed( 'td sup legend', true )
		.html( sub_column_labels[ p ] );
	}
    }
}

var ViewB = function( label ) {
    View.call( this, label );
}
ViewB.prototype = Object.create( View.prototype );
ViewB.prototype.constructor = ViewB;
ViewB.prototype.update = function() {
    this.erase();
}
ViewB.prototype.erase = function() {
    d3.select( '#' + this.label ).remove();
}
ViewB.prototype.draw = function( data ) {
    // View for pop-up details
}

var ViewC = function( label ) {
    this.label = label;
}
ViewC.prototype = Object.create( View.prototype );
ViewC.prototype.constructor = ViewC;
ViewC.prototype.draw = function() {}
