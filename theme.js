// Light/dark toggle (light is the default, choice is remembered).
(function(){
  const root = document.documentElement, ico = document.getElementById('themeIco'), lbl = document.getElementById('themeLbl');
  function apply(m){
    root.dataset.theme = m;
    ico.textContent = m === 'dark' ? '\u2600\ufe0f' : '\ud83c\udf19';
    lbl.textContent = m === 'dark' ? 'Light' : 'Dark';
    try{ localStorage.setItem('fernly-theme', m); }catch(e){}
  }
  let saved = null; try{ saved = localStorage.getItem('fernly-theme'); }catch(e){}
  apply(saved === 'dark' ? 'dark' : 'light');
  document.getElementById('themeBtn').onclick = () => apply(root.dataset.theme === 'dark' ? 'light' : 'dark');
})();
