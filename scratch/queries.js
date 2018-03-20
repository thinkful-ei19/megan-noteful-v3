'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

//Delete Note:

// mongoose.connect(MONGODB_URI)
//   .then(()=>{
//     const id = '000000000000000000000004';

//     return Note.findByIdAndRemove(id);
//   })
//   .then(res=> console.log(res))
//   .catch(console.error)
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });



//Update Existing Note:

// mongoose.connect(MONGODB_URI)
//   .then(()=>{
//     const toChange= {};
//     const id= '000000000000000000000003';
//     const title = 'Lady Gaga lives on in this note';
//     const content = 'Im on the Edge of Glory';

//     if(toChange){
//       toChange.title = title;
//       toChange.content = content;
//     }

//     return Note.findByIdAndUpdate(id, toChange, {upsert:true, new:true});
//   })
//   .then(res=>console.log(res))
//   .catch(console.error)
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });



//Create New Note

// mongoose.connect(MONGODB_URI)
//   .then(()=>{
//     const newTitle = 'Test';
//     const newContent = 'Testing create';
//     const newEntry = {};

//     if(newTitle){
//       newEntry.title = newTitle;
//     }

//     if(newContent){
//       newEntry.content = newContent;
//     }

//     return Note.create(newEntry);
//   })
//   .then(res=> console.log(res))
//   .catch(console.error)
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });




//Find by Id

// mongoose.connect(MONGODB_URI)
//   .then(()=> {
//     const id = '000000000000000000000001';
//     let filter= {};

//     if(id){
//       filter._id= id;
//     }
//     return Note.findById(filter);
//   })
//   .then(res=> console.log(res))
//   .catch(console.error)
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });




// Find/Search for notes (with mini challenge that searches both title and content:

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const searchContent = 'Lorem';
//     let filter1 = {};
//     let filter2={};

//     if (searchContent) {
//       const re = new RegExp(searchContent, 'i');
//       filter1.title = { $regex: re };
//       filter2.content = { $regex: re };
//     }

//     return Note.find({$or:[filter1, filter2]})
//       .sort('created')
//       .then(results => {
//         console.log(results);
//       })
//       .catch(console.error);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//       .then(() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });