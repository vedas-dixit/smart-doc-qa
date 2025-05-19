"use client"
import { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, File as FileIcon, X as XIcon } from 'lucide-react';

interface TextAreaInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  uploading: boolean;
  fileName: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  handleRemoveFile: () => void;
}

const TextAreaInput = ({ onSend, isLoading = false, uploading, fileName, onFileChange, onRemoveFile, handleRemoveFile }: TextAreaInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200); // Max height of 200px
      textarea.style.height = `${newHeight}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      handleRemoveFile();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePaperclipClick = () => {
    if (fileInputRef.current && !uploading) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative w-full">
      {/* File attachment floating above the input */}
      {fileName && (
        <div className="absolute -top-10 left-2 right-2 flex items-center bg-[#1C2D2E] border border-gray-700 rounded-lg px-3 py-1.5 shadow-md text-sm text-gray-200 mb-2 max-w-full truncate z-10">
          <FileIcon size={16} className="mr-2 text-teal-400 flex-shrink-0" />
          <span className="truncate mr-2 flex-1">{fileName}</span>
          <button
            type="button"
            className="flex items-center justify-center rounded-full hover:bg-gray-700 transition p-1 ml-1 flex-shrink-0"
            aria-label="Remove file"
            onClick={onRemoveFile}
          >
            <XIcon size={14} className="text-gray-400" />
          </button>
        </div>
      )}

      <div className="flex items-end w-full rounded-xl border border-gray-700 bg-[#2C2E33] p-2">
        <button
          type="button"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-[#1C2D2E] cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Attach file"
          onClick={handlePaperclipClick}
          disabled={uploading}
        >
          <Paperclip size={18} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.docx"
          onChange={onFileChange}
          disabled={uploading}
          className="hidden"
        />
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="mx-2 max-h-[200px] w-full resize-none overflow-y-auto bg-transparent py-2 outline-none text-gray-200 placeholder-gray-500"
          placeholder="Type your message..."
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={message.trim() === '' || isLoading}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md cursor-pointer ${
            message.trim() && !isLoading
              ? 'bg-teal-700 text-white hover:bg-teal-600'
              : 'bg-gray-800 text-gray-500'
          }`}
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </div>
      
      {/* Loading indicator for file upload */}
      {uploading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex space-x-2 items-center bg-[#1C2D2E] px-3 py-2 rounded-lg shadow-lg">
            <div className="h-2 w-2 animate-pulse rounded-full bg-teal-500"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-teal-500" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-teal-500" style={{ animationDelay: '0.4s' }}></div>
            <span className="text-xs text-gray-300 ml-1">Uploading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextAreaInput;