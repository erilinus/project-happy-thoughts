import React, { useState, useEffect } from 'react';

import Header from 'components/Header';
import NewPost from 'components/NewPost';
import PostList from 'components/PostList';
import Loader from 'components/Loader';

export const App = () => {
  const [postList, setPostList] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetch('https://project-happy-thoughts-api-rqleaq4bsa-lz.a.run.app/thoughts')
      .then((data) => data.json())
      .then((transformedData) => setPostList(transformedData))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onNewPostChange = (event) => {
    setNewPost(event.target.value);
  };

  const handleFormCleanup = () => {
    setNewPost('');
    setLoading(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const options = {
      method: 'post',
      body: JSON.stringify({
        message: newPost
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    setLoading(true);
    fetch('https://project-happy-thoughts-api-rqleaq4bsa-lz.a.run.app/thoughts', options)
      .then((data) => data.json())
      .then(() => fetchData())
      .catch((error) => console.error(error))
      .finally(() => handleFormCleanup());
  };

  if (loading) {
    return (
      <Loader />
    )
  }

  const onLikesIncrease = (thoughtId) => {
    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      }
    };

    fetch(`https://project-happy-thoughts-api-rqleaq4bsa-lz.a.run.app/thoughts/${thoughtId}/like`, options)
      .then((res) => res.json())
      .then((data) => {
        fetchData(data)
      })
      .catch((error) => error)
  };

  return (
    <div className="outer-wrapper">
      <Header />
      <div className="inner-wrapper">
        <NewPost
          handleFormSubmit={handleFormSubmit}
          onNewPostChange={onNewPostChange}
          newPost={newPost} />
        <PostList
          postList={postList}
          setPostList={setPostList}
          onLikesIncrease={onLikesIncrease} />
      </div>
    </div>
  );
}