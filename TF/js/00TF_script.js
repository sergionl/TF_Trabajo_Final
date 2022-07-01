"use strict";

import * as cg from "./cg.js";
import * as m4 from "./glmjs/mat4.js";
import * as twgl from "./twgl-full.module.js";

function colission(a, b) {
    //console.log("prueba");
    //console.log(a);
    let cont = 0
    //console.log(posA);
    for (let i = 0; i < 3; i++) {
      var posA = a[i];
      var posB = b[i];
      if (posA - posB < 1 && posA - posB > -1) {
        cont++;
          //return true;
      }
    }
    if (cont == 3) {
      return true;
    }

    return false

}


async function main() {
  const gl = document.querySelector("#canvitas").getContext("webgl2");
  if (!gl) return undefined !== console.log("WebGL 2.0 not supported");

  twgl.setDefaults({ attribPrefix: "a_" });

  let vertSrc = await fetch("glsl/13-01.vert").then((r) => r.text());
  let fragSrc = await fetch("glsl/13-01.frag").then((r) => r.text());
  const meshProgramInfo = twgl.createProgramInfo(gl, [vertSrc, fragSrc]);
  const cubex = await cg.loadObj(
    "models/crate/crate.obj",
    gl,
    meshProgramInfo,
  );
  

  const cam = new cg.Cam([0, -5, 25]);
  const rotationAxis = new Float32Array([0, 1, 0]);

  var cx = cam.pos[0];
  var cy = cam.pos[1]; 
  var cz = cam.pos[2];

  let aspect = 1;
  let deltaTime = 0;
  let lastTime = 0;
  let theta = 0;


  var numObjs = 15; //numero de objetos que se mueven
  //para creacion del terreno en este caso 225 x 225
  var numObjsXPos = 225;
  var numObjsZPos = 225;
  var numObjsXNeg =-225;
  var numObjsZNeg =-225;

  //poner la lista de instancias, cada vez que se crea una nueva instancia 
  //se agrega a la lista usando append en una función aparte


  const positions = new Array(numObjs);
  const delta = new Array(numObjs);
  const deltaG = -9.81;
  const rndb = (a, b) => Math.random() * (b - a) + a;
  for (let i = 0; i < numObjs; i++) {
    positions[i] = [
      rndb(-13.0, 13.0),
      rndb(6.0, 12.0),
      rndb(-13.0, 13.0),
    ];
    delta[i] = [rndb(-1.1, 1.1), 0.0, rndb(-1.1, 1.1)];
  }
  
  const numInstancesInit = numObjsXPos*numObjsZPos;
  console.log(numInstancesInit);
	//const transforms = new Float32Array(numInstances * 16);
	//const infoInstances = new Array(numInstances);
  let contadorAux = 0;
  const scale = new Float32Array([0.25, 0.25, 0.25]);

  const positionsFloor = new Array(numInstancesInit);
  for (let i = numObjsXNeg; i < numObjsXPos; i += 2) {
    for (let j = numObjsZNeg; j < numObjsZPos; j += 2) {
      positionsFloor[contadorAux] = [i, -15.5, j];
      contadorAux++;
    }
  }

  let numInstances = positionsFloor.length;
  const transforms = new Float32Array(numInstances * 16);
  for (let i = 0; i < numInstances; i++) {
    const transform = m4.create(); // identity matrix
    m4.translate(transform, transform, positionsFloor[i]);
    //m4.scale(transform, transform, scale);
    for (let j = 0; j < 16; j++) transforms[i * 16 + j] = transform[j];
  }
  

 

  vertSrc = await fetch("glsl/13-02.vert").then((r) => r.text());
	fragSrc = await fetch("glsl/13-02.frag").then((r) => r.text());
	const floorProgramInfo = twgl.createProgramInfo(gl, [vertSrc, fragSrc]);

  const floor = await cg.loadObj(
    "models/Sci-fi_Box_obj/Sci-fi Box.obj",
    gl,
    floorProgramInfo,
    transforms,
  );


  const uniforms = {
    u_world: m4.create(),
    u_projection: m4.create(),
    u_view: cam.viewM4,
  };
  const fragUniforms = {
    u_lightColor: new Float32Array([1.0, 1.0, 1.0]),
    u_lightPosition: new Float32Array([0.0, 0.0, 0.0]),
    u_viewPosition: cam.pos,
  };

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  function render(elapsedTime) {
    elapsedTime *= 1e-3;
    deltaTime = elapsedTime - lastTime;
    lastTime = elapsedTime;

    if (twgl.resizeCanvasToDisplaySize(gl.canvas)) {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      aspect = gl.canvas.width / gl.canvas.height;
    }
    gl.clearColor(0.1, 0.1, 0.1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta = elapsedTime;

    m4.identity(uniforms.u_projection);
    m4.perspective(uniforms.u_projection, cam.zoom, aspect, 0.1, 100);

    gl.useProgram(meshProgramInfo.program);

    m4.identity(uniforms.u_world);
    m4.translate(
      uniforms.u_world,
      uniforms.u_world,
      fragUniforms.u_lightPosition,
    );

    
    twgl.setUniforms(meshProgramInfo, uniforms);
    twgl.setUniforms(meshProgramInfo, fragUniforms);

    for (let i = 0; i < numObjs; i++) {
      m4.identity(uniforms.u_world);
      m4.translate(uniforms.u_world, uniforms.u_world, positions[i]);
      m4.rotate(uniforms.u_world, uniforms.u_world, theta, rotationAxis);
      twgl.setUniforms(meshProgramInfo, uniforms);

      twgl.setUniforms(meshProgramInfo, fragUniforms);

      for (const { bufferInfo, vao, material } of cubex) {
        gl.bindVertexArray(vao);
        twgl.setUniforms(meshProgramInfo, {}, material);
        twgl.drawBufferInfo(gl, bufferInfo);
      }

      // Update position
      for (let j = 0; j < 3; j++) {
        positions[i][j] += delta[i][j] * deltaTime;
        if (positions[i][j] > 13.0) {
          positions[i][j] = 13.0;
          delta[i][j] = -delta[i][j];
        } else if (positions[i][j] < -13.0) {
          positions[i][j] = -13.0;
          delta[i][j] = -delta[i][j];
        }
      }
      delta[i][1] += deltaG * deltaTime;
    }
    //llamar colision
    for (let i = 0; i < numObjs; i++) {
      for (let j = i + 1; j < numObjs; j++) {
        
          if(colission(positions[i], positions[j])){
            for(let k = 0; k < 3; k++){
            delta[i][k] = -delta[i][k];
            delta[j][k] = -delta[j][k];
          }
          }
    //    
        }
      }
    
    //base
    gl.useProgram(floorProgramInfo.program);
    m4.identity(uniforms.u_world);

    twgl.setUniforms(floorProgramInfo, uniforms);
		twgl.setUniforms(floorProgramInfo, fragUniforms);
		for (const { bufferInfo, vertexArrayInfo, vao, material } of floor) {
			gl.bindVertexArray(vao);
			gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.a_transform.buffer);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, transforms);
			twgl.setUniforms(floorProgramInfo, {}, material);
			twgl.drawBufferInfo(
				gl,
				vertexArrayInfo,
				gl.TRIANGLES,
				vertexArrayInfo.numElements,
				0,
				numInstances,
			);
		}



    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  document.addEventListener("keydown", (e) => {
    /**/ if (e.key === "w") {
      cam.processKeyboard(cg.FORWARD, deltaTime);
      numObjsZPos++;
    }
    else if (e.key === "a") {
      cam.processKeyboard(cg.LEFT, deltaTime);
      numObjsXNeg--;
    }
    else if (e.key === "s") {
      cam.processKeyboard(cg.BACKWARD, deltaTime);
      numObjsZNeg--;
    }
    else if (e.key === "d") {
      cam.processKeyboard(cg.RIGHT, deltaTime);
      numObjsXPos++;
    }



  });
  document.addEventListener("mousemove", (e) => cam.movePov(e.x, e.y));
  document.addEventListener("mousedown", (e) => cam.startMove(e.x, e.y));
  document.addEventListener("mouseup", () => cam.stopMove());
  document.addEventListener("wheel", (e) => cam.processScroll(e.deltaY));
}

main();
