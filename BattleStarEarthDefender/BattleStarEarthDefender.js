// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(window.innerWidth / -50, window.innerWidth / 50, window.innerHeight / 50, window.innerHeight / -50, 0.1, 1000);
camera.position.set(0, 40, 0); // Higher for broader view
camera.lookAt(0, 0, 0);
camera.zoom = 1.5; // Wider initial zoom
camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Physics World
const world = new CANNON.World();
world.gravity.set(0, 0, 0);

// Background (Space)
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 1000; i++) {
  starVertices.push(Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Grid and Border
const grid = new THREE.GridHelper(100, 100, 0x444444, 0x444444);
scene.add(grid);
const borderGeometry = new THREE.BoxGeometry(100, 0.1, 100);
const borderMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const border = new THREE.Mesh(borderGeometry, borderMaterial);
scene.add(border);

// Terrain (Simple Plane)
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.5 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Players
const playerShapes = [
  { geo: new THREE.BoxGeometry(1, 1, 1), color: 0xff0000 },
  { geo: new THREE.TetrahedronGeometry(0.7), color: 0x00ff00 },
  { geo: new THREE.SphereGeometry(0.6, 32, 32), color: 0x0000ff },
  { geo: new THREE.OctahedronGeometry(0.7), color: 0xffff00 }
];
const players = [];
let lives = 3;
let bombs = 3;
let score = 0;

for (let i = 0; i < Math.min(4, 1); i++) {
  const mesh = new THREE.Mesh(playerShapes[i].geo, new THREE.MeshBasicMaterial({ color: playerShapes[i].color }));
  mesh.position.set(0, 0, 0);
  scene.add(mesh);

  const body = new CANNON.Body({ mass: 1 });
  body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
  body.position.copy(mesh.position);
  world.addBody(body);

  players.push({ mesh, body, bombs: 3 });
}

// Enemies
const enemies = [];
function spawnEnemy(type) {
  let geo, color, bodyShape, behavior;
  switch (type) {
    case 'rect': 
      geo = new THREE.BoxGeometry(2, 1, 0.5); color = 0x888888; 
      bodyShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 0.25));
      behavior = (mesh, body, t) => { body.velocity.x = Math.sin(t) * 0.5; mesh.scale.x = 1 + Math.sin(t) * 0.1; };
      break;
    case 'tri': 
      geo = new THREE.TetrahedronGeometry(1); color = 0xff8800; 
      bodyShape = new CANNON.Sphere(0.7);
      behavior = (mesh, body) => { body.velocity.set(Math.cos(Date.now() * 0.001) * 1, 0, Math.sin(Date.now() * 0.001) * 1); mesh.rotation.y += 0.05; };
      break;
    case 'circle': 
      geo = new THREE.SphereGeometry(0.8, 16, 16); color = 0x00ffff; 
      bodyShape = new CANNON.Sphere(0.8);
      behavior = (mesh, body) => { body.velocity.set((Math.random() - 0.5) * 5, 0, (Math.random() - 0.5) * 5); mesh.material.color.setHSL(Math.random(), 1, 0.5); };
      break;
    case 'star': 
      geo = new THREE.OctahedronGeometry(1); color = 0xffff88; 
      bodyShape = new CANNON.Sphere(0.7);
      behavior = (mesh, body) => { body.velocity.set(Math.cos(Date.now() * 0.002) * 3, 0, Math.sin(Date.now() * 0.002) * 3); };
      break;
  }
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color }));
  mesh.position.set((Math.random() - 0.5) * 50, 0, (Math.random() - 0.5) * 50);
  scene.add(mesh);

  const body = new CANNON.Body({ mass: 0.5 });
  body.addShape(bodyShape);
  body.position.copy(mesh.position);
  world.addBody(body);

  enemies.push({ mesh, body, behavior });
}

