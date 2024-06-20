import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";



const Login = () => {
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setIsError(false);
        const email = ev.target[0].value
        const password = ev.target[1].value
        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/')
        } catch(error) {
            setIsError(true);
        }
    }

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Yo-Chat</span>
                <span className="title">Login</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>                     
                    <button>Sign in</button>
                    {isError && <span>Something went wrong</span>}
                </form>
                <p>You don't have an account? <Link to='/register'>Register</Link></p>
            </div>
        </div>
    )
}
export default Login