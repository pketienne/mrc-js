var versusdata;
var cf;
var dims = {};
var filterdims = {};
var filters = {};

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n :
    new Array(width - n.length + 1).join(z) + n;
}

function keysort(a, b) {
    if (a.key > b.key) { return 1 };
    if (a.key < b.key) { return -1};
    return 0;};

function nonzerokeysort(a, b) {
    if (a.value === 0 && b.value !== 0) {return 1 };
    if (b.value === 0 && a.value !== 0) {return -1};
    if ((a.key > b.key)) { return 1 };
    if (a.key < b.key  ) { return -1};
    return 0;
};

d3.tsv("tsv/index-updated.tsv", function(d) {
    start(d);
});

function listupdate(listid, dim) {
    
    var sorteddata = dim.group()
    .reduce(
        function(a, d){
            /* we need to keep track of which FPIDs (verse IDs)
           we have seen in order not to count 
           the same verse twice */
            if (d.fpid in a.fpids) {return a; }
            else {
                a.fpids[d.fpid] = 1;
                a.numlines += +d.numlines;
                return a; 
            }},
        function (a, d) {
            a.fpids[d.fpid]--;
            if(a.fpids[d.fpid] === 0)
                delete a.fpids[d.fpid];
            return a;
        },
        function(){return {'fpids':{}, 'numlines': 0}})
        .all().sort(keysort);
    
    // show only nonzero elements of lists
    sorteddata = sorteddata.filter(function(d){
        return d.value.numlines > 0;
    });
    var list = d3.select("#" + listid + " ul")
        .selectAll("li")
        .data(sorteddata);
    list.classed("filter", function(d) {
        if (filters.hasOwnProperty(listid)) {
            return filters[listid].indexOf(d.key) > -1;
        };
        return false;
    });
    list.select("span.key")
        .text(function(d){return d.key==="" ? "[blank]" : d.key;});
    list.select("span.value")
        .text(function(d){return d.value.numlines;});
    var enterlist = list.enter().append("li");
    enterlist.classed("filter", function(d) {
        if (filters.hasOwnProperty(listid)) {
            return filters[listid].indexOf(d.key) > -1;
        };
        return false;
    });
    enterlist
        .append("span")
        .classed("key", true)
        .text(function(d){return d.key==="" ? "[blank]" : d.key;});
    enterlist
        .append("span")
        .classed("value", true)
        .text(function(d){return d.value.numlines;});
    list.exit().remove();
}

function updateversus(){
    versusdata = dims.versus.group().reduce(
        function(a, d){return {
            "fabula": d.fabula, 
            "line_number_first_label": d.line_number_first_label,
            "line_number_last_label": d.line_number_last_label,
            "numlines": d.numlines,
            "meter": d.meter,
            "meter_before": d.meter_before,
            "meter_after": d.meter_after,
            "l_first": d.line_first.replace(/(\\n)+/g, "\\n"),
            "l_last": d.line_last.replace(/(\\n)+/g, "\\n")//,
        };}, 
        function(a, d){return {
            "fabula": d.fabula,
            "line_number_first_label": d.line_number_first_label,
            "line_number_last_label": d.line_number_last_label,
            "numlines": d.numlines,
            "meter": d.meter,
            "meter_before": d.meter_before,
            "meter_after": d.meter_after,
            "l_first": d.line_first,
            "l_last": d.line_last//,
        };}, 
        function(){return {}}
    )
        .all()
        .sort(
            function (a, b) {
                var asortkey = a.value.fabula + 
                    pad(a.value['line_number_first_label'], 4);
                var bsortkey = b.value.fabula + 
                    pad(b.value['line_number_first_label'], 4);
                if ((asortkey > bsortkey)) {return 1};
                if ((asortkey < bsortkey)) {return -1};
                return 0;
            });
    
    // show only nonzero elements of lists
    versusdata = versusdata.filter(function(d){
        return d.value.hasOwnProperty("fabula");
    });
    d3.select("#versus .rowcount").text(versusdata.length + 
                                        " instances");
    var linecount = dims.versus.group()
        .reduce(function(a, d){return +d.numlines;}, 
                function(a, d){return +d.numlines;}, 
                function(){return 0})
        .all()
        .reduce(  /* this is array.reduce rather than crossfilter reduce */
            function(a, d){return a + d.value}, 0);
    d3.select("#versus .linecount").text(linecount + " lines");
    showversuspage(0);
};

