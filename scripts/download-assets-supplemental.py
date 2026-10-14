import json,io,urllib.request,concurrent.futures
from pathlib import Path
from PIL import Image,ImageOps
root=Path('C:/project-devo/vuyama-catalog')
d=json.loads((root/'research/catalogue-data.json').read_text(encoding='utf-8-sig'))
a=json.loads((root/'research/asset-downloads.json').read_text(encoding='utf-8-sig'))['assets']
ready={x['id'] for x in a if x['status']=='ready'}
selected={v['source']['id']:v['source'] for p in d['products'] for v in p['variants'] if v.get('source',{}).get('mimeType','').startswith('image/') and v['source']['id'] not in ready and not v.get('image')}
def run(s):
 try:
  url='https://drive.google.com/thumbnail?id='+s['id']+'&sz=w1200'
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=18) as r: b=r.read()
  im=ImageOps.exif_transpose(Image.open(io.BytesIO(b))).convert('RGB');im.thumbnail((1200,1200))
  name='new-'+s['id']+'.webp';im.save(root/'dist/assets/images'/name,quality=84)
  return dict(id=s['id'],file=name,status='ready',sourceUrl=s['url'],title=s['title'])
 except Exception as e:return dict(id=s['id'],status='failed',error=str(e)[:90])
print('Supplemental',len(selected),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
 results=list(pool.map(run,selected.values()))
(root/'research/asset-supplemental.json').write_text(json.dumps({'assets':results},indent=2))
print('Ready',sum(r['status']=='ready' for r in results),'of',len(results),flush=True)
