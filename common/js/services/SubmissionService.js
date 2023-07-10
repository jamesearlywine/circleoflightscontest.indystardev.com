/**
 * Email Service 
 */
 angular.module('SubmissionService', [])
    .factory('SubmissionService', [
        '$http',
        'usSpinnerService',
        
        function(
            $http,
            usSpinnerService
        )
        {
            return {
                
                _settings : {
                    endpoint: null,
                    values: {
                        to: null,
                        from: null,
                        subject: null,
                        message: null
                    },
                    loadingAnimation: true
                },
                
                
                set : function(key, value) {
                    if (value === undefined) {
                        angular.extend(this._settings.values, key);
                    }
                    this._settings.values[key] = value;
                    return this;
                },
                get : function(key) {
                    return this._settings.values[key];  
                },
                reset : function() {
                    this._settings.values = {};
                    return this;
                },
                endpoint : function(endpoint) {
                    if (endpoint === undefined) {
                        return this._settings.endpoint;
                    }
                    this._settings.endpoint = endpoint;
                    return this;
                },
                loadingAnimation : function(bool) {
                    this._settings.loadingAnimation = bool;
                    return this;
                },
                submit : function(values) {
                    if (values !== undefined) {
                        this.set(values);
                    }
                    if (this._settings.loadingAnimation) {
                        usSpinnerService.spin('busy');    
                    }
                    
                    return $http.post(
                                        this._settings.endpoint,
                                        this._settings.values
                                    ).then(function(response) {
                                        if (this._settings.loadingAnimation) {
                                            usSpinnerService.stop('busy');    
                                        }
                                        return response;
                                    }.bind(this), function(response) {
                                        if (this._settings.loadingAnimation) {
                                            usSpinnerService.stop('busy');    
                                        }
                                        return response;
                                    }.bind(this))
                    ;
                }
                
                
            };
            
        }
    ])
;
        