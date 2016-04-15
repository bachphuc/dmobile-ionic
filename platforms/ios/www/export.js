// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

requirejs.config({
        urlArgs: "bust=" + (new Date()).getTime(),
        //By default load any module IDs from js/lib
        baseUrl: './',
        //except, if the module ID starts with "app",
        //load it from the js/app directory. paths
        //config is relative to the baseUrl, and
        //never includes a ".js" extension since
        //the paths config could be for a directory.

        paths: {
            bootstrap: './js/bootstrap',
            // ionic: './lib/ionic/js/ionic.bundle.min',
            ionic: './lib/ionic/js/ionic.bundle.min',
            ngcordova: './js/static/libs/ngcordova/ng-cordova.min',

            app: './app',
            application: './js/application',

            moduleObjs: './js/settings/modules',
            settings: './js/settings/settings',
            theme: './js/settings/theme',
            exobject: './js/static/libs/extensions/object',
            // gdraw : '../lib/gsap/DrawSVGPlugin',
            // gmax : '../lib/gsap/TweenMax.min',
            // gthrow : '../lib/gsap/plugins/ThrowPropsPlugin.min',
            // gdrag : '../lib/gsap/utils/Draggable.min',
            jquery: './js/static/libs/jquery/jquery-2.1.3.min',
            dmobi: '././js/static/libs/extensions/dmobi',
            extendScope: './js/static/cores/extendScope',
            directives: './js/static/cores/directives',

            corePath: './js/static/cores',
            // modulePath: './js/modules',
        },
        shim: {
            ionic: {
                exports: 'ionic'
            },
            application: {
                deps: ['settings', 'exobject', 'moduleObjs', /*'gmax', 'gdraw', 'gthrow' , 'gdrag',*/ 'jquery', 'dmobi', 'extendScope']
            },
            bootstrap: {
                deps: ['application']
            }
        },
        priority: [
            'ionic',
        ],
        deps: [

        ]
    }),

    requirejs([
            'ionic',
            'dmobi',
            // required all module
            './js/modules/base/run',
            './js/modules/core/run',
            './js/modules/user/run',
            './js/modules/feed/run',
            './js/modules/photo/run',
            './js/modules/link/run',
            './js/modules/video/run',
            './js/modules/music/run',
            './js/modules/blog/run',
            // required all controller
            './js/static/cores/controllers',
            './js/static/cores/services',
            './js/static/cores/directives',
            './js/modules/core/controllers/welcome',
            './js/modules/user/controllers/login',
            './js/modules/user/controllers/profile',
            './js/modules/user/controllers/members',
            './js/modules/feed/controllers/index',
            './js/modules/feed/controllers/add',
            './js/modules/feed/controllers/nojs',
            './js/modules/feed/controllers/commentModalCtrl',
            // required all template
            'text!./js/modules/core/templates/welcome.html',
            'text!./js/modules/user/templates/login.html',
            'text!./js/modules/user/templates/profile.html',
            'text!./js/modules/user/templates/members.html',
            'text!./js/modules/feed/templates/index.html',
            'text!./js/modules/feed/templates/add.html',
            'text!./js/modules/feed/templates/nojs.html',
            // required bootstrap and application
            'application',
        ],
        function() {

        })
