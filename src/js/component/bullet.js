import React, { useState, useContext } from "react";
import moment from "moment";
import SmartSelect from "./SmartSelect";
import PropTypes from "prop-types";
import { AppContext } from "../context";
import { Notify } from "bc-react-notifier";
import { AddProjectModal, AddMemberModal } from "./modals";
import Textarea from "react-textarea-autosize";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const types = [
	{ value: "decision", label: "decision", color: "white", bgColor: "orange" },
	{ value: "todo", label: "todo", color: "white", bgColor: "red" },
	{ value: "info", label: "info", color: "white", bgColor: "blue" },
	{ value: "idea", label: "idea", color: "white", bgColor: "green" }
];

const Bullet = ({ onChange, onDelete, ...rest }) => {
	const { store, actions } = useContext(AppContext);
	const _onChange = values => onChange && onChange({ ...rest, ...values });
	const members = store.members.map(m => ({
		value: m.initials.toLowerCase(),
		label: m.full_name,
		initials: m.initials.toLowerCase()
	}));

	return (
		<div className="row no-gutters bullet">
			<div className="col-3">
				<SmartSelect
					isMulti
					placeholder="project..."
					options={store.projects
						.map(p => ({ value: p, label: p }))
						.concat([{ value: "_new", label: "add new project" }])}
					value={rest.projects}
					onChange={vals => {
						const hasNew = vals ? vals.find(v => v.value === "_new") : false;
						if (hasNew) {
							let noti = Notify.add(
								"info",
								AddProjectModal,
								value => {
									if (value) actions.add("projects/" + store.settings.company, { value });
									noti.remove();
								},
								9999999999999
							);
						} else _onChange({ projects: vals || [] });
					}}
				/>
			</div>
			<div className="col-1">
				<SmartSelect
					placeholder="type..."
					options={types}
					value={types.find(m => m.value == rest.type)}
					onChange={val => _onChange({ type: val.value })}
				/>
			</div>
			<div className="col-5">
				<Textarea
					placeholder="comment or note..."
					type="text"
					className="form-control"
					value={rest.note}
					onChange={e => _onChange({ note: e.target.value })}
				/>
			</div>
			<div className="col-1">
				<SmartSelect
					placeholder="owner..."
					options={members.concat([{ value: "_new", label: "add new member" }])}
					value={members.find(m => m.initials == rest.owner)}
					onChange={opt => {
						if (opt.value === "_new") {
							let noti = Notify.add(
								"info",
								AddMemberModal,
								value => {
									if (value) actions.add("members/" + store.settings.company, value);
									noti.remove();
								},
								9999999999999
							);
						} else _onChange({ owner: opt.value });
					}}
				/>
			</div>
			<div className="col-2">
				<DatePicker
					className="form-control"
					placeholder="due date"
					type="date"
					selected={rest.due_at.toDate()}
					onChange={value => _onChange({ due_at: moment(value) })}
				/>
			</div>
			<p className="bullet-actions">
				<button type="button" className="btn" onClick={() => onDelete && onDelete()}>
					<i className="far fa-trash-alt" />
				</button>
			</p>
		</div>
	);
};
//{ id, topics, type, note, owner, due_at }
Bullet.propTypes = {
	id: PropTypes.number,
	topics: PropTypes.array,
	type: PropTypes.string,
	note: PropTypes.string,
	owner: PropTypes.string,
	due_at: PropTypes.object,
	onChange: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired
};

Bullet.defaultProps = {
	id: null,
	topics: [],
	type: null,
	note: "",
	owner: null,
	due_at: null,
	onChange: null,
	onDelete: null
};
export default Bullet;
