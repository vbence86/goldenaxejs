var U = window.U || {};
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
