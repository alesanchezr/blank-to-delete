import React, { useState, useEffect } from "react";
import { Notify } from "bc-react-notifier";
import moment from "moment";

const HOST = "https://8001-c64318f7-01bc-4ea3-9003-dd2c84cea540.ws-us1.gitpod.io";

const decode = {
	minutes: incoming => {
		return {
			...incoming,
			date: moment(incoming.date),
			bullets: incoming.bullets.map(b => ({ ...b, due_at: moment(b.due_at) }))
		};
	}
};

export const getActions = ({ store, setStore }) => ({
	get: entity =>
		new Promise((resolve, reject) =>
			fetch(`${HOST}/${entity}`, {
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then(r => r.json())
				.then(incoming => {
					const entityName = entity.split("/")[0];
					setStore({
						[entityName]: Array.isArray(incoming)
							? incoming.map(ent => {
									if (decode[entityName] !== undefined) return decode[entityName](ent);
									else return ent;
							  })
							: []
					});
					resolve(incoming);
				})
				.catch(err => reject(err) || Notify.error(err.message || err))
		),
	add: (entity, data) =>
		new Promise((resolve, reject) =>
			fetch(`${HOST}/${entity}`, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then(r => r.json())
				.then(incoming => {
					const entityName = entity.split("/")[0];
					setStore({
						[entityName]: Array.isArray(incoming)
							? incoming.map(ent => {
									if (decode[entityName] !== undefined) return decode[entityName](ent);
									else return ent;
							  })
							: []
					});
					resolve(incoming);
				})
				.catch(err => reject(err) || Notify.error(err.message || err))
		),
	delete: entity =>
		new Promise((resolve, reject) =>
			fetch(`${HOST}/${entity}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then(r => r.json())
				.then(incoming => {
					const entityName = entity.split("/")[0];
					setStore({
						[entityName]: Array.isArray(incoming)
							? incoming.map(ent => {
									if (decode[entityName] !== undefined) return decode[entityName](ent);
									else return ent;
							  })
							: []
					});
					resolve(incoming);
				})
				.catch(err => reject(err) || Notify.error(err.message || err))
		),
	saveSettings: settings => {
		const data = JSON.stringify(settings);
		localStorage.setItem("settings", data);
		setStore({ settings });
		return settings;
	},
	getSettings: () => {
		const data = localStorage.getItem("settings");
		const settings = JSON.parse(data);
		setStore({ settings });
		return settings;
	},
	cacheMinute: meeting => {
		const data = JSON.stringify(meeting);
		localStorage.setItem("meeting", data);

		return meeting;
	},
	getCachedMinute: () => {
		const data = localStorage.getItem("meeting");
		const meeting = JSON.parse(data);
		if (meeting && meeting.bullets)
			return { ...meeting, bullets: meeting.bullets.map(b => ({ ...b, due_at: moment(b.due_at) })) };
		else return undefined;
	},
	loadDataFromCompany: function(company) {
		Promise.all([this.get("members/" + company), this.get("projects/" + company)]).then(() =>
			this.get(`minutes/${company}`)
		);
	}
});

export const AppContext = React.createContext({});
export const inject = PassedComponent => props => {
	const [store, setStore] = useState({
		projects: [],
		members: [],
		companies: [],
		minutes: [],
		settings: {
			company: null
		}
	});
	const actions = getActions({
		store,
		setStore: d => setStore(store => ({ ...store, ...d }))
	});
	useEffect(() => {
		actions.get("companies").then(() => {
			const { company } = actions.getSettings();
			if (company) actions.loadDataFromCompany(company);
		});
	}, []);
	return (
		<AppContext.Provider value={{ store, actions }}>
			<PassedComponent {...props} />
		</AppContext.Provider>
	);
};
