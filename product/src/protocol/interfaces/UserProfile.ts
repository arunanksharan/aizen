// If you would like a heuristic, use interface until you need to use features from type.

/** User Profile
 * @description A user's profile on the network - it has all the human-readable details about the user - name, age, location, bio, etc.
 */

import { TimestampInterface } from './Common';

// Personal details
interface NameInterface {
  firstName: string;
  middleName: string;
  lastName: string;
  pronouncedAsUrl?: string; // Audio file for pronunciation
}

// Biography details
interface BiographyDetailsInterface {
  headline?: string;
  details?: string;
  languagesSpoken?: string[];
  interests?: string[];
}

interface BiographyInterface {
  personal?: BiographyDetailsInterface;
  professional?: BiographyDetailsInterface;
  educational?: BiographyDetailsInterface;
}

// Location details
interface LocationInterface {
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  timeZone?: string;
}

// Work experience details - not very relevant - will come back to this
interface WorkExperienceInterface {
  company?: string;
  designation?: string;
  jobTitle?: string;
  jobDescription?: string;
  startDate?: string;
  endDate?: string;

  // Optional fields - describing the work experience in more detail
  experienceTitle?: string;
  experienceDescription?: string;
  skills: string[];
}

interface VolunterExperienceInterface {
  organization: string;
  role: string;
  description?: string;
  startDate: Date | string;
  endDate?: Date | string;

  // Optional fields - describing the volunteer experience in more detail
  volunteerTitle?: string;
  volunteerDescription?: string;
}

interface EducationInterface {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  grade?: string;
  activitiesAndSocieties?: string;
  description?: string;

  // Optional fields - describing the education experience in more detail
  educationTitle?: string;
  educationDescription?: string;
  skills?: string[];
}

interface CertificationInterface {
  title?: string;
  fieldOfStudy?: string;
  issuingOrganization?: string;
  issueDate?: Date | string;
  expirationDate?: Date | string;
  grade?: string;

  // Optional fields - describing the certification experience in more detail
  certificationTitle?: string;
  certificationDescription?: string;
  skills?: string[];
}

interface OperationalStatusInterface {
  isProfilePublic?: boolean;
  isProfileVerified?: boolean;
  isProfileHidden?: boolean;
  isProfileDeactivated?: boolean;
  isProfileDeleted?: boolean;
  isProfileSuspended?: boolean;
  isProfileBanned?: boolean;
}

interface PersonalInterestsInterface {
  hobbies?: string[];
  favoriteBooks?: string[];
  favoriteAuthors?: string[];
  favoriteMovies?: string[];
  favoriteDirectors?: string[];
  favoriteActors?: string[];
  favoriteMusic?: string[];
  favoriteMusicians?: string[];
  favoriteShows?: string[];
  favoriteSports?: string[];
  favoriteTeams?: string[];
  favoriteQuotes?: string[];
  favoritePersonalities?: string[];
}

// Identify a set of attributes for which zkproofs can be generated

interface UserProfileInterface {
  id: string;
  timeStamp: TimestampInterface;
  lastActiveAt: string;

  isProfilePublic: boolean;
  isProfileVerified: boolean;
  isProfileHidden: boolean;
  isProfileDeactivated: boolean;
  isProfileDeleted: boolean;
  isProfileSuspended: boolean;
  isProfileBanned: boolean;

  // Personal details
  name: NameInterface;
  age: number;
  // For platforms with privacy concerns around age
  displayAge?: boolean; // Whether or not to display age on profile
  gender: string;
  dateOfBirth: string;
  relationshipStatus: string; // convert to enum - Single | Married | Divorced | Widowed | In a relationship | Complicated | Open relationship | Separated | Engaged | Civil union | Domestic partnership | Other
  bio: BiographyInterface; // bio.personal | bio.professional | bio.educational
  profilePictureUrl: string;
  coverPhotoUrl: string;

  // Profile operational status
  operationalStatus: OperationalStatusInterface;

  // Location details
  location: LocationInterface;

  // Contact details
  website: URL[];
  preferredContactMethod?: 'Email' | 'Phone' | 'Message'; // How the user prefers to be contacted - add more enums

  // Professional & Educational details
  education: EducationInterface[];
  workExperience: WorkExperienceInterface[];
  certifications?: CertificationInterface[];

  // Community contributions
  volunteerExperience?: VolunterExperienceInterface[];

  // User's personal goals or what they hope to achieve using the network
  personalGoals?: string[];

  // Contact details
  socialMediaLinks: URL[];
  gamingHandle?: string; // Username for gaming
  platforms?: string[]; // Gaming or social platforms the user is active on
  phoneNumbers: string[];
  // User-created content categories
  blogUrl?: string[];
  portfolioUrl?: string[]; // For showcasing personal work
  resumeUrl?: string[]; // For showcasing professional work
  projectsUrl?: string[]; // For showcasing personal projects

  // Personal interests
  personalInterests?: PersonalInterestsInterface[];

  // More detailed preferences - to be expanded further
  culturalInterests?: string[];
  favoriteCuisines?: string[];
  travelInterests?: string[];

  // For fitness or health-oriented platforms
  fitnessInterests?: string[];
  dietaryPreferences?: string[];
  wellnessGoals?: string[];

  // For parenting or family-oriented platforms
  familyDetails?: {
    maritalStatus?: string; // Convert to enum - 'Single' | 'Married' | 'Divorced';
    childrenCount?: number;
    petDetails?: string[];
  };
}
