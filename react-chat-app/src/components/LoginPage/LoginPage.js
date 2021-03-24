import React, {useState} from 'react'
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import firebase from '../../firebase';


import "./styles.css";

function LoginPage() {

    const { register, errors, handleSubmit } = useForm();
    const [errorFromSubmit, setErrorFromSubmit] = useState("")
    const [loading, setLoading] = useState(false);


    const onSubmit = async (data) => {
        
        try {
            setLoading(true)

            await firebase.auth().signInWithEmailAndPassword(data.email, data.password)

            setLoading(true)
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
                <h3>로그인</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    ref={register({ required: true, pattern: /^\S+@\S+$/i })}
                />
                {errors.email && <p>이메일 주소를 입력해주세요</p>}

                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    ref={register({ required: true, minLength: 6 })}
                />
                {errors.password && errors.password.type === "required" && <p>비밀번호를 입력해주세요</p>}
                {errors.password && errors.password.type === "minLength" && <p>비밀번호는 최소 6자리로 입력해주세요</p>}

                {errorFromSubmit && <p>{errorFromSubmit}</p>}

                <input type="submit" value="submit" disabled={loading}/>
                <Link style={{color:'gray', textDecoration:'none'}} to="./register">회원가입하기 &gt;</Link>
            </form>
        </div>
    )
}

export default LoginPage
