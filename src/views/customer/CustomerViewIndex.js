import React from 'react'

export default function CustomerViewIndex() {
  const filters = ['All', 'Combos', 'Sliders', 'Classic', 'Family', 'Drinks']
  const items = Array.from({ length: 24 }).map((_, i) => ({
    id: i + 1,
    title: i % 2 ? 'Hamburger' : 'Cheeseburger',
    subtitle: i % 3 ? 'Chicken Burger' : "Wendy’s Burger",
    rating: (4 + (i % 10) / 10).toFixed(1),
    img:
      i % 4 === 0
        ? 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop'
        : i % 4 === 1
        ? 'https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=600&auto=format&fit=crop'
        : i % 4 === 2
        ? 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=600&auto=format&fit=crop',
    liked: i % 5 === 0,
  }))

  return (
    <div className="page">
      {/* Fixed header area */}
      <header className="top">
        <div className="bar">
          <div className="brand">Food<span>Go</span></div>
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
          {filters.map((f, i) => (
            <button key={f} className={`chip ${i === 0 ? 'active' : ''}`}>{f}</button>
          ))}
        </div>
      </header>

      {/* Only this part scrolls */}
      <main className="cards" role="region" aria-label="Menu list">
        <div className="grid">
          {items.map(it => (
            <article key={it.id} className="card">
              <div className="thumb">
                <img src={it.img} alt={it.title} />
                <button className={`heart ${it.liked ? 'liked' : ''}`} aria-label="like">
                  <HeartIcon filled={it.liked} />
                </button>
              </div>
              <div className="meta">
                <h3 className="title">{it.title}</h3>
                <p className="sub">{it.subtitle}</p>
                <div className="row"><StarIcon /><span className="rating">{it.rating}</span></div>
              </div>
            </article>
          ))}
        </div>
        <div style={{ height: 84 }} />
      </main>

      {/* Bottom nav (fixed) */}
      <nav className="bottom">
        <button className="nav-btn active" aria-label="home"><HomeIcon /></button>
        <button className="nav-btn" aria-label="orders"><BagIcon /></button>
        <button className="fab" aria-label="add"><PlusIcon /></button>
        <button className="nav-btn" aria-label="favorites"><HeartIcon /></button>
        <button className="nav-btn" aria-label="profile"><UserIcon /></button>
      </nav>

      <style jsx>{`
        :root{
          --red:#ff4b47; --red-dark:#e63c38; --text:#0f172a; --muted:#6b7280; --chip:#f3f4f6;
          --shadow:0 10px 30px rgba(0,0,0,.06);
          /* ❗ header (top) အမြင့် – လိုသလိုညှိပါ */
          --top-h: 200px;
        }
        *{box-sizing:border-box}

        .page{
            min-height:100svh;
            background:#fff;
            max-width: 1280px;   /* container အများဆုံး폭 */
            margin: 0 auto;      /* အလယ်တန်း */
        }

        /* ===== Fixed header ===== */
        .top{
          position:fixed; inset:0 0 auto 0;   /* top:0; left/right:0 */
          z-index:10;
          background:#fff;
          padding:12px 12px 10px;
          box-shadow: 0 1px 0 rgba(0,0,0,.04);
        }
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

        /* ===== Scroll area ===== */
        .grid{
          --card-min: 170px;              /* card တစ်ခုအနည်းဆုံး width (လိုသလိုပြောင်းได้) */
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(var(--card-min), 1fr));
          gap: 12px;
          padding: 0 12px 90px;
          margin-top: var(--top-h);
        }

        .card{background:#fff; border-radius:16px; overflow:hidden; box-shadow:var(--shadow)}
        .thumb{position:relative; aspect-ratio:4/3; overflow:hidden}
        .thumb img{width:100%; height:100%; object-fit:cover}
        .heart{position:absolute; right:8px; bottom:8px; height:34px; width:34px; border-radius:50%; border:0; display:grid; place-items:center; background:rgba(255,255,255,.92); backdrop-filter:blur(2px); box-shadow:0 4px 12px rgba(0,0,0,.15)}
        .heart.liked svg path{fill:var(--red); stroke:var(--red)}
        .meta{padding:10px 12px 12px}
        .title{margin:0; font-size:15px; font-weight:800; color:#0f172a}
        .sub{margin:2px 0 8px; font-size:12px; color:var(--muted)}
        .row{display:inline-flex; align-items:center; gap:6px; font-size:12px; color:var(--muted)}
        .rating{font-weight:700; color:#f59e0b}

        /* ===== Bottom nav fixed ===== */
        .bottom{position:fixed; left:12px; right:12px; bottom:12px; height:64px; background:#fff; border-radius:22px; display:grid; grid-template-columns:repeat(5,1fr); align-items:center; justify-items:center; box-shadow:0 14px 30px rgba(0,0,0,.12)}
        .nav-btn{height:36px; width:36px; border:0; background:transparent; display:grid; place-items:center; color:#9ca3af}
        .nav-btn.active{color:var(--red)}
        .nav-btn svg{width:22px; height:22px}
        .fab{position:fixed; left:50%; transform:translateX(-50%); bottom:44px; height:56px; width:56px; border-radius:50%; border:0; background:var(--red); color:#fff; display:grid; place-items:center; box-shadow:0 10px 20px rgba(255,75,71,.35)}
        .fab:active{background:var(--red-dark)}

        @media (max-width:380px){
          :root{ --top-h: 210px; } /* 작은 화면에서 header အနည်းငယ်ကြီးလာလို့ buffer တိုး */
          .grid{gap:10px}
          .title{font-size:14px}
        }
      `}</style>
    </div>
  )
}

/* icons */
function SearchIcon(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 21l-3.8-3.8M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
function SlidersIcon(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="4" cy="13" r="2.5" fill="#fff"/><circle cx="12" cy="10" r="2.5" fill="#fff"/><circle cx="20" cy="16" r="2.5" fill="#fff"/></svg>)}
function StarIcon(){return(<svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 17.3l6.18 3.7-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
function HeartIcon({filled}){return(<svg width="20" height="20" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" fill={filled?'#ff4b47':'none'} stroke={filled?'#ff4b47':'#111827'} strokeWidth="1.6"/></svg>)}
function HomeIcon(){return(<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 3l9 7h-3v11h-5V14H11v7H6V10H3l9-7z"/></svg>)}
function BagIcon(){return(<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 7h12l1 14H5L6 7zm3 0a3 3 0 1 1 6 0h-2a1 1 0 0 0-2 0H9z"/></svg>)}
function PlusIcon(){return(<svg viewBox="0 0 24 24" width="26" height="26" fill="#fff"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>)}
function UserIcon(){return(<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14z"/></svg>)}
