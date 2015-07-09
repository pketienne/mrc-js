var COMPONENT_LABELS = ['poeta', 'fabulae', 'nomen', 'genera',
			'meter', 'meter_type', 'meter_before',
			'meter_after', 'raw', 'refined', 'popup']
var LINE_COUNT = 'numlines';
var CHARACTER_LINE_COUNT = 'char_numlines';
var FPID = 'fpid';

d3.tsv('tsv/index.tsv', function(data) {
    var Crossfilter = crossfilter(data);

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
    
    
    // never instantiated, no constructor.
    /*
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
    */
    
    
    var Model = function(label) {
	this.label = label;
	this.dimension;
	this.selection;
	this.data;
	
	this.set_dimension(label);
	// this.set_selection();
	// this.set_data();
	
    }
    Model.prototype.set_dimension = function(label) {
	this.dimension = Crossfilter.dimension(function(f) { return f[label]; });
	/*
	switch(this.label) {
	case "poeta":
	case 'fabulae':
	case 'nomen':
	case 'genera':
	case 'meter':
	case 'meter_type':
	case 'meter_before':
	case 'meter_after':
	    this.dimension = Crossfilter.dimension(function(f) { return f[this.label]; });
	    break;
	case 'raw':
	case 'refined':
	case 'popup':
	    this.dimension = population.components['poeta'].model.dimension;
	    break;
	}
	*/
    }
    /*
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
		.reduceSum(CHARACTER_LINE_COUNT)
		.all();
	    break;
	}
    }
    Model.prototype.set_data = function() {
	console.log(this.label);
	console.log(this.dimension);
    }


    var View = function(label_p) {
	this.label = label_p;
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
    */
    
    var population = new Population();
    
});
    Model.prototype.set_dimension = function() {
	var label = this.label
	if(this.label == ('poeta' || 'fabulae' || 'nomen' || 'genera' || 'meter')) {
	    this.dimension = Crossfilter.dimension(function(f) { return f[label]; });
	} else if(this.label == ('raw' || 'refined' || 'popup')) {
	    // this.dimension = population.components['poeta'].model.dimension;
	}
	/*
	switch(this.label) {
	case "poeta":
	case 'fabulae':
	case 'nomen':
	case 'genera':
	case 'meter':
	case 'meter_type':
	case 'meter_before':
	case 'meter_after':
	    this.dimension = Crossfilter.dimension(function(f) { return f[this.label]; });
	    break;
	case 'raw':
	case 'refined':
	case 'popup':
	    this.dimension = population.components['poeta'].model.dimension;
	    break;
	}
	*/
    }
