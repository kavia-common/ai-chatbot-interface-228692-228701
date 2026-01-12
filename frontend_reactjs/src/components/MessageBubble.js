import React from "react";

function roleLabel(role) {
  if (role === "user") return "You";
  if (role === "assistant") return "Assistant";
  return "System";
}

// PUBLIC_INTERFACE
export function MessageBubble({ message }) {
  /** Render a single chat message bubble. */
  const role = message?.role || "system";
  const status = message?.status;

  return (
    <div className={`msgRow ${role}`}>
      <div className={`bubble ${role}`} aria-label={`${roleLabel(role)} message`}>
        <div className="bubbleContent">{message?.content || ""}</div>
        {status ? (
          <div className="bubbleMeta" aria-label="Message status">
            <span>{roleLabel(role)}</span>
            <span>{status}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
