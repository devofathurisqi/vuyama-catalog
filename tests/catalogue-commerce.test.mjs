import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {products,retailProducts,packages,services} from '../dist/products.js';
import {addItem,cleanCart,cartLines,subtotal,unpricedCount,orderMessage,whatsappLink} from '../dist/commerce.js';
const source=JSON.parse(await readFile(new URL('../research/catalogue-data.json',import.meta.url),'utf8'));
const p=id=>products.find(p=>p.id===id);
const customer={name:'QA Contoh',phone:'081234567890',address:'Alamat pengujian lokal',city:'Bogor'};
test('all audited product, package and service rows are represented with source prices',()=>{
 assert.equal(retailProducts.length,source.products.length);assert.equal(packages.length,14);assert.equal(services.length,22);
 for(const x of source.products){assert.equal(p(x.id).price,x.price,x.id);assert.equal(p(x.id).variants.length,x.variants.length);assert.deepEqual(p(x.id).pricingTiers,x.pricingTiers);}
 for(const x of source.packages)assert.equal(p('paket-'+x.id).price,x.price);
 for(const x of source.services)assert.deepEqual(services.find(s=>s.id===x.id),x);
});
test('every published image exists locally and IDs are unique',async()=>{
 assert.equal(new Set(products.map(p=>p.id)).size,products.length);
 for(const x of products){assert.ok(x.variants.length);assert.equal(new Set(x.variants.map(v=>v.id)).size,x.variants.length,x.id);for(const img of [...x.images,...x.variants.map(v=>v.image),...(x.referenceImages||[])])await access(new URL('../dist/assets/images/'+img,import.meta.url));}
});
test('same variant merges, distinct colors remain separate and totals use the trusted catalogue',()=>{
 let c=addItem([],'viscose-gradasi','blushy-rose',2,products);
 c=addItem(c,'viscose-gradasi','blushy-rose',1,products);
 c=addItem(c,'viscose-gradasi','ash-charcoal',2,products);
 assert.equal(c.length,2);assert.equal(subtotal(c,products),495000);
 const altered=cleanCart([...c,{id:'fake',variant:'fake',qty:99,price:1},{id:'modal-viscose',variant:'fake',qty:1}],products);
 assert.deepEqual(altered,c);
});
test('sold archives and coming soon cannot be ordered or restored from saved carts',()=>{
 let blocked=0;
 for(const x of products)for(const v of x.variants)if(['sold-out','coming-soon'].includes(v.availability||x.availability)){blocked++;assert.deepEqual(addItem([],x.id,v.id,1,products),[]);}
 assert.ok(blocked>20);
});
test('unknown prices remain explicit in mixed orders and are never treated as free',()=>{
 const unknown=p('hampers-soft-box');
 let c=addItem([],unknown.id,unknown.variants[0].id,1,products);
 c=addItem(c,'viscose-gradasi','blushy-rose',2,products);
 assert.equal(subtotal(c,products),198000);assert.equal(unpricedCount(c,products),1);
 const m=orderMessage(c,products,customer,'VUYAMA');assert.match(m,/1 pcs belum termasuk subtotal/);assert.match(m,/konfirmasi harga/);assert.doesNotMatch(m,/Rp\s*0(?:\D|$)/);
});
test('WhatsApp order preserves selected variant, bundle units and verified destination',()=>{
 const bundle=products.find(p=>p.category==='Paket Usaha');
 let c=addItem([],bundle.id,'paket',1,products);
 c=addItem(c,'viscose-gradasi','creamy-nude',2,products);
 const m=orderMessage(c,products,customer,'VUYAMA');assert.match(m,/1 paket/);assert.match(m,/Creamy Nude/);assert.match(m,/2 pcs/);
 const url=new URL(whatsappLink('6285882450652',m));assert.equal(url.pathname,'/6285882450652');assert.equal(url.searchParams.get('text'),m);assert.doesNotMatch(m,/demo reseller/);
});
test('empty checkout and incomplete customer data are rejected',()=>{
 assert.throws(()=>orderMessage([],products,customer,'VUYAMA'));
 assert.throws(()=>orderMessage(addItem([],'viscose-gradasi','creamy-nude',1,products),products,{name:'QA'},'VUYAMA'));
});
