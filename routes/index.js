const express = require("express");
const router = express.Router();

// Import route modules
const societyRoutes = require("./societyRoutes");
const wingRoutes = require("./wingRoutes")
const flatRoutes = require("./flatRoutes");
const tenantRoutes = require("./tenantRoutes");
const paymentRoutes = require("./paymentRoutes");


// Define routes
router.use("/societies", societyRoutes);
router.use("/wings", wingRoutes);
router.use("/flats", flatRoutes);
router.use("/tenants", tenantRoutes);
router.use("/payments", paymentRoutes);


module.exports = router;
