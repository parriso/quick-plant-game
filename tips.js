// Friendly tips that fade in and out every 5 seconds.
(function(){
  const facts = [
    'Did you know? Bamboo can grow almost a meter in a single day. Talk about a glow-up.',
    'Fun fact: sunflowers follow the sun across the sky when they’re young. They’re little sun-chasers.',
    'Here’s a neat one: bananas are technically berries, but strawberries aren’t.',
    'Some bristlecone pines have been quietly growing for almost 5,000 years. Imagine the stories.',
    'A Venus flytrap waits for two touches before it snaps shut, so it doesn’t waste energy on raindrops. Smart!',
    'Scientists have found that many trees share nutrients through underground fungal networks. A real woodland community.',
    'That fresh-cut grass smell? It’s the grass releasing chemicals after being cut.',
    'About one in three bites of the food we eat depends on pollinators like bees. Say thanks next time you see one!',
    'Gentle tip: most houseplants forgive a missed watering far more easily than too much water.',
    'Quick tip: yellowing leaves are often a sign of overwatering. A little less love can help.',
    'Try this: wipe dust off your plant’s leaves now and then so they can soak up more light.',
    'Fun fact: the corpse flower smells like rotting meat to attract flies for pollination. Not one for the vase!',
    'Moss doesn’t have true roots. It just soaks up water through its leaves.',
    'Most cacti are native to the Americas, and they store water in their stems to get through dry spells.',
    'Tropical rainforests cover a small slice of the planet but are home to a huge share of its land species.',
    'Good to know: plants that lean toward a window are just reaching for light. Give the pot a quarter turn every week.',
    'Plants make the oxygen we breathe through photosynthesis, so every leaf is doing us a favor.',
    'A diverse garden is a happy garden. More kinds of flowers means more visits from bees and butterflies.'
  ];
  const jokes = [
    'Okay, one joke: what did the tree say to autumn? “Leaf me alone!” 🍂',
    'I told my plants a joke. They didn’t laugh, but they did start to grow on me.',
    'Why did the plant go to therapy? Too many unresolved root issues.',
    'How do trees get online? They just log in. 🌳'
  ];
  const box = document.getElementById('tip'), ico = document.getElementById('tipIco'), txt = document.getElementById('tipTxt');
  if(!box) return;
  const order = facts.map((_, i) => i).sort(() => Math.random() - .5);
  let fi = 0, ji = 0, lastJoke = true, timer;
  function next(){
    let t, i = '🌱';
    if(!lastJoke && Math.random() < .17){ t = jokes[ji++ % jokes.length]; i = '😄'; lastJoke = true; }
    else { t = facts[order[fi++ % order.length]]; lastJoke = false; }
    return [t, i];
  }
  function swap(){
    box.classList.add('out');
    setTimeout(() => { const [t, i] = next(); txt.textContent = t; ico.textContent = i; box.classList.remove('out'); }, 700);
  }
  function start(){ clearInterval(timer); timer = setInterval(swap, 5000); }
  const [t0, i0] = next(); txt.textContent = t0; ico.textContent = i0;
  box.onclick = () => { swap(); start(); };
  start();
})();
