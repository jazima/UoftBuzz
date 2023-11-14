import { Button, Flex, TextInput, Text, Textarea, Title, FileInput, Pill, useCombobox, PillsInput, CheckIcon, Combobox, Group, PasswordInput, Alert } from '@mantine/core'
import { IconExclamationCircle } from '@tabler/icons-react';
import React from 'react';
import {TagList} from '../types';
import { useNavigate } from 'react-router-dom';

interface AccountCreationProps {
}

export function AccountCreation(props: AccountCreationProps) {
    const [username, setUsername] = React.useState<string|null>(null);
    const [email, setEmail] = React.useState<string|null>(null);
    const [password, setPassword] = React.useState<string|null>(null);
    const [firstName, setFirstName] = React.useState<string|null>(null);
    const [lastName, setLastName] = React.useState<string|null>(null);
    const [description, setDescription] = React.useState<string|null>(null);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [error, setError] = React.useState('');
    const navigate = useNavigate();

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const [search, setSearch] = React.useState('');
    const [value, setValue] = React.useState<string[]>([]);

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
    const handleAccountCreation = async () => {
        try {
            const formData = new FormData();
            if(username) formData.append('username', username);
            if(email) formData.append('email', email);
            if(password) formData.append('password', password);
            if(firstName) formData.append('firstName', firstName);
            if(lastName) formData.append('lastName', lastName);
            if(description) formData.append('description', description);
            formData.append('tags', JSON.stringify(value));
            if (selectedFile) {
                formData.append(
                    "image",
                    selectedFile,
                    selectedFile.name
                );
            }
            const response = await fetch ('/register', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/');
            } else {
                setError(data.message || 'An error occurred during account creation.');
            }
        } catch (error) {
            setError('Failed to connect to the server.');
        }
    };


    return (
        <>
            <Flex mx='20em' direction='column'>
                <Title order={4} mt='5em'>Create a New Account</Title>
                <Flex direction='row' align='center' gap='4em' mt='3em'>
                    <Flex direction='column' h='100vh' gap='1em'>
                        <Flex justify='flex-start' direction='column'>
                            <Text>Username</Text>
                            <TextInput w='100%' mt='0.5em'
                                onChange={(e) => setUsername(e.currentTarget.value)} />
                            <Text mt='1em'>Email</Text>
                            <TextInput w='100%' mt='0.5em'
                                onChange={(e) => setEmail(e.currentTarget.value)} />
                            <Text mt='1em'>Password</Text>
                            <PasswordInput w='100%' mt='0.5em'
                                onChange={(e) => setPassword(e.currentTarget.value)} />
                            <Text mt='1em'>Name</Text>
                            <Flex direction='row' gap='0.5em'>
                                <TextInput placeholder='First Name' w='50%' mt='0.5em'
                                    onChange={(e) => setFirstName(e.currentTarget.value)} />
                                <TextInput placeholder='Last Name' w='50%' mt='0.5em'
                                    onChange={(e) => setLastName(e.currentTarget.value)} /></Flex>
                            <Text mt='1.5em'>Upload a Profile Picture</Text>
                            <FileInput accept='image/png,image/jpeg' description='Supports .png, .jpeg' mt='0.5em' w='100%' size='sm' onChange={setSelectedFile}></FileInput>

                        </Flex>
                    </Flex>
                    <Flex direction='column' h='100vh' gap='1em'>
                        <Flex justify='flex-start' direction='column'>
                            <Text>Add Biography</Text>
                            <Textarea mt='0.5em'
                                placeholder='Introduce yourself to the community!'
                                onChange={(e) => setDescription(e.currentTarget.value)}
                            />
                            <Text mt='1em'>Interests</Text>
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
                                <Button variant='filled' size='sm' w='100%' style={{ marginTop: 'auto' }}onClick={handleAccountCreation}>Create Account</Button>
                                {error.length !== 0 && <Alert variant='light' color='red' title='Error while logging in' w='100%' icon={<IconExclamationCircle />}>{error}</Alert>}
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}