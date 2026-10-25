// Earth layers share its axial tilt and rotation; city lights fade at the terminator.
const cloudTexture=loader.load(TEXTURES.earth_clouds);
const clouds=new THREE.Mesh(new THREE.SphereGeometry(1.009,80,48),new THREE.MeshStandardMaterial({color:0xffffff,alphaMap:cloudTexture,transparent:true,opacity:.53,depthWrite:false,roughness:1}));
objects[3].mesh.add(clouds);
const cityTexture=loader.load(TEXTURES.earth_nightmap);cityTexture.colorSpace=THREE.SRGBColorSpace;
const cities=new THREE.Mesh(new THREE.SphereGeometry(1.002,80,48),new THREE.ShaderMaterial({uniforms:{cityMap:{value:cityTexture}},vertexShader:`varying vec2 vUv;varying vec3 wNormal;varying vec3 wPosition;void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.0);wPosition=w.xyz;wNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`,fragmentShader:`uniform sampler2D cityMap;varying vec2 vUv;varying vec3 wNormal;varying vec3 wPosition;void main(){float daylight=dot(normalize(wNormal),normalize(-wPosition));float night=1.0-smoothstep(-0.18,0.12,daylight);vec3 city=texture2D(cityMap,vUv).rgb;float mask=smoothstep(0.12,0.6,max(city.r,max(city.g,city.b)));gl_FragColor=vec4(city*vec3(1.0,0.8,0.52)*0.85,mask*night*0.85);}`,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));objects[3].mesh.add(cities);
for(const i of [1,4]){objects[i].mesh.material.bumpMap=textures[data[i][1]];objects[i].mesh.material.bumpScale=.006;}
objects[3].mesh.material.roughness=.7;
// Thin, sunlit atmospheric scattering in world coordinates.
function realisticAtmosphere(index,color,thickness,strength){
 const body=objects[index];
 const previous=body.group.children.find(o=>o.material?.isShaderMaterial);
 if(previous){body.group.remove(previous);previous.material.dispose();}
 const material=new THREE.ShaderMaterial({
  uniforms:{tint:{value:new THREE.Color(color)},strength:{value:strength}},
  vertexShader:`varying vec3 worldN;varying vec3 worldP;void main(){vec4 w=modelMatrix*vec4(position,1.0);worldP=w.xyz;worldN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`,
  fragmentShader:`uniform vec3 tint;uniform float strength;varying vec3 worldN;varying vec3 worldP;void main(){vec3 n=normalize(worldN);vec3 view=normalize(cameraPosition-worldP);vec3 sun=normalize(-worldP);float limb=pow(1.0-abs(dot(n,view)),3.8);float daylight=smoothstep(-0.25,0.5,dot(n,sun));float scatter=limb*daylight*strength;vec3 dusk=mix(vec3(0.9,0.35,0.13),tint,smoothstep(-0.03,0.3,dot(n,sun)));gl_FragColor=vec4(dusk,scatter);}`,
  transparent:true,depthWrite:false,blending:THREE.AdditiveBlending
 });
 const shell=new THREE.Mesh(new THREE.SphereGeometry(1,96,64),material);
 shell.scale.setScalar(body.data[2]*(1+thickness));body.group.add(shell);
}
realisticAtmosphere(3,0x63aaff,.025,.65);
realisticAtmosphere(2,0xe4ce9e,.018,.26);
realisticAtmosphere(4,0xc8987b,.012,.12);
realisticAtmosphere(5,0xc6b59d,.012,.15);
realisticAtmosphere(6,0xd5c5a0,.012,.15);
realisticAtmosphere(7,0x9bdce2,.02,.28);
realisticAtmosphere(8,0x5988ed,.02,.3);
// Preserve a gentle ocean highlight while keeping land matte.
objects[3].mesh.material.onBeforeCompile=shader=>{
 shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
 vec3 surfaceColor=texture2D(map,vMapUv).rgb;
 float ocean=smoothstep(0.015,0.12,surfaceColor.b-max(surfaceColor.r,surfaceColor.g));
 roughnessFactor=mix(0.92,0.38,ocean);`);
};
$('#kind').textContent=data[selected][6];
