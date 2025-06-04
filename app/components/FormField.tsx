import React, { useState, useRef } from "react";
import { X, GripVertical, Copy, Trash2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { sanitizeHtml } from "../utils/richTextUtils";

export type FieldType = 
  | "multiple_choice" 
  | "dropdown" 
  | "free_text" 
  | "checkbox" 
  | "section"
  | "image"
  | "ranking";

export type Option = {
  id: string;
  value: string;
};

export type FormFieldType = {
  id: string;
  type: FieldType;
  question: string;
  formattedQuestion?: string; // HTML content for rich text
  required: boolean;
  options?: Option[];
  description?: string;
  imageUrl?: string; // For image field type
};

type FormFieldProps = {
  field: FormFieldType;
  isEditing: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, field: FormFieldType, index: number) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onFieldChange?: (updatedField: FormFieldType) => void;
  index: number;
  isDraggedOver?: boolean;
};

export function FormField({
  field,
  isEditing,
  onEdit,
  onDelete,
  onDuplicate,
  onDragStart,
  onDragOver,
  onDrop,
  onFieldChange,
  index,
  isDraggedOver
}: FormFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // State for dragging ranking options
  const [draggedOptionIndex, setDraggedOptionIndex] = useState<number | null>(null);
  const [dropTargetOptionIndex, setDropTargetOptionIndex] = useState<number | null>(null);
  
  const handleEdit = () => {
    onEdit(field.id);
  };

  const handleDelete = () => {
    onDelete(field.id);
  };

  const handleDuplicate = () => {
    onDuplicate(field.id);
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    
    // Add data to the drag event
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/json", JSON.stringify({ id: field.id, index }));
    
    // Create a custom drag image
    if (fieldRef.current) {
      const rect = fieldRef.current.getBoundingClientRect();
      const ghostEl = document.createElement('div');
      ghostEl.style.width = `${rect.width}px`;
      ghostEl.style.height = `${rect.height}px`;
      ghostEl.style.backgroundColor = '#f8f8f8';
      ghostEl.style.border = '2px dashed #ccc';
      ghostEl.style.borderRadius = '4px';
      ghostEl.style.padding = '16px';
      ghostEl.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
      ghostEl.style.position = 'absolute';
      ghostEl.style.top = '-1000px';
      ghostEl.textContent = field.question;
      document.body.appendChild(ghostEl);
      
      e.dataTransfer.setDragImage(ghostEl, 20, 20);
      
      // Clean up the ghost element
      setTimeout(() => {
        document.body.removeChild(ghostEl);
      }, 0);
    }
    
    if (onDragStart) {
      onDragStart(e, field, index);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (onDragOver) {
      onDragOver(e, index);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onDrop) {
      onDrop(e, index);
    }
  };

  // Handlers for option drag and drop (works for all field types with options)
  const handleRankingOptionDragStart = (e: React.DragEvent<HTMLDivElement>, optionIndex: number) => {
    e.stopPropagation(); // Prevent the entire field from being dragged
    setDraggedOptionIndex(optionIndex);
    e.dataTransfer.effectAllowed = "move";
    
    // Create a custom drag image for the option
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
    
    // If it's a ranking field, add the number index
    if (field.type === "ranking") {
      const indexEl = document.createElement('div');
      indexEl.style.backgroundColor = '#e5e5e5';
      indexEl.style.borderRadius = '4px';
      indexEl.style.width = '24px';
      indexEl.style.height = '24px';
      indexEl.style.display = 'flex';
      indexEl.style.alignItems = 'center';
      indexEl.style.justifyContent = 'center';
      indexEl.textContent = `${optionIndex + 1}`;
      ghostEl.appendChild(indexEl);
    }
    
    const textEl = document.createElement('div');
    textEl.textContent = field.options?.[optionIndex].value || '';
    ghostEl.appendChild(textEl);
    
    document.body.appendChild(ghostEl);
    e.dataTransfer.setDragImage(ghostEl, 20, 20);
    
    setTimeout(() => {
      document.body.removeChild(ghostEl);
    }, 0);
  };
  
  const handleRankingOptionDragOver = (e: React.DragEvent<HTMLDivElement>, optionIndex: number) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering the field's dragover
    
    if (draggedOptionIndex === null || draggedOptionIndex === optionIndex) {
      setDropTargetOptionIndex(null);
      return;
    }
    
    setDropTargetOptionIndex(optionIndex);
  };
  
  const handleRankingOptionDragLeave = () => {
    setDropTargetOptionIndex(null);
  };
  
  const handleRankingOptionDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering the field's drop
    
    if (draggedOptionIndex === null || draggedOptionIndex === dropIndex) {
      setDraggedOptionIndex(null);
      setDropTargetOptionIndex(null);
      return;
    }
    
    if (!field.options) {
      setDraggedOptionIndex(null);
      setDropTargetOptionIndex(null);
      return;
    }
    
    // Reorder the options
    const updatedOptions = [...field.options];
    const [draggedItem] = updatedOptions.splice(draggedOptionIndex, 1);
    updatedOptions.splice(dropIndex, 0, draggedItem);
    
    // Create an updated field with the new options order
    const updatedField = {
      ...field,
      options: updatedOptions
    };
    
    // Update the parent component with the changed field
    if (onFieldChange) {
      onFieldChange(updatedField);
    }
    
    setDraggedOptionIndex(null);
    setDropTargetOptionIndex(null);
  };

  // Render question with formatting if available
  const renderQuestion = () => {
    if (field.type === "section") {
      return field.formattedQuestion ? (
        <h2 
          className="text-xl font-bold mb-2"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(field.formattedQuestion) }}
        />
      ) : (
        <h2 className="text-xl font-bold mb-2">{field.question}</h2>
      );
    }
    
    if (field.formattedQuestion) {
      return (
        <p 
          className="mb-2"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(field.formattedQuestion) }}
        />
      );
    }
    return <p className="mb-2">{field.question}</p>;
  };

  const renderOptions = () => {
    switch (field.type) {
      case "multiple_choice":
        return (
          <div className="space-y-2">
            {field.options?.map((option, i) => (
              <div 
                key={option.id} 
                className={`flex items-center gap-2 bg-white border ${
                  dropTargetOptionIndex === i ? 'border-blue-500 border-2' : 'border-gray-200'
                } p-2 rounded shadow-sm ${
                  draggedOptionIndex === i ? 'opacity-50' : 'opacity-100'
                }`}
                onDragOver={(e) => handleRankingOptionDragOver(e, i)}
                onDragLeave={handleRankingOptionDragLeave}
                onDrop={(e) => handleRankingOptionDrop(e, i)}
              >
                <div className="size-5">
                  <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                    <g id="radio_button_unchecked">
                      <path
                        d="M10 1.66667C5.4 1.66667 1.66667 5.4 1.66667 10C1.66667 14.6 5.4 18.3333 10 18.3333C14.6 18.3333 18.3333 14.6 18.3333 10C18.3333 5.4 14.6 1.66667 10 1.66667ZM10 16.6667C6.31667 16.6667 3.33333 13.6833 3.33333 10C3.33333 6.31667 6.31667 3.33333 10 3.33333C13.6833 3.33333 16.6667 6.31667 16.6667 10C16.6667 13.6833 13.6833 16.6667 10 16.6667Z"
                        fill="black"
                      />
                    </g>
                  </svg>
                </div>
                <span>{option.value}</span>
                <div 
                  className="cursor-grab active:cursor-grabbing ml-auto"
                  draggable={true}
                  onDragStart={(e) => handleRankingOptionDragStart(e, i)}
                >
                  <GripVertical size={16} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        );
      case "free_text":
        return (
          <div className="w-full">
            <div className="bg-white border border-black rounded-sm p-2 w-full">
              <div className="text-[rgba(0,0,0,0.41)]">Start typing...</div>
            </div>
            <div className="text-right text-sm mt-1">0/100</div>
          </div>
        );
      case "dropdown":
        return (
          <div className="space-y-2">
            <div className="bg-white border border-black rounded-sm p-2 w-1/2">
              <div className="flex justify-between items-center">
                <span>Select an option</span>
                <span>▼</span>
              </div>
            </div>
            <div className="space-y-2 mt-2">
              {field.options?.map((option, i) => (
                <div 
                  key={option.id} 
                  className={`flex items-center gap-2 bg-white border ${
                    dropTargetOptionIndex === i ? 'border-blue-500 border-2' : 'border-gray-200'
                  } p-2 rounded shadow-sm ${
                    draggedOptionIndex === i ? 'opacity-50' : 'opacity-100'
                  }`}
                  onDragOver={(e) => handleRankingOptionDragOver(e, i)}
                  onDragLeave={handleRankingOptionDragLeave}
                  onDrop={(e) => handleRankingOptionDrop(e, i)}
                >
                  <span>{option.value}</span>
                  <div 
                    className="cursor-grab active:cursor-grabbing ml-auto"
                    draggable={true}
                    onDragStart={(e) => handleRankingOptionDragStart(e, i)}
                  >
                    <GripVertical size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, i) => (
              <div 
                key={option.id} 
                className={`flex items-center gap-2 bg-white border ${
                  dropTargetOptionIndex === i ? 'border-blue-500 border-2' : 'border-gray-200'
                } p-2 rounded shadow-sm ${
                  draggedOptionIndex === i ? 'opacity-50' : 'opacity-100'
                }`}
                onDragOver={(e) => handleRankingOptionDragOver(e, i)}
                onDragLeave={handleRankingOptionDragLeave}
                onDrop={(e) => handleRankingOptionDrop(e, i)}
              >
                <input type="checkbox" className="size-4" />
                <span>{option.value}</span>
                <div 
                  className="cursor-grab active:cursor-grabbing ml-auto"
                  draggable={true}
                  onDragStart={(e) => handleRankingOptionDragStart(e, i)}
                >
                  <GripVertical size={16} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        );
      case "section":
        return field.description ? (
          <p className="text-gray-600 mb-4">{field.description}</p>
        ) : null;
      case "image":
        return (
          <div className="w-full">
            {field.imageUrl ? (
              <div className="w-full mb-2">
                <ImageWithFallback
                  src={field.imageUrl}
                  alt={field.question}
                  className="max-w-full max-h-[300px] object-contain rounded-md"
                />
              </div>
            ) : (
              <div className="w-full h-[200px] bg-gray-100 rounded-md flex items-center justify-center border border-dashed border-gray-300">
                <span className="text-gray-400">Image placeholder</span>
              </div>
            )}
            {field.description && <p className="text-gray-600 mt-2">{field.description}</p>}
          </div>
        );
      case "ranking":
        return (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">Drag items to reorder them based on your preference</p>
            <div className="space-y-2">
              {field.options?.map((option, i) => (
                <div 
                  key={option.id} 
                  className={`flex items-center gap-2 bg-white border ${
                    dropTargetOptionIndex === i ? 'border-blue-500 border-2' : 'border-gray-200'
                  } p-2 rounded shadow-sm ${
                    draggedOptionIndex === i ? 'opacity-50' : 'opacity-100'
                  }`}
                  onDragOver={(e) => handleRankingOptionDragOver(e, i)}
                  onDragLeave={handleRankingOptionDragLeave}
                  onDrop={(e) => handleRankingOptionDrop(e, i)}
                >
                  <div className="flex-shrink-0 bg-gray-200 size-6 flex items-center justify-center rounded">
                    {i + 1}
                  </div>
                  <div 
                    className="cursor-grab active:cursor-grabbing"
                    draggable={true}
                    onDragStart={(e) => handleRankingOptionDragStart(e, i)}
                  >
                    <GripVertical size={16} className="text-gray-400" />
                  </div>
                  <span>{option.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getFieldTypeName = (type: FieldType) => {
    switch (type) {
      case "multiple_choice":
        return "Multiple Choice";
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

  // For section type, we don't show the numbering
  const shouldShowNumber = field.type !== "section" && field.type !== "image";

  return (
    <div 
      ref={fieldRef}
      className={`relative bg-[#f8f8f8] p-4 mb-4 w-full transition-all ${
        isDragging ? 'opacity-40' : 'opacity-100'
      } ${
        isDraggedOver ? 'border-t-2 border-blue-500' : ''
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-index={index}
    >
      {/* Top drop indicator */}
      {isDraggedOver && (
        <div className="absolute -top-2 inset-x-0 h-1 bg-blue-500 rounded-full"></div>
      )}
      
      <div className="flex flex-row gap-4 items-start">
        <div className="grow">
          <div className="mb-1 text-sm">
            {getFieldTypeName(field.type)}
          </div>
          <div className="flex">
            {shouldShowNumber && (
              <div className="mr-2">
                <div>{index + 1}.</div>
              </div>
            )}
            <div className="grow">
              {renderQuestion()}
              {renderOptions()}
            </div>
          </div>
        </div>
        <div 
          className="bg-[#263238] text-white rounded-sm px-2 py-1 cursor-pointer hover:bg-[#1e272c]"
          onClick={handleEdit}
        >
          Edit
        </div>
        <div className="cursor-pointer" onClick={handleDuplicate}>
          <Copy size={24} />
        </div>
        {/* Grip handle that initiates dragging */}
        <div 
          className="cursor-grab active:cursor-grabbing touch-manipulation"
          draggable={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          title="Drag to reorder"
        >
          <GripVertical size={24} />
        </div>
        <div className="cursor-pointer" onClick={handleDelete}>
          <Trash2 size={24} />
        </div>
      </div>
    </div>
  );
}