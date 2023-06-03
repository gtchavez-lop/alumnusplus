import { Editor, EditorContent, useEditor } from "@tiptap/react";

import { FC } from "react";
import StarterKit from "@tiptap/starter-kit";

interface TipTapEditorProps {
	setText?: (text: string) => void;
}

const TipTapEditor: FC<TipTapEditorProps> = ({ setText }) => {
	const editor = useEditor({
		extensions: [StarterKit],
		editorProps: {
			attributes: {
				placeholder: "Write content here",
				class: "textarea textarea-primary flex-1 w-full",
			},
		},
		onUpdate: ({ editor }) => {
			//
		},
	}) as Editor;

	return <EditorContent placeholder="Write content here" editor={editor} />;
};

export default TipTapEditor;
