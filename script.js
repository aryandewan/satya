import { Application } from "@splinetool/runtime";

// Create a new Spline scene
const canvas = document.getElementById("spline");
const container = document.getElementById("spline-container");
const spline = new Application(canvas);

// Mouse movement handler - defined globally
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;

// Load the 3D scene
spline
  .load("./3D/HIB.spline")
  .then(() => {
    const objects = spline.getAllObjects();
    const model = objects[0];

    if (model) {
      // Start tracking mouse movement globally
      document.addEventListener("mousemove", handleMouseMove);
      startAnimation(model);
    }
  })
  .catch((error) => {
    console.error("Error loading Spline scene:", error);
  });

function handleMouseMove(event) {
  // Get container bounds
  const containerBounds = container.getBoundingClientRect();

  // Get the mouse position
  const x = event.clientX;
  const y = event.clientY;

  // Check if mouse is within container bounds
  const isInContainer =
    x >= containerBounds.left &&
    x <= containerBounds.right &&
    y >= containerBounds.top &&
    y <= containerBounds.bottom;

  if (isInContainer) {
    // Calculate position relative to container center
    const containerCenterX = containerBounds.left + containerBounds.width / 2;
    const containerCenterY = containerBounds.top + containerBounds.height / 2;

    // Convert to normalized coordinates (-1 to 1) relative to container
    mouseX = (x - containerCenterX) / (containerBounds.width / 2);
    mouseY = -(y - containerCenterY) / (containerBounds.height / 2);
  } else {
    // When outside, calculate nearest point on container bounds
    const clampX = Math.max(
      containerBounds.left,
      Math.min(x, containerBounds.right)
    );
    const clampY = Math.max(
      containerBounds.top,
      Math.min(y, containerBounds.bottom)
    );

    const containerCenterX = containerBounds.left + containerBounds.width / 2;
    const containerCenterY = containerBounds.top + containerBounds.height / 2;

    mouseX = (clampX - containerCenterX) / (containerBounds.width / 2);
    mouseY = -(clampY - containerCenterY) / (containerBounds.height / 2);
  }

  // Update target rotation with clamped values
  targetRotationX = Math.max(-1, Math.min(1, mouseY)) * 1.0;
  targetRotationY = Math.max(-1, Math.min(1, mouseX)) * 1.0;
}

function startAnimation(model) {
  function animate() {
    if (model) {
      // Apply smoother rotation
      model.rotation.x += (targetRotationX - model.rotation.x) * 0.1;
      model.rotation.y += (targetRotationY - model.rotation.y) * 0.1;
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// Keep the existing Lottie animation
lottie.loadAnimation({
  container: document.getElementById("lottie-container"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "./lottie/Hi.json",
});
