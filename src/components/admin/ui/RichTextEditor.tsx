"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
}

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'clean'],
        [{ 'color': [] }, { 'background': [] }],
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'color', 'background'
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
    value, 
    onChange, 
    placeholder,
    className 
}) => {
    return (
        <div className={`rich-text-editor ${className}`}>
            <ReactQuill 
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                className="bg-gray-50 rounded-xl overflow-hidden border-none"
            />
            <style jsx global>{`
                .rich-text-editor .ql-toolbar {
                    border: none !important;
                    background: #f9fafb !important;
                    border-bottom: 1px solid #f3f4f6 !important;
                    border-radius: 0.75rem 0.75rem 0 0 !important;
                }
                .rich-text-editor .ql-container {
                    border: none !important;
                    font-family: inherit !important;
                    font-size: 0.875rem !important;
                    min-height: 150px !important;
                }
                .rich-text-editor .ql-editor {
                    min-height: 150px !important;
                }
                .rich-text-editor .ql-editor.ql-blank::before {
                    color: #9ca3af !important;
                    font-style: normal !important;
                }
            `}</style>
        </div>
    );
};
