import React, { Fragment as Frag, useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";
import Comment from "./Comment";
import Delete from "./Delete";
import Editable from "./Editable";

function Post({ data, mini }) {
    const [user, setUser] = useContext(UserContext);
    const [post, setPost] = useState({ ...data });
    const [newComment, setNewComment] = useState("");
    const [deleted, setDeleted] = useState(false);


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
        .then(res => setPost({ ...post, likes: res.likes }))
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
            if (res.success) setPost({ ...post, comments: [...post.comments, res.comment] });
        })
        .catch(err => console.log(err));
    };


    const handleEdit = caption => {
        const req = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ caption })
        };

        fetch(`http://localhost:3000/posts/${post._id}`, req)
        .then(res => res.json())
        .then(res => { if (res.success) setPost({ ...post, caption: caption }); })
        .catch(err => console.log(err));
    };


    const handleDelete = () => {
        const req = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        };

        fetch(`http://localhost:3000/posts/${post._id}`, req)
        .then(res => res.json())
        .then(res => { if (res.success) setDeleted(true); })
        .catch(err => console.log(err));
    };
    

    if (deleted) return <h3>post deleted</h3>;

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

        { post.author === user ? (<>
            <Delete handleDelete={ handleDelete } />
            <Editable value={ post.caption } handleSubmit={ handleEdit } />
        </>) : <></> }

        <button onClick={handleLike}>{ post.likes.includes(user) ? "unlike" : "like" }</button>
        { post.likes.length ? <>
            { "liked by: " }
            { post.likes.length > 1 ? <>
                { post.likes.slice(Math.max(0, post.likes.length - 3), Math.max(0, post.likes.length - 1))
                .map((v, i) => <Frag key={i}><Link to={`/users/${v}/profile`}>{v}</Link>, </Frag>) }
                { " and " }
            </> : <></> }
            <Link to={`/users/${post.likes[post.likes.length - 1]}/profile`}>{post.likes[post.likes.length - 1]}</Link>
            <Link to={`/posts/${post._id}/likes`} style={{"color":"gray"}}> view all</Link>
        </> : <></> }<br/>

        <input type="text" placeholder="comment" onChange={ e => setNewComment(e.target.value) } />
        <button onClick={ handleComment }>send</button>
        <Link to={`/posts/${post._id}/comments`} style={{"color":"gray"}}> view all</Link>
        {
            post.comments.slice(Math.max(0, post.comments.length - 3), Math.max(0, post.comments.length))
            .map(v => <Comment key={v._id} comment={v} setPost={setPost} />)
        }
    </div>)
}

export default Post;
