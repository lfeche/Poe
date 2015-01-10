// Generated by CoffeeScript 1.8.0

/*
Poe.TextCursor is the visible caret on the screen. It is where all of the magic
happens when it comes to user input. It listens for keydown event from the body element
and inserts the text typed before the cursor. It also handles word wrap and page wrap.

The cursor is actually handled in two different areas. There is a span and a visible
cursor, this.element and this.visibleCursor respectively. The span is actually the
cursor that is used. It has one child that is a zero width space &#8203; When the cursor
is moved the visible cursor gets updated to the position of that span. Making it look
like it is the cursor.
 */

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Poe.TextCursor = (function() {

    /*
    Creates a Poe.TextCursor instance
    @param [Poe.Word] inside the word to put the cursor inside
     */
    function TextCursor(inside) {
      this.blink = __bind(this.blink, this);
      this.hide = __bind(this.hide, this);
      this.show = __bind(this.show, this);
      this.paragraphStyleChanged = __bind(this.paragraphStyleChanged, this);
      this.handleClick = __bind(this.handleClick, this);
      this.handleInput = __bind(this.handleInput, this);
      this.keyEvent = __bind(this.keyEvent, this);
      if (!inside) {
        throw new Error('Poe.TextCursor constructor expects one argument of type Poe.Word');
      }
      this.hiddenTextArea = $('<textarea style="position: absolute; opacity: 0; height: 2px; width: 2px;"></textarea>');
      this.element = $('<span class="textcursor">&#8203;</span>');
      this.visibleCursor = $('<div class="visiblecursor"></div>');
      this.currentWord = inside;
      this.blinkTimer = null;
      inside.prepend(this.element);
      $('body').keydown(this.keyEvent);
      this.currentPage().parent.element.click(this.handleClick);
      this.textStyle = new Poe.TextStyle(this);
      this.textStyle.applyWord(this.currentWord);
      this.paragraphStyle = new Poe.ParagraphStyle(this);
      this.paragraphStyle.apply();
      this.paragraphStyle.changed(this.paragraphStyleChanged);
      this.document = this.currentPage().parent;
      this.document.element.append(this.visibleCursor);
      this.document.element.append(this.hiddenTextArea);
      this.hiddenTextArea.on('input change', this.handleInput);
      this.capsLock = false;
      this.show();
    }


    /*
    Convienence function for getting the cursor contiaining word's parent
    @return [Poe.TextObject] the parent
     */

    TextCursor.prototype.currentLine = function() {
      return this.currentWord.parent;
    };


    /*
    Convienence function for currentLine().parent
    @return [Poe.TextObject] currentLine().parent
     */

    TextCursor.prototype.currentParagraph = function() {
      return this.currentLine().parent;
    };


    /*
    Convenience function for currentParagraph().parent
    @return [Poe.TextObject] currentParagraph().parent
     */

    TextCursor.prototype.currentPage = function() {
      return this.currentParagraph().parent;
    };

    TextCursor.prototype.document = function() {
      return this.currentPage().parent;
    };


    /*
    Gets the next text node after the cursor. This will loop through all parents up to
    the Poe.Document if neccessary. It does not change any members unless applyChanges
    is true.
    @param applyChanges [Boolean] If true the currentWord is changed by this function.
    @return [null] if no node is found
    @return [jQuery or null] the next text node found
     */

    TextCursor.prototype.next = function() {
      var next, word;
      next = this.element.nextSibling();
      if (next && next[0].textContent.charCodeAt(0) === 8203) {
        next.remove();
        next = this.element.nextSibling();
      }
      word = this.currentWord;
      if (!next) {
        word = word.next();
        next = word != null ? word.children().first() : void 0;
        if (word) {
          this.currentWord = word;
        }
      }
      if (word) {
        this.textStyle.update(word);
      }
      if (word) {
        this.paragraphStyle.update(word.parent.parent);
      }
      return next;
    };


    /*
    Gets the previous text node before the cursor. This will loop through all parents up to
    the Poe.Document containing the cursor if neccessary. This does not change any members
    unless applyChanges is true.
    @param applyChanges [Boolean] Sets the current word on return to the word containing
    the return value.
    @return [null] if no node is found
    @return [jQuery or null] the previous text node found
     */

    TextCursor.prototype.prev = function() {
      var prev, word;
      prev = this.element.prevSibling();
      if (prev && prev[0].textContent.charCodeAt(0) === 8203) {
        prev.remove();
        prev = this.element.prevSibling();
      }
      word = this.currentWord;
      if (!prev) {
        word = word.prev();
        prev = word != null ? word.children().last() : void 0;
        if (word) {
          this.currentWord = word;
        }
      }
      if (word) {
        this.textStyle.update(word);
      }
      if (word) {
        this.paragraphStyle.update(word.parent.parent);
      }
      return prev;
    };


    /*
    Moves the cursor before the previous text node found by prev()
    @return [Poe.TextCursor] this
     */

    TextCursor.prototype.moveLeft = function() {
      var oldLine, prev;
      oldLine = this.currentLine();
      prev = this.prev();
      if (prev) {
        if (oldLine === this.currentLine()) {
          prev.before(this.element);
        } else {
          prev.after(this.element);
        }
      }
      return this;
    };


    /*
    Moves the cursor after the next text node found by next()
    @return [Poe.TextCursor] this
     */

    TextCursor.prototype.moveRight = function() {
      var next, oldLine;
      oldLine = this.currentLine();
      next = this.next();
      if (next) {
        if (oldLine === this.currentLine()) {
          next.after(this.element);
        } else {
          next.before(this.element);
        }
      }
      return this;
    };


    /*
    Moves the actual blinking cursor to where it should be.
    @return [Poe.TextCursor] this
    @private
     */

    TextCursor.prototype.update = function() {
      var offset;
      offset = this.element.offset();
      offset.top -= this.element.offsetParent().offset().top;
      offset.left -= this.element.offsetParent().offset().left;
      this.visibleCursor.css('top', "" + offset.top + "px");
      this.visibleCursor.css('left', "" + offset.left + "px");
      this.hiddenTextArea.css('top', "" + offset.top + "px");
      this.hiddenTextArea.css('left', "" + offset.left + "px");
      this.visibleCursor.css('height', "" + this.textStyle.fontSize + "pt");
      return this;
    };


    /*
    Fixes word wrap. Starts off by calling {Poe.TextCursor#paragraphStyleChanged} then
    loops through all lines of the currentParagraph() and checks to see if the
    last word in that line is outside of the editable area. If the word is
    outside it gets moved down to the next line. If no line exists a line is created
    after it.
    @return [Poe.TextCursor] this
    @private
     */

    TextCursor.prototype.doWordWrap = function() {
      var child, childWidth, hasRoom, line, newLine, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this.currentParagraph().children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (line.isEmpty()) {
          line.remove();
          continue;
        }
        while (!line.visiblyContains(line.children.last())) {
          if (!line.next()) {
            newLine = new Poe.Line();
            newLine.element.attr('class', line.element.attr('class'));
            newLine.child(0).remove();
            newLine.insertAfter(line);
          } else {
            newLine = line.next();
          }
          newLine.prepend(line.children.last());
        }
        childWidth = 0;
        _ref1 = line.children;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          child = _ref1[_j];
          childWidth += child.width();
        }
        if (!line.nextSibling()) {
          break;
        }
        if (line.nextSibling() instanceof Poe.ListItem) {
          break;
        }
        hasRoom = true;
        while (hasRoom) {
          child = line.nextSibling().child(0);
          if (!child) {
            break;
          }
          if (childWidth + child.width() < line.element.outerWidth(false)) {
            hasRoom = true;
            child.insertAfter(line.children.last());
          } else {
            hasRoom = false;
          }
        }
      }
      this.doPageWrap();
      return this;
    };

    TextCursor.prototype.doPageWrap = function() {
      var availableSpace, child, line, newPage, next, nextPage, overflowedParagraph, overflows, page, pageHeight, paragraph, pgraph, _i, _j, _len, _len1, _ref, _ref1, _results;
      overflows = function(page, paragraph) {
        var pageBottom, paragraphBottom;
        paragraphBottom = paragraph.position().top + paragraph.height();
        pageBottom = page.position().top + page.height();
        pageBottom += parseInt(page.element.css('padding-top'));
        return paragraphBottom > pageBottom;
      };
      _ref = this.document.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        page = _ref[_i];
        while (overflows(page, page.children.last())) {
          overflowedParagraph = page.children.last();
          if (!page.next()) {
            newPage = new Poe.Page();
            newPage.insertAfter(this.currentPage());
            newPage.child(0).remove();
          }
          next = page.next();
          paragraph = new Poe.Paragraph();
          paragraph.setName(page.children.last().name());
          paragraph.child(0).remove();
          next.prepend(paragraph);
          line = overflowedParagraph.children.last();
          while (overflows(page, line)) {
            paragraph.prepend(line);
            line = overflowedParagraph.children.last();
            if (overflowedParagraph.isEmpty()) {
              overflowedParagraph.remove();
              break;
            }
          }
          this.show();
        }
        nextPage = page.next();
        if (!nextPage) {
          break;
        }
        availableSpace = 0;
        _ref1 = page.children;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          child = _ref1[_j];
          availableSpace += child.height();
        }
        pageHeight = page.height() + page.element.css('padding-top') + page.position().top;
        availableSpace = pageHeight - availableSpace;
        _results.push((function() {
          var _k, _len2, _ref2, _results1;
          _ref2 = nextPage.children;
          _results1 = [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            paragraph = _ref2[_k];
            _results1.push((function() {
              var _l, _len3, _ref3, _results2;
              _ref3 = paragraph.children;
              _results2 = [];
              for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
                line = _ref3[_l];
                if (line.height() < availableSpace) {
                  if (paragraph.name() === page.children.last().name()) {
                    page.children.last().append(line);
                  } else {
                    pgraph = new Poe.Paragraph();
                    pgraph.child(0).remove();
                    pgraph.insertAfter(page.children.last());
                    pgraph.append(line);
                  }
                  if (paragraph.isEmpty()) {
                    _results2.push(paragraph.remove());
                  } else {
                    _results2.push(void 0);
                  }
                } else {
                  _results2.push(void 0);
                }
              }
              return _results2;
            })());
          }
          return _results1;
        })());
      }
      return _results;
    };


    /*
    Handles typing. At first it stops the cursor from blinking. Then does anything
    neccessary to translate the keydown onto the screen. Lastly it makes the cursor
    continue blinking.
    @private
     */

    TextCursor.prototype.keyEvent = function(event) {
      var li, line, next, oldLine, oldPage, oldParagraph, oldWord, paragraph, pos, prev, word;
      if (event.ctrlKey) {
        return;
      }
      this.hide();
      switch (event.keyCode) {
        case Poe.key.Shift:
          break;
        case Poe.key.CapsLock:
          this.capsLock = !this.capsLock;
          break;
        case Poe.key.Left:
          event.preventDefault();
          this.moveLeft();
          break;
        case Poe.key.Right:
          event.preventDefault();
          this.moveRight();
          break;
        case Poe.key.Down:
          event.preventDefault();
          if (!this.currentLine().next()) {
            return;
          }
          pos = this.element.position();
          pos.top = this.currentLine().next().position().top;
          pos.clientX = pos.left - 2;
          pos.clientY = pos.top + 2;
          pos.target = this.currentLine().next().element[0];
          this.handleClick(pos);
          break;
        case Poe.key.Up:
          event.preventDefault();
          if (!this.currentLine().prev()) {
            return;
          }
          pos = this.element.position();
          pos.top = this.currentLine().prev().position().top;
          pos.clientX = pos.left + 2;
          pos.clientY = pos.top + 2;
          pos.target = this.currentLine().prev().element[0];
          this.handleClick(pos);
          break;
        case Poe.key.Enter:
          event.preventDefault();
          if (this.currentParagraph() instanceof Poe.List) {
            li = new Poe.ListItem();
            li.insertAfter(this.currentLine());
            this.moveInside(li.child(0));
            this.textStyle.applyWord();
            break;
          }
          paragraph = new Poe.Paragraph();
          paragraph.insertAfter(this.currentParagraph());
          line = paragraph.child(0);
          word = line.child(0);
          this.textStyle.applyWord(word);
          while (this.element.nextSibling()) {
            word.element.append(this.element.nextSibling());
          }
          while (this.currentWord.element.nextSibling()) {
            line.append(this.currentWord.next());
          }
          while (this.currentLine().element.nextSibling()) {
            paragraph.append(this.currentLine().next());
          }
          if (this.currentWord.children().length === 1 && this.currentLine().children.length === 1) {
            this.currentWord.element.append('&#8203;');
          }
          this.currentWord = word;
          if (this.currentWord.isEmpty() && this.currentLine().children.length === 1) {
            this.currentWord.element.append('&#8203;');
          }
          this.currentWord.element.prepend(this.element);
          this.textStyle.apply(this.currentWord);
          if (event.shiftKey) {
            this.paragraphStyle.apply();
          }
          this.paragraphStyle.update(this.currentParagraph());
          this.doWordWrap();
          break;
        case Poe.key.Backspace:
          event.preventDefault();
          oldWord = this.currentWord;
          oldLine = this.currentLine();
          oldParagraph = this.currentParagraph();
          oldPage = this.currentPage();
          prev = this.prev();
          if (oldParagraph instanceof Poe.List) {
            if (oldLine instanceof Poe.ListItem) {
              if (oldLine.children.length === 1 && oldWord.children().length === 1) {
                if (oldLine.index() === oldParagraph.children.length - 1) {
                  paragraph = new Poe.Paragraph();
                  paragraph.insertAfter(oldParagraph);
                  this.moveInside(paragraph.child(0).child(0));
                  this.textStyle.applyWord(this.currentWord);
                  this.paragraphStyle.apply();
                  oldLine.remove();
                  if (oldParagraph.isEmpty()) {
                    oldParagraph.remove();
                  }
                }
                break;
              }
            }
          }
          if (!prev) {
            break;
          }
          if (prev) {
            prev.after(this.element);
          }
          if (prev && oldLine === this.currentLine()) {
            prev.remove();
          }
          if (oldPage.isEmpty()) {
            oldPage.remove();
          } else if (oldParagraph.isEmpty()) {
            oldParagraph.remove();
          } else if (oldLine.isEmpty()) {
            oldLine.remove();
          } else if (oldWord.isEmpty()) {
            oldWord.remove();
          }
          this.doWordWrap();
          break;
        case Poe.key.Delete:
          event.preventDefault();
          next = this.next();
          if (next) {
            next.remove();
          }
          break;
        case Poe.key.Space:
          event.preventDefault();
          this.element.before(" ");
          word = new Poe.Word();
          word.insertAfter(this.currentWord);
          next = this.element.nextSibling();
          while (next) {
            word.append(next);
            next = this.element.nextSibling();
          }
          word.prepend(this.element);
          this.currentWord = word;
          this.textStyle.applyWord(this.currentWord);
          this.doWordWrap();
          break;
        default:

          /*if event.shiftKey and @capsLock
            event.shiftKey = false
          else if not event.shiftKey and @capsLock and event.keyCode >= 65 and event.keyCode <= 90
            event.shiftKey = true
          letter = Poe.keyMapShift[event.keyCode] if event.shiftKey
          letter = Poe.keyMap[event.keyCode] unless event.shiftKey
          @element.before letter
          @doWordWrap()
           */
      }
      return this.show();
    };

    TextCursor.prototype.handleInput = function(event) {
      var letter, text, _i, _len;
      text = this.hiddenTextArea.val();
      for (_i = 0, _len = text.length; _i < _len; _i++) {
        letter = text[_i];
        this.element.before(letter);
      }
      this.hiddenTextArea.val('');
      this.doWordWrap();
      return this.show();
    };

    TextCursor.prototype.handleClick = function(event) {
      var checkAbsolute, checkRelative, findInLine, findInPage, findInParagraph, findInWord, obj, self, target, x, y, _ref;
      _ref = [event.clientX, event.clientY], x = _ref[0], y = _ref[1];
      target = $(event.target);
      self = this;
      checkRelative = (function(_this) {
        return function(element) {
          var pos;
          pos = element.offset();
          pos.bottom = pos.top + element.height();
          if (y >= pos.top && y <= pos.bottom) {
            return true;
          }
          return false;
        };
      })(this);
      checkAbsolute = (function(_this) {
        return function(element) {
          var pos;
          pos = element.offset();
          pos.bottom = pos.top + element.height();
          pos.right = pos.left + element.width();
          if (x >= pos.left && x <= pos.right && y >= pos.top && y <= pos.bottom) {
            return true;
          }
          return false;
        };
      })(this);
      findInWord = (function(_this) {
        return function(word) {
          var node, range, rect, _i, _len, _ref1, _results;
          _ref1 = word[0].childNodes;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            node = _ref1[_i];
            range = document.createRange();
            range.selectNode(node);
            rect = range.getClientRects()[0];
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
              self.currentWord = self.currentPage().parent.objectFromElement(word);
              $(node).before(self.element);
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      })(this);
      findInLine = (function(_this) {
        return function(line) {
          var child, word, _i, _len, _ref1, _results;
          if (x < line.children().first().offset().left) {
            word = line.children().first();
            self.currentWord = self.currentPage().parent.objectFromElement(word);
            return word.prepend(self.element);
          } else if (x > line.children().last().offset().left + line.children().last().width()) {
            word = line.children().last();
            self.currentWord = self.currentPage().parent.objectFromElement(word);
            return word.append(self.element);
          } else {
            _ref1 = line.children();
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              child = _ref1[_i];
              child = $(child);
              if (checkAbsolute(child)) {
                findInWord(child);
                break;
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }
        };
      })(this);
      findInParagraph = (function(_this) {
        return function(paragraph) {
          var child, _i, _len, _ref1, _results;
          _ref1 = paragraph.children();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            child = _ref1[_i];
            child = $(child);
            if (checkRelative(child)) {
              findInLine(child);
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      })(this);
      findInPage = (function(_this) {
        return function(page) {
          var child, first, last, word, _i, _len, _ref1, _results;
          last = page.children().last();
          if (y > last.position().top + last.height()) {
            word = last.children().last().children().last();
            word.append(_this.element);
            _this.currentWord = _this.document.objectFromElement(word);
            return;
          }
          first = page.children().first();
          if (y < first.position().top) {
            word = first.children().first().children().first();
            word.prepend(_this.element);
            _this.currentWord = _this.document.objectFromElement(word);
            return;
          }
          _ref1 = page.children();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            child = _ref1[_i];
            child = $(child);
            if (checkRelative(child)) {
              findInParagraph(child);
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      })(this);
      obj = this.document.objectFromElement(target);
      if (obj instanceof Poe.Page) {
        findInPage(target);
      } else if (obj instanceof Poe.Paragraph) {
        findInParagraph(target);
      } else if (obj instanceof Poe.Line) {
        findInLine(target);
      } else if (obj instanceof Poe.Word) {
        findInWord(target);
      }
      this.textStyle.update(this.currentWord);
      this.paragraphStyle.update(this.currentParagraph());
      return this.show();
    };


    /*
    Callback registered with {Poe.ParagraphStyle} that will update the whole
    paragraph's alignment.
     */

    TextCursor.prototype.paragraphStyleChanged = function(style) {
      return this.show();
    };


    /*
    Moves the cursor inside and at the front of word
    @param word [Poe.Word] the word to move it inside
    @throws [Error] if the word is not a Poe.Word
    @return [Poe.TextCursor] this
     */

    TextCursor.prototype.moveInside = function(word) {
      if (!word instanceof Poe.Word) {
        throw new Error('Can only move inside a Poe.Word');
      }
      word.prepend(this.element);
      this.currentWord = word;
      this.show();
      return this;
    };


    /*
    Shows the cursor if it is hidden and sets a time to make the cursor blink if
    it is not already.
    @return [Poe.TextCursor] this
     */

    TextCursor.prototype.show = function() {
      var pos;
      this.update();
      if (Poe.writer) {
        if (this.currentParagraph() instanceof Poe.List) {
          Poe.writer.toolbar.setToolBar(Poe.ToolBar.DynamicPart.List);
        } else if (this.currentParagraph() instanceof Poe.Paragraph) {
          Poe.writer.toolbar.setToolBar(Poe.ToolBar.DynamicPart.Paragraph);
        }
      }
      this.visibleCursor.removeClass('hide');
      pos = this.element.position();
      if (pos.top > window.innerHeight - (this.currentLine().height() * 3)) {
        $('.writer').animate({
          scrollTop: $('.writer').scrollTop() + (this.currentLine().height() * 3)
        }, 200);
      }
      if (this.blinkTimer) {
        return;
      }
      this.blinkTimer = setInterval(this.blink, 700);
      this.hiddenTextArea.focus();
      return this;
    };


    /*
    Hides the cursor if it is visible and stops it from blinking.
    @return [Poe.TextCursor] this
     */

    TextCursor.prototype.hide = function() {
      clearInterval(this.blinkTimer);
      this.blinkTimer = null;
      this.visibleCursor.addClass('hide');
      return this;
    };


    /*
    Controls the actual blinking of the cursor. See show()
    @private
     */

    TextCursor.prototype.blink = function() {
      return this.visibleCursor.toggleClass('hide');
    };

    return TextCursor;

  })();

}).call(this);

//# sourceMappingURL=TextCursor.js.map