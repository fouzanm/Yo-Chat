import { useContext, useState } from "react"
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import Default from '../img/addAvatar.png'
import { AuthContext } from "../context/AuthContext";



const Search = () => {
    const [username, setUsername] = useState('')
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false)

    const {currentUser} = useContext(AuthContext)

    const handleSearch = async () => {
        setError(false)
        const q = query(collection(db, "users"), where('displayName', '==', username))
        try {
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                setUser(doc.data())
            })
        } catch(error) {
            setError(true)
        }

    }
    const handleKey = (ev) => {
        ev.code === "Enter" && handleSearch()
    }

    const handleSelect = async () => {
        // check whether the group(chat in firestore) exist, if not create one
        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, 'chats', combinedId))
            if (!res.exists()) {
                // creates a chat in chats collection
                await setDoc(doc(db, 'chats', combinedId), { messages: []});
                // creates user chat
                await updateDoc(doc(db, 'userChats', currentUser.uid), {
                    [combinedId+'.userInfo']: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [combinedId+'.date']: serverTimestamp()
                });
                await updateDoc(doc(db, 'userChats', user.uid), {
                    [combinedId+'.userInfo']: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    },
                    [combinedId+'.date']: serverTimestamp()
                });
            }
        } catch (error) {}
        setUser(null);
        setUsername('');
    }

    return (
        <div className="search">
            <div className="searchForm">
                <input type="text" placeholder="Find a user" 
                    onKeyDown={handleKey}
                    onChange={(ev) => setUsername(ev.target.value)} 
                    value={username}/>
            </div>
            {error && <span>User not found</span>}
            {!error && user && <div className="userChat" onClick={handleSelect}>
                <img src={user.photoURL ?? Default} alt="" />
                <div className="userChatInfo">
                    <span>{user.displayName}</span>
                </div>
            </div>}
        </div>
    )
}
export default Search