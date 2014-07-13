var U = window.U || (function(window, document, undefined){
	console.log("Game Universe has been created");
})(window, window.document);;var U = window.U || {};
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

})();;var U = window.U || {};
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
		
})();;(function(U, toolkit, game, window, document, undefined){

	var gameStarted = false;

	// adding entry point to initialise the game components
	window.addEventListener('load', function(){

		game.init()
			.start();

		gameStarted |= 1;

	});

})(U, U.Toolkit, U.Game, window, window.document);