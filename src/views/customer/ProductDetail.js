import React from 'react'

export default function ProductDetail({ menuData,selectedMenu,selectItemData,back,plusBtn,minusBtn,plusDailyBtn,minusDailyBtn,totalPrice,reviewOrder }) {


  console.log("selectItemData",selectItemData)
  console.log("menuData",menuData)

  // --- demo product data ---
  const product = {
    name: 'Hamburger Veggie Burger',
    basePrice: 9.99,          // base price per portion
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    etaMins: 14,
    desc:
      'Enjoy our delicious Hamburger Veggie Burger, made with a savory blend of fresh vegetables and herbs, topped with crisp lettuce, juicy tomatoes and pickles, all served on a soft, toasty bun.',
  }



  return (
    <div className="page">
      {/* Header bar */}
      <div className="topbar">
        <button
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
      
      </div>

      {/* Product image */}
      <div className="hero">
        <img src={product.img} alt={product.name} />
      </div>

      {/* Content */}
      <div className="content">
        <h1 className="title">{selectItemData[0]['name']}</h1>

        <div className="meta-row">
          <span className="rating">
            <StarIcon /> {selectItemData[0]['rate']}
          </span>
          <span className="dot">•</span>
          <span className="eta">{selectItemData[0]['time']} mins</span>
        </div>

        {/* <p className="desc">{product.desc}</p> */}

        {/* Options card */}
        <section className="mt-3">
          <div className="row-head">
            <div className="col">
              <div className="label">Menu Options</div>
              <div className="hint">You can choose the options you like.</div>
            </div>
          </div>

          {/* dynamic rows */}
          <div className="meat-list">
            {selectItemData[0]['meats'].length > 0 ?
                selectItemData[0]['meats'].map((m) => (
                  <div className="meat-row" key={m.id}>
                    <div className="meat-item">
                     <div className="meat-name">
                      {m.name} <span className="meat-price">( ฿{m.price} )</span>
                    </div>
                    </div>
                    <div className="qty">
                      <button
                        className="btn minus"
                        onClick={() => minusBtn(m.menu_sub_id, selectItemData[0]['menu_id'],m.id,selectItemData[0]['name'] )}
                        aria-label={`decrease ${m.name}`}
                        style={{
                          '--cui-btn-padding-x': '0',
                          '--cui-btn-padding-y': '0',
                          padding: 0,                // fallback (သေချာအောင်)
                          minWidth: '32px',
                          height: '32px',
                        }}
                      >
                        −
                      </button>
                      <span className="num">{m.count}</span>
                      <button
                        className="btn plus"
                        onClick={() => plusBtn(m.menu_sub_id,selectItemData[0]['menu_id'], m.id,selectItemData[0]['name'] )}
                        aria-label={`increase ${m.name}`}
                        style={{
                          '--cui-btn-padding-x': '0',
                          '--cui-btn-padding-y': '0',
                          padding: 0,                // fallback (သေချာအောင်)
                          minWidth: '32px',
                          height: '32px',
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              :
                <div className="meat-row">
                    <div className="meat-name">
                      {selectItemData[0]['name']} <span className="meat-price">( ฿{selectItemData[0]['price']} )</span>
                    </div>
                  <div className="qty">
                    <button
                      className="btn minus"
                      onClick={() => minusDailyBtn(selectItemData[0]['menu_sub_id'], selectItemData[0]['menu_id'], selectItemData[0]['name'])}
                      aria-label={`decrease ${selectItemData[0]['name']}`}
                      style={{
                        '--cui-btn-padding-x': '0',
                        '--cui-btn-padding-y': '0',
                        padding: 0,                // fallback (သေချာအောင်)
                        minWidth: '32px',
                        height: '32px',
                      }}
                    >
                      −
                    </button>
                    <span className="num">{selectItemData[0]['count']}</span>
                    <button
                      className="btn plus"
                      onClick={() => plusDailyBtn(selectItemData[0]['menu_sub_id'], selectItemData[0]['menu_id'], selectItemData[0]['name'])}
                      aria-label={`increase ${selectItemData[0]['name']}`}
                      style={{
                        '--cui-btn-padding-x': '0',
                        '--cui-btn-padding-y': '0',
                        padding: 0,                // fallback (သေချာအောင်)
                        minWidth: '32px',
                        height: '32px',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              
            }
          </div>

        </section>

        <div style={{ height: 120 }} /> {/* spacer for fixed bar */}
      </div>

      {/* Bottom fixed bar */}
      <div className="bottom">
        <div className="price">
          <span className="amount">฿{totalPrice}</span>
        </div>
        <button className="cta" onClick={reviewOrder}>Review Order</button>
      </div>

      {/* Styles */}
      <style>{`
        :root{
          --bg: #ffffff;
          --text: #0f172a;
          --muted: #6b7280;
          --primary: #ff4b47;
          --dark: #2b2b2b;
          --shadow: 0 10px 30px rgba(0,0,0,.08);
          --radius: 18px;
        }
        *{box-sizing:border-box}
        .page{
          min-height:100svh;
          background: var(--bg);
          max-width: 430px;      /* phone canvas width */
          margin: 0 auto;
          position: relative;
        }

        .topbar{
          position: sticky; top: 0; z-index: 5;
          display:flex; justify-content:space-between; align-items:center;
          padding:14px 14px 0;
          background: linear-gradient(#fff 70%, rgba(255,255,255,0));
        }
        .icon-btn{
          height:36px; width:36px; border:0; border-radius:12px;
          background:#fff; 
          display:grid; place-items:center; font-size:18px; color:#111827;
        }

        .hero{
          display:grid; place-items:center; padding: 8px 18px 6px;
        }
        .hero img{
          width: 85%; max-width: 320px; height:auto; object-fit:contain;
          // filter: drop-shadow(0 16px 24px rgba(0,0,0,.15));
        }

        .content{ padding: 0 18px; }
        .title{ margin: 8px 0 6px; font-size: 20px; line-height: 1.25; color: var(--text); }
        .meta-row{ display:flex; align-items:center; gap:8px; color: var(--muted); font-size: 13px; }
        .rating{ display:inline-flex; align-items:center; gap:5px; color:#f59e0b; font-weight:700; }
        .dot{ color:#c1c5cc; }
        .eta{ color: var(--muted); }

        .desc{
          margin: 12px 0 16px; color: var(--muted);
          font-size: 14px; line-height: 1.6;
        }

        .card{
          background:#fff; border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 14px;
        }
        .row-head .label{ font-size:13px; color:#111827; font-weight:700; }
        .row-head .hint{ font-size:12px; color: var(--muted); margin-top:4px; }

        .meat-list{ margin-top: 10px; display:flex; flex-direction:column; gap:12px; }
        .meat-row{
          display:flex; align-items:center; justify-content:space-between;
          padding:10px 12px;
        }
        .meat-name {
          font-weight: 500;
          color: #444;
        }

        .meat-name .meat-price {
          color: #ff0000;
          font-size: 0.9em;
          margin-left: 6px;
        }



        .portion{
          margin-top:14px; display:flex; align-items:center; justify-content:space-between;
          padding:10px 12px; border:1px solid #eef0f3; border-radius:12px; background:#fff;
        }
        .portion-label{ font-weight:700; color:#111827; }

        .qty{ display:inline-flex; align-items:center; gap:10px; }
        .btn{
          height:32px; width:32px; border-radius:10px; border:0;
          display:grid; place-items:center; font-weight:800; font-size:18px;
          box-shadow: var(--shadow); color:#fff;
        }
        .btn.minus{ background:#ef4444; }
        .btn.plus{ background:#10b981; }
        .num{ min-width: 18px; text-align:center; font-weight:700; color:#111827; }

        .bottom{
          position: fixed !important; left: 50% !important; transform: translateX(-50%) !important;
          bottom: 12px !important; width: min(430px, 100%) !important;
          display:flex !important; align-items:center !important; justify-content:space-between !important;
          gap:14px !important; padding: 12px !important;
          backdrop-filter: blur(8px) !important;box-shadow: none !important;
          background: transparent !important;
        }
        .price{
          display:inline-flex; align-items:center; gap:4px;
          background:#ef4444; color:white; border-radius:16px;
          padding: 12px 16px; box-shadow: var(--shadow);
        }
        .price .currency{ opacity:.9; }
        .price .amount{ font-size:18px; letter-spacing:.2px; }

        .cta{
          flex:1;
          height:48px; border-radius:14px; border:0;
          background:#2b2b2b; color:#fff; font-weight:800; letter-spacing:.3px;
          box-shadow: var(--shadow);
        }

        @media (min-width: 480px){
          .hero img{ width: 70%; }
        }
        .back-btn {
          position: relative;
          height: 44px;
          width: 44px;
          border-radius: 14px;
          border: none;
          // background: linear-gradient(145deg, #ffffff, #f0f0f3);
          // box-shadow:
          //   5px 5px 15px rgba(0, 0, 0, 0.1),
          //   -5px -5px 15px rgba(255, 255, 255, 0.9);
          color: #111827;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .back-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            6px 6px 15px rgba(0, 0, 0, 0.15),
            -6px -6px 15px rgba(255, 255, 255, 1);
        }

        .back-btn:active {
          transform: scale(0.96);
          background: linear-gradient(145deg, #f0f0f3, #ffffff);
          box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.08),
                      inset -4px -4px 8px rgba(255, 255, 255, 0.8);
        }

        .back-btn svg {
          stroke: #ff4b47; /* red accent */
          width: 22px;
          height: 22px;
        }
      `}</style>
    </div>
  )
}

/* ---------- small inline icons ---------- */
function StarIcon(){
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" aria-hidden="true">
      <path d="M12 17.3l6.18 3.7-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  )
}
