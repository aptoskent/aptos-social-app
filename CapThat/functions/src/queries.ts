import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const hasuraUrl = 'https://aptos-social.hasura.app/v1/graphql';
// eslint-disable-next-line max-len
const hasuraSecret =
  '355QYUgPhv4OmyNic6f3pWjAH0d79BbAMEWEmwCWIqcyJAMYiXOnwxIdoStMkXKb';
import fetch from 'cross-fetch';
import { getUserQuery } from '../../gql/getUserQuery';
import {
  getGroupNameQuery,
  getMembersForGroupIdQuery,
} from '../../gql/getGroupQuery';
import { getPushTokensByGroupIdQuery } from '../../gql/getPushTokensByGroupIdQuery';
import { getPostAuthorQuery } from '../../gql/getPostQuery';
import { getPushTokenByUserIdQuery } from '../../gql/getPushTokenByUserIdQuery';

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

/**
 * Retrieves the username of a user based on their user ID.
 * @param {string} userId - The ID of the user.
 * @return {Promise<string>} A Promise resolving to the username of the user.
 */
export async function genUsername(userId: string): Promise<string> {
  const userResult = await client.query({
    query: getUserQuery,
    variables: { user_id: userId },
  });
  return userResult.data.user[0].username;
}

/**
 * Retrieves the group name based on the group ID.
 * @param {string} groupId - The ID of the group.
 * @return {Promise<string>} A Promise resolving to the group name.
 */
export async function genGroupName(groupId: string): Promise<string> {
  const groupResult = await client.query({
    query: getGroupNameQuery,
    variables: { group_id: groupId },
  });
  return groupResult.data.group[0].name;
}

/**
 * Generates push tokens for members of a group, excluding the author.
 *
 * @param {string} groupId - The ID of the group.
 * @param {string} authorId - The ID of the author.
 * @return {Promise<string[]>} A Promise resolving to an array of push tokens.
 */
export async function genPushTokens(
  groupId: string,
  authorId: string,
): Promise<string[]> {
  const groupResult = await client.query({
    query: getMembersForGroupIdQuery,
    variables: { group_id: groupId },
  });
  const currentGroup = groupResult.data.group[0];
  const members = currentGroup?.group_user_edges?.map(
    (edge: any) => edge.user.id,
  );
  const receivers = members.filter((member: string) => member !== authorId);
  const pushTokenResult = await client.query({
    query: getPushTokensByGroupIdQuery,
    variables: { user_ids: receivers },
  });
  const token = pushTokenResult.data.push_token.map(
    (token: any) => token.push_token,
  );
  console.log(token);
  return token;
}

/**
 * Generates the push token for the author of a post.
 *
 * @param {string} postId - The ID of the post.
 * @return {Promise<string>} A Promise resolving to id of the author.
 */
export async function genPostAuthorId(postId: string): Promise<string> {
  const authorResult = await client.query({
    query: getPostAuthorQuery,
    variables: { post_id: postId },
  });

  return authorResult.data.post[0].post_user_edges[0].user_id;
}

/**
 * Generates the push token for the author of a post.
 *
 * @param {string} authorId - The ID of the post.
 * @return {Promise<string>} A Promise resolving to the pushToken of the author.
 */
export async function genPostAuthorPushToken(
  authorId: string,
): Promise<string[]> {
  const pushTokenResult = await client.query({
    query: getPushTokenByUserIdQuery,
    variables: { user_id: authorId },
  });

  const token = pushTokenResult.data.push_token.map(
    (token: any) => token.push_token,
  );
  console.log(token);
  return token;
}
