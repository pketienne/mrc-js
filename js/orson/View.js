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
    	.attr( 'onclick', 'dimension_toggle( "' + this.label + '" )' )
	.html( this.label );
    table = dimension
	.append( 'table' )
	.classed( this.label, true );
    rows = table
	.selectAll( 'tr' )
	.data( model.data )
	.enter()
	.append( 'tr' )
	.classed( 'facet', true )
	.on( 'click', function( facet, index ) {
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

    this.instances;
    this.pages;
    this.page = 1;
}
ViewA2.prototype = Object.create( ViewA.prototype );
ViewA2.prototype.constructor = ViewA2;
ViewA2.prototype.erase = function() {
    d3.selectAll( '.verse-group' ).remove();
    d3.selectAll( '.verse-menu' ).remove();
}
ViewA2.prototype.draw = function( model ) {
    var datum, verse_groups, verse_group,
	sup, sup_table, sup_table_header, sup_table_header_row,
	sup_table_header_row_columns, sup_table_header_row_cells,
	sub, sub_table, sub_table_header, sub_table_header_row,
	sub_table_header_row_columns, sub_table_header_row_cells,
	max, start, l, i, view;
	
    sup_table_header_row_columns = [
	'Fabulae', 'Starting Line', 'Ending Line', 'Line Count', 'Poeta',
	'Starting Text', 'Ending Text'
    ];
    sub_table_header_row_columns = [
	'Nomen', 'Line Count', 'Genera', 'Meter', 'Meter Type',
	'Meter Before', 'Meter After'
    ];

    this.instances = model.data.length;
    this.pages = Math.ceil( this.instances / 100 );
    page = this.page;
      
    verse_groups = d3.select( '#verse_groups' );
    verse_title = verse_groups
	.append( 'div' )
	.classed( 'verse-menu', true )
	.append( 'span' )
	.classed( 'text', true )
	.html( 'Verse Groups' )
	.after( 'span' )
	.attr( 'id', 'menu' )
	.after( 'span' )
	.html( ' - ' + model.data.length + ' Instances' );
    menu = d3.select( '#menu' )
	.append( 'a' )
	.classed( 'previous', true )
	.attr( 'onclick', 'previous()' )
	.html( '< Previous' )
	.after( 'span' )
	.classed( 'page-counter', true )
	.html( 'Page ' + this.page + ' of ' + this.pages )
	.after( 'a' )
	.classed( 'next', true )
	.attr( 'onclick', 'next()' )
	.html( 'Next >' );
  
    max = this.page * 100;
    if( max > this.instances ) {
	max = this.instances
    }
    start = ( this.page - 1 ) * 100;
    
    for( l = max, i = start; i < l; ++i ) {
	datum = model.data[ i ];
	sub = datum.sub;
	delete datum.sub;
	delete datum[ FPID ];
	delete datum[ STARTING_LINE_NUMBER_ORDINATE ];
	sup = datum;

	verse_group = verse_groups
	    .append( 'div' )
	    .classed( 'verse-group', true );

	sup_table = verse_group
	    .append( 'div' )
	    .classed( 'table sup', true );
	sup_table_header = sup_table
	    .append( 'div' )
	    .classed( 'thead', true );
	sup_table_header_row = sup_table_header
	    .append( 'div' )
	    .classed( 'tr', true );
	sup_table_header_row_cells
	    = this.draw_header_cells( sup_table_header_row,
				      sup_table_header_row_columns );
	sup_table_body = sup_table
	    .append( 'div' )
	    .classed( 'tbody', true );
	sup_table_body_row = sup_table_body
	    .append( 'div' )
	    .classed( 'tr', true );
	sup_table_body_row_cells
	    = this.draw_body_cells( sup_table_body_row, datum );
	
	sub_table = verse_group
	    .append( 'div' )
	    .classed( 'table sub', true );
	sub_table_header = sub_table
	    .append( 'div' )
	    .classed( 'thead', true );
	sub_table_header_row = sub_table_header
	    .append( 'div' )
	    .classed( 'tr', true );
	sub_table_header_row_cells
	    = this.draw_header_cells( sub_table_header_row,
				      sub_table_header_row_columns );
	sub_table_body = sub_table
	    .append( 'div' )
	    .classed( 'tbody', true );
	sub_table_body_rows
	    = this.draw_body_rows( sub_table_body, sub )
    }
}
ViewA2.prototype.draw_header_cells = function( selection, array ) {
    var l, i;
    for( l = array.length, i = 0; i < l; ++i ) {
	selection
	    .append( 'div' )
	    .classed( 'th col' + i, true )
	    .html( array[ i ] );
    }
}
ViewA2.prototype.draw_body_cells = function( selection, object ) {
    var property;
    for( property in object ) {
	selection
	    .append( 'div' )
	    .classed( 'td ' + property, true )
	    .html( object[ property ] );
    }
}
ViewA2.prototype.draw_body_rows = function( selection, array ) {
    var l, i;
    for( l = array.length, i = 0; i < l; ++i ) {
	sub_table_body_row
	    = selection.append( 'div' ).classed( 'tr', true );
	this.draw_body_cells( sub_table_body_row, array[ i ] );
    }
}
ViewA2.prototype.next = function() {
    this.page++;
    population.update();
}
ViewA2.prototype.previous = function() {
    this.page--;
    population.update();
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
ViewC.prototype.draw = function() {
    selection = d3.select( '#verse_groups' );
}
