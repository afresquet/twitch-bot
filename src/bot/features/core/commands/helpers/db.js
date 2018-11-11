export function getAllCommands(db) {
	return () =>
		new Promise((resolve, reject) => {
			db.find({}, (err, docs) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(docs);
			});
		});
}

export function getCommand(db) {
	return command =>
		new Promise((resolve, reject) => {
			db.findOne({ _id: command }, (err, doc) => {
				if (err) {
					reject(err);
					return;
				}

				if (!doc || !doc.message) {
					resolve(null);
					return;
				}

				resolve(doc.message);
			});
		});
}

export function addCommand(db) {
	return (command, message) =>
		new Promise((resolve, reject) => {
			db.insert({ _id: command, message }, err => {
				if (err) {
					reject(err);
					return;
				}

				resolve();
			});
		});
}

export function editCommand(db) {
	return (commandToEdit, newMessage) =>
		new Promise((resolve, reject) => {
			db.update({ _id: commandToEdit }, { message: newMessage }, {}, err => {
				if (err) {
					reject(err);
					return;
				}

				resolve();
			});
		});
}

export function deleteCommand(db) {
	return commandToDelete =>
		new Promise((resolve, reject) => {
			db.update({ _id: commandToDelete }, {}, err => {
				if (err) {
					reject(err);
					return;
				}

				resolve();
			});
		});
}
