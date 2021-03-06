import * as React from 'react';
import { RawMessage } from '../../ui/thread-screen/utils';
import ProfileContext from '../profile-provider';
import { RealtimeEventsContext } from './index';

/**
 * Hook for responding to new message events from
 * socket, optionally corresponding to a particular thread
 */
export const useNewMessageEvent = (
  courseId: string,
  handler: (payload: RawMessage) => void,
  ignoreUserEvents: boolean,
  threadId?: string
) => {
  const socketManager = React.useContext(RealtimeEventsContext);
  const profile = React.useContext(ProfileContext).profile as IProfile;

  // Wrapping handler that filters away user's own events
  const eventHandler = React.useCallback(
    (payload) => {
      if (payload.type !== 'new-message') return;
      if (threadId && payload.payload.thread !== threadId) return;
      if (ignoreUserEvents && payload.payload.author._id === profile._id)
        return;
      handler(payload.payload);
    },
    [profile._id, threadId, handler, ignoreUserEvents]
  );

  // Register and deregister socket handler
  React.useEffect(() => {
    socketManager.addListener(courseId, eventHandler);
    return () => socketManager.removeListener(courseId, eventHandler);
  }, [socketManager, eventHandler, courseId]);
};

/**
 * Hook for responding to new thread events from socket
 */
export const useNewThreadEvent = (
  courseId: string,
  handler: (payload: IThread) => void
) => {
  const socketManager = React.useContext(RealtimeEventsContext);
  const profile = React.useContext(ProfileContext).profile as IProfile;

  // Wrapping handler that filters away user's own events
  const eventHandler = React.useCallback(
    (payload) => {
      if (payload.type !== 'new-thread') return;
      if (payload.payload.creator === profile._id) return;
      handler(payload.payload);
    },
    [profile._id, handler]
  );

  // Register and deregister socket handler
  React.useEffect(() => {
    socketManager.addListener(courseId, eventHandler);
    return () => socketManager.removeListener(courseId, eventHandler);
  }, [socketManager, eventHandler, courseId]);
};

/**
 * Listens to specified courses for any events, and
 * calls provided handler with course ID.
 */
export const useAllCourseEvents = (
  courseIds: string[],
  handler: (courseId: string) => void
) => {
  const socketManager = React.useContext(RealtimeEventsContext);

  // Memoized event handlers for each course
  const eventHandlers = React.useMemo<((id: string) => void)[]>(
    () => courseIds.map((id) => () => handler(id)),
    [courseIds.length, handler]
  );

  // Register and deregister handlers for each course
  React.useEffect(() => {
    courseIds.forEach((courseId, index) => {
      socketManager.addListener(courseId, eventHandlers[index]);
    });

    return () => {
      courseIds.forEach((courseId, index) => {
        socketManager.removeListener(courseId, eventHandlers[index]);
      });
    };
  }, [courseIds.length, eventHandlers, socketManager]);
};
