const express = require('express');
const { ObjectId } = require('mongodb');
const {connectToDb, getDb} = require('./db');
const app = express();

//using express
app.use(express.json())


//db connection
let db;
connectToDb ((err)=>{
    if(!err){
        app.listen(4000,()=>{
            console.log('port 4000 is running')
        })
    }
    db = getDb()
})

/*============ Routes ==============*/
//Get books
app.get('/books',(req,res)=>{
    //current page
    const page = req.query.p || 0
    const bookPerPage = 3

    let books = []; 

    db.collection('books').find().sort({author : 1})
    .skip(page * bookPerPage - bookPerPage)
    .limit(bookPerPage)
    .forEach(book => books.push(book))
    .then(()=>{
        res.status(200).json(books)
    })
    .catch((error)=>{
        res.status(500).json({error : 'could not fetch the document'})
    })
})


//Get a book
app.get('/books/:id',(req,res)=>{
    
    if(ObjectId.isValid(req.params.id)){
        db.collection('books').findOne({_id: ObjectId(req.params.id)})
            .then((document)=>{
                res.status(200).json(document)
            })
            .catch((error)=>{
                res.status(500).json({error : 'could not fetch the document'})
            })
    }else{
        res.status(500).json({message : 'not the valid id'})
    }
})

//Post a book
app.post('/books',(req,res)=>{
    const book = req.body
    db.collection('books').insertOne(book)
        .then(result=>{
            res.status(200).json(result)
        })
        .catch(err=>{
            res.status(500).json({err : 'could not post a new document'})
        })
})

//Delete a book
app.delete('/books/:id',(req,res)=>{
    
    if(ObjectId.isValid(req.params.id)){
        db.collection('books').deleteOne({_id: ObjectId(req.params.id)})
            .then((result)=>{
                res.status(200).json(result)
            })
            .catch((error)=>{
                res.status(500).json({error : 'could not delete the document'})
            })
    }else{
        res.status(500).json({message : 'not the valid id'})
    }
})

//Patch a book
app.patch('/books/:id',(req,res)=>{
    const book = req.body
    if(ObjectId.isValid(req.params.id)){
        db.collection('books').updateOne({_id: ObjectId(req.params.id)},{$set : book})
            .then((result)=>{
                res.status(200).json(result)
            })
            .catch((error)=>{
                res.status(500).json({error : 'could not path the document'})
            })
    }else{
        res.status(500).json({message : 'not the valid id'})
    }
})