# Comment section - backend

This project is inspired by [Interactive comments section challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9).

This repo is backend part of the fullstack project.

Please check [comment-frontend](https://github.com/ehsansh/comment-frontend) to see frontend codes of this project

## Overview

Features of this app:

-   User can login and register
-   This app creates refresh and access token for user authentication
-   User can create, update and delete comments and replies
-   User can upvote and downvote the comments and replies.
-   User can vote to each comment only one time.
-   Some routes and features are protected and only logged in users can access.

## Built with

-   Express
-   Sequelize
-   mysql

### How to use

To use this project first run `npm install` and then `npm start` in the root of the app.

In config folder create a `.en` file and add these variables with the value that you want.

```
DB_NAME =
DB_USER =
DB_PASSWORD =
ACCESS_TOKEN_SECRET =
REFRESH_TOKEN_SECRET =
ACCESS_TOKEN_EXP =
```

In `config/allowedOrigins.js` add url that you receive the requests from.
