// create or extend the U variable placed in the global scope
var U = (function(U){

	var i,

		// list of the files that are being preloaded during
		manifest = [
			{ src: "img/AxBattlerGA1.gif", id: "AxBattler" },
			{ src: "img/runningGrant.png", id: "grant"},
			{ src: "img/mountain_landscape_23.png", id: "tilesetSheet"},
			{ src: "data/mountain.json", id: "mountain.json"},
		],

		// updating the progress-bar in the loading-scene
		handleProgress = function(progress){
			$("#" + U.Scenes.loadingSceneId)
				.find("#progress-bar")
				.css({ width: progress * 100 + "%" });
		};

	// game scene elements
	U.Scenes = {
		loadingSceneId: "loading-scene",
		gameSceneId: "game-scene"
	};

	// switches between the defined scenes by passing the id of the 
	// container element
	U.switchToScene = (function(){
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

	// decorator object for createjs.LoadQueue
	// which is responsible for the preloading process
	U.getPreloader = (function(){

		var preloader;

		return function(){
			if (!preloader){
				preloader = U.PreLoader.create(manifest);
				preloader.progress(handleProgress);
			}
			return preloader;
		};

	})();

	// namespace for Ingame objects
	U.Objects = {};

	return U;

})(window.U || {});