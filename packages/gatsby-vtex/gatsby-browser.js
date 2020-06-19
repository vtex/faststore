"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceHydrateFunction = void 0;
const component_1 = require("@loadable/component");
const react_dom_1 = __importDefault(require("react-dom"));
exports.replaceHydrateFunction = () => (element, container) => {
    component_1.loadableReady(() => {
        const { unstable_createRoot: createRoot, unstable_createBlockingRoot: createBlockingRoot, } = react_dom_1.default;
        createRoot(container).render(element);
    });
};
