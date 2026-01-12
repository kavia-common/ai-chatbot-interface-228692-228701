import React, { useEffect } from "react";
import "./styles/theme.css";
import { Header } from "./components/Header";
import { ChatWindow } from "./components/ChatWindow";
import { Composer } from "./components/Composer";
import { useChatController } from "./hooks/useChatController";

// PUBLIC_INTERFACE
function App() {
  /** Main application entry rendering the chatbot UI. */
  const { messages, isTyping, error, actions, meta } = useChatController();

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        actions.stop();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [actions]);

  return (
    <div className="oceanApp">
      <Header />

      <main className="oceanMain" aria-label="Chat application">
        <div className="chatShell">
          <ChatWindow
            messages={messages}
            isTyping={isTyping}
            error={error}
            onClearError={actions.clearError}
            onExample={() => actions.send("Summarize this app UI")}
          />

          <div className="chatSurface" aria-label="Composer container">
            <div className="composerWrap">
              <Composer
                onSend={actions.send}
                onStop={actions.stop}
                onRetry={actions.retry}
                canStop={meta.canStop}
                canRetry={meta.canRetry}
                isTyping={isTyping}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn"
              onClick={actions.resetConversation}
              aria-label="Reset conversation"
            >
              Reset
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
