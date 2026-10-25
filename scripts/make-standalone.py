from pathlib import Path
import base64,json,re
root=Path(__file__).resolve().parents[1]
dist=root/'dist'
three=(dist/'vendor/three.module.js').read_text()
match=re.search(r'export\s*\{([^}]+)\};?\s*$',three)
assert match,'Three.js export list missing'
exports=[]
for entry in match[1].split(','):
 parts=re.split(r'\s+as\s+',entry.strip())
 exports.append(parts[0] if len(parts)==1 else parts[1]+':'+parts[0])
three='const THREE=(()=>{\n'+three[:match.start()]+'\nreturn {'+','.join(exports)+'};\n})();'
controls=(dist/'vendor/OrbitControls.js').read_text()
controls=re.sub(r"import\s*\{([^}]+)\}\s*from 'three';",r'const {\1}=THREE;',controls,count=1)
controls=re.sub(r'export\s*\{\s*OrbitControls\s*\};?','return OrbitControls;',controls)
controls='const OrbitControls=(()=>{\n'+controls+'\n})();'
assets={p.stem:'data:image/jpeg;base64,'+base64.b64encode(p.read_bytes()).decode() for p in (dist/'textures').glob('*.jpg')}
app=(dist/'app.js').read_text()
app=re.sub(r'^import .*?;\n','',app,flags=re.M)
app='const TEXTURES='+json.dumps(assets)+';\n'+app
app=app.replace('loader.load(`textures/${d[1]}.jpg`','loader.load(TEXTURES[d[1]]')
app=app.replace("loader.load('textures/moon.jpg')","loader.load(TEXTURES.moon)")
app=app.replace('url(textures/${d[1]}.jpg)','url(${TEXTURES[d[1]]})')
app=app.replace('new THREE.AmbientLight(0x8ca5d9,.32)','new THREE.AmbientLight(0xc7d5e5,.09)')
app=app.replace('map:textures[d[1]],roughness:.93','map:textures[d[1]],emissiveMap:textures[d[1]],emissive:0xffffff,emissiveIntensity:.006,roughness:.93')
# Prepare close-up controls; the deep-space setup starts in system view.

app=app.replace('r*3,r*1.5,r*4.5', 'r*2.4,r*.9,r*3.5')
app=app.replace("$('#focus').textContent=", "document.body.classList.toggle('planet-focused',i>0);$('#focus').textContent=")
# Selecting a planet immediately brings it into view.
app=app.replace('button.onclick=()=>select(i)','button.onclick=()=>{select(i);focus()}')
# Photographic exposure, white sunlight, smaller stars and calmer motion.
app=app.replace('renderer.setClearColor(0x03060c)','renderer.setClearColor(0x000000)')
app=app.replace('Math.min(8,renderer.capabilities.getMaxAnisotropy())','renderer.capabilities.getMaxAnisotropy()')
app=app.replace('new THREE.SphereGeometry(1,64,40)','new THREE.SphereGeometry(1,128,80)')
app=app.replace('toneMappingExposure=1.25','toneMappingExposure=1.05')
app=app.replace('new THREE.PointLight(0xffead0,1400,0,1.3)','new THREE.PointLight(0xfff5e8,4.2,0,0)')
app=app.replace('color:0xffd4a0','color:0xfff1d6')
app=app.replace('glow.scale.set(31,31,1)','glow.scale.set(42,42,1)')
app=app.replace('size:.65,vertexColors:true,transparent:true,opacity:.85','size:.38,vertexColors:true,transparent:true,opacity:.65')
app=app.replace('time*.12/d[4]','time*.22/Math.pow(d[4],.32)')
app=app.replace("opacity:.19", "opacity:.14")
# Choose a viewpoint on the sunlit side with part of the night side visible.
app=app.replace('const target=body.group.position.clone();const r=', 'const target=body.group.position.clone();if(selected&&target.lengthSq()===0){target.set(Math.cos(body.angle)*body.data[3],0,Math.sin(body.angle)*body.data[3]);body.group.position.copy(target);}const r=')
app=app.replace('const offset=new THREE.Vector3(r*2.4,r*.9,r*3.5);', 'const sunward=target.clone().negate().normalize();if(!selected)sunward.set(0,0,1);const side=new THREE.Vector3().crossVectors(sunward,new THREE.Vector3(0,1,0)).normalize();const offset=sunward.multiplyScalar(r*3.8).addScaledVector(side,r*2.8).add(new THREE.Vector3(0,r*.8,0));')
app=app.replace('function animate(){', (root/'scripts/realism.js').read_text()+'\n'+(root/'scripts/sun-glow.js').read_text()+'\n'+(root/'scripts/deep-space.js').read_text()+'\nfunction animate(){')
app=app.replace('moon.position.set(', 'updateOrbitalTrails();clouds.rotation.y=time*.008;moon.position.set(')
css=(dist/'style.css').read_text()
css=re.sub(r"@import url\([^;]+;",'',css)
css+='''
/* Keep the center clear and make the planet the main subject. */
body.planet-focused .intro{display:none}
body.planet-focused aside{background:#0b111b99}
.body-label{color:#e5edf8;font-weight:600;font-size:11px}
@media(max-width:600px){body.planet-focused aside{bottom:220px;max-width:150px}body.planet-focused #facts{display:none}}
'''
css+=(root/'scripts/realism.css').read_text()
css+=(root/'scripts/quiz.css').read_text()
html=(dist/'index.html').read_text()
html=html.replace('<button id="help"', '<button id="open-quiz">Take the quiz</button><button id="help"')
html=html.replace('</main>', '</main><dialog id="quiz-dialog" aria-labelledby="quiz-title"><button id="close-quiz" aria-label="Close quiz">×</button><div id="quiz-content"></div></dialog>')
app+='\n'+(root/'scripts/quiz.js').read_text()
html=html.replace('Relative orbital periods are modeled.', 'Orbital speeds are compressed to make every planet’s movement visible.').replace('LIVE SIMULATION','ORBITAL SIMULATION')
html=html.replace('<link rel="stylesheet" href="style.css">','<style>'+css+'</style>')
html=re.sub(r'<script type="importmap">.*?</script>','',html,flags=re.S)
js='\n'.join([three,controls,app]).replace('</script','<\\/script')
html=html.replace('<script type="module" src="app.js"></script>','<script>\n'+js+'\n</script>')
(root/'solar-system.html').write_text(html)
Path('/tmp/solar-standalone-check.js').write_text(js)
assert not re.search(r'<(?:script|link)[^>]+(?:src|href)=',html)
assert 'loader.load(`textures/' not in html
print(f'Created solar-system.html ({len(html.encode())/1024/1024:.1f} MB); all scripts, styles and textures embedded.')
