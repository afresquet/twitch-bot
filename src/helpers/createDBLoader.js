import Datastore from "nedb";

export default function createDBLoader(path) {
	return function dbLoader() {
		return new Promise((resolve, reject) => {
			const db = new Datastore(path);

			db.loadDatabase(err => {
				if (err) {
					reject(err);
					return;
				}

				resolve(db);
			});
		});
	};
}
