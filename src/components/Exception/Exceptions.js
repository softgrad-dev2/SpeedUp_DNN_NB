/**
 * Created by antons on 5/26/15.
 */

// Exception for bad function argument
function BadParameterException(message) {
    this.name = 'BadParameter';
    this.message= message;
}
BadParameterException.prototype = new Error();
BadParameterException.prototype.constructor = BadParameterException;

// Exception for no data from server
function NoDataException(message) {
    this.name = 'NoDataException';
    this.message= message;
}
NoDataException.prototype = new Error();
NoDataException.prototype.constructor = NoDataException;

// Exception for not implemented method
function MethodNotImplementedException(message) {
    this.name = 'MethodNotImplementedException';
    this.message= message;
}
MethodNotImplementedException.prototype = new Error();
MethodNotImplementedException.prototype.constructor = MethodNotImplementedException;