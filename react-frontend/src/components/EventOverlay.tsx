import {useEffect, useState} from 'react';
import { Box, Button, ScrollArea, Flex, Stack, Pill, Title, Text, Badge, Anchor } from '@mantine/core';
import {EventInfo} from '../pages/HomePage';
import '../App.css';
import { TagList } from '../types';

interface EventOverlayProps {
    eventInfo: null | EventInfo;
}

function EventOverlay(props: EventOverlayProps) {
    const [windowTop, setWindowTop] = useState("0px");

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        setWindowTop(`${window.scrollY}px`)
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
  
    return (
        <>
        {props.eventInfo &&
        <Flex direction='row' align='center' justify={'left'} bg='white' h='74vh'>
            {props.eventInfo.imgSrc && <img src={props.eventInfo.imgSrc} alt="This is some alt" style={{ width: '50%'}} />}
            <ScrollArea pl='2%' w='50%' h='100%'>
                <Stack pl='sm' align='flex-start' justify='flex-start'>
                    <Title order={3}>{props.eventInfo.title}</Title>
                    <Text fs='italic'>{props.eventInfo.group}</Text>
                    <Text>{props.eventInfo.dateTime}</Text>
                    <Text>Location: {props.eventInfo.location}</Text>
                    <Anchor href={props.eventInfo.website}>{props.eventInfo.website}</Anchor>
                    <Flex gap='1em' wrap='wrap' mt='1em'>
                        {props.eventInfo.tags.map((tagName, index) => {
                            const tagInfo = TagList.find(tag => tag.name === tagName);
                            const colour = tagInfo ? tagInfo.colour : 'white';
                            return(
                            <Badge key={index} style={{ backgroundColor: colour}}>
                                {tagName}
                            </Badge>
                            )
                    })}
                    </Flex>
                    <Text mt='2em'>{props.eventInfo.description}</Text>
                </Stack>
            </ScrollArea>
        </Flex>
        }
        </>
    );
  }

export default EventOverlay;
