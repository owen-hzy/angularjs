"use strict";

// Set a httpService to control timeout and append token automatically if withToken is set to true
MetronicApp.factory("HttpService", function($http, $q, $cookies){
	return {
		"sendRequest": function(url, method, timeoutMilliSeconds, withToken, data, contentType) {
			var timeoutPromise = $q.defer(),
				isTimeout = false,
				result = $q.defer();

			setTimeout(function() {
				isTimeout = true;
				timeoutPromise.resolve();
			}, timeoutMilliSeconds);

			var config = {
				url: url,
				method: method,
				timeout: timeoutPromise.promise
			};

			if (typeof data !== 'undefined') {
				config.data = data;
			}
			if (withToken) {
				config.headers = {Authorization: 'Bearer ' + $cookies.get('token')};
			}

			if (contentType) {
				if (! config.headers) {
					config.headers = {'Content-Type': contentType};
				} else {
					config.headers['Content-Type'] = contentType;
				}
			}

			$http(config).success(function(data) {
				result.resolve(data);
			}).error(function(data) {
				if (isTimeout) {
					result.reject({
						errorMessage: 'timeout'
					});
				}
				else {
					result.reject(data);
				}
			});

			return result.promise;
		}
	}
});