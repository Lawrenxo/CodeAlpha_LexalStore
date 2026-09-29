// Hero carousel cycling real photos
(function(){
  const arts=['/img/hero/hero.jpg','/img/products/watch.jpg','/img/products/drone.jpg','/img/products/earbuds.jpg','/img/products/headphones.jpg'];
  let i=0;
  function show(n){i=(n+arts.length)%arts.length;const el=document.getElementById('heroArt');if(el)el.src=arts[i]}
  document.getElementById('heroNext')?.addEventListener('click',()=>show(i+1));
  document.getElementById('heroPrev')?.addEventListener('click',()=>show(i-1));
  setInterval(()=>{if(document.getElementById('heroArt'))show(i+1)},5000);
})();
