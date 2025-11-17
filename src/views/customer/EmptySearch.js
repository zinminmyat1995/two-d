import React from "react";

/**
 * Exact copy of the provided empty-search screen
 * - Self-contained CSS & SVG (no Tailwind)
 * - Mobile-friendly center layout
 * - Pink CTA matches mock
 *
 * Usage:
 * <EmptySearchExact onRetry={() => ...} />
 */
export default function EmptySearch({
  title = "Search Results",
  headline = "No results found",
  subline = "You may continue searching for other menus.",
  ctaText = "SEARCH AGAIN",
  onRetry,
}) {
  return (
    <div className="page">
      <style>{`
        .page {
          background: #ffffff;
          color: #111;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji",
            "Segoe UI Emoji", "Segoe UI Symbol";
          display: flex;
          flex-direction: column;
        }
        /* Top app bar */
        .appbar {
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .appbar-title {
          font-size: 16px;
          font-weight: 600;
          color: #111;
        }
        .appbar-btn {
          position: absolute;
          top: 0; bottom: 0;
          width: 56px;
          display: flex; align-items: center; justify-content: center;
          color: #111; opacity: 0.9;
        }
        .appbar-btn.left { left: 0; }
        .appbar-btn.right { right: 0; }

        /* Body */
        .body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 20px 32px;
          text-align: center;
        }

        .stack { max-width: 320px; width: 100%; }

        .illus { margin: 0 auto 10px; width: 130px; height: 130px; }

        .headline {
          margin: 6px 0 6px;
          font-size: 20px;
          font-weight: 700;
          color: #111;
        }

        .subline {
          white-space: pre-line;
          font-size: 13px;
          line-height: 20px;
          color: #8a8f96; /* light gray like mock */
          margin-bottom: 16px;
        }

        .cta {
          appearance: none;
          border: 0;
          border-radius: 6px;
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.4px;
          color: #fff;
          background: #ff4f7a;           /* pink from mock */
          box-shadow: 0 6px 12px rgba(255, 79, 122, 0.35);
          cursor: pointer;
        }
        .cta:active { transform: translateY(0.5px); }

        /* Icon buttons (dots & back) */
        .icon {
          width: 22px; height: 22px;
          display: inline-block;
        }
      `}</style>


      {/* Body */}
      <div className="body">
        <div className="stack">
          <MagnifierSad className="illus" />

          <div className="headline">{headline}</div>
          <div className="subline">{subline}</div>

          {/* <button className="cta" onClick={onRetry}>{ctaText}</button> */}
        </div>
      </div>
    </div>
  );
}



function MagnifierSad({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      {/* motion lines */}
      <g stroke="#d7dbe0" strokeWidth="4" strokeLinecap="round">
        <path d="M40 92h28" />
        <path d="M52 104h20" />
        <path d="M140 80h24" />
        <path d="M144 92h20" />
      </g>

      {/* lens */}
      <circle cx="96" cy="98" r="40" fill="none" stroke="#cfd6dc" strokeWidth="4" />
      {/* handle */}
      <rect x="126" y="126" width="16" height="44" rx="8" fill="#cfd6dc" transform="rotate(45 134 148)" />

      {/* sad face */}
      <circle cx="84" cy="92" r="4" fill="#c0c6cc" />
      <circle cx="108" cy="92" r="4" fill="#c0c6cc" />
      <path d="M86 112q10-8 20 0" fill="none" stroke="#c0c6cc" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
