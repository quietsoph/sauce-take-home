import {gql, request} from "graphql-request";

type Highlight = {
  id: number
  quote: string
  summary: string
}

export type Feedback = {
  id: number
  text: string
  highlights: Highlight[]
}

const feedbacksDocument = gql`
  query feedbacks($page: Int!, $per_page: Int!) {
    feedbacks(page: $page, per_page: $per_page) {
      values {
        id
        text
        status
        highlights {
          id
          quote
          summary
        }
      }
      count
      numPages
    }
  }
`

type FeedbacksData = { feedbacks: { values: Feedback[], count: number, numPages: number } }
export const feedbacksQuery = (page: number, per_page: number): Promise<FeedbacksData> =>
  request('http://localhost:4000/graphql', feedbacksDocument, {
    page,
    per_page
  })
