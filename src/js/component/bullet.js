import React, { useState } from "react";
import Select from "react-select";
import moment from "moment";
import PropTypes from "prop-types";

const types = [
	{ value: "decision", label: "Decision" },
	{ value: "todo", label: "Todo" },
	{ value: "info", label: "Info" },
	{ value: "idea", label: "Idea" }
];

const topics = [
	{ value: "chocolate", label: "Chocolate" },
	{ value: "strawberry", label: "Strawberry" },
	{ value: "vanilla", label: "Vanilla" }
];

const owners = [
	{ value: "as", label: "AS" },
	{ value: "mg", label: "MG" },
	{ value: "mr", label: "MR" }
];

const Bullet = ({ onChange, onDelete, ...rest }) => {
	const _onChange = values => onChange && onChange({ ...rest, ...values });

	return (
		<div className="row no-gutters bullet">
			<div className="col-2">
				<Select
					placeholder="topic..."
					options={topics}
					defaultValue={rest.topics}
				/>
			</div>
			<div className="col-1">
				<Select
					placeholder="type..."
					options={types}
					defaultValue={rest.type}
				/>
			</div>
			<div className="col-6">
				<input
					placeholder="comment or note..."
					type="text"
					className="form-control"
					value={rest.note}
					onChange={e => _onChange({ note: e.target.value })}
				/>
			</div>
			<div className="col-1">
				<Select
					placeholder="owner..."
					options={owners}
					defaultValue={rest.owner}
				/>
			</div>
			<div className="col-2">
				<input
					className="form-control"
					placeholder="due date"
					type="date"
					value={rest.due_at}
					onChange={e =>
						_onChange({ due_at: moment(e.target.value) })
					}
				/>
			</div>
			<p className="bullet-actions">
				<button
					type="button"
					className="btn"
					onClick={() => onDelete && onDelete()}>
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
	due_at: PropTypes.instanceOf(Date),
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
