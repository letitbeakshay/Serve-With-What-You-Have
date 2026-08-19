// Field configuration for the v1 onboarding form.
//
// This file is the single source of truth for what the public form asks,
// how it is validated, which fields depend on other fields, and how the
// admin panel labels codes back into readable text. The DB schema
// (prisma/schema.prisma) and the form/admin UI both read from here instead
// of hardcoding option lists, so a v2 field set can be added later as a
// sibling file without a rewrite.

export const FIELD_SET_VERSION = "v1";
export const DECLARATIONS_VERSION = "v1";

export type Option = {
  value: string;
  label: string;
};

export type GroupedOption = Option & {
  group: string;
};

// ---------------------------------------------------------------------------
// Section 1: Basic identity
// ---------------------------------------------------------------------------

export const ORG_TYPE_OPTIONS: GroupedOption[] = [
  { group: "Children", value: "orphanage_childrens_home", label: "Orphanage or children's home" },
  { group: "Children", value: "cci_jj_act", label: "Child care institution (registered under JJ Act)" },
  { group: "Children", value: "adoption_agency", label: "Adoption agency" },
  { group: "Children", value: "shelter_street_children", label: "Shelter home for street children" },
  { group: "Children", value: "foster_family_care", label: "Foster or family-based care group" },

  { group: "Education", value: "school_govt_aided", label: "School (government aided)" },
  { group: "Education", value: "school_private_low_income", label: "School (private, low income)" },
  { group: "Education", value: "tuition_study_centre", label: "Tuition or study centre" },
  { group: "Education", value: "anganwadi", label: "Anganwadi or early learning centre" },
  { group: "Education", value: "vocational_training_centre", label: "Vocational or skills training centre" },
  { group: "Education", value: "student_hostel", label: "Hostel for students" },

  { group: "Elderly", value: "old_age_home", label: "Old age home" },
  { group: "Elderly", value: "day_care_elderly", label: "Day care centre for the elderly" },
  { group: "Elderly", value: "palliative_hospice_care", label: "Palliative or hospice care" },

  { group: "Women", value: "womens_shelter_home", label: "Women's shelter home" },
  { group: "Women", value: "single_mothers_home", label: "Home for single mothers" },
  { group: "Women", value: "survivors_violence_home", label: "Home for survivors of violence" },
  { group: "Women", value: "womens_shg", label: "Women's self help group or collective" },

  { group: "Disability and health", value: "disability_home", label: "Home for people with disabilities" },
  { group: "Disability and health", value: "special_school", label: "Special school" },
  { group: "Disability and health", value: "rehabilitation_centre", label: "Rehabilitation centre" },
  { group: "Disability and health", value: "mental_health_centre", label: "Mental health care centre" },
  { group: "Disability and health", value: "deaddiction_centre", label: "De-addiction centre" },
  { group: "Disability and health", value: "charitable_hospital_clinic", label: "Hospital or clinic (charitable)" },

  { group: "Shelter and relief", value: "night_shelter", label: "Night shelter or homeless shelter" },
  { group: "Shelter and relief", value: "migrant_worker_support_group", label: "Migrant worker support group" },
  { group: "Shelter and relief", value: "disaster_relief_group", label: "Disaster relief group" },

  { group: "Community and faith", value: "community_group_unregistered", label: "Community group (unregistered)" },
  { group: "Community and faith", value: "self_help_group", label: "Self help group" },
  { group: "Community and faith", value: "faith_based_group", label: "Church, temple, mosque or other faith based group" },
  { group: "Community and faith", value: "youth_group", label: "Youth group" },

  { group: "Umbrella", value: "registered_ngo", label: "Registered NGO (general)" },
  { group: "Umbrella", value: "trust_or_foundation", label: "Trust or foundation" },
  { group: "Umbrella", value: "corporate_csr_arm", label: "Corporate CSR arm" },
  { group: "Umbrella", value: "other", label: "Other" },
];

// ---------------------------------------------------------------------------
// Section 2: Registration and location
// ---------------------------------------------------------------------------

export const REGISTRATION_STATUS_OPTIONS: Option[] = [
  { value: "YES", label: "Yes" },
  { value: "NO", label: "No" },
  { value: "IN_PROCESS", label: "In process" },
];

export const INDIAN_STATES: string[] = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// ---------------------------------------------------------------------------
// Section 3: Contact
// ---------------------------------------------------------------------------

export const DEFAULT_PHONE_COUNTRY_CODE = "+91";

export const COUNTRY_CODES: Option[] = [
  { value: "+91", label: "India (+91)" },
  { value: "+1", label: "USA / Canada (+1)" },
  { value: "+44", label: "United Kingdom (+44)" },
  { value: "+971", label: "UAE (+971)" },
  { value: "+65", label: "Singapore (+65)" },
  { value: "+61", label: "Australia (+61)" },
  { value: "+94", label: "Sri Lanka (+94)" },
  { value: "+977", label: "Nepal (+977)" },
  { value: "+880", label: "Bangladesh (+880)" },
];

