import db from "./db";
import { FeedbackStatus } from "./model";
type CreateHighlightArgs = {
  feedbackId: number | bigint;
  highlightSummary: string;
  highlightQuote: string;
}

/**
 * Gets a feedback entry by its id
 * @param id The id of the feedback
 */
const getFeedback = async (id: number) => {
  return db.prepare(`SELECT *
                     FROM Feedback
                     WHERE id = ?`).get(id)
}

/**
 * Gets a page of feedback entries
 * @param page The page number
 * @param perPage The number of entries per page
 */
const getFeedbackPage = async (page: number, perPage: number) => {
  return db.prepare(`SELECT *
                     FROM Feedback
                     ORDER BY id DESC
                     LIMIT ? OFFSET ?`).all(perPage, (page - 1) * perPage)
}

/**
 * Gets the highlights of a feedback entry
 * @param feedbackId The id of the feedback
 */
const getFeedbackHighlights = async (feedbackId: number) => {
  return db.prepare(`SELECT *
                     FROM Highlight
                     WHERE feedbackId = ?`).all(feedbackId)
}

/**
 * Counts the number of feedback entries
 * @returns The number of feedback entries
 */

const countFeedback = (): number => {
  const stmt = db.prepare(`SELECT COUNT(*) as count
                          FROM Feedback`);
  
  const result = stmt.get() as { count: number };
  return result.count;
}

/**
 * Creates a new feedback entry
 * @param text The text of the feedback
 */
const createFeedback = async (text: string) => {
  const result = db.prepare(`INSERT INTO Feedback (text, status)
                             VALUES (?, ?)`).run(text, FeedbackStatus.PENDING_ANALYSIS);
  return {id: result.lastInsertRowid, text, status: FeedbackStatus.PENDING_ANALYSIS}
}

/**
 * Updates the status of a feedback entry
 * @param id The id of the feedback
 * @param status The status to update the feedback to
 */
const updateFeedbackStatus = async (id: number, status: FeedbackStatus) => {
  db.prepare(`UPDATE Feedback SET status = ? WHERE id = ?`).run(status, id);
}
/**
 * Creates a new highlight entry
 * @param args The arguments to create a highlight
 */
const createHighlight = async (args: CreateHighlightArgs) => {
  const result = db.prepare(`INSERT INTO Highlight (quote, summary, feedbackId)
                             VALUES (?, ?, ?)`).run(args.highlightQuote, args.highlightSummary, args.feedbackId);
  return {id: result.lastInsertRowid, ...result}
}

export default {
  getFeedback,
  getFeedbackPage,
  createFeedback,
  updateFeedbackStatus,
  createHighlight,
  getFeedbackHighlights,
  countFeedback,
};
