'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const { TEST_MONGODB_URI } = require('../config');
const Note = require('../models/note');
const seedNotes = require('../db/seed/notes');
const expect = chai.expect;
chai.use(chaiHttp);

describe('start, seed, do tests, disconnect', function() {
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI);
  });

  beforeEach(function () {
    return Note.insertMany(seedNotes)
      .then(() => Note.createIndexes());
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  //Get All Notes
  describe('GET /api/notes', function () {
    it('should return the correct number of Notes', function () {
      // 1) Call the database and the API
      const dbPromise = Note.find();
      const apiPromise = chai.request(app).get('/api/notes');
      // 2) Wait for both promises to resolve using `Promise.all`
      return Promise.all([dbPromise, apiPromise])
      // 3) **then** compare database results to API response
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });


    it('should return the correct notes for a searchTerm query', function () {
      const searchContent = 'cats';
      let filter1 = {};
      let filter2={};

      if (searchContent) {
        const re = new RegExp(searchContent, 'i');
        filter1.title = { $regex: re };
        filter2.content = { $regex: re };
      }
      const dbPromise = Note.find({$or: [filter1, filter2]});
      const apiPromise = chai.request(app).get(`/api/notes?searchTerm=${searchContent}`);

      return Promise.all([dbPromise, apiPromise])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(8);
          expect(res.body[0]).to.be.an('object');
          expect(res.body[0].id).to.equal(data[0].id);
        });
    });


  });

  //Get notes by ID:
  describe('GET /api/notes/:id', function () {
    it('should return correct notes', function () {
      let data;
      // 1) First, call the database
      return Note.findOne().select('id title content')
        .then(_data => {
          data = _data;
          // 2) **then** call the API
          return chai.request(app).get(`/api/notes/${data.id}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'created');

          // 3) **then** compare
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
        });
    });

    // it('should respond with a 404 for bad ID', function(){
    //   return chai.request(app).get('/api/notes/9')
    //     .then(res=>{
    //       expect(res).to.have.status(404);
    //     });

    // });

  });  

  //Post/Create Notes:
  describe('POST /api/notes', function () {
    it('should create and return a new item when provided valid data', function () {
      const newItem = {
        'title': 'The best article about cats ever!',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
        'tags': []
      };
      let body;
      // 1) First, call the API
      return chai.request(app)
        .post('/api/notes')
        .send(newItem)
        .then(function (res) {
          body = res.body;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.include.keys('id', 'title', 'content');
          // 2) **then** call the database
          return Note.findById(body.id);
        })
      // 3) **then** compare
        .then(data => {
          expect(body.title).to.equal(data.title);
          expect(body.content).to.equal(data.content);
        });
    });

    it('should return an error when missing "title" field', function () {
      const updateItem = {
        'foo': 'bar'
      };

      return chai.request(app)
        .post('/api/notes')
        .send(updateItem)
        .catch(err => err.response)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing title in request body');
        });
    });
  });

  //Put/Update Notes based on ID:
  describe('PUT api/notes/:id', function(){
    
    
    it('should update a note based on its id and the new information', function(){
      const updateNote = {
        'title': 'What about dogs?!',
        'content': 'woof woof',
        'tags': []
      };
      let body;
      return chai.request(app).put('/api/notes/000000000000000000000000')
        .send(updateNote)
        .then(res=>{
          body = res.body;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.include.keys('id', 'title', 'content', 'created');
          expect(body.id).to.equal('000000000000000000000000');
          expect(body.title).to.equal(updateNote.title);
          expect(body.content).to.equal(updateNote.content);
          return Note.findById({_id:'000000000000000000000000'});
        })
        .then(data=>{
          expect(data.title).to.equal(body.title);
          expect(data.content).to.equal(body.content);
          expect(data.id).to.equal(body.id);
        });
    });


    it('should return an error when missing "title" field', function () {
      const updateItem = {
        'foo': 'bar'
      };

      return chai.request(app)
        .put('/api/notes/000000000000000000000000')
        .send(updateItem)
        .catch(err => err.response)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `title` in request body');
        });
    });

    it('should respond with a 404 for bad ID', function(){
      const updateNote = {
        'title': 'What about dogs?!',
        'content': 'woof woof',
        'tags': []
      };
      return chai.request(app).put('/api/notes/9').send(updateNote)
        .catch(err=>err.response)
        .then(res=>{
          expect(res).to.have.status(404);
        });

    });

  });


  //Delete Notes by ID:
  describe('DELETE api/notes/:id', function(){
    // it('should delete the note based on its ID', function(){
    //   let beforeDelete;
    //   return Note.findById({_id:'000000000000000000000001'})
    //     .then(res=>{
    //       beforeDelete = res;
    //       return chai.request(app).delete('/api/notes/000000000000000000000001');
    //     })
    //     .then(data=>{
    //       expect(data).to.have.status(204);
    //       return Note.findById({_id:'000000000000000000000001'});
    //     })
    //     .then(result=>{
    //       console.log(result);
    //       expect(beforeDelete).to.not.equal(result);
    //       expect(result).to.be.null;          
    //     });
    // });

    it('should respond with a 404 for a bad id', function () {

      return chai.request(app)
        .delete('/api/notes/9')
        .catch(err => err.response)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });

  });




});