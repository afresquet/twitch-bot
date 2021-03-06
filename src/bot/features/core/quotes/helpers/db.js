const getRandomInt = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

export function addQuote(db) {
	return quote =>
		new Promise((resolve, reject) => {
			db.update(
				{ _id: "__autoid__" },
				{ $inc: { value: 1 } },
				{ upsert: true, returnUpdatedDocs: true },
				(err, _1, { value }) => {
					if (err) reject(err);

					db.insert({ quote, _id: value });

					resolve(value);
				}
			);
		});
}

export function findQuote(db) {
	return number =>
		new Promise((resolve, reject) => {
			function getQuote(_id) {
				db.findOne({ _id }, (err, doc) => {
					if (err) {
						reject(err);
						return;
					}

					if (!doc) {
						reject(
							new Error(
								number
									? `Quote #${number} doesn't exist`
									: "There are no quotes"
							)
						);
						return;
					}

					resolve(`Quote #${_id}: ${doc.quote}`);
				});
			}

			if (number) getQuote(number);
			else {
				db.count({}, (err, count) => {
					if (err) {
						reject(err);
						return;
					}

					const randomQuote = getRandomInt(1, count - 1);

					getQuote(randomQuote);
				});
			}
		});
}
