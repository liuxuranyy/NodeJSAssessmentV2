const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);
const fs = require('fs');
import {BAD_REQUEST,NO_CONTENT, OK} from 'http-status-codes';


describe('Put Endpoints', () => {
  it('test update class name run successfully', async done => {
    const res = await request.put('/api/class/P1-1')
      .send({
        'className': 'P1x1'
      });
    expect(res.statusCode).toEqual(NO_CONTENT);
    done();
  }, 30000);
  it('test validation for update class name api', async done => {
    const res = await request.put('/api/class/P1-1')
      .send({
        'className': ''
      });
    expect(res.statusCode).toEqual(BAD_REQUEST);
    done();
  }, 30000);
});

//will fail if external api is not activated
describe('Get Endpoints', () => {
  it('test student listing api return correctly', async done => {
    let offset = 1;
    let limit = 3;
    const res = await request.get(`/api/class/P1-1/students?offset=${offset}&limit=${limit}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('count');
    expect(res.body).toHaveProperty('students');
    expect(res.body.students[0]).toHaveProperty('id');
    expect(res.body.students[0]).toHaveProperty('name');
    expect(res.body.students[0]).toHaveProperty('email');
    expect(res.status).toBe(OK);
    done();
  });

  it('workload', async done => {
    const res = await request.get('/api/reports/workload');
    expect(res.statusCode).toBe(OK);
    done();
  });
});

//fail due to test csv file path cannot be access
describe('Post Endpoints', () => {
  const filePath = 'src\\__test__\\testFiles\\data.sample.csv';
  const absolutePath =`${__dirname}\\testFiles\\data.sample.csv`;
  it('test data import api', async done => {
    if(fs.existsSync(absolutePath)){
      const res = await request.post('/api/upload').attach('file', filePath);
      expect(res.statusCode).toBe(NO_CONTENT);
    }else{
      new Error('file does not exist');
    }
    done();
  });
})
