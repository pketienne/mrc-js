var Model = function( label ) {
    this.label = label;
    this.reference;
    this.group;
    this.data;
}
Model.prototype.update = function() {
    this.transmute();
}



/* ModelA is a generic Facet model */

var ModelA = function( label ) {
    Model.call( this, label );

    this.filterable;
    this.filters_all;
    this.filters_active;
    this.facets;
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
    this.facets = {};

    this.transmute();

    for( l = this.data.length, i = 0; i < l; ++i ) {
	filters.push( this.data[ i ].Name );
	this.facets[ this.data[ i ].Name ] = true;
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

/* ModelA1 is a "count-by-line" model */

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

/* ModelA2 is a "count-by-character-verse" model */

var ModelA2 = function( label ) {
    ModelA.call( this, label );
}
ModelA2.prototype = Object.create( ModelA.prototype );
ModelA2.prototype.constructor = ModelA2;
ModelA2.prototype.reduce_add = function( p, v ) {
    var unique_id;
    unique_id
	= v[ NOMEN ]
	+ v[ GENERA ]
	+ v[ FPID ];

    if( p.unique_ids.includes( unique_id ) ) {
	    return p;
    } else {
	    p.unique_ids.push( unique_id );
	    p.line_count += +v[ NOMEN_LINE_COUNT ];
	    return p;
    }
}
ModelA2.prototype.reduce_remove = function( p, v ) {
    var unique_id;
    unique_id
	= v[ NOMEN ]
	+ v[ GENERA ]
	+ v[ FPID ];

    if( p.unique_ids.includes( unique_id ) ) {
	p.unique_ids.splice( p.unique_ids.indexOf( unique_id ), 1 );
	p.line_count -= +v[ NOMEN_LINE_COUNT ];
	return p;
    } else {
	return p;
    }
}
ModelA2.prototype.reduce_init = function() {
    return { unique_ids: [], line_count: 0 };
}




/* ModelA3 is a "count-by-unit (verse-group)" model */

var ModelA3 = function( label ) {
    ModelA.call( this, label );
}
ModelA3.prototype = Object.create( ModelA.prototype );
ModelA3.prototype.constructor = ModelA3;
ModelA3.prototype.reduce_add = function( p, v ) {
    var unique_id;
    unique_id = v[ FPID ];
    if( p.unique_ids.includes( unique_id ) || +v[NOMEN_LINE_COUNT] == 0 ) {
	    return p;
    } else {
	    p.unique_ids.push( unique_id );
	    p.line_count += 1;
	    return p;
    }
}
ModelA3.prototype.reduce_remove = function( p, v ) {
    var unique_id;
    unique_id = v[ FPID ];
    if( p.unique_ids.includes( unique_id ) || +v[NOMEN_LINE_COUNT] == 0) {
	p.unique_ids.splice( p.unique_ids.indexOf( unique_id ), 1 );
	p.line_count -= 1;
	return p;
    } else {
	return p;
    }
}
ModelA3.prototype.reduce_init = function() {
    return { unique_ids: [], line_count: 0 };
}



/* ModelB carries verse group data for each verse group */

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
ModelB.prototype.sort_array_by_object_key = function( array ) {
    return array.sort( function( a, b ) {
	var x, y;
	x = a[ POETA ];
	y = b[ POETA ];
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
		x = a[ STARTING_LINE_NUMBER_ORDINATE ];
		y = b[ STARTING_LINE_NUMBER_ORDINATE ];
		if( x < y ) {
		    return -1;
		} else if( x > y ) {
		    return 1;
		} else {
		    return 0;
		}
	    }
	}
    } );
}

