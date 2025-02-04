const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");
const OpenAI = require("openai");
const bcrypt = require('bcrypt');
const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas Connection
const MONGO_URI =
  "mongodb+srv://patelparth1631:parth123@cluster0.irt6u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Sign-Up Route
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to the database
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Studentname not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Login successful
    res.status(200).json({ message: "Login successful" });
    
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});


// Initialize OpenAI
const openai = new OpenAI({
  apiKey:
    "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", // Replace with your OpenAI API key
});

// API endpoint for chatbot
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use your preferred model
      messages: [{ role: "user", content: message }],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Error communicating with OpenAI:", error.message);
    res.status(500).json({ error: "Something went wrong with OpenAI." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
