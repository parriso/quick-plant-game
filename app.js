const $ = id => document.getElementById(id);
let blob = null, busy = false;

function setMode(photo){
  $('tabPhoto').classList.toggle('on', photo);
  $('tabName').classList.toggle('on', !photo);
  $('photoPane').classList.toggle('hidden', !photo);
  $('namePane').classList.toggle('hidden', photo);
}
$('tabPhoto').onclick = () => setMode(true);
$('tabName').onclick = () => setMode(false);
$('drop').onclick = () => $('file').click();
$('retake').onclick = () => $('file').click();

$('file').onchange = async e => {
  const f = e.target.files[0]; if(!f) return;
  try{
    blob = await shrink(f);
    $('preview').src = URL.createObjectURL(blob);
    $('drop').classList.add('hidden');
    $('previewBox').classList.remove('hidden');
    $('out').innerHTML = '';
  }catch(err){ show('<div class="card msg">Couldn’t read that image. Try another one.</div>'); }
  e.target.value = '';
};

function shrink(file){
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const m = 1024, k = Math.min(1, m / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      c.toBlob(b => b ? res(b) : rej(), 'image/jpeg', 0.85);
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

const FORMAT = `Respond with ONLY a JSON object, no markdown fences, with these keys:
{"identified":true|false,"commonName":"","scientificName":"","family":"","confidence":0-100,"type":"e.g. tree, herb, succulent","native":"native range","summary":"2 sentences","history":"3-4 sentences on human history, naming, discovery or cultural use","biodiversity":["3 to 4 short facts about its ecological role, pollinators, wildlife, habitat, conservation status"],"caution":"toxicity or safety note, or empty string"}
If the plant can’t be determined, set identified to false and explain in summary.`;

function show(html){ $('out').innerHTML = html; $('out').scrollIntoView({behavior:'smooth', block:'start'}); }
function loading(t){ show(`<div class="card msg"><div class="spin"></div>${t}</div>`); }
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

async function run(prompt, images){
  if(busy) return; busy = true;
  loading(images ? 'Looking closely at your plant…' : 'Looking it up…');
  try{
    const text = await askAI(prompt + '\n\n' + FORMAT, images && images[0]);
    const t = (text || '').replace(/```json|```/g, '').trim();
    const d = JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1));
    render(d);
  }catch(err){
    const m = err && err.code === 'no_backend' ? 'The identifier isn\u2019t connected to a server yet. See the README to set up /api/identify.'
      : err && err.code === 'not_granted' ? 'Permission was declined, so I couldn’t identify the plant.'
      : err && err.code === 'rate_limited' ? 'Too many requests. Give it a moment and try again.'
      : 'Something went wrong. Please try again.';
    show(`<div class="card msg">${m}</div>`);
  }finally{ busy = false; }
}

function render(d){
  if(!d.identified){
    show(`<div class="card msg"><strong>Couldn’t pin this one down.</strong><br>${esc(d.summary)}</div>`); return;
  }
  const bio = (d.biodiversity || []).map(x => `<li>${esc(x)}</li>`).join('');
  show(`<div class="card result pane">
    <h2>${esc(d.commonName)}</h2>
    <div class="sci">${esc(d.scientificName)}</div>
    <div class="chips">${d.family?`<span class="chip">${esc(d.family)}</span>`:''}${d.type?`<span class="chip">${esc(d.type)}</span>`:''}${d.native?`<span class="chip">${esc(d.native)}</span>`:''}</div>
    ${d.confidence!=null?`<div class="conf" title="Confidence"><i style="width:${Math.max(0,Math.min(100,+d.confidence||0))}%"></i></div>`:''}
    <p>${esc(d.summary)}</p>
    <div class="sec"><h3>History</h3><p>${esc(d.history)}</p></div>
    <div class="sec"><h3>Biodiversity</h3><ul>${bio}</ul></div>
    ${d.caution?`<div class="warn">⚠️ ${esc(d.caution)}</div>`:''}
  </div>`);
}

$('idBtn').onclick = () => blob && run('Identify the plant in this photo.', [blob]);
const lookup = () => {
  const n = $('nameIn').value.trim(); if(!n) return;
  run(`Give details about the plant known as "${n}". If the name is ambiguous, pick the most common plant with that name.`);
};
$('nameBtn').onclick = lookup;
$('nameIn').addEventListener('keydown', e => { if(e.key === 'Enter') lookup(); });
