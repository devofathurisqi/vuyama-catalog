export const rupiah = value => new Intl.NumberFormat('id-ID', {style:'currency',currency:'IDR',maximumFractionDigits:0}).format(value);
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const quantity = value => Math.min(99, Math.max(1, Math.floor(Number(value) || 1)));
export const hasPrice = product => Number.isFinite(product.price) && product.price > 0;
export const priceLabel = product => hasPrice(product) ? rupiah(product.price) : 'Konfirmasi harga';
export function cleanCart(raw, catalogue) {
  if (!Array.isArray(raw)) return [];
  const result = [];
  for (const item of raw.slice(0,100)) {
    const p = catalogue.find(p => p.id === item?.id);
    const variant=p?.variants.find(v=>v.id===item?.variant);
    if (!p || !variant || ['sold-out','coming-soon'].includes(variant.availability||p.availability)) continue;
    const existing = result.find(x => x.id === item.id && x.variant === item.variant);
    if (existing) existing.qty = quantity(existing.qty + quantity(item.qty));
    else result.push({id:item.id,variant:item.variant,qty:quantity(item.qty)});
  }
  return result;
}
export function addItem(cart, id, variant, qty, catalogue) { return cleanCart([...cart,{id,variant,qty}],catalogue); }
export function cartLines(cart, catalogue) {
  return cleanCart(cart,catalogue).map(item => {
    const product = catalogue.find(p => p.id === item.id);
    const variant = product.variants.find(v => v.id === item.variant);
    return {...item,product,color:variant,total:hasPrice(product)?product.price*item.qty:null};
  });
}
export const subtotal = (cart,catalogue) => cartLines(cart,catalogue).reduce((sum,line) => sum+(line.total ?? 0),0);
export const unpricedCount = (cart,catalogue) => cartLines(cart,catalogue).filter(line=>line.total===null).reduce((n,line)=>n+line.qty,0);
export function orderMessage(cart,catalogue,customer,brand) {
  const lines = cartLines(cart,catalogue);
  if (!lines.length) throw new Error('Keranjang masih kosong.');
  if (!customer.name?.trim() || !customer.phone?.trim() || !customer.address?.trim() || !customer.city?.trim()) throw new Error('Lengkapi data pemesan.');
  return [
    `Halo, saya ingin memesan dari ${brand}.`, '',
    'DAFTAR PESANAN', ...lines.map((l,i) => `${i+1}. ${l.product.name}\n   Varian: ${l.color.name}\n   ${l.total===null?`${l.qty} ${l.product.unit||'pcs'} · Harga dikonfirmasi admin`:`${l.qty} ${l.product.unit||'pcs'} × ${rupiah(l.product.price)} = ${rupiah(l.total)}`}`), '',
    `Subtotal produk${unpricedCount(cart,catalogue)?' berharga':''}: ${lines.every(l=>l.total===null)?'Menunggu konfirmasi':rupiah(subtotal(cart,catalogue))}`,
    ...(unpricedCount(cart,catalogue)?[`${unpricedCount(cart,catalogue)} pcs belum termasuk subtotal; mohon konfirmasi harga.`]:[]),
    'Ongkir: mohon konfirmasi admin', '',
    'DATA PEMESAN', `Nama: ${customer.name.trim()}`, `WhatsApp: ${customer.phone.trim()}`, `Alamat: ${customer.address.trim()}`, `Kota/Kabupaten: ${customer.city.trim()}`,
    ...(customer.postcode?.trim() ? [`Kode pos: ${customer.postcode.trim()}`] : []), `Pengiriman: ${customer.shipping || 'Diskusikan dengan admin'}`,
    ...(customer.notes?.trim() ? [`Catatan: ${customer.notes.trim()}`] : []), '',
    'Mohon konfirmasi ketersediaan varian, ongkir, total akhir, dan cara pembayaran. Terima kasih.',
    '[Pesanan dari Vuyama Catalog]'
  ].join('\n');
}
export function whatsappLink(number,message) {
  const normalized = String(number).replace(/\D/g,'').replace(/^0/,'62');
  if (!/^62\d{8,13}$/.test(normalized)) throw new Error('Nomor tujuan tidak valid.');
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
