const express = require('express');
const mongoose = require('mongoose');
const Book = require('../models/bookModel');

const router = express.Router();

// POST route to add a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, genre, publishedDate } = req.body;

    // Create a new book instance with the request data
    const newBook = new Book({
      title,
      author,
      genre,
      publishedDate,
    });

    // Attempt to save the new book to the database
    await newBook.save();

    // Send success response
    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    // If there's a validation error, send a detailed error message
    res.status(400).json({ message: 'Error adding book', error: error.message });
  }
});

// GET route to fetch all books with pagination
router.get('/', async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: 'Page and limit must be positive integers' });
    }

    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / limit);
    const books = await Book.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      page,
      limit,
      totalPages,
      totalBooks,
      books,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

// GET route to fetch a single book by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
});

// PUT route to update a book by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const { title, author, genre, publishedDate } = req.body;

    // Validate required fields
    if (!title || !author || !genre || !publishedDate) {
      return res.status(400).json({ message: 'All fields (title, author, genre, publishedDate) are required' });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, genre, publishedDate },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    res.status(400).json({ message: 'Error updating book', error: error.message });
  }
});

// DELETE route to remove a book by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
});

module.exports = router;
