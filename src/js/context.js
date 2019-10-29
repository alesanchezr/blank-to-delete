import React, { useState, useEffect } from "react";
import { Notify } from "bc-react-notifier";
import queryString from "query-string";
import moment from "moment";

//const HOST = "https://8001-c64318f7-01bc-4ea3-9003-dd2c84cea540.ws-us1.gitpod.io";
const HOST = "";

const decode = {
	minutes: incoming => {
		return {
			...incoming,
			status: incoming.status || "open",
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
	add: function(entity, data) {
		return new Promise((resolve, reject) =>
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
							: [],
						minute: entityName === "minutes" ? this.cacheMinute(data) : store.minute
					});
					resolve(incoming);
					Notify.success(`The ${entityName} was saved successfully`);
				})
				.catch(err => reject(err) || Notify.error(err.message || err))
		);
	},
	markAs: function(taskId, status) {
		return this.add(`minutes/company/${store.settings.company}`, {
			...store.minute,
			bullets: store.minute.bullets.map(task => {
				if (task.id !== taskId) return task;
				else return { ...task, status };
			})
		});
	},
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
					Notify.success(`The ${entityName} was deleted successfully`);
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
		if (!settings)
			return {
				company: null
			};
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
		const minute = JSON.parse(data);
		if (minute && minute.date && minute.bullets) return decode.minutes(minute);
		else return undefined;
	},
	updateMinute: minute => {
		setStore({ minute });
		return minute;
	},
	loadDataFromCompany: function(company) {
		Promise.all([this.get("members/" + company), this.get("projects/" + company)]).then(() => {
			const parsed = queryString.parse(location.hash);
			this.get(`minutes/company/${company}`).then(minutes => {
				if (parsed.minute) this.updateMinute(decode.minutes(minutes.find(m => m.id == parsed.minute)));
			});
		});
	},
	newMinute: (cache = null) => {
		//window.location.search !== "") window.location.search = "";
		return {
			id: cache ? cache.id : Math.floor(Math.random() * 100000),
			author: cache ? cache.author : "",
			tittle: cache ? cache.tittle : "",
			status: cache ? cache.status : "open",
			attendees: cache ? cache.attendees : "",
			date: cache ? cache.date : moment(),
			bullets: cache
				? cache.bullets
				: [
						{
							id: Math.floor(Math.random() * 100000),
							topics: [],
							status: "pending",
							type: "todo",
							note: "",
							owner: null,
							due_at: moment()
						}
				  ]
		};
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
		},
		minute: null
	});
	const actions = getActions({
		store,
		setStore: d => setStore(store => ({ ...store, ...d }))
	});
	useEffect(() => {
		actions.get("companies").then(() => {
			const { company } = actions.getSettings();
			const parsed = queryString.parse(location.hash);
			if (company || parsed.company) actions.loadDataFromCompany(company || parsed.company);
			//else Notify.error("Missing company intormation");
		});
	}, []);
	return (
		<AppContext.Provider value={{ store, actions }}>
			<PassedComponent {...props} />
		</AppContext.Provider>
	);
};
