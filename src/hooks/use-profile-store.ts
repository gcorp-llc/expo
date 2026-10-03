import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "@/lib/storage";
import { ProfileData, Experience } from "../types/profile";
import { MOCK_PROFILE } from "../constants/mockProfile";

interface ProfileState extends ProfileData {
  // Actions
  updateProfile: (data: Partial<ProfileData>) => void;

  // Experience Actions
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  removeExperience: (id: string) => void;

  // Skill Actions
  addSkill: (skill: string) => void;
  removeSkill: (id: string) => void;

  // Contact Actions
  updateContactInfo: (info: { email?: string; phoneNumber?: string; location?: string; region?: string; website?: string; instagram?: string }) => void;
  updateSocialLink: (id: string, url: string) => void;

  // Blocking Actions
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
}

// Ensure INITIAL_PROFILE has all required fields including the new ones
const INITIAL_PROFILE: ProfileData = {
  ...MOCK_PROFILE,
  role: "Store Manager",
  region: "Shemiranat",
  instagram: "cardiani_shop",
  email: "jules@cardiani.design",
  phoneNumber: "+98 912 345 6789",
  location: "Tehran",
  website: "https://cardiani.app",
  blockedUserIds: [], // Initialize empty
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      ...INITIAL_PROFILE,

      updateProfile: (data) => set((state) => ({ ...state, ...data })),

      addExperience: (exp) => set((state) => ({
        experiences: [
          { ...exp, id: Date.now().toString() },
          ...state.experiences
        ]
      })),

      removeExperience: (id) => set((state) => ({
        experiences: state.experiences.filter((exp) => exp.id !== id)
      })),

      addSkill: (skillName) => set((state) => {
        if (state.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) return state;
        return {
          skills: [...state.skills, { id: Date.now().toString(), name: skillName }]
        };
      }),

      removeSkill: (id) => set((state) => ({
        skills: state.skills.filter((s) => s.id !== id)
      })),

      updateContactInfo: (info) => set((state) => ({ ...state, ...info })),

      updateSocialLink: (id, url) => set((state) => ({
        socialLinks: state.socialLinks.map(link =>
          link.id === id ? { ...link, url } : link
        )
      })),

      blockUser: (userId) => set((state) => ({
        blockedUserIds: [...new Set([...state.blockedUserIds, userId])]
      })),

      unblockUser: (userId) => set((state) => ({
        blockedUserIds: state.blockedUserIds.filter(id => id !== userId)
      })),
    }),
    {
      name: "cardiani-profile-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
