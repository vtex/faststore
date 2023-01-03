exports.id = 18;
exports.ids = [18];
exports.modules = {

/***/ 3468:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.addBasePath = addBasePath;
var _addPathPrefix = __webpack_require__(1751);
var _normalizeTrailingSlash = __webpack_require__(2700);
const basePath =  false || "";
function addBasePath(path, required) {
    if (false) {}
    return (0, _normalizeTrailingSlash).normalizePathTrailingSlash((0, _addPathPrefix).addPathPrefix(path, basePath));
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=add-base-path.js.map


/***/ }),

/***/ 4465:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.addLocale = void 0;
var _normalizeTrailingSlash = __webpack_require__(2700);
const addLocale = (path, ...args)=>{
    if (false) {}
    return path;
};
exports.addLocale = addLocale;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=add-locale.js.map


/***/ }),

/***/ 4643:
/***/ ((module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.detectDomainLocale = void 0;
const detectDomainLocale = (...args)=>{
    if (false) {}
};
exports.detectDomainLocale = detectDomainLocale;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=detect-domain-locale.js.map


/***/ }),

/***/ 227:
/***/ ((module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.getDomainLocale = getDomainLocale;
const basePath = (/* unused pure expression or super */ null && ( false || ""));
function getDomainLocale(path, locale, locales, domainLocales) {
    if (false) {} else {
        return false;
    }
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=get-domain-locale.js.map


/***/ }),

/***/ 928:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.hasBasePath = hasBasePath;
var _pathHasPrefix = __webpack_require__(4567);
const basePath =  false || "";
function hasBasePath(path) {
    return (0, _pathHasPrefix).pathHasPrefix(path, basePath);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=has-base-path.js.map


/***/ }),

/***/ 1831:
/***/ ((module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = initHeadManager;
exports.isEqualNode = isEqualNode;
exports.DOMAttributeNames = void 0;
function initHeadManager() {
    return {
        mountedInstances: new Set(),
        updateHead: (head)=>{
            const tags = {};
            head.forEach((h)=>{
                if (// it won't be inlined. In this case revert to the original behavior
                h.type === "link" && h.props["data-optimized-fonts"]) {
                    if (document.querySelector(`style[data-href="${h.props["data-href"]}"]`)) {
                        return;
                    } else {
                        h.props.href = h.props["data-href"];
                        h.props["data-href"] = undefined;
                    }
                }
                const components = tags[h.type] || [];
                components.push(h);
                tags[h.type] = components;
            });
            const titleComponent = tags.title ? tags.title[0] : null;
            let title = "";
            if (titleComponent) {
                const { children  } = titleComponent.props;
                title = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : "";
            }
            if (title !== document.title) document.title = title;
            [
                "meta",
                "base",
                "link",
                "style",
                "script"
            ].forEach((type)=>{
                updateElements(type, tags[type] || []);
            });
        }
    };
}
const DOMAttributeNames = {
    acceptCharset: "accept-charset",
    className: "class",
    htmlFor: "for",
    httpEquiv: "http-equiv",
    noModule: "noModule"
};
exports.DOMAttributeNames = DOMAttributeNames;
function reactElementToDOM({ type , props  }) {
    const el = document.createElement(type);
    for(const p in props){
        if (!props.hasOwnProperty(p)) continue;
        if (p === "children" || p === "dangerouslySetInnerHTML") continue;
        // we don't render undefined props to the DOM
        if (props[p] === undefined) continue;
        const attr = DOMAttributeNames[p] || p.toLowerCase();
        if (type === "script" && (attr === "async" || attr === "defer" || attr === "noModule")) {
            el[attr] = !!props[p];
        } else {
            el.setAttribute(attr, props[p]);
        }
    }
    const { children , dangerouslySetInnerHTML  } = props;
    if (dangerouslySetInnerHTML) {
        el.innerHTML = dangerouslySetInnerHTML.__html || "";
    } else if (children) {
        el.textContent = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : "";
    }
    return el;
}
function isEqualNode(oldTag, newTag) {
    if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
        const nonce = newTag.getAttribute("nonce");
        // Only strip the nonce if `oldTag` has had it stripped. An element's nonce attribute will not
        // be stripped if there is no content security policy response header that includes a nonce.
        if (nonce && !oldTag.getAttribute("nonce")) {
            const cloneTag = newTag.cloneNode(true);
            cloneTag.setAttribute("nonce", "");
            cloneTag.nonce = nonce;
            return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
        }
    }
    return oldTag.isEqualNode(newTag);
}
function updateElements(type, components) {
    const headEl = document.getElementsByTagName("head")[0];
    const headCountEl = headEl.querySelector("meta[name=next-head-count]");
    if (false) {}
    const headCount = Number(headCountEl.content);
    const oldTags = [];
    for(let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = (j == null ? void 0 : j.previousElementSibling) || null){
        var ref;
        if ((j == null ? void 0 : (ref = j.tagName) == null ? void 0 : ref.toLowerCase()) === type) {
            oldTags.push(j);
        }
    }
    const newTags = components.map(reactElementToDOM).filter((newTag)=>{
        for(let k = 0, len = oldTags.length; k < len; k++){
            const oldTag = oldTags[k];
            if (isEqualNode(oldTag, newTag)) {
                oldTags.splice(k, 1);
                return false;
            }
        }
        return true;
    });
    oldTags.forEach((t)=>{
        var ref;
        return (ref = t.parentNode) == null ? void 0 : ref.removeChild(t);
    });
    newTags.forEach((t)=>headEl.insertBefore(t, headCountEl));
    headCountEl.content = (headCount - oldTags.length + newTags.length).toString();
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=head-manager.js.map


/***/ }),

/***/ 9749:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

"use client";
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = void 0;
var _extends = (__webpack_require__(9419)/* ["default"] */ .Z);
var _interop_require_default = (__webpack_require__(3903)/* ["default"] */ .Z);
var _interop_require_wildcard = (__webpack_require__(199)/* ["default"] */ .Z);
var _object_without_properties_loose = (__webpack_require__(5154)/* ["default"] */ .Z);
var _react = _interop_require_wildcard(__webpack_require__(6689));
var _head = _interop_require_default(__webpack_require__(3121));
var _imageBlurSvg = __webpack_require__(4486);
var _imageConfig = __webpack_require__(5843);
var _imageConfigContext = __webpack_require__(744);
var _warnOnce = __webpack_require__(618);
var _imageLoader = _interop_require_default(__webpack_require__(9552));
const configEnv = {"deviceSizes":[640,750,828,1080,1200,1920,2048,3840],"imageSizes":[16,32,48,64,96,128,256,384],"path":"/_next/image","loader":"default","dangerouslyAllowSVG":false,"unoptimized":false};
const allImgs = new Map();
let perfObserver;
if (true) {
    globalThis.__NEXT_IMAGE_IMPORTED = true;
}
const VALID_LOADING_VALUES = (/* unused pure expression or super */ null && ([
    "lazy",
    "eager",
    undefined
]));
function isStaticRequire(src) {
    return src.default !== undefined;
}
function isStaticImageData(src) {
    return src.src !== undefined;
}
function isStaticImport(src) {
    return typeof src === "object" && (isStaticRequire(src) || isStaticImageData(src));
}
function getWidths({ deviceSizes , allSizes  }, width, sizes) {
    if (sizes) {
        // Find all the "vw" percent sizes used in the sizes prop
        const viewportWidthRe = /(^|\s)(1?\d?\d)vw/g;
        const percentSizes = [];
        for(let match; match = viewportWidthRe.exec(sizes); match){
            percentSizes.push(parseInt(match[2]));
        }
        if (percentSizes.length) {
            const smallestRatio = Math.min(...percentSizes) * 0.01;
            return {
                widths: allSizes.filter((s)=>s >= deviceSizes[0] * smallestRatio),
                kind: "w"
            };
        }
        return {
            widths: allSizes,
            kind: "w"
        };
    }
    if (typeof width !== "number") {
        return {
            widths: deviceSizes,
            kind: "w"
        };
    }
    const widths = [
        ...new Set(// > are actually 3x in the green color, but only 1.5x in the red and
        // > blue colors. Showing a 3x resolution image in the app vs a 2x
        // > resolution image will be visually the same, though the 3x image
        // > takes significantly more data. Even true 3x resolution screens are
        // > wasteful as the human eye cannot see that level of detail without
        // > something like a magnifying glass.
        // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
        [
            width,
            width * 2 /*, width * 3*/ 
        ].map((w)=>allSizes.find((p)=>p >= w) || allSizes[allSizes.length - 1]))
    ];
    return {
        widths,
        kind: "x"
    };
}
function generateImgAttrs({ config , src , unoptimized , width , quality , sizes , loader  }) {
    if (unoptimized) {
        return {
            src,
            srcSet: undefined,
            sizes: undefined
        };
    }
    const { widths , kind  } = getWidths(config, width, sizes);
    const last = widths.length - 1;
    return {
        sizes: !sizes && kind === "w" ? "100vw" : sizes,
        srcSet: widths.map((w, i)=>`${loader({
                config,
                src,
                quality,
                width: w
            })} ${kind === "w" ? w : i + 1}${kind}`).join(", "),
        // It's intended to keep `src` the last attribute because React updates
        // attributes in order. If we keep `src` the first one, Safari will
        // immediately start to fetch `src`, before `sizes` and `srcSet` are even
        // updated by React. That causes multiple unnecessary requests if `srcSet`
        // and `sizes` are defined.
        // This bug cannot be reproduced in Chrome or Firefox.
        src: loader({
            config,
            src,
            quality,
            width: widths[last]
        })
    };
}
function getInt(x) {
    if (typeof x === "number" || typeof x === "undefined") {
        return x;
    }
    if (typeof x === "string" && /^[0-9]+$/.test(x)) {
        return parseInt(x, 10);
    }
    return NaN;
}
// See https://stackoverflow.com/q/39777833/266535 for why we use this ref
// handler instead of the img's onLoad attribute.
function handleLoading(img, src, onLoadRef, onLoadingCompleteRef, unoptimized) {
    if (!img || img["data-loaded-src"] === src) {
        return;
    }
    img["data-loaded-src"] = src;
    const p = "decode" in img ? img.decode() : Promise.resolve();
    p.catch(()=>{}).then(()=>{
        if (!img.parentNode) {
            // Exit early in case of race condition:
            // - onload() is called
            // - decode() is called but incomplete
            // - unmount is called
            // - decode() completes
            return;
        }
        if (onLoadRef == null ? void 0 : onLoadRef.current) {
            // Since we don't have the SyntheticEvent here,
            // we must create one with the same shape.
            // See https://reactjs.org/docs/events.html
            const event = new Event("load");
            Object.defineProperty(event, "target", {
                writable: false,
                value: img
            });
            let prevented = false;
            let stopped = false;
            onLoadRef.current(_extends({}, event, {
                nativeEvent: event,
                currentTarget: img,
                target: img,
                isDefaultPrevented: ()=>prevented,
                isPropagationStopped: ()=>stopped,
                persist: ()=>{},
                preventDefault: ()=>{
                    prevented = true;
                    event.preventDefault();
                },
                stopPropagation: ()=>{
                    stopped = true;
                    event.stopPropagation();
                }
            }));
        }
        if (onLoadingCompleteRef == null ? void 0 : onLoadingCompleteRef.current) {
            onLoadingCompleteRef.current(img);
        }
        if (false) {}
    });
}
const ImageElement = /*#__PURE__*/ (0, _react).forwardRef((_param, forwardedRef)=>{
    var { imgAttributes , heightInt , widthInt , qualityInt , className , imgStyle , blurStyle , isLazy , fill , placeholder , loading , srcString , config , unoptimized , loader , onLoadRef , onLoadingCompleteRef , onLoad , onError  } = _param, rest = _object_without_properties_loose(_param, [
        "imgAttributes",
        "heightInt",
        "widthInt",
        "qualityInt",
        "className",
        "imgStyle",
        "blurStyle",
        "isLazy",
        "fill",
        "placeholder",
        "loading",
        "srcString",
        "config",
        "unoptimized",
        "loader",
        "onLoadRef",
        "onLoadingCompleteRef",
        "onLoad",
        "onError"
    ]);
    loading = isLazy ? "lazy" : loading;
    return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("img", Object.assign({}, rest, imgAttributes, {
        width: widthInt,
        height: heightInt,
        decoding: "async",
        "data-nimg": fill ? "fill" : "1",
        className: className,
        // @ts-ignore - TODO: upgrade to `@types/react@17`
        loading: loading,
        style: _extends({}, imgStyle, blurStyle),
        ref: (0, _react).useCallback((img)=>{
            if (forwardedRef) {
                if (typeof forwardedRef === "function") forwardedRef(img);
                else if (typeof forwardedRef === "object") {
                    // @ts-ignore - .current is read only it's usually assigned by react internally
                    forwardedRef.current = img;
                }
            }
            if (!img) {
                return;
            }
            if (onError) {
                // If the image has an error before react hydrates, then the error is lost.
                // The workaround is to wait until the image is mounted which is after hydration,
                // then we set the src again to trigger the error handler (if there was an error).
                // eslint-disable-next-line no-self-assign
                img.src = img.src;
            }
            if (false) {}
            if (img.complete) {
                handleLoading(img, srcString, onLoadRef, onLoadingCompleteRef, unoptimized);
            }
        }, [
            srcString,
            onLoadRef,
            onLoadingCompleteRef,
            onError,
            unoptimized,
            forwardedRef
        ]),
        onLoad: (event)=>{
            const img = event.currentTarget;
            handleLoading(img, srcString, onLoadRef, onLoadingCompleteRef, unoptimized);
        },
        onError: (event)=>{
            // Note: We removed React.useState() in the error case here
            // because it was causing Safari to become very slow when
            // there were many images on the same page.
            const { style  } = event.currentTarget;
            if (style.color === "transparent") {
                // If src image fails to load, this will ensure "alt" is visible
                style.color = "";
            }
            if (placeholder === "blur" && style.backgroundImage) {
                // If src image fails to load, this will ensure the placeholder is removed
                style.backgroundSize = "";
                style.backgroundPosition = "";
                style.backgroundRepeat = "";
                style.backgroundImage = "";
            }
            if (onError) {
                onError(event);
            }
        }
    })));
});
const Image = /*#__PURE__*/ (0, _react).forwardRef((_param, forwardedRef)=>{
    var { src , sizes , unoptimized =false , priority =false , loading , className , quality , width , height , fill , style , onLoad , onLoadingComplete , placeholder ="empty" , blurDataURL , layout , objectFit , objectPosition , lazyBoundary , lazyRoot  } = _param, all = _object_without_properties_loose(_param, [
        "src",
        "sizes",
        "unoptimized",
        "priority",
        "loading",
        "className",
        "quality",
        "width",
        "height",
        "fill",
        "style",
        "onLoad",
        "onLoadingComplete",
        "placeholder",
        "blurDataURL",
        "layout",
        "objectFit",
        "objectPosition",
        "lazyBoundary",
        "lazyRoot"
    ]);
    const configContext = (0, _react).useContext(_imageConfigContext.ImageConfigContext);
    const config = (0, _react).useMemo(()=>{
        const c = configEnv || configContext || _imageConfig.imageConfigDefault;
        const allSizes = [
            ...c.deviceSizes,
            ...c.imageSizes
        ].sort((a, b)=>a - b);
        const deviceSizes = c.deviceSizes.sort((a, b)=>a - b);
        return _extends({}, c, {
            allSizes,
            deviceSizes
        });
    }, [
        configContext
    ]);
    let rest = all;
    let loader = rest.loader || _imageLoader.default;
    // Remove property so it's not spread on <img> element
    delete rest.loader;
    if ("__next_img_default" in loader) {
        // This special value indicates that the user
        // didn't define a "loader" prop or config.
        if (config.loader === "custom") {
            throw new Error(`Image with src "${src}" is missing "loader" prop.` + `\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader`);
        }
    } else {
        // The user defined a "loader" prop or config.
        // Since the config object is internal only, we
        // must not pass it to the user-defined "loader".
        const customImageLoader = loader;
        var _tmp;
        _tmp = (obj)=>{
            const { config: _  } = obj, opts = _object_without_properties_loose(obj, [
                "config"
            ]);
            return customImageLoader(opts);
        }, loader = _tmp, _tmp;
    }
    if (layout) {
        if (layout === "fill") {
            fill = true;
        }
        const layoutToStyle = {
            intrinsic: {
                maxWidth: "100%",
                height: "auto"
            },
            responsive: {
                width: "100%",
                height: "auto"
            }
        };
        const layoutToSizes = {
            responsive: "100vw",
            fill: "100vw"
        };
        const layoutStyle = layoutToStyle[layout];
        if (layoutStyle) {
            style = _extends({}, style, layoutStyle);
        }
        const layoutSizes = layoutToSizes[layout];
        if (layoutSizes && !sizes) {
            sizes = layoutSizes;
        }
    }
    let staticSrc = "";
    let widthInt = getInt(width);
    let heightInt = getInt(height);
    let blurWidth;
    let blurHeight;
    if (isStaticImport(src)) {
        const staticImageData = isStaticRequire(src) ? src.default : src;
        if (!staticImageData.src) {
            throw new Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(staticImageData)}`);
        }
        if (!staticImageData.height || !staticImageData.width) {
            throw new Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(staticImageData)}`);
        }
        blurWidth = staticImageData.blurWidth;
        blurHeight = staticImageData.blurHeight;
        blurDataURL = blurDataURL || staticImageData.blurDataURL;
        staticSrc = staticImageData.src;
        if (!fill) {
            if (!widthInt && !heightInt) {
                widthInt = staticImageData.width;
                heightInt = staticImageData.height;
            } else if (widthInt && !heightInt) {
                const ratio = widthInt / staticImageData.width;
                heightInt = Math.round(staticImageData.height * ratio);
            } else if (!widthInt && heightInt) {
                const ratio1 = heightInt / staticImageData.height;
                widthInt = Math.round(staticImageData.width * ratio1);
            }
        }
    }
    src = typeof src === "string" ? src : staticSrc;
    let isLazy = !priority && (loading === "lazy" || typeof loading === "undefined");
    if (src.startsWith("data:") || src.startsWith("blob:")) {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
        unoptimized = true;
        isLazy = false;
    }
    if (config.unoptimized) {
        unoptimized = true;
    }
    const qualityInt = getInt(quality);
    if (false) {}
    const imgStyle = Object.assign(fill ? {
        position: "absolute",
        height: "100%",
        width: "100%",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        objectFit,
        objectPosition
    } : {}, {
        color: "transparent"
    }, style);
    const blurStyle = placeholder === "blur" && blurDataURL ? {
        backgroundSize: imgStyle.objectFit || "cover",
        backgroundPosition: imgStyle.objectPosition || "50% 50%",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url("data:image/svg+xml;charset=utf-8,${(0, _imageBlurSvg).getImageBlurSvg({
            widthInt,
            heightInt,
            blurWidth,
            blurHeight,
            blurDataURL
        })}")`
    } : {};
    if (false) {}
    const imgAttributes = generateImgAttrs({
        config,
        src,
        unoptimized,
        width: widthInt,
        quality: qualityInt,
        sizes,
        loader
    });
    let srcString = src;
    if (false) {}
    const linkProps = {
        // @ts-expect-error upgrade react types to react 18
        imageSrcSet: imgAttributes.srcSet,
        imageSizes: imgAttributes.sizes,
        crossOrigin: rest.crossOrigin
    };
    const onLoadRef = (0, _react).useRef(onLoad);
    (0, _react).useEffect(()=>{
        onLoadRef.current = onLoad;
    }, [
        onLoad
    ]);
    const onLoadingCompleteRef = (0, _react).useRef(onLoadingComplete);
    (0, _react).useEffect(()=>{
        onLoadingCompleteRef.current = onLoadingComplete;
    }, [
        onLoadingComplete
    ]);
    const imgElementArgs = _extends({
        isLazy,
        imgAttributes,
        heightInt,
        widthInt,
        qualityInt,
        className,
        imgStyle,
        blurStyle,
        loading,
        config,
        fill,
        unoptimized,
        placeholder,
        loader,
        srcString,
        onLoadRef,
        onLoadingCompleteRef
    }, rest);
    return /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement(ImageElement, Object.assign({}, imgElementArgs, {
        ref: forwardedRef
    })), priority ? // for browsers that do not support `imagesrcset`, and in those cases
    // it would likely cause the incorrect image to be preloaded.
    //
    // https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset
    /*#__PURE__*/ _react.default.createElement(_head.default, null, /*#__PURE__*/ _react.default.createElement("link", Object.assign({
        key: "__nimg-" + imgAttributes.src + imgAttributes.srcSet + imgAttributes.sizes,
        rel: "preload",
        as: "image",
        href: imgAttributes.srcSet ? undefined : imgAttributes.src
    }, linkProps))) : null);
});
var _default = Image;
exports["default"] = _default;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=image.js.map


/***/ }),

/***/ 1551:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

"use client";
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = void 0;
var _interop_require_default = (__webpack_require__(3903)/* ["default"] */ .Z);
var _object_without_properties_loose = (__webpack_require__(5154)/* ["default"] */ .Z);
var _react = _interop_require_default(__webpack_require__(6689));
var _router = __webpack_require__(1003);
var _formatUrl = __webpack_require__(3938);
var _addLocale = __webpack_require__(4465);
var _routerContext = __webpack_require__(4964);
var _appRouterContext = __webpack_require__(3280);
var _useIntersection = __webpack_require__(9246);
var _getDomainLocale = __webpack_require__(227);
var _addBasePath = __webpack_require__(3468);
const prefetched = new Set();
function prefetch(router, href, as, options) {
    if (true) {
        return;
    }
    if (!(0, _router).isLocalURL(href)) {
        return;
    }
    // We should only dedupe requests when experimental.optimisticClientCache is
    // disabled.
    if (!options.bypassPrefetchedCheck) {
        const locale = typeof options.locale !== "undefined" ? options.locale : "locale" in router ? router.locale : undefined;
        const prefetchedKey = href + "%" + as + "%" + locale;
        // If we've already fetched the key, then don't prefetch it again!
        if (prefetched.has(prefetchedKey)) {
            return;
        }
        // Mark this URL as prefetched.
        prefetched.add(prefetchedKey);
    }
    // Prefetch the JSON page if asked (only in the client)
    // We need to handle a prefetch error here since we may be
    // loading with priority which can reject but we don't
    // want to force navigation since this is only a prefetch
    Promise.resolve(router.prefetch(href, as, options)).catch((err)=>{
        if (false) {}
    });
}
function isModifiedEvent(event) {
    const { target  } = event.currentTarget;
    return target && target !== "_self" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.nativeEvent && event.nativeEvent.which === 2;
}
function linkClicked(e, router, href, as, replace, shallow, scroll, locale, isAppRouter, prefetchEnabled) {
    const { nodeName  } = e.currentTarget;
    // anchors inside an svg have a lowercase nodeName
    const isAnchorNodeName = nodeName.toUpperCase() === "A";
    if (isAnchorNodeName && (isModifiedEvent(e) || !(0, _router).isLocalURL(href))) {
        // ignore click for browser’s default behavior
        return;
    }
    e.preventDefault();
    const navigate = ()=>{
        // If the router is an NextRouter instance it will have `beforePopState`
        if ("beforePopState" in router) {
            router[replace ? "replace" : "push"](href, as, {
                shallow,
                locale,
                scroll
            });
        } else {
            router[replace ? "replace" : "push"](as || href, {
                forceOptimisticNavigation: !prefetchEnabled
            });
        }
    };
    if (isAppRouter) {
        // @ts-expect-error startTransition exists.
        _react.default.startTransition(navigate);
    } else {
        navigate();
    }
}
function formatStringOrUrl(urlObjOrString) {
    if (typeof urlObjOrString === "string") {
        return urlObjOrString;
    }
    return (0, _formatUrl).formatUrl(urlObjOrString);
}
/**
 * React Component that enables client-side transitions between routes.
 */ const Link = /*#__PURE__*/ _react.default.forwardRef(function LinkComponent(props, forwardedRef) {
    if (false) {}
    let children;
    const { href: hrefProp , as: asProp , children: childrenProp , prefetch: prefetchProp , passHref , replace , shallow , scroll , locale , onClick , onMouseEnter: onMouseEnterProp , onTouchStart: onTouchStartProp , legacyBehavior =true === false  } = props, restProps = _object_without_properties_loose(props, [
        "href",
        "as",
        "children",
        "prefetch",
        "passHref",
        "replace",
        "shallow",
        "scroll",
        "locale",
        "onClick",
        "onMouseEnter",
        "onTouchStart",
        "legacyBehavior"
    ]);
    children = childrenProp;
    if (legacyBehavior && (typeof children === "string" || typeof children === "number")) {
        children = /*#__PURE__*/ _react.default.createElement("a", null, children);
    }
    const prefetchEnabled = prefetchProp !== false;
    const pagesRouter = _react.default.useContext(_routerContext.RouterContext);
    const appRouter = _react.default.useContext(_appRouterContext.AppRouterContext);
    const router = pagesRouter != null ? pagesRouter : appRouter;
    // We're in the app directory if there is no pages router.
    const isAppRouter = !pagesRouter;
    if (false) {}
    const { href: href1 , as  } = _react.default.useMemo(()=>{
        if (!pagesRouter) {
            const resolvedHref = formatStringOrUrl(hrefProp);
            return {
                href: resolvedHref,
                as: asProp ? formatStringOrUrl(asProp) : resolvedHref
            };
        }
        const [resolvedHref1, resolvedAs] = (0, _router).resolveHref(pagesRouter, hrefProp, true);
        return {
            href: resolvedHref1,
            as: asProp ? (0, _router).resolveHref(pagesRouter, asProp) : resolvedAs || resolvedHref1
        };
    }, [
        pagesRouter,
        hrefProp,
        asProp
    ]);
    const previousHref = _react.default.useRef(href1);
    const previousAs = _react.default.useRef(as);
    // This will return the first child, if multiple are provided it will throw an error
    let child;
    if (legacyBehavior) {
        if (false) {} else {
            child = _react.default.Children.only(children);
        }
    } else {
        if (false) { var ref; }
    }
    const childRef = legacyBehavior ? child && typeof child === "object" && child.ref : forwardedRef;
    const [setIntersectionRef, isVisible, resetVisible] = (0, _useIntersection).useIntersection({
        rootMargin: "200px"
    });
    const setRef = _react.default.useCallback((el)=>{
        // Before the link getting observed, check if visible state need to be reset
        if (previousAs.current !== as || previousHref.current !== href1) {
            resetVisible();
            previousAs.current = as;
            previousHref.current = href1;
        }
        setIntersectionRef(el);
        if (childRef) {
            if (typeof childRef === "function") childRef(el);
            else if (typeof childRef === "object") {
                childRef.current = el;
            }
        }
    }, [
        as,
        childRef,
        href1,
        resetVisible,
        setIntersectionRef
    ]);
    // Prefetch the URL if we haven't already and it's visible.
    _react.default.useEffect(()=>{
        // in dev, we only prefetch on hover to avoid wasting resources as the prefetch will trigger compiling the page.
        if (false) {}
        if (!router) {
            return;
        }
        // If we don't need to prefetch the URL, don't do prefetch.
        if (!isVisible || !prefetchEnabled) {
            return;
        }
        // Prefetch the URL.
        prefetch(router, href1, as, {
            locale
        });
    }, [
        as,
        href1,
        isVisible,
        locale,
        prefetchEnabled,
        pagesRouter == null ? void 0 : pagesRouter.locale,
        router
    ]);
    const childProps = {
        ref: setRef,
        onClick (e) {
            if (false) {}
            if (!legacyBehavior && typeof onClick === "function") {
                onClick(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onClick === "function") {
                child.props.onClick(e);
            }
            if (!router) {
                return;
            }
            if (e.defaultPrevented) {
                return;
            }
            linkClicked(e, router, href1, as, replace, shallow, scroll, locale, isAppRouter, prefetchEnabled);
        },
        onMouseEnter (e) {
            if (!legacyBehavior && typeof onMouseEnterProp === "function") {
                onMouseEnterProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onMouseEnter === "function") {
                child.props.onMouseEnter(e);
            }
            if (!router) {
                return;
            }
            if (!prefetchEnabled && isAppRouter) {
                return;
            }
            prefetch(router, href1, as, {
                locale,
                priority: true,
                // @see {https://github.com/vercel/next.js/discussions/40268?sort=top#discussioncomment-3572642}
                bypassPrefetchedCheck: true
            });
        },
        onTouchStart (e) {
            if (!legacyBehavior && typeof onTouchStartProp === "function") {
                onTouchStartProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onTouchStart === "function") {
                child.props.onTouchStart(e);
            }
            if (!router) {
                return;
            }
            if (!prefetchEnabled && isAppRouter) {
                return;
            }
            prefetch(router, href1, as, {
                locale,
                priority: true,
                // @see {https://github.com/vercel/next.js/discussions/40268?sort=top#discussioncomment-3572642}
                bypassPrefetchedCheck: true
            });
        }
    };
    // If child is an <a> tag and doesn't have a href attribute, or if the 'passHref' property is
    // defined, we specify the current 'href', so that repetition is not needed by the user
    if (!legacyBehavior || passHref || child.type === "a" && !("href" in child.props)) {
        const curLocale = typeof locale !== "undefined" ? locale : pagesRouter == null ? void 0 : pagesRouter.locale;
        // we only render domain locales if we are currently on a domain locale
        // so that locale links are still visitable in development/preview envs
        const localeDomain = (pagesRouter == null ? void 0 : pagesRouter.isLocaleDomain) && (0, _getDomainLocale).getDomainLocale(as, curLocale, pagesRouter == null ? void 0 : pagesRouter.locales, pagesRouter == null ? void 0 : pagesRouter.domainLocales);
        childProps.href = localeDomain || (0, _addBasePath).addBasePath((0, _addLocale).addLocale(as, curLocale, pagesRouter == null ? void 0 : pagesRouter.defaultLocale));
    }
    return legacyBehavior ? /*#__PURE__*/ _react.default.cloneElement(child, childProps) : /*#__PURE__*/ _react.default.createElement("a", Object.assign({}, restProps, childProps), children);
});
var _default = Link;
exports["default"] = _default;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=link.js.map


/***/ }),

