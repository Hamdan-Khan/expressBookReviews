const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// TASK 10
async function getBooks() {
  try {
    const response = await axios.get("http://localhost:5000/");
    const books = response.data;
    console.log(books);
  } catch (error) {
    console.error(error);
  }
}

getBooks();

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    res.status(400).send("No book found");
  }
});

// TASK 11
async function getBooksByIsbn() {
  try {
    const response = await axios.get("http://localhost:5000/isbn/3");
    const book = response.data;
    console.log(book);
  } catch (err) {
    console.log(err);
  }
}
getBooksByIsbn();

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  let key;
  let keys = Object.keys(books);
  for (let i = 0; i < keys.length; i++) {
    if (books[keys[i]]["author"] == author) {
      key = keys[i];
      break;
    }
  }
  if (key) {
    res.status(200).json(books[key]);
  } else {
    res.status(404).send("No book with author " + author + " found.");
  }
});

// TASK 12
async function getBooksByAuthor() {
  try {
    const response = await axios.get(
      "http://localhost:5000/author/Samuel%20Beckett"
    );
    const book = response.data;
    console.log(book);
  } catch (err) {
    console.log(err);
  }
}
getBooksByAuthor();

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let key;
  let keys = Object.keys(books);
  for (let i = 0; i < keys.length; i++) {
    if (books[keys[i]]["title"] == title) {
      key = keys[i];
      break;
    }
  }
  if (key) {
    res.status(200).json(books[key]);
  } else {
    res.status(404).send("No book with title " + title + " found.");
  }
});

// TASK 13
async function getBooksByTitle() {
  try {
    const response = await axios.get(
      "http://localhost:5000/title/Things%20Fall%20Apart"
    );
    const book = response.data;
    console.log(book);
  } catch (err) {
    console.log(err.message);
  }
}
getBooksByTitle();

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];
  let review = book["reviews"];
  if (review) {
    res.status(200).json(review);
  } else {
    res.status(400).send("No book review with ISBN " + isbn + " found.");
  }
});

module.exports.general = public_users;
