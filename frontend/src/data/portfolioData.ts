/**
 * src/data/portfolioData.ts
 * Single source of truth for the Team Portfolio AI project.
 *
 * Architecture decisions:
 * - Exactly 3 team members (fixed tuple).
 * - Unlimited individual and team projects (readonly arrays).
 * - Local image paths under frontend/public/images/.
 * - All visitor-facing copy supports English and Thai.
 * - Sample data is explicitly marked and excluded from AI knowledge context.
 *
 * Backward compatibility:
 * - Existing fields used by current components are retained while the UI is
 *   migrated section by section.
 */

/* -------------------------------------------------------------------------- */
/* Shared primitives                                                           */
/* -------------------------------------------------------------------------- */

export type Language = 'en' | 'th';

export type MemberId = 'member-1' | 'member-2' | 'member-3';

/**
 * Store manually reviewed copy in both languages.
 * Empty strings are allowed while the team is still collecting information.
 */
export interface LocalizedText {
  readonly en: string;
  readonly th: string;
}

export interface ThemeColor {
  /** Main accent, e.g. for borders and glows. */
  readonly primary: string;
  /** Secondary accent, used in gradients. */
  readonly secondary: string;
  /** Soft glow color (rgba) for box-shadows. */
  readonly glow: string;
}

/** Legacy summary kept for the existing TeamHero component during migration. */
export interface ProjectSummary {
  readonly title: string;
  readonly description: string;
  readonly isPlaceholder?: boolean;
}

export interface ContactInfo {
  /** Legacy fields retained for TeamContact until it is migrated. */
  readonly githubUrl: string;
  readonly teamEmail: string;
  readonly linkedinUrl?: string;
  readonly websiteUrl?: string;
  readonly isPlaceholder?: boolean;
}

export interface MemberSocialLinks {
  readonly github?: string;
  readonly linkedin?: string;
  readonly portfolio?: string;
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

export type ProjectStatus = 'planned' | 'in-progress' | 'completed';

/** Shared shape for both personal projects and collaborative team projects. */
export interface ProjectBase {
  readonly id: string;
  readonly title: LocalizedText;
  readonly description: LocalizedText;
  readonly projectType?: LocalizedText;
  readonly year?: number;
  readonly technologies: readonly string[];
  readonly role?: LocalizedText;
  readonly responsibilities?: readonly LocalizedText[];
  readonly features?: readonly LocalizedText[];
  readonly result?: LocalizedText;
  /** Path relative to frontend/public, e.g. /images/projects/member-1/project.webp */
  readonly coverImage?: string;
  /** Additional paths relative to frontend/public. */
  readonly gallery?: readonly string[];
  readonly repositoryUrl?: string;
  readonly demoUrl?: string;
  /** True means this is demonstration content, not a verified portfolio claim. */
  readonly isPlaceholder: boolean;
}

/** A project owned by an individual member. The array is intentionally unlimited. */
export type IndividualProject = ProjectBase;

/** A project built collaboratively by the team. */
export interface TeamProject extends ProjectBase {
  readonly contributors: readonly MemberId[];
  readonly status: ProjectStatus;
  readonly isFeatured: boolean;
}

/* -------------------------------------------------------------------------- */
/* Skill sets                                                                  */
/* -------------------------------------------------------------------------- */

/** Role-discriminated skill structures retained for existing MemberCard logic. */
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

/* -------------------------------------------------------------------------- */
/* Members                                                                     */
/* -------------------------------------------------------------------------- */

interface MemberBase {
  readonly id: MemberId;
  readonly fullName: string;
  readonly nickname: string;
  /** Legacy English field retained for the existing MemberCard. */
  readonly roleName: string;
  /** New bilingual role field for the language-aware UI. */
  readonly roleNameI18n: LocalizedText;
  readonly introduction: LocalizedText;
  readonly biography: LocalizedText;
  /** Local path under frontend/public, e.g. /images/members/member-1.webp. */
  readonly avatar?: string;
  readonly socialLinks: MemberSocialLinks;
  readonly themeColor: ThemeColor;
  /** Legacy English field retained for the existing MemberCard. */
  readonly currentContributions: readonly string[];
  /** New bilingual equivalent for the upgraded UI and AI context. */
  readonly responsibilities: readonly LocalizedText[];
  /** Legacy single-project field retained during component migration. */
  readonly previousProject: ProjectSummary;
  /** New unlimited list of verified or clearly marked sample projects. */
  readonly projects: readonly IndividualProject[];
  /** Prevent unverified sample details from being presented as real facts. */
  readonly isPlaceholder: boolean;
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

/** Discriminated union: TypeScript narrows the skill structure through roleKey. */
export type Member = FrontendMember | BackendMember | DevOpsMember;

/* -------------------------------------------------------------------------- */
/* Group portfolio                                                             */
/* -------------------------------------------------------------------------- */

export interface GroupPortfolio {
  /** Legacy fields retained for current TeamHero and TeamContact components. */
  readonly teamName: string;
  readonly tagline: string;
  readonly coreStrengths: readonly [string, string, string, string];
  readonly jointProject: ProjectSummary;
  readonly contact: ContactInfo;

