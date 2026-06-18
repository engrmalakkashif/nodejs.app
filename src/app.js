const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Direct route - forces the file to load
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/health', (req, res) => res.json({
  status: 'OK',
  timestamp: new Date().toISOString(),
  version: '1.0.0'
}));

let users = [{ id: 1, name: 'Alice', email: 'alice@example.com' }];

app.get('/users', (req, res) => res.json({ users, total: users.length }));

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'name and email required' });
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json({ message: 'User created', user: newUser });
});

module.exports = app;