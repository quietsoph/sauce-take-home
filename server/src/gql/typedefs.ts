/**
 * GraphQL type definitions
 */
const typeDefs = /* GraphQL */ `
  type Query {
    feedback(id: Int!): Feedback
    feedbacks(page: Int!, per_page: Int!): FeedbackPage!
  }
  
  type Mutation {
    createFeedback(text: String!): Feedback!
  }

  type Feedback {
    id: Int!
    text: String!
    status: FeedbackStatus!
    highlights: [Highlight!]
  }
  
  enum FeedbackStatus {
    PENDING_ANALYSIS
    ANALYSIS_COMPLETED
    ANALYSIS_FAILED
  }

  type Highlight {
    id: Int!
    quote: String!
    summary: String!
  }

  type FeedbackPage {
    values: [Feedback!]!
    count: Int!
    numPages: Int!
  }
`;

export default typeDefs;
