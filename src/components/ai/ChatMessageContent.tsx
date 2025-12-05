'use client';

import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageContentProps {
    content: string;
    isUser?: boolean;
}

// Parse and render markdown-like content with beautiful styling
export const ChatMessageContent = memo(function ChatMessageContent({ content, isUser }: ChatMessageContentProps) {
    if (!content) return null;

    // Parse the content into segments
    const renderContent = () => {
        const lines = content.split('\n');
        const elements: React.ReactNode[] = [];
        let listItems: string[] = [];
        let listType: 'bullet' | 'numbered' | null = null;

        const flushList = () => {
            if (listItems.length > 0 && listType) {
                elements.push(
                    <ul key={`list-${elements.length}`} className={cn(
                        "my-2 space-y-1.5",
                        listType === 'numbered' ? "list-decimal" : "list-none"
                    )}>
                        {listItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                                {listType === 'bullet' && (
                                    <span className={cn(
                                        "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0",
                                        isUser ? "bg-white/70" : "bg-gradient-to-r from-red-400 to-orange-400"
                                    )} />
                                )}
                                <span className="flex-1">{renderInlineFormatting(item)}</span>
                            </li>
                        ))}
                    </ul>
                );
                listItems = [];
                listType = null;
            }
        };

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();

            // Check for headings (###, ##, #)
            if (trimmedLine.startsWith('### ')) {
                flushList();
                elements.push(
                    <h4 key={`h3-${index}`} className={cn(
                        "font-semibold text-sm mt-3 mb-1.5 flex items-center gap-2",
                        isUser ? "text-white" : "text-gray-900"
                    )}>
                        <span className={cn(
                            "w-1 h-4 rounded-full",
                            isUser ? "bg-white/50" : "bg-gradient-to-b from-red-400 to-orange-400"
                        )} />
                        {renderInlineFormatting(trimmedLine.slice(4))}
                    </h4>
                );
                return;
            }

            if (trimmedLine.startsWith('## ')) {
                flushList();
                elements.push(
                    <h3 key={`h2-${index}`} className={cn(
                        "font-bold text-base mt-3 mb-2",
                        isUser ? "text-white" : "text-gray-900"
                    )}>
                        {renderInlineFormatting(trimmedLine.slice(3))}
                    </h3>
                );
                return;
            }

            if (trimmedLine.startsWith('# ')) {
                flushList();
                elements.push(
                    <h2 key={`h1-${index}`} className={cn(
                        "font-bold text-lg mt-3 mb-2",
                        isUser ? "text-white" : "text-gray-900"
                    )}>
                        {renderInlineFormatting(trimmedLine.slice(2))}
                    </h2>
                );
                return;
            }

            // Check for bullet points (- or •)
            if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
                if (listType !== 'bullet') {
                    flushList();
                    listType = 'bullet';
                }
                listItems.push(trimmedLine.slice(2));
                return;
            }

            // Check for numbered lists
            const numberedMatch = trimmedLine.match(/^\d+\.\s/);
            if (numberedMatch) {
                if (listType !== 'numbered') {
                    flushList();
                    listType = 'numbered';
                }
                listItems.push(trimmedLine.slice(numberedMatch[0].length));
                return;
            }

            // Flush any pending list
            flushList();

            // Empty line
            if (!trimmedLine) {
                elements.push(<div key={`br-${index}`} className="h-2" />);
                return;
            }

            // Regular paragraph
            elements.push(
                <p key={`p-${index}`} className="leading-relaxed">
                    {renderInlineFormatting(trimmedLine)}
                </p>
            );
        });

        // Flush any remaining list items
        flushList();

        return elements;
    };

    // Render inline formatting (bold, italic, etc.)
    const renderInlineFormatting = (text: string): React.ReactNode[] => {
        const parts: React.ReactNode[] = [];
        let remaining = text;
        let keyCounter = 0;

        while (remaining.length > 0) {
            // Bold: **text**
            const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
            if (boldMatch && boldMatch.index !== undefined) {
                if (boldMatch.index > 0) {
                    parts.push(remaining.slice(0, boldMatch.index));
                }
                parts.push(
                    <strong key={`bold-${keyCounter++}`} className={cn(
                        "font-semibold",
                        isUser ? "text-white" : "text-gray-900"
                    )}>
                        {boldMatch[1]}
                    </strong>
                );
                remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
                continue;
            }

            // Money/numbers with units - highlight them nicely
            const moneyMatch = remaining.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(CNY|USD|RMB|%)/);
            if (moneyMatch && moneyMatch.index !== undefined) {
                if (moneyMatch.index > 0) {
                    parts.push(remaining.slice(0, moneyMatch.index));
                }
                parts.push(
                    <span key={`money-${keyCounter++}`} className={cn(
                        "font-medium px-1 py-0.5 rounded",
                        isUser
                            ? "bg-white/20"
                            : "bg-gradient-to-r from-red-50 to-orange-50 text-orange-700"
                    )}>
                        {moneyMatch[1]} {moneyMatch[2]}
                    </span>
                );
                remaining = remaining.slice(moneyMatch.index + moneyMatch[0].length);
                continue;
            }

            // No more matches, add remaining text and break
            parts.push(remaining);
            break;
        }

        return parts;
    };

    return (
        <div className={cn(
            "text-sm",
            isUser ? "text-white" : "text-gray-700"
        )}>
            {renderContent()}
        </div>
    );
});
