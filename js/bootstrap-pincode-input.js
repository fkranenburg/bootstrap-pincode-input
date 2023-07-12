/* =========================================================
 * bootstrap-pincode-input.js
 *
 * =========================================================
 * Created by Ferry Kranenburg
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

; (function ($, window, document, undefined) {

	"use strict";


	// Create the defaults once
	let pluginName = "pincodeInput";
	let defaults = {
		placeholders: undefined,						// seperate with a " "(space) to set an placeholder for each input box
		inputs: 4,									    // 4 input boxes = code of 4 digits long
		hidedigits: true,								// hide digits
		pattern: '[0-9]*',
		inputtype: 'number',
		inputmode: 'numeric',
		inputclass: '',									// add custom class to input tag
		characterwidth: null, 		// em width of PIN character; defaults to 0.54 (em width of a typical digit), or 0.4 if digits are hidden
		keydown: function (e) {
		},
		change: function (input, value, inputnumber) {		// callback on every input on change (keyup event)
			//input = the input textbox DOM element
			//value = the value entered by user (or removed)
			//inputnumber = the position of the input box (in touch mode we only have 1 big input box, so always 1 is returned here)
		},
		complete: function (value, e, errorElement) {	// callback when all inputs are filled in (keyup event)
			//value = the entered code
			//e = last keyup event
			//errorElement = error span next to to this, fill with html e.g. : $(errorElement).html("Code not correct");
		}

	};

	// The actual plugin constructor
	function Plugin(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {
		init: function () {
			this.buildInputBoxes();

		},
		updateOriginalInput: function () {
			let newValue = "";
			$('.pincode-input-text', this._container).each(function (index, value) {
				newValue += $(value).val().toString();
			});
			$(this.element).val(newValue);

			if (newValue.length !== this.settings.inputs) {
				$('.pincode-input-text', this._container).removeClass("filled");
			}
		},
		check: function () {
			let isComplete = true;
			let code = "";
			$('.pincode-input-text', this._container).each(function (index, value) {
				code += $(value).val().toString();
				if (!$(value).val()) {
					isComplete = false;
				}
			});

			if (this._isTouchDevice()) {
				// check if single input has it all
				if (code.length == this.settings.inputs) {
					return true;
				}
			} else {
				return isComplete;
			}


		},
		buildInputBoxes: function () {
			this._container = $('<div />').addClass('pincode-input-container');


			let currentValue = [];
			let placeholders = [];
			let touchplaceholders = "";  // in touch mode we have just 1 big input box, and there is only 1 placeholder in this case

			if (this.settings.placeholders) {
				console.log(this.settings.placeholders)
				placeholders = this.settings.placeholders.split(" ");
				touchplaceholders = this.settings.placeholders.replace(/ /g, "");
			}

			// If we do not hide digits, we need to include the current value of the input box
			// This will only work if the current value is not longer than the number of input boxes.
			if (this.settings.hidedigits == false && $(this.element).val() != "") {
				currentValue = $(this.element).val().split("");
			}

			// make sure this is the first password field here
			if (this.settings.hidedigits) {
				this._pwcontainer = $('<div />').css("display", "none").appendTo(this._container);
				this._pwfield = $('<input>').attr({
					'type': this.settings.inputtype,
					'pattern': this.settings.pattern,
					'inputmode': this.settings.inputmode,
					'id': 'preventautofill',
					'autocomplete': 'off'
				}).addClass('pincode-input-text-masked').appendTo(this._pwcontainer);
			}

			if (this._isTouchDevice()) {
				// set main class
				$(this._container).addClass("touch");

				// For touch devices we build a html table directly under the pincode textbox. The textbox will become transparent
				// This table is used for styling only, it will display how many 'digits' the user should fill in.
				// With CSS letter-spacing we try to put every digit visually insize each table cell.

				let wrapper = $('<div />').addClass('touchwrapper touch' + this.settings.inputs).appendTo(this._container);
				let input = $('<input>').attr({
					'type': this.settings.inputtype,
					'pattern': this.settings.pattern,
					'inputmode': this.settings.inputmode,
					'placeholder': touchplaceholders,
					'maxLength': this.settings.inputs,
					'autocomplete': 'off'
				}).addClass(this.settings.inputclass + ' form-control pincode-input-text').appendTo(wrapper);

				// calculate letter-spacing in Javascript since this isn't possible in CSS
				let inputs = this.settings.inputs;
				let digitEms = this.settings.characterwidth || (this.settings.hidedigits ? 0.4 : 0.54);
				setTimeout(function () {
					let digitWidth = parseFloat(getComputedStyle(input[0]).fontSize) * digitEms;
					let checkInterval = setInterval(function () {
					  if (input[0].offsetWidth !== 0) {
						clearInterval(checkInterval);
						let spaceWidth = input[0].offsetWidth / inputs;
						console.log(input[0].offsetWidth);
						let spaceBetweenChars = spaceWidth - digitWidth ;
						$(input).css({
						  marginLeft: spaceWidth / 2,
						  width: "100%",
						  letterSpacing: spaceBetweenChars + "px"
						});
					  }
					}, 100);
				  }, 0);



				let touchtable = $('<div>').addClass('touch-flex').appendTo(wrapper);
				// create touch background elements (for showing user how many digits must be entered)
				for (let i = 0; i < this.settings.inputs; i++) {
					if (i == (this.settings.inputs - 1)) {
						$('<div/>').addClass('touch-flex-cell').addClass('last').appendTo(touchtable);
					} else {
						$('<div/>').addClass('touch-flex-cell').appendTo(touchtable);
					}
				}
				if (this.settings.hidedigits) {
					// hide digits
					input.addClass('pincode-input-text-masked');
				} else {
					// show digits, also include default value
					input.val($(this.element).val());
				}

				// add events
				this._addEventsToInput(input, 1);

			} else {
				// for desktop mode we build one input for each digit
				let width = (100 / this.settings.inputs) + '%';
				for (let i = 0; i < this.settings.inputs; i++) {

					let input = $('<input>').attr({
						'type': 'text',
						'maxlength': "1",
						'autocomplete': 'off',
						'placeholder': (placeholders[i] ? placeholders[i] : undefined)
					}).addClass(this.settings.inputclass + ' form-control  pincode-input-text').appendTo(this._container);
					input.css({ width: width })
					if (this.settings.hidedigits) {
						// hide digits
						input.addClass('pincode-input-text-masked');
					} else {
						// show digits, also include default value
						input.val(currentValue[i]);
					}

					if (i == 0) {
						input.addClass('first');
					} else if (i == (this.settings.inputs - 1)) {
						input.addClass('last');
					} else {
						input.addClass('mid');
					}

					// add events
					this._addEventsToInput(input, (i + 1));
				}
			}

			// hide original element and place this before it
			$(this.element).css("display", "none");
			this._container.insertBefore(this.element);

			// error box
			this._error = $('<div />').addClass('text-danger pincode-input-error').insertBefore(this.element);

		},
		enable: function () {
			$('.pincode-input-text', this._container).each(function (index, value) {
				$(value).prop('disabled', false);
			});
		},
		disable: function () {
			$('.pincode-input-text', this._container).each(function (index, value) {
				$(value).prop('disabled', true);
			});
		},
		focus: function () {
			$('.pincode-input-text', this._container).first().select().focus();
		},
		clear: function () {
			$('.pincode-input-text', this._container).each(function (index, value) {
				$(value).val("");
			});
			this.updateOriginalInput();
		},
		_setValue: function (newValue, e) {

			// slice value
			let value = newValue.substring(0, this.settings.inputs);

			if (this._isTouchDevice()) {

				// update value
				$('.pincode-input-text', this._container).each(function (index, input) {
					$(input).val(value);
				});

				// update original input box
				this.updateOriginalInput();

				// oncomplete check
				if (this.check()) {
					this.settings.complete($(this.element).val(), e, this._error);
				}

			} else {

				let values = value.split('');

				$('.pincode-input-text', this._container).each(function (index, input) {
					$(input).val(values[index]);
				});

				// update original input box
				this.updateOriginalInput();

				// oncomplete check
				if (this.check()) {
					this.settings.complete($(this.element).val(), e, this._error);
				}

			}

		},
		_isTouchDevice: function () {
			// I know, sniffing is a really bad idea, but it works 99% of the times
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				return true;
			}
			// iPad Pro pretends to be a Mac, but Macs don't have touch controls
			if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) {
				return true;
			}
		},
		_addEventsToInput: function (input, inputnumber) {

			input.on('focus', $.proxy(function (e) {
				if (this._isTouchDevice()) {
					this._setValue("", e)  //always empty when we re-focus
				}
				input.select();  // automatically select current value
			}, this));

			// paste event should call onchange and oncomplete callbacks
			input.on('paste', $.proxy(function (e) {
				e.preventDefault();

				let clipboardData = (e.originalEvent || e).clipboardData || window.clipboardData;
				let pastedData = clipboardData.getData('text/plain');

				this._setValue(pastedData, e);

			}, this));

			input.on('keydown', $.proxy(function (e) {
				if (this._pwfield) {
					// Because we need to prevent password saving by browser
					// remove the value here and change the type!
					// we do this every time the user types
					$(this._pwfield).attr({ 'type': 'text' });
					$(this._pwfield).val("");
				}

				// prevent more input for touch device (we can't limit it)
				if (this._isTouchDevice()) {
					if (e.keyCode == 8 || e.keyCode == 46) {
						// do nothing on backspace and delete
					} else if ($(this.element).val().length == this.settings.inputs) {
						e.preventDefault();
						e.stopPropagation();
					} else if ($(this.element).val().length == (this.settings.inputs - 1)) {
						$(e.currentTarget).addClass("filled");
					}

				} else {
					// in desktop mode, check if an number was entered

					if (!(e.keyCode == 8                            // backspace key
						|| e.keyCode == 9							// tab key
						|| e.keyCode == 46                          // delete key
						|| (e.keyCode >= 48 && e.keyCode <= 57)     // numbers on keyboard
						|| (e.keyCode >= 96 && e.keyCode <= 105)    // number on keypad
						|| (e.ctrlKey || e.metaKey) // paste
						|| ((this.settings.inputtype != 'number' && this.settings.inputtype != 'tel') && e.keyCode >= 65 && e.keyCode <= 90))   // alphabet
					) {
						e.preventDefault();     // Prevent character input
						e.stopPropagation();
					}

				}

				this.settings.keydown(e);
			}, this));

			input.on('keyup', $.proxy(function (e) {
				// after every keystroke we check if all inputs have a value, if yes we call complete callback
				if (!this._isTouchDevice()) {
					// on backspace or delete go to previous input box
					if (e.keyCode == 8 || e.keyCode == 46) {
						// goto previous
						$(e.currentTarget).prev().select();
						$(e.currentTarget).prev().focus();
					} else if ($(e.currentTarget).val() != "") {
						$(e.currentTarget).next().select();
						$(e.currentTarget).next().focus();
					}
				}

				// update original input box
				this.updateOriginalInput();

				// onchange event for each input
				if (this.settings.change) {
					this.settings.change(e.currentTarget, $(e.currentTarget).val(), inputnumber);
				}

				if (this._isTouchDevice()) {
					if (e.keyCode == 8 || e.keyCode == 46) {
						// do nothing on backspace and delete
					} else if ($(this.element).val().length == this.settings.inputs) {
						$(e.currentTarget).blur();
					}
				}

				// oncomplete check
				if (this.check()) {

					if (this._isTouchDevice()) {
						// oncomplete callback is fired 100ms after above 'blur' event
						setTimeout($.proxy(function () {
							this.settings.complete($(this.element).val(), e, this._error);
						}, this), 100);
					} else {
						this.settings.complete($(this.element).val(), e, this._error);
					}
				}

			}, this));


		}


	});

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);
