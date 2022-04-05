import React, { Fragment as Frag, useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";
import Comment from "./Comment";

function Post({ post, mini }) {
    const [user, setUser] = useContext(UserContext)

    const [likes, setLikes] = useState(post.likes);
    const [liked, setLiked] = useState(post.likes.includes(user));
    
    const [comments, setComments] = useState(post.comments);
    const [newComment, setNewComment] = useState("");


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
        .then(res => {
            setLikes(res.likes);
            setLiked(user && !liked);
        })
        .catch(err => console.log(err));
    };


    const handleComment = () => {
        const req = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ comment: newComment })
        };

        fetch(`http://localhost:3000/posts/${post._id}/comment`, req)
        .then(res => res.json())
        .then(res => {
            if (res.success) setComments([...comments, res.comment]);
        })
        .catch(err => console.log(err));
    };
    

    if (mini) {
        return (<div className="item">
            <Link to={`/posts/${post._id}`}><img src={ post.image } alt="image not found" style={{"width":"64px", "height":"64px"}} /></Link>
            <h3><Link to={`/users/${post.author}/profile`}>{ post.author }</Link> | { new Date(post.posted).toLocaleString() }</h3>
            <p style={{"whiteSpace":"pre-wrap"}}>{ post.caption }</p>
        </div>);
    }

    return (<div className="item">
        <h3><Link to={`/users/${post.author}/profile`}>{ post.author }</Link> | { new Date(post.posted).toLocaleString() }</h3>
        <Link to={`/posts/${post._id}`}><img src={ post.image } alt="image not found" style={{"maxWidth": "56vw"}} /></Link>
        <p style={{"whiteSpace":"pre-wrap"}}>{ post.caption }</p>

        <button onClick={handleLike}>{ liked ? "unlike" : "like" }</button>
        { likes.length ? <>
            { "liked by: " }
            { likes.length > 1 ? <>
                { likes.slice(Math.max(0, likes.length - 3), Math.max(0, likes.length - 1))
                .map((v, i) => <Frag key={i}><Link to={`/users/${v}/profile`}>{v}</Link>, </Frag>) }
                { " and " }
            </> : <></> }
            <Link to={`/users/${likes[likes.length - 1]}/profile`}>{likes[likes.length - 1]}</Link>
            <Link to={`/posts/${post._id}/likes`} style={{"color":"gray"}}> view all</Link>
        </> : <></> }<br/>

        <input type="text" placeholder="comment" onChange={ e => setNewComment(e.target.value) } />
        <button onClick={ handleComment }>send</button>
        <Link to={`/posts/${post._id}/comments`} style={{"color":"gray"}}> view all</Link>
        {
            comments.slice(Math.max(0, comments.length - 3), Math.max(0, comments.length))
            .map((v, i) => <Comment key={i} comment={v} />)
        }
    </div>)
}

export default Post;
