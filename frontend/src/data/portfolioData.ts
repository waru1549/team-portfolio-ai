/**
 * src/data/portfolioData.ts
 * Single source of truth for the "Chat AI with Group Portfolio" project.
 * Strictly typed: no `any`, readonly data, role-discriminated skill sets.
 */

/* ------------------------------------------------------------------ */
/* Shared primitives                                                   */
/* ------------------------------------------------------------------ */

export type MemberId =
  | 'member-1'
  | 'member-2'
  | 'member-3';

export interface ThemeColor {
  /** Main accent, e.g. for borders and glows */
  readonly primary: string;
  /** Secondary accent, used in gradients */
  readonly secondary: string;
  /** Soft glow color (rgba) for box-shadows and the AI Orb context highlight */
  readonly glow: string;
}

export interface ProjectSummary {
  readonly title: string;
  readonly description: string;
}

export interface ContactInfo {
  readonly githubUrl: string;
  readonly teamEmail: string;
}

/* ------------------------------------------------------------------ */
/* Skill sets (one per role, so TypeScript can narrow by `roleKey`)    */
/* ------------------------------------------------------------------ */

export interface FrontendSkills {
  readonly core: readonly string[];
  readonly designAndAnimation: readonly string[];
  readonly tools: readonly string[];
}

export interface BackendSkills {
  readonly core: readonly string[];
  readonly toolsAndAI: readonly string[];
}

export interface DevOpsSkills {
  readonly core: readonly string[];
  readonly testing: readonly string[];
  readonly webServer: readonly string[];
}

interface MemberBase {
  readonly id: MemberId;
  readonly fullName: string;
  readonly nickname: string;
  readonly roleName: string;
  readonly themeColor: ThemeColor;
  readonly currentContributions: readonly string[];
  readonly previousProject: ProjectSummary;
}

export interface FrontendMember extends MemberBase {
  readonly roleKey: 'frontend';
  readonly skills: FrontendSkills;
}

export interface BackendMember extends MemberBase {
  readonly roleKey: 'backend';
  readonly skills: BackendSkills;
}

export interface DevOpsMember extends MemberBase {
  readonly roleKey: 'devops';
  readonly skills: DevOpsSkills;
}

/** Discriminated union: narrow with `member.roleKey` */
export type Member = FrontendMember | BackendMember | DevOpsMember;

/* ------------------------------------------------------------------ */
/* Group portfolio                                                     */
/* ------------------------------------------------------------------ */

export interface GroupPortfolio {
  readonly teamName: string;
  readonly tagline: string;
  /** Exactly 4 collaborative strengths */
  readonly coreStrengths: readonly [string, string, string, string];
  readonly jointProject: ProjectSummary;
  readonly contact: ContactInfo;
}

export interface PortfolioData {
  readonly group: GroupPortfolio;

