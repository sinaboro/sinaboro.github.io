const USER = 'sinaboro';

// 대표 프로젝트: 설명을 직접 보강
const FEATURED = {
  Springboot_CRUD_File_Comment: {
    icon: '📋',
    points: ['Spring Boot 3 + Security + JPA + Thymeleaf', '게시판 CRUD · 파일 첨부 · 댓글 · 페이징/검색', '폼 로그인 / 회원가입']
  },
  fastapi_react_connect_v1: {
    icon: '⚡',
    points: ['FastAPI 백엔드 ↔ React 프론트 연동', 'REST API 설계와 CORS 처리 실습']
  },
  langgraph_hkd: {
    icon: '🤖',
    points: ['LangGraph 기반 LLM 에이전트 실습', '상태 그래프로 멀티스텝 워크플로 구성']
  },
  shop: {
    icon: '🍎',
    points: ['React 18 + Redux Toolkit + React Router v6', '과일/채소 쇼핑몰, GitHub Pages 배포']
  },
  React_Boot_CRUD: {
    icon: '🔗',
    points: ['React + Spring Boot 풀스택 CRUD', '프론트/백엔드 분리 구조']
  },
  gitops_petclinic: {
    icon: '🚀',
    points: ['Spring PetClinic 을 GitOps 방식으로 배포', 'gitops_deploy 저장소와 연계한 CD 파이프라인']
  },
  'msa-sampleprj01': {
    icon: '🧩',
    points: ['마이크로서비스 아키텍처 샘플 프로젝트']
  },
  JSP11_SpringBoot_Migration: {
    icon: '🔄',
    points: ['JSP(백견불여일타 11장) → Spring Boot 마이그레이션', '레거시 전환 과정 실습']
  }
};

const DEMO_ICONS = { shop: '🍎', fruit: '🍓', zeep: '🏠', webservice: '🌐', react_fruit: '🍇', testhtml: '📄', reactshop: '🛒', react_data: '📦', react_json2: '🗂️', '0924': '🧪' };

const LANG_COLORS = {
  Java: '#b07219', JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#663399', Python: '#3572A5',
  'Jupyter Notebook': '#DA5B0B', Shell: '#89e051', TypeScript: '#3178c6', Vue: '#41b883', R: '#198CE7'
};

const CATS = [
  ['AI · Data', /langgraph|llm|ai-agent|^data$|rlang|fastapi|machine|deep/i],
  ['DevOps · Cloud', /cicd|gitops|actions|aws|devops|jenkins|msa|deploy/i],
  ['JSP', /jsp/i],
  ['Spring', /spring|boot|^sf_|security|member|shopex|mybatis|book|blog/i],
  ['Frontend', /react|vue|html|front|^shop$|fruit|zeep|testhtml|webservice|^0924$|node/i],
  ['Java', /java|ezen/i]
];
const CAT_COLORS = { 'AI · Data': '#8b5cf6', 'DevOps · Cloud': '#0ea5e9', JSP: '#f59e0b', Spring: '#22a35a', Frontend: '#ec4899', Java: '#b07219', 'Etc': '#64748b' };

const category = r => {
  const hay = r.name + ' ' + (r.description || '');
  for (const [c, re] of CATS) if (re.test(r.name) || (c !== 'Java' && re.test(hay))) return c;
  return 'Etc';
};

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtDate = d => new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
const pagesUrl = r => r.homepage || `https://${USER}.github.io/${r.name}/`;

function catBadge(c, label = c) {
  const col = CAT_COLORS[c] || CAT_COLORS.Etc;
  return `<span class="cat" style="background:${col}22;color:${col}">${label}</span>`;
}
function langMeta(r) {
  return r.language ? `<span><i class="lang-dot" style="background:${LANG_COLORS[r.language] || '#999'}"></i>${esc(r.language)}</span>` : '';
}

function repoCard(r, extra = '') {
  return `<a class="repo" href="${r.html_url}" target="_blank" rel="noopener">
    <div class="top"><span class="name">${esc(r.name)}</span>${catBadge(r._cat)}</div>
    <p class="desc">${esc(r.description || '설명 없음')}</p>
    ${extra}
    <div class="meta">${langMeta(r)}${r.stargazers_count ? `<span>★ ${r.stargazers_count}</span>` : ''}${r.fork ? '<span>fork</span>' : ''}<span>업데이트 ${fmtDate(r.pushed_at)}</span></div>
  </a>`;
}

