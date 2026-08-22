import express from "express";
import LottoTicket from "../models/lottoTicket.model.js";
import isAuth from "../middleware/isAuth.middleware.js";

const router = express.Router();

// GET /lotto-tickets — get the user’s tickets
router.get("/", isAuth, async (req, res, next) => {
  try {
    const lottoTickets = await LottoTicket.find({ owner: req.user._id });
    res.status(200).json(lottoTickets);
  } catch (error) {
    next(error);
  }
});

// POST /lotto-tickets — create
router.post("/", isAuth, async (req, res, next) => {
  try {
    const { name, selections, superNumber, drawsPerWeek, durationWeeks } =
      req.body;
    if (
      !selections ||
      superNumber === undefined ||
      superNumber === null ||
      !drawsPerWeek ||
      !durationWeeks
    ) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const createdLottoTicket = await LottoTicket.create({
      name,
      selections,
      superNumber,
      drawsPerWeek,
      durationWeeks,
      owner: req.user._id,
    });

    res.status(201).json({
      message: "Ticket created successfully",
      lottoTicket: createdLottoTicket,
    });
  } catch (error) {
    next(error);
  }
});

// GET /lotto-tickets/:ticketId — get one
router.get("/:ticketId", isAuth, async (req, res, next) => {
  try {
    const filter = {
      _id: req.params.ticketId,
      owner: req.user._id,
    };

    const ticketDetails = await LottoTicket.findOne(filter);
    if (!ticketDetails) {
      return res
        .status(404)
        .json({ message: "Ticket doesn't exist or you are not the owner." });
    }
    res.status(200).json({ ticketDetails });
  } catch (error) {
    next(error);
  }
});

// DELETE /lotto-tickets/:ticketId — delete one
router.delete("/:ticketId", isAuth, async (req, res, next) => {
  try {
    const filter = {
      _id: req.params.ticketId,
      owner: req.user._id,
    };

    const deletedTicket = await LottoTicket.findOneAndDelete(filter);
    if (!deletedTicket) {
      return res
        .status(404)
        .json({ message: "Ticket doesn't exist or you are not the owner." });
    }
    res.status(200).json({ message: "Ticket deleted." });
  } catch (error) {
    next(error);
    console.log(error);
  }
});

// PATCH /lotto-tickets/:ticketId — update one
router.patch("/:ticketId", isAuth, async (req, res, next) => {
  const allowedFields = [
    "name",
    "selections",
    "superNumber",
    "drawsPerWeek",
    "durationWeeks",
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });
  try {
    const filter = {
      _id: req.params.ticketId,
      owner: req.user._id,
    };
    const updatedTicket = await LottoTicket.findOneAndUpdate(
      filter,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({
      message: "Ticket updated",
      lottoTicket: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
