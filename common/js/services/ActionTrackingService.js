/**
 * Email Service 
 */
 angular.module('ActionTrackingService', [])
    .factory('ActionTrackingService', [
            '$http',
            'AppConfig',
        function(
            $http,
            AppConfig
        )
        {
            return {
                
                _settings : {
                    apiKey          : null,
                    page            : null,
                    actionType      : null,
                    actionDetail    : null
                },
                apiKey: function(apiKey) {
                    this._settings.apiKey = apiKey
                    return this;
                },
                page: function(page) {
                    this._settings.page = page;
                    return this;
                },
                actionType: function(actionType) {
                    this._settings.actionType = actionType;
                    return this;
                },
                actionDetail: function(actionDetail) {
                    this._settings.actionDetail = actionDetail;
                    return this;
                },
                recordAction: function() {
                    this.apiKey(AppConfig.ActionTrackingApiKey);
                    $http.post(
                        AppConfig.apiEndpoints.actionTracking,
                        this._settings
                    );
                }
                
            };
            
        }
    ])
;
        