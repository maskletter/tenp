"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var __1 = require("../");
var interface_1 = require("../interface");
var tool_1 = require("./tool");
var express = require("express");
var http = require("http");
var assert = require("assert");
process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H');
var interceptor = function (req, res) {
    // console.log('经过了hello路由' )
};
var SecondRouter = /** @class */ (function (_super) {
    __extends(SecondRouter, _super);
    function SecondRouter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SecondRouter.prototype.testInterceptor = function (req, res) {
        res.send('hello, world');
    };
    __decorate([
        __1.Config({ url: '/interceptor', type: 'get', name: '测试路由', interceptorType: 'abandon', validator: { phone: { type: 'phone' } }, validatorType: 'query' }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], SecondRouter.prototype, "testInterceptor", null);
    SecondRouter = __decorate([
        __1.Router({ url: '/second' })
    ], SecondRouter);
    return SecondRouter;
}(__1.RouterComponent));
var HelloWorld = /** @class */ (function (_super) {
    __extends(HelloWorld, _super);
    function HelloWorld() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HelloWorld.prototype.getHello = function (req, res) {
        res.send('hello, world');
    };
    HelloWorld.prototype.getWorld = function (req, res) {
        res.send('hello, world');
    };
    HelloWorld.prototype.getWorld2 = function (req, res) {
        res.send('hello, world');
    };
    __decorate([
        __1.Config({ url: '/hello', type: 'get', name: '测试路由', interceptorType: 'abandon', validator: { phone: { type: 'phone' } }, validatorType: 'query' }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], HelloWorld.prototype, "getHello", null);
    __decorate([
        __1.Config({ url: '/world', type: 'get', name: '测试路由2', interceptorType: 'abandon', validator: { phone: { type: 'phone' } }, validatorType: 'query' }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], HelloWorld.prototype, "getWorld", null);
    __decorate([
        __1.Config({ url: '/world3', type: 'get', name: '测试路由3', validator: { phone: { type: 'phone' } }, validatorType: 'query' }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], HelloWorld.prototype, "getWorld2", null);
    HelloWorld = __decorate([
        __1.Router({
            name: 'router-hello',
            url: '/hello',
            interceptor: [interceptor],
            interceptorType: 'inherit',
            router: [SecondRouter]
        })
    ], HelloWorld);
    return HelloWorld;
}(__1.RouterComponent));
describe('初始化服务', function () { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        it('创建tenp实例', function () { return __awaiter(_this, void 0, void 0, function () {
            var $tenp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __1.Start({
                            port: 3687,
                        })];
                    case 1:
                        $tenp = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('创建tenp实例(注入外部express实例)', function () { return __awaiter(_this, void 0, void 0, function () {
            var app, server, $tenp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app = express();
                        server = http.createServer(app).listen(8080);
                        return [4 /*yield*/, __1.Start({
                                port: 3688,
                                express: function (private_app) {
                                    assert(private_app == app);
                                },
                            }, app)];
                    case 1:
                        $tenp = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
describe('路由模块', function () { return __awaiter(_this, void 0, void 0, function () {
    var routerInfo;
    return __generator(this, function (_a) {
        routerInfo = __1.dbRouterInfo[HelloWorld.prototype.$$id];
        it("检查router", function () {
            chai_1.expect(tool_1.objectToBoolean(Object.assign({}, routerInfo))).to.be.deep.equal({
                id: true,
                name: true,
                config: true,
                functoin: true,
                path: true
            });
            chai_1.expect(tool_1.objectToBoolean(Object.assign({}, routerInfo.config))).to.be.deep.equal({
                name: true,
                url: true,
                interceptor: true,
                interceptorType: true,
                router: true
            });
        });
        it('检查config', function () {
            chai_1.expect(routerInfo.path.length).to.be.deep.equal(3);
            chai_1.expect(routerInfo.path[1].config).to.be.deep.equal({
                url: '/world',
                type: 'get',
                name: '测试路由2',
                interceptorType: 'abandon',
                validator: { phone: { type: 'phone' } },
                validatorType: 'query'
            });
            assert(typeof routerInfo.path[0].callback === 'function');
        });
        return [2 /*return*/];
    });
}); });
describe('插件模块', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        it('拦截器', function (done) {
            __1.Start({
                port: 3691,
                baseUrl: '/inter',
                interceptor: [function global() {
                        done();
                    }],
                router: [HelloWorld],
            }).then(function (result) {
                http.get('http://localhost:3691/inter/hello/world3?phone=13654777775', function (res) {
                    // console.log(res)
                });
            });
        });
        it('数据验证器', function (done) {
            var validation1 = {
                phone: {
                    type: 'phone',
                    name: '手机号',
                    required: true,
                    message: {
                        type: '手机类型不正确'
                    }
                },
                name: {
                    type: 'string',
                    required: false
                },
                done: function (err) {
                    done();
                }
            };
            var validator = new (require('../dist/lib/plugin/validator.plugin').default);
            validator.validator({ phone: '13*654777775' }, validation1);
        });
        it('注入器', function () {
            var TestInjectable = /** @class */ (function () {
                function TestInjectable() {
                    this.name = '测试注入器';
                }
                return TestInjectable;
            }());
            var TestRouter = /** @class */ (function (_super) {
                __extends(TestRouter, _super);
                function TestRouter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                TestRouter.prototype.onInit = function () {
                    chai_1.expect(this.test).to.be.an.instanceof(TestInjectable);
                };
                __decorate([
                    __1.Injector('test-injectable'),
                    __metadata("design:type", TestInjectable)
                ], TestRouter.prototype, "test", void 0);
                TestRouter = __decorate([
                    __1.Router({})
                ], TestRouter);
                return TestRouter;
            }(__1.RouterComponent));
            __1.Start({
                port: 3689,
                router: [TestRouter],
                provide: [{ class: TestInjectable, name: 'test-injectable' }]
            });
        });
        return [2 /*return*/];
    });
}); });
describe('接口请求', function () {
    var TestRouter = /** @class */ (function () {
        function TestRouter() {
        }
        TestRouter.prototype.dawdget1 = function (request, response) {
            response.end('success');
        };
        __decorate([
            __1.Get('/test'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object, Object]),
            __metadata("design:returntype", void 0)
        ], TestRouter.prototype, "dawdget1", null);
        TestRouter = __decorate([
            __1.Router()
        ], TestRouter);
        return TestRouter;
    }());
    __1.Start({
        port: 3690,
        router: [TestRouter],
    }).then(function (result) {
    });
    it('get测试', function (done) {
        routerSim('get', '/test', done);
    });
});
function routerSim(method, url, done) {
    return __awaiter(this, void 0, void 0, function () {
        var req;
        return __generator(this, function (_a) {
            req = http.request({ method: method, port: 3690, path: url }, function (res) {
                done();
            });
            req.end();
            return [2 /*return*/];
        });
    });
}
