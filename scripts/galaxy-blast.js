// Fictional galaxy-destruction visual, with a complete reset.
const nuclearButton=document.querySelector('#nuclear-bomb'),galaxyMessage=document.querySelector('#galaxy-message');
const galaxyStars=scene.children.filter(node=>node.isPoints&&(node.geometry===sg||node.geometry===brightGeometry));
const galaxyStarState=galaxyStars.map(node=>({node,opacity:node.material.opacity}));
// A cinematic flyover and gravity-driven drop precede the fictional blast.
const deliveryPlane=new THREE.Group(),fallingBomb=new THREE.Group();scene.add(deliveryPlane,fallingBomb);deliveryPlane.visible=fallingBomb.visible=false;
const aircraftMetal=new THREE.MeshStandardMaterial({color:0x89939e,metalness:.8,roughness:.35,emissive:0x536170,emissiveIntensity:.35});
const aircraftDark=new THREE.MeshStandardMaterial({color:0x1a2735,metalness:.65,roughness:.3,emissive:0x334a65,emissiveIntensity:.3});
const fuselage=new THREE.Mesh(new THREE.CylinderGeometry(.6,.85,10,20),aircraftMetal);fuselage.rotation.z=-Math.PI/2;deliveryPlane.add(fuselage);
const nose=new THREE.Mesh(new THREE.SphereGeometry(.7,16,12),aircraftMetal);nose.scale.set(1.7,1,1);nose.position.x=5;deliveryPlane.add(nose);
const cockpit=new THREE.Mesh(new THREE.SphereGeometry(.65,16,12),aircraftDark);cockpit.scale.set(1.7,.6,.8);cockpit.position.set(3.4,.55,0);deliveryPlane.add(cockpit);
for(const side of [-1,1]){
 const wing=new THREE.Mesh(new THREE.BoxGeometry(3.3,.15,6.5),aircraftMetal);wing.position.set(-.6,0,side*3.1);wing.rotation.y=side*.2;deliveryPlane.add(wing);
 const tail=new THREE.Mesh(new THREE.BoxGeometry(2,.15,2.7),aircraftMetal);tail.position.set(-4,.35,side*1.4);deliveryPlane.add(tail);
 const engine=new THREE.Mesh(new THREE.CylinderGeometry(.35,.4,2.6,12),aircraftDark);engine.rotation.z=Math.PI/2;engine.position.set(0,-.45,side*2.6);deliveryPlane.add(engine);
}
const fin=new THREE.Mesh(new THREE.BoxGeometry(2.2,2,.15),aircraftMetal);fin.position.set(-4,1,0);deliveryPlane.add(fin);
const bombBody=new THREE.Mesh(new THREE.SphereGeometry(.65,16,12),aircraftDark);bombBody.scale.set(.7,1.8,.7);fallingBomb.add(bombBody);
for(let i=0;i<4;i++){const fin=new THREE.Mesh(new THREE.BoxGeometry(.12,.8,1.3),aircraftMetal);fin.rotation.y=i*Math.PI/2;fin.position.y=.8;fallingBomb.add(fin);}
// Swept metallic wings, four jet engines, and glowing exhausts.
const sweptWingShape=new THREE.Shape();sweptWingShape.moveTo(2,0);sweptWingShape.lineTo(-4,10);sweptWingShape.lineTo(-6,10);sweptWingShape.lineTo(-3,0);sweptWingShape.lineTo(-6,-10);sweptWingShape.lineTo(-4,-10);sweptWingShape.closePath();
const sweptWing=new THREE.Mesh(new THREE.ExtrudeGeometry(sweptWingShape,{depth:.15,bevelEnabled:false}),aircraftMetal);sweptWing.rotation.x=Math.PI/2;deliveryPlane.add(sweptWing);
for(const side of [-1,1])for(const span of [3,5.5]){
 const jet=new THREE.Mesh(new THREE.CylinderGeometry(.42,.5,3,16),aircraftDark);jet.rotation.z=Math.PI/2;jet.position.set(-2,-.7,side*span);deliveryPlane.add(jet);
 const exhaust=new THREE.Mesh(new THREE.ConeGeometry(.32,2.8,16),new THREE.MeshBasicMaterial({color:0x66cfff,transparent:true,opacity:.8}));exhaust.rotation.z=Math.PI/2;exhaust.position.set(-4.6,-.7,side*span);deliveryPlane.add(exhaust);
}
const bombBand=new THREE.Mesh(new THREE.CylinderGeometry(.47,.47,.22,24),new THREE.MeshStandardMaterial({color:0xe8bd49,metalness:.55,roughness:.35}));bombBand.position.y=-.25;fallingBomb.add(bombBand);
const bombCasing=new THREE.MeshStandardMaterial({color:0x737956,metalness:.7,roughness:.3});bombBody.material=bombCasing;
deliveryPlane.scale.setScalar(1.7);fallingBomb.scale.setScalar(1.7);
let deliveryAge=null;
function startDelivery(){deliveryAge=0;systemOverview();transition={target:new THREE.Vector3(0,8,0),position:new THREE.Vector3(0,65,100)};deliveryPlane.position.set(-54,26,0);deliveryPlane.visible=true;fallingBomb.visible=false;galaxyMessage.textContent='AIRCRAFT INBOUND';}
function updateDelivery(dt){
 if(deliveryAge===null)return false;
 deliveryAge+=dt;const t=deliveryAge;deliveryPlane.position.set(-54+t*30,26+Math.sin(t*2)*.15,0);deliveryPlane.rotation.x=Math.sin(t)*.025;
 if(t>=1.8){const fall=t-1.8;fallingBomb.visible=true;fallingBomb.position.set(fall*2,25-4.8*fall*fall,0);fallingBomb.rotation.z=-fall*.08;galaxyMessage.textContent='BOMB RELEASED';}
 if(t>=4.1){deliveryAge=null;deliveryPlane.visible=fallingBomb.visible=false;explodeButton.onclick();galaxyBlastAge=0;galaxyMessage.textContent='GALAXY BLAST';return false;}
 return true;
}

