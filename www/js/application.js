define([
        'ionic',
        'modules',
        'settings',
        'extendScope',
        'ngcordova',
        'corePath/controllers/menu'
    ],
    function(ionic, modules, settings, $extendScope, ngcordova, $menuCtrl) {

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
            this.controllerObjects = [];

            this.controllerPaths = [];

            this.viewer = null;

            this.token = null;

            this.bLiveSite = false;

            var dis = this;

            angular.module(this.appName, [
                    'ionic',
                    'ui.router',
                    'ngCordova'

                ]).config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {

                    // Turn off js scroll if current platform different ios or ipad
                    // if (!ionic.Platform.isIOS() && !ionic.Platform.isIPad()) {
                    //     console.log('Turn off ionic scroll on android');
                    //     $ionicConfigProvider.scrolling.jsScrolling(false);
                    // }

                    // Turn off animate transition to increase performan
                    // $ionicConfigProvider.views.transition('none');

                    // Add white list src to prevent block link or url
                    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|content|file):/);

                    $stateProvider.state('app', {
                        url: "/app",
                        abstract: true,
                        templateUrl: "./js/static/templates/menu.html",
                        controller: 'DefaultCtr'
                    });

                    // Default router, it will return default url when enter a link not registed...
                    $urlRouterProvider.otherwise('/app/' + dis.settings.homeUrl);
                    // Default controller, leftmenu controller
                })
                .controller('DefaultCtr', $menuCtrl);
        };

        Application.prototype.isLiveSite = function() {
            var sLiveSite = localStorage.getItem(this.settings.securityKey + '_runmode');
            if(!sLiveSite || sLiveSite == 'local'){
                this.bLiveSite = false;
            }
            else if(sLiveSite == 'livesite'){
                this.bLiveSite = true;
            }
            return this.bLiveSite;
        };

        Application.prototype.setLiveSite = function(bLiveSite) {
            this.bLiveSite = bLiveSite;
            if(this.bLiveSite){
                this.settings.serviceUrl = this.settings.liveServiceUrl;
                localStorage.setItem(this.settings.securityKey + '_runmode', 'livesite');
            }
            else{
                this.settings.serviceUrl = this.settings.localServiceUrl;
                localStorage.setItem(this.settings.securityKey + '_runmode', 'local');
            }
        };

        Application.prototype.switchLiveMode = function() {
            var liveSite = !this.bLiveSite;
            this.setLiveSite(liveSite);
        };

        Application.prototype.initMode = function() {
            this.setLiveSite(this.isLiveSite());
        };

        Application.prototype.registerModule = function(sModule) {
            if (this.modules.indexOf(sModule) != -1) {
                console.log('Module has already exist so can not add again.');
                return;
            }
            this.modules.push(sModule);
            return this;
        };

        Application.prototype._createRouter = function(sRouter, sController, $module) {
            var state = 'app.' + sController.replace('.', '_');
            var sTemplate = './js/modules/' + $module.sModule + '/templates/' + $module.sController + '.html';

            angular.module(this.appName).config(function($stateProvider, $urlRouterProvider) {

                var config = {
                    // Set cache template for view default is true
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
            var sControllerPath = './js/modules/' + $module.sModule + '/controllers/' + $module.sController;
            var dis = this;
            var sArgs = $controller.getArgs().join();
            console.log('Add controller ' + sController + '...');
            var sFunc = 'var func = function(' + sArgs + '){ ' + (sArgs.indexOf('$scope') != -1 ? '$.extend($scope, $extendScope);$scope.viewer = MyApp.viewer;$scope.module = $module;' : '') + 'dis.currentController = $module; return $controller(' + sArgs + ');}'
            eval(sFunc);
            angular.module(this.appName)
                .controller(sController, func);
        }

        Application.prototype.addController = function(sRouter, sController, bNoTemplate) {
            var aParts = sController.split('.');
            if (this.modules.indexOf(aParts[0]) == -1) {
                return false;
            }
            if (typeof bNoTemplate === 'undefined' || (typeof bNoTemplate !== 'undefined' && !bNoTemplate)) {
                bNoTemplate = false;
            } else {
                bNoTemplate = true;
            }

            var sController = aParts[0].ucFrist() + aParts[1].ucFrist();

            var $module = {
                sName: sController,
                sModule: aParts[0],
                sController: aParts[1],
                bNoTemplate: bNoTemplate,
                sRouter: sRouter
            };

            if (this.controllers.indexOf(sController) == -1) {
                this.controllers.push(sController);
            }
            var sControllerPath = './js/modules/' + $module.sModule + '/controllers/' + $module.sController;
            $module.sPath = sControllerPath;
            this.controllerPaths.push(sControllerPath);
            this.controllerObjects.push($module);

            console.log(sControllerPath);
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
                templateUrl: (typeof params !== 'undefined' && typeof params.templateUrl !== 'undefined' ? params.templateUrl : './js/modules/' + $module.sModule + '/templates/' + $module.sDirective + '.html'),
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
                var sControllerPath = './js/modules/' + $module.sModule + '/controllers/' + $module.sDirective + 'Dir';
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

            var sFactoryPath = './js/modules/' + $module.sModule + '/factories/' + $module.sFactory;
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
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
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
                modulePaths.push('./js/modules/' + modules[i] + '/run');
            }
            this.modulePaths = modulePaths;
            modulePaths.push('./js/static/cores/controllers');
            modulePaths.push('./js/static/cores/services');
            modulePaths.push('./js/static/cores/directives');

            var dis = this;
            require(modulePaths, function() {
                console.log('Load all modules complete...');

                require(dis.controllerPaths, function() {
                    // Begin register controllers...
                    for (var i = 0; i < arguments.length; i++) {

                        var $controller = arguments[i];
                        var ctrObj = dis.controllerObjects[i];

                        if (!ctrObj.bNoTemplate) {
                            dis._createRouter(ctrObj.sRouter, ctrObj.sName, ctrObj);
                        }
                        dis._createController(ctrObj.sName, ctrObj, $controller);
                    }

                    require([
                            'bootstrap'
                        ],
                        function() {
                            console.log('load bootstrap successfully...');
                        });
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
        console.log(modules);
        MyApp = new Application(settings);
        MyApp.initMode();
        MyApp.loadModules(modules);

        return MyApp;
    });
