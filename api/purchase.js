'use strict'
const { ObjectId } = require('mongodb')

/*

  REQ: exxpress request object
  RES: express response object
  db: mongoDB connection object
  cb: callback that returns to the client whatever you put in as a parameter
*/

/*
Purchase:
date: DateTime object
title: string
description: string
amount: number
reference: string
*/


const get = (req, res, db, cb) => {
  const purchases = db.collection('purchases')
  const purchaseId = req.query.id

  if (purchaseId && purchaseId != 0) {
    return cb(purchases.find({ _id: new ObjectId(purchaseId) }))
  }
  return cb({
    date: new Date(),
    title: '',
    description: '',
    amount: 0,
    reference: ''
  })
}

module.exports = { get }
