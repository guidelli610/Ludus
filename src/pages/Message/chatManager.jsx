export default class ChatManager {
    constructor() {
      // { name: "", room: "", messagesList: [], sendersList: [], dateList: [] }
      const chatsList = JSON.parse(localStorage.getItem("chatsList")) || [{ room: "room_global", messagesList: [], sendersList: [] }];
      this.chatsList = chatsList;
    }
  
    save() {
      localStorage.setItem("chatsList", JSON.stringify(this.chatsList));
      console.log("Salvando: ", this.chatsList);
    }
  
    addChatRoom(room) {
      this.chatsList.push({ room, messagesList: [], sendersList: [] });
      this.save();
    }
  
    sendMessage(room, sender, message) {
      this.chatsList = this.chatsList.map(chat => {
        console.log("Chat: ", chat, "Room: ", room);
        if (chat.room === room) {
          return {
            ...chat,
            messagesList: [...chat.messagesList, message],
            sendersList: [...chat.sendersList, sender] // Substitua pelo nome real
          };
        }
        return chat;
      });
      this.save();
    }
  
    updateMessage(room, messageIndex, newMessage) {
      this.chatsList = this.chatsList.map(chat => {
        if (chat.room === room) {
          const updatedMessagesList = [...chat.messagesList];
          updatedMessagesList[messageIndex] = newMessage;
          return {
            ...chat,
            messagesList: updatedMessagesList
          };
        }
        return chat;
      });
      this.save();
    }
  
    removeMessage(room, messageIndex) {
      this.chatsList = this.chatsList.map(chat => {
        if (chat.room === room) {
          const updatedMessagesList = chat.messagesList.filter((_, index) => index !== messageIndex);
          const updatedSendersList = chat.sendersList.filter((_, index) => index !== messageIndex);
          return {
            ...chat,
            messagesList: updatedMessagesList,
            sendersList: updatedSendersList
          };
        }
        return chat;
      });
      this.save();
    }
  
    getChatsList() {
      return this.chatsList;
    }
  };