function render(repos, user) {
  repos.forEach(r => (r._cat = category(r)));
  const own = repos.filter(r => !r.fork);

  // Stats
  if (user) {
    $('#sRepos').textContent = user.public_repos;
    $('#sFollowers').textContent = user.followers;
    $('#sYears').textContent = new Date().getFullYear() - new Date(user.created_at).getFullYear();
  }
  const demos = repos.filter(r => r.has_pages && r.name !== `${USER}.github.io`);
  $('#sDemos').textContent = demos.length;

  // 언어 분포
  const langs = {};
  own.forEach(r => r.language && (langs[r.language] = (langs[r.language] || 0) + 1));
  const lsorted = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 7);
  const lmax = lsorted[0]?.[1] || 1;
  $('#langBars').innerHTML = lsorted.map(([l, n]) =>
    `<div class="lang-row"><span>${esc(l)}</span><span class="bar"><i style="width:${n / lmax * 100}%;background:${LANG_COLORS[l] || '#999'}"></i></span><em>${n}</em></div>`).join('');

  // 대표 프로젝트
  const byName = Object.fromEntries(repos.map(r => [r.name, r]));
  $('#featuredGrid').classList.add('featured');
  $('#featuredGrid').innerHTML = Object.entries(FEATURED).filter(([n]) => byName[n]).map(([n, f]) => {
    const r = byName[n];
    const pts = `<ul class="points">${f.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`;
    return repoCard({ ...r, name: `${f.icon} ${r.name}` }, pts);
  }).join('');

  // 데모
  $('#demoGrid').innerHTML = demos.map(r => `
    <div class="repo demo">
      <div class="shot">${DEMO_ICONS[r.name] || '🌐'}</div>
      <div class="body">
        <span class="name">${esc(r.name)}</span>
        <p class="desc">${esc(r.description || 'GitHub Pages 데모')}</p>
        <div class="links"><a href="${pagesUrl(r)}" target="_blank" rel="noopener">사이트 열기 ↗</a><a href="${r.html_url}" target="_blank" rel="noopener">소스</a></div>
      </div>
    </div>`).join('');

  // 연도별 타임라인
  const years = {};
  own.forEach(r => (years[new Date(r.created_at).getFullYear()] ||= []).push(r));
  $('#timelineList').innerHTML = Object.keys(years).sort((a, b) => b - a).map(y => {
    const list = years[y].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const cats = {};
    list.forEach(r => (cats[r._cat] = (cats[r._cat] || 0) + 1));
    const catHtml = Object.entries(cats).sort((a, b) => b[1] - a[1]).map(([c, n]) => catBadge(c, `${c} ${n}`)).join('');
    return `<div class="tl-item">
      <div class="tl-year">${y}<small>${list.length}개 저장소</small></div>
      <div class="tl-cats">${catHtml}</div>
      <div class="tl-repos">${list.map(r => `<a href="${r.html_url}" target="_blank" rel="noopener" title="${esc(r.description || '')}">${esc(r.name)}</a>`).join('')}</div>
    </div>`;
  }).join('');

  // 전체 저장소 + 필터
  const allCats = ['전체', ...Object.keys(CAT_COLORS).filter(c => repos.some(r => r._cat === c))];
  let cur = '전체';
  $('#filters').innerHTML = allCats.map(c => `<button data-c="${c}" class="${c === cur ? 'on' : ''}">${c}</button>`).join('');
  const draw = () => {
    const q = $('#q').value.trim().toLowerCase();
    const hide = $('#hideForks').checked;
    const list = repos.filter(r =>
      (!hide || !r.fork) && (cur === '전체' || r._cat === cur) &&
      (!q || (r.name + ' ' + (r.description || '')).toLowerCase().includes(q)));
    $('#repoCount').textContent = `${list.length}개`;
    $('#repoGrid').innerHTML = list.map(r => repoCard(r)).join('') || '<p class="desc">검색 결과가 없습니다.</p>';
  };
  $('#filters').onclick = e => {
    if (!e.target.dataset.c) return;
    cur = e.target.dataset.c;
    [...$('#filters').children].forEach(b => b.classList.toggle('on', b.dataset.c === cur));
    draw();
  };
  $('#q').oninput = draw;
  $('#hideForks').onchange = draw;
  draw();
}

async function load() {
  try {
    const [u, p1, p2] = await Promise.all([
      fetch(`https://api.github.com/users/${USER}`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
      fetch(`https://api.github.com/users/${USER}/repos?per_page=100&page=1&sort=pushed`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
      fetch(`https://api.github.com/users/${USER}/repos?per_page=100&page=2&sort=pushed`).then(r => r.ok ? r.json() : [])
    ]);
    render([...p1, ...p2], u);
  } catch (e) {
    console.warn('GitHub API 실패, 스냅샷 사용:', e);
    render(window.REPO_SNAPSHOT || [], null);
  }
}

// 테마
(function theme() {
  const root = document.documentElement;
  try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch {}
  $('#themeBtn').onclick = () => {
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch {}
  };
})();

$('#yr').textContent = new Date().getFullYear();
load();
