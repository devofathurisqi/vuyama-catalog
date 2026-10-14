import fs from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const data=JSON.parse(await fs.readFile(new URL('research/catalogue-data.json',root),'utf8'));
let assets=[];try{assets=JSON.parse(await fs.readFile(new URL('research/asset-downloads.json',root),'utf8')).assets||[];}catch{}
try{assets.push(...JSON.parse(await fs.readFile(new URL('research/asset-supplemental.json',root),'utf8')).assets);}catch{}
const assetMap=new Map(assets.filter(a=>a.status==='ready').map(a=>[a.id,a.file]));
const files=new Set(await fs.readdir(new URL('dist/assets/images/',root)));
const placeholder='catalogue-placeholder.svg';
const verified=JSON.parse(await fs.readFile(new URL('research/verified-existing-variants.json',root),'utf8'));

const descriptions={
 'modal-viscose':'Siluet sederhana, pilihan warna yang leluasa. Pashmina berbahan Modal Viscose untuk melengkapi gaya sehari-harimu.',
 'viscose-gradasi':'Dua nuansa, satu cerita. Temukan 12 perpaduan warna Viscose Gradasi, dari Blushy Rose hingga Pearl Black.',
 'printed-viscose':'Sentuhan motif untuk gaya personalmu. Jelajahi kode PPV serta seri Cloudy, Stormy, dan Windy.',
 'hayla-khiban':'Pilihan khiban berbahan Rayon Airflow untuk melengkapi setiap langkahmu. Pilih warna yang paling terasa seperti kamu.',
 'aisha-khiban':'Aisha Khiban berbahan Arabian Voile. Jelajahi pilihan warna untuk gaya yang terasa personal.',
 'paris-legend':'Segi empat klasik berbahan Paris Legenda. Dari warna netral hingga warna yang lebih berani, temukan pilihan untuk harimu.'
};
for(const p of data.products){
 p.description=descriptions[p.id]||p.description;
 if(!p.variants.length)p.variants=[{id:'konsultasi',name:'Pilihan dikonfirmasi admin',image:placeholder,imageIsExact:false}];
 if(!p.images.length)p.images=[placeholder];
 for(const v of p.variants){
  const candidate=assetMap.get(v.source?.id); 
  if(candidate&&files.has(candidate))v.image=candidate;
  const prior=verified.find(x=>x.productId===p.id&&x.variantId===v.id);
  if(prior&&files.has(prior.image)){v.image=prior.image;v.imageIsExact=true;}

  if(!v.image||!files.has(v.image)){v.image=placeholder;v.imageIsExact=false;}
  v.hex=v.hex||'#ded6cc';
  if(!v.family){const n=v.name.toLowerCase();v.family=/black|charcoal|hitam/.test(n)?'Hitam':/white|ivory|putih/.test(n)?'Putih':/pink|rose|blush|dusty/.test(n)?'Pink':/lilac|lavender|mauve|taro|orchid/.test(n)?'Lavender':/navy|blue|denim|jeans|biru/.test(n)?'Biru':/green|olive|sage|mint|pine|kale|hijau/.test(n)?'Hijau':/beige|cream|latte|brown|coffee|choco|milo|sand|oat|almond|mocca|mahogany|earth|cookie|nude/.test(n)?'Taupe':p.category==='Segi Empat'&&v.variantType==='series'?'Motif':undefined;}

 }
 p.images=p.images.map(i=>files.has(i)?i:placeholder);
 p.referenceImages=[...new Set((p.unclassifiedAssets||[]).map(x=>assetMap.get(x.id)).filter(Boolean))];
 for(const v of p.variants)if(v.variantType==='chart-color'&&v.image!==placeholder&&!p.referenceImages.includes(v.image))p.referenceImages.push(v.image);

 if(!p.label)p.label=p.category;
}
const retailProducts=data.products;
const bundles=data.packages.map(p=>({...p,id:'paket-'+p.id,category:'Paket Usaha',material:'Paket reseller',unit:'paket',label:'GROW WITH VUYAMA',description:p.contents.join('. ')+'. '+(p.note||''),images:[placeholder],variants:[{id:'paket',name:p.selection||'Paket sesuai katalog',image:placeholder,hex:'#ded6cc',imageIsExact:false}],availability:'confirm-stock',priceSource:p.source}));
const products=[...retailProducts,...bundles];
const categories=['Semua',...new Set(retailProducts.map(p=>p.category))];
const output='// Generated from research/catalogue-data.json. Run node scripts/import-catalogue.mjs after auditing sources.\n'+Object.entries({products,categories,packages:data.packages,services:data.services,customDesignRules:data.customDesignRules}).map(([key,value])=>'export const '+key+' = '+JSON.stringify(value,null,2)+';').join('\n')+'\nexport const retailProducts=products.filter(p=>p.category!=="Paket Usaha");\nexport const findProduct=id=>products.find(p=>p.id===id);\n';
await fs.writeFile(new URL('dist/products.js',root),output);
console.log(JSON.stringify({products:retailProducts.length,variants:retailProducts.reduce((s,p)=>s+p.variants.length,0),bundles:bundles.length,services:data.services.length,missingPhotos:retailProducts.flatMap(p=>p.variants).filter(v=>v.image===placeholder).length}));
