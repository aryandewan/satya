import { Application } from "@splinetool/runtime";

// Initialize Spline
const canvas = document.getElementById("spline");
const spline = new Application(canvas);
let model = null; // Store the reference to the Spline object

// Mouse movement tracking
let targetRotationX = 0;
let targetRotationY = 0;

// Load the Spline scene
spline
  .load("./3D/HIB.spline")
  .then(() => {
    console.log("Spline scene loaded successfully");

    const objects = spline.getAllObjects();
    console.log("Spline objects:", objects);

    if (objects.length === 0) {
      console.error(
        "No objects found in Spline scene. Make sure your scene has identifiable objects."
      );
      return;
    }

    model = objects[1]; // Assuming first object is the one you need to move

    // Start global mouse tracking
    document.addEventListener("mousemove", handleMouseMove);
    startAnimation();
  })
  .catch((error) => {
    console.error("Error loading Spline scene:", error);
  });

// Handle mouse movement globally (anywhere on the page)
function handleMouseMove(e) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Normalize values between -1 and 1
  targetRotationX = (e.clientY / viewportHeight) * 2 - 1; // Invert Y-axis
  targetRotationY = (e.clientX / viewportWidth) * 2 - 1;
}

// Animation loop for smooth rotation
function startAnimation() {
  function animate() {
    if (model) {
      model.rotation.x += (targetRotationX - model.rotation.x) * 0.1;
      model.rotation.y += (targetRotationY - model.rotation.y) * 0.1;
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// Keep existing Lottie animation
lottie.loadAnimation({
  container: document.getElementById("lottie-container"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "./lottie/Hi.json",
});

// Add this function to handle the hover effect
const resumeContainer = document.querySelector(".resume-container");
const resumePg1 = document.querySelector(".resume-pg-1");
const resumePg2 = document.querySelector(".resume-pg-2");

resumePg2.addEventListener("click", () => {
  resumePg2.style.zIndex = "2";
  resumePg1.style.zIndex = "1";
  resumePg2.style.transform = "translate(0px)";

  resumeContainer.addEventListener("mouseleave", () => {
    resumePg2.style.zIndex = "1";
    resumePg1.style.zIndex = "2";
    resumeContainer.addEventListener("mouseenter", () => {
      resumePg2.style.transform = "translate(100px)";
    });
    resumeContainer.addEventListener("mouseleave", () => {
      resumePg2.style.transform = "translate(0px)";
    });
  });
});
