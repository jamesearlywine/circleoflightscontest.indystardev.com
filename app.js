angular.module('coloringbook', [
        // 3rd party dependencies
        'ui.router',
        'ui.bootstrap',
        'ct.ui.router.extras',
        'ui',
        'ngAnimate',
        'ngSanitize',
        'ngLodash',
        'common.fabric',
        'angularSpinner',

        // routable modules
        'coloringbook.home',
        'coloringbook.canvas',
        'coloringbook.preview',
        'coloringbook.thanks',
        
        // filters
        
        // services (global)
        'ColoringBookService',
        'ShareService',
        'EmailService',
        'DimensionsService',
        'SubmissionService',
        'Base64PNGUploadService',
        'HistoryService',
        'OmnitureService',
        'ActionTrackingService',
        
        // directives
        'common.fabric.directive'
        
    ])
    
    /**
     * AppConfig
     */
    .constant('AppConfig',
        {
            // see environment.js
            baseURL         : indystar_environment.get('baseURL'),
            assetsBaseURL   : indystar_environment.get('assetsBaseURL'),
            shareSettings   : indystar_environment.get('shareSettings'),
            
            ActionTrackingApiKey  : 'ppl4jUcUU9sfjjj1k195hzlzq',
            restEndpoints : {
                
            },
            apiEndpoints : {
                login: 'backend/public/index.php/auth/login',
                logout: 'backend/public/index.php/auth/logout',
                isLoggedIn: 'backend/public/index.php/auth/isLoggedIn',
                sendEmail: 'backend/public/index.php/sendEmail',
                sendSubmission: 'backend/public/index.php/sendSubmission',
                sendBase64PNGImage : 'backend/public/index.php/sendImageBase64',
                actionTracking: 'backend/public/index.php/actionTracking'
            },
            entryState: 'appPublications',
            defaults : {
                PublicationService : {
                    outerChunkSize  : 2, // chunks 2 
                    innerChunkSize  : 2  // sets of 2 together
                },
                footerSettings : {
                    open : true
                }
            },
            controllersWith : {
                sidePencils : [
                    'HomeCtrl',
                    'PreviewCtrl',
                    'ThanksCtrl'
                ]  
            },
            fabric: {
                coloringCanvas : {
                    initOptions: {
                        isDrawingMode : true,
                        // renderOnAddRemove: true,
                        // controlsAboveOverlay: false,
                        // allowTouchScrolling: true
                        selection:true,
                        selectable:true,
                        width: 1140,
                        height: 1095,
                        background: '#FFFFFF',
                        borderColor: 'black',
                        stroke: 'black',
                        strikeWidth: 2
                    },
                    dimensions : {
                        initialHeight: 1095,
                        initialWidth: 1140,
                        // width breakpoints (must be in ascending order)
                        breakpoints: {
                            0    : '90%',
                            768  : '668px',
                            992  : '892px',
                            1200 : '1100px'
                        }
                    },
                    overlayImage: {
                        url : 'common/img/coloring-canvas.png',
                        scale : .88 // (decimal value, between 0 = 0%, .50 = 50%, 1 = 100%)
                    },
                    brushes: {
                        defaultColor: 'red',
                        colors : {
                            'eraser'        : '#FFFFFF', // set to the same color as background
                            'brown'         : '#410D01',
                            'dark-red'      : '#800000',
                            'red'           : '#CA0101',
                            'red-orange'    : '#FF4500',
                            'orange'        : '#FF9900',
                            'yellow'        : '#FFDE00',
                            'gold'          : '#E0BD00',
                            'light-green'   : '#64C101',
                            'green'         : '#009300',
                            'turquouise'    : '#008080',
                            'light-blue'    : '#009DE7',
                            'blue'          : '#0048BF',
                            'dark-blue'     : '#282d95',
                            'purple'        : '#7D26CD',
                            'pink'          : '#E31899',
                            'black'         : '#111111',
                            'grey'          : '#888888',
                            'silver'        : '#CCCCCC'
                        }
                        
                    }
                }
            },
            
            omniture : window.indystar_environment.get('omniture')
            
        } // end AppConfig
    )
    
    /**
     * Routing (routes are located in each app module)
     */
    // define default route
    .config(    [   
                    '$urlRouterProvider',
                    function(
                        $urlRouterProvider
                    ) 
                    {
                        $urlRouterProvider.otherwise('app/home');
                    }
                ]   
            )

    /**
     * rootScope misc. init
     */
    .run(   [   
                '$rootScope',
                '$timeout',
                'AppConfig',
                'OmnitureService',
                function(
                    $rootScope,
                    $timeout,
                    AppConfig,
                    OmnitureService
                ) 
                {
                    $rootScope.testValue = "test value..";
                    $rootScope.sharedState = {};
                    window.rootScope = $rootScope;
                    
                    /** 
                     * Side Pencils
                     */
                    $rootScope.showSidePencils = false;
                    $rootScope.$on('$stateChangeSuccess', 
                        function(event, toState, toParams, fromState, fromParams) {
                            // console.log('$stateChangeSuccess toState.controller: ', toState.controller);
                            
                            // if this controller has sidePencils
                            if (AppConfig
                                    .controllersWith
                                    .sidePencils
                                        .indexOf(toState.controller) !== -1 )
                            {
                                // update rootScope accordingly ( show side-pencils - see index.html $('.side-pencil') )
                                $rootScope.showSidePencils = true;
                            } else {
                                // update rootScope accordingly ( show side-pencils - see index.html $('.side-pencil') )
                                $rootScope.showSidePencils = false;
                            }
                            
                        }
                    );
                    
                    /**
                     * busy/loading spinner animation
                     */
                    $rootScope.showBackdrop = false;
                    $rootScope.$on('us-spinner:spin', function() {
                        $timeout(function() {
                            $rootScope.showBackdrop = true;    
                        }, 0)
                    });
                    $rootScope.$on('us-spinner:stop', function() {
                        $timeout(function() {
                            $rootScope.showBackdrop = false; 
                        }, 0);
                    });
                    $rootScope.$on('$stateChangeStart', function() {
                        $rootScope.showBackdrop = false;
                    });                    
                    
                    /**
                     * AppReady Timer
                     */
                    $rootScope.$on('$viewContentLoaded', function(event) {
                        if (window.timers.get('appReady')._end === null) {
                            window.timers.get('appReady').end(); // see index.html head for timer start    
                            // console.log('appReady time: ', window.timers.get('appReady').duration);
                        }
                    });
                    
                    /**
                     * Omniture Service
                     */
                    OmnitureService.config({
                        section         : AppConfig.omniture.defaults.section,
                        // append ' - (Mobile)' for mobile,  - (iPad) for iPad'
                        showDevice      : AppConfig.omniture.defaults.showDevice,
                        // receive console.log debug info from omniture transport.html
                        debugTransport  : AppConfig.omniture.defaults.debugTransport
                    });
                }
            ]
        )
 
;