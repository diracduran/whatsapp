import styled from "styled-components";
import Head from 'next/head';
import { Button } from "@material-ui/core";
import { auth, provider } from "../firebase";


export default function Login() {

    const signIn = () => {
        auth.signInWithPopup(provider).catch(alert);
    }

    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <LoginContainer>
                <Logo 
                    src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/800px-WhatsApp.svg.png'
                />
                <Button variant='outlined' onClick={signIn}>Sign in with Google</Button>
            </LoginContainer>
        </Container>
    )
}


const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: whitesmoke;
`;

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 100px;
    align-items: center;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 4px 14px -3px rgba(0,0,0,0.7);
`;

const Logo = styled.img`
    width: 200px;
    height: 200px;
    margin-bottom: 50px;
`;