d3.tsv('tsv/index.tsv', function(data) {
    var facts = crossfilter(data);

    var DIMENSION_LABELS = ['poeta', 'fabulae',	'nomen', 'genera', 'meter',
			    'meter_type', 'meter_before', 'meter_after','fpid'];
    var LINE_COUNT = "numlines";
    var FPID = 'fpid';

    var Reduction = function() {}
    Reduction.prototype.add = function(p, v) {
	if(p.fpids.includes(v[FPID])) {
	    return p;
	} else {
	    p.fpids.push(v[FPID]);
	    p.line_count += +v[LINE_COUNT];
	    return p;
	}
    }
    Reduction.prototype.remove = function(p, v) {}
    Reduction.prototype.init = function(p, v) {
	return { fpids: [], line_count: 0 };
    }

    var Dimension = function(label) {
	this.name = "#" + label;
	this.dimension = facts.dimension(function(f) { return f[label]; });
	this.reduction = new Reduction();
	this.selection = this.dimension
	    .group()
	    .reduce(this.reduction.add,
		    this.reduction.remove,
		    this.reduction.init)
	    .all()
	this.facets = [];
	this.columns = [];
    }
    Dimension.prototype.populate = function() {
	var group = this.selection;

	for(var l = group.length, i = 0; i < l; ++i) {
	    var facet_name = group[i].key;
	    var facet_value = group[i].value.line_count;
	    this.facets.push({ Name: facet_name, Lines: facet_value });
	}
	
	this.columns = Object.keys(this.facets[0]);
    }
    Dimension.prototype.draw = function() {
    }
    
    var Reference = function(label) {
	Dimension.call(this, label);
	this.selection = this.dimension.top(Infinity);
    }
    Reference.prototype = Object.create(Dimension.prototype);
    Reference.prototype.constructor = Reference;
    Reference.prototype.populate = function() {
	var group = this.selection;

	for(var l = group.length, i = 0; i < l; ++i) {
	    this.facets.push({
		Poeta: group[i].poeta,
		Fabulae: group[i].fabulae,
		Nomen: group[i].nomen,
		Genera: group[i].genera,
		Start: group[i].line_number_first_label,
		End: group[i].line_number_last_label,
		Lines: group[i].numlines,
		Meter: group[i].meter,
		Meter_Type: group[i].meter_type,
		Meter_Before: group[i].meter_before,
		Meter_After: group[i].meter_after
	    });
	}

	this.columns = Object.keys(this.facets[0]);
    }

    var Population = function() {
	this.dimensions = {};

	this.populate();
	this.draw();
    }
    Population.prototype.populate = function() {
	for(var l = DIMENSION_LABELS.length, i = 0; i < l; ++i) {
	    var label = DIMENSION_LABELS[i];
	    if(label != 'fpid') {
		this.dimensions[label] = new Dimension(label);
	    } else {
		this.dimensions[label] = new Reference(label);
	    }
	}
    }
    Population.prototype.draw = function() {
	for(var property in this.dimensions) {
	    this.dimensions[property].populate();
	    this.dimensions[property].draw();
	}
    }
    
    var population = new Population();

});
