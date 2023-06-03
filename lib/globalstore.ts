import { atom, map } from "nanostores";

import { IUserHunter } from "./types";
import { persistentAtom } from "@nanostores/persistent";

// local stores
const $HunterAccountData = map<IUserHunter>({
	activeJob: "",
	address: {
		address: "",
		city: "",
		postalCode: "",
	},
	email: "",
	applied_jobs: [],
	avatar_url: "",
	banner_url: "",
	bio: "",
	birthdate: "",
	birthplace: "",
	citizenship: "",
	civil_status: "" as
		| "single"
		| "married"
		| "divorced"
		| "widowed"
		| "separated",
	connections: [],
	cover_letter: "",
	created_at: "",
	education: [],
	experience: [],
	followedCompanies: [],
	full_name: {
		first: "",
		last: "",
		middle: "",
	},
	gender: "" as
		| "male"
		| "female"
		| "non-binary"
		| "other"
		| "prefer not to say",
	id: "",
	id_number: "",
	id_type: "" as "national id" | "passport" | "driver's license" | "other",
	is_verified: false,
	phone: "",
	saved_jobs: [],
	skill_primary: "",
	skill_secondary: [],
	social_media_links: {
		facebook: "",
		github: "",
		instagram: "",
		linkedin: "",
		twitter: "",
		youtube: "",
	},
	subscription_type: "" as "junior" | "senior" | "expert",
	trainings: [],
	type: "hunter",
	updated_at: "",
	username: "",
});

// persistent stores
const $SolidAccountType = persistentAtom<"visitor" | "hunter" | "provisioner">(
	"data-account-type",
	"visitor",
);
const $SolidHunterAccountData = persistentAtom<IUserHunter>(
	"data-hunter",
	{
		activeJob: "",
		address: {
			address: "",
			city: "",
			postalCode: "",
		},
		email: "",
		applied_jobs: [],
		avatar_url: "",
		banner_url: "",
		bio: "",
		birthdate: "",
		birthplace: "",
		citizenship: "",
		civil_status: "" as
			| "single"
			| "married"
			| "divorced"
			| "widowed"
			| "separated",
		connections: [],
		cover_letter: "",
		created_at: "",
		education: [],
		experience: [],
		followedCompanies: [],
		full_name: {
			first: "",
			last: "",
			middle: "",
		},
		gender: "" as
			| "male"
			| "female"
			| "non-binary"
			| "other"
			| "prefer not to say",
		id: "",
		id_number: "",
		id_type: "" as "national id" | "passport" | "driver's license" | "other",
		is_verified: false,
		phone: "",
		saved_jobs: [],
		skill_primary: "",
		skill_secondary: [],
		social_media_links: {
			facebook: "",
			github: "",
			instagram: "",
			linkedin: "",
			twitter: "",
			youtube: "",
		},
		subscription_type: "" as "junior" | "senior" | "expert",
		trainings: [],
		type: "hunter",
		updated_at: "",
		username: "",
	},
	{
		encode: JSON.stringify,
		decode: JSON.parse,
	},
);

// export stores
export { $SolidAccountType, $HunterAccountData, $SolidHunterAccountData };