  /**
   * Exactly 3 members.
   * Each member can have any supported role.
   */
  readonly members: readonly [
    Member,
    Member,
    Member
  ];
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

export const portfolioData: PortfolioData = {
  group: {
    teamName: 'KNOW US. ASK AI.',
    tagline:
      'Three disciplines, one signal: engineering conversational intelligence that is fast, reliable and beautiful.',
    coreStrengths: [
      'Cross-functional collaboration with clear API contracts',
      'Agile delivery with short, review-driven iterations',
      'Quality-first mindset: automated testing and CI/CD',
      'User-centered design backed by measurable performance',
    ],
    jointProject: {
      title: 'Chat AI with Group Portfolio',
      description:
        'A real-time conversational assistant that knows our team. Visitors explore the group and member portfolios, then ask the AI questions that are answered with injected portfolio context, backed by a secure REST API and a persistent chat store.',
    },
    contact: {
      githubUrl: 'https://github.com/team-nexus-alpha',
      teamEmail: 'team.nexus.alpha@example.com',
    },
  },

  members: [
    {
      id: 'member-1',
      roleKey: 'frontend',
      fullName: 'Alex Frontier',
      nickname: 'Alex',
      roleName: 'Frontend Developer & UI/UX Designer',
      themeColor: {
        primary: '#22d3ee',
        secondary: '#6366f1',
        glow: 'rgba(34, 211, 238, 0.35)',
      },
      skills: {
        core: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript'],
        designAndAnimation: ['Figma', 'Framer Motion', 'Responsive UX'],
        tools: ['Vite', 'Git/GitHub', 'npm'],
      },
      currentContributions: [
        'Comprehensive UI/UX layout creation',
        'Architectural React component orchestration',
        'State management and component lifecycle design',
        'Real-time asynchronous API integration hooks',
      ],
      previousProject: {
        title: 'E-Commerce Minimalist Dashboard',
        description:
          'A clean analytics dashboard for online store owners, featuring responsive charts, order tracking and a fast, accessible interface.',
      },
    },
    {
      id: 'member-2',
      roleKey: 'backend',
      fullName: 'Blair Serverton',
      nickname: 'Blair',
      roleName: 'Backend Developer & Database Engineer',
      themeColor: {
        primary: '#a78bfa',
        secondary: '#ec4899',
        glow: 'rgba(167, 139, 250, 0.35)',
      },
      skills: {
        core: ['Node.js', 'Express', 'PostgreSQL', 'SQL'],
        toolsAndAI: [
          'Postman',
          'Prisma ORM',
          'CORS configuration',
          'OpenAI/Claude API SDK',
          'Prompt Engineering',
        ],
      },
      currentContributions: [
        'Developing secure RESTful APIs via Express',
        'Structuring relational database schemas for chat persistence',
        'Engineering system prompts for the AI assistant',
        'Building context-injection pipelines',
      ],
      previousProject: {
        title: 'Task Management API Service',
        description:
          'A RESTful service for projects, tasks and teams with JWT authentication, role-based access and a normalized PostgreSQL schema.',
      },
    },
    {
      id: 'member-3',
      roleKey: 'devops',
      fullName: 'Casey Pipeline',
      nickname: 'Casey',
      roleName: 'DevOps & Full-Stack QA Engineer',
      themeColor: {
        primary: '#34d399',
        secondary: '#f59e0b',
        glow: 'rgba(52, 211, 153, 0.35)',
      },
      skills: {
        core: ['Docker', 'GitHub Actions', 'Linux Server'],
        testing: ['Jest', 'Supertest', 'React Testing Library'],
        webServer: ['Nginx', 'Docker Compose'],
      },
      currentContributions: [
        'Containerizing deployment environments',
        'Orchestrating automated CI/CD workflows',
        'Designing and executing core component integration and unit tests',
      ],
      previousProject: {
        title: 'Automated Cloud Deployment Script',
        description:
          'A scripted pipeline that provisions a Linux server, builds Docker images and performs zero-downtime releases behind Nginx.',
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Helpers (pure, typed)                                               */
/* ------------------------------------------------------------------ */

export const getMemberById = (id: MemberId): Member | undefined =>
  portfolioData.members.find((member) => member.id === id);

/**
 * Flattens the portfolio into plain text. Phase 4 will use this for the
 * "context injection" trigger sent to the backend with the chat request.
 */
export const buildPortfolioContext = (data: PortfolioData = portfolioData): string => {
  const { group, members } = data;
  const memberLines = members.map(
    (m) =>
      `- ${m.fullName} (${m.nickname}), ${m.roleName}. Contributions: ${m.currentContributions.join('; ')}. Previous project: ${m.previousProject.title}.`,
  );
  return [
    `Team: ${group.teamName}. ${group.tagline}`,
    `Strengths: ${group.coreStrengths.join('; ')}`,
    `Project: ${group.jointProject.title} - ${group.jointProject.description}`,
    'Members:',
    ...memberLines,
  ].join('\n');
};
