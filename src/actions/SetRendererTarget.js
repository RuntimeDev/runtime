import * as THREE from 'three';

const createRenderTarget = (renderer, width, height) => {
    var rtWidth = width||2,
        rtHeight = height||2;

    var gl = renderer.getContext();
    var maxRenderTargetSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

    rtWidth = Math.min(rtWidth, maxRenderTargetSize);
    rtHeight = Math.min(rtHeight, maxRenderTargetSize);

    var renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        generateMipmaps: false
    });
    return renderTarget;
}

export default function SetRendererTarget(renderer, width, height) {
  return new createRenderTarget(renderer, width, height);
}
