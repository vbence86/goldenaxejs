var U = window.U || {};
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
