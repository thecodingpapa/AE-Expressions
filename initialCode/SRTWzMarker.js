// Import the File and read SRT data
function importSRTFile() {
    var srtFile = File.openDialog('Select an SRT file');
    if (!srtFile) return null;
    srtFile.open('r');
    var srtData = srtFile.read();
    srtFile.close();
    return srtData;
}

// Parse SRT data to extract timing and text information
function parseSRT(srtData) {
    var srtPattern = /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n\n|\n$)/g;
    var matches;
    var subtitles = [];

    while ((matches = srtPattern.exec(srtData)) !== null) {
        var startTime = parseTime(matches[2]);
        var endTime = parseTime(matches[3]);
        var text = formatSubtitleText(matches[4].replace(/\n/g, " ")); // Merge multiline subtitles
        subtitles.push({ time: startTime, endTime: endTime, text: text });
    }
    return subtitles;
}


// Function to format subtitle text with line breaks if over 90 characters
function formatSubtitleText(text) {
    var maxLength = 90;
    var formattedText = '';
    var words = text.split(' ');
    var line = '';

    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        
        // Check if adding this word would exceed the maxLength
        if ((line + ' ' + word).length > maxLength) {
            // Insert line break at the last space/comma if possible
            formattedText += line.replace(/^\s+|\s+$/g, '') + '\r';
            line = word;
        } else {
            // Add the word to the current line
            line += ' ' + word;
        }
    }
    formattedText += line.replace(/^\s+|\s+$/g, ''); // Add any remaining text

    return formattedText;
}

// Convert SRT timestamp to seconds
function parseTime(srtTime) {
    var timeParts = srtTime.split(/[:,]/);
    var hours = parseFloat(timeParts[0]);
    var minutes = parseFloat(timeParts[1]);
    var seconds = parseFloat(timeParts[2]);
    var milliseconds = parseFloat(timeParts[3]);
    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}

// Main function to create text layer and markers
function createTextLayerWithMarkers() {
    var srtData = importSRTFile();
    if (!srtData) {
        alert('No file selected or invalid file.');
        return;
    }

    var subtitles = parseSRT(srtData);
    if (subtitles.length === 0) {
        alert('Failed to parse SRT data.');
        return;
    }

    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert('Please select or open a composition.');
        return;
    }

    app.beginUndoGroup('Create Text Layer with Markers');

    var textLayer = comp.layers.addText(''); // Empty text layer

    var textDoc = textLayer.property('Source Text').value;

    // Set "All Fills Over All Strokes" option and other styling
    textDoc.applyFill = true;
    textDoc.applyStroke = true;
    textDoc.fillColor = [1, 1, 1]; // White fill
    textDoc.strokeColor = [0, 0, 0]; // Black stroke
    textDoc.strokeWidth = 30;
    textDoc.fontSize = 60;
    textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
    textDoc.tracking = 0;

    // Apply the modified text document with All Fills Over All Strokes enabled
    textLayer.property('Source Text').setValue(textDoc);

    var markerProperty = textLayer.property('Marker');

    // Create markers based on subtitles
    for (var i = 0; i < subtitles.length; i++) {
        var subtitle = subtitles[i];
        var marker = new MarkerValue(subtitle.text);
        markerProperty.setValueAtTime(subtitle.time, marker);
    }

    // Add expression to change text based on the marker
    textLayer.property('Source Text').expression =
        'var markers = thisLayer.marker;\n' +
        'var subtitle = "";\n' +
        'for (var i = 1; i <= markers.numKeys; i++) {\n' +
        '  if (time >= markers.key(i).time) {\n' +
        '    subtitle = markers.key(i).comment;\n' +
        '  }\n' +
        '}\n' +
        'subtitle;';

    app.endUndoGroup();
}

// Run the main function
createTextLayerWithMarkers();