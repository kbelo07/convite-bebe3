// Parallax sutil nas layers
const layers = Array.from(document.querySelectorAll('.layer'));
addEventListener('scroll', () => {
  const t = scrollY / innerHeight;
  if (layers[0]) layers[0].style.transform = `translateY(${ t * -10 }px)`;
  if (layers[1]) layers[1].style.transform = `translateY(${ t * -20 }px)`;
  if (layers[2]) layers[2].style.transform = `translateY(${ t * -30 }px)`;
}, {passive:true});

// Avião seguindo a rota
(function(){
  const path = document.getElementById('rota');
  const cursor = document.getElementById('cursor');
  if (!path || !cursor) return;
  const len = path.getTotalLength();
  let p = 0;
  function step(){
    p = (p + 1.5) % len;
    const pt = path.getPointAtLength(p);
    cursor.setAttribute('d', `M${pt.x},${pt.y} l0,0`);
    requestAnimationFrame(step);
  }
  step();
})();

// Carrossel de nomes (sem dependências)
const nomes = ["Aurora","Isis","Luna","Gael","Noah","Theo"];
let i = 0;
const card = document.getElementById('nameCard');
document.getElementById('prevName')?.addEventListener('click', () => {
  i = (i - 1 + nomes.length) % nomes.length;
  card.textContent = nomes[i];
});
document.getElementById('nextName')?.addEventListener('click', () => {
  i = (i + 1) % nomes.length;
  card.textContent = nomes[i];
});

// Votação local (LocalStorage)
const $bars = {
  tsuru: document.getElementById('barTsuru'),
  barco: document.getElementById('barBarco')
};
function readVotes(){
  const raw = localStorage.getItem('votos-origami');
  return raw ? JSON.parse(raw) : { tsuru:0, barco:0 };
}
function writeVotes(v){ localStorage.setItem('votos-origami', JSON.stringify(v)); }
function renderVotes(){
  const v = readVotes();
  const total = Math.max(1, v.tsuru + v.barco);
  const pctT = Math.round((v.tsuru/total)*100);
  const pctB = Math.round((v.barco/total)*100);
  $bars.tsuru.style.setProperty('--w', `${pctT}%`);
  $bars.barco.style.setProperty('--w', `${pctB}%`);
  $bars.tsuru.querySelector('span').textContent = `${pctT}%`;
  $bars.barco.querySelector('span').textContent = `${pctB}%`;
  $bars.tsuru.style.setProperty('position','relative');
  $bars.barco.style.setProperty('position','relative');
  $bars.tsuru.style.setProperty('--label', `"${pctT}%"`);
  $bars.barco.style.setProperty('--label', `"${pctB}%"`);
  $bars.tsuru.style.setProperty('width','100%');
  $bars.barco.style.setProperty('width','100%');
  // anima largura via CSS
  $bars.tsuru.style.setProperty('--w', `${pctT}%`);
  $bars.barco.style.setProperty('--w', `${pctB}%`);
  $bars.tsuru.style.setProperty('set','');
}
renderVotes();
document.querySelectorAll('.vote-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const team = btn.dataset.team;
    const v = readVotes();
    v[team]++; writeVotes(v); renderVotes();
  });
});
// CSS hook p/ barras (usando ::before)
const style = document.createElement('style');
style.textContent = `
  #barTsuru::before{ width: var(--w, 0%); transition: width .4s ease; }
  #barBarco::before{ width: var(--w, 0%); transition: width .4s ease; }
`;
document.head.appendChild(style);

// Copiar PIX
document.getElementById('copyPix')?.addEventListener('click', async (e)=>{
  const key = e.currentTarget.dataset.key;
  try{
    await navigator.clipboard.writeText(key);
    document.getElementById('copyMsg').textContent = 'PIX copiado!';
    setTimeout(()=>document.getElementById('copyMsg').textContent='', 1800);
  }catch(err){
    document.getElementById('copyMsg').textContent = 'Falha ao copiar :(';
  }
});