import { Router, type IRouter } from "express";
import healthRouter from "./health";
import artisansRouter from "./artisans";
import servicesRouter from "./services";
import reviewsRouter from "./reviews";
import bookingsRouter from "./bookings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(artisansRouter);
router.use(servicesRouter);
router.use(reviewsRouter);
router.use(bookingsRouter);

export default router;
