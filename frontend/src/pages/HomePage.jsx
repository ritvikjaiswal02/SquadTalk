import { UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router"; // ✅ from react-router-dom
import { useStreamChat } from "../hooks/useStreamChat.js";
import PageLoader from "../components/PageLoader";

import {
  Chat,
  Channel,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";

import "../styles/stream-chat-theme.css";
import { HashIcon, PlusIcon, UsersIcon } from "lucide-react";
import CreateChannelModal from "../components/CreateChannelModal";
import CustomChannelPreview from "../components/CustomChannelPreview";
import UsersList from "../components/UsersList";
import CustomChannelHeader from "../components/CustomChannelHeader";

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [activeTab, setActiveTab] = useState("channels"); // "dm" | "channels" | "calls"
  const [searchParams, setSearchParams] = useSearchParams();

  const { chatClient, error, isLoading } = useStreamChat();

  // set active channel from URL params
  useEffect(() => {
    if (chatClient) {
      const channelId = searchParams.get("channel");
      if (channelId) {
        const channel = chatClient.channel("messaging", channelId);
        setActiveChannel(channel);
      }
    }
  }, [chatClient, searchParams]);

  if (error) return <p>Something went wrong...</p>;
  if (isLoading || !chatClient) return <PageLoader />;

  return (
    <div className="chat-wrapper">
      <Chat client={chatClient}>
        <div className="chat-container">
          {/* LEFT VERTICAL RAIL (WhatsApp-style) */}
          <aside className="app-rail">
            <button
              className={`app-rail__btn ${activeTab === "dm" ? "active" : ""}`}
              onClick={() => setActiveTab("dm")}
              title="Direct Messages"
            >
              <UsersIcon className="size-5" />
              <span>DMs</span>
            </button>

            <button
              className={`app-rail__btn ${
                activeTab === "channels" ? "active" : ""
              }`}
              onClick={() => setActiveTab("channels")}
              title="Channels"
            >
              <HashIcon className="size-5" />
              <span>Channels</span>
            </button>

            <button
              className={`app-rail__btn ${
                activeTab === "calls" ? "active" : ""
              }`}
              onClick={() => setActiveTab("calls")}
              title="Calls"
            >
              {/* Using PlusIcon here just as a placeholder phone glyph if you don't have PhoneIcon */}
              <PlusIcon className="size-5" />
              <span>Calls</span>
            </button>

            <div className="app-rail__footer">
              <div className="user-button-wrapper">
                <UserButton />
              </div>
            </div>
          </aside>

          {/* MIDDLE SIDEBAR (switches content based on active tab) */}
          <div className="str-chat__channel-list">
            <div className="team-channel-list">
              {/* HEADER */}
              <div className="team-channel-list__header gap-4">
                <div className="brand-container">
                  <img
                    src="/logosquadtalk.png"
                    alt="Logo"
                    className="brand-logo"
                  />
                  <span className="brand-name">SquadTalk</span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="team-channel-list__content">
                {/* CHANNELS TAB */}
                {activeTab === "channels" && (
                  <>
                    <div className="create-channel-section">
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="create-channel-btn"
                      >
                        <PlusIcon className="size-4" />
                        <span>Create Channel</span>
                      </button>
                    </div>

                    <ChannelList
                      filters={{ members: { $in: [chatClient?.user?.id] } }}
                      options={{ state: true, watch: true }}
                      Preview={({ channel }) => (
                        <CustomChannelPreview
                          channel={channel}
                          activeChannel={activeChannel}
                          setActiveChannel={(channel) =>
                            setSearchParams({ channel: channel.id })
                          }
                        />
                      )}
                      List={({ children, loading, error }) => (
                        <div className="channel-sections">
                          <div className="section-header">
                            <div className="section-title">
                              <HashIcon className="size-4" />
                              <span>Channels</span>
                            </div>
                          </div>

                          {loading && (
                            <div className="loading-message">
                              Loading channels...
                            </div>
                          )}
                          {error && (
                            <div className="error-message">
                              Error loading channels
                            </div>
                          )}

                          <div className="channels-list">{children}</div>
                        </div>
                      )}
                    />
                  </>
                )}

                {/* DIRECT MESSAGES TAB */}
                {activeTab === "dm" && (
                  <div className="channel-sections">
                    <div className="section-header">
                      <div className="section-title">
                        <UsersIcon className="size-4" />
                        <span>Direct Messages</span>
                      </div>
                    </div>
                    <div className="channels-list">
                      <UsersList activeChannel={activeChannel} />
                    </div>
                  </div>
                )}

                {/* CALLS TAB (placeholder) */}
                {activeTab === "calls" && (
                  <div className="channel-sections">
                    <div className="section-header">
                      <div className="section-title">
                        <span>Calls</span>
                      </div>
                    </div>
                    <div className="team-channel-list__message">
                      Voice/Video calls coming soon.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT MAIN CHAT */}
          <div className="chat-main">
            <Channel channel={activeChannel}>
              <Window>
                <CustomChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </div>
        </div>

        {isCreateModalOpen && (
          <CreateChannelModal onClose={() => setIsCreateModalOpen(false)} />
        )}
      </Chat>
    </div>
  );
};

export default HomePage;
