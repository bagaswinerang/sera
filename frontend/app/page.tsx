import { Suspense } from "react";
import { ChatView } from "@/components/chat/chat-view";

export default function Page() {
  return (
    <Suspense>
      <ChatView />
    </Suspense>
  );
}
