"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
function getImage() {
    return __awaiter(this, void 0, void 0, function () {
        var imageResponse, imageBlob, filePath_buffer, arrayBuffer, buffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('https://cdn.openart.ai/published/KuNdla1OswlPZGzCtehL/1MMIr_dX_Il4k_1024.webp', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Cookie: 'AMP_MKTG_3e2fda7a5c=JTdCJTIycmVmZXJyZXIlMjIlM0ElMjJodHRwcyUzQSUyRiUyRnd3dy5nb29nbGUuY29tJTJGJTIyJTJDJTIycmVmZXJyaW5nX2RvbWFpbiUyMiUzQSUyMnd3dy5nb29nbGUuY29tJTIyJTdE; AMP_3e2fda7a5c=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjI4NDVlNzlmMC04ZmJkLTQyYzMtOTAwZC01ZmVkYjExNTA5OGYlMjIlMkMlMjJ1c2VySWQlMjIlM0ElMjJNWnNIcUo0bzZLNTNkb3N1aUxpZyUyMiUyQyUyMnNlc3Npb25JZCUyMiUzQTE3MTA5NjI4MTI3MDElMkMlMjJvcHRPdXQlMjIlM0FmYWxzZSUyQyUyMmxhc3RFdmVudFRpbWUlMjIlM0ExNzEwOTY0NjM3MjMwJTJDJTIybGFzdEV2ZW50SWQlMjIlM0E4JTdE; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..k5NBcKgI__Qahvgr.O6sQFcJ3o5kF7D6YPIjvd44Nh-j3z9SK9Pr2U2gGVNK3wHL-zSS9vvV_QQVuPccRD6dNYHICfO8aX6OM6UsupNsT6G0kQUBut6HwVBSydqFqX-F1ns8BI6t21WVNk9VyWsEHhR7hV4UfFVrAxE0R0oziA3Xb_OhV-S27IWT0d9FLqIQD1ocX8P7YXfdcgZLCNvEU3aqR2aAwpFsGGgOZaNmMe2-jkrFC87e8qPdYOIpyW1N4jH3s8_p5Y3uVhP-nrbGY_IeMljlWdBY6BWUy-FlFBs7-B_CB6calZU-4H0Sx1WXKQ-y_Lbgy7D9HU7U-HVZAanADarjbuXXrt5z5sYbEHCxbcxLY2xEFI48.xdENZkqjJ2VK0G25tr5fHA'
                        },
                        credentials: 'include'
                    })];
                case 1:
                    imageResponse = _a.sent();
                    return [4 /*yield*/, imageResponse.blob()];
                case 2:
                    imageBlob = _a.sent();
                    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                    console.log('imageBlob', imageBlob);
                    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                    //   console.log('ImageResponse', imageResponse);
                    imageBlob.arrayBuffer().then(function (buffer) {
                        console.log('Buffer', buffer);
                    });
                    filePath_buffer = path.resolve(__dirname, 'data', 'image1.webp');
                    return [4 /*yield*/, imageBlob.arrayBuffer()];
                case 3:
                    arrayBuffer = _a.sent();
                    buffer = Buffer.from(arrayBuffer);
                    fs.writeFileSync(filePath_buffer, buffer);
                    console.log('Buffer', buffer);
                    //   fs.writeFileSync(filePath_blob, imageBlob);
                    //   fs.writeFileSync(filePath, imageBlob);
                    //   console.log('ImageBlob as array buffer', imageBlob.arrayBuffer());
                    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                    return [2 /*return*/];
            }
        });
    });
}
getImage();
//   Cookie:
// AMP_MKTG_3e2fda7a5c=JTdCJTIycmVmZXJyZXIlMjIlM0ElMjJodHRwcyUzQSUyRiUyRnd3dy5nb29nbGUuY29tJTJGJTIyJTJDJTIycmVmZXJyaW5nX2RvbWFpbiUyMiUzQSUyMnd3dy5nb29nbGUuY29tJTIyJTdE;
// AMP_3e2fda7a5c=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjI4NDVlNzlmMC04ZmJkLTQyYzMtOTAwZC01ZmVkYjExNTA5OGYlMjIlMkMlMjJ1c2VySWQlMjIlM0ElMjJNWnNIcUo0bzZLNTNkb3N1aUxpZyUyMiUyQyUyMnNlc3Npb25JZCUyMiUzQTE3MTA5NjI4MTI3MDElMkMlMjJvcHRPdXQlMjIlM0FmYWxzZSUyQyUyMmxhc3RFdmVudFRpbWUlMjIlM0ExNzEwOTY0NjM3MjMwJTJDJTIybGFzdEV2ZW50SWQlMjIlM0E4JTdE; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..k5NBcKgI__Qahvgr.O6sQFcJ3o5kF7D6YPIjvd44Nh-j3z9SK9Pr2U2gGVNK3wHL-zSS9vvV_QQVuPccRD6dNYHICfO8aX6OM6UsupNsT6G0kQUBut6HwVBSydqFqX-F1ns8BI6t21WVNk9VyWsEHhR7hV4UfFVrAxE0R0oziA3Xb_OhV-S27IWT0d9FLqIQD1ocX8P7YXfdcgZLCNvEU3aqR2aAwpFsGGgOZaNmMe2-jkrFC87e8qPdYOIpyW1N4jH3s8_p5Y3uVhP-nrbGY_IeMljlWdBY6BWUy-FlFBs7-B_CB6calZU-4H0Sx1WXKQ-y_Lbgy7D9HU7U-HVZAanADarjbuXXrt5z5sYbEHCxbcxLY2xEFI48.xdENZkqjJ2VK0G25tr5fHA
