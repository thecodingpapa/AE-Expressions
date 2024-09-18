function counterUp(){
    // Create a new text layer with a slider controlling the number counting-up effect with easing

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
        textLayer.property("Position").setValue([comp.width / 2, comp.height / 2, -500]); // Position in 3D space



        // Add a Slider Control effect to the text layer
        var sliderControl = textLayer.Effects.addProperty("ADBE Slider Control");

        // Set slider keyframes for start and end values
        var slider = sliderControl.property("Slider");
        var startValue = 0;
        var endValue = 100;
        var duration = 3; // in seconds

        // Set the slider at startValue at the beginning
        slider.setValueAtTime(comp.time, startValue);    
        // Set the slider at endValue after the duration
        slider.setValueAtTime(comp.time + duration, endValue); 

        // Apply easing (Easy Ease) to the keyframes
        var easeIn = new KeyframeEase(0, 33);  // Ease-in for slowing down at the end
        var easeOut = new KeyframeEase(0, 33); // Ease-out for smooth start (optional)
        
        // Apply ease-in at the last keyframe to slow down the count at the end
        slider.setTemporalEaseAtKey(2, [easeOut], [easeIn]);

        // Apply the expression to the Source Text property to display the slider's value
        var expression = 
        'var number = Math.round(Math.pow(effect("Slider Control")("Slider"), 2)*3);'+
        'const formatter = new Intl.NumberFormat("en-US");'+
        'const formattedNumber = formatter.format(number);'+
        '"$" + formattedNumber;';

        // Set the expression to the text layer's Source Text property
        textLayer.property("Source Text").expression = expression;

        // End undo group
        app.endUndoGroup();
    } else {
        alert("Please select or open a composition first.");
    }
}

counterUp();