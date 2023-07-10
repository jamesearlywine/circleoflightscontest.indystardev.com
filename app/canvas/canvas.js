'use strict';

// mapTest1App.canvas module/dependencies definition
angular.module  ('coloringbook.canvas', 
                    [
                        'ui.router',
                        'ui.bootstrap',
                        'ngAnimate',
                        'ct.ui.router.extras',
                        'ngSanitize',
                        'DimensionsService'
                    ]
                )

    // route definitions
    .config(['$stateProvider', function($stateProvider) {
        
        $stateProvider
            .state('appCanvas', {
                url: '/app/canvas',
                templateUrl: 'app/canvas/canvas.html?v=2.0',
                controller: 'CanvasCtrl',
                reload: true,
                
            })
        ;        
    }])

    // controllers definition 
    .controller('CanvasCtrl', [
                    '$scope', 
                    '$modal',
                    '$timeout',
                    '$stateParams',
                    '$state',
                    '$window',
                    'AppConfig',
                    'DimensionsService',
                    'CanvasTestService',
                    'ColoringBookService',
                    'Base64PNGUploadService',
                    'FabricCanvas',
                    'FabricWindow',
                    'HistoryService',
                    'usSpinnerService',
                    'OmnitureService',
                    'ActionTrackingService',
        function(   $scope,
                    $modal,
                    $timeout,
                    $stateParams,
                    $state,
                    $window,
                    AppConfig,
                    DimensionsService,
                    CanvasTestService,
                    ColoringBookService,
                    Base64PNGUploadService,
                    FabricCanvas,
                    FabricWindow,
                    HistoryService,
                    usSpinnerService,
                    OmnitureService,
                    ActionTrackingService
                
        ) {
            
            /* debug */
            window.CanvasCtrl         = $scope;

            /* init */
            $scope.$stateParams         = $stateParams;
            $scope.CanvasTestService    = CanvasTestService;
            $scope.ColoringBookService  = ColoringBookService;
            $scope.AppConfig            = AppConfig;
            $scope.$window              = $window;
            $scope.FabricCanvas         = FabricCanvas;
            $scope.FabricWindow         = FabricWindow;
            $scope.Base64PNGUploadService = Base64PNGUploadService;
            $scope.HistoryService       = HistoryService;
            
            /* canvas controller entry */
            $scope.main = function() {
                //if ($scope.canvasInitialized) {$scope.initCanvas();}
                HistoryService.add('appCanvas');
                $scope.reportToOmniture();
            };
            
            /**
             * Fabric Initialization (see common/js/services/ColoringBookService.js)
             */
            $scope.initialCanvasConfig = AppConfig.fabric.coloringCanvas.initOptions;        
    	    $scope.canvasInitialized = false;
    	    $scope.initCanvas = function() {
    	        $scope.canvasInitialized = true;
    	        $scope.fabric = ColoringBookService.init();
    	        $scope.selectDefaultColor();
    	        $scope.setBrushSize();
	        };
    	    $scope.$on('canvas:created', $scope.initCanvas);
            
            /**
             * Responsive Canvas
             */
            angular.element($window).bind('resize', function(e) {
                ColoringBookService.setResponsizeCanvasSize();
            });

            /**
             * Brush Color
             */
            $scope.colors       = angular.extend({}, AppConfig.fabric.coloringCanvas.brushes.colors);
            $scope.eraserColor  = $scope.colors.eraser; // first item is the erased
            delete($scope.colors.eraser);
            $scope.selectColor = function(color) {
                var colorCode = AppConfig.fabric.coloringCanvas.brushes.colors[color];
                $scope.selectedColor = {
                    name: color,
                    code: colorCode
                };
                ColoringBookService.setBrushColor($scope.selectedColor.code);
            };
            $scope.defaultColor = AppConfig.fabric.coloringCanvas.brushes.defaultColor;
            $scope.selectDefaultColor = function() {
                $scope.selectColor($scope.defaultColor);
            };
            $scope.hoverBrush = null;
            $scope.brushOver = function(color) {
                $scope.hoverBrush = color;
            };
            $scope.brushOut = function(color) {
                if ($scope.hoverBrush == color) {
                    $scope.hoverBrush = null;
                }
            };

            /**
             * Brush Size
             */
            $scope.defaultBrushSize = 20;
            $scope.setBrushSize = function(value) {
                if (value !== undefined) {
                    $scope.brushSize = value;
                }
                if ($scope.brushSize === undefined) {
                    $scope.brushSize = $scope.defaultBrushSize;
                }
                ColoringBookService.setBrushSize($scope.brushSize);
            };

            /**
             * Eraser
             */
            $scope.selectEraser = function() {
                $scope.selectedColor = {
                    name: 'eraser',
                    code: $scope.eraserColor
                }
                ColoringBookService.setBrushColor($scope.selectedColor.code);
            };
            
            /**
             * Clear Canvas 
             */
            $scope.clearCanvas = function() {
                ColoringBookService.clearCanvas();
            };
            
            
            /**
             * Image/Canvas state persistence (in memory)
             */
            $scope.$on('$stateChangeSuccess', 
                function(event, toState, toParams, fromState, fromParams) {
                    if (toState.controller == 'CanvasCtrl') {
                        $scope.ColoringBookService.restoreImageState();
                    }
                }
            ); 
            $scope.$on('$stateChangeStart', 
                function(event, toState, toParams, fromState, fromParams) {
                    if (fromState.controller == 'CanvasCtrl') {
                        $scope.ColoringBookService.saveImageState();
                    }
                }
            );
            
            /**
             * Done Drawing (Send Image to Server and go to Preview)
             */
            $scope.doneDrawing = function() {
                // console.log('uplaoding image to server: ', $scope.fabric.getCanvas().toDataURL());
                ActionTrackingService
                    .page('canvas')
                    .actionType('coloring-complete')
                    .actionDetail(null)
                    .recordAction()
                ;
                usSpinnerService.spin('busy');
                Base64PNGUploadService
                    .endpoint(  AppConfig.apiEndpoints.sendBase64PNGImage   )
                    .base64(    $scope.fabric.getCanvas().toDataURL()       )
                    .send()
                    .then(function(response) {
                        usSpinnerService.stop('busy');
                        $state.go(
                            'appPreview',
                            {
                                
                            }
                        ); 
                    })
                ;
                
            };

            /**
             * Omniture
             */
            $scope.omniture = {
                section : AppConfig.omniture.defaults.section,
                extension : 'circleoflights-app-canvas'
            };
            $scope.omnitureDelay = 1000; // ms - race condition of some sort, delay loading iframe
            $scope.reportToOmniture = function() {
                OmnitureService
                    .set('section',     $scope.omniture.section)
                    .set('extension',   $scope.omniture.extension)
                    .report()
                ;
            };
            

            /* kick it off */
            $scope.main();
            
        }]
    ) // end CanvasCtrl
    
    // in-app state-storage
    .factory('CanvasTestService', [
        '$q',
        '$timeout',
        '$rootScope',
        '$state',
        '$previousState',
        'AppConfig',
        function(
            $q,
            $timeout,
            $rootScope,
            $state,
            $previousState,
            AppConfig
        )
        {
            var api = {
                key : 'value',
            }
            
            
            
            return api;
        }]
    )
       
;