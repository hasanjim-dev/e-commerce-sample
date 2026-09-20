const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.use(protect);
router.post("/", placeOrder);
router.get("/my", getMyOrders);
router.get("/", adminOnly, getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", adminOnly, updateOrderStatus);

module.exports = router;
