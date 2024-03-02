// https://firebase.google.com/docs/functions/typescript
// The Cloud Functions for Firebase SDK to create Cloud
// Functions and set up triggers.
import functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
import admin = require('firebase-admin');

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { insertUserMutation } from '../../gql/insertUserMutation';
import { SCREEN_NAME_GROUP } from '../../nav/constants';

admin.initializeApp();

const hasuraUrl = 'https://aptos-social.hasura.app/v1/graphql';
// eslint-disable-next-line max-len
const hasuraSecret =
  '355QYUgPhv4OmyNic6f3pWjAH0d79BbAMEWEmwCWIqcyJAMYiXOnwxIdoStMkXKb';
import fetch from 'cross-fetch';
import { v4 as uuidv4 } from 'uuid';
import { composeNotifications, sendNotifications } from './notifications';

import {
  genUsername,
  genGroupName,
  genPushTokens,
  genPostAuthorPushToken,
  genPostAuthorId,
} from './queries';
// On sign up
exports.processSignUp = functions.auth.user().onCreate(async (user) => {
  const uuid = uuidv4();
  const customClaims = {
    'https://hasura.io/jwt/claims': {
      'x-hasura-default-role': 'user',
      'x-hasura-allowed-roles': ['user'],
      'x-hasura-user-id': user.uid,
      'x-hasura-user-uuid': uuid,
    },
  };
  const httpLink = new HttpLink({
    uri: hasuraUrl,
    headers: {
      'x-hasura-admin-secret': hasuraSecret,
    },
    fetch,
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  const { phoneNumber } = user;

  const variables = {
    id: uuid,
    phone_number: phoneNumber,
    auth_id: user.uid,
    // TODO: use real username, for now use unix timestamp to ensure uniqueness
    username: Date.now().toString(),
  };

  // Set custom user claims on this newly created user.
  admin
    .auth()
    .setCustomUserClaims(user.uid, customClaims)
    .then(() => {
      // Update real-time database to notify client to force refresh.
      const metadataRef = admin.database().ref('metadata/' + user.uid);
      // Set the refresh time to the current UTC timestamp.
      // This will be captured on the client to force a token refresh.
      return metadataRef.set({ refreshTime: new Date().getTime() });
    })
    .catch((error) => {
      console.log(error);
    });
  // insert row into the user table
  const result = await client.mutate({
    mutation: insertUserMutation,
    variables,
  });
  console.log(result.data.insert_user);
  return null;
});

exports.newPostCreated = functions.database
  .ref('/posts/{postId}')
  .onCreate(async (snapshot, context) => {
    const newPost = snapshot.val();
    const [username, groupName, pushTokens] = await Promise.all([
      genUsername(newPost.senderId),
      genGroupName(newPost.groupId),
      genPushTokens(newPost.groupId, newPost.senderId),
    ]);
    const data = {
      type: 'post',
      screen: SCREEN_NAME_GROUP,
      params: { groupId: newPost.groupId, postId: newPost.postId },
    };

    const message = await composeNotifications(
      pushTokens,
      username,
      `Added a moment to "${groupName}"`,
      data,
    );

    const receipts = await sendNotifications([message]);
    console.log('Receipts:', receipts);

    return null;
  });

exports.newCommentCreated = functions.database
  .ref('/comments/{postId}/{commentId}')
  .onCreate(async (snapshot, context) => {
    const newComment = snapshot.val();
    const username = await genUsername(newComment.senderId);
    const postAuthorId = await genPostAuthorId(newComment.postId);
    if (postAuthorId == newComment.senderId) {
      console.log("author's own comment");
      return null;
    }
    const pushTokens = await genPostAuthorPushToken(postAuthorId);
    const data = {
      type: 'comment',
      screen: SCREEN_NAME_GROUP,
      params: { postId: newComment.postId },
    };

    const message = await composeNotifications(
      pushTokens,
      username,
      `commented on your post "${newComment.comment}"`,
      data,
    );

    const receipts = await sendNotifications([message]);
    console.log('Receipts:', receipts);

    return null;
  });
