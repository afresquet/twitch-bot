export const getAnswers = db =>
	new Promise((resolve, reject) => {
		db.findOne({ _id: "answers" }, (err, doc) => {
			if (err) {
				reject(err);
				return;
			}

			if (!doc || doc.answers.length === 0) {
				const defaultAnswers = [
					"It is certain.",
					"It is decidedly so.",
					"Without a doubt.",
					"Yes - definitely.",
					"You may rely on it.",
					"As I see it, yes.",
					"Most likely.",
					"Outlook good.",
					"Yes.",
					"Signs point to yes.",
					"Reply hazy, try again.",
					"Ask again later.",
					"Better not tell you now.",
					"Cannot predict now.",
					"Concentrate and ask again.",
					"Don't count on it.",
					"My reply is no.",
					"My sources say no.",
					"Outlook not so good.",
					"Very doubtful."
				];

				db.update(
					{ _id: "answers" },
					{ _id: "answers", answers: defaultAnswers },
					{ upsert: true },
					err2 => {
						if (err2) {
							reject(err2);
							return;
						}

						resolve(defaultAnswers);
					}
				);
				return;
			}

			resolve(doc.answers);
		});
	});

export const addAnswer = (db, answer) =>
	new Promise(async (resolve, reject) => {
		try {
			const answers = await getAnswers(db);

			db.update(
				{ _id: "answers" },
				{ answers: [...answers, answer] },
				{},
				err => {
					if (err) {
						reject(err);
						return;
					}

					resolve([...answers, answer]);
				}
			);
		} catch (err) {
			reject(err);
		}
	});

export const editAnswer = (db, oldAnswer, newAnswer) =>
	new Promise(async (resolve, reject) => {
		try {
			const dbAnswers = await getAnswers(db);

			if (dbAnswers.length < oldAnswer) {
				reject(new Error(`Answer ${oldAnswer} doesn't exist.`));
				return;
			}

			const answers = dbAnswers.map(
				(answer, i) => (i === oldAnswer - 1 ? newAnswer : answer)
			);

			db.update({ _id: "answers" }, { answers }, {}, err => {
				if (err) {
					reject(err);
					return;
				}

				resolve(answers);
			});
		} catch (err) {
			reject(err);
		}
	});

export const deleteAnswer = (db, answer) =>
	new Promise(async (resolve, reject) => {
		try {
			const dbAnswers = await getAnswers(db);

			if (dbAnswers.length < answer) {
				reject(new Error(`Answer ${answer} doesn't exist.`));
				return;
			}

			const answers = dbAnswers.filter((_, i) => i !== answer - 1);

			db.update({ _id: "answers" }, { answers }, {}, err => {
				if (err) {
					reject(err);
					return;
				}

				resolve(answers);
			});
		} catch (err) {
			reject(err);
		}
	});
