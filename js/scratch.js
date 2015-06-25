    var n = cf_data.groupAll().reduceCount().value();
    console.log("There are " + n + " records in the data set.");

    var m = cf_data.groupAll().reduceSum(function(fact) { return fact.numlines; }).value();
    console.log("There are " + m + " total lines in the data set.");

    var poetaDimension = cf_data.dimension(function(d) { return d.poeta; });
    poetaDimension.filter("Plautus");

    var o = cf_data.groupAll().reduceCount().value();
    console.log("There are " + o + " Plautus records in the data set.");

    var p = cf_data.groupAll().reduceSum(function(fact) { return fact.numlines; }).value();
    console.log("There are " + p + " Plautus lines in the data set.");



    var helperFunctions = reduceHelper(function(d) { return d.poeta; });
    var dim = cf_data.dimension(function(d) { return d.fpid; });
    var group = dim.group().reduce(helperFunctions.add, helperFunctions.remove, helperFunctions.init);


    var blah = cf_data.
	dimension(function(d) { return d.poeta; }).
	group().
	reduce(reduceHelper(function(d) { return d.fpid; }).add,
	       reduceHelper(function(d) { return d.fpid; }).remove,
	       reduceHelper(function(d) { return d.fpid; }).init
	      ).size();
    
    console.log("");

var verse_references_total = facts.groupAll().reduceSum(function(fact) { return fact.numlines; }).value()
    console.log(verse_references_total);

    var facts_total = facts.groupAll().reduceCount().value();
    console.log(facts_total);



    var verse_references_total = facts.groupAll().value();
    console.log(verse_references_total);

    var verses_total = facts.groupAll().reduce(reduceHelper(function(fact) { return fact.fpid; }).add,
					       reduceHelper(function(fact) { return fact.fpid; }).remove,
					       reduceHelper(function(fact) { return fact.fpid; }).init
					      ).value()
    console.log(verses_total);

    var line_references_total = facts.groupAll().reduceSum(function(fact) { return fact.numlines; }).value();
    console.log(line_references_total);

    var lines_total = facts.groupAll().
	reduce(reduceHelper(function(fact) { return fact.fpid; }).add,
	       reduceHelper(function(fact) { return fact.fpid; }).remove,
	       reduceHelper(function(fact) { return fact.fpid; }).init
	      ).reduceSum(function(fact) { return fact.numlines; });
    console.log(lines_total);


    var poeta = facts.dimension(function(d) { return d.poeta; });
    var poeta_reduce = poeta.groupAll().reduce(reduceHelper(function(fact) { return fact.fpid; }).add,
				    reduceHelper(function(fact) { return fact.fpid; }).remove,
				    reduceHelper(function(fact) { return fact.fpid; }).init
					      ).reduceSum(function(fact) { return fact.numlines; }).value();
    console.log(poeta_reduce);


d3.tsv("tsv/index-updated.tsv", function(data) {
    var facts = crossfilter(data);

    var blah = facts.groupAll();
    console.log("wtf");

    var dim = facts.dimension(function(d) { return d.poeta; });

    var number_of_lines = dim.group().reduce(
	function(a, d){
	    if (d.fpid in a.fpids) {return a; }
	    else {
		a.fpids[d.fpid] = 1;
		a.numlines += +d.numlines;
		return a; 
	    }},
	
	function(a, d) {
	    a.fpids[d.fpid]--;
	    if(a.fpids[d.fpid] === 0)
		delete a.fpids[d.fpid];
	    return a;
	},
	function(){return {'fpids':{}, 'numlines': 0}}
    ).all()
    console.log(number_of_lines);
});


d3.tsv("tsv/index-updated.tsv", function(data) {
    var facts = crossfilter(data);

    var cf_groupAll = facts.groupAll().reduce(
	function(a,d) {
	    if(d.fpid in a.fpids) { return a; }
	    else {a.fpids[d.fpid] = 1; a.numlines += +d.numlines; return a; }
	},
	function(a,d) {
	    a.fpids[d.fpid]--; if(a.fpids[d.fpid] === 0) delete a.fpids[d.fpid]; return a; },
	function(a,d) { return {'fpids':{}, 'numlines':0} }
    )
	console.log(cf_groupAll)
    var cf_groupAll = facts.groupAll().reduce(
	function(a,d) {
	    if(d.fpid in a.fpids) { return a; }
	    else {a.fpids[d.fpid] = 1; a.numlines += +d.numlines; return a; }
	},
	function(a,d) {
	    a.fpids[d.fpid]--; if(a.fpids[d.fpid] === 0) delete a.fpids[d.fpid]; return a; },
	function(a,d) { return {'fpids':{}, 'numlines':0} }
    ).value()
	console.log(cf_groupAll)
    var cf_groupAll = facts.groupAll().reduce(
	function(a,d) {
	    if(d.fpid in a.fpids) { return a; }
	    else {a.fpids[d.fpid] = 1; a.numlines += +d.numlines; return a; }
	},
	function(a,d) {
	    a.fpids[d.fpid]--; if(a.fpids[d.fpid] === 0) delete a.fpids[d.fpid]; return a; },
	function(a,d) { return {'fpids':{}, 'numlines':0} }
    ).value().numlines;
	console.log(cf_groupAll)

    var cf_dimension_group = facts.dimension(function(d) { return d.poeta; }).group().
    console.log(cf_dimension_group)
    var cf_dimension_group = facts.dimension(function(d) { return d.poeta; }).group().all()
    console.log(cf_dimension_group)

    var cf_dimension_groupAll = facts.dimension(function(d) { return d.poeta; }).groupAll()
    console.log(cf_dimension_groupAll)
    var cf_dimension_groupAll = facts.dimension(function(d) { return d.poeta; }).groupAll().value()
    console.log(cf_dimension_groupAll)

});



    
    var FPID = {
	add: function(p, v) {
	    if(v.fpid in p.fpids) {
		return p;
	    } else {
		p.fpids[v.fpid] = 1;
		p.numlines += +v.numlines;
		return p;
	    }
	},
	remove: function(p, v) {
	    p.fpids[v.fpid]--;
	    if(p.fpids[v.fpid] === 0) {
		delete p.fpids[v.fpid];
	    }
	    return p;
	},
	init: function(p, v) {
	    return { "fpids": {}, "numlines": 0 };
	};
    };
    

    /*
    var dimensions = {};
    dimensions["poeta"] = facts.dimension(function(f) { return f.poeta });
    dimensions["fabula"] = facts.dimension(function(f) { return f.fabula });
    dimensions["nomen"] = facts.dimension(function(f) { return f.nomen });
    dimensions["genus_personae"] = facts.dimension(function(f) { return f.genus_personae });
    dimensions["meter"] = facts.dimension(function(f) { return f.meter });
    dimensions["metertype"] = facts.dimension(function(f) { return f.metertype });
    dimensions["meter_before"] = facts.dimension(function(f) { return f.meter_before });
    dimensions["meter_after"] = facts.dimension(function(f) { return f.meter_after });
    dimensions["fpid"] = facts.dimension(function(f) { return f.fpid });

    function blah(dimension) {
	console.log(dimension);
	console.log(dimension.group());
	console.log(dimension.group().size());
    }

    blah(dimensions.poeta);
    blah(dimensions.fabula);
    blah(dimensions.nomen);
    blah(dimensions.genus_personae);
    blah(dimensions.meter);
    blah(dimensions.metertype);
    blah(dimensions.meter_before);
    blah(dimensions.meter_after);
    blah(dimensions.fpid);
    */
    
