/* SPDX-FileCopyrightText: 2023-present Konstantin Tarkus */
/* SPDX-License-Identifier: MIT */

import { got, RequestError } from "got";
import crypto from "node:crypto";
import OAuth, { HashFunction, RequestOptions } from "oauth-1.0a";

/**
 * Initializes a Twitter client.
 *
 * @example
 *   const twitter = new TwitterClient({
 *     apiKey: env.TWITTER_API_KEY,
 *     apiSecret: env.TWITTER_API_SECRET,
 *     userToken: "xxxxx",
 *     userSecret: "xxxxx"
 *   });
 *
 *   const tweet = await twitter.post({
 *     text: "hello"
 *   });
 */
export class TwitterClient {
  readonly oauth: OAuth;
  readonly userToken: string;
  readonly userSecret: string;

  constructor(options: {
    apiKey: string;
    apiSecret: string;
    userToken: string;
    userSecret: string;
  }) {
    this.oauth = new OAuth({
      consumer: {
        key: options.apiKey,
        secret: options.apiSecret,
      },
      signature_method: "HMAC-SHA1",
      hash_function: hashFn,
    });
    this.userToken = options.userToken;
    this.userSecret = options.userSecret;
  }

  /**
   * Posts a new tweet on the user's timeline.
   */
  post(data: { text: string }): Promise<Tweet> {
    const options: RequestOptions = {
      url: "https://api.twitter.com/2/tweets",
      includeBodyHash: true,
      method: "POST",
      data,
    };

    const request = this.oauth.authorize(options, {
      key: this.userToken,
      secret: this.userSecret,
    });

    return got
      .post(options.url, {
        headers: { ...this.oauth.toHeader(request) },
        json: options.data,
      })
      .json<{ data: Tweet }>()
      .then((res) => res.data)
      .catch((err) => {
        if (err instanceof RequestError && err.response) {
          const res = JSON.parse(err.response.body as string);
          const message = res.errors?.[0]?.message;
          if (message) {
            throw new Error(message, { cause: res });
          }
        }

        throw err;
      });
  }
}

const hashFn: HashFunction = (value, key) => {
  return crypto.createHmac("sha1", key).update(value).digest("base64");
};

export type Tweet = {
  id: string;
  text: string;
};
