// Lexal Tech Store store: cart (localStorage), wishlist, promos, auth UI
function money(n){return '$'+Number(n||0).toFixed(2)}
function getCart(){try{return JSON.parse(localStorage.getItem('cart')||'[]')}catch{return[]}}
function saveCart(c){localStorage.setItem('cart',JSON.stringify(c));document.dispatchEvent(new Event('cart:update'));updateBadges()}
function addToCart(id,qty=1){
  fetch('/api/products/'+id).then(r=>r.json()).then(({product})=>{
    if(!product) return toast('Product not found');
    const cart=getCart(); const ex=cart.find(i=>i.id===id);
    if(ex) ex.qty=Math.min(99,ex.qty+qty); else cart.push({id:product.id,name:product.name,price:Number(product.price),imageUrl:product.imageUrl,qty});
    saveCart(cart); toast('Added to cart 🛒');
  }).catch(()=>toast('Could not add to cart'));
}
function changeQty(id,d){const c=getCart();const it=c.find(i=>i.id===id);if(!it)return;it.qty+=d;if(it.qty<=0)removeFromCart(id);else saveCart(c)}
function removeFromCart(id){saveCart(getCart().filter(i=>i.id!==id))}
function clearCart(){saveCart([])}
const PROMOS={TECH10:.10,WELCOME15:.15,SAVE20:.20};
function cartTotals(promoOverride,shipFee=0){
  const cart=getCart();const subtotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const code=(promoOverride!==undefined?promoOverride:(localStorage.getItem('promo')||'')).toUpperCase().trim();
  const disc=subtotal*(PROMOS[code]||0);
  return {subtotal,discount:disc,shipping:cart.length?shipFee:0,total:Math.max(0,subtotal-disc+ (cart.length?shipFee:0)),code};
}
function getWish(){try{return JSON.parse(localStorage.getItem('wish')||'[]')}catch{return[]}}
function toggleWish(id){let w=getWish();w=w.includes(id)?w.filter(x=>x!==id):[...w,id];localStorage.setItem('wish',JSON.stringify(w));updateBadges();toast(w.includes(id)?'Saved to wishlist ♡':'Removed from wishlist')}
function updateBadges(){
  const n=getCart().reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('#cartCount').forEach(e=>{e.textContent=n;e.style.display=n?'grid':'none'});
  const w=getWish().length;
  document.querySelectorAll('#wishCount').forEach(e=>{e.textContent=w;e.style.display=w?'grid':'none'});
}
function toast(msg){let t=document.querySelector('.toast');if(t)t.remove();t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
document.addEventListener('DOMContentLoaded',()=>{
  updateBadges();
  document.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();addToCart(b.dataset.add,1)}));
  document.getElementById('logoutBtn')?.addEventListener('click',async()=>{await fetch('/api/auth/logout',{method:'POST'});location.href='/'});
});
document.addEventListener('cart:update',updateBadges);
window.getCart=getCart;window.addToCart=addToCart;window.changeQty=changeQty;window.removeFromCart=removeFromCart;window.clearCart=clearCart;window.cartTotals=cartTotals;window.money=money;window.getWish=getWish;window.toggleWish=toggleWish;window.toast=toast;

