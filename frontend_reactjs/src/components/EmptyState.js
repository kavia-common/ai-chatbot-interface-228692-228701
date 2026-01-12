import React from "react";
import { config } from "../lib/config";

// PUBLIC_INTERFACE
export function EmptyState({ onExample }) {
  /** Empty transcript guidance panel. */
  return (
    <div className="msgRow system">
      <div className="bubble system" aria-label="Empty conversation help">
        <div className="bubbleContent">
          <strong>Start a conversation</strong>
          {"\n\n"}
          {config.isMockMode
            ? "You're running in mock mode. Messages will be answered locally (no backend needed)."
            : "You're connected to a backend. Try sending a message."}
          {"\n\n"}
          Example:{" "}
          <button className="btn btnWarn" onClick={onExample} type="button" aria-label="Use example prompt">
            Summarize this app UI
          </button>
        </div>
      </div>
    </div>
  );
}
