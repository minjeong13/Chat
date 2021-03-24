import React, { Component } from 'react'
import firebase from '../../../firebase';
import { connect } from 'react-redux';
import {
    setCurrentChatRoom, setPrivateChatRoom
} from '../../../redux/actions/chatRoom_action';
export class DirectMessages extends Component {

    state = {
        usersRef: firebase.database().ref("users"),
        users: [],
        activeChatRoom: ""
    }

    componentDidMount() {
        if (this.props.user) {
            this.addUsersListeners(this.props.user.uid)
        }
    }

    addUsersListeners = (currentUserId) => {
        const { usersRef } = this.state;
        let usersArray = [];
        usersRef.on("child_added", DataSnapshot => {
            if (currentUserId !== DataSnapshot.key) {
                let user = DataSnapshot.val();
                user["uid"] = DataSnapshot.key;
                user["status"] = "offline";
                usersArray.push(user)
                this.setState({ users: usersArray })
            }
        })
    }

    getChatRoomId = (userId) => {
        const currentUserId = this.props.user.uid

        return userId > currentUserId
            ? `${userId}/${currentUserId}`
            : `${currentUserId}/${userId}`
    }

    changeChatRoom = (user) => {
        const chatRoomId = this.getChatRoomId(user.uid);
        const chatRoomData = {
            id: chatRoomId,
            nickname: user.nickname
        }

        this.props.dispatch(setCurrentChatRoom(chatRoomData));
        this.props.dispatch(setPrivateChatRoom(true));
        this.setActiveChatRoom(user.uid);
    }

    setActiveChatRoom = (userId) => {
        this.setState({ activeChatRoom: userId })
    }


    renderDirectMessages = users =>
        users.length > 0 &&
        users.map(user => (
            <li key={user.uid}
                style={{
                    backgroundColor: user.uid === this.state.activeChatRoom
                        && "#eee",
                    margin:"10px 0",
                    height:"50px",
                    lineHeight:"50px",
                    padding:"0 10px"
                }}
                onClick={() => this.changeChatRoom(user)}>
                # {user.nickname}
            </li>
        ))

    render() {
        const { users } = this.state;
        return (
            <div>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <h5>DIRECT MESSAGES(1)</h5>
                </span>

                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {this.renderDirectMessages(users)}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(DirectMessages);
