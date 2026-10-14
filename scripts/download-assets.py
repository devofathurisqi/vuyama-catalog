"""Download verified, public Vuyama Drive image metadata and optimize WebP.

Uses only IDs from research/drive-inventory-current.json. Original files stay
in memory; the reseller pricelist is never handled by this image-only pipeline.
"""
import concurrent.futures as cf
import io, json, re, time, urllib.request
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist/assets/images'
REPORT = ROOT / 'research/asset-downloads.json'
inv = json.loads((ROOT / 'research/drive-inventory-current.json').read_text(encoding='utf-8-sig'))

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def select():
    selections = []
    color_folders = {
        'Hayla Khiban/warna':'hayla', 'Aisha Khiban/warna':'aisha',
        '15. Bamboo Slip On/warna':'slip-on', '20. Pashmina Modal Viscose/warna':'modal',
        '18. Hawa Instan/warna':'hawa', '13. Pashmina Bamboo Spandex/warna':'bamboo',
        '14. Zoya Instan Bamboo/warna shopee':'zoya', '7. Paris Jadul/warna max 2kb':'paris',
        '17. Paris Japan/foto warna ':'paris-japan',
    }
    charts = {
        '4. Pashmina Airtech Ultrasoft':'airtech', '5. Gana Pashmina Oval Instan':'gana',
        '21. Pashmina Viscose Highlight':'highlight', '17. Paris Japan':'paris-japan',
    }
    for folder in inv['folders']:
        p = folder['path']
        images = [f for f in folder['files'] if f.get('mime_type','').startswith('image/')]
        chosen = []
        if p in color_folders:
            chosen = images
            product = color_folders[p]
        elif p in charts:
            chosen = [f for f in images if 'serian' in f['title'].lower() or (p.startswith('4.') and f == images[0])]
            product = charts[p]
        elif p.startswith('10. Mukena Armani/') and images:
            chosen = images[:1]
            product = 'armani-' + slug(p.split('/')[-1])
        elif p.startswith('8. Motif Tryspan/') and images and not p.endswith('on model'):
            chosen = images[:1]
            product = 'tryspan-' + slug(p.split('/')[-1])
        else:
            continue
        for f in chosen:
            selections.append(dict(id=f['id'], title=f['title'], mimeType=f['mime_type'], sourceUrl=f['url'], folder=p,
                file='new-'+product+'-'+slug(Path(f['title']).stem)+'.webp'))
    names = {}
    for s in selections:
        n=s['file']; names[n]=names.get(n,0)+1
        if names[n]>1: s['file']=n[:-5]+'-'+s['id'][-5:]+'.webp'
    return selections

def download(s):
    target=OUT/s['file']
    if target.exists():
        try:
            with Image.open(target) as im: im.verify()
            return dict(s,status='ready',bytes=target.stat().st_size)
        except Exception: pass
    for attempt in range(3):
        try:
            req=urllib.request.Request('https://drive.google.com/uc?export=download&id='+s['id'],headers={'User-Agent':'Mozilla/5.0'})
            with urllib.request.urlopen(req,timeout=90) as r: data=r.read()
            with Image.open(io.BytesIO(data)) as original:
                im=ImageOps.exif_transpose(original).convert('RGB')
                original_size=im.size
                im.thumbnail((1200,1200),Image.Resampling.LANCZOS)
                im.save(target,format='WEBP',quality=84,method=6)
            return dict(s,status='ready',bytes=target.stat().st_size,sourceBytes=len(data),originalSize=original_size)
        except Exception as e:
            error=type(e).__name__+': '+str(e)[:160]
            if attempt<2: time.sleep(2)
    return dict(s,status='failed',error=error)

def main():
    selected=select()
    OUT.mkdir(parents=True,exist_ok=True)
    results=[]
    print('Selected',len(selected),'verified image files',flush=True)
    with cf.ThreadPoolExecutor(max_workers=12) as pool:
        for future in cf.as_completed([pool.submit(download,s) for s in selected]):
            results.append(future.result())
            REPORT.write_text(json.dumps({'checkedAt':'2026-10-15','sourceRootId':inv['rootId'],'optimization':'WebP quality 84, maximum 1200px, EXIF corrected','assets':sorted(results,key=lambda x:x['file'])},indent=2),encoding='utf-8')
            r=results[-1]
            print(len(results),'/',len(selected),r['status'],r['file'],flush=True)
    print('Ready:',sum(r['status']=='ready' for r in results),'Failed:',sum(r['status']!='ready' for r in results),flush=True)

if __name__=='__main__': main()
