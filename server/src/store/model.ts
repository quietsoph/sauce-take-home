
export enum FeedbackStatus {
  PENDING_ANALYSIS = 'PENDING_ANALYSIS',
  ANALYSIS_COMPLETED = 'ANALYSIS_COMPLETED',
  ANALYSIS_FAILED = 'ANALYSIS_FAILED'
}

export type Feedback = {
  id: number;
  text: string;
  status: FeedbackStatus;
}

export type Highlight = {
  id: number;
  feedbackId: number;
  summary: string;
  quote: string;
}
