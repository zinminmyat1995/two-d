import React from "react";
import basket from "../../assets/images/basket.png";

export default function OrderList({ back, orderList = [], tableNo,totalPrice, plusDailyBtn, minusDailyBtn ,minusBtn, plusBtn, deleteBtn, deleteDailyBtn,orderClick}) {


  const product = {
    name: "Hamburger Veggie Burger",
    basePrice: 9.99,
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    etaMins: 14,
    desc:
      "Enjoy our delicious Hamburger Veggie Burger, made with a savory blend of fresh vegetables and herbs, topped with crisp lettuce, juicy tomatoes and pickles, all served on a soft, toasty bun.",
  };


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

            <div className="pd-title">My Order</div>

            {/* 👉 table number badge */}
            <div className="table-badge">
                <span className="table-label">Table</span>
                <span className="table-num">{tableNo}</span>
            </div>
        </div>

        {/* Content */}
        {orderList.length > 0 ? (
          <>
            <div className="cv-list cv-has-footer">
              {orderList.map((it, idx) => (
                <div className="cv-item" key={it.id || idx}>
                  <img className="cv-img" src={product.img} alt={product.name} />
                  <div className="cv-body">
                    <div className="cv-name">{it.name}</div>
                    <div className="cv-meat">{it.meat}</div>

                    <div className="cv-row">
                      <div className="cv-stepper">
                        <button className="cv-step" aria-label="decrease"
                            onClick={() =>
                                it.meat && it.meat != ""
                                ? minusBtn(it.menu_sub_id,it.menu_id, it.id,it.name,"list" )
                                : minusDailyBtn(it.menu_sub_id,it.menu_id,it.name,"list")
                            }
                        >
                            -
                        </button>
                        <div className="cv-qty">{it.count}</div>
                        <button className="cv-step" aria-label="increase" 
                            onClick={() =>
                                it.meat && it.meat != ""
                                ? plusBtn(it.menu_sub_id,it.menu_id, it.id,it.name,"list" )
                                : plusDailyBtn(it.menu_sub_id, it.menu_id, it.name,"list")
                            }
                        >
                           +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="cv-side">
                    <button className="cv-trash" aria-label="remove"
                        onClick={() =>
                                it.meat && it.meat != ""
                                ? deleteBtn(it.menu_sub_id,it.menu_id, it.id,it.name,"list" )
                                : deleteDailyBtn(it.menu_sub_id,it.menu_id,it.name,"list")
                            }
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        strokeWidth="1.8"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                    <div className="cv-price">฿{it.price}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* NEW: fixed footer with total + CTA */}
            <div className="cv-footer">
              <div className="cv-totalcard">
                <div className="cv-total-left">
                  <div className="cv-tlabel">Total Bill</div>
                  {/* <div className="cv-tnote">Tax included</div> */}
                </div>
                <div className="cv-amount">฿{totalPrice}</div>
              </div>

              <button className="cv-cta-fixed" onClick={orderClick}>
                <span>Order Now</span>
              </button>
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

            <div className="pd-bottom">
              <button className="pd-primary" onClick={back}>
                Start Ordering
              </button>
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
        .pd-bottom{padding:20px;background:#fff}
        .pd-primary{
          width:100%;padding:14px 16px;border-radius:9999px;border:none;cursor:pointer;
          font-size:15px;font-weight:600;color:#111827;
          background:linear-gradient(to bottom,#fde047,#f59e0b);
          box-shadow:0 6px 18px rgba(252,211,77,.45);
        }

        /* Orders list */
        .cv-list{padding:12px;display:grid;gap:10px;overflow:auto}
        /* make space for fixed footer */
        .cv-list.cv-has-footer{padding-bottom:160px;}
        .cv-item{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;background:#fff;border-radius:14px;border:1px solid #f1eef2;box-shadow:0 1px 2px rgba(0,0,0,.03);padding:10px}
        .cv-img{width:54px;height:54px;object-fit:contain;border-radius:12px;background:#fff}
        .cv-body{display:flex;flex-direction:column;gap:8px;}
        .cv-name{font-size:15px;font-weight:600;color:#1f2937;}
        .cv-meat{font-size:13px;color:#1f2937;margin-top: -5px;}
        .cv-row{display:flex;align-items:center;gap:8px}
        .cv-stepper{display:inline-flex;align-items:center;gap:8px;border:1px solid #eee;border-radius:9999px;background:#f7f7f9;padding:6px 10px}
        .cv-step{width:26px;height:26px;border-radius:9999px;border:1px solid #e6e3e8;background:#fff;display:grid;place-items:center;line-height:1;font-size:16px;color:#111827;cursor:pointer}
        .cv-qty{min-width:20px;text-align:center;font-weight:600;color:#111827}
        .cv-side{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
        .cv-trash{width:30px;height:30px;border-radius:8px;border:none;background:#fff;color:#b91c1c;display:grid;place-items:center;cursor:pointer}
        .cv-price{font-size:14px;color:#6a1f33;font-weight:600}

        /* NEW: fixed footer */
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
        .cv-tnote{font-size:10px;color:#c3c0c6;margin-top:2px}
        .cv-amount{
          font-size:18px;letter-spacing:.2px;
          color:#7c7a80;
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

        .cv-cta-fixed{
          width:100%;display:flex;align-items:center;justify-content:center;gap:10px;
          border:none;border-radius:28px;padding:14px 16px;
          background:linear-gradient(180deg,#fb6b6a,#fb4e4b);
          color:#fff;font-weight:700;cursor:pointer;
          box-shadow:0 10px 22px rgba(251,78,75,.35);
        }
        .cv-cta-fixed:active{transform:translateY(1px)}
        .cv-cta-arrow{
          display:grid;place-items:center;width:28px;height:28px;border-radius:9999px;
          background:#fff;color:#fb4e4b;
        }
      `}</style>
    </div>
  );
}

/* Basket image inside SVG wrapper */
function BasketWithCross({ className = "" }) {
  return (
    <svg viewBox="0 0 128 128" className={className} role="img" aria-label="Order placed basket">
      <image href={basket} x="19" y="19" width="90" height="90" preserveAspectRatio="xMidYMid meet" />
    </svg>
  );
}
