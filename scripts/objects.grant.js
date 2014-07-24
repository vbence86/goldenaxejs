var U = window.U || {};
U.Objects = U.Objects || {};

U.Objects.Grant = (function (monster) {

	function Grant() {
		this.initialize();
	}

	var p = Grant.prototype = new monster();

	// constructor:
	p.Monster_initialize = p.initialize;	//unique to avoid overiding base class

	p.initialize = function(){

		// specifying spritesheet
		var spriteSheet = new createjs.SpriteSheet({
			"framerate": 30,
			"images": [U.getPreloader().getResult("grant")],
			"frames": {"regX": 0, "height": 292, "count": 64, "regY": 0, "width": 165},
			// define two animations, run (loops, 1.5x speed) and jump (returns to run):
			"animations": {"run": [0, 25, "run", 1.5], "jump": [26, 63, "run"]}
		});

		this.Monster_initialize(spriteSheet);
	};

	return Grant;

}(U.Objects.Monster));