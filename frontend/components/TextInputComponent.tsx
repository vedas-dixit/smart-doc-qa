"use client"
import { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, File as FileIcon, X as XIcon } from 'lucide-react';

interface TextAreaInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  context: string;
  setContext: React.Dispatch<React.SetStateAction<string>>;
  uploading: boolean;
  fileName: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextAreaInput = ({ onSend, isLoading = false, context, setContext, uploading, fileName, onFileChange }: TextAreaInputProps) => {
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

  const handleRemoveFile = () => {
    setContext("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Optionally, you can call onFileChange with a synthetic event if needed
    // onFileChange({ target: { files: [] } } as any);
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto w-full max-w-3xl px-4">
      <div className="relative flex flex-col items-end rounded-xl border border-gray-300 bg-white p-2 shadow-lg">
        {/* File chip aligned at start, above the input, no overlap */}
        {fileName && (
          <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-3 py-1 shadow text-sm text-gray-700 mb-2 max-w-[80%] truncate">
            <FileIcon size={16} className="mr-2 text-blue-500" />
            <span className="truncate mr-2">{fileName}</span>
            <button
              type="button"
              className="flex items-center justify-center rounded-full hover:bg-gray-200 transition p-1 ml-1"
              aria-label="Remove file"
              onClick={handleRemoveFile}
            >
              <XIcon size={14} className="text-gray-400" />
            </button>
          </div>
        )}
        <div className="flex items-end w-full">
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 cursor-pointer"
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
            className="mx-2 max-h-[200px] w-full resize-none overflow-y-auto bg-transparent py-2 outline-none"
            placeholder="Type your message..."
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={message.trim() === '' || isLoading}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md cursor-pointer ${
              message.trim() && !isLoading
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-400'
            }`}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextAreaInput;