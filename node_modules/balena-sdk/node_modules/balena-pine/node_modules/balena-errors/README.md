balena-errors
============

> Balena error collection

[![npm version](https://badge.fury.io/js/balena-errors.svg)](http://badge.fury.io/js/balena-errors)
[![dependencies](https://david-dm.org/balena-io-modules/balena-errors.svg)](https://david-dm.org/balena-io-modules/balena-errors.svg)
[![Build Status](https://travis-ci.org/balena-io-modules/balena-errors.svg?branch=master)](https://travis-ci.org/balena-io-modules/balena-errors)
[![Build status](https://ci.appveyor.com/api/projects/status/c7g2vsshixiw4xw9?svg=true)](https://ci.appveyor.com/project/jviotti/balena-errors)
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/balena-io/chat)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/balena-errors.svg)](https://saucelabs.com/u/balena-errors)

Role
----

The intention of this module is to provide a collection of `Error` instances to be used by the Balena SDK.

**THIS MODULE IS LOW LEVEL AND IS NOT MEANT TO BE USED BY END USERS DIRECTLY**.

Unless you know what you're doing, use the [Balena SDK](https://github.com/balena-io/balena-sdk) instead.

Installation
------------

Install `balena-errors` by running:

```sh
$ npm install --save balena-errors
```

Documentation
-------------


* [errors](#module_errors)
    * [~BalenaInvalidDeviceType](#module_errors..BalenaInvalidDeviceType)
        * [new BalenaInvalidDeviceType(type)](#new_module_errors..BalenaInvalidDeviceType_new)
    * [~BalenaDiscontinuedDeviceType](#module_errors..BalenaDiscontinuedDeviceType)
        * [new BalenaDiscontinuedDeviceType(type)](#new_module_errors..BalenaDiscontinuedDeviceType_new)
    * [~BalenaMalformedToken](#module_errors..BalenaMalformedToken)
        * [new BalenaMalformedToken(token)](#new_module_errors..BalenaMalformedToken_new)
    * [~BalenaSupervisorLockedError](#module_errors..BalenaSupervisorLockedError)
        * [new BalenaSupervisorLockedError(token)](#new_module_errors..BalenaSupervisorLockedError_new)
    * [~BalenaExpiredToken](#module_errors..BalenaExpiredToken)
        * [new BalenaExpiredToken(token)](#new_module_errors..BalenaExpiredToken_new)
    * [~BalenaApplicationNotFound](#module_errors..BalenaApplicationNotFound)
        * [new BalenaApplicationNotFound(application)](#new_module_errors..BalenaApplicationNotFound_new)
    * [~BalenaReleaseNotFound](#module_errors..BalenaReleaseNotFound)
        * [new BalenaReleaseNotFound(release)](#new_module_errors..BalenaReleaseNotFound_new)
    * [~BalenaImageNotFound](#module_errors..BalenaImageNotFound)
        * [new BalenaImageNotFound(image)](#new_module_errors..BalenaImageNotFound_new)
    * [~BalenaServiceNotFound](#module_errors..BalenaServiceNotFound)
        * [new BalenaServiceNotFound(service)](#new_module_errors..BalenaServiceNotFound_new)
    * [~BalenaDeviceNotFound](#module_errors..BalenaDeviceNotFound)
        * [new BalenaDeviceNotFound(device)](#new_module_errors..BalenaDeviceNotFound_new)
    * [~BalenaAmbiguousDevice](#module_errors..BalenaAmbiguousDevice)
        * [new BalenaAmbiguousDevice(device)](#new_module_errors..BalenaAmbiguousDevice_new)
    * [~BalenaAmbiguousApplication](#module_errors..BalenaAmbiguousApplication)
        * [new BalenaAmbiguousApplication(application)](#new_module_errors..BalenaAmbiguousApplication_new)
    * [~BalenaKeyNotFound](#module_errors..BalenaKeyNotFound)
        * [new BalenaKeyNotFound(key)](#new_module_errors..BalenaKeyNotFound_new)
    * [~BalenaRequestError](#module_errors..BalenaRequestError)
        * [new BalenaRequestError(body, statusCode, [requestOptions])](#new_module_errors..BalenaRequestError_new)
    * [~BalenaNotLoggedIn](#module_errors..BalenaNotLoggedIn)
    * [~BalenaInvalidParameterError](#module_errors..BalenaInvalidParameterError)

<a name="module_errors..BalenaInvalidDeviceType"></a>

### errors~BalenaInvalidDeviceType
**Kind**: inner class of [<code>errors</code>](#module_errors)  
**Summary**: Balena invalid device type  
**Access**: public  
<a name="new_module_errors..BalenaInvalidDeviceType_new"></a>

#### new BalenaInvalidDeviceType(type)
**Returns**: <code>Error</code> - error instance  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | device type |

**Example**  
```js
throw new errors.BalenaInvalidDeviceType('raspberry-pi')
```
<a name="module_errors..BalenaDiscontinuedDeviceType"></a>

### errors~BalenaDiscontinuedDeviceType
**Kind**: inner class of [<code>errors</code>](#module_errors)  
**Summary**: Balena discontinued device type  
**Access**: public  
<a name="new_module_errors..BalenaDiscontinuedDeviceType_new"></a>

#### new BalenaDiscontinuedDeviceType(type)
The device type that you specified is invalid because it is
discontinued, and this operation is no longer supported.

**Returns**: <code>Error</code> - error instance  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | device type |

**Example**  
```js
throw new errors.BalenaDiscontinuedDeviceType('edge')
```
<a name="module_errors..BalenaMalformedToken"></a>

### errors~BalenaMalformedToken
**Kind**: inner class of [<code>errors</code>](#module_errors)  
**Summary**: Balena malformed token  
**Access**: public  
<a name="new_module_errors..BalenaMalformedToken_new"></a>

#### new BalenaMalformedToken(token)
**Returns**: <code>Error</code> - error instance  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | token |

**Example**  
```js
throw new errors.BalenaMalformedToken('1234')
```
<a name="module_errors..BalenaSupervisorLockedError"></a>

### errors~BalenaSupervisorLockedError
**Kind**: inner class of [<code>errors</code>](#module_errors)  
**Summary**: The device supervisor is locked  
**Access**: public  
<a name="new_module_errors..BalenaSupervisorLockedError_new"></a>

#### new BalenaSupervisorLockedError(token)
**Returns**: <code>Error</code> - error instance  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | token |

**Example**  
```js
throw new errors.BalenaSupervisorLockedError()
```
<a name="module_errors..BalenaExpiredToken"></a>

### errors~BalenaExpiredToken
**Kind**: inner class of [<code>errors</code>](#module_errors)  
**Summary**: Balena expired token  
**Access**: public  
<a name="new_module_errors..BalenaExpiredToken_new"></a>

#### new BalenaExpiredToken(token)
**Returns**: <code>Error</code> - error instance  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | token |

**Example**  
```js
throw new errors.BalenaExpiredToken('1234')
```
<a name="module_errors..BalenaApplicationNotFound"></a>

### errors~BalenaApplicationNotFound
**Kind**: inner class of [<code>errors</code>](#module_errors)  
**Summary**: Balena application not found  
**Access**: public  
<a name="new_module_errors..BalenaApplicationNotFound_new"></a>

#### new BalenaApplicationNotFound(application)
**Returns**: <code>Error</code> - error instance  

| Param | Type | Description |
| --- | --- | --- |
| application | <code>String</code> \| <code>Number</code> | application name or id |

**Example**  
```js
throw new errors.BalenaApplicationNotFound('MyApp')
```
<a name="module_errors..BalenaReleaseNotFound"></a>

### errors~BalenaReleaseNotFound
**Kind**: inner class of [<code>errors</code>](#module_errors)  
**Summary**: Balena release not found  
**Access**: public  
<a name="new_module_errors..BalenaReleaseNotFound_new"></a>

#### new BalenaReleaseNotFound(release)
**Returns**: <code>Error</code> - error instance  

| Param | Type | Description |
| --- | --- | --- |
| release | <code>Number</code> | release id |

**Example**  
```js
throw new errors.BalenaReleaseNotFound(123)
```
<a name="module_errors..BalenaImageNotFound"></a>

### errors~BalenaImageNotFound
**Kind**: inner class of [<code>errors</code>](#module_errors)  
**Summary**: Balena image not found  
**Access**: public  
<a name="new_module_errors..BalenaImageNotFound_new"></a>

#### new BalenaImageNotFound(image)
**Returns**: <code>Error</code> - error instance  

| Param | Type | Description |
| --- | --- | --- |
| image | <code>Number</code> | image id |

**Example**  
```js
throw new errors.BalenaImageNotFound(123)
```
<a name="module_errors..BalenaServiceNotFound"></a>

### errors~BalenaServiceNotFound
**Kind**: inner class of [<code>errors</code>](#module_errors)  
**Summary**: Balena service not found  
**Access**: public  
<a name="new_module_errors..BalenaServiceNotFound_new"></a>

#### new BalenaServiceNotFound(service)
**Returns**: <code>Error</code> - error instance  

| Param | Type | Description |
| --- | --- | --- |
| service | <code>Number</code> | service id |

**Example**  
```js
throw new errors.BalenaServiceNotFound(123)
```
<a name="module_errors..BalenaDeviceNotFound"></a>

### errors~BalenaDeviceNotFound
**Kind**: inner class of [<code>errors</code>](#module_errors)  
**Summary**: Balena device not found  
**Access**: public  
<a name="new_module_errors..BalenaDeviceNotFound_new"></a>

#### new BalenaDeviceNotFound(device)
**Returns**: <code>Error</code> - error instance  

| Param | Type | Description |
| --- | --- | --- |
| device | <code>String</code> \| <code>Number</code> | device name or id |

**Example**  
```js
throw new errors.BalenaDeviceNotFound('MyDevice')
```
<a name="module_errors..BalenaAmbiguousDevice"></a>

### errors~BalenaAmbiguousDevice
**Kind**: inner class of [<code>errors</code>](#module_errors)  
**Summary**: Balena ambiguous device  
**Access**: public  
<a name="new_module_errors..BalenaAmbiguousDevice_new"></a>

#### new BalenaAmbiguousDevice(device)
**Returns**: <code>Error</code> - error instance  

| Param | Type | Description |
| --- | --- | --- |
| device | <code>String</code> \| <code>Number</code> | device name or id |

**Example**  
```js
throw new errors.BalenaAmbiguousDevice('MyDevice')
```
<a name="module_errors..BalenaAmbiguousApplication"></a>

### errors~BalenaAmbiguousApplication
**Kind**: inner class of [<code>errors</code>](#module_errors)  
**Summary**: Balena ambiguous application  
**Access**: public  
<a name="new_module_errors..BalenaAmbiguousApplication_new"></a>

#### new BalenaAmbiguousApplication(application)
**Returns**: <code>Error</code> - error instance  

| Param | Type | Description |
| --- | --- | --- |
| application | <code>String</code> \| <code>Number</code> | application name or id |

**Example**  
```js
throw new errors.BalenaAmbiguousApplication('MyApp')
```
<a name="module_errors..BalenaKeyNotFound"></a>

### errors~BalenaKeyNotFound
**Kind**: inner class of [<code>errors</code>](#module_errors)  
**Summary**: Balena key not found  
**Access**: public  
<a name="new_module_errors..BalenaKeyNotFound_new"></a>

#### new BalenaKeyNotFound(key)
**Returns**: <code>Error</code> - error instance  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> \| <code>Number</code> | key name, id or value |

**Example**  
```js
throw new errors.BalenaKeyNotFound('MyKey')
```
<a name="module_errors..BalenaRequestError"></a>

### errors~BalenaRequestError
**Kind**: inner class of [<code>errors</code>](#module_errors)  
**Summary**: Balena request error  
**Access**: public  
<a name="new_module_errors..BalenaRequestError_new"></a>

#### new BalenaRequestError(body, statusCode, [requestOptions])
**Returns**: <code>Error</code> - error instance  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>String</code> | response body |
| statusCode | <code>Number</code> | http status code |
| [requestOptions] | <code>Object</code> | options used to make the request |

**Example**  
```js
throw new errors.BalenaRequestError('Unauthorized')
```
<a name="module_errors..BalenaNotLoggedIn"></a>

### errors~BalenaNotLoggedIn
**Kind**: inner class of [<code>errors</code>](#module_errors)  
**Summary**: Balena not logged in  
**Access**: public  
<a name="module_errors..BalenaInvalidParameterError"></a>

### errors~BalenaInvalidParameterError
**Kind**: inner class of [<code>errors</code>](#module_errors)  
**Summary**: Balena invalid parameter  
**Access**: public  

Support
-------

If you're having any problem, please [raise an issue](https://github.com/balena-io-modules/balena-errors/issues/new) on GitHub and the Balena team will be happy to help.

Tests
-----

Run the test suite by doing:

```sh
$ gulp test
```

Contribute
----------

- Issue Tracker: [github.com/balena-io-modules/balena-errors/issues](https://github.com/balena-io-modules/balena-errors/issues)
- Source Code: [github.com/balena-io-modules/balena-errors](https://github.com/balena-io-modules/balena-errors)

Before submitting a PR, please make sure that you include tests, and that [coffeelint](http://www.coffeelint.org/) runs without any warning:

```sh
$ gulp lint
```

License
-------

The project is licensed under the Apache 2.0 license.
