var U = window.U || {};

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
		object.getParent().removeChild(object);
		// removing the object from our storage
		for (i = objects.length - 1; i >= 0; i--) {
			if (id === objects[i].guid){
				delete objects[i];
				return;
			}
		}
	};

	return O;

})(U.Objects || {});