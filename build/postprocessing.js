/**
 * @charliehess/postprocessing v6.18.0 build Mon Nov 09 2020
 * https://github.com/charliehess/postprocessing
 * Copyright 2020 Raoul van Rüschen
 * @license Zlib
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
	typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['@CHARLIEHESS/POSTPROCESSING'] = {}, global.THREE));
}(this, (function (exports, three) { 'use strict';

	var ColorChannel = {
	  RED: 0,
	  GREEN: 1,
	  BLUE: 2,
	  ALPHA: 3
	};

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function _isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;

	  try {
	    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function _construct(Parent, args, Class) {
	  if (_isNativeReflectConstruct()) {
	    _construct = Reflect.construct;
	  } else {
	    _construct = function _construct(Parent, args, Class) {
	      var a = [null];
	      a.push.apply(a, args);
	      var Constructor = Function.bind.apply(Parent, a);
	      var instance = new Constructor();
	      if (Class) _setPrototypeOf(instance, Class.prototype);
	      return instance;
	    };
	  }

	  return _construct.apply(null, arguments);
	}

	function _isNativeFunction(fn) {
	  return Function.toString.call(fn).indexOf("[native code]") !== -1;
	}

	function _wrapNativeSuper(Class) {
	  var _cache = typeof Map === "function" ? new Map() : undefined;

	  _wrapNativeSuper = function _wrapNativeSuper(Class) {
	    if (Class === null || !_isNativeFunction(Class)) return Class;

	    if (typeof Class !== "function") {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    if (typeof _cache !== "undefined") {
	      if (_cache.has(Class)) return _cache.get(Class);

	      _cache.set(Class, Wrapper);
	    }

	    function Wrapper() {
	      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
	    }

	    Wrapper.prototype = Object.create(Class.prototype, {
	      constructor: {
	        value: Wrapper,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	    return _setPrototypeOf(Wrapper, Class);
	  };

	  return _wrapNativeSuper(Class);
	}

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	function _possibleConstructorReturn(self, call) {
	  if (call && (typeof call === "object" || typeof call === "function")) {
	    return call;
	  }

	  return _assertThisInitialized(self);
	}

	function _createSuper(Derived) {
	  var hasNativeReflectConstruct = _isNativeReflectConstruct();

	  return function _createSuperInternal() {
	    var Super = _getPrototypeOf(Derived),
	        result;

	    if (hasNativeReflectConstruct) {
	      var NewTarget = _getPrototypeOf(this).constructor;

	      result = Reflect.construct(Super, arguments, NewTarget);
	    } else {
	      result = Super.apply(this, arguments);
	    }

	    return _possibleConstructorReturn(this, result);
	  };
	}

	function _superPropBase(object, property) {
	  while (!Object.prototype.hasOwnProperty.call(object, property)) {
	    object = _getPrototypeOf(object);
	    if (object === null) break;
	  }

	  return object;
	}

	function _get(target, property, receiver) {
	  if (typeof Reflect !== "undefined" && Reflect.get) {
	    _get = Reflect.get;
	  } else {
	    _get = function _get(target, property, receiver) {
	      var base = _superPropBase(target, property);

	      if (!base) return;
	      var desc = Object.getOwnPropertyDescriptor(base, property);

	      if (desc.get) {
	        return desc.get.call(receiver);
	      }

	      return desc.value;
	    };
	  }

	  return _get(target, property, receiver || target);
	}

	function set(target, property, value, receiver) {
	  if (typeof Reflect !== "undefined" && Reflect.set) {
	    set = Reflect.set;
	  } else {
	    set = function set(target, property, value, receiver) {
	      var base = _superPropBase(target, property);

	      var desc;

	      if (base) {
	        desc = Object.getOwnPropertyDescriptor(base, property);

	        if (desc.set) {
	          desc.set.call(receiver, value);
	          return true;
	        } else if (!desc.writable) {
	          return false;
	        }
	      }

	      desc = Object.getOwnPropertyDescriptor(receiver, property);

	      if (desc) {
	        if (!desc.writable) {
	          return false;
	        }

	        desc.value = value;
	        Object.defineProperty(receiver, property, desc);
	      } else {
	        _defineProperty(receiver, property, value);
	      }

	      return true;
	    };
	  }

	  return set(target, property, value, receiver);
	}

	function _set(target, property, value, receiver, isStrict) {
	  var s = set(target, property, value, receiver || target);

	  if (!s && isStrict) {
	    throw new Error('failed to set property');
	  }

	  return value;
	}

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

	  return arr2;
	}

	function _createForOfIteratorHelper(o, allowArrayLike) {
	  var it;

	  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
	    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
	      if (it) o = it;
	      var i = 0;

	      var F = function () {};

	      return {
	        s: F,
	        n: function () {
	          if (i >= o.length) return {
	            done: true
	          };
	          return {
	            done: false,
	            value: o[i++]
	          };
	        },
	        e: function (e) {
	          throw e;
	        },
	        f: F
	      };
	    }

	    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	  }

	  var normalCompletion = true,
	      didErr = false,
	      err;
	  return {
	    s: function () {
	      it = o[Symbol.iterator]();
	    },
	    n: function () {
	      var step = it.next();
	      normalCompletion = step.done;
	      return step;
	    },
	    e: function (e) {
	      didErr = true;
	      err = e;
	    },
	    f: function () {
	      try {
	        if (!normalCompletion && it.return != null) it.return();
	      } finally {
	        if (didErr) throw err;
	      }
	    }
	  };
	}

	var Disposable = function () {
	  function Disposable() {
	    _classCallCheck(this, Disposable);
	  }

	  _createClass(Disposable, [{
	    key: "dispose",
	    value: function dispose() {}
	  }]);

	  return Disposable;
	}();

	var fragmentShader = "uniform sampler2D previousLuminanceBuffer;uniform sampler2D currentLuminanceBuffer;uniform float minLuminance;uniform float deltaTime;uniform float tau;varying vec2 vUv;void main(){float previousLuminance=texture2D(previousLuminanceBuffer,vUv,MIP_LEVEL_1X1).r;float currentLuminance=texture2D(currentLuminanceBuffer,vUv,MIP_LEVEL_1X1).r;previousLuminance=max(minLuminance,previousLuminance);currentLuminance=max(minLuminance,currentLuminance);float adaptedLum=previousLuminance+(currentLuminance-previousLuminance)*(1.0-exp(-deltaTime*tau));gl_FragColor.r=adaptedLum;}";

	var vertexShader = "varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}";

	var AdaptiveLuminanceMaterial = function (_ShaderMaterial) {
	  _inherits(AdaptiveLuminanceMaterial, _ShaderMaterial);

	  var _super = _createSuper(AdaptiveLuminanceMaterial);

	  function AdaptiveLuminanceMaterial() {
	    var _this;

	    _classCallCheck(this, AdaptiveLuminanceMaterial);

	    _this = _super.call(this, {
	      type: "AdaptiveLuminanceMaterial",
	      defines: {
	        MIP_LEVEL_1X1: "0.0"
	      },
	      uniforms: {
	        previousLuminanceBuffer: new three.Uniform(null),
	        currentLuminanceBuffer: new three.Uniform(null),
	        minLuminance: new three.Uniform(0.01),
	        deltaTime: new three.Uniform(0.0),
	        tau: new three.Uniform(1.0)
	      },
	      fragmentShader: fragmentShader,
	      vertexShader: vertexShader,
	      depthWrite: false,
	      depthTest: false
	    });
	    _this.toneMapped = false;
	    return _this;
	  }

	  return AdaptiveLuminanceMaterial;
	}(three.ShaderMaterial);

	var fragmentShader$1 = "varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;\n#if EDGE_DETECTION_MODE != 0\nvarying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;\n#endif\n#if EDGE_DETECTION_MODE == 1\n#include <common>\n#endif\n#if EDGE_DETECTION_MODE == 0 || PREDICATION_MODE == 1\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D depthBuffer;\n#else\nuniform mediump sampler2D depthBuffer;\n#endif\nfloat readDepth(const in vec2 uv){\n#if DEPTH_PACKING == 3201\nreturn unpackRGBAToDepth(texture2D(depthBuffer,uv));\n#else\nreturn texture2D(depthBuffer,uv).r;\n#endif\n}vec3 gatherNeighbors(){float p=readDepth(vUv);float pLeft=readDepth(vUv0);float pTop=readDepth(vUv1);return vec3(p,pLeft,pTop);}\n#elif PREDICATION_MODE == 2\nuniform sampler2D predicationBuffer;vec3 gatherNeighbors(){float p=texture2D(predicationBuffer,vUv).r;float pLeft=texture2D(predicationBuffer,vUv0).r;float pTop=texture2D(predicationBuffer,vUv1).r;return vec3(p,pLeft,pTop);}\n#endif\n#if PREDICATION_MODE != 0\nvec2 calculatePredicatedThreshold(){vec3 neighbours=gatherNeighbors();vec2 delta=abs(neighbours.xx-neighbours.yz);vec2 edges=step(PREDICATION_THRESHOLD,delta);return PREDICATION_SCALE*EDGE_THRESHOLD*(1.0-PREDICATION_STRENGTH*edges);}\n#endif\n#if EDGE_DETECTION_MODE != 0\nuniform sampler2D inputBuffer;\n#endif\nvoid main(){\n#if EDGE_DETECTION_MODE == 0\nconst vec2 threshold=vec2(DEPTH_THRESHOLD);\n#elif PREDICATION_MODE != 0\nvec2 threshold=calculatePredicatedThreshold();\n#else\nconst vec2 threshold=vec2(EDGE_THRESHOLD);\n#endif\n#if EDGE_DETECTION_MODE == 0\nvec3 neighbors=gatherNeighbors();vec2 delta=abs(neighbors.xx-vec2(neighbors.y,neighbors.z));vec2 edges=step(threshold,delta);if(dot(edges,vec2(1.0))==0.0){discard;}gl_FragColor=vec4(edges,0.0,1.0);\n#elif EDGE_DETECTION_MODE == 1\nfloat l=linearToRelativeLuminance(texture2D(inputBuffer,vUv).rgb);float lLeft=linearToRelativeLuminance(texture2D(inputBuffer,vUv0).rgb);float lTop=linearToRelativeLuminance(texture2D(inputBuffer,vUv1).rgb);vec4 delta;delta.xy=abs(l-vec2(lLeft,lTop));vec2 edges=step(threshold,delta.xy);if(dot(edges,vec2(1.0))==0.0){discard;}float lRight=linearToRelativeLuminance(texture2D(inputBuffer,vUv2).rgb);float lBottom=linearToRelativeLuminance(texture2D(inputBuffer,vUv3).rgb);delta.zw=abs(l-vec2(lRight,lBottom));vec2 maxDelta=max(delta.xy,delta.zw);float lLeftLeft=linearToRelativeLuminance(texture2D(inputBuffer,vUv4).rgb);float lTopTop=linearToRelativeLuminance(texture2D(inputBuffer,vUv5).rgb);delta.zw=abs(vec2(lLeft,lTop)-vec2(lLeftLeft,lTopTop));maxDelta=max(maxDelta.xy,delta.zw);float finalDelta=max(maxDelta.x,maxDelta.y);edges.xy*=step(finalDelta,LOCAL_CONTRAST_ADAPTATION_FACTOR*delta.xy);gl_FragColor=vec4(edges,0.0,1.0);\n#elif EDGE_DETECTION_MODE == 2\nvec4 delta;vec3 c=texture2D(inputBuffer,vUv).rgb;vec3 cLeft=texture2D(inputBuffer,vUv0).rgb;vec3 t=abs(c-cLeft);delta.x=max(max(t.r,t.g),t.b);vec3 cTop=texture2D(inputBuffer,vUv1).rgb;t=abs(c-cTop);delta.y=max(max(t.r,t.g),t.b);vec2 edges=step(threshold,delta.xy);if(dot(edges,vec2(1.0))==0.0){discard;}vec3 cRight=texture2D(inputBuffer,vUv2).rgb;t=abs(c-cRight);delta.z=max(max(t.r,t.g),t.b);vec3 cBottom=texture2D(inputBuffer,vUv3).rgb;t=abs(c-cBottom);delta.w=max(max(t.r,t.g),t.b);vec2 maxDelta=max(delta.xy,delta.zw);vec3 cLeftLeft=texture2D(inputBuffer,vUv4).rgb;t=abs(c-cLeftLeft);delta.z=max(max(t.r,t.g),t.b);vec3 cTopTop=texture2D(inputBuffer,vUv5).rgb;t=abs(c-cTopTop);delta.w=max(max(t.r,t.g),t.b);maxDelta=max(maxDelta.xy,delta.zw);float finalDelta=max(maxDelta.x,maxDelta.y);edges*=step(finalDelta,LOCAL_CONTRAST_ADAPTATION_FACTOR*delta.xy);gl_FragColor=vec4(edges,0.0,1.0);\n#endif\n}";

	var vertexShader$1 = "uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;\n#if EDGE_DETECTION_MODE != 0\nvarying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;\n#endif\nvoid main(){vUv=position.xy*0.5+0.5;vUv0=vUv+texelSize*vec2(-1.0,0.0);vUv1=vUv+texelSize*vec2(0.0,-1.0);\n#if EDGE_DETECTION_MODE != 0\nvUv2=vUv+texelSize*vec2(1.0,0.0);vUv3=vUv+texelSize*vec2(0.0,1.0);vUv4=vUv+texelSize*vec2(-2.0,0.0);vUv5=vUv+texelSize*vec2(0.0,-2.0);\n#endif\ngl_Position=vec4(position.xy,1.0,1.0);}";

	var ColorEdgesMaterial = function (_ShaderMaterial) {
	  _inherits(ColorEdgesMaterial, _ShaderMaterial);

	  var _super = _createSuper(ColorEdgesMaterial);

	  function ColorEdgesMaterial() {
	    var _this;

	    var texelSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new three.Vector2();

	    _classCallCheck(this, ColorEdgesMaterial);

	    _this = _super.call(this, {
	      type: "ColorEdgesMaterial",
	      defines: {
	        EDGE_DETECTION_MODE: "2",
	        LOCAL_CONTRAST_ADAPTATION_FACTOR: "2.0",
	        EDGE_THRESHOLD: "0.1"
	      },
	      uniforms: {
	        inputBuffer: new three.Uniform(null),
	        texelSize: new three.Uniform(texelSize)
	      },
	      fragmentShader: fragmentShader$1,
	      vertexShader: vertexShader$1,
	      depthWrite: false,
	      depthTest: false
	    });
	    _this.toneMapped = false;
	    return _this;
	  }

	  _createClass(ColorEdgesMaterial, [{
	    key: "setLocalContrastAdaptationFactor",
	    value: function setLocalContrastAdaptationFactor(factor) {
	      this.defines.LOCAL_CONTRAST_ADAPTATION_FACTOR = factor.toFixed("2");
	      this.needsUpdate = true;
	    }
	  }, {
	    key: "setEdgeDetectionThreshold",
	    value: function setEdgeDetectionThreshold(threshold) {
	      var t = Math.min(Math.max(threshold, 0.05), 0.5);
	      this.defines.EDGE_THRESHOLD = t.toFixed("2");
	      this.needsUpdate = true;
	    }
	  }]);

	  return ColorEdgesMaterial;
	}(three.ShaderMaterial);

	var fragmentShader$2 = "#include <common>\n#include <dithering_pars_fragment>\nuniform sampler2D inputBuffer;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec4 sum=texture2D(inputBuffer,vUv0);sum+=texture2D(inputBuffer,vUv1);sum+=texture2D(inputBuffer,vUv2);sum+=texture2D(inputBuffer,vUv3);gl_FragColor=sum*0.25;\n#include <dithering_fragment>\n}";

	var vertexShader$2 = "uniform vec2 texelSize;uniform vec2 halfTexelSize;uniform float kernel;uniform float scale;/*Packing multiple texture coordinates into one varying and using a swizzle toextract them in the fragment shader still causes a dependent texture read.*/varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vec2 dUv=(texelSize*vec2(kernel)+halfTexelSize)*scale;vUv0=vec2(uv.x-dUv.x,uv.y+dUv.y);vUv1=vec2(uv.x+dUv.x,uv.y+dUv.y);vUv2=vec2(uv.x+dUv.x,uv.y-dUv.y);vUv3=vec2(uv.x-dUv.x,uv.y-dUv.y);gl_Position=vec4(position.xy,1.0,1.0);}";

	var ConvolutionMaterial = function (_ShaderMaterial) {
	  _inherits(ConvolutionMaterial, _ShaderMaterial);

	  var _super = _createSuper(ConvolutionMaterial);

	  function ConvolutionMaterial() {
	    var _this;

	    var texelSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new three.Vector2();

	    _classCallCheck(this, ConvolutionMaterial);

	    _this = _super.call(this, {
	      type: "ConvolutionMaterial",
	      uniforms: {
	        inputBuffer: new three.Uniform(null),
	        texelSize: new three.Uniform(new three.Vector2()),
	        halfTexelSize: new three.Uniform(new three.Vector2()),
	        kernel: new three.Uniform(0.0),
	        scale: new three.Uniform(1.0)
	      },
	      fragmentShader: fragmentShader$2,
	      vertexShader: vertexShader$2,
	      depthWrite: false,
	      depthTest: false
	    });
	    _this.toneMapped = false;

	    _this.setTexelSize(texelSize.x, texelSize.y);

	    _this.kernelSize = KernelSize.LARGE;
	    return _this;
	  }

	  _createClass(ConvolutionMaterial, [{
	    key: "getKernel",
	    value: function getKernel() {
	      return kernelPresets[this.kernelSize];
	    }
	  }, {
	    key: "setTexelSize",
	    value: function setTexelSize(x, y) {
	      this.uniforms.texelSize.value.set(x, y);
	      this.uniforms.halfTexelSize.value.set(x, y).multiplyScalar(0.5);
	    }
	  }]);

	  return ConvolutionMaterial;
	}(three.ShaderMaterial);
	var kernelPresets = [new Float32Array([0.0, 0.0]), new Float32Array([0.0, 1.0, 1.0]), new Float32Array([0.0, 1.0, 1.0, 2.0]), new Float32Array([0.0, 1.0, 2.0, 2.0, 3.0]), new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0, 4.0, 5.0]), new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 7.0, 8.0, 9.0, 10.0])];
	var KernelSize = {
	  VERY_SMALL: 0,
	  SMALL: 1,
	  MEDIUM: 2,
	  LARGE: 3,
	  VERY_LARGE: 4,
	  HUGE: 5
	};

	var fragmentShader$3 = "uniform sampler2D inputBuffer;uniform float opacity;varying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);gl_FragColor=opacity*texel;\n#include <encodings_fragment>\n}";

	var CopyMaterial = function (_ShaderMaterial) {
	  _inherits(CopyMaterial, _ShaderMaterial);

	  var _super = _createSuper(CopyMaterial);

	  function CopyMaterial() {
	    var _this;

	    _classCallCheck(this, CopyMaterial);

	    _this = _super.call(this, {
	      type: "CopyMaterial",
	      uniforms: {
	        inputBuffer: new three.Uniform(null),
	        opacity: new three.Uniform(1.0)
	      },
	      fragmentShader: fragmentShader$3,
	      vertexShader: vertexShader,
	      depthWrite: false,
	      depthTest: false
	    });
	    _this.toneMapped = false;
	    return _this;
	  }

	  return CopyMaterial;
	}(three.ShaderMaterial);

	var fragmentShader$4 = "#include <packing>\n#include <clipping_planes_pars_fragment>\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D depthBuffer;\n#else\nuniform mediump sampler2D depthBuffer;\n#endif\nuniform float cameraNear;uniform float cameraFar;varying float vViewZ;varying vec4 vProjTexCoord;void main(){\n#include <clipping_planes_fragment>\nvec2 projTexCoord=(vProjTexCoord.xy/vProjTexCoord.w)*0.5+0.5;projTexCoord=clamp(projTexCoord,0.002,0.998);float fragCoordZ=unpackRGBAToDepth(texture2D(depthBuffer,projTexCoord));\n#ifdef PERSPECTIVE_CAMERA\nfloat viewZ=perspectiveDepthToViewZ(fragCoordZ,cameraNear,cameraFar);\n#else\nfloat viewZ=orthographicDepthToViewZ(fragCoordZ,cameraNear,cameraFar);\n#endif\nfloat depthTest=(-vViewZ>-viewZ)? 1.0 : 0.0;gl_FragColor.rg=vec2(0.0,depthTest);}";

	var vertexShader$3 = "#include <common>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvarying float vViewZ;varying vec4 vProjTexCoord;void main(){\n#include <skinbase_vertex>\n#include <begin_vertex>\n#include <morphtarget_vertex>\n#include <skinning_vertex>\n#include <project_vertex>\nvViewZ=mvPosition.z;vProjTexCoord=gl_Position;\n#include <clipping_planes_vertex>\n}";

	var DepthComparisonMaterial = function (_ShaderMaterial) {
	  _inherits(DepthComparisonMaterial, _ShaderMaterial);

	  var _super = _createSuper(DepthComparisonMaterial);

	  function DepthComparisonMaterial() {
	    var _this;

	    var depthTexture = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	    var camera = arguments.length > 1 ? arguments[1] : undefined;

	    _classCallCheck(this, DepthComparisonMaterial);

	    _this = _super.call(this, {
	      type: "DepthComparisonMaterial",
	      uniforms: {
	        depthBuffer: new three.Uniform(depthTexture),
	        cameraNear: new three.Uniform(0.3),
	        cameraFar: new three.Uniform(1000)
	      },
	      fragmentShader: fragmentShader$4,
	      vertexShader: vertexShader$3,
	      depthWrite: false,
	      depthTest: false,
	      morphTargets: true,
	      skinning: true
	    });
	    _this.toneMapped = false;

	    _this.adoptCameraSettings(camera);

	    return _this;
	  }

	  _createClass(DepthComparisonMaterial, [{
	    key: "adoptCameraSettings",
	    value: function adoptCameraSettings() {
	      var camera = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

	      if (camera !== null) {
	        this.uniforms.cameraNear.value = camera.near;
	        this.uniforms.cameraFar.value = camera.far;

	        if (camera instanceof three.PerspectiveCamera) {
	          this.defines.PERSPECTIVE_CAMERA = "1";
	        } else {
	          delete this.defines.PERSPECTIVE_CAMERA;
	        }
	      }
	    }
	  }]);

	  return DepthComparisonMaterial;
	}(three.ShaderMaterial);

	var fragmentShader$5 = "#include <packing>\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D depthBuffer;\n#else\nuniform mediump sampler2D depthBuffer;\n#endif\n#ifdef DOWNSAMPLE_NORMALS\nuniform sampler2D normalBuffer;\n#endif\nvarying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;float readDepth(const in vec2 uv){\n#if DEPTH_PACKING == 3201\nreturn unpackRGBAToDepth(texture2D(depthBuffer,uv));\n#else\nreturn texture2D(depthBuffer,uv).r;\n#endif\n}/***Returns the index of the most representative depth in the 2x2 neighborhood.*/int findBestDepth(const in float samples[4]){float c=(samples[0]+samples[1]+samples[2]+samples[3])/4.0;float distances[4]=float[](abs(c-samples[0]),abs(c-samples[1]),abs(c-samples[2]),abs(c-samples[3]));float maxDistance=max(max(distances[0],distances[1]),max(distances[2],distances[3]));int remaining[3];int rejected[3];int i,j,k;for(i=0,j=0,k=0;i<4;++i){if(distances[i]<maxDistance){remaining[j++]=i;}else{rejected[k++]=i;}}for(;j<3;++j){remaining[j]=rejected[--k];}vec3 s=vec3(samples[remaining[0]],samples[remaining[1]],samples[remaining[2]]);c=(s.x+s.y+s.z)/3.0;distances[0]=abs(c-s.x);distances[1]=abs(c-s.y);distances[2]=abs(c-s.z);float minDistance=min(distances[0],min(distances[1],distances[2]));for(i=0;i<3;++i){if(distances[i]==minDistance){break;}}return remaining[i];}void main(){float d[4]=float[](readDepth(vUv0),readDepth(vUv1),readDepth(vUv2),readDepth(vUv3));int index=findBestDepth(d);\n#ifdef DOWNSAMPLE_NORMALS\nvec2 uvs[4]=vec2[](vUv0,vUv1,vUv2,vUv3);vec3 n=texture2D(normalBuffer,uvs[index]).rgb;\n#else\nvec3 n=vec3(0.0);\n#endif\ngl_FragColor=vec4(n,d[index]);}";

	var vertexShader$4 = "uniform vec2 texelSize;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vUv0=uv;vUv1=vec2(uv.x,uv.y+texelSize.y);vUv2=vec2(uv.x+texelSize.x,uv.y);vUv3=uv+texelSize;gl_Position=vec4(position.xy,1.0,1.0);}";

	var DepthDownsamplingMaterial = function (_ShaderMaterial) {
	  _inherits(DepthDownsamplingMaterial, _ShaderMaterial);

	  var _super = _createSuper(DepthDownsamplingMaterial);

	  function DepthDownsamplingMaterial() {
	    var _this;

	    _classCallCheck(this, DepthDownsamplingMaterial);

	    _this = _super.call(this, {
	      type: "DepthDownsamplingMaterial",
	      defines: {
	        DEPTH_PACKING: "0"
	      },
	      uniforms: {
	        depthBuffer: new three.Uniform(null),
	        normalBuffer: new three.Uniform(null),
	        texelSize: new three.Uniform(new three.Vector2())
	      },
	      fragmentShader: fragmentShader$5,
	      vertexShader: vertexShader$4,
	      depthWrite: false,
	      depthTest: false
	    });
	    _this.toneMapped = false;
	    return _this;
	  }

	  _createClass(DepthDownsamplingMaterial, [{
	    key: "setTexelSize",
	    value: function setTexelSize(x, y) {
	      this.uniforms.texelSize.value.set(x, y);
	    }
	  }, {
	    key: "depthPacking",
	    get: function get() {
	      return Number(this.defines.DEPTH_PACKING);
	    },
	    set: function set(value) {
	      this.defines.DEPTH_PACKING = value.toFixed(0);
	      this.needsUpdate = true;
	    }
	  }]);

	  return DepthDownsamplingMaterial;
	}(three.ShaderMaterial);

	var fragmentShader$6 = "#include <common>\n#include <packing>\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D depthBuffer0;uniform highp sampler2D depthBuffer1;\n#else\nuniform mediump sampler2D depthBuffer0;uniform mediump sampler2D depthBuffer1;\n#endif\nuniform sampler2D inputBuffer;varying vec2 vUv;void main(){\n#if DEPTH_PACKING_0 == 3201\nfloat d0=unpackRGBAToDepth(texture2D(depthBuffer0,vUv));\n#else\nfloat d0=texture2D(depthBuffer0,vUv).r;\n#endif\n#if DEPTH_PACKING_1 == 3201\nfloat d1=unpackRGBAToDepth(texture2D(depthBuffer1,vUv));\n#else\nfloat d1=texture2D(depthBuffer1,vUv).r;\n#endif\nif(d0<d1){discard;}gl_FragColor=texture2D(inputBuffer,vUv);}";

	var DepthMaskMaterial = function (_ShaderMaterial) {
	  _inherits(DepthMaskMaterial, _ShaderMaterial);

	  var _super = _createSuper(DepthMaskMaterial);

	  function DepthMaskMaterial() {
	    var _this;

	    _classCallCheck(this, DepthMaskMaterial);

	    _this = _super.call(this, {
	      type: "DepthMaskMaterial",
	      defines: {
	        DEPTH_PACKING_0: "0",
	        DEPTH_PACKING_1: "0"
	      },
	      uniforms: {
	        depthBuffer0: new three.Uniform(null),
	        depthBuffer1: new three.Uniform(null),
	        inputBuffer: new three.Uniform(null)
	      },
	      fragmentShader: fragmentShader$6,
	      vertexShader: vertexShader,
	      depthWrite: false,
	      depthTest: false
	    });
	    _this.toneMapped = false;
	    return _this;
	  }

	  return DepthMaskMaterial;
	}(three.ShaderMaterial);

	var EdgeDetectionMaterial = function (_ShaderMaterial) {
	  _inherits(EdgeDetectionMaterial, _ShaderMaterial);

	  var _super = _createSuper(EdgeDetectionMaterial);

	  function EdgeDetectionMaterial() {
	    var _this;

	    var texelSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new three.Vector2();
	    var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EdgeDetectionMode.COLOR;

	    _classCallCheck(this, EdgeDetectionMaterial);

	    _this = _super.call(this, {
	      type: "EdgeDetectionMaterial",
	      defines: {
	        LOCAL_CONTRAST_ADAPTATION_FACTOR: "2.0",
	        EDGE_THRESHOLD: "0.1",
	        DEPTH_THRESHOLD: "0.01",
	        PREDICATION_MODE: "0",
	        PREDICATION_THRESHOLD: "0.01",
	        PREDICATION_SCALE: "2.0",
	        PREDICATION_STRENGTH: "1.0",
	        DEPTH_PACKING: "0"
	      },
	      uniforms: {
	        inputBuffer: new three.Uniform(null),
	        depthBuffer: new three.Uniform(null),
	        predicationBuffer: new three.Uniform(null),
	        texelSize: new three.Uniform(texelSize)
	      },
	      fragmentShader: fragmentShader$1,
	      vertexShader: vertexShader$1,
	      depthWrite: false,
	      depthTest: false
	    });
	    _this.toneMapped = false;

	    _this.setEdgeDetectionMode(mode);

	    return _this;
	  }

	  _createClass(EdgeDetectionMaterial, [{
	    key: "setEdgeDetectionMode",
	    value: function setEdgeDetectionMode(mode) {
	      this.defines.EDGE_DETECTION_MODE = mode.toFixed(0);
	      this.needsUpdate = true;
	    }
	  }, {
	    key: "setLocalContrastAdaptationFactor",
	    value: function setLocalContrastAdaptationFactor(factor) {
	      this.defines.LOCAL_CONTRAST_ADAPTATION_FACTOR = factor.toFixed("6");
	      this.needsUpdate = true;
	    }
	  }, {
	    key: "setEdgeDetectionThreshold",
	    value: function setEdgeDetectionThreshold(threshold) {
	      this.defines.EDGE_THRESHOLD = threshold.toFixed("6");
	      this.defines.DEPTH_THRESHOLD = (threshold * 0.1).toFixed("6");
	      this.needsUpdate = true;
	    }
	  }, {
	    key: "setPredicationMode",
	    value: function setPredicationMode(mode) {
	      this.defines.PREDICATION_MODE = mode.toFixed(0);
	      this.needsUpdate = true;
	    }
	  }, {
	    key: "setPredicationBuffer",
	    value: function setPredicationBuffer(predicationBuffer) {
	      this.uniforms.predicationBuffer.value = predicationBuffer;
	    }
	  }, {
	    key: "setPredicationThreshold",
	    value: function setPredicationThreshold(threshold) {
	      this.defines.PREDICATION_THRESHOLD = threshold.toFixed("6");
	      this.needsUpdate = true;
	    }
	  }, {
	    key: "setPredicationScale",
	    value: function setPredicationScale(scale) {
	      this.defines.PREDICATION_SCALE = scale.toFixed("6");
	      this.needsUpdate = true;
	    }
	  }, {
	    key: "setPredicationStrength",
	    value: function setPredicationStrength(strength) {
	      this.defines.PREDICATION_STRENGTH = strength.toFixed("6");
	      this.needsUpdate = true;
	    }
	  }, {
	    key: "depthPacking",
	    get: function get() {
	      return Number(this.defines.DEPTH_PACKING);
	    },
	    set: function set(value) {
	      this.defines.DEPTH_PACKING = value.toFixed(0);
	      this.needsUpdate = true;
	    }
	  }]);

	  return EdgeDetectionMaterial;
	}(three.ShaderMaterial);
	var EdgeDetectionMode = {
	  DEPTH: 0,
	  LUMA: 1,
	  COLOR: 2
	};
	var PredicationMode = {
	  DISABLED: 0,
	  DEPTH: 1,
	  CUSTOM: 2
	};

	var fragmentTemplate = "#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\nuniform sampler2D inputBuffer;\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D depthBuffer;\n#else\nuniform mediump sampler2D depthBuffer;\n#endif\nuniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;float readDepth(const in vec2 uv){\n#if DEPTH_PACKING == 3201\nreturn unpackRGBAToDepth(texture2D(depthBuffer,uv));\n#else\nreturn texture2D(depthBuffer,uv).r;\n#endif\n}float getViewZ(const in float depth){\n#ifdef PERSPECTIVE_CAMERA\nreturn perspectiveDepthToViewZ(depth,cameraNear,cameraFar);\n#else\nreturn orthographicDepthToViewZ(depth,cameraNear,cameraFar);\n#endif\n}FRAGMENT_HEADvoid main(){FRAGMENT_MAIN_UVvec4 color0=texture2D(inputBuffer,UV);vec4 color1=vec4(0.0);FRAGMENT_MAIN_IMAGEgl_FragColor=color0;\n#ifdef ENCODE_OUTPUT\n#include <encodings_fragment>\n#endif\n#include <dithering_fragment>\n}";

	var vertexTemplate = "uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;VERTEX_HEADvoid main(){vUv=position.xy*0.5+0.5;VERTEX_MAIN_SUPPORTgl_Position=vec4(position.xy,1.0,1.0);}";

	var EffectMaterial = function (_ShaderMaterial) {
	  _inherits(EffectMaterial, _ShaderMaterial);

	  var _super = _createSuper(EffectMaterial);

	  function EffectMaterial() {
	    var _this;

	    var shaderParts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	    var defines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	    var uniforms = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	    var camera = arguments.length > 3 ? arguments[3] : undefined;
	    var dithering = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

	    _classCallCheck(this, EffectMaterial);

	    _this = _super.call(this, {
	      type: "EffectMaterial",
	      defines: {
	        DEPTH_PACKING: "0",
	        ENCODE_OUTPUT: "1"
	      },
	      uniforms: {
	        inputBuffer: new three.Uniform(null),
	        depthBuffer: new three.Uniform(null),
	        resolution: new three.Uniform(new three.Vector2()),
	        texelSize: new three.Uniform(new three.Vector2()),
	        cameraNear: new three.Uniform(0.3),
	        cameraFar: new three.Uniform(1000.0),
	        aspect: new three.Uniform(1.0),
	        time: new three.Uniform(0.0)
	      },
	      depthWrite: false,
	      depthTest: false,
	      dithering: dithering
	    });
	    _this.toneMapped = false;

	    if (shaderParts !== null) {
	      _this.setShaderParts(shaderParts);
	    }

	    if (defines !== null) {
	      _this.setDefines(defines);
	    }

	    if (uniforms !== null) {
	      _this.setUniforms(uniforms);
	    }

	    _this.adoptCameraSettings(camera);

	    return _this;
	  }

	  _createClass(EffectMaterial, [{
	    key: "setShaderParts",
	    value: function setShaderParts(shaderParts) {
	      this.fragmentShader = fragmentTemplate.replace(Section.FRAGMENT_HEAD, shaderParts.get(Section.FRAGMENT_HEAD)).replace(Section.FRAGMENT_MAIN_UV, shaderParts.get(Section.FRAGMENT_MAIN_UV)).replace(Section.FRAGMENT_MAIN_IMAGE, shaderParts.get(Section.FRAGMENT_MAIN_IMAGE));
	      this.vertexShader = vertexTemplate.replace(Section.VERTEX_HEAD, shaderParts.get(Section.VERTEX_HEAD)).replace(Section.VERTEX_MAIN_SUPPORT, shaderParts.get(Section.VERTEX_MAIN_SUPPORT));
	      this.needsUpdate = true;
	      return this;
	    }
	  }, {
	    key: "setDefines",
	    value: function setDefines(defines) {
	      var _iterator = _createForOfIteratorHelper(defines.entries()),
	          _step;

	      try {
	        for (_iterator.s(); !(_step = _iterator.n()).done;) {
	          var entry = _step.value;
	          this.defines[entry[0]] = entry[1];
	        }
	      } catch (err) {
	        _iterator.e(err);
	      } finally {
	        _iterator.f();
	      }

	      this.needsUpdate = true;
	      return this;
	    }
	  }, {
	    key: "setUniforms",
	    value: function setUniforms(uniforms) {
	      var _iterator2 = _createForOfIteratorHelper(uniforms.entries()),
	          _step2;

	      try {
	        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	          var entry = _step2.value;
	          this.uniforms[entry[0]] = entry[1];
	        }
	      } catch (err) {
	        _iterator2.e(err);
	      } finally {
	        _iterator2.f();
	      }

	      return this;
	    }
	  }, {
	    key: "adoptCameraSettings",
	    value: function adoptCameraSettings() {
	      var camera = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

	      if (camera !== null) {
	        this.uniforms.cameraNear.value = camera.near;
	        this.uniforms.cameraFar.value = camera.far;

	        if (camera instanceof three.PerspectiveCamera) {
	          this.defines.PERSPECTIVE_CAMERA = "1";
	        } else {
	          delete this.defines.PERSPECTIVE_CAMERA;
	        }

	        this.needsUpdate = true;
	      }
	    }
	  }, {
	    key: "setSize",
	    value: function setSize(width, height) {
	      var w = Math.max(width, 1);
	      var h = Math.max(height, 1);
	      this.uniforms.resolution.value.set(w, h);
	      this.uniforms.texelSize.value.set(1.0 / w, 1.0 / h);
	      this.uniforms.aspect.value = w / h;
	    }
	  }, {
	    key: "depthPacking",
	    get: function get() {
	      return Number(this.defines.DEPTH_PACKING);
	    },
	    set: function set(value) {
	      this.defines.DEPTH_PACKING = value.toFixed(0);
	      this.needsUpdate = true;
	    }
	  }]);

	  return EffectMaterial;
	}(three.ShaderMaterial);
	var Section = {
	  FRAGMENT_HEAD: "FRAGMENT_HEAD",
	  FRAGMENT_MAIN_UV: "FRAGMENT_MAIN_UV",
	  FRAGMENT_MAIN_IMAGE: "FRAGMENT_MAIN_IMAGE",
	  VERTEX_HEAD: "VERTEX_HEAD",
	  VERTEX_MAIN_SUPPORT: "VERTEX_MAIN_SUPPORT"
	};

	var fragmentShader$7 = "#include <common>\nuniform sampler2D inputBuffer;\n#ifdef RANGE\nuniform vec2 range;\n#elif defined(THRESHOLD)\nuniform float threshold;uniform float smoothing;\n#endif\nvarying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);float l=linearToRelativeLuminance(texel.rgb);\n#ifdef RANGE\nfloat low=step(range.x,l);float high=step(l,range.y);l*=low*high;\n#elif defined(THRESHOLD)\nl=smoothstep(threshold,threshold+smoothing,l);\n#endif\n#ifdef COLOR\ngl_FragColor=vec4(texel.rgb*l,l);\n#else\ngl_FragColor=vec4(l);\n#endif\n}";

	var LuminanceMaterial = function (_ShaderMaterial) {
	  _inherits(LuminanceMaterial, _ShaderMaterial);

	  var _super = _createSuper(LuminanceMaterial);

	  function LuminanceMaterial() {
	    var _this;

	    var colorOutput = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	    var luminanceRange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	    _classCallCheck(this, LuminanceMaterial);

	    var useRange = luminanceRange !== null;
	    _this = _super.call(this, {
	      type: "LuminanceMaterial",
	      uniforms: {
	        inputBuffer: new three.Uniform(null),
	        threshold: new three.Uniform(0.0),
	        smoothing: new three.Uniform(1.0),
	        range: new three.Uniform(useRange ? luminanceRange : new three.Vector2())
	      },
	      fragmentShader: fragmentShader$7,
	      vertexShader: vertexShader,
	      depthWrite: false,
	      depthTest: false
	    });
	    _this.toneMapped = false;
	    _this.colorOutput = colorOutput;
	    _this.useThreshold = true;
	    _this.useRange = useRange;
	    return _this;
	  }

	  _createClass(LuminanceMaterial, [{
	    key: "setColorOutputEnabled",
	    value: function setColorOutputEnabled(enabled) {
	      this.colorOutput = enabled;
	    }
	  }, {
	    key: "setLuminanceRangeEnabled",
	    value: function setLuminanceRangeEnabled(enabled) {
	      this.useRange = enabled;
	    }
	  }, {
	    key: "threshold",
	    get: function get() {
	      return this.uniforms.threshold.value;
	    },
	    set: function set(value) {
	      this.uniforms.threshold.value = value;
	    }
	  }, {
	    key: "smoothing",
	    get: function get() {
	      return this.uniforms.smoothing.value;
	    },
	    set: function set(value) {
	      this.uniforms.smoothing.value = value;
	    }
	  }, {
	    key: "useThreshold",
	    get: function get() {
	      return this.defines.THRESHOLD !== undefined;
	    },
	    set: function set(value) {
	      if (value) {
	        this.defines.THRESHOLD = "1";
	      } else {
	        delete this.defines.THRESHOLD;
	      }

	      this.needsUpdate = true;
	    }
	  }, {
	    key: "colorOutput",
	    get: function get() {
	      return this.defines.COLOR !== undefined;
	    },
	    set: function set(value) {
	      if (value) {
	        this.defines.COLOR = "1";
	      } else {
	        delete this.defines.COLOR;
	      }

	      this.needsUpdate = true;
	    }
	  }, {
	    key: "useRange",
	    get: function get() {
	      return this.defines.RANGE !== undefined;
	    },
	    set: function set(value) {
	      if (value) {
	        this.defines.RANGE = "1";
	      } else {
	        delete this.defines.RANGE;
	      }

	      this.needsUpdate = true;
	    }
	  }, {
	    key: "luminanceRange",
	    get: function get() {
	      return this.useRange;
	    },
	    set: function set(value) {
	      this.useRange = value;
	    }
	  }]);

	  return LuminanceMaterial;
	}(three.ShaderMaterial);

	var fragmentShader$8 = "uniform sampler2D maskTexture;uniform sampler2D inputBuffer;\n#if MASK_FUNCTION != 0\nuniform float strength;\n#endif\nvarying vec2 vUv;void main(){\n#if COLOR_CHANNEL == 0\nfloat mask=texture2D(maskTexture,vUv).r;\n#elif COLOR_CHANNEL == 1\nfloat mask=texture2D(maskTexture,vUv).g;\n#elif COLOR_CHANNEL == 2\nfloat mask=texture2D(maskTexture,vUv).b;\n#else\nfloat mask=texture2D(maskTexture,vUv).a;\n#endif\n#if MASK_FUNCTION == 0\n#ifdef INVERTED\nif(mask>0.0){discard;}\n#else\nif(mask==0.0){discard;}\n#endif\n#else\nmask=clamp(mask*strength,0.0,1.0);\n#ifdef INVERTED\nmask=(1.0-mask);\n#endif\n#if MASK_FUNCTION == 1\ngl_FragColor=mask*texture2D(inputBuffer,vUv);\n#else\ngl_FragColor=vec4(mask*texture2D(inputBuffer,vUv).rgb,mask);\n#endif\n#endif\n}";

	var MaskMaterial = function (_ShaderMaterial) {
	  _inherits(MaskMaterial, _ShaderMaterial);

	  var _super = _createSuper(MaskMaterial);

	  function MaskMaterial() {
	    var _this;

	    var maskTexture = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

	    _classCallCheck(this, MaskMaterial);

	    _this = _super.call(this, {
	      type: "MaskMaterial",
	      uniforms: {
	        maskTexture: new three.Uniform(maskTexture),
	        inputBuffer: new three.Uniform(null),
	        strength: new three.Uniform(1.0)
	      },
	      fragmentShader: fragmentShader$8,
	      vertexShader: vertexShader,
	      depthWrite: false,
	      depthTest: false
	    });
	    _this.toneMapped = false;
	    _this.colorChannel = ColorChannel.RED;
	    _this.maskFunction = MaskFunction.DISCARD;
	    return _this;
	  }

	  _createClass(MaskMaterial, [{
	    key: "maskTexture",
	    set: function set(value) {
	      this.uniforms.maskTexture.value = value;
	    }
	  }, {
	    key: "colorChannel",
	    set: function set(value) {
	      this.defines.COLOR_CHANNEL = value.toFixed(0);
	      this.needsUpdate = true;
	    }
	  }, {
	    key: "maskFunction",
	    set: function set(value) {
	      this.defines.MASK_FUNCTION = value.toFixed(0);
	      this.needsUpdate = true;
	    }
	  }, {
	    key: "inverted",
	    get: function get() {
	      return this.defines.INVERTED !== undefined;
	    },
	    set: function set(value) {
	      if (this.inverted && !value) {
	        delete this.defines.INVERTED;
	      } else if (value) {
	        this.defines.INVERTED = "1";
	      }

	      this.needsUpdate = true;
	    }
	  }, {
	    key: "strength",
	    get: function get() {
	      return this.uniforms.strength.value;
	    },
	    set: function set(value) {
	      this.uniforms.strength.value = value;
	    }
	  }]);

	  return MaskMaterial;
	}(three.ShaderMaterial);
	var MaskFunction = {
	  DISCARD: 0,
	  MULTIPLY: 1,
	  MULTIPLY_RGB_SET_ALPHA: 2
	};

	var fragmentShader$9 = "uniform sampler2D inputBuffer;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 c0=texture2D(inputBuffer,vUv0).rg;vec2 c1=texture2D(inputBuffer,vUv1).rg;vec2 c2=texture2D(inputBuffer,vUv2).rg;vec2 c3=texture2D(inputBuffer,vUv3).rg;float d0=(c0.x-c1.x)*0.5;float d1=(c2.x-c3.x)*0.5;float d=length(vec2(d0,d1));float a0=min(c0.y,c1.y);float a1=min(c2.y,c3.y);float visibilityFactor=min(a0,a1);gl_FragColor.rg=(1.0-visibilityFactor>0.001)? vec2(d,0.0): vec2(0.0,d);}";

	var vertexShader$5 = "uniform vec2 texelSize;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vUv0=vec2(uv.x+texelSize.x,uv.y);vUv1=vec2(uv.x-texelSize.x,uv.y);vUv2=vec2(uv.x,uv.y+texelSize.y);vUv3=vec2(uv.x,uv.y-texelSize.y);gl_Position=vec4(position.xy,1.0,1.0);}";

	var OutlineMaterial = function (_ShaderMaterial) {
	  _inherits(OutlineMaterial, _ShaderMaterial);

	  var _super = _createSuper(OutlineMaterial);

	  function OutlineMaterial() {
	    var _this;

	    var texelSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new three.Vector2();

	    _classCallCheck(this, OutlineMaterial);

	    _this = _super.call(this, {
	      type: "OutlineMaterial",
	      uniforms: {
	        inputBuffer: new three.Uniform(null),
	        texelSize: new three.Uniform(new three.Vector2())
	      },
	      fragmentShader: fragmentShader$9,
	      vertexShader: vertexShader$5,
	      depthWrite: false,
	      depthTest: false
	    });
	    _this.toneMapped = false;

	    _this.setTexelSize(texelSize.x, texelSize.y);

	    _this.uniforms.maskTexture = _this.uniforms.inputBuffer;
	    return _this;
	  }

	  _createClass(OutlineMaterial, [{
	    key: "setTexelSize",
	    value: function setTexelSize(x, y) {
	      this.uniforms.texelSize.value.set(x, y);
	    }
	  }]);

	  return OutlineMaterial;
	}(three.ShaderMaterial);
	var OutlineEdgesMaterial = OutlineMaterial;

	var AUTO_SIZE = -1;
	var Resizer = function () {
	  function Resizer(resizable) {
	    var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : AUTO_SIZE;
	    var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : AUTO_SIZE;
	    var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;

	    _classCallCheck(this, Resizer);

	    this.resizable = resizable;
	    this.base = new three.Vector2(1, 1);
	    this.target = new three.Vector2(width, height);
	    this.s = scale;
	  }

	  _createClass(Resizer, [{
	    key: "scale",
	    get: function get() {
	      return this.s;
	    },
	    set: function set(value) {
	      this.s = value;
	      this.target.x = AUTO_SIZE;
	      this.target.y = AUTO_SIZE;
	      this.resizable.setSize(this.base.x, this.base.y);
	    }
	  }, {
	    key: "width",
	    get: function get() {
	      var base = this.base;
	      var target = this.target;
	      var result;

	      if (target.x !== AUTO_SIZE) {
	        result = target.x;
	      } else if (target.y !== AUTO_SIZE) {
	        result = Math.round(target.y * (base.x / base.y));
	      } else {
	        result = Math.round(base.x * this.s);
	      }

	      return result;
	    },
	    set: function set(value) {
	      this.target.x = value;
	      this.resizable.setSize(this.base.x, this.base.y);
	    }
	  }, {
	    key: "height",
	    get: function get() {
	      var base = this.base;
	      var target = this.target;
	      var result;

	      if (target.y !== AUTO_SIZE) {
	        result = target.y;
	      } else if (target.x !== AUTO_SIZE) {
	        result = Math.round(target.x / (base.x / base.y));
	      } else {
	        result = Math.round(base.y * this.s);
	      }

	      return result;
	    },
	    set: function set(value) {
	      this.target.y = value;
	      this.resizable.setSize(this.base.x, this.base.y);
	    }
	  }], [{
	    key: "AUTO_SIZE",
	    get: function get() {
	      return AUTO_SIZE;
	    }
	  }]);

	  return Resizer;
	}();

	var dummyCamera = new three.Camera();
	var geometry = null;

	function getFullscreenTriangle() {
	  if (geometry === null) {
	    var vertices = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]);
	    var uvs = new Float32Array([0, 0, 2, 0, 0, 2]);
	    geometry = new three.BufferGeometry();

	    if (geometry.setAttribute !== undefined) {
	      geometry.setAttribute("position", new three.BufferAttribute(vertices, 3));
	      geometry.setAttribute("uv", new three.BufferAttribute(uvs, 2));
	    } else {
	      geometry.addAttribute("position", new three.BufferAttribute(vertices, 3));
	      geometry.addAttribute("uv", new three.BufferAttribute(uvs, 2));
	    }
	  }

	  return geometry;
	}

	var Pass = function () {
	  function Pass() {
	    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Pass";
	    var scene = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new three.Scene();
	    var camera = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : dummyCamera;

	    _classCallCheck(this, Pass);

	    this.name = name;
	    this.scene = scene;
	    this.camera = camera;
	    this.screen = null;
	    this.rtt = true;
	    this.needsSwap = true;
	    this.needsDepthTexture = false;
	    this.enabled = true;
	  }

	  _createClass(Pass, [{
	    key: "getFullscreenMaterial",
	    value: function getFullscreenMaterial() {
	      return this.screen !== null ? this.screen.material : null;
	    }
	  }, {
	    key: "setFullscreenMaterial",
	    value: function setFullscreenMaterial(material) {
	      var screen = this.screen;

	      if (screen !== null) {
	        screen.material = material;
	      } else {
	        screen = new three.Mesh(getFullscreenTriangle(), material);
	        screen.frustumCulled = false;

	        if (this.scene === null) {
	          this.scene = new three.Scene();
	        }

	        this.scene.add(screen);
	        this.screen = screen;
	      }
	    }
	  }, {
	    key: "getDepthTexture",
	    value: function getDepthTexture() {
	      return null;
	    }
	  }, {
	    key: "setDepthTexture",
	    value: function setDepthTexture(depthTexture) {
	    }
	  }, {
	    key: "render",
	    value: function render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
	      throw new Error("Render method not implemented!");
	    }
	  }, {
	    key: "setSize",
	    value: function setSize(width, height) {}
	  }, {
	    key: "initialize",
	    value: function initialize(renderer, alpha, frameBufferType) {}
	  }, {
	    key: "dispose",
	    value: function dispose() {
	      var material = this.getFullscreenMaterial();

	      if (material !== null) {
	        material.dispose();
	      }

	      for (var _i = 0, _Object$keys = Object.keys(this); _i < _Object$keys.length; _i++) {
	        var key = _Object$keys[_i];
	        var property = this[key];

	        if (property !== null && typeof property.dispose === "function") {
	          if (property instanceof three.Scene) {
	            continue;
	          }

	          this[key].dispose();
	        }
	      }
	    }
	  }, {
	    key: "renderToScreen",
	    get: function get() {
	      return !this.rtt;
	    },
	    set: function set(value) {
	      if (this.rtt === value) {
	        var material = this.getFullscreenMaterial();

	        if (material !== null) {
	          material.needsUpdate = true;
	        }

	        this.rtt = !value;
	      }
	    }
	  }]);

	  return Pass;
	}();

	var BlurPass = function (_Pass) {
	  _inherits(BlurPass, _Pass);

	  var _super = _createSuper(BlurPass);

	  function BlurPass() {
	    var _this;

	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        _ref$resolutionScale = _ref.resolutionScale,
	        resolutionScale = _ref$resolutionScale === void 0 ? 0.5 : _ref$resolutionScale,
	        _ref$width = _ref.width,
	        width = _ref$width === void 0 ? Resizer.AUTO_SIZE : _ref$width,
	        _ref$height = _ref.height,
	        height = _ref$height === void 0 ? Resizer.AUTO_SIZE : _ref$height,
	        _ref$kernelSize = _ref.kernelSize,
	        kernelSize = _ref$kernelSize === void 0 ? KernelSize.LARGE : _ref$kernelSize;

	    _classCallCheck(this, BlurPass);

	    _this = _super.call(this, "BlurPass");
	    _this.renderTargetA = new three.WebGLRenderTarget(1, 1, {
	      minFilter: three.LinearFilter,
	      magFilter: three.LinearFilter,
	      stencilBuffer: false,
	      depthBuffer: false
	    });
	    _this.renderTargetA.texture.name = "Blur.Target.A";
	    _this.renderTargetB = _this.renderTargetA.clone();
	    _this.renderTargetB.texture.name = "Blur.Target.B";
	    _this.resolution = new Resizer(_assertThisInitialized(_this), width, height, resolutionScale);
	    _this.convolutionMaterial = new ConvolutionMaterial();
	    _this.ditheredConvolutionMaterial = new ConvolutionMaterial();
	    _this.ditheredConvolutionMaterial.dithering = true;
	    _this.dithering = false;
	    _this.kernelSize = kernelSize;
	    return _this;
	  }

	  _createClass(BlurPass, [{
	    key: "getResolutionScale",
	    value: function getResolutionScale() {
	      return this.resolution.scale;
	    }
	  }, {
	    key: "setResolutionScale",
	    value: function setResolutionScale(scale) {
	      this.resolution.scale = scale;
	    }
	  }, {
	    key: "render",
	    value: function render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
	      var scene = this.scene;
	      var camera = this.camera;
	      var renderTargetA = this.renderTargetA;
	      var renderTargetB = this.renderTargetB;
	      var material = this.convolutionMaterial;
	      var uniforms = material.uniforms;
	      var kernel = material.getKernel();
	      var lastRT = inputBuffer;
	      var destRT;
	      var i, l;
	      this.setFullscreenMaterial(material);

	      for (i = 0, l = kernel.length - 1; i < l; ++i) {
	        destRT = (i & 1) === 0 ? renderTargetA : renderTargetB;
	        uniforms.kernel.value = kernel[i];
	        uniforms.inputBuffer.value = lastRT.texture;
	        renderer.setRenderTarget(destRT);
	        renderer.render(scene, camera);
	        lastRT = destRT;
	      }

	      if (this.dithering) {
	        material = this.ditheredConvolutionMaterial;
	        uniforms = material.uniforms;
	        this.setFullscreenMaterial(material);
	      }

	      uniforms.kernel.value = kernel[i];
	      uniforms.inputBuffer.value = lastRT.texture;
	      renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
	      renderer.render(scene, camera);
	    }
	  }, {
	    key: "setSize",
	    value: function setSize(width, height) {
	      var resolution = this.resolution;
	      resolution.base.set(width, height);
	      var w = resolution.width;
	      var h = resolution.height;
	      this.renderTargetA.setSize(w, h);
	      this.renderTargetB.setSize(w, h);
	      this.convolutionMaterial.setTexelSize(1.0 / w, 1.0 / h);
	      this.ditheredConvolutionMaterial.setTexelSize(1.0 / w, 1.0 / h);
	    }
	  }, {
	    key: "initialize",
	    value: function initialize(renderer, alpha, frameBufferType) {
	      if (!alpha && frameBufferType === three.UnsignedByteType) {
	        this.renderTargetA.texture.format = three.RGBFormat;
	        this.renderTargetB.texture.format = three.RGBFormat;
	      }

	      if (frameBufferType !== undefined) {
	        this.renderTargetA.texture.type = frameBufferType;
	        this.renderTargetB.texture.type = frameBufferType;
	      }
	    }
	  }, {
	    key: "width",
	    get: function get() {
	      return this.resolution.width;
	    },
	    set: function set(value) {
	      this.resolution.width = value;
	    }
	  }, {
	    key: "height",
	    get: function get() {
	      return this.resolution.height;
	    },
	    set: function set(value) {
	      this.resolution.height = value;
	    }
	  }, {
	    key: "scale",
	    get: function get() {
	      return this.convolutionMaterial.uniforms.scale.value;
	    },
	    set: function set(value) {
	      this.convolutionMaterial.uniforms.scale.value = value;
	      this.ditheredConvolutionMaterial.uniforms.scale.value = value;
	    }
	  }, {
	    key: "kernelSize",
	    get: function get() {
	      return this.convolutionMaterial.kernelSize;
	    },
	    set: function set(value) {
	      this.convolutionMaterial.kernelSize = value;
	      this.ditheredConvolutionMaterial.kernelSize = value;
	    }
	  }], [{
	    key: "AUTO_SIZE",
	    get: function get() {
	      return Resizer.AUTO_SIZE;
	    }
	  }]);

	  return BlurPass;
	}(Pass);

	var ClearMaskPass = function (_Pass) {
	  _inherits(ClearMaskPass, _Pass);

	  var _super = _createSuper(ClearMaskPass);

	  function ClearMaskPass() {
	    var _this;

	    _classCallCheck(this, ClearMaskPass);

	    _this = _super.call(this, "ClearMaskPass", null, null);
	    _this.needsSwap = false;
	    return _this;
	  }

	  _createClass(ClearMaskPass, [{
	    key: "render",
	    value: function render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
	      var stencil = renderer.state.buffers.stencil;
	      stencil.setLocked(false);
	      stencil.setTest(false);
	    }
	  }]);

	  return ClearMaskPass;
	}(Pass);

	var color = new three.Color();
	var ClearPass = function (_Pass) {
	  _inherits(ClearPass, _Pass);

	  var _super = _createSuper(ClearPass);

	  function ClearPass() {
	    var _this;

	    var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	    var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    var stencil = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	    _classCallCheck(this, ClearPass);

	    _this = _super.call(this, "ClearPass", null, null);
	    _this.needsSwap = false;
	    _this.color = color;
	    _this.depth = depth;
	    _this.stencil = stencil;
	    _this.overrideClearColor = null;
	    _this.overrideClearAlpha = -1.0;
	    return _this;
	  }

	  _createClass(ClearPass, [{
	    key: "render",
	    value: function render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
	      var overrideClearColor = this.overrideClearColor;
	      var overrideClearAlpha = this.overrideClearAlpha;
	      var clearAlpha = renderer.getClearAlpha();
	      var hasOverrideClearColor = overrideClearColor !== null;
	      var hasOverrideClearAlpha = overrideClearAlpha >= 0.0;

	      if (hasOverrideClearColor) {
	        color.copy(renderer.getClearColor());
	        renderer.setClearColor(overrideClearColor, hasOverrideClearAlpha ? overrideClearAlpha : clearAlpha);
	      } else if (hasOverrideClearAlpha) {
	        renderer.setClearAlpha(overrideClearAlpha);
	      }

	      renderer.setRenderTarget(this.renderToScreen ? null : inputBuffer);
	      renderer.clear(this.color, this.depth, this.stencil);

	      if (hasOverrideClearColor) {
	        renderer.setClearColor(color, clearAlpha);
	      } else if (hasOverrideClearAlpha) {
	        renderer.setClearAlpha(clearAlpha);
	      }
	    }
	  }]);

	  return ClearPass;
	}(Pass);

	var workaroundEnabled = false;
	var OverrideMaterialManager = function () {
	  function OverrideMaterialManager() {
	    var material = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

	    _classCallCheck(this, OverrideMaterialManager);

	    this.originalMaterials = new Map();
	    this.material = null;
	    this.materialInstanced = null;
	    this.materialSkinning = null;
	    this.setMaterial(material);
	  }

	  _createClass(OverrideMaterialManager, [{
	    key: "setMaterial",
	    value: function setMaterial(material) {
	      this.disposeMaterials();

	      if (material !== null) {
	        this.material = material;
	        this.materialInstanced = material.clone();
	        this.materialInstanced.uniforms = Object.assign({}, material.uniforms);
	        this.materialSkinning = material.clone();
	        this.materialSkinning.uniforms = Object.assign({}, material.uniforms);
	        this.materialSkinning.skinning = true;
	      }
	    }
	  }, {
	    key: "render",
	    value: function render(renderer, scene, camera) {
	      var material = this.material;
	      var materialSkinning = this.materialSkinning;
	      var materialInstanced = this.materialInstanced;
	      var originalMaterials = this.originalMaterials;
	      var shadowMapEnabled = renderer.shadowMap.enabled;
	      renderer.shadowMap.enabled = false;

	      if (workaroundEnabled) {
	        var meshCount = 0;
	        scene.traverse(function (node) {
	          if (node.isMesh) {
	            originalMaterials.set(node, node.material);

	            if (node.isInstancedMesh) {
	              node.material = materialInstanced;
	            } else if (node.isSkinnedMesh) {
	              node.material = materialSkinning;
	            } else {
	              node.material = material;
	            }

	            ++meshCount;
	          }
	        });
	        renderer.render(scene, camera);

	        var _iterator = _createForOfIteratorHelper(originalMaterials),
	            _step;

	        try {
	          for (_iterator.s(); !(_step = _iterator.n()).done;) {
	            var entry = _step.value;
	            entry[0].material = entry[1];
	          }
	        } catch (err) {
	          _iterator.e(err);
	        } finally {
	          _iterator.f();
	        }

	        if (meshCount !== originalMaterials.size) {
	          originalMaterials.clear();
	        }
	      } else {
	        var overrideMaterial = scene.overrideMaterial;
	        scene.overrideMaterial = material;
	        renderer.render(scene, camera);
	        scene.overrideMaterial = overrideMaterial;
	      }

	      renderer.shadowMap.enabled = shadowMapEnabled;
	    }
	  }, {
	    key: "disposeMaterials",
	    value: function disposeMaterials() {
	      if (this.materialInstanced !== null) {
	        this.materialInstanced.dispose();
	      }

	      if (this.materialSkinning !== null) {
	        this.materialSkinning.dispose();
	      }
	    }
	  }, {
	    key: "dispose",
	    value: function dispose() {
	      this.originalMaterials.clear();
	      this.disposeMaterials();
	    }
	  }], [{
	    key: "workaroundEnabled",
	    get: function get() {
	      return workaroundEnabled;
	    },
	    set: function set(value) {
	      workaroundEnabled = value;
	    }
	  }]);

	  return OverrideMaterialManager;
	}();

	var RenderPass = function (_Pass) {
	  _inherits(RenderPass, _Pass);

	  var _super = _createSuper(RenderPass);

	  function RenderPass(scene, camera) {
	    var _this;

	    var overrideMaterial = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	    _classCallCheck(this, RenderPass);

	    _this = _super.call(this, "RenderPass", scene, camera);
	    _this.needsSwap = false;
	    _this.clearPass = new ClearPass();
	    _this.overrideMaterialManager = overrideMaterial === null ? null : new OverrideMaterialManager(overrideMaterial);
	    return _this;
	  }

	  _createClass(RenderPass, [{
	    key: "getClearPass",
	    value: function getClearPass() {
	      return this.clearPass;
	    }
	  }, {
	    key: "render",
	    value: function render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
	      var scene = this.scene;
	      var camera = this.camera;
	      var background = scene.background;
	      var renderTarget = this.renderToScreen ? null : inputBuffer;

	      if (this.clear) {
	        if (this.clearPass.overrideClearColor !== null) {
	          scene.background = null;
	        }

	        this.clearPass.render(renderer, inputBuffer);
	      }

	      renderer.setRenderTarget(renderTarget);

	      if (this.overrideMaterialManager !== null) {
	        this.overrideMaterialManager.render(renderer, scene, camera);
	      } else {
	        renderer.render(scene, camera);
	      }

	      if (scene.background !== background) {
	        scene.background = background;
	      }
	    }
	  }, {
	    key: "renderToScreen",
	    get: function get() {
	      return _get(_getPrototypeOf(RenderPass.prototype), "renderToScreen", this);
	    },
	    set: function set(value) {
	      _set(_getPrototypeOf(RenderPass.prototype), "renderToScreen", value, this, true);

	      this.clearPass.renderToScreen = value;
	    }
	  }, {
	    key: "overrideMaterial",
	    get: function get() {
	      var manager = this.overrideMaterialManager;
	      return manager !== null ? manager.material : null;
	    },
	    set: function set(value) {
	      var manager = this.overrideMaterialManager;

	      if (value !== null) {
	        if (manager !== null) {
	          manager.setMaterial(value);
	        } else {
	          this.overrideMaterialManager = new OverrideMaterialManager(value);
	        }
	      } else if (manager !== null) {
	        manager.dispose();
	        this.overrideMaterialManager = null;
	      }
	    }
	  }, {
	    key: "clear",
	    get: function get() {
	      return this.clearPass.enabled;
	    },
	    set: function set(value) {
	      this.clearPass.enabled = value;
	    }
	  }]);

	  return RenderPass;
	}(Pass);

	var DepthPass = function (_Pass) {
	  _inherits(DepthPass, _Pass);

	  var _super = _createSuper(DepthPass);

	  function DepthPass(scene, camera) {
	    var _this;

	    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	        _ref$resolutionScale = _ref.resolutionScale,
	        resolutionScale = _ref$resolutionScale === void 0 ? 1.0 : _ref$resolutionScale,
	        _ref$width = _ref.width,
	        width = _ref$width === void 0 ? Resizer.AUTO_SIZE : _ref$width,
	        _ref$height = _ref.height,
	        height = _ref$height === void 0 ? Resizer.AUTO_SIZE : _ref$height,
	        renderTarget = _ref.renderTarget;

	    _classCallCheck(this, DepthPass);

	    _this = _super.call(this, "DepthPass");
	    _this.needsSwap = false;
	    _this.renderPass = new RenderPass(scene, camera, new three.MeshDepthMaterial({
	      depthPacking: three.RGBADepthPacking
	    }));

	    var clearPass = _this.renderPass.getClearPass();

	    clearPass.overrideClearColor = new three.Color(0xffffff);
	    clearPass.overrideClearAlpha = 1.0;
	    _this.renderTarget = renderTarget;

	    if (_this.renderTarget === undefined) {
	      _this.renderTarget = new three.WebGLRenderTarget(1, 1, {
	        minFilter: three.NearestFilter,
	        magFilter: three.NearestFilter,
	        stencilBuffer: false
	      });
	      _this.renderTarget.texture.name = "DepthPass.Target";
	    }

	    _this.resolution = new Resizer(_assertThisInitialized(_this), width, height, resolutionScale);
	    return _this;
	  }

	  _createClass(DepthPass, [{
	    key: "getResolutionScale",
	    value: function getResolutionScale() {
	      return this.resolutionScale;
	    }
	  }, {
	    key: "setResolutionScale",
	    value: function setResolutionScale(scale) {
	      this.resolutionScale = scale;
	      this.setSize(this.resolution.base.x, this.resolution.base.y);
	    }
	  }, {
	    key: "render",
	    value: function render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
	      var renderTarget = this.renderToScreen ? null : this.renderTarget;
	      this.renderPass.render(renderer, renderTarget);
	    }
	  }, {
	    key: "setSize",
	    value: function setSize(width, height) {
	      var resolution = this.resolution;
	      resolution.base.set(width, height);
	      this.renderTarget.setSize(resolution.width, resolution.height);
	    }
	  }, {
	    key: "texture",
	    get: function get() {
	      return this.renderTarget.texture;
	    }
	  }]);

	  return DepthPass;
	}(Pass);

	var DepthDownsamplingPass = function (_Pass) {
	  _inherits(DepthDownsamplingPass, _Pass);

	  var _super = _createSuper(DepthDownsamplingPass);

	  function DepthDownsamplingPass() {
	    var _this;

	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        _ref$normalBuffer = _ref.normalBuffer,
	        normalBuffer = _ref$normalBuffer === void 0 ? null : _ref$normalBuffer,
	        _ref$resolutionScale = _ref.resolutionScale,
	        resolutionScale = _ref$resolutionScale === void 0 ? 0.5 : _ref$resolutionScale,
	        _ref$width = _ref.width,
	        width = _ref$width === void 0 ? Resizer.AUTO_SIZE : _ref$width,
	        _ref$height = _ref.height,
	        height = _ref$height === void 0 ? Resizer.AUTO_SIZE : _ref$height;

	    _classCallCheck(this, DepthDownsamplingPass);

	    _this = _super.call(this, "DepthDownsamplingPass");

	    _this.setFullscreenMaterial(new DepthDownsamplingMaterial());

	    _this.needsDepthTexture = true;
	    _this.needsSwap = false;

	    if (normalBuffer !== null) {
	      var material = _this.getFullscreenMaterial();

	      material.uniforms.normalBuffer.value = normalBuffer;
	      material.defines.DOWNSAMPLE_NORMALS = "1";
	    }

	    _this.renderTarget = new three.WebGLRenderTarget(1, 1, {
	      minFilter: three.NearestFilter,
	      magFilter: three.NearestFilter,
	      stencilBuffer: false,
	      depthBuffer: false,
	      type: three.FloatType
	    });
	    _this.renderTarget.texture.name = "DepthDownsamplingPass.Target";
	    _this.renderTarget.texture.generateMipmaps = false;
	    _this.resolution = new Resizer(_assertThisInitialized(_this), width, height);
	    _this.resolution.scale = resolutionScale;
	    return _this;
	  }

	  _createClass(DepthDownsamplingPass, [{
	    key: "setDepthTexture",
	    value: function setDepthTexture(depthTexture) {
	      var depthPacking = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	      var material = this.getFullscreenMaterial();
	      material.uniforms.depthBuffer.value = depthTexture;
	      material.depthPacking = depthPacking;
	    }
	  }, {
	    key: "render",
	    value: function render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
	      renderer.setRenderTarget(this.renderToScreen ? null : this.renderTarget);
	      renderer.render(this.scene, this.camera);
	    }
	  }, {
	    key: "setSize",
	    value: function setSize(width, height) {
	      var resolution = this.resolution;
	      resolution.base.set(width, height);
	      this.getFullscreenMaterial().setTexelSize(1.0 / width, 1.0 / height);
	      this.renderTarget.setSize(resolution.width, resolution.height);
	    }
	  }, {
	    key: "initialize",
	    value: function initialize(renderer, alpha, frameBufferType) {
	      if (!renderer.capabilities.isWebGL2) {
	        console.error("The DepthDownsamplingPass requires WebGL 2");
	      }
	    }
	  }, {
	    key: "texture",
	    get: function get() {
	      return this.renderTarget.texture;
	    }
	  }]);

	  return DepthDownsamplingPass;
	}(Pass);

	var BlendFunction = {
	  SKIP: 0,
	  ADD: 1,
	  ALPHA: 2,
	  AVERAGE: 3,
	  COLOR_BURN: 4,
	  COLOR_DODGE: 5,
	  DARKEN: 6,
	  DIFFERENCE: 7,
	  EXCLUSION: 8,
	  LIGHTEN: 9,
	  MULTIPLY: 10,
	  DIVIDE: 11,
	  NEGATION: 12,
	  NORMAL: 13,
	  OVERLAY: 14,
	  REFLECT: 15,
	  SCREEN: 16,
	  SOFT_LIGHT: 17,
	  SUBTRACT: 18
	};

	var addBlendFunction = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return min(x+y,1.0)*opacity+x*(1.0-opacity);}";

	var alphaBlendFunction = "vec3 blend(const in vec3 x,const in vec3 y,const in float opacity){return y*opacity+x*(1.0-opacity);}vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){float a=min(y.a,opacity);return vec4(blend(x.rgb,y.rgb,a),max(x.a,a));}";

	var averageBlendFunction = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return(x+y)*0.5*opacity+x*(1.0-opacity);}";

	var colorBurnBlendFunction = "float blend(const in float x,const in float y){return(y==0.0)? y : max(1.0-(1.0-x)/y,0.0);}vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=vec4(blend(x.r,y.r),blend(x.g,y.g),blend(x.b,y.b),blend(x.a,y.a));return z*opacity+x*(1.0-opacity);}";

	var colorDodgeBlendFunction = "float blend(const in float x,const in float y){return(y==1.0)? y : min(x/(1.0-y),1.0);}vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=vec4(blend(x.r,y.r),blend(x.g,y.g),blend(x.b,y.b),blend(x.a,y.a));return z*opacity+x*(1.0-opacity);}";

	var darkenBlendFunction = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return min(x,y)*opacity+x*(1.0-opacity);}";

	var differenceBlendFunction = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return abs(x-y)*opacity+x*(1.0-opacity);}";

	var exclusionBlendFunction = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return(x+y-2.0*x*y)*opacity+x*(1.0-opacity);}";

	var lightenBlendFunction = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return max(x,y)*opacity+x*(1.0-opacity);}";

	var multiplyBlendFunction = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return x*y*opacity+x*(1.0-opacity);}";

	var divideBlendFunction = "float blend(const in float x,const in float y){return(y>0.0)? min(x/y,1.0): 1.0;}vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=vec4(blend(x.r,y.r),blend(x.g,y.g),blend(x.b,y.b),blend(x.a,y.a));return z*opacity+x*(1.0-opacity);}";

	var negationBlendFunction = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return(1.0-abs(1.0-x-y))*opacity+x*(1.0-opacity);}";

	var normalBlendFunction = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return y*opacity+x*(1.0-opacity);}";

	var overlayBlendFunction = "float blend(const in float x,const in float y){return(x<0.5)?(2.0*x*y):(1.0-2.0*(1.0-x)*(1.0-y));}vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=vec4(blend(x.r,y.r),blend(x.g,y.g),blend(x.b,y.b),blend(x.a,y.a));return z*opacity+x*(1.0-opacity);}";

	var reflectBlendFunction = "float blend(const in float x,const in float y){return(y==1.0)? y : min(x*x/(1.0-y),1.0);}vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=vec4(blend(x.r,y.r),blend(x.g,y.g),blend(x.b,y.b),blend(x.a,y.a));return z*opacity+x*(1.0-opacity);}";

	var screenBlendFunction = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return(1.0-(1.0-x)*(1.0-y))*opacity+x*(1.0-opacity);}";

	var softLightBlendFunction = "float blend(const in float x,const in float y){return(y<0.5)?(2.0*x*y+x*x*(1.0-2.0*y)):(sqrt(x)*(2.0*y-1.0)+2.0*x*(1.0-y));}vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=vec4(blend(x.r,y.r),blend(x.g,y.g),blend(x.b,y.b),blend(x.a,y.a));return z*opacity+x*(1.0-opacity);}";

	var subtractBlendFunction = "vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return max(x+y-1.0,0.0)*opacity+x*(1.0-opacity);}";

	var blendFunctions = new Map([[BlendFunction.SKIP, null], [BlendFunction.ADD, addBlendFunction], [BlendFunction.ALPHA, alphaBlendFunction], [BlendFunction.AVERAGE, averageBlendFunction], [BlendFunction.COLOR_BURN, colorBurnBlendFunction], [BlendFunction.COLOR_DODGE, colorDodgeBlendFunction], [BlendFunction.DARKEN, darkenBlendFunction], [BlendFunction.DIFFERENCE, differenceBlendFunction], [BlendFunction.EXCLUSION, exclusionBlendFunction], [BlendFunction.LIGHTEN, lightenBlendFunction], [BlendFunction.MULTIPLY, multiplyBlendFunction], [BlendFunction.DIVIDE, divideBlendFunction], [BlendFunction.NEGATION, negationBlendFunction], [BlendFunction.NORMAL, normalBlendFunction], [BlendFunction.OVERLAY, overlayBlendFunction], [BlendFunction.REFLECT, reflectBlendFunction], [BlendFunction.SCREEN, screenBlendFunction], [BlendFunction.SOFT_LIGHT, softLightBlendFunction], [BlendFunction.SUBTRACT, subtractBlendFunction]]);
	var BlendMode = function (_EventDispatcher) {
	  _inherits(BlendMode, _EventDispatcher);

	  var _super = _createSuper(BlendMode);

	  function BlendMode(blendFunction) {
	    var _this;

	    var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;

	    _classCallCheck(this, BlendMode);

	    _this = _super.call(this);
	    _this.blendFunction = blendFunction;
	    _this.opacity = new three.Uniform(opacity);
	    return _this;
	  }

	  _createClass(BlendMode, [{
	    key: "getBlendFunction",
	    value: function getBlendFunction() {
	      return this.blendFunction;
	    }
	  }, {
	    key: "setBlendFunction",
	    value: function setBlendFunction(blendFunction) {
	      this.blendFunction = blendFunction;
	      this.dispatchEvent({
	        type: "change"
	      });
	    }
	  }, {
	    key: "getShaderCode",
	    value: function getShaderCode() {
	      return blendFunctions.get(this.blendFunction);
	    }
	  }]);

	  return BlendMode;
	}(three.EventDispatcher);

	var Effect = function (_EventDispatcher) {
	  _inherits(Effect, _EventDispatcher);

	  var _super = _createSuper(Effect);

	  function Effect(name, fragmentShader) {
	    var _this;

	    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	        _ref$attributes = _ref.attributes,
	        attributes = _ref$attributes === void 0 ? EffectAttribute.NONE : _ref$attributes,
	        _ref$blendFunction = _ref.blendFunction,
	        blendFunction = _ref$blendFunction === void 0 ? BlendFunction.SCREEN : _ref$blendFunction,
	        _ref$defines = _ref.defines,
	        defines = _ref$defines === void 0 ? new Map() : _ref$defines,
	        _ref$uniforms = _ref.uniforms,
	        uniforms = _ref$uniforms === void 0 ? new Map() : _ref$uniforms,
	        _ref$extensions = _ref.extensions,
	        extensions = _ref$extensions === void 0 ? null : _ref$extensions,
	        _ref$vertexShader = _ref.vertexShader,
	        vertexShader = _ref$vertexShader === void 0 ? null : _ref$vertexShader;

	    _classCallCheck(this, Effect);

	    _this = _super.call(this);
	    _this.name = name;
	    _this.attributes = attributes;
	    _this.fragmentShader = fragmentShader;
	    _this.vertexShader = vertexShader;
	    _this.defines = defines;
	    _this.uniforms = uniforms;
	    _this.extensions = extensions;
	    _this.blendMode = new BlendMode(blendFunction);

	    _this.blendMode.addEventListener("change", function (event) {
	      return _this.setChanged();
	    });

	    return _this;
	  }

	  _createClass(Effect, [{
	    key: "setChanged",
	    value: function setChanged() {
	      this.dispatchEvent({
	        type: "change"
	      });
	    }
	  }, {
	    key: "getAttributes",
	    value: function getAttributes() {
	      return this.attributes;
	    }
	  }, {
	    key: "setAttributes",
	    value: function setAttributes(attributes) {
	      this.attributes = attributes;
	      this.setChanged();
	    }
	  }, {
	    key: "getFragmentShader",
	    value: function getFragmentShader() {
	      return this.fragmentShader;
	    }
	  }, {
	    key: "setFragmentShader",
	    value: function setFragmentShader(fragmentShader) {
	      this.fragmentShader = fragmentShader;
	      this.setChanged();
	    }
	  }, {
	    key: "getVertexShader",
	    value: function getVertexShader() {
	      return this.vertexShader;
	    }
	  }, {
	    key: "setVertexShader",
	    value: function setVertexShader(vertexShader) {
	      this.vertexShader = vertexShader;
	      this.setChanged();
	    }
	  }, {
	    key: "setDepthTexture",
	    value: function setDepthTexture(depthTexture) {
	    }
	  }, {
	    key: "update",
	    value: function update(renderer, inputBuffer, deltaTime) {}
	  }, {
	    key: "setSize",
	    value: function setSize(width, height) {}
	  }, {
	    key: "initialize",
	    value: function initialize(renderer, alpha, frameBufferType) {}
	  }, {
	    key: "dispose",
	    value: function dispose() {
	      for (var _i = 0, _Object$keys = Object.keys(this); _i < _Object$keys.length; _i++) {
	        var key = _Object$keys[_i];
	        var property = this[key];

	        if (property !== null && typeof property.dispose === "function") {
	          if (property instanceof three.Scene) {
	            continue;
	          }

	          this[key].dispose();
	        }
	      }
	    }
	  }]);

	  return Effect;
	}(three.EventDispatcher);
	var EffectAttribute = {
	  NONE: 0,
	  DEPTH: 1,
	  CONVOLUTION: 2
	};

	function findSubstrings(regExp, string) {
	  var substrings = [];
	  var result;

	  while ((result = regExp.exec(string)) !== null) {
	    substrings.push(result[1]);
	  }

	  return substrings;
	}

	function prefixSubstrings(prefix, substrings, strings) {
	  var prefixed, regExp;

	  var _iterator = _createForOfIteratorHelper(substrings),
	      _step;

	  try {
	    for (_iterator.s(); !(_step = _iterator.n()).done;) {
	      var substring = _step.value;
	      prefixed = "$1" + prefix + substring.charAt(0).toUpperCase() + substring.slice(1);
	      regExp = new RegExp("([^\\.])(\\b" + substring + "\\b)", "g");

	      var _iterator2 = _createForOfIteratorHelper(strings.entries()),
	          _step2;

	      try {
	        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	          var entry = _step2.value;

	          if (entry[1] !== null) {
	            strings.set(entry[0], entry[1].replace(regExp, prefixed));
	          }
	        }
	      } catch (err) {
	        _iterator2.e(err);
	      } finally {
	        _iterator2.f();
	      }
	    }
	  } catch (err) {
	    _iterator.e(err);
	  } finally {
	    _iterator.f();
	  }
	}

	function integrateEffect(prefix, effect, shaderParts, blendModes, defines, uniforms, attributes) {
	  var functionRegExp = /(?:\w+\s+(\w+)\([\w\s,]*\)\s*{[^}]+})/g;
	  var varyingRegExp = /(?:varying\s+\w+\s+(\w*))/g;
	  var blendMode = effect.blendMode;
	  var shaders = new Map([["fragment", effect.getFragmentShader()], ["vertex", effect.getVertexShader()]]);
	  var mainImageExists = shaders.get("fragment") !== undefined && shaders.get("fragment").indexOf("mainImage") >= 0;
	  var mainUvExists = shaders.get("fragment") !== undefined && shaders.get("fragment").indexOf("mainUv") >= 0;
	  var varyings = [],
	      names = [];
	  var transformedUv = false;
	  var readDepth = false;

	  if (shaders.get("fragment") === undefined) {
	    console.error("Missing fragment shader", effect);
	  } else if (mainUvExists && (attributes & EffectAttribute.CONVOLUTION) !== 0) {
	    console.error("Effects that transform UV coordinates are incompatible with convolution effects", effect);
	  } else if (!mainImageExists && !mainUvExists) {
	    console.error("The fragment shader contains neither a mainImage nor a mainUv function", effect);
	  } else {
	    if (mainUvExists) {
	      shaderParts.set(Section.FRAGMENT_MAIN_UV, shaderParts.get(Section.FRAGMENT_MAIN_UV) + "\t" + prefix + "MainUv(UV);\n");
	      transformedUv = true;
	    }

	    if (shaders.get("vertex") !== null && shaders.get("vertex").indexOf("mainSupport") >= 0) {
	      var string = "\t" + prefix + "MainSupport(";

	      if (shaders.get("vertex").indexOf("uv") >= 0) {
	        string += "vUv";
	      }

	      string += ");\n";
	      shaderParts.set(Section.VERTEX_MAIN_SUPPORT, shaderParts.get(Section.VERTEX_MAIN_SUPPORT) + string);
	      varyings = varyings.concat(findSubstrings(varyingRegExp, shaders.get("vertex")));
	      names = names.concat(varyings).concat(findSubstrings(functionRegExp, shaders.get("vertex")));
	    }

	    names = names.concat(findSubstrings(functionRegExp, shaders.get("fragment"))).concat(Array.from(effect.defines.keys()).map(function (s) {
	      return s.replace(/\([\w\s,]*\)/g, "");
	    })).concat(Array.from(effect.uniforms.keys()));
	    effect.uniforms.forEach(function (value, key) {
	      return uniforms.set(prefix + key.charAt(0).toUpperCase() + key.slice(1), value);
	    });
	    effect.defines.forEach(function (value, key) {
	      return defines.set(prefix + key.charAt(0).toUpperCase() + key.slice(1), value);
	    });
	    prefixSubstrings(prefix, names, defines);
	    prefixSubstrings(prefix, names, shaders);
	    blendModes.set(blendMode.blendFunction, blendMode);

	    if (mainImageExists) {
	      var _string = prefix + "MainImage(color0, UV, ";

	      if ((attributes & EffectAttribute.DEPTH) !== 0 && shaders.get("fragment").indexOf("depth") >= 0) {
	        _string += "depth, ";
	        readDepth = true;
	      }

	      _string += "color1);\n\t";
	      var blendOpacity = prefix + "BlendOpacity";
	      uniforms.set(blendOpacity, blendMode.opacity);
	      _string += "color0 = blend" + blendMode.getBlendFunction() + "(color0, color1, " + blendOpacity + ");\n\n\t";
	      shaderParts.set(Section.FRAGMENT_MAIN_IMAGE, shaderParts.get(Section.FRAGMENT_MAIN_IMAGE) + _string);
	      shaderParts.set(Section.FRAGMENT_HEAD, shaderParts.get(Section.FRAGMENT_HEAD) + "uniform float " + blendOpacity + ";\n\n");
	    }

	    shaderParts.set(Section.FRAGMENT_HEAD, shaderParts.get(Section.FRAGMENT_HEAD) + shaders.get("fragment") + "\n");

	    if (shaders.get("vertex") !== null) {
	      shaderParts.set(Section.VERTEX_HEAD, shaderParts.get(Section.VERTEX_HEAD) + shaders.get("vertex") + "\n");
	    }
	  }

	  return {
	    varyings: varyings,
	    transformedUv: transformedUv,
	    readDepth: readDepth
	  };
	}

	var EffectPass = function (_Pass) {
	  _inherits(EffectPass, _Pass);

	  var _super = _createSuper(EffectPass);

	  function EffectPass(camera) {
	    var _this;

	    _classCallCheck(this, EffectPass);

	    _this = _super.call(this, "EffectPass");

	    _this.setFullscreenMaterial(new EffectMaterial(null, null, null, camera));

	    for (var _len = arguments.length, effects = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      effects[_key - 1] = arguments[_key];
	    }

	    _this.effects = effects.sort(function (a, b) {
	      return b.attributes - a.attributes;
	    });
	    _this.skipRendering = false;
	    _this.uniforms = 0;
	    _this.varyings = 0;
	    _this.minTime = 1.0;
	    _this.maxTime = Number.POSITIVE_INFINITY;
	    return _this;
	  }

	  _createClass(EffectPass, [{
	    key: "verifyResources",
	    value: function verifyResources(renderer) {
	      var capabilities = renderer.capabilities;
	      var max = Math.min(capabilities.maxFragmentUniforms, capabilities.maxVertexUniforms);

	      if (this.uniforms > max) {
	        console.warn("The current rendering context doesn't support more than " + max + " uniforms, but " + this.uniforms + " were defined");
	      }

	      max = capabilities.maxVaryings;

	      if (this.varyings > max) {
	        console.warn("The current rendering context doesn't support more than " + max + " varyings, but " + this.varyings + " were defined");
	      }
	    }
	  }, {
	    key: "updateMaterial",
	    value: function updateMaterial() {
	      var blendRegExp = /\bblend\b/g;
	      var shaderParts = new Map([[Section.FRAGMENT_HEAD, ""], [Section.FRAGMENT_MAIN_UV, ""], [Section.FRAGMENT_MAIN_IMAGE, ""], [Section.VERTEX_HEAD, ""], [Section.VERTEX_MAIN_SUPPORT, ""]]);
	      var blendModes = new Map();
	      var defines = new Map();
	      var uniforms = new Map();
	      var extensions = new Set();
	      var id = 0,
	          varyings = 0,
	          attributes = 0;
	      var transformedUv = false;
	      var readDepth = false;
	      var result;

	      var _iterator3 = _createForOfIteratorHelper(this.effects),
	          _step3;

	      try {
	        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
	          var effect = _step3.value;

	          if (effect.blendMode.getBlendFunction() === BlendFunction.SKIP) {
	            attributes |= effect.getAttributes() & EffectAttribute.DEPTH;
	          } else if ((attributes & EffectAttribute.CONVOLUTION) !== 0 && (effect.getAttributes() & EffectAttribute.CONVOLUTION) !== 0) {
	            console.error("Convolution effects cannot be merged", effect);
	          } else {
	            attributes |= effect.getAttributes();
	            result = integrateEffect("e" + id++, effect, shaderParts, blendModes, defines, uniforms, attributes);
	            varyings += result.varyings.length;
	            transformedUv = transformedUv || result.transformedUv;
	            readDepth = readDepth || result.readDepth;

	            if (effect.extensions !== null) {
	              var _iterator6 = _createForOfIteratorHelper(effect.extensions),
	                  _step6;

	              try {
	                for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
	                  var _extension = _step6.value;
	                  extensions.add(_extension);
	                }
	              } catch (err) {
	                _iterator6.e(err);
	              } finally {
	                _iterator6.f();
	              }
	            }
	          }
	        }
	      } catch (err) {
	        _iterator3.e(err);
	      } finally {
	        _iterator3.f();
	      }

	      var _iterator4 = _createForOfIteratorHelper(blendModes.values()),
	          _step4;

	      try {
	        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
	          var blendMode = _step4.value;
	          shaderParts.set(Section.FRAGMENT_HEAD, shaderParts.get(Section.FRAGMENT_HEAD) + blendMode.getShaderCode().replace(blendRegExp, "blend" + blendMode.getBlendFunction()) + "\n");
	        }
	      } catch (err) {
	        _iterator4.e(err);
	      } finally {
	        _iterator4.f();
	      }

	      if ((attributes & EffectAttribute.DEPTH) !== 0) {
	        if (readDepth) {
	          shaderParts.set(Section.FRAGMENT_MAIN_IMAGE, "float depth = readDepth(UV);\n\n\t" + shaderParts.get(Section.FRAGMENT_MAIN_IMAGE));
	        }

	        this.needsDepthTexture = this.getDepthTexture() === null;
	      } else {
	        this.needsDepthTexture = false;
	      }

	      if (transformedUv) {
	        shaderParts.set(Section.FRAGMENT_MAIN_UV, "vec2 transformedUv = vUv;\n" + shaderParts.get(Section.FRAGMENT_MAIN_UV));
	        defines.set("UV", "transformedUv");
	      } else {
	        defines.set("UV", "vUv");
	      }

	      shaderParts.forEach(function (value, key, map) {
	        return map.set(key, value.trim().replace(/^#/, "\n#"));
	      });
	      this.uniforms = uniforms.size;
	      this.varyings = varyings;
	      this.skipRendering = id === 0;
	      this.needsSwap = !this.skipRendering;
	      var material = this.getFullscreenMaterial();
	      material.setShaderParts(shaderParts).setDefines(defines).setUniforms(uniforms);
	      material.extensions = {};

	      if (extensions.size > 0) {
	        var _iterator5 = _createForOfIteratorHelper(extensions),
	            _step5;

	        try {
	          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
	            var extension = _step5.value;
	            material.extensions[extension] = true;
	          }
	        } catch (err) {
	          _iterator5.e(err);
	        } finally {
	          _iterator5.f();
	        }
	      }

	      this.needsUpdate = false;
	    }
	  }, {
	    key: "recompile",
	    value: function recompile(renderer) {
	      this.updateMaterial();

	      if (renderer !== undefined) {
	        this.verifyResources(renderer);
	      }
	    }
	  }, {
	    key: "getDepthTexture",
	    value: function getDepthTexture() {
	      return this.getFullscreenMaterial().uniforms.depthBuffer.value;
	    }
	  }, {
	    key: "setDepthTexture",
	    value: function setDepthTexture(depthTexture) {
	      var depthPacking = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	      var material = this.getFullscreenMaterial();
	      material.uniforms.depthBuffer.value = depthTexture;
	      material.depthPacking = depthPacking;
	      material.needsUpdate = true;

	      var _iterator7 = _createForOfIteratorHelper(this.effects),
	          _step7;

	      try {
	        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
	          var effect = _step7.value;
	          effect.setDepthTexture(depthTexture, depthPacking);
	        }
	      } catch (err) {
	        _iterator7.e(err);
	      } finally {
	        _iterator7.f();
	      }
	    }
	  }, {
	    key: "render",
	    value: function render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
	      var material = this.getFullscreenMaterial();
	      var time = material.uniforms.time.value + deltaTime;

	      if (this.needsUpdate) {
	        this.recompile(renderer);
	      }

	      var _iterator8 = _createForOfIteratorHelper(this.effects),
	          _step8;

	      try {
	        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
	          var effect = _step8.value;
	          effect.update(renderer, inputBuffer, deltaTime);
	        }
	      } catch (err) {
	        _iterator8.e(err);
	      } finally {
	        _iterator8.f();
	      }

	      if (!this.skipRendering || this.renderToScreen) {
	        material.uniforms.inputBuffer.value = inputBuffer.texture;
	        material.uniforms.time.value = time <= this.maxTime ? time : this.minTime;
	        renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
	        renderer.render(this.scene, this.camera);
	      }
	    }
	  }, {
	    key: "setSize",
	    value: function setSize(width, height) {
	      this.getFullscreenMaterial().setSize(width, height);

	      var _iterator9 = _createForOfIteratorHelper(this.effects),
	          _step9;

	      try {
	        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
	          var effect = _step9.value;
	          effect.setSize(width, height);
	        }
	      } catch (err) {
	        _iterator9.e(err);
	      } finally {
	        _iterator9.f();
	      }
	    }
	  }, {
	    key: "initialize",
	    value: function initialize(renderer, alpha, frameBufferType) {
	      var _this2 = this;

	      this.capabilities = renderer.capabilities;

	      var _iterator10 = _createForOfIteratorHelper(this.effects),
	          _step10;

	      try {
	        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
	          var effect = _step10.value;
	          effect.initialize(renderer, alpha, frameBufferType);
	          effect.addEventListener("change", function (event) {
	            return _this2.handleEvent(event);
	          });
	        }
	      } catch (err) {
	        _iterator10.e(err);
	      } finally {
	        _iterator10.f();
	      }

	      this.updateMaterial();
	      this.verifyResources(renderer);
	    }
	  }, {
	    key: "dispose",
	    value: function dispose() {
	      _get(_getPrototypeOf(EffectPass.prototype), "dispose", this).call(this);

	      var _iterator11 = _createForOfIteratorHelper(this.effects),
	          _step11;

	      try {
	        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
	          var effect = _step11.value;
	          effect.dispose();
	        }
	      } catch (err) {
	        _iterator11.e(err);
	      } finally {
	        _iterator11.f();
	      }
	    }
	  }, {
	    key: "handleEvent",
	    value: function handleEvent(event) {
	      switch (event.type) {
	        case "change":
	          this.needsUpdate = true;
	          break;
	      }
	    }
	  }, {
	    key: "encodeOutput",
	    get: function get() {
	      return this.getFullscreenMaterial().defines.ENCODE_OUTPUT !== undefined;
	    },
	    set: function set(value) {
	      if (this.encodeOutput !== value) {
	        var material = this.getFullscreenMaterial();
	        material.needsUpdate = true;

	        if (value) {
	          material.defines.ENCODE_OUTPUT = "1";
	        } else {
	          delete material.defines.ENCODE_OUTPUT;
	        }
	      }
	    }
	  }, {
	    key: "dithering",
	    get: function get() {
	      return this.getFullscreenMaterial().dithering;
	    },
	    set: function set(value) {
	      var material = this.getFullscreenMaterial();

	      if (material.dithering !== value) {
	        material.dithering = value;
	        material.needsUpdate = true;
	      }
	    }
	  }]);

	  return EffectPass;
	}(Pass);

	var LambdaPass = function (_Pass) {
	  _inherits(LambdaPass, _Pass);

	  var _super = _createSuper(LambdaPass);

	  function LambdaPass(f) {
	    var _this;

	    _classCallCheck(this, LambdaPass);

	    _this = _super.call(this, "LambdaPass", null, null);
	    _this.needsSwap = false;
	    _this.f = f;
	    return _this;
	  }

	  _createClass(LambdaPass, [{
	    key: "render",
	    value: function render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
	      this.f();
	    }
	  }]);

	  return LambdaPass;
	}(Pass);

	var MaskPass = function (_Pass) {
	  _inherits(MaskPass, _Pass);

	  var _super = _createSuper(MaskPass);

	  function MaskPass(scene, camera) {
	    var _this;

	    _classCallCheck(this, MaskPass);

	    _this = _super.call(this, "MaskPass", scene, camera);
	    _this.needsSwap = false;
	    _this.clearPass = new ClearPass(false, false, true);
	    _this.inverse = false;
	    return _this;
	  }

	  _createClass(MaskPass, [{
	    key: "render",
	    value: function render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
	      var context = renderer.getContext();
	      var buffers = renderer.state.buffers;
	      var scene = this.scene;
	      var camera = this.camera;
	      var clearPass = this.clearPass;
	      var writeValue = this.inverse ? 0 : 1;
	      var clearValue = 1 - writeValue;
	      buffers.color.setMask(false);
	      buffers.depth.setMask(false);
	      buffers.color.setLocked(true);
	      buffers.depth.setLocked(true);
	      buffers.stencil.setTest(true);
	      buffers.stencil.setOp(context.REPLACE, context.REPLACE, context.REPLACE);
	      buffers.stencil.setFunc(context.ALWAYS, writeValue, 0xffffffff);
	      buffers.stencil.setClear(clearValue);
	      buffers.stencil.setLocked(true);

	      if (this.clear) {
	        if (this.renderToScreen) {
	          clearPass.render(renderer, null);
	        } else {
	          clearPass.render(renderer, inputBuffer);
	          clearPass.render(renderer, outputBuffer);
	        }
	      }

	      if (this.renderToScreen) {
	        renderer.setRenderTarget(null);
	        renderer.render(scene, camera);
	      } else {
	        renderer.setRenderTarget(inputBuffer);
	        renderer.render(scene, camera);
	        renderer.setRenderTarget(outputBuffer);
	        renderer.render(scene, camera);
	      }

	      buffers.color.setLocked(false);
	      buffers.depth.setLocked(false);
	      buffers.stencil.setLocked(false);
	      buffers.stencil.setFunc(context.EQUAL, 1, 0xffffffff);
	      buffers.stencil.setOp(context.KEEP, context.KEEP, context.KEEP);
	      buffers.stencil.setLocked(true);
	    }
	  }, {
	    key: "clear",
	    get: function get() {
	      return this.clearPass.enabled;
	    },
	    set: function set(value) {
	      this.clearPass.enabled = value;
	    }
	  }]);

	  return MaskPass;
	}(Pass);

	var NormalPass = function (_Pass) {
	  _inherits(NormalPass, _Pass);

	  var _super = _createSuper(NormalPass);

	  function NormalPass(scene, camera) {
	    var _this;

	    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	        _ref$resolutionScale = _ref.resolutionScale,
	        resolutionScale = _ref$resolutionScale === void 0 ? 1.0 : _ref$resolutionScale,
	        _ref$width = _ref.width,
	        width = _ref$width === void 0 ? Resizer.AUTO_SIZE : _ref$width,
	        _ref$height = _ref.height,
	        height = _ref$height === void 0 ? Resizer.AUTO_SIZE : _ref$height,
	        renderTarget = _ref.renderTarget;

	    _classCallCheck(this, NormalPass);

	    _this = _super.call(this, "NormalPass");
	    _this.needsSwap = false;
	    _this.renderPass = new RenderPass(scene, camera, new three.MeshNormalMaterial());

	    var clearPass = _this.renderPass.getClearPass();

	    clearPass.overrideClearColor = new three.Color(0x7777ff);
	    clearPass.overrideClearAlpha = 1.0;
	    _this.renderTarget = renderTarget;

	    if (_this.renderTarget === undefined) {
	      _this.renderTarget = new three.WebGLRenderTarget(1, 1, {
	        minFilter: three.NearestFilter,
	        magFilter: three.NearestFilter,
	        format: three.RGBFormat,
	        stencilBuffer: false
	      });
	      _this.renderTarget.texture.name = "NormalPass.Target";
	    }

	    _this.resolution = new Resizer(_assertThisInitialized(_this), width, height, resolutionScale);
	    return _this;
	  }

	  _createClass(NormalPass, [{
	    key: "getResolutionScale",
	    value: function getResolutionScale() {
	      return this.resolutionScale;
	    }
	  }, {
	    key: "setResolutionScale",
	    value: function setResolutionScale(scale) {
	      this.resolutionScale = scale;
	      this.setSize(this.resolution.base.x, this.resolution.base.y);
	    }
	  }, {
	    key: "render",
	    value: function render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
	      var renderTarget = this.renderToScreen ? null : this.renderTarget;
	      this.renderPass.render(renderer, renderTarget, renderTarget);
	    }
	  }, {
	    key: "setSize",
	    value: function setSize(width, height) {
	      var resolution = this.resolution;
	      resolution.base.set(width, height);
	      this.renderTarget.setSize(resolution.width, resolution.height);
	    }
	  }, {
	    key: "texture",
	    get: function get() {
	      return this.renderTarget.texture;
	    }
	  }]);

	  return NormalPass;
	}(Pass);

	var SavePass = function (_Pass) {
	  _inherits(SavePass, _Pass);

	  var _super = _createSuper(SavePass);

	  function SavePass(renderTarget) {
	    var _this;

	    var resize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	    _classCallCheck(this, SavePass);

	    _this = _super.call(this, "SavePass");

	    _this.setFullscreenMaterial(new CopyMaterial());

	    _this.needsSwap = false;
	    _this.renderTarget = renderTarget;

	    if (renderTarget === undefined) {
	      _this.renderTarget = new three.WebGLRenderTarget(1, 1, {
	        minFilter: three.LinearFilter,
	        magFilter: three.LinearFilter,
	        stencilBuffer: false,
	        depthBuffer: false
	      });
	      _this.renderTarget.texture.name = "SavePass.Target";
	    }

	    _this.resize = resize;
	    return _this;
	  }

	  _createClass(SavePass, [{
	    key: "render",
	    value: function render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
	      this.getFullscreenMaterial().uniforms.inputBuffer.value = inputBuffer.texture;
	      renderer.setRenderTarget(this.renderToScreen ? null : this.renderTarget);
	      renderer.render(this.scene, this.camera);
	    }
	  }, {
	    key: "setSize",
	    value: function setSize(width, height) {
	      if (this.resize) {
	        var w = Math.max(width, 1);
	        var h = Math.max(height, 1);
	        this.renderTarget.setSize(w, h);
	      }
	    }
	  }, {
	    key: "initialize",
	    value: function initialize(renderer, alpha, frameBufferType) {
	      if (!alpha && frameBufferType === three.UnsignedByteType) {
	        this.renderTarget.texture.format = three.RGBFormat;
	      }

	      if (frameBufferType !== undefined) {
	        this.renderTarget.texture.type = frameBufferType;
	      }
	    }
	  }, {
	    key: "texture",
	    get: function get() {
	      return this.renderTarget.texture;
	    }
	  }]);

	  return SavePass;
	}(Pass);

	var ShaderPass = function (_Pass) {
	  _inherits(ShaderPass, _Pass);

	  var _super = _createSuper(ShaderPass);

	  function ShaderPass(material) {
	    var _this;

	    var input = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "inputBuffer";

	    _classCallCheck(this, ShaderPass);

	    _this = _super.call(this, "ShaderPass");

	    _this.setFullscreenMaterial(material);

	    _this.uniform = null;

	    _this.setInput(input);

	    return _this;
	  }

	  _createClass(ShaderPass, [{
	    key: "setInput",
	    value: function setInput(input) {
	      var material = this.getFullscreenMaterial();
	      this.uniform = null;

	      if (material !== null) {
	        var uniforms = material.uniforms;

	        if (uniforms !== undefined && uniforms[input] !== undefined) {
	          this.uniform = uniforms[input];
	        }
	      }
	    }
	  }, {
	    key: "render",
	    value: function render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
	      if (this.uniform !== null && inputBuffer !== null) {
	        this.uniform.value = inputBuffer.texture;
	      }

	      renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
	      renderer.render(this.scene, this.camera);
	    }
	  }]);

	  return ShaderPass;
	}(Pass);

	var EffectComposer = function () {
	  function EffectComposer() {
	    var renderer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

	    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	        _ref$depthBuffer = _ref.depthBuffer,
	        depthBuffer = _ref$depthBuffer === void 0 ? true : _ref$depthBuffer,
	        _ref$stencilBuffer = _ref.stencilBuffer,
	        stencilBuffer = _ref$stencilBuffer === void 0 ? false : _ref$stencilBuffer,
	        _ref$multisampling = _ref.multisampling,
	        multisampling = _ref$multisampling === void 0 ? 0 : _ref$multisampling,
	        frameBufferType = _ref.frameBufferType;

	    _classCallCheck(this, EffectComposer);

	    this.renderer = renderer;
	    this.inputBuffer = null;
	    this.outputBuffer = null;

	    if (this.renderer !== null) {
	      this.renderer.autoClear = false;
	      this.inputBuffer = this.createBuffer(depthBuffer, stencilBuffer, frameBufferType, multisampling);
	      this.outputBuffer = this.inputBuffer.clone();
	      this.enableExtensions();
	    }

	    this.copyPass = new ShaderPass(new CopyMaterial());
	    this.depthTexture = null;
	    this.passes = [];
	    this.autoRenderToScreen = true;
	  }

	  _createClass(EffectComposer, [{
	    key: "getRenderer",
	    value: function getRenderer() {
	      return this.renderer;
	    }
	  }, {
	    key: "enableExtensions",
	    value: function enableExtensions() {
	      var frameBufferType = this.inputBuffer.texture.type;
	      var capabilities = this.renderer.capabilities;
	      var context = this.renderer.getContext();

	      if (frameBufferType !== three.UnsignedByteType) {
	        if (capabilities.isWebGL2) {
	          context.getExtension("EXT_color_buffer_float");
	        } else {
	          context.getExtension("EXT_color_buffer_half_float");
	        }
	      }
	    }
	  }, {
	    key: "replaceRenderer",
	    value: function replaceRenderer(renderer) {
	      var updateDOM = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	      var oldRenderer = this.renderer;

	      if (oldRenderer !== null && oldRenderer !== renderer) {
	        var oldSize = oldRenderer.getSize(new three.Vector2());
	        var newSize = renderer.getSize(new three.Vector2());
	        var parent = oldRenderer.domElement.parentNode;
	        this.renderer = renderer;
	        this.renderer.autoClear = false;

	        if (!oldSize.equals(newSize)) {
	          this.setSize();
	        }

	        if (updateDOM && parent !== null) {
	          parent.removeChild(oldRenderer.domElement);
	          parent.appendChild(renderer.domElement);
	        }

	        this.enableExtensions();
	      }

	      return oldRenderer;
	    }
	  }, {
	    key: "createDepthTexture",
	    value: function createDepthTexture() {
	      var depthTexture = this.depthTexture = new three.DepthTexture();
	      this.inputBuffer.depthTexture = depthTexture;
	      this.inputBuffer.dispose();

	      if (this.inputBuffer.stencilBuffer) {
	        depthTexture.format = three.DepthStencilFormat;
	        depthTexture.type = three.UnsignedInt248Type;
	      } else {
	        depthTexture.type = three.UnsignedIntType;
	      }

	      return depthTexture;
	    }
	  }, {
	    key: "deleteDepthTexture",
	    value: function deleteDepthTexture() {
	      if (this.depthTexture !== null) {
	        this.depthTexture.dispose();
	        this.depthTexture = null;
	        this.inputBuffer.depthTexture = null;
	        this.inputBuffer.dispose();

	        var _iterator = _createForOfIteratorHelper(this.passes),
	            _step;

	        try {
	          for (_iterator.s(); !(_step = _iterator.n()).done;) {
	            var pass = _step.value;
	            pass.setDepthTexture(null);
	          }
	        } catch (err) {
	          _iterator.e(err);
	        } finally {
	          _iterator.f();
	        }
	      }
	    }
	  }, {
	    key: "createBuffer",
	    value: function createBuffer(depthBuffer, stencilBuffer, type, multisampling) {
	      var size = this.renderer.getDrawingBufferSize(new three.Vector2());
	      var alpha = this.renderer.getContext().getContextAttributes().alpha;
	      var options = {
	        format: !alpha && type === three.UnsignedByteType ? three.RGBFormat : three.RGBAFormat,
	        minFilter: three.LinearFilter,
	        magFilter: three.LinearFilter,
	        stencilBuffer: stencilBuffer,
	        depthBuffer: depthBuffer,
	        type: type
	      };
	      var renderTarget = multisampling > 0 ? new three.WebGLMultisampleRenderTarget(size.width, size.height, options) : new three.WebGLRenderTarget(size.width, size.height, options);

	      if (multisampling > 0) {
	        renderTarget.samples = multisampling;
	      }

	      renderTarget.texture.name = "EffectComposer.Buffer";
	      renderTarget.texture.generateMipmaps = false;
	      return renderTarget;
	    }
	  }, {
	    key: "addPass",
	    value: function addPass(pass, index) {
	      var passes = this.passes;
	      var renderer = this.renderer;
	      var alpha = renderer.getContext().getContextAttributes().alpha;
	      var frameBufferType = this.inputBuffer.texture.type;
	      var drawingBufferSize = renderer.getDrawingBufferSize(new three.Vector2());
	      pass.setSize(drawingBufferSize.width, drawingBufferSize.height);
	      pass.initialize(renderer, alpha, frameBufferType);

	      if (this.autoRenderToScreen) {
	        if (passes.length > 0) {
	          passes[passes.length - 1].renderToScreen = false;
	        }

	        if (pass.renderToScreen) {
	          this.autoRenderToScreen = false;
	        }
	      }

	      if (index !== undefined) {
	        passes.splice(index, 0, pass);
	      } else {
	        passes.push(pass);
	      }

	      if (this.autoRenderToScreen) {
	        passes[passes.length - 1].renderToScreen = true;
	      }

	      if (pass.needsDepthTexture || this.depthTexture !== null) {
	        if (this.depthTexture === null) {
	          var depthTexture = this.createDepthTexture();

	          var _iterator2 = _createForOfIteratorHelper(passes),
	              _step2;

	          try {
	            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	              pass = _step2.value;
	              pass.setDepthTexture(depthTexture);
	            }
	          } catch (err) {
	            _iterator2.e(err);
	          } finally {
	            _iterator2.f();
	          }
	        } else {
	          pass.setDepthTexture(this.depthTexture);
	        }
	      }
	    }
	  }, {
	    key: "removePass",
	    value: function removePass(pass) {
	      var passes = this.passes;
	      var index = passes.indexOf(pass);
	      var removed = passes.splice(index, 1).length > 0;

	      if (removed) {
	        if (this.depthTexture !== null) {
	          var reducer = function reducer(a, b) {
	            return a || b.needsDepthTexture;
	          };

	          var depthTextureRequired = passes.reduce(reducer, false);

	          if (!depthTextureRequired) {
	            if (pass.getDepthTexture() === this.depthTexture) {
	              pass.setDepthTexture(null);
	            }

	            this.deleteDepthTexture();
	          }
	        }

	        if (this.autoRenderToScreen) {
	          if (index === passes.length) {
	            pass.renderToScreen = false;

	            if (passes.length > 0) {
	              passes[passes.length - 1].renderToScreen = true;
	            }
	          }
	        }
	      }
	    }
	  }, {
	    key: "removeAllPasses",
	    value: function removeAllPasses() {
	      var passes = this.passes;
	      this.deleteDepthTexture();

	      if (passes.length > 0) {
	        if (this.autoRenderToScreen) {
	          passes[passes.length - 1].renderToScreen = false;
	        }

	        this.passes = [];
	      }
	    }
	  }, {
	    key: "render",
	    value: function render(deltaTime) {
	      var renderer = this.renderer;
	      var copyPass = this.copyPass;
	      var inputBuffer = this.inputBuffer;
	      var outputBuffer = this.outputBuffer;
	      var stencilTest = false;
	      var context, stencil, buffer;

	      var _iterator3 = _createForOfIteratorHelper(this.passes),
	          _step3;

	      try {
	        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
	          var pass = _step3.value;

	          if (pass.enabled) {
	            pass.render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest);

	            if (pass.needsSwap) {
	              if (stencilTest) {
	                copyPass.renderToScreen = pass.renderToScreen;
	                context = renderer.getContext();
	                stencil = renderer.state.buffers.stencil;
	                stencil.setFunc(context.NOTEQUAL, 1, 0xffffffff);
	                copyPass.render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest);
	                stencil.setFunc(context.EQUAL, 1, 0xffffffff);
	              }

	              buffer = inputBuffer;
	              inputBuffer = outputBuffer;
	              outputBuffer = buffer;
	            }

	            if (pass instanceof MaskPass) {
	              stencilTest = true;
	            } else if (pass instanceof ClearMaskPass) {
	              stencilTest = false;
	            }
	          }
	        }
	      } catch (err) {
	        _iterator3.e(err);
	      } finally {
	        _iterator3.f();
	      }
	    }
	  }, {
	    key: "setSize",
	    value: function setSize(width, height, updateStyle) {
	      var renderer = this.renderer;

	      if (width === undefined || height === undefined) {
	        var size = renderer.getSize(new three.Vector2());
	        width = size.width;
	        height = size.height;
	      } else {
	        renderer.setSize(width, height, updateStyle);
	      }

	      var drawingBufferSize = renderer.getDrawingBufferSize(new three.Vector2());
	      this.inputBuffer.setSize(drawingBufferSize.width, drawingBufferSize.height);
	      this.outputBuffer.setSize(drawingBufferSize.width, drawingBufferSize.height);

	      var _iterator4 = _createForOfIteratorHelper(this.passes),
	          _step4;

	      try {
	        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
	          var pass = _step4.value;
	          pass.setSize(drawingBufferSize.width, drawingBufferSize.height);
	        }
	      } catch (err) {
	        _iterator4.e(err);
	      } finally {
	        _iterator4.f();
	      }
	    }
	  }, {
	    key: "reset",
	    value: function reset() {
	      this.dispose();
	      this.autoRenderToScreen = true;
	    }
	  }, {
	    key: "dispose",
	    value: function dispose() {
	      var _iterator5 = _createForOfIteratorHelper(this.passes),
	          _step5;

	      try {
	        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
	          var pass = _step5.value;
	          pass.dispose();
	        }
	      } catch (err) {
	        _iterator5.e(err);
	      } finally {
	        _iterator5.f();
	      }

	      this.passes = [];

	      if (this.inputBuffer !== null) {
	        this.inputBuffer.dispose();
	      }

	      if (this.outputBuffer !== null) {
	        this.outputBuffer.dispose();
	      }

	      this.deleteDepthTexture();
	      this.copyPass.dispose();
	    }
	  }, {
	    key: "multisampling",
	    get: function get() {
	      return this.inputBuffer instanceof three.WebGLMultisampleRenderTarget ? this.inputBuffer.samples : 0;
	    },
	    set: function set(value) {
	      var buffer = this.inputBuffer;
	      var multisampling = this.multisampling;

	      if (multisampling > 0 && value > 0) {
	        this.inputBuffer.samples = value;
	        this.outputBuffer.samples = value;
	      } else if (multisampling !== value) {
	        this.inputBuffer.dispose();
	        this.outputBuffer.dispose();
	        this.inputBuffer = this.createBuffer(buffer.depthBuffer, buffer.stencilBuffer, buffer.texture.type, value);
	        this.inputBuffer.depthTexture = this.depthTexture;
	        this.outputBuffer = this.inputBuffer.clone();
	      }
	    }
	  }]);

	  return EffectComposer;
	}();

	var Initializable = function () {
	  function Initializable() {
	    _classCallCheck(this, Initializable);
	  }

	  _createClass(Initializable, [{
	    key: "initialize",
	    value: function initialize(renderer, alpha, frameBufferType) {}
	  }]);

	  return Initializable;
	}();

	var Resizable = function () {
	  function Resizable() {
	    _classCallCheck(this, Resizable);
	  }

	  _createClass(Resizable, [{
	    key: "setSize",
	    value: function setSize(width, height) {}
	  }]);

	  return Resizable;
	}();

	var Selection = function (_Set) {
	  _inherits(Selection, _Set);

	  var _super = _createSuper(Selection);

	  function Selection(iterable) {
	    var _this;

	    var layer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

	    _classCallCheck(this, Selection);

	    _this = _super.call(this);
	    _this.currentLayer = layer;

	    if (iterable !== undefined) {
	      _this.set(iterable);
	    }

	    return _this;
	  }

	  _createClass(Selection, [{
	    key: "clear",
	    value: function clear() {
	      var layer = this.layer;

	      var _iterator = _createForOfIteratorHelper(this),
	          _step;

	      try {
	        for (_iterator.s(); !(_step = _iterator.n()).done;) {
	          var object = _step.value;
	          object.layers.disable(layer);
	        }
	      } catch (err) {
	        _iterator.e(err);
	      } finally {
	        _iterator.f();
	      }

	      return _get(_getPrototypeOf(Selection.prototype), "clear", this).call(this);
	    }
	  }, {
	    key: "set",
	    value: function set(objects) {
	      this.clear();

	      var _iterator2 = _createForOfIteratorHelper(objects),
	          _step2;

	      try {
	        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	          var object = _step2.value;
	          this.add(object);
	        }
	      } catch (err) {
	        _iterator2.e(err);
	      } finally {
	        _iterator2.f();
	      }

	      return this;
	    }
	  }, {
	    key: "indexOf",
	    value: function indexOf(object) {
	      return this.has(object) ? 0 : -1;
	    }
	  }, {
	    key: "add",
	    value: function add(object) {
	      object.layers.enable(this.layer);

	      _get(_getPrototypeOf(Selection.prototype), "add", this).call(this, object);

	      return this;
	    }
	  }, {
	    key: "delete",
	    value: function _delete(object) {
	      if (this.has(object)) {
	        object.layers.disable(this.layer);
	      }

	      return _get(_getPrototypeOf(Selection.prototype), "delete", this).call(this, object);
	    }
	  }, {
	    key: "setVisible",
	    value: function setVisible(visible) {
	      var _iterator3 = _createForOfIteratorHelper(this),
	          _step3;

	      try {
	        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
	          var object = _step3.value;

	          if (visible) {
	            object.layers.enable(0);
	          } else {
	            object.layers.disable(0);
	          }
	        }
	      } catch (err) {
	        _iterator3.e(err);
	      } finally {
	        _iterator3.f();
	      }

	      return this;
	    }
	  }, {
	    key: "layer",
	    get: function get() {
	      return this.currentLayer;
	    },
	    set: function set(value) {
	      var currentLayer = this.currentLayer;

	      var _iterator4 = _createForOfIteratorHelper(this),
	          _step4;

	      try {
	        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
	          var object = _step4.value;
	          object.layers.disable(currentLayer);
	          object.layers.enable(value);
	        }
	      } catch (err) {
	        _iterator4.e(err);
	      } finally {
	        _iterator4.f();
	      }

	      this.currentLayer = value;
	    }
	  }]);

	  return Selection;
	}(_wrapNativeSuper(Set));

	var fragmentShader$a = "uniform sampler2D texture;uniform float intensity;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=clamp(texture2D(texture,uv)*intensity,0.0,1.0);}";

	var BloomEffect = function (_Effect) {
	  _inherits(BloomEffect, _Effect);

	  var _super = _createSuper(BloomEffect);

	  function BloomEffect() {
	    var _this;

	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        _ref$blendFunction = _ref.blendFunction,
	        blendFunction = _ref$blendFunction === void 0 ? BlendFunction.SCREEN : _ref$blendFunction,
	        _ref$luminanceThresho = _ref.luminanceThreshold,
	        luminanceThreshold = _ref$luminanceThresho === void 0 ? 0.9 : _ref$luminanceThresho,
	        _ref$luminanceSmoothi = _ref.luminanceSmoothing,
	        luminanceSmoothing = _ref$luminanceSmoothi === void 0 ? 0.025 : _ref$luminanceSmoothi,
	        _ref$resolutionScale = _ref.resolutionScale,
	        resolutionScale = _ref$resolutionScale === void 0 ? 0.5 : _ref$resolutionScale,
	        _ref$intensity = _ref.intensity,
	        intensity = _ref$intensity === void 0 ? 1.0 : _ref$intensity,
	        _ref$width = _ref.width,
	        width = _ref$width === void 0 ? Resizer.AUTO_SIZE : _ref$width,
	        _ref$height = _ref.height,
	        height = _ref$height === void 0 ? Resizer.AUTO_SIZE : _ref$height,
	        _ref$kernelSize = _ref.kernelSize,
	        kernelSize = _ref$kernelSize === void 0 ? KernelSize.LARGE : _ref$kernelSize;

	    _classCallCheck(this, BloomEffect);

	    _this = _super.call(this, "BloomEffect", fragmentShader$a, {
	      blendFunction: blendFunction,
	      uniforms: new Map([["texture", new three.Uniform(null)], ["intensity", new three.Uniform(intensity)]])
	    });
	    _this.renderTarget = new three.WebGLRenderTarget(1, 1, {
	      minFilter: three.LinearFilter,
	      magFilter: three.LinearFilter,
	      stencilBuffer: false,
	      depthBuffer: false
	    });
	    _this.renderTarget.texture.name = "Bloom.Target";
	    _this.renderTarget.texture.generateMipmaps = false;
	    _this.uniforms.get("texture").value = _this.renderTarget.texture;
	    _this.blurPass = new BlurPass({
	      resolutionScale: resolutionScale,
	      width: width,
	      height: height,
	      kernelSize: kernelSize
	    });
	    _this.blurPass.resolution.resizable = _assertThisInitialized(_this);
	    _this.luminancePass = new ShaderPass(new LuminanceMaterial(true));
	    _this.luminanceMaterial.threshold = luminanceThreshold;
	    _this.luminanceMaterial.smoothing = luminanceSmoothing;
	    return _this;
	  }

	  _createClass(BloomEffect, [{
	    key: "getResolutionScale",
	    value: function getResolutionScale() {
	      return this.resolution.scale;
	    }
	  }, {
	    key: "setResolutionScale",
	    value: function setResolutionScale(scale) {
	      this.resolution.scale = scale;
	    }
	  }, {
	    key: "update",
	    value: function update(renderer, inputBuffer, deltaTime) {
	      var renderTarget = this.renderTarget;

	      if (this.luminancePass.enabled) {
	        this.luminancePass.render(renderer, inputBuffer, renderTarget);
	        this.blurPass.render(renderer, renderTarget, renderTarget);
	      } else {
	        this.blurPass.render(renderer, inputBuffer, renderTarget);
	      }
	    }
	  }, {
	    key: "setSize",
	    value: function setSize(width, height) {
	      this.blurPass.setSize(width, height);
	      this.renderTarget.setSize(this.resolution.width, this.resolution.height);
	    }
	  }, {
	    key: "initialize",
	    value: function initialize(renderer, alpha, frameBufferType) {
	      this.blurPass.initialize(renderer, alpha, frameBufferType);

	      if (!alpha && frameBufferType === three.UnsignedByteType) {
	        this.renderTarget.texture.format = three.RGBFormat;
	      }

	      if (frameBufferType !== undefined) {
	        this.renderTarget.texture.type = frameBufferType;
	      }
	    }
	  }, {
	    key: "texture",
	    get: function get() {
	      return this.renderTarget.texture;
	    }
	  }, {
	    key: "luminanceMaterial",
	    get: function get() {
	      return this.luminancePass.getFullscreenMaterial();
	    }
	  }, {
	    key: "resolution",
	    get: function get() {
	      return this.blurPass.resolution;
	    }
	  }, {
	    key: "width",
	    get: function get() {
	      return this.resolution.width;
	    },
	    set: function set(value) {
	      this.resolution.width = value;
	    }
	  }, {
	    key: "height",
	    get: function get() {
	      return this.resolution.height;
	    },
	    set: function set(value) {
	      this.resolution.height = value;
	    }
	  }, {
	    key: "dithering",
	    get: function get() {
	      return this.blurPass.dithering;
	    },
	    set: function set(value) {
	      this.blurPass.dithering = value;
	    }
	  }, {
	    key: "kernelSize",
	    get: function get() {
	      return this.blurPass.kernelSize;
	    },
	    set: function set(value) {
	      this.blurPass.kernelSize = value;
	    }
	  }, {
	    key: "distinction",
	    get: function get() {
	      console.warn(this.name, "The distinction field has been removed, use luminanceMaterial.threshold and luminanceMaterial.smoothing instead.");
	      return 1.0;
	    },
	    set: function set(value) {
	      console.warn(this.name, "The distinction field has been removed, use luminanceMaterial.threshold and luminanceMaterial.smoothing instead.");
	    }
	  }, {
	    key: "intensity",
	    get: function get() {
	      return this.uniforms.get("intensity").value;
	    },
	    set: function set(value) {
	      this.uniforms.get("intensity").value = value;
	    }
	  }]);

	  return BloomEffect;
	}(Effect);

	var fragmentShader$b = "uniform vec2 angle;uniform float scale;float pattern(const in vec2 uv){vec2 point=scale*vec2(dot(angle.yx,vec2(uv.x,-uv.y)),dot(angle,uv));return(sin(point.x)*sin(point.y))*4.0;}void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 color=vec3(inputColor.rgb*10.0-5.0+pattern(uv*resolution));outputColor=vec4(color,inputColor.a);}";

	var DotScreenEffect = function (_Effect) {
	  _inherits(DotScreenEffect, _Effect);

	  var _super = _createSuper(DotScreenEffect);

	  function DotScreenEffect() {
	    var _this;

	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        _ref$blendFunction = _ref.blendFunction,
	        blendFunction = _ref$blendFunction === void 0 ? BlendFunction.NORMAL : _ref$blendFunction,
	        _ref$angle = _ref.angle,
	        angle = _ref$angle === void 0 ? Math.PI * 0.5 : _ref$angle,
	        _ref$scale = _ref.scale,
	        scale = _ref$scale === void 0 ? 1.0 : _ref$scale;

	    _classCallCheck(this, DotScreenEffect);

	    _this = _super.call(this, "DotScreenEffect", fragmentShader$b, {
	      blendFunction: blendFunction,
	      uniforms: new Map([["angle", new three.Uniform(new three.Vector2())], ["scale", new three.Uniform(scale)]])
	    });

	    _this.setAngle(angle);

	    return _this;
	  }

	  _createClass(DotScreenEffect, [{
	    key: "setAngle",
	    value: function setAngle(angle) {
	      this.uniforms.get("angle").value.set(Math.sin(angle), Math.cos(angle));
	    }
	  }]);

	  return DotScreenEffect;
	}(Effect);

	function getNoise(size, format, type) {
	  var channels = new Map([[three.LuminanceFormat, 1], [three.RedFormat, 1], [three.RGFormat, 2], [three.RGBFormat, 3], [three.RGBAFormat, 4]]);
	  var data;

	  if (!channels.has(format)) {
	    console.error("Invalid noise texture format");
	  }

	  if (type === three.UnsignedByteType) {
	    data = new Uint8Array(size * channels.get(format));

	    for (var i = 0, l = data.length; i < l; ++i) {
	      data[i] = Math.random() * 255;
	    }
	  } else {
	    data = new Float32Array(size * channels.get(format));

	    for (var _i = 0, _l = data.length; _i < _l; ++_i) {
	      data[_i] = Math.random();
	    }
	  }

	  return data;
	}

	var NoiseTexture = function (_DataTexture) {
	  _inherits(NoiseTexture, _DataTexture);

	  var _super = _createSuper(NoiseTexture);

	  function NoiseTexture(width, height) {
	    var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : three.LuminanceFormat;
	    var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : three.UnsignedByteType;

	    _classCallCheck(this, NoiseTexture);

	    return _super.call(this, getNoise(width * height, format, type), width, height, format, type);
	  }

	  return NoiseTexture;
	}(three.DataTexture);

	var fragmentShader$c = "uniform sampler2D perturbationMap;uniform bool active;uniform float columns;uniform float random;uniform vec2 seed;uniform vec2 distortion;void mainUv(inout vec2 uv){if(active){if(uv.y<distortion.x+columns&&uv.y>distortion.x-columns*random){float sx=clamp(ceil(seed.x),0.0,1.0);uv.y=sx*(1.0-(uv.y+distortion.y))+(1.0-sx)*distortion.y;}if(uv.x<distortion.y+columns&&uv.x>distortion.y-columns*random){float sy=clamp(ceil(seed.y),0.0,1.0);uv.x=sy*distortion.x+(1.0-sy)*(1.0-(uv.x+distortion.x));}vec2 normal=texture2D(perturbationMap,uv*random*random).rg;uv+=normal*seed*(random*0.2);}}";

	var tag = "Glitch.Generated";

	function randomFloat(low, high) {
	  return low + Math.random() * (high - low);
	}

	var GlitchEffect = function (_Effect) {
	  _inherits(GlitchEffect, _Effect);

	  var _super = _createSuper(GlitchEffect);

	  function GlitchEffect() {
	    var _this;

	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        _ref$blendFunction = _ref.blendFunction,
	        blendFunction = _ref$blendFunction === void 0 ? BlendFunction.NORMAL : _ref$blendFunction,
	        _ref$chromaticAberrat = _ref.chromaticAberrationOffset,
	        chromaticAberrationOffset = _ref$chromaticAberrat === void 0 ? null : _ref$chromaticAberrat,
	        _ref$delay = _ref.delay,
	        delay = _ref$delay === void 0 ? new three.Vector2(1.5, 3.5) : _ref$delay,
	        _ref$duration = _ref.duration,
	        duration = _ref$duration === void 0 ? new three.Vector2(0.6, 1.0) : _ref$duration,
	        _ref$strength = _ref.strength,
	        strength = _ref$strength === void 0 ? new three.Vector2(0.3, 1.0) : _ref$strength,
	        _ref$columns = _ref.columns,
	        columns = _ref$columns === void 0 ? 0.05 : _ref$columns,
	        _ref$ratio = _ref.ratio,
	        ratio = _ref$ratio === void 0 ? 0.85 : _ref$ratio,
	        _ref$perturbationMap = _ref.perturbationMap,
	        perturbationMap = _ref$perturbationMap === void 0 ? null : _ref$perturbationMap,
	        _ref$dtSize = _ref.dtSize,
	        dtSize = _ref$dtSize === void 0 ? 64 : _ref$dtSize;

	    _classCallCheck(this, GlitchEffect);

	    _this = _super.call(this, "GlitchEffect", fragmentShader$c, {
	      blendFunction: blendFunction,
	      uniforms: new Map([["perturbationMap", new three.Uniform(null)], ["columns", new three.Uniform(columns)], ["active", new three.Uniform(false)], ["random", new three.Uniform(1.0)], ["seed", new three.Uniform(new three.Vector2())], ["distortion", new three.Uniform(new three.Vector2())]])
	    });

	    _this.setPerturbationMap(perturbationMap === null ? _this.generatePerturbationMap(dtSize) : perturbationMap);

	    _this.delay = delay;
	    _this.duration = duration;
	    _this.breakPoint = new three.Vector2(randomFloat(_this.delay.x, _this.delay.y), randomFloat(_this.duration.x, _this.duration.y));
	    _this.time = 0;
	    _this.seed = _this.uniforms.get("seed").value;
	    _this.distortion = _this.uniforms.get("distortion").value;
	    _this.mode = GlitchMode.SPORADIC;
	    _this.strength = strength;
	    _this.ratio = ratio;
	    _this.chromaticAberrationOffset = chromaticAberrationOffset;
	    return _this;
	  }

	  _createClass(GlitchEffect, [{
	    key: "getPerturbationMap",
	    value: function getPerturbationMap() {
	      return this.uniforms.get("perturbationMap").value;
	    }
	  }, {
	    key: "setPerturbationMap",
	    value: function setPerturbationMap(map) {
	      var currentMap = this.getPerturbationMap();

	      if (currentMap !== null && currentMap.name === tag) {
	        currentMap.dispose();
	      }

	      map.minFilter = map.magFilter = three.NearestFilter;
	      map.wrapS = map.wrapT = three.RepeatWrapping;
	      map.generateMipmaps = false;
	      this.uniforms.get("perturbationMap").value = map;
	    }
	  }, {
	    key: "generatePerturbationMap",
	    value: function generatePerturbationMap() {
	      var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 64;
	      var map = new NoiseTexture(size, size, three.RGBFormat);
	      map.name = tag;
	      return map;
	    }
	  }, {
	    key: "update",
	    value: function update(renderer, inputBuffer, deltaTime) {
	      var mode = this.mode;
	      var breakPoint = this.breakPoint;
	      var offset = this.chromaticAberrationOffset;
	      var s = this.strength;
	      var time = this.time;
	      var active = false;
	      var r = 0.0,
	          a = 0.0;
	      var trigger;

	      if (mode !== GlitchMode.DISABLED) {
	        if (mode === GlitchMode.SPORADIC) {
	          time += deltaTime;
	          trigger = time > breakPoint.x;

	          if (time >= breakPoint.x + breakPoint.y) {
	            breakPoint.set(randomFloat(this.delay.x, this.delay.y), randomFloat(this.duration.x, this.duration.y));
	            time = 0;
	          }
	        }

	        r = Math.random();
	        this.uniforms.get("random").value = r;

	        if (trigger && r > this.ratio || mode === GlitchMode.CONSTANT_WILD) {
	          active = true;
	          r *= s.y * 0.03;
	          a = randomFloat(-Math.PI, Math.PI);
	          this.seed.set(randomFloat(-s.y, s.y), randomFloat(-s.y, s.y));
	          this.distortion.set(randomFloat(0.0, 1.0), randomFloat(0.0, 1.0));
	        } else if (trigger || mode === GlitchMode.CONSTANT_MILD) {
	          active = true;
	          r *= s.x * 0.03;
	          a = randomFloat(-Math.PI, Math.PI);
	          this.seed.set(randomFloat(-s.x, s.x), randomFloat(-s.x, s.x));
	          this.distortion.set(randomFloat(0.0, 1.0), randomFloat(0.0, 1.0));
	        }

	        this.time = time;
	      }

	      if (offset !== null) {
	        if (active) {
	          offset.set(Math.cos(a), Math.sin(a)).multiplyScalar(r);
	        } else {
	          offset.set(0.0, 0.0);
	        }
	      }

	      this.uniforms.get("active").value = active;
	    }
	  }, {
	    key: "active",
	    get: function get() {
	      return this.uniforms.get("active").value;
	    }
	  }]);

	  return GlitchEffect;
	}(Effect);
	var GlitchMode = {
	  DISABLED: 0,
	  SPORADIC: 1,
	  CONSTANT_MILD: 2,
	  CONSTANT_WILD: 3
	};

	var fragmentShader$d = "void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 noise=vec3(rand(uv*time));\n#ifdef PREMULTIPLY\noutputColor=vec4(min(inputColor.rgb*noise,vec3(1.0)),inputColor.a);\n#else\noutputColor=vec4(noise,inputColor.a);\n#endif\n}";

	var NoiseEffect = function (_Effect) {
	  _inherits(NoiseEffect, _Effect);

	  var _super = _createSuper(NoiseEffect);

	  function NoiseEffect() {
	    var _this;

	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        _ref$blendFunction = _ref.blendFunction,
	        blendFunction = _ref$blendFunction === void 0 ? BlendFunction.SCREEN : _ref$blendFunction,
	        _ref$premultiply = _ref.premultiply,
	        premultiply = _ref$premultiply === void 0 ? false : _ref$premultiply;

	    _classCallCheck(this, NoiseEffect);

	    _this = _super.call(this, "NoiseEffect", fragmentShader$d, {
	      blendFunction: blendFunction
	    });
	    _this.premultiply = premultiply;
	    return _this;
	  }

	  _createClass(NoiseEffect, [{
	    key: "premultiply",
	    get: function get() {
	      return this.defines.has("PREMULTIPLY");
	    },
	    set: function set(value) {
	      if (this.premultiply !== value) {
	        if (value) {
	          this.defines.set("PREMULTIPLY", "1");
	        } else {
	          this.defines["delete"]("PREMULTIPLY");
	        }

	        this.setChanged();
	      }
	    }
	  }]);

	  return NoiseEffect;
	}(Effect);

	var fragmentShader$e = "uniform sampler2D edgeTexture;uniform sampler2D maskTexture;uniform vec3 visibleEdgeColor;uniform vec3 hiddenEdgeColor;uniform float pulse;uniform float edgeStrength;\n#ifdef USE_PATTERN\nuniform sampler2D patternTexture;varying vec2 vUvPattern;\n#endif\nvoid mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec2 edge=texture2D(edgeTexture,uv).rg;vec2 mask=texture2D(maskTexture,uv).rg;\n#ifndef X_RAY\nedge.y=0.0;\n#endif\nedge*=(edgeStrength*mask.x*pulse);vec3 color=edge.x*visibleEdgeColor+edge.y*hiddenEdgeColor;float visibilityFactor=0.0;\n#ifdef USE_PATTERN\nvec4 patternColor=texture2D(patternTexture,vUvPattern);\n#ifdef X_RAY\nfloat hiddenFactor=0.5;\n#else\nfloat hiddenFactor=0.0;\n#endif\nvisibilityFactor=(1.0-mask.y>0.0)? 1.0 : hiddenFactor;visibilityFactor*=(1.0-mask.x)*patternColor.a;color+=visibilityFactor*patternColor.rgb;\n#endif\nfloat alpha=max(max(edge.x,edge.y),visibilityFactor);\n#ifdef ALPHA\noutputColor=vec4(color,alpha);\n#else\noutputColor=vec4(color,max(alpha,inputColor.a));\n#endif\n}";

	var vertexShader$6 = "uniform float patternScale;varying vec2 vUvPattern;void mainSupport(const in vec2 uv){vUvPattern=uv*vec2(aspect,1.0)*patternScale;}";

	var OutlineEffect = function (_Effect) {
	  _inherits(OutlineEffect, _Effect);

	  var _super = _createSuper(OutlineEffect);

	  function OutlineEffect(scene, camera) {
	    var _this;

	    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	        _ref$blendFunction = _ref.blendFunction,
	        blendFunction = _ref$blendFunction === void 0 ? BlendFunction.SCREEN : _ref$blendFunction,
	        _ref$patternTexture = _ref.patternTexture,
	        patternTexture = _ref$patternTexture === void 0 ? null : _ref$patternTexture,
	        _ref$edgeStrength = _ref.edgeStrength,
	        edgeStrength = _ref$edgeStrength === void 0 ? 1.0 : _ref$edgeStrength,
	        _ref$pulseSpeed = _ref.pulseSpeed,
	        pulseSpeed = _ref$pulseSpeed === void 0 ? 0.0 : _ref$pulseSpeed,
	        _ref$visibleEdgeColor = _ref.visibleEdgeColor,
	        visibleEdgeColor = _ref$visibleEdgeColor === void 0 ? 0xffffff : _ref$visibleEdgeColor,
	        _ref$hiddenEdgeColor = _ref.hiddenEdgeColor,
	        hiddenEdgeColor = _ref$hiddenEdgeColor === void 0 ? 0x22090a : _ref$hiddenEdgeColor,
	        _ref$resolutionScale = _ref.resolutionScale,
	        resolutionScale = _ref$resolutionScale === void 0 ? 0.5 : _ref$resolutionScale,
	        _ref$width = _ref.width,
	        width = _ref$width === void 0 ? Resizer.AUTO_SIZE : _ref$width,
	        _ref$height = _ref.height,
	        height = _ref$height === void 0 ? Resizer.AUTO_SIZE : _ref$height,
	        _ref$kernelSize = _ref.kernelSize,
	        kernelSize = _ref$kernelSize === void 0 ? KernelSize.VERY_SMALL : _ref$kernelSize,
	        _ref$blur = _ref.blur,
	        blur = _ref$blur === void 0 ? false : _ref$blur,
	        _ref$xRay = _ref.xRay,
	        xRay = _ref$xRay === void 0 ? true : _ref$xRay;

	    _classCallCheck(this, OutlineEffect);

	    _this = _super.call(this, "OutlineEffect", fragmentShader$e, {
	      uniforms: new Map([["maskTexture", new three.Uniform(null)], ["edgeTexture", new three.Uniform(null)], ["edgeStrength", new three.Uniform(edgeStrength)], ["visibleEdgeColor", new three.Uniform(new three.Color(visibleEdgeColor))], ["hiddenEdgeColor", new three.Uniform(new three.Color(hiddenEdgeColor))], ["pulse", new three.Uniform(1.0)], ["patternScale", new three.Uniform(1.0)], ["patternTexture", new three.Uniform(null)]])
	    });

	    _this.blendMode.addEventListener("change", function (event) {
	      if (_this.blendMode.getBlendFunction() === BlendFunction.ALPHA) {
	        _this.defines.set("ALPHA", "1");
	      } else {
	        _this.defines["delete"]("ALPHA");
	      }

	      _this.setChanged();
	    });

	    _this.blendMode.setBlendFunction(blendFunction);

	    _this.setPatternTexture(patternTexture);

	    _this.xRay = xRay;
	    _this.scene = scene;
	    _this.camera = camera;
	    _this.renderTargetMask = new three.WebGLRenderTarget(1, 1, {
	      minFilter: three.LinearFilter,
	      magFilter: three.LinearFilter,
	      stencilBuffer: false,
	      format: three.RGBFormat
	    });
	    _this.renderTargetMask.texture.name = "Outline.Mask";
	    _this.uniforms.get("maskTexture").value = _this.renderTargetMask.texture;
	    _this.renderTargetOutline = _this.renderTargetMask.clone();
	    _this.renderTargetOutline.texture.name = "Outline.Edges";
	    _this.renderTargetOutline.depthBuffer = false;
	    _this.renderTargetBlurredOutline = _this.renderTargetOutline.clone();
	    _this.renderTargetBlurredOutline.texture.name = "Outline.BlurredEdges";
	    _this.clearPass = new ClearPass();
	    _this.clearPass.overrideClearColor = new three.Color(0x000000);
	    _this.clearPass.overrideClearAlpha = 1.0;
	    _this.depthPass = new DepthPass(scene, camera);
	    _this.maskPass = new RenderPass(scene, camera, new DepthComparisonMaterial(_this.depthPass.texture, camera));

	    var clearPass = _this.maskPass.getClearPass();

	    clearPass.overrideClearColor = new three.Color(0xffffff);
	    clearPass.overrideClearAlpha = 1.0;
	    _this.blurPass = new BlurPass({
	      resolutionScale: resolutionScale,
	      width: width,
	      height: height,
	      kernelSize: kernelSize
	    });
	    _this.blurPass.resolution.resizable = _assertThisInitialized(_this);
	    _this.blur = blur;
	    _this.outlinePass = new ShaderPass(new OutlineMaterial());
	    _this.outlinePass.getFullscreenMaterial().uniforms.inputBuffer.value = _this.renderTargetMask.texture;
	    _this.time = 0.0;
	    _this.selection = new Selection();
	    _this.pulseSpeed = pulseSpeed;
	    return _this;
	  }

	  _createClass(OutlineEffect, [{
	    key: "setPatternTexture",
	    value: function setPatternTexture(texture) {
	      if (texture !== null) {
	        texture.wrapS = texture.wrapT = three.RepeatWrapping;
	        this.defines.set("USE_PATTERN", "1");
	        this.uniforms.get("patternTexture").value = texture;
	        this.setVertexShader(vertexShader$6);
	      } else {
	        this.defines["delete"]("USE_PATTERN");
	        this.uniforms.get("patternTexture").value = null;
	        this.setVertexShader(null);
	      }

	      this.setChanged();
	    }
	  }, {
	    key: "getResolutionScale",
	    value: function getResolutionScale() {
	      return this.resolution.scale;
	    }
	  }, {
	    key: "setResolutionScale",
	    value: function setResolutionScale(scale) {
	      this.resolution.scale = scale;
	    }
	  }, {
	    key: "setSelection",
	    value: function setSelection(objects) {
	      this.selection.set(objects);
	      return this;
	    }
	  }, {
	    key: "clearSelection",
	    value: function clearSelection() {
	      this.selection.clear();
	      return this;
	    }
	  }, {
	    key: "selectObject",
	    value: function selectObject(object) {
	      this.selection.add(object);
	      return this;
	    }
	  }, {
	    key: "deselectObject",
	    value: function deselectObject(object) {
	      this.selection["delete"](object);
	      return this;
	    }
	  }, {
	    key: "update",
	    value: function update(renderer, inputBuffer, deltaTime) {
	      var scene = this.scene;
	      var camera = this.camera;
	      var selection = this.selection;
	      var pulse = this.uniforms.get("pulse");
	      var background = scene.background;
	      var mask = camera.layers.mask;

	      if (selection.size > 0) {
	        scene.background = null;
	        pulse.value = 1.0;

	        if (this.pulseSpeed > 0.0) {
	          pulse.value = 0.625 + Math.cos(this.time * this.pulseSpeed * 10.0) * 0.375;
	        }

	        this.time += deltaTime;
	        selection.setVisible(false);
	        this.depthPass.render(renderer);
	        selection.setVisible(true);
	        camera.layers.set(selection.layer);
	        this.maskPass.render(renderer, this.renderTargetMask);
	        camera.layers.mask = mask;
	        scene.background = background;
	        this.outlinePass.render(renderer, null, this.renderTargetOutline);

	        if (this.blur) {
	          this.blurPass.render(renderer, this.renderTargetOutline, this.renderTargetBlurredOutline);
	        }
	      } else if (this.time > 0.0) {
	        this.clearPass.render(renderer, this.renderTargetMask);
	        this.time = 0.0;
	      }
	    }
	  }, {
	    key: "setSize",
	    value: function setSize(width, height) {
	      this.blurPass.setSize(width, height);
	      this.renderTargetMask.setSize(width, height);
	      var w = this.resolution.width;
	      var h = this.resolution.height;
	      this.depthPass.setSize(w, h);
	      this.renderTargetOutline.setSize(w, h);
	      this.renderTargetBlurredOutline.setSize(w, h);
	      this.outlinePass.getFullscreenMaterial().setTexelSize(1.0 / w, 1.0 / h);
	    }
	  }, {
	    key: "initialize",
	    value: function initialize(renderer, alpha, frameBufferType) {
	      this.blurPass.initialize(renderer, alpha, three.UnsignedByteType);

	      if (frameBufferType !== undefined) {
	        this.depthPass.initialize(renderer, alpha, frameBufferType);
	        this.maskPass.initialize(renderer, alpha, frameBufferType);
	        this.outlinePass.initialize(renderer, alpha, frameBufferType);
	      }
	    }
	  }, {
	    key: "resolution",
	    get: function get() {
	      return this.blurPass.resolution;
	    }
	  }, {
	    key: "width",
	    get: function get() {
	      return this.resolution.width;
	    },
	    set: function set(value) {
	      this.resolution.width = value;
	    }
	  }, {
	    key: "height",
	    get: function get() {
	      return this.resolution.height;
	    },
	    set: function set(value) {
	      this.resolution.height = value;
	    }
	  }, {
	    key: "selectionLayer",
	    get: function get() {
	      return this.selection.layer;
	    },
	    set: function set(value) {
	      this.selection.layer = value;
	    }
	  }, {
	    key: "dithering",
	    get: function get() {
	      return this.blurPass.dithering;
	    },
	    set: function set(value) {
	      this.blurPass.dithering = value;
	    }
	  }, {
	    key: "kernelSize",
	    get: function get() {
	      return this.blurPass.kernelSize;
	    },
	    set: function set(value) {
	      this.blurPass.kernelSize = value;
	    }
	  }, {
	    key: "blur",
	    get: function get() {
	      return this.blurPass.enabled;
	    },
	    set: function set(value) {
	      this.blurPass.enabled = value;
	      this.uniforms.get("edgeTexture").value = value ? this.renderTargetBlurredOutline.texture : this.renderTargetOutline.texture;
	    }
	  }, {
	    key: "xRay",
	    get: function get() {
	      return this.defines.has("X_RAY");
	    },
	    set: function set(value) {
	      if (this.xRay !== value) {
	        if (value) {
	          this.defines.set("X_RAY", "1");
	        } else {
	          this.defines["delete"]("X_RAY");
	        }

	        this.setChanged();
	      }
	    }
	  }]);

	  return OutlineEffect;
	}(Effect);

	var fragmentShader$f = "uniform bool active;uniform vec2 d;void mainUv(inout vec2 uv){if(active){uv=vec2(d.x*(floor(uv.x/d.x)+0.5),d.y*(floor(uv.y/d.y)+0.5));}}";

	var PixelationEffect = function (_Effect) {
	  _inherits(PixelationEffect, _Effect);

	  var _super = _createSuper(PixelationEffect);

	  function PixelationEffect() {
	    var _this;

	    var granularity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30.0;

	    _classCallCheck(this, PixelationEffect);

	    _this = _super.call(this, "PixelationEffect", fragmentShader$f, {
	      uniforms: new Map([["active", new three.Uniform(false)], ["d", new three.Uniform(new three.Vector2())]])
	    });
	    _this.resolution = new three.Vector2();
	    _this.granularity = granularity;
	    return _this;
	  }

	  _createClass(PixelationEffect, [{
	    key: "getGranularity",
	    value: function getGranularity() {
	      return this.granularity;
	    }
	  }, {
	    key: "setGranularity",
	    value: function setGranularity(granularity) {
	      granularity = Math.floor(granularity);

	      if (granularity % 2 > 0) {
	        granularity += 1;
	      }

	      var uniforms = this.uniforms;
	      uniforms.get("active").value = granularity > 0.0;
	      uniforms.get("d").value.set(granularity, granularity).divide(this.resolution);
	      this.granularity = granularity;
	    }
	  }, {
	    key: "setSize",
	    value: function setSize(width, height) {
	      this.resolution.set(width, height);
	      this.setGranularity(this.granularity);
	    }
	  }]);

	  return PixelationEffect;
	}(Effect);

	var fragmentShader$g = "uniform float count;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec2 sl=vec2(sin(uv.y*count),cos(uv.y*count));vec3 scanlines=vec3(sl.x,sl.y,sl.x);outputColor=vec4(scanlines,inputColor.a);}";

	var ScanlineEffect = function (_Effect) {
	  _inherits(ScanlineEffect, _Effect);

	  var _super = _createSuper(ScanlineEffect);

	  function ScanlineEffect() {
	    var _this;

	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        _ref$blendFunction = _ref.blendFunction,
	        blendFunction = _ref$blendFunction === void 0 ? BlendFunction.OVERLAY : _ref$blendFunction,
	        _ref$density = _ref.density,
	        density = _ref$density === void 0 ? 1.25 : _ref$density;

	    _classCallCheck(this, ScanlineEffect);

	    _this = _super.call(this, "ScanlineEffect", fragmentShader$g, {
	      blendFunction: blendFunction,
	      uniforms: new Map([["count", new three.Uniform(0.0)]])
	    });
	    _this.resolution = new three.Vector2();
	    _this.density = density;
	    return _this;
	  }

	  _createClass(ScanlineEffect, [{
	    key: "getDensity",
	    value: function getDensity() {
	      return this.density;
	    }
	  }, {
	    key: "setDensity",
	    value: function setDensity(density) {
	      this.density = density;
	      this.setSize(this.resolution.x, this.resolution.y);
	    }
	  }, {
	    key: "setSize",
	    value: function setSize(width, height) {
	      this.resolution.set(width, height);
	      this.uniforms.get("count").value = Math.round(height * this.density);
	    }
	  }]);

	  return ScanlineEffect;
	}(Effect);

	var SelectiveBloomEffect = function (_BloomEffect) {
	  _inherits(SelectiveBloomEffect, _BloomEffect);

	  var _super = _createSuper(SelectiveBloomEffect);

	  function SelectiveBloomEffect(scene, camera, options) {
	    var _this;

	    _classCallCheck(this, SelectiveBloomEffect);

	    _this = _super.call(this, options);
	    _this.scene = scene;
	    _this.camera = camera;
	    _this.clearPass = new ClearPass(true, true, false);
	    _this.clearPass.overrideClearColor = new three.Color(0x000000);
	    _this.renderPass = new RenderPass(scene, camera);
	    _this.renderPass.clear = false;
	    _this.blackoutPass = new RenderPass(scene, camera, new three.MeshBasicMaterial({
	      color: 0x000000
	    }));
	    _this.blackoutPass.clear = false;

	    _this.backgroundPass = function () {
	      var backgroundScene = new three.Scene();
	      var pass = new RenderPass(backgroundScene, camera);
	      backgroundScene.background = scene.background;
	      pass.clear = false;
	      return pass;
	    }();

	    _this.renderTargetSelection = new three.WebGLRenderTarget(1, 1, {
	      minFilter: three.LinearFilter,
	      magFilter: three.LinearFilter,
	      stencilBuffer: false,
	      depthBuffer: true
	    });
	    _this.renderTargetSelection.texture.name = "Bloom.Selection";
	    _this.renderTargetSelection.texture.generateMipmaps = false;
	    _this.selection = new Selection();
	    _this.inverted = false;
	    return _this;
	  }

	  _createClass(SelectiveBloomEffect, [{
	    key: "update",
	    value: function update(renderer, inputBuffer, deltaTime) {
	      var scene = this.scene;
	      var camera = this.camera;
	      var selection = this.selection;
	      var renderTarget = this.renderTargetSelection;
	      var background = scene.background;
	      var mask = camera.layers.mask;
	      this.clearPass.render(renderer, renderTarget);

	      if (!this.ignoreBackground) {
	        this.backgroundPass.render(renderer, renderTarget);
	      }

	      scene.background = null;

	      if (this.inverted) {
	        camera.layers.set(selection.layer);
	        this.blackoutPass.render(renderer, renderTarget);
	        camera.layers.mask = mask;
	        selection.setVisible(false);
	        this.renderPass.render(renderer, renderTarget);
	        selection.setVisible(true);
	      } else {
	        selection.setVisible(false);
	        this.blackoutPass.render(renderer, renderTarget);
	        selection.setVisible(true);
	        camera.layers.set(selection.layer);
	        this.renderPass.render(renderer, renderTarget);
	        camera.layers.mask = mask;
	      }

	      scene.background = background;

	      _get(_getPrototypeOf(SelectiveBloomEffect.prototype), "update", this).call(this, renderer, renderTarget, deltaTime);
	    }
	  }, {
	    key: "setSize",
	    value: function setSize(width, height) {
	      _get(_getPrototypeOf(SelectiveBloomEffect.prototype), "setSize", this).call(this, width, height);

	      this.backgroundPass.setSize(width, height);
	      this.blackoutPass.setSize(width, height);
	      this.renderPass.setSize(width, height);
	      this.renderTargetSelection.setSize(this.resolution.width, this.resolution.height);
	    }
	  }, {
	    key: "initialize",
	    value: function initialize(renderer, alpha, frameBufferType) {
	      _get(_getPrototypeOf(SelectiveBloomEffect.prototype), "initialize", this).call(this, renderer, alpha, frameBufferType);

	      this.backgroundPass.initialize(renderer, alpha, frameBufferType);
	      this.blackoutPass.initialize(renderer, alpha, frameBufferType);
	      this.renderPass.initialize(renderer, alpha, frameBufferType);

	      if (!alpha && frameBufferType === three.UnsignedByteType) {
	        this.renderTargetSelection.texture.format = three.RGBFormat;
	      }

	      if (frameBufferType !== undefined) {
	        this.renderTargetSelection.texture.type = frameBufferType;
	      }
	    }
	  }, {
	    key: "ignoreBackground",
	    get: function get() {
	      return !this.backgroundPass.enabled;
	    },
	    set: function set(value) {
	      this.backgroundPass.enabled = !value;
	    }
	  }]);

	  return SelectiveBloomEffect;
	}(BloomEffect);

	function createCanvas(width, height, data) {
	  var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
	  var context = canvas.getContext("2d");
	  var imageData = context.createImageData(width, height);
	  imageData.data.set(data);
	  canvas.width = width;
	  canvas.height = height;
	  context.putImageData(imageData, 0, 0);
	  return canvas;
	}

	var RawImageData = function () {
	  function RawImageData() {
	    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	    _classCallCheck(this, RawImageData);

	    this.width = width;
	    this.height = height;
	    this.data = data;
	  }

	  _createClass(RawImageData, [{
	    key: "toCanvas",
	    value: function toCanvas() {
	      return typeof document === "undefined" ? null : createCanvas(this.width, this.height, this.data);
	    }
	  }], [{
	    key: "from",
	    value: function from(data) {
	      return new RawImageData(data.width, data.height, data.data);
	    }
	  }]);

	  return RawImageData;
	}();

	exports.AdaptiveLuminanceMaterial = AdaptiveLuminanceMaterial;
	exports.BlendFunction = BlendFunction;
	exports.BlendMode = BlendMode;
	exports.BloomEffect = BloomEffect;
	exports.BlurPass = BlurPass;
	exports.ClearMaskPass = ClearMaskPass;
	exports.ClearPass = ClearPass;
	exports.ColorChannel = ColorChannel;
	exports.ColorEdgesMaterial = ColorEdgesMaterial;
	exports.ConvolutionMaterial = ConvolutionMaterial;
	exports.CopyMaterial = CopyMaterial;
	exports.DepthComparisonMaterial = DepthComparisonMaterial;
	exports.DepthDownsamplingMaterial = DepthDownsamplingMaterial;
	exports.DepthDownsamplingPass = DepthDownsamplingPass;
	exports.DepthMaskMaterial = DepthMaskMaterial;
	exports.DepthPass = DepthPass;
	exports.Disposable = Disposable;
	exports.DotScreenEffect = DotScreenEffect;
	exports.EdgeDetectionMaterial = EdgeDetectionMaterial;
	exports.EdgeDetectionMode = EdgeDetectionMode;
	exports.Effect = Effect;
	exports.EffectAttribute = EffectAttribute;
	exports.EffectComposer = EffectComposer;
	exports.EffectMaterial = EffectMaterial;
	exports.EffectPass = EffectPass;
	exports.GlitchEffect = GlitchEffect;
	exports.GlitchMode = GlitchMode;
	exports.Initializable = Initializable;
	exports.KernelSize = KernelSize;
	exports.LambdaPass = LambdaPass;
	exports.LuminanceMaterial = LuminanceMaterial;
	exports.MaskFunction = MaskFunction;
	exports.MaskMaterial = MaskMaterial;
	exports.MaskPass = MaskPass;
	exports.NoiseEffect = NoiseEffect;
	exports.NoiseTexture = NoiseTexture;
	exports.NormalPass = NormalPass;
	exports.OutlineEdgesMaterial = OutlineEdgesMaterial;
	exports.OutlineEffect = OutlineEffect;
	exports.OutlineMaterial = OutlineMaterial;
	exports.OverrideMaterialManager = OverrideMaterialManager;
	exports.Pass = Pass;
	exports.PixelationEffect = PixelationEffect;
	exports.PredicationMode = PredicationMode;
	exports.RawImageData = RawImageData;
	exports.RenderPass = RenderPass;
	exports.Resizable = Resizable;
	exports.Resizer = Resizer;
	exports.SavePass = SavePass;
	exports.ScanlineEffect = ScanlineEffect;
	exports.Section = Section;
	exports.Selection = Selection;
	exports.SelectiveBloomEffect = SelectiveBloomEffect;
	exports.ShaderPass = ShaderPass;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
