(function(U, toolkit, game, window, document, undefined){

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