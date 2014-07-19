var U = window.U || {};
U.Objects = U.Objects || {};

U.Objects.Monster = (function () {

	function Monster() {
		this.initialize();
	}

	var p = Monster.prototype = new createjs.Container();

	// public properties:
	p.monsterShape = null;

	// velocity values
	p.vX = null;
	p.vY = null;

	// parent object
	p.parent = null;

	// constructor:
	p.Container_initialize = p.initialize;	//unique to avoid overiding base class

	p.createSprite = function(){

		var spriteSheet = new createjs.SpriteSheet({
			"images": [U.getPreloader().getResult("grant")],
			"frames": {"regX": 0, "height": 292, "count": 64, "regY": 0, "width": 165},
			// define two animations, run (loops, 1.5x speed) and jump (returns to run):
			"animations": {"run": [0, 25, "run", 1.5], "jump": [26, 63, "run"]}
		});

		this.monsterShape = new createjs.Sprite(spriteSheet);
		this.monsterShape.framerate = 30;
		this.addChild(this.monsterShape);
	};

	p.initialize = function(){
		this.Container_initialize();

		this.createSprite();

		this.vX = 0;
		this.vY = 0;
	};

	p.appendTo = function(stage){
		if (!stage || !stage.addChild){
			throw "Invalid stage object given as a parameter!";
		}
		stage.addChild(this);
		this.parent = stage;
	};

	p.getParent = function(){
		return this.parent;
	};

	p.tick = function (event) {
		//move by velocity
		this.x += this.vX * event.delta;
		this.y += this.vY * event.delta;
	};

	return Monster;

}());