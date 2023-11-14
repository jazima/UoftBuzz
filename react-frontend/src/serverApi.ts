export async function getEventInfo(eventId:number){
    const response = await fetch(`/event/${eventId}`);
    const json_response = await response.json();
    return json_response;
}

export async function getAllTags(){
    const response = await fetch(`/tags`);
    const json_response = await response.json();
    return json_response;
}

export async function getUserInfo(userId:number){
    const response = await fetch(`/user/${userId}`);
    const json_response = await response.json();
    return json_response;
}

export async function getGroupInfo(groupId:number){
    const response = await fetch(`/group/${groupId}`);
    const json_response = await response.json();
    return json_response;
}

export async function updateEventInfo(eventId:number, data:{}){
    const response = await fetch(`/event_post/${eventId}`,
    {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    );
    const json_response = await response.json();
    return json_response;
}

export async function updateUserInfo(userId:number, data:{}){
    const response = await fetch(`/user_post/${userId}`,
    {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    );
    const json_response = await response.json();
    return json_response;
}

export async function updateGroupInfo(groupId:number, data:{}){
    const response = await fetch(`/group_post/${groupId}`,
    {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    );
    const json_response = await response.json();
    return json_response;
}

export async function getSavedEvents() {
    const response = await fetch ('/profile/saved_events', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        },
    });
    const data = await response.json();
    return data;
}

export async function saveEvent(eventId: string) {
    const response = await fetch ('/profile/save_event/' + eventId, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        }
    }); 
    const data = await response.json();
    return data;
}

export async function removeSavedEvent(eventId: string) {
    const response = await fetch ('/profile/remove_saved_event/' + eventId, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        }
    }); 
    const data = await response.json();
    return data;
};

export async function getUserCreatedEvents() {
    const userID = localStorage.getItem('userID');
    const response = await fetch ('/profile/' + String(userID) +'/events', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
}
