import React, { useState } from "react";

export const AddProjectModal = p => {
	const [name, setName] = useState("");
	return (
		<div className="row">
			<div className="col">
				<input
					type="text"
					className="form-control"
					placeholder="project name"
					value={name}
					onChange={e => setName(e.target.value)}
				/>
			</div>
			<div className="col">
				<button className="btn btn-success w-50" onClick={() => p.onConfirm(name)}>
					Add Project
				</button>
				<button className="btn btn-secondary w-50" onClick={() => p.onConfirm(false)}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export const AddCompanyModal = p => {
	const [name, setName] = useState("");
	return (
		<div className="row">
			<div className="col">
				<input
					type="text"
					className="form-control"
					placeholder="company name"
					value={name}
					onChange={e => setName(e.target.value.toLowerCase())}
				/>
			</div>
			<div className="col">
				<button className="btn btn-success w-50" onClick={() => p.onConfirm(name)}>
					Add Company
				</button>
				<button className="btn btn-secondary w-50" onClick={() => p.onConfirm(false)}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export const AddMemberModal = p => {
	const [member, setMember] = useState({ full_name: "", initials: "" });
	return (
		<div className="row">
			<div className="col-5">
				<input
					type="text"
					className="form-control"
					placeholder="full name"
					value={member.full_name}
					onChange={e => setMember({ full_name: e.target.value, initials: member.initials })}
				/>
			</div>
			<div className="col-2">
				<input
					type="text"
					className="form-control"
					placeholder="initials"
					value={member.initials}
					onChange={e => setMember({ initials: e.target.value.toLowerCase(), full_name: member.full_name })}
				/>
			</div>
			<div className="col-5">
				<button className="btn btn-success w-50" onClick={() => p.onConfirm(member)}>
					Add Member
				</button>
				<button className="btn btn-secondary w-50" onClick={() => p.onConfirm(false)}>
					Cancel
				</button>
			</div>
		</div>
	);
};
