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
  bio: 'Missing the midwest & chasing nostalgia wherever I can find it. Wisher & Knight.',
  role: 'both',
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
    title: 'Watching Disneyland fireworks from my backyard on Crestview Drive',
    description:
      'Every summer night from ages 6 to 14, I could see the full fireworks show from my backyard in Anaheim. The oak tree would light up gold and we\'d lay on the grass and watch. I moved to Portland 12 years ago and I still miss it every July 4th.',
    location: 'Anaheim, CA',
    tags: ['Disneyland', 'Fireworks', 'California', 'Childhood'],
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
    title: 'The old Crenshaw Roller Rink on Saturday nights in 1994',
    description:
      'The bass from the speakers, the smell of popcorn, the neon lights, the DJ playing R&B hits. We\'d go every weekend. It burned down in 1998. I just want to see what\'s there now.',
    location: 'Los Angeles, CA',
    tags: ['Roller Rink', '90s', 'LA', 'Music'],
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
    title: 'Walking the Virginia Beach boardwalk on a hot August evening',
    description:
      'The funnel cake stands, the smell of salt water taffy, the electric cars kids would rent. My family went every summer until my dad got transferred. I live in Chicago now and the lake just isn\'t the same.',
    location: 'Virginia Beach, VA',
    tags: ['Beach', 'Boardwalk', 'Summer', 'Family'],
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
    title: "My grandmother's bakery on Maple Street — she made the best apple fritters",
    description:
      'She ran it from 1972 to 2003. The smell of cinnamon and warm dough would hit you from a block away. I moved to Seattle years ago and she\'s passed now. The bakery is probably something else. I just want to see the building and know it\'s still standing.',
    location: 'Milwaukee, WI',
    tags: ['Bakery', 'Family', 'Midwest', 'Food'],
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
    title: 'Riding down Pine Creek Road on my Huffy — 10 a.m., no destination',
    description:
      'The road dips and curves past the old Miller farm. On summer mornings the light comes through the pines in shafts. I used to ride it alone before breakfast. Moved east for college in 2008 and never went back. Does that road still look the same?',
    location: 'Bozeman, MT',
    tags: ['Bike', 'Childhood', 'Montana', 'Nature'],
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
    wishTitle: 'The old Crenshaw Roller Rink on Saturday nights in 1994',
    wishUserName: 'Marcus Rivera',
    knightId: 'me',
    knightName: 'Sarah Chen',
    knightUsername: 'sarahchen',
    media: [
      { type: 'photo', uri: 'local:hero' },
      { type: 'photo', uri: 'local:archive' },
    ],
    caption:
      'I visited the location — it\'s a parking lot now, but I talked to a neighbor who grew up nearby. She remembered the neon sign and Saturday nights. She even showed me her old photos. This corner still carries something.',
    sponsor: 'Crenshaw Eats & Co.',
    likes: 47,
    likedBy: ['u3', 'u4', 'u5', 'u2'],
    createdAt: '2025-07-12T16:30:00Z',
    comments: [
      {
        id: 'c1',
        userId: 'u3',
        userName: 'Marcus Rivera',
        text: 'Sarah I am actually crying. Thank you for doing this. The neighbor — that\'s unreal.',
        createdAt: '2025-07-12T17:00:00Z',
      },
      {
        id: 'c2',
        userId: 'u6',
        userName: 'Tony Wells',
        text: 'I used to go there too! Does anyone know what happened to DJ Larry Smooth?',
        createdAt: '2025-07-12T18:45:00Z',
      },
      {
        id: 'c3',
        userId: 'u4',
        userName: 'James Park',
        text: 'This is what this app is all about. Beautiful.',
        createdAt: '2025-07-13T09:10:00Z',
      },
    ],
  },
  {
    id: 'f2',
    wishId: 'w4',
    wishTitle: "My grandmother's bakery on Maple Street",
    wishUserName: 'Sarah Chen',
    knightId: 'u3',
    knightName: 'Marcus Rivera',
    knightUsername: 'marcusr',
    media: [{ type: 'photo', uri: 'local:archive' }],
    caption:
      'Maple Street, Milwaukee. The bakery is now a coffee shop called Morning Cup. The owner, a young guy named Pete, said an older woman ran a bakery there until 2003. He even had an old sign from the original build stored in the back. I held it. Thought of you.',
    sponsor: 'Morning Cup Coffee',
    likes: 89,
    likedBy: ['me', 'u2', 'u4', 'u5'],
    createdAt: '2025-07-01T12:00:00Z',
    comments: [
      {
        id: 'c4',
        userId: 'me',
        userName: 'Sarah Chen',
        text: 'Marcus. I can\'t breathe. The sign. Thank you so much. My mom is going to lose it.',
        createdAt: '2025-07-01T12:30:00Z',
      },
      {
        id: 'c5',
        userId: 'u2',
        userName: 'Diana O\'Brien',
        text: 'This is why I joined. Absolutely beautiful work, Marcus.',
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
    message: 'Marcus fulfilled your wish about your grandmother\'s bakery on Maple Street',
    createdAt: '2025-07-01T12:00:00Z',
    read: true,
    wishId: 'w4',
  },
  {
    id: 'n2',
    type: 'comment',
    fromUserName: 'Tony Wells',
    message: 'Tony commented on the Crenshaw Roller Rink fulfillment you posted',
    createdAt: '2025-07-12T18:45:00Z',
    read: true,
    wishId: 'w2',
  },
  {
    id: 'n3',
    type: 'like',
    fromUserName: 'Ellie Ruiz',
    message: 'Ellie liked your wish about the Huffy ride on Pine Creek Road',
    createdAt: '2025-07-16T08:00:00Z',
    read: false,
    wishId: 'w5',
  },
  {
    id: 'n4',
    type: 'new_knight',
    fromUserName: 'James Park',
    message: 'James Park is a Knight near Virginia Beach — they may be able to fulfill a wish',
    createdAt: '2025-07-15T20:00:00Z',
    read: false,
  },
  {
    id: 'n5',
    type: 'tip',
    fromUserName: 'Marcus Rivera',
    message: 'Marcus tipped you 50 points for fulfilling the Crenshaw Roller Rink wish',
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

const STORAGE_KEY = 'kon_app_data_v1';

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
