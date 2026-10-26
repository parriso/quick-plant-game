// Sends a prompt (and optionally one photo) to the AI and resolves with the reply text.

function blobToBase64(blob){
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(',')[1]);
    r.onerror = rej;
    r.readAsDataURL(blob);
  });
}

async function askAI(prompt, imageBlob){
  // Running inside claude.ai as a published artifact: use the built-in capability.
  if(window.claude && window.claude.use){
    const sample = await window.claude.use('sample');
    if(!sample) throw { code: 'not_granted' };
    const opts = { modelTier: 'default', cache: false };
    if(imageBlob) opts.images = [imageBlob];
    return (await sample(prompt, opts)).text;
  }

  // Everywhere else (GitHub, Vercel, localhost): call your own server function.
  const url = window.FLORA_API_URL;
  if(!url) throw { code: 'no_backend' };
  const image = imageBlob ? await blobToBase64(imageBlob) : null;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, image })
  });
  if(res.status === 404) throw { code: 'no_backend' };
  if(res.status === 429) throw { code: 'rate_limited' };
  if(!res.ok) throw { code: 'server_error' };
  return (await res.json()).text;
}
