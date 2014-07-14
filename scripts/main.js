(function(U, toolkit, game, window, document, undefined){

	this.switchToScene = (function(){
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

	// adding entry point to initialise the game components
	window.addEventListener('load', function(){

		// the initialisation process is async as it uses
		// XHR or XHR2 if it's available to preload the pointed resources
		game.init(function(){
			game.start();
			console.log("Game has been started...");
		});


	});

})(U, U.Toolkit, U.Game, window, window.document);