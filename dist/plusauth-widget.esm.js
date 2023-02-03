function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
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

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function N$1(e) {
  return new TextEncoder().encode(e);
}
function p$1(e) {
  const t = new Uint8Array(e);
  let r = "";
  for (const n of t)
    r += String.fromCharCode(n);
  return btoa(r).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function w$1(e) {
  const t = e.replace(/-/g, "+").replace(/_/g, "/"), r = (4 - t.length % 4) % 4, i = t.padEnd(t.length + r, "="), n = atob(i), s = new ArrayBuffer(n.length), o = new Uint8Array(s);
  for (let a = 0; a < n.length; a++)
    o[a] = n.charCodeAt(a);
  return s;
}
function b$1() {
  return (window == null ? void 0 : window.PublicKeyCredential) !== void 0 && typeof window.PublicKeyCredential == "function";
}
function S$1(e) {
  const { id: t } = e;
  return {
    ...e,
    id: w$1(t),
    transports: e.transports
  };
}
function C$1(e) {
  return e === "localhost" || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e);
}
class c$1 extends Error {
  constructor(t, r = "WebAuthnError") {
    super(t), this.name = r;
  }
}
function x$1({ error: e, options: t }) {
  var r, i;
  const { publicKey: n } = t;
  if (!n)
    throw Error("options was missing required publicKey property");
  if (e.name === "AbortError") {
    if (t.signal === new AbortController().signal)
      return new c$1("Registration ceremony was sent an abort signal", "AbortError");
  } else if (e.name === "ConstraintError") {
    if (((r = n.authenticatorSelection) === null || r === void 0 ? void 0 : r.requireResidentKey) === !0)
      return new c$1("Discoverable credentials were required but no available authenticator supported it", "ConstraintError");
    if (((i = n.authenticatorSelection) === null || i === void 0 ? void 0 : i.userVerification) === "required")
      return new c$1("User verification was required but no available authenticator supported it", "ConstraintError");
  } else {
    if (e.name === "InvalidStateError")
      return new c$1("The authenticator was previously registered", "InvalidStateError");
    if (e.name === "NotAllowedError")
      return new c$1("User clicked cancel, or the registration ceremony timed out", "NotAllowedError");
    if (e.name === "NotSupportedError")
      return n.pubKeyCredParams.filter((o) => o.type === "public-key").length === 0 ? new c$1('No entry in pubKeyCredParams was of type "public-key"', "NotSupportedError") : new c$1("No available authenticator supported any of the specified pubKeyCredParams algorithms", "NotSupportedError");
    if (e.name === "SecurityError") {
      const s = window.location.hostname;
      if (C$1(s)) {
        if (n.rp.id !== s)
          return new c$1(`The RP ID "${n.rp.id}" is invalid for this domain`, "SecurityError");
      } else
        return new c$1(`${window.location.hostname} is an invalid domain`, "SecurityError");
    } else if (e.name === "TypeError") {
      if (n.user.id.byteLength < 1 || n.user.id.byteLength > 64)
        return new c$1("User ID was not between 1 and 64 characters", "TypeError");
    } else if (e.name === "UnknownError")
      return new c$1("The authenticator was unable to process the specified options, or could not create a new credential", "UnknownError");
  }
  return e;
}
class I$1 {
  createNewAbortSignal() {
    return this.controller && this.controller.abort(), this.controller = new AbortController(), this.controller.signal;
  }
  reset() {
    this.controller = void 0;
  }
}
const f = new I$1();
async function H$1(e) {
  if (!b$1())
    throw new Error("WebAuthn is not supported in this browser");
  const r = { publicKey: {
    ...e,
    challenge: w$1(e.challenge),
    user: {
      ...e.user,
      id: N$1(e.user.id)
    },
    excludeCredentials: e.excludeCredentials.map(S$1)
  } };
  r.signal = f.createNewAbortSignal();
  let i;
  try {
    i = await navigator.credentials.create(r);
  } catch (d) {
    throw x$1({ error: d, options: r });
  } finally {
    f.reset();
  }
  if (!i)
    throw new Error("Registration was not completed");
  const { id: n, rawId: s, response: o, type: a } = i, l = {
    id: n,
    rawId: p$1(s),
    response: {
      attestationObject: p$1(o.attestationObject),
      clientDataJSON: p$1(o.clientDataJSON)
    },
    type: a,
    clientExtensionResults: i.getClientExtensionResults(),
    authenticatorAttachment: i.authenticatorAttachment
  };
  return typeof o.getTransports == "function" && (l.transports = o.getTransports()), l;
}
function D$1(e) {
  return new TextDecoder("utf-8").decode(e);
}
async function K$1() {
  if (navigator.credentials.conditionalMediationSupported)
    return !0;
  const e = window.PublicKeyCredential;
  return e.isConditionalMediationAvailable !== void 0 && e.isConditionalMediationAvailable();
}
function R$1({ error: e, options: t }) {
  var r;
  const { publicKey: i } = t;
  if (!i)
    throw Error("options was missing required publicKey property");
  if (e.name === "AbortError") {
    if (t.signal === new AbortController().signal)
      return new c$1("Authentication ceremony was sent an abort signal", "AbortError");
  } else {
    if (e.name === "NotAllowedError")
      return !((r = i.allowCredentials) === null || r === void 0) && r.length ? new c$1("No available authenticator recognized any of the allowed credentials", "NotAllowedError") : new c$1("User clicked cancel, or the authentication ceremony timed out", "NotAllowedError");
    if (e.name === "SecurityError") {
      const n = window.location.hostname;
      if (C$1(n)) {
        if (i.rpId !== n)
          return new c$1(`The RP ID "${i.rpId}" is invalid for this domain`, "SecurityError");
      } else
        return new c$1(`${window.location.hostname} is an invalid domain`, "SecurityError");
    } else if (e.name === "UnknownError")
      return new c$1("The authenticator was unable to process the specified options, or could not create a new assertion signature", "UnknownError");
  }
  return e;
}
async function L$1(e, t = !1) {
  var r, i;
  if (!b$1())
    throw new Error("WebAuthn is not supported in this browser");
  let n;
  ((r = e.allowCredentials) === null || r === void 0 ? void 0 : r.length) !== 0 && (n = (i = e.allowCredentials) === null || i === void 0 ? void 0 : i.map(S$1));
  const s = {
    ...e,
    challenge: w$1(e.challenge),
    allowCredentials: n
  }, o = {};
  if (t) {
    if (!await K$1())
      throw Error("Browser does not support WebAuthn autofill");
    if (document.querySelectorAll("input[autocomplete*='webauthn']").length < 1)
      throw Error('No <input> with `"webauthn"` in its `autocomplete` attribute was detected');
    o.mediation = "conditional", s.allowCredentials = [];
  }
  o.publicKey = s, o.signal = f.createNewAbortSignal();
  let a;
  try {
    a = await navigator.credentials.get(o);
  } catch (m) {
    throw R$1({ error: m, options: o });
  } finally {
    f.reset();
  }
  if (!a)
    throw new Error("Authentication was not completed");
  const { id: l, rawId: d, response: u, type: h } = a;
  let g;
  return u.userHandle && (g = D$1(u.userHandle)), {
    id: l,
    rawId: p$1(d),
    response: {
      authenticatorData: p$1(u.authenticatorData),
      clientDataJSON: p$1(u.clientDataJSON),
      signature: p$1(u.signature),
      userHandle: g
    },
    type: h,
    clientExtensionResults: a.getClientExtensionResults(),
    authenticatorAttachment: a.authenticatorAttachment
  };
}
function y$1(e, t) {
  return new Promise(function(r, i) {
    fetch(e, t).then((n) => {
      const s = n.headers.get("content-type");
      let o = null;
      n.text().then((a) => {
        if (s && s.indexOf("application/json") > -1 ? o = Object.assign(JSON.parse(a), { _raw: n }) : o = { data: a, _raw: n }, n.ok)
          r(o);
        else {
          if (n.status === 400 && o.error === "xhr_request" && o.location)
            return window.location.replace(o.location), !1;
          i(o);
        }
      });
    }).catch(i);
  });
}
class _$1 {
  constructor(t, r) {
    const i = {};
    ["get", "post", "patch", "delete"].forEach((n) => {
      i[n] = function(...s) {
        const o = Object.assign({
          method: n,
          credentials: "include",
          mode: "cors"
        }, r || {});
        return o.headers = Object.assign({
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest"
        }, o.headers || {}), n !== "get" && (o.body = JSON.stringify(s[1])), typeof s[0] != "string" ? y$1.call(null, t, o) : y$1.call(null, t + s[0], o);
      };
    }), this.http = i;
  }
}
var T$1 = Object.defineProperty, O$1 = Object.defineProperties, U$1 = Object.getOwnPropertyDescriptors, v$1 = Object.getOwnPropertySymbols, j$1 = Object.prototype.hasOwnProperty, W$1 = Object.prototype.propertyIsEnumerable, E$1 = (e, t, r) => t in e ? T$1(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, A$1 = (e, t) => {
  for (var r in t || (t = {}))
    j$1.call(t, r) && E$1(e, r, t[r]);
  if (v$1)
    for (var r of v$1(t))
      W$1.call(t, r) && E$1(e, r, t[r]);
  return e;
}, P$1 = (e, t) => O$1(e, U$1(t));
class $$1 extends _$1 {
  constructor(t) {
    super(t);
  }
  signIn(t, r) {
    return this.http.post("/signin", P$1(A$1({}, t), { strategy: r }));
  }
  signUp(t, r) {
    return this.http.post("/signup", P$1(A$1({}, t), { strategy: r }));
  }
  updateMissingInformation(t) {
    return this.http.post("/account/updateMissingInformation", t);
  }
  requestResetPassword(t) {
    return this.http.post("/account/forgotPassword", {
      email: t
    });
  }
  resetPassword(t, r) {
    return this.http.post(`/account/resetPassword/${r}`, {
      password: t
    });
  }
  acceptConsent() {
    return this.http.post("/signin/consent/confirm");
  }
  rejectConsent() {
    return this.http.get("/signin/consent/reject");
  }
  checkPasswordStrength(t, r = {}) {
    t = t != null ? t : "";
    const i = {};
    let { min: n, max: s, number: o, lowerCase: a, upperCase: l, customChars: d, customRegexp: u } = r;
    return a = Number(a), l = Number(l), o = Number(o), a && !new RegExp(`(?=(.*[a-z])${a > 0 ? `{${a},}` : ""})`).test(t) && (i.lowerCase = !0), l && !new RegExp(
      `(?=(.*[A-Z])${l > 0 ? `{${l},}` : ""})`
    ).test(t) && (i.upperCase = !0), o && !new RegExp(
      `(?=(.*[0-9])${o > 0 ? `{${o},}` : ""})`
    ).test(t) && (i.number = !0), n != null && t.length < n && (i.min = !0), s != null && t.length > s && (i.max = !0), d && !d.split("").some((h) => t.indexOf(h) > -1) && (i.customChars = !0), u && u.value && !new RegExp(u).test(u.value) ? u.message || " " : Object.keys(i).length > 0 ? i : !0;
  }
}
var k$1 = (e, t, r) => new Promise((i, n) => {
  var s = (l) => {
    try {
      a(r.next(l));
    } catch (d) {
      n(d);
    }
  }, o = (l) => {
    try {
      a(r.throw(l));
    } catch (d) {
      n(d);
    }
  }, a = (l) => l.done ? i(l.value) : Promise.resolve(l.value).then(s, o);
  a((r = r.apply(e, t)).next());
});
class q$1 extends _$1 {
  constructor(t) {
    super(t);
  }
  validateCode(t, r) {
    return k$1(this, null, function* () {
      return this.http.post(`/signin/challenge/${r}`, {
        code: t
      });
    });
  }
}
var B$1 = /* @__PURE__ */ ((e) => (e.SMS = "sms", e.EMAIL = "email", e.SMARTCARD = "sc", e.WEBAUTHN = "webauthn", e.FINGER_VEIN = "fv", e.OTP = "otp", e))(B$1 || {});
class M$1 {
  constructor(t) {
    try {
      t === "/" || new URL(t);
    } catch {
      throw new Error('"apiURL" must be a valid URL');
    }
    this.auth = new $$1(t), this.mfa = new q$1(t);
  }
}

var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return target.propertyIsEnumerable(symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

var cjs = deepmerge_1;

function e(e,t){const n=Object.create(null),o=e.split(",");for(let r=0;r<o.length;r++)n[o[r]]=!0;return t?e=>!!n[e.toLowerCase()]:e=>!!n[e]}const t=e("Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt"),n=e("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly");function o(e){return !!e||""===e}function r(e){if(k(e)){const t={};for(let n=0;n<e.length;n++){const o=e[n],s=O(o)?l(o):r(o);if(s)for(const e in s)t[e]=s[e];}return t}return O(e)||L(e)?e:void 0}const s=/;(?![^(]*\))/g,i=/:(.+)/;function l(e){const t={};return e.split(s).forEach((e=>{if(e){const n=e.split(i);n.length>1&&(t[n[0].trim()]=n[1].trim());}})),t}function c(e){let t="";if(O(e))t=e;else if(k(e))for(let n=0;n<e.length;n++){const o=c(e[n]);o&&(t+=o+" ");}else if(L(e))for(const n in e)e[n]&&(t+=n+" ");return t.trim()}function a(e){if(!e)return null;let{class:t,style:n}=e;return t&&!O(t)&&(e.class=c(t)),n&&(e.style=r(n)),e}const p=e=>O(e)?e:null==e?"":k(e)||L(e)&&(e.toString===M||!T(e.toString))?JSON.stringify(e,d,2):String(e),d=(e,t)=>t&&t.__v_isRef?d(e,t.value):E(t)?{[`Map(${t.size})`]:[...t.entries()].reduce(((e,[t,n])=>(e[`${t} =>`]=n,e)),{})}:A(t)?{[`Set(${t.size})`]:[...t.values()]}:!L(t)||k(t)||$(t)?t:String(t),h={},m=[],v=()=>{},g=()=>!1,_=/^on[^a-z]/,y=e=>_.test(e),b=e=>e.startsWith("onUpdate:"),C=Object.assign,x=(e,t)=>{const n=e.indexOf(t);n>-1&&e.splice(n,1);},w=Object.prototype.hasOwnProperty,S=(e,t)=>w.call(e,t),k=Array.isArray,E=e=>"[object Map]"===I(e),A=e=>"[object Set]"===I(e),T=e=>"function"==typeof e,O=e=>"string"==typeof e,P=e=>"symbol"==typeof e,L=e=>null!==e&&"object"==typeof e,R=e=>L(e)&&T(e.then)&&T(e.catch),M=Object.prototype.toString,I=e=>M.call(e),$=e=>"[object Object]"===I(e),B=e=>O(e)&&"NaN"!==e&&"-"!==e[0]&&""+parseInt(e,10)===e,N=e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),V=e=>{const t=Object.create(null);return n=>t[n]||(t[n]=e(n))},j=/-(\w)/g,U=V((e=>e.replace(j,((e,t)=>t?t.toUpperCase():"")))),D=/\B([A-Z])/g,H=V((e=>e.replace(D,"-$1").toLowerCase())),W=V((e=>e.charAt(0).toUpperCase()+e.slice(1))),z=V((e=>e?`on${W(e)}`:"")),K=(e,t)=>!Object.is(e,t),G=(e,t)=>{for(let n=0;n<e.length;n++)e[n](t);},q=(e,t,n)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,value:n});},J=e=>{const t=parseFloat(e);return isNaN(t)?e:t};let Y;let X;class Z{constructor(e=!1){this.active=!0,this.effects=[],this.cleanups=[],!e&&X&&(this.parent=X,this.index=(X.scopes||(X.scopes=[])).push(this)-1);}run(e){if(this.active){const t=X;try{return X=this,e()}finally{X=t;}}}on(){X=this;}off(){X=this.parent;}stop(e){if(this.active){let t,n;for(t=0,n=this.effects.length;t<n;t++)this.effects[t].stop();for(t=0,n=this.cleanups.length;t<n;t++)this.cleanups[t]();if(this.scopes)for(t=0,n=this.scopes.length;t<n;t++)this.scopes[t].stop(!0);if(this.parent&&!e){const e=this.parent.scopes.pop();e&&e!==this&&(this.parent.scopes[this.index]=e,e.index=this.index);}this.active=!1;}}}function ee(e,t=X){t&&t.active&&t.effects.push(e);}const oe=e=>{const t=new Set(e);return t.w=0,t.n=0,t},re=e=>(e.w&ce)>0,se=e=>(e.n&ce)>0,ie=new WeakMap;let le=0,ce=1;let ae;const ue=Symbol(""),fe=Symbol("");class pe{constructor(e,t=null,n){this.fn=e,this.scheduler=t,this.active=!0,this.deps=[],this.parent=void 0,ee(this,n);}run(){if(!this.active)return this.fn();let e=ae,t=ve;for(;e;){if(e===this)return;e=e.parent;}try{return this.parent=ae,ae=this,ve=!0,ce=1<<++le,le<=30?(({deps:e})=>{if(e.length)for(let t=0;t<e.length;t++)e[t].w|=ce;})(this):de(this),this.fn()}finally{le<=30&&(e=>{const{deps:t}=e;if(t.length){let n=0;for(let o=0;o<t.length;o++){const r=t[o];re(r)&&!se(r)?r.delete(e):t[n++]=r,r.w&=~ce,r.n&=~ce;}t.length=n;}})(this),ce=1<<--le,ae=this.parent,ve=t,this.parent=void 0,this.deferStop&&this.stop();}}stop(){ae===this?this.deferStop=!0:this.active&&(de(this),this.onStop&&this.onStop(),this.active=!1);}}function de(e){const{deps:t}=e;if(t.length){for(let n=0;n<t.length;n++)t[n].delete(e);t.length=0;}}let ve=!0;const ge=[];function _e(){ge.push(ve),ve=!1;}function ye(){const e=ge.pop();ve=void 0===e||e;}function be(e,t,n){if(ve&&ae){let t=ie.get(e);t||ie.set(e,t=new Map);let o=t.get(n);o||t.set(n,o=oe()),Ce(o);}}function Ce(e,t){let n=!1;le<=30?se(e)||(e.n|=ce,n=!re(e)):n=!e.has(ae),n&&(e.add(ae),ae.deps.push(e));}function xe(e,t,n,o,r,s){const i=ie.get(e);if(!i)return;let l=[];if("clear"===t)l=[...i.values()];else if("length"===n&&k(e))i.forEach(((e,t)=>{("length"===t||t>=o)&&l.push(e);}));else switch(void 0!==n&&l.push(i.get(n)),t){case"add":k(e)?B(n)&&l.push(i.get("length")):(l.push(i.get(ue)),E(e)&&l.push(i.get(fe)));break;case"delete":k(e)||(l.push(i.get(ue)),E(e)&&l.push(i.get(fe)));break;case"set":E(e)&&l.push(i.get(ue));}if(1===l.length)l[0]&&we(l[0]);else {const e=[];for(const t of l)t&&e.push(...t);we(oe(e));}}function we(e,t){const n=k(e)?e:[...e];for(const o of n)o.computed&&Se(o);for(const o of n)o.computed||Se(o);}function Se(e,t){(e!==ae||e.allowRecurse)&&(e.scheduler?e.scheduler():e.run());}const ke=e("__proto__,__v_isRef,__isVue"),Ee=new Set(Object.getOwnPropertyNames(Symbol).filter((e=>"arguments"!==e&&"caller"!==e)).map((e=>Symbol[e])).filter(P)),Ae=Re(),Fe=Re(!1,!0),Te=Re(!0),Oe=Re(!0,!0),Pe=Le();function Le(){const e={};return ["includes","indexOf","lastIndexOf"].forEach((t=>{e[t]=function(...e){const n=Ct(this);for(let t=0,r=this.length;t<r;t++)be(n,0,t+"");const o=n[t](...e);return -1===o||!1===o?n[t](...e.map(Ct)):o};})),["push","pop","shift","unshift","splice"].forEach((t=>{e[t]=function(...e){_e();const n=Ct(this)[t].apply(this,e);return ye(),n};})),e}function Re(e=!1,t=!1){return function(n,o,r){if("__v_isReactive"===o)return !e;if("__v_isReadonly"===o)return e;if("__v_isShallow"===o)return t;if("__v_raw"===o&&r===(e?t?ut:at:t?ct:lt).get(n))return n;const s=k(n);if(!e&&s&&S(Pe,o))return Reflect.get(Pe,o,r);const i=Reflect.get(n,o,r);return (P(o)?Ee.has(o):ke(o))?i:(e||be(n,0,o),t?i:At(i)?s&&B(o)?i:i.value:L(i)?e?ht(i):pt(i):i)}}function Me(e=!1){return function(t,n,o,r){let s=t[n];if(_t(s)&&At(s)&&!At(o))return !1;if(!e&&(yt(o)||_t(o)||(s=Ct(s),o=Ct(o)),!k(t)&&At(s)&&!At(o)))return s.value=o,!0;const i=k(t)&&B(n)?Number(n)<t.length:S(t,n),l=Reflect.set(t,n,o,r);return t===Ct(r)&&(i?K(o,s)&&xe(t,"set",n,o):xe(t,"add",n,o)),l}}const Ie={get:Ae,set:Me(),deleteProperty:function(e,t){const n=S(e,t),o=Reflect.deleteProperty(e,t);return o&&n&&xe(e,"delete",t,void 0),o},has:function(e,t){const n=Reflect.has(e,t);return P(t)&&Ee.has(t)||be(e,0,t),n},ownKeys:function(e){return be(e,0,k(e)?"length":ue),Reflect.ownKeys(e)}},$e={get:Te,set:(e,t)=>!0,deleteProperty:(e,t)=>!0},Be=C({},Ie,{get:Fe,set:Me(!0)});C({},$e,{get:Oe});const Ve=e=>e,je=e=>Reflect.getPrototypeOf(e);function Ue(e,t,n=!1,o=!1){const r=Ct(e=e.__v_raw),s=Ct(t);n||(t!==s&&be(r,0,t),be(r,0,s));const{has:i}=je(r),l=o?Ve:n?St:wt;return i.call(r,t)?l(e.get(t)):i.call(r,s)?l(e.get(s)):void(e!==r&&e.get(t))}function De(e,t=!1){const n=this.__v_raw,o=Ct(n),r=Ct(e);return t||(e!==r&&be(o,0,e),be(o,0,r)),e===r?n.has(e):n.has(e)||n.has(r)}function He(e,t=!1){return e=e.__v_raw,!t&&be(Ct(e),0,ue),Reflect.get(e,"size",e)}function We(e){e=Ct(e);const t=Ct(this);return je(t).has.call(t,e)||(t.add(e),xe(t,"add",e,e)),this}function ze(e,t){t=Ct(t);const n=Ct(this),{has:o,get:r}=je(n);let s=o.call(n,e);s||(e=Ct(e),s=o.call(n,e));const i=r.call(n,e);return n.set(e,t),s?K(t,i)&&xe(n,"set",e,t):xe(n,"add",e,t),this}function Ke(e){const t=Ct(this),{has:n,get:o}=je(t);let r=n.call(t,e);r||(e=Ct(e),r=n.call(t,e)),o&&o.call(t,e);const s=t.delete(e);return r&&xe(t,"delete",e,void 0),s}function Ge(){const e=Ct(this),t=0!==e.size,n=e.clear();return t&&xe(e,"clear",void 0,void 0),n}function qe(e,t){return function(n,o){const r=this,s=r.__v_raw,i=Ct(s),l=t?Ve:e?St:wt;return !e&&be(i,0,ue),s.forEach(((e,t)=>n.call(o,l(e),l(t),r)))}}function Je(e,t,n){return function(...o){const r=this.__v_raw,s=Ct(r),i=E(s),l="entries"===e||e===Symbol.iterator&&i,c="keys"===e&&i,a=r[e](...o),u=n?Ve:t?St:wt;return !t&&be(s,0,c?fe:ue),{next(){const{value:e,done:t}=a.next();return t?{value:e,done:t}:{value:l?[u(e[0]),u(e[1])]:u(e),done:t}},[Symbol.iterator](){return this}}}}function Ye(e){return function(...t){return "delete"!==e&&this}}function Xe(){const e={get(e){return Ue(this,e)},get size(){return He(this)},has:De,add:We,set:ze,delete:Ke,clear:Ge,forEach:qe(!1,!1)},t={get(e){return Ue(this,e,!1,!0)},get size(){return He(this)},has:De,add:We,set:ze,delete:Ke,clear:Ge,forEach:qe(!1,!0)},n={get(e){return Ue(this,e,!0)},get size(){return He(this,!0)},has(e){return De.call(this,e,!0)},add:Ye("add"),set:Ye("set"),delete:Ye("delete"),clear:Ye("clear"),forEach:qe(!0,!1)},o={get(e){return Ue(this,e,!0,!0)},get size(){return He(this,!0)},has(e){return De.call(this,e,!0)},add:Ye("add"),set:Ye("set"),delete:Ye("delete"),clear:Ye("clear"),forEach:qe(!0,!0)};return ["keys","values","entries",Symbol.iterator].forEach((r=>{e[r]=Je(r,!1,!1),n[r]=Je(r,!0,!1),t[r]=Je(r,!1,!0),o[r]=Je(r,!0,!0);})),[e,n,t,o]}const[Ze,Qe,et,tt]=Xe();function nt(e,t){const n=t?e?tt:et:e?Qe:Ze;return (t,o,r)=>"__v_isReactive"===o?!e:"__v_isReadonly"===o?e:"__v_raw"===o?t:Reflect.get(S(n,o)&&o in t?n:t,o,r)}const ot={get:nt(!1,!1)},rt={get:nt(!1,!0)},st={get:nt(!0,!1)},lt=new WeakMap,ct=new WeakMap,at=new WeakMap,ut=new WeakMap;function ft(e){return e.__v_skip||!Object.isExtensible(e)?0:function(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}((e=>I(e).slice(8,-1))(e))}function pt(e){return _t(e)?e:vt(e,!1,Ie,ot,lt)}function dt(e){return vt(e,!1,Be,rt,ct)}function ht(e){return vt(e,!0,$e,st,at)}function vt(e,t,n,o,r){if(!L(e))return e;if(e.__v_raw&&(!t||!e.__v_isReactive))return e;const s=r.get(e);if(s)return s;const i=ft(e);if(0===i)return e;const l=new Proxy(e,2===i?o:n);return r.set(e,l),l}function gt(e){return _t(e)?gt(e.__v_raw):!(!e||!e.__v_isReactive)}function _t(e){return !(!e||!e.__v_isReadonly)}function yt(e){return !(!e||!e.__v_isShallow)}function bt(e){return gt(e)||_t(e)}function Ct(e){const t=e&&e.__v_raw;return t?Ct(t):e}function xt(e){return q(e,"__v_skip",!0),e}const wt=e=>L(e)?pt(e):e,St=e=>L(e)?ht(e):e;function kt(e){ve&&ae&&Ce((e=Ct(e)).dep||(e.dep=oe()));}function Et(e,t){(e=Ct(e)).dep&&we(e.dep);}function At(e){return !(!e||!0!==e.__v_isRef)}function Ft(e){return Ot(e,!1)}function Tt(e){return Ot(e,!0)}function Ot(e,t){return At(e)?e:new Pt(e,t)}class Pt{constructor(e,t){this.__v_isShallow=t,this.dep=void 0,this.__v_isRef=!0,this._rawValue=t?e:Ct(e),this._value=t?e:wt(e);}get value(){return kt(this),this._value}set value(e){const t=this.__v_isShallow||yt(e)||_t(e);e=t?e:Ct(e),K(e,this._rawValue)&&(this._rawValue=e,this._value=t?e:wt(e),Et(this));}}function Rt(e){return At(e)?e.value:e}const Mt={get:(e,t,n)=>Rt(Reflect.get(e,t,n)),set:(e,t,n,o)=>{const r=e[t];return At(r)&&!At(n)?(r.value=n,!0):Reflect.set(e,t,n,o)}};function It(e){return gt(e)?e:new Proxy(e,Mt)}function Nt(e){const t=k(e)?new Array(e.length):{};for(const n in e)t[n]=jt(e,n);return t}class Vt{constructor(e,t,n){this._object=e,this._key=t,this._defaultValue=n,this.__v_isRef=!0;}get value(){const e=this._object[this._key];return void 0===e?this._defaultValue:e}set value(e){this._object[this._key]=e;}}function jt(e,t,n){const o=e[t];return At(o)?o:new Vt(e,t,n)}var Ut;class Dt{constructor(e,t,n,o){this._setter=t,this.dep=void 0,this.__v_isRef=!0,this[Ut]=!1,this._dirty=!0,this.effect=new pe(e,(()=>{this._dirty||(this._dirty=!0,Et(this));})),this.effect.computed=this,this.effect.active=this._cacheable=!o,this.__v_isReadonly=n;}get value(){const e=Ct(this);return kt(e),!e._dirty&&e._cacheable||(e._dirty=!1,e._value=e.effect.run()),e._value}set value(e){this._setter(e);}}Ut="__v_isReadonly";function Gt(e,t,n,o){let r;try{r=o?e(...o):e();}catch(s){Jt(s,t,n);}return r}function qt(e,t,n,o){if(T(e)){const r=Gt(e,t,n,o);return r&&R(r)&&r.catch((e=>{Jt(e,t,n);})),r}const r=[];for(let s=0;s<e.length;s++)r.push(qt(e[s],t,n,o));return r}function Jt(e,t,n,o=!0){if(t){let o=t.parent;const r=t.proxy,s=n;for(;o;){const t=o.ec;if(t)for(let n=0;n<t.length;n++)if(!1===t[n](e,r,s))return;o=o.parent;}const i=t.appContext.config.errorHandler;if(i)return void Gt(i,null,10,[e,r,s])}!function(e,t,n,o=!0){console.error(e);}(e,0,0,o);}let Yt=!1,Xt=!1;const Zt=[];let Qt=0;const en$1=[];let tn=null,nn=0;const on=Promise.resolve();let rn=null;function sn(e){const t=rn||on;return e?t.then(this?e.bind(this):e):t}function ln(e){Zt.length&&Zt.includes(e,Yt&&e.allowRecurse?Qt+1:Qt)||(null==e.id?Zt.push(e):Zt.splice(function(e){let t=Qt+1,n=Zt.length;for(;t<n;){const o=t+n>>>1;pn(Zt[o])<e?t=o+1:n=o;}return t}(e.id),0,e),cn());}function cn(){Yt||Xt||(Xt=!0,rn=on.then(hn));}function an(e){k(e)?en$1.push(...e):tn&&tn.includes(e,e.allowRecurse?nn+1:nn)||en$1.push(e),cn();}function un(e,t=(Yt?Qt+1:0)){for(;t<Zt.length;t++){const e=Zt[t];e&&e.pre&&(Zt.splice(t,1),t--,e());}}function fn(e){if(en$1.length){const e=[...new Set(en$1)];if(en$1.length=0,tn)return void tn.push(...e);for(tn=e,tn.sort(((e,t)=>pn(e)-pn(t))),nn=0;nn<tn.length;nn++)tn[nn]();tn=null,nn=0;}}const pn=e=>null==e.id?1/0:e.id,dn=(e,t)=>{const n=pn(e)-pn(t);if(0===n){if(e.pre&&!t.pre)return -1;if(t.pre&&!e.pre)return 1}return n};function hn(e){Xt=!1,Yt=!0,Zt.sort(dn);try{for(Qt=0;Qt<Zt.length;Qt++){const e=Zt[Qt];e&&!1!==e.active&&Gt(e,null,14);}}finally{Qt=0,Zt.length=0,fn(),Yt=!1,rn=null,(Zt.length||en$1.length)&&hn();}}function _n(e,t,...n){if(e.isUnmounted)return;const o=e.vnode.props||h;let r=n;const s=t.startsWith("update:"),i=s&&t.slice(7);if(i&&i in o){const e=`${"modelValue"===i?"model":i}Modifiers`,{number:t,trim:s}=o[e]||h;s&&(r=n.map((e=>e.trim()))),t&&(r=n.map(J));}let l,c=o[l=z(t)]||o[l=z(U(t))];!c&&s&&(c=o[l=z(H(t))]),c&&qt(c,e,6,r);const a=o[l+"Once"];if(a){if(e.emitted){if(e.emitted[l])return}else e.emitted={};e.emitted[l]=!0,qt(a,e,6,r);}}function yn(e,t,n=!1){const o=t.emitsCache,r=o.get(e);if(void 0!==r)return r;const s=e.emits;let i={},l=!1;if(!T(e)){const o=e=>{const n=yn(e,t,!0);n&&(l=!0,C(i,n));};!n&&t.mixins.length&&t.mixins.forEach(o),e.extends&&o(e.extends),e.mixins&&e.mixins.forEach(o);}return s||l?(k(s)?s.forEach((e=>i[e]=null)):C(i,s),L(e)&&o.set(e,i),i):(L(e)&&o.set(e,null),null)}function bn(e,t){return !(!e||!y(t))&&(t=t.slice(2).replace(/Once$/,""),S(e,t[0].toLowerCase()+t.slice(1))||S(e,H(t))||S(e,t))}let Cn=null,xn=null;function wn(e){const t=Cn;return Cn=e,xn=e&&e.type.__scopeId||null,t}function An(e,t=Cn,n){if(!t)return e;if(e._n)return e;const o=(...n)=>{o._d&&Kr(-1);const r=wn(t),s=e(...n);return wn(r),o._d&&Kr(1),s};return o._n=!0,o._c=!0,o._d=!0,o}function Fn(e){const{type:t,vnode:n,proxy:o,withProxy:r,props:s,propsOptions:[i],slots:l,attrs:c,emit:a,render:u,renderCache:f,data:p,setupState:d,ctx:h,inheritAttrs:m}=e;let v,g;const _=wn(e);try{if(4&n.shapeFlag){const e=r||o;v=as(u.call(e,e,f,s,d,p,h)),g=c;}else {const e=t;0,v=as(e(s,e.length>1?{attrs:c,slots:l,emit:a}:null)),g=t.props?c:Tn(c);}}catch(C){Ur.length=0,Jt(C,e,1),v=os(Vr);}let y=v;if(g&&!1!==m){const e=Object.keys(g),{shapeFlag:t}=y;e.length&&7&t&&(i&&e.some(b)&&(g=On(g,i)),y=ss(y,g));}return n.dirs&&(y=ss(y),y.dirs=y.dirs?y.dirs.concat(n.dirs):n.dirs),n.transition&&(y.transition=n.transition),v=y,wn(_),v}const Tn=e=>{let t;for(const n in e)("class"===n||"style"===n||y(n))&&((t||(t={}))[n]=e[n]);return t},On=(e,t)=>{const n={};for(const o in e)b(o)&&o.slice(9)in t||(n[o]=e[o]);return n};function Pn(e,t,n){const o=Object.keys(t);if(o.length!==Object.keys(e).length)return !0;for(let r=0;r<o.length;r++){const s=o[r];if(t[s]!==e[s]&&!bn(n,s))return !0}return !1}function Ln({vnode:e,parent:t},n){for(;t&&t.subTree===e;)(e=t.vnode).el=n,t=t.parent;}const Rn=e=>e.__isSuspense;function Nn(e,t){t&&t.pendingBranch?k(e)?t.effects.push(...e):t.effects.push(e):an(e);}function jn(e,t){if(vs){let n=vs.provides;const o=vs.parent&&vs.parent.provides;o===n&&(n=vs.provides=Object.create(o)),n[e]=t;}}function Un(e,t,n=!1){const o=vs||Cn;if(o){const r=null==o.parent?o.vnode.appContext&&o.vnode.appContext.provides:o.parent.provides;if(r&&e in r)return r[e];if(arguments.length>1)return n&&T(t)?t.call(o.proxy):t}}function Dn(e,t){return Gn(e,null,t)}const zn={};function Kn(e,t,n){return Gn(e,t,n)}function Gn(e,t,{immediate:n,deep:o,flush:r}=h){const s=vs;let i,l,c=!1,a=!1;if(At(e)?(i=()=>e.value,c=yt(e)):gt(e)?(i=()=>e,o=!0):k(e)?(a=!0,c=e.some((e=>gt(e)||yt(e))),i=()=>e.map((e=>At(e)?e.value:gt(e)?Yn(e):T(e)?Gt(e,s,2):void 0))):i=T(e)?t?()=>Gt(e,s,2):()=>{if(!s||!s.isUnmounted)return l&&l(),qt(e,s,3,[u])}:v,t&&o){const e=i;i=()=>Yn(e());}let u=e=>{l=m.onStop=()=>{Gt(e,s,4);};},f=a?[]:zn;const p=()=>{if(m.active)if(t){const e=m.run();(o||c||(a?e.some(((e,t)=>K(e,f[t]))):K(e,f)))&&(l&&l(),qt(t,s,3,[e,f===zn?void 0:f,u]),f=e);}else m.run();};let d;p.allowRecurse=!!t,"sync"===r?d=p:"post"===r?d=()=>Er(p,s&&s.suspense):(p.pre=!0,s&&(p.id=s.uid),d=()=>ln(p));const m=new pe(i,d);return t?n?p():f=m.run():"post"===r?Er(m.run.bind(m),s&&s.suspense):m.run(),()=>{m.stop(),s&&s.scope&&x(s.scope.effects,m);}}function qn(e,t,n){const o=this.proxy,r=O(e)?e.includes(".")?Jn(o,e):()=>o[e]:e.bind(o,o);let s;T(t)?s=t:(s=t.handler,n=t);const i=vs;_s(this);const l=Gn(r,s.bind(o),n);return i?_s(i):ys(),l}function Jn(e,t){const n=t.split(".");return ()=>{let t=e;for(let e=0;e<n.length&&t;e++)t=t[n[e]];return t}}function Yn(e,t){if(!L(e)||e.__v_skip)return e;if((t=t||new Set).has(e))return e;if(t.add(e),At(e))Yn(e.value,t);else if(k(e))for(let n=0;n<e.length;n++)Yn(e[n],t);else if(A(e)||E(e))e.forEach((e=>{Yn(e,t);}));else if($(e))for(const n in e)Yn(e[n],t);return e}function Xn(){const e={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return wo((()=>{e.isMounted=!0;})),Eo((()=>{e.isUnmounting=!0;})),e}const Zn=[Function,Array],Qn={name:"BaseTransition",props:{mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:Zn,onEnter:Zn,onAfterEnter:Zn,onEnterCancelled:Zn,onBeforeLeave:Zn,onLeave:Zn,onAfterLeave:Zn,onLeaveCancelled:Zn,onBeforeAppear:Zn,onAppear:Zn,onAfterAppear:Zn,onAppearCancelled:Zn},setup(e,{slots:t}){const n=gs(),o=Xn();let r;return ()=>{const s=t.default&&so(t.default(),!0);if(!s||!s.length)return;let i=s[0];if(s.length>1)for(const e of s)if(e.type!==Vr){i=e;break}const l=Ct(e),{mode:c}=l;if(o.isLeaving)return no(i);const a=oo(i);if(!a)return no(i);const u=to(a,l,o,n);ro(a,u);const f=n.subTree,p=f&&oo(f);let d=!1;const{getTransitionKey:h}=a.type;if(h){const e=h();void 0===r?r=e:e!==r&&(r=e,d=!0);}if(p&&p.type!==Vr&&(!Xr(a,p)||d)){const e=to(p,l,o,n);if(ro(p,e),"out-in"===c)return o.isLeaving=!0,e.afterLeave=()=>{o.isLeaving=!1,n.update();},no(i);"in-out"===c&&a.type!==Vr&&(e.delayLeave=(e,t,n)=>{eo(o,p)[String(p.key)]=p,e._leaveCb=()=>{t(),e._leaveCb=void 0,delete u.delayedLeave;},u.delayedLeave=n;});}return i}}};function eo(e,t){const{leavingVNodes:n}=e;let o=n.get(t.type);return o||(o=Object.create(null),n.set(t.type,o)),o}function to(e,t,n,o){const{appear:r,mode:s,persisted:i=!1,onBeforeEnter:l,onEnter:c,onAfterEnter:a,onEnterCancelled:u,onBeforeLeave:f,onLeave:p,onAfterLeave:d,onLeaveCancelled:h,onBeforeAppear:m,onAppear:v,onAfterAppear:g,onAppearCancelled:_}=t,y=String(e.key),b=eo(n,e),C=(e,t)=>{e&&qt(e,o,9,t);},x=(e,t)=>{const n=t[1];C(e,t),k(e)?e.every((e=>e.length<=1))&&n():e.length<=1&&n();},w={mode:s,persisted:i,beforeEnter(t){let o=l;if(!n.isMounted){if(!r)return;o=m||l;}t._leaveCb&&t._leaveCb(!0);const s=b[y];s&&Xr(e,s)&&s.el._leaveCb&&s.el._leaveCb(),C(o,[t]);},enter(e){let t=c,o=a,s=u;if(!n.isMounted){if(!r)return;t=v||c,o=g||a,s=_||u;}let i=!1;const l=e._enterCb=t=>{i||(i=!0,C(t?s:o,[e]),w.delayedLeave&&w.delayedLeave(),e._enterCb=void 0);};t?x(t,[e,l]):l();},leave(t,o){const r=String(e.key);if(t._enterCb&&t._enterCb(!0),n.isUnmounting)return o();C(f,[t]);let s=!1;const i=t._leaveCb=n=>{s||(s=!0,o(),C(n?h:d,[t]),t._leaveCb=void 0,b[r]===e&&delete b[r]);};b[r]=e,p?x(p,[t,i]):i();},clone:e=>to(e,t,n,o)};return w}function no(e){if(uo(e))return (e=ss(e)).children=null,e}function oo(e){return uo(e)?e.children?e.children[0]:void 0:e}function ro(e,t){6&e.shapeFlag&&e.component?ro(e.component.subTree,t):128&e.shapeFlag?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t;}function so(e,t=!1,n){let o=[],r=0;for(let s=0;s<e.length;s++){let i=e[s];const l=null==n?i.key:String(n)+String(null!=i.key?i.key:s);i.type===Br?(128&i.patchFlag&&r++,o=o.concat(so(i.children,t,l))):(t||i.type!==Vr)&&o.push(null!=l?ss(i,{key:l}):i);}if(r>1)for(let s=0;s<o.length;s++)o[s].patchFlag=-2;return o}function io(e){return T(e)?{setup:e,name:e.name}:e}const lo=e=>!!e.type.__asyncLoader;const uo=e=>e.type.__isKeepAlive;function ho(e,t){vo(e,"a",t);}function mo(e,t){vo(e,"da",t);}function vo(e,t,n=vs){const o=e.__wdc||(e.__wdc=()=>{let t=n;for(;t;){if(t.isDeactivated)return;t=t.parent;}return e()});if(bo(t,o,n),n){let e=n.parent;for(;e&&e.parent;)uo(e.parent.vnode)&&go(o,t,n,e),e=e.parent;}}function go(e,t,n,o){const r=bo(t,e,o,!0);Ao((()=>{x(o[t],r);}),n);}function bo(e,t,n=vs,o=!1){if(n){const r=n[e]||(n[e]=[]),s=t.__weh||(t.__weh=(...o)=>{if(n.isUnmounted)return;_e(),_s(n);const r=qt(t,n,e,o);return ys(),ye(),r});return o?r.unshift(s):r.push(s),s}}const Co=e=>(t,n=vs)=>(!ws||"sp"===e)&&bo(e,((...e)=>t(...e)),n),xo=Co("bm"),wo=Co("m"),So=Co("bu"),ko=Co("u"),Eo=Co("bum"),Ao=Co("um"),Fo=Co("sp"),To=Co("rtg"),Oo=Co("rtc");function Po(e,t=vs){bo("ec",e,t);}function Lo(e,t){const n=Cn;if(null===n)return e;const o=Ts(n)||n.proxy,r=e.dirs||(e.dirs=[]);for(let s=0;s<t.length;s++){let[e,n,i,l=h]=t[s];T(e)&&(e={mounted:e,updated:e}),e.deep&&Yn(n),r.push({dir:e,instance:o,value:n,oldValue:void 0,arg:i,modifiers:l});}return e}function Ro(e,t,n,o){const r=e.dirs,s=t&&t.dirs;for(let i=0;i<r.length;i++){const l=r[i];s&&(l.oldValue=s[i].value);let c=l.dir[o];c&&(_e(),qt(c,n,8,[e.el,l,e,t]),ye());}}function Mo(e,t){return No("components",e,!0,t)||e}const Io=Symbol();function Bo(e){return No("directives",e)}function No(e,t,n=!0,o=!1){const r=Cn||vs;if(r){const n=r.type;if("components"===e){const e=Ps(n,!1);if(e&&(e===t||e===U(t)||e===W(U(t))))return n}const s=Vo(r[e]||n[e],t)||Vo(r.appContext[e],t);return !s&&o?n:s}}function Vo(e,t){return e&&(e[t]||e[U(t)]||e[W(U(t))])}function jo(e,t,n,o){let r;const s=n&&n[o];if(k(e)||O(e)){r=new Array(e.length);for(let n=0,o=e.length;n<o;n++)r[n]=t(e[n],n,void 0,s&&s[n]);}else if("number"==typeof e){r=new Array(e);for(let n=0;n<e;n++)r[n]=t(n+1,n,void 0,s&&s[n]);}else if(L(e))if(e[Symbol.iterator])r=Array.from(e,((e,n)=>t(e,n,void 0,s&&s[n])));else {const n=Object.keys(e);r=new Array(n.length);for(let o=0,i=n.length;o<i;o++){const i=n[o];r[o]=t(e[i],i,o,s&&s[o]);}}else r=[];return n&&(n[o]=r),r}function Uo(e,t){for(let n=0;n<t.length;n++){const o=t[n];if(k(o))for(let t=0;t<o.length;t++)e[o[t].name]=o[t].fn;else o&&(e[o.name]=o.key?(...e)=>{const t=o.fn(...e);return t&&(t.key=o.key),t}:o.fn);}return e}function Do(e,t,n={},o,r){if(Cn.isCE||Cn.parent&&lo(Cn.parent)&&Cn.parent.isCE)return os("slot","default"===t?null:{name:t},o&&o());let s=e[t];s&&s._c&&(s._d=!1),Hr();const i=s&&Ho(s(n)),l=Jr(Br,{key:n.key||i&&i.key||`_${t}`},i||(o?o():[]),i&&1===e._?64:-2);return !r&&l.scopeId&&(l.slotScopeIds=[l.scopeId+"-s"]),s&&s._c&&(s._d=!0),l}function Ho(e){return e.some((e=>!Yr(e)||e.type!==Vr&&!(e.type===Br&&!Ho(e.children))))?e:null}const zo=e=>e?bs(e)?Ts(e)||e.proxy:zo(e.parent):null,Ko=C(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>zo(e.parent),$root:e=>zo(e.root),$emit:e=>e.emit,$options:e=>Qo(e),$forceUpdate:e=>e.f||(e.f=()=>ln(e.update)),$nextTick:e=>e.n||(e.n=sn.bind(e.proxy)),$watch:e=>qn.bind(e)}),Go={get({_:e},t){const{ctx:n,setupState:o,data:r,props:s,accessCache:i,type:l,appContext:c}=e;let a;if("$"!==t[0]){const l=i[t];if(void 0!==l)switch(l){case 1:return o[t];case 2:return r[t];case 4:return n[t];case 3:return s[t]}else {if(o!==h&&S(o,t))return i[t]=1,o[t];if(r!==h&&S(r,t))return i[t]=2,r[t];if((a=e.propsOptions[0])&&S(a,t))return i[t]=3,s[t];if(n!==h&&S(n,t))return i[t]=4,n[t];Jo&&(i[t]=0);}}const u=Ko[t];let f,p;return u?("$attrs"===t&&be(e,0,t),u(e)):(f=l.__cssModules)&&(f=f[t])?f:n!==h&&S(n,t)?(i[t]=4,n[t]):(p=c.config.globalProperties,S(p,t)?p[t]:void 0)},set({_:e},t,n){const{data:o,setupState:r,ctx:s}=e;return r!==h&&S(r,t)?(r[t]=n,!0):o!==h&&S(o,t)?(o[t]=n,!0):!S(e.props,t)&&(("$"!==t[0]||!(t.slice(1)in e))&&(s[t]=n,!0))},has({_:{data:e,setupState:t,accessCache:n,ctx:o,appContext:r,propsOptions:s}},i){let l;return !!n[i]||e!==h&&S(e,i)||t!==h&&S(t,i)||(l=s[0])&&S(l,i)||S(o,i)||S(Ko,i)||S(r.config.globalProperties,i)},defineProperty(e,t,n){return null!=n.get?e._.accessCache[t]=0:S(n,"value")&&this.set(e,t,n.value,null),Reflect.defineProperty(e,t,n)}};C({},Go,{get(e,t){if(t!==Symbol.unscopables)return Go.get(e,t,e)},has:(e,n)=>"_"!==n[0]&&!t(n)});let Jo=!0;function Yo(e){const t=Qo(e),n=e.proxy,o=e.ctx;Jo=!1,t.beforeCreate&&Xo(t.beforeCreate,e,"bc");const{data:r,computed:s,methods:i,watch:l,provide:c,inject:a,created:u,beforeMount:f,mounted:p,beforeUpdate:d,updated:h,activated:m,deactivated:g,beforeUnmount:_,unmounted:y,render:b,renderTracked:C,renderTriggered:x,errorCaptured:w,serverPrefetch:S,expose:E,inheritAttrs:A,components:F,directives:O}=t;if(a&&function(e,t,n=v,o=!1){k(e)&&(e=or(e));for(const r in e){const n=e[r];let s;s=L(n)?"default"in n?Un(n.from||r,n.default,!0):Un(n.from||r):Un(n),At(s)&&o?Object.defineProperty(t,r,{enumerable:!0,configurable:!0,get:()=>s.value,set:e=>s.value=e}):t[r]=s;}}(a,o,null,e.appContext.config.unwrapInjectedRef),i)for(const v in i){const e=i[v];T(e)&&(o[v]=e.bind(n));}if(r){const t=r.call(n,n);L(t)&&(e.data=pt(t));}if(Jo=!0,s)for(const k in s){const e=s[k],t=T(e)?e.bind(n,n):T(e.get)?e.get.bind(n,n):v,r=!T(e)&&T(e.set)?e.set.bind(n):v,i=Rs({get:t,set:r});Object.defineProperty(o,k,{enumerable:!0,configurable:!0,get:()=>i.value,set:e=>i.value=e});}if(l)for(const v in l)Zo(l[v],o,n,v);if(c){const e=T(c)?c.call(n):c;Reflect.ownKeys(e).forEach((t=>{jn(t,e[t]);}));}function P(e,t){k(t)?t.forEach((t=>e(t.bind(n)))):t&&e(t.bind(n));}if(u&&Xo(u,e,"c"),P(xo,f),P(wo,p),P(So,d),P(ko,h),P(ho,m),P(mo,g),P(Po,w),P(Oo,C),P(To,x),P(Eo,_),P(Ao,y),P(Fo,S),k(E))if(E.length){const t=e.exposed||(e.exposed={});E.forEach((e=>{Object.defineProperty(t,e,{get:()=>n[e],set:t=>n[e]=t});}));}else e.exposed||(e.exposed={});b&&e.render===v&&(e.render=b),null!=A&&(e.inheritAttrs=A),F&&(e.components=F),O&&(e.directives=O);}function Xo(e,t,n){qt(k(e)?e.map((e=>e.bind(t.proxy))):e.bind(t.proxy),t,n);}function Zo(e,t,n,o){const r=o.includes(".")?Jn(n,o):()=>n[o];if(O(e)){const n=t[e];T(n)&&Kn(r,n);}else if(T(e))Kn(r,e.bind(n));else if(L(e))if(k(e))e.forEach((e=>Zo(e,t,n,o)));else {const o=T(e.handler)?e.handler.bind(n):t[e.handler];T(o)&&Kn(r,o,e);}}function Qo(e){const t=e.type,{mixins:n,extends:o}=t,{mixins:r,optionsCache:s,config:{optionMergeStrategies:i}}=e.appContext,l=s.get(t);let c;return l?c=l:r.length||n||o?(c={},r.length&&r.forEach((e=>er(c,e,i,!0))),er(c,t,i)):c=t,L(t)&&s.set(t,c),c}function er(e,t,n,o=!1){const{mixins:r,extends:s}=t;s&&er(e,s,n,!0),r&&r.forEach((t=>er(e,t,n,!0)));for(const i in t)if(o&&"expose"===i);else {const o=tr[i]||n&&n[i];e[i]=o?o(e[i],t[i]):t[i];}return e}const tr={data:nr,props:sr,emits:sr,methods:sr,computed:sr,beforeCreate:rr,created:rr,beforeMount:rr,mounted:rr,beforeUpdate:rr,updated:rr,beforeDestroy:rr,beforeUnmount:rr,destroyed:rr,unmounted:rr,activated:rr,deactivated:rr,errorCaptured:rr,serverPrefetch:rr,components:sr,directives:sr,watch:function(e,t){if(!e)return t;if(!t)return e;const n=C(Object.create(null),e);for(const o in t)n[o]=rr(e[o],t[o]);return n},provide:nr,inject:function(e,t){return sr(or(e),or(t))}};function nr(e,t){return t?e?function(){return C(T(e)?e.call(this,this):e,T(t)?t.call(this,this):t)}:t:e}function or(e){if(k(e)){const t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function rr(e,t){return e?[...new Set([].concat(e,t))]:t}function sr(e,t){return e?C(C(Object.create(null),e),t):t}function ir(e,t,n,o){const[r,s]=e.propsOptions;let i,l=!1;if(t)for(let c in t){if(N(c))continue;const a=t[c];let u;r&&S(r,u=U(c))?s&&s.includes(u)?(i||(i={}))[u]=a:n[u]=a:bn(e.emitsOptions,c)||c in o&&a===o[c]||(o[c]=a,l=!0);}if(s){const t=Ct(n),o=i||h;for(let i=0;i<s.length;i++){const l=s[i];n[l]=lr(r,t,l,o[l],e,!S(o,l));}}return l}function lr(e,t,n,o,r,s){const i=e[n];if(null!=i){const e=S(i,"default");if(e&&void 0===o){const e=i.default;if(i.type!==Function&&T(e)){const{propsDefaults:s}=r;n in s?o=s[n]:(_s(r),o=s[n]=e.call(null,t),ys());}else o=e;}i[0]&&(s&&!e?o=!1:!i[1]||""!==o&&o!==H(n)||(o=!0));}return o}function cr(e,t,n=!1){const o=t.propsCache,r=o.get(e);if(r)return r;const s=e.props,i={},l=[];let c=!1;if(!T(e)){const o=e=>{c=!0;const[n,o]=cr(e,t,!0);C(i,n),o&&l.push(...o);};!n&&t.mixins.length&&t.mixins.forEach(o),e.extends&&o(e.extends),e.mixins&&e.mixins.forEach(o);}if(!s&&!c)return L(e)&&o.set(e,m),m;if(k(s))for(let u=0;u<s.length;u++){const e=U(s[u]);ar(e)&&(i[e]=h);}else if(s)for(const u in s){const e=U(u);if(ar(e)){const t=s[u],n=i[e]=k(t)||T(t)?{type:t}:t;if(n){const t=pr(Boolean,n.type),o=pr(String,n.type);n[0]=t>-1,n[1]=o<0||t<o,(t>-1||S(n,"default"))&&l.push(e);}}}const a=[i,l];return L(e)&&o.set(e,a),a}function ar(e){return "$"!==e[0]}function ur(e){const t=e&&e.toString().match(/^\s*function (\w+)/);return t?t[1]:null===e?"null":""}function fr(e,t){return ur(e)===ur(t)}function pr(e,t){return k(t)?t.findIndex((t=>fr(t,e))):T(t)&&fr(t,e)?0:-1}const dr=e=>"_"===e[0]||"$stable"===e,hr=e=>k(e)?e.map(as):[as(e)],mr=(e,t,n)=>{if(t._n)return t;const o=An(((...e)=>hr(t(...e))),n);return o._c=!1,o},vr=(e,t,n)=>{const o=e._ctx;for(const r in e){if(dr(r))continue;const n=e[r];if(T(n))t[r]=mr(0,n,o);else if(null!=n){const e=hr(n);t[r]=()=>e;}}},gr=(e,t)=>{const n=hr(t);e.slots.default=()=>n;};function _r(){return {app:null,config:{isNativeTag:g,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let yr=0;function br(e,t){return function(n,o=null){T(n)||(n=Object.assign({},n)),null==o||L(o)||(o=null);const r=_r(),s=new Set;let i=!1;const l=r.app={_uid:yr++,_component:n,_props:o,_container:null,_context:r,_instance:null,version:Ys,get config(){return r.config},set config(e){},use:(e,...t)=>(s.has(e)||(e&&T(e.install)?(s.add(e),e.install(l,...t)):T(e)&&(s.add(e),e(l,...t))),l),mixin:e=>(r.mixins.includes(e)||r.mixins.push(e),l),component:(e,t)=>t?(r.components[e]=t,l):r.components[e],directive:(e,t)=>t?(r.directives[e]=t,l):r.directives[e],mount(s,c,a){if(!i){const u=os(n,o);return u.appContext=r,c&&t?t(u,s):e(u,s,a),i=!0,l._container=s,s.__vue_app__=l,Ts(u.component)||u.component.proxy}},unmount(){i&&(e(null,l._container),delete l._container.__vue_app__);},provide:(e,t)=>(r.provides[e]=t,l)};return l}}function Cr(e,t,n,o,r=!1){if(k(e))return void e.forEach(((e,s)=>Cr(e,t&&(k(t)?t[s]:t),n,o,r)));if(lo(o)&&!r)return;const s=4&o.shapeFlag?Ts(o.component)||o.component.proxy:o.el,i=r?null:s,{i:l,r:c}=e,a=t&&t.r,u=l.refs===h?l.refs={}:l.refs,f=l.setupState;if(null!=a&&a!==c&&(O(a)?(u[a]=null,S(f,a)&&(f[a]=null)):At(a)&&(a.value=null)),T(c))Gt(c,l,12,[i,u]);else {const t=O(c),o=At(c);if(t||o){const l=()=>{if(e.f){const n=t?u[c]:c.value;r?k(n)&&x(n,s):k(n)?n.includes(s)||n.push(s):t?(u[c]=[s],S(f,c)&&(f[c]=u[c])):(c.value=[s],e.k&&(u[e.k]=c.value));}else t?(u[c]=i,S(f,c)&&(f[c]=i)):o&&(c.value=i,e.k&&(u[e.k]=i));};i?(l.id=-1,Er(l,n)):l();}}}const Er=Nn;function Ar(e){return Tr(e)}function Tr(e,t){(Y||(Y="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{})).__VUE__=!0;const{insert:n,remove:o,patchProp:r,createElement:s,createText:i,createComment:l,setText:c,setElementText:a,parentNode:u,nextSibling:f,setScopeId:p=v,insertStaticContent:d}=e,g=(e,t,n,o=null,r=null,s=null,i=!1,l=null,c=!!t.dynamicChildren)=>{if(e===t)return;e&&!Xr(e,t)&&(o=Q(e),W(e,r,s,!0),e=null),-2===t.patchFlag&&(c=!1,t.dynamicChildren=null);const{type:a,ref:u,shapeFlag:f}=t;switch(a){case Nr:_(e,t,n,o);break;case Vr:y(e,t,n,o);break;case jr:null==e&&b(t,n,o,i);break;case Br:O(e,t,n,o,r,s,i,l,c);break;default:1&f?x(e,t,n,o,r,s,i,l,c):6&f?P(e,t,n,o,r,s,i,l,c):(64&f||128&f)&&a.process(e,t,n,o,r,s,i,l,c,te);}null!=u&&r&&Cr(u,e&&e.ref,s,t||e,!t);},_=(e,t,o,r)=>{if(null==e)n(t.el=i(t.children),o,r);else {const n=t.el=e.el;t.children!==e.children&&c(n,t.children);}},y=(e,t,o,r)=>{null==e?n(t.el=l(t.children||""),o,r):t.el=e.el;},b=(e,t,n,o)=>{[e.el,e.anchor]=d(e.children,t,n,o,e.el,e.anchor);},x=(e,t,n,o,r,s,i,l,c)=>{i=i||"svg"===t.type,null==e?w(t,n,o,r,s,i,l,c):A(e,t,r,s,i,l,c);},w=(e,t,o,i,l,c,u,f)=>{let p,d;const{type:h,props:m,shapeFlag:v,transition:g,dirs:_}=e;if(p=e.el=s(e.type,c,m&&m.is,m),8&v?a(p,e.children):16&v&&E(e.children,p,null,i,l,c&&"foreignObject"!==h,u,f),_&&Ro(e,null,i,"created"),m){for(const t in m)"value"===t||N(t)||r(p,t,null,m[t],c,e.children,i,l,X);"value"in m&&r(p,"value",null,m.value),(d=m.onVnodeBeforeMount)&&ds(d,i,e);}k(p,e,e.scopeId,u,i),_&&Ro(e,null,i,"beforeMount");const y=(!l||l&&!l.pendingBranch)&&g&&!g.persisted;y&&g.beforeEnter(p),n(p,t,o),((d=m&&m.onVnodeMounted)||y||_)&&Er((()=>{d&&ds(d,i,e),y&&g.enter(p),_&&Ro(e,null,i,"mounted");}),l);},k=(e,t,n,o,r)=>{if(n&&p(e,n),o)for(let s=0;s<o.length;s++)p(e,o[s]);if(r){if(t===r.subTree){const t=r.vnode;k(e,t,t.scopeId,t.slotScopeIds,r.parent);}}},E=(e,t,n,o,r,s,i,l,c=0)=>{for(let a=c;a<e.length;a++){const c=e[a]=l?us(e[a]):as(e[a]);g(null,c,t,n,o,r,s,i,l);}},A=(e,t,n,o,s,i,l)=>{const c=t.el=e.el;let{patchFlag:u,dynamicChildren:f,dirs:p}=t;u|=16&e.patchFlag;const d=e.props||h,m=t.props||h;let v;n&&Or(n,!1),(v=m.onVnodeBeforeUpdate)&&ds(v,n,t,e),p&&Ro(t,e,n,"beforeUpdate"),n&&Or(n,!0);const g=s&&"foreignObject"!==t.type;if(f?F(e.dynamicChildren,f,c,n,o,g,i):l||B(e,t,c,null,n,o,g,i,!1),u>0){if(16&u)T(c,t,d,m,n,o,s);else if(2&u&&d.class!==m.class&&r(c,"class",null,m.class,s),4&u&&r(c,"style",d.style,m.style,s),8&u){const i=t.dynamicProps;for(let t=0;t<i.length;t++){const l=i[t],a=d[l],u=m[l];u===a&&"value"!==l||r(c,l,a,u,s,e.children,n,o,X);}}1&u&&e.children!==t.children&&a(c,t.children);}else l||null!=f||T(c,t,d,m,n,o,s);((v=m.onVnodeUpdated)||p)&&Er((()=>{v&&ds(v,n,t,e),p&&Ro(t,e,n,"updated");}),o);},F=(e,t,n,o,r,s,i)=>{for(let l=0;l<t.length;l++){const c=e[l],a=t[l],f=c.el&&(c.type===Br||!Xr(c,a)||70&c.shapeFlag)?u(c.el):n;g(c,a,f,null,o,r,s,i,!0);}},T=(e,t,n,o,s,i,l)=>{if(n!==o){if(n!==h)for(const c in n)N(c)||c in o||r(e,c,n[c],null,l,t.children,s,i,X);for(const c in o){if(N(c))continue;const a=o[c],u=n[c];a!==u&&"value"!==c&&r(e,c,u,a,l,t.children,s,i,X);}"value"in o&&r(e,"value",n.value,o.value);}},O=(e,t,o,r,s,l,c,a,u)=>{const f=t.el=e?e.el:i(""),p=t.anchor=e?e.anchor:i("");let{patchFlag:d,dynamicChildren:h,slotScopeIds:m}=t;m&&(a=a?a.concat(m):m),null==e?(n(f,o,r),n(p,o,r),E(t.children,o,p,s,l,c,a,u)):d>0&&64&d&&h&&e.dynamicChildren?(F(e.dynamicChildren,h,o,s,l,c,a),(null!=t.key||s&&t===s.subTree)&&Pr(e,t,!0)):B(e,t,o,p,s,l,c,a,u);},P=(e,t,n,o,r,s,i,l,c)=>{t.slotScopeIds=l,null==e?512&t.shapeFlag?r.ctx.activate(t,n,o,i,c):L(t,n,o,r,s,i,c):M(e,t,c);},L=(e,t,n,o,r,s,i)=>{const l=e.component=function(e,t,n){const o=e.type,r=(t?t.appContext:e.appContext)||hs,s={uid:ms++,vnode:e,type:o,parent:t,appContext:r,root:null,next:null,subTree:null,effect:null,update:null,scope:new Z(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(r.provides),accessCache:null,renderCache:[],components:null,directives:null,propsOptions:cr(o,r),emitsOptions:yn(o,r),emit:null,emitted:null,propsDefaults:h,inheritAttrs:o.inheritAttrs,ctx:h,data:h,props:h,attrs:h,slots:h,refs:h,setupState:h,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};s.ctx={_:s},s.root=t?t.root:s,s.emit=_n.bind(null,s),e.ce&&e.ce(s);return s}(e,o,r);if(uo(e)&&(l.ctx.renderer=te),function(e,t=!1){ws=t;const{props:n,children:o}=e.vnode,r=bs(e);((function(e,t,n,o=!1){const r={},s={};q(s,Qr,1),e.propsDefaults=Object.create(null),ir(e,t,r,s);for(const i in e.propsOptions[0])i in r||(r[i]=void 0);e.props=n?o?r:dt(r):e.type.props?r:s,e.attrs=s;}))(e,n,r,t),((e,t)=>{if(32&e.vnode.shapeFlag){const n=t._;n?(e.slots=Ct(t),q(t,"_",n)):vr(t,e.slots={});}else e.slots={},t&&gr(e,t);q(e.slots,Qr,1);})(e,o);r?function(e,t){const n=e.type;e.accessCache=Object.create(null),e.proxy=xt(new Proxy(e.ctx,Go));const{setup:o}=n;if(o){const n=e.setupContext=o.length>1?Fs(e):null;_s(e),_e();const r=Gt(o,e,0,[e.props,n]);if(ye(),ys(),R(r)){if(r.then(ys,ys),t)return r.then((n=>{Ss(e,n,t);})).catch((t=>{Jt(t,e,0);}));e.asyncDep=r;}else Ss(e,r,t);}else As(e,t);}(e,t):void 0;ws=!1;}(l),l.asyncDep){if(r&&r.registerDep(l,I),!e.el){const e=l.subTree=os(Vr);y(null,e,t,n);}}else I(l,e,t,n,r,s,i);},M=(e,t,n)=>{const o=t.component=e.component;if(function(e,t,n){const{props:o,children:r,component:s}=e,{props:i,children:l,patchFlag:c}=t,a=s.emitsOptions;if(t.dirs||t.transition)return !0;if(!(n&&c>=0))return !(!r&&!l||l&&l.$stable)||o!==i&&(o?!i||Pn(o,i,a):!!i);if(1024&c)return !0;if(16&c)return o?Pn(o,i,a):!!i;if(8&c){const e=t.dynamicProps;for(let t=0;t<e.length;t++){const n=e[t];if(i[n]!==o[n]&&!bn(a,n))return !0}}return !1}(e,t,n)){if(o.asyncDep&&!o.asyncResolved)return void $(o,t,n);o.next=t,function(e){const t=Zt.indexOf(e);t>Qt&&Zt.splice(t,1);}(o.update),o.update();}else t.el=e.el,o.vnode=t;},I=(e,t,n,o,r,s,i)=>{const l=e.effect=new pe((()=>{if(e.isMounted){let t,{next:n,bu:o,u:l,parent:c,vnode:a}=e,f=n;Or(e,!1),n?(n.el=a.el,$(e,n,i)):n=a,o&&G(o),(t=n.props&&n.props.onVnodeBeforeUpdate)&&ds(t,c,n,a),Or(e,!0);const p=Fn(e),d=e.subTree;e.subTree=p,g(d,p,u(d.el),Q(d),e,r,s),n.el=p.el,null===f&&Ln(e,p.el),l&&Er(l,r),(t=n.props&&n.props.onVnodeUpdated)&&Er((()=>ds(t,c,n,a)),r);}else {let i;const{el:l,props:c}=t,{bm:a,m:u,parent:f}=e,p=lo(t);if(Or(e,!1),a&&G(a),!p&&(i=c&&c.onVnodeBeforeMount)&&ds(i,f,t),Or(e,!0),l&&oe){const n=()=>{e.subTree=Fn(e),oe(l,e.subTree,e,r,null);};p?t.type.__asyncLoader().then((()=>!e.isUnmounted&&n())):n();}else {const i=e.subTree=Fn(e);g(null,i,n,o,e,r,s),t.el=i.el;}if(u&&Er(u,r),!p&&(i=c&&c.onVnodeMounted)){const e=t;Er((()=>ds(i,f,e)),r);}(256&t.shapeFlag||f&&lo(f.vnode)&&256&f.vnode.shapeFlag)&&e.a&&Er(e.a,r),e.isMounted=!0,t=n=o=null;}}),(()=>ln(c)),e.scope),c=e.update=()=>l.run();c.id=e.uid,Or(e,!0),c();},$=(e,t,n)=>{t.component=e;const o=e.vnode.props;e.vnode=t,e.next=null,function(e,t,n,o){const{props:r,attrs:s,vnode:{patchFlag:i}}=e,l=Ct(r),[c]=e.propsOptions;let a=!1;if(!(o||i>0)||16&i){let o;ir(e,t,r,s)&&(a=!0);for(const s in l)t&&(S(t,s)||(o=H(s))!==s&&S(t,o))||(c?!n||void 0===n[s]&&void 0===n[o]||(r[s]=lr(c,l,s,void 0,e,!0)):delete r[s]);if(s!==l)for(const e in s)t&&S(t,e)||(delete s[e],a=!0);}else if(8&i){const n=e.vnode.dynamicProps;for(let o=0;o<n.length;o++){let i=n[o];if(bn(e.emitsOptions,i))continue;const u=t[i];if(c)if(S(s,i))u!==s[i]&&(s[i]=u,a=!0);else {const t=U(i);r[t]=lr(c,l,t,u,e,!1);}else u!==s[i]&&(s[i]=u,a=!0);}}a&&xe(e,"set","$attrs");}(e,t.props,o,n),((e,t,n)=>{const{vnode:o,slots:r}=e;let s=!0,i=h;if(32&o.shapeFlag){const e=t._;e?n&&1===e?s=!1:(C(r,t),n||1!==e||delete r._):(s=!t.$stable,vr(t,r)),i=t;}else t&&(gr(e,t),i={default:1});if(s)for(const l in r)dr(l)||l in i||delete r[l];})(e,t.children,n),_e(),un(),ye();},B=(e,t,n,o,r,s,i,l,c=!1)=>{const u=e&&e.children,f=e?e.shapeFlag:0,p=t.children,{patchFlag:d,shapeFlag:h}=t;if(d>0){if(128&d)return void j(u,p,n,o,r,s,i,l,c);if(256&d)return void V(u,p,n,o,r,s,i,l,c)}8&h?(16&f&&X(u,r,s),p!==u&&a(n,p)):16&f?16&h?j(u,p,n,o,r,s,i,l,c):X(u,r,s,!0):(8&f&&a(n,""),16&h&&E(p,n,o,r,s,i,l,c));},V=(e,t,n,o,r,s,i,l,c)=>{const a=(e=e||m).length,u=(t=t||m).length,f=Math.min(a,u);let p;for(p=0;p<f;p++){const o=t[p]=c?us(t[p]):as(t[p]);g(e[p],o,n,null,r,s,i,l,c);}a>u?X(e,r,s,!0,!1,f):E(t,n,o,r,s,i,l,c,f);},j=(e,t,n,o,r,s,i,l,c)=>{let a=0;const u=t.length;let f=e.length-1,p=u-1;for(;a<=f&&a<=p;){const o=e[a],u=t[a]=c?us(t[a]):as(t[a]);if(!Xr(o,u))break;g(o,u,n,null,r,s,i,l,c),a++;}for(;a<=f&&a<=p;){const o=e[f],a=t[p]=c?us(t[p]):as(t[p]);if(!Xr(o,a))break;g(o,a,n,null,r,s,i,l,c),f--,p--;}if(a>f){if(a<=p){const e=p+1,f=e<u?t[e].el:o;for(;a<=p;)g(null,t[a]=c?us(t[a]):as(t[a]),n,f,r,s,i,l,c),a++;}}else if(a>p)for(;a<=f;)W(e[a],r,s,!0),a++;else {const d=a,h=a,v=new Map;for(a=h;a<=p;a++){const e=t[a]=c?us(t[a]):as(t[a]);null!=e.key&&v.set(e.key,a);}let _,y=0;const b=p-h+1;let C=!1,x=0;const w=new Array(b);for(a=0;a<b;a++)w[a]=0;for(a=d;a<=f;a++){const o=e[a];if(y>=b){W(o,r,s,!0);continue}let u;if(null!=o.key)u=v.get(o.key);else for(_=h;_<=p;_++)if(0===w[_-h]&&Xr(o,t[_])){u=_;break}void 0===u?W(o,r,s,!0):(w[u-h]=a+1,u>=x?x=u:C=!0,g(o,t[u],n,null,r,s,i,l,c),y++);}const S=C?function(e){const t=e.slice(),n=[0];let o,r,s,i,l;const c=e.length;for(o=0;o<c;o++){const c=e[o];if(0!==c){if(r=n[n.length-1],e[r]<c){t[o]=r,n.push(o);continue}for(s=0,i=n.length-1;s<i;)l=s+i>>1,e[n[l]]<c?s=l+1:i=l;c<e[n[s]]&&(s>0&&(t[o]=n[s-1]),n[s]=o);}}s=n.length,i=n[s-1];for(;s-- >0;)n[s]=i,i=t[i];return n}(w):m;for(_=S.length-1,a=b-1;a>=0;a--){const e=h+a,f=t[e],p=e+1<u?t[e+1].el:o;0===w[a]?g(null,f,n,p,r,s,i,l,c):C&&(_<0||a!==S[_]?D(f,n,p,2):_--);}}},D=(e,t,o,r,s=null)=>{const{el:i,type:l,transition:c,children:a,shapeFlag:u}=e;if(6&u)return void D(e.component.subTree,t,o,r);if(128&u)return void e.suspense.move(t,o,r);if(64&u)return void l.move(e,t,o,te);if(l===Br){n(i,t,o);for(let e=0;e<a.length;e++)D(a[e],t,o,r);return void n(e.anchor,t,o)}if(l===jr)return void(({el:e,anchor:t},o,r)=>{let s;for(;e&&e!==t;)s=f(e),n(e,o,r),e=s;n(t,o,r);})(e,t,o);if(2!==r&&1&u&&c)if(0===r)c.beforeEnter(i),n(i,t,o),Er((()=>c.enter(i)),s);else {const{leave:e,delayLeave:r,afterLeave:s}=c,l=()=>n(i,t,o),a=()=>{e(i,(()=>{l(),s&&s();}));};r?r(i,l,a):a();}else n(i,t,o);},W=(e,t,n,o=!1,r=!1)=>{const{type:s,props:i,ref:l,children:c,dynamicChildren:a,shapeFlag:u,patchFlag:f,dirs:p}=e;if(null!=l&&Cr(l,null,n,e,!0),256&u)return void t.ctx.deactivate(e);const d=1&u&&p,h=!lo(e);let m;if(h&&(m=i&&i.onVnodeBeforeUnmount)&&ds(m,t,e),6&u)J(e.component,n,o);else {if(128&u)return void e.suspense.unmount(n,o);d&&Ro(e,null,t,"beforeUnmount"),64&u?e.type.remove(e,t,n,r,te,o):a&&(s!==Br||f>0&&64&f)?X(a,t,n,!1,!0):(s===Br&&384&f||!r&&16&u)&&X(c,t,n),o&&z(e);}(h&&(m=i&&i.onVnodeUnmounted)||d)&&Er((()=>{m&&ds(m,t,e),d&&Ro(e,null,t,"unmounted");}),n);},z=e=>{const{type:t,el:n,anchor:r,transition:s}=e;if(t===Br)return void K(n,r);if(t===jr)return void(({el:e,anchor:t})=>{let n;for(;e&&e!==t;)n=f(e),o(e),e=n;o(t);})(e);const i=()=>{o(n),s&&!s.persisted&&s.afterLeave&&s.afterLeave();};if(1&e.shapeFlag&&s&&!s.persisted){const{leave:t,delayLeave:o}=s,r=()=>t(n,i);o?o(e.el,i,r):r();}else i();},K=(e,t)=>{let n;for(;e!==t;)n=f(e),o(e),e=n;o(t);},J=(e,t,n)=>{const{bum:o,scope:r,update:s,subTree:i,um:l}=e;o&&G(o),r.stop(),s&&(s.active=!1,W(i,e,t,n)),l&&Er(l,t),Er((()=>{e.isUnmounted=!0;}),t),t&&t.pendingBranch&&!t.isUnmounted&&e.asyncDep&&!e.asyncResolved&&e.suspenseId===t.pendingId&&(t.deps--,0===t.deps&&t.resolve());},X=(e,t,n,o=!1,r=!1,s=0)=>{for(let i=s;i<e.length;i++)W(e[i],t,n,o,r);},Q=e=>6&e.shapeFlag?Q(e.component.subTree):128&e.shapeFlag?e.suspense.next():f(e.anchor||e.el),ee=(e,t,n)=>{null==e?t._vnode&&W(t._vnode,null,null,!0):g(t._vnode||null,e,t,null,null,null,n),un(),fn(),t._vnode=e;},te={p:g,um:W,m:D,r:z,mt:L,mc:E,pc:B,pbc:F,n:Q,o:e};let ne,oe;return t&&([ne,oe]=t(te)),{render:ee,hydrate:ne,createApp:br(ee,ne)}}function Or({effect:e,update:t},n){e.allowRecurse=t.allowRecurse=n;}function Pr(e,t,n=!1){const o=e.children,r=t.children;if(k(o)&&k(r))for(let s=0;s<o.length;s++){const e=o[s];let t=r[s];1&t.shapeFlag&&!t.dynamicChildren&&((t.patchFlag<=0||32===t.patchFlag)&&(t=r[s]=us(r[s]),t.el=e.el),n||Pr(e,t));}}const Br=Symbol(void 0),Nr=Symbol(void 0),Vr=Symbol(void 0),jr=Symbol(void 0),Ur=[];let Dr=null;function Hr(e=!1){Ur.push(Dr=e?null:[]);}function Wr(){Ur.pop(),Dr=Ur[Ur.length-1]||null;}let zr=1;function Kr(e){zr+=e;}function Gr(e){return e.dynamicChildren=zr>0?Dr||m:null,Wr(),zr>0&&Dr&&Dr.push(e),e}function qr(e,t,n,o,r,s){return Gr(ns(e,t,n,o,r,s,!0))}function Jr(e,t,n,o,r){return Gr(os(e,t,n,o,r,!0))}function Yr(e){return !!e&&!0===e.__v_isVNode}function Xr(e,t){return e.type===t.type&&e.key===t.key}const Qr="__vInternal",es=({key:e})=>null!=e?e:null,ts=({ref:e,ref_key:t,ref_for:n})=>null!=e?O(e)||At(e)||T(e)?{i:Cn,r:e,k:t,f:!!n}:e:null;function ns(e,t=null,n=null,o=0,r=null,s=(e===Br?0:1),i=!1,l=!1){const c={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&es(t),ref:t&&ts(t),scopeId:xn,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:o,dynamicProps:r,dynamicChildren:null,appContext:null};return l?(fs(c,n),128&s&&e.normalize(c)):n&&(c.shapeFlag|=O(n)?8:16),zr>0&&!i&&Dr&&(c.patchFlag>0||6&s)&&32!==c.patchFlag&&Dr.push(c),c}const os=function(e,t=null,n=null,o=0,s=null,i=!1){e&&e!==Io||(e=Vr);if(Yr(e)){const o=ss(e,t,!0);return n&&fs(o,n),zr>0&&!i&&Dr&&(6&o.shapeFlag?Dr[Dr.indexOf(e)]=o:Dr.push(o)),o.patchFlag|=-2,o}l=e,T(l)&&"__vccOpts"in l&&(e=e.__vccOpts);var l;if(t){t=rs(t);let{class:e,style:n}=t;e&&!O(e)&&(t.class=c(e)),L(n)&&(bt(n)&&!k(n)&&(n=C({},n)),t.style=r(n));}const a=O(e)?1:Rn(e)?128:(e=>e.__isTeleport)(e)?64:L(e)?4:T(e)?2:0;return ns(e,t,n,o,s,a,i,!0)};function rs(e){return e?bt(e)||Qr in e?C({},e):e:null}function ss(e,t,n=!1){const{props:o,ref:r,patchFlag:s,children:i}=e,l=t?ps(o||{},t):o;return {__v_isVNode:!0,__v_skip:!0,type:e.type,props:l,key:l&&es(l),ref:t&&t.ref?n&&r?k(r)?r.concat(ts(t)):[r,ts(t)]:ts(t):r,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:i,target:e.target,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==Br?-1===s?16:16|s:s,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:e.transition,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&ss(e.ssContent),ssFallback:e.ssFallback&&ss(e.ssFallback),el:e.el,anchor:e.anchor}}function is(e=" ",t=0){return os(Nr,null,e,t)}function cs(e="",t=!1){return t?(Hr(),Jr(Vr,null,e)):os(Vr,null,e)}function as(e){return null==e||"boolean"==typeof e?os(Vr):k(e)?os(Br,null,e.slice()):"object"==typeof e?us(e):os(Nr,null,String(e))}function us(e){return null===e.el&&-1!==e.patchFlag||e.memo?e:ss(e)}function fs(e,t){let n=0;const{shapeFlag:o}=e;if(null==t)t=null;else if(k(t))n=16;else if("object"==typeof t){if(65&o){const n=t.default;return void(n&&(n._c&&(n._d=!1),fs(e,n()),n._c&&(n._d=!0)))}{n=32;const o=t._;o||Qr in t?3===o&&Cn&&(1===Cn.slots._?t._=1:(t._=2,e.patchFlag|=1024)):t._ctx=Cn;}}else T(t)?(t={default:t,_ctx:Cn},n=32):(t=String(t),64&o?(n=16,t=[is(t)]):n=8);e.children=t,e.shapeFlag|=n;}function ps(...e){const t={};for(let n=0;n<e.length;n++){const o=e[n];for(const e in o)if("class"===e)t.class!==o.class&&(t.class=c([t.class,o.class]));else if("style"===e)t.style=r([t.style,o.style]);else if(y(e)){const n=t[e],r=o[e];!r||n===r||k(n)&&n.includes(r)||(t[e]=n?[].concat(n,r):r);}else ""!==e&&(t[e]=o[e]);}return t}function ds(e,t,n,o=null){qt(e,t,7,[n,o]);}const hs=_r();let ms=0;let vs=null;const gs=()=>vs||Cn,_s=e=>{vs=e,e.scope.on();},ys=()=>{vs&&vs.scope.off(),vs=null;};function bs(e){return 4&e.vnode.shapeFlag}let Cs,ws=!1;function Ss(e,t,n){T(t)?e.render=t:L(t)&&(e.setupState=It(t)),As(e,n);}function As(e,t,n){const o=e.type;if(!e.render){if(!t&&Cs&&!o.render){const t=o.template||Qo(e).template;if(t){const{isCustomElement:n,compilerOptions:r}=e.appContext.config,{delimiters:s,compilerOptions:i}=o,l=C(C({isCustomElement:n,delimiters:s},r),i);o.render=Cs(t,l);}}e.render=o.render||v;}_s(e),_e(),Yo(e),ye(),ys();}function Fs(e){const t=t=>{e.exposed=t||{};};let n;return {get attrs(){return n||(n=function(e){return new Proxy(e.attrs,{get:(t,n)=>(be(e,0,"$attrs"),t[n])})}(e))},slots:e.slots,emit:e.emit,expose:t}}function Ts(e){if(e.exposed)return e.exposeProxy||(e.exposeProxy=new Proxy(It(xt(e.exposed)),{get:(t,n)=>n in t?t[n]:n in Ko?Ko[n](e):void 0}))}function Ps(e,t=!0){return T(e)?e.displayName||e.name:e.name||t&&e.__name}const Rs=(e,t)=>function(e,t,n=!1){let o,r;const s=T(e);return s?(o=e,r=v):(o=e.get,r=e.set),new Dt(o,r,s||!r,n)}(e,0,ws);function Ws(e,t,n){const o=arguments.length;return 2===o?L(t)&&!k(t)?Yr(t)?os(e,null,[t]):os(e,t):os(e,null,t):(o>3?n=Array.prototype.slice.call(arguments,2):3===o&&Yr(n)&&(n=[n]),os(e,t,n))}const Ys="3.2.40",ei="undefined"!=typeof document?document:null,ti=ei&&ei.createElement("template"),ni={insert:(e,t,n)=>{t.insertBefore(e,n||null);},remove:e=>{const t=e.parentNode;t&&t.removeChild(e);},createElement:(e,t,n,o)=>{const r=t?ei.createElementNS("http://www.w3.org/2000/svg",e):ei.createElement(e,n?{is:n}:void 0);return "select"===e&&o&&null!=o.multiple&&r.setAttribute("multiple",o.multiple),r},createText:e=>ei.createTextNode(e),createComment:e=>ei.createComment(e),setText:(e,t)=>{e.nodeValue=t;},setElementText:(e,t)=>{e.textContent=t;},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>ei.querySelector(e),setScopeId(e,t){e.setAttribute(t,"");},insertStaticContent(e,t,n,o,r,s){const i=n?n.previousSibling:t.lastChild;if(r&&(r===s||r.nextSibling))for(;t.insertBefore(r.cloneNode(!0),n),r!==s&&(r=r.nextSibling););else {ti.innerHTML=o?`<svg>${e}</svg>`:e;const r=ti.content;if(o){const e=r.firstChild;for(;e.firstChild;)r.appendChild(e.firstChild);r.removeChild(e);}t.insertBefore(r,n);}return [i?i.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}};const oi=/\s*!important$/;function ri(e,t,n){if(k(n))n.forEach((n=>ri(e,t,n)));else if(null==n&&(n=""),t.startsWith("--"))e.setProperty(t,n);else {const o=function(e,t){const n=ii[t];if(n)return n;let o=U(t);if("filter"!==o&&o in e)return ii[t]=o;o=W(o);for(let r=0;r<si.length;r++){const n=si[r]+o;if(n in e)return ii[t]=n}return t}(e,t);oi.test(n)?e.setProperty(H(o),n.replace(oi,""),"important"):e[o]=n;}}const si=["Webkit","Moz","ms"],ii={};const li="http://www.w3.org/1999/xlink";const[ci,ai]=(()=>{let e=Date.now,t=!1;if("undefined"!=typeof window){Date.now()>document.createEvent("Event").timeStamp&&(e=performance.now.bind(performance));const n=navigator.userAgent.match(/firefox\/(\d+)/i);t=!!(n&&Number(n[1])<=53);}return [e,t]})();let ui=0;const fi=Promise.resolve(),pi=()=>{ui=0;};function di(e,t,n,o){e.addEventListener(t,n,o);}function hi(e,t,n,o,r=null){const s=e._vei||(e._vei={}),i=s[t];if(o&&i)i.value=o;else {const[n,l]=function(e){let t;if(mi.test(e)){let n;for(t={};n=e.match(mi);)e=e.slice(0,e.length-n[0].length),t[n[0].toLowerCase()]=!0;}return [":"===e[2]?e.slice(3):H(e.slice(2)),t]}(t);if(o){const i=s[t]=function(e,t){const n=e=>{const o=e.timeStamp||ci();(ai||o>=n.attached-1)&&qt(function(e,t){if(k(t)){const n=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0;},t.map((e=>t=>!t._stopped&&e&&e(t)))}return t}(e,n.value),t,5,[e]);};return n.value=e,n.attached=(()=>ui||(fi.then(pi),ui=ci()))(),n}(o,r);di(e,n,i,l);}else i&&(!function(e,t,n,o){e.removeEventListener(t,n,o);}(e,n,i,l),s[t]=void 0);}}const mi=/(?:Once|Passive|Capture)$/;const vi=/^on[a-z]/;const ki=(e,{slots:t})=>Ws(Qn,Oi(e),t);ki.displayName="Transition";const Ei={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String},Ai=ki.props=C({},Qn.props,Ei),Fi=(e,t=[])=>{k(e)?e.forEach((e=>e(...t))):e&&e(...t);},Ti=e=>!!e&&(k(e)?e.some((e=>e.length>1)):e.length>1);function Oi(e){const t={};for(const C in e)C in Ei||(t[C]=e[C]);if(!1===e.css)return t;const{name:n="v",type:o,duration:r,enterFromClass:s=`${n}-enter-from`,enterActiveClass:i=`${n}-enter-active`,enterToClass:l=`${n}-enter-to`,appearFromClass:c=s,appearActiveClass:a=i,appearToClass:u=l,leaveFromClass:f=`${n}-leave-from`,leaveActiveClass:p=`${n}-leave-active`,leaveToClass:d=`${n}-leave-to`}=e,h=function(e){if(null==e)return null;if(L(e))return [Pi(e.enter),Pi(e.leave)];{const t=Pi(e);return [t,t]}}(r),m=h&&h[0],v=h&&h[1],{onBeforeEnter:g,onEnter:_,onEnterCancelled:y,onLeave:b,onLeaveCancelled:x,onBeforeAppear:w=g,onAppear:S=_,onAppearCancelled:k=y}=t,E=(e,t,n)=>{Ri(e,t?u:l),Ri(e,t?a:i),n&&n();},A=(e,t)=>{e._isLeaving=!1,Ri(e,f),Ri(e,d),Ri(e,p),t&&t();},F=e=>(t,n)=>{const r=e?S:_,i=()=>E(t,e,n);Fi(r,[t,i]),Mi((()=>{Ri(t,e?c:s),Li(t,e?u:l),Ti(r)||$i(t,o,m,i);}));};return C(t,{onBeforeEnter(e){Fi(g,[e]),Li(e,s),Li(e,i);},onBeforeAppear(e){Fi(w,[e]),Li(e,c),Li(e,a);},onEnter:F(!1),onAppear:F(!0),onLeave(e,t){e._isLeaving=!0;const n=()=>A(e,t);Li(e,f),ji(),Li(e,p),Mi((()=>{e._isLeaving&&(Ri(e,f),Li(e,d),Ti(b)||$i(e,o,v,n));})),Fi(b,[e,n]);},onEnterCancelled(e){E(e,!1),Fi(y,[e]);},onAppearCancelled(e){E(e,!0),Fi(k,[e]);},onLeaveCancelled(e){A(e),Fi(x,[e]);}})}function Pi(e){return J(e)}function Li(e,t){t.split(/\s+/).forEach((t=>t&&e.classList.add(t))),(e._vtc||(e._vtc=new Set)).add(t);}function Ri(e,t){t.split(/\s+/).forEach((t=>t&&e.classList.remove(t)));const{_vtc:n}=e;n&&(n.delete(t),n.size||(e._vtc=void 0));}function Mi(e){requestAnimationFrame((()=>{requestAnimationFrame(e);}));}let Ii=0;function $i(e,t,n,o){const r=e._endId=++Ii,s=()=>{r===e._endId&&o();};if(n)return setTimeout(s,n);const{type:i,timeout:l,propCount:c}=Bi(e,t);if(!i)return o();const a=i+"end";let u=0;const f=()=>{e.removeEventListener(a,p),s();},p=t=>{t.target===e&&++u>=c&&f();};setTimeout((()=>{u<c&&f();}),l+1),e.addEventListener(a,p);}function Bi(e,t){const n=window.getComputedStyle(e),o=e=>(n[e]||"").split(", "),r=o("transitionDelay"),s=o("transitionDuration"),i=Ni(r,s),l=o("animationDelay"),c=o("animationDuration"),a=Ni(l,c);let u=null,f=0,p=0;"transition"===t?i>0&&(u="transition",f=i,p=s.length):"animation"===t?a>0&&(u="animation",f=a,p=c.length):(f=Math.max(i,a),u=f>0?i>a?"transition":"animation":null,p=u?"transition"===u?s.length:c.length:0);return {type:u,timeout:f,propCount:p,hasTransform:"transition"===u&&/\b(transform|all)(,|$)/.test(n.transitionProperty)}}function Ni(e,t){for(;e.length<t.length;)e=e.concat(e);return Math.max(...t.map(((t,n)=>Vi(t)+Vi(e[n]))))}function Vi(e){return 1e3*Number(e.slice(0,-1).replace(",","."))}function ji(){return document.body.offsetHeight}const Ui=new WeakMap,Di=new WeakMap;({name:"TransitionGroup",props:C({},Ai,{tag:String,moveClass:String}),setup(e,{slots:t}){const n=gs(),o=Xn();let r,s;return ko((()=>{if(!r.length)return;const t=e.moveClass||`${e.name||"v"}-move`;if(!function(e,t,n){const o=e.cloneNode();e._vtc&&e._vtc.forEach((e=>{e.split(/\s+/).forEach((e=>e&&o.classList.remove(e)));}));n.split(/\s+/).forEach((e=>e&&o.classList.add(e))),o.style.display="none";const r=1===t.nodeType?t:t.parentNode;r.appendChild(o);const{hasTransform:s}=Bi(o);return r.removeChild(o),s}(r[0].el,n.vnode.el,t))return;r.forEach(Wi),r.forEach(zi);const o=r.filter(Ki);ji(),o.forEach((e=>{const n=e.el,o=n.style;Li(n,t),o.transform=o.webkitTransform=o.transitionDuration="";const r=n._moveCb=e=>{e&&e.target!==n||e&&!/transform$/.test(e.propertyName)||(n.removeEventListener("transitionend",r),n._moveCb=null,Ri(n,t));};n.addEventListener("transitionend",r);}));})),()=>{const i=Ct(e),l=Oi(i);let c=i.tag||Br;r=s,s=t.default?so(t.default()):[];for(let e=0;e<s.length;e++){const t=s[e];null!=t.key&&ro(t,to(t,l,o,n));}if(r)for(let e=0;e<r.length;e++){const t=r[e];ro(t,to(t,l,o,n)),Ui.set(t,t.el.getBoundingClientRect());}return os(c,null,s)}}});function Wi(e){const t=e.el;t._moveCb&&t._moveCb(),t._enterCb&&t._enterCb();}function zi(e){Di.set(e,e.el.getBoundingClientRect());}function Ki(e){const t=Ui.get(e),n=Di.get(e),o=t.left-n.left,r=t.top-n.top;if(o||r){const t=e.el.style;return t.transform=t.webkitTransform=`translate(${o}px,${r}px)`,t.transitionDuration="0s",e}}const il=["ctrl","shift","alt","meta"],ll={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&0!==e.button,middle:e=>"button"in e&&1!==e.button,right:e=>"button"in e&&2!==e.button,exact:(e,t)=>il.some((n=>e[`${n}Key`]&&!t.includes(n)))},cl=(e,t)=>(n,...o)=>{for(let e=0;e<t.length;e++){const o=ll[t[e]];if(o&&o(n,t))return}return e(n,...o)};const dl=C({patchProp:(e,t,r,s,i=!1,l,c,a,u)=>{"class"===t?function(e,t,n){const o=e._vtc;o&&(t=(t?[t,...o]:[...o]).join(" ")),null==t?e.removeAttribute("class"):n?e.setAttribute("class",t):e.className=t;}(e,s,i):"style"===t?function(e,t,n){const o=e.style,r=O(n);if(n&&!r){for(const e in n)ri(o,e,n[e]);if(t&&!O(t))for(const e in t)null==n[e]&&ri(o,e,"");}else {const s=o.display;r?t!==n&&(o.cssText=n):t&&e.removeAttribute("style"),"_vod"in e&&(o.display=s);}}(e,r,s):y(t)?b(t)||hi(e,t,0,s,c):("."===t[0]?(t=t.slice(1),1):"^"===t[0]?(t=t.slice(1),0):function(e,t,n,o){if(o)return "innerHTML"===t||"textContent"===t||!!(t in e&&vi.test(t)&&T(n));if("spellcheck"===t||"draggable"===t||"translate"===t)return !1;if("form"===t)return !1;if("list"===t&&"INPUT"===e.tagName)return !1;if("type"===t&&"TEXTAREA"===e.tagName)return !1;if(vi.test(t)&&O(n))return !1;return t in e}(e,t,s,i))?function(e,t,n,r,s,i,l){if("innerHTML"===t||"textContent"===t)return r&&l(r,s,i),void(e[t]=null==n?"":n);if("value"===t&&"PROGRESS"!==e.tagName&&!e.tagName.includes("-")){e._value=n;const o=null==n?"":n;return e.value===o&&"OPTION"!==e.tagName||(e.value=o),void(null==n&&e.removeAttribute(t))}let c=!1;if(""===n||null==n){const r=typeof e[t];"boolean"===r?n=o(n):null==n&&"string"===r?(n="",c=!0):"number"===r&&(n=0,c=!0);}try{e[t]=n;}catch(a){}c&&e.removeAttribute(t);}(e,t,s,l,c,a,u):("true-value"===t?e._trueValue=s:"false-value"===t&&(e._falseValue=s),function(e,t,r,s,i){if(s&&t.startsWith("xlink:"))null==r?e.removeAttributeNS(li,t.slice(6,t.length)):e.setAttributeNS(li,t,r);else {const s=n(t);null==r||s&&!o(r)?e.removeAttribute(t):e.setAttribute(t,s?"":r);}}(e,t,s,i));}},ni);let hl;function vl(){return hl||(hl=Ar(dl))}const bl=(...e)=>{const t=vl().createApp(...e),{mount:n}=t;return t.mount=e=>{const o=xl(e);if(!o)return;const r=t._component;T(r)||r.render||r.template||(r.template=o.innerHTML),o.innerHTML="";const s=n(o,!1,o instanceof SVGElement);return o instanceof Element&&(o.removeAttribute("v-cloak"),o.setAttribute("data-v-app","")),s},t};function xl(e){if(O(e)){return document.querySelector(e)}return e}

/* eslint-disable max-len */
var en = {
  common: {
    allow: 'Allow',
    fields: {
      code: 'Code',
      email: 'Email',
      newPassword: 'New Password',
      password: 'Password',
      phone_number: 'Phone number',
      rePassword: 'Password confirmation',
      username: 'Username'
    },
    field: 'Field',
    hide: 'Hide',
    reject: 'Reject',
    show: 'Show',
    verify: 'Verify',
    submit: 'Submit'
  },
  verifyEmail: {
    checkText: "We\'ve sent an email to <strong>{email}</strong>, please click the link included" + ' to verify your email address.',
    resendText: 'Didn\'t receive email?',
    resendAction: 'Resend',
    title: 'Check Your Email'
  },
  consent: {
    allow: 'Allow',
    reject: 'Reject',
    title: '{clientName} asks for your consent for the followings'
  },
  errors: {
    fv: {
      'enrollRequired': 'You must enroll at least one finger',
      '9999': 'Invalid request',
      '0x100010e': 'Capture timeout',
      '0x1000118': 'Capture cancelled',
      '0x3001001': 'Device initialization failed',
      '0x3001002': 'Invalid licence',
      '0x3001003': 'Invalid parameters',
      '0x3001004': 'Template count should be more than zero',
      '0x3001005': 'Encryption error',
      '0x3001006': 'Internal error',
      '0x3000006': 'Finger placement is not correct',
      '0x300000e': 'Finger not matched',
      '0x2000011': 'Device disconnected',
      '0x02000011': 'Device disconnected',
      '0x02000021': 'Device disconnected',
      '0x03000001': 'Scanner device not found',
      '0x03000002': 'Invalid BIR format',
      '0x03000003': 'Base64 encode failed',
      '0x03000004': 'Invalid BIR out parameter',
      '0x03000005': 'Verification capture was not close enough to match',
      '0x03000006': 'Finger capture consistency check failed',
      '0x03000007': 'Too many retries',
      '0x03000008': 'Scanner error invalid parameter',
      '0x03000009': 'General scanner error',
      '0x0300000A': 'Scanner error match failed',
      '0x0300000B': 'No template to verify against',
      '0x0300000C': 'No device detected',
      '0x0300000D': 'Could not allocate enough memory internally',
      '0x0300000E': 'Finger verification does not match',
      '0x0300000F': 'Finger identification no match found',
      '0x03000010': 'Finger identification multiple matches'
    },
    webauthn: {
      not_supported: 'Looks like your browser is not supporting WebAuthN API. Try upgrading your browser or use a supported one.',
      operation_failed: 'Operation failed with error:'
    },
    already_exists: 'User already exists',
    code_already_used: 'Code was already used',
    code_expired: 'Code has expired',
    email_not_verified: 'Email is not verified. Please verify your email by clicking the link that has been sent to your email account.',
    field_required: '{0} is required.',
    incorrect_code: 'Verification code is invalid',
    invalid_code: 'Code is invalid',
    invalid_entity: 'Invalid {field}',
    invalid_credentials: 'Invalid login credentials. Please try again.',
    invalid_password: 'Invalid password provided.',
    passwords_not_match: "Passwords doesn't match",
    user_not_found: 'User not found',
    weak_password: 'Password is too weak',
    too_many_requests: 'You have ben trying too fast. Try again in {retry} seconds.',
    account_blocked: 'Your account is blocked. Please check your email for further instructions.'
  },
  fillMissing: {
    title: 'Fill missing information',
    subtitle: 'Please fill in additional information required to proceed application.'
  },
  forgotPassword: {
    'emailSent': 'If there is an account with <strong>{email}</strong> you will receive an' + ' email' + ' containing a link to reset your password.',
    subtitle: 'Please enter your email address to request a password reset',
    title: 'Reset your password'
  },
  login: {
    forgotPassword: 'Forgot Password',
    noAccount: "Don't have an account?",
    title: 'Sign In',
    signIn: 'Sign In',
    signInWith: 'or Sign in with',
    signUp: 'Sign Up'
  },
  mfa: {
    challenge: {
      email: 'Email',
      fv: 'Finger Vein',
      webauthn: 'Security Key or Device',
      sc: 'SmartCard/E-Signature',
      otp: 'Authenticator Application',
      sms: 'SMS',
      title: 'Select one of following methods'
    },
    email: {
      title: 'Enter authorization code sent to: <strong>{email}</strong>'
    },
    fv: {
      enrollmentInProgress: 'Enrollment in progress',
      verifyInProgress: 'Verification in progress',
      saving: 'Saving enrollments',
      checkingDevice: 'Checking device connectivity',
      checkDevice: 'Make sure your device is connected and necessary software is installed. Refresh this page when device is ready.',
      enroll: 'Select a finger to enroll. You can enroll multiple fingers.',
      verify: 'Click to <strong>VERIFY</strong> when you are ready to scan your finger.'
    },
    otp: {
      title: 'Enter authorization code:'
    },
    sms: {
      title: 'Enter authorization code sent to: <strong>{phone_number}</strong>'
    },
    webauthn: {
      verifying: 'Verifying your credentials...'
    },
    tryAnotherWay: 'Try another way'
  },
  passwordPolicy: {
    customChars: 'At least one of {0}',
    customRegexp: '',
    lowerCase: 'At least {0} lowercase character',
    max: 'Maximum {0} character',
    min: 'Minimum {0} character',
    number: 'At least {0} number',
    upperCase: 'At least {0} uppercase character'
  },
  register: {
    haveAccount: 'Have an account?',
    title: 'Sign Up',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signUpWith: 'or Sign Up with'
  },
  resetPassword: {
    successfullyReset: 'Your password has been successfully reset.',
    title: 'Reset Password'
  }
};

var defaultDictionary = {
  en
};

function isCssColor(color) {
  return !!color && !!color.match(/^(#|var\(--|(rgb|hsl)a?\()/);
}

const Colorable = {
  name: 'Colorable',
  props: {
    color: String,
    textColor: {
      type: String,
      required: false,
      default: '#fff'
    }
  },
  methods: {
    setBackgroundColor(color) {
      let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (typeof data.style === 'string') {
        // istanbul ignore next
        console.error('style must be an object', this); // istanbul ignore next

        return data;
      }

      if (typeof data.class === 'string') {
        // istanbul ignore next
        console.error('class must be an object', this); // istanbul ignore next

        return data;
      }

      if (isCssColor(color)) {
        data.style = _objectSpread2(_objectSpread2({}, data.style), {}, {
          'background-color': `${color}`,
          'border-color': `${color}`
        });
      } else if (color) {
        data.class = _objectSpread2(_objectSpread2({}, data.class), {}, {
          [`pa__${color}`]: true
        });
      }

      return data;
    },

    setTextColor(color) {
      let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (typeof data.style === 'string') {
        // istanbul ignore next
        console.error('style must be an object', this); // istanbul ignore next

        return data;
      }

      if (typeof data.class === 'string') {
        // istanbul ignore next
        console.error('class must be an object', this); // istanbul ignore next

        return data;
      }

      if (isCssColor(color)) {
        data.style = _objectSpread2(_objectSpread2({}, data.style), {}, {
          color: `${color}`,
          'caret-color': `${color}`
        });
      } else if (color) {
        const [colorName, colorModifier] = color.toString().trim().split(' ', 2);
        data.class = _objectSpread2(_objectSpread2({}, data.class), {}, {
          [`pa__${colorName}--text`]: true
        });

        if (colorModifier) {
          data.class[`pa__text--${colorModifier}`] = true;
        }
      }

      return data;
    }

  }
};

const Themeable = {
  inject: ['theme']
};

function convertToUnit(str) {
  let unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'px';

  if (str == null || str === '') {
    return undefined;
  } else if (isNaN(+str)) {
    return String(str);
  } else {
    return `${Number(str)}${unit}`;
  }
}
function propertyAccessor(object, keys, array) {
  if (!object) {
    return undefined;
  }

  array = array || (keys === null || keys === void 0 ? void 0 : keys.toString().split('.'));

  if (array.length > 1) {
    return propertyAccessor(object[array.shift()], null, array);
  } else {
    return object[array];
  }
} // eslint-disable-next-line @typescript-eslint/ban-types

const toString = Object.prototype.toString;
const OBJECT_STRING = '[object Object]';
function isPlainObject(obj) {
  return toString.call(obj) === OBJECT_STRING;
}
function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}
function parseArgs() {
  let locale = null;
  let params = null;

  if (arguments.length === 1) {
    if (isObject(arguments.length <= 0 ? undefined : arguments[0]) || Array.isArray(arguments.length <= 0 ? undefined : arguments[0])) {
      params = arguments.length <= 0 ? undefined : arguments[0];
    } else if (typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'string') {
      locale = arguments.length <= 0 ? undefined : arguments[0];
    }
  } else if (arguments.length === 2) {
    if (typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'string') {
      locale = arguments.length <= 0 ? undefined : arguments[0];
    }
    /* istanbul ignore if */


    if (isObject(arguments.length <= 1 ? undefined : arguments[1]) || Array.isArray(arguments.length <= 1 ? undefined : arguments[1])) {
      params = arguments.length <= 1 ? undefined : arguments[1];
    }
  }

  return {
    locale,
    params
  };
}
function resolveClientLogo(client) {
  return (client === null || client === void 0 ? void 0 : client.logoUri) || 'https://api.plusauth.com/assets/images/logo.png';
}
function keysToDotNotation(obj, current, final) {
  if (!final) {
    final = {};
  }

  for (const key in obj) {
    const value = obj[key];
    const newKey = current ? `${current}.${key}` : key; // joined key with dot

    if (value && typeof value === 'object') {
      keysToDotNotation(value, newKey, final); // it's a nested object, so do it again
    } else {
      final[newKey] = value; // it's not an object, so set the property
    }
  }

  return final;
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function isEmail(value) {
  return /^[\w.!#$%&’*+/=?^_`{|}~-]+@[\w-]+(?:\.[\w-]+)*$/.test(value);
}
function isPhone(value) {
  return /^(\+)?([ 0-9]){10,16}$/.test(value);
}

const translatorKey = Symbol('t');
class Translator {
  constructor(dictionary, fallbackLocale, selectedLocale) {
    _defineProperty(this, "fallBackLocale", void 0);

    _defineProperty(this, "dictionary", void 0);

    _defineProperty(this, "selectedLocale", void 0);

    this.dictionary = dictionary;
    this.fallBackLocale = fallbackLocale || 'en';
    this.selectedLocale = Ft(selectedLocale || this.fallBackLocale);
  }

  set locale(locale) {
    this.selectedLocale.value = locale;
  }

  get locale() {
    return this.selectedLocale.value;
  }

  t(key) {
    for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }

    const parsedArgs = parseArgs(values);
    const locale = parsedArgs.locale || this.locale;
    return this._interpolate(propertyAccessor(this.dictionary[locale], key) || propertyAccessor(this.dictionary[this.fallBackLocale], key) || key, parsedArgs.params, locale);
  }

  _interpolate(str, args, locale) {
    if (!str) {
      return str;
    }

    if (Array.isArray(args)) {
      args.forEach(arg => {
        if (isObject(arg)) {
          const normalizedArg = keysToDotNotation(arg);
          Object.keys(normalizedArg).forEach(key => {
            const searchRegexp = new RegExp(`\\{\\s*${escapeRegExp(key)}\\s*\\}`, 'gm');
            const v = normalizedArg[key];
            str = str.replace(searchRegexp, v === null || v === undefined ? '' : propertyAccessor(this.dictionary[locale], v) || propertyAccessor(this.dictionary[this.fallBackLocale], v) || v);
          });
        }
      });
    }

    return str;
  }

}

const Translatable = {
  inject: {
    $i18n: {
      from: translatorKey
    }
  }
};

const Validatable = {
  inject: ['form'],
  props: {
    disabled: Boolean,
    error: Boolean,
    errorCount: {
      type: [Number, String],
      default: 1
    },
    errorMessages: {
      type: [String, Array],
      default: () => []
    },
    messages: {
      type: [String, Array],
      default: () => []
    },
    readonly: Boolean,
    validateOnInit: Boolean,
    rules: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      errorBucket: [],
      hasColor: false,
      hasFocused: false,
      hasInput: false,
      isFocused: false,
      isResetting: false,
      lazyValue: null,
      valid: false
    };
  },

  computed: {
    computedColor() {
      if (this.disabled) return undefined;
      if (this.color) return this.color;else return 'primary';
    },

    hasError() {
      return this.internalErrorMessages.length > 0 || this.errorBucket.length > 0 || this.error;
    },

    externalError() {
      return this.internalErrorMessages.length > 0 || this.error;
    },

    hasMessages() {
      return this.validationTarget.length > 0;
    },

    hasState() {
      if (this.disabled) return false;
      return this.shouldValidate && this.hasError;
    },

    internalErrorMessages() {
      return this.genInternalMessages(this.errorMessages);
    },

    internalMessages() {
      return this.genInternalMessages(this.messages);
    },

    internalValue: {
      get() {
        // @ts-ignore
        return this.lazyValue;
      },

      set(val) {
        // @ts-ignore
        this.lazyValue = val; // @ts-ignore

        this.$emit('input', val);
      }

    },

    shouldValidate() {
      if (this.externalError) return true;
      if (this.isResetting) return false;
      return this.hasInput || this.hasFocused;
    },

    validations() {
      return this.validationTarget.slice(0, Number(this.errorCount));
    },

    validationState() {
      if (this.disabled) return undefined;
      if (this.hasError && this.shouldValidate) return 'error';
      if (this.hasColor) return this.computedColor;
      return undefined;
    },

    validationTarget() {
      if (this.internalErrorMessages.length > 0) {
        return this.internalErrorMessages;
      } else if (this.messages.length > 0) {
        return this.internalMessages;
      } else if (this.shouldValidate || this.validateOnInit) {
        return this.errorBucket;
      } else return [];
    }

  },
  watch: {
    rules: {
      handler() {
        this.validate();
      },

      deep: true
    },

    internalValue() {
      // If it's the first time we're setting input,
      // mark it with hasInput
      this.hasInput = true;
      this.$nextTick(this.validate);
    },

    isFocused(val) {
      // Should not check validation
      // if disabled
      if (!val && !this.disabled) {
        this.hasFocused = true;
        this.$nextTick(this.validate);
      }
    },

    isResetting() {
      setTimeout(() => {
        this.hasInput = false;
        this.hasFocused = false;
        this.isResetting = false;
        this.validate();
      }, 0);
    },

    hasError(val) {
      if (this.shouldValidate) {
        this.$emit('update:error', val);
      }
    },

    value(val) {
      this.lazyValue = val;
    }

  },

  beforeMount() {
    this.lazyValue = this.modelValue;
    this.validate();
  },

  created() {
    var _this$form;

    (_this$form = this.form) === null || _this$form === void 0 ? void 0 : _this$form.register(this);
  },

  beforeUnmount() {
    var _this$form2;

    (_this$form2 = this.form) === null || _this$form2 === void 0 ? void 0 : _this$form2.unregister(this);
  },

  methods: {
    genInternalMessages(messages) {
      if (!messages) return [];else if (Array.isArray(messages)) return messages;else return [messages];
    },

    reset() {
      this.isResetting = true;
      this.internalValue = Array.isArray(this.internalValue) ? [] : undefined;
    },

    resetValidation() {
      this.isResetting = true;
    },

    async validate() {
      let force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      let value = arguments.length > 1 ? arguments[1] : undefined;
      const errorBucket = [];
      value = value || this.internalValue;
      if (force) this.hasInput = this.hasFocused = true;

      for (let index = 0; index < this.rules.length; index++) {
        const rule = this.rules[index];
        let valid = typeof rule === 'function' ? rule(value) : rule;

        if (Boolean(valid && typeof valid.then === 'function')) {
          valid = await valid;
        }

        if (typeof valid === 'string' || valid !== true && valid !== undefined) {
          errorBucket.push(valid || '');
        }
      }

      this.errorBucket = errorBucket;
      this.valid = errorBucket.length === 0;
      return this.valid;
    }

  }
};

var PIcon = io({
  name: 'PIcon',
  mixins: [Colorable],
  props: _objectSpread2(_objectSpread2({}, Colorable.props), {}, {
    color: {
      type: String,
      default: '#000'
    }
  }),

  render() {
    const textContent = this.$slots.default ? this.$slots.default()[0].children : '';
    return Ws('i', this.setTextColor(this.color, {
      class: {
        'pa__icon': true,
        [(textContent || '').toString()]: true
      }
    }));
  }

});

var PAlert = io({
  name: 'PAlert',
  mixins: [Colorable, Themeable],
  props: _objectSpread2(_objectSpread2({}, Colorable.props), {}, {
    modelValue: {
      type: Boolean,
      default: true
    },
    dismissible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'error'
    },
    text: {
      type: Boolean,
      default: false
    },
    tile: {
      type: Boolean,
      default: false
    },
    timeout: {
      type: Number,
      default: 0
    }
  }),
  emits: ['update:modelValue'],

  setup(props, ctx) {
    let closeTimeout;
    Dn(() => {
      if (props.modelValue && props.timeout) {
        const timeoutVal = Number(props.timeout);

        if (closeTimeout) {
          clearTimeout(closeTimeout);
        }

        closeTimeout = setTimeout(() => {
          ctx.emit('update:modelValue', false);
        }, timeoutVal);
      }
    });
  },

  render() {
    return Ws(ki, {
      name: 'pa__message-transition',
      css: true
    }, {
      default: () => this.modelValue && Ws('div', this.setBackgroundColor(this.type, this.setTextColor(this.text ? this.type : this.textColor, {
        class: {
          'pa__alert': true,
          'pa__alert--text': this.text,
          'pa__alert--tile': this.tile
        }
      })), Ws('div', {
        class: 'pa__alert-content'
      }, [this.$slots.default ? this.$slots.default() : null, this.dismissible && Ws(PIcon, {
        onClick: () => {
          this.$emit('update:modelValue', false);
        },
        class: 'pa__alert-dismiss-icon',
        color: this.text ? this.type : this.textColor
      }, 'pa__close')]))
    });
  }

});

function makeParams(locale, args) {
  const params = [];
  locale && params.push(locale);

  if (args && (Array.isArray(args) || isPlainObject(args))) {
    params.push(args);
  }

  return params;
}

function parseValue(value) {
  let path;
  let locale = undefined;
  let args = undefined;

  if (typeof value === 'string' || !value) {
    path = value;
  } else if (isPlainObject(value)) {
    path = value.path;
    locale = value.locale;
    args = value.args;
  } else {
    throw new Error('unsupported value');
  }

  return {
    path,
    locale,
    args
  };
}

function translate(el, binding) {
  var _binding$instance;

  const value = binding.value;
  const {
    path,
    locale,
    args
  } = parseValue(value);

  if (!path && !locale && !args) {
    console.warn('value type not supported');
    return;
  }

  if (!path) {
    console.warn('`path` is required in v-t directive');
    return;
  }

  const $i18n = binding === null || binding === void 0 ? void 0 : (_binding$instance = binding.instance) === null || _binding$instance === void 0 ? void 0 : _binding$instance.$.appContext.config.globalProperties.$i18n;
  el._vt = el.innerHTML = $i18n === null || $i18n === void 0 ? void 0 : $i18n.t(path, ...makeParams(locale, args));
  el._locale = $i18n === null || $i18n === void 0 ? void 0 : $i18n.locale;
}

const i18n = {
  beforeMount: (el, binding) => {
    translate(el, binding);
  },
  beforeUpdate: (el, binding) => {
    translate(el, binding);
  },
  unmounted: el => {
    el._vt = undefined;
    delete el['_vt'];
    el._locale = undefined;
    delete el['_locale'];
  }
};

function generateMessageVNode(message, name) {
  if (message && typeof message === 'object') {
    return Lo(Ws('div', {
      class: 'pa__messages__message'
    }), [[i18n, {
      args: _objectSpread2(_objectSpread2({}, message.args), {}, {
        field: name && `common.fields.${name}`
      }),
      path: message.path
    }]]);
  }

  return Lo(Ws('div', {
    class: 'pa__messages__message'
  }), [[i18n, {
    args: {
      field: name && `common.fields.${name}`
    },
    path: message
  }]]);
}

function generateMessages(messages, name) {
  if (!messages) {
    return undefined;
  }

  if (Array.isArray(messages)) {
    return messages.map(message => generateMessageVNode(message, name));
  } else if (messages instanceof Set) {
    const nodes = [];

    for (const value of messages.values()) {
      nodes.push(generateMessageVNode(value, name));
    }

    return nodes;
  } else {
    return generateMessageVNode(messages, name);
  }
}

var PMessage = io({
  name: 'PMessage',
  mixins: [Colorable],
  props: _objectSpread2(_objectSpread2({}, Colorable.props), {}, {
    value: {
      type: [String, Array],
      default: null
    },
    field: {
      type: String,
      default: null
    }
  }),

  render() {
    return Ws('div', this.setTextColor(this.color, {
      class: {
        'pa__messages': true
      }
    }), Ws(ki, {
      name: 'pa__message-transition',
      css: true
    }, {
      default: generateMessages.bind(this, this.value, this.field)
    }));
  }

});

var PasswordStrength = io({
  name: 'PasswordStrengthTooltip',
  props: {
    message: {
      type: null,
      default: null
    },
    rules: null
  },

  setup(props) {
    const translator = Un(translatorKey);
    Un('context');
    return {
      generatePolicyElements(result) {
        if (!props.rules || typeof result === 'string') {
          return Ws(PMessage, {
            class: 'pa__input-details',
            value: result
          });
        }

        return Ws('div', {
          class: {
            'pa__pw-strength': true
          }
        }, Object.keys(props.rules).map(policy => {
          const elemText = translator.t(`passwordPolicy.${policy}`, [props.rules[policy]]);
          return Ws('div', {
            class: {
              'pa__pw-policy': true,
              'pa__success--text': !result || !result[policy]
            },
            key: policy,
            ref: 'policy'
          }, [Ws('span', {}, result && result[policy] ? '✕' : '✓'), elemText]);
        }));
      }

    };
  },

  render() {
    return this.generatePolicyElements(this.message);
  }

});

const RADIUS = 20;

function genCircle(name, offset) {
  return Ws('circle', {
    class: `pa__progress-circular__${name}`,
    fill: 'transparent',
    cx: 2 * this.viewBoxSize,
    cy: 2 * this.viewBoxSize,
    r: RADIUS,
    'stroke-width': this.strokeWidth,
    'stroke-dasharray': this.strokeDashArray,
    'stroke-dashoffset': offset
  });
}

function genSvg() {
  const children = [this.indeterminate || this.genCircle('underlay', 0), this.genCircle('overlay', this.strokeDashOffset)]; // @ts-ignore

  return Ws('svg', {
    style: this.svgStyles,
    xmlns: 'http://www.w3.org/2000/svg',
    // eslint-disable-next-line max-len
    viewBox: `${this.viewBoxSize} ${this.viewBoxSize} ${2 * this.viewBoxSize} ${2 * this.viewBoxSize}`
  }, children);
}

function genInfo() {
  return Ws('div', {
    class: 'pa__progress-circular__info'
  }, this.$slots.default);
}

var PLoading = io({
  name: 'PLoading',
  mixins: [Colorable],
  props: _objectSpread2(_objectSpread2({}, Colorable.props), {}, {
    button: Boolean,
    indeterminate: Boolean,
    rotate: {
      type: [Number, String],
      default: 0
    },
    size: {
      type: [Number, String],
      default: 32
    },
    width: {
      type: [Number, String],
      default: 4
    },
    modelValue: {
      type: [Number, String],
      default: 0
    }
  }),

  setup(props) {
    const calculatedSize = Rs(() => {
      return Number(props.size) + (props.button ? 8 : 0);
    });
    const circumference = Rs(() => {
      return 2 * Math.PI * RADIUS;
    });
    const strokeDashArray = Rs(() => {
      return Math.round(circumference.value * 1000) / 1000;
    });
    const strokeDashOffset = Rs(() => {
      return Math.round(circumference.value * 1000) / 1000;
    });
    const viewBoxSize = Rs(() => {
      return RADIUS / (1 - Number(props.width) / +props.size);
    });
    const strokeWidth = Rs(() => {
      return Number(props.width) / +props.size * viewBoxSize.value * 2;
    });
    const styles = Rs(() => {
      return {
        height: convertToUnit(calculatedSize.value),
        width: convertToUnit(calculatedSize.value)
      };
    });
    const svgStyles = Rs(() => {
      return {
        transform: `rotate(${Number(props.rotate)}deg)`
      };
    });
    const normalizedValue = Rs(() => {
      if (props.modelValue < 0) {
        return 0;
      }

      if (props.modelValue > 100) {
        return 100;
      }

      return parseFloat(props.modelValue);
    });
    const classes = Rs(() => {
      return {
        'pa__progress-circular--indeterminate': props.indeterminate,
        'pa__progress-circular--button': props.button
      };
    });
    return {
      normalizedValue,
      calculatedSize,
      circumference,
      classes,
      strokeWidth,
      strokeDashOffset,
      viewBoxSize,
      strokeDashArray,
      styles,
      svgStyles,
      genSvg,
      genCircle,
      genInfo
    };
  },

  render() {
    return Ws('div', this.setTextColor(this.color, {
      role: 'progressbar',
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue,
      class: this.classes,
      style: this.styles
    }), [this.genSvg(), this.genInfo()]);
  }

});

function getContent() {
  const defaultSlot = this.$slots.default ? this.$slots.default() : '';
  return typeof defaultSlot === 'string' ? Ws('span', defaultSlot) : defaultSlot;
}

var PButton = io({
  name: 'PBtn',
  mixins: [Colorable, Themeable],
  props: _objectSpread2(_objectSpread2({}, Colorable.props), {}, {
    loading: {
      type: Boolean
    },
    disabled: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    }
  }),

  render() {
    const genLoader = () => {
      return Ws('span', {
        class: 'pa__btn__loader'
      }, (this.$slots.loader ? this.$slots.loader() : false) || [Ws(PLoading, {
        color: this.textColor,
        indeterminate: true,
        size: 23,
        width: 2
      })]);
    };

    return Ws('button', this.setBackgroundColor(this.color, _objectSpread2(_objectSpread2({}, this.$attrs), {}, {
      class: {
        'pa__btn': true,
        'pa__btn--loading': !!this.loading,
        'pa__btn--block': this.block,
        'pa__btn--disabled': this.disabled,
        'pa__btn--flat': this.flat
      }
    })), [this.loading ? genLoader() : Ws('div', this.setTextColor(this.textColor, {
      class: ['pa__btn__content']
    }), [getContent.call(this)])]);
  }

});

var PCheckBox = io({
  name: 'PCheckBox',
  mixins: [Translatable, Validatable, Colorable, Themeable],
  props: _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, Validatable.props), Colorable.props), Themeable.props), {}, {
    label: {
      type: String,
      default: null
    },
    modelValue: {
      type: null,
      default: null
    },
    hideMessages: {
      type: Boolean,
      default: false
    }
  }),
  emits: ['focus', 'change', 'input', 'update:modelValue', 'blur', 'update:error'],

  setup(props) {
    const inputRef = Ft(null);
    const state = pt({
      isChecked: props.modelValue,
      isFocused: false,
      isActivated: false,
      lazyValue: props.modelValue
    });
    return _objectSpread2(_objectSpread2({}, Nt(state)), {}, {
      inputRef
    });
  },

  computed: {
    internalValue: {
      get() {
        return this.lazyValue;
      },

      set(val) {
        this.lazyValue = val;
        this.$emit('input', val);
      }

    },

    messagesToDisplay() {
      if (!this.hasMessages) return [];
      return this.validations.map(validation => {
        if (typeof validation === 'string' || (validation === null || validation === void 0 ? void 0 : validation.constructor) === Object) return validation;
        const validationResult = validation(this.internalValue);
        return typeof validationResult === 'string' ? validationResult : '';
      }).filter(message => message !== '');
    }

  },
  watch: {
    modelValue(value) {
      this.isChecked = value;
      this.lazyValue = value;
    }

  },

  render() {
    const onFocus = e => {
      // @ts-ignore
      this.hasColor = true;
      this.isFocused = true;
      this.isActivated = true;
      this.$emit('focus', e);
    };

    const onBlur = e => {
      // @ts-ignore
      this.hasColor = false;
      this.isFocused = false;
      this.$emit('blur', e);
    };

    const onInput = () => {
      this.isActivated = true;
      this.$emit('update:modelValue', !this.modelValue);
    };

    return Ws('div', this.setTextColor(this.validationState, {
      class: {
        'pa__input': true,
        'pa__input-checkbox': true,
        'pa__input-has-state': this.hasState,
        'pa__input-has-value': !!this.modelValue,
        'pa__input-focused': this.isFocused
      }
    }), [Ws('div', {
      class: ['pa__input--wrap']
    }, [Ws('input', this.setTextColor(this.isChecked ? this.computedColor : this.validationState, Object.assign({}, this.$attrs, {
      value: this.modelValue,
      ref: 'inputRef',
      name: this.$attrs.name,
      type: 'checkbox',
      style: this.$attrs.style,
      onKeyPress: this.$attrs.onKeyPress,
      onFocus,
      onBlur,
      onInput
    }))), this.label ? Lo(Ws('label', this.setTextColor(this.validationState, {
      class: {
        'pa__input--label': true
      }
    })), [[i18n, this.label]]) : '']), !this.hideMessages ? this.$slots.message ? this.$slots.message({
      message: this.messagesToDisplay,
      hasState: this.hasState,
      focus: this.isFocused
    }) : Ws(PMessage, {
      class: 'pa__input-details',
      value: this.messagesToDisplay,
      field: this.$attrs.name
    }) : null]);
  }

});

var PForm = io({
  name: 'PForm',

  provide() {
    return {
      form: {
        register: this.register,
        unregister: this.unregister
      }
    };
  },

  inheritAttrs: false,
  props: {
    lazyValidation: Boolean,
    value: Boolean
  },
  emits: ['input', 'submit'],
  data: () => ({
    inputs: [],
    errorBag: {}
  }),
  watch: {
    errorBag: {
      handler(val) {
        if (val) {
          const errors = Object.values(val).includes(true);
          this.$emit('input', !errors);
        }
      },

      deep: true,
      immediate: true
    }
  },
  methods: {
    /** @dev */
    async validate() {
      let invalid = 0;

      for (let i = 0; i < this.inputs.length; i++) {
        const input = this.inputs[i];

        if (!(await input.validate(true))) {
          invalid++;
        }
      }

      return invalid === 0;
    },

    /** @dev */
    reset() {
      this.inputs.forEach(function (input) {
        return input.reset();
      });
      this.resetErrorBag();
    },

    resetErrorBag() {
      if (this.lazyValidation) {
        // Account for timeout in validatable
        setTimeout(() => {
          this.errorBag = {};
        }, 0);
      }
    },

    /** @dev */
    resetValidation() {
      this.inputs.forEach(function (input) {
        return input.resetValidation();
      });
      this.resetErrorBag();
    },

    register(input) {
      this.inputs.push(input);
    },

    unregister(input) {
      const found = this.inputs.find(i => {
        var _i$_;

        return ((_i$_ = i._) === null || _i$_ === void 0 ? void 0 : _i$_.uid) === input._.uid;
      });
      if (!found) return;
      this.inputs = this.inputs.filter(i => {
        var _i$_2;

        return ((_i$_2 = i._) === null || _i$_2 === void 0 ? void 0 : _i$_2.uid) !== found._.uid;
      });
      delete this.errorBag[found._.uid];
    }

  },

  render() {
    return Ws('form', _objectSpread2(_objectSpread2({}, this.$attrs), {}, {
      class: ['pa__form', this.$attrs.class],
      novalidate: true,
      onSubmit: e => this.$emit('submit', e)
    }), this.$slots.default ? this.$slots.default() : []);
  }

});

var hash$1 = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash$1[matched];
  });
}

var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

var max = Math.max;
var min = Math.min;
var round = Math.round;

function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}

function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = isElement(element) ? getWindow(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + getWindowScrollBarX(element),
    y: y
  };
}

function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}

// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;

  if (getComputedStyle(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}

/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());

  if (isIE && isHTMLElement(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = getComputedStyle(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = getParentNode(element);

  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }

  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

function getVariation(placement) {
  return placement.split('-')[1];
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;
    }
  }

  return offsets;
}

function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;

    if (process.env.NODE_ENV !== "production") {
      console.error(['Popper: The `allowedAutoPlacements` option did not allow any', 'placements. Ensure the `placement` option matches the variation', 'of the allowed placements.', 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(' '));
    }
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement(placement);

    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


var flip$1 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
};

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
};

function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min$1 = offset + overflow[mainSide];
    var max$1 = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? top : left;

    var _altSide = mainAxis === 'x' ? bottom : right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
};

function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

function format(str) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return [].concat(args).reduce(function (p, c) {
    return p.replace(/%s/, c);
  }, str);
}

var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
function validateModifiers(modifiers) {
  modifiers.forEach(function (modifier) {
    [].concat(Object.keys(modifier), VALID_PROPERTIES) // IE11-compatible replacement for `new Set(iterable)`
    .filter(function (value, index, self) {
      return self.indexOf(value) === index;
    }).forEach(function (key) {
      switch (key) {
        case 'name':
          if (typeof modifier.name !== 'string') {
            console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
          }

          break;

        case 'enabled':
          if (typeof modifier.enabled !== 'boolean') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
          }

          break;

        case 'phase':
          if (modifierPhases.indexOf(modifier.phase) < 0) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
          }

          break;

        case 'fn':
          if (typeof modifier.fn !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'effect':
          if (modifier.effect != null && typeof modifier.effect !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'requires':
          if (modifier.requires != null && !Array.isArray(modifier.requires)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
          }

          break;

        case 'requiresIfExists':
          if (!Array.isArray(modifier.requiresIfExists)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
          }

          break;

        case 'options':
        case 'data':
          break;

        default:
          console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
            return "\"" + s + "\"";
          }).join(', ') + "; but \"" + key + "\" was provided.");
      }

      modifier.requires && modifier.requires.forEach(function (requirement) {
        if (modifiers.find(function (mod) {
          return mod.name === requirement;
        }) == null) {
          console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
        }
      });
    });
  });
}

function uniqueBy(arr, fn) {
  var identifiers = new Set();
  return arr.filter(function (item) {
    var identifier = fn(item);

    if (!identifiers.has(identifier)) {
      identifiers.add(identifier);
      return true;
    }
  });
}

function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned
        // if one of the modifiers is invalid for any reason

        if (process.env.NODE_ENV !== "production") {
          var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
            var name = _ref.name;
            return name;
          });
          validateModifiers(modifiers);

          if (getBasePlacement(state.options.placement) === auto) {
            var flipModifier = state.orderedModifiers.find(function (_ref2) {
              var name = _ref2.name;
              return name === 'flip';
            });

            if (!flipModifier) {
              console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
            }
          }

          var _getComputedStyle = getComputedStyle(popper),
              marginTop = _getComputedStyle.marginTop,
              marginRight = _getComputedStyle.marginRight,
              marginBottom = _getComputedStyle.marginBottom,
              marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
          // cause bugs with positioning, so we'll warn the consumer


          if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
            return parseFloat(margin);
          })) {
            console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
          }
        }

        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          if (process.env.NODE_ENV !== "production") {
            console.error(INVALID_ELEMENT_ERROR);
          }

          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        var __debug_loops__ = 0;

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (process.env.NODE_ENV !== "production") {
            __debug_loops__ += 1;

            if (__debug_loops__ > 100) {
              console.error(INFINITE_LOOP_ERROR);
              break;
            }
          }

          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      if (process.env.NODE_ENV !== "production") {
        console.error(INVALID_ELEMENT_ERROR);
      }

      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = _ref3$options === void 0 ? {} : _ref3$options,
            effect = _ref3.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}

var passive = {
  passive: true
};

function effect$1(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


var eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect$1,
  data: {}
};

function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
};

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref) {
  var x = _ref.x,
      y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);

      if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

  if (process.env.NODE_ENV !== "production") {
    var transitionProperty = getComputedStyle(state.elements.popper).transitionProperty || '';

    if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
      return transitionProperty.indexOf(property) >= 0;
    })) {
      console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
    }
  }

  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
};

// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


var applyStyles$1 = {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect,
  requires: ['computeStyles']
};

var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

var PSelect = io({
  name: 'PSelect',
  mixins: [Translatable, Validatable, Colorable, Themeable],
  props: _objectSpread2(_objectSpread2(_objectSpread2({}, Validatable.props), Colorable.props), {}, {
    dense: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    },
    items: {
      type: Array,
      default: () => []
    },
    itemText: {
      type: String,
      default: 'name'
    },
    itemValue: {
      type: String,
      default: 'value'
    },
    modelValue: {
      type: null,
      default: null
    },
    hideMessages: {
      type: Boolean,
      default: false
    }
  }),
  emits: ['click', 'focus', 'keydown', 'change', 'input', 'update:modelValue', 'blur', 'update:error'],

  setup() {
    const inputRef = Ft(null);
    const popoverRef = Ft(null);
    const containerRef = Ft(null);
    const popperInstance = Ft(null);
    wo(() => {
      popperInstance.value = createPopper(containerRef.value, popoverRef.value, {
        strategy: 'fixed',
        modifiers: [{
          name: 'matchReferenceSize',
          enabled: true,
          fn: _ref => {
            let {
              state,
              instance
            } = _ref;
            const widthOrHeight = state.placement.startsWith('left') || state.placement.startsWith('right') ? 'height' : 'width';
            const popperSize = state.rects.popper[widthOrHeight];
            const referenceSize = state.rects.reference[widthOrHeight];
            if (popperSize >= referenceSize) return;
            state.styles.popper[widthOrHeight] = `${referenceSize}px`; // instance.update();
          },
          phase: 'beforeWrite',
          requires: ['computeStyles']
        }, _objectSpread2(_objectSpread2({}, preventOverflow$1), {}, {
          options: {
            rootBoundary: containerRef.value,
            altBoundary: true,
            padding: 0
          }
        }), flip$1, _objectSpread2(_objectSpread2({}, offset$1), {}, {
          options: {
            offset: [0, 0]
          }
        })]
      });
    });
    const state = pt({
      isOpen: false,
      isFocused: false,
      isActivated: false,
      lazyValue: null,
      selectedItem: null
    });
    return _objectSpread2(_objectSpread2({}, Nt(state)), {}, {
      inputRef,
      popoverRef,
      containerRef,
      popperInstance
    });
  },

  computed: {
    internalValue: {
      get() {
        return this.lazyValue;
      },

      set(val) {
        this.lazyValue = val;
        this.$emit('update:modelValue', val);
      }

    },

    messagesToDisplay() {
      if (!this.hasMessages) return [];
      return this.validations.map(validation => {
        if (typeof validation === 'string' || (validation === null || validation === void 0 ? void 0 : validation.constructor) === Object) return validation;
        const validationResult = validation(this.internalValue);
        return typeof validationResult === 'string' ? validationResult : '';
      }).filter(message => message !== '');
    }

  },
  watch: {
    modelValue(value) {
      this.lazyValue = value;
    },

    lazyValue(val) {
      this.selectedItem = this.items.find(item => {
        if (typeof item === 'object') {
          return item[this.itemValue] === val;
        }

        return item === val;
      });
    }

  },
  methods: {
    getText(item) {
      return typeof item === 'object' ? item[this.itemText] : item;
    },

    getValue(item) {
      return typeof item === 'object' ? item[this.itemValue] : item;
    },

    genIcon() {
      return Ws('svg', {
        class: 'pa__input-select-arrow',
        width: '10',
        height: '5',
        viewBox: '0 0 10 5',
        'fill-rule': 'evenodd'
      }, [Ws('title', null, 'Open drop down'), Ws('path', {
        d: 'M10 0L5 5 0 0z'
      })]);
    },

    genItems() {
      return Ws('div', {
        ref: 'popoverRef',
        class: {
          'pa__input-select-items': true
        }
      }, this.items.map((item, i) => {
        const itemValue = this.getValue(item);
        return Ws('div', {
          key: i,
          onClick: event => {
            event.preventDefault();
            event.stopPropagation();
            this.internalValue = itemValue;
            this.isOpen = false;
            this.selectedItem = item;
            this.$emit('update:modelValue', this.internalValue);
            return;
          },
          tabindex: -1,
          class: {
            'pa__input-select-item': true,
            'pa__input-select-item--selected': itemValue === this.internalValue
          }
        }, [this.getText(item)]);
      }));
    },

    focus() {
      // @ts-ignore
      this.$refs.inputRef.focus();
    }

  },

  render() {
    const onFocus = e => {
      // @ts-ignore
      this.hasColor = true;
      this.isFocused = true; // this.isOpen = true

      this.isActivated = true;
      this.$emit('focus', e);
    };

    const onClick = e => {
      // @ts-ignore
      this.hasColor = true;
      this.isFocused = true;
      this.isActivated = true;
      this.isOpen = !this.isOpen;
      this.popperInstance.update();
      this.$emit('click', e);
    };

    const onBlur = e => {
      this.isFocused = false;
      e.preventDefault();
      e.stopPropagation();

      if (!e.target.contains(e.relatedTarget)) {
        // @ts-ignore
        this.hasColor = false;
        this.isOpen = false;
        this.$emit('blur', e);
      }
    };

    const onKeyDown = e => {
      if (e.code === '13') this.$emit('change', this.internalValue);
      this.$emit('keydown', e);
    };

    return Ws('div', this.setTextColor(this.validationState, {
      class: {
        'pa__input': true,
        'pa__input-select': true,
        'pa__input-has-state': this.hasState,
        'pa__input-dense': this.dense,
        'pa__input-flat': this.flat,
        'pa__input-has-value': !!this.internalValue,
        'pa__input-select-is-open': this.isOpen,
        'pa__input-focused': this.isFocused
      },
      tabindex: 0,
      onClick,
      onFocus,
      onKeyDown,
      onBlur
    }), [Ws('div', {
      class: {
        'pa__input--wrap': true
      },
      ref: 'containerRef'
    }, [Ws('div', Object.assign({}, this.$attrs, {
      class: ['pa__input-select-value']
    }), [this.selectedItem && typeof this.selectedItem === 'object' ? this.selectedItem[this.itemText] : this.selectedItem]), this.genIcon(), this.genItems(), this.label ? Lo(Ws('label', this.setTextColor(this.validationState, {
      class: {
        'pa__input--label': true
      }
    })), [[i18n, this.label]]) : '', this.$slots.append ? this.$slots.append() : '', Ws('input', {
      value: this.lazyValue,
      type: 'hidden',
      name: this.$attrs.name
    })]), !this.hideMessages ? this.$slots.message ? this.$slots.message({
      message: this.messagesToDisplay,
      hasState: this.hasState,
      focus: this.isFocused
    }) : Ws(PMessage, {
      class: 'pa__input-details',
      value: this.messagesToDisplay,
      field: this.$attrs.name
    }) : null]);
  }

});

var PTextField = io({
  name: 'PTextField',
  mixins: [Translatable, Validatable, Colorable, Themeable],
  props: _objectSpread2(_objectSpread2(_objectSpread2({}, Validatable.props), Colorable.props), {}, {
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: null
    },
    modelValue: {
      type: null,
      default: null
    },
    hideMessages: {
      type: Boolean,
      default: false
    }
  }),
  emits: ['focus', 'keydown', 'change', 'input', 'update:modelValue', 'blur', 'update:error'],

  setup(props) {
    const inputRef = Ft(null);
    const state = pt({
      isFocused: false,
      isActivated: false,
      lazyValue: props.modelValue
    });
    return _objectSpread2(_objectSpread2({}, Nt(state)), {}, {
      inputRef
    });
  },

  computed: {
    internalValue: {
      get() {
        return this.lazyValue;
      },

      set(val) {
        this.lazyValue = val;
        this.$emit('input', val);
      }

    },

    messagesToDisplay() {
      if (!this.hasMessages) return [];
      return this.validations.map(validation => {
        if (typeof validation === 'string' || (validation === null || validation === void 0 ? void 0 : validation.constructor) === Object) return validation;
        const validationResult = validation(this.internalValue);
        return typeof validationResult === 'string' ? validationResult : '';
      }).filter(message => message !== '');
    }

  },
  watch: {
    modelValue(value) {
      this.lazyValue = value;
    }

  },
  methods: {
    reset() {
      this.internalValue = null;
    },

    focus() {
      // @ts-ignore
      this.$refs.inputRef.focus();
    },

    blur() {
      // @ts-ignore
      this.$refs.inputRef.blur();
    }

  },

  render() {
    const onFocus = e => {
      // @ts-ignore
      this.hasColor = true;
      this.isFocused = true;
      this.isActivated = true;
      this.$emit('focus', e);
    };

    const onBlur = e => {
      // @ts-ignore
      this.hasColor = false;
      this.isFocused = false;
      this.$emit('blur', e);
    };

    const onInput = event => {
      var _event$currentTarget;

      this.isActivated = true;
      this.$emit('update:modelValue', (_event$currentTarget = event.currentTarget) === null || _event$currentTarget === void 0 ? void 0 : _event$currentTarget.value);
    };

    const onKeyDown = e => {
      if (e.code === '13') this.$emit('change', this.internalValue);
      this.$emit('keydown', e);
    };

    return Ws('div', this.setTextColor(this.validationState, {
      class: {
        'pa__input': true,
        'pa__input-has-state': this.hasState,
        'pa__input-has-value': !!this.modelValue,
        'pa__input-focused': this.isFocused
      }
    }), [Ws('div', {
      class: {
        'pa__input--wrap': true
      }
    }, [Ws('input', Object.assign({}, this.$attrs, {
      value: this.internalValue,
      ref: 'inputRef',
      name: this.$attrs.name,
      type: this.type || 'text',
      style: this.$attrs.style,
      class: ['pa__text-field'],
      onFocus,
      onBlur,
      onInput,
      onKeyDown
    })), this.label ? Lo(Ws('label', this.setTextColor(this.validationState, {
      class: {
        'pa__input--label': true
      }
    })), [[i18n, this.label]]) : '', this.$slots.append ? this.$slots.append() : '']), !this.hideMessages ? this.$slots.message ? this.$slots.message({
      message: this.messagesToDisplay,
      hasState: this.hasState,
      focus: this.isFocused
    }) : Ws(PMessage, {
      class: 'pa__input-details',
      value: this.messagesToDisplay,
      field: this.$attrs.name
    }) : null]);
  }

});

function installComponents(Vue) {
  Vue.component(PAlert.name, PAlert).component(PButton.name, PButton).component(PForm.name, PForm).component(PIcon.name, PIcon).component(PLoading.name, PLoading).component(PMessage.name, PMessage).component(PSelect.name, PSelect).component(PTextField.name, PTextField);
}

function getDevtoolsGlobalHook() {
    return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function getTarget() {
    // @ts-ignore
    return (typeof navigator !== 'undefined' && typeof window !== 'undefined')
        ? window
        : typeof global !== 'undefined'
            ? global
            : {};
}
const isProxyAvailable = typeof Proxy === 'function';

const HOOK_SETUP = 'devtools-plugin:setup';
const HOOK_PLUGIN_SETTINGS_SET = 'plugin:settings:set';

let supported;
let perf;
function isPerformanceSupported() {
    var _a;
    if (supported !== undefined) {
        return supported;
    }
    if (typeof window !== 'undefined' && window.performance) {
        supported = true;
        perf = window.performance;
    }
    else if (typeof global !== 'undefined' && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
        supported = true;
        perf = global.perf_hooks.performance;
    }
    else {
        supported = false;
    }
    return supported;
}
function now() {
    return isPerformanceSupported() ? perf.now() : Date.now();
}

class ApiProxy {
    constructor(plugin, hook) {
        this.target = null;
        this.targetQueue = [];
        this.onQueue = [];
        this.plugin = plugin;
        this.hook = hook;
        const defaultSettings = {};
        if (plugin.settings) {
            for (const id in plugin.settings) {
                const item = plugin.settings[id];
                defaultSettings[id] = item.defaultValue;
            }
        }
        const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
        let currentSettings = Object.assign({}, defaultSettings);
        try {
            const raw = localStorage.getItem(localSettingsSaveId);
            const data = JSON.parse(raw);
            Object.assign(currentSettings, data);
        }
        catch (e) {
            // noop
        }
        this.fallbacks = {
            getSettings() {
                return currentSettings;
            },
            setSettings(value) {
                try {
                    localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
                }
                catch (e) {
                    // noop
                }
                currentSettings = value;
            },
            now() {
                return now();
            },
        };
        if (hook) {
            hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
                if (pluginId === this.plugin.id) {
                    this.fallbacks.setSettings(value);
                }
            });
        }
        this.proxiedOn = new Proxy({}, {
            get: (_target, prop) => {
                if (this.target) {
                    return this.target.on[prop];
                }
                else {
                    return (...args) => {
                        this.onQueue.push({
                            method: prop,
                            args,
                        });
                    };
                }
            },
        });
        this.proxiedTarget = new Proxy({}, {
            get: (_target, prop) => {
                if (this.target) {
                    return this.target[prop];
                }
                else if (prop === 'on') {
                    return this.proxiedOn;
                }
                else if (Object.keys(this.fallbacks).includes(prop)) {
                    return (...args) => {
                        this.targetQueue.push({
                            method: prop,
                            args,
                            resolve: () => { },
                        });
                        return this.fallbacks[prop](...args);
                    };
                }
                else {
                    return (...args) => {
                        return new Promise(resolve => {
                            this.targetQueue.push({
                                method: prop,
                                args,
                                resolve,
                            });
                        });
                    };
                }
            },
        });
    }
    async setRealTarget(target) {
        this.target = target;
        for (const item of this.onQueue) {
            this.target.on[item.method](...item.args);
        }
        for (const item of this.targetQueue) {
            item.resolve(await this.target[item.method](...item.args));
        }
    }
}

function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
    const descriptor = pluginDescriptor;
    const target = getTarget();
    const hook = getDevtoolsGlobalHook();
    const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;
    if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
        hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
    }
    else {
        const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
        const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
        list.push({
            pluginDescriptor: descriptor,
            setupFn,
            proxy,
        });
        if (proxy)
            setupFn(proxy.proxiedTarget);
    }
}

/*!
  * vue-router v4.1.5
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */

const isBrowser = typeof window !== 'undefined';

function isESModule(obj) {
    return obj.__esModule || obj[Symbol.toStringTag] === 'Module';
}
const assign = Object.assign;
function applyToParams(fn, params) {
    const newParams = {};
    for (const key in params) {
        const value = params[key];
        newParams[key] = isArray(value)
            ? value.map(fn)
            : fn(value);
    }
    return newParams;
}
const noop = () => { };
/**
 * Typesafe alternative to Array.isArray
 * https://github.com/microsoft/TypeScript/pull/48228
 */
const isArray = Array.isArray;

function warn(msg) {
    // avoid using ...args as it breaks in older Edge builds
    const args = Array.from(arguments).slice(1);
    console.warn.apply(console, ['[Vue Router warn]: ' + msg].concat(args));
}

const TRAILING_SLASH_RE = /\/$/;
const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, '');
/**
 * Transforms a URI into a normalized history location
 *
 * @param parseQuery
 * @param location - URI to normalize
 * @param currentLocation - current absolute location. Allows resolving relative
 * paths. Must start with `/`. Defaults to `/`
 * @returns a normalized history location
 */
function parseURL(parseQuery, location, currentLocation = '/') {
    let path, query = {}, searchString = '', hash = '';
    // Could use URL and URLSearchParams but IE 11 doesn't support it
    // TODO: move to new URL()
    const hashPos = location.indexOf('#');
    let searchPos = location.indexOf('?');
    // the hash appears before the search, so it's not part of the search string
    if (hashPos < searchPos && hashPos >= 0) {
        searchPos = -1;
    }
    if (searchPos > -1) {
        path = location.slice(0, searchPos);
        searchString = location.slice(searchPos + 1, hashPos > -1 ? hashPos : location.length);
        query = parseQuery(searchString);
    }
    if (hashPos > -1) {
        path = path || location.slice(0, hashPos);
        // keep the # character
        hash = location.slice(hashPos, location.length);
    }
    // no search and no query
    path = resolveRelativePath(path != null ? path : location, currentLocation);
    // empty path means a relative query or hash `?foo=f`, `#thing`
    return {
        fullPath: path + (searchString && '?') + searchString + hash,
        path,
        query,
        hash,
    };
}
/**
 * Stringifies a URL object
 *
 * @param stringifyQuery
 * @param location
 */
function stringifyURL(stringifyQuery, location) {
    const query = location.query ? stringifyQuery(location.query) : '';
    return location.path + (query && '?') + query + (location.hash || '');
}
/**
 * Strips off the base from the beginning of a location.pathname in a non-case-sensitive way.
 *
 * @param pathname - location.pathname
 * @param base - base to strip off
 */
function stripBase(pathname, base) {
    // no base or base is not found at the beginning
    if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
        return pathname;
    return pathname.slice(base.length) || '/';
}
/**
 * Checks if two RouteLocation are equal. This means that both locations are
 * pointing towards the same {@link RouteRecord} and that all `params`, `query`
 * parameters and `hash` are the same
 *
 * @param a - first {@link RouteLocation}
 * @param b - second {@link RouteLocation}
 */
function isSameRouteLocation(stringifyQuery, a, b) {
    const aLastIndex = a.matched.length - 1;
    const bLastIndex = b.matched.length - 1;
    return (aLastIndex > -1 &&
        aLastIndex === bLastIndex &&
        isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) &&
        isSameRouteLocationParams(a.params, b.params) &&
        stringifyQuery(a.query) === stringifyQuery(b.query) &&
        a.hash === b.hash);
}
/**
 * Check if two `RouteRecords` are equal. Takes into account aliases: they are
 * considered equal to the `RouteRecord` they are aliasing.
 *
 * @param a - first {@link RouteRecord}
 * @param b - second {@link RouteRecord}
 */
function isSameRouteRecord(a, b) {
    // since the original record has an undefined value for aliasOf
    // but all aliases point to the original record, this will always compare
    // the original record
    return (a.aliasOf || a) === (b.aliasOf || b);
}
function isSameRouteLocationParams(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length)
        return false;
    for (const key in a) {
        if (!isSameRouteLocationParamsValue(a[key], b[key]))
            return false;
    }
    return true;
}
function isSameRouteLocationParamsValue(a, b) {
    return isArray(a)
        ? isEquivalentArray(a, b)
        : isArray(b)
            ? isEquivalentArray(b, a)
            : a === b;
}
/**
 * Check if two arrays are the same or if an array with one single entry is the
 * same as another primitive value. Used to check query and parameters
 *
 * @param a - array of values
 * @param b - array of values or a single value
 */
function isEquivalentArray(a, b) {
    return isArray(b)
        ? a.length === b.length && a.every((value, i) => value === b[i])
        : a.length === 1 && a[0] === b;
}
/**
 * Resolves a relative path that starts with `.`.
 *
 * @param to - path location we are resolving
 * @param from - currentLocation.path, should start with `/`
 */
function resolveRelativePath(to, from) {
    if (to.startsWith('/'))
        return to;
    if (!from.startsWith('/')) {
        warn(`Cannot resolve a relative location without an absolute path. Trying to resolve "${to}" from "${from}". It should look like "/${from}".`);
        return to;
    }
    if (!to)
        return from;
    const fromSegments = from.split('/');
    const toSegments = to.split('/');
    let position = fromSegments.length - 1;
    let toPosition;
    let segment;
    for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
        segment = toSegments[toPosition];
        // we stay on the same position
        if (segment === '.')
            continue;
        // go up in the from array
        if (segment === '..') {
            // we can't go below zero, but we still need to increment toPosition
            if (position > 1)
                position--;
            // continue
        }
        // we reached a non-relative path, we stop here
        else
            break;
    }
    return (fromSegments.slice(0, position).join('/') +
        '/' +
        toSegments
            // ensure we use at least the last element in the toSegments
            .slice(toPosition - (toPosition === toSegments.length ? 1 : 0))
            .join('/'));
}

var NavigationType;
(function (NavigationType) {
    NavigationType["pop"] = "pop";
    NavigationType["push"] = "push";
})(NavigationType || (NavigationType = {}));
var NavigationDirection;
(function (NavigationDirection) {
    NavigationDirection["back"] = "back";
    NavigationDirection["forward"] = "forward";
    NavigationDirection["unknown"] = "";
})(NavigationDirection || (NavigationDirection = {}));
/**
 * Starting location for Histories
 */
const START = '';
// Generic utils
/**
 * Normalizes a base by removing any trailing slash and reading the base tag if
 * present.
 *
 * @param base - base to normalize
 */
function normalizeBase(base) {
    if (!base) {
        if (isBrowser) {
            // respect <base> tag
            const baseEl = document.querySelector('base');
            base = (baseEl && baseEl.getAttribute('href')) || '/';
            // strip full URL origin
            base = base.replace(/^\w+:\/\/[^\/]+/, '');
        }
        else {
            base = '/';
        }
    }
    // ensure leading slash when it was removed by the regex above avoid leading
    // slash with hash because the file could be read from the disk like file://
    // and the leading slash would cause problems
    if (base[0] !== '/' && base[0] !== '#')
        base = '/' + base;
    // remove the trailing slash so all other method can just do `base + fullPath`
    // to build an href
    return removeTrailingSlash(base);
}
// remove any character before the hash
const BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base, location) {
    return base.replace(BEFORE_HASH_RE, '#') + location;
}

function getElementPosition(el, offset) {
    const docRect = document.documentElement.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return {
        behavior: offset.behavior,
        left: elRect.left - docRect.left - (offset.left || 0),
        top: elRect.top - docRect.top - (offset.top || 0),
    };
}
const computeScrollPosition = () => ({
    left: window.pageXOffset,
    top: window.pageYOffset,
});
function scrollToPosition(position) {
    let scrollToOptions;
    if ('el' in position) {
        const positionEl = position.el;
        const isIdSelector = typeof positionEl === 'string' && positionEl.startsWith('#');
        /**
         * `id`s can accept pretty much any characters, including CSS combinators
         * like `>` or `~`. It's still possible to retrieve elements using
         * `document.getElementById('~')` but it needs to be escaped when using
         * `document.querySelector('#\\~')` for it to be valid. The only
         * requirements for `id`s are them to be unique on the page and to not be
         * empty (`id=""`). Because of that, when passing an id selector, it should
         * be properly escaped for it to work with `querySelector`. We could check
         * for the id selector to be simple (no CSS combinators `+ >~`) but that
         * would make things inconsistent since they are valid characters for an
         * `id` but would need to be escaped when using `querySelector`, breaking
         * their usage and ending up in no selector returned. Selectors need to be
         * escaped:
         *
         * - `#1-thing` becomes `#\31 -thing`
         * - `#with~symbols` becomes `#with\\~symbols`
         *
         * - More information about  the topic can be found at
         *   https://mathiasbynens.be/notes/html5-id-class.
         * - Practical example: https://mathiasbynens.be/demo/html5-id
         */
        if (typeof position.el === 'string') {
            if (!isIdSelector || !document.getElementById(position.el.slice(1))) {
                try {
                    const foundEl = document.querySelector(position.el);
                    if (isIdSelector && foundEl) {
                        warn(`The selector "${position.el}" should be passed as "el: document.querySelector('${position.el}')" because it starts with "#".`);
                        // return to avoid other warnings
                        return;
                    }
                }
                catch (err) {
                    warn(`The selector "${position.el}" is invalid. If you are using an id selector, make sure to escape it. You can find more information about escaping characters in selectors at https://mathiasbynens.be/notes/css-escapes or use CSS.escape (https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape).`);
                    // return to avoid other warnings
                    return;
                }
            }
        }
        const el = typeof positionEl === 'string'
            ? isIdSelector
                ? document.getElementById(positionEl.slice(1))
                : document.querySelector(positionEl)
            : positionEl;
        if (!el) {
            warn(`Couldn't find element using selector "${position.el}" returned by scrollBehavior.`);
            return;
        }
        scrollToOptions = getElementPosition(el, position);
    }
    else {
        scrollToOptions = position;
    }
    if ('scrollBehavior' in document.documentElement.style)
        window.scrollTo(scrollToOptions);
    else {
        window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.pageXOffset, scrollToOptions.top != null ? scrollToOptions.top : window.pageYOffset);
    }
}
function getScrollKey(path, delta) {
    const position = history.state ? history.state.position - delta : -1;
    return position + path;
}
const scrollPositions = new Map();
function saveScrollPosition(key, scrollPosition) {
    scrollPositions.set(key, scrollPosition);
}
function getSavedScrollPosition(key) {
    const scroll = scrollPositions.get(key);
    // consume it so it's not used again
    scrollPositions.delete(key);
    return scroll;
}
// TODO: RFC about how to save scroll position
/**
 * ScrollBehavior instance used by the router to compute and restore the scroll
 * position when navigating.
 */
// export interface ScrollHandler<ScrollPositionEntry extends HistoryStateValue, ScrollPosition extends ScrollPositionEntry> {
//   // returns a scroll position that can be saved in history
//   compute(): ScrollPositionEntry
//   // can take an extended ScrollPositionEntry
//   scroll(position: ScrollPosition): void
// }
// export const scrollHandler: ScrollHandler<ScrollPosition> = {
//   compute: computeScroll,
//   scroll: scrollToPosition,
// }

let createBaseLocation = () => location.protocol + '//' + location.host;
/**
 * Creates a normalized history location from a window.location object
 * @param location -
 */
function createCurrentLocation(base, location) {
    const { pathname, search, hash } = location;
    // allows hash bases like #, /#, #/, #!, #!/, /#!/, or even /folder#end
    const hashPos = base.indexOf('#');
    if (hashPos > -1) {
        let slicePos = hash.includes(base.slice(hashPos))
            ? base.slice(hashPos).length
            : 1;
        let pathFromHash = hash.slice(slicePos);
        // prepend the starting slash to hash so the url starts with /#
        if (pathFromHash[0] !== '/')
            pathFromHash = '/' + pathFromHash;
        return stripBase(pathFromHash, '');
    }
    const path = stripBase(pathname, base);
    return path + search + hash;
}
function useHistoryListeners(base, historyState, currentLocation, replace) {
    let listeners = [];
    let teardowns = [];
    // TODO: should it be a stack? a Dict. Check if the popstate listener
    // can trigger twice
    let pauseState = null;
    const popStateHandler = ({ state, }) => {
        const to = createCurrentLocation(base, location);
        const from = currentLocation.value;
        const fromState = historyState.value;
        let delta = 0;
        if (state) {
            currentLocation.value = to;
            historyState.value = state;
            // ignore the popstate and reset the pauseState
            if (pauseState && pauseState === from) {
                pauseState = null;
                return;
            }
            delta = fromState ? state.position - fromState.position : 0;
        }
        else {
            replace(to);
        }
        // console.log({ deltaFromCurrent })
        // Here we could also revert the navigation by calling history.go(-delta)
        // this listener will have to be adapted to not trigger again and to wait for the url
        // to be updated before triggering the listeners. Some kind of validation function would also
        // need to be passed to the listeners so the navigation can be accepted
        // call all listeners
        listeners.forEach(listener => {
            listener(currentLocation.value, from, {
                delta,
                type: NavigationType.pop,
                direction: delta
                    ? delta > 0
                        ? NavigationDirection.forward
                        : NavigationDirection.back
                    : NavigationDirection.unknown,
            });
        });
    };
    function pauseListeners() {
        pauseState = currentLocation.value;
    }
    function listen(callback) {
        // set up the listener and prepare teardown callbacks
        listeners.push(callback);
        const teardown = () => {
            const index = listeners.indexOf(callback);
            if (index > -1)
                listeners.splice(index, 1);
        };
        teardowns.push(teardown);
        return teardown;
    }
    function beforeUnloadListener() {
        const { history } = window;
        if (!history.state)
            return;
        history.replaceState(assign({}, history.state, { scroll: computeScrollPosition() }), '');
    }
    function destroy() {
        for (const teardown of teardowns)
            teardown();
        teardowns = [];
        window.removeEventListener('popstate', popStateHandler);
        window.removeEventListener('beforeunload', beforeUnloadListener);
    }
    // set up the listeners and prepare teardown callbacks
    window.addEventListener('popstate', popStateHandler);
    window.addEventListener('beforeunload', beforeUnloadListener);
    return {
        pauseListeners,
        listen,
        destroy,
    };
}
/**
 * Creates a state object
 */
function buildState(back, current, forward, replaced = false, computeScroll = false) {
    return {
        back,
        current,
        forward,
        replaced,
        position: window.history.length,
        scroll: computeScroll ? computeScrollPosition() : null,
    };
}
function useHistoryStateNavigation(base) {
    const { history, location } = window;
    // private variables
    const currentLocation = {
        value: createCurrentLocation(base, location),
    };
    const historyState = { value: history.state };
    // build current history entry as this is a fresh navigation
    if (!historyState.value) {
        changeLocation(currentLocation.value, {
            back: null,
            current: currentLocation.value,
            forward: null,
            // the length is off by one, we need to decrease it
            position: history.length - 1,
            replaced: true,
            // don't add a scroll as the user may have an anchor, and we want
            // scrollBehavior to be triggered without a saved position
            scroll: null,
        }, true);
    }
    function changeLocation(to, state, replace) {
        /**
         * if a base tag is provided, and we are on a normal domain, we have to
         * respect the provided `base` attribute because pushState() will use it and
         * potentially erase anything before the `#` like at
         * https://github.com/vuejs/router/issues/685 where a base of
         * `/folder/#` but a base of `/` would erase the `/folder/` section. If
         * there is no host, the `<base>` tag makes no sense and if there isn't a
         * base tag we can just use everything after the `#`.
         */
        const hashIndex = base.indexOf('#');
        const url = hashIndex > -1
            ? (location.host && document.querySelector('base')
                ? base
                : base.slice(hashIndex)) + to
            : createBaseLocation() + base + to;
        try {
            // BROWSER QUIRK
            // NOTE: Safari throws a SecurityError when calling this function 100 times in 30 seconds
            history[replace ? 'replaceState' : 'pushState'](state, '', url);
            historyState.value = state;
        }
        catch (err) {
            {
                warn('Error with push/replace State', err);
            }
            // Force the navigation, this also resets the call count
            location[replace ? 'replace' : 'assign'](url);
        }
    }
    function replace(to, data) {
        const state = assign({}, history.state, buildState(historyState.value.back, 
        // keep back and forward entries but override current position
        to, historyState.value.forward, true), data, { position: historyState.value.position });
        changeLocation(to, state, true);
        currentLocation.value = to;
    }
    function push(to, data) {
        // Add to current entry the information of where we are going
        // as well as saving the current position
        const currentState = assign({}, 
        // use current history state to gracefully handle a wrong call to
        // history.replaceState
        // https://github.com/vuejs/router/issues/366
        historyState.value, history.state, {
            forward: to,
            scroll: computeScrollPosition(),
        });
        if (!history.state) {
            warn(`history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:\n\n` +
                `history.replaceState(history.state, '', url)\n\n` +
                `You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`);
        }
        changeLocation(currentState.current, currentState, true);
        const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
        changeLocation(to, state, false);
        currentLocation.value = to;
    }
    return {
        location: currentLocation,
        state: historyState,
        push,
        replace,
    };
}
/**
 * Creates an HTML5 history. Most common history for single page applications.
 *
 * @param base -
 */
function createWebHistory(base) {
    base = normalizeBase(base);
    const historyNavigation = useHistoryStateNavigation(base);
    const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
    function go(delta, triggerListeners = true) {
        if (!triggerListeners)
            historyListeners.pauseListeners();
        history.go(delta);
    }
    const routerHistory = assign({
        // it's overridden right after
        location: '',
        base,
        go,
        createHref: createHref.bind(null, base),
    }, historyNavigation, historyListeners);
    Object.defineProperty(routerHistory, 'location', {
        enumerable: true,
        get: () => historyNavigation.location.value,
    });
    Object.defineProperty(routerHistory, 'state', {
        enumerable: true,
        get: () => historyNavigation.state.value,
    });
    return routerHistory;
}

/**
 * Creates an in-memory based history. The main purpose of this history is to handle SSR. It starts in a special location that is nowhere.
 * It's up to the user to replace that location with the starter location by either calling `router.push` or `router.replace`.
 *
 * @param base - Base applied to all urls, defaults to '/'
 * @returns a history object that can be passed to the router constructor
 */
function createMemoryHistory(base = '') {
    let listeners = [];
    let queue = [START];
    let position = 0;
    base = normalizeBase(base);
    function setLocation(location) {
        position++;
        if (position === queue.length) {
            // we are at the end, we can simply append a new entry
            queue.push(location);
        }
        else {
            // we are in the middle, we remove everything from here in the queue
            queue.splice(position);
            queue.push(location);
        }
    }
    function triggerListeners(to, from, { direction, delta }) {
        const info = {
            direction,
            delta,
            type: NavigationType.pop,
        };
        for (const callback of listeners) {
            callback(to, from, info);
        }
    }
    const routerHistory = {
        // rewritten by Object.defineProperty
        location: START,
        // TODO: should be kept in queue
        state: {},
        base,
        createHref: createHref.bind(null, base),
        replace(to) {
            // remove current entry and decrement position
            queue.splice(position--, 1);
            setLocation(to);
        },
        push(to, data) {
            setLocation(to);
        },
        listen(callback) {
            listeners.push(callback);
            return () => {
                const index = listeners.indexOf(callback);
                if (index > -1)
                    listeners.splice(index, 1);
            };
        },
        destroy() {
            listeners = [];
            queue = [START];
            position = 0;
        },
        go(delta, shouldTrigger = true) {
            const from = this.location;
            const direction = 
            // we are considering delta === 0 going forward, but in abstract mode
            // using 0 for the delta doesn't make sense like it does in html5 where
            // it reloads the page
            delta < 0 ? NavigationDirection.back : NavigationDirection.forward;
            position = Math.max(0, Math.min(position + delta, queue.length - 1));
            if (shouldTrigger) {
                triggerListeners(this.location, from, {
                    direction,
                    delta,
                });
            }
        },
    };
    Object.defineProperty(routerHistory, 'location', {
        enumerable: true,
        get: () => queue[position],
    });
    return routerHistory;
}

function isRouteLocation(route) {
    return typeof route === 'string' || (route && typeof route === 'object');
}
function isRouteName(name) {
    return typeof name === 'string' || typeof name === 'symbol';
}

/**
 * Initial route location where the router is. Can be used in navigation guards
 * to differentiate the initial navigation.
 *
 * @example
 * ```js
 * import { START_LOCATION } from 'vue-router'
 *
 * router.beforeEach((to, from) => {
 *   if (from === START_LOCATION) {
 *     // initial navigation
 *   }
 * })
 * ```
 */
const START_LOCATION_NORMALIZED = {
    path: '/',
    name: undefined,
    params: {},
    query: {},
    hash: '',
    fullPath: '/',
    matched: [],
    meta: {},
    redirectedFrom: undefined,
};

const NavigationFailureSymbol = Symbol('navigation failure' );
/**
 * Enumeration with all possible types for navigation failures. Can be passed to
 * {@link isNavigationFailure} to check for specific failures.
 */
var NavigationFailureType;
(function (NavigationFailureType) {
    /**
     * An aborted navigation is a navigation that failed because a navigation
     * guard returned `false` or called `next(false)`
     */
    NavigationFailureType[NavigationFailureType["aborted"] = 4] = "aborted";
    /**
     * A cancelled navigation is a navigation that failed because a more recent
     * navigation finished started (not necessarily finished).
     */
    NavigationFailureType[NavigationFailureType["cancelled"] = 8] = "cancelled";
    /**
     * A duplicated navigation is a navigation that failed because it was
     * initiated while already being at the exact same location.
     */
    NavigationFailureType[NavigationFailureType["duplicated"] = 16] = "duplicated";
})(NavigationFailureType || (NavigationFailureType = {}));
// DEV only debug messages
const ErrorTypeMessages = {
    [1 /* ErrorTypes.MATCHER_NOT_FOUND */]({ location, currentLocation }) {
        return `No match for\n ${JSON.stringify(location)}${currentLocation
            ? '\nwhile being at\n' + JSON.stringify(currentLocation)
            : ''}`;
    },
    [2 /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */]({ from, to, }) {
        return `Redirected from "${from.fullPath}" to "${stringifyRoute(to)}" via a navigation guard.`;
    },
    [4 /* ErrorTypes.NAVIGATION_ABORTED */]({ from, to }) {
        return `Navigation aborted from "${from.fullPath}" to "${to.fullPath}" via a navigation guard.`;
    },
    [8 /* ErrorTypes.NAVIGATION_CANCELLED */]({ from, to }) {
        return `Navigation cancelled from "${from.fullPath}" to "${to.fullPath}" with a new navigation.`;
    },
    [16 /* ErrorTypes.NAVIGATION_DUPLICATED */]({ from, to }) {
        return `Avoided redundant navigation to current location: "${from.fullPath}".`;
    },
};
function createRouterError(type, params) {
    // keep full error messages in cjs versions
    {
        return assign(new Error(ErrorTypeMessages[type](params)), {
            type,
            [NavigationFailureSymbol]: true,
        }, params);
    }
}
function isNavigationFailure(error, type) {
    return (error instanceof Error &&
        NavigationFailureSymbol in error &&
        (type == null || !!(error.type & type)));
}
const propertiesToLog = ['params', 'query', 'hash'];
function stringifyRoute(to) {
    if (typeof to === 'string')
        return to;
    if ('path' in to)
        return to.path;
    const location = {};
    for (const key of propertiesToLog) {
        if (key in to)
            location[key] = to[key];
    }
    return JSON.stringify(location, null, 2);
}

// default pattern for a param: non-greedy everything but /
const BASE_PARAM_PATTERN = '[^/]+?';
const BASE_PATH_PARSER_OPTIONS = {
    sensitive: false,
    strict: false,
    start: true,
    end: true,
};
// Special Regex characters that must be escaped in static tokens
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
/**
 * Creates a path parser from an array of Segments (a segment is an array of Tokens)
 *
 * @param segments - array of segments returned by tokenizePath
 * @param extraOptions - optional options for the regexp
 * @returns a PathParser
 */
function tokensToParser(segments, extraOptions) {
    const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
    // the amount of scores is the same as the length of segments except for the root segment "/"
    const score = [];
    // the regexp as a string
    let pattern = options.start ? '^' : '';
    // extracted keys
    const keys = [];
    for (const segment of segments) {
        // the root segment needs special treatment
        const segmentScores = segment.length ? [] : [90 /* PathScore.Root */];
        // allow trailing slash
        if (options.strict && !segment.length)
            pattern += '/';
        for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
            const token = segment[tokenIndex];
            // resets the score if we are inside a sub-segment /:a-other-:b
            let subSegmentScore = 40 /* PathScore.Segment */ +
                (options.sensitive ? 0.25 /* PathScore.BonusCaseSensitive */ : 0);
            if (token.type === 0 /* TokenType.Static */) {
                // prepend the slash if we are starting a new segment
                if (!tokenIndex)
                    pattern += '/';
                pattern += token.value.replace(REGEX_CHARS_RE, '\\$&');
                subSegmentScore += 40 /* PathScore.Static */;
            }
            else if (token.type === 1 /* TokenType.Param */) {
                const { value, repeatable, optional, regexp } = token;
                keys.push({
                    name: value,
                    repeatable,
                    optional,
                });
                const re = regexp ? regexp : BASE_PARAM_PATTERN;
                // the user provided a custom regexp /:id(\\d+)
                if (re !== BASE_PARAM_PATTERN) {
                    subSegmentScore += 10 /* PathScore.BonusCustomRegExp */;
                    // make sure the regexp is valid before using it
                    try {
                        new RegExp(`(${re})`);
                    }
                    catch (err) {
                        throw new Error(`Invalid custom RegExp for param "${value}" (${re}): ` +
                            err.message);
                    }
                }
                // when we repeat we must take care of the repeating leading slash
                let subPattern = repeatable ? `((?:${re})(?:/(?:${re}))*)` : `(${re})`;
                // prepend the slash if we are starting a new segment
                if (!tokenIndex)
                    subPattern =
                        // avoid an optional / if there are more segments e.g. /:p?-static
                        // or /:p?-:p2
                        optional && segment.length < 2
                            ? `(?:/${subPattern})`
                            : '/' + subPattern;
                if (optional)
                    subPattern += '?';
                pattern += subPattern;
                subSegmentScore += 20 /* PathScore.Dynamic */;
                if (optional)
                    subSegmentScore += -8 /* PathScore.BonusOptional */;
                if (repeatable)
                    subSegmentScore += -20 /* PathScore.BonusRepeatable */;
                if (re === '.*')
                    subSegmentScore += -50 /* PathScore.BonusWildcard */;
            }
            segmentScores.push(subSegmentScore);
        }
        // an empty array like /home/ -> [[{home}], []]
        // if (!segment.length) pattern += '/'
        score.push(segmentScores);
    }
    // only apply the strict bonus to the last score
    if (options.strict && options.end) {
        const i = score.length - 1;
        score[i][score[i].length - 1] += 0.7000000000000001 /* PathScore.BonusStrict */;
    }
    // TODO: dev only warn double trailing slash
    if (!options.strict)
        pattern += '/?';
    if (options.end)
        pattern += '$';
    // allow paths like /dynamic to only match dynamic or dynamic/... but not dynamic_something_else
    else if (options.strict)
        pattern += '(?:/|$)';
    const re = new RegExp(pattern, options.sensitive ? '' : 'i');
    function parse(path) {
        const match = path.match(re);
        const params = {};
        if (!match)
            return null;
        for (let i = 1; i < match.length; i++) {
            const value = match[i] || '';
            const key = keys[i - 1];
            params[key.name] = value && key.repeatable ? value.split('/') : value;
        }
        return params;
    }
    function stringify(params) {
        let path = '';
        // for optional parameters to allow to be empty
        let avoidDuplicatedSlash = false;
        for (const segment of segments) {
            if (!avoidDuplicatedSlash || !path.endsWith('/'))
                path += '/';
            avoidDuplicatedSlash = false;
            for (const token of segment) {
                if (token.type === 0 /* TokenType.Static */) {
                    path += token.value;
                }
                else if (token.type === 1 /* TokenType.Param */) {
                    const { value, repeatable, optional } = token;
                    const param = value in params ? params[value] : '';
                    if (isArray(param) && !repeatable) {
                        throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
                    }
                    const text = isArray(param)
                        ? param.join('/')
                        : param;
                    if (!text) {
                        if (optional) {
                            // if we have more than one optional param like /:a?-static we don't need to care about the optional param
                            if (segment.length < 2) {
                                // remove the last slash as we could be at the end
                                if (path.endsWith('/'))
                                    path = path.slice(0, -1);
                                // do not append a slash on the next iteration
                                else
                                    avoidDuplicatedSlash = true;
                            }
                        }
                        else
                            throw new Error(`Missing required param "${value}"`);
                    }
                    path += text;
                }
            }
        }
        // avoid empty path when we have multiple optional params
        return path || '/';
    }
    return {
        re,
        score,
        keys,
        parse,
        stringify,
    };
}
/**
 * Compares an array of numbers as used in PathParser.score and returns a
 * number. This function can be used to `sort` an array
 *
 * @param a - first array of numbers
 * @param b - second array of numbers
 * @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
 * should be sorted first
 */
function compareScoreArray(a, b) {
    let i = 0;
    while (i < a.length && i < b.length) {
        const diff = b[i] - a[i];
        // only keep going if diff === 0
        if (diff)
            return diff;
        i++;
    }
    // if the last subsegment was Static, the shorter segments should be sorted first
    // otherwise sort the longest segment first
    if (a.length < b.length) {
        return a.length === 1 && a[0] === 40 /* PathScore.Static */ + 40 /* PathScore.Segment */
            ? -1
            : 1;
    }
    else if (a.length > b.length) {
        return b.length === 1 && b[0] === 40 /* PathScore.Static */ + 40 /* PathScore.Segment */
            ? 1
            : -1;
    }
    return 0;
}
/**
 * Compare function that can be used with `sort` to sort an array of PathParser
 *
 * @param a - first PathParser
 * @param b - second PathParser
 * @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
 */
function comparePathParserScore(a, b) {
    let i = 0;
    const aScore = a.score;
    const bScore = b.score;
    while (i < aScore.length && i < bScore.length) {
        const comp = compareScoreArray(aScore[i], bScore[i]);
        // do not return if both are equal
        if (comp)
            return comp;
        i++;
    }
    if (Math.abs(bScore.length - aScore.length) === 1) {
        if (isLastScoreNegative(aScore))
            return 1;
        if (isLastScoreNegative(bScore))
            return -1;
    }
    // if a and b share the same score entries but b has more, sort b first
    return bScore.length - aScore.length;
    // this is the ternary version
    // return aScore.length < bScore.length
    //   ? 1
    //   : aScore.length > bScore.length
    //   ? -1
    //   : 0
}
/**
 * This allows detecting splats at the end of a path: /home/:id(.*)*
 *
 * @param score - score to check
 * @returns true if the last entry is negative
 */
function isLastScoreNegative(score) {
    const last = score[score.length - 1];
    return score.length > 0 && last[last.length - 1] < 0;
}

const ROOT_TOKEN = {
    type: 0 /* TokenType.Static */,
    value: '',
};
const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
// After some profiling, the cache seems to be unnecessary because tokenizePath
// (the slowest part of adding a route) is very fast
// const tokenCache = new Map<string, Token[][]>()
function tokenizePath(path) {
    if (!path)
        return [[]];
    if (path === '/')
        return [[ROOT_TOKEN]];
    if (!path.startsWith('/')) {
        throw new Error(`Route paths should start with a "/": "${path}" should be "/${path}".`
            );
    }
    // if (tokenCache.has(path)) return tokenCache.get(path)!
    function crash(message) {
        throw new Error(`ERR (${state})/"${buffer}": ${message}`);
    }
    let state = 0 /* TokenizerState.Static */;
    let previousState = state;
    const tokens = [];
    // the segment will always be valid because we get into the initial state
    // with the leading /
    let segment;
    function finalizeSegment() {
        if (segment)
            tokens.push(segment);
        segment = [];
    }
    // index on the path
    let i = 0;
    // char at index
    let char;
    // buffer of the value read
    let buffer = '';
    // custom regexp for a param
    let customRe = '';
    function consumeBuffer() {
        if (!buffer)
            return;
        if (state === 0 /* TokenizerState.Static */) {
            segment.push({
                type: 0 /* TokenType.Static */,
                value: buffer,
            });
        }
        else if (state === 1 /* TokenizerState.Param */ ||
            state === 2 /* TokenizerState.ParamRegExp */ ||
            state === 3 /* TokenizerState.ParamRegExpEnd */) {
            if (segment.length > 1 && (char === '*' || char === '+'))
                crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
            segment.push({
                type: 1 /* TokenType.Param */,
                value: buffer,
                regexp: customRe,
                repeatable: char === '*' || char === '+',
                optional: char === '*' || char === '?',
            });
        }
        else {
            crash('Invalid state to consume buffer');
        }
        buffer = '';
    }
    function addCharToBuffer() {
        buffer += char;
    }
    while (i < path.length) {
        char = path[i++];
        if (char === '\\' && state !== 2 /* TokenizerState.ParamRegExp */) {
            previousState = state;
            state = 4 /* TokenizerState.EscapeNext */;
            continue;
        }
        switch (state) {
            case 0 /* TokenizerState.Static */:
                if (char === '/') {
                    if (buffer) {
                        consumeBuffer();
                    }
                    finalizeSegment();
                }
                else if (char === ':') {
                    consumeBuffer();
                    state = 1 /* TokenizerState.Param */;
                }
                else {
                    addCharToBuffer();
                }
                break;
            case 4 /* TokenizerState.EscapeNext */:
                addCharToBuffer();
                state = previousState;
                break;
            case 1 /* TokenizerState.Param */:
                if (char === '(') {
                    state = 2 /* TokenizerState.ParamRegExp */;
                }
                else if (VALID_PARAM_RE.test(char)) {
                    addCharToBuffer();
                }
                else {
                    consumeBuffer();
                    state = 0 /* TokenizerState.Static */;
                    // go back one character if we were not modifying
                    if (char !== '*' && char !== '?' && char !== '+')
                        i--;
                }
                break;
            case 2 /* TokenizerState.ParamRegExp */:
                // TODO: is it worth handling nested regexp? like :p(?:prefix_([^/]+)_suffix)
                // it already works by escaping the closing )
                // https://paths.esm.dev/?p=AAMeJbiAwQEcDKbAoAAkP60PG2R6QAvgNaA6AFACM2ABuQBB#
                // is this really something people need since you can also write
                // /prefix_:p()_suffix
                if (char === ')') {
                    // handle the escaped )
                    if (customRe[customRe.length - 1] == '\\')
                        customRe = customRe.slice(0, -1) + char;
                    else
                        state = 3 /* TokenizerState.ParamRegExpEnd */;
                }
                else {
                    customRe += char;
                }
                break;
            case 3 /* TokenizerState.ParamRegExpEnd */:
                // same as finalizing a param
                consumeBuffer();
                state = 0 /* TokenizerState.Static */;
                // go back one character if we were not modifying
                if (char !== '*' && char !== '?' && char !== '+')
                    i--;
                customRe = '';
                break;
            default:
                crash('Unknown state');
                break;
        }
    }
    if (state === 2 /* TokenizerState.ParamRegExp */)
        crash(`Unfinished custom RegExp for param "${buffer}"`);
    consumeBuffer();
    finalizeSegment();
    // tokenCache.set(path, tokens)
    return tokens;
}

function createRouteRecordMatcher(record, parent, options) {
    const parser = tokensToParser(tokenizePath(record.path), options);
    // warn against params with the same name
    {
        const existingKeys = new Set();
        for (const key of parser.keys) {
            if (existingKeys.has(key.name))
                warn(`Found duplicated params with name "${key.name}" for path "${record.path}". Only the last one will be available on "$route.params".`);
            existingKeys.add(key.name);
        }
    }
    const matcher = assign(parser, {
        record,
        parent,
        // these needs to be populated by the parent
        children: [],
        alias: [],
    });
    if (parent) {
        // both are aliases or both are not aliases
        // we don't want to mix them because the order is used when
        // passing originalRecord in Matcher.addRoute
        if (!matcher.record.aliasOf === !parent.record.aliasOf)
            parent.children.push(matcher);
    }
    return matcher;
}

/**
 * Creates a Router Matcher.
 *
 * @internal
 * @param routes - array of initial routes
 * @param globalOptions - global route options
 */
function createRouterMatcher(routes, globalOptions) {
    // normalized ordered array of matchers
    const matchers = [];
    const matcherMap = new Map();
    globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
    function getRecordMatcher(name) {
        return matcherMap.get(name);
    }
    function addRoute(record, parent, originalRecord) {
        // used later on to remove by name
        const isRootAdd = !originalRecord;
        const mainNormalizedRecord = normalizeRouteRecord(record);
        {
            checkChildMissingNameWithEmptyPath(mainNormalizedRecord, parent);
        }
        // we might be the child of an alias
        mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
        const options = mergeOptions(globalOptions, record);
        // generate an array of records to correctly handle aliases
        const normalizedRecords = [
            mainNormalizedRecord,
        ];
        if ('alias' in record) {
            const aliases = typeof record.alias === 'string' ? [record.alias] : record.alias;
            for (const alias of aliases) {
                normalizedRecords.push(assign({}, mainNormalizedRecord, {
                    // this allows us to hold a copy of the `components` option
                    // so that async components cache is hold on the original record
                    components: originalRecord
                        ? originalRecord.record.components
                        : mainNormalizedRecord.components,
                    path: alias,
                    // we might be the child of an alias
                    aliasOf: originalRecord
                        ? originalRecord.record
                        : mainNormalizedRecord,
                    // the aliases are always of the same kind as the original since they
                    // are defined on the same record
                }));
            }
        }
        let matcher;
        let originalMatcher;
        for (const normalizedRecord of normalizedRecords) {
            const { path } = normalizedRecord;
            // Build up the path for nested routes if the child isn't an absolute
            // route. Only add the / delimiter if the child path isn't empty and if the
            // parent path doesn't have a trailing slash
            if (parent && path[0] !== '/') {
                const parentPath = parent.record.path;
                const connectingSlash = parentPath[parentPath.length - 1] === '/' ? '' : '/';
                normalizedRecord.path =
                    parent.record.path + (path && connectingSlash + path);
            }
            if (normalizedRecord.path === '*') {
                throw new Error('Catch all routes ("*") must now be defined using a param with a custom regexp.\n' +
                    'See more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.');
            }
            // create the object beforehand, so it can be passed to children
            matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
            if (parent && path[0] === '/')
                checkMissingParamsInAbsolutePath(matcher, parent);
            // if we are an alias we must tell the original record that we exist,
            // so we can be removed
            if (originalRecord) {
                originalRecord.alias.push(matcher);
                {
                    checkSameParams(originalRecord, matcher);
                }
            }
            else {
                // otherwise, the first record is the original and others are aliases
                originalMatcher = originalMatcher || matcher;
                if (originalMatcher !== matcher)
                    originalMatcher.alias.push(matcher);
                // remove the route if named and only for the top record (avoid in nested calls)
                // this works because the original record is the first one
                if (isRootAdd && record.name && !isAliasRecord(matcher))
                    removeRoute(record.name);
            }
            if (mainNormalizedRecord.children) {
                const children = mainNormalizedRecord.children;
                for (let i = 0; i < children.length; i++) {
                    addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
                }
            }
            // if there was no original record, then the first one was not an alias and all
            // other aliases (if any) need to reference this record when adding children
            originalRecord = originalRecord || matcher;
            // TODO: add normalized records for more flexibility
            // if (parent && isAliasRecord(originalRecord)) {
            //   parent.children.push(originalRecord)
            // }
            insertMatcher(matcher);
        }
        return originalMatcher
            ? () => {
                // since other matchers are aliases, they should be removed by the original matcher
                removeRoute(originalMatcher);
            }
            : noop;
    }
    function removeRoute(matcherRef) {
        if (isRouteName(matcherRef)) {
            const matcher = matcherMap.get(matcherRef);
            if (matcher) {
                matcherMap.delete(matcherRef);
                matchers.splice(matchers.indexOf(matcher), 1);
                matcher.children.forEach(removeRoute);
                matcher.alias.forEach(removeRoute);
            }
        }
        else {
            const index = matchers.indexOf(matcherRef);
            if (index > -1) {
                matchers.splice(index, 1);
                if (matcherRef.record.name)
                    matcherMap.delete(matcherRef.record.name);
                matcherRef.children.forEach(removeRoute);
                matcherRef.alias.forEach(removeRoute);
            }
        }
    }
    function getRoutes() {
        return matchers;
    }
    function insertMatcher(matcher) {
        let i = 0;
        while (i < matchers.length &&
            comparePathParserScore(matcher, matchers[i]) >= 0 &&
            // Adding children with empty path should still appear before the parent
            // https://github.com/vuejs/router/issues/1124
            (matcher.record.path !== matchers[i].record.path ||
                !isRecordChildOf(matcher, matchers[i])))
            i++;
        matchers.splice(i, 0, matcher);
        // only add the original record to the name map
        if (matcher.record.name && !isAliasRecord(matcher))
            matcherMap.set(matcher.record.name, matcher);
    }
    function resolve(location, currentLocation) {
        let matcher;
        let params = {};
        let path;
        let name;
        if ('name' in location && location.name) {
            matcher = matcherMap.get(location.name);
            if (!matcher)
                throw createRouterError(1 /* ErrorTypes.MATCHER_NOT_FOUND */, {
                    location,
                });
            // warn if the user is passing invalid params so they can debug it better when they get removed
            {
                const invalidParams = Object.keys(location.params || {}).filter(paramName => !matcher.keys.find(k => k.name === paramName));
                if (invalidParams.length) {
                    warn(`Discarded invalid param(s) "${invalidParams.join('", "')}" when navigating. See https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22 for more details.`);
                }
            }
            name = matcher.record.name;
            params = assign(
            // paramsFromLocation is a new object
            paramsFromLocation(currentLocation.params, 
            // only keep params that exist in the resolved location
            // TODO: only keep optional params coming from a parent record
            matcher.keys.filter(k => !k.optional).map(k => k.name)), 
            // discard any existing params in the current location that do not exist here
            // #1497 this ensures better active/exact matching
            location.params &&
                paramsFromLocation(location.params, matcher.keys.map(k => k.name)));
            // throws if cannot be stringified
            path = matcher.stringify(params);
        }
        else if ('path' in location) {
            // no need to resolve the path with the matcher as it was provided
            // this also allows the user to control the encoding
            path = location.path;
            if (!path.startsWith('/')) {
                warn(`The Matcher cannot resolve relative paths but received "${path}". Unless you directly called \`matcher.resolve("${path}")\`, this is probably a bug in vue-router. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/router.`);
            }
            matcher = matchers.find(m => m.re.test(path));
            // matcher should have a value after the loop
            if (matcher) {
                // we know the matcher works because we tested the regexp
                params = matcher.parse(path);
                name = matcher.record.name;
            }
            // location is a relative path
        }
        else {
            // match by name or path of current route
            matcher = currentLocation.name
                ? matcherMap.get(currentLocation.name)
                : matchers.find(m => m.re.test(currentLocation.path));
            if (!matcher)
                throw createRouterError(1 /* ErrorTypes.MATCHER_NOT_FOUND */, {
                    location,
                    currentLocation,
                });
            name = matcher.record.name;
            // since we are navigating to the same location, we don't need to pick the
            // params like when `name` is provided
            params = assign({}, currentLocation.params, location.params);
            path = matcher.stringify(params);
        }
        const matched = [];
        let parentMatcher = matcher;
        while (parentMatcher) {
            // reversed order so parents are at the beginning
            matched.unshift(parentMatcher.record);
            parentMatcher = parentMatcher.parent;
        }
        return {
            name,
            path,
            params,
            matched,
            meta: mergeMetaFields(matched),
        };
    }
    // add initial routes
    routes.forEach(route => addRoute(route));
    return { addRoute, resolve, removeRoute, getRoutes, getRecordMatcher };
}
function paramsFromLocation(params, keys) {
    const newParams = {};
    for (const key of keys) {
        if (key in params)
            newParams[key] = params[key];
    }
    return newParams;
}
/**
 * Normalizes a RouteRecordRaw. Creates a copy
 *
 * @param record
 * @returns the normalized version
 */
function normalizeRouteRecord(record) {
    return {
        path: record.path,
        redirect: record.redirect,
        name: record.name,
        meta: record.meta || {},
        aliasOf: undefined,
        beforeEnter: record.beforeEnter,
        props: normalizeRecordProps(record),
        children: record.children || [],
        instances: {},
        leaveGuards: new Set(),
        updateGuards: new Set(),
        enterCallbacks: {},
        components: 'components' in record
            ? record.components || null
            : record.component && { default: record.component },
    };
}
/**
 * Normalize the optional `props` in a record to always be an object similar to
 * components. Also accept a boolean for components.
 * @param record
 */
function normalizeRecordProps(record) {
    const propsObject = {};
    // props does not exist on redirect records, but we can set false directly
    const props = record.props || false;
    if ('component' in record) {
        propsObject.default = props;
    }
    else {
        // NOTE: we could also allow a function to be applied to every component.
        // Would need user feedback for use cases
        for (const name in record.components)
            propsObject[name] = typeof props === 'boolean' ? props : props[name];
    }
    return propsObject;
}
/**
 * Checks if a record or any of its parent is an alias
 * @param record
 */
function isAliasRecord(record) {
    while (record) {
        if (record.record.aliasOf)
            return true;
        record = record.parent;
    }
    return false;
}
/**
 * Merge meta fields of an array of records
 *
 * @param matched - array of matched records
 */
function mergeMetaFields(matched) {
    return matched.reduce((meta, record) => assign(meta, record.meta), {});
}
function mergeOptions(defaults, partialOptions) {
    const options = {};
    for (const key in defaults) {
        options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
    }
    return options;
}
function isSameParam(a, b) {
    return (a.name === b.name &&
        a.optional === b.optional &&
        a.repeatable === b.repeatable);
}
/**
 * Check if a path and its alias have the same required params
 *
 * @param a - original record
 * @param b - alias record
 */
function checkSameParams(a, b) {
    for (const key of a.keys) {
        if (!key.optional && !b.keys.find(isSameParam.bind(null, key)))
            return warn(`Alias "${b.record.path}" and the original record: "${a.record.path}" must have the exact same param named "${key.name}"`);
    }
    for (const key of b.keys) {
        if (!key.optional && !a.keys.find(isSameParam.bind(null, key)))
            return warn(`Alias "${b.record.path}" and the original record: "${a.record.path}" must have the exact same param named "${key.name}"`);
    }
}
/**
 * A route with a name and a child with an empty path without a name should warn when adding the route
 *
 * @param mainNormalizedRecord - RouteRecordNormalized
 * @param parent - RouteRecordMatcher
 */
function checkChildMissingNameWithEmptyPath(mainNormalizedRecord, parent) {
    if (parent &&
        parent.record.name &&
        !mainNormalizedRecord.name &&
        !mainNormalizedRecord.path) {
        warn(`The route named "${String(parent.record.name)}" has a child without a name and an empty path. Using that name won't render the empty path child so you probably want to move the name to the child instead. If this is intentional, add a name to the child route to remove the warning.`);
    }
}
function checkMissingParamsInAbsolutePath(record, parent) {
    for (const key of parent.keys) {
        if (!record.keys.find(isSameParam.bind(null, key)))
            return warn(`Absolute path "${record.record.path}" must have the exact same param named "${key.name}" as its parent "${parent.record.path}".`);
    }
}
function isRecordChildOf(record, parent) {
    return parent.children.some(child => child === record || isRecordChildOf(record, child));
}

/**
 * Encoding Rules ␣ = Space Path: ␣ " < > # ? { } Query: ␣ " < > # & = Hash: ␣ "
 * < > `
 *
 * On top of that, the RFC3986 (https://tools.ietf.org/html/rfc3986#section-2.2)
 * defines some extra characters to be encoded. Most browsers do not encode them
 * in encodeURI https://github.com/whatwg/url/issues/369, so it may be safer to
 * also encode `!'()*`. Leaving un-encoded only ASCII alphanumeric(`a-zA-Z0-9`)
 * plus `-._~`. This extra safety should be applied to query by patching the
 * string returned by encodeURIComponent encodeURI also encodes `[\]^`. `\`
 * should be encoded to avoid ambiguity. Browsers (IE, FF, C) transform a `\`
 * into a `/` if directly typed in. The _backtick_ (`````) should also be
 * encoded everywhere because some browsers like FF encode it when directly
 * written while others don't. Safari and IE don't encode ``"<>{}``` in hash.
 */
// const EXTRA_RESERVED_RE = /[!'()*]/g
// const encodeReservedReplacer = (c: string) => '%' + c.charCodeAt(0).toString(16)
const HASH_RE = /#/g; // %23
const AMPERSAND_RE = /&/g; // %26
const SLASH_RE = /\//g; // %2F
const EQUAL_RE = /=/g; // %3D
const IM_RE = /\?/g; // %3F
const PLUS_RE = /\+/g; // %2B
/**
 * NOTE: It's not clear to me if we should encode the + symbol in queries, it
 * seems to be less flexible than not doing so and I can't find out the legacy
 * systems requiring this for regular requests like text/html. In the standard,
 * the encoding of the plus character is only mentioned for
 * application/x-www-form-urlencoded
 * (https://url.spec.whatwg.org/#urlencoded-parsing) and most browsers seems lo
 * leave the plus character as is in queries. To be more flexible, we allow the
 * plus character on the query, but it can also be manually encoded by the user.
 *
 * Resources:
 * - https://url.spec.whatwg.org/#urlencoded-parsing
 * - https://stackoverflow.com/questions/1634271/url-encoding-the-space-character-or-20
 */
const ENC_BRACKET_OPEN_RE = /%5B/g; // [
const ENC_BRACKET_CLOSE_RE = /%5D/g; // ]
const ENC_CARET_RE = /%5E/g; // ^
const ENC_BACKTICK_RE = /%60/g; // `
const ENC_CURLY_OPEN_RE = /%7B/g; // {
const ENC_PIPE_RE = /%7C/g; // |
const ENC_CURLY_CLOSE_RE = /%7D/g; // }
const ENC_SPACE_RE = /%20/g; // }
/**
 * Encode characters that need to be encoded on the path, search and hash
 * sections of the URL.
 *
 * @internal
 * @param text - string to encode
 * @returns encoded string
 */
function commonEncode(text) {
    return encodeURI('' + text)
        .replace(ENC_PIPE_RE, '|')
        .replace(ENC_BRACKET_OPEN_RE, '[')
        .replace(ENC_BRACKET_CLOSE_RE, ']');
}
/**
 * Encode characters that need to be encoded on the hash section of the URL.
 *
 * @param text - string to encode
 * @returns encoded string
 */
function encodeHash(text) {
    return commonEncode(text)
        .replace(ENC_CURLY_OPEN_RE, '{')
        .replace(ENC_CURLY_CLOSE_RE, '}')
        .replace(ENC_CARET_RE, '^');
}
/**
 * Encode characters that need to be encoded query values on the query
 * section of the URL.
 *
 * @param text - string to encode
 * @returns encoded string
 */
function encodeQueryValue(text) {
    return (commonEncode(text)
        // Encode the space as +, encode the + to differentiate it from the space
        .replace(PLUS_RE, '%2B')
        .replace(ENC_SPACE_RE, '+')
        .replace(HASH_RE, '%23')
        .replace(AMPERSAND_RE, '%26')
        .replace(ENC_BACKTICK_RE, '`')
        .replace(ENC_CURLY_OPEN_RE, '{')
        .replace(ENC_CURLY_CLOSE_RE, '}')
        .replace(ENC_CARET_RE, '^'));
}
/**
 * Like `encodeQueryValue` but also encodes the `=` character.
 *
 * @param text - string to encode
 */
function encodeQueryKey(text) {
    return encodeQueryValue(text).replace(EQUAL_RE, '%3D');
}
/**
 * Encode characters that need to be encoded on the path section of the URL.
 *
 * @param text - string to encode
 * @returns encoded string
 */
function encodePath(text) {
    return commonEncode(text).replace(HASH_RE, '%23').replace(IM_RE, '%3F');
}
/**
 * Encode characters that need to be encoded on the path section of the URL as a
 * param. This function encodes everything {@link encodePath} does plus the
 * slash (`/`) character. If `text` is `null` or `undefined`, returns an empty
 * string instead.
 *
 * @param text - string to encode
 * @returns encoded string
 */
function encodeParam(text) {
    return text == null ? '' : encodePath(text).replace(SLASH_RE, '%2F');
}
/**
 * Decode text using `decodeURIComponent`. Returns the original text if it
 * fails.
 *
 * @param text - string to decode
 * @returns decoded string
 */
function decode(text) {
    try {
        return decodeURIComponent('' + text);
    }
    catch (err) {
        warn(`Error decoding "${text}". Using original value`);
    }
    return '' + text;
}

/**
 * Transforms a queryString into a {@link LocationQuery} object. Accept both, a
 * version with the leading `?` and without Should work as URLSearchParams

 * @internal
 *
 * @param search - search string to parse
 * @returns a query object
 */
function parseQuery(search) {
    const query = {};
    // avoid creating an object with an empty key and empty value
    // because of split('&')
    if (search === '' || search === '?')
        return query;
    const hasLeadingIM = search[0] === '?';
    const searchParams = (hasLeadingIM ? search.slice(1) : search).split('&');
    for (let i = 0; i < searchParams.length; ++i) {
        // pre decode the + into space
        const searchParam = searchParams[i].replace(PLUS_RE, ' ');
        // allow the = character
        const eqPos = searchParam.indexOf('=');
        const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
        const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
        if (key in query) {
            // an extra variable for ts types
            let currentValue = query[key];
            if (!isArray(currentValue)) {
                currentValue = query[key] = [currentValue];
            }
            currentValue.push(value);
        }
        else {
            query[key] = value;
        }
    }
    return query;
}
/**
 * Stringifies a {@link LocationQueryRaw} object. Like `URLSearchParams`, it
 * doesn't prepend a `?`
 *
 * @internal
 *
 * @param query - query object to stringify
 * @returns string version of the query without the leading `?`
 */
function stringifyQuery(query) {
    let search = '';
    for (let key in query) {
        const value = query[key];
        key = encodeQueryKey(key);
        if (value == null) {
            // only null adds the value
            if (value !== undefined) {
                search += (search.length ? '&' : '') + key;
            }
            continue;
        }
        // keep null values
        const values = isArray(value)
            ? value.map(v => v && encodeQueryValue(v))
            : [value && encodeQueryValue(value)];
        values.forEach(value => {
            // skip undefined values in arrays as if they were not present
            // smaller code than using filter
            if (value !== undefined) {
                // only append & with non-empty search
                search += (search.length ? '&' : '') + key;
                if (value != null)
                    search += '=' + value;
            }
        });
    }
    return search;
}
/**
 * Transforms a {@link LocationQueryRaw} into a {@link LocationQuery} by casting
 * numbers into strings, removing keys with an undefined value and replacing
 * undefined with null in arrays
 *
 * @param query - query object to normalize
 * @returns a normalized query object
 */
function normalizeQuery(query) {
    const normalizedQuery = {};
    for (const key in query) {
        const value = query[key];
        if (value !== undefined) {
            normalizedQuery[key] = isArray(value)
                ? value.map(v => (v == null ? null : '' + v))
                : value == null
                    ? value
                    : '' + value;
        }
    }
    return normalizedQuery;
}

/**
 * RouteRecord being rendered by the closest ancestor Router View. Used for
 * `onBeforeRouteUpdate` and `onBeforeRouteLeave`. rvlm stands for Router View
 * Location Matched
 *
 * @internal
 */
const matchedRouteKey = Symbol('router view location matched' );
/**
 * Allows overriding the router view depth to control which component in
 * `matched` is rendered. rvd stands for Router View Depth
 *
 * @internal
 */
const viewDepthKey = Symbol('router view depth' );
/**
 * Allows overriding the router instance returned by `useRouter` in tests. r
 * stands for router
 *
 * @internal
 */
const routerKey = Symbol('router' );
/**
 * Allows overriding the current route returned by `useRoute` in tests. rl
 * stands for route location
 *
 * @internal
 */
const routeLocationKey = Symbol('route location' );
/**
 * Allows overriding the current route used by router-view. Internally this is
 * used when the `route` prop is passed.
 *
 * @internal
 */
const routerViewLocationKey = Symbol('router view location' );

/**
 * Create a list of callbacks that can be reset. Used to create before and after navigation guards list
 */
function useCallbacks() {
    let handlers = [];
    function add(handler) {
        handlers.push(handler);
        return () => {
            const i = handlers.indexOf(handler);
            if (i > -1)
                handlers.splice(i, 1);
        };
    }
    function reset() {
        handlers = [];
    }
    return {
        add,
        list: () => handlers,
        reset,
    };
}
function guardToPromiseFn(guard, to, from, record, name) {
    // keep a reference to the enterCallbackArray to prevent pushing callbacks if a new navigation took place
    const enterCallbackArray = record &&
        // name is defined if record is because of the function overload
        (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
    return () => new Promise((resolve, reject) => {
        const next = (valid) => {
            if (valid === false) {
                reject(createRouterError(4 /* ErrorTypes.NAVIGATION_ABORTED */, {
                    from,
                    to,
                }));
            }
            else if (valid instanceof Error) {
                reject(valid);
            }
            else if (isRouteLocation(valid)) {
                reject(createRouterError(2 /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */, {
                    from: to,
                    to: valid,
                }));
            }
            else {
                if (enterCallbackArray &&
                    // since enterCallbackArray is truthy, both record and name also are
                    record.enterCallbacks[name] === enterCallbackArray &&
                    typeof valid === 'function') {
                    enterCallbackArray.push(valid);
                }
                resolve();
            }
        };
        // wrapping with Promise.resolve allows it to work with both async and sync guards
        const guardReturn = guard.call(record && record.instances[name], to, from, canOnlyBeCalledOnce(next, to, from) );
        let guardCall = Promise.resolve(guardReturn);
        if (guard.length < 3)
            guardCall = guardCall.then(next);
        if (guard.length > 2) {
            const message = `The "next" callback was never called inside of ${guard.name ? '"' + guard.name + '"' : ''}:\n${guard.toString()}\n. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`;
            if (typeof guardReturn === 'object' && 'then' in guardReturn) {
                guardCall = guardCall.then(resolvedValue => {
                    // @ts-expect-error: _called is added at canOnlyBeCalledOnce
                    if (!next._called) {
                        warn(message);
                        return Promise.reject(new Error('Invalid navigation guard'));
                    }
                    return resolvedValue;
                });
            }
            else if (guardReturn !== undefined) {
                // @ts-expect-error: _called is added at canOnlyBeCalledOnce
                if (!next._called) {
                    warn(message);
                    reject(new Error('Invalid navigation guard'));
                    return;
                }
            }
        }
        guardCall.catch(err => reject(err));
    });
}
function canOnlyBeCalledOnce(next, to, from) {
    let called = 0;
    return function () {
        if (called++ === 1)
            warn(`The "next" callback was called more than once in one navigation guard when going from "${from.fullPath}" to "${to.fullPath}". It should be called exactly one time in each navigation guard. This will fail in production.`);
        // @ts-expect-error: we put it in the original one because it's easier to check
        next._called = true;
        if (called === 1)
            next.apply(null, arguments);
    };
}
function extractComponentsGuards(matched, guardType, to, from) {
    const guards = [];
    for (const record of matched) {
        if (!record.components && !record.children.length) {
            warn(`Record with path "${record.path}" is either missing a "component(s)"` +
                ` or "children" property.`);
        }
        for (const name in record.components) {
            let rawComponent = record.components[name];
            {
                if (!rawComponent ||
                    (typeof rawComponent !== 'object' &&
                        typeof rawComponent !== 'function')) {
                    warn(`Component "${name}" in record with path "${record.path}" is not` +
                        ` a valid component. Received "${String(rawComponent)}".`);
                    // throw to ensure we stop here but warn to ensure the message isn't
                    // missed by the user
                    throw new Error('Invalid route component');
                }
                else if ('then' in rawComponent) {
                    // warn if user wrote import('/component.vue') instead of () =>
                    // import('./component.vue')
                    warn(`Component "${name}" in record with path "${record.path}" is a ` +
                        `Promise instead of a function that returns a Promise. Did you ` +
                        `write "import('./MyPage.vue')" instead of ` +
                        `"() => import('./MyPage.vue')" ? This will break in ` +
                        `production if not fixed.`);
                    const promise = rawComponent;
                    rawComponent = () => promise;
                }
                else if (rawComponent.__asyncLoader &&
                    // warn only once per component
                    !rawComponent.__warnedDefineAsync) {
                    rawComponent.__warnedDefineAsync = true;
                    warn(`Component "${name}" in record with path "${record.path}" is defined ` +
                        `using "defineAsyncComponent()". ` +
                        `Write "() => import('./MyPage.vue')" instead of ` +
                        `"defineAsyncComponent(() => import('./MyPage.vue'))".`);
                }
            }
            // skip update and leave guards if the route component is not mounted
            if (guardType !== 'beforeRouteEnter' && !record.instances[name])
                continue;
            if (isRouteComponent(rawComponent)) {
                // __vccOpts is added by vue-class-component and contain the regular options
                const options = rawComponent.__vccOpts || rawComponent;
                const guard = options[guardType];
                guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
            }
            else {
                // start requesting the chunk already
                let componentPromise = rawComponent();
                if (!('catch' in componentPromise)) {
                    warn(`Component "${name}" in record with path "${record.path}" is a function that does not return a Promise. If you were passing a functional component, make sure to add a "displayName" to the component. This will break in production if not fixed.`);
                    componentPromise = Promise.resolve(componentPromise);
                }
                guards.push(() => componentPromise.then(resolved => {
                    if (!resolved)
                        return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
                    const resolvedComponent = isESModule(resolved)
                        ? resolved.default
                        : resolved;
                    // replace the function with the resolved component
                    // cannot be null or undefined because we went into the for loop
                    record.components[name] = resolvedComponent;
                    // __vccOpts is added by vue-class-component and contain the regular options
                    const options = resolvedComponent.__vccOpts || resolvedComponent;
                    const guard = options[guardType];
                    return guard && guardToPromiseFn(guard, to, from, record, name)();
                }));
            }
        }
    }
    return guards;
}
/**
 * Allows differentiating lazy components from functional components and vue-class-component
 * @internal
 *
 * @param component
 */
function isRouteComponent(component) {
    return (typeof component === 'object' ||
        'displayName' in component ||
        'props' in component ||
        '__vccOpts' in component);
}

// TODO: we could allow currentRoute as a prop to expose `isActive` and
// `isExactActive` behavior should go through an RFC
function useLink(props) {
    const router = Un(routerKey);
    const currentRoute = Un(routeLocationKey);
    const route = Rs(() => router.resolve(Rt(props.to)));
    const activeRecordIndex = Rs(() => {
        const { matched } = route.value;
        const { length } = matched;
        const routeMatched = matched[length - 1];
        const currentMatched = currentRoute.matched;
        if (!routeMatched || !currentMatched.length)
            return -1;
        const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
        if (index > -1)
            return index;
        // possible parent record
        const parentRecordPath = getOriginalPath(matched[length - 2]);
        return (
        // we are dealing with nested routes
        length > 1 &&
            // if the parent and matched route have the same path, this link is
            // referring to the empty child. Or we currently are on a different
            // child of the same parent
            getOriginalPath(routeMatched) === parentRecordPath &&
            // avoid comparing the child with its parent
            currentMatched[currentMatched.length - 1].path !== parentRecordPath
            ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2]))
            : index);
    });
    const isActive = Rs(() => activeRecordIndex.value > -1 &&
        includesParams(currentRoute.params, route.value.params));
    const isExactActive = Rs(() => activeRecordIndex.value > -1 &&
        activeRecordIndex.value === currentRoute.matched.length - 1 &&
        isSameRouteLocationParams(currentRoute.params, route.value.params));
    function navigate(e = {}) {
        if (guardEvent(e)) {
            return router[Rt(props.replace) ? 'replace' : 'push'](Rt(props.to)
            // avoid uncaught errors are they are logged anyway
            ).catch(noop);
        }
        return Promise.resolve();
    }
    // devtools only
    if (isBrowser) {
        const instance = gs();
        if (instance) {
            const linkContextDevtools = {
                route: route.value,
                isActive: isActive.value,
                isExactActive: isExactActive.value,
            };
            // @ts-expect-error: this is internal
            instance.__vrl_devtools = instance.__vrl_devtools || [];
            // @ts-expect-error: this is internal
            instance.__vrl_devtools.push(linkContextDevtools);
            Dn(() => {
                linkContextDevtools.route = route.value;
                linkContextDevtools.isActive = isActive.value;
                linkContextDevtools.isExactActive = isExactActive.value;
            }, { flush: 'post' });
        }
    }
    return {
        route,
        href: Rs(() => route.value.href),
        isActive,
        isExactActive,
        navigate,
    };
}
const RouterLinkImpl = /*#__PURE__*/ io({
    name: 'RouterLink',
    compatConfig: { MODE: 3 },
    props: {
        to: {
            type: [String, Object],
            required: true,
        },
        replace: Boolean,
        activeClass: String,
        // inactiveClass: String,
        exactActiveClass: String,
        custom: Boolean,
        ariaCurrentValue: {
            type: String,
            default: 'page',
        },
    },
    useLink,
    setup(props, { slots }) {
        const link = pt(useLink(props));
        const { options } = Un(routerKey);
        const elClass = Rs(() => ({
            [getLinkClass(props.activeClass, options.linkActiveClass, 'router-link-active')]: link.isActive,
            // [getLinkClass(
            //   props.inactiveClass,
            //   options.linkInactiveClass,
            //   'router-link-inactive'
            // )]: !link.isExactActive,
            [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, 'router-link-exact-active')]: link.isExactActive,
        }));
        return () => {
            const children = slots.default && slots.default(link);
            return props.custom
                ? children
                : Ws('a', {
                    'aria-current': link.isExactActive
                        ? props.ariaCurrentValue
                        : null,
                    href: link.href,
                    // this would override user added attrs but Vue will still add
                    // the listener, so we end up triggering both
                    onClick: link.navigate,
                    class: elClass.value,
                }, children);
        };
    },
});
// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
/**
 * Component to render a link that triggers a navigation on click.
 */
const RouterLink = RouterLinkImpl;
function guardEvent(e) {
    // don't redirect with control keys
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
        return;
    // don't redirect when preventDefault called
    if (e.defaultPrevented)
        return;
    // don't redirect on right click
    if (e.button !== undefined && e.button !== 0)
        return;
    // don't redirect if `target="_blank"`
    // @ts-expect-error getAttribute does exist
    if (e.currentTarget && e.currentTarget.getAttribute) {
        // @ts-expect-error getAttribute exists
        const target = e.currentTarget.getAttribute('target');
        if (/\b_blank\b/i.test(target))
            return;
    }
    // this may be a Weex event which doesn't have this method
    if (e.preventDefault)
        e.preventDefault();
    return true;
}
function includesParams(outer, inner) {
    for (const key in inner) {
        const innerValue = inner[key];
        const outerValue = outer[key];
        if (typeof innerValue === 'string') {
            if (innerValue !== outerValue)
                return false;
        }
        else {
            if (!isArray(outerValue) ||
                outerValue.length !== innerValue.length ||
                innerValue.some((value, i) => value !== outerValue[i]))
                return false;
        }
    }
    return true;
}
/**
 * Get the original path value of a record by following its aliasOf
 * @param record
 */
function getOriginalPath(record) {
    return record ? (record.aliasOf ? record.aliasOf.path : record.path) : '';
}
/**
 * Utility class to get the active class based on defaults.
 * @param propClass
 * @param globalClass
 * @param defaultClass
 */
const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null
    ? propClass
    : globalClass != null
        ? globalClass
        : defaultClass;

const RouterViewImpl = /*#__PURE__*/ io({
    name: 'RouterView',
    // #674 we manually inherit them
    inheritAttrs: false,
    props: {
        name: {
            type: String,
            default: 'default',
        },
        route: Object,
    },
    // Better compat for @vue/compat users
    // https://github.com/vuejs/router/issues/1315
    compatConfig: { MODE: 3 },
    setup(props, { attrs, slots }) {
        warnDeprecatedUsage();
        const injectedRoute = Un(routerViewLocationKey);
        const routeToDisplay = Rs(() => props.route || injectedRoute.value);
        const injectedDepth = Un(viewDepthKey, 0);
        // The depth changes based on empty components option, which allows passthrough routes e.g. routes with children
        // that are used to reuse the `path` property
        const depth = Rs(() => {
            let initialDepth = Rt(injectedDepth);
            const { matched } = routeToDisplay.value;
            let matchedRoute;
            while ((matchedRoute = matched[initialDepth]) &&
                !matchedRoute.components) {
                initialDepth++;
            }
            return initialDepth;
        });
        const matchedRouteRef = Rs(() => routeToDisplay.value.matched[depth.value]);
        jn(viewDepthKey, Rs(() => depth.value + 1));
        jn(matchedRouteKey, matchedRouteRef);
        jn(routerViewLocationKey, routeToDisplay);
        const viewRef = Ft();
        // watch at the same time the component instance, the route record we are
        // rendering, and the name
        Kn(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
            // copy reused instances
            if (to) {
                // this will update the instance for new instances as well as reused
                // instances when navigating to a new route
                to.instances[name] = instance;
                // the component instance is reused for a different route or name, so
                // we copy any saved update or leave guards. With async setup, the
                // mounting component will mount before the matchedRoute changes,
                // making instance === oldInstance, so we check if guards have been
                // added before. This works because we remove guards when
                // unmounting/deactivating components
                if (from && from !== to && instance && instance === oldInstance) {
                    if (!to.leaveGuards.size) {
                        to.leaveGuards = from.leaveGuards;
                    }
                    if (!to.updateGuards.size) {
                        to.updateGuards = from.updateGuards;
                    }
                }
            }
            // trigger beforeRouteEnter next callbacks
            if (instance &&
                to &&
                // if there is no instance but to and from are the same this might be
                // the first visit
                (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
                (to.enterCallbacks[name] || []).forEach(callback => callback(instance));
            }
        }, { flush: 'post' });
        return () => {
            const route = routeToDisplay.value;
            // we need the value at the time we render because when we unmount, we
            // navigated to a different location so the value is different
            const currentName = props.name;
            const matchedRoute = matchedRouteRef.value;
            const ViewComponent = matchedRoute && matchedRoute.components[currentName];
            if (!ViewComponent) {
                return normalizeSlot(slots.default, { Component: ViewComponent, route });
            }
            // props from route configuration
            const routePropsOption = matchedRoute.props[currentName];
            const routeProps = routePropsOption
                ? routePropsOption === true
                    ? route.params
                    : typeof routePropsOption === 'function'
                        ? routePropsOption(route)
                        : routePropsOption
                : null;
            const onVnodeUnmounted = vnode => {
                // remove the instance reference to prevent leak
                if (vnode.component.isUnmounted) {
                    matchedRoute.instances[currentName] = null;
                }
            };
            const component = Ws(ViewComponent, assign({}, routeProps, attrs, {
                onVnodeUnmounted,
                ref: viewRef,
            }));
            if (isBrowser &&
                component.ref) {
                // TODO: can display if it's an alias, its props
                const info = {
                    depth: depth.value,
                    name: matchedRoute.name,
                    path: matchedRoute.path,
                    meta: matchedRoute.meta,
                };
                const internalInstances = isArray(component.ref)
                    ? component.ref.map(r => r.i)
                    : [component.ref.i];
                internalInstances.forEach(instance => {
                    // @ts-expect-error
                    instance.__vrv_devtools = info;
                });
            }
            return (
            // pass the vnode to the slot as a prop.
            // h and <component :is="..."> both accept vnodes
            normalizeSlot(slots.default, { Component: component, route }) ||
                component);
        };
    },
});
function normalizeSlot(slot, data) {
    if (!slot)
        return null;
    const slotContent = slot(data);
    return slotContent.length === 1 ? slotContent[0] : slotContent;
}
// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
/**
 * Component to display the current route the user is at.
 */
const RouterView = RouterViewImpl;
// warn against deprecated usage with <transition> & <keep-alive>
// due to functional component being no longer eager in Vue 3
function warnDeprecatedUsage() {
    const instance = gs();
    const parentName = instance.parent && instance.parent.type.name;
    if (parentName &&
        (parentName === 'KeepAlive' || parentName.includes('Transition'))) {
        const comp = parentName === 'KeepAlive' ? 'keep-alive' : 'transition';
        warn(`<router-view> can no longer be used directly inside <transition> or <keep-alive>.\n` +
            `Use slot props instead:\n\n` +
            `<router-view v-slot="{ Component }">\n` +
            `  <${comp}>\n` +
            `    <component :is="Component" />\n` +
            `  </${comp}>\n` +
            `</router-view>`);
    }
}

/**
 * Copies a route location and removes any problematic properties that cannot be shown in devtools (e.g. Vue instances).
 *
 * @param routeLocation - routeLocation to format
 * @param tooltip - optional tooltip
 * @returns a copy of the routeLocation
 */
function formatRouteLocation(routeLocation, tooltip) {
    const copy = assign({}, routeLocation, {
        // remove variables that can contain vue instances
        matched: routeLocation.matched.map(matched => omit(matched, ['instances', 'children', 'aliasOf'])),
    });
    return {
        _custom: {
            type: null,
            readOnly: true,
            display: routeLocation.fullPath,
            tooltip,
            value: copy,
        },
    };
}
function formatDisplay(display) {
    return {
        _custom: {
            display,
        },
    };
}
// to support multiple router instances
let routerId = 0;
function addDevtools(app, router, matcher) {
    // Take over router.beforeEach and afterEach
    // make sure we are not registering the devtool twice
    if (router.__hasDevtools)
        return;
    router.__hasDevtools = true;
    // increment to support multiple router instances
    const id = routerId++;
    setupDevtoolsPlugin({
        id: 'org.vuejs.router' + (id ? '.' + id : ''),
        label: 'Vue Router',
        packageName: 'vue-router',
        homepage: 'https://router.vuejs.org',
        logo: 'https://router.vuejs.org/logo.png',
        componentStateTypes: ['Routing'],
        app,
    }, api => {
        if (typeof api.now !== 'function') {
            console.warn('[Vue Router]: You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.');
        }
        // display state added by the router
        api.on.inspectComponent((payload, ctx) => {
            if (payload.instanceData) {
                payload.instanceData.state.push({
                    type: 'Routing',
                    key: '$route',
                    editable: false,
                    value: formatRouteLocation(router.currentRoute.value, 'Current Route'),
                });
            }
        });
        // mark router-link as active and display tags on router views
        api.on.visitComponentTree(({ treeNode: node, componentInstance }) => {
            if (componentInstance.__vrv_devtools) {
                const info = componentInstance.__vrv_devtools;
                node.tags.push({
                    label: (info.name ? `${info.name.toString()}: ` : '') + info.path,
                    textColor: 0,
                    tooltip: 'This component is rendered by &lt;router-view&gt;',
                    backgroundColor: PINK_500,
                });
            }
            // if multiple useLink are used
            if (isArray(componentInstance.__vrl_devtools)) {
                componentInstance.__devtoolsApi = api;
                componentInstance.__vrl_devtools.forEach(devtoolsData => {
                    let backgroundColor = ORANGE_400;
                    let tooltip = '';
                    if (devtoolsData.isExactActive) {
                        backgroundColor = LIME_500;
                        tooltip = 'This is exactly active';
                    }
                    else if (devtoolsData.isActive) {
                        backgroundColor = BLUE_600;
                        tooltip = 'This link is active';
                    }
                    node.tags.push({
                        label: devtoolsData.route.path,
                        textColor: 0,
                        tooltip,
                        backgroundColor,
                    });
                });
            }
        });
        Kn(router.currentRoute, () => {
            // refresh active state
            refreshRoutesView();
            api.notifyComponentUpdate();
            api.sendInspectorTree(routerInspectorId);
            api.sendInspectorState(routerInspectorId);
        });
        const navigationsLayerId = 'router:navigations:' + id;
        api.addTimelineLayer({
            id: navigationsLayerId,
            label: `Router${id ? ' ' + id : ''} Navigations`,
            color: 0x40a8c4,
        });
        // const errorsLayerId = 'router:errors'
        // api.addTimelineLayer({
        //   id: errorsLayerId,
        //   label: 'Router Errors',
        //   color: 0xea5455,
        // })
        router.onError((error, to) => {
            api.addTimelineEvent({
                layerId: navigationsLayerId,
                event: {
                    title: 'Error during Navigation',
                    subtitle: to.fullPath,
                    logType: 'error',
                    time: api.now(),
                    data: { error },
                    groupId: to.meta.__navigationId,
                },
            });
        });
        // attached to `meta` and used to group events
        let navigationId = 0;
        router.beforeEach((to, from) => {
            const data = {
                guard: formatDisplay('beforeEach'),
                from: formatRouteLocation(from, 'Current Location during this navigation'),
                to: formatRouteLocation(to, 'Target location'),
            };
            // Used to group navigations together, hide from devtools
            Object.defineProperty(to.meta, '__navigationId', {
                value: navigationId++,
            });
            api.addTimelineEvent({
                layerId: navigationsLayerId,
                event: {
                    time: api.now(),
                    title: 'Start of navigation',
                    subtitle: to.fullPath,
                    data,
                    groupId: to.meta.__navigationId,
                },
            });
        });
        router.afterEach((to, from, failure) => {
            const data = {
                guard: formatDisplay('afterEach'),
            };
            if (failure) {
                data.failure = {
                    _custom: {
                        type: Error,
                        readOnly: true,
                        display: failure ? failure.message : '',
                        tooltip: 'Navigation Failure',
                        value: failure,
                    },
                };
                data.status = formatDisplay('❌');
            }
            else {
                data.status = formatDisplay('✅');
            }
            // we set here to have the right order
            data.from = formatRouteLocation(from, 'Current Location during this navigation');
            data.to = formatRouteLocation(to, 'Target location');
            api.addTimelineEvent({
                layerId: navigationsLayerId,
                event: {
                    title: 'End of navigation',
                    subtitle: to.fullPath,
                    time: api.now(),
                    data,
                    logType: failure ? 'warning' : 'default',
                    groupId: to.meta.__navigationId,
                },
            });
        });
        /**
         * Inspector of Existing routes
         */
        const routerInspectorId = 'router-inspector:' + id;
        api.addInspector({
            id: routerInspectorId,
            label: 'Routes' + (id ? ' ' + id : ''),
            icon: 'book',
            treeFilterPlaceholder: 'Search routes',
        });
        function refreshRoutesView() {
            // the routes view isn't active
            if (!activeRoutesPayload)
                return;
            const payload = activeRoutesPayload;
            // children routes will appear as nested
            let routes = matcher.getRoutes().filter(route => !route.parent);
            // reset match state to false
            routes.forEach(resetMatchStateOnRouteRecord);
            // apply a match state if there is a payload
            if (payload.filter) {
                routes = routes.filter(route => 
                // save matches state based on the payload
                isRouteMatching(route, payload.filter.toLowerCase()));
            }
            // mark active routes
            routes.forEach(route => markRouteRecordActive(route, router.currentRoute.value));
            payload.rootNodes = routes.map(formatRouteRecordForInspector);
        }
        let activeRoutesPayload;
        api.on.getInspectorTree(payload => {
            activeRoutesPayload = payload;
            if (payload.app === app && payload.inspectorId === routerInspectorId) {
                refreshRoutesView();
            }
        });
        /**
         * Display information about the currently selected route record
         */
        api.on.getInspectorState(payload => {
            if (payload.app === app && payload.inspectorId === routerInspectorId) {
                const routes = matcher.getRoutes();
                const route = routes.find(route => route.record.__vd_id === payload.nodeId);
                if (route) {
                    payload.state = {
                        options: formatRouteRecordMatcherForStateInspector(route),
                    };
                }
            }
        });
        api.sendInspectorTree(routerInspectorId);
        api.sendInspectorState(routerInspectorId);
    });
}
function modifierForKey(key) {
    if (key.optional) {
        return key.repeatable ? '*' : '?';
    }
    else {
        return key.repeatable ? '+' : '';
    }
}
function formatRouteRecordMatcherForStateInspector(route) {
    const { record } = route;
    const fields = [
        { editable: false, key: 'path', value: record.path },
    ];
    if (record.name != null) {
        fields.push({
            editable: false,
            key: 'name',
            value: record.name,
        });
    }
    fields.push({ editable: false, key: 'regexp', value: route.re });
    if (route.keys.length) {
        fields.push({
            editable: false,
            key: 'keys',
            value: {
                _custom: {
                    type: null,
                    readOnly: true,
                    display: route.keys
                        .map(key => `${key.name}${modifierForKey(key)}`)
                        .join(' '),
                    tooltip: 'Param keys',
                    value: route.keys,
                },
            },
        });
    }
    if (record.redirect != null) {
        fields.push({
            editable: false,
            key: 'redirect',
            value: record.redirect,
        });
    }
    if (route.alias.length) {
        fields.push({
            editable: false,
            key: 'aliases',
            value: route.alias.map(alias => alias.record.path),
        });
    }
    if (Object.keys(route.record.meta).length) {
        fields.push({
            editable: false,
            key: 'meta',
            value: route.record.meta,
        });
    }
    fields.push({
        key: 'score',
        editable: false,
        value: {
            _custom: {
                type: null,
                readOnly: true,
                display: route.score.map(score => score.join(', ')).join(' | '),
                tooltip: 'Score used to sort routes',
                value: route.score,
            },
        },
    });
    return fields;
}
/**
 * Extracted from tailwind palette
 */
const PINK_500 = 0xec4899;
const BLUE_600 = 0x2563eb;
const LIME_500 = 0x84cc16;
const CYAN_400 = 0x22d3ee;
const ORANGE_400 = 0xfb923c;
// const GRAY_100 = 0xf4f4f5
const DARK = 0x666666;
function formatRouteRecordForInspector(route) {
    const tags = [];
    const { record } = route;
    if (record.name != null) {
        tags.push({
            label: String(record.name),
            textColor: 0,
            backgroundColor: CYAN_400,
        });
    }
    if (record.aliasOf) {
        tags.push({
            label: 'alias',
            textColor: 0,
            backgroundColor: ORANGE_400,
        });
    }
    if (route.__vd_match) {
        tags.push({
            label: 'matches',
            textColor: 0,
            backgroundColor: PINK_500,
        });
    }
    if (route.__vd_exactActive) {
        tags.push({
            label: 'exact',
            textColor: 0,
            backgroundColor: LIME_500,
        });
    }
    if (route.__vd_active) {
        tags.push({
            label: 'active',
            textColor: 0,
            backgroundColor: BLUE_600,
        });
    }
    if (record.redirect) {
        tags.push({
            label: typeof record.redirect === 'string'
                ? `redirect: ${record.redirect}`
                : 'redirects',
            textColor: 0xffffff,
            backgroundColor: DARK,
        });
    }
    // add an id to be able to select it. Using the `path` is not possible because
    // empty path children would collide with their parents
    let id = record.__vd_id;
    if (id == null) {
        id = String(routeRecordId++);
        record.__vd_id = id;
    }
    return {
        id,
        label: record.path,
        tags,
        children: route.children.map(formatRouteRecordForInspector),
    };
}
//  incremental id for route records and inspector state
let routeRecordId = 0;
const EXTRACT_REGEXP_RE = /^\/(.*)\/([a-z]*)$/;
function markRouteRecordActive(route, currentRoute) {
    // no route will be active if matched is empty
    // reset the matching state
    const isExactActive = currentRoute.matched.length &&
        isSameRouteRecord(currentRoute.matched[currentRoute.matched.length - 1], route.record);
    route.__vd_exactActive = route.__vd_active = isExactActive;
    if (!isExactActive) {
        route.__vd_active = currentRoute.matched.some(match => isSameRouteRecord(match, route.record));
    }
    route.children.forEach(childRoute => markRouteRecordActive(childRoute, currentRoute));
}
function resetMatchStateOnRouteRecord(route) {
    route.__vd_match = false;
    route.children.forEach(resetMatchStateOnRouteRecord);
}
function isRouteMatching(route, filter) {
    const found = String(route.re).match(EXTRACT_REGEXP_RE);
    route.__vd_match = false;
    if (!found || found.length < 3) {
        return false;
    }
    // use a regexp without $ at the end to match nested routes better
    const nonEndingRE = new RegExp(found[1].replace(/\$$/, ''), found[2]);
    if (nonEndingRE.test(filter)) {
        // mark children as matches
        route.children.forEach(child => isRouteMatching(child, filter));
        // exception case: `/`
        if (route.record.path !== '/' || filter === '/') {
            route.__vd_match = route.re.test(filter);
            return true;
        }
        // hide the / route
        return false;
    }
    const path = route.record.path.toLowerCase();
    const decodedPath = decode(path);
    // also allow partial matching on the path
    if (!filter.startsWith('/') &&
        (decodedPath.includes(filter) || path.includes(filter)))
        return true;
    if (decodedPath.startsWith(filter) || path.startsWith(filter))
        return true;
    if (route.record.name && String(route.record.name).includes(filter))
        return true;
    return route.children.some(child => isRouteMatching(child, filter));
}
function omit(obj, keys) {
    const ret = {};
    for (const key in obj) {
        if (!keys.includes(key)) {
            // @ts-expect-error
            ret[key] = obj[key];
        }
    }
    return ret;
}

/**
 * Creates a Router instance that can be used by a Vue app.
 *
 * @param options - {@link RouterOptions}
 */
function createRouter(options) {
    const matcher = createRouterMatcher(options.routes, options);
    const parseQuery$1 = options.parseQuery || parseQuery;
    const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
    const routerHistory = options.history;
    if (!routerHistory)
        throw new Error('Provide the "history" option when calling "createRouter()":' +
            ' https://next.router.vuejs.org/api/#history.');
    const beforeGuards = useCallbacks();
    const beforeResolveGuards = useCallbacks();
    const afterGuards = useCallbacks();
    const currentRoute = Tt(START_LOCATION_NORMALIZED);
    let pendingLocation = START_LOCATION_NORMALIZED;
    // leave the scrollRestoration if no scrollBehavior is provided
    if (isBrowser && options.scrollBehavior && 'scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    const normalizeParams = applyToParams.bind(null, paramValue => '' + paramValue);
    const encodeParams = applyToParams.bind(null, encodeParam);
    const decodeParams = 
    // @ts-expect-error: intentionally avoid the type check
    applyToParams.bind(null, decode);
    function addRoute(parentOrRoute, route) {
        let parent;
        let record;
        if (isRouteName(parentOrRoute)) {
            parent = matcher.getRecordMatcher(parentOrRoute);
            record = route;
        }
        else {
            record = parentOrRoute;
        }
        return matcher.addRoute(record, parent);
    }
    function removeRoute(name) {
        const recordMatcher = matcher.getRecordMatcher(name);
        if (recordMatcher) {
            matcher.removeRoute(recordMatcher);
        }
        else {
            warn(`Cannot remove non-existent route "${String(name)}"`);
        }
    }
    function getRoutes() {
        return matcher.getRoutes().map(routeMatcher => routeMatcher.record);
    }
    function hasRoute(name) {
        return !!matcher.getRecordMatcher(name);
    }
    function resolve(rawLocation, currentLocation) {
        // const objectLocation = routerLocationAsObject(rawLocation)
        // we create a copy to modify it later
        currentLocation = assign({}, currentLocation || currentRoute.value);
        if (typeof rawLocation === 'string') {
            const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
            const matchedRoute = matcher.resolve({ path: locationNormalized.path }, currentLocation);
            const href = routerHistory.createHref(locationNormalized.fullPath);
            {
                if (href.startsWith('//'))
                    warn(`Location "${rawLocation}" resolved to "${href}". A resolved location cannot start with multiple slashes.`);
                else if (!matchedRoute.matched.length) {
                    warn(`No match found for location with path "${rawLocation}"`);
                }
            }
            // locationNormalized is always a new object
            return assign(locationNormalized, matchedRoute, {
                params: decodeParams(matchedRoute.params),
                hash: decode(locationNormalized.hash),
                redirectedFrom: undefined,
                href,
            });
        }
        let matcherLocation;
        // path could be relative in object as well
        if ('path' in rawLocation) {
            if ('params' in rawLocation &&
                !('name' in rawLocation) &&
                // @ts-expect-error: the type is never
                Object.keys(rawLocation.params).length) {
                warn(`Path "${
                // @ts-expect-error: the type is never
                rawLocation.path}" was passed with params but they will be ignored. Use a named route alongside params instead.`);
            }
            matcherLocation = assign({}, rawLocation, {
                path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path,
            });
        }
        else {
            // remove any nullish param
            const targetParams = assign({}, rawLocation.params);
            for (const key in targetParams) {
                if (targetParams[key] == null) {
                    delete targetParams[key];
                }
            }
            // pass encoded values to the matcher, so it can produce encoded path and fullPath
            matcherLocation = assign({}, rawLocation, {
                params: encodeParams(rawLocation.params),
            });
            // current location params are decoded, we need to encode them in case the
            // matcher merges the params
            currentLocation.params = encodeParams(currentLocation.params);
        }
        const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
        const hash = rawLocation.hash || '';
        if (hash && !hash.startsWith('#')) {
            warn(`A \`hash\` should always start with the character "#". Replace "${hash}" with "#${hash}".`);
        }
        // the matcher might have merged current location params, so
        // we need to run the decoding again
        matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
        const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
            hash: encodeHash(hash),
            path: matchedRoute.path,
        }));
        const href = routerHistory.createHref(fullPath);
        {
            if (href.startsWith('//')) {
                warn(`Location "${rawLocation}" resolved to "${href}". A resolved location cannot start with multiple slashes.`);
            }
            else if (!matchedRoute.matched.length) {
                warn(`No match found for location with path "${'path' in rawLocation ? rawLocation.path : rawLocation}"`);
            }
        }
        return assign({
            fullPath,
            // keep the hash encoded so fullPath is effectively path + encodedQuery +
            // hash
            hash,
            query: 
            // if the user is using a custom query lib like qs, we might have
            // nested objects, so we keep the query as is, meaning it can contain
            // numbers at `$route.query`, but at the point, the user will have to
            // use their own type anyway.
            // https://github.com/vuejs/router/issues/328#issuecomment-649481567
            stringifyQuery$1 === stringifyQuery
                ? normalizeQuery(rawLocation.query)
                : (rawLocation.query || {}),
        }, matchedRoute, {
            redirectedFrom: undefined,
            href,
        });
    }
    function locationAsObject(to) {
        return typeof to === 'string'
            ? parseURL(parseQuery$1, to, currentRoute.value.path)
            : assign({}, to);
    }
    function checkCanceledNavigation(to, from) {
        if (pendingLocation !== to) {
            return createRouterError(8 /* ErrorTypes.NAVIGATION_CANCELLED */, {
                from,
                to,
            });
        }
    }
    function push(to) {
        return pushWithRedirect(to);
    }
    function replace(to) {
        return push(assign(locationAsObject(to), { replace: true }));
    }
    function handleRedirectRecord(to) {
        const lastMatched = to.matched[to.matched.length - 1];
        if (lastMatched && lastMatched.redirect) {
            const { redirect } = lastMatched;
            let newTargetLocation = typeof redirect === 'function' ? redirect(to) : redirect;
            if (typeof newTargetLocation === 'string') {
                newTargetLocation =
                    newTargetLocation.includes('?') || newTargetLocation.includes('#')
                        ? (newTargetLocation = locationAsObject(newTargetLocation))
                        : // force empty params
                            { path: newTargetLocation };
                // @ts-expect-error: force empty params when a string is passed to let
                // the router parse them again
                newTargetLocation.params = {};
            }
            if (!('path' in newTargetLocation) &&
                !('name' in newTargetLocation)) {
                warn(`Invalid redirect found:\n${JSON.stringify(newTargetLocation, null, 2)}\n when navigating to "${to.fullPath}". A redirect must contain a name or path. This will break in production.`);
                throw new Error('Invalid redirect');
            }
            return assign({
                query: to.query,
                hash: to.hash,
                // avoid transferring params if the redirect has a path
                params: 'path' in newTargetLocation ? {} : to.params,
            }, newTargetLocation);
        }
    }
    function pushWithRedirect(to, redirectedFrom) {
        const targetLocation = (pendingLocation = resolve(to));
        const from = currentRoute.value;
        const data = to.state;
        const force = to.force;
        // to could be a string where `replace` is a function
        const replace = to.replace === true;
        const shouldRedirect = handleRedirectRecord(targetLocation);
        if (shouldRedirect)
            return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
                state: typeof shouldRedirect === 'object'
                    ? assign({}, data, shouldRedirect.state)
                    : data,
                force,
                replace,
            }), 
            // keep original redirectedFrom if it exists
            redirectedFrom || targetLocation);
        // if it was a redirect we already called `pushWithRedirect` above
        const toLocation = targetLocation;
        toLocation.redirectedFrom = redirectedFrom;
        let failure;
        if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
            failure = createRouterError(16 /* ErrorTypes.NAVIGATION_DUPLICATED */, { to: toLocation, from });
            // trigger scroll to allow scrolling to the same anchor
            handleScroll(from, from, 
            // this is a push, the only way for it to be triggered from a
            // history.listen is with a redirect, which makes it become a push
            true, 
            // This cannot be the first navigation because the initial location
            // cannot be manually navigated to
            false);
        }
        return (failure ? Promise.resolve(failure) : navigate(toLocation, from))
            .catch((error) => isNavigationFailure(error)
            ? // navigation redirects still mark the router as ready
                isNavigationFailure(error, 2 /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */)
                    ? error
                    : markAsReady(error) // also returns the error
            : // reject any unknown error
                triggerError(error, toLocation, from))
            .then((failure) => {
            if (failure) {
                if (isNavigationFailure(failure, 2 /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */)) {
                    if (// we are redirecting to the same location we were already at
                        isSameRouteLocation(stringifyQuery$1, resolve(failure.to), toLocation) &&
                        // and we have done it a couple of times
                        redirectedFrom &&
                        // @ts-expect-error: added only in dev
                        (redirectedFrom._count = redirectedFrom._count
                            ? // @ts-expect-error
                                redirectedFrom._count + 1
                            : 1) > 10) {
                        warn(`Detected an infinite redirection in a navigation guard when going from "${from.fullPath}" to "${toLocation.fullPath}". Aborting to avoid a Stack Overflow. This will break in production if not fixed.`);
                        return Promise.reject(new Error('Infinite redirect in navigation guard'));
                    }
                    return pushWithRedirect(
                    // keep options
                    assign({
                        // preserve an existing replacement but allow the redirect to override it
                        replace,
                    }, locationAsObject(failure.to), {
                        state: typeof failure.to === 'object'
                            ? assign({}, data, failure.to.state)
                            : data,
                        force,
                    }), 
                    // preserve the original redirectedFrom if any
                    redirectedFrom || toLocation);
                }
            }
            else {
                // if we fail we don't finalize the navigation
                failure = finalizeNavigation(toLocation, from, true, replace, data);
            }
            triggerAfterEach(toLocation, from, failure);
            return failure;
        });
    }
    /**
     * Helper to reject and skip all navigation guards if a new navigation happened
     * @param to
     * @param from
     */
    function checkCanceledNavigationAndReject(to, from) {
        const error = checkCanceledNavigation(to, from);
        return error ? Promise.reject(error) : Promise.resolve();
    }
    // TODO: refactor the whole before guards by internally using router.beforeEach
    function navigate(to, from) {
        let guards;
        const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
        // all components here have been resolved once because we are leaving
        guards = extractComponentsGuards(leavingRecords.reverse(), 'beforeRouteLeave', to, from);
        // leavingRecords is already reversed
        for (const record of leavingRecords) {
            record.leaveGuards.forEach(guard => {
                guards.push(guardToPromiseFn(guard, to, from));
            });
        }
        const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
        guards.push(canceledNavigationCheck);
        // run the queue of per route beforeRouteLeave guards
        return (runGuardQueue(guards)
            .then(() => {
            // check global guards beforeEach
            guards = [];
            for (const guard of beforeGuards.list()) {
                guards.push(guardToPromiseFn(guard, to, from));
            }
            guards.push(canceledNavigationCheck);
            return runGuardQueue(guards);
        })
            .then(() => {
            // check in components beforeRouteUpdate
            guards = extractComponentsGuards(updatingRecords, 'beforeRouteUpdate', to, from);
            for (const record of updatingRecords) {
                record.updateGuards.forEach(guard => {
                    guards.push(guardToPromiseFn(guard, to, from));
                });
            }
            guards.push(canceledNavigationCheck);
            // run the queue of per route beforeEnter guards
            return runGuardQueue(guards);
        })
            .then(() => {
            // check the route beforeEnter
            guards = [];
            for (const record of to.matched) {
                // do not trigger beforeEnter on reused views
                if (record.beforeEnter && !from.matched.includes(record)) {
                    if (isArray(record.beforeEnter)) {
                        for (const beforeEnter of record.beforeEnter)
                            guards.push(guardToPromiseFn(beforeEnter, to, from));
                    }
                    else {
                        guards.push(guardToPromiseFn(record.beforeEnter, to, from));
                    }
                }
            }
            guards.push(canceledNavigationCheck);
            // run the queue of per route beforeEnter guards
            return runGuardQueue(guards);
        })
            .then(() => {
            // NOTE: at this point to.matched is normalized and does not contain any () => Promise<Component>
            // clear existing enterCallbacks, these are added by extractComponentsGuards
            to.matched.forEach(record => (record.enterCallbacks = {}));
            // check in-component beforeRouteEnter
            guards = extractComponentsGuards(enteringRecords, 'beforeRouteEnter', to, from);
            guards.push(canceledNavigationCheck);
            // run the queue of per route beforeEnter guards
            return runGuardQueue(guards);
        })
            .then(() => {
            // check global guards beforeResolve
            guards = [];
            for (const guard of beforeResolveGuards.list()) {
                guards.push(guardToPromiseFn(guard, to, from));
            }
            guards.push(canceledNavigationCheck);
            return runGuardQueue(guards);
        })
            // catch any navigation canceled
            .catch(err => isNavigationFailure(err, 8 /* ErrorTypes.NAVIGATION_CANCELLED */)
            ? err
            : Promise.reject(err)));
    }
    function triggerAfterEach(to, from, failure) {
        // navigation is confirmed, call afterGuards
        // TODO: wrap with error handlers
        for (const guard of afterGuards.list())
            guard(to, from, failure);
    }
    /**
     * - Cleans up any navigation guards
     * - Changes the url if necessary
     * - Calls the scrollBehavior
     */
    function finalizeNavigation(toLocation, from, isPush, replace, data) {
        // a more recent navigation took place
        const error = checkCanceledNavigation(toLocation, from);
        if (error)
            return error;
        // only consider as push if it's not the first navigation
        const isFirstNavigation = from === START_LOCATION_NORMALIZED;
        const state = !isBrowser ? {} : history.state;
        // change URL only if the user did a push/replace and if it's not the initial navigation because
        // it's just reflecting the url
        if (isPush) {
            // on the initial navigation, we want to reuse the scroll position from
            // history state if it exists
            if (replace || isFirstNavigation)
                routerHistory.replace(toLocation.fullPath, assign({
                    scroll: isFirstNavigation && state && state.scroll,
                }, data));
            else
                routerHistory.push(toLocation.fullPath, data);
        }
        // accept current navigation
        currentRoute.value = toLocation;
        handleScroll(toLocation, from, isPush, isFirstNavigation);
        markAsReady();
    }
    let removeHistoryListener;
    // attach listener to history to trigger navigations
    function setupListeners() {
        // avoid setting up listeners twice due to an invalid first navigation
        if (removeHistoryListener)
            return;
        removeHistoryListener = routerHistory.listen((to, _from, info) => {
            if (!router.listening)
                return;
            // cannot be a redirect route because it was in history
            const toLocation = resolve(to);
            // due to dynamic routing, and to hash history with manual navigation
            // (manually changing the url or calling history.hash = '#/somewhere'),
            // there could be a redirect record in history
            const shouldRedirect = handleRedirectRecord(toLocation);
            if (shouldRedirect) {
                pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop);
                return;
            }
            pendingLocation = toLocation;
            const from = currentRoute.value;
            // TODO: should be moved to web history?
            if (isBrowser) {
                saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
            }
            navigate(toLocation, from)
                .catch((error) => {
                if (isNavigationFailure(error, 4 /* ErrorTypes.NAVIGATION_ABORTED */ | 8 /* ErrorTypes.NAVIGATION_CANCELLED */)) {
                    return error;
                }
                if (isNavigationFailure(error, 2 /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */)) {
                    // Here we could call if (info.delta) routerHistory.go(-info.delta,
                    // false) but this is bug prone as we have no way to wait the
                    // navigation to be finished before calling pushWithRedirect. Using
                    // a setTimeout of 16ms seems to work but there is no guarantee for
                    // it to work on every browser. So instead we do not restore the
                    // history entry and trigger a new navigation as requested by the
                    // navigation guard.
                    // the error is already handled by router.push we just want to avoid
                    // logging the error
                    pushWithRedirect(error.to, toLocation
                    // avoid an uncaught rejection, let push call triggerError
                    )
                        .then(failure => {
                        // manual change in hash history #916 ending up in the URL not
                        // changing, but it was changed by the manual url change, so we
                        // need to manually change it ourselves
                        if (isNavigationFailure(failure, 4 /* ErrorTypes.NAVIGATION_ABORTED */ |
                            16 /* ErrorTypes.NAVIGATION_DUPLICATED */) &&
                            !info.delta &&
                            info.type === NavigationType.pop) {
                            routerHistory.go(-1, false);
                        }
                    })
                        .catch(noop);
                    // avoid the then branch
                    return Promise.reject();
                }
                // do not restore history on unknown direction
                if (info.delta) {
                    routerHistory.go(-info.delta, false);
                }
                // unrecognized error, transfer to the global handler
                return triggerError(error, toLocation, from);
            })
                .then((failure) => {
                failure =
                    failure ||
                        finalizeNavigation(
                        // after navigation, all matched components are resolved
                        toLocation, from, false);
                // revert the navigation
                if (failure) {
                    if (info.delta &&
                        // a new navigation has been triggered, so we do not want to revert, that will change the current history
                        // entry while a different route is displayed
                        !isNavigationFailure(failure, 8 /* ErrorTypes.NAVIGATION_CANCELLED */)) {
                        routerHistory.go(-info.delta, false);
                    }
                    else if (info.type === NavigationType.pop &&
                        isNavigationFailure(failure, 4 /* ErrorTypes.NAVIGATION_ABORTED */ | 16 /* ErrorTypes.NAVIGATION_DUPLICATED */)) {
                        // manual change in hash history #916
                        // it's like a push but lacks the information of the direction
                        routerHistory.go(-1, false);
                    }
                }
                triggerAfterEach(toLocation, from, failure);
            })
                .catch(noop);
        });
    }
    // Initialization and Errors
    let readyHandlers = useCallbacks();
    let errorHandlers = useCallbacks();
    let ready;
    /**
     * Trigger errorHandlers added via onError and throws the error as well
     *
     * @param error - error to throw
     * @param to - location we were navigating to when the error happened
     * @param from - location we were navigating from when the error happened
     * @returns the error as a rejected promise
     */
    function triggerError(error, to, from) {
        markAsReady(error);
        const list = errorHandlers.list();
        if (list.length) {
            list.forEach(handler => handler(error, to, from));
        }
        else {
            {
                warn('uncaught error during route navigation:');
            }
            console.error(error);
        }
        return Promise.reject(error);
    }
    function isReady() {
        if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
            return Promise.resolve();
        return new Promise((resolve, reject) => {
            readyHandlers.add([resolve, reject]);
        });
    }
    function markAsReady(err) {
        if (!ready) {
            // still not ready if an error happened
            ready = !err;
            setupListeners();
            readyHandlers
                .list()
                .forEach(([resolve, reject]) => (err ? reject(err) : resolve()));
            readyHandlers.reset();
        }
        return err;
    }
    // Scroll behavior
    function handleScroll(to, from, isPush, isFirstNavigation) {
        const { scrollBehavior } = options;
        if (!isBrowser || !scrollBehavior)
            return Promise.resolve();
        const scrollPosition = (!isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0))) ||
            ((isFirstNavigation || !isPush) &&
                history.state &&
                history.state.scroll) ||
            null;
        return sn()
            .then(() => scrollBehavior(to, from, scrollPosition))
            .then(position => position && scrollToPosition(position))
            .catch(err => triggerError(err, to, from));
    }
    const go = (delta) => routerHistory.go(delta);
    let started;
    const installedApps = new Set();
    const router = {
        currentRoute,
        listening: true,
        addRoute,
        removeRoute,
        hasRoute,
        getRoutes,
        resolve,
        options,
        push,
        replace,
        go,
        back: () => go(-1),
        forward: () => go(1),
        beforeEach: beforeGuards.add,
        beforeResolve: beforeResolveGuards.add,
        afterEach: afterGuards.add,
        onError: errorHandlers.add,
        isReady,
        install(app) {
            const router = this;
            app.component('RouterLink', RouterLink);
            app.component('RouterView', RouterView);
            app.config.globalProperties.$router = router;
            Object.defineProperty(app.config.globalProperties, '$route', {
                enumerable: true,
                get: () => Rt(currentRoute),
            });
            // this initial navigation is only necessary on client, on server it doesn't
            // make sense because it will create an extra unnecessary navigation and could
            // lead to problems
            if (isBrowser &&
                // used for the initial navigation client side to avoid pushing
                // multiple times when the router is used in multiple apps
                !started &&
                currentRoute.value === START_LOCATION_NORMALIZED) {
                // see above
                started = true;
                push(routerHistory.location).catch(err => {
                    warn('Unexpected error when starting the router:', err);
                });
            }
            const reactiveRoute = {};
            for (const key in START_LOCATION_NORMALIZED) {
                // @ts-expect-error: the key matches
                reactiveRoute[key] = Rs(() => currentRoute.value[key]);
            }
            app.provide(routerKey, router);
            app.provide(routeLocationKey, pt(reactiveRoute));
            app.provide(routerViewLocationKey, currentRoute);
            const unmountApp = app.unmount;
            installedApps.add(app);
            app.unmount = function () {
                installedApps.delete(app);
                // the router is not attached to an app anymore
                if (installedApps.size < 1) {
                    // invalidate the current navigation
                    pendingLocation = START_LOCATION_NORMALIZED;
                    removeHistoryListener && removeHistoryListener();
                    removeHistoryListener = null;
                    currentRoute.value = START_LOCATION_NORMALIZED;
                    started = false;
                    ready = false;
                }
                unmountApp();
            };
            // TODO: this probably needs to be updated so it can be used by vue-termui
            if (isBrowser) {
                addDevtools(app, router, matcher);
            }
        },
    };
    return router;
}
function runGuardQueue(guards) {
    return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
}
function extractChangingRecords(to, from) {
    const leavingRecords = [];
    const updatingRecords = [];
    const enteringRecords = [];
    const len = Math.max(from.matched.length, to.matched.length);
    for (let i = 0; i < len; i++) {
        const recordFrom = from.matched[i];
        if (recordFrom) {
            if (to.matched.find(record => isSameRouteRecord(record, recordFrom)))
                updatingRecords.push(recordFrom);
            else
                leavingRecords.push(recordFrom);
        }
        const recordTo = to.matched[i];
        if (recordTo) {
            // the type doesn't matter because we are comparing per reference
            if (!from.matched.find(record => isSameRouteRecord(record, recordTo))) {
                enteringRecords.push(recordTo);
            }
        }
    }
    return [leavingRecords, updatingRecords, enteringRecords];
}

/**
 * Returns the router instance. Equivalent to using `$router` inside
 * templates.
 */
function useRouter() {
    return Un(routerKey);
}
/**
 * Returns the current route location. Equivalent to using `$route` inside
 * templates.
 */
function useRoute() {
    return Un(routeLocationKey);
}

var script$f = io({
  name: 'Consent',
  props: {
    scopes: {
      type: Array,
      default: () => []
    }
  },

  setup(props) {
    var _context$details$scop;

    const api = Un('api');
    const context = Un('context');
    const _scopes = [...props.scopes, ...(((_context$details$scop = context.details.scopes) === null || _context$details$scop === void 0 ? void 0 : _context$details$scop.new) || [])];
    return {
      _scopes,
      context,

      allow() {
        return api.auth.acceptConsent();
      },

      reject() {
        return api.auth.rejectConsent();
      },

      resolveClientLogo
    };
  }

});

const _hoisted_1$f = {
  class: "pa__logo-container"
};
const _hoisted_2$e = ["src"];
const _hoisted_3$e = {
  class: "pa__widget-info-section"
};
const _hoisted_4$e = {
  class: "pa__column"
};
const _hoisted_5$c = {
  class: "pa__widget-content-actions"
};

const _hoisted_6$9 = /*#__PURE__*/ns("div", {
  style: {
    "padding": "4px"
  }
}, null, -1);

function render$f(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_p_btn = Mo("p-btn");

  const _directive_t = Bo("t");

  return Hr(), qr(Br, null, [ns("div", _hoisted_1$f, [ns("img", {
    class: "pa__logo",
    alt: "Logo",
    src: _ctx.resolveClientLogo(_ctx.context.client)
  }, null, 8, _hoisted_2$e)]), ns("div", _hoisted_3$e, [Lo(ns("h2", null, null, 512), [[_directive_t, {
    path: 'consent.title',
    args: {
      clientName: _ctx.context.client.clientName
    }
  }]])]), ns("div", _hoisted_4$e, [(Hr(true), qr(Br, null, jo(_ctx._scopes, scope => {
    return Hr(), qr("li", {
      key: scope
    }, p(scope), 1);
  }), 128))]), ns("div", _hoisted_5$c, [os(_component_p_btn, {
    color: "success",
    onClick: _ctx.allow
  }, {
    default: An(() => [Lo(ns("span", null, null, 512), [[_directive_t, 'common.allow']])]),
    _: 1
  }, 8, ["onClick"]), _hoisted_6$9, os(_component_p_btn, {
    class: "pa__ml-2",
    color: "error",
    onClick: _ctx.reject
  }, {
    default: An(() => [Lo(ns("span", null, null, 512), [[_directive_t, 'common.reject']])]),
    _: 1
  }, 8, ["onClick"])])], 64);
}

script$f.render = render$f;

function generateDigitInput(index, ref, model, onUpdate, onInput) {
  return Ws(PTextField, {
    modelValue: model.value,
    key: index,
    type: 'tel',
    ref,
    hideMessages: true,
    rules: [v => !!v],
    class: {
      'pa__code-input--digit-box': true
    },

    onFocus($event) {
      const el = $event.target;

      if (el.setSelectionRange) {
        el.setSelectionRange(el.value.length, el.value.length);
      }
    },

    'onUpdate:modelValue': val => {
      onInput(index, val);
    },

    onKeypress($event) {
      onUpdate(index, $event);
    }

  });
}

function initializeDigitsModel(size) {
  const digits = {};

  for (let i = 0; i < size; i++) {
    digits[i] = Ft(null);
  }

  return digits;
}

function initializeInputRefs(size) {
  const inputRefs = [];

  for (let i = 0; i < size; i++) {
    inputRefs.push(Ft(null));
  }

  return inputRefs;
}

var PCodeInput = io({
  name: 'PCodeInput',
  props: {
    size: {
      type: Number,
      default: 6
    }
  },
  emits: ['update:modelValue'],

  setup(props, ctx) {
    const digits = initializeDigitsModel(props.size);
    const inputRefs = initializeInputRefs(props.size);
    const innerModelValue = Rs(() => {
      return Object.keys(digits).reduce((p, c) => {
        if (digits[c].value !== null) {
          p = p + digits[c].value;
        }

        return p;
      }, '');
    });
    return {
      digits,
      inputRefs,

      onDigitInput(index, val) {
        if (!val) {
          digits[index].value = null;
        }

        ctx.emit('update:modelValue', innerModelValue.value);
      },

      onDigitUpdate(index, event) {
        const value = event.key;
        const pressedKey = Number(value);

        if (event.code.startsWith('Digit') || /Numpad\d/gm.test(event.code)) {
          // 0-9 only
          event.preventDefault();
          digits[index].value = String(pressedKey);

          if (index + 1 < props.size) {
            inputRefs[index + 1].value.focus();
          }
        } else {
          event.preventDefault();
        }

        ctx.emit('update:modelValue', innerModelValue.value);
      }

    };
  },

  render() {
    return Ws('div', {
      class: {
        'pa__code-input': true
      }
    }, Array(this.size).fill(0).map((v, i) => generateDigitInput.call(this, i, this.inputRefs[i], this.digits[i], this.onDigitUpdate, this.onDigitInput)));
  }

});

var script$e = io({
  name: 'GenericForm',
  components: {
    PCheckBox,
    PCodeInput
  },
  props: {
    submit: {
      type: Function,
      required: true,
      default: () => false
    },
    validate: {
      type: Function,
      default: () => false
    },
    fields: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props) {
    const formRef = Ft(null);
    const alert = Ft(false);
    const alertMsg = Ft(null);
    const alertOptions = pt({});
    const sortedFields = Rs(() => {
      return Object.keys(props.fields).sort((a, b) => {
        var _props$fields$a, _props$fields$b;

        return (((_props$fields$a = props.fields[a]) === null || _props$fields$a === void 0 ? void 0 : _props$fields$a.order) || 0) - (((_props$fields$b = props.fields[b]) === null || _props$fields$b === void 0 ? void 0 : _props$fields$b.order) || 0);
      }).reduce(function (result, key) {
        result[key] = props.fields[key];
        return result;
      }, {});
    });
    return {
      formRef,
      alert,
      alertMsg,
      alertOptions,
      sortedFields,

      /**
       * @param message Message to display in alert. Pass null or undefined to hide alert.
       * @param options PAlert properties
       */
      toggleAlert(message, options) {
        alert.value = false;

        if (!message) {
          alertMsg.value = null;
          return;
        }

        alertMsg.value = message;
        alertOptions.value = options;
        setTimeout(() => {
          alert.value = true;
        });
      }

    };
  }

});

const _hoisted_1$e = /*#__PURE__*/ns("input", {
  type: "submit",
  hidden: "",
  style: {
    "display": "none"
  }
}, null, -1);

function render$e(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PCodeInput = Mo("PCodeInput");

  const _component_p_message = Mo("p-message");

  const _component_PCheckBox = Mo("PCheckBox");

  const _component_p_btn = Mo("p-btn");

  const _component_p_text_field = Mo("p-text-field");

  const _component_p_alert = Mo("p-alert");

  const _component_p_form = Mo("p-form");

  const _directive_t = Bo("t");

  return Hr(), Jr(_component_p_form, {
    ref: "formRef",
    autocomplete: "off",
    onSubmit: _ctx.submit
  }, {
    default: An(() => [(Hr(true), qr(Br, null, jo(_ctx.sortedFields, (options, field) => {
      return Hr(), qr(Br, {
        key: field
      }, [options.visible !== 'hidden' && options.visible !== false ? (Hr(), qr(Br, {
        key: 0
      }, [options.type === 'code' ? (Hr(), qr(Br, {
        key: 0
      }, [os(_component_PCodeInput, ps({
        modelValue: options.value,
        "onUpdate:modelValue": $event => options.value = $event
      }, options.attrs, {
        size: options.length,
        color: "primary"
      }), null, 16, ["modelValue", "onUpdate:modelValue", "size"]), os(_component_p_message, {
        value: options.errors,
        color: "error",
        class: "pa__mb-4"
      }, null, 8, ["value"])], 64)) : options.type === 'checkbox' ? (Hr(), Jr(_component_PCheckBox, ps({
        key: 1,
        modelValue: options.value,
        "onUpdate:modelValue": $event => options.value = $event
      }, options.attrs, {
        name: field,
        "error-messages": options.errors,
        type: options.type,
        label: options.label,
        rules: [_ctx.validate.bind(null, options, field)]
      }), null, 16, ["modelValue", "onUpdate:modelValue", "name", "error-messages", "type", "label", "rules"])) : (Hr(), Jr(_component_p_text_field, ps({
        key: 2,
        modelValue: options.value,
        "onUpdate:modelValue": $event => options.value = $event
      }, options.attrs, {
        "error-messages": options.errors,
        name: field,
        type: options.type,
        label: options.label,
        rules: [_ctx.validate.bind(null, options, field)]
      }), Uo({
        _: 2
      }, [field === 'password' ? {
        name: "append",
        fn: An(() => [os(_component_p_btn, {
          type: "button",
          flat: "",
          "text-color": "#000",
          tabindex: "0",
          class: "pa__pw-toggle-visibility",
          onClick: $event => options.type === 'password' ? options.type = 'text' : options.type = 'password'
        }, {
          default: An(() => [Lo(ns("span", null, null, 512), [[_directive_t, options.type === 'password' ? 'common.show' : 'common.hide']])]),
          _: 2
        }, 1032, ["onClick"]), Do(_ctx.$slots, field)]),
        key: "0"
      } : undefined, _ctx.$slots[field + '.message'] ? {
        name: "message",
        fn: An(message => [Do(_ctx.$slots, field + '.message', a(rs(message)))]),
        key: "1"
      } : undefined]), 1040, ["modelValue", "onUpdate:modelValue", "error-messages", "name", "type", "label", "rules"]))], 64)) : cs("", true)], 64);
    }), 128)), os(_component_p_alert, ps({
      modelValue: _ctx.alert,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.alert = $event),
      color: _ctx.alertOptions.type || 'error'
    }, _ctx.alertOptions.value), {
      default: An(() => [os(_component_p_message, {
        value: _ctx.alertMsg
      }, null, 8, ["value"])]),
      _: 1
    }, 16, ["modelValue", "color"]), _hoisted_1$e]),
    _: 3
  }, 8, ["onSubmit"]);
}

script$e.render = render$e;

const CustomizableFormProps = {
  fields: {
    type: Object,
    default: () => ({})
  },
  responseErrorHandler: {
    type: Function,
    default: () => () => null
  }
};

function form_generics (defaultFields, action) {
  const form = Ft(null);
  const loading = Ft(false);
  const translator = Un(translatorKey);
  const {
    fields,
    responseErrorHandler
  } = this;
  const mergedFields = pt(cjs(defaultFields || {}, fields || {}, {
    clone: false
  }));

  for (const field in mergedFields) {
    if (!mergedFields[field]) {
      delete mergedFields[field];
    }
  }

  return {
    form,
    loading,
    fields: mergedFields,

    validate(options, field, value) {
      if (options.required !== false && !value) {
        return translator.t('errors.field_required', [translator.t(`common.fields.${field}`)]);
      }

      if (value) {
        if (options.format === 'email' && !isEmail(value)) {
          return translator.t('errors.invalid_entity', [translator.t(`common.fields.${field}`)]);
        }

        if (options.format === 'tel' && !isPhone(value)) {
          return translator.t('errors.invalid_entity', [translator.t(`common.fields.${field}`)]);
        }
      }

      if (options.validator) {
        return options.validator.call({
          $t: translator.t.bind(translator)
        }, mergedFields, value);
      } else {
        return undefined;
      }
    },

    async submit($event) {
      var _form$value;

      $event === null || $event === void 0 ? void 0 : $event.preventDefault();
      loading.value = true; // reset error messages

      Object.values(mergedFields).forEach(field => {
        field.errors = null;
      });
      const formRef = ((_form$value = form.value) === null || _form$value === void 0 ? void 0 : _form$value.formRef) || form.value;

      if (!formRef) {
        throw new Error('Form ref not found');
      }

      const valid = await formRef.validate();

      if (valid) {
        formRef.resetValidation();
        const fieldsWithValues = Object.keys(mergedFields).reduce((prev, curr) => {
          prev[curr] = mergedFields[curr].value;
          return prev;
        }, {});

        try {
          await (action === null || action === void 0 ? void 0 : action(fieldsWithValues));
        } catch (e) {
          if (responseErrorHandler) {
            responseErrorHandler.call(undefined, e);
          }

          loading.value = false;
          throw e;
        }

        loading.value = false;
      } else {
        loading.value = false;
      }
    }

  };
}

var script$d = io({
  name: 'FillMissing',
  components: {
    GenericForm: script$e
  },
  props: _objectSpread2({}, CustomizableFormProps),

  setup(props) {
    var _context$details;

    const api = Un('api');
    const context = Un('context');
    const contextFields = context === null || context === void 0 ? void 0 : (_context$details = context.details) === null || _context$details === void 0 ? void 0 : _context$details.fields;
    const {
      form,
      loading,
      submit,
      validate,
      fields: finalFields
    } = form_generics.call(props, null, async fieldsWithValues => {
      try {
        await api.auth.updateMissingInformation(fieldsWithValues);
      } catch (e) {
        if (e.field) {
          if (finalFields[e.field]) {
            finalFields[e.field].errors = `errors.${e.error}`;
          }
        } else {
          switch (e.error) {
            case 'already_exists':
              finalFields.email ? finalFields.email.errors = `errors.${e.error}` : finalFields.username ? finalFields.username.errors = `errors.${e.error}` : null;
              break;

            case 'email_not_verified':
              window.location.assign('/account/verifyEmail');
              break;

            default:
              if (finalFields.password) {
                finalFields.password['errors'] = `errors.${e.error}`;
              }

          }
        }

        throw e;
      }
    });

    if (contextFields) {
      if (Array.isArray(contextFields)) {
        contextFields.forEach(field => {
          let fieldName;
          let fieldType;

          if (typeof field === 'string') {
            fieldName = field;
            fieldType = 'text';
          } else {
            fieldName = field.name;
            fieldType = field.type;
          }

          finalFields[fieldName] = {
            value: null,
            type: fieldType,
            label: `common.fields.${fieldName}`,

            validator(fields, value) {
              if (!value) {
                return this.$t('errors.field_required', [this.$t(`common.fields.${fieldName}`)]);
              }

              return true;
            }

          };
        });
      }
    }

    return {
      finalFields,
      context,
      resolveClientLogo,
      form,
      loading,
      submit,
      validate
    };
  }

});

const _hoisted_1$d = {
  class: "pa__logo-container"
};
const _hoisted_2$d = ["src"];
const _hoisted_3$d = {
  class: "pa__widget-info-section"
};
const _hoisted_4$d = {
  class: "pa__widget-content-actions"
};
function render$d(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_GenericForm = Mo("GenericForm");

  const _component_p_btn = Mo("p-btn");

  const _directive_t = Bo("t");

  return Hr(), qr(Br, null, [ns("div", _hoisted_1$d, [ns("img", {
    class: "pa__logo",
    alt: "Logo",
    src: _ctx.resolveClientLogo(_ctx.context.client)
  }, null, 8, _hoisted_2$d)]), ns("div", _hoisted_3$d, [Lo(ns("h1", null, null, 512), [[_directive_t, 'fillMissing.title']]), Lo(ns("h2", null, null, 512), [[_directive_t, 'fillMissing.subtitle']])]), os(_component_GenericForm, {
    ref: "form",
    fields: _ctx.finalFields,
    validate: _ctx.validate,
    submit: _ctx.submit
  }, null, 8, ["fields", "validate", "submit"]), ns("div", _hoisted_4$d, [os(_component_p_btn, {
    color: "primary",
    block: "",
    loading: _ctx.loading,
    onClick: _ctx.submit
  }, {
    default: An(() => [Lo(ns("span", null, null, 512), [[_directive_t, 'common.submit']])]),
    _: 1
  }, 8, ["loading", "onClick"])])], 64);
}

script$d.render = render$d;

var script$c = io({
  name: 'ForgotPassword',
  components: {
    GenericForm: script$e
  },
  props: _objectSpread2({}, CustomizableFormProps),

  setup(props) {
    const api = Un('api');
    const actionCompleted = Ft(false);
    const context = Un('context');
    const defaultFields = {
      email: {
        type: 'text',
        format: 'email',
        label: 'common.fields.email'
      }
    };
    const {
      form,
      loading,
      submit,
      validate,
      fields: finalFields
    } = form_generics.call(props, defaultFields, async fieldsWithValues => {
      try {
        await api.auth.requestResetPassword(fieldsWithValues.email);
        actionCompleted.value = true;
      } catch (e) {
        if (finalFields.email) {
          switch (e.error) {
            case 'user_not_found':
              finalFields.email ? finalFields.email.errors = `errors.${e.error}` : finalFields.username ? finalFields.username.errors = `errors.${e.error}` : null;
              break;

            case 'invalid_credentials':
              finalFields.email['errors'] = `errors.${e.error}`;
              break;

            case 'email_not_verified':
              // TODO: email not verified
              break;

            default:
              finalFields.email['errors'] = `errors.${e.error}`;
          }
        }

        throw e;
      }
    });
    return {
      finalFields,
      context,
      form,
      actionCompleted,
      loading,
      resolveClientLogo,
      validate,
      submit
    };
  }

});

const _hoisted_1$c = {
  key: 0
};
const _hoisted_2$c = {
  class: "pa__logo-container"
};
const _hoisted_3$c = ["src"];
const _hoisted_4$c = {
  class: "pa__widget-info-section"
};
const _hoisted_5$b = {
  class: "pa__widget-content-actions"
};
const _hoisted_6$8 = {
  key: 1,
  class: "pa__column"
};

const _hoisted_7$6 = /*#__PURE__*/ns("div", {
  class: "pa__logo-container"
}, [/*#__PURE__*/ns("img", {
  src: "https://api.plusauth.com/assets/images/icons/plane.svg",
  class: "pa__logo",
  alt: "Mail Confirmation"
})], -1);

const _hoisted_8$6 = {
  class: "pa__widget-info-section"
};
function render$c(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_GenericForm = Mo("GenericForm");

  const _component_p_btn = Mo("p-btn");

  const _directive_t = Bo("t");

  return Hr(), Jr(ki, {
    name: "slide-x-transition",
    mode: "out-in"
  }, {
    default: An(() => [!_ctx.actionCompleted ? (Hr(), qr("div", _hoisted_1$c, [ns("div", _hoisted_2$c, [ns("img", {
      class: "pa__logo",
      alt: "Logo",
      src: _ctx.resolveClientLogo(_ctx.context.client)
    }, null, 8, _hoisted_3$c)]), ns("div", _hoisted_4$c, [Lo(ns("h1", null, null, 512), [[_directive_t, 'forgotPassword.title']]), Lo(ns("h2", null, null, 512), [[_directive_t, 'forgotPassword.subtitle']])]), os(_component_GenericForm, {
      ref: "form",
      fields: _ctx.finalFields,
      validate: _ctx.validate,
      submit: _ctx.submit
    }, null, 8, ["fields", "validate", "submit"]), ns("div", _hoisted_5$b, [os(_component_p_btn, {
      color: "primary",
      loading: _ctx.loading,
      block: "",
      onClick: _ctx.submit
    }, {
      default: An(() => [Lo(ns("span", null, null, 512), [[_directive_t, 'common.submit']])]),
      _: 1
    }, 8, ["loading", "onClick"])])])) : (Hr(), qr("div", _hoisted_6$8, [_hoisted_7$6, ns("div", _hoisted_8$6, [Lo(ns("h2", null, null, 512), [[_directive_t, {
      path: 'forgotPassword.emailSent',
      args: {
        email: _ctx.finalFields.email.value
      }
    }]])])]))]),
    _: 1
  });
}

script$c.render = render$c;

function getIconLink(type) {
  return `https://raw.githubusercontent.com/edent/SuperTinyIcons/master/images/svg/${type}.svg`;
}

var SocialConnectionButton = io({
  name: 'SocialConnectionButton',
  props: {
    type: {
      type: String,
      required: true
    }
  },

  render() {
    return Ws('a', {
      style: {
        backgroundImage: `url(${getIconLink(this.type)})`
      },
      class: ['pa__btn', 'pa__widget-social-icon', 'pa__btn--fab']
    }, Ws('div', {
      class: 'pa__btn__content'
    }));
  }

});

var script$b = io({
  name: 'Login',
  components: {
    GenericForm: script$e,
    SocialConnectionButton
  },
  props: _objectSpread2({
    features: {
      type: Object,
      default: () => ({
        socialConnections: true,
        signUp: true,
        forgotPassword: true
      })
    },
    socialConnections: {
      type: Array,
      default: () => []
    }
  }, CustomizableFormProps),

  setup(props) {
    const api = Un('api');
    const context = Un('context');
    const passwordVisible = Ft(false);
    const defaultFields = {
      username: {
        order: 0,
        attrs: {
          autocomplete: 'username'
        },
        type: 'text',
        label: 'common.fields.username'
      },
      password: {
        order: 1,
        type: 'password',
        label: 'common.fields.password',
        errors: []
      }
    };
    const {
      form,
      loading,
      submit,
      validate,
      fields: finalFields
    } = form_generics.call(props, defaultFields, async fieldWithValues => {
      form.value.toggleAlert(null);

      try {
        await api.auth.signIn(fieldWithValues);
      } catch (e) {
        if (e.error) {
          switch (e.error) {
            case 'user_not_found':
              finalFields.email ? finalFields.email.errors = `errors.${e.error}` : finalFields.username ? finalFields.username.errors = `errors.${e.error}` : null;
              break;

            case 'email_not_verified':
              window.location.assign('/account/verifyEmail');
              break;

            case 'invalid_password':
              if (finalFields.password) {
                finalFields.password.errors = `errors.${e.error}`;
              }

              break;

            case 'too_many_requests':
              const retryAfter = e._raw.headers.get('retry-after');

              form.value.toggleAlert({
                path: `errors.${e.error}`,
                args: {
                  retry: retryAfter
                }
              }, {
                dismissible: false
              });
              break;

            default:
              form.value.toggleAlert(`errors.${e.error}`, {
                dismissible: false
              });
          }
        }

        throw e;
      }
    });
    return {
      finalFields,
      context,
      form,
      loading,
      passwordVisible,
      validate,
      submit,
      resolveClientLogo
    };
  }

});

const _hoisted_1$b = {
  class: "pa__logo-container"
};
const _hoisted_2$b = ["src"];
const _hoisted_3$b = {
  class: "pa__widget-info-section"
};
const _hoisted_4$b = {
  class: "pa__widget-content-actions"
};
const _hoisted_5$a = {
  key: 0,
  class: "pa__widget-social-section"
};
const _hoisted_6$7 = {
  class: "pa__widget-social-icons"
};
const _hoisted_7$5 = {
  class: "pa__widget-helpers-section"
};
const _hoisted_8$5 = {
  key: 0
};
const _hoisted_9$5 = {
  key: 1
};
const _hoisted_10$5 = {
  tabindex: "0",
  href: "/signin/recovery"
};
function render$b(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_GenericForm = Mo("GenericForm");

  const _component_p_btn = Mo("p-btn");

  const _component_SocialConnectionButton = Mo("SocialConnectionButton");

  const _directive_t = Bo("t");

  return Hr(), qr(Br, null, [ns("div", _hoisted_1$b, [ns("img", {
    class: "pa__logo",
    alt: "Logo",
    src: _ctx.resolveClientLogo(_ctx.context.client)
  }, null, 8, _hoisted_2$b)]), ns("div", _hoisted_3$b, [Lo(ns("h1", null, null, 512), [[_directive_t, 'login.title']])]), os(_component_GenericForm, {
    ref: "form",
    fields: _ctx.finalFields,
    validate: _ctx.validate,
    submit: _ctx.submit
  }, null, 8, ["fields", "validate", "submit"]), ns("div", _hoisted_4$b, [os(_component_p_btn, {
    color: "primary",
    loading: _ctx.loading,
    block: "",
    onClick: _ctx.submit
  }, {
    default: An(() => [Lo(ns("span", null, null, 512), [[_directive_t, 'login.signIn']])]),
    _: 1
  }, 8, ["loading", "onClick"])]), _ctx.features.socialConnections && _ctx.context.client && _ctx.context.client.social && _ctx.context.client.social.length ? (Hr(), qr("div", _hoisted_5$a, [Lo(ns("h4", null, null, 512), [[_directive_t, 'login.signInWith']]), ns("div", _hoisted_6$7, [(Hr(true), qr(Br, null, jo(_ctx.context.client.social, connection => {
    return Hr(), Jr(_component_SocialConnectionButton, {
      key: connection,
      type: connection,
      href: '/social?provider=' + connection
    }, null, 8, ["type", "href"]);
  }), 128))])])) : cs("", true), ns("div", _hoisted_7$5, [_ctx.features.signUp ? (Hr(), qr("div", _hoisted_8$5, [Lo(ns("span", null, null, 512), [[_directive_t, 'login.noAccount']]), Lo(ns("a", {
    tabindex: "0",
    href: "/signup",
    onClick: _cache[0] || (_cache[0] = cl(() => {}, ["stop"]))
  }, null, 512), [[_directive_t, 'login.signUp']])])) : cs("", true), _ctx.features.forgotPassword ? (Hr(), qr("div", _hoisted_9$5, [Lo(ns("a", _hoisted_10$5, null, 512), [[_directive_t, 'login.forgotPassword']])])) : cs("", true)])], 64);
}

script$b.render = render$b;

var script$a = io({
  name: 'Challenge',
  props: {},

  setup() {
    const context = Un('context');
    const challenges = context.details.challenges;
    const router = useRouter();

    if ((challenges === null || challenges === void 0 ? void 0 : challenges.length) === 1) {
      router.replace({
        name: challenges[0]
      });
    }

    return {
      context
    };
  }

});

const _hoisted_1$a = /*#__PURE__*/ns("div", {
  class: "pa__logo-container"
}, [/*#__PURE__*/ns("img", {
  style: {
    "max-height": "150px"
  },
  alt: "Logo",
  src: "https://api.plusauth.com/assets/images/icons/select.svg"
})], -1);

const _hoisted_2$a = {
  class: "pa__widget-info-section"
};
const _hoisted_3$a = {
  class: "pa__signin-challenges"
};
const _hoisted_4$a = ["href"];
function render$a(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_t = Bo("t");

  return Hr(), qr(Br, null, [_hoisted_1$a, ns("div", _hoisted_2$a, [Lo(ns("h2", null, null, 512), [[_directive_t, 'mfa.challenge.title']])]), ns("div", _hoisted_3$a, [(Hr(true), qr(Br, null, jo(_ctx.context.details.challenges, challenge => {
    return Hr(), qr("a", {
      key: challenge,
      href: '/signin/challenge/' + challenge,
      class: "pa__btn pa__btn--flat pa__btn--block pa__signin-challenge",
      onClick: _cache[0] || (_cache[0] = cl(() => {}, ["stop"]))
    }, [Lo(ns("span", null, null, 512), [[_directive_t, 'mfa.challenge.' + challenge]])], 8, _hoisted_4$a);
  }), 128))])], 64);
}

script$a.render = render$a;

var script$9 = io({
  name: 'Email',
  components: {
    GenericForm: script$e
  },
  props: _objectSpread2({}, CustomizableFormProps),

  setup(props) {
    const api = Un('api');
    const context = Un('context');
    const defaultFields = {
      code: {
        type: 'text',
        label: 'common.fields.code'
      }
    };
    const {
      form,
      loading,
      submit,
      validate,
      fields: finalFields
    } = form_generics.call(props, defaultFields, async fieldWithValues => {
      try {
        await api.mfa.validateCode(fieldWithValues.code, B$1.EMAIL);
      } catch (e) {
        if (e.error) {
          form.value.toggleAlert(`errors.${e.error}`, {
            dismissible: false
          });
        }

        throw e;
      }
    });
    return {
      loading,
      finalFields,
      form,
      context,
      validate,
      submit
    };
  }

});

const _hoisted_1$9 = /*#__PURE__*/ns("div", {
  class: "pa__logo-container"
}, [/*#__PURE__*/ns("img", {
  id: "mainLogo",
  style: {
    "max-height": "150px",
    "margin-left": "40px"
  },
  class: "pa__logo",
  alt: "Logo",
  src: "https://api.plusauth.com/assets/images/icons/email_question.svg"
})], -1);

const _hoisted_2$9 = {
  class: "pa__widget-info-section"
};
const _hoisted_3$9 = {
  class: "pa__widget-content-actions"
};
const _hoisted_4$9 = {
  key: 0,
  class: "pa__widget-helpers-section"
};
const _hoisted_5$9 = {
  href: "/signin/challenge"
};
function render$9(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_GenericForm = Mo("GenericForm");

  const _component_p_btn = Mo("p-btn");

  const _directive_t = Bo("t");

  return Hr(), qr(Br, null, [_hoisted_1$9, ns("div", _hoisted_2$9, [Lo(ns("h2", null, null, 512), [[_directive_t, {
    path: 'mfa.email.title',
    args: {
      email: _ctx.context.details.email
    }
  }]])]), os(_component_GenericForm, {
    ref: "form",
    fields: _ctx.finalFields,
    validate: _ctx.validate,
    submit: _ctx.submit
  }, null, 8, ["fields", "validate", "submit"]), ns("div", _hoisted_3$9, [os(_component_p_btn, {
    block: "",
    color: "primary",
    loading: _ctx.loading,
    onClick: _ctx.submit
  }, {
    default: An(() => [Lo(ns("span", null, null, 512), [[_directive_t, 'common.submit']])]),
    _: 1
  }, 8, ["loading", "onClick"])]), _ctx.context.details.challenges.length > 1 ? (Hr(), qr("div", _hoisted_4$9, [Lo(ns("a", _hoisted_5$9, null, 512), [[_directive_t, 'mfa.tryAnotherWay']])])) : cs("", true)], 64);
}

script$9.render = render$9;

var script$8 = {
  name: 'Hand',
  props: {
    selected: {
      type: Array,
      default: () => []
    }
  },
  emits: ['select'],
  methods: {
    /**
     * @param ind { number }
     * @returns {void}
     */
    onSelect(ind) {
      this.$emit('select', ind);
    }

  }
};

const _hoisted_1$8 = {
  id: "Layer_1",
  xmlns: "http://www.w3.org/2000/svg",
  x: "0px",
  width: "100%",
  height: "100%",
  class: "pa__hand",
  y: "0px",
  viewBox: "0 0 512 512"
};

const _hoisted_2$8 = /*#__PURE__*/ns("g", {
  class: "pa__palm"
}, [/*#__PURE__*/ns("path", {
  d: "M104.1,450c-5,0-6.8-3.6-8.9-7.2c-2.2-3.8-0.9-8.7,2.9-10.9c3.8-2.2,8.7-0.9,10.9,2.9c0.7,1.2,1.3,2.2,1.8,3\n\tC114.3,443.1,110.3,450,104.1,450z"
}), /*#__PURE__*/ns("path", {
  d: "M244.3,496H216c-32.5,0-63.2-12.5-86.4-35.1c-3.2-3.1-8.2-3-11.3,0.2c-3.1,3.2-3,8.2,0.2,11.3\n\tc26.3,25.6,60.9,39.6,97.6,39.6h28.3c40.6,0,78.8-15.8,107.5-44.5l-11.4-11.2C314.7,481.9,280.6,496,244.3,496z"
})], -1);

const _hoisted_3$8 = /*#__PURE__*/ns("rect", {
  x: "340.4",
  y: "248",
  class: "pa__st0",
  width: "171.6",
  height: "219.5"
}, null, -1);

const _hoisted_4$8 = /*#__PURE__*/ns("path", {
  id: "pa__thumb",
  class: "pa__finger",
  d: "M475.7,248c-25.2,0-48.8,9.8-66.6,27.6c-0.4,0.4-13.5,16-43.6,51.6c-2.3,2.1-5.2,2.6-7.8,1.8l-2.3,15.9\n\t\tc7.9,1.7,16.5-0.4,22.1-7.1l43.2-51.2c14.7-14.6,34.3-22.7,55.1-22.7c16.9,0,27.9,20.2,13.8,35.2L340.4,456.2l11.4,11.2\n\t\tc0.1-0.1-4.9,5.2,149.2-157.2C524.7,286.4,507.2,248,475.7,248z"
}, null, -1);

const _hoisted_5$8 = [_hoisted_3$8, _hoisted_4$8];

const _hoisted_6$6 = /*#__PURE__*/ns("rect", {
  x: "271.3",
  y: "29.9",
  class: "pa__st0",
  width: "139.1",
  height: "315"
}, null, -1);

const _hoisted_7$4 = /*#__PURE__*/ns("path", {
  id: "pa__index",
  class: "pa__finger",
  d: "M352,321.4v-41.5l52.1-194.6c7.4-27.8-13.5-55.4-42.5-55.4c-19.8,0-37.3,13.4-42.5,32.5L280,199.1l-8.7,64.9\n\t\tc3.5,0.3,7.2-1.5,8.4-5.7l54.9-191.4c3.9-13.6,15.4-20.9,27.1-20.9c18.4,0,31.8,17.5,27.1,35.2c-56.2,209.6-52.7,196-52.7,197.7\n\t\tv42.5c0,12.9,9.1,21.4,19.3,23.6l2.3-15.9C354.5,328.1,352,325.2,352,321.4z"
}, null, -1);

const _hoisted_8$4 = [_hoisted_6$6, _hoisted_7$4];

const _hoisted_9$4 = /*#__PURE__*/ns("rect", {
  x: "192",
  class: "pa__st0",
  width: "88",
  height: "263.9"
}, null, -1);

const _hoisted_10$4 = /*#__PURE__*/ns("path", {
  id: "pa__middle",
  class: "pa__finger",
  d: "M236,0c-24.5,0-44,19.9-44,44v145l8.4,68.7c3.9-0.2,7.6-3,7.6-8V44c0-7.5,2.9-14.5,8.2-19.8\n\t\tC233.7,6.8,264,19,264,44v212c0,4.8,3.6,7.6,7.3,7.9l8.7-64.9V44C280,19.8,260.2,0,236,0z"
}, null, -1);

const _hoisted_11$2 = [_hoisted_9$4, _hoisted_10$4];

const _hoisted_12$1 = /*#__PURE__*/ns("rect", {
  x: "74",
  y: "39.1",
  class: "pa__st0",
  width: "126.4",
  height: "240.9"
}, null, -1);

const _hoisted_13 = /*#__PURE__*/ns("path", {
  id: "pa__ring",
  class: "pa__finger",
  d: "M192,189L160.5,71.7c-6.3-23.5-30.4-37.4-53.9-31.1c-23.3,6.2-37.5,30.3-31.1,53.9l32.6,121.8l27.2,63.7\n\t\tc3-1.6,5.1-4.9,4-9.1C86.3,72.9,90,88.3,90,83.1c0-21.3,23.3-35,42-24.2c6.5,3.7,11.1,9.8,13,17l47.2,176c1.1,4.2,4.7,6.1,8.2,5.9\n\t\tL192,189z"
}, null, -1);

const _hoisted_14 = [_hoisted_12$1, _hoisted_13];

const _hoisted_15 = /*#__PURE__*/ns("rect", {
  x: "0",
  y: "138.2",
  class: "pa__st0",
  width: "135.4",
  height: "279.2"
}, null, -1);

const _hoisted_16 = /*#__PURE__*/ns("path", {
  id: "pa__little",
  class: "pa__finger",
  d: "M74.6,158.2c-11-19.1-35.5-25.7-54.6-14.6C1.2,154.4-5.9,178.7,5.4,198.2l44.9,77.8\n\t\tC67.1,305.1,76,338.3,76,372c0,13.5,1.9,26.8,5.7,39.7c1.3,4.2,5.7,6.7,9.9,5.4c4.2-1.2,6.7-5.7,5.4-9.9\n\t\tC93.7,395.8,92,383.9,92,372c0-36.5-9.6-72.4-27.9-104l-44.9-77.8c-2.1-3.6-3.2-7.8-3.2-12c0-24.7,32.7-33,44.8-12l63.9,110.7\n\t\tc2.5,4.3,7.2,4.8,10.6,3l-27.2-63.7L74.6,158.2z"
}, null, -1);

const _hoisted_17 = [_hoisted_15, _hoisted_16];
function render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return Hr(), qr("svg", _hoisted_1$8, [_hoisted_2$8, ns("g", {
    class: c(["pa__thumb_container", {
      'pa__selected': $props.selected.includes(0)
    }]),
    onClick: _cache[0] || (_cache[0] = $event => $options.onSelect(0))
  }, _hoisted_5$8, 2), ns("g", {
    class: c(["pa__index_container", {
      'pa__selected': $props.selected.includes(1)
    }]),
    onClick: _cache[1] || (_cache[1] = $event => $options.onSelect(1))
  }, _hoisted_8$4, 2), ns("g", {
    class: c(["pa__middle_container", {
      'pa__selected': $props.selected.includes(2)
    }]),
    onClick: _cache[2] || (_cache[2] = $event => $options.onSelect(2))
  }, _hoisted_11$2, 2), ns("g", {
    class: c(["pa__ring_container", {
      'pa__selected': $props.selected.includes(3)
    }]),
    onClick: _cache[3] || (_cache[3] = $event => $options.onSelect(3))
  }, _hoisted_14, 2), ns("g", {
    class: c(["pa__little_container", {
      'pa__selected': $props.selected.includes(4)
    }]),
    onClick: _cache[4] || (_cache[4] = $event => $options.onSelect(4))
  }, _hoisted_17, 2)]);
}

script$8.render = render$8;

class H1FingerVeinService {
  async fetch(body) {
    const res = await fetch('http://127.0.0.1:8125/root/', {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
    const text = await res.text();
    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return text;
    }

    if (parsed.retCode && parsed.retCode !== '0') {
      throw parsed;
    }

    return parsed;
  }

  async ping() {
    await this.fetch('33');
  }

  version() {
    return this.fetch('25');
  }

  async deviceStatus() {
    const statusText = await this.fetch('27');
    return statusText.split(';').map(sec => sec.split('=')).reduce((prev, cur) => {
      prev[cur[0]] = cur[1];
      return prev;
    }, {});
  }

  enroll(fingerIndex) {
    return this.fetch(`22${fingerIndex}`);
  }

  verify(fingerIndex, templateEnc) {
    const body = `34${fingerIndex}${templateEnc}`;
    return this.fetch(body);
  }

}

var script$7 = io({
  name: 'FingerVein',
  components: {
    PLoading,
    Hand: script$8,
    GenericForm: script$e
  },
  props: _objectSpread2({}, CustomizableFormProps),

  setup(props) {
    const api = Un('api');
    const context = Un('context');
    const loadingMsg = Ft(null);
    const deviceOk = Ft(false);
    const selectedFinger = Ft(1);
    const error = Ft(null);
    const templates = pt({});
    const enrolledFingers = pt({
      left: [],
      right: []
    });
    const fv = new H1FingerVeinService();
    const {
      form,
      loading,
      fields: finalFields,
      validate
    } = form_generics.call(props);
    loading.value = true;
    wo(async () => {
      try {
        loadingMsg.value = 'mfa.fv.checkingDevice';
        await fv.ping();
        const status = await fv.deviceStatus();

        if (status.ReturnCode !== '0') {
          throw `0x${status.ReturnCode}`;
        }

        deviceOk.value = true;
      } catch (e) {
        deviceOk.value = false;
        form.value.toggleAlert(`errors.fv.${e.error || e.retCode || e}`, {
          dismissible: false
        });
      } finally {
        loading.value = false;
      }
    });
    return {
      finalFields,
      validate,
      loadingMsg,
      selectedFinger,
      deviceOk,
      context,
      error,
      templates,
      enrolledFingers,
      form,
      loading,

      async onFingerSelect(ind, hand) {
        loadingMsg.value = 'mfa.fv.enrollmentInProgress';
        loading.value = true;
        let h1Index = ind;

        if (hand === 'right') {
          h1Index += 3;
        }

        try {
          const resp = await fv.enroll(h1Index);
          enrolledFingers[hand].push(ind);
          templates[h1Index] = resp.template;
          form.value.toggleAlert('Finger Enrolled', {
            dismissible: false,
            timeout: 3000,
            type: 'success'
          });
        } catch (e) {
          form.value.toggleAlert(`errors.fv.${e.error || e.retCode || e}`, {
            dismissible: false
          });
        } finally {
          loadingMsg.value = null;
          loading.value = false;
        }
      },

      async submit() {
        loading.value = true;
        loadingMsg.value = null;

        try {
          if (!context.details.fv_template || context.details.fv_template.length === 0) {
            if (!templates || Object.keys(templates).length === 0) {
              form.value.toggleAlert('errors.fv.enrollRequired', {
                dismissible: false
              });
            } else {
              loadingMsg.value = 'mfa.fv.saving';
              await api.auth.updateMissingInformation({
                templates
              });
            }
          } else {
            loadingMsg.value = 'mfa.fv.verifyInProgress';
            const resp = await fv.verify(1, context.details.fv_template);
            await api.mfa.validateCode(resp, B$1.FINGER_VEIN);
          }
        } catch (e) {
          if (e.retCode) {
            form.value.toggleAlert(`errors.fv.${e.retCode}`, {
              dismissible: false
            });
          } else if (e.error) {
            form.value.toggleAlert(`errors.${e.error}`, {
              dismissible: false
            });
          }

          throw e;
        } finally {
          loading.value = false;
        }
      }

    };
  }

});

const _hoisted_1$7 = {
  style: {
    "position": "relative"
  }
};
const _hoisted_2$7 = {
  class: "pa__widget-info-section"
};
const _hoisted_3$7 = {
  class: "pa__hands_container"
};
const _hoisted_4$7 = {
  key: 1,
  style: {
    "margin-bottom": "8px"
  },
  class: "pa__subtitle-2 pa__text-left"
};
const _hoisted_5$7 = {
  key: 2,
  class: "pa__subtitle-2 pa__text-left"
};
const _hoisted_6$5 = {
  class: "pa__widget-content-actions"
};
const _hoisted_7$3 = {
  key: 3,
  style: {
    "position": "absolute",
    "top": "0",
    "bottom": "0",
    "right": "0",
    "display": "flex",
    "align-items": "center",
    "flex-direction": "column",
    "left": "0",
    "justify-content": "center",
    "background": "white",
    "opacity": "1"
  }
};
const _hoisted_8$3 = {
  key: 0,
  style: {
    "margin-top": "12px",
    "font-size": "0.9em"
  }
};
const _hoisted_9$3 = {
  key: 0,
  class: "pa__widget-helpers-section"
};
const _hoisted_10$3 = {
  href: "/signin/challenge"
};
function render$7(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Hand = Mo("Hand");

  const _component_GenericForm = Mo("GenericForm");

  const _component_p_btn = Mo("p-btn");

  const _component_p_loading = Mo("p-loading");

  const _directive_t = Bo("t");

  return Hr(), qr(Br, null, [ns("div", _hoisted_1$7, [_ctx.deviceOk && (!_ctx.context.details.fv_template || _ctx.context.details.fv_template.length === 0) ? (Hr(), qr(Br, {
    key: 0
  }, [ns("div", _hoisted_2$7, [Lo(ns("h2", null, null, 512), [[_directive_t, 'mfa.fv.enroll']])]), ns("div", _hoisted_3$7, [os(_component_Hand, {
    class: c({
      'disabled': _ctx.loading
    }),
    selected: _ctx.enrolledFingers.left,
    onSelect: _cache[0] || (_cache[0] = $event => _ctx.onFingerSelect($event, 'left'))
  }, null, 8, ["class", "selected"]), os(_component_Hand, {
    class: c({
      'disabled': _ctx.loading
    }),
    style: {
      "transform": "rotateY(180deg)"
    },
    selected: _ctx.enrolledFingers.right,
    onSelect: _cache[1] || (_cache[1] = $event => _ctx.onFingerSelect($event, 'right'))
  }, null, 8, ["class", "selected"])])], 64)) : !_ctx.deviceOk ? Lo((Hr(), qr("div", _hoisted_4$7, null, 512)), [[_directive_t, {
    path: 'mfa.fv.checkDevice'
  }]]) : Lo((Hr(), qr("div", _hoisted_5$7, null, 512)), [[_directive_t, {
    path: 'mfa.fv.verify'
  }]]), os(_component_GenericForm, {
    ref: "form",
    style: {
      "padding-top": "24px"
    },
    fields: _ctx.finalFields,
    validate: _ctx.validate,
    submit: _ctx.submit
  }, null, 8, ["fields", "validate", "submit"]), ns("div", _hoisted_6$5, [_ctx.deviceOk ? (Hr(), Jr(_component_p_btn, {
    key: 0,
    block: "",
    color: "primary",
    loading: _ctx.loading,
    onClick: _ctx.submit
  }, {
    default: An(() => {
      var _ctx$context$details$;

      return [Lo(ns("span", null, null, 512), [[_directive_t, ((_ctx$context$details$ = _ctx.context.details.fv_template) === null || _ctx$context$details$ === void 0 ? void 0 : _ctx$context$details$.length) > 0 ? 'common.verify' : 'common.submit']])];
    }),
    _: 1
  }, 8, ["loading", "onClick"])) : cs("", true)]), _ctx.loading ? (Hr(), qr("div", _hoisted_7$3, [os(_component_p_loading, {
    color: "primary",
    indeterminate: ""
  }), _ctx.loadingMsg ? Lo((Hr(), qr("div", _hoisted_8$3, null, 512)), [[_directive_t, _ctx.loadingMsg]]) : cs("", true)])) : cs("", true)]), _ctx.context.details.challenges.length > 1 ? (Hr(), qr("div", _hoisted_9$3, [Lo(ns("a", _hoisted_10$3, null, 512), [[_directive_t, 'mfa.tryAnotherWay']])])) : cs("", true)], 64);
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$1 = ".pa__hands_container {\n  padding: 12px 0;\n  display: flex;\n}\n.pa__hands_container .pa__st0 {\n  fill: transparent;\n  z-index: 1;\n  cursor: pointer;\n}\n.pa__hands_container .pa__st0:hover + .pa__finger {\n  fill: #0D47A1;\n}\n.pa__hands_container .pa__finger:hover {\n  fill: #0D47A1;\n  cursor: pointer;\n}\n.pa__hands_container .pa__hand:first-of-type {\n  margin-right: 14px;\n}\n.pa__hands_container .pa__hand path {\n  fill: #262626;\n}\n.pa__hands_container .pa__hand .pa__selected {\n  pointer-events: none;\n}\n.pa__hands_container .pa__hand .pa__selected .pa__finger {\n  fill: #6bbb40;\n}\n.pa__hands_container .pa__hand .pa__thumb_container, .pa__hands_container .pa__hand .pa__little_container, .pa__hands_container .pa__hand .pa__palm {\n  pointer-events: none;\n}\n.pa__hands_container .pa__hand .pa__thumb_container path, .pa__hands_container .pa__hand .pa__little_container path, .pa__hands_container .pa__hand .pa__palm path {\n  fill: gray;\n  opacity: 0.3;\n}";
styleInject(css_248z$1);

script$7.render = render$7;

var script$6 = io({
  name: 'OTP',
  components: {
    GenericForm: script$e
  },
  props: _objectSpread2({}, CustomizableFormProps),

  setup(props) {
    const api = Un('api');
    const context = Un('context');
    const code = Ft(null);
    const error = Ft(null);
    const defaultFields = {
      code: {
        type: 'code',
        value: null
      }
    };
    const {
      form,
      loading,
      submit,
      fields: finalFields,
      validate
    } = form_generics.call(props, defaultFields, async fieldWithValues => {
      try {
        await api.mfa.validateCode(fieldWithValues.code, B$1.OTP);
      } catch (e) {
        if (e.error) {
          form.value.toggleAlert(`errors.${e.error}`, {
            dismissible: false
          });
        }

        throw e;
      }
    });
    return {
      finalFields,
      validate,
      code,
      context,
      error,
      form,
      loading,
      submit
    };
  }

});

const _hoisted_1$6 = /*#__PURE__*/ns("h4", null, [/*#__PURE__*/is(" 1. Download Google Authenticator "), /*#__PURE__*/ns("a", {
  target: "_blank",
  href: "https://play.google.com/store/apps/\ndetails?id=com.google.android.apps.authenticator2"
}, " Android "), /*#__PURE__*/is(" / "), /*#__PURE__*/ns("a", {
  href: "https://apps.apple.com/us/app/google-authenticator/id388497605",
  target: "_blank"
}, "iOS")], -1);

const _hoisted_2$6 = /*#__PURE__*/ns("p", null, " Google Authenticator can be downloaded from the App store or Google Play. Search \"Google Authenticator\" and proceed to download. ", -1);

const _hoisted_3$6 = /*#__PURE__*/ns("h4", null, "2. Add Authentication Token in Google 2FA and keep the key phrase", -1);

const _hoisted_4$6 = /*#__PURE__*/ns("p", null, [/*#__PURE__*/is(" Open Google 2FA, scan below QR code or manually enter the key phrase to add a token. "), /*#__PURE__*/ns("br"), /*#__PURE__*/is(" Key Phrase is used to recover Google 2FA in the case of phone loss or change. Please make sure to keep the key phrase; in a safe location before binding. ")], -1);

const _hoisted_5$6 = {
  class: "pa__logo-container"
};
const _hoisted_6$4 = ["src"];
const _hoisted_7$2 = {
  style: {
    "text-align": "center",
    "background-color": "lightgray",
    "border": "1px solid black"
  }
};

const _hoisted_8$2 = /*#__PURE__*/ns("h4", null, "3. Enable Google Two Factor Authentication", -1);

const _hoisted_9$2 = {
  key: 1,
  class: "pa__subtitle-2 pa__text-left"
};
const _hoisted_10$2 = {
  class: "pa__widget-content-actions"
};
const _hoisted_11$1 = {
  key: 2,
  class: "pa__widget-helpers-section"
};
const _hoisted_12 = {
  href: "/signin/challenge"
};
function render$6(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_GenericForm = Mo("GenericForm");

  const _component_p_btn = Mo("p-btn");

  const _directive_t = Bo("t");

  return Hr(), qr(Br, null, [_ctx.context.details.dataUrl ? (Hr(), qr(Br, {
    key: 0
  }, [_hoisted_1$6, _hoisted_2$6, _hoisted_3$6, _hoisted_4$6, ns("div", _hoisted_5$6, [ns("img", {
    id: "mainLogo",
    class: "pa__logo",
    alt: "Logo",
    style: {
      "max-width": "300px",
      "max-height": "300px"
    },
    src: _ctx.context.details.dataUrl
  }, null, 8, _hoisted_6$4)]), ns("h3", _hoisted_7$2, p(_ctx.context.details.secret), 1), _hoisted_8$2], 64)) : Lo((Hr(), qr("div", _hoisted_9$2, null, 512)), [[_directive_t, {
    path: 'mfa.otp.title'
  }]]), os(_component_GenericForm, {
    ref: "form",
    fields: _ctx.finalFields,
    validate: _ctx.validate,
    submit: _ctx.submit
  }, null, 8, ["fields", "validate", "submit"]), ns("div", _hoisted_10$2, [os(_component_p_btn, {
    block: "",
    color: "primary",
    loading: _ctx.loading,
    onClick: _ctx.submit
  }, {
    default: An(() => [Lo(ns("span", null, null, 512), [[_directive_t, 'common.submit']])]),
    _: 1
  }, 8, ["loading", "onClick"])]), _ctx.context.details.challenges.length > 1 ? (Hr(), qr("div", _hoisted_11$1, [Lo(ns("a", _hoisted_12, null, 512), [[_directive_t, 'mfa.tryAnotherWay']])])) : cs("", true)], 64);
}

script$6.render = render$6;

var PTimer = io({
  name: 'PTimer',
  props: {
    duration: {
      type: Number,
      default: 0
    }
  },

  setup(props) {
    const durationRef = Ft(props.duration);
    let timeout = null;
    wo(() => {
      timeout = setInterval(() => {
        durationRef.value--;

        if (durationRef.value < 1) {
          clearInterval(timeout);
        }
      }, 1000);
    });
    Ao(() => {
      clearInterval(timeout);
    });
    return {
      durationRef
    };
  },

  render() {
    return Ws('div', {
      class: ['pa__timer--circle'],
      style: {
        borderColor: this.durationRef > 0 ? 'orange' : 'red'
      }
    }, Ws('span', {
      class: ['pa__timer--seconds']
    }, this.durationRef));
  }

});

var script$5 = io({
  name: 'SMS',
  components: {
    PTimer,
    GenericForm: script$e
  },
  props: _objectSpread2({
    timerEnabled: {
      type: Boolean,
      default: true
    }
  }, CustomizableFormProps),

  setup(props) {
    const api = Un('api');
    const context = Un('context');
    const defaultFields = {
      code: {
        type: 'text',
        label: 'common.fields.code'
      }
    };
    const {
      form,
      loading,
      submit,
      validate,
      fields: finalFields
    } = form_generics.call(props, defaultFields, async fieldWithValues => {
      try {
        await api.mfa.validateCode(fieldWithValues.code, B$1.SMS);
      } catch (e) {
        if (e.error) {
          form.value.toggleAlert(`errors.${e.error}`, {
            dismissible: false
          });
        }

        throw e;
      }
    });
    return {
      loading,
      finalFields,
      form,
      context,
      validate,
      submit
    };
  }

});

const _hoisted_1$5 = /*#__PURE__*/ns("div", {
  class: "pa__logo-container"
}, [/*#__PURE__*/ns("img", {
  id: "mainLogo",
  style: {
    "margin-left": "30px"
  },
  class: "pa__logo",
  alt: "Logo",
  src: "https://api.plusauth.com/assets/images/icons/message-on-phone.svg"
})], -1);

const _hoisted_2$5 = {
  class: "pa__widget-info-section"
};
const _hoisted_3$5 = {
  class: "pa__widget-content-actions"
};
const _hoisted_4$5 = {
  key: 0,
  class: "pa__widget-helpers-section"
};
const _hoisted_5$5 = {
  href: "/signin/challenge"
};
function render$5(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PTimer = Mo("PTimer");

  const _component_GenericForm = Mo("GenericForm");

  const _component_p_btn = Mo("p-btn");

  const _directive_t = Bo("t");

  return Hr(), qr(Br, null, [_hoisted_1$5, ns("div", _hoisted_2$5, [_ctx.timerEnabled ? (Hr(), Jr(_component_PTimer, {
    key: 0,
    class: "pa__challenge-timer",
    duration: 120
  })) : cs("", true), Lo(ns("h2", null, null, 512), [[_directive_t, {
    path: 'mfa.sms.title',
    args: {
      phone_number: _ctx.context.details.phone_number
    }
  }]])]), os(_component_GenericForm, {
    ref: "form",
    fields: _ctx.finalFields,
    validate: _ctx.validate,
    submit: _ctx.submit
  }, null, 8, ["fields", "validate", "submit"]), ns("div", _hoisted_3$5, [os(_component_p_btn, {
    block: "",
    color: "primary",
    loading: _ctx.loading,
    onClick: _ctx.submit
  }, {
    default: An(() => [Lo(ns("span", null, null, 512), [[_directive_t, 'common.submit']])]),
    _: 1
  }, 8, ["loading", "onClick"])]), _ctx.context.details.challenges.length > 1 ? (Hr(), qr("div", _hoisted_4$5, [Lo(ns("a", _hoisted_5$5, null, 512), [[_directive_t, 'mfa.tryAnotherWay']])])) : cs("", true)], 64);
}

script$5.render = render$5;

var script$4 = io({
  name: 'WebAuthN',
  components: {
    GenericForm: script$e
  },
  props: _objectSpread2({}, CustomizableFormProps),

  setup(props) {
    const api = Un('api');
    const context = Un('context');
    const translator = Un(translatorKey);
    const code = Ft(null);
    const error = Ft(null);
    const loadingMsg = Ft(null);
    const defaultFields = {
      code: {
        type: 'code',
        visible: false,
        value: null
      }
    };
    const {
      form,
      loading,
      submit,
      fields: finalFields,
      validate
    } = form_generics.call(props, defaultFields, async fieldWithValues => {
      try {
        await api.mfa.validateCode(fieldWithValues.code, B$1.WEBAUTHN);
      } catch (e) {
        if (e.error) {
          form.value.toggleAlert(`errors.${e.error}`, {
            dismissible: false
          });
        }

        throw e;
      }
    });
    wo(async () => {
      loading.value = true;

      if (!b$1()) {
        form.value.toggleAlert('errors.webauthn.not_supported', {
          dismissible: false
        });
        loading.value = false;
      } else {
        try {
          if (context.details.authentication_options) {
            loadingMsg.value = 'Select one of your security key/devices';
            finalFields.code.value = await L$1(context.details.authentication_options);
          } else if (context.details.registration_options) {
            loadingMsg.value = 'Registration a security key/device';
            finalFields.code.value = await H$1(context.details.registration_options);
          } else {
            throw new Error('WebAuthN options not found');
          }
        } catch (e) {
          if (e.error || e.message) {
            form.value.toggleAlert(`${translator.t('errors.webauthn.operation_failed')}<br>
<strong>${e.error || e.message}</strong>`, {
              dismissible: false
            });
          }

          loading.value = false;
          throw e;
        }

        loadingMsg.value = translator.t('mfa.webauthn.verifying');
        await submit();
      }
    });
    return {
      finalFields,
      validate,
      code,
      context,
      error,
      form,
      loading,
      loadingMsg,
      submit
    };
  }

});

const _hoisted_1$4 = {
  style: {
    "position": "relative"
  }
};
const _hoisted_2$4 = {
  class: "pa__widget-info-section"
};
const _hoisted_3$4 = {
  key: 0,
  style: {
    "position": "absolute",
    "top": "0",
    "bottom": "0",
    "right": "0",
    "display": "flex",
    "align-items": "center",
    "flex-direction": "column",
    "left": "0",
    "justify-content": "center",
    "background": "white",
    "opacity": "1"
  }
};
const _hoisted_4$4 = {
  key: 0,
  style: {
    "margin-top": "12px",
    "font-size": "0.9em"
  }
};
const _hoisted_5$4 = {
  key: 0,
  class: "pa__widget-helpers-section"
};
const _hoisted_6$3 = {
  href: "/signin/challenge"
};
function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_p_loading = Mo("p-loading");

  const _component_GenericForm = Mo("GenericForm");

  const _directive_t = Bo("t");

  return Hr(), qr("div", _hoisted_1$4, [ns("div", _hoisted_2$4, [_ctx.loading ? (Hr(), qr("div", _hoisted_3$4, [os(_component_p_loading, {
    color: "primary",
    indeterminate: ""
  }), _ctx.loadingMsg ? Lo((Hr(), qr("div", _hoisted_4$4, null, 512)), [[_directive_t, _ctx.loadingMsg]]) : cs("", true)])) : cs("", true), os(_component_GenericForm, {
    ref: "form",
    fields: _ctx.finalFields,
    validate: _ctx.validate,
    submit: _ctx.submit
  }, null, 8, ["fields", "validate", "submit"])]), _ctx.context.details.challenges.length > 1 ? (Hr(), qr("div", _hoisted_5$4, [Lo(ns("a", _hoisted_6$3, null, 512), [[_directive_t, 'mfa.tryAnotherWay']])])) : cs("", true)]);
}

script$4.render = render$4;

var script$3 = io({
  name: 'Register',
  components: {
    GenericForm: script$e,
    SocialConnectionButton,
    PasswordStrength
  },
  props: _objectSpread2({
    features: {
      type: Object,
      default: () => ({
        socialConnections: true,
        forgotPassword: true
      })
    },
    socialConnections: {
      type: Array,
      default: () => ['google', 'facebook']
    }
  }, CustomizableFormProps),

  setup(props) {
    const api = Un('api');
    const context = Un('context');
    useRouter();
    const defaultFields = {
      username: {
        order: 0,
        attrs: {
          autocomplete: 'username'
        },
        type: 'text',
        label: 'common.fields.username'
      },
      password: {
        order: 1,
        type: 'password',
        label: 'common.fields.password',
        attrs: {
          autocomplete: 'new-password'
        },

        async validator(fields, value) {
          var _context$settings;

          return api.auth.checkPasswordStrength(value, ((_context$settings = context.settings) === null || _context$settings === void 0 ? void 0 : _context$settings.passwordPolicy) || {});
        }

      },
      rePassword: {
        order: 2,
        type: 'password',
        label: 'common.fields.rePassword',
        attrs: {
          autocomplete: 'new-password'
        },

        validator(fields, value) {
          if (fields.password.value !== value) {
            return this.$t('errors.passwords_not_match');
          }

          return true;
        }

      }
    };
    const {
      form,
      loading,
      submit,
      validate,
      fields: finalFields
    } = form_generics.call(props, defaultFields, async fieldWithValues => {
      try {
        const result = await api.auth.signUp(fieldWithValues);

        if (result && result.message === 'verification_email_sent') {
          var _finalFields$email;

          context.details.email = (_finalFields$email = finalFields.email) === null || _finalFields$email === void 0 ? void 0 : _finalFields$email.value;
          context.details.email_verified = false;
          window.location.assign('/account/verifyEmail');
        }
      } catch (e) {
        switch (e.error) {
          case 'already_exists':
            finalFields.email ? finalFields.email.errors = `errors.${e.error}` : finalFields.username ? finalFields.username.errors = `errors.${e.error}` : null;
            break;

          case 'email_not_verified':
            window.location.assign('/account/verifyEmail');
            break;

          default:
            if (finalFields.password) {
              finalFields.password['errors'] = `errors.${e.error || e.message || e.name || e}`;
            }

        }

        throw e;
      }
    });
    return {
      form,
      context,
      finalFields,
      loading,
      resolveClientLogo,
      validate,
      submit
    };
  }

});

const _hoisted_1$3 = {
  class: "pa__logo-container"
};
const _hoisted_2$3 = ["src"];
const _hoisted_3$3 = {
  class: "pa__widget-info-section"
};
const _hoisted_4$3 = {
  key: 1,
  class: "pa__messages pa__input-details"
};
const _hoisted_5$3 = {
  class: "pa__widget-content-actions"
};
const _hoisted_6$2 = {
  key: 0,
  class: "pa__widget-social-section"
};
const _hoisted_7$1 = {
  class: "pa__widget-social-icons"
};
const _hoisted_8$1 = {
  class: "pa__widget-helpers-section"
};
const _hoisted_9$1 = {
  key: 0
};
const _hoisted_10$1 = {
  href: "/signin/recovery"
};
function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PasswordStrength = Mo("PasswordStrength");

  const _component_GenericForm = Mo("GenericForm");

  const _component_p_btn = Mo("p-btn");

  const _component_SocialConnectionButton = Mo("SocialConnectionButton");

  const _directive_t = Bo("t");

  return Hr(), qr(Br, null, [ns("div", _hoisted_1$3, [ns("img", {
    class: "pa__logo",
    alt: "Logo",
    src: _ctx.resolveClientLogo(_ctx.context.client)
  }, null, 8, _hoisted_2$3)]), ns("div", _hoisted_3$3, [Lo(ns("h1", null, null, 512), [[_directive_t, 'register.title']])]), os(_component_GenericForm, {
    ref: "form",
    fields: _ctx.finalFields,
    validate: _ctx.validate,
    submit: _ctx.submit
  }, {
    "password.message": An(_ref => {
      var _ctx$context$settings;

      let {
        message: [message],
        focus,
        hasState
      } = _ref;
      return [focus || hasState ? (Hr(), Jr(_component_PasswordStrength, {
        key: 0,
        rules: (_ctx$context$settings = _ctx.context.settings) === null || _ctx$context$settings === void 0 ? void 0 : _ctx$context$settings.passwordPolicy,
        class: "pa__input-details",
        message: message
      }, null, 8, ["rules", "message"])) : (Hr(), qr("div", _hoisted_4$3))];
    }),
    _: 1
  }, 8, ["fields", "validate", "submit"]), ns("div", _hoisted_5$3, [os(_component_p_btn, {
    color: "primary",
    loading: _ctx.loading,
    block: "",
    onClick: _ctx.submit
  }, {
    default: An(() => [Lo(ns("span", null, null, 512), [[_directive_t, 'register.signUp']])]),
    _: 1
  }, 8, ["loading", "onClick"])]), _ctx.features.socialConnections && _ctx.context.client && _ctx.context.client.social && _ctx.context.client.social.length ? (Hr(), qr("div", _hoisted_6$2, [Lo(ns("h4", null, null, 512), [[_directive_t, 'login.signInWith']]), ns("div", _hoisted_7$1, [(Hr(true), qr(Br, null, jo(_ctx.context.client.social, connection => {
    return Hr(), Jr(_component_SocialConnectionButton, {
      key: connection,
      type: connection,
      href: '/social?provider=' + connection
    }, null, 8, ["type", "href"]);
  }), 128))])])) : cs("", true), ns("div", _hoisted_8$1, [Lo(ns("span", null, null, 512), [[_directive_t, 'register.haveAccount']]), Lo(ns("a", {
    href: "/signin",
    onClick: _cache[0] || (_cache[0] = cl(() => {}, ["stop"]))
  }, null, 512), [[_directive_t, 'login.signIn']]), _ctx.features.forgotPassword ? (Hr(), qr("div", _hoisted_9$1, [Lo(ns("a", _hoisted_10$1, null, 512), [[_directive_t, 'login.forgotPassword']])])) : cs("", true)])], 64);
}

script$3.render = render$3;

var script$2 = io({
  name: 'ResetPassword',
  components: {
    GenericForm: script$e,
    PasswordStrength
  },
  props: _objectSpread2({
    features: {
      type: Object,
      default: () => ({
        socialConnections: true,
        signUp: true,
        resetPassword: true
      })
    }
  }, CustomizableFormProps),

  setup(props) {
    const api = Un('api');
    const context = Un('context');
    const actionCompleted = Ft(false);
    const route = useRoute();
    const defaultFields = {
      password: {
        type: 'password',
        label: 'common.fields.newPassword',
        attrs: {
          autocomplete: 'new-password'
        },

        async validator(fields, value) {
          var _context$settings;

          return api.auth.checkPasswordStrength(value, ((_context$settings = context.settings) === null || _context$settings === void 0 ? void 0 : _context$settings.passwordPolicy) || {});
        }

      },
      rePassword: {
        type: 'password',
        label: 'common.fields.rePassword',

        validator(fields, value) {
          if (fields.password.value !== value) {
            return this.$t('errors.passwords_not_match');
          }

          return true;
        }

      }
    };
    const {
      form,
      loading,
      submit,
      validate,
      fields: finalFields
    } = form_generics.call(props, defaultFields, async fieldWithValues => {
      try {
        await api.auth.resetPassword(fieldWithValues.password, route.params.token);
        actionCompleted.value = true;
      } catch (e) {
        if (finalFields.password) {
          finalFields.password['errors'] = `errors.${e.error}`;
        }

        throw e;
      }
    });
    return {
      finalFields,
      form,
      context,
      actionCompleted,
      loading,
      resolveClientLogo,
      validate,
      submit
    };
  }

});

const _hoisted_1$2 = {
  key: 0
};
const _hoisted_2$2 = {
  class: "pa__logo-container"
};
const _hoisted_3$2 = ["src"];
const _hoisted_4$2 = {
  class: "pa__widget-info-section"
};
const _hoisted_5$2 = {
  key: 1,
  class: "pa__messages pa__input-details"
};
const _hoisted_6$1 = {
  class: "pa__widget-content-actions"
};
function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PasswordStrength = Mo("PasswordStrength");

  const _component_GenericForm = Mo("GenericForm");

  const _component_p_btn = Mo("p-btn");

  const _directive_t = Bo("t");

  return _ctx.actionCompleted ? Lo((Hr(), qr("div", _hoisted_1$2, null, 512)), [[_directive_t, 'resetPassword.successfullyReset']]) : (Hr(), qr(Br, {
    key: 1
  }, [ns("div", _hoisted_2$2, [ns("img", {
    class: "pa__logo",
    alt: "Logo",
    src: _ctx.resolveClientLogo(_ctx.context.client)
  }, null, 8, _hoisted_3$2)]), ns("div", _hoisted_4$2, [Lo(ns("h1", null, null, 512), [[_directive_t, 'resetPassword.title']])]), os(_component_GenericForm, {
    ref: "form",
    fields: _ctx.finalFields,
    validate: _ctx.validate,
    submit: _ctx.submit
  }, {
    "password.message": An(_ref => {
      var _ctx$context$settings;

      let {
        message: [message],
        focus,
        hasState
      } = _ref;
      return [focus || hasState ? (Hr(), Jr(_component_PasswordStrength, {
        key: 0,
        rules: (_ctx$context$settings = _ctx.context.settings) === null || _ctx$context$settings === void 0 ? void 0 : _ctx$context$settings.passwordPolicy,
        class: "pa__input-details",
        message: message
      }, null, 8, ["rules", "message"])) : (Hr(), qr("div", _hoisted_5$2))];
    }),
    _: 1
  }, 8, ["fields", "validate", "submit"]), ns("div", _hoisted_6$1, [os(_component_p_btn, {
    color: "primary",
    loading: _ctx.loading,
    block: "",
    onClick: _ctx.submit
  }, {
    default: An(() => [Lo(ns("span", null, null, 512), [[_directive_t, 'common.submit']])]),
    _: 1
  }, 8, ["loading", "onClick"])])], 64));
}

script$2.render = render$2;

function parseQueryUrl(value) {
  const result = {};
  value = value.trim().replace(/^(\?|#|&)/, '');

  if (!value) {
    return null;
  }

  const params = value.split('&');

  for (let i = 0; i < params.length; i += 1) {
    const paramAndValue = params[i];
    const parts = paramAndValue.split('=');
    const key = decodeURIComponent(parts.shift());
    const value = parts.length > 0 ? parts.join('=') : '';
    if (key) result[key] = decodeURIComponent(value);
  }

  return result;
}

var script$1 = io({
  name: 'VerifyEmail',
  props: {
    features: {
      type: Object,
      default: () => ({
        socialConnections: true,
        signUp: true,
        resetPassword: true
      })
    }
  },

  setup() {
    var _context$error, _context$details;

    const context = Un('context');
    const actionCompleted = Ft(false);
    const error = (_context$error = context.error) === null || _context$error === void 0 ? void 0 : _context$error.error;
    let loginUrl = context.autoSignIn && ((_context$details = context.details) === null || _context$details === void 0 ? void 0 : _context$details.tenantLoginUrl);
    let time = Ft(5);
    const queryParams = parseQueryUrl(window.location.search);
    const resendLink = `${window.location.pathname}/resend`;
    wo(() => {
      var _context$prompt;

      if ((_context$prompt = context.prompt) !== null && _context$prompt !== void 0 && _context$prompt.mode && context.prompt.mode !== 'check' && context.autoSignIn && !error) {
        setInterval(() => {
          time.value && time.value--;
        }, 1000);
        setTimeout(() => {
          if (loginUrl) {
            window.location.replace(loginUrl);
          }
        }, 5000);
      }
    });
    return {
      time,
      context,
      actionCompleted,
      error,
      loginUrl,
      resendLink,
      resolveClientLogo,
      queryParams
    };
  }

});

const _hoisted_1$1 = /*#__PURE__*/ns("div", {
  class: "pa__logo-container"
}, [/*#__PURE__*/ns("img", {
  src: "https://api.plusauth.com/assets/images/icons/email_error.svg",
  class: "pa__logo",
  alt: "Mail Confirmation"
})], -1);

const _hoisted_2$1 = {
  class: "pa__widget-info-section"
};

const _hoisted_3$1 = /*#__PURE__*/ns("div", {
  class: "pa__logo-container"
}, [/*#__PURE__*/ns("img", {
  src: "https://api.plusauth.com/assets/images/icons/plane.svg",
  class: "pa__logo",
  alt: "Mail Confirmation"
})], -1);

const _hoisted_4$1 = {
  class: "pa__widget-info-section"
};
const _hoisted_5$1 = {
  class: "pa__widget-content-footer"
};
const _hoisted_6 = {
  align: "center"
};
const _hoisted_7 = {
  style: {
    "padding-right": "4px"
  }
};
const _hoisted_8 = ["href"];

const _hoisted_9 = /*#__PURE__*/ns("div", {
  class: "pa__logo-container"
}, [/*#__PURE__*/ns("img", {
  src: "https://api.plusauth.com/assets/images/icons/mail_confirm.svg",
  class: "pa__logo",
  alt: "Mail Confirmation"
})], -1);

const _hoisted_10 = {
  class: "pa__widget-info-section"
};
const _hoisted_11 = {
  key: 0
};
function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  var _ctx$context$prompt;

  const _directive_t = Bo("t");

  return _ctx.error ? (Hr(), qr(Br, {
    key: 0
  }, [_hoisted_1$1, ns("div", _hoisted_2$1, [Lo(ns("h1", null, null, 512), [[_directive_t, 'errors.' + _ctx.error]])])], 64)) : ((_ctx$context$prompt = _ctx.context.prompt) === null || _ctx$context$prompt === void 0 ? void 0 : _ctx$context$prompt.mode) === 'check' || !_ctx.context.details.email_verified ? (Hr(), qr(Br, {
    key: 1
  }, [_hoisted_3$1, ns("div", _hoisted_4$1, [Lo(ns("h1", null, null, 512), [[_directive_t, 'verifyEmail.title']]), Lo(ns("h2", null, null, 512), [[_directive_t, {
    path: 'verifyEmail.checkText',
    args: {
      email: _ctx.context.details.email
    }
  }]])]), ns("div", _hoisted_5$1, [ns("p", _hoisted_6, [Lo(ns("span", _hoisted_7, null, 512), [[_directive_t, 'verifyEmail.resendText']]), Lo(ns("a", {
    href: _ctx.resendLink
  }, null, 8, _hoisted_8), [[_directive_t, 'verifyEmail.resendAction']])])])], 64)) : (Hr(), qr(Br, {
    key: 2
  }, [_hoisted_9, ns("div", _hoisted_10, [ns("h1", null, [is(" Your email verified successfully. "), _ctx.loginUrl ? (Hr(), qr("span", _hoisted_11, " Redirecting to application in " + p(_ctx.time) + " seconds.", 1)) : cs("", true)])])], 64));
}

script$1.render = render$1;

const PlainRouterView = io({
  render() {
    return Ws(RouterView);
  }

});
const router = settings => createRouter({
  history: location.origin !== 'null' ? createWebHistory() : createMemoryHistory('/'),
  routes: [{
    path: '/signin',
    component: PlainRouterView,
    children: [{
      path: '',
      component: script$b,
      props: settings && settings.modeOptions && settings.modeOptions.login
    }, {
      path: 'consent',
      component: script$f,
      props: settings && settings.modeOptions && settings.modeOptions.consent
    }, {
      path: 'recovery',
      component: script$c,
      props: settings && settings.modeOptions && settings.modeOptions.recovery
    }, {
      path: 'challenge',
      component: PlainRouterView,
      children: [{
        path: '',
        component: script$a,
        props: settings && settings.modeOptions && settings.modeOptions.challenge
      }, {
        path: 'sms',
        name: 'sms',
        component: script$5,
        props: settings && settings.modeOptions && settings.modeOptions.sms
      }, {
        path: 'email',
        name: 'email',
        component: script$9,
        props: settings && settings.modeOptions && settings.modeOptions.email
      }, {
        path: 'otp',
        name: 'otp',
        component: script$6,
        props: settings && settings.modeOptions && settings.modeOptions.otp
      }, {
        path: 'fv',
        name: 'fv',
        component: script$7,
        props: settings && settings.modeOptions && settings.modeOptions.fv
      }, {
        path: 'webauthn',
        name: 'webauthn',
        component: script$4,
        props: settings && settings.modeOptions && settings.modeOptions.webauthn
      }]
    }]
  }, {
    path: '/signup',
    component: script$3,
    props: settings && settings.modeOptions && settings.modeOptions.signup
  }, {
    path: '/account/verifyEmail',
    component: script$1,
    props: settings && settings.modeOptions && settings.modeOptions.verifyEmail
  }, {
    path: '/account/updateMissingInformation',
    component: script$d,
    props: settings && settings.modeOptions && settings.modeOptions.fillMissing
  }, {
    path: '/account/resetPassword/:token?',
    component: script$2,
    props: settings && settings.modeOptions && settings.modeOptions.resetPassword
  }]
});

const _excluded = ["anchor"],
      _excluded2 = ["anchor"];
function parse(theme) {
  let isItem = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  const {
    anchor
  } = theme,
        variant = _objectWithoutProperties(theme, _excluded);

  const colors = Object.keys(variant);
  const parsedTheme = {};

  for (let i = 0; i < colors.length; ++i) {
    const name = colors[i];
    const value = theme[name];
    if (value == null) continue;

    if (isItem) {
      /* istanbul ignore else */
      if (name === 'base' || name.startsWith('lighten') || name.startsWith('darken')) ;
    } else if (typeof value === 'object') {
      parsedTheme[name] = parse(value, true);
    } else {
      parsedTheme[name] = value;
    }
  }

  if (parsedTheme) {
    if (!isItem) {
      parsedTheme.anchor = anchor || parsedTheme.base;
    }
  }

  return parsedTheme;
}
/**
 * Generate the CSS for a base color (.primary)
 */

const genBaseColor = (name, value) => {
  return `
.pa__widget .pa__${name} {
  background-color: ${value} !important;
  border-color: ${value} !important;
}
.pa__widget .pa__${name}--text {
  color: ${value} !important;
  caret-color: ${value} !important;
}`;
};
/**
 * Generate the CSS for a variant color (.primary.darken-2)
 */


const genVariantColor = (name, variant, value) => {
  const [type, n] = variant.split(/(\d)/, 2);
  return `
.pa__widget .pa__${name}.${type}-${n} {
  background-color: ${value} !important;
  border-color: ${value} !important;
}
.pa__widget .pa__${name}--text.text--${type}-${n} {
  color: ${value} !important;
  caret-color: ${value} !important;
}`;
};

const genColorVariableName = function (name) {
  let variant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base';
  return `--pa-${name}-${variant}`;
};

const genColorVariable = function (name) {
  let variant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base';
  return `var(${genColorVariableName(name, variant)})`;
};

function genStyles(theme) {
  let cssVar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  const {
    anchor
  } = theme,
        variant = _objectWithoutProperties(theme, _excluded2);

  const colors = Object.keys(variant);
  if (!colors.length) return '';
  let variablesCss = '';
  let css = '';
  cssVar && (variablesCss += `  ${genColorVariableName('anchor')}: ${anchor};\n`);

  for (let i = 0; i < colors.length; ++i) {
    const name = colors[i];
    const value = theme[name];
    css += genBaseColor(name, cssVar ? genColorVariable(name) : value.base || value);
    cssVar && (variablesCss += `  ${genColorVariableName(name)}: ${value.base};\n`);
    const variants = Object.keys(value);

    for (let i = 0; i < variants.length; ++i) {
      const variant = variants[i];
      const variantValue = value[variant];
      if (variant === 'base') continue;
      css += genVariantColor(name, variant, cssVar ? genColorVariable(name, variant) : variantValue);
      cssVar && (variablesCss += `  ${genColorVariableName(name, variant)}: ${variantValue};\n`);
    }
  }

  if (cssVar) {
    variablesCss = `:root {\n${variablesCss}}\n\n`;
  }

  return variablesCss + css;
}

class Theme {
  constructor(options) {
    _defineProperty(this, "disabled", false);

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "styleEl", void 0);

    _defineProperty(this, "theme", {
      primary: '#1976D2',
      secondary: '#424242',
      accent: '#82B1FF',
      error: '#FF5252',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FB8C00'
    });

    _defineProperty(this, "defaults", this.theme);

    if (options.disable) {
      this.disabled = true;
      return;
    }

    this.options = _objectSpread2(_objectSpread2({}, this.options), options.options);
    const theme = options.theme || {};
    this.theme = Object.assign({}, this.theme, theme);
  } // When setting css, check for element
  // and apply new values


  set css(val) {
    this.checkOrCreateStyleElement() && (this.styleEl.innerHTML = val);
  } // Apply current theme default
  // only called on client side


  applyTheme() {
    if (this.disabled) return this.clearCss();
    this.css = this.generatedStyles;
  }

  clearCss() {
    this.css = '';
  } // Initialize theme for SSR and SPA
  // Attach to ssrContext head or
  // apply new theme to document


  init() {
    if (this.disabled) return;
    this.initTheme();
  } // Allows for you to set target theme


  setTheme(value) {
    this.theme = Object.assign(this.theme, value);
    this.applyTheme();
  } // Reset theme defaults


  resetThemes() {
    this.theme = Object.assign({}, this.defaults);
    this.applyTheme();
  } // Check for existence of style element


  checkOrCreateStyleElement() {
    this.styleEl = document.getElementById('plusauth-theme-stylesheet');
    /* istanbul ignore next */

    if (this.styleEl) return true;
    this.genStyleElement(); // If doesn't have it, create it

    return Boolean(this.styleEl);
  } // Generate the style element
  // if applicable


  genStyleElement() {
    if (typeof document === 'undefined') return;
    /* istanbul ignore next */

    const options = this.options || {};
    this.styleEl = document.createElement('style');
    this.styleEl.type = 'text/css';
    this.styleEl.id = 'plusauth-theme-stylesheet';

    if (options.cspNonce) {
      this.styleEl.setAttribute('nonce', options.cspNonce);
    }

    document.head.appendChild(this.styleEl);
  }

  initTheme() {
    // Only watch for reactivity on client side
    if (typeof document === 'undefined') return;
  }

  get currentTheme() {
    return this.theme;
  }

  get generatedStyles() {
    const theme = this.parsedTheme;
    /* istanbul ignore next */

    const options = this.options || {};
    let css;

    if (options.themeCache != null) {
      css = options.themeCache.get(theme);
      /* istanbul ignore if */

      if (css != null) return css;
    }

    css = genStyles(theme, options.customProperties);

    if (options.minifyTheme != null) {
      css = options.minifyTheme(css);
    }

    if (options.themeCache != null) {
      options.themeCache.set(theme, css);
    }

    return css;
  }

  get parsedTheme() {
    /* istanbul ignore next */
    const theme = this.currentTheme || {};
    return parse(theme);
  }

}

_defineProperty(Theme, "property", 'theme');

var css_248z = "@charset \"UTF-8\";\n@import url(https://fonts.googleapis.com/css?family=Montserrat&display=swap);\n/** Ripples */\n/** Elements */\n.pa__widget {\n  font-family: \"Montserrat\", sans-serif;\n  height: 100%;\n  /** Ripples */\n  /** Elements */\n  /** Ripples */\n  /** Elements */\n}\n.pa__widget p {\n  margin: 0;\n}\n.pa__widget button,\n.pa__widget input,\n.pa__widget select {\n  background-color: transparent;\n  border-style: none;\n}\n@media (min-width: 601px) {\n  .pa__widget {\n    display: flex;\n    flex-direction: column;\n    position: relative;\n    justify-content: center;\n  }\n}\n.pa__widget-info-section {\n  text-align: center;\n}\n.pa__widget-social-section {\n  padding: 12px 0;\n  text-align: center;\n}\n.pa__widget-social-section + .pa__widget-helpers-section {\n  padding: 0;\n}\n.pa__widget-helpers-section {\n  text-align: center;\n  padding: 12px 0 0;\n  line-height: 24px;\n}\n.pa__widget-helpers-section a {\n  padding-left: 4px;\n}\n.pa__widget-social-icons {\n  display: flex;\n  justify-content: center;\n  padding-top: 4px;\n}\n.pa__widget-social-icon {\n  width: 36px !important;\n  height: 36px !important;\n  border-radius: 50%;\n  margin: 0 4px;\n}\n.pa__widget-social-icon:hover {\n  filter: brightness(0.8);\n}\n.pa__widget-content {\n  display: flex;\n  flex-direction: column;\n  max-width: 100%;\n  min-height: 100%;\n  position: relative;\n  z-index: 2;\n}\n@media (min-width: 601px) {\n  .pa__widget-content {\n    display: block;\n    flex-shrink: 0;\n    margin: 0 auto;\n    min-height: 0;\n    width: 450px;\n    transition: 0.2s;\n  }\n}\n.pa__widget-content-main {\n  box-flex: 1;\n  flex-grow: 1;\n  overflow: hidden;\n  padding: 24px 24px 36px;\n}\n@media (min-width: 450px) {\n  .pa__widget-content-main {\n    padding: 36px 40px 36px;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n  }\n}\n@media (min-width: 601px) {\n  .pa__widget-content-main {\n    border: 1px solid #dadce0;\n    border-radius: 8px;\n    height: auto;\n    overflow-y: auto;\n    transition: 0.2s;\n  }\n}\n.pa__widget-content-actions {\n  display: flex;\n  justify-content: center;\n  padding-top: 12px;\n}\n.pa__widget-content-footer {\n  border: none;\n  font-size: 14px;\n  margin: 24px -40px -36px;\n  padding: 12px 0;\n}\n@media (min-width: 601px) {\n  .pa__widget-content-footer {\n    border-top: 1px solid #dadce0;\n  }\n}\n.pa__widget-footer {\n  align-items: center;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  font-size: 12px;\n  line-height: 1.4;\n  padding: 0 12px 14px;\n}\n@media (min-width: 450px) {\n  .pa__widget-footer {\n    padding-left: 40px;\n    padding-right: 40px;\n  }\n}\n@media (min-width: 601px) {\n  .pa__widget-footer {\n    padding: 4px 0 0;\n  }\n}\n.pa__widget-footer-link-list {\n  list-style: none;\n  margin: 8px -12px;\n  padding: 0;\n}\n.pa__widget-footer-link-list li {\n  display: inline-block;\n  margin: 0;\n}\n.pa__widget-footer-link-list a {\n  border-radius: 2px;\n  color: #757575;\n  display: inline-block;\n  padding: 6px 16px;\n  transition: background 0.2s;\n}\n@media (min-width: 601px) {\n  .pa__widget-footer-link-list {\n    margin-top: 0;\n    margin-bottom: 0;\n  }\n}\n.pa__widget a {\n  color: #1a73e8;\n  cursor: pointer;\n  font-weight: 500;\n  text-decoration: none;\n  outline: none;\n}\n.pa__widget a:not(.pa__btn):focus {\n  outline: auto;\n}\n.pa__widget h1, .pa__widget h2, .pa__widget h3, .pa__widget h4 {\n  color: #202124;\n  padding-bottom: 0;\n  font-family: \"Montserrat\", \"Noto Sans Myanmar UI\", arial, sans-serif;\n  font-weight: 400;\n  margin-bottom: 0;\n  margin-top: 0;\n}\n.pa__widget h1 {\n  font-size: 20px;\n  padding-top: 16px;\n  font-weight: 400;\n}\n.pa__widget h2 {\n  font-size: 16px;\n  padding-top: 14px;\n  font-weight: 400;\n}\n.pa__widget .pa__logo-container {\n  display: flex;\n  justify-content: center;\n  min-height: 80px;\n}\n.pa__widget .pa__logo-container .pa__logo {\n  max-height: 80px;\n}\n.pa__widget .pa__column {\n  display: flex;\n  flex-direction: column;\n}\n.pa__widget .pa__challenge-timer {\n  margin-top: 16px;\n}\n.pa__widget .pa__signin-challenges {\n  padding-top: 8px;\n}\n.pa__widget .pa__signin-challenges .pa__signin-challenge {\n  text-align: left;\n  justify-content: start;\n}\n.pa__widget .pa__alert {\n  display: block;\n  font-size: 12px;\n  padding: 6px 12px;\n  position: relative;\n  text-align: start;\n  border-radius: 2px;\n}\n.pa__widget .pa__alert--tile {\n  border-radius: 0;\n}\n.pa__widget .pa__alert-dismiss-icon {\n  margin-left: auto;\n  margin-right: -12px;\n  border-radius: 50%;\n  height: 24px;\n  min-width: 24px;\n  font-size: 32px;\n}\n.pa__widget .pa__alert-dismiss-icon:hover {\n  background-color: rgba(184, 184, 184, 0.3);\n  cursor: pointer;\n}\n.pa__widget .pa__alert-content {\n  display: flex;\n  align-items: center;\n}\n.pa__widget .pa__alert.pa__alert--text {\n  background-color: transparent !important;\n  color: inherit;\n}\n.pa__widget .pa__btn {\n  color: rgba(0, 0, 0, 0.87);\n}\n.pa__widget .pa__btn.pa__btn--disabled {\n  color: rgba(0, 0, 0, 0.26) !important;\n}\n.pa__widget .pa__btn.pa__btn--disabled .pa__icon {\n  color: rgba(0, 0, 0, 0.26) !important;\n}\n.pa__widget .pa__btn.pa__btn--disabled:not(.pa__btn--flat):not(.pa__btn--text):not(.pa__btn--outlined) {\n  background-color: rgba(0, 0, 0, 0.12) !important;\n}\n.pa__widget .pa__btn:not(.pa__btn--flat):not(.pa__btn--text):not(.pa__btn--outlined) {\n  background-color: #f5f5f5;\n}\n.pa__widget .pa__btn:hover::before {\n  opacity: 0.04;\n}\n.pa__widget .pa__btn:focus::before {\n  opacity: 0.12;\n}\n.pa__widget .pa__btn {\n  align-items: center;\n  border-radius: 4px;\n  display: inline-flex;\n  flex: 0 0 auto;\n  cursor: pointer;\n  font-weight: 500;\n  letter-spacing: 0.0892857143em;\n  justify-content: center;\n  max-width: 100%;\n  outline: 0;\n  position: relative;\n  text-decoration: none;\n  text-indent: 0.0892857143em;\n  text-transform: uppercase;\n  transition-duration: 0.28s;\n  transition-property: box-shadow, transform, opacity;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  -webkit-user-select: none;\n          user-select: none;\n  vertical-align: middle;\n  white-space: nowrap;\n  font-size: 0.875rem;\n  height: 36px;\n  min-width: 64px;\n  padding: 0 16px;\n}\n.pa__widget .pa__btn:before {\n  border-radius: inherit;\n  bottom: 0;\n  color: inherit;\n  content: \"\";\n  left: 0;\n  opacity: 0;\n  pointer-events: none;\n  position: absolute;\n  right: 0;\n  top: 0;\n  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.6, 1);\n}\n.pa__widget .pa__btn:before {\n  background-color: currentColor;\n}\n.pa__widget .pa__btn:not(.pa__btn--disabled) {\n  will-change: box-shadow;\n}\n.pa__widget .pa__btn:hover:before {\n  opacity: 0.08;\n}\n.pa__widget .pa__btn:focus:before {\n  opacity: 0.24;\n}\n.pa__widget .pa__btn--loading {\n  pointer-events: none;\n  transition: none;\n}\n.pa__widget .pa__btn--fab {\n  height: unset;\n  border-radius: 50%;\n  min-width: 0;\n  min-height: 0;\n  padding: 0;\n}\n.pa__widget .pa__btn__content {\n  align-items: center;\n  color: inherit;\n  display: flex;\n  flex: 1 0 auto;\n  justify-content: inherit;\n  line-height: normal;\n  position: relative;\n}\n.pa__widget .pa__btn__loader {\n  align-items: center;\n  display: flex;\n  height: 100%;\n  justify-content: center;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n.pa__widget .pa__btn--block {\n  display: flex;\n  flex: 1 0 auto;\n  min-width: 100% !important;\n}\n.pa__widget .pa__btn--disabled {\n  box-shadow: none;\n  pointer-events: none;\n}\n.pa__widget .pa__btn--loading {\n  pointer-events: none;\n  transition: none;\n}\n.pa__widget .pa__btn--loading .pa__btn__content {\n  opacity: 0;\n}\n.pa__widget .pa__btn--flat {\n  background-color: transparent;\n}\n.pa__widget .pa__input-checkbox.pa__input {\n  position: relative;\n  color: #cccccc;\n}\n.pa__widget .pa__input-checkbox.pa__input .pa__input--wrap {\n  border: none;\n  align-items: center;\n}\n.pa__widget .pa__input-checkbox.pa__input .pa__input--label {\n  padding-left: 4px;\n  position: relative;\n  display: inline-flex;\n  transform-origin: unset;\n  top: unset;\n  left: unset;\n  transform: unset;\n}\n.pa__widget .pa__input-checkbox.pa__input input[type=checkbox] {\n  position: relative;\n  color: inherit;\n  cursor: pointer;\n  width: 20px;\n  height: 20px;\n}\n.pa__widget .pa__input-checkbox.pa__input input[type=checkbox]:before {\n  content: \"\";\n  display: block;\n  position: absolute;\n  width: 16px;\n  height: 16px;\n  top: -1px;\n  left: -1px;\n  border: 3px solid currentColor;\n  border-radius: 3px;\n  background-color: white;\n}\n.pa__widget .pa__input-checkbox.pa__input input[type=checkbox]:checked:before {\n  background: currentColor;\n}\n.pa__widget .pa__input-checkbox.pa__input input[type=checkbox]:checked:after {\n  content: \"\";\n  display: block;\n  width: 6px;\n  height: 12px;\n  border: solid white;\n  border-width: 0 3px 3px 0;\n  transform: rotate(45deg);\n  position: absolute;\n  top: 1px;\n  left: 6px;\n}\n.pa__widget .pa__code-input {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-around;\n}\n.pa__widget .pa__code-input--digit-box.pa__input {\n  flex: unset;\n}\n.pa__widget .pa__code-input--digit-box.pa__input .pa__input--wrap {\n  max-width: 40px;\n  padding: 1px;\n}\n.pa__widget .pa__code-input--digit-box.pa__input.pa__input-focused .pa__input--wrap {\n  padding: 0;\n  border-width: 2px;\n}\n.pa__widget .pa__code-input--digit-box.pa__input input {\n  max-width: 40px;\n  text-align: center;\n  padding: 0;\n}\n.pa__widget .pa__form {\n  text-align: center;\n}\n.pa__widget .pa__icon {\n  align-items: center;\n  display: inline-flex;\n  font-feature-settings: \"liga\";\n  font-size: 24px;\n  font-style: normal;\n  justify-content: center;\n  letter-spacing: normal;\n  line-height: 1;\n  position: relative;\n  text-indent: 0;\n  vertical-align: middle;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.pa__widget .pa__icon::after {\n  background-color: currentColor;\n  border-radius: 50%;\n  content: \"\";\n  display: inline-block;\n  height: 100%;\n  left: 0;\n  opacity: 0;\n  position: absolute;\n  top: 0;\n  transform: scale(1.3);\n  width: 100%;\n}\n.pa__widget .pa__icon:before {\n  font-size: inherit;\n  text-rendering: auto;\n  line-height: inherit;\n  -webkit-font-smoothing: antialiased;\n}\n.pa__widget a, .pa__widget a:visited, .pa__widget a:active {\n  color: #1976D2;\n}\n.pa__widget .pa__messages {\n  flex: 1 1 auto;\n  font-size: 12px;\n  min-height: 16px;\n  min-width: 1px;\n  position: relative;\n  text-align: left;\n}\n.pa__widget .pa__messages__message {\n  line-height: 16px;\n  word-break: break-word;\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n}\n.pa__widget .pa__pw-strength {\n  font-family: Montserrat-Regular, sans-serif;\n  font-size: 12px;\n  text-align: left;\n  position: relative;\n  padding-left: 4px;\n  display: flex;\n  flex-flow: row wrap;\n}\n.pa__widget .pa__pw-strength .pa__pw-policy {\n  width: 100%;\n}\n@media (min-width: 601px) {\n  .pa__widget .pa__pw-strength .pa__pw-policy {\n    width: 50%;\n  }\n}\n.pa__widget .pa__pw-strength .pa__pw-policy span {\n  padding-right: 4px;\n}\n.pa__widget .pa__progress-circular {\n  position: relative;\n  display: inline-flex;\n  vertical-align: middle;\n  justify-content: center;\n  align-items: center;\n}\n.pa__widget .pa__progress-circular svg {\n  width: 100%;\n  height: 100%;\n  margin: auto;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 0;\n}\n.pa__widget .pa__progress-circular--indeterminate svg {\n  animation: progress-circular-rotate 1.4s linear infinite;\n  transform-origin: center center;\n  transition: all 0.2s ease-in-out;\n}\n.pa__widget .pa__progress-circular--indeterminate .pa__progress-circular__overlay {\n  animation: progress-circular-dash 1.4s ease-in-out infinite;\n  stroke-linecap: round;\n  stroke-dasharray: 80, 200;\n  stroke-dashoffset: 0px;\n}\n.pa__widget .pa__progress-circular__info {\n  align-items: center;\n  display: flex;\n  justify-content: center;\n}\n.pa__widget .pa__progress-circular__underlay {\n  stroke: rgba(0, 0, 0, 0.1);\n  z-index: 1;\n}\n.pa__widget .pa__progress-circular__overlay {\n  stroke: currentColor;\n  z-index: 2;\n  transition: all 0.6s ease-in-out;\n}\n@keyframes progress-circular-dash {\n  0% {\n    stroke-dasharray: 1, 200;\n    stroke-dashoffset: 0px;\n  }\n  50% {\n    stroke-dasharray: 100, 200;\n    stroke-dashoffset: -15px;\n  }\n  100% {\n    stroke-dasharray: 100, 200;\n    stroke-dashoffset: -125px;\n  }\n}\n@keyframes progress-circular-rotate {\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.pa__widget .pa__input-select {\n  position: relative;\n  outline: none;\n}\n.pa__widget .pa__input-select-arrow {\n  position: absolute;\n  top: 38%;\n  right: 10px;\n  transition: transform 0.2s linear;\n  fill: #767676;\n}\n.pa__widget .pa__input-select .pa__input--wrap {\n  cursor: pointer;\n  outline: none;\n}\n.pa__widget .pa__input-select .pa__input-select-items {\n  background: #FFFFFF;\n  color: rgba(0, 0, 0, 0.87);\n  display: none;\n  border-radius: 0px 0px 6px 6px;\n  width: 100%;\n  overflow: auto;\n  max-height: 240px;\n  z-index: 1000;\n  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);\n}\n.pa__widget .pa__input-select .pa__input-select-items .pa__input-select-item {\n  align-items: center;\n  display: flex;\n  flex: 1 1 100%;\n  letter-spacing: normal;\n  min-height: 48px;\n  outline: none;\n  padding: 4px;\n  position: relative;\n  text-decoration: none;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  -webkit-user-select: none;\n          user-select: none;\n  cursor: pointer;\n  background: white;\n}\n.pa__widget .pa__input-select .pa__input-select-items .pa__input-select-item--selected {\n  color: #1976D2 !important;\n  background-color: rgba(0, 0, 0, 0.12) !important;\n}\n.pa__widget .pa__input-select .pa__input-select-items .pa__input-select-item:hover {\n  background-color: whitesmoke;\n}\n.pa__widget .pa__input-select-is-open .pa__input-select-items {\n  display: block;\n}\n.pa__widget .pa__input-select-is-open .pa__input-select-arrow {\n  transform: rotate(-180deg);\n}\n.pa__widget .pa__input-select-value {\n  display: flex;\n  flex: 1 1 auto;\n  background: transparent;\n  font: 15px Montserrat, sans-serif !important;\n  color: #555555;\n  line-height: 1.2;\n  padding: 0 24px 0 12px;\n  min-height: 42px;\n  transition: all 0.3s;\n  align-items: center;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.pa__widget .pa__input-select-value:focus::-webkit-input-placeholder {\n  color: transparent;\n}\n.pa__widget .pa__input-select-value:focus {\n  outline: none;\n}\n.pa__widget .pa__input-select-value:-internal-autofill-selected, .pa__widget .pa__input-select-value:-webkit-autofill::first-line, .pa__widget .pa__input-select-value:-webkit-autofill, .pa__widget .pa__input-select-value:-webkit-autofill:hover, .pa__widget .pa__input-select-value:-webkit-autofill:focus, .pa__widget .pa__input-select-value:-webkit-autofill:active {\n  font: 15px Montserrat, sans-serif !important;\n  -webkit-box-shadow: 0 0 0 30px white inset !important;\n}\n.pa__widget .pa__input-select.pa__input-dense .pa__input-select-item {\n  font-size: 12px !important;\n  min-height: 16px;\n}\n.pa__widget .pa__input-select.pa__input-dense .pa__input-select-value {\n  font-size: 12px !important;\n  min-height: 24px;\n  padding-left: 8px;\n}\n.pa__widget .pa__input {\n  color: rgba(0, 0, 0, 0.87);\n}\n.pa__widget .pa__input--wrap {\n  border-color: rgba(0, 0, 0, 0.87);\n}\n.pa__widget .pa__input input {\n  color: rgba(0, 0, 0, 0.87);\n}\n.pa__widget .pa__input input::placeholder {\n  color: rgba(0, 0, 0, 0.38);\n}\n.pa__widget .pa__input .pa__input--label {\n  color: rgba(0, 0, 0, 0.54);\n}\n.pa__widget .pa__input .pa__input--label a {\n  pointer-events: auto;\n}\n.pa__widget .pa__input {\n  display: flex;\n  font-size: 16px;\n  letter-spacing: normal;\n  max-width: 100%;\n  text-align: left;\n  flex-direction: column;\n}\n.pa__widget .pa__input--wrap {\n  margin-top: 12px;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: flex-end;\n  width: 100%;\n  position: relative;\n  background: #fff;\n  border: 1px solid #B5C6D9;\n  border-radius: 4px;\n}\n.pa__widget .pa__input--wrap input.pa__text-field {\n  display: flex;\n  flex: 1 1 auto;\n  background: transparent;\n  font: 15px Montserrat, sans-serif !important;\n  color: #555555;\n  line-height: 1.2;\n  padding: 0 12px;\n  min-height: 45px;\n  min-width: 0px;\n  transition: all 0.3s;\n  border-radius: inherit;\n}\n.pa__widget .pa__input--wrap input.pa__text-field:focus::-webkit-input-placeholder {\n  color: transparent;\n}\n.pa__widget .pa__input--wrap input.pa__text-field:focus {\n  outline: none;\n  border-color: transparent !important;\n}\n.pa__widget .pa__input--wrap input.pa__text-field:-internal-autofill-selected, .pa__widget .pa__input--wrap input.pa__text-field:-webkit-autofill::first-line, .pa__widget .pa__input--wrap input.pa__text-field:-webkit-autofill, .pa__widget .pa__input--wrap input.pa__text-field:-webkit-autofill:hover, .pa__widget .pa__input--wrap input.pa__text-field:-webkit-autofill:focus, .pa__widget .pa__input--wrap input.pa__text-field:-webkit-autofill:active {\n  font: 15px Montserrat, sans-serif !important;\n  -webkit-box-shadow: 0 0 0 30px white inset !important;\n}\n.pa__widget .pa__input--label {\n  -webkit-user-select: none;\n          user-select: none;\n  font-family: Montserrat, sans-serif;\n  font-size: 15px;\n  color: inherit;\n  line-height: 1;\n  left: 10px;\n  background-color: #fff;\n  display: block;\n  position: absolute;\n  pointer-events: none;\n  top: 15px;\n  transform-origin: top left;\n  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.pa__widget .pa__input-details {\n  padding-left: 12px;\n}\n.pa__widget .pa__input input:-webkit-autofill + .pa__input--label {\n  transform: translateY(-20px) scale(0.75);\n}\n.pa__widget .pa__input-focused .pa__input--wrap, .pa__widget .pa__input-has-state .pa__input--wrap {\n  border-color: currentColor;\n}\n.pa__widget .pa__input-focused .pa__input--label {\n  color: currentColor !important;\n  transform: translateY(-20px) scale(0.75);\n}\n.pa__widget .pa__input-has-value .pa__input--label {\n  transform: translateY(-20px) scale(0.75);\n}\n.pa__widget .pa__pw-toggle-visibility {\n  display: flex;\n  height: unset !important;\n  border-radius: 0 4px 4px 0;\n  border-left: inherit;\n  margin-left: 2px;\n  align-self: stretch;\n  color: inherit;\n  flex: 1 1;\n  min-height: 32px;\n}\n.pa__widget .pa__pw-toggle-visibility.pa__btn {\n  font-family: Montserrat, sans-serif;\n  font-size: 0.775rem !important;\n  min-width: 52px;\n}\n@media (max-width: 401px) {\n  .pa__widget .pa__pw-toggle-visibility.pa__btn {\n    border-left: none;\n  }\n}\n.pa__widget .pa__input-dense.pa__input input:-webkit-autofill + .pa__input--label {\n  transform: translateY(-20px) scale(0.75);\n}\n.pa__widget .pa__input-dense.pa__input-focused .pa__input--label, .pa__widget .pa__input-dense.pa__input-has-state .pa__input--label, .pa__widget .pa__input-dense.pa__input-has-value .pa__input--label {\n  top: 15px;\n}\n.pa__widget .pa__input-dense .pa__input--label {\n  top: 10px;\n}\n.pa__widget .pa__input-flat.pa__input input:-webkit-autofill + .pa__input--label {\n  transform: none;\n}\n.pa__widget .pa__input-flat.pa__input-focused .pa__input--label, .pa__widget .pa__input-flat.pa__input-has-state .pa__input--label {\n  transform: none;\n  top: 10px;\n}\n.pa__widget .pa__input-flat.pa__input-has-value .pa__input--label {\n  display: none;\n}\n.pa__widget .pa__input-flat.pa__input-focused .pa__input--wrap {\n  outline: auto;\n}\n.pa__widget .pa__input-flat .pa__input--wrap {\n  border: none;\n  margin: 0;\n}\n.pa__widget .pa__input-flat .pa__input--label {\n  top: 10px;\n}\n.pa__widget .pa__timer--circle {\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  border: 4px solid;\n  display: flex;\n  margin: 16px auto;\n}\n.pa__widget .pa__timer--seconds {\n  display: block;\n  width: 100%;\n  margin: auto;\n  padding-top: 0px;\n  text-align: center;\n  font-size: 2.5vw;\n}\n.pa__widget .pa__close:before {\n  content: \"×\";\n}";
styleInject(css_248z);

var script = io({
  name: 'PFooter',
  props: {
    termsOfService: {
      type: String,
      default: null
    },
    privacyPolicy: {
      type: String,
      default: null
    }
  },

  setup() {
    const context = Un('context');
    const translator = Un(translatorKey);
    const client = context.client;
    const languages = pt(context.ui_locales || []);
    return {
      translator,
      languages,
      tosUri: client.tosUri,
      policyUri: client.policyUri
    };
  }

});

const _hoisted_1 = {
  class: "pa__widget-footer-link-list"
};
const _hoisted_2 = {
  key: 0
};
const _hoisted_3 = ["href"];
const _hoisted_4 = {
  key: 1
};
const _hoisted_5 = ["href"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PSelect = Mo("PSelect");

  return Hr(), qr("footer", null, [_ctx.languages && _ctx.languages.length ? (Hr(), Jr(_component_PSelect, {
    key: 0,
    modelValue: _ctx.translator.locale,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.translator.locale = $event),
    flat: "",
    dense: "",
    "hide-messages": "",
    items: _ctx.languages
  }, null, 8, ["modelValue", "items"])) : cs("", true), ns("ul", _hoisted_1, [_ctx.tosUri ? (Hr(), qr("li", _hoisted_2, [ns("a", {
    href: _ctx.tosUri,
    target: "_blank",
    referrerpolicy: "no-referrer"
  }, "Terms of Service", 8, _hoisted_3)])) : cs("", true), _ctx.policyUri ? (Hr(), qr("li", _hoisted_4, [ns("a", {
    href: _ctx.policyUri,
    target: "_blank",
    referrerpolicy: "no-referrer"
  }, "Privacy Policy", 8, _hoisted_5)])) : cs("", true)])]);
}

script.render = render;

function resolveViewFromValue() {
  let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  const route = useRoute();

  if (route.matched.length > 0) {
    return RouterView;
  }

  switch (value.toLowerCase()) {
    case 'login':
    case 'signin':
      return script$b;

    case 'register':
    case 'signup':
      return script$3;

    case 'mfa':
    case 'challenge':
    case 'mfa-challenge':
      return script$a;

    case 'email':
    case 'mfa-email':
      return script$9;

    case 'sms':
    case 'mfa-sms':
      return script$5;

    case 'otp':
    case 'mfa-otp':
      return script$6;

    case 'fv':
    case 'mfa-fv':
      return script$7;

    case 'verifyemail':
      return script$1;

    case 'consent':
      return script$f;

    case 'recovery':
    case 'forgotpassword':
    case 'passwordrecovery':
      return script$c;

    case 'resetpassword':
      return script$2;

    case 'fillmissing':
    case 'updatemissinginformation':
      return script$d;

    default:
      return RouterView;
  }
}

function App (theme, settings) {
  return io({
    provide: {
      theme
    },

    setup() {
      const isMobile = Ft(false);

      function onResize() {
        isMobile.value = window.innerWidth < 600;
      }

      onResize();
      window.addEventListener('resize', onResize, {
        passive: true
      });
      Eo(() => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('resize', onResize);
        }
      });
      return {
        isMobile
      };
    },

    render() {
      const resolvedView = resolveViewFromValue(settings.mode);
      return Ws('div', {
        class: 'pa__widget'
      }, Ws('div', {
        class: 'pa__widget-content'
      }, [Ws('div', {
        class: ['pa__widget-content-main']
      }, [Ws(resolvedView, resolvedView === RouterView ? {} : settings.mode && settings.modeOptions && settings.modeOptions[settings.mode.toLowerCase()])]), settings.footer && settings.footer.enabled && Ws(script, {
        class: 'pa__widget-footer'
      })]));
    }

  });
}

function createWidget(container, settings, context) {
  const translator = new Translator(settings.locale.dictionary, settings.locale.defaultLocale, settings.locale.selectedLocale);
  const theme = new Theme({
    theme: settings.theme
  });
  theme.applyTheme();
  const widget = bl(App(theme, settings));
  widget.directive('t', i18n);
  widget.mixin(Translatable);
  widget.provide(translatorKey, translator);
  widget.use(router(settings));
  widget.provide('context', context);
  widget.config.globalProperties.$i18n = translator;
  widget.config.globalProperties.settings = settings;
  Kn(() => settings.locale.selectedLocale, locale => {
    if (locale) {
      translator.locale = locale;
    }
  });
  installComponents(widget);
  widget.mount(container);
  return widget;
}

class PlusAuthWidget {
  constructor(container) {
    let settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let context = arguments.length > 2 ? arguments[2] : undefined;

    _defineProperty(this, "_view", void 0);

    _defineProperty(this, "api", void 0);

    this.api = new M$1(settings.apiUrl || location.origin !== 'null' ? window.location.origin : '/');
    this._view = createWidget(container || document.body, pt(cjs({
      locale: {
        defaultLocale: 'en',
        dictionary: defaultDictionary
      }
    }, settings, {
      clone: true
    })), context);

    this._view.provide('api', this.api);
  }

  get view() {
    // expose settings rather than vue app
    return this._view.config.globalProperties.settings;
  }

}

export { PlusAuthWidget as default };
