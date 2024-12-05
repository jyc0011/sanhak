import React, {useCallback, useEffect, useRef, useState} from 'react';
import RoleDropdown from './ChatRoleDropdown';
import {AiCardChat, ChatRoleOption} from "@/models/card";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ChatInterfaceProps = {
    roles: ChatRoleOption[];
    chatData: AiCardChat[];
    isLoading: boolean;
    chatInput: string;
    selectedCardTitle: string | undefined;
    onSendChat: (userMessage: { id: number; isUser: number; content: string }) => void;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
    onResetChat: () => void;
    selectedChatId: number;
    selectedChatType: string | undefined;
    selectedRole: ChatRoleOption;
    handleSelectRole: (role: ChatRoleOption) => void;
    initializeChat: (chatId: number, chatRole: string) => void;
    fetchChatMessages: (chatId: number, chatRole: string) => void;
    handleSideList: () => void;
};

const aiRoles: ChatRoleOption[] = [
    { label: "AI 면접관", description: "경험카드를 바탕으로 예상 면접질문 및 답변 생성", guideNotice: "어떤 예상질문을 뽑아드릴까요?" },
    { label: "AI 자소서 도우미", description: "경험카드를 기반으로 자기소개서 문항 생성", guideNotice: "어떤 자기소개서 문항을 작성해드릴까요?" },
    { label: "AI 포지션 질문", description: "포지션을 바탕으로 해당 직무와 언어에 대한 설명 생성", guideNotice: "해당 직무와 언어에 대해 어떤 점이 궁금한가요?" },
];

export default function ChatInterface({
                                          chatData,
                                          chatInput,
                                          isLoading,
                                          selectedCardTitle,
                                          onSendChat,
                                          onInputChange,
                                          onKeyDown,
                                          onResetChat,
                                          selectedChatId,
                                          selectedChatType,
                                          initializeChat,
                                          fetchChatMessages,
                                          handleSideList
                                      }: ChatInterfaceProps) {
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const [roles, setRoles] = useState<ChatRoleOption[]>(aiRoles);
    const [selectedRole, setSelectedRole] = useState<ChatRoleOption>(roles[0]);
    const handleSelectRole = useCallback((role: ChatRoleOption) => {
        console.log("Previous role:", selectedRole);
        console.log("New role selected:", role);
        setSelectedRole(role);
    }, [selectedRole]);

    useEffect(() => {
        if (chatEndRef.current) {
            if ("scrollIntoView" in chatEndRef.current) {
                chatEndRef.current.scrollIntoView({behavior: 'smooth'});
            }
        }
    }, [chatData]);

    useEffect(() => {
        if (roles.length > 0) {
            setSelectedRole(roles[0]);
        }
    }, [roles]);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="w-full h-[3rem] flex items-center">
                <div 
                    className='lg:hidden flex'
                    onClick={handleSideList}
                ><img src='asset/png/icon_list_open.png'/></div>
                <RoleDropdown roles={roles}
                    selectedRole={selectedRole}
                    onResetChat={() => {
                        onResetChat();
                    }}
                    handleSelectRole={handleSelectRole}
                    initializeChat={initializeChat} // 추가
                    fetchChatMessages={fetchChatMessages} // 추가
                    selectedChatId={selectedChatId} // 추가
                />
            </div>
            <div className={`w-full h-[calc(100%-3rem)] flex flex-col items-center ${chatData.length > 0 ? 'justify-between' : 'justify-center'}`}>
               {selectedCardTitle ? (
                    <>
                        {chatData.length > 0 ? (
                            <div className="w-5/6 h-full overflow-y-auto scrollbar-none pt-4">
                                {chatData.map((chat) => (
                                    <div
                                        key={chat.id}
                                        className={`w-full mb-2 flex ${chat.isUser === 1 ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`${chat.isUser === 1 ? 'bg-primary text-white' : 'bg-gray-ec text-black'} p-2 rounded-lg max-w-xs`}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{chat.content}</ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && ( // 로딩 상태에 따라 표시
                                    <div className="w-full mb-2 flex justify-start">
                                        <div className="bg-gray-ec text-black p-2 rounded-lg max-w-xs">
                                            <div>대기중...</div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                        ) : (
                            <div className="font-bold text-xl mb-4">{selectedRole.guideNotice}</div>
                        )}

                        <div className="w-5/6 flex items-center bg-white rounded-xl border border-gray-d9 mb-2">
                            <input
                                type="text"
                                value={chatInput}
                                className="w-full h-10 border-0 rounded-xl text-sm focus:outline-0"
                                placeholder={`AI에게 '${selectedCardTitle}'에 대한 질문을 해보세요.`}
                                onChange={onInputChange}
                                onKeyDown={onKeyDown}
                            />
                            <div
                                className="w-8 h-7 flex justify-center items-center bg-primary rounded-full text-white font-semibold cursor-pointer text-xs mr-2 py-1"
                                onClick={() => onSendChat({ id: chatData.length + 1, isUser: 1, content: chatInput })}
                            >
                                전송
                            </div>
                        </div>
                    </>
               ) : (
                <div className='font-bold text-xl mb-4'>AI경험카드를 선택해주세요.</div>
               )}
                
            </div>
        </div>
    );
}