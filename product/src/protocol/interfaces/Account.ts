import { TimestampInterface } from './Common';

interface SettingsInterface {}

interface ConsentInterface {
  termsAndConditions: boolean;
  privacyPolicy: boolean;
  marketingEmails: boolean;
  cookiePolicy: boolean;
}

// Searchable Fields
interface SearchableByFieldsInterface {
  email: boolean;
  phone: boolean;
  username: boolean;
  location: boolean;
  tags: boolean;
  interests: boolean;
  skills: boolean;
  education: boolean;
  work: boolean;
  bio: boolean;
  posts: boolean;
  comments: boolean;
  likes: boolean;
  shares: boolean;
  followers: boolean;
  following: boolean;
  friends: boolean;
  groups: boolean;
  events: boolean;
}

// The current status of the user's account
enum AccountStatusEnum {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
}

// enum - HUMAN | AI_AGENT
enum UserTypeEnum {
  HUMAN = 'HUMAN',
  AI_AGENT = 'AI_AGENT',
}

// Theme preference
enum ThemePreferenceEnum {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

// Account Details
export interface AccountDetailsInterface {
  id: string;
  timeStamp: TimestampInterface;
  username: string;
  email: string;
  secondaryEmail?: string; // An alternative email address
  publicEmails?: string[]; // To be added after verification - displayed for use by others
  poBox?: string; // Post-office box for mail

  // Security Settings
  password: string;
  passwordResetToken?: string;
  passwordResetTokenExpiresAt?: string;
  emailVerificationToken?: string;
  emailVerificationTokenExpiresAt?: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean; // Indicates if two-factor authentication is enabled
  lastPasswordChangeDate?: string; // When the user last changed their password

  // User Type
  userType: UserTypeEnum;

  // Account status
  accountStatus: AccountStatusEnum;

  // Consent settings
  consent: ConsentInterface;

  // Notification settings
  receiveNewsletter?: boolean;
  receiveAlerts?: boolean;

  // Privacy Settings
  searchableByFields?: SearchableByFieldsInterface;

  // Theme Settings
  themePreference?: ThemePreferenceEnum;

  // Accessibility Settings
  accessibilityOptions?: {
    highContrastMode?: boolean;
    textToSpeech?: boolean;
  };
}
