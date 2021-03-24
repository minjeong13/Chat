import React, { Component } from 'react'
import { BsPersonPlusFill } from "react-icons/bs";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import firebase from '../../../firebase';
import { setCurrentChatRoom } from '../../../redux/actions/chatRoom_action';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { AiOutlineSearch } from 'react-icons/ai';

export class ChatRooms extends Component {

    state = {
        show: false,
        nickname:"",
        chatRoomsRef: firebase.database().ref("chatRooms"),
        chatRooms: [],
        firstLoad: true,
        activeChatRoomId:"",
        searchTerm:"",
        searchResults:[],
        searchLoading: false
    }

    componentDidMount() {
        this.AddChatRoomsListeners();
    }

    componentWillUnmount() {
        this.state.chatRooms.off();
    }

    setFirstChatRoom = () => {
        const firstChatRoom = this.state.chatRooms[0]
        if(this.state.firstLoad && this.state.chatRooms.length > 0){
            this.props.dispatch(setCurrentChatRoom(firstChatRoom))
            this.setState({activeChatRoomId: firstChatRoom.id})
        }
        this.setState({firstLoad: false})
    }

    AddChatRoomsListeners = () => {
        let chatRoomsArray = [];
        this.state.chatRoomsRef.on("child_added", DataSnapshot => {
            chatRoomsArray.push(DataSnapshot.val());
            this.setState({chatRooms: chatRoomsArray}, 
                () => this.setFirstChatRoom());
        })
    }

    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });

    handleSubmit = (e) => {
        e.preventDefault();

        const {nickname} = this.state;

        this.addChatRoom();

    }

    addChatRoom = async() => {
        
        const key = this.state.chatRoomsRef.push().key;
        const {nickname} = this.state;
        const {user} = this.props
        const newChatRoom = {
            id: key,
            nickname : nickname,
            createdBy:{
                nickname:user.displayName,
                image:user.photoURL
            }
        }
        try {
            await this.state.chatRoomsRef.child(key).update(newChatRoom)
            this.setState({
                nickname:"",
                show:false
            })
        } catch (error) {
            alert(error)
        }
    }

    isFormValid = (nickname) =>
        nickname

        changeChatRoom = (room) => {
            this.props.dispatch(setCurrentChatRoom(room))
            this.setState({activeChatRoomId: room.id})
        }

        renderChatRooms = (chatRooms) =>
        chatRooms.length > 0 &&
        chatRooms.map(room => (
            <li 
                key={room.id}
                style={{backgroundColor: room.id === this.state.activeChatRoomId && "#eee",
                margin:"10px 0",
                height:"50px",
                lineHeight:"50px",
                padding:"0 10px"}}
                onClick={() => this.changeChatRoom(room)}
            >
                # {room.nickname}
            </li>
        ))

    render() {
        return (
            <div>
                <div style={{
                    position: 'relative', width: '100%',
                    display: 'flex', alignItems: 'center'
                }}>
                    <h5 style={{paddingTop:'5px'}}>DIRECT MESSAGE</h5>
                    <BsPersonPlusFill style={{ marginLeft:'30px', fontSize:'1.6rem', cursor:'pointer'}} onClick={this.handleShow}/>
                </div>

                <ul style={{listStyle:'none', padding:0}}>
                    {this.renderChatRooms(this.state.chatRooms)}
                </ul>

                {/* modal */}
                <Modal show={this.state.show} onHide={this.handleClose} handleSearchChange={this.handleSearchChange}>
                    <Modal.Header closeButton>
                        <Modal.Title>친구 찾기</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>검색 결과</Form.Label>
                                <Form.Control onChange={(e)=>this.setState({ nickname: e.target.value})} 
                                                type="text" placeholder="DM 보낼 닉네임을 입력해주세요" />
                            </Form.Group>
                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            취소
                    </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            확인
                    </Button>
                    </Modal.Footer>
                </Modal>
                {/* modal */}

            </div>
        )
    }
}

const mapStateToProps =  state => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(ChatRooms)
