import * as THREE from 'three';
import { createWoodTexture, createKioskMapTexture, createSignboardTexture } from './TextureGenerator';

// Cache textures to avoid rebuilding for every single model instance
let cachedWoodTexture: THREE.CanvasTexture | null = null;
let cachedKioskTexture: THREE.CanvasTexture | null = null;

function getWoodTexture(): THREE.CanvasTexture {
  if (!cachedWoodTexture) {
    cachedWoodTexture = createWoodTexture();
  }
  return cachedWoodTexture;
}

function getKioskTexture(): THREE.CanvasTexture {
  if (!cachedKioskTexture) {
    cachedKioskTexture = createKioskMapTexture();
  }
  return cachedKioskTexture;
}

/**
 * 1. OAK TREE
 */
export function createOakTree(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Oak Tree';

  // Trunk
  const trunkGeo = new THREE.CylinderGeometry(0.25, 0.4, 3, 8);
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x5c4033, // Rich dark brown
    roughness: 0.9,
    metalness: 0.1,
  });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 1.5;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  group.add(trunk);

  // Leaf cluster sizes and offsets for a natural look
  const leafMat1 = new THREE.MeshStandardMaterial({ color: 0x2e5c1e, roughness: 0.8, metalness: 0.1 });
  const leafMat2 = new THREE.MeshStandardMaterial({ color: 0x3d7a29, roughness: 0.8, metalness: 0.1 });
  const leafMat3 = new THREE.MeshStandardMaterial({ color: 0x1f4213, roughness: 0.8, metalness: 0.1 });

  const leafGeo = new THREE.DodecahedronGeometry(1.4, 1);

  // Create overlapping leaf spheres
  const clusters = [
    { pos: new THREE.Vector3(0, 3.2, 0), scale: new THREE.Vector3(1, 1, 1), mat: leafMat2 },
    { pos: new THREE.Vector3(0.6, 3.8, 0.4), scale: new THREE.Vector3(0.8, 0.8, 0.8), mat: leafMat1 },
    { pos: new THREE.Vector3(-0.6, 3.6, -0.4), scale: new THREE.Vector3(0.85, 0.85, 0.85), mat: leafMat3 },
    { pos: new THREE.Vector3(-0.4, 4.2, 0.5), scale: new THREE.Vector3(0.75, 0.75, 0.75), mat: leafMat2 },
    { pos: new THREE.Vector3(0.4, 4.4, -0.5), scale: new THREE.Vector3(0.7, 0.7, 0.7), mat: leafMat1 },
  ];

  clusters.forEach((c) => {
    const leafMesh = new THREE.Mesh(leafGeo, c.mat);
    leafMesh.position.copy(c.pos);
    leafMesh.scale.copy(c.scale);
    leafMesh.castShadow = true;
    leafMesh.receiveShadow = true;
    group.add(leafMesh);
  });

  return group;
}

/**
 * 2. PINE TREE (Conifer)
 */
export function createPineTree(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Pine Tree';

  // Trunk
  const trunkGeo = new THREE.CylinderGeometry(0.18, 0.28, 3.5, 8);
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x422f25,
    roughness: 0.9,
  });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 1.75;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  group.add(trunk);

  // Pine Needles (conic layers)
  const pineMat = new THREE.MeshStandardMaterial({
    color: 0x1b4322, // Rich dark pine green
    roughness: 0.85,
    metalness: 0.1,
  });

  const coneLayers = [
    { height: 1.8, radius: 1.4, y: 2.8 },
    { height: 1.5, radius: 1.1, y: 3.8 },
    { height: 1.2, radius: 0.8, y: 4.7 },
    { height: 0.9, radius: 0.5, y: 5.4 },
  ];

  coneLayers.forEach((layer) => {
    const coneGeo = new THREE.ConeGeometry(layer.radius, layer.height, 8);
    const cone = new THREE.Mesh(coneGeo, pineMat);
    cone.position.y = layer.y;
    cone.castShadow = true;
    cone.receiveShadow = true;
    group.add(cone);
  });

  return group;
}

/**
 * 3. CHERRY BLOSSOM TREE
 */
export function createCherryTree(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Cherry Tree';

  // Trunk (more stylized, slightly curved)
  const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 2.6, 8);
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x3d2b20,
    roughness: 0.9,
  });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 1.3;
  trunk.rotation.z = -0.05;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  group.add(trunk);

  // Branches
  const bGeo1 = new THREE.CylinderGeometry(0.12, 0.18, 1.2, 6);
  const branch1 = new THREE.Mesh(bGeo1, trunkMat);
  branch1.position.set(0.3, 2.2, 0.2);
  branch1.rotation.z = -0.6;
  branch1.rotation.y = 0.5;
  group.add(branch1);

  const branch2 = new THREE.Mesh(bGeo1, trunkMat);
  branch2.position.set(-0.3, 2.1, -0.2);
  branch2.rotation.z = 0.6;
  branch2.rotation.y = -0.5;
  group.add(branch2);

  // Leaf cluster (Pink cherry blossom shades!)
  const bloomMat1 = new THREE.MeshStandardMaterial({ color: 0xffb7c5, roughness: 0.8 }); // Cherry blossom pink
  const bloomMat2 = new THREE.MeshStandardMaterial({ color: 0xff9aa2, roughness: 0.8 }); // Hotter pink
  const bloomMat3 = new THREE.MeshStandardMaterial({ color: 0xffc6ff, roughness: 0.8 }); // Pastel violet-pink

  const leafGeo = new THREE.DodecahedronGeometry(1.2, 1);

  const clusters = [
    { pos: new THREE.Vector3(0, 3.0, 0), scale: new THREE.Vector3(1.1, 0.9, 1.1), mat: bloomMat1 },
    { pos: new THREE.Vector3(0.6, 2.7, 0.4), scale: new THREE.Vector3(0.7, 0.7, 0.7), mat: bloomMat2 },
    { pos: new THREE.Vector3(-0.6, 2.6, -0.4), scale: new THREE.Vector3(0.8, 0.7, 0.8), mat: bloomMat3 },
    { pos: new THREE.Vector3(-0.3, 3.4, 0.4), scale: new THREE.Vector3(0.85, 0.85, 0.85), mat: bloomMat1 },
    { pos: new THREE.Vector3(0.4, 3.3, -0.4), scale: new THREE.Vector3(0.8, 0.8, 0.8), mat: bloomMat2 },
  ];

  clusters.forEach((c) => {
    const leafMesh = new THREE.Mesh(leafGeo, c.mat);
    leafMesh.position.copy(c.pos);
    leafMesh.scale.copy(c.scale);
    leafMesh.castShadow = true;
    leafMesh.receiveShadow = true;
    group.add(leafMesh);
  });

  return group;
}

/**
 * 4. BENCH (Slat seat & backrest on iron framing)
 */
export function createBench(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Bench';

  const woodTexture = getWoodTexture();
  const woodMat = new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.7,
    metalness: 0.1,
  });

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x1c2121, // Charcoal black
    roughness: 0.6,
    metalness: 0.8,
  });

  // Dimensions
  const length = 1.8;
  const width = 0.5;

  // Seat Slats (4 slats running horizontally)
  const slatGeo = new THREE.BoxGeometry(length, 0.04, 0.08);
  for (let i = 0; i < 4; i++) {
    const slat = new THREE.Mesh(slatGeo, woodMat);
    slat.position.set(0, 0.45, -0.15 + i * 0.1);
    slat.castShadow = true;
    slat.receiveShadow = true;
    group.add(slat);
  }

  // Backrest Slats (3 slats angled)
  const backSlatGeo = new THREE.BoxGeometry(length, 0.08, 0.04);
  const backrestGroup = new THREE.Group();
  backrestGroup.position.set(0, 0.75, -0.2);
  backrestGroup.rotation.x = -0.2; // Angle back slightly
  for (let i = 0; i < 3; i++) {
    const slat = new THREE.Mesh(backSlatGeo, woodMat);
    slat.position.set(0, i * 0.11, 0);
    slat.castShadow = true;
    slat.receiveShadow = true;
    backrestGroup.add(slat);
  }
  group.add(backrestGroup);

  // Cast Iron Frames (Left & Right legs/armrests)
  const frameGeo = new THREE.BoxGeometry(0.04, 0.5, 0.04);
  const legXPositions = [-length / 2 + 0.15, length / 2 - 0.15];

  legXPositions.forEach((x) => {
    // Front Leg
    const fLeg = new THREE.Mesh(frameGeo, ironMat);
    fLeg.position.set(x, 0.25, 0.15);
    fLeg.castShadow = true;
    group.add(fLeg);

    // Back Leg
    const bLeg = new THREE.Mesh(frameGeo, ironMat);
    bLeg.position.set(x, 0.25, -0.18);
    bLeg.castShadow = true;
    group.add(bLeg);

    // Bottom stretchers (connecting feet)
    const footGeo = new THREE.BoxGeometry(0.04, 0.04, 0.4);
    const foot = new THREE.Mesh(footGeo, ironMat);
    foot.position.set(x, 0.02, -0.015);
    foot.castShadow = true;
    group.add(foot);

    // Seat support beam
    const supportGeo = new THREE.BoxGeometry(0.04, 0.04, 0.4);
    const support = new THREE.Mesh(supportGeo, ironMat);
    support.position.set(x, 0.42, -0.015);
    support.castShadow = true;
    group.add(support);

    // Armrest
    const armGeo = new THREE.BoxGeometry(0.04, 0.04, 0.42);
    const arm = new THREE.Mesh(armGeo, ironMat);
    arm.position.set(x, 0.56, -0.015);
    arm.castShadow = true;
    group.add(arm);

    // Backrest supports (slanted up)
    const backSupportGeo = new THREE.BoxGeometry(0.04, 0.6, 0.04);
    const backSupport = new THREE.Mesh(backSupportGeo, ironMat);
    backSupport.position.set(x, 0.72, -0.2);
    backSupport.rotation.x = -0.2;
    backSupport.castShadow = true;
    group.add(backSupport);
  });

  return group;
}

/**
 * 5. LAMPPOST (With emissive lantern and helper spotlight)
 */
export function createLamppost(enableLight = true): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Lamppost';

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x1a2130, // Sleek navy black metal
    roughness: 0.35,
    metalness: 0.85,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: enableLight ? 0xffeaad : 0x1a1a1a, // Warm glowing cream LED
    emissiveIntensity: enableLight ? 3.0 : 0.0,
    roughness: 0.1,
    metalness: 0.1,
  });

  // 1. Sleek flared hexagonal base
  const baseGeo = new THREE.CylinderGeometry(0.18, 0.28, 0.5, 6);
  const base = new THREE.Mesh(baseGeo, metalMat);
  base.position.y = 0.25;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  // 2. Main slender pole with accent bands
  const poleGeo = new THREE.CylinderGeometry(0.05, 0.08, 3.2, 8);
  const pole = new THREE.Mesh(poleGeo, metalMat);
  pole.position.y = 1.85;
  pole.castShadow = true;
  pole.receiveShadow = true;
  group.add(pole);

  // Accent ring at 1.5m and 3.0m
  const ring1 = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.06, 8), metalMat);
  ring1.position.y = 1.5;
  group.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 8), metalMat);
  ring2.position.y = 3.0;
  group.add(ring2);

  // 3. Elegant double-branch T-arm at the top
  const crossbarGeo = new THREE.BoxGeometry(1.2, 0.06, 0.06);
  const crossbar = new THREE.Mesh(crossbarGeo, metalMat);
  crossbar.position.set(0, 3.45, 0);
  crossbar.castShadow = true;
  group.add(crossbar);

  // Support brackets for the arms
  const bracketL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.04), metalMat);
  bracketL.position.set(-0.3, 3.3, 0);
  bracketL.rotation.z = Math.PI / 4;
  group.add(bracketL);

  const bracketR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.04), metalMat);
  bracketR.position.set(0.3, 3.3, 0);
  bracketR.rotation.z = -Math.PI / 4;
  group.add(bracketR);

  // 4. Two hanging lantern heads (one on left, one on right!)
  const sideXOffsets = [-0.55, 0.55];
  sideXOffsets.forEach((x) => {
    // Hanging cap
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.08, 8), metalMat);
    cap.position.set(x, 3.38, 0);
    cap.castShadow = true;
    group.add(cap);

    // Glass bulb housing
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.22, 8), glassMat);
    glass.position.set(x, 3.23, 0);
    group.add(glass);

    // Bottom pointed ornament cap
    const botCone = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.08, 8), metalMat);
    botCone.position.set(x, 3.1, 0);
    botCone.rotation.x = Math.PI;
    group.add(botCone);

    // Spotlight under each bulb
    if (enableLight) {
      const spotLight = new THREE.SpotLight(0xffecc0, 7.5, 12, Math.PI / 4, 0.5, 1);
      spotLight.position.set(x, 3.1, 0);
      spotLight.target.position.set(x, 0, 0);
      spotLight.castShadow = false;
      group.add(spotLight);
      group.add(spotLight.target);
    }
  });

  return group;
}

/**
 * 6. TRASH BIN
 */
export function createTrashBin(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Trash Bin';

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0x3e4a42,
    roughness: 0.5,
    metalness: 0.7,
  });

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x4e3629, // Slate wood panels/metal
    roughness: 0.7,
  });

  const insideMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.9,
  });

  // Base
  const baseGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.06, 12);
  const base = new THREE.Mesh(baseGeo, rimMat);
  base.position.y = 0.03;
  base.castShadow = true;
  group.add(base);

  // Outer Shell / Slats
  const bodyGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.75, 12, 1, true);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.41;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Dark Inner (Simulates trash opening depth)
  const innerGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.74, 12);
  const inner = new THREE.Mesh(innerGeo, insideMat);
  inner.position.y = 0.40;
  group.add(inner);

  // Top Lid Ring with opening
  const lidGeo = new THREE.CylinderGeometry(0.26, 0.24, 0.05, 12);
  const lid = new THREE.Mesh(lidGeo, rimMat);
  lid.position.y = 0.81;
  lid.castShadow = true;
  group.add(lid);

  return group;
}

/**
 * 7. WATER FOUNTAIN (with animated mesh water and reference points for particle effects)
 */
export function createWaterFountain(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Water Fountain';

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0xdddddd, // Imperial white marble
    roughness: 0.35,
    metalness: 0.15,
  });

  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x607d8b, // Dark steel-grey border slate
    roughness: 0.7,
  });

  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x4fc3f7, // Beautiful luminous bright-cyan water
    emissive: 0x0077c2,
    transparent: true,
    opacity: 0.75,
    roughness: 0.05,
    metalness: 0.95,
  });

  const nozzleMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Polished white nozzle fixtures (changed from gold)
    roughness: 0.2,
    metalness: 0.9,
  });

  const sprayMat = new THREE.MeshStandardMaterial({
    color: 0xe0f7fa, // Frothy sparkling white spray
    transparent: true,
    opacity: 0.65,
    roughness: 0.1,
    emissive: 0x80deea,
    emissiveIntensity: 1.0
  });

  // 1. Multi-Step circular marble staircase base
  const stair1Geo = new THREE.CylinderGeometry(3.3, 3.4, 0.15, 24);
  const stair1 = new THREE.Mesh(stair1Geo, baseMat);
  stair1.position.y = 0.075;
  stair1.receiveShadow = true;
  group.add(stair1);

  const stair2Geo = new THREE.CylinderGeometry(2.7, 2.8, 0.15, 24);
  const stair2 = new THREE.Mesh(stair2Geo, baseMat);
  stair2.position.y = 0.225;
  stair2.receiveShadow = true;
  group.add(stair2);

  // 2. Large Main Basin Rim (Stately outer marble ring)
  const bottomBasinGeo = new THREE.CylinderGeometry(2.2, 2.3, 0.5, 24);
  const bottomBasin = new THREE.Mesh(bottomBasinGeo, stoneMat);
  bottomBasin.position.y = 0.55;
  bottomBasin.castShadow = true;
  bottomBasin.receiveShadow = true;
  group.add(bottomBasin);

  // 3. Lower Level Water Pool (inside main basin)
  const lowerWaterGeo = new THREE.CylinderGeometry(2.05, 2.05, 0.08, 24);
  const lowerWater = new THREE.Mesh(lowerWaterGeo, waterMat);
  lowerWater.position.y = 0.72;
  lowerWater.name = 'FountainWaterLower';
  group.add(lowerWater);

  // 4. Solid fluted main central pillar
  const pedestalGeo = new THREE.CylinderGeometry(0.5, 0.65, 1.1, 16);
  const pedestal = new THREE.Mesh(pedestalGeo, stoneMat);
  pedestal.position.y = 1.15;
  pedestal.castShadow = true;
  pedestal.receiveShadow = true;
  group.add(pedestal);

  // 5. Middle Level Sculpted Bowl
  const middleBowlGeo = new THREE.CylinderGeometry(1.3, 0.7, 0.35, 16);
  const middleBowl = new THREE.Mesh(middleBowlGeo, stoneMat);
  middleBowl.position.y = 1.85;
  middleBowl.castShadow = true;
  middleBowl.receiveShadow = true;
  group.add(middleBowl);

  // 6. Middle Level Water Pool
  const middleWaterGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.06, 16);
  const middleWater = new THREE.Mesh(middleWaterGeo, waterMat);
  middleWater.position.y = 1.98;
  middleWater.name = 'FountainWaterMiddle';
  group.add(middleWater);

  // 7. Upper Level fluted Pedestal (thinner central support)
  const upperPedestalGeo = new THREE.CylinderGeometry(0.24, 0.32, 0.8, 12);
  const upperPedestal = new THREE.Mesh(upperPedestalGeo, stoneMat);
  upperPedestal.position.y = 2.45;
  upperPedestal.castShadow = true;
  group.add(upperPedestal);

  // 8. Top Level Small Bowl
  const topBowlGeo = new THREE.CylinderGeometry(0.65, 0.35, 0.22, 12);
  const topBowl = new THREE.Mesh(topBowlGeo, stoneMat);
  topBowl.position.y = 2.95;
  topBowl.castShadow = true;
  group.add(topBowl);

  // 9. Top Water Pool
  const topWaterGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.04, 12);
  const topWater = new THREE.Mesh(topWaterGeo, waterMat);
  topWater.position.y = 3.04;
  topWater.name = 'FountainWaterTop';
  group.add(topWater);

  // 10. Center golden brass nozzle
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.12, 8), nozzleMat);
  nozzle.position.y = 3.12;
  group.add(nozzle);

  // 11. Custom Sculpted Active Water Spray Mesh Columns
  const columnsGroup = new THREE.Group();
  columnsGroup.name = 'WaterColumn';

  // A. Main Center High Vertical Spray Column
  const centerColGeo = new THREE.CylinderGeometry(0.1, 0.22, 2.8, 8);
  const centerCol = new THREE.Mesh(centerColGeo, sprayMat);
  centerCol.position.y = 4.4; // positioned nicely above top nozzle
  columnsGroup.add(centerCol);

  // B. Cascade waterfalls spilling down from middle bowl
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const cascadeGeo = new THREE.CylinderGeometry(0.08, 0.14, 1.1, 6);
    const cascade = new THREE.Mesh(cascadeGeo, sprayMat);
    cascade.position.set(Math.cos(angle) * 1.2, 1.4, Math.sin(angle) * 1.2);
    cascade.rotation.z = -angle * 0.1;
    columnsGroup.add(cascade);
  }

  // C. Arching mini-spout sprays from outer basin pointing inwards
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const archGeo = new THREE.CylinderGeometry(0.04, 0.07, 1.4, 6);
    const spout = new THREE.Mesh(archGeo, sprayMat);
    spout.position.set(Math.cos(angle) * 1.6, 1.2, Math.sin(angle) * 1.6);
    spout.rotation.y = -angle;
    spout.rotation.z = Math.PI / 5; // slant inward
    columnsGroup.add(spout);
  }

  group.add(columnsGroup);

  return group;
}

/**
 * 8. INFORMATION KIOSK
 * Features a custom map directory display board, columns, concrete base, and elegant roof!
 */
export function createInformationKiosk(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Information Kiosk';

  const woodTexture = getWoodTexture();
  const mapTexture = getKioskTexture();

  const concreteMat = new THREE.MeshStandardMaterial({
    color: 0xb5b5b5,
    roughness: 0.8,
  });

  const woodMat = new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.8,
  });

  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x224433, // Beautiful forest green shingles
    roughness: 0.6,
  });

  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x1a211e, // Dark green/black framing
    roughness: 0.5,
    metalness: 0.6,
  });

  // 1. Concrete Slab Foundation
  const baseGeo = new THREE.BoxGeometry(2.4, 0.1, 1.4);
  const base = new THREE.Mesh(baseGeo, concreteMat);
  base.position.y = 0.05;
  base.receiveShadow = true;
  group.add(base);

  // 2. Pillars (4 corner columns)
  const pillarGeo = new THREE.BoxGeometry(0.12, 2.2, 0.12);
  const px = 1.0;
  const pz = 0.5;
  const pillars = [
    { x: -px, z: -pz },
    { x: px, z: -pz },
    { x: -px, z: pz },
    { x: px, z: pz },
  ];

  pillars.forEach((p) => {
    const pillar = new THREE.Mesh(pillarGeo, woodMat);
    pillar.position.set(p.x, 1.15, p.z);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    group.add(pillar);
  });

  // 3. Main Center Display Board (Double-sided)
  const boardFrameGeo = new THREE.BoxGeometry(1.6, 1.2, 0.1);
  const boardFrame = new THREE.Mesh(boardFrameGeo, frameMat);
  boardFrame.position.set(0, 1.4, 0);
  boardFrame.castShadow = true;
  group.add(boardFrame);

  // Map Posters on front and back
  const posterGeo = new THREE.PlaneGeometry(1.48, 1.08);
  const posterMat = new THREE.MeshBasicMaterial({
    map: mapTexture,
    side: THREE.DoubleSide,
  });

  const posterFront = new THREE.Mesh(posterGeo, posterMat);
  posterFront.position.set(0, 1.4, 0.052);
  group.add(posterFront);

  const posterBack = new THREE.Mesh(posterGeo, posterMat);
  posterBack.position.set(0, 1.4, -0.052);
  posterBack.rotation.y = Math.PI;
  group.add(posterBack);

  // 4. Roof Gables & Trusses (Connecting columns)
  const beamGeoW = new THREE.BoxGeometry(2.2, 0.1, 0.1);
  const beamFront = new THREE.Mesh(beamGeoW, woodMat);
  beamFront.position.set(0, 2.25, pz);
  beamFront.castShadow = true;
  group.add(beamFront);

  const beamBack = new THREE.Mesh(beamGeoW, woodMat);
  beamBack.position.set(0, 2.25, -pz);
  beamBack.castShadow = true;
  group.add(beamBack);

  const beamGeoD = new THREE.BoxGeometry(0.1, 0.1, 1.1);
  const beamLeft = new THREE.Mesh(beamGeoD, woodMat);
  beamLeft.position.set(-px, 2.25, 0);
  beamLeft.castShadow = true;
  group.add(beamLeft);

  const beamRight = new THREE.Mesh(beamGeoD, woodMat);
  beamRight.position.set(px, 2.25, 0);
  beamRight.castShadow = true;
  group.add(beamRight);

  // 5. Pyramid Canopy / Roof
  // Base pyramid cap
  const roofGeo = new THREE.ConeGeometry(1.6, 0.6, 4);
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(0, 2.6, 0);
  roof.rotation.y = Math.PI / 4; // Align sides to rectangular dimensions
  roof.scale.set(1.6, 1, 1.1); // Squish cone into a rectangular hipped roof
  roof.castShadow = true;
  group.add(roof);

  return group;
}

/**
 * 9. SHRUB / BUSH
 */
export function createShrub(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Shrub';

  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x3d7a29,
    roughness: 0.85,
    metalness: 0.05,
  });

  const shrubGeo = new THREE.DodecahedronGeometry(0.55, 1);
  
  const segments = [
    { pos: new THREE.Vector3(0, 0.35, 0), scale: new THREE.Vector3(1, 1, 1) },
    { pos: new THREE.Vector3(0.25, 0.3, 0.15), scale: new THREE.Vector3(0.8, 0.8, 0.8) },
    { pos: new THREE.Vector3(-0.25, 0.25, -0.15), scale: new THREE.Vector3(0.85, 0.85, 0.85) },
    { pos: new THREE.Vector3(-0.15, 0.45, 0.2), scale: new THREE.Vector3(0.7, 0.7, 0.7) },
    { pos: new THREE.Vector3(0.15, 0.4, -0.2), scale: new THREE.Vector3(0.75, 0.75, 0.75) },
  ];

  segments.forEach((seg) => {
    const mesh = new THREE.Mesh(shrubGeo, leafMat);
    mesh.position.copy(seg.pos);
    mesh.scale.copy(seg.scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  });

  return group;
}

/**
 * 10. FLOWER BED
 * Groups dynamic, colourful flowers together in a neat visual soil cluster
 */
export function createFlowerBed(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Flower Bed';

  const soilMat = new THREE.MeshStandardMaterial({
    color: 0x35281e, // Moist dark soil
    roughness: 0.95,
  });

  const soilGeo = new THREE.CylinderGeometry(0.7, 0.75, 0.12, 10);
  const soil = new THREE.Mesh(soilGeo, soilMat);
  soil.position.y = 0.06;
  soil.receiveShadow = true;
  soil.castShadow = true;
  group.add(soil);

  const colors = [
    0xff4444, // Red
    0xffffff, // White
    0x00d2ff, // Sky Blue
    0xff5cbb, // Pink
    0xbc44ff, // Purple
  ];

  const stemMat = new THREE.MeshStandardMaterial({
    color: 0x4caf50,
    roughness: 0.8,
  });

  const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.35, 4);
  const bloomGeo = new THREE.DodecahedronGeometry(0.07, 0);

  // Plant 12 flowers inside the soil bed in a nice spiral pattern
  for (let i = 0; i < 12; i++) {
    const flower = new THREE.Group();

    const angle = (i * Math.PI * 2) / 8 + Math.random() * 0.4;
    const radius = 0.2 + (i < 8 ? 0.35 : 0.1) * Math.random();
    const fx = Math.cos(angle) * radius;
    const fz = Math.sin(angle) * radius;

    // Stem
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 0.17;
    stem.rotation.z = (Math.random() - 0.5) * 0.2;
    stem.rotation.x = (Math.random() - 0.5) * 0.2;
    stem.castShadow = true;
    flower.add(stem);

    // Blossom / Flower head
    const flowerColor = colors[Math.floor(Math.random() * colors.length)];
    const bloomMat = new THREE.MeshStandardMaterial({
      color: flowerColor,
      roughness: 0.8,
    });
    const bloom = new THREE.Mesh(bloomGeo, bloomMat);
    bloom.position.set(stem.position.x, 0.34, stem.position.z);
    bloom.castShadow = true;
    flower.add(bloom);

    flower.position.set(fx, 0, fz);
    group.add(flower);
  }

  return group;
}

/**
 * 11. ROW HOUSE (Stylized brick facade with glowing windows & customizable colors)
 */
export function createOrangeRowHouse(isNightOrSunset = false, customColorHex?: number): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Suburban Villa';

  const brickMat = new THREE.MeshStandardMaterial({
    color: customColorHex !== undefined ? customColorHex : 0xe65c00, // Customizable facade color
    roughness: 0.75,
    metalness: 0.1,
  });

  const stoneTrimMat = new THREE.MeshStandardMaterial({
    color: 0xf5f5f5, // Pristine white stone trimmings / columns
    roughness: 0.5,
  });

  const baseTrimMat = new THREE.MeshStandardMaterial({
    color: 0x78909c, // Slate gray base foundation
    roughness: 0.8,
  });

  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x37474f, // Slate shingles
    roughness: 0.4,
  });

  const doorMat = new THREE.MeshStandardMaterial({
    color: 0x3e2723, // Rich mahogany wood door
    roughness: 0.6,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Polished white handle & details (changed from gold)
    roughness: 0.2,
    metalness: 0.9,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: isNightOrSunset ? 0xffea00 : 0x88ccff,
    emissive: isNightOrSunset ? 0xffc107 : 0x000000,
    emissiveIntensity: isNightOrSunset ? 1.6 : 0.0,
    roughness: 0.1,
    metalness: 0.9,
  });

  // Base dimensions of a majestic wide villa
  const width = 7.4;
  const height = 5.2;
  const depth = 4.0;

  // 1. Main Villa Body
  const bodyGeo = new THREE.BoxGeometry(width, height, depth);
  const body = new THREE.Mesh(bodyGeo, brickMat);
  body.position.y = height / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // 2. Foundation Stone Trim
  const baseTrimGeo = new THREE.BoxGeometry(width + 0.15, 0.4, depth + 0.15);
  const baseTrim = new THREE.Mesh(baseTrimGeo, baseTrimMat);
  baseTrim.position.y = 0.2;
  baseTrim.castShadow = true;
  baseTrim.receiveShadow = true;
  group.add(baseTrim);

  // 3. Middle horizontal stone belt dividing levels
  const beltGeo = new THREE.BoxGeometry(width + 0.08, 0.15, depth + 0.08);
  const belt = new THREE.Mesh(beltGeo, stoneTrimMat);
  belt.position.y = height * 0.55;
  belt.castShadow = true;
  group.add(belt);

  // 4. Slanted Gable Roof (Realistic non-distorted pitched roof with brick gables)
  const roof = new THREE.Group();
  roof.name = "Pitched Roof";
  const roofThick = 0.18;
  const roofLength = depth + 0.4; // overhang front & back
  const slopeWidth = Math.sqrt((width / 2) ** 2 + 1.8 ** 2) + 0.15; // overhang left & right
  const angle = Math.atan2(1.8, width / 2);

  const leftSlope = new THREE.Mesh(new THREE.BoxGeometry(slopeWidth, roofThick, roofLength), roofMat);
  leftSlope.position.set(-width / 4, height + 0.9, 0);
  leftSlope.rotation.z = angle;
  leftSlope.castShadow = true;
  roof.add(leftSlope);

  const rightSlope = new THREE.Mesh(new THREE.BoxGeometry(slopeWidth, roofThick, roofLength), roofMat);
  rightSlope.position.set(width / 4, height + 0.9, 0);
  rightSlope.rotation.z = -angle;
  rightSlope.castShadow = true;
  roof.add(rightSlope);

  // Solid brick gable walls filling the triangular ends
  const triangleShape = new THREE.Shape();
  triangleShape.moveTo(-width / 2, 0);
  triangleShape.lineTo(width / 2, 0);
  triangleShape.lineTo(0, 1.8);
  triangleShape.closePath();

  const extrudeSettings = { depth: 0.1, bevelEnabled: false };
  const gableGeo = new THREE.ExtrudeGeometry(triangleShape, extrudeSettings);

  const frontGableMesh = new THREE.Mesh(gableGeo, brickMat);
  frontGableMesh.position.set(0, height, depth / 2 - 0.1);
  frontGableMesh.castShadow = true;
  roof.add(frontGableMesh);

  const backGableMesh = new THREE.Mesh(gableGeo, brickMat);
  backGableMesh.position.set(0, height, -depth / 2);
  backGableMesh.castShadow = true;
  roof.add(backGableMesh);

  group.add(roof);

  // Chimney on the side
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.8, 0.45), brickMat);
  chimney.position.set(2.8, height + 0.8, -0.6);
  chimney.castShadow = true;
  group.add(chimney);

  const chimneyCap = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.15, 0.55), stoneTrimMat);
  chimneyCap.position.set(2.8, height + 1.7, -0.6);
  chimneyCap.castShadow = true;
  group.add(chimneyCap);

  // 5. Front Porch (Symmetrical, centered)
  const porch = new THREE.Group();
  porch.position.set(0, 0, depth / 2);

  const porchBase = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.28, 1.2), baseTrimMat);
  porchBase.position.set(0, 0.14, 0.6);
  porchBase.receiveShadow = true;
  porchBase.castShadow = true;
  porch.add(porchBase);

  // Porch roof awning
  const porchAwning = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.15, 1.3), roofMat);
  porchAwning.position.set(0, 2.4, 0.65);
  porchAwning.castShadow = true;
  porch.add(porchAwning);

  // Two white porch supporting columns
  const columnGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.25, 8);
  const colL = new THREE.Mesh(columnGeo, stoneTrimMat);
  colL.position.set(-1.3, 1.25, 1.1);
  colL.castShadow = true;
  porch.add(colL);

  const colR = colL.clone();
  colR.position.x = 1.3;
  porch.add(colR);

  group.add(porch);

  // 6. Windows (Front & Sides)
  // Front window second floor (Left)
  const winGeo = new THREE.BoxGeometry(0.9, 1.3, 0.12);
  const winFrontTopL = new THREE.Mesh(winGeo, glassMat);
  winFrontTopL.position.set(-2.3, 4.0, depth / 2 + 0.02);
  winFrontTopL.castShadow = true;
  group.add(winFrontTopL);

  const trimFrontTopL = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.1, 0.16), stoneTrimMat);
  trimFrontTopL.position.set(-2.3, 4.7, depth / 2 + 0.04);
  group.add(trimFrontTopL);

  // Front window second floor (Right)
  const winFrontTopR = new THREE.Mesh(winGeo, glassMat);
  winFrontTopR.position.set(2.3, 4.0, depth / 2 + 0.02);
  winFrontTopR.castShadow = true;
  group.add(winFrontTopR);

  const trimFrontTopR = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.1, 0.16), stoneTrimMat);
  trimFrontTopR.position.set(2.3, 4.7, depth / 2 + 0.04);
  group.add(trimFrontTopR);

  // Front window ground floor (Left)
  const winFrontBottomL = new THREE.Mesh(winGeo, glassMat);
  winFrontBottomL.position.set(-2.3, 1.6, depth / 2 + 0.02);
  winFrontBottomL.castShadow = true;
  group.add(winFrontBottomL);

  const trimFrontBottomL = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.1, 0.16), stoneTrimMat);
  trimFrontBottomL.position.set(-2.3, 2.3, depth / 2 + 0.04);
  group.add(trimFrontBottomL);

  // Side Windows (Left Side) - adds high detail from the gaps
  const sideWinGeo = new THREE.BoxGeometry(0.12, 1.1, 0.8);
  const winSideTop = new THREE.Mesh(sideWinGeo, glassMat);
  winSideTop.position.set(-width / 2 - 0.02, 3.8, 0);
  group.add(winSideTop);

  const winSideBottom = new THREE.Mesh(sideWinGeo, glassMat);
  winSideBottom.position.set(-width / 2 - 0.02, 1.6, 0);
  group.add(winSideBottom);

  // 7. Ground Floor Door (Protected under the porch awning, centered)
  const doorGeo = new THREE.BoxGeometry(0.9, 2.0, 0.1);
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(0, 1.15, depth / 2 + 0.02);
  door.castShadow = true;
  group.add(door);

  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.05, 2.1, 0.14), stoneTrimMat);
  doorFrame.position.set(0, 1.15, depth / 2 + 0.01);
  group.add(doorFrame);

  const handle = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), brassMat);
  handle.position.set(-0.35, 1.15, depth / 2 + 0.08);
  group.add(handle);

  return group;
}

