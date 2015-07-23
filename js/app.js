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

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
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
    $urlRouterProvider.otherwise("/");

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
            }
        })

        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            data: {pageTitle: 'Login'},
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
            resolve: {
                authCheck: function($q, Auth) {
                    var auth = Auth.getTokenClaims();

                    if (auth) {
                        return $q.when(auth);
                    } else {
                        return $q.reject({authenticated: false});
                    }
                }
            },
            controller: function($scope, authCheck) {
                $scope.$on('$viewContentLoaded', function() {   
                // initialize core components
                    Metronic.initAjax();
                    $scope.credentials = {};
                    $scope.credentials.username = authCheck.name;
                    $scope.credentials.roles = authCheck.role;
                    $scope.credentials.userId = authCheck.id;
                });
            }
        })

        // Dashboard
        .state('dashboard', {
            url: '/',
            parent: 'home',
            templateUrl: "views/dashboard.html",            
            data: {pageTitle: 'Dashboard', pageSubTitle: 'statistics & reports'},
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
        .state('users-management', {
            url: '/users-management',
            parent: 'home',
            templateUrl: 'views/users-management.html',
            data: {pageTitle: 'Users-Management', pageSubTitle: 'perform users management'},
            controller: 'UsersManagementController',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'assets/global/plugins/angularjs/plugins/angular-ui-grid/ui-grid.min.css',          
                            'assets/admin/pages/scripts/bootstrap-select.js',
                            'js/controllers/UsersManagementController.js'
                        ]
                    });
                }]
            }
        })

        .state('courses-management', {
            url: '/courses-management',
            parent: 'home',
            templateUrl: 'views/courses-management.html',
            data: {pageTitle: 'Courses-Management', pageSubTitle: 'perform courses management'}
        })

        .state('content-management', {
            url: '/content-management',
            parent: 'home',
            templateUrl: 'views/content-management.html',
            data: {pageTitle: 'Content-Management', pageSubTitle: 'perform content management'}
        })

        // AngularJS plugins
        .state('fileupload', {
            url: "/file_upload.html",
            templateUrl: "views/file_upload.html",
            data: {pageTitle: 'AngularJS File Upload', pageSubTitle: 'angularjs file upload'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            'assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ] 
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })         

        // User Profile
        .state("profile", {
            url: "/profile",
            parent: 'home',
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'User Profile', pageSubTitle: 'user profile sample'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            'assets/admin/pages/css/profile.css',
                            'assets/admin/pages/css/tasks.css',
                            
                            'assets/global/plugins/jquery.sparkline.min.js',
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            'assets/admin/pages/scripts/profile.js',

                            'js/controllers/UserProfileController.js'
                        ]                    
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {pageTitle: 'User Profile', pageSubTitle: 'user profile dashboard sample'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account', pageSubTitle: 'user profile account sample'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {pageTitle: 'User Help', pageSubTitle: 'user profile help sample'}      
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