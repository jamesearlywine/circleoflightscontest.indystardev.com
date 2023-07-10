/**
 * Email Service 
 */
 angular.module('EmailService', [])
    .factory('EmailService', [
        '$http',
        'usSpinnerService',
        
        function(
            $http,
            usSpinnerService
        )
        {
            return {
                
                _settings : {
                    endpoints : {
                        sendEmail: ''
                    },
                    email: {
                        to: null,
                        from: null,
                        subject: null,
                        message: null
                    },
                    imageUrl: null
                },
                
                
                endpoints : function(endpointSettings) {
                    if (endpointSettings === undefined) {
                        return this._settings.endpoints;
                    }
                    angular.extend(this._settings.endpoints, endpointSettings);
                    return this;
                },
                email : function(emailSettings) {
                    if (emailSettings === undefined) {
                        return this._settings.email;
                    }
                    angular.extend(this._settings.email, emailSettings);
                    return this;
                },
                send : function(emailSettings) {
                    if (emailSettings !== undefined) {
                        this.email(emailSettings);
                    }
                    // console.log('sending this email: ', this.email());
                    usSpinnerService.spin('busy');
                    return $http.post(
                                        this._settings.endpoints.sendEmail,
                                        this.email()
                                    ).then(function(response) {
                                        usSpinnerService.stop('busy');
                                        return response;
                                    }, function(response) {
                                        usSpinnerService.stop('busy');
                                        return response;
                                    })
                    ;
                }
                
                
            };
            
        }
    ])
;
        