ModelB.prototype.transmute = function() {
    var data, fpids, property, value, fpid, sup, sub, record;

    data = [];
    fpids = {};

    var allverse = d3.values(
        // allverse lets us expand beyond current filter to 
        // bring back all records matching current filtered FPIDs;
        // that way when one filters on character Sycophanta,
        // one can see that the verse group is shared with Charmides
        
        cf(origdata).dimension( 
            function( d ) { return d; } )
	        .groupAll()
	        .reduce( this.reduce_add, 
                     function(p, v){return p}, 
                     this.reduce_init )
	        .value());

    for( property in this.group ) {
	    value = this.group[ property ];
	    fpid = value[ FPID ];
	    if( !fpids[ fpid ] ) {
	        fpids[ fpid ] = []
	    }
//	    fpids[ fpid ].push( value );   // what we did before allverse
    }
    // now fpids is a list of keys with empty values; 
    // populate values from allverse
    for (fpid in fpids) {
        fpids[fpid] = allverse.filter(
                function(d){
                    return d['fpid'] === fpid;
                });
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
	sup[ METER ] = value[ 0 ][ METER ];
	sup[ METER_BEFORE ] = value[ 0 ][ METER_BEFORE ];
	sup[ METER_AFTER ] = value[ 0 ][ METER_AFTER ];
	sup[ 'sub1' ] = [];
	sup[ 'sub2' ] = [];
	sup[ FPID ] = value[ 0 ][ FPID ];
	sup[ STARTING_LINE_NUMBER_ORDINATE ]
	    = +value[ 0 ][ STARTING_LINE_NUMBER_ORDINATE ];
	
	var sub1hash = {};   // temporary object to keep unique by ID
	for( l = value.length, i = 0; i < l; ++i ) {
	    record = value[ i ];
	    sub1 = {};

	    sub1[ NOMEN ] = record[ NOMEN ];
	    sub1[ NOMEN_LINE_COUNT ] = +record[ NOMEN_LINE_COUNT ];
	    sub1[ GENERA ] = record[ GENERA ];
	    sub1[ 'id' ]
		= record[ NOMEN ]
		+ record[ NOMEN_LINE_COUNT ]
		+ record[ GENERA ]
		+ record[ FPID ];
	    sub1hash[sub1['id']] = sub1;
	}

	// sub1hash kept IDs unique; now make array
	for (k in sub1hash){
	    sup['sub1'].push(sub1hash[k]);
	}
	
	for ( l = value.length, i = 0; i < l; ++i ) {
	    record = value[ i ];
	    sub2 = sup[ 'sub2' ];
	    
	    sup[ 'sub2' ].push( record[ METER_TYPE ] );
	}
	
	// filter sup[ 'sub1' ] for unique value combinations
	// ??
	// filter sub[ 'sub2' ] for unique values
	sup[ 'sub2' ] = this.uniq( sup[ 'sub2' ] );
	
	data.push( sup );
    }

    this.data = this.sort_array_by_object_key( data );
}

ModelB.prototype.uniq = function( a ) {
    return a.reduce(function(p, c) {
	    if (p.indexOf(c) < 0) p.push(c);
	    return p;
	}, []);
}

/* ModelC carries character data for each verse group */


var ModelC = function( label ) {
    Model.call( this, label );
}
ModelC.prototype = Object.create( Model.prototype );
ModelC.prototype.constructor = ModelC;
ModelC.prototype.setup = function() {
    this.reference = population.presenters[ POETA ].model.reference;
    this.group = this.reference
	.groupAll()
	.reduce( this.reduce_add, this.reduce_remove, this.reduce_init )
	.value();
}
ModelC.prototype.transmute = function() {
    this.data = this.group;
}
ModelC.prototype.reduce_add = function( p, v ) {
    var unique_id;

    unique_id = v[ FPID ];

    p[ unique_id ] = {};
    p[ unique_id ][ CLOSURE ] = v[ CLOSURE ];
    p[ unique_id ][ COMMENTS_ON_LENGTH ] = v[ COMMENTS_ON_LENGTH ];
    p[ unique_id ][ COMMENTS_ON_OTHER ] = v[ COMMENTS_ON_OTHER ];

    return p;
}
ModelC.prototype.reduce_remove = function( p, v ) {
    var unique_id;

    unique_id = v[ FPID ];

    delete p[ unique_id ];

    return p;
}
ModelC.prototype.reduce_init = function() {
    return {};
}
