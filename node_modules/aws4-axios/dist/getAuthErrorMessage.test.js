"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
describe("getAuthErrorMessage", function () {
    it("should return the message from the error", function () {
        // Arrange
        var message = "Fake envalid credentials error";
        var error = { response: { data: { message: message } } };
        // Act
        var actual = _1.getAuthErrorMessage(error);
        // Assert
        expect(actual).toEqual(message);
    });
    it("should return undefined if no error is present", function () {
        // Arrange
        var error = { response: {} };
        // Act
        var actual = _1.getAuthErrorMessage(error);
        // Assert
        expect(actual).toBeUndefined();
    });
});
