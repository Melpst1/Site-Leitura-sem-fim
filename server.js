const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('C:/Users/wande/Downloads/tdl3/database.db');

app.use(bodyParser.json());
app.use(express.static('public'));

// Criação da tabela
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY, title TEXT, author TEXT, desiredBooks TEXT, email TEXT, phone TEXT, city TEXT)");
});

app.post('/add-book', (req, res) => {
    const { title, author, desiredBooks, email, phone, city } = req.body;
    const stmt = db.prepare("INSERT INTO books (title, author, desiredBooks, email, phone, city) VALUES (?, ?, ?, ?, ?, ?)");
    stmt.run(title, author, desiredBooks, email, phone, city, function (err) {
        if (err) {
            res.json({ success: false });
        } else {
            res.json({ success: true });
        }
    });
    stmt.finalize();
});

app.get('/get-books', (req, res) => {
    db.all("SELECT * FROM books", (err, rows) => {
        if (err) {
            res.json([]);
        } else {
            res.json(rows);
        }
    });
});

// Rota para servir a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.get('/search', (req, res) => {
    const type = req.query.type;
    const term = req.query.term;
    let sql = "";
    let params = [];

    if (type === "title") {
        sql = "SELECT * FROM books WHERE title LIKE ?";
        params = [`%${term}%`];
    } else if (type === "author") {
        sql = "SELECT * FROM books WHERE author LIKE ?";
        params = [`%${term}%`];
    } else {
        res.json([]);
        return;
    }

    console.log("SQL Query:", sql, params); // Adicionando um console.log para verificar a consulta SQL

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error("Erro durante a busca no banco de dados:", err);
            res.json([]);
        } else {
            console.log("Resultados da busca:", rows); // Adicionando um console.log para verificar os resultados da busca
            res.json(rows);
        }
    });
});


