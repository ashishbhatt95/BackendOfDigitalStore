const express = require("express");
const {
  createOrderFromCart,
  updateOrderStatusByAdmin,
  updateItemStatusBySeller,
  trackCustomerOrder,
  getCustomerOrderList,
  getSellerOrderList,
  getAllOrdersForAdmin,
  getOrderDetailsById,
} = require("../controllers/orderController");
const { roleAuthorization } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/customer/create", roleAuthorization(["customer"]), createOrderFromCart);

router.get("/customer/track", roleAuthorization(["customer"]), trackCustomerOrder);

router.get("/customer/list", roleAuthorization(["customer"]), getCustomerOrderList);

router.put("/seller/item-status", roleAuthorization(["seller"]), updateItemStatusBySeller);

router.get("/seller/list", roleAuthorization(["seller"]), getSellerOrderList);

router.put("/admin/update-status", roleAuthorization(["admin"]), updateOrderStatusByAdmin);

router.get("/admin/list", roleAuthorization(["admin"]), getAllOrdersForAdmin);

router.get("/details", roleAuthorization(["customer", "admin", "seller"]), getOrderDetailsById);

module.exports = router;