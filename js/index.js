var COMPONENT_LABELS = ['poeta', 'fabulae', 'nomen', 'genera',
			'meter', 'meter_type', 'meter_before',
			'meter_after', 'raw', 'refined', 'popup']
var LINE_COUNT = 'numlines';
var CHARACTER_LINE_COUNT = 'char_numlines';
var FPID = 'fpid';

d3.tsv('tsv/index.tsv', function(data) {
    var Crossfilter = crossfilter(data);
    var reference_dimension = Crossfilter
	.dimension(function(f) { return f['meter_after']; });
    
    var Population = function(crossfilter) {
	this.components = {};
	this.populate();

	console.log(this.components);
    }
    Population.prototype.populate = function() {
	for(var l = COMPONENT_LABELS.length, i = 0; i < l; ++i) {
	    var label = COMPONENT_LABELS[i];
	    this.components[label] = new Component(label);
	}
    }
    
    
    var Component = function(label) {
	this.label = label;
	this.model = new Model(this.label);
	this.view = new View(this.label, this.model.data);
	// this.controller = new Controller(this.label);
    }
    
    
    // static class. never instantiated, no constructor.
    var Reduction = {
	add: function(p, v) {
	    if(p.fpids.includes(v[FPID])) {
		return p;
	    } else {
		p.fpids.push(v[FPID]);
		p.line_count += +v[LINE_COUNT];
		return p;
	    }
	},
	remove: function(p, v) {},
	init: function(p, v) {
	    return { fpids: [], line_count: 0 };
	}
    }


    // static class. never instantiated, no constructor.
    var Transmute = {
	// for non-nomen fpid flattened models performing LINE_COUNTs
	type_one: function(selection) {
	    var transmuted = [];
	    for(var l = selection.length, i = 0; i < l; ++i) {
		transmuted.push({ Name: selection[i].key, Lines: selection[i].value.line_count });
	    }
	    return transmuted;
	},
	// for 'nomen' non-flattened models performing CHARACTER_LINE_COUNTs
	type_two: function(selection) {
	    var transmuted = [];
	    for(var l = selection.length, i = 0; i < l; ++i) {
		transmuted.push({ Name: selection[i].key, Lines: selection[i].value });
	    }
	    return transmuted;
	},
	// for the 'raw' model
	type_three: function(selection) {
	    var transmuted = [];
	    for(var l = selection.length, i = 0; i < l; ++i) {
		transmuted.push({
		    Poeta: selection[i].poeta,
		    Fabulae: selection[i].fabulae,
		    Nomen: selection[i].nomen,
		    Genera: selection[i].genera,
		    Start: selection[i].line_number_first_label,
		    End: selection[i].line_number_last_label,
		    Lines: selection[i].numlines,
		    Meter: selection[i].meter,
		    Meter_Type: selection[i].meter_type,
		    Meter_Before: selection[i].meter_before,
		    Meter_After: selection[i].meter_after
		});
	    }
	    return transmuted;
	},
	// for the 'refined' model
	type_four: function(selection) {
	    var transmuted = [];
	    for(var l = selection.length, i = 0; i < l; ++i) {
		// to-do
	    }
	    return transmuted;
	},
	// for the 'popup' model
	type_five: function(selection) {
	    var transmuted = [];
	    for(var l = selection.length, i = 0; i < l; ++i) {
		// to-do
	    }
	    return transmuted;
	}
    }

    
    var Model = function(label) {
	this.label = label;
	this.dimension;
	this.selection;
	this.data;
	
	this.set_dimension(label /* d3 bug */);
	this.set_selection();
	this.set_data();
    }
    Model.prototype.set_dimension = function(label) {
	switch(this.label) {
	case "poeta":
	case 'fabulae':
	case 'nomen':
	case 'genera':
	case 'meter':
	case 'meter_type':
	case 'meter_before':
	    this.dimension = Crossfilter.dimension(function(f) { return f[label]; });
	    break;
	case 'meter_after':
	case 'raw':
	case 'refined':
	case 'popup':
	    this.dimension = reference_dimension;
	    break;
	}
    }
    Model.prototype.set_selection = function() {
	switch(this.label) {
	case 'poeta':
	case 'fabulae':
	case 'genera':
	case 'meter':
	case 'meter_type':
	case 'meter_before':
	case 'meter_after':
	    this.selection = this.dimension.group()
		.reduce(Reduction.add, Reduction.remove, Reduction.init)
		.all();
	    break;
	case 'nomen':
	    this.selection = this.dimension.group()
		.reduceSum(function(d) { return d[CHARACTER_LINE_COUNT]; })
		.all();
	    break;
	case 'raw':
	case 'refined':
	case 'popup':
	    this.selection = this.dimension.top(Infinity);
	    break;
	}
    }
    Model.prototype.set_data = function() {
	switch(this.label) {
	case 'poeta':
	case 'fabulae':
	case 'genera':
	case 'meter':
	case 'meter_type':
	case 'meter_before':
	case 'meter_after':
	    this.data = Transmute.type_one(this.selection);
	    break;
	case 'nomen':
	    this.data = Transmute.type_two(this.selection);
	    break;
	case 'raw':
	    this.data = Transmute.type_three(this.selection);
	    break;
	case 'refined':
	    this.data = Transmute.type_four(this.selection);
	    break;
	case 'popup':
	    this.data = Transmute.type_five(this.selection);
	    break;
	}
    }

    var View = function(label, data) {
	this.label = label;
	this.data = data;
	this.columns = data[0]; // ?
	this.status;
	this.location;
    }
    View.prototype.draw = function() {
	switch(this.label) {
	case 'poeta':
	case 'fabulae':
	case 'nomen':
	case 'genera':
	case 'meter':
	case 'meter_type':
	case 'meter_before':
	case 'meter_after':
	case 'raw':
	    this.structure_one();
	    break;
	case 'refined':
	    this.structure_two();
	    break;
	case 'popup':
	    this.structure_three();
	    break;
	}
    }
    View.prototype.structure_one = function() {
	var table = d3.select(this.name).append('table');
	var thead = table
	    .append('thead')
	    .append('tr')
	    .classed('label', true)
	    .selectAll('th')
	    .data(this.columns)
	    .enter()
	    .append('th')
	    .attr('class', function(d) { return d; })
	    .html(function(d) { return d; });
	var tbody = table
	    .append('tbody');
	var rows = tbody
	    .selectAll('tr')
	    .data(this.data)
	    .enter()
	    .append('tr')
	    .classed('facet', true);
	var cells = rows
	    .selectAll('td')
	    .data(function(row) {
		return this.columns.map(function(column) {
		    return {name: column, value: row[column]};
		});
	    })
	    .enter()
	    .append('td')
	    .attr('class', function(d) { return d.name; })
	    .html(function(d) { return d.value; });
    }
    View.prototype.structure_two = function() {}
    View.prototype.structure_three = function() {}
    
    
    var Controller = function(label) {
	this.label = label;
	this.filters = [];
    }
    Controller.prototype.add = function(filter) {}
    Controller.prototype.remove = function(filter) {}
    Controller.prototype.reset = function() {}

    
    var population = new Population();
    
});

