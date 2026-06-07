/* ===========================================================
   Pick a Shift — Shared components & data
   Exposes everything on window for cross-file use.
   =========================================================== */

/* ---------- Icon set (simple functional line icons) ---------- */
const PATHS = {
  calendar:'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  clock:'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  pin:'M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z|M12 10m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',
  bell:'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  euro:'M18 7a6 6 0 1 0 0 10M4 10h9M4 14h7',
  user:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  home:'M3 11l9-8 9 8M5 9.5V21h14V9.5',
  search:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  briefcase:'M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M3 7h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7zM3 12h18',
  star:'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9L12 3z',
  bolt:'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
  check:'M20 6 9 17l-5-5',
  x:'M18 6 6 18M6 6l12 12',
  plus:'M12 5v14M5 12h14',
  chevright:'M9 6l6 6-6 6',
  chevleft:'M15 6l-6 6 6 6',
  arrowup:'M12 19V5M5 12l7-7 7 7',
  arrowdown:'M12 5v14M19 12l-7 7-7-7',
  menu:'M4 7h16M4 12h16M4 17h16',
  layers:'M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  users:'M17 21v-2a4 4 0 0 0-3-3.87M9 21v-2a4 4 0 0 1 3-3.87M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM21 21v-2a4 4 0 0 0-3-3.87',
  chart:'M3 3v18h18M7 15l3-4 3 2 4-6',
  file:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6',
  clipboard:'M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1zM8 6H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2',
  trend:'M22 7l-8.5 8.5-5-5L2 17M16 7h6v6',
  gauge:'M12 14l4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  flame:'M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-2.5C8 10 7 12 7 14a5 5 0 0 0 10 0c0-5-5-12-5-12z',
  insta:'M16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM17 6.5h.01',
  x_social:'M4 4l16 16M20 4 4 20',
  linkedin:'M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-12h4v2a4 4 0 0 1 2-2zM6 9H2v11h4zM4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
};
function Icon({name,size=18,stroke=2,fill=false,style}){
  const segs=(PATHS[name]||'').split('|');
  return (
    <span className="ico" style={style}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill={fill?'currentColor':'none'}
        stroke={fill?'none':'currentColor'} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        {segs.map((d,i)=><path key={i} d={d}/>)}
      </svg>
    </span>
  );
}

/* ---------- Logo ---------- */
function Logo({className='logo',to='Pick a Shift - Landing.html'}){
  return <a href={to} aria-label="Pick a Shift home"><img src="assets/logo.webp" alt="Pick a Shift" className={className}/></a>;
}

/* ---------- Brand colors for business avatars ---------- */
const BIZ_COLORS=['#E8401C','#2B7A55','#3454D1','#9333A8','#0E7C86','#C9890E','#1A1A1A','#B23A48'];
function bizColor(name){let h=0;for(const c of name)h=(h*31+c.charCodeAt(0))>>>0;return BIZ_COLORS[h%BIZ_COLORS.length];}
function initials(name){return name.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();}

/* ---------- Sample shift data (Madrid) ---------- */
const SHIFTS=[
  {id:1,biz:'Brew & Bean',role:'Barista',date:'Today',time:'17:00 – 21:00',dist:'Malasaña',pay:'12',urgent:true},
  {id:2,biz:'La Tasca Madrid',role:'Waiter / Server',date:'Tomorrow',time:'19:30 – 23:30',dist:'La Latina',pay:'11.5',urgent:false},
  {id:3,biz:'Mercado San Miguel',role:'Food Stall Helper',date:'Sat 7 Jun',time:'12:00 – 16:00',dist:'Centro',pay:'13',urgent:true},
  {id:4,biz:'FNAC Callao',role:'Sales Assistant',date:'Fri 6 Jun',time:'16:00 – 20:00',dist:'Gran Vía',pay:'10.5',urgent:false},
  {id:5,biz:'Teatro Real',role:'Event Usher',date:'Sun 8 Jun',time:'18:00 – 22:00',dist:'Ópera',pay:'14',urgent:false},
  {id:6,biz:'Día Supermercado',role:'Cashier',date:'Today',time:'15:00 – 19:00',dist:'Chamberí',pay:'10',urgent:true},
];

/* ---------- Shift card (shared everywhere) ---------- */
function ShiftCard({s,onApply,applied,compact}){
  const c=bizColor(s.biz);
  return (
    <article className="shift-card">
      {s.urgent && <span className="corner-badge badge badge-urgent"><Icon name="flame" size={12} fill/> Urgent</span>}
      <div className="shift-top">
        <div className="biz-logo" style={{background:c}}>{initials(s.biz)}</div>
        <div style={{minWidth:0,paddingRight:s.urgent?70:0}}>
          <div className="biz-name">{s.biz}</div>
          <div className="biz-role">{s.role}</div>
        </div>
      </div>
      <div className="shift-meta">
        <div className="row"><Icon name="calendar" size={16}/> {s.date} · {s.time}</div>
        <div className="row"><Icon name="pin" size={16}/> {s.dist}, Madrid</div>
      </div>
      <div className="shift-foot">
        <div className="pay">
          <span className="amt">€{s.pay}<span className="per">/hr</span></span>
          <span className="pay-lbl">≈ €{(parseFloat(s.pay)*4).toFixed(0)} for shift</span>
        </div>
        <button className={'btn btn-sm '+(applied?'btn-light':'btn-primary')}
          onClick={()=>onApply&&onApply(s)} disabled={applied}>
          {applied?<><Icon name="check" size={15}/> Applied</>:'Apply'}
        </button>
      </div>
    </article>
  );
}

