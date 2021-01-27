import { gql } from '@apollo/client'

export const TWEET_FRAGMENT = gql`
  fragment tweetFragment on Tweet {
    id
    body
    visibility
    likesCount
    retweetsCount
    commentsCount
    parent {
      id
      body
      user {
        id
        username
        display_name
        avatar
      }
    }
    preview {
      id
      title
      description
      url
      image
    }
    isLiked
    isRetweeted
    type
    visibility
    user {
      id
      username
      display_name
      avatar
    }
    created_at
  }
`
