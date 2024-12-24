const express = require('express');
let books = require("./booksdb.js");
const req = require("express/lib/request");
const res = require("express/lib/response");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,
                                res) => {
  const {username, password} = req.body;
  if (!username) {
    return res.status(400).json({message: "Username is not provided"});
  } else if (!password) {
    return res.status(400).json({message: "Password is not provided"});
  }

  if (isValid(username)) {
    return res.status(400).json({"message": "Username is already exists"});
  }

  users.push({username: username, password: password});
  return res.status(200).json({"message": "Customer successfully registered. Now you can login."});

});

// Get the book list available in the shop
public_users.get('/',function (req,
                               res) {

  return res.status(200).json(books);
});

public_users.get('/book-promise', async function (req,
                                                  res) {
  const fetchBook = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    }
    else {reject("No Book available")}
  })

  fetchBook
      .then(book => res.status(200).json(books))
  .catch(err => res.status(400).json({message: err}));
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req,
                                         res) {
  const isbn = req.params.isbn
  let book = Object.values(books).filter(bookData => bookData.isbn === isbn)
  return res.status(200).json(book);
 });


public_users.get('/isbn-async/:isbn', async function(req,
                                                     res){
    const isbn = req.params.isbn
  try {
    const fetchBookByISBN = await new Promise((resolve, reject) => {
      let book = Object.values(books).find(bookData => bookData.isbn === isbn);
      if (book) {
        resolve(book)
      } else {
        reject(`No Book with the ${isbn} is available`)
      }
    });
    res.status(200).json(fetchBookByISBN);
  } catch (err) {
    res.status(404).json({message: err});
  }})

// Get book details based on author
public_users.get('/author/:author',function (req,
                                             res) {
  let author = req.params.author
  let book = Object.values(books).filter(book => book.author === author)
  return res.status(200).json({bookbyauthor: book});
});

public_users.get('/author-async/:author', (req,
                                           res) => {
  let author = req.params.author
  const bookByAuthor = new Promise((resolve, reject) => {
    let book = Object.values(books).find(book => book.author === author)
    if (book) {
      resolve(book)
    } else {
      reject(`No Book for the author`)
    }
  })

  bookByAuthor
      .then(
          book => {res.status(200).json({fetchByAuthor: book})}
      ).catch(err => res.status(404).json({message: err}));
})

// Get all books based on title
public_users.get('/title/:title',function (req,
                                           res) {
  let title = req.params.title
  let book = Object.values(books).filter(book => book.title === title)
  return res.status(200).json({bookbytitle: book});
});

public_users.get('/title-async/:title', function(req,
                                                 res) {
  let title = req.params.title
  const bookTitle = new Promise((resolve, reject) => {
    let book = Object.values(books).find(book => book.title === title)
    if (book) {
      resolve(book)
    } else {
      reject(`No Book with the ${title} is available`)
    }
  })

  bookTitle.then(
      (book) => res.status(200).json({fetchByTitle: book}))
          .catch(err => res.status(404).json({message: err}))
  })


//  Get book review
public_users.get('/review/:isbn',function (req,
                                           res) {
  let isbn = req.params.isbn
  let book = Object.values(books).find(book => book.isbn === isbn)
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
