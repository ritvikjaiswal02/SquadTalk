import {
  HashIcon,
  LockIcon,
  UsersIcon,
  PinIcon,
  VideoIcon,
  X as XIcon,
} from "lucide-react";
import { useChannelStateContext } from "stream-chat-react";
import { useMemo, useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import PinnedMessagesModal from "./PinnedMessagesModal";
import InviteModal from "./InviteModal";

const CustomChannelHeader = () => {
  const { channel } = useChannelStateContext();
  const { user } = useUser();

  const memberCount = Object.keys(channel.state.members).length;

  const [showInvite, setShowInvite] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState([]);

  const popoverRef = useRef(null);

  const otherUser = useMemo(
    () =>
      Object.values(channel.state.members).find((m) => m.user.id !== user.id),
    [channel.state.members, user.id]
  );

  const isDM =
    channel.data?.member_count === 2 &&
    String(channel.data?.id || "").includes("user_");

  const title = isDM
    ? otherUser?.user?.name || otherUser?.user?.id
    : channel.data?.id || "channel";

  const subtitle = isDM
    ? otherUser?.user?.online
      ? "Online"
      : "Offline"
    : `${memberCount} members`;

  const handleShowPinned = async () => {
    const channelState = await channel.query();
    setPinnedMessages(channelState.pinned_messages || []);
    setShowPinnedMessages(true);
  };

  const handleVideoCall = async () => {
    if (!channel) return;
    const callUrl = `${window.location.origin}/call/${channel.id}`;
    await channel.sendMessage({
      text: `I've started a video call. Join me here: ${callUrl}`,
    });
  };

  // Close members popover on outside click & Esc
  useEffect(() => {
    if (!showMembers) return;
    const onClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target))
        setShowMembers(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setShowMembers(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [showMembers]);

  const members = useMemo(() => {
    return Object.values(channel.state.members)
      .map((m) => m.user)
      .filter(Boolean);
  }, [channel.state.members]);

  // Scroll to message & briefly highlight it
  const scrollToMessage = async (messageId) => {
    const selectMsg = () =>
      document.querySelector(`[data-message-id="${messageId}"]`);

    let el = selectMsg();
    if (!el) {
      // ensure message is loaded (optional, best-effort)
      try {
        await channel.query({ id_lte: messageId }, { limit: 1 });
      } catch {}
      el = selectMsg();
    }

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("message--jump-highlight");
      setTimeout(() => el.classList.remove("message--jump-highlight"), 1600);
    }
    setShowPinnedMessages(false);
  };

  // Avatar node
  const Avatar = () => {
    if (isDM && otherUser?.user?.image) {
      return (
        <img
          src={otherUser.user.image}
          alt={otherUser.user.name || otherUser.user.id}
          className="topbar-avatar"
        />
      );
    }
    return (
      <div className="topbar-avatar" aria-hidden>
        {channel.data?.private ? (
          <LockIcon className="h-4 w-4" />
        ) : (
          <HashIcon className="h-4 w-4" />
        )}
      </div>
    );
  };

  return (
    <div className="custom-topbar">
      {/* LEFT */}
      <div className="custom-topbar__left">
        <Avatar />
        <div className="topbar-info">
          <div className="topbar-title">{title}</div>
          <div className="topbar-subtitle">{subtitle}</div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="custom-topbar__right">
        <button
          className="topbar-btn"
          onClick={() => setShowMembers((s) => !s)}
          title="Members"
          aria-expanded={showMembers}
          aria-controls="members-popover"
        >
          <UsersIcon className="h-5 w-5" />
        </button>

        <button
          className="topbar-btn"
          onClick={handleVideoCall}
          title="Start video call"
        >
          <VideoIcon className="h-5 w-5" />
        </button>

        {channel.data?.private && (
          <button
            className="btn-invite"
            onClick={() => setShowInvite(true)}
            title="Invite people"
          >
            Invite
          </button>
        )}

        <button
          className="topbar-btn"
          onClick={handleShowPinned}
          title="Pinned messages"
        >
          <PinIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Members Popover */}
      {showMembers && (
        <div
          id="members-popover"
          className="members-popover"
          ref={popoverRef}
          role="dialog"
          aria-label="Members"
        >
          <div className="members-popover__header">
            <span>Members · {memberCount}</span>
            <button
              className="members-popover__close"
              onClick={() => setShowMembers(false)}
              aria-label="Close"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="members-popover__list">
            {members.map((u) => (
              <div key={u.id} className="members-popover__item">
                {u.image ? (
                  <img
                    src={u.image}
                    alt={u.name || u.id}
                    className="members-popover__avatar"
                  />
                ) : (
                  <div className="members-popover__avatar" />
                )}
                <div>
                  <div className="members-popover__name">{u.name || u.id}</div>
                  <div className="members-popover__meta">
                    {u.online ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showPinnedMessages && (
        <PinnedMessagesModal
          pinnedMessages={pinnedMessages}
          onClose={() => setShowPinnedMessages(false)}
          onJumpToMessage={scrollToMessage}
        />
      )}

      {showInvite && (
        <InviteModal channel={channel} onClose={() => setShowInvite(false)} />
      )}
    </div>
  );
};

export default CustomChannelHeader;
