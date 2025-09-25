var stream = require('stream');
var bz2 = require('./lib/bzip2');
var bitIterator = require('./lib/bit_iterator');

class Unbzip2Stream extends stream.Transform {
    constructor(options) {

        super(options);

        this.queue = [];
        this.hasBytes = 0;
        this.blockSize = 0;
        this.done = false;
        this.bitReader = null;
        this.streamCRC = null;

    }

    _decompressAndQueue() {
        if (this.destroyed)
            return false;
        try {
            return this._decompressBlock();
        } catch( error ) {
            this.destroy(error);
            return false;
        }
    }

    _decompressBlock() {
        if(!this.blockSize) {
            this.blockSize = bz2.header(this.bitReader);
            return true;
        } else {
            var length = 100000 * this.blockSize;
            var buffer = new Int32Array(length);
            var bytes = [];
            var push = (value) => {
                bytes.push(value)
            };

            this.streamCRC = bz2.decompress(this.bitReader, push, buffer, length, this.streamCRC);
            if (this.streamCRC === null) {
                // reset for next bzip2 header
                this.blockSize = 0;
                return false;
            } else {
                this.push(Buffer.from(bytes));
                return true;
            }
        }
    }

    _transform(chunk, encoding, next) {
        this.queue.push(chunk);
        this.hasBytes += chunk.length;

        if(this.bitReader == null) {
            this.bitReader = bitIterator(() => {
                return this.queue.shift();
            });
        }

        while (!this.destroyed && this.hasBytes - this.bitReader.bytesRead + 1 >= ((25000 + 100000 * this.blockSize) || 4)){
            // console.error('decompressing with', hasBytes - bitReader.bytesRead + 1, 'bytes in buffer');
            this._decompressAndQueue();
        }

        process.nextTick(next);
    }

    _flush(next) {
        while (!this.destroyed && this.hasBytes > this.bitReader.bytesRead) {
            this._decompressAndQueue();
        }
        if (this.destroyed) {
            return;
        }
        if (this.streamCRC !== null) {
            this.destroy(new Error("input stream ended prematurely"));
        }
        this.push(null);
    }
}

module.exports = function unbzip2Stream(options) {
    return new Unbzip2Stream(options);
};

module.exports.Stream = Unbzip2Stream;
