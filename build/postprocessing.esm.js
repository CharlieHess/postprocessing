/**
 * @charliehess/postprocessing v6.18.0 build Mon Nov 09 2020
 * https://github.com/charliehess/postprocessing
 * Copyright 2020 Raoul van Rüschen
 * @license Zlib
 */
import { ShaderMaterial, Uniform, Vector2, PerspectiveCamera, Camera, Scene, Mesh, BufferGeometry, BufferAttribute, WebGLRenderTarget, LinearFilter, UnsignedByteType, RGBFormat, Color, MeshDepthMaterial, RGBADepthPacking, NearestFilter, FloatType, EventDispatcher, MeshNormalMaterial, WebGLMultisampleRenderTarget, DepthTexture, DepthStencilFormat, UnsignedInt248Type, UnsignedIntType, RGBAFormat, DataTexture, LuminanceFormat, RedFormat, RGFormat, RepeatWrapping, MeshBasicMaterial } from 'three';

/**
 * A color channel enumeration.
 *
 * @type {Object}
 * @property {Number} RED - Red.
 * @property {Number} GREEN - Green.
 * @property {Number} BLUE - Blue.
 * @property {Number} ALPHA - Alpha.
 */

const ColorChannel = {

	RED: 0,
	GREEN: 1,
	BLUE: 2,
	ALPHA: 3

};

/**
 * The Disposable contract.
 *
 * Implemented by objects that can free internal resources.
 *
 * @interface
 */

class Disposable {

	/**
	 * Frees internal resources.
	 */

	dispose() {}

}

var fragmentShader = "uniform sampler2D previousLuminanceBuffer;uniform sampler2D currentLuminanceBuffer;uniform float minLuminance;uniform float deltaTime;uniform float tau;varying vec2 vUv;void main(){float previousLuminance=texture2D(previousLuminanceBuffer,vUv,MIP_LEVEL_1X1).r;float currentLuminance=texture2D(currentLuminanceBuffer,vUv,MIP_LEVEL_1X1).r;previousLuminance=max(minLuminance,previousLuminance);currentLuminance=max(minLuminance,currentLuminance);float adaptedLum=previousLuminance+(currentLuminance-previousLuminance)*(1.0-exp(-deltaTime*tau));gl_FragColor.r=adaptedLum;}";

var vertexShader = "varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}";

/**
 * An adaptive luminance shader material.
 */

class AdaptiveLuminanceMaterial extends ShaderMaterial {

	/**
	 * Constructs a new adaptive luminance material.
	 */

	constructor() {

		super({

			type: "AdaptiveLuminanceMaterial",

			defines: {
				MIP_LEVEL_1X1: "0.0"
			},

			uniforms: {
				previousLuminanceBuffer: new Uniform(null),
				currentLuminanceBuffer: new Uniform(null),
				minLuminance: new Uniform(0.01),
				deltaTime: new Uniform(0.0),
				tau: new Uniform(1.0)
			},

			fragmentShader,
			vertexShader,

			depthWrite: false,
			depthTest: false

		});

		/** @ignore */
		this.toneMapped = false;

	}

}

var fragmentShader$1 = "varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;\n#if EDGE_DETECTION_MODE != 0\nvarying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;\n#endif\n#if EDGE_DETECTION_MODE == 1\n#include <common>\n#endif\n#if EDGE_DETECTION_MODE == 0 || PREDICATION_MODE == 1\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D depthBuffer;\n#else\nuniform mediump sampler2D depthBuffer;\n#endif\nfloat readDepth(const in vec2 uv){\n#if DEPTH_PACKING == 3201\nreturn unpackRGBAToDepth(texture2D(depthBuffer,uv));\n#else\nreturn texture2D(depthBuffer,uv).r;\n#endif\n}vec3 gatherNeighbors(){float p=readDepth(vUv);float pLeft=readDepth(vUv0);float pTop=readDepth(vUv1);return vec3(p,pLeft,pTop);}\n#elif PREDICATION_MODE == 2\nuniform sampler2D predicationBuffer;vec3 gatherNeighbors(){float p=texture2D(predicationBuffer,vUv).r;float pLeft=texture2D(predicationBuffer,vUv0).r;float pTop=texture2D(predicationBuffer,vUv1).r;return vec3(p,pLeft,pTop);}\n#endif\n#if PREDICATION_MODE != 0\nvec2 calculatePredicatedThreshold(){vec3 neighbours=gatherNeighbors();vec2 delta=abs(neighbours.xx-neighbours.yz);vec2 edges=step(PREDICATION_THRESHOLD,delta);return PREDICATION_SCALE*EDGE_THRESHOLD*(1.0-PREDICATION_STRENGTH*edges);}\n#endif\n#if EDGE_DETECTION_MODE != 0\nuniform sampler2D inputBuffer;\n#endif\nvoid main(){\n#if EDGE_DETECTION_MODE == 0\nconst vec2 threshold=vec2(DEPTH_THRESHOLD);\n#elif PREDICATION_MODE != 0\nvec2 threshold=calculatePredicatedThreshold();\n#else\nconst vec2 threshold=vec2(EDGE_THRESHOLD);\n#endif\n#if EDGE_DETECTION_MODE == 0\nvec3 neighbors=gatherNeighbors();vec2 delta=abs(neighbors.xx-vec2(neighbors.y,neighbors.z));vec2 edges=step(threshold,delta);if(dot(edges,vec2(1.0))==0.0){discard;}gl_FragColor=vec4(edges,0.0,1.0);\n#elif EDGE_DETECTION_MODE == 1\nfloat l=linearToRelativeLuminance(texture2D(inputBuffer,vUv).rgb);float lLeft=linearToRelativeLuminance(texture2D(inputBuffer,vUv0).rgb);float lTop=linearToRelativeLuminance(texture2D(inputBuffer,vUv1).rgb);vec4 delta;delta.xy=abs(l-vec2(lLeft,lTop));vec2 edges=step(threshold,delta.xy);if(dot(edges,vec2(1.0))==0.0){discard;}float lRight=linearToRelativeLuminance(texture2D(inputBuffer,vUv2).rgb);float lBottom=linearToRelativeLuminance(texture2D(inputBuffer,vUv3).rgb);delta.zw=abs(l-vec2(lRight,lBottom));vec2 maxDelta=max(delta.xy,delta.zw);float lLeftLeft=linearToRelativeLuminance(texture2D(inputBuffer,vUv4).rgb);float lTopTop=linearToRelativeLuminance(texture2D(inputBuffer,vUv5).rgb);delta.zw=abs(vec2(lLeft,lTop)-vec2(lLeftLeft,lTopTop));maxDelta=max(maxDelta.xy,delta.zw);float finalDelta=max(maxDelta.x,maxDelta.y);edges.xy*=step(finalDelta,LOCAL_CONTRAST_ADAPTATION_FACTOR*delta.xy);gl_FragColor=vec4(edges,0.0,1.0);\n#elif EDGE_DETECTION_MODE == 2\nvec4 delta;vec3 c=texture2D(inputBuffer,vUv).rgb;vec3 cLeft=texture2D(inputBuffer,vUv0).rgb;vec3 t=abs(c-cLeft);delta.x=max(max(t.r,t.g),t.b);vec3 cTop=texture2D(inputBuffer,vUv1).rgb;t=abs(c-cTop);delta.y=max(max(t.r,t.g),t.b);vec2 edges=step(threshold,delta.xy);if(dot(edges,vec2(1.0))==0.0){discard;}vec3 cRight=texture2D(inputBuffer,vUv2).rgb;t=abs(c-cRight);delta.z=max(max(t.r,t.g),t.b);vec3 cBottom=texture2D(inputBuffer,vUv3).rgb;t=abs(c-cBottom);delta.w=max(max(t.r,t.g),t.b);vec2 maxDelta=max(delta.xy,delta.zw);vec3 cLeftLeft=texture2D(inputBuffer,vUv4).rgb;t=abs(c-cLeftLeft);delta.z=max(max(t.r,t.g),t.b);vec3 cTopTop=texture2D(inputBuffer,vUv5).rgb;t=abs(c-cTopTop);delta.w=max(max(t.r,t.g),t.b);maxDelta=max(maxDelta.xy,delta.zw);float finalDelta=max(maxDelta.x,maxDelta.y);edges*=step(finalDelta,LOCAL_CONTRAST_ADAPTATION_FACTOR*delta.xy);gl_FragColor=vec4(edges,0.0,1.0);\n#endif\n}";

var vertexShader$1 = "uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;\n#if EDGE_DETECTION_MODE != 0\nvarying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;\n#endif\nvoid main(){vUv=position.xy*0.5+0.5;vUv0=vUv+texelSize*vec2(-1.0,0.0);vUv1=vUv+texelSize*vec2(0.0,-1.0);\n#if EDGE_DETECTION_MODE != 0\nvUv2=vUv+texelSize*vec2(1.0,0.0);vUv3=vUv+texelSize*vec2(0.0,1.0);vUv4=vUv+texelSize*vec2(-2.0,0.0);vUv5=vUv+texelSize*vec2(0.0,-2.0);\n#endif\ngl_Position=vec4(position.xy,1.0,1.0);}";

/**
 * A material that detects edges in a color texture.
 *
 * @deprecated Use EdgeDetectionMaterial instead.
 */

class ColorEdgesMaterial extends ShaderMaterial {

	/**
	 * Constructs a new color edges material.
	 *
	 * @param {Vector2} [texelSize] - The absolute screen texel size.
	 */

	constructor(texelSize = new Vector2()) {

		super({

			type: "ColorEdgesMaterial",

			defines: {
				EDGE_DETECTION_MODE: "2",
				LOCAL_CONTRAST_ADAPTATION_FACTOR: "2.0",
				EDGE_THRESHOLD: "0.1"
			},

			uniforms: {
				inputBuffer: new Uniform(null),
				texelSize: new Uniform(texelSize)
			},

			fragmentShader: fragmentShader$1,
			vertexShader: vertexShader$1,

			depthWrite: false,
			depthTest: false

		});

		/** @ignore */
		this.toneMapped = false;

	}

	/**
	 * Sets the local contrast adaptation factor.
	 *
	 * If there is a neighbor edge that has _factor_ times bigger contrast than
	 * the current edge, the edge will be discarded.
	 *
	 * This allows to eliminate spurious crossing edges and is based on the fact
	 * that if there is too much contrast in a direction, the perceptual contrast
	 * in the other neighbors will be hidden.
	 *
	 * @param {Number} factor - The local contrast adaptation factor. Default is 2.0.
	 */

	setLocalContrastAdaptationFactor(factor) {

		this.defines.LOCAL_CONTRAST_ADAPTATION_FACTOR = factor.toFixed("2");
		this.needsUpdate = true;

	}

	/**
	 * Sets the edge detection sensitivity.
	 *
	 * A lower value results in more edges being detected at the expense of
	 * performance.
	 *
	 * 0.1 is a reasonable value, and allows to catch most visible edges.
	 * 0.05 is a rather overkill value, that allows to catch 'em all.
	 *
	 * If temporal supersampling is used, 0.2 could be a reasonable value, as low
	 * contrast edges are properly filtered by just 2x.
	 *
	 * @param {Number} threshold - The edge detection sensitivity. Range: [0.05, 0.5].
	 */

	setEdgeDetectionThreshold(threshold) {

		const t = Math.min(Math.max(threshold, 0.05), 0.5);
		this.defines.EDGE_THRESHOLD = t.toFixed("2");
		this.needsUpdate = true;

	}

}

var fragmentShader$2 = "#include <common>\n#include <dithering_pars_fragment>\nuniform sampler2D inputBuffer;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec4 sum=texture2D(inputBuffer,vUv0);sum+=texture2D(inputBuffer,vUv1);sum+=texture2D(inputBuffer,vUv2);sum+=texture2D(inputBuffer,vUv3);gl_FragColor=sum*0.25;\n#include <dithering_fragment>\n}";

var vertexShader$2 = "uniform vec2 texelSize;uniform vec2 halfTexelSize;uniform float kernel;uniform float scale;/*Packing multiple texture coordinates into one varying and using a swizzle toextract them in the fragment shader still causes a dependent texture read.*/varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vec2 dUv=(texelSize*vec2(kernel)+halfTexelSize)*scale;vUv0=vec2(uv.x-dUv.x,uv.y+dUv.y);vUv1=vec2(uv.x+dUv.x,uv.y+dUv.y);vUv2=vec2(uv.x+dUv.x,uv.y-dUv.y);vUv3=vec2(uv.x-dUv.x,uv.y-dUv.y);gl_Position=vec4(position.xy,1.0,1.0);}";

/**
 * An optimised convolution shader material.
 *
 * This material supports dithering.
 *
 * Based on the GDC2003 Presentation by Masaki Kawase, Bunkasha Games:
 *  Frame Buffer Postprocessing Effects in DOUBLE-S.T.E.A.L (Wreckless)
 * and an article by Filip Strugar, Intel:
 *  An investigation of fast real-time GPU-based image blur algorithms
 *
 * Further modified according to Apple's
 * [Best Practices for Shaders](https://goo.gl/lmRoM5).
 *
 * @todo Remove dithering code from fragment shader.
 */

class ConvolutionMaterial extends ShaderMaterial {

	/**
	 * Constructs a new convolution material.
	 *
	 * @param {Vector2} [texelSize] - The absolute screen texel size.
	 */

	constructor(texelSize = new Vector2()) {

		super({

			type: "ConvolutionMaterial",

			uniforms: {
				inputBuffer: new Uniform(null),
				texelSize: new Uniform(new Vector2()),
				halfTexelSize: new Uniform(new Vector2()),
				kernel: new Uniform(0.0),
				scale: new Uniform(1.0)
			},

			fragmentShader: fragmentShader$2,
			vertexShader: vertexShader$2,

			depthWrite: false,
			depthTest: false

		});

		/** @ignore */
		this.toneMapped = false;

		this.setTexelSize(texelSize.x, texelSize.y);

		/**
		 * The current kernel size.
		 *
		 * @type {KernelSize}
		 */

		this.kernelSize = KernelSize.LARGE;

	}

	/**
	 * Returns the kernel.
	 *
	 * @return {Float32Array} The kernel.
	 */

	getKernel() {

		return kernelPresets[this.kernelSize];

	}

	/**
	 * Sets the texel size.
	 *
	 * @param {Number} x - The texel width.
	 * @param {Number} y - The texel height.
	 */

	setTexelSize(x, y) {

		this.uniforms.texelSize.value.set(x, y);
		this.uniforms.halfTexelSize.value.set(x, y).multiplyScalar(0.5);

	}

}

/**
 * The Kawase blur kernel presets.
 *
 * @type {Float32Array[]}
 * @private
 */

const kernelPresets = [
	new Float32Array([0.0, 0.0]),
	new Float32Array([0.0, 1.0, 1.0]),
	new Float32Array([0.0, 1.0, 1.0, 2.0]),
	new Float32Array([0.0, 1.0, 2.0, 2.0, 3.0]),
	new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0, 4.0, 5.0]),
	new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 7.0, 8.0, 9.0, 10.0])
];

/**
 * A kernel size enumeration.
 *
 * @type {Object}
 * @property {Number} VERY_SMALL - A very small kernel that matches a 7x7 Gauss blur kernel.
 * @property {Number} SMALL - A small kernel that matches a 15x15 Gauss blur kernel.
 * @property {Number} MEDIUM - A medium sized kernel that matches a 23x23 Gauss blur kernel.
 * @property {Number} LARGE - A large kernel that matches a 35x35 Gauss blur kernel.
 * @property {Number} VERY_LARGE - A very large kernel that matches a 63x63 Gauss blur kernel.
 * @property {Number} HUGE - A huge kernel that matches a 127x127 Gauss blur kernel.
 */

const KernelSize = {

	VERY_SMALL: 0,
	SMALL: 1,
	MEDIUM: 2,
	LARGE: 3,
	VERY_LARGE: 4,
	HUGE: 5

};

var fragmentShader$3 = "uniform sampler2D inputBuffer;uniform float opacity;varying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);gl_FragColor=opacity*texel;\n#include <encodings_fragment>\n}";

/**
 * A simple copy shader material.
 */

class CopyMaterial extends ShaderMaterial {

	/**
	 * Constructs a new copy material.
	 */

	constructor() {

		super({

			type: "CopyMaterial",

			uniforms: {
				inputBuffer: new Uniform(null),
				opacity: new Uniform(1.0)
			},

			fragmentShader: fragmentShader$3,
			vertexShader,

			depthWrite: false,
			depthTest: false

		});

		/** @ignore */
		this.toneMapped = false;

	}

}

var fragmentShader$4 = "#include <packing>\n#include <clipping_planes_pars_fragment>\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D depthBuffer;\n#else\nuniform mediump sampler2D depthBuffer;\n#endif\nuniform float cameraNear;uniform float cameraFar;varying float vViewZ;varying vec4 vProjTexCoord;void main(){\n#include <clipping_planes_fragment>\nvec2 projTexCoord=(vProjTexCoord.xy/vProjTexCoord.w)*0.5+0.5;projTexCoord=clamp(projTexCoord,0.002,0.998);float fragCoordZ=unpackRGBAToDepth(texture2D(depthBuffer,projTexCoord));\n#ifdef PERSPECTIVE_CAMERA\nfloat viewZ=perspectiveDepthToViewZ(fragCoordZ,cameraNear,cameraFar);\n#else\nfloat viewZ=orthographicDepthToViewZ(fragCoordZ,cameraNear,cameraFar);\n#endif\nfloat depthTest=(-vViewZ>-viewZ)? 1.0 : 0.0;gl_FragColor.rg=vec2(0.0,depthTest);}";

var vertexShader$3 = "#include <common>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvarying float vViewZ;varying vec4 vProjTexCoord;void main(){\n#include <skinbase_vertex>\n#include <begin_vertex>\n#include <morphtarget_vertex>\n#include <skinning_vertex>\n#include <project_vertex>\nvViewZ=mvPosition.z;vProjTexCoord=gl_Position;\n#include <clipping_planes_vertex>\n}";

/**
 * A depth comparison shader material.
 */

class DepthComparisonMaterial extends ShaderMaterial {

	/**
	 * Constructs a new depth comparison material.
	 *
	 * @param {Texture} [depthTexture=null] - A depth texture.
	 * @param {PerspectiveCamera} [camera] - A camera.
	 */

	constructor(depthTexture = null, camera) {

		super({

			type: "DepthComparisonMaterial",

			uniforms: {
				depthBuffer: new Uniform(depthTexture),
				cameraNear: new Uniform(0.3),
				cameraFar: new Uniform(1000)
			},

			fragmentShader: fragmentShader$4,
			vertexShader: vertexShader$3,

			depthWrite: false,
			depthTest: false,

			morphTargets: true,
			skinning: true

		});

		/** @ignore */
		this.toneMapped = false;

		this.adoptCameraSettings(camera);

	}

	/**
	 * Adopts the settings of the given camera.
	 *
	 * @param {Camera} [camera=null] - A camera.
	 */

	adoptCameraSettings(camera = null) {

		if(camera !== null) {

			this.uniforms.cameraNear.value = camera.near;
			this.uniforms.cameraFar.value = camera.far;

			if(camera instanceof PerspectiveCamera) {

				this.defines.PERSPECTIVE_CAMERA = "1";

			} else {

				delete this.defines.PERSPECTIVE_CAMERA;

			}

		}

	}

}

var fragmentShader$5 = "#include <packing>\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D depthBuffer;\n#else\nuniform mediump sampler2D depthBuffer;\n#endif\n#ifdef DOWNSAMPLE_NORMALS\nuniform sampler2D normalBuffer;\n#endif\nvarying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;float readDepth(const in vec2 uv){\n#if DEPTH_PACKING == 3201\nreturn unpackRGBAToDepth(texture2D(depthBuffer,uv));\n#else\nreturn texture2D(depthBuffer,uv).r;\n#endif\n}/***Returns the index of the most representative depth in the 2x2 neighborhood.*/int findBestDepth(const in float samples[4]){float c=(samples[0]+samples[1]+samples[2]+samples[3])/4.0;float distances[4]=float[](abs(c-samples[0]),abs(c-samples[1]),abs(c-samples[2]),abs(c-samples[3]));float maxDistance=max(max(distances[0],distances[1]),max(distances[2],distances[3]));int remaining[3];int rejected[3];int i,j,k;for(i=0,j=0,k=0;i<4;++i){if(distances[i]<maxDistance){remaining[j++]=i;}else{rejected[k++]=i;}}for(;j<3;++j){remaining[j]=rejected[--k];}vec3 s=vec3(samples[remaining[0]],samples[remaining[1]],samples[remaining[2]]);c=(s.x+s.y+s.z)/3.0;distances[0]=abs(c-s.x);distances[1]=abs(c-s.y);distances[2]=abs(c-s.z);float minDistance=min(distances[0],min(distances[1],distances[2]));for(i=0;i<3;++i){if(distances[i]==minDistance){break;}}return remaining[i];}void main(){float d[4]=float[](readDepth(vUv0),readDepth(vUv1),readDepth(vUv2),readDepth(vUv3));int index=findBestDepth(d);\n#ifdef DOWNSAMPLE_NORMALS\nvec2 uvs[4]=vec2[](vUv0,vUv1,vUv2,vUv3);vec3 n=texture2D(normalBuffer,uvs[index]).rgb;\n#else\nvec3 n=vec3(0.0);\n#endif\ngl_FragColor=vec4(n,d[index]);}";

var vertexShader$4 = "uniform vec2 texelSize;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vUv0=uv;vUv1=vec2(uv.x,uv.y+texelSize.y);vUv2=vec2(uv.x+texelSize.x,uv.y);vUv3=uv+texelSize;gl_Position=vec4(position.xy,1.0,1.0);}";

/**
 * A depth downsampling shader material.
 *
 * Based on an article by Eleni Maria Stea:
 * https://eleni.mutantstargoat.com/hikiko/depth-aware-upsampling-6
 */

class DepthDownsamplingMaterial extends ShaderMaterial {

	/**
	 * Constructs a new depth downsampling material.
	 */

	constructor() {

		super({

			type: "DepthDownsamplingMaterial",

			defines: {
				DEPTH_PACKING: "0"
			},

			uniforms: {
				depthBuffer: new Uniform(null),
				normalBuffer: new Uniform(null),
				texelSize: new Uniform(new Vector2())
			},

			fragmentShader: fragmentShader$5,
			vertexShader: vertexShader$4,

			depthWrite: false,
			depthTest: false

		});

		/** @ignore */
		this.toneMapped = false;

	}

	/**
	 * The depth packing of the source depth buffer.
	 *
	 * @type {Number}
	 */

	get depthPacking() {

		return Number(this.defines.DEPTH_PACKING);

	}

	/**
	 * Sets the depth packing.
	 *
	 * @type {Number}
	 */

	set depthPacking(value) {

		this.defines.DEPTH_PACKING = value.toFixed(0);
		this.needsUpdate = true;

	}

	/**
	 * Sets the texel size.
	 *
	 * @param {Number} x - The texel width.
	 * @param {Number} y - The texel height.
	 */

	setTexelSize(x, y) {

		this.uniforms.texelSize.value.set(x, y);

	}

}