/***/ 2700:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.normalizePathTrailingSlash = void 0;
var _removeTrailingSlash = __webpack_require__(3297);
var _parsePath = __webpack_require__(8854);
const normalizePathTrailingSlash = (path)=>{
    if (!path.startsWith("/") || undefined) {
        return path;
    }
    const { pathname , query , hash  } = (0, _parsePath).parsePath(path);
    if (false) {}
    return `${(0, _removeTrailingSlash).removeTrailingSlash(pathname)}${query}${hash}`;
};
exports.normalizePathTrailingSlash = normalizePathTrailingSlash;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=normalize-trailing-slash.js.map


/***/ }),

/***/ 2813:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.removeBasePath = removeBasePath;
var _hasBasePath = __webpack_require__(928);
const basePath =  false || "";
function removeBasePath(path) {
    if (false) {}
    path = path.slice(basePath.length);
    if (!path.startsWith("/")) path = `/${path}`;
    return path;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=remove-base-path.js.map


/***/ }),

/***/ 6876:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.removeLocale = removeLocale;
var _parsePath = __webpack_require__(8854);
function removeLocale(path, locale) {
    if (false) {}
    return path;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=remove-locale.js.map


/***/ }),

/***/ 4686:
/***/ ((module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.cancelIdleCallback = exports.requestIdleCallback = void 0;
const requestIdleCallback = typeof self !== "undefined" && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function(cb) {
    let start = Date.now();
    return self.setTimeout(function() {
        cb({
            didTimeout: false,
            timeRemaining: function() {
                return Math.max(0, 50 - (Date.now() - start));
            }
        });
    }, 1);
};
exports.requestIdleCallback = requestIdleCallback;
const cancelIdleCallback = typeof self !== "undefined" && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function(id) {
    return clearTimeout(id);
};
exports.cancelIdleCallback = cancelIdleCallback;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=request-idle-callback.js.map


/***/ }),

/***/ 2497:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.markAssetError = markAssetError;
exports.isAssetError = isAssetError;
exports.getClientBuildManifest = getClientBuildManifest;
exports.createRouteLoader = createRouteLoader;
var _interop_require_default = (__webpack_require__(3903)/* ["default"] */ .Z);
var _getAssetPathFromRoute = _interop_require_default(__webpack_require__(9565));
var _trustedTypes = __webpack_require__(5407);
var _requestIdleCallback = __webpack_require__(4686);
// 3.8s was arbitrarily chosen as it's what https://web.dev/interactive
// considers as "Good" time-to-interactive. We must assume something went
// wrong beyond this point, and then fall-back to a full page transition to
// show the user something of value.
const MS_MAX_IDLE_DELAY = 3800;
function withFuture(key, map, generator) {
    let entry = map.get(key);
    if (entry) {
        if ("future" in entry) {
            return entry.future;
        }
        return Promise.resolve(entry);
    }
    let resolver;
    const prom = new Promise((resolve)=>{
        resolver = resolve;
    });
    map.set(key, entry = {
        resolve: resolver,
        future: prom
    });
    return generator ? generator() // eslint-disable-next-line no-sequences
    .then((value)=>(resolver(value), value)).catch((err)=>{
        map.delete(key);
        throw err;
    }) : prom;
}
const ASSET_LOAD_ERROR = Symbol("ASSET_LOAD_ERROR");
function markAssetError(err) {
    return Object.defineProperty(err, ASSET_LOAD_ERROR, {});
}
function isAssetError(err) {
    return err && ASSET_LOAD_ERROR in err;
}
function hasPrefetch(link) {
    try {
        link = document.createElement("link");
        return(// with relList.support
        !!window.MSInputMethodContext && !!document.documentMode || link.relList.supports("prefetch"));
    } catch (e) {
        return false;
    }
}
const canPrefetch = hasPrefetch();
function prefetchViaDom(href, as, link) {
    return new Promise((resolve, reject)=>{
        const selector = `
      link[rel="prefetch"][href^="${href}"],
      link[rel="preload"][href^="${href}"],
      script[src^="${href}"]`;
        if (document.querySelector(selector)) {
            return resolve();
        }
        link = document.createElement("link");
        // The order of property assignment here is intentional:
        if (as) link.as = as;
        link.rel = `prefetch`;
        link.crossOrigin = undefined;
        link.onload = resolve;
        link.onerror = ()=>reject(markAssetError(new Error(`Failed to prefetch: ${href}`)));
        // `href` should always be last:
        link.href = href;
        document.head.appendChild(link);
    });
}
function appendScript(src, script) {
    return new Promise((resolve, reject)=>{
        script = document.createElement("script");
        // The order of property assignment here is intentional.
        // 1. Setup success/failure hooks in case the browser synchronously
        //    executes when `src` is set.
        script.onload = resolve;
        script.onerror = ()=>reject(markAssetError(new Error(`Failed to load script: ${src}`)));
        // 2. Configure the cross-origin attribute before setting `src` in case the
        //    browser begins to fetch.
        script.crossOrigin = undefined;
        // 3. Finally, set the source and inject into the DOM in case the child
        //    must be appended for fetching to start.
        script.src = src;
        document.body.appendChild(script);
    });
}
// We wait for pages to be built in dev before we start the route transition
// timeout to prevent an un-necessary hard navigation in development.
let devBuildPromise;
// Resolve a promise that times out after given amount of milliseconds.
function resolvePromiseWithTimeout(p, ms, err) {
    return new Promise((resolve, reject)=>{
        let cancelled = false;
        p.then((r)=>{
            // Resolved, cancel the timeout
            cancelled = true;
            resolve(r);
        }).catch(reject);
        // We wrap these checks separately for better dead-code elimination in
        // production bundles.
        if (false) {}
        if (true) {
            (0, _requestIdleCallback).requestIdleCallback(()=>setTimeout(()=>{
                    if (!cancelled) {
                        reject(err);
                    }
                }, ms));
        }
    });
}
function getClientBuildManifest() {
    if (self.__BUILD_MANIFEST) {
        return Promise.resolve(self.__BUILD_MANIFEST);
    }
    const onBuildManifest = new Promise((resolve)=>{
        // Mandatory because this is not concurrent safe:
        const cb = self.__BUILD_MANIFEST_CB;
        self.__BUILD_MANIFEST_CB = ()=>{
            resolve(self.__BUILD_MANIFEST);
            cb && cb();
        };
    });
    return resolvePromiseWithTimeout(onBuildManifest, MS_MAX_IDLE_DELAY, markAssetError(new Error("Failed to load client build manifest")));
}
function getFilesForRoute(assetPrefix, route) {
    if (false) {}
    return getClientBuildManifest().then((manifest)=>{
        if (!(route in manifest)) {
            throw markAssetError(new Error(`Failed to lookup route: ${route}`));
        }
        const allFiles = manifest[route].map((entry)=>assetPrefix + "/_next/" + encodeURI(entry));
        return {
            scripts: allFiles.filter((v)=>v.endsWith(".js")).map((v)=>(0, _trustedTypes).__unsafeCreateTrustedScriptURL(v)),
            css: allFiles.filter((v)=>v.endsWith(".css"))
        };
    });
}
function createRouteLoader(assetPrefix) {
    const entrypoints = new Map();
    const loadedScripts = new Map();
    const styleSheets = new Map();
    const routes = new Map();
    function maybeExecuteScript(src) {
        // With HMR we might need to "reload" scripts when they are
        // disposed and readded. Executing scripts twice has no functional
        // differences
        if (true) {
            let prom = loadedScripts.get(src.toString());
            if (prom) {
                return prom;
            }
            // Skip executing script if it's already in the DOM:
            if (document.querySelector(`script[src^="${src}"]`)) {
                return Promise.resolve();
            }
            loadedScripts.set(src.toString(), prom = appendScript(src));
            return prom;
        } else {}
    }
    function fetchStyleSheet(href) {
        let prom = styleSheets.get(href);
        if (prom) {
            return prom;
        }
        styleSheets.set(href, prom = fetch(href).then((res)=>{
            if (!res.ok) {
                throw new Error(`Failed to load stylesheet: ${href}`);
            }
            return res.text().then((text)=>({
                    href: href,
                    content: text
                }));
        }).catch((err)=>{
            throw markAssetError(err);
        }));
        return prom;
    }
    return {
        whenEntrypoint (route) {
            return withFuture(route, entrypoints);
        },
        onEntrypoint (route, execute) {
            (execute ? Promise.resolve().then(()=>execute()).then((exports1)=>({
                    component: exports1 && exports1.default || exports1,
                    exports: exports1
                }), (err)=>({
                    error: err
                })) : Promise.resolve(undefined)).then((input)=>{
                const old = entrypoints.get(route);
                if (old && "resolve" in old) {
                    if (input) {
                        entrypoints.set(route, input);
                        old.resolve(input);
                    }
                } else {
                    if (input) {
                        entrypoints.set(route, input);
                    } else {
                        entrypoints.delete(route);
                    }
                    // when this entrypoint has been resolved before
                    // the route is outdated and we want to invalidate
                    // this cache entry
                    routes.delete(route);
                }
            });
        },
        loadRoute (route, prefetch) {
            return withFuture(route, routes, ()=>{
                let devBuildPromiseResolve;
                if (false) {}
                return resolvePromiseWithTimeout(getFilesForRoute(assetPrefix, route).then(({ scripts , css  })=>{
                    return Promise.all([
                        entrypoints.has(route) ? [] : Promise.all(scripts.map(maybeExecuteScript)),
                        Promise.all(css.map(fetchStyleSheet))
                    ]);
                }).then((res)=>{
                    return this.whenEntrypoint(route).then((entrypoint)=>({
                            entrypoint,
                            styles: res[1]
                        }));
                }), MS_MAX_IDLE_DELAY, markAssetError(new Error(`Route did not complete loading: ${route}`))).then(({ entrypoint , styles  })=>{
                    const res = Object.assign({
                        styles: styles
                    }, entrypoint);
                    return "error" in entrypoint ? entrypoint : res;
                }).catch((err)=>{
                    if (prefetch) {
                        // we don't want to cache errors during prefetch
                        throw err;
                    }
                    return {
                        error: err
                    };
                }).finally(()=>{
                    return devBuildPromiseResolve == null ? void 0 : devBuildPromiseResolve();
                });
            });
        },
        prefetch (route) {
            // https://github.com/GoogleChromeLabs/quicklink/blob/453a661fa1fa940e2d2e044452398e38c67a98fb/src/index.mjs#L115-L118
            // License: Apache 2.0
            let cn;
            if (cn = navigator.connection) {
                // Don't prefetch if using 2G or if Save-Data is enabled.
                if (cn.saveData || /2g/.test(cn.effectiveType)) return Promise.resolve();
            }
            return getFilesForRoute(assetPrefix, route).then((output)=>Promise.all(canPrefetch ? output.scripts.map((script)=>prefetchViaDom(script.toString(), "script")) : [])).then(()=>{
                (0, _requestIdleCallback).requestIdleCallback(()=>this.loadRoute(route, true).catch(()=>{}));
            }).catch(()=>{});
        }
    };
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=route-loader.js.map


/***/ }),

/***/ 3573:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

"use client";
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.handleClientScriptLoad = handleClientScriptLoad;
exports.initScriptLoader = initScriptLoader;
exports["default"] = void 0;
var _extends = (__webpack_require__(9419)/* ["default"] */ .Z);
var _interop_require_default = (__webpack_require__(3903)/* ["default"] */ .Z);
var _interop_require_wildcard = (__webpack_require__(199)/* ["default"] */ .Z);
var _object_without_properties_loose = (__webpack_require__(5154)/* ["default"] */ .Z);
var _reactDom = _interop_require_default(__webpack_require__(6405));
var _react = _interop_require_wildcard(__webpack_require__(6689));
var _headManagerContext = __webpack_require__(2796);
var _headManager = __webpack_require__(1831);
var _requestIdleCallback = __webpack_require__(4686);
const ScriptCache = new Map();
const LoadCache = new Set();
const ignoreProps = [
    "onLoad",
    "onReady",
    "dangerouslySetInnerHTML",
    "children",
    "onError",
    "strategy"
];
const loadScript = (props)=>{
    const { src , id , onLoad =()=>{} , onReady =null , dangerouslySetInnerHTML , children ="" , strategy ="afterInteractive" , onError  } = props;
    const cacheKey = id || src;
    // Script has already loaded
    if (cacheKey && LoadCache.has(cacheKey)) {
        return;
    }
    // Contents of this script are already loading/loaded
    if (ScriptCache.has(src)) {
        LoadCache.add(cacheKey);
        // It is possible that multiple `next/script` components all have same "src", but has different "onLoad"
        // This is to make sure the same remote script will only load once, but "onLoad" are executed in order
        ScriptCache.get(src).then(onLoad, onError);
        return;
    }
    /** Execute after the script first loaded */ const afterLoad = ()=>{
        // Run onReady for the first time after load event
        if (onReady) {
            onReady();
        }
        // add cacheKey to LoadCache when load successfully
        LoadCache.add(cacheKey);
    };
    const el = document.createElement("script");
    const loadPromise = new Promise((resolve, reject)=>{
        el.addEventListener("load", function(e) {
            resolve();
            if (onLoad) {
                onLoad.call(this, e);
            }
            afterLoad();
        });
        el.addEventListener("error", function(e) {
            reject(e);
        });
    }).catch(function(e) {
        if (onError) {
            onError(e);
        }
    });
    if (dangerouslySetInnerHTML) {
        el.innerHTML = dangerouslySetInnerHTML.__html || "";
        afterLoad();
    } else if (children) {
        el.textContent = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : "";
        afterLoad();
    } else if (src) {
        el.src = src;
        // do not add cacheKey into LoadCache for remote script here
        // cacheKey will be added to LoadCache when it is actually loaded (see loadPromise above)
        ScriptCache.set(src, loadPromise);
    }
    for (const [k, value] of Object.entries(props)){
        if (value === undefined || ignoreProps.includes(k)) {
            continue;
        }
        const attr = _headManager.DOMAttributeNames[k] || k.toLowerCase();
        el.setAttribute(attr, value);
    }
    if (strategy === "worker") {
        el.setAttribute("type", "text/partytown");
    }
    el.setAttribute("data-nscript", strategy);
    document.body.appendChild(el);
};
function handleClientScriptLoad(props) {
    const { strategy ="afterInteractive"  } = props;
    if (strategy === "lazyOnload") {
        window.addEventListener("load", ()=>{
            (0, _requestIdleCallback).requestIdleCallback(()=>loadScript(props));
        });
    } else {
        loadScript(props);
    }
}
function loadLazyScript(props) {
    if (document.readyState === "complete") {
        (0, _requestIdleCallback).requestIdleCallback(()=>loadScript(props));
    } else {
        window.addEventListener("load", ()=>{
            (0, _requestIdleCallback).requestIdleCallback(()=>loadScript(props));
        });
    }
}
function addBeforeInteractiveToCache() {
    const scripts = [
        ...document.querySelectorAll('[data-nscript="beforeInteractive"]'),
        ...document.querySelectorAll('[data-nscript="beforePageRender"]')
    ];
    scripts.forEach((script)=>{
        const cacheKey = script.id || script.getAttribute("src");
        LoadCache.add(cacheKey);
    });
}
function initScriptLoader(scriptLoaderItems) {
    scriptLoaderItems.forEach(handleClientScriptLoad);
    addBeforeInteractiveToCache();
}
function Script(props) {
    const { id , src ="" , onLoad =()=>{} , onReady =null , strategy ="afterInteractive" , onError  } = props, restProps = _object_without_properties_loose(props, [
        "id",
        "src",
        "onLoad",
        "onReady",
        "strategy",
        "onError"
    ]);
    // Context is available only during SSR
    const { updateScripts , scripts , getIsSsr , appDir , nonce  } = (0, _react).useContext(_headManagerContext.HeadManagerContext);
    /**
   * - First mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script hasn't loaded yet (not in LoadCache)
   *      onReady is skipped, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. hasLoadScriptEffectCalled.current is false, loadScript executes
   *      Once the script is loaded, the onLoad and onReady will be called by then
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   *
   * - Second mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script has already loaded (found in LoadCache)
   *      onReady is called, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. The script is already loaded, loadScript bails out
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   */ const hasOnReadyEffectCalled = (0, _react).useRef(false);
    (0, _react).useEffect(()=>{
        const cacheKey = id || src;
        if (!hasOnReadyEffectCalled.current) {
            // Run onReady if script has loaded before but component is re-mounted
            if (onReady && cacheKey && LoadCache.has(cacheKey)) {
                onReady();
            }
            hasOnReadyEffectCalled.current = true;
        }
    }, [
        onReady,
        id,
        src
    ]);
    const hasLoadScriptEffectCalled = (0, _react).useRef(false);
    (0, _react).useEffect(()=>{
        if (!hasLoadScriptEffectCalled.current) {
            if (strategy === "afterInteractive") {
                loadScript(props);
            } else if (strategy === "lazyOnload") {
                loadLazyScript(props);
            }
            hasLoadScriptEffectCalled.current = true;
        }
    }, [
        props,
        strategy
    ]);
    if (strategy === "beforeInteractive" || strategy === "worker") {
        if (updateScripts) {
            scripts[strategy] = (scripts[strategy] || []).concat([
                _extends({
                    id,
                    src,
                    onLoad,
                    onReady,
                    onError
                }, restProps)
            ]);
            updateScripts(scripts);
        } else if (getIsSsr && getIsSsr()) {
            // Script has already loaded during SSR
            LoadCache.add(id || src);
        } else if (getIsSsr && !getIsSsr()) {
            loadScript(props);
        }
    }
    // For the app directory, we need React Float to preload these scripts.
    if (appDir) {
        // Before interactive scripts need to be loaded by Next.js' runtime instead
        // of native <script> tags, because they no longer have `defer`.
        if (strategy === "beforeInteractive") {
            if (!src) {
                // For inlined scripts, we put the content in `children`.
                if (restProps.dangerouslySetInnerHTML) {
                    restProps.children = restProps.dangerouslySetInnerHTML.__html;
                    delete restProps.dangerouslySetInnerHTML;
                }
                return /*#__PURE__*/ _react.default.createElement("script", {
                    nonce: nonce,
                    dangerouslySetInnerHTML: {
                        __html: `(self.__next_s=self.__next_s||[]).push(${JSON.stringify([
                            0,
                            _extends({}, restProps)
                        ])})`
                    }
                });
            }
            // @ts-ignore
            _reactDom.default.preload(src, restProps.integrity ? {
                as: "script",
                integrity: restProps.integrity
            } : {
                as: "script"
            });
            return /*#__PURE__*/ _react.default.createElement("script", {
                nonce: nonce,
                dangerouslySetInnerHTML: {
                    __html: `(self.__next_s=self.__next_s||[]).push(${JSON.stringify([
                        src
                    ])})`
                }
            });
        } else if (strategy === "afterInteractive") {
            if (src) {
                // @ts-ignore
                _reactDom.default.preload(src, restProps.integrity ? {
                    as: "script",
                    integrity: restProps.integrity
                } : {
                    as: "script"
                });
            }
        }
    }
    return null;
}
Object.defineProperty(Script, "__nextScript", {
    value: true
});
var _default = Script;
exports["default"] = _default;
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=script.js.map


/***/ }),

/***/ 5407:
/***/ ((module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.__unsafeCreateTrustedScriptURL = __unsafeCreateTrustedScriptURL;
/**
 * Stores the Trusted Types Policy. Starts as undefined and can be set to null
 * if Trusted Types is not supported in the browser.
 */ let policy;
/**
 * Getter for the Trusted Types Policy. If it is undefined, it is instantiated
 * here or set to null if Trusted Types is not supported in the browser.
 */ function getPolicy() {
    if (typeof policy === "undefined" && "undefined" !== "undefined") { var ref; }
    return policy;
}
function __unsafeCreateTrustedScriptURL(url) {
    var ref;
    return ((ref = getPolicy()) == null ? void 0 : ref.createScriptURL(url)) || url;
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=trusted-types.js.map


/***/ }),

/***/ 9246:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.useIntersection = useIntersection;
var _react = __webpack_require__(6689);
var _requestIdleCallback = __webpack_require__(4686);
const hasIntersectionObserver = typeof IntersectionObserver === "function";
const observers = new Map();
const idList = [];
function createObserver(options) {
    const id = {
        root: options.root || null,
        margin: options.rootMargin || ""
    };
    const existing = idList.find((obj)=>obj.root === id.root && obj.margin === id.margin);
    let instance;
    if (existing) {
        instance = observers.get(existing);
        if (instance) {
            return instance;
        }
    }
    const elements = new Map();
    const observer = new IntersectionObserver((entries)=>{
        entries.forEach((entry)=>{
            const callback = elements.get(entry.target);
            const isVisible = entry.isIntersecting || entry.intersectionRatio > 0;
            if (callback && isVisible) {
                callback(isVisible);
            }
        });
    }, options);
    instance = {
        id,
        observer,
        elements
    };
    idList.push(id);
    observers.set(id, instance);
    return instance;
}
function observe(element, callback, options) {
    const { id , observer , elements  } = createObserver(options);
    elements.set(element, callback);
    observer.observe(element);
    return function unobserve() {
        elements.delete(element);
        observer.unobserve(element);
        // Destroy observer when there's nothing left to watch:
        if (elements.size === 0) {
            observer.disconnect();
            observers.delete(id);
            const index = idList.findIndex((obj)=>obj.root === id.root && obj.margin === id.margin);
            if (index > -1) {
                idList.splice(index, 1);
            }
        }
    };
}
function useIntersection({ rootRef , rootMargin , disabled  }) {
    const isDisabled = disabled || !hasIntersectionObserver;
    const [visible, setVisible] = (0, _react).useState(false);
    const [element, setElement] = (0, _react).useState(null);
    (0, _react).useEffect(()=>{
        if (hasIntersectionObserver) {
            if (isDisabled || visible) return;
            if (element && element.tagName) {
                const unobserve = observe(element, (isVisible)=>isVisible && setVisible(isVisible), {
                    root: rootRef == null ? void 0 : rootRef.current,
                    rootMargin
                });
                return unobserve;
            }
        } else {
            if (!visible) {
                const idleCallback = (0, _requestIdleCallback).requestIdleCallback(()=>setVisible(true));
                return ()=>(0, _requestIdleCallback).cancelIdleCallback(idleCallback);
            }
        }
    }, [
        element,
        isDisabled,
        rootMargin,
        rootRef,
        visible
    ]);
    const resetVisible = (0, _react).useCallback(()=>{
        setVisible(false);
    }, []);
    return [
        setElement,
        visible,
        resetVisible
    ];
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=use-intersection.js.map


/***/ }),

