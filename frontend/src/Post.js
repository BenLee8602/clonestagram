import React from "react";

export const defaultPost = {
    author: "admin",
    posted: Date.now(),
    title: "loading",
    content: "content is loading"
};

function Post({ post }) {
    return (<div className="item">
        <h1>{ post.title }</h1>
        <h3>{ post.author } | { new Date(post.posted).toLocaleString() }</h3>
        <p>{ post.content }</p>
    </div>)
}

export default Post;
