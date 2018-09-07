'use strict'
const { ObjectId } = require('mongodb')

/*

  REQ: exxpress request object
  RES: express response object
  db: mongoDB connection object
  cb: callback that returns to the client whatever you put in as a parameter
*/

/*
Listing:
  purchaseID
  date
  title
  reference
  listedAmount
*/

const getList = async (req, res, db, cb) => {
  const listings = db.collection('listings')

  return cb(await (listings.find({ }).toArray()))
}

const get = async (req, res, db, cb) => {
  const listings = db.collection('listings')
  const listingId = req.query.id

  if (listingId && listingId != 0) {
    return cb(await listings.find({ _id: new ObjectId(listingId) }))
  }
  
  return cb({
    purchaseID: new ObjectId(),
    date: new Date(),
    title: '',
    reference: '',
    listedAmount: 0
  })
}

const post = async (req, res, db, cb) => {
  const listings = db.collection('listings')
  const body = req.body

  if (!body.date || isNaN(new Date(body.date))) return cb({ error: 'Invalid Date' })
  if (!body.title) return cb({ error: 'Empty title' })
  if (!body.listedAmount) return cb({ error: 'Invalid amount' })

  let purchase = null
  if (body.purchaseID) {
    purchase = await db.collection('purchases').findOne({ _id: new ObjectId(body.purchaseID) })
    
    if (!purchase) return cb({ error: 'Cannot Find Purchase'})
  }
  
  const listing = {
    purchaseID: purchase === null ? null : purchase._id,
    date: new Date(body.date),
    title: body.title,
    reference: body.reference,
    listedAmount: parseFloat(body.listedAmount)
  }

  if (!body._id) {
    await listings.insertOne(listing)
  } else {
    await listings.updateOne({ _id: new ObjectId(body._id) }, listing)
  }
  return cb(listing)
}

module.exports = { getList, get, post }
