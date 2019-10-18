import React, { useState, useEffect, useRef } from "react";
import { Notifier } from "bc-react-notifier";
import Bullet from "./bullet";
import moment from "moment";

const cacheMinute = meeting => {
	const data = JSON.stringify(meeting);
	localStorage.setItem("meeting", data);

	return meeting;
};
const getCachedMinute = () => {
	const data = localStorage.getItem("meeting");
	const meeting = JSON.parse(data);
	if (meeting && meeting.bullets) return meeting;
	else return undefined;
};

const newMeeting = () => ({
	id: Math.floor(Math.random() * 100000),
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
			due_at: null
		}
	]
});

//create your first component
export function Home() {
	const [bullets, setBullets] = useState(newMeeting().bullets);
	const [header, setHeader] = useState(newMeeting());
	const [lastSaved, setLastSaved] = useState(moment());
	const latestHeader = useRef(header);
	const latestBullets = useRef(bullets);

	//only at the begining
	useEffect(() => {
		const cache = getCachedMinute();
		if (cache) {
			setHeader({
				tittle: cache.tittle,
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
					cacheMinute({
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
		<div className="container mt-5">
			<Notifier />
			<div className="minute-header">
				<h2>{header.date.format("LLL")}</h2>
				<div className="input-group">
					<div className="input-group-prepend w-100">
						<span className="input-group-text" id="basic-addon1">
							Minute Taker
						</span>
						<input
							type="text"
							className="form-control"
							value={header.tittle}
							onChange={e =>
								setHeader({ ...header, tittle: e.target.value })
							}
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
			<h1>Todos</h1>
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
						onDelete={() =>
							setBullets(bullets.filter(bu => bu.id !== b.id))
						}
					/>
				))}
			</div>
			<p>
				<button
					type="button"
					className="btn btn-secondary"
					onClick={() =>
						setBullets(bullets.concat([newMeeting().bullets]))
					}>
					<i className="fas fa-plus-circle" />
				</button>
			</p>
			<p className="text-right">
				<button
					type="button"
					className="btn btn-secondary"
					onClick={() =>
						fetch()
							.then()
							.then()
					}>
					Save Meeting
				</button>
			</p>
		</div>
	);
}
