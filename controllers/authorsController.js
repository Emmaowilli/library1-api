const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

/**
 * GET all authors
 */
const getAllAuthors = async (req, res) => {
  try {
    const result = await mongodb
      .getDb()
      .collection('authors')
      .find()
      .toArray();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET author by ID
 */
const getAuthorById = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);

    const result = await mongodb
      .getDb()
      .collection('authors')
      .findOne({ _id: authorId });

    if (!result) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * CREATE new author
 */
const createAuthor = async (req, res) => {
  try {
    const { firstName, lastName, birthYear } = req.body;

    if (!firstName || !lastName || !birthYear) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const response = await mongodb
      .getDb()
      .collection('authors')
      .insertOne({ firstName, lastName, birthYear });

    res.status(201).json({ id: response.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE author
 */
const updateAuthor = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    const { firstName, lastName, birthYear } = req.body;

    if (!firstName || !lastName || !birthYear) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const response = await mongodb
      .getDb()
      .collection('authors')
      .replaceOne(
        { _id: authorId },
        { firstName, lastName, birthYear }
      );

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE author
 */
const deleteAuthor = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);

    const response = await mongodb
      .getDb()
      .collection('authors')
      .deleteOne({ _id: authorId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};


