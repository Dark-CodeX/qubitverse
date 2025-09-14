import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const qubits = [
  { label: "|0⟩", theta: 0, phi: 0 },
  { label: "|1⟩", theta: Math.PI, phi: 0 },
  { label: "|+⟩", theta: Math.PI / 2, phi: 0 },
  { label: "|−⟩", theta: Math.PI / 2, phi: Math.PI },
  { label: "|i+⟩", theta: Math.PI / 2, phi: Math.PI / 2 },
  { label: "|i−⟩", theta: Math.PI / 2, phi: -Math.PI / 2 },
];

function BlochSphere() {
  const mountRef = useRef();
  const [selectedQubit, setSelectedQubit] = useState(qubits[0]);
  const [isRotated, setIsRotated] = useState(false);
  const arrowHelperRef = useRef();

  const createTextSprite = (
    message,
    { fontsize = 26, fontColor = "#222", fontWeight = "bold" } = {},
    scalefactor = 180
  ) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = `${fontWeight} ${fontsize}px Arial`;
    const textWidth = context.measureText(message).width;
    canvas.width = textWidth + 8;
    canvas.height = fontsize + 8;
    context.font = `${fontWeight} ${fontsize}px Arial`;
    context.fillStyle = fontColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(message, canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(
      canvas.width / scalefactor,
      canvas.height / scalefactor,
      1.0
    );
    return sprite;
  };

  function rotate(axis, angle) {
    let { theta, phi } = selectedQubit;
    const rad = (angle * Math.PI) / 180;

    // convert to cartesian
    let x = Math.sin(theta) * Math.cos(phi);
    let y = Math.sin(theta) * Math.sin(phi);
    let z = Math.cos(theta);

    // apply rotation
    if (axis === "x") {
      const yc = y * Math.cos(rad) - z * Math.sin(rad);
      const zc = y * Math.sin(rad) + z * Math.cos(rad);
      y = yc;
      z = zc;
    } else if (axis === "y") {
      const xc = x * Math.cos(rad) + z * Math.sin(rad);
      const zc = -x * Math.sin(rad) + z * Math.cos(rad);
      x = xc;
      z = zc;
    } else if (axis === "z") {
      const xc = x * Math.cos(rad) - y * Math.sin(rad);
      const yc = x * Math.sin(rad) + y * Math.cos(rad);
      x = xc;
      y = yc;
    }

    // normalize
    const r = Math.hypot(x, y, z) || 1;
    x /= r;
    y /= r;
    z /= r;

    // back to spherical
    const clamp = (v, lo = -1, hi = 1) => Math.min(hi, Math.max(lo, v));
    theta = Math.acos(clamp(z));
    const prevPhi = phi;
    phi = x * x + y * y < 1e-12 ? prevPhi : Math.atan2(y, x);
    const wrapPi = (a) => ((a + Math.PI) % (2 * Math.PI)) - Math.PI;
    phi = wrapPi(phi);

    setSelectedQubit({ ...selectedQubit, theta, phi });
    setIsRotated(true);
  }

  useEffect(() => {
    if (mountRef.current) mountRef.current.innerHTML = "";

    const width = 600;
    const height = 600;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 0);
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(2, -2.5, 2.7);
    camera.up.set(0, 0, 1); // Z is up
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.12;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true; // <-- Fixed here: zoom enabled
    controls.enablePan = false;

    // Sphere
    const sphereGeometry = new THREE.SphereGeometry(1, 60, 60);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      wireframe: true,
      opacity: 0.23,
      transparent: true,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Z axis: blue
    const zMat = new THREE.LineBasicMaterial({ color: "#228cff" });
    const zGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 1.3),
    ]);
    scene.add(new THREE.Line(zGeom, zMat));
    // X axis: red
    const xMat = new THREE.LineBasicMaterial({ color: "#ff4444" });
    const xGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1.3, 0, 0),
    ]);
    scene.add(new THREE.Line(xGeom, xMat));
    // Y axis: green
    const yMat = new THREE.LineBasicMaterial({ color: "#ff6f00" });
    const yGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 1.3, 0),
    ]);
    scene.add(new THREE.Line(yGeom, yMat));

    // Axis labels
    const labelZ = createTextSprite(
      "z",
      { fontsize: 30, fontColor: "#228cff", fontWeight: 700 },
      82
    );
    labelZ.position.set(0, 0, 1.47);
    scene.add(labelZ);

    const labelX = createTextSprite(
      "x",
      { fontsize: 30, fontColor: "#ff4444", fontWeight: 700 },
      82
    );
    labelX.position.set(1.45, 0, 0);
    scene.add(labelX);

    const labelY = createTextSprite(
      "y",
      { fontsize: 30, fontColor: "#ff6f00", fontWeight: 700 },
      82
    );
    labelY.position.set(0, 1.45, 0);
    scene.add(labelY);

    // |0⟩ and |1⟩
    const label0 = createTextSprite(
      "|0⟩",
      { fontsize: 21, fontColor: "#444", fontWeight: 900 },
      70
    );
    label0.position.set(0, 0, 1.15);
    scene.add(label0);

    const label1 = createTextSprite(
      "|1⟩",
      { fontsize: 21, fontColor: "#444", fontWeight: 900 },
      70
    );
    label1.position.set(0, 0, -1.15);
    scene.add(label1);

    // Arrow
    const dir = new THREE.Vector3(0, 0, 1);
    const origin = new THREE.Vector3(0, 0, 0);
    const length = 1.13;
    const hex = 0xff00ff;
    const arrowHelper = new THREE.ArrowHelper(
      dir,
      origin,
      length,
      hex,
      0.17,
      0.1
    );
    scene.add(arrowHelper);
    arrowHelperRef.current = arrowHelper;

    let animationId;
    function animate() {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      renderer.dispose();
      if (
        mountRef.current &&
        renderer.domElement.parentNode === mountRef.current
      )
        mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (arrowHelperRef.current) {
      const { theta, phi } = selectedQubit;
      const x = Math.sin(theta) * Math.cos(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(theta);
      arrowHelperRef.current.setDirection(
        new THREE.Vector3(x, y, z).normalize()
      );
    }
  }, [selectedQubit]);

  const selectedIndex = qubits.findIndex(
    (q) => q.label === selectedQubit.label
  );

  return (
    <div
      className="flex items-center gap-8 min-h-screen justify-center w-screen bg-[#fcfdff] p-0 overflow-hidden
    dark:bg-primary-darkbg
    "

      // style={{
      //   display: "flex",
      //   alignItems: "center",
      //   gap: "32px",
      //   minHeight: "100vh",
      //   justifyContent: "center",
      //   width: "100vw",
      //   background: "#fcfdff",
      //   padding: 0,
      //   overflow: "hidden",
      // }}
    >
      <div
        ref={mountRef}
        style={{ width: 600, height: 600, background: "transparent" }}
      ></div>
      <div
        className=" max-w-[360px] min-w-[320px] bg-[#f7faff] rounded-xl shadow-[0_8px_24px_rgba(0,18,60,0.08)] px-[18px] py-[30px] ml-0
        dark:bg-secondary-darkbg dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)] dark:rounded-xl
        "
        // style={{
        //   maxWidth: 360,
        //   minWidth: 320,
        //   background: "#f7faff",
        //   borderRadius: 16,
        //   boxShadow: "0 8px 24px rgba(0,18,60,0.08)",
        //   padding: "30px 18px 30px 18px",
        //   marginLeft: 0,
        // }}
      >
        <h2 className="font-extrabold text-[28px] mb-[14px] text-[#1a232b] tracking-[-1px] leading-[120%]
          dark:text-primary-dark-text-green
          dark:font-semibold
          dark:tracking-wider
        "
          // style={{
          //   fontWeight: 800,
          //   fontSize: 28,
          //   marginBottom: 14,
          //   color: "#1a232b",
          //   letterSpacing: "-1px",
          //   lineHeight: "120%",
          // }}
        >
          Bloch Sphere
          <br />
          Visualizer
        </h2>
        <div className=" text-xl font-semi-bold mb-[16px] text-[#202352] font-mono leading-[115%]
        dark:text-primary-dark-neon-violet
        "
          // style={{
          //   fontSize: 23,
          //   fontWeight: 700,
          //   marginBottom: 16,
          //   color: "#202352",
          //   fontFamily: "monospace",
          //   lineHeight: "115%",
          // }}
        >
          {selectedQubit.label}
          {isRotated ? " (rotated)" : ""}
        </div>
        <select
          className="  mb-[14px] text-[17px] px-[7px] py-[6px] w-full  border-[1.2px]  rounded-[7px] bg-white text-[#232347] font-bold min-h-[38px] box-border
          dark:bg-primary-darkbg 
          dark:border-1 
          dark:focus:ring-primary-dark-border-green
          dark:focus:outline-none
          dark:text-primary-dark-text-green
          "
          value={selectedIndex === -1 ? "Custom" : String(selectedIndex)}
          onChange={(e) => {
            if (e.target.value === "Custom") return;
            setSelectedQubit(qubits[Number(e.target.value)]);
            setIsRotated(false);
          }}
          // style={{
          //   marginBottom: 14,
          //   fontSize: 17,
          //   padding: "6px 7px",
          //   width: "100%",
          //   border: "1.2px solid #c1c9d5",
          //   borderRadius: 7,
          //   background: "#fff",
          //   color: "#232347",
          //   fontWeight: 700,
          //   minHeight: "38px",
          //   boxSizing: "border-box",
          // }}
        >
          {qubits.map((q, idx) => (
            <option key={q.label} value={idx} style={{ fontSize: 17 }}>
              {q.label}
            </option>
          ))}
          <option value="Custom">Custom</option>
        </select>
        <div className="mb-[18px] font-extrabold text-[17px] text-[#39409A]
        dark:text-primary-dark-button-green
        "
          // style={{
          //   marginBottom: "18px",
          //   fontWeight: 700,
          //   color: "#39409A",
          //   fontSize: "17px",
          // }}
        >
          Rotations around default axes:
        </div>
        {["x", "y", "z"].map((axis) => (
          <div
            style={{
              margin: "11px 0",
              display: "flex",
              alignItems: "center",
            }}
            key={axis}
          >
            <span className= {`min-w-[75px] inline-block uppercase font-bold tracking-wide text-[17px] mr-2
             ${axis === "x" ? "text-primary-dark-neon-red" : axis === "y" ? "text-primary-dark-neon-orange" : "text-primary-dark-neon-blue"}
             
             `}
              // style={{
              //   minWidth: 75,
              //   display: "inline-block",
              //   textTransform: "uppercase",
              //   fontWeight: 800,
              //   fontSize: 17,
              //   color:
              //     axis === "x"
              //       ? "#ff4444"
              //       : axis === "y"
              //       ? "#00c66a"
              //       : "#228cff",
              //   marginRight: 8,
              // }}
            >
              {axis} axis:
            </span>
            <div style={{ display: "flex", flexWrap: "nowrap", gap: 0 }}>
              {[90, -90, 180, -180].map((deg) => (
                <button
                  className={`mr-1 mb-0 px-3 py-[7px] rounded-[6px] border border-[1.2px] border-[#d8dde8] bg-[#eaf0fb] text-[#27304f] font-extrabold text-[15px] cursor-pointer shadow-[0_1px_2px_rgba(80,90,130,0.09)] transition-colors duration-120 ease-in-out
                  dark:bg-primary-darkbg 
                    ${axis === "x" ? "text-primary-dark-neon-red" : axis === "y" ? "text-primary-dark-neon-orange" : "text-primary-dark-neon-blue"}
                    ${axis === "x" ? "border-primary-dark-neon-red" : axis === "y" ? "border-primary-dark-neon-orange" : "border-primary-dark-neon-blue"}
                  
                    `}
                  key={deg}
                  onClick={() => rotate(axis, deg)}
                  // style={{
                  //   marginRight: 4,
                  //   marginBottom: 0,
                  //   padding: "7px 12px",
                  //   borderRadius: 6,
                  //   border: "1.2px solid #d8dde8",
                  //   background: "#eaf0fb",
                  //   color: "#27304f",
                  //   fontWeight: 700,
                  //   fontSize: 15,
                  //   cursor: "pointer",
                  //   boxShadow: "0 1px 2px rgba(80,90,130,0.09)",
                  //   transition: "background 0.12s, color 0.12s",
                  // }}
                >
                  {deg > 0 ? "+" : ""}
                  {deg}°
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlochSphere;
