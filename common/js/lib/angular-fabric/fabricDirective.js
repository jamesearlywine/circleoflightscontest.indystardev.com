angular.module('common.fabric.directive', [
	'common.fabric.canvas'
])

.directive('fabric', [	
	'$timeout', 
	'$window', 
	'FabricCanvas',
	'ColoringBookService',
	function(
		$timeout, 
		$window,
		FabricCanvas, 
		ColoringBookService
	) {

	return {
		scope: {
			fabric: '=',
			options: '=?'
		},
		restrict: 'A',
		controller: function($scope, $element) {
			
			ColoringBookService.invalidateInitialization();
			
			FabricCanvas.setElement($element);
			FabricCanvas.createCanvas($scope.options);

			ColoringBookService.drawingCanvasElement = $element;

			window.olddirective = window.directive;
			window.directive = $scope;

			// Continue rendering the canvas until the user clicks
			// to avoid the "calcOffset" bug upon load.
			$('body', 'canvas').on('click', 'canvas', function() {
				if ($scope.fabric.setUserHasClickedCanvas) {
					$scope.fabric.setUserHasClickedCanvas(true);
				}
			});
			
		}
	};

}]);
