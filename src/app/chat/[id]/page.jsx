import MessagingApp from "@/components/Chat/messagingApp";
import React from "react";

function Page() {
  return (
    <div className="w-full h-[calc(100vh-120px)] sm:h-[calc(100vh-160px)] bg-gray-50 overflow-hidden">
      <MessagingApp />
    </div>
  );
}

export default Page;
