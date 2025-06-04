import React, { useState } from 'react';
import { FieldType } from './FormField';

type AddFieldButtonProps = {
  onAddField: (type: FieldType) => void;
};

export function AddFieldButton({ onAddField }: AddFieldButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddField = (type: FieldType) => {
    onAddField(type);
    setIsOpen(false);
  };

  return (
    <div className="relative flex justify-center mt-6 mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#263238] text-white px-4 py-2 rounded-sm hover:bg-[#1e272c]"
      >
        Add field
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 z-10 bg-white border border-gray-300 rounded shadow-lg">
          <div className="grid grid-cols-2 gap-1 p-2 min-w-[300px]">
            <button
              className="flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded"
              onClick={() => handleAddField("section")}
            >
              <div className="size-5">
                <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                  <path d="M2 4H18V6H2V4ZM2 9H18V11H2V9ZM2 14H12V16H2V14Z" fill="black" />
                </svg>
              </div>
              Section
            </button>
            
            <button
              className="flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded"
              onClick={() => handleAddField("multiple_choice")}
            >
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
              Multiple choice
            </button>

            <button
              className="flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded"
              onClick={() => handleAddField("checkbox")}
            >
              <div className="size-5">
                <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                  <rect x="3" y="3" width="14" height="14" rx="2" stroke="black" strokeWidth="2" />
                </svg>
              </div>
              Checkbox
            </button>

            <button
              className="flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded"
              onClick={() => handleAddField("dropdown")}
            >
              <div className="size-5">
                <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                  <path d="M4 6H16V8H4V6ZM4 9H16V11H4V9ZM4 12H16V14H4V12Z" fill="black" />
                </svg>
              </div>
              Dropdown
            </button>

            <button
              className="flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded"
              onClick={() => handleAddField("free_text")}
            >
              <div className="size-5">
                <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                  <path d="M16 4H4V16H10V14H6V6H14V10H16V4Z" fill="black" />
                  <path d="M12 16H14V12H18V10H14V6H12V10H8V12H12V16Z" fill="black" />
                </svg>
              </div>
              Free text
            </button>

            <button
              className="flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded"
              onClick={() => handleAddField("ranking")}
            >
              <div className="size-5">
                <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                  <path d="M2 4H6V6H2V4ZM2 8H6V10H2V8ZM2 12H6V14H2V12ZM8 4H18V6H8V4ZM8 8H18V10H8V8ZM8 12H18V14H8V12Z" fill="black" />
                </svg>
              </div>
              Ranking
            </button>

            <button
              className="flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded"
              onClick={() => handleAddField("image")}
            >
              <div className="size-5">
                <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                  <path d="M16.8 2H3.2C2.54 2 2 2.54 2 3.2V16.8C2 17.46 2.54 18 3.2 18H16.8C17.46 18 18 17.46 18 16.8V3.2C18 2.54 17.46 2 16.8 2ZM16 15.4H4V4H16V15.4ZM11.6 10.8L9.2 13.8L7.6 12L5.2 15H14.8L11.6 10.8Z" fill="black" />
                </svg>
              </div>
              Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}