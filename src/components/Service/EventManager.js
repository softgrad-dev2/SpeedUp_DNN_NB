/**
 * Created by Мама on 31.05.15.
 */
CSVapp.factory('eventManager', [function () {
    var _listeners = {};

    var EventManager = function () {
    };

    EventManager.fireEvent = function (event, data) {
        if ($.isArray(_listeners[event])) {
            _listeners[event].forEach(function (func) {
                // listener can be already unset (null)
                if (func) {
                    // TODO: maybe, more complicated
                    // functionality will be needed
                    func.call(this, data);
                }
            });
        }
    };
    // holder is the object, that will 'remeber' info about its listeners
    EventManager.addListener = function (event, method, holder) {
        // TODO: check for already bound
        if (typeof(event) == 'string' && $.isFunction(method)) {
            if (!_listeners[event]) {
                _listeners[event] = [];
            }
            var newLength = _listeners[event].push(method);

            // return object to 'remember' the listener,
            // so later the one could be unbound
            if (angular.isObject(holder)) {
                // here lies a hash 'eventName'->'index'
                if (!angular.isObject(holder.listeners)) {
                    holder.listeners = {};
                }
                if (!angular.isArray(holder.listeners[event])) {
                    holder.listeners[event] = [];
                }
                // save the index of a listener
                holder.listeners[event].push(newLength - 1);
            }

            return true;
        }

        return false;
    };

    EventManager.removeListener = function (event, index) {
        if (angular.isArray(_listeners[event]) && _listeners[event][index]) {
            delete _listeners[event][index];

            return true;
        } else {
            return false;
        }
    };

    EventManager.disposeListeners = function (holder) {
        if (angular.isObject(holder) && angular.isObject(holder.listeners)) {
            for (var event in holder.listeners) {
                if (angular.isArray(holder.listeners[event]) && angular.isArray(_listeners[event])) {
                    holder.listeners[event].forEach(function (index) {
                        if (_listeners[event][index]) {
                            delete _listeners[event][index];
                        }
                    });
                }
            }
        }

    };

    return EventManager;
}]);