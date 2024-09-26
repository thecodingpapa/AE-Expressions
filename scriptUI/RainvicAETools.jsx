{
  var version = "1.2.1";
  function showSoftNotification(message, duration) {
    var notificationWindow = new Window("palette", "Notification", undefined, {
      closeButton: false,
    });
    notificationWindow.add("statictext", undefined, message);
    notificationWindow.show();

    // Automatically close the notification after the specified duration
    app.setTimeout(function () {
      notificationWindow.close();
    }, duration);
  }

  function createGraph(
    xStart,
    xEnd,
    xStep,
    yStart,
    yEnd,
    yStep,
    margin,
    strokeWidth,
    fontSize,
    color,
    graphWidth,
    graphColor,
    duration
  ) {
    var version = "1.4.2";

    //screen size 1920 x 1080
    var height = 1080;
    var width = 1920;
    var numberOfMiddleLines = 0; // if you want to add custom number of horizontal lines, change this value(0 means number of y values - 1)

    var textYPosFromBottomLine = 50;

    // var xValues = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000"];
    var xValues = [];
    if (xValues.length == 0) {
      for (var i = xStart; i <= xEnd; i += xStep) {
        xValues.push(i);
      }
    }

    // var yValues = ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"];
    var yValues = [];
    if (yValues.length == 0) {
      for (var i = yStart; i <= yEnd; i += yStep) {
        yValues.push(i);
      }
    }

    var textXPosFromLeftLine = 70;
    var numOfGraphs = 3;

    /***
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     * DO NOT TOUCH THE CODE BELOW!!!!!!!!!!!!!!
     */

    // get timestamp of datetime
    function getTimestamp() {
      var date = new Date();
      var timestamp = date.getTime();
      return timestamp;
    }

    //create graph name with timestamp
    var graphName = "graph_anim_" + getTimestamp() + "(" + version + ")";
    var linesName = "lines" + "(" + version + ")";
    var xvaluesName = "xvalues" + "(" + version + ")";
    var yvaluesName = "yvalues" + "(" + version + ")";
    var graphsName = "graphs" + "(" + version + ")";

    // Create a new folder in the project
    var project = app.project;
    var folder = project.items.addFolder(graphName);

    // Create a new composition
    var graphAnimComp = app.project.items.addComp(
      graphName,
      width,
      height,
      1,
      duration,
      30
    );

    var linesComp = app.project.items.addComp(
      linesName,
      width,
      height,
      1,
      duration,
      30
    );

    var xvaluesComp = app.project.items.addComp(
      xvaluesName,
      width,
      height,
      1,
      duration,
      30
    );

    var yvaluesComp = app.project.items.addComp(
      yvaluesName,
      width,
      height,
      1,
      duration,
      30
    );

    var graphsComp = app.project.items.addComp(
      graphsName,
      width,
      height,
      1,
      duration,
      30
    );

    graphAnimComp.layers.add(linesComp);
    graphAnimComp.layers.add(xvaluesComp);
    graphAnimComp.layers.add(yvaluesComp);
    graphAnimComp.layers.add(graphsComp);
    var scaleControlLayer = graphAnimComp.layers.addNull();
    scaleControlLayer.name = "Scale Control";

    graphAnimComp.parentFolder = folder;
    linesComp.parentFolder = folder;
    xvaluesComp.parentFolder = folder;
    yvaluesComp.parentFolder = folder;
    graphsComp.parentFolder = folder;
    scaleControlLayer.parentFolder = folder;

    function createGraphLayers() {
      var graphBaseName = "Graph_Base";

      for (index = 0; index < numOfGraphs; index++) {
        var shapeLayer = graphsComp.layers.addShape();
        shapeLayer.name = graphBaseName + "_" + (index + 1);

        //make Path in Shape in Contents in Shape Layer
        var shapeGroup = shapeLayer
          .property("ADBE Root Vectors Group")
          .addProperty("ADBE Vector Group");
        var shapeGroupContents = shapeGroup.property("ADBE Vectors Group");
        shapeGroupContents.addProperty("ADBE Vector Shape - Group");
        var stroke = shapeGroupContents.addProperty(
          "ADBE Vector Graphic - Stroke"
        );

        stroke.property("ADBE Vector Stroke Color").setValue(graphColor); // Black color
        stroke.property("ADBE Vector Stroke Width").setValue(graphWidth); // Line width
      }
    }

    function zoomGraphs() {
      var layers = graphsComp.layers;
      for (var i = 1; i <= layers.length; i++) {
        var layer = layers[i];

        layer.property("Scale").expression =
          'var scaleControlLayer = comp("' +
          graphName +
          '").layer("Scale Control");\n' +
          "var endScaleValue = scaleControlLayer.scale;\n" +
          "value = endScaleValue;";
      }

      for (var i = 1; i <= layers.length; i++) {
        var layer = layers[i];

        var initialPos = layer.property("Position").value;

        layer.property("Position").expression =
          'var scaleControlLayer = comp("' +
          graphName +
          '").layer("Scale Control");\n' +
          "var endScaleValue = scaleControlLayer.scale;\n" +
          "var scaleFactor = endScaleValue / 100; // Assuming the start scale is 100%\n" +
          "var anchorValueX = scaleControlLayer.anchorPoint[0] + " +
          width / 2 +
          ";\n" +
          "var anchorValueY = scaleControlLayer.anchorPoint[1] + " +
          height / 2 +
          ";\n" +
          "var anchorValue = [" +
          initialPos[0] +
          " - anchorValueX, " +
          initialPos[1] +
          " - anchorValueY];\n" +
          "var moveDistance = [anchorValue[0]*scaleFactor[0], anchorValue[1]*scaleFactor[1]];\n" +
          "value = [moveDistance[0] + anchorValueX, moveDistance[1] + anchorValueY];";
      }
    }

    // Function to create a shape layer with a line
    function createLine(startPoint, endPoint, lineName) {
      var start = [startPoint[0] - width / 2, startPoint[1] - height / 2];
      var end = [endPoint[0] - width / 2, endPoint[1] - height / 2];
      var shapeLayer = graphAnimComp.layers.addShape();
      shapeLayer.name = lineName;
      var shapeGroup = shapeLayer
        .property("ADBE Root Vectors Group")
        .addProperty("ADBE Vector Group");
      var shapeGroupContents = shapeGroup.property("ADBE Vectors Group");
      var pathGroup = shapeGroupContents.addProperty(
        "ADBE Vector Shape - Group"
      );
      var path = pathGroup.property("ADBE Vector Shape");
      var myPath = new Shape();
      myPath.vertices = [start, end];
      path.setValue(myPath);
      var stroke = shapeGroupContents.addProperty(
        "ADBE Vector Graphic - Stroke"
      );
      stroke.property("ADBE Vector Stroke Color").setValue(color); // Black color
      stroke.property("ADBE Vector Stroke Width").setValue(strokeWidth); // Line width
    }

    // Function to create a dotted line shape layer
    function createDottedLine(
      startPoint,
      endPoint,
      lineName,
      dashLength,
      gapLength
    ) {
      // Set default values if they are not provided
      dashLength = dashLength !== undefined ? dashLength : 2;
      gapLength = gapLength !== undefined ? gapLength : 10;

      var start = [startPoint[0] - width / 2, startPoint[1] - height / 2];
      var end = [endPoint[0] - width / 2, endPoint[1] - height / 2];

      var shapeLayer = linesComp.layers.addShape();
      shapeLayer.name = lineName;
      var shapeGroup = shapeLayer
        .property("ADBE Root Vectors Group")
        .addProperty("ADBE Vector Group");
      var shapeGroupContents = shapeGroup.property("ADBE Vectors Group");
      var pathGroup = shapeGroupContents.addProperty(
        "ADBE Vector Shape - Group"
      );
      var path = pathGroup.property("ADBE Vector Shape");
      var myPath = new Shape();
      myPath.vertices = [start, end];
      path.setValue(myPath);
      var stroke = shapeGroupContents.addProperty(
        "ADBE Vector Graphic - Stroke"
      );
      stroke.property("ADBE Vector Stroke Color").setValue(color); // Black color
      stroke.property("ADBE Vector Stroke Width").setValue(strokeWidth); // Line width
      var dashGroup = stroke.property("ADBE Vector Stroke Dashes");
      var dash = dashGroup.addProperty("ADBE Vector Stroke Dash 1");
      dash.setValue(dashLength); // Dash length
      var gap = dashGroup.addProperty("ADBE Vector Stroke Gap 1");
      gap.setValue(gapLength); // Gap length
    }

    //set the stroke not to affected the thickness by zooming
    function keepStrokeWidthConstant(layers, constantWidth) {
      // Add a Slider Control to the "Main" composition for stroke width
      var scaleController = graphAnimComp.layer("Scale Control");
      var sliderControl = scaleController
        .property("Effects")
        .addProperty("ADBE Slider Control");
      sliderControl.name = "Stroke Width Control";
      sliderControl.property("Slider").setValue(constantWidth); // Default stroke width, adjust as needed

      var scaleExpression =
        'targetScale = comp("' +
        graphName +
        '").layer("Scale Control").transform.scale[1] / 100;\n' +
        'initialStrokeWidth = comp("' +
        graphName +
        '").layer("Scale Control").effect("Stroke Width Control")("Slider");\n' +
        "initialStrokeWidth / targetScale;";

      for (var i = 1; i <= layers.length; i++) {
        var layer = layers[i];

        if (layer.property("Contents")) {
          var contents = layer.property("Contents");

          for (var j = 1; j <= contents.numProperties; j++) {
            var shapeGroup = contents.property(j);

            if (shapeGroup.property("Contents")) {
              var shapeContents = shapeGroup.property("Contents");

              for (var k = 1; k <= shapeContents.numProperties; k++) {
                var shapeElement = shapeContents.property(k);

                if (shapeElement.matchName == "ADBE Vector Graphic - Stroke") {
                  var width = shapeElement.property("ADBE Vector Stroke Width");
                  width.expression = scaleExpression;
                }
              }
            }
          }
        }
      }
    }

    function centerAnchorPoint(layer) {
      var comp = layer.containingComp;
      var curTime = comp.time;

      /* find center by bounding box of the layer */
      var y = layer.sourceRectAtTime(curTime, false).height / 2;
      var x = layer.sourceRectAtTime(curTime, false).width / 2;

      /* we need this for text layer */
      y += layer.sourceRectAtTime(curTime, false).top;
      x += layer.sourceRectAtTime(curTime, false).left;

      //set only y anchor point
      layer.anchorPoint.setValue([x, y]);
    }

    function createXText(position, textContent, textName) {
      var textLayer = xvaluesComp.layers.addText(textContent);

      (textProp = textLayer
        .property("ADBE Text Properties")
        .property("ADBE Text Document")),
        (textDoc = textProp.value);
      textDoc.fontSize = fontSize;
      textDoc.fillColor = color;
      textProp.setValue(textDoc);

      centerAnchorPoint(textLayer);
      textLayer.name = textName;
      textLayer.property("Position").setValue(position);

      // // Store the distance in the text layer's comment so it can be accessed later
      textLayer.comment = position[0].toString();
    }

    function createYText(position, textContent, textName) {
      var textLayer = yvaluesComp.layers.addText(textContent);

      (textProp = textLayer
        .property("ADBE Text Properties")
        .property("ADBE Text Document")),
        (textDoc = textProp.value);
      textDoc.fontSize = fontSize;
      textDoc.fillColor = color;
      textProp.setValue(textDoc);

      centerAnchorPoint(textLayer);
      textLayer.name = textName;
      textLayer.property("Position").setValue(position);

      // // Store the distance in the text layer's comment so it can be accessed later
      textLayer.comment =
        position[0].toString() + "##" + position[1].toString();
    }

    function zoomLayer(layer, startScale, endScale, startTime, endTime) {
      var scale = layer.property("Scale");

      // Add start keyframe
      var startKeyframe = scale.addKey(startTime);
      scale.setValueAtKey(startKeyframe, startScale);

      // Add end keyframe
      var endKeyframe = scale.addKey(endTime);
      scale.setValueAtKey(endKeyframe, endScale);
    }

    function zoomXvalues() {
      // Add expression to each text layer
      for (var i = 1; i <= xvaluesComp.numLayers; i++) {
        var layer = xvaluesComp.layer(i);

        var initialPosX = parseFloat(layer.comment.split("##")[0]);

        // Add expression to the Position property
        layer.property("Position").expression =
          'var scaleControlLayer = comp("' +
          graphName +
          '").layer("Scale Control");\n' +
          "var endScaleValue = scaleControlLayer.scale[0];\n" +
          "var scaleFactor = endScaleValue / 100; // Assuming the start scale is 100%\n" +
          "var anchorValue = scaleControlLayer.anchorPoint[0] + " +
          width / 2 +
          ";\n" +
          "var moveDistance = (" +
          initialPosX +
          " - anchorValue) * scaleFactor;\n" +
          "value = [moveDistance + anchorValue, thisLayer.position[1]];";
      }
    }

    function zoomYvalues() {
      // Add expression to each text layer
      for (var i = 1; i <= yvaluesComp.numLayers; i++) {
        var layer = yvaluesComp.layer(i);

        var initialPosY = parseFloat(layer.comment.split("##")[1]);

        // Add expression to the Position property
        layer.property("Position").expression =
          'var scaleControlLayer = comp("' +
          graphName +
          '").layer("Scale Control");\n' +
          "var endScaleValue = scaleControlLayer.scale[1];\n" +
          "var scaleFactor = endScaleValue / 100; // Assuming the start scale is 100%\n" +
          "var anchorValue = scaleControlLayer.anchorPoint[1] + " +
          height / 2 +
          ";\n" +
          "var moveDistance = (" +
          initialPosY +
          " - anchorValue) * scaleFactor;\n" +
          "value = [thisLayer.position[0], moveDistance + anchorValue];";
      }
    }

    function zoomLines() {
      var layers = linesComp.layers;
      for (var i = 1; i <= layers.length; i++) {
        var layer = layers[i];

        layer.property("Scale").expression =
          'var scaleControlLayer = comp("' +
          graphName +
          '").layer("Scale Control");\n' +
          "var endScaleValue = scaleControlLayer.scale;\n" +
          "value = endScaleValue;";
      }

      for (var i = 1; i <= layers.length; i++) {
        var layer = layers[i];

        var initialPos = layer.property("Position").value;

        layer.property("Position").expression =
          'var scaleControlLayer = comp("' +
          graphName +
          '").layer("Scale Control");\n' +
          "var endScaleValue = scaleControlLayer.scale;\n" +
          "var scaleFactor = endScaleValue / 100; // Assuming the start scale is 100%\n" +
          "var anchorValueX = scaleControlLayer.anchorPoint[0] + " +
          width / 2 +
          ";\n" +
          "var anchorValueY = scaleControlLayer.anchorPoint[1] + " +
          height / 2 +
          ";\n" +
          "var anchorValue = [" +
          initialPos[0] +
          " - anchorValueX, " +
          initialPos[1] +
          " - anchorValueY];\n" +
          "var moveDistance = [anchorValue[0]*scaleFactor[0], anchorValue[1]*scaleFactor[1]];\n" +
          "value = [moveDistance[0] + anchorValueX, moveDistance[1] + anchorValueY];";
      }
    }

    // Dimensions
    var compWidth = linesComp.width;
    var compHeight = linesComp.height;

    // Create left vertical line
    createLine(
      [margin, margin],
      [margin, compHeight - margin],
      "Left Vertical Line"
    );

    // Create bottom horizontal line
    createLine(
      [margin, compHeight - margin],
      [compWidth - margin, compHeight - margin],
      "Bottom Horizontal Line"
    );

    if (numberOfMiddleLines == 0) {
      numberOfMiddleLines = yValues.length - 2;
    }

    // Create three horizontal lines spread through
    for (var i = 1; i <= numberOfMiddleLines; i++) {
      var yPos =
        compHeight -
        margin -
        (i * (compHeight - 2 * margin)) / (numberOfMiddleLines + 1);
      createDottedLine(
        [margin, yPos],
        [compWidth - margin, yPos],
        "Horizontal Line " + i
      );
    }

    // Create text layers below the bottom horizontal line
    var textYPos = compHeight - margin + textYPosFromBottomLine; // adjust textHeight as needed
    for (var i = 1; i <= xValues.length; i++) {
      var xPos =
        margin + ((i - 1) * (compWidth - 2 * margin)) / (xValues.length - 1);
      createXText([xPos, textYPos], xValues[i - 1], xValues[i - 1]);
    }

    // Create text layers to the left of the vertical line
    var textXPos = margin - textXPosFromLeftLine; // adjust textXPosFromLeftLine as needed
    for (var i = 1; i <= yValues.length; i++) {
      var yPos =
        compHeight -
        margin -
        ((i - 1) * (compHeight - 2 * margin)) / (yValues.length - 1);
      createYText([textXPos, yPos], yValues[i - 1], yValues[i - 1]);
    }

    createGraphLayers();

    // Apply the zoom effect to the null layer
    zoomLayer(scaleControlLayer, [100, 100], [200, 200], 1, 2);

    zoomLines();
    zoomGraphs();
    zoomXvalues();
    zoomYvalues();
    // xValuesFadeOutWhenOutOfGraphArea();
    keepStrokeWidthConstant(linesComp.layers, strokeWidth);
    keepStrokeWidthConstant(graphsComp.layers, graphWidth);

    // Add the graphAnimComp to the currently opened composition
    var activeComp = app.project.activeItem;
    if (activeComp && activeComp instanceof CompItem) {
      activeComp.layers.add(graphAnimComp);
    } else {
      alert(
        "No active composition found. Click the timeline to make a composition active. Then create graph again."
      );
    }
  }

  function counterUp(start, end) {
    // Create a new text layer with a slider controlling the number counting-up effect with easing

    //check if start and end values are provided
    if (start == undefined || end == undefined) {
      alert("Please provide start and end values for the counting-up effect.");
      return;
    }

    // Get the active composition
    var comp = app.project.activeItem;

    if (comp && comp instanceof CompItem) {
      // Begin undo group
      app.beginUndoGroup("Create Counting Text Layer with Slider and Ease");

      // Create a new text layer
      var textLayer = comp.layers.addText("0");

      // Set up some basic text layer properties (like font size)
      var textProp = textLayer.property("Source Text");
      var textDocument = textProp.value;
      textDocument.fontSize = 100;
      // textDocument.justification = ParagraphJustification.RIGHT_JUSTIFY; // Right-aligned text
      textDocument.justification = ParagraphJustification.CENTER_JUSTIFY; // Center-aligned text

      textProp.setValue(textDocument);

      // Enable 3D layer for the text layer
      textLayer.threeDLayer = true;

      // Rotate the text to create the 3D perspective (looking up-left)
      textLayer.property("Rotation X").setValue(20); // Tilt the text upwards
      textLayer.property("Rotation Y").setValue(30); // Rotate the text to the left

      // Optionally, you can adjust the position to enhance the effect
      textLayer
        .property("Position")
        .setValue([comp.width / 2, comp.height / 2, -500]); // Position in 3D space

      // Add a Slider Control effect to the text layer
      var sliderControl = textLayer.Effects.addProperty("ADBE Slider Control");

      // Set slider keyframes for start and end values
      var slider = sliderControl.property("Slider");
      var startValue = start;
      var endValue = end;
      var duration = 3; // in seconds
      var expression = "";
      var powerFactor = 1;
      if (endValue < 1000000) {
        // Apply the expression to the Source Text property to display the slider's value
        // Check if endValue is greater than 1000000
      } else if (endValue >= 1000000 && endValue < 1000000000000) {
        endValue = Math.sqrt(endValue); // Calculate the square root of endValue
        powerFactor = 2;
      } else if (endValue >= 1000000000000 && endValue < 1000000000000000000) {
        endValue = Math.cbrt(endValue); // Calculate the cube root of endValue
        powerFactor = 3;
      } else if (
        endValue >= 1000000000000000000 &&
        endValue < 1000000000000000000000000
      ) {
        endValue = Math.pow(endValue, 0.25); // Calculate the 4th root of endValue
        powerFactor = 4;
      } else {
        alert("Exceeded the limit end value.");
        endValue = 1000000;
      }

      expression =
        'var number = Math.round(Math.pow(effect("Slider Control")("Slider"), ' +
        powerFactor.toString() +
        "));" +
        'const formatter = new Intl.NumberFormat("en-US");' +
        "const formattedNumber = formatter.format(number);" +
        '"$" + formattedNumber;';

      // Set the slider at startValue at the beginning
      slider.setValueAtTime(comp.time, startValue);
      // Set the slider at endValue after the duration
      slider.setValueAtTime(comp.time + duration, endValue);

      // Apply easing (Easy Ease) to the keyframes
      var easeIn = new KeyframeEase(0, 33); // Ease-in for slowing down at the end
      var easeOut = new KeyframeEase(0, 33); // Ease-out for smooth start (optional)

      // Apply ease-in at the last keyframe to slow down the count at the end
      slider.setTemporalEaseAtKey(2, [easeOut], [easeIn]);

      // Set the expression to the text layer's Source Text property
      textLayer.property("Source Text").expression = expression;

      // End undo group
      app.endUndoGroup();
      showSoftNotification(
        "Counting-up text layer created successfully!",
        2000
      );
    } else {
      alert("Please select or open a composition first.");
    }
  }

  function createDottedLineAnimation() {
    var comp = app.project.activeItem; // Get the active composition
    if (!(comp instanceof CompItem)) {
      alert("Please select a composition first.");
      return;
    }

    app.beginUndoGroup("Create Dotted Line Animation");

    // Create a shape layer
    var shapeLayer = comp.layers.addShape();
    shapeLayer.name = "Dotted Line";

    // Add a shape group to the shape layer
    var shapeGroup = shapeLayer
      .property("Contents")
      .addProperty("ADBE Vector Group");

    // Add a path to the shape group
    var path = shapeGroup
      .property("Contents")
      .addProperty("ADBE Vector Shape - Group");
    var pathShape = path.property("Path");

    // Define the path as a simple line
    var myShape = new Shape();
    myShape.closed = false;
    myShape.vertices = [
      [100, 100],
      [500, 100],
    ]; // Horizontal line from x=100 to x=500
    pathShape.setValue(myShape);

    // Add a stroke to the shape group
    var stroke = shapeGroup
      .property("Contents")
      .addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("Color").setValue([1, 1, 1]); // White color for the stroke
    stroke.property("Stroke Width").setValue(5); // 5px stroke width

    // Set the line join to round to make the dots rounded
    stroke.property("Line Join").setValue(2); // 2 corresponds to Round Join
    stroke.property("Line Cap").setValue(2); // 2 corresponds to Round Join

    // Apply dashes to make the line dotted
    var dashes = stroke
      .property("Dashes")
      .addProperty("ADBE Vector Stroke Dash 1");
    dashes.setValue(10); // Length of dashes
    var gap = stroke.property("Dashes").addProperty("ADBE Vector Stroke Gap 1");
    gap.setValue(10); // Gap between dashes

    // Add a stroke offset to animate the dotted line
    var offset = stroke
      .property("Dashes")
      .addProperty("ADBE Vector Stroke Offset");
    offset.setValue(0); // Initial offset value

    // Animate the stroke offset to create the moving dotted line effect
    offset.setValueAtTime(0, 0);
    offset.setValueAtTime(5, -100); // Animate offset for a moving dotted line effect

    //add trim path to the shape layer and animate it
    var trimPath = shapeLayer
      .property("Contents")
      .addProperty("ADBE Vector Filter - Trim");
    trimPath.property("Start").setValue(0);
    trimPath.property("End").setValue(0);
    trimPath.property("Offset").setValue(0);

    // Animate to show from nothing to full line
    trimPath.property("End").setValueAtTime(0, 0);
    trimPath.property("End").setValueAtTime(0.3, 100);

    //ease the keyframes
    var easeIn = new KeyframeEase(0, 70); // Influence: 50%
    var easeOut = new KeyframeEase(0, 70); // Influence: 50%
    trimPath.property("End").setTemporalEaseAtKey(1, [easeIn], [easeOut]);
    trimPath.property("End").setTemporalEaseAtKey(2, [easeIn], [easeOut]);

    app.endUndoGroup();

    showSoftNotification("Dotted line animation created successfully!", 2000);
  }

  function changeKeyframeVelocity() {
    {
      // Get the active composition
      var comp = app.project.activeItem;

      // Ensure the composition is valid and something is selected
      if (
        comp != null &&
        comp instanceof CompItem &&
        comp.selectedLayers.length > 0
      ) {
        // Loop through selected layers
        for (var i = 0; i < comp.selectedLayers.length; i++) {
          var layer = comp.selectedLayers[i];

          // Check if the layer has selected properties with keyframes
          if (layer.selectedProperties.length > 0) {
            for (var j = 0; j < layer.selectedProperties.length; j++) {
              var prop = layer.selectedProperties[j];

              // Check if the property is keyframed
              if (prop.numKeys > 0) {
                // Loop through selected keyframes
                for (var k = 1; k <= prop.numKeys; k++) {
                  if (prop.keySelected(k)) {
                    // Define custom ease settings
                    var easeIn = new KeyframeEase(0, 70); // Influence: 50%
                    var easeOut = new KeyframeEase(0, 70); // Influence: 50%

                    // Set ease for temporal keyframes (spatial keyframes need separate handling)
                    prop.setTemporalEaseAtKey(k, [easeIn], [easeOut]);

                    // Optional: Adjust spatial tangents for motion paths (if it's a spatial property)
                    // prop.setSpatialTangentsAtKey(k, [50, 50], [-50, -50]);
                  }
                }
              }
            }
          }
        }
        showSoftNotification("Keyframe velocity changed successfully!", 2000);
      } else {
        alert("Please select a layer with keyframes.");
      }
    }
  }

  function centerAnchorPoint(selectedLayer) {
    if (selectedLayer != null) {
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

      selectedLayer.position.setValue([
        layerPos[0] + deltaX,
        layerPos[1] + deltaY,
      ]);

      return selectedLayer;
    } else {
      alert("Please select a layer first.");
    }
  }

  function wrapIt() {
    // Check if there is a selected layer
    if (
      app.project.activeItem &&
      app.project.activeItem.selectedLayers.length > 0
    ) {
      var comp = app.project.activeItem;
      var selectedLayers = comp.selectedLayers; // Get the first selected layer

      // Loop through selected layers
      for (var i = 0; i < selectedLayers.length; i++) {
        var selectedLayer = selectedLayers[i];

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
          selectedLayer.position.setValueAtTime(comp.time, [
            layerPos[0] + deltaX,
            layerPos[1] + deltaY,
          ]);
        } else {
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
        var margin = 20;
        rectPath
          .property("Size")
          .setValue([layerWidth + margin * 2, layerHeight + margin * 2]);

        // Set position behind the selected layer
        shapeLayer.property("Position").setValue([layerPos[0], layerPos[1]]);

        // Add rounded corners
        var roundedCorners = rectGroup
          .property("Contents")
          .addProperty("ADBE Vector Filter - RC");
        roundedCorners.property("Radius").setValue(20); // Adjust corner radius as needed

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
        stroke.property("Stroke Width").setValue(0.0); // Adjust stroke width as needed

        // Add drop shadow effect
        var dropShadow = shapeLayer
          .property("Effects")
          .addProperty("ADBE Drop Shadow");
        dropShadow.property("Opacity").setValue(80); // Adjust shadow opacity
        dropShadow.property("Softness").setValue(7); // Adjust shadow distance
        dropShadow.property("Direction").setValue(135); // Adjust shadow direction
        dropShadow.property("Softness").setValue(7); // Adjust shadow softness

        //check if the threeDLayer property is True on the selected layer
        if (selectedLayer.threeDLayer) {
          // Set the shape layer to be a 3D layer
          shapeLayer.threeDLayer = true;

          //check if the selected layer has a keyframe in orientation property
          if (selectedLayer.property("Orientation").numKeys > 0) {
            // copy the orientation keyframes to the shape
            for (
              var i = 1;
              i <= selectedLayer.property("Orientation").numKeys;
              i++
            ) {
              var keyTime = selectedLayer.property("Orientation").keyTime(i);
              var keyValue = selectedLayer.property("Orientation").keyValue(i);
              shapeLayer
                .property("Orientation")
                .setValueAtTime(keyTime, keyValue);
            }
          } else {
            var orient = selectedLayer.property("Orientation").value;
            shapeLayer.property("Orientation").setValue(orient);
          }
        }

        // Send the shape layer behind the selected layer
        shapeLayer.moveAfter(selectedLayer);

        // check if there is any keyframe on the selected layer in scale, position, rotation, opacity property, if so, copy the keyframes to the shape layer
        var properties = ["Scale", "Position", "Rotation", "Opacity"];
        for (var i = 0; i < properties.length; i++) {
          var property = properties[i];
          var selectedLayerProperty = selectedLayer.property(property);
          var shapeLayerProperty = shapeLayer.property(property);
          if (selectedLayerProperty.numKeys > 0) {
            for (var j = 1; j <= selectedLayerProperty.numKeys; j++) {
              var keyTime = selectedLayerProperty.keyTime(j);
              var keyValue = selectedLayerProperty.keyValue(j);
              shapeLayerProperty.setValueAtTime(keyTime, keyValue);
            }
          } else {
            shapeLayerProperty.setValue(selectedLayerProperty.value);
          }
        }

        // Select both layers
        selectedLayer.selected = true;
        shapeLayer.selected = true;

        // Precompose the selected layers
        var precomp = comp.layers.precompose(
          [selectedLayer.index, shapeLayer.index],
          selectedLayer.name + "_group",
          true
        );

        showSoftNotification("Wrapped the selected layer successfully!", 2000);
      }
    } else {
      alert("Please select a layer first.");
    }
  }

  function popUp() {
    var comp = app.project.activeItem; // Get the active composition
    if (comp && comp instanceof CompItem) {
      var selectedLayers = comp.selectedLayers; // Get the first selected layer

      //loop through all selected layers
      for (var i = 0; i < selectedLayers.length; i++) {
        var selectedLayer = selectedLayers[i];
        if (selectedLayer) {
          app.beginUndoGroup("Apply Pop-up Animation with Bounce");

          // Add scale keyframes for the pop-up effect
          var scaleProperty = selectedLayer.property("Scale");

          // get the current scale value
          var endScale = scaleProperty.value;

          // Set the initial and final scale values (starting small, then popping up)
          var startScale = [0, 0];

          // Time settings
          var startTime = comp.time; // Starting at the current time
          var popUpDuration = 0.3; // 0.5 seconds for the pop-up

          // Apply keyframes for the scale property
          scaleProperty.setValueAtTime(startTime, startScale);
          scaleProperty.setValueAtTime(startTime + popUpDuration, endScale);

          // Apply the provided bounce expression
          var bounceExpression =
            "amp = 0.05;" + // Amplitude
            "freq = 2.0;" + // Frequency
            "decay = 5.0;" + // Decay
            "n = 0;" +
            "if (numKeys > 0){" +
            "n = nearestKey(time).index;" +
            "if (key(n).time > time){" +
            "n--;" +
            "}" +
            "}" +
            "if (n == 0){" +
            "t = 0;" +
            "}else{" +
            "t = time - key(n).time;" +
            "}" +
            "if (n > 0 && t < 1){" +
            "v = velocityAtTime(key(n).time - thisComp.frameDuration / 10);" +
            "value + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);" +
            "}else{" +
            "value;" +
            "}";

          scaleProperty.expression = bounceExpression;

          //add ease to the first keyframe
          var easeIn = new KeyframeEase(0, 100); // Influence: 100%
          var easeOut = new KeyframeEase(0, 100); // Influence: 100%

          //find the nearest keyframe index
          var keyIndex = scaleProperty.nearestKeyIndex(startTime);

          scaleProperty.setTemporalEaseAtKey(
            keyIndex,
            [easeIn, easeIn, easeIn],
            [easeOut, easeOut, easeOut]
          );

          app.endUndoGroup();
          showSoftNotification("Pop-up animation applied successfully!", 2000);
        } else {
          alert("No layer selected. Please select a layer.");
        }
      }
    } else {
      alert("No active composition found. Please open a composition.");
    }
  }

  function scaleUpDown() {
    app.beginUndoGroup("Add Scale Keyframes with Ease");

    // Get the active composition
    var comp = app.project.activeItem;

    // Ensure the composition is valid and a layer is selected
    if (
      comp != null &&
      comp instanceof CompItem &&
      comp.selectedLayers.length > 0
    ) {
      var layer = comp.selectedLayers[0]; // Work with the first selected layer

      // Get the scale property of the selected layer
      var scaleProp = layer
        .property("ADBE Transform Group")
        .property("ADBE Scale");

      // Get the current time
      var currentTime = comp.time;

      // Get the current scale value (array [x, y, z] depending on layer type)
      var currentScale = scaleProp.value;

      // Create the first keyframe at the current time with the current scale
      scaleProp.setValueAtTime(currentTime, currentScale);

      // Calculate the new scale (increase by 5%)
      var secondScale = [
        currentScale[0] * 1.05, // Increase the X scale by 5%
        currentScale[1] * 1.05, // Increase the Y scale by 5%
        currentScale.length > 2
          ? currentScale[2] * 1.05
          : currentScale[0] * 1.05, // Increase Z scale if it exists
      ];

      // Add the second keyframe 300 milliseconds (0.3 seconds) later
      scaleProp.setValueAtTime(currentTime + 0.3, secondScale);

      // Add the last keyframe 600 milliseconds (0.6 seconds) later
      scaleProp.setValueAtTime(currentTime + 0.6, currentScale);

      // Define custom ease settings with 50% influence
      var easeIn = new KeyframeEase(0, 50); // Influence 50% for incoming keyframe
      var easeOut = new KeyframeEase(0, 50); // Influence 50% for outgoing keyframe

      // Find the index of the keyframes
      var firstKeyIndex = scaleProp.nearestKeyIndex(currentTime);
      var secondKeyIndex = scaleProp.nearestKeyIndex(currentTime + 0.3);
      var lastKeyIndex = scaleProp.nearestKeyIndex(currentTime + 0.6);

      // Apply ease to the first and second keyframes
      scaleProp.setTemporalEaseAtKey(
        firstKeyIndex,
        [easeOut, easeOut, easeOut],
        [easeOut, easeOut, easeOut]
      ); // Outgoing ease on first keyframe
      scaleProp.setTemporalEaseAtKey(
        secondKeyIndex,
        [easeIn, easeIn, easeIn],
        [easeIn, easeIn, easeIn]
      ); // Incoming ease on second keyframe
      scaleProp.setTemporalEaseAtKey(
        lastKeyIndex,
        [easeOut, easeOut, easeOut],
        [easeOut, easeOut, easeOut]
      ); // Outgoing ease on last keyframe

      showSoftNotification("Scale keyframes added with ease!", 2000);
    } else {
      alert("Please select a layer.");
    }

    app.endUndoGroup();
  }

  function addWiggle(wiggleFreq, wiggleAmp) {
    // Get the active composition
    var comp = app.project.activeItem;

    // Ensure the composition is valid and something is selected
    if (
      comp != null &&
      comp instanceof CompItem &&
      comp.selectedLayers.length > 0
    ) {
      // Loop through selected layers
      for (var i = 0; i < comp.selectedLayers.length; i++) {
        var layer = comp.selectedLayers[i];

        //add wiggle expression to the selected layer
        var prop = layer.property("Position");

        // Create the looping wiggle expression
        var expression = "wiggle(" + wiggleFreq + ", " + wiggleAmp + ")";

        // Add the expression to the property
        prop.expression = expression;
      }
      showSoftNotification("Wiggle expression added to selected layers!", 2000);
    } else {
      alert("Please select a layer with keyframes in it.");
    }
  }

  function addLoopOut() {
    {
      // Get the active composition
      var comp = app.project.activeItem;

      // Ensure the composition is valid and something is selected
      if (
        comp != null &&
        comp instanceof CompItem &&
        comp.selectedLayers.length > 0
      ) {
        // Loop through selected layers
        for (var i = 0; i < comp.selectedLayers.length; i++) {
          var layer = comp.selectedLayers[i];

          // Function to recursively traverse properties
          function traverseProperties(propertyGroup) {
            for (var j = 1; j <= propertyGroup.numProperties; j++) {
              var prop = propertyGroup.property(j);
              if (prop instanceof PropertyGroup) {
                // Recursively traverse nested property groups
                traverseProperties(prop);
              } else if (prop.numKeys > 0) {
                // Add expression "loopOut()" to the keyframed property
                prop.expression = "loopOut()";
              }
            }
          }

          // Start traversing from the layer's root property group
          traverseProperties(layer);
        }
        showSoftNotification(
          "LoopOut expression added to selected layers!",
          2000
        );
      } else {
        alert("Please select a layer with keyframes in it.");
      }
    }
  }

  function removeBlackBG() {
    // Get the active composition
    var comp = app.project.activeItem;

    // Ensure the composition is valid and something is selected
    if (
      comp != null &&
      comp instanceof CompItem &&
      comp.selectedLayers.length > 0
    ) {
      // Loop through selected layers
      for (var i = 0; i < comp.selectedLayers.length; i++) {
        var layer = comp.selectedLayers[i];

        //apply shift channels to remove black background
        var shiftChannels = layer.Effects.addProperty("ADBE Shift Channels");
        shiftChannels.property(1).setValue(2);
        shiftChannels.property(2).setValue(2);
        shiftChannels.property(3).setValue(2);
        shiftChannels.property(4).setValue(2);
      }
      showSoftNotification("black removed!", 2000);
    } else {
      alert("Please select a layer with keyframes in it.");
    }
  }

  function wrapItToon() {
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
        selectedLayer.position.setValueAtTime(comp.time, [
          layerPos[0] + deltaX,
          layerPos[1] + deltaY,
        ]);
      } else {
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
      shadowLayer
        .property("Position")
        .setValue([layerPos[0] + 30, layerPos[1] + 30]);

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
        if (selectedLayer.property("Orientation").numKeys > 0) {
          // copy the orientation keyframes to the shape
          for (
            var i = 1;
            i <= selectedLayer.property("Orientation").numKeys;
            i++
          ) {
            var keyTime = selectedLayer.property("Orientation").keyTime(i);
            var keyValue = selectedLayer.property("Orientation").keyValue(i);
            shapeLayer
              .property("Orientation")
              .setValueAtTime(keyTime, keyValue);
            shadowLayer
              .property("Orientation")
              .setValueAtTime(keyTime, keyValue);
          }
        } else {
          var orient = selectedLayer.property("Orientation").value;
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
        } else {
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

  function camera3D() {
    var comp = app.project.activeItem; // Get the active composition
    if (comp && comp instanceof CompItem) {
      // Check if there is an active composition
      var selectedLayers = comp.selectedLayers; // Get the selected layers in the comp
      if (selectedLayers.length > 1) {
        // Check if more than one layer is selected
        app.beginUndoGroup("Fit Layers, Set 3D Z Position, and Add Camera"); // Begin undo group

        var compWidth = comp.width; // Get composition width
        var compHeight = comp.height; // Get composition height

        // First, scale each layer to fit the composition frame without changing aspect ratio
        for (var i = 0; i < selectedLayers.length; i++) {
          var layer = selectedLayers[i];

          // Enable 3D layer if not already
          if (!layer.threeDLayer) {
            layer.threeDLayer = true; // Enable 3D for the layer
          }

          var layerWidth = layer.width;
          var layerHeight = layer.height;
          var scaleFactor =
            Math.min(compWidth / layerWidth, compHeight / layerHeight) * 1.5; // 1.5 times to comp

          layer
            .property("Scale")
            .setValue([scaleFactor * 100, scaleFactor * 100, 100]); // Apply uniform scale
        }

        // Now, apply Z positioning for 3D layers
        var numLayers = selectedLayers.length;
        var totalDistance = (numLayers - 1) * 500; // Calculate total Z distance based on layers count
        var startZ = -totalDistance / 2; // Starting Z position

        for (var i = 0; i < numLayers; i++) {
          var layer = selectedLayers[i];
          var currentPosition = layer.property("Position").value;
          var newPosition = [
            currentPosition[0],
            currentPosition[1],
            startZ + i * 500,
          ]; // Set Z position with equal distance
          layer.property("Position").setValue(newPosition); // Apply new Z position
        }

        // Add Camera at the top of the layer stack
        var cameraName = "3D Camera";
        var camera = comp.layers.addCamera(cameraName, [
          compWidth / 2,
          compHeight / 2,
        ]); // Add a camera at the center of the comp
        camera.moveToBeginning(); // Move the camera to the top of the layer stack

        // Set camera depth of field properties
        camera
          .property("Camera Options")
          .property("depthOfField")
          .setValue(true); // Enable depth of field
        camera.property("Camera Options").property("aperture").setValue(2000); // Set aperture

        // get default camera zoom value
        var zoom = camera.property("Zoom").value;

        // Camera position set to the center of the comp and same distance as the zoomed out layers
        var cameraPosition = camera
          .property("Position")
          .setValue([compWidth / 2, compHeight * 0.95, -zoom]);

        // add keyframes to camera position
        camera
          .property("Position")
          .setValueAtTime(comp.time, [compWidth / 2, compHeight * 0.95, -zoom]);
        camera
          .property("Position")
          .setValueAtTime(comp.time + 5, [
            compWidth / 2,
            compHeight * 0.05,
            -zoom,
          ]);

        // Animate focus distance to match Z positions of the layers
        var focusDistance = camera
          .property("Camera Options")
          .property("focusDistance");

        var easeIn = new KeyframeEase(0, 70); // Influence: 50%
        var easeOut = new KeyframeEase(0, 70); // Influence: 50%

        for (var i = 0; i < numLayers; i++) {
          var layer = selectedLayers[i];
          var zPosition = layer.property("Position").value[2]; // Get Z position of the layer

          var keyTime = comp.time + i; // Set keyframes spaced by 1 second apart
          focusDistance.setValueAtTime(keyTime, zoom - zPosition); // Set focus distance keyframe
          // add ease to keyframes
          focusDistance.setTemporalEaseAtKey(i + 1, [easeIn], [easeOut]);
        }

        // add zoom keyframes
        camera
          .property("Zoom")
          .setValueAtTime(comp.time, zoom + totalDistance / 2);
        camera
          .property("Zoom")
          .setValueAtTime(comp.time + numLayers - 1, zoom - totalDistance / 2);

        // add ease to keyframes
        camera.property("Zoom").setTemporalEaseAtKey(1, [easeIn], [easeOut]);
        camera.property("Zoom").setTemporalEaseAtKey(2, [easeIn], [easeOut]);

        app.endUndoGroup(); // End undo group
      } else {
        alert("Please select more than one layer to animate.");
      }
    } else {
      alert("Please select a composition.");
    }
  }

  function blur50() {
    //blur 50% on the selected layer
    //first check if there is selected layer
    if (
      !app.project.activeItem ||
      !app.project.activeItem.selectedLayers.length
    ) {
      alert("Please select a layer");
      return;
    }
    var selectedLayer = app.project.activeItem.selectedLayers;
    //loop through the selected layers
    for (var i = 0; i < selectedLayer.length; i++) {
      var blur = selectedLayer[i]
        .property("Effects")
        .addProperty("ADBE Gaussian Blur 2");
      blur.property("Blurriness").setValue(50); // Adjust blur amount
    }
  }

  function shadow() {
    // check if there is selected layer
    if (
      !app.project.activeItem ||
      !app.project.activeItem.selectedLayers.length
    ) {
      alert("Please select a layer");
      return;
    }

    //add shadow to the selected layer
    var selectedLayer = app.project.activeItem.selectedLayers;

    //loop through the selected layers
    for (var i = 0; i < selectedLayer.length; i++) {
      var dropShadow = selectedLayer[i]
        .property("Effects")
        .addProperty("ADBE Drop Shadow");
      dropShadow.property("Opacity").setValue(80); // Adjust shadow opacity
      dropShadow.property("Softness").setValue(7); // Adjust shadow distance
      dropShadow.property("Direction").setValue(135); // Adjust shadow direction
      dropShadow.property("Softness").setValue(7); // Adjust shadow softness
    }
  }

  function makeSignsSmaller() {
    var comp = app.project.activeItem; // Get the active composition
    if (comp && comp instanceof CompItem) {
      // Check if there is an active composition
      var selectedLayers = comp.selectedLayers; // Get the selected layers in the comp
      if (selectedLayers.length > 0) {
        app.beginUndoGroup("Move Special Characters to New Layer"); // Begin undo group

        for (var i = 0; i < selectedLayers.length; i++) {
          var layer = selectedLayers[i];

          if (layer instanceof TextLayer) {
            // Check if the layer is a text layer
            var textProp = layer.property("Source Text");
            var textDocument = textProp.value; // Get the current text document
            var originalText = textDocument.text; // Get the text from the text document

            var hasDollar = originalText.indexOf("$") === 0; // Check if the text starts with '$'
            var hasPercent =
              originalText.lastIndexOf("%") === originalText.length - 1; // Check if the text ends with '%'

            if (hasDollar || hasPercent) {
              var specialChar = ""; // The character we'll move
              var newText = originalText; // The new text without special characters

              // Determine if we need to move a '$' or a '%'
              if (hasDollar) {
                specialChar = "$";
                newText = originalText.substring(1); // Remove '$' from the text
              } else if (hasPercent) {
                specialChar = "%";
                newText = originalText.slice(0, -1); // Remove '%' from the text
              }

              // Update the original layer text by removing the special character
              textDocument.text = newText;
              textProp.setValue(textDocument);

              // Duplicate the original layer
              var newLayer = layer.duplicate();

              // Modify the duplicated layer's text to only contain the special character
              var newLayerTextProp = newLayer.property("Source Text");
              var newLayerTextDocument = newLayerTextProp.value;
              newLayerTextDocument.text = specialChar;
              newLayerTextProp.setValue(newLayerTextDocument);

              // Scale the duplicated layer to 70% of the original size
              var originalScale = layer.property("Scale").value;
              newLayer
                .property("Scale")
                .setValue([originalScale[0] * 0.7, originalScale[1] * 0.7]);
            }

            //get position of new composition from the original layer.
            var originalPosition = layer.property("Position").value;
            var originalLayerWidth = layer.sourceRectAtTime(
              comp.time,
              false
            ).width;
            var originalLayerHeight = layer.sourceRectAtTime(
              comp.time,
              false
            ).height;
            var newLayerWidth = newLayer.sourceRectAtTime(
              comp.time,
              false
            ).width;
            //create a new composition.
            var newComp = app.project.items.addComp(
              "adjusted_" + originalText,
              Math.round(originalLayerWidth * 2),
              Math.round(originalLayerHeight * 2),
              comp.pixelAspect,
              comp.duration,
              comp.frameRate
            );

            // Set the new layer position
            if (hasDollar) {
              layer
                .property("Position")
                .setValue([
                  newComp.width / 2 + newLayerWidth / 2,
                  newComp.height / 2,
                ]);
              // Place the new layer on the left of the original text
              newLayer
                .property("Position")
                .setValue([
                  newComp.width / 2 - originalLayerWidth / 2,
                  newComp.height / 2,
                ]);
            } else if (hasPercent) {
              layer
                .property("Position")
                .setValue([
                  newComp.width / 2 - newLayerWidth / 2,
                  newComp.height / 2,
                ]);
              // Place the new layer on the right of the original text
              newLayer
                .property("Position")
                .setValue([
                  newComp.width / 2 + originalLayerWidth / 2,
                  newComp.height / 2,
                ]);
            }

            layer.copyToComp(newComp);
            newLayer.copyToComp(newComp);

            //set the position of new composition with original position.
            var newCompLayer = comp.layers.add(newComp);
            newCompLayer.property("Position").setValue(originalPosition);

            //delete the original layer and new layer.
            layer.remove();
            newLayer.remove();
          }
        }

        app.endUndoGroup(); // End undo group
      } else {
        alert("Please select at least one text layer.");
      }
    } else {
      alert("Please select a composition.");
    }
  }

  /**
   *  UI for AE-Expressions
   */
  function createUI(thisObj) {
    /*
        Code for Import https://scriptui.joonas.me — (Triple click to select): 
        {"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":null,"windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":true},"text":"Dialog","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"]}},"item-2":{"id":2,"type":"Button","parentId":7,"style":{"enabled":true,"varName":"changeKeyframeVelocity","text":"Change Keyframe Velocity","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-5":{"id":5,"type":"Button","parentId":11,"style":{"enabled":true,"varName":null,"text":"Counter","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-6":{"id":6,"type":"TabbedPanel","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":10,"alignment":null,"selection":8}},"item-7":{"id":7,"type":"Tab","parentId":6,"style":{"enabled":true,"varName":null,"text":"Anim","orientation":"column","spacing":10,"alignChildren":["left","top"]}},"item-8":{"id":8,"type":"Tab","parentId":6,"style":{"enabled":true,"varName":null,"text":"Create","orientation":"column","spacing":10,"alignChildren":["left","top"]}},"item-9":{"id":9,"type":"EditText","parentId":11,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":true,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"Start","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-10":{"id":10,"type":"EditText","parentId":11,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":true,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"End","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-11":{"id":11,"type":"Group","parentId":8,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-12":{"id":12,"type":"Tab","parentId":6,"style":{"enabled":true,"varName":null,"text":"Graph","orientation":"column","spacing":10,"alignChildren":["left","top"]}},"item-15":{"id":15,"type":"Button","parentId":8,"style":{"enabled":true,"varName":null,"text":"Dotted Line","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-16":{"id":16,"type":"Button","parentId":12,"style":{"enabled":true,"varName":null,"text":"Create Graph","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-17":{"id":17,"type":"Group","parentId":19,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-18":{"id":18,"type":"Divider","parentId":7,"style":{"enabled":true,"varName":null}},"item-19":{"id":19,"type":"Button","parentId":7,"style":{"enabled":true,"varName":null,"text":"\bLoop It!","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-20":{"id":20,"type":"Divider","parentId":7,"style":{"enabled":true,"varName":null}},"item-21":{"id":21,"type":"Button","parentId":7,"style":{"enabled":true,"varName":null,"text":"Pop Up!","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-22":{"id":22,"type":"Divider","parentId":7,"style":{"enabled":true,"varName":null}},"item-23":{"id":23,"type":"Button","parentId":7,"style":{"enabled":true,"varName":null,"text":"Scale Up! and Down!","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}}},"order":[0,6,7,2,18,19,20,21,22,23,8,11,9,10,5,17,15,12,16],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"None"},"activeId":8}
        */

    // DIALOG
    // ======
    var dialog =
      thisObj instanceof Panel
        ? thisObj
        : new Window("palette", undefined, undefined, { resizeable: true });
    dialog.text = "Rainvic's AE Tools V" + version;
    dialog.alignChildren = ["center", "top"];
    // fill available space
    dialog.orientation = "column";
    dialog.spacing = 10;
    dialog.margins = 12;

    // TPANEL1
    // =======
    var tpanel1 = dialog.add("tabbedpanel", undefined, undefined, {
      name: "tpanel1",
    });
    tpanel1.alignChildren = "fill";
    tpanel1.alignment = "fill"; // Make tpanel1 fill the available space
    tpanel1.margins = 0;

    // TAB1
    // ====
    var tab1 = tpanel1.add("tab", undefined, undefined, { name: "tab1" });
    tab1.text = "Anim";
    tab1.orientation = "column";
    tab1.alignChildren = ["left", "top"];
    tab1.spacing = 10;
    tab1.margins = 10;

    var changeKeyframeVelocityBtn = tab1.add("button", undefined, undefined, {
      name: "changeKeyframeVelocity",
    });
    changeKeyframeVelocityBtn.text = "Change Keyframe Velocity";
    changeKeyframeVelocityBtn.onClick = changeKeyframeVelocity;

    var divider1 = tab1.add("panel", undefined, undefined, {
      name: "divider1",
    });
    divider1.alignment = "fill";

    var button1 = tab1.add("button", undefined, undefined, { name: "button1" });
    button1.text = "Loop It!";
    button1.onClick = addLoopOut;

    var divider2 = tab1.add("panel", undefined, undefined, {
      name: "divider2",
    });
    divider2.alignment = "fill";

    var button2 = tab1.add("button", undefined, undefined, { name: "button2" });
    button2.text = "Pop Up!";
    button2.onClick = popUp;

    var divider3 = tab1.add("panel", undefined, undefined, {
      name: "divider3",
    });
    divider3.alignment = "fill";

    var button3 = tab1.add("button", undefined, undefined, { name: "button3" });
    button3.text = "Scale Up! and Down!";
    button3.onClick = scaleUpDown;

    var divider4 = tab1.add("panel", undefined, undefined, {
      name: "divider4",
    });
    divider4.alignment = "fill";

    var threeDButton = tab1.add("button", undefined, undefined, {
      name: "threeDButton",
    });
    threeDButton.text = "3D Camera";
    threeDButton.onClick = camera3D;

    var wiggleGroup = tab1.add("group", undefined, { name: "wiggleGroup" });
    wiggleGroup.orientation = "row";
    wiggleGroup.alignChildren = ["left", "center"];
    wiggleGroup.spacing = 10;
    wiggleGroup.margins = 0;

    var button4 = wiggleGroup.add("button", undefined, undefined, {
      name: "button4",
    });
    button4.text = "Wiggle!";
    button4.onClick = function () {
      addWiggle(freqOfWiggle.text, ampOfWiggle.text);
    };

    var freqGroup = wiggleGroup.add("group", undefined, { name: "freqGroup" });
    freqGroup.orientation = "column";
    freqGroup.alignChildren = ["center", "center"];
    freqGroup.spacing = 0;
    freqGroup.margins = 0;

    var freqLabel = freqGroup.add("statictext", undefined, undefined, {
      name: "freqLabel",
    });
    freqLabel.text = "Frequency";
    freqLabel.fontSize = 9;
    freqLabel.color = [0.5, 0.5, 0.5];

    var freqOfWiggle = freqGroup.add(
      'edittext {properties: {name: "freqOfWiggle", scrollable: true}}'
    );
    freqOfWiggle.text = "1";
    freqOfWiggle.preferredSize.width = 50;

    var ampGroup = wiggleGroup.add("group", undefined, { name: "ampGroup" });
    ampGroup.orientation = "column";
    ampGroup.alignChildren = ["center", "center"];
    ampGroup.spacing = 0;
    ampGroup.margins = 0;

    var ampLabel = ampGroup.add("statictext", undefined, undefined, {
      name: "ampLabel",
    });
    ampLabel.text = "Amplitude";
    ampLabel.fontSize = 9;
    ampLabel.color = [0.5, 0.5, 0.5];

    var ampOfWiggle = ampGroup.add(
      'edittext {properties: {name: "ampOfWiggle", scrollable: true}}'
    );
    ampOfWiggle.text = "10";
    ampOfWiggle.preferredSize.width = 50;

    // TAB_effects
    var tabEffects = tpanel1.add("tab", undefined, undefined, {
      name: "tabEffects",
    });
    tabEffects.text = "Effects";
    tabEffects.orientation = "column";
    tabEffects.alignChildren = ["left", "top"];
    tabEffects.spacing = 10;
    tabEffects.margins = 10;

    // remove black background
    var removeBlackBackground = tabEffects.add("button", undefined, undefined, {
      name: "removeBlackBackground",
    });
    removeBlackBackground.text = "Remove Black Background";
    removeBlackBackground.onClick = removeBlackBG;

    // make signs smaller
    var makeSignsSmallerButton = tabEffects.add(
      "button",
      undefined,
      undefined,
      {
        name: "makeSignsSmallerButton",
      }
    );
    makeSignsSmallerButton.text = "Small $ %";
    makeSignsSmallerButton.onClick = makeSignsSmaller;

    // blur 50%
    var blur50Button = tabEffects.add("button", undefined, undefined, {
      name: "blur50Button",
    });
    blur50Button.text = "Blur 50%";
    blur50Button.onClick = blur50;

    // add shadow
    var shadowButton = tabEffects.add("button", undefined, undefined, {
      name: "shadowButton",
    });
    shadowButton.text = "Shadow";
    shadowButton.onClick = shadow;

    // TAB2
    // ====
    var tab2 = tpanel1.add("tab", undefined, undefined, { name: "tab2" });
    tab2.text = "Create";
    tab2.orientation = "column";
    tab2.alignChildren = ["left", "top"];
    tab2.spacing = 10;
    tab2.margins = 10;

    // GROUP1
    // ======
    var group1 = tab2.add("group", undefined, { name: "group1" });
    group1.orientation = "column";
    group1.alignChildren = ["left", "center"];
    group1.alignment = "fill";
    group1.spacing = 10;
    group1.margins = 0;

    var startGroup = group1.add("group", undefined, { name: "startGroup" });
    startGroup.orientation = "row";
    startGroup.alignChildren = ["left", "center"];
    startGroup.spacing = 10;
    startGroup.margins = 0;

    var slider1 = startGroup.add("slider", undefined, 0, 0, 100);
    slider1.preferredSize.width = 150;
    slider1.value = 0;
    slider1.onChanging = function () {
      edittext1.text = Math.round(slider1.value).toString();
    };

    var edittext1 = startGroup.add(
      'edittext {properties: {name: "edittext1", scrollable: true}}'
    );
    edittext1.text = "0";
    edittext1.preferredSize.width = 50;

    var endGroup = group1.add("group", undefined, { name: "endGroup" });
    endGroup.orientation = "row";
    endGroup.alignChildren = ["left", "center"];
    endGroup.spacing = 10;
    endGroup.margins = 0;

    var edittext2 = endGroup.add(
      'edittext {properties: {name: "edittext2", scrollable: true}}'
    );
    edittext2.text = "100";
    edittext2.preferredSize.width = 50;

    var slider2 = endGroup.add("slider", undefined, 100, 0, 100);
    slider2.preferredSize.width = 150;
    slider2.value = 100;
    slider2.onChanging = function () {
      edittext2.text = Math.round(slider2.value).toString();
    };

    var button4 = group1.add("button", undefined, undefined, {
      name: "button4",
    });
    button4.text = "Counter";
    button4.onClick = function () {
      counterUp(edittext1.text, edittext2.text);
    };

    var divider4 = tab2.add("panel", undefined, undefined, {
      name: "divider4",
    });
    divider4.alignment = "fill";

    // TAB2
    // ====
    var button5 = tab2.add("button", undefined, undefined, { name: "button5" });
    button5.text = "Dotted Line";
    button5.onClick = createDottedLineAnimation;

    var divider5 = tab2.add("panel", undefined, undefined, {
      name: "divider5",
    });
    divider5.alignment = "fill";

    var wrapItGroup = tab2.add("group", undefined, { name: "wrapItGroup" });
    wrapItGroup.orientation = "row";
    wrapItGroup.alignChildren = ["left", "center"];
    wrapItGroup.spacing = 10;
    wrapItGroup.margins = 0;

    var wrapItButton = wrapItGroup.add("button", undefined, undefined, {
      name: "wrapItButton",
    });
    wrapItButton.text = "Wrap It!";
    wrapItButton.onClick = wrapIt;

    var wrapItToonButton = wrapItGroup.add("button", undefined, undefined, {
      name: "wrapItToonButton",
    });
    wrapItToonButton.text = "Wrap Toon!";
    wrapItToonButton.onClick = wrapItToon;

    // TAB3
    // ====
    var tab3 = tpanel1.add("tab", undefined, undefined, { name: "tab3" });
    tab3.text = "Graph";
    tab3.orientation = "column";
    tab3.alignChildren = ["left", "top"];
    tab3.spacing = 10;
    tab3.margins = 10;

    // TPANEL1
    // =======
    tpanel1.selection = tab2;

    //add xValues panel
    var xValuesPanel = tab3.add("panel", undefined, undefined, {
      name: "xValuesPanel",
    });
    xValuesPanel.text = "X Values(Start | End | Step)";
    xValuesPanel.orientation = "row";
    xValuesPanel.alignChildren = ["left", "center"];
    xValuesPanel.spacing = 10;
    xValuesPanel.margins = 0;

    //edittext for xStart
    var xStartEdittext = xValuesPanel.add(
      'edittext {properties: {name: "xStartEdittext", scrollable: true}}'
    );
    xStartEdittext.text = "0";
    xStartEdittext.preferredSize.width = 50;

    //edittext for xEnd
    var xEndEdittext = xValuesPanel.add(
      'edittext {properties: {name: "xEndEdittext", scrollable: true}}'
    );
    xEndEdittext.text = "10";
    xEndEdittext.preferredSize.width = 50;

    //edittext for xStep
    var xStepEdittext = xValuesPanel.add(
      'edittext {properties: {name: "xStepEdittext", scrollable: true}}'
    );
    xStepEdittext.text = "1";
    xStepEdittext.preferredSize.width = 50;

    //add yValues panel
    var yValuesPanel = tab3.add("panel", undefined, undefined, {
      name: "yValuesPanel",
    });
    yValuesPanel.text = "Y Values(Start | End | Step)";
    yValuesPanel.orientation = "row";
    yValuesPanel.alignChildren = ["left", "center"];
    yValuesPanel.spacing = 10;
    yValuesPanel.margins = 0;

    //edittext for yStart
    var yStartEdittext = yValuesPanel.add(
      'edittext {properties: {name: "yStartEdittext", scrollable: true}}'
    );
    yStartEdittext.text = "0";
    yStartEdittext.preferredSize.width = 50;

    //edittext for yEnd
    var yEndEdittext = yValuesPanel.add(
      'edittext {properties: {name: "yEndEdittext", scrollable: true}}'
    );
    yEndEdittext.text = "100";
    yEndEdittext.preferredSize.width = 50;

    //edittext for yStep
    var yStepEdittext = yValuesPanel.add(
      'edittext {properties: {name: "yStepEdittext", scrollable: true}}'
    );
    yStepEdittext.text = "10";
    yStepEdittext.preferredSize.width = 50;

    var button6 = tab3.add("button", undefined, undefined, { name: "button6" });
    button6.text = "Create Graph";
    button6.onClick = function () {
      createGraph(
        parseInt(xStartEdittext.text),
        parseInt(xEndEdittext.text),
        parseInt(xStepEdittext.text),
        parseInt(yStartEdittext.text),
        parseInt(yEndEdittext.text),
        parseInt(yStepEdittext.text),
        200,
        4,
        20,
        [0, 0, 0],
        10,
        [0, 0, 0],
        300
      );
    };

    dialog.layout.layout(true);

    return dialog;
  }

  // If running as a dockable panel in After Effects
  var myScriptUIPanel = createUI(this);

  if (myScriptUIPanel instanceof Window) {
    myScriptUIPanel.center();
    myScriptUIPanel.show();
  }
}
