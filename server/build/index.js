"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = Number(process.env.PORT) || 8000;
app_1.default.listen(PORT, "127.0.0.1", () => {
    console.log(`Running on port ${PORT}.`);
}).on("error", (err) => {
    console.error(err);
});
