/*
Copyright 2016 Balena

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * @module errors
 */

import TypedError = require('typed-error');

export class BalenaError extends TypedError {
	public code: string;
	public exitCode: number;
}
BalenaError.prototype.code = 'BalenaError';
BalenaError.prototype.exitCode = 1;

/**
 * @summary Balena invalid device type
 * @class
 * @public
 *
 * @param {String} type - device type
 * @return {Error} error instance
 *
 * @example
 * throw new errors.BalenaInvalidDeviceType('raspberry-pi')
 */
export class BalenaInvalidDeviceType extends BalenaError {
	constructor(public type: string) {
		super(`Invalid device type: ${type}`);
	}
}
BalenaInvalidDeviceType.prototype.code = 'BalenaInvalidDeviceType';

/**
 * @summary Balena discontinued device type
 * @class
 * @public
 *
 * @description
 * The device type that you specified is invalid because it is
 * discontinued, and this operation is no longer supported.
 *
 * @param {String} type - device type
 * @return {Error} error instance
 *
 * @example
 * throw new errors.BalenaDiscontinuedDeviceType('edge')
 */
export class BalenaDiscontinuedDeviceType extends BalenaInvalidDeviceType {
	constructor(public type: string) {
		super(`Discontinued device type: ${type}`);
	}
}
BalenaDiscontinuedDeviceType.prototype.code = 'BalenaDiscontinuedDeviceType';

/**
 * @summary Balena malformed token
 * @class
 * @public
 *
 * @param {String} token - token
 * @return {Error} error instance
 *
 * @example
 * throw new errors.BalenaMalformedToken('1234')
 */
export class BalenaMalformedToken extends BalenaError {
	constructor(public token: string) {
		super(`Malformed token: ${token}`);
	}
}
BalenaMalformedToken.prototype.code = 'BalenaMalformedToken';

/**
 * @summary The device supervisor is locked
 * @class
 * @public
 *
 * @param {String} token - token
 * @return {Error} error instance
 *
 * @example
 * throw new errors.BalenaSupervisorLockedError()
 */
export class BalenaSupervisorLockedError extends BalenaError {
	constructor(public token: string) {
		super(`Supervisor Locked: ${token}`);
	}
}
BalenaSupervisorLockedError.prototype.code = 'BalenaSupervisorLockedError';

/**
 * @summary Balena expired token
 * @class
 * @public
 *
 * @param {String} token - token
 * @return {Error} error instance
 *
 * @example
 * throw new errors.BalenaExpiredToken('1234')
 */
export class BalenaExpiredToken extends BalenaError {
	constructor(public token: string) {
		super(`The token expired: ${token}`);
	}
}
BalenaExpiredToken.prototype.code = 'BalenaExpiredToken';

/**
 * @summary Balena application not found
 * @class
 * @public
 *
 * @param {(String|Number)} application - application name or id
 * @return {Error} error instance
 *
 * @example
 * throw new errors.BalenaApplicationNotFound('MyApp')
 */
export class BalenaApplicationNotFound extends BalenaError {
	constructor(public application: string | number) {
		super(`Application not found: ${application}`);
	}
}
BalenaApplicationNotFound.prototype.code = 'BalenaApplicationNotFound';

/**
 * @summary Balena release not found
 * @class
 * @public
 *
 * @param {(Number)} release - release id
 * @return {Error} error instance
 *
 * @example
 * throw new errors.BalenaReleaseNotFound(123)
 */
export class BalenaReleaseNotFound extends BalenaError {
	constructor(public release: number) {
		super(`Release not found: ${release}`);
	}
}
BalenaReleaseNotFound.prototype.code = 'BalenaReleaseNotFound';

/**
 * @summary Balena image not found
 * @class
 * @public
 *
 * @param {(Number)} image - image id
 * @return {Error} error instance
 *
 * @example
 * throw new errors.BalenaImageNotFound(123)
 */
export class BalenaImageNotFound extends BalenaError {
	constructor(public image: number) {
		super(`Image not found: ${image}`);
	}
}
BalenaImageNotFound.prototype.code = 'BalenaImageNotFound';

