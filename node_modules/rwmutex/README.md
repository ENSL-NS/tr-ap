# RWMutext

[![npm](https://img.shields.io/npm/v/rwmutex.svg)](https://www.npmjs.com/package/rwmutex) [![Build Status](https://travis-ci.org/tyler-johnson/rwmutex.svg?branch=master)](https://travis-ci.org/tyler-johnson/rwmutex)

A simple read-write mutex/lock using JavaScript Promises. This is inspired by Golang's sync.RWMutex.

## Install

Install via NPM:

```sh
npm i rwmutex --save
```

## Usage

This package exports a RWMutex class.

```js
import RWMutex from "rwmutex";
// or
const RWMutex = require("rwmutex");
```

Create a RWMutex with the constructor. You can optionally pass in a string label for identifying the mutex in debugging. Each mutex operates independently, they will not block each other when locked.

```js
const mutex = new RWMutex();
```

To create a typical lock, that blocks all future locks, use the `.lock()` method. Typically this is used when writing data. This returns a promise that will resolve when unblocked. It returns the unlock method that must be called to unblock the mutex.

```js
function safeWrite() {
  return mutex.lock().then((unlock) => {
    // write data to database or other mutating task

    // and later
    unlock();
  });
}
```

To create a read lock, use the `.rlock()` method. This method is very similar to `.lock()`, but can be called in parallel with other calls to `.rlock()` without blocking. Calls to `.rlock()` will block future calls to `.lock()`.

```js
function safeRead() {
  return mutex.rlock().then((unlock) => {
    // read data from database or other non-mutating task

    // and later
    unlock();
  });
}
```
