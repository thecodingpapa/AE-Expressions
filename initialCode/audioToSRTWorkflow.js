{
    // Audio Export and SRT Translation Workflow for After Effects
    // This script exports M4A audio, sends to transcription API, translates, and creates SRT subtitles
    
    var AudioTranscriptionWorkflow = {
        config: {
            transcriptionAPI: {
                url: "https://your-transcription-api.com/upload",
                apiKey: "YOUR_TRANSCRIPTION_API_KEY"
            },
            translationAPI: {
                url: "https://your-translation-api.com/translate", 
                apiKey: "YOUR_TRANSLATION_API_KEY"
            },
            tempFolder: Folder.temp.fsName + "/ae_audio_workflow/",
            timeout: 120000, // 2 minutes
            audioCompression: {
                sampleRate: 16000,     // 16kHz - optimal for speech recognition
                bitRate: 32,           // 32 kbps - very compressed for speech
                channels: 1,           // Mono - sufficient for transcription
                quality: "low",        // Low quality for minimum file size
                useFFmpeg: true        // Use FFmpeg for additional compression if available
            }
        },

        init: function() {
            // Create temp folder if it doesn't exist
            var tempDir = new Folder(this.config.tempFolder);
            if (!tempDir.exists) {
                tempDir.create();
            }
        },

        exportAudioAsM4A: function(comp) {
            try {
                if (!comp || !(comp instanceof CompItem)) {
                    alert("Please select a composition with audio.");
                    return null;
                }

                // Check if composition has audio
                var hasAudio = this.checkForAudio(comp);
                if (!hasAudio) {
                    alert("No audio found in the composition.");
                    return null;
                } 

                // Set up render queue
                var renderQueue = app.project.renderQueue;
                var renderItem = renderQueue.items.add(comp);
                
                // Create M4A output module optimized for transcription
                var outputModule = renderItem.outputModules[1];
                
                // Set output to audio only with compression optimized for speech
                outputModule.applyTemplate("Audio Only");
                
                // Configure optimal M4A settings for transcription (minimum size, speech quality)
                try {
                    // Set format to QuickTime for M4A container
                    outputModule.format = "MPEG4";
                    
                    // Configure audio settings using compression config for maximum compression while preserving speech clarity
                    outputModule.audioSettings = {
                        "Audio Output": true,
                        "Video Output": false,
                        "Audio Codec": "AAC",
                        "Audio Sample Rate": this.config.audioCompression.sampleRate,  // Configurable sample rate
                        "Audio Bit Rate": this.config.audioCompression.bitRate * 1000,  // Convert kbps to bps
                        "Audio Bit Depth": "16 Bit", 
                        "Audio Channels": this.config.audioCompression.channels === 1 ? "Mono" : "Stereo",
                        "Audio Quality": this.config.audioCompression.quality === "low" ? "Low" : "Medium"
                    };
                    
                    // Additional compression settings if available
                    if (outputModule.property("Audio Codec Options")) {
                        var codecOptions = outputModule.property("Audio Codec Options");
                        codecOptions.setValue({
                            "Bitrate": 64000,           // 64 kbps
                            "Profile": "LC",            // Low Complexity AAC profile
                            "Quality": "Constrained VBR" // Variable bitrate for efficiency
                        });
                    }
                    
                } catch (settingsError) {
                    // Fallback to basic settings if advanced options fail
                    $.writeln("Using fallback audio settings: " + settingsError.toString());
                }

                // Generate unique filename
                var timestamp = new Date().getTime();
                var audioFileName = "audio_export_compressed_" + timestamp + ".m4a";
                var audioFilePath = this.config.tempFolder + audioFileName;
                
                // Set output file
                outputModule.file = new File(audioFilePath);
                
                // Show progress dialog
                var progressDialog = this.createProgressDialog("Exporting compressed audio for transcription...");
                progressDialog.show();

                // Start render
                renderQueue.render();
                
                // Wait for render to complete
                var renderComplete = false;
                var self = this;
                var checkInterval = app.setInterval(function() {
                    if (renderQueue.numQueuedItems === 0) {
                        renderComplete = true;
                        app.clearInterval(checkInterval);
                        progressDialog.close();
                        
                        // Post-process the exported file for additional compression
                        var finalFile = self.compressAudioFile(new File(audioFilePath));
                        return finalFile;
                    }
                }, 1000);

                // Timeout check
                app.setTimeout(function() {
                    if (!renderComplete) {
                        app.clearInterval(checkInterval);
                        progressDialog.close();
                        alert("Audio export timed out.");
                    }
                }, this.config.timeout);

                // Wait for render completion and return compressed file
                while (!renderComplete && renderQueue.numQueuedItems > 0) {
                    $.sleep(500); // Wait 500ms before checking again
                }
                
                var exportedFile = new File(audioFilePath);
                if (exportedFile.exists) {
                    return this.compressAudioFile(exportedFile);
                } else {
                    alert("Audio export failed - file not found.");
                    return null;
                }

            } catch (error) {
                alert("Error exporting audio: " + error.toString());
                return null;
            }
        },

        checkForAudio: function(comp) {
            for (var i = 1; i <= comp.numLayers; i++) {
                var layer = comp.layer(i);
                if (layer.hasAudio && layer.audioEnabled) {
                    return true;
                }
            }
            return false;
        },

        compressAudioFile: function(audioFile) {
            try {
                if (!audioFile || !audioFile.exists) {
                    return audioFile;
                }

                var originalSize = audioFile.length;
                $.writeln("Original audio file size: " + (originalSize / 1024).toFixed(2) + " KB");

                // Create compressed filename
                var compressedPath = audioFile.fsName.replace(".m4a", "_compressed.m4a");
                var compressedFile = new File(compressedPath);

                // Use FFmpeg if available for additional compression
                var ffmpegCommand = this.buildFFmpegCompressionCommand(audioFile.fsName, compressedPath);
                
                if (ffmpegCommand) {
                    $.writeln("Compressing with FFmpeg: " + ffmpegCommand);
                    var result = system.callSystem(ffmpegCommand);
                    
                    if (result === 0 && compressedFile.exists) {
                        var compressedSize = compressedFile.length;
                        var compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
                        
                        $.writeln("Compressed file size: " + (compressedSize / 1024).toFixed(2) + " KB");
                        $.writeln("Compression ratio: " + compressionRatio + "%");
                        
                        // Remove original file and return compressed version
                        audioFile.remove();
                        return compressedFile;
                    } else {
                        $.writeln("FFmpeg compression failed, using original file");
                        if (compressedFile.exists) compressedFile.remove();
                    }
                }

                // If FFmpeg not available or failed, return original file
                return audioFile;

            } catch (error) {
                $.writeln("Audio compression error: " + error.toString());
                return audioFile; // Return original file if compression fails
            }
        },

        buildFFmpegCompressionCommand: function(inputPath, outputPath) {
            try {
                // Skip FFmpeg if disabled in config
                if (!this.config.audioCompression.useFFmpeg) {
                    return null;
                }

                // Check if FFmpeg is available
                var testCommand = "ffmpeg -version";
                var testResult = system.callSystem(testCommand + " > /dev/null 2>&1");
                
                if (testResult !== 0) {
                    $.writeln("FFmpeg not found, skipping additional compression");
                    return null;
                }

                // Build optimized FFmpeg command using configuration settings
                var ffmpegCommand = [
                    'ffmpeg',
                    '-i "' + inputPath + '"',
                    '-c:a aac',                    // AAC codec
                    '-b:a ' + this.config.audioCompression.bitRate + 'k',  // Configurable bitrate
                    '-ar ' + this.config.audioCompression.sampleRate,      // Configurable sample rate
                    '-ac ' + this.config.audioCompression.channels,        // Configurable channels
                    '-profile:a aac_low',          // Low complexity AAC profile
                    '-movflags +faststart',        // Optimize for streaming/quick access
                    '-f mp4',                      // Ensure MP4 container
                    '-y',                          // Overwrite output file
                    '"' + outputPath + '"'
                ].join(' ');

                return ffmpegCommand;

            } catch (error) {
                $.writeln("Error building FFmpeg command: " + error.toString());
                return null;
            }
        },

        sendAudioForTranscription: function(audioFile, callback) {
            try {
                if (!audioFile || !audioFile.exists) {
                    throw new Error("Audio file not found");
                }

                var progressDialog = this.createProgressDialog("Sending audio for transcription...");
                progressDialog.show();

                // Prepare multipart form data for file upload
                var requestData = this.prepareAudioUpload(audioFile);
                
                var options = {
                    url: this.config.transcriptionAPI.url,
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + this.config.transcriptionAPI.apiKey
                    },
                    data: requestData,
                    isFile: true
                };

                var self = this;
                this.makeHTTPRequest(options, function(error, response) {
                    progressDialog.close();
                    
                    if (error) {
                        callback(error, null);
                    } else {
                        try {
                            var result = self.parseTranscriptionResponse(response);
                            callback(null, result);
                        } catch (parseError) {
                            callback(parseError, null);
                        }
                    }
                });

            } catch (error) {
                if (progressDialog) progressDialog.close();
                callback(error, null);
            }
        },

        prepareAudioUpload: function(audioFile) {
            // Create a temporary script to handle file upload via curl
            var uploadScript = new File(this.config.tempFolder + "upload_script.sh");
            
            var curlCommand = [
                'curl -X POST',
                '"' + this.config.transcriptionAPI.url + '"',
                '-H "Authorization: Bearer ' + this.config.transcriptionAPI.apiKey + '"',
                '-F "audio=@' + audioFile.fsName + '"',
                '-F "response_format=srt"',
                '-F "language=auto"',
                '--max-time ' + (this.config.timeout / 1000)
            ].join(' ');

            return curlCommand;
        },

        translateSRT: function(srtContent, targetLanguage, callback) {
            try {
                var requestData = {
                    text: srtContent,
                    source_language: "auto",
                    target_language: targetLanguage || "ko",
                    format: "srt",
                    preserve_timing: true
                };

                var options = {
                    url: this.config.translationAPI.url,
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.config.translationAPI.apiKey
                    },
                    data: JSON.stringify(requestData)
                };

                var progressDialog = this.createProgressDialog("Translating subtitles...");
                progressDialog.show();

                var self = this;
                this.makeHTTPRequest(options, function(error, response) {
                    progressDialog.close();
                    
                    if (error) {
                        callback(error, null);
                    } else {
                        try {
                            var result = self.parseTranslationResponse(response);
                            callback(null, result);
                        } catch (parseError) {
                            callback(parseError, null);
                        }
                    }
                });

            } catch (error) {
                callback(error, null);
            }
        },

        makeHTTPRequest: function(options, callback) {
            try {
                // Use system curl command for HTTP requests
                var tempResponseFile = new File(this.config.tempFolder + "response_" + new Date().getTime() + ".txt");
                
                var curlCommand;
                if (options.isFile) {
                    // File upload command
                    curlCommand = options.data + ' --output "' + tempResponseFile.fsName + '"';
                } else {
                    // Regular POST request
                    var tempRequestFile = new File(this.config.tempFolder + "request_" + new Date().getTime() + ".json");
                    tempRequestFile.open("w");
                    tempRequestFile.write(options.data);
                    tempRequestFile.close();

                    curlCommand = [
                        'curl -X ' + options.method,
                        '"' + options.url + '"',
                        '-H "Content-Type: ' + (options.headers["Content-Type"] || "application/json") + '"',
                        '-H "Authorization: ' + options.headers.Authorization + '"',
                        '-d @"' + tempRequestFile.fsName + '"',
                        '--output "' + tempResponseFile.fsName + '"',
                        '--max-time ' + (this.config.timeout / 1000)
                    ].join(' ');
                }

                $.writeln("Executing: " + curlCommand);
                var result = system.callSystem(curlCommand);

                if (result === 0 && tempResponseFile.exists) {
                    tempResponseFile.open("r");
                    var response = tempResponseFile.read();
                    tempResponseFile.close();
                    callback(null, response);
                } else {
                    callback(new Error("HTTP request failed with code: " + result), null);
                }

                // Cleanup
                if (tempRequestFile && tempRequestFile.exists) tempRequestFile.remove();
                if (tempResponseFile.exists) tempResponseFile.remove();

            } catch (error) {
                callback(error, null);
            }
        },

        parseTranscriptionResponse: function(response) {
            try {
                // Try parsing as JSON first
                var responseObj = JSON.parse(response);
                
                if (responseObj.text) {
                    return responseObj.text; // Direct SRT content
                } else if (responseObj.srt) {
                    return responseObj.srt;
                } else if (responseObj.transcription) {
                    return responseObj.transcription;
                } else if (responseObj.data && responseObj.data.srt) {
                    return responseObj.data.srt;
                }
                
                throw new Error("No SRT content found in response");
                
            } catch (jsonError) {
                // If not JSON, assume direct SRT content
                if (response.indexOf("-->") !== -1) {
                    return response; // Looks like SRT format
                }
                throw new Error("Invalid transcription response format");
            }
        },

        parseTranslationResponse: function(response) {
            try {
                var responseObj = JSON.parse(response);
                
                if (responseObj.translated_text) {
                    return responseObj.translated_text;
                } else if (responseObj.translation) {
                    return responseObj.translation;
                } else if (responseObj.result) {
                    return responseObj.result;
                } else if (responseObj.data && responseObj.data.translated_srt) {
                    return responseObj.data.translated_srt;
                }
                
                throw new Error("No translated content found in response");
                
            } catch (error) {
                throw new Error("Failed to parse translation response: " + error.toString());
            }
        },

        createSRTFromTranslation: function(translatedSRT, originalComp) {
            try {
                app.beginUndoGroup("Create SRT from Translation");

                // Parse the translated SRT
                var subtitles = this.parseSRT(translatedSRT);
                
                if (subtitles.length === 0) {
                    alert("No subtitles found in the translated content.");
                    return;
                }

                // Create new composition for subtitles
                var subComp = app.project.items.addComp(
                    "Translated Subtitles", 
                    originalComp.width, 
                    originalComp.height, 
                    originalComp.pixelAspect, 
                    originalComp.duration, 
                    originalComp.frameRate
                );

                // Create text layers for each subtitle
                for (var i = 0; i < subtitles.length; i++) {
                    var subtitle = subtitles[i];
                    var textLayer = subComp.layers.addText(subtitle.text);
                    
                    textLayer.inPoint = subtitle.startTime;
                    textLayer.outPoint = subtitle.endTime;

                    // Style the text
                    var textProp = textLayer.property("ADBE Text Properties").property("ADBE Text Document");
                    var textDocument = textProp.value;
                    textDocument.fontSize = 60;
                    textDocument.fillColor = [1, 1, 1]; // White
                    textDocument.strokeColor = [0, 0, 0]; // Black outline
                    textDocument.strokeWidth = 3;
                    textDocument.applyStroke = true;
                    textDocument.justification = ParagraphJustification.CENTER_JUSTIFY;
                    textProp.setValue(textDocument);

                    // Position text at bottom center
                    var position = textLayer.property("Transform").property("Position");
                    position.setValue([originalComp.width / 2, originalComp.height - 150]);
                }

                // Add subtitle composition to original composition
                originalComp.layers.add(subComp);

                app.endUndoGroup();
                alert("Translated subtitles created successfully!\n" + subtitles.length + " subtitle segments imported.");

            } catch (error) {
                app.endUndoGroup();
                alert("Error creating SRT: " + error.toString());
            }
        },

        parseSRT: function(srtContent) {
            var subtitles = [];
            var blocks = srtContent.split(/\n\s*\n/);

            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i].trim();
                if (block) {
                    var lines = block.split('\n');
                    if (lines.length >= 3) {
                        var timeCode = lines[1];
                        var text = lines.slice(2).join('\n');

                        var times = timeCode.split(' --> ');
                        if (times.length === 2) {
                            subtitles.push({
                                startTime: this.parseTime(times[0]),
                                endTime: this.parseTime(times[1]),
                                text: text
                            });
                        }
                    }
                }
            }
            return subtitles;
        },

        parseTime: function(timeString) {
            var parts = timeString.split(':');
            var seconds = parts[2].replace(',', '.');
            return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(seconds);
        },

        createProgressDialog: function(message) {
            var dialog = new Window("palette", "Processing");
            dialog.orientation = "column";
            dialog.alignChildren = "center";
            
            dialog.add("statictext", undefined, message);
            var progressBar = dialog.add("progressbar", undefined, 0, 100);
            progressBar.preferredSize.width = 300;
            
            var counter = 0;
            var timer = app.setInterval(function() {
                counter += 2;
                progressBar.value = counter % 100;
            }, 100);
            
            dialog.onClose = function() {
                app.clearInterval(timer);
            };
            
            return dialog;
        },

        configureAPIs: function() {
            var dialog = new Window("dialog", "API Configuration");
            dialog.orientation = "column";
            dialog.alignChildren = "fill";

            // Transcription API
            dialog.add("statictext", undefined, "Transcription API Settings:");
            var transcriptionGroup = dialog.add("panel", undefined, "Transcription API");
            transcriptionGroup.orientation = "column";
            transcriptionGroup.alignChildren = "fill";

            var transUrlGroup = transcriptionGroup.add("group");
            transUrlGroup.add("statictext", undefined, "URL:");
            var transUrlInput = transUrlGroup.add("edittext", undefined, this.config.transcriptionAPI.url);
            transUrlInput.characters = 50;

            var transKeyGroup = transcriptionGroup.add("group");
            transKeyGroup.add("statictext", undefined, "API Key:");
            var transKeyInput = transKeyGroup.add("edittext", undefined, "");
            transKeyInput.characters = 50;

            // Translation API
            dialog.add("statictext", undefined, "Translation API Settings:");
            var translationGroup = dialog.add("panel", undefined, "Translation API");
            translationGroup.orientation = "column";
            translationGroup.alignChildren = "fill";

            var translUrlGroup = translationGroup.add("group");
            translUrlGroup.add("statictext", undefined, "URL:");
            var translUrlInput = translUrlGroup.add("edittext", undefined, this.config.translationAPI.url);
            translUrlInput.characters = 50;

            var translKeyGroup = translationGroup.add("group");
            translKeyGroup.add("statictext", undefined, "API Key:");
            var translKeyInput = translKeyGroup.add("edittext", undefined, "");
            translKeyInput.characters = 50;

            // Target Language
            var langGroup = dialog.add("group");
            langGroup.add("statictext", undefined, "Target Language:");
            var langDropdown = langGroup.add("dropdownlist", undefined, ["Korean (ko)", "English (en)", "Spanish (es)", "French (fr)", "German (de)", "Japanese (ja)", "Chinese (zh)"]);
            langDropdown.selection = 0;

            // Buttons
            var buttonGroup = dialog.add("group");
            var okButton = buttonGroup.add("button", undefined, "Save Configuration");
            var cancelButton = buttonGroup.add("button", undefined, "Cancel");

            var self = this;
            okButton.onClick = function() {
                self.config.transcriptionAPI.url = transUrlInput.text;
                self.config.transcriptionAPI.apiKey = transKeyInput.text;
                self.config.translationAPI.url = translUrlInput.text;
                self.config.translationAPI.apiKey = translKeyInput.text;
                self.config.targetLanguage = langDropdown.selection.text.match(/\((\w+)\)/)[1];
                
                alert("Configuration saved successfully!");
                dialog.close();
            };

            cancelButton.onClick = function() {
                dialog.close();
            };

            dialog.show();
        },

        runWorkflow: function() {
            var self = this;
            
            try {
                // Get active composition
                var comp = app.project.activeItem;
                if (!comp || !(comp instanceof CompItem)) {
                    alert("Please select an active composition.");
                    return;
                }

                // Check API configuration
                if (!this.validateConfiguration()) {
                    var configure = confirm("APIs not configured. Configure now?");
                    if (configure) {
                        this.configureAPIs();
                    }
                    return;
                }

                // Step 1: Export audio
                var audioFile = this.exportAudioAsM4A(comp);
                if (!audioFile) {
                    alert("Failed to export audio.");
                    return;
                }

                // Step 2: Send for transcription
                this.sendAudioForTranscription(audioFile, function(error, srtContent) {
                    if (error) {
                        alert("Transcription failed: " + error.toString());
                        return;
                    }

                    // Step 3: Translate the SRT
                    self.translateSRT(srtContent, self.config.targetLanguage, function(translationError, translatedSRT) {
                        if (translationError) {
                            alert("Translation failed: " + translationError.toString());
                            return;
                        }

                        // Step 4: Create subtitles in After Effects
                        self.createSRTFromTranslation(translatedSRT, comp);

                        // Cleanup
                        if (audioFile.exists) {
                            audioFile.remove();
                        }
                    });
                });

            } catch (error) {
                alert("Workflow error: " + error.toString());
            }
        },

        validateConfiguration: function() {
            return (this.config.transcriptionAPI.url !== "https://your-transcription-api.com/upload" &&
                    this.config.translationAPI.url !== "https://your-translation-api.com/translate" &&
                    this.config.transcriptionAPI.apiKey !== "YOUR_TRANSCRIPTION_API_KEY" &&
                    this.config.translationAPI.apiKey !== "YOUR_TRANSLATION_API_KEY");
        }
    };

    // Main execution function
    function main() {
        try {
            // Initialize the workflow
            AudioTranscriptionWorkflow.init();

            // Show main dialog
            var mainDialog = new Window("dialog", "Audio to SRT Workflow");
            mainDialog.orientation = "column";
            mainDialog.alignChildren = "center";

            mainDialog.add("statictext", undefined, "Audio Export → Transcription → Translation → SRT");
            
            var buttonGroup = mainDialog.add("group");
            var startButton = buttonGroup.add("button", undefined, "Start Workflow");
            var configButton = buttonGroup.add("button", undefined, "Configure APIs");
            var cancelButton = buttonGroup.add("button", undefined, "Cancel");

            startButton.onClick = function() {
                mainDialog.close();
                AudioTranscriptionWorkflow.runWorkflow();
            };

            configButton.onClick = function() {
                AudioTranscriptionWorkflow.configureAPIs();
            };

            cancelButton.onClick = function() {
                mainDialog.close();
            };

            mainDialog.show();

        } catch (error) {
            alert("Error: " + error.toString());
        }
    }

    // Run the script
    main();
}