/**
 * 11a. BOOKSTORE / COZY STOREFRONT (Detailed commercial shop with custom awning & sign)
 */
export function createBookstoreStorefront(isNightOrSunset = false, customColorHex?: number): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Bookstore';

  const woodMat = new THREE.MeshStandardMaterial({
    color: customColorHex !== undefined ? customColorHex : 0x1b365d, // Prussian Blue/Baltic Blue shopfront
    roughness: 0.65,
  });

  const stoneTrimMat = new THREE.MeshStandardMaterial({
    color: 0xe5e0d8, // Cream stone trim
    roughness: 0.5,
  });

  const awningMat = new THREE.MeshStandardMaterial({
    color: 0x9e2a2b, // Cozy Burgundy shop awning
    roughness: 0.8,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Shiny white lettering (changed from gold)
    roughness: 0.2,
    metalness: 0.85,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: isNightOrSunset ? 0xfff3a0 : 0x88ccff,
    emissive: isNightOrSunset ? 0xffb300 : 0x000000,
    emissiveIntensity: isNightOrSunset ? 1.8 : 0.0,
    roughness: 0.1,
    metalness: 0.9,
  });

  const width = 7.4;
  const height = 5.2;
  const depth = 4.0;

  // 1. Main Shop Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), woodMat);
  body.position.y = height / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // 2. Stone Base
  const base = new THREE.Mesh(new THREE.BoxGeometry(width + 0.1, 0.4, depth + 0.1), stoneTrimMat);
  base.position.y = 0.2;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  // 3. Huge Display Windows (Showing shelves inside)
  const leftWindowGeo = new THREE.BoxGeometry(2.2, 1.8, 0.3);
  const leftWindow = new THREE.Mesh(leftWindowGeo, glassMat);
  leftWindow.position.set(-1.8, 1.6, depth / 2 + 0.05);
  leftWindow.castShadow = true;
  group.add(leftWindow);

  const rightWindow = leftWindow.clone();
  rightWindow.position.x = 1.8;
  group.add(rightWindow);

  // 4. Double Shop Doors (In the center)
  const doorGeo = new THREE.BoxGeometry(1.4, 2.3, 0.15);
  const door = new THREE.Mesh(doorGeo, stoneTrimMat);
  door.position.set(0, 1.35, depth / 2 + 0.02);
  group.add(door);

  const doorGlass = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.5, 0.18), glassMat);
  doorGlass.position.set(0, 1.5, depth / 2 + 0.05);
  group.add(doorGlass);

  // 5. Classic Cozy Slanted Awning (Burgundy red)
  const awning = new THREE.Mesh(new THREE.BoxGeometry(width + 0.3, 0.15, 1.4), awningMat);
  awning.rotation.x = 0.35; // Slanted down
  awning.position.set(0, 2.9, depth / 2 + 0.6);
  awning.castShadow = true;
  group.add(awning);

  // Awning metal supports
  const supportGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.3, 6);
  const supportL = new THREE.Mesh(supportGeo, stoneTrimMat);
  supportL.rotation.x = Math.PI / 4;
  supportL.position.set(-width / 2 + 0.1, 2.7, depth / 2 + 0.3);
  group.add(supportL);

  const supportR = supportL.clone();
  supportR.position.x = width / 2 - 0.1;
  group.add(supportR);

  // 6. Shop Sign Board (spells BOOKS in detailed blocks)
  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.7, 0.2), stoneTrimMat);
  signBoard.position.set(0, 3.8, depth / 2 + 0.12);
  signBoard.castShadow = true;
  group.add(signBoard);

  // Let's create golden book icons or simple block sign letters for BOOKS
  const letters = ['B', 'O', 'O', 'K', 'S'];
  letters.forEach((char, idx) => {
    const letterBlock = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.1), goldMat);
    letterBlock.position.set(-0.9 + idx * 0.45, 3.8, depth / 2 + 0.23);
    letterBlock.castShadow = true;
    group.add(letterBlock);
  });

  // Flat roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(width + 0.2, 0.25, depth + 0.2), stoneTrimMat);
  roof.position.y = height + 0.1;
  roof.castShadow = true;
  group.add(roof);

  return group;
}

/**
 * 11b. ARTISAN FACTORY / CRAFT WORKSHOP (With brick chimney, sawtooth roof & grid windows)
 */
export function createArtisanFactory(isNightOrSunset = false): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Artisan Factory';

  const brickMat = new THREE.MeshStandardMaterial({
    color: 0x8d4f40, // Industrial warm rustic brick red
    roughness: 0.85,
  });

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x455a64, // Slate-grey steel
    roughness: 0.5,
    metalness: 0.8,
  });

  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x263238, // Corrugated iron slate grey
    roughness: 0.7,
    metalness: 0.4,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: isNightOrSunset ? 0xfff176 : 0x78909c,
    emissive: isNightOrSunset ? 0xf57f17 : 0x000000,
    emissiveIntensity: isNightOrSunset ? 1.6 : 0.0,
    roughness: 0.15,
  });

  const width = 7.4;
  const height = 4.8;
  const depth = 4.2;

  // 1. Factory Main Brick Core
  const core = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), brickMat);
  core.position.y = height / 2;
  core.castShadow = true;
  core.receiveShadow = true;
  group.add(core);

  // 2. Heavy Sliding Iron Cargo Doors
  const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.5, 0.15), ironMat);
  leftDoor.position.set(-0.7, 1.25, depth / 2 + 0.08);
  leftDoor.castShadow = true;
  group.add(leftDoor);

  const rightDoor = leftDoor.clone();
  rightDoor.position.x = 0.7;
  group.add(rightDoor);

  // Sliding cross beams on the doors
  const crossBeamGeo = new THREE.BoxGeometry(2.4, 0.12, 0.2);
  const beam = new THREE.Mesh(crossBeamGeo, ironMat);
  beam.position.set(0, 2.6, depth / 2 + 0.1);
  group.add(beam);

  // 3. Arched Grid Windows (Left & Right)
  const windowGeo = new THREE.BoxGeometry(1.6, 1.8, 0.25);
  const leftWin = new THREE.Mesh(windowGeo, glassMat);
  leftWin.position.set(-2.2, 2.2, depth / 2 + 0.05);
  group.add(leftWin);

  const rightWin = leftWin.clone();
  rightWin.position.x = 2.2;
  group.add(rightWin);

  // Window grid details
  for (let wX = -1; wX <= 1; wX += 2) {
    const gridH = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.3), ironMat);
    gridH.position.set(wX * 2.2, 2.2, depth / 2 + 0.1);
    group.add(gridH);

    const gridV = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.7, 0.3), ironMat);
    gridV.position.set(wX * 2.2, 2.2, depth / 2 + 0.1);
    group.add(gridV);
  }

  // 4. Industrial Sawtooth Roof (Classic Factory aesthetic!)
  const roof = new THREE.Group();
  const spanW = width / 2;
  for (let s = 0; s < 2; s++) {
    const rx = -width / 2 + spanW / 2 + s * spanW;
    const peakHeight = 1.2;

    // Slanted steep slope
    const slope = new THREE.Mesh(new THREE.BoxGeometry(spanW * 1.15, 0.15, depth + 0.2), roofMat);
    slope.rotation.z = 0.55;
    slope.position.set(rx - 0.2, height + peakHeight / 2 - 0.1, 0);
    slope.castShadow = true;
    roof.add(slope);

    // Vertical window face
    const verticalFace = new THREE.Mesh(new THREE.BoxGeometry(0.12, peakHeight, depth), glassMat);
    verticalFace.position.set(rx + spanW / 2 - 0.1, height + peakHeight / 2, 0);
    verticalFace.castShadow = true;
    roof.add(verticalFace);
  }
  group.add(roof);

  // 5. Vintage Brick Chimney / Smokestack
  const chimney = new THREE.Group();
  chimney.position.set(width / 2 - 0.65, 0, -depth / 2 + 0.65);

  const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.55, 6.8, 10), brickMat);
  stack.position.y = 3.4;
  stack.castShadow = true;
  stack.receiveShadow = true;
  chimney.add(stack);

  // Reinforcement iron bands around smokestack
  for (let bY = 1.5; bY <= 6.0; bY += 1.5) {
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.51, 0.51, 0.1, 10), ironMat);
    band.position.y = bY;
    chimney.add(band);
  }

  // Black soot metal lip on top of stack
  const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.25, 10), ironMat);
  lip.position.y = 6.8 + 0.125;
  chimney.add(lip);

  group.add(chimney);

  return group;
}

/**
 * 11c. DOUBLE-GABLED DOUBLE HOUSE (Larger double-width multi-tier property with balconies)
 */
export function createDoubleGabledHouse(isNightOrSunset = false, customColorHex?: number): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Double Gabled Mansion';

  const woodMat = new THREE.MeshStandardMaterial({
    color: customColorHex !== undefined ? customColorHex : 0x2c3e50, // Slate Blue
    roughness: 0.6,
  });

  const brickMat = new THREE.MeshStandardMaterial({
    color: 0x78909c, // Soft limestone/granite lower level
    roughness: 0.8,
  });

  const trimMat = new THREE.MeshStandardMaterial({
    color: 0xfafafa, // Bright white trim
    roughness: 0.4,
  });

  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x212121, // Charcoal roof tiles
    roughness: 0.55,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: isNightOrSunset ? 0xffea00 : 0x88ccff,
    emissive: isNightOrSunset ? 0xffb300 : 0x000000,
    emissiveIntensity: isNightOrSunset ? 1.6 : 0.0,
    roughness: 0.1,
  });

  const width = 8.8; // Beautiful extra wide
  const height = 5.6;
  const depth = 4.2;

  // 1. Ground Level (Limestone block finish)
  const groundFloor = new THREE.Mesh(new THREE.BoxGeometry(width, height * 0.48, depth), brickMat);
  groundFloor.position.y = (height * 0.48) / 2;
  groundFloor.castShadow = true;
  groundFloor.receiveShadow = true;
  group.add(groundFloor);

  // 2. Upper Level (Slate wood cladding finish)
  const upperFloor = new THREE.Mesh(new THREE.BoxGeometry(width - 0.2, height * 0.52, depth - 0.2), woodMat);
  upperFloor.position.y = (height * 0.48) + (height * 0.52) / 2;
  upperFloor.castShadow = true;
  upperFloor.receiveShadow = true;
  group.add(upperFloor);

  // Dividing trim line
  const midTrim = new THREE.Mesh(new THREE.BoxGeometry(width + 0.1, 0.15, depth + 0.1), trimMat);
  midTrim.position.y = height * 0.48;
  group.add(midTrim);

  // 3. Double Gabled Roofs (Parallel twin pitched roofs)
  const roofGroup = new THREE.Group();
  roofGroup.name = "Twin Pitched Roofs";

  const gW = width / 2 + 0.1;
  const gL = depth + 0.4;
  const gH = 1.8;

  for (let r = 0; r < 2; r++) {
    const rx = -width / 4 + r * (width / 2);
    const roofBaseY = height;

    const angle = Math.atan2(gH, gW / 2);
    const slopeW = Math.sqrt((gW / 2) ** 2 + gH ** 2) + 0.1;

    const leftS = new THREE.Mesh(new THREE.BoxGeometry(slopeW, 0.15, gL), roofMat);
    leftS.position.set(rx - gW / 4, roofBaseY + gH / 2, 0);
    leftS.rotation.z = angle;
    leftS.castShadow = true;
    roofGroup.add(leftS);

    const rightS = new THREE.Mesh(new THREE.BoxGeometry(slopeW, 0.15, gL), roofMat);
    rightS.position.set(rx + gW / 4, roofBaseY + gH / 2, 0);
    rightS.rotation.z = -angle;
    rightS.castShadow = true;
    roofGroup.add(rightS);

    // Decorative white gable triangle boards
    const trShape = new THREE.Shape();
    trShape.moveTo(-gW / 2, 0);
    trShape.lineTo(gW / 2, 0);
    trShape.lineTo(0, gH);
    trShape.closePath();

    const gable = new THREE.Mesh(new THREE.ExtrudeGeometry(trShape, { depth: 0.1, bevelEnabled: false }), trimMat);
    gable.position.set(rx, roofBaseY, depth / 2 - 0.05);
    gable.castShadow = true;
    roofGroup.add(gable);
  }
  group.add(roofGroup);

  // 4. Front Ornamental Wooden Balcony on Second Level
  const balcony = new THREE.Group();
  balcony.position.set(0, height * 0.48, depth / 2 - 0.05);

  const deck = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.12, 0.95), trimMat);
  deck.position.set(0, 0.06, 0.475);
  deck.castShadow = true;
  balcony.add(deck);

  // Balcony railings (Wooden post balusters)
  const railingGeo = new THREE.BoxGeometry(0.06, 0.85, 0.06);
  const numBalusters = 12;
  for (let b = 0; b < numBalusters; b++) {
    const bx = -2.5 + (b * 5.0) / (numBalusters - 1);
    const post = new THREE.Mesh(railingGeo, trimMat);
    post.position.set(bx, 0.45, 0.9);
    post.castShadow = true;
    balcony.add(post);
  }

  // Side railings
  const sidePostL = new THREE.Mesh(railingGeo, trimMat);
  sidePostL.position.set(-2.5, 0.45, 0.45);
  balcony.add(sidePostL);

  const sidePostR = sidePostL.clone();
  sidePostR.position.x = 2.5;
  balcony.add(sidePostR);

  // Handrail
  const handrail = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.06, 0.1), trimMat);
  handrail.position.set(0, 0.88, 0.9);
  balcony.add(handrail);

  group.add(balcony);

  // 5. Windows & Doors
  // Symmetrical Double Front Doors on Ground Level
  const doorGroup = new THREE.Group();
  doorGroup.position.set(0, 0, depth / 2 + 0.02);

  const doorWood = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.1, 0.15), trimMat);
  doorWood.position.y = 1.05;
  doorGroup.add(doorWood);

  const dWindow = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.3, 0.18), glassMat);
  dWindow.position.set(0, 1.25, 0.02);
  doorGroup.add(dWindow);

  group.add(doorGroup);

  // Symmetrical Windows on lower and upper levels
  const winGeo = new THREE.BoxGeometry(1.1, 1.5, 0.25);

  const leftWinL = new THREE.Mesh(winGeo, glassMat);
  leftWinL.position.set(-2.8, 1.4, depth / 2 + 0.05);
  group.add(leftWinL);

  const rightWinL = leftWinL.clone();
  rightWinL.position.x = 2.8;
  group.add(rightWinL);

  // Upper Windows (leading to balcony)
  const leftWinU = new THREE.Mesh(winGeo, glassMat);
  leftWinU.position.set(-1.8, 3.8, depth / 2 + 0.05);
  group.add(leftWinU);

  const rightWinU = leftWinU.clone();
  rightWinU.position.x = 1.8;
  group.add(rightWinU);

  return group;
}

/**
 * 11d. ORNAMENTAL HOUSE HEDGE (Tiered designed boxwood with stone base & gold topiary accents)
 */
export function createOrnamentalHouseHedge(w: number, h: number, d: number): THREE.Group {
  const group = new THREE.Group();
  group.name = "Ornamental House Hedge";

  // Slate stone base planter
  const slateMat = new THREE.MeshStandardMaterial({
    color: 0x2c3540, // Elegant deep charcoal blue slate
    roughness: 0.8,
  });

  const planter = new THREE.Mesh(new THREE.BoxGeometry(w, 0.35, d), slateMat);
  planter.position.y = 0.175;
  planter.castShadow = true;
  planter.receiveShadow = true;
  group.add(planter);

  // Main lush organic hedge body (Multi-tone dark green)
  const hedgeMat = new THREE.MeshStandardMaterial({
    color: 0x1b3f15, // Lush botanical green
    roughness: 0.95,
  });

  const bushMesh = new THREE.Mesh(new THREE.BoxGeometry(w - 0.05, h - 0.45, d - 0.05), hedgeMat);
  bushMesh.position.y = 0.35 + (h - 0.45) / 2;
  bushMesh.castShadow = true;
  bushMesh.receiveShadow = true;
  group.add(bushMesh);

  // Topiary spheres with golden brass cuffs on top!
  const topiaryMat = new THREE.MeshStandardMaterial({
    color: 0x2a5423, // Bright boxwood topiary green
    roughness: 0.9,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Warm brushed white silver collar (changed from gold)
    roughness: 0.3,
    metalness: 0.8,
  });

  const minDim = Math.min(w, d);
  const sphereGeo = new THREE.SphereGeometry(minDim * 0.65, 12, 12);

  // Place beautiful topiary spheres on top of the hedge along the longer dimension
  const isAlongZ = d > w;
  const longDim = isAlongZ ? d : w;
  const offsets = [-longDim / 3.2, 0, longDim / 3.2];

  offsets.forEach((offset) => {
    // 1. Golden brass trim collar
    const trim = new THREE.Mesh(new THREE.CylinderGeometry(minDim * 0.35, minDim * 0.35, 0.08, 8), goldMat);
    if (isAlongZ) {
      trim.position.set(0, h - 0.1, offset);
    } else {
      trim.position.set(offset, h - 0.1, 0);
    }
    trim.castShadow = true;
    group.add(trim);

    // 2. Boxwood sphere
    const topiary = new THREE.Mesh(sphereGeo, topiaryMat);
    if (isAlongZ) {
      topiary.position.set(0, h, offset);
    } else {
      topiary.position.set(offset, h, 0);
    }
    topiary.castShadow = true;
    group.add(topiary);
  });

  return group;
}

/**
 * 12. ORNAMENTAL PARK ENTRANCE GATE
 * Features grand brick pillars, a decorative iron overhead archway,
 * and double iron doors that are either swung CLOSED (locked) or OPENED 90 degrees!
 */
export function createParkEntranceGate(isLocked = true): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Park Entrance Gate';

  const brickMat = new THREE.MeshStandardMaterial({
    color: 0x5d4037, // Elegant dark brown masonry brick
    roughness: 0.85,
  });

  const stoneTrimMat = new THREE.MeshStandardMaterial({
    color: 0xcfd8dc, // Elegant off-white ashlar stone caps
    roughness: 0.6,
  });

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x111111, // True black forged iron
    roughness: 0.35,
    metalness: 0.85,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Shiny white plaque & highlights (changed from gold)
    roughness: 0.2,
    metalness: 0.9,
    emissive: 0x222222,
  });

  const bulbGlowMat = new THREE.MeshBasicMaterial({
    color: 0xffe082, // Warm glowing bulb
  });

  const pillarW = 0.8; // Thicker grander pillars
  const pillarH = 3.8; // Taller
  const gateSpanWidth = 4.2; // Wider gate span

  // 1. Two Grand Layered Pillars (Left & Right)
  const buildPillar = (xPos: number) => {
    const pGroup = new THREE.Group();
    pGroup.position.set(xPos, 0, 0);

    // Concrete foot
    const foot = new THREE.Mesh(new THREE.BoxGeometry(pillarW + 0.2, 0.4, pillarW + 0.2), stoneTrimMat);
    foot.position.y = 0.2;
    foot.castShadow = true;
    pGroup.add(foot);

    // Main brick body
    const body = new THREE.Mesh(new THREE.BoxGeometry(pillarW, pillarH, pillarW), brickMat);
    body.position.y = pillarH / 2 + 0.2;
    body.castShadow = true;
    body.receiveShadow = true;
    pGroup.add(body);

    // Stone decorative banding in the middle
    const band = new THREE.Mesh(new THREE.BoxGeometry(pillarW + 0.08, 0.25, pillarW + 0.08), stoneTrimMat);
    band.position.y = pillarH / 2 + 0.2;
    band.castShadow = true;
    pGroup.add(band);

    const goldBand = new THREE.Mesh(new THREE.BoxGeometry(pillarW + 0.1, 0.08, pillarW + 0.1), goldMat);
    goldBand.position.y = pillarH * 0.75 + 0.2;
    pGroup.add(goldBand);

    // Top stone cap
    const cap = new THREE.Mesh(new THREE.BoxGeometry(pillarW + 0.16, 0.3, pillarW + 0.16), stoneTrimMat);
    cap.position.y = pillarH + 0.35;
    cap.castShadow = true;
    pGroup.add(cap);

    // Gold decorative spire on top of cap
    const spireGeo = new THREE.ConeGeometry(0.18, 0.5, 4);
    const spire = new THREE.Mesh(spireGeo, goldMat);
    spire.position.y = pillarH + 0.75;
    spire.rotation.y = Math.PI / 4;
    spire.castShadow = true;
    pGroup.add(spire);

    // Hanging Ornamental Lantern
    const lantern = new THREE.Group();
    lantern.position.set(xPos > 0 ? -pillarW / 2 - 0.25 : pillarW / 2 + 0.25, pillarH * 0.7, 0);
    
    // Bracket arm
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 0.06), ironMat);
    bracket.position.x = xPos > 0 ? 0.2 : -0.2;
    lantern.add(bracket);

    // Lantern cap
    const lCap = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.2), ironMat);
    lCap.position.y = -0.1;
    lantern.add(lCap);

    // Bulb
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), bulbGlowMat);
    bulb.position.y = -0.2;
    lantern.add(bulb);

    // Cage
    const cage = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.25, 4, 1, true), ironMat);
    cage.position.y = -0.22;
    lantern.add(cage);

    pGroup.add(lantern);

    return pGroup;
  };

  const leftPillar = buildPillar(-gateSpanWidth / 2 - pillarW / 2);
  group.add(leftPillar);

  const rightPillar = buildPillar(gateSpanWidth / 2 + pillarW / 2);
  group.add(rightPillar);

  // 2. Majestic Overhead Decorative Stone & Iron Arch
  const archGroup = new THREE.Group();
  archGroup.position.set(0, pillarH + 0.35, 0);

  // Thick header stone beam spanning pillars
  const beamGeo = new THREE.BoxGeometry(gateSpanWidth + pillarW, 0.3, 0.5);
  const beam = new THREE.Mesh(beamGeo, stoneTrimMat);
  beam.position.y = 0.15;
  beam.castShadow = true;
  archGroup.add(beam);

  // Ornate Iron crest on top of the beam
  const crestGeo = new THREE.TorusGeometry(1.5, 0.05, 8, 24, Math.PI);
  const crest = new THREE.Mesh(crestGeo, ironMat);
  crest.position.set(0, 0.3, 0);
  crest.castShadow = true;
  archGroup.add(crest);

  // Grand Gold Plaque welcoming visitors
  const plaqueGeo = new THREE.BoxGeometry(1.8, 0.45, 0.12);
  const plaque = new THREE.Mesh(plaqueGeo, goldMat);
  plaque.position.set(0, 0.15, 0.26); // Mounted on front face of stone beam
  archGroup.add(plaque);

  // Little black frame around plaque
  const frameGeo = new THREE.BoxGeometry(1.9, 0.55, 0.06);
  const frame = new THREE.Mesh(frameGeo, ironMat);
  frame.position.set(0, 0.15, 0.21);
  archGroup.add(frame);

  group.add(archGroup);

  // 3. Double Wrought-Iron Gate Wings (with hinges)
  const leftGateWing = new THREE.Group();
  leftGateWing.position.set(-gateSpanWidth / 2, 0, 0);

  // Left Gate main frame
  const wingW = gateSpanWidth / 2 - 0.05;
  const wingH = 2.4;
  const wingFrame = new THREE.Mesh(new THREE.BoxGeometry(wingW, 0.1, 0.05), ironMat);
  wingFrame.position.set(wingW / 2, wingH - 0.05, 0);
  leftGateWing.add(wingFrame);

  const bottomFrame = new THREE.Mesh(new THREE.BoxGeometry(wingW, 0.1, 0.05), ironMat);
  bottomFrame.position.set(wingW / 2, 0.05, 0);
  leftGateWing.add(bottomFrame);

  const sideFrame = new THREE.Mesh(new THREE.BoxGeometry(0.08, wingH, 0.05), ironMat);
  sideFrame.position.set(wingW - 0.04, wingH / 2, 0);
  leftGateWing.add(sideFrame);

  // Vertical iron pickets with gold spear points
  const numPickets = 7;
  for (let i = 0; i < numPickets; i++) {
    const px = 0.2 + i * ((wingW - 0.3) / (numPickets - 1));
    const pHeight = wingH - 0.1 - (i * 0.08); // curved top profile
    const picket = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, pHeight, 4), ironMat);
    picket.position.set(px, pHeight / 2 + 0.05, 0);
    picket.castShadow = true;
    leftGateWing.add(picket);

    // Spear head
    const spear = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.12, 4), goldMat);
    spear.position.set(px, pHeight + 0.1, 0);
    spear.rotation.y = Math.PI / 4;
    leftGateWing.add(spear);
  }

  // Right Gate Wing (Mirrored)
  const rightGateWing = new THREE.Group();
  rightGateWing.position.set(gateSpanWidth / 2, 0, 0);

  const rWingFrame = new THREE.Mesh(new THREE.BoxGeometry(wingW, 0.1, 0.05), ironMat);
  rWingFrame.position.set(-wingW / 2, wingH - 0.05, 0);
  rightGateWing.add(rWingFrame);

  const rBottomFrame = new THREE.Mesh(new THREE.BoxGeometry(wingW, 0.1, 0.05), ironMat);
  rBottomFrame.position.set(-wingW / 2, 0.05, 0);
  rightGateWing.add(rBottomFrame);

  const rSideFrame = new THREE.Mesh(new THREE.BoxGeometry(0.08, wingH, 0.05), ironMat);
  rSideFrame.position.set(-wingW + 0.04, wingH / 2, 0);
  rightGateWing.add(rSideFrame);

  for (let i = 0; i < numPickets; i++) {
    const px = -0.2 - i * ((wingW - 0.3) / (numPickets - 1));
    const pHeight = wingH - 0.1 - (i * 0.08);
    const picket = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, pHeight, 4), ironMat);
    picket.position.set(px, pHeight / 2 + 0.05, 0);
    picket.castShadow = true;
    rightGateWing.add(picket);

    const spear = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.12, 4), goldMat);
    spear.position.set(px, pHeight + 0.1, 0);
    spear.rotation.y = Math.PI / 4;
    rightGateWing.add(spear);
  }

  // Swinging animation logic is handled based on state: isLocked or not
  if (isLocked) {
    leftGateWing.rotation.y = 0;
    rightGateWing.rotation.y = 0;
  } else {
    leftGateWing.rotation.y = -Math.PI / 2.3; // Swing open nicely outwards
    rightGateWing.rotation.y = Math.PI / 2.3;
  }

  group.add(leftGateWing);
  group.add(rightGateWing);

  return group;
}

/**
 * 13. GOLDEN GLOWING KEY (Scavenger hunt pick-up item)
 */
export function createGlowingKey(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Golden Key';

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Glowing silver/white (changed from gold)
    roughness: 0.1,
    metalness: 0.95,
    emissive: 0xcccccc,
    emissiveIntensity: 1.0,
  });

  // Key Head (ring handle)
  const headGeo = new THREE.TorusGeometry(0.2, 0.04, 8, 16);
  const head = new THREE.Mesh(headGeo, goldMat);
  head.castShadow = true;
  group.add(head);

  // Key Shaft
  const shaftGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.6, 8);
  const shaft = new THREE.Mesh(shaftGeo, goldMat);
  shaft.position.y = -0.32;
  shaft.rotation.z = 0;
  shaft.castShadow = true;
  group.add(shaft);

  // Key Teeth (bit)
  const bitGroup = new THREE.Group();
  bitGroup.position.set(0.08, -0.52, 0);

  const tooth1Geo = new THREE.BoxGeometry(0.12, 0.05, 0.05);
  const tooth1 = new THREE.Mesh(tooth1Geo, goldMat);
  tooth1.position.y = 0.05;
  bitGroup.add(tooth1);

  const tooth2Geo = new THREE.BoxGeometry(0.1, 0.05, 0.05);
  const tooth2 = new THREE.Mesh(tooth2Geo, goldMat);
  tooth2.position.set(-0.01, -0.05, 0);
  bitGroup.add(tooth2);

  group.add(bitGroup);

  // Add a nice pulsing floating light inside the key
  const keyLight = new THREE.PointLight(0xffea00, 3.0, 3.5);
  keyLight.position.set(0, -0.2, 0);
  group.add(keyLight);

  // Orient key nicely (upside down vertical)
  group.rotation.x = Math.PI / 2;

  return group;
}

