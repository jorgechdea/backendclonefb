const { Router } = require("express");
const axios = require("axios");
const { Post, Group } = require("..//db");
require("dotenv").config();

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/posts", async (req, res) => {
  const allPosts = await Post.findAll();
  try {
    return res.status(200).json(allPosts);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post("/newpost", async (req, res) => {
  const { author, content, group } = req.body;
  try {
    const [createPost, boolean] = await Post.findOrCreate({
      where: {
        author,
        content,
      },
    });
    const [findGroup, bool] = await Group.findOrCreate({
      where: {
        name: group,
      },
    });
    await createPost.setGroups(findGroup);
    return res.status(200).json(createPost);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Post.destroy({
      where: { id: id },
    });
    return res.status(200).json("Post deleted");
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { content, fixed } = req.body;
  try {
    const postUpdate = await Post.findByPk(id);
    postUpdate.content = content;
    postUpdate.fixed = fixed;
    await postUpdate.save();
    res.status(200).json(postUpdate);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});

router.get("/groups", async (req, res) => {
  try {
    const allGroups = await Group.findAll();
    return res.status(200).json(allGroups);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});

router.post("/groups", async (req, res) => {
  const { name } = req.body;
  try {
    const [createGroup, booleano] = await Group.findOrCreate({
      where: { name },
    });
    return res.status(200).json(createGroup);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});

router.delete("/groups/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Group.destroy({
      where: { id: id },
    });
    return res.status(200).json("Group deleted");
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
