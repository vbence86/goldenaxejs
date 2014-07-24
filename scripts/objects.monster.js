var U = window.U || {};
U.Objects = U.Objects || {};

U.Objects.Monster = (function () {

	function Monster() {
		this.initialize();
	}

	var p = Monster.prototype = new createjs.Container();

	// public properties:
	p.shape = null;

	// velocity values
	p.vX = null;
	p.vY = null;

	// constructor:
	p.Container_initialize = p.initialize;	//unique to avoid overiding base class

	p.createSprite = function(spriteSheet){
		this.shape = new createjs.Sprite(spriteSheet);
		this.addChild(this.shape);
	};

	p.initialize = function(spriteSheet){
		this.Container_initialize();

		this.createSprite(spriteSheet);

		this.vX = 0;
		this.vY = 0;
	};

	p.appendTo = function(stage){
		if (!stage || !stage.addChild){
			throw "Invalid stage object given as a parameter!";
		}
		stage.addChild(this);
	};

	p.tick = function (event) {
		//move by velocity
		this.x += this.vX * event.delta;
		this.y += this.vY * event.delta;
	};

	return Monster;

}());