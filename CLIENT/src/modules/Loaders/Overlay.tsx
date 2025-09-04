import React from "react";

interface OverlayProps {
    show: boolean;
    message?: string;
}

const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 16,
};

const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 420,
    minHeight: 140,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 12,
    boxSizing: "border-box",
};

const spinnerStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    border: "4px solid #e5e7eb",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
};

const srOnly: React.CSSProperties = {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
};

const styleTag = (
    <style>
        {`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}
    </style>
);

const Overlay: React.FC<OverlayProps> = ({ show, message }) => {
    if (!show) return null;
    return (
        <div style={overlayStyle} aria-live="polite" aria-busy="true">
            {styleTag}
            <div style={cardStyle} role="dialog" aria-modal="true" aria-label={message || "Please wait"}>
                <div style={spinnerStyle} />
                <span style={srOnly}>Loading</span>
                <div style={{ fontWeight: 600, color: "#111827", textAlign: "center" }}>
                    {message || "Updating your cart..."}
                </div>
            </div>
        </div>
    );
};

export default Overlay;


