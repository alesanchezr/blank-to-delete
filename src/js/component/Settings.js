import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import SmartSelect from "./SmartSelect";
import { Notify } from "bc-react-notifier";
import { AppContext } from "../context";
import { AddCompanyModal } from "./modals";

const Settings = ({ onLoadMinute, collapsed }) => {
	const { store, actions } = useContext(AppContext);
	const [_collapsed, setCollapsed] = useState(collapsed);
	const [pageLimit, setPageLimit] = useState(5);
	const { company } = store.settings;
	const _onChange = values => actions.saveSettings({ ...store.settings, ...values });
	return (
		<div className={`settings navbar-dark bg-dark text-center ${_collapsed ? "" : "_collapsed"}`}>
			{_collapsed && (
				<div className="text-left container">
					<h2 className="m-0">Settings</h2>
					<div className="row mt-2">
						<div className="col-6">
							<div className="input-group-prepend w-100">
								<span className="input-group-text" id="basic-addon1">
									Company:
								</span>
								`{" "}
								<SmartSelect
									placeholder="company..."
									className="w-100 input-company"
									options={store.companies
										.map(p => ({ value: p, label: p, bgColor: "#BFBFBF" }))
										.concat([{ value: "_new", label: "add new company", bgColor: "#BFBFBF" }])}
									value={{ value: company, label: company, bgColor: "white" }}
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
								`
							</div>
						</div>
						<div className="col-6">
							<button className="btn float-right text-white" onClick={() => setPageLimit(1000)}>
								view all
							</button>
							<h3>Recent Meetings</h3>
							<ul className="pl-0">
								{store.minutes
									.sort((a, b) => (b.date.isAfter(a.date) ? 1 : -1))
									.slice(0, pageLimit)
									.map(m => (
										<li key={m.id}>
											{m.tittle} by {m.author}
											<button
												type="button"
												className="btn text-white"
												onClick={() => actions.delete(`minutes/${m.id}`)}>
												<i className="far fa-trash-alt" />
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
			<button className="btn collapse-btn" onClick={() => setCollapsed(!_collapsed)}>
				<i className="fas fa-angle-double-up" />
			</button>
		</div>
	);
};
Settings.propTypes = {
	onLoadMinute: PropTypes.func,
	collapsed: PropTypes.bool
};
export default Settings;
