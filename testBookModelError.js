const mongoose = require('mongoose');
const Book = require('./src/models/bookModel');
const assert = require('assert');

describe('Book Model Error Handling', () => {
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

  it('should throw error for missing title', async () => {
    const bookData = {
      author: 'Test Author',
      genre: 'Fiction',
      publishedDate: new Date('2023-01-01')
    };

    const book = new Book(bookData);

    try {
      await book.save();
      assert.fail('Should have thrown validation error');
    } catch (error) {
      assert(error.errors.title);
      assert.strictEqual(error.errors.title.message, 'Path `title` is required.');
    }
  });

  it('should throw error for missing author', async () => {
    const bookData = {
      title: 'Test Book',
      genre: 'Fiction',
      publishedDate: new Date('2023-01-01')
    };

    const book = new Book(bookData);

    try {
      await book.save();
      assert.fail('Should have thrown validation error');
    } catch (error) {
      assert(error.errors.author);
      assert.strictEqual(error.errors.author.message, 'Path `author` is required.');
    }
  });

  it('should throw error for missing genre', async () => {
    const bookData = {
      title: 'Test Book',
      author: 'Test Author',
      publishedDate: new Date('2023-01-01')
    };

    const book = new Book(bookData);

    try {
      await book.save();
      assert.fail('Should have thrown validation error');
    } catch (error) {
      assert(error.errors.genre);
      assert.strictEqual(error.errors.genre.message, 'Path `genre` is required.');
    }
  });

  it('should throw error for missing publishedDate', async () => {
    const bookData = {
      title: 'Test Book',
      author: 'Test Author',
      genre: 'Fiction'
    };

    const book = new Book(bookData);

    try {
      await book.save();
      assert.fail('Should have thrown validation error');
    } catch (error) {
      assert(error.errors.publishedDate);
      assert.strictEqual(error.errors.publishedDate.message, 'Path `publishedDate` is required.');
    }
  });
});
