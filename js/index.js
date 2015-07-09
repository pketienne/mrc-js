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
	// this.view = new View(this.label);
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
	case 'nomen':
	case 'genera':
	case 'meter':
	case 'meter_type':
	case 'meter_before':
	case 'meter_after':
	case 'raw':
	case 'refined':
	case 'popup':
	}
    }

    var View = function(label) {
	this.label = label;
	this.status;
	this.location;
    }
    View.prototype.draw = function() {}
    View.prototype.structure_one = function() {}
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

