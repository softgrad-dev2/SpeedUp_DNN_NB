/**
 * Created by antons on 5/26/15.
 */
angular.module('speedup.exceptionHandling', ['speedup.CSVModule'])
    .config(['$provide', function($provide) {
        $provide.decorator('$exceptionHandler', ['$log', '$delegate',
            function($log, $delegate) {
                return function(exception, cause) {
                    // Todo:here we can attach custom logging (for example, 'Sentry');
                    $log.error(exception);
                    $delegate(exception, cause);
                };
            }
        ]);
    }]);