// ---------------------------------------------------------------------------
// Section 4: Scale
// ---------------------------------------------------------------------------

export const AGE_BANDS: Option[] = [
  { value: "under_2", label: "Under 2 years" },
  { value: "2_to_5", label: "2 to 5 years" },
  { value: "6_to_10", label: "6 to 10 years" },
  { value: "11_to_14", label: "11 to 14 years" },
  { value: "15_to_18", label: "15 to 18 years" },
  { value: "19_to_25", label: "19 to 25 years" },
  { value: "26_to_60", label: "26 to 60 years" },
  { value: "above_60", label: "Above 60 years" },
];

export type HeadcountValue = Record<string, { male: number; female: number }>;

export const WHO_SERVE_OPTIONS: Option[] = [
  { value: "children", label: "Children" },
  { value: "infants_toddlers", label: "Infants and toddlers" },
  { value: "youth_leaving_care", label: "Young people leaving care (18 to 25)" },
  { value: "women", label: "Women" },
  { value: "single_mothers", label: "Single mothers" },
  { value: "survivors_violence_trafficking", label: "Survivors of violence or trafficking" },
  { value: "elderly", label: "Elderly" },
  { value: "physical_disabilities", label: "People with physical disabilities" },
  { value: "intellectual_developmental_disabilities", label: "People with intellectual or developmental disabilities" },
  { value: "mental_health_conditions", label: "People with mental health conditions" },
  { value: "chronic_terminal_illness", label: "People with chronic or terminal illness" },
  { value: "homeless_people", label: "Homeless people" },
  { value: "families_in_crisis", label: "Families in crisis" },
  { value: "migrant_workers", label: "Migrant workers" },
  { value: "daily_wage_workers", label: "Daily wage workers" },
  { value: "students", label: "Students" },
  { value: "recovery_from_addiction", label: "People in recovery from addiction" },
  { value: "transgender_people", label: "Transgender people" },
  { value: "disaster_displacement", label: "People affected by disaster or displacement" },
  { value: "animals", label: "Animals" },
  { value: "other", label: "Other" },
];

// ---------------------------------------------------------------------------
// Section 5: What they need
// ---------------------------------------------------------------------------

export const SUPPORT_OPTIONS: Option[] = [
  { value: "clothes", label: "Clothes" },
  { value: "footwear", label: "Footwear" },
  { value: "bedsheets_blankets_linen", label: "Bedsheets, blankets and linen" },
  { value: "food_and_provisions", label: "Food and provisions" },
  { value: "cooked_meals", label: "Cooked meals" },
  { value: "toiletries_hygiene_items", label: "Toiletries and hygiene items" },
  { value: "sanitary_products", label: "Sanitary products" },
  { value: "books_study_material", label: "Books and study material" },
  { value: "stationery", label: "Stationery" },
  { value: "school_bags_and_uniforms", label: "School bags and uniforms" },
  { value: "toys_and_games", label: "Toys and games" },
  { value: "sports_equipment", label: "Sports equipment" },
  { value: "furniture", label: "Furniture" },
  { value: "electronics_and_appliances", label: "Electronics and appliances" },
  { value: "utensils_and_kitchen_items", label: "Utensils and kitchen items" },
  { value: "medical_supplies", label: "Medical supplies" },
  { value: "mobility_aids", label: "Mobility aids (wheelchairs, walkers, crutches)" },
  { value: "volunteers_on_site", label: "Volunteers on site" },
  { value: "skill_sessions_or_workshops", label: "Skill sessions or workshops" },
  { value: "mentoring_or_tutoring", label: "Mentoring or tutoring" },
  { value: "professional_help", label: "Professional help (legal, medical, accounts, design)" },
  { value: "blood_donors", label: "Blood donors" },
  { value: "help_with_events_or_festivals", label: "Help with events or festivals" },
  { value: "transport_or_vehicle_help", label: "Transport or vehicle help" },
  { value: "job_or_internship_opportunities", label: "Job or internship opportunities" },
  { value: "other", label: "Other" },
];

export const VOLUNTEER_HELP_OPTIONS: Option[] = [
  { value: "teaching_or_tutoring", label: "Teaching or tutoring" },
  { value: "skills_or_workshops", label: "Skills or workshops" },
  { value: "events_and_activities", label: "Events and activities" },
  { value: "cooking_or_serving_meals", label: "Cooking or serving meals" },
  { value: "cleaning_and_maintenance", label: "Cleaning and maintenance" },
  { value: "admin_or_office_help", label: "Admin or office help" },
  { value: "sorting_and_packing_donations", label: "Sorting and packing donations" },
  { value: "spending_time_with_residents", label: "Spending time with residents" },
  { value: "other", label: "Other" },
];

// ---------------------------------------------------------------------------
// Declarations. Required checkboxes shown right before submit. If the wording
// changes, bump DECLARATIONS_VERSION above and add a new array here rather
// than editing an existing version, so past consent stays reconstructable.
// ---------------------------------------------------------------------------

