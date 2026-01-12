import React, { useEffect, useMemo, useRef } from "react";
import { EmptyState } from "./EmptyState";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

// PUBLIC_INTERFACE
export function ChatWindow({ messages, isTyping, error, onExample, onClearError }) {
  /** Render chat transcript with auto-scroll and error handling. */
  const bottomRef = useRef(null);
  const transcriptRef = useRef(null);

  const visibleMessages = useMemo(() => messages || [], [messages]);

  useEffect(() => {
    // Auto-scroll to bottom on new messages or typing state changes.
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [visibleMessages.length, isTyping]);

  return (
    <div className="chatSurface" aria-label="Chat conversation">
      {error ? (
        <div className="callout" role="alert" aria-label="Error message">
          <div className="calloutRow">
            <div>
              <strong>Something went wrong.</strong> {error}
            </div>
            <button type="button" className="btn" onClick={onClearError} aria-label="Dismiss error">
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      <div className="transcript" ref={transcriptRef} tabIndex={0} aria-label="Chat transcript">
        {visibleMessages.length <= 1 ? (
          <EmptyState onExample={onExample} />
        ) : null}

        {visibleMessages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        <TypingIndicator isTyping={isTyping} />

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
