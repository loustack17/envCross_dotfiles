"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.bun/isexe@2.0.0/node_modules/isexe/windows.js
var require_windows = __commonJS({
  "node_modules/.bun/isexe@2.0.0/node_modules/isexe/windows.js"(exports2, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs = require("fs");
    function checkPathExt(path3, options) {
      var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT;
      if (!pathext) {
        return true;
      }
      pathext = pathext.split(";");
      if (pathext.indexOf("") !== -1) {
        return true;
      }
      for (var i = 0; i < pathext.length; i++) {
        var p = pathext[i].toLowerCase();
        if (p && path3.substr(-p.length).toLowerCase() === p) {
          return true;
        }
      }
      return false;
    }
    function checkStat(stat, path3, options) {
      if (!stat.isSymbolicLink() && !stat.isFile()) {
        return false;
      }
      return checkPathExt(path3, options);
    }
    function isexe(path3, options, cb) {
      fs.stat(path3, function(er, stat) {
        cb(er, er ? false : checkStat(stat, path3, options));
      });
    }
    function sync(path3, options) {
      return checkStat(fs.statSync(path3), path3, options);
    }
  }
});

// node_modules/.bun/isexe@2.0.0/node_modules/isexe/mode.js
var require_mode = __commonJS({
  "node_modules/.bun/isexe@2.0.0/node_modules/isexe/mode.js"(exports2, module2) {
    module2.exports = isexe;
    isexe.sync = sync;
    var fs = require("fs");
    function isexe(path3, options, cb) {
      fs.stat(path3, function(er, stat) {
        cb(er, er ? false : checkStat(stat, options));
      });
    }
    function sync(path3, options) {
      return checkStat(fs.statSync(path3), options);
    }
    function checkStat(stat, options) {
      return stat.isFile() && checkMode(stat, options);
    }
    function checkMode(stat, options) {
      var mod = stat.mode;
      var uid = stat.uid;
      var gid = stat.gid;
      var myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid();
      var myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid();
      var u = parseInt("100", 8);
      var g = parseInt("010", 8);
      var o = parseInt("001", 8);
      var ug = u | g;
      var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
      return ret;
    }
  }
});

// node_modules/.bun/isexe@2.0.0/node_modules/isexe/index.js
var require_isexe = __commonJS({
  "node_modules/.bun/isexe@2.0.0/node_modules/isexe/index.js"(exports2, module2) {
    var fs = require("fs");
    var core;
    if (process.platform === "win32" || global.TESTING_WINDOWS) {
      core = require_windows();
    } else {
      core = require_mode();
    }
    module2.exports = isexe;
    isexe.sync = sync;
    function isexe(path3, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      if (!cb) {
        if (typeof Promise !== "function") {
          throw new TypeError("callback not provided");
        }
        return new Promise(function(resolve, reject) {
          isexe(path3, options || {}, function(er, is) {
            if (er) {
              reject(er);
            } else {
              resolve(is);
            }
          });
        });
      }
      core(path3, options || {}, function(er, is) {
        if (er) {
          if (er.code === "EACCES" || options && options.ignoreErrors) {
            er = null;
            is = false;
          }
        }
        cb(er, is);
      });
    }
    function sync(path3, options) {
      try {
        return core.sync(path3, options || {});
      } catch (er) {
        if (options && options.ignoreErrors || er.code === "EACCES") {
          return false;
        } else {
          throw er;
        }
      }
    }
  }
});

// node_modules/.bun/which@2.0.2/node_modules/which/which.js
var require_which = __commonJS({
  "node_modules/.bun/which@2.0.2/node_modules/which/which.js"(exports2, module2) {
    var isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
    var path3 = require("path");
    var COLON = isWindows ? ";" : ":";
    var isexe = require_isexe();
    var getNotFoundError = (cmd) => Object.assign(new Error(`not found: ${cmd}`), { code: "ENOENT" });
    var getPathInfo = (cmd, opt) => {
      const colon = opt.colon || COLON;
      const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [
        // windows always checks the cwd first
        ...isWindows ? [process.cwd()] : [],
        ...(opt.path || process.env.PATH || /* istanbul ignore next: very unusual */
        "").split(colon)
      ];
      const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
      const pathExt = isWindows ? pathExtExe.split(colon) : [""];
      if (isWindows) {
        if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
          pathExt.unshift("");
      }
      return {
        pathEnv,
        pathExt,
        pathExtExe
      };
    };
    var which = (cmd, opt, cb) => {
      if (typeof opt === "function") {
        cb = opt;
        opt = {};
      }
      if (!opt)
        opt = {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      const step = (i) => new Promise((resolve, reject) => {
        if (i === pathEnv.length)
          return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path3.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        resolve(subStep(p, i, 0));
      });
      const subStep = (p, i, ii) => new Promise((resolve, reject) => {
        if (ii === pathExt.length)
          return resolve(step(i + 1));
        const ext = pathExt[ii];
        isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
          if (!er && is) {
            if (opt.all)
              found.push(p + ext);
            else
              return resolve(p + ext);
          }
          return resolve(subStep(p, i, ii + 1));
        });
      });
      return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
    };
    var whichSync = (cmd, opt) => {
      opt = opt || {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      for (let i = 0; i < pathEnv.length; i++) {
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path3.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        for (let j = 0; j < pathExt.length; j++) {
          const cur = p + pathExt[j];
          try {
            const is = isexe.sync(cur, { pathExt: pathExtExe });
            if (is) {
              if (opt.all)
                found.push(cur);
              else
                return cur;
            }
          } catch (ex) {
          }
        }
      }
      if (opt.all && found.length)
        return found;
      if (opt.nothrow)
        return null;
      throw getNotFoundError(cmd);
    };
    module2.exports = which;
    which.sync = whichSync;
  }
});

// node_modules/.bun/path-key@3.1.1/node_modules/path-key/index.js
var require_path_key = __commonJS({
  "node_modules/.bun/path-key@3.1.1/node_modules/path-key/index.js"(exports2, module2) {
    "use strict";
    var pathKey2 = (options = {}) => {
      const environment8 = options.env || process.env;
      const platform2 = options.platform || process.platform;
      if (platform2 !== "win32") {
        return "PATH";
      }
      return Object.keys(environment8).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
    };
    module2.exports = pathKey2;
    module2.exports.default = pathKey2;
  }
});

// node_modules/.bun/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = __commonJS({
  "node_modules/.bun/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/resolveCommand.js"(exports2, module2) {
    "use strict";
    var path3 = require("path");
    var which = require_which();
    var getPathKey = require_path_key();
    function resolveCommandAttempt(parsed, withoutPathExt) {
      const env = parsed.options.env || process.env;
      const cwd = process.cwd();
      const hasCustomCwd = parsed.options.cwd != null;
      const shouldSwitchCwd = hasCustomCwd && process.chdir !== void 0 && !process.chdir.disabled;
      if (shouldSwitchCwd) {
        try {
          process.chdir(parsed.options.cwd);
        } catch (err) {
        }
      }
      let resolved;
      try {
        resolved = which.sync(parsed.command, {
          path: env[getPathKey({ env })],
          pathExt: withoutPathExt ? path3.delimiter : void 0
        });
      } catch (e) {
      } finally {
        if (shouldSwitchCwd) {
          process.chdir(cwd);
        }
      }
      if (resolved) {
        resolved = path3.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
      }
      return resolved;
    }
    function resolveCommand(parsed) {
      return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
    }
    module2.exports = resolveCommand;
  }
});

// node_modules/.bun/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/escape.js
var require_escape = __commonJS({
  "node_modules/.bun/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/escape.js"(exports2, module2) {
    "use strict";
    var metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
    function escapeCommand(arg) {
      arg = arg.replace(metaCharsRegExp, "^$1");
      return arg;
    }
    function escapeArgument(arg, doubleEscapeMetaChars) {
      arg = `${arg}`;
      arg = arg.replace(/(?=(\\+?)?)\1"/g, '$1$1\\"');
      arg = arg.replace(/(?=(\\+?)?)\1$/, "$1$1");
      arg = `"${arg}"`;
      arg = arg.replace(metaCharsRegExp, "^$1");
      if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, "^$1");
      }
      return arg;
    }
    module2.exports.command = escapeCommand;
    module2.exports.argument = escapeArgument;
  }
});

// node_modules/.bun/shebang-regex@3.0.0/node_modules/shebang-regex/index.js
var require_shebang_regex = __commonJS({
  "node_modules/.bun/shebang-regex@3.0.0/node_modules/shebang-regex/index.js"(exports2, module2) {
    "use strict";
    module2.exports = /^#!(.*)/;
  }
});

// node_modules/.bun/shebang-command@2.0.0/node_modules/shebang-command/index.js
var require_shebang_command = __commonJS({
  "node_modules/.bun/shebang-command@2.0.0/node_modules/shebang-command/index.js"(exports2, module2) {
    "use strict";
    var shebangRegex = require_shebang_regex();
    module2.exports = (string = "") => {
      const match = string.match(shebangRegex);
      if (!match) {
        return null;
      }
      const [path3, argument] = match[0].replace(/#! ?/, "").split(" ");
      const binary = path3.split("/").pop();
      if (binary === "env") {
        return argument;
      }
      return argument ? `${binary} ${argument}` : binary;
    };
  }
});

// node_modules/.bun/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = __commonJS({
  "node_modules/.bun/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/readShebang.js"(exports2, module2) {
    "use strict";
    var fs = require("fs");
    var shebangCommand = require_shebang_command();
    function readShebang(command) {
      const size = 150;
      const buffer = Buffer.alloc(size);
      let fd;
      try {
        fd = fs.openSync(command, "r");
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
      } catch (e) {
      }
      return shebangCommand(buffer.toString());
    }
    module2.exports = readShebang;
  }
});