/**
 * @summary Balena service not found
 * @class
 * @public
 *
 * @param {(Number)} service - service id
 * @return {Error} error instance
 *
 * @example
 * throw new errors.BalenaServiceNotFound(123)
 */
export class BalenaServiceNotFound extends BalenaError {
	constructor(public service: number) {
		super(`Service not found: ${service}`);
	}
}
BalenaServiceNotFound.prototype.code = 'BalenaServiceNotFound';

/**
 * @summary Balena device not found
 * @class
 * @public
 *
 * @param {(String|Number)} device - device name or id
 * @return {Error} error instance
 *
 * @example
 * throw new errors.BalenaDeviceNotFound('MyDevice')
 */
export class BalenaDeviceNotFound extends BalenaError {
	constructor(public device: string | number) {
		super(`Device not found: ${device}`);
	}
}
BalenaDeviceNotFound.prototype.code = 'BalenaDeviceNotFound';

/**
 * @summary Balena ambiguous device
 * @class
 * @public
 *
 * @param {(String|Number)} device - device name or id
 * @return {Error} error instance
 *
 * @example
 * throw new errors.BalenaAmbiguousDevice('MyDevice')
 */
export class BalenaAmbiguousDevice extends BalenaError {
	constructor(public device: string | number) {
		super(`Device is ambiguous: ${device}`);
	}
}
BalenaAmbiguousDevice.prototype.code = 'BalenaAmbiguousDevice';

/**
 * @summary Balena ambiguous application
 * @class
 * @public
 *
 * @param {(String|Number)} application - application name or id
 * @return {Error} error instance
 *
 * @example
 * throw new errors.BalenaAmbiguousApplication('MyApp')
 */
export class BalenaAmbiguousApplication extends BalenaError {
	constructor(public application: string | number) {
		super(`Application is ambiguous: ${application}`);
	}
}
BalenaAmbiguousApplication.prototype.code = 'BalenaAmbiguousApplication';

/**
 * @summary Balena key not found
 * @class
 * @public
 *
 * @param {(String|Number)} key - key name, id or value
 * @return {Error} error instance
 *
 * @example
 * throw new errors.BalenaKeyNotFound('MyKey')
 */
export class BalenaKeyNotFound extends BalenaError {
	constructor(key: string | number) {
		super(`Key not found: ${key}`);
	}
}
BalenaKeyNotFound.prototype.code = 'BalenaKeyNotFound';

/**
 * @summary Balena request error
 * @class
 * @public
 *
 * @param {String} body - response body
 * @param {Number} statusCode - http status code
 * @param {Object} [requestOptions] - options used to make the request
 * @return {Error} error instance
 *
 * @example
 * throw new errors.BalenaRequestError('Unauthorized')
 */
export class BalenaRequestError extends BalenaError {
	constructor(
		public body: string,
		public statusCode: number,
		public requestOptions: object
	) {
		super(`Request error: ${body}`);
	}
}
BalenaRequestError.prototype.code = 'BalenaRequestError';

/**
 * @summary Balena not logged in
 * @class
 * @public
 *
 * @return {Error} error instance
 *
 * @example
 * throw new errors.BalenaNotLoggedIn()
 */
export class BalenaNotLoggedIn extends BalenaError {
	constructor() {
		super('You have to log in');
	}
}
BalenaNotLoggedIn.prototype.code = 'BalenaNotLoggedIn';

/**
 * @summary Balena invalid parameter
 * @class
 * @public
 *
 * @return {Error} error instance
 *
 * @example
 * const checkId = (id) => {
 * 	if (typeof id !== 'number') {
 * 		throw new errors.BalenaInvalidParameterError('id', id)
 * 	}
 * }
 */
export class BalenaInvalidParameterError extends BalenaError {
	constructor(public parameterName: string, public suppliedValue: any) {
		super(
			`Invalid parameter: ${suppliedValue} is not a valid value for parameter '${parameterName}'`
		);
	}
}
BalenaInvalidParameterError.prototype.code = 'BalenaInvalidParameterError';
