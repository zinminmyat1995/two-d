import React, { useState } from 'react'
import { cilBasket } from '@coreui/icons'
import { ShoppingCart, Star } from "lucide-react";
import CIcon from '@coreui/icons-react'
import EmptySearch from "./EmptySearch"

export default function MenuCard({
  menuData,
  main,
  selectedMenu,
  cardClick,
  menuClick,
  basketclick,
  search,
  searchChange,
  searchData,
  debouncedSearch,
  closeRating,
  showRating,
  setShowRating,
  activeItem,
  setActiveItem,
  selectedStars,
  openRating,
  handleStarClick,
  showRatingSuccess
}) {


  return (
    <>
    {showRatingSuccess  && (
        <div className="success-toast">
          <SuccessCheckIcon />
          <span>Thanks! Rating submitted.</span>
        </div>
    )}
      {/* Fixed header area */}
      <header className="top">
        <div className="bar">
          <div className="brand">The<span>Six</span></div>
          <div className="avatar">
            <ShoppingCart size={30} color="#ff4b47" strokeWidth={2} onClick={basketclick} />
          </div>
        </div>
        <p className="subtitle">Order your favourite food!</p>

        <div className="search">
          <div className="search-input">
            <SearchIcon />
            <input placeholder="Search" value={search} onChange={searchChange} />
          </div>
          <button className="filter-btn" aria-label="filters"><SlidersIcon /></button>
        </div>

        {searchData.length < 1 && debouncedSearch === "" &&
          <div className="chips">
            {main.map((f, i) => (
              <button
                key={i}
                className={`chip ${selectedMenu === f.name ? 'active' : ''}`}
                onClick={() => menuClick(f.name)}
              >
                {f.name}
              </button>
            ))}
          </div>
        }

      </header>

      {(searchData.length < 1 && debouncedSearch !== "")
        ? (
          <EmptySearch />
        )
        : (
          <main
            className="cards"
            role="region"
            aria-label="Menu list"
            style={{ marginTop: `${searchData.length > 0 ? '148px' : '200px'}` }}
          >
            <div className="grid">
              {menuData.map((it, i) => (
                <article key={i} className="card burger-card">
                  {/* top image (small, centered, soft bg) */}
                  <div className="thumb" onClick={() => cardClick(it.name, it.meats)}>
                    <img
                      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop"
                      alt={it.name}
                    />

                    {/* Rating trigger button (old heart position) */}
                   <button
                        className="rate-btn"
                        aria-label="Rate this order"
                        onClick={(e) => {
                            e.stopPropagation()
                            openRating(it)
                        }}
                        >
                        <Star />
                    </button>
                  </div>

                  {/* text + bottom row */}
                  <div className="meta meta--tight">
                    <h3 className="title clamp-1">{it.name}</h3>

                    <div className="bottom-row">
                      <span className="rating-wrap">
                        <StarIcon />
                        <span className="rating">{it.rate}</span>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div style={{ height: 84 }} />
          </main>
        )
      }

      {/* ⭐ Slide-up rating card */}
      {showRating && (
        <div className="rating-overlay" role="dialog" aria-modal="true">
          <div className="rating-backdrop" onClick={closeRating} />
          <div className="rating-sheet">
            <div className="rating-handle" />
            <div className="rating-header">
              <div className="rating-brand">
     
                <div className="rating-text">
                  {/* <div className="brand">The<span>Six</span></div> */}
                   <div className="rating-title-box">
                        <h3 className="rating-menu-name">{activeItem.name}</h3>
                    </div>
                </div>
              </div>
            </div>

            <h3 className="rating-question">How was this menu?</h3>

            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`rating-star-btn ${value <= selectedStars ? 'is-active' : ''}`}
                  onClick={() => handleStarClick(value)}
                  aria-label={`${value} star`}
                >
                  <StarRatingIcon />
                </button>
              ))}
            </div>

            <button
              className="rating-submit"
              type="button"
              disabled={selectedStars === 0}
              onClick={()=>closeRating("btn")}
            >
              Submit rating
            </button>
          </div>
        </div>
      )}

      <style>{`
        :root{
          --red:#ff4b47; --red-dark:#e63c38; --text:#0f172a; --muted:#6b7280; --chip:#f3f4f6;
          --shadow:0 10px 30px rgba(0,0,0,.06);
          --top-h: 200px;

          /* ⭐ grid/card sizing */
          --card-min: 180px;     /* min width of a card */
          --meta-min-h: 80px;   /* meta minimum height (title+sub+rating) */
          --lines: 1;           /* title/sub clamp lines */
        }
        *{box-sizing:border-box}

        .page{
          min-height:100svh;
          background:#fff;
          max-width:1280px;
          margin:0 auto;
        }

        /* Rating trigger button (old heart style) */
       .rate-btn {
        position: absolute;
        right: 8px;
        bottom: 8px;
        height: 34px;
        width: 34px;
        border-radius: 50%;
        border: 0;
        display: grid;
        place-items: center;
        background: rgba(255, 255, 255, .92);
        backdrop-filter: blur(2px);
        box-shadow: 0 4px 12px rgba(0,0,0,.15);
        cursor: pointer;
        transition: transform .12s ease, box-shadow .12s ease;
        }

        .rate-btn svg {
        width: 20px;
        height: 20px;
        }

        .rate-btn:hover {
        transform: translateY(-1px) scale(1.04);
        box-shadow: 0 6px 16px rgba(0,0,0,.18);
        }

        .rate-btn:active {
        transform: translateY(0) scale(0.96);
        box-shadow: 0 3px 10px rgba(0,0,0,.16);
        }
        /* ===== Fixed header ===== */
        .top{position:fixed; inset:0 0 auto 0; z-index:10; background:#fff; padding:12px 12px 10px; box-shadow:0 1px 0 rgba(0,0,0,.04)}
        .bar{display:flex; justify-content:space-between; align-items:center}
        .brand{font-weight:800; font-size:26px; color:var(--text)}
        .brand span{color:var(--red)}
        .avatar{width:36px; height:36px; margin-right: 5px;}
        .avatar img{width:100%; height:100%; object-fit:cover}
        .subtitle{margin:6px 0 10px; color:var(--muted); font-size:14px}

        .search{display:grid; grid-template-columns:1fr 44px; gap:10px; align-items:center}
        .search-input{display:flex; align-items:center; gap:10px; background:#f7f8fa; border:1px solid #eef0f3; border-radius:14px; padding:10px 12px}
        .search-input input{border:0; outline:0; flex:1; background:transparent; font-size:14px}
        .filter-btn{height:44px; width:44px; border-radius:12px; border:0; background:#ff4b47; color:#fff; display:grid; place-items:center; cursor:pointer;}

        .chips{display:flex; gap:10px; overflow-x:auto; padding:12px 2px 2px; scrollbar-width:none}
        .chips::-webkit-scrollbar{display:none}
        .chip{border:0; background: white; color:#0f172a; padding:8px 14px; border-radius:999px; font-weight:600; font-size:13px; white-space:nowrap;border: 1px solid rgb(255 75 71); cursor:pointer;}
        .chip.active{background:var(--red); color:#fff}

        /* ===== Scroll area + equal-card grid ===== */
        .cards{padding:0 12px 0; min-height:calc(100svh - var(--top-h)); overflow-y:auto; -webkit-overflow-scrolling:touch; overscroll-behavior:contain}
        .grid{
          display:grid;
          grid-template-columns: repeat(auto-fill, minmax(var(--card-min), 1fr));
          gap: 16px;
          padding: 0 0 100px;
        }

        /* card = equal height */
        .card{
          display:flex;           /* image + meta vertical */
          flex-direction:column;
          background:#fff;
          border-radius:16px;
          overflow:hidden;
          box-shadow:var(--shadow);
          height:100%;
        }
        .thumb{position:relative; aspect-ratio:4/2; width:100%; overflow:hidden; cursor:pointer;}
        .thumb img{width:100%; height:100%; object-fit:cover}

        .meta{
          display:grid;
          grid-template-rows: auto auto auto;
          padding:12px;
        //   row-gap:6px;
          /* min-height: var(--meta-min-h); */
        }

        .title, .sub{
          margin:0;
          font-size:15px;
          color:var(--text);
          overflow:hidden;
          display:-webkit-box;
          -webkit-box-orient:vertical;
          -webkit-line-clamp: var(--lines);
          line-height:1.2;
        }
        .title{font-weight:800;padding-top: 3px; padding-bottom: 3px;}
        .sub{font-size:12px; color:var(--muted)}

        .bottom-row{display:flex; align-items:center; justify-content:space-between; margin-top:4px;}
        .rating-wrap{display:inline-flex; align-items:center; gap:4px; font-size:13px;}
        .rating{font-weight:700; color:#f59e0b}

        /* ===== Rating bottom sheet ===== */
        .rating-overlay{
          position:fixed;
          inset:0;
          z-index:40;
          display:flex;
          align-items:flex-end;
          justify-content:center;
          pointer-events:none;
        }
        .rating-backdrop{
          position:absolute;
          inset:0;
          background:rgba(15,23,42,.45);
          backdrop-filter:blur(2px);
          pointer-events:auto;
        }
        .rating-sheet{
          position:relative;
          width:100%;
          max-width:420px;
          margin:0 auto;
          background:#fff;
          border-radius:24px 24px 0 0;
          padding:16px 20px 24px;
          box-shadow:0 -20px 40px rgba(0,0,0,.25);
          pointer-events:auto;
          animation:slideUp .28s ease-out;
        }
        @keyframes slideUp{
          from{transform:translateY(30px); opacity:0;}
          to{transform:translateY(0); opacity:1;}
        }
        .rating-handle{
          width:44px;
          height:4px;
          border-radius:999px;
          background:#e5e7eb;
          margin:0 auto 12px;
        }
        .rating-header{
          display:flex;
          justify-content:center;
          margin-bottom:8px;
        }
        .rating-brand{
          display:flex;
          align-items:center;
          gap:10px;
        }
        .rating-logo{
          width:32px;
          height:32px;
          border-radius:50%;
          background:#f3f4f6;
          display:grid;
          place-items:center;
        }
        .rating-logo-dot{
          width:14px;
          height:14px;
          border-radius:50%;
          background:var(--red);
        }
        .rating-text{
          display:flex;
          flex-direction:column;
        }
        .rating-title{
          font-size:14px;
          font-weight:700;
          color:#0f172a;
        }
        .rating-sub{
          font-size:12px;
          color:#6b7280;
        }
        .rating-question{
          text-align:center;
          margin:10px 0 18px;
          font-size:18px;
          font-weight:700;
          color:#0f172a;
        }
        .rating-stars{
          display:flex;
          justify-content:center;
          gap:10px;
          margin-bottom:18px;
        }
        .rating-star-btn{
          border:0;
          background:transparent;
          padding:0;
          cursor:pointer;
        }
        .rating-star-btn svg{
          width:30px;
          height:30px;
          fill:#e5e7eb;
        }
        .rating-star-btn.is-active svg{
          fill:#22c55e; /* green like the screenshot */
        }
        .rating-submit{
          display:block;
          margin:0 auto;
          padding:10px 22px;
          border-radius:999px;
          border:0;
          background:#111827;
          color:#fff;
          font-size:14px;
          font-weight:600;
          cursor:pointer;
        }
        .rating-submit:disabled{
          opacity:.5;
          cursor:not-allowed;
        }

        /* Responsive tuning */
        @media (max-width:480px){
          :root{ --card-min: 170px; --top-h: 210px; }
        }
        @media (min-width:1280px){
          :root{ --card-min: 240px; } /* big screen → more columns with same height */
        }
        .success-toast {
        position: fixed;
        bottom: 90px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(17, 17, 17, 0.9);
        color: #fff;
        padding: 12px 20px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        animation: toastUp .35s ease-out;
        z-index: 1000;
        }

        @keyframes toastUp {
        from {
            opacity: 0;
            transform: translate(-50%, 20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        }

        .success-toast svg {
        width: 18px;
        height: 18px;
        color: #22c55e;
        }
        .rating-title-box {
        text-align: center;
        }

        .rating-menu-name {
        margin: 0;
        font-size: 18px;
        font-weight: 800;
        color: #11182785;
        letter-spacing: -0.2px;
        }

      `}</style>
    </>
  )
}

