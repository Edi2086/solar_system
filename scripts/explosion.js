// A reversible cinematic effect, independent of the orbital simulation clock.
const explosionCount=2400,explosionPositions=new Float32Array(explosionCount*3),explosionColors=new Float32Array(explosionCount*3),explosionVelocities=new Float32Array(explosionCount*3);
for(let i=0;i<explosionCount;i++){
 const y=random()*2-1,a=random()*Math.PI*2,s=Math.sqrt(1-y*y),v=4+Math.pow(random(),2)*20;
 explosionVelocities.set([s*Math.cos(a)*v,y*v,s*Math.sin(a)*v],i*3);
 const c=new THREE.Color().setHSL(.025+random()*.11,1,.5+random()*.35);explosionColors.set([c.r,c.g,c.b],i*3);
}
const explosionGeometry=new THREE.BufferGeometry();explosionGeometry.setAttribute('position',new THREE.BufferAttribute(explosionPositions,3).setUsage(THREE.DynamicDrawUsage));explosionGeometry.setAttribute('color',new THREE.BufferAttribute(explosionColors,3));
const explosionDebris=new THREE.Points(explosionGeometry,new THREE.PointsMaterial({map:new THREE.CanvasTexture(starCanvas),size:1.1,vertexColors:true,transparent:true,opacity:1,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));explosionDebris.frustumCulled=false;explosionDebris.visible=false;scene.add(explosionDebris);
const shockwave=new THREE.Mesh(new THREE.SphereGeometry(1,64,40),new THREE.ShaderMaterial({uniforms:{strength:{value:0}},vertexShader:`varying vec3 n;varying vec3 v;void main(){vec4 p=modelViewMatrix*vec4(position,1.0);v=p.xyz;n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*p;}`,fragmentShader:`uniform float strength;varying vec3 n;varying vec3 v;void main(){float rim=pow(1.0-abs(dot(normalize(n),normalize(-v))),5.0);gl_FragColor=vec4(1.0,0.48,0.12,rim*strength);}`,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));shockwave.visible=false;scene.add(shockwave);
const explosionFlash=new THREE.Sprite(new THREE.SpriteMaterial({map:glow.material.map,color:0xffe8b8,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));explosionFlash.visible=false;scene.add(explosionFlash);
const sunParts=[objects[0].group,solarCorona,solarLightRing,glow,outerSolarGlow];
const explodeButton=document.querySelector('#explode-sun'),explosionStatus=document.querySelector('#explosion-status');
const reducedExplosionMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Reusable rock and tree fragments burst from the disappearing worlds.
const worldDebris=new THREE.Group();worldDebris.visible=false;scene.add(worldDebris);
const rockGeometry=new THREE.IcosahedronGeometry(1,0);
const rockMaterial=new THREE.MeshStandardMaterial({color:0x8c8072,roughness:1,emissive:0x6b4931,emissiveIntensity:.35});
const trunkGeometry=new THREE.CylinderGeometry(.1,.17,1.1,6);
const crownGeometry=new THREE.ConeGeometry(.7,1.5,7);
const trunkMaterial=new THREE.MeshStandardMaterial({color:0x735035,roughness:1,emissive:0x735035,emissiveIntensity:.35});
const crownMaterial=new THREE.MeshStandardMaterial({color:0x427846,roughness:1,emissive:0x427846,emissiveIntensity:.35});
// Small spacesuited people tumble safely as part of the playful explosion effect.
const suitMaterial=new THREE.MeshStandardMaterial({color:0xe4e9ec,roughness:.75,emissive:0xb9c9dd,emissiveIntensity:.32});
const visorMaterial=new THREE.MeshStandardMaterial({color:0xe8af4c,metalness:.65,roughness:.25,emissive:0xa96c21,emissiveIntensity:.35});
const helmetGeometry=new THREE.SphereGeometry(.32,12,10),bodyGeometry=new THREE.BoxGeometry(.52,.68,.3),limbGeometry=new THREE.CylinderGeometry(.105,.12,.62,7),backpackGeometry=new THREE.BoxGeometry(.4,.5,.22);
function makeAstronaut(){
 const person=new THREE.Group();
 const torso=new THREE.Mesh(bodyGeometry,suitMaterial);torso.position.y=.2;person.add(torso);
 const helmet=new THREE.Mesh(helmetGeometry,suitMaterial);helmet.position.y=.87;person.add(helmet);
 const visor=new THREE.Mesh(new THREE.SphereGeometry(.265,12,8),visorMaterial);visor.scale.set(1,.75,.55);visor.position.set(0,.89,.23);person.add(visor);
 const backpack=new THREE.Mesh(backpackGeometry,suitMaterial);backpack.position.set(0,.25,-.25);person.add(backpack);
 for(const side of [-1,1]){
  const arm=new THREE.Mesh(limbGeometry,suitMaterial);arm.position.set(side*.43,.26,0);arm.rotation.z=side*.7;person.add(arm);
  const leg=new THREE.Mesh(limbGeometry,suitMaterial);leg.position.set(side*.17,-.43,0);leg.rotation.z=side*.22;person.add(leg);
 }
 return person;
}
const flyingFragments=[];
for(let i=0;i<150;i++){
 const person=i%5===0,tree=!person&&i%4===0;let mesh;
 if(person){mesh=makeAstronaut();}
 else if(tree){mesh=new THREE.Group();const trunk=new THREE.Mesh(trunkGeometry,trunkMaterial);const crown=new THREE.Mesh(crownGeometry,crownMaterial);trunk.position.y=-.3;crown.position.y=.7;mesh.add(trunk,crown);}
 else {mesh=new THREE.Mesh(rockGeometry,rockMaterial);mesh.scale.set(.5+random(),.4+random(),.5+random());}
 const size=person?1.6+random()*.6:tree?1+random()*.7:.6+random()*.8;mesh.scale.multiplyScalar(size);worldDebris.add(mesh);
 const direction=new THREE.Vector3(random()-.5,random()-.5,random()-.5).normalize();
 flyingFragments.push({mesh,source:i%objects.length,origin:new THREE.Vector3(),velocity:direction.multiplyScalar(5+random()*10),spin:new THREE.Vector3(random()-.5,random()-.5,random()-.5),initialScale:mesh.scale.clone()});
}
let savedOrbitVisibility=true;
function hideExplodedWorlds(){
 objects.forEach(o=>o.group.visible=false);orbitLines.forEach(o=>o.visible=false);orbitalTrails.forEach(o=>o.line.visible=false);belt.visible=false;labels.forEach(label=>label.style.display='none');
}
function beginWorldExplosion(){
 savedOrbitVisibility=orbitLines[0].visible;
 for(const fragment of flyingFragments){fragment.origin.copy(objects[fragment.source].group.position);fragment.mesh.position.copy(fragment.origin);fragment.mesh.scale.copy(fragment.initialScale);fragment.mesh.rotation.set(random()*6,random()*6,random()*6);}
 worldDebris.visible=true;hideExplodedWorlds();
 document.querySelectorAll('#planets button,#focus,#orbits').forEach(button=>button.disabled=true);
}
function restoreWorlds(){
 objects.forEach(o=>o.group.visible=true);worldDebris.visible=false;belt.visible=true;
 orbitLines.forEach(o=>o.visible=savedOrbitVisibility);orbitalTrails.forEach(o=>o.line.visible=savedOrbitVisibility);
 document.querySelectorAll('#planets button,#focus,#orbits').forEach(button=>button.disabled=false);
}
function updateWorldDebris(t,dt){
 hideExplodedWorlds();worldDebris.visible=t<18;
 for(const fragment of flyingFragments){
 fragment.mesh.position.copy(fragment.origin).addScaledVector(fragment.velocity,t*.65);
 if(!reducedExplosionMotion){fragment.mesh.rotation.x+=fragment.spin.x*dt*2;fragment.mesh.rotation.y+=fragment.spin.y*dt*2;fragment.mesh.rotation.z+=fragment.spin.z*dt*2;}
 fragment.mesh.scale.copy(fragment.initialScale).multiplyScalar(Math.max(0,1-Math.max(0,t-12)/6));
 }
}

let explosionAge=null;
function resetSun(){explosionAge=null;restoreWorlds();sunParts.forEach(o=>o.visible=true);explosionDebris.visible=shockwave.visible=explosionFlash.visible=false;light.intensity=4.2;explodeButton.textContent='Explode Sun';explodeButton.setAttribute('aria-pressed','false');explosionStatus.textContent='Sun restored.';}
explodeButton.onclick=()=>{
 if(explosionAge!==null){resetSun();return;}
 systemOverview();beginWorldExplosion();explosionAge=0;sunParts.forEach(o=>o.visible=false);explosionDebris.visible=true;shockwave.visible=true;explosionFlash.visible=!reducedExplosionMotion;
 explodeButton.textContent='Restore Sun';explodeButton.setAttribute('aria-pressed','true');explosionStatus.textContent='Planets destroyed. Astronauts, rocks and trees are flying through space. Press Restore Sun to reset.';
};
function updateExplosion(dt){
 if(explosionAge===null)return;explosionAge+=dt;const t=explosionAge;updateWorldDebris(t,dt);
 const travel=2.5+11*Math.log(1+t*.7);
 if(t<15){for(let i=0;i<explosionPositions.length;i++)explosionPositions[i]=explosionVelocities[i]*travel*.18;explosionGeometry.attributes.position.needsUpdate=true;}
 explosionDebris.material.opacity=Math.max(0,1-t/15);explosionDebris.material.size=Math.max(.12,1.2-t*.055);explosionDebris.visible=t<15;
 shockwave.scale.setScalar(5.6+t*13);shockwave.material.uniforms.strength.value=Math.max(0,.85-t*.11);shockwave.visible=t<8;
 explosionFlash.scale.setScalar(20+Math.min(t,2)*38);explosionFlash.material.opacity=reducedExplosionMotion?0:Math.max(0,1.1-t*.8);explosionFlash.visible=!reducedExplosionMotion&&t<1.4;
 light.intensity=t<1?4.2+Math.sin(t*Math.PI)*8:Math.max(.65,4.2-(t-1)*.8);
 if(t>=15)explosionStatus.textContent='Explosion complete. Press Restore Sun to bring it back.';
}