var fragmentShader$6 = "#include <common>\n#include <packing>\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D depthBuffer0;uniform highp sampler2D depthBuffer1;\n#else\nuniform mediump sampler2D depthBuffer0;uniform mediump sampler2D depthBuffer1;\n#endif\nuniform sampler2D inputBuffer;varying vec2 vUv;void main(){\n#if DEPTH_PACKING_0 == 3201\nfloat d0=unpackRGBAToDepth(texture2D(depthBuffer0,vUv));\n#else\nfloat d0=texture2D(depthBuffer0,vUv).r;\n#endif\n#if DEPTH_PACKING_1 == 3201\nfloat d1=unpackRGBAToDepth(texture2D(depthBuffer1,vUv));\n#else\nfloat d1=texture2D(depthBuffer1,vUv).r;\n#endif\nif(d0<d1){discard;}gl_FragColor=texture2D(inputBuffer,vUv);}";

/**
 * A depth mask shader material.
 *
 * This material masks a color buffer by comparing two depth textures.
 */

class DepthMaskMaterial extends ShaderMaterial {

	/**
	 * Constructs a new depth mask material.
	 */

	constructor() {

		super({

			type: "DepthMaskMaterial",

			defines: {
				DEPTH_PACKING_0: "0",
				DEPTH_PACKING_1: "0"
			},

			uniforms: {
				depthBuffer0: new Uniform(null),
				depthBuffer1: new Uniform(null),
				inputBuffer: new Uniform(null)
			},

			fragmentShader: fragmentShader$6,
			vertexShader,

			depthWrite: false,
			depthTest: false

		});

		/** @ignore */
		this.toneMapped = false;

	}

}

/**
 * An edge detection material.
 *
 * Mainly used for Subpixel Morphological Antialiasing.
 */

class EdgeDetectionMaterial extends ShaderMaterial {

	/**
	 * Constructs a new edge detection material.
	 *
	 * @param {Vector2} [texelSize] - The screen texel size.
	 * @param {EdgeDetectionMode} [mode=EdgeDetectionMode.COLOR] - The edge detection mode.
	 * @todo Remove texelSize parameter.
	 */

	constructor(texelSize = new Vector2(), mode = EdgeDetectionMode.COLOR) {

		super({

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
				inputBuffer: new Uniform(null),
				depthBuffer: new Uniform(null),
				predicationBuffer: new Uniform(null),
				texelSize: new Uniform(texelSize)
			},

			fragmentShader: fragmentShader$1,
			vertexShader: vertexShader$1,
			depthWrite: false,
			depthTest: false

		});

		/** @ignore */
		this.toneMapped = false;

		this.setEdgeDetectionMode(mode);

	}

	/**
	 * The current depth packing.
	 *
	 * @type {Number}
	 */

	get depthPacking() {

		return Number(this.defines.DEPTH_PACKING);

	}

	/**
	 * Sets the depth packing.
	 *
	 * @type {Number}
	 */

	set depthPacking(value) {

		this.defines.DEPTH_PACKING = value.toFixed(0);
		this.needsUpdate = true;

	}

	/**
	 * Sets the edge detection mode.
	 *
	 * @param {EdgeDetectionMode} mode - The edge detection mode.
	 */

	setEdgeDetectionMode(mode) {

		this.defines.EDGE_DETECTION_MODE = mode.toFixed(0);
		this.needsUpdate = true;

	}

	/**
	 * Sets the local contrast adaptation factor. Has no effect if the edge
	 * detection mode is set to DEPTH.
	 *
	 * If there is a neighbor edge that has _factor_ times bigger contrast than
	 * the current edge, the edge will be discarded.
	 *
	 * This allows to eliminate spurious crossing edges and is based on the fact
	 * that if there is too much contrast in a direction, the perceptual contrast
	 * in the other neighbors will be hidden.
	 *
	 * @param {Number} factor - The local contrast adaptation factor. Default is 2.0.
	 */

	setLocalContrastAdaptationFactor(factor) {

		this.defines.LOCAL_CONTRAST_ADAPTATION_FACTOR = factor.toFixed("6");
		this.needsUpdate = true;

	}

	/**
	 * Sets the edge detection sensitivity.
	 *
	 * A lower value results in more edges being detected at the expense of
	 * performance.
	 *
	 * For luma- and chroma-based edge detection, 0.1 is a reasonable value and
	 * allows to catch most visible edges. 0.05 is a rather overkill value that
	 * allows to catch 'em all. Darker scenes may require an even lower threshold.
	 *
	 * If depth-based edge detection is used, the threshold will depend on the
	 * scene depth.
	 *
	 * @param {Number} threshold - The edge detection sensitivity. Range: [0.0, 0.5].
	 */

	setEdgeDetectionThreshold(threshold) {

		this.defines.EDGE_THRESHOLD = threshold.toFixed("6");
		this.defines.DEPTH_THRESHOLD = (threshold * 0.1).toFixed("6");
		this.needsUpdate = true;

	}

	/**
	 * Sets the predication mode.
	 *
	 * Predicated thresholding allows to better preserve texture details and to
	 * improve edge detection using an additional buffer such as a light
	 * accumulation or depth buffer.
	 *
	 * @param {PredicationMode} mode - The predication mode.
	 */

	setPredicationMode(mode) {

		this.defines.PREDICATION_MODE = mode.toFixed(0);
		this.needsUpdate = true;

	}

	/**
	 * Sets a custom predication buffer.
	 *
	 * @param {Texture} predicationBuffer - The predication buffer.
	 */

	setPredicationBuffer(predicationBuffer) {

		this.uniforms.predicationBuffer.value = predicationBuffer;

	}

	/**
	 * Sets the predication threshold.
	 *
	 * @param {Number} threshold - The threshold.
	 */

	setPredicationThreshold(threshold) {

		this.defines.PREDICATION_THRESHOLD = threshold.toFixed("6");
		this.needsUpdate = true;

	}

	/**
	 * Sets the predication scale.
	 *
	 * Determines how much the edge detection threshold should be scaled when
	 * using predication.
	 *
	 * @param {Number} scale - The scale. Range: [1.0, 5.0].
	 */

	setPredicationScale(scale) {

		this.defines.PREDICATION_SCALE = scale.toFixed("6");
		this.needsUpdate = true;

	}

	/**
	 * Sets the predication strength.
	 *
	 * Determines how much the edge detection threshold should be decreased
	 * locally when using predication.
	 *
	 * @param {Number} strength - The strength. Range: [0.0, 1.0].
	 */

	setPredicationStrength(strength) {

		this.defines.PREDICATION_STRENGTH = strength.toFixed("6");
		this.needsUpdate = true;

	}

}

/**
 * An enumeration of edge detection modes.
 *
 * @type {Object}
 * @property {Number} DEPTH - Depth-based edge detection.
 * @property {Number} LUMA - Luminance-based edge detection.
 * @property {Number} COLOR - Chroma-based edge detection.
 */

const EdgeDetectionMode = {

	DEPTH: 0,
	LUMA: 1,
	COLOR: 2

};

/**
 * An enumeration of predication modes.
 *
 * @type {Object}
 * @property {Number} DISABLED - No predicated thresholding.
 * @property {Number} DEPTH - Depth-based predicated thresholding.
 * @property {Number} CUSTOM - Predicated thresholding using a custom buffer.
 */

const PredicationMode = {

	DISABLED: 0,
	DEPTH: 1,
	CUSTOM: 2

};

var fragmentTemplate = "#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\nuniform sampler2D inputBuffer;\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nuniform highp sampler2D depthBuffer;\n#else\nuniform mediump sampler2D depthBuffer;\n#endif\nuniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;float readDepth(const in vec2 uv){\n#if DEPTH_PACKING == 3201\nreturn unpackRGBAToDepth(texture2D(depthBuffer,uv));\n#else\nreturn texture2D(depthBuffer,uv).r;\n#endif\n}float getViewZ(const in float depth){\n#ifdef PERSPECTIVE_CAMERA\nreturn perspectiveDepthToViewZ(depth,cameraNear,cameraFar);\n#else\nreturn orthographicDepthToViewZ(depth,cameraNear,cameraFar);\n#endif\n}FRAGMENT_HEADvoid main(){FRAGMENT_MAIN_UVvec4 color0=texture2D(inputBuffer,UV);vec4 color1=vec4(0.0);FRAGMENT_MAIN_IMAGEgl_FragColor=color0;\n#ifdef ENCODE_OUTPUT\n#include <encodings_fragment>\n#endif\n#include <dithering_fragment>\n}";

var vertexTemplate = "uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;VERTEX_HEADvoid main(){vUv=position.xy*0.5+0.5;VERTEX_MAIN_SUPPORTgl_Position=vec4(position.xy,1.0,1.0);}";

/**
 * An effect material for compound shaders.
 *
 * This material supports dithering.
 *
 * @implements {Resizable}
 */

class EffectMaterial extends ShaderMaterial {

	/**
	 * Constructs a new effect material.
	 *
	 * @param {Map<String, String>} [shaderParts=null] - A collection of shader snippets. See {@link Section}.
	 * @param {Map<String, String>} [defines=null] - A collection of preprocessor macro definitions.
	 * @param {Map<String, Uniform>} [uniforms=null] - A collection of uniforms.
	 * @param {Camera} [camera] - A camera.
	 * @param {Boolean} [dithering=false] - Whether dithering should be enabled.
	 */

	constructor(shaderParts = null, defines = null, uniforms = null, camera, dithering = false) {

		super({

			type: "EffectMaterial",

			defines: {
				DEPTH_PACKING: "0",
				ENCODE_OUTPUT: "1"
			},

			uniforms: {
				inputBuffer: new Uniform(null),
				depthBuffer: new Uniform(null),
				resolution: new Uniform(new Vector2()),
				texelSize: new Uniform(new Vector2()),
				cameraNear: new Uniform(0.3),
				cameraFar: new Uniform(1000.0),
				aspect: new Uniform(1.0),
				time: new Uniform(0.0)
			},

			depthWrite: false,
			depthTest: false,
			dithering

		});

		/** @ignore */
		this.toneMapped = false;

		if(shaderParts !== null) {

			this.setShaderParts(shaderParts);

		}

		if(defines !== null) {

			this.setDefines(defines);

		}

		if(uniforms !== null) {

			this.setUniforms(uniforms);

		}

		this.adoptCameraSettings(camera);

	}

	/**
	 * The current depth packing.
	 *
	 * @type {Number}
	 */

	get depthPacking() {

		return Number(this.defines.DEPTH_PACKING);

	}

	/**
	 * Sets the depth packing.
	 *
	 * Use `BasicDepthPacking` or `RGBADepthPacking` if your depth texture
	 * contains packed depth.
	 *
	 * @type {Number}
	 */

	set depthPacking(value) {

		this.defines.DEPTH_PACKING = value.toFixed(0);
		this.needsUpdate = true;

	}

	/**
	 * Sets the shader parts.
	 *
	 * @param {Map<String, String>} shaderParts - A collection of shader snippets. See {@link Section}.
	 * @return {EffectMaterial} This material.
	 */

	setShaderParts(shaderParts) {

		this.fragmentShader = fragmentTemplate
			.replace(Section.FRAGMENT_HEAD, shaderParts.get(Section.FRAGMENT_HEAD))
			.replace(Section.FRAGMENT_MAIN_UV, shaderParts.get(Section.FRAGMENT_MAIN_UV))
			.replace(Section.FRAGMENT_MAIN_IMAGE, shaderParts.get(Section.FRAGMENT_MAIN_IMAGE));

		this.vertexShader = vertexTemplate
			.replace(Section.VERTEX_HEAD, shaderParts.get(Section.VERTEX_HEAD))
			.replace(Section.VERTEX_MAIN_SUPPORT, shaderParts.get(Section.VERTEX_MAIN_SUPPORT));

		this.needsUpdate = true;

		return this;

	}

	/**
	 * Sets the shader macros.
	 *
	 * @param {Map<String, String>} defines - A collection of preprocessor macro definitions.
	 * @return {EffectMaterial} This material.
	 */

	setDefines(defines) {

		for(const entry of defines.entries()) {

			this.defines[entry[0]] = entry[1];

		}

		this.needsUpdate = true;

		return this;

	}

	/**
	 * Sets the shader uniforms.
	 *
	 * @param {Map<String, Uniform>} uniforms - A collection of uniforms.
	 * @return {EffectMaterial} This material.
	 */

	setUniforms(uniforms) {

		for(const entry of uniforms.entries()) {

			this.uniforms[entry[0]] = entry[1];

		}

		return this;

	}

	/**
	 * Adopts the settings of the given camera.
	 *
	 * @param {Camera} [camera=null] - A camera.
	 */

	adoptCameraSettings(camera = null) {

		if(camera !== null) {

			this.uniforms.cameraNear.value = camera.near;
			this.uniforms.cameraFar.value = camera.far;

			if(camera instanceof PerspectiveCamera) {

				this.defines.PERSPECTIVE_CAMERA = "1";

			} else {

				delete this.defines.PERSPECTIVE_CAMERA;

			}

			this.needsUpdate = true;

		}

	}

	/**
	 * Sets the resolution.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 */

	setSize(width, height) {

		const w = Math.max(width, 1);
		const h = Math.max(height, 1);

		this.uniforms.resolution.value.set(w, h);
		this.uniforms.texelSize.value.set(1.0 / w, 1.0 / h);
		this.uniforms.aspect.value = w / h;

	}

}

/**
 * An enumeration of shader code placeholders used by the {@link EffectPass}.
 *
 * @type {Object}
 * @property {String} FRAGMENT_HEAD - A placeholder for function and variable declarations inside the fragment shader.
 * @property {String} FRAGMENT_MAIN_UV - A placeholder for UV transformations inside the fragment shader.
 * @property {String} FRAGMENT_MAIN_IMAGE - A placeholder for color calculations inside the fragment shader.
 * @property {String} VERTEX_HEAD - A placeholder for function and variable declarations inside the vertex shader.
 * @property {String} VERTEX_MAIN_SUPPORT - A placeholder for supporting calculations inside the vertex shader.
 */

const Section = {

	FRAGMENT_HEAD: "FRAGMENT_HEAD",
	FRAGMENT_MAIN_UV: "FRAGMENT_MAIN_UV",
	FRAGMENT_MAIN_IMAGE: "FRAGMENT_MAIN_IMAGE",
	VERTEX_HEAD: "VERTEX_HEAD",
	VERTEX_MAIN_SUPPORT: "VERTEX_MAIN_SUPPORT"

};

var fragmentShader$7 = "#include <common>\nuniform sampler2D inputBuffer;\n#ifdef RANGE\nuniform vec2 range;\n#elif defined(THRESHOLD)\nuniform float threshold;uniform float smoothing;\n#endif\nvarying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);float l=linearToRelativeLuminance(texel.rgb);\n#ifdef RANGE\nfloat low=step(range.x,l);float high=step(l,range.y);l*=low*high;\n#elif defined(THRESHOLD)\nl=smoothstep(threshold,threshold+smoothing,l);\n#endif\n#ifdef COLOR\ngl_FragColor=vec4(texel.rgb*l,l);\n#else\ngl_FragColor=vec4(l);\n#endif\n}";

/**
 * A luminance shader material.
 *
 * This shader produces a greyscale luminance map that describes the absolute
 * amount of light emitted by a scene. It can also be configured to output
 * colours that are scaled with their respective luminance value. Additionally,
 * a range may be provided to mask out undesired texels.
 *
 * The alpha channel always contains the luminance value.
 *
 * On luminance coefficients:
 *  http://www.poynton.com/notes/colour_and_gamma/ColorFAQ.html#RTFToC9
 *
 * Coefficients for different colour spaces:
 *  https://hsto.org/getpro/habr/post_images/2ab/69d/084/2ab69d084f9a597e032624bcd74d57a7.png
 *
 * Luminance range reference:
 *  https://cycling74.com/2007/05/23/your-first-shader/#.Vty9FfkrL4Z
 */

class LuminanceMaterial extends ShaderMaterial {

	/**
	 * Constructs a new luminance material.
	 *
	 * @param {Boolean} [colorOutput=false] - Defines whether the shader should output colors scaled with their luminance value.
	 * @param {Vector2} [luminanceRange] - If provided, the shader will mask out texels that aren't in the specified luminance range.
	 */

	constructor(colorOutput = false, luminanceRange = null) {

		const useRange = (luminanceRange !== null);

		super({

			type: "LuminanceMaterial",

			uniforms: {
				inputBuffer: new Uniform(null),
				threshold: new Uniform(0.0),
				smoothing: new Uniform(1.0),
				range: new Uniform(useRange ? luminanceRange : new Vector2())
			},

			fragmentShader: fragmentShader$7,
			vertexShader,

			depthWrite: false,
			depthTest: false

		});

		/** @ignore */
		this.toneMapped = false;

		this.colorOutput = colorOutput;
		this.useThreshold = true;
		this.useRange = useRange;

	}

	/**
	 * The luminance threshold.
	 *
	 * @type {Number}
	 */

	get threshold() {

		return this.uniforms.threshold.value;

	}

	/**
	 * Sets the luminance threshold.
	 *
	 * @type {Number}
	 */

	set threshold(value) {

		this.uniforms.threshold.value = value;

	}

	/**
	 * The luminance threshold smoothing.
	 *
	 * @type {Number}
	 */

	get smoothing() {

		return this.uniforms.smoothing.value;

	}

	/**
	 * Sets the luminance threshold smoothing.
	 *
	 * @type {Number}
	 */

	set smoothing(value) {

		this.uniforms.smoothing.value = value;

	}

	/**
	 * Indicates whether the luminance threshold is enabled.
	 *
	 * @type {Boolean}
	 */

	get useThreshold() {

		return (this.defines.THRESHOLD !== undefined);

	}

	/**
	 * Enables or disables the luminance threshold.
	 *
	 * @type {Boolean}
	 */

	set useThreshold(value) {

		if(value) {

			this.defines.THRESHOLD = "1";

		} else {

			delete this.defines.THRESHOLD;

		}

		this.needsUpdate = true;

	}

	/**
	 * Indicates whether color output is enabled.
	 *
	 * @type {Boolean}
	 */

	get colorOutput() {

		return (this.defines.COLOR !== undefined);

	}

	/**
	 * Enables or disables color output.
	 *
	 * @type {Boolean}
	 */

	set colorOutput(value) {

		if(value) {

			this.defines.COLOR = "1";

		} else {

			delete this.defines.COLOR;

		}

		this.needsUpdate = true;

	}

	/**
	 * Enables or disables color output.
	 *
	 * @deprecated Use colorOutput instead.
	 * @param {Boolean} enabled - Whether color output should be enabled.
	 */

	setColorOutputEnabled(enabled) {

		this.colorOutput = enabled;

	}

	/**
	 * Indicates whether luminance masking is enabled.
	 *
	 * @type {Boolean}
	 */

	get useRange() {

		return (this.defines.RANGE !== undefined);

	}

	/**
	 * Enables or disables luminance masking.
	 *
	 * If enabled, the threshold will be ignored.
	 *
	 * @type {Boolean}
	 */

	set useRange(value) {

		if(value) {

			this.defines.RANGE = "1";

		} else {

			delete this.defines.RANGE;

		}

		this.needsUpdate = true;

	}

	/**
	 * Indicates whether luminance masking is enabled.
	 *
	 * @type {Boolean}
	 * @deprecated Use useRange instead.
	 */

	get luminanceRange() {

		return this.useRange;

	}

	/**
	 * Enables or disables luminance masking.
	 *
	 * @type {Boolean}
	 * @deprecated Use useRange instead.
	 */

	set luminanceRange(value) {

		this.useRange = value;

	}

	/**
	 * Enables or disables the luminance mask.
	 *
	 * @deprecated Use luminanceRange instead.
	 * @param {Boolean} enabled - Whether the luminance mask should be enabled.
	 */

	setLuminanceRangeEnabled(enabled) {

		this.useRange = enabled;

	}

}

var fragmentShader$8 = "uniform sampler2D maskTexture;uniform sampler2D inputBuffer;\n#if MASK_FUNCTION != 0\nuniform float strength;\n#endif\nvarying vec2 vUv;void main(){\n#if COLOR_CHANNEL == 0\nfloat mask=texture2D(maskTexture,vUv).r;\n#elif COLOR_CHANNEL == 1\nfloat mask=texture2D(maskTexture,vUv).g;\n#elif COLOR_CHANNEL == 2\nfloat mask=texture2D(maskTexture,vUv).b;\n#else\nfloat mask=texture2D(maskTexture,vUv).a;\n#endif\n#if MASK_FUNCTION == 0\n#ifdef INVERTED\nif(mask>0.0){discard;}\n#else\nif(mask==0.0){discard;}\n#endif\n#else\nmask=clamp(mask*strength,0.0,1.0);\n#ifdef INVERTED\nmask=(1.0-mask);\n#endif\n#if MASK_FUNCTION == 1\ngl_FragColor=mask*texture2D(inputBuffer,vUv);\n#else\ngl_FragColor=vec4(mask*texture2D(inputBuffer,vUv).rgb,mask);\n#endif\n#endif\n}";

/**
 * A mask shader material.
 *
 * This material applies a mask texture to a buffer.
 */

class MaskMaterial extends ShaderMaterial {

	/**
	 * Constructs a new mask material.
	 *
	 * @param {Texture} [maskTexture] - The mask texture.
	 */

	constructor(maskTexture = null) {

		super({

			type: "MaskMaterial",

			uniforms: {
				maskTexture: new Uniform(maskTexture),
				inputBuffer: new Uniform(null),
				strength: new Uniform(1.0)
			},

			fragmentShader: fragmentShader$8,
			vertexShader,

			depthWrite: false,
			depthTest: false

		});

		/** @ignore */
		this.toneMapped = false;

		this.colorChannel = ColorChannel.RED;
		this.maskFunction = MaskFunction.DISCARD;

	}

	/**
	 * Sets the mask texture.
	 *
	 * @type {Texture}
	 */

	set maskTexture(value) {

		this.uniforms.maskTexture.value = value;

	}

	/**
	 * Sets the color channel to use for masking.
	 *
	 * The default channel is `RED`.
	 *
	 * @type {ColorChannel}
	 */

	set colorChannel(value) {

		this.defines.COLOR_CHANNEL = value.toFixed(0);
		this.needsUpdate = true;

	}

	/**
	 * Sets the masking technique.
	 *
	 * The default function is `DISCARD`.
	 *
	 * @type {MaskFunction}
	 */

	set maskFunction(value) {

		this.defines.MASK_FUNCTION = value.toFixed(0);
		this.needsUpdate = true;

	}

	/**
	 * Indicates whether the masking is inverted.
	 *
	 * @type {Boolean}
	 */

	get inverted() {

		return (this.defines.INVERTED !== undefined);

	}

	/**
	 * Determines whether the masking should be inverted.
	 *
	 * @type {Boolean}
	 */

	set inverted(value) {

		if(this.inverted && !value) {

			delete this.defines.INVERTED;

		} else if(value) {

			this.defines.INVERTED = "1";

		}

		this.needsUpdate = true;

	}

	/**
	 * The current mask strength.
	 *
	 * Individual mask values will be clamped to [0.0, 1.0].
	 *
	 * @type {Number}
	 */

	get strength() {

		return this.uniforms.strength.value;

	}

	/**
	 * Sets the strength of the mask.
	 *
	 * Has no effect when the mask function is set to `DISCARD`.
	 *
	 * @type {Number}
	 */

	set strength(value) {

		this.uniforms.strength.value = value;

	}

}

/**
 * A mask function enumeration.
 *
 * @type {Object}
 * @property {Number} DISCARD - Discards elements when the respective mask value is zero.
 * @property {Number} MULTIPLY - Multiplies the input buffer with the mask texture.
 * @property {Number} MULTIPLY_RGB_SET_ALPHA - Multiplies the input RGB values with the mask and sets alpha to the mask value.
 */

const MaskFunction = {

	DISCARD: 0,
	MULTIPLY: 1,
	MULTIPLY_RGB_SET_ALPHA: 2

};

