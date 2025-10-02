{
    var comp = app.project.activeItem;

    if (!(comp && comp instanceof CompItem)) {
        alert("Please select an active composition.");
    }

    // Prompt user to select an SRT file
    var srtFile = File.openDialog("Select an SRT file");

    if (srtFile != null) {
        srtFile.open("r");
        var srtContents = srtFile.read();
        srtFile.close();

        // Parse the SRT file
        var captions = parseSRT(srtContents);

        app.beginUndoGroup("Generate Captions from SRT");

        // Create a new composition with the same duration as the SRT file
        var newComp = app.project.items.addComp("Captions", comp.width, comp.height, comp.pixelAspect, comp.duration, comp.frameRate);
        
        // add new comp to the project
        comp.layers.add(newComp);

        // Create text layers for each caption
        for (var i = 0; i < captions.length; i++) {
            var caption = captions[i];

            // Create a new text layer
            var textLayer = newComp.layers.addText(caption.text);

            // Set the start and end time of the text layer
            textLayer.inPoint = caption.start;
            textLayer.outPoint = caption.end;


            // Adjust text layer position if necessary (optional)
            var textProp = textLayer.property("ADBE Text Properties").property("ADBE Text Document");
            var textDocument = textProp.value;
            textDocument.fontSize = 50; // Set font size to 50
            textDocument.justification = ParagraphJustification.CENTER_JUSTIFY; // Center align text
            textProp.setValue(textDocument);

            // Optionally position the text at the bottom of the composition
            var textTransform = textLayer.property("Transform");
            textTransform.property("Position").setValue([comp.width / 2, comp.height - 100]); // Centered horizontally, 100px from the bottom

        }




        app.endUndoGroup();
    } else {
        alert("No SRT file selected.");
    }

    // Function to parse SRT file content
    function parseSRT(data) {
        var captions = [];
        var regex = /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n\n|\n$)/g;
        var match;

        while ((match = regex.exec(data)) !== null) {
            var start = timeToSeconds(match[2]);
            var end = timeToSeconds(match[3]);
            var text = match[4].replace(/\n/g, " "); // Replace new lines with spaces for AE

            captions.push({
                start: start,
                end: end,
                text: text
            });
        }

        return captions;
    }

    // Convert SRT time format to seconds
    function timeToSeconds(time) {
        var parts = time.split(":");
        var seconds = parseFloat(parts[2].replace(",", "."));
        var minutes = parseInt(parts[1], 10) * 60;
        var hours = parseInt(parts[0], 10) * 3600;

        return hours + minutes + seconds;
    }
}