// node_modules/.bun/cross-spawn@7.0.6/node_modules/cross-spawn/lib/parse.js
var require_parse = __commonJS({
  "node_modules/.bun/cross-spawn@7.0.6/node_modules/cross-spawn/lib/parse.js"(exports2, module2) {
    "use strict";
    var path3 = require("path");
    var resolveCommand = require_resolveCommand();
    var escape = require_escape();
    var readShebang = require_readShebang();
    var isWin = process.platform === "win32";
    var isExecutableRegExp = /\.(?:com|exe)$/i;
    var isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
    function detectShebang(parsed) {
      parsed.file = resolveCommand(parsed);
      const shebang = parsed.file && readShebang(parsed.file);
      if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;
        return resolveCommand(parsed);
      }
      return parsed.file;
    }
    function parseNonShell(parsed) {
      if (!isWin) {
        return parsed;
      }
      const commandFile = detectShebang(parsed);
      const needsShell = !isExecutableRegExp.test(commandFile);
      if (parsed.options.forceShell || needsShell) {
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
        parsed.command = path3.normalize(parsed.command);
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));
        const shellCommand = [parsed.command].concat(parsed.args).join(" ");
        parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`];
        parsed.command = process.env.comspec || "cmd.exe";
        parsed.options.windowsVerbatimArguments = true;
      }
      return parsed;
    }
    function parse(command, args, options) {
      if (args && !Array.isArray(args)) {
        options = args;
        args = null;
      }
      args = args ? args.slice(0) : [];
      options = Object.assign({}, options);
      const parsed = {
        command,
        args,
        options,
        file: void 0,
        original: {
          command,
          args
        }
      };
      return options.shell ? parsed : parseNonShell(parsed);
    }
    module2.exports = parse;
  }
});

// node_modules/.bun/cross-spawn@7.0.6/node_modules/cross-spawn/lib/enoent.js
var require_enoent = __commonJS({
  "node_modules/.bun/cross-spawn@7.0.6/node_modules/cross-spawn/lib/enoent.js"(exports2, module2) {
    "use strict";
    var isWin = process.platform === "win32";
    function notFoundError(original, syscall) {
      return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: "ENOENT",
        errno: "ENOENT",
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args
      });
    }
    function hookChildProcess(cp, parsed) {
      if (!isWin) {
        return;
      }
      const originalEmit = cp.emit;
      cp.emit = function(name, arg1) {
        if (name === "exit") {
          const err = verifyENOENT(arg1, parsed);
          if (err) {
            return originalEmit.call(cp, "error", err);
          }
        }
        return originalEmit.apply(cp, arguments);
      };
    }
    function verifyENOENT(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawn");
      }
      return null;
    }
    function verifyENOENTSync(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawnSync");
      }
      return null;
    }
    module2.exports = {
      hookChildProcess,
      verifyENOENT,
      verifyENOENTSync,
      notFoundError
    };
  }
});

// node_modules/.bun/cross-spawn@7.0.6/node_modules/cross-spawn/index.js
var require_cross_spawn = __commonJS({
  "node_modules/.bun/cross-spawn@7.0.6/node_modules/cross-spawn/index.js"(exports2, module2) {
    "use strict";
    var cp = require("child_process");
    var parse = require_parse();
    var enoent = require_enoent();
    function spawn(command, args, options) {
      const parsed = parse(command, args, options);
      const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
      enoent.hookChildProcess(spawned, parsed);
      return spawned;
    }
    function spawnSync(command, args, options) {
      const parsed = parse(command, args, options);
      const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
      result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
      return result;
    }
    module2.exports = spawn;
    module2.exports.spawn = spawn;
    module2.exports.sync = spawnSync;
    module2.exports._parse = parse;
    module2.exports._enoent = enoent;
  }
});

// node_modules/.bun/signal-exit@3.0.7/node_modules/signal-exit/signals.js
var require_signals = __commonJS({
  "node_modules/.bun/signal-exit@3.0.7/node_modules/signal-exit/signals.js"(exports2, module2) {
    module2.exports = [
      "SIGABRT",
      "SIGALRM",
      "SIGHUP",
      "SIGINT",
      "SIGTERM"
    ];
    if (process.platform !== "win32") {
      module2.exports.push(
        "SIGVTALRM",
        "SIGXCPU",
        "SIGXFSZ",
        "SIGUSR2",
        "SIGTRAP",
        "SIGSYS",
        "SIGQUIT",
        "SIGIOT"
        // should detect profiler and enable/disable accordingly.
        // see #21
        // 'SIGPROF'
      );
    }
    if (process.platform === "linux") {
      module2.exports.push(
        "SIGIO",
        "SIGPOLL",
        "SIGPWR",
        "SIGSTKFLT",
        "SIGUNUSED"
      );
    }
  }
});

// node_modules/.bun/signal-exit@3.0.7/node_modules/signal-exit/index.js
var require_signal_exit = __commonJS({
  "node_modules/.bun/signal-exit@3.0.7/node_modules/signal-exit/index.js"(exports2, module2) {
    var process4 = global.process;
    var processOk = function(process5) {
      return process5 && typeof process5 === "object" && typeof process5.removeListener === "function" && typeof process5.emit === "function" && typeof process5.reallyExit === "function" && typeof process5.listeners === "function" && typeof process5.kill === "function" && typeof process5.pid === "number" && typeof process5.on === "function";
    };
    if (!processOk(process4)) {
      module2.exports = function() {
        return function() {
        };
      };
    } else {
      assert = require("assert");
      signals = require_signals();
      isWin = /^win/i.test(process4.platform);
      EE = require("events");
      if (typeof EE !== "function") {
        EE = EE.EventEmitter;
      }
      if (process4.__signal_exit_emitter__) {
        emitter = process4.__signal_exit_emitter__;
      } else {
        emitter = process4.__signal_exit_emitter__ = new EE();
        emitter.count = 0;
        emitter.emitted = {};
      }
      if (!emitter.infinite) {
        emitter.setMaxListeners(Infinity);
        emitter.infinite = true;
      }
      module2.exports = function(cb, opts) {
        if (!processOk(global.process)) {
          return function() {
          };
        }
        assert.equal(typeof cb, "function", "a callback must be provided for exit handler");
        if (loaded === false) {
          load();
        }
        var ev = "exit";
        if (opts && opts.alwaysLast) {
          ev = "afterexit";
        }
        var remove = function() {
          emitter.removeListener(ev, cb);
          if (emitter.listeners("exit").length === 0 && emitter.listeners("afterexit").length === 0) {
            unload();
          }
        };
        emitter.on(ev, cb);
        return remove;
      };
      unload = function unload2() {
        if (!loaded || !processOk(global.process)) {
          return;
        }
        loaded = false;
        signals.forEach(function(sig) {
          try {
            process4.removeListener(sig, sigListeners[sig]);
          } catch (er) {
          }
        });
        process4.emit = originalProcessEmit;
        process4.reallyExit = originalProcessReallyExit;
        emitter.count -= 1;
      };
      module2.exports.unload = unload;
      emit = function emit2(event, code, signal) {
        if (emitter.emitted[event]) {
          return;
        }
        emitter.emitted[event] = true;
        emitter.emit(event, code, signal);
      };
      sigListeners = {};
      signals.forEach(function(sig) {
        sigListeners[sig] = function listener() {
          if (!processOk(global.process)) {
            return;
          }
          var listeners = process4.listeners(sig);
          if (listeners.length === emitter.count) {
            unload();
            emit("exit", null, sig);
            emit("afterexit", null, sig);
            if (isWin && sig === "SIGHUP") {
              sig = "SIGINT";
            }
            process4.kill(process4.pid, sig);
          }
        };
      });
      module2.exports.signals = function() {
        return signals;
      };
      loaded = false;
      load = function load2() {
        if (loaded || !processOk(global.process)) {
          return;
        }
        loaded = true;
        emitter.count += 1;
        signals = signals.filter(function(sig) {
          try {
            process4.on(sig, sigListeners[sig]);
            return true;
          } catch (er) {
            return false;
          }
        });
        process4.emit = processEmit;
        process4.reallyExit = processReallyExit;
      };
      module2.exports.load = load;
      originalProcessReallyExit = process4.reallyExit;
      processReallyExit = function processReallyExit2(code) {
        if (!processOk(global.process)) {
          return;
        }
        process4.exitCode = code || /* istanbul ignore next */
        0;
        emit("exit", process4.exitCode, null);
        emit("afterexit", process4.exitCode, null);
        originalProcessReallyExit.call(process4, process4.exitCode);
      };
      originalProcessEmit = process4.emit;
      processEmit = function processEmit2(ev, arg) {
        if (ev === "exit" && processOk(global.process)) {
          if (arg !== void 0) {
            process4.exitCode = arg;
          }
          var ret = originalProcessEmit.apply(this, arguments);
          emit("exit", process4.exitCode, null);
          emit("afterexit", process4.exitCode, null);
          return ret;
        } else {
          return originalProcessEmit.apply(this, arguments);
        }
      };
    }
    var assert;
    var signals;
    var isWin;
    var EE;
    var emitter;
    var unload;
    var emit;
    var sigListeners;
    var loaded;
    var load;
    var originalProcessReallyExit;
    var processReallyExit;
    var originalProcessEmit;
    var processEmit;
  }
});

// node_modules/.bun/get-stream@6.0.1/node_modules/get-stream/buffer-stream.js
var require_buffer_stream = __commonJS({
  "node_modules/.bun/get-stream@6.0.1/node_modules/get-stream/buffer-stream.js"(exports2, module2) {
    "use strict";
    var { PassThrough: PassThroughStream } = require("stream");
    module2.exports = (options) => {
      options = { ...options };
      const { array } = options;
      let { encoding } = options;
      const isBuffer = encoding === "buffer";
      let objectMode = false;
      if (array) {
        objectMode = !(encoding || isBuffer);
      } else {
        encoding = encoding || "utf8";
      }
      if (isBuffer) {
        encoding = null;
      }
      const stream = new PassThroughStream({ objectMode });
      if (encoding) {
        stream.setEncoding(encoding);
      }
      let length = 0;
      const chunks = [];
      stream.on("data", (chunk) => {
        chunks.push(chunk);
        if (objectMode) {
          length = chunks.length;
        } else {
          length += chunk.length;
        }
      });
      stream.getBufferedValue = () => {
        if (array) {
          return chunks;
        }
        return isBuffer ? Buffer.concat(chunks, length) : chunks.join("");
      };
      stream.getBufferedLength = () => length;
      return stream;
    };
  }
});

// node_modules/.bun/get-stream@6.0.1/node_modules/get-stream/index.js
var require_get_stream = __commonJS({
  "node_modules/.bun/get-stream@6.0.1/node_modules/get-stream/index.js"(exports2, module2) {
    "use strict";
    var { constants: BufferConstants } = require("buffer");
    var stream = require("stream");
    var { promisify: promisify3 } = require("util");
    var bufferStream = require_buffer_stream();
    var streamPipelinePromisified = promisify3(stream.pipeline);
    var MaxBufferError = class extends Error {
      constructor() {
        super("maxBuffer exceeded");
        this.name = "MaxBufferError";
      }
    };
    async function getStream2(inputStream, options) {
      if (!inputStream) {
        throw new Error("Expected a stream");
      }
      options = {
        maxBuffer: Infinity,
        ...options
      };
      const { maxBuffer } = options;
      const stream2 = bufferStream(options);
      await new Promise((resolve, reject) => {
        const rejectPromise = (error) => {
          if (error && stream2.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
            error.bufferedData = stream2.getBufferedValue();
          }
          reject(error);
        };
        (async () => {
          try {
            await streamPipelinePromisified(inputStream, stream2);
            resolve();
          } catch (error) {
            rejectPromise(error);
          }
        })();
        stream2.on("data", () => {
          if (stream2.getBufferedLength() > maxBuffer) {
            rejectPromise(new MaxBufferError());
          }
        });
      });
      return stream2.getBufferedValue();
    }
    module2.exports = getStream2;
    module2.exports.buffer = (stream2, options) => getStream2(stream2, { ...options, encoding: "buffer" });
    module2.exports.array = (stream2, options) => getStream2(stream2, { ...options, array: true });
    module2.exports.MaxBufferError = MaxBufferError;
  }
});

// node_modules/.bun/merge-stream@2.0.0/node_modules/merge-stream/index.js
var require_merge_stream = __commonJS({
  "node_modules/.bun/merge-stream@2.0.0/node_modules/merge-stream/index.js"(exports2, module2) {
    "use strict";
    var { PassThrough } = require("stream");
    module2.exports = function() {
      var sources = [];
      var output = new PassThrough({ objectMode: true });
      output.setMaxListeners(0);
      output.add = add;
      output.isEmpty = isEmpty;
      output.on("unpipe", remove);
      Array.prototype.slice.call(arguments).forEach(add);
      return output;
      function add(source) {
        if (Array.isArray(source)) {
          source.forEach(add);
          return this;
        }
        sources.push(source);
        source.once("end", remove.bind(null, source));
        source.once("error", output.emit.bind(output, "error"));
        source.pipe(output, { end: false });
        return this;
      }
      function isEmpty() {
        return sources.length == 0;
      }
      function remove(source) {
        sources = sources.filter(function(it) {
          return it !== source;
        });
        if (!sources.length && output.readable) {
          output.end();
        }
      }
    };
  }
});

// node_modules/.bun/node-stream-zip@1.15.0/node_modules/node-stream-zip/node_stream_zip.js
var require_node_stream_zip = __commonJS({
  "node_modules/.bun/node-stream-zip@1.15.0/node_modules/node-stream-zip/node_stream_zip.js"(exports2, module2) {
    var fs = require("fs");
    var util = require("util");
    var path3 = require("path");
    var events = require("events");
    var zlib = require("zlib");
    var stream = require("stream");
    var consts = {
      /* The local file header */
      LOCHDR: 30,
      // LOC header size
      LOCSIG: 67324752,
      // "PK\003\004"
      LOCVER: 4,
      // version needed to extract
      LOCFLG: 6,
      // general purpose bit flag
      LOCHOW: 8,
      // compression method
      LOCTIM: 10,
      // modification time (2 bytes time, 2 bytes date)
      LOCCRC: 14,
      // uncompressed file crc-32 value
      LOCSIZ: 18,
      // compressed size
      LOCLEN: 22,
      // uncompressed size
      LOCNAM: 26,
      // filename length
      LOCEXT: 28,
      // extra field length
      /* The Data descriptor */
      EXTSIG: 134695760,
      // "PK\007\008"
      EXTHDR: 16,
      // EXT header size
      EXTCRC: 4,
      // uncompressed file crc-32 value
      EXTSIZ: 8,
      // compressed size
      EXTLEN: 12,
      // uncompressed size
      /* The central directory file header */
      CENHDR: 46,
      // CEN header size
      CENSIG: 33639248,
      // "PK\001\002"
      CENVEM: 4,
      // version made by
      CENVER: 6,
      // version needed to extract
      CENFLG: 8,
      // encrypt, decrypt flags
      CENHOW: 10,
      // compression method
      CENTIM: 12,
      // modification time (2 bytes time, 2 bytes date)
      CENCRC: 16,
      // uncompressed file crc-32 value
      CENSIZ: 20,
      // compressed size
      CENLEN: 24,
      // uncompressed size
      CENNAM: 28,
      // filename length
      CENEXT: 30,
      // extra field length
      CENCOM: 32,
      // file comment length
      CENDSK: 34,
      // volume number start
      CENATT: 36,
      // internal file attributes
      CENATX: 38,
      // external file attributes (host system dependent)
      CENOFF: 42,
      // LOC header offset
      /* The entries in the end of central directory */
      ENDHDR: 22,
      // END header size
      ENDSIG: 101010256,
      // "PK\005\006"
      ENDSIGFIRST: 80,
      ENDSUB: 8,
      // number of entries on this disk
      ENDTOT: 10,
      // total number of entries
      ENDSIZ: 12,
      // central directory size in bytes
      ENDOFF: 16,
      // offset of first CEN header
      ENDCOM: 20,
      // zip file comment length
      MAXFILECOMMENT: 65535,
      /* The entries in the end of ZIP64 central directory locator */
      ENDL64HDR: 20,
      // ZIP64 end of central directory locator header size
      ENDL64SIG: 117853008,
      // ZIP64 end of central directory locator signature
      ENDL64SIGFIRST: 80,
      ENDL64OFS: 8,
      // ZIP64 end of central directory offset
      /* The entries in the end of ZIP64 central directory */
      END64HDR: 56,
      // ZIP64 end of central directory header size
      END64SIG: 101075792,
      // ZIP64 end of central directory signature
      END64SIGFIRST: 80,
      END64SUB: 24,
      // number of entries on this disk
      END64TOT: 32,
      // total number of entries
      END64SIZ: 40,
      END64OFF: 48,
      /* Compression methods */
      STORED: 0,
      // no compression
      SHRUNK: 1,
      // shrunk
      REDUCED1: 2,
      // reduced with compression factor 1
      REDUCED2: 3,
      // reduced with compression factor 2
      REDUCED3: 4,
      // reduced with compression factor 3
      REDUCED4: 5,
      // reduced with compression factor 4
      IMPLODED: 6,
      // imploded
      // 7 reserved
      DEFLATED: 8,
      // deflated
      ENHANCED_DEFLATED: 9,
      // deflate64
      PKWARE: 10,
      // PKWare DCL imploded
      // 11 reserved
      BZIP2: 12,
      //  compressed using BZIP2
      // 13 reserved
      LZMA: 14,
      // LZMA
      // 15-17 reserved
      IBM_TERSE: 18,
      // compressed using IBM TERSE
      IBM_LZ77: 19,
      //IBM LZ77 z
      /* General purpose bit flag */
      FLG_ENC: 0,
      // encrypted file
      FLG_COMP1: 1,
      // compression option
      FLG_COMP2: 2,
      // compression option
      FLG_DESC: 4,
      // data descriptor
      FLG_ENH: 8,
      // enhanced deflation
      FLG_STR: 16,
      // strong encryption
      FLG_LNG: 1024,
      // language encoding
      FLG_MSK: 4096,
      // mask header values
      FLG_ENTRY_ENC: 1,
      /* 4.5 Extensible data fields */
      EF_ID: 0,
      EF_SIZE: 2,
      /* Header IDs */
      ID_ZIP64: 1,
      ID_AVINFO: 7,
      ID_PFS: 8,
      ID_OS2: 9,
      ID_NTFS: 10,
      ID_OPENVMS: 12,
      ID_UNIX: 13,
      ID_FORK: 14,
      ID_PATCH: 15,
      ID_X509_PKCS7: 20,
      ID_X509_CERTID_F: 21,
      ID_X509_CERTID_C: 22,
      ID_STRONGENC: 23,
      ID_RECORD_MGT: 24,
      ID_X509_PKCS7_RL: 25,
      ID_IBM1: 101,
      ID_IBM2: 102,
      ID_POSZIP: 18064,
      EF_ZIP64_OR_32: 4294967295,
      EF_ZIP64_OR_16: 65535
    };
    var StreamZip = function(config) {
      let fd, fileSize, chunkSize, op, centralDirectory, closed;
      const ready = false, that = this, entries = config.storeEntries !== false ? {} : null, fileName = config.file, textDecoder = config.nameEncoding ? new TextDecoder(config.nameEncoding) : null;
      open3();
      function open3() {
        if (config.fd) {
          fd = config.fd;
          readFile();
        } else {
          fs.open(fileName, "r", (err, f) => {
            if (err) {
              return that.emit("error", err);
            }
            fd = f;
            readFile();
          });
        }
      }
      function readFile() {
        fs.fstat(fd, (err, stat) => {
          if (err) {
            return that.emit("error", err);
          }
          fileSize = stat.size;
          chunkSize = config.chunkSize || Math.round(fileSize / 1e3);
          chunkSize = Math.max(
            Math.min(chunkSize, Math.min(128 * 1024, fileSize)),
            Math.min(1024, fileSize)
          );
          readCentralDirectory();
        });
      }
      function readUntilFoundCallback(err, bytesRead) {
        if (err || !bytesRead) {
          return that.emit("error", err || new Error("Archive read error"));
        }
        let pos = op.lastPos;
        let bufferPosition = pos - op.win.position;
        const buffer = op.win.buffer;
        const minPos = op.minPos;
        while (--pos >= minPos && --bufferPosition >= 0) {
          if (buffer.length - bufferPosition >= 4 && buffer[bufferPosition] === op.firstByte) {
            if (buffer.readUInt32LE(bufferPosition) === op.sig) {
              op.lastBufferPosition = bufferPosition;
              op.lastBytesRead = bytesRead;
              op.complete();
              return;
            }
          }
        }
        if (pos === minPos) {
          return that.emit("error", new Error("Bad archive"));
        }
        op.lastPos = pos + 1;
        op.chunkSize *= 2;
        if (pos <= minPos) {
          return that.emit("error", new Error("Bad archive"));
        }
        const expandLength = Math.min(op.chunkSize, pos - minPos);
        op.win.expandLeft(expandLength, readUntilFoundCallback);
      }
      function readCentralDirectory() {
        const totalReadLength = Math.min(consts.ENDHDR + consts.MAXFILECOMMENT, fileSize);
        op = {
          win: new FileWindowBuffer(fd),
          totalReadLength,
          minPos: fileSize - totalReadLength,
          lastPos: fileSize,
          chunkSize: Math.min(1024, chunkSize),
          firstByte: consts.ENDSIGFIRST,
          sig: consts.ENDSIG,
          complete: readCentralDirectoryComplete
        };
        op.win.read(fileSize - op.chunkSize, op.chunkSize, readUntilFoundCallback);
      }
      function readCentralDirectoryComplete() {
        const buffer = op.win.buffer;
        const pos = op.lastBufferPosition;
        try {
          centralDirectory = new CentralDirectoryHeader();
          centralDirectory.read(buffer.slice(pos, pos + consts.ENDHDR));
          centralDirectory.headerOffset = op.win.position + pos;
          if (centralDirectory.commentLength) {
            that.comment = buffer.slice(
              pos + consts.ENDHDR,
              pos + consts.ENDHDR + centralDirectory.commentLength
            ).toString();
          } else {
            that.comment = null;
          }
          that.entriesCount = centralDirectory.volumeEntries;
          that.centralDirectory = centralDirectory;
          if (centralDirectory.volumeEntries === consts.EF_ZIP64_OR_16 && centralDirectory.totalEntries === consts.EF_ZIP64_OR_16 || centralDirectory.size === consts.EF_ZIP64_OR_32 || centralDirectory.offset === consts.EF_ZIP64_OR_32) {
            readZip64CentralDirectoryLocator();
          } else {
            op = {};
            readEntries();
          }
        } catch (err) {
          that.emit("error", err);
        }
      }
      function readZip64CentralDirectoryLocator() {
        const length = consts.ENDL64HDR;
        if (op.lastBufferPosition > length) {
          op.lastBufferPosition -= length;
          readZip64CentralDirectoryLocatorComplete();
        } else {
          op = {
            win: op.win,
            totalReadLength: length,
            minPos: op.win.position - length,
            lastPos: op.win.position,
            chunkSize: op.chunkSize,
            firstByte: consts.ENDL64SIGFIRST,
            sig: consts.ENDL64SIG,
            complete: readZip64CentralDirectoryLocatorComplete
          };
          op.win.read(op.lastPos - op.chunkSize, op.chunkSize, readUntilFoundCallback);
        }
      }
      function readZip64CentralDirectoryLocatorComplete() {
        const buffer = op.win.buffer;
        const locHeader = new CentralDirectoryLoc64Header();
        locHeader.read(
          buffer.slice(op.lastBufferPosition, op.lastBufferPosition + consts.ENDL64HDR)
        );
        const readLength = fileSize - locHeader.headerOffset;
        op = {
          win: op.win,
          totalReadLength: readLength,
          minPos: locHeader.headerOffset,
          lastPos: op.lastPos,
          chunkSize: op.chunkSize,
          firstByte: consts.END64SIGFIRST,
          sig: consts.END64SIG,
          complete: readZip64CentralDirectoryComplete
        };
        op.win.read(fileSize - op.chunkSize, op.chunkSize, readUntilFoundCallback);
      }
      function readZip64CentralDirectoryComplete() {
        const buffer = op.win.buffer;
        const zip64cd = new CentralDirectoryZip64Header();
        zip64cd.read(buffer.slice(op.lastBufferPosition, op.lastBufferPosition + consts.END64HDR));
        that.centralDirectory.volumeEntries = zip64cd.volumeEntries;
        that.centralDirectory.totalEntries = zip64cd.totalEntries;
        that.centralDirectory.size = zip64cd.size;
        that.centralDirectory.offset = zip64cd.offset;
        that.entriesCount = zip64cd.volumeEntries;
        op = {};
        readEntries();
      }
      function readEntries() {
        op = {
          win: new FileWindowBuffer(fd),
          pos: centralDirectory.offset,
          chunkSize,
          entriesLeft: centralDirectory.volumeEntries
        };
        op.win.read(op.pos, Math.min(chunkSize, fileSize - op.pos), readEntriesCallback);
      }
      function readEntriesCallback(err, bytesRead) {
        if (err || !bytesRead) {
          return that.emit("error", err || new Error("Entries read error"));
        }
        let bufferPos = op.pos - op.win.position;
        let entry = op.entry;
        const buffer = op.win.buffer;
        const bufferLength = buffer.length;
        try {
          while (op.entriesLeft > 0) {
            if (!entry) {
              entry = new ZipEntry();
              entry.readHeader(buffer, bufferPos);
              entry.headerOffset = op.win.position + bufferPos;
              op.entry = entry;
              op.pos += consts.CENHDR;
              bufferPos += consts.CENHDR;
            }
            const entryHeaderSize = entry.fnameLen + entry.extraLen + entry.comLen;
            const advanceBytes = entryHeaderSize + (op.entriesLeft > 1 ? consts.CENHDR : 0);
            if (bufferLength - bufferPos < advanceBytes) {
              op.win.moveRight(chunkSize, readEntriesCallback, bufferPos);
              op.move = true;
              return;
            }
            entry.read(buffer, bufferPos, textDecoder);
            if (!config.skipEntryNameValidation) {
              entry.validateName();
            }
            if (entries) {
              entries[entry.name] = entry;
            }
            that.emit("entry", entry);
            op.entry = entry = null;
            op.entriesLeft--;
            op.pos += entryHeaderSize;
            bufferPos += entryHeaderSize;
          }
          that.emit("ready");
        } catch (err2) {
          that.emit("error", err2);
        }
      }
      function checkEntriesExist() {
        if (!entries) {
          throw new Error("storeEntries disabled");
        }
      }
      Object.defineProperty(this, "ready", {
        get() {
          return ready;
        }
      });
      this.entry = function(name) {
        checkEntriesExist();
        return entries[name];
      };
      this.entries = function() {
        checkEntriesExist();
        return entries;
      };
      this.stream = function(entry, callback) {
        return this.openEntry(
          entry,
          (err, entry2) => {
            if (err) {
              return callback(err);
            }
            const offset = dataOffset(entry2);
            let entryStream = new EntryDataReaderStream(fd, offset, entry2.compressedSize);
            if (entry2.method === consts.STORED) {
            } else if (entry2.method === consts.DEFLATED) {
              entryStream = entryStream.pipe(zlib.createInflateRaw());
            } else {
              return callback(new Error("Unknown compression method: " + entry2.method));
            }
            if (canVerifyCrc(entry2)) {
              entryStream = entryStream.pipe(
                new EntryVerifyStream(entryStream, entry2.crc, entry2.size)
              );
            }
            callback(null, entryStream);
          },
          false
        );
      };
      this.entryDataSync = function(entry) {
        let err = null;
        this.openEntry(
          entry,
          (e, en) => {
            err = e;
            entry = en;
          },
          true
        );
        if (err) {
          throw err;
        }
        let data = Buffer.alloc(entry.compressedSize);
        new FsRead(fd, data, 0, entry.compressedSize, dataOffset(entry), (e) => {
          err = e;
        }).read(true);
        if (err) {
          throw err;
        }
        if (entry.method === consts.STORED) {
        } else if (entry.method === consts.DEFLATED || entry.method === consts.ENHANCED_DEFLATED) {
          data = zlib.inflateRawSync(data);
        } else {
          throw new Error("Unknown compression method: " + entry.method);
        }
        if (data.length !== entry.size) {
          throw new Error("Invalid size");
        }
        if (canVerifyCrc(entry)) {
          const verify = new CrcVerify(entry.crc, entry.size);
          verify.data(data);
        }
        return data;
      };
      this.openEntry = function(entry, callback, sync) {
        if (typeof entry === "string") {
          checkEntriesExist();
          entry = entries[entry];
          if (!entry) {
            return callback(new Error("Entry not found"));
          }
        }
        if (!entry.isFile) {
          return callback(new Error("Entry is not file"));
        }
        if (!fd) {
          return callback(new Error("Archive closed"));
        }
        const buffer = Buffer.alloc(consts.LOCHDR);
        new FsRead(fd, buffer, 0, buffer.length, entry.offset, (err) => {
          if (err) {
            return callback(err);
          }
          let readEx;
          try {
            entry.readDataHeader(buffer);
            if (entry.encrypted) {
              readEx = new Error("Entry encrypted");
            }
          } catch (ex) {
            readEx = ex;
          }
          callback(readEx, entry);
        }).read(sync);
      };
      function dataOffset(entry) {
        return entry.offset + consts.LOCHDR + entry.fnameLen + entry.extraLen;
      }
      function canVerifyCrc(entry) {
        return (entry.flags & 8) !== 8;
      }
      function extract(entry, outPath, callback) {
        that.stream(entry, (err, stm) => {
          if (err) {
            callback(err);
          } else {
            let fsStm, errThrown;
            stm.on("error", (err2) => {
              errThrown = err2;
              if (fsStm) {
                stm.unpipe(fsStm);
                fsStm.close(() => {
                  callback(err2);
                });
              }
            });
            fs.open(outPath, "w", (err2, fdFile) => {
              if (err2) {
                return callback(err2);
              }
              if (errThrown) {
                fs.close(fd, () => {
                  callback(errThrown);
                });
                return;
              }
              fsStm = fs.createWriteStream(outPath, { fd: fdFile });
              fsStm.on("finish", () => {
                that.emit("extract", entry, outPath);
                if (!errThrown) {
                  callback();
                }
              });
              stm.pipe(fsStm);
            });
          }
        });
      }
      function createDirectories(baseDir, dirs, callback) {
        if (!dirs.length) {
          return callback();
        }
        let dir = dirs.shift();
        dir = path3.join(baseDir, path3.join(...dir));
        fs.mkdir(dir, { recursive: true }, (err) => {
          if (err && err.code !== "EEXIST") {
            return callback(err);
          }
          createDirectories(baseDir, dirs, callback);
        });
      }
      function extractFiles(baseDir, baseRelPath, files, callback, extractedCount) {
        if (!files.length) {
          return callback(null, extractedCount);
        }
        const file = files.shift();
        const targetPath = path3.join(baseDir, file.name.replace(baseRelPath, ""));
        extract(file, targetPath, (err) => {
          if (err) {
            return callback(err, extractedCount);
          }
          extractFiles(baseDir, baseRelPath, files, callback, extractedCount + 1);
        });
      }
      this.extract = function(entry, outPath, callback) {
        let entryName = entry || "";
        if (typeof entry === "string") {
          entry = this.entry(entry);
          if (entry) {
            entryName = entry.name;
          } else {
            if (entryName.length && entryName[entryName.length - 1] !== "/") {
              entryName += "/";
            }
          }
        }
        if (!entry || entry.isDirectory) {
          const files = [], dirs = [], allDirs = {};
          for (const e in entries) {
            if (Object.prototype.hasOwnProperty.call(entries, e) && e.lastIndexOf(entryName, 0) === 0) {
              let relPath = e.replace(entryName, "");
              const childEntry = entries[e];
              if (childEntry.isFile) {
                files.push(childEntry);
                relPath = path3.dirname(relPath);
              }
              if (relPath && !allDirs[relPath] && relPath !== ".") {
                allDirs[relPath] = true;
                let parts = relPath.split("/").filter((f) => {
                  return f;
                });
                if (parts.length) {
                  dirs.push(parts);
                }
                while (parts.length > 1) {
                  parts = parts.slice(0, parts.length - 1);
                  const partsPath = parts.join("/");
                  if (allDirs[partsPath] || partsPath === ".") {
                    break;
                  }
                  allDirs[partsPath] = true;
                  dirs.push(parts);
                }
              }
            }
          }
          dirs.sort((x, y) => {
            return x.length - y.length;
          });
          if (dirs.length) {
            createDirectories(outPath, dirs, (err) => {
              if (err) {
                callback(err);
              } else {
                extractFiles(outPath, entryName, files, callback, 0);
              }
            });
          } else {
            extractFiles(outPath, entryName, files, callback, 0);
          }
        } else {
          fs.stat(outPath, (err, stat) => {
            if (stat && stat.isDirectory()) {
              extract(entry, path3.join(outPath, path3.basename(entry.name)), callback);
            } else {
              extract(entry, outPath, callback);
            }
          });
        }
      };
      this.close = function(callback) {
        if (closed || !fd) {
          closed = true;
          if (callback) {
            callback();
          }
        } else {
          closed = true;
          fs.close(fd, (err) => {
            fd = null;
            if (callback) {
              callback(err);
            }
          });
        }
      };
      const originalEmit = events.EventEmitter.prototype.emit;
      this.emit = function(...args) {
        if (!closed) {
          return originalEmit.call(this, ...args);
        }
      };
    };
    StreamZip.setFs = function(customFs) {
      fs = customFs;
    };
    StreamZip.debugLog = (...args) => {
      if (StreamZip.debug) {
        console.log(...args);
      }
    };
    util.inherits(StreamZip, events.EventEmitter);
    var propZip = Symbol("zip");
    StreamZip.async = class StreamZipAsync extends events.EventEmitter {
      constructor(config) {
        super();
        const zip = new StreamZip(config);
        zip.on("entry", (entry) => this.emit("entry", entry));
        zip.on("extract", (entry, outPath) => this.emit("extract", entry, outPath));
        this[propZip] = new Promise((resolve, reject) => {
          zip.on("ready", () => {
            zip.removeListener("error", reject);
            resolve(zip);
          });
          zip.on("error", reject);
        });
      }
      get entriesCount() {
        return this[propZip].then((zip) => zip.entriesCount);
      }
      get comment() {
        return this[propZip].then((zip) => zip.comment);
      }
      async entry(name) {
        const zip = await this[propZip];
        return zip.entry(name);
      }
      async entries() {
        const zip = await this[propZip];
        return zip.entries();
      }
      async stream(entry) {
        const zip = await this[propZip];
        return new Promise((resolve, reject) => {
          zip.stream(entry, (err, stm) => {
            if (err) {
              reject(err);
            } else {
              resolve(stm);
            }
          });
        });
      }
      async entryData(entry) {
        const stm = await this.stream(entry);
        return new Promise((resolve, reject) => {
          const data = [];
          stm.on("data", (chunk) => data.push(chunk));
          stm.on("end", () => {
            resolve(Buffer.concat(data));
          });
          stm.on("error", (err) => {
            stm.removeAllListeners("end");
            reject(err);
          });
        });
      }
      async extract(entry, outPath) {
        const zip = await this[propZip];
        return new Promise((resolve, reject) => {
          zip.extract(entry, outPath, (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          });
        });
      }
      async close() {
        const zip = await this[propZip];
        return new Promise((resolve, reject) => {
          zip.close((err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      }
    };
    var CentralDirectoryHeader = class {
      read(data) {
        if (data.length !== consts.ENDHDR || data.readUInt32LE(0) !== consts.ENDSIG) {
          throw new Error("Invalid central directory");
        }
        this.volumeEntries = data.readUInt16LE(consts.ENDSUB);
        this.totalEntries = data.readUInt16LE(consts.ENDTOT);
        this.size = data.readUInt32LE(consts.ENDSIZ);
        this.offset = data.readUInt32LE(consts.ENDOFF);
        this.commentLength = data.readUInt16LE(consts.ENDCOM);
      }
    };
    var CentralDirectoryLoc64Header = class {
      read(data) {
        if (data.length !== consts.ENDL64HDR || data.readUInt32LE(0) !== consts.ENDL64SIG) {
          throw new Error("Invalid zip64 central directory locator");
        }
        this.headerOffset = readUInt64LE(data, consts.ENDSUB);
      }
    };
    var CentralDirectoryZip64Header = class {
      read(data) {
        if (data.length !== consts.END64HDR || data.readUInt32LE(0) !== consts.END64SIG) {
          throw new Error("Invalid central directory");
        }
        this.volumeEntries = readUInt64LE(data, consts.END64SUB);
        this.totalEntries = readUInt64LE(data, consts.END64TOT);
        this.size = readUInt64LE(data, consts.END64SIZ);
        this.offset = readUInt64LE(data, consts.END64OFF);
      }
    };
    var ZipEntry = class {
      readHeader(data, offset) {
        if (data.length < offset + consts.CENHDR || data.readUInt32LE(offset) !== consts.CENSIG) {
          throw new Error("Invalid entry header");
        }
        this.verMade = data.readUInt16LE(offset + consts.CENVEM);
        this.version = data.readUInt16LE(offset + consts.CENVER);
        this.flags = data.readUInt16LE(offset + consts.CENFLG);
        this.method = data.readUInt16LE(offset + consts.CENHOW);
        const timebytes = data.readUInt16LE(offset + consts.CENTIM);
        const datebytes = data.readUInt16LE(offset + consts.CENTIM + 2);
        this.time = parseZipTime(timebytes, datebytes);
        this.crc = data.readUInt32LE(offset + consts.CENCRC);
        this.compressedSize = data.readUInt32LE(offset + consts.CENSIZ);
        this.size = data.readUInt32LE(offset + consts.CENLEN);
        this.fnameLen = data.readUInt16LE(offset + consts.CENNAM);
        this.extraLen = data.readUInt16LE(offset + consts.CENEXT);
        this.comLen = data.readUInt16LE(offset + consts.CENCOM);
        this.diskStart = data.readUInt16LE(offset + consts.CENDSK);
        this.inattr = data.readUInt16LE(offset + consts.CENATT);
        this.attr = data.readUInt32LE(offset + consts.CENATX);
        this.offset = data.readUInt32LE(offset + consts.CENOFF);
      }
      readDataHeader(data) {
        if (data.readUInt32LE(0) !== consts.LOCSIG) {
          throw new Error("Invalid local header");
        }
        this.version = data.readUInt16LE(consts.LOCVER);
        this.flags = data.readUInt16LE(consts.LOCFLG);
        this.method = data.readUInt16LE(consts.LOCHOW);
        const timebytes = data.readUInt16LE(consts.LOCTIM);
        const datebytes = data.readUInt16LE(consts.LOCTIM + 2);
        this.time = parseZipTime(timebytes, datebytes);
        this.crc = data.readUInt32LE(consts.LOCCRC) || this.crc;
        const compressedSize = data.readUInt32LE(consts.LOCSIZ);
        if (compressedSize && compressedSize !== consts.EF_ZIP64_OR_32) {
          this.compressedSize = compressedSize;
        }
        const size = data.readUInt32LE(consts.LOCLEN);
        if (size && size !== consts.EF_ZIP64_OR_32) {
          this.size = size;
        }
        this.fnameLen = data.readUInt16LE(consts.LOCNAM);
        this.extraLen = data.readUInt16LE(consts.LOCEXT);
      }
      read(data, offset, textDecoder) {
        const nameData = data.slice(offset, offset += this.fnameLen);
        this.name = textDecoder ? textDecoder.decode(new Uint8Array(nameData)) : nameData.toString("utf8");
        const lastChar = data[offset - 1];
        this.isDirectory = lastChar === 47 || lastChar === 92;
        if (this.extraLen) {
          this.readExtra(data, offset);
          offset += this.extraLen;
        }
        this.comment = this.comLen ? data.slice(offset, offset + this.comLen).toString() : null;
      }
      validateName() {
        if (/\\|^\w+:|^\/|(^|\/)\.\.(\/|$)/.test(this.name)) {
          throw new Error("Malicious entry: " + this.name);
        }
      }
      readExtra(data, offset) {
        let signature, size;
        const maxPos = offset + this.extraLen;
        while (offset < maxPos) {
          signature = data.readUInt16LE(offset);
          offset += 2;
          size = data.readUInt16LE(offset);
          offset += 2;
          if (consts.ID_ZIP64 === signature) {
            this.parseZip64Extra(data, offset, size);
          }
          offset += size;
        }
      }
      parseZip64Extra(data, offset, length) {
        if (length >= 8 && this.size === consts.EF_ZIP64_OR_32) {
          this.size = readUInt64LE(data, offset);
          offset += 8;
          length -= 8;
        }
        if (length >= 8 && this.compressedSize === consts.EF_ZIP64_OR_32) {
          this.compressedSize = readUInt64LE(data, offset);
          offset += 8;
          length -= 8;
        }
        if (length >= 8 && this.offset === consts.EF_ZIP64_OR_32) {
          this.offset = readUInt64LE(data, offset);
          offset += 8;
          length -= 8;
        }
        if (length >= 4 && this.diskStart === consts.EF_ZIP64_OR_16) {
          this.diskStart = data.readUInt32LE(offset);
        }
      }
      get encrypted() {
        return (this.flags & consts.FLG_ENTRY_ENC) === consts.FLG_ENTRY_ENC;
      }
      get isFile() {
        return !this.isDirectory;
      }
    };
    var FsRead = class {
      constructor(fd, buffer, offset, length, position, callback) {
        this.fd = fd;
        this.buffer = buffer;
        this.offset = offset;
        this.length = length;
        this.position = position;
        this.callback = callback;
        this.bytesRead = 0;
        this.waiting = false;
      }
      read(sync) {
        StreamZip.debugLog("read", this.position, this.bytesRead, this.length, this.offset);
        this.waiting = true;
        let err;
        if (sync) {
          let bytesRead = 0;
          try {
            bytesRead = fs.readSync(
              this.fd,
              this.buffer,
              this.offset + this.bytesRead,
              this.length - this.bytesRead,
              this.position + this.bytesRead
            );
          } catch (e) {
            err = e;
          }
          this.readCallback(sync, err, err ? bytesRead : null);
        } else {
          fs.read(
            this.fd,
            this.buffer,
            this.offset + this.bytesRead,
            this.length - this.bytesRead,
            this.position + this.bytesRead,
            this.readCallback.bind(this, sync)
          );
        }
      }
      readCallback(sync, err, bytesRead) {
        if (typeof bytesRead === "number") {
          this.bytesRead += bytesRead;
        }
        if (err || !bytesRead || this.bytesRead === this.length) {
          this.waiting = false;
          return this.callback(err, this.bytesRead);
        } else {
          this.read(sync);
        }
      }
    };
    var FileWindowBuffer = class {
      constructor(fd) {
        this.position = 0;
        this.buffer = Buffer.alloc(0);
        this.fd = fd;
        this.fsOp = null;
      }
      checkOp() {
        if (this.fsOp && this.fsOp.waiting) {
          throw new Error("Operation in progress");
        }
      }
      read(pos, length, callback) {
        this.checkOp();
        if (this.buffer.length < length) {
          this.buffer = Buffer.alloc(length);
        }
        this.position = pos;
        this.fsOp = new FsRead(this.fd, this.buffer, 0, length, this.position, callback).read();
      }
      expandLeft(length, callback) {
        this.checkOp();
        this.buffer = Buffer.concat([Buffer.alloc(length), this.buffer]);
        this.position -= length;
        if (this.position < 0) {
          this.position = 0;
        }
        this.fsOp = new FsRead(this.fd, this.buffer, 0, length, this.position, callback).read();
      }
      expandRight(length, callback) {
        this.checkOp();
        const offset = this.buffer.length;
        this.buffer = Buffer.concat([this.buffer, Buffer.alloc(length)]);
        this.fsOp = new FsRead(
          this.fd,
          this.buffer,
          offset,
          length,
          this.position + offset,
          callback
        ).read();
      }
      moveRight(length, callback, shift) {
        this.checkOp();
        if (shift) {
          this.buffer.copy(this.buffer, 0, shift);
        } else {
          shift = 0;
        }
        this.position += shift;
        this.fsOp = new FsRead(
          this.fd,
          this.buffer,
          this.buffer.length - shift,
          shift,
          this.position + this.buffer.length - shift,
          callback
        ).read();
      }
    };
    var EntryDataReaderStream = class extends stream.Readable {
      constructor(fd, offset, length) {
        super();
        this.fd = fd;
        this.offset = offset;
        this.length = length;
        this.pos = 0;
        this.readCallback = this.readCallback.bind(this);
      }
      _read(n) {
        const buffer = Buffer.alloc(Math.min(n, this.length - this.pos));
        if (buffer.length) {
          fs.read(this.fd, buffer, 0, buffer.length, this.offset + this.pos, this.readCallback);
        } else {
          this.push(null);
        }
      }
      readCallback(err, bytesRead, buffer) {
        this.pos += bytesRead;
        if (err) {
          this.emit("error", err);
          this.push(null);
        } else if (!bytesRead) {
          this.push(null);
        } else {
          if (bytesRead !== buffer.length) {
            buffer = buffer.slice(0, bytesRead);
          }
          this.push(buffer);
        }
      }
    };
    var EntryVerifyStream = class extends stream.Transform {
      constructor(baseStm, crc, size) {
        super();
        this.verify = new CrcVerify(crc, size);
        baseStm.on("error", (e) => {
          this.emit("error", e);
        });
      }
      _transform(data, encoding, callback) {
        let err;
        try {
          this.verify.data(data);
        } catch (e) {
          err = e;
        }
        callback(err, data);
      }
    };
    var CrcVerify = class _CrcVerify {
      constructor(crc, size) {
        this.crc = crc;
        this.size = size;
        this.state = {
          crc: ~0,
          size: 0
        };
      }
      data(data) {
        const crcTable = _CrcVerify.getCrcTable();
        let crc = this.state.crc;
        let off = 0;
        let len = data.length;
        while (--len >= 0) {
          crc = crcTable[(crc ^ data[off++]) & 255] ^ crc >>> 8;
        }
        this.state.crc = crc;
        this.state.size += data.length;
        if (this.state.size >= this.size) {
          const buf = Buffer.alloc(4);
          buf.writeInt32LE(~this.state.crc & 4294967295, 0);
          crc = buf.readUInt32LE(0);
          if (crc !== this.crc) {
            throw new Error("Invalid CRC");
          }
          if (this.state.size !== this.size) {
            throw new Error("Invalid size");
          }
        }
      }
      static getCrcTable() {
        let crcTable = _CrcVerify.crcTable;
        if (!crcTable) {
          _CrcVerify.crcTable = crcTable = [];
          const b = Buffer.alloc(4);
          for (let n = 0; n < 256; n++) {
            let c = n;
            for (let k = 8; --k >= 0; ) {
              if ((c & 1) !== 0) {
                c = 3988292384 ^ c >>> 1;
              } else {
                c = c >>> 1;
              }
            }
            if (c < 0) {
              b.writeInt32LE(c, 0);
              c = b.readUInt32LE(0);
            }
            crcTable[n] = c;
          }
        }
        return crcTable;
      }
    };
    function parseZipTime(timebytes, datebytes) {
      const timebits = toBits(timebytes, 16);
      const datebits = toBits(datebytes, 16);
      const mt = {
        h: parseInt(timebits.slice(0, 5).join(""), 2),
        m: parseInt(timebits.slice(5, 11).join(""), 2),
        s: parseInt(timebits.slice(11, 16).join(""), 2) * 2,
        Y: parseInt(datebits.slice(0, 7).join(""), 2) + 1980,
        M: parseInt(datebits.slice(7, 11).join(""), 2),
        D: parseInt(datebits.slice(11, 16).join(""), 2)
      };
      const dt_str = [mt.Y, mt.M, mt.D].join("-") + " " + [mt.h, mt.m, mt.s].join(":") + " GMT+0";
      return new Date(dt_str).getTime();
    }
    function toBits(dec, size) {
      let b = (dec >>> 0).toString(2);
      while (b.length < size) {
        b = "0" + b;
      }
      return b.split("");
    }
    function readUInt64LE(buffer, offset) {
      return buffer.readUInt32LE(offset + 4) * 4294967296 + buffer.readUInt32LE(offset);
    }
    module2.exports = StreamZip;
  }
});

// node_modules/.bun/graphemesplit@2.6.0/node_modules/graphemesplit/types.js
var require_types = __commonJS({
  "node_modules/.bun/graphemesplit@2.6.0/node_modules/graphemesplit/types.js"(exports2, module2) {
    module2.exports = {
      Other: 0,
      CR: 1 << 0,
      LF: 1 << 1,
      Control: 1 << 2,
      Extend: 1 << 3,
      ZWJ: 1 << 4,
      Regional_Indicator: 1 << 5,
      Prepend: 1 << 6,
      SpacingMark: 1 << 7,
      L: 1 << 8,
      V: 1 << 9,
      T: 1 << 10,
      LV: 1 << 11,
      LVT: 1 << 12,
      Extended_Pictographic: 1 << 13,
      InCB_Linker: 1 << 14,
      InCB_Consonant: 1 << 15,
      InCB_Extend: 1 << 16
    };
  }
});

// node_modules/.bun/graphemesplit@2.6.0/node_modules/graphemesplit/typeTrie.json
var require_typeTrie = __commonJS({
  "node_modules/.bun/graphemesplit@2.6.0/node_modules/graphemesplit/typeTrie.json"(exports2, module2) {
    module2.exports = { data: "ABAOAAAAAADQjQAAAd4HIfjtnG2oFUUYxx/1nHu29OolvKRSZIIQghSSEFJwwj4YWdzoFcoQyriBHwz8YHDBiSKDLG9YKSEiUX4IFQ0FCaRLoFmUb9mLBqJ+EDOIsAgpjf7b7nCnOTO7M7szu8frPPBjZufleZ6ZeWZm73pwYALRk2ApGAQMvC6UlU2HwUbwDthk0P5DsC2jfifYC0bAQXAE/AhOgXNCu1/A7+ASoAZRD5gMekE/mAFmge1gN9jbSPrOSdPPkM4DX4AvwVFwApwBZ8EFcBH8Bf4GE5pEUXP0uQ/5ac2k/UyktzWT/ncgPYj0rmZip91M6hc1R/U/hPzj4BnwPBgECwT7cb8VKFsZJflVyK9O9cW8gvwb6fM6pO+l+c1It4Lt4Hah/R7k94H94BuhPGZDNMqWlK1gf4rYNovthu1c8x3G8xOYmhKXnUH6c5pf0/h/+8Uo/1Wagz+bev1X0rpGD9GkniS/FjRTvVNRdiO4BcwGc8H8tN3dabqwp1Pv/Sh7WFHOGU4pOz9vws/1qa+PCuXxGHZmjDtQAdL6n1DEgAs7NwnrvCQj5gKBQCAQCAQCgUAgEOgGnsPfrlOE7zlvG3y/WI4+K4W/eYciotVgCGWv8u85SNeDjVHyPXAj8tORbknrtyLdAT5Jnz9Fehnp5zl/S3+F+kPQeRgcAUfBMfAtOB6FulAX6kJdqHNdtwPsAQei+u+sQCAwdjnk+d9TNk0Y/Xd1mUFFmfh+vKHhxycbRnoTaDLR0t582mg3oGg7LJWN4JmmoD1YNSUp24b0NJjWR3QnGAT3TcT7Pzh7HdGt1xNF4xKeFvIiu9D25ER1nczqVMeMSUS7kX8M6bvgMKBeMx2BQCAQGJv8gXuhEd8nLaJ/cB+2cCdPaiW/E2ojvyi9oyOkN6B8Df5mmZbW34x0QLjDZ7eS707i/Rr/ZmRua/R3ZPORv6eV1C2MU/R/MP1O9gCeH2mN9n0K+Wdb+rt7EHUrhPpVreS7GH9mQt1ryL+VoWt9Rl3MEuhdJr2vvI8+H4CPwQuo25XqeLHAe81ewf4I8gckf77G80up3uM5voqcRNuX0e800vMW/XwyBH7rEl9EZiC2n6jQ3masyxzY/EHxnXjeVfptIP797rAAkxjO4KNGZ/trjTJz/33O33rTpXPpVBf+1u4cfLqg8Wuxo9+Dnk/1XzQc/6W03RWhrD+dSzI4x+K/eS914Xnnisvp2MY7OrP2ldAToe86MFnQ0X+VnqU2xOfnrCh5f3Oha0GUpPciXQQGrqY5hK9LBX+nK/aebaweS8+AZSXnIa9/v4MzTh7b2jH6O/rlJdfiZBeMoUFmjBfy4wz7mBCkPgnz7y6Oq4x/l+sWXeO4lKrsdJvUvYZF111MdfmxLm0NpmI7591853Tj+VJVDGaNoZ3TRtahautDRL/qkm6KlW6Wa2EeXI3N5Ry0SX+e26xJ27K9K5iijNJyjvwsnllZ4mKeZbuy72I5F5VvNr6o+hcVbredoVc3/y7vN/keke0ywS6T6tqOfOE2mQKS8rJ/3A8mpHWfZVl7qq0oV0lbQ9m9bOszt+lb5LWsU8TxN8j9+LnOPnL3Pc73tz4X31fy7mVdDObZcnHfdev3VNV86ebRtF1VUsSui7U0OQ/rEvE8Jsp+j1H5Lbfnecrpa+Nf1XEi2mZUz/qIe4b7oJtDXi8/m85bN69HJOXr2i9Z+0PVVuW36n5x6V8Z/Yw640s+t5nQlpGfOPAdX2XPI5d+iP6wDJ8YFdvfRc/bOkR31jKpXHx2eb7J91kd7yaMOseb9w6Vp7PO9YyFUWeMM6pvfC7mhBXoI78z1SnyfDPLvqoyRp1nmNieZeAqRlUxV+Ssz3vvdSWm/paJ87ruuipsyTGmssfI3X4zWSMVTFNOlD1PNjbK+OeKsmI6b/J4mdTWp+TZ8jkfRXXEwgz0lPXZx9z7PruqOhdNYlqMZR2qeHe1N33OQdYYVeWyiG3l/rKeKteS2/UhXDdP885CMaWcPqbzaBJTOt1ViqnPjOqJmSzxcbfWtQ6iMNLPv6tx5om8fxh1niUu/GA5mMalq3lQnQ+25PmtspnlDxdRrwupaw/7WCvb9VLpynrWlbkURp17zrcPjNT7rSopsr9cnX95+861PRN/bM8Y1/YZmd0//Fmnp0oxvRvk5yJ2TNqwArpdiY+Y4Kk8b1nzWGSOGZnFF29nK1ynHAuiraK6XUudPlRh2+ZM1d3xJnp9S9H3Op2OKu4Xn7qrfn9gVO+Za3oe6vrq7vWq3z24Py6Fkf59Qjd2VzZ0dnXC62x89iGi7xwuumebc8ZUZFum81BlvKoka+19+cLIPGZU7fizT3GlP29+xfEwKa864+oUk3OCkXp9maJtFeLaJqNisctTG9HFRh13XZaoxmd6T7sWRuZz5Ssus3zgIseI2F7WVbWYzFsVsWZzT5veHWVE1qWaj7w4cyWma6TyMW8cTJP37bvchqQ6Gx+YAlkfL/exPqIt0b5r4brz5lPVzqfo9GfZLRrTNmMx1cfIz5z5Pkd9ntfyvilCnv6y/tr2q+ouM/WhbPyX2UNFdPqSqs6pLLuucWXLZAw24/UlOt9dzqELn1z5Zrtv8uz6EF82ZlaEK2FU7vtpXcIsydJRhbCa+e8/D60bUcbXTMMzfRK24nKssvgYr+x71lh8iO/1tBl/LPGlIseAT6q2J8m/" };
  }
});

// node_modules/.bun/graphemesplit@2.6.0/node_modules/graphemesplit/extPict.json
var require_extPict = __commonJS({
  "node_modules/.bun/graphemesplit@2.6.0/node_modules/graphemesplit/extPict.json"(exports2, module2) {
    module2.exports = { data: "AAACAAAAAACAOAAAAbYBSf7t2S1IBEEYBuDVDZ7FYrQMNsFiu3hgEYOI0SCXRIUrB8JhEZtgs5gEg1GMFk02m82oGI02m+9xezCOczv/uwv3fvAwc/PzfXOzcdqzWdaBDdiGPdiHdjE+DS3RNDuCfsn8idQ/g3OH3BdwKf0e96/gumTfYcncLdzBPTzAo+RZ+f0Cr/AG7/AJX4738x1wtz9FO5PX/50n6UXMNdfg/0lERERERERERERERETpdedHBvDRql4nq0cXtW9af98qdRby0Vvp8K4W0V+C5Xw0t4J2bfjeBp3cnEu1brnnCTYNa7eKdz91XP7WO9Lb4GqRb7cY6xbtAdqeVOsY/QGcevw/tb6OT85YhvfKYEx9CMuxKsKnrs+eJtVInVvHJ0eVYVvTZk2siFVLOCjb61PTZX3MdVWEyP7fjzpmMxdzTyq2Ebue6x61nXRGnzndWpf1an7dXmGYE4Y1ptqqKsK1nu26Ju0ty+maV2Rpvk+qnDZjKUIobUiesdAQE/jmCTmHmsskpFZsVYbtmXRcaoSGUPomunW2derQhDPFjtT1Q/eb8vnm990fq35oHVt11bU9m89c7DNI8Qs=" };
  }
});

// node_modules/.bun/graphemesplit@2.6.0/node_modules/graphemesplit/inCB.json
var require_inCB = __commonJS({
  "node_modules/.bun/graphemesplit@2.6.0/node_modules/graphemesplit/inCB.json"(exports2, module2) {
    module2.exports = { data: "AAgOAAAAAABQfgAAAWMGnPntmm2IVUUYx+dyb2ezXXtBiSCLsKDIiKIIoYINciGwQHrRL2Ufii0qMsv7QVBuQkXhkmW5gksQRhRFSBslbkllHyy3L2XllkXrB3uhF0tQ0Kj+xzN3d3buzJx5PeesOw/8mDNvz/PMnOc8s/fs6asTcgu4A9wF+mjdV9kEa8FqsE5j/DPgeUX/JvASeBW8Bd4GO8CHYDcz7nPwFRgD4+An8Cf4AxwBx0G9QcjrYBt4p5HN/YDqGEF9F7gW3AC6wU1gCVgK5oDlYA8YBXvBGOgHD4FzwSo6fg24EDwBxsEB8Cu1N4ByI1gA/gbfo+0wyuO0vgW8DK5i+tN5tVOyMmUWrs9k6nNxPY/WL0B5Mb2+HOU14HrwY2Ny/CLUbwa3gzsZPT7ZGECnDvdiPQ+ARyhpWxPlWnr9JLfeAdS/43S8qNiTIdq3FeUb9HolOEj7h9H2LtgJPgHr0TZKx31Jy30C/T+g7aDCbpPiuj/fStrTNfQGioWIHr9z+z8iiAEfdg4zdo7Gex6JRCKRSCQSiUQikYrzL367HmLq8zV+yyYJIbOTzva5aJtH2y9CuYBebwdX4PoYyv107ELUe5PsPWBavzHJ3tMtFuhluTWnPxKJRCKRSCQy/TjQCKt/XX3y/+o6HPJs35XNszPO0WQf+FnQfsnpU+vLUN8MdgNyRtZ2Ncp7wBDYDn4D47MIOes0QpaADeDUWsYe5pql3k3IZd3iPp4H6bjnUI6Cf8B1PYQ0wWCPno5IJBKJnJx83eN2fi7NeYd0jKsvr+A7p3749KzkXd2Ap+9R7qfrflhz/ava45m2I7Rcw+lI3/WtAO+Bx5PsG6+nk+xbv7Q/fWe4gc7ZRPu3oNzK6Hktmfy2r036vc82On44yb4ZHKFzPkL5aZJ9f9hH7Y8y+nbheq9irWOpf0z/L8nUWPmL6TuK6/8Uuhpd6r3sRv8cbszZXZm981HOB5fS/itzdIlYyMzpTa85HYtRv422LTPQ/yjd+/SZudvCr1DcV5Iv6W+HFRXaB988Rte2ugJrHKTPW4vx5akK+MWzvoI++Sb9zvKFriy/m8wbwpxXQL/gDNs5Tb+zTPfiza6sHEa5A3w8jWLgM/j6BePvoOBcM33+v6Hj9zvuQ978lR5ihl/bedM0DvN4vwI+NOvy7/SbCkze51WVRfXaCaJEmdlSm+H4lKLsVE3Kvoe2950tZdcnu5T1rISQKuaHovZNZw26/aKxvn0tS6oUG1WWmbAPvtbGjzPU2WvgV4uoEc7PkQ77MhHoYu1K7YvOVhv7uuJ7/QpdLcKtX2ZPthc1A/tEcK/zbAW+/0rbnqRVAlPuk0gC5b5cv1Q+BbIp8kGnX2VjQmT7bLm/Hfp1RfZ3kAdpGZI3h2iMnZCC47ftj+351WJ06PTLxk6I7OxxWH8rd4RCRHHuKC1DbOaIdJyQAn4vuPpqS8d5HVJUfy+p2lXjihIbuya/L2wowkae3TJEZFfmjywnBshRSl9s9Je1v7z9kL7bPE9Fi+xMlf09Z3Ne2KxNFu8qf2x02ojMD9McrpOLivTX9j6F9l/HfmgbotKnfp9nJCHqffFho0hcxWRNhHTarUI8h94PGx28Pp2xrrZ8SehcFToPhvabvbZ5JkXx4etZd4lZfn0+pIz8oMoRunpsbPgUUZ4NaYu1qcr9vC+2MWsa8yHOPlOxfU7L9Fnkg0t+0dGdZ9O38PGr6nPxwzRWXUX0/JmSN09kU+WPyD8f4jM+ioo7lW1femzuv0iXqi5r8yGq/fBts+gca/M8+orLvOc0RJ7P88c0J/m2L/OFbzfVa5LrXc4WH2NsbJrulcsafa+T99lFVwgpwr7JMy47U3T0FiFF56uQuss4j3gfbOb68sUlB6vOjaLPtrbdkLp9nZmqffcpqnurk4NU+oq8rzIx2Xddv8tel+peydar+htBpIufH0J4O2XFCCu2z0GZayjyDMzLS6Z+yGK1Sjmk7RNbtq91zrXQfumeOb58MdGTtxdlngmyc09nTlmxqfMcmvij67OJXV3R3dOQsZznh6qfkOL80M3BuvtW1B7yY2R+FLG/MsnzVXd+aF9VuUk1xzWudPwy1edzz1x8t9UfyndbHTY2yxTdHOCa92zj3CR+Te6fjzX5Ftf9M/E1VC4yzVehROa77/h09cmXb6Zxm2c3pPjSH9bn/wE=" };
  }
});

// node_modules/.bun/tiny-inflate@1.0.3/node_modules/tiny-inflate/index.js
var require_tiny_inflate = __commonJS({
  "node_modules/.bun/tiny-inflate@1.0.3/node_modules/tiny-inflate/index.js"(exports2, module2) {
    var TINF_OK = 0;
    var TINF_DATA_ERROR = -3;
    function Tree() {
      this.table = new Uint16Array(16);
      this.trans = new Uint16Array(288);
    }
    function Data(source, dest) {
      this.source = source;
      this.sourceIndex = 0;
      this.tag = 0;
      this.bitcount = 0;
      this.dest = dest;
      this.destLen = 0;
      this.ltree = new Tree();
      this.dtree = new Tree();
    }
    var sltree = new Tree();
    var sdtree = new Tree();
    var length_bits = new Uint8Array(30);
    var length_base = new Uint16Array(30);
    var dist_bits = new Uint8Array(30);
    var dist_base = new Uint16Array(30);
    var clcidx = new Uint8Array([
      16,
      17,
      18,
      0,
      8,
      7,
      9,
      6,
      10,
      5,
      11,
      4,
      12,
      3,
      13,
      2,
      14,
      1,
      15
    ]);
    var code_tree = new Tree();
    var lengths = new Uint8Array(288 + 32);
    function tinf_build_bits_base(bits, base, delta, first) {
      var i, sum;
      for (i = 0; i < delta; ++i) bits[i] = 0;
      for (i = 0; i < 30 - delta; ++i) bits[i + delta] = i / delta | 0;
      for (sum = first, i = 0; i < 30; ++i) {
        base[i] = sum;
        sum += 1 << bits[i];
      }
    }
    function tinf_build_fixed_trees(lt, dt) {
      var i;
      for (i = 0; i < 7; ++i) lt.table[i] = 0;
      lt.table[7] = 24;
      lt.table[8] = 152;
      lt.table[9] = 112;
      for (i = 0; i < 24; ++i) lt.trans[i] = 256 + i;
      for (i = 0; i < 144; ++i) lt.trans[24 + i] = i;
      for (i = 0; i < 8; ++i) lt.trans[24 + 144 + i] = 280 + i;
      for (i = 0; i < 112; ++i) lt.trans[24 + 144 + 8 + i] = 144 + i;
      for (i = 0; i < 5; ++i) dt.table[i] = 0;
      dt.table[5] = 32;
      for (i = 0; i < 32; ++i) dt.trans[i] = i;
    }
    var offs = new Uint16Array(16);
    function tinf_build_tree(t, lengths2, off, num) {
      var i, sum;
      for (i = 0; i < 16; ++i) t.table[i] = 0;
      for (i = 0; i < num; ++i) t.table[lengths2[off + i]]++;
      t.table[0] = 0;
      for (sum = 0, i = 0; i < 16; ++i) {
        offs[i] = sum;
        sum += t.table[i];
      }
      for (i = 0; i < num; ++i) {
        if (lengths2[off + i]) t.trans[offs[lengths2[off + i]]++] = i;
      }
    }
    function tinf_getbit(d) {
      if (!d.bitcount--) {
        d.tag = d.source[d.sourceIndex++];
        d.bitcount = 7;
      }
      var bit = d.tag & 1;
      d.tag >>>= 1;
      return bit;
    }
    function tinf_read_bits(d, num, base) {
      if (!num)
        return base;
      while (d.bitcount < 24) {
        d.tag |= d.source[d.sourceIndex++] << d.bitcount;
        d.bitcount += 8;
      }
      var val = d.tag & 65535 >>> 16 - num;
      d.tag >>>= num;
      d.bitcount -= num;
      return val + base;
    }
    function tinf_decode_symbol(d, t) {
      while (d.bitcount < 24) {
        d.tag |= d.source[d.sourceIndex++] << d.bitcount;
        d.bitcount += 8;
      }
      var sum = 0, cur = 0, len = 0;
      var tag = d.tag;
      do {
        cur = 2 * cur + (tag & 1);
        tag >>>= 1;
        ++len;
        sum += t.table[len];
        cur -= t.table[len];
      } while (cur >= 0);
      d.tag = tag;
      d.bitcount -= len;
      return t.trans[sum + cur];
    }
    function tinf_decode_trees(d, lt, dt) {
      var hlit, hdist, hclen;
      var i, num, length;
      hlit = tinf_read_bits(d, 5, 257);
      hdist = tinf_read_bits(d, 5, 1);
      hclen = tinf_read_bits(d, 4, 4);
      for (i = 0; i < 19; ++i) lengths[i] = 0;
      for (i = 0; i < hclen; ++i) {
        var clen = tinf_read_bits(d, 3, 0);
        lengths[clcidx[i]] = clen;
      }
      tinf_build_tree(code_tree, lengths, 0, 19);
      for (num = 0; num < hlit + hdist; ) {
        var sym = tinf_decode_symbol(d, code_tree);
        switch (sym) {
          case 16:
            var prev = lengths[num - 1];
            for (length = tinf_read_bits(d, 2, 3); length; --length) {
              lengths[num++] = prev;
            }
            break;
          case 17:
            for (length = tinf_read_bits(d, 3, 3); length; --length) {
              lengths[num++] = 0;
            }
            break;
          case 18:
            for (length = tinf_read_bits(d, 7, 11); length; --length) {
              lengths[num++] = 0;
            }
            break;
          default:
            lengths[num++] = sym;
            break;
        }
      }
      tinf_build_tree(lt, lengths, 0, hlit);
      tinf_build_tree(dt, lengths, hlit, hdist);
    }
    function tinf_inflate_block_data(d, lt, dt) {
      while (1) {
        var sym = tinf_decode_symbol(d, lt);
        if (sym === 256) {
          return TINF_OK;
        }
        if (sym < 256) {
          d.dest[d.destLen++] = sym;
        } else {
          var length, dist, offs2;
          var i;
          sym -= 257;
          length = tinf_read_bits(d, length_bits[sym], length_base[sym]);
          dist = tinf_decode_symbol(d, dt);
          offs2 = d.destLen - tinf_read_bits(d, dist_bits[dist], dist_base[dist]);
          for (i = offs2; i < offs2 + length; ++i) {
            d.dest[d.destLen++] = d.dest[i];
          }
        }
      }
    }
    function tinf_inflate_uncompressed_block(d) {
      var length, invlength;
      var i;
      while (d.bitcount > 8) {
        d.sourceIndex--;
        d.bitcount -= 8;
      }
      length = d.source[d.sourceIndex + 1];
      length = 256 * length + d.source[d.sourceIndex];
      invlength = d.source[d.sourceIndex + 3];
      invlength = 256 * invlength + d.source[d.sourceIndex + 2];
      if (length !== (~invlength & 65535))
        return TINF_DATA_ERROR;
      d.sourceIndex += 4;
      for (i = length; i; --i)
        d.dest[d.destLen++] = d.source[d.sourceIndex++];
      d.bitcount = 0;
      return TINF_OK;
    }
    function tinf_uncompress(source, dest) {
      var d = new Data(source, dest);
      var bfinal, btype, res;
      do {
        bfinal = tinf_getbit(d);
        btype = tinf_read_bits(d, 2, 0);
        switch (btype) {
          case 0:
            res = tinf_inflate_uncompressed_block(d);
            break;
          case 1:
            res = tinf_inflate_block_data(d, sltree, sdtree);
            break;
          case 2:
            tinf_decode_trees(d, d.ltree, d.dtree);
            res = tinf_inflate_block_data(d, d.ltree, d.dtree);
            break;
          default:
            res = TINF_DATA_ERROR;
        }
        if (res !== TINF_OK)
          throw new Error("Data error");
      } while (!bfinal);
      if (d.destLen < d.dest.length) {
        if (typeof d.dest.slice === "function")
          return d.dest.slice(0, d.destLen);
        else
          return d.dest.subarray(0, d.destLen);
      }
      return d.dest;
    }
    tinf_build_fixed_trees(sltree, sdtree);
    tinf_build_bits_base(length_bits, length_base, 4, 3);
    tinf_build_bits_base(dist_bits, dist_base, 2, 1);
    length_bits[28] = 0;
    length_base[28] = 258;
    module2.exports = tinf_uncompress;
  }
});

// node_modules/.bun/unicode-trie@2.0.0/node_modules/unicode-trie/swap.js
var require_swap = __commonJS({
  "node_modules/.bun/unicode-trie@2.0.0/node_modules/unicode-trie/swap.js"(exports2, module2) {
    var isBigEndian = new Uint8Array(new Uint32Array([305419896]).buffer)[0] === 18;
    var swap = (b, n, m) => {
      let i = b[n];
      b[n] = b[m];
      b[m] = i;
    };
    var swap32 = (array) => {
      const len = array.length;
      for (let i = 0; i < len; i += 4) {
        swap(array, i, i + 3);
        swap(array, i + 1, i + 2);
      }
    };
    var swap32LE = (array) => {
      if (isBigEndian) {
        swap32(array);
      }
    };
    module2.exports = {
      swap32LE
    };
  }
});

// node_modules/.bun/unicode-trie@2.0.0/node_modules/unicode-trie/index.js
var require_unicode_trie = __commonJS({
  "node_modules/.bun/unicode-trie@2.0.0/node_modules/unicode-trie/index.js"(exports2, module2) {
    var inflate = require_tiny_inflate();
    var { swap32LE } = require_swap();
    var SHIFT_1 = 6 + 5;
    var SHIFT_2 = 5;
    var SHIFT_1_2 = SHIFT_1 - SHIFT_2;
    var OMITTED_BMP_INDEX_1_LENGTH = 65536 >> SHIFT_1;
    var INDEX_2_BLOCK_LENGTH = 1 << SHIFT_1_2;
    var INDEX_2_MASK = INDEX_2_BLOCK_LENGTH - 1;
    var INDEX_SHIFT = 2;
    var DATA_BLOCK_LENGTH = 1 << SHIFT_2;
    var DATA_MASK = DATA_BLOCK_LENGTH - 1;
    var LSCP_INDEX_2_OFFSET = 65536 >> SHIFT_2;
    var LSCP_INDEX_2_LENGTH = 1024 >> SHIFT_2;
    var INDEX_2_BMP_LENGTH = LSCP_INDEX_2_OFFSET + LSCP_INDEX_2_LENGTH;
    var UTF8_2B_INDEX_2_OFFSET = INDEX_2_BMP_LENGTH;
    var UTF8_2B_INDEX_2_LENGTH = 2048 >> 6;
    var INDEX_1_OFFSET = UTF8_2B_INDEX_2_OFFSET + UTF8_2B_INDEX_2_LENGTH;
    var DATA_GRANULARITY = 1 << INDEX_SHIFT;
    var UnicodeTrie = class {
      constructor(data) {
        const isBuffer = typeof data.readUInt32BE === "function" && typeof data.slice === "function";
        if (isBuffer || data instanceof Uint8Array) {
          let uncompressedLength;
          if (isBuffer) {
            this.highStart = data.readUInt32LE(0);
            this.errorValue = data.readUInt32LE(4);
            uncompressedLength = data.readUInt32LE(8);
            data = data.slice(12);
          } else {
            const view = new DataView(data.buffer);
            this.highStart = view.getUint32(0, true);
            this.errorValue = view.getUint32(4, true);
            uncompressedLength = view.getUint32(8, true);
            data = data.subarray(12);
          }
          data = inflate(data, new Uint8Array(uncompressedLength));
          data = inflate(data, new Uint8Array(uncompressedLength));
          swap32LE(data);
          this.data = new Uint32Array(data.buffer);
        } else {
          ({ data: this.data, highStart: this.highStart, errorValue: this.errorValue } = data);
        }
      }
      get(codePoint) {
        let index;
        if (codePoint < 0 || codePoint > 1114111) {
          return this.errorValue;
        }
        if (codePoint < 55296 || codePoint > 56319 && codePoint <= 65535) {
          index = (this.data[codePoint >> SHIFT_2] << INDEX_SHIFT) + (codePoint & DATA_MASK);
          return this.data[index];
        }
        if (codePoint <= 65535) {
          index = (this.data[LSCP_INDEX_2_OFFSET + (codePoint - 55296 >> SHIFT_2)] << INDEX_SHIFT) + (codePoint & DATA_MASK);
          return this.data[index];
        }
        if (codePoint < this.highStart) {
          index = this.data[INDEX_1_OFFSET - OMITTED_BMP_INDEX_1_LENGTH + (codePoint >> SHIFT_1)];
          index = this.data[index + (codePoint >> SHIFT_2 & INDEX_2_MASK)];
          index = (index << INDEX_SHIFT) + (codePoint & DATA_MASK);
          return this.data[index];
        }
        return this.data[this.data.length - DATA_GRANULARITY];
      }
    };
    module2.exports = UnicodeTrie;
  }
});

// node_modules/.bun/js-base64@3.7.7/node_modules/js-base64/base64.js
var require_base64 = __commonJS({
  "node_modules/.bun/js-base64@3.7.7/node_modules/js-base64/base64.js"(exports2, module2) {
    (function(global2, factory) {
      typeof exports2 === "object" && typeof module2 !== "undefined" ? module2.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (
        // cf. https://github.com/dankogai/js-base64/issues/119
        (function() {
          var _Base64 = global2.Base64;
          var gBase64 = factory();
          gBase64.noConflict = function() {
            global2.Base64 = _Base64;
            return gBase64;
          };
          if (global2.Meteor) {
            Base64 = gBase64;
          }
          global2.Base64 = gBase64;
        })()
      );
    })(typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : exports2, function() {
      "use strict";
      var version = "3.7.7";
      var VERSION = version;
      var _hasBuffer = typeof Buffer === "function";
      var _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
      var _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
      var b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var b64chs = Array.prototype.slice.call(b64ch);
      var b64tab = (function(a) {
        var tab = {};
        a.forEach(function(c, i) {
          return tab[c] = i;
        });
        return tab;
      })(b64chs);
      var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
      var _fromCC = String.fromCharCode.bind(String);
      var _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : function(it) {
        return new Uint8Array(Array.prototype.slice.call(it, 0));
      };
      var _mkUriSafe = function(src) {
        return src.replace(/=/g, "").replace(/[+\/]/g, function(m0) {
          return m0 == "+" ? "-" : "_";
        });
      };
      var _tidyB64 = function(s) {
        return s.replace(/[^A-Za-z0-9\+\/]/g, "");
      };
      var btoaPolyfill = function(bin) {
        var u32, c0, c1, c2, asc = "";
        var pad = bin.length % 3;
        for (var i = 0; i < bin.length; ) {
          if ((c0 = bin.charCodeAt(i++)) > 255 || (c1 = bin.charCodeAt(i++)) > 255 || (c2 = bin.charCodeAt(i++)) > 255)
            throw new TypeError("invalid character found");
          u32 = c0 << 16 | c1 << 8 | c2;
          asc += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
        }
        return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
      };
      var _btoa = typeof btoa === "function" ? function(bin) {
        return btoa(bin);
      } : _hasBuffer ? function(bin) {
        return Buffer.from(bin, "binary").toString("base64");
      } : btoaPolyfill;
      var _fromUint8Array = _hasBuffer ? function(u8a) {
        return Buffer.from(u8a).toString("base64");
      } : function(u8a) {
        var maxargs = 4096;
        var strs = [];
        for (var i = 0, l = u8a.length; i < l; i += maxargs) {
          strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
        }
        return _btoa(strs.join(""));
      };
      var fromUint8Array = function(u8a, urlsafe) {
        if (urlsafe === void 0) {
          urlsafe = false;
        }
        return urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
      };
      var cb_utob = function(c) {
        if (c.length < 2) {
          var cc = c.charCodeAt(0);
          return cc < 128 ? c : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
        } else {
          var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320);
          return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
        }
      };
      var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
      var utob = function(u) {
        return u.replace(re_utob, cb_utob);
      };
      var _encode = _hasBuffer ? function(s) {
        return Buffer.from(s, "utf8").toString("base64");
      } : _TE ? function(s) {
        return _fromUint8Array(_TE.encode(s));
      } : function(s) {
        return _btoa(utob(s));
      };
      var encode = function(src, urlsafe) {
        if (urlsafe === void 0) {
          urlsafe = false;
        }
        return urlsafe ? _mkUriSafe(_encode(src)) : _encode(src);
      };
      var encodeURI2 = function(src) {
        return encode(src, true);
      };
      var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
      var cb_btou = function(cccc) {
        switch (cccc.length) {
          case 4:
            var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536;
            return _fromCC((offset >>> 10) + 55296) + _fromCC((offset & 1023) + 56320);
          case 3:
            return _fromCC((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2));
          default:
            return _fromCC((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1));
        }
      };
      var btou = function(b) {
        return b.replace(re_btou, cb_btou);
      };
      var atobPolyfill = function(asc) {
        asc = asc.replace(/\s+/g, "");
        if (!b64re.test(asc))
          throw new TypeError("malformed base64.");
        asc += "==".slice(2 - (asc.length & 3));
        var u24, bin = "", r1, r2;
        for (var i = 0; i < asc.length; ) {
          u24 = b64tab[asc.charAt(i++)] << 18 | b64tab[asc.charAt(i++)] << 12 | (r1 = b64tab[asc.charAt(i++)]) << 6 | (r2 = b64tab[asc.charAt(i++)]);
          bin += r1 === 64 ? _fromCC(u24 >> 16 & 255) : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255) : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
        }
        return bin;
      };
      var _atob = typeof atob === "function" ? function(asc) {
        return atob(_tidyB64(asc));
      } : _hasBuffer ? function(asc) {
        return Buffer.from(asc, "base64").toString("binary");
      } : atobPolyfill;
      var _toUint8Array = _hasBuffer ? function(a) {
        return _U8Afrom(Buffer.from(a, "base64"));
      } : function(a) {
        return _U8Afrom(_atob(a).split("").map(function(c) {
          return c.charCodeAt(0);
        }));
      };
      var toUint8Array = function(a) {
        return _toUint8Array(_unURI(a));
      };
      var _decode = _hasBuffer ? function(a) {
        return Buffer.from(a, "base64").toString("utf8");
      } : _TD ? function(a) {
        return _TD.decode(_toUint8Array(a));
      } : function(a) {
        return btou(_atob(a));
      };
      var _unURI = function(a) {
        return _tidyB64(a.replace(/[-_]/g, function(m0) {
          return m0 == "-" ? "+" : "/";
        }));
      };
      var decode = function(src) {
        return _decode(_unURI(src));
      };
      var isValid = function(src) {
        if (typeof src !== "string")
          return false;
        var s = src.replace(/\s+/g, "").replace(/={0,2}$/, "");
        return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
      };
      var _noEnum = function(v) {
        return {
          value: v,
          enumerable: false,
          writable: true,
          configurable: true
        };
      };
      var extendString = function() {
        var _add = function(name, body) {
          return Object.defineProperty(String.prototype, name, _noEnum(body));
        };
        _add("fromBase64", function() {
          return decode(this);
        });
        _add("toBase64", function(urlsafe) {
          return encode(this, urlsafe);
        });
        _add("toBase64URI", function() {
          return encode(this, true);
        });
        _add("toBase64URL", function() {
          return encode(this, true);
        });
        _add("toUint8Array", function() {
          return toUint8Array(this);
        });
      };
      var extendUint8Array = function() {
        var _add = function(name, body) {
          return Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
        };
        _add("toBase64", function(urlsafe) {
          return fromUint8Array(this, urlsafe);
        });
        _add("toBase64URI", function() {
          return fromUint8Array(this, true);
        });
        _add("toBase64URL", function() {
          return fromUint8Array(this, true);
        });
      };
      var extendBuiltins = function() {
        extendString();
        extendUint8Array();
      };
      var gBase64 = {
        version,
        VERSION,
        atob: _atob,
        atobPolyfill,
        btoa: _btoa,
        btoaPolyfill,
        fromBase64: decode,
        toBase64: encode,
        encode,
        encodeURI: encodeURI2,
        encodeURL: encodeURI2,
        utob,
        btou,
        decode,
        isValid,
        fromUint8Array,
        toUint8Array,
        extendString,
        extendUint8Array,
        extendBuiltins
      };
      gBase64.Base64 = {};
      Object.keys(gBase64).forEach(function(k) {
        return gBase64.Base64[k] = gBase64[k];
      });
      return gBase64;
    });
  }
});

// node_modules/.bun/graphemesplit@2.6.0/node_modules/graphemesplit/index.js
var require_graphemesplit = __commonJS({
  "node_modules/.bun/graphemesplit@2.6.0/node_modules/graphemesplit/index.js"(exports2, module2) {
    var types = require_types();
    var typeTrieData = require_typeTrie().data;
    var extPictData = require_extPict().data;
    var inCBData = require_inCB().data;
    var UnicodeTrie = require_unicode_trie();
    var Base642 = require_base64().Base64;
    var typeTrie = new UnicodeTrie(Base642.toUint8Array(typeTrieData));
    var extPict = new UnicodeTrie(Base642.toUint8Array(extPictData));
    var inCB = new UnicodeTrie(Base642.toUint8Array(inCBData));
    function is(type, bit) {
      return (type & bit) !== 0;
    }
    function nextGraphemeClusterSize(s, ts, start) {
      const L = ts.length;
      for (let i = start; i + 1 < L; i++) {
        const curr = ts[i + 0];
        const next = ts[i + 1];
        switch (s.gb9c) {
          case 0:
            if (is(curr, types.InCB_Consonant)) s.gb9c = 1;
            break;
          case 1:
            if (is(curr, types.InCB_Extend)) s.gb9c = 1;
            else if (is(curr, types.InCB_Linker)) s.gb9c = 2;
            else s.gb9c = is(curr, types.InCB_Consonant) ? 1 : 0;
            break;
          case 2:
            if (is(curr, types.InCB_Extend | types.InCB_Linker)) s.gb9c = 2;
            else s.gb9c = is(curr, types.InCB_Consonant) ? 1 : 0;
            break;
        }
        switch (s.gb11) {
          case 0:
            if (is(curr, types.Extended_Pictographic)) s.gb11 = 1;
            break;
          case 1:
            if (is(curr, types.Extend)) s.gb11 = 1;
            else if (is(curr, types.ZWJ)) s.gb11 = 2;
            else s.gb11 = is(curr, types.Extended_Pictographic) ? 1 : 0;
            break;
          case 2:
            s.gb11 = is(curr, types.Extended_Pictographic) ? 1 : 0;
            break;
        }
        switch (s.gb12) {
          case 0:
            if (is(curr, types.Regional_Indicator)) s.gb12 = 1;
            else s.gb12 = -1;
            break;
          case 1:
            if (is(curr, types.Regional_Indicator)) s.gb12 = 0;
            else s.gb12 = -1;
            break;
        }
        switch (s.gb13) {
          case 0:
            if (!is(curr, types.Regional_Indicator)) s.gb13 = 1;
            break;
          case 1:
            if (is(curr, types.Regional_Indicator)) s.gb13 = 2;
            else s.gb13 = 1;
            break;
          case 2:
            s.gb13 = 1;
            break;
        }
        if (is(curr, types.CR) && is(next, types.LF)) {
          continue;
        }
        if (is(curr, types.Control | types.CR | types.LF)) {
          return i + 1 - start;
        }
        if (is(next, types.Control | types.CR | types.LF)) {
          return i + 1 - start;
        }
        if (is(curr, types.L) && is(next, types.L | types.V | types.LV | types.LVT)) {
          continue;
        }
        if (is(curr, types.LV | types.V) && is(next, types.V | types.T)) {
          continue;
        }
        if (is(curr, types.LVT | types.T) && is(next, types.T)) {
          continue;
        }
        if (is(next, types.Extend | types.ZWJ)) {
          continue;
        }
        if (is(next, types.SpacingMark)) {
          continue;
        }
        if (is(curr, types.Prepend)) {
          continue;
        }
        if (is(next, types.InCB_Consonant) && s.gb9c === 2) {
          continue;
        }
        if (is(next, types.Extended_Pictographic) && s.gb11 === 2) {
          continue;
        }
        if (is(next, types.Regional_Indicator) && s.gb12 === 1) {
          continue;
        }
        if (is(next, types.Regional_Indicator) && s.gb13 === 2) {
          continue;
        }
        return i + 1 - start;
      }
      return L - start;
    }
    module2.exports = function split2(str) {
      const graphemeClusters = [];
      const map = [0];
      const ts = [];
      for (let i = 0; i < str.length; ) {
        const code = str.codePointAt(i);
        ts.push(typeTrie.get(code) | extPict.get(code) | inCB.get(code));
        i += code > 65535 ? 2 : 1;
        map.push(i);
      }
      const s = {
        gb9c: 0,
        gb11: 0,
        gb12: 0,
        gb13: 0
      };
      for (let offset = 0; offset < ts.length; ) {
        const size = nextGraphemeClusterSize(s, ts, offset);
        const start = map[offset];
        const end = map[offset + size];
        graphemeClusters.push(str.slice(start, end));
        offset += size;
      }
      return graphemeClusters;
    };
  }
});

// src/search.tsx
var search_exports = {};
__export(search_exports, {
  default: () => search_default
});
module.exports = __toCommonJS(search_exports);
var import_api56 = require("@raycast/api");

// src/components/RootErrorBoundary.tsx
var import_api28 = require("@raycast/api");
var import_react13 = require("react");

// src/components/TroubleshootingGuide.tsx
var import_api27 = require("@raycast/api");

// src/components/actions/ActionWithReprompt.tsx
var import_api18 = require("@raycast/api");

// src/components/searchVault/context/vaultItem.tsx
var import_react = require("react");
var VaultItemContext = (0, import_react.createContext)(null);
var useSelectedVaultItem = () => {
  const session = (0, import_react.useContext)(VaultItemContext);
  if (session == null) {
    throw new Error("useSelectVaultItem must be used within a VaultItemContext.Provider");
  }
  return session;
};
var vaultItem_default = VaultItemContext;

// src/utils/hooks/useReprompt.tsx
var import_api17 = require("@raycast/api");

// src/components/RepromptForm.tsx
var import_api = require("@raycast/api");
var import_jsx_runtime = require("react/jsx-runtime");
var RepromptForm = (props) => {
  const { description, onConfirm } = props;
  function onSubmit(values) {
    onConfirm(values.password);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_api.Form,
    {
      navigationTitle: "Confirmation Required",
      actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Action.SubmitForm, { title: "Confirm", onSubmit }) }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Form.Description, { title: "Confirmation Required for", text: description }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api.Form.PasswordField, { autoFocus: true, id: "password", title: "Master Password" })
      ]
    }
  );
};
var RepromptForm_default = RepromptForm;

// src/context/session/session.tsx
var import_api16 = require("@raycast/api");
var import_react8 = require("react");

// src/components/UnlockForm.tsx
var import_api13 = require("@raycast/api");
var import_react6 = require("react");

// src/constants/general.ts
var import_api2 = require("@raycast/api");

// src/types/vault.ts
var CARD_BRANDS = {
  VISA: "Visa",
  MASTERCARD: "Mastercard",
  AMEX: "Amex",
  DISCOVER: "Discover",
  DINERS_CLUB: "Diners Club",
  JCB: "JCB",
  MAESTRO: "Maestro",
  UNION_PAY: "UnionPay",
  RU_PAY: "RuPay",
  OTHER: "Other"
};

// src/constants/general.ts
var DEFAULT_SERVER_URL = "https://bitwarden.com";
var SENSITIVE_VALUE_PLACEHOLDER = "HIDDEN-VALUE";
var LOCAL_STORAGE_KEY = {
  PASSWORD_OPTIONS: "bw-generate-password-options",
  PASSWORD_ONE_TIME_WARNING: "bw-generate-password-warning-accepted",
  SESSION_TOKEN: "sessionToken",
  REPROMPT_HASH: "sessionRepromptHash",
  SERVER_URL: "cliServer",
  LAST_ACTIVITY_TIME: "lastActivityTime",
  VAULT_LOCK_REASON: "vaultLockReason",
  VAULT_FAVORITE_ORDER: "vaultFavoriteOrder",
  VAULT_LAST_STATUS: "lastVaultStatus"
};
var VAULT_LOCK_MESSAGES = {
  TIMEOUT: "Vault timed out due to inactivity",
  MANUAL: "Manually locked by the user",
  SYSTEM_LOCK: "Screen was locked",
  SYSTEM_SLEEP: "System went to sleep",
  CLI_UPDATED: "Bitwarden has been updated. Please login again."
};
var SHORTCUT_KEY_SEQUENCE = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "+",
  "-",
  ".",
  ","
];
var FOLDER_OPTIONS = {
  ALL: "all",
  NO_FOLDER: "no-folder"
};
var CACHE_KEYS = {
  IV: "iv",
  VAULT: "vault",
  CURRENT_FOLDER_ID: "currentFolderId",
  SEND_TYPE_FILTER: "sendTypeFilter",
  CLI_VERSION: "cliVersion"
};
var ITEM_TYPE_TO_ICON_MAP = {
  [1 /* LOGIN */]: import_api2.Icon.Globe,
  [3 /* CARD */]: import_api2.Icon.CreditCard,
  [4 /* IDENTITY */]: import_api2.Icon.Person,
  [2 /* NOTE */]: import_api2.Icon.Document,
  [5 /* SSH_KEY */]: import_api2.Icon.Key
};

// src/context/bitwarden.tsx
var import_react3 = require("react");

// src/api/bitwarden.ts
var import_api8 = require("@raycast/api");

// node_modules/.bun/execa@7.0.0/node_modules/execa/index.js
var import_node_buffer = require("node:buffer");
var import_node_path2 = __toESM(require("node:path"), 1);
var import_node_child_process = __toESM(require("node:child_process"), 1);
var import_node_process2 = __toESM(require("node:process"), 1);
var import_cross_spawn = __toESM(require_cross_spawn(), 1);

// node_modules/.bun/strip-final-newline@3.0.0/node_modules/strip-final-newline/index.js
function stripFinalNewline(input) {
  const LF = typeof input === "string" ? "\n" : "\n".charCodeAt();
  const CR = typeof input === "string" ? "\r" : "\r".charCodeAt();
  if (input[input.length - 1] === LF) {
    input = input.slice(0, -1);
  }
  if (input[input.length - 1] === CR) {
    input = input.slice(0, -1);
  }
  return input;
}

// node_modules/.bun/npm-run-path@5.1.0/node_modules/npm-run-path/index.js
var import_node_process = __toESM(require("node:process"), 1);
var import_node_path = __toESM(require("node:path"), 1);
var import_node_url = __toESM(require("node:url"), 1);

// node_modules/.bun/path-key@4.0.0/node_modules/path-key/index.js
function pathKey(options = {}) {
  const {
    env = process.env,
    platform: platform2 = process.platform
  } = options;
  if (platform2 !== "win32") {
    return "PATH";
  }
  return Object.keys(env).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
}

// node_modules/.bun/npm-run-path@5.1.0/node_modules/npm-run-path/index.js
function npmRunPath(options = {}) {
  const {
    cwd = import_node_process.default.cwd(),
    path: path_ = import_node_process.default.env[pathKey()],
    execPath = import_node_process.default.execPath
  } = options;
  let previous;
  const cwdString = cwd instanceof URL ? import_node_url.default.fileURLToPath(cwd) : cwd;
  let cwdPath = import_node_path.default.resolve(cwdString);
  const result = [];
  while (previous !== cwdPath) {
    result.push(import_node_path.default.join(cwdPath, "node_modules/.bin"));
    previous = cwdPath;
    cwdPath = import_node_path.default.resolve(cwdPath, "..");
  }
  result.push(import_node_path.default.resolve(cwdString, execPath, ".."));
  return [...result, path_].join(import_node_path.default.delimiter);
}
function npmRunPathEnv({ env = import_node_process.default.env, ...options } = {}) {
  env = { ...env };
  const path3 = pathKey({ env });
  options.path = env[path3];
  env[path3] = npmRunPath(options);
  return env;
}

// node_modules/.bun/mimic-fn@4.0.0/node_modules/mimic-fn/index.js
var copyProperty = (to, from, property, ignoreNonConfigurable) => {
  if (property === "length" || property === "prototype") {
    return;
  }
  if (property === "arguments" || property === "caller") {
    return;
  }
  const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
  const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);
  if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
    return;
  }
  Object.defineProperty(to, property, fromDescriptor);
};
var canCopyProperty = function(toDescriptor, fromDescriptor) {
  return toDescriptor === void 0 || toDescriptor.configurable || toDescriptor.writable === fromDescriptor.writable && toDescriptor.enumerable === fromDescriptor.enumerable && toDescriptor.configurable === fromDescriptor.configurable && (toDescriptor.writable || toDescriptor.value === fromDescriptor.value);
};
var changePrototype = (to, from) => {
  const fromPrototype = Object.getPrototypeOf(from);
  if (fromPrototype === Object.getPrototypeOf(to)) {
    return;
  }
  Object.setPrototypeOf(to, fromPrototype);
};
var wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/
${fromBody}`;
var toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, "toString");
var toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name");
var changeToString = (to, from, name) => {
  const withName = name === "" ? "" : `with ${name.trim()}() `;
  const newToString = wrappedToString.bind(null, withName, from.toString());
  Object.defineProperty(newToString, "name", toStringName);
  Object.defineProperty(to, "toString", { ...toStringDescriptor, value: newToString });
};
function mimicFunction(to, from, { ignoreNonConfigurable = false } = {}) {
  const { name } = to;
  for (const property of Reflect.ownKeys(from)) {
    copyProperty(to, from, property, ignoreNonConfigurable);
  }
  changePrototype(to, from);
  changeToString(to, from, name);
  return to;
}

// node_modules/.bun/onetime@6.0.0/node_modules/onetime/index.js
var calledFunctions = /* @__PURE__ */ new WeakMap();
var onetime = (function_, options = {}) => {
  if (typeof function_ !== "function") {
    throw new TypeError("Expected a function");
  }
  let returnValue;
  let callCount = 0;
  const functionName = function_.displayName || function_.name || "<anonymous>";
  const onetime2 = function(...arguments_) {
    calledFunctions.set(onetime2, ++callCount);
    if (callCount === 1) {
      returnValue = function_.apply(this, arguments_);
      function_ = null;
    } else if (options.throw === true) {
      throw new Error(`Function \`${functionName}\` can only be called once`);
    }
    return returnValue;
  };
  mimicFunction(onetime2, function_);
  calledFunctions.set(onetime2, callCount);
  return onetime2;
};
onetime.callCount = (function_) => {
  if (!calledFunctions.has(function_)) {
    throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
  }
  return calledFunctions.get(function_);
};
var onetime_default = onetime;

// node_modules/.bun/human-signals@4.3.0/node_modules/human-signals/build/src/main.js
var import_node_os2 = require("node:os");

// node_modules/.bun/human-signals@4.3.0/node_modules/human-signals/build/src/realtime.js
var getRealtimeSignals = function() {
  const length = SIGRTMAX - SIGRTMIN + 1;
  return Array.from({ length }, getRealtimeSignal);
};
var getRealtimeSignal = function(value, index) {
  return {
    name: `SIGRT${index + 1}`,
    number: SIGRTMIN + index,
    action: "terminate",
    description: "Application-specific signal (realtime)",
    standard: "posix"
  };
};
var SIGRTMIN = 34;
var SIGRTMAX = 64;

// node_modules/.bun/human-signals@4.3.0/node_modules/human-signals/build/src/signals.js
var import_node_os = require("node:os");

// node_modules/.bun/human-signals@4.3.0/node_modules/human-signals/build/src/core.js
var SIGNALS = [
  {
    name: "SIGHUP",
    number: 1,
    action: "terminate",
    description: "Terminal closed",
    standard: "posix"
  },
  {
    name: "SIGINT",
    number: 2,
    action: "terminate",
    description: "User interruption with CTRL-C",
    standard: "ansi"
  },
  {
    name: "SIGQUIT",
    number: 3,
    action: "core",
    description: "User interruption with CTRL-\\",
    standard: "posix"
  },
  {
    name: "SIGILL",
    number: 4,
    action: "core",
    description: "Invalid machine instruction",
    standard: "ansi"
  },
  {
    name: "SIGTRAP",
    number: 5,
    action: "core",
    description: "Debugger breakpoint",
    standard: "posix"
  },
  {
    name: "SIGABRT",
    number: 6,
    action: "core",
    description: "Aborted",
    standard: "ansi"
  },
  {
    name: "SIGIOT",
    number: 6,
    action: "core",
    description: "Aborted",
    standard: "bsd"
  },
  {
    name: "SIGBUS",
    number: 7,
    action: "core",
    description: "Bus error due to misaligned, non-existing address or paging error",
    standard: "bsd"
  },
  {
    name: "SIGEMT",
    number: 7,
    action: "terminate",
    description: "Command should be emulated but is not implemented",
    standard: "other"
  },
  {
    name: "SIGFPE",
    number: 8,
    action: "core",
    description: "Floating point arithmetic error",
    standard: "ansi"
  },
  {
    name: "SIGKILL",
    number: 9,
    action: "terminate",
    description: "Forced termination",
    standard: "posix",
    forced: true
  },
  {
    name: "SIGUSR1",
    number: 10,
    action: "terminate",
    description: "Application-specific signal",
    standard: "posix"
  },
  {
    name: "SIGSEGV",
    number: 11,
    action: "core",
    description: "Segmentation fault",
    standard: "ansi"
  },
  {
    name: "SIGUSR2",
    number: 12,
    action: "terminate",
    description: "Application-specific signal",
    standard: "posix"
  },
  {
    name: "SIGPIPE",
    number: 13,
    action: "terminate",
    description: "Broken pipe or socket",
    standard: "posix"
  },
  {
    name: "SIGALRM",
    number: 14,
    action: "terminate",
    description: "Timeout or timer",
    standard: "posix"
  },
  {
    name: "SIGTERM",
    number: 15,
    action: "terminate",
    description: "Termination",
    standard: "ansi"
  },
  {
    name: "SIGSTKFLT",
    number: 16,
    action: "terminate",
    description: "Stack is empty or overflowed",
    standard: "other"
  },
  {
    name: "SIGCHLD",
    number: 17,
    action: "ignore",
    description: "Child process terminated, paused or unpaused",
    standard: "posix"
  },
  {
    name: "SIGCLD",
    number: 17,
    action: "ignore",
    description: "Child process terminated, paused or unpaused",
    standard: "other"
  },
  {
    name: "SIGCONT",
    number: 18,
    action: "unpause",
    description: "Unpaused",
    standard: "posix",
    forced: true
  },
  {
    name: "SIGSTOP",
    number: 19,
    action: "pause",
    description: "Paused",
    standard: "posix",
    forced: true
  },
  {
    name: "SIGTSTP",
    number: 20,
    action: "pause",
    description: 'Paused using CTRL-Z or "suspend"',
    standard: "posix"
  },
  {
    name: "SIGTTIN",
    number: 21,
    action: "pause",
    description: "Background process cannot read terminal input",
    standard: "posix"
  },
  {
    name: "SIGBREAK",
    number: 21,
    action: "terminate",
    description: "User interruption with CTRL-BREAK",
    standard: "other"
  },
  {
    name: "SIGTTOU",
    number: 22,
    action: "pause",
    description: "Background process cannot write to terminal output",
    standard: "posix"
  },
  {
    name: "SIGURG",
    number: 23,
    action: "ignore",
    description: "Socket received out-of-band data",
    standard: "bsd"
  },
  {
    name: "SIGXCPU",
    number: 24,
    action: "core",
    description: "Process timed out",
    standard: "bsd"
  },
  {
    name: "SIGXFSZ",
    number: 25,
    action: "core",
    description: "File too big",
    standard: "bsd"
  },
  {
    name: "SIGVTALRM",
    number: 26,
    action: "terminate",
    description: "Timeout or timer",
    standard: "bsd"
  },
  {
    name: "SIGPROF",
    number: 27,
    action: "terminate",
    description: "Timeout or timer",
    standard: "bsd"
  },
  {
    name: "SIGWINCH",
    number: 28,
    action: "ignore",
    description: "Terminal window size changed",
    standard: "bsd"
  },
  {
    name: "SIGIO",
    number: 29,
    action: "terminate",
    description: "I/O is available",
    standard: "other"
  },
  {
    name: "SIGPOLL",
    number: 29,
    action: "terminate",
    description: "Watched event",
    standard: "other"
  },
  {
    name: "SIGINFO",
    number: 29,
    action: "ignore",
    description: "Request for process information",
    standard: "other"
  },
  {
    name: "SIGPWR",
    number: 30,
    action: "terminate",
    description: "Device running out of power",
    standard: "systemv"
  },
  {
    name: "SIGSYS",
    number: 31,
    action: "core",
    description: "Invalid system call",
    standard: "other"
  },
  {
    name: "SIGUNUSED",
    number: 31,
    action: "terminate",
    description: "Invalid system call",
    standard: "other"
  }
];

// node_modules/.bun/human-signals@4.3.0/node_modules/human-signals/build/src/signals.js
var getSignals = function() {
  const realtimeSignals = getRealtimeSignals();
  const signals = [...SIGNALS, ...realtimeSignals].map(normalizeSignal);
  return signals;
};
var normalizeSignal = function({
  name,
  number: defaultNumber,
  description,
  action,
  forced = false,
  standard
}) {
  const {
    signals: { [name]: constantSignal }
  } = import_node_os.constants;
  const supported = constantSignal !== void 0;
  const number = supported ? constantSignal : defaultNumber;
  return { name, number, description, supported, action, forced, standard };
};

// node_modules/.bun/human-signals@4.3.0/node_modules/human-signals/build/src/main.js
var getSignalsByName = function() {
  const signals = getSignals();
  return Object.fromEntries(signals.map(getSignalByName));
};
var getSignalByName = function({
  name,
  number,
  description,
  supported,
  action,
  forced,
  standard
}) {
  return [
    name,
    { name, number, description, supported, action, forced, standard }
  ];
};
var signalsByName = getSignalsByName();
var getSignalsByNumber = function() {
  const signals = getSignals();
  const length = SIGRTMAX + 1;
  const signalsA = Array.from({ length }, (value, number) => getSignalByNumber(number, signals));
  return Object.assign({}, ...signalsA);
};
var getSignalByNumber = function(number, signals) {
  const signal = findSignalByNumber(number, signals);
  if (signal === void 0) {
    return {};
  }
  const { name, description, supported, action, forced, standard } = signal;
  return {
    [number]: {
      name,
      number,
      description,
      supported,
      action,
      forced,
      standard
    }
  };
};
var findSignalByNumber = function(number, signals) {
  const signal = signals.find(({ name }) => import_node_os2.constants.signals[name] === number);
  if (signal !== void 0) {
    return signal;
  }
  return signals.find((signalA) => signalA.number === number);
};
var signalsByNumber = getSignalsByNumber();

// node_modules/.bun/execa@7.0.0/node_modules/execa/lib/error.js
var getErrorPrefix = ({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled }) => {
  if (timedOut) {
    return `timed out after ${timeout} milliseconds`;
  }
  if (isCanceled) {
    return "was canceled";
  }
  if (errorCode !== void 0) {
    return `failed with ${errorCode}`;
  }
  if (signal !== void 0) {
    return `was killed with ${signal} (${signalDescription})`;
  }
  if (exitCode !== void 0) {
    return `failed with exit code ${exitCode}`;
  }
  return "failed";
};
var makeError = ({
  stdout,
  stderr,
  all,
  error,
  signal,
  exitCode,
  command,
  escapedCommand,
  timedOut,
  isCanceled,
  killed,
  parsed: { options: { timeout } }
}) => {
  exitCode = exitCode === null ? void 0 : exitCode;
  signal = signal === null ? void 0 : signal;
  const signalDescription = signal === void 0 ? void 0 : signalsByName[signal].description;
  const errorCode = error && error.code;
  const prefix = getErrorPrefix({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled });
  const execaMessage = `Command ${prefix}: ${command}`;
  const isError = Object.prototype.toString.call(error) === "[object Error]";
  const shortMessage = isError ? `${execaMessage}
${error.message}` : execaMessage;
  const message = [shortMessage, stderr, stdout].filter(Boolean).join("\n");
  if (isError) {
    error.originalMessage = error.message;
    error.message = message;
  } else {
    error = new Error(message);
  }
  error.shortMessage = shortMessage;
  error.command = command;
  error.escapedCommand = escapedCommand;
  error.exitCode = exitCode;
  error.signal = signal;
  error.signalDescription = signalDescription;
  error.stdout = stdout;
  error.stderr = stderr;
  if (all !== void 0) {
    error.all = all;
  }
  if ("bufferedData" in error) {
    delete error.bufferedData;
  }
  error.failed = true;
  error.timedOut = Boolean(timedOut);
  error.isCanceled = isCanceled;
  error.killed = killed && !timedOut;
  return error;
};

// node_modules/.bun/execa@7.0.0/node_modules/execa/lib/stdio.js
var aliases = ["stdin", "stdout", "stderr"];
var hasAlias = (options) => aliases.some((alias) => options[alias] !== void 0);
var normalizeStdio = (options) => {
  if (!options) {
    return;
  }
  const { stdio } = options;
  if (stdio === void 0) {
    return aliases.map((alias) => options[alias]);
  }
  if (hasAlias(options)) {
    throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map((alias) => `\`${alias}\``).join(", ")}`);
  }
  if (typeof stdio === "string") {
    return stdio;
  }
  if (!Array.isArray(stdio)) {
    throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
  }
  const length = Math.max(stdio.length, aliases.length);
  return Array.from({ length }, (value, index) => stdio[index]);
};

// node_modules/.bun/execa@7.0.0/node_modules/execa/lib/kill.js
var import_node_os3 = __toESM(require("node:os"), 1);
var import_signal_exit = __toESM(require_signal_exit(), 1);
var DEFAULT_FORCE_KILL_TIMEOUT = 1e3 * 5;
var spawnedKill = (kill, signal = "SIGTERM", options = {}) => {
  const killResult = kill(signal);
  setKillTimeout(kill, signal, options, killResult);
  return killResult;
};
var setKillTimeout = (kill, signal, options, killResult) => {
  if (!shouldForceKill(signal, options, killResult)) {
    return;
  }
  const timeout = getForceKillAfterTimeout(options);
  const t = setTimeout(() => {
    kill("SIGKILL");
  }, timeout);
  if (t.unref) {
    t.unref();
  }
};
var shouldForceKill = (signal, { forceKillAfterTimeout }, killResult) => isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
var isSigterm = (signal) => signal === import_node_os3.default.constants.signals.SIGTERM || typeof signal === "string" && signal.toUpperCase() === "SIGTERM";
var getForceKillAfterTimeout = ({ forceKillAfterTimeout = true }) => {
  if (forceKillAfterTimeout === true) {
    return DEFAULT_FORCE_KILL_TIMEOUT;
  }
  if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
    throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
  }
  return forceKillAfterTimeout;
};
var spawnedCancel = (spawned, context) => {
  const killResult = spawned.kill();
  if (killResult) {
    context.isCanceled = true;
  }
};
var timeoutKill = (spawned, signal, reject) => {
  spawned.kill(signal);
  reject(Object.assign(new Error("Timed out"), { timedOut: true, signal }));
};
var setupTimeout = (spawned, { timeout, killSignal = "SIGTERM" }, spawnedPromise) => {
  if (timeout === 0 || timeout === void 0) {
    return spawnedPromise;
  }
  let timeoutId;
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      timeoutKill(spawned, killSignal, reject);
    }, timeout);
  });
  const safeSpawnedPromise = spawnedPromise.finally(() => {
    clearTimeout(timeoutId);
  });
  return Promise.race([timeoutPromise, safeSpawnedPromise]);
};
var validateTimeout = ({ timeout }) => {
  if (timeout !== void 0 && (!Number.isFinite(timeout) || timeout < 0)) {
    throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
  }
};
var setExitHandler = async (spawned, { cleanup, detached }, timedPromise) => {
  if (!cleanup || detached) {
    return timedPromise;
  }
  const removeExitHandler = (0, import_signal_exit.default)(() => {
    spawned.kill();
  });
  return timedPromise.finally(() => {
    removeExitHandler();
  });
};

// node_modules/.bun/is-stream@3.0.0/node_modules/is-stream/index.js
function isStream(stream) {
  return stream !== null && typeof stream === "object" && typeof stream.pipe === "function";
}

// node_modules/.bun/execa@7.0.0/node_modules/execa/lib/stream.js
var import_get_stream = __toESM(require_get_stream(), 1);
var import_merge_stream = __toESM(require_merge_stream(), 1);
var handleInput = (spawned, input) => {
  if (input === void 0) {
    return;
  }
  if (isStream(input)) {
    input.pipe(spawned.stdin);
  } else {
    spawned.stdin.end(input);
  }
};
var makeAllStream = (spawned, { all }) => {
  if (!all || !spawned.stdout && !spawned.stderr) {
    return;
  }
  const mixed = (0, import_merge_stream.default)();
  if (spawned.stdout) {
    mixed.add(spawned.stdout);
  }
  if (spawned.stderr) {
    mixed.add(spawned.stderr);
  }
  return mixed;
};
var getBufferedData = async (stream, streamPromise) => {
  if (!stream || streamPromise === void 0) {
    return;
  }
  stream.destroy();
  try {
    return await streamPromise;
  } catch (error) {
    return error.bufferedData;
  }
};
var getStreamPromise = (stream, { encoding, buffer, maxBuffer }) => {
  if (!stream || !buffer) {
    return;
  }
  if (encoding) {
    return (0, import_get_stream.default)(stream, { encoding, maxBuffer });
  }
  return import_get_stream.default.buffer(stream, { maxBuffer });
};
var getSpawnedResult = async ({ stdout, stderr, all }, { encoding, buffer, maxBuffer }, processDone) => {
  const stdoutPromise = getStreamPromise(stdout, { encoding, buffer, maxBuffer });
  const stderrPromise = getStreamPromise(stderr, { encoding, buffer, maxBuffer });
  const allPromise = getStreamPromise(all, { encoding, buffer, maxBuffer: maxBuffer * 2 });
  try {
    return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
  } catch (error) {
    return Promise.all([
      { error, signal: error.signal, timedOut: error.timedOut },
      getBufferedData(stdout, stdoutPromise),
      getBufferedData(stderr, stderrPromise),
      getBufferedData(all, allPromise)
    ]);
  }
};

// node_modules/.bun/execa@7.0.0/node_modules/execa/lib/promise.js
var nativePromisePrototype = (async () => {
})().constructor.prototype;
var descriptors = ["then", "catch", "finally"].map((property) => [
  property,
  Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
]);
var mergePromise = (spawned, promise) => {
  for (const [property, descriptor] of descriptors) {
    const value = typeof promise === "function" ? (...args) => Reflect.apply(descriptor.value, promise(), args) : descriptor.value.bind(promise);
    Reflect.defineProperty(spawned, property, { ...descriptor, value });
  }
  return spawned;
};
var getSpawnedPromise = (spawned) => new Promise((resolve, reject) => {
  spawned.on("exit", (exitCode, signal) => {
    resolve({ exitCode, signal });
  });
  spawned.on("error", (error) => {
    reject(error);
  });
  if (spawned.stdin) {
    spawned.stdin.on("error", (error) => {
      reject(error);
    });
  }
});

// node_modules/.bun/execa@7.0.0/node_modules/execa/lib/command.js
var normalizeArgs = (file, args = []) => {
  if (!Array.isArray(args)) {
    return [file];
  }
  return [file, ...args];
};
var NO_ESCAPE_REGEXP = /^[\w.-]+$/;
var DOUBLE_QUOTES_REGEXP = /"/g;
var escapeArg = (arg) => {
  if (typeof arg !== "string" || NO_ESCAPE_REGEXP.test(arg)) {
    return arg;
  }
  return `"${arg.replace(DOUBLE_QUOTES_REGEXP, '\\"')}"`;
};
var joinCommand = (file, args) => normalizeArgs(file, args).join(" ");
var getEscapedCommand = (file, args) => normalizeArgs(file, args).map((arg) => escapeArg(arg)).join(" ");

// node_modules/.bun/execa@7.0.0/node_modules/execa/index.js
var DEFAULT_MAX_BUFFER = 1e3 * 1e3 * 100;
var getEnv = ({ env: envOption, extendEnv, preferLocal, localDir, execPath }) => {
  const env = extendEnv ? { ...import_node_process2.default.env, ...envOption } : envOption;
  if (preferLocal) {
    return npmRunPathEnv({ env, cwd: localDir, execPath });
  }
  return env;
};
var handleArguments = (file, args, options = {}) => {
  const parsed = import_cross_spawn.default._parse(file, args, options);
  file = parsed.command;
  args = parsed.args;
  options = parsed.options;
  options = {
    maxBuffer: DEFAULT_MAX_BUFFER,
    buffer: true,
    stripFinalNewline: true,
    extendEnv: true,
    preferLocal: false,
    localDir: options.cwd || import_node_process2.default.cwd(),
    execPath: import_node_process2.default.execPath,
    encoding: "utf8",
    reject: true,
    cleanup: true,
    all: false,
    windowsHide: true,
    ...options
  };
  options.env = getEnv(options);
  options.stdio = normalizeStdio(options);
  if (import_node_process2.default.platform === "win32" && import_node_path2.default.basename(file, ".exe") === "cmd") {
    args.unshift("/q");
  }
  return { file, args, options, parsed };
};
var handleOutput = (options, value, error) => {
  if (typeof value !== "string" && !import_node_buffer.Buffer.isBuffer(value)) {
    return error === void 0 ? void 0 : "";
  }
  if (options.stripFinalNewline) {
    return stripFinalNewline(value);
  }
  return value;
};
function execa(file, args, options) {
  const parsed = handleArguments(file, args, options);
  const command = joinCommand(file, args);
  const escapedCommand = getEscapedCommand(file, args);
  validateTimeout(parsed.options);
  let spawned;
  try {
    spawned = import_node_child_process.default.spawn(parsed.file, parsed.args, parsed.options);
  } catch (error) {
    const dummySpawned = new import_node_child_process.default.ChildProcess();
    const errorPromise = Promise.reject(makeError({
      error,
      stdout: "",
      stderr: "",
      all: "",
      command,
      escapedCommand,
      parsed,
      timedOut: false,
      isCanceled: false,
      killed: false
    }));
    return mergePromise(dummySpawned, errorPromise);
  }
  const spawnedPromise = getSpawnedPromise(spawned);
  const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
  const processDone = setExitHandler(spawned, parsed.options, timedPromise);
  const context = { isCanceled: false };
  spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
  spawned.cancel = spawnedCancel.bind(null, spawned, context);
  const handlePromise = async () => {
    const [{ error, exitCode, signal, timedOut }, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
    const stdout = handleOutput(parsed.options, stdoutResult);
    const stderr = handleOutput(parsed.options, stderrResult);
    const all = handleOutput(parsed.options, allResult);
    if (error || exitCode !== 0 || signal !== null) {
      const returnedError = makeError({
        error,
        exitCode,
        signal,
        stdout,
        stderr,
        all,
        command,
        escapedCommand,
        parsed,
        timedOut,
        isCanceled: context.isCanceled || (parsed.options.signal ? parsed.options.signal.aborted : false),
        killed: spawned.killed
      });
      if (!parsed.options.reject) {
        return returnedError;
      }
      throw returnedError;
    }
    return {
      command,
      escapedCommand,
      exitCode: 0,
      stdout,
      stderr,
      all,
      failed: false,
      timedOut: false,
      isCanceled: false,
      killed: false
    };
  };
  const handlePromiseOnce = onetime_default(handlePromise);
  handleInput(spawned, parsed.options.input);
  spawned.all = makeAllStream(spawned, parsed.options);
  return mergePromise(spawned, handlePromiseOnce);
}

// src/api/bitwarden.ts
var import_fs5 = require("fs");

// src/utils/passwords.ts
var import_api3 = require("@raycast/api");
var import_crypto = require("crypto");

// src/constants/passwords.ts
var REPROMPT_HASH_SALT = "foobarbazzybaz";

// src/utils/passwords.ts
function getPasswordGeneratingArgs(options) {
  return Object.entries(options).flatMap(
    ([arg, value]) => {
      switch (typeof value) {
        case "boolean":
          if (value) return [`--${arg}`];
          return [];
        case "string":
          return [`--${arg}`, value];
        default:
          return [];
      }
    }
  );
}
function hashMasterPasswordForReprompting(password) {
  return new Promise((resolve, reject) => {
    (0, import_crypto.pbkdf2)(password, REPROMPT_HASH_SALT, 1e5, 64, "sha512", (error, hashed) => {
      if (error != null) {
        reject(error);
        return;
      }
      resolve(hashed.toString("hex"));
    });
  });
}

// src/utils/preferences.ts
var import_api4 = require("@raycast/api");

// src/constants/preferences.ts
var VAULT_TIMEOUT_OPTIONS = {
  IMMEDIATELY: "0",
  ONE_MINUTE: "60000",
  FIVE_MINUTES: "300000",
  FIFTEEN_MINUTES: "900000",
  THIRTY_MINUTES: "1800000",
  ONE_HOUR: "3600000",
  FOUR_HOURS: "14400000",
  EIGHT_HOURS: "28800000",
  ONE_DAY: "86400000",
  NEVER: "-1",
  SYSTEM_LOCK: "-2",
  SYSTEM_SLEEP: "-3"
};
var VAULT_TIMEOUT = Object.entries(VAULT_TIMEOUT_OPTIONS).reduce((acc, [key, value]) => {
  acc[key] = parseInt(value);
  return acc;
}, {});

// src/constants/labels.ts
var VAULT_TIMEOUT_MS_TO_LABEL = {
  [VAULT_TIMEOUT.IMMEDIATELY]: "Immediately",
  [VAULT_TIMEOUT.ONE_MINUTE]: "1 Minute",
  [VAULT_TIMEOUT.FIVE_MINUTES]: "5 Minutes",
  [VAULT_TIMEOUT.FIFTEEN_MINUTES]: "15 Minutes",
  [VAULT_TIMEOUT.THIRTY_MINUTES]: "30 Minutes",
  [VAULT_TIMEOUT.ONE_HOUR]: "1 Hour",
  [VAULT_TIMEOUT.FOUR_HOURS]: "4 Hours",
  [VAULT_TIMEOUT.EIGHT_HOURS]: "8 Hours",
  [VAULT_TIMEOUT.ONE_DAY]: "1 Day"
};
var CARD_KEY_LABEL = {
  cardholderName: "Cardholder name",
  brand: "Brand",
  number: "Number",
  expMonth: "Expiration month",
  expYear: "Expiration year",
  code: "Security code (CVV)"
};
var IDENTITY_KEY_LABEL = {
  title: "Title",
  firstName: "First name",
  middleName: "Middle name",
  lastName: "Last name",
  username: "Username",
  company: "Company",
  ssn: "Social Security number",
  passportNumber: "Passport number",
  licenseNumber: "License number",
  email: "Email",
  phone: "Phone",
  address1: "Address 1",
  address2: "Address 2",
  address3: "Address 3",
  city: "City / Town",
  state: "State / Province",
  postalCode: "Zip / Postal code",
  country: "Country"
};
var ITEM_TYPE_TO_LABEL = {
  [1 /* LOGIN */]: "Login",
  [3 /* CARD */]: "Card",
  [4 /* IDENTITY */]: "Identity",
  [2 /* NOTE */]: "Secure Note",
  [5 /* SSH_KEY */]: "SSH Key"
};

// src/utils/preferences.ts
function getServerUrlPreference() {
  const { serverUrl } = (0, import_api4.getPreferenceValues)();
  return !serverUrl || serverUrl === "bitwarden.com" || serverUrl === "https://bitwarden.com" ? void 0 : serverUrl;
}
var COMMAND_NAME_TO_PREFERENCE_KEY_MAP = {
  search: "transientCopySearch",
  "generate-password": "transientCopyGeneratePassword",
  "generate-password-quick": "transientCopyGeneratePasswordQuick"
};
function getTransientCopyPreference(type) {
  const preferenceKey = COMMAND_NAME_TO_PREFERENCE_KEY_MAP[import_api4.environment.commandName];
  const transientPreference = (0, import_api4.getPreferenceValues)()[preferenceKey];
  if (transientPreference === "never") return false;
  if (transientPreference === "always") return true;
  if (transientPreference === "passwords") return type === "password";
  return true;
}
function getLabelForTimeoutPreference(timeout) {
  return VAULT_TIMEOUT_MS_TO_LABEL[timeout];
}

// src/utils/errors.ts
var ManuallyThrownError = class extends Error {
  constructor(message, stack) {
    super(message);
    this.stack = stack;
  }
};
var DisplayableError = class extends ManuallyThrownError {
  constructor(message, stack) {
    super(message, stack);
  }
};
var InstalledCLINotFoundError = class extends DisplayableError {
  constructor(message, stack) {
    super(message ?? "Bitwarden CLI not found", stack);
    this.name = "InstalledCLINotFoundError";
    this.stack = stack;
  }
};
var FailedToLoadVaultItemsError = class extends ManuallyThrownError {
  constructor(message, stack) {
    super(message ?? "Failed to load vault items", stack);
    this.name = "FailedToLoadVaultItemsError";
  }
};
var VaultIsLockedError = class extends DisplayableError {
  constructor(message, stack) {
    super(message ?? "Vault is locked", stack);
    this.name = "VaultIsLockedError";
  }
};
var NotLoggedInError = class extends ManuallyThrownError {
  constructor(message, stack) {
    super(message ?? "Not logged in", stack);
    this.name = "NotLoggedInError";
  }
};
var EnsureCliBinError = class extends DisplayableError {
  constructor(message, stack) {
    super(message ?? "Failed do download Bitwarden CLI", stack);
    this.name = "EnsureCliBinError";
  }
};
var PremiumFeatureError = class extends ManuallyThrownError {
  constructor(message, stack) {
    super(message ?? "Premium status is required to use this feature", stack);
    this.name = "PremiumFeatureError";
  }
};
var SendNeedsPasswordError = class extends ManuallyThrownError {
  constructor(message, stack) {
    super(message ?? "This Send has a is protected by a password", stack);
    this.name = "SendNeedsPasswordError";
  }
};
var SendInvalidPasswordError = class extends ManuallyThrownError {
  constructor(message, stack) {
    super(message ?? "The password you entered is invalid", stack);
    this.name = "SendInvalidPasswordError";
  }
};
function tryExec(fn, fallbackValue) {
  try {
    return fn();
  } catch {
    return fallbackValue;
  }
}
function getDisplayableErrorMessage(error) {
  if (error instanceof DisplayableError) return error.message;
  return void 0;
}
var getErrorString = (error) => {
  if (!error) return void 0;
  if (typeof error === "string") return error;
  if (error instanceof Error) {
    const { message, name } = error;
    if (error.stack) return error.stack;
    return `${name}: ${message}`;
  }
  return String(error);
};

// src/api/bitwarden.ts
var import_path2 = require("path");
var import_promises2 = require("fs/promises");

// src/utils/fs.ts
var import_fs = require("fs");
var import_promises = require("fs/promises");
var import_path = require("path");
var import_node_stream_zip = __toESM(require_node_stream_zip());
function waitForFileAvailable(path3) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (!(0, import_fs.existsSync)(path3)) return;
      const stats = (0, import_fs.statSync)(path3);
      if (stats.isFile()) {
        clearInterval(interval);
        resolve();
      }
    }, 300);
    setTimeout(() => {
      clearInterval(interval);
      reject(new Error(`File ${path3} not found.`));
    }, 5e3);
  });
}
async function decompressFile(filePath, targetPath) {
  const zip = new import_node_stream_zip.default.async({ file: filePath });
  if (!(0, import_fs.existsSync)(targetPath)) (0, import_fs.mkdirSync)(targetPath, { recursive: true });
  await zip.extract(null, targetPath);
  await zip.close();
}
async function removeFilesThatStartWith(startingWith, path3) {
  let removedAtLeastOne = false;
  try {
    const files = await (0, import_promises.readdir)(path3);
    for await (const file of files) {
      if (!file.startsWith(startingWith)) continue;
      await tryExec(async () => {
        await (0, import_promises.unlink)((0, import_path.join)(path3, file));
        removedAtLeastOne = true;
      });
    }
  } catch {
    return false;
  }
  return removedAtLeastOne;
}
function unlinkAllSync(...paths) {
  for (const path3 of paths) {
    tryExec(() => (0, import_fs.unlinkSync)(path3));
  }
}

