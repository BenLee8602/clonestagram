import React from "react";
import { Link } from "react-router-dom";
import "../style/PostList.css";

function PostList({ posts }) {
    return (<div className="postlist">
        { posts.map(v => <Link key={v._id} to={`/posts/${v._id}`} className="postlist-item">
            <img src={ v.image ? v.image : "/default_pfp.png" } alt="post image" className="postlist-image" />
        </Link>) }
    </div>);
}

export default PostList;