var fragmentShader$9 = "uniform sampler2D inputBuffer;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 c0=texture2D(inputBuffer,vUv0).rg;vec2 c1=texture2D(inputBuffer,vUv1).rg;vec2 c2=texture2D(inputBuffer,vUv2).rg;vec2 c3=texture2D(inputBuffer,vUv3).rg;float d0=(c0.x-c1.x)*0.5;float d1=(c2.x-c3.x)*0.5;float d=length(vec2(d0,d1));float a0=min(c0.y,c1.y);float a1=min(c2.y,c3.y);float visibilityFactor=min(a0,a1);gl_FragColor.rg=(1.0-visibilityFactor>0.001)? vec2(d,0.0): vec2(0.0,d);}";

var vertexShader$5 = "uniform vec2 texelSize;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vUv0=vec2(uv.x+texelSize.x,uv.y);vUv1=vec2(uv.x-texelSize.x,uv.y);vUv2=vec2(uv.x,uv.y+texelSize.y);vUv3=vec2(uv.x,uv.y-texelSize.y);gl_Position=vec4(position.xy,1.0,1.0);}";

/**
 * An outline shader material.
 */

class OutlineMaterial extends ShaderMaterial {

	/**
	 * Constructs a new outline material.
	 *
	 * @param {Vector2} [texelSize] - The screen texel size.
	 */

	constructor(texelSize = new Vector2()) {

		super({

			type: "OutlineMaterial",

			uniforms: {
				inputBuffer: new Uniform(null),
				texelSize: new Uniform(new Vector2())
			},

			fragmentShader: fragmentShader$9,
			vertexShader: vertexShader$5,

			depthWrite: false,
			depthTest: false

		});

		/** @ignore */
		this.toneMapped = false;

		this.setTexelSize(texelSize.x, texelSize.y);

		// @todo Added for backward compatibility.
		this.uniforms.maskTexture = this.uniforms.inputBuffer;

	}

	/**
	 * Sets the texel size.
	 *
	 * @param {Number} x - The texel width.
	 * @param {Number} y - The texel height.
	 */

	setTexelSize(x, y) {

		this.uniforms.texelSize.value.set(x, y);

	}

}

/**
 * An outline shader material.
 *
 * @deprecated Use OutlineMaterial instead.
 */

const OutlineEdgesMaterial = OutlineMaterial;

/**
 * An auto sizing constant.
 *
 * @type {Number}
 * @private
 */

const AUTO_SIZE = -1;

/**
 * A resizer that can be used to store a base and a target resolution.
 *
 * The attached resizeable will be updated with the base resolution when the
 * target resolution changes. The new calculated resolution can then be
 * retrieved via {@link Resizer.width} and {@link Resizer.height}.
 */

class Resizer {

	/**
	 * Constructs a new resizer.
	 *
	 * @param {Resizable} resizeable - A resizable object.
	 * @param {Number} [width=Resizer.AUTO_SIZE] - The width.
	 * @param {Number} [height=Resizer.AUTO_SIZE] - The height.
	 * @param {Number} [scale=1.0] - An alternative resolution scale.
	 */

	constructor(resizable, width = AUTO_SIZE, height = AUTO_SIZE, scale = 1.0) {

		/**
		 * A resizable object.
		 *
		 * @type {Resizable}
		 */

		this.resizable = resizable;

		/**
		 * The base size.
		 *
		 * This size will be passed to the resizable object every time the target
		 * width, height or scale is changed.
		 *
		 * @type {Vector2}
		 */

		this.base = new Vector2(1, 1);

		/**
		 * The target size.
		 *
		 * @type {Vector2}
		 * @private
		 */

		this.target = new Vector2(width, height);

		/**
		 * A scale.
		 *
		 * If both the width and the height are set to {@link Resizer.AUTO_SIZE},
		 * they will be scaled uniformly using this scalar.
		 *
		 * @type {Number}
		 * @private
		 */

		this.s = scale;

	}

	/**
	 * The current resolution scale.
	 *
	 * @type {Number}
	 */

	get scale() {

		return this.s;

	}

	/**
	 * Sets the resolution scale.
	 *
	 * Also sets the width and height to {@link Resizer.AUTO_SIZE}.
	 *
	 * @type {Number}
	 */

	set scale(value) {

		this.s = value;

		this.target.x = AUTO_SIZE;
		this.target.y = AUTO_SIZE;

		this.resizable.setSize(this.base.x, this.base.y);

	}

	/**
	 * The calculated width.
	 *
	 * If both the width and the height are set to {@link Resizer.AUTO_SIZE}, the
	 * base width will be returned.
	 *
	 * @type {Number}
	 */

	get width() {

		const base = this.base;
		const target = this.target;

		let result;

		if(target.x !== AUTO_SIZE) {

			result = target.x;

		} else if(target.y !== AUTO_SIZE) {

			result = Math.round(target.y * (base.x / base.y));

		} else {

			result = Math.round(base.x * this.s);

		}

		return result;

	}

	/**
	 * Sets the target width.
	 *
	 * Use {@link Resizer.AUTO_SIZE} to automatically calculate the width based
	 * on the height and the original aspect ratio.
	 *
	 * @type {Number}
	 */

	set width(value) {

		this.target.x = value;
		this.resizable.setSize(this.base.x, this.base.y);

	}

	/**
	 * The calculated height.
	 *
	 * If both the width and the height are set to {@link Resizer.AUTO_SIZE}, the
	 * base height will be returned.
	 *
	 * @type {Number}
	 */

	get height() {

		const base = this.base;
		const target = this.target;

		let result;

		if(target.y !== AUTO_SIZE) {

			result = target.y;

		} else if(target.x !== AUTO_SIZE) {

			result = Math.round(target.x / (base.x / base.y));

		} else {

			result = Math.round(base.y * this.s);

		}

		return result;

	}

	/**
	 * Sets the target height.
	 *
	 * Use {@link Resizer.AUTO_SIZE} to automatically calculate the height based
	 * on the width and the original aspect ratio.
	 *
	 * @type {Number}
	 */

	set height(value) {

		this.target.y = value;
		this.resizable.setSize(this.base.x, this.base.y);

	}

	/**
	 * An auto sizing constant.
	 *
	 * Can be used to automatically calculate the width or height based on the
	 * original aspect ratio.
	 *
	 * @type {Number}
	 */

	static get AUTO_SIZE() {

		return AUTO_SIZE;

	}

}

/**
 * A dummy camera
 *
 * @type {Camera}
 * @private
 */

const dummyCamera = new Camera();

/**
 * Shared fullscreen geometry.
 *
 * @type {BufferGeometry}
 * @private
 */

let geometry = null;

/**
 * Returns a shared fullscreen triangle.
 *
 * The size of the screen is 2x2 units (NDC). A triangle that fills the screen
 * needs to be 4 units wide and 4 units tall.
 *
 * @private
 * @return {BufferGeometry} The fullscreen geometry.
 */

function getFullscreenTriangle() {

	if(geometry === null) {

		const vertices = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]);
		const uvs = new Float32Array([0, 0, 2, 0, 0, 2]);
		geometry = new BufferGeometry();

		// Added for backward compatibility (setAttribute was added in three r110).
		if(geometry.setAttribute !== undefined) {

			geometry.setAttribute("position", new BufferAttribute(vertices, 3));
			geometry.setAttribute("uv", new BufferAttribute(uvs, 2));

		} else {

			geometry.addAttribute("position", new BufferAttribute(vertices, 3));
			geometry.addAttribute("uv", new BufferAttribute(uvs, 2));

		}

	}

	return geometry;

}

/**
 * An abstract pass.
 *
 * Passes that do not rely on the depth buffer should explicitly disable the
 * depth test and depth write flags of their fullscreen shader material.
 *
 * Fullscreen passes use a shared fullscreen triangle:
 * https://michaldrobot.com/2014/04/01/gcn-execution-patterns-in-full-screen-passes/
 *
 * @implements {Initializable}
 * @implements {Resizable}
 * @implements {Disposable}
 */

class Pass {

	/**
	 * Constructs a new pass.
	 *
	 * @param {String} [name] - The name of this pass. Does not have to be unique.
	 * @param {Scene} [scene] - The scene to render. The default scene contains a single mesh that fills the screen.
	 * @param {Camera} [camera] - A camera. Fullscreen effect passes don't require a camera.
	 */

	constructor(name = "Pass", scene = new Scene(), camera = dummyCamera) {

		/**
		 * The name of this pass.
		 *
		 * @type {String}
		 */

		this.name = name;

		/**
		 * The scene to render.
		 *
		 * @type {Scene}
		 * @protected
		 */

		this.scene = scene;

		/**
		 * The camera.
		 *
		 * @type {Camera}
		 * @protected
		 */

		this.camera = camera;

		/**
		 * A mesh that fills the screen.
		 *
		 * @type {Mesh}
		 * @private
		 */

		this.screen = null;

		/**
		 * Indicates whether this pass should render to texture.
		 *
		 * @type {Boolean}
		 * @private
		 */

		this.rtt = true;

		/**
		 * Only relevant for subclassing.
		 *
		 * Indicates whether the {@link EffectComposer} should swap the frame
		 * buffers after this pass has finished rendering.
		 *
		 * Set this to `false` if this pass doesn't render to the output buffer or
		 * the screen. Otherwise, the contents of the input buffer will be lost.
		 *
		 * @type {Boolean}
		 */

		this.needsSwap = true;

		/**
		 * Only relevant for subclassing.
		 *
		 * Indicates whether the {@link EffectComposer} should prepare a depth
		 * texture for this pass.
		 *
		 * Set this to `true` if this pass relies on depth information from a
		 * preceding {@link RenderPass}.
		 *
		 * @type {Boolean}
		 */

		this.needsDepthTexture = false;

		/**
		 * Indicates whether this pass should be executed.
		 *
		 * @type {Boolean}
		 */

		this.enabled = true;

	}

	/**
	 * Indicates whether this pass should render to screen.
	 *
	 * @type {Boolean}
	 */

	get renderToScreen() {

		return !this.rtt;

	}

	/**
	 * Sets the render to screen flag.
	 *
	 * If the flag is changed to a different value, the fullscreen material will
	 * be updated as well.
	 *
	 * @type {Boolean}
	 */

	set renderToScreen(value) {

		if(this.rtt === value) {

			const material = this.getFullscreenMaterial();

			if(material !== null) {

				material.needsUpdate = true;

			}

			this.rtt = !value;

		}

	}

	/**
	 * Returns the current fullscreen material.
	 *
	 * @return {Material} The current fullscreen material, or null if there is none.
	 */

	getFullscreenMaterial() {

		return (this.screen !== null) ? this.screen.material : null;

	}

	/**
	 * Sets the fullscreen material.
	 *
	 * The material will be assigned to a mesh that fills the screen. The mesh
	 * will be created once a material is assigned via this method.
	 *
	 * @protected
	 * @param {Material} material - A fullscreen material.
	 */

	setFullscreenMaterial(material) {

		let screen = this.screen;

		if(screen !== null) {

			screen.material = material;

		} else {

			screen = new Mesh(getFullscreenTriangle(), material);
			screen.frustumCulled = false;

			if(this.scene === null) {

				this.scene = new Scene();

			}

			this.scene.add(screen);
			this.screen = screen;

		}

	}

	/**
	 * Returns the current depth texture.
	 *
	 * @return {Texture} The current depth texture, or null if there is none.
	 */

	getDepthTexture() {

		return null;

	}

	/**
	 * Sets the depth texture.
	 *
	 * This method will be called automatically by the {@link EffectComposer}.
	 *
	 * You may override this method if your pass relies on the depth information
	 * of a preceding {@link RenderPass}.
	 *
	 * @param {Texture} depthTexture - A depth texture.
	 * @param {Number} [depthPacking=0] - The depth packing.
	 */

	setDepthTexture(depthTexture, depthPacking = 0) {}

	/**
	 * Renders the effect.
	 *
	 * This is an abstract method that must be overridden.
	 *
	 * @abstract
	 * @throws {Error} An error is thrown if the method is not overridden.
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	 */

	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {

		throw new Error("Render method not implemented!");

	}

	/**
	 * Updates this pass with the renderer's size.
	 *
	 * You may override this method in case you want to be informed about the size
	 * of the main frame buffer.
	 *
	 * The {@link EffectComposer} calls this method before this pass is
	 * initialized and every time its own size is updated.
	 *
	 * @param {Number} width - The renderer's width.
	 * @param {Number} height - The renderer's height.
	 * @example this.myRenderTarget.setSize(width, height);
	 */

	setSize(width, height) {}

	/**
	 * Performs initialization tasks.
	 *
	 * By overriding this method you gain access to the renderer. You'll also be
	 * able to configure your custom render targets to use the appropriate format
	 * (RGB or RGBA).
	 *
	 * The provided renderer can be used to warm up special off-screen render
	 * targets by performing a preliminary render operation.
	 *
	 * The {@link EffectComposer} calls this method when this pass is added to its
	 * queue, but not before its size has been set.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
	 * @param {Number} frameBufferType - The type of the main frame buffers.
	 * @example if(!alpha && frameBufferType === UnsignedByteType) { this.myRenderTarget.texture.format = RGBFormat; }
	 */

	initialize(renderer, alpha, frameBufferType) {}

	/**
	 * Performs a shallow search for disposable properties and deletes them. The
	 * pass will be inoperative after this method was called!
	 *
	 * The {@link EffectComposer} calls this method when it is being destroyed.
	 * You may, however, use it independently to free memory when you are certain
	 * that you don't need this pass anymore.
	 */

	dispose() {

		const material = this.getFullscreenMaterial();

		if(material !== null) {

			material.dispose();

		}

		for(const key of Object.keys(this)) {

			const property = this[key];

			if(property !== null && typeof property.dispose === "function") {

				if(property instanceof Scene) {

					continue;

				}

				/** @ignore */
				this[key].dispose();

			}

		}

	}

}

/**
 * An efficient, incremental blur pass.
 */

class BlurPass extends Pass {

	/**
	 * Constructs a new blur pass.
	 *
	 * @param {Object} [options] - The options.
	 * @param {Number} [options.resolutionScale=0.5] - Deprecated. Adjust the height or width instead for consistent results.
	 * @param {Number} [options.width=Resizer.AUTO_SIZE] - The blur render width.
	 * @param {Number} [options.height=Resizer.AUTO_SIZE] - The blur render height.
	 * @param {KernelSize} [options.kernelSize=KernelSize.LARGE] - The blur kernel size.
	 */

	constructor({
		resolutionScale = 0.5,
		width = Resizer.AUTO_SIZE,
		height = Resizer.AUTO_SIZE,
		kernelSize = KernelSize.LARGE
	} = {}) {

		super("BlurPass");

		/**
		 * A render target.
		 *
		 * @type {WebGLRenderTarget}
		 * @private
		 */

		this.renderTargetA = new WebGLRenderTarget(1, 1, {
			minFilter: LinearFilter,
			magFilter: LinearFilter,
			stencilBuffer: false,
			depthBuffer: false
		});

		this.renderTargetA.texture.name = "Blur.Target.A";

		/**
		 * A second render target.
		 *
		 * @type {WebGLRenderTarget}
		 * @private
		 */

		this.renderTargetB = this.renderTargetA.clone();
		this.renderTargetB.texture.name = "Blur.Target.B";

		/**
		 * The render resolution.
		 *
		 * It's recommended to set the height or the width to an absolute value for
		 * consistent results across different devices and resolutions.
		 *
		 * @type {Resizer}
		 */

		this.resolution = new Resizer(this, width, height, resolutionScale);

		/**
		 * A convolution shader material.
		 *
		 * @type {ConvolutionMaterial}
		 * @private
		 */

		this.convolutionMaterial = new ConvolutionMaterial();

		/**
		 * A convolution shader material that uses dithering.
		 *
		 * @type {ConvolutionMaterial}
		 * @private
		 */

		this.ditheredConvolutionMaterial = new ConvolutionMaterial();
		this.ditheredConvolutionMaterial.dithering = true;

		/**
		 * Whether the blurred result should also be dithered using noise.
		 *
		 * @type {Boolean}
		 * @deprecated Set the frameBufferType of the EffectComposer to HalfFloatType instead.
		 */

		this.dithering = false;

		this.kernelSize = kernelSize;

	}

	/**
	 * The current width of the internal render targets.
	 *
	 * @type {Number}
	 * @deprecated Use resolution.width instead.
	 */

	get width() {

		return this.resolution.width;

	}

	/**
	 * Sets the render width.
	 *
	 * @type {Number}
	 * @deprecated Use resolution.width instead.
	 */

	set width(value) {

		this.resolution.width = value;

	}

	/**
	 * The current height of the internal render targets.
	 *
	 * @type {Number}
	 * @deprecated Use resolution.height instead.
	 */

	get height() {

		return this.resolution.height;

	}

	/**
	 * Sets the render height.
	 *
	 * @type {Number}
	 * @deprecated Use resolution.height instead.
	 */

	set height(value) {

		this.resolution.height = value;

	}

	/**
	 * The current blur scale.
	 *
	 * @type {Number}
	 */

	get scale() {

		return this.convolutionMaterial.uniforms.scale.value;

	}

	/**
	 * Sets the blur scale.
	 *
	 * This value influences the overall blur strength and should not be greater
	 * than 1. For larger blurs please increase the {@link kernelSize}!
	 *
	 * Note that the blur strength is closely tied to the resolution. For a smooth
	 * transition from no blur to full blur, set the width or the height to a high
	 * enough value.
	 *
	 * @type {Number}
	 */

	set scale(value) {

		this.convolutionMaterial.uniforms.scale.value = value;
		this.ditheredConvolutionMaterial.uniforms.scale.value = value;

	}

	/**
	 * The kernel size.
	 *
	 * @type {KernelSize}
	 */

	get kernelSize() {

		return this.convolutionMaterial.kernelSize;

	}

	/**
	 * Sets the kernel size.
	 *
	 * Larger kernels require more processing power but scale well with larger
	 * render resolutions.
	 *
	 * @type {KernelSize}
	 */

	set kernelSize(value) {

		this.convolutionMaterial.kernelSize = value;
		this.ditheredConvolutionMaterial.kernelSize = value;

	}

	/**
	 * Returns the current resolution scale.
	 *
	 * @return {Number} The resolution scale.
	 * @deprecated Adjust the fixed resolution width or height instead.
	 */

	getResolutionScale() {

		return this.resolution.scale;

	}

	/**
	 * Sets the resolution scale.
	 *
	 * @param {Number} scale - The new resolution scale.
	 * @deprecated Adjust the fixed resolution width or height instead.
	 */

	setResolutionScale(scale) {

		this.resolution.scale = scale;

	}

	/**
	 * Blurs the input buffer and writes the result to the output buffer. The
	 * input buffer remains intact, unless it's also the output buffer.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	 */

	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {

		const scene = this.scene;
		const camera = this.camera;

		const renderTargetA = this.renderTargetA;
		const renderTargetB = this.renderTargetB;

		let material = this.convolutionMaterial;
		let uniforms = material.uniforms;
		const kernel = material.getKernel();

		let lastRT = inputBuffer;
		let destRT;
		let i, l;

		this.setFullscreenMaterial(material);

		// Apply the multi-pass blur.
		for(i = 0, l = kernel.length - 1; i < l; ++i) {

			// Alternate between targets.
			destRT = ((i & 1) === 0) ? renderTargetA : renderTargetB;

			uniforms.kernel.value = kernel[i];
			uniforms.inputBuffer.value = lastRT.texture;
			renderer.setRenderTarget(destRT);
			renderer.render(scene, camera);

			lastRT = destRT;

		}

		if(this.dithering) {

			material = this.ditheredConvolutionMaterial;
			uniforms = material.uniforms;
			this.setFullscreenMaterial(material);

		}

		uniforms.kernel.value = kernel[i];
		uniforms.inputBuffer.value = lastRT.texture;
		renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
		renderer.render(scene, camera);

	}

	/**
	 * Updates the size of this pass.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 */

	setSize(width, height) {

		const resolution = this.resolution;
		resolution.base.set(width, height);

		const w = resolution.width;
		const h = resolution.height;

		this.renderTargetA.setSize(w, h);
		this.renderTargetB.setSize(w, h);

		this.convolutionMaterial.setTexelSize(1.0 / w, 1.0 / h);
		this.ditheredConvolutionMaterial.setTexelSize(1.0 / w, 1.0 / h);

	}

	/**
	 * Performs initialization tasks.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
	 * @param {Number} frameBufferType - The type of the main frame buffers.
	 */

	initialize(renderer, alpha, frameBufferType) {

		if(!alpha && frameBufferType === UnsignedByteType) {

			this.renderTargetA.texture.format = RGBFormat;
			this.renderTargetB.texture.format = RGBFormat;

		}

		if(frameBufferType !== undefined) {

			this.renderTargetA.texture.type = frameBufferType;
			this.renderTargetB.texture.type = frameBufferType;

		}

	}

	/**
	 * An auto sizing flag.
	 *
	 * @type {Number}
	 * @deprecated Use {@link Resizer.AUTO_SIZE} instead.
	 */

	static get AUTO_SIZE() {

		return Resizer.AUTO_SIZE;

	}

}

/**
 * A pass that disables the stencil test.
 */

class ClearMaskPass extends Pass {

	/**
	 * Constructs a new clear mask pass.
	 */

	constructor() {

		super("ClearMaskPass", null, null);

		this.needsSwap = false;

	}

	/**
	 * Disables the global stencil test.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	 */

	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {

		const stencil = renderer.state.buffers.stencil;

		stencil.setLocked(false);
		stencil.setTest(false);

	}

}

/**
 * Stores the original clear color of the renderer.
 *
 * @type {Color}
 * @private
 */

const color = new Color();

/**
 * A pass that clears the input buffer or the screen.
 */

class ClearPass extends Pass {

	/**
	 * Constructs a new clear pass.
	 *
	 * @param {Boolean} [color=true] - Determines whether the color buffer should be cleared.
	 * @param {Boolean} [depth=true] - Determines whether the depth buffer should be cleared.
	 * @param {Boolean} [stencil=false] - Determines whether the stencil buffer should be cleared.
	 */

	constructor(color = true, depth = true, stencil = false) {

		super("ClearPass", null, null);

		this.needsSwap = false;

		/**
		 * Indicates whether the color buffer should be cleared.
		 *
		 * @type {Boolean}
		 */

		this.color = color;

		/**
		 * Indicates whether the depth buffer should be cleared.
		 *
		 * @type {Boolean}
		 */

		this.depth = depth;

		/**
		 * Indicates whether the stencil buffer should be cleared.
		 *
		 * @type {Boolean}
		 */

		this.stencil = stencil;

		/**
		 * An override clear color.
		 *
		 * The default value is null.
		 *
		 * @type {Color}
		 */

		this.overrideClearColor = null;

		/**
		 * An override clear alpha.
		 *
		 * The default value is -1.
		 *
		 * @type {Number}
		 */

		this.overrideClearAlpha = -1.0;

	}

	/**
	 * Clears the input buffer or the screen.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	 */

	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {

		const overrideClearColor = this.overrideClearColor;
		const overrideClearAlpha = this.overrideClearAlpha;
		const clearAlpha = renderer.getClearAlpha();

		const hasOverrideClearColor = (overrideClearColor !== null);
		const hasOverrideClearAlpha = (overrideClearAlpha >= 0.0);

		if(hasOverrideClearColor) {

			color.copy(renderer.getClearColor());
			renderer.setClearColor(overrideClearColor, hasOverrideClearAlpha ?
				overrideClearAlpha : clearAlpha);

		} else if(hasOverrideClearAlpha) {

			renderer.setClearAlpha(overrideClearAlpha);

		}

		renderer.setRenderTarget(this.renderToScreen ? null : inputBuffer);
		renderer.clear(this.color, this.depth, this.stencil);

		if(hasOverrideClearColor) {

			renderer.setClearColor(color, clearAlpha);

		} else if(hasOverrideClearAlpha) {

			renderer.setClearAlpha(clearAlpha);

		}

	}

}

