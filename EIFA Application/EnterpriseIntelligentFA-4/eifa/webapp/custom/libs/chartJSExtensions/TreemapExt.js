/*!
 * chartjs-chart-treemap v0.2.2
 * https://github.com/kurkle/chartjs-chart-treemap#readme
 * (c) 2019 Jukka Kurkela
 * Released under the MIT license
 */
! function(t, e) { "object" == typeof exports && "undefined" != typeof module ? e(require("chart.js")) : "function" == typeof define && define.amd ? define(["chart.js"], e) : e((t = t || self).Chart) }(this, function(t) { "use strict";

    function e(t) { var e = typeof t; return "function" === e || "object" === e && !!t }
    t = t && t.hasOwnProperty("default") ? t.default : t; var n = { flatten: function(t) { const e = [...t],
                n = []; for (; e.length;) { const t = e.pop();
                Array.isArray(t) ? e.push(...t) : n.push(t) } return n.reverse() }, group: function(t, e, n, r, i) { var o, a, s, h, u = Object.create(null),
                l = Object.create(null),
                d = []; for (a = 0, s = t.length; a < s; ++a) h = t[a], r && h[r] !== i || ((o = h[e] || "") in u || (u[o] = 0, l[o] = []), u[o] += +h[n], l[o].push(h)); return Object.keys(u).forEach(function(t) {
                (h = { children: l[t] })[n] = +u[t], h[e] = t, r && (h[r] = i), d.push(h) }), d }, index: function(t, n) { var r, i, o = t.length; if (!o) return n; for (n = (i = e(t[0])) ? n : "v", r = 0, o = t.length; r < o; ++r) i ? t[r]._idx = r : t[r] = { v: t[r], _idx: r }; return n }, isObject: e, sort: function(t, e) { e ? t.sort(function(t, n) { return +n[e] - +t[e] }) : t.sort(function(t, e) { return +e - +t }) }, sum: function(t, e) { var n, r, i; for (n = 0, r = 0, i = t.length; r < i; ++r) n += e ? +t[r][e] : +t[r]; return n } };

    function r(t, e) { return +(Math.round(t + "e+" + e) + "e-" + e) }

    function i(t, e, n, r) { var i = t._normalized,
            o = e * i / n,
            a = Math.sqrt(i * o),
            s = i / a; return { d1: a, d2: s, w: "_ix" === r ? a : s, h: "_ix" === r ? s : a } }

    function o(t, e, n, i) { var o = { x: r(t.x + t._ix, 4), y: r(t.y + t._iy, 4), w: r(n.w, 4), h: r(n.h, 4), a: e._normalized, v: e.value, s: i, _data: e._data }; return e.group && (o.g = e.group, o.l = e.level, o.gs = e.groupSum), o }
    class a { constructor(t) { var e = this;
            e.x = t.x || t.left || 0, e.y = t.y || t.top || 0, e._ix = 0, e._iy = 0, e.w = t.w || t.width || t.right - t.left, e.h = t.h || t.height || t.bottom - t.top }
        get area() { return this.w * this.h }
        get iw() { return this.w - this._ix }
        get ih() { return this.h - this._iy }
        get dir() { var t = this.ih; return t <= this.iw && t > 0 ? "y" : "x" }
        get side() { return "x" === this.dir ? this.iw : this.ih }
        map(t) { var e, n, r, a = this,
                s = [],
                h = t.nsum,
                u = t.get(),
                l = u.length,
                d = a.dir,
                f = a.side,
                c = f * f,
                p = "x" === d ? "_ix" : "_iy",
                g = h * h,
                m = 0,
                x = 0; for (e = 0; e < l; ++e) x += (r = i(n = u[e], c, g, p)).d1, r.d2 > m && (m = r.d2), s.push(o(a, n, r, t.sum)), a[p] += r.d1; return a["y" === d ? "_ix" : "_iy"] += m, a[p] -= x, s } } const s = Math.min,
        h = Math.max;

    function u(t, e) { var n = +e[t.key],
            r = n * t.ratio; return e._normalized = r, { min: s(t.min, n), max: h(t.max, n), sum: t.sum + n, nmin: s(t.nmin, r), nmax: h(t.nmax, r), nsum: t.nsum + r } }

    function l(t, e, n) { t._arr.push(e),
            function(t, e) { Object.assign(t, e) }(t, n) }
    class d { constructor(t, e) { this.key = t, this.ratio = e, this.reset() }
        get length() { return this._arr.length }
        reset() { var t = this;
            t._arr = [], t._hist = [], t.sum = 0, t.nsum = 0, t.min = 1 / 0, t.max = -1 / 0, t.nmin = 1 / 0, t.nmax = -1 / 0 }
        push(t) { l(this, t, u(this, t)) }
        pushIf(t, e, ...n) { var r, i = u(this, t); if (!e((r = this, { min: r.min, max: r.max, sum: r.sum, nmin: r.nmin, nmax: r.nmax, nsum: r.nsum }), i, n)) return t;
            l(this, t, i) }
        get() { return this._arr } }

    function f(t, e, n) { if (0 === t.sum) return !0; var [r] = n, i = t.nsum * t.nsum, o = e.nsum * e.nsum, a = r * r, s = Math.max(a * t.nmax / i, i / (a * t.nmin)); return Math.max(a * e.nmax / o, o / (a * e.nmin)) <= s }

    function c(t, e, r, i, o, s) { var h, u, l, c, p = n.sum(t, r),
            g = [],
            m = new a(e),
            x = new d("value", m.area / p),
            y = m.side,
            v = t.length; if (!v) return g;

        function _(t) { return i && l[t][i] } for (l = t.slice(), r = n.index(l, r), n.sort(l, r), h = 0; h < v; ++h) u = { value: (c = h, r ? +l[c][r] : +l[c]), groupSum: s, _data: t[l[h]._idx] }, i && (u.level = o, u.group = _(h)), (u = x.pushIf(u, f, y)) && (g.push(m.map(x)), y = m.side, x.reset(), x.push(u)); return x.length && g.push(m.map(x)), n.flatten(g) } var p = t.defaults,
        g = t.helpers,
        m = g.options,
        x = m._parseFont,
        y = m.resolve,
        v = g.valueOrDefault;

    function _(t, e) { var n = t.width || t.w,
            r = t.height || t.h,
            i = 2 * e.lineHeight; return n > i && r > i } var b = t.DatasetController.extend({ dataElementType: t.elements.Rectangle, update: function(t) { var e, r, i, o, a, s, h = this,
                u = h.getMeta(),
                l = h.getDataset(),
                d = l.groups || (l.groups = []),
                f = (e = l, g.extend(x({ fontFamily: v(e.fontFamily, p.fontFamily), fontSize: v(e.fontSize, p.fontSize), fontStyle: v(e.fontStyle, p.fontStyle), lineHeight: v(e.lineHeight, p.lineHeight) }), { color: y([e.fontColor, p.fontColor, p.global.defaultFontColor]) })),
                m = u.data || [],
                b = h.chart.chartArea,
                w = l.key || ""; for (o = { x: b.left, y: b.top, w: b.right - b.left, h: b.bottom - b.top }, !t && (a = h._rect, s = o, a && s && a.x === s.x && a.y === s.y && a.w === s.w && a.h === s.h) && h._key === w && ! function(t, e) { var n, r; if (t.lenght !== e.length) return !0; for (n = 0, r = t.length; n < r; ++n)
                        if (t[n] !== e[n]) return !0;
                    return !1 }(h._groups, d) || (h._rect = o, h._groups = d.slice(), h._key = w, l.data = function(t, e, r) { var i = t.key || "",
                        o = t.tree || [],
                        a = t.groups || [],
                        s = a.length,
                        h = (t.spacing || 0) + (t.borderWidth || 0); return !o.length && t.data.length && (o = t.tree = t.data), s ? function t(e, u, l, d) { var f, p = a[e],
                            g = e > 0 && a[e - 1],
                            m = c(n.group(o, p, i, g, l), u, i, p, e, d),
                            x = m.slice(); return e < s - 1 && m.forEach(function(n) { f = { x: n.x + h, y: n.y + h, w: n.w - 2 * h, h: n.h - 2 * h }, _(n, r) && (f.y += r.lineHeight, f.h -= r.lineHeight), x.push.apply(x, t(e + 1, f, n.g, n.s)) }), x }(0, e) : c(o, e, i) }(l, o, f), h.resyncElements()), r = 0, i = m.length; r < i; ++r) h.updateElement(m[r], r, t) }, updateElement: function(t, e, n) { var r = this.index,
                i = this.getDataset().data[e],
                o = this._resolveElementOptions(t, e),
                a = n ? 0 : i.h - 2 * o.spacing,
                s = n ? 0 : i.w - 2 * o.spacing,
                h = i.x + s / 2 + o.spacing,
                u = i.y + a / 2 + o.spacing,
                l = a / 2;
            t._options = o, t._datasetIndex = r, t._index = e, t.hidden = a <= o.spacing || s <= o.spacing, t._model = { x: h, base: u - l, y: u + l, top: i.y, left: i.x, width: s, height: a, backgroundColor: o.backgroundColor, borderColor: o.borderColor, borderSkipped: o.borderSkipped, borderWidth: o.borderWidth, font: x(o), fontColor: o.fontColor }, t.pivot() }, draw: function() { var t, e, n, r, i, o = this.getMeta().data || [],
                a = this.getDataset(),
                s = (a.groups || []).length - 1,
                h = a.data || [],
                u = this.chart.ctx; for (t = 0, e = o.length; t < e; ++t) i = (n = o[t])._view, r = h[t], n.hidden || (n.draw(), _(i, i.font) && r.g && (u.save(), u.fillStyle = i.fontColor, u.font = i.font.string, u.beginPath(), u.rect(i.left, i.top, i.width, i.height), u.clip(), "l" in r && r.l !== s ? (u.textAlign = "start", u.textBaseline = "top", u.fillText(r.g, i.left + i.borderWidth + 3, i.top + i.borderWidth + 3)) : (u.textAlign = "center", u.textBaseline = "middle", u.fillText(r.g, i.left + i.width / 2, i.top + i.height / 2)), u.restore())) }, _resolveElementOptions: function(t, e) { var n, r, i, o = this.chart,
                a = this.getDataset(),
                s = o.options.elements.rectangle,
                h = {},
                u = { chart: o, dataIndex: e, dataset: a, datasetIndex: this.index },
                l = ["backgroundColor", "borderColor", "borderSkipped", "borderWidth", "fontColor", "fontFamily", "fontSize", "fontStyle", "spacing"]; for (n = 0, r = l.length; n < r; ++n) h[i = l[n]] = y([a[i], s[i]], u, e); return h } });
    t.controllers.treemap = b, t.defaults.treemap = { hover: { mode: "nearest", intersect: !0 }, tooltips: { mode: "nearest", position: "treemap", intersect: !0 }, scales: { xAxes: [{ type: "linear", display: !1 }], yAxes: [{ type: "linear", display: !1 }] }, elements: { rectangle: { borderSkipped: !1, borderWidth: 0, spacing: .5 } } }, t.Tooltip.positioners.treemap = function(t) { if (!t.length) return !1; var e = t[0]._view; return { x: e.x, y: e.y - e.height / 2 } } });