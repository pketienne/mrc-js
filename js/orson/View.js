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
ViewA.prototype.update = function( model ) {
    this.erase();
    this.draw( model );
}

var ViewA1 = function( label ) {
    ViewA.call( this, label );
}
ViewA1.prototype = Object.create( ViewA.prototype );
ViewA1.prototype.constructor = ViewA1;
ViewA1.prototype.draw = function( model ) {
    var data, columns, label, table, thead, tbody, rows, cells;

    columns = Object.keys( model.data[ 0 ] );
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
ViewA2.prototype.draw = function( model ) {
    var data, columns, fragments, fragment,
	section1,
	fabulae, fabulae_label, fabulae_value,
	starting_line_number_label, starting_line_number_label_label, starting_line_number_label_value,
	ending_line_number_label, ending_line_number_label_label, ending_line_number_label_value,
	line_count, line_count_label, line_count_value,
	poeta, poeta_label, poeta_value,
	section2,
	starting_line, starting_line_label, starting_line_value,
	ending_line, ending_line_label, ending_line_value,
	section3,
	nomen, nomen_label, nomen_value,
	genera, genera_label, genera_value,
	clines, clines_label, clines_value,
	meter, meter_label, meter_value,
	meter_type, meter_type_label, meter_type_value,
	meter_before, meter_before_label, meter_before_value,
	meter_after, meter_after_label, meter_after_value;

    fragments = d3.select( '#fragments' );
    fragment = fragments
	.selectAll( 'div' )
	.data( model.data )
	.enter()
	.append( 'div' )
	.classed( 'fragment', true );
    section1 = fragment
	.append( 'div' )
	.classed( 'row', true );
    fabulae = section1
	.append( 'div' )
	.classed( 'col-5-1', true );
    fabulae_label = fabulae
	.append( 'div' )
	.classed( 'col-2-1 label', true )
	.html( 'Fabulae' );
    fabulae_value = fabulae
	.append( 'div' )
	.classed( 'col-2-1 value', true )
	.html( function( d ) { return d[ FABULAE ] } );
    starting_line_number_label = section1
	.append( 'div' )
	.classed( 'col-5-1', true );
    starting_line_number_label_label = starting_line_number_label
	.append( 'div' )
	.classed( 'col-2-1 label', true )
	.html( 'Starts at Line:' );
    starting_line_number_label_value = starting_line_number_label
	.append( 'div' )
	.classed( 'col-2-1 value', true )
	.html( function( d ) { return d[ STARTING_LINE_NUMBER_LABEL ] } );
    ending_line_number_label = section1
	.append( 'div' )
	.classed( 'col-5-1', true );
    ending_line_number_label_label = ending_line_number_label
	.append( 'div' )
	.classed( 'col-2-1 label', true )
	.html( 'Ends at Line:' );
    ending_line_number_label_value = ending_line_number_label
	.append( 'div' )
	.classed( 'col-2-1 value', true )
	.html( function( d ) { return d[ ENDING_LINE_NUMBER_LABEL ] } );
    line_count = section1
	.append( 'div' )
	.classed( 'col-5-1', true );
    line_count_label = line_count
	.append( 'div' )
	.classed( 'col-2-1 label', true )
	.html( 'Total Lines:' );
    line_count_value = line_count
	.append( 'div' )
	.classed( 'col-2-1 value', true )
	.html( function( d ) { return d[ LINE_COUNT ] } );
    poeta = section1
	.append( 'div' )
	.classed( 'col-5-1', true );
    poeta_label = poeta
	.append( 'div' )
	.classed( 'col-2-1 label', true )
	.html( 'Poeta:' );
    poeta_value = poeta
	.append( 'div' )
	.classed( 'col-2-1 value', true )
	.html( function( d ) { return d[ POETA ] } );
    section2 = fragment
	.append( 'div' )
	.classed( 'row', true )
    starting_line = section2
	.append( 'div' )
	.classed( 'row', true );
    starting_line_label = starting_line
	.append( 'div' )
	.classed( 'col-2-1 label', true )
	.html( 'First Line:' );
    starting_line_value = starting_line
	.append( 'div' )
	.classed( 'col-2-1 value', true )
	.html( function( d ) { return d[ STARTING_LINE ] } );
    ending_line = section2
	.append( 'div' )
	.classed( 'row', true );
    ending_line_label = ending_line
	.append( 'div' )
	.classed( 'col-2-1 label', true )
	.html( 'Last Line:' );
    ending_line_value = ending_line
	.append( 'div' )
	.classed( 'col-2-1 value', true )
	.html( function( d ) { return d[ ENDING_LINE ] } );
    section3 = fragment
	.append( 'div' )
	.selectAll( 'div' )
	.data( function( d ) { return d[ 'sub' ] } )
	.enter()
	.append( 'div' );
    nomen = section3
	.append( 'div' )
	.classed( 'col-7-1', true );
    nomen_label = nomen
	.append( 'div' )
	.classed( 'col-2-1 label', true )
	.html( 'Nomen:' );
    nomen_value = nomen
	.append( 'div' )
	.classed( 'col-2-1 value', true )
	.html( function( d ) { return d[ NOMEN ]; } );
    genera = section3
	.append( 'div' )
	.classed( 'col-7-1', true );
    genera_label = genera
	.append( 'div' )
	.classed( 'col-2-1 label', true )
	.html( 'Genera:' );
    genera_value = genera
	.append( 'div' )
	.classed( 'col-2-1 value', true )
	.html( function( d ) { return d[ GENERA ]; } );
    clines = section3
	.append( 'div' )
	.classed( 'col-7-1', true );
    clines_label = clines
	.append( 'div' )
	.classed( 'col-2-1 label', true )
	.html( 'Character Lines:' );
    clines_value = clines
	.append( 'div' )
	.classed( 'col-2-1 value', true )
	.html( function( d ) { return d[ NOMEN_LINE_COUNT ]; } );
    meter = section3
	.append( 'div' )
	.classed( 'col-7-1', true );
    meter_label = meter
	.append( 'div' )
	.classed( 'col-2-1 label', true )
	.html( 'Meter:' );
    meter_value = meter
	.append( 'div' )
	.classed( 'col-2-1 value', true )
	.html( function( d ) { return d[ METER ]; } );
    meter_type = section3
	.append( 'div' )
	.classed( 'col-7-1', true );
    meter_type_label = meter_type
	.append( 'div' )
	.classed( 'col-2-1 label', true )
	.html( 'Meter Type:' );
    meter_type_value = meter_type
	.append( 'div' )
	.classed( 'col-2-1 value', true )
	.html( function( d ) { return d[ METER_TYPE ]; } );
    meter_before = section3
	.append( 'div' )
	.classed( 'col-7-1', true );
    meter_before_label = meter_before
	.append( 'div' )
	.classed( 'col-2-1 label', true )
	.html( 'Meter Before:' );
    meter_before_value = meter_before
	.append( 'div' )
	.classed( 'col-2-1 value', true )
	.html( function( d ) { return d[ METER_BEFORE ]; } );
    meter_after = section3
	.append( 'div' )
	.classed( 'col-7-1', true );
    meter_after_label = meter_after
	.append( 'div' )
	.classed( 'col-2-1 label', true )
	.html( 'Meter After:' );
    meter_after_value = meter_after
	.append( 'div' )
	.classed( 'col-2-1 value', true )
	.html( function( d ) { return d[ METER_AFTER ];	} );
}

var ViewB = function( label ) {
    View.call( this, label );
}
ViewB.prototype = Object.create( View.prototype );
ViewB.prototype.constructor = ViewB;
ViewB.prototype.update = function() {
    this.erase();
}
ViewB.prototype.draw = function( data ) {
    // View for pop-up details
}
