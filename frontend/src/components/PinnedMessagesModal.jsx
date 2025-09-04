import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X as XIcon, PinIcon } from "lucide-react";

/** Build a compact preview for polls (or attachments) */
const extractPollSummary = (msg) => {
  const poll = msg.poll || msg?.attachments?.find?.((a) => a.type === "poll");
  if (!poll) return null;

  const title = poll.name || poll.title || poll.text || "Poll";
  const opts = poll.options || poll.answer_options || poll.answers || [];
  const labels = opts
    .map((o) => o.text || o.name || o.label)
    .filter(Boolean)
    .slice(0, 3);
  const more =
    opts.length > labels.length ? ` +${opts.length - labels.length} more` : "";

  return `📊 ${title}${labels.length ? " — " + labels.join(" • ") : ""}${more}`;
};

const extractDisplayText = (msg) => {
  const t = (msg.text || "").trim();
  if (t) return t;

  const pollSummary = extractPollSummary(msg);
  if (pollSummary) return pollSummary;

  if (msg.attachments?.length) {
    const first = msg.attachments[0];
    return (
      first.title ||
      first.fallback ||
      first.text ||
      (first.type ? `(${first.type} attachment)` : "(Attachment)")
    );
  }
  return "(No text)";
};

const PinnedMessagesModal = ({
  pinnedMessages = [],
  onClose,
  onJumpToMessage,
}) => {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Close on outside click
  useEffect(() => {
    const onMouseDown = (e) => {
      if (
        overlayRef.current &&
        modalRef.current &&
        overlayRef.current === e.target
      ) {
        onClose?.();
      }
    };
    overlayRef.current?.addEventListener("mousedown", onMouseDown);
    return () =>
      overlayRef.current?.removeEventListener("mousedown", onMouseDown);
  }, [onClose]);

  const content = (
    <div
      className="pinned-overlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
    >
      <div className="pinned-modal" ref={modalRef}>
        {/* Header */}
        <div className="pinned-modal__header">
          <div className="pinned-modal__title">
            <PinIcon className="h-4 w-4" />
            <span>Pinned messages</span>
            <span className="pinned-modal__count">
              · {pinnedMessages.length}
            </span>
          </div>
          <button
            className="pinned-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <XIcon className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        {pinnedMessages.length === 0 ? (
          <div className="pinned-empty">No pinned messages yet.</div>
        ) : (
          <div className="pinned-list">
            {pinnedMessages.map((msg) => {
              const user = msg.user || {};
              const name = user.name || user.id || "Unknown";
              const when = msg.created_at
                ? new Date(msg.created_at).toLocaleString()
                : "";
              const preview = extractDisplayText(msg);

              return (
                <button
                  key={msg.id}
                  className="pinned-item pinned-item--clickable"
                  onClick={() => onJumpToMessage?.(msg.id)}
                  title="Open this message in chat"
                >
                  <div className="pinned-item__avatar">
                    {user.image ? (
                      <img src={user.image} alt={name} />
                    ) : (
                      <div
                        className="pinned-item__avatar--placeholder"
                        aria-hidden
                      />
                    )}
                  </div>

                  <div className="pinned-item__content">
                    <div className="pinned-item__row">
                      <div className="pinned-item__author">{name}</div>
                      <div className="pinned-item__meta">{when}</div>
                    </div>
                    <div className="pinned-item__text">{preview}</div>
                  </div>

                  <div className="pinned-item__actions" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(content, document.body)
    : content;
};

export default PinnedMessagesModal;
