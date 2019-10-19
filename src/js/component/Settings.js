import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import SmartSelect from "./SmartSelect";
import { Notify } from "bc-react-notifier";
import { AppContext } from "../context";
import { AddCompanyModal } from "./modals";

const Settings = ({ onLoadMinute }) => {
	const { store, actions } = useContext(AppContext);
	const [collapsed, setCollapsed] = useState(true);
	const { company } = store.settings;
	const _onChange = values => actions.saveSettings({ ...store.settings, ...values });
	return (
		<div className={`settings navbar-dark bg-dark text-center ${collapsed ? "" : "collapsed"}`}>
			{collapsed && (
				<div className="text-left">
					<h2 className="m-0">Settings</h2>
					<div className="row">
						<div className="col">
							<SmartSelect
								placeholder="company..."
								options={store.companies
									.map(p => ({ value: p, label: p, bgColor: "#BFBFBF" }))
									.concat([{ value: "_new", label: "add new company", bgColor: "#BFBFBF" }])}
								value={{ value: company, label: company }}
								onChange={opt => {
									if (opt.value === "_new") {
										let noti = Notify.add(
											"info",
											AddCompanyModal,
											value => {
												if (value) actions.add("companies", { value });
												noti.remove();
											},
											9999999999999
										);
									} else _onChange({ company: opt.value });
								}}
							/>
						</div>
					</div>
					<div className="row px-2">
						<div className="col">
							<h3>Previous Meetings</h3>
							<ul>
								{store.minutes.map(m => (
									<li key={m.id}>
										{m.tittle} by {m.author}
										<button
											type="button"
											className="btn text-white"
											onClick={() => actions.delete(`minutes/${company}/${m.id}`)}>
											<i className="far fa-trash-alt ml-2" />
										</button>
										<button
											type="button"
											className="btn text-white"
											onClick={() => onLoadMinute(m.id)}>
											<i className="fas fa-eye" />
										</button>
									</li>
								))}
							</ul>
						</div>
						<div className="col" />
					</div>
				</div>
			)}
			<button className="btn" onClick={() => setCollapsed(!collapsed)}>
				<i className="fas fa-angle-double-up" />
			</button>
		</div>
	);
};
Settings.propTypes = {
	onLoadMinute: PropTypes.func
};
export default Settings;
