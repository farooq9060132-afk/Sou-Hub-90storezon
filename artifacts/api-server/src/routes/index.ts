import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import blogRouter from "./blog";
import shopRouter from "./shop";
import analyticsRouter from "./analytics";
import adminRouter from "./admin";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(blogRouter);
router.use(shopRouter);
router.use(analyticsRouter);
router.use(adminRouter);
router.use(contactRouter);

export default router;
