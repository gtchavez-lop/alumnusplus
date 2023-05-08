import React, { FC } from "react";

const ActionProvider: FC<{ children: FC[] | string }> = ({ children }) => {
	return (
		<div>
			{/* {React.Children.map(children, (child) => {
				return React.cloneElement(child, {
					actions: {},
				});
			})} */}
		</div>
	);
};

export default ActionProvider;
