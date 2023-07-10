/**
 * This service serves as a high-level functional wrapper for the Fabric service (vendor code)
 * It contains application-specific functions for leveraging the angular-fabric library
 * to satisfy the coloring book application functional requirements
 */

angular.module('Base64PNGUploadService', [])
    .factory('Base64PNGUploadService', [
        '$http',
        function(
            $http
        )
        {
            
            return {
                
                _settings: {
                    endpoint    : null,
                    base64      : null,
                    response    : null,
                    images      : {
                        link        : null,
                        thumbnail   : null
                    }
                },
                
                settings: function(settings) {
                    angular.extend(this._settings, settings);
                    return this;
                },
                
                base64 : function(base64) {
                    if (base64 === undefined) {
                        return this._settings.base64
                    }
                    this._settings.base64 = base64;
                    return this;
                },
                
                endpoint : function(endpoint) {
                    if (endpoint === undefined) {
                        return this._settings.endpoint
                    }
                    this._settings.endpoint = endpoint;
                    return this;
                },
                images : function(images) {
                    if (images === undefined) {
                        return this._settings.images
                    }
                    this._settings.images = images;
                    return this;
                },
                
                send : function(settings) {
                    if (settings !== undefined) {
                        this.settings(settings);
                    }
                    
                    return $http
                                .post(
                                    this.endpoint(),
                                    {
                                        'imageBase64' : this.base64()
                                    },
                                    {}
                                )
                                .then(function(response) {
                                    this._settings.response = response;
                                    this.images(this._settings.response.data);
                                    return response;
                                }.bind(this))
                    ;
                    
                }
                
                
                
                
            };
            
        }
        
    ]);