import React, { useEffect, useRef, useState } from "react";

// PUBLIC_INTERFACE
export function Composer({
  onSend,
  onStop,
  onRetry,
  canStop,
  canRetry,
  isTyping,
  autoFocus = true,
}) {
  /** Message composer with Send/Stop/Retry actions and keyboard UX. */
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!autoFocus) return;
    textareaRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (!isTyping) return;
    // Keep typing flow accessible; do not steal focus during typing.
  }, [isTyping]);

  function doSend() {
    const trimmed = String(text).trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    // Focus after send for quick follow-up.
    window.setTimeout(() => textareaRef.current?.focus(), 0);
  }

  function onKeyDown(e) {
    // Enter to send; Shift+Enter for newline.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      doSend();
    }
  }

  return (
    <div>
      <div className="composer" aria-label="Message composer">
        <label className="sr-only" htmlFor="chat-input">
          Message
        </label>
        <textarea
          id="chat-input"
          ref={textareaRef}
          className="textarea"
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
          aria-label="Type your message"
        />

        <div className="controls" aria-label="Composer controls">
          <button
            className="btn btnPrimary"
            type="button"
            onClick={doSend}
            disabled={isTyping || !String(text).trim()}
            aria-label="Send message"
          >
            Send
          </button>

          <button
            className="btn btnDanger"
            type="button"
            onClick={onStop}
            disabled={!canStop}
            aria-label="Stop generating response"
          >
            Stop
          </button>

          <button
            className="btn btnWarn"
            type="button"
            onClick={onRetry}
            disabled={!canRetry}
            aria-label="Retry last message"
          >
            Retry
          </button>
        </div>
      </div>

      <div className="footerHint" aria-label="Composer hint">
        <span>{isTyping ? "Generating response…" : "Tip: Press Enter to send"}</span>
        <span>Esc: stop</span>
      </div>
    </div>
  );
}
