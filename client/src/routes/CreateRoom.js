import React from "react";
import { v1 as uuid } from "uuid";

const CreateRoom = (props) => {
    //function which creates a unique URL via UUID and sets the URL to this
    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    //returns a simple button that when clicked takes user
    //to Room.js where their A/V streams are shown
    return (
        <div class="container">
            <button onClick={create}>Create Room</button>
            <img src={ require ("../logosmallwhitebackground.png")} alt="CT banner image"/>
        </div>
    );
}

export default CreateRoom;