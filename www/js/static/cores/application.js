define([
        'ionic',
        'modules',
        'settings',
        'extendScope'
    ],
    function(ionic, modules, settings, $extendScope) {

        var Application = function(settings) {
            this.appName = settings.appName;
            this.settings = settings;

            this.modules = new Array();
            this.modulePaths = new Array();

            this.routers = new Array();
            this.directives = new Array();
            this.factories = new Array();

            this.menus = new Array();
            this.controllers = new Array();

            this.currentController = null;

            var dis = this;

            angular.module(this.appName, [
                'ionic',
                'ui.router',

            ]).config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {

                // Turn off js scroll
                if (!ionic.Platform.isIOS() && !ionic.Platform.isIPad()) {
                    $ionicConfigProvider.scrolling.jsScrolling(false);
                }

                // Turn off animate transition
                $ionicConfigProvider.views.transition('none');

                // Add white list src
                $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|content|file):/);

                $stateProvider
                    .state('app', {
                        url: "/app",
                        abstract: true,
                        templateUrl: "js/app/static/templates/menu.html",
                        controller: 'DefaultCtr'
                    });

                // Default router...
                $urlRouterProvider.otherwise('/app/' + dis.settings.homeUrl);

            }).controller('DefaultCtr', function($scope, $ionicModal, $timeout, $rootScope, $state) {
                // console.log($state);

                $.extend($scope, $extendScope);
                $scope.menus = MyApp.menus;
                $scope.controllers = MyApp.controllers;
                $scope.getUser();

                $rootScope.$on('user.change', function() {
                    $scope.getUser();
                });
            });
        };

        Application.prototype.registerModule = function(sModule) {
            if (this.modules.indexOf(sModule) != -1) {
                console.log('Module has already exist.');
                return;
            }
            this.modules.push(sModule);
            return this;
        };

        Application.prototype._createRouter = function(sRouter, sController, $module) {
            var state = 'app.' + sController.replace('.', '_');
            var sTemplate = 'js/app/module/' + $module.sModule + '/templates/' + $module.sController + '.html';

            angular.module(this.appName).config(function($stateProvider, $urlRouterProvider) {

                var config = {
                    // cache template for view
                    // cache : false,
                    url: "/" + sRouter,
                    views: {}
                };
                var sContent = 'menuContent-' + sController;
                var sContent = 'menuContent';
                config.views[sContent] = {
                    templateUrl: sTemplate,
                    controller: sController
                };

                $stateProvider.state(state, config);
            });
        };

        Application.prototype._createController = function(sController, $module, $controller) {
            var sControllerPath = 'app/module/' + $module.sModule + '/controllers/' + $module.sController;
            var dis = this;
            var sArgs = $controller.getArgs().join();
            console.log('Add controller ' + sController + '...');
            var sFunc = 'var func = function(' + sArgs + '){ ' + (sArgs.indexOf('$scope') != -1 ? '$.extend($scope, $extendScope);$scope.module = $module;' : '') + 'dis.currentController = $module; return $controller(' + sArgs + ');}'
            eval(sFunc);
            angular.module(this.appName)
                .controller(sController, func);
        }

        Application.prototype.addController = function(sRouter, sController, bNoTemplate) {
            var aParts = sController.split('.');
            if (this.modules.indexOf(aParts[0]) == -1) {
                return false;
            }
            var sController = aParts[0].ucFrist() + aParts[1].ucFrist();

            var $module = {
                sModule: aParts[0],
                sController: aParts[1]
            };

            if (this.controllers.indexOf(sController) == -1) {
                this.controllers.push(sController);
            }
            var sControllerPath = 'app/module/' + $module.sModule + '/controllers/' + $module.sController;
            console.log(sControllerPath);
            var dis = this;

            require([sControllerPath], function($controller) {
                if ((typeof bNoTemplate === 'undefined') || (typeof bNoTemplate !== 'undefined' && bNoTemplate == false)) {
                    dis._createRouter(sRouter, sController, $module);
                }

                dis._createController(sController, $module, $controller);
            });

            return this;
        }

        Application.prototype.addDirective = function(sDirective, params) {
            var aParts = sDirective.split('.');
            var sDirectiveName = aParts[0].replace('_', '') + aParts[1].ucFrist() + 'Dir';

            var $module = {
                sModule: aParts[0],
                sDirective: aParts[1]
            };
            if ($module.sModule.indexOf('_') != -1) {
                $module.sModule = $module.sModule.split('_')[0];
            }
            var option = {
                restrict: (typeof params !== 'undefined' && typeof params.restrict !== 'undefined' ? params.restrict : 'E'),
                templateUrl: (typeof params !== 'undefined' && typeof params.templateUrl !== 'undefined' ? params.templateUrl : 'js/app/module/' + $module.sModule + '/templates/' + $module.sDirective + '.html'),
                replace: true,
                scope: {
                    obj: '=obj'
                }
            };

            var bController = false;
            if (typeof params !== 'undefined' && typeof params.controller !== 'undefined') {
                if (params.controller) {
                    bController = true;
                }
            }
            console.log('Add directive: ' + sDirectiveName);
            if (!bController) {
                angular.module(this.appName)
                    .directive(sDirectiveName, function() {
                        return option;
                    });
            } else {
                var sControllerPath = 'app/module/' + $module.sModule + '/controllers/' + $module.sDirective + 'Dir';
                console.log(sControllerPath);
                require([sControllerPath], function($controller) {
                    option.controller = $controller;
                    angular.module(MyApp.appName)
                        .directive(sDirectiveName, function() {
                            return option;
                        });
                });
            }
        }

        Application.prototype.addFactory = function(factoryName) {
            var aParts = factoryName.split('.');
            var $module = {
                sModule: aParts[0],
                sFactory: aParts[1]
            };

            var sFactoryPath = 'app/module/' + $module.sModule + '/factories/' + $module.sFactory;
            console.log(sFactoryPath);
            var dis = this;
            require([sFactoryPath], function($factory) {
                console.log('Load facory: ' + factoryName);

                dis.factories.push(factoryName);
                angular.module(dis.appName).factory('$' + $module.sFactory, $factory);
            });
            return this;
        }

        Application.prototype.start = function() {
            angular.module(this.appName).run(function($ionicPlatform) {
                console.log('Start application...');
                $ionicPlatform.ready(function() {
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    if (window.cordova && window.cordova.plugins.Keyboard) {
                        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    }
                    if (window.StatusBar) {
                        // org.apache.cordova.statusbar required
                        StatusBar.styleDefault();
                    }
                });
            });
        }

        Application.prototype.loadModules = function(modules) {
            var modulePaths = [];
            for (i = 0; i < modules.length; i++) {
                modulePaths.push('../app/module/' + modules[i] + '/run');
            }
            this.modulePaths = modulePaths;
            modulePaths.push('controllers');
            modulePaths.push('services');
            modulePaths.push('directives');

            require(modulePaths, function() {
                console.log('Load all modules complete...');
                require([
                        'bootstrap'
                    ],
                    function() {
                        console.log('load bootstrap successfully...');
                    });
            });
        }

        Application.prototype.addMenu = function(title, link) {
            this.menus.push({
                title: title,
                link: link
            });
            return this;
        }

        MyApp = new Application(settings);
        MyApp.loadModules(modules);

        return MyApp;
    });
