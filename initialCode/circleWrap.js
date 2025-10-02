{
  // Get the active composition
  var comp = app.project.activeItem;
  var borderSize = 10;

  if (comp && comp instanceof CompItem && comp.selectedLayers.length > 0) {
    // Get the selected layer
    var layer = comp.selectedLayers[0];

    // Get the layer dimensions and position
    var layerWidth = layer.sourceRectAtTime(comp.time, false).width;
    var layerHeight = layer.sourceRectAtTime(comp.time, false).height;
    var layerLeft = layer.sourceRectAtTime(comp.time, false).left;
    var layerTop = layer.sourceRectAtTime(comp.time, false).top;

    // Calculate the center of the layer
    var centerX = layerLeft + layerWidth / 2;
    var centerY = layerTop + layerHeight / 2;

    // Find the minimum dimension to create a perfect circle
    var minDimension = Math.min(layerWidth, layerHeight);

    // Create an ellipse (circle) mask
    var mask = layer.Masks.addProperty("ADBE Mask Atom");

    // Define the circular mask shape, centered on the layer
    var maskShape = new Shape();
    maskShape.vertices = [
      [centerX, centerY - minDimension / 2], // Top
      [centerX + minDimension / 2, centerY], // Right
      [centerX, centerY + minDimension / 2], // Bottom
      [centerX - minDimension / 2, centerY], // Left
    ];

    // Circular tangents
    var radius = (minDimension / 2) * ((4 * (Math.sqrt(2) - 1)) / 3);
    maskShape.inTangents = [
      [-radius, 0], // Top
      [0, -radius], // Right
      [radius, 0], // Bottom
      [0, radius], // Left
    ];
    maskShape.outTangents = [
      [radius, 0], // Top
      [0, radius], // Right
      [-radius, 0], // Bottom
      [0, -radius], // Left
    ];

    // Close the mask
    maskShape.closed = true;

    // Set the mask's shape
    mask.property("ADBE Mask Shape").setValue(maskShape);

    // --- Now add the larger background circle ---

    // Create a new shape layer
    var shapeLayer = comp.layers.addShape();

    // Add a group to the shape layer for the ellipse
    var shapeGroup = shapeLayer
      .property("ADBE Root Vectors Group")
      .addProperty("ADBE Vector Group");

    // Add an ellipse to the shape group
    var ellipse = shapeGroup
      .property("ADBE Vectors Group")
      .addProperty("ADBE Vector Shape - Ellipse");

    // Set the size of the ellipse to be 10px larger in both dimensions
    ellipse
      .property("ADBE Vector Ellipse Size")
      .setValue([minDimension + borderSize*2, minDimension + borderSize*2]);

    // Add a fill property to the shape group
    var fill = shapeGroup
      .property("ADBE Vectors Group")
      .addProperty("ADBE Vector Graphic - Fill");

    // Set the fill color to white (RGB: [1, 1, 1])
    fill.property("ADBE Vector Fill Color").setValue([0, 0, 0]);

    //get selected layer position in comp
    var layerPos = layer.position.value;

    // // Access the transform group of the shape layer to set its position
    var shapeTransform = shapeLayer.property("Transform");
    shapeTransform.property("Position").setValue(layerPos);

    // Move the shape layer directly behind the selected layer
    shapeLayer.moveAfter(layer);

    // --- Apply scale factor from selected layer to shape layer ---

    // Get the scale of the selected layer
    var layerScale = layer.property('Scale').value;

    // Apply the same scale to the shape layer
    shapeTransform.property('Scale').setValue(layerScale);
  } else {
    alert("Please select a layer in an active composition.");
  }
}
