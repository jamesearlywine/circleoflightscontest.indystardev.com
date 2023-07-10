'use strict';

// mapTest1App.canvas module/dependencies definition
angular.module  ('coloringbook.canvasPrototype', 
                    [
                        'ui.router',
                        'ui.bootstrap',
                        'ngAnimate',
                        'ct.ui.router.extras',
                        'ngSanitize'
                    ]
                )

    // route definitions
    .config(['$stateProvider', function($stateProvider) {
        
        $stateProvider
            .state('appCanvasPrototype', {
                url: '/app/canvasPrototype',
                sticky: true,
                deepStateRedirect: true,
                templateUrl: 'app/__canvasPrototype/canvas.html?v=2.0',
                controller: 'CanvasPrototypeCtrl'
            })
        ;        
    }])

    // controllers definition 
    .controller('CanvasPrototypeCtrl', [
                    '$scope', 
                    '$modal',
                    '$timeout',
                    '$stateParams',
                    '$state',
                    '$window',
                    'AppConfig',
                    'CanvasService',
                    'ImagesConstants',
                    'FabricConstants',
                    'Fabric',
        function(   $scope,
                    $modal,
                    $timeout,
                    $stateParams,
                    $state,
                    $window,
                    AppConfig,
                    CanvasService,
                    ImagesConstants,
                    FabricConstants,
                    Fabric
        ) {
            
            /* debug */
            window.CanvasPrototypeCtrl         = $scope;
            
            
            /* init */
            $scope.$stateParams = $stateParams;
            $scope.CanvasService  = CanvasService;
            
            $scope.fabric = {};
        	$scope.ImagesConstants = ImagesConstants;
        	$scope.FabricConstants = FabricConstants;
            
            
            /* canvas controller entry */
            $scope.main = function() {
                $scope.initFabric();
            };




        	//
        	// Initialize Fabric.js
        	// ================================================================
        	$scope.initFabric = function() {
        		$scope.fabric = new Fabric({
        			JSONExportProperties: FabricConstants.JSONExportProperties,
        			textDefaults: FabricConstants.textDefaults,
        			shapeDefaults: FabricConstants.shapeDefaults,
        			json: $scope.main.selectedPage.json
        		});
        	};




            /* kick it off */
            $scope.main();
            
        }]
    ) // end CanvasCtrl
    .factory('CanvasService', [
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
                canvasKey : 'canvasValue',
            }
            
            return api;
        }]
    )
       
;