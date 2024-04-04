# Sauce Technical Task
This repository contains the code for the Sauce technical task. 
This project is only partially implemented.

The project consists of a GraphQL server that exposes some queries and mutations to create and fetch feedback records.
A feedback record is simply some text with some form of product feedback. \
e.g. "The UI is too cluttered, I can't find the settings page." would be a feedback record explaining an issue someone is facing with a product.

The UI is a simple React application that renders a list of feedback records.

It is worthwhile taking ~10-15 minutes to familiarize yourself with the codebase before the interview.

## What to do
To become familiar with the repository here's the general structure

#### Server
1. ai - This package contains the AI types, client and prompt functions.
2. gql - This package contains the GraphQL schema and resolvers.
3. service - This package contains the executed logic.
4. store - This package contains the data store (in-memory sqlite3).
5. main.ts - The entry point of the graphql server.

#### UI
1. feedback - This package contains the feedback list and the relevant graphql queries.
2. App.tsx - The entry point of the UI.

## Running the project

### Server

```bash
# 1. Creates the .env file with the OpenAI secret placeholder.
#    We will provide this value in the interview.
echo "OPENAI_SECRET=\"<replace-with-secret>\"" > server/.env
```

```bash
# 2. Install dotenv-cli so the secret can be resolved.
npm install -g dotenv-cli 
```

```bash
# 3. Run the server
cd server && npm install && npm run dev
```

### UI

```bash
# 1. Run the UI
cd ui && npm install && npm run dev
```



# Queries
These queries are helpful for populating and fetching data.

```graphql
# Create a feedback record
mutation ($text: String!) {
  createFeedback(text: $text) {
    id
    text
  }
}

# Variables
#  {
#  "text": "Would be cool to have a \"merge\" option potentially? This issue and request are sort of related, and actually sourced from the same Slack message. Would be cool to merge them back into one."
#  }
```

```graphql
# Get a feedback record
query ($id: ID!) {
  feedback(id: $id) {
    id
    text
  }
}

# Variables
#  {
#  "id": "1"
#  }
```

```graphql
# Get a page of feedback records
query ($page: Int!, $per_page: Int!) {
  feedbacks(page: $page, per_page: $per_page) {
    id
    text
  }
}

# Variables
#  {
#  "page": 1,
#  "per_page": 10
#  }
```
