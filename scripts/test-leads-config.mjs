import assert from 'node:assert/strict'
import handler from '../api/leads.js'

function response() {
  return {
    headers: {}, statusCode: 200, body: undefined,
    setHeader(name, value) { this.headers[name] = value },
    status(code) {
      this.statusCode = code
      return { json: (body) => { this.body = body } }
    },
  }
}

function request({ method = 'GET', host = 'envisionlandscapingllc.com' } = {}) {
  return { method, headers: { host } }
}

const originalEnabled = process.env.ENVISION_FORMSPREE_INTAKE_ENABLED
const originalFormId = process.env.ENVISION_FORMSPREE_FORM_ID

try {
  delete process.env.ENVISION_FORMSPREE_INTAKE_ENABLED
  delete process.env.ENVISION_FORMSPREE_FORM_ID
  let res = response()
  handler(request(), res)
  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.body, { formspreeEnabled: false })

  process.env.ENVISION_FORMSPREE_INTAKE_ENABLED = 'true'
  process.env.ENVISION_FORMSPREE_FORM_ID = 'envisionForm_2026'
  res = response()
  handler(request(), res)
  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.body, { formspreeEnabled: true, formId: 'envisionForm_2026' })

  res = response()
  handler(request({ host: 'evil.example' }), res)
  assert.equal(res.statusCode, 403)

  res = response()
  handler(request({ method: 'POST' }), res)
  assert.equal(res.statusCode, 405)
} finally {
  if (originalEnabled === undefined) delete process.env.ENVISION_FORMSPREE_INTAKE_ENABLED
  else process.env.ENVISION_FORMSPREE_INTAKE_ENABLED = originalEnabled
  if (originalFormId === undefined) delete process.env.ENVISION_FORMSPREE_FORM_ID
  else process.env.ENVISION_FORMSPREE_FORM_ID = originalFormId
}

console.log('Lead configuration endpoint checks passed.')
