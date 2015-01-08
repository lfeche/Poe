###
Toolbar for use with OS.js
###
self = null
Poe.OSjs.Toolbar = (poeWriter, win, name, opts) ->
	self = this
	@poe = poeWriter
	@window = win
	OSjs.GUI.ToolBar.apply(this, [name, opts])

Poe.OSjs.Toolbar.prototype = Object.create(OSjs.GUI.ToolBar.prototype)

Poe.OSjs.Toolbar.prototype.init = () ->
	el = OSjs.GUI.ToolBar.prototype.init.apply(this, ['PoeToolbar'])
	@setup()
	return el
###
Sets up the toolbar by creating the buttons, and registering event handlers.
###
Poe.OSjs.Toolbar.prototype.setup = () ->
	#A little helper for setting up the toolbar icons
	_createIcon = (icon) ->
		return OSjs.API.getThemeResource(icon, 'icon')

	@fontSizeSelect = new OSjs.GUI.Select("FontSizeSelect", {onChange: @fontSizeClicked})

	@addItem 'FontSizeSelect',
		type: 'custom'
		onCreate: (itemName, itemOpts, outerEl, containerEl) =>
			@window._addGUIElement(@fontSizeSelect, containerEl)

	@addItem 'bold',
		toggleable: true
		onClick: @poe.toolbarHelper.btnBoldClicked
		icon: _createIcon 'actions/format-text-bold.png'

	@addItem 'italic',
		toggleable: true
		onClick: @poe.toolbarHelper.btnItalicClicked
		icon: _createIcon 'actions/format-text-italic.png'

	@addItem 'underline',
		toggleable: true
		onClick: @poe.toolbarHelper.btnUnderlineClicked
		icon: _createIcon 'actions/format-text-underline.png'

	@addSeparator()

	@addItem 'alignLeft',
		toggleable: true
		onClick: @poe.toolbarHelper.btnAlignLeftClicked
		icon: _createIcon 'actions/format-justify-left.png'

	@addItem 'alignCenter',
		toggleable: true
		onClick: @poe.toolbarHelper.btnAlignCenterClicked
		icon: _createIcon 'actions/format-justify-center.png'

	@addItem 'alignRight',
		toggleable: true
		onClick: @poe.toolbarHelper.btnAlignRightClicked
		icon: _createIcon 'actions/format-justify-right.png'

	#Add the font sizes
	for size in @poe.toolbarHelper.fontSizes
		@fontSizeSelect.addItem size, size

	@fontSizeSelect.setValue '12'

	@render()

Poe.OSjs.Toolbar.prototype.fontSizeClicked = (selectRef, event, value) =>
	self.poe.toolbarHelper.fontSizeClicked value
	self.fontSizeSelect.setValue value
	sel = document.createAttribute("selected")
	event.target.setAttributeNode(sel)