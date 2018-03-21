// 'use strict';
// const app = require('../server');
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const mongoose = require('mongoose');
// const express = require('express');

// const { TEST_MONGODB_URI } = require('../config');

// const Note = require('../models/note');
// const seedNotes = require('../db/seed/notes');

// const expect = chai.expect;

// chai.use(chaiHttp);

// describe('Noteful API - Notes', function () {
//   before(function () {
//     return mongoose.connect(TEST_MONGODB_URI);
//   });

//   beforeEach(function () {
//     return Note.insertMany(seedNotes)
//       .then(() => Note.createIndexes());
//   });

//   afterEach(function () {
//     return mongoose.connection.db.dropDatabase();
//   });

//   after(function () {
//     return mongoose.disconnect();
//   });

// describe('POST /api/notes', function () {

//     it('should create and return a new item when provided valid data', function () {
//       const newItem = {
//         'title': 'The best article about cats ever!',
//         'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
//         'tags': []
//       };
//       let body;
//       return chai.request(app)
//         .post('/api/notes')
//         .send(newItem)
//         .then(function (res) {
//           body = res.body;
//           expect(res).to.have.status(201);
//           expect(res).to.have.header('location');
//           expect(res).to.be.json;
//           expect(body).to.be.a('object');
//           expect(body).to.include.keys('id', 'title', 'content');
//           return Note.findById(body.id);
//         })
//         .then(data => {
//           expect(body.title).to.equal(data.title);
//           expect(body.content).to.equal(data.content);
//         });
//     });
//   });

// });