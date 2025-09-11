import { useState } from "react";
import { X, Shield, AlertTriangle } from "lucide-react";

const GuidelinesModal = ({ onAccept }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="guidelines-overlay">
      <div className="guidelines-modal">
        <div className="guidelines-header">
          <div className="guidelines-icon">
            <Shield className="size-8" />
          </div>
          <h2>Community Guidelines</h2>
          <p className="guidelines-subtitle">
            Welcome to <strong>SquadTalk</strong>! To keep our community safe
            and welcoming, please read and accept our guidelines.
          </p>
        </div>

        <div className="guidelines-content">
          <div className="guidelines-section">
            <h3>🤝 Be Respectful</h3>
            <ul>
              <li>Treat all members with kindness and respect</li>
              <li>No harassment, bullying, or personal attacks</li>
              <li>Respect different opinions and backgrounds</li>
            </ul>
          </div>

          <div className="guidelines-section">
            <h3>🚫 Prohibited Content</h3>
            <ul>
              <li>No hate speech, discrimination, or threats</li>
              <li>No sexual, violent, or inappropriate content</li>
              <li>No spam, scams, or malicious links</li>
              <li>No impersonation of others</li>
            </ul>
          </div>

          <div className="guidelines-section">
            <h3>🔒 Privacy & Safety</h3>
            <ul>
              <li>Don't share personal information without consent</li>
              <li>Report suspicious or harmful behavior</li>
              <li>Use appropriate channel topics</li>
            </ul>
          </div>

          <div className="guidelines-warning">
            <AlertTriangle className="size-5" />
            <span>
              Violation of these guidelines may result in warnings, temporary
              suspension, or permanent removal from SquadTalk.
            </span>
          </div>
        </div>

        <div className="guidelines-footer">
          <label className="guidelines-checkbox">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <span className="checkmark"></span>I have read and agree to follow
            the Community Guidelines
          </label>

          <button
            className="guidelines-accept-btn"
            disabled={!checked}
            onClick={onAccept}
          >
            Accept & Continue to SquadTalk
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidelinesModal;
