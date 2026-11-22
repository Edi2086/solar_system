// Camera-mounted cannon: aim with the pointer, fire at a world, then repair it.
const destroyedPlanets=new Set();let cannonEnabled=false;
const cannonButton=document.querySelector('#toggle-cannon'),repairButton=document.querySelector('#repair-planets'),cannonStatus=document.querySelector('#cannon-status'),crosshair=document.querySelector('#cannon-crosshair');
const gun=new THREE.Group();gun.position.set(.44,-.34,-1.15);gun.scale.setScalar(.18);gun.visible=false;camera.add(gun);scene.add(camera);
const gunMetal=new THREE.MeshStandardMaterial({color:0xffcf39,metalness:.85,roughness:.33,emissive:0x263545,emissiveIntensity:.5});
const gunDark=new THREE.MeshStandardMaterial({color:0x168ca5,metalness:.7,roughness:.5,emissive:0x222c36,emissiveIntensity:.4});
const barrel=new THREE.Mesh(new THREE.CylinderGeometry(.23,.3,2.5,20),gunMetal);barrel.rotation.x=Math.PI/2;barrel.position.z=-.9;gun.add(barrel);
const muzzle=new THREE.Mesh(new THREE.TorusGeometry(.23,.065,8,24),gunMetal);muzzle.position.z=-2.17;gun.add(muzzle);
const bore=new THREE.Mesh(new THREE.CircleGeometry(.19,20),gunDark);bore.position.z=-2.18;gun.add(bore);
const housing=new THREE.Mesh(new THREE.BoxGeometry(.9,.7,1.2),gunDark);housing.position.z=.4;gun.add(housing);
const gunLamp=new THREE.PointLight(0xaccbff,2,3);gunLamp.position.set(0,.5,.7);gun.add(gunLamp);
const muzzleFlash=new THREE.Sprite(new THREE.SpriteMaterial({map:glow.material.map,color:0xffc075,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));muzzleFlash.scale.set(3,3,1);muzzleFlash.position.z=-2.3;muzzleFlash.visible=false;gun.add(muzzleFlash);
const shellGeometry=new THREE.SphereGeometry(.28,12,8),shellMaterial=new THREE.MeshBasicMaterial({color:0xffe529,transparent:true,opacity:.85,toneMapped:false});
// Toy water blaster with a blue reservoir and a bright yellow nozzle.
const reservoir=new THREE.Mesh(new THREE.SphereGeometry(.65,20,16),new THREE.MeshStandardMaterial({color:0x24c9e5,metalness:.2,roughness:.2,transparent:true,opacity:.8,emissive:0x086078,emissiveIntensity:.6}));reservoir.position.set(0,.6,.5);gun.add(reservoir);
const handle=new THREE.Mesh(new THREE.BoxGeometry(.35,.9,.4),gunMetal);handle.position.set(0,-.7,.7);handle.rotation.x=-.25;gun.add(handle);
const fragmentGeometry=new THREE.IcosahedronGeometry(1,1);
const shots=[],impactClouds=[];let muzzleTime=0,cannonCooldown=0,spraying=false,sprayX=innerWidth/2,sprayY=innerHeight/2;
const cannonRay=new THREE.Raycaster(),cannonPointer=new THREE.Vector2();
function setCannon(enabled){cannonEnabled=enabled;spraying=false;controls.enabled=!enabled;gun.visible=enabled;cannonButton.textContent=enabled?'💦 WATER CANNON: ON':'💦 DING-A-LING WATER CANNON';cannonButton.setAttribute('aria-pressed',enabled);crosshair.hidden=!enabled;document.body.classList.toggle('cannon-active',enabled);cannonStatus.textContent=enabled?'Hold down on the sky to spray yellow water. Aim at a planet to shatter it.':'Cannon disabled.';}
cannonButton.onclick=()=>setCannon(!cannonEnabled);
function breakPlanet(index){
 if(destroyedPlanets.has(index)||index===0)return;
 destroyedPlanets.add(index);const body=objects[index];body.group.visible=false;labels[index].style.display='none';
 const cloud=new THREE.Group(),fragments=[];cloud.position.copy(body.group.position);scene.add(cloud);
 const material=new THREE.MeshStandardMaterial({color:body.data[5],map:textures[body.data[1]],roughness:.95,emissive:body.data[5],emissiveIntensity:.16});
 for(let j=0;j<52;j++){
  const shard=new THREE.Mesh(fragmentGeometry,material);shard.scale.set(.12+random()*.32,.1+random()*.5,.12+random()*.32).multiplyScalar(body.data[2]);
  const direction=new THREE.Vector3(random()-.5,random()-.5,random()-.5).normalize();shard.position.copy(direction).multiplyScalar(body.data[2]*.7);shard.rotation.set(random()*6,random()*6,random()*6);cloud.add(shard);
  fragments.push({mesh:shard,velocity:direction.multiplyScalar(2+random()*6),spin:new THREE.Vector3(random()-.5,random()-.5,random()-.5),size:shard.scale.clone()});
 }
 const flash=new THREE.Sprite(new THREE.SpriteMaterial({map:glow.material.map,color:0xffac5c,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));cloud.add(flash);flash.scale.setScalar(body.data[2]*8);
 impactClouds.push({cloud,fragments,material,flash,age:0});repairButton.hidden=false;
 cannonStatus.textContent=body.data[0]+' shattered into rocky fragments. Use Repair planets to restore it.';
}
function shootCannon(x,y){
 if(!cannonEnabled||explosionAge!==null||cannonCooldown>0||shots.length>=90)return;
 const bounds=renderer.domElement.getBoundingClientRect();cannonPointer.set((x-bounds.left)/bounds.width*2-1,-(y-bounds.top)/bounds.height*2+1);scene.updateMatrixWorld(true);cannonRay.setFromCamera(cannonPointer,camera);
 const targets=objects.slice(1).filter((o,i)=>!destroyedPlanets.has(i+1)).map(o=>o.mesh);
 const hit=cannonRay.intersectObjects(targets,false)[0];
 const target=hit?objects.findIndex(o=>o.mesh===hit.object):-1;
 const destination=cannonRay.ray.at(350,new THREE.Vector3());
 const projectile=new THREE.Mesh(shellGeometry,shellMaterial);gun.updateWorldMatrix(true,false);projectile.position.copy(gun.localToWorld(new THREE.Vector3(0,0,-2.3)));scene.add(projectile);
 const glowTrail=new THREE.Sprite(new THREE.SpriteMaterial({map:glow.material.map,color:0xffb34e,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));glowTrail.scale.set(2,2,1);projectile.add(glowTrail);
 for(let drop=1;drop<=20;drop++){const droplet=new THREE.Mesh(shellGeometry,shellMaterial);droplet.position.set(Math.sin(drop*2)*.16,Math.cos(drop*3)*.16,drop*.48);droplet.scale.setScalar(1-drop*.035);projectile.add(droplet);}
 projectile.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,-1),cannonRay.ray.direction);shots.push({mesh:projectile,target,destination,age:0});cannonCooldown=.065;muzzleTime=.09;cannonStatus.textContent=target>=0?'Yellow water spraying at '+data[target][0]+'.':'Yellow water spraying! Aim at a planet to destroy it.';
}
renderer.domElement.addEventListener('pointerdown',e=>{if(!cannonEnabled||e.button>0)return;spraying=true;sprayX=e.clientX;sprayY=e.clientY;shootCannon(sprayX,sprayY);},true);
renderer.domElement.addEventListener('pointermove',e=>{sprayX=e.clientX;sprayY=e.clientY;crosshair.style.left=e.clientX+'px';crosshair.style.top=e.clientY+'px';});
window.addEventListener('pointerup',()=>{spraying=false;});
window.addEventListener('pointercancel',()=>{spraying=false;});
window.addEventListener('blur',()=>{spraying=false;});
renderer.domElement.addEventListener('pointerup',e=>{if(cannonEnabled)e.stopImmediatePropagation();},true);
function removeShot(i){const shot=shots[i];shot.mesh.children[0].material.dispose();scene.remove(shot.mesh);shots.splice(i,1);}
function removeImpact(i){const effect=impactClouds[i];scene.remove(effect.cloud);effect.material.dispose();effect.flash.material.dispose();impactClouds.splice(i,1);}
repairButton.onclick=()=>{
 if(explosionAge!==null){cannonStatus.textContent='Restore the Sun first, then repair the planets.';return;}
 const showOrbits=document.querySelector('#orbits').getAttribute('aria-pressed')==='true';destroyedPlanets.forEach(index=>{orbitLines[index-1].visible=showOrbits;orbitalTrails[index-1].line.visible=showOrbits;});destroyedPlanets.clear();objects.slice(1).forEach(o=>o.group.visible=true);while(shots.length)removeShot(shots.length-1);while(impactClouds.length)removeImpact(impactClouds.length-1);repairButton.hidden=true;cannonStatus.textContent='All planets repaired.';
};
function updateCannon(dt){
 cannonCooldown=Math.max(0,cannonCooldown-dt);if(spraying&&cannonEnabled)shootCannon(sprayX,sprayY);muzzleTime=Math.max(0,muzzleTime-dt);gun.position.z=-1.15+Math.max(0,muzzleTime)*.5;muzzleFlash.visible=muzzleTime>0&&!reducedExplosionMotion&&explosionAge===null;
 for(let i=shots.length-1;i>=0;i--){const shot=shots[i];shot.age+=dt;
  if(explosionAge!==null||destroyedPlanets.has(shot.target)||shot.age>12){removeShot(i);continue;}
  const target=shot.target>=0?objects[shot.target]:null,delta=(target?target.group.position:shot.destination).clone().sub(shot.mesh.position),step=140*dt;
  if(delta.length()<=step+(target?target.data[2]:0)){if(target)breakPlanet(shot.target);removeShot(i);}else {shot.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,-1),delta.clone().normalize());shot.mesh.position.addScaledVector(delta.normalize(),step);}
 }
 for(let i=impactClouds.length-1;i>=0;i--){const effect=impactClouds[i];effect.age+=dt;const t=effect.age;
  if(t>9){removeImpact(i);continue;}
  for(const shard of effect.fragments){shard.mesh.position.addScaledVector(shard.velocity,dt);if(!reducedExplosionMotion){shard.mesh.rotation.x+=shard.spin.x*dt*3;shard.mesh.rotation.z+=shard.spin.z*dt*3;}shard.mesh.scale.copy(shard.size).multiplyScalar(Math.max(0,1-Math.max(0,t-5)/4));}
  effect.flash.material.opacity=reducedExplosionMotion?0:Math.max(0,1-t*2);effect.flash.scale.multiplyScalar(1+dt);
 }
 destroyedPlanets.forEach(index=>{objects[index].group.visible=false;labels[index].style.display='none';orbitalTrails[index-1].line.visible=false;orbitLines[index-1].visible=false;});
}
