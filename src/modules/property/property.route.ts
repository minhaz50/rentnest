import { Router } from "express";
import * as propertyController from "./property.controller";
import { authenticate, authorize } from "../../middleware/auth";

export const publicPropertyRouter = Router();
publicPropertyRouter.get("/", propertyController.getAllProperties);
publicPropertyRouter.get("/:id", propertyController.getPropertyById);

export const landlordPropertyRouter = Router();
landlordPropertyRouter.use(authenticate, authorize("LANDLORD"));
landlordPropertyRouter.get("/", propertyController.getMyProperties);
landlordPropertyRouter.post("/", propertyController.createProperty);
landlordPropertyRouter.put("/:id", propertyController.updateProperty);
landlordPropertyRouter.delete("/:id", propertyController.deleteProperty);

export const adminPropertyRouter = Router();
adminPropertyRouter.use(authenticate, authorize("ADMIN"));
adminPropertyRouter.get("/", propertyController.getAllPropertiesForAdmin);
