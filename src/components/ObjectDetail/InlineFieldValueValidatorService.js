/**
 * Created by C4off on 31.08.15.
 */
speedupObjectDetailModule.factory('inlineFieldValueValidatorService', ['configService',
    function (configService) {

        var gConfig = configService.getGlobalConfig();

        var InlineFieldValueValidatorService = function () {
        };

        /*PUBLIC METHODS*/

        /// <summary>
        /// Method to perform validation of a single field
        /// </summary>
        /// <param name="pageBlock">page block object</param>
        /// <param name="simpleBlock">element 'wrapper' block</param>
        InlineFieldValueValidatorService.performValidation = function (pageBlock, simpleBlock) {
            var validated = true;
            var input = simpleBlock.parent().find('._editBlock').find('input[type!=\'hidden\']');
            var dataType = input.attr('v-type');
            var validator = this.getValidator(pageBlock, dataType);
            if (validator) {
                validated = validator.validateInput(input);
            }

            return validated;
        };

        InlineFieldValueValidatorService.getValidator = function(object, dataType){
            var containerEl;
            if(object instanceof DetailPageBlock){
                containerEl = object.contentObject.element;
            } else{
                containerEl = object;
            }

            return _getValidator(containerEl, dataType);
        };

        /*PRIVATE METHODS*/

        /// <summary>
        /// factory to get custom validator by field dataType
        /// </summary>
        /// <param name="element">container</param>
        /// <param name="dataType">data type of a field</param>
        function _getValidator(element, dataType) {
            var validatorObj, validator;
            if (dataType == gConfig.dataTypes.Date) {
                validatorObj = {
                    rules: {
                        dateValidation: function (e) {
                            return !!kendo.parseDate($(e).val());
                        }
                    }
                };
                validator = element.find('.tbldetail').kendoValidator(validatorObj).data("kendoValidator");
            } else if (dataType == gConfig.dataTypes.DateTime) {
                validatorObj = {
                    rules: {
                        dateTimeValidation: function (e) {
                            var regExp = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/;
                            var test = regExp.test($(e).val());
                            return test ? !!kendo.parseDate($(e).val()) : test;
                        }
                    }
                };
                validator = element.find('.tbldetail').kendoValidator(validatorObj).data("kendoValidator");
            }
            else {
                validator = element.find('.tbldetail').kendoValidator().data("kendoValidator");
            }

            return validator;
        }

        return InlineFieldValueValidatorService;
    }]);