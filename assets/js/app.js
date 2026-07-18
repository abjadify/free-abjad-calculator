// ---- Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

function closeNavMenu(){
  navMenu.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', function(){
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navMenu.querySelectorAll('.nav-links a, .nav-cta').forEach(a => {
  a.addEventListener('click', closeNavMenu);
});

// ---- Abjad Kabir letter → value map ----
const abjadMap = {
  'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,'ی':10,
  'ک':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,
  'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,
  'ض':800,'ظ':900,'غ':1000,
  // Persian-only letters mapped to nearest Arabic equivalent
  'پ':2,'چ':3,'ژ':7,'گ':20,
  // common alternate forms
  'ي':10,'ك':20,'ة':5,'ى':10,
  // hamza carriers — counted with the base letter's value (usually 1, like ا) when the toggle is on
  'ء':1,'أ':1,'إ':1,'ؤ':6,'ئ':10,'آ':1
};

// ---- Maghribi (western) abjad order ----
// The Maghribi mnemonic (…صعفض قرست ثخذ ظغش) reassigns six letters relative
// to the eastern order used above. Every other letter keeps its value, so we
// only override the ones that differ and merge this on top of abjadMap when
// the "Maghribi order" option is on.
const maghribiOverride = {
  'ص':60,   // was 90
  'ض':90,   // was 800
  'س':300,  // was 60
  'ش':1000, // was 300
  'ظ':800,  // was 900
  'غ':900,  // was 1000
};

// resolve the active value table for the selected order
function abjadTable(useMaghribi){
  return useMaghribi ? Object.assign({}, abjadMap, maghribiOverride) : abjadMap;
}

// letters whose value only applies when "count hamza" is enabled
// (آ is excluded — it's a structural letter form, not an optional hamza mark)
const hamzaLetters = new Set(['ء','أ','إ','ؤ','ئ']);

const groups = [
  { name:'ابجد',  letters:['ا','ب','ج','د'] },
  { name:'هوز',   letters:['ه','و','ز'] },
  { name:'حطی',   letters:['ح','ط','ی'] },
  { name:'کلمن',  letters:['ک','ل','م','ن'] },
  { name:'سعفص',  letters:['س','ع','ف','ص'] },
  { name:'قرشت',  letters:['ق','ر','ش','ت'] },
  { name:'ثخذ',   letters:['ث','خ','ذ'] },
  { name:'ضظغ',   letters:['ض','ظ','غ'] },
];

function renderGroups(){
  const wrap = document.getElementById('abjadGroups');
  wrap.innerHTML = groups.map(g => `
    <div class="abjad-card">
      <div class="group-name">${g.name}</div>
      <div class="abjad-letters">
        ${g.letters.map(l => `
          <div class="abjad-letter">
            <span class="l">${l}</span>
            <span class="v">${abjadMap[l]}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}
renderGroups();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function computeAbjad(name, countHamza, useMaghribi){
  const table = abjadTable(useMaghribi);
  const letters = name.replace(/\s+/g,'').split('');
  const parsed = letters
    .map(ch => ({ ch, val: table[ch] }))
    .filter(item => item.val !== undefined)
    .filter(item => countHamza || !hamzaLetters.has(item.ch));
  const total = parsed.reduce((sum, item) => sum + item.val, 0);
  return { parsed, total };
}

function renderDemo(name){
  const countHamza = document.getElementById('hamzaToggle').checked;
  const maghribiEl = document.getElementById('maghribiToggle');
  const useMaghribi = maghribiEl ? maghribiEl.checked : false;
  const { parsed, total } = computeAbjad(name, countHamza, useMaghribi);
  const row = document.getElementById('tilesRow');
  const totalEl = document.getElementById('sealTotal');
  // per-page translated empty-state text, set via data-empty-text on the tiles row
  const emptyText = row.dataset.emptyText || 'No calculable letters found';

  if(parsed.length === 0){
    row.innerHTML = `<span style="color:var(--parchment-muted); font-size:.85rem; align-self:center;">${emptyText}</span>`;
    totalEl.textContent = '0';
    return;
  }

  row.innerHTML = parsed.map((item, i) => `
    <div class="tile" style="animation-delay:${reduceMotion ? '0s' : (i*0.07)+'s'}">
      <span class="letter">${item.ch}</span>
      <span class="val">${item.val}</span>
    </div>
  `).join('');

  totalEl.textContent = total;
}

document.getElementById('calcForm').addEventListener('submit', function(e){
  e.preventDefault();
  const val = document.getElementById('nameInput').value.trim();
  if(val) renderDemo(val);
});

document.getElementById('hamzaToggle').addEventListener('change', function(){
  const val = document.getElementById('nameInput').value.trim();
  if(val) renderDemo(val);
});

const maghribiToggle = document.getElementById('maghribiToggle');
if (maghribiToggle) {
  maghribiToggle.addEventListener('change', function(){
    const val = document.getElementById('nameInput').value.trim();
    if(val) renderDemo(val);
  });
}

renderDemo(document.getElementById('nameInput').value);

// ---- Back-to-top button ----
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  // reveal the button once the page has scrolled a screenful or so
  const showAfter = 400;

  function toggleBackToTop(){
    const scrolled = window.scrollY > showAfter;
    backToTop.hidden = !scrolled;
    backToTop.classList.toggle('is-visible', scrolled);
  }

  // passive listener keeps scrolling smooth; run once on load in case
  // the page is reloaded partway down
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTop.addEventListener('click', function(){
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}
