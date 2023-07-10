'use strict';

// mapTest1App.home module/dependencies definition
angular.module  ('coloringbook.home', 
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
            .state('appHome', {
                url: '/app/home',
                sticky: true,
                deepStateRedirect: true,
                templateUrl: 'app/home/home.html?v=2.0',
                controller: 'HomeCtrl'
            })
        ;        
    }])

    // controllers definition 
    .controller('HomeCtrl', [
                    '$scope', 
                    '$modal',
                    '$timeout',
                    '$stateParams',
                    '$state',
                    '$window',
                    'AppConfig',
                    'HomeService',
                    'ShareService',
                    'ColoringBookService',
                    'HistoryService',
                    'OmnitureService',
                    'ActionTrackingService',
        function(   $scope,
                    $modal,
                    $timeout,
                    $stateParams,
                    $state,
                    $window,
                    AppConfig,
                    HomeService,
                    ShareService,
                    ColoringBookService,
                    HistoryService,
                    OmnitureService,
                    ActionTrackingService
        ) {
            
            /* debug */
            window.HomeCtrl         = $scope;
            
            /* scope init */
            $scope.$stateParams = $stateParams;
            $scope.HomeService  = HomeService;
            $scope.ShareService = ShareService;
            $scope.ColoringBookService = ColoringBookService;
            $scope.HistoryService = HistoryService;
            $scope.ActionTrackingService = ActionTrackingService;
            
            /* home controller entry */
            $scope.main = function() {
                $scope.initSharing();
                // to stop people from manualing changing view states
                // in an order that does not facilitate reliable functionality
                HistoryService.clear();
                HistoryService.add('appHome');
                $scope.reportToOmniture();
            };

            /**
             * Contest Rules Modal
             */
            $scope.test = ['a', 'b', 'c'];
            $scope.openContestRules = function (size) {
                ActionTrackingService
                    .page('home')
                    .actionType('info')
                    .actionDetail('contest-rules')
                    .recordAction()
                ;
                $scope.contestModal = $modal.open({
                    animation: true,
                    templateUrl: 'app/home/contest-modal.html?v=1.1',
                    controller: 'HomeContestModalCtrl',
                    size: size,
                    resolve: {
                        'Home' : function() {
                            return $scope;
                        } 
                    }
                });
            };
            
            /**
             * Sharing
             */
            $scope.shareSettings = {
                facebookAppId : window.indystar_environment.get('shareSettings').facebookAppId,
                link        : window.indystar_environment.get('baseURL'),
                title       : 'Carson\'s Circle of Lights Coloring Contest',
                description : 'Kids ages 3-12 are invited to enter Carson\'s Coloring Contest for a chance to "flip the switch" at Circle of Lights Nov. 25 in Downtown Indy. Five finalists will each win a College Choice 529 Direct Savings Plan and a Carson\'s gift card. Enter by Nov. 14.',
                caption     : window.indystar_environment.get('shareSettings').caption,
                media       : window.indystar_environment.get('shareSettings').media,
                redirectUrl : window.indystar_environment.get('shareSettings').redirectUrl
            };
            $scope.shareSettingsTwitter = {
                facebookAppId : window.indystar_environment.get('shareSettings').facebookAppId,
                link        : '',
                title       : "Got crayons? Kids can participate in Carson's Coloring Contest for chance to \"flip the switch\" at #CircleofLights! www.downtownindy.org",
                description : '',
                caption     : window.indystar_environment.get('shareSettings').caption,
                media       : window.indystar_environment.get('shareSettings').media,
                redirectUrl : window.indystar_environment.get('shareSettings').redirectUrl
            };
            
            $scope.initSharing = function(settings) {
                if (settings === undefined) { var settings = $scope.shareSettings; }
                ShareService.settings(settings);
            };
            $scope.share = function(network) {
                if (network.trim() === 'twitter') { 
                    $scope.initSharing( $scope.shareSettingsTwitter ); 
                } else {
                    $scope.initSharing( $scope.shareSettings );
                }
                ActionTrackingService
                    .page('home')
                    .actionType('share')
                    .actionDetail(network)
                    .recordAction()
                ;
                ShareService.share(network);
            };
            /**
             * Email Modal
             */
            $scope.emailData = {
                to: null,
                from: null,
                subject: null,
                message: null
            };
            $scope.openSendmail = function (size) {
              $scope.emailModal = $modal.open({
                animation: true,
                templateUrl: 'app/home/email-modal.html?v=1.2',
                controller: 'HomeEmailModalCtrl',
                size: size,
                resolve: {
                    'Home' : function() {
                        return $scope;
                    } 
                }
              });
            };

            /**
             * Go to Coloring Online canvas
             */
            $scope.goToCanvas = function() {
                $state
                    .go(
                        'appCanvas', 
                        {}, 
                        {
                            reload  : false,
                            inherit: false,
                            notify: true
                        }
                    )
                ;
            };
            
            
            /**
             * Download (href opens download - this function records the action for our tracking)
             */
            $scope.reportDownload = function() {
                ActionTrackingService
                    .page('home')
                    .actionType('download')
                    .actionDetail('contest-application')
                    .recordAction()
                ;
            };
             
            /**
             * Print
             */
            $scope.print = function() {
                ActionTrackingService
                    .page('home')
                    .actionType('print')
                    .actionDetail('contest-application')
                    .recordAction()
                ;
                window.print();    
            };
            
            /**
             * Omniture
             */
            $scope.omniture = {
                section : AppConfig.omniture.defaults.section,
                extension : 'circleoflights-app-home'
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
    ) // end HomeCtrl
    
    /**
     * Home Contest Modal Controller
     */
    .controller('HomeContestModalCtrl', [
                    '$scope',
                    '$modalInstance',
                    'Home',
        function (  
            $scope,
            $modalInstance,
            Home
    
        ) { 
              $scope.close = function () {
                Home.contestModal.close(null)
              };
        }]
    )  //end HomeContestModalCtrl
    
    /**
     * Home Email Modal Controller
     */
    .controller('HomeEmailModalCtrl', [
                    '$scope',
                    '$modalInstance', 
                    '$timeout',
                    'AppConfig',
                    'EmailService',
                    'ActionTrackingService',
                    'Home',
        function (  $scope,
                    $modalInstance,
                    $timeout,
                    AppConfig,
                    EmailService,
                    ActionTrackingService,
                    Home
        ) { 
            /**
             * Initialization
             */
            $scope.main = function() {
                $timeout(function() {
                    $scope.initEmailData();
                    $scope.initEmailValidation();
                }, 100);
            };

            /**
             * Email Data Initialization
             */
            $scope.defaultMessageContent = "";
            $scope.initEmailData = function() {
                $scope.emailData = Home.emailData;    
                $scope.emailData.message = $scope.defaultMessageContent;
            };

            /**
             * Send Email
             */
            $scope.thankYouMessageDuration = 2000; // in ms  
            $scope.emailSent = false;
            $scope.emailError = false;
            $scope.sendEmail = function () {
                if ($("#email-form").valid()) {
                    // console.log('ready to submit emailData: ', $scope.emailData); 
                    ActionTrackingService
                        .page('home')
                        .actionType('share')
                        .actionDetail('email')
                        .recordAction()
                    ;
                    EmailService
                        .endpoints({
                            sendEmail: AppConfig.apiEndpoints.sendEmail
                        })
                        .email($scope.emailData)
                        .send()
                        .then(function(response) {
                            //console.log('Email sent, server response: ', response);
                            $scope.emailSent = true;
                            $timeout(function() {
                                Home.emailModal.close();
                            }, $scope.thankYouMessageDuration);
                        }, function(error) {
                            $scope.emailSent = true;
                            $scope.emailError = true;
                        })
                }
            };

            /**
             * Input Validation
             */
            $scope.initEmailValidation = function() {
                $("#email-form").validate({
                  rules: {
                    senderEmail: {
                      required: true,
                      email:true
                    },
                    recipientEmail: {
                      required: true,
                      email:true
                    }
                  },
                  submitHandler: function(form) {
                      $scope.sendEmail();
                  }
                });               
            };
            

            
            /**
             * Cancel Email
             */
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            
            
            // kick it off
            $scope.main();
            
        }]
    )  //end HomeEmailModalCtrl
    
    .factory('HomeService', [
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
                homeKey : 'homeValue',
            }
            
            return api;
        }]
    )
       
;