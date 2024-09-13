{
        function createGraph(){
        var version = "1.4.2";

        //screen size 1920 x 1080
        var height = 1080;
        var width = 1920;
        var duration = 60;
        var numberOfMiddleLines = 0;// if you want to add custom number of horizontal lines, change this value(0 means number of y values - 1)
        var margin = 300;
        var strokeWidth = 4;

        var textYPosFromBottomLine = 50;
        var xValuesSrc = {'start': 2007, 'end': 2025, 'step': 1};
        var yValuesSrc = {'start': -12, 'end': 12, 'step': 3};

        var fontSize = 20;
        var color = [0, 0, 0]; // Black color



        // var xValues = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000"];
        var xValues = [];
        if(xValues.length == 0){
            for (var i = xValuesSrc.start; i <= xValuesSrc.end; i += xValuesSrc.step) {
                xValues.push(i);
            }
        }


        // var yValues = ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"];
        var yValues = [];
        if(yValues.length == 0){
            for (var i = yValuesSrc.start; i <= yValuesSrc.end; i += yValuesSrc.step) {
                yValues.push(i);
            }
        }

        var textXPosFromLeftLine = 70;

        var numOfGraphs = 3;
        var graphWidth = 10;
        var graphColor = [0, 0, 0];

        // var yValues = {'start': 0, 'end': 100, 'step': 10};




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
        var linesName = 'lines' + '(' + version + ')';
        var xvaluesName = 'xvalues' + '(' + version + ')';
        var yvaluesName = 'yvalues' + '(' + version + ')';
        var graphsName = 'graphs' + '(' + version + ')';


        // Create a new composition
        var graphAnimComp = app.project.items.addComp(graphName, width, height, 1, duration, 30);
        var linesComp = app.project.items.addComp(linesName, width, height, 1, duration, 30);
        var xvaluesComp = app.project.items.addComp(xvaluesName, width, height, 1, duration, 30);
        var yvaluesComp = app.project.items.addComp(yvaluesName, width, height, 1, duration, 30);
        var graphsComp = app.project.items.addComp(graphsName, width, height, 1, duration, 30);
        graphAnimComp.layers.add(linesComp);
        graphAnimComp.layers.add(xvaluesComp);
        graphAnimComp.layers.add(yvaluesComp);
        graphAnimComp.layers.add(graphsComp);

        function createGraphLayers() {
            var graphBaseName = "Graph_Base";

            for(index = 0; index < numOfGraphs; index++){
                var shapeLayer = graphsComp.layers.addShape();
                shapeLayer.name = graphBaseName + "_" + (index + 1);
                

                //make Path in Shape in Contents in Shape Layer
                var shapeGroup = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
                var shapeGroupContents = shapeGroup.property("ADBE Vectors Group");
                shapeGroupContents.addProperty("ADBE Vector Shape - Group");
                var stroke = shapeGroupContents.addProperty("ADBE Vector Graphic - Stroke");

                stroke.property("ADBE Vector Stroke Color").setValue(graphColor); // Black color
                stroke.property("ADBE Vector Stroke Width").setValue(graphWidth); // Line width
            }

        }


        function zoomGraphs() {
            var layers = graphsComp.layers;
            for (var i = 1; i <= layers.length; i++) {
                var layer = layers[i];
                
                layer.property("Scale").expression =
                'var scaleControlLayer = comp("'+graphName+'").layer("Scale Control");\n'+
                'var endScaleValue = scaleControlLayer.scale;\n'+
                'value = endScaleValue;'
            }


            for (var i = 1; i <= layers.length; i++) {
                var layer = layers[i];

                var initialPos = layer.property("Position").value;

                layer.property("Position").expression =
                'var scaleControlLayer = comp("'+graphName+'").layer("Scale Control");\n'+
                'var endScaleValue = scaleControlLayer.scale;\n'+
                'var scaleFactor = endScaleValue / 100; // Assuming the start scale is 100%\n'+
                'var anchorValueX = scaleControlLayer.anchorPoint[0] + '+width/2+';\n'+
                'var anchorValueY = scaleControlLayer.anchorPoint[1] + '+height/2+';\n'+
                'var anchorValue = ['+initialPos[0]+' - anchorValueX, '+initialPos[1]+' - anchorValueY];\n'+
                'var moveDistance = [anchorValue[0]*scaleFactor[0], anchorValue[1]*scaleFactor[1]];\n'+
                'value = [moveDistance[0] + anchorValueX, moveDistance[1] + anchorValueY];';

            }
        }

        // Function to create a shape layer with a line
        function createLine(startPoint, endPoint, lineName) {
            var start = [startPoint[0] - width/2, startPoint[1] - height/2];
            var end = [endPoint[0] - width/2, endPoint[1] - height/2];
            var shapeLayer = graphAnimComp.layers.addShape();
            shapeLayer.name = lineName;
            var shapeGroup = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
            var shapeGroupContents = shapeGroup.property("ADBE Vectors Group");
            var pathGroup = shapeGroupContents.addProperty("ADBE Vector Shape - Group");
            var path = pathGroup.property("ADBE Vector Shape");
            var myPath = new Shape();
            myPath.vertices = [start, end];
            path.setValue(myPath);
            var stroke = shapeGroupContents.addProperty("ADBE Vector Graphic - Stroke");
            stroke.property("ADBE Vector Stroke Color").setValue(color); // Black color
            stroke.property("ADBE Vector Stroke Width").setValue(strokeWidth); // Line width
        }

        // Function to create a dotted line shape layer
        function createDottedLine(startPoint, endPoint, lineName, dashLength, gapLength) {

            // Set default values if they are not provided
            dashLength = (dashLength !== undefined) ? dashLength : 2;
            gapLength = (gapLength !== undefined) ? gapLength : 10;

            var start = [startPoint[0] - width/2, startPoint[1] - height/2];
            var end = [endPoint[0] - width/2, endPoint[1] - height/2];
            
            var shapeLayer = linesComp.layers.addShape();
            shapeLayer.name = lineName;
            var shapeGroup = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
            var shapeGroupContents = shapeGroup.property("ADBE Vectors Group");
            var pathGroup = shapeGroupContents.addProperty("ADBE Vector Shape - Group");
            var path = pathGroup.property("ADBE Vector Shape");
            var myPath = new Shape();
            myPath.vertices = [start, end];
            path.setValue(myPath);
            var stroke = shapeGroupContents.addProperty("ADBE Vector Graphic - Stroke");
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
            var sliderControl = scaleController.property("Effects").addProperty("ADBE Slider Control");
            sliderControl.name = "Stroke Width Control";
            sliderControl.property("Slider").setValue(constantWidth); // Default stroke width, adjust as needed

            var scaleExpression = 
            'targetScale = comp("'+graphName+'").layer("Scale Control").transform.scale[1] / 100;\n' + 
            'initialStrokeWidth = comp("'+graphName+'").layer("Scale Control").effect("Stroke Width Control")("Slider");\n' +
            'initialStrokeWidth / targetScale;';

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

        function centerAnchorPoint( layer ){
            var comp = layer.containingComp;
            var curTime = comp.time;

            /* find center by bounding box of the layer */
            var y = layer.sourceRectAtTime(curTime, false).height/2;
            var x = layer.sourceRectAtTime(curTime, false).width/2;

            /* we need this for text layer */
            y += layer.sourceRectAtTime(curTime, false).top;
            x += layer.sourceRectAtTime(curTime, false).left;

            //set only y anchor point
            layer.anchorPoint.setValue([ x, y ]);

        };

        function createXText(position, textContent, textName) {
            var textLayer = xvaluesComp.layers.addText(textContent);

            textProp = textLayer.property("ADBE Text Properties").property("ADBE Text Document"),
            textDoc = textProp.value;
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
            
            textProp = textLayer.property("ADBE Text Properties").property("ADBE Text Document"),
            textDoc = textProp.value;
            textDoc.fontSize = fontSize;
            textDoc.fillColor = color;
            textProp.setValue(textDoc);

            centerAnchorPoint(textLayer);
            textLayer.name = textName;
            textLayer.property("Position").setValue(position);

            // // Store the distance in the text layer's comment so it can be accessed later
            textLayer.comment = position[0].toString() + "##" + position[1].toString();
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


        function zoomCompositionWithNull(comp, startScale, endScale, startTime, endTime) {
            // Create a null layer
            var nullLayer = comp.layers.addNull();
            nullLayer.name = "Scale Control";

            // Apply the zoom effect to the null layer
            zoomLayer(nullLayer, startScale, endScale, startTime, endTime);
            
        }

        function zoomXvalues() {
            // Add expression to each text layer
            for (var i = 1; i <= xvaluesComp.numLayers; i++) {
                var layer = xvaluesComp.layer(i);

                var initialPosX = parseFloat(layer.comment.split("##")[0]);

                // Add expression to the Position property
                layer.property("Position").expression =
                'var scaleControlLayer = comp("'+graphName+'").layer("Scale Control");\n'+
                'var endScaleValue = scaleControlLayer.scale[0];\n'+
                'var scaleFactor = endScaleValue / 100; // Assuming the start scale is 100%\n'+
                'var anchorValue = scaleControlLayer.anchorPoint[0] + '+width/2+';\n'+
                'var moveDistance = ('+initialPosX+' - anchorValue) * scaleFactor;\n'+
                'value = [moveDistance + anchorValue, thisLayer.position[1]];';

            }
        }


        function zoomYvalues() {
            // Add expression to each text layer
            for (var i = 1; i <= yvaluesComp.numLayers; i++) {
                var layer = yvaluesComp.layer(i);

                var initialPosY = parseFloat(layer.comment.split("##")[1]);

                // Add expression to the Position property
                layer.property("Position").expression =
                'var scaleControlLayer = comp("'+graphName+'").layer("Scale Control");\n'+
                'var endScaleValue = scaleControlLayer.scale[1];\n'+
                'var scaleFactor = endScaleValue / 100; // Assuming the start scale is 100%\n'+
                'var anchorValue = scaleControlLayer.anchorPoint[1] + '+height/2+';\n'+
                'var moveDistance = ('+initialPosY+' - anchorValue) * scaleFactor;\n'+
                'value = [thisLayer.position[0], moveDistance + anchorValue];';

            }
        }

        function zoomLines() {
            var layers = linesComp.layers;
            for (var i = 1; i <= layers.length; i++) {
                var layer = layers[i];
                
                layer.property("Scale").expression =
                'var scaleControlLayer = comp("'+graphName+'").layer("Scale Control");\n'+
                'var endScaleValue = scaleControlLayer.scale;\n'+
                'value = endScaleValue;'
            }


            for (var i = 1; i <= layers.length; i++) {
                var layer = layers[i];

                var initialPos = layer.property("Position").value;

                layer.property("Position").expression =
                'var scaleControlLayer = comp("'+graphName+'").layer("Scale Control");\n'+
                'var endScaleValue = scaleControlLayer.scale;\n'+
                'var scaleFactor = endScaleValue / 100; // Assuming the start scale is 100%\n'+
                'var anchorValueX = scaleControlLayer.anchorPoint[0] + '+width/2+';\n'+
                'var anchorValueY = scaleControlLayer.anchorPoint[1] + '+height/2+';\n'+
                'var anchorValue = ['+initialPos[0]+' - anchorValueX, '+initialPos[1]+' - anchorValueY];\n'+
                'var moveDistance = [anchorValue[0]*scaleFactor[0], anchorValue[1]*scaleFactor[1]];\n'+
                'value = [moveDistance[0] + anchorValueX, moveDistance[1] + anchorValueY];';

            }
        }


        // Dimensions
        var compWidth = linesComp.width;
        var compHeight = linesComp.height;

        // Create left vertical line
        createLine([margin, margin], [margin, compHeight - margin], "Left Vertical Line");

        // Create bottom horizontal line
        createLine([margin, compHeight - margin], [compWidth - margin, compHeight - margin], "Bottom Horizontal Line");

        if(numberOfMiddleLines == 0){
            numberOfMiddleLines = yValues.length - 2;
        }

        // Create three horizontal lines spread through
        for (var i = 1; i <= numberOfMiddleLines; i++) {
            var yPos = compHeight-margin - (i * (compHeight - 2*margin) / (numberOfMiddleLines + 1));
            createDottedLine([margin, yPos], [compWidth-margin, yPos], "Horizontal Line " + i);
        }

        // Create text layers below the bottom horizontal line
        var textYPos = compHeight - margin + textYPosFromBottomLine; // adjust textHeight as needed
        for (var i = 1; i <= xValues.length; i++) {
            var xPos = margin + ((i-1) * (compWidth - 2*margin) / (xValues.length - 1));
            createXText([xPos, textYPos], xValues[i-1],  xValues[i-1]);
        }

        // Create text layers to the left of the vertical line
        var textXPos = margin - textXPosFromLeftLine; // adjust textXPosFromLeftLine as needed
        for (var i = 1; i <= yValues.length; i++) {
            var yPos = compHeight - margin - ((i-1) * (compHeight - 2*margin) / (yValues.length - 1));
            createYText([textXPos, yPos], yValues[i-1], yValues[i-1]);
        }

        createGraphLayers();

        // Apply zoom animation to linesComp
        zoomCompositionWithNull(graphAnimComp, [100, 100], [200, 200], 1, 2); // Zoom from 100% to 200% from 1s to 2s

        zoomLines();
        zoomGraphs();
        zoomXvalues();
        zoomYvalues();
        // xValuesFadeOutWhenOutOfGraphArea();
        keepStrokeWidthConstant(linesComp.layers, strokeWidth);
        keepStrokeWidthConstant(graphsComp.layers, graphWidth);


        // add the graph composition to timeline
        graphAnimComp.openInViewer();

    }


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
        var shapeGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Group");
    
        // Add a path to the shape group
        var path = shapeGroup.property("Contents").addProperty("ADBE Vector Shape - Group");
        var pathShape = path.property("Path");
    
        // Define the path as a simple line
        var myShape = new Shape();
        myShape.closed = false;
        myShape.vertices = [[100, 100], [500, 100]]; // Horizontal line from x=100 to x=500
        pathShape.setValue(myShape);
    
        // Add a stroke to the shape group
        var stroke = shapeGroup.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
        stroke.property("Color").setValue([1, 1, 1]); // White color for the stroke
        stroke.property("Stroke Width").setValue(5);  // 5px stroke width
    
        // Apply dashes to make the line dotted
        var dashes = stroke.property("Dashes").addProperty("ADBE Vector Stroke Dash 1");
        dashes.setValue(10); // Length of dashes
        var gap = stroke.property("Dashes").addProperty("ADBE Vector Stroke Gap 1");
        gap.setValue(10); // Gap between dashes
    
        // Add a stroke offset to animate the dotted line
        var offset = stroke.property("Dashes").addProperty("ADBE Vector Stroke Offset");
        offset.setValue(0); // Initial offset value
    
        // Animate the stroke offset to create the moving dotted line effect
        offset.setValueAtTime(0, 0);
        offset.setValueAtTime(5, -100); // Animate offset for a moving dotted line effect
    
    
        //add trim path to the shape layer and animate it
        var trimPath = shapeLayer.property("Contents").addProperty("ADBE Vector Filter - Trim");
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
    }

    function changeKeyframeVelocity(){
        {
            // Get the active composition
            var comp = app.project.activeItem;
        
            // Ensure the composition is valid and something is selected
            if (comp != null && comp instanceof CompItem && comp.selectedLayers.length > 0) {
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
                alert("Keyframe ease adjusted!");
            } else {
                alert("Please select a layer with keyframes.");
            }
        }
    }


    /**
     *  UI for AE-Expressions
     */
    function createUI(thisObj) {
            
        /*
        Code for Import https://scriptui.joonas.me — (Triple click to select): 
        {"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":null,"windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":true},"text":"Dialog","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"]}},"item-2":{"id":2,"type":"Button","parentId":7,"style":{"enabled":true,"varName":"changeKeyframeVelocity","text":"Change Keyframe Velocity","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-5":{"id":5,"type":"Button","parentId":13,"style":{"enabled":true,"varName":null,"text":"Counter","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-6":{"id":6,"type":"TabbedPanel","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":10,"alignment":null,"selection":12}},"item-7":{"id":7,"type":"Tab","parentId":6,"style":{"enabled":true,"varName":null,"text":"Anim","orientation":"column","spacing":10,"alignChildren":["left","top"]}},"item-8":{"id":8,"type":"Tab","parentId":6,"style":{"enabled":true,"varName":null,"text":"Create","orientation":"column","spacing":10,"alignChildren":["left","top"]}},"item-9":{"id":9,"type":"EditText","parentId":11,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":true,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"Start","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-10":{"id":10,"type":"EditText","parentId":11,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":true,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"End","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-11":{"id":11,"type":"Group","parentId":13,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-12":{"id":12,"type":"Tab","parentId":6,"style":{"enabled":true,"varName":null,"text":"Graph","orientation":"column","spacing":10,"alignChildren":["left","top"]}},"item-13":{"id":13,"type":"Panel","parentId":8,"style":{"enabled":true,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Counter","preferredSize":[0,0],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-14":{"id":14,"type":"Panel","parentId":8,"style":{"enabled":true,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Dotted Line","preferredSize":[0,0],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-15":{"id":15,"type":"Button","parentId":14,"style":{"enabled":true,"varName":null,"text":"Dotted Line","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-16":{"id":16,"type":"Button","parentId":12,"style":{"enabled":true,"varName":null,"text":"Create Graph","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}}},"order":[0,6,7,2,8,13,11,9,10,5,14,15,12,16],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"None"},"activeId":16}
        */ 

        // DIALOG
        // ======
        var dialog = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Cool Things", undefined, {resizeable: true}); 
        dialog.text = "Dialog"; 
        dialog.orientation = "column"; 
        dialog.alignChildren = ["center","top"]; 
        dialog.spacing = 10; 
        dialog.margins = 16; 

        // TPANEL1
        // =======
        var tpanel1 = dialog.add("tabbedpanel", undefined, undefined, {name: "tpanel1"}); 
        tpanel1.alignChildren = "fill"; 
        tpanel1.preferredSize.width = 213.344; 
        tpanel1.margins = 0; 

        // TAB1
        // ====
        var tab1 = tpanel1.add("tab", undefined, undefined, {name: "tab1"}); 
        tab1.text = "Anim"; 
        tab1.orientation = "column"; 
        tab1.alignChildren = ["left","top"]; 
        tab1.spacing = 10; 
        tab1.margins = 10; 

        var button0 = tab1.add("button", undefined, undefined, {name: "changeKeyframeVelocity"}); 
        button0.text = "Change Keyframe Velocity"; 
        button0.onClick = function(){
            changeKeyframeVelocity();
        }

        // TAB2
        // ====
        var tab2 = tpanel1.add("tab", undefined, undefined, {name: "tab2"}); 
        tab2.text = "Create"; 
        tab2.orientation = "column"; 
        tab2.alignChildren = ["left","top"]; 
        tab2.spacing = 10; 
        tab2.margins = 10; 

        // PANEL1
        // ======
        var panel1 = tab2.add("panel", undefined, undefined, {name: "panel1"}); 
        panel1.text = "Counter"; 
        panel1.orientation = "column"; 
        panel1.alignChildren = ["left","top"]; 
        panel1.spacing = 10; 
        panel1.margins = 10; 

        // GROUP1
        // ======
        var group1 = panel1.add("group", undefined, {name: "group1"}); 
        group1.orientation = "row"; 
        group1.alignChildren = ["left","center"]; 
        group1.spacing = 10; 
        group1.margins = 0; 

        var edittext1 = group1.add('edittext {properties: {name: "edittext1", scrollable: true}}'); 
        edittext1.text = "Start"; 

        var edittext2 = group1.add('edittext {properties: {name: "edittext2", scrollable: true}}'); 
        edittext2.text = "End"; 

        // PANEL1
        // ======
        var button1 = panel1.add("button", undefined, undefined, {name: "button1"}); 
        button1.text = "Counter"; 
        button1.onClick = counterUp; 

        // PANEL2
        // ======
        var panel2 = tab2.add("panel", undefined, undefined, {name: "panel2"}); 
        panel2.text = "Dotted Line"; 
        panel2.orientation = "column"; 
        panel2.alignChildren = ["left","top"]; 
        panel2.spacing = 10; 
        panel2.margins = 10; 

        var button2 = panel2.add("button", undefined, undefined, {name: "button2"}); 
        button2.text = "Dotted Line"; 
        button2.onClick = createDottedLineAnimation; 

        // TAB3
        // ====
        var tab3 = tpanel1.add("tab", undefined, undefined, {name: "tab3"}); 
        tab3.text = "Graph"; 
        tab3.orientation = "column"; 
        tab3.alignChildren = ["left","top"]; 
        tab3.spacing = 10; 
        tab3.margins = 10; 

        // TPANEL1
        // =======
        tpanel1.selection = tab3; 

        var button3 = tab3.add("button", undefined, undefined, {name: "button3"}); 
        button3.text = "Create Graph"; 
        button3.onClick = createGraph;

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
