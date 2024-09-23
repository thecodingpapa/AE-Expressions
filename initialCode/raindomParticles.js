{
// Start an undo group to make the script undoable in one step
app.beginUndoGroup("Create Particle Flow with Depth of Field");

// Access the active composition
var comp = app.project.activeItem;

// Create a new solid layer to apply the CC Particle World effect
var solid = comp.layers.addSolid([0, 0, 0], "Particle World Layer", comp.width, comp.height, comp.pixelAspect, comp.duration);


// Enable 3D layer for the text layer
solid.threeDLayer = true;

// Apply the CC Particle World effect to the solid layer
var particleEffect = solid.Effects.addProperty("CC Particle World");

// Customize the particle world settings for a 3D flow effect
particleEffect.property("Position").setValue([0.5, 0.75, 0]);  // Adjust emitter position
particleEffect.property("Birth Rate").setValue(2);  // Number of particles
particleEffect.property("Longevity").setValue(5);  // Particle lifespan

// Set particle physics to create a flowing effect in 3D space
var physics = particleEffect.property("Physics");
physics.property("Velocity").setValue(0.2); // Adjust speed of particles
physics.property("Gravity").setValue(0); // Turn off gravity for floating effect

// Customize particle appearance
var particle = particleEffect.property("Particle");
particle.property("Particle Type").setValue(2);  // Change particle type to Faded Sphere
particle.property("Birth Size").setValue(0.3);   // Adjust particle size at birth
particle.property("Death Size").setValue(0.1);   // Adjust particle size at death
particle.property("Size Variation").setValue(50);  // Randomize particle size

// Set the birth and death colors
particle.property("Birth Color").setValue([1, 0.5, 0]);  // Orange birth color
particle.property("Death Color").setValue([1, 1, 0]);    // Yellow death color

// // Create a 3D camera and enable depth of field
// var camera = comp.layers.addCamera("3D Camera", [comp.width / 2, comp.height / 2]);

// // Enable Depth of Field in the camera
// camera.property("Camera Options").property("Depth of Field").setValue(true);

// // Adjust the camera settings for Depth of Field
// camera.property("Camera Options").property("Focus Distance").setValue(1000);  // Adjust focus distance
// camera.property("Camera Options").property("Aperture").setValue(300);         // Adjust aperture for more blur
// camera.property("Camera Options").property("Blur Level").setValue(100);       // Increase blur intensity

// Finish undo group
app.endUndoGroup();
}