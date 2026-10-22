import { Router } from "express"
import usrController from "../controllers/usrController.ts";

const usrRouter = Router();

usrRouter.route('/activate/:id')
  .get(usrController.userActviateGet)
  .post(usrController.userActviatePost);

export default usrRouter