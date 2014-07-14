var U = window.U || {};
// Decorating the CreateJS.LoadQueue object
U.PreLoader = (function(){

	var PreLoader = function(manifest){

		var	loader;

		return {

			loadAll: function(){
				var defer = function(promise){

					loader = new createjs.LoadQueue(false);
					loader.addEventListener("complete", promise);
					loader.loadManifest(manifest);	

				};

				return {
					then: function(callback){
						if ('function' !== typeof callback){
							return;
						}
						defer(callback);
					}
				};
			},

			getResult: function(id){
				return loader.getResult(id);
			}

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

})();