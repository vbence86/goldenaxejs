(function(U, toolkit, game, window, document, undefined){

	var gameStarted = false;

	// adding entry point to initialise the game components
	window.addEventListener('load', function(){

		game.init()
			.start();

		gameStarted |= 1;

	});

})(U, U.Toolkit, U.Game, window, window.document);