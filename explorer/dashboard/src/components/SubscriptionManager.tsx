import { createContext, useContext, useState, useCallback } from "react";
import { SubscriptionModal } from "./SubscriptionModal";

interface SubscriptionSettings {
  email: {
    enabled: boolean;
    address: string;
  };
  webhook: {
    enabled: boolean;
    url: string;
  };
  notifications: {
    [key: string]: boolean;
  };
}

interface FollowedItem {
  id: string;
  type: 'validator' | 'wallet' | 'proposal' | 'address';
  name?: string;
  followedAt: string;
  settings: SubscriptionSettings;
}

interface SubscriptionContextType {
  followedItems: FollowedItem[];
  isFollowing: (id: string) => boolean;
  followItem: (id: string, type: string, name?: string) => void;
  unfollowItem: (id: string) => void;
  openSubscriptionModal: (id: string, type: string, name?: string) => void;
  getSubscriptionSettings: (id: string) => SubscriptionSettings | undefined;
  updateSubscriptionSettings: (id: string, settings: SubscriptionSettings) => void;
}

const defaultSettings: SubscriptionSettings = {
  email: { enabled: false, address: '' },
  webhook: { enabled: false, url: '' },
  notifications: {}
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [followedItems, setFollowedItems] = useState<FollowedItem[]>([]);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    targetId: string;
    targetType: string;
    targetName?: string;
  }>({
    isOpen: false,
    targetId: '',
    targetType: '',
    targetName: undefined
  });

  const isFollowing = useCallback((id: string) => {
    return followedItems.some(item => item.id === id);
  }, [followedItems]);

  const followItem = useCallback((id: string, type: string, name?: string) => {
    setFollowedItems(prev => {
      if (prev.some(item => item.id === id)) return prev;
      
      const newItem: FollowedItem = {
        id,
        type: type as FollowedItem['type'],
        name,
        followedAt: new Date().toISOString(),
        settings: defaultSettings
      };
      
      return [...prev, newItem];
    });
  }, []);

  const unfollowItem = useCallback((id: string) => {
    setFollowedItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const openSubscriptionModal = useCallback((id: string, type: string, name?: string) => {
    setModalState({
      isOpen: true,
      targetId: id,
      targetType: type,
      targetName: name
    });
  }, []);

  const closeSubscriptionModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const getSubscriptionSettings = useCallback((id: string) => {
    return followedItems.find(item => item.id === id)?.settings;
  }, [followedItems]);

  const updateSubscriptionSettings = useCallback((id: string, settings: SubscriptionSettings) => {
    setFollowedItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, settings }
          : item
      )
    );
  }, []);

  const handleModalSave = useCallback((settings: SubscriptionSettings) => {
    updateSubscriptionSettings(modalState.targetId, settings);
  }, [modalState.targetId, updateSubscriptionSettings]);

  const handleModalUnfollow = useCallback(() => {
    unfollowItem(modalState.targetId);
  }, [modalState.targetId, unfollowItem]);

  const contextValue: SubscriptionContextType = {
    followedItems,
    isFollowing,
    followItem,
    unfollowItem,
    openSubscriptionModal,
    getSubscriptionSettings,
    updateSubscriptionSettings
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
      
      <SubscriptionModal
        isOpen={modalState.isOpen}
        onClose={closeSubscriptionModal}
        targetId={modalState.targetId}
        targetType={modalState.targetType as any}
        targetName={modalState.targetName}
        currentSettings={getSubscriptionSettings(modalState.targetId)}
        onSave={handleModalSave}
        onUnfollow={handleModalUnfollow}
      />
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
}

// Hook for easy follow button integration
export function useFollowButton(id: string, type: string, name?: string) {
  const {
    isFollowing,
    followItem,
    openSubscriptionModal
  } = useSubscriptions();

  return {
    isFollowing: isFollowing(id),
    onFollowChange: (id: string, following: boolean) => {
      if (following) {
        followItem(id, type, name);
      }
    },
    onOpenSubscriptions: () => openSubscriptionModal(id, type, name)
  };
}