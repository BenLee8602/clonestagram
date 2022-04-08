import React, { Fragment as Frag, useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";
import Comment from "./Comment";
import Delete from "./Delete";
import Editable from "./Editable";
import Like from "./Like";
import TextPost from "./TextPost";
import UserList from "./UserList";

function Post({ data, view }) {
    const [user, setUser] = useContext(UserContext);
    const [post, setPost] = useState({ ...data });
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


    const handleComment = newComment => {
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

    if (view === "mini") return (<div className="item">
        <Link to={`/posts/${post._id}`}><img src={ post.image } alt="image not found" style={{"width":"64px", "height":"64px"}} /></Link>
        <h3><Link to={`/users/${post.author}/profile`}>{ post.author }</Link> | { new Date(post.posted).toLocaleString() }</h3>
        <p style={{"whiteSpace":"pre-wrap"}}>{ post.caption }</p>
    </div>);

    if (view === "likes") return <UserList names={ post.likes } />;

    if (view === "comments") return (<>{ post.comments.map(v => <Comment key={v._id} comment={v} setPost={setPost} showReplies />) }</>);

    return (<div className="item">
        <h3><Link to={`/users/${post.author}/profile`}>{ post.author }</Link> | { new Date(post.posted).toLocaleString() }</h3>
        <Link to={`/posts/${post._id}`}><img src={ post.image } alt="image not found" style={{"width": "56vw"}} /></Link><br/>

        <Like likes={ post.likes } handleLike={ handleLike } />
        <TextPost handlePost={ handleComment } display="comment" />
        { post.author === user ? (<div style={{"display":"inline","float":"right"}}>
            <Editable value={ post.caption } handleSubmit={ handleEdit } />
            <Delete handleDelete={ handleDelete } />
        </div>) : <></> }<br/>

        { post.likes.length ? <>
            { "liked by: " }
            { post.likes.length > 1 ? <>
                { post.likes.slice(Math.max(0, post.likes.length - 3), Math.max(0, post.likes.length - 1))
                .map((v, i) => <Frag key={i}><Link to={`/users/${v}/profile`}>{v}</Link>, </Frag>) }
                { " and " }
            </> : <></> }
            <Link to={`/users/${post.likes[post.likes.length - 1]}/profile`}>{post.likes[post.likes.length - 1]}</Link>
        </> : <></> }
        { post.likes.length ? <Link to={`/posts/${post._id}/likes`} style={{"color":"gray"}}> view all</Link> : <></> }<br/>

        <p style={{"whiteSpace":"pre-wrap"}}>{ post.caption }</p>

        {
            post.comments.slice(Math.max(0, post.comments.length - 3), Math.max(0, post.comments.length))
            .map(v => <Comment key={v._id} comment={v} setPost={setPost} />)
        }<br/>
        <Link to={`/posts/${post._id}/comments`} style={{"color":"gray"}}>view all comments</Link>
    </div>)
}

export default Post;