/***/ 1003:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.matchesMiddleware = matchesMiddleware;
exports.isLocalURL = isLocalURL;
exports.interpolateAs = interpolateAs;
exports.resolveHref = resolveHref;
exports.createKey = createKey;
exports["default"] = void 0;
var _async_to_generator = (__webpack_require__(8282)/* ["default"] */ .Z);
var _extends = (__webpack_require__(9419)/* ["default"] */ .Z);
var _interop_require_default = (__webpack_require__(3903)/* ["default"] */ .Z);
var _interop_require_wildcard = (__webpack_require__(199)/* ["default"] */ .Z);
var _normalizeTrailingSlash = __webpack_require__(2700);
var _removeTrailingSlash = __webpack_require__(3297);
var _routeLoader = __webpack_require__(2497);
var _script = __webpack_require__(3573);
var _isError = _interop_require_wildcard(__webpack_require__(676));
var _denormalizePagePath = __webpack_require__(4406);
var _normalizeLocalePath = __webpack_require__(4014);
var _mitt = _interop_require_default(__webpack_require__(8020));
var _utils = __webpack_require__(9232);
var _isDynamic = __webpack_require__(1428);
var _parseRelativeUrl = __webpack_require__(1292);
var _querystring = __webpack_require__(979);
var _resolveRewrites = _interop_require_default(__webpack_require__(6052));
var _routeMatcher = __webpack_require__(4226);
var _routeRegex = __webpack_require__(5052);
var _formatUrl = __webpack_require__(3938);
var _detectDomainLocale = __webpack_require__(4643);
var _parsePath = __webpack_require__(8854);
var _addLocale = __webpack_require__(4465);
var _removeLocale = __webpack_require__(6876);
var _removeBasePath = __webpack_require__(2813);
var _addBasePath = __webpack_require__(3468);
var _hasBasePath = __webpack_require__(928);
var _isApiRoute = __webpack_require__(9423);
var _getNextPathnameInfo = __webpack_require__(5789);
var _formatNextPathnameInfo = __webpack_require__(299);
var _compareStates = __webpack_require__(6220);
var _isBot = __webpack_require__(1897);
function buildCancellationError() {
    return Object.assign(new Error("Route Cancelled"), {
        cancelled: true
    });
}
function matchesMiddleware(options) {
    return _matchesMiddleware.apply(this, arguments);
}
function _matchesMiddleware() {
    _matchesMiddleware = _async_to_generator(function*(options) {
        const matchers = yield Promise.resolve(options.router.pageLoader.getMiddleware());
        if (!matchers) return false;
        const { pathname: asPathname  } = (0, _parsePath).parsePath(options.asPath);
        // remove basePath first since path prefix has to be in the order of `/${basePath}/${locale}`
        const cleanedAs = (0, _hasBasePath).hasBasePath(asPathname) ? (0, _removeBasePath).removeBasePath(asPathname) : asPathname;
        const asWithBasePathAndLocale = (0, _addBasePath).addBasePath((0, _addLocale).addLocale(cleanedAs, options.locale));
        // Check only path match on client. Matching "has" should be done on server
        // where we can access more info such as headers, HttpOnly cookie, etc.
        return matchers.some((m)=>new RegExp(m.regexp).test(asWithBasePathAndLocale));
    });
    return _matchesMiddleware.apply(this, arguments);
}
function stripOrigin(url) {
    const origin = (0, _utils).getLocationOrigin();
    return url.startsWith(origin) ? url.substring(origin.length) : url;
}
function omit(object, keys) {
    const omitted = {};
    Object.keys(object).forEach((key)=>{
        if (!keys.includes(key)) {
            omitted[key] = object[key];
        }
    });
    return omitted;
}
function isLocalURL(url) {
    // prevent a hydration mismatch on href for url with anchor refs
    if (!(0, _utils).isAbsoluteUrl(url)) return true;
    try {
        // absolute urls can be local if they are on the same origin
        const locationOrigin = (0, _utils).getLocationOrigin();
        const resolved = new URL(url, locationOrigin);
        return resolved.origin === locationOrigin && (0, _hasBasePath).hasBasePath(resolved.pathname);
    } catch (_) {
        return false;
    }
}
function interpolateAs(route, asPathname, query) {
    let interpolatedRoute = "";
    const dynamicRegex = (0, _routeRegex).getRouteRegex(route);
    const dynamicGroups = dynamicRegex.groups;
    const dynamicMatches = (asPathname !== route ? (0, _routeMatcher).getRouteMatcher(dynamicRegex)(asPathname) : "") || // Fall back to reading the values from the href
    // TODO: should this take priority; also need to change in the router.
    query;
    interpolatedRoute = route;
    const params = Object.keys(dynamicGroups);
    if (!params.every((param)=>{
        let value = dynamicMatches[param] || "";
        const { repeat , optional  } = dynamicGroups[param];
        // support single-level catch-all
        // TODO: more robust handling for user-error (passing `/`)
        let replaced = `[${repeat ? "..." : ""}${param}]`;
        if (optional) {
            replaced = `${!value ? "/" : ""}[${replaced}]`;
        }
        if (repeat && !Array.isArray(value)) value = [
            value
        ];
        return (optional || param in dynamicMatches) && // Interpolate group into data URL if present
        (interpolatedRoute = interpolatedRoute.replace(replaced, repeat ? value.map(// path delimiter escaped since they are being inserted
        // into the URL and we expect URL encoded segments
        // when parsing dynamic route params
        (segment)=>encodeURIComponent(segment)).join("/") : encodeURIComponent(value)) || "/");
    })) {
        interpolatedRoute = "" // did not satisfy all requirements
        ;
    // n.b. We ignore this error because we handle warning for this case in
    // development in the `<Link>` component directly.
    }
    return {
        params,
        result: interpolatedRoute
    };
}
function resolveHref(router, href, resolveAs) {
    // we use a dummy base url for relative urls
    let base;
    let urlAsString = typeof href === "string" ? href : (0, _formatUrl).formatWithValidation(href);
    // repeated slashes and backslashes in the URL are considered
    // invalid and will never match a Next.js page/file
    const urlProtoMatch = urlAsString.match(/^[a-zA-Z]{1,}:\/\//);
    const urlAsStringNoProto = urlProtoMatch ? urlAsString.slice(urlProtoMatch[0].length) : urlAsString;
    const urlParts = urlAsStringNoProto.split("?");
    if ((urlParts[0] || "").match(/(\/\/|\\)/)) {
        console.error(`Invalid href passed to next/router: ${urlAsString}, repeated forward-slashes (//) or backslashes \\ are not valid in the href`);
        const normalizedUrl = (0, _utils).normalizeRepeatedSlashes(urlAsStringNoProto);
        urlAsString = (urlProtoMatch ? urlProtoMatch[0] : "") + normalizedUrl;
    }
    // Return because it cannot be routed by the Next.js router
    if (!isLocalURL(urlAsString)) {
        return resolveAs ? [
            urlAsString
        ] : urlAsString;
    }
    try {
        base = new URL(urlAsString.startsWith("#") ? router.asPath : router.pathname, "http://n");
    } catch (_) {
        // fallback to / for invalid asPath values e.g. //
        base = new URL("/", "http://n");
    }
    try {
        const finalUrl = new URL(urlAsString, base);
        finalUrl.pathname = (0, _normalizeTrailingSlash).normalizePathTrailingSlash(finalUrl.pathname);
        let interpolatedAs = "";
        if ((0, _isDynamic).isDynamicRoute(finalUrl.pathname) && finalUrl.searchParams && resolveAs) {
            const query = (0, _querystring).searchParamsToUrlQuery(finalUrl.searchParams);
            const { result , params  } = interpolateAs(finalUrl.pathname, finalUrl.pathname, query);
            if (result) {
                interpolatedAs = (0, _formatUrl).formatWithValidation({
                    pathname: result,
                    hash: finalUrl.hash,
                    query: omit(query, params)
                });
            }
        }
        // if the origin didn't change, it means we received a relative href
        const resolvedHref = finalUrl.origin === base.origin ? finalUrl.href.slice(finalUrl.origin.length) : finalUrl.href;
        return resolveAs ? [
            resolvedHref,
            interpolatedAs || resolvedHref
        ] : resolvedHref;
    } catch (_1) {
        return resolveAs ? [
            urlAsString
        ] : urlAsString;
    }
}
function prepareUrlAs(router, url, as) {
    // If url and as provided as an object representation,
    // we'll format them into the string version here.
    let [resolvedHref, resolvedAs] = resolveHref(router, url, true);
    const origin = (0, _utils).getLocationOrigin();
    const hrefWasAbsolute = resolvedHref.startsWith(origin);
    const asWasAbsolute = resolvedAs && resolvedAs.startsWith(origin);
    resolvedHref = stripOrigin(resolvedHref);
    resolvedAs = resolvedAs ? stripOrigin(resolvedAs) : resolvedAs;
    const preparedUrl = hrefWasAbsolute ? resolvedHref : (0, _addBasePath).addBasePath(resolvedHref);
    const preparedAs = as ? stripOrigin(resolveHref(router, as)) : resolvedAs || resolvedHref;
    return {
        url: preparedUrl,
        as: asWasAbsolute ? preparedAs : (0, _addBasePath).addBasePath(preparedAs)
    };
}
function resolveDynamicRoute(pathname, pages) {
    const cleanPathname = (0, _removeTrailingSlash).removeTrailingSlash((0, _denormalizePagePath).denormalizePagePath(pathname));
    if (cleanPathname === "/404" || cleanPathname === "/_error") {
        return pathname;
    }
    // handle resolving href for dynamic routes
    if (!pages.includes(cleanPathname)) {
        // eslint-disable-next-line array-callback-return
        pages.some((page)=>{
            if ((0, _isDynamic).isDynamicRoute(page) && (0, _routeRegex).getRouteRegex(page).re.test(cleanPathname)) {
                pathname = page;
                return true;
            }
        });
    }
    return (0, _removeTrailingSlash).removeTrailingSlash(pathname);
}
function getMiddlewareData(source, response, options) {
    const nextConfig = {
        basePath: options.router.basePath,
        i18n: {
            locales: options.router.locales
        },
        trailingSlash: Boolean(false)
    };
    const rewriteHeader = response.headers.get("x-nextjs-rewrite");
    let rewriteTarget = rewriteHeader || response.headers.get("x-nextjs-matched-path");
    const matchedPath = response.headers.get("x-matched-path");
    if (matchedPath && !rewriteTarget && !matchedPath.includes("__next_data_catchall") && !matchedPath.includes("/_error") && !matchedPath.includes("/404")) {
        // leverage x-matched-path to detect next.config.js rewrites
        rewriteTarget = matchedPath;
    }
    if (rewriteTarget) {
        if (rewriteTarget.startsWith("/")) {
            const parsedRewriteTarget = (0, _parseRelativeUrl).parseRelativeUrl(rewriteTarget);
            const pathnameInfo = (0, _getNextPathnameInfo).getNextPathnameInfo(parsedRewriteTarget.pathname, {
                nextConfig,
                parseData: true
            });
            let fsPathname = (0, _removeTrailingSlash).removeTrailingSlash(pathnameInfo.pathname);
            return Promise.all([
                options.router.pageLoader.getPageList(),
                (0, _routeLoader).getClientBuildManifest()
            ]).then(([pages, { __rewrites: rewrites  }])=>{
                let as = (0, _addLocale).addLocale(pathnameInfo.pathname, pathnameInfo.locale);
                if ((0, _isDynamic).isDynamicRoute(as) || !rewriteHeader && pages.includes((0, _normalizeLocalePath).normalizeLocalePath((0, _removeBasePath).removeBasePath(as), options.router.locales).pathname)) {
                    const parsedSource = (0, _getNextPathnameInfo).getNextPathnameInfo((0, _parseRelativeUrl).parseRelativeUrl(source).pathname, {
                        parseData: true
                    });
                    as = (0, _addBasePath).addBasePath(parsedSource.pathname);
                    parsedRewriteTarget.pathname = as;
                }
                if (false) {} else if (!pages.includes(fsPathname)) {
                    const resolvedPathname = resolveDynamicRoute(fsPathname, pages);
                    if (resolvedPathname !== fsPathname) {
                        fsPathname = resolvedPathname;
                    }
                }
                const resolvedHref = !pages.includes(fsPathname) ? resolveDynamicRoute((0, _normalizeLocalePath).normalizeLocalePath((0, _removeBasePath).removeBasePath(parsedRewriteTarget.pathname), options.router.locales).pathname, pages) : fsPathname;
                if ((0, _isDynamic).isDynamicRoute(resolvedHref)) {
                    const matches = (0, _routeMatcher).getRouteMatcher((0, _routeRegex).getRouteRegex(resolvedHref))(as);
                    Object.assign(parsedRewriteTarget.query, matches || {});
                }
                return {
                    type: "rewrite",
                    parsedAs: parsedRewriteTarget,
                    resolvedHref
                };
            });
        }
        const src = (0, _parsePath).parsePath(source);
        const pathname = (0, _formatNextPathnameInfo).formatNextPathnameInfo(_extends({}, (0, _getNextPathnameInfo).getNextPathnameInfo(src.pathname, {
            nextConfig,
            parseData: true
        }), {
            defaultLocale: options.router.defaultLocale,
            buildId: ""
        }));
        return Promise.resolve({
            type: "redirect-external",
            destination: `${pathname}${src.query}${src.hash}`
        });
    }
    const redirectTarget = response.headers.get("x-nextjs-redirect");
    if (redirectTarget) {
        if (redirectTarget.startsWith("/")) {
            const src1 = (0, _parsePath).parsePath(redirectTarget);
            const pathname1 = (0, _formatNextPathnameInfo).formatNextPathnameInfo(_extends({}, (0, _getNextPathnameInfo).getNextPathnameInfo(src1.pathname, {
                nextConfig,
                parseData: true
            }), {
                defaultLocale: options.router.defaultLocale,
                buildId: ""
            }));
            return Promise.resolve({
                type: "redirect-internal",
                newAs: `${pathname1}${src1.query}${src1.hash}`,
                newUrl: `${pathname1}${src1.query}${src1.hash}`
            });
        }
        return Promise.resolve({
            type: "redirect-external",
            destination: redirectTarget
        });
    }
    return Promise.resolve({
        type: "next"
    });
}
function withMiddlewareEffects(options) {
    return _withMiddlewareEffects.apply(this, arguments);
}
function _withMiddlewareEffects() {
    _withMiddlewareEffects = _async_to_generator(function*(options) {
        const matches = yield matchesMiddleware(options);
        if (!matches || !options.fetchData) {
            return null;
        }
        try {
            const data = yield options.fetchData();
            const effect = yield getMiddlewareData(data.dataHref, data.response, options);
            return {
                dataHref: data.dataHref,
                json: data.json,
                response: data.response,
                text: data.text,
                cacheKey: data.cacheKey,
                effect
            };
        } catch (e) {
            /**
     * TODO: Revisit this in the future.
     * For now we will not consider middleware data errors to be fatal.
     * maybe we should revisit in the future.
     */ return null;
        }
    });
    return _withMiddlewareEffects.apply(this, arguments);
}
const manualScrollRestoration = (/* unused pure expression or super */ null && ( false && 0));
const SSG_DATA_NOT_FOUND = Symbol("SSG_DATA_NOT_FOUND");
function fetchRetry(url, attempts, options) {
    return fetch(url, {
        // Cookies are required to be present for Next.js' SSG "Preview Mode".
        // Cookies may also be required for `getServerSideProps`.
        //
        // > `fetch` won’t send cookies, unless you set the credentials init
        // > option.
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        //
        // > For maximum browser compatibility when it comes to sending &
        // > receiving cookies, always supply the `credentials: 'same-origin'`
        // > option instead of relying on the default.
        // https://github.com/github/fetch#caveats
        credentials: "same-origin",
        method: options.method || "GET",
        headers: Object.assign({}, options.headers, {
            "x-nextjs-data": "1"
        })
    }).then((response)=>{
        return !response.ok && attempts > 1 && response.status >= 500 ? fetchRetry(url, attempts - 1, options) : response;
    });
}
function handleSmoothScroll(fn) {
    const htmlElement = document.documentElement;
    const existing = htmlElement.style.scrollBehavior;
    htmlElement.style.scrollBehavior = "auto";
    // In Chrome-based browsers we need to force reflow before calling `scrollTo`.
    // Otherwise it will not pickup the change in scrollBehavior
    // More info here: https://github.com/vercel/next.js/issues/40719#issuecomment-1336248042
    htmlElement.getClientRects();
    fn();
    htmlElement.style.scrollBehavior = existing;
}
function tryToParseAsJSON(text) {
    try {
        return JSON.parse(text);
    } catch (error) {
        return null;
    }
}
function fetchNextData({ dataHref , inflightCache , isPrefetch , hasMiddleware , isServerRender , parseJSON , persistCache , isBackground , unstable_skipClientCache  }) {
    const { href: cacheKey  } = new URL(dataHref, window.location.href);
    var ref1;
    const getData = (params)=>{
        return fetchRetry(dataHref, isServerRender ? 3 : 1, {
            headers: Object.assign({}, isPrefetch ? {
                purpose: "prefetch"
            } : {}, isPrefetch && hasMiddleware ? {
                "x-middleware-prefetch": "1"
            } : {}),
            method: (ref1 = params == null ? void 0 : params.method) != null ? ref1 : "GET"
        }).then((response)=>{
            if (response.ok && (params == null ? void 0 : params.method) === "HEAD") {
                return {
                    dataHref,
                    response,
                    text: "",
                    json: {},
                    cacheKey
                };
            }
            return response.text().then((text)=>{
                if (!response.ok) {
                    /**
             * When the data response is a redirect because of a middleware
             * we do not consider it an error. The headers must bring the
             * mapped location.
             * TODO: Change the status code in the handler.
             */ if (hasMiddleware && [
                        301,
                        302,
                        307,
                        308
                    ].includes(response.status)) {
                        return {
                            dataHref,
                            response,
                            text,
                            json: {},
                            cacheKey
                        };
                    }
                    if (!hasMiddleware && response.status === 404) {
                        var ref;
                        if ((ref = tryToParseAsJSON(text)) == null ? void 0 : ref.notFound) {
                            return {
                                dataHref,
                                json: {
                                    notFound: SSG_DATA_NOT_FOUND
                                },
                                response,
                                text,
                                cacheKey
                            };
                        }
                    }
                    const error = new Error(`Failed to load static props`);
                    /**
             * We should only trigger a server-side transition if this was
             * caused on a client-side transition. Otherwise, we'd get into
             * an infinite loop.
             */ if (!isServerRender) {
                        (0, _routeLoader).markAssetError(error);
                    }
                    throw error;
                }
                return {
                    dataHref,
                    json: parseJSON ? tryToParseAsJSON(text) : null,
                    response,
                    text,
                    cacheKey
                };
            });
        }).then((data)=>{
            if (!persistCache || "production" !== "production" || data.response.headers.get("x-middleware-cache") === "no-cache") {
                delete inflightCache[cacheKey];
            }
            return data;
        }).catch((err)=>{
            if (!unstable_skipClientCache) {
                delete inflightCache[cacheKey];
            }
            if (err.message === "Failed to fetch") {
                (0, _routeLoader).markAssetError(err);
            }
            throw err;
        });
    };
    // when skipping client cache we wait to update
    // inflight cache until successful data response
    // this allows racing click event with fetching newer data
    // without blocking navigation when stale data is available
    if (unstable_skipClientCache && persistCache) {
        return getData({}).then((data)=>{
            inflightCache[cacheKey] = Promise.resolve(data);
            return data;
        });
    }
    if (inflightCache[cacheKey] !== undefined) {
        return inflightCache[cacheKey];
    }
    return inflightCache[cacheKey] = getData(isBackground ? {
        method: "HEAD"
    } : {});
}
function createKey() {
    return Math.random().toString(36).slice(2, 10);
}
function handleHardNavigation({ url , router  }) {
    // ensure we don't trigger a hard navigation to the same
    // URL as this can end up with an infinite refresh
    if (url === (0, _addBasePath).addBasePath((0, _addLocale).addLocale(router.asPath, router.locale))) {
        throw new Error(`Invariant: attempted to hard navigate to the same URL ${url} ${location.href}`);
    }
    window.location.href = url;
}
const getCancelledHandler = ({ route , router  })=>{
    let cancelled = false;
    const cancel = router.clc = ()=>{
        cancelled = true;
    };
    const handleCancelled = ()=>{
        if (cancelled) {
            const error = new Error(`Abort fetching component for route: "${route}"`);
            error.cancelled = true;
            throw error;
        }
        if (cancel === router.clc) {
            router.clc = null;
        }
    };
    return handleCancelled;
};
class Router {
    reload() {
        window.location.reload();
    }
    /**
   * Go back in history
   */ back() {
        window.history.back();
    }
    /**
   * Go forward in history
   */ forward() {
        window.history.forward();
    }
    /**
   * Performs a `pushState` with arguments
   * @param url of the route
   * @param as masks `url` for the browser
   * @param options object you can define `shallow` and other options
   */ push(url, as, options = {}) {
        if (false) {}
        ({ url , as  } = prepareUrlAs(this, url, as));
        return this.change("pushState", url, as, options);
    }
    /**
   * Performs a `replaceState` with arguments
   * @param url of the route
   * @param as masks `url` for the browser
   * @param options object you can define `shallow` and other options
   */ replace(url, as, options = {}) {
        ({ url , as  } = prepareUrlAs(this, url, as));
        return this.change("replaceState", url, as, options);
    }
    change(method, url, as, options, forcedScroll) {
        var _this = this;
        return _async_to_generator(function*() {
            if (!isLocalURL(url)) {
                handleHardNavigation({
                    url,
                    router: _this
                });
                return false;
            }
            // WARNING: `_h` is an internal option for handing Next.js client-side
            // hydration. Your app should _never_ use this property. It may change at
            // any time without notice.
            const isQueryUpdating = options._h === 1;
            let shouldResolveHref = isQueryUpdating || options._shouldResolveHref || (0, _parsePath).parsePath(url).pathname === (0, _parsePath).parsePath(as).pathname;
            const nextState = _extends({}, _this.state);
            // for static pages with query params in the URL we delay
            // marking the router ready until after the query is updated
            // or a navigation has occurred
            const readyStateChange = _this.isReady !== true;
            _this.isReady = true;
            const isSsr = _this.isSsr;
            if (!isQueryUpdating) {
                _this.isSsr = false;
            }
            // if a route transition is already in progress before
            // the query updating is triggered ignore query updating
            if (isQueryUpdating && _this.clc) {
                return false;
            }
            const prevLocale = nextState.locale;
            if (false) { var ref; }
            // marking route changes as a navigation start entry
            if (_utils.ST) {
                performance.mark("routeChange");
            }
            const { shallow =false , scroll =true  } = options;
            const routeProps = {
                shallow
            };
            if (_this._inFlightRoute && _this.clc) {
                if (!isSsr) {
                    Router.events.emit("routeChangeError", buildCancellationError(), _this._inFlightRoute, routeProps);
                }
                _this.clc();
                _this.clc = null;
            }
            as = (0, _addBasePath).addBasePath((0, _addLocale).addLocale((0, _hasBasePath).hasBasePath(as) ? (0, _removeBasePath).removeBasePath(as) : as, options.locale, _this.defaultLocale));
            const cleanedAs = (0, _removeLocale).removeLocale((0, _hasBasePath).hasBasePath(as) ? (0, _removeBasePath).removeBasePath(as) : as, nextState.locale);
            _this._inFlightRoute = as;
            const localeChange = prevLocale !== nextState.locale;
            // If the url change is only related to a hash change
            // We should not proceed. We should only change the state.
            if (!isQueryUpdating && _this.onlyAHashChange(cleanedAs) && !localeChange) {
                nextState.asPath = cleanedAs;
                Router.events.emit("hashChangeStart", as, routeProps);
                // TODO: do we need the resolved href when only a hash change?
                _this.changeState(method, url, as, _extends({}, options, {
                    scroll: false
                }));
                if (scroll) {
                    _this.scrollToHash(cleanedAs);
                }
                try {
                    yield _this.set(nextState, _this.components[nextState.route], null);
                } catch (err) {
                    if ((0, _isError).default(err) && err.cancelled) {
                        Router.events.emit("routeChangeError", err, cleanedAs, routeProps);
                    }
                    throw err;
                }
                Router.events.emit("hashChangeComplete", as, routeProps);
                return true;
            }
            let parsed = (0, _parseRelativeUrl).parseRelativeUrl(url);
            let { pathname , query  } = parsed;
            // The build manifest needs to be loaded before auto-static dynamic pages
            // get their query parameters to allow ensuring they can be parsed properly
            // when rewritten to
            let pages, rewrites;
            try {
                [pages, { __rewrites: rewrites  }] = yield Promise.all([
                    _this.pageLoader.getPageList(),
                    (0, _routeLoader).getClientBuildManifest(),
                    _this.pageLoader.getMiddleware()
                ]);
            } catch (err1) {
                // If we fail to resolve the page list or client-build manifest, we must
                // do a server-side transition:
                handleHardNavigation({
                    url: as,
                    router: _this
                });
                return false;
            }
            // If asked to change the current URL we should reload the current page
            // (not location.reload() but reload getInitialProps and other Next.js stuffs)
            // We also need to set the method = replaceState always
            // as this should not go into the history (That's how browsers work)
            // We should compare the new asPath to the current asPath, not the url
            if (!_this.urlIsNew(cleanedAs) && !localeChange) {
                method = "replaceState";
            }
            // we need to resolve the as value using rewrites for dynamic SSG
            // pages to allow building the data URL correctly
            let resolvedAs = as;
            // url and as should always be prefixed with basePath by this
            // point by either next/link or router.push/replace so strip the
            // basePath from the pathname to match the pages dir 1-to-1
            pathname = pathname ? (0, _removeTrailingSlash).removeTrailingSlash((0, _removeBasePath).removeBasePath(pathname)) : pathname;
            let route = (0, _removeTrailingSlash).removeTrailingSlash(pathname);
            const parsedAsPathname = as.startsWith("/") && (0, _parseRelativeUrl).parseRelativeUrl(as).pathname;
            const isMiddlewareRewrite = !!(parsedAsPathname && route !== parsedAsPathname && (!(0, _isDynamic).isDynamicRoute(route) || !(0, _routeMatcher).getRouteMatcher((0, _routeRegex).getRouteRegex(route))(parsedAsPathname)));
            // we don't attempt resolve asPath when we need to execute
            // middleware as the resolving will occur server-side
            const isMiddlewareMatch = !options.shallow && (yield matchesMiddleware({
                asPath: as,
                locale: nextState.locale,
                router: _this
            }));
            if (isQueryUpdating && isMiddlewareMatch) {
                shouldResolveHref = false;
            }
            if (shouldResolveHref && pathname !== "/_error") {
                options._shouldResolveHref = true;
                if (false) {} else {
                    parsed.pathname = resolveDynamicRoute(pathname, pages);
                    if (parsed.pathname !== pathname) {
                        pathname = parsed.pathname;
                        parsed.pathname = (0, _addBasePath).addBasePath(pathname);
                        if (!isMiddlewareMatch) {
                            url = (0, _formatUrl).formatWithValidation(parsed);
                        }
                    }
                }
            }
            if (!isLocalURL(as)) {
                if (false) {}
                handleHardNavigation({
                    url: as,
                    router: _this
                });
                return false;
            }
            resolvedAs = (0, _removeLocale).removeLocale((0, _removeBasePath).removeBasePath(resolvedAs), nextState.locale);
            route = (0, _removeTrailingSlash).removeTrailingSlash(pathname);
            let routeMatch = false;
            if ((0, _isDynamic).isDynamicRoute(route)) {
                const parsedAs1 = (0, _parseRelativeUrl).parseRelativeUrl(resolvedAs);
                const asPathname = parsedAs1.pathname;
                const routeRegex = (0, _routeRegex).getRouteRegex(route);
                routeMatch = (0, _routeMatcher).getRouteMatcher(routeRegex)(asPathname);
                const shouldInterpolate = route === asPathname;
                const interpolatedAs = shouldInterpolate ? interpolateAs(route, asPathname, query) : {};
                if (!routeMatch || shouldInterpolate && !interpolatedAs.result) {
                    const missingParams = Object.keys(routeRegex.groups).filter((param)=>!query[param] && !routeRegex.groups[param].optional);
                    if (missingParams.length > 0 && !isMiddlewareMatch) {
                        if (false) {}
                        throw new Error((shouldInterpolate ? `The provided \`href\` (${url}) value is missing query values (${missingParams.join(", ")}) to be interpolated properly. ` : `The provided \`as\` value (${asPathname}) is incompatible with the \`href\` value (${route}). `) + `Read more: https://nextjs.org/docs/messages/${shouldInterpolate ? "href-interpolation-failed" : "incompatible-href-as"}`);
                    }
                } else if (shouldInterpolate) {
                    as = (0, _formatUrl).formatWithValidation(Object.assign({}, parsedAs1, {
                        pathname: interpolatedAs.result,
                        query: omit(query, interpolatedAs.params)
                    }));
                } else {
                    // Merge params into `query`, overwriting any specified in search
                    Object.assign(query, routeMatch);
                }
            }
            if (!isQueryUpdating) {
                Router.events.emit("routeChangeStart", as, routeProps);
            }
            try {
                var ref2, ref3, ref4;
                let routeInfo = yield _this.getRouteInfo({
                    route,
                    pathname,
                    query,
                    as,
                    resolvedAs,
                    routeProps,
                    locale: nextState.locale,
                    isPreview: nextState.isPreview,
                    hasMiddleware: isMiddlewareMatch,
                    unstable_skipClientCache: options.unstable_skipClientCache,
                    isQueryUpdating: isQueryUpdating && !_this.isFallback,
                    isMiddlewareRewrite
                });
                if ("route" in routeInfo && isMiddlewareMatch) {
                    pathname = routeInfo.route || route;
                    route = pathname;
                    if (!routeProps.shallow) {
                        query = Object.assign({}, routeInfo.query || {}, query);
                    }
                    const cleanedParsedPathname = (0, _hasBasePath).hasBasePath(parsed.pathname) ? (0, _removeBasePath).removeBasePath(parsed.pathname) : parsed.pathname;
                    if (routeMatch && pathname !== cleanedParsedPathname) {
                        Object.keys(routeMatch).forEach((key)=>{
                            if (routeMatch && query[key] === routeMatch[key]) {
                                delete query[key];
                            }
                        });
                    }
                    if ((0, _isDynamic).isDynamicRoute(pathname)) {
                        const prefixedAs = !routeProps.shallow && routeInfo.resolvedAs ? routeInfo.resolvedAs : (0, _addBasePath).addBasePath((0, _addLocale).addLocale(new URL(as, location.href).pathname, nextState.locale), true);
                        let rewriteAs = prefixedAs;
                        if ((0, _hasBasePath).hasBasePath(rewriteAs)) {
                            rewriteAs = (0, _removeBasePath).removeBasePath(rewriteAs);
                        }
                        if (false) {}
                        const routeRegex1 = (0, _routeRegex).getRouteRegex(pathname);
                        const curRouteMatch = (0, _routeMatcher).getRouteMatcher(routeRegex1)(new URL(rewriteAs, location.href).pathname);
                        if (curRouteMatch) {
                            Object.assign(query, curRouteMatch);
                        }
                    }
                }
                // If the routeInfo brings a redirect we simply apply it.
                if ("type" in routeInfo) {
                    if (routeInfo.type === "redirect-internal") {
                        return _this.change(method, routeInfo.newUrl, routeInfo.newAs, options);
                    } else {
                        handleHardNavigation({
                            url: routeInfo.destination,
                            router: _this
                        });
                        return new Promise(()=>{});
                    }
                }
                const component = routeInfo.Component;
                if (component && component.unstable_scriptLoader) {
                    const scripts = [].concat(component.unstable_scriptLoader());
                    scripts.forEach((script)=>{
                        (0, _script).handleClientScriptLoad(script.props);
                    });
                }
                // handle redirect on client-transition
                if ((routeInfo.__N_SSG || routeInfo.__N_SSP) && routeInfo.props) {
                    if (routeInfo.props.pageProps && routeInfo.props.pageProps.__N_REDIRECT) {
                        // Use the destination from redirect without adding locale
                        options.locale = false;
                        const destination = routeInfo.props.pageProps.__N_REDIRECT;
                        // check if destination is internal (resolves to a page) and attempt
                        // client-navigation if it is falling back to hard navigation if
                        // it's not
                        if (destination.startsWith("/") && routeInfo.props.pageProps.__N_REDIRECT_BASE_PATH !== false) {
                            const parsedHref = (0, _parseRelativeUrl).parseRelativeUrl(destination);
                            parsedHref.pathname = resolveDynamicRoute(parsedHref.pathname, pages);
                            const { url: newUrl , as: newAs  } = prepareUrlAs(_this, destination, destination);
                            return _this.change(method, newUrl, newAs, options);
                        }
                        handleHardNavigation({
                            url: destination,
                            router: _this
                        });
                        return new Promise(()=>{});
                    }
                    nextState.isPreview = !!routeInfo.props.__N_PREVIEW;
                    // handle SSG data 404
                    if (routeInfo.props.notFound === SSG_DATA_NOT_FOUND) {
                        let notFoundRoute;
                        try {
                            yield _this.fetchComponent("/404");
                            notFoundRoute = "/404";
                        } catch (_) {
                            notFoundRoute = "/_error";
                        }
                        routeInfo = yield _this.getRouteInfo({
                            route: notFoundRoute,
                            pathname: notFoundRoute,
                            query,
                            as,
                            resolvedAs,
                            routeProps: {
                                shallow: false
                            },
                            locale: nextState.locale,
                            isPreview: nextState.isPreview
                        });
                        if ("type" in routeInfo) {
                            throw new Error(`Unexpected middleware effect on /404`);
                        }
                    }
                }
                if (isQueryUpdating && _this.pathname === "/_error" && ((ref2 = self.__NEXT_DATA__.props) == null ? void 0 : (ref3 = ref2.pageProps) == null ? void 0 : ref3.statusCode) === 500 && ((ref4 = routeInfo.props) == null ? void 0 : ref4.pageProps)) {
                    // ensure statusCode is still correct for static 500 page
                    // when updating query information
                    routeInfo.props.pageProps.statusCode = 500;
                }
                var _route;
                // shallow routing is only allowed for same page URL changes.
                const isValidShallowRoute = options.shallow && nextState.route === ((_route = routeInfo.route) != null ? _route : route);
                var _scroll;
                const shouldScroll = (_scroll = options.scroll) != null ? _scroll : !isQueryUpdating && !isValidShallowRoute;
                const resetScroll = shouldScroll ? {
                    x: 0,
                    y: 0
                } : null;
                const upcomingScrollState = forcedScroll != null ? forcedScroll : resetScroll;
                // the new state that the router gonna set
                const upcomingRouterState = _extends({}, nextState, {
                    route,
                    pathname,
                    query,
                    asPath: cleanedAs,
                    isFallback: false
                });
                // When the page being rendered is the 404 page, we should only update the
                // query parameters. Route changes here might add the basePath when it
                // wasn't originally present. This is also why this block is before the
                // below `changeState` call which updates the browser's history (changing
                // the URL).
                if (isQueryUpdating && (_this.pathname === "/404" || _this.pathname === "/_error")) {
                    var ref5, ref6, ref7;
                    routeInfo = yield _this.getRouteInfo({
                        route: _this.pathname,
                        pathname: _this.pathname,
                        query,
                        as,
                        resolvedAs,
                        routeProps: {
                            shallow: false
                        },
                        locale: nextState.locale,
                        isPreview: nextState.isPreview
                    });
                    if ("type" in routeInfo) {
                        throw new Error(`Unexpected middleware effect on ${_this.pathname}`);
                    }
                    if (_this.pathname === "/_error" && ((ref5 = self.__NEXT_DATA__.props) == null ? void 0 : (ref6 = ref5.pageProps) == null ? void 0 : ref6.statusCode) === 500 && ((ref7 = routeInfo.props) == null ? void 0 : ref7.pageProps)) {
                        // ensure statusCode is still correct for static 500 page
                        // when updating query information
                        routeInfo.props.pageProps.statusCode = 500;
                    }
                    try {
                        yield _this.set(upcomingRouterState, routeInfo, upcomingScrollState);
                    } catch (err2) {
                        if ((0, _isError).default(err2) && err2.cancelled) {
                            Router.events.emit("routeChangeError", err2, cleanedAs, routeProps);
                        }
                        throw err2;
                    }
                    return true;
                }
                Router.events.emit("beforeHistoryChange", as, routeProps);
                _this.changeState(method, url, as, options);
                // for query updates we can skip it if the state is unchanged and we don't
                // need to scroll
                // https://github.com/vercel/next.js/issues/37139
                const canSkipUpdating = isQueryUpdating && !upcomingScrollState && !readyStateChange && !localeChange && (0, _compareStates).compareRouterStates(upcomingRouterState, _this.state);
                if (!canSkipUpdating) {
                    try {
                        yield _this.set(upcomingRouterState, routeInfo, upcomingScrollState);
                    } catch (e) {
                        if (e.cancelled) routeInfo.error = routeInfo.error || e;
                        else throw e;
                    }
                    if (routeInfo.error) {
                        if (!isQueryUpdating) {
                            Router.events.emit("routeChangeError", routeInfo.error, cleanedAs, routeProps);
                        }
                        throw routeInfo.error;
                    }
                    if (false) {}
                    if (!isQueryUpdating) {
                        Router.events.emit("routeChangeComplete", as, routeProps);
                    }
                    // A hash mark # is the optional last part of a URL
                    const hashRegex = /#.+$/;
                    if (shouldScroll && hashRegex.test(as)) {
                        _this.scrollToHash(as);
                    }
                }
                return true;
            } catch (err11) {
                if ((0, _isError).default(err11) && err11.cancelled) {
                    return false;
                }
                throw err11;
            }
        })();
    }
    changeState(method, url, as, options = {}) {
        if (false) {}
        if (method !== "pushState" || (0, _utils).getURL() !== as) {
            this._shallow = options.shallow;
            window.history[method]({
                url,
                as,
                options,
                __N: true,
                key: this._key = method !== "pushState" ? this._key : createKey()
            }, // Passing the empty string here should be safe against future changes to the method.
            // https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
            "", as);
        }
    }
    handleRouteInfoError(err, pathname, query, as, routeProps, loadErrorFail) {
        var _this = this;
        return _async_to_generator(function*() {
            console.error(err);
            if (err.cancelled) {
                // bubble up cancellation errors
                throw err;
            }
            if ((0, _routeLoader).isAssetError(err) || loadErrorFail) {
                Router.events.emit("routeChangeError", err, as, routeProps);
                // If we can't load the page it could be one of following reasons
                //  1. Page doesn't exists
                //  2. Page does exist in a different zone
                //  3. Internal error while loading the page
                // So, doing a hard reload is the proper way to deal with this.
                handleHardNavigation({
                    url: as,
                    router: _this
                });
                // Changing the URL doesn't block executing the current code path.
                // So let's throw a cancellation error stop the routing logic.
                throw buildCancellationError();
            }
            try {
                let props;
                const { page: Component , styleSheets  } = yield _this.fetchComponent("/_error");
                const routeInfo = {
                    props,
                    Component,
                    styleSheets,
                    err,
                    error: err
                };
                if (!routeInfo.props) {
                    try {
                        routeInfo.props = yield _this.getInitialProps(Component, {
                            err,
                            pathname,
                            query
                        });
                    } catch (gipErr) {
                        console.error("Error in error page `getInitialProps`: ", gipErr);
                        routeInfo.props = {};
                    }
                }
                return routeInfo;
            } catch (routeInfoErr) {
                return _this.handleRouteInfoError((0, _isError).default(routeInfoErr) ? routeInfoErr : new Error(routeInfoErr + ""), pathname, query, as, routeProps, true);
            }
        })();
    }
    getRouteInfo({ route: requestedRoute , pathname , query , as , resolvedAs , routeProps , locale , hasMiddleware , isPreview , unstable_skipClientCache , isQueryUpdating , isMiddlewareRewrite  }) {
        var _this = this;
        return _async_to_generator(function*() {
            /**
     * This `route` binding can change if there's a rewrite
     * so we keep a reference to the original requested route
     * so we can store the cache for it and avoid re-requesting every time
     * for shallow routing purposes.
     */ let route = requestedRoute;
            try {
                var ref, ref8, ref9, ref10;
                const handleCancelled = getCancelledHandler({
                    route,
                    router: _this
                });
                let existingInfo = _this.components[route];
                if (routeProps.shallow && existingInfo && _this.route === route) {
                    return existingInfo;
                }
                if (hasMiddleware) {
                    existingInfo = undefined;
                }
                let cachedRouteInfo = existingInfo && !("initial" in existingInfo) && "production" !== "development" ? existingInfo : undefined;
                const isBackground = isQueryUpdating;
                const fetchNextDataParams = {
                    dataHref: _this.pageLoader.getDataHref({
                        href: (0, _formatUrl).formatWithValidation({
                            pathname,
                            query
                        }),
                        skipInterpolation: true,
                        asPath: resolvedAs,
                        locale
                    }),
                    hasMiddleware: true,
                    isServerRender: _this.isSsr,
                    parseJSON: true,
                    inflightCache: isBackground ? _this.sbc : _this.sdc,
                    persistCache: !isPreview,
                    isPrefetch: false,
                    unstable_skipClientCache,
                    isBackground
                };
                let data = isQueryUpdating && !isMiddlewareRewrite ? null : yield withMiddlewareEffects({
                    fetchData: ()=>fetchNextData(fetchNextDataParams),
                    asPath: resolvedAs,
                    locale: locale,
                    router: _this
                }).catch((err)=>{
                    // we don't hard error during query updating
                    // as it's un-necessary and doesn't need to be fatal
                    // unless it is a fallback route and the props can't
                    // be loaded
                    if (isQueryUpdating) {
                        return null;
                    }
                    throw err;
                });
                if (isQueryUpdating) {
                    if (!data) {
                        data = {
                            json: self.__NEXT_DATA__.props
                        };
                    } else {
                        data.json = self.__NEXT_DATA__.props;
                    }
                }
                handleCancelled();
                if ((data == null ? void 0 : (ref = data.effect) == null ? void 0 : ref.type) === "redirect-internal" || (data == null ? void 0 : (ref8 = data.effect) == null ? void 0 : ref8.type) === "redirect-external") {
                    return data.effect;
                }
                if ((data == null ? void 0 : (ref9 = data.effect) == null ? void 0 : ref9.type) === "rewrite") {
                    const resolvedRoute = (0, _removeTrailingSlash).removeTrailingSlash(data.effect.resolvedHref);
                    const pages = yield _this.pageLoader.getPageList();
                    // during query updating the page must match although during
                    // client-transition a redirect that doesn't match a page
                    // can be returned and this should trigger a hard navigation
                    // which is valid for incremental migration
                    if (!isQueryUpdating || pages.includes(resolvedRoute)) {
                        route = resolvedRoute;
                        pathname = data.effect.resolvedHref;
                        query = _extends({}, query, data.effect.parsedAs.query);
                        resolvedAs = (0, _removeBasePath).removeBasePath((0, _normalizeLocalePath).normalizeLocalePath(data.effect.parsedAs.pathname, _this.locales).pathname);
                        // Check again the cache with the new destination.
                        existingInfo = _this.components[route];
                        if (routeProps.shallow && existingInfo && _this.route === route && !hasMiddleware) {
                            // If we have a match with the current route due to rewrite,
                            // we can copy the existing information to the rewritten one.
                            // Then, we return the information along with the matched route.
                            return _extends({}, existingInfo, {
                                route
                            });
                        }
                    }
                }
                if ((0, _isApiRoute).isAPIRoute(route)) {
                    handleHardNavigation({
                        url: as,
                        router: _this
                    });
                    return new Promise(()=>{});
                }
                const routeInfo = cachedRouteInfo || (yield _this.fetchComponent(route).then((res)=>({
                        Component: res.page,
                        styleSheets: res.styleSheets,
                        __N_SSG: res.mod.__N_SSG,
                        __N_SSP: res.mod.__N_SSP
                    })));
                if (false) {}
                const wasBailedPrefetch = data == null ? void 0 : (ref10 = data.response) == null ? void 0 : ref10.headers.get("x-middleware-skip");
                const shouldFetchData = routeInfo.__N_SSG || routeInfo.__N_SSP;
                // For non-SSG prefetches that bailed before sending data
                // we clear the cache to fetch full response
                if (wasBailedPrefetch && (data == null ? void 0 : data.dataHref)) {
                    delete _this.sdc[data.dataHref];
                }
                const { props , cacheKey  } = yield _this._getData(_async_to_generator(function*() {
                    if (shouldFetchData) {
                        if ((data == null ? void 0 : data.json) && !wasBailedPrefetch) {
                            return {
                                cacheKey: data.cacheKey,
                                props: data.json
                            };
                        }
                        const dataHref = (data == null ? void 0 : data.dataHref) ? data.dataHref : _this.pageLoader.getDataHref({
                            href: (0, _formatUrl).formatWithValidation({
                                pathname,
                                query
                            }),
                            asPath: resolvedAs,
                            locale
                        });
                        const fetched = yield fetchNextData({
                            dataHref,
                            isServerRender: _this.isSsr,
                            parseJSON: true,
                            inflightCache: wasBailedPrefetch ? {} : _this.sdc,
                            persistCache: !isPreview,
                            isPrefetch: false,
                            unstable_skipClientCache
                        });
                        return {
                            cacheKey: fetched.cacheKey,
                            props: fetched.json || {}
                        };
                    }
                    return {
                        headers: {},
                        props: yield _this.getInitialProps(routeInfo.Component, {
                            pathname,
                            query,
                            asPath: as,
                            locale,
                            locales: _this.locales,
                            defaultLocale: _this.defaultLocale
                        })
                    };
                }));
                // Only bust the data cache for SSP routes although
                // middleware can skip cache per request with
                // x-middleware-cache: no-cache as well
                if (routeInfo.__N_SSP && fetchNextDataParams.dataHref && cacheKey) {
                    delete _this.sdc[cacheKey];
                }
                // we kick off a HEAD request in the background
                // when a non-prefetch request is made to signal revalidation
                if (!_this.isPreview && routeInfo.__N_SSG && "production" !== "development" && !isQueryUpdating) {
                    fetchNextData(Object.assign({}, fetchNextDataParams, {
                        isBackground: true,
                        persistCache: false,
                        inflightCache: _this.sbc
                    })).catch(()=>{});
                }
                props.pageProps = Object.assign({}, props.pageProps);
                routeInfo.props = props;
                routeInfo.route = route;
                routeInfo.query = query;
                routeInfo.resolvedAs = resolvedAs;
                _this.components[route] = routeInfo;
                return routeInfo;
            } catch (err) {
                return _this.handleRouteInfoError((0, _isError).getProperError(err), pathname, query, as, routeProps);
            }
        })();
    }
    set(state, data, resetScroll) {
        this.state = state;
        return this.sub(data, this.components["/_app"].Component, resetScroll);
    }
    /**
   * Callback to execute before replacing router state
   * @param cb callback to be executed
   */ beforePopState(cb) {
        this._bps = cb;
    }
    onlyAHashChange(as) {
        if (!this.asPath) return false;
        const [oldUrlNoHash, oldHash] = this.asPath.split("#");
        const [newUrlNoHash, newHash] = as.split("#");
        // Makes sure we scroll to the provided hash if the url/hash are the same
        if (newHash && oldUrlNoHash === newUrlNoHash && oldHash === newHash) {
            return true;
        }
        // If the urls are change, there's more than a hash change
        if (oldUrlNoHash !== newUrlNoHash) {
            return false;
        }
        // If the hash has changed, then it's a hash only change.
        // This check is necessary to handle both the enter and
        // leave hash === '' cases. The identity case falls through
        // and is treated as a next reload.
        return oldHash !== newHash;
    }
    scrollToHash(as) {
        const [, hash = ""] = as.split("#");
        // Scroll to top if the hash is just `#` with no value or `#top`
        // To mirror browsers
        if (hash === "" || hash === "top") {
            handleSmoothScroll(()=>window.scrollTo(0, 0));
            return;
        }
        // Decode hash to make non-latin anchor works.
        const rawHash = decodeURIComponent(hash);
        // First we check if the element by id is found
        const idEl = document.getElementById(rawHash);
        if (idEl) {
            handleSmoothScroll(()=>idEl.scrollIntoView());
            return;
        }
        // If there's no element with the id, we check the `name` property
        // To mirror browsers
        const nameEl = document.getElementsByName(rawHash)[0];
        if (nameEl) {
            handleSmoothScroll(()=>nameEl.scrollIntoView());
        }
    }
    urlIsNew(asPath) {
        return this.asPath !== asPath;
    }
    /**
   * Prefetch page code, you may wait for the data during page rendering.
   * This feature only works in production!
   * @param url the href of prefetched page
   * @param asPath the as path of the prefetched page
   */ prefetch(url, asPath = url, options = {}) {
        var _this = this;
        return _async_to_generator(function*() {
            // Prefetch is not supported in development mode because it would trigger on-demand-entries
            if (false) {}
            if (false) {}
            let parsed = (0, _parseRelativeUrl).parseRelativeUrl(url);
            let { pathname , query  } = parsed;
            const originalPathname = pathname;
            if (false) {}
            const pages = yield _this.pageLoader.getPageList();
            let resolvedAs = asPath;
            const locale = typeof options.locale !== "undefined" ? options.locale || undefined : _this.locale;
            const isMiddlewareMatch = yield matchesMiddleware({
                asPath: asPath,
                locale: locale,
                router: _this
            });
            if (false) {}
            parsed.pathname = resolveDynamicRoute(parsed.pathname, pages);
            if ((0, _isDynamic).isDynamicRoute(parsed.pathname)) {
                pathname = parsed.pathname;
                parsed.pathname = pathname;
                Object.assign(query, (0, _routeMatcher).getRouteMatcher((0, _routeRegex).getRouteRegex(parsed.pathname))((0, _parsePath).parsePath(asPath).pathname) || {});
                if (!isMiddlewareMatch) {
                    url = (0, _formatUrl).formatWithValidation(parsed);
                }
            }
            const data =  false ? 0 : yield withMiddlewareEffects({
                fetchData: ()=>fetchNextData({
                        dataHref: _this.pageLoader.getDataHref({
                            href: (0, _formatUrl).formatWithValidation({
                                pathname: originalPathname,
                                query
                            }),
                            skipInterpolation: true,
                            asPath: resolvedAs,
                            locale
                        }),
                        hasMiddleware: true,
                        isServerRender: _this.isSsr,
                        parseJSON: true,
                        inflightCache: _this.sdc,
                        persistCache: !_this.isPreview,
                        isPrefetch: true
                    }),
                asPath: asPath,
                locale: locale,
                router: _this
            });
            /**
     * If there was a rewrite we apply the effects of the rewrite on the
     * current parameters for the prefetch.
     */ if ((data == null ? void 0 : data.effect.type) === "rewrite") {
                parsed.pathname = data.effect.resolvedHref;
                pathname = data.effect.resolvedHref;
                query = _extends({}, query, data.effect.parsedAs.query);
                resolvedAs = data.effect.parsedAs.pathname;
                url = (0, _formatUrl).formatWithValidation(parsed);
            }
            /**
     * If there is a redirect to an external destination then we don't have
     * to prefetch content as it will be unused.
     */ if ((data == null ? void 0 : data.effect.type) === "redirect-external") {
                return;
            }
            const route = (0, _removeTrailingSlash).removeTrailingSlash(pathname);
            yield Promise.all([
                _this.pageLoader._isSsg(route).then((isSsg)=>{
                    return isSsg ? fetchNextData({
                        dataHref: (data == null ? void 0 : data.json) ? data == null ? void 0 : data.dataHref : _this.pageLoader.getDataHref({
                            href: url,
                            asPath: resolvedAs,
                            locale: locale
                        }),
                        isServerRender: false,
                        parseJSON: true,
                        inflightCache: _this.sdc,
                        persistCache: !_this.isPreview,
                        isPrefetch: true,
                        unstable_skipClientCache: options.unstable_skipClientCache || options.priority && !!true
                    }).then(()=>false) : false;
                }),
                _this.pageLoader[options.priority ? "loadPage" : "prefetch"](route)
            ]);
        })();
    }
    fetchComponent(route) {
        var _this = this;
        return _async_to_generator(function*() {
            const handleCancelled = getCancelledHandler({
                route,
                router: _this
            });
            try {
                const componentResult = yield _this.pageLoader.loadPage(route);
                handleCancelled();
                return componentResult;
            } catch (err) {
                handleCancelled();
                throw err;
            }
        })();
    }
    _getData(fn) {
        let cancelled = false;
        const cancel = ()=>{
            cancelled = true;
        };
        this.clc = cancel;
        return fn().then((data)=>{
            if (cancel === this.clc) {
                this.clc = null;
            }
            if (cancelled) {
                const err = new Error("Loading initial props cancelled");
                err.cancelled = true;
                throw err;
            }
            return data;
        });
    }
    _getFlightData(dataHref) {
        // Do not cache RSC flight response since it's not a static resource
        return fetchNextData({
            dataHref,
            isServerRender: true,
            parseJSON: false,
            inflightCache: this.sdc,
            persistCache: false,
            isPrefetch: false
        }).then(({ text  })=>({
                data: text
            }));
    }
    getInitialProps(Component, ctx) {
        const { Component: App  } = this.components["/_app"];
        const AppTree = this._wrapApp(App);
        ctx.AppTree = AppTree;
        return (0, _utils).loadGetInitialProps(App, {
            AppTree,
            Component,
            router: this,
            ctx
        });
    }
    get route() {
        return this.state.route;
    }
    get pathname() {
        return this.state.pathname;
    }
    get query() {
        return this.state.query;
    }
    get asPath() {
        return this.state.asPath;
    }
    get locale() {
        return this.state.locale;
    }
    get isFallback() {
        return this.state.isFallback;
    }
    get isPreview() {
        return this.state.isPreview;
    }
    constructor(pathname1, query1, as1, { initialProps , pageLoader , App , wrapApp , Component , err , subscription , isFallback , locale , locales , defaultLocale , domainLocales , isPreview  }){
        // Server Data Cache (full data requests)
        this.sdc = {};
        // Server Background Cache (HEAD requests)
        this.sbc = {};
        this.isFirstPopStateEvent = true;
        this._key = createKey();
        this.onPopState = (e)=>{
            const { isFirstPopStateEvent  } = this;
            this.isFirstPopStateEvent = false;
            const state = e.state;
            if (!state) {
                // We get state as undefined for two reasons.
                //  1. With older safari (< 8) and older chrome (< 34)
                //  2. When the URL changed with #
                //
                // In the both cases, we don't need to proceed and change the route.
                // (as it's already changed)
                // But we can simply replace the state with the new changes.
                // Actually, for (1) we don't need to nothing. But it's hard to detect that event.
                // So, doing the following for (1) does no harm.
                const { pathname , query  } = this;
                this.changeState("replaceState", (0, _formatUrl).formatWithValidation({
                    pathname: (0, _addBasePath).addBasePath(pathname),
                    query
                }), (0, _utils).getURL());
                return;
            }
            // __NA is used to identify if the history entry can be handled by the app-router.
            if (state.__NA) {
                window.location.reload();
                return;
            }
            if (!state.__N) {
                return;
            }
            // Safari fires popstateevent when reopening the browser.
            if (isFirstPopStateEvent && this.locale === state.options.locale && state.as === this.asPath) {
                return;
            }
            let forcedScroll;
            const { url , as , options , key  } = state;
            if (false) {}
            this._key = key;
            const { pathname: pathname1  } = (0, _parseRelativeUrl).parseRelativeUrl(url);
            // Make sure we don't re-render on initial load,
            // can be caused by navigating back from an external site
            if (this.isSsr && as === (0, _addBasePath).addBasePath(this.asPath) && pathname1 === (0, _addBasePath).addBasePath(this.pathname)) {
                return;
            }
            // If the downstream application returns falsy, return.
            // They will then be responsible for handling the event.
            if (this._bps && !this._bps(state)) {
                return;
            }
            this.change("replaceState", url, as, Object.assign({}, options, {
                shallow: options.shallow && this._shallow,
                locale: options.locale || this.defaultLocale,
                // @ts-ignore internal value not exposed on types
                _h: 0
            }), forcedScroll);
        };
        // represents the current component key
        const route = (0, _removeTrailingSlash).removeTrailingSlash(pathname1);
        // set up the component cache (by route keys)
        this.components = {};
        // We should not keep the cache, if there's an error
        // Otherwise, this cause issues when when going back and
        // come again to the errored page.
        if (pathname1 !== "/_error") {
            this.components[route] = {
                Component,
                initial: true,
                props: initialProps,
                err,
                __N_SSG: initialProps && initialProps.__N_SSG,
                __N_SSP: initialProps && initialProps.__N_SSP
            };
        }
        this.components["/_app"] = {
            Component: App,
            styleSheets: []
        };
        // Backwards compat for Router.router.events
        // TODO: Should be remove the following major version as it was never documented
        this.events = Router.events;
        this.pageLoader = pageLoader;
        // if auto prerendered and dynamic route wait to update asPath
        // until after mount to prevent hydration mismatch
        const autoExportDynamic = (0, _isDynamic).isDynamicRoute(pathname1) && self.__NEXT_DATA__.autoExport;
        this.basePath =  false || "";
        this.sub = subscription;
        this.clc = null;
        this._wrapApp = wrapApp;
        // make sure to ignore extra popState in safari on navigating
        // back from external site
        this.isSsr = true;
        this.isLocaleDomain = false;
        this.isReady = !!(self.__NEXT_DATA__.gssp || self.__NEXT_DATA__.gip || self.__NEXT_DATA__.appGip && !self.__NEXT_DATA__.gsp || !autoExportDynamic && !self.location.search && !false);
        if (false) {}
        this.state = {
            route,
            pathname: pathname1,
            query: query1,
            asPath: autoExportDynamic ? pathname1 : as1,
            isPreview: !!isPreview,
            locale:  false ? 0 : undefined,
            isFallback
        };
        this._initialMatchesMiddlewarePromise = Promise.resolve(false);
        if (false) {}
    }
}
Router.events = (0, _mitt).default();
exports["default"] = Router; //# sourceMappingURL=router.js.map


/***/ }),