/**
 * 14. STONE SIGN MONUMENT "GRAND PARK"
 * Sculpted as an imposing granite monolith with real three-dimensional 
 * gold/stone voxel letters spelling out "GRAND PARK"
 */
export function createGrandParkStatue(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Grand Park Statue';

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x546e7a, // Regal slate grey granite
    roughness: 0.95,
    metalness: 0.0,
  });

  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x37474f, // Deep dark iron slate base
    roughness: 0.95,
    metalness: 0.0,
  });

  const goldLetterMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Polished white/silver letters (changed from gold)
    roughness: 0.95,
    metalness: 0.0,
  });

  // Base Pedestal (Layered step monument)
  // Step 1: Bottom foundation
  const step1 = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.9, 2.5), baseMat);
  step1.position.y = 0.45;
  step1.castShadow = true;
  step1.receiveShadow = true;
  group.add(step1);

  // Step 2: Middle pedestal body (Thicker and taller!)
  const step2 = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.8, 1.8), stoneMat);
  step2.position.y = 1.8;
  step2.castShadow = true;
  step2.receiveShadow = true;
  group.add(step2);

  // Step 3: Top decorative capping
  const step3 = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.2, 2.1), baseMat);
  step3.position.y = 2.8;
  step3.castShadow = true;
  group.add(step3);

  // Decorative side columns
  const leftCol = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.8, 8), baseMat);
  leftCol.position.set(-2.7, 1.8, 0);
  leftCol.castShadow = true;
  group.add(leftCol);

  const rightCol = leftCol.clone();
  rightCol.position.x = 2.7;
  group.add(rightCol);

  // 3x5 voxel matrices for G R A N D P A R K
  const chars: { [key: string]: number[][] } = {
    G: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 1],
      [1, 0, 1],
      [1, 1, 1]
    ],
    R: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1]
    ],
    A: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
      [1, 0, 1],
      [1, 0, 1]
    ],
    N: [
      [1, 0, 1],
      [1, 1, 1],
      [1, 1, 1],
      [1, 0, 1],
      [1, 0, 1]
    ],
    D: [
      [1, 1, 0],
      [1, 0, 1],
      [1, 0, 1],
      [1, 0, 1],
      [1, 1, 0]
    ],
    P: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0]
    ],
    K: [
      [1, 0, 1],
      [1, 0, 1],
      [1, 1, 0],
      [1, 0, 1],
      [1, 0, 1]
    ]
  };

  const drawWord = (word: string, startX: number, startY: number, size: number) => {
    const spacing = size * 4; // horizontal spacing between characters
    const pixelSize = size;   // size of each voxel block

    for (let c = 0; c < word.length; c++) {
      const char = word[c];
      const matrix = chars[char];
      if (!matrix) continue;

      const charOffset = startX + c * spacing;

      for (let r = 0; r < 5; r++) {
        for (let col = 0; col < 3; col++) {
          if (matrix[r][col] === 1) {
            const voxelGeo = new THREE.BoxGeometry(pixelSize, pixelSize, pixelSize * 1.5);
            const voxel = new THREE.Mesh(voxelGeo, goldLetterMat);
            const px = charOffset + col * pixelSize;
            const py = startY + (4 - r) * pixelSize;
            const pz = 0.95; // Mounted on the front face of the step2 stone plaque
            voxel.position.set(px, py, pz);
            voxel.castShadow = true;
            group.add(voxel);
          }
        }
      }
    }
  };

  // Draw PARK (4 letters) centered on the elevated monument plaque
  drawWord('PARK', -1.3, 1.32, 0.18);

  // Add decorative stone spheres on top (Elevated on top of Step 3 at y = 3.1)
  const sphereGeo = new THREE.SphereGeometry(0.24, 12, 12);
  const leftSphere = new THREE.Mesh(sphereGeo, baseMat);
  leftSphere.position.set(-2.0, 3.1, 0);
  leftSphere.castShadow = true;
  group.add(leftSphere);

  const rightSphere = leftSphere.clone();
  rightSphere.position.x = 2.0;
  group.add(rightSphere);

  return group;
}

/**
 * 15. THE BIG G MONUMENT (The spectacular centerpiece)
 */
export function createBigGMonument(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Big G Monument';

  // Materials
  const marbleMat = new THREE.MeshStandardMaterial({
    color: 0xfafafa, // Polished white imperial marble
    roughness: 0.95,
    metalness: 0.0,
  });

  const grayMetalMat = new THREE.MeshStandardMaterial({
    color: 0x78909c, // Beautiful slate grey metal
    roughness: 0.95,
    metalness: 0.0,
  });

  const whiteRingMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Pristine white rings
    roughness: 0.95,
    metalness: 0.0,
  });

  // 1. Triple-tiered stately octagonal base steps (Stunning contrast: Step 1 in Grey Metal, Step 2 & 3 in White Marble)
  const step1 = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.8, 0.35, 8), grayMetalMat);
  step1.position.y = 0.175;
  step1.receiveShadow = true;
  step1.castShadow = true;
  group.add(step1);

  const step2 = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.0, 0.35, 8), marbleMat);
  step2.position.y = 0.525;
  step2.receiveShadow = true;
  step2.castShadow = true;
  group.add(step2);

  const step3 = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.2, 0.35, 8), marbleMat);
  step3.position.y = 0.875;
  step3.receiveShadow = true;
  step3.castShadow = true;
  group.add(step3);

  // 2. Main cylindrical marble pedestal column
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.45, 1.2, 16), marbleMat);
  pedestal.position.y = 1.65;
  pedestal.receiveShadow = true;
  pedestal.castShadow = true;
  group.add(pedestal);

  // 3. Gray metal ring trims around pedestal top and bottom
  const trim1 = new THREE.Mesh(new THREE.CylinderGeometry(1.48, 1.48, 0.1, 16), grayMetalMat);
  trim1.position.y = 1.1;
  trim1.castShadow = true;
  group.add(trim1);

  const trim2 = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.1, 16), grayMetalMat);
  trim2.position.y = 2.2;
  trim2.castShadow = true;
  group.add(trim2);

  // 4. The Giant "G" sculpture (Styled in beautiful polished white crystal glass)
  const gGroup = new THREE.Group();
  gGroup.name = 'BigG_Letter';
  gGroup.position.set(0, 4.3, 0); // Center of the 'G' is floating at y = 4.3 (perfectly centered in the rings)

  // Highly polished premium crystal white material
  const shinyCrystalMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Bright white
    roughness: 0.95, // Matte so no dynamic highlights
    metalness: 0.0,
  });

  // Main circular sweep of the G: A Torus representing the outer arc of G
  const arcGeo = new THREE.TorusGeometry(1.15, 0.23, 16, 64, Math.PI * 1.64);
  const arcMesh = new THREE.Mesh(arcGeo, shinyCrystalMat);
  arcMesh.rotation.z = Math.PI * 0.18; // Pre-rotate so the gap is positioned on the right (East)
  arcMesh.castShadow = true;
  gGroup.add(arcMesh);

  // Horizontal crossbar of G pointing towards the center from the right tip
  const barGeo = new THREE.BoxGeometry(0.78, 0.46, 0.46);
  const barMesh = new THREE.Mesh(barGeo, shinyCrystalMat);
  barMesh.position.set(0.44, -0.15, 0); // Positioned perfectly within the right gap
  barMesh.castShadow = true;
  gGroup.add(barMesh);

  // Vertical base stub of G supporting the lower right segment
  const vertGeo = new THREE.BoxGeometry(0.46, 0.65, 0.46);
  const vertMesh = new THREE.Mesh(vertGeo, shinyCrystalMat);
  vertMesh.position.set(0.82, -0.42, 0); // Aligned at the bottom-right opening
  vertMesh.castShadow = true;
  gGroup.add(vertMesh);

  // Upper serif cap in Grey Metal for a striking design accent
  const capSerifGeo = new THREE.BoxGeometry(0.46, 0.12, 0.46);
  const capSerif = new THREE.Mesh(capSerifGeo, grayMetalMat);
  capSerif.position.set(0.67, 0.95, 0);
  capSerif.rotation.z = -Math.PI / 6;
  capSerif.castShadow = true;
  gGroup.add(capSerif);

  group.add(gGroup);

  // 5. Dual Grey Metal Rings in white + grey design (Static, matching the stately monument request)
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.14, 16, 64), whiteRingMat);
  ring1.position.set(0, 4.3, 0);
  ring1.rotation.x = Math.PI / 3;
  ring1.name = 'NeonRingLeft';
  ring1.castShadow = true;
  group.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.14, 16, 64), whiteRingMat);
  ring2.position.set(0, 4.3, 0);
  ring2.rotation.x = -Math.PI / 3;
  ring2.name = 'NeonRingRight';
  ring2.castShadow = true;
  group.add(ring2);

  return group;
}

/**
 * 16. PARK CLOCK TOWER (A majestic, detailed monument displaying park time)
 */
export function createClockTower(isNightOrSunset = false): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Park Clock Tower';

  // Materials
  const brickMat = new THREE.MeshStandardMaterial({
    color: 0xfbfbfb, // Stunning white polished marble base
    roughness: 0.2,
    metalness: 0.05,
  });

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Pristine white limestone
    roughness: 0.3,
  });

  const darkStoneMat = new THREE.MeshStandardMaterial({
    color: 0x263238, // Rich dark granite/slate highlights
    roughness: 0.6,
  });

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x111111, // Wrought iron railings
    roughness: 0.6,
    metalness: 0.8,
  });

  const copperRoofMat = new THREE.MeshStandardMaterial({
    color: 0x4db6ac, // Classic oxidized copper green dome roof
    roughness: 0.4,
    metalness: 0.3,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: isNightOrSunset ? 0xffeb3b : 0x81d4fa,
    emissive: isNightOrSunset ? 0xffb300 : 0x000000,
    emissiveIntensity: isNightOrSunset ? 1.8 : 0.0,
    roughness: 0.1,
  });

  const dialMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Polished white dial
    emissive: isNightOrSunset ? 0xfff9c4 : 0x000000,
    emissiveIntensity: isNightOrSunset ? 1.5 : 0.0,
    roughness: 0.15,
  });

  const lightPurpleMat = new THREE.MeshStandardMaterial({
    color: 0xffd700, // Shiny gold / polished brass detailing
    roughness: 0.15,
    metalness: 0.9
  });

  const handsMat = new THREE.MeshStandardMaterial({
    color: 0x111111, // Antique black hands
    roughness: 0.3,
    metalness: 0.8,
  });

  // 1. Triple-Tiered Base Foundation with OPEN Archway Entry Gate
  const step1 = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.45, 4.0), darkStoneMat);
  step1.position.y = 0.225;
  step1.castShadow = true;
  step1.receiveShadow = true;
  group.add(step1);

  const step2 = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.45, 3.5), stoneMat);
  step2.position.y = 0.45 + 0.225;
  step2.castShadow = true;
  step2.receiveShadow = true;
  group.add(step2);

  // 2. Main red-brick foundation lower shaft (Hollowed-out design for entry gate)
  const foundationHeight = 3.6;
  const foundationY = 0.9 + foundationHeight / 2;
  
  // Left pillar of entry gate
  const pillarL = new THREE.Mesh(new THREE.BoxGeometry(0.8, foundationHeight, 2.4), brickMat);
  pillarL.position.set(-1.1, foundationY, 0);
  pillarL.castShadow = true;
  pillarL.receiveShadow = true;
  group.add(pillarL);

  // Right pillar of entry gate
  const pillarR = new THREE.Mesh(new THREE.BoxGeometry(0.8, foundationHeight, 2.4), brickMat);
  pillarR.position.set(1.1, foundationY, 0);
  pillarR.castShadow = true;
  pillarR.receiveShadow = true;
  group.add(pillarR);

  // Back wall of the tower base
  const backWallBase = new THREE.Mesh(new THREE.BoxGeometry(1.4, foundationHeight, 0.6), brickMat);
  backWallBase.position.set(0, foundationY, -0.9);
  backWallBase.castShadow = true;
  backWallBase.receiveShadow = true;
  group.add(backWallBase);

  // Lintol arch above the open entrance gate
  const archTop = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.8, 2.4), brickMat);
  archTop.position.set(0, 0.9 + foundationHeight - 0.4, 0);
  archTop.castShadow = true;
  archTop.receiveShadow = true;
  group.add(archTop);

  // Beautiful Ornamental arch frame around the door (Now polished gold!)
  const gateFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.15), lightPurpleMat);
  gateFrame.position.set(0, 0.9 + 1.2, 1.2);
  group.add(gateFrame);

  // Elegant White Glass doors representing the required "door must white glass"
  const whiteGlassMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
    emissive: 0xffffff,
    emissiveIntensity: 0.4 // Beautiful shining white glass
  });

  const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.66, 2.2, 0.04), whiteGlassMat);
  doorL.position.set(-0.34, 0.9 + 1.1, 1.2);
  doorL.castShadow = true;
  group.add(doorL);

  const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.66, 2.2, 0.04), whiteGlassMat);
  doorR.position.set(0.34, 0.9 + 1.1, 1.2);
  doorR.castShadow = true;
  group.add(doorR);

  // Tiny polished gold handle bars
  const handleL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8), lightPurpleMat);
  handleL.position.set(-0.04, 0.9 + 1.1, 1.23);
  group.add(handleL);

  const handleR = handleL.clone();
  handleR.position.x = 0.04;
  group.add(handleR);

  // Inner open cavity represented by a hollow black interior backing
  const entryCavity = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.3, 0.05), darkStoneMat);
  entryCavity.position.set(0, 0.9 + 1.15, -0.55);
  group.add(entryCavity);

  // Cozy seat bench INSIDE the open entrance gate
  const innerBench = new THREE.Group();
  innerBench.position.set(0, 0.9, -0.4);
  const benchSeat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.35), lightPurpleMat);
  benchSeat.position.y = 0.4;
  innerBench.add(benchSeat);
  const benchLeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.3), darkStoneMat);
  benchLeg1.position.set(-0.5, 0.2, 0);
  innerBench.add(benchLeg1);
  const benchLeg2 = benchLeg1.clone();
  benchLeg2.position.x = 0.5;
  innerBench.add(benchLeg2);
  group.add(innerBench);

  // Decorative white limestone quoins (corner stones)
  const quoinGeo = new THREE.BoxGeometry(0.24, 0.22, 0.24);
  for (let q = 0; q < 12; q++) {
    const qy = 0.9 + q * 0.3 + 0.15;
    const corners = [
      { x: -1.5, z: -1.2 },
      { x: 1.5, z: -1.2 },
      { x: -1.5, z: 1.2 },
      { x: 1.5, z: 1.2 }
    ];
    corners.forEach((c) => {
      const quoin = new THREE.Mesh(quoinGeo, stoneMat);
      quoin.position.set(c.x, qy, c.z);
      quoin.castShadow = true;
      group.add(quoin);
    });
  }

  // 3. Stately Wrapping Balcony level with black iron railings
  const balconyY = 0.9 + foundationHeight; // 4.5
  const balconyDeck = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.22, 3.2), stoneMat);
  balconyDeck.position.y = balconyY + 0.11;
  balconyDeck.castShadow = true;
  group.add(balconyDeck);

  // Symmetrical iron handrails around the balcony deck
  const rHeight = 0.65;
  const balGroup = new THREE.Group();
  balGroup.position.y = balconyY + 0.22;

  // Railing bars
  const railGeo = new THREE.BoxGeometry(3.1, 0.04, 0.04);
  const leftR = new THREE.Mesh(railGeo, ironMat);
  leftR.position.set(0, rHeight, -1.55);
  balGroup.add(leftR);

  const rightR = leftR.clone();
  rightR.position.z = 1.55;
  balGroup.add(rightR);

  const frontR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 3.1), ironMat);
  frontR.position.set(-1.55, rHeight, 0);
  balGroup.add(frontR);

  const backR = frontR.clone();
  backR.position.x = 1.55;
  balGroup.add(backR);

  // Tiny vertical balusters
  const postGeo = new THREE.BoxGeometry(0.02, rHeight, 0.02);
  for (let p = -6; p <= 6; p++) {
    const offset = p * 0.24;
    // Front/Back
    const pf = new THREE.Mesh(postGeo, ironMat);
    pf.position.set(offset, rHeight / 2, -1.55);
    pf.castShadow = true;
    balGroup.add(pf);

    const pb = pf.clone();
    pb.position.z = 1.55;
    balGroup.add(pb);

    // Left/Right
    const pl = new THREE.Mesh(postGeo, ironMat);
    pl.position.set(-1.55, rHeight / 2, offset);
    pl.castShadow = true;
    balGroup.add(pl);

    const pr = pl.clone();
    pr.position.x = 1.55;
    balGroup.add(pr);
  }
  group.add(balGroup);

  // 4. Middle Tower Shaft in white limestone with gothic cathedral windows
  const shaftHeight = 4.2;
  const shaftY = balconyY + 0.22 + shaftHeight / 2; // 4.5 + 0.22 + 2.1 = 6.82
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(2.0, shaftHeight, 2.0), stoneMat);
  shaft.position.y = shaftY;
  shaft.castShadow = true;
  shaft.receiveShadow = true;
  group.add(shaft);

  // Arched Gothic glowing windows on all 4 faces
  const windowW = 0.55;
  const windowH = 1.8;
  const winBackGeo = new THREE.BoxGeometry(windowW, windowH, 0.1);
  const winFrameGeo = new THREE.BoxGeometry(windowW + 0.1, windowH + 0.1, 0.05);

  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const wx = Math.sin(angle) * 1.01;
    const wz = Math.cos(angle) * 1.01;

    const wGroup = new THREE.Group();
    wGroup.position.set(wx, shaftY, wz);
    wGroup.rotation.y = angle;

    // Glowing glass pane
    const pane = new THREE.Mesh(winBackGeo, glassMat);
    pane.castShadow = true;
    wGroup.add(pane);

    // Stone tracery/frame
    const frame = new THREE.Mesh(winFrameGeo, darkStoneMat);
    frame.position.z = -0.02;
    frame.castShadow = true;
    wGroup.add(frame);

    // Decorative gothic point on top of frame
    const pointGeo = new THREE.ConeGeometry(windowW / 2 + 0.05, 0.45, 4);
    const point = new THREE.Mesh(pointGeo, darkStoneMat);
    point.position.set(0, windowH / 2 + 0.18, -0.02);
    point.rotation.y = Math.PI / 4;
    point.castShadow = true;
    wGroup.add(point);

    group.add(wGroup);
  }

  // Stone crown molding above shaft
  const crownY = shaftY + shaftHeight / 2 + 0.15; // 8.92 + 0.15 = 9.07
  const crown = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 2.4), darkStoneMat);
  crown.position.y = crownY;
  crown.castShadow = true;
  group.add(crown);

  // 5. Clock Head Cabin with light purple dial bezels and ticks
  const headHeight = 2.0;
  const headY = crownY + 0.175 + headHeight / 2; // 9.07 + 0.175 + 1.0 = 10.245
  const head = new THREE.Mesh(new THREE.BoxGeometry(2.1, headHeight, 2.1), stoneMat);
  head.position.y = headY;
  head.castShadow = true;
  group.add(head);

  // Clock Dials on 4 sides with Light Purple Bezels & 12 hour ticks!
  const dialRadius = 0.62;
  const dialGeo = new THREE.CylinderGeometry(dialRadius, dialRadius, 0.08, 16);
  const bezelGeo = new THREE.TorusGeometry(dialRadius + 0.04, 0.05, 8, 24);

  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const dx = Math.sin(angle) * 1.06;
    const dz = Math.cos(angle) * 1.06;

    const clockFaceGroup = new THREE.Group();
    clockFaceGroup.position.set(dx, headY, dz);
    clockFaceGroup.rotation.y = angle;

    // 1. White dial plate
    const dial = new THREE.Mesh(dialGeo, dialMat);
    dial.rotation.x = Math.PI / 2;
    dial.castShadow = true;
    clockFaceGroup.add(dial);

    // 2. Glowing Light Purple Bezel frame ring!
    const bezel = new THREE.Mesh(bezelGeo, lightPurpleMat);
    bezel.position.z = 0.04;
    bezel.castShadow = true;
    clockFaceGroup.add(bezel);

    // 3. Ticks for hours
    const dotGeo = new THREE.BoxGeometry(0.04, 0.04, 0.05);
    for (let h = 0; h < 12; h++) {
      const hAngle = (h * Math.PI) / 6;
      const hx = Math.sin(hAngle) * (dialRadius - 0.1);
      const hy = Math.cos(hAngle) * (dialRadius - 0.1);
      const dot = new THREE.Mesh(dotGeo, lightPurpleMat);
      dot.position.set(hx, hy, 0.05);
      clockFaceGroup.add(dot);
    }

    // 4. Antique clock hands (Hour and Minute hands)
    const hands = new THREE.Group();
    hands.position.z = 0.06;

    const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.32, 0.015), handsMat);
    hourHand.position.y = 0.12;
    hourHand.rotation.z = -Math.PI / 6; // pointing at 2 o'clock
    hands.add(hourHand);

    const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.46, 0.015), handsMat);
    minHand.position.y = 0.18;
    minHand.rotation.z = Math.PI / 4; // pointing at 10 o'clock
    hands.add(minHand);

    // Center gold rivet
    const rivet = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 8), lightPurpleMat);
    rivet.rotation.x = Math.PI / 2;
    rivet.position.z = 0.01;
    hands.add(rivet);

    clockFaceGroup.add(hands);
    group.add(clockFaceGroup);
  }

  // 6. Architectural Crown with 4 Corner Pinnacles (Spires)
  const roofBaseY = headY + headHeight / 2; // 11.245
  const roofCrown = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.25, 2.3), darkStoneMat);
  roofCrown.position.y = roofBaseY + 0.125;
  roofCrown.castShadow = true;
  group.add(roofCrown);

  // 4 Corner Pinnacles
  const pinnacleGeo = new THREE.BoxGeometry(0.25, 0.95, 0.25);
  const pinConeGeo = new THREE.ConeGeometry(0.18, 0.55, 4);

  const corners = [
    { x: -1.0, z: -1.0 },
    { x: 1.0, z: -1.0 },
    { x: -1.0, z: 1.0 },
    { x: 1.0, z: 1.0 }
  ];

  corners.forEach((c) => {
    const pinCol = new THREE.Mesh(pinnacleGeo, stoneMat);
    pinCol.position.set(c.x, roofBaseY + 0.25 + 0.475, c.z);
    pinCol.castShadow = true;
    group.add(pinCol);

    const pinCone = new THREE.Mesh(pinConeGeo, copperRoofMat);
    pinCone.position.set(c.x, roofBaseY + 0.25 + 0.95 + 0.275, c.z);
    pinCone.rotation.y = Math.PI / 4;
    pinCone.castShadow = true;
    group.add(pinCone);
  });

  // 7. Majestic Gothic Oxidized Copper Spire Roof (Aged Green)
  const mainSpireHeight = 3.2;
  const roofSpireGeo = new THREE.ConeGeometry(1.6, mainSpireHeight, 4);
  const roofSpire = new THREE.Mesh(roofSpireGeo, copperRoofMat);
  roofSpire.position.y = roofBaseY + 0.25 + mainSpireHeight / 2;
  roofSpire.rotation.y = Math.PI / 4; // align square
  roofSpire.castShadow = true;
  group.add(roofSpire);

  // Weather vane on spire peak
  const peakY = roofBaseY + 0.25 + mainSpireHeight; // 11.245 + 0.25 + 3.2 = 14.695
  const vaneGroup = new THREE.Group();
  vaneGroup.position.set(0, peakY, 0);

  const finial = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 6), ironMat);
  finial.position.y = 0.4;
  finial.castShadow = true;
  vaneGroup.add(finial);

  const pointer = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.05, 0.05), lightPurpleMat);
  pointer.position.y = 0.65;
  vaneGroup.add(pointer);

  const star = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.05), lightPurpleMat);
  star.position.set(0.28, 0.65, 0);
  vaneGroup.add(star);

  group.add(vaneGroup);

  // 8. INTERIOR ENTRYWAY AND TOP TIER GLOWING LIGHTS AT NIGHT
  if (isNightOrSunset) {
    // Warm entrance light inside hollow base
    const entryLight = new THREE.PointLight(0xfff3e0, 5.0, 5);
    entryLight.position.set(0, 0.9 + 1.8, 0);
    group.add(entryLight);

    // Warm top spire clock-plate light
    const towerLight = new THREE.PointLight(0xfff3e0, 6.0, 10);
    towerLight.position.set(0, headY, 0);
    group.add(towerLight);
  }

  return group;
}

/**
 * 17. LARGE SCREENING SHRUB (To screen the houses beautifully)
 */
export function createBiggerShrub(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Large screening shrub';

  // Rich organic green colors for multi-tone depth
  const greenD = new THREE.MeshStandardMaterial({ color: 0x1b4314, roughness: 0.9 });
  const greenM = new THREE.MeshStandardMaterial({ color: 0x255b1c, roughness: 0.85 });
  const greenL = new THREE.MeshStandardMaterial({ color: 0x337c27, roughness: 0.8 });

  // Group multiple organic shapes into a dense green wall/cluster
  // Base soil container
  const baseGeo = new THREE.BoxGeometry(2.4, 0.2, 1.2);
  const base = new THREE.Mesh(baseGeo, new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 }));
  base.position.y = 0.1;
  base.receiveShadow = true;
  group.add(base);

  // Dense bush balls stacked together
  const ballGeo = new THREE.SphereGeometry(0.85, 8, 8);
  const ball1 = new THREE.Mesh(ballGeo, greenD);
  ball1.position.set(-0.7, 0.9, 0);
  ball1.scale.set(1.1, 1.0, 1.1);
  ball1.castShadow = true;
  group.add(ball1);

  const ball2 = new THREE.Mesh(ballGeo, greenM);
  ball2.position.set(0.7, 0.9, 0);
  ball2.scale.set(1.1, 1.0, 1.1);
  ball2.castShadow = true;
  group.add(ball2);

  const ball3 = new THREE.Mesh(ballGeo, greenL);
  ball3.position.set(0, 1.35, 0.1);
  ball3.scale.set(1.2, 1.1, 1.2);
  ball3.castShadow = true;
  group.add(ball3);

  // Tiny highlight blobs for textured depth
  const detailGeo = new THREE.SphereGeometry(0.4, 6, 6);
  const det1 = new THREE.Mesh(detailGeo, greenL);
  det1.position.set(-0.5, 1.4, -0.4);
  group.add(det1);

  const det2 = new THREE.Mesh(detailGeo, greenM);
  det2.position.set(0.6, 1.3, -0.4);
  group.add(det2);

  const det3 = new THREE.Mesh(detailGeo, greenD);
  det3.position.set(-1.1, 0.6, 0.3);
  group.add(det3);

  const det4 = new THREE.Mesh(detailGeo, greenL);
  det4.position.set(1.1, 0.6, 0.3);
  group.add(det4);

  return group;
}

/**
 * 18. STADIUM LIGHT TOWER (Provides majestic high-altitude scene floodlighting)
 */
export function createStadiumLightTower(isNightOrSunset = false): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Stadium Light Tower';

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x78909c, // Galvanized steel truss look
    roughness: 0.3,
    metalness: 0.8,
  });

  const blackMat = new THREE.MeshStandardMaterial({
    color: 0x1c1c1c, // Back casing
    roughness: 0.5,
  });

  const lampGlowMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    colorWrite: true,
  });

  // 1. Reinforced concrete foundation base
  const concreteBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 1.2), new THREE.MeshStandardMaterial({ color: 0xb0bec5, roughness: 0.8 }));
  concreteBase.position.y = 0.4;
  concreteBase.receiveShadow = true;
  concreteBase.castShadow = true;
  group.add(concreteBase);

  // 2. High steel lattice tower (tapering structure)
  const segments = 4;
  const towerH = 11.0;
  for (let i = 0; i < segments; i++) {
    const bottomR = 0.28 - i * 0.05;
    const topR = 0.28 - (i + 1) * 0.05;
    const segH = towerH / segments;
    const legGeo = new THREE.CylinderGeometry(topR, bottomR, segH, 4);
    const leg = new THREE.Mesh(legGeo, metalMat);
    leg.position.y = 0.8 + (i * segH) + (segH / 2);
    leg.castShadow = true;
    group.add(leg);

    // Cross-brace struts (thin boxes)
    const braceGeo = new THREE.BoxGeometry(0.04, segH * 1.3, 0.04);
    const brace1 = new THREE.Mesh(braceGeo, metalMat);
    brace1.position.copy(leg.position);
    brace1.rotation.z = Math.PI / 7;
    group.add(brace1);

    const brace2 = new THREE.Mesh(braceGeo, metalMat);
    brace2.position.copy(leg.position);
    brace2.rotation.z = -Math.PI / 7;
    group.add(brace2);
  }

  // 3. Huge horizontal light panel grid at top (y = 12.0)
  const gridFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 0.6), metalMat);
  gridFrame.position.set(0, 11.9, 0);
  gridFrame.castShadow = true;
  group.add(gridFrame);

  const mainPlaque = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 0.15), blackMat);
  mainPlaque.position.set(0, 12.3, 0);
  mainPlaque.rotation.x = Math.PI / 8; // angled slightly downwards
  mainPlaque.castShadow = true;
  group.add(mainPlaque);

  // Six bright spotlight squares
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const lampGeo = new THREE.BoxGeometry(0.55, 0.28, 0.04);
      const lamp = new THREE.Mesh(lampGeo, lampGlowMat);
      lamp.position.set(
        -0.7 + c * 0.7,
        12.12 + r * 0.36,
        0.06
      );
      lamp.rotation.x = Math.PI / 8; // matched angle
      group.add(lamp);

      // Emissive fake light flare
      if (isNightOrSunset) {
        const glowGeo = new THREE.BoxGeometry(0.58, 0.32, 0.02);
        const glow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({
          color: 0xfff9e6,
          transparent: true,
          opacity: 0.85
        }));
        glow.position.copy(lamp.position);
        glow.position.z += 0.02;
        glow.rotation.x = Math.PI / 8;
        group.add(glow);
      }
    }
  }

  // Add real point light inside tower head for bulb glow and a highly intense SpotLight acting as stadium floodlight
  if (isNightOrSunset) {
    const pLight = new THREE.PointLight(0xfffae0, 5.0, 6);
    pLight.position.set(0, 12.0, 0.5);
    group.add(pLight);

    // Dynamic wide-angle spotlight pointing down and forward into the park
    const spotLight = new THREE.SpotLight(0xfffae0, 45.0, 45, Math.PI / 3, 0.8, 1.0);
    spotLight.position.set(0, 12.3, 0.8);
    
    // Target points 15 meters forward, aligning with the tilted panel facing the park center
    const targetObj = new THREE.Object3D();
    targetObj.position.set(0, 0, 15.0);
    group.add(targetObj);
    spotLight.target = targetObj;
    
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 1.0;
    spotLight.shadow.camera.far = 40;
    spotLight.shadow.bias = -0.001;

    group.add(spotLight);
  }

  return group;
}

/**
 * 19. ROAD STREET LIGHT (Modern elegant lamp for road lanes)
 */
