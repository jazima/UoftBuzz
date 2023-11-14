import { Flex, Text, Box, Menu, Button } from '@mantine/core'
import { IconMenu2, IconUserCircle, IconBookmarks, IconHistory, IconHome, IconCalendarEvent, IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import default_pfp from '../images/default_profile_picture.png'

interface HeaderProps {
    username: string;
    title: string;
    imgSrc: string;
    }

export function Header(props: HeaderProps) {
const navigate = useNavigate();
    return (
        <Box w='100%' style={{ borderBottom: '2px solid #f9ba1c' }}>
            <Flex h='3em' w='100%' gap='xl' px='1em' align='center' bg='#ffe652'>
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <IconMenu2 color="#ff8601" style={{ cursor: 'pointer' }} />
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Application</Menu.Label>
                        <Menu.Item leftSection={<IconHome size='1.5em' />} onClick={()=>navigate('/home')}>
                            Home
                        </Menu.Item>
                        <Menu.Item leftSection={<IconUserCircle size='1.5em' />} onClick={()=>navigate('/userprofile')}>
                            My Profile
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Label>Events</Menu.Label>
                        <Menu.Item leftSection={<IconCalendarEvent size='1.5em' />} onClick={()=>navigate('/myevents')}>
                            My Events
                        </Menu.Item>
                        <Menu.Item leftSection={<IconBookmarks size='1.5em' />} onClick={()=>navigate('/savedevents')}>
                            Saved Events
                        </Menu.Item>
                        <Menu.Item leftSection={<IconHistory size='1.5em' />} onClick={()=>navigate('/pastevents')}>
                            Past Events
                        </Menu.Item>
                        <Button mt='1em' w='100%' onClick={()=>navigate('/createevent')}
                            leftSection={<IconPlus size='1.5em' />}>Create Event</Button>
                    </Menu.Dropdown>
                </Menu>

                <Text fw={700}>{props.title}</Text>
                <Flex align='center' gap='0.8em' ml='auto' onClick={()=>navigate('/userprofile')} style={{ cursor: 'pointer' }}>
                    <img src={props.imgSrc? props.imgSrc : default_pfp} alt='User Profile' style={{ height: '2em', width: '2em', borderRadius: '50%', objectFit: 'cover' }} />
                    <Text fs="italic">{props.username}</Text>
                </Flex>
            </Flex>
        </Box>
    )
}
