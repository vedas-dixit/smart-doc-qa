"use client"
import { useState, useRef, useEffect } from 'react';
import TextAreaInput from './TextInputComponent';
import ReactMarkdown from 'react-markdown';
import { uploadDocument, askQuestion } from '../utils/api';
import { Message, createUserMessage, createBotMessage } from '../utils/chat';
import { FileText } from 'lucide-react';

const HomeComponent = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [context, setContext] = useState("");
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState("");

    // Scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setContext("");
        setFileName("");
        try {
            const data = await uploadDocument(file);
            setContext(data.text || "");
            setFileName(file.name);
            // No longer adding message here
        } catch (e) {
            setContext("");
            setFileName("");
            alert("Failed to extract text from document.");
            console.log("Error:",e)
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveFile = () => {
        setFileName("");
        setContext("");
    };

    const sendMessageToLLM = async (userMessage: string) => {
        setIsLoading(true);
        try {
            const data = await askQuestion(userMessage, context);
            setMessages(prev => [
                ...prev,
                createBotMessage(data.answer || "No answer returned."),
            ]);
        } catch (e) {
            setMessages(prev => [
                ...prev,
                createBotMessage("Error getting answer."),
            ]);
            console.log("Error:",e)
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = (message: string) => {
        // Add user's message
        setMessages(prev => [...prev, createUserMessage(message)]);
        
        // If there's a file attached, add file message
        if (fileName) {
            setMessages(prev => [...prev, createUserMessage(`Attached document: ${fileName}`)]);
        }
        
        // Send to LLM
        sendMessageToLLM(message);
    };

    return (
        <div className="relative flex h-screen flex-col ">
            {/* Centered chat container */}
            <div className="flex flex-1 flex-col items-center justify-center w-full">
                <div className="flex flex-col w-full max-w-[700px] h-full mx-auto">
                    {/* Chat header */}
                    <div className="sticky top-0 z-10 px-4 py-3 bg-[#1c2727] bg-opacity-80 backdrop-blur-sm text-white rounded-2xl mt-2 mx-3">
                        <h1 className="text-center text-lg font-medium">DocuBot <span className='text-gray-300'>AI Assistant</span></h1>
                    </div>

                    {/* Chat messages */}
                    <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4 items-center">
                        {messages.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-center text-gray-300 max-w-5xl">
                                <div className="mb-4 rounded-full bg-[#0F4C4C] bg-opacity-40 p-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-teal-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-lg font-medium text-white">Welcome to AI Assistant</p>
                                <p className="mt-2 max-w-sm">Type a message below to start chatting with the AI</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-w-5xl">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-xl px-4 py-3 ${msg.isUser
                                                    ? 'bg-[#204142] text-white'
                                                    : 'bg-[#1C2D2E] text-gray-200 shadow'
                                                }`}
                                        >
                                            {msg.isUser ? (
                                                <div>
                                                    {msg.content.startsWith('Attached document:') ? (
                                                        <div className="flex items-center space-x-2">
                                                            <div className="bg-pink-500 p-2 rounded-md">
                                                                <FileText size={18} className="text-white" />
                                                            </div>
                                                            <div>
                                                                <div>{msg.content.replace('Attached document: ', '')}</div>
                                                                <div className="text-xs text-gray-400">PDF</div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>{msg.content}</div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="prose prose-sm max-w-none prose-invert">
                                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                </div>
                                            )}
                                            <div
                                                className={`mt-1 text-right text-xs ${msg.isUser ? 'text-white' : 'text-gray-400'
                                                    }`}
                                            >
                                                {msg.timestamp.toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-[#1C2D2E] max-w-[80%] rounded-xl px-4 py-3 shadow text-gray-200">
                                            <div className="flex space-x-2">
                                                <div className="h-2 w-2 animate-bounce rounded-full bg-teal-900"></div>
                                                <div className="h-2 w-2 animate-bounce rounded-full bg-teal-900" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="h-2 w-2 animate-bounce rounded-full bg-teal-900" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Chat input */}
                    <div className="w-full px-4 py-2 bg-[#2C2E33] rounded-t-xl shadow-md">
                        <TextAreaInput
                            onSend={handleSendMessage}
                            isLoading={isLoading}
                            uploading={uploading}
                            fileName={fileName}
                            onFileChange={handleFileChange}
                            onRemoveFile={handleRemoveFile}
                            handleRemoveFile={handleRemoveFile}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeComponent;