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
    /*
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
    */
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
    var sup_columns, sub_columns, fragments, fragment, rows, cells;

    sup_columns = Object.keys( model.data[ 0 ] );
    sup_columns = sup_columns.splice( 0, 8 );
    sub_columns = Object.keys( model.data[ 0 ][ 'sub' ][ 0 ] );

    fragments = d3.select( '#fragments' );
    title = fragments
	.append( 'h3' )
	.html( this.label + 's' );
    table = fragments
	.append( 'div' )
	.classed( 'table', true );
    rows = table
	.selectAll( 'div' )
	.data( model.data )
	.enter()
	.append( 'div' )
	.classed( 'tr', true );
    cells = rows
	.selectAll( 'div' )
	.data( function( sup_row ) {
	    return sup_columns.map(
		function( sup_column ) {
		    return { name: sup_column, value: sup_row[ sup_column ] }
		}	    
	    )
	} )
	.enter()
	.append( 'div' )
	.attr( 'class', function( d ) {
	    if( d.name != 'sub' ) {
		return 'td'
	    }
	} )
	.html( function( d ) {
	    if( d.name != 'sub' ) {
		return d.value
	    }
	} );
    foo = cells
	.selectAll( 'div' )
	.data( function( d ) {
	    if( d.name == 'sub' ) {
		return d.value;
	    }
	    return false;
	} )
	.enter()
	.append( 'div' )
	.classed( 'tr', true );
    blah = foo
	.selectAll( 'div' )
	.data( function( sub_row ) {
	    return sub_columns.map(
		function( sub_column ) {
		    return { name: sub_column, value: sub_row[ sub_column ] }
		}
	    )
	} )
	.enter()
	.append( 'div' )
	.classed( 'td', true )
	.html( function( d ) { return d.value; } );
}
ViewA2.prototype.draw_old = function( model ) {
    var sup_columns, sub_columns, fragments, fragment, title, sup_rows,
	sup_cells, sup_row, sup_column, sub_rows, sub_cells, sub_row,
	sub_column;
    
    sup_columns = Object.keys( model.data[ 0 ] );
    sup_columns = sup_columns.splice( 0, 7 );
    sub_columns = Object.keys( model.data[ 0 ][ 'sub' ][ 0 ] );

    sup_fragments = d3.select( '#fragments' );
    sup_fragment = sup_fragments
	.append( 'div' )
	.classed( 'fragment', true);
    title = sup_fragment
	.append( 'h3' )
	.html( this.label );
    table = sup_fragment
	.append( 'table' );
    sup_rows = table
	.selectAll( 'tr' )
	.data( model.data )
	.enter()
	.append( 'tr' )
	.attr( 'id', function( d, i ) { return d[ FPID ]; } );
    sup_cells = sup_rows
	.selectAll( 'td' )
	.data ( function( sup_row ) {
	    return sup_columns.map( function( sup_column ) {
		return { name: sup_column, value: sup_row[ sup_column ] };
	    } )
	} )
	.enter()
	.append( 'td' )
	.attr( 'class', function( d ) { return d.name; } )
	.html( function( d ) { return d.value; } );
    sub_fragments = d3.select( '#fragments table tr' );
    sub_rows = sub_fragments
	.selectAll( 'tr' )
	.data( model.data )
	.enter()
	.append( 'tr' )
	.classed( 'blatherskite', true);
    sub_cells = sub_rows
	.selectAll( 'td' )
	.data ( function( sub_row ) {
	    return sub_columns.map( function( sub_column ) {
		return { name: sub_column, value: sub_row[ sub_column ] };
	    } )
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
