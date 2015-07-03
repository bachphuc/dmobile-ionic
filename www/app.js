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
        ionic: './lib/ionic/js/ionic.bundle.min',
        
        app: './js',
        application: './js/application',
        
        modules: './js/settings/modules',
        settings: './js/settings/settings',
        // controllers : '../app/static/cores/controllers',
        // services : '../app/static/cores/services',
        exobject : './js/static/libs/extensions/object',
        // gdraw : '../lib/gsap/DrawSVGPlugin',
        // gmax : '../lib/gsap/TweenMax.min',
        // gthrow : '../lib/gsap/plugins/ThrowPropsPlugin.min',
        // gdrag : '../lib/gsap/utils/Draggable.min',
        jquery : './js/static/libs/jquery/jquery-2.1.3.min',
        extendScope : './js/static/cores/extendScope',
        directives : './js/static/cores/directives',
    },
    shim: {
        ionic: {
            exports: 'ionic'
        },
        application: {
            deps: ['settings', 'exobject', /*'gmax', 'gdraw', 'gthrow' , 'gdrag',*/ 'jquery', 'extendScope']
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
        'application',
        // 'testapp',
        // 'testcontroller'
    ],
    function() {

    })