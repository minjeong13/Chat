import React, {useRef} from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useDispatch, useSelector} from 'react-redux';
import firebase from '../../../firebase';
import mime from 'mime-types';
import {setPhotoURL} from '../../../redux/actions/user_action';


function UserPanel() {
    const user = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch();

    const inputOpenImageRef = useRef();
    
    const handleLogout = () => {
        firebase.auth().signOut();
    }

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click();
    }

    const handleUploadImage = async (event) => {
        const file = event.target.files[0];

        const metadata = {contentType: mime.lookup(file.name)};

        //스토리지에 파일 저장하기
        try {
            let uploadTaskSnapshot = await firebase.storage().ref()
            .child(`user_image/${user.uid}`)
            .put(file, metadata)
        
        let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();

        console.log('downloadURL', downloadURL);
        
        //프로필 이미지 수정
        await firebase.auth().currentUser.updateProfile({
            photoURL: downloadURL
        })

        dispatch(setPhotoURL(downloadURL))
        

        //데이터베이스 프사 수정
        await firebase.database().ref("users")
                .child(user.uid)
                .update({image:downloadURL})
        
        console.log('uploadTaskSnapshot', uploadTaskSnapshot)
        } catch (error) {
            alert(error)
        }
    }

    return (
        <div>
            <h4>
                 Direct Message
            </h4>
            <div style={{display:'flex', marginTop:'2rem', marginBottom:'1rem', borderTop:'1px solid #eee', borderBottom:'1px solid #eee', padding:'20px 0'}}>
            <Image src={user && user.photoURL} style={{width:'50px', height:'50px', marginTop:'3px'}} roundedCircle/>
            <h5 style={{marginTop:'18px', marginLeft:'20px'}}>{user && user.displayName}</h5>
            <Dropdown>
            <Dropdown.Toggle
            style={{background:'transparent', border:'0px', minWidth:'100px', marginTop:'10px'}} 
            id="dropdown-basic">
                {user && user.displayName}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={handleOpenImageRef}>프사변경</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
            </div>

            <input 
                onChange={handleUploadImage}
                accept="image/jpeg, image/png" 
                style={{display:'none'}} 
                type="file" 
                ref={inputOpenImageRef}/>
        </div>
    )
}

export default UserPanel