  /** New bilingual fields for the upgraded portfolio. */
  readonly teamNameI18n: LocalizedText;
  readonly taglineI18n: LocalizedText;
  readonly introduction: LocalizedText;
  readonly vision: LocalizedText;
  readonly coreStrengthsI18n: readonly [
    LocalizedText,
    LocalizedText,
    LocalizedText,
    LocalizedText,
  ];

  /** Local paths relative to frontend/public. */
  readonly logo?: string;
  readonly coverImage?: string;
  /** True while the team's official identity/details have not been confirmed. */
  readonly isPlaceholder: boolean;
}

export interface PortfolioData {
  readonly group: GroupPortfolio;
  /** Exactly 3 members, as decided for this team. */
  readonly members: readonly [Member, Member, Member];
  /** Unlimited collaborative projects. */
  readonly teamProjects: readonly TeamProject[];
}

/* -------------------------------------------------------------------------- */
/* Sample data                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * IMPORTANT:
 * Alex, Blair, Casey, their biographies, skills and personal projects below
 * are demonstration placeholders from the initial UI prototype. Replace them
 * with member-approved facts before publishing the portfolio or using them as
 * AI knowledge. Placeholder content is filtered by buildPortfolioContext().
 */
export const portfolioData: PortfolioData = {
  group: {
    // Legacy English fields — retained for current components.
    teamName: 'KNOW US. ASK AI.',
    tagline:
      'We turn ideas into impact.',
    coreStrengths: [
      'Cross-functional collaboration with clear API contracts',
      'Agile delivery with short, review-driven iterations',
      'Quality-first mindset: automated testing and CI/CD',
      'User-centered design backed by measurable performance',
    ],
    jointProject: {
      title: 'Chat AI with Group Portfolio',
      description:
        'A group portfolio website with an interactive AI chat interface. The React frontend is implemented; the Express backend, PostgreSQL persistence, and live AI integration are still in development.',
      isPlaceholder: false,
    },
    contact: {
      // These are prototype values. Replace before public release.
      githubUrl: 'https://github.com/team-nexus-alpha',
      teamEmail: 'team.nexus.alpha@example.com',
      isPlaceholder: true,
    },

    // New bilingual fields.
    teamNameI18n: {
      en: 'KNOW US. ASK AI.',
      th: 'รู้จักเรา แล้วถาม AI',
    },
    taglineI18n: {
      en: 'We turn ideas into impact.',
      th: 'เราเปลี่ยนไอเดียให้กลายเป็นผลงานที่สร้างคุณค่า',
    },
    introduction: {
      en: 'Placeholder: Add the team introduction after the members confirm the group profile.',
      th: 'ข้อความตัวอย่าง: เพิ่มคำแนะนำทีมหลังจากสมาชิกยืนยันข้อมูลกลุ่มแล้ว',
    },
    vision: {
      en: 'Placeholder: Add the team vision and shared goals.',
      th: 'ข้อความตัวอย่าง: เพิ่มวิสัยทัศน์และเป้าหมายร่วมกันของทีม',
    },
    coreStrengthsI18n: [
      {
        en: 'Cross-functional collaboration with clear API contracts',
        th: 'การทำงานร่วมกันข้ามสายงานโดยกำหนด API Contract ให้ชัดเจน',
      },
      {
        en: 'Agile delivery with short, review-driven iterations',
        th: 'การพัฒนาแบบ Agile โดยแบ่งงานเป็นรอบสั้นและตรวจสอบอย่างต่อเนื่อง',
      },
      {
        en: 'Quality-first mindset: automated testing and CI/CD',
        th: 'ให้ความสำคัญกับคุณภาพผ่าน Automated Testing และ CI/CD',
      },
      {
        en: 'User-centered design backed by measurable performance',
        th: 'ออกแบบโดยยึดผู้ใช้งานเป็นศูนย์กลางและคำนึงถึงประสิทธิภาพที่วัดผลได้',
      },
    ],
    logo: undefined,
    coverImage: undefined,
    isPlaceholder: true,
  },

  members: [
    {
      id: 'member-1',
      roleKey: 'frontend',
      fullName: 'Alex Frontier',
      nickname: 'Alex',
      roleName: 'Frontend Developer & UI/UX Designer',
      roleNameI18n: {
        en: 'Frontend Developer & UI/UX Designer',
        th: 'นักพัฒนา Frontend และนักออกแบบ UI/UX',
      },
      introduction: {
        en: 'Placeholder: Add a member-approved short introduction.',
        th: 'ข้อความตัวอย่าง: เพิ่มคำแนะนำตัวสั้น ๆ ที่สมาชิกยืนยันแล้ว',
      },
      biography: {
        en: 'Placeholder: Add the member biography and interests.',
        th: 'ข้อความตัวอย่าง: เพิ่มประวัติและความสนใจของสมาชิก',
      },
      avatar: undefined,
      socialLinks: {},
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
      responsibilities: [
        {
          en: 'Comprehensive UI/UX layout creation',
          th: 'ออกแบบ Layout และประสบการณ์ผู้ใช้งาน (UI/UX)',
        },
        {
          en: 'Architectural React component orchestration',
          th: 'วางโครงสร้างและจัดการ React Components',
        },
        {
          en: 'State management and component lifecycle design',
          th: 'จัดการ State และออกแบบวงจรการทำงานของ Components',
        },
        {
          en: 'Real-time asynchronous API integration hooks',
          th: 'เชื่อมต่อ API แบบ Asynchronous',
        },
      ],
      previousProject: {
        title: 'E-Commerce Minimalist Dashboard',
        description:
          'A clean analytics dashboard for online store owners, featuring responsive charts, order tracking and a fast, accessible interface.',
        isPlaceholder: true,
      },
      projects: [
        {
          id: 'member-1-sample-project-1',
          title: {
            en: 'E-Commerce Minimalist Dashboard',
            th: 'แดชบอร์ด E-Commerce แบบมินิมอล',
          },
          description: {
            en: 'A clean analytics dashboard for online store owners, featuring responsive charts, order tracking and a fast, accessible interface.',
            th: 'แดชบอร์ดวิเคราะห์ข้อมูลสำหรับร้านค้าออนไลน์ พร้อมกราฟที่รองรับหน้าจอหลายขนาด ระบบติดตามคำสั่งซื้อ และส่วนติดต่อที่ใช้งานง่าย',
          },
          projectType: {
            en: 'Web Application',
            th: 'เว็บแอปพลิเคชัน',
          },
          technologies: ['React', 'TypeScript'],
          coverImage: undefined,
          gallery: [],
          repositoryUrl: undefined,
          demoUrl: undefined,
          isPlaceholder: true,
        },
      ],
      isPlaceholder: true,
    },
    {
      id: 'member-2',
      roleKey: 'backend',
      fullName: 'Blair Serverton',
      nickname: 'Blair',
      roleName: 'Backend Developer & Database Engineer',
      roleNameI18n: {
        en: 'Backend Developer & Database Engineer',
        th: 'นักพัฒนา Backend และวิศวกรฐานข้อมูล',
      },
      introduction: {
        en: 'Placeholder: Add a member-approved short introduction.',
        th: 'ข้อความตัวอย่าง: เพิ่มคำแนะนำตัวสั้น ๆ ที่สมาชิกยืนยันแล้ว',
      },
      biography: {
        en: 'Placeholder: Add the member biography and interests.',
        th: 'ข้อความตัวอย่าง: เพิ่มประวัติและความสนใจของสมาชิก',
      },
      avatar: undefined,
      socialLinks: {},
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
      responsibilities: [
        {
          en: 'Developing RESTful APIs via Express',
          th: 'พัฒนา RESTful API ด้วย Express',
        },
        {
          en: 'Structuring relational database schemas for chat persistence',
          th: 'ออกแบบโครงสร้างฐานข้อมูลเชิงสัมพันธ์สำหรับจัดเก็บประวัติการสนทนา',
        },
        {
          en: 'Engineering system prompts for the AI assistant',
          th: 'ออกแบบ System Prompts สำหรับ AI Assistant',
        },
        {
          en: 'Building context-injection pipelines',
          th: 'พัฒนากระบวนการส่งข้อมูลบริบทให้ AI',
        },
      ],
      previousProject: {
        title: 'Task Management API Service',
        description:
          'A RESTful service for projects, tasks and teams with JWT authentication, role-based access and a normalized PostgreSQL schema.',
        isPlaceholder: true,
      },
      projects: [
        {
          id: 'member-2-sample-project-1',
          title: {
            en: 'Task Management API Service',
            th: 'บริการ API สำหรับจัดการงาน',
          },
          description: {
            en: 'A RESTful service for projects, tasks and teams with JWT authentication, role-based access and a normalized PostgreSQL schema.',
            th: 'บริการ RESTful สำหรับจัดการโปรเจกต์ งาน และทีม พร้อมตัวอย่างการยืนยันตัวตนด้วย JWT การกำหนดสิทธิ์ตามบทบาท และโครงสร้าง PostgreSQL ที่ผ่านการ Normalization',
          },
          projectType: {
            en: 'Backend API',
            th: 'Backend API',
          },
          technologies: ['Node.js', 'Express', 'PostgreSQL'],
          coverImage: undefined,
          gallery: [],
          repositoryUrl: undefined,
          demoUrl: undefined,
          isPlaceholder: true,
        },
      ],
      isPlaceholder: true,
    },
    {
      id: 'member-3',
      roleKey: 'devops',
      fullName: 'Casey Pipeline',
      nickname: 'Casey',
      roleName: 'DevOps & Full-Stack QA Engineer',
      roleNameI18n: {
        en: 'DevOps & Full-Stack QA Engineer',
        th: 'วิศวกร DevOps และการทดสอบระบบ Full-Stack',
      },
      introduction: {
        en: 'Placeholder: Add a member-approved short introduction.',
        th: 'ข้อความตัวอย่าง: เพิ่มคำแนะนำตัวสั้น ๆ ที่สมาชิกยืนยันแล้ว',
      },
      biography: {
        en: 'Placeholder: Add the member biography and interests.',
        th: 'ข้อความตัวอย่าง: เพิ่มประวัติและความสนใจของสมาชิก',
      },
      avatar: undefined,
      socialLinks: {},
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
      responsibilities: [
        {
          en: 'Containerizing deployment environments',
          th: 'จัดเตรียมสภาพแวดล้อมสำหรับ Deployment ด้วย Container',
        },
        {
          en: 'Orchestrating automated CI/CD workflows',
          th: 'จัดการ Workflow สำหรับ CI/CD อัตโนมัติ',
        },
        {
          en: 'Designing and executing integration and unit tests',
          th: 'ออกแบบและดำเนินการทดสอบ Integration Tests และ Unit Tests',
        },
      ],
      previousProject: {
        title: 'Automated Cloud Deployment Script',
        description:
          'A scripted pipeline that provisions a Linux server, builds Docker images and performs zero-downtime releases behind Nginx.',
        isPlaceholder: true,
      },
      projects: [
        {
          id: 'member-3-sample-project-1',
          title: {
            en: 'Automated Cloud Deployment Script',
            th: 'สคริปต์สำหรับ Deploy ระบบขึ้น Cloud อัตโนมัติ',
          },
          description: {
            en: 'A scripted pipeline that provisions a Linux server, builds Docker images and performs zero-downtime releases behind Nginx.',
            th: 'Pipeline Script สำหรับเตรียม Linux Server สร้าง Docker Images และ Deploy ระบบผ่าน Nginx โดยลดช่วงเวลาที่ระบบหยุดให้บริการ',
          },
          projectType: {
            en: 'DevOps Automation',
            th: 'ระบบอัตโนมัติด้าน DevOps',
          },
          technologies: ['Docker', 'Linux', 'Nginx'],
          coverImage: undefined,
          gallery: [],
          repositoryUrl: undefined,
          demoUrl: undefined,
          isPlaceholder: true,
        },
      ],
      isPlaceholder: true,
    },
  ],

  teamProjects: [
    {
      id: 'chat-ai-with-group-portfolio',
      title: {
        en: 'Chat AI with Group Portfolio',
        th: 'แชต AI พร้อม Portfolio ของกลุ่ม',
      },
      description: {
        en: 'A group portfolio website with an interactive AI chat interface. The React frontend is implemented; the Express backend, PostgreSQL persistence, and live AI integration are still in development.',
        th: 'เว็บไซต์ Portfolio ของกลุ่มที่มาพร้อมส่วนติดต่อสำหรับสนทนากับ AI โดยพัฒนา Frontend ด้วย React แล้ว ส่วน Express Backend การจัดเก็บประวัติด้วย PostgreSQL และการเชื่อมต่อ AI จริงยังอยู่ระหว่างพัฒนา',
      },
      projectType: {
        en: 'Web Application',
        th: 'เว็บแอปพลิเคชัน',
      },
      technologies: [
        'React',
        'TypeScript',
        'Vite',
        'Tailwind CSS',
        'React Router',
        'Vitest',
      ],
      features: [
        {
          en: 'Bilingual-ready team portfolio architecture',
          th: 'โครงสร้าง Portfolio ที่เตรียมรองรับภาษาไทยและภาษาอังกฤษ',
        },
        {
          en: 'Interactive chat interface with loading and error states',
          th: 'หน้าสนทนาแบบโต้ตอบ พร้อมสถานะ Loading และ Error',
        },
        {
          en: 'Automated frontend tests and GitHub Actions CI',
          th: 'Automated Tests สำหรับ Frontend และ CI ด้วย GitHub Actions',
        },
      ],
      contributors: ['member-1', 'member-2', 'member-3'],
      status: 'in-progress',
      isFeatured: true,
      isPlaceholder: false,
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Returns the requested language when available, otherwise falls back to the
 * other language. Returns an empty string when neither language has content.
 */
export const getLocalizedText = (
  value: LocalizedText,
  language: Language,
): string => {
  const preferred = value[language].trim();
  if (preferred) return preferred;

  const fallbackLanguage: Language = language === 'en' ? 'th' : 'en';
  return value[fallbackLanguage].trim();
};

export const getMemberById = (id: MemberId): Member | undefined =>
  portfolioData.members.find((member) => member.id === id);

/**
 * Builds a bilingual text context for a future backend context-injection step.
 * Placeholder group/member/personal-project data is deliberately excluded so
 * the AI cannot present fictional sample profiles as facts.
 */
export const buildPortfolioContext = (
  data: PortfolioData = portfolioData,
): string => {
  const lines: string[] = [
    'TEAM PORTFOLIO KNOWLEDGE',
    'The visitor may speak Thai or English. Detect the language of the latest user message and respond in that same language.',
    'Do not invent member identities, skills, experience, links, or project claims.',
    `Team size: exactly ${data.members.length} members.`,
  ];

  if (data.group.isPlaceholder) {
    lines.push(
      'Team profile: NOT YET VERIFIED. The current team name, introduction, vision, tagline, strengths, and contact values are placeholders. Do not present them as verified facts.',
    );
  } else {
    lines.push(`Team name (EN): ${data.group.teamNameI18n.en || data.group.teamName}`);
    lines.push(`Team name (TH): ${data.group.teamNameI18n.th || data.group.teamName}`);
    lines.push(`Tagline (EN): ${data.group.taglineI18n.en || data.group.tagline}`);
    lines.push(`Tagline (TH): ${data.group.taglineI18n.th || data.group.tagline}`);
    lines.push(`Introduction (EN): ${data.group.introduction.en || 'Not provided'}`);
    lines.push(`Introduction (TH): ${data.group.introduction.th || 'ยังไม่มีข้อมูล'}`);
    lines.push(`Vision (EN): ${data.group.vision.en || 'Not provided'}`);
    lines.push(`Vision (TH): ${data.group.vision.th || 'ยังไม่มีข้อมูล'}`);
    lines.push(
      `Core strengths: ${data.group.coreStrengthsI18n
        .map((item) => `${item.en || 'Not provided'} / ${item.th || 'ยังไม่มีข้อมูล'}`)
        .join('; ')}`,
    );
  }

  lines.push('', 'VERIFIED TEAM PROJECTS:');
  const verifiedTeamProjects = data.teamProjects.filter(
    (project) => !project.isPlaceholder,
  );

  if (verifiedTeamProjects.length === 0) {
    lines.push('No verified team projects have been provided yet.');
  } else {
    for (const project of verifiedTeamProjects) {
      lines.push(`- ${project.title.en} / ${project.title.th}`);
      lines.push(`  Description (EN): ${project.description.en || 'Not provided'}`);
      lines.push(`  Description (TH): ${project.description.th || 'ยังไม่มีข้อมูล'}`);
      lines.push(`  Status: ${project.status}`);
      lines.push(`  Technologies: ${project.technologies.join(', ') || 'Not provided'}`);
      if (project.features?.length) {
        lines.push(
          `  Features: ${project.features
            .map((feature) => `${feature.en} / ${feature.th}`)
            .join('; ')}`,
        );
      }
    }
  }

  lines.push('', 'TEAM MEMBERS:');
  for (const member of data.members) {
    if (member.isPlaceholder) {
      lines.push(
        `- ${member.id}: PROFILE NOT VERIFIED. The displayed name, role, biography, skills, responsibilities, social links, and personal projects are sample placeholders. Do not repeat them as facts.`,
      );
      continue;
    }

    lines.push(`- ${member.fullName} (${member.nickname})`);
    lines.push(`  Role (EN): ${member.roleNameI18n.en || member.roleName}`);
    lines.push(`  Role (TH): ${member.roleNameI18n.th || member.roleName}`);
    lines.push(`  Introduction (EN): ${member.introduction.en || 'Not provided'}`);
    lines.push(`  Introduction (TH): ${member.introduction.th || 'ยังไม่มีข้อมูล'}`);
    lines.push(`  Biography (EN): ${member.biography.en || 'Not provided'}`);
    lines.push(`  Biography (TH): ${member.biography.th || 'ยังไม่มีข้อมูล'}`);

    const skills = [
      ...member.skills.core,
      ...(member.roleKey === 'frontend'
        ? [...member.skills.designAndAnimation, ...member.skills.tools]
        : member.roleKey === 'backend'
          ? member.skills.toolsAndAI
          : [...member.skills.testing, ...member.skills.webServer]),
    ];
    lines.push(`  Skills: ${skills.join(', ')}`);
    lines.push(
      `  Responsibilities: ${member.responsibilities
        .map((item) => `${item.en} / ${item.th}`)
        .join('; ')}`,
    );

    const verifiedPersonalProjects = member.projects.filter(
      (project) => !project.isPlaceholder,
    );
    if (verifiedPersonalProjects.length === 0) {
      lines.push('  Verified individual projects: None provided yet.');
    } else {
      for (const project of verifiedPersonalProjects) {
        lines.push(`  Individual project: ${project.title.en} / ${project.title.th}`);
        lines.push(`    Description (EN): ${project.description.en || 'Not provided'}`);
        lines.push(`    Description (TH): ${project.description.th || 'ยังไม่มีข้อมูล'}`);
        lines.push(`    Technologies: ${project.technologies.join(', ')}`);
      }
    }
  }

  if (data.group.contact.isPlaceholder) {
    lines.push('', 'CONTACT: Team contact details are not verified. Do not share the sample contact values.');
  } else {
    lines.push('', `Team email: ${data.group.contact.teamEmail || 'Not provided'}`);
    lines.push(`Team GitHub: ${data.group.contact.githubUrl || 'Not provided'}`);
    if (data.group.contact.linkedinUrl) {
      lines.push(`Team LinkedIn: ${data.group.contact.linkedinUrl}`);
    }
    if (data.group.contact.websiteUrl) {
      lines.push(`Team website: ${data.group.contact.websiteUrl}`);
    }
  }

  return lines.join('\n');
};
