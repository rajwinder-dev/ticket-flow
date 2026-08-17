export interface SeedConfig {
  USER_COUNT: number;
  OWNER_COUNT: number;

  ORGANIZATIONS_COUNT: number;
  MEMBERS_COUNT: number;        // per organization

  GROUP_COUNT: number;          // per organization
  QUEUES_COUNT: number;         // per group

  CUSTOMER_COUNT: number;       // per organization
  TICKET_COUNT: number;         // per organization

  COMMENT_COUNT: number;       // per ticket
  TRANSITIONS_COUNT: number;    // per ticket

  INVITES_COUNT: number;        // per organization
}

export type SeedProfile =
  | 'tiny'
  | 'small'
  | 'medium'
  | 'large'
  | 'stress';

const PROFILES: Record<SeedProfile, SeedConfig> = {
  tiny: {
    USER_COUNT: 100,
    OWNER_COUNT: 5,

    ORGANIZATIONS_COUNT: 1,
    MEMBERS_COUNT: 100,

    GROUP_COUNT: 3,
    QUEUES_COUNT: 3,

    CUSTOMER_COUNT: 50,
    TICKET_COUNT: 10,

    COMMENT_COUNT: 2,
    TRANSITIONS_COUNT: 2,

    INVITES_COUNT: 5,
  },

  small: {
    USER_COUNT: 500,
    OWNER_COUNT: 25,

    ORGANIZATIONS_COUNT: 5,
    MEMBERS_COUNT: 100,

    GROUP_COUNT: 5,
    QUEUES_COUNT: 4,

    CUSTOMER_COUNT: 100,
    TICKET_COUNT: 50,

    COMMENT_COUNT: 3,
    TRANSITIONS_COUNT: 3,

    INVITES_COUNT: 10,
  },

  medium: {
    USER_COUNT: 1_000,
    OWNER_COUNT: 50,

    ORGANIZATIONS_COUNT: 10,
    MEMBERS_COUNT: 100,

    GROUP_COUNT: 8,
    QUEUES_COUNT: 5,

    CUSTOMER_COUNT: 250,
    TICKET_COUNT: 100,

    COMMENT_COUNT: 5,
    TRANSITIONS_COUNT: 3,

    INVITES_COUNT: 20,
  },

  large: {
    USER_COUNT: 10_000,
    OWNER_COUNT: 500,

    ORGANIZATIONS_COUNT: 100,
    MEMBERS_COUNT: 100,

    GROUP_COUNT: 10,
    QUEUES_COUNT: 8,

    CUSTOMER_COUNT: 500,
    TICKET_COUNT: 500,

    COMMENT_COUNT: 5,
    TRANSITIONS_COUNT: 3,

    INVITES_COUNT: 50,
  },

  stress: {
    USER_COUNT: 50_000,
    OWNER_COUNT: 2_500,

    ORGANIZATIONS_COUNT: 500,
    MEMBERS_COUNT: 100,

    GROUP_COUNT: 15,
    QUEUES_COUNT: 10,

    CUSTOMER_COUNT: 1_000,
    TICKET_COUNT: 1_000,

    COMMENT_COUNT: 5,
    TRANSITIONS_COUNT: 3,

    INVITES_COUNT: 100,
  },
};

export function generateSeedConfig(
  profile: SeedProfile = 'tiny',
): SeedConfig {
  return PROFILES[profile];
}
