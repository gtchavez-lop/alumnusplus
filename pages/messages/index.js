import { FiMoreHorizontal, FiSearch, FiX } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import { _Page_Transition } from '../../lib/_animations';
import _supabase from '../../lib/supabase';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useAuth } from '../../components/AuthContext';

const Page_Messages = (e) => {
  const _chatDesktop = useRef(null);
  const _chatWindow = useRef(null);
  const _windowEnd = useRef(null);
  const { user } = useAuth();
  const [selectedChatHead, setSelectedChatHead] = useState(null);
  const [connections, setConnections] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  // chat fetcher from supabase
  const _fetchChats = async () => {
    // fetch and filter all chats
    // filter by user id and selected chat head id
    // sort by oldest to newest
    const { data, error } = await _supabase
      .from('user_chats')
      .select('*')
      .order('sent_at', { ascending: true });

    if (error) {
      console.log(error);
    } else {
      let filtereedchats = data.filter(
        (chat) =>
          (chat.sent_from === user.id &&
            chat.sent_to === selectedChatHead.id) ||
          (chat.sent_from === selectedChatHead.id && chat.sent_to === user.id)
      );
      setChatHistory(filtereedchats);
    }
  };

  // send chat to supabase
  const _sendChat = async (e) => {
    e.preventDefault();
    const chat = e.currentTarget.chatMessage.value;

    if (chat) {
      // const chats = await chatDB.get('chats');
      const newChat = {
        sent_from: user.id,
        sent_to: selectedChatHead.id,
        message: chat,
      };

      const { data, error } = await _supabase
        .from('user_chats')
        .insert(newChat);

      if (error) {
        console.log(error);
      } else {
        e.target.chatMessage.value = '';
        _fetchChats();
      }

      // clear the chat input
      e.target.chatMessage.value = '';
    }
  };

  // fetch user connections
  const _fetchConnections = async () => {
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    let connections = userData.connections
      ? JSON.parse(userData.connections)
      : [];

    const { data, error } = await _supabase
      .from('user_data')
      .select('id, name_given, name_last, user_handle')
      .in('id', connections);

    if (error) {
      console.log(error);
    } else {
      setConnections(data);
    }
  };

  const listener = async () => {};

  useEffect(() => {
    // fetch user connections
    _fetchConnections();
  }, []);

  useEffect(() => {
    // set the height of the chat desktop based on the height of the window minus 128px
    // only if selectedChatHead is not null
    if (selectedChatHead) {
      _chatDesktop.current.style.height = `${window.innerHeight - 150}px`;
      // fetch chats
      _fetchChats();
      console.log('fetching chats');
    }

    // set _chatWindow scroll to bottom if _chatWindow is not null
    if (_chatWindow && _chatWindow.current) {
      _chatWindow.current.scrollTop = _chatWindow.current.scrollHeight;
    }
  }, [selectedChatHead]);

  useEffect(() => {
    _windowEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <>
      <motion.main
        variants={_Page_Transition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="grid grid-cols-1 lg:grid-cols-3 pt-32 gap-x-5 relative"
      >
        {/* chats */}
        <div className="col-span-full lg:col-span-1">
          <div className="flex flex-col items-center relative w-full">
            <div className="flex items-center gap-5 w-full max-w-md">
              <input
                type="text"
                placeholder="Search"
                className="input input-primary w-full"
              />
              <button className="btn btn-primary btn-square">
                <FiSearch size={20} />
              </button>
            </div>

            {/* list of messages */}
            <div className="flex flex-col items-center w-full my-10 gap-2 overscroll-y-scroll ">
              {connections &&
                connections.map((item, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: 'circOut',
                    }}
                    key={item.id}
                    onClick={() => {
                      setSelectedChatHead(item);
                    }}
                    className="flex items-center gap-5 w-full hover:bg-base-300 py-3 px-2 rounded-md select-none cursor-pointer"
                  >
                    <div className="flex items-center gap-5 overflow-hidden">
                      <img
                        src={`https://avatars.dicebear.com/api/big-ears-neutral/${item.user_handle}.svg`}
                        alt="profile"
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex flex-col">
                        <p className="text-lg font-semibold">
                          {item.name_given} {item.name_last}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>

        {/* selected message */}
        <AnimatePresence mode="wait">
          {selectedChatHead != null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.2, ease: 'circOut' },
              }}
              exit={{
                opacity: 0,
                y: 20,
                transition: { duration: 0.2, ease: 'circIn' },
              }}
              ref={_chatDesktop}
              className={`fixed top-20 w-full left-0 lg:block lg:col-span-2 bg-base-200 rounded-btn p-5 lg:sticky lg:top-32`}
            >
              <>
                <div
                  className="grid h-full"
                  style={{
                    gridTemplateRows: 'auto 1fr auto',
                  }}
                >
                  {/* chatmate's name */}
                  <div className="flex items-center gap-5">
                    <img
                      src={`https://avatars.dicebear.com/api/big-ears-neutral/${selectedChatHead.user_handle}.svg`}
                      alt="profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <p className="text-lg font-semibold">
                      {selectedChatHead.name_given} {selectedChatHead.name_last}
                    </p>
                    <div className="ml-auto">
                      <button className="btn btn-square btn-ghost">
                        <FiMoreHorizontal size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          setSelectedChatHead(null);
                        }}
                        className="btn btn-square btn-ghost lg:hidden"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                  </div>

                  {/* chat window */}
                  <div className="flex flex-col w-full my-5 gap-5 pb-10 lg:pr-4 overflow-y-scroll overscroll-y-scroll">
                    {/* loop from the chatHistory */}
                    {chatHistory &&
                      chatHistory.map((item, i) => {
                        return (
                          <div
                            key={item.id}
                            className={`flex flex-col w-full ${
                              item.sent_from === user.id
                                ? 'items-end'
                                : 'items-start'
                            }`}
                          >
                            <p
                              className={`text-xs text-base-content ${
                                item.sent_from === user.id
                                  ? 'text-right mr-4'
                                  : 'text-left ml-4'
                              }`}
                            >
                              {dayjs(item.sent_at).format('h:mm A')}
                            </p>
                            <div
                              className={`flex items-center px-4 py-3 rounded-full ${
                                item.sent_from === user.id
                                  ? 'bg-primary text-primary-content'
                                  : 'bg-base-300'
                              }`}
                            >
                              <p>{item.message}</p>
                            </div>
                          </div>
                        );
                      })}

                    {/* if empty show a quote about emptiness */}
                    {chatHistory.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-2xl font-semibold text-primary-content">
                          No messages yet
                        </p>
                        <p className="text-lg text-primary-content opacity-50">
                          Send a message to start a conversation
                        </p>
                      </div>
                    )}

                    <div ref={_windowEnd} />
                  </div>

                  {/* chat input */}
                  <form
                    className="flex items-center gap-5"
                    onSubmit={(e) => _sendChat(e)}
                  >
                    <input
                      type="text"
                      name="chatMessage"
                      placeholder="Type a message"
                      className="input input-primary w-full"
                    />
                    <button className="btn btn-primary">Send</button>
                  </form>
                </div>
              </>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </>
  );
};

export default Page_Messages;
