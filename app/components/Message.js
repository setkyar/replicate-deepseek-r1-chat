import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, ChevronRight } from 'lucide-react';

const Message = ({ message, isUser }) => {
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(true);
  const [processedContent, setProcessedContent] = useState({
    thinking: '',
    message: '',
  });

  // Process message content whenever it changes
  useEffect(() => {
    if (!message) {
      setProcessedContent({ thinking: '', message: '' });
      return;
    }

    let thinking = '';
    let cleanMessage = message;

    // Handle both streaming and complete messages
    const thinkStartIndex = message.indexOf('<think>');
    const thinkEndIndex = message.indexOf('</think>');

    if (thinkStartIndex !== -1) {
      if (thinkEndIndex !== -1) {
        // Complete think tags
        thinking = message.substring(thinkStartIndex + 7, thinkEndIndex).trim();
        cleanMessage = (
          message.substring(0, thinkStartIndex) +
          message.substring(thinkEndIndex + 8)
        ).trim();
      } else {
        // Incomplete think tags during streaming
        thinking = message.substring(thinkStartIndex + 7).trim();
        cleanMessage = message.substring(0, thinkStartIndex).trim();
      }
    }

    setProcessedContent({ thinking, message: cleanMessage });
  }, [message]);

  if (!message) return null;

  const containerClass = isUser ? '' : 'bg-gray-100';

  return (
    <div className="flex gap-x-4 mb-10">
      {isUser ? (
        <span className="text-xl sm:text-2xl pt-4" title="user">
          🥸
        </span>
      ) : (
        <span className="text-xl sm:text-2xl pt-4" title="AI">
          🐳
        </span>
      )}
      <div
        className={`${containerClass} flex flex-col text-sm sm:text-base flex-1 gap-y-4 mt-1 p-5 rounded-md`}
      >
        {processedContent.thinking && (
          <div className="border border-gray-200 rounded-md mb-4">
            <button
              onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
              className="flex items-center w-full p-2 text-left text-gray-600 hover:bg-gray-50 rounded-t-md"
            >
              {isThinkingExpanded ? (
                <ChevronDown className="w-4 h-4 mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )}
              Thinking...
            </button>
            {isThinkingExpanded && (
              <div className="p-3 text-gray-600 bg-gray-50 rounded-b-md">
                <ReactMarkdown>{processedContent.thinking}</ReactMarkdown>
              </div>
            )}
          </div>
        )}
        <div className="prose prose-sm sm:prose-base max-w-none">
          <ReactMarkdown
            components={{
              pre: ({ node, ...props }) => (
                <div className="overflow-auto rounded-md bg-gray-900 p-4 my-2">
                  <pre {...props} />
                </div>
              ),
              code: ({ node, inline, ...props }) =>
                inline ? (
                  <code
                    className="bg-gray-200 rounded px-1 py-0.5"
                    {...props}
                  />
                ) : (
                  <code className="text-gray-100" {...props} />
                ),
            }}
          >
            {processedContent.message}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Message;
