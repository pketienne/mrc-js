d3.tsv('tsv/index-updated.tsv', function(data) {
    var transformations = crossfilter(data);

    var dimensions = {
	poeta: new Dimension("poeta"),
	fabula: new Dimension("fabulae"),
	nomen: new Dimension("nomen"),
	genus_personae: new Dimension("genera"),
	meter: new Dimension("meter"),
	metertype: new Dimension("meter_type"),
	meter_before: new Dimension("meter_before"),
	meter_after: new Dimension("meter_after")
    }

    var Dimension = function(dimension) {
	this.dimension = transformations.dimension(function(f) { return f[dimension]; });
    }

    








    var array = [];
    
    var blah = facts.dimension(function(f) { return "" + f.fpid; });

    var foo = blah.top(Infinity);

    /*
    for(var l = objects.length, i = 0; i < l; ++i) {
	array.push({fabulae: objects[i].fabulae,
		    nomen: objects[i].nomen,
		    genera: objects[i].genera,
		    start: objects[i].line_number_first_label,
		    end: objects[i].line_number_last_label,
		    lines: objects[i].numlines,
		    meter: objects[i].meter,
		    meter_type: objects[i].meter_type,
		    meter_before: objects[i].meter_before,
		    meter_after: objects[i].meter_after
		   });
    }
    */
    
    var groups = {};

    var fpid_group = blah.group().reduceCount().all();

    console.log(fpid_group);
    
    
});
