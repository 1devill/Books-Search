"use strict";

let $searchForm = $("#search-form");
let $bookList = $('#book-list');
let $currentBook = $('#current-book');
let $bookDescription = $(".book-description");
let books = [];

$searchForm.on("submit", function(event) {
    event.preventDefault();

    let query = $(this).find("#search-term").val().replace(/\s/g, "+");

    console.log(query);
    getBooks(query);
});

function getBooks(query) {
    let url = "https://www.googleapis.com/books/v1/volumes";

    $.ajax({
        url,
        method: "GET",
        data: `q=${query}`
    }).done((response) => {
        books = response.items;
        addBooks(response.items);
    }).fail((error) => {
        console.log(error);
    })
}


function addBooks(data) {
    $bookList.empty();

    data.forEach(book => {
        $("<a href=''>").addClass("list-group-item")
            .text(book.volumeInfo.title)
            .attr("data-id", book.id)
            .appendTo($bookList);
    });
}

$bookList.on("click", "[data-id]", function(event) {
    event.preventDefault();

    let bookId = $(this).data("id");

    let book = books.find((item) => item.id === bookId);
    $currentBook.fadeIn();

    $currentBook.find(".book-title").text(`${book.volumeInfo.title} 
    | ${book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "No author"}
    ${book.volumeInfo.publishedDate}`)

    $bookDescription.empty();
    $("<img>").attr("src", book.volumeInfo.imageLinks.thumbnail)
        .appendTo($bookDescription);

    $("<p>").text(book.volumeInfo.description).appendTo($bookDescription);

    $("<a>").attr("href", book.volumeInfo.previewLink)
        .attr("target", "_blank")
        .text("Read more...")
        .addClass("read-link")
        .appendTo($bookDescription);
});