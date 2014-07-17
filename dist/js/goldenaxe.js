var U = (function(U){
	var i;
	// game scene elements
	U.Scenes = {
		loadingSceneId: "loading-scene",
		gameSceneId: "game-scene"
	};

	return U;

})(window.U || {});;var U = window.U || {};
U.Toolkit = U.Toolkit || (function(){

	/** ---------------------------------------------------------------	**/
	/** Inharitable event dispatcher object 							**/
	/** ---------------------------------------------------------------	**/
	function EventDispatcher(){
		this.events = {};
	}
	EventDispatcher.prototype.events = {};
	EventDispatcher.prototype.addEventListener = function(type, listener){
		if (!this.events[type])
			this.events[type] = [];
		this.events[type].push(listener);
		return this;
	};
	EventDispatcher.prototype.removeEventListener = function(type, listener){
		if (!this.events[type])
			return this;
		var index = this.events[type].indexOf(listener);
		if (!this.events[type][index])
			return this;
		this.events[type].splice(index, 1);
		return this;
	};
	EventDispatcher.prototype.dispatch = function(type, event){
		if (!this.events[type])
			return;
		for (var i in this.events[type]){
			if (typeof this.events[type][i] === 'function'){
				this.events[type][i](event);
			} else if (typeof this.events[type][i] === 'object'){
				this.events[type][i][1].call(
					this.events[type][i][0],
					event
				);
			}
		}
	};

	return {

		// exposing the EventDispatcher object
		EventDispatcher: EventDispatcher,

	};

})();;var U = window.U || {};
// Decorating the CreateJS.LoadQueue object
U.PreLoader = (function(){

	var PreLoader = function(manifest){

		var	loader;

		return {

			loadAll: function(){
				var defer = function(promise){

					loader = new createjs.LoadQueue(false);
					loader.addEventListener("complete", promise);
					loader.loadManifest(manifest);	

				};

				return {
					then: function(callback){
						if ('function' !== typeof callback){
							return;
						}
						defer(callback);
					}
				};
			},

			getResult: function(id){
				return loader.getResult(id);
			}

		};

	};

	return {

		create: function(manifest){
			if ("object" !== typeof manifest){
				throw "Invalid manifest object has been passed!";
			}

			return new PreLoader(manifest);
		}

	};

})();;var U = window.U || {};
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

})(Modernizr, U, window);;var U = window.U || {};
// Using dependecy injection to expose which modules we need to build up
// this module
U.Game = (function(){
	
	var // main stage of the game
		stage = new createjs.Stage("game-canvas"),

		// decorator object for createjs.LoadQueue
		// which is responsible for the preloading process
		preloader = U.PreLoader.create([
			{ src: "img/AxBattlerGA1.gif", id: "AxBattler" }
		]),

		// handles frame request
		tick = function(event){
			stage.update();
		},

		// switches between the defined scenes by passing the id of the 
		// container element
		switchToScene = (function(){
			var current;
			return function(sceneId){
				if (!sceneId){
					return;
				}
				if (current){
					$("#" + current).removeClass("shown");
				}
				$("#" + sceneId).addClass("shown");
				current = sceneId;
			};
		})();

	return U.Game || {

		init: function(){

			preloader.loadAll().then(function(){
				switchToScene(U.Scenes.gameSceneId);
				this.start();
			});
			
		},

		start: function(){

			createjs.Ticker.timingMode = createjs.Ticker.RAF;
			createjs.Ticker.setFPS(60);
			createjs.Ticker.addEventListener("tick", tick);

		}

	};
		
})();
;(function(U, toolkit, game, window, document, undefined){

	// adding entry point to initialise the game components
	window.addEventListener('load', function(){

		game.init();

	});

})(U, U.Toolkit, U.Game, window, window.document);