export function createRoadLight(isNightOrSunset = false): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Road Street Light';

  const blackMat = new THREE.MeshStandardMaterial({
    color: 0x1e2229, // Slate black
    roughness: 0.3,
    metalness: 0.8
  });

  const bulbGlowMat = new THREE.MeshBasicMaterial({
    color: isNightOrSunset ? 0xfff0c4 : 0x555555,
  });

  // Modern wide base
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 0.6, 6), blackMat);
  base.position.y = 0.3;
  base.castShadow = true;
  group.add(base);

  // Tall arched pole
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 4.8, 8), blackMat);
  pole.position.set(0, 2.7, 0);
  pole.castShadow = true;
  group.add(pole);

  // Double horizontal modern arms pointing Left and Right!
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.06), blackMat);
  armL.position.set(-0.4, 5.0, 0);
  group.add(armL);

  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.06), blackMat);
  armR.position.set(0.4, 5.0, 0);
  group.add(armR);

  // Two streamlined LED heads
  const headsX = [-0.75, 0.75];
  headsX.forEach((x) => {
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.06, 0.16), blackMat);
    head.position.set(x, 4.97, 0);
    group.add(head);

    const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.02, 0.1), bulbGlowMat);
    bulb.position.set(x, 4.93, 0);
    group.add(bulb);
  });

  return group;
}

/**
 * 20. SHELTERED SEATING AREA (Modern bus-stop style pavilion rest spots)
 */
export function createStandingObservationPlace(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Sheltered Seating Area';

  const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.6 }); // Elegant white metal frames
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.35 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 }); // Wooden bench
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae, roughness: 0.8 }); // Slate-grey paved base

  // 1. Base paved deck
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.15, 1.8), baseMat);
  base.position.y = 0.075;
  base.receiveShadow = true;
  group.add(base);

  // 2. Support columns (White metallic columns)
  const colGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 8);
  const col1 = new THREE.Mesh(colGeo, frameMat); col1.position.set(-1.7, 1.25, -0.8); group.add(col1);
  const col2 = new THREE.Mesh(colGeo, frameMat); col2.position.set(1.7, 1.25, -0.8); group.add(col2);
  const col3 = new THREE.Mesh(colGeo, frameMat); col3.position.set(-1.7, 1.25, 0.8); group.add(col3);
  const col4 = new THREE.Mesh(colGeo, frameMat); col4.position.set(1.7, 1.25, 0.8); group.add(col4);

  // 3. Roof (Modern flat slab with a slight overhanging slope)
  const roof = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.12, 2.1), frameMat);
  roof.position.y = 2.4;
  roof.castShadow = true;
  group.add(roof);

  // 4. Back Tempered Glass panel
  const backGlass = new THREE.Mesh(new THREE.BoxGeometry(3.3, 1.8, 0.04), glassMat);
  backGlass.position.set(0, 1.25, -0.75);
  group.add(backGlass);

  // 5. Left & Right Side Glass panels
  const sideGlassGeo = new THREE.BoxGeometry(0.04, 1.8, 1.4);
  const leftGlass = new THREE.Mesh(sideGlassGeo, glassMat);
  leftGlass.position.set(-1.65, 1.25, 0);
  group.add(leftGlass);

  const rightGlass = new THREE.Mesh(sideGlassGeo, glassMat);
  rightGlass.position.set(1.65, 1.25, 0);
  group.add(rightGlass);

  // 6. Double-seated Wood Bench inside
  // It has 'bench' in its name so the user can click on it to sit down!
  const benchSeat = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 0.5), woodMat);
  benchSeat.position.set(0, 0.55, -0.3);
  benchSeat.castShadow = true;
  benchSeat.name = "Comfort Shelter Bench";
  group.add(benchSeat);

  const benchLeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.5), frameMat);
  benchLeg1.position.set(-1.1, 0.325, -0.3);
  group.add(benchLeg1);

  const benchLeg2 = benchLeg1.clone();
  benchLeg2.position.x = 1.1;
  group.add(benchLeg2);

  return group;
}

/**
 * 19. FIRE HYDRANT
 */
export function createFireHydrant(): THREE.Group {
  const group = new THREE.Group();
  group.name = "Fire Hydrant";

  const redMat = new THREE.MeshStandardMaterial({ color: 0xe53935, roughness: 0.4 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.8 });

  // Main body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.6, 8), redMat);
  body.position.y = 0.3;
  body.castShadow = true;
  group.add(body);

  // Top cap
  const topCap = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), redMat);
  topCap.position.y = 0.6;
  topCap.castShadow = true;
  group.add(topCap);

  // Top nut (white/silver metal)
  const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 5), metalMat);
  nut.position.y = 0.65;
  group.add(nut);

  // Side nozzle connections (white/silver metal)
  const nozzleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.1, 8);
  
  const leftNozzle = new THREE.Mesh(nozzleGeo, metalMat);
  leftNozzle.rotation.z = Math.PI / 2;
  leftNozzle.position.set(-0.16, 0.35, 0);
  group.add(leftNozzle);

  const rightNozzle = leftNozzle.clone();
  rightNozzle.position.x = 0.16;
  group.add(rightNozzle);

  const frontNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 8), metalMat);
  frontNozzle.rotation.x = Math.PI / 2;
  frontNozzle.position.set(0, 0.35, 0.16);
  group.add(frontNozzle);

  return group;
}

/**
 * 20. SPEED LIMIT SIGN
 */
export function createSpeedLimitSign(limit = 25): THREE.Group {
  const group = new THREE.Group();
  group.name = `Speed Limit ${limit} Sign`;

  const poleMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae, roughness: 0.5 });
  const signMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const borderMat = new THREE.MeshBasicMaterial({ color: 0x212121 });

  // Post pole
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.8, 8), poleMat);
  pole.position.y = 1.4;
  pole.castShadow = true;
  group.add(pole);

  // Sign board backing
  const boardBacking = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.03), signMat);
  boardBacking.position.set(0, 2.3, 0.02);
  boardBacking.castShadow = true;
  group.add(boardBacking);

  // Sign face borders
  const faceBorder = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.66, 0.032), borderMat);
  faceBorder.position.set(0, 2.3, 0.021);
  group.add(faceBorder);

  const faceCenter = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.62, 0.033), signMat);
  faceCenter.position.set(0, 2.3, 0.022);
  group.add(faceCenter);

  return group;
}

/**
 * 21. BUS STOP SHELTER
 */
export function createBusStopShelter(): THREE.Group {
  const group = new THREE.Group();
  group.name = "Bus Stop Shelter";

  const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.6 }); // Elegant white metal frames
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.4 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 }); // Wooden bench

  // Base concrete pad
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 1.8), new THREE.MeshStandardMaterial({ color: 0xb0bec5, roughness: 0.8 }));
  base.position.y = 0.04;
  base.receiveShadow = true;
  group.add(base);

  // Support columns (White metallic columns)
  const colGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 8);
  const col1 = new THREE.Mesh(colGeo, frameMat); col1.position.set(-1.7, 1.1, -0.8); group.add(col1);
  const col2 = new THREE.Mesh(colGeo, frameMat); col2.position.set(1.7, 1.1, -0.8); group.add(col2);
  const col3 = new THREE.Mesh(colGeo, frameMat); col3.position.set(-1.7, 1.1, 0.8); group.add(col3);
  const col4 = new THREE.Mesh(colGeo, frameMat); col4.position.set(1.7, 1.1, 0.8); group.add(col4);

  // Roof (Low poly wedge/slab)
  const roof = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.1, 2.0), frameMat);
  roof.position.y = 2.25;
  roof.castShadow = true;
  group.add(roof);

  // Back Glass panel
  const backGlass = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 0.04), glassMat);
  backGlass.position.set(0, 1.1, -0.75);
  group.add(backGlass);

  // Left & Right Glass panel
  const sideGlassGeo = new THREE.BoxGeometry(0.04, 1.8, 1.4);
  const leftGlass = new THREE.Mesh(sideGlassGeo, glassMat);
  leftGlass.position.set(-1.65, 1.1, 0);
  group.add(leftGlass);

  const rightGlass = new THREE.Mesh(sideGlassGeo, glassMat);
  rightGlass.position.set(1.65, 1.1, 0);
  group.add(rightGlass);

  // Wooden Bench inside
  const benchSeat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.45), woodMat);
  benchSeat.position.set(0, 0.5, -0.4);
  benchSeat.castShadow = true;
  group.add(benchSeat);

  const benchLeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.45), frameMat);
  benchLeg1.position.set(-1.1, 0.225, -0.4);
  group.add(benchLeg1);

  const benchLeg2 = benchLeg1.clone();
  benchLeg2.position.x = 1.1;
  group.add(benchLeg2);

  // BUS STOP signboard on the shelter roof
  const signBoardGeo = new THREE.BoxGeometry(2.0, 0.45, 0.08);
  const signBoardMat = new THREE.MeshStandardMaterial({
    map: createSignboardTexture('BUS STOP', '#fbc02d', '#212121'), // Bright yellow board
    roughness: 0.3
  });
  const signBoard = new THREE.Mesh(signBoardGeo, signBoardMat);
  signBoard.position.set(0, 2.52, 0.92); // Centered above front edge of the roof
  signBoard.castShadow = true;
  group.add(signBoard);

  return group;
}

/**
 * 22. BICYCLE STAND / PARKING RACK
 */
export function createBicycleStand(): THREE.Group {
  const group = new THREE.Group();
  group.name = "Bicycle Stand";

  const metalMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.8 }); // Stately white steel racks

  // Base plate bars
  const base1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.04, 0.06), metalMat);
  base1.position.set(0, 0.02, -0.4);
  group.add(base1);

  const base2 = base1.clone();
  base2.position.z = 0.4;
  group.add(base2);

  // Five hoop racks
  for (let i = -0.8; i <= 0.8; i += 0.4) {
    const hoopGroup = new THREE.Group();
    hoopGroup.position.set(i, 0, 0);

    const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8);
    
    const legLeft = new THREE.Mesh(legGeo, metalMat);
    legLeft.position.set(0, 0.35, -0.35);
    hoopGroup.add(legLeft);

    const legRight = legLeft.clone();
    legRight.position.z = 0.35;
    hoopGroup.add(legRight);

    const topBar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8), metalMat);
    topBar.rotation.x = Math.PI / 2;
    topBar.position.set(0, 0.7, 0);
    hoopGroup.add(topBar);

    group.add(hoopGroup);
  }

  return group;
}

/**
 * 23. DIRECTIONAL ARROW SIGNBOARD (Yellow & Black high-visibility)
 */
export function createArrowSignBoard(direction: 'left' | 'right' = 'left'): THREE.Group {
  const group = new THREE.Group();
  group.name = `Direction Arrow Sign (${direction})`;

  const poleMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae, roughness: 0.5 });
  const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.3, metalness: 0.1 }); // Vibrant yellow
  const blackMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

  // Post pole
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.8, 8), poleMat);
  pole.position.y = 1.4;
  pole.castShadow = true;
  group.add(pole);

  // Sign board backing (Diamond shape - rotated square)
  const boardBacking = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.04), yellowMat);
  boardBacking.position.set(0, 2.3, 0.02);
  boardBacking.rotation.z = Math.PI / 4; // Diamond!
  boardBacking.castShadow = true;
  group.add(boardBacking);

  // Black border offset slightly
  const borderBox = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.58, 0.042), blackMat);
  borderBox.position.set(0, 2.3, 0.021);
  borderBox.rotation.z = Math.PI / 4;
  group.add(borderBox);

  // Yellow face
  const yellowFace = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.54, 0.044), yellowMat);
  yellowFace.position.set(0, 2.3, 0.022);
  yellowFace.rotation.z = Math.PI / 4;
  group.add(yellowFace);

  // 3D Arrow (shaft + head)
  const arrowGroup = new THREE.Group();
  arrowGroup.position.set(0, 2.3, 0.045);

  const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.01), blackMat);
  shaft.position.x = direction === 'left' ? 0.05 : -0.05;
  arrowGroup.add(shaft);

  const head = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.2, 4), blackMat);
  head.rotation.z = direction === 'left' ? Math.PI / 2 : -Math.PI / 2;
  head.position.x = direction === 'left' ? -0.15 : 0.15;
  arrowGroup.add(head);

  group.add(arrowGroup);

  return group;
}

/**
 * 24. CLASSIC PARK RAILING / FENCE
 */
export function createRailing(length = 2.0): THREE.Group {
  const group = new THREE.Group();
  group.name = "Railing";

  const metalMat = new THREE.MeshStandardMaterial({ color: 0x1a211e, roughness: 0.4, metalness: 0.8 }); // Stately dark metal
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1 }); // White post tops (as requested: gold parts must be white)

  // Base support rail
  const baseRail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.05, 0.05), metalMat);
  baseRail.position.y = 0.15;
  baseRail.castShadow = true;
  group.add(baseRail);

  // Top handrail
  const topRail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.05, 0.05), metalMat);
  topRail.position.y = 0.95;
  topRail.castShadow = true;
  group.add(topRail);

  // Vertical posts
  const postGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.8, 6);
  const postsCount = Math.floor(length / 0.25);
  for (let i = 0; i <= postsCount; i++) {
    const px = -length / 2 + (i * length) / postsCount;
    const post = new THREE.Mesh(postGeo, metalMat);
    post.position.set(px, 0.55, 0);
    post.castShadow = true;
    group.add(post);

    // Decorative top finial
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), goldMat);
    sphere.position.set(px, 0.97, 0);
    group.add(sphere);
  }

  // Major pillars at the ends
  const pillarGeo = new THREE.BoxGeometry(0.07, 1.1, 0.07);
  const pillar1 = new THREE.Mesh(pillarGeo, metalMat);
  pillar1.position.set(-length / 2, 0.55, 0);
  pillar1.castShadow = true;
  group.add(pillar1);

  const pillar2 = pillar1.clone();
  pillar2.position.x = length / 2;
  group.add(pillar2);

  return group;
}

/**
 * 25. PERSONAL GARDEN MODEL FOR VILLAS
 * Features a green turf base, a small stepping-stone walkway, a cute wooden picket fence on left/right sides,
 * and clusters of beautiful tulips/roses of varied colors!
 */
export function createPersonalGarden(width = 6.0, depth = 4.0): THREE.Group {
  const group = new THREE.Group();
  group.name = "Personal Garden";

  const turfMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.9 }); // Lush green garden turf
  const woodMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.7 }); // Elegant white picket fence
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae, roughness: 0.8 }); // Slate stepping stones

  // 1. Green turf base
  const base = new THREE.Mesh(new THREE.BoxGeometry(width, 0.05, depth), turfMat);
  base.position.y = 0.025;
  base.receiveShadow = true;
  group.add(base);

  // 2. Small stepping stone walkway centered leading to porch
  const stoneGeo = new THREE.BoxGeometry(0.4, 0.01, 0.4);
  for (let z = -depth / 2 + 0.5; z <= depth / 2 - 0.5; z += 0.8) {
    const stone = new THREE.Mesh(stoneGeo, stoneMat);
    stone.position.set(0, 0.055, z);
    stone.rotation.y = (Math.random() - 0.5) * 0.3;
    stone.receiveShadow = true;
    group.add(stone);
  }

  // 3. Picket fences along the Left and Right borders
  const picketGeo = new THREE.BoxGeometry(0.03, 0.5, 0.03);
  const railGeo = new THREE.BoxGeometry(0.015, 0.03, depth);

  // Left Fence
  const leftFence = new THREE.Group();
  leftFence.position.x = -width / 2 + 0.05;
  
  const railL1 = new THREE.Mesh(railGeo, woodMat); railL1.position.set(0, 0.12, 0); leftFence.add(railL1);
  const railL2 = new THREE.Mesh(railGeo, woodMat); railL2.position.set(0, 0.38, 0); leftFence.add(railL2);

  const picketsCount = Math.floor(depth / 0.35);
  for (let i = 0; i <= picketsCount; i++) {
    const pz = -depth / 2 + (i * depth) / picketsCount;
    const picket = new THREE.Mesh(picketGeo, woodMat);
    picket.position.set(0, 0.25, pz);
    picket.castShadow = true;
    leftFence.add(picket);
  }
  group.add(leftFence);

  // Right Fence
  const rightFence = leftFence.clone();
  rightFence.position.x = width / 2 - 0.05;
  group.add(rightFence);

  // 4. Clusters of colorful flowers planted on both sides of the walkway
  const colors = [0xff4444, 0xffbb00, 0xff66cc, 0x9c27b0, 0x00bcd4];
  const flowerGeo = new THREE.DodecahedronGeometry(0.05, 0);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });
  const stemGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.2, 4);

  // Spawning flowers
  for (let side = -1; side <= 1; side += 2) {
    if (side === 0) continue;
    for (let f = 0; f < 5; f++) {
      const flower = new THREE.Group();
      const fx = side * (0.6 + Math.random() * 1.1);
      const fz = -depth / 2 + 0.5 + Math.random() * (depth - 1.0);

      // Stem
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 0.1;
      stem.rotation.z = (Math.random() - 0.5) * 0.2;
      flower.add(stem);

      // Blossom
      const color = colors[Math.floor(Math.random() * colors.length)];
      const bloomMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.8 });
      const bloom = new THREE.Mesh(flowerGeo, bloomMat);
      bloom.position.y = 0.2;
      bloom.castShadow = true;
      flower.add(bloom);

      flower.position.set(fx, 0.05, fz);
      group.add(flower);
    }
  }

  return group;
}

/**
 * 26. HAMMOCK SWING
 */
export function createHammockSwing(): THREE.Group {
  const group = new THREE.Group();
  group.name = "Hammock Swing";

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.8 }); // Stately warm brown wood
  const fabricMat = new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.9 }); // Cozy canvas cream fabric
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x455a64, roughness: 0.2, metalness: 0.8 }); // Iron chains

  // Support posts
  const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 8), woodMat);
  post1.position.set(-1.4, 0.9, 0);
  post1.rotation.z = -Math.PI / 12; // Slanted outwards
  post1.castShadow = true;
  group.add(post1);

  const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 8), woodMat);
  post2.position.set(1.4, 0.9, 0);
  post2.rotation.z = Math.PI / 12; // Slanted outwards
  post2.castShadow = true;
  group.add(post2);

  // Ground base beam for stability
  const baseBeam = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.08, 0.08), woodMat);
  baseBeam.position.y = 0.04;
  baseBeam.receiveShadow = true;
  group.add(baseBeam);

  const crossFeet1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.8), woodMat);
  crossFeet1.position.set(-1.2, 0.04, 0);
  group.add(crossFeet1);

  const crossFeet2 = crossFeet1.clone();
  crossFeet2.position.x = 1.2;
  group.add(crossFeet2);

  // Metal chain lines from post tops to hammock
  const chain1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.02), metalMat);
  chain1.position.set(-1.1, 1.4, 0);
  chain1.rotation.z = -Math.PI / 6;
  group.add(chain1);

  const chain2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.02), metalMat);
  chain2.position.set(1.1, 1.4, 0);
  chain2.rotation.z = Math.PI / 6;
  group.add(chain2);

  // Curved Hammock Bed (segmented meshes or a single curved thin box)
  const hammockBed = new THREE.Group();
  hammockBed.name = "Comfort Hammock Bench"; // It must have "bench" in its name so the player can sit on it!
  hammockBed.position.set(0, 0.7, 0);

  const bedMesh = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.7), fabricMat);
  bedMesh.position.y = 0;
  bedMesh.rotation.z = 0;
  bedMesh.castShadow = true;
  hammockBed.add(bedMesh);

  // Flanks (cushions) at ends
  const cushionL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 8), fabricMat);
  cushionL.rotation.x = Math.PI / 2;
  cushionL.position.set(-0.9, 0.05, 0);
  hammockBed.add(cushionL);

  const cushionR = cushionL.clone();
  cushionR.position.x = 0.9;
  hammockBed.add(cushionR);

  group.add(hammockBed);
  return group;
}

/**
 * 27. PET HOUSE (Cute wooden pet villa with food bowl)
 */
export function createPetHouse(): THREE.Group {
  const group = new THREE.Group();
  group.name = "Pet House";

  const redMat = new THREE.MeshStandardMaterial({ color: 0xef5350, roughness: 0.6 }); // Classic red roof
  const woodMat = new THREE.MeshStandardMaterial({ color: 0xffcc80, roughness: 0.8 }); // Light yellow-wood walls
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.9 }); // Wood floor base
  const darkMat = new THREE.MeshBasicMaterial({ color: 0x212121 }); // Inner dark hollow
  const steelMat = new THREE.MeshStandardMaterial({ color: 0xb0bec5, roughness: 0.3, metalness: 0.7 }); // Water bowl

  // Floor Base
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 1.2), baseMat);
  base.position.y = 0.03;
  base.receiveShadow = true;
  group.add(base);

  // Walls
  const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 1.0), woodMat);
  wallL.position.set(-0.45, 0.38, 0);
  wallL.castShadow = true;
  group.add(wallL);

  const wallR = wallL.clone();
  wallR.position.x = 0.45;
  group.add(wallR);

  const wallBack = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.7, 0.06), woodMat);
  wallBack.position.set(0, 0.38, -0.47);
  wallBack.castShadow = true;
  group.add(wallBack);

  // Front Wall with dog door archway
  const frontWallL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.7, 0.06), woodMat);
  frontWallL.position.set(-0.3, 0.38, 0.47);
  group.add(frontWallL);

  const frontWallR = frontWallL.clone();
  frontWallR.position.x = 0.3;
  group.add(frontWallR);

  const frontWallTop = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.25, 0.06), woodMat);
  frontWallTop.position.set(0, 0.605, 0.47);
  group.add(frontWallTop);

  // Black interior hollow backdrop (to give depth to doorway)
  const hollow = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.02), darkMat);
  hollow.position.set(0, 0.25, -0.4);
  group.add(hollow);

  // Gabled slanted roof
  const roofL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.8, 1.25), redMat);
  roofL.position.set(-0.32, 0.9, 0);
  roofL.rotation.z = -Math.PI / 6;
  roofL.castShadow = true;
  group.add(roofL);

  const roofR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.8, 1.25), redMat);
  roofR.position.set(0.32, 0.9, 0);
  roofR.rotation.z = Math.PI / 6;
  roofR.castShadow = true;
  group.add(roofR);

  // Food and water bowl in front of door
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.08, 8), steelMat);
  bowl.position.set(0.25, 0.08, 0.75);
  bowl.castShadow = true;
  group.add(bowl);

  return group;
}

/**
 * 28. OPEN SIDE CAFE (Outdoor patio with tables, chairs, coffee cups)
 */
