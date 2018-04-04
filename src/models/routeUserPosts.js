import { dispatch } from '@rematch/core';
import { normalize } from 'normalizr';
import request from '../utils/request';
import { post as postSchema } from '../store/schema';

const fetchPosts = (rootState, id, url, nextStatus) => {
  if (!url) return Promise.resolve({ data: [] });
  if (
    rootState.routeUserPosts.status === 'loading' ||
    rootState.routeUserPosts.status === 'refreshing'
  )
    return Promise.resolve({ data: [] });

  dispatch.routeUserPosts.changeStatus({ id, status: nextStatus });

  return request(url, {
    credentials: 'include'
  }).then(response => {
    const data = normalize(response.json.data, [postSchema]);
    dispatch.entities.add(data.entities);
    dispatch.routeUserPosts.fetchSucceeded({
      nextUrl: response.json.pagination.nextUrl
    });
    return response.json.data;
  });
};

export default {
  state: {
    id: null,
    status: 'idle', // refreshing,loading,idle,error
    error: null,
    nextUrl: null,
    posts: []
  },
  reducers: {
    changeStatus: (state, { id, status }) => ({
      ...state,
      ...{ id: id, status: status, error: null }
    }),
    fetchFailed: (state, { message }) => ({
      ...state,
      ...{ status: 'error', error: message }
    }),
    fetchSucceeded: (state, { nextUrl }) => ({
      ...state,
      ...{ status: 'idle', nextUrl }
    }),
    replacePosts: (state, { posts }) => ({
      ...state,
      ...{ posts: posts.map(p => p.id) }
    }),
    appendPosts: (state, { posts }) => ({
      ...state,
      ...{ posts: [...state.posts, ...posts.map(p => p.id)] }
    })
  },
  effects: {
    async fetchLatest({ id }, rootState) {
      try {
        const posts = await fetchPosts(
          rootState,
          id,
          `/api/posts?userId=${id}`,
          'refreshing'
        );
        if (posts.length) this.replacePosts({ posts });
      } catch (error) {
        if (rootState.routeUserPosts.posts.length)
          this.changeStatus({ status: 'idle' });
        else this.fetchFailed({ message: error.message });
      }
    },
    async fetchNext({ id }, rootState) {
      try {
        const posts = await fetchPosts(
          rootState,
          id,
          rootState.routeUserPosts.nextUrl,
          'loading'
        );
        if (posts.length) this.appendPosts({ posts });
      } catch (error) {
        this.fetchFailed({ message: error.message });
      }
    }
  }
};