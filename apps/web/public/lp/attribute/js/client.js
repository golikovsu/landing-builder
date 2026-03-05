/* attribute-client v0.5 — self-hosted */
function e() {
  return (
    (e =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var a = arguments[t]
          for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n])
        }
        return e
      }),
    e.apply(this, arguments)
  )
}
;(() => {
  console.log('attribute-client v0.5')
  const t = [
      'aff',
      'afftrack',
      'aff_model',
      'retrack',
      'clickid',
      'fbclid',
      'gclid',
      'gbraid',
      'wbraid',
      'ttclid',
      'fingerprint',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_network',
      'utm_placement',
      'utm_ad_position',
      'utm_creative',
      'utm_match_type',
      'utm_keyword',
      'utm_device',
      'utm_device_model',
      'utm_adwords_product_target_id',
      'utm_content',
      'utm_term',
    ],
    a = ['_ga', '_fbp', '_fbc', '_ttp'],
    n = 'https://' + window.location.hostname + '/lp/attribute'
  function o(e) {
    const t = e.match('^(?:(?:http(?:s)?)?://)?([a-z0-9-]+(?:[.][a-z0-9-]+)+)')
    return t ? 'https://' + t[1] + '/lp/attribute' : ''
  }
  function r(e) {
    return new Promise(t => setTimeout(t, e))
  }
  const i = {
    createTouch: async (e = {}) =>
      fetch('/lp/attribute/api/v2/touch', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(e),
      })
        .then(e =>
          e.ok
            ? e.json()
            : e.json().then(e => {
                throw new Error(e.message)
              }),
        )
        .catch(e => (console.error(e), {})),
    createLead: async (e, t = null) =>
      fetch(e + '/api/v2/lead', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lead_id: t,
        }),
      })
        .then(e =>
          e.ok
            ? e.json()
            : e.json().then(e => {
                throw new Error(e.message)
              }),
        )
        .catch(e => (console.error(e), {})),
    syncCookies: async e =>
      fetch(e + '/api/v2/cookie', {
        method: 'POST',
        credentials: 'include',
      })
        .then(e =>
          e.ok
            ? e.json()
            : e.json().then(e => {
                throw new Error(e.message)
              }),
        )
        .catch(e => (console.error(e), {})),
    getLead: async e =>
      fetch(e + '/api/v2/lead', {
        method: 'GET',
        credentials: 'include',
      })
        .then(e =>
          e.ok
            ? e.json()
            : e.json().then(e => {
                throw new Error(e.message)
              }),
        )
        .catch(e => (console.error(e), {})),
    getAdDomains: async () =>
      fetch('/lp/attribute/api/v2/domain', {
        method: 'GET',
        credentials: 'include',
      })
        .then(e =>
          e.ok
            ? e.json()
            : e.json().then(e => {
                throw new Error(e.message)
              }),
        )
        .catch(e => (console.error(e), {})),
    findLead: async e =>
      Promise.any(
        e.map(async e => {
          const t = await i.getLead(e)
          return t.lead_id ? Promise.resolve(t) : Promise.reject('no lead')
        }),
      ).catch(() => ({})),
  }
  function c(e = []) {
    return e
      .map(e =>
        (function (e) {
          const t = document.cookie.match('(?:^|;) ?' + e + '=([^;]*)(?:;|$)')
          return t ? t[1] : null
        })(e),
      )
      .some(e => null !== e)
  }
  ;(async () => {
    const s = await i.getLead(n)
    s.lead_id
      ? await i.createLead(n, s.lead_id)
      : await (async function () {
          const e = await i.getAdDomains(),
            t = (e.platform_domains || []).map(e => o(e)),
            a = (e.ad_campaign_domains || []).map(e => o(e))
          let r = await i.findLead(t)
          if (r.lead_id) await i.createLead(n, r.lead_id)
          else if (((r = await i.findLead(a)), r.lead_id)) {
            await i.createLead(n, r.lead_id)
            for (const e of t) await i.createLead(e, r.lead_id)
          } else {
            r = await i.createLead(n)
            for (const e of t) await i.createLead(e, r.lead_id)
          }
        })()
    const d = await i.createTouch(
      (function () {
        const e = new URLSearchParams(window.location.search),
          a = Object.fromEntries(Array.from(e.entries()).filter(([e, a]) => t.includes(e)))
        return (
          '' != document.referrer && (a.referrer = document.referrer),
          (a.version = 'v0.5'),
          a
        )
      })(),
    )
    d.touch_id &&
      ((async function () {
        let e = 25e3,
          t = [...a]
        for (; e > 0; ) {
          if (c(t)) {
            const e = await i.syncCookies(n)
            if (!e.cookies) return
            if (((t = t.filter(t => !e.cookies.includes(t))), 0 == t.length)) return
          }
          ;((e -= 500), await r(500))
        }
      })(),
      (window.attribute = e({}, window.attribute, {
        touch_id: d.touch_id,
      })))
  })()
})()
