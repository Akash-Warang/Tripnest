const express = require("express");
const router = express.Router();
const infoController = require("../controllers/info.js");

router.get("/about", infoController.renderAboutPage);
router.get("/privacy", infoController.renderPrivacyPage);
router.get("/terms", infoController.renderTermsPage);
router.get("/contact", infoController.renderContactPage);
router.get("/help-center", infoController.renderHelpCenterPage);
router.get("/faq", infoController.renderFAQPage);

module.exports = router;