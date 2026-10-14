import json,urllib.request,io,concurrent.futures
from pathlib import Path
from PIL import Image
root=Path('C:/project-devo/vuyama-catalog'); path=root/'research/asset-supplemental.json';d=json.loads(path.read_text());failed=[x for x in d['assets'] if x['status']=='failed']
def retry(x):
 try:
  with urllib.request.urlopen('https://lh3.googleusercontent.com/d/'+x['id']+'=w1000',timeout=40) as r:b=r.read()
  im=Image.open(io.BytesIO(b)).convert('RGB');im.thumbnail((1200,1200));name='new-'+x['id']+'.webp';im.save(root/'dist/assets/images'/name,quality=84)
  return dict(id=x['id'],file=name,status='ready')
 except Exception as e:return x
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool: fixed=list(pool.map(retry,failed))
fix={x['id']:x for x in fixed};d['assets']=[fix.get(x['id'],x) for x in d['assets']];path.write_text(json.dumps(d,indent=2));print('Supplemental ready',sum(x['status']=='ready' for x in d['assets']),'/',len(d['assets']),flush=True)