/**
 * A flag that indicates whether the override material workaround is enabled.
 *
 * @type {Boolean}
 * @private
 */

let workaroundEnabled = false;

/**
 * An override material manager.
 *
 * Includes a workaround that fixes override materials for skinned meshes and
 * instancing. Doesn't fix uniforms such as normal maps and displacement maps.
 * Using the workaround may have a negative impact on performance if the scene
 * contains a lot of meshes.
 *
 * @implements {Disposable}
 */

class OverrideMaterialManager {

	/**
	 * Constructs a new override material manager.
	 *
	 * @param {Material} [material=null] - An override material.
	 */

	constructor(material = null) {

		/**
		 * Keeps track of original materials.
		 *
		 * @type {Map<Object3D, Material>}
		 * @private
		 */

		this.originalMaterials = new Map();

		/**
		 * The override material.
		 *
		 * @type {Material}
		 * @private
		 */

		this.material = null;

		/**
		 * A clone of the override material.
		 *
		 * @type {Material}
		 * @private
		 */

		this.materialInstanced = null;

		/**
		 * A clone of the override material.
		 *
		 * @type {Material}
		 * @private
		 */

		this.materialSkinning = null;

		this.setMaterial(material);

	}

	/**
	 * Sets the override material.
	 *
	 * @param {Material} material - The material.
	 */

	setMaterial(material) {

		this.disposeMaterials();

		if(material !== null) {

			this.material = material;

			this.materialInstanced = material.clone();
			this.materialInstanced.uniforms = Object.assign({}, material.uniforms);

			this.materialSkinning = material.clone();
			this.materialSkinning.uniforms = Object.assign({}, material.uniforms);
			this.materialSkinning.skinning = true;

		}

	}

	/**
	 * Renders the scene with the override material.
	 *
	 * @private
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {Scene} scene - A scene.
	 * @param {Camera} camera - A camera.
	 */

	render(renderer, scene, camera) {

		const material = this.material;
		const materialSkinning = this.materialSkinning;
		const materialInstanced = this.materialInstanced;
		const originalMaterials = this.originalMaterials;

		// Ignore shadows.
		const shadowMapEnabled = renderer.shadowMap.enabled;
		renderer.shadowMap.enabled = false;

		if(workaroundEnabled) {

			let meshCount = 0;

			// Replace materials of all meshes with the correct override materials.
			scene.traverse((node) => {

				if(node.isMesh) {

					originalMaterials.set(node, node.material);

					if(node.isInstancedMesh) {

						node.material = materialInstanced;

					} else if(node.isSkinnedMesh) {

						node.material = materialSkinning;

					} else {

						node.material = material;

					}

					++meshCount;

				}

			});

			renderer.render(scene, camera);

			for(const entry of originalMaterials) {

				entry[0].material = entry[1];

			}

			if(meshCount !== originalMaterials.size) {

				originalMaterials.clear();

			}

		} else {

			const overrideMaterial = scene.overrideMaterial;
			scene.overrideMaterial = material;
			renderer.render(scene, camera);
			scene.overrideMaterial = overrideMaterial;

		}

		renderer.shadowMap.enabled = shadowMapEnabled;

	}

	/**
	 * Deletes cloned override materials.
	 *
	 * @private
	 */

	disposeMaterials() {

		if(this.materialInstanced !== null) {

			this.materialInstanced.dispose();

		}

		if(this.materialSkinning !== null) {

			this.materialSkinning.dispose();

		}

	}

	/**
	 * Performs cleanup tasks.
	 */

	dispose() {

		this.originalMaterials.clear();
		this.disposeMaterials();

	}

	/**
	 * Indicates whether the override material workaround is enabled.
	 *
	 * @type {Boolean}
	 */

	static get workaroundEnabled() {

		return workaroundEnabled;

	}

	/**
	 * Enables or disables the override material workaround globally.
	 *
	 * This only affects post processing passes and effects.
	 *
	 * @type {Boolean}
	 */

	static set workaroundEnabled(value) {

		workaroundEnabled = value;

	}

}

/**
 * A pass that renders a given scene into the input buffer or to screen.
 *
 * This pass uses a {@link ClearPass} to clear the target buffer.
 */

class RenderPass extends Pass {

	/**
	 * Constructs a new render pass.
	 *
	 * @param {Scene} scene - The scene to render.
	 * @param {Camera} camera - The camera to use to render the scene.
	 * @param {Material} [overrideMaterial=null] - An override material.
	 */

	constructor(scene, camera, overrideMaterial = null) {

		super("RenderPass", scene, camera);

		this.needsSwap = false;

		/**
		 * A clear pass.
		 *
		 * @type {ClearPass}
		 * @private
		 */

		this.clearPass = new ClearPass();

		/**
		 * An override material manager.
		 *
		 * @type {OverrideMaterialManager}
		 * @private
		 */

		this.overrideMaterialManager = (overrideMaterial === null) ? null :
			new OverrideMaterialManager(overrideMaterial);

	}

	/**
	 * Indicates whether this pass should render to screen.
	 *
	 * @type {Boolean}
	 */

	get renderToScreen() {

		return super.renderToScreen;

	}

	/**
	 * Sets the render to screen flag.
	 *
	 * @type {Boolean}
	 */

	set renderToScreen(value) {

		super.renderToScreen = value;
		this.clearPass.renderToScreen = value;

	}

	/**
	 * The current override material.
	 *
	 * @type {Material}
	 */

	get overrideMaterial() {

		const manager = this.overrideMaterialManager;

		return (manager !== null) ? manager.material : null;

	}

	/**
	 * Sets the override material.
	 *
	 * @type {Material}
	 */

	set overrideMaterial(value) {

		const manager = this.overrideMaterialManager;

		if(value !== null) {

			if(manager !== null) {

				manager.setMaterial(value);

			} else {

				this.overrideMaterialManager = new OverrideMaterialManager(value);

			}

		} else if(manager !== null) {

			manager.dispose();
			this.overrideMaterialManager = null;

		}

	}

	/**
	 * Indicates whether the target buffer should be cleared before rendering.
	 *
	 * @type {Boolean}
	 */

	get clear() {

		return this.clearPass.enabled;

	}

	/**
	 * Enables or disables auto clear.
	 *
	 * @type {Boolean}
	 */

	set clear(value) {

		this.clearPass.enabled = value;

	}

	/**
	 * Returns the clear pass.
	 *
	 * @return {ClearPass} The clear pass.
	 */

	getClearPass() {

		return this.clearPass;

	}

	/**
	 * Renders the scene.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	 */

	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {

		const scene = this.scene;
		const camera = this.camera;
		const background = scene.background;
		const renderTarget = this.renderToScreen ? null : inputBuffer;

		if(this.clear) {

			if(this.clearPass.overrideClearColor !== null) {

				// This clear color is important! Ignore the scene background.
				scene.background = null;

			}

			this.clearPass.render(renderer, inputBuffer);

		}

		renderer.setRenderTarget(renderTarget);

		if(this.overrideMaterialManager !== null) {

			this.overrideMaterialManager.render(renderer, scene, camera);

		} else {

			renderer.render(scene, camera);

		}

		if(scene.background !== background) {

			// Restore the background.
			scene.background = background;

		}

	}

}

/**
 * A pass that renders the depth of a given scene into a color buffer.
 */

class DepthPass extends Pass {

	/**
	 * Constructs a new depth pass.
	 *
	 * @param {Scene} scene - The scene to render.
	 * @param {Camera} camera - The camera to use to render the scene.
	 * @param {Object} [options] - The options.
	 * @param {Number} [options.resolutionScale=1.0] - Deprecated. Adjust the height or width instead for consistent results.
	 * @param {Number} [options.width=Resizer.AUTO_SIZE] - The render width.
	 * @param {Number} [options.height=Resizer.AUTO_SIZE] - The render height.
	 * @param {WebGLRenderTarget} [options.renderTarget] - A custom render target.
	 */

	constructor(scene, camera, {
		resolutionScale = 1.0,
		width = Resizer.AUTO_SIZE,
		height = Resizer.AUTO_SIZE,
		renderTarget
	} = {}) {

		super("DepthPass");

		this.needsSwap = false;

		/**
		 * A render pass.
		 *
		 * @type {RenderPass}
		 * @private
		 */

		this.renderPass = new RenderPass(scene, camera, new MeshDepthMaterial({
			depthPacking: RGBADepthPacking
		}));

		const clearPass = this.renderPass.getClearPass();
		clearPass.overrideClearColor = new Color(0xffffff);
		clearPass.overrideClearAlpha = 1.0;

		/**
		 * A render target that contains the scene depth.
		 *
		 * @type {WebGLRenderTarget}
		 */

		this.renderTarget = renderTarget;

		if(this.renderTarget === undefined) {

			this.renderTarget = new WebGLRenderTarget(1, 1, {
				minFilter: NearestFilter,
				magFilter: NearestFilter,
				stencilBuffer: false
			});

			this.renderTarget.texture.name = "DepthPass.Target";

		}

		/**
		 * The desired render resolution.
		 *
		 * Use {@link Resizer.AUTO_SIZE} for the width or height to automatically
		 * calculate it based on its counterpart and the original aspect ratio.
		 *
		 * @type {Resizer}
		 */

		this.resolution = new Resizer(this, width, height, resolutionScale);

	}

	/**
	 * The depth texture.
	 *
	 * @type {Texture}
	 */

	get texture() {

		return this.renderTarget.texture;

	}

	/**
	 * Returns the current resolution scale.
	 *
	 * @return {Number} The resolution scale.
	 * @deprecated Adjust the fixed resolution width or height instead.
	 */

	getResolutionScale() {

		return this.resolutionScale;

	}

	/**
	 * Sets the resolution scale.
	 *
	 * @param {Number} scale - The new resolution scale.
	 * @deprecated Adjust the fixed resolution width or height instead.
	 */

	setResolutionScale(scale) {

		this.resolutionScale = scale;
		this.setSize(this.resolution.base.x, this.resolution.base.y);

	}

	/**
	 * Renders the scene depth.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	 */

	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {

		const renderTarget = this.renderToScreen ? null : this.renderTarget;
		this.renderPass.render(renderer, renderTarget);

	}

	/**
	 * Updates the size of this pass.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 */

	setSize(width, height) {

		const resolution = this.resolution;
		resolution.base.set(width, height);

		this.renderTarget.setSize(resolution.width, resolution.height);

	}

}

/**
 * A pass that downsamples the scene depth by picking the most representative
 * depth in 2x2 texel neighborhoods. If a normal buffer is provided, the
 * corresponding normals will be stored as well.
 *
 * Attention: This pass requires WebGL 2.
 */

class DepthDownsamplingPass extends Pass {

	/**
	 * Constructs a new depth downsampling pass.
	 *
	 * @param {Object} [options] - The options.
	 * @param {Texture} [options.normalBuffer=null] - A texture that contains view space normals. See {@link NormalPass}.
	 * @param {Number} [options.resolutionScale=0.5] - The resolution scale.
	 * @param {Number} [options.width=Resizer.AUTO_SIZE] - The render width.
	 * @param {Number} [options.height=Resizer.AUTO_SIZE] - The render height.
	 */

	constructor({
		normalBuffer = null,
		resolutionScale = 0.5,
		width = Resizer.AUTO_SIZE,
		height = Resizer.AUTO_SIZE
	} = {}) {

		super("DepthDownsamplingPass");

		this.setFullscreenMaterial(new DepthDownsamplingMaterial());
		this.needsDepthTexture = true;
		this.needsSwap = false;

		if(normalBuffer !== null) {

			const material = this.getFullscreenMaterial();
			material.uniforms.normalBuffer.value = normalBuffer;
			material.defines.DOWNSAMPLE_NORMALS = "1";

		}

		/**
		 * A render target that contains the downsampled normals and depth.
		 *
		 * Normals are stored as RGB and depth is stored as alpha.
		 *
		 * @type {WebGLRenderTarget}
		 */

		this.renderTarget = new WebGLRenderTarget(1, 1, {
			minFilter: NearestFilter,
			magFilter: NearestFilter,
			stencilBuffer: false,
			depthBuffer: false,
			type: FloatType
		});

		this.renderTarget.texture.name = "DepthDownsamplingPass.Target";
		this.renderTarget.texture.generateMipmaps = false;

		/**
		 * The resolution of this effect.
		 *
		 * @type {Resizer}
		 */

		this.resolution = new Resizer(this, width, height);
		this.resolution.scale = resolutionScale;

	}

	/**
	 * The normal(RGB) + depth(A) texture.
	 *
	 * @type {Texture}
	 */

	get texture() {

		return this.renderTarget.texture;

	}

	/**
	 * Sets the depth texture.
	 *
	 * @param {Texture} depthTexture - A depth texture.
	 * @param {Number} [depthPacking=0] - The depth packing.
	 */

	setDepthTexture(depthTexture, depthPacking = 0) {

		const material = this.getFullscreenMaterial();
		material.uniforms.depthBuffer.value = depthTexture;
		material.depthPacking = depthPacking;

	}

	/**
	 * Downsamples depth and scene normals.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	 */

	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {

		renderer.setRenderTarget(this.renderToScreen ? null : this.renderTarget);
		renderer.render(this.scene, this.camera);

	}

	/**
	 * Updates the size of this pass.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 */

	setSize(width, height) {

		const resolution = this.resolution;
		resolution.base.set(width, height);

		// Use the full resolution to calculate the depth/normal buffer texel size.
		this.getFullscreenMaterial().setTexelSize(1.0 / width, 1.0 / height);

		this.renderTarget.setSize(resolution.width, resolution.height);

	}

	/**
	 * Performs initialization tasks.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
	 * @param {Number} frameBufferType - The type of the main frame buffers.
	 */

	initialize(renderer, alpha, frameBufferType) {

		if(!renderer.capabilities.isWebGL2) {

			console.error("The DepthDownsamplingPass requires WebGL 2");

		}

	}

}

/**
 * A blend function enumeration.
 *
 * @type {Object}
 * @property {Number} SKIP - No blending. The effect will not be included in the final shader.
 * @property {Number} ADD - Additive blending. Fast, but may produce washed out results.
 * @property {Number} ALPHA - Alpha blending. Blends based on the alpha value of the new color.
 * @property {Number} AVERAGE - Average blending.
 * @property {Number} COLOR_BURN - Color burn.
 * @property {Number} COLOR_DODGE - Color dodge.
 * @property {Number} DARKEN - Prioritize darker colors.
 * @property {Number} DIFFERENCE - Color difference.
 * @property {Number} EXCLUSION - Color exclusion.
 * @property {Number} LIGHTEN - Prioritize lighter colors.
 * @property {Number} MULTIPLY - Color multiplication.
 * @property {Number} DIVIDE - Color division.
 * @property {Number} NEGATION - Color negation.
 * @property {Number} NORMAL - Normal blending. The new color overwrites the old one.
 * @property {Number} OVERLAY - Color overlay.
 * @property {Number} REFLECT - Color reflection.
 * @property {Number} SCREEN - Screen blending. The two colors are effectively projected on a white screen simultaneously.
 * @property {Number} SOFT_LIGHT - Soft light blending.
 * @property {Number} SUBTRACT - Color subtraction.
 */

