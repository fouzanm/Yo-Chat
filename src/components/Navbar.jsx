import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import Default from '../img/addAvatar.png'

const Navbar = () => {
    const {currentUser} = useContext(AuthContext)
    return (
        <div className="navbar">
            <span className="logo">Yo-Chat</span>
            <div className="user">
                <img src={currentUser.photoURL ?? Default} alt="" />
                <span>{currentUser.displayName}</span>
                <button onClick={() => signOut(auth)}>Logout</button>
            </div>
        </div>
    )
}
export default Navbar