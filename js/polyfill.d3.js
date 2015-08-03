d3.selection.prototype.trigger = function(evtName, data) {
    this.on(evtName)(data);
}
d3.selection.prototype.after = function(tagName) {
    var elements = [];

    this.each(function() {
	var element = document.createElement(tagName);
	this.parentNode.insertBefore(element, this.nextSibling);
	elements.push(element);
    });

    return d3.selectAll(elements);
}
d3.selection.prototype.before = function(tagName) {
    var elements = [];

    this.each(function() {
	var element = document.createElement(tagName);
	this.parentNode.insertBefore(element, this);
	elements.push(element);
    });

    return d3.selectAll(elements);
}
d3.selection.prototype.clear = function() {
    this.selectAll('*').remove();
    return this;
}
d3.selection.prototype.appendTo = function(selector) {
    var targets = d3.selectAll(selector),
	targetCount = targets[0].length,
	_this = this,
	clones = [];

    targets.each(function() {
	var currTarget = this;
	_this.each(function() {
	    if(targetCount > 1) {
		var clone = this.cloneNode(true);
		currTarget.appendChild(clone);
		clones.push(clone);
	    }
	    else {
		currTarget.appendChild(this);
	    }
	});
    });

    if(targetCount > 1) {
	this.remove();
    }

    return clones.length > 0 ? d3.selectAll(clones) : this;
}
d3.selection.prototype.toggleClass = function(className) {
    this.classed(className, !this.classed(className));
    return this;
}
d3.selection.prototype.eq = function(index) {
    return d3.select(this[0][index]);
}
d3.selection.prototype.show = function() {
    this.style('display', 'initial');
    return this;
}
d3.selection.prototype.hide = function() {
    this.style('display', 'none');
    return this;
}
d3.selection.prototype.toggle = function() {
    var isHidden = this.style('display') == 'none';
    return this.style('display', isHidden ? 'inherit' : 'none');
}
d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
	this.parentNode.appendChild(this);
    });
}
d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
	var firstChild = this.parentNode.firstChild;
	if (firstChild) {
	    this.parentNode.insertBefore(this, firstChild);
	}
    });
}
