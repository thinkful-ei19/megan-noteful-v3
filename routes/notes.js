'use strict';

const express = require('express');
const Note = require('../models/note');
const mongoose = require('mongoose');

// Create an router instance (aka "mini-app")
const router = express.Router();

/* ========== GET/READ ALL ITEM ========== */
router.get('/notes', (req, res, next) => {

  const {searchTerm} = req.query;
  let filter1 = {};
  let filter2={};

  if (searchTerm) {
    const re = new RegExp(searchTerm, 'i');
    filter1.title = { $regex: re };
    filter2.content = { $regex: re };
  }

  Note.find({$or:[filter1, filter2]})
    .sort('created')
    .then(result => {
      res.json(result);
    })
    .catch(err=>{next(err);
    });
});



/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/notes/:id', (req, res, next) => {

  
  const id = req.params.id;
  let filter= {};

  if(id){
    filter._id= id;
  }

  if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error('ID is not valid');
    err.status = 404;
    return next(err);
  }

  Note.findById(filter)
    .then(result=> {console.log(result); res.json(result);})
    .catch(err=>next(err));
    
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/notes', (req, res, next) => {

  
  // res.location('path/to/new/document').status(201).json({id});

  const newTitle = req.body.title;
  const newContent = req.body.content;
  const newEntry = {};

  if(!newTitle){
    const error = new Error('Missing title in request body');
    error.status=400;
    return next(error);
  }

  if(newTitle){
    newEntry.title = newTitle;
  }

  if(newContent){
    newEntry.content = newContent;
  }

  Note.create(newEntry)
    
    .then(results=> {
      res.location(`${req.originalUrl}/${results.id}`).status(201).json(results);
    })
    .catch(err=>{
      next(err);
    });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/notes/:id', (req, res, next) => {


  const toChange= {};
  const id= req.params.id;
  const title = req.body.title;
  const content = req.body.content;

  if(toChange){
    toChange.title = title;
    toChange.content = content;
  }
  if (!toChange.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  
  if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error('ID is not valid');
    err.status = 404;
    return next(err);
  }

  Note.findByIdAndUpdate(id, toChange, {upsert:true, new:true})
    
    .then(results=>{
      res.json(results);
    })
    .catch(err=> next(err));

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {

  const id = req.params.id;

  if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error('ID is not valid');
    err.status = 404;
    return next(err);
  }

  Note.findByIdAndRemove(id)
    
    .then(res=> res.status(204).end())
    .catch(err=>next(err));

});

module.exports = router;