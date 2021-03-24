import React, { Component } from 'react'
import MessageHeader from './MessageHeader';
import Message from './Message';
import MessageForm from './MessageForm';
import { connect } from 'react-redux';
import firebase from '../../../firebase';

export class MainPanel extends Component {

    messageEndRef = React.createRef();

    state = {
        messages: [],
        messagesRef: firebase.database().ref("messages"),
        messagesLoading: true
    }

    componentDidMount() {
        const{ chatRoom } = this.props;
        if(chatRoom){
            this.addMessagesListeners(chatRoom.id)
        }
    }

    componentDidUpdate() {
        if(this.messageEndRef){
            this.messageEndRef.scrollIntoView({behavior:"smooth"})
        }
    }        

    addMessagesListeners = (chatRoomId) => {
        let messagesArray = [];
        this.state.messagesRef.child(chatRoomId).on("child_added", DataSnapshot => {
            messagesArray.push(DataSnapshot.val());
            this.setState({messages : messagesArray, messagesLoading: false})
        })
    }

    renderMessages = (messages) =>
        messages.length > 0 &&
        messages.map (message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.props.user}
            />
        ))

    render() {

        const {messages} = this.state;

        return (
            <div style={{ margin:"0 2rem"  }}>

                <MessageHeader />

                <div style={{
                    width:'100%', 
                    height:'450px', 
                    border:'1px solid #eee', 
                    borderRadius: '4px', 
                    padding:'1rem', 
                    marginBottom:'1rem', 
                    overflowY: 'auto'
                }}>
                    {this.renderMessages(messages)}
                    <div ref={node => (this.messageEndRef = node)}/>

                </div>

                <MessageForm />

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser,
        chatRoom:state.chatRoom.currentChatRoom
    }
}

export default connect(mapStateToProps)(MainPanel) 

