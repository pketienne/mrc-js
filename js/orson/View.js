var View = function( label ) {
    this.label = label;
    this.model;
}
View.prototype.setup = function( model ) {
    this.model = model;
}
View.prototype.update = function( model ) {
    this.erase();
    this.draw( model );
}

var ViewA = function( label ) {
    View.call( this, label );
}
ViewA.prototype = Object.create( View.prototype );
ViewA.prototype.constructor = ViewA;
ViewA.prototype.get_label = function() {
    
    switch( this.label ) {
    case POETA:
	return 'Playwright'
	break;
    case 'fabulae':
	return 'play'
	break;
    case 'genera':
	return 'Character Type'
	break;
    case 'nomen':
	return 'Character'
	break;
    case 'meter':
	return 'Meter'
	break;
    case 'meter_type':
	return 'Meter Type'
	break;
    case 'meter_before':
	return 'Meter Before'
	break;
    case 'meter_after':
	return 'Meter After'
	break;
    }
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
    label = this.get_label();
    
    dimensions = d3.select( '#dimensions' );
    dimension = dimensions
	.append( 'div' )
	.classed( 'dimension', true )
	.attr( 'id', this.label);
    title = dimension
	.append( 'h3' )
    	.attr( 'onclick', 'dimension_toggle( "' + this.label + '" )' )
	.html( label );
    table = dimension
	.append( 'table' )
	.classed( this.label, true );
    rows = table
	.selectAll( 'tr' )
	.data( model.data )
	.enter()
	.append( 'tr' )
	.attr( 'class', function( facet, index ) {
	    if( model.facets[ facet.Name ] ) {
		return 'facet facet-on'
	    } else {
		return 'facet facet-off'
	    }
	} )
	.attr( 'id', function( facet, index ) {
	    return model.label + '_' + index;
	} )
	.on( 'click', function( facet, index ) {
	    model.toggle( facet.Name );
	    model.filter();
	    population.update();
	    toggle_facet_state( model, facet.Name, index );
	} )
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
    d3.selectAll( '.verse-group' ).remove();
    d3.selectAll( '.verse-menu' ).remove();
}
ViewA2.prototype.draw = function( model ) {
    var datum, verse_groups, verse_group,
	sup, sup_table, sup_table_header, sup_table_header_row,
	sup_table_header_row_columns, sup_table_header_row_cells,
	sub1, sub1_table, sub1_table_header, sub1_table_header_row,
	sub1_table_header_row_columns, sub1_table_header_row_cells,
	sub2, sub2_table, sub2_table_header, sub2_table_header_row,
	sub2_table_header_row_columns, sub2_table_header_row_cells,
	max, start, l, i, view;
	
    sup_table_header_row_columns = [
	'Play', 'Starting Line', 'Ending Line', 'Line Count', 'Playwright',
	'Starting Text', 'Ending Text', 'Meter', 'Meter Before', 'Meter After'
    ];
    sub1_table_header_row_columns = [
	'Character', 'Line Count', 'Character Type'
    ];
    sub2_table_header_row_columns = [
	'Meter Type'
    ];

    population.instances = model.data.length;
    population.pages = Math.ceil( population.instances / 100 );
    page = population.page;
      
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
	.html( 'Page ' + population.page + ' of ' + population.pages )
	.after( 'a' )
	.classed( 'next', true )
	.attr( 'onclick', 'next()' )
	.html( 'Next >' );
  
    max = population.page * 100;
    if( max > population.instances ) {
	max = population.instances
    }
    start = ( population.page - 1 ) * 100;
    
    for( l = max, i = start; i < l; ++i ) {
	datum = model.data[ i ];
	sub1 = datum.sub1;
	sub2 = datum.sub2;
	fpid = datum[ FPID ];
	delete datum.sub1;
	delete datum.sub2;
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
	    = this.draw_sup_header_cells( sup_table_header_row,
				      sup_table_header_row_columns );
	sup_table_body = sup_table
	    .append( 'div' )
	    .classed( 'tbody', true );
	sup_table_body_row = sup_table_body
	    .append( 'div' )
	    .classed( 'tr', true );
	sup_table_body_row_cells
	    = this.draw_sup_body_cells( sup_table_body_row, datum, fpid );
	
	sub1_table = verse_group
	    .append( 'div' )
	    .classed( 'table sub1', true );
	sub1_table_header = sub1_table
	    .append( 'div' )
	    .classed( 'thead', true );
	sub1_table_header_row = sub1_table_header
	    .append( 'div' )
	    .classed( 'tr', true );
	sub1_table_header_row_cells
	    = this.draw_sub_header_cells( sub1_table_header_row,
				      sub1_table_header_row_columns );
	sub1_table_body = sub1_table
	    .append( 'div' )
	    .classed( 'tbody', true );
	sub1_table_body_rows
	    = this.draw_body_rows( sub1_table_body, sub1 )

	sub2_table = verse_group
	    .append( 'div' )
	    .classed( 'table sub2', true );
	sub2_table_header = sub2_table
	    .append( 'div' )
	    .classed( 'thead', true );
	sub2_table_header_row = sub2_table_header
	    .append( 'div' )
	    .classed( 'tr', true );
	sub2_table_header_row_cell = sub2_table_header_row
	    .append( 'div' )
	    .classed( 'th col0', true)
	    .html( 'Meter' );
	sub2_table_body = sub2_table
	    .append( 'div' )
	    .classed( 'tbody', true );
	sub2_table_body_rows
	    = this.draw_sub2_body_rows( sub2_table_body, sub2 )
    }
}
ViewA2.prototype.draw_sup_header_cells = function( selection, array ) {
    var l, i;
    for( l = array.length, i = 0; i < l; ++i ) {
	selection
	    .append( 'div' )
	    .classed( 'th col' + i, true )
	    .html( array[ i ] );
    }
    selection
	.append( 'div' )
	.classed( 'th', true )
	.html( 'Extras' );
}
ViewA2.prototype.draw_sub_header_cells = function( selection, array ) {
    var l, i;
    for( l = array.length, i = 0; i < l; ++i ) {
	selection
	    .append( 'div' )
	    .classed( 'th col' + i, true )
	    .html( array[ i ] );
    }
}
ViewA2.prototype.draw_sup_body_cells = function( selection, object, fpid ) {
    var property;
    for( property in object ) {
	if( property != 'id' ) {
	    selection
		.append( 'div' )
		.classed( 'td ' + property, true )
		.html( object[ property ] );
	}
    }
    selection
	.append( 'div' )
	.classed( 'td ' + property, true )
	.append( 'a' )
	.classed( 'notes', true )
	.attr( 'id', 'o' + fpid )
	.attr( 'onclick', "popup( '" + fpid + "' );" )
	.html( 'Notes' );
}
ViewA2.prototype.draw_sub_body_cells = function( selection, object ) {
    var property;
    for( property in object ) {
	if( property != 'id' ) {
	    selection
		.append( 'div' )
		.classed( 'td ' + property, true )
		.html( object[ property ] );
	}
    }
}
ViewA2.prototype.draw_body_rows = function( selection, array ) {
    var l, i;
    for( l = array.length, i = 0; i < l; ++i ) {
	sub_table_body_row
	    = selection
	    .append( 'div' )
	    .classed( 'tr', true );
	this.draw_sub_body_cells( sub_table_body_row, array[ i ] );
    }
}
ViewA2.prototype.draw_sub2_body_rows = function( selection, array ) {
    var l, i;
    for( l = array.length, i = 0; i < l; ++i ) {
	selection
	    .append( 'div' )
	    .classed( 'tr', true )
	    .append( 'div' )
	    .classed( 'td meter', true )
	    .html( array[ i ] );
    }
    console.log( array );
}
ViewA2.prototype.next = function() {
    population.page++;
    population.update();
}
ViewA2.prototype.previous = function() {
    population.page--;
    population.update();
}

var ViewB = function( label ) {
    View.call( this, label );
}
ViewB.prototype = Object.create( View.prototype );
ViewB.prototype.constructor = ViewB;
ViewB.prototype.erase = function() {
    d3.select( '.' + this.label ).remove();
}
ViewB.prototype.setup = function( model ) {
    this.model = model;
    this.draw( model );
}
ViewB.prototype.update = function() {
}
ViewB.prototype.draw = function( model ) {
    var data, selection, l, i;

    model.transmute();
    data = model.data;
    selection = d3.select( '#' + this.label + 's' );

    for( property1 in data ) {
	table = selection
	.append( 'table' )
	    .attr( 'id', property1 )
	    .attr( 'onclick', "toggle( '" + property1 + "' )" )
	    .classed( 'none', true );
	for( property2 in data[ property1 ] ) {
	    rows = table
		.append( 'tr' )
	    cells = rows
		.append( 'td' )
	    .html( property2 + ':' )
		.after( 'td' )
		.html( data[ property1 ][ property2 ] );
	}
    }
}
