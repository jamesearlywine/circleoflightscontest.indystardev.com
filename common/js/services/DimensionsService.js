/**
 * Simple library of dimensions-related functions
 */

angular.module('DimensionsService', [])
    .factory('DimensionsService', [
        '$window',
        'AppConfig',
        'lodash',
        function(
            $window,
            AppConfig,
            _
        )
        {
            
            return {
                
                
                
                
                /**
                 * @brief   Returns responsive canvas size, 
                 * @params  as determined by:
                 *              AppConfig.fabric.coloringCanvas.dimensions.breakpoints
                 *              $window.innerWidth
                 * @returns (object) {width: (int), height: (int)}
                 */
                getResponsiveCanvasSize : function() {
                    var dims = this.parseBreakpointConstraints(
                        AppConfig.fabric.coloringCanvas.dimensions.breakpoints  
                    );
                    
                    var size = {
                        width: null,
                        height: null
                    };
                    
                    var dim = null;
                    var lastDim = null;
                    for (var key in dims) {
                        if ($window.innerWidth >= key) {
                            dim = dims[key];
                        } 
                    }

                    // console.log('for window.innerWidth: ', $window.innerWidth, ' -- canvas dimensions: ', dim);
                    
                    if (dim.type === 'pixels') {
                        size.width = dim.value;
                    }
                    if (dim.type === 'percent') {
                        size.width = $window.innerWidth * ( dim.value / 100 );
                    }
                    
                    var heightProp = this.getProportion(
                            AppConfig.fabric.coloringCanvas.dimensions.initialHeight,
                            AppConfig.fabric.coloringCanvas.dimensions.initialWidth
                        )
                    ;
                    size.height = parseInt( this.applyProportion(heightProp, size.width) );
                    
                    return size;
                    
                },
                
                /**
                 * @brief   Parses a string into a breakpointConstraint object
                 * @param   (string) constraint value (human-readable / css-like)
                 *                      valid values: (int) + '%' or (int) + 'px'
                 * 
                 * @returns (object)    {
                 *                          type: 'percent' or 'pixels'
                 *                          value: integer
                 *                      }
                 */
                parseBreakpointConstraint : function(constraint) {
                    var breakpointConstraint = {
                        type: 'pixels',
                        value: null
                    };
                    if (constraint.indexOf('%') !== -1) {
                        breakpointConstraint.type = 'percent';
                        breakpointConstraint.value = constraint.trim().replace(/%/g, '', constraint);
                    } else {
                        breakpointConstraint.value = constraint.trim().toLowerCase().replace(/px/g, '', constraint);
                    }
                    
                    return breakpointConstraint;
                },
                /**
                 * @brief   Parses human-readable breakpoint constraints into sparse array of typed values
                 * @param   (sparseArray) arrConstraints array of constraints 
                 *                              (see AppConfig.fabric.coloringCanvas.dimensions.breakpoints)
                 * @return  (sparseArray) of typed breakpoint values
                 */
                parseBreakpointConstraints : function(arrConstraints) {
                    var parsedConstraints = {}
                    for (var key in arrConstraints) {
                        parsedConstraints[key] = this.parseBreakpointConstraint(arrConstraints[key]);
                    }
                    return parsedConstraints;
                },
                
                
                /**
                 * Miscellaneous - for readability
                 */
                getProportion : function(val1, val2) {
                    return val1 / val2;
                },
                applyProportion : function(proportion, number) {
                    return number * proportion;
                },

                
                
            };
            
        }
        
    ]);