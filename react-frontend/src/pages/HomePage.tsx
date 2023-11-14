import {useEffect, useState} from 'react';
import { Header } from '../components/Header';
import EventCardDisplay from '../components/EventCardDisplay';
import EventOverlay from '../components/EventOverlay';
import useWindowDimensions from '../hooks/windowDimensions';
import sample_img from '../sample_image.png';
import {Modal, Alert} from '@mantine/core'
import { IconExclamationCircle } from '@tabler/icons-react';
import { Search } from '../components/Search';
import { User, TagList } from '../types'
import { removeSavedEvent, saveEvent } from '../serverApi';

export interface EventInfo{
    id: string;
    title: string;
    location: string;
    website: string;
    description: string;
    dateTime: string;
    tags: string[];
    imgSrc?: string;
    group: string;
    creatorId: string;
    // optional as it applies only when user is logged-in
    // really a boolean, but optional booleans are weird
    isSaved?: number;
}

const demoEvent:EventInfo = {
    id: '1',
    title: 'Engineering Jacket Fittings',
    location: 'Bahen Centre',
    website: 'https://www.google.com',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In commodo lorem quis felis accumsan, non porta dolor vestibulum. Etiam a elit ultrices, rhoncus diam a, rutrum sapien. Morbi facilisis sem vitae purus lacinia placerat. Duis eleifend nulla sapien, nec ultrices ipsum placerat non. Nullam posuere tellus vel orci tempus volutpat. Nulla fermentum dolor ac ante blandit tincidunt. Sed finibus felis non neque interdum sollicitudin. Nunc aliquam risus et elementum varius. Maecenas auctor augue cursus urna efficitur posuere. Suspendisse a lectus suscipit, convallis augue sed, fermentum metus. Nullam quis mi aliquet, accumsan ante ut, rhoncus ligula. Pellentesque id mauris velit. Phasellus rhoncus quam quis nisi pretium tincidunt. In hac habitasse platea dictumst. Curabitur quis tortor mauris. Nulla facilisi. Nunc porttitor imperdiet arcu, ac vehicula lectus rhoncus a. Nulla rhoncus mi dolor, nec mollis ex cursus et. In tortor libero, porttitor in est ac, semper porta nibh. Ut blandit varius justo, id lacinia mi condimentum quis. Vivamus posuere nisl est, a varius purus eleifend eget. Duis venenatis, ipsum non posuere porta, augue nisi aliquet ipsum, mollis consectetur sem metus ut nisl. Curabitur vehicula neque at magna ultricies feugiat. Mauris dictum mattis felis, id ultrices orci ultricies ac. Ut varius nec libero et ultrices. Curabitur neque nisi, interdum nec maximus vitae, finibus in leo. Quisque sollicitudin, eros vestibulum condimentum suscipit, sem orci efficitur augue, non blandit magna risus vel quam. Praesent diam sem, gravida eget justo at, finibus posuere tortor. Vivamus facilisis eros at velit laoreet egestas.',
    dateTime: '9am - October 17, 2023',
    imgSrc: sample_img,
    tags: ['Fun', 'Philosophy', 'Freshman'],
    group: 'Engineering Society',
    creatorId: '1',
}

interface HomePageProps {
    user: User;
}

function HomePage(props: HomePageProps) {
    const cardHeights = ['100px', '200px', '300px', '400px', '300px', '200px', '400px', '500px', '100px', '200px'];
    const demoEvents = [demoEvent, demoEvent, demoEvent, demoEvent, demoEvent, demoEvent,
        demoEvent, demoEvent, demoEvent, demoEvent];

    const {height, width} = useWindowDimensions();
    const [events, setEvents] = useState<EventInfo[]>([]);
    const [displayedEvents, setDisplayedEvents] = useState<EventInfo[]>([]);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [overlayEvent, setOverlayEvent] = useState<EventInfo | void>();
    
    useEffect(() => {handleGetEvents();}, [])

    const handleToggleSaveEvent = async(eventId: string) => {
        // assume id is always correct
        const eventToUpdate = (events as EventInfo[]).find(event => event.id == eventId) as EventInfo;

        try {
            if (eventToUpdate.isSaved == 0) {
                const data = await saveEvent(eventId);
                console.log(data.message);
                eventToUpdate.isSaved = 1;
            }
            else {
                const data = await removeSavedEvent(eventId);
                console.log(data.message);
                eventToUpdate.isSaved = 0;
            }
            // how do I force a refresh?
            // sometimes the event does not update
        }
        catch(error) {
            setMessage('Failed to connect to the server.');
            setError(true);
        }
    }

    const handleGetEvents = async () => {      
        try { 
            let fetched_events: any;
            let response = await fetch ('/events', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            let data = await response.json();
            if (response.ok) {
                console.log(data.message);
                console.log(data.events);              
                fetched_events = data.events
            } else {
                setMessage(data.message || 'An error occurred. Please try again later.');
                setError(true);
            }

            let myEvents: EventInfo[] = fetched_events as EventInfo[];

            response = await fetch('/profile/are_saved_events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                },
                body: JSON.stringify(myEvents.map(event => event.id))
            });
            data = await response.json();
            if (response.ok) {
                console.log(data.message);

                let savedEvents = new Set<number>(data.saved_event_ids);
                for (var event of myEvents) {
                    event.isSaved = savedEvents.has(Number(event.id)) ? 1 : 0;
                }
            } else {
                setMessage(data.message || 'An error occurred. Please try again later.');
                setError(true);
            }

            setEvents(fetched_events);
            setDisplayedEvents(fetched_events);
        }
        catch(error) { 
            console.log(error);
            setMessage('Failed to connect to the server.');
            setError(true);
        }
    };

    const [showOverlay, setShowOverlay] = useState(false);

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
    

    return (
        <div>
            <Header username={props.user.username} title='UofTBuzz' imgSrc={props.user.imgSrc?props.user.imgSrc:''}/>
            {error && <Alert variant='light' color={'red'} title={'Error while getting events'} w='100%' icon={<IconExclamationCircle />}>{message}</Alert>}
            <Search eventList={events} setDisplayedEvents={setDisplayedEvents}/>
            <EventCardDisplay columns={Math.ceil(width/500)} heights={cardHeights} events={displayedEvents?displayedEvents: demoEvents} eventOnClick={handleShowOverlay} eventOnToggleSave={handleToggleSaveEvent}/>
            <Modal size='100vw' padding='4%' opened={showOverlay} onClose={handleCloseOverlay} withCloseButton={false} centered>
                <EventOverlay eventInfo={overlayEvent? overlayEvent: null} />
            </Modal>
        </div>
    )
}

export default HomePage;