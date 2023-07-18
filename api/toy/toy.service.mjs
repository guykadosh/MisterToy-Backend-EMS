import { dbService } from '../../services/db.service.mjs'
import { logger } from '../../services/logger.service.mjs'
import { utilService } from '../../services/util.service.mjs'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

async function query(filterBy, sortBy) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('toy')
    var toys = await collection.find(criteria).sort(sortBy).toArray()
    return toys
  } catch (err) {
    logger.error('cannot find toys', err)
    throw err
  }
}

async function getById(toyId) {
  try {
    const collection = await dbService.getCollection('toy')
    const toy = collection.findOne({ _id: new ObjectId(toyId) })
    return toy
  } catch (err) {
    logger.error(`while finding toy ${toyId}`, err)
    throw err
  }
}

async function remove(toyId) {
  try {
    const collection = await dbService.getCollection('toy')
    await collection.deleteOne({ _id: new ObjectId(toyId) })
  } catch (err) {
    logger.error(`cannot remove toy ${toyId}`, err)
    throw err
  }
}

async function add(toy) {
  try {
    const collection = await dbService.getCollection('toy')
    const { insertedId } = await collection.insertOne(toy)
    toy._id = insertedId
    return toy
  } catch (err) {
    logger.error('cannot insert toy', err)
    throw err
  }
}

async function update(toy) {
  try {
    const toyToSave = {
      name: toy.name,
      price: toy.price,
      labels: toy.labels,
      inStock: toy.inStock,
    }
    const collection = await dbService.getCollection('toy')
    await collection.updateOne(
      { _id: new ObjectId(toy._id) },
      { $set: toyToSave }
    ) //OK??
    return toy
  } catch (err) {
    logger.error(`cannot update toy ${toy._id}`, err)
    throw err
  }
}

async function addToyMsg(toyId, msg) {
  try {
    msg.id = utilService.makeId()
    const collection = await dbService.getCollection('toy')
    await collection.updateOne(
      { _id: new ObjectId(toyId) },
      { $push: { msgs: msg } }
    )
    return msg
  } catch (err) {
    logger.error(`cannot add toy msg ${toyId}`, err)
    throw err
  }
}

async function removeToyMsg(toyId, msgId) {
  try {
    const collection = await dbService.getCollection('toy')
    await collection.updateOne(
      { _id: new ObjectId(toyId) },
      { $pull: { msgs: { id: msgId } } }
    )
    return msgId
  } catch (err) {
    logger.error(`cannot add toy msg ${toyId}`, err)
    throw err
  }
}

function _buildCriteria(filterBy = { txt: '', labels: null, status: '' }) {
  const { labels, txt, status } = filterBy

  const criteria = {}

  if (txt) {
    criteria.name = { $regex: txt, $options: 'i' }
  }

  if (labels && labels.length > 0) {
    const labelsCrit = labels.map(label => ({
      labels: { $elemMatch: { title: label } },
    }))

    criteria.$and = labelsCrit
  }

  if (status) {
    criteria.inStock = status === 'stock' ? true : false
  }

  return criteria
}

export const toyService = {
  remove,
  query,
  getById,
  add,
  update,
  addToyMsg,
  removeToyMsg,
}
