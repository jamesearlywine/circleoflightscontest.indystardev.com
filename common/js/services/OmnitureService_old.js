angular.module('OmnitureService', [])
    .factory('OmnitureService', [
            '$http',
            'AppConfig',
        function(
            $http,
            AppConfig
        ) {
            
            return {
                
                settings : {
                    baseEndpoint    : AppConfig.omniture.endpoint,
                    section         : AppConfig.omniture.defaults.section,
                    extension       : AppConfig.omniture.defaults.section,
                    url             : null
                },
                _iFrameElement : null,
                set : function(key, value) {
                    if (value !== undefined) {
                        this.settings[key] = value;
                        return this;
                    }
                    return this.settings[key];
                },
                report : function() {
                    this._buildURL();
                    
                    // console.log('building omniture iframe transport');
                    $('#omnitureTrackingiFrameTranpsort').remove();
                    this._iFrameElement = $('<iframe />');
                    $(this._iFrameElement).css({
                        'width': '0px',
                        'height': '0px',
                        'visibility' : 'hidden'
                    })
                    $(this._iFrameElement).attr('id', 'omnitureTrackingiFrameTranpsort');
                    $(this._iFrameElement).appendTo('body');
                    // loading the omniture tracking transport page
                    $(this._iFrameElement).attr('src', this.settings.url);
                },
                _buildURL : function() {
                    this.settings.url = this.settings.baseEndpoint 
                                + '?section='   + encodeURIComponent(this.settings.section)
                                + '&extension=' + encodeURIComponent(this.settings.extension)
                    ;
                }
                
                
                
            };
            
        }
        
    ])
;
    