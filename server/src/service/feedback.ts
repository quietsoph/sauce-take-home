import feedbackStore from "../store/feedback";
import prompt from "../ai/prompt";
import { Feedback, FeedbackStatus } from "../store/model";

/**
 * Creates a feedback entry and runs analysis on it.
 * @param text The feedback to create
 */
const createFeedback = async (text: string) => {
  const feedback = await feedbackStore.createFeedback(text);
 
  createHighlightsForFeedback(feedback as Feedback).catch((error) => {
    console.error(error);
    feedbackStore.updateFeedbackStatus(Number(feedback.id), FeedbackStatus.ANALYSIS_FAILED);
  })

  return feedback;
}

/**
 * Creates highlights for a feedback entry
 * @param feedback The feedback to create highlights for
 */
const createHighlightsForFeedback = async (feedback: Feedback) => {
  try {
    const analysisResult = await prompt.runFeedbackAnalysis(feedback.text);

    const highlightPromises = analysisResult.highlights.map((highlight) => {
      feedbackStore.createHighlight({
        feedbackId: feedback.id,
        highlightSummary: highlight.summary,
        highlightQuote: highlight.quote
      })
  })

    await Promise.all(highlightPromises);
    await feedbackStore.updateFeedbackStatus(feedback.id, FeedbackStatus.ANALYSIS_COMPLETED);
  } catch (error) {
    await feedbackStore.updateFeedbackStatus(feedback.id, FeedbackStatus.ANALYSIS_FAILED);
    throw error;
  }
}

/**
 * Gets a page of feedback entries
 * @param page The page number
 * @param perPage The number of entries per page
 */
const getFeedbackPage = async (page: number, perPage: number) => {
  const values = await feedbackStore.getFeedbackPage(page, perPage);
  const count = values.length;
  return {values, count};
}

export default {
  createFeedback,
  getFeedbackPage,
}
