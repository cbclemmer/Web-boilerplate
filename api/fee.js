'use strict'
const { ObjectId } = require('mongodb')

/*

  REQ: exxpress request object
  RES: express response object
  db: mongoDB connection object
  cb: callback that returns to the client whatever you put in as a parameter
*/

/*
Fee:
  listingID
  date
  description
  amount
*/

const getList = async (req, res, db, cb) => {
  const fees = db.collection('fees')

  return cb(await (fees.find({ }).toArray()))
}

const get = async (req, res, db, cb) => {
  const fees = db.collection('fees')
  const feeId = req.query.id

  if (feeId && feeId != 0) {
    return cb(await fees.find({ _id: new ObjectId(feeId) }))
  }
  
  return cb({
    listingID: new ObjectId(),
    date: new Date(),
    description: '',
    amount: 0
  })
}

const post = async (req, res, db, cb) => {
  const fees = db.collection('fees')
  const body = req.body

  if (!body.date || isNaN(new Date(body.date))) return cb({ error: 'Invalid Date' })
  if (!body.amount || isNaN(parseFloat(body.amount))) return cb({ error: 'Invalid amount' })

  let listing = null
  if (body.listingID) {
    listing = await db.collection('listings').findOne({ _id: new ObjectId(body.listingID) })
    
    if (!listing) return cb({ error: 'Cannot Find Listing'})
  }
  
  const fee = {
    listingID: listing === null ? null : listing._id,
    date: new Date(body.date),
    description: body.description,
    amount: parseFloat(body.amount)
  }

  if (!body._id) {
    await fees.insertOne(fee)
  } else {
    await fees.updateOne({ _id: new ObjectId(body._id) }, fee)
  }
  return cb(fee)
}

module.exports = { getList, get, post }
