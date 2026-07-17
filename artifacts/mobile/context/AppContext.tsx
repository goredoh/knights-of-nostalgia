import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ───────────────────────────────────────────────────────────────────

export type UserRole = 'wisher' | 'knight' | 'both';

export interface User {
  id: string;
  name: string;
  username: string;
  bio: string;
  role: UserRole;
  city: string;
  points: number;
  wishCount: number;
  fulfillCount: number;
  joinedAt: string;
}

export interface Wish {
  id: string;
  userId: string;
  userName: string;
  userUsername: string;
  title: string;
  description: string;
  location: string;
  tags: string[];
  status: 'open' | 'fulfilled' | 'archived';
  createdAt: string;
  fulfillmentCount: number;
  tipAmount: number;
  likedBy: string[];
}

export interface MediaItem {
  type: 'photo' | 'video' | 'audio';
  uri: string; // 'local:hero' | 'local:archive' | real URI
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Fulfillment {
  id: string;
  wishId: string;
  wishTitle: string;
  wishUserName: string;
  knightId: string;
  knightName: string;
  knightUsername: string;
  media: MediaItem[];
  caption: string;
  sponsor?: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
  comments: Comment[];
}

export interface AppNotification {
  id: string;
  type:
    | 'wish_fulfilled'
    | 'comment'
    | 'tip'
    | 'like'
    | 'new_knight'
    | 'quest_accepted';
  fromUserName: string;
  message: string;
  createdAt: string;
  read: boolean;
  wishId?: string;
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const CURRENT_USER: User = {
  id: 'me',
  name: 'Sarah Chen',
  username: 'sarahchen',
  bio: 'Nashville transplant from Indiana. Chasing nostalgia and trying to give a little back. Wisher & Knight.',
  role: 'both',
  city: 'Nashville, TN',
  points: 340,
  wishCount: 2,
  fulfillCount: 5,
  joinedAt: '2024-03-15',
};

const SEED_WISHES: Wish[] = [
  {
    id: 'w1',
    userId: 'u2',
    userName: 'Diana O\'Brien',
    userUsername: 'dianao',
    title: 'The original Elliston Place Soda Shop before it moved',
    description:
      'I grew up going there with my dad on Saturday mornings. Red vinyl stools, strawberry malts, the smell of grilled cheese on the flat-top. They relocated and I heard the original space is something totally different now. I moved to Portland eight years ago and I still think about that counter.',
    location: 'Elliston Place, Nashville, TN',
    tags: ['Elliston', 'Diner', 'Childhood', 'Nostalgia'],
    status: 'open',
    createdAt: '2025-07-14T18:23:00Z',
    fulfillmentCount: 0,
    tipAmount: 8,
    likedBy: ['u3', 'u4', 'me'],
  },
  {
    id: 'w2',
    userId: 'u3',
    userName: 'Marcus Rivera',
    userUsername: 'marcusr',
    title: 'Printers Alley on a Saturday night, late 1990s',
    description:
      'The neon, the jazz spilling out of Skull\'s Rainbow Room, the people dressed up with nowhere to be. I was there every weekend from \'96 to \'01. My family moved to Houston and I never made it back. I just want to see what it feels like down there now. Is the neon still on?',
    location: 'Printers Alley, Downtown Nashville, TN',
    tags: ['Printers Alley', 'Nightlife', '90s', 'Downtown'],
    status: 'fulfilled',
    createdAt: '2025-06-28T11:00:00Z',
    fulfillmentCount: 1,
    tipAmount: 15,
    likedBy: ['u4', 'u5', 'me', 'u6'],
  },
  {
    id: 'w3',
    userId: 'u4',
    userName: 'James Park',
    userUsername: 'jamespark',
    title: 'Christmas at the Opryland Hotel — the indoor waterfall and light show',
    description:
      'We went every December from the time I was six until my parents divorced. The Cascades atrium lit up with tens of thousands of lights reflected in the water. I live in Seattle now and every Christmas I can still hear that echo. Could someone just walk through it for me this December and describe it?',
    location: 'Opryland Hotel, Nashville, TN',
    tags: ['Opryland', 'Christmas', 'Family', 'Holiday'],
    status: 'open',
    createdAt: '2025-07-10T09:15:00Z',
    fulfillmentCount: 0,
    tipAmount: 5,
    likedBy: ['u2', 'u6'],
  },
  {
    id: 'w4',
    userId: 'me',
    userName: 'Sarah Chen',
    userUsername: 'sarahchen',
    title: "My grandfather's hardware store on Gallatin Pike — been gone since 2007",
    description:
      'He ran it from 1969 until the rent got too high. The sign was hand-painted, white letters on green, and he\'d sit on a stool by the door every morning. The building is still there but I don\'t know what\'s inside it now. I moved here from Indiana three years ago and it still hits me when I drive past.',
    location: 'Gallatin Pike, East Nashville, TN',
    tags: ['East Nashville', 'Family', 'Small Business', 'History'],
    status: 'fulfilled',
    createdAt: '2025-06-15T14:00:00Z',
    fulfillmentCount: 1,
    tipAmount: 20,
    likedBy: ['u3', 'u4', 'u5', 'u2'],
  },
  {
    id: 'w5',
    userId: 'u5',
    userName: 'Ellie Ruiz',
    userUsername: 'ellieruiz',
    title: 'The Friday drum circle at Centennial Park, early 2000s',
    description:
      'Every Friday evening a group of fifty or more would gather around the Parthenon with djembes and congas. No stage, no tickets, just people and rhythm until dark. I moved to Austin for grad school in 2006 and I\'ve never found anything like it. Does anything like that still happen there?',
    location: 'Centennial Park, Nashville, TN',
    tags: ['Centennial Park', 'Music', 'Community', '2000s'],
    status: 'open',
    createdAt: '2025-07-16T07:45:00Z',
    fulfillmentCount: 0,
    tipAmount: 0,
    likedBy: ['me', 'u2'],
  },
];

const SEED_FULFILLMENTS: Fulfillment[] = [
  {
    id: 'f1',
    wishId: 'w2',
    wishTitle: 'Printers Alley on a Saturday night, late 1990s',
    wishUserName: 'Marcus Rivera',
    knightId: 'me',
    knightName: 'Sarah Chen',
    knightUsername: 'sarahchen',
    media: [
      { type: 'photo', uri: 'local:hero' },
      { type: 'photo', uri: 'local:archive' },
    ],
    caption:
      'Walked Printers Alley on a Saturday night. Skull\'s Rainbow Room is still there — still lit in red and gold. An older gentleman outside told me he\'s been coming since 1988. The neon is absolutely still on. This alley remembers everything.',
    sponsor: 'Skull\'s Rainbow Room',
    likes: 47,
    likedBy: ['u3', 'u4', 'u5', 'u2'],
    createdAt: '2025-07-12T16:30:00Z',
    comments: [
      {
        id: 'c1',
        userId: 'u3',
        userName: 'Marcus Rivera',
        text: 'Sarah I am actually crying. The neon is still on. Thank you for doing this.',
        createdAt: '2025-07-12T17:00:00Z',
      },
      {
        id: 'c2',
        userId: 'u6',
        userName: 'Tony Wells',
        text: 'Skull\'s is a Nashville treasure. Glad it\'s still standing.',
        createdAt: '2025-07-12T18:45:00Z',
      },
      {
        id: 'c3',
        userId: 'u4',
        userName: 'James Park',
        text: 'This is exactly what this app should be. Beautiful.',
        createdAt: '2025-07-13T09:10:00Z',
      },
    ],
  },
  {
    id: 'f2',
    wishId: 'w4',
    wishTitle: "My grandfather's hardware store on Gallatin Pike",
    wishUserName: 'Sarah Chen',
    knightId: 'u3',
    knightName: 'Marcus Rivera',
    knightUsername: 'marcusr',
    media: [{ type: 'photo', uri: 'local:archive' }],
    caption:
      'Gallatin Pike. The building is still standing — it\'s a barbershop now called Sharp & Sons. The owner, Ray, has been there twelve years and said an older man with a stool used to wave to everyone from the door of the old hardware place. He remembered the green sign. I took a photo of the front for you. It\'s a good corner.',
    sponsor: 'Sharp & Sons Barbershop',
    likes: 89,
    likedBy: ['me', 'u2', 'u4', 'u5'],
    createdAt: '2025-07-01T12:00:00Z',
    comments: [
      {
        id: 'c4',
        userId: 'me',
        userName: 'Sarah Chen',
        text: 'Ray remembered the green sign. Marcus, I can\'t breathe. Thank you.',
        createdAt: '2025-07-01T12:30:00Z',
      },
      {
        id: 'c5',
        userId: 'u2',
        userName: 'Diana O\'Brien',
        text: 'This is why I joined. Absolutely beautiful work.',
        createdAt: '2025-07-01T14:00:00Z',
      },
    ],
  },
];

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'wish_fulfilled',
    fromUserName: 'Marcus Rivera',
    message: 'Marcus fulfilled your wish about your grandfather\'s hardware store on Gallatin Pike',
    createdAt: '2025-07-01T12:00:00Z',
    read: true,
    wishId: 'w4',
  },
  {
    id: 'n2',
    type: 'comment',
    fromUserName: 'Tony Wells',
    message: 'Tony commented on the Printers Alley fulfillment you posted',
    createdAt: '2025-07-12T18:45:00Z',
    read: true,
    wishId: 'w2',
  },
  {
    id: 'n3',
    type: 'like',
    fromUserName: 'Ellie Ruiz',
    message: 'Ellie liked your wish about the Centennial Park drum circle',
    createdAt: '2025-07-16T08:00:00Z',
    read: false,
    wishId: 'w5',
  },
  {
    id: 'n4',
    type: 'new_knight',
    fromUserName: 'James Park',
    message: 'James Park joined as a Knight in Nashville — they\'re ready to fulfill wishes near you',
    createdAt: '2025-07-15T20:00:00Z',
    read: false,
  },
  {
    id: 'n5',
    type: 'tip',
    fromUserName: 'Marcus Rivera',
    message: 'Marcus tipped you 50 points for fulfilling the Printers Alley wish',
    createdAt: '2025-07-12T17:30:00Z',
    read: true,
    wishId: 'w2',
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue {
  currentUser: User;
  wishes: Wish[];
  fulfillments: Fulfillment[];
  notifications: AppNotification[];
  unreadCount: number;
  likeWish: (wishId: string) => void;
  likeFulfillment: (fulfillmentId: string) => void;
  addComment: (fulfillmentId: string, text: string) => void;
  createWish: (data: Omit<Wish, 'id' | 'userId' | 'userName' | 'userUsername' | 'status' | 'createdAt' | 'fulfillmentCount' | 'likedBy'>) => void;
  markNotificationsRead: () => void;
  setUserRole: (role: UserRole) => void;
  createFulfillment: (wishId: string, caption: string, media: MediaItem[]) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = 'kon_app_data_v2';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [wishes, setWishes] = useState<Wish[]>(SEED_WISHES);
  const [fulfillments, setFulfillments] = useState<Fulfillment[]>(SEED_FULFILLMENTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED_NOTIFICATIONS);
  const [loaded, setLoaded] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (data.currentUser) setCurrentUser(data.currentUser);
          if (data.wishes) setWishes(data.wishes);
          if (data.fulfillments) setFulfillments(data.fulfillments);
          if (data.notifications) setNotifications(data.notifications);
        }
      } catch (_) {
        // use seed data
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Persist on change
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ currentUser, wishes, fulfillments, notifications }),
    ).catch(() => {});
  }, [loaded, currentUser, wishes, fulfillments, notifications]);

  const likeWish = useCallback((wishId: string) => {
    setWishes((prev) =>
      prev.map((w) => {
        if (w.id !== wishId) return w;
        const liked = w.likedBy.includes('me');
        return {
          ...w,
          likedBy: liked
            ? w.likedBy.filter((id) => id !== 'me')
            : [...w.likedBy, 'me'],
        };
      }),
    );
  }, []);

  const likeFulfillment = useCallback((fulfillmentId: string) => {
    setFulfillments((prev) =>
      prev.map((f) => {
        if (f.id !== fulfillmentId) return f;
        const liked = f.likedBy.includes('me');
        return {
          ...f,
          likes: liked ? f.likes - 1 : f.likes + 1,
          likedBy: liked
            ? f.likedBy.filter((id) => id !== 'me')
            : [...f.likedBy, 'me'],
        };
      }),
    );
  }, []);

  const addComment = useCallback((fulfillmentId: string, text: string) => {
    const comment: Comment = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
      userId: 'me',
      userName: currentUser.name,
      text,
      createdAt: new Date().toISOString(),
    };
    setFulfillments((prev) =>
      prev.map((f) =>
        f.id === fulfillmentId
          ? { ...f, comments: [...f.comments, comment] }
          : f,
      ),
    );
  }, [currentUser.name]);

  const createWish = useCallback(
    (data: Omit<Wish, 'id' | 'userId' | 'userName' | 'userUsername' | 'status' | 'createdAt' | 'fulfillmentCount' | 'likedBy'>) => {
      const newWish: Wish = {
        ...data,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
        userId: 'me',
        userName: currentUser.name,
        userUsername: currentUser.username,
        status: 'open',
        createdAt: new Date().toISOString(),
        fulfillmentCount: 0,
        likedBy: [],
      };
      setWishes((prev) => [newWish, ...prev]);
      setCurrentUser((u) => ({ ...u, wishCount: u.wishCount + 1 }));
    },
    [currentUser.name, currentUser.username],
  );

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const setUserRole = useCallback((role: UserRole) => {
    setCurrentUser((u) => ({ ...u, role }));
  }, []);

  const createFulfillment = useCallback(
    (wishId: string, caption: string, media: MediaItem[]) => {
      const wish = wishes.find((w) => w.id === wishId);
      if (!wish) return;
      const newFulfillment: Fulfillment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
        wishId,
        wishTitle: wish.title,
        wishUserName: wish.userName,
        knightId: 'me',
        knightName: currentUser.name,
        knightUsername: currentUser.username,
        media,
        caption,
        likes: 0,
        likedBy: [],
        createdAt: new Date().toISOString(),
        comments: [],
      };
      setFulfillments((prev) => [newFulfillment, ...prev]);
      setWishes((prev) =>
        prev.map((w) =>
          w.id === wishId
            ? { ...w, status: 'fulfilled', fulfillmentCount: w.fulfillmentCount + 1 }
            : w,
        ),
      );
      setCurrentUser((u) => ({ ...u, fulfillCount: u.fulfillCount + 1 }));
    },
    [wishes, currentUser.name, currentUser.username],
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        wishes,
        fulfillments,
        notifications,
        unreadCount,
        likeWish,
        likeFulfillment,
        addComment,
        createWish,
        markNotificationsRead,
        setUserRole,
        createFulfillment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
