import React from 'react'
import { useChatStore } from '../store/useChatStore.js'
import ChatContainer from '../components/ChatContainer';
import NoChatSelected from '../components/NoChatSelected';
import Sidebar from '../components/Sidebar.jsx';
const Home = () => {
  const {selectedUser}=useChatStore();
  return (
    <div className="h-screen bg-base-200">
    <div className="flex items-center justify-center pt-20 px-4">
      <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-[1600px] h-[calc(100vh-7rem)]">
        <div className="flex h-full rounded-lg overflow-hidden">
          <Sidebar />
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Home