export function createOpenCafe(): THREE.Group {
  const group = new THREE.Group();
  group.name = "Modern Library & Side Cafe";

  // Materials
  const borderMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.8 }); // Dark slate borders
  const tileLightMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.4 }); // Light marble tiles
  const tileDarkMat = new THREE.MeshStandardMaterial({ color: 0xb0bec5, roughness: 0.5 }); // Soft blue-grey tiles
  const woodFloorMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 }); // Rich warm oak parquet for library floor
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.6 }); // Rich espresso wood for structures/shelves
  const lightWoodMat = new THREE.MeshStandardMaterial({ color: 0xa1887f, roughness: 0.5 }); // Warm honey-oak for reading table
  const fabricMat = new THREE.MeshStandardMaterial({ color: 0xe0f2f1, roughness: 0.95 }); // Soft mint linen for reading chairs & sofa
  const pillowMat = new THREE.MeshStandardMaterial({ color: 0x00796b, roughness: 0.8 }); // Deep teal throw pillows
  const steelMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.2, metalness: 0.8 }); // Elegant chrome
  const blackSteelMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.6, metalness: 0.5 }); // Black metallic pillars
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xffb300, roughness: 0.2, metalness: 0.9 }); // Golden brass highlights
  const glassGlowMat = new THREE.MeshBasicMaterial({ color: 0xffecb3 }); // Soft warm incandescent light bulbs
  const glassWindowMat = new THREE.MeshStandardMaterial({ color: 0xe0f7fa, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.25 }); // Clear glass
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.9 }); // Deep green hedges
  const flowerMat = new THREE.MeshStandardMaterial({ color: 0xe91e63, roughness: 0.8 }); // Red flowers
  const signTextMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0.8 }); // White lettering

  // Book Colors for library bookshelves
  const bookColors = [
    new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.7 }), // Crimson Red
    new THREE.MeshStandardMaterial({ color: 0x0d47a1, roughness: 0.7 }), // Royal Blue
    new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.7 }), // Forest Green
    new THREE.MeshStandardMaterial({ color: 0xe65100, roughness: 0.7 }), // Deep Orange
    new THREE.MeshStandardMaterial({ color: 0x4a148c, roughness: 0.7 }), // Deep Purple
    new THREE.MeshStandardMaterial({ color: 0xf57f17, roughness: 0.7 }), // Rich Yellow
    new THREE.MeshStandardMaterial({ color: 0x006064, roughness: 0.7 }), // Dark Teal
    new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.7 }), // Slate Blue
  ];

  const patioW = 6.0;
  const patioL = 12.0;

  // 1. BASE BUILDING PLATFORM
  const baseGeo = new THREE.BoxGeometry(patioW, 0.1, patioL);
  const base = new THREE.Mesh(baseGeo, borderMat);
  base.position.y = 0.05;
  base.receiveShadow = true;
  group.add(base);

  // 2. MIXED FLOORING DESIGN (Parquet wood inside Library, Checkerboard marble on Cafe patio)
  const flooringGroup = new THREE.Group();
  flooringGroup.position.y = 0.105;

  // North Half (Z = -6.0 to 0.0): Cozy Indoor Library parquet flooring
  const libraryFloorGeo = new THREE.PlaneGeometry(patioW - 0.1, 6.0 - 0.05);
  const libraryFloor = new THREE.Mesh(libraryFloorGeo, woodFloorMat);
  libraryFloor.rotation.x = -Math.PI / 2;
  libraryFloor.position.set(0, 0, -3.0);
  libraryFloor.receiveShadow = true;
  flooringGroup.add(libraryFloor);

  // South Half (Z = 0.0 to 6.0): Checkerboard marble tiling for open cafe
  const tileSize = 1.0;
  const startX = -patioW / 2 + 0.5;
  const startZ = 0.5;

  for (let xIdx = 0; xIdx < 6; xIdx++) {
    for (let zIdx = 0; zIdx < 6; zIdx++) {
      const isLight = (xIdx + zIdx) % 2 === 0;
      const tileMat = isLight ? tileLightMat : tileDarkMat;
      const tile = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 0.96), tileMat);
      tile.rotation.x = -Math.PI / 2;
      tile.position.set(startX + xIdx * tileSize, 0, startZ + zIdx * tileSize);
      tile.receiveShadow = true;
      flooringGroup.add(tile);
    }
  }
  group.add(flooringGroup);

  // 3. STRUCTURAL COLUMNS & CEILING / ROOF
  const columnsGroup = new THREE.Group();
  const colGeo = new THREE.BoxGeometry(0.18, 3.0, 0.18);
  const colPositions = [
    { x: -2.9, z: -5.9 }, { x: 2.9, z: -5.9 },
    { x: -2.9, z: -3.0 }, { x: 2.9, z: -3.0 },
    { x: -2.9, z: 0.0 }, { x: 2.9, z: 0.0 },
    { x: -2.9, z: 3.0 }, { x: 2.9, z: 3.0 },
    { x: -2.9, z: 5.9 }, { x: 2.9, z: 5.9 }
  ];
  colPositions.forEach(pos => {
    const pillar = new THREE.Mesh(colGeo, woodMat);
    pillar.position.set(pos.x, 1.6, pos.z);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    columnsGroup.add(pillar);
  });
  group.add(columnsGroup);

  // Flat building roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(patioW + 0.3, 0.16, patioL + 0.3), woodMat);
  roof.position.set(0, 3.18, 0);
  roof.castShadow = true;
  group.add(roof);

  // 4. INDOOR LIBRARY BUILDING WALLS (North Half: Z = -6 to 0)
  const wallsGroup = new THREE.Group();

  // North Wall (Z = -6.0) - Solid wood backing
  const wallNorth = new THREE.Mesh(new THREE.BoxGeometry(patioW - 0.2, 3.0, 0.12), woodMat);
  wallNorth.position.set(0, 1.6, -5.9);
  wallNorth.castShadow = true;
  wallNorth.receiveShadow = true;
  wallsGroup.add(wallNorth);

  // West Wall (X = -3.0) - Solid wood with library shelf backing
  const wallWest = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.0, 6.0), woodMat);
  wallWest.position.set(-2.94, 1.6, -3.0);
  wallWest.castShadow = true;
  wallWest.receiveShadow = true;
  wallsGroup.add(wallWest);

  // East Wall (X = 3.0) - Full floor-to-ceiling glass wall for a view of the park!
  const glassEast = new THREE.Mesh(new THREE.BoxGeometry(0.06, 3.0, 6.0), glassWindowMat);
  glassEast.position.set(2.94, 1.6, -3.0);
  wallsGroup.add(glassEast);

  // South Interior Divider Wall (Z = 0) - Glass partition with open archway in the center (from X=-1 to +1)
  const partitionLeft = new THREE.Mesh(new THREE.BoxGeometry(1.9, 3.0, 0.08), woodMat);
  partitionLeft.position.set(-1.95, 1.6, 0);
  wallsGroup.add(partitionLeft);

  const partitionRight = new THREE.Mesh(new THREE.BoxGeometry(1.9, 3.0, 0.08), woodMat);
  partitionRight.position.set(1.95, 1.6, 0);
  wallsGroup.add(partitionRight);

  const partitionTop = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.8, 0.08), woodMat);
  partitionTop.position.set(0, 2.7, 0);
  wallsGroup.add(partitionTop);

  const glassPartitionLeft = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.0, 0.04), glassWindowMat);
  glassPartitionLeft.position.set(-1.95, 1.2, 0.01);
  wallsGroup.add(glassPartitionLeft);

  const glassPartitionRight = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.0, 0.04), glassWindowMat);
  glassPartitionRight.position.set(1.95, 1.2, 0.01);
  wallsGroup.add(glassPartitionRight);

  group.add(wallsGroup);

  // 5. LIBRARY COZY BOOKCASES & BOOKSHELVES (Book shelves must be clearly visible!)
  const libraryGroup = new THREE.Group();
  libraryGroup.position.set(0, 0.11, 0);

  // Create 2 large vertical bookshelves against the West wall
  for (let bIdx = 0; bIdx < 2; bIdx++) {
    const bookcase = new THREE.Group();
    bookcase.position.set(-2.65, 0, -4.5 + bIdx * 2.2);

    // Frame of bookcase
    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.5, 0.06), woodMat);
    frameLeft.position.set(0, 1.25, -0.9);
    frameLeft.castShadow = true;
    bookcase.add(frameLeft);

    const frameRight = frameLeft.clone();
    frameRight.position.z = 0.9;
    bookcase.add(frameRight);

    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 1.8), woodMat);
    frameTop.position.set(0, 2.47, 0);
    bookcase.add(frameTop);

    const frameBack = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.5, 1.8), woodMat);
    frameBack.position.set(-0.18, 1.25, 0);
    frameBack.receiveShadow = true;
    bookcase.add(frameBack);

    // 4 Shelves inside
    const shelfHeights = [0.5, 1.0, 1.5, 2.0];
    shelfHeights.forEach((sh, shIdx) => {
      const shelfPlank = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.04, 1.76), woodMat);
      shelfPlank.position.set(0.01, sh, 0);
      shelfPlank.castShadow = true;
      bookcase.add(shelfPlank);

      // Populate shelf with 3D colorful books!
      const maxBooks = 15;
      const startBookZ = -0.75;
      const bookSpacing = 0.1;
      
      for (let bk = 0; bk < maxBooks; bk++) {
        // Randomly skip a book occasionally to look natural
        if (Math.random() < 0.15) continue;

        const bW = 0.22 + Math.random() * 0.06; // height of book
        const bD = 0.16 + Math.random() * 0.05; // depth of book
        const bH = 0.04 + Math.random() * 0.02; // thickness

        const bookMat = bookColors[Math.floor(Math.random() * bookColors.length)];
        const bookGeo = new THREE.BoxGeometry(bD, bW, bH);
        const book = new THREE.Mesh(bookGeo, bookMat);
        book.castShadow = true;

        const isLeaning = bk === maxBooks - 2 && Math.random() < 0.6;

        if (isLeaning) {
          book.position.set(0.05, sh + bW / 2 + 0.01, startBookZ + bk * bookSpacing + 0.02);
          book.rotation.x = 0.25; // Lean over
        } else {
          book.position.set(0.05, sh + bW / 2 + 0.01, startBookZ + bk * bookSpacing);
        }

        bookcase.add(book);
      }
    });

    bookcase.name = `Cozy Library Bookcase ${bIdx + 1}`;
    libraryGroup.add(bookcase);
  }

  // 6. READING TABLE WITH BOOKS & CHAIRS (In center-east of library)
  const readingTableGroup = new THREE.Group();
  readingTableGroup.position.set(1.0, 0, -2.8);

  // Oak Reading Table
  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.06, 2.4), lightWoodMat);
  tableTop.position.y = 0.72;
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  readingTableGroup.add(tableTop);

  // Table Legs
  const tLegGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.69, 8);
  const tLegOffsets = [
    { x: -0.5, z: -1.0 }, { x: 0.5, z: -1.0 },
    { x: -0.5, z: 1.0 }, { x: 0.5, z: 1.0 }
  ];
  tLegOffsets.forEach(offset => {
    const leg = new THREE.Mesh(tLegGeo, woodMat);
    leg.position.set(offset.x, 0.345, offset.z);
    leg.castShadow = true;
    readingTableGroup.add(leg);
  });

  // Reading table books (open and closed books!)
  // Closed book stack
  const book1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.18), bookColors[0]);
  book1.position.set(-0.2, 0.76, -0.4);
  book1.rotation.y = 0.15;
  book1.castShadow = true;
  readingTableGroup.add(book1);

  const book2 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.17), bookColors[1]);
  book2.position.set(-0.19, 0.79, -0.41);
  book2.rotation.y = -0.1;
  book2.castShadow = true;
  readingTableGroup.add(book2);

  // Open flat book
  const openBookGroup = new THREE.Group();
  openBookGroup.position.set(0.1, 0.75, 0.2);
  openBookGroup.rotation.y = -0.2;

  const pagesMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
  const coverMat = bookColors[2];

  const cover = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.01, 0.34), coverMat);
  cover.position.y = 0.005;
  openBookGroup.add(cover);

  const leftPage = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.016, 0.32), pagesMat);
  leftPage.position.set(-0.06, 0.015, 0);
  leftPage.rotation.z = -0.05; // open book page slope
  openBookGroup.add(leftPage);

  const rightPage = leftPage.clone();
  rightPage.position.x = 0.06;
  rightPage.rotation.z = 0.05;
  openBookGroup.add(rightPage);

  readingTableGroup.add(openBookGroup);

  // 2 Cozy Reading Chairs facing the table (West and East)
  const chairPositions = [
    { x: -0.9, z: -0.4, rotY: Math.PI / 2 },
    { x: 0.9, z: 0.4, rotY: -Math.PI / 2 }
  ];

  chairPositions.forEach((pos, cIdx) => {
    const chair = new THREE.Group();
    chair.position.set(pos.x, 0, pos.z);
    chair.rotation.y = pos.rotY;

    // Cushion Seat (Nomenclature "Seat" for click-to-sit)
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.48), fabricMat);
    seat.position.y = 0.38;
    seat.castShadow = true;
    seat.name = `Serene Library Reading Chair Seat ${cIdx + 1}`;
    chair.add(seat);

    // High backrest
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.6, 0.48), fabricMat);
    back.position.set(-0.21, 0.68, 0);
    back.castShadow = true;
    chair.add(back);

    const backTrim = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.64, 0.52), woodMat);
    backTrim.position.set(-0.22, 0.68, 0);
    chair.add(backTrim);

    // Legs
    const lGeo = new THREE.CylinderGeometry(0.03, 0.02, 0.34, 6);
    const lOffsets = [
      { x: -0.19, z: -0.19 }, { x: 0.19, z: -0.19 },
      { x: -0.19, z: 0.19 }, { x: 0.19, z: 0.19 }
    ];
    lOffsets.forEach(lo => {
      const leg = new THREE.Mesh(lGeo, woodMat);
      leg.position.set(lo.x, 0.17, lo.z);
      leg.castShadow = true;
      chair.add(leg);
    });

    readingTableGroup.add(chair);
  });

  readingTableGroup.name = "Library Reading Table with Books";
  libraryGroup.add(readingTableGroup);

  // 7. COZY LIBRARY L-SHAPED SOFA SET (Inside the indoor library corner!)
  const sofaGroup = new THREE.Group();
  sofaGroup.position.set(-1.3, 0, -1.8);

  // Sofa Wood Base
  const sofaBase1 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.25, 2.6), woodMat);
  sofaBase1.position.set(0, 0.125, 0.3);
  sofaBase1.castShadow = true;
  sofaBase1.receiveShadow = true;
  sofaGroup.add(sofaBase1);

  const sofaBase2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.25, 1.1), woodMat);
  sofaBase2.position.set(0.8, 0.125, -0.45);
  sofaBase2.castShadow = true;
  sofaBase2.receiveShadow = true;
  sofaGroup.add(sofaBase2);

  // Cushions
  for (let i = 0; i < 3; i++) {
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.22, 0.8), fabricMat);
    cushion.position.set(0, 0.31, -0.6 + i * 0.8);
    cushion.castShadow = true;
    cushion.receiveShadow = true;
    cushion.name = `Library Sofa Seat A${i + 1}`;
    sofaGroup.add(cushion);

    const backPillow = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.42, 0.76), fabricMat);
    backPillow.position.set(-0.38, 0.58, -0.6 + i * 0.8);
    backPillow.castShadow = true;
    sofaGroup.add(backPillow);
  }

  // Accent Throw Pillows
  const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.12), pillowMat);
  pillow1.position.set(-0.2, 0.48, -0.1);
  pillow1.rotation.y = Math.PI / 4;
  sofaGroup.add(pillow1);

  const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.12), pillowMat);
  pillow2.position.set(0.4, 0.48, -0.4);
  pillow2.rotation.y = -Math.PI / 4;
  sofaGroup.add(pillow2);

  sofaGroup.name = "Cozy Library Reading Sofa";
  libraryGroup.add(sofaGroup);

  group.add(libraryGroup);

  // 8. OPEN SUNLIT CAFE PATIO SECTION (South Half: Z = 0 to 6)
  const cafeGroup = new THREE.Group();
  cafeGroup.position.set(0, 0.11, 3.0);

  // 2 Cozy Cafe Tables with Chairs
  const tableZPositions = [-1.5, 1.5];
  tableZPositions.forEach((tz, tblIdx) => {
    const tblGroup = new THREE.Group();
    tblGroup.position.set(0.6, 0, tz);

    // Table
    const topMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.04, 16), woodMat);
    topMesh.position.y = 0.72;
    topMesh.castShadow = true;
    topMesh.receiveShadow = true;
    tblGroup.add(topMesh);

    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8), blackSteelMat);
    leg.position.y = 0.35;
    leg.castShadow = true;
    tblGroup.add(leg);

    const tblBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.03, 12), blackSteelMat);
    tblBase.position.y = 0.015;
    tblGroup.add(tblBase);

    // Mini succulent potted plant on the table
    const miniPot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.08, 8), borderMat);
    miniPot.position.set(0.1, 0.76, -0.1);
    miniPot.castShadow = true;
    tblGroup.add(miniPot);

    const plantSphere = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), leafMat);
    plantSphere.position.set(0.1, 0.82, -0.1);
    plantSphere.castShadow = true;
    tblGroup.add(plantSphere);

    // 2 Chairs facing each other (North/South)
    const chairZOffsets = [-0.8, 0.8];
    chairZOffsets.forEach((cz, chIdx) => {
      const chair = new THREE.Group();
      chair.position.set(0, 0, cz);
      chair.rotation.y = cz < 0 ? 0 : Math.PI;

      // Cushion Seat (click-to-sit)
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.05, 0.38), fabricMat);
      seat.position.y = 0.38;
      seat.castShadow = true;
      seat.name = `Sunlit Cafe Patio Chair Seat ${tblIdx + 1}-${chIdx + 1}`;
      chair.add(seat);

      // Chair backrest
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.38, 0.38), fabricMat);
      back.position.set(-0.17, 0.57, 0);
      back.castShadow = true;
      chair.add(back);

      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.4, 0.4), woodMat);
      frame.position.set(-0.18, 0.58, 0);
      chair.add(frame);

      // Legs
      const legGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.36, 6);
      const legOffsets = [
        { x: -0.16, z: -0.16 }, { x: 0.16, z: -0.16 },
        { x: -0.16, z: 0.16 }, { x: 0.16, z: 0.16 }
      ];
      legOffsets.forEach(lo => {
        const lMesh = new THREE.Mesh(legGeo, blackSteelMat);
        lMesh.position.set(lo.x, 0.18, lo.z);
        lMesh.castShadow = true;
        chair.add(lMesh);
      });

      tblGroup.add(chair);
    });

    tblGroup.name = `Sunlit Cafe Patio Table ${tblIdx + 1}`;
    cafeGroup.add(tblGroup);
  });

  group.add(cafeGroup);

  // 9. STRING LIGHTS hanging inside both library and cafe sections
  const hangingLights = new THREE.Group();
  hangingLights.position.y = 2.95;

  const lightSpots = [
    { x: -1.8, z: -4.5 }, { x: 1.8, z: -4.5 },
    { x: -1.8, z: -1.5 }, { x: 1.8, z: -1.5 },
    { x: -1.8, z: 1.5 }, { x: 1.8, z: 1.5 },
    { x: -1.8, z: 4.5 }, { x: 1.8, z: 4.5 }
  ];

  lightSpots.forEach((spot, lIdx) => {
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), glassGlowMat);
    bulb.position.set(spot.x, 0, spot.z);
    hangingLights.add(bulb);

    const baseFixture = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 8), blackSteelMat);
    baseFixture.position.set(spot.x, 0.04, spot.z);
    hangingLights.add(baseFixture);
  });
  group.add(hangingLights);

  // 10. CAFE NAME PLATE SIGNBOARD (Facing South-East towards main gate)
  const signboard = new THREE.Group();
  signboard.position.set(patioW / 2 - 0.1, 0.11, patioL / 2 - 1.5);
  signboard.rotation.y = -Math.PI / 4;

  // Posts
  const signPost1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8), blackSteelMat);
  signPost1.position.set(-0.55, 0.9, 0);
  signPost1.castShadow = true;
  signboard.add(signPost1);

  const signPost2 = signPost1.clone();
  signPost2.position.x = 0.55;
  signboard.add(signPost2);

  // Wooden Board
  const woodBoard = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.55, 0.08), woodMat);
  woodBoard.position.y = 1.35;
  woodBoard.castShadow = true;
  signboard.add(woodBoard);

  // Gold Trim around Board
  const trimLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.59, 0.1), brassMat);
  trimLeft.position.set(-0.72, 1.35, 0);
  signboard.add(trimLeft);

  const trimRight = trimLeft.clone();
  trimRight.position.x = 0.72;
  signboard.add(trimRight);

  const trimTop = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.04, 0.1), brassMat);
  trimTop.position.set(0, 1.64, 0);
  signboard.add(trimTop);

  const trimBottom = trimTop.clone();
  trimBottom.position.y = 1.06;
  signboard.add(trimBottom);

  // Stylized simulated 3D letters for "CAFE" using tiny boxes
  const letterHeight = 1.35;
  const buildLetterBox = (xOffset: number, w: number, h: number, d: number) => {
    const l = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), signTextMat);
    l.position.set(xOffset, letterHeight, 0.05);
    signboard.add(l);
  };

  // Letter C
  buildLetterBox(-0.35, 0.03, 0.22, 0.02); // Left bar
  buildLetterBox(-0.30, 0.12, 0.03, 0.02); // Top bar
  buildLetterBox(-0.30, 0.12, 0.03, 0.02); // Bottom bar (adjusted position below)
  const cTop = signboard.children[signboard.children.length - 2];
  cTop.position.y += 0.095;
  const cBot = signboard.children[signboard.children.length - 1];
  cBot.position.y -= 0.095;

  // Letter A
  buildLetterBox(-0.12, 0.03, 0.22, 0.02); // Left bar
  buildLetterBox(-0.04, 0.03, 0.22, 0.02); // Right bar
  buildLetterBox(-0.08, 0.08, 0.03, 0.02); // Middle cross
  const aLeft = signboard.children[signboard.children.length - 3];
  aLeft.rotation.z = -0.15;
  const aRight = signboard.children[signboard.children.length - 2];
  aRight.rotation.z = 0.15;

  // Letter F
  buildLetterBox(0.1, 0.03, 0.22, 0.02); // Left bar
  buildLetterBox(0.16, 0.12, 0.03, 0.02); // Top bar
  buildLetterBox(0.14, 0.09, 0.03, 0.02); // Middle bar
  const fTop = signboard.children[signboard.children.length - 2];
  fTop.position.y += 0.095;
  const fMid = signboard.children[signboard.children.length - 1];
  fMid.position.y += 0.01;

  // Letter E
  buildLetterBox(0.3, 0.03, 0.22, 0.02); // Left bar
  buildLetterBox(0.36, 0.12, 0.03, 0.02); // Top bar
  buildLetterBox(0.34, 0.09, 0.03, 0.02); // Middle bar
  buildLetterBox(0.36, 0.12, 0.03, 0.02); // Bottom bar
  const eTop = signboard.children[signboard.children.length - 3];
  eTop.position.y += 0.095;
  const eMid = signboard.children[signboard.children.length - 2];
  eMid.position.y += 0.01;
  const eBot = signboard.children[signboard.children.length - 1];
  eBot.position.y -= 0.095;

  group.add(signboard);

  // 11. HEDGES & CORNER FLOWER POTS
  const landscapeGroup = new THREE.Group();
  landscapeGroup.position.y = 0.11;

  // Side hedges around the building
  const hedgeW = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.65, 11.8), leafMat);
  hedgeW.position.set(-patioW / 2 + 0.2, 0.325, 0);
  hedgeW.castShadow = true;
  landscapeGroup.add(hedgeW);

  const hedgeN = new THREE.Mesh(new THREE.BoxGeometry(patioW - 0.4, 0.65, 0.4), leafMat);
  hedgeN.position.set(0.2, 0.325, -patioL / 2 + 0.2);
  hedgeN.castShadow = true;
  landscapeGroup.add(hedgeN);

  const potGeo = new THREE.CylinderGeometry(0.2, 0.15, 0.35, 8);
  const clayMat = new THREE.MeshStandardMaterial({ color: 0xca6f1e, roughness: 0.8 });
  const flowerStemMat = new THREE.MeshStandardMaterial({ color: 0x388e3c, roughness: 0.9 });

  const cornerPots = [
    { x: -patioW / 2 + 0.6, z: patioL / 2 - 0.6 },
    { x: patioW / 2 - 0.6, z: patioL / 2 - 0.6 }
  ];

  cornerPots.forEach(potPos => {
    const potGroup = new THREE.Group();
    potGroup.position.set(potPos.x, 0, potPos.z);

    const pot = new THREE.Mesh(potGeo, clayMat);
    pot.position.y = 0.175;
    pot.castShadow = true;
    potGroup.add(pot);

    const foliage = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), flowerStemMat);
    foliage.position.y = 0.42;
    foliage.castShadow = true;
    potGroup.add(foliage);

    for (let f = 0; f < 5; f++) {
      const fl = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), flowerMat);
      const angle = (f * Math.PI * 2) / 5;
      fl.position.set(Math.cos(angle) * 0.16, 0.52, Math.sin(angle) * 0.16);
      potGroup.add(fl);
    }
    landscapeGroup.add(potGroup);
  });

  group.add(landscapeGroup);

  return group;
}

/**
 * 24. STANDING BUS (Static road decoration)
 */
export function createStandingBus(colorHex = 0xd32f2f): THREE.Group {
  const group = new THREE.Group();
  group.name = "Standing Transit Bus";

  const chassisMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.3, metalness: 0.5 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
  const hubCapMat = new THREE.MeshStandardMaterial({ color: 0xb0bec5, roughness: 0.2, metalness: 0.9 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x80deea, transparent: true, opacity: 0.4, roughness: 0.1 });
  const seatMat = new THREE.MeshStandardMaterial({ color: 0xe65100, roughness: 0.8 }); // Orange seats
  const lightMat = new THREE.MeshBasicMaterial({ color: 0xffeb3b }); // Glowing headlights
  const taillightMat = new THREE.MeshBasicMaterial({ color: 0xf44336 }); // Glowing taillights
  const blackTrimMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.7 });

  // 1. MAIN CHASSIS BODY
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 5.2), chassisMat);
  body.position.y = 1.1;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // 2. WHITE ROOF
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 5.2), roofMat);
  roof.position.set(0, 2.05, 0);
  roof.castShadow = true;
  group.add(roof);

  // 3. WINDOW GLASS & BLACK COLUMNS (Front, Sides, Back)
  // Front Windshield
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.7, 0.04), glassMat);
  windshield.position.set(0, 1.5, 2.56);
  group.add(windshield);

  // Rear window
  const rearWindow = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.6, 0.04), glassMat);
  rearWindow.position.set(0, 1.5, -2.56);
  group.add(rearWindow);

  // Side windows (Left and Right)
  for (let side = -1; side <= 1; side += 2) {
    if (side === 0) continue;
    for (let wIdx = 0; wIdx < 4; wIdx++) {
      const windowMesh = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.6, 0.9), glassMat);
      windowMesh.position.set(side * 0.81, 1.5, -1.6 + wIdx * 1.1);
      group.add(windowMesh);
    }
  }

  // 4. WHEELS (Four cylinder assemblies)
  const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.35, 12);
  const hubGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.36, 12);
  wheelGeo.rotateZ(Math.PI / 2);
  hubGeo.rotateZ(Math.PI / 2);

  const wheelsPos = [
    { x: -0.8, z: -1.7 }, { x: 0.8, z: -1.7 },
    { x: -0.8, z: 1.7 }, { x: 0.8, z: 1.7 }
  ];

  wheelsPos.forEach(pos => {
    const wGroup = new THREE.Group();
    wGroup.position.set(pos.x, 0.42, pos.z);

    const tire = new THREE.Mesh(wheelGeo, wheelMat);
    tire.castShadow = true;
    wGroup.add(tire);

    const hub = new THREE.Mesh(hubGeo, hubCapMat);
    wGroup.add(hub);

    group.add(wGroup);
  });

  // 5. INTERIOR SEATS (Cozy red bus seats visible from outside)
  for (let zOffset = -2.0; zOffset <= 2.0; zOffset += 0.8) {
    // Left seat row
    const seatL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.35), seatMat);
    seatL.position.set(-0.55, 0.8, zOffset);
    group.add(seatL);

    const backL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.45, 0.06), seatMat);
    backL.position.set(-0.55, 1.1, zOffset - 0.12);
    group.add(backL);

    // Right seat row
    const seatR = seatL.clone();
    seatR.position.x = 0.55;
    group.add(seatR);

    const backR = backL.clone();
    backR.position.x = 0.55;
    group.add(backR);
  }

  // 6. BUS ACCESSORIES (Headlights, Taillights, License Plate, Sign)
  // Headlights
  const headL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), lightMat);
  headL.position.set(-0.6, 0.6, 2.58);
  group.add(headL);

  const headR = headL.clone();
  headR.position.x = 0.6;
  group.add(headR);

  // Taillights
  const tailL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), taillightMat);
  tailL.position.set(-0.6, 0.6, -2.58);
  group.add(tailL);

  const tailR = tailL.clone();
  tailR.position.x = 0.6;
  group.add(tailR);

  // Front destination sign
  const signBacking = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.2, 0.02), blackTrimMat);
  signBacking.position.set(0, 1.92, 2.57);
  group.add(signBacking);

  const signText = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.12, 0.022), lightMat);
  signText.position.set(0, 1.92, 2.575);
  group.add(signText);

  return group;
}

/**
 * 25. SHINING YELLOW ARROW WARNING SIGNBOARD
 */
export function createYellowArrowBoard(direction: 'left' | 'right' = 'right', isNightOrSunset = false): THREE.Group {
  const group = new THREE.Group();
  group.name = `Yellow Arrow Sign ${direction}`;

  const poleMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.6 });
  const boardMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b, roughness: 0.4 }); // Bright yellow
  const arrowStripesMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.5 }); // Black
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xffb300 }); // Warm yellow glowing bulbs

  // 1. Striped post pole
  const postGroup = new THREE.Group();
  const poleHeight = 1.8;
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, poleHeight, 8), poleMat);
  pole.position.y = poleHeight / 2;
  pole.castShadow = true;
  postGroup.add(pole);

  // Black/Yellow warning tape around post
  for (let h = 0.2; h < poleHeight; h += 0.35) {
    const strip = new THREE.Mesh(new THREE.CylinderGeometry(0.054, 0.054, 0.15, 8), boardMat);
    strip.position.y = h;
    postGroup.add(strip);
  }
  group.add(postGroup);

  // 2. Rectangular Arrow Board
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.08), boardMat);
  board.position.set(0, 1.8, 0.02);
  board.castShadow = true;
  group.add(board);

  // Arrow design stripes on board
  const stripeW = 0.08;
  const stripeH = 0.55;
  const stripeGeo = new THREE.BoxGeometry(stripeW, stripeH, 0.082);

  const arrowGroup = new THREE.Group();
  arrowGroup.position.set(0, 1.8, 0.03);

  // Render a clean chevron chevron arrow
  const rot = direction === 'right' ? Math.PI / 4 : -Math.PI / 4;
  
  const b1 = new THREE.Mesh(stripeGeo, arrowStripesMat);
  b1.position.set(-0.2, 0.15, 0);
  b1.rotation.z = -rot;
  arrowGroup.add(b1);

  const b2 = new THREE.Mesh(stripeGeo, arrowStripesMat);
  b2.position.set(-0.2, -0.15, 0);
  b2.rotation.z = rot;
  arrowGroup.add(b2);

  const b3 = new THREE.Mesh(stripeGeo, arrowStripesMat);
  b3.position.set(0.1, 0.15, 0);
  b3.rotation.z = -rot;
  arrowGroup.add(b3);

  const b4 = new THREE.Mesh(stripeGeo, arrowStripesMat);
  b4.position.set(0.1, -0.15, 0);
  b4.rotation.z = rot;
  arrowGroup.add(b4);

  group.add(arrowGroup);

  // 3. Shining LED bulb matrix on board (makes it realistic!)
  const ledGeo = new THREE.SphereGeometry(0.035, 6, 6);
  const leds = [
    { x: -0.4, y: 1.8, z: 0.07 },
    { x: -0.1, y: 1.8, z: 0.07 },
    { x: 0.2, y: 1.8, z: 0.07 },
    { x: 0.4, y: 1.8, z: 0.07 },
    { x: 0.2, y: 2.05, z: 0.07 },
    { x: 0.2, y: 1.55, z: 0.07 }
  ];

  leds.forEach(ledPos => {
    const led = new THREE.Mesh(ledGeo, glowMat);
    led.position.set(ledPos.x, ledPos.y, ledPos.z);
    if (isNightOrSunset) {
      // Dynamic scaling or glowing point lights can be added, but a simple basic material represents "shine" beautifully!
      led.scale.setScalar(1.4);
    }
    group.add(led);
  });

  return group;
}

/**
 * 26. DETACHED INDOOR LIBRARY BUILDING (LONG BUILDING, CUSTOM CHAIRS & BOOKS)
 */
