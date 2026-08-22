const PAYOUTS_BY_CLASS_CENTS = {
  1: 1_250_000_000,
  2: 100_000_000,
  3: 1_200_000,
  4: 400_000,
  5: 19_000,
  6: 5_000,
  7: 2_000,
  8: 1_100,
  9: 600,
};

const SINGLE_SELECTION_COST_CENTS = 120;

export function calcTicketCost(ticket) {
  const numberOfDraws = ticket.drawsPerWeek * ticket.durationWeeks;
  const totalCostTicket =
    ticket.selections.length * numberOfDraws * SINGLE_SELECTION_COST_CENTS;
  return totalCostTicket;
}

export function calcSelectionWin(selectionResult) {
  if (!selectionResult.superNumberMatch) {
    if (selectionResult.matches === 3) {
      return PAYOUTS_BY_CLASS_CENTS[8];
    }
    if (selectionResult.matches === 4) {
      return PAYOUTS_BY_CLASS_CENTS[6];
    }
    if (selectionResult.matches === 5) {
      return PAYOUTS_BY_CLASS_CENTS[4];
    }
    if (selectionResult.matches === 6) {
      return PAYOUTS_BY_CLASS_CENTS[2];
    }
  } else {
    if (selectionResult.matches === 2) {
      return PAYOUTS_BY_CLASS_CENTS[9];
    }
    if (selectionResult.matches === 3) {
      return PAYOUTS_BY_CLASS_CENTS[7];
    }
    if (selectionResult.matches === 4) {
      return PAYOUTS_BY_CLASS_CENTS[5];
    }
    if (selectionResult.matches === 5) {
      return PAYOUTS_BY_CLASS_CENTS[3];
    }
    if (selectionResult.matches === 6) {
      return PAYOUTS_BY_CLASS_CENTS[1];
    }
  }
  return 0;
}

export function generateDraw() {
  const allNumbers = [...Array(49).keys()].map((number) => number + 1);
  const drawnNumbers = [];

  for (let i = 1; i <= 6; i++) {
    const numDrawn = Math.floor(Math.random() * allNumbers.length);
    drawnNumbers.push(allNumbers[numDrawn]);
    allNumbers.splice(numDrawn, 1);
  }

  function compareNumbers(a, b) {
    return a - b;
  }

  const drawnSuperNumber = Math.floor(Math.random() * 10);
  drawnNumbers.sort(compareNumbers);

  return {
    drawnNumbers,
    drawnSuperNumber,
  };
}

export function evaluateSelection(selection, ticketSuperNumber, draw) {
  let matches = 0;
  const matchedNumbers = [];
  let superNumberMatch = false;

  selection.numbers.forEach((num) => {
    if (draw.drawnNumbers.includes(num)) {
      matches++;
      matchedNumbers.push(num);
    }
  });

  if (draw.drawnSuperNumber === ticketSuperNumber) {
    superNumberMatch = true;
  }

  return {
    matches,
    matchedNumbers,
    superNumberMatch,
  };
}

export function evaluateTicket(ticket, draw) {
  const ticketId = ticket._id;
  const selectionResults = ticket.selections.map((selection) => {
    const evaluation = evaluateSelection(selection, ticket.superNumber, draw);
    const selectionWin = calcSelectionWin(evaluation);
    return {
      selectionId: selection._id,
      ...evaluation,
      selectionWin,
    };
  });

  return { ticketId, selectionResults };
}

export function simulateTicket(ticket) {
  const numDraws = ticket.drawsPerWeek * ticket.durationWeeks;
  let ticketWin = 0;
  let winningDraws = [];
  for (let i = 0; i < numDraws; i++) {
    const draw = generateDraw();
    const drawResult = evaluateTicket(ticket, draw);
    const drawWin = drawResult.selectionResults.reduce(
      (sumWins, win) => sumWins + win.selectionWin,
      0,
    );
    ticketWin += drawWin;
    if (drawWin) {
      winningDraws.push({
        drawNumber: i + 1,
        draw,
        selectionResults: drawResult.selectionResults,
        drawWin,
      });
    }
  }
  const ticketCost = calcTicketCost(ticket);
  const ticketProfit = ticketWin - ticketCost;
  return {
    numberOfDraws: numDraws,
    ticketWin,
    ticketCost,
    ticketProfit,
    winningDraws,
  };
}
