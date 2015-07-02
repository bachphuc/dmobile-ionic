/*global define, require, console, cordova, navigator */

define([
        'ionic', 'application'
    ],

    function(ionic) {
        'use strict';
        MyApp.start();

        var $html,
            onDeviceReady = function() {
                angular.bootstrap(document.body, ['starter']);
                window.myappOuterHeight = window.outerHeight;
            };

        document.addEventListener("deviceready", onDeviceReady, false);

        if (typeof cordova === 'undefined') {
            $html = angular.element(document.getElementsByTagName('html')[0]);
            angular.element().ready(function() {
                try {
                    angular.bootstrap(document.body, ['starter']);
                } catch (e) {
                    console.error(e.stack || e.message || e);
                }
            });
        }
    });