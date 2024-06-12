document.addEventListener('DOMContentLoaded', () => {
    addStyles();
    document.getElementById('show-home').addEventListener('click', loadWelcomeTemplate);
    document.getElementById('show-add-book').addEventListener('click', showAddBookForm);
    document.getElementById('show-book-list').addEventListener('click', showBookList);
    loadWelcomeTemplate();
});

const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        body {
            font-family: 'Arial', sans-serif;
            background-color: #2c3e50;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #ecf0f1;
        }
        nav {
            margin: 20px 0;
        }
        button {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            background-color: #3498db;
            color: #fff;
            cursor: pointer;
            font-size: 16px;
            margin-right: 10px;
        }
        button:hover {
            background-color: #2980b9;
        }
        h1 {
            font-family: 'Arial', sans-serif;
            color: #ecf0f1;
            margin-bottom: 20px;
            text-align: center;
            width: 100%;
            font-size: 24px;
        }
        .container {
            display: flex;
            justify-content: space-between;
            width: 100%;
            max-width: 1200px;
            margin-bottom: 20px;
        }
        form {
            width: 45%;
            background: #34495e;
            padding: 20px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            color: #ecf0f1;
        }
        form div {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            color: #ecf0f1;
        }
        input, textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #bdc3c7;
            box-sizing: border-box;
            background-color: #2c3e50;
            color: #ecf0f1;
        }
        .table-container {
            width: 100%;
            max-width: 1200px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            background-color: #34495e;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            color: #ecf0f1;
        }
        table, th, td {
            border: none;
        }
        th, td {
            padding: 15px;
            text-align: left;
        }
        th {
            background-color: #e74c3c;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #2c3e50;
        }
        .action-buttons button {
            margin-right: 5px;
        }
        .action-buttons button.update {
            background-color: #3498db;
        }
        .action-buttons button.update:hover {
            background-color: #2980b9;
        }
        #content {
            width: 100%;
            display: flex;
            justify-content: center;
        }
        .description {
            margin-bottom: 20px;
            text-align: center;
            max-width: 800px;
        }
    `;
    document.head.appendChild(style);
};

const loadWelcomeTemplate = () => {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="description">
            <h1>Bienvenido a la Biblioteca</h1>
            <p>Esta es la página principal de la biblioteca. Desde aquí puedes navegar a las diferentes secciones de la aplicación usando los botones de navegación. Puedes agregar nuevos libros a la biblioteca, ver la lista de libros existentes, y exportar la lista de libros a un archivo de texto.</p>
        </div>
    `;
};

const showAddBookForm = () => {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="description">
            <h1>Agregar un Nuevo Libro</h1>
            <p>En esta página puedes agregar un nuevo libro a la biblioteca. Por favor, completa todos los campos del formulario y haz clic en "Crear" para agregar el libro.</p>
        </div>
        <form id="create-book-form">
            <div>
                <label for="title">Título:</label>
                <input type="text" id="title" required>
            </div>
            <div>
                <label for="author">Autor:</label>
                <input type="text" id="author" required>
            </div>
            <div>
                <label for="genre">Género:</label>
                <input type="text" id="genre" required>
            </div>
            <div>
                <label for="publicationDate">Fecha de Publicación:</label>
                <input type="date" id="publicationDate" required>
            </div>
            <button type="submit">Crear</button>
        </form>
    `;

    document.getElementById('create-book-form').onsubmit = async (event) => {
        event.preventDefault();
        await createBook();
    };
};

const createBook = async () => {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const publicationDate = document.getElementById('publicationDate').value;

    try {
        const response = await fetch('/books', {
            method: 'POST',
            body: JSON.stringify({ title, author, genre, publicationDate }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            alert('Libro creado con éxito');
            document.getElementById('create-book-form').reset();
        } else {
            console.error('Error creating book:', response.statusText);
        }
    } catch (error) {
        console.error('Error creating book:', error);
    }
};

const showBookList = async () => {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="description">
            <h1>Lista de Libros</h1>
            <p>Esta es la lista de todos los libros en la biblioteca. Puedes ver los detalles de cada libro, actualizar su información o eliminarlo. También puedes exportar la lista completa a un archivo de texto.</p>
        </div>
        <div class="table-container" id="table-container">
            <button id="export-txt">Exportar a TXT</button>
            <table id="books-table">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Género</th>
                        <th>Fecha de Publicación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    `;

    document.getElementById('export-txt').addEventListener('click', exportToTxt);

    await loadBooks();
};

const loadBooks = async () => {
    try {
        const response = await fetch('/books');
        const books = await response.json();

        const tableBody = document.getElementById('books-table').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear existing rows
        books.forEach(book => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = book.title;
            row.insertCell(1).textContent = book.author;
            row.insertCell(2).textContent = book.genre;
            row.insertCell(3).textContent = book.publicationDate;

            const actionsCell = row.insertCell(4);
            actionsCell.classList.add('action-buttons');
            actionsCell.appendChild(createActionButton('Eliminar', () => deleteBook(book._id)));
            actionsCell.appendChild(createActionButton('Actualizar', () => updateBook(book._id, book.title, book.author, book.genre, book.publicationDate), 'update'));
        });
    } catch (error) {
        console.error('Error fetching books:', error);
    }
};

const createActionButton = (label, onClick, className) => {
    const button = document.createElement('button');
    button.textContent = label;
    button.onclick = onClick;
    if (className) {
        button.classList.add(className);
    }
    return button;
};

const deleteBook = async (id) => {
    try {
        await fetch(`/books/${id}`, { method: 'DELETE' });
        await loadBooks();
    } catch (error) {
        console.error('Error deleting book:', error);
    }
};

const updateBook = async (id, title, author, genre, publicationDate) => {
    const updateForm = document.createElement('form');
    updateForm.innerHTML = `
        <div>
            <label for="newTitle">Nuevo título:</label>
            <input type="text" id="newTitle" value="${title}" required>
        </div>
        <div>
            <label for="newAuthor">Nuevo autor:</label>
            <input type="text" id="newAuthor" value="${author}" required>
        </div>
        <div>
            <label for="newGenre">Nuevo género:</label>
            <input type="text" id="newGenre" value="${genre}" required>
        </div>
        <div>
            <label for="newPublicationDate">Nueva fecha de publicación:</label>
            <input type="date" id="newPublicationDate" value="${publicationDate}" required>
        </div>
        <button type="submit">Actualizar</button>
    `;

    document.body.appendChild(updateForm);

    updateForm.onsubmit = async (event) => {
        event.preventDefault();
        const updatedTitle = document.getElementById('newTitle').value;
        const updatedAuthor = document.getElementById('newAuthor').value;
        const updatedGenre = document.getElementById('newGenre').value;
        const updatedPublicationDate = document.getElementById('newPublicationDate').value;

        try {
            await fetch(`/books/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: updatedTitle,
                    author: updatedAuthor,
                    genre: updatedGenre,
                    publicationDate: updatedPublicationDate,
                }),
                headers: { 'Content-Type': 'application/json' }
            });
            await loadBooks();
        } catch (error) {
            console.error('Error updating book:', error);
        }

        document.body.removeChild(updateForm);
    };
};

const exportToTxt = async () => {
    try {
        const response = await fetch('/books');
        const books = await response.json();
        let txtContent = 'Título\tAutor\tGénero\tFecha de Publicación\n';
        books.forEach(book => {
            txtContent += `${book.title}\t${book.author}\t${book.genre}\t${book.publicationDate}\n`;
        });

        const blob = new Blob([txtContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lista_de_libros.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting to TXT:', error);
    }
};
