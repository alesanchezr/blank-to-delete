import React, { useContext, useEffect } from "react";
import { Notifier } from "bc-react-notifier";
import Minute from "./component/Minute";
import { AppContext } from "./context";
import Settings from "./component/Settings";
import queryString from "query-string";

//create your first component
export function Home() {
	const { store, actions } = useContext(AppContext);
	const parsed = queryString.parse(location.hash);

	return (
		<div>
			<Settings
				onLoad={(type, id) => {
					if (type === "minutes") {
						window.location.hash = "";
						actions.updateMinute(store.minutes.find(m => m.id === id));
					} else if (type == "companies") {
						actions.updateMinute(actions.newMinute());
					}
				}}
			/>
			<Notifier />
			{!store.settings.company && !parsed.minute ? (
				<h2 className={"mt-4 text-center"}>Please choose a company on the settings panel</h2>
			) : (
				<Minute />
			)}
		</div>
	);
}
