const $schema_hunter = {
  address: {
    address: "",
    city: "",
    postalCode: "",
  },
  birthdate: "",
  birthplace: "",
  connections: [],
  createdAt: "",
  education: [],
  email: "",
  gender: "",
  id: "",
  fullName: {
    first: "",
    last: "",
    middle: "",
  },
  phone: "",
  skillPrimary: "",
  skillSecondary: [],
  socialMediaLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  },
  type: "",
  updatedAt: "",
  username: "",
};

const $schema_provisioner = {
  address: {
    address: "",
    city: "",
    postalCode: "",
    state: ""
  },
  alternativeNames: [],
  companySize: "",
  companyType: "",
  contactInformation: {
    email: "",
    phone: ""
  },
  foundingYear: 0,
  fullDescription: "",
  id: "",
  industryType: "",
  jobPostings: [],
  legalName: "",
  shortDescription: "",
  socialProfiles: {
    facebook: "",
    github: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    youtube: ""
  },
  tags: [],
  type: "",
  website: ""
}

export {
  $schema_hunter,
  $schema_provisioner
};
