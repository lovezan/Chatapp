import React from 'react'
import "./list.css"
import ChatList from './chatlist/ChatList'
import Userinfo from './userInfo/userinfo'

const list = () => {
  return (
    <div className="list">
      <Userinfo/>
      <ChatList/>
    </div>
  )
}

export default list
