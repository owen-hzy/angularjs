/***
 Metronic AngularJS App Main Script
 ***/
"use strict";

/* Metronic App */
var MetronicApp = angular.module('MetronicApp', [
    'ui.router',
    'ui.bootstrap',
    'ngCookies',
    'angularFileUpload',
    'ngSanitize',
    'ui.select'
]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/
/**
 `$controller` will no longer look for controllers on `window`.
 The old behavior of looking on `window` for controllers was originally intended
 for use in examples, demos, and toy apps. We found that allowing global controller
 functions encouraged poor practices, so we resolved to disable this behavior by
 default.

 To migrate, register your controllers with modules rather than exposing them
 as globals:

 Before:

 ```javascript
 function MyController() {
  // ...
}
 ```

 After:

 ```javascript
 angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

 Although it's not recommended, you can re-enable the old behavior like this:

 ```javascript
 angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
 **/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout4/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout4/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(function ($stateProvider, $urlRouterProvider) {

    /*$httpProvider.interceptors.push(function($q, $injector, $localStorage) {
     return {
     'responseError': function(response) {
     if (response.status === 401) {
     delete $localStorage.token;
     $injector.get('$state').go('login');
     }
     return $q.reject(response);
     }
     };
     });*/

    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('404', {
            url: '/404',
            templateUrl: 'views/404.html',
            parent: 'home',
            data: {title: '404'}
        })

        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            data: {title: 'Login'},
            controller: 'LoginController'
        })

        .state('home', {
            templateUrl: "views/home.html",
            /*resolve: {
                authCheck: function ($q, Auth) {
                    var auth = Auth.getTokenClaims();

                    if (auth) {
                        return $q.when(auth);
                    } else {
                        return $q.reject({authenticated: false});
                    }
                }
            },*/
            controller: function ($scope) {
                $scope.$on('$viewContentLoaded', function () {
                    var authCheck = {};
                    $scope.credentials = {};
                    $scope.credentials.username = authCheck.name || 'admin';
                    $scope.credentials.roles = authCheck.role || 'Administrator';
                    $scope.credentials.userId = authCheck.id || 1;
                });
            }
        })

        // Dashboard
        .state('dashboard', {
            url: '/',
            parent: 'home',
            templateUrl: "views/dashboard.html",
            data: {pageTitle: 'Dashboard', pageSubTitle: 'statistics & reports', title: 'Dashboard'}
        })

        // User-Management
        .state('all-accounts', {
            url: '/all-accounts',
            parent: 'home',
            templateUrl: 'views/all-accounts.html',
            data: {
                title: 'All Accounts'
            },
            controller: 'AccountController'
            /*resolve: {
                users: function (HttpService, $q) {
                    var data = $q.defer();

                    HttpService.sendRequest('/WebApi/api/protected/users', 'GET', 2000, true).then(function (response) {
                        data.resolve(response);
                    }, function (error) {
                        data.resolve(error);
                    });

                    return data.promise;
                }
            }*/
        })

        .state('account-information', {
            url: '/account-information/{learnerId}',
            parent: 'home',
            templateUrl: 'views/account-information.html',
            data: {
                title: 'Account Information'
            },
            controller: 'AccountInformationController',
            resolve: {
                account: function ($q, HttpService, $stateParams) {
                    var data = $q.defer();
                    HttpService.sendRequest('/WebApi/api/protected/users/' + $stateParams.learnerId, 'GET', 5000, true)
                        .then(function (response) {
                            data.resolve(response);
                        }, function (error) {
                            data.resolve(error);
                        });
                    return data.promise;
                }
            }
        })

        .state('edit-account', {
            url: '/edit-account/{learnerId}',
            parent: 'home',
            templateUrl: 'views/edit-account.html',
            data: {
                title: 'Edit Account',
            },
            controller: 'AccountEditController',
            resolve: {
                account: function ($q, HttpService, $stateParams) {
                    var data = $q.defer();
                    HttpService.sendRequest('/WebApi/api/protected/users/' + $stateParams.learnerId, 'GET', 5000, true)
                        .then(function (response) {
                            data.resolve(response);
                        }, function (error) {
                            data.resolve(error);
                        });
                    return data.promise;
                },
                modules: function ($q, HttpService) {
                    var data = $q.defer();
                    HttpService.sendRequest('/WebApi/api/protected/module/brief', 'GET', 5000, true)
                        .then(function (response) {
                            data.resolve(response);
                        }, function (error) {
                            data.resolve(error);
                        });
                    return data.promise;
                }
            }
        })

        .state('add-account', {
            url: '/add-account',
            parent: 'home',
            templateUrl: 'views/add-account.html',
            data: {
                title: 'Add Account'
            },
            controller: 'AccountAddController',
            resolve: {
                modules: function ($q, HttpService) {
                    var data = $q.defer();
                    HttpService.sendRequest('/WebApi/api/protected/module/brief', 'GET', 5000, true)
                        .then(function (response) {
                            data.resolve(response);
                        }, function (error) {
                            data.resolve(error);
                        });
                    return data.promise;
                }
            }
        })

        .state('all-modules', {
            url: '/all-modules',
            parent: 'home',
            templateUrl: 'views/all-modules.html',
            data: {
                title: 'All Modules'
            },
            controller: 'ModuleController'
        })

        .state('pending-tasks', {
            url: '/pending-tasks',
            parent: 'home',
            templateUrl: 'views/pending-tasks.html',
            data: {
                title: 'Pending Tasks'
            },
            controller: 'PendingTaskController'
        })

        .state('add-module', {
            url: '/add-module',
            parent: 'home',
            templateUrl: 'views/add-module.html',
            data: {
                title: 'Add Module'
            },
            controller: 'ModuleAddController',
            resolve: {
                divisions: function($q, HttpService) {
                    var data = $q.defer();
                    HttpService.sendRequest('/WebApi/api/protected/division/brief', 'GET', 10000, true)
                        .then(function(response) {
                            data.resolve(response);
                        }, function(error) {
                            data.reject(error);
                        });
                    return data.promise;
                }
            }
        })

        .state('module-information', {
            url: '/module-information/{moduleId}',
            parent: 'home',
            templateUrl: 'views/module-information.html',
            data: {
                pageTitle: 'Module Information',
                title: 'Module Information'
            },
            controller: 'ModuleInfoController',
            resolve: {
                module: function($q, HttpService, $stateParams) {
                    var data = $q.defer();
                    HttpService.sendRequest('/WebApi/api/protected/module/' + $stateParams.moduleId, 'GET', 10000, true)
                        .then(function(response) {
                            data.resolve(response);
                        }, function(error) {
                            data.reject(error);
                        });
                    return data.promise;
                },
                history3: function($q, HttpService, $stateParams) {
                    var data = $q.defer();
                    HttpService.sendRequest('/WebApi/api/protected/module/' + $stateParams.moduleId + '/history3', 'GET', 10000, true)
                        .then(function(response) {
                            data.resolve(response);
                        }, function(error) {
                            data.reject(error);
                        });
                    return data.promise;
                },
                currentVersionExist: function($q, HttpService, $stateParams) {
                    var data = $q.defer();
                    HttpService.sendRequest('/WebApi/api/protected/page/' + $stateParams.moduleId + '/exist', 'GET', 10000, true)
                        .then(function(response) {
                            data.resolve(response);
                        }, function(error) {
                            data.reject(error);
                        });
                    return data.promise;
                }
            }
        })

        .state('edit-module', {
            url: '/edit-module/{moduleId}',
            parent: 'home',
            templateUrl: 'views/edit-module.html',
            data: {
                title: 'Edit Module'
            },
            controller: 'ModuleEditController',
            resolve: {
                module: function($q, HttpService, $stateParams) {
                    var data = $q.defer();
                    HttpService.sendRequest('/WebApi/api/protected/module/' + $stateParams.moduleId, 'GET', 10000, true)
                        .then(function(response) {
                            data.resolve(response);
                        }, function(error) {
                            data.reject(error);
                        });
                    return data.promise;
                },
                divisions: function($q, HttpService) {
                    var data = $q.defer();
                    HttpService.sendRequest('/WebApi/api/protected/division/brief', 'GET', 10000, true)
                        .then(function(response) {
                            data.resolve(response);
                        }, function(error) {
                            data.reject(error);
                        });
                    return data.promise;
                }
            }
        })

        .state('module-content', {
            url: '/module-content',
            parent: 'home',
            templateUrl: 'views/module-content.html',
            data: {
                title: 'Module Content'
            },
            controller: 'ModuleContentController'
        })

        .state('user-guide', {
            url: '/user-guide',
            parent: 'home',
            templateUrl: 'views/user-guide.html',
            data: {title: 'User Guide'}
        })

        .state('faq', {
            url: '/faq',
            parent: 'home',
            templateUrl: 'views/faq.html',
            data: {title: 'FAQ'}
        })

        .state('contact-us', {
            url: '/contact-us',
            parent: 'home',
            templateUrl: 'views/contact-us.html',
            data: {title: 'Contact Us'}
        })

        .state('profile', {
            url: '/profile',
            parent: 'home',
            templateUrl: 'views/profile.html',
            data: {title: 'User Profile'}
        })

        .state('slider-image', {
            url: '/slider-image',
            parent: 'home',
            templateUrl: 'views/slider-image.html',
            data: {title: 'Slider Image', pageTitle: 'Slider Image Maintenance'},
            controller: 'SliderImageController',
            resolve: {
                images: function ($q, HttpService) {
                    var data = $q.defer();
                    HttpService.sendRequest('/WebApi/api/protected/slider', 'GET', 3000, true)
                        .then(function (response) {
                            data.resolve(response);
                        }, function (error) {
                            data.resolve(error);
                        });
                    return data.promise;
                }
            }
        })

        .state('division-maintenance', {
            url: '/division-maintenance',
            parent: 'home',
            templateUrl: 'views/division-maintenance.html',
            data: {title: 'Division Maintenance', pageTitle: 'Division Maintenance'},
            controller: 'DivisionController',
            resolve: {
                divisions: function ($q, HttpService) {
                    var data = $q.defer();
                    HttpService.sendRequest('/WebApi/api/protected/division', 'GET', 3000, true)
                        .then(function (response) {
                            data.resolve(response);
                        }, function (error) {
                            data.resolve(error);
                        });
                    return data.promise;
                }
            }
        });
});

/* Init global settings and run the app */
MetronicApp.run(function ($rootScope, settings, $state) {
    $rootScope.roles = ["Administrator", "ModuleOwner"];
    $rootScope.displayStatus = ["Active", "Inactive"];
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$on("$stateChangeError", function (event, toState, toParas, fromState, fromParams, error) {
        event.preventDefault();
        if (angular.isObject(error)) {
            if (!error.authenticated) {
                $state.go('login');
            }
        }
    });
});