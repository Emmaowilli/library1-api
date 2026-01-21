const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

/**
 * GET all books
 */
const getAllBooks = async (req, res) => {
  try {
    const result = await mongodb
      .getDb()
      .collection('books')
      .find();

    const books = await result.toArray();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET book by ID
 */
const getBookById = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);

    const book = await mongodb
      .getDb()
      .collection('books')
      .findOne({ _id: bookId });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CREATE book
 */
const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      year,
      genre,
      place,
      pages,
      publisher,
      isbn
    } = req.body;

    // ✅ Validation (7+ fields)
    if (
      !title ||
      !author ||
      !year ||
      !genre ||
      !place ||
      !pages ||
      !publisher ||
      !isbn
    ) {
      return res.status(400).json({
        message:
          'title, author, year, genre, place, pages, publisher, and isbn are required'
      });
    }

    const book = {
      title,
      author,
      year,
      genre,
      place,
      pages,
      publisher,
      isbn,
      createdAt: new Date()
    };

    const response = await mongodb
      .getDb()
      .collection('books')
      .insertOne(book);

    res.status(201).json({ id: response.insertedId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE book
 */
const updateBook = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);
    const {
      title,
      author,
      year,
      genre,
      place,
      pages,
      publisher,
      isbn
    } = req.body;

    if (
      !title ||
      !author ||
      !year ||
      !genre ||
      !place ||
      !pages ||
      !publisher ||
      !isbn
    ) {
      return res.status(400).json({
        message:
          'title, author, year, genre, place, pages, publisher, and isbn are required'
      });
    }

    const book = {
      title,
      author,
      year,
      genre,
      place,
      pages,
      publisher,
      isbn
    };

    const response = await mongodb
      .getDb()
      .collection('books')
      .replaceOne({ _id: bookId }, book);

    if (response.modifiedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE book
 */
const deleteBook = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);

    const response = await mongodb
      .getDb()
      .collection('books')
      .deleteOne({ _id: bookId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};


