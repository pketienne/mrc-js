var Model = function( label ) {
    this.label = label;
    this.reference;
    this.group;
    this.data;
}
Model.prototype.update = function() {
    this.transmute();
}

var ModelA = function( label ) {
    Model.call( this, label );

    this.filterable;
    this.filters_all;
    this.filters_active;
    this.schema;
    
    var label = this.label;

    this.filterable = crossfilter
	.dimension( function( d ) { return d[ label ]; } );
    this.reference = crossfilter
	.dimension( function( d ) { return d[ label ]; } );
    this.group = this.reference
	.group()
	.reduce( this.reduce_add, this.reduce_remove, this.reduce_init )
	.all();
    this.schema = { 'Name': 'key', 'Lines': [ 'value', 'line_count' ] };
}
ModelA.prototype = Object.create( Model.prototype );
ModelA.prototype.constructor = ModelA;
ModelA.prototype.setup = function() {
    var filters, l, i;

    filters = [];

    this.transmute();

    for( l = this.data.length, i = 0; i < l; ++i ) {
	filters.push( this.data[ i ].Name );
    }

    this.filters_all = filters.slice( 0 );
    this.filters_active = filters.slice( 0 );
}
ModelA.prototype.toggle = function( facet ) {
    if( this.filters_active.includes( facet ) ) {
	this.remove( facet );
    } else {
	this.add( facet );
    }
}
ModelA.prototype.add = function( facet ) {
    this.filters_active.push( facet );
}
ModelA.prototype.remove = function( facet ) {
    var index = this.filters_active.indexOf( facet );
    
    this.filters_active.splice( index, 1 );
}
ModelA.prototype.filter = function() {
    var filters = this.filters_active;
    
    this.filterable.filter(
	function( d ) { return filters.indexOf( d ) > -1; }
    );
}
ModelA.prototype.transmute = function() {
    this.data = [];

    var l, i, packet, group, property, value;

    for( l = this.group.length, i = 0; i < l; ++i ) {
	packet = {};
	group = this.group[ i ];
	for( property in this.schema ) {
	    value = this.schema[ property ]
	    if( value instanceof Array ) {
		packet[ property ] = group[ value[ 0 ] ][ value[ 1 ] ];
	    } else {
		packet[ property ] = group[ value ];
	    }
	}
	this.data.push( packet );
    }
}

var ModelA1 = function( label ) {
    ModelA.call( this, label );
}
ModelA1.prototype = Object.create( ModelA.prototype );
ModelA1.prototype.constructor = ModelA1;
ModelA1.prototype.reduce_add = function( p, v ) {
    if( p.fpids.includes( v[ FPID ] ) ) {
	return p;
    } else {
	p.fpids.push( v[ FPID ] );
	p.line_count += +v[ LINE_COUNT ];
	return p;
    }
}
ModelA1.prototype.reduce_remove = function( p, v ) {
    if( p.fpids.includes( v[ FPID ] ) ) {
	p.fpids.splice( p.fpids.indexOf( v[ FPID ] ), 1 );
	p.line_count -= +v[ LINE_COUNT ];
	return p;
    } else {
	return p;
    }
}
ModelA1.prototype.reduce_init = function( p, v ) {
    return { fpids: [], line_count: 0 }
}

var ModelA2 = function( label ) {
    ModelA.call( this, label );
}
ModelA2.prototype = Object.create( ModelA.prototype );
ModelA2.prototype.constructor = ModelA2;
ModelA2.prototype.reduce_add = function( p, v ) {
    if( p.fpids.includes( v[ FPID ] ) ) {
	return p;
    } else {
	p.fpids.push( v[ FPID ] );
	p.line_count += +v[ LINE_COUNT ];
	return p;
    }
}
ModelA2.prototype.reduce_remove = function( p, v ) {
    if( p.fpids.includes( v[ FPID ] ) ) {
	p.fpids.splice( p.fpids.indexOf( v[ FPID ] ), 1 );
	p.line_count -= +v[ LINE_COUNT ];
	return p;
    } else {
	return p;
    }
}
ModelA2.prototype.reduce_init = function( p, v ) {
    return { fpids: [], line_count: 0 }
}

