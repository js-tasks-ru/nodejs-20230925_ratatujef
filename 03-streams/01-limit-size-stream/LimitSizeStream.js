const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this._limit= options.limit;
    this._storage=0;
  }

  _transform(chunk, encocde, callback) {
    this._storage += chunk.byteLength;

    if (this._storage <= this._limit) {
      callback(null, chunk);
    } else {
      this.emit('error', new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
