const mongoose = require('mongoose');
const Book = require('./src/models/bookModel');
const assert = require('assert');

describe('Book Model', () => {
  before(async () => {
    // Connect to test database
    await mongoose.connect('mongodb://localhost:27017/test-bookstore', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    // Close connection
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear database
    await Book.deleteMany({});
  });

  it('should create a book with valid data', async () => {
    const bookData = {
      title: 'Test Book',
      author: 'Test Author',
      genre: 'Fiction',
      publishedDate: new Date('2023-01-01')
    };

    const book = new Book(bookData);
    const savedBook = await book.save();

    assert.strictEqual(savedBook.title, bookData.title);
    assert.strictEqual(savedBook.author, bookData.author);
    assert.strictEqual(savedBook.genre, bookData.genre);
    assert(savedBook.publishedDate instanceof Date);
  });

  it('should not create a book without required fields', async () => {
    const book = new Book({});

    try {
      await book.save();
      assert.fail('Should have thrown validation error');
    } catch (error) {
      assert(error.name === 'ValidationError');
    }
  });
});
