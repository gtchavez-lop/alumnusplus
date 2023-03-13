import { toast } from "react-hot-toast";

const ToastError = toast.custom((t) => (
	<div className="toast">
		<div className="alert alert-info">
			<div>
				<span>New message arrived.</span>
			</div>
		</div>
	</div>
));

export { ToastError };