function showversuspage(page) {
    var perpage = 100;
    var pagecount = parseInt(versusdata.length/perpage);
    var pagedata = versusdata.slice(perpage*page, perpage *(page+1));
    var list = d3.select("#versus ul")
        .selectAll("li")
        .data(pagedata);
    list.select("span.fabula")
        .text(function(d){return d.value.fabula;});
    list.select("span.line_number_first_label")
        .text(function(d){return d.value.line_number_first_label;});
    list.select("span.line_number_last_label")
        .text(function(d){return d.value.line_number_last_label;});
    list.select("span.numlines")
        .text(function(d){return d.value.numlines;});
    list.select("span.meter")
        .text(function(d){return d.value.meter;});
    list.select("span.meter_before")
        .text(function(d){return d.value.meter_before;});
    list.select("span.meter_after")
        .text(function(d){return d.value.meter_after;});
    list.select("span.personae")
        .html(function(d){ 
            var ptmp = filterdims.versus_per_personam.group().reduce(
                function(a, dd){
                    return {
                        'nomen':dd.nomen,
                        'genus_personae':dd.genus_personae,
                        'fabula':dd.fabula,
                        'line_number_first_label':dd.line_number_first_label}
                },
                function(a, dd){
                    return {
                        'nomen':dd.nomen,
                        'genus_personae':dd.genus_personae,
                        'fabula':dd.fabula,
                        'line_number_first_label':dd.line_number_first_label}
                },
                function(){}
            )
                .all().filter(function(dd){
                    return dd.value && 
                        (dd.value.line_number_first_label === 
                         d.value.line_number_first_label) &&
                        (dd.value.fabula === d.value.fabula);});
            return ptmp.map(function(p){
                return p.value.nomen + ": " + p.value.genus_personae;
            }).join("<br/>");
        });
    list.select("span.l_first")
        .html(function(d){
            return d.value.l_first.replace(/\\n/g, "<br />");});
    list.select("span.l_last")
        .html(function(d){
            return d.value.l_last.replace(/\\n/g, "<br />");});
    var enterlist = 
        list
        .enter()
        .append("li");
    enterlist
        .append("span")
        .classed("fabula", true)
        .text(function(d){return d.value.fabula;});
    enterlist
        .append("span")
        .classed("line_number_first_label", true)
        .text(function(d){return d.value.line_number_first_label;});
    enterlist
        .append("span")
        .classed("line_number_last_label", true)
        .text(function(d){ 
            return d.value.line_number_last_label;
        });
    enterlist
        .append("span")
        .classed("numlines", true)
        .text(function(d){return d.value.numlines;});
    enterlist
        .append("span")
        .classed("meter", true)
        .text(function(d){return d.value.meter;});
    enterlist
        .append("span")
        .classed("meter_before", true)
        .text(function(d){return d.value.meter_before;});
    enterlist
        .append("span")
        .classed("meter_after", true)
        .text(function(d){
            return d.value.meter_after;});
    enterlist
        .append("span")
        .classed("personae", true)
        .html(function(d){
            var ptmp = filterdims.versus_per_personam.group().reduce(
                function(a, dd){
                    return {
                        'genus_personae':dd.genus_personae,
                        'nomen':dd.nomen,
                        'fabula':dd.fabula,
                        'line_number_first_label':dd.line_number_first_label}
                },
                function(a, dd){
                    return {
                        'nomen':dd.nomen,
                        'genus_personae':dd.genus_personae,
                        'fabula':dd.fabula,
                        'line_number_first_label':dd.line_number_first_label}
                },
                function(){}
            )
                .all().filter(function(dd){
                    return dd.value && 
                        (dd.value.line_number_first_label === 
                         d.value.line_number_first_label) && 
                        (dd.value.fabula === d.value.fabula);});
            return ptmp.map(function(p){
                return p.value.nomen + ": " + p.value.genus_personae;
            }).join("<br/>");
            
        }
             );
    
    enterlist
        .append("span")
        .classed("l_first", true)
        .html(function(d){
            return d.value.l_first.replace(/\\n/g, "<br />");});
    enterlist
        .append("span")
        .classed("l_last", true)
        .html(function(d){
            if((+d.value.numlines) > 1) {
                return d.value.l_last.replace(/\\n/g, "<br />");
            } else {
                return "";
            };
        });
    list.exit().remove();
    
    d3.select(".pagin")
        .style("visibility",  pagecount > 0 ? "visible" : "hidden");
    
    d3.select(".pagin .prev")
        .style("visibility",  page > 0 ? "visible" : "hidden")
        .on("click", function(d){showversuspage(page-1)});
    
    d3.select(".pagin .pagecounter")
        .style("visibility",  pagecount > 0 ? "visible" : "hidden")
        .text("page " + (+page+1) + " of " + (+pagecount+1));
    
    d3.select(".pagin .next")
        .style("visibility",  page < pagecount ? "visible" : "hidden")
        .on("click", function(d){showversuspage(page+1)});
};


