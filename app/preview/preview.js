'use strict';

// mapTest1App.preview module/dependencies definition
angular.module  ('coloringbook.preview', 
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
            .state('appPreview', {
                url: '/app/preview',
                sticky: true,
                deepStateRedirect: true,
                templateUrl: 'app/preview/preview.html?v=2.0',
                controller: 'PreviewCtrl',
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
                             || !HistoryService.contains('appCanvas')      
                            ) {
                            // console.log('redirecting');
                            $location.path('');
                        }
                        return $q.when(null);
                    }
                }
            })
        ;        
    }])

    // controllers definition 
    .controller('PreviewCtrl', [
                    '$scope', 
                    '$modal',
                    '$timeout',
                    '$stateParams',
                    '$state',
                    '$window',
                    '$location',
                    'AppConfig',
                    'SubmissionService',
                    'ColoringBookService',
                    'Base64PNGUploadService',
                    'ShareService',
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
                    $location,
                    AppConfig,
                    SubmissionService,
                    ColoringBookService,
                    Base64PNGUploadService,
                    ShareService,
                    HistoryService,
                    usSpinnerService,
                    OmnitureService,
                    ActionTrackingService
        ) {
            
            
            /* debug */
            window.PreviewCtrl         = $scope;
            
            /* scope init */
            $scope.$stateParams         = $stateParams;
            $scope.ColoringBookService  = ColoringBookService;
            $scope.SubmissionService    = SubmissionService;
            $scope.Base64PNGUploadService = Base64PNGUploadService;
            $scope.ShareService         = ShareService;
            $scope.HistoryService       = HistoryService;
            
            /* controller entry */
            $scope.main = function() {
                $scope.getPreviewImage();
                $scope.initInputValidation();
                $scope.initSharing();
                HistoryService.add('appPreview');
            };

            /**
             * Entry Submission
             */
            $scope.submission = {
                name         : null,
                age          : null,
                phone        : null,
                parentName   : null,
                email        : null,
                zipCode      : null,
                imageUrl     : Base64PNGUploadService.images().link,
                thumbnailUrl : Base64PNGUploadService.images().thumbnailLink
            };
            $scope.submit = function() {
                ActionTrackingService
                    .page('preview')
                    .actionType('coloring-submitted')
                    .actionDetail(null)
                    .recordAction()
                ;
                if ($("#contest-submission-form").valid()) {
                    SubmissionService
                        .reset()
                        .endpoint(AppConfig.apiEndpoints.sendSubmission)
                        .submit($scope.submission)
                        .then(function() {
                            $state.go(
                                'appThanks',
                                {
                                    
                                }
                            ); 
                        })
                    ;
                }
            };
            /**
             * Input Validation
             */
            $scope.initInputValidation = function() {
                $("#contest-submission-form").validate({
                  rules: {
                    name: {
                        required: true
                    },
                    age: {
                        required: true
                    },
                    phone: {
                        required: true,
                        phoneUS: true
                    },
                    parentName: {
                        required: true
                    },
                    email: {
                      required: true,
                      email: true
                    },
                    zipCode: {
                      required: true
                    }
                  },
                  submitHandler: function(form) {
                      $scope.submit();
                  }
                });               
            };
            

            /**
             * Image Preview
             */
            $scope.initialCanvasConfig = AppConfig.fabric.coloringCanvas.initOptions;
            try {
                $scope.fabric = ColoringBookService.init();    
            }
            catch(err) {
                $location.path('');
            }
            $scope.previewImageDataURL = null;
            $scope.getPreviewImage = function() {
                $scope.previewImageDataURL 
                    = ColoringBookService.getPreviewImageDataURL()
                ;
            };
            
            /**
             * Image Download - uses html2canvas, canvasToBlob, and FileSaver
             */
            $scope.downloadContestSubmission = function() {
                ActionTrackingService
                    .page('preview')
                    .actionType('download')
                    .actionDetail('completed-coloring')
                    .recordAction()
                ;
                // for mobile, ipad, and safari browsers
                if (window.isMobile || window.isiPad || window.isSafari) {
                    
                    // download the image from the server 
                    $scope.imageDownloadHref = 'backend/public/index.php/downloadWithChrome.png'
                        + '?filename=' 
                        + Base64PNGUploadService
                            .images()
                            .link
                            .substring(
                                Base64PNGUploadService
                                    .images()
                                    .link
                                    .lastIndexOf('/')+1
                            )
                    ;
                    // console.log('going to url: ', $scope.imageDownloadHref);
                    window.location.href = $scope.imageDownloadHref;
                    
                } else { // otherwise..
    
                    // use client-side state (faster) to generate download
                	$('#preview-print').removeClass('print-only');
                	html2canvas($('#preview-print')[0], {
                        onrendered: function(canvas) {
                            canvas.toBlob(function(blob) {
                                saveAs(blob, "CircleOfLightsContestSubmission.png");
                                $('#preview-print').addClass('print-only');
                            });    
                        }
            	    });

                } // end if/else
                

            };
           
            

            /**
             * Print
             */
            $scope.print = function() {
                ActionTrackingService
                    .page('preview')
                    .actionType('print')
                    .actionDetail('completed-coloring')
                    .recordAction()
                ;
                window.print();
            };
            
            /**
             * Sharing
             */
            /**
             * Sharing
             */
            $scope.shareSettings = {
                facebookAppId : window.indystar_environment.get('shareSettings').facebookAppId,
                link        : window.indystar_environment.get('baseURL'),
                title       : 'Carson\'s Circle of Lights Coloring Contest',
                description : 'Kids ages 3-12 are invited to enter Carson\'s Coloring Contest for a chance to "flip the switch" at Circle of Lights Nov. 25 in Downtown Indy. Five finalists will each win a College Choice 529 Direct Savings Plan and a Carson\'s gift card. Enter by Nov. 14.',
                caption     : window.indystar_environment.get('shareSettings').caption,
                media       : Base64PNGUploadService.images().link,
                redirectUrl : window.indystar_environment.get('shareSettings').redirectUrl
            };
            $scope.shareSettingsTwitter = {
                facebookAppId : window.indystar_environment.get('shareSettings').facebookAppId,
                link        : '',
                title       : "Got crayons? Kids can participate in Carson's Coloring Contest for chance to \"flip the switch\" at #CircleofLights! www.downtownindy.org",
                description : '',
                caption     : window.indystar_environment.get('shareSettings').caption,
                media       : Base64PNGUploadService.images().link,
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
                // get the thumbnailUrl to submit to email server-side service
                $scope.emailData.imageUrl       = Base64PNGUploadService.images().link;
                $scope.emailData.thumbnailUrl   = Base64PNGUploadService.images().thumbnailLink;
                // console.log('sending email data: ', $scope.emailData);
                
                $scope.emailModal = $modal.open({
                    animation: true,
                    templateUrl: 'app/preview/email-modal.html?v=2.7',
                    controller: 'PreviewEmailModalCtrl',
                    size: size,
                    resolve: {
                        'Preview' : function() {
                            return $scope;
                        } 
                    }
                });
            };
            
            /**
             * Omniture
             */
            $scope.omniture = {
                section : AppConfig.omniture.defaults.section,
                extension : 'circleoflights-app-preview'
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
    ) // end PreviewCtrl



 /**
     * Preview Email Modal Controller
     */
    .controller('PreviewEmailModalCtrl', [
                    '$scope',
                    '$modalInstance', 
                    '$timeout',
                    'AppConfig',
                    'EmailService',
                    'ActionTrackingService',
                    'Preview',
        function (  $scope,
                    $modalInstance,
                    $timeout,
                    AppConfig,
                    EmailService,
                    ActionTrackingService,
                    Preview
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
                $scope.emailData = Preview.emailData;    
                $scope.emailData.message = $scope.defaultMessageContent;
                // console.log('email data initialized: ', $scope.emailData);
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
                        .page('preview')
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
                                Preview.emailModal.close();
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
    )  //end PreviewEmailModalCtrl

;