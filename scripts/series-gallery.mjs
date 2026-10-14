import fs from 'node:fs/promises';
const root='C:/project-devo/vuyama-catalog/';let a=await fs.readFile(root+'dist/app.js','utf8');
a=a.replace("...(variant.imageIsExact?[variant.image,...p.images]:[...p.images,variant.image])", "...(variant.image!=='catalogue-placeholder.svg'?[variant.image,...p.images]:[...p.images,variant.image])");
a=a.replace("${v.imageIsExact&&v.image!=='catalogue-placeholder.svg'?img(v.image,v.name):", "${v.image!=='catalogue-placeholder.svg'?img(v.image,v.name):");
a=a.replace("Foto koleksi digunakan sebagai referensi. Detail warna pilihan dikonfirmasi admin. ", "Foto koleksi atau kartu warna merupakan referensi; detail pilihan dikonfirmasi admin. ");
await fs.writeFile(root+'dist/app.js',a);
