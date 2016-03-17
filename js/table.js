d3.tsv("../tsv/current.tsv", function(data) {
    var columns = ["poeta","fabulae","fpid","line_number_first_ordinate","line_number_first_label","line_number_last_ordinate","line_number_last_label","numlines","char_numlines","nomen","genera","line_first", "line_last","meter_before","meter_after","closure","comments_on_length","comments_other","meter","meter_type"];

    var table = d3.select("#container").append("table"),
	thead = table.append("thead"),
	tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
	    return columns.map(function(column) {
		return {column: column, value: row[column]};
	    });
	})
        .enter()
        .append("td")
        .text(function(d) { return d.value; });
    
});
