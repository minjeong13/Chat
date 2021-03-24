import React from 'react'
import {useSelector} from 'react-redux';

function MessageHeader() {

    const userTo = useSelector(state => state.chatRoom.currentChatRoom)

    return (
        <div style={{
            width:'100%',
            height:'94px',
            borderBottom: '1px solid #eee',
            borderRadius: '4px',
            padding: '1rem 1rem 0 1rem',
            marginBottom: '1rem'
        }}>
            <div className="userInfo">
                <h3 style={{float:'left', lineHeight:'60px'}}>{userTo && userTo.nickname}</h3>
            </div>
        </div>
    )
}

export default MessageHeader
