import EventCard, { EventCardDemo } from './EventCard';
import sample_img from '../sample_image.png';
import {EventInfo} from '../pages/HomePage';
import {Flex, Box} from '@mantine/core'
import { on } from 'events';

interface EventCardDisplayProps{
    eventOnClick: (id: string) => void;
    eventOnToggleSave: (id: string) => void;
    columns: number;
    events: EventInfo[];
    heights: string[];
}

function EventCardDisplay(props: EventCardDisplayProps){
    const columns: number[][] = [];

    for(let i = 0; i < props.columns; i++){
        const subarray: number[] = [];
        const length = props.events.length > 40? 40: props.events.length;
        for(let j = 0; j*props.columns + i < length; j++){
            subarray.push(j*props.columns + i);
        }
        columns.push(subarray);
    }

    return(
        <Flex ml='5vw' mr='5vw' direction='row' justify='space-between'>
            {columns.map((column, index) => (
                <Box key={index} w={`${100/props.columns}%`} p='1rem'>
                    {column.map((eventIndex, index) => (
                        <Box key={index} w='100%' mb='5%'>
                            <EventCard 
                                eventInfo={props.events[eventIndex]} 
                                onClick={props.eventOnClick} 
                                onToggleSave={props.eventOnToggleSave}/>
                        </Box>
                    ))}
                </Box>
            ))}
        </Flex>
    )
}

export default EventCardDisplay;
