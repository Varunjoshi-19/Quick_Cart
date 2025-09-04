import React from "react";

interface CenterLoaderProps {
    show: boolean;
    message?: string;
}

const wrap: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(1px)",
};

const box: React.CSSProperties = {
    background: "#ffffff",
    borderRadius: 12,
    padding: "20px 24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
    minWidth: 220,
};

const spinner: React.CSSProperties = {
    width: 40,
    height: 40,
    border: "4px solid #e5e7eb",
    borderTopColor: "#111827",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
};

const CenterLoader: React.FC<CenterLoaderProps> = ({ show, message }) => {
    if (!show) return null;
    return (
        <div style={wrap} aria-live="polite" aria-busy="true">
            <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
            <div style={box} role="dialog" aria-modal="true" aria-label={message || "Loading"}>
                <div style={spinner} />
                <div style={{ fontWeight: 600 }}>{message || "Loading..."}</div>
            </div>
        </div>
    );
};

export default CenterLoader;