/***/ 452:
/***/ (() => {



/***/ }),

/***/ 9423:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.isAPIRoute = isAPIRoute;
function isAPIRoute(value) {
    return value === "/api" || Boolean(value == null ? void 0 : value.startsWith("/api/"));
}

//# sourceMappingURL=is-api-route.js.map

/***/ }),

/***/ 5675:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* unused reexport */ __webpack_require__(9749)


/***/ }),

/***/ 1664:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(1551)


/***/ }),

/***/ 6171:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ZP": () => (/* binding */ Layout)
/* harmony export */ });
/* unused harmony exports Bleed, Callout, Collapse, Navbar, NotFoundPage, ServerSideErrorPage, SkipNavContent, SkipNavLink, Tab, Tabs, ThemeSwitch, useConfig */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var focus_visible__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2235);
/* harmony import */ var focus_visible__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(focus_visible__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8103);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(clsx__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7834);
/* harmony import */ var next_package_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7587);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1162);
/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(next_themes__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var git_url_parse__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(9164);
/* harmony import */ var git_url_parse__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(git_url_parse__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(3841);
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_popperjs_core__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var flexsearch__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(8395);
/* harmony import */ var flexsearch__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(flexsearch__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _headlessui_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(1185);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(6405);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var next_dist_client_add_base_path__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(3468);
/* harmony import */ var next_dist_client_add_base_path__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(next_dist_client_add_base_path__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(968);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var next_seo__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(6641);
/* harmony import */ var next_seo__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(next_seo__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var github_slugger__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(1578);
/* harmony import */ var scroll_into_view_if_needed__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(8751);
/* harmony import */ var match_sorter__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(5875);
/* harmony import */ var match_sorter__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(match_sorter__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var intersection_observer__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(4916);
/* harmony import */ var intersection_observer__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(intersection_observer__WEBPACK_IMPORTED_MODULE_19__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_mdx_js_react__WEBPACK_IMPORTED_MODULE_4__, _headlessui_react__WEBPACK_IMPORTED_MODULE_11__, github_slugger__WEBPACK_IMPORTED_MODULE_16__, scroll_into_view_if_needed__WEBPACK_IMPORTED_MODULE_17__]);
([_mdx_js_react__WEBPACK_IMPORTED_MODULE_4__, _headlessui_react__WEBPACK_IMPORTED_MODULE_11__, github_slugger__WEBPACK_IMPORTED_MODULE_16__, scroll_into_view_if_needed__WEBPACK_IMPORTED_MODULE_17__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.tsx






// ../nextra/dist/chunk-HIDP27A7.mjs
var __defProp2 = Object.defineProperty;
var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp2.call(b, prop))
      __defNormalProp2(a, prop, b[prop]);
  if (__getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(b)) {
      if (__propIsEnum2.call(b, prop))
        __defNormalProp2(a, prop, b[prop]);
    }
  return a;
};
var __objRest2 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp2.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum2.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __async2 = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// ../nextra/dist/hooks/index.mjs

function useMounted() {
  const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setMounted(true);
  }, []);
  return mounted;
}

// src/constants.tsx



// src/components/anchor.tsx




// src/contexts/active-anchor.tsx

var ActiveAnchorContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({});
var SetActiveAnchorContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)((v) => v);
var useActiveAnchor = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(ActiveAnchorContext);
var useSetActiveAnchor = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(SetActiveAnchorContext);
var ActiveAnchorProvider = ({
  children
}) => {
  const [activeAnchor, setActiveAnchor2] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ActiveAnchorContext.Provider, {
    value: activeAnchor
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(SetActiveAnchorContext.Provider, {
    value: setActiveAnchor2
  }, children));
};

// src/contexts/config.tsx



// src/contexts/menu.ts

var MenuContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({
  menu: false,
  setMenu: () => {
  }
});
var useMenu = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(MenuContext);
var MenuProvider = MenuContext.Provider;

// src/contexts/config.tsx
var ConfigContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(__spreadValues({
  title: "",
  frontMatter: {}
}, DEFAULT_THEME));
var useConfig = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(ConfigContext);
var ConfigProvider = ({
  children,
  value
}) => {
  const [menu, setMenu] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const { themeConfig, pageOpts } = value;
  const extendedConfig = __spreadValues(__spreadProps(__spreadValues(__spreadValues({}, DEFAULT_THEME), themeConfig), {
    flexsearch: pageOpts.flexsearch,
    newNextLinkBehavior: pageOpts.newNextLinkBehavior,
    title: pageOpts.title,
    frontMatter: pageOpts.frontMatter
  }), Object.fromEntries(
    DEEP_OBJECT_KEYS.map(
      (key) => typeof themeConfig[key] === "object" ? [
        key,
        __spreadValues(__spreadValues({}, DEFAULT_THEME[key]), themeConfig[key])
      ] : []
    )
  ));
  const { nextThemes } = extendedConfig;
  if (false) {}
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(next_themes__WEBPACK_IMPORTED_MODULE_7__.ThemeProvider, {
    attribute: "class",
    disableTransitionOnChange: true,
    defaultTheme: nextThemes.defaultTheme,
    storageKey: nextThemes.storageKey,
    forcedTheme: nextThemes.forcedTheme
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ConfigContext.Provider, {
    value: extendedConfig
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(MenuProvider, {
    value: { menu, setMenu }
  }, children)));
};

// src/contexts/details.ts

var DetailsContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)((v) => v);
var useDetails = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(DetailsContext);
var DetailsProvider = DetailsContext.Provider;

// src/components/anchor.tsx
var nextVersion = Number(next_package_json__WEBPACK_IMPORTED_MODULE_5__/* .version.split */ .i8.split(".")[0]);
var Anchor = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function(_a, forwardedRef) {
  var _b = _a, { href = "", children, newWindow } = _b, props = __objRest(_b, ["href", "children", "newWindow"]);
  const config = useConfig();
  if (newWindow) {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", __spreadValues({
      ref: forwardedRef,
      href,
      target: "_blank",
      rel: "noreferrer"
    }, props), children, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "nx-sr-only"
    }, " (opens in a new tab)"));
  }
  if (!href) {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", __spreadValues({
      ref: forwardedRef
    }, props), children);
  }
  if (nextVersion > 12 || config.newNextLinkBehavior) {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((next_link__WEBPACK_IMPORTED_MODULE_6___default()), __spreadValues({
      ref: forwardedRef,
      href
    }, props), children);
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((next_link__WEBPACK_IMPORTED_MODULE_6___default()), {
    href,
    passHref: true
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", __spreadValues({
    ref: forwardedRef
  }, props), children));
});

