import React from 'react'
import Media from 'react-bootstrap/Media';
import moment from 'moment'
function Message({message, user}) {

    const timeFromNow = timestamp => moment(timestamp).fromNow();

    const isImage = message => {
        return message.hasOwnProperty("image") && !message.hasOwnProperty("content")
    }

    const isMessageMine = (message,user)=>{
        return message.user.id === user.uid
    }

    return (
        <Media style={{marginBottom:'15px'}}>
            <img
                style={{borderRadius:'30px', float:'right'}}
                width={64}
                height={64}
                className="mr-3"
                src={message.user.image}
                alt={message.user.nickname}
            />
            <Media.Body style={{
                    backgroundColor: isMessageMine(message,user) && "#f9f9f9", float:'left'
                }}>
                <h6 style={{margin:'10px'}}>
                    {message.user.nickname}
                    <span style={{fontSize:'10px', color:'slategray', marginLeft:'8px'}}>
                        {timeFromNow(message.timestamp)}
                    </span>
                </h6>
                {isImage(message)?
                    <img style={{maxWidth:'300px'}} alt="이미지" src={message.image}/> :
                    <p style={{margin:'10px'}}>
                        {message.content}
                    </p>
                }
            </Media.Body>
        </Media>
    )
}

export default Message
