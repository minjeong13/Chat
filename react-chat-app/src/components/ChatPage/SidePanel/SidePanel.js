import React from 'react';
import UserPanel from './UserPanel';
// import DirectMessage from './DirectMessage';
import ChatRooms from './ChatRooms';

function SidePanel() {
    return (
        <div style={{padding:'2rem', minHeight:'100vh', minWidth:'275px',borderRight:'1px solid #eee'}}>
            <UserPanel/>
            <ChatRooms/>
            {/* <DirectMessage/> */}
        </div>
    )
}

export default SidePanel