/* ---------- Public site header ---------- */
function SiteHeader({active}){
  const [open,setOpen]=React.useState(false);
  const links=[['How it Works','#how'],['For Students','Pick a Shift - Student Dashboard.html'],['For Business','Pick a Shift - Business Dashboard.html']];
  React.useEffect(()=>{document.body.style.overflow=open?'hidden':'';},[open]);
  return (
    <header className="site-header">
      <div className="wrap">
        <Logo/>
        <nav className="nav-center">
          {links.map(([t,h])=><a key={t} href={h} className={'nav-link'+(active===t?' active':'')}>{t}</a>)}
        </nav>
        <div className="header-actions">
          <a className="btn btn-ghost" href="Pick a Shift - Student Dashboard.html">Log In</a>
          <a className="btn btn-primary" href="Pick a Shift - Student Dashboard.html">Sign Up</a>
          <button className="btn btn-icon btn-outline hamburger" aria-label="Menu" onClick={()=>setOpen(true)}>
            <Icon name="menu" size={20}/>
          </button>
        </div>
      </div>
      <div className={'mobile-sheet'+(open?' open':'')}>
        <div className="scrim" onClick={()=>setOpen(false)}></div>
        <div className="panel">
          <div className="m-top">
            <Logo className="logo logo-sm"/>
            <button className="close-x" onClick={()=>setOpen(false)}><Icon name="x" size={20}/></button>
          </div>
          {links.map(([t,h])=><a key={t} href={h} className="m-link" onClick={()=>setOpen(false)}>{t}</a>)}
          <div className="m-actions">
            <a className="btn btn-outline btn-block" href="Pick a Shift - Student Dashboard.html">Log In</a>
            <a className="btn btn-primary btn-block" href="Pick a Shift - Student Dashboard.html">Sign Up</a>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------- Footer ---------- */
function SiteFooter(){
  const cols=[
    ['Platform',['Browse Shifts','Post a Shift','How it Works','Pricing']],
    ['Company',['About','Careers','Blog','Press']],
    ['Support',['Help Center','Contact','Privacy','Terms']],
  ];
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo className="logo"/>
            <p>Flexible short-term shifts for students in Madrid. Pick one. Work it. Get paid.</p>
            <div className="socials">
              <a href="#" aria-label="Instagram"><Icon name="insta" size={19}/></a>
              <a href="#" aria-label="X"><Icon name="x_social" size={19}/></a>
              <a href="#" aria-label="LinkedIn"><Icon name="linkedin" size={19}/></a>
            </div>
          </div>
          {cols.map(([h,items])=>(
            <div className="foot-col" key={h}>
              <h5>{h}</h5>
              {items.map(i=><a key={i} href="#">{i}</a>)}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 Pick a Shift · Madrid, España</span>
          <span>Hecho con 🧡 para estudiantes</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Toast hook ---------- */
function useToast(){
  const [msg,setMsg]=React.useState(null);
  const show=(m)=>{setMsg(m);clearTimeout(window.__t);window.__t=setTimeout(()=>setMsg(null),2600);};
  const node=msg?(<div className="toast"><span className="t-ico"><Icon name="check" size={14}/></span>{msg}</div>):null;
  return [node,show];
}

/* ---------- Dashboard sidebar + bottom nav ---------- */
function DashShell({nav,active,user,children,topTitle,topSub,notif=3}){
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="side-logo"><Logo className="logo"/></div>
        <nav className="side-nav">
          {nav.map(n=>(
            <a key={n.label} href={n.href||'#'} className={'side-link'+(active===n.label?' active':'')}>
              <Icon name={n.icon} size={20}/> {n.label}
              {n.pill && <span className="pill">{n.pill}</span>}
            </a>
          ))}
        </nav>
        <div className="side-foot">
          <div className="side-card">
            <div className="sc-row">
              <div className={'avatar md'} style={{background:user.color}}>{user.initials}</div>
              <div style={{minWidth:0}}>
                <div style={{fontWeight:800,fontSize:14}}>{user.name}</div>
                <div style={{fontSize:12.5,color:'var(--muted)'}}>{user.sub}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div className="main">
        <div className="topbar">
          <div>
            <h1>{topTitle}</h1>
            {topSub && <div className="sub">{topSub}</div>}
          </div>
          <div className="tb-actions">
            <button className="icon-btn" aria-label="Notifications"><Icon name="bell" size={20}/><span className="notif-dot"></span></button>
            <div className={'avatar md'} style={{background:user.color}}>{user.initials}</div>
          </div>
        </div>
        {children}
      </div>
      <nav className="bottom-nav">
        {nav.slice(0,5).map(n=>(
          <a key={n.label} href={n.href||'#'} className={'bn-link'+(active===n.label?' active':'')}>
            {n.pill && <span className="bn-dot"></span>}
            <Icon name={n.icon} size={21}/>{n.short||n.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

Object.assign(window,{Icon,Logo,ShiftCard,SiteHeader,SiteFooter,DashShell,useToast,SHIFTS,bizColor,initials});
