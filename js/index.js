d3.tsv("tsv/index-updated.tsv", function(data) {
    var facts = crossfilter(data);

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
    Dimension.prototype.tabulate = function(data, columns) {
	var table = d3.select(this.name);
	var rows = table.selectAll("tr")
	    .data(data)
	    .enter()
	    .append("tr");
	var cells = rows.selectAll("td")
	    .data(function(row) {
		return columns.map(function(column) {
		    return {column: column, value: row[column]};
		});
	    })
	    .enter()
	    .append("td")
	    .html(function(d) { return d.value; });
	return table;
    }
    Dimension.prototype.draw = function() {
	var facets = this.facets;
	var property_names = Object.keys(facets[0]);
	this.tabulate(this.facets, property_names);
    }

    var dimensions = {
	poeta: new Dimension("poeta"),
	fabula: new Dimension("fabula"),
	nomen: new Dimension("nomen"),
	genus_personae: new Dimension("genus_personae"),
	meter: new Dimension("meter"),
	metertype: new Dimension("metertype"),
	meter_before: new Dimension("meter_before"),
	meter_after: new Dimension("meter_after"),
	fpid: new Dimension("fpid")
    }

});
