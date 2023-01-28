const express = require("express");
const router = express.Router();
const middlewares = require("../middlewares")
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const brandController = require("../controllers/brand.controller");
const currencyController = require("../controllers/currency.controller");
const taxController = require("../controllers/tax.controller");
const categoryController = require("../controllers/category.controller");
const measureController = require("../controllers/measure.controller");
const membershipController = require("../controllers/membership.controller");
const productController = require("../controllers/product.controller");
const serviceController = require("../controllers/service.controller");
const treatmentController = require("../controllers/treatment.controller");
const voucherController = require("../controllers/voucher.controller");
const appointmentController = require("../controllers/appointment.controller");
const service = require("../service");

router.post("/auth/signup", [middlewares.verifySignUp.checkRolesExisted], authController.signup)
router.post("/auth/signin", authController.signin)
router.post("/auth/signout", authController.signout)
router.get("/auth/verifyEmail/:id/:token", authController.verifyEmail)
router.get("/auth/verifyPhoneNumber/:id/:token", authController.verifyPhoneNumber)
router.post("/auth/forgot", authController.forgot)
router.get("/auth/requestEmailVerify", middlewares.authJwt.verifyToken, authController.requestEmailVerify)
router.get("/auth/requestPhoneVerify", middlewares.authJwt.verifyToken, authController.requestPhoneVerify)
router.get("/auth/rest/:token", authController.reset)
router.put("/auth/rest", authController.changePassword)

router.post("/user/full-name", middlewares.authJwt.verifyToken, userController.setupFullName);
router.post("/user/business", middlewares.authJwt.verifyToken, userController.setupBusiness);
router.post("/user/client", middlewares.authJwt.verifyToken, userController.addClient);
router.post("/user/supplier", middlewares.authJwt.verifyToken, userController.addSupplier);
router.post("/user/member", middlewares.authJwt.verifyToken, userController.addMember);
router.get("/user", middlewares.authJwt.verifyToken, userController.allUsers);
router.get("/user/check-verification", middlewares.authJwt.verifyToken, userController.checkVerification);
router.get("/user/:id([0-9]+)", [middlewares.authJwt.verifyToken], userController.getUser);
router.put("/user", middlewares.authJwt.verifyToken, userController.update);
router.delete("/user/:id([0-9]+)", [middlewares.authJwt.verifyToken, middlewares.authJwt.isAdmin], userController.delete);

router.post("/brand", middlewares.authJwt.verifyToken, brandController.create);
router.get("/brand", middlewares.authJwt.verifyToken, brandController.getAll);
router.put("/brand/:id([0-9]+)", middlewares.authJwt.verifyToken, brandController.update);
router.delete("/brand/:id([0-9]+)", [middlewares.authJwt.verifyToken], brandController.delete);

router.post("/category", middlewares.authJwt.verifyToken, categoryController.create);
router.get("/category", middlewares.authJwt.verifyToken, categoryController.getAll);
router.put("/category/:id([0-9]+)", middlewares.authJwt.verifyToken, categoryController.update);
router.delete("/category/:id([0-9]+)", [middlewares.authJwt.verifyToken], categoryController.delete);

router.post("/currency", middlewares.authJwt.verifyToken, currencyController.create);
router.get("/currency", middlewares.authJwt.verifyToken, currencyController.getAll);
router.put("/currency/:id([0-9]+)", middlewares.authJwt.verifyToken, currencyController.update);
router.delete("/currency/:id([0-9]+)", [middlewares.authJwt.verifyToken], currencyController.delete);

router.post("/tax", middlewares.authJwt.verifyToken, taxController.create);
router.get("/tax", middlewares.authJwt.verifyToken, taxController.getAll);
router.put("/tax/:id([0-9]+)", middlewares.authJwt.verifyToken, taxController.update);
router.delete("/tax/:id([0-9]+)", [middlewares.authJwt.verifyToken], taxController.delete);

router.post("/measure", [middlewares.authJwt.verifyToken, middlewares.authJwt.isAdmin], measureController.create);
router.get("/measure", middlewares.authJwt.verifyToken, measureController.getAll);
router.put("/measure/:id([0-9]+)", [middlewares.authJwt.verifyToken, middlewares.authJwt.isAdmin], measureController.update);
router.delete("/measure/:id([0-9]+)", [middlewares.authJwt.verifyToken, middlewares.authJwt.isAdmin], measureController.delete);

router.post("/membership", middlewares.authJwt.verifyToken, membershipController.create);
router.get("/membership", middlewares.authJwt.verifyToken, membershipController.getAll);
router.put("/membership/:id([0-9]+)", middlewares.authJwt.verifyToken, membershipController.update);
router.delete("/membership/:id([0-9]+)", [middlewares.authJwt.verifyToken], membershipController.delete);

router.post("/product", middlewares.authJwt.verifyToken, productController.create);
router.get("/product", middlewares.authJwt.verifyToken, productController.getAll);
router.put("/product/:id([0-9]+)", middlewares.authJwt.verifyToken, productController.update);
router.delete("/product/:id([0-9]+)", [middlewares.authJwt.verifyToken], productController.delete);

router.post("/service", middlewares.authJwt.verifyToken, serviceController.create);
router.get("/service", middlewares.authJwt.verifyToken, serviceController.getAll);
router.put("/service/:id([0-9]+)", middlewares.authJwt.verifyToken, serviceController.update);
router.delete("/service/:id([0-9]+)", [middlewares.authJwt.verifyToken], serviceController.delete);


router.post("/treatment", middlewares.authJwt.verifyToken, treatmentController.create);
router.get("/treatment", middlewares.authJwt.verifyToken, treatmentController.getAll);
router.put("/treatment/:id([0-9]+)", middlewares.authJwt.verifyToken, treatmentController.update);
router.delete("/treatment/:id([0-9]+)", [middlewares.authJwt.verifyToken], treatmentController.delete);

router.post("/voucher", middlewares.authJwt.verifyToken, voucherController.create);
router.get("/voucher", middlewares.authJwt.verifyToken, voucherController.getAll);
router.put("/voucher/:id([0-9]+)", middlewares.authJwt.verifyToken, voucherController.update);
router.delete("/voucher/:id([0-9]+)", [middlewares.authJwt.verifyToken], voucherController.delete);

router.post("/appointment", middlewares.authJwt.verifyToken, appointmentController.create);
router.get("/appointment", middlewares.authJwt.verifyToken, appointmentController.getAll);
router.put("/appointment/:id([0-9]+)", middlewares.authJwt.verifyToken, appointmentController.update);
router.delete("/appointment/:id([0-9]+)", [middlewares.authJwt.verifyToken], appointmentController.delete);

module.exports = router;