export function createLibraryBuilding(isNightOrSunset = false): THREE.Group {
  const group = new THREE.Group();
  group.name = "Royal Reading Library";

  // Materials
  const marbleMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.15, metalness: 0.1 }); // Polished White Marble
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.7 }); // Rich Dark Walnut Wood
  const brickMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.9 }); // Warm red brick highlights
  const carpetMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.95 }); // Regal crimson red carpet
  const paperMat = new THREE.MeshStandardMaterial({ color: 0xfffdd0, roughness: 0.9 }); // Creamy book pages
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.15, metalness: 0.85 }); // Polished brass/gold
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xe0f7fa, transparent: true, opacity: 0.2, roughness: 0.05 }); // Clear glass
  const metalSteelMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.5, metalness: 0.8 }); // Black iron

  const bW = 20.0; // Grand spacious library width
  const bD = 8.5;  // Building depth
  const bH = 5.0;  // High vaulted ceiling

  // 1. Foundation & Floors (Base)
  const base = new THREE.Mesh(new THREE.BoxGeometry(bW, 0.1, bD), woodMat);
  base.position.y = 0.05;
  base.receiveShadow = true;
  group.add(base);

  // Elegant Regal Crimson Runner Carpet in the center aisle
  const carpet = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.012, bD - 0.2), carpetMat);
  carpet.position.set(0, 0.106, 0);
  carpet.receiveShadow = true;
  group.add(carpet);

  // 2. Solid Exterior Walls
  // Back wall
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, 0.2), marbleMat);
  backWall.position.set(0, bH / 2, -bD / 2 + 0.1);
  backWall.castShadow = true;
  group.add(backWall);

  // Left wall
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, bH, bD), marbleMat);
  leftWall.position.set(-bW / 2 + 0.1, bH / 2, 0);
  leftWall.castShadow = true;
  group.add(leftWall);

  // Right wall
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, bH, bD), marbleMat);
  rightWall.position.set(bW / 2 - 0.1, bH / 2, 0);
  rightWall.castShadow = true;
  group.add(rightWall);

  // 3. Front Facade with Solid Walls and Arched Windows (Enabling single entrance)
  // Left Front Wall
  const frontWallLeft = new THREE.Mesh(new THREE.BoxGeometry(8.5, bH, 0.2), marbleMat);
  frontWallLeft.position.set(-5.75, bH / 2, bD / 2 - 0.1);
  frontWallLeft.castShadow = true;
  group.add(frontWallLeft);

  // Right Front Wall
  const frontWallRight = new THREE.Mesh(new THREE.BoxGeometry(8.5, bH, 0.2), marbleMat);
  frontWallRight.position.set(5.75, bH / 2, bD / 2 - 0.1);
  frontWallRight.castShadow = true;
  group.add(frontWallRight);

  // Grand Neoclassical Arched Storefront Windows on the Left and Right front walls
  const winGeo = new THREE.BoxGeometry(2.5, bH - 1.8, 0.1);
  const winL = new THREE.Mesh(winGeo, glassMat);
  winL.position.set(-5.75, bH / 2, bD / 2 - 0.08);
  group.add(winL);

  const winR = winL.clone();
  winR.position.x = 5.75;
  group.add(winR);

  // Arched window frames (Gold/Brass trim)
  const frameGeo = new THREE.BoxGeometry(2.6, 0.1, 0.16);
  const frameTopL = new THREE.Mesh(frameGeo, goldMat);
  frameTopL.position.set(-5.75, bH - 0.85, bD / 2 - 0.05);
  group.add(frameTopL);

  const frameBottomL = frameTopL.clone();
  frameBottomL.position.y = 0.95;
  group.add(frameBottomL);

  const frameTopR = frameTopL.clone();
  frameTopR.position.x = 5.75;
  group.add(frameTopR);

  const frameBottomR = frameBottomL.clone();
  frameBottomR.position.x = 5.75;
  group.add(frameBottomR);

  // 4. THE GRAND ENTRANCE PORTAL: A single majestic Roman Archway that is ALWAYS OPENED
  const entryGroup = new THREE.Group();
  entryGroup.position.set(0, 0, bD / 2 - 0.1);

  // Left supporting pillar
  const pillarL = new THREE.Mesh(new THREE.BoxGeometry(0.6, bH, 0.6), marbleMat);
  pillarL.position.set(-1.6, bH / 2, 0);
  pillarL.castShadow = true;
  entryGroup.add(pillarL);

  // Right supporting pillar
  const pillarR = new THREE.Mesh(new THREE.BoxGeometry(0.6, bH, 0.6), marbleMat);
  pillarR.position.set(1.6, bH / 2, 0);
  pillarR.castShadow = true;
  entryGroup.add(pillarR);

  // Arch Header lintel with carved molding
  const archHeader = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.8, 0.8), marbleMat);
  archHeader.position.set(0, bH - 0.4, 0);
  archHeader.castShadow = true;
  entryGroup.add(archHeader);

  // Elegant gold trim around the arch opening
  const innerGoldArch = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.12, 0.65), goldMat);
  innerGoldArch.position.set(0, bH - 0.8, 0);
  entryGroup.add(innerGoldArch);

  group.add(entryGroup);

  // 5. Grand Pitched Neoclassical Roof
  const roofBase = new THREE.Mesh(new THREE.BoxGeometry(bW + 0.6, 0.2, bD + 0.4), marbleMat);
  roofBase.position.y = bH + 0.1;
  roofBase.castShadow = true;
  group.add(roofBase);

  // Left slanted panel
  const roofSlopeL = new THREE.Mesh(new THREE.BoxGeometry(bW + 0.8, 0.12, bD / 2 + 0.5), marbleMat);
  roofSlopeL.position.set(0, bH + 0.9, -bD / 4);
  roofSlopeL.rotation.x = -0.35; // clean pitch angle
  roofSlopeL.castShadow = true;
  group.add(roofSlopeL);

  // Right slanted panel
  const roofSlopeR = new THREE.Mesh(new THREE.BoxGeometry(bW + 0.8, 0.12, bD / 2 + 0.5), marbleMat);
  roofSlopeR.position.set(0, bH + 0.9, bD / 4);
  roofSlopeR.rotation.x = 0.35; // clean pitch angle
  roofSlopeR.castShadow = true;
  group.add(roofSlopeR);

  // Triangular pediments on the left and right ends to close the gable (Extruded 2D shape for exact pitch!)
  const gableShape = new THREE.Shape();
  const halfD = bD / 2;
  const gableH = halfD * Math.tan(0.35); // matches slantAngle 0.35
  gableShape.moveTo(-halfD, 0);
  gableShape.lineTo(halfD, 0);
  gableShape.lineTo(0, gableH);
  gableShape.closePath();

  const gableGeo = new THREE.ExtrudeGeometry(gableShape, {
    depth: 0.2,
    bevelEnabled: false
  });

  const pedimentL = new THREE.Mesh(gableGeo, marbleMat);
  pedimentL.position.set(-bW / 2 + 0.2, bH + 0.1, 0); // start at ceiling height bH + 0.1
  pedimentL.rotation.y = Math.PI / 2;
  pedimentL.castShadow = true;
  group.add(pedimentL);

  const pedimentR = new THREE.Mesh(gableGeo, marbleMat);
  pedimentR.position.set(bW / 2, bH + 0.1, 0);
  pedimentR.rotation.y = Math.PI / 2;
  pedimentR.castShadow = true;
  group.add(pedimentR);

  // 6. Beautiful Gold & Wood Signboard above the Archway
  const signGeo = new THREE.BoxGeometry(6.5, 0.8, 0.15);
  const signMat = new THREE.MeshStandardMaterial({
    map: createSignboardTexture("THE GRAND LIBRARY", "#2e190a", "#ffd700"), // Wood base, bright gold letters
    roughness: 0.2,
    metalness: 0.2
  });
  const signboard = new THREE.Mesh(signGeo, signMat);
  signboard.position.set(0, bH + 0.45, bD / 2 + 0.2);
  signboard.castShadow = true;
  group.add(signboard);

  // 7. HIGH-FIDELITY INTERIOR LAYOUT
  // A. Grand Checkout / Reception Counter Desk (Near Entrance Left)
  const reception = new THREE.Group();
  reception.position.set(-3.5, 0.1, bD / 2 - 2.0);

  const counterBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.95, 0.95), woodMat);
  counterBase.position.y = 0.475;
  counterBase.castShadow = true;
  counterBase.receiveShadow = true;
  reception.add(counterBase);

  const counterTop = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.06, 1.0), marbleMat); // White Marble counter top
  counterTop.position.y = 0.98;
  counterTop.castShadow = true;
  reception.add(counterTop);

  // Computer Monitor
  const monitorGroup = new THREE.Group();
  monitorGroup.position.set(-0.4, 1.01, -0.15);
  
  const compBase = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.03, 0.25), metalSteelMat);
  compBase.position.y = 0.015;
  monitorGroup.add(compBase);

  const compStand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.25, 8), metalSteelMat);
  compStand.position.set(0, 0.14, 0);
  monitorGroup.add(compStand);

  const compScreen = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.04), new THREE.MeshBasicMaterial({ color: 0x00e5ff })); // Cyan glow screen
  compScreen.position.set(0, 0.3, 0);
  monitorGroup.add(compScreen);
  reception.add(monitorGroup);

  // Reception Lamp (Warm Yellow point light that is always glowing)
  const rLamp = new THREE.Group();
  rLamp.position.set(0.6, 1.01, 0);
  const rLampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.03, 8), goldMat);
  rLampBase.position.y = 0.015;
  rLamp.add(rLampBase);
  const rLampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8), goldMat);
  rLampStem.position.set(0, 0.175, 0);
  rLamp.add(rLampStem);
  const rLampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.12, 12), paperMat);
  rLampShade.position.set(0, 0.35, 0);
  rLamp.add(rLampShade);

  const rLampLight = new THREE.PointLight(0xffecc0, 3.5, 5); // Crisp warm light
  rLampLight.position.set(0, 0.32, 0);
  rLamp.add(rLampLight);
  reception.add(rLamp);

  // Stacks of books on the reception counter
  const bookStack = new THREE.Group();
  bookStack.position.set(0.4, 1.01, -0.2);
  const bColors = [0xd32f2f, 0x1976d2, 0x388e3c, 0xfbc02d];
  bColors.forEach((col, idx) => {
    const rBook = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.05, 0.44), new THREE.MeshStandardMaterial({ color: col }));
    rBook.position.y = idx * 0.055 + 0.025;
    rBook.rotation.y = idx * 0.12 - 0.24;
    rBook.castShadow = true;
    bookStack.add(rBook);
  });
  reception.add(bookStack);

  group.add(reception);

  // B. Cozy Sofa Lounges with Coffee Tables (Entrance Right)
  const lounge = new THREE.Group();
  lounge.position.set(4.0, 0.1, bD / 2 - 2.0);

  const sofaMat = new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.85 }); // Dark forest green leather velvet
  const sofa = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.65, 0.9), sofaMat);
  sofa.position.y = 0.325;
  sofa.castShadow = true;
  lounge.add(sofa);

  const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.65, 0.2), sofaMat);
  sofaBack.position.set(0, 0.65, 0.35);
  sofaBack.castShadow = true;
  lounge.add(sofaBack);

  const coffeeTable = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.42, 12), woodMat);
  coffeeTable.position.set(0, 0.21, -0.85);
  coffeeTable.castShadow = true;
  lounge.add(coffeeTable);

  group.add(lounge);

  // C. Massive Back Bookcases loaded with hundreds of books!
  const shelfTitles = [
    "The Serenity Guide", "Mastering Three.js", "Mastery of Zen", "History of Green Parks",
    "Creative Coding", "D3 Visualization", "The Quiet Forest", "Designing Spaces",
    "Chronicles of Grand Park", "Secrets of the Clock Tower", "Mindfulness Practice", "Botanical Studies"
  ];
  const rareBooks = [
    "Ancient Wisdom of Parks", "The Golden Compass", "Legend of the Silver Key", "The Alchemist's Garden"
  ];
  const bookColorsList = [0xd32f2f, 0x1976d2, 0x388e3c, 0xfbc02d, 0x7b1fa2, 0xe64a19, 0x00796b, 0x5d4037, 0x9575cd];

  // Align giant shelves along the entire back wall
  for (let sX = -8.0; sX <= 8.0; sX += 3.2) {
    const shelf = new THREE.Group();
    shelf.position.set(sX, 0.1, -bD / 2 + 0.45);

    // Anatomical open-backed bookcase frame (not a solid block, preventing book clipping)
    // 1. Thin wooden back panel
    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.8, 0.04), woodMat);
    backPanel.position.set(0, 1.9, -0.16);
    backPanel.castShadow = true;
    shelf.add(backPanel);

    // 2. Left side wall
    const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 3.8, 0.36), woodMat);
    sideL.position.set(-1.38, 1.9, 0);
    sideL.castShadow = true;
    shelf.add(sideL);

    // 3. Right side wall
    const sideR = sideL.clone();
    sideR.position.x = 1.38;
    shelf.add(sideR);

    // Decorative crown molding at top
    const crown = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.12, 0.42), woodMat);
    crown.position.y = 3.84;
    shelf.add(crown);

    // Shelf boards
    for (let shY = 0.55; shY <= 3.2; shY += 0.55) {
      const board = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.04, 0.32), woodMat);
      board.position.set(0, shY, 0);
      shelf.add(board);

      // Books filling this board segment (facing the front of the shelf at positive Z)
      let bX = -1.25;
      while (bX < 1.22) {
        const bH = 0.25 + Math.random() * 0.15;
        const bW = 0.04 + Math.random() * 0.03;
        const bD = 0.22 + Math.random() * 0.05;

        const bookCol = bookColorsList[Math.floor(Math.random() * bookColorsList.length)];
        const bookMat = new THREE.MeshStandardMaterial({ color: bookCol, roughness: 0.55 });
        const book = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, bD), bookMat);
        
        book.rotation.z = Math.random() > 0.88 ? 0.22 : 0; // realistic book leaning slant
        // Stand the book proudly at the front edge (z = 0.06) so it is highly visible
        book.position.set(bX, shY + bH / 2 + 0.02, 0.06);
        book.castShadow = true;

        const isRare = Math.random() > 0.90;
        const randomTitle = isRare 
          ? rareBooks[Math.floor(Math.random() * rareBooks.length)] 
          : shelfTitles[Math.floor(Math.random() * shelfTitles.length)];
          
        book.name = isRare 
          ? `library_book_collectible: "${randomTitle}"`
          : `library_book: "${randomTitle}"`;

        shelf.add(book);
        bX += bW + 0.018;
      }
    }

    group.add(shelf);
  }

  // D. Stately Central Study Tables & Brass Reading Lamps
  const tableOffsets = [-4.5, 4.5];
  tableOffsets.forEach((tX) => {
    const studyZone = new THREE.Group();
    studyZone.position.set(tX, 0.1, 0.4);

    // Grand timber study desk
    const table = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.78, 1.4), woodMat);
    table.position.y = 0.39;
    table.castShadow = true;
    table.receiveShadow = true;
    studyZone.add(table);

    // Stacks of books on desks
    const deskBooksGroup = new THREE.Group();
    deskBooksGroup.position.set(-1.0, 0.78, 0.2);
    const db1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.05, 0.48), new THREE.MeshStandardMaterial({ color: 0xd32f2f }));
    db1.position.y = 0.025;
    db1.castShadow = true;
    deskBooksGroup.add(db1);
    const db2 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.05, 0.46), new THREE.MeshStandardMaterial({ color: 0x1976d2 }));
    db2.position.set(0.02, 0.075, -0.02);
    db2.rotation.y = 0.15;
    db2.castShadow = true;
    deskBooksGroup.add(db2);
    studyZone.add(deskBooksGroup);

    // Brass Study Lamps
    const deskLamp = new THREE.Group();
    deskLamp.position.set(0, 0.78, 0);

    const baseL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.03, 8), goldMat);
    baseL.position.y = 0.015;
    deskLamp.add(baseL);

    const stemL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8), goldMat);
    stemL.position.set(0, 0.175, 0);
    deskLamp.add(stemL);

    const shadeL = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.12, 12), paperMat);
    shadeL.position.set(0, 0.35, 0);
    deskLamp.add(shadeL);

    const lampLight = new THREE.PointLight(0xfff59d, 3.2, 5.0); // Warm cozy task lighting
    lampLight.position.set(0, 0.25, 0);
    deskLamp.add(lampLight);

    studyZone.add(deskLamp);

    // 4 Comfortable leather study armchairs
    const chairs = [
      { x: -1.0, z: -0.85, rot: 0 },
      { x: 1.0, z: -0.85, rot: 0 },
      { x: -1.0, z: 0.85, rot: Math.PI },
      { x: 1.0, z: 0.85, rot: Math.PI }
    ];
    chairs.forEach((ch, chIdx) => {
      const chair = new THREE.Group();
      chair.name = `library_chair_study_${tX < 0 ? 'L' : 'R'}_${chIdx}`;
      chair.position.set(ch.x, 0, ch.z);
      chair.rotation.y = ch.rot;

      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.5), woodMat);
      seat.position.y = 0.42;
      seat.castShadow = true;
      chair.add(seat);

      const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 0.48), carpetMat); // Red velvet cushion
      cushion.position.set(0, 0.47, 0);
      cushion.castShadow = true;
      chair.add(cushion);

      const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.08), woodMat);
      chairBack.position.set(0, 0.725, -0.21);
      chairBack.castShadow = true;
      chair.add(chairBack);

      // Legs
      const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.38, 4);
      const leg1 = new THREE.Mesh(legGeo, woodMat); leg1.position.set(-0.2, 0.19, -0.2); chair.add(leg1);
      const leg2 = new THREE.Mesh(legGeo, woodMat); leg2.position.set(0.2, 0.19, -0.2); chair.add(leg2);
      const leg3 = new THREE.Mesh(legGeo, woodMat); leg3.position.set(-0.2, 0.19, 0.2); chair.add(leg3);
      const leg4 = new THREE.Mesh(legGeo, woodMat); leg4.position.set(0.2, 0.19, 0.2); chair.add(leg4);

      studyZone.add(chair);
    });

    group.add(studyZone);
  });

  // 8. BRIGHT INTERIOR HANGING CHANDELIERS (Always Active, highly premium)
  const chandelierPositions = [-6.5, 0, 6.5];
  chandelierPositions.forEach((cX, idx) => {
    const chandelier = new THREE.Group();
    chandelier.position.set(cX, bH - 0.8, 0);

    const bulbBase = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), goldMat);
    chandelier.add(bulbBase);

    // Multi-arm design
    for (let i = 0; i < 4; i++) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.65, 4), goldMat);
      arm.rotation.z = Math.PI / 3;
      arm.rotation.y = (i * Math.PI) / 2;
      arm.position.set(0.2 * Math.cos((i * Math.PI) / 2), 0.1, 0.2 * Math.sin((i * Math.PI) / 2));
      chandelier.add(arm);

      // Mini-bulbs at tips
      const miniBulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      miniBulb.position.set(0.48 * Math.cos((i * Math.PI) / 2), 0.34, 0.48 * Math.sin((i * Math.PI) / 2));
      chandelier.add(miniBulb);
    }

    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 4), goldMat);
    chain.position.y = 0.4;
    chandelier.add(chain);

    // Highly intense PointLight inside the library that casts shadows (ALWAYS lit)
    const shopLight = new THREE.PointLight(0xfff3e0, 8.5, 18);
    shopLight.position.set(0, -0.3, 0);
    shopLight.castShadow = true;
    chandelier.add(shopLight);

    group.add(chandelier);
  });

  return group;
}

export function createCafeBuilding(isNightOrSunset = false): THREE.Group {
  const group = new THREE.Group();
  group.name = "Spacious Greenery Cafe";

  // Materials
  const timberMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.8 }); // Deep mahogany timber
  const parquetFloorMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.6 }); // Rich polished walnut wood parquet
  const brickMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.9 }); // Warm red brick walls
  const wallPlasterMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.85 }); // Clean off-white plaster
  const metalSteelMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.2, metalness: 0.8 });
  const fabricUmbrellaMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.9 }); // Matching timber brown umbrella
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xe0f7fa, transparent: true, opacity: 0.15, roughness: 0.05 }); // Fully transparent glass
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xffb300, roughness: 0.2, metalness: 0.8 }); // Brass details
  const forestGreenSofaMat = new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.8 }); // Luxury green sofa velvet
  const marbleMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.15 }); // White marble counter top

  const cW = 12.0; 
  const cD = 8.5;  
  const cH = 3.9;  

  // 1. Solid Foundation Patio Deck (Extended to the LEFT/SOUTH for outside customer seating - away from library!)
  const patio = new THREE.Mesh(new THREE.BoxGeometry(cW + 8.5, 0.08, cD + 1.6), timberMat);
  patio.position.set(-3.45, 0.04, 0);
  patio.receiveShadow = true;
  group.add(patio);

  // 2. High-end Polished Walnut Parquet Floor
  const floor = new THREE.Mesh(new THREE.BoxGeometry(cW - 0.2, 0.06, cD - 0.2), parquetFloorMat);
  floor.position.set(0, 0.07, 0);
  floor.receiveShadow = true;
  group.add(floor);

  // 3. Solid Back and Side Walls
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(cW, cH, 0.2), brickMat);
  backWall.position.set(0, cH / 2, -cD / 2);
  backWall.castShadow = true;
  group.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, cH, cD - 0.2), wallPlasterMat);
  leftWall.position.set(-cW / 2, cH / 2, 0);
  leftWall.castShadow = true;
  group.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, cH, cD - 0.2), wallPlasterMat);
  rightWall.position.set(cW / 2, cH / 2, 0);
  rightWall.castShadow = true;
  group.add(rightWall);

  // 4. Solid Plaster Ceiling and Beautiful Pitched Gabled Roof of Rich Mahogany Timber
  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(cW + 0.4, 0.15, cD + 0.4), wallPlasterMat);
  ceiling.position.y = cH + 0.075;
  ceiling.castShadow = true;
  group.add(ceiling);

  // Left slanted timber panel
  const roofSlopeL = new THREE.Mesh(new THREE.BoxGeometry(cW + 0.8, 0.12, cD / 2 + 0.5), timberMat);
  roofSlopeL.position.set(0, cH + 0.75, -cD / 4);
  roofSlopeL.rotation.x = -0.35; // Sleek pitch angle
  roofSlopeL.castShadow = true;
  group.add(roofSlopeL);

  // Right slanted timber panel
  const roofSlopeR = new THREE.Mesh(new THREE.BoxGeometry(cW + 0.8, 0.12, cD / 2 + 0.5), timberMat);
  roofSlopeR.position.set(0, cH + 0.75, cD / 4);
  roofSlopeR.rotation.x = 0.35; // Sleek pitch angle
  roofSlopeR.castShadow = true;
  group.add(roofSlopeR);

  // Triangular plaster walls to close the gables on both left and right sides of the cafe (Extruded 2D shape for exact pitch!)
  const gableShape = new THREE.Shape();
  const halfD = cD / 2;
  const gableH = halfD * Math.tan(0.35); // matches slantAngle 0.35
  gableShape.moveTo(-halfD, 0);
  gableShape.lineTo(halfD, 0);
  gableShape.lineTo(0, gableH);
  gableShape.closePath();

  const gableGeo = new THREE.ExtrudeGeometry(gableShape, {
    depth: 0.2,
    bevelEnabled: false
  });

  const pedimentL = new THREE.Mesh(gableGeo, wallPlasterMat);
  pedimentL.position.set(-cW / 2 + 0.2, cH + 0.075, 0); // start at ceiling height cH + 0.075
  pedimentL.rotation.y = Math.PI / 2;
  pedimentL.castShadow = true;
  group.add(pedimentL);

  const pedimentR = new THREE.Mesh(gableGeo, wallPlasterMat);
  pedimentR.position.set(cW / 2, cH + 0.075, 0);
  pedimentR.rotation.y = Math.PI / 2;
  pedimentR.castShadow = true;
  group.add(pedimentR);

  // 5. Front Architectural Pillars
  const colGeo = new THREE.BoxGeometry(0.35, cH, 0.35);
  for (let cX = -cW / 2; cX <= cW / 2; cX += 3.0) {
    const col = new THREE.Mesh(colGeo, brickMat);
    col.position.set(cX, cH / 2, cD / 2);
    col.castShadow = true;
    group.add(col);
  }

  // 6. Large glass windows and SINGLE OPEN WALK-IN FRONT ENTRANCE
  const windowGeo = new THREE.BoxGeometry(2.65, cH - 0.8, 0.04);
  const winPositions = [-4.5, -1.5, 1.5, 4.5];
  winPositions.forEach(cX => {
    // Leave cX = 1.5 as the wide completely open walk-in gate!
    if (cX === 1.5) {
      // Elegant timber door frame for the open entrance portal (No purple!)
      const portalFrame = new THREE.Mesh(new THREE.BoxGeometry(2.65, cH - 0.2, 0.2), timberMat);
      portalFrame.position.set(cX, cH / 2, cD / 2);
      group.add(portalFrame);

      // Hollow inner walkway opening
      const innerCutout = new THREE.Mesh(new THREE.BoxGeometry(2.3, cH - 0.6, 0.25), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 }));
      innerCutout.position.set(cX, (cH - 0.6) / 2 + 0.1, cD / 2);
      group.add(innerCutout);
      return;
    }

    const win = new THREE.Mesh(windowGeo, glassMat);
    win.position.set(cX, cH / 2 + 0.1, cD / 2);
    group.add(win);
  });

  // 7. Individual Chalkboard Menu Stand on Patio
  const patioMenu = new THREE.Group();
  patioMenu.position.set(-8.5, 0.08, cD / 2 + 1.5);
  patioMenu.rotation.y = Math.PI / 6;

  const boardLegL = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.3, 6), timberMat);
  boardLegL.position.set(-0.35, 0.65, 0);
  boardLegL.castShadow = true;
  patioMenu.add(boardLegL);

  const boardLegR = boardLegL.clone();
  boardLegR.position.set(0.35, 0.65, 0);
  patioMenu.add(boardLegR);

  const menuFrame = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.95, 0.06), timberMat);
  menuFrame.position.y = 0.85;
  menuFrame.castShadow = true;
  patioMenu.add(menuFrame);

  const chalkFace = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.85, 0.07), new THREE.MeshBasicMaterial({ color: 0x1c1c1c }));
  chalkFace.position.set(0, 0.85, 0);
  chalkFace.name = "cafe_patio_menu_board";
  patioMenu.add(chalkFace);
  group.add(patioMenu);

  // 8. Elegant Signboard above (glowing beautifully)
  const signGeo = new THREE.BoxGeometry(5.2, 0.7, 0.1);
  const signMat = new THREE.MeshStandardMaterial({
    map: createSignboardTexture("THE GREENERY CAFE", "#1b5e20", "#ffd54f"), // Deep green background, warm gold lettering
    roughness: 0.3
  });
  const signboard = new THREE.Mesh(signGeo, signMat);
  signboard.position.set(0, cH + 0.35, cD / 2 + 0.1);
  signboard.castShadow = true;
  group.add(signboard);

  // 9. COZY SOFA LOUNGE ZONE - Removed as requested ("cafe have outside place for costumers not inside of room")

  // 10. LUXURY COFFEE BAR COUNTER (With high-end espresso machines, pastry displays, cups - moved to the right/north side)
  const windowCounter = new THREE.Group();
  windowCounter.position.set(3.5, 0.08, 0);

  const barSlab = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.92, 4.2), timberMat);
  barSlab.position.y = 0.46;
  barSlab.castShadow = true;
  barSlab.receiveShadow = true;
  windowCounter.add(barSlab);

  const barTopSlab = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.06, 4.3), marbleMat); // Polished white marble counter top
  barTopSlab.position.y = 0.95;
  barTopSlab.castShadow = true;
  windowCounter.add(barTopSlab);

  // Stacking ceramic coffee cups
  for (let zOffset = -1.4; zOffset <= 1.4; zOffset += 0.7) {
    const lamp = new THREE.Group();
    lamp.position.set(0, 0.98, zOffset);

    const lBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 8), goldMat);
    lBase.position.y = 0.01;
    lamp.add(lBase);

    const lStem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.22, 8), goldMat);
    lStem.position.set(0, 0.12, 0);
    lamp.add(lStem);

    const lShade = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.08, 10), fabricUmbrellaMat);
    lShade.position.set(0, 0.24, 0);
    lamp.add(lShade);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), new THREE.MeshBasicMaterial({ color: 0xfff59d }));
    bulb.position.set(0, 0.21, 0);
    lamp.add(bulb);

    const lampLight = new THREE.PointLight(0xfff59d, 1.8, 3.5);
    lampLight.position.set(0, 0.15, 0);
    lamp.add(lampLight);

    windowCounter.add(lamp);
  }

  group.add(windowCounter);

  // 11. CENTRAL SERVICE COUNTER (With espresso machines and show cabinets)
  const counterGroup = new THREE.Group();
  counterGroup.position.set(-1.2, 0.08, -1.2);

  const counterBody = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.1, 2.0), timberMat);
  counterBody.position.set(0, 0.55, 0);
  counterBody.castShadow = true;
  counterGroup.add(counterBody);

  const counterTop = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.06, 2.2), marbleMat); // Polished marble
  counterTop.position.set(0, 1.13, 0);
  counterTop.castShadow = true;
  counterGroup.add(counterTop);

  // Double-Boiler Espresso Machine
  const espressoMachine = new THREE.Group();
  espressoMachine.name = "cafe_espresso_machine";
  espressoMachine.position.set(0.7, 1.16, 0.1);

  const emBody = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.55, 0.45), metalSteelMat);
  emBody.position.y = 0.275;
  emBody.castShadow = true;
  espressoMachine.add(emBody);

  const steamWand = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 8), metalSteelMat);
  steamWand.position.set(-0.22, 0.15, 0.24);
  steamWand.rotation.z = 0.4;
  espressoMachine.add(steamWand);

  const portafilter = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.18), timberMat);
  portafilter.position.set(0.18, 0.2, 0.24);
  espressoMachine.add(portafilter);

  // Espresso cups stacking
  for (let cx = -0.22; cx <= 0.22; cx += 0.15) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.03, 0.06, 8), wallPlasterMat);
    cup.position.set(cx, 0.58, -0.05);
    espressoMachine.add(cup);
  }
  counterGroup.add(espressoMachine);

  // Pastry Showcase Cabinet
  const cakeCabinet = new THREE.Group();
  cakeCabinet.name = "cafe_cake_cabinet";
  cakeCabinet.position.set(-1.2, 1.16, 0.1);

  const cabBase = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.05, 0.55), metalSteelMat);
  cabBase.position.y = 0.025;
  cakeCabinet.add(cabBase);

  const cabGlass = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.45, 0.53), glassMat);
  cabGlass.position.y = 0.25;
  cakeCabinet.add(cabGlass);

  const cake = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 12), new THREE.MeshStandardMaterial({ color: 0xff8a80 }));
  cake.position.set(0, 0.1, 0);
  cakeCabinet.add(cake);

  counterGroup.add(cakeCabinet);

  // Elegant Teapot and tea accessories on the counter (only coffee machine, teapot, etc. on the service counter!)
  const teapot = new THREE.Group();
  teapot.name = "cafe_teapot";
  teapot.position.set(0.1, 1.16, 0.3);

  const tpBody = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.16, 12), goldMat); // Polished brass teapot
  tpBody.position.y = 0.08;
  tpBody.castShadow = true;
  teapot.add(tpBody);

  const tpSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.01, 0.12, 8), goldMat);
  tpSpout.position.set(-0.1, 0.13, 0);
  tpSpout.rotation.z = -Math.PI / 4;
  teapot.add(tpSpout);

  const tpHandle = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 8, 12, Math.PI), goldMat);
  tpHandle.position.set(0.1, 0.09, 0);
  tpHandle.rotation.z = -Math.PI / 2;
  teapot.add(tpHandle);

  counterGroup.add(teapot);

  // Blackboard Menu
  const menuBoard = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.1, 1.8), timberMat);
  menuBoard.position.set(0, 2.1, -1.05);
  menuBoard.rotation.y = Math.PI / 2;
  counterGroup.add(menuBoard);

  const menuText = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.0, 1.7), wallPlasterMat);
  menuText.position.set(0.01, 2.1, -1.05);
  menuText.rotation.y = Math.PI / 2;
  menuText.name = "cafe_menu_board";
  counterGroup.add(menuText);

  group.add(counterGroup);

  // 12. OUTDOOR SEATING SECTOR (Patio seating with umbrellas - moved to the left side patio, away from library!)
  const tblPositions = [
    { x: -8.5, z: 2.2 },
    { x: -8.5, z: -2.2 }
  ];

  tblPositions.forEach((pos, idx) => {
    const tableGroup = new THREE.Group();
    tableGroup.position.set(pos.x, 0.08, pos.z);

    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.76, 8), metalSteelMat);
    pedestal.position.y = 0.38;
    pedestal.castShadow = true;
    tableGroup.add(pedestal);

    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.04, 16), timberMat);
    tableTop.position.y = 0.76;
    tableTop.castShadow = true;
    tableGroup.add(tableTop);

    const umbrellaPost = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.4, 8), metalSteelMat);
    umbrellaPost.position.set(0, 1.2, 0);
    umbrellaPost.castShadow = true;
    tableGroup.add(umbrellaPost);

    const dome = new THREE.Mesh(new THREE.ConeGeometry(1.2, 0.5, 12), fabricUmbrellaMat);
    dome.position.set(0, 2.4, 0);
    dome.castShadow = true;
    tableGroup.add(dome);

    const sOffsets = [
      { x: -0.68, z: 0, rot: Math.PI / 2 },
      { x: 0.68, z: 0, rot: -Math.PI / 2 },
      { x: 0, z: -0.68, rot: 0 },
      { x: 0, z: 0.68, rot: Math.PI }
    ];

    sOffsets.forEach((so, sIdx) => {
      const stool = new THREE.Group();
      stool.name = `cafe_stool_${idx}_${sIdx}`;
      stool.position.set(so.x, 0, so.z);
      stool.rotation.y = so.rot;

      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.05, 12), wallPlasterMat);
      seat.position.y = 0.44;
      seat.castShadow = true;
      stool.add(seat);

      const frameLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.44, 4), metalSteelMat);
      frameLeg.position.set(-0.08, 0.22, -0.08); stool.add(frameLeg);
      const frameLeg2 = frameLeg.clone(); frameLeg2.position.set(0.08, 0.22, -0.08); stool.add(frameLeg2);
      const frameLeg3 = frameLeg.clone(); frameLeg3.position.set(-0.08, 0.22, 0.08); stool.add(frameLeg3);
      const frameLeg4 = frameLeg.clone(); frameLeg4.position.set(0.08, 0.22, 0.08); stool.add(frameLeg4);

      tableGroup.add(stool);
    });

    group.add(tableGroup);
  });

  // Bright Interior Ambient Lighting (always active)
  const ceilingLight1 = new THREE.PointLight(0xfff3e0, 6.5, 14);
  ceilingLight1.position.set(-3.0, cH - 0.4, 0);
  ceilingLight1.castShadow = true;
  group.add(ceilingLight1);

  const ceilingLight2 = new THREE.PointLight(0xfff3e0, 6.5, 14);
  ceilingLight2.position.set(3.0, cH - 0.4, 0);
  ceilingLight2.castShadow = true;
  group.add(ceilingLight2);

  return group;
}

export function createYogaGymBuilding(isNightOrSunset = false): THREE.Group {
  const group = new THREE.Group();
  group.name = "Zen Yoga & Gym Studio";

  // Materials
  const concreteMat = new THREE.MeshStandardMaterial({ color: 0x455a64, roughness: 0.8 }); // Dark industrial slate walls
  const gymFloorMat = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, roughness: 0.9 }); // Thick black recycled rubber matting
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.4, metalness: 0.8 }); // Barbells & Dumbbells
  const vinylMat = new THREE.MeshStandardMaterial({ color: 0x00e676, roughness: 0.6 }); // Bright green mats
  const steelMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae, roughness: 0.3, metalness: 0.75 }); // Chrome rods
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x80deea, transparent: true, opacity: 0.2, roughness: 0.1 });
  const lightPurpleMat = new THREE.MeshStandardMaterial({ color: 0xb39ddb, roughness: 0.3 }); // Light purple accent

  const bW = 9.0;
  const bD = 7.5;
  const bH = 3.9;

  // Rubberized Heavy-duty Gym Floor
  const floor = new THREE.Mesh(new THREE.BoxGeometry(bW, 0.1, bD), gymFloorMat);
  floor.position.y = 0.05;
  floor.receiveShadow = true;
  group.add(floor);

  // Walls
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, 0.2), concreteMat);
  backWall.position.set(0, bH / 2, -bD / 2 + 0.1);
  backWall.castShadow = true;
  group.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, bH, bD), concreteMat);
  leftWall.position.set(-bW / 2 + 0.1, bH / 2, 0);
  leftWall.castShadow = true;
  group.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, bH, bD), concreteMat);
  rightWall.position.set(bW / 2 - 0.1, bH / 2, 0);
  rightWall.castShadow = true;
  group.add(rightWall);

  // Front glass columns
  const colGeo = new THREE.CylinderGeometry(0.12, 0.12, bH, 8);
  for (let cX = -bW / 2 + 0.1; cX <= bW / 2 - 0.1; cX += 2.2) {
    const col = new THREE.Mesh(colGeo, concreteMat);
    col.position.set(cX, bH / 2, bD / 2 - 0.1);
    group.add(col);
  }

  // Windows with an open entryway at cX = 1.1
  const glassGeo = new THREE.BoxGeometry(2.0, bH - 0.8, 0.04);
  for (let cX = -bW / 2 + 1.1; cX <= bW / 2 - 1.1; cX += 2.2) {
    // Leave center-right (cX = 1.1) open as a walk-in doorway with an elegant open arch frame!
    if (Math.abs(cX - 1.1) < 0.1) {
      // Hollow timber side posts and header so the user can easily enter!
      const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.15, bH - 0.2, 0.12), concreteMat);
      frameL.position.set(cX - 0.92, (bH - 0.2) / 2, bD / 2 - 0.1);
      frameL.castShadow = true;
      group.add(frameL);
      
      const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.15, bH - 0.2, 0.12), concreteMat);
      frameR.position.set(cX + 0.92, (bH - 0.2) / 2, bD / 2 - 0.1);
      frameR.castShadow = true;
      group.add(frameR);
      
      const frameTop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.25, 0.12), concreteMat);
      frameTop.position.set(cX, bH - 0.225, bD / 2 - 0.1);
      frameTop.castShadow = true;
      group.add(frameTop);
      continue;
    }
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(cX, bH / 2 + 0.1, bD / 2 - 0.1);
    group.add(glass);
  }

  // Roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(bW + 0.4, 0.12, bD + 0.4), concreteMat);
  roof.position.y = bH + 0.06;
  roof.castShadow = true;
  group.add(roof);

  // LED SIGNBOARD
  const signGeo = new THREE.BoxGeometry(4.2, 0.65, 0.1);
  const signMat = new THREE.MeshStandardMaterial({
    map: createSignboardTexture("ZEN YOGA & GYM", "#263238", "#b39ddb"), // Industrial black & light purple accent
    roughness: 0.3
  });
  const signboard = new THREE.Mesh(signGeo, signMat);
  signboard.position.set(0, bH + 0.35, bD / 2 + 0.06);
  signboard.castShadow = true;
  group.add(signboard);

  // Warm glowing interior lighting (always active)
  const gymLight = new THREE.PointLight(0xfff3e0, 6.0, 12);
  gymLight.position.set(0, bH - 0.4, 0);
  gymLight.castShadow = true;
  group.add(gymLight);

  // 1. THREE HIGH-FIDELITY INTERACTIVE TREADMILLS
  const treadmillGroup = new THREE.Group();
  treadmillGroup.position.set(-1.8, 0.11, -1.0);

  for (let tIdx = -1.2; tIdx <= 1.2; tIdx += 1.2) {
    const tm = new THREE.Group();
    tm.name = `gym_treadmill_${tIdx}`;
    tm.position.set(tIdx, 0, 0);

    // Base Belt Deck
    const deck = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.15, 1.1), gymFloorMat);
    deck.position.y = 0.075;
    deck.castShadow = true;
    tm.add(deck);

    // Moving belt strip
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.02, 1.0), concreteMat);
    belt.position.set(0, 0.15, 0.02);
    tm.add(belt);

    // Front motor hood
    const motor = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.28, 0.24), ironMat);
    motor.position.set(0, 0.22, -0.42);
    tm.add(motor);

    // Support rails (Chrome/Steel)
    const railGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.9, 8);
    const railL = new THREE.Mesh(railGeo, steelMat);
    railL.position.set(-0.25, 0.58, -0.25);
    railL.rotation.x = -0.2;
    tm.add(railL);

    const railR = railL.clone();
    railR.position.x = 0.25;
    tm.add(railR);

    // Console screen board
    const consoleBoard = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.18, 0.04), ironMat);
    consoleBoard.position.set(0, 0.98, -0.34);
    consoleBoard.rotation.x = 0.45;
    tm.add(consoleBoard);

    const ledScreen = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.01), new THREE.MeshBasicMaterial({ color: 0x00e676 }));
    ledScreen.position.set(0, 0.98, -0.32);
    ledScreen.rotation.x = 0.45;
    tm.add(ledScreen);

    treadmillGroup.add(tm);
  }

  group.add(treadmillGroup);

  // 2. CHROME DUMBBELLS RACK
  const dbRack = new THREE.Group();
  dbRack.name = "gym_dumbbell_rack";
  dbRack.position.set(2.4, 0.11, -1.2);

  const frameBar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 1.8), steelMat);
  frameBar.position.y = 0.4;
  frameBar.rotation.y = Math.PI / 2;
  dbRack.add(frameBar);

  // Dumbbells on the rack
  for (let z = -0.7; z <= 0.7; z += 0.24) {
    const size = 0.08 + Math.abs(z) * 0.03;
    const db = new THREE.Group();
    db.position.set(0, 0.8, z);
    db.rotation.z = Math.PI / 2;

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.18, 8), steelMat);
    db.add(handle);

    const weightL = new THREE.Mesh(new THREE.CylinderGeometry(size, size, 0.04, 12), ironMat);
    weightL.position.y = -0.07;
    db.add(weightL);

    const weightR = weightL.clone();
    weightR.position.y = 0.07;
    db.add(weightR);

    dbRack.add(db);
  }

  group.add(dbRack);

  // 3. YOGA AREA (Yoga floor mats on the right side)
  const yogaGroup = new THREE.Group();
  yogaGroup.position.set(1.5, 0.11, 1.2);

  const matColors = [0x00e676, 0x00e5ff, 0xd500f9];
  matColors.forEach((color, idx) => {
    const yMat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.01, 1.4), new THREE.MeshStandardMaterial({ color, roughness: 0.9 }));
    yMat.position.set(-0.8 + idx * 1.0, 0.01, 0);
    yMat.receiveShadow = true;
    yMat.name = `yoga_mat_${idx}`;
    yogaGroup.add(yMat);
  });

  group.add(yogaGroup);

  return group;
}

