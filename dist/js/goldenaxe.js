var U = window.U || {};
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

		// switches between the defined scenes by passing the id of the 
		// container element
		switchToScene: (function(){
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

		})()

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
// Using dependecy injection to expose which modules we need to build up
// this module
U.Game = (function(){
	
	var // decorator object for createjs.LoadQueue
		// which is responsible for the preloading process
		preloader = U.PreLoader.create([

			{ src: "img/AxBattlerGA1.gif", id: "AxBattler" }

		]),

		// main stage of the game
		stage = new createjs.Stage("game-canvas"),

		// handles frame request
		tick = function(event){

			stage.update();

		};

	return U.Game || {

		init: function(callback){

			preloader.loadAll().then(function(){
				if ("function" !== typeof callback){
					return;
				}
				callback();
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

	var i,

		// game scene elements
		loadingSceneId = "loading-scene",
		gameSceneId = "game-scene";

	// adding entry point to initialise the game components
	window.addEventListener('load', function(){

		// the initialisation process is async as it uses
		// XHR or XHR2 if it's available to preload the pointed resources
		game.init(function(){
			toolkit.switchToScene(gameSceneId);
			game.start();
		});


	});

})(U, U.Toolkit, U.Game, window, window.document);