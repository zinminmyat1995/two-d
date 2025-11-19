import React from "react";
import basket from "../../assets/images/basket.png";
import { Image } from "lucide-react";

export default function ConfirmList({ back, confirmListData = [], tableNo, url }) {
  const totalPrice = confirmListData.reduce((sum, i) => sum + i.count * i.price, 0);

  return (
    <div className="">
      <div className="">
        {/* Top bar (sticky) */}
        <div className="pd-topbar">
          <button
            type="button"
            className="icon-btn back-btn"
            aria-label="back"
            onClick={back}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="pd-title">Order Confirmed!</div>

          {/* table number badge */}
          <div className="table-badge">
            <span className="table-label">Table</span>
            <span className="table-num">{tableNo}</span>
          </div>
        </div>

        {/* Content */}
        {confirmListData.length > 0 ? (
          <>
            <div className="cv-list cv-has-footer">
              {confirmListData.map((it, idx) => (
                <div className="cv-item" key={idx}>
                  {/* LEFT: image column */}
                  <div className="cv-thumb">
                    {it.image == null ? (
                      <div className="cv-thumb-placeholder">
                        <Image />
                      </div>
                    ) : (
                      <img
                        className="cv-thumb-img"
                        src={`${url}/${it.image}`}
                        alt={it.menu_name}
                      />
                    )}
                  </div>

                  {/* MIDDLE: name / meat */}
                  <div className="cv-body">
                    <div className="cv-name">{it.menu_name}</div>
                    <div className="cv-meat">{it.meat_name}</div>
                  </div>

                  {/* RIGHT: price */}
                  <div className="cv-side">
                    <div className="cv-price">
                      {it.count} x ฿{it.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* fixed footer with total */}
            <div className="cv-footer">
              <div className="cv-totalcard">
                <div className="cv-total-left">
                  <div className="cv-tlabel">Total Bill</div>
                </div>
                <div className="cv-amount">฿{totalPrice}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="pd-content">
              <div className="pd-illustration">
                <div className="pd-stars">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <BasketWithCross className="pd-basket" />
              </div>

              <div className="pd-text">
                <p className="pd-headline">No Orders Found</p>
                <p className="pd-sub">
                  You haven’t selected any order yet. Choose an order to place one.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Styles */}
      <style>{`
        /* Top bar (sticky and clickable) */
        .pd-topbar{
          position:sticky;top:0;z-index:10;
          display:flex;align-items:center;gap:12px;
          padding:12px 12px;border-bottom:1px solid #f3f4f6;
          background:#fff;
        }
        .icon-btn{height:36px;width:36px;border:0;border-radius:12px;background:#fff;
          display:grid;place-items:center;font-size:18px;color:#111827;cursor:pointer}
        .back-btn{position:relative;height:40px;width:40px;border-radius:12px;transition:transform .2s ease}
        .back-btn:hover{transform:translateY(-1px)}
        .back-btn:active{transform:scale(.96)}
        .back-btn svg{stroke:#ff4b47;width:22px;height:22px}
        .pd-title{
          position:absolute;left:50%;transform:translateX(-50%);
          font-size:16px;font-weight:700;color:#1f2937;
        }

        .table-badge {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(145deg, #fff4f4, #ffe5e5);
          border: 1px solid #ffc5c5;
          color: #b91c1c;
          font-weight: 700;
          font-size: 13px;
          border-radius: 14px;
          padding: 6px 10px;
          box-shadow: 0 2px 5px rgba(251, 78, 75, 0.15);
        }
        .table-label {
          font-weight: 600;
          color: #fb4e4b;
          font-size: 12px;
        }
        .table-num {
          background: #fb4e4b;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          padding: 2px 6px;
          min-width: 22px;
          text-align: center;
        }

        /* Empty state content area */
        .pd-content{
          flex:1;display:flex;flex-direction:column;align-items:center;
          padding:24px;overflow:auto;
        }
        .pd-illustration{
          position:relative;width:192px;height:192px;border-radius:9999px;
          background:#fffbeb;display:flex;align-items:center;justify-content:center;overflow:hidden;
        }
        .pd-stars span{position:absolute;width:6px;height:6px;background:#fcd34d;border-radius:50%;}
        .pd-stars span:nth-child(1){top:26px;left:46px}
        .pd-stars span:nth-child(2){top:18px;left:92px}
        .pd-stars span:nth-child(3){top:34px;left:122px}
        .pd-stars span:nth-child(4){top:56px;left:150px;width:5px;height:5px}
        .pd-stars span:nth-child(5){top:72px;left:132px;width:5px;height:5px}
        .pd-stars span:nth-child(6){top:78px;left:40px;width:4px;height:4px}
        .pd-stars span:nth-child(7){top:92px;left:18px;width:4px;height:4px}
        .pd-stars span:nth-child(8){top:104px;left:76px;width:4px;height:4px}
        .pd-basket{width:96px;height:96px}
        .pd-text{text-align:center;margin-top:24px;line-height:1.5}
        .pd-headline{font-size:15px;font-weight:700;margin:0}
        .pd-sub{font-size:13px;color:#6b7280;margin:6px 0 0}

        /* Orders list */
        .cv-list{padding:12px;display:grid;gap:10px;overflow:auto}
        .cv-list.cv-has-footer{padding-bottom:160px;}

        /* Each row: [IMAGE] [TEXT] [PRICE] */
        .cv-item{
          display:grid;
          grid-template-columns: 64px 1fr auto;
          gap:12px;
          align-items:center;
          background:#fff;
          border-radius:14px;
          border:1px solid #f1eef2;
          box-shadow:0 1px 2px rgba(0,0,0,.03);
          padding:10px;
        }

        /* LEFT: thumbnail */
        .cv-thumb{
          width:54px;
          height:54px;
          border-radius:12px;
          overflow:hidden;
          background:#f5f5f5;
          position:relative;
          flex-shrink:0;
        }
        .cv-thumb-img{
          width:100%;
          height:100%;
          object-fit:cover;
          object-position:center;
          display:block;
        }

        /* Placeholder center */
        .cv-thumb-placeholder{
          position:absolute;
          inset:0;
          display:flex;
          align-items:center;
          justify-content:center;
          opacity:0.6;
        }
        .cv-thumb-placeholder svg{
          width:26px;
          height:26px;
          color:#9ca3af;
        }

        /* MIDDLE: text */
        .cv-body{
          display:flex;
          flex-direction:column;
          gap:4px;
          min-width:0;
        }
        .cv-name{
          font-size:15px;
          font-weight:600;
          color:#1f2937;
          white-space:nowrap;
          text-overflow:ellipsis;
          overflow:hidden;
          padding-bottom: 10px;
        }
        .cv-meat{
          font-size:13px;
          color:#4b5563;
          margin-top:-10px;
          white-space:nowrap;
          text-overflow:ellipsis;
          overflow:hidden;
          padding-bottom: 10px;
        }

        /* RIGHT: price */
        .cv-side{
          display:flex;
          flex-direction:column;
          align-items:flex-end;
          justify-content:center;
          gap:4px;
        }
        .cv-price{
          font-size:14px;
          color:#0e0e0ea1;
          font-weight:600;
          white-space:nowrap;
        }

        /* fixed footer */
        .cv-footer{
          position:fixed;left:0;right:0;bottom:0;z-index:20;
          padding:12px 14px 16px;
          background:rgba(255,255,255,.9);
          backdrop-filter: saturate(1.2) blur(6px);
          box-shadow:0 -6px 20px rgba(0,0,0,.06);
        }
        .cv-totalcard{
          display:flex;align-items:center;justify-content:space-between;
          border:1px solid #f0e7ea;
          background:linear-gradient(180deg,#fff,#fff8fa);
          border-radius:14px;padding:10px 14px;margin-bottom:10px;
        }
        .cv-total-left{display:flex;flex-direction:column}
        .cv-tlabel{font-size:17px;color:#7c7a80}
        .cv-amount{
          font-size:18px;letter-spacing:.2px;
          color:#7c7a80;
        }
      `}</style>
    </div>
  );
}

/* Basket image inside SVG wrapper */
function BasketWithCross({ className = "" }) {
  return (
    <svg
      viewBox="0 0 128 128"
      className={className}
      role="img"
      aria-label="Order placed basket"
    >
      <image
        href={basket}
        x="19"
        y="19"
        width="90"
        height="90"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}
