export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json }
	| Json[];

export interface Database {
		public: {
			Tables: {
				notif_hunters: {
					Row: {
						created_at: string | null;
						description: string | null;
						id: string;
						link: string | null;
						trigger_from: string | null;
						trigger_to: string | null;
					};
					Insert: {
						created_at?: string | null;
						description?: string | null;
						id?: string;
						link?: string | null;
						trigger_from?: string | null;
						trigger_to?: string | null;
					};
					Update: {
						created_at?: string | null;
						description?: string | null;
						id?: string;
						link?: string | null;
						trigger_from?: string | null;
						trigger_to?: string | null;
					};
				};
				public_jobs: {
					Row: {
						applicants: string[] | null;
						created_at: string | null;
						draft: boolean | null;
						full_description: string | null;
						id: string;
						job_location: string | null;
						job_qualifications: string[] | null;
						job_skills: string[] | null;
						job_title: string | null;
						job_type: string[] | null;
						short_description: string | null;
						uploader_id: string | null;
					};
					Insert: {
						applicants?: string[] | null;
						created_at?: string | null;
						draft?: boolean | null;
						full_description?: string | null;
						id?: string;
						job_location?: string | null;
						job_qualifications?: string[] | null;
						job_skills?: string[] | null;
						job_title?: string | null;
						job_type?: string[] | null;
						short_description?: string | null;
						uploader_id?: string | null;
					};
					Update: {
						applicants?: string[] | null;
						created_at?: string | null;
						draft?: boolean | null;
						full_description?: string | null;
						id?: string;
						job_location?: string | null;
						job_qualifications?: string[] | null;
						job_skills?: string[] | null;
						job_title?: string | null;
						job_type?: string[] | null;
						short_description?: string | null;
						uploader_id?: string | null;
					};
				};
				public_posts: {
					Row: {
						comments: Json | null;
						content: string | null;
						createdAt: string | null;
						draft: boolean | null;
						id: string;
						type: string | null;
						updatedAt: string | null;
						uploader: string | null;
						upvoters: Json | null;
					};
					Insert: {
						comments?: Json | null;
						content?: string | null;
						createdAt?: string | null;
						draft?: boolean | null;
						id: string;
						type?: string | null;
						updatedAt?: string | null;
						uploader?: string | null;
						upvoters?: Json | null;
					};
					Update: {
						comments?: Json | null;
						content?: string | null;
						createdAt?: string | null;
						draft?: boolean | null;
						id?: string;
						type?: string | null;
						updatedAt?: string | null;
						uploader?: string | null;
						upvoters?: Json | null;
					};
				};
				public_provposts: {
					Row: {
						comments: Json | null;
						content: string | null;
						createdAt: string | null;
						draft: boolean | null;
						id: string;
						type: string | null;
						updatedAt: string | null;
						uploader: string | null;
						upvoters: Json | null;
					};
					Insert: {
						comments?: Json | null;
						content?: string | null;
						createdAt?: string | null;
						draft?: boolean | null;
						id: string;
						type?: string | null;
						updatedAt?: string | null;
						uploader?: string | null;
						upvoters?: Json | null;
					};
					Update: {
						comments?: Json | null;
						content?: string | null;
						createdAt?: string | null;
						draft?: boolean | null;
						id?: string;
						type?: string | null;
						updatedAt?: string | null;
						uploader?: string | null;
						upvoters?: Json | null;
					};
				};
				user_hunters: {
					Row: {
						activeJob: string | null;
						address: Json | null;
						applied_jobs: string[] | null;
						avatar_url: string | null;
						banner_url: string | null;
						bio: string;
						birthdate: string | null;
						birthplace: string | null;
						citizenship: string | null;
						civil_status: string | null;
						connections: Json | null;
						cover_letter: string;
						created_at: string | null;
						education: Json | null;
						email: string | null;
						experience: Json | null;
						followedCompanies: string[] | null;
						full_name: Json | null;
						gender: string | null;
						id: string;
						id_number: string | null;
						id_type: string | null;
						is_verified: boolean;
						phone: string | null;
						saved_jobs: Json | null;
						skill_primary: string | null;
						skill_secondary: Json | null;
						social_media_links: Json | null;
						subscription_type: string;
						trainings: Json;
						type: string | null;
						updated_at: string | null;
						username: string | null;
					};
					Insert: {
						activeJob?: string | null;
						address?: Json | null;
						applied_jobs?: string[] | null;
						avatar_url?: string | null;
						banner_url?: string | null;
						bio?: string;
						birthdate?: string | null;
						birthplace?: string | null;
						citizenship?: string | null;
						civil_status?: string | null;
						connections?: Json | null;
						cover_letter?: string;
						created_at?: string | null;
						education?: Json | null;
						email?: string | null;
						experience?: Json | null;
						followedCompanies?: string[] | null;
						full_name?: Json | null;
						gender?: string | null;
						id?: string;
						id_number?: string | null;
						id_type?: string | null;
						is_verified?: boolean;
						phone?: string | null;
						saved_jobs?: Json | null;
						skill_primary?: string | null;
						skill_secondary?: Json | null;
						social_media_links?: Json | null;
						subscription_type?: string;
						trainings?: Json;
						type?: string | null;
						updated_at?: string | null;
						username?: string | null;
					};
					Update: {
						activeJob?: string | null;
						address?: Json | null;
						applied_jobs?: string[] | null;
						avatar_url?: string | null;
						banner_url?: string | null;
						bio?: string;
						birthdate?: string | null;
						birthplace?: string | null;
						citizenship?: string | null;
						civil_status?: string | null;
						connections?: Json | null;
						cover_letter?: string;
						created_at?: string | null;
						education?: Json | null;
						email?: string | null;
						experience?: Json | null;
						followedCompanies?: string[] | null;
						full_name?: Json | null;
						gender?: string | null;
						id?: string;
						id_number?: string | null;
						id_type?: string | null;
						is_verified?: boolean;
						phone?: string | null;
						saved_jobs?: Json | null;
						skill_primary?: string | null;
						skill_secondary?: Json | null;
						social_media_links?: Json | null;
						subscription_type?: string;
						trainings?: Json;
						type?: string | null;
						updated_at?: string | null;
						username?: string | null;
					};
				};
				user_provisioners: {
					Row: {
						address: Json | null;
						alternativeNames: Json | null;
						avatar_url: string | null;
						banner_url: string | null;
						companyEmail: string | null;
						companySize: string | null;
						companyType: string | null;
						contactInformation: Json | null;
						followers: string[] | null;
						foundingYear: number | null;
						fullDescription: string | null;
						id: string;
						industryType: string | null;
						is_live: boolean | null;
						jobPostings: Json | null;
						legalName: string | null;
						shortDescription: string | null;
						socialProfiles: Json | null;
						tags: Json | null;
						totalVisits: number;
						type: string | null;
						website: string | null;
					};
					Insert: {
						address?: Json | null;
						alternativeNames?: Json | null;
						avatar_url?: string | null;
						banner_url?: string | null;
						companyEmail?: string | null;
						companySize?: string | null;
						companyType?: string | null;
						contactInformation?: Json | null;
						followers?: string[] | null;
						foundingYear?: number | null;
						fullDescription?: string | null;
						id?: string;
						industryType?: string | null;
						is_live?: boolean | null;
						jobPostings?: Json | null;
						legalName?: string | null;
						shortDescription?: string | null;
						socialProfiles?: Json | null;
						tags?: Json | null;
						totalVisits?: number;
						type?: string | null;
						website?: string | null;
					};
					Update: {
						address?: Json | null;
						alternativeNames?: Json | null;
						avatar_url?: string | null;
						banner_url?: string | null;
						companyEmail?: string | null;
						companySize?: string | null;
						companyType?: string | null;
						contactInformation?: Json | null;
						followers?: string[] | null;
						foundingYear?: number | null;
						fullDescription?: string | null;
						id?: string;
						industryType?: string | null;
						is_live?: boolean | null;
						jobPostings?: Json | null;
						legalName?: string | null;
						shortDescription?: string | null;
						socialProfiles?: Json | null;
						tags?: Json | null;
						totalVisits?: number;
						type?: string | null;
						website?: string | null;
					};
				};
			};
			Views: {
				new_recommended_hunters: {
					Row: {
						avatar_url: string | null;
						email: string | null;
						full_name: Json | null;
						id: string | null;
						username: string | null;
					};
				};
				recommended_hunters: {
					Row: {
						address: Json | null;
						email: string | null;
						fullname: Json | null;
						id: string | null;
						username: string | null;
					};
				};
			};
			Functions: {
				get_hunter_by_id: {
					Args: {
						input_id: string;
					};
					Returns: {
						activeJob: string | null;
						address: Json | null;
						applied_jobs: string[] | null;
						avatar_url: string | null;
						banner_url: string | null;
						bio: string;
						birthdate: string | null;
						birthplace: string | null;
						citizenship: string | null;
						civil_status: string | null;
						connections: Json | null;
						cover_letter: string;
						created_at: string | null;
						education: Json | null;
						email: string | null;
						experience: Json | null;
						followedCompanies: string[] | null;
						full_name: Json | null;
						gender: string | null;
						id: string;
						id_number: string | null;
						id_type: string | null;
						is_verified: boolean;
						phone: string | null;
						saved_jobs: Json | null;
						skill_primary: string | null;
						skill_secondary: Json | null;
						social_media_links: Json | null;
						subscription_type: string;
						trainings: Json;
						type: string | null;
						updated_at: string | null;
						username: string | null;
					}[];
				};
				gethunter: {
					Args: {
						email_input: string;
					};
					Returns: {
						activeJob: string | null;
						address: Json | null;
						applied_jobs: string[] | null;
						avatar_url: string | null;
						banner_url: string | null;
						bio: string;
						birthdate: string | null;
						birthplace: string | null;
						citizenship: string | null;
						civil_status: string | null;
						connections: Json | null;
						cover_letter: string;
						created_at: string | null;
						education: Json | null;
						email: string | null;
						experience: Json | null;
						followedCompanies: string[] | null;
						full_name: Json | null;
						gender: string | null;
						id: string;
						id_number: string | null;
						id_type: string | null;
						is_verified: boolean;
						phone: string | null;
						saved_jobs: Json | null;
						skill_primary: string | null;
						skill_secondary: Json | null;
						social_media_links: Json | null;
						subscription_type: string;
						trainings: Json;
						type: string | null;
						updated_at: string | null;
						username: string | null;
					}[];
				};
				gethunterbyusername: {
					Args: {
						username_input: string;
					};
					Returns: {
						activeJob: string | null;
						address: Json | null;
						applied_jobs: string[] | null;
						avatar_url: string | null;
						banner_url: string | null;
						bio: string;
						birthdate: string | null;
						birthplace: string | null;
						citizenship: string | null;
						civil_status: string | null;
						connections: Json | null;
						cover_letter: string;
						created_at: string | null;
						education: Json | null;
						email: string | null;
						experience: Json | null;
						followedCompanies: string[] | null;
						full_name: Json | null;
						gender: string | null;
						id: string;
						id_number: string | null;
						id_type: string | null;
						is_verified: boolean;
						phone: string | null;
						saved_jobs: Json | null;
						skill_primary: string | null;
						skill_secondary: Json | null;
						social_media_links: Json | null;
						subscription_type: string;
						trainings: Json;
						type: string | null;
						updated_at: string | null;
						username: string | null;
					}[];
				};
				getpeoplebylocation: {
					Args: {
						in_location: string;
					};
					Returns: {
						activeJob: string | null;
						address: Json | null;
						applied_jobs: string[] | null;
						avatar_url: string | null;
						banner_url: string | null;
						bio: string;
						birthdate: string | null;
						birthplace: string | null;
						citizenship: string | null;
						civil_status: string | null;
						connections: Json | null;
						cover_letter: string;
						created_at: string | null;
						education: Json | null;
						email: string | null;
						experience: Json | null;
						followedCompanies: string[] | null;
						full_name: Json | null;
						gender: string | null;
						id: string;
						id_number: string | null;
						id_type: string | null;
						is_verified: boolean;
						phone: string | null;
						saved_jobs: Json | null;
						skill_primary: string | null;
						skill_secondary: Json | null;
						social_media_links: Json | null;
						subscription_type: string;
						trainings: Json;
						type: string | null;
						updated_at: string | null;
						username: string | null;
					}[];
				};
				search_hunters: {
					Args: {
						searchquery: string;
					};
					Returns: {
						activeJob: string | null;
						address: Json | null;
						applied_jobs: string[] | null;
						avatar_url: string | null;
						banner_url: string | null;
						bio: string;
						birthdate: string | null;
						birthplace: string | null;
						citizenship: string | null;
						civil_status: string | null;
						connections: Json | null;
						cover_letter: string;
						created_at: string | null;
						education: Json | null;
						email: string | null;
						experience: Json | null;
						followedCompanies: string[] | null;
						full_name: Json | null;
						gender: string | null;
						id: string;
						id_number: string | null;
						id_type: string | null;
						is_verified: boolean;
						phone: string | null;
						saved_jobs: Json | null;
						skill_primary: string | null;
						skill_secondary: Json | null;
						social_media_links: Json | null;
						subscription_type: string;
						trainings: Json;
						type: string | null;
						updated_at: string | null;
						username: string | null;
					}[];
				};
				search_job: {
					Args: {
						searchquery: string;
					};
					Returns: {
						applicants: string[] | null;
						created_at: string | null;
						draft: boolean | null;
						full_description: string | null;
						id: string;
						job_location: string | null;
						job_qualifications: string[] | null;
						job_skills: string[] | null;
						job_title: string | null;
						job_type: string[] | null;
						short_description: string | null;
						uploader_id: string | null;
					}[];
				};
				search_provisioners: {
					Args: {
						searchquery: string;
					};
					Returns: {
						address: Json | null;
						alternativeNames: Json | null;
						avatar_url: string | null;
						banner_url: string | null;
						companyEmail: string | null;
						companySize: string | null;
						companyType: string | null;
						contactInformation: Json | null;
						followers: string[] | null;
						foundingYear: number | null;
						fullDescription: string | null;
						id: string;
						industryType: string | null;
						is_live: boolean | null;
						jobPostings: Json | null;
						legalName: string | null;
						shortDescription: string | null;
						socialProfiles: Json | null;
						tags: Json | null;
						totalVisits: number;
						type: string | null;
						website: string | null;
					}[];
				};
			};
			Enums: {
				[_ in never]: never;
			};
			CompositeTypes: {
				[_ in never]: never;
			};
		};
	}

