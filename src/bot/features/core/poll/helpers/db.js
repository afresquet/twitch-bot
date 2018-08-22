export function loadSettings(db) {
	return () =>
		new Promise((resolve, reject) => {
			db.findOne({ _id: "settings" }, (err, settings) => {
				if (err) {
					reject(err);
					return;
				}

				if (!settings) {
					db.insert(
						{
							_id: "settings",
							minSeconds: 15,
							maxSeconds: 60
						},
						(err2, newSettings) => {
							if (err2) {
								reject(err2);
								return;
							}

							resolve(newSettings);
						}
					);
					return;
				}

				resolve(settings);
			});
		});
}

export function editSettings(db) {
	return newSettings =>
		new Promise((resolve, reject) => {
			db.update({ _id: "settings" }, newSettings, {}, err => {
				if (err) {
					reject(err);
					return;
				}

				resolve();
			});
		});
}