let galaxyBlastAge=null;
function restoreGalaxy(){
 galaxyBlastAge=null;deliveryAge=null;deliveryPlane.visible=fallingBomb.visible=false;resetSun();repairButton.onclick();deepSky.visible=true;
 galaxyStarState.forEach(({node,opacity})=>{node.visible=true;node.material.opacity=opacity});
 nuclearButton.textContent='☢ NUKE THE GALAXY';nuclearButton.setAttribute('aria-pressed','false');explodeButton.disabled=false;cannonButton.disabled=false;galaxyMessage.hidden=true;
}
nuclearButton.onclick=()=>{
 if(galaxyBlastAge!==null||deliveryAge!==null){restoreGalaxy();return;}
 if(explosionAge!==null)resetSun();
 repairButton.onclick();setCannon(false);startDelivery();
 nuclearButton.textContent='Restore Galaxy';nuclearButton.setAttribute('aria-pressed','true');explodeButton.disabled=true;cannonButton.disabled=true;
 galaxyMessage.hidden=false;galaxyMessage.textContent='AIRCRAFT INBOUND';galaxyMessage.classList.remove('aftermath');
 explosionStatus.textContent='Fictional galaxy blast launched. Restore Galaxy brings everything back.';
};
function updateGalaxyBlast(dt){
 if(updateDelivery(dt))return;
 if(galaxyBlastAge===null)return;galaxyBlastAge+=dt;const t=galaxyBlastAge;
 const fade=Math.max(0,1-Math.max(0,t-1)/3);
 galaxyStarState.forEach(({node,opacity})=>{node.material.opacity=opacity*fade;node.visible=t<4;});
 deepSky.visible=t<2.5;
 if(t<5){shockwave.visible=true;shockwave.scale.setScalar(6+t*155);shockwave.material.uniforms.strength.value=Math.max(0,1-t/5);}
 if(!reducedExplosionMotion&&t<2){explosionFlash.visible=true;explosionFlash.scale.setScalar(35+t*90);explosionFlash.material.opacity=Math.max(0,.85-t*.45);}
 if(t>=5){shockwave.visible=false;explosionFlash.visible=false;explosionDebris.visible=false;worldDebris.visible=false;light.intensity=0;galaxyMessage.classList.add('aftermath');galaxyMessage.textContent='GALAXY DESTROYED';}
}
