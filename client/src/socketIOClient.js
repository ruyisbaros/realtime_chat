/* import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const SocketClient = ({ socket }) => {

    const { loggedUser } = useSelector(store => store.currentUser)
    //const { socket } = useSelector(store => store.sockets)
    const dispatch = useDispatch();

    useEffect(() => {
        socket?.emit("joinUser", loggedUser._id)
    }, [loggedUser._id, socket])
    return (
        <>
        </>
    )
}

export default SocketClient */