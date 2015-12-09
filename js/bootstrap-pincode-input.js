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

;(function ( $, window, document, undefined ) {

	"use strict";


		// Create the defaults once
		var pluginName = "pincodeInput";
		var defaults = {
		    	inputs:4,									    // 4 input boxes = code of 4 digits long
		    	hideDigits:true,								// hide digits
		    	keydown : function(e){},
		        complete : function(value, e, errorElement){// callback when all inputs are filled in (keyup event)
		    		//value = the entered code
		    		//e = last keyup event
		    		//errorElement = error span next to to this, fill with html e.g. : $(errorElement).html("Code not correct");
		    	}	
		    };

		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
				init: function () {
					this.buildInputBoxes();
				},
		        updateOriginalInput:function(){
		        	var newValue = "";
		        	$('.pincode-input-text',this._container).each(function( index, value ) {
		        		newValue += $(value).val().toString();
		        	});
		        	$(this.element).val(newValue);
		        },
		        check: function(){
		        	var isComplete = true;
		        	$('.pincode-input-text',this._container).each(function( index, value ) {
		        		if(!$(value).val()){
		        			isComplete = false;
		        		}
		        	});
		            	
		        	return isComplete;
		        },				
				buildInputBoxes: function () {
					
		        	this._container = $('<div />').addClass('pincode-input-container');

		        	for (var i = 0; i <  this.settings.inputs; i++) {
		        		var input = $('<input>').attr({'type':'text','maxlength':"1"}).addClass('form-control pincode-input-text').appendTo(this._container);
		        		if( this.settings.hideDigits){
		        			input.attr('type','password');
		        		}
		        		
		        		if(i==0){
		        			input.addClass('first');
		        		}else if(i==(this.settings.inputs-1)){
		        			input.addClass('last');
		        		}else{
		        			input.addClass('mid');
		        		}

		        		input.on('keydown', $.proxy(function(e){
		        			 this.settings.keydown(e);
		                },this));

		        		input.on('keyup', $.proxy(function(e){
		        			// after every keystroke we check if all inputs have a value, if yes we call complete callback
		        			
		        			// on backspace go to previous input box
		        			if(e.keyCode == 8 || e.keyCode == 48){
		        				// goto previous
		        				$(e.currentTarget).prev().select();
		    					$(e.currentTarget).prev().focus();
		        			}else{
		        				if($(e.currentTarget).val()!=""){
		            				$(e.currentTarget).next().select();
		        					$(e.currentTarget).next().focus();
		        				}
		        			}
		        			
		        			          			
		        			if(this.check()){
		        				this.updateOriginalInput();
		        				this.settings.complete($(this.element).val(), e, this._error);
		        			}
		                },this));
		        		
		        	}
		        	
		        	// error box
		        	this._error = $('<div />').addClass('text-danger pincode-input-error').appendTo(this._container);

		        	//hide original element and place this before it
		        	$(this.element).css( "display", "none" );
		            this._container.insertBefore(this.element);
				},
				focus:function(){
					$('.pincode-input-text',this._container).first().select().focus();
				},
				clear:function(){
					 $('.pincode-input-text',this._container).each(function( index, value ) {
		         		$(value).val("");
		         	});
		         	this.updateOriginalInput();
				}
				
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );
