// ── NextGig Mock Data ────────────────────────────────────────────────
// Seed data for the MVP: students, companies, opportunities, applications,
// skill taxonomy, learning paths, and recruiters.
// All match percentages are COMPUTED by lib/matching.ts — never hardcoded.

import type {
  SkillTaxonomyItem,
  Student,
  Company,
  Recruiter,
  Opportunity,
  Application,
  LearningPath,
} from "./types";

// ── Skill Taxonomy ───────────────────────────────────────────────────
// The canonical list of skills in the system. Every skill reference in
// students/opportunities should use an id from this taxonomy.

export const skillTaxonomy: SkillTaxonomyItem[] = [
  // Frontend
  { id: "react", name: "React", domain: "frontend", marketDemand: 92 },
  { id: "nextjs", name: "Next.js", domain: "frontend", marketDemand: 85 },
  { id: "typescript", name: "TypeScript", domain: "frontend", marketDemand: 88 },
  { id: "javascript", name: "JavaScript", domain: "frontend", marketDemand: 95 },
  { id: "html-css", name: "HTML/CSS", domain: "frontend", marketDemand: 90 },
  { id: "tailwind", name: "Tailwind CSS", domain: "frontend", marketDemand: 78 },
  { id: "vue", name: "Vue.js", domain: "frontend", marketDemand: 65 },
  { id: "angular", name: "Angular", domain: "frontend", marketDemand: 60 },
  { id: "figma", name: "Figma", domain: "frontend", marketDemand: 70 },

  // Backend
  { id: "nodejs", name: "Node.js", domain: "backend", marketDemand: 87 },
  { id: "python", name: "Python", domain: "backend", marketDemand: 94 },
  { id: "java", name: "Java", domain: "backend", marketDemand: 80 },
  { id: "golang", name: "Go", domain: "backend", marketDemand: 72 },
  { id: "rest-api", name: "REST APIs", domain: "backend", marketDemand: 88 },
  { id: "graphql", name: "GraphQL", domain: "backend", marketDemand: 62 },
  { id: "postgresql", name: "PostgreSQL", domain: "backend", marketDemand: 82 },
  { id: "mongodb", name: "MongoDB", domain: "backend", marketDemand: 75 },
  { id: "redis", name: "Redis", domain: "backend", marketDemand: 68 },

  // Data & AI
  { id: "machine-learning", name: "Machine Learning", domain: "data-ai", marketDemand: 90 },
  { id: "deep-learning", name: "Deep Learning", domain: "data-ai", marketDemand: 85 },
  { id: "nlp", name: "NLP", domain: "data-ai", marketDemand: 82 },
  { id: "pandas", name: "Pandas", domain: "data-ai", marketDemand: 86 },
  { id: "tensorflow", name: "TensorFlow", domain: "data-ai", marketDemand: 78 },
  { id: "pytorch", name: "PyTorch", domain: "data-ai", marketDemand: 83 },
  { id: "data-viz", name: "Data Visualization", domain: "data-ai", marketDemand: 74 },
  { id: "sql", name: "SQL", domain: "data-ai", marketDemand: 92 },
  { id: "spark", name: "Apache Spark", domain: "data-ai", marketDemand: 70 },

  // Cloud & DevOps
  { id: "aws", name: "AWS", domain: "cloud", marketDemand: 91 },
  { id: "gcp", name: "Google Cloud", domain: "cloud", marketDemand: 80 },
  { id: "azure", name: "Azure", domain: "cloud", marketDemand: 78 },
  { id: "docker", name: "Docker", domain: "cloud", marketDemand: 88 },
  { id: "kubernetes", name: "Kubernetes", domain: "cloud", marketDemand: 82 },
  { id: "ci-cd", name: "CI/CD", domain: "devops", marketDemand: 85 },
  { id: "terraform", name: "Terraform", domain: "devops", marketDemand: 76 },
  { id: "linux", name: "Linux", domain: "devops", marketDemand: 84 },
  { id: "git", name: "Git", domain: "devops", marketDemand: 95 },

  // Mobile
  { id: "react-native", name: "React Native", domain: "mobile", marketDemand: 72 },
  { id: "flutter", name: "Flutter", domain: "mobile", marketDemand: 68 },

  // General
  { id: "dsa", name: "Data Structures & Algorithms", domain: "general", marketDemand: 93 },
  { id: "system-design", name: "System Design", domain: "general", marketDemand: 88 },
  { id: "agile", name: "Agile/Scrum", domain: "general", marketDemand: 75 },
  { id: "communication", name: "Communication", domain: "general", marketDemand: 80 },
];

// ── Mock Students ────────────────────────────────────────────────────

