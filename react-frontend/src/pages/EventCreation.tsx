import { Button, Flex, TextInput, Text, Textarea, Title, FileInput, Pill, useCombobox, PillsInput, CheckIcon, Combobox, Group, Alert } from '@mantine/core'
import {DateInput, TimeInput} from '@mantine/dates';
import React from 'react';
import { IconExclamationCircle } from '@tabler/icons-react';
import {Header} from '../components/Header';
import {User, TagList} from '../types';

interface EventCreationProps {
    user: User;
}

export function EventCreation(props: EventCreationProps) {
    const [title, setTitle] = React.useState('');
    const [location, setLocation] = React.useState('');
    const [website, setWebsite] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [date, setDate] = React.useState<Date|null>(null);
    const startTimeRef = React.useRef<HTMLInputElement>(null);
    const endTimeRef = React.useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

    const [message, setMessage] = React.useState('');
    const [error, setError] = React.useState(false);

    const [search, setSearch] = React.useState('');
    const [value, setValue] = React.useState<string[]>([]);
    
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const handleValueSelect = (val: string) =>
        setValue((current) =>
            current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
        );

    const handleValueRemove = (val: string) =>
        setValue((current) => current.filter((v) => v !== val));

    const values = value.map((tag) => ( 
        <Pill key={tag} withRemoveButton onRemove={() => handleValueRemove(tag)}>
            {tag}
        </Pill>
    ));

    const options = TagList.map(tag => tag.name)
        .filter((tag) => tag.toLowerCase().includes(search.trim().toLowerCase()))
        .map((tag) => (
            <Combobox.Option value={tag} key={tag} active={value.includes(tag)}>
                <Group gap="sm">
                    {value.includes(tag) ? <CheckIcon size={12} /> : null}
                    <span>{tag}</span>
                </Group>
            </Combobox.Option>
        ));


    // function to handle account creation
    const handleEventCreation = async () => {
        try {
            setError(false);
            const formData = new FormData();
            if(title == '' || location == '' || date == null || (startTimeRef.current == null || Number.isNaN(startTimeRef.current?.valueAsNumber) || Number.isNaN(endTimeRef.current?.valueAsNumber)) 
                || (endTimeRef.current == null || Number.isNaN(startTimeRef.current?.valueAsNumber)) || description == '') {
                setMessage('Please fill in all the fields.');
                setError(true);
                return;
            }
            formData.append('title', title);
            formData.append('location', location);
            formData.append('date', date ? date.toISOString() : '');
            formData.append('startTime', startTimeRef.current ? startTimeRef.current.valueAsNumber.toString() : '');
            formData.append('endTime', endTimeRef.current ? endTimeRef.current.valueAsNumber.toString() : '');
            formData.append('description', description);
            if(value.length > 0){formData.append('tags', JSON.stringify(value))};
            if(website!=''){formData.append('website', website)};    
            console.log("create_event", title, location, date, startTimeRef.current ? startTimeRef.current.valueAsNumber.toString() : '', endTimeRef.current ? endTimeRef.current.valueAsNumber.toString() : '', description, value, website);
            if (selectedFile) {
                formData.append(
                    "image",
                    selectedFile,
                    selectedFile.name
                );
            }
            const response = await fetch ('/event', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message)
            } else {
                setMessage(data.message || 'An error occurred during account creation.');
                setError(true);
            }
        } catch (error) {
            setMessage('Failed to connect to the server.');
            setError(true);
        }
    };


    return (
        <>
            <Header username={props.user.username} imgSrc={props.user.imgSrc?props.user.imgSrc:''} title='Event Creation' />
            <Flex mx='20em' direction='column'>
                <Title order={4} mt='3em'>Create a New Event</Title>
                <Flex direction='row' align='center' gap='4em' mt='3em'>
                    <Flex direction='column' h='100vh' gap='1em' w='50%'>
                        <Flex justify='flex-start' direction='column'>
                            <Text>Title</Text>
                            <TextInput w='100%' mt='0.5em'
                                onChange={(e) => setTitle(e.currentTarget.value)} />
                            <Text mt='1em'>Location</Text>
                            <TextInput w='100%' mt='0.5em'
                                onChange={(e) => setLocation(e.currentTarget.value)} />
                            <Text mt='1em'>Website</Text>
                            <TextInput w='100%' mt='0.5em'
                                onChange={(e) => setWebsite(e.currentTarget.value)} />
                            <Text mt='1.5em'>Upload a Cover Image</Text>
                            <FileInput accept='image/png,image/jpeg' description='Supports .png, .jpeg' mt='0.5em' w='100%' size='sm' onChange={setSelectedFile}></FileInput>
                            <Text>Add Description</Text>
                            <Textarea mt='0.5em'
                                placeholder='Let everyone know about this event!!'
                                onChange={(e) => setDescription(e.currentTarget.value)}
                            />
                        </Flex>
                    </Flex>
                    <Flex direction='column' h='100vh' gap='1em'>
                        <Flex justify='flex-start' direction='column'>
                            <DateInput label='Date' placeholder='Select date' value={date} onChange={setDate} />
                            <TimeInput label='Start Time' placeholder='Select time' ref={startTimeRef} />
                            <TimeInput label='End Time' placeholder='Select time' ref={endTimeRef} />
                            <Text mt='1em'>Tags</Text>
                            <Flex gap='1em' wrap='wrap' maw='20em' mt='0.5em'>
                                <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
                                    <Combobox.DropdownTarget>
                                        <PillsInput onClick={() => combobox.openDropdown()}>
                                            <Pill.Group>
                                                {values}

                                                <Combobox.EventsTarget>
                                                    <PillsInput.Field
                                                        onFocus={() => combobox.openDropdown()}
                                                        onBlur={() => combobox.closeDropdown()}
                                                        value={search}
                                                        placeholder="Search tags"
                                                        onChange={(event) => {
                                                            combobox.updateSelectedOptionIndex();
                                                            setSearch(event.currentTarget.value);
                                                        }}
                                                        onKeyDown={(event) => {
                                                            if (event.key === 'Backspace' && search.length === 0) {
                                                                event.preventDefault();
                                                                handleValueRemove(value[value.length - 1]);
                                                            }
                                                        }}
                                                    />
                                                </Combobox.EventsTarget>
                                            </Pill.Group>
                                        </PillsInput>
                                    </Combobox.DropdownTarget>
                                    <Combobox.Dropdown>
                                        <Combobox.Options mah={200} style={{ overflowY: 'auto' }}>
                                            {options}
                                        </Combobox.Options>
                                    </Combobox.Dropdown>
                                </Combobox>
                                <Button variant='filled' size='sm' w='100%' style={{ marginTop: 'auto' }}onClick={handleEventCreation}>Create Event</Button>
                                {message.length !== 0 && <Alert variant='light' color={error? 'red': 'green'} title={error?'Error while creating event': ''} w='100%' icon={<IconExclamationCircle />}>{message}</Alert>}
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}