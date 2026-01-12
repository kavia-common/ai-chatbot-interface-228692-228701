import React from "react";

// PUBLIC_INTERFACE
export function TypingIndicator({ isTyping }) {
  /** Show assistant typing indicator. */
  if (!isTyping) return null;

  return (
    <div className="msgRow assistant" aria-live="polite" aria-atomic="true">
      <div className="typing" role="status" aria-label="Assistant is typing">
        <span>Assistant is typing</span>
        <span className="dots" aria-hidden="true">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </span>
      </div>
    </div>
  );
}