const BlendFunction = {

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

/**
 * A blend function shader code catalogue.
 *
 * @type {Map<BlendFunction, String>}
 * @private
 */

const blendFunctions = new Map([
	[BlendFunction.SKIP, null],
	[BlendFunction.ADD, addBlendFunction],
	[BlendFunction.ALPHA, alphaBlendFunction],
	[BlendFunction.AVERAGE, averageBlendFunction],
	[BlendFunction.COLOR_BURN, colorBurnBlendFunction],
	[BlendFunction.COLOR_DODGE, colorDodgeBlendFunction],
	[BlendFunction.DARKEN, darkenBlendFunction],
	[BlendFunction.DIFFERENCE, differenceBlendFunction],
	[BlendFunction.EXCLUSION, exclusionBlendFunction],
	[BlendFunction.LIGHTEN, lightenBlendFunction],
	[BlendFunction.MULTIPLY, multiplyBlendFunction],
	[BlendFunction.DIVIDE, divideBlendFunction],
	[BlendFunction.NEGATION, negationBlendFunction],
	[BlendFunction.NORMAL, normalBlendFunction],
	[BlendFunction.OVERLAY, overlayBlendFunction],
	[BlendFunction.REFLECT, reflectBlendFunction],
	[BlendFunction.SCREEN, screenBlendFunction],
	[BlendFunction.SOFT_LIGHT, softLightBlendFunction],
	[BlendFunction.SUBTRACT, subtractBlendFunction]
]);

/**
 * A blend mode.
 */

class BlendMode extends EventDispatcher {

	/**
	 * Constructs a new blend mode.
	 *
	 * @param {BlendFunction} blendFunction - The blend function to use.
	 * @param {Number} opacity - The opacity of the color that will be blended with the base color.
	 */

	constructor(blendFunction, opacity = 1.0) {

		super();

		/**
		 * The blend function.
		 *
		 * @type {BlendFunction}
		 * @private
		 */

		this.blendFunction = blendFunction;

		/**
		 * The opacity of the color that will be blended with the base color.
		 *
		 * @type {Uniform}
		 */

		this.opacity = new Uniform(opacity);

	}

	/**
	 * Returns the blend function.
	 *
	 * @return {BlendFunction} The blend function.
	 */

	getBlendFunction() {

		return this.blendFunction;

	}

	/**
	 * Sets the blend function.
	 *
	 * @param {BlendFunction} blendFunction - The blend function.
	 */

	setBlendFunction(blendFunction) {

		this.blendFunction = blendFunction;
		this.dispatchEvent({ type: "change" });

	}

	/**
	 * Returns the blend function shader code.
	 *
	 * @return {String} The blend function shader code.
	 */

	getShaderCode() {

		return blendFunctions.get(this.blendFunction);

	}

}

/**
 * An abstract effect.
 *
 * Effects can be combined using the {@link EffectPass}.
 *
 * @implements {Initializable}
 * @implements {Resizable}
 * @implements {Disposable}
 */

class Effect extends EventDispatcher {

	/**
	 * Constructs a new effect.
	 *
	 * @param {String} name - The name of this effect. Doesn't have to be unique.
	 * @param {String} fragmentShader - The fragment shader. This shader is required.
	 * @param {Object} [options] - Additional options.
	 * @param {EffectAttribute} [options.attributes=EffectAttribute.NONE] - The effect attributes that determine the execution priority and resource requirements.
	 * @param {BlendFunction} [options.blendFunction=BlendFunction.SCREEN] - The blend function of this effect.
	 * @param {Map<String, String>} [options.defines] - Custom preprocessor macro definitions. Keys are names and values are code.
	 * @param {Map<String, Uniform>} [options.uniforms] - Custom shader uniforms. Keys are names and values are uniforms.
	 * @param {Set<WebGLExtension>} [options.extensions] - WebGL extensions.
	 * @param {String} [options.vertexShader=null] - The vertex shader. Most effects don't need one.
	 */

	constructor(name, fragmentShader, {
		attributes = EffectAttribute.NONE,
		blendFunction = BlendFunction.SCREEN,
		defines = new Map(),
		uniforms = new Map(),
		extensions = null,
		vertexShader = null
	} = {}) {

		super();

		/**
		 * The name of this effect.
		 *
		 * @type {String}
		 */

		this.name = name;

		/**
		 * The effect attributes.
		 *
		 * @type {EffectAttribute}
		 * @private
		 */

		this.attributes = attributes;

		/**
		 * The fragment shader.
		 *
		 * @type {String}
		 * @private
		 */

		this.fragmentShader = fragmentShader;

		/**
		 * The vertex shader.
		 *
		 * @type {String}
		 * @private
		 */

		this.vertexShader = vertexShader;

		/**
		 * Preprocessor macro definitions.
		 *
		 * Call {@link Effect.setChanged} after changing macro definitions.
		 *
		 * @type {Map<String, String>}
		 */

		this.defines = defines;

		/**
		 * Shader uniforms.
		 *
		 * You may freely modify the values of these uniforms at runtime. However,
		 * uniforms should not be removed or added after the effect was created.
		 *
		 * Call {@link Effect.setChanged} after adding or removing uniforms.
		 *
		 * @type {Map<String, Uniform>}
		 */

		this.uniforms = uniforms;

		/**
		 * WebGL extensions that are required by this effect.
		 *
		 * Call {@link Effect.setChanged} after adding or removing extensions.
		 *
		 * @type {Set<WebGLExtension>}
		 */

		this.extensions = extensions;

		/**
		 * The blend mode of this effect.
		 *
		 * The result of this effect will be blended with the result of the previous
		 * effect using this blend mode.
		 *
		 * @type {BlendMode}
		 */

		this.blendMode = new BlendMode(blendFunction);
		this.blendMode.addEventListener("change", (event) => this.setChanged());

	}

	/**
	 * Informs the associated {@link EffectPass} that this effect has changed in
	 * a way that requires a shader recompilation.
	 *
	 * Call this method after changing macro definitions or extensions and after
	 * adding or removing uniforms.
	 *
	 * @protected
	 */

	setChanged() {

		this.dispatchEvent({ type: "change" });

	}

	/**
	 * Returns the effect attributes.
	 *
	 * @return {EffectAttribute} The attributes.
	 */

	getAttributes() {

		return this.attributes;

	}

	/**
	 * Sets the effect attributes.
	 *
	 * Effects that have the same attributes will be executed in the order in
	 * which they were registered. Some attributes imply a higher priority.
	 *
	 * @protected
	 * @param {EffectAttribute} attributes - The attributes.
	 */

	setAttributes(attributes) {

		this.attributes = attributes;
		this.setChanged();

	}

	/**
	 * Returns the fragment shader.
	 *
	 * @return {String} The fragment shader.
	 */

	getFragmentShader() {

		return this.fragmentShader;

	}

	/**
	 * Sets the fragment shader.
	 *
	 * @protected
	 * @param {String} fragmentShader - The fragment shader.
	 */

	setFragmentShader(fragmentShader) {

		this.fragmentShader = fragmentShader;
		this.setChanged();

	}

	/**
	 * Returns the vertex shader.
	 *
	 * @return {String} The vertex shader.
	 */

	getVertexShader() {

		return this.vertexShader;

	}

	/**
	 * Sets the vertex shader.
	 *
	 * @protected
	 * @param {String} vertexShader - The vertex shader.
	 */

	setVertexShader(vertexShader) {

		this.vertexShader = vertexShader;
		this.setChanged();

	}

	/**
	 * Sets the depth texture.
	 *
	 * You may override this method if your effect requires direct access to the
	 * depth texture that is bound to the associated {@link EffectPass}.
	 *
	 * @param {Texture} depthTexture - A depth texture.
	 * @param {Number} [depthPacking=0] - The depth packing.
	 */

	setDepthTexture(depthTexture, depthPacking = 0) {}

	/**
	 * Updates the effect by performing supporting operations.
	 *
	 * This method is called by the {@link EffectPass} right before the main
	 * fullscreen render operation, even if the blend function is set to `SKIP`.
	 *
	 * You may override this method if you need to render additional off-screen
	 * textures or update custom uniforms.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 */

	update(renderer, inputBuffer, deltaTime) {}

	/**
	 * Updates the size of this effect.
	 *
	 * You may override this method in case you want to be informed about the main
	 * render size.
	 *
	 * The {@link EffectPass} calls this method before this effect is initialized
	 * and every time its own size is updated.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 * @example this.myRenderTarget.setSize(width, height);
	 */

	setSize(width, height) {}

	/**
	 * Performs initialization tasks.
	 *
	 * By overriding this method you gain access to the renderer. You'll also be
	 * able to configure your custom render targets to use the appropriate format
	 * (RGB or RGBA).
	 *
	 * The provided renderer can be used to warm up special off-screen render
	 * targets by performing a preliminary render operation.
	 *
	 * The {@link EffectPass} calls this method during its own initialization
	 * which happens after the size has been set.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
	 * @param {Number} frameBufferType - The type of the main frame buffers.
	 * @example if(!alpha && frameBufferType === UnsignedByteType) { this.myRenderTarget.texture.format = RGBFormat; }
	 */

	initialize(renderer, alpha, frameBufferType) {}

	/**
	 * Performs a shallow search for properties that define a dispose method and
	 * deletes them. The effect will be inoperative after this method was called!
	 *
	 * The {@link EffectPass} calls this method when it is being destroyed. Do not
	 * call this method directly.
	 */

	dispose() {

		for(const key of Object.keys(this)) {

			const property = this[key];

			if(property !== null && typeof property.dispose === "function") {

				if(property instanceof Scene) {

					continue;

				}

				/** @ignore */
				this[key].dispose();

			}

		}

	}

}

/**
 * An enumeration of effect attributes.
 *
 * Attributes can be concatenated using the bitwise OR operator.
 *
 * @type {Object}
 * @property {Number} NONE - No attributes. Most effects don't need to specify any attributes.
 * @property {Number} DEPTH - Describes effects that require a depth texture.
 * @property {Number} CONVOLUTION - Describes effects that fetch additional samples from the input buffer. There cannot be more than one effect with this attribute per {@link EffectPass}.
 * @example const attributes = EffectAttribute.CONVOLUTION | EffectAttribute.DEPTH;
 */

const EffectAttribute = {

	NONE: 0,
	DEPTH: 1,
	CONVOLUTION: 2

};

/**
 * Finds and collects substrings that match the given regular expression.
 *
 * @private
 * @param {RegExp} regExp - A regular expression.
 * @param {String} string - A string.
 * @return {String[]} The matching substrings.
 */

function findSubstrings(regExp, string) {

	const substrings = [];
	let result;

	while((result = regExp.exec(string)) !== null) {

		substrings.push(result[1]);

	}

	return substrings;

}

/**
 * Prefixes substrings within the given strings.
 *
 * @private
 * @param {String} prefix - A prefix.
 * @param {String[]} substrings - The substrings.
 * @param {Map<String, String>} strings - A collection of named strings.
 */

function prefixSubstrings(prefix, substrings, strings) {

	let prefixed, regExp;

	for(const substring of substrings) {

		prefixed = "$1" + prefix + substring.charAt(0).toUpperCase() + substring.slice(1);
		regExp = new RegExp("([^\\.])(\\b" + substring + "\\b)", "g");

		for(const entry of strings.entries()) {

			if(entry[1] !== null) {

				strings.set(entry[0], entry[1].replace(regExp, prefixed));

			}

		}

	}

}

/**
 * Integrates the given effect.
 *
 * @private
 * @param {String} prefix - A prefix.
 * @param {Effect} effect - An effect.
 * @param {Map<String, String>} shaderParts - The shader parts.
 * @param {Map<BlendFunction, BlendMode>} blendModes - The blend modes.
 * @param {Map<String, String>} defines - The macro definitions.
 * @param {Map<String, Uniform>} uniforms - The uniforms.
 * @param {EffectAttribute} attributes - The global, collective attributes.
 * @return {Object} The results.
 * @property {String[]} varyings - The varyings used by the given effect.
 * @property {Boolean} transformedUv - Indicates whether the effect transforms UV coordinates in the fragment shader.
 * @property {Boolean} readDepth - Indicates whether the effect actually uses depth in the fragment shader.
 */

function integrateEffect(prefix, effect, shaderParts, blendModes, defines, uniforms, attributes) {

	const functionRegExp = /(?:\w+\s+(\w+)\([\w\s,]*\)\s*{[^}]+})/g;
	const varyingRegExp = /(?:varying\s+\w+\s+(\w*))/g;

	const blendMode = effect.blendMode;
	const shaders = new Map([
		["fragment", effect.getFragmentShader()],
		["vertex", effect.getVertexShader()]
	]);

	const mainImageExists = (shaders.get("fragment") !== undefined && shaders.get("fragment").indexOf("mainImage") >= 0);
	const mainUvExists = (shaders.get("fragment") !== undefined && shaders.get("fragment").indexOf("mainUv") >= 0);

	let varyings = [], names = [];
	let transformedUv = false;
	let readDepth = false;

	if(shaders.get("fragment") === undefined) {

		console.error("Missing fragment shader", effect);

	} else if(mainUvExists && (attributes & EffectAttribute.CONVOLUTION) !== 0) {

		console.error("Effects that transform UV coordinates are incompatible with convolution effects", effect);

	} else if(!mainImageExists && !mainUvExists) {

		console.error("The fragment shader contains neither a mainImage nor a mainUv function", effect);

	} else {

		if(mainUvExists) {

			shaderParts.set(Section.FRAGMENT_MAIN_UV, shaderParts.get(Section.FRAGMENT_MAIN_UV) +
				"\t" + prefix + "MainUv(UV);\n");

			transformedUv = true;

		}

		if(shaders.get("vertex") !== null && shaders.get("vertex").indexOf("mainSupport") >= 0) {

			let string = "\t" + prefix + "MainSupport(";

			// Check if the vertex shader expects uv coordinates.
			if(shaders.get("vertex").indexOf("uv") >= 0) {

				string += "vUv";

			}

			string += ");\n";

			shaderParts.set(Section.VERTEX_MAIN_SUPPORT,
				shaderParts.get(Section.VERTEX_MAIN_SUPPORT) + string);

			varyings = varyings.concat(findSubstrings(varyingRegExp, shaders.get("vertex")));
			names = names.concat(varyings).concat(findSubstrings(functionRegExp, shaders.get("vertex")));

		}

		// Assemble all names while ignoring parameters of function-like macros.
		names = names.concat(findSubstrings(functionRegExp, shaders.get("fragment")))
			.concat(Array.from(effect.defines.keys()).map((s) => s.replace(/\([\w\s,]*\)/g, "")))
			.concat(Array.from(effect.uniforms.keys()));

		// Store prefixed uniforms and macros.
		effect.uniforms.forEach((value, key) => uniforms.set(prefix + key.charAt(0).toUpperCase() + key.slice(1), value));
		effect.defines.forEach((value, key) => defines.set(prefix + key.charAt(0).toUpperCase() + key.slice(1), value));

		// Prefix varyings, functions, uniforms and macros.
		prefixSubstrings(prefix, names, defines);
		prefixSubstrings(prefix, names, shaders);

		// Collect unique blend modes.
		blendModes.set(blendMode.blendFunction, blendMode);

		if(mainImageExists) {

			let string = prefix + "MainImage(color0, UV, ";

			// The effect may sample depth in a different shader.
			if((attributes & EffectAttribute.DEPTH) !== 0 && shaders.get("fragment").indexOf("depth") >= 0) {

				string += "depth, ";
				readDepth = true;

			}

			string += "color1);\n\t";

			// Include the blend opacity uniform of this effect.
			const blendOpacity = prefix + "BlendOpacity";
			uniforms.set(blendOpacity, blendMode.opacity);

			// Blend the result of this effect with the input color.
			string += "color0 = blend" + blendMode.getBlendFunction() +
				"(color0, color1, " + blendOpacity + ");\n\n\t";

			shaderParts.set(Section.FRAGMENT_MAIN_IMAGE,
				shaderParts.get(Section.FRAGMENT_MAIN_IMAGE) + string);

			shaderParts.set(Section.FRAGMENT_HEAD, shaderParts.get(Section.FRAGMENT_HEAD) +
				"uniform float " + blendOpacity + ";\n\n");

		}

		// Include the modified code in the final shader.
		shaderParts.set(Section.FRAGMENT_HEAD, shaderParts.get(Section.FRAGMENT_HEAD) +
			shaders.get("fragment") + "\n");

		if(shaders.get("vertex") !== null) {

			shaderParts.set(Section.VERTEX_HEAD, shaderParts.get(Section.VERTEX_HEAD) +
				shaders.get("vertex") + "\n");

		}

	}

	return { varyings, transformedUv, readDepth };

}

/**
 * An effect pass.
 *
 * Use this pass to combine {@link Effect} instances.
 *
 * @implements {EventListener}
 */

class EffectPass extends Pass {

	/**
	 * Constructs a new effect pass.
	 *
	 * The provided effects will be organized and merged for optimal performance.
	 *
	 * @param {Camera} camera - The main camera. The camera's type and settings will be available to all effects.
	 * @param {...Effect} effects - The effects that will be rendered by this pass.
	 */

	constructor(camera, ...effects) {

		super("EffectPass");

		this.setFullscreenMaterial(new EffectMaterial(null, null, null, camera));

		/**
		 * The effects, sorted by attribute priority, DESC.
		 *
		 * @type {Effect[]}
		 * @private
		 */

		this.effects = effects.sort((a, b) => (b.attributes - a.attributes));

		/**
		 * Indicates whether this pass should skip rendering.
		 *
		 * Effects will still be updated, even if this flag is true.
		 *
		 * @type {Boolean}
		 * @private
		 */

		this.skipRendering = false;

		/**
		 * The amount of shader uniforms that this pass uses.
		 *
		 * @type {Number}
		 * @private
		 */

		this.uniforms = 0;

		/**
		 * The amount of shader varyings that this pass uses.
		 *
		 * @type {Number}
		 * @private
		 */

		this.varyings = 0;

		/**
		 * A time offset.
		 *
		 * Elapsed time will start at this value.
		 *
		 * @type {Number}
		 */

		this.minTime = 1.0;

		/**
		 * The maximum time.
		 *
		 * If the elapsed time exceeds this value, it will be reset.
		 *
		 * @type {Number}
		 */

		this.maxTime = Number.POSITIVE_INFINITY;

	}

	/**
	 * Indicates whether this pass encodes its output when rendering to screen.
	 *
	 * @type {Boolean}
	 */

	get encodeOutput() {

		return (this.getFullscreenMaterial().defines.ENCODE_OUTPUT !== undefined);

	}

	/**
	 * Enables or disables output encoding.
	 *
	 * @type {Boolean}
	 */

	set encodeOutput(value) {

		if(this.encodeOutput !== value) {

			const material = this.getFullscreenMaterial();
			material.needsUpdate = true;

			if(value) {

				material.defines.ENCODE_OUTPUT = "1";

			} else {

				delete material.defines.ENCODE_OUTPUT;

			}

		}

	}

	/**
	 * Indicates whether dithering is enabled.
	 *
	 * Color quantization reduces banding artifacts but degrades performance.
	 *
	 * @type {Boolean}
	 */

	get dithering() {

		return this.getFullscreenMaterial().dithering;

	}

	/**
	 * Enables or disables dithering.
	 *
	 * @type {Boolean}
	 */

	set dithering(value) {

		const material = this.getFullscreenMaterial();

		if(material.dithering !== value) {

			material.dithering = value;
			material.needsUpdate = true;

		}

	}

	/**
	 * Compares required resources with device capabilities.
	 *
	 * @private
	 * @param {WebGLRenderer} renderer - The renderer.
	 */

	verifyResources(renderer) {

		const capabilities = renderer.capabilities;
		let max = Math.min(capabilities.maxFragmentUniforms, capabilities.maxVertexUniforms);

		if(this.uniforms > max) {

			console.warn("The current rendering context doesn't support more than " +
				max + " uniforms, but " + this.uniforms + " were defined");

		}

		max = capabilities.maxVaryings;

		if(this.varyings > max) {

			console.warn("The current rendering context doesn't support more than " +
				max + " varyings, but " + this.varyings + " were defined");

		}

	}

	/**
	 * Updates the compound shader material.
	 *
	 * @private
	 */

