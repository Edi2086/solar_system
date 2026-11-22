// A canvas-drawn cartoon visitor stands on Earth and cracks it by jumping.
const jumpButton=document.createElement('button');jumpButton.id='earth-jump';jumpButton.textContent='⬆ JUMP & CRACK EARTH';jumpButton.type='button';document.body.appendChild(jumpButton);
const jumperStyle=document.createElement('style');jumperStyle.textContent='#earth-jump{position:fixed;right:22px;bottom:176px;z-index:1000;max-width:calc(100vw - 24px);border:2px solid #c4ffaa;border-radius:12px;background:linear-gradient(135deg,#a3ef74,#40af91);color:#102b26;padding:16px 22px;font-size:15px;font-weight:bold;cursor:pointer;box-shadow:0 6px 25px #0008}#earth-jump:disabled{opacity:.65}@media(max-width:600px){#earth-jump{right:12px;bottom:150px;font-size:12px;padding:14px}}';jumperStyle.textContent+='body.planet-focused .galaxy-title{display:none}';document.head.appendChild(jumperStyle);
const portrait=document.createElement('canvas');portrait.width=768;portrait.height=960;const pc=portrait.getContext('2d');pc.scale(3,3);
function shadedOval(x,y,rx,ry,light,mid,dark){const g=pc.createRadialGradient(x-rx*.3,y-ry*.4,rx*.05,x,y,Math.max(rx,ry));g.addColorStop(0,light);g.addColorStop(.6,mid);g.addColorStop(1,dark);pc.fillStyle=g;pc.beginPath();pc.ellipse(x,y,rx,ry,0,0,Math.PI*2);pc.fill();}
function crease(points,color,width){pc.strokeStyle=color;pc.lineWidth=width;pc.lineCap='round';pc.beginPath();pc.moveTo(points[0],points[1]);for(let i=2;i<points.length;i+=4)pc.quadraticCurveTo(points[i],points[i+1],points[i+2],points[i+3]);pc.stroke();}
// A broad, rounded hoodie with soft light, fabric folds, and a much fuller belly.
shadedOval(128,222,123,88,'#fffef3','#dcdccf','#777d76');
shadedOval(30,213,24,55,'#edeee3','#c9cbbf','#777c75');shadedOval(226,213,24,55,'#edeee3','#c9cbbf','#777c75');
shadedOval(128,243,108,65,'#fffef2','#e4e4d8','#969d90');
crease([47,194,57,206,78,211],'#7b837765',2);crease([209,193,194,209,177,213],'#7b837765',2);crease([70,275,128,261,191,277],'#8c92845f',1.2);crease([88,285,130,278,168,285],'#ffffff80',2);crease([25,238,37,228,45,246],'#8a90825f',2);crease([211,246,222,230,231,240],'#8a90825f',2);
// Beard frames the jaw rather than appearing as a circle around the entire head.
shadedOval(128,134,61,61,'#a67a50','#795135','#443127');
shadedOval(128,99,61,62,'#ffebd6','#e6c3a8','#a77f6a');
// Cheeks blend into the face with a feathered blush and no hard outline.
for(const x of [87,169]){const g=pc.createRadialGradient(x,117,1,x,117,29);g.addColorStop(0,'#e6a2a080');g.addColorStop(.55,'#e9b3a350');g.addColorStop(1,'#e9b3a300');pc.fillStyle=g;pc.fillRect(x-31,86,62,62);}
shadedOval(103,96,12,9,'#fffdf1','#eee8dc','#bdab98');shadedOval(151,96,12,9,'#fffdf1','#eee8dc','#bdab98');
shadedOval(105,96,5,7,'#a5b7ba','#687c80','#263237');shadedOval(149,96,5,7,'#a5b7ba','#687c80','#263237');
pc.fillStyle='#1d2427';pc.beginPath();pc.ellipse(105,97,2.5,4,0,0,Math.PI*2);pc.ellipse(149,97,2.5,4,0,0,Math.PI*2);pc.fill();pc.fillStyle='white';pc.fillRect(103,93,2,2);pc.fillRect(147,93,2,2);
crease([92,81,105,77,116,84],'#765e4d',3);crease([139,84,152,77,165,81],'#765e4d',3);
shadedOval(128,115,10,18,'#f7d9c2','#d9aa91','#ab7867');shadedOval(128,128,10,6,'#f0c0ab','#d49a85','#a27261');
shadedOval(128,148,16,9,'#9e7464','#704a41','#3e302c');crease([119,147,128,143,137,147],'#d9ad98',2);
shadedOval(128,164,20,18,'#f3f0df','#d7d3c4','#aaa99c');
// Fine beard strands provide texture without a heavy cartoon border.
for(let i=0;i<190;i++){const x=75+(i*37%106),y=132+(i*19%48);if((x-128)**2/3200+(y-137)**2/3600>1||Math.abs(x-128)<24&&y<180)continue;crease([x,y,x-1,y+3,x+1,y+6],i%3?'#c19a6a45':'#35281d45',.6);}
// Cloth cap, padded headphone band, and metallic ear cups.
const cap=pc.createLinearGradient(0,22,0,76);cap.addColorStop(0,'#93958d');cap.addColorStop(.4,'#e7e7db');cap.addColorStop(1,'#bfc1b5');pc.fillStyle=cap;pc.beginPath();pc.moveTo(66,76);pc.bezierCurveTo(65,5,190,5,190,76);pc.quadraticCurveTo(128,47,66,76);pc.fill();crease([67,76,128,43,189,76],'#7c8077',2);
pc.strokeStyle='#363941';pc.lineWidth=9;pc.beginPath();pc.ellipse(128,75,67,61,0,Math.PI,Math.PI*2);pc.stroke();
for(const x of [62,194]){shadedOval(x,95,10,29,'#858b92','#4c505b','#272b32');crease([x-2,77,x-5,94,x-2,111],'#c9cdd54f',2);}
crease([109,174,111,188,104,197],'#8d9488',2);crease([147,174,145,188,152,197],'#8d9488',2);
shadedOval(86,308,25,9,'#777e85','#454d55','#232a32');shadedOval(170,308,25,9,'#777e85','#454d55','#232a32');
const visitorMap=new THREE.CanvasTexture(portrait),visitor=new THREE.Sprite(new THREE.SpriteMaterial({map:visitorMap,transparent:true,depthTest:true,toneMapped:false}));
const earthBody=objects[3],earthRadius=earthBody.data[2];visitor.scale.set(earthRadius*2.1,earthRadius*2.6,1);earthBody.group.add(visitor);
const cracks=new THREE.Group();earthBody.mesh.add(cracks);const crackMaterial=new THREE.LineBasicMaterial({color:0xff862e,transparent:true,opacity:.95,depthTest:true});let jumpAge=null,earthHits=0;
function addEarthCracks(){for(let branch=0;branch<10;branch++){const points=[];let angle=branch*Math.PI*.2,lat=Math.PI*.04;for(let k=0;k<22;k++){lat+=.065;angle+=Math.sin(k*3.7+branch*2.3+earthHits)*.12;points.push(new THREE.Vector3(Math.sin(lat)*Math.cos(angle),Math.cos(lat),Math.sin(lat)*Math.sin(angle)).multiplyScalar(1.012+earthHits*.002));}cracks.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),crackMaterial));}}
function clearEarthCracks(){while(cracks.children.length){const line=cracks.children[0];cracks.remove(line);line.geometry.dispose();}earthHits=0;}
jumpButton.onclick=()=>{if(jumpAge!==null)return;if(explosionAge!==null){cannonStatus.textContent='Restore the galaxy before jumping on Earth.';return;}if(destroyedPlanets.has(3)){repairButton.onclick();clearEarthCracks();}setCannon(false);select(3);focus();jumpAge=0;jumpButton.disabled=true;jumpButton.textContent='⬆ JUMPING…';};
function updateEarthJumper(dt){let height=0;if(jumpAge!==null){jumpAge+=dt;height=Math.sin(Math.min(1,jumpAge/.95)*Math.PI)*earthRadius*2.5;if(jumpAge>=.95){jumpAge=null;earthHits++;addEarthCracks();jumpButton.disabled=false;if(earthHits>=3){breakPlanet(3);jumpButton.textContent='🌍 REBUILD EARTH & JUMP';}else{jumpButton.textContent='⬆ JUMP AGAIN · '+earthHits+'/3 CRACKS';cannonStatus.textContent='Earth cracked! '+(3-earthHits)+' more landings to break it.';}}}visitor.position.set(0,earthRadius+earthRadius*1.24+height,0);visitor.visible=!destroyedPlanets.has(3)&&explosionAge===null;}
