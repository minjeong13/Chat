import React from 'react'
import SidePanel from './SidePanel/SidePanel';
import MainPanel from './MainPanel/MainPanel';
import "./ChatCSS/Chat.css";
import {useSelector} from 'react-redux';

function ChatPage() {

    const currentChatRoom = useSelector(state => state.chatRoom.currentChatRoom)

    return (
        <div className="ChatAppBox">
            <div className="sidePanel">
                <SidePanel/>
            </div>
            <div className="mainPanel">
                <MainPanel key={currentChatRoom && currentChatRoom.id}/>
            </div>
        </div>
    )
}

export default ChatPage
