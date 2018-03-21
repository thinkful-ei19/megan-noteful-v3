'use strict';

const mongoose= require('mongoose');


const noteSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String },
  created: { type: Date, default: Date.now },
});
  
//noteSchema.index({ title: 'text',  content: 'text'});

noteSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const NoteModel = mongoose.model('Note', noteSchema);

module.exports = NoteModel;