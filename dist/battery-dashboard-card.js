var Ht = Object.create;
var W = Object.defineProperty;
var Mt = Object.getOwnPropertyDescriptor;
var ot = (r, t) => (t = Symbol[r]) ? t : Symbol.for("Symbol." + r), N = (r) => {
  throw TypeError(r);
};
var Tt = (r, t, e) => t in r ? W(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var it = (r, t) => W(r, "name", { value: t, configurable: !0 });
var at = (r) => [, , , Ht((r == null ? void 0 : r[ot("metadata")]) ?? null)], ht = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"], U = (r) => r !== void 0 && typeof r != "function" ? N("Function expected") : r, Rt = (r, t, e, s, i) => ({ kind: ht[r], name: t, metadata: s, addInitializer: (n) => e._ ? N("Already initialized") : i.push(U(n || null)) }), kt = (r, t) => Tt(t, ot("metadata"), r[3]), lt = (r, t, e, s) => {
  for (var i = 0, n = r[t >> 1], o = n && n.length; i < o; i++) t & 1 ? n[i].call(e) : s = n[i].call(e, s);
  return s;
}, ct = (r, t, e, s, i, n) => {
  var o, l, h, c, d, a = t & 7, u = !!(t & 8), $ = !!(t & 16), m = a > 3 ? r.length + 1 : a ? u ? 1 : 2 : 0, et = ht[a + 5], st = a > 3 && (r[m - 1] = []), Ot = r[m] || (r[m] = []), _ = a && (!$ && !u && (i = i.prototype), a < 5 && (a > 3 || !$) && Mt(a < 4 ? i : { get [e]() {
    return rt(this, n);
  }, set [e](f) {
    return nt(this, n, f);
  } }, e));
  a ? $ && a < 4 && it(n, (a > 2 ? "set " : a > 1 ? "get " : "") + e) : it(i, e);
  for (var B = s.length - 1; B >= 0; B--)
    c = Rt(a, e, h = {}, r[3], Ot), a && (c.static = u, c.private = $, d = c.access = { has: $ ? (f) => zt(i, f) : (f) => e in f }, a ^ 3 && (d.get = $ ? (f) => (a ^ 1 ? rt : Dt)(f, i, a ^ 4 ? n : _.get) : (f) => f[e]), a > 2 && (d.set = $ ? (f, V) => nt(f, i, V, a ^ 4 ? n : _.set) : (f, V) => f[e] = V)), l = (0, s[B])(a ? a < 4 ? $ ? n : _[et] : a > 4 ? void 0 : { get: _.get, set: _.set } : i, c), h._ = 1, a ^ 4 || l === void 0 ? U(l) && (a > 4 ? st.unshift(l) : a ? $ ? n = l : _[et] = l : i = l) : typeof l != "object" || l === null ? N("Object expected") : (U(o = l.get) && (_.get = o), U(o = l.set) && (_.set = o), U(o = l.init) && st.unshift(o));
  return a || kt(r, i), _ && W(i, e, _), $ ? a ^ 4 ? n : _ : i;
};
var F = (r, t, e) => t.has(r) || N("Cannot " + e), zt = (r, t) => Object(t) !== t ? N('Cannot use the "in" operator on this value') : r.has(t), rt = (r, t, e) => (F(r, t, "read from private field"), e ? e.call(r) : t.get(r));
var nt = (r, t, e, s) => (F(r, t, "write to private field"), s ? s.call(r, e) : t.set(r, e), e), Dt = (r, t, e) => (F(r, t, "access private method"), e);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = globalThis, G = I.ShadowRoot && (I.ShadyCSS === void 0 || I.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Q = Symbol(), dt = /* @__PURE__ */ new WeakMap();
let xt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== Q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (G && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = dt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && dt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const It = (r) => new xt(typeof r == "string" ? r : r + "", void 0, Q), jt = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[n + 1], r[0]);
  return new xt(e, r, Q);
}, Lt = (r, t) => {
  if (G) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = I.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, pt = G ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return It(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Bt, defineProperty: Vt, getOwnPropertyDescriptor: Wt, getOwnPropertyNames: Ft, getOwnPropertySymbols: qt, getPrototypeOf: Zt } = Object, v = globalThis, ut = v.trustedTypes, Jt = ut ? ut.emptyScript : "", q = v.reactiveElementPolyfillSupport, H = (r, t) => r, Y = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? Jt : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, wt = (r, t) => !Bt(r, t), $t = { attribute: !0, type: String, converter: Y, reflect: !1, useDefault: !1, hasChanged: wt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), v.litPropertyMetadata ?? (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let x = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = $t) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && Vt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: n } = Wt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: i, set(o) {
      const l = i == null ? void 0 : i.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? $t;
  }
  static _$Ei() {
    if (this.hasOwnProperty(H("elementProperties"))) return;
    const t = Zt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(H("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(H("properties"))) {
      const e = this.properties, s = [...Ft(e), ...qt(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(pt(i));
    } else t !== void 0 && e.push(pt(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Lt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var n;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const o = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : Y).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, o;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const l = s.getPropertyOptions(i), h = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : Y;
      this._$Em = i;
      const c = h.fromAttribute(e, l.type);
      this[i] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(i)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, n) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (i === !1 && (n = this[t]), s ?? (s = l.getPropertyOptions(t)), !((s.hasChanged ?? wt)(n, e) || s.useDefault && s.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: n }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, o] of i) {
        const { wrapped: l } = o, h = this[n];
        l !== !0 || this._$AL.has(n) || h === void 0 || this.C(n, void 0, o, h);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((i) => {
        var n;
        return (n = i.hostUpdate) == null ? void 0 : n.call(i);
      }), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
x.elementStyles = [], x.shadowRootOptions = { mode: "open" }, x[H("elementProperties")] = /* @__PURE__ */ new Map(), x[H("finalized")] = /* @__PURE__ */ new Map(), q == null || q({ ReactiveElement: x }), (v.reactiveElementVersions ?? (v.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis, ft = (r) => r, j = M.trustedTypes, _t = j ? j.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, Ct = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, Pt = "?" + y, Kt = `<${Pt}>`, S = document, R = () => S.createComment(""), k = (r) => r === null || typeof r != "object" && typeof r != "function", tt = Array.isArray, Xt = (r) => tt(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", Z = `[ 	
\f\r]`, O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, gt = /-->/g, mt = />/g, A = RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), yt = /'/g, vt = /"/g, Ut = /^(?:script|style|textarea|title)$/i, Yt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), g = Yt(1), C = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), At = /* @__PURE__ */ new WeakMap(), b = S.createTreeWalker(S, 129);
function Nt(r, t) {
  if (!tt(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return _t !== void 0 ? _t.createHTML(t) : t;
}
const Gt = (r, t) => {
  const e = r.length - 1, s = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = O;
  for (let l = 0; l < e; l++) {
    const h = r[l];
    let c, d, a = -1, u = 0;
    for (; u < h.length && (o.lastIndex = u, d = o.exec(h), d !== null); ) u = o.lastIndex, o === O ? d[1] === "!--" ? o = gt : d[1] !== void 0 ? o = mt : d[2] !== void 0 ? (Ut.test(d[2]) && (i = RegExp("</" + d[2], "g")), o = A) : d[3] !== void 0 && (o = A) : o === A ? d[0] === ">" ? (o = i ?? O, a = -1) : d[1] === void 0 ? a = -2 : (a = o.lastIndex - d[2].length, c = d[1], o = d[3] === void 0 ? A : d[3] === '"' ? vt : yt) : o === vt || o === yt ? o = A : o === gt || o === mt ? o = O : (o = A, i = void 0);
    const $ = o === A && r[l + 1].startsWith("/>") ? " " : "";
    n += o === O ? h + Kt : a >= 0 ? (s.push(c), h.slice(0, a) + Ct + h.slice(a) + y + $) : h + y + (a === -2 ? l : $);
  }
  return [Nt(r, n + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class z {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, h = this.parts, [c, d] = Gt(t, e);
    if (this.el = z.createElement(c, s), b.currentNode = this.el.content, e === 2 || e === 3) {
      const a = this.el.content.firstChild;
      a.replaceWith(...a.childNodes);
    }
    for (; (i = b.nextNode()) !== null && h.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const a of i.getAttributeNames()) if (a.endsWith(Ct)) {
          const u = d[o++], $ = i.getAttribute(a).split(y), m = /([.?@])?(.*)/.exec(u);
          h.push({ type: 1, index: n, name: m[2], strings: $, ctor: m[1] === "." ? te : m[1] === "?" ? ee : m[1] === "@" ? se : L }), i.removeAttribute(a);
        } else a.startsWith(y) && (h.push({ type: 6, index: n }), i.removeAttribute(a));
        if (Ut.test(i.tagName)) {
          const a = i.textContent.split(y), u = a.length - 1;
          if (u > 0) {
            i.textContent = j ? j.emptyScript : "";
            for (let $ = 0; $ < u; $++) i.append(a[$], R()), b.nextNode(), h.push({ type: 2, index: ++n });
            i.append(a[u], R());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Pt) h.push({ type: 2, index: n });
      else {
        let a = -1;
        for (; (a = i.data.indexOf(y, a + 1)) !== -1; ) h.push({ type: 7, index: n }), a += y.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = S.createElement("template");
    return s.innerHTML = t, s;
  }
}
function P(r, t, e = r, s) {
  var o, l;
  if (t === C) return t;
  let i = s !== void 0 ? (o = e._$Co) == null ? void 0 : o[s] : e._$Cl;
  const n = k(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((l = i == null ? void 0 : i._$AO) == null || l.call(i, !1), n === void 0 ? i = void 0 : (i = new n(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = P(r, i._$AS(r, t.values), i, s)), t;
}
class Qt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? S).importNode(e, !0);
    b.currentNode = i;
    let n = b.nextNode(), o = 0, l = 0, h = s[0];
    for (; h !== void 0; ) {
      if (o === h.index) {
        let c;
        h.type === 2 ? c = new D(n, n.nextSibling, this, t) : h.type === 1 ? c = new h.ctor(n, h.name, h.strings, this, t) : h.type === 6 && (c = new ie(n, this, t)), this._$AV.push(c), h = s[++l];
      }
      o !== (h == null ? void 0 : h.index) && (n = b.nextNode(), o++);
    }
    return b.currentNode = S, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class D {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = P(this, t, e), k(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== C && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Xt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && k(this._$AH) ? this._$AA.nextSibling.data = t : this.T(S.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = z.createElement(Nt(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(e);
    else {
      const o = new Qt(i, this), l = o.u(this.options);
      o.p(e), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = At.get(t.strings);
    return e === void 0 && At.set(t.strings, e = new z(t)), e;
  }
  k(t) {
    tt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const n of t) i === e.length ? e.push(s = new D(this.O(R()), this.O(R()), this, this.options)) : s = e[i], s._$AI(n), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = ft(t).nextSibling;
      ft(t).remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class L {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, n) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(t, e = this, s, i) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = P(this, t, e, 0), o = !k(t) || t !== this._$AH && t !== C, o && (this._$AH = t);
    else {
      const l = t;
      let h, c;
      for (t = n[0], h = 0; h < n.length - 1; h++) c = P(this, l[s + h], e, h), c === C && (c = this._$AH[h]), o || (o = !k(c) || c !== this._$AH[h]), c === p ? t = p : t !== p && (t += (c ?? "") + n[h + 1]), this._$AH[h] = c;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class te extends L {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class ee extends L {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class se extends L {
  constructor(t, e, s, i, n) {
    super(t, e, s, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = P(this, t, e, 0) ?? p) === C) return;
    const s = this._$AH, i = t === p && s !== p || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== p && (s === p || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ie {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    P(this, t);
  }
}
const J = M.litHtmlPolyfillSupport;
J == null || J(z, D), (M.litHtmlVersions ?? (M.litHtmlVersions = [])).push("3.3.2");
const re = (r, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new D(t.insertBefore(R(), n), n, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E = globalThis;
class T extends x {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = re(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return C;
  }
}
var Et;
T._$litElement$ = !0, T.finalized = !0, (Et = E.litElementHydrateSupport) == null || Et.call(E, { LitElement: T });
const K = E.litElementPolyfillSupport;
K == null || K({ LitElement: T });
(E.litElementVersions ?? (E.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ne = (r) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(r, t);
  }) : customElements.define(r, t);
};
async function oe(r, t, e) {
  const s = /* @__PURE__ */ new Date(), n = `history/period/${new Date(s.getTime() - e * 36e5).toISOString()}?filter_entity_id=${encodeURIComponent(t)}&end_time=${encodeURIComponent(s.toISOString())}&minimal_response`, o = await r.callApi("GET", n);
  return (Array.isArray(o) && Array.isArray(o[0]) ? o[0] : []).map((h) => ({
    ts: Date.parse(h.last_changed ?? h.last_updated),
    value: Number(h.state)
  })).filter((h) => Number.isFinite(h.ts) && Number.isFinite(h.value));
}
var St, X, ae;
St = [ne("battery-dashboard-card")];
let w = class w extends (ae = T) {
  constructor() {
    super(...arguments), this._history = {}, this._loading = {};
  }
  setConfig(t) {
    this._config = {
      title: "Battery Devices",
      columns: 3,
      hours_to_show: 24 * 7,
      autodiscover: !0,
      entity_glob: "sensor.*_battery*",
      ...t
    };
  }
  // Lovelace calls this; good place to trigger history fetching once states available
  updated(t) {
    t.has("hass") && this.ensureHistories();
  }
  batteryColor(t) {
    return t > 66 ? "#388e3c" : t > 33 ? "#f57c00" : "#d32f2f";
  }
  clampPct(t) {
    return Math.max(0, Math.min(100, t));
  }
  getDevices() {
    var e, s;
    const t = this._config;
    if ((e = t == null ? void 0 : t.devices) != null && e.length) return t.devices;
    if (t != null && t.autodiscover) {
      const i = /^sensor\..*_battery.*$/;
      return Object.keys(((s = this.hass) == null ? void 0 : s.states) ?? {}).filter((o) => i.test(o)).map((o) => ({ entity: o }));
    }
    return [];
  }
  async ensureHistories() {
    var s;
    const t = this.getDevices(), e = ((s = this._config) == null ? void 0 : s.hours_to_show) ?? 168;
    for (const i of t) {
      const n = i.entity;
      if (!(this._history[n] || this._loading[n])) {
        this._loading = { ...this._loading, [n]: !0 };
        try {
          const o = await oe(this.hass, n, e);
          this._history = { ...this._history, [n]: o };
        } catch {
          this._history = { ...this._history, [n]: [] };
        } finally {
          this._loading = { ...this._loading, [n]: !1 };
        }
      }
    }
  }
  renderSparkline(t, e) {
    if (!(t != null && t.length)) return p;
    const s = 600, i = 180, n = t[0].ts, o = t[t.length - 1].ts, l = 0, h = 100, c = (u) => o === n ? 0 : (u - n) / (o - n) * s, d = (u) => i - (this.clampPct(u) - l) / (h - l) * i, a = t.map((u, $) => `${$ === 0 ? "M" : "L"} ${c(u.ts).toFixed(1)} ${d(u.value).toFixed(1)}`).join(" ");
    return g`
      <svg class="bg" viewBox="0 0 ${s} ${i}" preserveAspectRatio="none">
        <path d="${a}" fill="none" stroke="${e}" stroke-width="4" opacity="0.9" />
      </svg>
    `;
  }
  render() {
    if (!this._config || !this.hass) return g``;
    const t = this.getDevices(), e = this._config.columns ?? 3;
    return g`
      <ha-card class="wrap">
        ${this._config.title ? g`<div class="title">${this._config.title}</div>` : p}

        <div class="grid" style="grid-template-columns: repeat(${e}, minmax(220px, 1fr));">
          ${t.map((s) => {
      var d, a;
      const i = this.hass.states[s.entity], n = i ? Number(i.state) : NaN, o = Number.isFinite(n) ? this.clampPct(n) : 0, l = s.name ?? ((d = i == null ? void 0 : i.attributes) != null && d.friendly_name ? String(i.attributes.friendly_name).replace(/ battery$/i, "") : s.entity), h = this.batteryColor(o), c = this._history[s.entity] ?? [];
      return g`
              <div class="device">
                ${this.renderSparkline(c, h)}

                <div class="top">
                  <div class="name">${l}</div>
                  <div class="pct">${Number.isFinite(n) ? `${o}%` : "—"}</div>
                </div>

                <div class="meta">
                  ${s.type ? g`Type: <b>${s.type}</b><br />` : p}
                  ${s.area ? g`Area: <b>${s.area}</b><br />` : p}
                </div>

                <div class="bar" aria-label="Battery level">
                  <div class="fill" style="width:${o}%; background:${h};"></div>
                </div>

                ${(a = s.tags) != null && a.length ? g`<div class="tags">
                      ${s.tags.map((u) => g`<span class="tag">${u}</span>`)}
                    </div>` : p}
              </div>
            `;
    })}
        </div>
      </ha-card>
    `;
  }
  // Optional: tells HA the config editor size
  static getConfigElement() {
    return document.createElement("div");
  }
  static getStubConfig() {
    return { title: "Battery Devices" };
  }
};
X = at(ae), w = ct(X, 0, "BatteryDashboardCard", St, w), w.styles = jt`
    :host { display: block; }
    .wrap {
      background: var(--ha-card-background, var(--card-background-color));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none);
      padding: 12px;
    }
    .title { font-size: 16px; font-weight: 600; margin: 4px 4px 12px; }

    .grid {
      display: grid;
      gap: 12px;
    }

    .device {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      background: rgba(127,127,127,0.08);
      padding: 12px;
      min-height: 110px;
    }

    .bg {
      position: absolute;
      inset: 0;
      opacity: 0.35;
      pointer-events: none;
    }

    .top {
      position: relative;
      display: flex;
      justify-content: space-between;
      gap: 8px;
      align-items: baseline;
    }

    .name { font-weight: 600; line-height: 1.2; }
    .meta { opacity: 0.8; font-size: 12px; margin-top: 4px; position: relative; }

    .bar {
      margin-top: 10px;
      height: 10px;
      border-radius: 999px;
      background: rgba(127,127,127,0.25);
      overflow: hidden;
      position: relative;
    }
    .fill { height: 100%; border-radius: 999px; }

    .pct { font-variant-numeric: tabular-nums; opacity: 0.85; font-size: 12px; }
    .tags { margin-top: 6px; display: flex; flex-wrap: wrap; gap: 6px; }
    .tag {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 999px;
      background: rgba(127,127,127,0.18);
    }
  `, lt(X, 1, w);
let bt = w;
export {
  bt as BatteryDashboardCard
};
