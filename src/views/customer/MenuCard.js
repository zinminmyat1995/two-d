import React from 'react'

export default function MenuCard({ menuData,main,selectedMenu,cardClick,menuClick  }) {


  return (
        <>
            {/* Fixed header area */}
            <header className="top">
                <div className="bar">
                <div className="brand">The<span>Six</span></div>
                <div className="avatar"><img src="https://i.pravatar.cc/100?img=5" alt="me" /></div>
                </div>
                <p className="subtitle">Order your favourite food!</p>

                <div className="search">
                <div className="search-input">
                    <SearchIcon />
                    <input placeholder="Search" />
                </div>
                <button className="filter-btn" aria-label="filters"><SlidersIcon /></button>
                </div>

                <div className="chips">
                {main.map((f, i) => (
                    <button key={i}
                    className={`chip ${selectedMenu === f.name ? 'active' : ''}`}
                    onClick={() => menuClick(f.name)}
                    >
                    {f.name}
                    </button>
                ))}
                </div>
            </header>

                {/* Only this part scrolls */}
                <main className="cards" role="region" aria-label="Menu list">
                    <div className="grid">
                        {menuData.map((it, i) => (
                        <article key={i} className="card burger-card">
                            {/* top image (small, centered, soft bg) */}
                            <div className="thumb" onClick={()=>cardClick(it.name, it.meats)}>
                                <img 
                                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop"
                                    alt={it.name}
                                />
                            
                            </div>

                            {/* text + bottom row */}
                            <div className="meta meta--tight">
                                <h3 className="title clamp-1">{it.name}</h3>
                                {/* <p className="sub clamp-1">{it.brand || "Wendy's Burger"}</p> */}

                                <div className="bottom-row">
                                    <span className="rating-wrap">
                                    <StarIcon />
                                    <span className="rating">{it.rate}</span>
                                    </span>

                                    <button className={`heart liked`} aria-label="like">
                                        <HeartIcon filled={false} />
                                    </button>
                                </div>
                            </div>
                        </article>
                        ))}
                    </div>
                    <div style={{ height: 84 }} />
                </main>


            {/* Bottom nav (fixed) */}
            {/* <nav className="bottom">
                <button className="nav-btn active" aria-label="home"><HomeIcon /></button>
                <button className="nav-btn" aria-label="orders"><BagIcon /></button>
                <button className="fab" aria-label="add"><PlusIcon /></button>
                <button className="nav-btn" aria-label="favorites"><HeartIcon /></button>
                <button className="nav-btn" aria-label="profile"><UserIcon /></button>
            </nav> */}
            <style>{`
                :root{
                --red:#ff4b47; --red-dark:#e63c38; --text:#0f172a; --muted:#6b7280; --chip:#f3f4f6;
                --shadow:0 10px 30px rgba(0,0,0,.06);
                --top-h: 200px;

                /* ⭐ grid/card sizing */
                --card-min: 180px;     /* min width of a card */
                --meta-min-h: 80px;   /* meta 固定အနည်းဆုံး高度 (title+sub+rating) */
                --lines: 1;            /* title/sub clamp lines */
                }
                *{box-sizing:border-box}

                .page{
                min-height:100svh;
                background:#fff;
                max-width:1280px;
                margin:0 auto;
                }

                .heart {
                position: absolute; right: 8px; bottom: 8px;
                height: 34px; width: 34px; border-radius: 50%;
                border: 0; display: grid; place-items: center;
                background: rgba(255,255,255,.92);
                backdrop-filter: blur(2px);
                box-shadow: 0 4px 12px rgba(0,0,0,.15);
                }
                .heart svg { width: 18px; height: 18px; }
                .heart.liked svg path { fill: var(--red); stroke: var(--red); }

                
                /* ===== Fixed header ===== */
                .top{position:fixed; inset:0 0 auto 0; z-index:10; background:#fff; padding:12px 12px 10px; box-shadow:0 1px 0 rgba(0,0,0,.04)}
                .bar{display:flex; justify-content:space-between; align-items:center}
                .brand{font-weight:800; font-size:26px; color:var(--text)}
                .brand span{color:var(--red)}
                .avatar{width:36px; height:36px; border-radius:50%; overflow:hidden; border:2px solid rgba(0,0,0,.05)}
                .avatar img{width:100%; height:100%; object-fit:cover}
                .subtitle{margin:6px 0 10px; color:var(--muted); font-size:14px}

                .search{display:grid; grid-template-columns:1fr 44px; gap:10px; align-items:center}
                .search-input{display:flex; align-items:center; gap:10px; background:#f7f8fa; border:1px solid #eef0f3; border-radius:14px; padding:10px 12px}
                .search-input input{border:0; outline:0; flex:1; background:transparent; font-size:14px}
                .filter-btn{height:44px; width:44px; border-radius:12px; border:0; background:#0f172a; color:#fff; display:grid; place-items:center}

                .chips{display:flex; gap:10px; overflow-x:auto; padding:12px 2px 2px; scrollbar-width:none}
                .chips::-webkit-scrollbar{display:none}
                .chip{border:0; background:var(--chip); color:#0f172a; padding:8px 14px; border-radius:999px; font-weight:600; font-size:13px; white-space:nowrap}
                .chip.active{background:var(--red); color:#fff}

                /* ===== Scroll area + equal-card grid ===== */
                .cards{padding:0 12px 0; margin-top:var(--top-h); min-height:calc(100svh - var(--top-h)); overflow-y:auto; -webkit-overflow-scrolling:touch; overscroll-behavior:contain}
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
                .thumb{position:relative; aspect-ratio:4/2; width:100%; overflow:hidden}
                .thumb img{width:100%; height:100%; object-fit:cover}

                .meta{
                display:grid;
                grid-template-rows: auto auto auto;
                padding:12px;
                row-gap:6px;
                //   min-height: var(--meta-min-h); 
                }

                .title, .sub{
                margin:0;
                font-size:15px;
                color:var(--text);
                overflow:hidden;
                display:-webkit-box;
                -webkit-box-orient:vertical;
                -webkit-line-clamp: var(--lines);  /* 1-line clamp */
                line-height:1.2;
                }
                .title{font-weight:800;padding-top: 3px; padding-bottom: 3px;}
                .sub{font-size:12px; color:var(--muted)}

                .row{display:inline-flex; align-items:center; gap:6px; font-size:12px; color:var(--muted)}
                .rating{font-weight:700; color:#f59e0b}

                /* Bottom nav fixed */
                .bottom{position:fixed; left:12px; right:12px; bottom:12px; height:64px; background:#fff; border-radius:22px; display:grid; grid-template-columns:repeat(5,1fr); align-items:center; justify-items:center; box-shadow:0 14px 30px rgba(0,0,0,.12)}
                .nav-btn{height:36px; width:36px; border:0; background:transparent; display:grid; place-items:center; color:#9ca3af}
                .nav-btn.active{color:var(--red)}
                .nav-btn svg{width:22px; height:22px}
                .fab{position:fixed; left:50%; transform:translateX(-50%); bottom:44px; height:56px; width:56px; border-radius:50%; border:0; background:var(--red); color:#fff; display:grid; place-items:center; box-shadow:0 10px 20px rgba(255,75,71,.35)}
                .fab:active{background:var(--red-dark)}

                /* Responsive tuning */
                @media (max-width:480px){
                :root{ --card-min: 170px; --top-h: 210px; }
                }
                @media (min-width:1280px){
                :root{ --card-min: 240px; } /* big screen → more columns with same height */
                }
            `}</style>
        </>
  )
}

/* icons */

function SlidersIcon(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="4" cy="13" r="2.5" fill="#fff"/><circle cx="12" cy="10" r="2.5" fill="#fff"/><circle cx="20" cy="16" r="2.5" fill="#fff"/></svg>)}
function StarIcon(){return(<svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 17.3l6.18 3.7-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
function HeartIcon({filled}){return(<svg width="20" height="20" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" fill={filled?'#ff4b47':'none'} stroke={filled?'#ff4b47':'#111827'} strokeWidth="1.6"/></svg>)}
function HomeIcon(){return(<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 3l9 7h-3v11h-5V14H11v7H6V10H3l9-7z"/></svg>)}
function BagIcon(){return(<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 7h12l1 14H5L6 7zm3 0a3 3 0 1 1 6 0h-2a1 1 0 0 0-2 0H9z"/></svg>)}
function PlusIcon(){return(<svg viewBox="0 0 24 24" width="26" height="26" fill="#fff"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>)}
function UserIcon(){return(<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14z"/></svg>)}
function HeartOutline(){
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function SearchIcon(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 21l-3.8-3.8M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}