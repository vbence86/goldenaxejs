var U = window.U || {};
// Using dependecy injection to expose which modules we need to build up
// this module
U.Game = (function(){
	
	var i, j,

		/** ------------------------------------------------------- **/
		/** GAME STAGE 												**/
		/** ------------------------------------------------------- **/
		// main stage of the game
		stage = new createjs.Stage("game-canvas"),


		/** ------------------------------------------------------- **/
		/** INIT GAME 												**/
		/** ------------------------------------------------------- **/
		setupObjects = function(){

		},

		/** ------------------------------------------------------- **/
		/** GAME LOOP 												**/
		/** ------------------------------------------------------- **/
		// starting main game loop and registering a tick function
		startGameLoop = function(){
			createjs.Ticker.timingMode = createjs.Ticker.RAF;
			createjs.Ticker.setFPS(60);
			createjs.Ticker.addEventListener("tick", tick);
		},

		// handles frame request
		tick = function(event){
			tickAllObjects(event);
			stage.update(event);
		},

		// calling the tick function of all the registered objects
		tickAllObjects = function(event){
			var objects = U.Objects.getObjects();
			for (var i = objects.length - 1; i >= 0; i--) {
				objects[i].tick(event);
			}
		};

	return {

		init: function(){

			var that = this;

			U.getPreloader()
			 .loadAll()
			 .then(function(){
				U.switchToScene(U.Scenes.gameSceneId);
				(that || U.Game).start();
			 });

			U.UIHandler.attach();
			
		},

		start: function(){

			setupObjects();
			startGameLoop();
		},

		// exposing the main stage so that we can reference to it 
		// outside from the Game scope
		getStage: function(){
			return stage;
		}

	};
		
})();
