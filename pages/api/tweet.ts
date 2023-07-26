import { TwitterClient } from "../../app/twitter-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const twitter = new TwitterClient({
      apiKey: process.env.TWITTER_API_KEY!,
      apiSecret: process.env.TWITTER_API_SECRET!,
      userToken: req.body.accessToken,
      userSecret: req.body.secret,
    });

    const tweet = await twitter.post({
      text: req.body.message,
    });

    res.status(200);
    res.send(tweet);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
}
