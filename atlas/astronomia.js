// ==========================================
// ARQUIVO: astronomia.js
// Motor de cálculos celestes do Atlas Polar
// ==========================================

const Astro = (function () {
  function normaliza(graus) { return ((graus % 360) + 360) % 360; }
  
  function gastDeg(date) {
    const jd = date.getTime() / 86400000 + 2440587.5;
    const T = (jd - 2451545.0) / 36525.0;
    return normaliza(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T);
  }
  
  function sunEquatorial(date) {
    const jd = date.getTime() / 86400000 + 2440587.5;
    const T = (jd - 2451545.0) / 36525.0;
    const L0 = normaliza(280.46646 + T * (36000.76983 + 0.0003032 * T));
    const M = normaliza(357.52911 + T * (35999.05029 - 0.0001537 * T)) * Math.PI / 180;
    const C = (1.914602 - T * (0.004817 + 0.000014 * T)) * Math.sin(M) + (0.019993 - 0.000101 * T) * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
    const omega = (125.04 - 1934.136 * T) * Math.PI / 180;
    const lambda = (L0 + C - 0.00569 - 0.00478 * Math.sin(omega)) * Math.PI / 180;
    const eps = (23.439291 - 0.0130042 * T) * Math.PI / 180;
    const dec = Math.asin(Math.sin(eps) * Math.sin(lambda));
    const ra = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda));
    return { ra: normaliza(ra * 180 / Math.PI), dec: dec * 180 / Math.PI };
  }
  
  function moonEquatorial(date) {
    const jd = date.getTime() / 86400000 + 2440587.5;
    const T = (jd - 2451545.0) / 36525.0;
    const L = normaliza(218.316 + 481267.881 * T);
    const M = normaliza(134.963 + 477198.867 * T) * Math.PI / 180;
    const F = normaliza(93.272 + 483202.017 * T) * Math.PI / 180;
    const lambda = (L + 6.289 * Math.sin(M)) * Math.PI / 180;
    const beta = 5.128 * Math.sin(F) * Math.PI / 180;
    const eps = (23.439291 - 0.0130042 * T) * Math.PI / 180;
    const dec = Math.asin(Math.sin(beta) * Math.cos(eps) + Math.cos(beta) * Math.sin(eps) * Math.sin(lambda));
    const ra = Math.atan2(Math.sin(lambda) * Math.cos(eps) - Math.tan(beta) * Math.sin(eps), Math.cos(lambda));
    return { ra: normaliza(ra * 180 / Math.PI), dec: dec * 180 / Math.PI };
  }
  
  function moonPhase(date) {
    const s = sunEquatorial(date), m = moonEquatorial(date);
    return normaliza(m.ra - s.ra) / 360;
  }
  
  function equationOfTimeMinutes(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const day = Math.floor((date - start) / 86400000);
    const hour = date.getHours() + date.getMinutes() / 60;
    const gamma = 2 * Math.PI / 365 * (day - 1 + (hour - 12) / 24);
    return 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  }

  return { gastDeg, sunEquatorial, moonEquatorial, moonPhase, equationOfTimeMinutes };
})();
