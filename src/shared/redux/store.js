import { createStore, applyMiddleware } from "redux";
import {
	forwardToRenderer,
	triggerAlias,
	replayActionMain,
	forwardToMain,
	replayActionRenderer
} from "electron-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./rootReducer";

export default (initialState = {}, scope = "main") => {
	const middlewares = [];

	const enhancers = [
		scope === "main"
			? applyMiddleware(triggerAlias, ...middlewares, forwardToRenderer)
			: applyMiddleware(forwardToMain, ...middlewares)
	];

	const store = createStore(
		rootReducer,
		initialState,
		composeWithDevTools(...enhancers)
	);

	if (scope === "main") {
		replayActionMain(store);
	} else {
		replayActionRenderer(store);
	}

	return store;
};
