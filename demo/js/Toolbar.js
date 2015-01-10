// Generated by CoffeeScript 1.8.0

/*
Poe.ToolBar handles items on the Writer's toolbar. It uses the {Poe.TextCursor}
provided by Poe.Writer.document to apply styles to the text.

@todo Make Poe.ToolBar create all of the elements itself.
 */

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Poe.ToolBar = (function() {

    /*
    	Creates a new Poe.ToolBar instance.
     */
    function ToolBar(writer) {
      var a, colorItems, colors, elm, i, iconAlignCenter, iconAlignJustify, iconAlignLeft, iconAlignRight, iconListBullet, iconListNumber, key, value, _i, _ref, _ref1, _ref2, _ref3;
      this.writer = writer;
      this.fontAdded = __bind(this.fontAdded, this);
      this.handlePDF = __bind(this.handlePDF, this);
      this.btnListNumberClicked = __bind(this.btnListNumberClicked, this);
      this.btnListBulletClicked = __bind(this.btnListBulletClicked, this);
      this.handleColorClicked = __bind(this.handleColorClicked, this);
      this.paragraphStyleChanged = __bind(this.paragraphStyleChanged, this);
      this.handleFontSizeClick = __bind(this.handleFontSizeClick, this);
      this.handleFontClick = __bind(this.handleFontClick, this);
      this.handleShortcut = __bind(this.handleShortcut, this);
      this.textStyleChanged = __bind(this.textStyleChanged, this);
      this.handlePageSize = __bind(this.handlePageSize, this);
      this.handleDynamicToolBar = __bind(this.handleDynamicToolBar, this);
      if (!this.writer) {
        throw new Error('new Poe.Toolbar takes exactly one argument of type Poe.Writer');
      }
      this.element = $('.toolbar');
      this.textCursor = this.writer.document.textCursor;
      this.textStyle = this.textCursor.textStyle;
      this.paragraphStyle = this.textCursor.paragraphStyle;
      this.paragraphStyle.changed(this.paragraphStyleChanged);
      this.pageSizeDropdown = new Poe.Dropdown(this, 'Letter', 'Page Size');
      _ref = Poe.Document.PageSize;
      for (key in _ref) {
        value = _ref[key];
        this.pageSizeDropdown.addItem(key);
      }
      this.pageSizeDropdown.on('itemClicked', this.handlePageSize);
      this.dropFonts = new Poe.Dropdown(this, 'Tinos', 'Change Font');
      this.dropFonts.button.css('width', '125px');
      this.dropFonts.text.css('float', 'left');
      this.dropFonts.css('width', '200px');
      this.dropFontSize = new Poe.Dropdown(this, '12', 'Font Size');
      this.dropFontSize.addCaret();
      this.dropFontSize.addItem(8);
      this.dropFontSize.addItem(9);
      this.dropFontSize.addItem(10);
      this.dropFontSize.addItem(11);
      this.dropFontSize.addItem(12);
      this.dropFontSize.addItem(14);
      this.dropFontSize.addItem(18);
      this.dropFontSize.addItem(24);
      this.dropFontSize.addItem(30);
      this.dropFontSize.addItem(36);
      this.dropFontSize.addItem(48);
      this.dropFontSize.addItem(60);
      this.dropFontSize.addItem(72);
      this.dropFontSize.addItem(96);
      colorItems = [];
      colors = ['black', '#428bca', '#5cb85c', '#5bc0de', '#f0ad4e', '#d9534f', '#555', '#777'];
      this.dropColor = new Poe.Dropdown(this, '', '');
      colorItems.push(this.dropColor.addItem(""));
      colorItems.push(this.dropColor.addItem(""));
      colorItems.push(this.dropColor.addItem(""));
      colorItems.push(this.dropColor.addItem(""));
      colorItems.push(this.dropColor.addItem(""));
      colorItems.push(this.dropColor.addItem(""));
      colorItems.push(this.dropColor.addItem(""));
      colorItems.push(this.dropColor.addItem(""));
      colorItems.push(this.dropColor.addItem(""));
      this.dropColor.button.remove();
      this.dropColor.button = $('<span style="padding-left: 4px" class="dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="true">&nbsp;</span>');
      this.dropColor.container.prepend(this.dropColor.button);
      this.dropColor.button.css('background-color', 'black');
      this.dropColor.button.css('padding-left', '15px');
      this.dropColor.childContainer.css('width', '200px');
      this.dropColor.button.css('border-radius', '3px');
      this.dropColor.button.css('float', 'right');
      for (i = _i = 0, _ref1 = colorItems.length; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
        if (!colorItems[i]) {
          continue;
        }
        a = colorItems[i].children('a');
        colorItems[i].css('float', 'left');
        a.addClass('color-list-item');
        a.css('background-color', colors[i]);
      }
      this.dropFonts.button.append(this.dropColor.element());
      this.btnBold = new Poe.Button(this, '<b>B</b>');
      this.btnItalic = new Poe.Button(this, '<i>I</i>');
      this.btnUnderline = new Poe.Button(this, '<u>U</u>');
      this.groupTextFormat = new Poe.ButtonGroup(this, [this.btnBold, this.btnItalic, this.btnUnderline]);
      this.btnAlignLeft = new Poe.Button(this);
      this.btnAlignCenter = new Poe.Button(this);
      this.btnAlignRight = new Poe.Button(this);
      this.btnAlignJustify = new Poe.Button(this);
      iconAlignLeft = new Poe.Glyphicon('align-left');
      iconAlignCenter = new Poe.Glyphicon('align-center');
      iconAlignRight = new Poe.Glyphicon('align-right');
      iconAlignJustify = new Poe.Glyphicon('align-justify');
      this.btnAlignLeft.setIcon(iconAlignLeft);
      this.btnAlignCenter.setIcon(iconAlignCenter);
      this.btnAlignRight.setIcon(iconAlignRight);
      this.btnAlignJustify.setIcon(iconAlignJustify);
      this.groupParagraphAlign = new Poe.ButtonGroup(this, [this.btnAlignLeft, this.btnAlignCenter, this.btnAlignRight, this.btnAlignJustify]);
      this.groupParagraphAlign.setRadio(true);
      this.btnListBullet = new Poe.Button(this);
      this.btnListNumber = new Poe.Button(this);
      iconListBullet = new Poe.Glyphicon('list');
      iconListNumber = new Poe.Glyphicon('list-alt');
      this.btnListBullet.setIcon(iconListBullet);
      this.btnListNumber.setIcon(iconListNumber);
      this.groupList = new Poe.ButtonGroup(this, [this.btnListBullet, this.btnListNumber]);
      this.dropFonts.on('itemClicked', this.handleFontClick);
      this.dropFontSize.on('itemClicked', this.handleFontSizeClick);
      this.btnBold.on('click', this.writer.toolbarHelper.btnBoldClicked);
      this.btnItalic.on('click', this.writer.toolbarHelper.btnItalicClicked);
      this.btnUnderline.on('click', this.writer.toolbarHelper.btnUnderlineClicked);
      this.btnAlignLeft.on('click', this.writer.toolbarHelper.btnAlignLeftClicked);
      this.btnAlignCenter.on('click', this.writer.toolbarHelper.btnAlignCenterClicked);
      this.btnAlignRight.on('click', this.writer.toolbarHelper.btnAlignRightClicked);
      this.btnAlignJustify.on('click', this.writer.toolbarHelper.btnAlignJustifyClicked);
      this.btnListBullet.on('click', this.btnListBulletClicked);
      this.btnListNumber.on('click', this.btnListNumberClicked);
      this.dropColor.on('itemClicked', this.handleColorClicked);
      this.textStyle.changed(this.textStyleChanged);
      this.elements = {
        dynamic: $('#dynamic .text')
      };
      this.elements.Paragraph = {
        fonts: this.dropFonts,
        fontSize: this.dropFontSize,
        textFormatting: this.groupTextFormat,
        alignment: this.groupParagraphAlign,
        lists: this.groupList
      };
      this.elements.Page = {
        pageSize: this.pageSizeDropdown
      };
      this.elements.List = {
        fonts: this.dropFonts,
        fontSize: this.dropFontSize,
        textFormatting: this.groupTextFormat,
        alignment: this.groupParagraphAlign,
        removeItem: $('#list-RemoveItem')
      };
      this.textStyleChanged(this.textStyle);
      this.paragraphStyleChanged(this.paragraphStyle);
      $('body').keydown(this.handleShortcut);
      $('#print-pdf').click(this.handlePDF);
      $('#dynamic-list li a').click(this.handleDynamicToolBar);
      this.fontManager = new Poe.FontManager();
      this.fontManager.on('newFont', this.fontAdded);
      this.fontManager.loadDefaults();
      this.currentToolBar = '';
      _ref2 = Poe.ToolBar.DynamicPart;
      for (key in _ref2) {
        value = _ref2[key];
        _ref3 = this.elements[value];
        for (key in _ref3) {
          elm = _ref3[key];
          if (elm) {
            elm.hide();
          }
        }
      }
      this.setToolBar(Poe.ToolBar.DynamicPart.Paragraph);
    }

    ToolBar.DynamicPart = {
      Paragraph: 'Paragraph',
      List: 'List',
      Page: 'Page'
    };

    ToolBar.prototype.setToolBar = function(dynamicPart) {
      var key, oldToolBar, value, _ref, _ref1, _ref2, _results;
      if (dynamicPart === this.currentToolBar) {
        return;
      }
      oldToolBar = this.currentToolBar;
      _ref = Poe.ToolBar.DynamicPart;
      for (key in _ref) {
        value = _ref[key];
        if (value === dynamicPart) {
          this.elements.dynamic.html(dynamicPart);
          this.currentToolBar = dynamicPart;
          break;
        }
      }
      _ref1 = this.elements[oldToolBar];
      for (key in _ref1) {
        value = _ref1[key];
        value.hide();
      }
      _ref2 = this.elements[this.currentToolBar];
      _results = [];
      for (key in _ref2) {
        value = _ref2[key];
        _results.push(value.show());
      }
      return _results;
    };

    ToolBar.prototype.handleDynamicToolBar = function(event) {
      var name;
      name = $(event.target).html();
      return this.setToolBar(name);
    };

    ToolBar.prototype.handlePageSize = function(event) {
      var size, text;
      text = $(event.target).html();
      size = Poe.Document.PageSize[text];
      if (size) {
        this.writer.document.setPageSize(size);
        return this.pageSizeDropdown.setText(text);
      }
    };


    /*
    	A callback given to Poe.TextCursor.textStyle.
    	@see Poe.TextStyle#changed
    	@param style [Poe.TextStyle] the style to update the toolbar with
    	@private
     */

    ToolBar.prototype.textStyleChanged = function(style) {
      var activate;
      activate = function(toolItem, isTrue) {
        if (isTrue) {
          return toolItem.addClass('active');
        } else {
          return toolItem.removeClass('active');
        }
      };
      this.textStyle = style;
      this.btnBold.active(style.bold);
      this.btnItalic.active(style.italic);
      this.btnUnderline.active(style.underline);
      this.dropFonts.setText(style.font);
      this.dropFontSize.setText(style.fontSize);
      return this.dropColor.button.css('background-color', style.color);
    };


    /*
    	A even handler for toolbar shortcuts. Returns immediately if
    	the control key is not pressed.
    	@param event [MouseDownEvent] the event
    	@private
     */

    ToolBar.prototype.handleShortcut = function(event) {
      var toggle;
      if (!event.ctrlKey) {
        return;
      }
      toggle = (function(_this) {
        return function(button) {
          button.active(true);
          if (button === _this.btnBold) {
            _this.textStyle.bold = !_this.textStyle.bold;
          } else if (button === _this.btnItalic) {
            _this.textStyle.italic = !_this.textStyle.italic;
          } else if (button === _this.btnUnderline) {
            _this.textStyle.underline = !_this.textStyle.underline;
          }
          _this.textStyle.applyChar();
          return _this.textStyleChanged(_this.textStyle);
        };
      })(this);
      switch (event.keyCode) {
        case Poe.key.B:
          event.preventDefault();
          return toggle(this.btnBold);
        case Poe.key.I:
          event.preventDefault();
          return toggle(this.btnItalic);
        case Poe.key.U:
          event.preventDefault();
          return toggle(this.btnUnderline);
        default:
          return event.preventDefault();
      }
    };


    /*
    	Event handler for when a new font is clicked. Updates
    	the current style and applies the style
    	@param event [MouseClickEvent] the event that happened.
    	@private
     */

    ToolBar.prototype.handleFontClick = function(event) {
      var name;
      name = $(event.target).html();
      this.dropFonts.setText(name);
      return this.writer.toolbarHelper.fontClicked(name);
    };


    /*
    	Event handler for when a font size is clicked.
    	@param event [MouseClickEvent] the event that triggered the callback
    	@private
     */

    ToolBar.prototype.handleFontSizeClick = function(event) {
      var name;
      name = $(event.target).html();
      this.dropFontSize.setText(name);
      return this.writer.toolbarHelper.fontSizeClicked(parseInt(name.replace('px', '')));
    };


    /*
    	Called when the line style changes of the {Poe.TextCursor}
    	@param style [Poe.ParagraphStyle] the style that has changed
    	@private
     */

    ToolBar.prototype.paragraphStyleChanged = function(style) {
      this.btnAlignLeft.active(false);
      this.btnAlignCenter.active(false);
      this.btnAlignRight.active(false);
      this.btnAlignJustify.active(false);
      switch (style.align) {
        case Poe.ParagraphStyle.Align.Left:
          return this.btnAlignLeft.active(true);
        case Poe.ParagraphStyle.Align.Center:
          return this.btnAlignCenter.active(true);
        case Poe.ParagraphStyle.Align.Right:
          return this.btnAlignRight.active(true);
        case Poe.ParagraphStyle.Align.Justify:
          return this.btnAlignJustify.active(true);
      }
    };

    ToolBar.prototype.handleColorClicked = function(event) {
      var color, target;
      event.stopPropagation();
      target = $(event.target);
      color = target.css('background-color');
      this.dropColor.button.css('background-color', color);
      this.writer.toolbarHelper.colorClicked(color);
      return this.element.click();
    };

    ToolBar.prototype.btnListBulletClicked = function() {
      return this.createList(Poe.List.ListType.Bullets);
    };

    ToolBar.prototype.btnListNumberClicked = function() {
      return this.createList(Poe.List.ListType.Numbers);
    };

    ToolBar.prototype.createList = function(type) {
      var list, paragraph;
      list = new Poe.List();
      list.setListType(type);
      paragraph = this.textCursor.currentParagraph();
      if (paragraph instanceof Poe.List) {
        paragraph.append(list);
      } else {
        list.insertAfter(paragraph);
      }
      this.textCursor.moveInside(list.child(0).child(0));
      return this.textStyle.applyChar();
    };

    ToolBar.prototype.handlePDF = function(event) {
      return this.writer.document.pdf.generate();
    };

    ToolBar.prototype.fontAdded = function(name) {
      var li;
      li = this.elements.Paragraph.fonts.addItem(name);
      return li.css('font-family', "'" + name + "'");
    };

    return ToolBar;

  })();

}).call(this);

//# sourceMappingURL=Toolbar.js.map
