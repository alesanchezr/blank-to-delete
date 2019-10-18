import React, { useState } from "react";
import { Notify } from "bc-react-notifier";
const HOST =
	"https://8001-c64318f7-01bc-4ea3-9003-dd2c84cea540.ws-us1.gitpod.io";

export const getActions = ({ store, setStore }) => ({
	get: entity => {
		fetch(`${HOST}/${entity}`)
			.then(r => r.json())
			.then(data => setStore({ [entity]: data }))
			.catch(err => Notify.error(err.message || err));
	}
});

const AppContext = React.createContext({});
export const inject = PassedComponent => {
	const [store, setStore] = useState({
		projects: []
	});
	const actions = getActions({
		store,
		setStore: d => setStore({ ...store, d })
	});
	return (
		<AppContext.Provider value={{ store, actions }}>
			<PassedComponent />
		</AppContext.Provider>
	);
};
