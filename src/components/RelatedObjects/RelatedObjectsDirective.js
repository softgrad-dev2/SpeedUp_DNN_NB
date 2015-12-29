/**
 * Created by antons on 6/11/15.
 */
CSVapp.directive('relatedObjects', ['$timeout', 'configService', 'autocompleteService',
    'eventManager',
    function ($timeout, configService, autocompleteService, eventManager) {

        // Emit event to reload grid
        function _emitReloadEvent(odn, genericSearchStr) {
            eventManager.fireEvent(FilterGridByGenericSearchEvent, {
                odn: odn,
                genericSearchStr: genericSearchStr
            });
        }

        return {
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl ||
                    configService.getTemplateUrl('RelatedObjects/RelatedObjectTemplate.html');
            },
            restrict: "EA",
            transclude: true,
            replace: true,
            link: {
                post: function ($scope, $element) {
                    // values are not interpolated
                    // so we should wait for a moment (hate angular...)
                    $timeout(function () {
                            var input = $element.find("#txt" + $scope.fieldName);
                            input.val($scope.fieldValue);
                            $element.find("._objRelButtonSearch").click(function (e) {
                                _emitReloadEvent($scope.odn, input.val());
//                    $.config.BindObjectListing(listingContainer, objectDefinitionName, onSelect, filterExp, ShowSelectButton, ShowEditButton, ShowDeleteButton, displayType, IsSubObjectGrid, null, getvalueForgenericsearch);
                            });
                            // if we have objectDefinitionId of a
                            // field we can wrap it with autocomplete
                            if ($scope.oid) {
                                autocompleteService.wrapElement($element, input, $scope.fieldName, $scope.oid, null,
                                    {
                                        change: function () {
                                            _emitReloadEvent($scope.odn, this.value());
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        };
    }]
);