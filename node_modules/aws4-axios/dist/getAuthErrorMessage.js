"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthErrorMessage = void 0;
/**
 * Utility method for extracting the error message from an API gateway 403
 *
 * @param error The error thrown by Axios
 */
var getAuthErrorMessage = function (error) {
    var data = error.response && error.response.data;
    if (data) {
        return data.message;
    }
};
exports.getAuthErrorMessage = getAuthErrorMessage;
