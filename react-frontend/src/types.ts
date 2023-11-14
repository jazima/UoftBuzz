import sample_img from './sample_image.png';

export interface User {
    name: string;
    username: string;
    email: string;
    imgSrc?: string;
    description?: string;
    tags?: string[];
}

export const TagList = [
    {name:'Fun', colour: '#FAB005'},
    {name:'Philosophy', colour: '#A1D4FF'},
    {name:'Freshman', colour: '#FFA1B5'},
    {name:'Academic', colour: '#FFCBA1'},
    {name:'Arts', colour: '#A1FFD7'},
    {name:'Athletics', colour: '#D5A1FF'},
    {name:'Career', colour: '#FFA1A1'},
    {name:'Community', colour: '#A1FFA1'},
    {name:'Chess', colour: '#32c24a'},
    {name:'Cultural', colour: '#A1FFE3'},
    {name:'Dance', colour: '#A1D4FF'},
    {name:'Diversity', colour: '#FFA1B5'},
    {name:'Environmental', colour: '#FFCBA1'},
    {name:'Engineering', colour: '#211f8c'},
    {name:'Food', colour: '#A1FFD7'},
    {name:'Games', colour: '#eda445'},
    {name:'Health', colour: '#D5A1FF'},
    {name:'Lecture', colour: '#FFA1A1'},
    {name:'Music', colour: '#A1FFA1'},
    {name:'Networking', colour: '#A1FFE3'},
    {name:'Performance', colour: '#A1D4FF'},
    {name:'Religious', colour: '#FFA1B5'},
    {name:'Science', colour: '#FFCBA1'},
    {name:'Social', colour: '#A1FFD7'},
    {name:'Technology', colour: '#D5A1FF'},
    {name:'Theatre', colour: '#FFA1A1'},
    {name:'Tutor', colour: '#9350c7'},
    {name:'Volunteering', colour: '#A1FFA1'},
    {name:'Workshop', colour: '#A1FFE3'}
];

export const demoUser: User = {
    name: 'Bilal',
    username: 'Bilal123',
    email: 'bilal@email.com',
    tags: ['Fun', 'Philosophy', 'Freshman'],
    imgSrc: sample_img,
    description: 'I want to get out of my comfort zone to meet friends and try new things, but I have no clue where to start.',
};