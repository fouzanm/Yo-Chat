import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react"
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import Default from '../img/addAvatar.png'
import { ChatContext } from "../context/ChatContext";

const Chats = () => {

    const [chats, setChats] = useState([]);
    const {currentUser} = useContext(AuthContext);
    const {dispatch} = useContext(ChatContext);

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
                setChats(doc.data())
            });
            return () => {
                unsub();
            }
        } 
        currentUser.uid && getChats();       
    }, [currentUser.uid]);

    const handleSelect = (user) => {
        dispatch({type: 'CHANGE_USER', payload: user})
    }

    return (
        <div className="chats">
            {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
                <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
                    <img src={chat[1].userInfo.photoURL ? chat[1].userInfo.photoURL : Default } alt='' />
                    <div className="userChatInfo">
                        <span>{chat[1].userInfo.displayName}</span>
                        <p>{chat[1].lastMessage?.text}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
export default Chats