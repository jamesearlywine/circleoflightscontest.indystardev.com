/**
 * This service serves as a high-level functional wrapper for the Fabric service (vendor code)
 * It contains application-specific functions for leveraging the angular-fabric library
 * to satisfy the coloring book application functional requirements
 */

angular.module('ColoringBookService', [])
    .factory('ColoringBookService', [
        '$q',
        '$window',
        '$http',
        '$rootScope',
        'AppConfig',
        'Fabric',
        'FabricConstants',
        'FabricCanvas',
        'FabricWindow',
        'DimensionsService',
        function(
            $q,
            $window,
            $http,
            $rootScope,
            AppConfig,
            Fabric,
            FabricConstants,
            FabricCanvas,
            FabricWindow,
            DimensionsService
        )
        {
            
            return {
                /**
                 * The Fabric service contains singleton reference to Fabric.js object 
                 * that wraps the single canvas object on the page
                 */
                
                fabricOptions : {
                        		    JSONExportProperties    : FabricConstants.JSONExportProperties,
                        			textDefaults            : FabricConstants.textDefaults,
                        			shapeDefaults           : FabricConstants.shapeDefaults,
                        			json                    : angular.extend({}, 
                    		                                    AppConfig.fabric.coloringCanvas.initOptions)
                },
                drawingCanvasElement : null,
                
                /**
                 * Initialize
                 */
                fabricInitialized : false,
                init : function(options) {
                    // console.log('ColoringBookService init called with these options: ', options);
                    if (options !== undefined) {
                        this.fabricOptions = angular.extend(this.fabricOptions, options);
                    }

                    if (!this.fabricInitialized) {
                        // console.log('initializing coloring canvas with these options: ', this.fabricOptions);
                        this.fabric = new Fabric(this.fabricOptions);
                    }
                    this.setInitialCanvasSize();
                    this.setOverlay();
                    
                	this.fabricInitialized = true;
                	return this.fabric;
                },
                invalidateInitialization : function() {
                    this.fabricInitialized = false;
                },
                 
                 
                /**
                 * Dimensions 
                 */
                responsizeCanvasSize : {
                    width: AppConfig.fabric.coloringCanvas.dimensions.initialWidth,
                    height: AppConfig.fabric.coloringCanvas.dimensions.initialHeight,
                },
                setInitialCanvasSize : function() {
                    this.fabric.originalWidth = AppConfig.fabric.coloringCanvas.dimensions.initialWidth;
                    this.fabric.originalheight = AppConfig.fabric.coloringCanvas.dimensions.initialHeight;
                    this.setResponsizeCanvasSize();
                    this.startListeningToDrawing();
                },
                setResponsizeCanvasSize : function() {
                    this.responsizeCanvasSize = DimensionsService.getResponsiveCanvasSize();
                    var proportion = this.responsizeCanvasSize.width / AppConfig.fabric.coloringCanvas.dimensions.initialWidth;
                    this.fabric.getCanvas().setViewportTransform(
                        [
                            proportion,
                            0, 0,
                            proportion,
                            0, 0
                        ]  
                    );
                    this.fabric.setCanvasWidth(this.responsizeCanvasSize.width);
                    this.fabric.setCanvasHeight(this.responsizeCanvasSize.height);
                },

                /**
                 * Overlay Image
                 */
                overlayImageUrl: AppConfig.fabric.coloringCanvas.overlayImage.url,
                overlayImageScale: AppConfig.fabric.coloringCanvas.overlayImage.scale,
                setOverlay : function(url) {
                    if (url !== undefined) {
                        this.overlayImageUrl = url;
                    }
                    this.fabric
                        .getCanvas()
                        .setOverlayImage(
                            this.overlayImageUrl, 
                            this.fabric.render,
                            {
                                scaleX: this.overlayImageScale,
                                scaleY: this.overlayImageScale
                            }
                       )
                    ;
                },
                
                /**
                 * Brush Color
                 */
                brushColor : null,
                setBrushColor : function(color) {
                    if (color !== undefined) {
                        this.brushColor = color;
                    }
                    this.fabric.getCanvas().freeDrawingBrush.color = this.brushColor;
                    return this;
                },
                
                /**
                 * Brush Size
                 */
                brushSize: null,
                setBrushSize : function(size) {
                    if (size !== undefined) {
                        this.brushSize = size;
                    }
                    this.fabric.getCanvas().freeDrawingBrush.width = this.brushSize;
                    return this;
                },
                
                /**
                 * Clear Canvas
                 */
                clearCanvas : function() {
                    this.fabric.getCanvas().clear();  
                },
                
                /**
                 * Image/Canvas state persistence
                 */
                imageState : null,
                saveImageState : function() {
                    this.imageState 
                        = JSON.stringify(
                            this.fabric.getCanvas()
                        )
                    ;
                    // console.log('imageState saved: ', this.imageState);
                },
                restoreImageState : function() {
                    // console.log('restoringImageState: ', this.imageState);
                    this.fabric.getCanvas().loadFromJSON(this.imageState);
                },
                
                
                /**
                 * Generate preview for submit page (from store image state)
                 */
                previewImageDataURL : null,
                getPreviewImageDataURL : function() {
                    if (this.drawingCanvasElement === null) {return null;}
                    this.invalidateInitialization();
                    this.init();
                    this.restoreImageState();
                    this.previewImageDataURL = this.fabric.getCanvas().toDataURL();
                    return this.previewImageDataURL;
                },
                
                /**
                 * Point Drawn Event Handler
                 */
                startListeningToDrawing : function() {
                    this.drawListenCancel = this.fabric.getCanvas().on('dot:drawn', function() {
        				console.log('point drawn');
        				//this.fabric.getCanvas().renderAll();
        				this.setOverlay();
        			}.bind(this));
                }
                
                
            };
            
        }
        
    ]);