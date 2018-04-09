import { getServer } from '../src/server'
import * as supertest from 'supertest'

const request = supertest(getServer())

describe('basic routes tests', () => {

  it('GET to / should return 200', (done) => {
    request
      .get('/')
      .end((err, res) => {
        expect(err).toEqual(null)
        expect(res.status).toEqual(200)
        done();
      })
  })

  it('GET to /pagecount should return 200', (done) => {
    request
      .get('/pagecount')
      .end((err, res) => {
        expect(err).toEqual(null)
        expect(res.status).toEqual(200)
        done();
      })

  })
})

