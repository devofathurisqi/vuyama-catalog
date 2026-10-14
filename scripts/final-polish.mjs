import fs from 'node:fs/promises';
const root='C:/project-devo/vuyama-catalog/';
let a=await fs.readFile(root+'dist/app.js','utf8');
a=a.replace("${count()-unpricedCount(cart,products)} pcs", "${count()-unpricedCount(cart,products)} item");
a=a.replace("${tierDetails(p)}<details><summary>Pengiriman", "${p.sourceFolder?`<a class=\"text-link source-gallery-link\" href=\"${e(p.sourceFolder.url)}\" target=\"_blank\" rel=\"noopener\">Lihat seluruh foto katalog ${icon('arrow')}</a>`:''}${tierDetails(p)}<details><summary>Pengiriman");
await fs.writeFile(root+'dist/app.js',a);
