import "../styles/auth.css";
import { SignInButton } from "@clerk/clerk-react";

const AuthPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-hero">
          <div className="brand-container">
            <img
              src="/logosquadtalk.png"
              alt="SquadTalk"
              className="brand-logo"
            />
            <span className="brand-name">SquadTalk</span>
          </div>

          <h1 className="hero-title">Collaboration Made Easy </h1>

          <p className="hero-subtitle">
            Join the place where your team talks, shares and builds together.
            <br />
            Sign-in to keep the ideas flowing.
          </p>

          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <span>Live Texts</span>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🎥</span>
              <span>Meets & Calls</span>
            </div>

            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Safe & Secured</span>
            </div>
          </div>

          <SignInButton mode="modal">
            <button className="cta-button">
              Get Started with SquadTalk
              <span className="button-arrow">→</span>
            </button>
          </SignInButton>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-image-container">
          <img
            src="/authimage.png"
            alt="Team collaboration"
            className="auth-image"
          />
          <div className="image-overlay"></div>
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
