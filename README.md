# Bootstrap pincode-input
Bootstrap jQuery widget for x-digit pincode input

You only need a &lt;input type="text"&gt; and Bootstrap.

After entering a pincode the value will be updated in the original textbox.
It supports a callback after all digits are entered and backspace is allowed.
See Usage below this page to find out all parameters

For touch devices there will be only one input tag created. With the supplied CSS it will look like the user is inputting a code in multiple input boxes.


# Demo

A demo can be found at [fkranenburg.github.io/bootstrap-pincode-input][site]

[site]: http://fkranenburg.github.io/bootstrap-pincode-input


![screenshot](https://raw.github.com/fkranenburg/bootstrap-pincode-input/master/example.jpg)

# Installation

You can install bootstrap-pincode-input by using [Bower](http://bower.io/).

```bash
bower install bootstrap-pincode-input
```
Or you can install it through [npm](https://www.npmjs.com/):

```
npm install --save bootstrap-pincode-input
```

## Usage

### inputs
Number.  Default: `0`

Length of to be entered code. For every digit a input box will be created and visibile for the user.

```html
<input type="text" name="mycode" id="pincode-input1">
```
This function will create, for example, an input box with 4 digits.
```javascript
$('#pincode-input1').pincodeInput({inputs:4});
```



### placeholders
String. Default: ```null```

Place placeholders in every input. Make sure you define a placeholder for each input seperated with a ```space```.
For example an input with 3 digits, placeholders are defined like ```1 2 3```.

```html
<input type="text" name="mycode" id="pincode-input1">
```

```javascript
$('#pincode-input1').pincodeInput({inputs:2,placeholders:"0 0 0"});
```

### hidedigits
Boolean. Default: ```true```

By default entered digits are hidden visually (like a password input) for the user.
This can be overriden by setting this to ```false```.

```html
<input type="text" name="mycode" id="pincode-input1">
```

```javascript
$('#pincode-input1').pincodeInput({inputs:4,hidedigits:false});
```


### keydown
@deprecated since 1.3.0 -> will be removed in a later release. Use change event instead.

Callback function for keydown event for each input box. The ```keydown``` event is passed to the callback.


```javascript
$('#pincode-input1').pincodeInput({keydown:function(e){
  console.log("keydown event fired!",e);
});
```


### change
Callback function for each input box after user enters or removes a digit.
The following parameters are passed to the given function.

* ```input``` Element. the DOM input element where user changed a digit.
* ```value``` String. the value entered
* ```inputnumber``` Number. returns the 'position' of the current input. 


```javascript
   $('#pincode-input1').pincodeInput({inputs:4,change: function(input,value,inputnumber){
       console.log("onchange from input number "+inputnumber+", current value: " + value, input);
    }});
```


### complete
Callback function when all input boxes have a value (user has entered the full code).
The following parameters are passed to the given function.

* ```value``` String. complete given code as a string.
* ```event``` Event. the last 'keydown' event from last inputbox.
* ```errorElement``` Element. returns the error element where you can put a custom error message for the user, for example the code is invalid.


```javascript
      $('#pincode-input1').pincodeInput({inputs:6,complete:function(value, e, errorElement){
          console.log("code entered: " + value);
          
          /*do some code checking here*/
          
          $(errorElement).html("I'm sorry, but the code not correct");
        }});
```



# License

This plugin is available under the [Apache 2.0 license]:
 https://www.apache.org/licenses/LICENSE-2.0

Created by Ferry Kranenburg
