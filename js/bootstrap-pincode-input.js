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
    //private variables
    var $element; 
    var $container;
    var $error;
    
    var defaults = {
    	inputs:4,									    // 4 input boxes = code of 4 digits long
    	keydown : function(e){},
        complete : function(value, e, errorElement){// callback when all inputs are filled in (keyup event)
    		//value = the entered code
    		//e = last keyup event
    		//errorElement = error span next to to this, fill with html e.g. : $(errorElement).html("Code not correct");
    	}	
    };
    
    
    var methods = {
        init : function(options) {
        	 $element = $(this);
        	 $element.settings = $.extend({}, defaults, options);
        	 
        	 buildInputBoxes();   
        },
        focus: function() {
        	$('input.pincode-input-text',$container).first().select().focus();
        },
        clear:function(){
        	$('input.pincode-input-text',$container).each(function( index, value ) {
        		$(value).val("");
        	});
        	updateOriginalInput();
        }
    };


    //Private Methods

    var buildInputBoxes = function(){
        //public variables
       
    	
    	$container = $('<div />').addClass('pincode-input-container');

    	for (var i = 0; i < $element.settings.inputs; i++) {
    		$input = $('<input>').attr({'type':'text','maxlength':"1"}).addClass('form-control pincode-input-text').appendTo($container);
    		if(i==0){
    			$input.addClass('first');
    		}else if(i==($element.settings.inputs-1)){
    			$input.addClass('last');
    		}else{
    			$input.addClass('mid');
    		}

    		$input.on('keydown', function(e){
    			$element.settings.keydown(e);
            });

    		$input.on('keyup', function(e){
    			// after every keystroke we check if all inputs have a value, if yes we call complete callback
    			
    			// on backspace go to previous input box
    			if($(e.currentTarget).val()!=""){
    				$(e.currentTarget).next().select();
					$(e.currentTarget).next().focus();
				}
      			
    			if(check()){
    				updateOriginalInput();
    				$element.settings.complete($($element).val(), e, $error);
    			}
            });
    		
    	}
    	
    	// error box
    	$error = $('<div />').addClass('text-danger pincode-input-error').appendTo($container);

    	//hide original element and place this before it
        $element.css( "display", "none" );
        $($container).insertBefore($($element));
        $element.attr('_pincodeContainer', $container);
        $element.attr('_pincodeError', $error);
    	
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
                
    $.fn.pincodeInput = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.pincodeInput' );
        }    
    };
})(jQuery);