// src/utils/network.ts
var import_fs3 = require("fs");
var import_http = __toESM(require("http"));
var import_https = __toESM(require("https"));

// src/utils/development.ts
var import_api5 = require("@raycast/api");
var import_api6 = require("@raycast/api");
var _exceptions = {
  logs: /* @__PURE__ */ new Map(),
  set: (message, error) => {
    capturedExceptions.logs.set(/* @__PURE__ */ new Date(), { message, error });
  },
  clear: () => capturedExceptions.logs.clear(),
  toString: () => {
    let str = "";
    capturedExceptions.logs.forEach((log, date) => {
      if (str.length > 0) str += "\n\n";
      str += `[${date.toISOString()}] ${log.message}`;
      if (log.error) str += `: ${getErrorString(log.error)}`;
    });
    return str;
  }
};
var capturedExceptions = Object.freeze(_exceptions);
var captureException = (description, error, options) => {
  const { captureToRaycast = false } = options ?? {};
  const desc = Array.isArray(description) ? description.filter(Boolean).join(" ") : description || "Captured exception";
  capturedExceptions.set(desc, error);
  if (import_api5.environment.isDevelopment) {
    console.error(desc, error);
  } else if (captureToRaycast) {
    (0, import_api6.captureException)(error);
  }
};
var debugLog = (...args) => {
  if (!import_api5.environment.isDevelopment) return;
  console.debug(...args);
};

