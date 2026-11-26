/* NusaStat charts — small SVG chart builders, written for this site.
   No library, no network: every chart is plain SVG built from the numbers
   in data.js. Each builder returns an SVG string; the pages drop it into
   a <figure> with role="img" and an aria-label that states the values. */

var NusaCharts = (function () {
  var W = 640, H = 300, PAD = { l: 48, r: 14, t: 16, b: 34 };
  var TEAL = "#0c4a44", AMBER = "#e8a33d", CORAL = "#c65b39",
      GREEN = "#2e7d5b", BLUE = "#2f6f9f", GRID = "#e3e6dc", INK = "#44524e";

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function fmt(v, digits) {
    return Number(v).toLocaleString("id-ID", { minimumFractionDigits: digits || 0, maximumFractionDigits: digits || 0 });
  }
  function axisLabels(svg, labels, x0, x1, y) {
    labels.forEach(function (lab, i) {
      var x = x0 + (x1 - x0) * (labels.length === 1 ? 0.5 : i / (labels.length - 1));
      svg.push('<text x="' + x.toFixed(1) + '" y="' + y + '" text-anchor="middle" font-size="12" fill="' + INK + '">' + esc(lab) + '</text>');
    });
  }
  function yGrid(svg, min, max, y0, y1, ticks, unit) {
    for (var t = 0; t <= ticks; t++) {
      var v = min + (max - min) * t / ticks;
      var y = y1 - (v - min) / (max - min) * (y1 - y0);
      svg.push('<line x1="' + PAD.l + '" y1="' + y.toFixed(1) + '" x2="' + (W - PAD.r) + '" y2="' + y.toFixed(1) + '" stroke="' + GRID + '" stroke-width="1"/>');
      svg.push('<text x="' + (PAD.l - 8) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="' + INK + '">' + fmt(v, unit) + '</text>');
    }
  }

  function lineChart(opts) {
    var values = opts.values, labels = opts.labels;
    // A line chart does not need a zero baseline: scale to the data so the
    // trend is visible. Callers may still pass floor to pin the bottom.
    var dataMin = Math.min.apply(null, values);
    var min = opts.floor !== undefined ? Math.min(dataMin, opts.floor) : dataMin;
    var max = Math.max.apply(null, values);
    if (max === min) max = min + 1;
    var pad = (max - min) * 0.12; min -= pad; max += pad;
    var x0 = PAD.l, x1 = W - PAD.r, y0 = PAD.t, y1 = H - PAD.b;
    var svg = ['<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(opts.aria || "") + '">'];
    yGrid(svg, min, max, y0, y1, 4, opts.decimals || 0);
    var pts = values.map(function (v, i) {
      var x = x0 + (x1 - x0) * (values.length === 1 ? 0.5 : i / (values.length - 1));
      var y = y1 - (v - min) / (max - min) * (y1 - y0);
      return [x, y];
    });
    var line = pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
    var area = line + " L" + pts[pts.length - 1][0].toFixed(1) + " " + y1 + " L" + pts[0][0].toFixed(1) + " " + y1 + " Z";
    svg.push('<path d="' + area + '" fill="' + (opts.color || TEAL) + '" opacity="0.10"/>');
    svg.push('<path d="' + line + '" fill="none" stroke="' + (opts.color || TEAL) + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>');
    pts.forEach(function (p, i) {
      svg.push('<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4" fill="#fff" stroke="' + (opts.color || TEAL) + '" stroke-width="2.5"/>');
      svg.push('<text x="' + p[0].toFixed(1) + '" y="' + (p[1] - 12).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="' + INK + '">' + fmt(values[i], opts.decimals || 0) + (opts.suffix || "") + '</text>');
    });
    axisLabels(svg, labels, x0, x1, H - 10);
    svg.push("</svg>");
    return svg.join("");
  }

  function barChart(opts) {
    var values = opts.values, labels = opts.labels;
    var min = Math.min(0, Math.min.apply(null, values));
    var max = Math.max.apply(null, values);
    if (max === min) max = min + 1;
    var x0 = PAD.l, x1 = W - PAD.r, y0 = PAD.t, y1 = H - PAD.b;
    var svg = ['<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(opts.aria || "") + '">'];
    yGrid(svg, min, max, y0, y1, 4, opts.decimals || 0);
    var slot = (x1 - x0) / values.length;
    var zeroY = y1 - (0 - min) / (max - min) * (y1 - y0);
    values.forEach(function (v, i) {
      var bw = Math.min(46, slot * 0.62);
      var x = x0 + slot * i + (slot - bw) / 2;
      var y = y1 - (v - min) / (max - min) * (y1 - y0);
      var top = Math.min(y, zeroY), h = Math.abs(zeroY - y);
      var col = v < 0 ? CORAL : (opts.color || TEAL);
      svg.push('<rect x="' + x.toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(h, 2).toFixed(1) + '" rx="4" fill="' + col + '"/>');
      var ly = v < 0 ? zeroY + 16 : top - 8;
      svg.push('<text x="' + (x + bw / 2).toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="' + INK + '">' + fmt(v, opts.decimals || 0) + (opts.suffix || "") + '</text>');
    });
    axisLabels(svg, labels, x0, x1, H - 10);
    svg.push("</svg>");
    return svg.join("");
  }

  function donutChart(opts) {
    var parts = opts.parts, size = 260, cx = size / 2, cy = size / 2, r = 100, ir = 62;
    var total = parts.reduce(function (a, p) { return a + p.pct; }, 0);
    var svg = ['<svg class="chart" viewBox="0 0 ' + size + ' ' + size + '" style="max-width:280px;margin:0 auto" role="img" aria-label="' + esc(opts.aria || "") + '">'];
    var a0 = -Math.PI / 2;
    parts.forEach(function (p) {
      var a1 = a0 + (p.pct / total) * Math.PI * 2;
      var large = (a1 - a0) > Math.PI ? 1 : 0;
      var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
      var x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      var xi1 = cx + ir * Math.cos(a1), yi1 = cy + ir * Math.sin(a1);
      var xi0 = cx + ir * Math.cos(a0), yi0 = cy + ir * Math.sin(a0);
      svg.push('<path d="M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
        ' L' + xi1.toFixed(1) + ' ' + yi1.toFixed(1) + ' A' + ir + ' ' + ir + ' 0 ' + large + ' 0 ' + xi0.toFixed(1) + ' ' + yi0.toFixed(1) + ' Z" fill="' + p.color + '"/>');
      a0 = a1;
    });
    svg.push('<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="26" font-weight="700" fill="#08332f">' + esc(opts.center || "") + '</text>');
    svg.push('<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" font-size="12" fill="' + INK + '">' + esc(opts.centerLabel || "") + '</text>');
    svg.push("</svg>");
    return svg.join("");
  }

  function pyramidChart(opts) {
    var rows = opts.rows, max = 0;
    rows.forEach(function (r) { max = Math.max(max, r.male, r.female); });
    var rowH = 20, top = 8, W2 = 640, H2 = top + rows.length * rowH + 30;
    var mid = W2 / 2, scale = (mid - 70) / max;
    var svg = ['<svg class="chart" viewBox="0 0 ' + W2 + ' ' + H2 + '" role="img" aria-label="' + esc(opts.aria || "") + '">'];
    svg.push('<text x="' + (mid - 60) + '" y="' + (H2 - 8) + '" text-anchor="middle" font-size="12" font-weight="700" fill="' + TEAL + '">Laki-laki</text>');
    svg.push('<text x="' + (mid + 60) + '" y="' + (H2 - 8) + '" text-anchor="middle" font-size="12" font-weight="700" fill="' + CORAL + '">Perempuan</text>');
    rows.forEach(function (r, i) {
      var y = top + i * rowH;
      var mw = r.male * scale, fw = r.female * scale;
      svg.push('<rect x="' + (mid - mw).toFixed(1) + '" y="' + y + '" width="' + mw.toFixed(1) + '" height="15" rx="2" fill="' + TEAL + '"/>');
      svg.push('<rect x="' + mid.toFixed(1) + '" y="' + y + '" width="' + fw.toFixed(1) + '" height="15" rx="2" fill="' + CORAL + '"/>');
      svg.push('<text x="' + (mid - mw - 6).toFixed(1) + '" y="' + (y + 12) + '" text-anchor="end" font-size="11" fill="' + INK + '">' + fmt(r.male, 1) + '%</text>');
      svg.push('<text x="' + (mid + fw + 6).toFixed(1) + '" y="' + (y + 12) + '" text-anchor="start" font-size="11" fill="' + INK + '">' + fmt(r.female, 1) + '%</text>');
      svg.push('<text x="' + mid + '" y="' + (y + 12) + '" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">' + esc(r.group) + '</text>');
    });
    svg.push("</svg>");
    return svg.join("");
  }

  return { line: lineChart, bars: barChart, donut: donutChart, pyramid: pyramidChart, fmt: fmt };
})();
