const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean

  let existingUser = users.find( user =>
      user.username === username)
  return !!existingUser;

}

const authenticatedUser = (username,password)=>{ //returns boolean
  let userMatch = users.find( user =>
      user.username === username && user.password === password);
  return !!userMatch;
}

//only registered users can login
regd_users.post("/login", (req,
                           res) => {
  const {username, password} = req.body;
  if (authenticatedUser(username, password)){
    let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60*60})
    req.session.authorization = {accessToken, username}
    return res.send("Customer successfully login.")
  }
  return res.send("Incorrect email or password");
})


// Add a book review
regd_users.put("/auth/review/:isbn", (req,
                                      res) => {
  let isbn = req.params.isbn
  let review = req.body.review
  let book = Object.values(books).find(book => book.isbn === isbn);
  book.reviews[req.user] = review

  console.log(books);

  return res.send(`The review for the book with ISBN ${isbn} has been added/updated`)
});

regd_users.delete('/auth/review/:isbn', (req,
                                         res) => {
  let isbn = req.params.isbn
  let book = Object.values(books).find(book => book.isbn === isbn);
  delete book.reviews[req.user];
  return res.send(`Reviews for the ISBN ${isbn} by the user ${req.user} has been deleted`)
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
