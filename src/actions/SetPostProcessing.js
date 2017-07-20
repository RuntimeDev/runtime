import * as THREE from 'three';
import SetRendererTarget from './SetRendererTarget';

/*const lensShader = require('../shaders/lens.js');
const fxaaShader = require('../shaders/fxaa.js');
console.log(lensShader);*/

const createPostProcessing = (renderer, width, height) => {
  var renderTarget = SetRendererTarget(renderer, width, height);
  var renderTarget2 = SetRendererTarget(renderer, width, height);

  var fxaaMaterial = new THREE.ShaderMaterial({
    uniforms: {
      texture: {type:'t', value: renderTarget},
      resolution: {type:'v2', value: new THREE.Vector2(width, height)}
    },
    //vertexShader: fxaaShader.vertex,
    //fragmentShader: fxaaShader.fragment
    vertexShader: document.getElementById('vertexShaderFxaa').innerHTML,
    fragmentShader: document.getElementById('fragmentShaderFxaa').innerHTML
  });

  var postMaterial = new THREE.ShaderMaterial({
    uniforms: {
      //lens distortion
      resolution: {type: 'v2', value: new THREE.Vector2(width, height)},
      k: {type: 'f', value: 0.05},
      kcube: { type: 'f', value: 0.1},
      scale: { type: 'f', value: 0.9},
      dispersion: {type:'f', value:0.01},
      blurAmount: {type: 'f', value: 1.0},
      blurEnabled: {type:'i', value: 1},

      //film grain..
      grainamount: {type: 'f', value: 0.03},
      colored: {type: 'i', value: 0},
      coloramount: {type: 'f', value:0.6},
      grainsize: {type:'f', value:1.9},
      lumamount: {type: 'f', value:1.0},
      timer: {type: 'f', value: 0.0},

      //film dust, scratches, burn
      scratches: {type: 'f', value: 0.1},
      burn: {type: 'f', value: 0.3},
    },
    //vertexShader: lensShader.vertex,
    //fragmentShader: lensShader.fragment
    vertexShader: document.getElementById('vertexShader').innerHTML,
    fragmentShader: document.getElementById('fragmentShader').innerHTML
  });

  var postQuad = new THREE.Mesh(new THREE.PlaneGeometry( 2, 2 ), postMaterial);

  var postCamera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
  postCamera.updateProjectionMatrix();

  var postScene = new THREE.Scene();
  postScene.add(postQuad);

  return {
    camera: postCamera,
    scene: postScene,
    quad: postQuad,
    postMaterial: postMaterial,
    fxaaMaterial: fxaaMaterial,
    target: renderTarget,
    target2: renderTarget2,
    resize: function(width, height) {
      this.target = this.target.clone();
      this.target2 = this.target2.clone();

      this.target.width = width;
      this.target.height = height;
      this.target2.width = width;
      this.target2.height = height;

      this.postMaterial.uniforms.texture.value = this.target2;
      this.fxaaMaterial.uniforms.texture.value = this.target;
    }
  }
}

export default function setupPostProcessing(renderer, width, height) {
  return new createPostProcessing(renderer, width, height);
}
