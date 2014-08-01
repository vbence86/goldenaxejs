var U = window.U || {};

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
					scrollableHeight = Math.max(0, layers[0].getHeightInPixels() - viewportHeight);
				x = Math.max(0, Math.min(x, scrollableWidth));
				y = Math.max(0, Math.min(y, scrollableHeight));
				layerContainer.setTransform(-x, -y);
			},

			centerTo: function(x, y){
				var viewportWidth = U.Game.getViewportWidth(),
					viewportHeight = U.Game.getViewportHeight(),
					scrollX = x - Math.round(viewportWidth / 2),
					scrollY = y - Math.round(viewportHeight / 2);

				this.scrollTo(scrollX, scrollY);
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
		},

		centerTo: function(monster){
			engine.centerTo(monster.x, monster.y);
		}

	};

})(U.Toolkit);