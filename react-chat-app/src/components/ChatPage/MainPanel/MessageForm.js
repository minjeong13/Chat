import React, { useState, useRef } from 'react'
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import firebase from '../../../firebase';
import { useSelector } from 'react-redux';
import mime from 'mime-types';

function MessageForm() {
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const user = useSelector(state => state.user.currentUser)
    const [content, setContent] = useState("")
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)
    const messagesRef = firebase.database().ref("messages")
    const inputOpenImageRef=useRef();
    const storageRef = firebase.storage().ref();
    const [percentage, setPercentage] = useState(0);
    const typingRef = firebase.database().ref("typing");

    const handleChange = (event) => {
        setContent(event.target.value)
    }

    const createMessage = (fileUrl = null) => {
        const message = {
            timestamp : firebase.database.ServerValue.TIMESTAMP,
            user:{
                id: user.uid,
                nickname: user.displayName,
                image: user.photoURL
            }
        }

        if(fileUrl != null){
            message["image"] = fileUrl;
        }else{
            message["content"] = content;
        }

        return message;

    }

    const handleSubmit = async () => {
        if(!content){
            setErrors(prev => prev.concat("내용을 입력해주세요"))
            return;
        }
        setLoading(true);

        //firebase에 메세지 저장
        try {
            await messagesRef.child(chatRoom.id).push().set(createMessage())
            setLoading(false)
            setContent("")
            setErrors([])
        } catch (error) {
            setErrors(pre => pre.concat(error.message))
            setLoading(false)
            setTimeout(() => {
                setErrors([])
            }, 5000);
        }
    }

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click();
    }

    const handleUploadImage = (event) => {
        const file = event.target.files[0];

        const filePath = `/message/public/${file.name}`;
        const metadata = { contentType: mime.lookup(file.name)}
        setLoading(true)

        try {
            //파일을 먼저 스토리지에 저장
            let uploadTask = storageRef.child(filePath).put(file, metadata)

            //파일 저장되는 퍼센티지 구하기
            uploadTask.on("state_changed", UploadTaskSnapshot => {
                const percentage = Math.round(
                    (UploadTaskSnapshot.bytesTransferred / UploadTaskSnapshot.totalBytes)*100
                )
                setPercentage(percentage)
            },
                err => {
                    console.error(err);
                    setLoading(false)
                },
                () => {
                    //저장이 다 된 후에 파일 메세지 전송 (데이터베이스에 저장)
                    //저장된 파일을 다운로드받을 수 있는 url 가져오기
                    uploadTask.snapshot.ref.getDownloadURL()
                        .then(downloadURL => {
                            messagesRef.child(chatRoom.id).push().set(createMessage(downloadURL))
                            setLoading(false)
                        })
                }
            )
        } catch (error) {
            alert(error)
        }
    }

    const handleKeyDown = (event) => {

        if (event.ctrlKey && event.keyCode === 13) {
            handleSubmit();
        }

        if (content) {
            typingRef.child(chatRoom.id).child(user.uid).set(user.displayName)
        } else {
            typingRef.child(chatRoom.id).child(user.uid).remove();
        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea"
                                onKeyDown={handleKeyDown}
                                value={content} 
                                onChange={handleChange}
                                rows={3} />
                </Form.Group>
            </Form>

            {
                !(percentage === 0 || percentage === 100) &&
                <ProgressBar variant="warning" label={`${percentage}%`} now={percentage} />
            }

            <div>
                {errors.map(errorMsg => <p style={{color:'#E62821'}} key={errorMsg}>
                    {errorMsg}
                </p> )}
            </div>
            <Row>
                <Col>
                    <button className="message-form-button"
                            onClick={handleSubmit}
                            style={{width:'100%'}}
                            disabled={loading ? true : false}>
                                보내기
                    </button>
                </Col>
                <Col>
                    <button onClick={handleOpenImageRef}
                            className="message-form-button"
                            style={{width:'100%'}}
                            disabled={loading ? true : false}>
                                업로드
                    </button>
                </Col>
            </Row>

            <input type="file"
                    style={{display:'none'}}
                    ref={inputOpenImageRef}
                    onChange={handleUploadImage}
                    accept="image/jpeg, image/png"
            />
        </div>
    )
}

export default MessageForm