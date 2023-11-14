import { Title, Flex, Image, Text, Paper, ActionIcon, Modal, Alert } from '@mantine/core'
import { Header } from '../components/Header';
import sample_img from '../sample_image.png';
import { IconTrash, IconExclamationCircle } from '@tabler/icons-react';
import EventOverlay from '../components/EventOverlay';
import React from 'react';
import { EventInfo } from './HomePage';
import {User} from '../types';
import { getSavedEvents, getUserCreatedEvents, removeSavedEvent } from '../serverApi';


interface SavedEventsProps {
    headerTitle: string;
    user: User;
}

const demoEvent: EventInfo = {
    id: '1',
    title: 'Engineering Jacket Fittings',
    group: 'Engineering Society',
    dateTime: '9am - October 17, 2023',
    location: 'Bahen Centre',
    website: 'https://www.google.com',
    tags: ['Fun', 'Philosophy', 'Freshman'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In commodo lorem quis felis accumsan, non porta dolor vestibulum. Etiam a elit ultrices, rhoncus diam a, rutrum sapien. Morbi facilisis sem vitae purus lacinia placerat. Duis eleifend nulla sapien, nec ultrices ipsum placerat non. Nullam posuere tellus vel orci tempus volutpat. Nulla fermentum dolor ac ante blandit tincidunt. Sed finibus felis non neque interdum sollicitudin. Nunc aliquam risus et elementum varius. Maecenas auctor augue cursus urna efficitur posuere. Suspendisse a lectus suscipit, convallis augue sed, fermentum metus. Nullam quis mi aliquet, accumsan ante ut, rhoncus ligula. Pellentesque id mauris velit. Phasellus rhoncus quam quis nisi pretium tincidunt. In hac habitasse platea dictumst. Curabitur quis tortor mauris. Nulla facilisi. Nunc porttitor imperdiet arcu, ac vehicula lectus rhoncus a. Nulla rhoncus mi dolor, nec mollis ex cursus et. In tortor libero, porttitor in est ac, semper porta nibh. Ut blandit varius justo, id lacinia mi condimentum quis. Vivamus posuere nisl est, a varius purus eleifend eget. Duis venenatis, ipsum non posuere porta, augue nisi aliquet ipsum, mollis consectetur sem metus ut nisl. Curabitur vehicula neque at magna ultricies feugiat. Mauris dictum mattis felis, id ultrices orci ultricies ac. Ut varius nec libero et ultrices. Curabitur neque nisi, interdum nec maximus vitae, finibus in leo. Quisque sollicitudin, eros vestibulum condimentum suscipit, sem orci efficitur augue, non blandit magna risus vel quam. Praesent diam sem, gravida eget justo at, finibus posuere tortor. Vivamus facilisis eros at velit laoreet egestas.',
    creatorId: '1',
    imgSrc: sample_img
}


export function SavedEvents(props: SavedEventsProps) 
{
    const [events, setEvents] = React.useState<EventInfo[]>([]);
    const [overlayEvent, setOverlayEvent] = React.useState<EventInfo | void>();
    const [error, setError] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [showOverlay, setShowOverlay] = React.useState(false);

    function handleShowOverlay(id: string) {
        setShowOverlay(true);
        const event = events.find(event => event.id === id);
        if (event) {
            setOverlayEvent(event);
        }
    }

    function handleCloseOverlay() {
        setShowOverlay(false);
    }

    const handleDeleteEvent = async(event: any, eventId: string) => {
        event.stopPropagation();
        try {
            const data = await removeSavedEvent(eventId);
            console.log(data.message);
            setEvents(events.filter(event => event.id != eventId))
        }
        catch(error) {
            setMessage('Failed to connect to the server.');
            setError(true);
        }
    };

    const handleGetSavedEvents = async () => {
        try {
            if (props.headerTitle == "My Events") {
                console.log("Getting user events");
                const data = await getUserCreatedEvents();
                let events: EventInfo[] = data;
                setEvents(events);
            }
            else {
                console.log("Getting saved events");
                const data = await getSavedEvents();
                console.log(data.message);
    
                let events: EventInfo[] = data.events;
                if (props.headerTitle == "Past Events") { // hacky but works for now
                    const curDate = new Date();
                    events = events.filter(event => new Date(event.dateTime) < curDate)
                }
                setEvents(events);
            }
        }
        catch (error) {
            setMessage('Failed to connect to the server.');
            setError(true);
        }
    }

    React.useEffect(() => {handleGetSavedEvents();}, [props.headerTitle])

    return (
        <>
            <Header username={props.user.username} title={props.headerTitle} imgSrc={props.user.imgSrc?props.user.imgSrc:''}></Header>
            {error && <Alert variant='light' color={'red'} title={'Error while getting events'} w='100%' icon={<IconExclamationCircle />}>{message}</Alert>}
            <Flex direction='column' align='center' gap='1em' mt='3em'>
                {events.map((card, index) => (
                    <Paper key={index} withBorder shadow='sm' p='lg' radius='sm' w='60%' onClick={() => handleShowOverlay(card.id)} style={{ cursor: 'pointer' }}>
                        <Flex>
                            <Image
                                src={card.imgSrc?card.imgSrc:sample_img}
                                mah='10em'
                                alt='Event image'
                            />
                            <Flex direction='column' ml='3em'>
                                <Title order={5}>
                                    {card.title}
                                </Title>
                                <Flex direction='column' mt='auto'>
                                    <Text size='md'>
                                        {card.group}
                                    </Text>
                                    <Text size='md'>
                                        {card.dateTime}
                                    </Text>
                                </Flex>
                            </Flex>
                            <ActionIcon variant="filled" aria-label="Settings" ml='auto' onClick={(event) => handleDeleteEvent(event, card.id)}>
                                <IconTrash size='1.4em' stroke={1.5} />
                            </ActionIcon>
                        </Flex>
                    </Paper >
                ))}
            </Flex >
            <Modal size='100vw' padding='4%' opened={showOverlay} onClose={handleCloseOverlay} withCloseButton={false} centered>
                <EventOverlay eventInfo={overlayEvent?overlayEvent:null} />
            </Modal>
        </>
    )
}