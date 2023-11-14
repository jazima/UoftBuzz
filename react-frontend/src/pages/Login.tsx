import {Container, Stack, Title, Button, Flex, TextInput, PasswordInput, Text, Alert, Image } from '@mantine/core'
import { IconExclamationCircle } from '@tabler/icons-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import icon from '../images/icon.png'

interface LoginProps {
}

export function Login(props: LoginProps) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const navigate = useNavigate();

    // Function to handle login
    const handleLogin = async () => {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: username, password: password }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Login", data);
                localStorage.setItem('accessToken', data.token);
                localStorage.setItem('userID', data.userID);
                navigate('/home');
            } else {
                setError(data.message || 'An error occurred during login.');
            }
        } catch (error) {
            setError('Failed to connect to the server.');
        }
    };
    return (
        <Container size='30rem'>
            <Stack h='100vh' gap='1.5em' justify='center'>
                <Image src={icon} h='10em' fit='contain'></Image>
                <Flex direction='row' justify='center'><Title order={1}>UofTBuzz</Title></Flex>
                <TextInput label='Email' placeholder='Enter your email' value={username} 
                    onChange={(event) => setUsername(event.currentTarget.value)}></TextInput>
                <PasswordInput label='Password' placeholder='Password' value={password}
                    onChange={(event)=>setPassword(event.currentTarget.value)}></PasswordInput>
                <Button variant='filled' w='100%' mt='1em' onClick={handleLogin}>LOGIN</Button>
                {error.length !== 0 && <Alert variant='light' color='red' title='Error while logging in' w='100%' icon={<IconExclamationCircle />}>{error}</Alert>}
                <Flex direction='row' justify='center' gap='0.3em'>
                    <Text>New User?</Text>
                    <Text c='muted-teal' component='a' onClick={() => navigate('/accountcreation')} style={{cursor:'pointer'}}>Create Account</Text>
                </Flex>
            </Stack>
        </Container>
    )

}