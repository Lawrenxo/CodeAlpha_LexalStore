import { Router } from "express";

const router = Router();

router.get("/products", (req, res) => {
  res.json({
    id: 0,
    name: "laptop"
  })
});

export default router;