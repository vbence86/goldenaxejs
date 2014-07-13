var U = window.U || {};
U.Game = (function(){
	
	var stage = new createjs.Stage("game-canvas"),
		circle = new createjs.Shape(),

		// handles frame request
		tick = function(event){

			circle.x = circle.x > 400 ? 0 : (circle.x + 0.1 * event.delta);
			stage.update();

		};

	return U.Game || {

		init: function(){

			circle.graphics.beginFill("red").drawCircle(0, 0, 40);
			circle.x = circle.y = 50;
			stage.addChild(circle);

			return this;
		},

		start: function(){

			createjs.Ticker.timingMode = createjs.Ticker.RAF;
			createjs.Ticker.setFPS(60);
			createjs.Ticker.addEventListener("tick", tick);

			return this;
		}

	};
		
})();