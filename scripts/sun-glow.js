// A bright photosphere, a hot limb, and a broad, softly fading corona.
objects[0].mesh.material.color.setRGB(2.2,1.7,1.15);
const solarCorona=new THREE.Mesh(new THREE.SphereGeometry(5.62,96,64),new THREE.ShaderMaterial({
 uniforms:{},
 vertexShader:`varying vec3 viewNormal;varying vec3 viewPosition;void main(){vec4 p=modelViewMatrix*vec4(position,1.0);viewPosition=p.xyz;viewNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*p;}`,
 fragmentShader:`varying vec3 viewNormal;varying vec3 viewPosition;void main(){float rim=pow(1.0-abs(dot(normalize(viewNormal),normalize(-viewPosition))),3.0);gl_FragColor=vec4(vec3(1.0,0.58,0.16),rim*1.15);}`,
 transparent:true,blending:THREE.AdditiveBlending,depthWrite:false
}));scene.add(solarCorona);
const outerSolarGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:glow.material.map,color:0xffb35b,transparent:true,opacity:.58,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));outerSolarGlow.scale.set(66,66,1);scene.add(outerSolarGlow);
glow.material.opacity=1;glow.material.toneMapped=false;

// A white-gold rim around the solar disk, fading outward into warm light.
const solarRingCanvas=document.createElement('canvas');solarRingCanvas.width=solarRingCanvas.height=512;
const solarRingContext=solarRingCanvas.getContext('2d');
const solarRingGradient=solarRingContext.createRadialGradient(256,256,0,256,256,256);
for(const [stop,color] of [[0,'rgba(255,180,65,0)'],[.43,'rgba(255,180,65,0)'],[.455,'rgba(255,210,115,.15)'],[.475,'rgba(255,245,200,.9)'],[.49,'rgba(255,250,220,1)'],[.515,'rgba(255,203,90,.6)'],[.58,'rgba(255,155,35,.25)'],[.75,'rgba(255,120,20,.06)'],[1,'rgba(255,100,10,0)']])solarRingGradient.addColorStop(stop,color);
solarRingContext.fillStyle=solarRingGradient;solarRingContext.fillRect(0,0,512,512);
const solarLightRing=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(solarRingCanvas),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));
solarLightRing.scale.set(24,24,1);scene.add(solarLightRing);