// src/components/banner.tsx


// ../nextra/dist/chunk-XXFR3PNG.mjs













function ArrowRightIcon(_a) {
  var _b = _a, {
    pathClassName
  } = _b, props = __objRest2(_b, [
    "pathClassName"
  ]);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", __spreadValues2({
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, props), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M9 5l7 7-7 7",
    className: pathClassName
  }));
}
function CheckIcon(props) {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", __spreadValues2({
    viewBox: "0 0 20 20",
    width: "1em",
    height: "1em",
    fill: "currentColor"
  }, props), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    fillRule: "evenodd",
    d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
    clipRule: "evenodd"
  }));
}
function CopyIcon(props) {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", __spreadValues2({
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    stroke: "currentColor"
  }, props), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("rect", {
    x: "9",
    y: "9",
    width: "13",
    height: "13",
    rx: "2",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
function DiscordIcon(props) {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", __spreadValues2({
    width: "24",
    height: "24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 5 30.67 23.25"
  }, props), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("title", null, "Discord"), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M26.0015 6.9529C24.0021 6.03845 21.8787 5.37198 19.6623 5C19.3833 5.48048 19.0733 6.13144 18.8563 6.64292C16.4989 6.30193 14.1585 6.30193 11.8336 6.64292C11.6166 6.13144 11.2911 5.48048 11.0276 5C8.79575 5.37198 6.67235 6.03845 4.6869 6.9529C0.672601 12.8736 -0.41235 18.6548 0.130124 24.3585C2.79599 26.2959 5.36889 27.4739 7.89682 28.2489C8.51679 27.4119 9.07477 26.5129 9.55525 25.5675C8.64079 25.2265 7.77283 24.808 6.93587 24.312C7.15286 24.1571 7.36986 23.9866 7.57135 23.8161C12.6241 26.1255 18.0969 26.1255 23.0876 23.8161C23.3046 23.9866 23.5061 24.1571 23.7231 24.312C22.8861 24.808 22.0182 25.2265 21.1037 25.5675C21.5842 26.5129 22.1422 27.4119 22.7621 28.2489C25.2885 27.4739 27.8769 26.2959 30.5288 24.3585C31.1952 17.7559 29.4733 12.0212 26.0015 6.9529ZM10.2527 20.8402C8.73376 20.8402 7.49382 19.4608 7.49382 17.7714C7.49382 16.082 8.70276 14.7025 10.2527 14.7025C11.7871 14.7025 13.0425 16.082 13.0115 17.7714C13.0115 19.4608 11.7871 20.8402 10.2527 20.8402ZM20.4373 20.8402C18.9183 20.8402 17.6768 19.4608 17.6768 17.7714C17.6768 16.082 18.8873 14.7025 20.4373 14.7025C21.9717 14.7025 23.2271 16.082 23.1961 17.7714C23.1961 19.4608 21.9872 20.8402 20.4373 20.8402Z"
  }));
}
function GitHubIcon(props) {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", __spreadValues2({
    width: "24",
    height: "24",
    fill: "currentColor",
    viewBox: "3 3 18 18"
  }, props), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("title", null, "GitHub"), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M12 3C7.0275 3 3 7.12937 3 12.2276C3 16.3109 5.57625 19.7597 9.15374 20.9824C9.60374 21.0631 9.77249 20.7863 9.77249 20.5441C9.77249 20.3249 9.76125 19.5982 9.76125 18.8254C7.5 19.2522 6.915 18.2602 6.735 17.7412C6.63375 17.4759 6.19499 16.6569 5.8125 16.4378C5.4975 16.2647 5.0475 15.838 5.80124 15.8264C6.51 15.8149 7.01625 16.4954 7.18499 16.7723C7.99499 18.1679 9.28875 17.7758 9.80625 17.5335C9.885 16.9337 10.1212 16.53 10.38 16.2993C8.3775 16.0687 6.285 15.2728 6.285 11.7432C6.285 10.7397 6.63375 9.9092 7.20749 9.26326C7.1175 9.03257 6.8025 8.08674 7.2975 6.81794C7.2975 6.81794 8.05125 6.57571 9.77249 7.76377C10.4925 7.55615 11.2575 7.45234 12.0225 7.45234C12.7875 7.45234 13.5525 7.55615 14.2725 7.76377C15.9937 6.56418 16.7475 6.81794 16.7475 6.81794C17.2424 8.08674 16.9275 9.03257 16.8375 9.26326C17.4113 9.9092 17.76 10.7281 17.76 11.7432C17.76 15.2843 15.6563 16.0687 13.6537 16.2993C13.98 16.5877 14.2613 17.1414 14.2613 18.0065C14.2613 19.2407 14.25 20.2326 14.25 20.5441C14.25 20.7863 14.4188 21.0746 14.8688 20.9824C16.6554 20.364 18.2079 19.1866 19.3078 17.6162C20.4077 16.0457 20.9995 14.1611 21 12.2276C21 7.12937 16.9725 3 12 3Z"
  }));
}
function GlobeIcon(props) {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", __spreadValues2({
    viewBox: "2 2 16 16",
    width: "12",
    height: "12",
    fill: "currentColor"
  }, props), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    fillRule: "evenodd",
    d: "M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z",
    clipRule: "evenodd"
  }));
}
function InformationCircleIcon(props) {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", __spreadValues2({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    width: "20",
    height: "20"
  }, props), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
  }));
}
function MenuIcon(props) {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", __spreadValues2({
    fill: "none",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, props), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("g", null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 6h16"
  })), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 12h16"
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("g", null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 18h16"
  })));
}
function MoonIcon(props) {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", __spreadValues2({
    fill: "none",
    viewBox: "2 2 20 20",
    width: "12",
    height: "12",
    stroke: "currentColor"
  }, props), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    fill: "currentColor",
    d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
  }));
}
function SpinnerIcon(props) {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", __spreadValues2({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    width: "24",
    height: "24"
  }, props), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("circle", {
    className: "nx-opacity-25",
    cx: "12",
    cy: "12",
    r: "10",
    stroke: "currentColor",
    strokeWidth: "4"
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    className: "nx-opacity-75",
    fill: "currentColor",
    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  }));
}
function SunIcon(props) {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", __spreadValues2({
    fill: "none",
    viewBox: "3 3 18 18",
    width: "12",
    height: "12",
    stroke: "currentColor"
  }, props), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    fill: "currentColor",
    d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
  }));
}
function WordWrapIcon(props) {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", __spreadValues2({
    viewBox: "0 0 24 24",
    width: "24",
    height: "24"
  }, props), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    fill: "currentColor",
    d: "M4 19h6v-2H4v2zM20 5H4v2h16V5zm-3 6H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3l3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z"
  }));
}
function XIcon(props) {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", __spreadValues2({
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "currentColor"
  }, props), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    fillRule: "evenodd",
    d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
    clipRule: "evenodd"
  }));
}

// src/components/banner.tsx


// src/utils/get-fs-route.ts
var template = "https://nextra.vercel.app";
var getFSRoute = (asPath, locale) => {
  const pathname = new URL(asPath, template).pathname;
  const cleanedPath = locale ? pathname.replace(new RegExp(`.${locale}(/|$)`), "$1") : pathname;
  return cleanedPath.replace(new RegExp("/index(/|$)"), "$1").split("#")[0] || "/";
};

// src/utils/get-git-edit-url.ts

var getGitEditUrl = (filePath) => {
  const config = useConfig();
  const repo = git_url_parse__WEBPACK_IMPORTED_MODULE_8___default()(config.docsRepositoryBase || "");
  if (!repo)
    throw new Error("Invalid `docsRepositoryBase` URL!");
  return `${repo.href}/${filePath}`;
};

// src/utils/get-git-issue-url.ts

var getGitIssueUrl = ({
  repository = "",
  title,
  labels
}) => {
  const repo = git_url_parse__WEBPACK_IMPORTED_MODULE_8___default()(repository);
  if (!repo)
    throw new Error("Invalid `docsRepositoryBase` URL!");
  if (repo.resource.includes("gitlab")) {
    return `${repo.protocol}://${repo.resource}/${repo.owner}/${repo.name}/-/issues/new?issue[title]=${encodeURIComponent(title)}`;
  } else if (repo.resource.includes("github")) {
    return `${repo.protocol}://${repo.resource}/${repo.owner}/${repo.name}/issues/new?title=${encodeURIComponent(title)}&labels=${labels || ""}`;
  } else {
    return "#";
  }
};

// src/utils/get-heading-text.ts
function getHeadingText(heading) {
  return heading.value || "";
}

// src/utils/normalize-pages.ts
function extendMeta(meta = {}, fallback) {
  if (typeof meta === "string") {
    meta = { title: meta };
  }
  const theme = Object.assign({}, fallback.theme, meta.theme);
  return Object.assign({}, fallback, meta, { theme });
}
function findFirstRoute(items) {
  for (const item of items) {
    if (item.route)
      return item.route;
    if (item.children) {
      const route = findFirstRoute(item.children);
      if (route)
        return route;
    }
  }
}
var CUSTOM_ERROR_PAGES = ["/404", "/500"];
function normalizePages({
  list,
  locale,
  defaultLocale,
  route,
  docsRoot = "",
  underCurrentDocsRoot = false,
  pageThemeContext = DEFAULT_PAGE_THEME
}) {
  let _meta;
  for (let item of list) {
    if (item.kind === "Meta") {
      if (item.locale === locale) {
        _meta = item.data;
        break;
      }
      if (!_meta) {
        _meta = item.data;
      }
    }
  }
  const meta = _meta || {};
  const metaKeys = Object.keys(meta);
  for (let key of metaKeys) {
    if (typeof meta[key] === "string") {
      meta[key] = {
        title: meta[key]
      };
    }
  }
  const directories = [];
  const flatDirectories = [];
  const docsDirectories = [];
  const flatDocsDirectories = [];
  const topLevelNavbarItems = [];
  let activeType;
  let activeIndex = 0;
  let activeThemeContext = pageThemeContext;
  let activePath = [];
  let metaKeyIndex = -1;
  const fallbackMeta = meta["*"] || {};
  delete fallbackMeta.title;
  delete fallbackMeta.href;
  const items = list.filter(
    (a) => a.kind !== "Meta" && !a.name.startsWith("_") && (a.locale === locale || a.locale === defaultLocale || !a.locale)
  ).sort((a, b) => {
    const indexA = metaKeys.indexOf(a.name);
    const indexB = metaKeys.indexOf(b.name);
    if (indexA === -1 && indexB === -1)
      return a.name < b.name ? -1 : 1;
    if (indexA === -1)
      return 1;
    if (indexB === -1)
      return -1;
    return indexA - indexB;
  }).flatMap((item) => {
    const items2 = [];
    const index = metaKeys.indexOf(item.name);
    let extendedItem;
    if (index !== -1) {
      for (let i = metaKeyIndex + 1; i < index; i++) {
        const key = metaKeys[i];
        if (key !== "*") {
          items2.push(__spreadValues({
            name: key,
            route: ""
          }, meta[key]));
        }
      }
      metaKeyIndex = index;
      extendedItem = __spreadValues(__spreadValues({}, meta[item.name]), item);
    }
    items2.push(extendedItem || item);
    return items2;
  });
  for (let i = metaKeyIndex + 1; i < metaKeys.length; i++) {
    const key = metaKeys[i];
    if (key !== "*") {
      items.push(__spreadValues({
        name: key,
        route: "#"
      }, meta[key]));
    }
  }
  for (let i = 0; i < items.length; i++) {
    const a = items[i];
    if (i + 1 < items.length && a.name === items[i + 1].name) {
      items[i + 1] = __spreadProps(__spreadValues({}, items[i + 1]), { withIndexPage: true });
      if (a.children && !items[i + 1].children) {
        items[i + 1].children = a.children;
      }
      continue;
    }
    const extendedMeta = extendMeta(meta[a.name], fallbackMeta);
    const { display, type = "doc" } = extendedMeta;
    const extendedPageThemeContext = __spreadValues(__spreadValues({}, pageThemeContext), extendedMeta.theme);
    const isCurrentDocsTree = route.startsWith(docsRoot);
    const normalizedChildren = a.children && normalizePages({
      list: a.children,
      locale,
      defaultLocale,
      route,
      docsRoot: type === "page" || type === "menu" ? a.route : docsRoot,
      underCurrentDocsRoot: underCurrentDocsRoot || isCurrentDocsTree,
      pageThemeContext: extendedPageThemeContext
    });
    const title = extendedMeta.title || type !== "separator" && a.name;
    const getItem = () => __spreadValues(__spreadValues(__spreadValues(__spreadProps(__spreadValues({}, a), {
      type
    }), title && { title }), display && { display }), normalizedChildren && { children: [] });
    const item = getItem();
    const docsItem = getItem();
    const pageItem = getItem();
    docsItem.isUnderCurrentDocsTree = isCurrentDocsTree;
    if (type === "separator") {
      item.isUnderCurrentDocsTree = isCurrentDocsTree;
    }
    if (a.route === route) {
      activePath = [item];
      activeType = type;
      activeThemeContext = __spreadValues(__spreadValues({}, activeThemeContext), extendedPageThemeContext);
      switch (type) {
        case "page":
        case "menu":
          activeIndex = topLevelNavbarItems.length;
          break;
        case "doc":
          activeIndex = flatDocsDirectories.length;
      }
    }
    if (display === "hidden" || CUSTOM_ERROR_PAGES.includes(a.route))
      continue;
    if (normalizedChildren) {
      if (normalizedChildren.activeIndex !== void 0 && normalizedChildren.activeType !== void 0) {
        activeThemeContext = normalizedChildren.activeThemeContext;
        activeType = normalizedChildren.activeType;
        activePath = [item, ...normalizedChildren.activePath];
        switch (activeType) {
          case "page":
          case "menu":
            activeIndex = topLevelNavbarItems.length + normalizedChildren.activeIndex;
            break;
          case "doc":
            activeIndex = flatDocsDirectories.length + normalizedChildren.activeIndex;
            break;
        }
        if (a.withIndexPage) {
          if (type === "doc") {
            activeIndex++;
          }
        }
      }
      switch (type) {
        case "page":
        case "menu":
          pageItem.children.push(...normalizedChildren.directories);
          docsDirectories.push(...normalizedChildren.docsDirectories);
          if (normalizedChildren.flatDirectories.length) {
            pageItem.firstChildRoute = findFirstRoute(
              normalizedChildren.flatDirectories
            );
            topLevelNavbarItems.push(pageItem);
          } else if (pageItem.withIndexPage) {
            topLevelNavbarItems.push(pageItem);
          }
          break;
        case "doc":
          if (Array.isArray(docsItem.children)) {
            docsItem.children.push(...normalizedChildren.docsDirectories);
          }
          if (item.withIndexPage) {
            if (display !== "children") {
              flatDocsDirectories.push(docsItem);
            }
          }
      }
      flatDirectories.push(...normalizedChildren.flatDirectories);
      flatDocsDirectories.push(...normalizedChildren.flatDocsDirectories);
      if (Array.isArray(item.children)) {
        item.children.push(...normalizedChildren.directories);
      }
    } else {
      flatDirectories.push(item);
      switch (type) {
        case "page":
        case "menu":
          topLevelNavbarItems.push(pageItem);
          break;
        case "doc":
          flatDocsDirectories.push(docsItem);
      }
    }
    if (type === "doc" && display === "children") {
      if (docsItem.children) {
        directories.push(...docsItem.children);
        docsDirectories.push(...docsItem.children);
      }
    } else {
      directories.push(item);
    }
    switch (type) {
      case "page":
      case "menu":
        docsDirectories.push(pageItem);
        break;
      case "doc":
        if (display !== "children") {
          docsDirectories.push(docsItem);
        }
        break;
      case "separator":
        docsDirectories.push(item);
    }
  }
  return {
    activeType,
    activeIndex,
    activeThemeContext,
    activePath,
    directories,
    flatDirectories,
    docsDirectories,
    flatDocsDirectories,
    topLevelNavbarItems
  };
}

// src/utils/render.tsx

function renderComponent(ComponentOrNode, props) {
  if (!ComponentOrNode)
    return null;
  if (typeof ComponentOrNode !== "function")
    return ComponentOrNode;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ComponentOrNode, __spreadValues({}, props));
}
function renderString(stringOrFunction, props = {}) {
  const result = typeof stringOrFunction === "function" ? stringOrFunction(props) : stringOrFunction;
  return result || "";
}

// src/utils/use-popper.ts


function usePopper(options) {
  const reference = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const popper = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const cleanupCallback = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(() => {
  });
  let instantiatePopper = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (!reference.current)
      return;
    if (!popper.current)
      return;
    if (cleanupCallback.current)
      cleanupCallback.current();
    cleanupCallback.current = (0,_popperjs_core__WEBPACK_IMPORTED_MODULE_9__.createPopper)(
      reference.current,
      popper.current,
      options
    ).destroy;
  }, [reference, popper, cleanupCallback, options]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(
    () => [
      (referenceDomNode) => {
        reference.current = referenceDomNode;
        instantiatePopper();
      },
      (popperDomNode) => {
        popper.current = popperDomNode;
        instantiatePopper();
      }
    ],
    [reference, popper, instantiatePopper]
  );
}

// src/components/banner.tsx
function Banner() {
  const { banner } = useConfig();
  if (!banner.text) {
    return null;
  }
  const hideBannerScript = `try{if(localStorage.getItem(${JSON.stringify(
    banner.key
  )})==='0'){document.body.classList.add('nextra-banner-hidden')}}catch(e){}`;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("script", {
    dangerouslySetInnerHTML: { __html: hideBannerScript }
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nx-relative nx-z-20 nx-flex nx-items-center nx-justify-center",
      "nx-bg-neutral-900 nx-text-sm nx-font-medium nx-text-slate-50",
      "nx-h-[var(--nextra-banner-height)] [body.nextra-banner-hidden_&]:nx-hidden",
      "dark:nx-bg-[linear-gradient(1deg,#383838,#212121)] dark:nx-text-white",
      "nx-py-1 nx-pl-[max(env(safe-area-inset-left),2.5rem)] nx-pr-[max(env(safe-area-inset-right),2.5rem)]"
    )
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "nx-max-w-[90rem] nx-truncate"
  }, renderComponent(banner.text)), banner.dismissible && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    type: "button",
    "aria-label": "Dismiss banner",
    className: "nx-absolute nx-opacity-80 hover:nx-opacity-100 ltr:nx-right-0 rtl:nx-left-0",
    onClick: () => {
      try {
        localStorage.setItem(banner.key, "0");
      } catch (e) {
      }
      document.body.classList.add("nextra-banner-hidden");
    }
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(XIcon, {
    className: "nx-mx-4 nx-h-4 nx-w-4"
  }))));
}