// src/utils/crypto.ts
var import_fs2 = require("fs");
var import_crypto2 = require("crypto");
function getFileSha256(filePath) {
  try {
    return (0, import_crypto2.createHash)("sha256").update((0, import_fs2.readFileSync)(filePath)).digest("hex");
  } catch (error) {
    return null;
  }
}

// src/utils/network.ts
function download(url2, path3, options) {
  const { onProgress, sha256 } = options ?? {};
  return new Promise((resolve, reject) => {
    const uri = new URL(url2);
    const protocol = uri.protocol === "https:" ? import_https.default : import_http.default;
    const agent = new (protocol === import_https.default ? import_https.default : import_http.default).Agent({ keepAlive: false });
    let redirectCount = 0;
    const request = protocol.get(uri.href, { agent }, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400) {
        request.destroy();
        response.destroy();
        const redirectUrl = response.headers.location;
        if (!redirectUrl) {
          reject(new Error(`Redirect response without location header`));
          return;
        }
        if (++redirectCount >= 10) {
          reject(new Error("Too many redirects"));
          return;
        }
        download(redirectUrl, path3, options).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Response status ${response.statusCode}: ${response.statusMessage}`));
        return;
      }
      const fileSize = parseInt(response.headers["content-length"] || "0", 10);
      if (fileSize === 0) {
        reject(new Error("Invalid file size"));
        return;
      }
      const fileStream = (0, import_fs3.createWriteStream)(path3, { autoClose: true });
      let downloadedBytes = 0;
      const cleanup = () => {
        request.destroy();
        response.destroy();
        fileStream.close();
      };
      const cleanupAndReject = (error) => {
        cleanup();
        reject(error);
      };
      response.on("data", (chunk) => {
        downloadedBytes += chunk.length;
        const percent = Math.floor(downloadedBytes / fileSize * 100);
        onProgress?.(percent);
      });
      fileStream.on("finish", async () => {
        try {
          await waitForFileAvailable(path3);
          if (sha256) await waitForHashToMatch(path3, sha256);
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          cleanup();
        }
      });
      fileStream.on("error", (error) => {
        captureException(`File stream error while downloading ${url2}`, error);
        (0, import_fs3.unlink)(path3, () => cleanupAndReject(error));
      });
      response.on("error", (error) => {
        captureException(`Response error while downloading ${url2}`, error);
        (0, import_fs3.unlink)(path3, () => cleanupAndReject(error));
      });
      request.on("error", (error) => {
        captureException(`Request error while downloading ${url2}`, error);
        (0, import_fs3.unlink)(path3, () => cleanupAndReject(error));
      });
      response.pipe(fileStream);
    });
  });
}
function waitForHashToMatch(path3, sha256) {
  return new Promise((resolve, reject) => {
    const fileSha = getFileSha256(path3);
    if (!fileSha) return reject(new Error(`Could not generate hash for file ${path3}.`));
    if (fileSha === sha256) return resolve();
    const interval = setInterval(() => {
      if (getFileSha256(path3) === sha256) {
        clearInterval(interval);
        clearTimeout(timeoutId);
        resolve();
      }
    }, 1e3);
    const timeoutId = setTimeout(() => {
      clearInterval(interval);
      reject(new Error(`Hash did not match, expected ${sha256.substring(0, 7)}, got ${fileSha.substring(0, 7)}.`));
    }, 5e3);
  });
}

// src/api/bitwarden.helpers.ts
function prepareSendPayload(template, values) {
  return {
    ...template,
    ...values,
    file: values.file ? { ...template.file, ...values.file } : template.file,
    text: values.text ? { ...template.text, ...values.text } : template.text
  };
}

// src/utils/cache.ts
var import_api7 = require("@raycast/api");
var Cache = new import_api7.Cache({ namespace: "bw-cache" });

// src/utils/platform.ts
var platform = process.platform === "darwin" ? "macos" : process.platform === "win32" ? "windows" : "linux";

// src/api/bitwarden.ts
var { supportPath } = import_api8.environment;
var \u0394 = "5";
var BinDownloadLogger = (() => {
  const filePath = (0, import_path2.join)(supportPath, `bw-bin-download-error-${\u0394}.log`);
  return {
    logError: (error) => tryExec(() => (0, import_fs5.writeFileSync)(filePath, error?.message ?? "Unexpected error")),
    clearError: () => tryExec(() => (0, import_fs5.unlinkSync)(filePath)),
    hasError: () => tryExec(() => (0, import_fs5.existsSync)(filePath), false)
  };
})();
var cliInfo = {
  version: "2025.11.0",
  get sha256() {
    if (platform === "windows") return "0484bae6306762881678097406d6bf00a58e291720dbc7d62f044e5f4d8286ed";
    if (process.arch === "arm64") return "59eac955be7b15bfc21c81101a194a9fbba32f48a61154b4f4b6e007efab6fd6";
    return "213108a65eeb7294ffcd7303f8fe5308dc2af970735aefeb4d23fc9753a2ac01";
  },
  downloadPage: "https://github.com/bitwarden/clients/releases",
  path: {
    get downloadedBin() {
      return (0, import_path2.join)(supportPath, cliInfo.binFilenameVersioned);
    },
    get installedBin() {
      if (platform === "linux") return "/usr/bin/bw";
      if (platform === "windows") return "C:\\ProgramData\\chocolatey\\bin\\bw.exe";
      return process.arch === "arm64" ? "/opt/homebrew/bin/bw" : "/usr/local/bin/bw";
    },
    get bin() {
      return !BinDownloadLogger.hasError() ? this.downloadedBin : this.installedBin;
    }
  },
  get binFilename() {
    return platform === "windows" ? "bw.exe" : "bw";
  },
  get binFilenameVersioned() {
    const name = `bw-${this.version}`;
    return platform === "windows" ? `${name}.exe` : `${name}`;
  },
  get downloadUrl() {
    let archSuffix = "";
    if (platform === "macos") {
      archSuffix = process.arch === "arm64" ? "-arm64" : "";
    }
    return `${this.downloadPage}/download/cli-v${this.version}/bw-${platform}${archSuffix}-${this.version}.zip`;
  }
};
var Bitwarden = class {
  constructor(toastInstance) {
    this.actionListeners = /* @__PURE__ */ new Map();
    this.preferences = (0, import_api8.getPreferenceValues)();
    this.wasCliUpdated = false;
    this.showToast = async (toastOpts) => {
      if (this.toastInstance) {
        const previousStateToastOpts = {
          message: this.toastInstance.message,
          title: this.toastInstance.title,
          primaryAction: this.toastInstance.primaryAction,
          secondaryAction: this.toastInstance.secondaryAction
        };
        if (toastOpts.style) this.toastInstance.style = toastOpts.style;
        this.toastInstance.message = toastOpts.message;
        this.toastInstance.title = toastOpts.title;
        this.toastInstance.primaryAction = toastOpts.primaryAction;
        this.toastInstance.secondaryAction = toastOpts.secondaryAction;
        await this.toastInstance.show();
        return Object.assign(this.toastInstance, {
          restore: async () => {
            await this.showToast(previousStateToastOpts);
          }
        });
      } else {
        const toast = await (0, import_api8.showToast)(toastOpts);
        return Object.assign(toast, { restore: () => toast.hide() });
      }
    };
    const { cliPath: cliPathPreference, clientId, clientSecret, serverCertsPath } = this.preferences;
    const serverUrl = getServerUrlPreference();
    this.toastInstance = toastInstance;
    this.cliPath = cliPathPreference || cliInfo.path.bin;
    this.env = {
      BITWARDENCLI_APPDATA_DIR: supportPath,
      BW_CLIENTSECRET: clientSecret.trim(),
      BW_CLIENTID: clientId.trim(),
      PATH: (0, import_path2.dirname)(process.execPath),
      ...serverUrl && serverCertsPath ? { NODE_EXTRA_CA_CERTS: serverCertsPath } : {}
    };
    this.initPromise = (async () => {
      await this.ensureCliBinary();
      void this.retrieveAndCacheCliVersion();
      await this.checkServerUrl(serverUrl);
    })();
  }
  async ensureCliBinary() {
    if (this.checkCliBinIsReady(this.cliPath)) return;
    if (this.cliPath === this.preferences.cliPath || this.cliPath === cliInfo.path.installedBin) {
      throw new InstalledCLINotFoundError(`Bitwarden CLI not found at ${this.cliPath}`);
    }
    if (platform === "linux") {
      this.cliPath = cliInfo.path.installedBin;
      if (this.checkCliBinIsReady(this.cliPath)) return;
      throw new InstalledCLINotFoundError(`Bitwarden CLI not found at ${this.cliPath}. Install it with your package manager.`);
    }
    if (BinDownloadLogger.hasError()) BinDownloadLogger.clearError();
    const hadOldBinaries = await removeFilesThatStartWith("bw-", supportPath);
    const toast = await this.showToast({
      title: `${hadOldBinaries ? "Updating" : "Initializing"} Bitwarden CLI`,
      style: import_api8.Toast.Style.Animated,
      primaryAction: { title: "Open Download Page", onAction: () => (0, import_api8.open)(cliInfo.downloadPage) }
    });
    const tmpFileName = "bw.zip";
    const zipPath = (0, import_path2.join)(supportPath, tmpFileName);
    try {
      try {
        toast.message = "Downloading...";
        await download(cliInfo.downloadUrl, zipPath, {
          onProgress: (percent) => toast.message = `Downloading ${percent}%`,
          sha256: cliInfo.sha256
        });
      } catch (downloadError) {
        toast.title = "Failed to download Bitwarden CLI";
        throw downloadError;
      }
      try {
        toast.message = "Extracting...";
        await decompressFile(zipPath, supportPath);
        const decompressedBinPath = (0, import_path2.join)(supportPath, cliInfo.binFilename);
        await (0, import_promises2.rename)(decompressedBinPath, this.cliPath).catch(() => null);
        await waitForFileAvailable(this.cliPath);
        await (0, import_promises2.chmod)(this.cliPath, "755");
        await (0, import_promises2.rm)(zipPath, { force: true });
        Cache.set(CACHE_KEYS.CLI_VERSION, cliInfo.version);
        this.wasCliUpdated = true;
        const dataJsonPath = (0, import_path2.join)(supportPath, "data.json");
        await tryExec(() => (0, import_promises2.unlink)(dataJsonPath));
      } catch (extractError) {
        toast.title = "Failed to extract Bitwarden CLI";
        throw extractError;
      }
      await toast.hide();
    } catch (error) {
      toast.message = error instanceof EnsureCliBinError ? error.message : "Please try again";
      toast.style = import_api8.Toast.Style.Failure;
      unlinkAllSync(zipPath, this.cliPath);
      if (!import_api8.environment.isDevelopment) BinDownloadLogger.logError(error);
      if (error instanceof Error) throw new EnsureCliBinError(error.message, error.stack);
      throw error;
    } finally {
      await toast.restore();
    }
  }
  async retrieveAndCacheCliVersion() {
    try {
      const { error, result } = await this.getVersion();
      if (!error) Cache.set(CACHE_KEYS.CLI_VERSION, result);
    } catch (error) {
      captureException("Failed to retrieve and cache cli version", error, { captureToRaycast: true });
    }
  }
  checkCliBinIsReady(filePath) {
    try {
      if (!(0, import_fs5.existsSync)(this.cliPath)) return false;
      (0, import_fs5.accessSync)(filePath, import_fs5.constants.X_OK);
      return true;
    } catch {
      (0, import_fs5.chmodSync)(filePath, "755");
      return true;
    }
  }
  setSessionToken(token) {
    this.env = {
      ...this.env,
      BW_SESSION: token
    };
  }
  clearSessionToken() {
    delete this.env.BW_SESSION;
  }
  withSession(token) {
    this.tempSessionToken = token;
    return this;
  }
  async initialize() {
    await this.initPromise;
    return this;
  }
  async checkServerUrl(serverUrl) {
    const storedServer = await import_api8.LocalStorage.getItem(LOCAL_STORAGE_KEY.SERVER_URL);
    if (!serverUrl || storedServer === serverUrl) return;
    const toast = await this.showToast({
      style: import_api8.Toast.Style.Animated,
      title: "Switching server...",
      message: "Bitwarden server preference changed"
    });
    try {
      try {
        await this.logout();
      } catch {
      }
      await this.exec(["config", "server", serverUrl || DEFAULT_SERVER_URL], { resetVaultTimeout: false });
      await import_api8.LocalStorage.setItem(LOCAL_STORAGE_KEY.SERVER_URL, serverUrl);
      toast.style = import_api8.Toast.Style.Success;
      toast.title = "Success";
      toast.message = "Bitwarden server changed";
    } catch (error) {
      toast.style = import_api8.Toast.Style.Failure;
      toast.title = "Failed to switch server";
      if (error instanceof Error) {
        toast.message = error.message;
      } else {
        toast.message = "Unknown error occurred";
      }
    } finally {
      await toast.restore();
    }
  }
  async exec(args, options) {
    const { abortController, input = "", resetVaultTimeout, env: envOverrides } = options ?? {};
    let env = this.env;
    if (this.tempSessionToken) {
      env = { ...env, BW_SESSION: this.tempSessionToken };
      this.tempSessionToken = void 0;
    }
    if (envOverrides) env = { ...env, ...envOverrides };
    const result = await execa(this.cliPath, args, { input, env, signal: abortController?.signal });
    if (this.isPromptWaitingForMasterPassword(result)) {
      await this.lock();
      throw new VaultIsLockedError();
    }
    if (resetVaultTimeout) {
      await import_api8.LocalStorage.setItem(LOCAL_STORAGE_KEY.LAST_ACTIVITY_TIME, (/* @__PURE__ */ new Date()).toISOString());
    }
    return result;
  }
  async getVersion() {
    try {
      const { stdout: result } = await this.exec(["--version"], { resetVaultTimeout: false });
      return { result };
    } catch (execError) {
      captureException("Failed to get cli version", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async login() {
    try {
      await this.exec(["login", "--apikey"], { resetVaultTimeout: true });
      await this.saveLastVaultStatus("login", "unlocked");
      await this.callActionListeners("login");
      return { result: void 0 };
    } catch (execError) {
      captureException("Failed to login", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async logout(options) {
    const { reason, immediate = false } = options ?? {};
    try {
      if (immediate) await this.handlePostLogout(reason);
      await this.exec(["logout"], { resetVaultTimeout: false });
      await this.saveLastVaultStatus("logout", "unauthenticated");
      if (!immediate) await this.handlePostLogout(reason);
      return { result: void 0 };
    } catch (execError) {
      captureException("Failed to logout", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async lock(options) {
    const { reason, checkVaultStatus = false, immediate = false } = options ?? {};
    try {
      if (immediate) await this.callActionListeners("lock", reason);
      if (checkVaultStatus) {
        const { error, result } = await this.status();
        if (error) throw error;
        if (result.status === "unauthenticated") return { error: new NotLoggedInError("Not logged in") };
      }
      await this.exec(["lock"], { resetVaultTimeout: false });
      this.clearSessionToken();
      await this.saveLastVaultStatus("lock", "locked");
      if (!immediate) await this.callActionListeners("lock", reason);
      return { result: void 0 };
    } catch (execError) {
      captureException("Failed to lock vault", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async unlock(password) {
    try {
      this.clearSessionToken();
      const result = await this.exec(["unlock", "--passwordenv", "BW_PASSWORD", "--raw"], {
        resetVaultTimeout: true,
        env: { BW_PASSWORD: password }
      });
      const sessionToken = result.stdout;
      if (!sessionToken.trim()) throw new Error("Invalid session token");
      this.setSessionToken(sessionToken);
      await this.saveLastVaultStatus("unlock", "unlocked");
      await this.callActionListeners("unlock", password, sessionToken);
      return { result: sessionToken };
    } catch (execError) {
      captureException("Failed to unlock vault", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async sync() {
    try {
      await this.exec(["sync"], { resetVaultTimeout: true });
      return { result: void 0 };
    } catch (execError) {
      captureException("Failed to sync vault", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async getItem(id) {
    try {
      const { stdout } = await this.exec(["get", "item", id], { resetVaultTimeout: true });
      return { result: JSON.parse(stdout) };
    } catch (execError) {
      captureException("Failed to get item", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async listItems() {
    try {
      const { stdout } = await this.exec(["list", "items"], { resetVaultTimeout: true });
      const items = JSON.parse(stdout);
      return { result: items.filter((item) => !!item.name) };
    } catch (execError) {
      captureException("Failed to list items", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async createLoginItem(options) {
    try {
      const { error: itemTemplateError, result: itemTemplate } = await this.getTemplate("item");
      if (itemTemplateError) throw itemTemplateError;
      const { error: loginTemplateError, result: loginTemplate } = await this.getTemplate("item.login");
      if (loginTemplateError) throw loginTemplateError;
      itemTemplate.name = options.name;
      itemTemplate.type = 1 /* LOGIN */;
      itemTemplate.folderId = options.folderId || null;
      itemTemplate.login = loginTemplate;
      itemTemplate.notes = null;
      loginTemplate.username = options.username || null;
      loginTemplate.password = options.password;
      loginTemplate.totp = null;
      loginTemplate.fido2Credentials = void 0;
      if (options.uri) {
        loginTemplate.uris = [{ match: null, uri: options.uri }];
      }
      const { result: encodedItem, error: encodeError } = await this.encode(JSON.stringify(itemTemplate));
      if (encodeError) throw encodeError;
      const { stdout } = await this.exec(["create", "item", encodedItem], { resetVaultTimeout: true });
      return { result: JSON.parse(stdout) };
    } catch (execError) {
      captureException("Failed to create login item", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async listFolders() {
    try {
      const { stdout } = await this.exec(["list", "folders"], { resetVaultTimeout: true });
      return { result: JSON.parse(stdout) };
    } catch (execError) {
      captureException("Failed to list folder", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async createFolder(name) {
    try {
      const { error, result: folder } = await this.getTemplate("folder");
      if (error) throw error;
      folder.name = name;
      const { result: encodedFolder, error: encodeError } = await this.encode(JSON.stringify(folder));
      if (encodeError) throw encodeError;
      await this.exec(["create", "folder", encodedFolder], { resetVaultTimeout: true });
      return { result: void 0 };
    } catch (execError) {
      captureException("Failed to create folder", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async getTotp(id) {
    try {
      const { stdout } = await this.exec(["get", "totp", id], { resetVaultTimeout: true });
      return { result: stdout };
    } catch (execError) {
      captureException("Failed to get TOTP", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async status() {
    try {
      const { stdout } = await this.exec(["status"], { resetVaultTimeout: false });
      return { result: JSON.parse(stdout) };
    } catch (execError) {
      captureException("Failed to get status", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async checkLockStatus() {
    try {
      await this.exec(["unlock", "--check"], { resetVaultTimeout: false });
      await this.saveLastVaultStatus("checkLockStatus", "unlocked");
      return "unlocked";
    } catch (error) {
      captureException("Failed to check lock status", error);
      const errorMessage = error.stderr;
      if (errorMessage === "Vault is locked.") {
        await this.saveLastVaultStatus("checkLockStatus", "locked");
        return "locked";
      }
      await this.saveLastVaultStatus("checkLockStatus", "unauthenticated");
      return "unauthenticated";
    }
  }
  async getTemplate(type) {
    try {
      const { stdout } = await this.exec(["get", "template", type], { resetVaultTimeout: true });
      return { result: JSON.parse(stdout) };
    } catch (execError) {
      captureException("Failed to get template", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async encode(input) {
    try {
      const { stdout } = await this.exec(["encode"], { input, resetVaultTimeout: false });
      return { result: stdout };
    } catch (execError) {
      captureException("Failed to encode", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async generatePassword(options, abortController) {
    const args = options ? getPasswordGeneratingArgs(options) : [];
    const { stdout } = await this.exec(["generate", ...args], { abortController, resetVaultTimeout: false });
    return stdout;
  }
  async listSends() {
    try {
      const { stdout } = await this.exec(["send", "list"], { resetVaultTimeout: true });
      return { result: JSON.parse(stdout) };
    } catch (execError) {
      captureException("Failed to list sends", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async createSend(values) {
    try {
      const { error: templateError, result: template } = await this.getTemplate(
        values.type === 0 /* Text */ ? "send.text" : "send.file"
      );
      if (templateError) throw templateError;
      const payload = prepareSendPayload(template, values);
      const { result: encodedPayload, error: encodeError } = await this.encode(JSON.stringify(payload));
      if (encodeError) throw encodeError;
      const { stdout } = await this.exec(["send", "create", encodedPayload], { resetVaultTimeout: true });
      return { result: JSON.parse(stdout) };
    } catch (execError) {
      captureException("Failed to create send", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async editSend(values) {
    try {
      const { result: encodedPayload, error: encodeError } = await this.encode(JSON.stringify(values));
      if (encodeError) throw encodeError;
      const { stdout } = await this.exec(["send", "edit", encodedPayload], { resetVaultTimeout: true });
      return { result: JSON.parse(stdout) };
    } catch (execError) {
      captureException("Failed to delete send", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async deleteSend(id) {
    try {
      await this.exec(["send", "delete", id], { resetVaultTimeout: true });
      return { result: void 0 };
    } catch (execError) {
      captureException("Failed to delete send", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async removeSendPassword(id) {
    try {
      await this.exec(["send", "remove-password", id], { resetVaultTimeout: true });
      return { result: void 0 };
    } catch (execError) {
      captureException("Failed to remove send password", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async receiveSendInfo(url2, options) {
    try {
      const { stdout, stderr } = await this.exec(["send", "receive", url2, "--obj"], {
        resetVaultTimeout: true,
        input: options?.password
      });
      if (!stdout && /Invalid password/i.test(stderr)) return { error: new SendInvalidPasswordError() };
      if (!stdout && /Send password/i.test(stderr)) return { error: new SendNeedsPasswordError() };
      return { result: JSON.parse(stdout) };
    } catch (execError) {
      const errorMessage = execError.stderr;
      if (/Invalid password/gi.test(errorMessage)) return { error: new SendInvalidPasswordError() };
      if (/Send password/gi.test(errorMessage)) return { error: new SendNeedsPasswordError() };
      captureException("Failed to receive send obj", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  async receiveSend(url2, options) {
    try {
      const { savePath, password } = options ?? {};
      const args = ["send", "receive", url2];
      if (savePath) args.push("--output", savePath);
      const { stdout } = await this.exec(args, { resetVaultTimeout: true, input: password });
      return { result: stdout };
    } catch (execError) {
      captureException("Failed to receive send", execError);
      const { error } = await this.handleCommonErrors(execError);
      if (!error) throw execError;
      return { error };
    }
  }
  // utils below
  async saveLastVaultStatus(callName, status) {
    await import_api8.LocalStorage.setItem(LOCAL_STORAGE_KEY.VAULT_LAST_STATUS, status);
  }
  async getLastSavedVaultStatus() {
    const lastSavedStatus = await import_api8.LocalStorage.getItem(LOCAL_STORAGE_KEY.VAULT_LAST_STATUS);
    if (!lastSavedStatus) {
      const vaultStatus = await this.status();
      return vaultStatus.result?.status;
    }
    return lastSavedStatus;
  }
  isPromptWaitingForMasterPassword(result) {
    return !!(result.stderr && result.stderr.includes("Master password"));
  }
  async handlePostLogout(reason) {
    this.clearSessionToken();
    await this.callActionListeners("logout", reason);
  }
  async handleCommonErrors(error) {
    const errorMessage = error.stderr;
    if (!errorMessage) return {};
    if (/not logged in/i.test(errorMessage)) {
      await this.handlePostLogout();
      return { error: new NotLoggedInError("Not logged in") };
    }
    if (/Premium status/i.test(errorMessage)) {
      return { error: new PremiumFeatureError() };
    }
    return {};
  }
  setActionListener(action, listener) {
    const listeners = this.actionListeners.get(action);
    if (listeners && listeners.size > 0) {
      listeners.add(listener);
    } else {
      this.actionListeners.set(action, /* @__PURE__ */ new Set([listener]));
    }
    return this;
  }
  removeActionListener(action, listener) {
    const listeners = this.actionListeners.get(action);
    if (listeners && listeners.size > 0) {
      listeners.delete(listener);
    }
    return this;
  }
  async callActionListeners(action, ...args) {
    const listeners = this.actionListeners.get(action);
    if (listeners && listeners.size > 0) {
      for (const listener of listeners) {
        try {
          await listener?.(...args);
        } catch (error) {
          captureException(`Error calling bitwarden action listener for ${action}`, error);
          if (action === "unlock") throw error;
        }
      }
    }
  }
};

// src/components/LoadingFallback.tsx
var import_api9 = require("@raycast/api");
var import_jsx_runtime2 = require("react/jsx-runtime");
var LoadingFallback = () => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api9.Form, { isLoading: true });

// src/utils/hooks/useOnceEffect.ts
var import_react2 = require("react");
function useOnceEffect(effect, condition) {
  const hasRun = (0, import_react2.useRef)(false);
  (0, import_react2.useEffect)(() => {
    if (hasRun.current) return;
    if (condition !== void 0 && !condition) return;
    hasRun.current = true;
    void effect();
  }, [condition]);
}
var useOnceEffect_default = useOnceEffect;

// src/context/bitwarden.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var BitwardenContext = (0, import_react3.createContext)(null);
var BitwardenProvider = ({ children, loadingFallback = /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(LoadingFallback, {}) }) => {
  const [bitwarden, setBitwarden] = (0, import_react3.useState)();
  const [error, setError] = (0, import_react3.useState)();
  useOnceEffect_default(() => {
    void new Bitwarden().initialize().then(setBitwarden).catch(handleBwInitError);
  });
  function handleBwInitError(error2) {
    if (error2 instanceof InstalledCLINotFoundError) {
      setError(error2);
    } else {
      throw error2;
    }
  }
  if (error) return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(TroubleshootingGuide_default, { error });
  if (!bitwarden) return loadingFallback;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(BitwardenContext.Provider, { value: bitwarden, children });
};
var useBitwarden = () => {
  const context = (0, import_react3.useContext)(BitwardenContext);
  if (context == null) {
    throw new Error("useBitwarden must be used within a BitwardenProvider");
  }
  return context;
};

// src/utils/objects.ts
function isObject(obj) {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}

// src/utils/debug.ts
function treatError(error, options) {
  try {
    const execaError = error;
    let errorString;
    if (execaError?.stderr) {
      errorString = execaError.stderr;
    } else if (error instanceof Error) {
      errorString = `${error.name}: ${error.message}`;
    } else if (isObject(error)) {
      errorString = JSON.stringify(error);
    } else {
      errorString = `${error}`;
    }
    if (!errorString) return "";
    if (!options?.omitSensitiveValue) return errorString;
    return omitSensitiveValueFromString(errorString, options.omitSensitiveValue);
  } catch {
    return "";
  }
}
function omitSensitiveValueFromString(value, sensitiveValue) {
  return value.replace(new RegExp(sensitiveValue, "i"), "[REDACTED]");
}

// src/utils/hooks/useVaultMessages.ts
var import_api10 = require("@raycast/api");
var import_react4 = require("react");
function useVaultMessages() {
  const bitwarden = useBitwarden();
  const [vaultState, setVaultState] = (0, import_react4.useState)(null);
  (0, import_react4.useEffect)(() => {
    void bitwarden.status().then(({ error, result }) => {
      if (!error) setVaultState(result);
    }).catch(() => {
    });
  }, []);
  const shouldShowServer = !!getServerUrlPreference();
  let userMessage = "...";
  let serverMessage = "...";
  if (vaultState) {
    const { status, userEmail, serverUrl } = vaultState;
    userMessage = status == "unauthenticated" ? "\u274C Logged out" : `\u{1F512} Locked (${userEmail})`;
    if (serverUrl) {
      serverMessage = serverUrl || "";
    } else if (!serverUrl && shouldShowServer || serverUrl && !shouldShowServer) {
      void (0, import_api10.confirmAlert)({
        icon: import_api10.Icon.ExclamationMark,
        title: "Restart Required",
        message: "Bitwarden server URL preference has been changed since the extension was opened.",
        primaryAction: {
          title: "Close Extension"
        },
        dismissAction: {
          title: "Close Raycast",
          // Only here to provide the necessary second option
          style: import_api10.Alert.ActionStyle.Cancel
        }
      }).then((closeExtension) => {
        if (closeExtension) {
          void (0, import_api10.popToRoot)();
        } else {
          void (0, import_api10.closeMainWindow)();
        }
      });
    }
  }
  return { userMessage, serverMessage, shouldShowServer };
}
var useVaultMessages_default = useVaultMessages;

// src/utils/localstorage.ts
var import_api12 = require("@raycast/api");

// node_modules/.bun/@raycast+utils@2.2.2+2f2cf03b9bc58947/node_modules/@raycast/utils/dist/module.js
var import_react5 = __toESM(require("react"));
var import_api11 = require("@raycast/api");

// node_modules/.bun/dequal@2.0.3/node_modules/dequal/lite/index.mjs
var has = Object.prototype.hasOwnProperty;
function dequal(foo, bar) {
  var ctor, len;
  if (foo === bar) return true;
  if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
    if (ctor === Date) return foo.getTime() === bar.getTime();
    if (ctor === RegExp) return foo.toString() === bar.toString();
    if (ctor === Array) {
      if ((len = foo.length) === bar.length) {
        while (len-- && dequal(foo[len], bar[len])) ;
      }
      return len === -1;
    }
    if (!ctor || typeof foo === "object") {
      len = 0;
      for (ctor in foo) {
        if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
        if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
      }
      return Object.keys(bar).length === len;
    }
  }
  return foo !== foo && bar !== bar;
}

// node_modules/.bun/@raycast+utils@2.2.2+2f2cf03b9bc58947/node_modules/@raycast/utils/dist/module.js
var import_node_fs = __toESM(require("node:fs"));
var import_node_path3 = __toESM(require("node:path"));
var import_jsx_runtime4 = require("react/jsx-runtime");
function $a57ed8effbd797c7$export$722debc0e56fea39(value) {
  const ref = (0, import_react5.useRef)(value);
  const signalRef = (0, import_react5.useRef)(0);
  if (!(0, dequal)(value, ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }
  return (0, import_react5.useMemo)(() => ref.current, [
    signalRef.current
  ]);
}
function $bfcf6ee368b3bd9f$export$d4b699e2c1148419(value) {
  const ref = (0, import_react5.useRef)(value);
  ref.current = value;
  return ref;
}
function $c718fd03aba6111c$export$80e5033e369189f3(error, options) {
  const message = error instanceof Error ? error.message : String(error);
  return (0, import_api11.showToast)({
    style: (0, import_api11.Toast).Style.Failure,
    title: options?.title ?? "Something went wrong",
    message: options?.message ?? message,
    primaryAction: options?.primaryAction ?? $c718fd03aba6111c$var$handleErrorToastAction(error),
    secondaryAction: options?.primaryAction ? $c718fd03aba6111c$var$handleErrorToastAction(error) : void 0
  });
}
var $c718fd03aba6111c$var$handleErrorToastAction = (error) => {
  let privateExtension = true;
  let title = "[Extension Name]...";
  let extensionURL = "";
  try {
    const packageJSON = JSON.parse((0, import_node_fs.readFileSync)((0, import_node_path3.join)((0, import_api11.environment).assetsPath, "..", "package.json"), "utf8"));
    title = `[${packageJSON.title}]...`;
    extensionURL = `https://raycast.com/${packageJSON.owner || packageJSON.author}/${packageJSON.name}`;
    if (!packageJSON.owner || packageJSON.access === "public") privateExtension = false;
  } catch (err) {
  }
  const fallback = (0, import_api11.environment).isDevelopment || privateExtension;
  const stack = error instanceof Error ? error?.stack || error?.message || "" : String(error);
  return {
    title: fallback ? "Copy Logs" : "Report Error",
    onAction(toast) {
      toast.hide();
      if (fallback) (0, import_api11.Clipboard).copy(stack);
      else (0, import_api11.open)(`https://github.com/raycast/extensions/issues/new?&labels=extension%2Cbug&template=extension_bug_report.yml&title=${encodeURIComponent(title)}&extension-url=${encodeURI(extensionURL)}&description=${encodeURIComponent(`#### Error:
\`\`\`
${stack}
\`\`\`
`)}`);
    }
  };
};
function $cefc05764ce5eacd$export$dd6b79aaabe7bc37(fn, args, options) {
  const lastCallId = (0, import_react5.useRef)(0);
  const [state, set] = (0, import_react5.useState)({
    isLoading: true
  });
  const fnRef = (0, $bfcf6ee368b3bd9f$export$d4b699e2c1148419)(fn);
  const latestAbortable = (0, $bfcf6ee368b3bd9f$export$d4b699e2c1148419)(options?.abortable);
  const latestArgs = (0, $bfcf6ee368b3bd9f$export$d4b699e2c1148419)(args || []);
  const latestOnError = (0, $bfcf6ee368b3bd9f$export$d4b699e2c1148419)(options?.onError);
  const latestOnData = (0, $bfcf6ee368b3bd9f$export$d4b699e2c1148419)(options?.onData);
  const latestOnWillExecute = (0, $bfcf6ee368b3bd9f$export$d4b699e2c1148419)(options?.onWillExecute);
  const latestFailureToast = (0, $bfcf6ee368b3bd9f$export$d4b699e2c1148419)(options?.failureToastOptions);
  const latestValue = (0, $bfcf6ee368b3bd9f$export$d4b699e2c1148419)(state.data);
  const latestCallback = (0, import_react5.useRef)(null);
  const paginationArgsRef = (0, import_react5.useRef)({
    page: 0
  });
  const usePaginationRef = (0, import_react5.useRef)(false);
  const hasMoreRef = (0, import_react5.useRef)(true);
  const pageSizeRef = (0, import_react5.useRef)(50);
  const abort = (0, import_react5.useCallback)(() => {
    if (latestAbortable.current) {
      latestAbortable.current.current?.abort();
      latestAbortable.current.current = new AbortController();
    }
    return ++lastCallId.current;
  }, [
    latestAbortable
  ]);
  const callback = (0, import_react5.useCallback)((...args2) => {
    const callId = abort();
    latestOnWillExecute.current?.(args2);
    set((prevState) => ({
      ...prevState,
      isLoading: true
    }));
    const promiseOrPaginatedPromise = $cefc05764ce5eacd$var$bindPromiseIfNeeded(fnRef.current)(...args2);
    function handleError(error) {
      if (error.name == "AbortError") return error;
      if (callId === lastCallId.current) {
        if (latestOnError.current) latestOnError.current(error);
        else if ((0, import_api11.environment).launchType !== (0, import_api11.LaunchType).Background) (0, $c718fd03aba6111c$export$80e5033e369189f3)(error, {
          title: "Failed to fetch latest data",
          primaryAction: {
            title: "Retry",
            onAction(toast) {
              toast.hide();
              latestCallback.current?.(...latestArgs.current || []);
            }
          },
          ...latestFailureToast.current
        });
        set({
          error,
          isLoading: false
        });
      }
      return error;
    }
    if (typeof promiseOrPaginatedPromise === "function") {
      usePaginationRef.current = true;
      return promiseOrPaginatedPromise(paginationArgsRef.current).then(
        // @ts-expect-error too complicated for TS
        ({ data, hasMore, cursor }) => {
          if (callId === lastCallId.current) {
            if (paginationArgsRef.current) {
              paginationArgsRef.current.cursor = cursor;
              paginationArgsRef.current.lastItem = data?.[data.length - 1];
            }
            if (latestOnData.current) latestOnData.current(data, paginationArgsRef.current);
            if (hasMore) pageSizeRef.current = data.length;
            hasMoreRef.current = hasMore;
            set((previousData) => {
              if (paginationArgsRef.current.page === 0) return {
                data,
                isLoading: false
              };
              return {
                data: (previousData.data || [])?.concat(data),
                isLoading: false
              };
            });
          }
          return data;
        },
        (error) => {
          hasMoreRef.current = false;
          return handleError(error);
        }
      );
    }
    usePaginationRef.current = false;
    return promiseOrPaginatedPromise.then((data) => {
      if (callId === lastCallId.current) {
        if (latestOnData.current) latestOnData.current(data);
        set({
          data,
          isLoading: false
        });
      }
      return data;
    }, handleError);
  }, [
    latestOnData,
    latestOnError,
    latestArgs,
    fnRef,
    set,
    latestCallback,
    latestOnWillExecute,
    paginationArgsRef,
    latestFailureToast,
    abort
  ]);
  latestCallback.current = callback;
  const revalidate = (0, import_react5.useCallback)(() => {
    paginationArgsRef.current = {
      page: 0
    };
    const args2 = latestArgs.current || [];
    return callback(...args2);
  }, [
    callback,
    latestArgs
  ]);
  const mutate = (0, import_react5.useCallback)(async (asyncUpdate, options2) => {
    let dataBeforeOptimisticUpdate;
    try {
      if (options2?.optimisticUpdate) {
        abort();
        if (typeof options2?.rollbackOnError !== "function" && options2?.rollbackOnError !== false)
          dataBeforeOptimisticUpdate = structuredClone(latestValue.current?.value);
        const update = options2.optimisticUpdate;
        set((prevState) => ({
          ...prevState,
          data: update(prevState.data)
        }));
      }
      return await asyncUpdate;
    } catch (err) {
      if (typeof options2?.rollbackOnError === "function") {
        const update = options2.rollbackOnError;
        set((prevState) => ({
          ...prevState,
          data: update(prevState.data)
        }));
      } else if (options2?.optimisticUpdate && options2?.rollbackOnError !== false) set((prevState) => ({
        ...prevState,
        data: dataBeforeOptimisticUpdate
      }));
      throw err;
    } finally {
      if (options2?.shouldRevalidateAfter !== false) {
        if ((0, import_api11.environment).launchType === (0, import_api11.LaunchType).Background || (0, import_api11.environment).commandMode === "menu-bar")
          await revalidate();
        else revalidate();
      }
    }
  }, [
    revalidate,
    latestValue,
    set,
    abort
  ]);
  const onLoadMore = (0, import_react5.useCallback)(() => {
    paginationArgsRef.current.page += 1;
    const args2 = latestArgs.current || [];
    callback(...args2);
  }, [
    paginationArgsRef,
    latestArgs,
    callback
  ]);
  (0, import_react5.useEffect)(() => {
    paginationArgsRef.current = {
      page: 0
    };
    if (options?.execute !== false) callback(...args || []);
    else
      abort();
  }, [
    (0, $a57ed8effbd797c7$export$722debc0e56fea39)([
      args,
      options?.execute,
      callback
    ]),
    latestAbortable,
    paginationArgsRef
  ]);
  (0, import_react5.useEffect)(() => {
    return () => {
      abort();
    };
  }, [
    abort
  ]);
  const isLoading = options?.execute !== false ? state.isLoading : false;
  const stateWithLoadingFixed = {
    ...state,
    isLoading
  };
  const pagination = usePaginationRef.current ? {
    pageSize: pageSizeRef.current,
    hasMore: hasMoreRef.current,
    onLoadMore
  } : void 0;
  return {
    ...stateWithLoadingFixed,
    revalidate,
    mutate,
    pagination
  };
}
function $cefc05764ce5eacd$var$bindPromiseIfNeeded(fn) {
  if (fn === Promise.all)
    return fn.bind(Promise);
  if (fn === Promise.race)
    return fn.bind(Promise);
  if (fn === Promise.resolve)
    return fn.bind(Promise);
  if (fn === Promise.reject)
    return fn.bind(Promise);
  return fn;
}
function $e2e1ea6dd3b7d2e1$export$b644b65666fe0c18(key, _value) {
  const value = this[key];
  if (value instanceof Date) return `__raycast_cached_date__${value.toISOString()}`;
  if (Buffer.isBuffer(value)) return `__raycast_cached_buffer__${value.toString("base64")}`;
  return _value;
}
function $e2e1ea6dd3b7d2e1$export$63698c10df99509c(_key, value) {
  if (typeof value === "string" && value.startsWith("__raycast_cached_date__")) return new Date(value.replace("__raycast_cached_date__", ""));
  if (typeof value === "string" && value.startsWith("__raycast_cached_buffer__")) return Buffer.from(value.replace("__raycast_cached_buffer__", ""), "base64");
  return value;
}
var $c40d7eded38ca69c$var$rootCache = /* @__PURE__ */ Symbol("cache without namespace");
var $c40d7eded38ca69c$var$cacheMap = /* @__PURE__ */ new Map();
function $c40d7eded38ca69c$export$14afb9e4c16377d3(key, initialState2, config) {
  const cacheKey = config?.cacheNamespace || $c40d7eded38ca69c$var$rootCache;
  const cache = $c40d7eded38ca69c$var$cacheMap.get(cacheKey) || $c40d7eded38ca69c$var$cacheMap.set(cacheKey, new (0, import_api11.Cache)({
    namespace: config?.cacheNamespace
  })).get(cacheKey);
  if (!cache) throw new Error("Missing cache");
  const keyRef = (0, $bfcf6ee368b3bd9f$export$d4b699e2c1148419)(key);
  const initialValueRef = (0, $bfcf6ee368b3bd9f$export$d4b699e2c1148419)(initialState2);
  const cachedState = (0, import_react5.useSyncExternalStore)(cache.subscribe, () => {
    try {
      return cache.get(keyRef.current);
    } catch (error) {
      console.error("Could not get Cache data:", error);
      return void 0;
    }
  });
  const state = (0, import_react5.useMemo)(() => {
    if (typeof cachedState !== "undefined") {
      if (cachedState === "undefined") return void 0;
      try {
        return JSON.parse(cachedState, (0, $e2e1ea6dd3b7d2e1$export$63698c10df99509c));
      } catch (err) {
        console.warn("The cached data is corrupted", err);
        return initialValueRef.current;
      }
    } else return initialValueRef.current;
  }, [
    cachedState,
    initialValueRef
  ]);
  const stateRef = (0, $bfcf6ee368b3bd9f$export$d4b699e2c1148419)(state);
  const setStateAndCache = (0, import_react5.useCallback)((updater) => {
    const newValue = typeof updater === "function" ? updater(stateRef.current) : updater;
    if (typeof newValue === "undefined") cache.set(keyRef.current, "undefined");
    else {
      const stringifiedValue = JSON.stringify(newValue, (0, $e2e1ea6dd3b7d2e1$export$b644b65666fe0c18));
      cache.set(keyRef.current, stringifiedValue);
    }
    return newValue;
  }, [
    cache,
    keyRef,
    stateRef
  ]);
  return [
    state,
    setStateAndCache
  ];
}

// src/utils/localstorage.ts
function useLocalStorageItem(key, defaultValue) {
  const { data: value, revalidate, isLoading } = $cefc05764ce5eacd$export$dd6b79aaabe7bc37(() => import_api12.LocalStorage.getItem(key));
  const set = async (value2) => {
    await import_api12.LocalStorage.setItem(key, value2);
    await revalidate();
  };
  const remove = async () => {
    await import_api12.LocalStorage.removeItem(key);
    await revalidate();
  };
  return [value ?? defaultValue, { isLoading, set, remove }];
}

// src/components/UnlockForm.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var UnlockForm = ({ pendingAction = Promise.resolve() }) => {
  const bitwarden = useBitwarden();
  const { userMessage, serverMessage, shouldShowServer } = useVaultMessages_default();
  const [isLoading, setLoading] = (0, import_react6.useState)(false);
  const [unlockError, setUnlockError] = (0, import_react6.useState)();
  const [showPassword, setShowPassword] = (0, import_react6.useState)(false);
  const [password, setPassword] = (0, import_react6.useState)("");
  const [lockReason, { remove: clearLockReason }] = useLocalStorageItem(LOCAL_STORAGE_KEY.VAULT_LOCK_REASON);
  async function onSubmit() {
    if (password.length === 0) return;
    try {
      setLoading(true);
      setUnlockError(void 0);
      await pendingAction;
      const toast = await (0, import_api13.showToast)({ title: "Validating...", message: "Please wait", style: import_api13.Toast.Style.Animated });
      const { error, result: vaultState } = await bitwarden.status();
      if (error) throw error;
      if (vaultState.status === "unauthenticated") {
        try {
          toast.title = "Logging in...";
          const { error: loginError } = await bitwarden.login();
          if (loginError) throw loginError;
        } catch (error2) {
          return handleUnlockError(error2, {
            title: "Failed to log in",
            fallbackMessage: `Please check your ${shouldShowServer ? "Server URL, " : ""}API Key and Secret.`
          });
        }
      }
      toast.title = "Unlocking vault...";
      const { error: unlockError2 } = await bitwarden.unlock(password);
      if (unlockError2) {
        return handleUnlockError(unlockError2, {
          title: "Failed to unlock vault",
          fallbackMessage: "Please check your credentials"
        });
      }
      toast.title = "Vault unlocked";
      toast.style = import_api13.Toast.Style.Success;
      toast.message = void 0;
      await clearLockReason();
    } catch (error) {
      await handleUnlockError(error, {
        title: "Failed to unlock vault",
        fallbackMessage: "Please check your credentials"
      });
    } finally {
      setLoading(false);
    }
  }
  async function handleUnlockError(error, toastOptions) {
    const { title, fallbackMessage } = toastOptions;
    const { displayableError = fallbackMessage, treatedError } = getUsefulError(error, password);
    setUnlockError(treatedError);
    await (0, import_api13.showToast)({
      title,
      message: displayableError,
      style: import_api13.Toast.Style.Failure,
      primaryAction: { title: "Copy Error", onAction: copyUnlockError }
    });
    captureException("Failed to unlock vault", error);
  }
  const copyUnlockError = async () => {
    if (!unlockError) return;
    await import_api13.Clipboard.copy(unlockError);
    await (0, import_api13.showToast)(import_api13.Toast.Style.Success, "Error copied to clipboard");
  };
  let PasswordField = import_api13.Form.PasswordField;
  let passwordFieldId = "password";
  if (showPassword) {
    PasswordField = import_api13.Form.TextField;
    passwordFieldId = "plainPassword";
  }
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    import_api13.Form,
    {
      actions: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_api13.ActionPanel, { children: [
        !isLoading && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_api13.Action.SubmitForm, { icon: import_api13.Icon.LockUnlocked, title: "Submit", onSubmit }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            import_api13.Action,
            {
              icon: showPassword ? import_api13.Icon.EyeDisabled : import_api13.Icon.Eye,
              title: showPassword ? "Hide Password" : "Show Password",
              onAction: () => setShowPassword((prev) => !prev),
              shortcut: { macOS: { key: "e", modifiers: ["opt"] }, Windows: { key: "e", modifiers: ["alt"] } }
            }
          )
        ] }),
        unlockError && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          import_api13.Action,
          {
            onAction: copyUnlockError,
            title: "Copy Last Error",
            icon: import_api13.Icon.Bug,
            style: import_api13.Action.Style.Destructive
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(DebuggingBugReportingActionSection, {})
      ] }),
      children: [
        shouldShowServer && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_api13.Form.Description, { title: "Server URL", text: serverMessage }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_api13.Form.Description, { title: "Vault Status", text: userMessage }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          PasswordField,
          {
            id: passwordFieldId,
            title: "Master Password",
            value: password,
            onChange: setPassword,
            ref: (field) => field?.focus()
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          import_api13.Form.Description,
          {
            title: "",
            text: `Press ${platform === "macos" ? "\u2325" : "Alt"}+E to ${showPassword ? "hide" : "show"} password`
          }
        ),
        !!lockReason && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_api13.Form.Description, { title: "\u2139\uFE0F", text: lockReason }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TimeoutInfoDescription, {})
        ] })
      ]
    }
  );
};
function TimeoutInfoDescription() {
  const vaultTimeoutMs = (0, import_api13.getPreferenceValues)().repromptIgnoreDuration;
  const timeoutLabel = getLabelForTimeoutPreference(vaultTimeoutMs);
  if (!timeoutLabel) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    import_api13.Form.Description,
    {
      title: "",
      text: `Timeout is set to ${timeoutLabel}, this can be configured in the extension settings`
    }
  );
}
function getUsefulError(error, password) {
  const treatedError = treatError(error, { omitSensitiveValue: password });
  let displayableError;
  if (/Invalid master password/i.test(treatedError)) {
    displayableError = "Invalid master password";
  } else if (/Invalid API Key/i.test(treatedError)) {
    displayableError = "Invalid Client ID or Secret";
  }
  return { displayableError, treatedError };
}
var UnlockForm_default = UnlockForm;

// src/components/searchVault/VaultLoadingFallback.tsx
var import_api14 = require("@raycast/api");
var import_jsx_runtime6 = require("react/jsx-runtime");
var VaultLoadingFallback = () => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_api14.List, { searchBarPlaceholder: "Search vault", isLoading: true });

// src/context/session/reducer.ts
var import_react7 = require("react");
var initialState = {
  token: void 0,
  passwordHash: void 0,
  isLoading: true,
  isLocked: false,
  isAuthenticated: false
};
var useSessionReducer = () => {
  return (0, import_react7.useReducer)((state, action) => {
    switch (action.type) {
      case "loadState": {
        const { type: _, ...actionPayload } = action;
        return { ...state, ...actionPayload };
      }
      case "lock": {
        return {
          ...state,
          token: void 0,
          passwordHash: void 0,
          isLoading: false,
          isLocked: true
        };
      }
      case "unlock": {
        return {
          ...state,
          token: action.token,
          passwordHash: action.passwordHash,
          isLocked: false,
          isAuthenticated: true
        };
      }
      case "logout": {
        return {
          ...state,
          token: void 0,
          passwordHash: void 0,
          isLocked: true,
          isAuthenticated: false,
          isLoading: false
        };
      }
      case "vaultTimeout": {
        return {
          ...state,
          isLocked: true
        };
      }
      case "finishLoadingSavedState": {
        if (!state.token || !state.passwordHash) {
          throw new Error("Missing required fields: token, passwordHash");
        }
        const hasToken = !!state.token;
        return {
          ...state,
          isLoading: false,
          isLocked: !hasToken,
          isAuthenticated: hasToken
        };
      }
      case "failLoadingSavedState": {
        return {
          ...state,
          isLoading: false,
          isLocked: true
        };
      }
      default: {
        return state;
      }
    }
  }, initialState);
};

// src/context/session/utils.ts
var import_api15 = require("@raycast/api");
var import_child_process = require("child_process");
var import_util = require("util");
var exec = (0, import_util.promisify)(import_child_process.exec);
var SessionStorage = {
  getSavedSession: () => {
    return Promise.all([
      import_api15.LocalStorage.getItem(LOCAL_STORAGE_KEY.SESSION_TOKEN),
      import_api15.LocalStorage.getItem(LOCAL_STORAGE_KEY.REPROMPT_HASH),
      import_api15.LocalStorage.getItem(LOCAL_STORAGE_KEY.LAST_ACTIVITY_TIME),
      import_api15.LocalStorage.getItem(LOCAL_STORAGE_KEY.VAULT_LAST_STATUS)
    ]);
  },
  clearSession: async () => {
    await Promise.all([
      import_api15.LocalStorage.removeItem(LOCAL_STORAGE_KEY.SESSION_TOKEN),
      import_api15.LocalStorage.removeItem(LOCAL_STORAGE_KEY.REPROMPT_HASH)
    ]);
  },
  saveSession: async (token, passwordHash) => {
    await Promise.all([
      import_api15.LocalStorage.setItem(LOCAL_STORAGE_KEY.SESSION_TOKEN, token),
      import_api15.LocalStorage.setItem(LOCAL_STORAGE_KEY.REPROMPT_HASH, passwordHash)
    ]);
  },
  logoutClearSession: async () => {
    await Promise.all([
      import_api15.LocalStorage.removeItem(LOCAL_STORAGE_KEY.SESSION_TOKEN),
      import_api15.LocalStorage.removeItem(LOCAL_STORAGE_KEY.REPROMPT_HASH),
      import_api15.LocalStorage.removeItem(LOCAL_STORAGE_KEY.LAST_ACTIVITY_TIME)
    ]);
  }
};
var checkSystemLockedSinceLastAccess = (lastActivityTime) => {
  return checkSystemLogTimeAfter(lastActivityTime, (time) => getLastSyslog(time, "handleUnlockResult"));
};
var checkSystemSleptSinceLastAccess = (lastActivityTime) => {
  return checkSystemLogTimeAfter(lastActivityTime, (time) => getLastSyslog(time, "sleep 0"));
};
function getLastSyslog(hours, filter) {
  return exec(
    `log show --style syslog --predicate "process == 'loginwindow'" --info --last ${hours}h | grep "${filter}" | tail -n 1`
  );
}
async function checkSystemLogTimeAfter(time, getLogEntry) {
  const lastScreenLockTime = await getSystemLogTime(getLogEntry);
  if (!lastScreenLockTime) return true;
  return new Date(lastScreenLockTime).getTime() > time.getTime();
}
var getSystemLogTime_INCREMENT_HOURS = 2;
var getSystemLogTime_MAX_RETRIES = 5;
async function getSystemLogTime(getLogEntry, timeSpanHours = 1, retryAttempt = 0) {
  try {
    if (retryAttempt > getSystemLogTime_MAX_RETRIES) {
      debugLog("Max retry attempts reached to get last screen lock time");
      return void 0;
    }
    const { stdout, stderr } = await getLogEntry(timeSpanHours);
    const [logDate, logTime] = stdout?.split(" ") ?? [];
    if (stderr || !logDate || !logTime) {
      return getSystemLogTime(getLogEntry, timeSpanHours + getSystemLogTime_INCREMENT_HOURS, retryAttempt + 1);
    }
    const logFullDate = /* @__PURE__ */ new Date(`${logDate}T${logTime}`);
    if (!logFullDate || logFullDate.toString() === "Invalid Date") return void 0;
    return logFullDate;
  } catch (error) {
    captureException("Failed to get last screen lock time", error);
    return void 0;
  }
}

// src/context/session/session.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
var SessionContext = (0, import_react8.createContext)(null);
function SessionProvider(props) {
  const { children, loadingFallback = /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(VaultLoadingFallback, {}), unlock } = props;
  const bitwarden = useBitwarden();
  const [state, dispatch] = useSessionReducer();
  const pendingActionRef = (0, import_react8.useRef)(Promise.resolve());
  useOnceEffect_default(bootstrapSession, bitwarden);
  async function bootstrapSession() {
    try {
      bitwarden.setActionListener("lock", handleLock).setActionListener("unlock", handleUnlock).setActionListener("logout", handleLogout);
      const [token, passwordHash, lastActivityTimeString, lastVaultStatus] = await SessionStorage.getSavedSession();
      if (!token || !passwordHash) throw new LockVaultError();
      dispatch({ type: "loadState", token, passwordHash });
      bitwarden.setSessionToken(token);
      if (bitwarden.wasCliUpdated) throw new LogoutVaultError(VAULT_LOCK_MESSAGES.CLI_UPDATED);
      if (lastVaultStatus === "locked") throw new LockVaultError();
      if (lastVaultStatus === "unauthenticated") throw new LogoutVaultError();
      if (lastActivityTimeString) {
        const lastActivityTime = new Date(lastActivityTimeString);
        const vaultTimeoutMs = +(0, import_api16.getPreferenceValues)().repromptIgnoreDuration;
        if (platform === "macos" && vaultTimeoutMs === VAULT_TIMEOUT.SYSTEM_LOCK) {
          if (await checkSystemLockedSinceLastAccess(lastActivityTime)) {
            throw new LockVaultError(VAULT_LOCK_MESSAGES.SYSTEM_LOCK);
          }
        } else if (platform === "macos" && vaultTimeoutMs === VAULT_TIMEOUT.SYSTEM_SLEEP) {
          if (await checkSystemSleptSinceLastAccess(lastActivityTime)) {
            throw new LockVaultError(VAULT_LOCK_MESSAGES.SYSTEM_SLEEP);
          }
        } else if (vaultTimeoutMs !== VAULT_TIMEOUT.NEVER) {
          const timeElapseSinceLastActivity = Date.now() - lastActivityTime.getTime();
          if (vaultTimeoutMs === VAULT_TIMEOUT.IMMEDIATELY || timeElapseSinceLastActivity >= vaultTimeoutMs) {
            throw new LockVaultError(VAULT_LOCK_MESSAGES.TIMEOUT);
          }
        }
      }
      dispatch({ type: "finishLoadingSavedState" });
    } catch (error) {
      if (error instanceof LockVaultError) {
        pendingActionRef.current = bitwarden.lock({ reason: error.message, immediate: true, checkVaultStatus: true });
      } else if (error instanceof LogoutVaultError) {
        pendingActionRef.current = bitwarden.logout({ reason: error.message, immediate: true });
      } else {
        pendingActionRef.current = bitwarden.lock({ immediate: true });
        dispatch({ type: "failLoadingSavedState" });
        captureException("Failed to bootstrap session state", error);
      }
    }
  }
  async function handleUnlock(password, token) {
    const passwordHash = await hashMasterPasswordForReprompting(password);
    await SessionStorage.saveSession(token, passwordHash);
    await import_api16.LocalStorage.removeItem(LOCAL_STORAGE_KEY.VAULT_LOCK_REASON);
    dispatch({ type: "unlock", token, passwordHash });
  }
  async function handleLock(reason) {
    await cleanupPostLock();
    if (reason) await import_api16.LocalStorage.setItem(LOCAL_STORAGE_KEY.VAULT_LOCK_REASON, reason);
    dispatch({ type: "lock" });
  }
  async function handleLogout(reason) {
    await cleanupPostLogout();
    if (reason) await import_api16.LocalStorage.setItem(LOCAL_STORAGE_KEY.VAULT_LOCK_REASON, reason);
    dispatch({ type: "logout" });
  }
  async function confirmMasterPassword(password) {
    const enteredPasswordHash = await hashMasterPasswordForReprompting(password);
    return enteredPasswordHash === state.passwordHash;
  }
  const contextValue = (0, import_react8.useMemo)(
    () => ({
      token: state.token,
      isLoading: state.isLoading,
      isAuthenticated: state.isAuthenticated,
      isLocked: state.isLocked,
      active: !state.isLoading && state.isAuthenticated && !state.isLocked,
      confirmMasterPassword
    }),
    [state, confirmMasterPassword]
  );
  if (state.isLoading) return loadingFallback;
  const showUnlockForm = state.isLocked || !state.isAuthenticated;
  const _children = state.token ? children : null;
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(SessionContext.Provider, { value: contextValue, children: showUnlockForm && unlock ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(UnlockForm_default, { pendingAction: pendingActionRef.current }) : _children });
}
async function cleanupPostLock() {
  await SessionStorage.clearSession();
}
async function cleanupPostLogout() {
  await SessionStorage.logoutClearSession();
  Cache.clear();
}
function useSession() {
  const session = (0, import_react8.useContext)(SessionContext);
  if (session == null) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return session;
}
var LockVaultError = class extends Error {
  constructor(lockReason) {
    super(lockReason);
  }
};
var LogoutVaultError = class extends Error {
  constructor(lockReason) {
    super(lockReason);
  }
};

// src/utils/hooks/useReprompt.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
function useReprompt(action, options) {
  const { description = "Performing an action that requires the master password" } = options ?? {};
  const session = useSession();
  const { push, pop } = (0, import_api17.useNavigation)();
  async function handleConfirm(password) {
    const isPasswordCorrect = await session.confirmMasterPassword(password);
    if (!isPasswordCorrect) {
      await (0, import_api17.showToast)(import_api17.Toast.Style.Failure, "Failed to unlock vault", "Check your credentials");
      return;
    }
    pop();
    setTimeout(action, 1);
  }
  return () => push(/* @__PURE__ */ (0, import_jsx_runtime8.jsx)(RepromptForm_default, { description, onConfirm: handleConfirm }));
}
var useReprompt_default = useReprompt;

// src/components/actions/ActionWithReprompt.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
function ActionWithReprompt(props) {
  const { repromptDescription, onAction, ...componentProps } = props;
  const { reprompt } = useSelectedVaultItem();
  const repromptAndPerformAction = useReprompt_default(onAction, { description: repromptDescription });
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_api18.Action, { ...componentProps, onAction: reprompt ? repromptAndPerformAction : onAction });
}
var ActionWithReprompt_default = ActionWithReprompt;

// src/components/actions/BugReportCollectDataAction.tsx
var import_api19 = require("@raycast/api");
var import_child_process2 = require("child_process");
var import_util2 = require("util");
var import_fs7 = require("fs");
var import_path3 = require("path");
var import_jsx_runtime10 = require("react/jsx-runtime");
var exec2 = (0, import_util2.promisify)(import_child_process2.exec);
var { supportPath: supportPath2 } = import_api19.environment;
var getSafePreferences = () => {
  const {
    clientId,
    clientSecret,
    fetchFavicons: fetchFavicons2,
    generatePasswordQuickAction,
    repromptIgnoreDuration,
    serverCertsPath,
    serverUrl,
    shouldCacheVaultItems,
    transientCopyGeneratePassword,
    transientCopyGeneratePasswordQuick,
    transientCopySearch,
    windowActionOnCopy
  } = (0, import_api19.getPreferenceValues)();
  return {
    has_clientId: !!clientId,
    has_clientSecret: !!clientSecret,
    fetchFavicons: fetchFavicons2,
    generatePasswordQuickAction,
    repromptIgnoreDuration,
    has_serverCertsPath: !!serverCertsPath,
    has_serverUrl: !!serverUrl,
    shouldCacheVaultItems,
    transientCopyGeneratePassword,
    transientCopyGeneratePasswordQuick,
    transientCopySearch,
    windowActionOnCopy
  };
};
var NA = "N/A";
var tryExec2 = async (command, trimLineBreaks = true) => {
  try {
    let cmd = command;
    if (platform === "windows") {
      cmd = `powershell -Command "${command}"`;
    } else {
      cmd = `PATH="$PATH:${(0, import_path3.dirname)(process.execPath)}" ${command}`;
    }
    const { stdout } = await exec2(cmd, { env: { BITWARDENCLI_APPDATA_DIR: supportPath2 } });
    const response = stdout.trim();
    if (trimLineBreaks) return response.replace(/\n|\r/g, "");
    return response;
  } catch (error) {
    captureException(`Failed to execute command: ${command}`, error);
    return NA;
  }
};
var getBwBinInfo = () => {
  try {
    const cliPathPref = (0, import_api19.getPreferenceValues)().cliPath;
    if (cliPathPref) {
      return { type: "custom", path: cliPathPref };
    }
    if (cliInfo.path.bin === cliInfo.path.downloadedBin) {
      return { type: "downloaded", path: cliInfo.path.downloadedBin };
    }
    return { type: "installed", path: cliInfo.path.installedBin };
  } catch (error) {
    return { type: NA, path: NA };
  }
};
var getHomebrewInfo = async () => {
  try {
    let path3 = "/opt/homebrew/bin/brew";
    if (!(0, import_fs7.existsSync)(path3)) path3 = "/usr/local/bin/brew";
    if (!(0, import_fs7.existsSync)(path3)) return { arch: NA, version: NA };
    const config = await tryExec2(`${path3} config`, false);
    if (config === NA) return { arch: NA, version: NA };
    const archValue = /HOMEBREW_PREFIX: (.+)/.exec(config)?.[1] || NA;
    const version = /HOMEBREW_VERSION: (.+)/.exec(config)?.[1] || NA;
    const arch = archValue !== NA ? archValue.includes("/opt/homebrew") ? "arm64" : "x86_64" : NA;
    return { arch, version };
  } catch (error) {
    return { arch: NA, version: NA };
  }
};
function BugReportCollectDataAction() {
  const collectData = async () => {
    const toast = await (0, import_api19.showToast)(import_api19.Toast.Style.Animated, "Collecting data...");
    try {
      const preferences = getSafePreferences();
      const bwInfo = getBwBinInfo();
      const [systemArch, osVersion, osBuildVersion, bwVersion] = await Promise.all([
        ...platform === "macos" ? [tryExec2("uname -m"), tryExec2("sw_vers -productVersion"), tryExec2("sw_vers -buildVersion")] : [
          tryExec2("(Get-CimInstance Win32_OperatingSystem).OSArchitecture"),
          tryExec2("(Get-CimInstance Win32_OperatingSystem).Caption"),
          tryExec2("(Get-CimInstance Win32_OperatingSystem).Version")
        ],
        tryExec2(`${bwInfo.path} --version`)
      ]);
      const data = {
        raycast: {
          version: import_api19.environment.raycastVersion
        },
        system: {
          arch: systemArch,
          version: osVersion,
          buildVersion: osBuildVersion
        },
        node: {
          arch: process.arch,
          version: process.version
        },
        cli: {
          type: bwInfo.type,
          version: bwVersion
        },
        preferences
      };
      if (platform === "macos") {
        const brewInfo = await getHomebrewInfo();
        data.homebrew = {
          arch: brewInfo.arch,
          version: brewInfo.version
        };
      }
      await import_api19.Clipboard.copy(JSON.stringify(data, null, 2));
      toast.style = import_api19.Toast.Style.Success;
      toast.title = "Data copied to clipboard";
    } catch (error) {
      toast.style = import_api19.Toast.Style.Failure;
      toast.title = "Failed to collect bug report data";
      captureException("Failed to collect bug report data", error);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_api19.Action, { title: "Collect Bug Report Data", icon: import_api19.Icon.Bug, onAction: collectData });
}
var BugReportCollectDataAction_default = BugReportCollectDataAction;

// src/components/actions/BugReportOpenAction.tsx
var import_api20 = require("@raycast/api");
var import_jsx_runtime11 = require("react/jsx-runtime");
var BUG_REPORT_URL = "https://github.com/raycast/extensions/issues/new?assignees=&labels=extension%2Cbug&template=extension_bug_report.yml&title=%5BBitwarden%5D+...";
function BugReportOpenAction() {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_api20.Action.OpenInBrowser, { title: "Open Bug Report", url: BUG_REPORT_URL });
}
var BugReportOpenAction_default = BugReportOpenAction;

// src/components/actions/CopyRuntimeErrorLog.tsx
var import_api21 = require("@raycast/api");
var import_jsx_runtime12 = require("react/jsx-runtime");
function CopyRuntimeErrorLog() {
  const copyErrors = async () => {
    const errorString = capturedExceptions.toString();
    if (errorString.length === 0) {
      return (0, import_api21.showToast)(import_api21.Toast.Style.Success, "No errors to copy");
    }
    await import_api21.Clipboard.copy(errorString);
    await (0, import_api21.showToast)(import_api21.Toast.Style.Success, "Errors copied to clipboard");
    await (0, import_api21.confirmAlert)({
      title: "Be careful with this information",
      message: "Please be mindful of where you share this error log, as it may contain sensitive information. Always analyze it before sharing.",
      primaryAction: { title: "Got it", style: import_api21.Alert.ActionStyle.Default }
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_api21.Action, { onAction: copyErrors, title: "Copy Last Errors", icon: import_api21.Icon.CopyClipboard, style: import_api21.Action.Style.Regular });
}
var CopyRuntimeErrorLog_default = CopyRuntimeErrorLog;

// src/components/actions/DebuggingBugReportingActionSection.tsx
var import_api22 = require("@raycast/api");

// src/utils/hooks/useCliVersion.ts
var import_react9 = require("react");
var getCliVersion = () => {
  const version = Cache.get(CACHE_KEYS.CLI_VERSION);
  if (version) return parseFloat(version);
  return -1;
};
var useCliVersion = () => {
  const [version, setVersion] = (0, import_react9.useState)(getCliVersion);
  useOnceEffect_default(() => {
    Cache.subscribe((key, value) => {
      if (value && key === CACHE_KEYS.CLI_VERSION) {
        setVersion(parseFloat(value) || -1);
      }
    });
  });
  return version;
};

// src/components/actions/DebuggingBugReportingActionSection.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
function DebuggingBugReportingActionSection() {
  const cliVersion = useCliVersion();
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_api22.ActionPanel.Section, { title: `Debugging & Bug Reporting (CLI v${cliVersion})`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(CopyRuntimeErrorLog_default, {}),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(BugReportOpenAction_default, {}),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(BugReportCollectDataAction_default, {})
  ] });
}

// src/components/actions/VaultActionsSection.tsx
var import_api26 = require("@raycast/api");

// src/context/vault.tsx
var import_api25 = require("@raycast/api");
var import_react12 = require("react");

// src/components/searchVault/context/vaultListeners.tsx
var import_react10 = require("react");
var import_jsx_runtime14 = require("react/jsx-runtime");
var VaultListenersContext = (0, import_react10.createContext)(null);
var VaultListenersProvider = ({ children }) => {
  const listeners = (0, import_react10.useRef)(/* @__PURE__ */ new Map());
  const publishItems = (itemsOrError) => {
    if (itemsOrError instanceof FailedToLoadVaultItemsError) {
      listeners.current.forEach((listener) => listener(itemsOrError));
    } else {
      listeners.current.forEach((listener, itemId) => {
        const item = itemsOrError.find((item2) => item2.id === itemId);
        if (item) listener(item);
      });
    }
  };
  const subscribeItem = (itemId, listener) => {
    listeners.current.set(itemId, listener);
    return () => {
      listeners.current.delete(itemId);
    };
  };
  const memoizedValue = (0, import_react10.useMemo)(() => ({ listeners, publishItems, subscribeItem }), []);
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(VaultListenersContext.Provider, { value: memoizedValue, children });
};
var useVaultItemPublisher = () => {
  const context = (0, import_react10.useContext)(VaultListenersContext);
  if (context == null) throw new Error("useVaultItemPublisher must be used within a VaultListenersProvider");
  return context.publishItems;
};
var useVaultItemSubscriber = () => {
  const context = (0, import_react10.useContext)(VaultListenersContext);
  if (context == null) throw new Error("useVaultItemSubscriber must be used within a VaultListenersProvider");
  return (itemId) => {
    let timeoutId;
    return new Promise((resolve, reject) => {
      const unsubscribe = context.subscribeItem(itemId, (itemOrError) => {
        try {
          unsubscribe();
          if (itemOrError instanceof FailedToLoadVaultItemsError) {
            throw itemOrError;
          }
          resolve(itemOrError);
          clearTimeout(timeoutId);
        } catch (error) {
          reject(error);
        }
      });
      timeoutId = setTimeout(() => {
        unsubscribe();
        reject(new SubscriberTimeoutError());
      }, 15e3);
    });
  };
};
var SubscriberTimeoutError = class extends Error {
  constructor() {
    super("Timed out waiting for item");
    this.name = "SubscriberTimeoutError";
  }
};
var vaultListeners_default = VaultListenersProvider;

// src/components/searchVault/utils/useVaultCaching.ts
var import_api24 = require("@raycast/api");

// src/components/searchVault/utils/caching.ts
function prepareItemsForCache(items) {
  return items.map((item) => ({
    object: item.object,
    id: item.id,
    organizationId: item.organizationId,
    folderId: item.folderId,
    type: item.type,
    name: item.name,
    revisionDate: item.revisionDate,
    creationDate: item.creationDate,
    deletedDate: item.deletedDate,
    favorite: item.favorite,
    reprompt: item.reprompt,
    collectionIds: item.collectionIds,
    secureNote: item.secureNote ? { type: item.secureNote.type } : void 0,
    // sensitive data below
    fields: cleanFields(item.fields),
    login: cleanLogin(item.login),
    identity: cleanIdentity(item.identity),
    card: cleanCard(item.card),
    passwordHistory: cleanPasswordHistory(item.passwordHistory),
    notes: hideIfDefined(item.notes),
    sshKey: cleanSshKey(item.sshKey)
  }));
}
function prepareFoldersForCache(folders) {
  return folders.map((folder) => ({ object: folder.object, id: folder.id, name: folder.name }));
}
function cleanFields(fields) {
  return fields?.map((field) => ({
    name: field.name,
    // necessary for display
    value: hideIfDefined(field.value),
    type: field.type,
    linkedId: field.linkedId
  }));
}
function cleanLogin(login) {
  if (!login) return void 0;
  return {
    username: login.username,
    // necessary for display
    uris: login.uris,
    password: hideIfDefined(login.password),
    passwordRevisionDate: hideIfDefined(login.passwordRevisionDate),
    totp: hideIfDefined(login.totp)
  };
}
function cleanIdentity(identity) {
  if (!identity) return void 0;
  return {
    title: hideIfDefined(identity.title),
    firstName: hideIfDefined(identity.firstName),
    middleName: hideIfDefined(identity.middleName),
    lastName: hideIfDefined(identity.lastName),
    address1: hideIfDefined(identity.address1),
    address2: hideIfDefined(identity.address2),
    address3: hideIfDefined(identity.address3),
    city: hideIfDefined(identity.city),
    state: hideIfDefined(identity.state),
    postalCode: hideIfDefined(identity.postalCode),
    country: hideIfDefined(identity.country),
    company: hideIfDefined(identity.company),
    email: hideIfDefined(identity.email),
    phone: hideIfDefined(identity.phone),
    ssn: hideIfDefined(identity.ssn),
    username: hideIfDefined(identity.username),
    passportNumber: hideIfDefined(identity.passportNumber),
    licenseNumber: hideIfDefined(identity.licenseNumber)
  };
}
function cleanCard(card) {
  if (!card) return void 0;
  return {
    brand: card.brand,
    cardholderName: hideIfDefined(card.cardholderName),
    number: hideIfDefined(card.number),
    expMonth: hideIfDefined(card.expMonth),
    expYear: hideIfDefined(card.expYear),
    code: hideIfDefined(card.code)
  };
}
function cleanPasswordHistory(passwordHistoryItems) {
  return passwordHistoryItems?.map((passwordHistory) => ({
    password: hideIfDefined(passwordHistory.password),
    lastUsedDate: hideIfDefined(passwordHistory.lastUsedDate)
  }));
}
function cleanSshKey(sshKey) {
  if (!sshKey) return void 0;
  return {
    publicKey: sshKey.publicKey,
    keyFingerprint: sshKey.keyFingerprint,
    privateKey: hideIfDefined(sshKey.privateKey)
  };
}
function hideIfDefined(value) {
  if (!value) return value;
  return SENSITIVE_VALUE_PLACEHOLDER;
}

// src/utils/hooks/useContentEncryptor.ts
var import_api23 = require("@raycast/api");
var import_crypto4 = require("crypto");
var import_react11 = require("react");
var ALGORITHM = "aes-256-cbc";
function useContentEncryptor() {
  const { clientSecret } = (0, import_api23.getPreferenceValues)();
  const cipherKeyBuffer = (0, import_react11.useMemo)(() => get32BitSecretKeyBuffer(clientSecret.trim()), [clientSecret]);
  const encrypt = (data) => {
    const ivBuffer = (0, import_crypto4.randomBytes)(16);
    const cipher = (0, import_crypto4.createCipheriv)(ALGORITHM, cipherKeyBuffer, ivBuffer);
    const encryptedContentBuffer = Buffer.concat([cipher.update(data), cipher.final()]);
    return { iv: ivBuffer.toString("hex"), content: encryptedContentBuffer.toString("hex") };
  };
  const decrypt = (content, iv) => {
    const decipher = (0, import_crypto4.createDecipheriv)(ALGORITHM, cipherKeyBuffer, Buffer.from(iv, "hex"));
    const decryptedContentBuffer = Buffer.concat([decipher.update(Buffer.from(content, "hex")), decipher.final()]);
    return decryptedContentBuffer.toString();
  };
  return { encrypt, decrypt };
}
function get32BitSecretKeyBuffer(key) {
  return Buffer.from((0, import_crypto4.createHash)("sha256").update(key).digest("base64").slice(0, 32));
}

// src/components/searchVault/utils/useVaultCaching.ts
function useVaultCaching() {
  const { encrypt, decrypt } = useContentEncryptor();
  const isCachingEnable = (0, import_api24.getPreferenceValues)().shouldCacheVaultItems;
  useOnceEffect_default(() => {
    if (!Cache.isEmpty) Cache.clear();
  }, !isCachingEnable);
  const getCachedVault = () => {
    try {
      if (!isCachingEnable) throw new VaultCachingNoEnabledError();
      const cachedIv = Cache.get(CACHE_KEYS.IV);
      const cachedEncryptedVault = Cache.get(CACHE_KEYS.VAULT);
      if (!cachedIv || !cachedEncryptedVault) throw new VaultCachingNoEnabledError();
      const decryptedVault = decrypt(cachedEncryptedVault, cachedIv);
      return JSON.parse(decryptedVault);
    } catch (error) {
      if (!(error instanceof VaultCachingNoEnabledError)) {
        captureException("Failed to decrypt cached vault", error);
      }
      return { items: [], folders: [] };
    }
  };
  const cacheVault = (items, folders) => {
    try {
      if (!isCachingEnable) throw new VaultCachingNoEnabledError();
      const vaultToEncrypt = JSON.stringify({
        items: prepareItemsForCache(items),
        folders: prepareFoldersForCache(folders)
      });
      const encryptedVault = encrypt(vaultToEncrypt);
      Cache.set(CACHE_KEYS.VAULT, encryptedVault.content);
      Cache.set(CACHE_KEYS.IV, encryptedVault.iv);
    } catch (error) {
      if (!(error instanceof VaultCachingNoEnabledError)) {
        captureException("Failed to cache vault", error);
      }
    }
  };
  return { getCachedVault, cacheVault };
}
var VaultCachingNoEnabledError = class extends Error {
};
var useVaultCaching_default = useVaultCaching;

// src/context/vault.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
var VaultContext = (0, import_react12.createContext)(null);
function getInitialState() {
  return { items: [], folders: [], isLoading: true };
}
var { syncOnLaunch } = (0, import_api25.getPreferenceValues)();
function VaultProvider(props) {
  const { children } = props;
  const session = useSession();
  const bitwarden = useBitwarden();
  const publishItems = useVaultItemPublisher();
  const { getCachedVault, cacheVault } = useVaultCaching_default();
  const [currentFolderId, setCurrentFolderId] = $c40d7eded38ca69c$export$14afb9e4c16377d3(CACHE_KEYS.CURRENT_FOLDER_ID, null);
  const [state, setState] = (0, import_react12.useReducer)(
    (previous, next) => ({ ...previous, ...next }),
    { ...getInitialState(), ...getCachedVault() }
  );
  useOnceEffect_default(() => {
    if (syncOnLaunch) {
      void syncItems({ isInitial: true });
    } else {
      void loadItems();
    }
  }, session.active && session.token);
  async function loadItems() {
    try {
      setState({ isLoading: true });
      let items = [];
      let folders = [];
      try {
        const [itemsResult, foldersResult] = await Promise.all([bitwarden.listItems(), bitwarden.listFolders()]);
        if (itemsResult.error) throw itemsResult.error;
        if (foldersResult.error) throw foldersResult.error;
        items = itemsResult.result;
        folders = foldersResult.result;
        items.sort(favoriteItemsFirstSorter);
      } catch (error) {
        publishItems(new FailedToLoadVaultItemsError());
        throw error;
      }
      setState({ items, folders });
      publishItems(items);
      cacheVault(items, folders);
    } catch (error) {
      await (0, import_api25.showToast)(import_api25.Toast.Style.Failure, "Failed to load vault items", getDisplayableErrorMessage(error));
      captureException("Failed to load vault items", error);
    } finally {
      setState({ isLoading: false });
    }
  }
  async function syncItems(props2) {
    const { isInitial = false } = props2 ?? {};
    const toast = await (0, import_api25.showToast)({
      title: "Syncing vault...",
      message: isInitial ? "Background task" : void 0,
      style: import_api25.Toast.Style.Animated
    });
    try {
      await bitwarden.sync();
      await loadItems();
      await toast.hide();
    } catch (error) {
      await bitwarden.logout();
      toast.style = import_api25.Toast.Style.Failure;
      toast.title = "Failed to sync vault";
      toast.message = getDisplayableErrorMessage(error);
    }
  }
  function setCurrentFolder(folderOrId) {
    setCurrentFolderId(typeof folderOrId === "string" ? folderOrId : folderOrId?.id);
  }
  function updateState(next) {
    const newState = typeof next === "function" ? next(state) : next;
    setState(newState);
    cacheVault(newState.items, newState.folders);
  }
  const memoizedValue = (0, import_react12.useMemo)(
    () => ({
      ...state,
      items: filterItemsByFolderId(state.items, currentFolderId),
      isEmpty: state.items.length == 0,
      isLoading: state.isLoading || session.isLoading,
      currentFolderId,
      syncItems,
      loadItems,
      setCurrentFolder,
      updateState
    }),
    [state, session.isLoading, currentFolderId, syncItems, loadItems, setCurrentFolder, updateState]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(VaultContext.Provider, { value: memoizedValue, children });
}
function filterItemsByFolderId(items, folderId) {
  if (!folderId || folderId === FOLDER_OPTIONS.ALL) return items;
  if (folderId === FOLDER_OPTIONS.NO_FOLDER) return items.filter((item) => item.folderId === null);
  return items.filter((item) => item.folderId === folderId);
}
function favoriteItemsFirstSorter(a, b) {
  if (a.favorite && b.favorite) return 0;
  return a.favorite ? -1 : 1;
}
var useVaultContext = () => {
  const context = (0, import_react12.useContext)(VaultContext);
  if (context == null) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
};

// src/components/actions/VaultActionsSection.tsx
var import_jsx_runtime16 = require("react/jsx-runtime");
function VaultActionsSection() {
  const vault = useVaultContext();
  const bitwarden = useBitwarden();
  const handleLockVault = async () => {
    const toast = await (0, import_api26.showToast)({ title: "Locking vault...", message: "Please wait", style: import_api26.Toast.Style.Animated });
    try {
      await bitwarden.lock({ reason: VAULT_LOCK_MESSAGES.MANUAL });
      toast.style = import_api26.Toast.Style.Success;
      toast.title = "Vault Locked";
      toast.message = void 0;
    } catch (error) {
      toast.style = import_api26.Toast.Style.Failure;
      toast.title = "Failed to lock vault";
      toast.message = void 0;
    }
  };
  const handleLogoutVault = async () => {
    const toast = await (0, import_api26.showToast)({ title: "Logging out...", message: "Please wait", style: import_api26.Toast.Style.Animated });
    try {
      await bitwarden.logout();
      toast.style = import_api26.Toast.Style.Success;
      toast.title = "Logged Out";
      toast.message = void 0;
    } catch (error) {
      toast.style = import_api26.Toast.Style.Failure;
      toast.title = "Failed to logout";
      toast.message = void 0;
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(import_api26.ActionPanel.Section, { title: "Vault Actions", children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      import_api26.Action,
      {
        title: "Sync Vault",
        shortcut: { macOS: { key: "r", modifiers: ["opt"] }, Windows: { key: "r", modifiers: ["alt"] } },
        icon: import_api26.Icon.ArrowClockwise,
        onAction: vault.syncItems
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      import_api26.Action,
      {
        icon: { source: "sf_symbols_lock.svg", tintColor: import_api26.Color.PrimaryText },
        title: "Lock Vault",
        shortcut: {
          macOS: { key: "l", modifiers: ["opt", "shift"] },
          Windows: { key: "l", modifiers: ["alt", "shift"] }
        },
        onAction: handleLockVault
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_api26.Action, { style: import_api26.Action.Style.Destructive, title: "Logout", icon: import_api26.Icon.Logout, onAction: handleLogoutVault })
  ] });
}

// src/components/TroubleshootingGuide.tsx
var import_jsx_runtime17 = require("react/jsx-runtime");
var LINE_BREAK = "\n\n";
var CLI_INSTALLATION_HELP_URL = "https://bitwarden.com/help/cli/#download-and-install";
var getCodeBlock = (content) => `\`\`\`
${content}
\`\`\``;
var TroubleshootingGuide = ({ error }) => {
  const errorString = getErrorString(error);
  const localCliPath = (0, import_api27.getPreferenceValues)().cliPath;
  const isCliDownloadError = error instanceof EnsureCliBinError;
  const needsToInstallCli = localCliPath || error instanceof InstalledCLINotFoundError;
  const messages = [];
  if (needsToInstallCli && !isCliDownloadError) {
    messages.push("# \u26A0\uFE0F Bitwarden CLI not found");
  } else {
    messages.push("# \u{1F4A5} Whoops! Something went wrong");
  }
  if (isCliDownloadError) {
    messages.push(
      `We couldn't download the [Bitwarden CLI](${CLI_INSTALLATION_HELP_URL}), you can always install it on your machine.`
    );
  } else if (needsToInstallCli) {
    const cliPathString = localCliPath ? ` (${localCliPath})` : "";
    messages.push(
      `We couldn't find the [Bitwarden CLI](${CLI_INSTALLATION_HELP_URL}) installed on your machine${cliPathString}.`
    );
  } else {
    messages.push(`The \`${import_api27.environment.commandName}\` command crashed when we were not expecting it to.`);
  }
  messages.push(
    "> Please read the `Setup` section in the [extension's description](https://www.raycast.com/jomifepe/bitwarden) to ensure that everything is properly configured."
  );
  messages.push(
    `**Try restarting the command. If the issue persists, consider [reporting a bug on GitHub](${BUG_REPORT_URL}) to help us fix it.**`
  );
  if (errorString) {
    const isArchError = /incompatible architecture/gi.test(errorString);
    messages.push(
      ">## Technical details \u{1F913}",
      isArchError && `\u26A0\uFE0F We suspect that your Bitwarden CLI was installed using a version of NodeJS that's incompatible with your system architecture (e.g. x64 NodeJS on a M1/Apple Silicon Mac). Please make sure your have the correct versions of your software installed (e.g., ${platform === "macos" ? "Homebrew, " : ""}NodeJS, and Bitwarden CLI).`,
      getCodeBlock(errorString)
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
    import_api27.Detail,
    {
      markdown: messages.filter(Boolean).join(LINE_BREAK),
      actions: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(import_api27.ActionPanel, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(import_api27.ActionPanel.Section, { title: "Bug Report", children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(BugReportOpenAction_default, {}),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(BugReportCollectDataAction_default, {})
        ] }),
        needsToInstallCli && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_api27.Action.OpenInBrowser, { title: "Open Installation Guide", url: CLI_INSTALLATION_HELP_URL })
      ] })
    }
  );
};
var TroubleshootingGuide_default = TroubleshootingGuide;

// src/components/RootErrorBoundary.tsx
var import_jsx_runtime18 = require("react/jsx-runtime");
var RootErrorBoundary = class extends import_react13.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  async componentDidCatch(error, errorInfo) {
    if (error instanceof ManuallyThrownError) {
      this.setState((state) => ({ ...state, hasError: true, error: error.message }));
      await (0, import_api28.showToast)(import_api28.Toast.Style.Failure, error.message);
    } else {
      if (import_api28.environment.isDevelopment) {
        this.setState((state) => ({ ...state, hasError: true, error: error.message }));
      }
      console.error("Error:", error, errorInfo);
    }
  }
  render() {
    try {
      if (this.state.hasError) return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(TroubleshootingGuide_default, { error: this.state.error });
      return this.props.children;
    } catch {
      return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(TroubleshootingGuide_default, {});
    }
  }
};

