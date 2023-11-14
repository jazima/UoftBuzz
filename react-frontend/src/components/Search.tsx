import { Flex, Button, Autocomplete, Container, MultiSelect } from '@mantine/core'
import {EventInfo} from '../pages/HomePage';
import { useState, useEffect } from 'react';

interface SearchProps {
    eventList: EventInfo[];
    setDisplayedEvents:  React.Dispatch<React.SetStateAction<EventInfo[]>>;
}

export function Search(props: SearchProps) {
    const [query, setQuery] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [queriedTags, setQueriedTags] = useState<string[]>([]);
    let eventTitles: string[] = [];
    let eventList = props.eventList;
    if (eventList) {
        for (let i = 0; i < eventList.length; i++) {
            eventTitles.push(eventList[i].title);
        }
        let eventTitlesSet = new Set(eventTitles);
        eventTitles = Array.from(eventTitlesSet);
    }
    
    function handleSearch() {
        if (eventList) {
            let newEventList: EventInfo[] = [];
            if (query == "" && queriedTags.length == 0) {
                newEventList = eventList;
                props.setDisplayedEvents(newEventList);
            } else if (query == "") {
                newEventList = eventList.filter(eventData => eventData.tags.filter(tag => queriedTags.includes(tag)).length > 0);
            } else if (queriedTags.length == 0 ) {
                newEventList = eventList.filter(eventData => eventData.title.includes(query));
            } else {
                let tempEventList = eventList.filter(eventData => eventData.title.includes(query));
                newEventList = tempEventList.filter(eventData => eventData.tags.filter(tag => queriedTags.includes(tag)).length > 0);
            }
            props.setDisplayedEvents(newEventList);
        } else {
            props.setDisplayedEvents(eventList);
        }
    }

    useEffect(() => {handleGetTags();}, [])

    const handleGetTags = async () => {
        try {
            const response = await fetch('/tags', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                console.log(data.tags);
                setTags(data.tags);
            } else {
                console.log('Failed to fetch tags.');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container display='inline-block' fluid style={{width: '100%'}}>
            <Flex gap={{ base: 'sm', sm: 'lg'}} justify='center' align='end' mt='1em'>
                <Autocomplete
                    placeholder="Search"
                    value={query}
                    onChange={setQuery}
                    data={eventTitles}
                    style={{width: '60%'}}
                    radius="lg"
                    maxDropdownHeight={100}
                />
                <MultiSelect 
                    placeholder="Filter by Tags"
                    data={tags}
                    value={queriedTags}
                    onChange={setQueriedTags}
                    style={{width: '30%'}}
                    radius="lg"
                    maxDropdownHeight={100}
                    searchable
                    nothingFoundMessage="No matching tags..."
                />
                <Button style={{width: '10%'}} onClick={handleSearch}>Search</Button>
            </Flex>
        </Container>
    );
};