// src/components/bleed.tsx


function Bleed({
  full,
  children
}) {
  return /* @__PURE__ */ React16.createElement("div", {
    className: cn2(
      "nextra-bleed nx-relative -nx-mx-6 nx-mt-6 md:-nx-mx-8 2xl:-nx-mx-24",
      full && [
        "ltr:xl:nx-ml-[calc(50%-50vw+16rem)] ltr:xl:nx-mr-[calc(50%-50vw)]",
        "rtl:xl:nx-ml-[calc(50%-50vw)] rtl:xl:nx-mr-[calc(50%-50vw+16rem)]"
      ]
    )
  }, children);
}

// src/components/breadcrumb.tsx


function Breadcrumb({
  activePath
}) {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "nextra-breadcrumb nx-mt-2.5 nx-flex nx-items-center nx-gap-1 nx-overflow-hidden nx-text-sm nx-text-gray-500 contrast-more:nx-text-current"
  }, activePath.map((item, index) => {
    const isLink = !item.children || item.withIndexPage;
    const isActive = index === activePath.length - 1;
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), {
      key: item.route + item.name
    }, index > 0 && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ArrowRightIcon, {
      className: "nx-w-3.5 nx-shrink-0"
    }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
        "nx-whitespace-nowrap nx-transition-colors",
        isActive ? "nx-font-medium nx-text-gray-700 contrast-more:nx-font-bold contrast-more:nx-text-current dark:nx-text-gray-400 contrast-more:dark:nx-text-current" : [
          "nx-min-w-[24px] nx-overflow-hidden nx-text-ellipsis",
          isLink && "hover:nx-text-gray-900 dark:hover:nx-text-gray-200"
        ]
      ),
      title: item.title
    }, isLink && !isActive ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Anchor, {
      href: item.route
    }, item.title) : item.title));
  }));
}

// src/components/callout.tsx


var TypeToEmoji = {
  default: "\u{1F4A1}",
  error: "\u{1F6AB}",
  info: /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(InformationCircleIcon, {
    className: "nx-mt-1"
  }),
  warning: "\u26A0\uFE0F"
};
var classes = {
  default: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
    "nx-border-orange-100 nx-bg-orange-50 nx-text-orange-800 dark:nx-border-orange-400/30 dark:nx-bg-orange-400/20 dark:nx-text-orange-300"
  ),
  error: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
    "nx-border-red-200 nx-bg-red-100 nx-text-red-900 dark:nx-border-red-200/30 dark:nx-bg-red-900/30 dark:nx-text-red-200"
  ),
  info: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
    "nx-border-blue-200 nx-bg-blue-100 nx-text-blue-900 dark:nx-border-blue-200/30 dark:nx-bg-blue-900/30 dark:nx-text-blue-200"
  ),
  warning: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
    "nx-border-yellow-100 nx-bg-yellow-50 nx-text-yellow-900 dark:nx-border-yellow-200/30 dark:nx-bg-yellow-700/30 dark:nx-text-yellow-200"
  )
};
function Callout({
  children,
  type = "default",
  emoji = TypeToEmoji[type]
}) {
  return /* @__PURE__ */ React18.createElement("div", {
    className: cn4(
      "nextra-callout nx-mt-6 nx-flex nx-rounded-lg nx-border nx-py-2 ltr:nx-pr-4 rtl:nx-pl-4",
      "contrast-more:nx-border-current contrast-more:dark:nx-border-current",
      classes[type]
    )
  }, /* @__PURE__ */ React18.createElement("div", {
    className: "nx-select-none nx-text-xl ltr:nx-pl-3 ltr:nx-pr-2 rtl:nx-pr-3 rtl:nx-pl-2",
    style: {
      fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
    }
  }, emoji), /* @__PURE__ */ React18.createElement("div", {
    className: "nx-w-full nx-min-w-0 nx-leading-7"
  }, children));
}

// src/components/collapse.tsx


function Collapse({
  children,
  className,
  open
}) {
  const containerRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const innerRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const animationRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const initialRender = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(true);
  const initialState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(open);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (initialRender.current)
      return;
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    if (open) {
      const container = containerRef.current;
      const inner = innerRef.current;
      if (container && inner) {
        const contentHeight = innerRef.current.clientHeight;
        container.style.maxHeight = contentHeight + "px";
        container.classList.remove("nx-duration-500");
        container.classList.add("nx-duration-300");
        inner.style.opacity = "1";
        animationRef.current = setTimeout(() => {
          const container2 = containerRef.current;
          if (container2) {
            container2.style.removeProperty("max-height");
          }
        }, 300);
      }
    } else {
      const container = containerRef.current;
      const inner = innerRef.current;
      if (container && inner) {
        const contentHeight = innerRef.current.clientHeight;
        container.style.maxHeight = contentHeight + "px";
        container.classList.remove("nx-duration-300");
        container.classList.add("nx-duration-500");
        inner.style.opacity = "0";
        setTimeout(() => {
          const container2 = containerRef.current;
          if (container2) {
            container2.style.maxHeight = "0px";
          }
        }, 0);
      }
    }
  }, [open]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    initialRender.current = false;
  }, []);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    ref: containerRef,
    className: "nx-transform-gpu nx-overflow-hidden nx-transition-all nx-duration-300 nx-ease-in-out motion-reduce:nx-transition-none",
    style: {
      maxHeight: initialState.current ? void 0 : 0
    }
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    ref: innerRef,
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nx-transform-gpu nx-overflow-hidden nx-p-2 nx-transition-opacity nx-duration-500 nx-ease-in-out motion-reduce:nx-transition-none",
      className
    ),
    style: {
      opacity: initialState.current ? 1 : 0
    }
  }, children));
}

// src/components/flexsearch.tsx





// src/components/search.tsx




// src/components/input.tsx


var Input = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(
  (_a, forwardedRef) => {
    var _b = _a, { className, suffix } = _b, props = __objRest(_b, ["className", "suffix"]);
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "nx-relative nx-flex nx-items-center nx-text-gray-900 contrast-more:nx-text-gray-800 dark:nx-text-gray-300 contrast-more:dark:nx-text-gray-300"
    }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", __spreadValues({
      ref: forwardedRef,
      spellCheck: false,
      className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
        className,
        "nx-block nx-w-full nx-appearance-none nx-rounded-lg nx-px-3 nx-py-2 nx-transition-colors",
        "nx-text-base nx-leading-tight md:nx-text-sm",
        "nx-bg-black/[.05] dark:nx-bg-gray-50/10",
        "focus:nx-bg-white dark:focus:nx-bg-dark",
        "placeholder:nx-text-gray-500 dark:placeholder:nx-text-gray-400",
        "contrast-more:nx-border contrast-more:nx-border-current"
      )
    }, props)), suffix);
  }
);

// src/components/search.tsx

var INPUTS = ["input", "select", "button", "textarea"];
function Search({
  className,
  overlayClassName,
  value,
  onChange,
  onActive,
  loading,
  results
}) {
  const [show, setShow] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const config = useConfig();
  const [active, setActive] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const router = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
  const { setMenu } = useMenu();
  const input = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const ulRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setActive(0);
  }, [value]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    onActive && onActive(show);
  }, [show]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const down = (e) => {
      var _a;
      const tagName = (_a = document.activeElement) == null ? void 0 : _a.tagName.toLowerCase();
      if (!input.current || !tagName || INPUTS.includes(tagName))
        return;
      if (e.key === "/" || e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        input.current.focus();
      } else if (e.key === "Escape") {
        setShow(false);
        input.current.blur();
      }
    };
    window.addEventListener("keydown", down);
    return () => {
      window.removeEventListener("keydown", down);
    };
  }, []);
  const handleKeyDown = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(
    function(e) {
      var _a, _b, _c;
      switch (e.key) {
        case "ArrowDown": {
          if (active + 1 < results.length) {
            const el = (_a = ulRef.current) == null ? void 0 : _a.querySelector(
              `li:nth-of-type(${active + 2}) > a`
            );
            if (el) {
              e.preventDefault();
              handleActive({ currentTarget: el });
              el.focus();
            }
          }
          break;
        }
        case "ArrowUp": {
          if (active - 1 >= 0) {
            const el = (_b = ulRef.current) == null ? void 0 : _b.querySelector(
              `li:nth-of-type(${active}) > a`
            );
            if (el) {
              e.preventDefault();
              handleActive({ currentTarget: el });
              el.focus();
            }
          }
          break;
        }
        case "Enter": {
          const result = results[active];
          if (result) {
            router.push(result.route);
            finishSearch();
          }
          break;
        }
        case "Escape": {
          setShow(false);
          (_c = input.current) == null ? void 0 : _c.blur();
          break;
        }
      }
    },
    [active, results, router]
  );
  const finishSearch = () => {
    var _a;
    (_a = input.current) == null ? void 0 : _a.blur();
    onChange("");
    setShow(false);
    setMenu(false);
  };
  const mounted = useMounted();
  const renderList = show && Boolean(value);
  const icon = /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_11__.Transition, {
    show: mounted && (!show || Boolean(value)),
    as: (react__WEBPACK_IMPORTED_MODULE_0___default().Fragment),
    enter: "nx-transition-opacity",
    enterFrom: "nx-opacity-0",
    enterTo: "nx-opacity-100",
    leave: "nx-transition-opacity",
    leaveFrom: "nx-opacity-100",
    leaveTo: "nx-opacity-0"
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("kbd", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nx-absolute nx-my-1.5 nx-select-none ltr:nx-right-1.5 rtl:nx-left-1.5",
      "nx-h-5 nx-rounded nx-bg-white nx-px-1.5 nx-font-mono nx-text-[10px] nx-font-medium nx-text-gray-500",
      "nx-border dark:nx-border-gray-100/20 dark:nx-bg-dark/50",
      "contrast-more:nx-border-current contrast-more:nx-text-current contrast-more:dark:nx-border-current",
      "nx-items-center nx-gap-1 nx-transition-opacity",
      value ? "nx-z-20 nx-flex nx-cursor-pointer hover:nx-opacity-70" : "nx-pointer-events-none nx-hidden sm:nx-flex"
    ),
    title: value ? "Clear" : void 0,
    onClick: () => {
      onChange("");
    }
  }, value ? "ESC" : mounted && (navigator.userAgent.includes("Macintosh") ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "nx-text-xs"
  }, "\u2318"), "K") : "CTRL K")));
  const handleActive = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(
    (e) => {
      const { index } = e.currentTarget.dataset;
      setActive(Number(index));
    },
    []
  );
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()("nextra-search nx-relative md:nx-w-64", className)
  }, renderList && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "nx-fixed nx-inset-0 nx-z-10",
    onClick: () => setShow(false)
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Input, {
    ref: input,
    value,
    onChange: (e) => {
      const { value: value2 } = e.target;
      onChange(value2);
      setShow(Boolean(value2));
    },
    type: "search",
    placeholder: renderString(config.search.placeholder),
    onKeyDown: handleKeyDown,
    suffix: icon
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_11__.Transition, {
    show: renderList,
    as: _headlessui_react__WEBPACK_IMPORTED_MODULE_11__.Transition.Child,
    leave: "nx-transition-opacity nx-duration-100",
    leaveFrom: "nx-opacity-100",
    leaveTo: "nx-opacity-0"
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nextra-scrollbar",
      "nx-border nx-border-gray-200 nx-bg-white nx-text-gray-100 dark:nx-border-neutral-800 dark:nx-bg-neutral-900",
      "nx-absolute nx-top-full nx-z-20 nx-mt-2 nx-overflow-auto nx-overscroll-contain nx-rounded-xl nx-py-2.5 nx-shadow-xl",
      "nx-max-h-[min(calc(50vh-11rem-env(safe-area-inset-bottom)),400px)]",
      "md:nx-max-h-[min(calc(100vh-5rem-env(safe-area-inset-bottom)),400px)]",
      "nx-inset-x-0 ltr:md:nx-left-auto rtl:md:nx-right-auto",
      "contrast-more:nx-border contrast-more:nx-border-gray-900 contrast-more:dark:nx-border-gray-50",
      overlayClassName
    ),
    ref: ulRef,
    style: {
      transition: "max-height .2s ease"
    }
  }, loading ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "nx-flex nx-select-none nx-justify-center nx-gap-2 nx-p-8 nx-text-center nx-text-sm nx-text-gray-400"
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(SpinnerIcon, {
    className: "nx-h-5 nx-w-5 nx-animate-spin"
  }), renderString(config.search.loading)) : results.length > 0 ? results.map(({ route, prefix, children, id }, i) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    key: id
  }, prefix, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nx-mx-2.5 nx-break-words nx-rounded-md",
      "contrast-more:nx-border",
      i === active ? "nx-bg-primary-500/10 nx-text-primary-600 contrast-more:nx-border-primary-500" : "nx-text-gray-800 contrast-more:nx-border-transparent dark:nx-text-gray-300"
    )
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Anchor, {
    className: "nx-block nx-scroll-m-12 nx-px-2.5 nx-py-2",
    href: route,
    "data-index": i,
    onFocus: handleActive,
    onMouseMove: handleActive,
    onClick: finishSearch,
    onKeyDown: handleKeyDown
  }, children)))) : renderComponent(config.search.emptyResult))));
}

// src/components/highlight-matches.tsx

var HighlightMatches = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(function HighlightMatches2({
  value,
  match
}) {
  const splitText = value ? value.split("") : [];
  const escapedSearch = match.trim().replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
  const regexp = RegExp("(" + escapedSearch.replaceAll(" ", "|") + ")", "ig");
  let result;
  let id = 0;
  let index = 0;
  const res = [];
  if (value) {
    while ((result = regexp.exec(value)) !== null) {
      res.push(
        /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
          key: id++
        }, splitText.splice(0, result.index - index).join(""), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
          className: "nx-text-primary-600"
        }, splitText.splice(0, regexp.lastIndex - result.index).join("")))
      );
      index = regexp.lastIndex;
    }
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, res, splitText.join(""));
});

// src/components/flexsearch.tsx
var indexes = {};
var loadIndexesPromises = /* @__PURE__ */ new Map();
var loadIndexes = (basePath, locale) => {
  const key = basePath + "@" + locale;
  if (loadIndexesPromises.has(key)) {
    return loadIndexesPromises.get(key);
  }
  const promise = loadIndexesImpl(basePath, locale);
  loadIndexesPromises.set(key, promise);
  return promise;
};
var loadIndexesImpl = (basePath, locale) => __async(void 0, null, function* () {
  const response = yield fetch(
    `${basePath}/_next/static/chunks/nextra-data-${locale}.json`
  );
  const data = yield response.json();
  const pageIndex = new (flexsearch__WEBPACK_IMPORTED_MODULE_10___default().Document)({
    cache: 100,
    tokenize: "full",
    document: {
      id: "id",
      index: "content",
      store: ["title"]
    },
    context: {
      resolution: 9,
      depth: 2,
      bidirectional: true
    }
  });
  const sectionIndex = new (flexsearch__WEBPACK_IMPORTED_MODULE_10___default().Document)({
    cache: 100,
    tokenize: "full",
    document: {
      id: "id",
      index: "content",
      tag: "pageId",
      store: ["title", "content", "url", "display"]
    },
    context: {
      resolution: 9,
      depth: 2,
      bidirectional: true
    }
  });
  let pageId = 0;
  for (const route in data) {
    let pageContent = "";
    ++pageId;
    for (const heading in data[route].data) {
      const [hash, text] = heading.split("#");
      const url = route + (hash ? "#" + hash : "");
      const title = text || data[route].title;
      const content = data[route].data[heading] || "";
      const paragraphs = content.split("\n").filter(Boolean);
      sectionIndex.add(__spreadValues({
        id: url,
        url,
        title,
        pageId: `page_${pageId}`,
        content: title
      }, paragraphs[0] && { display: paragraphs[0] }));
      for (let i = 0; i < paragraphs.length; i++) {
        sectionIndex.add({
          id: `${url}_${i}`,
          url,
          title,
          pageId: `page_${pageId}`,
          content: paragraphs[i]
        });
      }
      pageContent += ` ${title} ${content}`;
    }
    pageIndex.add({
      id: pageId,
      title: data[route].title,
      content: pageContent
    });
  }
  indexes[locale] = [pageIndex, sectionIndex];
});
function Flexsearch({
  className
}) {
  const { locale = DEFAULT_LOCALE, basePath } = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [results, setResults] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [search, setSearch] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const doSearch = (search2) => {
    var _a, _b;
    if (!search2)
      return;
    const [pageIndex, sectionIndex] = indexes[locale];
    const pageResults = ((_a = pageIndex.search(search2, 5, {
      enrich: true,
      suggest: true
    })[0]) == null ? void 0 : _a.result) || [];
    const results2 = [];
    const pageTitleMatches = {};
    for (let i = 0; i < pageResults.length; i++) {
      const result = pageResults[i];
      pageTitleMatches[i] = 0;
      const sectionResults = ((_b = sectionIndex.search(search2, 5, {
        enrich: true,
        suggest: true,
        tag: "page_" + result.id
      })[0]) == null ? void 0 : _b.result) || [];
      let isFirstItemOfPage = true;
      const occurred = {};
      for (let j = 0; j < sectionResults.length; j++) {
        const { doc } = sectionResults[j];
        const isMatchingTitle = doc.display !== void 0;
        if (isMatchingTitle) {
          pageTitleMatches[i]++;
        }
        const { url, title } = doc;
        const content = doc.display || doc.content;
        if (occurred[url + "@" + content])
          continue;
        occurred[url + "@" + content] = true;
        results2.push({
          _page_rk: i,
          _section_rk: j,
          route: url,
          prefix: isFirstItemOfPage && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
            className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
              "nx-mx-2.5 nx-mb-2 nx-mt-6 nx-select-none nx-border-b nx-border-black/10 nx-px-2.5 nx-pb-1.5 nx-text-xs nx-font-semibold nx-uppercase nx-text-gray-500 first:nx-mt-0 dark:nx-border-white/20 dark:nx-text-gray-300",
              "contrast-more:nx-border-gray-600 contrast-more:nx-text-gray-900 contrast-more:dark:nx-border-gray-50 contrast-more:dark:nx-text-gray-50"
            )
          }, result.doc.title),
          children: /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
            className: "nx-text-base nx-font-semibold nx-leading-5"
          }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(HighlightMatches, {
            match: search2,
            value: title
          })), content && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
            className: "excerpt nx-mt-1 nx-text-sm nx-leading-[1.35rem] nx-text-gray-600 dark:nx-text-gray-400 contrast-more:dark:nx-text-gray-50"
          }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(HighlightMatches, {
            match: search2,
            value: content
          })))
        });
        isFirstItemOfPage = false;
      }
    }
    setResults(
      results2.sort((a, b) => {
        if (a._page_rk === b._page_rk) {
          return a._section_rk - b._section_rk;
        }
        if (pageTitleMatches[a._page_rk] !== pageTitleMatches[b._page_rk]) {
          return pageTitleMatches[b._page_rk] - pageTitleMatches[a._page_rk];
        }
        return a._page_rk - b._page_rk;
      }).map((res) => ({
        id: `${res._page_rk}_${res._section_rk}`,
        route: res.route,
        prefix: res.prefix,
        children: res.children
      }))
    );
  };
  const preload = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(
    (active) => __async(this, null, function* () {
      if (active && !indexes[locale]) {
        setLoading(true);
        yield loadIndexes(basePath, locale);
        setLoading(false);
      }
    }),
    [locale]
  );
  const handleChange = (value) => __async(this, null, function* () {
    setSearch(value);
    if (loading) {
      return;
    }
    if (!indexes[locale]) {
      setLoading(true);
      yield loadIndexes(basePath, locale);
      setLoading(false);
    }
    doSearch(value);
  });
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Search, {
    loading,
    value: search,
    onChange: handleChange,
    onActive: preload,
    className,
    overlayClassName: "nx-w-screen nx-min-h-[100px] nx-max-w-[min(calc(100vw-2rem),calc(100%+20rem))]",
    results
  });
}

// src/components/footer.tsx



// src/components/locale-switch.tsx



// src/components/select.tsx




function Select({
  options,
  selected,
  onChange,
  title,
  className
}) {
  const [trigger, container] = usePopper({
    strategy: "fixed",
    placement: "top-start",
    modifiers: [
      { name: "offset", options: { offset: [0, 10] } },
      {
        name: "sameWidth",
        enabled: true,
        fn({ state }) {
          state.styles.popper.minWidth = `${state.rects.reference.width}px`;
        },
        phase: "beforeWrite",
        requires: ["computeStyles"]
      }
    ]
  });
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_11__.Listbox, {
    value: selected,
    onChange
  }, ({ open }) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_11__.Listbox.Button, {
    ref: trigger,
    title,
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nx-h-7 nx-rounded-md nx-px-2 nx-text-left nx-text-xs nx-font-medium nx-text-gray-600 nx-transition-colors dark:nx-text-gray-400",
      open ? "nx-bg-gray-200 nx-text-gray-900 dark:nx-bg-primary-100/10 dark:nx-text-gray-50" : "hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50",
      className
    )
  }, selected.name, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Portal, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_11__.Transition, {
    ref: container,
    show: open,
    as: _headlessui_react__WEBPACK_IMPORTED_MODULE_11__.Listbox.Options,
    className: "nx-z-20 nx-max-h-64 nx-overflow-auto nx-rounded-md nx-border nx-border-black/5 nx-bg-white nx-py-1 nx-text-sm nx-shadow-lg dark:nx-border-white/10 dark:nx-bg-neutral-800",
    leave: "nx-transition-opacity",
    leaveFrom: "nx-opacity-100",
    leaveTo: "nx-opacity-0"
  }, options.map((option) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_11__.Listbox.Option, {
    key: option.key,
    value: option,
    className: ({ active }) => clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      active ? "nx-bg-primary-50 nx-text-primary-600 dark:nx-bg-primary-500/10" : "nx-text-gray-800 dark:nx-text-gray-100",
      "nx-relative nx-cursor-pointer nx-whitespace-nowrap nx-py-1.5",
      "nx-transition-colors ltr:nx-pl-3 ltr:nx-pr-9 rtl:nx-pr-3 rtl:nx-pl-9"
    )
  }, option.name, option.key === selected.key && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "nx-absolute nx-inset-y-0 nx-flex nx-items-center ltr:nx-right-3 rtl:nx-left-3"
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(CheckIcon, null))))))));
}
function Portal(props) {
  const mounted = useMounted();
  if (!mounted)
    return null;
  return (0,react_dom__WEBPACK_IMPORTED_MODULE_12__.createPortal)(props.children, document.body);
}

// src/components/locale-switch.tsx

function LocaleSwitch({
  options,
  lite,
  className
}) {
  const { locale, asPath } = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
  const selected = options.find((l) => locale === l.locale);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Select, {
    title: "Change language",
    className,
    onChange: (option) => {
      const date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3);
      document.cookie = `NEXT_LOCALE=${option.key}; expires=${date.toUTCString()}; path=/`;
      location.href = (0,next_dist_client_add_base_path__WEBPACK_IMPORTED_MODULE_13__.addBasePath)(asPath);
    },
    selected: {
      key: (selected == null ? void 0 : selected.locale) || "",
      name: /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "nx-flex nx-items-center nx-gap-2"
      }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(GlobeIcon, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: lite ? "nx-hidden" : ""
      }, selected == null ? void 0 : selected.text))
    },
    options: options.map((l) => ({
      key: l.locale,
      name: l.text
    }))
  });
}

// src/components/theme-switch.tsx


var OPTIONS = [
  { key: "light", name: "Light" },
  { key: "dark", name: "Dark" },
  { key: "system", name: "System" }
];
function ThemeSwitch({ lite }) {
  const { setTheme, resolvedTheme, theme = "" } = (0,next_themes__WEBPACK_IMPORTED_MODULE_7__.useTheme)();
  const mounted = useMounted();
  const IconToUse = mounted && resolvedTheme === "dark" ? MoonIcon : SunIcon;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "nx-relative"
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Select, {
    title: "Change theme",
    options: OPTIONS,
    onChange: (option) => {
      setTheme(option.key);
    },
    selected: {
      key: theme,
      name: /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "nx-flex nx-items-center nx-gap-2 nx-capitalize"
      }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(IconToUse, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: lite ? "md:nx-hidden" : ""
      }, mounted ? theme : "light"))
    }
  }));
}

// src/components/footer.tsx
function Footer({ menu }) {
  const config = useConfig();
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("footer", {
    className: "nx-bg-gray-100 nx-pb-[env(safe-area-inset-bottom)] dark:nx-bg-neutral-900"
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nx-mx-auto nx-flex nx-max-w-[90rem] nx-gap-2 nx-py-2 nx-px-4",
      menu ? "nx-flex" : "nx-hidden"
    )
  }, config.i18n.length > 0 && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LocaleSwitch, {
    options: config.i18n
  }), config.darkMode && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ThemeSwitch, null)), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("hr", {
    className: "dark:nx-border-neutral-800"
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nx-mx-auto nx-flex nx-max-w-[90rem] nx-justify-center nx-py-12 nx-text-gray-600 dark:nx-text-gray-400 md:nx-justify-start",
      "nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]"
    )
  }, renderComponent(config.footer.text)));
}

// src/components/head.tsx




function Head() {
  var _a;
  const config = useConfig();
  const { resolvedTheme } = (0,next_themes__WEBPACK_IMPORTED_MODULE_7__.useTheme)();
  const mounted = useMounted();
  const head = typeof config.head === "function" ? config.head({}) : config.head;
  const hue = config.primaryHue;
  const { dark: darkHue, light: lightHue } = typeof hue === "number" ? { dark: hue, light: hue } : hue;
  const frontMatter = config.frontMatter;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(next_seo__WEBPACK_IMPORTED_MODULE_15__.NextSeo, __spreadValues({
    title: config.title,
    description: frontMatter.description,
    canonical: frontMatter.canonical,
    openGraph: frontMatter.openGraph
  }, (_a = config.useNextSeoProps) == null ? void 0 : _a.call(config))), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((next_head__WEBPACK_IMPORTED_MODULE_14___default()), null, config.faviconGlyph ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("link", {
    rel: "icon",
    href: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='.9em' font-size='90' text-anchor='middle'>${config.faviconGlyph}</text><style>text{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";fill:black}@media(prefers-color-scheme:dark){text{fill:white}}</style></svg>`
  }) : null, mounted ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    name: "theme-color",
    content: resolvedTheme === "dark" ? "#111" : "#fff"
  }) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    name: "theme-color",
    content: "#ffffff",
    media: "(prefers-color-scheme: light)"
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    name: "theme-color",
    content: "#111111",
    media: "(prefers-color-scheme: dark)"
  })), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    name: "viewport",
    content: "width=device-width, initial-scale=1.0, viewport-fit=cover"
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("style", null, `
        :root {
          --nextra-primary-hue: ${lightHue}deg;
          --nextra-navbar-height: 4rem;
          --nextra-menu-height: 3.75rem;
          --nextra-banner-height: 2.5rem;
        }
        
        .dark {
          --nextra-primary-hue: ${darkHue}deg;
        }
      `), head));
}

