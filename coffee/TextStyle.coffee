###
Poe.TextStyle is the used to apply font and text styles
to Poe.Word. You can apply a style to a word by using
applyWord. In order to change the style without affecting the
the whole word, e.g. for new text, the style needs to know
what Poe.TextCursor to use. In that case you can pass it in
the constructor or use setTextCursor().
###
class Poe.TextStyle
  ###
  Construct new TextStyle.
  TextStyle is used to apply formatting to a Poe.Word.

  @param [Poe.TextCursor] textCursor text cursor for use with applyChar
  @note It only uses the text cursor when applyChar is called. If you do not need
  to apply change the style that cursor is typing text in, it is not neccessary
  ###
  constructor: (@textCursor) ->
    @bold = false
    @italic = false
    @underline = false
    @font = 'Tinos'
    @fontSize = 16 #Pixels
    @color = 'black' #css
    @backround = 'white'
    @changedCallbacks = []
    @currentWord = null

  ###
  Set the Poe.TextCursor used by applyChar
  @throw textCursor must be a Poe.TextCursor
  @param [Poe.TextCursor] textCursor the cursor
  @return [Poe.TextStyle] this
  ###
  setTextCursor: (textCursor) ->
    if not textCursor instanceof Poe.TextCursor
      throw new Error('textCursor must be a Poe.TextCursor')
    @textCursor = textCursor
    return this

  ###
  Copies style to this style
  @param [Poe.TextStyle] style the style to copy
  @return [Poe.TextStyle] this
  ###
  clone: (style) ->
    @bold = style.bold
    @italic = style.italic
    @underline = style.underline
    @font = style.font
    @fontSize = style.fontSize
    @color = style.color
    @background = style.background
    return this

  ###
  A helper that both applyWord and applyChar use
  @param [Boolean] wholeWord true to applyWord false to applyChar
  @param [Poe.Word] word the word to apply to. Only needed if using applyWord
  ###
  apply: (wholeWord = false, word = @currentWord) ->
    element = word.element

    if not wholeWord
      word = @textCursor.currentWord
      otherStyle = new Poe.TextStyle()
      otherStyle.update word
      lastWord = new Poe.Word()
      lastWord.insertAfter word
      while @textCursor.element.nextSibling()
        lastWord.element.append @textCursor.element.nextSibling()
      lastWord.prepend @textCursor.element

      middleWord = new Poe.Word()
      middleWord.insertAfter word

      if word.isEmpty()
        word.remove()
      if lastWord.isEmpty()
        lastWord.remove()
      else
        otherStyle.apply lastWord

      otherStyle = null
      element = middleWord.element
      word = middleWord
      element.prepend @textCursor.element
      @textCursor.currentWord = middleWord

    if @bold
      element.addClass 'bold'
    else
      element.removeClass 'bold'

    if @italic
      element.addClass 'italic'
    else
      element.removeClass 'italic'

    if @underilne
      element.addClass 'underline'
    else
      element.removeClass 'underline'

    apply = (style, value) ->
      element.css(style, value)

    apply 'font-family', '"' + @font + '"'
    apply 'font-size', "#{@fontSize}px"
    apply 'color', @color
    apply 'background-color', @background
    @currentWord = word

  ###
  Applies style so that any new text that is typed gets the style
  @return [Poe.TextStyle] this
  @note This requires a Poe.TextCursor to be known by the style. Use setTextCursor().
  @throw [Error] if there is no Poe.TextCursor to use
  ###
  applyChar: () ->
    if not @textCursor
      throw new Error('Poe.TextStyle.applyChar needs a textCursor')
    @apply false, @textCursor.currentWord
    return this

  ###
  Applies style to word. The whole word gets the style.
  This also calls any callbacks registered with changed.
  @param [Poe.Word] word word to apply style to
  @return [Poe.TextStyle] this
  ###
  applyWord: (word) ->
    @apply true, word
    return this

  ###
  Makes this style match the style that word has.
  @param [Poe.Word] word word to get styles from
  @return [Poe.TextStyle] this
  ###
  update: (word) ->
    element = word.element
    if not word or not element
      return

    if element.css('font-weight') == 'bold'
      @bold = true
    else
      @bold = false

    if element.css('font-style') == 'italic'
      @italic = true
    else
      @italic = false

    if element.css('text-decoration') == 'underline'
      @underline = true
    else
      @underline = false

    @font = element.css('font-family').split('"')[0]
    @fontSize = parseInt(element.css('font-size'))
    @color = element.css('color')
    @background = element.css('background-color')

    @currentWord = word
    for callback in @changedCallbacks
      callback this

    return this

  ###
  Register a callback to be called when the style changes
  @param [Function] callbackFn a function that takes one argument of type Poe.TextStyle
  @return [Poe.TextStyle] this
  ###
  changed: (callbackFn) ->
    if typeof(callbackFn) != 'function'
      throw new Error('Poe.TextStyle.changed expects one argument of type function')

    @changedCallbacks.append callbackFn
    return this