	updateMaterial() {

		const blendRegExp = /\bblend\b/g;

		const shaderParts = new Map([
			[Section.FRAGMENT_HEAD, ""],
			[Section.FRAGMENT_MAIN_UV, ""],
			[Section.FRAGMENT_MAIN_IMAGE, ""],
			[Section.VERTEX_HEAD, ""],
			[Section.VERTEX_MAIN_SUPPORT, ""]
		]);

		const blendModes = new Map();
		const defines = new Map();
		const uniforms = new Map();
		const extensions = new Set();

		let id = 0, varyings = 0, attributes = 0;
		let transformedUv = false;
		let readDepth = false;
		let result;

		for(const effect of this.effects) {

			if(effect.blendMode.getBlendFunction() === BlendFunction.SKIP) {

				// Check if this effect relies on depth and then continue.
				attributes |= (effect.getAttributes() & EffectAttribute.DEPTH);

			} else if((attributes & EffectAttribute.CONVOLUTION) !== 0 &&
				(effect.getAttributes() & EffectAttribute.CONVOLUTION) !== 0) {

				console.error("Convolution effects cannot be merged", effect);

			} else {

				attributes |= effect.getAttributes();

				result = integrateEffect(("e" + id++), effect, shaderParts, blendModes, defines, uniforms, attributes);

				varyings += result.varyings.length;
				transformedUv = transformedUv || result.transformedUv;
				readDepth = readDepth || result.readDepth;

				if(effect.extensions !== null) {

					// Collect the WebGL extensions that are required by this effect.
					for(const extension of effect.extensions) {

						extensions.add(extension);

					}

				}

			}

		}

		// Integrate the relevant blend functions.
		for(const blendMode of blendModes.values()) {

			shaderParts.set(Section.FRAGMENT_HEAD, shaderParts.get(Section.FRAGMENT_HEAD) +
				blendMode.getShaderCode().replace(blendRegExp, "blend" + blendMode.getBlendFunction()) + "\n");

		}

		// Check if any effect relies on depth.
		if((attributes & EffectAttribute.DEPTH) !== 0) {

			// Only read depth if any effect actually uses this information.
			if(readDepth) {

				shaderParts.set(Section.FRAGMENT_MAIN_IMAGE, "float depth = readDepth(UV);\n\n\t" +
					shaderParts.get(Section.FRAGMENT_MAIN_IMAGE));

			}

			// Only request a depth texture if none has been provided yet.
			this.needsDepthTexture = (this.getDepthTexture() === null);

		} else {

			this.needsDepthTexture = false;

		}

		// Check if any effect transforms UVs in the fragment shader.
		if(transformedUv) {

			shaderParts.set(Section.FRAGMENT_MAIN_UV, "vec2 transformedUv = vUv;\n" +
				shaderParts.get(Section.FRAGMENT_MAIN_UV));

			defines.set("UV", "transformedUv");

		} else {

			defines.set("UV", "vUv");

		}

		// Ensure that leading preprocessor directives start at a new line.
		shaderParts.forEach((value, key, map) => map.set(key, value.trim().replace(/^#/, "\n#")));

		this.uniforms = uniforms.size;
		this.varyings = varyings;

		this.skipRendering = (id === 0);
		this.needsSwap = !this.skipRendering;

		const material = this.getFullscreenMaterial();
		material.setShaderParts(shaderParts).setDefines(defines).setUniforms(uniforms);
		material.extensions = {};

		if(extensions.size > 0) {

			// Enable required WebGL extensions.
			for(const extension of extensions) {

				material.extensions[extension] = true;

			}

		}

		this.needsUpdate = false;

	}

	/**
	 * Updates the shader material.
	 *
	 * Warning: This method triggers a relatively expensive shader recompilation.
	 *
	 * @param {WebGLRenderer} [renderer] - The renderer.
	 */

	recompile(renderer) {

		this.updateMaterial();

		if(renderer !== undefined) {

			this.verifyResources(renderer);

		}

	}

	/**
	 * Returns the current depth texture.
	 *
	 * @return {Texture} The current depth texture, or null if there is none.
	 */

	getDepthTexture() {

		return this.getFullscreenMaterial().uniforms.depthBuffer.value;

	}

	/**
	 * Sets the depth texture.
	 *
	 * @param {Texture} depthTexture - A depth texture.
	 * @param {Number} [depthPacking=0] - The depth packing.
	 */

	setDepthTexture(depthTexture, depthPacking = 0) {

		const material = this.getFullscreenMaterial();
		material.uniforms.depthBuffer.value = depthTexture;
		material.depthPacking = depthPacking;
		material.needsUpdate = true;

		for(const effect of this.effects) {

			effect.setDepthTexture(depthTexture, depthPacking);

		}

	}

	/**
	 * Renders the effect.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	 */

	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {

		const material = this.getFullscreenMaterial();
		const time = material.uniforms.time.value + deltaTime;

		if(this.needsUpdate) {

			this.recompile(renderer);

		}

		for(const effect of this.effects) {

			effect.update(renderer, inputBuffer, deltaTime);

		}

		if(!this.skipRendering || this.renderToScreen) {

			material.uniforms.inputBuffer.value = inputBuffer.texture;
			material.uniforms.time.value = (time <= this.maxTime) ? time : this.minTime;
			renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
			renderer.render(this.scene, this.camera);

		}

	}

	/**
	 * Updates the size of this pass.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 */

	setSize(width, height) {

		this.getFullscreenMaterial().setSize(width, height);

		for(const effect of this.effects) {

			effect.setSize(width, height);

		}

	}

	/**
	 * Performs initialization tasks.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
	 * @param {Number} frameBufferType - The type of the main frame buffers.
	 */

	initialize(renderer, alpha, frameBufferType) {

		this.capabilities = renderer.capabilities;

		// Initialize effects before building the shader.
		for(const effect of this.effects) {

			effect.initialize(renderer, alpha, frameBufferType);
			effect.addEventListener("change", (event) => this.handleEvent(event));

		}

		// Initialize the fullscreen material.
		this.updateMaterial();
		this.verifyResources(renderer);

	}

	/**
	 * Deletes disposable objects.
	 *
	 * This pass will be inoperative after this method was called!
	 */

	dispose() {

		super.dispose();

		for(const effect of this.effects) {

			effect.dispose();

		}

	}

	/**
	 * Handles events.
	 *
	 * @param {Event} event - An event.
	 */

	handleEvent(event) {

		switch(event.type) {

			case "change":
				this.needsUpdate = true;
				break;

		}

	}

}

/**
 * A pass that executes a given function.
 */

class LambdaPass extends Pass {

	/**
	 * Constructs a new lambda pass.
	 *
	 * @param {Function} f - A function.
	 */

	constructor(f) {

		super("LambdaPass", null, null);

		this.needsSwap = false;

		/**
		 * A function.
		 *
		 * @type {Function}
		 * @private
		 */

		this.f = f;

	}

	/**
	 * Executes the function.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	 */

	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {

		this.f();

	}

}

/**
 * A stencil mask pass.
 *
 * This pass requires that the input and output buffers have a stencil buffer.
 * You can enable the stencil buffer via the {@link EffectComposer} constructor.
 */

class MaskPass extends Pass {

	/**
	 * Constructs a new mask pass.
	 *
	 * @param {Scene} scene - The scene to render.
	 * @param {Camera} camera - The camera to use.
	 */

	constructor(scene, camera) {

		super("MaskPass", scene, camera);

		this.needsSwap = false;

		/**
		 * A clear pass.
		 *
		 * @type {ClearPass}
		 * @private
		 */

		this.clearPass = new ClearPass(false, false, true);

		/**
		 * Inverse flag.
		 *
		 * @type {Boolean}
		 */

		this.inverse = false;

	}

	/**
	 * Indicates whether this pass should clear the stencil buffer.
	 *
	 * @type {Boolean}
	 */

	get clear() {

		return this.clearPass.enabled;

	}

	/**
	 * Enables or disables auto clear.
	 *
	 * @type {Boolean}
	 */

	set clear(value) {

		this.clearPass.enabled = value;

	}

	/**
	 * Renders the effect.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	 */

	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {

		const context = renderer.getContext();
		const buffers = renderer.state.buffers;

		const scene = this.scene;
		const camera = this.camera;
		const clearPass = this.clearPass;

		const writeValue = this.inverse ? 0 : 1;
		const clearValue = 1 - writeValue;

		// Don't update color or depth.
		buffers.color.setMask(false);
		buffers.depth.setMask(false);

		// Lock the buffers.
		buffers.color.setLocked(true);
		buffers.depth.setLocked(true);

		// Configure the stencil.
		buffers.stencil.setTest(true);
		buffers.stencil.setOp(context.REPLACE, context.REPLACE, context.REPLACE);
		buffers.stencil.setFunc(context.ALWAYS, writeValue, 0xffffffff);
		buffers.stencil.setClear(clearValue);
		buffers.stencil.setLocked(true);

		// Clear the stencil.
		if(this.clear) {

			if(this.renderToScreen) {

				clearPass.render(renderer, null);

			} else {

				clearPass.render(renderer, inputBuffer);
				clearPass.render(renderer, outputBuffer);

			}

		}

		// Draw the mask.
		if(this.renderToScreen) {

			renderer.setRenderTarget(null);
			renderer.render(scene, camera);

		} else {

			renderer.setRenderTarget(inputBuffer);
			renderer.render(scene, camera);
			renderer.setRenderTarget(outputBuffer);
			renderer.render(scene, camera);

		}

		// Unlock the buffers.
		buffers.color.setLocked(false);
		buffers.depth.setLocked(false);

		// Only render where the stencil is set to 1.
		buffers.stencil.setLocked(false);
		buffers.stencil.setFunc(context.EQUAL, 1, 0xffffffff);
		buffers.stencil.setOp(context.KEEP, context.KEEP, context.KEEP);
		buffers.stencil.setLocked(true);

	}

}

/**
 * A pass that renders the normals of a given scene.
 */

class NormalPass extends Pass {

	/**
	 * Constructs a new normal pass.
	 *
	 * @param {Scene} scene - The scene to render.
	 * @param {Camera} camera - The camera to use to render the scene.
	 * @param {Object} [options] - The options.
	 * @param {Number} [options.resolutionScale=1.0] - Deprecated. Adjust the height or width instead for consistent results.
	 * @param {Number} [options.width=Resizer.AUTO_SIZE] - The render width.
	 * @param {Number} [options.height=Resizer.AUTO_SIZE] - The render height.
	 * @param {WebGLRenderTarget} [options.renderTarget] - A custom render target.
	 */

	constructor(scene, camera, {
		resolutionScale = 1.0,
		width = Resizer.AUTO_SIZE,
		height = Resizer.AUTO_SIZE,
		renderTarget
	} = {}) {

		super("NormalPass");

		this.needsSwap = false;

		/**
		 * A render pass.
		 *
		 * @type {RenderPass}
		 * @private
		 */

		this.renderPass = new RenderPass(scene, camera, new MeshNormalMaterial());

		const clearPass = this.renderPass.getClearPass();
		clearPass.overrideClearColor = new Color(0x7777ff);
		clearPass.overrideClearAlpha = 1.0;

		/**
		 * A render target that contains the scene normals.
		 *
		 * @type {WebGLRenderTarget}
		 */

		this.renderTarget = renderTarget;

		if(this.renderTarget === undefined) {

			this.renderTarget = new WebGLRenderTarget(1, 1, {
				minFilter: NearestFilter,
				magFilter: NearestFilter,
				format: RGBFormat,
				stencilBuffer: false
			});

			this.renderTarget.texture.name = "NormalPass.Target";

		}

		/**
		 * The desired render resolution.
		 *
		 * Use {@link Resizer.AUTO_SIZE} for the width or height to automatically
		 * calculate it based on its counterpart and the original aspect ratio.
		 *
		 * @type {Resizer}
		 */

		this.resolution = new Resizer(this, width, height, resolutionScale);

	}

	/**
	 * The normal texture.
	 *
	 * @type {Texture}
	 */

	get texture() {

		return this.renderTarget.texture;

	}

	/**
	 * Returns the current resolution scale.
	 *
	 * @return {Number} The resolution scale.
	 * @deprecated Adjust the fixed resolution width or height instead.
	 */

	getResolutionScale() {

		return this.resolutionScale;

	}

	/**
	 * Sets the resolution scale.
	 *
	 * @param {Number} scale - The new resolution scale.
	 * @deprecated Adjust the fixed resolution width or height instead.
	 */

	setResolutionScale(scale) {

		this.resolutionScale = scale;
		this.setSize(this.resolution.base.x, this.resolution.base.y);

	}

	/**
	 * Renders the scene normals.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	 */

	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {

		const renderTarget = this.renderToScreen ? null : this.renderTarget;
		this.renderPass.render(renderer, renderTarget, renderTarget);

	}

	/**
	 * Updates the size of this pass.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 */

	setSize(width, height) {

		const resolution = this.resolution;
		resolution.base.set(width, height);

		this.renderTarget.setSize(resolution.width, resolution.height);

	}

}

/**
 * A pass that renders the result from a previous pass to another render target.
 */

class SavePass extends Pass {

	/**
	 * Constructs a new save pass.
	 *
	 * @param {WebGLRenderTarget} [renderTarget] - A render target.
	 * @param {Boolean} [resize=true] - Whether the render target should adjust to the size of the input buffer.
	 */

	constructor(renderTarget, resize = true) {

		super("SavePass");

		this.setFullscreenMaterial(new CopyMaterial());

		this.needsSwap = false;

		/**
		 * The render target.
		 *
		 * @type {WebGLRenderTarget}
		 */

		this.renderTarget = renderTarget;

		if(renderTarget === undefined) {

			this.renderTarget = new WebGLRenderTarget(1, 1, {
				minFilter: LinearFilter,
				magFilter: LinearFilter,
				stencilBuffer: false,
				depthBuffer: false
			});

			this.renderTarget.texture.name = "SavePass.Target";

		}

		/**
		 * Indicates whether the render target should be resized automatically.
		 *
		 * @type {Boolean}
		 */

		this.resize = resize;

	}

	/**
	 * The saved texture.
	 *
	 * @type {Texture}
	 */

	get texture() {

		return this.renderTarget.texture;

	}

	/**
	 * Saves the input buffer.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	 */

	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {

		this.getFullscreenMaterial().uniforms.inputBuffer.value = inputBuffer.texture;

		renderer.setRenderTarget(this.renderToScreen ? null : this.renderTarget);
		renderer.render(this.scene, this.camera);

	}

	/**
	 * Updates the size of this pass.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 */

	setSize(width, height) {

		if(this.resize) {

			const w = Math.max(width, 1);
			const h = Math.max(height, 1);

			this.renderTarget.setSize(w, h);

		}

	}

	/**
	 * Performs initialization tasks.
	 *
	 * @param {WebGLRenderer} renderer - A renderer.
	 * @param {Boolean} alpha - Whether the renderer uses the alpha channel.
	 * @param {Number} frameBufferType - The type of the main frame buffers.
	 */

	initialize(renderer, alpha, frameBufferType) {

		if(!alpha && frameBufferType === UnsignedByteType) {

			this.renderTarget.texture.format = RGBFormat;

		}

		if(frameBufferType !== undefined) {

			this.renderTarget.texture.type = frameBufferType;

		}

	}

}

/**
 * A shader pass.
 *
 * Renders any shader material as a fullscreen effect.
 *
 * This pass should not be used to create multiple chained effects. For a more
 * efficient solution, please refer to the {@link EffectPass}.
 */

class ShaderPass extends Pass {

	/**
	 * Constructs a new shader pass.
	 *
	 * @param {ShaderMaterial} material - A shader material.
	 * @param {String} [input="inputBuffer"] - The name of the input buffer uniform.
	 */

	constructor(material, input = "inputBuffer") {

		super("ShaderPass");

		this.setFullscreenMaterial(material);

		/**
		 * The input buffer uniform.
		 *
		 * @type {String}
		 * @private
		 */

		this.uniform = null;
		this.setInput(input);

	}

	/**
	 * Sets the name of the input buffer uniform.
	 *
	 * Most fullscreen materials modify texels from an input texture. This pass
	 * automatically assigns the main input buffer to the uniform identified by
	 * the given name.
	 *
	 * @param {String} input - The name of the input buffer uniform.
	 */

	setInput(input) {

		const material = this.getFullscreenMaterial();

		this.uniform = null;

		if(material !== null) {

			const uniforms = material.uniforms;

			if(uniforms !== undefined && uniforms[input] !== undefined) {

				this.uniform = uniforms[input];

			}

		}

	}

	/**
	 * Renders the effect.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	 */

	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {

		if(this.uniform !== null && inputBuffer !== null) {

			this.uniform.value = inputBuffer.texture;

		}

		renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
		renderer.render(this.scene, this.camera);

	}

}

/**
 * The EffectComposer may be used in place of a normal WebGLRenderer.
 *
 * The auto clear behaviour of the provided renderer will be disabled to prevent
 * unnecessary clear operations.
 *
 * It is common practice to use a {@link RenderPass} as the first pass to
 * automatically clear the buffers and render a scene for further processing.
 *
 * @implements {Resizable}
 * @implements {Disposable}
 */

class EffectComposer {

	/**
	 * Constructs a new effect composer.
	 *
	 * @param {WebGLRenderer} renderer - The renderer that should be used.
	 * @param {Object} [options] - The options.
	 * @param {Boolean} [options.depthBuffer=true] - Whether the main render targets should have a depth buffer.
	 * @param {Boolean} [options.stencilBuffer=false] - Whether the main render targets should have a stencil buffer.
	 * @param {Number} [options.multisampling=0] - The number of samples used for multisample antialiasing. Requires WebGL 2.
	 * @param {Boolean} [options.frameBufferType] - The type of the internal frame buffers. It's recommended to use HalfFloatType if possible.
	 */

	constructor(renderer = null, {
		depthBuffer = true,
		stencilBuffer = false,
		multisampling = 0,
		frameBufferType
	} = {}) {

		/**
		 * The renderer.
		 *
		 * @type {WebGLRenderer}
		 * @private
		 */

		this.renderer = renderer;

		/**
		 * The input buffer.
		 *
		 * Reading from and writing to the same render target should be avoided.
		 * Therefore, two seperate yet identical buffers are used.
		 *
		 * @type {WebGLRenderTarget}
		 * @private
		 */

		this.inputBuffer = null;

		/**
		 * The output buffer.
		 *
		 * @type {WebGLRenderTarget}
		 * @private
		 */

		this.outputBuffer = null;

		if(this.renderer !== null) {

			this.renderer.autoClear = false;
			this.inputBuffer = this.createBuffer(depthBuffer, stencilBuffer, frameBufferType, multisampling);
			this.outputBuffer = this.inputBuffer.clone();
			this.enableExtensions();

		}

		/**
		 * A copy pass used for copying masked scenes.
		 *
		 * @type {ShaderPass}
		 * @private
		 */

		this.copyPass = new ShaderPass(new CopyMaterial());

		/**
		 * A depth texture.
		 *
		 * @type {DepthTexture}
		 * @private
		 */

		this.depthTexture = null;

		/**
		 * The passes.
		 *
		 * @type {Pass[]}
		 * @private
		 */

		this.passes = [];

		/**
		 * Determines whether the last pass automatically renders to screen.
		 *
		 * @type {Boolean}
		 */

		this.autoRenderToScreen = true;

	}

	/**
	 * The current amount of samples used for multisample antialiasing.
	 *
	 * @type {Number}
	 */

	get multisampling() {

		return (this.inputBuffer instanceof WebGLMultisampleRenderTarget) ?
			this.inputBuffer.samples : 0;

	}

	/**
	 * Sets the amount of MSAA samples.
	 *
	 * Requires WebGL 2. Set to zero to disable multisampling.
	 *
	 * @type {Number}
	 */

	set multisampling(value) {

		const buffer = this.inputBuffer;
		const multisampling = this.multisampling;

		if(multisampling > 0 && value > 0) {

			this.inputBuffer.samples = value;
			this.outputBuffer.samples = value;

		} else if(multisampling !== value) {

			this.inputBuffer.dispose();
			this.outputBuffer.dispose();

			// Enable or disable MSAA.
			this.inputBuffer = this.createBuffer(
				buffer.depthBuffer,
				buffer.stencilBuffer,
				buffer.texture.type,
				value
			);

			this.inputBuffer.depthTexture = this.depthTexture;
			this.outputBuffer = this.inputBuffer.clone();

		}

	}

	/**
	 * Returns the WebGL renderer.
	 *
	 * You may replace the renderer at any time by using
	 * {@link EffectComposer#replaceRenderer}.
	 *
	 * @return {WebGLRenderer} The renderer.
	 */

	getRenderer() {

		return this.renderer;

	}

	/**
	 * Explicitly enables required WebGL extensions.
	 *
	 * @private
	 */

	enableExtensions() {

		const frameBufferType = this.inputBuffer.texture.type;
		const capabilities = this.renderer.capabilities;
		const context = this.renderer.getContext();

		if(frameBufferType !== UnsignedByteType) {

			if(capabilities.isWebGL2) {

				context.getExtension("EXT_color_buffer_float");

			} else {

				context.getExtension("EXT_color_buffer_half_float");

			}

		}

	}

	/**
	 * Replaces the current renderer with the given one.
	 *
	 * The auto clear mechanism of the provided renderer will be disabled. If the
	 * new render size differs from the previous one, all passes will be updated.
	 *
	 * By default, the DOM element of the current renderer will automatically be
	 * removed from its parent node and the DOM element of the new renderer will
	 * take its place.
	 *
	 * @param {WebGLRenderer} renderer - The new renderer.
	 * @param {Boolean} updateDOM - Indicates whether the old canvas should be replaced by the new one in the DOM.
	 * @return {WebGLRenderer} The old renderer.
	 */

	replaceRenderer(renderer, updateDOM = true) {

		const oldRenderer = this.renderer;

		if(oldRenderer !== null && oldRenderer !== renderer) {

			const oldSize = oldRenderer.getSize(new Vector2());
			const newSize = renderer.getSize(new Vector2());
			const parent = oldRenderer.domElement.parentNode;

			this.renderer = renderer;
			this.renderer.autoClear = false;

			if(!oldSize.equals(newSize)) {

				this.setSize();

			}

			if(updateDOM && parent !== null) {

				parent.removeChild(oldRenderer.domElement);
				parent.appendChild(renderer.domElement);

			}

			this.enableExtensions();

		}

		return oldRenderer;

	}

	/**
	 * Creates a depth texture attachment that will be provided to all passes.
	 *
	 * Note: When a shader reads from a depth texture and writes to a render
	 * target that uses the same depth texture attachment, the depth information
	 * will be lost. This happens even if `depthWrite` is disabled.
	 *
	 * @private
	 * @return {DepthTexture} The depth texture.
	 */

	createDepthTexture() {

		const depthTexture = this.depthTexture = new DepthTexture();

		// Hack: Make sure the input buffer uses the depth texture.
		this.inputBuffer.depthTexture = depthTexture;
		this.inputBuffer.dispose();

		if(this.inputBuffer.stencilBuffer) {

			depthTexture.format = DepthStencilFormat;
			depthTexture.type = UnsignedInt248Type;

		} else {

			depthTexture.type = UnsignedIntType;

		}

		return depthTexture;

	}

	/**
	 * Deletes the current depth texture.
	 *
	 * @private
	 */

	deleteDepthTexture() {

		if(this.depthTexture !== null) {

			this.depthTexture.dispose();
			this.depthTexture = null;

			// Update the input buffer.
			this.inputBuffer.depthTexture = null;
			this.inputBuffer.dispose();

			for(const pass of this.passes) {

				pass.setDepthTexture(null);

			}

		}

	}

	/**
	 * Creates a new render target by replicating the renderer's canvas.
	 *
	 * The created render target uses a linear filter for texel minification and
	 * magnification. Its render texture format depends on whether the renderer
	 * uses the alpha channel. Mipmaps are disabled.
	 *
	 * Note: The buffer format will also be set to RGBA if the frame buffer type
	 * is HalfFloatType because RGB16F buffers are not renderable.
	 *
	 * @param {Boolean} depthBuffer - Whether the render target should have a depth buffer.
	 * @param {Boolean} stencilBuffer - Whether the render target should have a stencil buffer.
	 * @param {Number} type - The frame buffer type.
	 * @param {Number} multisampling - The number of samples to use for antialiasing.
	 * @return {WebGLRenderTarget} A new render target that equals the renderer's canvas.
	 */

	createBuffer(depthBuffer, stencilBuffer, type, multisampling) {

		const size = this.renderer.getDrawingBufferSize(new Vector2());
		const alpha = this.renderer.getContext().getContextAttributes().alpha;

		const options = {
			format: (!alpha && type === UnsignedByteType) ? RGBFormat : RGBAFormat,
			minFilter: LinearFilter,
			magFilter: LinearFilter,
			stencilBuffer,
			depthBuffer,
			type
		};

		const renderTarget = (multisampling > 0) ?
			new WebGLMultisampleRenderTarget(size.width, size.height, options) :
			new WebGLRenderTarget(size.width, size.height, options);

		if(multisampling > 0) {

			renderTarget.samples = multisampling;

		}

		renderTarget.texture.name = "EffectComposer.Buffer";
		renderTarget.texture.generateMipmaps = false;

		return renderTarget;

	}

	/**
	 * Adds a pass, optionally at a specific index.
	 *
	 * @param {Pass} pass - A new pass.
	 * @param {Number} [index] - An index at which the pass should be inserted.
	 */

	addPass(pass, index) {

		const passes = this.passes;
		const renderer = this.renderer;
		const alpha = renderer.getContext().getContextAttributes().alpha;
		const frameBufferType = this.inputBuffer.texture.type;
		const drawingBufferSize = renderer.getDrawingBufferSize(new Vector2());

		pass.setSize(drawingBufferSize.width, drawingBufferSize.height);
		pass.initialize(renderer, alpha, frameBufferType);

		if(this.autoRenderToScreen) {

			if(passes.length > 0) {

				passes[passes.length - 1].renderToScreen = false;

			}

			if(pass.renderToScreen) {

				this.autoRenderToScreen = false;

			}

		}

		if(index !== undefined) {

			passes.splice(index, 0, pass);

		} else {

			passes.push(pass);

		}

		if(this.autoRenderToScreen) {

			passes[passes.length - 1].renderToScreen = true;

		}

		if(pass.needsDepthTexture || this.depthTexture !== null) {

			if(this.depthTexture === null) {

				const depthTexture = this.createDepthTexture();

				for(pass of passes) {

					pass.setDepthTexture(depthTexture);

				}

			} else {

				pass.setDepthTexture(this.depthTexture);

			}

		}

	}

	/**
	 * Removes a pass.
	 *
	 * @param {Pass} pass - The pass.
	 */

	removePass(pass) {

		const passes = this.passes;
		const index = passes.indexOf(pass);
		const removed = (passes.splice(index, 1).length > 0);

		if(removed) {

			if(this.depthTexture !== null) {

				// Check if the depth texture is still required.
				const reducer = (a, b) => (a || b.needsDepthTexture);
				const depthTextureRequired = passes.reduce(reducer, false);

				if(!depthTextureRequired) {

					if(pass.getDepthTexture() === this.depthTexture) {

						pass.setDepthTexture(null);

					}

					this.deleteDepthTexture();

				}

			}

			if(this.autoRenderToScreen) {

				// Check if the removed pass was the last one.
				if(index === passes.length) {

					pass.renderToScreen = false;

					if(passes.length > 0) {

						passes[passes.length - 1].renderToScreen = true;

					}

				}

			}

		}

	}

	/**
	 * Removes all passes without deleting them.
	 */

	removeAllPasses() {

		const passes = this.passes;

		this.deleteDepthTexture();

		if(passes.length > 0) {

			if(this.autoRenderToScreen) {

				passes[passes.length - 1].renderToScreen = false;

			}

			this.passes = [];

		}

	}

	/**
	 * Renders all enabled passes in the order in which they were added.
	 *
	 * @param {Number} deltaTime - The time since the last frame in seconds.
	 */

	render(deltaTime) {

		const renderer = this.renderer;
		const copyPass = this.copyPass;

		let inputBuffer = this.inputBuffer;
		let outputBuffer = this.outputBuffer;

		let stencilTest = false;
		let context, stencil, buffer;

		for(const pass of this.passes) {

			if(pass.enabled) {

				pass.render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest);

				if(pass.needsSwap) {

					if(stencilTest) {

						copyPass.renderToScreen = pass.renderToScreen;
						context = renderer.getContext();
						stencil = renderer.state.buffers.stencil;

						// Preserve the unaffected pixels.
						stencil.setFunc(context.NOTEQUAL, 1, 0xffffffff);
						copyPass.render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest);
						stencil.setFunc(context.EQUAL, 1, 0xffffffff);

					}

					buffer = inputBuffer;
					inputBuffer = outputBuffer;
					outputBuffer = buffer;

				}

				if(pass instanceof MaskPass) {

					stencilTest = true;

				} else if(pass instanceof ClearMaskPass) {

					stencilTest = false;

				}

			}

		}

	}

	/**
	 * Sets the size of the buffers and the renderer's output canvas.
	 *
	 * Every pass will be informed of the new size. It's up to each pass how that
	 * information is used.
	 *
	 * If no width or height is specified, the render targets and passes will be
	 * updated with the current size of the renderer.
	 *
	 * @param {Number} [width] - The width.
	 * @param {Number} [height] - The height.
	 * @param {Boolean} [updateStyle] - Determines whether the style of the canvas should be updated.
	 */

	setSize(width, height, updateStyle) {

		const renderer = this.renderer;

		if(width === undefined || height === undefined) {

			const size = renderer.getSize(new Vector2());
			width = size.width; height = size.height;

		} else {

			// Update the logical render size.
			renderer.setSize(width, height, updateStyle);

		}

		// The drawing buffer size takes the device pixel ratio into account.
		const drawingBufferSize = renderer.getDrawingBufferSize(new Vector2());

		this.inputBuffer.setSize(drawingBufferSize.width, drawingBufferSize.height);
		this.outputBuffer.setSize(drawingBufferSize.width, drawingBufferSize.height);

		for(const pass of this.passes) {

			pass.setSize(drawingBufferSize.width, drawingBufferSize.height);

		}

	}

	/**
	 * Resets this composer by deleting all passes and creating new buffers.
	 */

	reset() {

		this.dispose();
		this.autoRenderToScreen = true;

	}

	/**
	 * Disposes this composer and all passes.
	 */

	dispose() {

		for(const pass of this.passes) {

			pass.dispose();

		}

		this.passes = [];

		if(this.inputBuffer !== null) {

			this.inputBuffer.dispose();

		}

		if(this.outputBuffer !== null) {

			this.outputBuffer.dispose();

		}

		this.deleteDepthTexture();
		this.copyPass.dispose();

	}

}

/**
 * The initializable contract.
 *
 * Implemented by objects that can be initialized.
 *
 * @interface
 */

class Initializable {

	/**
	 * Performs initialization tasks.
	 *
	 * @param {WebGLRenderer} renderer - A renderer.
	 * @param {Boolean} alpha - Whether the renderer uses the alpha channel.
	 * @param {Number} frameBufferType - The type of the main frame buffers.
	 */

	initialize(renderer, alpha, frameBufferType) {}

}

/**
 * The Resizable contract.
 *
 * Implemented by objects that can be resized.
 *
 * @interface
 */

class Resizable {

	/**
	 * Sets the size of this object.
	 *
	 * @param {Number} width - The new width.
	 * @param {Number} height - The new height.
	 */

	setSize(width, height) {}

}

/**
 * An object selection.
 *
 * Object selections use render layers to facilitate quick and efficient
 * visibility changes.
 */

class Selection extends Set {

	/**
	 * Constructs a new selection.
	 *
	 * @param {Iterable<Object3D>} [iterable] - A collection of objects that should be added to this selection.
	 * @param {Number} [layer=10] - A dedicated render layer for selected objects.
	 */

	constructor(iterable, layer = 10) {

		super();

		/**
		 * The current render layer for selected objects.
		 *
		 * @type {Number}
		 * @private
		 */

		this.currentLayer = layer;

		if(iterable !== undefined) {

			this.set(iterable);

		}

	}

	/**
	 * A dedicated render layer for selected objects.
	 *
	 * This layer is set to 10 by default. If this collides with your own custom
	 * layers, please change it to a free layer before rendering!
	 *
	 * @type {Number}
	 */

	get layer() {

		return this.currentLayer;

	}

	/**
	 * Sets the render layer of selected objects.
	 *
	 * The current selection will be updated accordingly.
	 *
	 * @type {Number}
	 */

	set layer(value) {

		const currentLayer = this.currentLayer;

		for(const object of this) {

			object.layers.disable(currentLayer);
			object.layers.enable(value);

		}

		this.currentLayer = value;

	}

	/**
	 * Clears this selection.
	 *
	 * @return {Selection} This selection.
	 */

	clear() {

		const layer = this.layer;

		for(const object of this) {

			object.layers.disable(layer);

		}

		return super.clear();

	}

	/**
	 * Clears this selection and adds the given objects.
	 *
	 * @param {Iterable<Object3D>} objects - The objects that should be selected. This array will be copied.
	 * @return {Selection} This selection.
	 */

	set(objects) {

		this.clear();

		for(const object of objects) {

			this.add(object);

		}

		return this;

	}

	/**
	 * An alias for {@link has}.
	 *
	 * @param {Object3D} object - An object.
	 * @return {Number} Returns 0 if the given object is currently selected, or -1 otherwise.
	 * @deprecated Added for backward compatibility. Use has instead.
	 */

	indexOf(object) {

		return this.has(object) ? 0 : -1;

	}

	/**
	 * Adds an object to this selection.
	 *
	 * @param {Object3D} object - The object that should be selected.
	 * @return {Selection} This selection.
	 */

	add(object) {

		object.layers.enable(this.layer);
		super.add(object);

		return this;

	}

	/**
	 * Removes an object from this selection.
	 *
	 * @param {Object3D} object - The object that should be deselected.
	 * @return {Boolean} Returns true if an object has successfully been removed from this selection; otherwise false.
	 */

	delete(object) {

		if(this.has(object)) {

			object.layers.disable(this.layer);

		}

		return super.delete(object);

	}

	/**
	 * Sets the visibility of all selected objects.
	 *
	 * This method enables or disables render layer 0 of all selected objects.
	 *
	 * @param {Boolean} visible - Whether the selected objects should be visible.
	 * @return {Selection} This selection.
	 */

	setVisible(visible) {

		for(const object of this) {

			if(visible) {

				object.layers.enable(0);

			} else {

				object.layers.disable(0);

			}

		}

		return this;

	}

}

var fragmentShader$a = "uniform sampler2D texture;uniform float intensity;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=clamp(texture2D(texture,uv)*intensity,0.0,1.0);}";

/**
 * A bloom effect.
 *
 * This effect uses the fast Kawase convolution technique and a luminance filter
 * to blur bright highlights.
 */

class BloomEffect extends Effect {