// src/components/searchVault/Item.tsx
var import_api54 = require("@raycast/api");

// src/components/searchVault/ItemActionPanel.tsx
var import_api50 = require("@raycast/api");

// src/components/ComponentReverser.tsx
var import_react14 = require("react");
var import_jsx_runtime19 = require("react/jsx-runtime");
var ComponentReverser = (props) => {
  const children = import_react14.Children.toArray(props.children);
  if (props.reverse) children.reverse();
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_jsx_runtime19.Fragment, { children });
};
var ComponentReverser_default = ComponentReverser;

// src/components/searchVault/actions/CopyPasswordAction.tsx
var import_api31 = require("@raycast/api");

// src/components/searchVault/utils/useGetUpdatedVaultItem.ts
var import_api29 = require("@raycast/api");
function useGetUpdatedVaultItem() {
  const bitwarden = useBitwarden();
  const waitForItemLoaded = useVaultItemSubscriber();
  async function getItemFromVault(id) {
    const itemsResult = await bitwarden.getItem(id);
    if (itemsResult.error) throw itemsResult.error;
    return itemsResult.result;
  }
  async function getItem(possiblyCachedItem, selector = ((item) => item), loadingMessage) {
    const currentValue = selector(possiblyCachedItem);
    if (!valueHasSensitiveValuePlaceholder(currentValue)) return currentValue;
    const toast = loadingMessage ? await (0, import_api29.showToast)(import_api29.Toast.Style.Animated, loadingMessage) : void 0;
    const value = selector(
      await Promise.race([waitForItemLoaded(possiblyCachedItem.id), getItemFromVault(possiblyCachedItem.id)])
    );
    await toast?.hide();
    return value;
  }
  return getItem;
}
function valueHasSensitiveValuePlaceholder(value) {
  try {
    if (typeof value === "object") return JSON.stringify(value).includes(SENSITIVE_VALUE_PLACEHOLDER);
    if (typeof value === "string") return value === SENSITIVE_VALUE_PLACEHOLDER;
    return false;
  } catch (error) {
    return false;
  }
}
var useGetUpdatedVaultItem_default = useGetUpdatedVaultItem;

