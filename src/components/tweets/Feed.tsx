import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/userState";
import { useRecoilState } from "recoil";
import { FEED } from "../../graphql/tweets/queries";
import { tweetsState } from "../../state/tweetsState";
import { TweetType, UserType } from "../../types/types";
import BasicLoader from "../loaders/BasicLoader";
import Comments from "./Comments";
import Tweet from "./Tweet";
import TweetForm from "./TweetForm";

const Feed = () => {
  const [tweets, setTweets] = useRecoilState(tweetsState);
  const { data, loading, error } = useQuery(FEED);

  // Retrieve user
  const user: UserType | null = useRecoilValue(userState);

  useEffect(() => {
    if (data && data.feed && data.feed.length > 0) {
      setTweets(data.feed);
    }
  }, [data]);

  if (loading) return <BasicLoader />;
  return (
    <div className="w-full pb-8 md:pb-0">
      <TweetForm />
      {tweets.length > 0 && (
        <ul>
          {tweets.map((t: TweetType, index: number) => {
            return (
              <Tweet key={`${t.id}_${index}`} tweet={t} userId={user?.id} />
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Feed;
