import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  TreePine, 
  Sun, 
  Sunset, 
  Moon, 
  CloudRain, 
  Cloud, 
  Volume2, 
  VolumeX, 
  Compass, 
  Info, 
  RotateCw, 
  HelpCircle, 
  Navigation, 
  Play, 
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Eye,
  Trees,
  Tv,
  ExternalLink,
  User,
  Music,
  Footprints
} from 'lucide-react';
import { 
  createGrassTexture, 
  createAsphaltTexture, 
  createFootpathTexture 
} from './components/TextureGenerator';
import { 
  createOakTree, 
  createPineTree, 
  createBench, 
  createLamppost, 
  createTrashBin, 
  createWaterFountain, 
  createInformationKiosk, 
  createShrub, 
  createFlowerBed,
  createOrangeRowHouse,
  createBookstoreStorefront,
  createArtisanFactory,
  createDoubleGabledHouse,
  createOrnamentalHouseHedge,
  createParkEntranceGate,
  createGrandParkStatue,
  createBigGMonument,
  createClockTower,
  createBiggerShrub,
  createStadiumLightTower,
  createRoadLight,
  createStandingObservationPlace,
  createFireHydrant,
  createSpeedLimitSign,
  createBusStopShelter,
  createBicycleStand,
  createRailing,
  createPersonalGarden,
  createArrowSignBoard,
  createHammockSwing,
  createPetHouse,
  createOpenCafe,
  createStandingBus,
  createYellowArrowBoard,
  createLibraryBuilding,
  createCafeBuilding,
  createYogaGymBuilding,
  createChessArena,
  createCricketNetPractice,
  createFoodCenter,
  createSupermarketBuilding
} from './components/ModelGenerator';
import { AudioEngine } from './components/AudioEngine';
import { ChessGame } from './components/ChessGame';

/**
 * Determines what surface material the player is standing on based on coordinate positions
 */
function getMaterialAt(x: number, z: number): 'asphalt' | 'grass' | 'concrete' | 'stone' {
  // 1. Cricket Net Practice Turf area (synthetic grass)
  if (x >= 23.0 && x <= 34.0 && z >= -13.5 && z <= -2.5) {
    return 'grass';
  }

  // 2. Main South Road or Entrance road segment
  if (z >= 27.0) {
    return 'asphalt';
  }
  if (z >= 21.8 && Math.abs(x) < 2.0) {
    return 'asphalt';
  }

  // 3. Outer sidewalks / footpaths
  if (z >= 21.8 && z < 27.0 && Math.abs(x) >= 2.0) {
    return 'concrete';
  }
  if (Math.abs(z - (-22.55)) < 1.0) return 'concrete';
  if (Math.abs(x - (-22.55)) < 1.0) return 'concrete';
  if (Math.abs(x - 22.55) < 1.0) return 'concrete';

  // 4. Close to shop walls or outside inner park boundaries (stone paving/indoors)
  if (Math.abs(x) > 21.8 || Math.abs(z) > 21.8) {
    return 'stone';
  }

  // 5. Central Plaza (radius 7.5)
  const distFromCenter = Math.sqrt(x * x + z * z);
  if (distFromCenter <= 7.5) {
    return 'stone';
  }

  // 6. Entrance Walkway
  if (Math.abs(x) <= 1.5 && z >= 7.5 && z <= 21.8) {
    return 'stone';
  }

  // 7. Diagonal Paths (45 degree lines)
  const distToDiag1 = Math.abs(x - z) / Math.SQRT2;
  const distToDiag2 = Math.abs(x + z) / Math.SQRT2;
  if ((distToDiag1 <= 1.1 || distToDiag2 <= 1.1) && distFromCenter <= 21.8) {
    return 'stone';
  }

  return 'grass';
}

// Pre-defined static park layout for beautiful dense greenery & accessories
// ALL SAKURA (PINK) TREES REMOVED, ALL TREES POSITIONED TO NEVER INTERSECT DIAGONAL PATHS
const STATIC_ELEMENTS = [
  // Lampposts along footpaths inside the park
  { type: 'lamppost', x: -9.5, z: -9.5, rotation: Math.PI / 4 },
  { type: 'lamppost', x: 9.5, z: -9.5, rotation: -Math.PI / 4 },
  { type: 'lamppost', x: -9.5, z: 9.5, rotation: (3 * Math.PI) / 4 },
  { type: 'lamppost', x: 9.5, z: 9.5, rotation: -(3 * Math.PI) / 4 },
  { type: 'lamppost', x: -18, z: 0, rotation: Math.PI / 2 },
  { type: 'lamppost', x: 18, z: 0, rotation: -Math.PI / 2 },
  { type: 'lamppost', x: 0, z: -18, rotation: 0 },

  // Trash bins placed next to the utilities
  { type: 'trash_bin', x: -14.2, z: 1.2, rotation: Math.PI / 2 },
  { type: 'trash_bin', x: 14.2, z: -1.2, rotation: -Math.PI / 2 },
  { type: 'trash_bin', x: 1.2, z: -14.2, rotation: 0 },

  // Clock Tower
  { type: 'clock_tower', x: 15, z: -8, rotation: -Math.PI / 6 },

  // Information Kiosk
  { type: 'kiosk', x: 18.0, z: 11.0, rotation: -Math.PI / 2 },

  // Standing Observation Decks
  { type: 'standing_observation', x: -13, z: 0, rotation: Math.PI / 2 },
  { type: 'standing_observation', x: 13, z: 0, rotation: -Math.PI / 2 },
  { type: 'standing_observation', x: 0, z: -13, rotation: 0 },

  // Majestic Stadium Light Towers (at the 4 outer corners of the park)
  { type: 'stadium_light', x: -19, z: -19, rotation: Math.PI / 4 },
  { type: 'stadium_light', x: 19, z: -19, rotation: -Math.PI / 4 },
  { type: 'stadium_light', x: -19, z: 19, rotation: (3 * Math.PI) / 4 },
  { type: 'stadium_light', x: 19, z: 19, rotation: -(3 * Math.PI) / 4 },

  // Modern Road Lights positioned OUTSIDE the park, along the Southern edge of the main road, facing North (into the road)
  { type: 'road_light', x: -18, z: 32.2, rotation: Math.PI },
  { type: 'road_light', x: 18, z: 32.2, rotation: Math.PI },

  // Only two bus stops (Left and Right) positioned cleanly on the Southern footpath/walkway facing the road (Middle one at x: -8 near monument removed!)
  { type: 'bus_stop', x: -16.0, z: 24.5, rotation: Math.PI },
  { type: 'bus_stop', x: 16.0, z: 24.5, rotation: Math.PI },

  // Extra sidewalk benches next to bus stops removed as requested

  // Added beautiful Oak Trees strictly on the side borders of the park (to keep center completely open and avoid shop overlap)
  { type: 'oak_tree', x: -16.5, z: -10.0, rotation: 1.2, scale: 1.25 },
  { type: 'oak_tree', x: -16.5, z: 0.0, rotation: 4.5, scale: 1.1 },
  { type: 'oak_tree', x: -16.5, z: 10.0, rotation: 3.1, scale: 1.25 },
  { type: 'oak_tree', x: 16.5, z: -10.0, rotation: 1.1, scale: 1.2 },
  { type: 'oak_tree', x: 16.5, z: 0.0, rotation: 2.8, scale: 1.1 },
  { type: 'oak_tree', x: 16.5, z: 10.0, rotation: 1.9, scale: 1.2 },
  { type: 'oak_tree', x: -10.0, z: -16.5, rotation: 3.6, scale: 1.25 },
  { type: 'oak_tree', x: 10.0, z: -16.5, rotation: 1.4, scale: 1.3 },
  { type: 'oak_tree', x: -15.0, z: 16.0, rotation: 0.5, scale: 1.25 },
  { type: 'oak_tree', x: 15.0, z: 16.0, rotation: 2.1, scale: 1.15 },

  // Shrubbery clusters (Positioned beautifully on the green lawns)
  { type: 'shrub', x: -4, z: -9, rotation: 0.5 },
  { type: 'shrub', x: 4, z: -9, rotation: 2.1 },
  { type: 'shrub', x: -9, z: 4, rotation: 1.4 },
  { type: 'shrub', x: 9, z: -4, rotation: 3.5 },

  // More decorative shrubs inside the park for designed shrub borders
  { type: 'shrub', x: -8, z: -8, rotation: 1.1 },
  { type: 'shrub', x: 8, z: -8, rotation: 0.4 },
  { type: 'shrub', x: -10, z: 10, rotation: 2.5 },
  { type: 'shrub', x: 10, z: 10, rotation: 1.8 },
  { type: 'bigger_shrub', x: -3, z: -15, rotation: 1.5, scale: 1.2 },
  { type: 'bigger_shrub', x: 3, z: -15, rotation: 3.1, scale: 1.1 },

  // Designed shrubs close to the poles of the stadium lights (not in the monument!)
  { type: 'bigger_shrub', x: -18.2, z: -18.2, rotation: 0.0, scale: 1.35 },
  { type: 'bigger_shrub', x: 18.2, z: -18.2, rotation: 1.5, scale: 1.25 },
  { type: 'bigger_shrub', x: -18.2, z: 18.2, rotation: 2.5, scale: 1.4 },
  { type: 'bigger_shrub', x: 18.2, z: 18.2, rotation: 3.5, scale: 1.3 },

];

