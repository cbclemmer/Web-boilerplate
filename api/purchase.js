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

const getList = async (req, res, db, cb) => {
  const purchases = db.collection('purchases')

  return cb(await (purchases.find({ }).toArray()))
}


const get = async (req, res, db, cb) => {
  const purchases = db.collection('purchases')
  const purchaseId = req.query.id

  if (purchaseId && purchaseId != 0) {
    return cb(await purchases.find({ _id: new ObjectId(purchaseId) }))
  }
  
  return cb({
    date: new Date(),
    title: '',
    description: '',
    amount: 0,
    reference: ''
  })
}

const post = async (req, res, db, cb) => {
  const purchases = db.collection('purchases')
  const body = req.body

  if (!body.date || isNaN(new Date(body.date))) return cb({ error: 'Invalid Date' })
  if (!body.title) return cb({ error: 'Empty title' })
  if (!body.amount) return cb({ error: 'Invalid amount' })

  const purchase = {
    date: new Date(body.date),
    title: body.title,
    description: body.description,
    amount: parseFloat(body.amount),
    reference: body.reference
  }

  if (!body._id) {
    await purchases.insertOne(purchase)
  } else {
    await purchases.updateOne({ _id: new ObjectId(body._id) }, purchase)
  }
  return cb(purchase)
}

module.exports = { getList, get, post }
