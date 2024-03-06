import { gql } from '@apollo/client'
import { TWEET_FRAGMENT } from './fragments'

export const ADD_TWEET = gql`
  mutation($payload: AddTweetPayload!) {
    addTweet(payload: $payload) {
      ...tweetFragment
      parent {
        ...tweetFragment
      }
    }
  }
  ${TWEET_FRAGMENT}
`

export const UPD_TWEET = gql`
  mutation($id: Float!, $body: String!) {
    updateTweet(id: $id, body: $body) {
      id
      body
      created_at
    }
  }
`

export const DELETE_TWEET = gql`
  mutation($id: Float!) {
    deleteTweet(id: $id)
  }
`

export const TOGGLE_LIKE = gql`
  mutation($tweet_id: Float!) {
    toggleLike(tweet_id: $tweet_id)
  }
`
export const TOGGLE_RETWEET = gql`
  mutation($tweet_id: Float!) {
    toggleRetweet(tweet_id: $tweet_id)
  }
`

export const TOGGLE_BOOKMARK = gql`
  mutation($tweet_id: Float!) {
    toggleBookmark(tweet_id: $tweet_id)
  }
`
