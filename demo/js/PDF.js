// Generated by CoffeeScript 1.8.0

/*
PDF Generator for {Poe.Document} using PDFKit
@see http://pdfkit.org/docs/getting_started.html
@see http://pdfkit.org/
 */

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Poe.PDF = (function() {

    /*
    	Creates a PDF writer
    
    	@param document [Poe.Document] the document that will be used to generate
    	the pdf
     */
    function PDF(document) {
      this.finalize = __bind(this.finalize, this);
      this.generate = __bind(this.generate, this);
      this.document = document;
      this.margins = {
        top: this.document.margins.top * 0.75,
        bottom: this.document.margins.bottom * 0.75,
        left: this.document.margins.left * 0.75,
        right: this.document.margins.right * 0.75
      };
      this.lastWordPos = {
        top: this.margins.top,
        left: this.margins.left
      };
      this.formatting = {};
      this.totalPos = null;
    }


    /*
    	Create the PDF and open the blob created in a new window of the browser.
    	@return [Poe.PDF] this
     */

    PDF.prototype.generate = function() {
      var page, _i, _len, _ref;
      this.doc = new PDFDocument;
      this.stream = this.doc.pipe(blobStream());
      this.stream.on('finish', this.finalize);
      this.registeredFonts = [];
      _ref = this.document.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        page = _ref[_i];
        this.generatePage(false, page);
      }
      this.doc.end();
      return this;
    };


    /*
    	Generate a paragraph in the PDF. This is an internal method used
    	for generating the pdf.
    	@param paragraph [Poe.Paragraph] the paragraph to use
    	@see Poe.PDF#generate
     */

    PDF.prototype.generateParagraph = function(paragraph) {
      var line, pstyle, _i, _len, _ref;
      _ref = paragraph.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        pstyle = new Poe.ParagraphStyle();
        pstyle.update(paragraph);
        this.formatting.align = pstyle.align;
        this.generateLine(line);
      }
      return this;
    };


    /*
    	Generate a line in the PDF. This is an internal method used for generating the PDF.
    
    	@param line [Poe.Line] the line to use
     */

    PDF.prototype.generateLine = function(line) {
      var cont, linepos, textStyle, word, wordpos, _i, _len, _ref;
      this.doc.x = 72;
      _ref = line.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        word = _ref[_i];
        textStyle = new Poe.TextStyle();
        textStyle.update(word);
        this.doc.fontSize(textStyle.fontSize);
        if (!this.registeredFonts.contains(textStyle.font)) {
          console.log("PDF: Registering '" + textStyle.font + "' as a font.");
          this.doc.registerFont(textStyle.font, Poe.Fonts[textStyle.font], textStyle.font);
          this.registeredFonts.push(textStyle.font);
        }
        this.doc.font(textStyle.font);
        if (word === line.children.first() && this.formatting.align !== 'left') {
          wordpos = word.position();
          linepos = line.position();
          this.doc.x = ((wordpos.left - linepos.left) * 0.75) + this.margins.left;
          console.log("px: " + (wordpos.left - linepos.left));
          console.log("x: " + this.doc.x);
        }
        cont = true;
        if (word === line.children.last()) {
          cont = false;
        }
        if (textStyle.italic) {
          this.doc.save();
          this.doc.transform(1, 0, Math.tan(-10 * Math.PI / 180), 1, 0, 0);
        }
        this.doc.fillColor(textStyle.color).lineWidth(.05).strokeColor(textStyle.color).text(word.element[0].textContent, {
          continued: cont,
          underline: textStyle.underline,
          stroke: textStyle.bold,
          fill: true
        });
        if (textStyle.italic) {
          this.doc.restore();
        }
      }
      return this;
    };


    /*
    	Generate a page in the PDF. This is for internal use.
    	@param addPage [boolean] Defaults to false.
     */

    PDF.prototype.generatePage = function(addPage, page) {
      var paragraph, _i, _len, _ref;
      if (addPage == null) {
        addPage = false;
      }
      _ref = page.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        paragraph = _ref[_i];
        this.generateParagraph(paragraph);
      }
      if (page.index() !== this.document.children.length - 1) {
        return this.doc.addPage({
          margin: this.margins.top
        });
      }
    };


    /*
    	Finalizes the PDF by converting it to a blob url, and opening
    	the url in the browser.
    
    	@note It seems only chrome is able to recognize the blob url as pdf and
    	allow the user to view it inside the browser. Firefox downloads it, and the 
    	others just completely ignore it.
     */

    PDF.prototype.finalize = function() {
      var blob, w;
      blob = this.stream.toBlobURL('application/pdf');
      w = window.open(blob);
      return w.focus();
    };

    return PDF;

  })();

}).call(this);

//# sourceMappingURL=PDF.js.map
