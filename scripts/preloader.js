var U = window.U || {};
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

})(U.Toolkit);