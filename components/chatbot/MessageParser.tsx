import React, { FC } from "react";

const MessageParser: FC = () => {
	const parse = (message: string) => {
		console.log(message);
	};

	return (
		<div className="fixed bottom-0 right-0">
			{/* {React.Children.map(children, (child) => {
				return React.cloneElement(child, {
					parse: parse,
					actions: {},
				});
			})} */}
		</div>
	);
};

export default MessageParser;
