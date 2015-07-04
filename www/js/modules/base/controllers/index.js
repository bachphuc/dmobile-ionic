define([],
	function() {
		return function($scope) {
			var values = '100%;40% 60%;20 350;50% 50%;true;10%;0%;'.split(';'),
				currentIndex = 0;
			TweenLite.set('#path', {
				visibility: 'visible'
			});

			function next() {
				TweenLite.killTweensOf(next);
				if (++currentIndex === values.length) {
					currentIndex = 0;
				}
				TweenLite.to('#path', 1, {
					drawSVG: values[currentIndex],
					ease: Power1.easeInOut,
					onComplete: function() {
						next();
					}
				});
			}
			// Lock it will open when I like
			next();
		}
	});