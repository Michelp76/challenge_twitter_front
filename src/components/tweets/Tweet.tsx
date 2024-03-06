import React, { SyntheticEvent, useEffect, useState } from "react";
import { ApolloError, useMutation } from "@apollo/client";
import {
  MdBookmarkBorder,
  MdComment,
  MdFavorite,
  MdLoop,
  MdModeComment,
  MdEditNote,
  MdDelete,
} from "react-icons/md";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import { handleErrors } from "../../utils/utils";
import { ValidationError } from "yup";
import { TweetType } from "../../types/types";
import { formattedDate, pluralize, stopPropagation } from "../../utils/utils";
import Avatar from "../Avatar";
import Button from "../Button";
import LikeButton from "./actions/LikeButton";
import nl2br from "react-nl2br";
import reactStringReplace from "react-string-replace";
import Preview from "./Preview";
import RetweetButton from "./actions/RetweetButton";
import TweetStats from "./TweetStats";
import BookmarkButton from "./actions/BookmarkButton";
import TweetForm, { TweetTypeEnum } from "./TweetForm";
import { Link, useHistory } from "react-router-dom";
import MyImage from "../MyImage";
import LikeOrRetweet from "./LikeOrRetweet";
import { DELETE_TWEET } from "../../graphql/tweets/mutations";

type TweetProps = {
  tweet: TweetType;
  showStats?: boolean;
  showCommentMeta?: boolean;
  userId: number | undefined;
};

const Tweet = ({
  tweet,
  userId,
  showStats = true,
  showCommentMeta = true,
}: TweetProps) => {
  const history = useHistory();

  const [delTweetMutation] = useMutation(DELETE_TWEET);
  const [showTweet, setShowTweet] = useState(true);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [editTweetForm, setEditTweetForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError | null>(null);
  const [serverErrors, setServerErrors] = useState<any[]>([]);

  // console.log('tweet', tweet)

  const renderParsedTweet = () => {
    let replacedText;

    // Match URLs
    replacedText = reactStringReplace(
      nl2br(tweet.body),
      /(https?:\/\/\S+)/g,
      (match, i) => {
        if (
          tweet.preview &&
          match === tweet.preview.url &&
          tweet.media === null
        ) {
          return (
            <Preview key={`${tweet.preview.id}_${i}`} preview={tweet.preview} />
          );
        } else {
          return (
            <a
              className="text-primary hover:text-primary_hover"
              key={match + i}
              href={match}
              onClick={stopPropagation}
              target="_blank"
              rel="noopener, noreferrer"
            >
              {match}
            </a>
          );
        }
      }
    );
    // Match hashtags
    replacedText = reactStringReplace(replacedText, /#(\w+)/g, (match, i) => (
      <a
        className="font-bold hover:text-gray-500 transition-colors duration-300"
        key={match + i}
        href={`/hashtag/${match}`}
        onClick={stopPropagation}
      >
        #{match}
      </a>
    ));
    return replacedText;
  };

  const toggleCommentForm = (e: any) => {
    e.stopPropagation();
    setShowCommentForm((old) => (old = !old));
  };

  const toggleEditTweetForm = (e: any) => {
    e.stopPropagation();
    setEditTweetForm((old) => (old = !old));
  };

  const renderLikeOrRetweet = () => {
    if (!tweet) return null;

    if (tweet.type === "comment" && showCommentMeta) {
      return (
        <div className="flex text-sm text-gray7 items-center hover:text-blue2">
          <MdComment className="mr-2" />
          <Link to={`/status/${tweet.parent?.id}`}>See the original tweet</Link>
        </div>
      );
    }
    if (tweet.type === "retweet" && tweet.retweetAuthor !== null) {
      return (
        <div className="flex text-sm text-gray7 items-center">
          <MdLoop className="mr-2" />
          <span>You retweeted</span>
        </div>
      );
    }

    if (tweet.likeAuthor || tweet.retweetAuthor) {
      return (
        <LikeOrRetweet
          icon={tweet.retweetAuthor ? <MdLoop /> : <MdFavorite />}
          username={
            tweet.retweetAuthor
              ? tweet.retweetAuthor.username
              : tweet.likeAuthor!.username
          }
          display_name={
            tweet.retweetAuthor
              ? tweet.retweetAuthor.display_name
              : tweet.likeAuthor!.display_name
          }
          text={tweet.retweetAuthor ? " has retweeted" : " has liked"}
        />
      );
    } else {
      return null;
    }
  };

  const goToPage = (page: string) => {
    history.replace(page);
  };

  const deleteTweet = async (tweetId: number) => {
    setErrors(null);
    setServerErrors([]);
    setLoading(true);

    try {
      // --Update ----------------------------------------------------------------
      console.log("Suppression Tweet id: " + tweetId);

      await delTweetMutation({
        variables: {
          id: tweetId,
        },
      });
    } catch (e) {
      if (e instanceof ValidationError) {
        setErrors(e);
      } else if (e instanceof ApolloError) {
        setServerErrors(handleErrors(e));
      }

      console.log("e", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Retweet */}
      {renderLikeOrRetweet()}
      {showTweet && (
        <div
          className="p-6 shadow-lg bg-white mb-3 block border hover:border-blue2 transition-colors duration-200 cursor-pointer"
          onClick={(e) => {
            goToPage(`/status/${tweet.id}`);
          }}
        >
          <div>
            {/* Header */}
            <div className="flex items-center">
              {/* <Avatar className="mr-4" user={tweet.user} /> */}

              <div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPage(`/users/${tweet.user.username}`);
                  }}
                  className="hover:text-primary cursor-pointer"
                >
                  <h4 className="font-bold">{tweet.user.display_name}</h4>
                </div>
                <p className="text-gray4 text-xs mt-1">
                  {formattedDate(tweet.created_at)}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="mt-6 text-gray5">{renderParsedTweet()}</div>

            {/* Media? */}
            {tweet.media && <MyImage src={tweet.media.url} />}

            {/* Metadata */}

            {showStats && <TweetStats id={tweet.id} />}
          </div>
          <hr className="my-2" />
          {/* Buttons */}
          {/* Comment Button */}
          <div className="flex justify-around">
            <Button
              text="Comment"
              variant="default"
              className="text-lg md:text-sm"
              icon={<MdModeComment />}
              alignment="left"
              hideTextOnMobile={true}
              onClick={toggleCommentForm}
            />
            {/* Edit Button */}
            {userId === tweet.user.id && (
              <Button
                text="Edit"
                variant="default"
                className="text-lg md:text-sm"
                icon={<MdEditNote />}
                alignment="left"
                hideTextOnMobile={true}
                onClick={toggleEditTweetForm}
              />
            )}
            {/* Delete Button */}
            {userId === tweet.user.id && (
              <Button
                text="Delete"
                variant="default"
                className="text-lg md:text-sm"
                icon={<MdDelete />}
                alignment="left"
                hideTextOnMobile={true}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTweet(tweet.id);
                  setShowTweet(false);
                }}
              />
            )}
            <RetweetButton id={tweet.id} />
            <LikeButton id={tweet.id} />
            <BookmarkButton id={tweet.id} />
          </div>

          {showCommentForm && (
            <TweetForm
              type={TweetTypeEnum.COMMENT}
              tweet_id={tweet.id}
              onSuccess={() => setShowCommentForm(false)}
            />
          )}
          {editTweetForm && (
            <TweetForm
              type={TweetTypeEnum.EDITTWEET}
              tweet_id={tweet.id}
              onSuccess={() => setEditTweetForm(false)}
              originalTweet={tweet.body}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Tweet;
