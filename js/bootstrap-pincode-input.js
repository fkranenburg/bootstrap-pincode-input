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

(function($) {
    $.fn.pincodeInput = function(customsettings) {
        return this.each(function() {
            //private variables
            var $element = $(this); 
            var $container;
            

            var defaults = {
            	inputs:4,									// 4 input boxes = code of 4 digits long
            	
            	focus : function(e){},						// on input focus callback
            	keydown : function(e){},					// on keydown callback
            	blur : function(e){},						// on blur callback
            	complete : function(value, e){}				// callback when all inputs are filled in (keyup event)
            		
            };
    
            //public variables
            $element.settings = $.extend({}, defaults, customsettings);
   
    
            //Private Methods
            var init = function(){
            	buildInputBoxes();              
            };
            
            var buildInputBoxes = function(){
            	$container = $('<div />').attr('className', 'pincode-input-container');
            	
            	for (var i = 0; i < $element.settings.inputs; i++) {
            		$input = $('<input>').attr({'type':'number','min':0,'step':1}).addClass('form-control pincode-input-text').appendTo($container);
            		$input.on('focus', function(e){
            			$element.settings.focus(e);
                    });
            		$input.on('keydown', function(e){
            			$element.settings.keydown(e);
            			// on backspace go to previous input box
                    });
            		$input.on('blur', function(e){
            			$element.settings.blur(e);
                    });
            		$input.on('keyup', function(e){
            			// after every keystroke we check if all inputs have a value, if yes we call complete callback
            			if(check()){
            				updateOriginalInput();
            				$element.settings.complete($($element).val(), e);
            			}
                    });
            		
            	}
            	
            	//hide original element and place this before it
                $element.css( "display", "none" );
                $container.before($element);
            	
            };

            var showError = function(){
            	
            }
            var hideError = function(){
            	
            }
            
            var updateOriginalInput = function(){
            	var newValue = "";
            	$('input.pincode-input-text',$container).each(function( index, value ) {
            		newValue += $(value).val().toString();
            	});
            	$($element).val(newValue);
            }
            
            var check = function(){
            	var isComplete = true;
            	$('input.pincode-input-text',$container).each(function( index, value ) {
            		if(!$(value).val()){
            			isComplete = false;
            		}
            	});
            	
            	if(isComplete){
            		hideError();
            	}else{
            		showError();
            	}
              	            	
            	return isComplete;
            }
                        
            init();
    
            return this;
        });
    };
})(jQuery);