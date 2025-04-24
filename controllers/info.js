const renderAboutPage = (req, res) => {
    res.render("info/about.ejs");
};

const renderPrivacyPage = (req, res) => {
    res.render("info/privacy.ejs");
};

const renderTermsPage = (req, res) => {
    res.render("info/terms.ejs");
};

const renderContactPage = (req, res) => {
    res.render("info/contact.ejs");
};

const renderHelpCenterPage = (req, res) => {
    res.render("info/help-center.ejs");
};

const renderFAQPage = (req, res) => {
    res.render("info/faq.ejs");
};

module.exports = {
    renderAboutPage,
    renderPrivacyPage,
    renderTermsPage,
    renderContactPage,
    renderHelpCenterPage,
    renderFAQPage
};