var Model = function( label ) {
    this.label = label;
    this.filterable;
    this.reference;
    this.group;
    this.schema;
    this.data;
}
Model.prototype.update = function() {
    this.transmute();
}

var ModelA = function( label ) {
    Model.call( this, label );

    this.filters_all;
    this.filters_active;
    
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
    this.reference = population.controllers[ POETA ].model.reference;
    this.group = this.reference.top( Infinity );
    /*
	.groupAll()
	.reduce( this.reduce_add, this.reduce_remove, this.reduce_init )
	.value();
    */
}
ModelB.prototype.transmute = function() {
    this.data = this.group;
}

var ModelB1 = function( label ) {
    ModelB.call( this, label );

    this.schema = {
	'Poeta': POETA, 'Fabulae': FABULAE, 'Genera': GENERA,
	'Nomen': NOMEN, 'Meter': METER, 'Meter Type': METER_TYPE,
	'Meter Before': METER_BEFORE, 'Meter After': METER_AFTER,
	'Start': STARTING_LINE_NUMBER_LABEL, 'End': ENDING_LINE_NUMBER_LABEL,
	'Lines': LINE_COUNT, 'Character Lines': NOMEN_LINE_COUNT
    }
}
ModelB1.prototype = Object.create( ModelB.prototype );
ModelB1.prototype.constructor = ModelB1;
ModelB1.prototype.reduce_add = function( p, v ) {
    /*
    var sup, sub, found;

    sup = {};
    sup[ FABULAE ] = v[ FABULAE ];
    sup[ STARTING_LINE_NUMBER_LABEL ] = v[ STARTING_LINE_NUMBER_LABEL ];
    sup[ ENDING_LINE_NUMBER_LABEL ] = v[ ENDING_LINE_NUMBER_LABEL ];
    sup[ LINE_COUNT ] = v[ LINE_COUNT ];
    sup[ STARTING_LINE ] = v[ STARTING_LINE ];
    sup[ ENDING_LINE ] = v[ ENDING_LINE ];
    sup[ POETA ] = v[ POETA ];
    sup[ FPID ] = v[ FPID ];

    sub = {};
    sub[ NOMEN ] = v[ NOMEN ];
    sub[ GENERA ] = v[ GENERA ];
    sub[ NOMEN_LINE_COUNT ] = v[ NOMEN_LINE_COUNT ];
    sub[ METER ] = v[ METER ];
    sub[ METER_TYPE ] = v[ METER_TYPE ];
    sub[ METER_BEFORE ] = v[ METER_AFTER ];
    sub[ METER_AFTER ] = v[ METER_AFTER ];

    found = CROSSFILTER.index_search_add( p, v );

    if( found ) {
	p[ found ].sub.push( sub );
    } else {
	sup.sub = [ sub ];
	p.push( sup );
    }
    */
    return p;
}
ModelB1.prototype.reduce_remove = function( p, v ) {
    /*
    var sup, sub, found;

    sup = {};
    sup[ FABULAE ] = v[ FABULAE ];
    sup[ STARTING_LINE_NUMBER_LABEL ] = v[ STARTING_LINE_NUMBER_LABEL ];
    sup[ ENDING_LINE_NUMBER_LABEL ] = v[ ENDING_LINE_NUMBER_LABEL ];
    sup[ LINE_COUNT ] = v[ LINE_COUNT ];
    sup[ STARTING_LINE ] = v[ STARTING_LINE ];
    sup[ ENDING_LINE ] = v[ ENDING_LINE ];
    sup[ POETA ] = v[ POETA ];
    sup[ FPID ] = v[ FPID ];

    sub = {};
    sub[ NOMEN ] = v[ NOMEN ];
    sub[ GENERA ] = v[ GENERA ];
    sub[ NOMEN_LINE_COUNT ] = v[ NOMEN_LINE_COUNT ];
    sub[ METER ] = v[ METER ];
    sub[ METER_TYPE ] = v[ METER_TYPE ];
    sub[ METER_BEFORE ] = v[ METER_AFTER ];
    sub[ METER_AFTER ] = v[ METER_AFTER ];

    blah = CROSSFILTER.index_search_remove_sup( p, sup );
    foo = CROSSFILTER.index_search_remove_sub( blah, sub );

    console.log( blah );
    console.log( foo );
    */
    return p;
}
ModelB1.prototype.reduce_init = function( p, v ) {
    //return [];
    return {};
}

var ModelB2 = function( label ) {
    ModelB.call( this, label );

    this.schema = {
	'FPID': FPID, 'Poeta': POETA, 'Fabulae': FABULAE, 'Nomen': NOMEN,
	'Genera': GENERA, 'Meter': METER, 'Meter Type': METER_TYPE,
	'Meter Before': METER_BEFORE, 'Meter After': METER_AFTER,
	'Start': STARTING_LINE_NUMBER_LABEL, 'End': ENDING_LINE_NUMBER_LABEL,
	'Line Count': LINE_COUNT, 'Line Count per Character': NOMEN_LINE_COUNT,
	'First Line': STARTING_LINE, 'Last Line': ENDING_LINE,
	'Closure': CLOSURE, 'Comments on Length': COMMENTS_ON_LENGTH,
	'Other Comments': COMMENTS_ON_OTHER
    }
}
ModelB2.prototype = Object.create( ModelB.prototype );
ModelB2.prototype.constructor = ModelB2;
ModelB2.prototype.reduce_add = function( p, v ) {
    return p;
}
ModelB2.prototype.reduce_remove = function( p, v ) {
    return p;
}
ModelB2.prototype.reduce_init = function( p, v ) {
    return [];
}
