import React, {useRef, useState} from 'react'
import { useForm } from "react-hook-form";
import firebase from '../../firebase';
import md5 from 'md5';

import "./styles.css";

function RegisterPage() {

    const { register, watch, errors, handleSubmit } = useForm();
    const [errorFromSubmit, setErrorFromSubmit] = useState("")
    const [loading, setLoading] = useState(false);

    const password = useRef();
    password.current = watch("password");

    const onSubmit = async (data) => {
        
        try {
            setLoading(true)
            let createdUser = await firebase
                .auth()
                .createUserWithEmailAndPassword(data.email, data.password)
            console.log('createdUser', createdUser)

            await createdUser.user.updateProfile({
                displayName: data.nickname,
                photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
            })

            //Firebase 데이터베이스에 저장해주기 
            await firebase.database().ref("users").child(createdUser.user.uid).set({
                nickname: createdUser.user.displayName,
                image: createdUser.user.photoURL
            })

            setLoading(false)
        } catch (error) {
            setErrorFromSubmit(error.message)
            setLoading(false)
            setTimeout(() => {
                setErrorFromSubmit("")
            }, 5000);
        }
        
    }

    return (
        <div className="auth-wrapper">
            <div style={{textAlign:'center', marginBottom:'20px'}}>
                <h3>회원가입</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    ref={register({ required: true, pattern: /^\S+@\S+$/i })}
                />
                {errors.email && <p>이메일 주소를 입력해주세요</p>}

                <label>NickName</label>
                <input
                    name="nickname"
                    ref={register({ required: true, maxLength: 10 })}
                />
                {errors.nickname && errors.nickname.type === "required" && <p>닉네임을 입력해주세요</p>}
                {errors.nickname && errors.nickname.type === "maxLength" && <p>닉네임을 최대 10글자로 입력해주세요</p>}

                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    ref={register({ required: true, minLength: 6 })}
                />
                {errors.password && errors.password.type === "required" && <p>비밀번호를 입력해주세요</p>}
                {errors.password && errors.password.type === "minLength" && <p>비밀번호는 최소 6자리로 입력해주세요</p>}

                <label>Password Confirm</label>
                <input
                    name="password_confirm"
                    type="password"
                    ref={register({ 
                        required: true, 
                        validate:(value) =>
                            value === password.current
                    })}
                />
                {errors.password_confirm && errors.password_confirm.type === "required" && <p>비밀번호를 확인해주세요</p>}
                {errors.password_confirm && errors.password_confirm.type === "validate" && <p>비밀번호가 일치하지 않습니다.</p>}

                {errorFromSubmit && <p>{errorFromSubmit}</p>}

                <input type="submit" value="submit" disabled={loading}/>
            </form>
        </div>
    )
}

export default RegisterPage
