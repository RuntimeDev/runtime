var fs = require('fs');
var glslify = require('glslify');
console.log(fs)

module.exports = glslify({
    inline: true,
    sourceOnly: true,
    vertex: fs.readFileSync('/pass.vert', 'utf8'),
    fragment: fs.readFileSync('/lens.frag', 'utf8'),
});
