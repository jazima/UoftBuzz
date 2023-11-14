import { useState, useEffect } from 'react';
import {getEventInfo} from '../serverApi';
import sample_img from '../sample_image.png';
import {EventInfo} from '../pages/HomePage';
import {Paper, Button, Title, Text, ActionIcon} from '@mantine/core'
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';

interface EventCardProps{
    eventInfo: EventInfo;
    onToggleSave: (id: string) => void;
    onClick: (id: string) => void;
}

function EventCard(props: EventCardProps)
{
    const [isSaved, setIsSaved] = useState(props.eventInfo.isSaved);

    function handleOnClick(){
        props.onClick(props.eventInfo.id);
    }
    function handleToggleSaveEvent(e: React.MouseEvent) {
        e.stopPropagation();
        props.onToggleSave(props.eventInfo.id);
        setIsSaved(isSaved == 1? 0: 1);
    }
    return(
        <Paper radius='sm' shadow='sm' p='sm' fz='sm' bg='white' c='black' onClick={handleOnClick} style={{cursor: 'pointer'}}>
            {props.eventInfo.imgSrc ? <img src={props.eventInfo.imgSrc} alt="This is some alt" style={{ width: '100%'}} />: null}
            <Title order={6} fs='italic' mt='0.5rem'>{props.eventInfo.title}</Title>
            <Text fz='0.8rem' mt='0.5rem'>{props.eventInfo.group}</Text>
            <Text fz='0.8rem'>{props.eventInfo.dateTime}</Text>
            { props.eventInfo.isSaved != undefined ?
            <ActionIcon variant='filled' aria-label="Favorite" ml='auto' onClick={handleToggleSaveEvent}>
                {isSaved == 1 ? <IconHeartFilled size='1.4em' stroke={1.5} /> : <IconHeart size='1.4em' stroke={1.5} /> }
            </ActionIcon> : null}
        </Paper>
    )
}

interface EventCardDemoProps{
    eventInfo: EventInfo;
    height: string;
    onClick: (id: string) => void;
    onToggleSave: (id: string) => void;
}

export function EventCardDemo(props: EventCardDemoProps){
    function handleOnClick(){
        props.onClick(props.eventInfo.id);
    }
    function handleToggleSaveEvent() {
        props.onToggleSave(props.eventInfo.id);
    }

    return(
        <Paper radius='sm' shadow='sm' p='sm' fz='sm' bg='white' c='black' onClick={handleOnClick} style={{cursor: 'pointer'}}>
            {props.eventInfo.imgSrc ? <img src={props.eventInfo.imgSrc} alt="This is some alt" style={{ width: '100%', height:props.height}} />: null}
            <Title order={6} fs='italic' mt='0.5rem'>{props.eventInfo.title}</Title>
            <Text fz='0.8rem' mt='0.5rem' >{props.eventInfo.group}</Text>
            <Text fz='0.8rem'>{props.eventInfo.dateTime}</Text>
            { props.eventInfo.isSaved != undefined ?
            <ActionIcon variant='filled' aria-label="Favorite" ml='auto' onClick={handleToggleSaveEvent}>
                {props.eventInfo.isSaved == 1 ? <IconHeartFilled size='1.4em' stroke={1.5} /> : <IconHeart size='1.4em' stroke={1.5} /> }
            </ActionIcon> : null}
        </Paper>
    )
}

export default EventCard;