/**
 * 29. DETACHED CHESS ARENA (POLISHED MARBLE FLOOR, LUXURY CHESS TABLES)
 */
export function createChessArena(isNightOrSunset = false): THREE.Group {
  const group = new THREE.Group();
  group.name = "Grandmaster Chess Pavilion";

  // Materials
  const timberMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.8 }); // Deep timber
  const marbleLight = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 }); // Clean white marble
  const marbleDark = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.15 });  // Dark gray marble
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xffb300, roughness: 0.2, metalness: 0.8 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0xa1887f, roughness: 0.6 }); // Light wood chairs
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xe0f2f1, roughness: 0.7 }); // Teal cement walls
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xe0f7fa, transparent: true, opacity: 0.3 });
  const lightPurpleMat = new THREE.MeshStandardMaterial({ color: 0xb39ddb, roughness: 0.3 }); // Light purple accent

  const bW = 9.0;
  const bD = 7.5;
  const bH = 3.9;

  // Polished Marble checkerboard floor base
  const floorBase = new THREE.Mesh(new THREE.BoxGeometry(bW, 0.1, bD), timberMat);
  floorBase.position.y = 0.05;
  floorBase.receiveShadow = true;
  group.add(floorBase);

  const startX = -bW / 2 + 0.45;
  const startZ = -bD / 2 + 0.45;
  for (let xIdx = 0; xIdx < 10; xIdx++) {
    for (let zIdx = 0; zIdx < 8; zIdx++) {
      const isLight = (xIdx + zIdx) % 2 === 0;
      const tile = new THREE.Mesh(
        new THREE.PlaneGeometry(0.85, 0.85),
        isLight ? marbleLight : marbleDark
      );
      tile.rotation.x = -Math.PI / 2;
      tile.position.set(startX + xIdx * 0.9, 0.082, startZ + zIdx * 0.9);
      tile.receiveShadow = true;
      group.add(tile);
    }
  }

  // Walls with large column frames
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, 0.2), wallMat);
  backWall.position.set(0, bH / 2, -bD / 2 + 0.1);
  backWall.castShadow = true;
  group.add(backWall);

  // Left & Right walls
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, bH, bD), wallMat);
  leftWall.position.set(-bW / 2 + 0.1, bH / 2, 0);
  leftWall.castShadow = true;
  group.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, bH, bD), wallMat);
  rightWall.position.set(bW / 2 - 0.1, bH / 2, 0);
  rightWall.castShadow = true;
  group.add(rightWall);

  // Columns & glass frontage with open entryway at cX = 1.1
  const colGeo = new THREE.CylinderGeometry(0.12, 0.12, bH, 8);
  for (let cX = -bW / 2 + 0.1; cX <= bW / 2 - 0.1; cX += 2.2) {
    const col = new THREE.Mesh(colGeo, wallMat);
    col.position.set(cX, bH / 2, bD / 2 - 0.1);
    group.add(col);
  }

  const glassGeo = new THREE.BoxGeometry(2.0, bH - 0.7, 0.04);
  for (let cX = -bW / 2 + 1.1; cX <= bW / 2 - 1.1; cX += 2.2) {
    // Leave center-right (cX = 1.1) completely open as a walk-in entry gate with an elegant open arch frame!
    if (Math.abs(cX - 1.1) < 0.1) {
      // Hollow side posts and header so the user can easily enter!
      const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.15, bH - 0.2, 0.12), wallMat);
      frameL.position.set(cX - 0.92, (bH - 0.2) / 2, bD / 2 - 0.1);
      frameL.castShadow = true;
      group.add(frameL);
      
      const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.15, bH - 0.2, 0.12), wallMat);
      frameR.position.set(cX + 0.92, (bH - 0.2) / 2, bD / 2 - 0.1);
      frameR.castShadow = true;
      group.add(frameR);
      
      const frameTop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.25, 0.12), wallMat);
      frameTop.position.set(cX, bH - 0.225, bD / 2 - 0.1);
      frameTop.castShadow = true;
      group.add(frameTop);
      continue;
    }
    const win = new THREE.Mesh(glassGeo, glassMat);
    win.position.set(cX, bH / 2 + 0.1, bD / 2 - 0.1);
    group.add(win);
  }

  // Roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(bW + 0.4, 0.15, bD + 0.4), wallMat);
  roof.position.y = bH + 0.075;
  roof.castShadow = true;
  group.add(roof);

  // SIGNBOARD
  const signGeo = new THREE.BoxGeometry(4.2, 0.65, 0.1);
  const signMat = new THREE.MeshStandardMaterial({
    map: createSignboardTexture("CHESS PAVILION", "#004d40", "#b39ddb"), // Emerald and light purple accent
    roughness: 0.3
  });
  const signboard = new THREE.Mesh(signGeo, signMat);
  signboard.position.set(0, bH + 0.35, bD / 2 + 0.06);
  signboard.castShadow = true;
  group.add(signboard);

  // Warm glowing interior lighting (always active)
  const chessLight = new THREE.PointLight(0xfff3e0, 6.0, 12);
  chessLight.position.set(0, bH - 0.4, 0);
  chessLight.castShadow = true;
  group.add(chessLight);

  // THREE LUXURY CHESS TABLES WITH MINIATURE PIECES
  const tableOffsets = [-1.8, 0, 1.8];
  tableOffsets.forEach((tX, idx) => {
    const tableGroup = new THREE.Group();
    tableGroup.position.set(tX, 0.09, 0);

    // Pedestal leg
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.76, 8), goldMat);
    pedestal.position.y = 0.38;
    pedestal.castShadow = true;
    tableGroup.add(pedestal);

    // Mahogany Top chess table
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 1.1), timberMat);
    top.position.y = 0.76;
    top.castShadow = true;
    tableGroup.add(top);

    // Chess board grid drawn inline
    const cb = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.01, 0.72), marbleDark);
    cb.position.set(0, 0.795, 0);
    cb.name = `chess_board_${idx}`;
    tableGroup.add(cb);

    // Checker tiles on chess board (Bug-free 8x8 perfect grid)
    const tileSize = 0.08;
    const boardHalfSize = (8 * tileSize) / 2; // 0.32
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const posX = -boardHalfSize + c * tileSize + tileSize / 2;
        const posZ = -boardHalfSize + r * tileSize + tileSize / 2;
        const isWhite = (r + c) % 2 === 0;
        const tileMat = isWhite ? marbleLight : marbleDark;

        // Use a tiny 3D box instead of a flat plane to eliminate z-fighting and clipping at different angles
        const miniTile = new THREE.Mesh(new THREE.BoxGeometry(tileSize, 0.005, tileSize), tileMat);
        miniTile.position.set(posX, 0.801, posZ);
        miniTile.castShadow = true;
        miniTile.receiveShadow = true;
        tableGroup.add(miniTile);
      }
    }

    // High quality chairs (Users can sit here)
    const chairs = [
      { zOffset: -0.68, rot: 0 },
      { zOffset: 0.68, rot: Math.PI }
    ];

    chairs.forEach((ch, cIdx) => {
      const chair = new THREE.Group();
      chair.name = `chess_chair_${idx}_${cIdx}`;
      chair.position.set(0, 0, ch.zOffset);
      chair.rotation.y = ch.rot;

      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.42), woodMat);
      seat.position.y = 0.19;
      seat.castShadow = true;
      chair.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.44, 0.06), woodMat);
      back.position.set(0, 0.58, -0.18);
      back.castShadow = true;
      chair.add(back);

      tableGroup.add(chair);
    });

    group.add(tableGroup);
  });

  // LARGE STANDING CHESS DEMONSTRATION BOARD AGAINST THE BACK WALL
  const demoBoard = new THREE.Group();
  demoBoard.position.set(0, 0.05, -bD / 2 + 0.5); // centered against the back wall

  // Wooden stand legs
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.6, 0.08), timberMat);
  legL.position.set(-1.1, 0.8, 0);
  legL.castShadow = true;
  demoBoard.add(legL);

  const legR = legL.clone();
  legR.position.set(1.1, 0.8, 0);
  demoBoard.add(legR);

  // Large board frame
  const boardFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 0.1), timberMat);
  boardFrame.position.y = 1.7;
  boardFrame.castShadow = true;
  demoBoard.add(boardFrame);

  // Green felt chalkboard face representing the demonstration board
  const boardFace = new THREE.Mesh(new THREE.BoxGeometry(2.25, 1.65, 0.12), new THREE.MeshStandardMaterial({ color: 0x0e3a2f, roughness: 0.9 })); // Deep vintage chalk green
  boardFace.position.set(0, 1.7, 0);
  boardFace.receiveShadow = true;
  demoBoard.add(boardFace);

  // 8x8 painted grid on the demo board
  const squareW = 1.4 / 8; // 0.175
  const gridGroup = new THREE.Group();
  gridGroup.position.set(0, 1.7, 0.065); // slightly in front of face
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const isLight = (r + c) % 2 === 0;
      const sq = new THREE.Mesh(
        new THREE.PlaneGeometry(squareW - 0.005, squareW - 0.005),
        new THREE.MeshStandardMaterial({
          color: isLight ? 0xdfd4bc : 0x224a3e, // cream and dark chalk green
          roughness: 0.9,
          transparent: true,
          opacity: 0.85
        })
      );
      // Place grid squares
      sq.position.set((c - 3.5) * squareW, (3.5 - r) * squareW, 0);
      gridGroup.add(sq);
    }
  }
  demoBoard.add(gridGroup);

  // Header banner on the stand
  const headerBanner = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.16, 0.13), goldMat);
  headerBanner.position.set(0, 2.52, 0);
  demoBoard.add(headerBanner);

  group.add(demoBoard);

  return group;
}

/**
 * 30. CRICKET PRACTICE NETS (SYNTHETIC TURF, METALLIC HIGH NETTING STRETCHES)
 */
export function createCricketNetPractice(isNightOrSunset = false): THREE.Group {
  const group = new THREE.Group();
  group.name = "Lord's Practice Cricket Turf";

  // Materials
  const turfMat = new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.9 }); // Deep synthetic grass green
  const pitchMat = new THREE.MeshStandardMaterial({ color: 0xe0d4be, roughness: 0.95 }); // Professional sand/clay pitch
  const lineMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }); // Crisp white line paint
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x455a64, roughness: 0.4, metalness: 0.8 }); // Galvanized steel poles
  const netMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae, transparent: true, opacity: 0.28, wireframe: true }); // Wireframe netting
  const woodMat = new THREE.MeshStandardMaterial({ color: 0xffb300, roughness: 0.5 }); // Golden ash wood stumps and bats
  const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.8 }); // Dark wood bench
  const leatherMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.2 }); // Shiny red leather cricket ball

  const bW = 15.0; // Much wider turf for dual lanes
  const bD = 13.0; // Much longer turf for realistic run-up
  const bH = 4.8;  // Much taller nets

  // 1. Synthetic Turf Base Ground
  const turf = new THREE.Mesh(new THREE.BoxGeometry(bW, 0.08, bD), turfMat);
  turf.position.y = 0.04;
  turf.receiveShadow = true;
  group.add(turf);

  // 2. Dual Sand/Clay Wicket Pitches (Lane 1 and Lane 2 side by side)
  const pitch1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.015, 11.0), pitchMat);
  pitch1.position.set(-3.0, 0.082, 0);
  pitch1.receiveShadow = true;
  group.add(pitch1);

  const pitch2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.015, 11.0), pitchMat);
  pitch2.position.set(3.0, 0.082, 0);
  pitch2.receiveShadow = true;
  group.add(pitch2);

  // 3. White Crease Markings on both Pitches
  const addCreases = (xOffset: number) => {
    // Back Crease (Z = -4.5)
    const creaseB1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.005, 0.05), lineMat);
    creaseB1.position.set(xOffset, 0.09, -4.5);
    group.add(creaseB1);

    // Back Popping Crease (Z = -3.2)
    const creaseB2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.005, 0.04), lineMat);
    creaseB2.position.set(xOffset, 0.09, -3.2);
    group.add(creaseB2);

    // Front Crease (Z = 4.5)
    const creaseF1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.005, 0.05), lineMat);
    creaseF1.position.set(xOffset, 0.09, 4.5);
    group.add(creaseF1);

    // Front Popping Crease (Z = 3.2)
    const creaseF2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.005, 0.04), lineMat);
    creaseF2.position.set(xOffset, 0.09, 3.2);
    group.add(creaseF2);
  };

  addCreases(-3.0);
  addCreases(3.0);

  // 4. Wooden Wickets/Stumps with Bails
  const createWicketSet = (xPos: number, zPos: number, rotY: number) => {
    const wicketGroup = new THREE.Group();
    wicketGroup.position.set(xPos, 0.08, zPos);
    wicketGroup.rotation.y = rotY;

    // 3 Stumps (vertical cylinders)
    const stumpGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.72, 8);
    const stumpSpacing = 0.08;

    for (let sIdx = -1; sIdx <= 1; sIdx++) {
      const stump = new THREE.Mesh(stumpGeo, woodMat);
      stump.position.set(sIdx * stumpSpacing, 0.36, 0);
      stump.castShadow = true;
      stump.name = "cricket_wicket_stump";
      wicketGroup.add(stump);
    }

    // 2 Bails (horizontal cylinders on top)
    const bailGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.09, 6);
    bailGeo.rotateZ(Math.PI / 2);

    const bailL = new THREE.Mesh(bailGeo, woodMat);
    bailL.position.set(-0.04, 0.725, 0);
    wicketGroup.add(bailL);

    const bailR = new THREE.Mesh(bailGeo, woodMat);
    bailR.position.set(0.04, 0.725, 0);
    wicketGroup.add(bailR);

    return wicketGroup;
  };

  // Add back and front wickets for both lanes
  group.add(createWicketSet(-3.0, -4.6, 0));
  group.add(createWicketSet(-3.0, 4.6, Math.PI));
  group.add(createWicketSet(3.0, -4.6, 0));
  group.add(createWicketSet(3.0, 4.6, Math.PI));

  // 5. Professional High Protective Netting Structure with 3 Lanes (Left, Center Divider, Right)
  const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, bH, 8);
  const zPoles = [-5.5, -2.0, 2.0, 5.5];
  const xPoles = [-6.0, 0.0, 6.0]; // Left wall, center divider wall, right wall

  xPoles.forEach(xp => {
    zPoles.forEach(zp => {
      const pole = new THREE.Mesh(poleGeo, metalMat);
      pole.position.set(xp, bH / 2 + 0.08, zp);
      pole.castShadow = true;
      group.add(pole);
    });
  });

  // Top horizontal connect bars
  xPoles.forEach(xp => {
    const topBarLong = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 11.0), metalMat);
    topBarLong.position.set(xp, bH + 0.08, 0);
    group.add(topBarLong);
  });

  const topBarFront = new THREE.Mesh(new THREE.BoxGeometry(12.0, 0.04, 0.04), metalMat);
  topBarFront.position.set(0, bH + 0.08, 5.5);
  group.add(topBarFront);

  const topBarBack = topBarFront.clone();
  topBarBack.position.z = -5.5;
  group.add(topBarBack);

  // Mesh netting sheets (Left wall, center divider wall, right wall, and back wall)
  const netLeft = new THREE.Mesh(new THREE.BoxGeometry(0.01, bH, 11.0), netMat);
  netLeft.position.set(-6.0, bH / 2 + 0.08, 0);
  group.add(netLeft);

  const netCenter = new THREE.Mesh(new THREE.BoxGeometry(0.01, bH, 11.0), netMat);
  netCenter.position.set(0, bH / 2 + 0.08, 0);
  group.add(netCenter);

  const netRight = new THREE.Mesh(new THREE.BoxGeometry(0.01, bH, 11.0), netMat);
  netRight.position.set(6.0, bH / 2 + 0.08, 0);
  group.add(netRight);

  const netBack = new THREE.Mesh(new THREE.BoxGeometry(12.0, bH, 0.01), netMat);
  netBack.position.set(0, bH / 2 + 0.08, -5.5);
  group.add(netBack);

  // 6. Player Gear Benches (Placed on Left and Right sides)
  const addBench = (xPos: number, angle: number) => {
    const benchGroup = new THREE.Group();
    benchGroup.position.set(xPos, 0.08, 0);
    benchGroup.rotation.y = angle;

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.42, 2.2), darkWoodMat);
    seat.position.y = 0.21;
    seat.castShadow = true;
    benchGroup.add(seat);

    // Kit Bag
    const kitBag = new THREE.Group();
    kitBag.position.set(0, 0.42, -0.5);
    const bagBody = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.8, 12), new THREE.MeshStandardMaterial({ color: 0x01579b, roughness: 0.6 }));
    bagBody.rotation.x = Math.PI / 2;
    kitBag.add(bagBody);
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.6), lineMat);
    strap.position.set(0, 0.2, 0);
    kitBag.add(strap);
    benchGroup.add(kitBag);

    // Bat
    const bat = new THREE.Group();
    bat.position.set(-0.35, 0.05, 0.4);
    bat.rotation.set(0.1, 0, -0.22);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.62, 0.13), woodMat);
    blade.position.y = 0.31;
    blade.castShadow = true;
    bat.add(blade);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.28, 8), lineMat);
    handle.position.y = 0.72;
    bat.add(handle);
    benchGroup.add(bat);

    return benchGroup;
  };

  group.add(addBench(-7.0, Math.PI / 2));
  group.add(addBench(7.0, -Math.PI / 2));

  // Red Leather Cricket Balls lying around
  for (let i = 0; i < 4; i++) {
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.048, 8, 8), leatherMat);
    ball.position.set((Math.random() - 0.5) * 8, 0.13, (Math.random() - 0.5) * 8);
    ball.castShadow = true;
    group.add(ball);
  }

  // 7. Powerful Overhead Floodlights pointing downwards (Double floodlights at top corners)
  const bulbGeo = new THREE.SphereGeometry(0.15, 8, 8);
  const bulbBasicMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const floodZ = [-5.5, 5.5];
  const floodX = [-6.0, 6.0];

  floodX.forEach(fx => {
    floodZ.forEach(fz => {
      const bulb = new THREE.Mesh(bulbGeo, bulbBasicMat);
      bulb.position.set(fx, bH + 0.2, fz);
      group.add(bulb);

      const light = new THREE.SpotLight(0xffffff, 15.0, 20, Math.PI / 4, 0.4, 1);
      light.position.set(fx, bH + 0.15, fz);
      light.target.position.set(fx, 0, fz);
      light.castShadow = false;
      group.add(light);
      group.add(light.target);
    });
  });

  return group;
}

/**
 * 31. DETACHED FOOD PLAZA (COBBLESTONE COURT, THREE VARIED KIOSK STALLS)
 */
export function createFoodCenter(isNightOrSunset = false): THREE.Group {
  const group = new THREE.Group();
  group.name = "The Royal Pavilion Bistro";

  // Materials
  const parquetMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 }); // Rich dark wood floor
  const tileLightMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.4 }); // Ivory marble
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }); // Pristine white plaster walls
  const brickMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.15, metalness: 0.05 }); // Solid white polished marble columns
  const timberMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.8 }); // Deep walnut furniture
  const leatherMat = new THREE.MeshStandardMaterial({ color: 0x2e1c16, roughness: 0.6 }); // Luxury tufted leather booth seats
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xe0f7fa, transparent: true, opacity: 0.35, roughness: 0.1 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xffb300, metalness: 0.8, roughness: 0.2 });
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }); // Porcelain plates
  const fabricUmbrellaMat = new THREE.MeshStandardMaterial({ color: 0xfff8e1, roughness: 0.85 }); // Premium warm cream fabric umbrella canopy

  const bW = 14.5; // Extra long spacious bistro building
  const bD = 8.5;  // Deeper interior space
  const bH = 4.2;  // Lofty ceiling height

  // Floor base
  const base = new THREE.Mesh(new THREE.BoxGeometry(bW, 0.1, bD), parquetMat);
  base.position.y = 0.05;
  base.receiveShadow = true;
  group.add(base);

  // Checkerboard tile runway down the center
  const tSize = 0.8;
  for (let sX = -bW / 2 + 1.2; sX <= bW / 2 - 1.2; sX += tSize) {
    const tile = new THREE.Mesh(new THREE.PlaneGeometry(tSize - 0.04, tSize - 0.04), tileLightMat);
    tile.rotation.x = -Math.PI / 2;
    tile.position.set(sX, 0.105, 0);
    tile.receiveShadow = true;
    group.add(tile);
  }

  // Back wall
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, 0.2), wallMat);
  backWall.position.set(0, bH / 2, -bD / 2 + 0.1);
  group.add(backWall);

  // Left & Right walls
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, bH, bD), wallMat);
  leftWall.position.set(-bW / 2 + 0.1, bH / 2, 0);
  group.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, bH, bD), wallMat);
  rightWall.position.set(bW / 2 - 0.1, bH / 2, 0);
  group.add(rightWall);

  // Front storefront columns forming brick arches
  const colGeo = new THREE.BoxGeometry(0.5, bH, 0.5);
  for (let cX = -bW / 2 + 0.25; cX <= bW / 2 - 0.25; cX += 3.6) {
    const col = new THREE.Mesh(colGeo, brickMat);
    col.position.set(cX, bH / 2, bD / 2 - 0.25);
    group.add(col);
  }

  // Dynamic double sliding glass doors at the center entryway arch (cX around 0)
  const doorH = bH - 0.8;
  const doorW = 1.6;
  const glassDoorL = new THREE.Mesh(new THREE.BoxGeometry(doorW / 2, doorH, 0.04), glassMat);
  glassDoorL.name = "restaurant_door_left";
  glassDoorL.position.set(-doorW / 4 - 0.02, doorH / 2 + 0.05, bD / 2 - 0.25);
  group.add(glassDoorL);

  const glassDoorR = new THREE.Mesh(new THREE.BoxGeometry(doorW / 2, doorH, 0.04), glassMat);
  glassDoorR.name = "restaurant_door_right";
  glassDoorR.position.set(doorW / 4 + 0.02, doorH / 2 + 0.05, bD / 2 - 0.25);
  group.add(glassDoorR);

  // Handle bar
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.0, 0.06), goldMat);
  handle.position.set(0, doorH / 2, bD / 2 - 0.22);
  group.add(handle);

  // Beautiful gold & brick glowing SIGNBOARD
  const signGeo = new THREE.BoxGeometry(7.5, 0.75, 0.12);
  const signMat = new THREE.MeshStandardMaterial({
    map: createSignboardTexture("THE ROYAL BISTRO", "#1c1c1c", "#ffffff"), // Modern charcoal background, elegant white lettering
    roughness: 0.2
  });
  const signboard = new THREE.Mesh(signGeo, signMat);
  signboard.position.set(0, bH + 0.45, bD / 2 - 0.1);
  signboard.castShadow = true;
  group.add(signboard);

  // Pitched A-Frame Roof with integrated center glass skylight
  const roofGroup = new THREE.Group();
  roofGroup.position.set(0, bH, 0);

  const slopeThickness = 0.12;
  const slopeDepth = bD / 2 + 0.6;
  const slantAngle = 0.38; // ~22 degrees slope

  // Left Slope
  const slopeL = new THREE.Mesh(new THREE.BoxGeometry(bW + 0.8, slopeThickness, slopeDepth), timberMat);
  slopeL.position.set(0, Math.sin(slantAngle) * slopeDepth / 2, -Math.cos(slantAngle) * slopeDepth / 2);
  slopeL.rotation.x = slantAngle;
  slopeL.castShadow = true;
  roofGroup.add(slopeL);

  // Right Slope
  const slopeR = new THREE.Mesh(new THREE.BoxGeometry(bW + 0.8, slopeThickness, slopeDepth), timberMat);
  slopeR.position.set(0, Math.sin(slantAngle) * slopeDepth / 2, Math.cos(slantAngle) * slopeDepth / 2);
  slopeR.rotation.x = -slantAngle;
  slopeR.castShadow = true;
  roofGroup.add(slopeR);

  // A beautiful shining glass skylight in the center of the slope
  const skylight = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.16, 2.2), glassMat);
  skylight.position.set(0, Math.sin(slantAngle) * slopeDepth / 2 + 0.08, Math.cos(slantAngle) * slopeDepth / 2);
  skylight.rotation.x = -slantAngle;
  roofGroup.add(skylight);

  // Closed triangular side walls (gables) on Left and Right ends (Extruded 2D shape for exact pitch!)
  const gableShape = new THREE.Shape();
  const halfD = bD / 2;
  const gableH = halfD * Math.tan(slantAngle); // matches slantAngle 0.38
  gableShape.moveTo(-halfD, 0);
  gableShape.lineTo(halfD, 0);
  gableShape.lineTo(0, gableH);
  gableShape.closePath();

  const gableGeo = new THREE.ExtrudeGeometry(gableShape, {
    depth: 0.2,
    bevelEnabled: false
  });

  const gableL = new THREE.Mesh(gableGeo, wallMat);
  gableL.position.set(-bW / 2 + 0.2, 0, 0); // start at roofGroup base (y = bH)
  gableL.rotation.y = Math.PI / 2;
  gableL.castShadow = true;
  roofGroup.add(gableL);

  const gableR = new THREE.Mesh(gableGeo, wallMat);
  gableR.position.set(bW / 2, 0, 0);
  gableR.rotation.y = Math.PI / 2;
  gableR.castShadow = true;
  roofGroup.add(gableR);

  group.add(roofGroup);

  // FRONT OUTDOOR DINING TERRACE PATIO (Bespoke cafe-like sitting outside area)
  const frontPatio = new THREE.Mesh(new THREE.BoxGeometry(bW + 2.0, 0.08, 3.8), parquetMat);
  frontPatio.position.set(0, 0.04, bD / 2 + 1.8);
  frontPatio.receiveShadow = true;
  group.add(frontPatio);

  // Two beautiful outdoor canopy umbrella tables on Left and Right sides of patio
  const outTblPositions = [
    { x: -4.5, z: bD / 2 + 1.8 },
    { x: 4.5, z: bD / 2 + 1.8 }
  ];

  outTblPositions.forEach((pos, idx) => {
    const tableGroup = new THREE.Group();
    tableGroup.position.set(pos.x, 0.08, pos.z);

    // Table post pedestal
    const tablePost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.76, 8), goldMat);
    tablePost.position.y = 0.38;
    tablePost.castShadow = true;
    tableGroup.add(tablePost);

    // Marble tabletop
    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.04, 16), tileLightMat);
    tableTop.position.y = 0.76;
    tableTop.castShadow = true;
    tableGroup.add(tableTop);

    // Umbrella Post
    const umbrellaPost = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.4, 8), goldMat);
    umbrellaPost.position.set(0, 1.2, 0);
    umbrellaPost.castShadow = true;
    tableGroup.add(umbrellaPost);

    // Cream umbrella fabric cone
    const umbrellaCone = new THREE.Mesh(new THREE.ConeGeometry(1.2, 0.5, 12), fabricUmbrellaMat);
    umbrellaCone.position.set(0, 2.4, 0);
    umbrellaCone.castShadow = true;
    tableGroup.add(umbrellaCone);

    // Surrounding chairs (Two per table)
    const chairOffsets = [
      { x: -0.65, z: 0, rot: Math.PI / 2 },
      { x: 0.65, z: 0, rot: -Math.PI / 2 }
    ];

    chairOffsets.forEach((co, cidx) => {
      const chair = new THREE.Group();
      chair.position.set(co.x, 0, co.z);
      chair.rotation.y = co.rot;
      chair.name = `restaurant_outdoor_chair_${idx}_${cidx}`;

      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.42, 0.44), timberMat);
      seat.position.y = 0.21;
      seat.castShadow = true;
      chair.add(seat);

      const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.44, 0.44), timberMat);
      seatBack.position.set(-0.19, 0.64, 0);
      seatBack.castShadow = true;
      chair.add(seatBack);

      tableGroup.add(chair);
    });

    group.add(tableGroup);
  });

  // DETAILED CASH COUNTER BAR
  const counterGroup = new THREE.Group();
  counterGroup.position.set(-3.5, 0.11, -1.5);

  const counterBody = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.1, 1.6), timberMat);
  counterBody.position.y = 0.55;
  counterBody.castShadow = true;
  counterGroup.add(counterBody);

  const counterTop = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.06, 1.8), tileLightMat);
  counterTop.position.y = 1.13;
  counterGroup.add(counterTop);

  // Miniature cake display dome
  const dome = new THREE.Group();
  dome.position.set(-1.6, 1.16, 0);
  const baseDome = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.04, 12), goldMat);
  dome.add(baseDome);
  const glassDome = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), glassMat);
  glassDome.position.y = 0.02;
  dome.add(glassDome);
  const tinyPastry = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 8), new THREE.MeshStandardMaterial({ color: 0xff4081 }));
  tinyPastry.position.y = 0.06;
  dome.add(tinyPastry);
  counterGroup.add(dome);

  // Cash Register (POS)
  const register = new THREE.Group();
  register.position.set(1.2, 1.16, 0);
  const regBase = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.4), new THREE.MeshStandardMaterial({ color: 0x37474f }));
  regBase.position.y = 0.075;
  register.add(regBase);
  const regScreen = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.04), new THREE.MeshStandardMaterial({ color: 0x111111 }));
  regScreen.position.set(0, 0.26, 0.05);
  regScreen.rotation.x = -0.3;
  register.add(regScreen);
  counterGroup.add(register);

  group.add(counterGroup);

  // ELEGANT DINING BOOTHS (Users can sit)
  const boothOffsets = [
    { x: -4.0, z: 2.2 },
    { x: 4.0, z: 2.2 },
    { x: 4.0, z: -1.5 }
  ];

  boothOffsets.forEach((bo, idx) => {
    const booth = new THREE.Group();
    booth.position.set(bo.x, 0.11, bo.z);

    // Dining table
    const table = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.76, 1.0), timberMat);
    table.position.y = 0.38;
    table.castShadow = true;
    booth.add(table);

    // Leather bench seats on both sides of table
    const benchL = new THREE.Group();
    benchL.name = `restaurant_booth_bench_${idx}_left`;
    benchL.position.set(0, 0, -0.85);

    const seatL = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.48, 0.5), leatherMat);
    seatL.position.y = 0.24;
    benchL.add(seatL);

    const backL = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.85, 0.12), leatherMat);
    backL.position.set(0, 0.65, -0.22);
    benchL.add(backL);
    booth.add(benchL);

    const benchR = benchL.clone();
    benchR.name = `restaurant_booth_bench_${idx}_right`;
    benchR.position.z = 0.85;
    benchR.rotation.y = Math.PI;
    booth.add(benchR);

    // Accessories on table (Menu, salt/pepper shakers)
    const miniMenu = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.04), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    miniMenu.position.set(0, 0.92, 0);
    miniMenu.name = `restaurant_booth_menu_${idx}`;
    booth.add(miniMenu);

    const plate1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 12), plateMat);
    plate1.position.set(-0.4, 0.77, 0);
    booth.add(plate1);

    const plate2 = plate1.clone();
    plate2.position.x = 0.4;
    booth.add(plate2);

    group.add(booth);
  });

  // GRAND CHALKBOARD STAND BY ENTRY
  const standMenu = new THREE.Group();
  standMenu.position.set(1.5, 0.11, bD / 2 - 1.2);
  standMenu.rotation.y = -Math.PI / 4;
  const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.3, 6), timberMat);
  leg1.position.set(-0.35, 0.65, 0);
  standMenu.add(leg1);
  const leg2 = leg1.clone();
  leg2.position.set(0.35, 0.65, 0);
  standMenu.add(leg2);
  const frameS = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.95, 0.06), timberMat);
  frameS.position.y = 0.85;
  standMenu.add(frameS);
  const chalkS = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.85, 0.07), new THREE.MeshBasicMaterial({ color: 0x111111 }));
  chalkS.position.set(0, 0.85, 0);
  chalkS.name = "restaurant_bistro_chalk_menu";
  standMenu.add(chalkS);
  group.add(standMenu);

  // MULTI-TIER CRYSTAL CHANDELIERS LIGHTING AT NIGHT
  if (isNightOrSunset) {
    const lampX = [-3.5, 3.5];
    lampX.forEach((lX) => {
      const chandelier = new THREE.Group();
      chandelier.position.set(lX, bH - 0.4, 0);

      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 4), goldMat);
      chain.position.y = 0.2;
      chandelier.add(chain);

      const tier1 = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.04, 8, 16), goldMat);
      tier1.rotation.x = Math.PI / 2;
      chandelier.add(tier1);

      const light = new THREE.PointLight(0xfff3e0, 7.5, 18);
      light.position.y = -0.2;
      light.castShadow = true;
      chandelier.add(light);

      group.add(chandelier);
    });
  }

  return group;
}

