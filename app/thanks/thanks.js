'use strict';

// mapTest1App.thanks module/dependencies definition
angular.module  ('coloringbook.thanks', 
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
            .state('appThanks', {
                url: '/app/thanks',
                sticky: true,
                deepStateRedirect: true,
                templateUrl: 'app/thanks/thanks.html?v=2.5',
                controller: 'ThanksCtrl',
                resolve: {
                    'hasCanvasLoaded' : function(
                        $state, 
                        $q,
                        $location,
                        ColoringBookService,
                        HistoryService
                        ) 
                    {
                        // console.log('ColoringBookService.drawingCanvasElement: ', ColoringBookService.drawingCanvasElement);
                        var defer = $q.defer();
                        if (
                                ColoringBookService.drawingCanvasElement === null
                             || !HistoryService.contains('appPreview')
                        ) {
                            // console.log('redirecting from thanks');
                            $location.path('');
                        }
                        return $q.when(null);
                    }
                }
            })
        ;        
    }])

    // controllers definition 
    .controller('ThanksCtrl', [
                    '$scope', 
                    '$modal',
                    '$timeout',
                    '$stateParams',
                    '$state',
                    '$window',
                    'AppConfig',
                    'ShareService',
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
                    ShareService,
                    HistoryService,
                    OmnitureService,
                    ActionTrackingService
        ) {
            
            /* debug */
            window.ThanksCtrl         = $scope;
            
            
            /* init */
            $scope.$stateParams     = $stateParams;
            $scope.HistoryService   = HistoryService;
            $scope.ShareService     = ShareService;
            
            /* thanks controller entry */
            $scope.main = function() {
                $scope.initSharing();
                // scroll top top of page after page-load
                $timeout(function() {
                    window.scrollTo(0, 0);
                }, 100);
                HistoryService.add('appThanks');
                
                if (!HistoryService.contains('appPreview')) {
                    $state
                        .go(
                            'appHome', 
                            {},
                            {
                                reload      : true,
                                notify      : true,
                                location    : true
                            }
                        )
                    ;
                }
                
                $scope.reportToOmniture();
                
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
                templateUrl: 'app/thanks/email-modal.html?v=1.2',
                controller: 'ThanksEmailModalCtrl',
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
             * Omniture
             */
            $scope.omniture = {
                section : AppConfig.omniture.defaults.section,
                extension : 'circleoflights-app-thanks'
            };
            $scope.omnitureDelay = 1000; // ms - race condition of some sort, delay loading iframe
            $scope.reportToOmniture = function() {
                OmnitureService
                    .set('section',     $scope.omniture.section)
                    .set('extension',   $scope.omniture.extension)
                    .report()
                ;
            };
            
            $scope.reportMoreInformation = function() {
                ActionTrackingService
                    .page('thanks')
                    .actionType('info')
                    .actionDetail('more-information')
                    .recordAction()
                ;
            };
            

            /* kick it off */
            $scope.main();
            
        }]
    ) // end ThanksCtrl


    /**
     * Home Email Modal Controller
     */
    .controller('ThanksEmailModalCtrl', [
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
             * Scroll to top of window on load
             */
            $scope.$on('$viewContentLoaded', function(){
                
            });
            
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
                if ($("#thanks-email-form").valid()) {
                    // console.log('ready to submit emailData: ', $scope.emailData); 
                    ActionTrackingService
                        .page('thanks')
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
                window.formHandle = $("#email-form").validate({
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

;