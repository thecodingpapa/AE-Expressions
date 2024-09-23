{
  // Check if there is a selected layer
  if (
    app.project.activeItem &&
    app.project.activeItem.selectedLayers.length > 0
  ) {
    var comp = app.project.activeItem;
    var selectedLayer = comp.selectedLayers[0]; // Get the first selected layer

    // Get the layer's content bounding box
    var layerRect = selectedLayer.sourceRectAtTime(comp.time, false);

    // Get the current layer's position
    var layerPos = selectedLayer.position.value;

    // Calculate the center of the content
    var anchorX = layerRect.left + layerRect.width / 2;
    var anchorY = layerRect.top + layerRect.height / 2;

    // Set the anchor point to the center of the content
    selectedLayer.anchorPoint.setValue([anchorX, anchorY]);

    // Adjust the layer's position to compensate for the anchor point change
    var deltaX = anchorX - selectedLayer.anchorPoint.value[0];
    var deltaY = anchorY - selectedLayer.anchorPoint.value[1];

    //check if the layer has a keyframe in position property
    if (selectedLayer.property("Position").numKeys > 0) {
        selectedLayer.position.setValueAtTime(
            comp.time,
            [
                layerPos[0] + deltaX,
                layerPos[1] + deltaY,
            ]
            );
    }else{
    selectedLayer.position.setValue([
      layerPos[0] + deltaX,
      layerPos[1] + deltaY,
    ]);
}

    // Get the dimensions of the selected layer
    var layerWidth = layerRect.width;
    var layerHeight = layerRect.height;
    var layerPos = selectedLayer.position.value;

    // Add a shape layer for the background box
    var shapeLayer = comp.layers.addShape();
    shapeLayer.name = selectedLayer.name + "_background";

    // Create a rectangle path
    var rectGroup = shapeLayer
      .property("Contents")
      .addProperty("ADBE Vector Group");
    var rectPath = rectGroup
      .property("Contents")
      .addProperty("ADBE Vector Shape - Rect");

    // Set rectangle size (with a margin)
    var margin = 50;
    rectPath
      .property("Size")
      .setValue([layerWidth + margin * 2, layerHeight + margin * 2]);

    // Set position behind the selected layer
    shapeLayer.property("Position").setValue([layerPos[0], layerPos[1]]);

    // Add rounded corners
    var roundedCorners = rectGroup
      .property("Contents")
      .addProperty("ADBE Vector Filter - RC");
    roundedCorners.property("Radius").setValue(30); // Adjust corner radius as needed

    // Add fill color
    var fill = rectGroup
      .property("Contents")
      .addProperty("ADBE Vector Graphic - Fill");
    fill.property("Color").setValue([1, 1, 1]); // Adjust fill color as needed

    // Add stroke (outline)
    var stroke = rectGroup
      .property("Contents")
      .addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("Color").setValue([0, 0, 0]); // Adjust stroke color as needed
    stroke.property("Stroke Width").setValue(20); // Adjust stroke width as needed

    // Add shadow Layer
    var shadowLayer = comp.layers.addShape();
    shadowLayer.name = selectedLayer.name + "_shadow";
    shadowLayer.moveAfter(shapeLayer);

    // Create a rectangle path for the shadow
    var shadowRectGroup = shadowLayer
      .property("Contents")
      .addProperty("ADBE Vector Group");
    var shadowRectPath = shadowRectGroup
      .property("Contents")
      .addProperty("ADBE Vector Shape - Rect");

    // Set rectangle size (with a margin)
    shadowRectPath
      .property("Size")
      .setValue([layerWidth + margin * 2, layerHeight + margin * 2]);

    // Set position behind the shape layer and move 30
    shadowLayer.property("Position").setValue([layerPos[0] + 30, layerPos[1] + 30]);

    // Add rounded corners
    var shadowRoundedCorners = shadowRectGroup
      .property("Contents")
      .addProperty("ADBE Vector Filter - RC");
    shadowRoundedCorners.property("Radius").setValue(30); // Adjust corner radius as needed

    // Add fill color
    var shadowFill = shadowRectGroup
      .property("Contents")
      .addProperty("ADBE Vector Graphic - Fill");
    shadowFill.property("Color").setValue([0, 0, 0]); // Adjust fill color as needed




    //check if the threeDLayer property is True on the selected layer
    if (selectedLayer.threeDLayer) {
      // Set the shape layer to be a 3D layer
      shapeLayer.threeDLayer = true;

      // Set the shadow layer to be a 3D layer
      shadowLayer.threeDLayer = true;

      //check if the selected layer has a keyframe in orientation property
      if(selectedLayer.property("Orientation").numKeys > 0){
        // copy the orientation keyframes to the shape
        for (var i = 1; i <= selectedLayer.property("Orientation").numKeys; i++) {
          var keyTime = selectedLayer.property("Orientation").keyTime(i);
          var keyValue = selectedLayer.property("Orientation").keyValue(i);
          shapeLayer.property("Orientation").setValueAtTime(keyTime, keyValue);
          shadowLayer.property("Orientation").setValueAtTime(keyTime, keyValue);
        }
        }else{

      var orient = selectedLayer.property("Orientation").value
      shapeLayer.property("Orientation").setValue(orient);
      shadowLayer.property("Orientation").setValue(orient);
        }
    }

    // Send the shape layer behind the selected layer
    shapeLayer.moveAfter(selectedLayer);
    shadowLayer.moveAfter(shapeLayer);

    // check if there is any keyframe on the selected layer in scale, position, rotation, opacity property, if so, copy the keyframes to the shape layer
    var properties = ["Scale", "Position", "Rotation"];
    for (var i = 0; i < properties.length; i++) {
      var property = properties[i];
      var selectedLayerProperty = selectedLayer.property(property);
      var shapeLayerProperty = shapeLayer.property(property);
      var shadowLayerProperty = shadowLayer.property(property);
      if (selectedLayerProperty.numKeys > 0) {
        for (var j = 1; j <= selectedLayerProperty.numKeys; j++) {
          var keyTime = selectedLayerProperty.keyTime(j);
          var keyValue = selectedLayerProperty.keyValue(j);
          shapeLayerProperty.setValueAtTime(keyTime, keyValue);

          if (property === "Position") {
            // Adjust keyValue for x, y by adding 30 each
            keyValue[0] += 30; // x coordinate
            keyValue[1] += 30; // y coordinate
          }
          shadowLayerProperty.setValueAtTime(keyTime, keyValue);
        }
      }else{
        shapeLayerProperty.setValue(selectedLayerProperty.value);

        var keyValue = selectedLayerProperty.value;
        if (property === "Position") {
          // Adjust keyValue for x, y by adding 30 each
          keyValue[0] += 30; // x coordinate
          keyValue[1] += 30; // y coordinate
        }
        shadowLayerProperty.setValue(keyValue);
      }
    }

    // Select both layers
    selectedLayer.selected = true;
    shapeLayer.selected = true;
    shadowLayer.selected = true;

    // Precompose the selected layers
    var precomp = comp.layers.precompose(
      [selectedLayer.index, shapeLayer.index, shadowLayer.index],
      selectedLayer.name + "_group",
      true
    );

    alert("Background shape with rounded corners and shadow created!");
  } else {
    alert("Please select a layer first.");
  }
}
