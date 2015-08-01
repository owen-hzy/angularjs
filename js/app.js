/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router", 
    "ui.bootstrap",
    "ngStorage", 
    "oc.lazyLoad",  
    "ngSanitize",
    "ui.grid",
    "ui.grid.selection"
]); 

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    });
}]);

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
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
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
MetronicApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(function($stateProvider, $urlRouterProvider) {

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
    $urlRouterProvider.otherwise("/404");

    $stateProvider
        .state('404', {
            url: '/404',
            templateUrl: 'views/404.html',
            parent: 'home',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/admin/pages/css/error.css'
                        ] 
                    });
                }]
            },
            data: {title: '404'}
        })

        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            data: {title: 'Login'},
            controller: 'LoginController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'assets/admin/pages/css/login.css',
                            
                            'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                            'assets/admin/pages/scripts/login.js',
                            'js/controllers/LoginController.js'
                        ]
                    });
                }]
            }
        })

        .state('home', {
            templateUrl: "views/home.html",
            //resolve: {
            //    authCheck: function($q, Auth) {
            //        var auth = Auth.getTokenClaims();
            //
            //        if (auth) {
            //            return $q.when(auth);
            //        } else {
            //            return $q.reject({authenticated: false});
            //        }
            //    }
            //},
            controller: function($scope) {
                $scope.$on('$viewContentLoaded', function() {
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
            data: {pageTitle: 'Dashboard', pageSubTitle: 'statistics & reports', title: 'Dashboard'},
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/morris/morris.css',
                            'assets/admin/pages/css/tasks.css',
                            
                            'assets/global/plugins/morris/morris.min.js',
                            'assets/global/plugins/morris/raphael-min.js',
                            'assets/global/plugins/jquery.sparkline.min.js',

                            'assets/admin/pages/scripts/index3.js',
                            'assets/admin/pages/scripts/tasks.js'
                        ] 
                    });
                }]
            }
        })

        // User-Management
        .state('account-management', {
            url: '/account-management',
            parent: 'home',
            templateUrl: 'views/account-management.html',
            data: {pageTitle: 'Account-Management', pageSubTitle: 'perform account management', title: 'Account Management'},
            controller: 'AccountManagementController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'assets/global/plugins/angularjs/plugins/angular-ui-grid/ui-grid.min.css',          
                            'assets/admin/pages/scripts/bootstrap-select.js',
                            'js/controllers/AccountManagementController.js'
                        ]
                    });
                }],
                users: function(HttpService, $q) {
                    var data = $q.defer();

                    HttpService.sendRequest('/api/protected/users', 'GET', 2000, true).then(function(response) {
                        data.resolve(response);
                    }, function(error) {
                        data.resolve(error);
                    });

                    return data.promise;
                }
            }
        })

        .state('module-management', {
            url: '/module-management',
            parent: 'home',
            templateUrl: 'views/module-management.html',
            data: {pageTitle: 'Module-Management', pageSubTitle: 'perform module management', title: 'Module Management'}
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
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/directives/fileUpload.js',
                            'js/controllers/SliderImageController.js'
                        ]
                    });
                }],
                images: function($q, HttpService) {
                    var data = $q.defer();
                    HttpService.sendRequest('api/protected/slider', 'GET', 3000, true)
                        .then(function(response) {
                            data.resolve(response);
                        }, function(error) {
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
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/directives/fileUpload.js',
                            'js/controllers/DivisionController.js'
                        ]
                    });
                }],
                divisions: function($q, HttpService) {
                    var data = $q.defer();
                    HttpService.sendRequest('/api/protected/division', 'GET', 3000, true)
                        .then(function(response) {
                           data.resolve(response);
                        }, function(error) {
                           data.resolve(error);
                        });
                    return data.promise;
                }
            }
        });
});

/* Init global settings and run the app */
MetronicApp.run(function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$on("$stateChangeError", function(event, toState, toParas, fromState, fromParams, error) {
        event.preventDefault();
        if (angular.isObject(error)) {
            if (! error.authenticated) {
                $state.go('login');
            }
        }
    });
});