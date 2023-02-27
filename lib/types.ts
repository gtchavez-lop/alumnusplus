export type Json =
  | string
  | string[]
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      hunt_blog: {
        Row: {
          comments: Json | null
          content: string | null
          createdAt: string | null
          id: string
          type: string | null
          updatedAt: string | null
          uploader: Json | null
          uploaderID: string | null
          upvoters: Json | null
        }
        Insert: {
          comments?: Json | null
          content?: string | null
          createdAt?: string | null
          id?: string
          type?: string | null
          updatedAt?: string | null
          uploader?: Json | null
          uploaderID?: string | null
          upvoters?: Json | null
        }
        Update: {
          comments?: Json | null
          content?: string | null
          createdAt?: string | null
          id?: string
          type?: string | null
          updatedAt?: string | null
          uploader?: Json | null
          uploaderID?: string | null
          upvoters?: Json | null
        }
      }
      job_postings: {
        Row: {
          career_level: string | null
          created_at: string | null
          id: string
          job_benefits: string | null
          job_category: string | null
          job_description: string | null
          job_expectedSalary: string | null
          job_location: string | null
          job_mode: string | null
          job_requirements: string[] | null
          job_tags: string[] | null
          job_title: string | null
          job_type: string | null
          job_workingHours: string | null
          uploader_company_size: string | null
          uploader_email: string | null
          uploader_legal_name: string | null
        }
        Insert: {
          career_level?: string | null
          created_at?: string | null
          id?: string
          job_benefits?: string | null
          job_category?: string | null
          job_description?: string | null
          job_expectedSalary?: string | null
          job_location?: string | null
          job_mode?: string | null
          job_requirements?: string[] | null
          job_tags?: string[] | null
          job_title?: string | null
          job_type?: string | null
          job_workingHours?: string | null
          uploader_company_size?: string | null
          uploader_email?: string | null
          uploader_legal_name?: string | null
        }
        Update: {
          career_level?: string | null
          created_at?: string | null
          id?: string
          job_benefits?: string | null
          job_category?: string | null
          job_description?: string | null
          job_expectedSalary?: string | null
          job_location?: string | null
          job_mode?: string | null
          job_requirements?: string[] | null
          job_tags?: string[] | null
          job_title?: string | null
          job_type?: string | null
          job_workingHours?: string | null
          uploader_company_size?: string | null
          uploader_email?: string | null
          uploader_legal_name?: string | null
        }
      }
      notif_hunters: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          link: string | null
          trigger_from: string | null
          trigger_to: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          link?: string | null
          trigger_from?: string | null
          trigger_to?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          link?: string | null
          trigger_from?: string | null
          trigger_to?: string | null
        }
      }
      public_jobs: {
        Row: {
          created_at: string | null
          full_description: string | null
          id: string
          job_location: string | null
          job_qualifications: string[] | null
          job_skills: string[] | null
          job_title: string | null
          job_type: string[] | null
          short_description: string | null
          uploader_id: string | null
        }
        Insert: {
          created_at?: string | null
          full_description?: string | null
          id?: string
          job_location?: string | null
          job_qualifications?: string[] | null
          job_skills?: string[] | null
          job_title?: string | null
          job_type?: string[] | null
          short_description?: string | null
          uploader_id?: string | null
        }
        Update: {
          created_at?: string | null
          full_description?: string | null
          id?: string
          job_location?: string | null
          job_qualifications?: string[] | null
          job_skills?: string[] | null
          job_title?: string | null
          job_type?: string[] | null
          short_description?: string | null
          uploader_id?: string | null
        }
      }
      public_posts: {
        Row: {
          comments: Json | null
          content: string | null
          createdAt: string | null
          id: string
          type: string | null
          updatedAt: string | null
          uploader: string | null
          uploaderID: string | null
          upvoters: Json | null
        }
        Insert: {
          comments?: Json | null
          content?: string | null
          createdAt?: string | null
          id: string
          type?: string | null
          updatedAt?: string | null
          uploader?: string | null
          uploaderID?: string | null
          upvoters?: Json | null
        }
        Update: {
          comments?: Json | null
          content?: string | null
          createdAt?: string | null
          id?: string
          type?: string | null
          updatedAt?: string | null
          uploader?: string | null
          uploaderID?: string | null
          upvoters?: Json | null
        }
      }
      user_hunters: {
        Row: {
          address: Json | null
          bio: string
          birthdate: string | null
          birthplace: string | null
          connections: Json | null
          created_at: string | null
          education: Json | null
          email: string | null
          full_name: Json | null
          gender: string | null
          id: string
          phone: string | null
          saved_jobs: Json | null
          skill_primary: string | null
          skill_secondary: Json | null
          social_media_links: Json | null
          subscription_type: string
          type: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          address?: Json | null
          bio?: string
          birthdate?: string | null
          birthplace?: string | null
          connections?: Json | null
          created_at?: string | null
          education?: Json | null
          email?: string | null
          full_name?: Json | null
          gender?: string | null
          id?: string
          phone?: string | null
          saved_jobs?: Json | null
          skill_primary?: string | null
          skill_secondary?: Json | null
          social_media_links?: Json | null
          subscription_type?: string
          type?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          address?: Json | null
          bio?: string
          birthdate?: string | null
          birthplace?: string | null
          connections?: Json | null
          created_at?: string | null
          education?: Json | null
          email?: string | null
          full_name?: Json | null
          gender?: string | null
          id?: string
          phone?: string | null
          saved_jobs?: Json | null
          skill_primary?: string | null
          skill_secondary?: Json | null
          social_media_links?: Json | null
          subscription_type?: string
          type?: string | null
          updated_at?: string | null
          username?: string | null
        }
      }
      user_provisioners: {
        Row: {
          address: Json | null
          alternativeNames: Json | null
          companyEmail: string | null
          companySize: string | null
          companyType: string | null
          contactInformation: Json | null
          foundingYear: number | null
          fullDescription: string | null
          id: string
          industryType: string | null
          jobPostings: Json | null
          legalName: string | null
          shortDescription: string | null
          socialProfiles: Json | null
          tags: Json | null
          type: string | null
          website: string | null
        }
        Insert: {
          address?: Json | null
          alternativeNames?: Json | null
          companyEmail?: string | null
          companySize?: string | null
          companyType?: string | null
          contactInformation?: Json | null
          foundingYear?: number | null
          fullDescription?: string | null
          id?: string
          industryType?: string | null
          jobPostings?: Json | null
          legalName?: string | null
          shortDescription?: string | null
          socialProfiles?: Json | null
          tags?: Json | null
          type?: string | null
          website?: string | null
        }
        Update: {
          address?: Json | null
          alternativeNames?: Json | null
          companyEmail?: string | null
          companySize?: string | null
          companyType?: string | null
          contactInformation?: Json | null
          foundingYear?: number | null
          fullDescription?: string | null
          id?: string
          industryType?: string | null
          jobPostings?: Json | null
          legalName?: string | null
          shortDescription?: string | null
          socialProfiles?: Json | null
          tags?: Json | null
          type?: string | null
          website?: string | null
        }
      }
    }
    Views: {
      recommended_hunters: {
        Row: {
          address: Json | null
          email: string | null
          fullname: Json | null
          id: string | null
          username: string | null
        }
      }
    }
    Functions: {
      get_hunter_by_id: {
        Args: {
          input_id: string
        }
        Returns: {
          address: Json | null
          bio: string
          birthdate: string | null
          birthplace: string | null
          connections: Json | null
          created_at: string | null
          education: Json | null
          email: string | null
          full_name: Json | null
          gender: string | null
          id: string
          phone: string | null
          saved_jobs: Json | null
          skill_primary: string | null
          skill_secondary: Json | null
          social_media_links: Json | null
          subscription_type: string
          type: string | null
          updated_at: string | null
          username: string | null
        }[]
      }
      getalljobs: {
        Args: Record<PropertyKey, never>
        Returns: {
          career_level: string | null
          created_at: string | null
          id: string
          job_benefits: string | null
          job_category: string | null
          job_description: string | null
          job_expectedSalary: string | null
          job_location: string | null
          job_mode: string | null
          job_requirements: string[] | null
          job_tags: string[] | null
          job_title: string | null
          job_type: string | null
          job_workingHours: string | null
          uploader_company_size: string | null
          uploader_email: string | null
          uploader_legal_name: string | null
        }[]
      }
      gethunter: {
        Args: {
          email_input: string
        }
        Returns: {
          address: Json | null
          bio: string
          birthdate: string | null
          birthplace: string | null
          connections: Json | null
          created_at: string | null
          education: Json | null
          email: string | null
          full_name: Json | null
          gender: string | null
          id: string
          phone: string | null
          saved_jobs: Json | null
          skill_primary: string | null
          skill_secondary: Json | null
          social_media_links: Json | null
          subscription_type: string
          type: string | null
          updated_at: string | null
          username: string | null
        }[]
      }
      gethunterbyusername: {
        Args: {
          username_input: string
        }
        Returns: {
          address: Json | null
          bio: string
          birthdate: string | null
          birthplace: string | null
          connections: Json | null
          created_at: string | null
          education: Json | null
          email: string | null
          full_name: Json | null
          gender: string | null
          id: string
          phone: string | null
          saved_jobs: Json | null
          skill_primary: string | null
          skill_secondary: Json | null
          social_media_links: Json | null
          subscription_type: string
          type: string | null
          updated_at: string | null
          username: string | null
        }[]
      }
      gethunterpostsbyid: {
        Args: {
          id_input: string
        }
        Returns: {
          comments: Json | null
          content: string | null
          createdAt: string | null
          id: string
          type: string | null
          updatedAt: string | null
          uploader: Json | null
          uploaderID: string | null
          upvoters: Json | null
        }[]
      }
      getpeoplebylocation: {
        Args: {
          in_location: string
        }
        Returns: {
          address: Json | null
          bio: string
          birthdate: string | null
          birthplace: string | null
          connections: Json | null
          created_at: string | null
          education: Json | null
          email: string | null
          full_name: Json | null
          gender: string | null
          id: string
          phone: string | null
          saved_jobs: Json | null
          skill_primary: string | null
          skill_secondary: Json | null
          social_media_links: Json | null
          subscription_type: string
          type: string | null
          updated_at: string | null
          username: string | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export interface IUserHunter {
  address: {
    address: string 
    city: string
    postalCode: string
  }
  bio: string
  birthdate: string
  birthplace: string
  connections: string[]
  created_at: string
  education: {
    degree: string | ""
    end_date: string | ""
    institution: string | ""
    major: string | ""
    start_date: string | ""
  }[]
  email: string
  full_name: {
    first: string 
    last: string
    middle: string
  }
  gender: "male" | "female" | "non-binary" | "other" | "prefer not to say"
  id: string
  phone: string | null
  saved_jobs: string[]
  skill_primary: string
  skill_secondary: string[]
  social_media_links: {
    facebook: string | ""
    instagram: string | ""
    linkedin: string | ""
    twitter: string | ""
    youtube: string | ""
    github: string | ""
  }
  subscription_type: "junior" | "senior" | "expert"
  type: "hunter"
  updated_at: string
  username: string
}

export interface IUserProvisioner {
  address: {
    address: string | null
    city: string | null
    postalCode: string | null
  }
  alternativeNames: string[]
  companyEmail: string
  companySize: string
  companyType: string
  contactInformation: {
    email: string
    phone: string | null
  }
  foundingYear: number
  fullDescription: string
  id: string
  industryType: string
  jobPostings: []
  legalName: string
  shortDescription: string
  socialProfiles: {
    facebook: string | ""
    instagram: string | ""
    linkedin: string | ""
    twitter: string | ""
    youtube: string | ""
    github: string | ""
  }
  tags: string[]
  type: "provisioner"
  website: string | ""
}

export interface IAccountData {
  id: string
  email: string
  encrypted_password: string
  raw_user_meta_data: Json | IUserHunter | IUserProvisioner
  created_at: string
  phone: string,
}

export type TBlogPostComment = {
  id: string
  content: string
  createdAt: string
  commenter: IUserHunter
}

export type THunterBlogPost = {
  comments: TBlogPostComment[]
  content: string
  createdAt: string | null
  id: string
  updatedAt: string | null
  uploader: IUserHunter
  upvoters: string[]
}

export interface TProvJobPost {
  id:                 string;
  uploader_id:        string;
  job_title:          string;
  full_description:   string;
  short_description:  string;
  job_qualifications: string[];
  job_location:       string;
  job_type:           string[];
  created_at:         string;
  job_skills:         string[];
}