function _err(io, info) {
    io.emit('err', { info:info});
}