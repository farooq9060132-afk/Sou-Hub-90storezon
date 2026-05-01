import { Router } from "express";
import { SubmitContactBody } from "@workspace/api-zod";

const router = Router();

router.post("/contact", async (req, res) => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  req.log.info({ contact: parsed.data }, "Contact form submitted");
  res.json({ message: "Thank you for your message! We will get back to you soon." });
});

export default router;
