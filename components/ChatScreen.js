import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, InsertEmoticon, Mic } from "@material-ui/icons";
import MoreVert from "@material-ui/icons/MoreVert";
import { useRouter } from "next/dist/client/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import { useState, useRef } from "react";
import firebase from "firebase";
import { getRecepientEmail } from "../utils/getRecepientEmail";
import TimeAgo from 'timeago-react';


export default function ChatScreen({chat, messages}) {

    const [input, setInput] = useState('');
    const [user] = useAuthState(auth);
    const router = useRouter();
    const EndOfMessages = useRef(null);
    const [recepientSnapshot] = useCollection(db.collection('users').where('email', '==', getRecepientEmail(chat.users, user)));
    const [messageSnapshot] = useCollection(
        db
        .collection('chats')
        .doc(router.query.id)
        .collection('messages')
        .orderBy('timestamp', 'asc')
    );

    const showMessages = () => {
        if (messageSnapshot) {
            return messageSnapshot.docs.map(message => (
                <Message 
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime()
                    }}
                />
            ))
        } else {
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} message={message} />
            ))
        }
    };
    //scrolling in chat screen
    const scrollToBottom = () => {
        EndOfMessage.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };
    
    const sendMessage = e => {
        e.preventDefault();
        //update the 'last seen...'
        db.collection('users').doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        }, {merge: true});
        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photo: user.photoURL
        });
        setInput('');
        scrollToBottom();
    };

    const recepient = recepientSnapshot?.docs?.[0]?.data();
    const recepientEmail = getRecepientEmail(chat.users, user);

    return (
        <Container>
            <Header>
            {recepient ? (
                <Avatar src={recepient?.photoURL} />
            ) : (
                <Avatar>{recepientEmail[0]}</Avatar>
            )}
                <HeaderInfo>
                    <h3>{recepientEmail}</h3>
                    {recepientSnapshot ? 
                    (<p>last seen: {' '}
                    {recepient?.lastSeen?.toDate() ? (
                        <TimeAgo datetime={recepient?.lastSeen?.toDate()} />
                    ) : 'unavailable'}</p>)
                    : (<p>loading last active...</p>)}
                </HeaderInfo>
                <HeaderIcons>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={EndOfMessage} />
            </MessageContainer>
                
            <InputContainer>
                <InsertEmoticon />
                <Input value={input} onChange={e => setInput(e.target.value)} />
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
                <Mic />
            </InputContainer>
        </Container>
    )
}



const Container = styled.div``;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInfo = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 3px;
    }

    > p {
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;

const Input = styled.input`
    flex: 1;
    padding: 20px;
    background-color: whitesmoke;
    outline: none;
    border-radius: 10px;
    border: none;
    margin-left: 15px;
    margin-right: 15px;
`;