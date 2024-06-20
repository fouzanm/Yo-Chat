import { useContext, useEffect, useRef } from "react"
import { AuthContext } from "../context/AuthContext"
import { ChatContext } from "../context/ChatContext";
import Default from '../img/addAvatar.png'

const Message = ({message}) => {
    const {currentUser} = useContext(AuthContext);
    const {data} = useContext(ChatContext);
    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({behavior: 'smooth'})
    }, [message])
    
    return (
        <div ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
            <div className="messageInfo">
                <img src={(message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL) ?? Default} alt="" />
                <span>just now</span>
            </div>
            <div className="messageContent">
                {message.text && <p>{message.text}</p>}
                {message.imageURL && <img src={message.imageURL} alt="" />}
            </div>
        </div>
    )
}
export default Message