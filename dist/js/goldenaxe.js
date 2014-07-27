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

})(window.U || {});;var U = window.U || {};
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

	return {

		// exposing the EventDispatcher object
		EventDispatcher: EventDispatcher,

		isFunction: function(func){
			return 'function' === typeof func;
		}

	};

})();;var U = window.U || {};
// Decorating the CreateJS.LoadQueue object
U.PreLoader = (function(toolkit){

	var PreLoader = function(manifest){

		var	loader = new createjs.LoadQueue(false);

		this.loadAll = function(){
			var defer = function(promise){

				loader.addEventListener("complete", promise);
				loader.loadManifest(manifest);	

			};

			return {
				then: function(callback){
					if (toolkit.isFunction(callback)){
						defer(callback);
					}
				}
			};
		};

		this.progress = function(callback){
			if (toolkit.isFunction(callback)){
				loader.addEventListener("progress", function(){
					callback(loader.progress || 0);
				});
			}
		};

		this.getResult = function(id){
			return loader.getResult(id);
		};

	};

	return {

		create: function(manifest){
			if ("object" !== typeof manifest){
				throw "Invalid manifest object has been passed!";
			}

			return new PreLoader(manifest);
		}

	};

})(U.Toolkit);;var U = window.U || {};
// Providing generic solution for handling user interactions.
// As the player will be able control the character either by using 
// the keyboard in dekstop mode or touching the virtual controls on 
// Mobiles, I have to provide a unified solution to register business 
// logic to the UI events. 
U.UIHandler = window.UIHandler || (function(Modernizr, U, window, undefined){

	var uiEvents = {
			37: { name: "left", pressed: false },
			39: { name: "right", pressed: false },
			38: { name: "up", pressed: false },
			40: { name: "down", pressed: false }
		},

		// handling keydown and keyup events
		handleKeyEvents = function(event){
			var evt = event || window.event,
				keyCode = evt.keyCode,
				uiEventObject = uiEvents[keyCode];

			if (!uiEventObject){
				return;
			}

			if ("keydown" === event.type){
				uiEventObject.pressed = true;
			} else if ("keyup" === event.type){
				uiEventObject.pressed = false;
			}
		},

		// reference to the game container to attach touch listeners
		gameScene;

	return {

		attach: function(){

			// touch devices
			if (Modernizr.touch){
				gameScene = $('#' + U.Scene.gameSceneId);
				gameScene.addEventListener("touchstart", handleTouchEvents);
				gameScene.addEventListener("touchend", handleTouchEvents);
			} else {
			// desktop devices
				window.addEventListener("keydown", handleKeyEvents);
				window.addEventListener("keyup", handleKeyEvents);
			}

		},

		isFired: function(uiEvent){
			var code;
			switch (uiEvent){
				case "left": code = 37; break;
				case "right": code = 39; break;
				case "up": code = 38; break;
				case "down": code = 40; break;
				default:
					return false;
			}
			if (!uiEvents[code]){
				return false;
			}
			return uiEvents[code].pressed;
		}

	};

})(Modernizr, U, window);;var U = window.U || {};