// src/components/nav-links.tsx


var classes2 = {
  link: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
    "nx-flex nx-max-w-[50%] nx-items-center nx-gap-1 nx-py-4 nx-text-base nx-font-medium nx-text-gray-600 nx-transition-colors [word-break:break-word] hover:nx-text-primary-600 dark:nx-text-gray-300 md:nx-text-lg"
  ),
  icon: clsx__WEBPACK_IMPORTED_MODULE_3___default()("nx-inline nx-h-5 nx-shrink-0")
};
var NavLinks = ({
  flatDirectories,
  currentIndex
}) => {
  const config = useConfig();
  const nav = config.navigation;
  const navigation = typeof nav === "boolean" ? { prev: nav, next: nav } : nav;
  const prev = navigation.prev && flatDirectories[currentIndex - 1];
  const next2 = navigation.next && flatDirectories[currentIndex + 1];
  if (!prev && !next2)
    return null;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nx-mb-8 nx-flex nx-items-center nx-border-t nx-pt-8 dark:nx-border-neutral-800",
      "contrast-more:nx-border-neutral-400 dark:contrast-more:nx-border-neutral-400"
    )
  }, prev && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Anchor, {
    href: prev.route,
    title: prev.title,
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(classes2.link, "ltr:nx-pr-4 rtl:nx-pl-4")
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ArrowRightIcon, {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(classes2.icon, "ltr:nx-rotate-180")
  }), prev.title), next2 && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Anchor, {
    href: next2.route,
    title: next2.title,
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      classes2.link,
      "ltr:nx-ml-auto ltr:nx-pl-4 ltr:nx-text-right rtl:nx-mr-auto rtl:nx-pr-4 rtl:nx-text-left"
    )
  }, next2.title, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ArrowRightIcon, {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(classes2.icon, "rtl:nx-rotate-180")
  })));
};

// src/components/navbar.tsx




var classes3 = {
  link: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
    "nx-text-sm contrast-more:nx-text-gray-700 contrast-more:dark:nx-text-gray-100"
  ),
  active: clsx__WEBPACK_IMPORTED_MODULE_3___default()("nx-font-medium nx-subpixel-antialiased"),
  inactive: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
    "nx-text-gray-600 hover:nx-text-gray-800 dark:nx-text-gray-400 dark:hover:nx-text-gray-200"
  )
};
function NavbarMenu({
  className,
  menu,
  children
}) {
  const { items } = menu;
  const routes = Object.fromEntries(
    (menu.children || []).map((route) => [route.name, route])
  );
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "nx-relative nx-inline-block"
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_11__.Menu, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_11__.Menu.Button, {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      className,
      "-nx-ml-2 nx-hidden nx-items-center nx-whitespace-nowrap nx-rounded nx-p-2 md:nx-inline-flex",
      classes3.inactive
    )
  }, children), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_11__.Transition, {
    leave: "nx-transition-opacity",
    leaveFrom: "nx-opacity-100",
    leaveTo: "nx-opacity-0"
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_11__.Menu.Items, {
    className: "nx-absolute nx-right-0 nx-z-20 nx-mt-1 nx-max-h-64 nx-min-w-full nx-overflow-auto nx-rounded-md nx-border nx-border-black/5 nx-bg-white nx-py-1 nx-text-sm nx-shadow-lg dark:nx-border-white/10 dark:nx-bg-neutral-800",
    tabIndex: 0
  }, Object.entries(items || {}).map(([key, item]) => {
    var _a;
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_headlessui_react__WEBPACK_IMPORTED_MODULE_11__.Menu.Item, {
      key
    }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Anchor, {
      href: item.href || ((_a = routes[key]) == null ? void 0 : _a.route) || menu.route + "/" + key,
      className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
        "nx-relative nx-hidden nx-w-full nx-select-none nx-whitespace-nowrap nx-text-gray-600 hover:nx-text-gray-900 dark:nx-text-gray-400 dark:hover:nx-text-gray-100 md:nx-inline-block",
        "nx-py-1.5 nx-transition-colors ltr:nx-pl-3 ltr:nx-pr-9 rtl:nx-pr-3 rtl:nx-pl-9"
      ),
      newWindow: item.newWindow
    }, item.title || key));
  })))));
}
function Navbar({ flatDirectories, items }) {
  const config = useConfig();
  const { locale = DEFAULT_LOCALE, asPath } = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
  const activeRoute = getFSRoute(asPath, locale);
  const { menu, setMenu } = useMenu();
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "nextra-nav-container nx-sticky nx-top-0 nx-z-20 nx-w-full nx-bg-transparent"
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nextra-nav-container-blur",
      "nx-pointer-events-none nx-absolute nx-z-[-1] nx-h-full nx-w-full nx-bg-white dark:nx-bg-dark",
      "nx-shadow-[0_2px_4px_rgba(0,0,0,.02),0_1px_0_rgba(0,0,0,.06)] dark:nx-shadow-[0_-1px_0_rgba(255,255,255,.1)_inset]",
      "contrast-more:nx-shadow-[0_0_0_1px_#000] contrast-more:dark:nx-shadow-[0_0_0_1px_#fff]"
    )
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("nav", {
    className: "nx-mx-auto nx-flex nx-h-[var(--nextra-navbar-height)] nx-max-w-[90rem] nx-items-center nx-justify-end nx-gap-2 nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]"
  }, config.logoLink ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Anchor, {
    href: typeof config.logoLink === "string" ? config.logoLink : "/",
    className: "nx-flex nx-items-center hover:nx-opacity-75 ltr:nx-mr-auto rtl:nx-ml-auto"
  }, renderComponent(config.logo)) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "nx-flex nx-items-center ltr:nx-mr-auto rtl:nx-ml-auto"
  }, renderComponent(config.logo)), items.map((pageOrMenu) => {
    if (pageOrMenu.display === "hidden")
      return null;
    if (pageOrMenu.type === "menu") {
      const menu2 = pageOrMenu;
      const isActive2 = menu2.route === activeRoute || activeRoute.startsWith(menu2.route + "/");
      return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(NavbarMenu, {
        key: menu2.title,
        className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
          classes3.link,
          "nx-flex nx-gap-1",
          isActive2 ? classes3.active : classes3.inactive
        ),
        menu: menu2
      }, menu2.title, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ArrowRightIcon, {
        className: "nx-h-[18px] nx-min-w-[18px] nx-rounded-sm nx-p-0.5",
        pathClassName: "nx-origin-center nx-transition-transform nx-rotate-90"
      }));
    }
    const page = pageOrMenu;
    let href = page.href || page.route || "#";
    if (page.children) {
      href = (page.withIndexPage ? page.route : page.firstChildRoute) || href;
    }
    const isActive = page.route === activeRoute || activeRoute.startsWith(page.route + "/");
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Anchor, {
      href,
      key: href,
      className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
        classes3.link,
        "nx-relative -nx-ml-2 nx-hidden nx-whitespace-nowrap nx-p-2 md:nx-inline-block",
        !isActive || page.newWindow ? classes3.inactive : classes3.active
      ),
      newWindow: page.newWindow,
      "aria-current": !page.newWindow && isActive
    }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "nx-absolute nx-inset-x-0 nx-text-center"
    }, page.title), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "nx-invisible nx-font-medium"
    }, page.title));
  }), renderComponent(config.search.component, {
    directories: flatDirectories,
    className: "nx-hidden md:nx-inline-block mx-min-w-[200px]"
  }), config.project.link ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Anchor, {
    className: "nx-p-2 nx-text-current",
    href: config.project.link,
    newWindow: true
  }, renderComponent(config.project.icon)) : null, config.chat.link ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Anchor, {
    className: "nx-p-2 nx-text-current",
    href: config.chat.link,
    newWindow: true
  }, renderComponent(config.chat.icon)) : null, renderComponent(config.navbar.extraContent), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    type: "button",
    "aria-label": "Menu",
    className: "nextra-hamburger -nx-mr-2 nx-rounded nx-p-2 active:nx-bg-gray-400/20 md:nx-hidden",
    onClick: () => setMenu(!menu)
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(MenuIcon, {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()({ open: menu })
  }))));
}

// src/components/not-found.tsx


function NotFoundPage() {
  const config = useConfig();
  const mounted = useMounted();
  const { asPath } = useRouter5();
  const { content, labels } = config.notFound;
  if (!content) {
    return null;
  }
  return /* @__PURE__ */ React33.createElement("p", {
    className: "nx-text-center"
  }, /* @__PURE__ */ React33.createElement(Anchor, {
    href: getGitIssueUrl({
      repository: config.docsRepositoryBase,
      title: `Found broken \`${mounted ? asPath : ""}\` link. Please fix!`,
      labels
    }),
    newWindow: true,
    className: "nx-text-primary-600 nx-underline nx-decoration-from-font [text-underline-position:from-font]"
  }, renderComponent(content)));
}

// src/components/server-side-error.tsx


function ServerSideErrorPage() {
  const config = useConfig();
  const mounted = useMounted();
  const { asPath } = useRouter6();
  const { content, labels } = config.serverSideError;
  if (!content) {
    return null;
  }
  return /* @__PURE__ */ React34.createElement("p", {
    className: "nx-text-center"
  }, /* @__PURE__ */ React34.createElement(Anchor, {
    href: getGitIssueUrl({
      repository: config.docsRepositoryBase,
      title: `Got server-side error in \`${mounted ? asPath : ""}\` url. Please fix!`,
      labels
    }),
    newWindow: true,
    className: "nx-text-primary-600 nx-underline nx-decoration-from-font [text-underline-position:from-font]"
  }, renderComponent(content)));
}

// src/components/sidebar.tsx





var TreeState = /* @__PURE__ */ Object.create(null);
var FocusedItemContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);
var OnFocuseItemContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);
var Folder = (0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(FolderImpl);
var classes4 = {
  link: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
    "nx-flex nx-rounded nx-px-2 nx-py-1.5 nx-text-sm nx-transition-colors [word-break:break-word]",
    "nx-cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:nx-border"
  ),
  inactive: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
    "nx-text-gray-500 hover:nx-bg-gray-100 hover:nx-text-gray-900",
    "dark:nx-text-neutral-500 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50",
    "contrast-more:nx-text-gray-900 contrast-more:dark:nx-text-gray-50",
    "contrast-more:nx-border-transparent contrast-more:hover:nx-border-gray-900 contrast-more:dark:hover:nx-border-gray-50"
  ),
  active: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
    "nx-bg-primary-50 nx-font-bold nx-text-primary-600 dark:nx-bg-primary-500/10",
    "contrast-more:nx-border-primary-500 contrast-more:dark:nx-border-primary-500"
  ),
  list: clsx__WEBPACK_IMPORTED_MODULE_3___default()("nx-flex nx-flex-col nx-gap-1"),
  border: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
    "nx-relative before:nx-absolute before:nx-inset-y-1.5",
    'before:nx-w-px before:nx-bg-gray-200 before:nx-content-[""] dark:before:nx-bg-neutral-800',
    "ltr:nx-pl-3 ltr:before:nx-left-0 rtl:nx-pr-3 rtl:before:nx-right-0"
  )
};
function FolderImpl({
  item,
  anchors
}) {
  const { asPath, locale = DEFAULT_LOCALE } = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
  const routeOriginal = getFSRoute(asPath, locale);
  const [route] = routeOriginal.split("#");
  const active = [route, route + "/"].includes(item.route + "/");
  const activeRouteInside = active || route.startsWith(item.route + "/");
  const focusedRoute = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(FocusedItemContext);
  const focusedRouteInside = !!(focusedRoute == null ? void 0 : focusedRoute.startsWith(item.route + "/"));
  const folderLevel = (item.route.match(/\//g) || []).length;
  const { setMenu } = useMenu();
  const config = useConfig();
  const { theme } = item;
  const open = TreeState[item.route] !== void 0 ? TreeState[item.route] || focusedRouteInside : active || activeRouteInside || focusedRouteInside || (theme && "collapsed" in theme ? !theme.collapsed : folderLevel <= config.sidebar.defaultMenuCollapseLevel);
  const rerender = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({})[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (activeRouteInside || focusedRouteInside) {
      TreeState[item.route] = true;
    }
  }, [activeRouteInside || focusedRouteInside]);
  if (item.type === "menu") {
    const menu = item;
    const routes = Object.fromEntries(
      (menu.children || []).map((route2) => [route2.name, route2])
    );
    item.children = Object.entries(menu.items || {}).map(([key, item2]) => {
      const route2 = routes[key] || {
        name: key,
        locale: menu.locale,
        route: menu.route + "/" + key
      };
      return __spreadValues(__spreadValues({}, route2), item2);
    });
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()({ open, active })
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Anchor, {
    href: item.withIndexPage ? item.route : "",
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nx-items-center nx-justify-between nx-gap-2",
      classes4.link,
      active ? classes4.active : classes4.inactive
    ),
    onClick: (e) => {
      const clickedToggleIcon = ["svg", "path"].includes(
        e.target.tagName.toLowerCase()
      );
      if (clickedToggleIcon) {
        e.preventDefault();
      }
      if (item.withIndexPage) {
        if (active || clickedToggleIcon) {
          TreeState[item.route] = !open;
        } else {
          TreeState[item.route] = true;
          setMenu(false);
        }
        rerender({});
        return;
      }
      if (active)
        return;
      TreeState[item.route] = !open;
      rerender({});
    }
  }, renderComponent(config.sidebar.titleComponent, {
    title: item.title,
    type: item.type
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ArrowRightIcon, {
    className: "nx-h-[18px] nx-min-w-[18px] nx-rounded-sm nx-p-0.5 hover:nx-bg-gray-800/5 dark:hover:nx-bg-gray-100/5",
    pathClassName: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nx-origin-center nx-transition-transform rtl:-nx-rotate-180",
      open && "ltr:nx-rotate-90 rtl:nx-rotate-[-270deg]"
    )
  })), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Collapse, {
    className: "ltr:nx-pr-0 rtl:nx-pl-0",
    open
  }, Array.isArray(item.children) ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Menu2, {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(classes4.border, "ltr:nx-ml-1 rtl:nx-mr-1"),
    directories: item.children,
    base: item.route,
    anchors
  }) : null));
}
function Separator({ title }) {
  const config = useConfig();
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "[word-break:break-word]",
      title ? "nx-mt-5 nx-mb-2 nx-px-2 nx-py-1.5 nx-text-sm nx-font-semibold nx-text-gray-900 first:nx-mt-0 dark:nx-text-gray-100" : "nx-my-4"
    )
  }, title ? renderComponent(config.sidebar.titleComponent, {
    title,
    type: "separator"
  }) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("hr", {
    className: "nx-mx-2 nx-border-t nx-border-gray-200 dark:nx-border-primary-100/10"
  }));
}
function File({
  item,
  anchors
}) {
  const { asPath, locale = DEFAULT_LOCALE } = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
  const route = getFSRoute(asPath, locale);
  const onFocus = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(OnFocuseItemContext);
  const active = item.route && [route, route + "/"].includes(item.route + "/");
  const slugger = new github_slugger__WEBPACK_IMPORTED_MODULE_16__["default"]();
  const activeAnchor = useActiveAnchor();
  const { setMenu } = useMenu();
  const config = useConfig();
  if (item.type === "separator") {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Separator, {
      title: item.title
    });
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(classes4.list, { active })
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Anchor, {
    href: item.href || item.route,
    newWindow: item.newWindow,
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(classes4.link, active ? classes4.active : classes4.inactive),
    onClick: () => {
      setMenu(false);
    },
    onFocus: () => {
      onFocus == null ? void 0 : onFocus(item.route);
    },
    onBlur: () => {
      onFocus == null ? void 0 : onFocus(null);
    }
  }, renderComponent(config.sidebar.titleComponent, {
    title: item.title,
    type: item.type
  })), active && anchors.length > 0 && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      classes4.list,
      classes4.border,
      "ltr:nx-ml-3 rtl:nx-mr-3"
    )
  }, anchors.map((text) => {
    var _a;
    const slug = slugger.slug(text);
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      key: slug
    }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: `#${slug}`,
      className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
        classes4.link,
        'nx-flex nx-gap-2 before:nx-opacity-25 before:nx-content-["#"]',
        ((_a = activeAnchor[slug]) == null ? void 0 : _a.isActive) ? classes4.active : classes4.inactive
      ),
      onClick: () => {
        setMenu(false);
      }
    }, text));
  })));
}
function Menu2({
  directories,
  anchors,
  className,
  onlyCurrentDocs
}) {
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(classes4.list, className)
  }, directories.map(
    (item) => !onlyCurrentDocs || item.isUnderCurrentDocsTree ? item.type === "menu" || item.children && (item.children.length || !item.withIndexPage) ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Folder, {
      key: item.name,
      item,
      anchors
    }) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(File, {
      key: item.name,
      item,
      anchors
    }) : null
  ));
}
var emptyHeading = [];
function Sidebar({
  docsDirectories,
  flatDirectories,
  fullDirectories,
  asPopover = false,
  headings = emptyHeading,
  includePlaceholder
}) {
  const config = useConfig();
  const { menu, setMenu } = useMenu();
  const [focused, setFocused] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const anchors = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(
    () => headings.filter((v) => v.children && v.depth === 2 && v.type === "heading").map(getHeadingText).filter(Boolean),
    [headings]
  );
  const sidebarRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const containerRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (menu) {
      document.body.classList.add("nx-overflow-hidden", "md:nx-overflow-auto");
    } else {
      document.body.classList.remove(
        "nx-overflow-hidden",
        "md:nx-overflow-auto"
      );
    }
  }, [menu]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    var _a;
    const activeElement = (_a = sidebarRef.current) == null ? void 0 : _a.querySelector("li.active");
    if (activeElement && (window.innerWidth > 767 || menu)) {
      const scroll = () => {
        (0,scroll_into_view_if_needed__WEBPACK_IMPORTED_MODULE_17__["default"])(activeElement, {
          block: "center",
          inline: "center",
          scrollMode: "always",
          boundary: containerRef.current
        });
      };
      if (menu) {
        setTimeout(scroll, 300);
      } else {
        scroll();
      }
    }
  }, [menu]);
  const hasMenu = config.i18n.length > 0 || config.darkMode;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, includePlaceholder && asPopover ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "nx-hidden nx-h-0 nx-w-64 nx-shrink-0 xl:nx-block"
  }) : null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "[transition:background-color_1.5s_ease] motion-reduce:nx-transition-none",
      menu ? "nx-fixed nx-inset-0 nx-z-10 nx-bg-black/80 dark:nx-bg-black/60" : "nx-bg-transparent"
    ),
    onClick: () => setMenu(false)
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("aside", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nextra-sidebar-container nx-flex nx-flex-col",
      "md:nx-top-16 md:nx-w-64 md:nx-shrink-0 md:nx-transform-none",
      asPopover ? "md:nx-hidden" : "md:nx-sticky md:nx-self-start",
      menu ? "[transform:translate3d(0,0,0)]" : "[transform:translate3d(0,-100%,0)]"
    ),
    ref: containerRef
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "nx-px-4 nx-pt-4 md:nx-hidden"
  }, renderComponent(config.search.component, {
    directories: flatDirectories
  })), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(FocusedItemContext.Provider, {
    value: focused
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(OnFocuseItemContext.Provider, {
    value: (item) => {
      setFocused(item);
    }
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nextra-scrollbar nx-overflow-y-auto nx-p-4",
      "nx-grow md:nx-h-[calc(100vh-var(--nextra-navbar-height)-3.75rem)]"
    ),
    ref: sidebarRef
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Menu2, {
    className: "nx-hidden md:nx-flex",
    directories: docsDirectories,
    anchors: config.toc.float ? [] : anchors,
    onlyCurrentDocs: true
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Menu2, {
    className: "md:nx-hidden",
    directories: fullDirectories,
    anchors
  })))), hasMenu && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nx-relative nx-z-[1]",
      "nx-mx-4 nx-border-t nx-py-4 nx-shadow-[0_-12px_16px_#fff]",
      "nx-flex nx-items-center nx-gap-2",
      "dark:nx-border-neutral-800 dark:nx-shadow-[0_-12px_16px_#111]",
      "contrast-more:nx-border-neutral-400 contrast-more:nx-shadow-none contrast-more:dark:nx-shadow-none"
    )
  }, config.i18n.length > 0 && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LocaleSwitch, {
    options: config.i18n,
    className: "nx-grow"
  }), config.darkMode && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ThemeSwitch, {
    lite: config.i18n.length > 0
  }))));
}

// src/components/skip-nav.tsx


var DEFAULT_ID = "reach-skip-nav";
var DEFAULT_LABEL = "Skip to content";
var SkipNavLink = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(
  function(_a, forwardedRef) {
    var _b = _a, {
      className: providedClassName,
      id,
      label = DEFAULT_LABEL,
      styled
    } = _b, props = __objRest(_b, [
      "className",
      "id",
      "label",
      "styled"
    ]);
    const className = providedClassName !== void 0 ? providedClassName : styled ? clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nx-sr-only",
      "focus:nx-not-sr-only focus:nx-fixed focus:nx-z-50 focus:nx-m-3 focus:nx-ml-4 focus:nx-h-[calc(var(--nextra-navbar-height)-1.5rem)] focus:nx-rounded-lg focus:nx-border focus:nx-px-3 focus:nx-py-2 focus:nx-align-middle focus:nx-text-sm focus:nx-font-bold",
      "focus:nx-text-gray-900 focus:dark:nx-text-gray-100",
      "focus:nx-bg-white focus:dark:nx-bg-neutral-900",
      "focus:nx-border-neutral-400 focus:dark:nx-border-neutral-800"
    ) : "";
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", __spreadProps(__spreadValues({}, props), {
      ref: forwardedRef,
      href: `#${id || DEFAULT_ID}`,
      className,
      "data-reach-skip-link": ""
    }), label);
  }
);
var SkipNavContent = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(
  function(_a, forwardedRef) {
    var _b = _a, { id } = _b, props = __objRest(_b, ["id"]);
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", __spreadProps(__spreadValues({}, props), {
      ref: forwardedRef,
      id: id || DEFAULT_ID
    }));
  }
);

// src/components/tabs.tsx



function isTabItem(item) {
  if (item && typeof item === "object" && "label" in item)
    return true;
  return false;
}
var renderTab = (item) => {
  if (isTabItem(item)) {
    return item.label;
  }
  return item;
};
function Tabs({
  items,
  selectedIndex,
  defaultIndex,
  onChange,
  children
}) {
  return /* @__PURE__ */ React37.createElement(HeadlessTab.Group, {
    selectedIndex,
    defaultIndex,
    onChange
  }, /* @__PURE__ */ React37.createElement("div", {
    className: "no-scrollbar -nx-m-2 nx-overflow-x-auto nx-overflow-y-hidden nx-overscroll-x-contain nx-p-2"
  }, /* @__PURE__ */ React37.createElement(HeadlessTab.List, {
    className: "nx-mt-4 nx-flex nx-w-max nx-min-w-full nx-border-b nx-border-gray-200 nx-pb-px dark:nx-border-neutral-800"
  }, items.map((item, index) => {
    const disabled = !!(item && typeof item === "object" && "disabled" in item && item.disabled);
    return /* @__PURE__ */ React37.createElement(HeadlessTab, {
      key: index,
      disabled,
      className: ({ selected }) => cn15(
        "nx-mr-2 nx-rounded-t nx-p-2 nx-font-medium nx-leading-5 nx-transition-colors",
        "-nx-mb-0.5 nx-select-none nx-border-b-2",
        selected ? "nx-border-primary-500 nx-text-primary-600" : "nx-border-transparent nx-text-gray-600 hover:nx-border-gray-200 hover:nx-text-black dark:nx-text-gray-200 dark:hover:nx-border-neutral-800 dark:hover:nx-text-white",
        disabled && "nx-pointer-events-none nx-text-gray-400 dark:nx-text-neutral-600"
      )
    }, renderTab(item));
  }))), /* @__PURE__ */ React37.createElement(HeadlessTab.Panels, null, children));
}
function Tab(_a) {
  var _b = _a, {
    children
  } = _b, props = __objRest(_b, [
    "children"
  ]);
  return /* @__PURE__ */ React37.createElement(HeadlessTab.Panel, __spreadProps(__spreadValues({}, props), {
    className: "nx-rounded nx-pt-6"
  }), children);
}

// src/components/toc.tsx




function TOC({ headings, filePath }) {
  var _a;
  const slugger = new github_slugger__WEBPACK_IMPORTED_MODULE_16__["default"]();
  const activeAnchor = useActiveAnchor();
  const config = useConfig();
  const tocRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const items = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(
    () => headings.filter((heading) => heading.type === "heading" && heading.depth > 1).map((heading) => {
      const text = getHeadingText(heading);
      return {
        text,
        slug: slugger.slug(text),
        depth: heading.depth
      };
    }),
    [headings]
  );
  const hasHeadings = items.length > 0;
  const hasMetaInfo = Boolean(
    config.feedback.content || config.editLink.component || config.toc.extraContent
  );
  const activeSlug = (_a = Object.entries(activeAnchor).find(
    ([, { isActive }]) => isActive
  )) == null ? void 0 : _a[0];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    var _a2;
    if (!activeSlug)
      return;
    const anchor = (_a2 = tocRef.current) == null ? void 0 : _a2.querySelector(
      `li > a[href="#${activeSlug}"]`
    );
    if (anchor) {
      (0,scroll_into_view_if_needed__WEBPACK_IMPORTED_MODULE_17__["default"])(anchor, {
        behavior: "smooth",
        block: "center",
        inline: "center",
        scrollMode: "always",
        boundary: tocRef.current
      });
    }
  }, [activeSlug]);
  const linkClassName = clsx__WEBPACK_IMPORTED_MODULE_3___default()(
    "nx-text-xs nx-font-medium nx-text-gray-500 hover:nx-text-gray-900 dark:nx-text-gray-400 dark:hover:nx-text-gray-100",
    "contrast-more:nx-text-gray-800 contrast-more:dark:nx-text-gray-50"
  );
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    ref: tocRef,
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nextra-scrollbar nx-sticky nx-top-16 nx-overflow-y-auto nx-pr-4 nx-pt-8 nx-text-sm [hyphens:auto]",
      "nx-max-h-[calc(100vh-var(--nextra-navbar-height)-env(safe-area-inset-bottom))] ltr:-nx-mr-4 rtl:-nx-ml-4"
    )
  }, hasHeadings && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: "nx-mb-4 nx-font-semibold nx-tracking-tight"
  }, renderComponent(config.toc.title)), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", null, items.map(({ slug, text, depth }) => {
    var _a2;
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
      className: "nx-my-2 nx-scroll-my-6 nx-scroll-py-6",
      key: slug
    }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      href: `#${slug}`,
      className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
        {
          2: "nx-font-semibold",
          3: "ltr:nx-ml-4 rtl:nx-mr-4",
          4: "ltr:nx-ml-8 rtl:nx-mr-8",
          5: "ltr:nx-ml-12 rtl:nx-mr-12",
          6: "ltr:nx-ml-16 rtl:nx-mr-16"
        }[depth],
        "nx-inline-block",
        ((_a2 = activeAnchor[slug]) == null ? void 0 : _a2.isActive) ? "nx-text-primary-600 nx-subpixel-antialiased contrast-more:!nx-text-primary-600" : "nx-text-gray-500 hover:nx-text-gray-900 dark:nx-text-gray-400 dark:hover:nx-text-gray-300",
        "contrast-more:nx-text-gray-900 contrast-more:nx-underline contrast-more:dark:nx-text-gray-50"
      )
    }, text));
  }))), hasMetaInfo && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      hasHeadings && "nx-mt-8 nx-border-t nx-bg-white nx-pt-8 nx-shadow-[0_-12px_16px_white] dark:nx-bg-dark dark:nx-shadow-[0_-12px_16px_#111]",
      "nx-sticky nx-bottom-0 nx-flex nx-flex-col nx-items-start nx-gap-2 nx-pb-8 dark:nx-border-neutral-800",
      "contrast-more:nx-border-t contrast-more:nx-border-neutral-400 contrast-more:nx-shadow-none contrast-more:dark:nx-border-neutral-400"
    )
  }, config.feedback.content ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Anchor, {
    className: linkClassName,
    href: getGitIssueUrl({
      repository: config.docsRepositoryBase,
      title: `Feedback for \u201C${config.title}\u201D`,
      labels: config.feedback.labels
    }),
    newWindow: true
  }, renderComponent(config.feedback.content)) : null, renderComponent(config.editLink.component, {
    filePath,
    className: linkClassName,
    children: renderComponent(config.editLink.text)
  }), renderComponent(config.toc.extraContent)));
}

