const express = require('express');
const mongoose = require('mongoose');
const Book = require('./book.model');

const app = express();
const port = 3000;

mongoose.connect('mongodb://db/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.use(express.json());

app.get('/books', async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

app.post('/books', async (req, res) => {
    const newBook = new Book(req.body);
    await newBook.save();
    res.json(newBook);
});

app.delete('/books/:id', async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

app.put('/books/:id', async (req, res) => {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBook);
});

app.use(express.static('app'));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