	/**
	 * Constructs a new bloom effect.
	 *
	 * @param {Object} [options] - The options.
	 * @param {BlendFunction} [options.blendFunction=BlendFunction.SCREEN] - The blend function of this effect.
	 * @param {Number} [options.luminanceThreshold=0.9] - The luminance threshold. Raise this value to mask out darker elements in the scene. Range is [0, 1].
	 * @param {Number} [options.luminanceSmoothing=0.025] - Controls the smoothness of the luminance threshold. Range is [0, 1].
	 * @param {Number} [options.resolutionScale=0.5] - Deprecated. Use height or width instead.
	 * @param {Number} [options.intensity=1.0] - The intensity.
	 * @param {Number} [options.width=Resizer.AUTO_SIZE] - The render width.
	 * @param {Number} [options.height=Resizer.AUTO_SIZE] - The render height.
	 * @param {KernelSize} [options.kernelSize=KernelSize.LARGE] - The blur kernel size.
	 */

	constructor({
		blendFunction = BlendFunction.SCREEN,
		luminanceThreshold = 0.9,
		luminanceSmoothing = 0.025,
		resolutionScale = 0.5,
		intensity = 1.0,
		width = Resizer.AUTO_SIZE,
		height = Resizer.AUTO_SIZE,
		kernelSize = KernelSize.LARGE
	} = {}) {

		super("BloomEffect", fragmentShader$a, {

			blendFunction,

			uniforms: new Map([
				["texture", new Uniform(null)],
				["intensity", new Uniform(intensity)]
			])

		});

		/**
		 * A render target.
		 *
		 * @type {WebGLRenderTarget}
		 * @private
		 */

		this.renderTarget = new WebGLRenderTarget(1, 1, {
			minFilter: LinearFilter,
			magFilter: LinearFilter,
			stencilBuffer: false,
			depthBuffer: false
		});

		this.renderTarget.texture.name = "Bloom.Target";
		this.renderTarget.texture.generateMipmaps = false;

		this.uniforms.get("texture").value = this.renderTarget.texture;

		/**
		 * A blur pass.
		 *
		 * @type {BlurPass}
		 */

		this.blurPass = new BlurPass({ resolutionScale, width, height, kernelSize });
		this.blurPass.resolution.resizable = this;

		/**
		 * A luminance shader pass.
		 *
		 * You may disable this pass to deactivate luminance filtering.
		 *
		 * @type {ShaderPass}
		 */

		this.luminancePass = new ShaderPass(new LuminanceMaterial(true));

		this.luminanceMaterial.threshold = luminanceThreshold;
		this.luminanceMaterial.smoothing = luminanceSmoothing;

	}

	/**
	 * A texture that contains the intermediate result of this effect.
	 *
	 * This texture will be applied to the scene colors unless the blend function
	 * is set to `SKIP`.
	 *
	 * @type {Texture}
	 */

	get texture() {

		return this.renderTarget.texture;

	}

	/**
	 * The luminance material.
	 *
	 * @type {LuminanceMaterial}
	 */

	get luminanceMaterial() {

		return this.luminancePass.getFullscreenMaterial();

	}

	/**
	 * The resolution of this effect.
	 *
	 * @type {Resizer}
	 */

	get resolution() {

		return this.blurPass.resolution;

	}

	/**
	 * The current width of the internal render targets.
	 *
	 * @type {Number}
	 * @deprecated Use resolution.width instead.
	 */

	get width() {

		return this.resolution.width;

	}

	/**
	 * Sets the render width.
	 *
	 * @type {Number}
	 * @deprecated Use resolution.width instead.
	 */

	set width(value) {

		this.resolution.width = value;

	}

	/**
	 * The current height of the internal render targets.
	 *
	 * @type {Number}
	 * @deprecated Use resolution.height instead.
	 */

	get height() {

		return this.resolution.height;

	}

	/**
	 * Sets the render height.
	 *
	 * @type {Number}
	 * @deprecated Use resolution.height instead.
	 */

	set height(value) {

		this.resolution.height = value;

	}

	/**
	 * Indicates whether dithering is enabled.
	 *
	 * @type {Boolean}
	 * @deprecated Set the frameBufferType of the EffectComposer to HalfFloatType instead.
	 */

	get dithering() {

		return this.blurPass.dithering;

	}

	/**
	 * Enables or disables dithering.
	 *
	 * @type {Boolean}
	 * @deprecated Set the frameBufferType of the EffectComposer to HalfFloatType instead.
	 */

	set dithering(value) {

		this.blurPass.dithering = value;

	}

	/**
	 * The blur kernel size.
	 *
	 * @type {KernelSize}
	 * @deprecated Use blurPass.kernelSize instead.
	 */

	get kernelSize() {

		return this.blurPass.kernelSize;

	}

	/**
	 * @type {KernelSize}
	 * @deprecated Use blurPass.kernelSize instead.
	 */

	set kernelSize(value) {

		this.blurPass.kernelSize = value;

	}

	/**
	 * @type {Number}
	 * @deprecated Use luminanceMaterial.threshold and luminanceMaterial.smoothing instead.
	 */

	get distinction() {

		console.warn(this.name, "The distinction field has been removed, use luminanceMaterial.threshold and luminanceMaterial.smoothing instead.");

		return 1.0;

	}

	/**
	 * @type {Number}
	 * @deprecated Use luminanceMaterial.threshold and luminanceMaterial.smoothing instead.
	 */

	set distinction(value) {

		console.warn(this.name, "The distinction field has been removed, use luminanceMaterial.threshold and luminanceMaterial.smoothing instead.");

	}

	/**
	 * The bloom intensity.
	 *
	 * @type {Number}
	 */

	get intensity() {

		return this.uniforms.get("intensity").value;

	}

	/**
	 * Sets the bloom intensity.
	 *
	 * @type {Number}
	 */

	set intensity(value) {

		this.uniforms.get("intensity").value = value;

	}

	/**
	 * Returns the current resolution scale.
	 *
	 * @return {Number} The resolution scale.
	 * @deprecated Adjust the fixed resolution width or height instead.
	 */

	getResolutionScale() {

		return this.resolution.scale;

	}

	/**
	 * Sets the resolution scale.
	 *
	 * @param {Number} scale - The new resolution scale.
	 * @deprecated Adjust the fixed resolution width or height instead.
	 */

	setResolutionScale(scale) {

		this.resolution.scale = scale;

	}

	/**
	 * Updates this effect.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 */

	update(renderer, inputBuffer, deltaTime) {

		const renderTarget = this.renderTarget;

		if(this.luminancePass.enabled) {

			this.luminancePass.render(renderer, inputBuffer, renderTarget);
			this.blurPass.render(renderer, renderTarget, renderTarget);

		} else {

			this.blurPass.render(renderer, inputBuffer, renderTarget);

		}

	}

	/**
	 * Updates the size of internal render targets.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 */

	setSize(width, height) {

		this.blurPass.setSize(width, height);
		this.renderTarget.setSize(this.resolution.width, this.resolution.height);

	}

	/**
	 * Performs initialization tasks.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
	 * @param {Number} frameBufferType - The type of the main frame buffers.
	 */

	initialize(renderer, alpha, frameBufferType) {

		this.blurPass.initialize(renderer, alpha, frameBufferType);

		if(!alpha && frameBufferType === UnsignedByteType) {

			this.renderTarget.texture.format = RGBFormat;

		}

		if(frameBufferType !== undefined) {

			this.renderTarget.texture.type = frameBufferType;

		}

	}

}

var fragmentShader$b = "uniform vec2 angle;uniform float scale;float pattern(const in vec2 uv){vec2 point=scale*vec2(dot(angle.yx,vec2(uv.x,-uv.y)),dot(angle,uv));return(sin(point.x)*sin(point.y))*4.0;}void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 color=vec3(inputColor.rgb*10.0-5.0+pattern(uv*resolution));outputColor=vec4(color,inputColor.a);}";

/**
 * A dot screen effect.
 */

class DotScreenEffect extends Effect {

	/**
	 * Constructs a new dot screen effect.
	 *
	 * @param {Object} [options] - The options.
	 * @param {BlendFunction} [options.blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
	 * @param {Number} [options.angle=1.57] - The angle of the dot pattern.
	 * @param {Number} [options.scale=1.0] - The scale of the dot pattern.
	 */

	constructor({ blendFunction = BlendFunction.NORMAL, angle = Math.PI * 0.5, scale = 1.0 } = {}) {

		super("DotScreenEffect", fragmentShader$b, {

			blendFunction,

			uniforms: new Map([
				["angle", new Uniform(new Vector2())],
				["scale", new Uniform(scale)]
			])

		});

		this.setAngle(angle);

	}

	/**
	 * Sets the pattern angle.
	 *
	 * @param {Number} [angle] - The angle of the dot pattern.
	 */

	setAngle(angle) {

		this.uniforms.get("angle").value.set(Math.sin(angle), Math.cos(angle));

	}

}

/**
 * Generates noise.
 *
 * @private
 * @param {Number} size - The linear texture size.
 * @param {Number} format - The texture format.
 * @param {Number} type - The texture type.
 * @return {TypedArray} The noise data.
 */

function getNoise(size, format, type) {

	const channels = new Map([
		[LuminanceFormat, 1],
		[RedFormat, 1],
		[RGFormat, 2],
		[RGBFormat, 3],
		[RGBAFormat, 4]
	]);

	let data;

	if(!channels.has(format)) {

		console.error("Invalid noise texture format");

	}

	if(type === UnsignedByteType) {

		data = new Uint8Array(size * channels.get(format));

		for(let i = 0, l = data.length; i < l; ++i) {

			data[i] = Math.random() * 255;

		}

	} else {

		data = new Float32Array(size * channels.get(format));

		for(let i = 0, l = data.length; i < l; ++i) {

			data[i] = Math.random();

		}

	}

	return data;

}

/**
 * A simple noise texture.
 */

class NoiseTexture extends DataTexture {

	/**
	 * Constructs a new noise texture.
	 *
	 * The texture format can be either `LuminanceFormat`, `RGBFormat` or
	 * `RGBAFormat`. Additionally, the formats `RedFormat` and `RGFormat` can be
	 * used in a WebGL 2 context.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 * @param {Number} [format=LuminanceFormat] - The texture format.
	 * @param {Number} [type=UnsignedByteType] - The texture type.
	 */

	constructor(width, height, format = LuminanceFormat, type = UnsignedByteType) {

		super(getNoise(width * height, format, type), width, height, format, type);

	}

}

var fragmentShader$c = "uniform sampler2D perturbationMap;uniform bool active;uniform float columns;uniform float random;uniform vec2 seed;uniform vec2 distortion;void mainUv(inout vec2 uv){if(active){if(uv.y<distortion.x+columns&&uv.y>distortion.x-columns*random){float sx=clamp(ceil(seed.x),0.0,1.0);uv.y=sx*(1.0-(uv.y+distortion.y))+(1.0-sx)*distortion.y;}if(uv.x<distortion.y+columns&&uv.x>distortion.y-columns*random){float sy=clamp(ceil(seed.y),0.0,1.0);uv.x=sy*distortion.x+(1.0-sy)*(1.0-(uv.x+distortion.x));}vec2 normal=texture2D(perturbationMap,uv*random*random).rg;uv+=normal*seed*(random*0.2);}}";

/**
 * A label for generated data textures.
 *
 * @type {String}
 * @private
 */

const tag = "Glitch.Generated";

/**
 * Returns a random float in the specified range.
 *
 * @private
 * @param {Number} low - The lowest possible value.
 * @param {Number} high - The highest possible value.
 * @return {Number} The random value.
 */

function randomFloat(low, high) {

	return low + Math.random() * (high - low);

}

/**
 * A glitch effect.
 *
 * This effect can influence the {@link ChromaticAberrationEffect}.
 *
 * Reference: https://github.com/staffantan/unityglitch
 *
 * Warning: This effect cannot be merged with convolution effects.
 */

class GlitchEffect extends Effect {

	/**
	 * Constructs a new glitch effect.
	 *
	 * @param {Object} [options] - The options.
	 * @param {BlendFunction} [options.blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
	 * @param {Vector2} [options.chromaticAberrationOffset] - A chromatic aberration offset. If provided, the glitch effect will influence this offset.
	 * @param {Vector2} [options.delay] - The minimum and maximum delay between glitch activations in seconds.
	 * @param {Vector2} [options.duration] - The minimum and maximum duration of a glitch in seconds.
	 * @param {Vector2} [options.strength] - The strength of weak and strong glitches.
	 * @param {Texture} [options.perturbationMap] - A perturbation map. If none is provided, a noise texture will be created.
	 * @param {Number} [options.dtSize=64] - The size of the generated noise map. Will be ignored if a perturbation map is provided.
	 * @param {Number} [options.columns=0.05] - The scale of the blocky glitch columns.
	 * @param {Number} [options.ratio=0.85] - The threshold for strong glitches.
	 */

	constructor({
		blendFunction = BlendFunction.NORMAL,
		chromaticAberrationOffset = null,
		delay = new Vector2(1.5, 3.5),
		duration = new Vector2(0.6, 1.0),
		strength = new Vector2(0.3, 1.0),
		columns = 0.05,
		ratio = 0.85,
		perturbationMap = null,
		dtSize = 64
	} = {}) {

		super("GlitchEffect", fragmentShader$c, {

			blendFunction,

			uniforms: new Map([
				["perturbationMap", new Uniform(null)],
				["columns", new Uniform(columns)],
				["active", new Uniform(false)],
				["random", new Uniform(1.0)],
				["seed", new Uniform(new Vector2())],
				["distortion", new Uniform(new Vector2())]
			])

		});

		this.setPerturbationMap((perturbationMap === null) ?
			this.generatePerturbationMap(dtSize) :
			perturbationMap
		);

		/**
		 * The minimum and maximum delay between glitch activations in seconds.
		 *
		 * @type {Vector2}
		 */

		this.delay = delay;

		/**
		 * The minimum and maximum duration of a glitch in seconds.
		 *
		 * @type {Vector2}
		 */

		this.duration = duration;

		/**
		 * A random glitch break point.
		 *
		 * @type {Number}
		 * @private
		 */

		this.breakPoint = new Vector2(
			randomFloat(this.delay.x, this.delay.y),
			randomFloat(this.duration.x, this.duration.y)
		);

		/**
		 * A time accumulator.
		 *
		 * @type {Number}
		 * @private
		 */

		this.time = 0;

		/**
		 * Random seeds.
		 *
		 * @type {Vector2}
		 * @private
		 */

		this.seed = this.uniforms.get("seed").value;

		/**
		 * A distortion vector.
		 *
		 * @type {Vector2}
		 * @private
		 */

		this.distortion = this.uniforms.get("distortion").value;

		/**
		 * The effect mode.
		 *
		 * @type {GlitchMode}
		 */

		this.mode = GlitchMode.SPORADIC;

		/**
		 * The strength of weak and strong glitches.
		 *
		 * @type {Vector2}
		 */

		this.strength = strength;

		/**
		 * The threshold for strong glitches, ranging from 0 to 1 where 0 means no
		 * weak glitches and 1 means no strong ones. The default ratio of 0.85
		 * offers a decent balance.
		 *
		 * @type {Number}
		 */

		this.ratio = ratio;

		/**
		 * The chromatic aberration offset.
		 *
		 * @type {Vector2}
		 */

		this.chromaticAberrationOffset = chromaticAberrationOffset;

	}

	/**
	 * Indicates whether the glitch effect is currently active.
	 *
	 * @type {Boolean}
	 */

	get active() {

		return this.uniforms.get("active").value;

	}

	/**
	 * Returns the current perturbation map.
	 *
	 * @return {Texture} The current perturbation map.
	 */

	getPerturbationMap() {

		return this.uniforms.get("perturbationMap").value;

	}

	/**
	 * Replaces the current perturbation map with the given one.
	 *
	 * The current map will be disposed if it was generated by this effect.
	 *
	 * @param {Texture} map - The new perturbation map.
	 */

	setPerturbationMap(map) {

		const currentMap = this.getPerturbationMap();

		if(currentMap !== null && currentMap.name === tag) {

			currentMap.dispose();

		}

		map.minFilter = map.magFilter = NearestFilter;
		map.wrapS = map.wrapT = RepeatWrapping;
		map.generateMipmaps = false;

		this.uniforms.get("perturbationMap").value = map;

	}

	/**
	 * Generates a perturbation map.
	 *
	 * @param {Number} [size=64] - The texture size.
	 * @return {DataTexture} The perturbation map.
	 */

	generatePerturbationMap(size = 64) {

		const map = new NoiseTexture(size, size, RGBFormat);
		map.name = tag;

		return map;

	}

	/**
	 * Updates this effect.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 */

	update(renderer, inputBuffer, deltaTime) {

		const mode = this.mode;
		const breakPoint = this.breakPoint;
		const offset = this.chromaticAberrationOffset;
		const s = this.strength;

		let time = this.time;
		let active = false;
		let r = 0.0, a = 0.0;
		let trigger;

		if(mode !== GlitchMode.DISABLED) {

			if(mode === GlitchMode.SPORADIC) {

				time += deltaTime;
				trigger = (time > breakPoint.x);

				if(time >= (breakPoint.x + breakPoint.y)) {

					breakPoint.set(
						randomFloat(this.delay.x, this.delay.y),
						randomFloat(this.duration.x, this.duration.y)
					);

					time = 0;

				}

			}

			r = Math.random();
			this.uniforms.get("random").value = r;

			if((trigger && r > this.ratio) || mode === GlitchMode.CONSTANT_WILD) {

				active = true;

				r *= s.y * 0.03;
				a = randomFloat(-Math.PI, Math.PI);

				this.seed.set(randomFloat(-s.y, s.y), randomFloat(-s.y, s.y));
				this.distortion.set(randomFloat(0.0, 1.0), randomFloat(0.0, 1.0));

			} else if(trigger || mode === GlitchMode.CONSTANT_MILD) {

				active = true;

				r *= s.x * 0.03;
				a = randomFloat(-Math.PI, Math.PI);

				this.seed.set(randomFloat(-s.x, s.x), randomFloat(-s.x, s.x));
				this.distortion.set(randomFloat(0.0, 1.0), randomFloat(0.0, 1.0));

			}

			this.time = time;

		}

		if(offset !== null) {

			if(active) {

				offset.set(Math.cos(a), Math.sin(a)).multiplyScalar(r);

			} else {

				offset.set(0.0, 0.0);

			}

		}

		this.uniforms.get("active").value = active;

	}

}

/**
 * A glitch mode enumeration.
 *
 * @type {Object}
 * @property {Number} DISABLED - No glitches.
 * @property {Number} SPORADIC - Sporadic glitches.
 * @property {Number} CONSTANT_MILD - Constant mild glitches.
 * @property {Number} CONSTANT_WILD - Constant wild glitches.
 */

const GlitchMode = {

	DISABLED: 0,
	SPORADIC: 1,
	CONSTANT_MILD: 2,
	CONSTANT_WILD: 3

};

var fragmentShader$d = "void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec3 noise=vec3(rand(uv*time));\n#ifdef PREMULTIPLY\noutputColor=vec4(min(inputColor.rgb*noise,vec3(1.0)),inputColor.a);\n#else\noutputColor=vec4(noise,inputColor.a);\n#endif\n}";

/**
 * A noise effect.
 */

class NoiseEffect extends Effect {

	/**
	 * Constructs a new noise effect.
	 *
	 * @param {Object} [options] - The options.
	 * @param {BlendFunction} [options.blendFunction=BlendFunction.SCREEN] - The blend function of this effect.
	 * @param {Boolean} [options.premultiply=false] - Whether the noise should be multiplied with the input color.
	 */

	constructor({ blendFunction = BlendFunction.SCREEN, premultiply = false } = {}) {

		super("NoiseEffect", fragmentShader$d, { blendFunction });

		this.premultiply = premultiply;

	}

	/**
	 * Indicates whether the noise should be multiplied with the input color.
	 *
	 * @type {Boolean}
	 */

	get premultiply() {

		return this.defines.has("PREMULTIPLY");

	}

	/**
	 * Enables or disables noise premultiplication.
	 *
	 * @type {Boolean}
	 */

	set premultiply(value) {

		if(this.premultiply !== value) {

			if(value) {

				this.defines.set("PREMULTIPLY", "1");

			} else {

				this.defines.delete("PREMULTIPLY");

			}

			this.setChanged();

		}

	}

}

var fragmentShader$e = "uniform sampler2D edgeTexture;uniform sampler2D maskTexture;uniform vec3 visibleEdgeColor;uniform vec3 hiddenEdgeColor;uniform float pulse;uniform float edgeStrength;\n#ifdef USE_PATTERN\nuniform sampler2D patternTexture;varying vec2 vUvPattern;\n#endif\nvoid mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec2 edge=texture2D(edgeTexture,uv).rg;vec2 mask=texture2D(maskTexture,uv).rg;\n#ifndef X_RAY\nedge.y=0.0;\n#endif\nedge*=(edgeStrength*mask.x*pulse);vec3 color=edge.x*visibleEdgeColor+edge.y*hiddenEdgeColor;float visibilityFactor=0.0;\n#ifdef USE_PATTERN\nvec4 patternColor=texture2D(patternTexture,vUvPattern);\n#ifdef X_RAY\nfloat hiddenFactor=0.5;\n#else\nfloat hiddenFactor=0.0;\n#endif\nvisibilityFactor=(1.0-mask.y>0.0)? 1.0 : hiddenFactor;visibilityFactor*=(1.0-mask.x)*patternColor.a;color+=visibilityFactor*patternColor.rgb;\n#endif\nfloat alpha=max(max(edge.x,edge.y),visibilityFactor);\n#ifdef ALPHA\noutputColor=vec4(color,alpha);\n#else\noutputColor=vec4(color,max(alpha,inputColor.a));\n#endif\n}";

var vertexShader$6 = "uniform float patternScale;varying vec2 vUvPattern;void mainSupport(const in vec2 uv){vUvPattern=uv*vec2(aspect,1.0)*patternScale;}";

/**
 * An outline effect.
 */

class OutlineEffect extends Effect {

	/**
	 * Constructs a new outline effect.
	 *
	 * If you want dark outlines, remember to use an appropriate blend function.
	 *
	 * @param {Scene} scene - The main scene.
	 * @param {Camera} camera - The main camera.
	 * @param {Object} [options] - The options.
	 * @param {BlendFunction} [options.blendFunction=BlendFunction.SCREEN] - The blend function.  Set this to `BlendFunction.ALPHA` for dark outlines.
	 * @param {Number} [options.patternTexture=null] - A pattern texture.
	 * @param {Number} [options.edgeStrength=1.0] - The edge strength.
	 * @param {Number} [options.pulseSpeed=0.0] - The pulse speed. A value of zero disables the pulse effect.
	 * @param {Number} [options.visibleEdgeColor=0xffffff] - The color of visible edges.
	 * @param {Number} [options.hiddenEdgeColor=0x22090a] - The color of hidden edges.
	 * @param {Number} [options.resolutionScale=0.5] - Deprecated. Use height or width instead.
	 * @param {Number} [options.width=Resizer.AUTO_SIZE] - The render width.
	 * @param {Number} [options.height=Resizer.AUTO_SIZE] - The render height.
	 * @param {KernelSize} [options.kernelSize=KernelSize.VERY_SMALL] - The blur kernel size.
	 * @param {Boolean} [options.blur=false] - Whether the outline should be blurred.
	 * @param {Boolean} [options.xRay=true] - Whether occluded parts of selected objects should be visible.
	 */

