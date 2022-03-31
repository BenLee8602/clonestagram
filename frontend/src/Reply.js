import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";

function Reply({ reply }) {
    const [user, setUser] = useContext(UserContext);
    const [nLikes, setNLikes] = useState(reply.likes.length);
    const [liked, setLiked] = useState(reply.likes.includes(user));

    const handleLike = () => {
        const req = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        };
        
        fetch(`http://localhost:3000/posts/comments/reply/${reply._id}/like`, req)
        .then(res => res.json())
        .then(res => {
            setNLikes(res.liked ? nLikes + 1 : nLikes - 1);
            setLiked(user && !liked);
        })
        .catch(err => console.log(err));
    };

    return (<div className="item">
        <strong>
            <Link to={`/users/${reply.author}/profile`}>{ reply.author }</Link>
            {" | "}
            { new Date(reply.posted).toLocaleString() }
        </strong>
        <button onClick={handleLike}>{ liked ? "unlike" : "like" }</button>{ nLikes }<br/>
        <p style={{"margin":"0px","fontSize":"14px"}}>{ reply.text }</p>
    </div>);
}

export default Reply;
