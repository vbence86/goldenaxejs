var U = window.U || {};

U.Map = (function(toolkit){

	var engine = (function(){

		var data,
			tilesetSheet,

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

		createLayerContainers = function(){
			var layers = data.layers,
				container;
			for (var i = 0, l = layers.length; i < l; i++){
				container = new createjs.Container();
				layers[i].container = container;
			}
		};

		// populate the created containers with the corresponding items
		generateMap = function() {
			var layers = data.layers;
			for (var i = 0, l = layers.length; i < l; i++){
				generateItems(layers[i]);
			}
		};

		createTileElementXY = function(elemId, x, y){
			var tileSprite = new createjs.Sprite(tilesetSheet);
			// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
			tileSprite.gotoAndStop(elemId);
			// translate the tile's positions
			tileSprite.x = x * data.tilewidth;
			tileSprite.y = y * data.tilewidth;
			tileSprite.elemId = elemId;

			return tileSprite;
		};

		removeTileElementXY = function(){
			var args = Array.prototype.slice.call(arguments),
				layer = args[0],
				index;

			if (!layer){
				return;
			}

			if (args.length === 2){
				index = args[1];
			} else if (args.length === 3) {
				index = args[1] % layer.width + args[2] * layer.width;
			}

			if (layer.elements[index]){
				layer.container.removeChild(layer.elements[index]);
			}
			layer.data[index] = 0;
		};

		// populate the passed container with the items linked to it
		generateItems = function(layer) {

			var i, j, tileData, elem, index;

			if (layer.type !== "tilelayer" || !layer.opacity) { 
				return; 
			}

			for (i = 0; i < layer.width; i++) {
				for (j = 0; j < layer.height; j++) {

					index = i % layer.width + j * layer.width;
					tileData = layer.data[index];

					if (!tileData){
						continue;
					}

					elem = createTileElementXY(tileData - 1, i, j);
					if (!layer.elements){
						layer.elements = [];
					}
					layer.elements[index] = elem;
					layer.container.addChild(elem);
				}
			}
		};

		getTileElementXY = function(layer, x, y){
			var index = x % layer.width + y * layer.width;
			return layer.elements[index];
		};

		return {

			create: function(json){
				setData(json);
				createLayerContainers();
				loadTileset();
				return this;
			},

			generate: function(){
				generateMap();
				return this;
			},

			getLayers: function(){
				return layerContainers;
			},

			remove: function(x, y){
				removeTileElementXY(data.layers[0], x, y);
			},

			appendLayersToStage: function(stage){
				if (!stage || !stage.addChild){
					throw "Invalid Stage object has been passed!";
				}
				for (var i = 0, l = data.layers.length; i < l; i++){
					stage.addChild(data.layers[i].container);
				}
				return this;
			}
		};

	})();


	return {

		loadMap: function(json){
			engine.create(json);			
		},

		appendTo: function(stage){
			engine
				.generate()
				.appendLayersToStage(stage);
		},

		remove: function(x, y){
			engine.remove(x, y);
		}

	};

})(U.Toolkit);