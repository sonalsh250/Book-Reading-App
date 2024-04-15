//Book Class: Represents a book
class Book{
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class: Handle UI Tasks
class UI{
    static displayBooks() {  //static so it gets called directly without calling it anywhere
        // const storedBooks = [
        //     {
        //         title: 'Title One',
        //         author: 'Author One',
        //         isbn: '1234'
        //     },
        //     {
        //         title: 'Title Two',
        //         author: 'Author Two',
        //         isbn: '2345'
        //     }
        // ];
        //const books = storedBooks;

        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book)); //looping through book and calling 
                                                        //addBookToList method and passing each book into it
    }

    static addBookToList(book) {
        //create row to insert into the table body 
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');  //creates a DOM element, tr is table row
        
        //`` backticks are used so that we can use variables inside
        row.innerHTML = `   
            <td>${book.title}</td>    
            <td>${book.author}</td>    
            <td>${book.isbn}</td>   
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>   
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {

        /*X contains delete class, next line asks if the clicked element 
        contains the delete class*/
        if(el.classList.contains('delete')) 
        {
            /*suppose we clicked on the first author, it's parent elemet is 
            td (it's column), and td's parent elemnt is tr (whole row)*/
            el.parentElement.parentElement.remove();
        }
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        // <div class="alert alert-danger"></div>
        div.className = `
            alert alert-${className}
        `;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form); //insert the div before the form

        //vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
}


//Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];    //if there are no books in te local storage
        }                   // initialize the empty array
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBooks(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBooks(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index,1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}


//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);


//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e)=>
{   //take form with id book-frorm and listen for submit, the function runs when submit is pressed

    //prevent actual submit
    e.preventDefault();

    //get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validate
    if(title === '' || author=== '' || isbn === '')
    {
        UI.showAlert('All fields are required.', 'danger');
    }
    else {
        //instantiate book
        const book = new Book(title, author, isbn);

        //ADD Book to UI
        UI.addBookToList(book);

        //ADD book to local storage
        Store.addBooks(book);

        UI.showAlert('Book added successfully.', 'success');

        //Clear fields
        UI.clearFields();
    }
});


//Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e) =>
{
    //console.log(e.target); //targets elements inside book-list. Now, pass this target into UI.deleteBook
    //wherever we will click, that will go inside e and will be sent to deleteBook
    //if on a row, we click on author one, e will get author one and send only author one to get deleted
    UI.deleteBook(e.target);

    //remove book from local storage
    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Book deleted.', 'success');
});