import Img from "../img/img.png"
import Attach from "../img/attach.png"
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import uuid4 from "uuid4";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


const Input = () => {
    const [text, setText] = useState('');
    const [image, setImage] =useState(null)
    const {currentUser} = useContext(AuthContext);
    const {data} = useContext(ChatContext);

    const handleSend = async () => {
        if (image) {
            const storageRef = ref(storage, uuid4());
            const uploadTask = await uploadBytes(storageRef, image);
            getDownloadURL(uploadTask.ref).then(async (downloadURL) => {
                await updateDoc(doc(db, 'chats', data.chatId), {
                    messages: arrayUnion({
                        id: uuid4(),
                        text ,
                        senderId: currentUser.uid,
                        data: Timestamp.now(),
                        imageURL: downloadURL
                    })
                })
                console.log(downloadURL)
            })
        } else {
            await updateDoc(doc(db, 'chats', data.chatId), {
                messages: arrayUnion({
                    id: uuid4(),
                    text ,
                    senderId: currentUser.uid,
                    data: Timestamp.now()
                })
            })
        }
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
            [data.chatId+'.lastMessage']: {
                text
            },
            [data.chatId+'.date']: serverTimestamp(),
        })
        await updateDoc(doc(db, 'userChats', data.user.uid), {
            [data.chatId+'.lastMessage']: {
                text
            },
            [data.chatId+'.date']: serverTimestamp(),
        })
        setImage(null);
        setText('');
    }

    return (
        <div className="input">
            <input type="text" placeholder="Type something..." onChange={(ev) => setText(ev.target.value)} value={text}/>
            <div className="send">
                <img src={Attach} alt="" />
                <input type="file" style={{display: "none"}} id="inputFile" onChange={(ev) => setImage(ev.target.files[0])}/>
                <label htmlFor="inputFile">
                    <img src={Img} alt="" />
                </label>
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    )
}
export default Input