export default class State {
	constructor(initialState = {}) {
		this.data = initialState;
	}

	update = updates => {
		this.data = {
			...this.data,
			...updates
		};
	};
}
