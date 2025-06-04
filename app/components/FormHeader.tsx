import React, { useState, useRef, useEffect } from "react";

export function FormHeader() {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (isEditingDescription && textareaRef.current) {
      // Reset height first to get accurate scrollHeight
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditingDescription, description]);

  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);

    // Auto-resize as user types
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setIsEditingDescription(false);
    } else if (e.key === "Enter" && e.ctrlKey) {
      // Save on Ctrl+Enter
      setIsEditingDescription(false);
    }
  };

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
  };

  return (
    <div className="w-full">
      {isEditingDescription ? (
        <textarea
          ref={textareaRef}
          value={description}
          onChange={handleDescriptionChange}
          onKeyDown={handleDescriptionKeyDown}
          onBlur={handleDescriptionBlur}
          autoFocus
          className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded min-h-[80px] resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter form description..."
          style={{
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
      ) : (
        <div
          className="w-full cursor-pointer hover:bg-gray-100 rounded"
          onClick={handleDescriptionClick}
          style={{ width: '100%' }}
        >
          <p className="text-sm text-gray-600 px-4 py-2 w-full">
            {description || "Add a description (optional)"}
          </p>
        </div>
      )}
    </div>
  );
}