U.Map = (function(toolkit, undefined){

	var engine = (function(){

		var data,
			layers,
			tilesetSheet,
			layerContainer;

		function Layer(layerData){
			if (!layerData.data){
				throw "Invalid layer data has been passed!";
			}
			this.init(layerData);
		}

		Layer.prototype = {
			init: function(layerData){

				var i, tile;

				this.tiles = [];
				this.width = layerData.width;
				this.height = layerData.height;
				this.pixelWidth = layerData.width * tilesetSheet._frameWidth;
				this.pixelHeight = layerData.height * tilesetSheet._frameHeight;

				this.container = new createjs.Container();

				for (i = layerData.data.length - 1; i >= 0; i--) {
					tile = new Tile(layerData.data[i]);
					x = i % layerData.width;
					y = Math.floor(i / layerData.width);

					tile.appendToLayer(this)
						.putTo(x, y);
				}

			},
			appendTo: function(container){
				container.addChild(this.container);
			},
			getContainer: function(){
				return this.container;
			},
			getTiles: function(){
				return tiles;
			},
			getWidth: function(){
				return this.width;
			},
			getHeight: function(){
				return this.height;
			},
			getWidthInPixels: function(){
				return this.pixelWidth;
			},
			getHeightInPixels: function(){
				return this.pixelHeight;
			}
		};


		function Tile(id){
			if (undefined === id){
				throw "Invalid identifier has been given!";
			}
			this.init(id);
		}

		Tile.prototype = {
			init: function(id){
				this.sprite = new createjs.Sprite(tilesetSheet);
				// 0 is reserved in Tile editor, thus we have to
				// decrease the id to get the appropriate frame
				this.sprite.gotoAndStop(id - 1);
				this.id = id;
			},
			putTo: function(x, y){
				this.x = x;
				this.y = y;
				this.sprite.x = x * tilesetSheet._frameWidth;
				this.sprite.y = y * tilesetSheet._frameHeight;
				return this;
			},
			appendToLayer: function(layer){
				layer.getContainer()
					 .addChild(this.sprite);
				this.parent = layer;
				return this;			
			},
			getSprite: function(){
				return this.sprite;
			},
			getId: function(){
				return this.id;
			}
		};

		// setting up the required components to construct the map
		// exportd from Tiled
		setData = function(json){
			data = json;
		};

		// loading the spritesheets used for the layer elements
		loadTileset = function(){

			var imageData = {
					images : [U.getPreloader().getResult("tilesetSheet")],
					frames : {
						width : data.tilesets[0].tilewidth,
						height : data.tilesets[0].tileheight
					}
				};

			// create spritesheet
			tilesetSheet = new createjs.SpriteSheet(imageData);

		};

		createLayers = function(){
			var i, l, layer, 
				layersArray = data.layers;
			if (!layersArray || !layersArray.length){
				throw "Invalid argument has been passed!";
			}

			layers = [];
			layerContainer = new createjs.Container();

			for (i = 0, l = layersArray.length; i < l; i++){
				layer = new Layer(layersArray[i]);
				layer.appendTo(layerContainer);
				layers.push(layer);
			}
		};

		return {

			load: function(json){
				setData(json);
				loadTileset();
				createLayers();
				return this;
			},

			appendTo: function(stage){
				if (!stage || !stage.addChild){
					throw "Invalid Stage object has been passed!";
				}
				for (var i = 0, l = layers.length; i < l; i++){
					stage.addChild(layerContainer);
				}
				return this;
			},

			scrollTo: function(x, y){
				var viewportWidth = U.Game.getViewportWidth(),
					viewportHeight = U.Game.getViewportHeight(),
					scrollableWidth = Math.max(0, layers[0].getWidthInPixels() - viewportWidth),
					scrollableHeight = Math.max(0, layers[0].getHeightInPixels() - viewportWidth);
				x = Math.max(0, Math.min(x, scrollableWidth));
				y = Math.max(0, Math.min(y, scrollableHeight));
				layerContainer.setTransform(-x, -y);
			},

			getLayers: function(){
				return layers;
			},

			getContainer: function(){
				return layerContainer;
			}

		};

	})();


	return {

		loadMap: function(json){
			engine.load(json);			
		},

		appendTo: function(stage){
			engine.appendTo(stage);
		},

		scrollTo: function(x, y){
			engine.scrollTo(x, y);
		}

	};

})(U.Toolkit);;var U = window.U || {};

// common unified functions to handle interractions with game objects
U.Objects = (function(O){

	// array to store the created objects
	var objects = [];

	// unique indentifier for each object type
	O.guid = 0;

	// creating monsters and returning with an immediate object so that
	// we can append the object to a specified stage, avoiding inject 
	// any stage reference into this object declaration 
	O.createObject = function(objectFunc, id){

		var object;

		object = new objectFunc();
		object.guid = id;
		objects.push(object);

		return {

			get: function(){
				return object;
			},

			// appending the created object to a stage 
			// and return a temporary object that can be used to
			// ask for reference to the mosnter object itself
			appendTo: function(stage){
				if (!stage || !stage.addChild){
					throw "Invalid parent object given as a parameter!";
				}
				if (U.Toolkit.isFunction(object.appendTo)){
					object.appendTo(stage);
				} else {
					// if the object doens't implement the appendTo function
					// we merely add it to the stage without registering its
					// parent
					stage.addChild(object);
				}
				return this;
			}

		};
	};

	// returning a list of the all registered objects
	O.getObjects = function(){
		return objects;
	};

	// returning a reference to an object by finding it throught its 
	// given id
	O.getObjectById = function(id){
		if (!id){
			return null;
		}
		for (var i = objects.length - 1; i >= 0; i--) {
			if (id === objects[i].guid){
				return objects[i];
			}
		}
		return null;
	};

	// removing a specified object from the 
	O.removeObject = function(id){
		var object = getObjectById(id), i;
		// removing the object from the game stage
		object.getStage().removeChild(object);
		// removing the object from our storage
		for (i = objects.length - 1; i >= 0; i--) {
			if (id === objects[i].guid){
				delete objects[i];
				return;
			}
		}
	};

	return O;

})(U.Objects || {});;var U = window.U || {};
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

}());;var U = window.U || {};
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

}(U.Objects.Monster));;var U = window.U || {};
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
		},

		// returning the width of the staging area in pixels depending on 
		// the viewport
		getViewportWidth: function(){
			return this.getStage().canvas.width;
		},

		// returning the height of the staging area in pixels depending on 
		// the viewport
		getViewportHeight: function(){
			return this.getStage().canvas.height;
		}

	};
		
})();
;(function(U, toolkit, game, window, document, undefined){

	// adding entry point to initialise the game components
	window.addEventListener('load', function(){

		game.init();

	});

})(U, U.Toolkit, U.Game, window, window.document);