// src/components/match-sorter-search.tsx


function MatchSorterSearch({
  className,
  directories = []
}) {
  const [search, setSearch] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const results = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(
    () => search ? (0,match_sorter__WEBPACK_IMPORTED_MODULE_18__.matchSorter)(directories, search, { keys: ["title"] }).map(
      ({ route, title }) => ({
        id: route + title,
        route,
        children: /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(HighlightMatches, {
          value: title,
          match: search
        })
      })
    ) : [],
    [search]
  );
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Search, {
    value: search,
    onChange: setSearch,
    className,
    overlayClassName: "nx-w-full",
    results
  });
}

// src/constants.tsx
var DEFAULT_LOCALE = "en-US";
var IS_BROWSER = typeof window !== "undefined";
var DEFAULT_THEME = {
  banner: {
    dismissible: true,
    key: "nextra-banner"
  },
  chat: {
    icon: /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(DiscordIcon, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "nx-sr-only"
    }, "Discord"))
  },
  darkMode: true,
  direction: "ltr",
  docsRepositoryBase: "https://github.com/shuding/nextra",
  editLink: {
    component({ className, filePath, children }) {
      const editUrl = getGitEditUrl(filePath);
      if (!editUrl) {
        return null;
      }
      return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Anchor, {
        className,
        href: editUrl
      }, children);
    },
    text: "Edit this page"
  },
  feedback: {
    content: () => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, "Question? Give us feedback \u2192"),
    labels: "feedback"
  },
  footer: {
    component: Footer,
    text: `MIT ${new Date().getFullYear()} \xA9 Nextra.`
  },
  gitTimestamp({ timestamp }) {
    const { locale = DEFAULT_LOCALE } = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, "Last updated on", " ", /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("time", {
      dateTime: timestamp.toISOString()
    }, timestamp.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric"
    })));
  },
  head: /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    name: "msapplication-TileColor",
    content: "#fff"
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    httpEquiv: "Content-Language",
    content: "en"
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    name: "description",
    content: "Nextra: the next docs builder"
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    name: "twitter:card",
    content: "summary_large_image"
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    name: "twitter:site",
    content: "@shuding_"
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    property: "og:title",
    content: "Nextra: the next docs builder"
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    property: "og:description",
    content: "Nextra: the next docs builder"
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("meta", {
    name: "apple-mobile-web-app-title",
    content: "Nextra"
  })),
  i18n: [],
  logo: /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "nx-font-extrabold"
  }, "Nextra"), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "nx-ml-2 nx-hidden nx-font-normal nx-text-gray-600 md:nx-inline"
  }, "The Next Docs Builder")),
  logoLink: true,
  navbar: {
    component: Navbar
  },
  navigation: true,
  nextThemes: {
    defaultTheme: "system",
    storageKey: "theme"
  },
  notFound: {
    content: "Submit an issue about broken link \u2192",
    labels: "bug"
  },
  primaryHue: {
    dark: 204,
    light: 212
  },
  project: {
    icon: /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(GitHubIcon, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "nx-sr-only"
    }, "GitHub"))
  },
  search: {
    component({ className, directories }) {
      const config = useConfig();
      return config.flexsearch ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Flexsearch, {
        className
      }) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(MatchSorterSearch, {
        className,
        directories
      });
    },
    emptyResult: /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "nx-block nx-select-none nx-p-8 nx-text-center nx-text-sm nx-text-gray-400"
    }, "No results found."),
    loading() {
      const { locale } = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
      if (locale === "zh-CN")
        return "\u6B63\u5728\u52A0\u8F7D\u2026";
      if (locale === "ru")
        return "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026";
      if (locale === "fr")
        return "\u0421hargement\u2026";
      return "Loading\u2026";
    },
    placeholder() {
      const { locale } = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
      if (locale === "zh-CN")
        return "\u641C\u7D22\u6587\u6863\u2026";
      if (locale === "ru")
        return "\u041F\u043E\u0438\u0441\u043A \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u0438\u2026";
      if (locale === "fr")
        return "Rechercher de la documentation\u2026";
      return "Search documentation\u2026";
    }
  },
  serverSideError: {
    content: "Submit an issue about error in url \u2192",
    labels: "bug"
  },
  sidebar: {
    defaultMenuCollapseLevel: 2,
    titleComponent: ({ title }) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, title)
  },
  toc: {
    component: TOC,
    float: true,
    title: "On This Page"
  },
  useNextSeoProps: () => ({ titleTemplate: "%s \u2013 Nextra" })
};
var DEEP_OBJECT_KEYS = Object.entries(DEFAULT_THEME).map(([key, value]) => {
  const isObject = value && typeof value === "object" && !Array.isArray(value) && !(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(value);
  if (isObject) {
    return key;
  }
}).filter(Boolean);
var LEGACY_CONFIG_OPTIONS = {
  bannerKey: "banner.key",
  bodyExtraContent: "main",
  customSearch: "search.component",
  defaultMenuCollapsed: "sidebar.defaultMenuCollapseLevel",
  feedbackLabels: "feedback.labels",
  feedbackLink: "feedback.content",
  floatTOC: "toc.float",
  footerEditLink: "editLink.text",
  footerText: "footer.text",
  github: "project.link",
  nextLinks: "navigation.next",
  notFoundLabels: "notFound.labels",
  notFoundLink: "notFound.content",
  prevLinks: "navigation.prev",
  projectChat: "chat",
  projectChatLink: "chat.link",
  projectChatLinkIcon: "chat.icon",
  projectLink: "project.link",
  projectLinkIcon: "project.icon",
  searchPlaceholder: "search.placeholder",
  serverSideErrorLabels: "serverSideError.labels",
  serverSideErrorLink: "serverSideError.content",
  sidebarSubtitle: "sidebar.titleComponent",
  tocExtraContent: "toc.extraContent",
  unstable_searchResultEmpty: "search.emptyResult"
};
var DEFAULT_PAGE_THEME = {
  breadcrumb: true,
  collapsed: false,
  footer: true,
  layout: "default",
  navbar: true,
  pagination: true,
  sidebar: true,
  timestamp: true,
  toc: true,
  typesetting: "default"
};

// src/polyfill.ts
if (IS_BROWSER) {
  let resizeTimer;
  const addResizingClass = () => {
    document.body.classList.add("resizing");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove("resizing");
    }, 200);
  };
  window.addEventListener("resize", addResizingClass);
}

// src/mdx-components.tsx




// ../nextra/dist/components/index.mjs








var Button = (_a) => {
  var _b = _a, {
    children,
    className = ""
  } = _b, props = __objRest2(_b, [
    "children",
    "className"
  ]);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", __spreadValues2({
    className: [
      "nextra-button nx-transition-all active:nx-opacity-50",
      "nx-bg-primary-700/5 nx-border nx-border-black/5 nx-text-gray-600 hover:nx-text-gray-900 nx-rounded-md nx-p-1.5",
      "dark:nx-bg-primary-300/10 dark:nx-border-white/10 dark:nx-text-gray-400 dark:hover:nx-text-gray-50",
      className
    ].join(" ")
  }, props), children);
};
var CopyToClipboard = (_a) => {
  var _b = _a, {
    value
  } = _b, props = __objRest2(_b, [
    "value"
  ]);
  const [isCopied, setCopied] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isCopied)
      return;
    const timerId = setTimeout(() => {
      setCopied(false);
    }, 2e3);
    return () => {
      clearTimeout(timerId);
    };
  }, [isCopied]);
  const handleClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => __async2(void 0, null, function* () {
    setCopied(true);
    if (!(navigator == null ? void 0 : navigator.clipboard)) {
      console.error("Access to clipboard rejected!");
    }
    try {
      yield navigator.clipboard.writeText(value);
    } catch (e) {
      console.error("Failed to copy!");
    }
  }), [value]);
  const IconToUse = isCopied ? CheckIcon : CopyIcon;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Button, __spreadValues2({
    onClick: handleClick,
    title: "Copy code",
    tabIndex: 0
  }, props), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(IconToUse, {
    className: "nextra-copy-icon nx-pointer-events-none nx-h-4 nx-w-4"
  }));
};
var Code = (_a) => {
  var _b = _a, {
    children,
    className = ""
  } = _b, props = __objRest2(_b, [
    "children",
    "className"
  ]);
  const hasLineNumbers = "data-line-numbers" in props;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("code", __spreadValues2({
    className: [
      "nx-border-black nx-border-opacity-[0.04] nx-bg-opacity-[0.03] nx-bg-black nx-break-words nx-rounded-md nx-border nx-py-0.5 nx-px-[.25em] nx-text-[.9em]",
      "dark:nx-border-white/10 dark:nx-bg-white/10",
      hasLineNumbers ? "[counter-reset:line]" : "",
      className
    ].join(" "),
    dir: "ltr"
  }, props), children);
};
var Pre = (_a) => {
  var _b = _a, {
    children,
    className = "",
    value,
    filename
  } = _b, props = __objRest2(_b, [
    "children",
    "className",
    "value",
    "filename"
  ]);
  const preRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [codeString, setCodeString] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(value);
  const toggleWordWrap = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    const htmlDataset = document.documentElement.dataset;
    const hasWordWrap = "nextraWordWrap" in htmlDataset;
    if (hasWordWrap) {
      delete htmlDataset.nextraWordWrap;
    } else {
      htmlDataset.nextraWordWrap = "";
    }
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    var _a2;
    const codeEl = (_a2 = preRef.current) == null ? void 0 : _a2.querySelector("code");
    if (codeEl == null ? void 0 : codeEl.textContent) {
      setCodeString(codeEl.textContent);
    }
  }, [preRef]);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, filename && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "nx-absolute nx-top-0 nx-z-[1] nx-w-full nx-truncate nx-rounded-t-xl nx-bg-primary-700/5 nx-py-2 nx-px-4 nx-text-xs nx-text-gray-700 dark:nx-bg-primary-300/10 dark:nx-text-gray-200"
  }, filename), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("pre", __spreadValues2({
    className: [
      "nx-bg-primary-700/5 nx-mb-4 nx-overflow-x-auto nx-rounded-xl nx-font-medium nx-subpixel-antialiased dark:nx-bg-primary-300/10 nx-text-[.9em]",
      "contrast-more:nx-border contrast-more:nx-border-primary-900/20 contrast-more:nx-contrast-150 contrast-more:dark:nx-border-primary-100/40",
      filename ? "nx-pt-12 nx-pb-4" : "nx-py-4",
      className
    ].join(" "),
    ref: preRef
  }, props), children), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: [
      "nx-opacity-0 nx-transition [div:hover>&]:nx-opacity-100 focus-within:nx-opacity-100",
      "nx-flex nx-gap-1 nx-absolute nx-m-[11px] nx-right-0",
      filename ? "nx-top-8" : "nx-top-0"
    ].join(" ")
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Button, {
    onClick: toggleWordWrap,
    className: "md:nx-hidden",
    title: "Toggle word wrap"
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(WordWrapIcon, {
    className: "nx-pointer-events-none nx-h-4 nx-w-4"
  })), codeString && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(CopyToClipboard, {
    value: codeString
  })));
};
var Td = (props) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", __spreadValues2({
  className: "nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 dark:nx-border-gray-600"
}, props));
var Table = (_a) => {
  var _b = _a, {
    className = ""
  } = _b, props = __objRest2(_b, [
    "className"
  ]);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("table", __spreadValues2({
    className: "nx-block nx-overflow-x-scroll " + className
  }, props));
};
var Th = (props) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", __spreadValues2({
  className: "nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 nx-font-semibold dark:nx-border-gray-600"
}, props));
var Tr = (props) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tr", __spreadValues2({
  className: "nx-m-0 nx-border-t nx-border-gray-300 nx-p-0 dark:nx-border-gray-600 even:nx-bg-gray-100 even:dark:nx-bg-gray-600/20"
}, props));

// src/mdx-components.tsx
var observer;
var setActiveAnchor;
var slugs = /* @__PURE__ */ new WeakMap();
if (IS_BROWSER) {
  observer || (observer = new IntersectionObserver(
    (entries) => {
      setActiveAnchor((f) => {
        const ret = __spreadValues({}, f);
        for (const entry of entries) {
          if ((entry == null ? void 0 : entry.rootBounds) && slugs.has(entry.target)) {
            const [slug, index] = slugs.get(entry.target);
            const aboveHalfViewport = entry.boundingClientRect.y + entry.boundingClientRect.height <= entry.rootBounds.y + entry.rootBounds.height;
            const insideHalfViewport = entry.intersectionRatio > 0;
            ret[slug] = {
              index,
              aboveHalfViewport,
              insideHalfViewport
            };
          }
        }
        let activeSlug = "";
        let smallestIndexInViewport = Infinity;
        let largestIndexAboveViewport = -1;
        for (let s in ret) {
          ret[s].isActive = false;
          if (ret[s].insideHalfViewport && ret[s].index < smallestIndexInViewport) {
            smallestIndexInViewport = ret[s].index;
            activeSlug = s;
          }
          if (smallestIndexInViewport === Infinity && ret[s].aboveHalfViewport && ret[s].index > largestIndexAboveViewport) {
            largestIndexAboveViewport = ret[s].index;
            activeSlug = s;
          }
        }
        if (ret[activeSlug])
          ret[activeSlug].isActive = true;
        return ret;
      });
    },
    {
      rootMargin: "0px 0px -50%",
      threshold: [0, 1]
    }
  ));
}
var createHeaderLink = (Tag, context) => function HeaderLink(_a) {
  var _b = _a, {
    children,
    id
  } = _b, props = __objRest(_b, [
    "children",
    "id"
  ]);
  setActiveAnchor != null ? setActiveAnchor : setActiveAnchor = useSetActiveAnchor();
  const obRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const heading = obRef.current;
    if (!heading)
      return;
    slugs.set(heading, [id, context.index += 1]);
    observer.observe(heading);
    return () => {
      observer.disconnect();
      slugs.delete(heading);
      setActiveAnchor((f) => {
        const ret = __spreadValues({}, f);
        delete ret[id];
        return ret;
      });
    };
  }, []);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Tag, __spreadValues({
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nx-font-semibold nx-tracking-tight",
      {
        h2: "nx-mt-10 nx-border-b nx-pb-1 nx-text-3xl nx-border-neutral-200/70 contrast-more:nx-border-neutral-400 dark:nx-border-primary-100/10 contrast-more:dark:nx-border-neutral-400",
        h3: "nx-mt-8 nx-text-2xl",
        h4: "nx-mt-8 nx-text-xl",
        h5: "nx-mt-8 nx-text-lg",
        h6: "nx-mt-8 nx-text-base"
      }[Tag]
    )
  }, props), children, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "nx-absolute -nx-mt-20",
    id,
    ref: obRef
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    href: `#${id}`,
    className: "subheading-anchor",
    "aria-label": "Permalink for this section"
  }));
};
var findSummary = (children) => {
  let summary = null;
  const restChildren = [];
  react__WEBPACK_IMPORTED_MODULE_0__.Children.forEach(children, (child, index) => {
    var _a;
    if (child && child.type === Summary) {
      summary || (summary = child);
      return;
    }
    let c = child;
    if (!summary && child && typeof child === "object" && child.type !== Details && "props" in child && child.props) {
      const result = findSummary(child.props.children);
      summary = result[0];
      c = (0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(child, __spreadProps(__spreadValues({}, child.props), {
        children: ((_a = result[1]) == null ? void 0 : _a.length) ? result[1] : void 0,
        key: index
      }));
    }
    restChildren.push(c);
  });
  return [summary, restChildren];
};
var Details = (_a) => {
  var _b = _a, {
    children,
    open
  } = _b, props = __objRest(_b, [
    "children",
    "open"
  ]);
  const [openState, setOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!!open);
  const [summary, restChildren] = findSummary(children);
  const [delayedOpenState, setDelayedOpenState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(openState);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (openState) {
      setDelayedOpenState(true);
    } else {
      const timeout = setTimeout(() => setDelayedOpenState(openState), 500);
      return () => clearTimeout(timeout);
    }
  }, [openState]);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("details", __spreadValues(__spreadProps(__spreadValues({
    className: "nx-my-4 nx-rounded nx-border nx-border-gray-200 nx-bg-white nx-p-2 nx-shadow-sm first:nx-mt-0 dark:nx-border-neutral-800 dark:nx-bg-neutral-900"
  }, props), {
    open: delayedOpenState
  }), openState && { "data-expanded": true }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(DetailsProvider, {
    value: setOpen
  }, summary), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Collapse, {
    open: openState
  }, restChildren));
};
var Summary = (props) => {
  const setOpen = useDetails();
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("summary", __spreadProps(__spreadValues({
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nx-cursor-pointer nx-list-none nx-p-1 nx-transition-colors hover:nx-bg-gray-100 dark:hover:nx-bg-neutral-800",
      "before:nx-mr-1 before:nx-inline-block before:nx-transition-transform before:nx-content-[''] dark:before:nx-invert",
      "rtl:before:nx-rotate-180 [[data-expanded]>&]:before:nx-rotate-90"
    )
  }, props), {
    onClick: (e) => {
      e.preventDefault();
      setOpen((v) => !v);
    }
  }));
};
var A = (_a) => {
  var _b = _a, { href = "" } = _b, props = __objRest(_b, ["href"]);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Anchor, __spreadValues({
    href,
    newWindow: href.startsWith("https://")
  }, props));
};
var getComponents = ({
  isRawLayout,
  components
}) => {
  if (isRawLayout) {
    return { a: A };
  }
  const context = { index: 0 };
  return __spreadValues({
    h1: (props) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", __spreadValues({
      className: "nx-mt-2 nx-text-4xl nx-font-bold nx-tracking-tight"
    }, props)),
    h2: createHeaderLink("h2", context),
    h3: createHeaderLink("h3", context),
    h4: createHeaderLink("h4", context),
    h5: createHeaderLink("h5", context),
    h6: createHeaderLink("h6", context),
    ul: (props) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", __spreadValues({
      className: "nx-mt-6 nx-list-disc first:nx-mt-0 ltr:nx-ml-6 rtl:nx-mr-6"
    }, props)),
    ol: (props) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ol", __spreadValues({
      className: "nx-mt-6 nx-list-decimal first:nx-mt-0 ltr:nx-ml-6 rtl:nx-mr-6"
    }, props)),
    li: (props) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", __spreadValues({
      className: "nx-my-2"
    }, props)),
    blockquote: (props) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("blockquote", __spreadValues({
      className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
        "nx-mt-6 nx-border-gray-300 nx-italic nx-text-gray-700 dark:nx-border-gray-700 dark:nx-text-gray-400",
        "first:nx-mt-0 ltr:nx-border-l-2 ltr:nx-pl-6 rtl:nx-border-r-2 rtl:nx-pr-6"
      )
    }, props)),
    hr: (props) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("hr", __spreadValues({
      className: "nx-my-8 dark:nx-border-gray-900"
    }, props)),
    a: (props) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(A, __spreadProps(__spreadValues({}, props), {
      className: "nx-text-primary-600 nx-underline nx-decoration-from-font [text-underline-position:from-font]"
    })),
    table: (props) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Table, __spreadValues({
      className: "nextra-scrollbar nx-mt-6 nx-p-0 first:nx-mt-0"
    }, props)),
    p: (props) => /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", __spreadValues({
      className: "nx-mt-6 nx-leading-7 first:nx-mt-0"
    }, props)),
    tr: Tr,
    th: Th,
    td: Td,
    details: Details,
    summary: Summary,
    pre: Pre,
    code: Code
  }, components);
};

// src/index.tsx


function useDirectoryInfo(pageMap) {
  const { locale = DEFAULT_LOCALE, defaultLocale, route } = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const fsPath = getFSRoute(route, locale);
    return normalizePages({
      list: pageMap,
      locale,
      defaultLocale,
      route: fsPath
    });
  }, [pageMap, locale, defaultLocale, route]);
}
var Body = ({
  themeContext,
  breadcrumb,
  timestamp,
  navigation,
  children
}) => {
  var _a;
  const config = useConfig();
  const mounted = useMounted();
  if (themeContext.layout === "raw") {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "nx-w-full nx-overflow-x-hidden"
    }, children);
  }
  const date = themeContext.timestamp && config.gitTimestamp && timestamp ? new Date(timestamp) : null;
  const gitTimestampEl = mounted && date ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "nx-mt-12 nx-mb-8 nx-block nx-text-xs nx-text-gray-500 ltr:nx-text-right rtl:nx-text-left dark:nx-text-gray-400"
  }, renderComponent(config.gitTimestamp, { timestamp: date })) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "nx-mt-16"
  });
  const content = /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, children, gitTimestampEl, navigation);
  const body = ((_a = config.main) == null ? void 0 : _a.call(config, { children: content })) || content;
  if (themeContext.layout === "full") {
    return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("article", {
      className: "nx-min-h-[calc(100vh-4rem)] nx-w-full nx-overflow-x-hidden nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]"
    }, body);
  }
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("article", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nx-flex nx-min-h-[calc(100vh-4rem)] nx-w-full nx-min-w-0 nx-max-w-full nx-justify-center nx-pb-8 nx-pr-[calc(env(safe-area-inset-right)-1.5rem)]",
      themeContext.typesetting === "article" && "nextra-body-typesetting-article"
    )
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("main", {
    className: "nx-w-full nx-min-w-0 nx-max-w-4xl nx-px-6 nx-pt-4 md:nx-px-8"
  }, breadcrumb, body));
};
var InnerLayout = ({
  filePath,
  pageMap,
  frontMatter,
  headings,
  timestamp,
  children
}) => {
  const config = useConfig();
  const {
    activeType,
    activeIndex,
    activeThemeContext,
    activePath,
    topLevelNavbarItems,
    docsDirectories,
    flatDirectories,
    flatDocsDirectories,
    directories
  } = useDirectoryInfo(pageMap);
  const themeContext = __spreadValues(__spreadValues({}, activeThemeContext), frontMatter);
  const hideSidebar = !themeContext.sidebar || themeContext.layout === "raw" || activeType === "page";
  const tocClassName = "nextra-toc nx-order-last nx-hidden nx-w-64 nx-shrink-0 xl:nx-block";
  const tocEl = activeType === "page" || !themeContext.toc || themeContext.layout !== "default" ? themeContext.layout !== "full" && themeContext.layout !== "raw" && /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("nav", {
    className: tocClassName,
    "aria-label": "table of contents"
  }) : /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("nav", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(tocClassName, "nx-px-4"),
    "aria-label": "table of contents"
  }, renderComponent(config.toc.component, {
    headings: config.toc.float ? headings : [],
    filePath
  }));
  const { locale = DEFAULT_LOCALE } = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
  const localeConfig = config.i18n.find((l) => l.locale === locale);
  const isRTL = localeConfig ? localeConfig.direction === "rtl" : config.direction === "rtl";
  const direction = isRTL ? "rtl" : "ltr";
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    dir: direction
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("script", {
    dangerouslySetInnerHTML: {
      __html: `document.documentElement.setAttribute('dir','${direction}')`
    }
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Head, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Banner, null), themeContext.navbar && renderComponent(config.navbar.component, {
    flatDirectories,
    items: topLevelNavbarItems
  }), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: clsx__WEBPACK_IMPORTED_MODULE_3___default()(
      "nx-mx-auto nx-flex",
      themeContext.layout !== "raw" && "nx-max-w-[90rem]"
    )
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ActiveAnchorProvider, null, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Sidebar, {
    docsDirectories,
    flatDirectories,
    fullDirectories: directories,
    headings,
    asPopover: hideSidebar,
    includePlaceholder: themeContext.layout === "default"
  }), tocEl, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(SkipNavContent, null), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Body, {
    themeContext,
    breadcrumb: activeType !== "page" && themeContext.breadcrumb ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Breadcrumb, {
      activePath
    }) : null,
    timestamp,
    navigation: activeType !== "page" && themeContext.pagination ? /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(NavLinks, {
      flatDirectories: flatDocsDirectories,
      currentIndex: activeIndex
    }) : null
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_mdx_js_react__WEBPACK_IMPORTED_MODULE_4__.MDXProvider, {
    components: getComponents({
      isRawLayout: themeContext.layout === "raw",
      components: config.components
    })
  }, children)))), themeContext.footer && renderComponent(config.footer.component, { menu: hideSidebar }));
};
function Layout(props) {
  const { route } = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
  const context = globalThis.__nextra_pageContext__[route];
  if (!context)
    throw new Error(`No content found for ${route}.`);
  const { pageOpts, Content } = context;
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ConfigProvider, {
    value: context
  }, /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(InnerLayout, __spreadValues({}, pageOpts), /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Content, __spreadValues({}, props))));
}


__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 8282:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
Object.defineProperty(exports, "Z", ({
    enumerable: true,
    get: function() {
        return _asyncToGenerator;
    }
}));
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}


/***/ }),

/***/ 5154:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
Object.defineProperty(exports, "Z", ({
    enumerable: true,
    get: function() {
        return _objectWithoutPropertiesLoose;
    }
}));
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}


/***/ }),

/***/ 7587:
/***/ ((module) => {

"use strict";
module.exports = {"i8":"13.0.7"};

/***/ })

};
;