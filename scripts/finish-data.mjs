import fs from 'node:fs/promises';
const root='C:/project-devo/vuyama-catalog/';let s=await fs.readFile(root+'scripts/import-catalogue.mjs','utf8');
s=s.replace("const assetMap=new Map", "try{assets.push(...JSON.parse(await fs.readFile(new URL('research/asset-supplemental.json',root),'utf8')).assets);}catch{}\nconst assetMap=new Map");
s=s.replace("v.hex=v.hex||'#ded6cc';", "v.hex=v.hex||'#ded6cc';\n  if(!v.family){const n=v.name.toLowerCase();v.family=/black|charcoal|hitam/.test(n)?'Hitam':/white|ivory|putih/.test(n)?'Putih':/pink|rose|blush|dusty/.test(n)?'Pink':/lilac|lavender|mauve|taro|orchid/.test(n)?'Lavender':/navy|blue|denim|jeans|biru/.test(n)?'Biru':/green|olive|sage|mint|pine|kale|hijau/.test(n)?'Hijau':/beige|cream|latte|brown|coffee|choco|milo|sand|oat|almond|mocca|mahogany|earth|cookie|nude/.test(n)?'Taupe':p.category==='Segi Empat'&&v.variantType==='series'?'Motif':undefined;}\n");
await fs.writeFile(root+'scripts/import-catalogue.mjs',s);
