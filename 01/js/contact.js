 // Custom cursor element
 const cursor = document.querySelector('.custom-cursor');
 const canvas = document.getElementById('webgl-canvas');

 // Three.js scene setup
 let scene, camera, renderer;
 const mouse = new THREE.Vector2();
 const letters = [];
 let raycaster;

 function init() {
   // Set up Three.js scene
   scene = new THREE.Scene();

   // Set up camera
   camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.position.z = 500;

   // Set up renderer
   renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
   renderer.setSize(window.innerWidth, window.innerHeight);
   renderer.setPixelRatio(window.devicePixelRatio);

   // Initialize Raycaster
   raycaster = new THREE.Raycaster();

   // Load font and create text geometry per character
   const loader = new THREE.FontLoader();
   loader.load(
     'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
     function (font) {
       const text = "con+ac+";
       let offsetX = -540;

       for (let i = 0; i < text.length; i++) {
         const charGeometry = new THREE.TextGeometry(text[i], {
           font: font,
           size: 160,
           height: 5,
           curveSegments: 12,
           bevelEnabled: true,
           bevelThickness: 2,
           bevelSize: 1.5,
           bevelOffset: 0,
           bevelSegments: 3
         });

         const charMaterial = new THREE.MeshStandardMaterial({
           color: 0xffffff,
           side: THREE.DoubleSide
         });

         const charMesh = new THREE.Mesh(charGeometry, charMaterial);
         charGeometry.computeBoundingBox();
         if (charGeometry.boundingBox) {
           const charWidth = charGeometry.boundingBox.max.x - charGeometry.boundingBox.min.x;
           charMesh.position.set(offsetX + charWidth / 2, 0, 0);
           offsetX += charWidth + 20;
         }

         // Save original vertices
         charMesh.geometry.attributes.position.originalPositions = Float32Array.from(charGeometry.attributes.position.array);
         letters.push(charMesh);
         scene.add(charMesh);
       }

       // Start animation after letters are loaded
       animate();
     }
   );

   // Add lights
   const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
   scene.add(ambientLight);

   const pointLight = new THREE.PointLight(0xffffff, 1);
   pointLight.position.set(200, 200, 300);
   scene.add(pointLight);

   // Window resize listener
   window.addEventListener('resize', onWindowResize);

   // Mouse move listener
   document.addEventListener('mousemove', onMouseMove);
 }

 function onWindowResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight);
 }

 function onMouseMove(event) {
   // Update mouse coordinates to normalized device coordinates (-1 to 1)
   mouse.x = ((event.clientX / window.innerWidth) * 2) - 1;
   mouse.y = -((event.clientY / window.innerHeight) * 2) + 1;

   // Update custom cursor position
   cursor.style.left = `${event.clientX}px`;
   cursor.style.top = `${event.clientY}px`;
 }

 function animate() {
   requestAnimationFrame(animate);
   renderer.render(scene, camera);
   updateVertices();
 }

 function updateVertices() {
   raycaster.setFromCamera(mouse, camera);
   const intersects = raycaster.intersectObjects(letters);

   for (let letter of letters) {
     const position = letter.geometry.attributes.position;
     const originalPositions = letter.geometry.attributes.position.originalPositions;
     const { array } = position;

     if (intersects.length > 0 && intersects[0].object === letter) {
       const intersectPoint = intersects[0].point;
       const cursorRadius = 75; // 반지름을 고정된 값으로 설정하여 정확한 반응 구현

       // 여기서 color 바꾸세요
       gsap.to(letter.material.color, { r: 255, g:255, b:255, duration: 0.3 }); // Red color when intersecting

       // Deform vertices to create push effect within cursor area
       for (let i = 0; i < array.length; i += 3) {
         const vertexWorldPosition = new THREE.Vector3(array[i], array[i + 1], array[i + 2]);
         letter.localToWorld(vertexWorldPosition);
         const dx = vertexWorldPosition.x - intersectPoint.x;
         const dy = vertexWorldPosition.y - intersectPoint.y;
         const distance = Math.sqrt(dx * dx + dy * dy);

         if (distance < cursorRadius) {
           const influence = (1 - distance / cursorRadius) * 30;
           const direction = Math.atan2(dy, dx);
           array[i] = originalPositions[i] + Math.cos(direction) * influence;
           array[i + 1] = originalPositions[i + 1] + Math.sin(direction) * influence;
         }
       }

       position.needsUpdate = true;
     } else {
       // Reset vertices to original positions smoothly if not intersected
       gsap.to(letter.material.color, { r:255, g: 255, b: 255, duration: 0.5 }); // White color when not intersecting

       for (let i = 0; i < array.length; i++) {
         array[i] = originalPositions[i];
       }
       position.needsUpdate = true;
     }
   }
 }

 init();