var exec = require("./exec");
var log = require("./log");
var files = require("./files");
var fs = require("fs");

module.exports = function(pro, args, callback) {
  log("Building project in", process.cwd());
  
  exec.psc(
    [files.src, files.deps], 
    [files.srcForeign, files.depsForeign], 
    ["-o", args.buildPath].concat(args.remainder),
    null, function(err, rv) {
      if (err) return callback(err);
      log("Build successful.");
      if (args.optimise) {
        log("Bundling Javascript...");
        exec.pscBundle(
          [files.outputModules(args.buildPath)], 
          [
            "--module=" + args.main, "--main=" + args.main
          ].concat(args.remainder), null, function(err, src) {
            if (err) return callback(err);
            var out = args.to ? fs.createWriteStream(args.to) : process.stdout;
            out.write(src, "utf-8", function(err) {
              if (err) return callback(err);
              log("Bundled.");
              callback(null);
            });
          });
      } else {
        callback(null);
      }
    }
  );
};