export type HWorkExperience = {
	jobPosition: string;
	companyName: string;
	location: string;
	startDate: string;
	endDate: string;
	isCurrent: boolean;
	description: string;
};

export type HEducation = {
	institution: string;
	location: string;
	degreeType:
		| "primary"
		| "secondary"
		| "bachelor"
		| "master"
		| "doctorate"
		| "bachelor undergraduate"
		| "master undergraduate"
		| "doctorate undergraduate"
		| "other";
	degreeName: string;
	yearGraduated: string;
};

export type HTraining = {
	organizer: string;
	location: string;
	type: "short course" | "certificate" | "diploma" | "degree" | "other";
	title: string;
	date: string;
};

export interface IUserHunter {
		address: {
			address: string;
			city: string;
			postalCode: string;
		};
		activeJob: string;
		applied_jobs: string[];
		avatar_url: string;
		banner_url: string;
		bio: string;
		birthdate: string;
		birthplace: string;
		connections: string[];
		cover_letter: string;
		created_at: string;
		civil_status: "single" | "married" | "divorced" | "widowed" | "separated";
		citizenship: string;
		education: HEducation[];
		email: string;
		experience: HWorkExperience[];
		full_name: {
			first: string;
			last: string;
			middle: string;
		};
		followedCompanies: string[];
		gender: "male" | "female" | "non-binary" | "other" | "prefer not to say";
		id: string;
		id_type: "national id" | "passport" | "driver's license" | "other";
		id_number: string;
		is_verified: boolean;
		phone: string | "";
		saved_jobs: string[];
		skill_primary: string;
		skill_secondary: string[];
		social_media_links: {
			facebook: string | "";
			instagram: string | "";
			linkedin: string | "";
			twitter: string | "";
			youtube: string | "";
			github: string | "";
		};
		subscription_type: "junior" | "senior" | "expert";
		type: "hunter";
		trainings: HTraining[];
		updated_at: string;
		username: string;
	}

