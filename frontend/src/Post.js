import React, { Fragment as Frag, useState } from "react";
import { Link } from "react-router-dom";

function Post({ post, mini }) {
    const [likes, setLikes] = useState(post.likes);

    const handleLike = () => {
        const req = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        };
        
        fetch(`http://localhost:3000/posts/${post._id}/like`, req)
        .then(res => res.json())
        .then(res => setLikes(res.likes))
        .catch(err => console.log(err));
    };

    if (mini) {
        return (<div className="item">
            <Link to={`/posts/${post._id}`}><img src={ post.image } alt="/default_pfp.png" style={{"width":"64px", "height":"64px"}} /></Link>
            <h3><Link to={`/users/${post.author}/profile`}>{ post.author }</Link> | { new Date(post.posted).toLocaleString() }</h3>
            <p style={{"whiteSpace":"pre-wrap"}}>{ post.caption }</p>
        </div>);
    }

    return (<div className="item">
        <h3><Link to={`/users/${post.author}/profile`}>{ post.author }</Link> | { new Date(post.posted).toLocaleString() }</h3>
        <Link to={`/posts/${post._id}`}><img src={ post.image } alt="/default_pfp.png" style={{"maxWidth": "71vw"}} /></Link>
        <p style={{"whiteSpace":"pre-wrap"}}>{ post.caption }</p>

        <button onClick={handleLike}>like</button>
        { likes.length ? <>
            { "liked by: " }
            { likes.length > 1 ? <>
                { likes.slice(Math.max(0, likes.length - 3), Math.max(0, likes.length - 1))
                .map((v, i) => <Frag key={i}><Link to={`/users/${v}/profile`}>{v}</Link>, </Frag>) }
                { " and " }
            </> : <></> }
            { <Link to={`/users/${likes[likes.length - 1]}/profile`}>{likes[likes.length - 1]}</Link> }
        </> : <></> }
    </div>)
}

export default Post;
