import React, { useState, useEffect, useRef, useContext } from "react";
import { Notifier } from "bc-react-notifier";
import Bullet from "./component/bullet";
import moment from "moment";
import { AppContext } from "./context";
import Settings from "./component/Settings";

const newMeeting = () => ({
	id: Math.floor(Math.random() * 100000),
	author: "",
	tittle: "",
	attendees: "",
	date: moment(),
	bullets: [
		{
			id: Math.floor(Math.random() * 100000),
			topics: [],
			type: "todo",
			note: "",
			owner: null,
			due_at: moment()
		}
	]
});

//create your first component
export function Home() {
	const [bullets, setBullets] = useState(newMeeting().bullets);
	const [header, setHeader] = useState(newMeeting());
	const { store, actions } = useContext(AppContext);
	const [lastSaved, setLastSaved] = useState(moment());
	const latestHeader = useRef(header);
	const latestBullets = useRef(bullets);

	//only at the begining
	useEffect(() => {
		const cache = actions.getCachedMinute();
		if (cache) {
			setHeader({
				tittle: cache.tittle,
				author: cache.author,
				attendees: cache.attendees,
				date: moment(cache.date),
				id: cache.id
			});
			setBullets(cache.bullets);
		}
	}, []);

	useEffect(
		() => {
			latestHeader.current = header;
			latestBullets.current = bullets;
			setTimeout(() => {
				if (lastSaved.isBefore(moment().add(1, "minutes"))) {
					console.log("Saving meeting", latestBullets.current);
					actions.cacheMinute({
						...latestHeader.current,
						bullets: latestBullets.current
					});
					setLastSaved(moment());
				}
			}, 4000);
		},
		[bullets]
	);

	return (
		<div>
			<Settings
				onLoadMinute={id => {
					const { bullets, ...rest } = store.minutes.find(m => m.id === id);
					setHeader(rest);
					setBullets(bullets);
				}}
			/>
			<Notifier />
			{!store.settings.company ? (
				<h2 className={"mt-4 text-center"}>Please choose a company on the settings panel</h2>
			) : (
				<div className="container mt-4">
					<div className="minute-header">
						<h2>
							{header.date.format("LLL")} ({header.id})
						</h2>
						<div className="input-group">
							<div className="input-group-prepend w-100">
								<span className="input-group-text" id="basic-addon1">
									Minute Taker
								</span>
								<input
									type="text"
									className="form-control"
									value={header.author}
									onChange={e => setHeader({ ...header, author: e.target.value })}
								/>
							</div>
						</div>
						<div className="input-group">
							<div className="input-group-prepend w-100">
								<span className="input-group-text" id="basic-addon1">
									Attendees
								</span>
								<input
									type="text"
									className="form-control"
									value={header.attendees}
									onChange={e =>
										setHeader({
											...header,
											attendees: e.target.value
										})
									}
								/>
							</div>
						</div>
					</div>
					<h2 className="mt-5">Todos</h2>
					<div className="todos">
						{bullets.map(b => (
							<Bullet
								key={b.id}
								{...b}
								onChange={data => {
									setBullets(
										bullets.map(bu => {
											if (bu.id !== b.id) return bu;
											else return data;
										})
									);
								}}
								onDelete={() => setBullets(bullets.filter(bu => bu.id !== b.id))}
							/>
						))}
					</div>
					<p>
						<button
							type="button"
							className="btn "
							onClick={() => setBullets(bullets.concat(newMeeting().bullets))}>
							<i className="fas fa-plus-circle" /> <strong>task</strong>
						</button>
					</p>
					<p className="text-right">
						<button
							type="button"
							className="btn btn-primary"
							onClick={() =>
								actions.add(`minutes/` + store.settings.company, {
									...header,
									bullets,
									tittle: header.date.format("MM/DD/YYYY")
								})
							}>
							Save Meeting
						</button>
						<button
							type="button"
							className="btn btn-secondary ml-2"
							onClick={() => {
								setHeader(newMeeting());
								setBullets(newMeeting().bullets);
							}}>
							Start New Meeting
						</button>
					</p>
				</div>
			)}
		</div>
	);
}
