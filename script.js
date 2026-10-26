// 간단한 메뉴 위치 강조. 기존 데이터 생성 파이프라인과 독립적으로 동작합니다.
const links=[...document.querySelectorAll('.topbar-nav a[href^="#"]')];
if('IntersectionObserver' in window){const obs=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){links.forEach(a=>a.style.color=a.getAttribute('href')==='#'+e.target.id?'#83ceff':'');}},{rootMargin:'-35% 0px -55% 0px'});document.querySelectorAll('main section[id]').forEach(s=>obs.observe(s));}
