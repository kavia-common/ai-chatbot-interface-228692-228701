import React from "react";
import { config } from "../lib/config";

// PUBLIC_INTERFACE
export function Header() {
  /** App header with brand and connectivity status. */
  const modeLabel = config.isMockMode ? "Mock mode" : "Backend mode";
  const detail = config.isMockMode
    ? "Set REACT_APP_API_BASE to connect"
    : `API: ${config.apiBase}`;

  return (
    <header className="oceanHeader">
      <div className="oceanHeaderInner">
        <div className="brand" aria-label="Application header">
          <div className="brandMark" aria-hidden="true" />
          <div className="brandTitle">
            <strong>Ocean Chat</strong>
            <span>Modern, minimal chatbot UI</span>
          </div>
        </div>

        <div className="pill" title={detail} aria-label={`Connection status: ${modeLabel}`}>
          {modeLabel}
        </div>
      </div>
    </header>
  );
}