// Bullets
const bullets = [];
function shoot(player, dir) {
  const geo = new THREE.SphereGeometry(0.2, 8, 8);
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
  mesh.position.copy(player.mesh.position);
  scene.add(mesh);

  const body = new CANNON.Body({ mass: 0 }); // Massless to avoid affecting player
  body.addShape(new CANNON.Sphere(0.2));
  body.position.copy(mesh.position);
  body.velocity.set(dir.x * 10, 0, dir.z * 10); // Direction matches arrow key
  world.addBody(body);

  bullets.push({ mesh, body });
}

// Controls
const keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

function handleControls(player) {
  const speed = 0.2;
  if (keys['w']) player.body.velocity.z -= speed;
  if (keys['s']) player.body.velocity.z += speed;
  if (keys['a']) player.body.velocity.x -= speed;
  if (keys['d']) player.body.velocity.x += speed;
  if (keys['ArrowUp']) shoot(player, { x: 0, z: -1 });
  if (keys['ArrowDown']) shoot(player, { x: 0, z: 1 });
  if (keys['ArrowLeft']) shoot(player, { x: -1, z: 0 });
  if (keys['ArrowRight']) shoot(player, { x: 1, z: 0 });
}

// Boundary Check
function clampPosition(body) {
  const limit = 50;
  body.position.x = Math.max(-limit, Math.min(limit, body.position.x));
  body.position.z = Math.max(-limit, Math.min(limit, body.position.z));
}

// Collision Detection
function checkCollisions() {
  bullets.forEach((bullet, bIndex) => {
    enemies.forEach((enemy, eIndex) => {
      const dist = bullet.body.position.distanceTo(enemy.body.position);
      if (dist < 1.5) { // Rough collision radius
        scene.remove(enemy.mesh);
        world.removeBody(enemy.body);
        enemies.splice(eIndex, 1);
        scene.remove(bullet.mesh);
        world.removeBody(bullet.body);
        bullets.splice(bIndex, 1);
        score += 10; // Add points for kill
      }
    });
  });
}

// Game Loop
let lastTime = 0;
function animate(time) {
  requestAnimationFrame(animate);
  const delta = (time - lastTime) / 1000;
  lastTime = time;

  world.step(1 / 60);

  // Update Players
  players.forEach(p => {
    handleControls(p);
    clampPosition(p.body); // Keep ship in bounds
    p.mesh.position.copy(p.body.position);
    p.mesh.quaternion.copy(p.body.quaternion);
  });

  // Update Enemies
  enemies.forEach(e => {
    e.behavior(e.mesh, e.body, time * 0.001);
    clampPosition(e.body); // Keep enemies in bounds too
    e.mesh.position.copy(e.body.position);
    e.mesh.quaternion.copy(e.body.quaternion);
  });

  // Update Bullets
  bullets.forEach(b => {
    b.mesh.position.copy(b.body.position);
    if (b.body.position.length() > 60) { // Remove bullets that leave bounds
      scene.remove(b.mesh);
      world.removeBody(b.body);
      bullets.splice(bullets.indexOf(b), 1);
    }
  });

  // Check Collisions
  checkCollisions();

  // Camera Follow and Zoom
  const playerPos = players[0].mesh.position;
  camera.position.set(playerPos.x, 40, playerPos.z);
  camera.lookAt(playerPos.x, 0, playerPos.z);
  const speed = players[0].body.velocity.length();
  camera.zoom = Math.max(1, Math.min(1.5, 1.5 - speed * 0.02)); // Limit zoom to keep border in view
  camera.updateProjectionMatrix();

  // Spawn Enemies
  if (Math.random() < 0.02) spawnEnemy(['rect', 'tri', 'circle', 'star'][Math.floor(Math.random() * 4)]);

  renderer.render(scene, camera);
}
animate(0);

// Window Resize
window.addEventListener('resize', () => {
  camera.left = window.innerWidth / -50;
  camera.right = window.innerWidth / 50;
  camera.top = window.innerHeight / 50;
  camera.bottom = window.innerHeight / -50;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
