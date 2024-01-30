import { createContext, useContext } from "react";

const NotificationContext = createContext({
  unreadNotificationCount:0,
  setUnreadNotificationCount: () => {},
});

export function useNotificationContext() {
  return useContext(NotificationContext);
}

export default NotificationContext;