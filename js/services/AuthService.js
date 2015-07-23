'use strict';

MetronicApp.factory('Auth', function($http, $localStorage, HttpService) {
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
            //$http.post('/api/public/login', data, { timeout: 1 }).success(successCallback).error(errorCallback);
            HttpService.sendRequest('api/public/login', 'POST', 2000, false, data).then(function(response){
                if (response.accessToken) {
                    $localStorage.token = response.accessToken;
                    delete response.accessToken;
                }
                if (successCallback) {
                    successCallback(response);
                } 
            }, function(error) {
                if (errorCallback) {
                    errorCallback(error);
                }
            });
        },
        logout: function(successCallback) {
            delete $localStorage.token;
            if (successCallback) {
                successCallback();
            }
        },
        getTokenClaims: function() {
            return getClaimsFromToken();
        }
    };
});