export const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Arjun Mehta",
    slug: "arjun-mehta",
    email: "arjun.mehta@example.com",
    education: { degree: "B.Tech", field: "Computer Science", institution: "IIT Delhi", year: 2026, gpa: 8.7 },
    skills: [
      { id: "react", name: "React", domain: "frontend", level: 4, verification: "project-verified", verifiedAt: "2026-06-15" },
      { id: "typescript", name: "TypeScript", domain: "frontend", level: 4, verification: "assessed", verifiedAt: "2026-05-20" },
      { id: "nextjs", name: "Next.js", domain: "frontend", level: 3, verification: "project-verified", verifiedAt: "2026-07-01" },
      { id: "tailwind", name: "Tailwind CSS", domain: "frontend", level: 4, verification: "self-declared" },
      { id: "javascript", name: "JavaScript", domain: "frontend", level: 5, verification: "industry-verified", verifiedAt: "2026-04-10", verifiedBy: "Google Summer Internship" },
      { id: "nodejs", name: "Node.js", domain: "backend", level: 3, verification: "project-verified", verifiedAt: "2026-06-15" },
      { id: "python", name: "Python", domain: "backend", level: 3, verification: "assessed", verifiedAt: "2026-03-10" },
      { id: "git", name: "Git", domain: "devops", level: 4, verification: "project-verified" },
      { id: "dsa", name: "Data Structures & Algorithms", domain: "general", level: 4, verification: "assessed", verifiedAt: "2026-05-01" },
      { id: "docker", name: "Docker", domain: "cloud", level: 2, verification: "self-declared" },
      { id: "sql", name: "SQL", domain: "data-ai", level: 3, verification: "assessed" },
    ],
    projects: [
      { id: "p1", title: "EduStream Platform", description: "A full-stack e-learning platform with real-time video streaming, quiz engine, and progress tracking.", techStack: ["React", "Next.js", "Node.js", "PostgreSQL"], url: "https://github.com/arjun/edustream", verified: true },
      { id: "p2", title: "CodeCollab", description: "Real-time collaborative code editor with syntax highlighting and WebSocket sync.", techStack: ["TypeScript", "React", "Socket.io", "Monaco Editor"], verified: true },
      { id: "p3", title: "Portfolio Generator", description: "AI-powered portfolio website generator from resume data.", techStack: ["Next.js", "Tailwind", "OpenAI API"], verified: false },
    ],
    certifications: [
      { id: "c1", name: "Meta Front-End Developer Professional Certificate", issuer: "Coursera / Meta", date: "2026-03-15", verified: true },
      { id: "c2", name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", date: "2025-11-20", verified: true },
    ],
    assessments: [
      { id: "a1", skillId: "react", skillName: "React", score: 85, maxScore: 100, level: 4, date: "2026-05-20" },
      { id: "a2", skillId: "typescript", skillName: "TypeScript", score: 78, maxScore: 100, level: 4, date: "2026-05-20" },
      { id: "a3", skillId: "dsa", skillName: "Data Structures & Algorithms", score: 82, maxScore: 100, level: 4, date: "2026-05-01" },
    ],
    onboardingComplete: true,
    bio: "Final-year CS student at IIT Delhi passionate about building scalable web applications. Strong in React/TypeScript with industry experience from a Google internship.",
  },
  {
    id: "s2",
    name: "Priya Sharma",
    slug: "priya-sharma",
    email: "priya.sharma@example.com",
    education: { degree: "B.Tech", field: "Data Science", institution: "IIIT Hyderabad", year: 2026, gpa: 9.1 },
    skills: [
      { id: "python", name: "Python", domain: "backend", level: 5, verification: "industry-verified", verifiedAt: "2026-06-01", verifiedBy: "Microsoft Research Internship" },
      { id: "machine-learning", name: "Machine Learning", domain: "data-ai", level: 4, verification: "project-verified" },
      { id: "deep-learning", name: "Deep Learning", domain: "data-ai", level: 4, verification: "assessed" },
      { id: "pytorch", name: "PyTorch", domain: "data-ai", level: 4, verification: "project-verified" },
      { id: "nlp", name: "NLP", domain: "data-ai", level: 3, verification: "assessed" },
      { id: "pandas", name: "Pandas", domain: "data-ai", level: 5, verification: "project-verified" },
      { id: "sql", name: "SQL", domain: "data-ai", level: 4, verification: "assessed" },
      { id: "data-viz", name: "Data Visualization", domain: "data-ai", level: 3, verification: "self-declared" },
      { id: "tensorflow", name: "TensorFlow", domain: "data-ai", level: 3, verification: "self-declared" },
      { id: "git", name: "Git", domain: "devops", level: 3, verification: "project-verified" },
      { id: "docker", name: "Docker", domain: "cloud", level: 2, verification: "self-declared" },
      { id: "aws", name: "AWS", domain: "cloud", level: 2, verification: "self-declared" },
    ],
    projects: [
      { id: "p4", title: "SentimentScope", description: "Multi-lingual sentiment analysis engine using transformer models for social media monitoring.", techStack: ["Python", "PyTorch", "HuggingFace", "FastAPI"], verified: true },
      { id: "p5", title: "MedImage Classifier", description: "Deep learning pipeline for medical image classification achieving 94% accuracy on chest X-rays.", techStack: ["Python", "PyTorch", "OpenCV", "Flask"], verified: true },
    ],
    certifications: [
      { id: "c3", name: "Deep Learning Specialization", issuer: "Coursera / DeepLearning.AI", date: "2026-01-10", verified: true },
      { id: "c4", name: "Google Data Analytics Certificate", issuer: "Google", date: "2025-09-05", verified: true },
    ],
    assessments: [
      { id: "a4", skillId: "python", skillName: "Python", score: 95, maxScore: 100, level: 5, date: "2026-06-01" },
      { id: "a5", skillId: "machine-learning", skillName: "Machine Learning", score: 88, maxScore: 100, level: 4, date: "2026-06-01" },
    ],
    onboardingComplete: true,
    bio: "Data Science student at IIIT Hyderabad with strong ML/DL skills. Research internship at Microsoft on NLP. Passionate about building AI solutions for healthcare.",
  },
  {
    id: "s3",
    name: "Rohan Gupta",
    slug: "rohan-gupta",
    email: "rohan.gupta@example.com",
    education: { degree: "B.Tech", field: "Computer Science", institution: "NIT Trichy", year: 2027, gpa: 8.2 },
    skills: [
      { id: "java", name: "Java", domain: "backend", level: 4, verification: "assessed" },
      { id: "python", name: "Python", domain: "backend", level: 3, verification: "self-declared" },
      { id: "aws", name: "AWS", domain: "cloud", level: 3, verification: "project-verified" },
      { id: "docker", name: "Docker", domain: "cloud", level: 3, verification: "assessed" },
      { id: "kubernetes", name: "Kubernetes", domain: "cloud", level: 2, verification: "self-declared" },
      { id: "terraform", name: "Terraform", domain: "devops", level: 2, verification: "self-declared" },
      { id: "linux", name: "Linux", domain: "devops", level: 4, verification: "project-verified" },
      { id: "ci-cd", name: "CI/CD", domain: "devops", level: 3, verification: "project-verified" },
      { id: "git", name: "Git", domain: "devops", level: 4, verification: "project-verified" },
      { id: "rest-api", name: "REST APIs", domain: "backend", level: 3, verification: "project-verified" },
      { id: "postgresql", name: "PostgreSQL", domain: "backend", level: 3, verification: "self-declared" },
      { id: "dsa", name: "Data Structures & Algorithms", domain: "general", level: 3, verification: "assessed" },
    ],
    projects: [
      { id: "p6", title: "CloudDeploy", description: "Automated multi-cloud deployment tool with Terraform and GitHub Actions integration.", techStack: ["Go", "Terraform", "AWS", "Docker"], verified: true },
      { id: "p7", title: "LogAggregator", description: "Distributed log aggregation service processing 10K events/sec.", techStack: ["Java", "Kafka", "Elasticsearch", "Docker"], verified: false },
    ],
    certifications: [
      { id: "c5", name: "AWS Solutions Architect Associate", issuer: "Amazon Web Services", date: "2026-04-20", verified: true },
    ],
    assessments: [
      { id: "a6", skillId: "aws", skillName: "AWS", score: 76, maxScore: 100, level: 3, date: "2026-04-20" },
      { id: "a7", skillId: "docker", skillName: "Docker", score: 72, maxScore: 100, level: 3, date: "2026-04-20" },
    ],
    onboardingComplete: true,
    bio: "Cloud and DevOps enthusiast at NIT Trichy. AWS certified with hands-on experience in container orchestration and CI/CD pipelines.",
  },
  {
    id: "s4",
    name: "Ananya Krishnan",
    slug: "ananya-krishnan",
    email: "ananya.k@example.com",
    education: { degree: "B.Tech", field: "Information Technology", institution: "VIT Vellore", year: 2026, gpa: 8.9 },
    skills: [
      { id: "react", name: "React", domain: "frontend", level: 3, verification: "project-verified" },
      { id: "javascript", name: "JavaScript", domain: "frontend", level: 4, verification: "assessed" },
      { id: "html-css", name: "HTML/CSS", domain: "frontend", level: 5, verification: "project-verified" },
      { id: "figma", name: "Figma", domain: "frontend", level: 4, verification: "industry-verified", verifiedBy: "Zomato UX Internship" },
      { id: "typescript", name: "TypeScript", domain: "frontend", level: 2, verification: "self-declared" },
      { id: "vue", name: "Vue.js", domain: "frontend", level: 3, verification: "project-verified" },
      { id: "tailwind", name: "Tailwind CSS", domain: "frontend", level: 4, verification: "project-verified" },
      { id: "nodejs", name: "Node.js", domain: "backend", level: 2, verification: "self-declared" },
      { id: "git", name: "Git", domain: "devops", level: 3, verification: "project-verified" },
      { id: "communication", name: "Communication", domain: "general", level: 4, verification: "industry-verified" },
    ],
    projects: [
      { id: "p8", title: "FoodieUI", description: "Design system and component library for a food delivery app with accessibility-first approach.", techStack: ["React", "Storybook", "Tailwind", "Figma"], verified: true },
      { id: "p9", title: "TravelBlog", description: "Progressive web app travel blog with offline support and image optimization.", techStack: ["Vue.js", "Nuxt", "Tailwind"], verified: true },
    ],
    certifications: [
      { id: "c6", name: "Google UX Design Professional Certificate", issuer: "Google", date: "2025-12-10", verified: true },
    ],
    assessments: [
      { id: "a8", skillId: "javascript", skillName: "JavaScript", score: 82, maxScore: 100, level: 4, date: "2026-05-15" },
    ],
    onboardingComplete: true,
    bio: "UI/UX focused developer at VIT. Strong in design tools and frontend frameworks with industry experience from Zomato.",
  },
  {
    id: "s5",
    name: "Vikram Singh",
    slug: "vikram-singh",
    email: "vikram.singh@example.com",
    education: { degree: "M.Tech", field: "Artificial Intelligence", institution: "IISc Bangalore", year: 2026, gpa: 9.3 },
    skills: [
      { id: "python", name: "Python", domain: "backend", level: 5, verification: "industry-verified", verifiedBy: "Google AI Research" },
      { id: "machine-learning", name: "Machine Learning", domain: "data-ai", level: 5, verification: "industry-verified", verifiedBy: "Published Paper" },
      { id: "deep-learning", name: "Deep Learning", domain: "data-ai", level: 5, verification: "project-verified" },
      { id: "pytorch", name: "PyTorch", domain: "data-ai", level: 5, verification: "project-verified" },
      { id: "tensorflow", name: "TensorFlow", domain: "data-ai", level: 4, verification: "assessed" },
      { id: "nlp", name: "NLP", domain: "data-ai", level: 4, verification: "project-verified" },
      { id: "spark", name: "Apache Spark", domain: "data-ai", level: 3, verification: "self-declared" },
      { id: "sql", name: "SQL", domain: "data-ai", level: 4, verification: "assessed" },
      { id: "gcp", name: "Google Cloud", domain: "cloud", level: 3, verification: "project-verified" },
      { id: "docker", name: "Docker", domain: "cloud", level: 3, verification: "self-declared" },
      { id: "system-design", name: "System Design", domain: "general", level: 3, verification: "self-declared" },
      { id: "git", name: "Git", domain: "devops", level: 4, verification: "project-verified" },
    ],
    projects: [
      { id: "p10", title: "TranslateAI", description: "Low-resource language translation model using few-shot learning, published at ACL 2026.", techStack: ["Python", "PyTorch", "HuggingFace", "GCP"], verified: true },
      { id: "p11", title: "AutoML Pipeline", description: "Automated ML pipeline with hyperparameter tuning and model selection.", techStack: ["Python", "Scikit-learn", "Ray Tune", "MLflow"], verified: true },
    ],
    certifications: [
      { id: "c7", name: "TensorFlow Developer Certificate", issuer: "Google", date: "2025-08-15", verified: true },
      { id: "c8", name: "GCP Professional ML Engineer", issuer: "Google Cloud", date: "2026-02-20", verified: true },
    ],
    assessments: [
      { id: "a9", skillId: "machine-learning", skillName: "Machine Learning", score: 96, maxScore: 100, level: 5, date: "2026-06-01" },
      { id: "a10", skillId: "deep-learning", skillName: "Deep Learning", score: 92, maxScore: 100, level: 5, date: "2026-06-01" },
    ],
    onboardingComplete: true,
    bio: "M.Tech AI student at IISc with published research at ACL. Google AI Research intern. Expert in NLP and deep learning.",
  },
  {
    id: "s6",
    name: "Sneha Patel",
    slug: "sneha-patel",
    email: "sneha.patel@example.com",
    education: { degree: "B.Tech", field: "Computer Science", institution: "BITS Pilani", year: 2026, gpa: 8.5 },
    skills: [
      { id: "react", name: "React", domain: "frontend", level: 3, verification: "assessed" },
      { id: "nodejs", name: "Node.js", domain: "backend", level: 4, verification: "project-verified" },
      { id: "python", name: "Python", domain: "backend", level: 3, verification: "assessed" },
      { id: "mongodb", name: "MongoDB", domain: "backend", level: 3, verification: "project-verified" },
      { id: "rest-api", name: "REST APIs", domain: "backend", level: 4, verification: "project-verified" },
      { id: "graphql", name: "GraphQL", domain: "backend", level: 3, verification: "self-declared" },
      { id: "docker", name: "Docker", domain: "cloud", level: 3, verification: "assessed" },
      { id: "aws", name: "AWS", domain: "cloud", level: 2, verification: "self-declared" },
      { id: "git", name: "Git", domain: "devops", level: 4, verification: "project-verified" },
      { id: "javascript", name: "JavaScript", domain: "frontend", level: 4, verification: "assessed" },
      { id: "dsa", name: "Data Structures & Algorithms", domain: "general", level: 3, verification: "assessed" },
    ],
    projects: [
      { id: "p12", title: "EventHub", description: "Full-stack event management platform with real-time notifications and payment integration.", techStack: ["React", "Node.js", "MongoDB", "Stripe"], verified: true },
      { id: "p13", title: "GraphQL Gateway", description: "API gateway aggregating multiple microservices through a unified GraphQL schema.", techStack: ["Node.js", "GraphQL", "Docker", "Redis"], verified: true },
    ],
    certifications: [
      { id: "c9", name: "MongoDB Associate Developer", issuer: "MongoDB Inc", date: "2026-02-10", verified: true },
    ],
    assessments: [
      { id: "a11", skillId: "nodejs", skillName: "Node.js", score: 80, maxScore: 100, level: 4, date: "2026-04-15" },
    ],
    onboardingComplete: true,
    bio: "Full-stack developer at BITS Pilani with strong backend skills. Experienced in building scalable microservices and API design.",
  },
  {
    id: "s7",
    name: "Karthik Rajan",
    slug: "karthik-rajan",
    email: "karthik.r@example.com",
    education: { degree: "B.Tech", field: "Electronics & Communication", institution: "NIT Surathkal", year: 2027, gpa: 7.8 },
    skills: [
      { id: "python", name: "Python", domain: "backend", level: 3, verification: "self-declared" },
      { id: "javascript", name: "JavaScript", domain: "frontend", level: 3, verification: "self-declared" },
      { id: "react", name: "React", domain: "frontend", level: 2, verification: "self-declared" },
      { id: "html-css", name: "HTML/CSS", domain: "frontend", level: 3, verification: "self-declared" },
      { id: "git", name: "Git", domain: "devops", level: 2, verification: "self-declared" },
      { id: "dsa", name: "Data Structures & Algorithms", domain: "general", level: 2, verification: "self-declared" },
      { id: "sql", name: "SQL", domain: "data-ai", level: 2, verification: "self-declared" },
    ],
    projects: [
      { id: "p14", title: "Weather App", description: "Simple weather dashboard using OpenWeather API with location detection.", techStack: ["React", "CSS", "OpenWeather API"], verified: false },
    ],
    certifications: [],
    assessments: [],
    onboardingComplete: true,
    bio: "ECE student at NIT Surathkal transitioning into software development. Self-learning web development and DSA.",
  },
  {
    id: "s8",
    name: "Meera Iyer",
    slug: "meera-iyer",
    email: "meera.iyer@example.com",
    education: { degree: "B.Tech", field: "Computer Science", institution: "IIIT Bangalore", year: 2026, gpa: 9.0 },
    skills: [
      { id: "react", name: "React", domain: "frontend", level: 4, verification: "industry-verified", verifiedBy: "Flipkart Internship" },
      { id: "typescript", name: "TypeScript", domain: "frontend", level: 4, verification: "project-verified" },
      { id: "nextjs", name: "Next.js", domain: "frontend", level: 4, verification: "project-verified" },
      { id: "nodejs", name: "Node.js", domain: "backend", level: 3, verification: "assessed" },
      { id: "postgresql", name: "PostgreSQL", domain: "backend", level: 3, verification: "project-verified" },
      { id: "tailwind", name: "Tailwind CSS", domain: "frontend", level: 4, verification: "project-verified" },
      { id: "javascript", name: "JavaScript", domain: "frontend", level: 5, verification: "assessed" },
      { id: "figma", name: "Figma", domain: "frontend", level: 3, verification: "self-declared" },
      { id: "git", name: "Git", domain: "devops", level: 4, verification: "project-verified" },
      { id: "docker", name: "Docker", domain: "cloud", level: 2, verification: "self-declared" },
      { id: "ci-cd", name: "CI/CD", domain: "devops", level: 2, verification: "self-declared" },
      { id: "dsa", name: "Data Structures & Algorithms", domain: "general", level: 4, verification: "assessed" },
      { id: "system-design", name: "System Design", domain: "general", level: 2, verification: "self-declared" },
    ],
    projects: [
      { id: "p15", title: "ShopFlow", description: "E-commerce platform with real-time inventory, payments, and admin dashboard.", techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"], verified: true },
      { id: "p16", title: "DevDash", description: "Developer productivity dashboard aggregating GitHub, Jira, and Slack metrics.", techStack: ["React", "TypeScript", "Chart.js", "Node.js"], verified: true },
    ],
    certifications: [
      { id: "c10", name: "Meta Front-End Developer Certificate", issuer: "Coursera / Meta", date: "2025-10-10", verified: true },
    ],
    assessments: [
      { id: "a12", skillId: "react", skillName: "React", score: 90, maxScore: 100, level: 4, date: "2026-05-10" },
      { id: "a13", skillId: "typescript", skillName: "TypeScript", score: 85, maxScore: 100, level: 4, date: "2026-05-10" },
      { id: "a14", skillId: "dsa", skillName: "Data Structures & Algorithms", score: 80, maxScore: 100, level: 4, date: "2026-05-01" },
    ],
    onboardingComplete: true,
    bio: "Strong frontend engineer at IIIT Bangalore. Flipkart intern with expertise in React/Next.js ecosystem. Passionate about developer tools.",
  },
  {
    id: "s9",
    name: "Aditya Verma",
    slug: "aditya-verma",
    email: "aditya.v@example.com",
    education: { degree: "B.Tech", field: "Computer Science", institution: "DTU Delhi", year: 2026, gpa: 8.3 },
    skills: [
      { id: "java", name: "Java", domain: "backend", level: 4, verification: "assessed" },
      { id: "python", name: "Python", domain: "backend", level: 4, verification: "project-verified" },
      { id: "machine-learning", name: "Machine Learning", domain: "data-ai", level: 3, verification: "assessed" },
      { id: "pandas", name: "Pandas", domain: "data-ai", level: 4, verification: "project-verified" },
      { id: "sql", name: "SQL", domain: "data-ai", level: 4, verification: "assessed" },
      { id: "spark", name: "Apache Spark", domain: "data-ai", level: 2, verification: "self-declared" },
      { id: "aws", name: "AWS", domain: "cloud", level: 3, verification: "assessed" },
      { id: "docker", name: "Docker", domain: "cloud", level: 3, verification: "project-verified" },
      { id: "rest-api", name: "REST APIs", domain: "backend", level: 3, verification: "project-verified" },
      { id: "git", name: "Git", domain: "devops", level: 3, verification: "project-verified" },
      { id: "dsa", name: "Data Structures & Algorithms", domain: "general", level: 4, verification: "assessed" },
    ],
    projects: [
      { id: "p17", title: "StockPredictor", description: "LSTM-based stock price prediction with real-time dashboard and backtesting engine.", techStack: ["Python", "TensorFlow", "Pandas", "Flask"], verified: true },
      { id: "p18", title: "ETL Pipeline", description: "Automated data pipeline processing 1M+ records daily from multiple sources.", techStack: ["Python", "Apache Airflow", "PostgreSQL", "Docker"], verified: false },
    ],
    certifications: [
      { id: "c11", name: "AWS Data Analytics Specialty", issuer: "Amazon Web Services", date: "2026-03-01", verified: true },
    ],
    assessments: [
      { id: "a15", skillId: "python", skillName: "Python", score: 82, maxScore: 100, level: 4, date: "2026-04-01" },
      { id: "a16", skillId: "sql", skillName: "SQL", score: 85, maxScore: 100, level: 4, date: "2026-04-01" },
    ],
    onboardingComplete: true,
    bio: "Data engineering focused student at DTU. Strong in Python, SQL, and cloud data services. Interested in building scalable data platforms.",
  },
  {
    id: "s10",
    name: "Divya Nair",
    slug: "divya-nair",
    email: "divya.nair@example.com",
    education: { degree: "B.Tech", field: "Computer Science", institution: "NSUT Delhi", year: 2027, gpa: 8.0 },
    skills: [
      { id: "react", name: "React", domain: "frontend", level: 2, verification: "self-declared" },
      { id: "javascript", name: "JavaScript", domain: "frontend", level: 3, verification: "assessed" },
      { id: "html-css", name: "HTML/CSS", domain: "frontend", level: 4, verification: "project-verified" },
      { id: "python", name: "Python", domain: "backend", level: 3, verification: "assessed" },
      { id: "machine-learning", name: "Machine Learning", domain: "data-ai", level: 2, verification: "self-declared" },
      { id: "pandas", name: "Pandas", domain: "data-ai", level: 3, verification: "self-declared" },
      { id: "sql", name: "SQL", domain: "data-ai", level: 3, verification: "assessed" },
      { id: "git", name: "Git", domain: "devops", level: 3, verification: "project-verified" },
      { id: "dsa", name: "Data Structures & Algorithms", domain: "general", level: 3, verification: "assessed" },
    ],
    projects: [
      { id: "p19", title: "BudgetTracker", description: "Personal finance tracker with expense categorization and monthly reports.", techStack: ["React", "Chart.js", "Firebase"], verified: false },
    ],
    certifications: [
      { id: "c12", name: "Python for Everybody Specialization", issuer: "Coursera / UMich", date: "2026-01-15", verified: true },
    ],
    assessments: [
      { id: "a17", skillId: "python", skillName: "Python", score: 70, maxScore: 100, level: 3, date: "2026-03-01" },
    ],
    onboardingComplete: true,
    bio: "Third-year student at NSUT exploring both web development and data science. Building foundations in multiple domains.",
  },
  {
    id: "s11",
    name: "Rahul Desai",
    slug: "rahul-desai",
    email: "rahul.desai@example.com",
    education: { degree: "B.Tech", field: "Computer Science", institution: "PES University", year: 2026, gpa: 8.6 },
    skills: [
      { id: "react-native", name: "React Native", domain: "mobile", level: 4, verification: "industry-verified", verifiedBy: "Swiggy Internship" },
      { id: "flutter", name: "Flutter", domain: "mobile", level: 3, verification: "project-verified" },
      { id: "react", name: "React", domain: "frontend", level: 3, verification: "assessed" },
      { id: "typescript", name: "TypeScript", domain: "frontend", level: 3, verification: "project-verified" },
      { id: "javascript", name: "JavaScript", domain: "frontend", level: 4, verification: "assessed" },
      { id: "nodejs", name: "Node.js", domain: "backend", level: 3, verification: "project-verified" },
      { id: "rest-api", name: "REST APIs", domain: "backend", level: 3, verification: "project-verified" },
      { id: "git", name: "Git", domain: "devops", level: 4, verification: "project-verified" },
      { id: "figma", name: "Figma", domain: "frontend", level: 3, verification: "self-declared" },
      { id: "dsa", name: "Data Structures & Algorithms", domain: "general", level: 3, verification: "assessed" },
    ],
    projects: [
      { id: "p20", title: "FitTrack", description: "Cross-platform fitness tracking app with health API integration and social features.", techStack: ["React Native", "TypeScript", "Firebase", "HealthKit"], verified: true },
      { id: "p21", title: "QuickChat", description: "End-to-end encrypted messaging app with voice notes and media sharing.", techStack: ["Flutter", "Dart", "Firebase", "AES"], verified: true },
    ],
    certifications: [
      { id: "c13", name: "React Native - The Practical Guide", issuer: "Udemy / Academind", date: "2025-07-20", verified: false },
    ],
    assessments: [
      { id: "a18", skillId: "react-native", skillName: "React Native", score: 88, maxScore: 100, level: 4, date: "2026-05-01" },
    ],
    onboardingComplete: true,
    bio: "Mobile-first developer at PES University. Swiggy intern specializing in React Native. Loves building consumer mobile apps.",
  },
  {
    id: "s12",
    name: "Ishita Banerjee",
    slug: "ishita-banerjee",
    email: "ishita.b@example.com",
    education: { degree: "B.Tech", field: "Computer Science", institution: "Jadavpur University", year: 2026, gpa: 8.8 },
    skills: [
      { id: "python", name: "Python", domain: "backend", level: 4, verification: "project-verified" },
      { id: "java", name: "Java", domain: "backend", level: 3, verification: "assessed" },
      { id: "golang", name: "Go", domain: "backend", level: 3, verification: "project-verified" },
      { id: "docker", name: "Docker", domain: "cloud", level: 4, verification: "project-verified" },
      { id: "kubernetes", name: "Kubernetes", domain: "cloud", level: 3, verification: "assessed" },
      { id: "aws", name: "AWS", domain: "cloud", level: 3, verification: "assessed" },
      { id: "gcp", name: "Google Cloud", domain: "cloud", level: 2, verification: "self-declared" },
      { id: "terraform", name: "Terraform", domain: "devops", level: 3, verification: "project-verified" },
      { id: "ci-cd", name: "CI/CD", domain: "devops", level: 4, verification: "project-verified" },
      { id: "linux", name: "Linux", domain: "devops", level: 4, verification: "assessed" },
      { id: "git", name: "Git", domain: "devops", level: 4, verification: "project-verified" },
      { id: "system-design", name: "System Design", domain: "general", level: 3, verification: "assessed" },
    ],
    projects: [
      { id: "p22", title: "K8s-Autopilot", description: "Kubernetes cluster auto-scaling tool with cost optimization and anomaly detection.", techStack: ["Go", "Kubernetes", "Prometheus", "Grafana"], verified: true },
      { id: "p23", title: "InfraBot", description: "Slack bot for infrastructure provisioning and monitoring via natural language commands.", techStack: ["Python", "Terraform", "AWS", "Slack API"], verified: true },
    ],
    certifications: [
      { id: "c14", name: "Certified Kubernetes Administrator", issuer: "CNCF", date: "2026-01-25", verified: true },
      { id: "c15", name: "HashiCorp Terraform Associate", issuer: "HashiCorp", date: "2025-11-10", verified: true },
    ],
    assessments: [
      { id: "a19", skillId: "docker", skillName: "Docker", score: 85, maxScore: 100, level: 4, date: "2026-03-15" },
      { id: "a20", skillId: "kubernetes", skillName: "Kubernetes", score: 78, maxScore: 100, level: 3, date: "2026-03-15" },
    ],
    onboardingComplete: true,
    bio: "DevOps and cloud infrastructure specialist at Jadavpur University. CKA certified with strong skills in Kubernetes, Terraform, and CI/CD.",
  },
  {
    id: "s13",
    name: "Tanvi Reddy",
    slug: "tanvi-reddy",
    email: "tanvi.r@example.com",
    education: { degree: "B.Tech", field: "Computer Science", institution: "CBIT Hyderabad", year: 2027, gpa: 7.5 },
    skills: [
      { id: "html-css", name: "HTML/CSS", domain: "frontend", level: 3, verification: "self-declared" },
      { id: "javascript", name: "JavaScript", domain: "frontend", level: 2, verification: "self-declared" },
      { id: "python", name: "Python", domain: "backend", level: 2, verification: "self-declared" },
      { id: "git", name: "Git", domain: "devops", level: 2, verification: "self-declared" },
      { id: "dsa", name: "Data Structures & Algorithms", domain: "general", level: 2, verification: "self-declared" },
    ],
    projects: [],
    certifications: [],
    assessments: [],
    onboardingComplete: true,
    bio: "Early-stage CS student at CBIT exploring web development. Currently learning JavaScript and Python fundamentals.",
  },
  {
    id: "s14",
    name: "Siddharth Joshi",
    slug: "siddharth-joshi",
    email: "sid.joshi@example.com",
    education: { degree: "B.Tech", field: "Computer Science", institution: "DAIICT Gandhinagar", year: 2026, gpa: 8.4 },
    skills: [
      { id: "react", name: "React", domain: "frontend", level: 4, verification: "project-verified" },
      { id: "nextjs", name: "Next.js", domain: "frontend", level: 3, verification: "project-verified" },
      { id: "typescript", name: "TypeScript", domain: "frontend", level: 3, verification: "assessed" },
      { id: "javascript", name: "JavaScript", domain: "frontend", level: 4, verification: "assessed" },
      { id: "nodejs", name: "Node.js", domain: "backend", level: 4, verification: "project-verified" },
      { id: "postgresql", name: "PostgreSQL", domain: "backend", level: 3, verification: "project-verified" },
      { id: "redis", name: "Redis", domain: "backend", level: 2, verification: "self-declared" },
      { id: "docker", name: "Docker", domain: "cloud", level: 3, verification: "project-verified" },
      { id: "git", name: "Git", domain: "devops", level: 4, verification: "project-verified" },
      { id: "system-design", name: "System Design", domain: "general", level: 3, verification: "assessed" },
      { id: "agile", name: "Agile/Scrum", domain: "general", level: 3, verification: "industry-verified", verifiedBy: "Razorpay Internship" },
      { id: "rest-api", name: "REST APIs", domain: "backend", level: 4, verification: "project-verified" },
      { id: "dsa", name: "Data Structures & Algorithms", domain: "general", level: 4, verification: "assessed" },
    ],
    projects: [
      { id: "p24", title: "PayFlow", description: "Payment processing dashboard with transaction analytics and fraud detection alerts.", techStack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"], verified: true },
      { id: "p25", title: "TaskBoard", description: "Kanban-style project management tool with real-time collaboration.", techStack: ["React", "Socket.io", "Redis", "Docker"], verified: true },
    ],
    certifications: [
      { id: "c16", name: "System Design Interview Course", issuer: "Educative", date: "2026-04-01", verified: false },
    ],
    assessments: [
      { id: "a21", skillId: "react", skillName: "React", score: 84, maxScore: 100, level: 4, date: "2026-04-15" },
      { id: "a22", skillId: "system-design", skillName: "System Design", score: 75, maxScore: 100, level: 3, date: "2026-04-15" },
    ],
    onboardingComplete: true,
    bio: "Full-stack developer at DAIICT with Razorpay internship experience. Strong in system design and building production-grade web applications.",
  },
  {
    id: "s15",
    name: "Nisha Agarwal",
    slug: "nisha-agarwal",
    email: "nisha.a@example.com",
    education: { degree: "B.Tech", field: "Computer Science", institution: "MNIT Jaipur", year: 2026, gpa: 8.1 },
    skills: [
      { id: "python", name: "Python", domain: "backend", level: 4, verification: "assessed" },
      { id: "machine-learning", name: "Machine Learning", domain: "data-ai", level: 3, verification: "assessed" },
      { id: "deep-learning", name: "Deep Learning", domain: "data-ai", level: 2, verification: "self-declared" },
      { id: "nlp", name: "NLP", domain: "data-ai", level: 3, verification: "project-verified" },
      { id: "pandas", name: "Pandas", domain: "data-ai", level: 4, verification: "project-verified" },
      { id: "data-viz", name: "Data Visualization", domain: "data-ai", level: 3, verification: "project-verified" },
      { id: "sql", name: "SQL", domain: "data-ai", level: 3, verification: "assessed" },
      { id: "tensorflow", name: "TensorFlow", domain: "data-ai", level: 2, verification: "self-declared" },
      { id: "git", name: "Git", domain: "devops", level: 3, verification: "project-verified" },
      { id: "communication", name: "Communication", domain: "general", level: 4, verification: "self-declared" },
    ],
    projects: [
      { id: "p26", title: "NewsLens", description: "Fake news detection system using NLP and ensemble models, achieving 91% accuracy.", techStack: ["Python", "Scikit-learn", "BERT", "Flask"], verified: true },
      { id: "p27", title: "EDA Toolkit", description: "Automated exploratory data analysis tool generating insights and visualizations.", techStack: ["Python", "Pandas", "Plotly", "Streamlit"], verified: false },
    ],
    certifications: [
      { id: "c17", name: "Applied Data Science with Python", issuer: "Coursera / UMich", date: "2025-12-20", verified: true },
    ],
    assessments: [
      { id: "a23", skillId: "python", skillName: "Python", score: 80, maxScore: 100, level: 4, date: "2026-03-20" },
      { id: "a24", skillId: "machine-learning", skillName: "Machine Learning", score: 72, maxScore: 100, level: 3, date: "2026-03-20" },
    ],
    onboardingComplete: true,
    bio: "Data science student at MNIT Jaipur focusing on NLP applications. Strong in Python and statistical analysis with a keen interest in AI for social good.",
  },
];

// ── Mock Companies ───────────────────────────────────────────────────

export const mockCompanies: Company[] = [
  { id: "comp1", name: "Google", industry: "Technology", size: "10000+", location: "Bangalore, India" },
  { id: "comp2", name: "Flipkart", industry: "E-commerce", size: "10000+", location: "Bangalore, India" },
  { id: "comp3", name: "Razorpay", industry: "Fintech", size: "1000-5000", location: "Bangalore, India" },
  { id: "comp4", name: "TCS", industry: "IT Services", size: "10000+", location: "Mumbai, India" },
  { id: "comp5", name: "Infosys", industry: "IT Services", size: "10000+", location: "Bangalore, India" },
  { id: "comp6", name: "Zerodha", industry: "Fintech", size: "1000-5000", location: "Bangalore, India" },
  { id: "comp7", name: "PhonePe", industry: "Fintech", size: "5000-10000", location: "Bangalore, India" },
  { id: "comp8", name: "Amazon", industry: "Technology", size: "10000+", location: "Hyderabad, India" },
];

// ── Mock Recruiters ──────────────────────────────────────────────────

export const mockRecruiters: Recruiter[] = [
  { id: "r1", name: "Rajesh Kumar", slug: "rajesh-kumar", email: "rajesh.kumar@google.com", companyId: "comp1" },
  { id: "r2", name: "Sunita Reddy", slug: "sunita-reddy", email: "sunita.reddy@flipkart.com", companyId: "comp2" },
];

// ── Mock Opportunities ───────────────────────────────────────────────

export const mockOpportunities: Opportunity[] = [
  {
    id: "opp1",
    title: "Frontend Engineer Intern",
    companyId: "comp1",
    domain: "frontend",
    description: "Join Google's frontend team to build next-generation web applications using React and TypeScript. You'll work on user-facing features used by millions.",
    requiredSkills: [
      { skillId: "react", skillName: "React", requiredLevel: 4, preferred: false },
      { skillId: "typescript", skillName: "TypeScript", requiredLevel: 3, preferred: false },
      { skillId: "javascript", skillName: "JavaScript", requiredLevel: 4, preferred: false },
      { skillId: "html-css", skillName: "HTML/CSS", requiredLevel: 3, preferred: false },
      { skillId: "git", skillName: "Git", requiredLevel: 3, preferred: false },
    ],
    preferredSkills: [
      { skillId: "nextjs", skillName: "Next.js", requiredLevel: 3, preferred: true },
      { skillId: "tailwind", skillName: "Tailwind CSS", requiredLevel: 2, preferred: true },
      { skillId: "system-design", skillName: "System Design", requiredLevel: 2, preferred: true },
      { skillId: "dsa", skillName: "Data Structures & Algorithms", requiredLevel: 3, preferred: true },
    ],
    eligibility: "B.Tech/M.Tech CS or related field, graduating 2026-2027",
    location: "Bangalore, India",
    type: "internship",
    duration: "6 months",
    compensation: "₹80,000/month + housing",
    deadline: "2026-10-15",
    postedAt: "2026-08-15",
    recruiterId: "r1",
    active: true,
  },
  {
    id: "opp2",
    title: "ML Engineer - NLP Team",
    companyId: "comp1",
    domain: "data-ai",
    description: "Work on large language models and NLP systems powering Google Search and Assistant. Build and deploy production ML pipelines.",
    requiredSkills: [
      { skillId: "python", skillName: "Python", requiredLevel: 4, preferred: false },
      { skillId: "machine-learning", skillName: "Machine Learning", requiredLevel: 4, preferred: false },
      { skillId: "deep-learning", skillName: "Deep Learning", requiredLevel: 4, preferred: false },
      { skillId: "nlp", skillName: "NLP", requiredLevel: 3, preferred: false },
      { skillId: "pytorch", skillName: "PyTorch", requiredLevel: 3, preferred: false },
    ],
    preferredSkills: [
      { skillId: "tensorflow", skillName: "TensorFlow", requiredLevel: 3, preferred: true },
      { skillId: "gcp", skillName: "Google Cloud", requiredLevel: 2, preferred: true },
      { skillId: "docker", skillName: "Docker", requiredLevel: 2, preferred: true },
      { skillId: "system-design", skillName: "System Design", requiredLevel: 3, preferred: true },
    ],
    eligibility: "M.Tech/PhD in CS/AI/ML, or B.Tech with strong ML portfolio",
    location: "Bangalore, India",
    type: "full-time",
    compensation: "₹25-40 LPA",
    deadline: "2026-11-01",
    postedAt: "2026-08-10",
    recruiterId: "r1",
    active: true,
  },
  {
    id: "opp3",
    title: "Full Stack Developer",
    companyId: "comp2",
    domain: "frontend",
    description: "Build and scale Flipkart's e-commerce platform. Work across the full stack with React, Node.js, and microservices architecture.",
    requiredSkills: [
      { skillId: "react", skillName: "React", requiredLevel: 4, preferred: false },
      { skillId: "nodejs", skillName: "Node.js", requiredLevel: 3, preferred: false },
      { skillId: "javascript", skillName: "JavaScript", requiredLevel: 4, preferred: false },
      { skillId: "rest-api", skillName: "REST APIs", requiredLevel: 3, preferred: false },
      { skillId: "dsa", skillName: "Data Structures & Algorithms", requiredLevel: 3, preferred: false },
    ],
    preferredSkills: [
      { skillId: "typescript", skillName: "TypeScript", requiredLevel: 3, preferred: true },
      { skillId: "postgresql", skillName: "PostgreSQL", requiredLevel: 3, preferred: true },
      { skillId: "docker", skillName: "Docker", requiredLevel: 2, preferred: true },
      { skillId: "system-design", skillName: "System Design", requiredLevel: 2, preferred: true },
    ],
    eligibility: "B.Tech CS or related field, graduating 2026",
    location: "Bangalore, India",
    type: "full-time",
    compensation: "₹18-28 LPA",
    deadline: "2026-09-30",
    postedAt: "2026-08-01",
    recruiterId: "r2",
    active: true,
  },
  {
    id: "opp4",
    title: "Backend Engineer - Payments",
    companyId: "comp3",
    domain: "backend",
    description: "Build Razorpay's core payments infrastructure handling millions of transactions daily. Work with distributed systems and fintech regulations.",
    requiredSkills: [
      { skillId: "nodejs", skillName: "Node.js", requiredLevel: 4, preferred: false },
      { skillId: "typescript", skillName: "TypeScript", requiredLevel: 3, preferred: false },
      { skillId: "rest-api", skillName: "REST APIs", requiredLevel: 4, preferred: false },
      { skillId: "postgresql", skillName: "PostgreSQL", requiredLevel: 3, preferred: false },
      { skillId: "system-design", skillName: "System Design", requiredLevel: 3, preferred: false },
    ],
    preferredSkills: [
      { skillId: "redis", skillName: "Redis", requiredLevel: 2, preferred: true },
      { skillId: "docker", skillName: "Docker", requiredLevel: 3, preferred: true },
      { skillId: "ci-cd", skillName: "CI/CD", requiredLevel: 2, preferred: true },
      { skillId: "agile", skillName: "Agile/Scrum", requiredLevel: 2, preferred: true },
    ],
    eligibility: "B.Tech CS or related field, graduating 2026",
    location: "Bangalore, India",
    type: "full-time",
    compensation: "₹22-35 LPA",
    deadline: "2026-10-01",
    postedAt: "2026-08-05",
    recruiterId: "r2",
    active: true,
  },
  {
    id: "opp5",
    title: "Cloud Infrastructure Engineer",
    companyId: "comp4",
    domain: "cloud",
    description: "Design and manage cloud infrastructure for enterprise clients. Work with multi-cloud environments and Infrastructure as Code.",
    requiredSkills: [
      { skillId: "aws", skillName: "AWS", requiredLevel: 3, preferred: false },
      { skillId: "docker", skillName: "Docker", requiredLevel: 3, preferred: false },
      { skillId: "linux", skillName: "Linux", requiredLevel: 3, preferred: false },
      { skillId: "ci-cd", skillName: "CI/CD", requiredLevel: 3, preferred: false },
      { skillId: "python", skillName: "Python", requiredLevel: 3, preferred: false },
    ],
    preferredSkills: [
      { skillId: "kubernetes", skillName: "Kubernetes", requiredLevel: 2, preferred: true },
      { skillId: "terraform", skillName: "Terraform", requiredLevel: 2, preferred: true },
      { skillId: "gcp", skillName: "Google Cloud", requiredLevel: 2, preferred: true },
      { skillId: "azure", skillName: "Azure", requiredLevel: 2, preferred: true },
    ],
    eligibility: "B.Tech CS/IT or related field, graduating 2026-2027",
    location: "Mumbai / Pune, India",
    type: "full-time",
    compensation: "₹12-20 LPA",
    deadline: "2026-09-20",
    postedAt: "2026-07-25",
    recruiterId: "r1",
    active: true,
  },
  {
    id: "opp6",
    title: "Data Analyst Intern",
    companyId: "comp5",
    domain: "data-ai",
    description: "Analyze large datasets to derive business insights for enterprise clients. Build dashboards and automate reporting pipelines.",
    requiredSkills: [
      { skillId: "python", skillName: "Python", requiredLevel: 3, preferred: false },
      { skillId: "sql", skillName: "SQL", requiredLevel: 3, preferred: false },
      { skillId: "pandas", skillName: "Pandas", requiredLevel: 3, preferred: false },
      { skillId: "data-viz", skillName: "Data Visualization", requiredLevel: 2, preferred: false },
    ],
    preferredSkills: [
      { skillId: "machine-learning", skillName: "Machine Learning", requiredLevel: 2, preferred: true },
      { skillId: "spark", skillName: "Apache Spark", requiredLevel: 2, preferred: true },
      { skillId: "aws", skillName: "AWS", requiredLevel: 1, preferred: true },
    ],
    eligibility: "B.Tech any branch, graduating 2026-2027",
    location: "Bangalore / Hyderabad, India",
    type: "internship",
    duration: "3 months",
    compensation: "₹35,000/month",
    deadline: "2026-09-15",
    postedAt: "2026-08-01",
    recruiterId: "r2",
    active: true,
  },
  {
    id: "opp7",
    title: "Mobile Developer - React Native",
    companyId: "comp7",
    domain: "mobile",
    description: "Build and maintain PhonePe's consumer-facing mobile app used by 400M+ users. Focus on performance, UX, and payment flows.",
    requiredSkills: [
      { skillId: "react-native", skillName: "React Native", requiredLevel: 4, preferred: false },
      { skillId: "javascript", skillName: "JavaScript", requiredLevel: 4, preferred: false },
      { skillId: "typescript", skillName: "TypeScript", requiredLevel: 3, preferred: false },
      { skillId: "rest-api", skillName: "REST APIs", requiredLevel: 3, preferred: false },
    ],
    preferredSkills: [
      { skillId: "react", skillName: "React", requiredLevel: 3, preferred: true },
      { skillId: "nodejs", skillName: "Node.js", requiredLevel: 2, preferred: true },
      { skillId: "figma", skillName: "Figma", requiredLevel: 2, preferred: true },
      { skillId: "dsa", skillName: "Data Structures & Algorithms", requiredLevel: 3, preferred: true },
    ],
    eligibility: "B.Tech CS or related field, graduating 2026",
    location: "Bangalore, India",
    type: "full-time",
    compensation: "₹20-30 LPA",
    deadline: "2026-10-10",
    postedAt: "2026-08-12",
    recruiterId: "r2",
    active: true,
  },
  {
    id: "opp8",
    title: "DevOps Engineer",
    companyId: "comp6",
    domain: "devops",
    description: "Manage Zerodha's trading infrastructure with zero-downtime deployments. Build monitoring, alerting, and automation systems.",
    requiredSkills: [
      { skillId: "docker", skillName: "Docker", requiredLevel: 4, preferred: false },
      { skillId: "kubernetes", skillName: "Kubernetes", requiredLevel: 3, preferred: false },
      { skillId: "linux", skillName: "Linux", requiredLevel: 4, preferred: false },
      { skillId: "ci-cd", skillName: "CI/CD", requiredLevel: 3, preferred: false },
      { skillId: "python", skillName: "Python", requiredLevel: 3, preferred: false },
    ],
    preferredSkills: [
      { skillId: "golang", skillName: "Go", requiredLevel: 2, preferred: true },
      { skillId: "terraform", skillName: "Terraform", requiredLevel: 3, preferred: true },
      { skillId: "aws", skillName: "AWS", requiredLevel: 3, preferred: true },
      { skillId: "system-design", skillName: "System Design", requiredLevel: 3, preferred: true },
    ],
    eligibility: "B.Tech CS or related field, graduating 2026",
    location: "Bangalore, India",
    type: "full-time",
    compensation: "₹18-28 LPA",
    deadline: "2026-09-25",
    postedAt: "2026-08-08",
    recruiterId: "r1",
    active: true,
  },
  {
    id: "opp9",
    title: "Software Engineer - Backend",
    companyId: "comp8",
    domain: "backend",
    description: "Design and build scalable backend services for Amazon's retail platform. Work with distributed systems serving millions of requests per second.",
    requiredSkills: [
      { skillId: "java", skillName: "Java", requiredLevel: 4, preferred: false },
      { skillId: "rest-api", skillName: "REST APIs", requiredLevel: 3, preferred: false },
      { skillId: "system-design", skillName: "System Design", requiredLevel: 3, preferred: false },
      { skillId: "dsa", skillName: "Data Structures & Algorithms", requiredLevel: 4, preferred: false },
      { skillId: "sql", skillName: "SQL", requiredLevel: 3, preferred: false },
    ],
    preferredSkills: [
      { skillId: "aws", skillName: "AWS", requiredLevel: 3, preferred: true },
      { skillId: "docker", skillName: "Docker", requiredLevel: 2, preferred: true },
      { skillId: "python", skillName: "Python", requiredLevel: 2, preferred: true },
      { skillId: "redis", skillName: "Redis", requiredLevel: 2, preferred: true },
    ],
    eligibility: "B.Tech/M.Tech CS or related field, graduating 2026",
    location: "Hyderabad, India",
    type: "full-time",
    compensation: "₹25-38 LPA",
    deadline: "2026-10-20",
    postedAt: "2026-08-18",
    recruiterId: "r1",
    active: true,
  },
  {
    id: "opp10",
    title: "UI/UX Engineer Intern",
    companyId: "comp2",
    domain: "frontend",
    description: "Design and implement user interfaces for Flipkart's mobile web experience. Focus on accessibility, performance, and delightful interactions.",
    requiredSkills: [
      { skillId: "html-css", skillName: "HTML/CSS", requiredLevel: 4, preferred: false },
      { skillId: "javascript", skillName: "JavaScript", requiredLevel: 3, preferred: false },
      { skillId: "react", skillName: "React", requiredLevel: 3, preferred: false },
      { skillId: "figma", skillName: "Figma", requiredLevel: 3, preferred: false },
    ],
    preferredSkills: [
      { skillId: "tailwind", skillName: "Tailwind CSS", requiredLevel: 2, preferred: true },
      { skillId: "typescript", skillName: "TypeScript", requiredLevel: 2, preferred: true },
      { skillId: "vue", skillName: "Vue.js", requiredLevel: 2, preferred: true },
      { skillId: "communication", skillName: "Communication", requiredLevel: 3, preferred: true },
    ],
    eligibility: "B.Tech CS/Design or related field, graduating 2026-2027",
    location: "Bangalore, India",
    type: "internship",
    duration: "4 months",
    compensation: "₹50,000/month",
    deadline: "2026-09-10",
    postedAt: "2026-07-28",
    recruiterId: "r2",
    active: true,
  },
];

// ── Mock Applications ────────────────────────────────────────────────

export const mockApplications: Application[] = [
  {
    id: "app1",
    studentId: "s1",
    opportunityId: "opp1",
    currentStage: "shortlisted",
    stageHistory: [
      { stage: "applied", timestamp: "2026-08-16T10:00:00Z" },
      { stage: "under-review", timestamp: "2026-08-18T14:30:00Z" },
      { stage: "shortlisted", timestamp: "2026-08-22T09:15:00Z" },
    ],
    appliedAt: "2026-08-16T10:00:00Z",
  },
  {
    id: "app2",
    studentId: "s2",
    opportunityId: "opp2",
    currentStage: "interview",
    stageHistory: [
      { stage: "applied", timestamp: "2026-08-11T08:00:00Z" },
      { stage: "under-review", timestamp: "2026-08-13T11:00:00Z" },
      { stage: "shortlisted", timestamp: "2026-08-16T15:00:00Z" },
      { stage: "interview", timestamp: "2026-08-20T10:00:00Z", note: "Technical round scheduled for Aug 25" },
    ],
    appliedAt: "2026-08-11T08:00:00Z",
  },
  {
    id: "app3",
    studentId: "s8",
    opportunityId: "opp3",
    currentStage: "under-review",
    stageHistory: [
      { stage: "applied", timestamp: "2026-08-05T12:00:00Z" },
      { stage: "under-review", timestamp: "2026-08-07T09:00:00Z" },
    ],
    appliedAt: "2026-08-05T12:00:00Z",
  },
  {
    id: "app4",
    studentId: "s14",
    opportunityId: "opp4",
    currentStage: "selected",
    stageHistory: [
      { stage: "applied", timestamp: "2026-08-06T14:00:00Z" },
      { stage: "under-review", timestamp: "2026-08-08T10:00:00Z" },
      { stage: "shortlisted", timestamp: "2026-08-12T16:00:00Z" },
      { stage: "interview", timestamp: "2026-08-15T11:00:00Z" },
      { stage: "selected", timestamp: "2026-08-22T14:00:00Z", note: "Offer extended — ₹28 LPA" },
    ],
    appliedAt: "2026-08-06T14:00:00Z",
  },
  {
    id: "app5",
    studentId: "s12",
    opportunityId: "opp8",
    currentStage: "shortlisted",
    stageHistory: [
      { stage: "applied", timestamp: "2026-08-09T09:00:00Z" },
      { stage: "under-review", timestamp: "2026-08-11T13:00:00Z" },
      { stage: "shortlisted", timestamp: "2026-08-15T10:00:00Z" },
    ],
    appliedAt: "2026-08-09T09:00:00Z",
  },
  {
    id: "app6",
    studentId: "s5",
    opportunityId: "opp2",
    currentStage: "applied",
    stageHistory: [
      { stage: "applied", timestamp: "2026-08-20T16:00:00Z" },
    ],
    appliedAt: "2026-08-20T16:00:00Z",
  },
];

// ── Mock Learning Paths ──────────────────────────────────────────────

export const mockLearningPaths: LearningPath[] = [
  { id: "lp1", title: "React - The Complete Guide (incl. Next.js)", provider: "Udemy", url: "https://udemy.com/react-complete-guide", skillIds: ["react", "nextjs"], duration: "48 hours", level: "intermediate", rating: 4.7 },
  { id: "lp2", title: "TypeScript for Professionals", provider: "Udemy", url: "https://udemy.com/typescript-pro", skillIds: ["typescript"], duration: "12 hours", level: "intermediate", rating: 4.8 },
  { id: "lp3", title: "Machine Learning Specialization", provider: "Coursera", url: "https://coursera.org/ml-specialization", skillIds: ["machine-learning", "python"], duration: "80 hours", level: "intermediate", rating: 4.9 },
  { id: "lp4", title: "Deep Learning with PyTorch", provider: "NPTEL", url: "https://nptel.ac.in/deep-learning-pytorch", skillIds: ["deep-learning", "pytorch"], duration: "40 hours", level: "advanced", rating: 4.5 },
  { id: "lp5", title: "AWS Solutions Architect Prep", provider: "Udemy", url: "https://udemy.com/aws-sa-prep", skillIds: ["aws", "cloud"], duration: "30 hours", level: "intermediate", rating: 4.6 },
  { id: "lp6", title: "Docker & Kubernetes: The Practical Guide", provider: "Udemy", url: "https://udemy.com/docker-k8s", skillIds: ["docker", "kubernetes"], duration: "24 hours", level: "intermediate", rating: 4.7 },
  { id: "lp7", title: "System Design Interview", provider: "Educative", url: "https://educative.io/system-design", skillIds: ["system-design"], duration: "20 hours", level: "advanced", rating: 4.8 },
  { id: "lp8", title: "NLP Specialization", provider: "Coursera", url: "https://coursera.org/nlp-specialization", skillIds: ["nlp", "python"], duration: "60 hours", level: "intermediate", rating: 4.6 },
  { id: "lp9", title: "DSA in JavaScript", provider: "NPTEL", url: "https://nptel.ac.in/dsa-js", skillIds: ["dsa", "javascript"], duration: "35 hours", level: "beginner", rating: 4.4 },
  { id: "lp10", title: "Terraform Up & Running", provider: "Udemy", url: "https://udemy.com/terraform", skillIds: ["terraform", "aws"], duration: "16 hours", level: "intermediate", rating: 4.5 },
  { id: "lp11", title: "React Native - Build Mobile Apps", provider: "Udemy", url: "https://udemy.com/react-native", skillIds: ["react-native", "javascript"], duration: "28 hours", level: "intermediate", rating: 4.6 },
  { id: "lp12", title: "SQL for Data Science", provider: "Coursera", url: "https://coursera.org/sql-data-science", skillIds: ["sql"], duration: "15 hours", level: "beginner", rating: 4.5 },
];

// ── Helper Functions ─────────────────────────────────────────────────

export function getStudentBySlug(slug: string): Student | undefined {
  return mockStudents.find((s) => s.slug === slug);
}

export function getStudentById(id: string): Student | undefined {
  return mockStudents.find((s) => s.id === id);
}

export function getCompanyById(id: string): Company | undefined {
  return mockCompanies.find((c) => c.id === id);
}

export function getOpportunityById(id: string): Opportunity | undefined {
  return mockOpportunities.find((o) => o.id === id);
}

export function getRecruiterBySlug(slug: string): Recruiter | undefined {
  return mockRecruiters.find((r) => r.slug === slug);
}

export function getRecruiterById(id: string): Recruiter | undefined {
  return mockRecruiters.find((r) => r.id === id);
}

export function getApplicationsByStudentId(studentId: string): Application[] {
  return mockApplications.filter((a) => a.studentId === studentId);
}

export function getApplicationsByOpportunityId(opportunityId: string): Application[] {
  return mockApplications.filter((a) => a.opportunityId === opportunityId);
}

export function getApplicationById(id: string): Application | undefined {
  return mockApplications.find((a) => a.id === id);
}

export function getOpportunitiesByRecruiterId(recruiterId: string): Opportunity[] {
  return mockOpportunities.filter((o) => o.recruiterId === recruiterId);
}

export function getLearningPathsForSkills(skillIds: string[]): LearningPath[] {
  return mockLearningPaths.filter((lp) =>
    lp.skillIds.some((sid) => skillIds.includes(sid))
  );
}

export function getSkillTaxonomyItem(skillId: string): SkillTaxonomyItem | undefined {
  return skillTaxonomy.find((s) => s.id === skillId);
}
