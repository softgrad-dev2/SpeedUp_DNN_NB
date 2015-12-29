/**
 * Created by antons on 6/1/15.
 */
speedupObjectDetailModule.factory('objectDetailDisplayerService', ['$modal',
    'eventManager',
    function ($modal, eventManager) {
        var ObjectDetailDisplayerService = function () {
        };

        ObjectDetailDisplayerService.getDisplayer = function (settings) {
            switch (settings.type) {
                case 'popup':
                    return new ObjectDisplayerPopup();
                    break;
                case 'element':
                    var element = angular.element(settings.element);
                    return new ObjectDisplayerElement(element);
                    break;
                default:
                    return null;
            }
        };

        var ObjectDisplayer = function () {
        };

        ObjectDisplayer.prototype.close = function () {
        };

        ObjectDisplayer.prototype.setContent = function (pageBlock) {
            this.pageBlock = pageBlock;
//            this.content = pageBlock.element;
        };

        function ObjectDisplayerPopup() {
            this.type = 'popup';

            // Call the parent's constructor without hard coding the parent
            ObjectDisplayerPopup.base.constructor.call(this, arguments);
        }

        ObjectDisplayerPopup.detailPopupDefaultSettings = {
            width: 1000,
            actions: ['close'],
            title: "",
            modal: true
        };
        ObjectDisplayerPopup.detailPopupNewDefaultSettings = {
            width: 1000,
            actions: ['close'],
            title: "",
            modal: true
        };
        // hack not to create detailPage popup not wider than screen
        if(document.body.clientWidth < 1000){
            ObjectDisplayerPopup.detailPopupDefaultSettings.width = document.body.clientWidth - 40;
            ObjectDisplayerPopup.detailPopupNewDefaultSettings.width = document.body.clientWidth - 40;
        }
        Object.inherit(ObjectDisplayer, ObjectDisplayerPopup, {
            /// <summary>
            /// method to open modal window to create new record
            /// </summary>
            /// <param name="title">title of the popup</param>
            /// <param name="pageBlock">page block object to display</param>
            /// <param name="settings">settings for modal to override default</param>
            getDetailViewNew: function (title, pageBlock, settings) {
                if (!settings) {
                    settings = ObjectDisplayerPopup.detailPopupNewDefaultSettings;
                } else {
                    settings = angular.extend({}, ObjectDisplayerPopup.detailPopupDefaultSettings, settings);
                }
                return this.getDetailView(title, pageBlock, settings);
            },
            /// <summary>
            /// method to open modal window to display record detail block(s)
            /// </summary>
            /// <param name="title">title of the popup</param>
            /// <param name="pageBlock">page block object to display</param>
            /// <param name="settings">settings for modal to override default</param>
            getDetailView: function (title, pageBlock, settings) {
                this.setContent(pageBlock);
                if (!settings) {
                    settings = ObjectDisplayerPopup.detailPopupDefaultSettings;
                } else {
                    settings = angular.extend({}, ObjectDisplayerPopup.detailPopupDefaultSettings, settings);
                }
                settings.title = title;
                this.modalInstance = $modal.open({
                    template: "<div class='modalWindow11'></div>",
                    settings: settings,
                    resolve: {
                        items: function () {
                            return pageBlock.element;
                        }
                    },
                    content: pageBlock
                });
                // set backwards link to displayer
                pageBlock.displayer = this;

                return this.modalInstance;
            },
            close: function () {
                if (this.modalInstance) {
                    this.modalInstance.close();
                }
            },
            onClose: function(closeFn){
                this.modalInstance.result.then(function (result) {
                    closeFn();
                    eventManager.fireEvent(DisplayerElementClosedEvent);
                }, function () {
                    closeFn();
                    eventManager.fireEvent(DisplayerElementClosedEvent);
                });
            }
        });

        function ObjectDisplayerElement(element) {
            this.element = element;
            this.type = 'element';
            // Call the parent's constructor without hard coding the parent
            ObjectDisplayerPopup.base.constructor.call(this, arguments);
        }

        Object.inherit(ObjectDisplayer, ObjectDisplayerElement, {
            /// <summary>
            /// method to create new record
            /// </summary>
            /// <param name="title">title of the </param>
            /// <param name="pageBlock">page block object to display</param>
            /// <param name="settings">settings for modal to override default</param>
            getDetailViewNew: function (title, pageBlock) {
//                if (!settings) {
//                    settings = ObjectDisplayerPopup.detailPopupNewDefaultSettings;
//                } else {
//                    settings = angular.extend(settings, ObjectDisplayerPopup.detailPopupDefaultSettings);
//                }
                return this.getDetailView(title, pageBlock);
            },
            /// <summary>
            /// method to open modal window to display record detail block(s)
            /// </summary>
            /// <param name="title">title of the popup</param>
            /// <param name="pageBlock">page block object to display</param>
            /// <param name="settings">settings for modal to override default</param>
            getDetailView: function (title, pageBlock) {
                this.setContent(pageBlock);
                this.element.append(pageBlock.element);

                pageBlock.displayer = this;

                return this.element;
            },
            close: function () {
                // page block can be already closed
                if(this.pageBlock){
                    this.pageBlock.removeBlock();
                    delete this.pageBlock;
                }
            },
            onClose: function(closeFn){
                // does nothing.
            }
        });

        return ObjectDetailDisplayerService;
    }]);