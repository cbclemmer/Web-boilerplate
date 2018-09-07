'use strict'
const { ObjectId } = require('mongodb')

/*

  REQ: exxpress request object
  RES: express response object
  db: mongoDB connection object
  cb: callback that returns to the client whatever you put in as a parameter
*/

/*
Sale:
  listingID
  date
  amount
*/

const getList = async (req, res, db, cb) => {
  const sales = db.collection('sales')

  return cb(await (sales.find({ }).toArray()))
}

const get = async (req, res, db, cb) => {
  const sales = db.collection('sales')
  const saleId = req.query.id

  if (saleId && saleId != 0) {
    return cb(await sales.find({ _id: new ObjectId(saleId) }))
  }
  
  return cb({
    listingID: new ObjectId(),
    date: new Date(),
    amount: 0
  })
}

const post = async (req, res, db, cb) => {
  const sales = db.collection('sales')
  const body = req.body

  if (!body.date || isNaN(new Date(body.date))) return cb({ error: 'Invalid Date' })
  if (!body.amount || isNaN(parseFloat(body.amount))) return cb({ error: 'Invalid amount' })

  let listing = null
  if (body.listingID) {
    listing = await db.collection('listings').findOne({ _id: new ObjectId(body.listingID) })
    
    if (!listing) return cb({ error: 'Cannot Find Listing'})
  }
  
  const sale = {
    listingID: listing === null ? null : listing._id,
    date: new Date(body.date),
    amount: parseFloat(body.amount)
  }

  if (!body._id) {
    await sales.insertOne(sale)
  } else {
    await sales.updateOne({ _id: new ObjectId(body._id) }, sale)
  }
  return cb(sale)
}

module.exports = { getList, get, post }
