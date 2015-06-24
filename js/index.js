d3.tsv("tsv/index-updated.tsv", function(data) {
    var facts = crossfilter(data);

    var blah = facts.groupAll();
    console.log("wtf");

    var dim = facts.dimension(function(d) { return d.poeta; });

    var number_of_lines = dim.group().reduce(
	function(a, d){
	    if (d.fpid in a.fpids) {return a; }
	    else {
		a.fpids[d.fpid] = 1;
		a.numlines += +d.numlines;
		return a; 
	    }},
	
	function(a, d) {
	    a.fpids[d.fpid]--;
	    if(a.fpids[d.fpid] === 0)
		delete a.fpids[d.fpid];
	    return a;
	},
	function(){return {'fpids':{}, 'numlines': 0}}
    ).all()
    console.log(number_of_lines);
});