// src/utils/clipboard.ts
var import_api30 = require("@raycast/api");

// src/utils/strings.ts
var capitalize = (value, lowercaseRest = false) => {
  const firstLetter = value.charAt(0).toUpperCase();
  const rest = lowercaseRest ? value.slice(1).toLowerCase() : value.slice(1);
  return firstLetter + rest;
};

// src/utils/clipboard.ts
async function showCopySuccessMessage(title, message) {
  const action = (0, import_api30.getPreferenceValues)().windowActionOnCopy;
  const messageTitle = capitalize(title, true);
  if (action === "keepOpen") {
    await (0, import_api30.showToast)({ title: messageTitle, message, style: import_api30.Toast.Style.Success });
  } else if (action === "closeAndPopToRoot") {
    await (0, import_api30.showHUD)(messageTitle);
    await (0, import_api30.popToRoot)();
  } else {
    await (0, import_api30.showHUD)(messageTitle);
  }
}

// src/components/searchVault/actions/CopyPasswordAction.tsx
var import_jsx_runtime20 = require("react/jsx-runtime");
function CopyPasswordAction() {
  const selectedItem = useSelectedVaultItem();
  const getUpdatedVaultItem = useGetUpdatedVaultItem_default();
  if (!selectedItem.login?.password) return null;
  const handleCopyPassword = async () => {
    try {
      const password = await getUpdatedVaultItem(selectedItem, (item) => item.login?.password, "Getting password...");
      if (password) {
        await import_api31.Clipboard.copy(password, { transient: getTransientCopyPreference("password") });
        await showCopySuccessMessage("Copied password to clipboard");
      }
    } catch (error) {
      await (0, import_api31.showToast)(import_api31.Toast.Style.Failure, "Failed to get password");
      captureException("Failed to copy password", error);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
    ActionWithReprompt_default,
    {
      title: "Copy Password",
      icon: import_api31.Icon.Key,
      onAction: handleCopyPassword,
      repromptDescription: `Copying the password of <${selectedItem.name}>`
    }
  );
}
var CopyPasswordAction_default = CopyPasswordAction;

// src/components/searchVault/actions/PastePasswordAction.tsx
var import_api33 = require("@raycast/api");

// src/utils/hooks/useFrontmostApplicationName.ts
var import_api32 = require("@raycast/api");
var import_react15 = require("react");
function useFrontmostApplicationName() {
  const [currentApplication, setCurrentApplication] = (0, import_react15.useState)(void 0);
  (0, import_react15.useEffect)(() => {
    void (0, import_api32.getFrontmostApplication)().then((application) => setCurrentApplication(application.name)).catch(() => setCurrentApplication(void 0));
  }, []);
  return currentApplication;
}

// src/components/searchVault/actions/PastePasswordAction.tsx
var import_jsx_runtime21 = require("react/jsx-runtime");
function PastePasswordAction() {
  const selectedItem = useSelectedVaultItem();
  const getUpdatedVaultItem = useGetUpdatedVaultItem_default();
  const actionTitle = useActionTitle();
  if (!selectedItem.login?.password) return null;
  const pastePassword = async () => {
    try {
      const password = await getUpdatedVaultItem(selectedItem, (item) => item.login?.password, "Getting password...");
      if (password) await import_api33.Clipboard.paste(password);
    } catch (error) {
      await (0, import_api33.showToast)(import_api33.Toast.Style.Failure, "Failed to get password");
      captureException("Failed to paste password", error);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    ActionWithReprompt_default,
    {
      title: actionTitle,
      icon: import_api33.Icon.Window,
      onAction: pastePassword,
      repromptDescription: `Pasting the password of <${selectedItem.name}>`
    }
  );
}
function useActionTitle() {
  const currentApplication = useFrontmostApplicationName();
  return currentApplication ? `Paste Password into ${currentApplication}` : "Paste Password";
}
var PastePasswordAction_default = PastePasswordAction;

// src/components/searchVault/actions/CopyTotpAction.tsx
var import_api34 = require("@raycast/api");
var import_jsx_runtime22 = require("react/jsx-runtime");
function CopyTotpAction() {
  const bitwarden = useBitwarden();
  const selectedItem = useSelectedVaultItem();
  const getUpdatedVaultItem = useGetUpdatedVaultItem_default();
  if (!selectedItem.login?.totp) return null;
  const copyTotp = async () => {
    const toast = await (0, import_api34.showToast)(import_api34.Toast.Style.Animated, "Getting TOTP code...");
    try {
      const id = await getUpdatedVaultItem(selectedItem, (item) => item.id);
      const { error, result: totp } = await bitwarden.getTotp(id);
      if (error) throw error;
      await toast?.hide();
      await import_api34.Clipboard.copy(totp, { transient: getTransientCopyPreference("other") });
      await showCopySuccessMessage("Copied code to clipboard");
    } catch (error) {
      toast.message = "Failed to get TOTP";
      toast.style = import_api34.Toast.Style.Failure;
      captureException("Failed to copy TOTP", error);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
    ActionWithReprompt_default,
    {
      title: "Copy TOTP",
      icon: import_api34.Icon.Clipboard,
      onAction: copyTotp,
      shortcut: { macOS: { key: "t", modifiers: ["opt"] }, Windows: { key: "t", modifiers: ["alt"] } },
      repromptDescription: `Copying the TOTP of <${selectedItem.name}>`
    }
  );
}
var CopyTotpAction_default = CopyTotpAction;

// src/components/searchVault/actions/PasteTotpAction.tsx
var import_api35 = require("@raycast/api");
var import_jsx_runtime23 = require("react/jsx-runtime");
function PasteTotpAction() {
  const bitwarden = useBitwarden();
  const selectedItem = useSelectedVaultItem();
  const getUpdatedVaultItem = useGetUpdatedVaultItem_default();
  const currentApplicationName = useFrontmostApplicationName();
  if (!selectedItem.login?.totp) return null;
  const pasteTotp = async () => {
    const toast = await (0, import_api35.showToast)(import_api35.Toast.Style.Animated, "Getting TOTP code...");
    try {
      const id = await getUpdatedVaultItem(selectedItem, (item) => item.id);
      const { error, result: totp } = await bitwarden.getTotp(id);
      if (error) throw error;
      await toast?.hide();
      await import_api35.Clipboard.paste(totp);
    } catch (error) {
      toast.message = "Failed to get TOTP";
      toast.style = import_api35.Toast.Style.Failure;
      captureException("Failed to paste TOTP", error);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
    ActionWithReprompt_default,
    {
      title: currentApplicationName ? `Paste TOTP into ${currentApplicationName}` : "Paste TOTP",
      icon: import_api35.Icon.Window,
      onAction: pasteTotp,
      shortcut: {
        macOS: { key: "t", modifiers: ["opt", "shift"] },
        Windows: { key: "t", modifiers: ["alt", "shift"] }
      },
      repromptDescription: `Pasting the TOTP of <${selectedItem.name}>`
    }
  );
}
var PasteTotpAction_default = PasteTotpAction;

// src/components/searchVault/actions/CopyUsernameAction.tsx
var import_api36 = require("@raycast/api");
var import_jsx_runtime24 = require("react/jsx-runtime");
function CopyUsernameAction() {
  const selectedItem = useSelectedVaultItem();
  const getUpdatedVaultItem = useGetUpdatedVaultItem_default();
  if (!selectedItem.login?.username) return null;
  const handleCopyUsername = async () => {
    try {
      const username = await getUpdatedVaultItem(selectedItem, (item) => item.login?.username, "Getting username...");
      if (username) {
        await import_api36.Clipboard.copy(username, { transient: getTransientCopyPreference("other") });
        await showCopySuccessMessage("Copied username to clipboard");
      }
    } catch (error) {
      await (0, import_api36.showToast)(import_api36.Toast.Style.Failure, "Failed to get username");
      captureException("Failed to copy username", error);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
    import_api36.Action,
    {
      title: "Copy Username",
      icon: import_api36.Icon.Person,
      onAction: handleCopyUsername,
      shortcut: { macOS: { key: "u", modifiers: ["opt"] }, Windows: { key: "u", modifiers: ["alt"] } }
    }
  );
}
var CopyUsernameAction_default = CopyUsernameAction;

// src/components/searchVault/actions/PasteUsernameAction.tsx
var import_api37 = require("@raycast/api");
var import_jsx_runtime25 = require("react/jsx-runtime");
function PasteUsernameAction() {
  const selectedItem = useSelectedVaultItem();
  const getUpdatedVaultItem = useGetUpdatedVaultItem_default();
  const currentApplication = useFrontmostApplicationName();
  if (!selectedItem.login?.username) return null;
  const pasteUsername = async () => {
    try {
      const username = await getUpdatedVaultItem(selectedItem, (item) => item.login?.username, "Getting username...");
      if (username) await import_api37.Clipboard.paste(username);
    } catch (error) {
      await (0, import_api37.showToast)(import_api37.Toast.Style.Failure, "Failed to get username");
      captureException("Failed to paste username", error);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
    ActionWithReprompt_default,
    {
      title: currentApplication ? `Paste Username into ${currentApplication}` : "Paste Username",
      icon: import_api37.Icon.Window,
      onAction: pasteUsername,
      repromptDescription: `Pasting the username of <${selectedItem.name}>`,
      shortcut: {
        macOS: { key: "u", modifiers: ["cmd", "opt"] },
        Windows: { key: "u", modifiers: ["ctrl", "alt"] }
      }
    }
  );
}
var PasteUsernameAction_default = PasteUsernameAction;

// src/components/searchVault/actions/OpenUrlInBrowserAction.tsx
var import_api38 = require("@raycast/api");
var import_jsx_runtime26 = require("react/jsx-runtime");
function OpenUrlInBrowserAction() {
  const selectedItem = useSelectedVaultItem();
  const getUpdatedVaultItem = useGetUpdatedVaultItem_default();
  if (!getUri(selectedItem)) return null;
  const handleOpenUrlInBrowser = async () => {
    try {
      const mainUri = await getUpdatedVaultItem(selectedItem, getUri, "Getting URL...");
      if (mainUri) await (0, import_api38.open)(mainUri);
    } catch (error) {
      await (0, import_api38.showToast)(import_api38.Toast.Style.Failure, "Failed to get URL");
      captureException("Failed to open URL in browser", error);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
    import_api38.Action,
    {
      title: "Open in Browser",
      onAction: handleOpenUrlInBrowser,
      icon: import_api38.Icon.Globe,
      shortcut: { macOS: { key: "o", modifiers: ["opt"] }, Windows: { key: "o", modifiers: ["alt"] } }
    }
  );
}
function getUri(item) {
  return item.login?.uris?.[0]?.uri;
}
var OpenUrlInBrowserAction_default = OpenUrlInBrowserAction;

// src/components/searchVault/actions/ShowCardDetailsAction.tsx
var import_api40 = require("@raycast/api");

// src/utils/cards.ts
var MONTH_NUMBER_TO_LABEL_MAP = {
  1: "01 - January",
  2: "02 - February",
  3: "03 - March",
  4: "04 - April",
  5: "05 - May",
  6: "06 - June",
  7: "07 - July",
  8: "08 - August",
  9: "09 - September",
  10: "10 - October",
  11: "11 - November",
  12: "12 - December"
};
var CARD_MAPPER = {
  expMonth: (value) => MONTH_NUMBER_TO_LABEL_MAP[value] ?? value
};
var getCardValue = (key, value) => {
  return CARD_MAPPER[key]?.(value) ?? value;
};
function getCardDetailsMarkdown(itemName, card) {
  return `# \u{1F4B3} ${itemName}
&nbsp;
| ${platform === "macos" ? "\u2325" : "Alt"}	**Field** | **Value** |
| --- | --- |
${Object.entries(card).map(([key, value], index) => {
    if (!value) return null;
    const label = CARD_KEY_LABEL[key];
    const shortcutKey = SHORTCUT_KEY_SEQUENCE[index];
    return `| ${shortcutKey ? `${shortcutKey}.` : "&nbsp;"}	**${label}** | ${getCardValue(key, value)} |`;
  }).filter(Boolean).join("\n")}
`;
}
function getCardDetailsCopyValue(card) {
  return Object.entries(card).map(([key, value]) => value ? `${CARD_KEY_LABEL[key]}: ${getCardValue(key, value)}` : null).filter(Boolean).join("\n");
}
var CARD_KEY_LABEL_KEYS = Object.keys(CARD_KEY_LABEL);
function cardBitwardenPageFieldOrderSorter([a], [b]) {
  const aIndex = CARD_KEY_LABEL_KEYS.indexOf(Array.isArray(a) ? a[0] : a);
  const bIndex = CARD_KEY_LABEL_KEYS.indexOf(Array.isArray(b) ? b[0] : b);
  return aIndex - bIndex;
}
var BASE_CARD_IMAGE_URL = "https://vault.bitwarden.com/images";
var CARD_BRANDS_TO_IMAGE_URL_MAP = {
  [CARD_BRANDS.VISA]: `${BASE_CARD_IMAGE_URL}/visa-light.png`,
  [CARD_BRANDS.MASTERCARD]: `${BASE_CARD_IMAGE_URL}/mastercard-light.png`,
  [CARD_BRANDS.AMEX]: `${BASE_CARD_IMAGE_URL}/amex-light.png`,
  [CARD_BRANDS.DISCOVER]: `${BASE_CARD_IMAGE_URL}/discover-light.png`,
  [CARD_BRANDS.DINERS_CLUB]: `${BASE_CARD_IMAGE_URL}/diners_club-light.png`,
  [CARD_BRANDS.JCB]: `${BASE_CARD_IMAGE_URL}/jcb-light.png`,
  [CARD_BRANDS.MAESTRO]: `${BASE_CARD_IMAGE_URL}/maestro-light.png`,
  [CARD_BRANDS.UNION_PAY]: `${BASE_CARD_IMAGE_URL}/union_pay-light.png`,
  [CARD_BRANDS.RU_PAY]: `${BASE_CARD_IMAGE_URL}/ru_pay-light.png`
};
function getCardImageUrl(brand) {
  return CARD_BRANDS_TO_IMAGE_URL_MAP[brand];
}

// src/components/searchVault/actions/shared/ShowDetailsScreen.tsx
var import_api39 = require("@raycast/api");
var import_react16 = require("react");
var import_jsx_runtime27 = require("react/jsx-runtime");
function ShowDetailsScreen(props) {
  const { itemName, details, sorter, label, getMarkdown, getCopyValue, titleMap } = props;
  const capitalizedLabel = capitalize(label, true);
  const handleCopyField = (value) => async () => {
    await import_api39.Clipboard.copy(value, { transient: getTransientCopyPreference("other") });
    await showCopySuccessMessage("Copied details to clipboard");
  };
  const { sortedDetails, sortedDetailsEntries } = (0, import_react16.useMemo)(() => {
    if (!sorter) return { sortedDetails: details, sortedDetailsEntries: Object.entries(details) };
    const sortedEntries = Object.entries(details).sort(sorter);
    return {
      sortedDetails: Object.fromEntries(sortedEntries),
      sortedDetailsEntries: sortedEntries
    };
  }, [details]);
  const copyDetails = async () => {
    await import_api39.Clipboard.copy(getCopyValue(sortedDetails), { transient: getTransientCopyPreference("other") });
    await showCopySuccessMessage(`Copied ${label} details to clipboard`);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
    import_api39.Detail,
    {
      markdown: getMarkdown(itemName, sortedDetails),
      actions: /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(import_api39.ActionPanel, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(import_api39.ActionPanel.Section, { children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(import_api39.Action, { title: `Copy ${capitalizedLabel} Details`, onAction: copyDetails }) }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(import_api39.ActionPanel.Section, { title: `${capitalizedLabel} Fields`, children: sortedDetailsEntries.map(([fieldKey, content], index) => {
          if (!content) return null;
          const shortcutKey = SHORTCUT_KEY_SEQUENCE[index];
          return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
            import_api39.Action,
            {
              title: `Copy ${getTitle(fieldKey, titleMap)}`,
              icon: import_api39.Icon.Clipboard,
              onAction: handleCopyField(content),
              shortcut: shortcutKey ? {
                macOS: { key: shortcutKey, modifiers: ["opt"] },
                Windows: { key: shortcutKey, modifiers: ["alt"] }
              } : void 0
            },
            `${index}-${fieldKey}`
          );
        }) })
      ] })
    }
  );
}
function getTitle(fieldKey, titleMap) {
  if (!titleMap) return capitalize(fieldKey, true);
  if (typeof titleMap === "function") return titleMap(fieldKey);
  return titleMap[fieldKey];
}
var ShowDetailsScreen_default = ShowDetailsScreen;

// src/components/searchVault/actions/ShowCardDetailsAction.tsx
var import_jsx_runtime28 = require("react/jsx-runtime");
function ShowCardDetailsAction() {
  const { push } = (0, import_api40.useNavigation)();
  const selectedItem = useSelectedVaultItem();
  const getUpdatedVaultItem = useGetUpdatedVaultItem_default();
  if (!selectedItem.card) return null;
  const showCardDetails = async () => {
    try {
      const card = await getUpdatedVaultItem(selectedItem, (item) => item.card, "Getting card details...");
      if (card) {
        push(
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
            ShowDetailsScreen_default,
            {
              label: "Card",
              details: card,
              itemName: selectedItem.name,
              titleMap: CARD_KEY_LABEL,
              sorter: cardBitwardenPageFieldOrderSorter,
              getMarkdown: getCardDetailsMarkdown,
              getCopyValue: getCardDetailsCopyValue
            }
          )
        );
      }
    } catch (error) {
      await (0, import_api40.showToast)(import_api40.Toast.Style.Failure, "Failed to get card details");
      captureException("Failed to show card details", error);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
    ActionWithReprompt_default,
    {
      title: "Show Card",
      icon: import_api40.Icon.Eye,
      onAction: showCardDetails,
      repromptDescription: `Showing the card details of <${selectedItem.name}>`
    }
  );
}
var ShowCardDetailsAction_default = ShowCardDetailsAction;

// src/components/searchVault/actions/ShowIdentityDetailsAction.tsx
var import_api41 = require("@raycast/api");

// src/utils/identity.ts
function getIdentityDetailsMarkdown(itemName, identity) {
  return `# \u{1FAAA} ${itemName}
&nbsp;
| ${platform === "macos" ? "\u2325" : "Alt"}	**Field** | **Value** |
| --- | --- |
${Object.entries(identity).map(([key, value], index) => {
    if (!value) return null;
    const label = IDENTITY_KEY_LABEL[key];
    const shortcutKey = SHORTCUT_KEY_SEQUENCE[index];
    return `| ${shortcutKey ? `${shortcutKey}.` : "&nbsp;"}	**${label}** | ${value} |`;
  }).filter(Boolean).join("\n")}
`;
}
function getIdentityDetailsCopyValue(identity) {
  return Object.entries(identity).map(([key, value]) => value ? `${IDENTITY_KEY_LABEL[key]}: ${value}` : null).filter(Boolean).join("\n");
}
var IDENTITY_KEY_LABEL_KEYS = Object.keys(IDENTITY_KEY_LABEL);
function identityFormOrderSorter([a], [b]) {
  const aIndex = IDENTITY_KEY_LABEL_KEYS.indexOf(Array.isArray(a) ? a[0] : a);
  const bIndex = IDENTITY_KEY_LABEL_KEYS.indexOf(Array.isArray(b) ? b[0] : b);
  return aIndex - bIndex;
}

// src/components/searchVault/actions/ShowIdentityDetailsAction.tsx
var import_jsx_runtime29 = require("react/jsx-runtime");
function ShowIdentityDetailsAction() {
  const { push } = (0, import_api41.useNavigation)();
  const selectedItem = useSelectedVaultItem();
  const getUpdatedVaultItem = useGetUpdatedVaultItem_default();
  if (!selectedItem.identity) return null;
  const showIdentityDetails = async () => {
    try {
      const identity = await getUpdatedVaultItem(selectedItem, (item) => item.identity, "Getting identity details...");
      if (identity) {
        push(
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
            ShowDetailsScreen_default,
            {
              label: "Identity",
              details: identity,
              itemName: selectedItem.name,
              titleMap: IDENTITY_KEY_LABEL,
              sorter: identityFormOrderSorter,
              getMarkdown: getIdentityDetailsMarkdown,
              getCopyValue: getIdentityDetailsCopyValue
            }
          )
        );
      }
    } catch (error) {
      await (0, import_api41.showToast)(import_api41.Toast.Style.Failure, "Failed to get identity details");
      captureException("Failed to show identity details", error);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
    ActionWithReprompt_default,
    {
      title: "Show Identity",
      icon: import_api41.Icon.Eye,
      onAction: showIdentityDetails,
      repromptDescription: `Showing the identity details of <${selectedItem.name}>`
    }
  );
}
var ShowIdentityDetailsAction_default = ShowIdentityDetailsAction;

// src/components/searchVault/actions/ShowNotesAction.tsx
var import_api42 = require("@raycast/api");
var import_jsx_runtime30 = require("react/jsx-runtime");
function ShowNotesAction() {
  const { push } = (0, import_api42.useNavigation)();
  const selectedItem = useSelectedVaultItem();
  const getUpdatedVaultItem = useGetUpdatedVaultItem_default();
  if (!selectedItem.notes) return null;
  const showNotes = async () => {
    try {
      const notes = await getUpdatedVaultItem(selectedItem, (item) => item.notes, "Getting notes...");
      if (notes) push(/* @__PURE__ */ (0, import_jsx_runtime30.jsx)(DetailsScreen, { itemName: selectedItem.name, notes }));
    } catch (error) {
      await (0, import_api42.showToast)(import_api42.Toast.Style.Failure, "Failed to get notes");
      captureException("Failed to show notes", error);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
    ActionWithReprompt_default,
    {
      title: "Show Notes",
      icon: import_api42.Icon.Eye,
      onAction: showNotes,
      repromptDescription: `Showing the notes of <${selectedItem.name}>`,
      shortcut: { macOS: { key: "n", modifiers: ["opt"] }, Windows: { key: "n", modifiers: ["alt"] } }
    }
  );
}
function DetailsScreen({ itemName, notes }) {
  const handleCopy = async () => {
    await import_api42.Clipboard.copy(notes, { transient: getTransientCopyPreference("other") });
    await showCopySuccessMessage("Copied notes to clipboard");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
    import_api42.Detail,
    {
      markdown: getNotesDetailsMarkdown(itemName, notes),
      actions: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(import_api42.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(import_api42.Action, { title: "Copy Notes", onAction: handleCopy, icon: import_api42.Icon.Clipboard }) })
    }
  );
}
function getNotesDetailsMarkdown(itemName, notes) {
  return `# \u{1F4C4} ${itemName}
&nbsp;
\`\`\`
${notes}
\`\`\`
`;
}
var ShowNotesAction_default = ShowNotesAction;

// src/components/searchVault/actions/shared/CopyObjectFieldsActions.tsx
var import_api43 = require("@raycast/api");
var import_jsx_runtime31 = require("react/jsx-runtime");
function CopyObjectStringFieldsActions({
  selector,
  sorter,
  labelMapper
}) {
  const selectedItem = useSelectedVaultItem();
  const getUpdatedVaultItem = useGetUpdatedVaultItem_default();
  const selectedItemEntries = getItemObjectEntries(selectedItem, selector, sorter);
  if (!selectedItemEntries) return null;
  const handleCopyField = (field, label) => async () => {
    try {
      const value = await getUpdatedVaultItem(selectedItem, (item) => selector(item)?.[field], `Getting ${field}...`);
      if (typeof value !== "string") throw new Error(`Value of ${field} is not a string`);
      if (value) {
        await import_api43.Clipboard.copy(value, { transient: getTransientCopyPreference("other") });
        await showCopySuccessMessage(`Copied ${label} to clipboard`);
      }
    } catch (error) {
      await (0, import_api43.showToast)(import_api43.Toast.Style.Failure, `Failed to copy ${field}`);
      captureException(`Failed to copy ${field}`, error);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(import_jsx_runtime31.Fragment, { children: selectedItemEntries.map(([key, value], index) => {
    if (!value || typeof value !== "string") return null;
    const label = labelMapper?.(key) ?? capitalize(key);
    return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
      ActionWithReprompt_default,
      {
        title: `Copy ${label}`,
        icon: import_api43.Icon.Clipboard,
        onAction: handleCopyField(key, label),
        repromptDescription: `Copying the ${label} of <${selectedItem.name}>`
      },
      `${index}-${key}`
    );
  }) });
}
function getItemObjectEntries(selectedItem, selector, sorter) {
  const value = selector(selectedItem);
  if (value == null) return null;
  const itemEntries = Object.entries(value);
  if (sorter) itemEntries.sort(sorter);
  return itemEntries;
}
var CopyObjectFieldsActions_default = CopyObjectStringFieldsActions;

// src/components/searchVault/actions/CopyIdentityFieldsActions.tsx
var import_jsx_runtime32 = require("react/jsx-runtime");
function CopyIdentityFieldsActions() {
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
    CopyObjectFieldsActions_default,
    {
      selector: (item) => item.identity,
      sorter: identityFormOrderSorter,
      labelMapper: (field) => IDENTITY_KEY_LABEL[field]
    }
  );
}
var CopyIdentityFieldsActions_default = CopyIdentityFieldsActions;

// src/components/searchVault/actions/CopyCardFieldsActions.tsx
var import_jsx_runtime33 = require("react/jsx-runtime");
function CopyCardFieldsActions() {
  return /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
    CopyObjectFieldsActions_default,
    {
      selector: (item) => item.card,
      sorter: cardBitwardenPageFieldOrderSorter,
      labelMapper: (field) => CARD_KEY_LABEL[field]
    }
  );
}
var CopyCardFieldsActions_default = CopyCardFieldsActions;

// src/components/searchVault/actions/CopyLoginUrisActions.tsx
var import_jsx_runtime34 = require("react/jsx-runtime");
function CopyLoginUrisActions() {
  const getUriMap = (item) => {
    return item.login?.uris?.reduce((result, uri, index) => {
      if (!uri.uri) return result;
      result[`URI ${index + 1}`] = uri.uri;
      return result;
    }, {}) ?? {};
  };
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(CopyObjectFieldsActions_default, { selector: getUriMap });
}
var CopyLoginUrisActions_default = CopyLoginUrisActions;

// src/components/searchVault/actions/CopyNotesAction.tsx
var import_api44 = require("@raycast/api");
var import_jsx_runtime35 = require("react/jsx-runtime");

// src/components/searchVault/actions/CopyCustomFieldsActions.tsx
var import_jsx_runtime36 = require("react/jsx-runtime");
function CopyCustomFieldsActions() {
  const getFieldMap = (item) => {
    return Object.fromEntries(item.fields?.map((field) => [field.name, field.value]) || []);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(CopyObjectFieldsActions_default, { selector: getFieldMap });
}
var CopyCustomFieldsActions_default = CopyCustomFieldsActions;

// src/components/searchVault/actions/CopyPublicKeyAction.tsx
var import_api45 = require("@raycast/api");
var import_jsx_runtime37 = require("react/jsx-runtime");
function CopyPublicKeyAction() {
  const selectedItem = useSelectedVaultItem();
  const getUpdatedVaultItem = useGetUpdatedVaultItem_default();
  if (!selectedItem.sshKey?.publicKey) return null;
  const handleCopyPublicKey = async () => {
    try {
      const publicKey = await getUpdatedVaultItem(
        selectedItem,
        (item) => item.sshKey?.publicKey,
        "Getting public key..."
      );
      if (publicKey) {
        await import_api45.Clipboard.copy(publicKey, { transient: getTransientCopyPreference("other") });
        await showCopySuccessMessage("Copied public key to clipboard");
      }
    } catch (error) {
      await (0, import_api45.showToast)(import_api45.Toast.Style.Failure, "Failed to get public key");
      captureException("Failed to copy public key", error);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
    ActionWithReprompt_default,
    {
      title: "Copy Public Key",
      icon: import_api45.Icon.Key,
      onAction: handleCopyPublicKey,
      repromptDescription: `Copying the public key of <${selectedItem.name}>`
    }
  );
}
var CopyPublicKeyAction_default = CopyPublicKeyAction;

// src/components/searchVault/actions/FavoriteItemActions.tsx
var import_api47 = require("@raycast/api");

// src/context/favorites.tsx
var import_api46 = require("@raycast/api");
var import_react18 = require("react");

// src/utils/hooks/useAsyncEffect.ts
var import_react17 = require("react");
function useAsyncEffect(effect, deps) {
  (0, import_react17.useEffect)(() => {
    void effect();
  }, deps);
}

// src/context/favorites.tsx
var import_jsx_runtime38 = require("react/jsx-runtime");
var FavoritesContext = (0, import_react18.createContext)({});
function FavoritesProvider({ children }) {
  const { items } = useVaultContext();
  const [favoriteOrder, setFavoriteOrder] = (0, import_react18.useState)();
  useAsyncEffect(async () => {
    const serializedFavoriteOrder = await getSavedFavoriteOrder();
    setFavoriteOrder(serializedFavoriteOrder ?? []);
  }, []);
  (0, import_react18.useEffect)(() => {
    if (!favoriteOrder) return;
    const cleanFavoriteOrder = items.flatMap((item) => {
      if (!item.favorite) return [];
      return !favoriteOrder.some((fid) => fid === item.id) ? [item.id] : [];
    });
    if (cleanFavoriteOrder.length === 0) return;
    setFavoriteOrder(Array.from(new Set(cleanFavoriteOrder)));
  }, [items, !!favoriteOrder]);
  (0, import_react18.useEffect)(() => {
    if (!favoriteOrder) return;
    void persistFavoriteOrder(favoriteOrder);
  }, [favoriteOrder]);
  const toggleFavorite = (item) => {
    setFavoriteOrder((order = []) => {
      if (!favoriteOrder?.includes(item.id)) return [item.id, ...order];
      return order.filter((fid) => fid !== item.id);
    });
  };
  const moveFavorite = ({ id }, direction) => {
    if (!favoriteOrder) return;
    const currentPosition = favoriteOrder.indexOf(id);
    if (currentPosition === -1) return;
    const newPosition = currentPosition + (direction === "up" ? -1 : 1);
    if (newPosition >= 0 && newPosition < favoriteOrder.length) {
      const newFavoriteOrder = favoriteOrder.slice(0);
      newFavoriteOrder.splice(currentPosition, 1);
      newFavoriteOrder.splice(newPosition, 0, id);
      setFavoriteOrder(newFavoriteOrder);
    }
  };
  if (!favoriteOrder) return /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(VaultLoadingFallback, {});
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(FavoritesContext.Provider, { value: { favoriteOrder, setFavoriteOrder, toggleFavorite, moveFavorite }, children });
}
var useFavoritesContext = () => {
  const context = (0, import_react18.useContext)(FavoritesContext);
  if (!context) throw new Error("useFavoritesContext must be used within a FavoritesProvider");
  return context;
};
async function getSavedFavoriteOrder() {
  try {
    const serializedFavoriteOrder = await import_api46.LocalStorage.getItem(LOCAL_STORAGE_KEY.VAULT_FAVORITE_ORDER);
    return serializedFavoriteOrder ? JSON.parse(serializedFavoriteOrder) : void 0;
  } catch (error) {
    captureException("Failed to get favorite order from local storage", error);
    return void 0;
  }
}
async function persistFavoriteOrder(order) {
  try {
    await import_api46.LocalStorage.setItem(LOCAL_STORAGE_KEY.VAULT_FAVORITE_ORDER, JSON.stringify(order));
  } catch (error) {
    captureException("Failed to persist favorite order to local storage", error);
  }
}
function useSeparateFavoriteItems(items) {
  const { favoriteOrder } = useFavoritesContext();
  return (0, import_react18.useMemo)(() => {
    const sectionedItems = items.reduce(
      (result, item) => {
        const favoritePosition = favoriteOrder.indexOf(item.id);
        if (item.favorite || favoritePosition !== -1) {
          result.favoriteItems.push({ ...item, listOrder: favoritePosition ?? Number.MAX_SAFE_INTEGER });
        } else {
          result.nonFavoriteItems.push(item);
        }
        return result;
      },
      { favoriteItems: [], nonFavoriteItems: [] }
    );
    sectionedItems.favoriteItems.sort((a, b) => a.listOrder - b.listOrder);
    return sectionedItems;
  }, [items, favoriteOrder]);
}

// src/components/searchVault/actions/FavoriteItemActions.tsx
var import_jsx_runtime39 = require("react/jsx-runtime");
function FavoriteItemActions() {
  const selectedItem = useSelectedVaultItem();
  const { favoriteOrder, toggleFavorite, moveFavorite } = useFavoritesContext();
  const isBitwardenFavorite = selectedItem.favorite;
  const isLocalFavorite = favoriteOrder.includes(selectedItem.id);
  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(selectedItem);
    } catch (error) {
      await (0, import_api47.showToast)(import_api47.Toast.Style.Failure, "Failed to toggle favorite \u2639\uFE0F");
      captureException("Failed to toggle favorite", error);
    }
  };
  const handleMoveFavorite = (dir) => () => moveFavorite(selectedItem, dir);
  return /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)(import_jsx_runtime39.Fragment, { children: [
    !isBitwardenFavorite && /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
      import_api47.Action,
      {
        title: isLocalFavorite ? "Remove Favorite" : "Mark As Favorite",
        onAction: handleToggleFavorite,
        icon: isLocalFavorite ? import_api47.Icon.StarDisabled : import_api47.Icon.Star,
        shortcut: { macOS: { key: "f", modifiers: ["opt"] }, Windows: { key: "f", modifiers: ["alt"] } }
      }
    ),
    (isBitwardenFavorite || isLocalFavorite) && /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)(import_jsx_runtime39.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
        import_api47.Action,
        {
          title: "Move Favorite Up",
          onAction: handleMoveFavorite("up"),
          icon: import_api47.Icon.ArrowUpCircleFilled,
          shortcut: {
            macOS: { key: "arrowUp", modifiers: ["opt", "shift"] },
            Windows: { key: "arrowUp", modifiers: ["alt", "shift"] }
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
        import_api47.Action,
        {
          title: "Move Favorite Down",
          onAction: handleMoveFavorite("down"),
          icon: import_api47.Icon.ArrowDownCircleFilled,
          shortcut: {
            macOS: { key: "arrowDown", modifiers: ["opt", "shift"] },
            Windows: { key: "arrowDown", modifiers: ["alt", "shift"] }
          }
        }
      )
    ] })
  ] });
}
var FavoriteItemActions_default = FavoriteItemActions;

