const router = require("express").Router();

const { getErrorMessage } = require("../utils/errorHelpers");
const photoManager = require("../managers/photoManager");
const { isAuth } = require("../middlewares/authMiddleware");

router.get("/catalog", async (req, res) => {
  const photos = await photoManager.getAll().lean().populate("owner");

  res.render("photos/catalog", { photos });
});

router.get("/add-photo", isAuth, (req, res) => {
  res.render("photos/create");
});

router.post("/add-photo", isAuth, async (req, res) => {
  const { name, age, description, location, image } = req.body;

  try {
    await photoManager.create({
      name,
      age: +age,
      description,
      location,
      image,
      owner: req.user._id,
    });
    res.redirect("/catalog");
  } catch (error) {
    res.render("create", { error: getErrorMessage(error) });
  }
});

router.get("/photos/:photoId", async (req, res) => {
  try {
    const photoId = req.params.photoId;
    const photo = await photoManager
      .getOne(photoId)
      .populate("comments.user")
      .lean();
    const isOwner = req.user?._id == photo.owner._id;

    res.render("photos/details", { photo, isOwner });
  } catch (error) {
    res.render(`photos/catalog`, { error: "Couldn't get details!" });
  }
});

router.get("/photos/:photoId/delete", isAuth, async (req, res) => {
  const photoId = req.params.photoId;
  try {
    await photoManager.delete(photoId);

    res.redirect("/catalog");
  } catch (error) {
    res.render(`photos/details`, { error: "Unsuccessfull photo deletion" });
  }
});

router.get("/photos/:photoId/edit", isAuth, async (req, res) => {
  const photo = await photoManager.getOne(req.params.photoId).lean();

  res.render("photos/edit", { photo });
});

router.post("/photos/:photoId/edit", isAuth, async (req, res) => {
  const photoId = req.params.photoId;
  try {
    const photoData = req.body;
    await photoManager.edit(photoId, photoData);

    res.redirect(`/photos/${photoId}`);
  } catch (error) {
    res.render("photos/edit", {
      error: "Unable to update photo",
      ...photoData,
    });
  }
});

router.post("/photos/:photoId/comments", isAuth, async (req, res) => {
  const photoId = req.params.photoId;
  const { message } = req.body;
  const user = req.user._id;

  try {
    await photoManager.addComment(photoId, { user, message });

    res.redirect(`/photos/${photoId}`);
  } catch (error) {
    res.redirect(`/photos/${photoId}`, { error: "Couldn' add comment!" });
  }
});

module.exports = router;
