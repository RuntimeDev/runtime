var brfs = require('brfs');

module.exports = {
    vertex: brfs('/pass.vert', 'utf8'),
    fragment: brfs('/grain.frag', 'utf8'),
};