/**
 * 32. RANDOM EXTRAS: RUSTIC FLOWER & PLANT SHOP
 */
export function createFlowerShop(isNightOrSunset = false): THREE.Group {
  const group = new THREE.Group();
  group.name = "Blossom Flower Shop";

  const timberMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.9 }); // Natural oak wood
  const mossMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.9 }); // Planters green moss
  const clayMat = new THREE.MeshStandardMaterial({ color: 0xd84315, roughness: 0.8 }); // Red clay flowerpots
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xfffdd0, roughness: 0.7 }); // Soft cream walls

  const bW = 7.5;
  const bD = 6.5;
  const bH = 3.6;

  // Planters deck
  const base = new THREE.Mesh(new THREE.BoxGeometry(bW, 0.1, bD), timberMat);
  base.position.y = 0.05;
  base.receiveShadow = true;
  group.add(base);

  // Back solid wall
  const back = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, 0.15), wallMat);
  back.position.set(0, bH / 2, -bD / 2 + 0.1);
  group.add(back);

  // Roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(bW + 0.4, 0.12, bD + 0.4), timberMat);
  roof.position.y = bH + 0.06;
  group.add(roof);

  // Signboard
  const signGeo = new THREE.BoxGeometry(4.0, 0.65, 0.1);
  const signMat = new THREE.MeshStandardMaterial({
    map: createSignboardTexture("BLOSSOM FLOWER SHOP", "#ad1457", "#b39ddb"), // Fuchsia background, light purple lettering
    roughness: 0.3
  });
  const signboard = new THREE.Mesh(signGeo, signMat);
  signboard.position.set(0, bH + 0.35, bD / 2 - 0.02);
  signboard.castShadow = true;
  group.add(signboard);

  // Cozy hanging flower lantern for evening/night ambience
  if (isNightOrSunset) {
    const floristLight = new THREE.PointLight(0xfff3e0, 5.0, 10);
    floristLight.position.set(0, bH - 0.4, 0);
    floristLight.castShadow = true;
    group.add(floristLight);
  }

  // FLOWER POTS ARRAYS (Clickable display)
  const colorsList = [0xd32f2f, 0xffeb3b, 0xd500f9, 0xff6f00];
  for (let zIdx = -1.2; zIdx <= 1.2; zIdx += 1.2) {
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(-1.8, 0.11, zIdx);

    // Small tier shelf
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.45), timberMat);
    shelf.position.y = 0.175;
    shelf.castShadow = true;
    shelfGroup.add(shelf);

    // 3 Cute clay pots with random colorful flowers!
    for (let potX = -0.4; potX <= 0.4; potX += 0.4) {
      const potGroup = new THREE.Group();
      potGroup.name = "flower_stall_pot";
      potGroup.position.set(potX, 0.35, 0);

      // Red clay pot
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.07, 0.16, 8), clayMat);
      pot.position.y = 0.08;
      pot.castShadow = true;
      potGroup.add(pot);

      // Green stems
      const moss = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), mossMat);
      moss.position.y = 0.16;
      potGroup.add(moss);

      // Colorful flower head
      const flCol = colorsList[Math.floor(Math.random() * colorsList.length)];
      const flower = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshStandardMaterial({ color: flCol }));
      flower.position.y = 0.22;
      potGroup.add(flower);

      shelfGroup.add(potGroup);
    }

    group.add(shelfGroup);
  }

  // Cozy flower stand wrapping counter (Left side)
  const counter = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.95, 1.8), timberMat);
  counter.position.set(1.8, 0.575, 0.2);
  counter.castShadow = true;
  counter.name = "flower_shop_counter";
  group.add(counter);

  return group;
}

/**
 * 33. RANDOM EXTRAS: TOY & SOUVENIR GIFT SHOP
 */
export function createSouvenirShop(isNightOrSunset = false): THREE.Group {
  const group = new THREE.Group();
  group.name = "Souvenir & Gift Shop";

  const vinylFloor = new THREE.MeshStandardMaterial({ color: 0x006064, roughness: 0.3 }); // Polished dark cyan
  const timberMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 });
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xe0f7fa, roughness: 0.7 }); // Pale blue walls

  const bW = 7.5;
  const bD = 6.5;
  const bH = 3.6;

  // Base floor
  const base = new THREE.Mesh(new THREE.BoxGeometry(bW, 0.1, bD), vinylFloor);
  base.position.y = 0.05;
  base.receiveShadow = true;
  group.add(base);

  // Back solid wall
  const back = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, 0.15), wallMat);
  back.position.set(0, bH / 2, -bD / 2 + 0.1);
  group.add(back);

  // Roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(bW + 0.4, 0.12, bD + 0.4), timberMat);
  roof.position.y = bH + 0.06;
  group.add(roof);

  // Signboard
  const signGeo = new THREE.BoxGeometry(4.0, 0.65, 0.1);
  const signMat = new THREE.MeshStandardMaterial({
    map: createSignboardTexture("GIFTS & SOUVENIRS", "#006064", "#b39ddb"), // Teal background, light purple lettering
    roughness: 0.3
  });
  const signboard = new THREE.Mesh(signGeo, signMat);
  signboard.position.set(0, bH + 0.35, bD / 2 - 0.02);
  signboard.castShadow = true;
  group.add(signboard);

  // Cozy overhead hanging gift shop PointLight for night hours
  if (isNightOrSunset) {
    const giftLight = new THREE.PointLight(0xfff3e0, 5.0, 10);
    giftLight.position.set(0, bH - 0.4, 0);
    giftLight.castShadow = true;
    group.add(giftLight);
  }

  // INTERIOR: Souvenir showcase gift stand (Clickable display shelf)
  const giftStand = new THREE.Group();
  giftStand.name = "souvenir_stall_shelf";
  giftStand.position.set(-1.8, 0.11, 0);

  const mainCabinet = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 0.4), timberMat);
  mainCabinet.position.y = 0.9;
  mainCabinet.castShadow = true;
  giftStand.add(mainCabinet);

  // Miniature colorful gift box parcels
  const giftColList = [0xd32f2f, 0x1976d2, 0xfbc02d, 0x388e3c, 0xe64a19];
  for (let shY = 0.4; shY <= 1.4; shY += 0.5) {
    for (let gX = -0.6; gX <= 0.6; gX += 0.4) {
      const gCol = giftColList[Math.floor(Math.random() * giftColList.length)];
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.24), new THREE.MeshStandardMaterial({ color: gCol, roughness: 0.3 }));
      box.position.set(gX, shY + 0.12, 0.1);
      box.castShadow = true;
      giftStand.add(box);

      // Ribbon tying detail
      const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.25, 0.25), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      ribbon.position.set(gX, shY + 0.12, 0.105);
      giftStand.add(ribbon);
    }
  }

  group.add(giftStand);

  // Wrapping cashier counter with cash register
  const wrapCounter = new THREE.Group();
  wrapCounter.position.set(1.6, 0.11, 0.2);

  const counterBody = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.95, 1.6), timberMat);
  counterBody.position.y = 0.475;
  counterBody.castShadow = true;
  wrapCounter.add(counterBody);

  const cashRegister = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.24, 0.35), new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.4 }));
  cashRegister.position.set(0, 1.07, 0);
  cashRegister.castShadow = true;
  cashRegister.name = "souvenir_cash_register";
  wrapCounter.add(cashRegister);

  group.add(wrapCounter);

  return group;
}

/**
 * 34. DETACHED LONG SUPERMARKET BUILDING (WITH GROCERY SHELVES, SHOPPING CARTS, SCANNER COUNTERS)
 */
export function createSupermarketBuilding(isNightOrSunset = false): THREE.Group {
  const group = new THREE.Group();
  group.name = "Grand Cognitive Supermarket & PVR";

  // Materials
  const tileMat = new THREE.MeshStandardMaterial({ color: 0xe0f2f1, roughness: 0.3 }); // Polished mint green vinyl tiles
  const brickMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae, roughness: 0.8 }); // Clean modern grey brick
  const shelfMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.5 }); // Metal storage shelving
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.7 }); // Cashier wood details
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xe0f7fa, transparent: true, opacity: 0.15, roughness: 0.05 }); // Clear sparkling glass
  const lightPurpleMat = new THREE.MeshStandardMaterial({ color: 0xb39ddb, roughness: 0.3 }); // Light purple accent
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.15, metalness: 0.85 }); // Gold details
  const timberMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.8 }); // Dark mahogany wood

  const bW = 16.0; // Long building!
  const bD = 8.0;
  const bH = 7.6;  // Doubled height for PVR Cinemas on second floor!

  // Base Floor (Supermarket floor)
  const base = new THREE.Mesh(new THREE.BoxGeometry(bW, 0.1, bD), tileMat);
  base.position.y = 0.05;
  base.receiveShadow = true;
  group.add(base);

  // Back Wall (Doubled height)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, 0.2), brickMat);
  backWall.position.set(0, bH / 2, -bD / 2 + 0.1);
  backWall.castShadow = true;
  group.add(backWall);

  // Left & Right Walls (Doubled height)
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, bH, bD), brickMat);
  leftWall.position.set(-bW / 2 + 0.1, bH / 2, 0);
  leftWall.castShadow = true;
  group.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, bH, bD), brickMat);
  rightWall.position.set(bW / 2 - 0.1, bH / 2, 0);
  rightWall.castShadow = true;
  group.add(rightWall);

  // Front Columns (Doubled height columns)
  const colGeo = new THREE.CylinderGeometry(0.12, 0.12, bH, 8);
  for (let cX = -bW / 2 + 0.1; cX <= bW / 2 - 0.1; cX += 2.6) {
    if (Math.abs(cX) < 1.0) continue; // Leave center open for double entry gate

    const col = new THREE.Mesh(colGeo, brickMat);
    col.position.set(cX, bH / 2, bD / 2 - 0.1);
    col.castShadow = true;
    group.add(col);
  }

  // FRONT OPEN ENTRYWAY GATE (Completely open portal for user entry)
  const archPillarL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.3, 0.5), brickMat);
  archPillarL.position.set(-1.3, 1.65, bD / 2 - 0.1);
  group.add(archPillarL);

  const archPillarR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.3, 0.5), brickMat);
  archPillarR.position.set(1.3, 1.65, bD / 2 - 0.1);
  group.add(archPillarR);

  const archHeader = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.5, 0.5), brickMat);
  archHeader.position.set(0, 3.55, bD / 2 - 0.1);
  group.add(archHeader);

  // Timber Entry Border
  const entryBorder = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.08, 0.6), woodMat);
  entryBorder.position.set(0, 3.3, bD / 2 - 0.1);
  group.add(entryBorder);

  // Front Glass facades (Ground floor windows)
  const glassGeo = new THREE.BoxGeometry(2.3, 3.2, 0.04);
  for (let cX = -bW / 2 + 1.3; cX <= bW / 2 - 1.3; cX += 2.6) {
    if (Math.abs(cX) < 1.5) continue; // Skip entryway

    const win = new THREE.Mesh(glassGeo, glassMat);
    win.position.set(cX, 1.7, bD / 2 - 0.1);
    group.add(win);
  }

  // 2nd Floor Glass Facades (PVR upper level glass observation windows)
  const glassGeo2nd = new THREE.BoxGeometry(2.3, 2.8, 0.04);
  for (let cX = -bW / 2 + 1.3; cX <= bW / 2 - 1.3; cX += 2.6) {
    const winUpper = new THREE.Mesh(glassGeo2nd, glassMat);
    winUpper.position.set(cX, 5.3, bD / 2 - 0.1);
    group.add(winUpper);
  }

  // Main Roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(bW + 0.4, 0.15, bD + 0.4), brickMat);
  roof.position.y = bH + 0.075;
  roof.castShadow = true;
  group.add(roof);

  // Double Signboard: Supermarket Ground & PVR Cinemas 2nd Floor!
  const signGeo = new THREE.BoxGeometry(7.2, 0.75, 0.12);
  const signMat = new THREE.MeshStandardMaterial({
    map: createSignboardTexture("GRAND SUPERMARKET", "#111111", "#a1ffaf"), // glowing green logo
    roughness: 0.3
  });
  const signboard = new THREE.Mesh(signGeo, signMat);
  signboard.position.set(-3.8, bH + 0.4, bD / 2 + 0.08);
  signboard.castShadow = true;
  group.add(signboard);

  const signGeo2 = new THREE.BoxGeometry(6.2, 0.75, 0.12);
  const signMat2 = new THREE.MeshStandardMaterial({
    map: createSignboardTexture("PVR CINEMAS", "#d50000", "#ffffff"), // glowing red theater logo
    roughness: 0.2
  });
  const signboard2 = new THREE.Mesh(signGeo2, signMat2);
  signboard2.position.set(4.0, bH + 0.4, bD / 2 + 0.08);
  signboard2.castShadow = true;
  group.add(signboard2);

  // Warm interior supermarket strip lights
  if (isNightOrSunset) {
    const light1 = new THREE.PointLight(0xfff3e0, 6.0, 14);
    light1.position.set(-4.0, 3.3, 0);
    group.add(light1);

    const light2 = new THREE.PointLight(0xfff3e0, 6.0, 14);
    light2.position.set(4.0, 3.3, 0);
    group.add(light2);

    const light3 = new THREE.PointLight(0xfff59d, 7.5, 14);
    light3.position.set(0, bH - 0.5, 0);
    group.add(light3);
  }

  // =============================================================
  // SECOND FLOOR: PVR CINEMAS COMPLEX
  // =============================================================
  const floor2 = new THREE.Mesh(new THREE.BoxGeometry(bW - 0.2, 0.1, bD - 0.2), tileMat);
  floor2.position.set(0, 3.8, 0);
  floor2.receiveShadow = true;
  group.add(floor2);

  // A. PVR Theater Projection Screen
  const screenGroup = new THREE.Group();
  screenGroup.position.set(0, 5.7, -bD / 2 + 0.3);

  const border = new THREE.Mesh(new THREE.BoxGeometry(6.5, 3.1, 0.1), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 }));
  border.castShadow = true;
  screenGroup.add(border);

  const screen = new THREE.Mesh(new THREE.BoxGeometry(6.2, 2.8, 0.12), new THREE.MeshStandardMaterial({
    color: 0x00d2ff, 
    emissive: 0x005cbf,
    emissiveIntensity: 1.6,
    roughness: 0.1
  }));
  screenGroup.add(screen);

  const pvrSign = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 0.12), new THREE.MeshStandardMaterial({
    map: createSignboardTexture("NOW PLAYING", "#111111", "#ffb300"),
    roughness: 0.3
  }));
  pvrSign.position.y = 1.9;
  screenGroup.add(pvrSign);

  group.add(screenGroup);

  // B. Tiered Red Cinema Seats facing the screen (placed at positive X of 2nd floor)
  const rowZ = [2.4, 1.0, -0.4];
  const rowY = [3.9, 4.3, 4.7];

  rowZ.forEach((sz, rIdx) => {
    const ry = rowY[rIdx];
    
    // Tier concrete steps platform
    const step = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.4, 1.2), brickMat);
    step.position.set(4.0, ry - 0.2, sz);
    step.castShadow = true;
    group.add(step);

    // 4 Cinema seats per row
    for (let sx = 1.2; sx <= 6.8; sx += 1.6) {
      const seatGroup = new THREE.Group();
      seatGroup.position.set(sx, ry, sz);
      seatGroup.name = `pvr_seat_row_${rIdx}_${sx}`;

      // Seat cushion
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.45, 0.72), new THREE.MeshStandardMaterial({ color: 0xd50000, roughness: 0.85 }));
      seat.position.y = 0.225;
      seat.castShadow = true;
      seatGroup.add(seat);

      // Backrest
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.85, 0.16), new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.85 }));
      back.position.set(0, 0.65, 0.28);
      back.castShadow = true;
      seatGroup.add(back);

      // Armrests with golden trim
      const armL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.44, 0.64), goldMat);
      armL.position.set(-0.44, 0.45, 0);
      seatGroup.add(armL);

      const armR = armL.clone();
      armR.position.x = 0.44;
      seatGroup.add(armR);

      group.add(seatGroup);
    }
  });

  // C. Supermarket to PVR Staircase (Back Left Corner)
  const stairGroup = new THREE.Group();
  stairGroup.position.set(-6.5, 0.1, -2.5);

  for (let step = 0; step < 13; step++) {
    const stepY = step * 0.29;
    const stepZ = step * 0.38;
    const stair = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.16, 0.38), timberMat);
    stair.position.set(0, stepY + 0.08, stepZ);
    stair.castShadow = true;
    stairGroup.add(stair);
  }
  group.add(stairGroup);

  // D. Atrium glass protective railing
  const railing = new THREE.Mesh(new THREE.BoxGeometry(bW - 0.4, 0.95, 0.05), glassMat);
  railing.position.set(0, 4.38, bD / 2 - 0.25);
  group.add(railing);

  const railCap = new THREE.Mesh(new THREE.BoxGeometry(bW - 0.2, 0.04, 0.08), goldMat);
  railCap.position.set(0, 4.86, bD / 2 - 0.25);
  group.add(railCap);

  // E. Cinema Popcorn & Ticket Concession Stand (Left Front)
  const concession = new THREE.Group();
  concession.position.set(-3.8, 3.9, 1.8);

  const conCounter = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.95, 0.75), timberMat);
  conCounter.position.y = 0.475;
  conCounter.castShadow = true;
  concession.add(conCounter);

  const conTop = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.06, 0.8), tileMat);
  conTop.position.y = 0.98;
  concession.add(conTop);

  // Glowing Popcorn machine
  const popcornMachine = new THREE.Group();
  popcornMachine.position.set(-0.6, 1.01, 0);
  const pmBase = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.55, 0.44), new THREE.MeshStandardMaterial({ color: 0xff1744 }));
  pmBase.position.y = 0.275;
  popcornMachine.add(pmBase);

  const pmGlass = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.42), glassMat);
  pmGlass.position.y = 0.55;
  popcornMachine.add(pmGlass);

  const corn = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffeb3b }));
  corn.position.set(0, 0.45, 0);
  popcornMachine.add(corn);
  concession.add(popcornMachine);

  group.add(concession);


  // =============================================================
  // GROUND FLOOR: EXPANDED COGNITIVE SUPERMARKET
  // =============================================================
  // 1. Double-sided grocery aisles shelves loaded with colorful goods
  const colors = [0xd32f2f, 0x1976d2, 0x388e3c, 0xfbc02d, 0xe64a19, 0xb39ddb];
  const itemNames = ["Cereal Box", "Juice Box", "Canned Soup", "Detergent", "Soda Bottle", "Pasta Box"];

  const shelfPositions = [-4.5, 0, 4.5];
  shelfPositions.forEach((sX, sIdx) => {
    const aisle = new THREE.Group();
    aisle.position.set(sX, 0.11, -1.2);

    // Shelf metal upright support frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.2, 0.95), shelfMat);
    frame.position.y = 1.1;
    frame.castShadow = true;
    aisle.add(frame);

    // 3 Tiers of shelves boards
    for (let shY = 0.5; shY <= 1.7; shY += 0.6) {
      const board = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.03, 0.92), woodMat);
      board.position.set(0, shY, 0);
      aisle.add(board);

      // Add small boxes on shelves on both front and back faces!
      const zOffsets = [-0.3, 0.3];
      zOffsets.forEach(zOff => {
        for (let ix = -0.7; ix <= 0.7; ix += 0.28) {
          const itemH = 0.16 + Math.random() * 0.08;
          const itemW = 0.12 + Math.random() * 0.06;
          const itemD = 0.12 + Math.random() * 0.04;
          const col = colors[Math.floor(Math.random() * colors.length)];

          const itemMesh = new THREE.Mesh(
            new THREE.BoxGeometry(itemW, itemH, itemD),
            new THREE.MeshStandardMaterial({ color: col, roughness: 0.4 })
          );
          itemMesh.position.set(ix, shY + itemH / 2 + 0.015, zOff);
          itemMesh.castShadow = true;
          itemMesh.name = `supermarket_shelf_item: "${itemNames[Math.floor(Math.random() * itemNames.length)]}"`;
          aisle.add(itemMesh);
        }
      });
    }

    group.add(aisle);
  });

  // 2. Cashier Checkout counter #1 (front left)
  const checkout1 = new THREE.Group();
  checkout1.position.set(-5.5, 0.11, 2.2);

  const counter1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.95, 0.8), woodMat);
  counter1.position.set(0, 0.475, 0);
  counter1.castShadow = true;
  checkout1.add(counter1);

  const belt1 = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.012, 0.6), shelfMat);
  belt1.position.set(-0.1, 0.956, 0);
  checkout1.add(belt1);

  const register1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.35), new THREE.MeshStandardMaterial({ color: 0x212121 }));
  register1.position.set(0.8, 1.05, 0);
  register1.name = "supermarket_cash_register";
  checkout1.add(register1);

  const monitor1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.04), new THREE.MeshStandardMaterial({ color: 0xb39ddb }));
  monitor1.position.set(0.8, 1.22, 0);
  checkout1.add(monitor1);

  group.add(checkout1);

  // 3. Cashier Checkout counter #2 (front right - Double Decor checkout lanes!)
  const checkout2 = checkout1.clone();
  checkout2.position.set(1.5, 0.11, 2.2);
  group.add(checkout2);

  // 4. Fresh Organic Produce Wood Table (Fruit crates with colorful sphere fruits!)
  const produceTable = new THREE.Group();
  produceTable.position.set(-1.8, 0.11, 1.5);

  const pTable = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.78, 0.95), timberMat);
  pTable.position.y = 0.39;
  pTable.castShadow = true;
  produceTable.add(pTable);

  const crateColors = [0xe53935, 0x43a047, 0xfb8c00]; // Red apples, green grapes, orange oranges
  const crateOffsets = [-0.5, 0, 0.5];
  crateOffsets.forEach((cx, cidx) => {
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.65), woodMat);
    crate.position.set(cx, 0.85, 0);
    produceTable.add(crate);

    for (let fx = -0.12; fx <= 0.12; fx += 0.08) {
      for (let fz = -0.22; fz <= 0.22; fz += 0.08) {
        const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), new THREE.MeshStandardMaterial({ color: crateColors[cidx], roughness: 0.2 }));
        fruit.position.set(cx + fx, 0.93 + Math.random() * 0.04, fz);
        produceTable.add(fruit);
      }
    }
  });
  group.add(produceTable);

  // 5. Bakery Glass Show Cabinet with fresh loaves of bread
  const bakeryTable = new THREE.Group();
  bakeryTable.position.set(1.8, 0.11, 1.5);

  const bTable = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.78, 0.95), timberMat);
  bTable.position.y = 0.39;
  bTable.castShadow = true;
  bakeryTable.add(bTable);

  const bDome = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), glassMat);
  bDome.position.set(0, 0.8, 0);
  bakeryTable.add(bDome);

  const loaf = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.14), new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.9 }));
  loaf.position.set(0, 0.85, 0);
  loaf.castShadow = true;
  bakeryTable.add(loaf);
  group.add(bakeryTable);

  // 6. Stack of Shopping Baskets (front right)
  const baskets = new THREE.Group();
  baskets.position.set(5.5, 0.11, 2.2);

  const rack = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.7), shelfMat);
  rack.position.y = 0.3;
  baskets.add(rack);

  for (let bIdx = 0; bIdx < 4; bIdx++) {
    const basket = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.15, 0.45), lightPurpleMat);
    basket.position.set(0, 0.6 + bIdx * 0.18, 0);
    basket.castShadow = true;
    basket.name = "supermarket_shopping_basket";
    baskets.add(basket);
  }
  group.add(baskets);

  // 7. DYNAMIC DOUBLE SLIDING GLASS DOORS (AT CENTER ENTRYWAY)
  const sDoorH = 3.1;
  const sDoorW = 2.4;
  const sGlassDoorL = new THREE.Mesh(new THREE.BoxGeometry(sDoorW / 2, sDoorH, 0.04), glassMat);
  sGlassDoorL.name = "supermarket_door_left";
  sGlassDoorL.position.set(-sDoorW / 4 - 0.02, sDoorH / 2 + 0.05, bD / 2 - 0.15);
  group.add(sGlassDoorL);

  const sGlassDoorR = new THREE.Mesh(new THREE.BoxGeometry(sDoorW / 2, sDoorH, 0.04), glassMat);
  sGlassDoorR.name = "supermarket_door_right";
  sGlassDoorR.position.set(sDoorW / 4 + 0.02, sDoorH / 2 + 0.05, bD / 2 - 0.15);
  group.add(sGlassDoorR);

  // 8. INTERIOR REFRIGERATOR DRINK UNIT
  const fridge = new THREE.Group();
  fridge.position.set(6.2, 0.11, -1.5);
  fridge.rotation.y = -Math.PI / 2; // Facing inwards (West)

  const fFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.3, 0.85), new THREE.MeshStandardMaterial({ color: 0x455a64, roughness: 0.3 }));
  fFrame.position.y = 1.15;
  fridge.add(fFrame);

  if (isNightOrSunset) {
    const fLight = new THREE.PointLight(0x00e5ff, 4.0, 6);
    fLight.position.set(0, 1.2, 0.2);
    fridge.add(fLight);
  }

  const fBack = new THREE.Mesh(new THREE.BoxGeometry(1.68, 2.1, 0.1), new THREE.MeshBasicMaterial({ color: 0x111111 }));
  fBack.position.set(0, 1.15, -0.3);
  fridge.add(fBack);

  const fGlass = new THREE.Mesh(new THREE.BoxGeometry(1.68, 2.0, 0.05), glassMat);
  fGlass.position.set(0, 1.15, 0.38);
  fridge.add(fGlass);

  for (let fY = 0.4; fY <= 1.8; fY += 0.45) {
    const fShelf = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.02, 0.65), glassMat);
    fShelf.position.set(0, fY, 0.02);
    fridge.add(fShelf);

    for (let fX = -0.7; fX <= 0.7; fX += 0.22) {
      const fColor = Math.random() > 0.5 ? 0x00e5ff : 0xff1744;
      const can = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 6), new THREE.MeshStandardMaterial({ color: fColor, metalness: 0.8, roughness: 0.2 }));
      can.position.set(fX, fY + 0.085, 0.05);
      can.name = `supermarket_shelf_item: "Cold Chilled Soda"`;
      fridge.add(can);
    }
  }
  group.add(fridge);

  // 9. DESIGNER SHOPPING CARTS (lined up in rows!)
  const cartGroup = new THREE.Group();
  cartGroup.position.set(3.8, 0.11, 2.3);
  cartGroup.rotation.y = Math.PI / 1.15;

  const cartBase = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.45), shelfMat);
  cartBase.position.y = 0.12;
  cartGroup.add(cartBase);

  const cartWire = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.42, 0.42), new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.2, wireframe: true }));
  cartWire.position.y = 0.42;
  cartGroup.add(cartWire);

  const cartHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.42, 6), lightPurpleMat);
  cartHandle.rotation.x = Math.PI / 2;
  cartHandle.position.set(-0.32, 0.62, 0);
  cartGroup.add(cartHandle);

  group.add(cartGroup);

  // Create three lined-up carts
  for (let cartIdx = 1; cartIdx <= 3; cartIdx++) {
    const extraCart = cartGroup.clone();
    extraCart.position.set(3.8 - cartIdx * 0.62, 0.11, 2.3);
    group.add(extraCart);
  }

  return group;
}







