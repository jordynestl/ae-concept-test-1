import React, { useState, useRef, useEffect } from "react";
import { X, Plus, GripVertical, Trash2, Check, Image as ImageIcon, LayoutIcon, List } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { FormFieldType, Option, FieldType } from "./FormField";
import { applyFormatting, sanitizeHtml } from "../utils/richTextUtils";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type FieldEditorProps = {
  field: FormFieldType;
  onSave: (field: FormFieldType) => void;
  onCancel: () => void;
  onDuplicate?: (field: FormFieldType) => void;
  onDelete?: (id: string) => void;
  onFieldChange?: (updatedField: FormFieldType) => void;
};

export function FieldEditor({ field, onSave, onCancel, onDuplicate, onDelete, onFieldChange }: FieldEditorProps) {
  const [editedField, setEditedField] = useState<FormFieldType>({ ...field });
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [newOption, setNewOption] = useState("");
  const [imageUrl, setImageUrl] = useState(field.imageUrl || "");
  
  // For drag and drop of ranking options
  const [draggedOptionIndex, setDraggedOptionIndex] = useState<number | null>(null);
  const [dropTargetOptionIndex, setDropTargetOptionIndex] = useState<number | null>(null);

  // For rich text editing
  const [hasFocus, setHasFocus] = useState(false);
  const [editorHeight, setEditorHeight] = useState<number>(44); // Initial minimum height
  const editorRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // Initialize the editor content when the component mounts
  useEffect(() => {
    if (editorRef.current) {
      if (editedField.formattedQuestion) {
        editorRef.current.innerHTML = sanitizeHtml(editedField.formattedQuestion);
      } else if (editedField.question && editedField.question !== "Type your question here") {
        editorRef.current.innerText = editedField.question;
      } else {
        // Leave it empty to show the placeholder
        editorRef.current.innerText = "";
      }
      
      // Initialize height after content is set
      setTimeout(updateEditorHeight, 0);
    }
  }, []);
  
  // Update height when content changes or on window resize
  useEffect(() => {
    const handleResize = () => {
      updateEditorHeight();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTypeChange = (type: FieldType) => {
    setEditedField((prev) => {
      // Common handlers for multiple field types
      if (
        ["multiple_choice", "dropdown", "checkbox", "ranking"].includes(type) &&
        (!prev.options || prev.options.length === 0)
      ) {
        return {
          ...prev,
          type,
          options: [
            { id: uuidv4(), value: "Option 1" },
            { id: uuidv4(), value: "Option 2" },
          ],
        };
      }

      // Special handling for section type - remove options if they exist
      if (type === "section" && prev.options) {
        return {
          ...prev,
          type,
          options: [],
          question: "Section Title",
        };
      }
      
      // Special handling for image type
      if (type === "image") {
        return {
          ...prev,
          type,
          question: "Image Question",
          imageUrl: prev.imageUrl || "",
        };
      }
      
      return { ...prev, type };
    });
    setIsTypeDropdownOpen(false);
  };

  // Handle formatting button clicks
  const handleFormat = (command: string, value: string = '') => {
    if (editorRef.current) {
      // Focus the editor if it's not already focused
      if (!hasFocus) {
        editorRef.current.focus();
      }
      
      // Apply the formatting command
      applyFormatting(command, value);
      
      // Update the formatted question value
      setEditedField(prev => ({
        ...prev,
        formattedQuestion: editorRef.current?.innerHTML || '',
        question: editorRef.current?.textContent || ''
      }));
      
      // Check if height needs adjustment after formatting
      updateEditorHeight();
    }
  };

  // Update field when editor content changes
  const handleEditorChange = () => {
    if (editorRef.current) {
      setEditedField(prev => ({
        ...prev,
        formattedQuestion: editorRef.current?.innerHTML || '',
        question: editorRef.current?.textContent || ''
      }));
      
      // Auto-resize based on content
      updateEditorHeight();
    }
  };
  
  // Function to update editor height based on content
  const updateEditorHeight = () => {
    if (editorRef.current) {
      // Reset the height temporarily to get the correct scrollHeight
      editorRef.current.style.height = 'auto';
      
      // Get the scrollHeight and add a little extra space for comfort
      const scrollHeight = editorRef.current.scrollHeight;
      
      // Set a minimum height of 44px
      const newHeight = Math.max(44, scrollHeight);
      
      // Update the height
      editorRef.current.style.height = `${newHeight}px`;
      setEditorHeight(newHeight);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setEditedField(prev => ({
      ...prev,
      imageUrl: e.target.value
    }));
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedField(prev => ({
      ...prev,
      description: e.target.value
    }));
  };

  const handleToggleRequired = () => {
    // Don't allow "required" for section or image types
    if (["section", "image"].includes(editedField.type)) {
      return;
    }
    
    setEditedField((prev) => ({ ...prev, required: !prev.required }));
  };

  const handleOptionChange = (id: string, value: string) => {
    setEditedField((prev) => {
      const updatedField = {
        ...prev,
        options: prev.options?.map((opt) =>
          opt.id === id ? { ...opt, value } : opt
        ),
      };
      
      // Update parent component state if handler exists and it's a ranking question
      if (onFieldChange && prev.type === "ranking") {
        onFieldChange(updatedField);
      }
      
      return updatedField;
    });
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      const newOpt = { id: uuidv4(), value: newOption };
      setEditedField((prev) => {
        const updatedField = {
          ...prev,
          options: [...(prev.options || []), newOpt],
        };
        
        // Update parent component state if handler exists and it's a ranking question
        if (onFieldChange && prev.type === "ranking") {
          onFieldChange(updatedField);
        }
        
        return updatedField;
      });
      setNewOption("");
    } else {
      // Add empty option when clicking the + button
      const newOpt = { id: uuidv4(), value: `Option ${(editedField.options?.length || 0) + 1}` };
      setEditedField((prev) => {
        const updatedField = {
          ...prev,
          options: [...(prev.options || []), newOpt],
        };
        
        // Update parent component state if handler exists and it's a ranking question
        if (onFieldChange && prev.type === "ranking") {
          onFieldChange(updatedField);
        }
        
        return updatedField;
      });
    }
  };

  const handleAddOtherOption = () => {
    const newOpt = { id: uuidv4(), value: "Other" };
    setEditedField((prev) => {
      const updatedField = {
        ...prev,
        options: [...(prev.options || []), newOpt],
      };
      
      // Update parent component state if handler exists and it's a ranking question
      if (onFieldChange && prev.type === "ranking") {
        onFieldChange(updatedField);
      }
      
      return updatedField;
    });
  };

  const handleDeleteOption = (id: string) => {
    setEditedField((prev) => {
      const updatedField = {
        ...prev,
        options: prev.options?.filter((opt) => opt.id !== id),
      };
      
      // Update parent component state if handler exists and it's a ranking question
      if (onFieldChange && prev.type === "ranking") {
        onFieldChange(updatedField);
      }
      
      return updatedField;
    });
  };

  const handleSave = () => {
    // Make sure we have the latest content from the editor
    if (editorRef.current) {
      const updatedField = {
        ...editedField,
        formattedQuestion: editorRef.current.innerHTML,
        question: editorRef.current.textContent || editedField.question,
        description: descriptionRef.current?.value || editedField.description,
      };
      onSave(updatedField);
    } else {
      onSave(editedField);
    }
  };

  // Handler for duplicating the field
  const handleDuplicateField = () => {
    if (onDuplicate) {
      // Make sure we have the most up-to-date field content before duplicating
      let currentField = { ...editedField };
      if (editorRef.current) {
        currentField = {
          ...currentField,
          formattedQuestion: editorRef.current.innerHTML,
          question: editorRef.current.textContent || editedField.question,
          description: descriptionRef.current?.value || editedField.description,
        };
      }
      
      onDuplicate(currentField);
    }
  };
  
  // Handler for deleting the field
  const handleDeleteField = () => {
    if (onDelete) {
      onDelete(field.id);
    }
  };

  const renderOptionType = () => {
    switch (editedField.type) {
      case "multiple_choice":
        return "radio";
      case "checkbox":
        return "checkbox";
      case "ranking":
        return "ranking";
      default:
        return null;
    }
  };

  const needsOptions = ["multiple_choice", "dropdown", "checkbox", "ranking"].includes(editedField.type);
  const isSpecialType = ["section", "image"].includes(editedField.type);
  
  const renderSpecialFields = () => {
    switch (editedField.type) {
      case "section":
        return (
          <div className="pl-6 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              ref={descriptionRef}
              value={editedField.description || ""}
              onChange={handleDescriptionChange}
              className="w-full p-2 border border-black rounded-sm min-h-[100px]"
              placeholder="Add a description for this section"
            />
          </div>
        );
      case "image":
        return (
          <div className="pl-6 mt-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={handleImageUrlChange}
                className="w-full p-2 border border-black rounded-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            {imageUrl && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preview
                </label>
                <div className="border border-gray-300 rounded p-2">
                  <ImageWithFallback
                    src={imageUrl}
                    alt="Preview"
                    className="max-w-full max-h-[200px] object-contain mx-auto"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caption (optional)
              </label>
              <textarea
                ref={descriptionRef}
                value={editedField.description || ""}
                onChange={handleDescriptionChange}
                className="w-full p-2 border border-black rounded-sm"
                placeholder="Add a caption for this image"
                rows={2}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getFieldTypeIcon = (type: FieldType) => {
    switch (type) {
      case "multiple_choice":
        return (
          <div className="size-5">
            <svg className="block size-full" fill="none" viewBox="0 0 20 20">
              <g id="radio_button_checked">
                <g id="Vector">
                  <path d="M10 14.1667C12.3012 14.1667 14.1667 12.3012 14.1667 10C14.1667 7.69881 12.3012 5.83333 10 5.83333C7.69881 5.83333 5.83333 7.69881 5.83333 10C5.83333 12.3012 7.69881 14.1667 10 14.1667Z" fill="black" />
                  <path d="M10 1.66667C5.4 1.66667 1.66667 5.4 1.66667 10C1.66667 14.6 5.4 18.3333 10 18.3333C14.6 18.3333 18.3333 14.6 18.3333 10C18.3333 5.4 14.6 1.66667 10 1.66667ZM10 16.6667C6.31667 16.6667 3.33333 13.6833 3.33333 10C3.33333 6.31667 6.31667 3.33333 10 3.33333C13.6833 3.33333 16.6667 6.31667 16.6667 10C16.6667 13.6833 13.6833 16.6667 10 16.6667Z" fill="black" />
                </g>
              </g>
            </svg>
          </div>
        );
      case "dropdown":
        return (
          <div className="size-5">
            <svg className="block size-full" fill="none" viewBox="0 0 20 20">
              <path d="M4 6H16V8H4V6ZM4 9H16V11H4V9ZM4 12H16V14H4V12Z" fill="black" />
            </svg>
          </div>
        );
      case "free_text":
        return (
          <div className="size-5">
            <svg className="block size-full" fill="none" viewBox="0 0 20 20">
              <path d="M16 4H4V16H10V14H6V6H14V10H16V4Z" fill="black" />
              <path d="M12 16H14V12H18V10H14V6H12V10H8V12H12V16Z" fill="black" />
            </svg>
          </div>
        );
      case "checkbox":
        return (
          <div className="size-5">
            <svg className="block size-full" fill="none" viewBox="0 0 20 20">
              <rect x="3" y="3" width="14" height="14" rx="2" stroke="black" strokeWidth="2" />
            </svg>
          </div>
        );
      case "section":
        return (
          <div className="size-5">
            <svg className="block size-full" fill="none" viewBox="0 0 20 20">
              <path d="M2 4H18V6H2V4ZM2 9H18V11H2V9ZM2 14H12V16H2V14Z" fill="black" />
            </svg>
          </div>
        );
      case "image":
        return (
          <div className="size-5">
            <svg className="block size-full" fill="none" viewBox="0 0 20 20">
              <path d="M16.8 2H3.2C2.54 2 2 2.54 2 3.2V16.8C2 17.46 2.54 18 3.2 18H16.8C17.46 18 18 17.46 18 16.8V3.2C18 2.54 17.46 2 16.8 2ZM16 15.4H4V4H16V15.4ZM11.6 10.8L9.2 13.8L7.6 12L5.2 15H14.8L11.6 10.8Z" fill="black" />
            </svg>
          </div>
        );
      case "ranking":
        return (
          <div className="size-5">
            <svg className="block size-full" fill="none" viewBox="0 0 20 20">
              <path d="M2 4H6V6H2V4ZM2 8H6V10H2V8ZM2 12H6V14H2V12ZM8 4H18V6H8V4ZM8 8H18V10H8V8ZM8 12H18V14H8V12Z" fill="black" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getFieldTypeName = (type: FieldType) => {
    switch (type) {
      case "multiple_choice":
        return "Multiple choice";
      case "dropdown":
        return "Dropdown";
      case "free_text":
        return "Free text";
      case "checkbox":
        return "Checkbox";
      case "section":
        return "Section";
      case "image":
        return "Image";
      case "ranking":
        return "Ranking";
      default:
        return "Unknown type";
    }
  };

  return (
    <div className="bg-[#f8f8f8] p-4 mb-4 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-6 w-full items-center">
          <div className="flex flex-row h-full gap-2 items-start w-[584px]" ref={dropdownRef}>
            <div 
              className="bg-white border border-black rounded-sm grow"
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            >
              <div className="flex flex-row items-center px-4 py-2 w-full">
                <div className="flex items-center gap-2 grow">
                  {getFieldTypeIcon(editedField.type)}
                  <span>{getFieldTypeName(editedField.type)}</span>
                </div>
                <div className="size-5">
                  <svg 
                    className={`block size-full transform ${isTypeDropdownOpen ? 'rotate-180' : ''} transition-transform`} 
                    fill="none" 
                    viewBox="0 0 20 20"
                  >
                    <g id="expand_more">
                      <path d="M13.825 6.9125L10 10.7292L6.175 6.9125L5 8.0875L10 13.0875L15 8.0875L13.825 6.9125Z" fill="black" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            
            {!isSpecialType && (
              <div className="flex items-center gap-2">
                <div 
                  className={`h-4 w-8 rounded ${editedField.required ? "bg-[#A9ABB4]" : "bg-[#D9D9D9]"} relative cursor-pointer`} 
                  onClick={handleToggleRequired}
                >
                  <div className={`h-8 w-8 bg-white rounded-full absolute top-[-50%] transition-all ${editedField.required ? 'left-[16px]' : 'left-[-6px]'}`}></div>
                </div>
                <span>Required</span>
              </div>
            )}
            
            {/* Field type dropdown menu */}
            {isTypeDropdownOpen && (
              <div className="absolute bg-white border border-gray-300 rounded shadow-lg mt-10 z-10 w-[584px]">
                <div className="py-1">
                  {(['multiple_choice', 'dropdown', 'free_text', 'checkbox', 'section', 'image', 'ranking'] as FieldType[]).map((type) => (
                    <div 
                      key={type}
                      className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 ${editedField.type === type ? 'bg-gray-100' : ''}`}
                      onClick={() => handleTypeChange(type)}
                    >
                      {getFieldTypeIcon(type)}
                      <span>{getFieldTypeName(type)}</span>
                      {editedField.type === type && (
                        <Check size={16} className="ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
  
        <div className="h-0 w-full border-t border-black"></div>
  
        <div className="w-full">
          <div className="flex flex-col gap-4">
            {/* Question input field with rich text toolbar directly above it */}
            <div className="flex flex-row mt-2">
              {/* We don't show number for section and image types */}
              {editedField.type !== "section" && editedField.type !== "image" && (
                <div className="w-6 mr-2">1.</div>
              )}
              <div className="grow flex flex-col">
                {/* Rich text toolbar - Now spans full width with functional buttons */}
                <div className="w-full border border-black border-b-0 rounded-t-sm bg-gray-50 flex">
                  <div className="flex flex-1 overflow-x-auto">
                    {/* Bold */}
                    <button 
                      className="border-r border-black p-1 hover:bg-gray-200"
                      onClick={() => handleFormat('bold')}
                      type="button"
                    >
                      <div className="size-4">
                        <svg className="block size-full" fill="none" viewBox="0 0 16 16">
                          <path fillRule="evenodd" clipRule="evenodd" d="M4 3.33333C4 2.96514 4.29848 2.66667 4.66667 2.66667H8.66667C9.46232 2.66667 10.2254 2.98274 10.788 3.54535C11.3506 4.10796 11.6667 4.87102 11.6667 5.66667C11.6667 6.43878 11.369 7.1802 10.8373 7.73753C11.0609 7.8671 11.2687 8.02609 11.4547 8.21201C12.0173 8.77462 12.3333 9.53768 12.3333 10.3333C12.3333 11.129 12.0173 11.892 11.4547 12.4547C10.892 13.0173 10.129 13.3333 9.33333 13.3333H4.66667C4.29848 13.3333 4 13.0349 4 12.6667V3.33333ZM8.66667 7.33333C9.10869 7.33333 9.53262 7.15774 9.84518 6.84518C10.1577 6.53262 10.3333 6.10869 10.3333 5.66667C10.3333 5.22464 10.1577 4.80072 9.84518 4.48816C9.53262 4.17559 9.10869 4 8.66667 4H5.33333V7.33333H8.66667ZM5.33333 8.66667H9.33333C9.77536 8.66667 10.1993 8.84226 10.5118 9.15482C10.8244 9.46738 11 9.8913 11 10.3333C11 10.7754 10.8244 11.1993 10.5118 11.5118C10.1993 11.8244 9.77536 12 9.33333 12H5.33333V8.66667Z" fill="black"/>
                        </svg>
                      </div>
                    </button>
                    
                    {/* Italic */}
                    <button 
                      className="border-r border-black p-1 hover:bg-gray-200"
                      onClick={() => handleFormat('italic')}
                      type="button"
                    >
                      <div className="size-4">
                        <svg className="block size-full" fill="none" viewBox="0 0 16 16">
                          <path fillRule="evenodd" clipRule="evenodd" d="M9.31794 2.66667H7.33333C6.96514 2.66667 6.66667 2.96514 6.66667 3.33333C6.66667 3.70152 6.96514 4 7.33333 4H8.44951L6.1638 12H4.66667C4.29848 12 4 12.2985 4 12.6667C4 13.0349 4.29848 13.3333 4.66667 13.3333H6.65193C6.662 13.3336 6.67205 13.3336 6.68206 13.3333H8.66667C9.03486 13.3333 9.33333 13.0349 9.33333 12.6667C9.33333 12.2985 9.03486 12 8.66667 12H7.55049L9.8362 4H11.3333C11.7015 4 12 3.70152 12 3.33333C12 2.96514 11.7015 2.66667 11.3333 2.66667H9.34807C9.338 2.66644 9.32795 2.66644 9.31794 2.66667Z" fill="black"/>
                        </svg>
                      </div>
                    </button>
                    
                    {/* Strikethrough */}
                    <button 
                      className="border-r border-black p-1 hover:bg-gray-200"
                      onClick={() => handleFormat('strikeThrough')}
                      type="button"
                    >
                      <div className="size-4">
                        <svg className="block size-full" fill="none" viewBox="0 0 16 16">
                          <path fillRule="evenodd" clipRule="evenodd" d="M7.99488 2.66668C8.66819 2.65664 9.345 2.7601 9.91842 2.97513C10.4738 3.1834 10.9993 3.52344 11.2593 4.02798C11.4279 4.35527 11.2993 4.75731 10.972 4.92596C10.6447 5.09462 10.2427 4.96601 10.0741 4.63872C10.0317 4.55654 9.86429 4.37883 9.45025 4.22357C9.0558 4.07565 8.5466 3.99145 8.01055 3.99993L8 4.00002H7.33333C6.89131 4.00002 6.46738 4.17561 6.15482 4.48817C5.84226 4.80073 5.66667 5.22466 5.66667 5.66668C5.66667 6.10871 5.84226 6.53263 6.15482 6.84519C6.46565 7.15602 6.8866 7.3314 7.32598 7.33333H12.6667C13.0349 7.33333 13.3333 7.63181 13.3333 8C13.3333 8.36819 13.0349 8.66667 12.6667 8.66667H11.1611C11.4883 9.15641 11.6667 9.73568 11.6667 10.3333C11.6667 11.129 11.3506 11.8921 10.788 12.4547C10.2254 13.0173 9.46232 13.3333 8.66667 13.3333H7.67179C6.99848 13.3434 6.32167 13.2399 5.74825 13.0249C5.19287 12.8166 4.66737 12.4766 4.40739 11.9721C4.23873 11.6448 4.36734 11.2427 4.69463 11.0741C5.02192 10.9054 5.42396 11.034 5.59261 11.3613C5.63496 11.4435 5.80238 11.6212 6.21641 11.7765C6.61087 11.9244 7.12007 12.0086 7.65612 12.0001L7.66667 12H8.66667C9.10869 12 9.53262 11.8244 9.84518 11.5119C10.1577 11.1993 10.3333 10.7754 10.3333 10.3333C10.3333 9.89132 10.1577 9.4674 9.84518 9.15484C9.53262 8.84228 9.10869 8.66668 8.66667 8.66668H7.33333C7.33001 8.66668 7.32669 8.66668 7.32337 8.66667H3.33333C2.96514 8.66667 2.66667 8.36819 2.66667 8C2.66667 7.63181 2.96514 7.33333 3.33333 7.33333H4.83887C4.51167 6.8436 4.33333 6.26433 4.33333 5.66668C4.33333 4.87103 4.6494 4.10797 5.21201 3.54536C5.77462 2.98275 6.53768 2.66668 7.33333 2.66668H7.99488Z" fill="black"/>
                        </svg>
                      </div>
                    </button>
                    
                    {/* Underline */}
                    <button 
                      className="border-r border-black p-1 hover:bg-gray-200"
                      onClick={() => handleFormat('underline')}
                      type="button"
                    >
                      <div className="size-4">
                        <svg className="block size-full" fill="none" viewBox="0 0 16 16">
                          <path fillRule="evenodd" clipRule="evenodd" d="M2.66667 12.6667C2.66667 12.2985 2.96514 12 3.33333 12H12.6667C13.0349 12 13.3333 12.2985 13.3333 12.6667C13.3333 13.0349 13.0349 13.3333 12.6667 13.3333H3.33333C2.96514 13.3333 2.66667 13.0349 2.66667 12.6667Z" fill="black"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M4.66667 2.66667C5.03486 2.66667 5.33333 2.96514 5.33333 3.33333V6.66667C5.33333 7.37391 5.61428 8.05219 6.11438 8.55228C6.61448 9.05238 7.29276 9.33333 8 9.33333C8.70724 9.33333 9.38552 9.05238 9.88562 8.55228C10.3857 8.05219 10.6667 7.37391 10.6667 6.66667V3.33333C10.6667 2.96514 10.9651 2.66667 11.3333 2.66667C11.7015 2.66667 12 2.96514 12 3.33333V6.66667C12 7.72753 11.5786 8.74495 10.8284 9.49509C10.0783 10.2452 9.06087 10.6667 8 10.6667C6.93913 10.6667 5.92172 10.2452 5.17157 9.49509C4.42143 8.74495 4 7.72753 4 6.66667V3.33333C4 2.96514 4.29848 2.66667 4.66667 2.66667Z" fill="black"/>
                        </svg>
                      </div>
                    </button>
                    
                    {/* Clear Formatting */}
                    <button 
                      className="border-r border-black p-1 hover:bg-gray-200"
                      onClick={() => handleFormat('removeFormat')}
                      type="button"
                    >
                      <div className="size-4">
                        <svg className="block size-full" fill="none" viewBox="0 0 16 16">
                          <path fillRule="evenodd" clipRule="evenodd" d="M8.65127 2.66667H4.66667C4.29848 2.66667 4 2.96514 4 3.33333V4C4 4.36819 4.29848 4.66667 4.66667 4.66667C5.03486 4.66667 5.33333 4.36819 5.33333 4H7.78285L5.49713 12H4.66667C4.29848 12 4 12.2985 4 12.6667C4 13.0349 4.29848 13.3333 4.66667 13.3333H5.98526C5.99533 13.3336 6.00538 13.3336 6.0154 13.3333H7.33333C7.70152 13.3333 8 13.0349 8 12.6667C8 12.2985 7.70152 12 7.33333 12H6.88382L9.16953 4H11.3333C11.3333 4.36819 11.6318 4.66667 12 4.66667C12.3682 4.66667 12.6667 4.36819 12.6667 4V3.33333C12.6667 2.96514 12.3682 2.66667 12 2.66667H8.6814C8.67133 2.66644 8.66129 2.66644 8.65127 2.66667ZM10.8619 10.4714C10.6016 10.2111 10.6016 9.78894 10.8619 9.5286C11.1223 9.26825 11.5444 9.26825 11.8047 9.5286L12.6667 10.3905L13.5286 9.5286C13.7889 9.26825 14.2111 9.26825 14.4714 9.5286C14.7318 9.78894 14.7318 10.2111 14.4714 10.4714L13.6095 11.3333L14.4714 12.1953C14.7318 12.4556 14.7318 12.8777 14.4714 13.1381C14.2111 13.3984 13.7889 13.3984 13.5286 13.1381L12.6667 12.2761L11.8047 13.1381C11.5444 13.3984 11.1223 13.3984 10.8619 13.1381C10.6016 12.8777 10.6016 12.4556 10.8619 12.1953L11.7239 11.3333L10.8619 10.4714Z" fill="black"/>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Rich Text Editor - contentEditable div instead of input */}
                <div 
                  className={`bg-white border border-black rounded-b-sm w-full overflow-hidden ${editedField.type === "section" ? "text-xl font-bold" : ""}`}
                  contentEditable
                  ref={editorRef}
                  onInput={handleEditorChange}
                  onFocus={() => setHasFocus(true)}
                  onBlur={() => setHasFocus(false)}
                  suppressContentEditableWarning={true}
                  role="textbox"
                  aria-multiline="true"
                  aria-label="Question text"
                  style={{ 
                    padding: '0.75rem 1rem', 
                    outline: 'none',
                    minHeight: '44px',
                    height: `${editorHeight}px`,
                    transition: 'height 0.1s ease'
                  }}
                  data-placeholder="Type your question here..."
                />
              </div>
            </div>
  
            {/* Render special fields for section and image types */}
            {isSpecialType && renderSpecialFields()}
            
            {/* Options for multiple choice, dropdown, checkbox, or ranking */}
            {needsOptions && (
              <div className="pl-6 space-y-2">
                {editedField.options?.map((option, i) => (
                  <div 
                    key={option.id} 
                    className={`flex flex-row items-center gap-4 w-full ${
                      draggedOptionIndex === i ? 'opacity-50' : 'opacity-100'
                    } ${
                      dropTargetOptionIndex === i ? 'border-blue-500 border-2 rounded-sm' : ''
                    }`}
                    onDragOver={(e) => {
                      if (needsOptions) {
                        e.preventDefault();
                        if (draggedOptionIndex !== null && draggedOptionIndex !== i) {
                          setDropTargetOptionIndex(i);
                        }
                      }
                    }}
                    onDragLeave={() => {
                      if (needsOptions) {
                        setDropTargetOptionIndex(null);
                      }
                    }}
                    onDrop={(e) => {
                      if (needsOptions) {
                        e.preventDefault();
                        if (draggedOptionIndex !== null && draggedOptionIndex !== i) {
                          // Reorder the options
                          const newOptions = [...editedField.options!];
                          const [movedOption] = newOptions.splice(draggedOptionIndex, 1);
                          newOptions.splice(i, 0, movedOption);
                          
                          // Update local state and parent state
                          setEditedField(prev => {
                            const updatedField = {
                              ...prev,
                              options: newOptions
                            };
                            
                            // Also update parent component state if handler exists
                            if (onFieldChange) {
                              onFieldChange(updatedField);
                            }
                            
                            return updatedField;
                          });
                          
                          setDraggedOptionIndex(null);
                          setDropTargetOptionIndex(null);
                        }
                      }
                    }}
                  >
                    <div className="basis-0 grow min-h-px min-w-px bg-white border border-black rounded-sm">
                      <div className="flex px-4 py-2 gap-2 items-start">
                        <div className="flex gap-2 items-center">
                          {renderOptionType() === "radio" && (
                            <div className="size-5">
                              <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                                <g id="radio_button_checked">
                                  <g id="Vector">
                                    <path d="M10 14.1667C12.3012 14.1667 14.1667 12.3012 14.1667 10C14.1667 7.69881 12.3012 5.83333 10 5.83333C7.69881 5.83333 5.83333 7.69881 5.83333 10C5.83333 12.3012 7.69881 14.1667 10 14.1667Z" fill="black" />
                                    <path d="M10 1.66667C5.4 1.66667 1.66667 5.4 1.66667 10C1.66667 14.6 5.4 18.3333 10 18.3333C14.6 18.3333 18.3333 14.6 18.3333 10C18.3333 5.4 14.6 1.66667 10 1.66667ZM10 16.6667C6.31667 16.6667 3.33333 13.6833 3.33333 10C3.33333 6.31667 6.31667 3.33333 10 3.33333C13.6833 3.33333 16.6667 6.31667 16.6667 10C16.6667 13.6833 13.6833 16.6667 10 16.6667Z" fill="black" />
                                  </g>
                                </g>
                              </svg>
                            </div>
                          )}
                          {renderOptionType() === "checkbox" && (
                            <input type="checkbox" className="size-4" disabled />
                          )}
                          {renderOptionType() === "ranking" && (
                            <div className="flex-shrink-0 bg-gray-200 size-6 flex items-center justify-center rounded">
                              {i + 1}
                            </div>
                          )}
                          <input
                            type="text"
                            className="outline-none grow"
                            value={option.value}
                            onChange={(e) => handleOptionChange(option.id, e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div 
                      className="cursor-grab active:cursor-grabbing"
                      draggable={needsOptions}
                      onDragStart={(e) => {
                        e.stopPropagation();
                        setDraggedOptionIndex(i);
                        
                        // Create a custom drag image
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        const ghostEl = document.createElement('div');
                        ghostEl.style.width = `${rect.width}px`;
                        ghostEl.style.height = `${rect.height}px`;
                        ghostEl.style.backgroundColor = '#f8f8f8';
                        ghostEl.style.border = '2px dashed #ccc';
                        ghostEl.style.borderRadius = '4px';
                        ghostEl.style.padding = '8px';
                        ghostEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        ghostEl.style.position = 'absolute';
                        ghostEl.style.top = '-1000px';
                        ghostEl.style.display = 'flex';
                        ghostEl.style.alignItems = 'center';
                        ghostEl.style.gap = '8px';
                        
                        const textEl = document.createElement('div');
                        textEl.textContent = option.value;
                        
                        ghostEl.appendChild(textEl);
                        
                        document.body.appendChild(ghostEl);
                        e.dataTransfer.setDragImage(ghostEl, 20, 20);
                        
                        setTimeout(() => {
                          document.body.removeChild(ghostEl);
                        }, 0);
                      }}
                      onDragEnd={() => {
                        setDraggedOptionIndex(null);
                        setDropTargetOptionIndex(null);
                      }}
                    >
                      <GripVertical size={24} className="text-gray-700" />
                    </div>
                    <Plus size={24} className="cursor-pointer" onClick={handleAddOption} />
                    <Trash2 size={24} className="cursor-pointer" onClick={() => handleDeleteOption(option.id)} />
                  </div>
                ))}
                
                <div className="flex flex-row gap-2">
                  <div 
                    className="bg-[#d5d5d5] px-2 py-1 rounded-sm cursor-pointer hover:bg-[#c5c5c5]"
                    onClick={handleAddOption}
                  >
                    Add option
                  </div>
                  <div 
                    className="bg-[#d5d5d5] px-2 py-1 rounded-sm cursor-pointer hover:bg-[#c5c5c5]"
                    onClick={handleAddOtherOption}
                  >
                    Add 'Others' option
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
  
        <div className="flex flex-row w-full items-center gap-2">
          <div className="h-[1px] grow bg-[#CCCCCC] opacity-80"></div>
          <div className="bg-[rgba(204,204,204,0.8)] px-2 py-1 rounded-sm">
            Add display condition
          </div>
          <div className="h-[1px] grow bg-[#CCCCCC] opacity-80"></div>
        </div>
  
        <div className="flex flex-row justify-end gap-[26px] items-center">
          <div 
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleDuplicateField}
          >
            <div className="size-6">
              <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                <g id="library_add">
                  <path d="M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6ZM20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H8V4H20V16ZM13 14H15V11H18V9H15V6H13V9H10V11H13V14Z" fill="black" />
                </g>
              </svg>
            </div>
            <span>Duplicate field</span>
          </div>
  
          <div 
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleDeleteField}
          >
            <div className="size-6">
              <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                <g id="delete">
                  <path d="M16.4444 8.66667V19.7778H7.55556V8.66667H16.4444ZM14.7778 2H9.22222L8.11111 3.11111H4.22222V5.33333H19.7778V3.11111H15.8889L14.7778 2ZM18.6667 6.44444H5.33333V19.7778C5.33333 21 6.33333 22 7.55556 22H16.4444C17.6667 22 18.6667 21 18.6667 19.7778V6.44444Z" fill="black" />
                </g>
              </svg>
            </div>
            <span>Delete field</span>
          </div>
  
          <div 
            className="bg-black text-white px-2 py-1 rounded-sm cursor-pointer hover:bg-[#333]"
            onClick={handleSave}
          >
            Save field
          </div>
        </div>
      </div>
    </div>
  );
}