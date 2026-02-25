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
      for (var i2 = 0; i2 < pathext.length; i2++) {
        var p2 = pathext[i2].toLowerCase();
        if (p2 && path3.substr(-p2.length).toLowerCase() === p2) {
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
      fs.stat(path3, function(er2, stat) {
        cb(er2, er2 ? false : checkStat(stat, path3, options));
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
      fs.stat(path3, function(er2, stat) {
        cb(er2, er2 ? false : checkStat(stat, options));
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
      var u2 = parseInt("100", 8);
      var g2 = parseInt("010", 8);
      var o = parseInt("001", 8);
      var ug = u2 | g2;
      var ret = mod & o || mod & g2 && gid === myGid || mod & u2 && uid === myUid || mod & ug && myUid === 0;
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
          isexe(path3, options || {}, function(er2, is) {
            if (er2) {
              reject(er2);
            } else {
              resolve(is);
            }
          });
        });
      }
      core(path3, options || {}, function(er2, is) {
        if (er2) {
          if (er2.code === "EACCES" || options && options.ignoreErrors) {
            er2 = null;
            is = false;
          }
        }
        cb(er2, is);
      });
    }
    function sync(path3, options) {
      try {
        return core.sync(path3, options || {});
      } catch (er2) {
        if (options && options.ignoreErrors || er2.code === "EACCES") {
          return false;
        } else {
          throw er2;
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
      const step = (i2) => new Promise((resolve, reject) => {
        if (i2 === pathEnv.length)
          return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
        const ppRaw = pathEnv[i2];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path3.join(pathPart, cmd);
        const p2 = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        resolve(subStep(p2, i2, 0));
      });
      const subStep = (p2, i2, ii) => new Promise((resolve, reject) => {
        if (ii === pathExt.length)
          return resolve(step(i2 + 1));
        const ext = pathExt[ii];
        isexe(p2 + ext, { pathExt: pathExtExe }, (er2, is) => {
          if (!er2 && is) {
            if (opt.all)
              found.push(p2 + ext);
            else
              return resolve(p2 + ext);
          }
          return resolve(subStep(p2, i2, ii + 1));
        });
      });
      return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
    };
    var whichSync = (cmd, opt) => {
      opt = opt || {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      for (let i2 = 0; i2 < pathEnv.length; i2++) {
        const ppRaw = pathEnv[i2];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path3.join(pathPart, cmd);
        const p2 = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        for (let j = 0; j < pathExt.length; j++) {
          const cur = p2 + pathExt[j];
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
          } catch (er2) {
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
          } catch (er2) {
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
      output.add = add2;
      output.isEmpty = isEmpty;
      output.on("unpipe", remove);
      Array.prototype.slice.call(arguments).forEach(add2);
      return output;
      function add2(source) {
        if (Array.isArray(source)) {
          source.forEach(add2);
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
      open2();
      function open2() {
        if (config.fd) {
          fd = config.fd;
          readFile();
        } else {
          fs.open(fileName, "r", (err, f2) => {
            if (err) {
              return that.emit("error", err);
            }
            fd = f2;
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
                let parts = relPath.split("/").filter((f2) => {
                  return f2;
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
          dirs.sort((x2, y3) => {
            return x2.length - y3.length;
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
          const b3 = Buffer.alloc(4);
          for (let n = 0; n < 256; n++) {
            let c2 = n;
            for (let k2 = 8; --k2 >= 0; ) {
              if ((c2 & 1) !== 0) {
                c2 = 3988292384 ^ c2 >>> 1;
              } else {
                c2 = c2 >>> 1;
              }
            }
            if (c2 < 0) {
              b3.writeInt32LE(c2, 0);
              c2 = b3.readUInt32LE(0);
            }
            crcTable[n] = c2;
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
      let b3 = (dec >>> 0).toString(2);
      while (b3.length < size) {
        b3 = "0" + b3;
      }
      return b3.split("");
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
      var i2, sum;
      for (i2 = 0; i2 < delta; ++i2) bits[i2] = 0;
      for (i2 = 0; i2 < 30 - delta; ++i2) bits[i2 + delta] = i2 / delta | 0;
      for (sum = first, i2 = 0; i2 < 30; ++i2) {
        base[i2] = sum;
        sum += 1 << bits[i2];
      }
    }
    function tinf_build_fixed_trees(lt, dt) {
      var i2;
      for (i2 = 0; i2 < 7; ++i2) lt.table[i2] = 0;
      lt.table[7] = 24;
      lt.table[8] = 152;
      lt.table[9] = 112;
      for (i2 = 0; i2 < 24; ++i2) lt.trans[i2] = 256 + i2;
      for (i2 = 0; i2 < 144; ++i2) lt.trans[24 + i2] = i2;
      for (i2 = 0; i2 < 8; ++i2) lt.trans[24 + 144 + i2] = 280 + i2;
      for (i2 = 0; i2 < 112; ++i2) lt.trans[24 + 144 + 8 + i2] = 144 + i2;
      for (i2 = 0; i2 < 5; ++i2) dt.table[i2] = 0;
      dt.table[5] = 32;
      for (i2 = 0; i2 < 32; ++i2) dt.trans[i2] = i2;
    }
    var offs = new Uint16Array(16);
    function tinf_build_tree(t2, lengths2, off, num) {
      var i2, sum;
      for (i2 = 0; i2 < 16; ++i2) t2.table[i2] = 0;
      for (i2 = 0; i2 < num; ++i2) t2.table[lengths2[off + i2]]++;
      t2.table[0] = 0;
      for (sum = 0, i2 = 0; i2 < 16; ++i2) {
        offs[i2] = sum;
        sum += t2.table[i2];
      }
      for (i2 = 0; i2 < num; ++i2) {
        if (lengths2[off + i2]) t2.trans[offs[lengths2[off + i2]]++] = i2;
      }
    }
    function tinf_getbit(d4) {
      if (!d4.bitcount--) {
        d4.tag = d4.source[d4.sourceIndex++];
        d4.bitcount = 7;
      }
      var bit = d4.tag & 1;
      d4.tag >>>= 1;
      return bit;
    }
    function tinf_read_bits(d4, num, base) {
      if (!num)
        return base;
      while (d4.bitcount < 24) {
        d4.tag |= d4.source[d4.sourceIndex++] << d4.bitcount;
        d4.bitcount += 8;
      }
      var val = d4.tag & 65535 >>> 16 - num;
      d4.tag >>>= num;
      d4.bitcount -= num;
      return val + base;
    }
    function tinf_decode_symbol(d4, t2) {
      while (d4.bitcount < 24) {
        d4.tag |= d4.source[d4.sourceIndex++] << d4.bitcount;
        d4.bitcount += 8;
      }
      var sum = 0, cur = 0, len = 0;
      var tag = d4.tag;
      do {
        cur = 2 * cur + (tag & 1);
        tag >>>= 1;
        ++len;
        sum += t2.table[len];
        cur -= t2.table[len];
      } while (cur >= 0);
      d4.tag = tag;
      d4.bitcount -= len;
      return t2.trans[sum + cur];
    }
    function tinf_decode_trees(d4, lt, dt) {
      var hlit, hdist, hclen;
      var i2, num, length;
      hlit = tinf_read_bits(d4, 5, 257);
      hdist = tinf_read_bits(d4, 5, 1);
      hclen = tinf_read_bits(d4, 4, 4);
      for (i2 = 0; i2 < 19; ++i2) lengths[i2] = 0;
      for (i2 = 0; i2 < hclen; ++i2) {
        var clen = tinf_read_bits(d4, 3, 0);
        lengths[clcidx[i2]] = clen;
      }
      tinf_build_tree(code_tree, lengths, 0, 19);
      for (num = 0; num < hlit + hdist; ) {
        var sym = tinf_decode_symbol(d4, code_tree);
        switch (sym) {
          case 16:
            var prev = lengths[num - 1];
            for (length = tinf_read_bits(d4, 2, 3); length; --length) {
              lengths[num++] = prev;
            }
            break;
          case 17:
            for (length = tinf_read_bits(d4, 3, 3); length; --length) {
              lengths[num++] = 0;
            }
            break;
          case 18:
            for (length = tinf_read_bits(d4, 7, 11); length; --length) {
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
    function tinf_inflate_block_data(d4, lt, dt) {
      while (1) {
        var sym = tinf_decode_symbol(d4, lt);
        if (sym === 256) {
          return TINF_OK;
        }
        if (sym < 256) {
          d4.dest[d4.destLen++] = sym;
        } else {
          var length, dist, offs2;
          var i2;
          sym -= 257;
          length = tinf_read_bits(d4, length_bits[sym], length_base[sym]);
          dist = tinf_decode_symbol(d4, dt);
          offs2 = d4.destLen - tinf_read_bits(d4, dist_bits[dist], dist_base[dist]);
          for (i2 = offs2; i2 < offs2 + length; ++i2) {
            d4.dest[d4.destLen++] = d4.dest[i2];
          }
        }
      }
    }
    function tinf_inflate_uncompressed_block(d4) {
      var length, invlength;
      var i2;
      while (d4.bitcount > 8) {
        d4.sourceIndex--;
        d4.bitcount -= 8;
      }
      length = d4.source[d4.sourceIndex + 1];
      length = 256 * length + d4.source[d4.sourceIndex];
      invlength = d4.source[d4.sourceIndex + 3];
      invlength = 256 * invlength + d4.source[d4.sourceIndex + 2];
      if (length !== (~invlength & 65535))
        return TINF_DATA_ERROR;
      d4.sourceIndex += 4;
      for (i2 = length; i2; --i2)
        d4.dest[d4.destLen++] = d4.source[d4.sourceIndex++];
      d4.bitcount = 0;
      return TINF_OK;
    }
    function tinf_uncompress(source, dest) {
      var d4 = new Data(source, dest);
      var bfinal, btype, res;
      do {
        bfinal = tinf_getbit(d4);
        btype = tinf_read_bits(d4, 2, 0);
        switch (btype) {
          case 0:
            res = tinf_inflate_uncompressed_block(d4);
            break;
          case 1:
            res = tinf_inflate_block_data(d4, sltree, sdtree);
            break;
          case 2:
            tinf_decode_trees(d4, d4.ltree, d4.dtree);
            res = tinf_inflate_block_data(d4, d4.ltree, d4.dtree);
            break;
          default:
            res = TINF_DATA_ERROR;
        }
        if (res !== TINF_OK)
          throw new Error("Data error");
      } while (!bfinal);
      if (d4.destLen < d4.dest.length) {
        if (typeof d4.dest.slice === "function")
          return d4.dest.slice(0, d4.destLen);
        else
          return d4.dest.subarray(0, d4.destLen);
      }
      return d4.dest;
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
    var swap = (b3, n, m2) => {
      let i2 = b3[n];
      b3[n] = b3[m2];
      b3[m2] = i2;
    };
    var swap32 = (array) => {
      const len = array.length;
      for (let i2 = 0; i2 < len; i2 += 4) {
        swap(array, i2, i2 + 3);
        swap(array, i2 + 1, i2 + 2);
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
      var b64tab = (function(a3) {
        var tab = {};
        a3.forEach(function(c2, i2) {
          return tab[c2] = i2;
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
        for (var i2 = 0; i2 < bin.length; ) {
          if ((c0 = bin.charCodeAt(i2++)) > 255 || (c1 = bin.charCodeAt(i2++)) > 255 || (c2 = bin.charCodeAt(i2++)) > 255)
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
        for (var i2 = 0, l = u8a.length; i2 < l; i2 += maxargs) {
          strs.push(_fromCC.apply(null, u8a.subarray(i2, i2 + maxargs)));
        }
        return _btoa(strs.join(""));
      };
      var fromUint8Array = function(u8a, urlsafe) {
        if (urlsafe === void 0) {
          urlsafe = false;
        }
        return urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
      };
      var cb_utob = function(c2) {
        if (c2.length < 2) {
          var cc = c2.charCodeAt(0);
          return cc < 128 ? c2 : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
        } else {
          var cc = 65536 + (c2.charCodeAt(0) - 55296) * 1024 + (c2.charCodeAt(1) - 56320);
          return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
        }
      };
      var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
      var utob = function(u2) {
        return u2.replace(re_utob, cb_utob);
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
      var btou = function(b3) {
        return b3.replace(re_btou, cb_btou);
      };
      var atobPolyfill = function(asc) {
        asc = asc.replace(/\s+/g, "");
        if (!b64re.test(asc))
          throw new TypeError("malformed base64.");
        asc += "==".slice(2 - (asc.length & 3));
        var u24, bin = "", r1, r2;
        for (var i2 = 0; i2 < asc.length; ) {
          u24 = b64tab[asc.charAt(i2++)] << 18 | b64tab[asc.charAt(i2++)] << 12 | (r1 = b64tab[asc.charAt(i2++)]) << 6 | (r2 = b64tab[asc.charAt(i2++)]);
          bin += r1 === 64 ? _fromCC(u24 >> 16 & 255) : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255) : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
        }
        return bin;
      };
      var _atob = typeof atob === "function" ? function(asc) {
        return atob(_tidyB64(asc));
      } : _hasBuffer ? function(asc) {
        return Buffer.from(asc, "base64").toString("binary");
      } : atobPolyfill;
      var _toUint8Array = _hasBuffer ? function(a3) {
        return _U8Afrom(Buffer.from(a3, "base64"));
      } : function(a3) {
        return _U8Afrom(_atob(a3).split("").map(function(c2) {
          return c2.charCodeAt(0);
        }));
      };
      var toUint8Array = function(a3) {
        return _toUint8Array(_unURI(a3));
      };
      var _decode = _hasBuffer ? function(a3) {
        return Buffer.from(a3, "base64").toString("utf8");
      } : _TD ? function(a3) {
        return _TD.decode(_toUint8Array(a3));
      } : function(a3) {
        return btou(_atob(a3));
      };
      var _unURI = function(a3) {
        return _tidyB64(a3.replace(/[-_]/g, function(m0) {
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
      var _noEnum = function(v3) {
        return {
          value: v3,
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
      Object.keys(gBase64).forEach(function(k2) {
        return gBase64.Base64[k2] = gBase64[k2];
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
      const L2 = ts.length;
      for (let i2 = start; i2 + 1 < L2; i2++) {
        const curr = ts[i2 + 0];
        const next = ts[i2 + 1];
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
          return i2 + 1 - start;
        }
        if (is(next, types.Control | types.CR | types.LF)) {
          return i2 + 1 - start;
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
        return i2 + 1 - start;
      }
      return L2 - start;
    }
    module2.exports = function split3(str) {
      const graphemeClusters = [];
      const map = [0];
      const ts = [];
      for (let i2 = 0; i2 < str.length; ) {
        const code = str.codePointAt(i2);
        ts.push(typeTrie.get(code) | extPict.get(code) | inCB.get(code));
        i2 += code > 65535 ? 2 : 1;
        map.push(i2);
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

// src/authenticator.tsx
var authenticator_exports = {};
__export(authenticator_exports, {
  default: () => authenticator_default
});
module.exports = __toCommonJS(authenticator_exports);
var import_react19 = require("react");
var import_api35 = require("@raycast/api");

// node_modules/.bun/@raycast+utils@2.2.2+2f2cf03b9bc58947/node_modules/@raycast/utils/dist/module.js
var import_react = __toESM(require("react"));
var import_api = require("@raycast/api");

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
var import_node_path = __toESM(require("node:path"));
var import_jsx_runtime = require("react/jsx-runtime");
function $a57ed8effbd797c7$export$722debc0e56fea39(value) {
  const ref = (0, import_react.useRef)(value);
  const signalRef = (0, import_react.useRef)(0);
  if (!(0, dequal)(value, ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }
  return (0, import_react.useMemo)(() => ref.current, [
    signalRef.current
  ]);
}
function $bfcf6ee368b3bd9f$export$d4b699e2c1148419(value) {
  const ref = (0, import_react.useRef)(value);
  ref.current = value;
  return ref;
}
function $c718fd03aba6111c$export$80e5033e369189f3(error, options) {
  const message = error instanceof Error ? error.message : String(error);
  return (0, import_api.showToast)({
    style: (0, import_api.Toast).Style.Failure,
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
    const packageJSON = JSON.parse((0, import_node_fs.readFileSync)((0, import_node_path.join)((0, import_api.environment).assetsPath, "..", "package.json"), "utf8"));
    title = `[${packageJSON.title}]...`;
    extensionURL = `https://raycast.com/${packageJSON.owner || packageJSON.author}/${packageJSON.name}`;
    if (!packageJSON.owner || packageJSON.access === "public") privateExtension = false;
  } catch (err) {
  }
  const fallback = (0, import_api.environment).isDevelopment || privateExtension;
  const stack = error instanceof Error ? error?.stack || error?.message || "" : String(error);
  return {
    title: fallback ? "Copy Logs" : "Report Error",
    onAction(toast) {
      toast.hide();
      if (fallback) (0, import_api.Clipboard).copy(stack);
      else (0, import_api.open)(`https://github.com/raycast/extensions/issues/new?&labels=extension%2Cbug&template=extension_bug_report.yml&title=${encodeURIComponent(title)}&extension-url=${encodeURI(extensionURL)}&description=${encodeURIComponent(`#### Error:
\`\`\`
${stack}
\`\`\`
`)}`);
    }
  };
};
function $cefc05764ce5eacd$export$dd6b79aaabe7bc37(fn, args, options) {
  const lastCallId = (0, import_react.useRef)(0);
  const [state, set] = (0, import_react.useState)({
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
  const latestCallback = (0, import_react.useRef)(null);
  const paginationArgsRef = (0, import_react.useRef)({
    page: 0
  });
  const usePaginationRef = (0, import_react.useRef)(false);
  const hasMoreRef = (0, import_react.useRef)(true);
  const pageSizeRef = (0, import_react.useRef)(50);
  const abort = (0, import_react.useCallback)(() => {
    if (latestAbortable.current) {
      latestAbortable.current.current?.abort();
      latestAbortable.current.current = new AbortController();
    }
    return ++lastCallId.current;
  }, [
    latestAbortable
  ]);
  const callback = (0, import_react.useCallback)((...args2) => {
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
        else if ((0, import_api.environment).launchType !== (0, import_api.LaunchType).Background) (0, $c718fd03aba6111c$export$80e5033e369189f3)(error, {
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
  const revalidate = (0, import_react.useCallback)(() => {
    paginationArgsRef.current = {
      page: 0
    };
    const args2 = latestArgs.current || [];
    return callback(...args2);
  }, [
    callback,
    latestArgs
  ]);
  const mutate = (0, import_react.useCallback)(async (asyncUpdate, options2) => {
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
        if ((0, import_api.environment).launchType === (0, import_api.LaunchType).Background || (0, import_api.environment).commandMode === "menu-bar")
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
  const onLoadMore = (0, import_react.useCallback)(() => {
    paginationArgsRef.current.page += 1;
    const args2 = latestArgs.current || [];
    callback(...args2);
  }, [
    paginationArgsRef,
    latestArgs,
    callback
  ]);
  (0, import_react.useEffect)(() => {
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
  (0, import_react.useEffect)(() => {
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
  const cache = $c40d7eded38ca69c$var$cacheMap.get(cacheKey) || $c40d7eded38ca69c$var$cacheMap.set(cacheKey, new (0, import_api.Cache)({
    namespace: config?.cacheNamespace
  })).get(cacheKey);
  if (!cache) throw new Error("Missing cache");
  const keyRef = (0, $bfcf6ee368b3bd9f$export$d4b699e2c1148419)(key);
  const initialValueRef = (0, $bfcf6ee368b3bd9f$export$d4b699e2c1148419)(initialState2);
  const cachedState = (0, import_react.useSyncExternalStore)(cache.subscribe, () => {
    try {
      return cache.get(keyRef.current);
    } catch (error) {
      console.error("Could not get Cache data:", error);
      return void 0;
    }
  });
  const state = (0, import_react.useMemo)(() => {
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
  const setStateAndCache = (0, import_react.useCallback)((updater) => {
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

// node_modules/.bun/@otplib+core@13.3.0/node_modules/@otplib/core/dist/index.js
var i = class extends Error {
  constructor(e, t2) {
    super(e, t2), this.name = "OTPError";
  }
};
var x = class extends i {
  constructor(e) {
    super(e), this.name = "SecretError";
  }
};
var h = class extends x {
  constructor(e, t2) {
    super(`Secret must be at least ${e} bytes (${e * 8} bits), got ${t2} bytes`), this.name = "SecretTooShortError";
  }
};
var P = class extends x {
  constructor(e, t2) {
    super(`Secret must not exceed ${e} bytes, got ${t2} bytes`), this.name = "SecretTooLongError";
  }
};
var m = class extends i {
  constructor(e) {
    super(e), this.name = "CounterError";
  }
};
var O = class extends m {
  constructor() {
    super("Counter must be non-negative"), this.name = "CounterNegativeError";
  }
};
var T = class extends m {
  constructor() {
    super("Counter exceeds maximum safe integer value"), this.name = "CounterOverflowError";
  }
};
var b = class extends m {
  constructor() {
    super("Counter must be a finite integer"), this.name = "CounterNotIntegerError";
  }
};
var A = class extends i {
  constructor(e) {
    super(e), this.name = "TimeError";
  }
};
var C = class extends A {
  constructor() {
    super("Time must be non-negative"), this.name = "TimeNegativeError";
  }
};
var S = class extends A {
  constructor() {
    super("Time must be a finite number"), this.name = "TimeNotFiniteError";
  }
};
var B = class extends i {
  constructor(e) {
    super(e), this.name = "PeriodError";
  }
};
var w = class extends B {
  constructor(e) {
    super(`Period must be at least ${e} second(s)`), this.name = "PeriodTooSmallError";
  }
};
var _ = class extends B {
  constructor(e) {
    super(`Period must not exceed ${e} seconds`), this.name = "PeriodTooLargeError";
  }
};
var N = class extends i {
  constructor(e, t2) {
    super(e, t2), this.name = "CryptoError";
  }
};
var c = class extends N {
  constructor(e, t2) {
    super(`HMAC computation failed: ${e}`, t2), this.name = "HMACError";
  }
};
var v = class extends N {
  constructor(e, t2) {
    super(`Random byte generation failed: ${e}`, t2), this.name = "RandomBytesError";
  }
};
var G = class extends i {
  constructor(e) {
    super(e), this.name = "PluginError";
  }
};
var Y = class extends G {
  constructor() {
    super("Crypto plugin is required."), this.name = "CryptoPluginMissingError";
  }
};
var L = class extends G {
  constructor() {
    super("Base32 plugin is required."), this.name = "Base32PluginMissingError";
  }
};
var a = class extends i {
  constructor(e) {
    super(e), this.name = "ConfigurationError";
  }
};
var W = class extends a {
  constructor() {
    super("Secret is required. Use generateSecret() to create one, or provide via { secret: 'YOUR_BASE32_SECRET' }"), this.name = "SecretMissingError";
  }
};
var yr = new TextEncoder();
var xr = new TextDecoder();
var or = 16;
var sr = 64;
var ar = 1;
var ur = 3600;
var pr = Number.MAX_SAFE_INTEGER;
var lr = 99;
var er = Symbol("otplib.guardrails.override");
function y(r2, e, t2) {
  if (typeof e != "number" || !Number.isSafeInteger(e)) throw new a(`Guardrail '${r2}' must be a safe integer`);
  if (e < t2) throw new a(`Guardrail '${r2}' must be >= ${t2}`);
}
var d = Object.freeze({ MIN_SECRET_BYTES: or, MAX_SECRET_BYTES: sr, MIN_PERIOD: ar, MAX_PERIOD: ur, MAX_COUNTER: pr, MAX_WINDOW: lr, [er]: false });
function hr(r2) {
  if (!r2) return d;
  r2.MIN_SECRET_BYTES !== void 0 && y("MIN_SECRET_BYTES", r2.MIN_SECRET_BYTES, 1), r2.MAX_SECRET_BYTES !== void 0 && y("MAX_SECRET_BYTES", r2.MAX_SECRET_BYTES, 1), r2.MIN_PERIOD !== void 0 && y("MIN_PERIOD", r2.MIN_PERIOD, 1), r2.MAX_PERIOD !== void 0 && y("MAX_PERIOD", r2.MAX_PERIOD, 1), r2.MAX_COUNTER !== void 0 && y("MAX_COUNTER", r2.MAX_COUNTER, 0), r2.MAX_WINDOW !== void 0 && y("MAX_WINDOW", r2.MAX_WINDOW, 1);
  let e = { ...d, ...r2 };
  if (e.MIN_SECRET_BYTES > e.MAX_SECRET_BYTES) throw new a("Guardrail 'MIN_SECRET_BYTES' must be <= 'MAX_SECRET_BYTES'");
  if (e.MIN_PERIOD > e.MAX_PERIOD) throw new a("Guardrail 'MIN_PERIOD' must be <= 'MAX_PERIOD'");
  return Object.freeze({ ...e, [er]: true });
}
function Or(r2, e = d) {
  if (r2.length < e.MIN_SECRET_BYTES) throw new h(e.MIN_SECRET_BYTES, r2.length);
  if (r2.length > e.MAX_SECRET_BYTES) throw new P(e.MAX_SECRET_BYTES, r2.length);
}
function br(r2, e = d) {
  if (typeof r2 == "number") {
    if (!Number.isFinite(r2) || !Number.isInteger(r2)) throw new b();
    if (!Number.isSafeInteger(r2)) throw new T();
  }
  let t2 = typeof r2 == "bigint" ? r2 : BigInt(r2);
  if (t2 < 0n) throw new O();
  if (t2 > BigInt(e.MAX_COUNTER)) throw new T();
}
function Ar(r2) {
  if (!Number.isFinite(r2)) throw new S();
  if (r2 < 0) throw new C();
}
function Cr(r2, e = d) {
  if (!Number.isInteger(r2) || r2 < e.MIN_PERIOD) throw new w(e.MIN_PERIOD);
  if (r2 > e.MAX_PERIOD) throw new _(e.MAX_PERIOD);
}
function _r(r2) {
  let e = typeof r2 == "bigint" ? r2 : BigInt(r2), t2 = new ArrayBuffer(8);
  return new DataView(t2).setBigUint64(0, e, false), new Uint8Array(t2);
}
function Rr(r2) {
  let e = r2[r2.length - 1] & 15;
  return (r2[e] & 127) << 24 | r2[e + 1] << 16 | r2[e + 2] << 8 | r2[e + 3];
}
function Ir(r2, e) {
  let t2 = 10 ** e;
  return (r2 % t2).toString().padStart(e, "0");
}
function gr(r2, e) {
  return r2.length === e.length;
}
function tr(r2, e) {
  let t2 = rr(r2), o = rr(e);
  if (!gr(t2, o)) return false;
  let n = 0;
  for (let s = 0; s < t2.length; s++) n |= t2[s] ^ o[s];
  return n === 0;
}
function rr(r2) {
  return typeof r2 == "string" ? yr.encode(r2) : r2;
}
function vr(r2, e) {
  return typeof r2 == "string" ? (nr(e), e.decode(r2)) : r2;
}
function dr(r2) {
  if (!r2) throw new Y();
}
function nr(r2) {
  if (!r2) throw new L();
}
function Xr(r2) {
  if (!r2) throw new W();
}
var K = class {
  constructor(e) {
    this.crypto = e;
  }
  get plugin() {
    return this.crypto;
  }
  async hmac(e, t2, o) {
    try {
      let n = this.crypto.hmac(e, t2, o);
      return n instanceof Promise ? await n : n;
    } catch (n) {
      let s = n instanceof Error ? n.message : String(n);
      throw new c(s, { cause: n });
    }
  }
  hmacSync(e, t2, o) {
    try {
      let n = this.crypto.hmac(e, t2, o);
      if (n instanceof Promise) throw new c("Crypto plugin does not support synchronous HMAC operations");
      return n;
    } catch (n) {
      if (n instanceof c) throw n;
      let s = n instanceof Error ? n.message : String(n);
      throw new c(s, { cause: n });
    }
  }
  randomBytes(e) {
    try {
      return this.crypto.randomBytes(e);
    } catch (t2) {
      let o = t2 instanceof Error ? t2.message : String(t2);
      throw new v(o, { cause: t2 });
    }
  }
};
function Wr(r2) {
  return new K(r2);
}

// node_modules/.bun/@otplib+uri@13.3.0/node_modules/@otplib/uri/dist/index.js
var u = class extends Error {
  constructor(e) {
    super(e), this.name = "URIParseError";
  }
};
var a2 = class extends u {
  constructor(e) {
    super(`Invalid otpauth URI: ${e}`), this.name = "InvalidURIError";
  }
};
var g = class extends u {
  constructor(e) {
    super(`Missing required parameter: ${e}`), this.name = "MissingParameterError";
  }
};
var p = class extends u {
  constructor(e, s) {
    super(`Invalid value for parameter '${e}': ${s}`), this.name = "InvalidParameterError";
  }
};
var d2 = 2048;
var f = 512;
var y2 = 1024;
function I(r2, e) {
  let s = r2 instanceof Error ? r2.message : String(r2);
  return `Invalid URI encoding in ${e}: ${s}`;
}
function h2(r2, e, s) {
  if (r2.length > e * 3) throw new a2(`${s} exceeds maximum length`);
  try {
    let t2 = decodeURIComponent(r2);
    if (t2.length > e) throw new a2(`${s} exceeds maximum length of ${e} characters`);
    return t2;
  } catch (t2) {
    throw t2 instanceof a2 ? t2 : new a2(I(t2, s));
  }
}
function b2(r2) {
  if (r2.length > d2) throw new a2(`URI exceeds maximum length of ${d2} characters`);
  if (!r2.startsWith("otpauth://")) throw new a2(r2);
  let e = r2.slice(10), s = e.indexOf("/");
  if (s === -1) throw new a2(r2);
  let t2 = e.slice(0, s);
  if (t2 !== "hotp" && t2 !== "totp") throw new p("type", t2);
  let i2 = e.slice(s + 1), o = i2.indexOf("?"), n, c2;
  o === -1 ? (n = h2(i2, f, "label"), c2 = "") : (n = h2(i2.slice(0, o), f, "label"), c2 = i2.slice(o + 1));
  let l = O2(c2);
  if (!l.secret) throw new g("secret");
  return { type: t2, label: n, params: l };
}
function O2(r2) {
  let e = {};
  if (!r2) return e;
  let s = r2.split("&");
  for (let t2 of s) {
    let i2 = t2.indexOf("=");
    if (i2 === -1) continue;
    let o = h2(t2.slice(0, i2), 64, "parameter key"), n = h2(t2.slice(i2 + 1), y2, `parameter '${o}'`);
    switch (o) {
      case "secret":
        e.secret = n;
        break;
      case "issuer":
        e.issuer = n;
        break;
      case "algorithm":
        e.algorithm = T2(n);
        break;
      case "digits":
        e.digits = w2(n);
        break;
      case "counter":
        e.counter = P2("counter", n, 0);
        break;
      case "period":
        e.period = P2("period", n, 1);
        break;
    }
  }
  return e;
}
function P2(r2, e, s) {
  if (!/^-?\d+$/.test(e)) throw new p(r2, e);
  let t2 = Number(e);
  if (!Number.isSafeInteger(t2)) throw new p(r2, e);
  if (t2 < s) throw new p(r2, e);
  return t2;
}
function T2(r2) {
  let e = r2.toLowerCase();
  if (e === "sha1" || e === "sha-1") return "sha1";
  if (e === "sha256" || e === "sha-256") return "sha256";
  if (e === "sha512" || e === "sha-512") return "sha512";
  throw new p("algorithm", r2);
}
function w2(r2) {
  if (!/^\d+$/.test(r2)) throw new p("digits", r2);
  let e = Number(r2);
  if (e === 6 || e === 7 || e === 8) return e;
  throw new p("digits", r2);
}

// node_modules/.bun/@otplib+hotp@13.3.0/node_modules/@otplib/hotp/dist/index.js
function v2(u2) {
  let { secret: t2, counter: e, algorithm: r2 = "sha1", digits: i2 = 6, crypto: n, base32: o, guardrails: a3, hooks: s } = u2;
  Xr(t2), dr(n);
  let c2 = vr(t2, o);
  Or(c2, a3), br(e, a3);
  let p2 = Wr(n), l = _r(e);
  return { ctx: p2, algorithm: r2, digits: i2, secretBytes: c2, counterBytes: l, hooks: s };
}
function F(u2) {
  let { ctx: t2, algorithm: e, digits: r2, secretBytes: i2, counterBytes: n, hooks: o } = v2(u2), a3 = t2.hmacSync(e, i2, n), s = o?.truncateDigest ? o.truncateDigest(a3) : Rr(a3);
  return o?.encodeToken ? o.encodeToken(s, r2) : Ir(s, r2);
}

// node_modules/.bun/@otplib+totp@13.3.0/node_modules/@otplib/totp/dist/index.js
function k(r2) {
  let { secret: e, epoch: n = Math.floor(Date.now() / 1e3), t0: o = 0, period: i2 = 30, algorithm: s = "sha1", digits: l = 6, crypto: a3, base32: u2, guardrails: c2 = hr(), hooks: t2 } = r2;
  Xr(e), dr(a3);
  let p2 = vr(e, u2);
  Or(p2, c2), Ar(n), Cr(i2, c2);
  let f2 = Math.floor((n - o) / i2);
  return { secret: p2, counter: f2, algorithm: s, digits: l, crypto: a3, guardrails: c2, hooks: t2 };
}
function Z2(r2) {
  let e = k(r2);
  return F(e);
}

// node_modules/.bun/@scure+base@2.0.0/node_modules/@scure/base/index.js
function isBytes(a3) {
  return a3 instanceof Uint8Array || ArrayBuffer.isView(a3) && a3.constructor.name === "Uint8Array";
}
function isArrayOf(isString, arr) {
  if (!Array.isArray(arr))
    return false;
  if (arr.length === 0)
    return true;
  if (isString) {
    return arr.every((item) => typeof item === "string");
  } else {
    return arr.every((item) => Number.isSafeInteger(item));
  }
}
function astr(label, input) {
  if (typeof input !== "string")
    throw new Error(`${label}: string expected`);
  return true;
}
function anumber(n) {
  if (!Number.isSafeInteger(n))
    throw new Error(`invalid integer: ${n}`);
}
function aArr(input) {
  if (!Array.isArray(input))
    throw new Error("array expected");
}
function astrArr(label, input) {
  if (!isArrayOf(true, input))
    throw new Error(`${label}: array of strings expected`);
}
function anumArr(label, input) {
  if (!isArrayOf(false, input))
    throw new Error(`${label}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function chain(...args) {
  const id = (a3) => a3;
  const wrap = (a3, b3) => (c2) => a3(b3(c2));
  const encode = args.map((x2) => x2.encode).reduceRight(wrap, id);
  const decode = args.map((x2) => x2.decode).reduce(wrap, id);
  return { encode, decode };
}
// @__NO_SIDE_EFFECTS__
function alphabet(letters) {
  const lettersA = typeof letters === "string" ? letters.split("") : letters;
  const len = lettersA.length;
  astrArr("alphabet", lettersA);
  const indexes = new Map(lettersA.map((l, i2) => [l, i2]));
  return {
    encode: (digits) => {
      aArr(digits);
      return digits.map((i2) => {
        if (!Number.isSafeInteger(i2) || i2 < 0 || i2 >= len)
          throw new Error(`alphabet.encode: digit index outside alphabet "${i2}". Allowed: ${letters}`);
        return lettersA[i2];
      });
    },
    decode: (input) => {
      aArr(input);
      return input.map((letter) => {
        astr("alphabet.decode", letter);
        const i2 = indexes.get(letter);
        if (i2 === void 0)
          throw new Error(`Unknown letter: "${letter}". Allowed: ${letters}`);
        return i2;
      });
    }
  };
}
// @__NO_SIDE_EFFECTS__
function join(separator = "") {
  astr("join", separator);
  return {
    encode: (from) => {
      astrArr("join.decode", from);
      return from.join(separator);
    },
    decode: (to) => {
      astr("join.decode", to);
      return to.split(separator);
    }
  };
}
// @__NO_SIDE_EFFECTS__
function padding(bits, chr = "=") {
  anumber(bits);
  astr("padding", chr);
  return {
    encode(data) {
      astrArr("padding.encode", data);
      while (data.length * bits % 8)
        data.push(chr);
      return data;
    },
    decode(input) {
      astrArr("padding.decode", input);
      let end = input.length;
      if (end * bits % 8)
        throw new Error("padding: invalid, string should have whole number of bytes");
      for (; end > 0 && input[end - 1] === chr; end--) {
        const last = end - 1;
        const byte = last * bits;
        if (byte % 8 === 0)
          throw new Error("padding: invalid, string has too much padding");
      }
      return input.slice(0, end);
    }
  };
}
var gcd = (a3, b3) => b3 === 0 ? a3 : gcd(b3, a3 % b3);
var radix2carry = /* @__NO_SIDE_EFFECTS__ */ (from, to) => from + (to - gcd(from, to));
var powers = /* @__PURE__ */ (() => {
  let res = [];
  for (let i2 = 0; i2 < 40; i2++)
    res.push(2 ** i2);
  return res;
})();
function convertRadix2(data, from, to, padding2) {
  aArr(data);
  if (from <= 0 || from > 32)
    throw new Error(`convertRadix2: wrong from=${from}`);
  if (to <= 0 || to > 32)
    throw new Error(`convertRadix2: wrong to=${to}`);
  if (/* @__PURE__ */ radix2carry(from, to) > 32) {
    throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${/* @__PURE__ */ radix2carry(from, to)}`);
  }
  let carry = 0;
  let pos = 0;
  const max = powers[from];
  const mask = powers[to] - 1;
  const res = [];
  for (const n of data) {
    anumber(n);
    if (n >= max)
      throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
    carry = carry << from | n;
    if (pos + from > 32)
      throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
    pos += from;
    for (; pos >= to; pos -= to)
      res.push((carry >> pos - to & mask) >>> 0);
    const pow = powers[pos];
    if (pow === void 0)
      throw new Error("invalid carry");
    carry &= pow - 1;
  }
  carry = carry << to - pos & mask;
  if (!padding2 && pos >= from)
    throw new Error("Excess padding");
  if (!padding2 && carry > 0)
    throw new Error(`Non-zero padding: ${carry}`);
  if (padding2 && pos > 0)
    res.push(carry >>> 0);
  return res;
}
// @__NO_SIDE_EFFECTS__
function radix2(bits, revPadding = false) {
  anumber(bits);
  if (bits <= 0 || bits > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (/* @__PURE__ */ radix2carry(8, bits) > 32 || /* @__PURE__ */ radix2carry(bits, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (bytes) => {
      if (!isBytes(bytes))
        throw new Error("radix2.encode input should be Uint8Array");
      return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
    },
    decode: (digits) => {
      anumArr("radix2.decode", digits);
      return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
    }
  };
}
var base32 = /* @__PURE__ */ chain(/* @__PURE__ */ radix2(5), /* @__PURE__ */ alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), /* @__PURE__ */ padding(5), /* @__PURE__ */ join(""));

// node_modules/.bun/@otplib+plugin-base32-scure@13.3.0/node_modules/@otplib/plugin-base32-scure/dist/index.js
var r = class {
  name = "scure";
  encode(o, e = {}) {
    let { padding: t2 = false } = e, n = base32.encode(o);
    return t2 ? n : n.replace(/=+$/, "");
  }
  decode(o) {
    try {
      let e = o.toUpperCase(), t2 = e.padEnd(Math.ceil(e.length / 8) * 8, "=");
      return base32.decode(t2);
    } catch (e) {
      throw e instanceof Error ? new Error(`Invalid Base32 string: ${e.message}`) : new Error("Invalid Base32 string");
    }
  }
};
var d3 = Object.freeze(new r());

// node_modules/.bun/@noble+hashes@2.0.1/node_modules/@noble/hashes/utils.js
function isBytes2(a3) {
  return a3 instanceof Uint8Array || ArrayBuffer.isView(a3) && a3.constructor.name === "Uint8Array";
}
function anumber2(n, title = "") {
  if (!Number.isSafeInteger(n) || n < 0) {
    const prefix = title && `"${title}" `;
    throw new Error(`${prefix}expected integer >= 0, got ${n}`);
  }
}
function abytes(value, length, title = "") {
  const bytes = isBytes2(value);
  const len = value?.length;
  const needsLen = length !== void 0;
  if (!bytes || needsLen && len !== length) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value;
}
function ahash(h3) {
  if (typeof h3 !== "function" || typeof h3.create !== "function")
    throw new Error("Hash must wrapped by utils.createHasher");
  anumber2(h3.outputLen);
  anumber2(h3.blockLen);
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes(out, void 0, "digestInto() output");
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error('"digestInto() output" expected to be of length >=' + min);
  }
}
function clean(...arrays) {
  for (let i2 = 0; i2 < arrays.length; i2++) {
    arrays[i2].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function rotl(word, shift) {
  return word << shift | word >>> 32 - shift >>> 0;
}
function createHasher(hashCons, info = {}) {
  const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
function randomBytes(bytesLength = 32) {
  const cr = typeof globalThis === "object" ? globalThis.crypto : null;
  if (typeof cr?.getRandomValues !== "function")
    throw new Error("crypto.getRandomValues must be defined");
  return cr.getRandomValues(new Uint8Array(bytesLength));
}
var oidNist = (suffix) => ({
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
});

// node_modules/.bun/@noble+hashes@2.0.1/node_modules/@noble/hashes/hmac.js
var _HMAC = class {
  oHash;
  iHash;
  blockLen;
  outputLen;
  finished = false;
  destroyed = false;
  constructor(hash, key) {
    ahash(hash);
    abytes(key, void 0, "key");
    this.iHash = hash.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
    for (let i2 = 0; i2 < pad.length; i2++)
      pad[i2] ^= 54;
    this.iHash.update(pad);
    this.oHash = hash.create();
    for (let i2 = 0; i2 < pad.length; i2++)
      pad[i2] ^= 54 ^ 92;
    this.oHash.update(pad);
    clean(pad);
  }
  update(buf) {
    aexists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    aexists(this);
    abytes(out, this.outputLen, "output");
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to ||= Object.create(Object.getPrototypeOf(this), {});
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac = (hash, key, message) => new _HMAC(hash, key).update(message).digest();
hmac.create = (hash, key) => new _HMAC(hash, key);

// node_modules/.bun/@noble+hashes@2.0.1/node_modules/@noble/hashes/_md.js
function Chi(a3, b3, c2) {
  return a3 & b3 ^ ~a3 & c2;
}
function Maj(a3, b3, c2) {
  return a3 & b3 ^ a3 & c2 ^ b3 & c2;
}
var HashMD = class {
  blockLen;
  outputLen;
  padOffset;
  isLE;
  // For partial updates less than block size
  buffer;
  view;
  finished = false;
  length = 0;
  pos = 0;
  destroyed = false;
  constructor(blockLen, outputLen, padOffset, isLE) {
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    abytes(data);
    const { view, buffer, blockLen } = this;
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    clean(this.buffer.subarray(pos));
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i2 = pos; i2 < blockLen; i2++)
      buffer[i2] = 0;
    view.setBigUint64(blockLen - 8, BigInt(this.length * 8), isLE);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen must be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i2 = 0; i2 < outLen; i2++)
      oview.setUint32(4 * i2, state[i2], isLE);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to ||= new this.constructor();
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
};
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA512_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  4089235720,
  3144134277,
  2227873595,
  1013904242,
  4271175723,
  2773480762,
  1595750129,
  1359893119,
  2917565137,
  2600822924,
  725511199,
  528734635,
  4215389547,
  1541459225,
  327033209
]);

// node_modules/.bun/@noble+hashes@2.0.1/node_modules/@noble/hashes/legacy.js
var SHA1_IV = /* @__PURE__ */ Uint32Array.from([
  1732584193,
  4023233417,
  2562383102,
  271733878,
  3285377520
]);
var SHA1_W = /* @__PURE__ */ new Uint32Array(80);
var _SHA1 = class extends HashMD {
  A = SHA1_IV[0] | 0;
  B = SHA1_IV[1] | 0;
  C = SHA1_IV[2] | 0;
  D = SHA1_IV[3] | 0;
  E = SHA1_IV[4] | 0;
  constructor() {
    super(64, 20, 8, false);
  }
  get() {
    const { A: A3, B: B2, C: C2, D, E } = this;
    return [A3, B2, C2, D, E];
  }
  set(A3, B2, C2, D, E) {
    this.A = A3 | 0;
    this.B = B2 | 0;
    this.C = C2 | 0;
    this.D = D | 0;
    this.E = E | 0;
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4)
      SHA1_W[i2] = view.getUint32(offset, false);
    for (let i2 = 16; i2 < 80; i2++)
      SHA1_W[i2] = rotl(SHA1_W[i2 - 3] ^ SHA1_W[i2 - 8] ^ SHA1_W[i2 - 14] ^ SHA1_W[i2 - 16], 1);
    let { A: A3, B: B2, C: C2, D, E } = this;
    for (let i2 = 0; i2 < 80; i2++) {
      let F2, K2;
      if (i2 < 20) {
        F2 = Chi(B2, C2, D);
        K2 = 1518500249;
      } else if (i2 < 40) {
        F2 = B2 ^ C2 ^ D;
        K2 = 1859775393;
      } else if (i2 < 60) {
        F2 = Maj(B2, C2, D);
        K2 = 2400959708;
      } else {
        F2 = B2 ^ C2 ^ D;
        K2 = 3395469782;
      }
      const T3 = rotl(A3, 5) + F2 + E + K2 + SHA1_W[i2] | 0;
      E = D;
      D = C2;
      C2 = rotl(B2, 30);
      B2 = A3;
      A3 = T3;
    }
    A3 = A3 + this.A | 0;
    B2 = B2 + this.B | 0;
    C2 = C2 + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    this.set(A3, B2, C2, D, E);
  }
  roundClean() {
    clean(SHA1_W);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0);
    clean(this.buffer);
  }
};
var sha1 = /* @__PURE__ */ createHasher(() => new _SHA1());

// node_modules/.bun/@noble+hashes@2.0.1/node_modules/@noble/hashes/_u64.js
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i2 = 0; i2 < len; i2++) {
    const { h: h3, l } = fromBig(lst[i2], le);
    [Ah[i2], Al[i2]] = [h3, l];
  }
  return [Ah, Al];
}
var shrSH = (h3, _l, s) => h3 >>> s;
var shrSL = (h3, l, s) => h3 << 32 - s | l >>> s;
var rotrSH = (h3, l, s) => h3 >>> s | l << 32 - s;
var rotrSL = (h3, l, s) => h3 << 32 - s | l >>> s;
var rotrBH = (h3, l, s) => h3 << 64 - s | l >>> s - 32;
var rotrBL = (h3, l, s) => h3 >>> s - 32 | l << 64 - s;
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;

// node_modules/.bun/@noble+hashes@2.0.1/node_modules/@noble/hashes/sha2.js
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA2_32B = class extends HashMD {
  constructor(outputLen) {
    super(64, outputLen, 8, false);
  }
  get() {
    const { A: A3, B: B2, C: C2, D, E, F: F2, G: G2, H } = this;
    return [A3, B2, C2, D, E, F2, G2, H];
  }
  // prettier-ignore
  set(A3, B2, C2, D, E, F2, G2, H) {
    this.A = A3 | 0;
    this.B = B2 | 0;
    this.C = C2 | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F2 | 0;
    this.G = G2 | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4)
      SHA256_W[i2] = view.getUint32(offset, false);
    for (let i2 = 16; i2 < 64; i2++) {
      const W15 = SHA256_W[i2 - 15];
      const W2 = SHA256_W[i2 - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i2] = s1 + SHA256_W[i2 - 7] + s0 + SHA256_W[i2 - 16] | 0;
    }
    let { A: A3, B: B2, C: C2, D, E, F: F2, G: G2, H } = this;
    for (let i2 = 0; i2 < 64; i2++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F2, G2) + SHA256_K[i2] + SHA256_W[i2] | 0;
      const sigma0 = rotr(A3, 2) ^ rotr(A3, 13) ^ rotr(A3, 22);
      const T22 = sigma0 + Maj(A3, B2, C2) | 0;
      H = G2;
      G2 = F2;
      F2 = E;
      E = D + T1 | 0;
      D = C2;
      C2 = B2;
      B2 = A3;
      A3 = T1 + T22 | 0;
    }
    A3 = A3 + this.A | 0;
    B2 = B2 + this.B | 0;
    C2 = C2 + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F2 = F2 + this.F | 0;
    G2 = G2 + this.G | 0;
    H = H + this.H | 0;
    this.set(A3, B2, C2, D, E, F2, G2, H);
  }
  roundClean() {
    clean(SHA256_W);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean(this.buffer);
  }
};
var _SHA256 = class extends SHA2_32B {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  A = SHA256_IV[0] | 0;
  B = SHA256_IV[1] | 0;
  C = SHA256_IV[2] | 0;
  D = SHA256_IV[3] | 0;
  E = SHA256_IV[4] | 0;
  F = SHA256_IV[5] | 0;
  G = SHA256_IV[6] | 0;
  H = SHA256_IV[7] | 0;
  constructor() {
    super(32);
  }
};
var K512 = /* @__PURE__ */ (() => split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n) => BigInt(n))))();
var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
var SHA2_64B = class extends HashMD {
  constructor(outputLen) {
    super(128, outputLen, 16, false);
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4) {
      SHA512_W_H[i2] = view.getUint32(offset);
      SHA512_W_L[i2] = view.getUint32(offset += 4);
    }
    for (let i2 = 16; i2 < 80; i2++) {
      const W15h = SHA512_W_H[i2 - 15] | 0;
      const W15l = SHA512_W_L[i2 - 15] | 0;
      const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
      const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i2 - 2] | 0;
      const W2l = SHA512_W_L[i2 - 2] | 0;
      const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
      const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
      const SUMl = add4L(s0l, s1l, SHA512_W_L[i2 - 7], SHA512_W_L[i2 - 16]);
      const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i2 - 7], SHA512_W_H[i2 - 16]);
      SHA512_W_H[i2] = SUMh | 0;
      SHA512_W_L[i2] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i2 = 0; i2 < 80; i2++) {
      const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
      const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i2], SHA512_W_L[i2]);
      const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i2], SHA512_W_H[i2]);
      const T1l = T1ll | 0;
      const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
      const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = add3L(T1l, sigma0l, MAJl);
      Ah = add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    clean(SHA512_W_H, SHA512_W_L);
  }
  destroy() {
    clean(this.buffer);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var _SHA512 = class extends SHA2_64B {
  Ah = SHA512_IV[0] | 0;
  Al = SHA512_IV[1] | 0;
  Bh = SHA512_IV[2] | 0;
  Bl = SHA512_IV[3] | 0;
  Ch = SHA512_IV[4] | 0;
  Cl = SHA512_IV[5] | 0;
  Dh = SHA512_IV[6] | 0;
  Dl = SHA512_IV[7] | 0;
  Eh = SHA512_IV[8] | 0;
  El = SHA512_IV[9] | 0;
  Fh = SHA512_IV[10] | 0;
  Fl = SHA512_IV[11] | 0;
  Gh = SHA512_IV[12] | 0;
  Gl = SHA512_IV[13] | 0;
  Hh = SHA512_IV[14] | 0;
  Hl = SHA512_IV[15] | 0;
  constructor() {
    super(64);
  }
};
var sha256 = /* @__PURE__ */ createHasher(
  () => new _SHA256(),
  /* @__PURE__ */ oidNist(1)
);
var sha512 = /* @__PURE__ */ createHasher(
  () => new _SHA512(),
  /* @__PURE__ */ oidNist(3)
);

// node_modules/.bun/@otplib+plugin-crypto-noble@13.3.0/node_modules/@otplib/plugin-crypto-noble/dist/index.js
var t = class {
  name = "noble";
  hmac(r2, n, a3) {
    return hmac(r2 === "sha1" ? sha1 : r2 === "sha256" ? sha256 : sha512, n, a3);
  }
  randomBytes(r2) {
    return randomBytes(r2);
  }
  constantTimeEqual(r2, n) {
    return tr(r2, n);
  }
};
var A2 = Object.freeze(new t());

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
function Ok(data) {
  return [data, null];
}
function Err(error) {
  return [null, error];
}
function tryCatch(fnOrPromise) {
  if (typeof fnOrPromise === "function") {
    try {
      return Ok(fnOrPromise());
    } catch (error) {
      return Err(error);
    }
  }
  return fnOrPromise.then((data) => Ok(data)).catch((error) => Err(error));
}

// src/utils/development.ts
var import_api2 = require("@raycast/api");
var import_api3 = require("@raycast/api");
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
  if (import_api2.environment.isDevelopment) {
    console.error(desc, error);
  } else if (captureToRaycast) {
    (0, import_api3.captureException)(error);
  }
};
var debugLog = (...args) => {
  if (!import_api2.environment.isDevelopment) return;
  console.debug(...args);
};

// src/utils/authenticatorTotp.ts
var guardrails = hr({ MIN_SECRET_BYTES: 10 });
var STEAM_CHARS = "23456789BCDFGHJKMNPQRTVWXY";
var STEAM_PERIOD = 30;
var steamHooks = {
  encodeToken(truncatedValue, digits) {
    let code = "";
    let value = truncatedValue;
    for (let i2 = 0; i2 < digits; i2++) {
      code += STEAM_CHARS[value % STEAM_CHARS.length];
      value = Math.floor(value / STEAM_CHARS.length);
    }
    return code;
  },
  validateToken(token, digits) {
    if (token.length !== digits) {
      throw new Error(`Expected ${digits} characters, got ${token.length}`);
    }
    for (const ch of token) {
      if (!STEAM_CHARS.includes(ch)) {
        throw new Error(`Invalid character: ${ch}`);
      }
    }
  }
};
function createTotpGenerator(opts) {
  const getEpoch = (timestamp = Date.now()) => Math.floor(timestamp / 1e3);
  const getRemaining = (period2) => {
    return (timestamp) => {
      const elapsed = getEpoch(timestamp) % period2;
      return (period2 - elapsed) * 1e3;
    };
  };
  if (opts.variant === "steam") {
    const { secret: secret2 } = opts;
    return {
      period: STEAM_PERIOD,
      remaining: getRemaining(STEAM_PERIOD),
      generate: (timestamp) => {
        return Z2({
          secret: secret2,
          digits: 5,
          period: STEAM_PERIOD,
          crypto: A2,
          base32: d3,
          guardrails,
          hooks: steamHooks,
          ...timestamp != null && { epoch: getEpoch(timestamp) }
        });
      }
    };
  }
  const { secret, period, algorithm, digits } = opts;
  return {
    period,
    remaining: getRemaining(period),
    generate: (timestamp) => {
      return Z2({
        secret,
        period,
        digits,
        crypto: A2,
        base32: d3,
        guardrails,
        algorithm: algorithm.toLowerCase(),
        ...timestamp != null && { epoch: getEpoch(timestamp) }
      });
    }
  };
}
function parseTotp(totpString) {
  if (totpString.includes("otpauth")) {
    const [parsed, parseError] = tryCatch(() => b2(totpString));
    if (parseError) throw parseError;
    if (parsed.type !== "totp") throw new Error("Invalid authenticator key");
    const { secret, period = 30, algorithm = "sha1", digits = 6 } = parsed.params;
    return { secret, period, algorithm, digits };
  }
  return { secret: totpString, period: 30, algorithm: "sha1", digits: 6 };
}
function getGenerator(totpString) {
  let generatorOptions = void 0;
  if (totpString.startsWith("steam://")) {
    const secret = totpString.slice("steam://".length).trim();
    if (!secret) return Err(new Error("Invalid Steam Guard key"));
    generatorOptions = { variant: "steam", secret };
  } else {
    const [options, parseError] = tryCatch(() => parseTotp(totpString));
    if (parseError) {
      captureException("Failed to parse key", parseError);
      return Err(new Error("Failed to parse authenticator key"));
    }
    generatorOptions = { variant: "regular", ...options };
  }
  const [generator, error] = tryCatch(() => createTotpGenerator(generatorOptions));
  if (error) {
    captureException("Failed to initialize authenticator", error);
    return Err(new Error("Failed to initialize authenticator"));
  }
  return Ok(generator);
}

// src/components/RootErrorBoundary.tsx
var import_api28 = require("@raycast/api");
var import_react13 = require("react");

// src/components/TroubleshootingGuide.tsx
var import_api27 = require("@raycast/api");

// src/components/actions/ActionWithReprompt.tsx
var import_api18 = require("@raycast/api");

// src/components/searchVault/context/vaultItem.tsx
var import_react2 = require("react");
var VaultItemContext = (0, import_react2.createContext)(null);
var useSelectedVaultItem = () => {
  const session = (0, import_react2.useContext)(VaultItemContext);
  if (session == null) {
    throw new Error("useSelectVaultItem must be used within a VaultItemContext.Provider");
  }
  return session;
};
var vaultItem_default = VaultItemContext;

// src/utils/hooks/useReprompt.tsx
var import_api17 = require("@raycast/api");

// src/components/RepromptForm.tsx
var import_api4 = require("@raycast/api");
var import_jsx_runtime2 = require("react/jsx-runtime");
var RepromptForm = (props) => {
  const { description, onConfirm } = props;
  function onSubmit(values) {
    onConfirm(values.password);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    import_api4.Form,
    {
      navigationTitle: "Confirmation Required",
      actions: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api4.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api4.Action.SubmitForm, { title: "Confirm", onSubmit }) }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api4.Form.Description, { title: "Confirmation Required for", text: description }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api4.Form.PasswordField, { autoFocus: true, id: "password", title: "Master Password" })
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
var import_api5 = require("@raycast/api");

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
  [1 /* LOGIN */]: import_api5.Icon.Globe,
  [3 /* CARD */]: import_api5.Icon.CreditCard,
  [4 /* IDENTITY */]: import_api5.Icon.Person,
  [2 /* NOTE */]: import_api5.Icon.Document,
  [5 /* SSH_KEY */]: import_api5.Icon.Key
};

// src/context/bitwarden.tsx
var import_react4 = require("react");

// src/api/bitwarden.ts
var import_api9 = require("@raycast/api");

// node_modules/.bun/execa@7.0.0/node_modules/execa/index.js
var import_node_buffer = require("node:buffer");
var import_node_path3 = __toESM(require("node:path"), 1);
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
var import_node_path2 = __toESM(require("node:path"), 1);
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
  let cwdPath = import_node_path2.default.resolve(cwdString);
  const result = [];
  while (previous !== cwdPath) {
    result.push(import_node_path2.default.join(cwdPath, "node_modules/.bin"));
    previous = cwdPath;
    cwdPath = import_node_path2.default.resolve(cwdPath, "..");
  }
  result.push(import_node_path2.default.resolve(cwdString, execPath, ".."));
  return [...result, path_].join(import_node_path2.default.delimiter);
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
  const t2 = setTimeout(() => {
    kill("SIGKILL");
  }, timeout);
  if (t2.unref) {
    t2.unref();
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
  if (import_node_process2.default.platform === "win32" && import_node_path3.default.basename(file, ".exe") === "cmd") {
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
var import_api6 = require("@raycast/api");
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
var import_api7 = require("@raycast/api");

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
var ITEM_TYPE_TO_LABEL = {
  [1 /* LOGIN */]: "Login",
  [3 /* CARD */]: "Card",
  [4 /* IDENTITY */]: "Identity",
  [2 /* NOTE */]: "Secure Note",
  [5 /* SSH_KEY */]: "SSH Key"
};

// src/utils/preferences.ts
function getServerUrlPreference() {
  const { serverUrl } = (0, import_api7.getPreferenceValues)();
  return !serverUrl || serverUrl === "bitwarden.com" || serverUrl === "https://bitwarden.com" ? void 0 : serverUrl;
}
var COMMAND_NAME_TO_PREFERENCE_KEY_MAP = {
  search: "transientCopySearch",
  "generate-password": "transientCopyGeneratePassword",
  "generate-password-quick": "transientCopyGeneratePasswordQuick"
};
function getTransientCopyPreference(type) {
  const preferenceKey = COMMAND_NAME_TO_PREFERENCE_KEY_MAP[import_api7.environment.commandName];
  const transientPreference = (0, import_api7.getPreferenceValues)()[preferenceKey];
  if (transientPreference === "never") return false;
  if (transientPreference === "always") return true;
  if (transientPreference === "passwords") return type === "password";
  return true;
}
function getLabelForTimeoutPreference(timeout) {
  return VAULT_TIMEOUT_MS_TO_LABEL[timeout];
}

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
  const { onProgress, sha256: sha2562 } = options ?? {};
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
          if (sha2562) await waitForHashToMatch(path3, sha2562);
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
function waitForHashToMatch(path3, sha2562) {
  return new Promise((resolve, reject) => {
    const fileSha = getFileSha256(path3);
    if (!fileSha) return reject(new Error(`Could not generate hash for file ${path3}.`));
    if (fileSha === sha2562) return resolve();
    const interval = setInterval(() => {
      if (getFileSha256(path3) === sha2562) {
        clearInterval(interval);
        clearTimeout(timeoutId);
        resolve();
      }
    }, 1e3);
    const timeoutId = setTimeout(() => {
      clearInterval(interval);
      reject(new Error(`Hash did not match, expected ${sha2562.substring(0, 7)}, got ${fileSha.substring(0, 7)}.`));
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
var import_api8 = require("@raycast/api");
var Cache = new import_api8.Cache({ namespace: "bw-cache" });

// src/utils/platform.ts
var platform = process.platform === "darwin" ? "macos" : process.platform === "win32" ? "windows" : "linux";

// src/api/bitwarden.ts
var { supportPath } = import_api9.environment;
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
    this.preferences = (0, import_api9.getPreferenceValues)();
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
        const toast = await (0, import_api9.showToast)(toastOpts);
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
      style: import_api9.Toast.Style.Animated,
      primaryAction: { title: "Open Download Page", onAction: () => (0, import_api9.open)(cliInfo.downloadPage) }
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
      toast.style = import_api9.Toast.Style.Failure;
      unlinkAllSync(zipPath, this.cliPath);
      if (!import_api9.environment.isDevelopment) BinDownloadLogger.logError(error);
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
    const storedServer = await import_api9.LocalStorage.getItem(LOCAL_STORAGE_KEY.SERVER_URL);
    if (!serverUrl || storedServer === serverUrl) return;
    const toast = await this.showToast({
      style: import_api9.Toast.Style.Animated,
      title: "Switching server...",
      message: "Bitwarden server preference changed"
    });
    try {
      try {
        await this.logout();
      } catch {
      }
      await this.exec(["config", "server", serverUrl || DEFAULT_SERVER_URL], { resetVaultTimeout: false });
      await import_api9.LocalStorage.setItem(LOCAL_STORAGE_KEY.SERVER_URL, serverUrl);
      toast.style = import_api9.Toast.Style.Success;
      toast.title = "Success";
      toast.message = "Bitwarden server changed";
    } catch (error) {
      toast.style = import_api9.Toast.Style.Failure;
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
      await import_api9.LocalStorage.setItem(LOCAL_STORAGE_KEY.LAST_ACTIVITY_TIME, (/* @__PURE__ */ new Date()).toISOString());
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
    await import_api9.LocalStorage.setItem(LOCAL_STORAGE_KEY.VAULT_LAST_STATUS, status);
  }
  async getLastSavedVaultStatus() {
    const lastSavedStatus = await import_api9.LocalStorage.getItem(LOCAL_STORAGE_KEY.VAULT_LAST_STATUS);
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
var import_api10 = require("@raycast/api");
var import_jsx_runtime3 = require("react/jsx-runtime");
var LoadingFallback = () => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_api10.Form, { isLoading: true });

// src/utils/hooks/useOnceEffect.ts
var import_react3 = require("react");
function useOnceEffect(effect, condition) {
  const hasRun = (0, import_react3.useRef)(false);
  (0, import_react3.useEffect)(() => {
    if (hasRun.current) return;
    if (condition !== void 0 && !condition) return;
    hasRun.current = true;
    void effect();
  }, [condition]);
}
var useOnceEffect_default = useOnceEffect;

// src/context/bitwarden.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var BitwardenContext = (0, import_react4.createContext)(null);
var BitwardenProvider = ({ children, loadingFallback = /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(LoadingFallback, {}) }) => {
  const [bitwarden, setBitwarden] = (0, import_react4.useState)();
  const [error, setError] = (0, import_react4.useState)();
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
  if (error) return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TroubleshootingGuide_default, { error });
  if (!bitwarden) return loadingFallback;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(BitwardenContext.Provider, { value: bitwarden, children });
};
var useBitwarden = () => {
  const context = (0, import_react4.useContext)(BitwardenContext);
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
var import_api11 = require("@raycast/api");
var import_react5 = require("react");
function useVaultMessages() {
  const bitwarden = useBitwarden();
  const [vaultState, setVaultState] = (0, import_react5.useState)(null);
  (0, import_react5.useEffect)(() => {
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
      void (0, import_api11.confirmAlert)({
        icon: import_api11.Icon.ExclamationMark,
        title: "Restart Required",
        message: "Bitwarden server URL preference has been changed since the extension was opened.",
        primaryAction: {
          title: "Close Extension"
        },
        dismissAction: {
          title: "Close Raycast",
          // Only here to provide the necessary second option
          style: import_api11.Alert.ActionStyle.Cancel
        }
      }).then((closeExtension) => {
        if (closeExtension) {
          void (0, import_api11.popToRoot)();
        } else {
          void (0, import_api11.closeMainWindow)();
        }
      });
    }
  }
  return { userMessage, serverMessage, shouldShowServer };
}
var useVaultMessages_default = useVaultMessages;

// src/utils/localstorage.ts
var import_api12 = require("@raycast/api");
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
        const { type: _2, ...actionPayload } = action;
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
function favoriteItemsFirstSorter(a3, b3) {
  if (a3.favorite && b3.favorite) return 0;
  return a3.favorite ? -1 : 1;
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

// src/components/searchVault/utils/useItemIcon.ts
var import_api30 = require("@raycast/api");
var import_react15 = require("react");

// src/utils/cards.ts
var CARD_KEY_LABEL_KEYS = Object.keys(CARD_KEY_LABEL);
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

// src/utils/search.ts
var import_api29 = require("@raycast/api");

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
  for (let i2 = rows.length - 2; i2 > 0 && start > 1; i2--) {
    const row = rows[i2];
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
  for (let i2 = 0; i2 < rowCount; i2++) {
    rows[i2] = new Array(columnCount);
    rows[i2][0] = i2;
  }
  for (let i2 = 0; i2 < columnCount; i2++) {
    rows[0][i2] = i2;
  }
  return rows;
}
function initSellersRows(rowCount, columnCount) {
  const rows = new Array(rowCount);
  rows[0] = new Array(columnCount).fill(0);
  for (let i2 = 1; i2 < rowCount; i2++) {
    rows[i2] = new Array(columnCount);
    rows[i2][0] = i2;
  }
  return rows;
}
function levCore(term, candidate, rows, i2, j) {
  const rowA = rows[i2];
  const rowB = rows[i2 + 1];
  const cost = term[i2] === candidate[j] ? 0 : 1;
  let m2;
  let min = rowB[j] + 1;
  if ((m2 = rowA[j + 1] + 1) < min) min = m2;
  if ((m2 = rowA[j] + cost) < min) min = m2;
  rowB[j + 1] = min;
}
function levenshtein(term, candidate, rows, j) {
  for (let i2 = 0; i2 < term.length; i2++) {
    levCore(term, candidate, rows, i2, j);
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
  for (let i2 = 1; i2 < term.length; i2++) {
    const rowA = rows[i2 - 1];
    const rowB = rows[i2];
    const rowC = rows[i2 + 1];
    const cost = term[i2] === candidate[j] ? 0 : 1;
    let m2;
    let min = rowC[j] + 1;
    if ((m2 = rowB[j + 1] + 1) < min) min = m2;
    if ((m2 = rowB[j] + cost) < min) min = m2;
    if (term[i2] === candidate[j - 1] && term[i2 - 1] === candidate[j] && (m2 = rowA[j - 1] + cost) < min) min = m2;
    rowC[j + 1] = min;
  }
}
function trieInsert(trie, string, item) {
  let walker = trie;
  for (let i2 = 0; i2 < string.length; i2++) {
    const char = string[i2];
    if (walker.children[char] == null) {
      walker.children[char] = {
        children: {},
        candidates: [],
        depth: 0
      };
    }
    walker.depth = Math.max(walker.depth, string.length - i2);
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
function compareItemsBestScore(a3, b3) {
  const scoreDiff = b3.score - a3.score;
  if (scoreDiff !== 0) {
    return scoreDiff;
  }
  const matchPosDiff = a3.match.start - b3.match.start;
  if (matchPosDiff !== 0) {
    return matchPosDiff;
  }
  const keyIndexDiff = a3.keyIndex - b3.keyIndex;
  if (keyIndexDiff !== 0) {
    return keyIndexDiff;
  }
  const lengthDiff = a3.lengthDiff - b3.lengthDiff;
  if (lengthDiff !== 0) {
    return lengthDiff;
  }
  return compareItemsInsertOrder(a3, b3);
}
function compareItemsInsertOrder(a3, b3) {
  return a3.index - b3.index;
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
function sellersShouldContinue(node, _2, term, threshold, sValue, lastValue) {
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
var import_react14 = require("react");
var import_url = require("url");
function faviconUrl(url2) {
  try {
    const domain = new import_url.URL(url2).hostname;
    return `https://icons.bitwarden.net/${domain}/icon.png`;
  } catch (err) {
    return import_api29.Icon.Globe;
  }
}
function useVaultSearch(items) {
  const [searchText, setSearchText] = (0, import_react14.useState)("");
  const searcher = (0, import_react14.useMemo)(() => {
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
  const filteredItems = (0, import_react14.useMemo)(() => {
    if (!searchText) return items;
    return searcher.search(searchText);
  }, [searcher, searchText]);
  return { setSearchText, filteredItems };
}

// src/components/searchVault/utils/useItemIcon.ts
var { fetchFavicons } = (0, import_api30.getPreferenceValues)();
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
  return (0, import_react15.useMemo)(() => {
    const imageOrIcon = ITEM_TYPE_TO_IMAGE_OR_ICON_MAP[item.type]?.(item);
    if (imageOrIcon) return imageOrIcon;
    return import_api30.Icon.QuestionMark;
  }, [item.type, item.card?.brand, item.login?.uris?.[0]?.uri]);
}

// src/components/searchVault/utils/useGetUpdatedVaultItem.ts
var import_api31 = require("@raycast/api");
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
    const toast = loadingMessage ? await (0, import_api31.showToast)(import_api31.Toast.Style.Animated, loadingMessage) : void 0;
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
var import_api32 = require("@raycast/api");

// src/utils/strings.ts
var capitalize = (value, lowercaseRest = false) => {
  const firstLetter = value.charAt(0).toUpperCase();
  const rest = lowercaseRest ? value.slice(1).toLowerCase() : value.slice(1);
  return firstLetter + rest;
};

// src/utils/clipboard.ts
async function showCopySuccessMessage(title, message) {
  const action = (0, import_api32.getPreferenceValues)().windowActionOnCopy;
  const messageTitle = capitalize(title, true);
  if (action === "keepOpen") {
    await (0, import_api32.showToast)({ title: messageTitle, message, style: import_api32.Toast.Style.Success });
  } else if (action === "closeAndPopToRoot") {
    await (0, import_api32.showHUD)(messageTitle);
    await (0, import_api32.popToRoot)();
  } else {
    await (0, import_api32.showHUD)(messageTitle);
  }
}

// src/utils/hooks/useFrontmostApplicationName.ts
var import_api33 = require("@raycast/api");
var import_react16 = require("react");
function useFrontmostApplicationName() {
  const [currentApplication, setCurrentApplication] = (0, import_react16.useState)(void 0);
  (0, import_react16.useEffect)(() => {
    void (0, import_api33.getFrontmostApplication)().then((application) => setCurrentApplication(application.name)).catch(() => setCurrentApplication(void 0));
  }, []);
  return currentApplication;
}

// src/components/ListFolderDropdown.tsx
var import_api34 = require("@raycast/api");
var import_jsx_runtime19 = require("react/jsx-runtime");
function ListFolderDropdown() {
  const { folders, currentFolderId, setCurrentFolder } = useVaultContext();
  if (folders.length === 0) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
    import_api34.List.Dropdown,
    {
      tooltip: "Select a folder",
      placeholder: "Search folders",
      defaultValue: currentFolderId ?? FOLDER_OPTIONS.ALL,
      onChange: setCurrentFolder,
      throttle: true,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_api34.List.Dropdown.Item, { value: FOLDER_OPTIONS.ALL, title: "All", icon: import_api34.Icon.Folder }),
        folders.map((folder) => {
          const id = folder.id || FOLDER_OPTIONS.NO_FOLDER;
          return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_api34.List.Dropdown.Item, { value: id, title: folder.name, icon: import_api34.Icon.Folder }, id);
        })
      ]
    }
  );
}

// src/components/ComponentReverser.tsx
var import_react17 = require("react");
var import_jsx_runtime20 = require("react/jsx-runtime");
var ComponentReverser = (props) => {
  const children = import_react17.Children.toArray(props.children);
  if (props.reverse) children.reverse();
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_jsx_runtime20.Fragment, { children });
};
var ComponentReverser_default = ComponentReverser;

// src/utils/hooks/useStateEffect.ts
var import_react18 = require("react");
function useStateEffect(initialState2, deps) {
  const [state, setState] = (0, import_react18.useState)(initialState2);
  (0, import_react18.useEffect)(() => {
    setState(initialState2);
  }, deps);
  return [state, setState];
}

// src/authenticator.tsx
var import_jsx_runtime21 = require("react/jsx-runtime");
var AuthenticatorCommand = () => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(RootErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(BitwardenProvider, { loadingFallback: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_api35.List, { searchBarPlaceholder: "Search items", isLoading: true }), children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(SessionProvider, { unlock: true, children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(vaultListeners_default, { children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(VaultProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(AuthenticatorList, {}) }) }) }) }) });
function AuthenticatorList() {
  const vault = useVaultContext();
  const { data: activeTabUrl, isLoading: isActiveTabLoading } = useActiveTab();
  const vaultItems = vault.items.filter((item) => item.login?.totp);
  const { setSearchText, filteredItems } = useVaultSearch(vaultItems);
  const itemMatches = (0, import_react19.useMemo)(() => {
    if (!activeTabUrl) return { items: filteredItems, tabItems: [] };
    return filteredItems.reduce(
      (acc, item) => {
        const matchesUrl = item.login?.uris?.some(({ uri }) => uri?.includes(activeTabUrl.url.hostname));
        if (matchesUrl) {
          acc.tabItems.push(item);
        } else {
          acc.items.push(item);
        }
        return acc;
      },
      { items: [], tabItems: [] }
    );
  }, [filteredItems, activeTabUrl]);
  const isEmpty = itemMatches.items.length === 0 && itemMatches.tabItems.length === 0;
  const otherItemsList = itemMatches.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(ListItem, { item }, item.id));
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(
    import_api35.List,
    {
      filtering: false,
      onSearchTextChange: setSearchText,
      searchBarPlaceholder: "Search items",
      isLoading: vault.isLoading || isActiveTabLoading,
      searchBarAccessory: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(ListFolderDropdown, {}),
      actions: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_api35.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(CommonActions, {}) }),
      children: [
        activeTabUrl && itemMatches.tabItems.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(import_jsx_runtime21.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_api35.List.Section, { title: `Active Tab (${activeTabUrl.url.hostname})`, children: itemMatches.tabItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(ListItem, { item }, item.id)) }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_api35.List.Section, { title: "Others", children: otherItemsList })
        ] }) : otherItemsList,
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
          import_api35.List.EmptyView,
          {
            icon: { source: "bitwarden-64.png" },
            title: isEmpty ? "No authenticator keys found" : "No matching items found",
            description: "Hit the sync button to sync your vault"
          }
        )
      ]
    }
  );
}
function ListItem({ item }) {
  const icon = useItemIcon(item);
  const preferences = (0, import_api35.getPreferenceValues)();
  const [canGenerate, setCanGenerate] = (0, import_react19.useState)(!item.reprompt);
  const { code, time, error, isLoading } = useVaultItemCodeGenerator({ item, canGenerate });
  function getAccessories() {
    if (!canGenerate) {
      return [
        {
          text: { value: "Needs confirmation", color: import_api35.Color.Yellow },
          tooltip: "Needs master password confirmation"
        }
      ];
    }
    if (!isLoading) {
      if (error) {
        return [{ text: { value: error.message, color: import_api35.Color.Red } }];
      }
      if (code && time) {
        return [
          { text: code },
          {
            tag: { value: String(time), color: time <= 7 ? import_api35.Color.Red : import_api35.Color.Blue },
            tooltip: `${time} seconds remaining`
          }
        ];
      }
    }
    return [{ text: "Loading..." }];
  }
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(vaultItem_default.Provider, { value: item, children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    import_api35.List.Item,
    {
      title: item.name,
      subtitle: item.login?.username ?? void 0,
      icon,
      actions: /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(import_api35.ActionPanel, { children: [
        canGenerate ? /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(ComponentReverser_default, { reverse: preferences.primaryAction === "paste", children: [
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(CopyCodeAction, {}),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(PasteCodeAction, {})
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(ConfirmAction, { onConfirm: () => setCanGenerate(true) }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(CommonActions, {})
      ] }),
      accessories: getAccessories()
    }
  ) });
}
function CommonActions() {
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(import_jsx_runtime21.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(VaultActionsSection, {}),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(DebuggingBugReportingActionSection, {})
  ] });
}
function ConfirmAction({ onConfirm }) {
  const selectedItem = useSelectedVaultItem();
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    ActionWithReprompt_default,
    {
      title: "Confirm Password",
      onAction: onConfirm,
      icon: import_api35.Icon.Lock,
      repromptDescription: `Generating an authentication code for <${selectedItem.name}>`
    }
  );
}
function CopyCodeAction() {
  const getCode = useGetCodeForAction("copy");
  const copy = async () => {
    const code = await getCode();
    if (code) {
      await import_api35.Clipboard.copy(code, { transient: getTransientCopyPreference("other") });
      await showCopySuccessMessage("Copied code to clipboard");
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_api35.Action, { title: "Copy Code", onAction: copy, icon: import_api35.Icon.Clipboard });
}
function PasteCodeAction() {
  const frontmostAppName = useFrontmostApplicationName();
  const getCode = useGetCodeForAction("paste");
  const paste = async () => {
    const code = await getCode();
    if (code) {
      await import_api35.Clipboard.paste(code);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    import_api35.Action,
    {
      title: frontmostAppName ? `Paste Code into ${frontmostAppName}` : "Paste Code",
      onAction: paste,
      icon: import_api35.Icon.Window
    }
  );
}
function useGetCodeForAction(action) {
  const selectedItem = useSelectedVaultItem();
  const getVaultItem = useGetUpdatedVaultItem_default();
  return async () => {
    try {
      const totp = await getVaultItem(selectedItem, (item) => item.login?.totp, "Getting code...");
      if (!totp) throw new Error("Failed to get totp");
      const [generator, error] = getGenerator(totp);
      if (error) throw error;
      return generator.generate();
    } catch (error) {
      await (0, import_api35.showToast)(import_api35.Toast.Style.Failure, "Failed to get code");
      captureException(`Failed to ${action} code`, error);
      return void 0;
    }
  };
}
function useActiveTab() {
  return $cefc05764ce5eacd$export$dd6b79aaabe7bc37(async () => {
    if (!import_api35.environment.canAccess(import_api35.BrowserExtension)) return void 0;
    const [tabs, error] = await tryCatch(import_api35.BrowserExtension.getTabs());
    if (error) return void 0;
    const activeTab = tabs.find((tab) => tab.active);
    return activeTab ? { ...activeTab, url: new URL(activeTab.url) } : void 0;
  });
}
function useVaultItemCodeGenerator(args) {
  const { item, canGenerate } = args;
  const [[generator, error, isLoading = false], setState] = useStateEffect(() => {
    const { totp } = item.login ?? {};
    if (!canGenerate) return Loading(new Error("Needs confirmation..."));
    if (totp === SENSITIVE_VALUE_PLACEHOLDER) return Loading(new Error("Loading..."));
    if (!totp) return Err(new Error("No TOTP found"));
    return getGenerator(totp);
  }, [item, canGenerate]);
  const [code, setCode] = (0, import_react19.useState)(null);
  const [time, setTime] = (0, import_react19.useState)(null);
  (0, import_react19.useEffect)(() => {
    if (error) return;
    let interval;
    let timeout;
    const cleanup = () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
    const setTimeAndCode = () => {
      try {
        const timeRemaining = Math.ceil(generator.remaining() / 1e3);
        setTime(timeRemaining);
        if (timeRemaining === generator.period) {
          setCode(generator.generate());
        }
      } catch (error2) {
        setState(Err(new Error("Failed to regenerate")));
        cleanup();
        captureException("Failed to regenerate", error2);
      }
    };
    try {
      timeout = setTimeout(() => {
        setTimeAndCode();
        interval = setInterval(setTimeAndCode, 1e3);
      }, generator.remaining() % 1e3);
      setCode(generator.generate());
    } catch (error2) {
      setState(Err(new Error("Failed to generate")));
      cleanup();
      captureException("Failed to generate", error2);
    }
    return cleanup;
  }, [item, generator]);
  return { code, time, error, isLoading };
}
function Loading(error) {
  return [null, error, true];
}
var authenticator_default = AuthenticatorCommand;
/*! Bundled license information:

node-stream-zip/node_stream_zip.js:
  (**
   * @license node-stream-zip | (c) 2020 Antelle | https://github.com/antelle/node-stream-zip/blob/master/LICENSE
   * Portions copyright https://github.com/cthackers/adm-zip | https://raw.githubusercontent.com/cthackers/adm-zip/master/LICENSE
   *)

@scure/base/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/hashes/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
