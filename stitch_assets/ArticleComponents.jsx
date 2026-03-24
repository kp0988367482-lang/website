import React from "react";

export function Highlight({ children }) {
  return (
    <span style={{
      background: "#c9a84c",
      color: "#0f0e0c",
      padding: "0.2rem 0.5rem",
      borderRadius: 4,
      fontWeight: 700
    }}>{children}</span>
  );
}

export function Tip({ children }) {
  return (
    <div style={{
      background: "#d4cfc4",
      color: "#1a3a5c",
      padding: "0.7rem 1rem",
      borderRadius: 6,
      marginBottom: "1.2rem",
      fontSize: "0.98rem"
    }}>{children}</div>
  );
}

export function CTA({ href, children }) {
  return (
    <a href={href} style={{
      display: "block",
      background: "#c0392b",
      color: "white",
      textAlign: "center",
      fontWeight: 700,
      padding: "1rem 0",
      borderRadius: 8,
      margin: "2rem 0",
      textDecoration: "none",
      fontSize: "1.1rem"
    }}>{children}</a>
  );
}

export function Blockquote({ children }) {
  return (
    <blockquote style={{
      borderLeft: "4px solid #c0392b",
      background: "#d4cfc4",
      color: "#0f0e0c",
      padding: "1rem 1.5rem",
      margin: "2rem 0",
      fontStyle: "italic"
    }}>{children}</blockquote>
  );
}
