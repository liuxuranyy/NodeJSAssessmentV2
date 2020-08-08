const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

describe('Put Endpoints', () => {
  it('update class name', async done => {
    await request.put('/api/class/P1-1')
      .send({
        'className': 'P1x1'
      }).expect(204);
    done();
  }, 30000);
});

describe('Get Endpoints', () => {
  it('student listing', async done => {
    const res = await request.get('/api/class/P1-1/students?offset=1&limit=3');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('count');
    expect(res.body.students[0]).toHaveProperty('id');
    expect(res.body.students[0]).toHaveProperty('name');
    expect(res.body.students[0]).toHaveProperty('email');
    done();
  });

  it('workload', async done => {
    const res = await request.get('/api/reports/workload');
    expect(res.statusCode).toEqual(200);
    done();
  });
});
