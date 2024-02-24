import messageUser from "../model/messageUser.model";

const latestMessages: messageUser[] = [
    {
        profile: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png",
        username: "Madison Jones",
        message: "What time was our meet",
        date: "20m",
        status: "online",
    },
    {
        profile: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png",
        username: "userData.lastName",
        message: "What time was our meet",
        date: "20m",
        status: "",
    },
    {
        profile:
            "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%284%29+%281%29.png",
        username: "Madison Jones",
        message: "What time was our meet",
        date: "0s",
        status: "",
    },
];
const latestGroupMessages: messageUser[] = [
    {
        profile: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png",
        username: "Madison Jones",
        message: "What time was our meet",
        date: "20m",
        status: "online",
    },
    {
        profile:
            "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%284%29+%281%29.png",
        username: "Madison Jones",
        message: "What time was our meet",
        date: "0s",
        status: "",
    },
    {
        profile: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png",
        username: "userData.lastName",
        message: "What time was our meet",
        date: "20m",
        status: "",
    },
];
const messages = [
    [
        {
            type: 'sender',
            profile: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png",
            date: "Message seen 1.22pm",
            username: "Madison Jones",
            message: "Message 1 in conversation 1",
            img: 'https://media.wired.com/photos/598e35994ab8482c0d6946e0/master/w_1920,c_limit/phonepicutres-TA.jpg',
            createdAt: ''
        },
        {
            profile: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png",
            date: "Message seen 1.22pm",
            username: "Madison Jones",
            message: "Message 2 in conversation 1",
            img: ''
        },
        {
            profile: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png",
            date: "Message seen 1.22pm",
            username: "Madison Jones",
            message: "Message 1 in conversation 1",
            img: 'https://media.wired.com/photos/598e35994ab8482c0d6946e0/master/w_1920,c_limit/phonepicutres-TA.jpg'
        },
        {
            profile: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png",
            date: "Message seen 1.22pm",
            username: "Madison Jones",
            message: "Message 2 in conversation 1",
            img: ''
        },
        // Add more messages for conversation 1 if needed
    ],
    [
        {
            profile: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png",
            date: "Message seen 1.22pm",
            username: "Madison Jones",
            message: "Message 1 in conversation 2",
            img: ''
        },
        {
            profile: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png",
            date: "Message seen 1.22pm",
            username: "Madison Jones",
            message: "Message 2 in conversation 2",
            img: ''
        },
        // Add more messages for conversation 2 if needed
    ],
    [
        {
            profile: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png",
            date: "Message seen 1.22pm",
            username: "Madison Jones",
            message: "Message 1 in conversation 3",
            img: ''
        },
        {
            profile: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png",
            date: "Message seen 1.22pm",
            username: "Madison Jones",
            message: "Message 2 in conversation 3",
            img: ''
        },
        // Add more messages for conversation 2 if needed
    ],
    // Add more arrays for other conversations
];

export { latestMessages, latestGroupMessages, messages };