d3.tsv('tsv/index.tsv', function(data) {
    var data = crossfilter(data);

    var COMPONENT_LABELS = ['poeta', 'fabulae', 'nomen', 'genera', 'meter', 'meter_type',
			    'meter_before', 'meter_after', {'raw', 'presentation', 'popup'}];

    var Dimension = function() {}
    
    var Component = function() {
	this.name = '';
	this.model = '';
	this.view = '';
    }

    var Model = function () {
	this.name = '';
	this.data = '';
	this.dimension = '';
	this.selection = '';
    }
    Model.prototype.populate = function() {
	switch(name) {
	case 'component':
	    this.path_one();
	    break;
	case 'component':
	    this.path_two();
	    break;
	case 'component':
	    this.path_three();
	    break;
	case 'component':
	    this.path_four();
	    break;
	case 'component':
	    this.path_five();
	    break;
	}	    
    }
    Model.prototype.path_one = function() {
    }
    Model.prototype.path_two = function() {
    }
    Model.prototype.path_three = function() {
    }
    Model.prototype.path_four = function() {
    }
    Model.prototype.path_five = function() {
    }

    var View = function() {
	this.name = '';
	this.data = '';
	this.columns = '';
	this.location = '';
    }
    View.prototype.draw = function() {
	switch(name) {
	case 'component':
	    this.type_one();
	    break;
	case 'component':
	    this.type_two();
	    break;
	case 'component':
	    this.type_three();
	    break;
	}	    
    }
    View.prototype.type_one = function() {
    }
    View.prototype.type_two = function() {
    }
    View.prototype.type_three = function() {
    }

});