export interface IUserProvisioner {
	address: {
		address: string;
		city: string;
	};
	alternativeNames: string[];
	avatar_url: string;
	banner_url: string;
	companyEmail: string;
	companySize: string;
	companyType: string;
	contactInformation: {
		email: string;
		phone: string | null;
	};
	followers: string[];
	foundingYear: number;
	fullDescription: string;
	id: string;
	industryType: string;
	is_live: boolean;
	jobPostings: [];
	legalName: string;
	shortDescription: string;
	socialProfiles: {
		facebook: string | "";
		instagram: string | "";
		linkedin: string | "";
		twitter: string | "";
		youtube: string | "";
		github: string | "";
	};
	tags: string[];
	type: "provisioner";
	totalVisits: number;
	website: string | "";
}

export interface IAccountData {
	id: string;
	email: string;
	raw_user_meta_data: Json | IUserHunter | IUserProvisioner;
	created_at: string;
	phone: string;
	email_confirmed_at: string;
}

export type TBlogPostComment = {
	visible: boolean;
	id: string;
	content: string;
	createdAt: string;
	commenter: IUserHunter;
};

export type THunterBlogPost = {
	comments: TBlogPostComment[];
	content: string;
	createdAt: string | null;
	id: string;
	updatedAt: string | null;
	uploader: IUserHunter;
	upvoters: string[];
	draft: boolean;
};

export interface TProvJobPost {
	id: string;
	uploader_id: IUserProvisioner | string;
	job_title: string;
	full_description: string;
	short_description: string;
	job_qualifications: string[];
	job_location: string;
	job_type: string[];
	created_at: string;
	job_skills: string[];
	draft: boolean;
	applicants: string[];
}

export interface TProvBlogPost {
	content: string;
	createdAt: string | null;
	id: string;
	updatedAt: string | null;
	uploader: IUserProvisioner;
	upvoters: string[];
	type: "provblog" | "event";
	draft: boolean;
}
