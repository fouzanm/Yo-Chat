import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import Add from "../img/addAvatar.png"
import { auth , db, storage} from "../firebase";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {

    const [isError, setIsError] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setIsError(false)
        const displayName = ev.target[0].value
        const email = ev.target[1].value
        const password = ev.target[2].value
        const file = ev.target[3].files[0]
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)
            const storageRef = ref(storage, displayName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed', 
                () => {}, 
                (error) => {
                    console.log(error)
                    setIsError(true)
                }, 
                async () => {
                    const downloadURL = file ? await getDownloadURL(uploadTask.snapshot.ref) : null
                    await updateProfile(res.user, {
                        displayName,
                        photoURL:downloadURL
                    });
                    await setDoc(doc(db, "users", res.user.uid), {
                        uid: res.user.uid,
                        displayName,
                        email,
                        photoURL: downloadURL
                    });
                    await setDoc(doc(db, "userChats", res.user.uid), {});
                    navigate('/');
                }
            );
        } catch(error) {
            setIsError(true)
        }
    }
    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Yo-Chat</span>
                <span className="title">Register</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Display Name"/>
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <input style={{display: "none"}} type="file" id="fileRegister"/>
                    <label htmlFor="fileRegister">
                        <img src={Add}/>
                        <span>Add an avatar</span>
                    </label>
                    <button>Sign up</button>
                    {isError && <span>Something went wrong</span>}
                </form>
                <p>You do have an account? <Link to='/login'>Login</Link></p>
            </div>
        </div>
    )
}
export default Register