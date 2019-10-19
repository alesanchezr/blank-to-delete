import React from "react";
import Select from "react-select";
import chroma from "chroma-js";

const SmartSelect = params => (
	<Select
		{...params}
		components={{ DropdownIndicator: null }}
		styles={{
			option: (styles, { data, isDisabled, isFocused, isSelected }) => {
				const bgColor = chroma(data.bgColor || "#f2f2f2");
				return {
					...styles,
					color: data.color,
					cursor: "pointer",
					backgroundColor: isDisabled
						? null
						: isSelected
							? bgColor.css()
							: isFocused
								? bgColor.alpha(0.7).css()
								: bgColor.css()
				};
			},
			singleValue: (styles, { data }) => {
				return {
					...styles,
					color: data.bgColor,
					fontWeight: 900
				};
			},
			control: () => ({
				// none of react-select's styles are passed to <Control />
				borderColor: "white",
				// align-items: center;
				// background-color: hsl(0,0%,100%);
				// border-color: hsl(0,0%,80%);
				// border-radius: 4px;
				// border-style: solid;
				// border-width: 1px;
				// cursor: default;
				// display: -webkit-box;
				// display: -webkit-flex;
				// display: -ms-flexbox;
				display: "flex"
				// flex-wrap: wrap;
				// justify-content: space-between;
				// min-height: 38px;
				// outline: 0 !important;
				// position: relative;
				// transition: all 100ms;
				// box-sizing: border-box;
			})
		}}
	/>
);
export default SmartSelect;
