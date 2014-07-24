var U = window.U || {};

U.Map = (function(toolkit){

	var engine = (function(){

		var data,
			tilesetSheet,
			layerContainers = [],

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
				layers[i].container = container = new createjs.Container();
				layerContainers.push(container);
			}
		};

		// populate the created containers with the corresponding items
		generateMap = function() {
			var layers = data.layers;
			for (var i = 0, l = layers.length; i < l; i++){
				generateItems(layers[i]);
			}
		};

		// populate the passed container with the items linked to it
		generateItems = function(layer) {

			if (layer.type !== "tilelayer" || !layer.opacity) { 
				return; 
			}

			var size = data.tilewidth;

			layer.data.forEach(function(tile_idx, i){

				if (!tile_idx) { 
					return; 
				}

				var tileSprite = new createjs.Sprite(tilesetSheet);
				// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
				tileSprite.gotoAndStop(tile_idx - 1);
				// translate the tile's positions
				tileSprite.x = (i % layer.width) * size;
				tileSprite.y = ~~(i / layer.width) * size;
				// add bitmap to stage
				layer.container.addChild(tileSprite);

			});

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

			/*getLayers: function(){
				return layerContainers;
			},*/

			appendLayersToStage: function(stage){
				if (!stage || !stage.addChild){
					throw "Invalid Stage object has been passed!";
				}
				for (var i = 0, l = layerContainers.length; i < l; i++){
					stage.addChild(layerContainers[i]);
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
		}

	};

})(U.Toolkit);