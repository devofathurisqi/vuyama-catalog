import fs from 'node:fs/promises';
const root='C:/project-devo/vuyama-catalog/';
let s=await fs.readFile(root+'scripts/import-catalogue.mjs','utf8');s=s.replace('Aisha Khiban berbahan Micro Modal Tencel.','Aisha Khiban berbahan Arabian Voile.');await fs.writeFile(root+'scripts/import-catalogue.mjs',s);
