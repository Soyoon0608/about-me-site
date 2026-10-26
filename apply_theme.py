"""Apply the portfolio redesign to the existing about-me-site checkout.
Makes a backup of index.html; does not touch documents, data generators or script.js.
"""
from pathlib import Path
import shutil
root = Path.cwd()
p = root / 'index.html'
if not p.exists() or not (root/'style.css').exists():
    raise SystemExit('Run in the about-me-site folder (index.html and style.css required).')
s = p.read_text(encoding='utf-8')
if 'id="expertise"' in s:
    raise SystemExit('Theme already applied. No files changed.')
checks = ['<h1 class="hero-name">김소윤</h1>', '<!-- 이야기 -->', '<link rel="stylesheet" href="style.css">']
if any(x not in s for x in checks):
    raise SystemExit('Unexpected index.html structure. No files changed.')
shutil.copy2(p,root/'index.html.before-dark-navy.bak')
shutil.copy2(Path(__file__).with_name('portfolio-theme.css'), root/'portfolio-theme.css')
s=s.replace('김소윤 — 기록에서 시작하는 소개','김소윤 | Security & Network Portfolio')
s=s.replace('김소윤의 리추얼 기록을 재료로 계속 새로 쓰이는 자기소개 사이트','김소윤의 네트워크·웹보안 프로젝트, 보안 분석 경험, 성장 기록을 담은 포트폴리오')
s=s.replace('<link rel="stylesheet" href="style.css">','<link rel="stylesheet" href="style.css">\n<link rel="stylesheet" href="portfolio-theme.css">')
s=s.replace('<span class="topbar-name">김소윤</span>','<a class="topbar-name" href="#top" aria-label="홈으로 이동">SOYOON<span class="brand-dot">.</span> <span class="brand-sub">SECURITY PORTFOLIO</span></a>')
s=s.replace('<a href="#story">이야기</a>','<a href="#expertise">기술 역량</a>\n    <a href="#story">소개</a>')
s=s.replace('<a href="#numbers">숫자</a>','<a href="#numbers">기록</a>')
s=s.replace('<a href="#work">대표작</a>','<a href="#work">프로젝트</a>')
s=s.replace('<a href="#docs">문서</a>','<a href="#docs">자료</a>')
s=s.replace('<p class="hero-eyebrow">2026-08-11 — <time id="hero-today"></time>, 기록을 이어가는 중</p>','<p class="hero-eyebrow"><span class="status-light"></span> SECURITY · NETWORK · TROUBLESHOOTING</p>')
s=s.replace('<h1 class="hero-name">김소윤</h1>','<h1 class="hero-name">문제의 원인을 찾고,<br><span>해결을 검증합니다.</span></h1>\n    <p class="hero-identity">김소윤 <span>·</span> Security &amp; Network Engineer Portfolio</p>')
s=s.replace('<a href="#story" class="hero-link">이야기 읽기</a>','<a href="#work" class="hero-link hero-link-primary">프로젝트 살펴보기 ↗</a>\n      <a href="https://github.com/Soyoon0608" class="hero-link" target="_blank" rel="noopener noreferrer">GitHub ↗</a>')
s=s.replace('<a href="#numbers" class="hero-link">숫자로 보기</a>','<a href="#expertise" class="hero-link">기술 역량</a>')
s=s.replace('<a href="#work" class="hero-link">대표작 보기</a>','')
s=s.replace('<a href="#docs" class="hero-link">문서 내려받기</a>','<a href="#docs" class="hero-link">문서 보기</a>')
section='''<section class="section expertise" id="expertise" aria-labelledby="expertise-heading">
<p class="section-overline">01 / TECHNICAL EXPERTISE</p><h2 class="section-title" id="expertise-heading">기술 역량</h2>
<p class="section-lede">직접 구성하고, 요청과 패킷을 분석하고, 동작을 확인한 실습 경험을 중심으로 정리했습니다.</p>
<div class="skill-grid">
<article class="skill-card"><span class="skill-index">01 · NETWORK</span><h3>네트워크 설계 및 분석</h3><p>GNS3 기반 라우팅 구성, OSPF · EIGRP · VLAN · IPSec, Wireshark 패킷 분석</p><div class="skill-tags"><span>GNS3</span><span>Cisco</span><span>Wireshark</span></div></article>
<article class="skill-card"><span class="skill-index">02 · WEB SECURITY</span><h3>웹 취약점 분석</h3><p>실습 환경에서 SQL Injection · XSS · IDOR · 파일 업로드 취약점 재현과 원인 분석</p><div class="skill-tags"><span>Burp Suite</span><span>DVWA</span><span>Juice Shop</span></div></article>
<article class="skill-card"><span class="skill-index">03 · INFRASTRUCTURE</span><h3>서버와 보안 운영</h3><p>Linux 서버 관리, 방화벽 정책 실습, Prometheus · Grafana 모니터링 구성</p><div class="skill-tags"><span>Linux</span><span>iptables</span><span>Grafana</span></div></article>
<article class="skill-card"><span class="skill-index">04 · AUTOMATION</span><h3>개발 및 자동화</h3><p>Python을 활용한 데이터 정제·검증과 JavaScript 기반 웹서비스 구현</p><div class="skill-tags"><span>Python</span><span>JavaScript</span><span>SQL</span></div></article>
</div></section>\n'''
s=s.replace('<!-- 이야기 -->',section+'<!-- 이야기 -->',1)
# Original page script expects hero-today. Preserve this hidden accessible date node to avoid JS errors.
s=s.replace('<section class="hero" id="top">','<section class="hero" id="top">\n    <time id="hero-today" hidden></time>')
p.write_text(s,encoding='utf-8')
print('Applied theme, added expertise cards, and saved HTML backup.')
