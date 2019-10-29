import React, { useRef, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AppContext } from "../context";
import Bullet from "./bullet";
import moment from "moment";

const Minute = () => {
	const { store, actions } = useContext(AppContext);

	const _onChange = values => actions.updateMinute({ ...actions.newMinute(store.minute), ...values });
	const { bullets, status, ...rest } = actions.newMinute(store.minute);
	const readOnly = status === "closed";

	if (!readOnly) {
		const [lastSaved, setLastSaved] = useState(moment());
		const latestHeader = useRef(rest);
		const latestBullets = useRef(bullets);

		//only at the begining
		useEffect(() => {
			const cache = actions.getCachedMinute();
			if (cache) _onChange(actions.newMinute(cache));
		}, []);

		useEffect(() => {
			latestHeader.current = rest;
			latestBullets.current = bullets;
			setTimeout(() => {
				if (moment().diff(lastSaved, "seconds") > 60) {
					console.log("Saving meeting", latestBullets.current);
					actions.cacheMinute({
						...latestHeader.current,
						bullets: latestBullets.current
					});
					setLastSaved(moment());
				}
			}, 60000);
		});
	}

	return (
		<div className="container mt-4">
			<div className="minute-header">
				<h2>
					{rest.date.format("LLL")} <small>({rest.id})</small>
				</h2>
				<div className="input-group">
					<div className="input-group-prepend w-100">
						<span className="input-group-text" id="basic-addon1">
							Minute Taker
						</span>
						<input
							type="text"
							className="form-control"
							value={rest.author}
							onChange={e => _onChange({ author: e.target.value })}
							readOnly={readOnly}
						/>
					</div>
				</div>
				<div className="input-group mt-2">
					<div className="input-group-prepend w-100">
						<span className="input-group-text" id="basic-addon1">
							Attendees
						</span>
						<input
							type="text"
							className="form-control"
							value={rest.attendees}
							onChange={e => _onChange({ attendees: e.target.value })}
							readOnly={readOnly}
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
							_onChange({
								bullets: bullets.map(bu => {
									if (bu.id !== b.id) return bu;
									else return data;
								})
							});
						}}
						onDelete={() => _onChange({ bullets: bullets.filter(bu => bu.id !== b.id) })}
						readOnly={readOnly}
					/>
				))}
			</div>
			{!readOnly && (
				<p>
					<button
						type="button"
						className="btn "
						onClick={() => _onChange({ bullets: bullets.concat(actions.newMinute().bullets) })}>
						<i className="fas fa-plus-circle" /> <strong>task</strong>
					</button>
				</p>
			)}
			<p className="text-right mt-3">
				{!readOnly && (
					<button
						type="button"
						className="btn btn-primary"
						onClick={() =>
							actions.add(`minutes/company/` + store.settings.company, {
								...rest,
								status: "open",
								bullets,
								tittle: rest.date.format("MM/DD/YYYY")
							})
						}>
						Save Meeting
					</button>
				)}
				{!readOnly && (
					<button
						type="button"
						className="btn btn-warning ml-2"
						onClick={() =>
							actions.add(`minutes/company/` + store.settings.company, {
								...rest,
								status: "closed",
								bullets,
								tittle: rest.date.format("MM/DD/YYYY")
							})
						}>
						Close Meeting
					</button>
				)}
				<button
					type="button"
					className="btn btn-secondary ml-2"
					onClick={() => {
						window.location.hash = "";
						_onChange(actions.updateMinute(actions.cacheMinute(actions.newMinute())));
					}}>
					Start New Meeting
				</button>
			</p>
		</div>
	);
};
Minute.propTypes = {
	// readOnly: PropTypes.bool
};
Minute.defaultProps = {
	// readOnly: false
};
export default Minute;
