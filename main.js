import * as THREE from "three";
import { OrbitControls } from "./controls/OrbitControls";

let scene, camera, renderer, pointLight, controls;

window.addEventListener("load", init);

function init() {
  // シーン
  scene = new THREE.Scene();

  // カメラ
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000); // (視野角, アスペクト比, 開始距離, 終了距離)
  camera.position.set(0, 0, 500);

  // レンダラー（ブラウザ）
  renderer = new THREE.WebGLRenderer({ alpha: true });
  document.body.appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 画像の解像度をデバイスごとに合わせる
  renderer.setPixelRatio(window.devicePixelRatio);

  // テキスチャー
  let textures = new THREE.TextureLoader().load("./textures/earth.jpg");

  // ジオメトリ, マテリアルを使ってメッシュ化 → シーンに追加
  let ballGeometry = new THREE.SphereGeometry(100, 64, 32); // (半径, ボリゴン数, 区切り数)
  let ballMaterial = new THREE.MeshPhysicalMaterial({ map: textures });
  let ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  scene.add(ballMesh);

  // 平行光源
  let directionalLight = new THREE.DirectionalLight(0xffffff, 2); // 0x=16進数 (カラー, 光源の大きさ)
  directionalLight.position.set(200, 200, 200);
  scene.add(directionalLight);

  let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 30);
  scene.add(directionalLightHelper);

  // ポイント光源
  pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(-200, -200, -200);
  scene.add(pointLight);

  // ポイント光源の位置を確認
  let pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
  scene.add(pointLightHelper);

  // マウスで光源操作
  controls = new OrbitControls(camera, renderer.domElement);

  window.addEventListener("resize", onWindowResize);

  animate();
}

// ブラウザのリサイズに対応
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function animate() {
  // ポイント光源の巡回
  pointLight.position.set(
    200 * Math.sin(Date.now() / 500),
    200 * Math.sin(Date.now() / 1000),
    200 * Math.cos(Date.now() / 500)
  );

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
