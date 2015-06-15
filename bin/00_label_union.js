/*
  Read in index.tsv
  Create array to hold all values from line_number_first_label
  Create array to hold all values from line_number_last_label
  Create array to hold the union of values from line_number_first_label and line_number_last_label
  Write JSON file to capture the contents of the "unioned" array.
*/

/*
d3.tsv("../tsv/index.tsv", function(data) {
    var line_number_first_label_values = [];
    var line_number_last_label_values = [];
    var values_union = [];

    line_number_first_label_values = data.map(
	function(object) {
	    line_number_first_label_values.push(
		object['line_number_first_label']
	    );
	}
    );

    console.log(line_number_first_label_values);

    var condensed = line_number_first_label_values.filter( onlyUnique );

    console.log(condensed);
    
});

d3.tsv("../tsv/index.tsv", function(data) {
    var line_number_first_label_values = [];
    var line_number_first_label_values_unique = [];
    var line_number_last_label_values = [];
    var line_number_last_label_values_unique = [];
    var line_number_union_label_values = [];
    var line_number_union_label_values_unique = [];

    data.map(
	function(o){
	    line_number_first_label_values.push(
		o['line_number_first_label']
	    );
	}
    );
    data.map(
	function(o){
	    line_number_last_label_values.push(
		o['line_number_last_label']
	    );
	}
    );

    console.log(line_number_first_label_values);
    console.log(line_number_last_label_values);

    line_number_first_label_values_unique =
	line_number_first_label_values.filter(onlyUnique);
    line_number_last_label_values_unique =
	line_number_last_label_values.filter(onlyUnique);

    console.log(line_number_first_label_values_unique);
    console.log(line_number_last_label_values_unique);

    line_number_union_label_values =
	line_number_first_label_values_unique.concat(
	    line_number_last_label_values_unique
	);

    console.log(line_number_union_label_values);

    line_number_union_label_values_unique =
	line_number_union_label_values.filter(onlyUnique);

    console.log(line_number_union_label_values_unique);

    line_number_union_label_values_unique.map(
	function(element) {
	    // stuff
	}
    );

});

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
	for(var j=i+1; j<a.length; ++j) {
	    if(a[i] === a[j])
		a.splice(j--, 1);
	}
    }

    return a;
};
*/