// Beautiful architectural townhouse colors
const TOWNHOUSE_COLORS = [
  0xa13d2d, // Classic Red Brick
  0x2c3e50, // Georgian Slate Grey
  0xe5e0d8, // Parisian Warm Cream
  0x607d62, // Colonial Sage Green
  0x1a365d, // Baltic Deep Blue
  0xd4a373, // Victorian Ochre Yellow
  0x4a3728, // Deep Roast Walnut Brown
  0xe65c00, // Original Warm Terracotta
];

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Core configuration states
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');
  const [weather, setWeather] = useState<'sunny' | 'rainy' | 'cloudy'>('sunny');
  const [cameraMode, setCameraMode] = useState<'orbit' | 'walk' | 'sit'>('orbit');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [soundVolume, setSoundVolume] = useState(85);
  const [musicVolume, setMusicVolume] = useState(60);
  const [soundVisible, setSoundVisible] = useState(true);
  const [sitIdleProgress, setSitIdleProgress] = useState(0);
  const [autoTour, setAutoTour] = useState(false);
  const [isSitting, setIsSitting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showChess, setShowChess] = useState(false);

  // Inspector card
  const [inspectedItem, setInspectedItem] = useState<{
    name: string;
    description: string;
    funFact: string;
    type: string;
  } | null>(null);

  // Book Hunt Collectibles state
  const [collectibleToast, setCollectibleToast] = useState<{
    message: string;
    subMessage: string;
    visible: boolean;
  }>({
    message: '',
    subMessage: '',
    visible: false,
  });
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Three.js and control references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectsGroupRef = useRef<THREE.Group | null>(null);
  const gateMeshRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Environment lighting
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const starFieldRef = useRef<THREE.Points | null>(null);
  const rainParticlesRef = useRef<THREE.Points | null>(null);
  const windSwayTimeRef = useRef<number>(0);

  // Sound Engine
  const audioEngineRef = useRef<AudioEngine | null>(null);

  // Mobile First-Person Touch joystick state
  const touchControlsRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  // First-person state tracking
  const fpStateRef = useRef({
    yaw: -Math.PI / 4,
    pitch: -0.1,
    moveSpeed: 5.5,
    playerPos: new THREE.Vector3(0, 1.65, 17.5), // Starts right inside the entrance path
    bobTimer: 0,
    lastFrameTime: 0,
    keysPressed: {} as Record<string, boolean>,
    isPointerLocked: false,
    initialSittingYaw: 0,
  });

  // Auto-tour animation references
  const tourStateRef = useRef({
    angle: 0,
    spotIdx: 0,
    spotTimer: 0
  });

  // Load Sound Engine & Automatic first interaction handler
  useEffect(() => {
    const ae = new AudioEngine();
    audioEngineRef.current = ae;

    const handleFirstInteraction = () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.start().then(() => setAudioEnabled(true));
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      ae.stop();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Sync volume state
  useEffect(() => {
    if (audioEngineRef.current) {
      if (audioEnabled) {
        audioEngineRef.current.setMute(false);
        audioEngineRef.current.setSoundVolume(soundVolume / 100);
        audioEngineRef.current.setMusicVolume(musicVolume / 100);
        audioEngineRef.current.updateEnvironment(timeOfDay, weather === 'cloudy' ? 'sunny' : weather);
      } else {
        audioEngineRef.current.setMute(true);
      }
    }
  }, [audioEnabled, soundVolume, musicVolume, timeOfDay, weather]);

  // Setup Three.js Core Context
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x87ceeb); // Day blue sky

    // CAMERA
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(-18, 14, 28);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Clear previous children and mount
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // ORBIT CONTROLS (Standard interaction tool)
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05; // Lock camera from going below grass level
    controls.minDistance = 4;
    controls.maxDistance = 60;
    controls.target.set(0, 1.2, 0);

    // GROUPS
    const objectsGroup = new THREE.Group();
    objectsGroupRef.current = objectsGroup;
    scene.add(objectsGroup);

    // -------------------------------------------------------------
    // PROCEDURAL ENVIRONMENTAL LIGHTS
    // -------------------------------------------------------------
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    hemiLightRef.current = hemiLight;
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 150;
    const d = 32;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    dirLight.position.set(25, 45, 15);
    dirLightRef.current = dirLight;
    scene.add(dirLight);

    // Streetlights spotlight instances list
    const streetLights: THREE.SpotLight[] = [];

    // -------------------------------------------------------------
    // ENVIRONMENTAL GROUNDS
    // -------------------------------------------------------------
    // 1. Core Park Lawn (44m x 44m)
    const grassGeo = new THREE.PlaneGeometry(44, 44, 2, 2);
    const grassTex = createGrassTexture();
    const grassMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      roughness: 0.9,
      metalness: 0.05,
    });
    const lawn = new THREE.Mesh(grassGeo, grassMat);
    lawn.rotation.x = -Math.PI / 2;
    lawn.receiveShadow = true;
    lawn.name = "Park Lawn";
    scene.add(lawn);

    // 2. Seamless Green Grass Extensions (Fills outer boundaries so commercial buildings sit firmly on solid land, not floating in air!)
    const northGrass = new THREE.Mesh(new THREE.PlaneGeometry(76, 24), grassMat);
    northGrass.rotation.x = -Math.PI / 2;
    northGrass.position.set(0, 0.002, -32.0);
    northGrass.receiveShadow = true;
    scene.add(northGrass);

    const westGrass = new THREE.Mesh(new THREE.PlaneGeometry(16, 76), grassMat);
    westGrass.rotation.x = -Math.PI / 2;
    westGrass.position.set(-30.0, 0.002, -3.0);
    westGrass.receiveShadow = true;
    scene.add(westGrass);

    // East Grass Extension behind the right side shops
    const eastGrass = new THREE.Mesh(new THREE.PlaneGeometry(16, 76), grassMat);
    eastGrass.rotation.x = -Math.PI / 2;
    eastGrass.position.set(30.0, 0.002, -3.0);
    eastGrass.receiveShadow = true;
    scene.add(eastGrass);

    // 3. Physical Elevated Concrete Curb (Separating park from remaining South & East roads)
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae, roughness: 0.7 });
    
    // South Curb along South road
    const southCurb = new THREE.Mesh(new THREE.BoxGeometry(44.2, 0.16, 0.15), curbMat);
    southCurb.position.set(0, 0.08, 22);
    southCurb.castShadow = true;
    southCurb.receiveShadow = true;
    scene.add(southCurb);

    // East Curb along East road
    const eastCurb = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.16, 44.2), curbMat);
    eastCurb.position.set(22, 0.08, 0);
    eastCurb.castShadow = true;
    eastCurb.receiveShadow = true;
    scene.add(eastCurb);

    // 4. Little Shrub boundaries around three sides of the park lawn (North, West, East)
    const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.9 });
    
    const hedgeN = new THREE.Mesh(new THREE.BoxGeometry(43.6, 0.45, 0.3), hedgeMat);
    hedgeN.position.set(0, 0.225, -21.65);
    hedgeN.castShadow = true;
    hedgeN.receiveShadow = true;
    scene.add(hedgeN);

    const hedgeW = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.45, 43.6), hedgeMat);
    hedgeW.position.set(-21.65, 0.225, 0);
    hedgeW.castShadow = true;
    hedgeW.receiveShadow = true;
    scene.add(hedgeW);

    const hedgeE = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.45, 43.6), hedgeMat);
    hedgeE.position.set(21.65, 0.225, 0);
    hedgeE.castShadow = true;
    hedgeE.receiveShadow = true;
    scene.add(hedgeE);

    // -------------------------------------------------------------
    // CONCRETE FOOTPATHS / SIDEWALKS (After the park border)
    // -------------------------------------------------------------
    const sidewalkMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc, // Clean concrete gray
      roughness: 0.65,
      metalness: 0.1,
    });

    // BIG FOOTPATH (Between park gate at Z=21.8 and Main Road at Z=27.5)
    // With a gap in the center for the main gate connection!
    const bigFootpathLeft = new THREE.Mesh(new THREE.PlaneGeometry(26, 5.7), sidewalkMat);
    bigFootpathLeft.rotation.x = -Math.PI / 2;
    bigFootpathLeft.position.set(-15.0, 0.008, 24.65);
    bigFootpathLeft.receiveShadow = true;
    scene.add(bigFootpathLeft);

    const bigFootpathRight = new THREE.Mesh(new THREE.PlaneGeometry(26, 5.7), sidewalkMat);
    bigFootpathRight.rotation.x = -Math.PI / 2;
    bigFootpathRight.position.set(15.0, 0.008, 24.65);
    bigFootpathRight.receiveShadow = true;
    scene.add(bigFootpathRight);

    // Three outer footpaths around the park where there are no roads (North, West, East)
    const northOuterFootpath = new THREE.Mesh(new THREE.PlaneGeometry(43.6, 1.5), sidewalkMat);
    northOuterFootpath.rotation.x = -Math.PI / 2;
    northOuterFootpath.position.set(0, 0.008, -22.55);
    northOuterFootpath.receiveShadow = true;
    scene.add(northOuterFootpath);

    const westOuterFootpath = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 43.6), sidewalkMat);
    westOuterFootpath.rotation.x = -Math.PI / 2;
    westOuterFootpath.position.set(-22.55, 0.008, 0);
    westOuterFootpath.receiveShadow = true;
    scene.add(westOuterFootpath);

    const eastOuterFootpath = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 43.6), sidewalkMat);
    eastOuterFootpath.rotation.x = -Math.PI / 2;
    eastOuterFootpath.position.set(22.55, 0.008, 0);
    eastOuterFootpath.receiveShadow = true;
    scene.add(eastOuterFootpath);

    // 5. Pathway System
    const stoneTex = createFootpathTexture();
    const pathMat = new THREE.MeshStandardMaterial({
      map: stoneTex,
      roughness: 0.8,
      metalness: 0.1,
    });

    // Circular plaza at center
    const centralPlazaGeo = new THREE.CylinderGeometry(7.5, 7.5, 0.06, 32);
    const centralPlaza = new THREE.Mesh(centralPlazaGeo, pathMat);
    centralPlaza.position.y = 0.01;
    centralPlaza.receiveShadow = true;
    centralPlaza.name = "Central Plaza";
    scene.add(centralPlaza);

    // Diagonal paths connecting central plaza to 4 corners
    const pathW = 2.0;
    const diagL = 26;
    const diagPathGeo = new THREE.PlaneGeometry(pathW, diagL);
    
    const corners = [
      { r: Math.PI / 4, x: -11.5, z: -11.5 },
      { r: -Math.PI / 4, x: 11.5, z: -11.5 },
      { r: (3 * Math.PI) / 4, x: -11.5, z: 11.5 },
      { r: -(3 * Math.PI) / 4, x: 11.5, z: 11.5 },
    ];

    corners.forEach((c) => {
      const p = new THREE.Mesh(diagPathGeo, pathMat);
      p.rotation.x = -Math.PI / 2;
      p.rotation.z = c.r;
      p.position.set(c.x, 0.015, c.z);
      p.receiveShadow = true;
      scene.add(p);
    });

    // Main entrance path from Gate to Center plaza
    const entrancePathGeo = new THREE.PlaneGeometry(pathW * 1.5, 14.5);
    const entrancePath = new THREE.Mesh(entrancePathGeo, pathMat);
    entrancePath.rotation.x = -Math.PI / 2;
    entrancePath.position.set(0, 0.015, 14.75);
    entrancePath.receiveShadow = true;
    entrancePath.name = "Grand Entrance Walkway";
    scene.add(entrancePath);

    // -------------------------------------------------------------
    // DETAILED HIGH-FIDELITY ROADS (South and East sides ONLY)
    // -------------------------------------------------------------
    const asphaltTex = createAsphaltTexture();
    const roadMat = new THREE.MeshStandardMaterial({
      map: asphaltTex,
      roughness: 0.8,
      metalness: 0.25,
    });

    const roadW = 6.0;

    // Road construction helper (creates crisp yellow divider line and white margins)
    const buildRoadWithLines = (w: number, l: number, posX: number, posZ: number, rotateY = 0) => {
      const roadGroup = new THREE.Group();
      roadGroup.position.set(posX, 0.005, posZ);
      roadGroup.rotation.y = rotateY;

      // Asphalt
      const asphaltMesh = new THREE.Mesh(new THREE.PlaneGeometry(w, l), roadMat);
      asphaltMesh.rotation.x = -Math.PI / 2;
      asphaltMesh.receiveShadow = true;
      roadGroup.add(asphaltMesh);

      // Very small and subtle side lines for the main road as requested
      const whiteMat = new THREE.MeshBasicMaterial({ color: 0xbbbbbb });
      const sideLineLGeo = new THREE.PlaneGeometry(0.02, l);
      
      const leftLine = new THREE.Mesh(sideLineLGeo, whiteMat);
      leftLine.rotation.x = -Math.PI / 2;
      leftLine.position.set(-w / 2 + 0.15, 0.006, 0);
      roadGroup.add(leftLine);

      const rightLine = leftLine.clone();
      rightLine.position.x = w / 2 - 0.15;
      roadGroup.add(rightLine);

      // Center white line design on the main road
      const centerLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const centerLineGeo = new THREE.PlaneGeometry(0.06, l);
      const centerLine = new THREE.Mesh(centerLineGeo, centerLineMat);
      centerLine.rotation.x = -Math.PI / 2;
      centerLine.position.set(0, 0.007, 0);
      roadGroup.add(centerLine);

      scene.add(roadGroup);
    };

    // South Road Setup (Single High-Quality Road running East-West)
    const southRoadW = 5.2;
    
    // Carriageway - Configured with 90 deg rotation so it runs East-West correctly
    buildRoadWithLines(southRoadW, 56, 0, 27.5 + southRoadW / 2, Math.PI / 2);

    // Connecting Entrance Road segment through the footpath gap straight to the main gate!
    // Fulfilling: "put the white lines of road and those big lines of road is on park gate road not in main road make them small."
    const entranceRoadSegment = new THREE.Group();
    entranceRoadSegment.position.set(0, 0, 24.65);

    const asphaltSegment = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 5.7), roadMat);
    asphaltSegment.rotation.x = -Math.PI / 2;
    asphaltSegment.receiveShadow = true;
    entranceRoadSegment.add(asphaltSegment);

    // White solid side lines on the park gate road!
    const gateWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const gateSideLineGeo = new THREE.PlaneGeometry(0.06, 5.7);
    
    const gateLeftLine = new THREE.Mesh(gateSideLineGeo, gateWhiteMat);
    gateLeftLine.rotation.x = -Math.PI / 2;
    gateLeftLine.position.set(-1.9, 0.008, 0);
    entranceRoadSegment.add(gateLeftLine);

    const gateRightLine = gateLeftLine.clone();
    gateRightLine.position.x = 1.9;
    entranceRoadSegment.add(gateRightLine);

    // Put those big crossing lines (crosswalk stripes) on the park gate road (gate road) instead of the main road, and make them small!
    const crosswalkGroup = new THREE.Group();
    crosswalkGroup.position.set(0, 0.009, 0); 
    const stripeGeo = new THREE.PlaneGeometry(3.2, 0.22); // smaller stripes going across the gate road
    const whiteZebraMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = -2; i <= 2; i++) {
      const stripe = new THREE.Mesh(stripeGeo, whiteZebraMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.z = i * 0.9;
      crosswalkGroup.add(stripe);
    }
    entranceRoadSegment.add(crosswalkGroup);

    scene.add(entranceRoadSegment);

    // Decorative Hedges (On boundary lines - Restored beautiful side hedges of the park!)
    const southHedgeMat = new THREE.MeshStandardMaterial({ color: 0x1e3f11, roughness: 0.9 });

    // South hedge (split into two for main entrance gate, perfectly connecting to the gate pillars at X = +/-2.1 and park edges at X = +/-21.8)
    const southHedgeGeo = new THREE.BoxGeometry(19.7, 0.9, 0.4);
    const hedgeS1 = new THREE.Mesh(southHedgeGeo, southHedgeMat);
    hedgeS1.position.set(-11.95, 0.45, 21.8);
    hedgeS1.castShadow = true;
    scene.add(hedgeS1);

    const hedgeS2 = new THREE.Mesh(southHedgeGeo, southHedgeMat);
    hedgeS2.position.set(11.95, 0.45, 21.8);
    hedgeS2.castShadow = true;
    scene.add(hedgeS2);

    // -------------------------------------------------------------
    const isNightOrSunset = (timeOfDay === 'night' || timeOfDay === 'sunset');

    // -------------------------------------------------------------
    // MONUMENTAL "GRAND PARK" STONE SIGN STATUE
    // Positioned cleanly on the footpath walkway (not inside the park!) as requested
    // -------------------------------------------------------------
    const grandParkStatue = createGrandParkStatue();
    grandParkStatue.position.set(-5.5, 0, 21.5); // On footpath, Z = 21.5
    grandParkStatue.rotation.y = 0; // Facing south towards road
    objectsGroup.add(grandParkStatue);

    // -------------------------------------------------------------
    // POPULATE STATIC SCENIC FLORA & DETAILS
    // -------------------------------------------------------------
    STATIC_ELEMENTS.forEach((item, index) => {
      let element: THREE.Group | null = null;
      switch (item.type) {
        case 'oak_tree':
          element = createOakTree();
          break;
        case 'pine_tree':
          element = createPineTree();
          break;
        case 'bench':
          element = createBench();
          break;
        case 'lamppost':
          element = createLamppost(isNightOrSunset);
          break;
        case 'trash_bin':
          element = createTrashBin();
          break;
        case 'kiosk':
          element = createInformationKiosk();
          break;
        case 'shrub':
          element = createShrub();
          break;
        case 'bigger_shrub':
          element = createBiggerShrub();
          break;
        case 'stadium_light':
          element = createStadiumLightTower(isNightOrSunset);
          break;
        case 'road_light':
          element = createRoadLight(isNightOrSunset);
          break;
        case 'standing_observation':
          element = createStandingObservationPlace();
          break;
        case 'clock_tower':
          element = createClockTower();
          break;
        case 'bus_stop':
          element = createBusStopShelter();
          break;
      }

      if (element) {
        element.position.set(item.x, 0, item.z);
        element.rotation.y = item.rotation;
        if ((item as any).scale) {
          element.scale.setScalar((item as any).scale);
        }
        element.name = `${item.type.replace('_', ' ')} #${index}`;
        objectsGroup.add(element);

        // Path spotlights for Midnight & Sunset mood (Active lamp bulbs)
        if (item.type === 'lamppost') {
          const sLight = new THREE.SpotLight(0xfff3e0, 2.5, 12, Math.PI / 4, 0.6, 1.0);
          sLight.position.set(item.x, 3.4, item.z);
          sLight.target.position.set(item.x, 0, item.z);
          sLight.castShadow = false;
          sLight.visible = isNightOrSunset;
          scene.add(sLight);
          scene.add(sLight.target);
          streetLights.push(sLight);
        }

        if (item.type === 'road_light') {
          // Double street light fixtures (facing opposite sides of the boulevard)
          const sLight1 = new THREE.SpotLight(0xfff3d0, 6.0, 16, Math.PI / 4, 0.5, 1.0);
          sLight1.position.set(item.x - 0.75, 4.9, item.z);
          sLight1.target.position.set(item.x - 0.75, 0.1, item.z);
          sLight1.castShadow = false;
          sLight1.visible = isNightOrSunset;
          scene.add(sLight1);
          scene.add(sLight1.target);
          streetLights.push(sLight1);

          const sLight2 = new THREE.SpotLight(0xfff3d0, 6.0, 16, Math.PI / 4, 0.5, 1.0);
          sLight2.position.set(item.x + 0.75, 4.9, item.z);
          sLight2.target.position.set(item.x + 0.75, 0.1, item.z);
          sLight2.castShadow = false;
          sLight2.visible = isNightOrSunset;
          scene.add(sLight2);
          scene.add(sLight2.target);
          streetLights.push(sLight2);
        }
      }
    });

    // -------------------------------------------------------------
    // INSTANTIATE SEVEN CUSTOM SPACIOUS BUILDINGS & UTILITIES (Left, Back, Right)
    // -------------------------------------------------------------
    // Left Side (Moved to x = -28.0 to ensure a beautiful wide walkway buffer from the park fence):
    // 1. Cafe Building with outdoor tables, indoor chairs & cozy ambient nameplate
    const cafeBuilding = createCafeBuilding(isNightOrSunset);
    cafeBuilding.position.set(-28.0, 0, 11.5);
    cafeBuilding.rotation.y = Math.PI / 2; // Facing East into the park
    cafeBuilding.name = "The Greenery Cafe";
    objectsGroup.add(cafeBuilding);

    // 2. Library Building with bookshelves, desks, reading sofas & books (Spaced far from cafe at z = -17.5)
    const libraryBuilding = createLibraryBuilding(isNightOrSunset);
    libraryBuilding.position.set(-28.0, 0, -17.5);
    libraryBuilding.rotation.y = Math.PI / 2; // Facing East into the park
    libraryBuilding.name = "Central Park Library";
    objectsGroup.add(libraryBuilding);

    // Back Side (Glowingly spaced on expanded land):
    // 3. Yoga & Gym Building with yoga mats, fitness benches, dumbbells, machines
    const yogaGymBuilding = createYogaGymBuilding(isNightOrSunset);
    yogaGymBuilding.position.set(-13.0, 0, -28.5);
    yogaGymBuilding.rotation.y = 0; // Facing South into the park
    yogaGymBuilding.name = "Serene Gym & Yoga Studio";
    objectsGroup.add(yogaGymBuilding);

    // 4. Chess Arena with tournament chess tables, chairs & board games
    const chessArena = createChessArena(isNightOrSunset);
    chessArena.position.set(0.0, 0, -28.5);
    chessArena.rotation.y = 0; // Facing South into the park
    chessArena.name = "Grandmaster Chess Arena";
    objectsGroup.add(chessArena);

    // 5. Cricket Net Practice Ground (Moved to Back Side "after Chess Arena", facing South into the park!)
    // 5. Redesigned White Restaurant (The Royal Pavilion Bistro) - placed on the back row
    const foodCenter = createFoodCenter(isNightOrSunset);
    foodCenter.position.set(13.0, 0, -28.5);
    foodCenter.rotation.y = 0; // Facing South into the park
    foodCenter.name = "The Royal Pavilion Bistro";
    objectsGroup.add(foodCenter);

    // Right Side (Glowingly spaced on expanded land):
    // 6. Cricket Net Practice Ground (Moved to replace the old food court at the right side)
    const cricketPractice = createCricketNetPractice(isNightOrSunset);
    cricketPractice.position.set(28.5, 0, -8.0); 
    cricketPractice.rotation.y = -Math.PI / 2; // Facing West into the park
    cricketPractice.name = "Net Practice Cricket";
    objectsGroup.add(cricketPractice);

    // 7. Long Supermarket Building along the West-facing right side
    const supermarketBuilding = createSupermarketBuilding(isNightOrSunset);
    supermarketBuilding.position.set(28.5, 0, 9.5); // Spaced beautifully from the food center
    supermarketBuilding.rotation.y = -Math.PI / 2; // Facing West into the park
    supermarketBuilding.name = "Grand Supermarket";
    objectsGroup.add(supermarketBuilding);

    // -------------------------------------------------------------
    // METROPOLITAN STANDING BUSES (Standing on the main road)
    // -------------------------------------------------------------
    const staticBus1 = createStandingBus();
    staticBus1.position.set(-12.0, 0, 26.5);
    staticBus1.rotation.y = Math.PI / 2; // Eastbound standing bus
    staticBus1.name = "Standing Bus #1";
    scene.add(staticBus1);

    const staticBus2 = createStandingBus();
    staticBus2.position.set(12.0, 0, 29.5);
    staticBus2.rotation.y = -Math.PI / 2; // Westbound standing bus
    staticBus2.name = "Standing Bus #2";
    scene.add(staticBus2);

    // -------------------------------------------------------------
    // SHINING YELLOW GLOW ARROW WARNING SIGNS
    // -------------------------------------------------------------
    const arrowBoard1 = createYellowArrowBoard();
    arrowBoard1.position.set(-10, 0, 24.5);
    arrowBoard1.rotation.y = 0; // Facing south towards road
    arrowBoard1.name = "Yellow Arrow Board Left";
    scene.add(arrowBoard1);

    const arrowBoard2 = createYellowArrowBoard();
    arrowBoard2.position.set(10, 0, 24.5);
    arrowBoard2.rotation.y = 0; // Facing south towards road
    arrowBoard2.name = "Yellow Arrow Board Right";
    scene.add(arrowBoard2);

    // -------------------------------------------------------------
    // GRAND "BIG G" MONUMENT (Centerpiece)
    // -------------------------------------------------------------
    const monument = createBigGMonument();
    monument.position.set(0, 0, 0);
    monument.name = "Central Big G Monument";
    objectsGroup.add(monument);

    // -------------------------------------------------------------
    // ENTRANCE GATE (Open / Unlocked by default)
    // -------------------------------------------------------------
    const gate = createParkEntranceGate(false); // isLocked = false!
    gate.position.set(0, 0, 21.8);
    gate.name = "Park Entrance Gate";
    gateMeshRef.current = gate;
    scene.add(gate);

    // Traffic Signal poles along the South and East main roads
    const createTrafficSignal = (x: number, z: number, rotation: number) => {
      const pole = new THREE.Group();
      pole.position.set(x, 0, z);
      pole.rotation.y = rotation;

      const metalMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.5 });
      const greenGlow = new THREE.MeshBasicMaterial({ color: 0x2ec4b6 });
      const redGlow = new THREE.MeshBasicMaterial({ color: 0xe71d36 });

      const vertPole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 4.5, 8), metalMat);
      vertPole.position.y = 2.25;
      vertPole.castShadow = true;
      pole.add(vertPole);

      const horPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.0, 8), metalMat);
      horPole.position.set(0, 4.3, 0.9);
      horPole.rotation.x = Math.PI / 2;
      horPole.castShadow = true;
      pole.add(horPole);

      const signalBox = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.8, 0.35), metalMat);
      signalBox.position.set(0, 4.3, 1.8);
      pole.add(signalBox);

      const bulbGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const redLight = new THREE.Mesh(bulbGeo, redGlow);
      redLight.position.set(0, 4.5, 1.98);
      pole.add(redLight);

      const greenLight = new THREE.Mesh(bulbGeo, greenGlow);
      greenLight.position.set(0, 4.1, 1.98);
      pole.add(greenLight);

      scene.add(pole);
    };

    // Four corners of the main road perimeter (traffic light behind clock tower at x:24, z:-24 removed as requested)
    createTrafficSignal(-24, 24, 0);
    createTrafficSignal(24, 24, -Math.PI / 2);

    // Instantiating specific road equipments
    // 1. Fire Hydrants removed as requested ("remove that red thing of road")

    // 2. Speed Limit Signs removed as requested ("remove old white signboards")

    // 3. Arrow signboards removed as requested by the user

    // 4. Modern Bus Stop Passenger Shelter removed as requested ("fix the outer bus stand it coming inside park but we dont need it")

    // 5. White metallic Bicycle parking racks at park entrance plaza
    const bikeStand1 = createBicycleStand();
    bikeStand1.position.set(-3, 0, 19.5);
    scene.add(bikeStand1);

    const bikeStand2 = createBicycleStand();
    bikeStand2.position.set(3, 0, 19.5);
    scene.add(bikeStand2);

    // -------------------------------------------------------------
    // CLOUDY ENVIRONMENT: DRIVING PUFFY SKY CLOUDS
    // -------------------------------------------------------------
    const createLowPolyCloud = (): THREE.Group => {
      const cloudGroup = new THREE.Group();
      cloudGroup.name = 'Cloud';

      const cloudMat = new THREE.MeshStandardMaterial({
        color: 0xfafafa,
        roughness: 0.9,
        metalness: 0.05,
        flatShading: true
      });

      const spheres = [
        { r: 1.5, x: 0, y: 0, z: 0 },
        { r: 1.1, x: -1.3, y: -0.2, z: 0.3 },
        { r: 1.0, x: 1.3, y: -0.3, z: -0.2 },
        { r: 0.9, x: -0.7, y: 0.6, z: -0.6 },
        { r: 0.9, x: 0.7, y: 0.7, z: 0.5 },
        { r: 0.8, x: 0, y: -0.5, z: 0.9 },
        { r: 0.8, x: -1.9, y: -0.4, z: -0.3 },
        { r: 0.8, x: 1.9, y: -0.4, z: 0.3 },
      ];

      spheres.forEach(s => {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(s.r, 8, 8), cloudMat);
        mesh.position.set(s.x, s.y, s.z);
        cloudGroup.add(mesh);
      });

      return cloudGroup;
    };

    const cloudsGroup = new THREE.Group();
    const cloudsList: { mesh: THREE.Group; speed: number }[] = [];
    for (let i = 0; i < 8; i++) {
      const cloud = createLowPolyCloud();
      const cx = (Math.random() - 0.5) * 60;
      const cz = (Math.random() - 0.5) * 50;
      const cy = 20 + Math.random() * 5;
      cloud.position.set(cx, cy, cz);
      const scale = 0.8 + Math.random() * 0.7;
      cloud.scale.set(scale, scale * 0.7, scale);
      cloudsGroup.add(cloud);
      cloudsList.push({
        mesh: cloud,
        speed: 0.6 + Math.random() * 0.8
      });
    }
    scene.add(cloudsGroup);

    // -------------------------------------------------------------
    // PRECIPITATION SYSTEM: SUMMERY RAIN SHOWERS
    // -------------------------------------------------------------
    const rainCount = 1800;
    const rainGeo = new THREE.BufferGeometry();
    const rainPos = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount * 3; i += 3) {
      rainPos[i] = (Math.random() - 0.5) * 60;
      rainPos[i + 1] = Math.random() * 30;
      rainPos[i + 2] = (Math.random() - 0.5) * 60;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0x81d4fa,
      size: 0.15,
      transparent: true,
      opacity: 0.0
    });
    const rainParticles = new THREE.Points(rainGeo, rainMat);
    rainParticlesRef.current = rainParticles;
    scene.add(rainParticles);

    // Twilight/Midnight stars field
    const starsCount = 600;
    const starsGeo = new THREE.BufferGeometry();
    const starsPos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = 120 + Math.random() * 40;
      starsPos[i] = dist * Math.sin(phi) * Math.cos(theta);
      starsPos[i + 1] = Math.abs(dist * Math.cos(phi)) + 10;
      starsPos[i + 2] = dist * Math.sin(phi) * Math.sin(theta);
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.45,
      transparent: true,
      opacity: 0.0,
    });
    const starField = new THREE.Points(starsGeo, starMat);
    starFieldRef.current = starField;
    scene.add(starField);

    // -------------------------------------------------------------
    // INTERACTION RAYCASTING (INSPECT DETAILS)
    // -------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const handleCanvasClick = (e: MouseEvent) => {
      // If in sitting mode, clicking anywhere hides the insights details card and sound controls!
      if (cameraMode === 'sit') {
        setInspectedItem(null);
        setSoundVisible(false);
        return;
      }

      // Trigger pointer lock in Walk Mode or Sit Mode
      if (cameraMode === 'walk' || cameraMode === 'sit') {
        renderer.domElement.requestPointerLock();
      }

      // Allow clicking on benches/houses in both orbit and walk modes for dynamic interaction!
      const rect = renderer.domElement.getBoundingClientRect();
      mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoord.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseCoord, camera);

      const intersects = raycaster.intersectObjects(objectsGroup.children, true);
      if (intersects.length > 0) {
        // 1. Check if we clicked on a bench/seat/chair/sofa to SIT (takes priority!)
        let benchObj: THREE.Object3D | null = intersects[0].object;
        while (
          benchObj && 
          !benchObj.name.toLowerCase().includes('bench') && 
          !benchObj.name.toLowerCase().includes('seat') && 
          !benchObj.name.toLowerCase().includes('chair') && 
          !benchObj.name.toLowerCase().includes('sofa')
        ) {
          benchObj = benchObj.parent;
          if (benchObj === objectsGroup || benchObj === scene || !benchObj) {
            benchObj = null;
            break;
          }
        }

        if (benchObj) {
          const worldPos = new THREE.Vector3();
          benchObj.getWorldPosition(worldPos);

          const worldQuat = new THREE.Quaternion();
          benchObj.getWorldQuaternion(worldQuat);
          const worldEuler = new THREE.Euler().setFromQuaternion(worldQuat, 'YXZ');
          const benchYaw = worldEuler.y;

          // Set player position sitting on the bench (head height slightly elevated to prevent seeing seat)
          const sitHeight = 1.25;
          
          // Push camera slightly forward along the vector to the center of the park (0,0,0) so the seat mesh is completely behind/below and not visible
          const toCenter = new THREE.Vector3(0 - worldPos.x, 0, 0 - worldPos.z).normalize().multiplyScalar(0.48);
          fpStateRef.current.playerPos.set(worldPos.x + toCenter.x, sitHeight, worldPos.z + toCenter.z);
          
          // Rotate sitting camera 180 degrees from back direction to show the beautiful front park view!
          const targetYaw = Math.atan2(0 - worldPos.x, 0 - worldPos.z) + Math.PI;
          fpStateRef.current.yaw = targetYaw;
          fpStateRef.current.initialSittingYaw = targetYaw; // Save initial sitting yaw!
          fpStateRef.current.pitch = -0.05;

          setCameraMode('sit'); // 3rd view sitting view mode!
          setIsSitting(true);
          setSoundVisible(true); // make sure sound volume controls are visible initially when sitting down!

          if (audioEngineRef.current && audioEnabled) {
            audioEngineRef.current.triggerSitMusicTone();
          }

          if (benchObj.name.toLowerCase().includes('chess_chair')) {
            // Chess table sitting experience is preserved, but playable chess game is removed as requested
            setInspectedItem({
              name: 'Grandmaster Chess Seat',
              type: 'chess',
              description: 'You sat down at the grandmaster chess table inside the Chess shop. Enjoy the intellectual ambience!',
              funFact: 'Chess was originally created in ancient India as Chaturanga, representing the four wings of an army.'
            });
          } else {
            setInspectedItem({
              name: 'Sitting down',
              type: 'bench',
              description: 'You are now sitting comfortably. Enjoy the relaxing view. Look left or right freely. Press SPACE to stand up.',
              funFact: 'Sitting in nature lowers stress hormones and elevates mood naturally.'
            });
          }
          return;
        }

        // 2. Check for detailed interactive sub-items first (to enable granular clicks in walk mode!)
        let clickedSubObj: THREE.Object3D | null = intersects[0].object;
        let interactiveName = '';
        while (clickedSubObj && clickedSubObj !== objectsGroupRef.current && clickedSubObj !== scene) {
          const subName = clickedSubObj.name;
          if (subName && (
            subName.includes('collectible') ||
            subName.includes('bookshelf') ||
            subName.includes('carousel') ||
            subName.includes('treadmill') ||
            subName.includes('espresso_machine') ||
            subName.includes('menu_board') ||
            subName.includes('cake_cabinet') ||
            subName.includes('supermarket') ||
            subName.includes('register') ||
            subName.includes('basket') ||
            subName.includes('wicket') ||
            subName.includes('stump') ||
            subName.includes('flower_pot') ||
            subName.includes('souvenir')
          )) {
            interactiveName = subName;
            break;
          }
          clickedSubObj = clickedSubObj.parent;
        }

        if (interactiveName) {
          const nameLower = interactiveName.toLowerCase();
          
          if (nameLower.includes('collectible')) {
            // Extract book title
            let bookTitle = "The Grand Philosophy of Parks";
            const match = interactiveName.match(/"([^"]+)"/);
            if (match && match[1]) {
              bookTitle = match[1];
            }

            // Trigger collectible sound!
            if (audioEngineRef.current && audioEnabled) {
              audioEngineRef.current.triggerCollectibleSound();
            }

            // Show dynamic UI toast message
            if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
            setCollectibleToast({
              message: "📚 Rare Book Collected!",
              subMessage: `You discovered: "${bookTitle}" hidden inside the library bookshelf!`,
              visible: true
            });
            toastTimeoutRef.current = setTimeout(() => {
              setCollectibleToast(prev => ({ ...prev, visible: false }));
            }, 4000);

            setInspectedItem({
              name: `Collectible: "${bookTitle}"`,
              type: 'book',
              description: `A rare legendary tome discovered during the Central Library Book Hunt. You have added this to your personal park journal.`,
              funFact: 'Libraries in medieval times chained books to bookshelves to prevent rare manuscripts from being stolen during hunts!'
            });
            return;
          }

          if (nameLower.includes('treadmill')) {
            if (audioEngineRef.current && audioEnabled) {
              audioEngineRef.current.triggerSitMusicTone(); // play a cute notification tone
            }
            setInspectedItem({
              name: 'Interactive Cardio Treadmill',
              type: 'gym',
              description: 'A modern commercial treadmill with an active LED display. Clicking it simulates a brisk running routine.',
              funFact: 'Running on a treadmill with a green nature view lowers perceived exertion by 15%, letting you run longer with ease!'
            });
            return;
          }

          if (nameLower.includes('espresso_machine')) {
            if (audioEngineRef.current && audioEnabled) {
              audioEngineRef.current.triggerSitMusicTone();
            }
            setInspectedItem({
              name: 'Precision Espresso Machine',
              type: 'cafe',
              description: 'A commercial triple-group Italian espresso machine, ready to brew artisanal single-origin macchiatos.',
              funFact: 'The scent of freshly ground dark coffee stimulates alpha and beta waves in the brain, improving alertness immediately.'
            });
            return;
          }

          if (nameLower.includes('menu_board')) {
            setInspectedItem({
              name: 'Gourmet Cafe Menu Board',
              type: 'cafe',
              description: 'A solid mahogany board listing special park selections: Matcha Latte, Lavender Honey Brew, and Fresh Almond Croissants.',
              funFact: 'Displaying warm colors like light purple and soft yellow on menus has been shown to enhance positive dining vibes!'
            });
            return;
          }

          if (nameLower.includes('cake_cabinet')) {
            setInspectedItem({
              name: 'Glazed Dessert Showcase',
              type: 'cafe',
              description: 'A chilled glass cabinet displaying handcrafted fresh pastries, including a miniature glazed strawberry shortcake.',
              funFact: 'Strawberry shortcake was first popularized in England in the 1580s and was celebrated as a summer holiday delicacy.'
            });
            return;
          }

          if (nameLower.includes('supermarket_shelf_item')) {
            // Extract item name
            let itemName = "Organic Grocery Box";
            const match = interactiveName.match(/"([^"]+)"/);
            if (match && match[1]) {
              itemName = match[1];
            }
            if (audioEngineRef.current && audioEnabled) {
              audioEngineRef.current.triggerSitMusicTone();
            }
            setInspectedItem({
              name: itemName,
              type: 'supermarket',
              description: `A freshly stocked premium product on the aisles of the Grand Cognitive Supermarket, fully itemized with green organic labeling.`,
              funFact: 'Organizing cereal boxes to look slightly downward at an angle of 9.6 degrees dramatically boosts eye contact and engagement with shoppers!'
            });
            return;
          }

          if (nameLower.includes('supermarket_cash_register') || nameLower.includes('souvenir_cash_register')) {
            if (audioEngineRef.current && audioEnabled) {
              audioEngineRef.current.triggerSitMusicTone();
            }
            setInspectedItem({
              name: 'POS Electronic Cash Register',
              type: 'checkout',
              description: 'A modern touchscreen terminal with an integrated laser barcode scanner and thermal receipt printer.',
              funFact: 'The cash register was invented in 1879 by a saloon owner in Ohio to prevent employees from stealing his daily receipts!'
            });
            return;
          }

          if (nameLower.includes('supermarket_shopping_basket')) {
            setInspectedItem({
              name: 'Light Purple Shopping Basket',
              type: 'basket',
              description: 'A light, impact-resistant basket custom-molded with a comfortable handle, colored in a chic light purple hue.',
              funFact: 'Taking a basket instead of a rolling cart reduces impulse buying by up to 34% because your arms feel the physical weight!'
            });
            return;
          }

          if (nameLower.includes('wicket') || nameLower.includes('stump')) {
            setInspectedItem({
              name: 'Wooden Practice Wicket',
              type: 'cricket',
              description: 'A professional set of three ash-wood stumps topped with wooden bails, set inside the cricket practice nets.',
              funFact: 'Wickets are exactly 28 inches tall and 9 inches wide. Pitching accuracy is tracked using high-speed camera sensors.'
            });
            return;
          }

          if (nameLower.includes('flower_pot')) {
            setInspectedItem({
              name: 'Blossom Clay Flower Pot',
              type: 'florist',
              description: 'A handcrafted red clay pot nurturing healthy blooming spring flowers.',
              funFact: 'Potting and touching live soil contains microscopic organic organisms that stimulate serotonin release in humans!'
            });
            return;
          }

          if (nameLower.includes('bookshelf') || nameLower.includes('carousel')) {
            // Give a general bookshelf click hint
            setInspectedItem({
              name: 'Rotating Library Bookshelf',
              type: 'library',
              description: 'A grand solid-oak rotating shelf stocked with classic literature, scientific journals, and hidden rare books.',
              funFact: 'You can search bookshelves for hidden collectible books! Look closely for the Book Hunt collectibles.'
            });
            return;
          }
        }

        // 3. Fallback to general building/utility inspector card
        let rootObj: THREE.Object3D | null = intersects[0].object;
        while (rootObj && rootObj.parent !== objectsGroupRef.current && rootObj.parent !== scene) {
          rootObj = rootObj.parent;
        }

        if (rootObj) {
          const name = rootObj.name.toLowerCase();
          if (name.includes('fountain')) {
            setInspectedItem({
              name: 'Royal Cascade Fountain',
              type: 'fountain',
              description: 'A stately white marble multi-tier cascading fountain. Shoots dynamic, pressurized water geysers and cascading water sheets in three tiers.',
              funFact: 'Sustains a micro-climate that cools the immediate central plaza by 4°C through natural adiabatic evaporation.',
            });
          } else if (name.includes('cafe') || name.includes('greenery cafe')) {
            setInspectedItem({
              name: 'The Greenery Cafe',
              type: 'cafe',
              description: 'A double-width open-front coffee shop featuring local single-origin brews, outdoor patio umbrellas, and comfortable tables.',
              funFact: 'Designed with a completely doorless open-gate entryway so park strolls blend into warm coffee breaks seamlessly.'
            });
          } else if (name.includes('library') || name.includes('central park library')) {
            setInspectedItem({
              name: 'Central Park Library',
              type: 'library',
              description: 'A double-large library building equipped with spinning book carousels, grand reading desks, cozy lounges, and a hidden Book Hunt.',
              funFact: 'Houses more than 4,500 historic physical manuscripts, completely accessible to the public with zero fees.'
            });
          } else if (name.includes('gym') || name.includes('yoga') || name.includes('zen yoga')) {
            setInspectedItem({
              name: 'Zen Yoga & Gym Studio',
              type: 'gym',
              description: 'An industrial concrete gym with thick black rubber flooring, custom workout mats, interactive treadmills, and dumbbells.',
              funFact: 'The entryway features an open light-purple-lined gate, inviting visitors for quick deep breathing and stretching sessions.'
            });
          } else if (name.includes('chess') || name.includes('grandmaster chess')) {
            setInspectedItem({
              name: 'Grandmaster Chess Pavilion',
              type: 'chess',
              description: 'A luxurious open-door tournament chess hall with polished black and white marble checkerboard tiles and solid wood chess tables.',
              funFact: 'Features giant decorative chess display boards and interactive miniature pieces crafted from hand-carved soapstone.'
            });
          } else if (name.includes('cricket') || name.includes('net practice')) {
            setInspectedItem({
              name: 'Net Practice Cricket',
              type: 'cricket',
              description: 'An advanced double-lane cricket batting cage laid with professional-grade synthetic turf pitches, stumps, and bats.',
              funFact: 'Fitted with bright overhead stadium floodlights that automatically ignite at sunset for night practice.'
            });
          } else if (name.includes('food') || name.includes('garden food plaza')) {
            setInspectedItem({
              name: 'Garden Food Plaza',
              type: 'food',
              description: 'A rustic brick food plaza hosting multi-cuisine kiosk stalls: La Cantina Tacos, Wok & Roll Asian, and Sweet Retreat Gelato.',
              funFact: 'Features a large central point light and custom light-purple signage to create a festive community dining atmosphere.'
            });
          } else if (name.includes('supermarket') || name.includes('grand cognitive')) {
            setInspectedItem({
              name: 'Grand Cognitive Supermarket',
              type: 'supermarket',
              description: 'A massive modern grocery store featuring rows of itemized food shelves, check-out scanners, shopping baskets, and automated night-time LED lighting.',
              funFact: 'Styled with a wide doorless entrance and spacious interior, making it easy to stroll inside directly from the park!'
            });
          } else if (name.includes('house') || name.includes('row')) {
            setInspectedItem({
              name: 'Colorful Townhouses',
              type: 'homes',
              description: 'Georgian and Victorian-styled residential row houses painted in vibrant brick ochres, colonial greens, and slate tones. Directly connected to the park lawn.',
              funFact: 'These historical landmarks were restored by local craftsmen, completely eliminating separating asphalt roads to prioritize kids playing on pure grass.',
            });
          } else if (name.includes('statue') || name.includes('grand park')) {
            setInspectedItem({
              name: 'Grand Park Sign Monument',
              type: 'statue',
              description: 'A massive slate-grey granite monument sign. Showcases the carved gold-leaf letters spelling "GRAND PARK" proudly welcoming visitors.',
              funFact: 'Engraved with solid 24K gold-leaf inlays, illuminated by energy-saving spotlight bulbs at sunset.',
            });
          } else if (name.includes('oak')) {
            setInspectedItem({
              name: 'Centennial Shade Oak',
              type: 'oak',
              description: 'A majestic native broadleaf oak tree. Positioned carefully off the pathways, offering deep cool shade for benches.',
              funFact: 'Oak leaves filter organic dust particles from surrounding streets, generating pure oxygen for nearly 10 families every day.',
            });
          } else if (name.includes('pine')) {
            setInspectedItem({
              name: 'Scotch Evergreen Pine',
              type: 'pine',
              description: 'A tall conifer pine tree that remains lush green throughout all weather and seasonal changes.',
              funFact: 'Its aromatic resin emits crisp organic terpenes, producing that comforting pine tree forest smell after a fresh rain.',
            });
          } else if (name.includes('bench')) {
            setInspectedItem({
              name: 'Oak Rest Bench',
              type: 'bench',
              description: 'A comfortable bench built from solid varnished mahogany wood and black cast-iron frames.',
              funFact: 'Positioned strategically near the fountain to capture cool negative ion air currents, boosting serenity.',
            });
          } else if (name.includes('kiosk')) {
            setInspectedItem({
              name: 'Park Bulletin Kiosk',
              type: 'kiosk',
              description: 'A detailed wooden noticeboard displaying trail guidelines and flora directory information.',
              funFact: 'Includes a local community seed-sharing drawer inside the base for neighborhood gardening.',
            });
          } else {
            setInspectedItem({
              name: 'Hedge & Shrubs',
              type: 'plant',
              description: 'Native evergreen shrubs carefully planted in deep green turf, completely away from walking pavements.',
              funFact: 'Hedges create safe nesting corridors for native honeybees and rare butterflies.',
            });
          }
        }
      } else {
        setInspectedItem(null);
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // KEYBOARD EVENTS (First Person Walk / Sit)
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      fpStateRef.current.keysPressed[key] = true;
      if (cameraMode === 'sit' && (key === ' ' || key === 'e' || key === 'enter')) {
        standUpFromBench();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      fpStateRef.current.keysPressed[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Mouse looking inside Canvas for Walk & Sit Modes
    const handleMouseMove = (e: MouseEvent) => {
      if (cameraMode !== 'walk' && cameraMode !== 'sit') return;
      if (fpStateRef.current.isPointerLocked) {
        const sens = 0.0025;
        let deltaYaw = e.movementX * sens;

        if (cameraMode === 'sit') {
          // Clamp yaw rotation to a generous 180 degrees on each side so they can look all around
          const potentialYaw = fpStateRef.current.yaw - deltaYaw;
          let diff = potentialYaw - fpStateRef.current.initialSittingYaw;
          // Normalize diff to [-PI, PI]
          diff = Math.atan2(Math.sin(diff), Math.cos(diff));
          // Clamp diff to [-Math.PI / 1.05, Math.PI / 1.05] (approx 170 degrees to each side)
          const clampedDiff = Math.max(-Math.PI / 1.05, Math.min(Math.PI / 1.05, diff));
          fpStateRef.current.yaw = fpStateRef.current.initialSittingYaw + clampedDiff;
        } else {
          fpStateRef.current.yaw -= deltaYaw;
        }

        fpStateRef.current.pitch -= e.movementY * sens;
        fpStateRef.current.pitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, fpStateRef.current.pitch));
      }
    };

    const lockChange = () => {
      fpStateRef.current.isPointerLocked = (document.pointerLockElement === renderer.domElement);
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', lockChange);

    // -------------------------------------------------------------
    // MAIN RENDERING & SIMULATION LOOP
    // -------------------------------------------------------------
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // 1. UPDATE WEATHER AND ENVIRONMENT LIGHTINGS (DISABLED - STATIC DAYTIME ONLY)
      if (false && hemiLightRef.current && dirLightRef.current) {
        let skyColor = 0x87ceeb;
        let hemiColor = 0xffffff;
        let hemiIntensity = 1.35;
        let dirColor = 0xfffdf2;
        let dirIntensity = 1.6;
        let dirPos = new THREE.Vector3(-15, 30, 20);
        let starOpacity = 0.0;
        let fogColor = 0x87ceeb;
        let fogDensity = 0.0;

        // Base time of day values
        if (timeOfDay === 'day') {
          skyColor = 0x87ceeb;
          hemiColor = 0xffffff;
          hemiIntensity = 1.35;
          dirColor = 0xfffdf2;
          dirIntensity = 1.6;
          dirPos.set(-15, 30, 20);
          starOpacity = 0.0;
        } else if (timeOfDay === 'sunset') {
          skyColor = 0xe65100;
          hemiColor = 0xffaa66;
          hemiIntensity = 0.8;
          dirColor = 0xff9e80;
          dirIntensity = 1.1;
          dirPos.set(-30, 15, 5);
          starOpacity = 0.15;
        } else { // night
          skyColor = 0x0a192f;
          hemiColor = 0x556688;
          hemiIntensity = 0.35;
          dirColor = 0x90caf9;
          dirIntensity = 0.45;
          dirPos.set(-20, 45, -20);
          starOpacity = 0.85;
        }

        // Apply weather overrides
        if (weather === 'cloudy') {
          // Darken and desaturate sky for cloudy overcast
          if (timeOfDay === 'day') {
            skyColor = 0x8a9ba8;
            dirIntensity *= 0.25;
            hemiIntensity *= 0.5;
            fogColor = 0x8a9ba8;
            fogDensity = 0.008;
          } else if (timeOfDay === 'sunset') {
            skyColor = 0x5c3d2e;
            dirIntensity *= 0.25;
            hemiIntensity *= 0.5;
            fogColor = 0x5c3d2e;
            fogDensity = 0.01;
          } else { // night
            skyColor = 0x071120;
            dirIntensity *= 0.2;
            hemiIntensity *= 0.4;
            fogColor = 0x071120;
            fogDensity = 0.015;
          }
          starOpacity = 0.0; // clouds block stars
        } else if (weather === 'rainy') {
          // Rain is even darker
          if (timeOfDay === 'day') {
            skyColor = 0x546e7a;
            dirIntensity *= 0.15;
            hemiIntensity *= 0.4;
            fogColor = 0x546e7a;
            fogDensity = 0.018;
          } else if (timeOfDay === 'sunset') {
            skyColor = 0x3e2723;
            dirIntensity *= 0.15;
            hemiIntensity *= 0.4;
            fogColor = 0x3e2723;
            fogDensity = 0.02;
          } else { // night
            skyColor = 0x050b14;
            dirIntensity *= 0.1;
            hemiIntensity *= 0.3;
            fogColor = 0x050b14;
            fogDensity = 0.025;
          }
          starOpacity = 0.0; // clouds/rain block stars
        }

        // Interpolate lighting values smoothly over time (cross-fading effect)
        const lerpFactor = delta * 2.5; // Smooth transition over ~1.5 seconds

        hemiLightRef.current.intensity = THREE.MathUtils.lerp(hemiLightRef.current.intensity, hemiIntensity, lerpFactor);
        hemiLightRef.current.color.lerp(new THREE.Color(hemiColor), lerpFactor);
        
        dirLightRef.current.intensity = THREE.MathUtils.lerp(dirLightRef.current.intensity, dirIntensity, lerpFactor);
        dirLightRef.current.color.lerp(new THREE.Color(dirColor), lerpFactor);
        dirLightRef.current.position.lerp(dirPos, lerpFactor);
        
        if (scene.background instanceof THREE.Color) {
          (scene.background as THREE.Color).lerp(new THREE.Color(skyColor), lerpFactor);
        } else {
          scene.background = new THREE.Color(skyColor);
        }
        
        starMat.opacity = THREE.MathUtils.lerp(starMat.opacity, starOpacity, lerpFactor);

        if (fogDensity > 0) {
          if (scene.fog && scene.fog instanceof THREE.FogExp2) {
            scene.fog.color.lerp(new THREE.Color(fogColor), lerpFactor);
            (scene.fog as THREE.FogExp2).density = THREE.MathUtils.lerp((scene.fog as THREE.FogExp2).density, fogDensity, lerpFactor);
          } else {
            scene.fog = new THREE.FogExp2(fogColor, fogDensity);
          }
        } else {
          if (scene.fog && scene.fog instanceof THREE.FogExp2) {
            (scene.fog as THREE.FogExp2).density = THREE.MathUtils.lerp((scene.fog as THREE.FogExp2).density, 0, lerpFactor);
            if ((scene.fog as THREE.FogExp2).density < 0.001) {
              scene.fog = null;
            }
          } else {
            scene.fog = null;
          }
        }
      }

      // Sync active lighting components (lamppost spotbulbs and glowing window frames)
      const lightsOn = (timeOfDay === 'sunset' || timeOfDay === 'night');
      streetLights.forEach(sl => {
        sl.visible = lightsOn;
      });

      // Glowing window lights are no longer needed since homes were deleted

      // Slowly float cloud models
      const cloudColor = (weather === 'cloudy' || weather === 'rainy') ? 0x8a9ba8 : 0xfafafa;
      cloudsList.forEach(c => {
        c.mesh.position.x += delta * c.speed;
        if (c.mesh.position.x > 32) {
          c.mesh.position.x = -32;
        }
        c.mesh.rotation.y += delta * 0.01 * c.speed;
        
        // Update cloud grey color based on current weather
        c.mesh.children.forEach(mesh => {
          if (mesh instanceof THREE.Mesh && mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.color.setHex(cloudColor);
          }
        });
      });

      // Summer Rain shower falls
      if (rainParticlesRef.current) {
        const positions = rainParticlesRef.current.geometry.attributes.position.array as Float32Array;
        if (weather === 'rainy') {
          rainMat.opacity = THREE.MathUtils.lerp(rainMat.opacity, 0.75, 0.05);
          
          for (let i = 0; i < rainCount * 3; i += 3) {
            positions[i + 1] -= delta * 15;
            if (positions[i + 1] < 0) {
              positions[i + 1] = 20 + Math.random() * 5;
              positions[i] = (Math.random() - 0.5) * 60;
              positions[i + 2] = (Math.random() - 0.5) * 60;
            }
          }
          rainParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        } else {
          rainMat.opacity = THREE.MathUtils.lerp(rainMat.opacity, 0.0, 0.1);
        }
      }

      // Wind sway flora
      windSwayTimeRef.current += delta * (weather === 'rainy' ? 3.5 : 1.8);
      objectsGroup.children.forEach((item) => {
        if (item.name.includes('oak') || item.name.includes('pine')) {
          const sway = Math.sin(windSwayTimeRef.current + item.position.x) * 0.02;
          item.rotation.z = sway;
        }
      });

      // BIG G MONUMENT CENTERPIECE (Animation disabled as requested)

      // ANIMATE "ROTATING BOOKSHELVES" INSIDE THE LIBRARY
      objectsGroup.traverse((child) => {
        if (child.name && child.name.includes('library_rotating_shelf')) {
          child.rotation.y += delta * 0.4; // Slowly spin the library carousels so we can see all the books!
        }
      });

      // ANIMATE DYNAMIC OPENING SLIDING GLASS DOORS (ON PLAYER PROXIMITY OR RAIN)
      const isRaining = (weather === 'rainy');
      const playerPos = fpStateRef.current.playerPos;

      objectsGroup.traverse((child) => {
        if (!child.name) return;

        // 1. Central Library Double Sliding Glass Doors
        if (child.name === "library_door_left") {
          const doorWorldPos = new THREE.Vector3();
          child.getWorldPosition(doorWorldPos);
          const dist = playerPos.distanceTo(doorWorldPos);
          const shouldOpen = isRaining || (dist < 4.8);
          const targetX = shouldOpen ? -1.35 : -0.675;
          child.position.x = THREE.MathUtils.lerp(child.position.x, targetX, 5.0 * delta);
        }
        if (child.name === "library_door_right") {
          const doorWorldPos = new THREE.Vector3();
          child.getWorldPosition(doorWorldPos);
          const dist = playerPos.distanceTo(doorWorldPos);
          const shouldOpen = isRaining || (dist < 4.8);
          const targetX = shouldOpen ? 1.35 : 0.675;
          child.position.x = THREE.MathUtils.lerp(child.position.x, targetX, 5.0 * delta);
        }

        // 2. Cafe Double Sliding Glass Doors
        if (child.name === "cafe_door_left") {
          const doorWorldPos = new THREE.Vector3();
          child.getWorldPosition(doorWorldPos);
          const dist = playerPos.distanceTo(doorWorldPos);
          const shouldOpen = isRaining || (dist < 4.8);
          const targetX = shouldOpen ? 0.2 : 0.725;
          child.position.x = THREE.MathUtils.lerp(child.position.x, targetX, 5.0 * delta);
        }
        if (child.name === "cafe_door_right") {
          const doorWorldPos = new THREE.Vector3();
          child.getWorldPosition(doorWorldPos);
          const dist = playerPos.distanceTo(doorWorldPos);
          const shouldOpen = isRaining || (dist < 4.8);
          const targetX = shouldOpen ? 2.2 : 1.675;
          child.position.x = THREE.MathUtils.lerp(child.position.x, targetX, 5.0 * delta);
        }

        // 3. Royal Pavilion Bistro Sliding Glass Doors
        if (child.name === "restaurant_door_left") {
          const doorWorldPos = new THREE.Vector3();
          child.getWorldPosition(doorWorldPos);
          const dist = playerPos.distanceTo(doorWorldPos);
          const shouldOpen = isRaining || (dist < 4.8);
          const targetX = shouldOpen ? -1.1 : -0.42;
          child.position.x = THREE.MathUtils.lerp(child.position.x, targetX, 5.0 * delta);
        }
        if (child.name === "restaurant_door_right") {
          const doorWorldPos = new THREE.Vector3();
          child.getWorldPosition(doorWorldPos);
          const dist = playerPos.distanceTo(doorWorldPos);
          const shouldOpen = isRaining || (dist < 4.8);
          const targetX = shouldOpen ? 1.1 : 0.42;
          child.position.x = THREE.MathUtils.lerp(child.position.x, targetX, 5.0 * delta);
        }

        // 4. Grand Supermarket Sliding Glass Doors
        if (child.name === "supermarket_door_left") {
          const doorWorldPos = new THREE.Vector3();
          child.getWorldPosition(doorWorldPos);
          const dist = playerPos.distanceTo(doorWorldPos);
          const shouldOpen = isRaining || (dist < 4.8);
          const targetX = shouldOpen ? -1.8 : -0.62;
          child.position.x = THREE.MathUtils.lerp(child.position.x, targetX, 5.0 * delta);
        }
        if (child.name === "supermarket_door_right") {
          const doorWorldPos = new THREE.Vector3();
          child.getWorldPosition(doorWorldPos);
          const dist = playerPos.distanceTo(doorWorldPos);
          const shouldOpen = isRaining || (dist < 4.8);
          const targetX = shouldOpen ? 1.8 : 0.62;
          child.position.x = THREE.MathUtils.lerp(child.position.x, targetX, 5.0 * delta);
        }
      });

      // 2. CAMERA CONTROLLING MODES
      if (cameraMode === 'walk' || cameraMode === 'sit') {
        // DISABLE ORBIT CONTROLS IN WALK AND SIT
        controls.enabled = false;

        const state = fpStateRef.current;
        const keys = state.keysPressed;

        const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, state.yaw, 0));
        const right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, state.yaw, 0));
        const moveDir = new THREE.Vector3(0, 0, 0);

        if (cameraMode === 'walk') {
          let keyAngle: number | null = null;
          if (keys['w'] || keys['arrowup']) {
            keyAngle = 0; // Front
          } else if (keys['s'] || keys['arrowdown']) {
            keyAngle = Math.PI; // Back
          } else if (keys['a'] || keys['arrowleft']) {
            keyAngle = Math.PI / 2; // Left
          } else if (keys['d'] || keys['arrowright']) {
            keyAngle = -Math.PI / 2; // Right
          }

          if (keyAngle !== null) {
            if (state.baseYaw === undefined) {
              state.baseYaw = state.yaw;
            }
            const targetYaw = state.baseYaw + keyAngle;
            state.yaw = THREE.MathUtils.lerp(state.yaw, targetYaw, 5.0 * delta);
          } else {
            state.baseYaw = undefined;
          }

          if (keys['w'] || keys['arrowup']) moveDir.add(forward);
          if (keys['s'] || keys['arrowdown']) moveDir.addScaledVector(forward, -1);
          if (keys['d'] || keys['arrowright']) moveDir.add(right);
          if (keys['a'] || keys['arrowleft']) moveDir.addScaledVector(right, -1);

          // Mobile touch inputs
          if (touchControlsRef.current.forward) moveDir.add(forward);
          if (touchControlsRef.current.backward) moveDir.addScaledVector(forward, -1);
          if (touchControlsRef.current.right) moveDir.add(right);
          if (touchControlsRef.current.left) moveDir.addScaledVector(right, -1);

          if (moveDir.lengthSq() > 0) {
            const prevBobTimer = state.bobTimer;
            moveDir.normalize();
            state.playerPos.addScaledVector(moveDir, state.moveSpeed * delta);
            state.bobTimer += delta * 12;


          }

          // Clamp inside outer sidewalk and boundary limits
          state.playerPos.x = Math.max(-28.5, Math.min(28.5, state.playerPos.x));
          state.playerPos.z = Math.max(-28.5, Math.min(28.5, state.playerPos.z));
        } else {
          // SIT MODE: movement locked
          state.playerPos.y = 1.05;
          moveDir.set(0, 0, 0);
        }

        // Mount camera position
        camera.position.copy(state.playerPos);
        if (cameraMode === 'walk') {
          camera.position.y += Math.sin(state.bobTimer) * 0.05; // Head bobbing only if walking
        } else if (cameraMode === 'sit') {
          // Slow relaxing breathing bob & subtle organic sway
          state.bobTimer += delta * 1.5; // Very slow breathing rate
          camera.position.y += Math.sin(state.bobTimer) * 0.025; // Gentle vertical breathing
          camera.position.x += Math.cos(state.bobTimer * 0.5) * 0.025; // Subtle side-to-side float
        }

        // Look target
        const lookTarget = new THREE.Vector3(0, 0, -1);
        const euler = new THREE.Euler(state.pitch, state.yaw, 0, 'YXZ');
        lookTarget.applyEuler(euler);
        lookTarget.add(camera.position);
        camera.lookAt(lookTarget);

        // Dynamic spatial sound based on distance to fountain
        if (audioEngineRef.current && audioEnabled) {
          const fountainDist = state.playerPos.length();
          audioEngineRef.current.updateFountainDistance(fountainDist);
        }
      } else if (autoTour) {
        // CINEMATIC AUTOMATIC FLIGHT (No user controls, disables orbitcontrols)
        controls.enabled = false;

        const tour = tourStateRef.current;
        tour.angle += delta * 0.12; // Moderate sweep speed

        // Cycle focal points automatically
        tour.spotTimer += delta;
        if (tour.spotTimer > 8) {
          tour.spotTimer = 0;
          tour.spotIdx = (tour.spotIdx + 1) % 4;
        }

        let targetLook = new THREE.Vector3(0, 1.5, 0);
        let camHeight = 12;
        let radius = 22;

        if (tour.spotIdx === 0) {
          // Focus 1: Grand Upgraded Cascading Fountain
          targetLook.set(0, 1.5, 0);
          camHeight = 10;
          radius = 16;
        } else if (tour.spotIdx === 1) {
          // Focus 2: The New "GRAND PARK" stone sign monument
          targetLook.set(-5.5, 1.2, 20.8);
          camHeight = 4.5;
          radius = 10;
        } else if (tour.spotIdx === 2) {
          // Focus 3: Scenic view of the colorful historical row houses
          targetLook.set(-20, 2.5, -20);
          camHeight = 7.5;
          radius = 15;
        } else {
          // Focus 4: Cozy pathways and lush greenery
          targetLook.set(8, 0.5, -8);
          camHeight = 9;
          radius = 14;
        }

        const destX = targetLook.x + Math.cos(tour.angle) * radius;
        const destZ = targetLook.z + Math.sin(tour.angle) * radius;
        
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, destX, 0.04);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, camHeight, 0.04);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, destZ, 0.04);

        // Frame target beautifully
        const lookDir = targetLook.clone().sub(camera.position).normalize();
        const lookTarget = camera.position.clone().add(lookDir);
        camera.lookAt(lookTarget);
      } else {
        // STANDARD MANUAL INTERACTION (OrbitControls take over!)
        // NO AUTOMATIC ROTATION OR DRIFT OCCURS. Let user pan/zoom/rotate freely.
        controls.enabled = true;
        controls.update();
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.removeEventListener('click', handleCanvasClick);
        rendererRef.current.domElement.removeEventListener('mousemove', handleMouseMove);
      }
      document.removeEventListener('pointerlockchange', lockChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      // Dispose materials & geometries
      grassGeo.dispose();
      grassTex.dispose();
      grassMat.dispose();
      stoneTex.dispose();
      pathMat.dispose();
      asphaltTex.dispose();
      roadMat.dispose();
      curbMat.dispose();
      whiteZebraMat.dispose();
      hedgeMat.dispose();
      rainGeo.dispose();
      rainMat.dispose();
      starsGeo.dispose();
      starMat.dispose();
    };
  }, [timeOfDay, weather, cameraMode, autoTour, audioEnabled]);

  const standUpFromBench = () => {
    if (cameraMode !== 'sit') return;
    setIsSitting(false);
    setCameraMode('walk');
    setSoundVisible(true); // make sure sound controls are visible again on standup!
    
    const state = fpStateRef.current;
    state.playerPos.y = 1.65; // Stand up
    
    // Move slightly forward from the bench facing direction to avoid getting stuck
    const forwardDir = new THREE.Vector3(0, 0, -1.2).applyEuler(new THREE.Euler(0, state.yaw, 0));
    state.playerPos.add(forwardDir);
    
    // Clamp inside borders
    state.playerPos.x = Math.max(-28.5, Math.min(28.5, state.playerPos.x));
    state.playerPos.z = Math.max(-28.5, Math.min(28.5, state.playerPos.z));

    setInspectedItem({
      name: 'Standing Up',
      type: 'walk',
      description: 'You stood up from the bench. You can now walk around the park freely again.',
      funFact: 'Walking is a simple yet powerful way to boost your energy, clear your mind, and enjoy nature.'
    });
  };

  // Idle detection while sitting
  useEffect(() => {
    if (cameraMode !== 'sit') {
      setSitIdleProgress(0);
      return;
    }

    let lastYaw = fpStateRef.current.yaw;
    let lastPitch = fpStateRef.current.pitch;
    let msIdle = 0;
    const maxMs = 30000; // 30 seconds

    const interval = setInterval(() => {
      const currentYaw = fpStateRef.current.yaw;
      const currentPitch = fpStateRef.current.pitch;

      // If the user rotated their camera or moved mouse, reset the idle timer!
      if (Math.abs(currentYaw - lastYaw) > 0.005 || Math.abs(currentPitch - lastPitch) > 0.005) {
        msIdle = 0;
        lastYaw = currentYaw;
        lastPitch = currentPitch;
      } else {
        msIdle += 200; // check every 200ms
      }

      const progress = Math.min(100, (msIdle / maxMs) * 100);
      setSitIdleProgress(progress);

      if (msIdle >= maxMs) {
        clearInterval(interval);
        standUpFromBench();
      }
    }, 200);

    return () => clearInterval(interval);
  }, [cameraMode]);

  // Adjust camera starting point based on toggled mode
  const toggleCameraMode = () => {
    if (cameraMode === 'sit') {
      standUpFromBench();
    } else if (cameraMode === 'orbit') {
      setCameraMode('walk');
      setAutoTour(false);
      // Reset position outside the main gate facing North, feeling like entering
      fpStateRef.current.playerPos.set(0, 1.65, 28.5);
      fpStateRef.current.yaw = Math.PI; // Look Northwards inside park
      fpStateRef.current.pitch = -0.05;
    } else {
      setCameraMode('orbit');
      // Reset camera view overlooking park
      if (cameraRef.current) {
        cameraRef.current.position.set(-18, 14, 28);
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 1.2, 0);
        }
      }
    }
  };

  const handleMobileTouch = (dir: 'forward' | 'backward' | 'left' | 'right', active: boolean) => {
    touchControlsRef.current[dir] = active;
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden font-sans text-white select-none">
      
      {/* BACKGROUND 3D CANVAS VIEWPORT */}
      <div id="canvas-container" ref={containerRef} className="w-full h-full" />

      {/* TOP HEADER TITLE */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2 drop-shadow-lg">
          <Trees className="w-6 h-6 text-purple-400" />
          <span>GRAND PARK VISUALS</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 font-mono pointer-events-auto">EXPLORER</span>
        </h1>
        <p className="text-xs text-slate-300 font-medium tracking-wide drop-shadow drop-shadow-slate-950/80 mt-0.5">
          Municipal Garden & Suburbs Simulator
        </p>
      </div>



      {/* CONTROLS HUD (BOTTOM CENTRE) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-3 bg-slate-900/85 backdrop-blur-md p-2 rounded-2xl border border-slate-700/50 shadow-xl">
        
        {/* Toggle Orbit / Walk / Sit modes */}
        {cameraMode === 'sit' ? (
          <button 
            onClick={standUpFromBench} 
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 transition-all shadow-lg animate-pulse"
            title="Stand Up"
          >
            <User className="w-5 h-5 text-white animate-bounce" />
          </button>
        ) : (
          <button 
            onClick={toggleCameraMode} 
            className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all active:scale-95 ${cameraMode === 'walk' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
            title={cameraMode === 'walk' ? 'Switch to Orbit View' : 'Switch to Walk View'}
          >
            {cameraMode === 'walk' ? <Footprints className="w-5 h-5" /> : <Compass className="w-5 h-5" />}
          </button>
        )}

        <div className="w-[1px] h-6 bg-slate-800" />

        {/* Auto Tour flight */}
        <button 
          onClick={() => {
            setAutoTour(!autoTour);
            if (cameraMode === 'walk' || cameraMode === 'sit') {
              setIsSitting(false);
              setCameraMode('orbit');
            }
          }}
          disabled={cameraMode === 'sit'}
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all active:scale-95 ${autoTour ? 'bg-purple-700 text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30'}`}
          title="Autopilot cinematic fly-through"
        >
          <Tv className="w-5 h-5" />
        </button>

        {/* SIMPLE ON-OFF AUDIO ON/OFF TOGGLE (directly after autopilot as requested!) */}
        <div className="w-[1px] h-6 bg-slate-800" />
        <button 
          onClick={() => setAudioEnabled(!audioEnabled)} 
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all active:scale-95 ${audioEnabled ? 'bg-purple-600 text-white shadow-lg animate-pulse' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          title={audioEnabled ? 'Sound is Enabled. Click to Mute.' : 'Sound is Muted. Click to Enable.'}
        >
          {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        <div className="w-[1px] h-6 bg-slate-800" />

        {/* HELP GUIDE BUTTON */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all active:scale-95 ${showHelp ? 'bg-purple-900 text-white shadow-lg border border-purple-500/35' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          title="Show User Guide"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* SITTING IDLE AUTO-STAND PROGRESS BAR */}
      {cameraMode === 'sit' && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-1 bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-purple-500/30 shadow-xl w-60 animate-fade-in">
          <div className="flex items-center justify-between w-full text-[10px] uppercase font-bold tracking-wider text-slate-300">
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-purple-400" /> Sit Auto-Stand</span>
            <span className="text-purple-400 font-mono">{Math.max(0, Math.ceil(30 - (sitIdleProgress * 30 / 100)))}s</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950/80 rounded-full overflow-hidden border border-slate-800 animate-pulse">
            <div 
              className="h-full bg-purple-500 rounded-full transition-all duration-200"
              style={{ width: `${sitIdleProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* MOBILE FIRST-PERSON CONTROLS JOYPAD (Walk mode) */}
      {cameraMode === 'walk' && (
        <div className="md:hidden absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-1 p-2 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800">
          <button 
            onMouseDown={() => handleMobileTouch('forward', true)}
            onMouseUp={() => handleMobileTouch('forward', false)}
            onTouchStart={() => handleMobileTouch('forward', true)}
            onTouchEnd={() => handleMobileTouch('forward', false)}
            className="p-3 bg-slate-800 active:bg-purple-600 active:text-white rounded-lg text-slate-300"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div className="flex space-x-4">
            <button 
              onMouseDown={() => handleMobileTouch('left', true)}
              onMouseUp={() => handleMobileTouch('left', false)}
              onTouchStart={() => handleMobileTouch('left', true)}
              onTouchEnd={() => handleMobileTouch('left', false)}
              className="p-3 bg-slate-800 active:bg-purple-600 active:text-white rounded-lg text-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button 
              onMouseDown={() => handleMobileTouch('right', true)}
              onMouseUp={() => handleMobileTouch('right', false)}
              onTouchStart={() => handleMobileTouch('right', true)}
              onTouchEnd={() => handleMobileTouch('right', false)}
              className="p-3 bg-slate-800 active:bg-purple-600 active:text-white rounded-lg text-slate-300"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <button 
            onMouseDown={() => handleMobileTouch('backward', true)}
            onMouseUp={() => handleMobileTouch('backward', false)}
            onTouchStart={() => handleMobileTouch('backward', true)}
            onTouchEnd={() => handleMobileTouch('backward', false)}
            className="p-3 bg-slate-800 active:bg-purple-600 active:text-white rounded-lg text-slate-300"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* BOTTOM-RIGHT FLOATING WIDGETS STACK */}
      <div className="absolute bottom-20 right-4 z-20 flex flex-col items-end space-y-3 pointer-events-none w-64 md:w-72">
        {/* 3D INSPECT DETAILS (Insights Card with beautiful professional typography) */}
        {inspectedItem && (
          <div className="pointer-events-auto w-full bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-purple-500/30 shadow-2xl animate-fade-in font-sans">
            <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-slate-800">
              <span className="text-[10px] tracking-widest font-mono text-purple-400 uppercase font-bold flex items-center gap-1">🔍 INSIGHTS</span>
              <button 
                onClick={() => setInspectedItem(null)}
                className="text-slate-400 hover:text-white font-bold text-xs"
              >
                ✕
              </button>
            </div>
            <h4 className="text-xs font-bold text-white mb-1 font-sans">
              {inspectedItem.name}
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans tracking-wide">
              {inspectedItem.description}
            </p>
            {inspectedItem.funFact && (
              <p className="text-[10px] text-purple-400 mt-1.5 italic font-sans tracking-wide">
                💡 {inspectedItem.funFact}
              </p>
            )}
          </div>
        )}
      </div>

      {/* DYNAMIC COLLECTIBLE TOAST MESSAGE */}
      {collectibleToast.visible && (
        <div className="absolute top-16 left-4 md:left-1/2 md:-translate-x-1/2 z-50 pointer-events-none w-[92%] max-w-sm">
          <div className="bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.35)] animate-bounce font-sans flex items-center gap-3 pointer-events-auto">
            <div className="text-xl flex-shrink-0 animate-pulse">🏆</div>
            <div className="flex-1">
              <h5 className="text-xs font-extrabold text-purple-300 font-sans tracking-wide">
                {collectibleToast.message}
              </h5>
              <p className="text-[11px] text-slate-100 font-sans leading-relaxed mt-0.5 font-medium">
                {collectibleToast.subMessage}
              </p>
            </div>
            <button 
              onClick={() => setCollectibleToast(prev => ({ ...prev, visible: false }))}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}


      {/* USER GUIDE POPUP MODAL */}
      {showHelp && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl bg-slate-900/95 p-6 rounded-2xl border border-purple-500/30 shadow-2xl relative animate-fade-in text-left max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
            <button 
              onClick={() => setShowHelp(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center transition-all"
            >
              ✕
            </button>
            
            <div className="border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-lg font-black text-purple-400 flex items-center gap-2">
                📖 GRAND PARK COMPREHENSIVE VISITOR'S GUIDE
              </h3>
              <p className="text-xs text-slate-400 mt-1">Discover interactive premium features, precise controls, and the newly upgraded dual-lane cricket nets.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column - Camera & Navigation */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">🎥 Navigation & Camera Modes</h4>
                
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-purple-500/20 transition-all">
                  <span className="font-extrabold text-purple-400 text-xs block">🚁 ORBIT MODE (Default)</span>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Drag with the <strong className="text-white">left mouse button</strong> to rotate your view around the park. Scroll to zoom in and out. Tap/click any landmark or building to instantly inspect it!
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-purple-500/20 transition-all">
                  <span className="font-extrabold text-purple-400 text-xs block">🚶 WALK MODE (Immersive First-Person)</span>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Tap the screen to lock your cursor. Move using <strong className="font-mono text-white bg-slate-800 px-1 rounded">W A S D</strong> or <strong className="font-mono text-white bg-slate-800 px-1 rounded">Arrow Keys</strong>. Drag your mouse to look around. Perfect for exploring park details up close!
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-purple-500/20 transition-all">
                  <span className="font-extrabold text-purple-400 text-xs block">🧍 SIT MODE (Relax & Observe)</span>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Approach any park bench in Walk Mode and tap it to sit down. You can look left, right, and center freely. Press <strong className="font-mono text-white bg-slate-800 px-1.5 rounded">SPACEBAR</strong> or tap <strong className="text-rose-400">"Stand Up"</strong> to resume walking.
                  </p>
                </div>
              </div>

              {/* Right Column - Attractions & Audio */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">🏢 Park Attractions & Interactions</h4>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-purple-500/20 transition-all">
                  <span className="font-extrabold text-purple-400 text-xs block">🏫 LIBRARY, COFFEE CAFE, & UPGRADED CRICKET TURF</span>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    • <strong className="text-white">Central Library & Cafe</strong>: The grand Neoclassical Library and cozy Greenery Cafe both feature pristine, geometrically precise gabled roofs. The cafe's outdoor sitting patio has been moved to its far left, ensuring comfortable spacing from the library.<br/>
                    • <strong className="text-white">Lord's Practice Nets</strong>: Our professional-grade, dual-lane cricket practice turf is now twice as large. Features two clay pitches, white markings, wickets on both sides, equipment benches with bags/bats/balls, and towering safety netting under intense overhead floodlighting!
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-purple-500/20 transition-all">
                  <span className="font-extrabold text-purple-400 text-xs block">🗿 CENTRAL "BIG G" MONUMENT</span>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    The majestic centerpiece of Grand Park, designed in luxurious <strong className="text-white">white marble and slate-grey metal</strong>. Features impressive concentric rings and a towering central G sculpture that celebrates park unity.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-purple-500/20 transition-all">
                  <span className="font-extrabold text-purple-400 text-xs block">🌳 HIGH-FIDELITY NATURE SOUNDS</span>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Experience rich nature acoustics! Features <strong className="text-white">realistic multi-species bird sweeps</strong> calling and replying procedurally, a constant soft wind breeze, and gentle synthesizer background music. All walking footstep sounds have been removed for a tranquil experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl text-center">
              <p className="text-[11px] text-purple-300 font-bold">
                ⚡ Everything works instantly with simple, responsive taps! Tap objects to inspect descriptions and fun facts.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
