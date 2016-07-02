'use strict';

angular.module('app.common')
    .filter('wordsLimit', function () {
        return function (text, limit) {
            if (!text) {
                return;
            }
            var limitedText = text.trim().split(' ');
            if (limitedText.length < limit) {
                return text;
            } else {
                limitedText = text.trim().split(' ', limit);
                text = limitedText.join(' ');
                return text;
            }
        };
    });
