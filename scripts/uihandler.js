var U = window.U || {};
// Providing generic solution for handling user interactions.
// As the player will be able control the character either by using 
// the keyboard in dekstop mode or touching the virtual controls on 
// Mobiles, I have to provide a unified solution to register business 
// logic to the UI events. 
U.UIHandler = window.UIHandler || (function(Modernizr, U, window, undefined){

	var uiEvents = {
			37: { name: "left", pressed: false },
			39: { name: "right", pressed: false },
			38: { name: "up", pressed: false },
			40: { name: "down", pressed: false }
		},

		// handling keydown and keyup events
		handleKeyEvents = function(event){
			var evt = event || window.event,
				keyCode = evt.keyCode,
				uiEventObject = uiEvents[keyCode];

			if (!uiEventObject){
				return;
			}

			if ("keydown" === event.type){
				uiEventObject.pressed = true;
			} else if ("keyup" === event.type){
				uiEventObject.pressed = false;
			}
		},

		// reference to the game container to attach touch listeners
		gameScene;

	return {

		attach: function(){

			// touch devices
			if (Modernizr.touch){
				gameScene = $('#' + U.Scene.gameSceneId);
				gameScene.addEventListener("touchstart", handleTouchEvents);
				gameScene.addEventListener("touchend", handleTouchEvents);
			} else {
			// desktop devices
				window.addEventListener("keydown", handleKeyEvents);
				window.addEventListener("keyup", handleKeyEvents);
			}

		},

		isPressed: function(uiEvent){
			switch (uiEvent){
				case "left": return uiEvents["37"];
				case "right": return uiEvents["39"];
				case "up": return uiEvents["38"];
				case "down": return uiEvents["40"];
				default:
					return false;
			}
		}

	};

})(Modernizr, U, window);