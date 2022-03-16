import React from "react";
import { Link } from "react-router-dom";

export const defaultPost = {
    author: "admin",
    posted: Date.now(),
    title: "loading",
    content: "content is loading"
};

function Post({ post, mini }) {
    if (mini) {
        return (<div className="item">
            <h3>{ post.title }</h3>
            <p><Link to={`/users/${post.author}/profile`}>{ post.author }</Link> | { new Date(post.posted).toLocaleString() }</p>
        </div>);
    }
    return (<div className="item">
        <h1>{ post.title }</h1>
        <h3><Link to={`/users/${post.author}/profile`}>{ post.author }</Link> | { new Date(post.posted).toLocaleString() }</h3>
        <p>{ post.content }</p>
    </div>)
}

export default Post;
