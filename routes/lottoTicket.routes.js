import express from "express";
import LottoTicket from "../models/lottoTicket.model.js";
import isAuth from "../middleware/isAuth.middleware.js";

const router = express.Router();

router.get("/", isAuth, async (req,res,next)=>{
  try {
    const lottoTickets = await LottoTicket.find({owner: req.user._id});
    res.status(200).json(lottoTickets);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuth, async (req, res, next) => {
  try {
    const { name, selections, supernumber, drawsPerWeek, durationWeeks } = req.body;
    if (!selections || supernumber === undefined || supernumber === null || !drawsPerWeek || !durationWeeks) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const createdLottoTicket = await LottoTicket.create({
      name,
      selections,
      supernumber,
      drawsPerWeek,
      durationWeeks,
      owner : req.user._id
    });

    res.status(201).json({
      message: "Ticket created successfully",
      lottoTicket: createdLottoTicket,
    });
  } catch (error) {
    next(error);
  }
});

export default router;


// GET /lotto-tickets — get the user’s tickets
// POST /lotto-tickets — create
// GET /lotto-tickets/:ticketId — get one
// DELETE /lotto-tickets/:ticketId — delete one