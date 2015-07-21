'use strict';

MetronicApp.factory('Auth', function($http, $localStorage) {
    function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string';
        }
        return window.atob(output);
    };

    function getClaimsFromToken() {
        var token = $localStorage.token;
        var claim = null;
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            claim = JSON.parse(urlBase64Decode(encoded));
        }
        return claim;
    };

    return {
        signin: function(data, successCallback, errorCallback) {
            $http.post('/api/public/login', data).success(successCallback).error(errorCallback);
        },
        logout: function(successCallback) {
            delete $localStorage.token;
            successCallback();
        },
        getTokenClaims: function() {
            return getClaimsFromToken();
        }
    };
});