d3.tsv('tsv/index-updated.tsv', function(data) {
    var facts = crossfilter(data);

    var DIMENSIONS = ['poeta', 'fabulae', 'nomen', 'genera', 'meter',
		      'meter_type', 'meter_before', 'meter_after'];
    var LINE_COUNT = "numlines";

    var FPID = {
	// Faster to capture fpid values on route rather than assigning 'seen' attribute for each.
	// Uses [].includes() polyfill for ie8, etc.
	add: function(p, v) {
	    if(p.fpids.includes(v.fpid)) {
		return p;
	    } else {
		p.fpids.push(v.fpid)
		p.line_count += +v[LINE_COUNT];
		return p;
	    }
	},
	remove: function(p, v) {},
	init: function(p, v) { return { fpids: [], line_count: 0 } }
    }

    var Dimension = function(dimension) {
	this.name = "#" + dimension;
	this.dimension = facts.dimension(function(f) { return f[dimension]; });
	this.facets = [];
	
	this.populate();
	this.draw();
    }
    Dimension.prototype.populate = function() {
	// Simplifying to one ".reduce" for all dimensions not feasible due to nature of dataset.
	var group = this.dimension.group()
	    .reduce(FPID.add, FPID.remove, FPID.init).all();

	// Not using 'forEach' as 'super' is not supported and the solution is inelegant without it.
	for(var l = group.length, i = 0; i < l; ++i) {
	    var facet_name = group[i].key;
	    var facet_value = group[i].value.line_count;
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
		    return {name: column, value: row[column]};
		});
	    })
	    .enter()
	    .append("td")
	    .attr("class", function(d) { return d.name; })
	    .html(function(d) { return d.value; });

	return table;
    }

    var Population = function() {
	this.dimensions = {};
	this.populate();
    }
    Population.prototype.populate = function() {
	// Not using 'forEach' as 'super' is not supported and the solution is inelegant without it.
	for(var l = DIMENSIONS.length, i = 0; i < l; ++i) {
	    this.dimensions[DIMENSIONS[i]] = new Dimension(DIMENSIONS[i]);
	}
    }

    var current_verse_fragments = function() { return dimensions.poeta.dimension.top(Infinity); }

    var VIEWS = {
	raw: "",
	verse: "",
	detail: ""
    }

    var population = new Population();
    
});
