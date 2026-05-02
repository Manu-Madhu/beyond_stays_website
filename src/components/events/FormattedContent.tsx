import React from 'react';

export const FormattedContent = ({ content, className = "" }: { content: string, className?: string }) => {
    if (!content) return null;
    
    const isHtml = /<[a-z][\s\S]*>/i.test(content);
    
    if (isHtml) {
        return (
            <div 
                className={`rich-text-content text-gray-700 leading-relaxed secondaryFont ${className}`}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        );
    }
    
    return (
        <p className={`text-gray-700 leading-relaxed secondaryFont whitespace-pre-line ${className}`}>
            {content}
        </p>
    );
};
