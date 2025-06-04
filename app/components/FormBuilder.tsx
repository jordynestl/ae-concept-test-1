import React, { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { FormHeader } from "./FormHeader";
import { FormField, FormFieldType, FieldType } from "./FormField";
import { FieldEditor } from "./FieldEditor";
import { AddFieldButton } from "./AddFieldButton";
import { FormPreview } from "./FormPreview";

export function FormBuilder() {
  const [formTitle, setFormTitle] = useState("Untitled survey");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState(formTitle);
  const [fields, setFields] = useState<FormFieldType[]>([]);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setEditableTitle(formTitle);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableTitle(e.target.value);
  };

  const handleTitleSave = () => {
    setFormTitle(editableTitle);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTitleSave();
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
      setEditableTitle(formTitle);
    }
  };

  const handleTitleBlur = () => {
    handleTitleSave();
  };

  const handleAddField = (type: FieldType) => {
    let newField: FormFieldType = {
      id: uuidv4(),
      type,
      question: "", // Empty string to allow the placeholder to show
      required: false,
      options: [],
    };

    // Special handling for different field types
    switch (type) {
      case "multiple_choice":
        newField = {
          ...newField,
          question: "Did you attend the June 2025 Leadership camp?",
          options: [
            { id: uuidv4(), value: "Yes" },
            { id: uuidv4(), value: "No" },
          ],
        };
        break;

      case "dropdown":
      case "checkbox":
        newField = {
          ...newField,
          options: [
            { id: uuidv4(), value: "Option 1" },
            { id: uuidv4(), value: "Option 2" },
          ],
        };
        break;

      case "ranking":
        newField = {
          ...newField,
          question: "Rank the following items in order of importance to you:",
          options: [
            { id: uuidv4(), value: "Item 1" },
            { id: uuidv4(), value: "Item 2" },
            { id: uuidv4(), value: "Item 3" },
          ],
        };
        break;

      case "section":
        newField = {
          ...newField,
          question: "Section Title",
          required: false,
        };
        break;

      case "image":
        newField = {
          ...newField,
          question: "Image Question",
          required: false,
          imageUrl: "https://images.unsplash.com/photo-1508921340878-ba53e1f016ec?auto=format&fit=crop&q=80&w=1000",
          description: "Image caption goes here",
        };
        break;
    }

    setFields([...fields, newField]);
    setEditingFieldId(newField.id);
  };

  const handleEditField = (id: string) => {
    setEditingFieldId(id);
  };

  const handleSaveField = (updatedField: FormFieldType) => {
    setFields(
      fields.map((field) =>
        field.id === updatedField.id ? updatedField : field
      )
    );
    setEditingFieldId(null);
  };

  const handleFieldChange = (updatedField: FormFieldType) => {
    setFields(
      fields.map((field) =>
        field.id === updatedField.id ? updatedField : field
      )
    );
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
    if (editingFieldId === id) {
      setEditingFieldId(null);
    }
  };

  const handleDuplicateField = (id: string) => {
    const fieldToDuplicate = fields.find((field) => field.id === id);
    if (!fieldToDuplicate) return;

    const duplicatedField = {
      ...fieldToDuplicate,
      id: uuidv4(),
      options: fieldToDuplicate.options
        ? fieldToDuplicate.options.map((opt) => ({
            ...opt,
            id: uuidv4(),
          }))
        : [],
    };

    setFields([...fields, duplicatedField]);
  };

  // Drag and drop handlers
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, field: FormFieldType, index: number) => {
      setDraggedItemIndex(index);
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      
      if (draggedItemIndex === null || draggedItemIndex === index) {
        setDropTargetIndex(null);
        return;
      }
      
      setDropTargetIndex(index);
    },
    [draggedItemIndex]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
      e.preventDefault();
      
      if (draggedItemIndex === null || draggedItemIndex === dropIndex) {
        setDraggedItemIndex(null);
        setDropTargetIndex(null);
        return;
      }

      // Create a new array with reordered items
      const newFields = [...fields];
      const draggedItem = newFields.splice(draggedItemIndex, 1)[0];
      newFields.splice(dropIndex, 0, draggedItem);
      
      setFields(newFields);
      setDraggedItemIndex(null);
      setDropTargetIndex(null);
    },
    [draggedItemIndex, fields]
  );

  // New function to handle duplication from the FieldEditor
  const handleDuplicateFromEditor = (fieldToClone: FormFieldType) => {
    // Create a duplicate with new IDs
    const duplicatedField = {
      ...fieldToClone,
      id: uuidv4(),
      options: fieldToClone.options
        ? fieldToClone.options.map((opt) => ({
            ...opt,
            id: uuidv4(),
          }))
        : [],
    };

    setFields([...fields, duplicatedField]);
    // Keep editing the original field
  };

  // Show preview mode
  const handleShowPreview = () => {
    setIsPreviewMode(true);
  };

  // Exit preview mode
  const handleExitPreview = () => {
    setIsPreviewMode(false);
  };
  
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="mb-4">No questions/fields added yet</div>
      <AddFieldButton onAddField={handleAddField} />
    </div>
  );

  return (
    <div className="flex-1 flex flex-col">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-start justify-between">
          {/* Left section with title, badge, and description */}
          <div className="flex flex-col w-full max-w-3xl">
            {/* Unpublished badge above the title */}
            <div className="bg-[#d9d9d9] text-sm px-2 py-1 rounded-sm w-fit mb-2">
              Unpublished
            </div>
            
            {/* Form title */}
            <div className="w-full">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={editableTitle}
                  onChange={handleTitleChange}
                  onKeyDown={handleTitleKeyDown}
                  onBlur={handleTitleBlur}
                  autoFocus
                  className="text-xl font-bold px-3 py-1 border border-gray-300 rounded w-full"
                />
              ) : (
                <h1 
                  className="text-xl font-bold cursor-pointer hover:bg-gray-100 px-3 py-1 rounded"
                  onClick={handleTitleClick}
                >
                  {formTitle}
                </h1>
              )}
            </div>
            
            {/* Form description below the title */}
            <div className="mt-2 w-full">
              <FormHeader />
            </div>
          </div>
          
          {/* Right section with buttons */}
          <div className="flex items-center gap-4">
            {isPreviewMode ? (
              <button
                className="border border-black px-4 py-2 rounded-sm"
                onClick={handleExitPreview}
              >
                Back to Editor
              </button>
            ) : (
              <button
                className="border border-black px-4 py-2 rounded-sm"
                onClick={handleShowPreview}
              >
                Preview
              </button>
            )}
            <button className="bg-[#263238] text-white px-4 py-2 rounded-sm">
              Publish &amp; Share
            </button>
          </div>
        </div>
      </div>

      <main className={`container mx-auto px-4 py-8 flex-1 flex flex-col ${isPreviewMode ? 'max-w-6xl' : ''}`}>
        {isPreviewMode ? (
          <div className="bg-gray-100 py-8 px-4 rounded-lg w-full">
            <FormPreview title={formTitle} fields={fields} />
          </div>
        ) : (
          <div>
            {fields.length === 0 ? (
              renderEmptyState()
            ) : (
              <div>
                {fields.map((field, index) => {
                  return editingFieldId === field.id ? (
                    <FieldEditor
                      key={field.id}
                      field={field}
                      onSave={handleSaveField}
                      onCancel={() => setEditingFieldId(null)}
                      onDuplicate={handleDuplicateFromEditor}
                      onDelete={handleDeleteField}
                      onFieldChange={handleFieldChange}
                    />
                  ) : (
                    <FormField
                      key={field.id}
                      field={field}
                      isEditing={editingFieldId === field.id}
                      onEdit={handleEditField}
                      onDelete={handleDeleteField}
                      onDuplicate={handleDuplicateField}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onFieldChange={handleFieldChange}
                      index={index}
                      isDraggedOver={dropTargetIndex === index}
                    />
                  );
                })}
                <AddFieldButton onAddField={handleAddField} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}