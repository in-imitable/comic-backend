const db = require("../config/database");

// Get all comics
exports.getAllComics = async (req, res) => {
  try {
    const sql = "SELECT * FROM comics";
    const [rows] = await db.promise().query(sql);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a comic by ID
exports.getComicById = async (req, res) => {
  const comicId = req.params.id;
  try {
    const sql = "SELECT * FROM comics WHERE id = ?";
    const [rows] = await db.promise().query(sql, [comicId]);

    if (rows.length === 0) {
      res.status(404).json({ error: "Comic not found" });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new comic
exports.createComic = async (req, res) => {
  const { title, author, genre, release_date, description, cover_image_url } =
    req.body;
  try {
    const sql =
      "INSERT INTO comics (title, author, genre, release_date, description, cover_image_url) VALUES (?, ?, ?, ?, ?, ?)";
    await db
      .promise()
      .query(sql, [
        title,
        author,
        genre,
        release_date,
        description,
        cover_image_url,
      ]);
    res.status(201).json({ message: "Comic created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update an existing comic
exports.updateComic = async (req, res) => {
  const comicId = req.params.id;
  const { title, author, genre, release_date, description, cover_image_url } =
    req.body;
  try {
    const sql =
      "UPDATE comics SET title = ?, author = ?, genre = ?, release_date = ?, description = ?, cover_image_url = ? WHERE id = ?";
    await db
      .promise()
      .query(sql, [
        title,
        author,
        genre,
        release_date,
        description,
        cover_image_url,
        comicId,
      ]);
    res.status(200).json({ message: "Comic updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a comic
exports.deleteComic = async (req, res) => {
  const comicId = req.params.id;
  try {
    const sql = "DELETE FROM comics WHERE id = ?";
    await db.promise().query(sql, [comicId]);
    res.status(200).json({ message: "Comic deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
