import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { config } from "../lib/config";
import { httpRequest } from "../lib/httpClient";
import { useLocalStorageState } from "./useLocalStorageState";

function nowId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

async function mockAssistantReply(userText, { signal } = {}) {
  // Simulate network/LLM latency; support cancel.
  const sleep = (ms) =>
    new Promise((resolve, reject) => {
      const t = window.setTimeout(resolve, ms);
      if (signal) {
        if (signal.aborted) {
          window.clearTimeout(t);
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }
        signal.addEventListener(
          "abort",
          () => {
            window.clearTimeout(t);
            reject(new DOMException("Aborted", "AbortError"));
          },
          { once: true }
        );
      }
    });

  await sleep(650 + Math.round(Math.random() * 450));

  // A simple helpful mock response.
  const trimmed = String(userText || "").trim();
  if (!trimmed) return "Please type a message and press Send.";

  return `Mock reply (no backend configured): I received:\n\n“${trimmed}”\n\nSet REACT_APP_API_BASE to connect to a backend when available.`;
}

/**
 * PUBLIC_INTERFACE
 * Central hook powering the chat experience.
 */
export function useChatController() {
  /** Manage chat messages, loading/error state, and actions (send/stop/retry). */
  const [messages, setMessages] = useLocalStorageState("ocean_chat_messages_v1", []);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  // Used to cancel in-flight requests (Stop).
  const activeRequestAbortRef = useRef(null);

  const lastUserMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i]?.role === "user") return messages[i];
    }
    return null;
  }, [messages]);

  const appendMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, [setMessages]);

  const updateMessageById = useCallback((id, patch) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  }, [setMessages]);

  const stop = useCallback(() => {
    if (activeRequestAbortRef.current) {
      activeRequestAbortRef.current.abort();
      activeRequestAbortRef.current = null;
    }
    setIsTyping(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const send = useCallback(
    async (text) => {
      clearError();
      const content = String(text || "").trim();
      if (!content) return;

      // Cancel any previous in-flight request before sending a new one.
      stop();

      const userMsg = {
        id: nowId(),
        role: "user",
        content,
        status: "sent",
      };
      appendMessage(userMsg);

      const assistantMsgId = nowId();
      appendMessage({
        id: assistantMsgId,
        role: "assistant",
        content: "",
        status: "streaming",
      });

      const controller = new AbortController();
      activeRequestAbortRef.current = controller;
      setIsTyping(true);

      try {
        let reply = "";
        if (config.isMockMode) {
          reply = await mockAssistantReply(content, { signal: controller.signal });
        } else {
          // When a backend exists, we call a generic /chat endpoint.
          // If your backend differs, adjust this path/payload.
          const data = await httpRequest("/chat", {
            method: "POST",
            body: { message: content },
            signal: controller.signal,
          });

          // Flexible parsing: accept {reply}, {message}, {content}, or string.
          if (typeof data === "string") reply = data;
          else if (data && typeof data === "object") {
            reply =
              data.reply ??
              data.message ??
              data.content ??
              JSON.stringify(data);
          } else {
            reply = "No response data received.";
          }
        }

        updateMessageById(assistantMsgId, { content: reply, status: "done" });
      } catch (e) {
        if (e && (e.name === "AbortError" || e.message === "Aborted")) {
          // Mark assistant message as canceled, keep UX consistent.
          updateMessageById(assistantMsgId, {
            content: "Stopped.",
            status: "canceled",
          });
          return;
        }
        const msg = e?.message ? String(e.message) : "Something went wrong.";
        setError(msg);
        updateMessageById(assistantMsgId, {
          content: "Error generating response. Please Retry.",
          status: "error",
        });
      } finally {
        setIsTyping(false);
        activeRequestAbortRef.current = null;
      }
    },
    [appendMessage, clearError, stop, updateMessageById]
  );

  const retry = useCallback(async () => {
    if (!lastUserMessage) return;
    await send(lastUserMessage.content);
  }, [lastUserMessage, send]);

  const resetConversation = useCallback(() => {
    stop();
    clearError();
    setMessages([]);
  }, [clearError, setMessages, stop]);

  // Ensure we have a small system message at first run (optional).
  useEffect(() => {
    if (messages && messages.length > 0) return;
    setMessages([
      {
        id: nowId(),
        role: "system",
        content: config.isMockMode
          ? "You are in mock mode (no backend configured)."
          : "Connected mode (API base configured).",
        status: "info",
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    config,
    messages,
    isTyping,
    error,
    actions: {
      send,
      stop,
      retry,
      resetConversation,
      clearError,
    },
    meta: {
      lastUserMessage,
      canStop: isTyping,
      canRetry: !!lastUserMessage && !isTyping,
    },
  };
}
