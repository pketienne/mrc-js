var COMPONENT_LABELS = ['poeta', 'fabulae', 'nomen', 'genera', 'meter',
			'meter_type', 'meter_before', 'meter_after', 'raw',
			'refined', 'popup']
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
	this.draw();
    }
    Population.prototype.populate = function() {
	for(var l = COMPONENT_LABELS.length, i = 0; i < l; ++i) {
	    var label = COMPONENT_LABELS[i];
	    this.components[label] = new Component(label);
	}
    }
    Population.prototype.draw = function() {
	for(var property in this.components) {
	    this.components[property].view.draw();
	}
    }

    var Component = function(label) {
	this.label = label;
	this.model = new Model(this.label);
	this.view = new View(this.label, this.model.data, this.model.columns);
	this.controller = new Controller(this.label, this.model, this.view);
    }

    var Model = function(label) {
	this.label = label;
	this.dimension;
	this.selection;
	this.transmutation;
	this.data;
	this.columns;

	this.set_dimension(label);
	this.set_selection();
	this.transmutation = new Transmutation(this.selection);
	this.set_transmutation();
	this.data = this.transmutation.data;
	this.columns = this.transmutation.columns;

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
	    this.dimension = Crossfilter
		.dimension(function(f) { return f[label]; });
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
    Model.prototype.set_transmutation = function() {
	switch(this.label) {
	case 'poeta':
	case 'fabulae':
	case 'genera':
	case 'meter':
	case 'meter_type':
	case 'meter_before':
	case 'meter_after':
	    this.transmutation.type_one();
	    break;
	case 'nomen':
	    this.transmutation.type_two();
	    break;
	case 'raw':
	    this.transmutation.type_three();
	    break;
	case 'refined':
	    this.transmutation.type_four();
	    break;
	case 'popup':
	    this.transmutation.type_five();
	    break;
	}
    }

    var Transmutation = function(selection) {
	this.selection = selection;
	this.data = [];
	this.columns = [];
    }
    Transmutation.prototype.type_one = function() {
	var selection = this.selection;
	
	for(var l = selection.length, i = 0; i < l; ++i) {
	    this.data.push({
		Name: selection[i].key, Lines: selection[i].value.line_count
	    });
	}
	this.columns.push('Name', 'Lines');
    }
    Transmutation.prototype.type_two = function() {
	var selection = this.selection;
	
	for(var l = selection.length, i = 0; i < l; ++i) {
	    this.data.push({
		Name: selection[i].key, Lines: selection[i].value
	    });
	}
	this.columns.push('Name', 'Lines');
    }
    Transmutation.prototype.type_three = function() {
	var selection = this.selection;
	
	for(var l = selection.length, i = 0; i < l; ++i) {
	    this.data.push({
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
	this.columns.push('Poeta', 'Fabulae', 'Nomen', 'Genera', 'Start', 'End',
			  'Lines', 'Meter', 'Meter_Type', 'Meter_Before',
			  'Meter_After');
    }
    Transmutation.prototype.type_four = function() {
	var selection = this.selection;
	
	for(var l = selection.length, i = 0; i < l; ++i) {
	    this.data.push({
		// TODO
	    });
	}
	this.columns.push('');
    }
    Transmutation.prototype.type_five = function() {
	var selection = this.selection;
	
	for(var l = selection.length, i = 0; i < l; ++i) {
	    this.data.push({
		// TODO
	    });
	}
	this.columns.push('');
    }

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

    var View = function(label, data, columns) {
	this.label = label;
	this.data = data;
	this.columns = columns;
	this.status = 'on';
	this.location = "#" + this.label;
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
	var data = this.data;
	var columns = this.columns;
	var location = this.location;

	var table = d3.select(location).append('table');
	var thead = table
	    .append('thead')
	    .append('tr')
	    .classed('label', true)
	    .selectAll('th')
	    .data(columns)
	    .enter()
	    .append('th')
	    .attr('class', function(d) { return d; })
	    .html(function(d) { return d; });
	var tbody = table
	    .append('tbody');
	var rows = tbody
	    .selectAll('tr')
	    .data(data)
	    .enter()
	    .append('tr')
	    .classed('facet', true)
	    .on("click", function(d, i) {
		console.log(d);
		console.log(i);
	    });
	var cells = rows
	    .selectAll('td')
	    .data(function(row) {
		return columns.map(function(column) {
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
    Controller.prototype.toggle = function() {}
    Controller.prototype.add = function(filter) {}
    Controller.prototype.remove = function(filter) {}
    Controller.prototype.reset = function() {}

    var population = new Population();

});
