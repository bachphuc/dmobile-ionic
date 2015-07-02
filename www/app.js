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
        ionic: './lib/ionic/js/ionic.bundle.min',
        bootstrap: './js/bootstrap',
        app: './js',

        testapp : './js/app',
        testcontroller : './js/controllers',
        
        // application: '../app/static/cores/application',
        // modules: '../app/static/settings/modules',
        // settings: '../app/static/settings/settings',
        // controllers : '../app/static/cores/controllers',
        // services : '../app/static/cores/services',
        // exobject : 'extensions/object',
        // gdraw : '../lib/gsap/DrawSVGPlugin',
        // gmax : '../lib/gsap/TweenMax.min',
        // gthrow : '../lib/gsap/plugins/ThrowPropsPlugin.min',
        // gdrag : '../lib/gsap/utils/Draggable.min',
        // jquery : '../lib/jquery/jquery-2.1.3.min',
        // extendScope : '../app/static/cores/extendScope',
        // directives : '../app/static/cores/directives',
    },
    shim: {
        /*ionic: {
            exports: 'ionic'
        },
        application: {
            deps: ['settings', 'exobject', 'gmax', 'gdraw', 'gthrow' , 'gdrag', 'jquery', 'extendScope']
        },
        bootstrap: {
            deps: ['application']
        }*/
    },
    priority: [
        'ionic',
    ],
	deps: [

    ]
}),

requirejs([
        'ionic',
        'testapp',
        'testcontroller'
    ],
    function() {

    })