/* icons */

function SlidersIcon(){return(
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3"
      stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="4" cy="13" r="2.5" fill="#fff"/>
    <circle cx="12" cy="10" r="2.5" fill="#fff"/>
    <circle cx="20" cy="16" r="2.5" fill="#fff"/>
  </svg>
)}

function StarIcon(){return(
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
    <path d="M12 17.3l6.18 3.7-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
)}

/* round button icon (on card image) */
function StarCircleIcon(){return(
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill="#fff" />
    <path
      d="M12 5.5l1.62 3.28 3.63.53-2.62 2.55.62 3.62L12 13.9l-3.25 1.7.62-3.62L6.75 9.3l3.63-.53L12 5.5z"
      fill="#f59e0b"
    />
  </svg>
)}

/* star used inside rating sheet */
function StarRatingIcon(){return(
  <svg viewBox="0 0 24 24">
    <path d="M12 17.3l6.18 3.7-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
)}

function HomeIcon(){return(
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M12 3l9 7h-3v11h-5V14H11v7H6V10H3l9-7z"/>
  </svg>
)}
function BagIcon(){return(
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M6 7h12l1 14H5L6 7zm3 0a3 3 0 1 1 6 0h-2a1 1 0 0 0-2 0H9z"/>
  </svg>
)}
function PlusIcon(){return(
  <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff">
    <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/>
  </svg>
)}
function UserIcon(){return(
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14z"/>
  </svg>
)}

function SearchIcon(){return(
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M21 21l-3.8-3.8M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
      stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)}

function RateStarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        {/* subtle gradient fill */}
        <linearGradient id="rateStarFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <path
        d="M12 3.2l2.16 4.38 4.84.7-3.5 3.41.83 4.8L12 14.9l-4.33 2.59.83-4.8-3.5-3.41 4.84-.7L12 3.2z"
        fill="url(#rateStarFill)"
        stroke="#f59e0b"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function SuccessCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}