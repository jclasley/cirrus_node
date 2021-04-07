"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUsernames = void 0;
var axios_1 = __importDefault(require("axios"));
var parseUsernames = function () {
    // forward error to bAuth
    return axios_1.default.get('https://reqres.in/api/users')
        .then(function (_a) {
        var data = _a.data;
        var emails = data.data.reduce(function (m, i) {
            return __spreadArray(__spreadArray([], m), [i["email"]]);
        }, []);
        return emails;
    });
};
exports.parseUsernames = parseUsernames;
var bAuth = function (req, res, next) {
    // if there is basic auth provided in header, get it; otherwise, empty string
    var auth = (req.headers.authorization || '').split(' ')[1] || '';
    if (!req.headers.authorization) {
        res.status(401).send({ error: "No authentication provided" });
        return;
    }
    var _a = Buffer.from(auth, 'base64').toString().split(':'), login = _a[0], password = _a[1];
    exports.parseUsernames().then(function (users) {
        // if username is in approved list and password not empty
        if (users.includes(login)) {
            if (password) { // empty password
                req.headers.username = login;
                return next(); // move on with middlewares
            }
            else {
                res.status(401).send({ error: "Invalid password" });
            }
        }
        else { // user not approved
            res.status(401).send({ error: "Unauthorized user" });
        }
    })
        .catch(function (err) {
        res.status(500).send(err);
    });
};
exports.default = bAuth;
