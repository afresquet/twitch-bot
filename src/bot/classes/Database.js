import Datastore from "nedb";

export default class Database extends Datastore {
	loadWithCustomMethods = customMethods => {
		this.loadDatabase();

		Object.values(customMethods).forEach(customMethod => {
			if (!this[customMethod.name])
				this[customMethod.name] = customMethod(this);
		});
	};
}