function update(){
    listupdate("poeta", dims.poeta);
    listupdate("fabulae", dims.fabulae);
    listupdate("personae", dims.personae);
    listupdate("genus_personae", dims.genus_personae);
    listupdate("meter", dims.meter);
    listupdate("metertype", dims.metertype);
    updateversus();
};

function addfilter(category, filtername){
    filters[category] = filtername; 
    filterdims[category].filter(filtername);
};

function removefilter(category, filtername){
    if (filters.hasOwnProperty(category)) {
        delete(filters[category]);
        filterdims[category].filterAll();
    } else {
        console.log("Can't remove filter " + filtername + 
                    "; no category " + category);
    };
};

function addpopupfield(popup, field, label, value) {
    var fielddiv = popup.append("div")
        .classed(field, true);
    fielddiv.append("span").classed("label", true)
        .text(label);
    if (field != "l_first" && field != "l_last") {
        fielddiv.append("span").classed("value", true)
            .text(value);
    } else {
        fielddiv.append("span").classed("value", true)
            .html(value.replace(/\\n/g, "<br />"));
    }
}

function activateli() {
    d3.selectAll("ul li").on("click", function(d) {
        var category = d3.select(this)[0][0].parentNode.parentNode.id;
        // add popup with verse listing
        if (category === 'versus') {
            var popup = d3.select("#oneverse");
            popup.text("");
            addpopupfield(popup, "fabula", "Fabula", d.value.fabula);
            addpopupfield(popup, "line_number_first_label", "Start", 
                          d.value.line_number_first_label);
            addpopupfield(popup, "line_number_last_label", "End", 
                          d.value.line_number_last_label);
            addpopupfield(popup, "numlines", "# lines", d.value.numlines);
            addpopupfield(popup, "meter", "Meter", d.value.meter);
            addpopupfield(popup, "metertype", "Meter Type", 
                          d.value.metertype);
            addpopupfield(popup, "meter_before", "Before", 
                          d.value.meter_before);
            addpopupfield(popup, "meter_after", "After", 
                          d.value.meter_after);
            addpopupfield(popup, "l_first", "First line", d.value.l_first);
            addpopupfield(popup, "l_last", "Last line", d.value.l_last);
            addpopupfield(popup, "closure", "Closure", d.value.closure);
            addpopupfield(popup, "comments_on_length", "Comments", 
                          d.value.comments_on_length);
            addpopupfield(popup, "comments_other", "Other", 
                          d.value.comments_other);
            
            popup.style("visibility", "visible");
            popup.on("click", function(d){
                d3.select(this).style("visibility", "hidden");
            })
            return;
        };
        if (!d3.select(this).classed("filter")) {
            addfilter(category, d.key);
        } else {
            removefilter(category, d.key);
        };
        update();
        activateli();
    });
}

function start(dd) {
    cf = crossfilter(dd);
    /* dimensions for display */
    dims['poeta'] = cf.dimension(function(d){return d.poeta});
    dims['fabulae'] = cf.dimension(function(d){return d.fabula});
    dims['personae'] = cf.dimension(function(d){return d.nomen});
    dims['genus_personae'] = cf.dimension(function(d){return d.genus_personae});
    dims['meter'] = cf.dimension(function(d){return d.meter});
    dims['metertype'] = cf.dimension(function(d){return d.metertype});
    dims['versus'] = cf.dimension(function(d){return d.fpid});
    dims['versus_per_personam'] = cf.dimension(function(d){return d.fpid + d.nomen});
    
    /* separate dimensions just for filtering */
    filterdims['poeta'] = cf.dimension(function(d){return d.poeta});
    filterdims['fabulae'] = cf.dimension(function(d){return d.fabula});
    filterdims['personae'] = cf.dimension(function(d){return d.nomen});
    filterdims['genus_personae'] = cf.dimension(function(d){return d.genus_personae});
    filterdims['meter'] = cf.dimension(function(d){return d.meter});
    filterdims['metertype'] = cf.dimension(function(d){return d.metertype});
    filterdims['versus'] = cf.dimension(function(d){return d.fpid});
    filterdims['versus_per_personam'] = cf.dimension(function(d){return d.fpid + d.nomen});
    
    d3.select("#poeta").append("ul");
    d3.select("#fabulae").append("ul");
    d3.select("#personae").append("ul");
    d3.select("#genus_personae").append("ul");
    d3.select("#meter").append("ul");
    d3.select("#metertype").append("ul");
    d3.select("#versus").append("ul");
    
    update();
    activateli();
    d3.select("#reset").on("click", function(){
        for (filter in filters){
            filterdims[filter].filterAll();
        };
        filters = {};
        update();
    })
        .classed("link", true)
        .text("Reset");
}
