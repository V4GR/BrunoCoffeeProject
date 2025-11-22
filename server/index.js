const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, 'data.json');

// Загрузка данных из файла
const loadData = () => {
  try {
    if (fs.existsSync(dataFile)) {
      return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    }
    // Если файла нет, возвращаем пустые данные
    return { drinks: [] };
  } catch (error) {
    console.error('Error loading data:', error);
    return { drinks: [] };
  }
};

// Сохранение данных в файл
const saveData = (data) => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

// API Routes
app.get('/api/drinks', (req, res) => {
  const data = loadData();
  res.json(data.drinks);
});

app.get('/api/drinks/:id', (req, res) => {
  const data = loadData();
  const drink = data.drinks.find(d => d.id === req.params.id);
  if (!drink) {
    return res.status(404).json({ error: 'Drink not found' });
  }
  res.json(drink);
});

app.post('/api/drinks', (req, res) => {
  const data = loadData();
  const newDrink = {
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    created_by: 'admin',
    ...req.body
  };
  
  data.drinks.push(newDrink);
  const success = saveData(data);
  
  if (success) {
    res.status(201).json(newDrink);
  } else {
    res.status(500).json({ error: 'Failed to save drink' });
  }
});

app.put('/api/drinks/:id', (req, res) => {
  const data = loadData();
  const drinkIndex = data.drinks.findIndex(d => d.id === req.params.id);
  
  if (drinkIndex === -1) {
    return res.status(404).json({ error: 'Drink not found' });
  }
  
  data.drinks[drinkIndex] = {
    ...data.drinks[drinkIndex],
    ...req.body,
    updated_at: new Date().toISOString()
  };
  
  const success = saveData(data);
  
  if (success) {
    res.json(data.drinks[drinkIndex]);
  } else {
    res.status(500).json({ error: 'Failed to update drink' });
  }
});

app.delete('/api/drinks/:id', (req, res) => {
  const data = loadData();
  const drinkIndex = data.drinks.findIndex(d => d.id === req.params.id);
  
  if (drinkIndex === -1) {
    return res.status(404).json({ error: 'Drink not found' });
  }
  
  const deletedDrink = data.drinks.splice(drinkIndex, 1)[0];
  const success = saveData(data);
  
  if (success) {
    res.json(deletedDrink);
  } else {
    res.status(500).json({ error: 'Failed to delete drink' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});