export const DECLARATIONS: { key: string; text: string }[] = [
  {
    key: "accurate_and_authorised",
    text: "I confirm the information above is accurate and I am authorised to submit it on behalf of this organisation.",
  },
  {
    key: "no_money_or_items_handled",
    text: "I understand Serve With What You Have does not collect money, does not handle donated items, and does not act on behalf of my organisation.",
  },
  {
    key: "public_display",
    text: "I understand my organisation's details may be displayed publicly on the site so that people can contact us directly.",
  },
  {
    key: "will_inform_of_changes",
    text: "I agree to inform Serve With What You Have if any of these details change.",
  },
  {
    key: "consent_storage_and_display",
    text: "I consent to the storage and display of the information above.",
  },
];

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export const PHONE_REGEX = /^\d{10}$/;
export const PIN_CODE_REGEX = /^\d{6}$/;
export const URL_REGEX = /^https?:\/\/[^\s]+\.[^\s]+$/i;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Steps. Each step lists the field keys shown on it, in order. showIf lets a
// field declare that it only renders when another field's value matches, for
// the small number of conditional fields in this field set.
// ---------------------------------------------------------------------------

export type ShowIf = {
  field: string;
  equals?: string;
  notEquals?: string;
  includes?: string; // for array-valued fields like whoServe
};

export type FieldKey =
  | "orgName"
  | "orgType"
  | "orgTypeOther"
  | "isRegistered"
  | "registrationNumber"
  | "yearStarted"
  | "city"
  | "state"
  | "pinCode"
  | "fullAddress"
  | "mapsLink"
  | "contactName"
  | "contactRole"
  | "phone"
  | "altPhone"
  | "email"
  | "headcounts"
  | "whoServe"
  | "whoServeOther"
  | "supportOffered"
  | "supportOfferedOther"
  | "mostNeeded"
  | "volunteerHelp"
  | "volunteerHelpOther"
  | "website"
  | "facebook"
  | "instagram"
  | "youtube"
  | "additionalNotes"
  | "declarations";

export type StepDefinition = {
  id: string;
  title: string;
  fields: { key: FieldKey; required: boolean; showIf?: ShowIf }[];
};

export const STEPS: StepDefinition[] = [
  {
    id: "basic_identity",
    title: "Basic identity",
    fields: [
      { key: "orgName", required: true },
      { key: "orgType", required: true },
      { key: "orgTypeOther", required: true, showIf: { field: "orgType", equals: "other" } },
    ],
  },
  {
    id: "registration_location",
    title: "Registration and location",
    fields: [
      { key: "isRegistered", required: true },
      { key: "registrationNumber", required: false, showIf: { field: "isRegistered", notEquals: "NO" } },
      { key: "yearStarted", required: false },
      { key: "city", required: true },
      { key: "state", required: true },
      { key: "pinCode", required: true },
      { key: "fullAddress", required: true },
      { key: "mapsLink", required: false },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    fields: [
      { key: "contactName", required: true },
      { key: "contactRole", required: true },
      { key: "phone", required: true },
      { key: "altPhone", required: false },
      { key: "email", required: false },
    ],
  },
  {
    id: "scale_and_who_you_serve",
    title: "Scale and who you serve",
    fields: [
      { key: "headcounts", required: false },
      { key: "whoServe", required: false },
      { key: "whoServeOther", required: true, showIf: { field: "whoServe", includes: "other" } },
    ],
  },
  {
    id: "what_they_need",
    title: "What they need",
    fields: [
      { key: "supportOffered", required: true },
      { key: "supportOfferedOther", required: true, showIf: { field: "supportOffered", includes: "other" } },
      { key: "mostNeeded", required: true },
      { key: "volunteerHelp", required: false },
      { key: "volunteerHelpOther", required: true, showIf: { field: "volunteerHelp", includes: "other" } },
    ],
  },
  {
    id: "presence_and_declarations",
    title: "Presence and declarations",
    fields: [
      { key: "website", required: false },
      { key: "facebook", required: false },
      { key: "instagram", required: false },
      { key: "youtube", required: false },
      { key: "additionalNotes", required: false },
      { key: "declarations", required: true },
    ],
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers for the admin panel, which needs to turn stored codes back
// into readable labels without re-deriving the option lists.
// ---------------------------------------------------------------------------

function buildLabelMap(options: Option[]): Record<string, string> {
  return Object.fromEntries(options.map((o) => [o.value, o.label]));
}

export const ORG_TYPE_LABELS = buildLabelMap(ORG_TYPE_OPTIONS);
export const WHO_SERVE_LABELS = buildLabelMap(WHO_SERVE_OPTIONS);
export const SUPPORT_LABELS = buildLabelMap(SUPPORT_OPTIONS);
export const VOLUNTEER_HELP_LABELS = buildLabelMap(VOLUNTEER_HELP_OPTIONS);
export const AGE_BAND_LABELS = buildLabelMap(AGE_BANDS);
