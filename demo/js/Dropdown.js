// Generated by CoffeeScript 1.8.0

/*
Poe.Dropdown is a wrapper around a Bootstrap 3 dropdown.
 */

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Poe.Dropdown = (function(_super) {
    __extends(Dropdown, _super);

    function Dropdown(toolbar, buttonText, tooltip, tooltipPos) {
      if (buttonText == null) {
        buttonText = "No Text";
      }
      if (tooltip == null) {
        tooltip = "";
      }
      if (tooltipPos == null) {
        tooltipPos = "right";
      }
      this.container = $('<div class="dropdown">');
      this.button = $('<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"></button>');
      this.childContainer = $('<ul class="dropdown-menu" role="menu" aria-expand="true"></ul>');
      this.text = $('<span class="text"><span>');
      console.log(toolbar);
      toolbar.element.append(this.container);
      this.container.append(this.button);
      this.container.append(this.childContainer);
      this.button.append(this.text);
      this.setText(buttonText);
      if (tooltip !== '') {
        this.button.addClass('poe-tooltip');
        this.button.attr('title', tooltip);
        this.button.attr('data-placement', tooltipPos);
      }
      this.children = [];
    }


    /*
    	Add a caret dropdown indicator to the dropdown.
    	@return [Poe.Dropdown] this for method chaining.
     */

    Dropdown.prototype.addCaret = function() {
      var caret;
      caret = $('<span class="caret"></span>');
      this.button.append(caret);
      return this;
    };


    /*
    	Sets the dropdown's selected text
    
    	@param text [string] the text to set as the dropdown's value
     */

    Dropdown.prototype.setText = function(text) {
      return this.text.html(text + ' ');
    };


    /*
    	Add an item to the dropdown list.
    
    	@param text [string] the string to add
    	@return [jQuery] jQuery object representing the <li> added
     */

    Dropdown.prototype.addItem = function(text) {
      var a, li;
      li = $('<li role="presentation"></li>');
      a = $('<a role="menuitem" tabindex="-1" href="#"></a>');
      this.childContainer.append(li);
      li.append(a);
      a.html(text);
      return li;
    };


    /*
    	Register an event callback. Valid events are:
    
    	itemClicked  -  called when an item is clicked
     */

    Dropdown.prototype.on = function(event, callback) {
      if (event === 'itemClicked') {
        return this.container.on('click', 'ul li a', callback);
      }
    };


    /*
    	Returns the element that this dropdown is a wrapper for
    	@return [jQuery] the element
     */

    Dropdown.prototype.element = function() {
      return this.container;
    };

    return Dropdown;

  })(Poe.ToolBarItem);

}).call(this);

//# sourceMappingURL=Dropdown.js.map
