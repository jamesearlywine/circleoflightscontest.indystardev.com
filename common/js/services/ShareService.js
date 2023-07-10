/**
 * A Simple Share Service for AngularJS
 */
 angular.module('ShareService', [])
    .factory('ShareService', [
        
        
        function(

        )
        {
            return {
                
                // default settings
                _settings: {
                    
                },
                shareWindowOptions : 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600',
                defaultNetwork: 'facebook',
                // override default/existing settings with some new ones
                settings: function(arrSettings) {
                    if (arrSettings !== undefined) {
                        angular.extend(this._settings, arrSettings);      
                    }
                    return this;
                },
                share : function(network) {
                    if (network === undefined) {
                        network = this.defaultNetwork;
                    }
                    network = network.toLowerCase();
                    
                    switch(network) {
                        case 'facebook':
                            return this._shareFacebook();
                            break;
                        case 'twitter':
                            return this._shareTwitter();
                            break;
                        case 'pinterest':
                            return this._sharePinterest();
                            break;
                        case 'googleplus':
                            return this._shareGooglePlus();
                            break;
                        case 'linkedin':
                            return this._shareTwitter();
                            break;
                        case 'email':
                            return this._shareLinkedIn();
                            break;
                        
                            default:
                            return null;
                    }
                },
                _shareFacebook : function() {
                    var fbLink = 'https://www.facebook.com/dialog/feed?app_id=' 
                        + this._settings.facebookAppId
                        + '&link='          + encodeURIComponent(this._settings.link)
                        + '&picture='       + encodeURIComponent(this._settings.media)
                        + '&name='          + encodeURIComponent(this._settings.title) 
                        + '&caption='       + encodeURIComponent(this._settings.caption) 
                        + '&description='   + encodeURIComponent(this._settings.description) 
                        + '&redirect_uri='  + encodeURIComponent(this._settings.redirectUrl)
                        + '&display=popup'
                    ;        
                    window.open(
                        fbLink,
                        'Facebook',
                        this.shareWindowOptions
                    );
                },
                _shareTwitter : function() {
                    var twitterLink = 'https://twitter.com/intent/tweet?original_referer=' 
                        + encodeURIComponent(this._settings.link) 
                        + '&text=' + encodeURIComponent(this._settings.title) 
                        + '%20' + encodeURIComponent(this._settings.link)
                    window.open(
                        twitterLink,
                        'Twitter',
                        this.shareWindowOptions
                    );
                },
                _sharePinterest : function() {
                    var pinterestLink = "https://pinterest.com/pin/create/button"
                        + '?url='   + encodeURIComponent(this._settings.link)
                        + '&media=' + encodeURIComponent(this._settings.media)
                        + '&description=' + encodeURIComponent(this._settings.title)
                    ;
                    window.open(
                        pinterestLink,
                        'Pinterest',
                        this.shareWindowOptions
                    );
                },
                _shareGooglePlus : function() {
                    var googlePlusLink = 'https://plus.google.com/share'
                        + '?url=' + encodeURIComponent(this._settings.link + '?cb=123') 
                    ;
                    window.open(
                        googlePlusLink,
                        'GooglePlus',
                        this.shareWindowOptions
                    );
                },
                _shareLinkedIn : function() {
                    var linkedInLink = 'https://www.linkedin.com/shareArticle'
                        + '?mini=true'
                        + '&url='       + encodeURIComponent(this._settings.link)
                        + '&title='     + encodeURIComponent(this._settings.title)
                        + '&source='    + encodeURIComponent(this._settings.link)
                    ;
                    window.open(
                        linkedInLink,
                        'LinkedIn',
                        this.shareWindowOptions
                    );
                    
                },
                
                
                _shareEmail: function() {
                    var emailLink = 'mailto:?'
                        + 'subject='    + encodeURIComponent(this._settings.emailSubject)
                        + '&body='      + encodeURIComponent(this._settings.emailBody)
                        ;
                        // console.log('email link: ', emailLink);
                    window.location.href = emailLink;
                }

            };
            
        }
    ])
;