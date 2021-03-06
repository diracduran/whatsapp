import styled from "styled-components";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getRecepientEmail } from "../../utils/getRecepientEmail";


export default function Chat({chat, messages}) {

    const [user] = useAuthState(auth);

    return (
        <Container>
            <Head>
                <title>Chat with {getRecepientEmail(chat.users, user)}</title>
            </Head>

            <Sidebar />

            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>
        </Container>
    )
}


export async function getServerSideProps(context) {
    const ref = db.collection('chats').doc(context.query.id);
    //prep messages on the server
    const messagesRef = await ref
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .get();
    const messages = messagesRef.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }));
    //prep the chats
    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    };

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    };
}


const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar {
        display: none;
    }
    --ms-overflow-style: none; /* ie & edge */
    scrollbar-width: none; /* firefox */
`;