	constructor(scene, camera, {
		blendFunction = BlendFunction.SCREEN,
		patternTexture = null,
		edgeStrength = 1.0,
		pulseSpeed = 0.0,
		visibleEdgeColor = 0xffffff,
		hiddenEdgeColor = 0x22090a,
		resolutionScale = 0.5,
		width = Resizer.AUTO_SIZE,
		height = Resizer.AUTO_SIZE,
		kernelSize = KernelSize.VERY_SMALL,
		blur = false,
		xRay = true
	} = {}) {

		super("OutlineEffect", fragmentShader$e, {

			uniforms: new Map([
				["maskTexture", new Uniform(null)],
				["edgeTexture", new Uniform(null)],
				["edgeStrength", new Uniform(edgeStrength)],
				["visibleEdgeColor", new Uniform(new Color(visibleEdgeColor))],
				["hiddenEdgeColor", new Uniform(new Color(hiddenEdgeColor))],
				["pulse", new Uniform(1.0)],
				["patternScale", new Uniform(1.0)],
				["patternTexture", new Uniform(null)]
			])

		});

		// Handle alpha blending.
		this.blendMode.addEventListener("change", (event) => {

			if(this.blendMode.getBlendFunction() === BlendFunction.ALPHA) {

				this.defines.set("ALPHA", "1");

			} else {

				this.defines.delete("ALPHA");

			}

			this.setChanged();

		});

		this.blendMode.setBlendFunction(blendFunction);
		this.setPatternTexture(patternTexture);
		this.xRay = xRay;

		/**
		 * The main scene.
		 *
		 * @type {Scene}
		 * @private
		 */

		this.scene = scene;

		/**
		 * The main camera.
		 *
		 * @type {Camera}
		 * @private
		 */

		this.camera = camera;

		/**
		 * A render target for the outline mask.
		 *
		 * @type {WebGLRenderTarget}
		 * @private
		 */

		this.renderTargetMask = new WebGLRenderTarget(1, 1, {
			minFilter: LinearFilter,
			magFilter: LinearFilter,
			stencilBuffer: false,
			format: RGBFormat
		});

		this.renderTargetMask.texture.name = "Outline.Mask";

		this.uniforms.get("maskTexture").value = this.renderTargetMask.texture;

		/**
		 * A render target for the edge detection.
		 *
		 * @type {WebGLRenderTarget}
		 * @private
		 */

		this.renderTargetOutline = this.renderTargetMask.clone();
		this.renderTargetOutline.texture.name = "Outline.Edges";
		this.renderTargetOutline.depthBuffer = false;

		/**
		 * A render target for the blurred outline overlay.
		 *
		 * @type {WebGLRenderTarget}
		 * @private
		 */

		this.renderTargetBlurredOutline = this.renderTargetOutline.clone();
		this.renderTargetBlurredOutline.texture.name = "Outline.BlurredEdges";

		/**
		 * A clear pass.
		 *
		 * @type {ClearPass}
		 * @private
		 */

		this.clearPass = new ClearPass();
		this.clearPass.overrideClearColor = new Color(0x000000);
		this.clearPass.overrideClearAlpha = 1.0;

		/**
		 * A depth pass.
		 *
		 * @type {DepthPass}
		 * @private
		 */

		this.depthPass = new DepthPass(scene, camera);

		/**
		 * A depth comparison mask pass.
		 *
		 * @type {RenderPass}
		 * @private
		 */

		this.maskPass = new RenderPass(scene, camera,
			new DepthComparisonMaterial(this.depthPass.texture, camera));

		const clearPass = this.maskPass.getClearPass();
		clearPass.overrideClearColor = new Color(0xffffff);
		clearPass.overrideClearAlpha = 1.0;

		/**
		 * A blur pass.
		 *
		 * @type {BlurPass}
		 */

		this.blurPass = new BlurPass({ resolutionScale, width, height, kernelSize });
		this.blurPass.resolution.resizable = this;
		this.blur = blur;

		/**
		 * An outline detection pass.
		 *
		 * @type {ShaderPass}
		 * @private
		 */

		this.outlinePass = new ShaderPass(new OutlineMaterial());
		this.outlinePass.getFullscreenMaterial().uniforms.inputBuffer.value = this.renderTargetMask.texture;

		/**
		 * The current animation time.
		 *
		 * @type {Number}
		 * @private
		 */

		this.time = 0.0;

		/**
		 * A selection of objects that will be outlined.
		 *
		 * @type {Selection}
		 */

		this.selection = new Selection();

		/**
		 * The pulse speed. A value of zero disables the pulse effect.
		 *
		 * @type {Number}
		 */

		this.pulseSpeed = pulseSpeed;

	}

	/**
	 * The resolution of this effect.
	 *
	 * @type {Resizer}
	 */

	get resolution() {

		return this.blurPass.resolution;

	}

	/**
	 * The current width of the internal render targets.
	 *
	 * @type {Number}
	 * @deprecated Use resolution.width instead.
	 */

	get width() {

		return this.resolution.width;

	}

	/**
	 * Sets the render width.
	 *
	 * @type {Number}
	 * @deprecated Use resolution.width instead.
	 */

	set width(value) {

		this.resolution.width = value;

	}

	/**
	 * The current height of the internal render targets.
	 *
	 * @type {Number}
	 * @deprecated Use resolution.height instead.
	 */

	get height() {

		return this.resolution.height;

	}

	/**
	 * Sets the render height.
	 *
	 * @type {Number}
	 * @deprecated Use resolution.height instead.
	 */

	set height(value) {

		this.resolution.height = value;

	}

	/**
	 * @type {Number}
	 * @deprecated Use selection.layer instead.
	 */

	get selectionLayer() {

		return this.selection.layer;

	}

	/**
	 * @type {Number}
	 * @deprecated Use selection.layer instead.
	 */

	set selectionLayer(value) {

		this.selection.layer = value;

	}

	/**
	 * Indicates whether dithering is enabled.
	 *
	 * @type {Boolean}
	 * @deprecated Set the frameBufferType of the EffectComposer to HalfFloatType instead.
	 */

	get dithering() {

		return this.blurPass.dithering;

	}

	/**
	 * Enables or disables dithering.
	 *
	 * @type {Boolean}
	 * @deprecated Set the frameBufferType of the EffectComposer to HalfFloatType instead.
	 */

	set dithering(value) {

		this.blurPass.dithering = value;

	}

	/**
	 * The blur kernel size.
	 *
	 * @type {KernelSize}
	 * @deprecated Use blurPass.kernelSize instead.
	 */

	get kernelSize() {

		return this.blurPass.kernelSize;

	}

	/**
	 * Sets the kernel size.
	 *
	 * @type {KernelSize}
	 * @deprecated Use blurPass.kernelSize instead.
	 */

	set kernelSize(value) {

		this.blurPass.kernelSize = value;

	}

	/**
	 * Indicates whether the outlines should be blurred.
	 *
	 * @type {Boolean}
	 */

	get blur() {

		return this.blurPass.enabled;

	}

	/**
	 * @type {Boolean}
	 */

	set blur(value) {

		this.blurPass.enabled = value;

		this.uniforms.get("edgeTexture").value = value ?
			this.renderTargetBlurredOutline.texture :
			this.renderTargetOutline.texture;

	}

	/**
	 * Indicates whether X-Ray outlines are enabled.
	 *
	 * @type {Boolean}
	 */

	get xRay() {

		return this.defines.has("X_RAY");

	}

	/**
	 * Enables or disables X-Ray outlines.
	 *
	 * @type {Boolean}
	 */

	set xRay(value) {

		if(this.xRay !== value) {

			if(value) {

				this.defines.set("X_RAY", "1");

			} else {

				this.defines.delete("X_RAY");

			}

			this.setChanged();

		}

	}

	/**
	 * Sets the pattern texture.
	 *
	 * @param {Texture} texture - The new texture.
	 */

	setPatternTexture(texture) {

		if(texture !== null) {

			texture.wrapS = texture.wrapT = RepeatWrapping;

			this.defines.set("USE_PATTERN", "1");
			this.uniforms.get("patternTexture").value = texture;
			this.setVertexShader(vertexShader$6);

		} else {

			this.defines.delete("USE_PATTERN");
			this.uniforms.get("patternTexture").value = null;
			this.setVertexShader(null);

		}

		this.setChanged();

	}

	/**
	 * Returns the current resolution scale.
	 *
	 * @return {Number} The resolution scale.
	 * @deprecated Adjust the fixed resolution width or height instead.
	 */

	getResolutionScale() {

		return this.resolution.scale;

	}

	/**
	 * Sets the resolution scale.
	 *
	 * @param {Number} scale - The new resolution scale.
	 * @deprecated Adjust the fixed resolution width or height instead.
	 */

	setResolutionScale(scale) {

		this.resolution.scale = scale;

	}

	/**
	 * Clears the current selection and selects a list of objects.
	 *
	 * @param {Object3D[]} objects - The objects that should be outlined. This array will be copied.
	 * @return {OutlinePass} This pass.
	 * @deprecated Use selection.set instead.
	 */

	setSelection(objects) {

		this.selection.set(objects);

		return this;

	}

	/**
	 * Clears the list of selected objects.
	 *
	 * @return {OutlinePass} This pass.
	 * @deprecated Use selection.clear instead.
	 */

	clearSelection() {

		this.selection.clear();

		return this;

	}

	/**
	 * Selects an object.
	 *
	 * @param {Object3D} object - The object that should be outlined.
	 * @return {OutlinePass} This pass.
	 * @deprecated Use selection.add instead.
	 */

	selectObject(object) {

		this.selection.add(object);

		return this;

	}

	/**
	 * Deselects an object.
	 *
	 * @param {Object3D} object - The object that should no longer be outlined.
	 * @return {OutlinePass} This pass.
	 * @deprecated Use selection.delete instead.
	 */

	deselectObject(object) {

		this.selection.delete(object);

		return this;

	}

	/**
	 * Updates this effect.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 */

	update(renderer, inputBuffer, deltaTime) {

		const scene = this.scene;
		const camera = this.camera;
		const selection = this.selection;
		const pulse = this.uniforms.get("pulse");

		const background = scene.background;
		const mask = camera.layers.mask;

		if(selection.size > 0) {

			scene.background = null;
			pulse.value = 1.0;

			if(this.pulseSpeed > 0.0) {

				pulse.value = 0.625 + Math.cos(this.time * this.pulseSpeed * 10.0) * 0.375;

			}

			this.time += deltaTime;

			// Render a custom depth texture and ignore selected objects.
			selection.setVisible(false);
			this.depthPass.render(renderer);
			selection.setVisible(true);

			// Compare the depth of the selected objects with the depth texture.
			camera.layers.set(selection.layer);
			this.maskPass.render(renderer, this.renderTargetMask);

			// Restore the camera layer mask and the scene background.
			camera.layers.mask = mask;
			scene.background = background;

			// Detect the outline.
			this.outlinePass.render(renderer, null, this.renderTargetOutline);

			if(this.blur) {

				this.blurPass.render(renderer, this.renderTargetOutline, this.renderTargetBlurredOutline);

			}

		} else if(this.time > 0.0) {

			this.clearPass.render(renderer, this.renderTargetMask);
			this.time = 0.0;

		}

	}

	/**
	 * Updates the size of internal render targets.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 */

	setSize(width, height) {

		this.blurPass.setSize(width, height);
		this.renderTargetMask.setSize(width, height);

		const w = this.resolution.width;
		const h = this.resolution.height;

		this.depthPass.setSize(w, h);
		this.renderTargetOutline.setSize(w, h);
		this.renderTargetBlurredOutline.setSize(w, h);
		this.outlinePass.getFullscreenMaterial().setTexelSize(1.0 / w, 1.0 / h);

	}

	/**
	 * Performs initialization tasks.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
	 * @param {Number} frameBufferType - The type of the main frame buffers.
	 */

	initialize(renderer, alpha, frameBufferType) {

		// No need for high precision: the blur pass operates on a mask texture.
		this.blurPass.initialize(renderer, alpha, UnsignedByteType);

		if(frameBufferType !== undefined) {

			// These passes ignore the buffer type.
			this.depthPass.initialize(renderer, alpha, frameBufferType);
			this.maskPass.initialize(renderer, alpha, frameBufferType);
			this.outlinePass.initialize(renderer, alpha, frameBufferType);

		}

	}

}

var fragmentShader$f = "uniform bool active;uniform vec2 d;void mainUv(inout vec2 uv){if(active){uv=vec2(d.x*(floor(uv.x/d.x)+0.5),d.y*(floor(uv.y/d.y)+0.5));}}";

/**
 * A pixelation effect.
 *
 * Warning: This effect cannot be merged with convolution effects.
 */

class PixelationEffect extends Effect {

	/**
	 * Constructs a new pixelation effect.
	 *
	 * @param {Object} [granularity=30.0] - The pixel granularity.
	 */

	constructor(granularity = 30.0) {

		super("PixelationEffect", fragmentShader$f, {

			uniforms: new Map([
				["active", new Uniform(false)],
				["d", new Uniform(new Vector2())]
			])

		});

		/**
		 * The original resolution.
		 *
		 * @type {Vector2}
		 * @private
		 */

		this.resolution = new Vector2();

		/**
		 * The pixel granularity.
		 *
		 * @type {Number}
		 * @private
		 */

		this.granularity = granularity;

	}

	/**
	 * Returns the pixel granularity.
	 *
	 * @return {Number} The granularity.
	 */

	getGranularity() {

		return this.granularity;

	}

	/**
	 * Sets the pixel granularity.
	 *
	 * A higher value yields coarser visuals.
	 *
	 * @param {Number} granularity - The new granularity.
	 */

	setGranularity(granularity) {

		granularity = Math.floor(granularity);

		if(granularity % 2 > 0) {

			granularity += 1;

		}

		const uniforms = this.uniforms;
		uniforms.get("active").value = (granularity > 0.0);
		uniforms.get("d").value.set(granularity, granularity).divide(this.resolution);

		this.granularity = granularity;

	}

	/**
	 * Updates the granularity.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 */

	setSize(width, height) {

		this.resolution.set(width, height);
		this.setGranularity(this.granularity);

	}

}

var fragmentShader$g = "uniform float count;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec2 sl=vec2(sin(uv.y*count),cos(uv.y*count));vec3 scanlines=vec3(sl.x,sl.y,sl.x);outputColor=vec4(scanlines,inputColor.a);}";

/**
 * A scanline effect.
 *
 * Based on an implementation by Georg 'Leviathan' Steinrohder (CC BY 3.0):
 * http://www.truevision3d.com/forums/showcase/staticnoise_colorblackwhite_scanline_shaders-t18698.0.html
 */

class ScanlineEffect extends Effect {

	/**
	 * Constructs a new scanline effect.
	 *
	 * @param {Object} [options] - The options.
	 * @param {BlendFunction} [options.blendFunction=BlendFunction.OVERLAY] - The blend function of this effect.
	 * @param {Number} [options.density=1.25] - The scanline density.
	 */

	constructor({ blendFunction = BlendFunction.OVERLAY, density = 1.25 } = {}) {

		super("ScanlineEffect", fragmentShader$g, {

			blendFunction,

			uniforms: new Map([
				["count", new Uniform(0.0)]
			])

		});

		/**
		 * The original resolution.
		 *
		 * @type {Vector2}
		 * @private
		 */

		this.resolution = new Vector2();

		/**
		 * The amount of scanlines, relative to the screen height.
		 *
		 * @type {Number}
		 * @private
		 */

		this.density = density;

	}

	/**
	 * Returns the current scanline density.
	 *
	 * @return {Number} The scanline density.
	 */

	getDensity() {

		return this.density;

	}

	/**
	 * Sets the scanline density.
	 *
	 * @param {Number} density - The new scanline density.
	 */

	setDensity(density) {

		this.density = density;
		this.setSize(this.resolution.x, this.resolution.y);

	}

	/**
	 * Updates the size of this pass.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 */

	setSize(width, height) {

		this.resolution.set(width, height);
		this.uniforms.get("count").value = Math.round(height * this.density);

	}

}

/**
 * A selective bloom effect.
 *
 * This effect applies bloom only to selected objects by using layers. Make sure
 * to enable the selection layer for all relevant lights:
 *
 * `lights.forEach((l) => l.layers.enable(bloomEffect.selection.layer));`
 *
 * Attention: If you don't need to limit bloom to a subset of objects, consider
 * using the {@link BloomEffect} instead for better performance.
 */

class SelectiveBloomEffect extends BloomEffect {

	/**
	 * Constructs a new selective bloom effect.
	 *
	 * @param {Scene} scene - The main scene.
	 * @param {Camera} camera - The main camera.
	 * @param {Object} [options] - The options. See {@link BloomEffect} for details.
	 */

	constructor(scene, camera, options) {

		super(options);

		/**
		 * The main scene.
		 *
		 * @type {Scene}
		 * @private
		 */

		this.scene = scene;

		/**
		 * The main camera.
		 *
		 * @type {Camera}
		 * @private
		 */

		this.camera = camera;

		/**
		 * A clear pass.
		 *
		 * @type {ClearPass}
		 * @private
		 */

		this.clearPass = new ClearPass(true, true, false);
		this.clearPass.overrideClearColor = new Color(0x000000);

		/**
		 * A render pass.
		 *
		 * @type {RenderPass}
		 * @private
		 */

		this.renderPass = new RenderPass(scene, camera);
		this.renderPass.clear = false;

		/**
		 * A render pass that renders all objects solid black.
		 *
		 * @type {RenderPass}
		 * @private
		 */

		this.blackoutPass = new RenderPass(scene, camera, new MeshBasicMaterial({ color: 0x000000 }));
		this.blackoutPass.clear = false;

		/**
		 * A render pass that only renders the background of the main scene.
		 *
		 * @type {RenderPass}
		 * @private
		 */

		this.backgroundPass = (() => {

			const backgroundScene = new Scene();
			const pass = new RenderPass(backgroundScene, camera);

			backgroundScene.background = scene.background;
			pass.clear = false;

			return pass;

		})();

		/**
		 * A render target.
		 *
		 * @type {WebGLRenderTarget}
		 * @private
		 */

		this.renderTargetSelection = new WebGLRenderTarget(1, 1, {
			minFilter: LinearFilter,
			magFilter: LinearFilter,
			stencilBuffer: false,
			depthBuffer: true
		});

		this.renderTargetSelection.texture.name = "Bloom.Selection";
		this.renderTargetSelection.texture.generateMipmaps = false;

		/**
		 * A selection of objects.
		 *
		 * @type {Selection}
		 */

		this.selection = new Selection();

		/**
		 * Indicates whether the selection should be considered inverted.
		 *
		 * @type {Boolean}
		 */

		this.inverted = false;

	}

	/**
	 * Indicates whether the scene background should be ignored.
	 *
	 * @type {Boolean}
	 */

	get ignoreBackground() {

		return !this.backgroundPass.enabled;

	}

	/**
	 * Enables or disables background rendering.
	 *
	 * @type {Boolean}
	 */

	set ignoreBackground(value) {

		this.backgroundPass.enabled = !value;

	}

	/**
	 * Updates this effect.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	 * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	 */

	update(renderer, inputBuffer, deltaTime) {

		const scene = this.scene;
		const camera = this.camera;
		const selection = this.selection;
		const renderTarget = this.renderTargetSelection;

		const background = scene.background;
		const mask = camera.layers.mask;

		this.clearPass.render(renderer, renderTarget);

		if(!this.ignoreBackground) {

			this.backgroundPass.render(renderer, renderTarget);

		}

		scene.background = null;

		if(this.inverted) {

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
		super.update(renderer, renderTarget, deltaTime);

	}

	/**
	 * Updates the size of internal render targets.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 */

	setSize(width, height) {

		super.setSize(width, height);

		this.backgroundPass.setSize(width, height);
		this.blackoutPass.setSize(width, height);
		this.renderPass.setSize(width, height);

		this.renderTargetSelection.setSize(
			this.resolution.width,
			this.resolution.height
		);

	}

	/**
	 * Performs initialization tasks.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {Boolean} alpha - Whether the renderer uses the alpha channel.
	 * @param {Number} frameBufferType - The type of the main frame buffers.
	 */

	initialize(renderer, alpha, frameBufferType) {

		super.initialize(renderer, alpha, frameBufferType);

		this.backgroundPass.initialize(renderer, alpha, frameBufferType);
		this.blackoutPass.initialize(renderer, alpha, frameBufferType);
		this.renderPass.initialize(renderer, alpha, frameBufferType);

		if(!alpha && frameBufferType === UnsignedByteType) {

			this.renderTargetSelection.texture.format = RGBFormat;

		}

		if(frameBufferType !== undefined) {

			this.renderTargetSelection.texture.type = frameBufferType;

		}

	}

}

/**
 * Creates a new canvas from raw image data.
 *
 * @private
 * @param {Number} width - The image width.
 * @param {Number} height - The image height.
 * @param {Uint8ClampedArray} data - The image data.
 * @return {Canvas} The canvas.
 */

function createCanvas(width, height, data) {

	const canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
	const context = canvas.getContext("2d");

	const imageData = context.createImageData(width, height);
	imageData.data.set(data);

	canvas.width = width;
	canvas.height = height;

	context.putImageData(imageData, 0, 0);

	return canvas;

}

/**
 * A container for raw image data.
 */

class RawImageData {

	/**
	 * Constructs a new image data container.
	 *
	 * @param {Number} [width=0] - The width of the image.
	 * @param {Number} [height=0] - The height of the image.
	 * @param {Uint8ClampedArray} [data=null] - The image data.
	 */

	constructor(width = 0, height = 0, data = null) {

		/**
		 * The width of the image.
		 *
		 * @type {Number}
		 */

		this.width = width;

		/**
		 * The height of the image.
		 *
		 * @type {Number}
		 */

		this.height = height;

		/**
		 * The image data.
		 *
		 * @type {Uint8ClampedArray}
		 */

		this.data = data;

	}

	/**
	 * Creates a canvas from this image data.
	 *
	 * @return {Canvas} The canvas or null if it couldn't be created.
	 */

	toCanvas() {

		return (typeof document === "undefined") ? null : createCanvas(
			this.width,
			this.height,
			this.data
		);

	}

	/**
	 * Creates a new image data container.
	 *
	 * @param {Object} data - Raw image data.
	 * @return {RawImageData} The image data.
	 */

	static from(data) {

		return new RawImageData(data.width, data.height, data.data);

	}

}

export { AdaptiveLuminanceMaterial, BlendFunction, BlendMode, BloomEffect, BlurPass, ClearMaskPass, ClearPass, ColorChannel, ColorEdgesMaterial, ConvolutionMaterial, CopyMaterial, DepthComparisonMaterial, DepthDownsamplingMaterial, DepthDownsamplingPass, DepthMaskMaterial, DepthPass, Disposable, DotScreenEffect, EdgeDetectionMaterial, EdgeDetectionMode, Effect, EffectAttribute, EffectComposer, EffectMaterial, EffectPass, GlitchEffect, GlitchMode, Initializable, KernelSize, LambdaPass, LuminanceMaterial, MaskFunction, MaskMaterial, MaskPass, NoiseEffect, NoiseTexture, NormalPass, OutlineEdgesMaterial, OutlineEffect, OutlineMaterial, OverrideMaterialManager, Pass, PixelationEffect, PredicationMode, RawImageData, RenderPass, Resizable, Resizer, SavePass, ScanlineEffect, Section, Selection, SelectiveBloomEffect, ShaderPass };
