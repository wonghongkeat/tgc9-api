const express = require('express');
const router = express.Router();
const MongoUtil = require('../MongoUtil');
const ObjectId = require('mongodb').ObjectId;

router.get('/', async (req, res) => {
    let db = MongoUtil.getDB();
    let faults = await db.collection('faults').find().toArray();
    res.send(faults);
})

router.post('/', async (req, res) => {
    let db = MongoUtil.getDB();

    // extract out all the fields
    let {
        title, location, tags, block, reporter_name, reporter_email, date
    } = req.body;

    // JavaScript black magic
    // let newFault = {...req.body};

    // tags could be an array, or a single item, or undefined (because the user didn't check any checkbox)

    // for undefined: if tags is undefined, it will be an empty array
    tags = tags || [];

    // if tags is not an array, convert to array
    tags = Array.isArray(tags) ? tags : [tags];

    date = new Date(date);

    let results = await db.collection('faults').insertOne({
        title, location, tags, block, reporter_name, reporter_email, date
    })

    // if I use res.send and it sends back an array or an object,
    // express will auto convert it to be JSON
    res.send({
        'message': 'New fault report has been created successfully!',
        'inserterdid': results.insertedId
    })
})

router.patch('/:id', async (req, res) => {
    let db = MongoUtil.getDB();
    let id = req.params.id;

    let {
        title, location, tags, block, reporter_name, reporter_email, date
    } = req.body;

    // JavaScript black magic
    // let newFault = {...req.body};

    // tags could be an array, or a single item, or undefined (because the user didn't check any checkbox)

    // for undefined: if tags is undefined, it will be an empty array
    tags = tags || [];

    // if tags is not an array, convert to array
    tags = Array.isArray(tags) ? tags : [tags];

    date = new Date(date);

    let results = await db.collection('faults').updateOne({
        '_id': ObjectId(id)
    },
    {
        '$set': {
            title, location, tags, block, reporter_name, reporter_email, date
        }

    });

    res.send({
        'message': 'Update done',
        'status': 'OK'
    })

})

router.delete('/:id', async (req, res)=>{
    let db = MongoUtil.getDB();
    await db.collection('faults').deleteOne({
        _id:ObjectId(req.params.id)
    })

    res.send({
        'status':'OK'
    })
})

module.exports = router;