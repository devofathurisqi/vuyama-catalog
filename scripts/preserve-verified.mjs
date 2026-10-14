import fs from 'node:fs/promises';
const root='C:/project-devo/vuyama-catalog/';
let s=await fs.readFile(root+'scripts/import-catalogue.mjs','utf8');
s=s.replace("const placeholder='catalogue-placeholder.svg';", "const placeholder='catalogue-placeholder.svg';\nconst verified=JSON.parse(await fs.readFile(new URL('research/verified-existing-variants.json',root),'utf8'));\n");
s=s.replace("if(candidate&&files.has(candidate))v.image=candidate;", "if(candidate&&files.has(candidate))v.image=candidate;\n  const prior=verified.find(x=>x.productId===p.id&&x.variantId===v.id);\n  if(prior&&files.has(prior.image)){v.image=prior.image;v.imageIsExact=true;}\n");
await fs.writeFile(root+'scripts/import-catalogue.mjs',s);
