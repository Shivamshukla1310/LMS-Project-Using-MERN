import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const RichTextEditor = ({ input, setInput }) => {
  const [value, setValue] = useState(input || "");

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={(val) => {
        setValue(val);
        setInput(val);
      }}
      placeholder="Write something amazing..."
      className="h-64"
    />
  );
};

export default RichTextEditor;
