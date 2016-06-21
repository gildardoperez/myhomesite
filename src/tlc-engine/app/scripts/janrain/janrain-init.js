/*
Janrain initializations and settings for JUMP.

For more information about these settings, see the following documents:

    http://developers.janrain.com/documentation/widgets/social-sign-in-widget/social-sign-in-widget-api/settings/
    http://developers.janrain.com/documentation/widgets/user-registration-widget/capture-widget-api/settings/
    http://developers.janrain.com/documentation/widgets/social-sharing-widget/sharing-widget-js-api/settings/
*/

(function() {

    window.janrain = {};
    window.janrain.settings = {};
    window.janrain.settings.capture = {};

    janrain.settings.packages = ['login', 'capture'];

    // --- Engage Widget -------------------------------------------------------

    janrain.settings.language = 'en-US';
    janrain.settings.appUrl = 'https://login.mris.com';
    janrain.settings.tokenUrl = 'http://localhost/';
    janrain.settings.tokenAction = 'event';
    janrain.settings.borderColor = '#ffffff';
    janrain.settings.fontFamily = 'Helvetica, Lucida Grande, Verdana, sans-serif';
    janrain.settings.width = 300;
    janrain.settings.actionText = ' ';

    // --- Capture Widget ------------------------------------------------------

    // For Dev Environment
    // janrain.settings.capture.appId = '3mnd2fzc5byaektxwjuj2gzn25';
    //janrain.settings.capture.captureServer = 'https://mris.dev.janraincapture.com';
    // janrain.settings.capture.clientId = 'rwc3k4zp9nkbzhh7m8pd4cerrhbqy5xa';

    
    // For Test Environment
    //janrain.settings.capture.appId = 'ybdfkg5uta5qcn84zxxb4nuwdu';
    //janrain.settings.capture.captureServer = 'https://mris.janraincapture.com';
    //janrain.settings.capture.clientId = '2dhevy2tw8upe6kqcg59jhncuq85rrdx'; 
    //janrain.settings.capture.clientId = 'm27upf4kzanmj6f9abmyn4gupb5r9ph9';


    // For Test Environment
    janrain.settings.capture.federate = true;
    janrain.settings.capture.federateServer='https://mris.janrainsso.com';
    janrain.settings.capture.captureServer='https://mris.janraincapture.com';
    janrain.settings.capture.appId='ybdfkg5uta5qcn84zxxb4nuwdu';
    janrain.settings.capture.clientId='7wesymas8tjbkm7te3xbe5mntuun223a';
    // janrain.settings.capture.clientSecret='2dhevy2tw8upe6kqcg59jhncuq85rrdx';
    janrain.settings.capture.clientSecret='gr835um9zajz638bkg7jvfqvpxpzwdmh';

    janrain.settings.capture.redirectUri = 'http://localhost/';
    janrain.settings.capture.confirmModalClose = false;
    janrain.settings.capture.flowName = 'standard';
    janrain.settings.capture.mode13 = true;
    janrain.settings.capture.flowVersion = 'HEAD';
    janrain.settings.capture.registerFlow = 'socialRegistration';
    janrain.settings.capture.setProfileCookie = true;
    janrain.settings.capture.keepProfileCookieAfterLogout = true;
    janrain.settings.capture.modalCloseHtml = '<span class="janrain-icon-16 janrain-icon-ex2"></span>';
    janrain.settings.capture.noModalBorderInlineCss = true;
    janrain.settings.capture.responseType = 'token';
    janrain.settings.capture.returnExperienceUserData = ['displayName'];
//    janrain.settings.capture.stylesheets = ['styles/janrain.css'];
//    janrain.settings.capture.mobileStylesheets = ['styles/janrain-mobile.css'];

    // --- Mobile WebView ------------------------------------------------------

    //janrain.settings.capture.redirectFlow = true;
    //janrain.settings.popup = false;
    //janrain.settings.tokenAction = 'url';
    //janrain.settings.capture.registerFlow = 'socialMobileRegistration'

    // --- Load URLs -----------------------------------------------------------

    // var httpsLoadUrl = "https://rpxnow.com/load/mris-dev";
    // var httpLoadUrl = "http://widget-cdn.rpxnow.com/load/mris-dev";

    var httpsLoadUrl = "https://rpxnow.com/js/lib/login.mris.com/engage.js";
    var httpLoadUrl = "http://widget-cdn.rpxnow.com/js/lib/login.mris.com/engage.js";

    // --- DO NOT EDIT BELOW THIS LINE -----------------------------------------

    function isReady() { janrain.ready = true; };
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", isReady, false);
    } else {
        window.attachEvent('onload', isReady);
    }

    var e = document.createElement('script');
    e.type = 'text/javascript';
    e.id = 'janrainAuthWidget';
    if (document.location.protocol === 'https:') {
        e.src = httpsLoadUrl;
    } else {
        e.src = httpLoadUrl;
    }
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(e, s);
})();

function janrainReturnExperience() {
//    var span = document.getElementById('traditionalWelcomeName');
//    var name = janrain.capture.ui.getReturnExperienceData("displayName");
//    if (span && name) {
//        span.innerHTML = "Welcome back, " + name + "!";
//    }
}
