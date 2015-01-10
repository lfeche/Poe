// Generated by CoffeeScript 1.8.0
(function() {
  var SaveToDisk,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  SaveToDisk = function(blobURL, fileName) {
    var reader;
    reader = new FileReader();
    reader.readAsDataURL(blobURL);
    return reader.onload = function(event) {
      var save;
      save = document.createElement('a');
      save.href = event.target.result;
      save.target = '_blank';
      save.download = fileName || 'unknown file';
      event = document.createEvent('Event');
      event.initEvent('click', true, true);
      save.dispatchEvent(event);
      return (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
  };

  Poe.DocxWriter = (function() {
    function DocxWriter(poeDocument) {
      this.generate = __bind(this.generate, this);
      this.document = poeDocument;
      this.doc = new officegen('docx');
      $('body').keydown(this.generate);
      this.paragraphStyle = new Poe.ParagraphStyle();
      this.textStyle = new Poe.TextStyle();
      this.currentParagraph = null;
      this.currentPoeParagraph = null;
    }

    DocxWriter.prototype.generate = function(event) {
      var page, stream, _i, _len, _ref;
      if (event.keyCode !== 27) {
        return;
      }
      this.doc = new officegen('docx');
      this.stream = blobStream();
      stream = this.stream;
      _ref = this.document.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        page = _ref[_i];
        this.generatePage(page);
      }
      this.doc.generate(this.stream);
      return this.stream.on('finish', (function(_this) {
        return function(written) {
          var url;
          console.log(stream);
          url = stream.toBlob('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
          return SaveToDisk(url, "document.docx");
        };
      })(this));
    };

    DocxWriter.prototype.generatePage = function(page) {
      var paragraph, _i, _len, _ref, _results;
      _ref = page.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        paragraph = _ref[_i];
        this.paragraphStyle.update(paragraph);
        this.currentParagraph = this.doc.createP();
        this.currentPoeParagraph = paragraph;
        this.currentParagraph.options.align = this.paragraphStyle.align;
        _results.push(this.generateParagraph(paragraph));
      }
      return _results;
    };

    DocxWriter.prototype.generateParagraph = function(paragraph) {
      var line, _i, _len, _ref, _results;
      _ref = paragraph.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (line.children.length === 1 && line.child(0).element[0].textContent.charCodeAt(0) === 8203) {
          continue;
        }
        _results.push(this.generateLine(line));
      }
      return _results;
    };

    DocxWriter.prototype.generateLine = function(line) {
      var text, word, _i, _len, _ref, _results;
      _ref = line.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        word = _ref[_i];
        this.textStyle.update(word);
        text = word.element[0].textContent;
        text = text.replace(/[\u200B-\u200D\uFEFF]/g, '');
        console.log(this.textStyle.color.replace('#', ''));
        _results.push(this.currentParagraph.addText(text, {
          color: this.textStyle.color.replace('#', ''),
          bold: this.textStyle.bold,
          italic: this.textStyle.italic,
          underline: this.textStyle.underline,
          font_face: this.textStyle.font,
          font_size: this.textStyle.fontSize
        }));
      }
      return _results;
    };

    return DocxWriter;

  })();

}).call(this);

//# sourceMappingURL=DocxWriter.js.map
