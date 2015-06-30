d3.tsv("tsv/index-updated.tsv", function(data) {
    var facts = crossfilter(data);

    console.log(d3.nest().key(function(d) { d.fpid; }).entries(data));
    
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
	this.name = "#" + dimension;
	this.dimension = facts.dimension(function(f) { return f[dimension]; });
	this.facets = [];

	this.populate_facets();
	this.draw();
    }
    Dimension.prototype.populate_facets = function() {
	var objects = this.dimension.group().reduce(FPID.add, FPID.remove, FPID.init).all();
	for(var l = objects.length, i = 0; i < l; ++i) {
	    var facet_name = objects[i].key;
	    var facet_value = objects[i].value.numlines;
	    this.facets.push({ name: facet_name, value: facet_value });
	}
    }
    Dimension.prototype.draw = function() {
	var data = this.facets;
	var columns = Object.keys(data[0]);
	
	var table = d3.select(this.name).select("table.facets");
	var rows = table
	    .selectAll("tr")
	    .data(data)
	    .enter()
	    .append("tr")
	    .classed("facet", true);
	var cells = rows
	    .selectAll("td")
	    .data(function(row) {
		return columns.map(function(column) {
		    var name = (column == "") ? "0" : column;
		    var value = (row[column] == "") ? "[blank]" : row[column];
		    return {name: name, value: value};
		});
	    })
	    .enter()
	    .append("td")
	    .attr("class", function(d) { return d.name; })
	    .html(function(d) { return d.value; });

	return table;
    }

    var FPID2 = {
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

    var Dimension2 = function(dimension) {
	this.name = "#" + dimension;
	this.dimension = facts.dimension(function(f) { return f[dimension]; });
	this.facets = [];

	this.populate_facet2();
	this.draw2();
    }
    Dimension2.prototype.populate_facet2 = function() {
	var objects = this.dimension.top(Infinity);

	objects.sort(function(a, b) {
	    return a.nomen > b.nomen;
	});
	objects.sort(function(a, b) {
	    return a.line_number_first_ordinate - b.line_number_first_ordinate;
	});
	objects.sort(function(a, b) {
	    return a.fabulae > b.fabulae;
	});
	for(var l = objects.length, i = 0; i < l; ++i) {
	    this.facets.push({ fabulae: objects[i].fabulae,
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
    }
    Dimension2.prototype.sort = function(property) {
	var sample = this.facets[property];

    }
    Dimension2.prototype.draw2 = function() {
	var data = this.facets;
	var columns = Object.keys(data[0]);
	
	var table = d3.select(this.name).select("table.facets");
	var rows = table
	    .selectAll("tr")
	    .data(data)
	    .enter()
	    .append("tr")
	    .classed("facet", true);
	var cells = rows
	    .selectAll("td")
	    .data(function(row) {
		return columns.map(function(column) {
		    var name = (column == "") ? "0" : column;
		    var value = (row[column] == "") ? "[blank]" : row[column];
		    return {name: name, value: value};
		});
	    })
	    .enter()
	    .append("td")
	    .attr("class", function(d) { return d.name; })
	    .html(function(d) { return d.value; });

	return table;
    }

    var dimensions = {
	poeta: new Dimension("poeta"),
	fabula: new Dimension("fabulae"),
	nomen: new Dimension("nomen"),
	genus_personae: new Dimension("genera"),
	meter: new Dimension("meter"),
	metertype: new Dimension("meter_type"),
	meter_before: new Dimension("meter_before"),
	meter_after: new Dimension("meter_after"),
	fpid: new Dimension2("fpid")
    }

});
