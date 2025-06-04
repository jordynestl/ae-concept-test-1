import React, { useState } from "react";
import { FormFieldType } from "./FormField";
import { sanitizeHtml } from "../utils/richTextUtils";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type FormPreviewProps = {
  title: string;
  fields: FormFieldType[];
};

export function FormPreview({ title, fields }: FormPreviewProps) {
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [hoveredRanking, setHoveredRanking] = useState<string | null>(null);

  const handleMultipleChoiceChange = (fieldId: string, value: string) => {
    setAnswers({ ...answers, [fieldId]: value });
  };

  const handleCheckboxChange = (fieldId: string, value: string) => {
    const currentValues = answers[fieldId] || [];
    const valueIndex = currentValues.indexOf(value);
    
    if (valueIndex === -1) {
      setAnswers({ 
        ...answers, 
        [fieldId]: [...currentValues, value] 
      });
    } else {
      setAnswers({
        ...answers,
        [fieldId]: currentValues.filter((item: string) => item !== value)
      });
    }
  };

  const handleTextChange = (fieldId: string, value: string) => {
    setAnswers({ ...answers, [fieldId]: value });
  };

  const handleDropdownChange = (fieldId: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnswers({ ...answers, [fieldId]: e.target.value });
  };

  // Render question with formatting if available
  const renderQuestion = (field: FormFieldType) => {
    if (field.type === "section") {
      if (field.formattedQuestion) {
        return (
          <h2 
            className="text-xl font-bold mb-2"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(field.formattedQuestion) }}
          />
        );
      }
      return <h2 className="text-xl font-bold mb-2">{field.question}</h2>;
    }
    
    if (field.formattedQuestion) {
      return (
        <div 
          className="mb-2"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(field.formattedQuestion) }}
        />
      );
    }
    return <div className="mb-2">{field.question}</div>;
  };

  // Track field numbers excluding sections and images
  let questionCounter = 0;
  
  const renderField = (field: FormFieldType, index: number) => {
    // Only increment the counter for question-type fields
    const shouldNumberField = !["section", "image"].includes(field.type);
    const currentNumber = shouldNumberField ? ++questionCounter : null;
    
    switch (field.type) {
      case "multiple_choice":
        return (
          <div key={field.id} className="mb-6">
            <div className="mb-2">
              {currentNumber}. {renderQuestion(field)}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <div className="space-y-2 pl-6">
              {field.options?.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={option.id}
                    name={field.id}
                    value={option.value}
                    checked={answers[field.id] === option.value}
                    onChange={() => handleMultipleChoiceChange(field.id, option.value)}
                    className="size-5"
                  />
                  <label htmlFor={option.id}>{option.value}</label>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "checkbox":
        return (
          <div key={field.id} className="mb-6">
            <div className="mb-2">
              {currentNumber}. {renderQuestion(field)}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <div className="space-y-2 pl-6">
              {field.options?.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={(answers[field.id] || []).includes(option.value)}
                    onChange={() => handleCheckboxChange(field.id, option.value)}
                    className="size-4"
                  />
                  <label htmlFor={option.id}>{option.value}</label>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "free_text":
        return (
          <div key={field.id} className="mb-6">
            <div className="mb-2">
              {currentNumber}. {renderQuestion(field)}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <div className="pl-6">
              <textarea
                value={answers[field.id] || ""}
                onChange={(e) => handleTextChange(field.id, e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-2 border border-gray-300 rounded-sm min-h-[100px]"
              />
            </div>
          </div>
        );
      
      case "dropdown":
        return (
          <div key={field.id} className="mb-6">
            <div className="mb-2">
              {currentNumber}. {renderQuestion(field)}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <div className="pl-6">
              <select
                value={answers[field.id] || ""}
                onChange={(e) => handleDropdownChange(field.id, e)}
                className="w-1/2 p-2 border border-gray-300 rounded-sm"
              >
                <option value="">Select an option</option>
                {field.options?.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      
      case "section":
        return (
          <div key={field.id} className="mb-8">
            {renderQuestion(field)}
            {field.description && (
              <p className="text-gray-600 mb-4">{field.description}</p>
            )}
          </div>
        );
      
      case "image":
        return (
          <div key={field.id} className="mb-6">
            <div className="mb-2">
              {renderQuestion(field)}
            </div>
            {field.imageUrl && (
              <div className="mb-4">
                <ImageWithFallback
                  src={field.imageUrl}
                  alt={field.question}
                  className="max-w-full max-h-[300px] object-contain rounded-md"
                />
              </div>
            )}
            {field.description && (
              <p className="text-gray-600 text-sm italic">{field.description}</p>
            )}
          </div>
        );
        
      case "ranking":
        return (
          <div key={field.id} className="mb-6">
            <div className="mb-2">
              {currentNumber}. {renderQuestion(field)}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <div className="pl-6">
              <p className="text-gray-600 text-sm mb-2">Drag items to reorder them based on your preference</p>
              <div className="space-y-2">
                {field.options?.map((option, i) => (
                  <div 
                    key={option.id} 
                    className={`flex items-center gap-2 bg-white border border-gray-200 p-3 rounded shadow-sm cursor-grab ${hoveredRanking === option.id ? 'border-blue-400' : ''}`}
                    onMouseEnter={() => setHoveredRanking(option.id)}
                    onMouseLeave={() => setHoveredRanking(null)}
                  >
                    <div className="flex-shrink-0 bg-gray-200 size-6 flex items-center justify-center rounded mr-2">
                      {i + 1}
                    </div>
                    <span>{option.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-md max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      
      {fields.length > 0 ? (
        <div>
          {fields.map((field, index) => renderField(field, index))}
          
          <div className="mt-8">
            <button
              className="bg-[#263238] text-white px-4 py-2 rounded-sm hover:bg-[#1e272c]"
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No questions added yet.
        </div>
      )}
    </div>
  );
}