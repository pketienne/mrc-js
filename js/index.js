d3.tsv("tsv/index-updated.tsv", function(data) {
    var facts = crossfilter(data);

    /*
    var FPID = {
	add: function(p, v) {
	    if(v.fpid in p.fpids) {
		return p;
	    } else {
		p.fpids[v.fpid] = 1;
		p.lines_sum += +v.lines_sum;
		return p;
	    }
	},
	remove: function(p, v) {
	    p.fpids[v.fpid]--;
	    if(p.fpids[vfpid] === 0) {
		delete p.fpids[v.fpid];
	    }
	    return p;
	},
	init: function(p, v) {
	    return { fpids: {}, lines_sum: 0 }
	}
    }
    */

    var FPID = {
	add: function(p, v){
            if(v.fpid in p.fpids) {
		return p;
	    } else {
                p.fpids[v.fpid] = 1;
                p.numlines+= +v.numlines;
                return p;
            }
	},
        remove: function (p, v) {
            p.fpids[v.fpid]--;
            if(p.fpids[v.fpid] === 0) {
                delete p.fpids[v.fpid];
	    }
            return p;
        },
        init: function() {
	    return { fpids: {}, numlines: 0}
	}
    }

    var Dimension = function(dimension) {
	this.facets = {};
	
    }
    Dimension.prototype.draw = function() {
	// blatherskite;
    }

    var dimensions = {
	poeta: facts.dimension(function(f) { return f.poeta }),
	/*
	fabula: facts.dimension(function(f) { return f.fabula }),
	nomen: facts.dimension(function(f) { return f.nomen }),
	genus_personae: facts.dimension(function(f) { return f.genus_personae }),
	meter: facts.dimension(function(f) { return f.meter }),
	metertype: facts.dimension(function(f) { return f.metertype }),
	meter_before: facts.dimension(function(f) { return f.meter_before }),
	meter_after: facts.dimension(function(f) { return f.meter_after }),
	fpid: facts.dimension(function(f) { return f.fpid })
	*/
    }

    for(key in dimensions) {
	if (!dimensions.hasOwnProperty(key)) {
	    continue;
	}
	console.log(key + ":");
	console.log(dimensions[key]);
	console.log(key + ".groupAll():");
	console.log(dimensions[key].groupAll());
	console.log(key + ".groupAll().value():");
	console.log(dimensions[key].groupAll().value());
	console.log(key + ".group():");
	console.log(dimensions[key].group());
	console.log(key + ".group().all():");
	console.log(dimensions[key].group().all());
	console.log(key + ".group().size():");
	console.log(dimensions[key].group().size());
	console.log(key + ".group().reduceCount():");
	console.log(dimensions[key].group().reduceCount());
	console.log(key + ".group().reduceCount().all():");
	console.log(dimensions[key].group().reduceCount().all());
	console.log(key + ".group().reduceCount().size():");
	console.log(dimensions[key].group().reduceCount().size());
	console.log(key + ".group().reduceSum():");
	console.log(dimensions[key].group().reduceSum());
	// console.log(key + ".group().reduceSum().all():");
	// console.log(dimensions[key].group().reduceSum().all()); // FAILS
	console.log(key + ".group().reduceSum().size():");
	console.log(dimensions[key].group().reduceSum().size());
	console.log(key + ".group().reduce(FPID.add, FPID.remove, FPID.init):");
	console.log(dimensions[key].group().reduce(FPID.add, FPID.remove, FPID.init));
	console.log(key + ".group().reduce(FPID.add, FPID.remove, FPID.init).all():");
	console.log(dimensions[key].group().reduce(FPID.add, FPID.remove, FPID.init).all());
	console.log(key + ".group().reduce(FPID.add, FPID.remove, FPID.init).size():");
	console.log(dimensions[key].group().reduce(FPID.add, FPID.remove, FPID.init).size());
    }

});