var ModelB = function( label ) {
    Model.call( this, label );
}
ModelB.prototype = Object.create( Model.prototype );
ModelB.prototype.constructor = ModelB;
ModelB.prototype.setup = function() {
    this.reference = population.presenters[ POETA ].model.reference;
    this.group = this.reference
	.groupAll()
	.reduce( this.reduce_add, this.reduce_remove, this.reduce_init )
	.value();
}
ModelB.prototype.reduce_add = function( p, v ) {
    var unique_id;

    unique_id
	= v[ NOMEN ]
	+ v[ NOMEN_LINE_COUNT ]
	+ v[ GENERA ]
	+ v[ METER ]
	+ v[ METER_TYPE ]
	+ v[ FPID ];

    p[ unique_id ] = {};
    p[ unique_id ][ FPID ] = v[ FPID ];
    p[ unique_id ][ POETA ] = v[ POETA ];
    p[ unique_id ][ FABULAE ] = v[ FABULAE ];
    p[ unique_id ][ LINE_COUNT ] = v[ LINE_COUNT ];
    p[ unique_id ][ STARTING_LINE_NUMBER_LABEL ]
	= v[ STARTING_LINE_NUMBER_LABEL ];
    p[ unique_id ][ STARTING_LINE_NUMBER_ORDINATE ]
	= v[ STARTING_LINE_NUMBER_ORDINATE ];
    p[ unique_id ][ STARTING_LINE ] = v[ STARTING_LINE ];
    p[ unique_id ][ ENDING_LINE_NUMBER_LABEL ]
	= v[ ENDING_LINE_NUMBER_LABEL ];
    p[ unique_id ][ ENDING_LINE_NUMBER_ORDINATE ]
	= v[ ENDING_LINE_NUMBER_ORDINATE ];
    p[ unique_id ][ ENDING_LINE ] = v[ ENDING_LINE ];
    p[ unique_id ][ NOMEN ] = v[ NOMEN ];
    p[ unique_id ][ NOMEN_LINE_COUNT ] = v[ NOMEN_LINE_COUNT ];
    p[ unique_id ][ GENERA ] = v[ GENERA ];
    p[ unique_id ][ METER ] = v[ METER ];
    p[ unique_id ][ METER_TYPE ] = v[ METER_TYPE ];
    p[ unique_id ][ METER_BEFORE ] = v[ METER_BEFORE ];
    p[ unique_id ][ METER_AFTER ] = v[ METER_AFTER ];
    p[ unique_id ][ CLOSURE ] = v[ CLOSURE ];
    p[ unique_id ][ COMMENTS_ON_LENGTH ] = v[ COMMENTS_ON_LENGTH ];
    p[ unique_id ][ COMMENTS_ON_OTHER ] = v[ COMMENTS_ON_OTHER ];

    return p;
}
ModelB.prototype.reduce_remove = function( p, v ) {
    var unique_id;

    unique_id
	= v[ NOMEN ]
	+ v[ NOMEN_LINE_COUNT ]
	+ v[ GENERA ]
	+ v[ METER ]
	+ v[ METER_TYPE ]
	+ v[ FPID ];

    delete p[ unique_id ];

    return p;
}
ModelB.prototype.reduce_init = function() {
    return {};
}

var ModelB1 = function( label ) {
    ModelB.call( this, label );
}
ModelB1.prototype = Object.create( ModelB.prototype );
ModelB1.prototype.constructor = ModelB1;
ModelB1.prototype.sort_array_by_object_key = function( array ) {
    return array.sort( function( a, b ) {
	var x, y;
	x = a[ STARTING_LINE_NUMBER_ORDINATE ];
	y = b[ STARTING_LINE_NUMBER_ORDINATE ];
	if( x < y ) {
	    return -1;
	} else if( x > y ) {
	    return 1;
	} else {
	    x = a[ FABULAE ];
	    y = b[ FABULAE ];
	    if( x < y ) {
		return -1;
	    } else if( x > y ) {
		return 1;
	    } else {
		return 0;
	    }
	}
    } );
}

ModelB1.prototype.transmute = function() {
    var data, fpids, property, value, fpid, l, i, record;

    data = [];
    fpids = {};

    for( property in this.group ) {
	value = this.group[ property ];
	fpid = value[ FPID ];

	if( !fpids[ fpid ] ) {
	    fpids[ fpid ] = []
	}

	fpids[ fpid ].push( value );
    }

    for( property in fpids ) {
	value = fpids[ property ];
	sup = {};

	sup[ FABULAE ] = value[ 0 ][ FABULAE ];
	sup[ STARTING_LINE_NUMBER_LABEL ]
	    = value[ 0 ][ STARTING_LINE_NUMBER_LABEL ];
	sup[ ENDING_LINE_NUMBER_LABEL ]
	    = value[ 0 ][ ENDING_LINE_NUMBER_LABEL ];
	sup[ LINE_COUNT ] = +value[ 0 ][ LINE_COUNT ];
	sup[ POETA ] = value[ 0 ][ POETA ];
	sup[ STARTING_LINE ] = value[ 0 ][ STARTING_LINE ];
	sup[ ENDING_LINE ] = value[ 0 ][ ENDING_LINE ];
	sup[ 'sub' ] = [];
	sup[ FPID ] = value[ 0 ][ FPID ];
	sup[ STARTING_LINE_NUMBER_ORDINATE ]
	    = +value[ 0 ][ STARTING_LINE_NUMBER_ORDINATE ];
	
	for( l = value.length, i = 0; i < l; ++i ) {
	    record = value[ i ];
	    sub = {};

	    sub[ NOMEN ] = record[ NOMEN ];
	    sub[ NOMEN_LINE_COUNT ] = +record[ NOMEN_LINE_COUNT ];
	    sub[ GENERA ] = record[ GENERA ];
	    sub[ METER ] = record[ METER ];
	    sub[ METER_TYPE ] = record[ METER_TYPE ];
	    sub[ METER_BEFORE ] = record[ METER_BEFORE ];
	    sub[ METER_AFTER ] = record[ METER_AFTER ];
	    sub[ 'id' ]
		= record[ NOMEN ]
		+ record[ NOMEN_LINE_COUNT ]
		+ record[ GENERA ]
		+ record[ METER ]
		+ record[ METER_TYPE ]
		+ record[ FPID ];
	    
	    sup[ 'sub' ].push( sub );
	}

	data.push( sup );
    }

    this.data = this.sort_array_by_object_key( data );
}

var ModelB2 = function( label ) {
    ModelB.call( this, label );
}
ModelB2.prototype = Object.create( ModelB.prototype );
ModelB2.prototype.constructor = ModelB2;
ModelB2.prototype.transmute = function() {
    this.data = this.group;
}
