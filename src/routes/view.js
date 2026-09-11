import { Router } from "express";
import { homeViewModel } from "../viewm/home.js";


const router = Router();

router.get("/", (req, res) => {
  res.render("index", homeViewModel);
});

export default router;