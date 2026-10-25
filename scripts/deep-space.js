// Distant nebula and dark dust lanes live behind every solar-system object.
const skyGeometry=new THREE.SphereGeometry(900,48,32);
const skyMaterial=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{},vertexShader:`varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`
 precision highp float;
 varying vec3 direction;
 float hash(vec3 p){p=fract(p*0.3183099+vec3(0.17,0.31,0.73));p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
 float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float fbm(vec3 p){float n=0.0,a=0.5;for(int i=0;i<5;i++){n+=a*noise3(p);p=p*2.03+vec3(5.3,1.7,9.2);a*=0.5;}return n;}
 void main(){vec3 d=normalize(direction);float structure=fbm(d*5.0);float band=exp(-pow((d.y+d.x*0.22+0.12)*3.3,2.0));float haze=smoothstep(0.25,0.76,structure)*band;float dust=smoothstep(0.39,0.67,fbm(d*11.0+9.0));vec3 blue=vec3(0.025,0.041,0.074);vec3 violet=vec3(0.065,0.033,0.063);vec3 cloud=mix(blue,violet,fbm(d*3.0+4.0))*haze;cloud*=1.0-dust*0.96;gl_FragColor=vec4(vec3(0.00015)+cloud,1.0);}
`});
const deepSky=new THREE.Mesh(skyGeometry,skyMaterial);deepSky.renderOrder=-10;scene.add(deepSky);
// Small luminous stellar cores with soft, restrained halos.
const brightPositions=[],brightColors=[];
for(let i=0;i<420;i++){const y=random()*2-1,a=random()*Math.PI*2,r=430+random()*250,s=Math.sqrt(1-y*y);brightPositions.push(r*s*Math.cos(a),r*y,r*s*Math.sin(a));const color=new THREE.Color().setHSL(.55+random()*.18,.08+random()*.24,.7+random()*.28);brightColors.push(color.r,color.g,color.b);}
const brightGeometry=new THREE.BufferGeometry();brightGeometry.setAttribute('position',new THREE.Float32BufferAttribute(brightPositions,3));brightGeometry.setAttribute('color',new THREE.Float32BufferAttribute(brightColors,3));
const starCanvas=document.createElement('canvas');starCanvas.width=starCanvas.height=64;const starContext=starCanvas.getContext('2d');const starGradient=starContext.createRadialGradient(32,32,0,32,32,32);starGradient.addColorStop(0,'rgba(255,255,255,1)');starGradient.addColorStop(.09,'rgba(255,255,255,.95)');starGradient.addColorStop(.25,'rgba(220,235,255,.18)');starGradient.addColorStop(1,'rgba(220,235,255,0)');starContext.fillStyle=starGradient;starContext.fillRect(0,0,64,64);
scene.add(new THREE.Points(brightGeometry,new THREE.PointsMaterial({map:new THREE.CanvasTexture(starCanvas),size:2.2,vertexColors:true,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false})));
function systemOverview(){following=false;transition={target:new THREE.Vector3(0,0,0),position:new THREE.Vector3(0,110,135).multiplyScalar(Math.max(1,1.15/camera.aspect))};controls.minDistance=2;document.body.classList.remove('planet-focused');}
$('#overview').onclick=systemOverview;
// Start with the complete orbital scene, already framed rather than flying in.
select(0);systemOverview();camera.position.copy(transition.position);controls.target.copy(transition.target);transition=null;
// Short, fading orbit trails make each planet's direction easy to read.
const orbitalTrails=objects.slice(1).map(body=>{
 const count=80,positions=new Float32Array(count*3),colors=new Float32Array(count*3);
 const tint=new THREE.Color(body.data[5]);
 for(let j=0;j<count;j++){const fade=Math.pow(j/(count-1),1.8)*.65;colors[j*3]=tint.r*fade;colors[j*3+1]=tint.g*fade;colors[j*3+2]=tint.b*fade;}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
 const line=new THREE.Line(geometry,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false}));line.frustumCulled=false;scene.add(line);return {body,line,count};
});
function updateOrbitalTrails(){
 for(const trail of orbitalTrails){const {body,line,count}=trail;line.visible=orbitLines[0].visible;const d=body.data,a=body.angle+time*.22/Math.pow(d[4],.32);const positions=line.geometry.attributes.position;
 for(let j=0;j<count;j++){const phase=a-(1-j/(count-1))*.55;positions.setXYZ(j,Math.cos(phase)*d[3],-.035,Math.sin(phase)*d[3]);}positions.needsUpdate=true;}
}
