import React from "react";
import { useNavigate } from "react-router-dom";

interface SystemStatePageProps {
  code: string | number;
  title: string;
  message: string;
  mockMessage: string; // mocking message for the player
}

export function SystemStatePage({
  code,
  title,
  message,
  mockMessage,
}: SystemStatePageProps) {
  const navigate = useNavigate();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const jailRef = React.useRef<HTMLDivElement>(null);
  const [seenMouse, setSeenMouse] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!wrapperRef.current || !jailRef.current) return;
    const jailCoords = jailRef.current.getBoundingClientRect();
    const pageCoords = wrapperRef.current.getBoundingClientRect();

    const x = e.clientX - jailCoords.left;
    const y = e.clientY - jailCoords.top;

    wrapperRef.current.style.setProperty("--mouseX", `${x}`);
    wrapperRef.current.style.setProperty("--mouseY", `${y}`);
    wrapperRef.current.style.setProperty("--width", `${pageCoords.width}`);
    wrapperRef.current.style.setProperty("--height", `${pageCoords.height}`);

    if (!seenMouse) {
      setSeenMouse(true);
    }
  };

  const handleMouseLeave = () => {
    setSeenMouse(false);
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleBack}
      className="fixed inset-0 w-full h-screen flex flex-col items-center justify-center bg-bg text-fg select-none z-50 overflow-hidden cursor-pointer"
      style={{
        cursor: seenMouse ? "none" : "pointer",
      }}
    >
      <style>{`
        .system-state-h1 {
          font-size: 15vmin;
          margin-bottom: 0;
          line-height: 1;
          font-weight: 800;
          text-transform: uppercase;
          font-family: "Syne", sans-serif;
        }
        .system-state-h2 {
          font-size: 5vmin;
          margin-top: 0;
          margin-bottom: 40px;
          font-family: "Space Mono", monospace;
          color: var(--color-cyber-cyan, #C8FF00);
        }
        .system-state-message {
          font-family: "Space Grotesk", sans-serif;
          font-size: 16px;
          max-width: 600px;
          margin-bottom: 12px;
          opacity: 0.8;
          text-align: center;
          padding: 0 20px;
        }
        .system-state-mock {
          font-family: "Space Mono", monospace;
          font-size: 14px;
          max-width: 600px;
          margin-bottom: 30px;
          color: var(--color-cyber-crimson, #FF3D3D);
          text-align: center;
          padding: 0 20px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          animation: pulse 2s infinite;
        }
        .system-state-jail {
          position: relative;
          border: 2px solid gray;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-surface);
        }
        .system-state-svg {
          display: none;
          position: absolute;
          width: 100px;
          height: 100px;
          left: 50%;
          top: 50%;
          transform-origin: 50% 50%;
          animation: system-state-spin 4s linear infinite;
          pointer-events: none;
        }
        .system-state-svg text {
          font-family: "Space Mono", monospace;
          font-weight: bold;
          fill: var(--color-cyber-cyan, #C8FF00);
        }
        @keyframes system-state-spin {
          0% { transform: translate(-50%, -50%) rotate(360deg); }
          100% { transform: translate(-50%, -50%) rotate(0deg); }
        }
        @keyframes system-state-dragMouse {
          0% {
            left: calc(var(--mouseX) * 1px);
            top: calc(var(--mouseY) * 1px);
          }
          100% {
            left: calc(var(--mouseX) / var(--width) * 10px + 12px);
            top: calc(var(--mouseY) / var(--height) * 10px + 8px);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .system-state-escape-hint {
          font-family: "Space Mono", monospace;
          font-size: 11px;
          opacity: 0.6;
          letter-spacing: 0.2em;
          margin-top: 24px;
        }
      `}</style>

      <h1 className="system-state-h1">{title}</h1>
      <h2 className="system-state-h2">Code {code}</h2>

      {message && <p className="system-state-message">{message}</p>}
      {mockMessage && <p className="system-state-mock">&gt; {mockMessage}</p>}

      <div className="relative flex justify-center mb-6">
        <div ref={jailRef} id="jail" className="system-state-jail">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="xMinYMin"
            id="spinner"
            className="system-state-svg"
            style={{ display: seenMouse ? "block" : "none" }}
          >
            <defs>
              <path id="textPath" d="M 250 500 A 250,250 0 1 1 250 500.0001" />
            </defs>
            <text x="0" y="0" textAnchor="start" style={{ fontSize: "90pt" }}>
              <textPath href="#textPath" startOffset="0%">
                MOUSE JAIL
              </textPath>
              <textPath href="#textPath" startOffset="50%">
                MOUSE JAIL
              </textPath>
            </text>
          </svg>
          {seenMouse && (
            <div
              id="cursor"
              style={{
                position: "absolute",
                left: "12px",
                top: "8px",
                pointerEvents: "none",
                width: "32px",
                height: "32px",
                backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QAAAAAAAD5Q7t/AAABX0lEQVRYw+3UMUvDUBQF4EOv3Nk2OnjxB4gg6OQo2Nm/5c9w0snJyUWlKAhBEaRgKypiiK/FrdBCad/NdWkgFnHyNUvOEshyPk5eHoilRyy7KCm12fOwNASx9D5d34jlshQEsfTMzEpD5IDSEEVAKYh5wMIRvwFU1ZIkXQxiHqCqNp1ObTune2+vbe3hEEVAsH41GNhgM7OmpGxSRX0TIsgxZlkFVoarw3kNVsbLSwH18vo9Al1Xtr3LvPbz3iKI6bm/O9gEc/jdgKQfk5WnqsLoawXuPtfXtqxCz/wix9PJv/vz8YsQyPD45NeecEcsFsRwEBxTLiWWXWNpJklgc3xmxtEP21wAgTR02t/ZGAJo6cTGAj4eHNhqNZQD4CLrC7BcbFk/4bIVOt9u1VuvaiOUxVP+STlxz/qVOXEwsb/3+10YU1QFgGmyBP5YRYukQyxGx7CwcUKVKlSpVqiwq37opL7UKP+WdAAAAAElFTkSuQmCC')",
                backgroundSize: "contain",
                animation: "system-state-dragMouse 2s ease forwards",
                zIndex: 50,
              }}
            />
          )}
        </div>
      </div>

      <div className="system-state-escape-hint animate-pulse">
        &gt; CLICK ANYWHERE TO ESCAPE &lt;
      </div>
    </div>
  );
}
