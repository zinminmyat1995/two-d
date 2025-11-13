import React from "react";

/**
 * Self-contained 404 screen (no Tailwind required)
 * - Glassy card + soft shadows
 * - Pink brand theme via CSS variables
 * - Works anywhere; just drop it in
 *
 * Usage:
 * <NotFound brandColor="#ff4da6" homeHref="/" />
 */
export default function NotFound({ homeHref = "/", brandColor = "#ff4da6" }) {
  return (
    <div
      className="nf-wrap"
      // expose brand color to CSS
      style={{ ["--brand"]: brandColor }}
    >
      {/* Scoped CSS (only affects .nf-wrap*) */}
      <style>{`
        .nf-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: radial-gradient(1200px 600px at 20% -10%, var(--brand)15%, transparent 60%),
                      radial-gradient(1000px 500px at 120% 120%, #9d174d33, transparent 60%),
                      linear-gradient(#fafafa, #ffffff);
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          color: #0f172a;
        }
        @media (prefers-color-scheme: dark) {
          .nf-wrap {
            background: radial-gradient(1200px 600px at 20% -10%, color-mix(in oklab, var(--brand), white 20%) 18%, transparent 60%),
                        radial-gradient(1000px 500px at 120% 120%, #83184366, transparent 60%),
                        linear-gradient(#0b1020, #0b1220 50%, #050814);
            color: #e2e8f0;
          }
        }
        .nf-card {
          position: relative;
          width: 100%;
          max-width: 420px;
          border-radius: 24px;
          padding: 36px 28px 28px;
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          overflow: hidden;
        }
        @media (prefers-color-scheme: dark) {
          .nf-card {
            background: rgba(2,6,23,0.7);
            box-shadow: 0 20px 60px rgba(0,0,0,0.45);
          }
        }
        .nf-deco-left, .nf-deco-right{
          position:absolute; inset:auto auto auto auto;
          width: 140px; height: 140%;
          filter: blur(32px); opacity:.25; pointer-events:none;
          background: linear-gradient(180deg, var(--brand), transparent);
        }
        .nf-deco-left { left:-48px; top:-10%; border-radius: 999px; }
        .nf-deco-right{ right:-48px; bottom:-10%; border-radius: 999px; }

        .nf-illust { display:flex; justify-content:center; margin-bottom: 16px; }
        .nf-title  { text-align:center; font-weight: 800; font-size: 28px; line-height: 1.1; margin: 6px 0 0; }
        .nf-title span{
          background: linear-gradient(135deg, var(--brand), #fda4af);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .nf-text   { margin-top: 8px; text-align:center; font-size: 14px; line-height: 1.6; color:#475569;}
        @media (prefers-color-scheme: dark){ .nf-text{ color:#94a3b8; } }

        .nf-btn {
          margin-top: 18px; width: 100%;
          display:inline-flex; align-items:center; justify-content:center;
          padding: 12px 18px; border-radius: 14px;
          font-weight: 600; font-size: 14px; letter-spacing: .2px;
          color: white; text-decoration: none; border: 0; cursor: pointer;
          background: linear-gradient(135deg, var(--brand), color-mix(in oklab, var(--brand), black 12%));
          box-shadow: 0 10px 26px color-mix(in oklab, var(--brand), black 30%) ;
          transition: transform .15s ease, box-shadow .2s ease, filter .2s ease;
        }
        .nf-btn:hover   { transform: translateY(-1px); filter: brightness(1.04); }
        .nf-btn:active  { transform: translateY(0);   filter: brightness(.98); }
        .nf-code { margin-top: 10px; text-align:center; font-size:12px; color:#94a3b8;}
        .nf-shadow-ellipse{
          position:absolute; left:50%; transform:translateX(-50%);
          bottom: 16px; width: 70%; height: 12px; border-radius:999px;
          background: #00000018;
        }
        @media (prefers-color-scheme: dark){ .nf-shadow-ellipse{ background:#00000066; } }
      `}</style>

      <div className="nf-card">
        <div className="nf-deco-left" />
        <div className="nf-deco-right" />

        <div className="nf-illust">
          <SignpostSVG brand="var(--brand)" />
        </div>

        <h1 className="nf-title">
          Page <span>Not Found</span>
        </h1>
        <p className="nf-text">
          We’re sorry, the page you requested could not be found.
          <br />Please scan the QR code again carefully.
        </p>

        {/* <a href={homeHref} className="nf-btn">GO HOME</a> */}
        <div className="nf-shadow-ellipse" />
      </div>
    </div>
  );
}

/** SVG updated to pink theme + better proportions */
function SignpostSVG({ brand = "#ff4da6" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="164" height="122" viewBox="0 0 164 122" role="img" aria-label="404 sign"
      style={{ filter: "drop-shadow(0 8px 14px rgba(0,0,0,.12))" }}
    >
      {/* Pole */}
      <rect x="78" y="18" width="8" height="90" rx="3" fill="#cbd5e1" />
      {/* Base */}
      <ellipse cx="82" cy="112" rx="40" ry="7" fill="#e2e8f0" />

      {/* Left sign (ERROR) */}
      <g transform="translate(10, 26)">
        <path
          d="M0 18 L20 0 H112 a8 8 0 0 1 8 8 v20 a8 8 0 0 1 -8 8 H20 Z"
          fill={brand}
        />
        <text x="26" y="24" fontFamily="Inter, ui-sans-serif, system-ui"
              fontWeight="700" fontSize="14" fill="white">ERROR</text>
      </g>

      {/* Right sign (404) */}
      <g transform="translate(30, 58)">
        <path
          d="M124 18 L104 0 H12 a8 8 0 0 0 -8 8 v20 a8 8 0 0 0 8 8 h92 Z"
          fill="#fda4af"
        />
        <text x="40" y="24" fontFamily="Inter, ui-sans-serif, system-ui"
              fontWeight="800" fontSize="14" fill="white">404</text>
      </g>

      {/* Accent floor line */}
      <path d="M12 100 H152" stroke="#cbd5e1" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}