// src/components/searchVault/actions/CopyKeyFingerprintAction.tsx
var import_api48 = require("@raycast/api");
var import_jsx_runtime40 = require("react/jsx-runtime");
function CopyKeyFingerprintAction() {
  const selectedItem = useSelectedVaultItem();
  const getUpdatedVaultItem = useGetUpdatedVaultItem_default();
  if (!selectedItem.sshKey?.keyFingerprint) return null;
  const handleCopyKeyFingerprint = async () => {
    try {
      const keyFingerprint = await getUpdatedVaultItem(
        selectedItem,
        (item) => item.sshKey?.keyFingerprint,
        "Getting key fingerprint..."
      );
      if (keyFingerprint) {
        await import_api48.Clipboard.copy(keyFingerprint, { transient: getTransientCopyPreference("other") });
        await showCopySuccessMessage("Copied key fingerprint to clipboard");
      }
    } catch (error) {
      await (0, import_api48.showToast)(import_api48.Toast.Style.Failure, "Failed to get key fingerprint");
      captureException("Failed to copy key fingerprint", error);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
    ActionWithReprompt_default,
    {
      title: "Copy Key Fingerprint",
      icon: import_api48.Icon.Key,
      onAction: handleCopyKeyFingerprint,
      repromptDescription: `Copying the key fingerprint of <${selectedItem.name}>`
    }
  );
}
var CopyKeyFingerprintAction_default = CopyKeyFingerprintAction;

// src/components/searchVault/actions/CopyPrivateKeyAction.tsx
var import_api49 = require("@raycast/api");
var import_jsx_runtime41 = require("react/jsx-runtime");
function CopyPrivateKeyAction() {
  const selectedItem = useSelectedVaultItem();
  const getUpdatedVaultItem = useGetUpdatedVaultItem_default();
  if (!selectedItem.sshKey?.privateKey) return null;
  const handleCopyPrivateKey = async () => {
    try {
      const privateKey = await getUpdatedVaultItem(
        selectedItem,
        (item) => item.sshKey?.privateKey,
        "Getting private key..."
      );
      if (privateKey) {
        await import_api49.Clipboard.copy(privateKey, { transient: getTransientCopyPreference("other") });
        await showCopySuccessMessage("Copied private key to clipboard");
      }
    } catch (error) {
      await (0, import_api49.showToast)(import_api49.Toast.Style.Failure, "Failed to get private key");
      captureException("Failed to copy private key", error);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(
    ActionWithReprompt_default,
    {
      title: "Copy Private Key",
      icon: import_api49.Icon.Key,
      onAction: handleCopyPrivateKey,
      repromptDescription: `Copying the private key of <${selectedItem.name}>`
    }
  );
}
var CopyPrivateKeyAction_default = CopyPrivateKeyAction;

// src/components/searchVault/ItemActionPanel.tsx
var import_jsx_runtime42 = require("react/jsx-runtime");
var { primaryAction } = (0, import_api50.getPreferenceValues)();
var VaultItemActionPanel = () => {
  const { type, id } = useSelectedVaultItem();
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(import_api50.ActionPanel, { children: [
    type === 1 /* LOGIN */ && /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(import_api50.ActionPanel.Section, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(ComponentReverser_default, { reverse: primaryAction === "paste", children: [
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(CopyPasswordAction_default, {}),
        /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(PastePasswordAction_default, {})
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(CopyTotpAction_default, {}),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(PasteTotpAction_default, {}),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(CopyUsernameAction_default, {}),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(PasteUsernameAction_default, {}),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(OpenUrlInBrowserAction_default, {}),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(CopyLoginUrisActions_default, {}),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(ShowNotesAction_default, {})
    ] }),
    type === 3 /* CARD */ && /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(import_jsx_runtime42.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(import_api50.ActionPanel.Section, { children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(ShowCardDetailsAction_default, {}) }),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(import_api50.ActionPanel.Section, { title: "Card Fields", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(CopyCardFieldsActions_default, {}) }),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(import_api50.ActionPanel.Section, { children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(ShowNotesAction_default, {}) })
    ] }),
    type === 4 /* IDENTITY */ && /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(import_jsx_runtime42.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(import_api50.ActionPanel.Section, { children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(ShowIdentityDetailsAction_default, {}) }),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(import_api50.ActionPanel.Section, { title: "Identity Fields", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(CopyIdentityFieldsActions_default, {}) }),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(import_api50.ActionPanel.Section, { children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(ShowNotesAction_default, {}) })
    ] }),
    type === 2 /* NOTE */ && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(import_api50.ActionPanel.Section, { children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(ShowNotesAction_default, {}) }),
    type === 5 /* SSH_KEY */ && /* @__PURE__ */ (0, import_jsx_runtime42.jsxs)(import_api50.ActionPanel.Section, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(CopyPublicKeyAction_default, {}),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(CopyKeyFingerprintAction_default, {}),
      /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(CopyPrivateKeyAction_default, {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(import_api50.ActionPanel.Section, { title: "Custom Fields", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(CopyCustomFieldsActions_default, {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(import_api50.ActionPanel.Section, { title: "Item Actions", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(FavoriteItemActions_default, {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(VaultActionsSection, {}),
    /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(DebuggingBugReportingActionSection, {}),
    import_api50.environment.isDevelopment && /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(import_api50.ActionPanel.Section, { title: "Development", children: /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(import_api50.Action.CopyToClipboard, { title: "Copy item UUID", content: id }) })
  ] });
};
var ItemActionPanel_default = VaultItemActionPanel;

// src/components/searchVault/utils/useItemAccessories.ts
var import_api51 = require("@raycast/api");
var import_react19 = require("react");
var ITEM_TYPE_TO_ACCESSORY_MAP = {
  [1 /* LOGIN */]: {
    icon: { source: ITEM_TYPE_TO_ICON_MAP[1 /* LOGIN */], tintColor: import_api51.Color.Blue },
    tooltip: ITEM_TYPE_TO_LABEL[1 /* LOGIN */]
  },
  [3 /* CARD */]: {
    icon: { source: ITEM_TYPE_TO_ICON_MAP[3 /* CARD */], tintColor: import_api51.Color.Green },
    tooltip: ITEM_TYPE_TO_LABEL[3 /* CARD */]
  },
  [4 /* IDENTITY */]: {
    icon: { source: ITEM_TYPE_TO_ICON_MAP[4 /* IDENTITY */], tintColor: import_api51.Color.Orange },
    tooltip: ITEM_TYPE_TO_LABEL[4 /* IDENTITY */]
  },
  [2 /* NOTE */]: {
    icon: { source: ITEM_TYPE_TO_ICON_MAP[2 /* NOTE */], tintColor: import_api51.Color.PrimaryText },
    tooltip: ITEM_TYPE_TO_LABEL[2 /* NOTE */]
  },
  [5 /* SSH_KEY */]: {
    icon: { source: ITEM_TYPE_TO_ICON_MAP[5 /* SSH_KEY */], tintColor: import_api51.Color.SecondaryText },
    tooltip: ITEM_TYPE_TO_LABEL[5 /* SSH_KEY */]
  }
};
function useItemAccessories(item, folder) {
  const { favoriteOrder } = useFavoritesContext();
  return (0, import_react19.useMemo)(() => {
    try {
      const accessories = [];
      if (folder?.id) {
        accessories.push({
          icon: { source: import_api51.Icon.Folder, tintColor: import_api51.Color.SecondaryText },
          tag: { value: folder.name, color: import_api51.Color.SecondaryText },
          tooltip: `${folder.name} Folder`
        });
      }
      if (item.favorite) {
        accessories.push({ icon: { source: import_api51.Icon.Star, tintColor: import_api51.Color.Blue }, tooltip: "Bitwarden Favorite" });
      } else if (favoriteOrder.includes(item.id)) {
        accessories.push({ icon: { source: import_api51.Icon.Star, tintColor: import_api51.Color.Yellow }, tooltip: "Favorite" });
      }
      if (item.reprompt === 1 /* REQUIRED */) {
        accessories.push({
          icon: { source: import_api51.Icon.Lock, tintColor: import_api51.Color.SecondaryText },
          tooltip: "Master password re-prompt"
        });
      }
      if (!ITEM_TYPE_TO_ACCESSORY_MAP[item.type]) {
        throw new Error(`No accessory defined for item ${item.name} with type ${item.type}`);
      }
      accessories.push(ITEM_TYPE_TO_ACCESSORY_MAP[item.type]);
      return accessories;
    } catch (error) {
      captureException("Failed to get item accessories", error);
      return [];
    }
  }, [favoriteOrder, item.favorite, item.reprompt, item.type, folder?.id, folder?.name]);
}

// src/components/searchVault/utils/useItemIcon.ts
var import_api53 = require("@raycast/api");
var import_react21 = require("react");

// src/utils/search.ts
var import_api52 = require("@raycast/api");

// node_modules/.bun/fast-fuzzy@1.12.0/node_modules/fast-fuzzy/lib/fuzzy.mjs
var import_graphemesplit = __toESM(require_graphemesplit(), 1);
var splitUnicode = (str) => str.normalize("NFKD").split("");
var whitespaceRegex = /^\s+$/;
var nonWordRegex = /^[`~!@#$%^&*()\-=_+{}[\]\|\\;':",./<>?]+$/;
var sortKind = {
  insertOrder: "insertOrder",
  bestMatch: "bestMatch"
};
var defaultOptions = {
  keySelector: (s) => s,
  threshold: 0.6,
  ignoreCase: true,
  ignoreSymbols: true,
  normalizeWhitespace: true,
  returnMatchData: false,
  useDamerau: true,
  useSellers: true,
  useSeparatedUnicode: false,
  sortBy: sortKind.bestMatch
};
var noop = () => {
};
var arrayWrap = (item) => item instanceof Array ? item : [item];
function normalize(string, options) {
  const lower = options.ignoreCase ? string.toLocaleLowerCase() : string;
  const normal = [];
  const map = [];
  let lastWasWhitespace = true;
  let length = 0;
  const graphemeList = options.useSeparatedUnicode ? splitUnicode(lower) : (0, import_graphemesplit.default)(lower);
  for (const grapheme of graphemeList) {
    whitespaceRegex.lastIndex = 0;
    nonWordRegex.lastIndex = 0;
    if (options.normalizeWhitespace && whitespaceRegex.test(grapheme)) {
      if (!lastWasWhitespace) {
        normal.push(" ");
        map.push(length);
        lastWasWhitespace = true;
      }
    } else if (!(options.ignoreSymbols && nonWordRegex.test(grapheme))) {
      if (options.useSeparatedUnicode) {
        normal.push(grapheme);
      } else {
        normal.push(grapheme.normalize());
      }
      map.push(length);
      lastWasWhitespace = false;
    }
    length += grapheme.length;
  }
  map.push(string.length);
  while (normal[normal.length - 1] === " ") {
    normal.pop();
    map.pop();
  }
  return {
    original: string,
    normal,
    map
  };
}
function denormalizeMatchPosition(match, map) {
  return {
    index: map[match.start],
    length: map[match.end + 1] - map[match.start]
  };
}
function walkBack(rows, scoreIndex) {
  if (scoreIndex === 0) {
    return {
      index: 0,
      length: 0
    };
  }
  let start = scoreIndex;
  for (let i = rows.length - 2; i > 0 && start > 1; i--) {
    const row = rows[i];
    start = row[start] < row[start - 1] ? start : start - 1;
  }
  return {
    start: start - 1,
    end: scoreIndex - 1
  };
}
function noopWalkback() {
  return {
    start: 0,
    end: 0
  };
}
var levUpdateScore = () => true;
var sellersUpdateScore = (cur, min) => cur < min;
function initLevRows(rowCount, columnCount) {
  const rows = new Array(rowCount);
  for (let i = 0; i < rowCount; i++) {
    rows[i] = new Array(columnCount);
    rows[i][0] = i;
  }
  for (let i = 0; i < columnCount; i++) {
    rows[0][i] = i;
  }
  return rows;
}
function initSellersRows(rowCount, columnCount) {
  const rows = new Array(rowCount);
  rows[0] = new Array(columnCount).fill(0);
  for (let i = 1; i < rowCount; i++) {
    rows[i] = new Array(columnCount);
    rows[i][0] = i;
  }
  return rows;
}
function levCore(term, candidate, rows, i, j) {
  const rowA = rows[i];
  const rowB = rows[i + 1];
  const cost = term[i] === candidate[j] ? 0 : 1;
  let m;
  let min = rowB[j] + 1;
  if ((m = rowA[j + 1] + 1) < min) min = m;
  if ((m = rowA[j] + cost) < min) min = m;
  rowB[j + 1] = min;
}
function levenshtein(term, candidate, rows, j) {
  for (let i = 0; i < term.length; i++) {
    levCore(term, candidate, rows, i, j);
  }
}
function damerauLevenshtein(term, candidate, rows, j) {
  if (j === 0) {
    levenshtein(term, candidate, rows, j);
    return;
  }
  if (term.length > 0) {
    levCore(term, candidate, rows, 0, j);
  }
  for (let i = 1; i < term.length; i++) {
    const rowA = rows[i - 1];
    const rowB = rows[i];
    const rowC = rows[i + 1];
    const cost = term[i] === candidate[j] ? 0 : 1;
    let m;
    let min = rowC[j] + 1;
    if ((m = rowB[j + 1] + 1) < min) min = m;
    if ((m = rowB[j] + cost) < min) min = m;
    if (term[i] === candidate[j - 1] && term[i - 1] === candidate[j] && (m = rowA[j - 1] + cost) < min) min = m;
    rowC[j + 1] = min;
  }
}
function trieInsert(trie, string, item) {
  let walker = trie;
  for (let i = 0; i < string.length; i++) {
    const char = string[i];
    if (walker.children[char] == null) {
      walker.children[char] = {
        children: {},
        candidates: [],
        depth: 0
      };
    }
    walker.depth = Math.max(walker.depth, string.length - i);
    walker = walker.children[char];
  }
  walker.candidates.push(item);
}
function createSearchTrie(trie, index, items, options) {
  for (const item of items) {
    const candidates = arrayWrap(options.keySelector(item)).map((key, keyIndex) => ({
      index,
      keyIndex,
      item,
      normalized: normalize(key, options)
    }));
    index++;
    for (const candidate of candidates) {
      trieInsert(trie, candidate.normalized.normal, candidate);
    }
  }
}
function compareItemsBestScore(a, b) {
  const scoreDiff = b.score - a.score;
  if (scoreDiff !== 0) {
    return scoreDiff;
  }
  const matchPosDiff = a.match.start - b.match.start;
  if (matchPosDiff !== 0) {
    return matchPosDiff;
  }
  const keyIndexDiff = a.keyIndex - b.keyIndex;
  if (keyIndexDiff !== 0) {
    return keyIndexDiff;
  }
  const lengthDiff = a.lengthDiff - b.lengthDiff;
  if (lengthDiff !== 0) {
    return lengthDiff;
  }
  return compareItemsInsertOrder(a, b);
}
function compareItemsInsertOrder(a, b) {
  return a.index - b.index;
}
function getCompareFunc(sortBy) {
  switch (sortBy) {
    case sortKind.bestMatch:
      return compareItemsBestScore;
    case sortKind.insertOrder:
      return compareItemsInsertOrder;
    default:
      throw new Error(`unknown sortBy method ${sortBy}`);
  }
}
function addResult(results, resultMap, candidate, score, match, lengthDiff, compareItems) {
  const scoredItem = {
    item: candidate.item,
    normalized: candidate.normalized,
    score,
    match,
    index: candidate.index,
    keyIndex: candidate.keyIndex,
    lengthDiff
  };
  if (resultMap[candidate.index] == null) {
    resultMap[candidate.index] = results.length;
    results.push(scoredItem);
  } else if (compareItems(scoredItem, results[resultMap[candidate.index]]) < 0) {
    results[resultMap[candidate.index]] = scoredItem;
  }
}
var getLevLength = Math.max;
var getSellersLength = (termLength) => termLength;
function levShouldContinue(node, pos, term, threshold, sValue) {
  const p1 = pos + sValue;
  const p2 = Math.min(term.length, pos + node.depth + 1);
  const length = Math.ceil((p1 + p2) / 2);
  const bestPossibleValue = length - p2;
  return 1 - bestPossibleValue / length >= threshold;
}
function sellersShouldContinue(node, _, term, threshold, sValue, lastValue) {
  const bestPossibleValue = Math.min(sValue, lastValue - (node.depth + 1));
  return 1 - bestPossibleValue / term.length >= threshold;
}
function searchRecurse(trie, term, scoreMethods, rows, results, resultMap, options) {
  const stack = [];
  for (const key in trie.children) {
    const node = trie.children[key];
    stack.push([node, 1, key, 0, term.length]);
  }
  const acc = new Array(trie.depth);
  while (stack.length !== 0) {
    const [node, len, char, si, sv] = stack.pop();
    acc[len - 1] = char;
    scoreMethods.score(term, acc, rows, len - 1);
    const lastIndex = len;
    const lastValue = rows[rows.length - 1][lastIndex];
    let sIndex = si, sValue = sv;
    if (scoreMethods.shouldUpdateScore(lastValue, sv)) {
      sIndex = lastIndex;
      sValue = lastValue;
    }
    if (node.candidates.length > 0) {
      const length = scoreMethods.getLength(term.length, len);
      const score = 1 - sValue / length;
      if (score >= options.threshold) {
        const match = walkBack(rows, sIndex);
        const lengthDiff = Math.abs(len - term.length);
        for (const candidate of node.candidates) {
          addResult(results, resultMap, candidate, score, match, lengthDiff, scoreMethods.compareItems);
        }
      }
    }
    for (const key in node.children) {
      const child = node.children[key];
      if (scoreMethods.shouldContinue(child, len, term, options.threshold, sValue, lastValue)) {
        stack.push([child, len + 1, key, sIndex, sValue]);
      }
    }
  }
}
function searchCore(term, trie, options) {
  const initMethod = options.useSellers ? initSellersRows : initLevRows;
  const scoreMethods = {
    score: options.useDamerau ? damerauLevenshtein : levenshtein,
    getLength: options.useSellers ? getSellersLength : getLevLength,
    shouldUpdateScore: options.useSellers ? sellersUpdateScore : levUpdateScore,
    shouldContinue: options.useSellers ? sellersShouldContinue : levShouldContinue,
    walkBack: options.useSellers ? walkBack : noopWalkback,
    compareItems: getCompareFunc(options.sortBy)
  };
  const resultMap = {};
  const results = [];
  const rows = initMethod(term.length + 1, trie.depth + 1);
  if (options.threshold <= 0 || term.length === 0) {
    for (const candidate of trie.candidates) {
      addResult(results, resultMap, candidate, 0, {
        index: 0,
        length: 0
      }, term.length, scoreMethods.compareItems);
    }
  }
  searchRecurse(trie, term, scoreMethods, rows, results, resultMap, options);
  const sorted = results.sort(scoreMethods.compareItems);
  if (options.returnMatchData) {
    const denormalize = options.useSellers ? denormalizeMatchPosition : noop;
    return sorted.map((candidate) => ({
      item: candidate.item,
      original: candidate.normalized.original,
      key: candidate.normalized.normal.join(""),
      score: candidate.score,
      match: denormalize(candidate.match, candidate.normalized.map)
    }));
  }
  return sorted.map((candidate) => candidate.item);
}
var Searcher = class {
  constructor(candidates, options) {
    this.options = Object.assign({}, defaultOptions, options);
    this.trie = {
      children: {},
      candidates: [],
      depth: 0
    };
    createSearchTrie(this.trie, 0, candidates, this.options);
    this.count = candidates.length;
  }
  add(...candidates) {
    createSearchTrie(this.trie, this.count, candidates, this.options);
    this.count += candidates.length;
  }
  search(term, options) {
    options = Object.assign({}, this.options, options);
    return searchCore(normalize(term, this.options).normal, this.trie, options);
  }
};

// src/utils/search.ts
var import_react20 = require("react");
var import_url = require("url");
function faviconUrl(url2) {
  try {
    const domain = new import_url.URL(url2).hostname;
    return `https://icons.bitwarden.net/${domain}/icon.png`;
  } catch (err) {
    return import_api52.Icon.Globe;
  }
}
function useVaultSearch(items) {
  const [searchText, setSearchText] = (0, import_react20.useState)("");
  const searcher = (0, import_react20.useMemo)(() => {
    return new Searcher(items, {
      ignoreSymbols: false,
      threshold: 0.7,
      keySelector: (item) => {
        const { login, card } = item;
        return [
          item.name,
          ITEM_TYPE_TO_LABEL[item.type],
          login?.username,
          login?.uris?.map(({ uri }) => uri),
          card?.brand,
          card?.number
        ].flat().filter((value) => !!value);
      }
    });
  }, [items]);
  const filteredItems = (0, import_react20.useMemo)(() => {
    if (!searchText) return items;
    return searcher.search(searchText);
  }, [searcher, searchText]);
  return { setSearchText, filteredItems };
}

// src/components/searchVault/utils/useItemIcon.ts
var { fetchFavicons } = (0, import_api53.getPreferenceValues)();
var ITEM_TYPE_TO_IMAGE_OR_ICON_MAP = {
  [1 /* LOGIN */]: (item) => {
    const iconUri = item.login?.uris?.[0]?.uri;
    if (fetchFavicons && iconUri) return faviconUrl(iconUri);
    return ITEM_TYPE_TO_ICON_MAP[1 /* LOGIN */];
  },
  [3 /* CARD */]: (item) => {
    const { brand } = item.card ?? {};
    if (brand) {
      const cardBrandImage = getCardImageUrl(brand);
      if (cardBrandImage) return cardBrandImage;
    }
    return ITEM_TYPE_TO_ICON_MAP[3 /* CARD */];
  },
  [4 /* IDENTITY */]: () => ITEM_TYPE_TO_ICON_MAP[4 /* IDENTITY */],
  [2 /* NOTE */]: () => ITEM_TYPE_TO_ICON_MAP[2 /* NOTE */],
  [5 /* SSH_KEY */]: () => ITEM_TYPE_TO_ICON_MAP[5 /* SSH_KEY */]
};
function useItemIcon(item) {
  return (0, import_react21.useMemo)(() => {
    const imageOrIcon = ITEM_TYPE_TO_IMAGE_OR_ICON_MAP[item.type]?.(item);
    if (imageOrIcon) return imageOrIcon;
    return import_api53.Icon.QuestionMark;
  }, [item.type, item.card?.brand, item.login?.uris?.[0]?.uri]);
}

// src/components/searchVault/Item.tsx
var import_jsx_runtime43 = require("react/jsx-runtime");
var VaultItem = ({ item, folder }) => {
  const icon = useItemIcon(item);
  const accessories = useItemAccessories(item, folder);
  return /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(vaultItem_default.Provider, { value: item, children: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(
    import_api54.List.Item,
    {
      id: item.id,
      title: item.name,
      accessories,
      icon,
      subtitle: item.login?.username || void 0,
      actions: /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(ItemActionPanel_default, {})
    }
  ) });
};
var Item_default = VaultItem;

// src/components/ListFolderDropdown.tsx
var import_api55 = require("@raycast/api");
var import_jsx_runtime44 = require("react/jsx-runtime");
function ListFolderDropdown() {
  const { folders, currentFolderId, setCurrentFolder } = useVaultContext();
  if (folders.length === 0) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime44.jsxs)(
    import_api55.List.Dropdown,
    {
      tooltip: "Select a folder",
      placeholder: "Search folders",
      defaultValue: currentFolderId ?? FOLDER_OPTIONS.ALL,
      onChange: setCurrentFolder,
      throttle: true,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(import_api55.List.Dropdown.Item, { value: FOLDER_OPTIONS.ALL, title: "All", icon: import_api55.Icon.Folder }),
        folders.map((folder) => {
          const id = folder.id || FOLDER_OPTIONS.NO_FOLDER;
          return /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(import_api55.List.Dropdown.Item, { value: id, title: folder.name, icon: import_api55.Icon.Folder }, id);
        })
      ]
    }
  );
}

// src/search.tsx
var import_jsx_runtime45 = require("react/jsx-runtime");
var SearchVaultCommand = () => /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(RootErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(BitwardenProvider, { loadingFallback: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(VaultLoadingFallback, {}), children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(SessionProvider, { unlock: true, children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(vaultListeners_default, { children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(VaultProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(FavoritesProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(SearchVaultComponent, {}) }) }) }) }) }) });
function SearchVaultComponent() {
  const { items, folders, isLoading, isEmpty } = useVaultContext();
  const { setSearchText, filteredItems } = useVaultSearch(items);
  const { favoriteItems, nonFavoriteItems } = useSeparateFavoriteItems(filteredItems);
  return /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)(
    import_api56.List,
    {
      searchBarPlaceholder: "Search vault",
      filtering: false,
      isLoading,
      searchBarAccessory: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(ListFolderDropdown, {}),
      onSearchTextChange: setSearchText,
      children: [
        favoriteItems.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)(import_jsx_runtime45.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(import_api56.List.Section, { title: "Favorites", children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(VaultItemList, { items: favoriteItems, folders }) }),
          /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(import_api56.List.Section, { title: "Other Items", children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(VaultItemList, { items: nonFavoriteItems, folders }) })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(VaultItemList, { items: nonFavoriteItems, folders }),
        isLoading ? /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(import_api56.List.EmptyView, { icon: import_api56.Icon.ArrowClockwise, title: "Loading...", description: "Please wait." }) : /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
          import_api56.List.EmptyView,
          {
            icon: { source: "bitwarden-64.png" },
            title: isEmpty ? "Vault empty." : "No matching items found.",
            description: isEmpty ? "Hit the sync button to sync your vault or try logging in again." : "Hit the sync button to sync your vault.",
            actions: !isLoading && /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(import_api56.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(VaultActionsSection, {}) })
          }
        )
      ]
    }
  );
}
function VaultItemList({ items, folders }) {
  return /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(import_jsx_runtime45.Fragment, { children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(Item_default, { item, folder: getItemFolder(folders, item) }, item.id)) });
}
function getItemFolder(folderList, item) {
  return folderList.find((folder) => folder.id === item.folderId);
}
var search_default = SearchVaultCommand;
/*! Bundled license information:

node-stream-zip/node_stream_zip.js:
  (**
   * @license node-stream-zip | (c) 2020 Antelle | https://github.com/antelle/node-stream-zip/blob/master/LICENSE
   * Portions copyright https://github.com/cthackers/adm-zip | https://raw.githubusercontent.com/cthackers/adm-zip/master/LICENSE
   *)
*/
