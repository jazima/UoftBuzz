import { Button, Flex, Badge, Text } from '@mantine/core'
import { Header } from '../components/Header';
import { IconEdit } from '@tabler/icons-react';
import {User, TagList} from '../types';
import default_pfp from '../images/default_profile_picture.png'

interface UserProfileProps {
    user: User;}

const tags = [
    { name: 'Fun', colour: '#FAB005' },
    { name: 'Philosophy', colour: '#748FFC' },
    { name: 'Freshman', colour: '#74C0FC' },
];

export function UserProfile(props: UserProfileProps) {
    return (
        <>
            <Header username={props.user.username} title='My Profile' imgSrc={props.user.imgSrc?props.user.imgSrc:''}></Header>
            <Flex direction='column' align='center' gap='1em'>
                <Flex mt='3em' style={{ position: 'relative' }}>
                    <img src={props.user.imgSrc?props.user.imgSrc:default_pfp} alt='User Profile' style={{ height: '15em', width: '15em', borderRadius: '50%', objectFit: 'cover', border: '1px solid #CFCFCF' }} />
                    <Button
                        variant='outline'
                        size='xs'
                        style={{
                            position: 'absolute',
                            top: '1em',
                            left: '25em'
                        }}
                        leftSection={<IconEdit size='17px' />}
                    >
                        Edit Profile
                    </Button>
                </Flex>
                <Text mt='1em'>{props.user.name? props.user.name:props.user.username}</Text>
                <Flex gap='1em' wrap='wrap'>
                    {props.user.tags && props.user.tags.map((tag, index) => {
                        const currTag = TagList.find((currTag) => currTag.name === tag);
                        const colour = currTag?currTag.colour:'white';
                        return(
                            <Badge key={index} style={{ backgroundColor: colour }}>
                                {tag}
                            </Badge>
                        )
                    })}
                </Flex>

                <Flex w='25em' mt='1em'>
                    <Text>{props.user.description?props.user.description:''}</Text>
                </Flex>
            </Flex>
        </>
    )
}