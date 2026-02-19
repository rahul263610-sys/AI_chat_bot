export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Chat {
  _id: string;
  title: string;
  messages: Message[];
}
