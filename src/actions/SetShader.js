import domready from 'domready';
import * as THREE from 'three';
import glslify from 'glslify';
import setupPostProcessing from './SetPostProcessing';

domready( () => {
  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha: true, canvas: document.getElementById("canvas") });
  renderer.setClearColor( 0x000000, 0 );

  renderer.setSize( window.innerWidth, window.innerHeight );
  //renderer.shadowMapEnabled = true;
  //renderer.shadowMapType = THREE.PCFSoftShadowMap;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  //document.body.appendChild( renderer.domElement );

  const post = setupPostProcessing(renderer, window.innerWidth, window.innerHeight);
  console.log(post.postMaterial)
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const itemMaterial = new THREE.MeshBasicMaterial( { color: "#433F81" } );
  const cube = new THREE.Mesh(geometry, itemMaterial);
  scene.add( cube );

  requestAnimationFrame(render);

  // Render Loop
  function render() {
    requestAnimationFrame(render);

    camera.position.z = 4;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Render the scene
    renderer.render(post.scene, post.camera, post.target);
    renderer.render(scene, camera);
  };

  //render();

  const onWindowResize = (ev) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }
  window.addEventListener('resize', onWindowResize );
})
