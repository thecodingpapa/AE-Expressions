{
    start = 0; // Start value for the counting-up effect
    end = 1000000; // End value for the counting-up effect
    // Create a new text layer with a slider controlling the number counting-up effect with easing

    //check if start and end values are provided
    if (start == undefined || end == undefined) {
      alert("Please provide start and end values for the counting-up effect.");
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
      'var number = Math.round(Math.pow(effect("Slider Control")("Slider"), '+powerFactor.toString()+'));' +
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
    } else {
      alert("Please select or open a composition first.");
    }}