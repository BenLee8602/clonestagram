import React from "react";
import { Link } from "react-router-dom";

function Post({ post, mini }) {
    if (mini) {
        return (<div className="item">
            <Link to={`/posts/${post._id}`}><img src={ post.image } alt="/default_pfp.png" style={{"width":"64px", "height":"64px"}} /></Link>
            <h3>{ post.title }</h3>
            <p><Link to={`/users/${post.author}/profile`}>{ post.author }</Link> | { new Date(post.posted).toLocaleString() }</p>
        </div>);
    }
    return (<div className="item">
        <h3><Link to={`/users/${post.author}/profile`}>{ post.author }</Link> | { new Date(post.posted).toLocaleString() }</h3>
        <Link to={`/posts/${post._id}`}><img src={ post.image } alt="/default_pfp.png" style={{"maxWidth": "71vw"}} /></Link>
        <p>{ post.caption }</p>
    </div>)
}

export default Post;
