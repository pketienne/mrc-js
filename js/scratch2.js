d3.tsv('tsv/index.tsv', function(data) {
    var data = crossfilter(data);

    var DIMENSION_LABELS = ['poeta', 'fabulae',	'nomen', 'genera', 'meter',
			    'meter_type', 'meter_before', 'meter_after','fpid'];

    // Logic for combining a model with a view
    var Controller = function() {
	this.name;
    }
    
    // Model for tabular data
    var Model = function() {
	this.dimension;
    }

    // Model type one = all facets except nomen
    var One = function() {
	Model.call(this);
    }
    One.prototype = Object.create(Model.prototype);
    One.prototype.constructor = One;
    One.prototype.populate = function() {}

    // Model type two = nomen facet only
    var Two = function() {
	Model.call(this);
    }
    Two.prototype = Object.create(Model.prototype);
    Two.prototype.constructor = Two;
    Two.prototype.populate = function() {}

    // Model type three = raw verse section data
    var Three = function() {
	Model.call(this);
    }
    Three.prototype = Object.create(Model.prototype);
    Three.prototype.constructor = Three;
    Three.prototype.populate = function() {}

    // Model type three = presentation verse section data
    var Four = function() {
	Model.call(this);
    }
    Four.prototype = Object.create(Model.prototype);
    Four.prototype.constructor = Four;
    Four.prototype.populate = function() {}

    // Model type three = pop-up/detail verse section data
    var Five = function() {
	Model.call(this);
    }
    Five.prototype = Object.create(Model.prototype);
    Five.prototype.constructor = Five;
    Five.prototype.populate = function() {}

    
    // View port for tabular html data
    var View = function() {
	this.name = '';
	this.data = '';
	this.columns = '';
	this.location = ''; // roll this into 'this.name'?
    }

    // View type one = all facets + raw verse section
    var One = function() {
	View.call(this);
    }
    One.prototype = Object.create(View.prototype);
    One.prototype.constructor = One;
    One.prototype.draw = function() {
	var data = this.facets;
	var columns = this.columns;

	var table = d3.select(this.name).append('table');
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
	    .classed('facet', true);
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
    
    // View type two = presentable verse section
    var Two = function() {
	View.call(this);
    }
    Two.prototype = Object.create(View.prototype);
    Two.prototype.constructor = Two;
    Two.prototype.draw = function() {}
    // View type three = verse section pop-up/detail
    var Three = function() {
	View.call(this);
    }
    Three.prototype = Object.create(View.prototype);
    Three.prototype.constructor = Three;
    Three.prototype.draw = function() {}

});
