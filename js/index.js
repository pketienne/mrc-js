d3.tsv('tsv/index-updated.tsv', function(data) {
    var facts = crossfilter(data);

    var DIMENSION_LABELS = ['poeta', 'fabulae', 'nomen', 'genera', 'meter',
			    'meter_type', 'meter_before', 'meter_after', 'fpid'];
    var LINE_COUNT = "numlines";

    var Reduction = function(/* args ?column? */) {}
    Reduction.prototype.add(p, v) {
	if(p.columns.includes(v.column)) {
	    return p;
	} else {
	    p.columns.push(v.column)
	    p.line_count += +v[LINE_COUNT];
	    return p;
	}
    }
    Reduction.prototype.remove(p, v) {}
    Reduction.prototype.init(p, v) { return { columns: [], line_count: 0; } }
    
    var Dimension = function(label) {
	this.name = "#" + label;
	this.dimension = facts.dimension(function(f) { return f[label]; });
	this.reduction = new Reduction(/* args */);
	this.selection = this.dimension.group()
	    .reduce(fpid.add, fpid.remove, fpid.init).all()
	this.facets = [];
	this.columns = [];
    }
    Dimension.prototype.populate = function() {
	var group = this.selection

	for(var l = group.length, i = 0; i < l; ++i) {
	    var facet_name = group[i].key;
	    var facet_value = group[i].value.line_count;
	    this.facets.push({ name: facet_name, value: facet_value });
	}
	
	this.columns = Object.keys(this.facets[0]);
    }
    Dimension.prototype.reset = function() {
	this.facets = [];
	this.columns = [];
	// d3.js prune table from DOM
    }
    Dimension.prototype.draw = function() {
	var data = this.facets
	var columns = this.columns
	
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

    var Reference = function() {
	this.selection = this.dimension.top(Infinity);
    }
    Reference.prototype = Object.create(Dimension.prototype);
    Reference.prototype.constructor = Reference;
    
    var Population = function() {
	this.dimensions = [];
	this.populate();
    }
    Population.prototype.populate = function() {
	for(var l = DIMENSION_LABELS.length, i = 0; i < l; ++i) {
	    var label = DIMENSION_LABELS[i];

	    if label != 'fpid' {
		this.dimensions.push({ label: new Dimension(label) });
	    } else {
		this.dimensions.push({ label: new Reference(label) });
	    }
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
