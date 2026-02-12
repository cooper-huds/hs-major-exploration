import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/**
 * High School Major Exploration Diagnostic — Prototype v0
 * Mobile-first UI, desktop-friendly responsive layout.
 * Prototype version: v0.4 — Majors expansion + Sprints A–D tailoring + Saved v0
 *
 * Design principles:
 * - Exploration over prescription
 * - No rankings / fit scores shown
 * - Pass 1 = recognition scan (13 domains)
 * - Pass 2 = depth modules (student-chosen 2–4 domains)
 * - Clusters surfaced as context (12 clusters)
 * - Comparison views resolve confusion; capped + optional
 */

// BASELINE: v0.x (restored on 2026-02-06)
// -----------------------------
// Data
// -----------------------------

const PASS1_SCALE = [
  { value: 3, label: "Sounds a lot like me" },
  { value: 2, label: "Sounds somewhat like me" },
  { value: 1, label: "Not really me" },
  { value: 0, label: "Doesn’t sound like me at all" },
];

const domains = [
  {
    id: "build_make",
    title: "Building & Making Things",
    prompt: "I like building things, putting stuff together, or making something that actually works.",
  },
  {
    id: "fix_hands",
    title: "Fixing, Crafting & Working with Your Hands",
    prompt:
      "I enjoy working with my hands — fixing things, crafting, cooking, or learning practical skills.",
  },
  {
    id: "analyze_solve",
    title: "Analyzing & Solving Problems",
    prompt:
      "I like figuring things out, solving problems, or breaking something down to understand how it works.",
  },
  {
    id: "create_express",
    title: "Creating & Expressing Ideas",
    prompt:
      "I enjoy expressing ideas through writing, art, music, video, or creative projects.",
  },
  {
    id: "perform_entertain",
    title: "Performing & Entertaining",
    prompt:
      "I like performing, being on stage, entertaining people, or expressing myself live.",
  },
  {
    id: "help_support",
    title: "Helping & Supporting People",
    prompt:
      "I enjoy helping others, supporting people, or making a positive difference in someone’s life.",
  },
  {
    id: "teach_coach",
    title: "Teaching, Coaching & Explaining",
    prompt:
      "I like explaining things, helping others learn, or coaching people to improve.",
  },
  {
    id: "lead_sell",
    title: "Leading, Influencing & Making Things Happen",
    prompt:
      "I enjoy getting people on board with an idea, organizing groups, or helping a plan actually move forward.",
  },
  {
    id: "organize_track",
    title: "Organizing & Keeping Things on Track",
    prompt:
      "I like organizing details, following steps, and making sure things run smoothly.",
  },
  {
    id: "compete_train",
    title: "Competing, Training & Pushing Yourself",
    prompt:
      "I enjoy competition, training, pushing myself physically, or performing under pressure.",
  },
  {
    id: "outdoors_animals",
    title: "Exploring the Outdoors & Working with Animals",
    prompt:
      "I like being outdoors, working with animals, or learning about nature and the environment.",
  },
  {
    id: "explore_research",
    title: "Exploring, Researching & Discovering",
    prompt:
      "I’m curious and like exploring new ideas, asking big questions, or learning how the world works.",
  },
  {
    id: "design_better",
    title: "Designing Experiences & Making Things Better",
    prompt:
      "I like noticing how things feel for people — like spaces, apps, or products — and thinking about how to make them better.",
  },
];

const clusters = [
  {
    id: "eng_tech",
    title: "Engineering & Technology",
    about:
      "Designing, building, and improving how things work — from machines and structures to technology.",
    enjoy:
      "Solving practical problems, testing solutions, improving designs over time.",
    majors: [
      "Mechanical Engineering",
      "Electrical Engineering",
      "Civil Engineering",
      "Engineering Technology",
      "Industrial Engineering",
      "Computer Engineering",
      "Biomedical Engineering",
      "Chemical Engineering",
      "Aerospace Engineering",
      "Environmental Engineering",
    ],
    workOn: [
      "Designing something on paper or on a computer before it’s built",
      "Building prototypes or models and improving them",
      "Testing different fixes to see what works",
      "Using math or science ideas to choose between options",
    ],
    learningFeels: [
      "A mix of problem-solving, projects, and some theory",
      "Planning before building",
      "Trying, learning from mistakes, and trying again",
    ],
  },
  {
    id: "cs_data",
    title: "Computer, Data & Information Fields",
    about:
      "Working with computers, data, and digital information to solve problems or build tools people use.",
    enjoy:
      "Logical thinking, coding, finding patterns, building digital solutions.",
    majors: [
      "Computer Science",
      "Information Systems",
      "Data Science",
      "Cybersecurity",
      "Information Technology",
      "Software Engineering",
    ],
    workOn: [
      "Building simple apps, games, or websites",
      "Using data to answer questions",
      "Debugging: figuring out why something isn’t working",
      "Designing tools that make tasks easier",
    ],
    learningFeels: [
      "Lots of practice and projects",
      "Step-by-step problem solving",
      "Testing ideas quickly and improving",
    ],
  },
  {
    id: "sci",
    title: "Physical & Life Sciences",
    about:
      "Understanding how the natural world works — including physics, chemistry, biology, and related sciences.",
    enjoy: 'Asking "why" questions, experimenting, analyzing results, discovery.',
    majors: ["Biology", "Chemistry", "Physics", "Biochemistry", "Neuroscience"],
    workOn: [
      "Running experiments or labs",
      "Collecting and analyzing data",
      "Investigating questions about the natural world",
      "Learning how living or physical systems behave",
    ],
    learningFeels: [
      "Lab work and research projects",
      "Careful observation and analysis",
      "Open-ended questions that take time",
    ],
  },
  {
    id: "biz",
    title: "Business, Economics & Entrepreneurship",
    about:
      "How organizations and markets work — and how ideas turn into products, services, or businesses.",
    enjoy:
      "Decision-making, leadership, persuasion, understanding how value is created.",
    majors: [
      "Business Administration",
      "Economics",
      "Finance",
      "Marketing",
      "Management",
      "Entrepreneurship",
      "Accounting",
    ],
    workOn: [
      "Planning projects or running group activities",
      "Making decisions about resources and tradeoffs",
      "Pitching ideas or convincing others",
      "Solving problems that affect customers or teams",
    ],
    learningFeels: [
      "Group projects and real-world examples",
      "Discussing choices and explaining why",
      "Balancing people, money, and time constraints",
    ],
  },
  {
    id: "social",
    title: "Social Sciences",
    about:
      "Understanding people, groups, and societies — how they think, behave, and interact.",
    enjoy:
      "Learning about behavior and culture, analyzing how societies change.",
    majors: [
      "Psychology",
      "Sociology",
      "Anthropology",
      "Political Science",
      "Human Geography",
    ],
    workOn: [
      "Asking questions about people and behavior",
      "Reading and discussing different viewpoints",
      "Using surveys, interviews, or studies to learn",
      "Connecting patterns to real-world issues",
    ],
    learningFeels: [
      "Discussion-heavy learning",
      "Writing and explaining your thinking",
      "Often more than one reasonable answer",
    ],
  },
  {
    id: "comm",
    title: "Communication, Media & Design",
    about:
      "Sharing ideas and information through writing, visuals, media, and design.",
    enjoy:
      "Storytelling, communication, design, understanding how messages affect people.",
    majors: [
      "Communication Studies",
      "Graphic Design",
      "Digital Media",
      "Journalism",
      "Advertising",
      "Public Relations",
    ],
    workOn: [
      "Creating videos, graphics, or content",
      "Designing posters, websites, or social media",
      "Writing stories or messages",
      "Thinking about what will connect with an audience",
    ],
    learningFeels: [
      "Creative projects and presentations",
      "Feedback and revision",
      "Balancing creativity with clarity",
    ],
  },
  {
    id: "arts",
    title: "Arts & Performing Arts",
    about:
      "Expressing ideas and emotions through performance or artistic creation.",
    enjoy:
      "Performing, rehearsing, creating art or music, sharing work with others.",
    majors: [
      "Visual Arts",
      "Music",
      "Theater",
      "Dance",
      "Film Production",
      "Creative Writing",
    ],
    workOn: [
      "Practicing or rehearsing performances",
      "Creating art, music, writing, or film",
      "Building a portfolio of work",
      "Collaborating on productions or shows",
    ],
    learningFeels: [
      "A lot of practice and feedback",
      "Creative risk-taking",
      "Comfort being seen and evaluated",
    ],
  },
  {
    id: "health",
    title: "Health & Human Services",
    about: "Supporting people’s health, well-being, and quality of life.",
    enjoy:
      "Helping others directly, making a meaningful difference, structured environments.",
    majors: [
      "Nursing",
      "Public Health",
      "Health Sciences",
      "Social Work",
      "Human Services",
      "Kinesiology",
      "Behavioral Health & Psychology",
    ],
    workOn: [
      "Supporting people through challenges",
      "Learning about health and well-being",
      "Working in structured settings with responsibility",
      "Team-based problem solving around people’s needs",
    ],
    learningFeels: [
      "People-centered learning",
      "Clear standards and responsibilities",
      "Practice-based learning (simulations, placements)",
    ],
  },
  {
    id: "edu",
    title: "Education & Learning Sciences",
    about:
      "Helping people learn, grow, and improve through teaching, coaching, or training.",
    enjoy:
      "Explaining ideas, mentoring others, planning lessons, supporting learning.",
    majors: [
      "Education",
      "Elementary Education",
      "Secondary Education",
      "Special Education",
      "Educational Psychology",
    ],
    workOn: [
      "Explaining concepts in different ways",
      "Coaching others to improve",
      "Planning activities that help learning",
      "Working with different learning styles",
    ],
    learningFeels: [
      "Communication-heavy",
      "Practice + reflection",
      "Patience and relationship-building",
    ],
  },
  {
    id: "env",
    title: "Environmental & Earth Sciences",
    about:
      "Studying the Earth, the environment, and how people interact with natural systems.",
    enjoy: "Nature, sustainability, fieldwork, environmental challenges.",
    majors: [
      "Environmental Studies",
      "Environmental Science",
      "Earth Science",
      "Geology",
      "Sustainability Studies",
    ],
    workOn: [
      "Learning about ecosystems and environmental change",
      "Collecting information outdoors or in labs",
      "Exploring sustainability solutions",
      "Understanding how humans impact nature",
    ],
    learningFeels: [
      "A mix of science and real-world issues",
      "Sometimes fieldwork or outdoor learning",
      "Big-picture thinking about impacts",
    ],
  },
  {
    id: "civic",
    title: "Public Policy, Law & Civic Fields",
    about:
      "How rules, laws, and public decisions are made — and how they affect communities.",
    enjoy:
      "Debating issues, fairness, writing and discussion, community problem-solving.",
    majors: [
      "Political Science",
      "Public Policy",
      "Legal Studies",
      "Criminal Justice",
      "International Relations",
      "Public Administration",
      "Political Science & Public Policy",
    ],
    workOn: [
      "Discussing and debating real issues",
      "Understanding rules and how they work",
      "Writing persuasive arguments",
      "Thinking about fairness and impact",
    ],
    learningFeels: [
      "Reading and writing a lot",
      "Discussion and viewpoints",
      "Often more than one reasonable answer",
    ],
  },
  {
    id: "skilled",
    title: "Skilled & Applied Technical Fields",
    about:
      "Hands-on, applied learning focused on building, fixing, or maintaining real-world systems and equipment.",
    enjoy: "Working with tools, learning by doing, seeing results quickly.",
    majors: [
      "Automotive Technology",
      "Construction Management",
      "Electrical Technology",
      "Mechanical Technology",
      "Welding Technology",
      "Manufacturing Technology",
      "HVAC Technology",
      "Culinary Arts",
      "Plumbing / Pipefitting",
      "Carpentry / Building Trades",
    ],
    workOn: [
      "Fixing or installing real equipment",
      "Working with tools and machines",
      "Building or repairing things directly",
      "Solving practical problems with immediate impact",
    ],
    learningFeels: [
      "Hands-on classes (labs/shops)",
      "Learning by doing",
      "Practicing skills to improve",
    ],
  },
];
// Major catalog (student-friendly). For majors not listed here, we use a safe fallback template.
const majorCatalog = {
  "Computer Science": {
    title: "Computer Science",
    whatItIs:
      "Computer Science is about creating solutions with code. You learn how computers work, how software is built, and how to solve problems step by step.",
    whatYouStudy: [
      "Coding (building programs that do things)",
      "Problem-solving and logic",
      "How data is stored and used",
      "How to design and test software",
    ],
    whatProjectsFeelLike: [
      "Building a simple app, game, or website",
      "Fixing bugs and improving your code",
      "Working on projects where you try, test, and improve",
    ],
    goodToKnow: [
      "You don’t have to be a ‘genius’ and consistency matters more than perfection.",
      "A lot of learning happens through practice and projects.",
    ],
    careerExamples: [
      "Software developer", 
      "Application builder",
      "Cybersecurity analyst",
      "Data analyst", 
      "Data scientist (with more study)",
      "Game developer (with interest in games)",
    ],
    tryItInHS: [
      "Try a beginner coding course (Scratch → Python/JavaScript)",
      "Build a small project (calculator, simple website, mini game)",
      "Join a coding club or robotics team",
    ],
  },
  "Mechanical Engineering": {
    title: "Mechanical Engineering",
    whatItIs:
      "Mechanical Engineering is about designing and improving physical things like machines, devices, and moving systems. You learn to plan, test, and improve designs.",
    whatYouStudy: [
      "Forces, motion, and how things move",
      "Designing parts and systems",
      "Materials (what things are made of)",
      "Testing and improving prototypes",
    ],
    whatProjectsFeelLike: [
      "Designing something, building a model, and improving it",
      "Solving practical problems with math and science ideas",
      "Working on longer projects that go through versions",
    ],
    goodToKnow: [
      "It often uses math and physics, but projects make it feel more real.",
      "Engineering is usually plan → build → test → improve.",
    ],
    careerExamples: [
      "Product or device engineer",
      "Manufacturing / production engineer",
      "Robotics / automation engineer",
      "Automotive / aerospace engineering (with interest)",
    ],
    tryItInHS: [
      "Join robotics, engineering, or maker clubs",
      "Try CAD/design tools or build kits",
      "Do a project where you design and test something (bridge, launcher, model)",
    ],
  },
  
  "Health Sciences": {
    title: "Health Sciences",
    whatItIs:
      "Health Sciences is a broad major about how health and the human body connect to care systems. It often mixes biology basics with real-world health topics like prevention, health systems, and patient support.",
    whatYouStudy: [
      "Human biology and health basics (varies by school)",
      "Health systems and how care is delivered",
      "Health behavior, prevention, and wellness",
      "Ethics, safety, and professional communication",
    ],
    whatProjectsFeelLike: [
      "Learning with real-world examples (patients, communities, health problems)",
      "Projects that connect science to everyday health decisions",
      "Sometimes hands-on experiences through observations or simulations",
    ],
    goodToKnow: [
      "Health Sciences is flexible and it can lead toward many paths, but the exact options depend on the school.",
      "Some health careers require extra training or licensing after college.",
    ],
    careerExamples: [
      "Health program or clinic support roles",
      "Public health or community health support roles",
      "Health education / wellness roles",
      "Pre-professional foundation for specialized health paths (with further study)",
    ],
    tryItInHS: [
      "Volunteer in a clinic, hospital, senior center, or community health program (if possible)",
      "Take biology/health classes that interest you and notice which topics you enjoy",
      "Interview someone in healthcare about what their day-to-day is really like",
    ],
  },

  "Human Services": {
    title: "Human Services",
    whatItIs:
      "Human Services focuses on helping people meet real-life needs like housing, food, safety, school support, and mental well-being, usually by connecting people to resources and support systems.",
    whatYouStudy: [
      "How support systems work (schools, nonprofits, community programs)",
      "Communication, empathy, and helping skills",
      "Basic counseling/support techniques (intro level)",
      "Ethics, boundaries, and documentation",
    ],
    whatProjectsFeelLike: [
      "Case examples and role-play style practice (how you’d respond in real situations)",
      "Learning about community resources and how to connect people to them",
      "Often discussion + reflection + applied projects",
    ],
    goodToKnow: [
      "This work can feel meaningful and emotionally heavy at times.",
      "Some roles are entry-level; others require certifications or graduate school depending on the path.",
    ],
    careerExamples: [
      "Case management / client support roles (often supervised)",
      "Youth, school, or community program support roles",
      "Nonprofit program coordination roles",
      "Foundations for social work, counseling, or behavioral health paths (with further training)",
    ],
    tryItInHS: [
      "Volunteer with a community organization (food bank, youth program, senior center)",
      "Try peer support or mentorship roles (clubs, tutoring, team support)",
      "Learn what resources exist in your community and how people access them",
    ],
  },
  "Graphic Design": {
    title: "Graphic Design",
    whatItIs:
      "Graphic Design is about communicating ideas visually using layout, typography, color, and visuals to make messages clear and appealing.",
    whatYouStudy: [
      "Design basics (layout, color, type)",
      "Visual communication and storytelling",
      "Design tools (like Adobe or similar)",
      "Giving and receiving feedback",
    ],
    whatProjectsFeelLike: [
      "Designing posters, logos, social posts, or layouts",
      "Making multiple versions and improving with feedback",
      "Balancing creativity with clear communication",
    ],
    goodToKnow: [
      "Design is often iterative and you revise a lot.",
      "A portfolio (examples of your work) matters.",
    ],
    careerExamples: [
      "Graphic designer",
      "Brand / visual designer",
      "UI/UX designer (with more focus on experience)",
      "Marketing / content design roles",
    ],
    tryItInHS: [
      "Make a few designs for real uses (club flyer, poster, social post)",
      "Try free design tools and learn basics",
      "Build a small portfolio folder",
    ],
  },
  // ===== NEW MAJORS (Add-Now set) =====

  // Skilled & Applied Technical — targeted adds
  "Automotive Technology": {
    title: "Automotive Technology",
    whatItIs:
      "Automotive Technology is about diagnosing, repairing, and maintaining vehicles using tools, diagnostic systems, and hands-on troubleshooting.",
    whatYouStudy: [
      "Vehicle systems (engine, brakes, steering, electrical basics)",
      "Diagnostics (finding what’s causing a problem)",
      "Tools, safety, and shop procedures",
      "Preventive maintenance (keeping vehicles reliable)",
    ],
    whatProjectsFeelLike: [
      "Hands-on lab/shop work: inspect → diagnose → repair → test",
      "Learning to use diagnostic tools and follow step-by-step procedures",
      "Fixing real problems and seeing results quickly",
    ],
    goodToKnow: [
      "Modern cars are part mechanical, part computer and diagnostics matters a lot.",
      "Programs often connect to industry certifications and apprenticeships.",
    ],
    careerExamples: [
      "Automotive service technician",
      "Dealership or independent shop technician",
      "Fleet maintenance technician (buses, delivery, city vehicles)",
      "Service advisor or shop lead pathways (later)",
    ],
    tryItInHS: [
      "Take auto/shop classes if offered (or join a hands-on club)",
      "Learn basic maintenance (oil, tires, safety checks) with supervision",
      "Job-shadow a mechanic or talk to a technician about their day",
    ],
  },

  "HVAC Technology": {
    title: "HVAC Technology",
    whatItIs:
      "HVAC Technology focuses on heating, cooling, and ventilation systems including installing, maintaining, and troubleshooting the equipment that keeps buildings comfortable and safe.",
    whatYouStudy: [
      "Heating and cooling system basics",
      "Electrical and controls basics (thermostats, sensors)",
      "Troubleshooting and repair processes",
      "Safety, tools, and codes/standards (intro level)",
    ],
    whatProjectsFeelLike: [
      "Hands-on labs: install → test → diagnose issues → fix",
      "Working step-by-step and checking systems carefully",
      "A mix of physical work and problem-solving",
    ],
    goodToKnow: [
      "HVAC is very practical since people always need heating/cooling working.",
      "Some paths involve certifications; programs often help you prep.",
    ],
    careerExamples: [
      "HVAC installer or service technician",
      "Building maintenance / facilities roles",
      "Commercial HVAC pathways (later)",
      "Energy efficiency / controls pathways (with interest)",
    ],
    tryItInHS: [
      "Try a basic electronics or applied science class (controls are part of HVAC)",
      "Learn how home/building systems work (filters, airflow, thermostats)",
      "Talk to a facilities or HVAC tech about what they troubleshoot most",
    ],
  },

  "Construction Management": {
    title: "Construction Management",
    whatItIs:
      "Construction Management is about planning and running construction projects including scheduling, coordinating people and materials, and making sure work is safe, on time, and within budget.",
    whatYouStudy: [
      "Project planning and scheduling",
      "Reading plans/blueprints and construction basics",
      "Cost estimating and budgeting",
      "Safety, quality, and coordination",
    ],
    whatProjectsFeelLike: [
      "Planning a project timeline and coordinating tasks",
      "Tracking progress and solving on-site problems",
      "Communicating with different teams (trades, suppliers, clients)",
    ],
    goodToKnow: [
      "This is more coordination/leadership than hands-on trade work but you need practical construction understanding.",
      "Internships and field experience matter a lot.",
    ],
    careerExamples: [
      "Project coordinator / assistant project manager",
      "Construction scheduler or estimator (entry-level pathways)",
      "Site/field coordinator roles",
      "Facilities or construction operations roles",
    ],
    tryItInHS: [
      "Help plan a real project (club event, build, fundraiser) and track tasks",
      "Try a basic CAD/design or construction elective if available",
      "Job-shadow a construction manager or visit a job site (with permission)",
    ],
  },

  // ===== NEW MAJORS (Add-Now set) =====

  "Software Engineering": {
    title: "Software Engineering",
    whatItIs:
      "Software Engineering focuses on designing, building, and improving software systems from apps and websites to tools that help people work, learn, or communicate.",
    whatYouStudy: [
      "Programming fundamentals and problem-solving",
      "How software is planned, built, and tested",
      "Working with data, systems, and code structure",
      "Collaborating on technical projects",
    ],
    whatProjectsFeelLike: [
      "Building simple apps, programs, or tools",
      "Fixing bugs and improving how software works",
      "Working in teams to design and test solutions",
      "Iterating on ideas based on feedback",
    ],
    goodToKnow: [
      "Software development is often collaborative and iterative.",
      "Attention to detail and persistence matter as much as creativity.",
    ],
    careerExamples: [
      "Software engineer",
      "Software or application development roles",
      "Technology-focused roles across many industries",
      "Roles that combine technical problem-solving with teamwork",
    ],
    tryItInHS: [
      "Learn basic coding through free online tools or classes",
      "Build small projects like simple apps or games",
      "Practice breaking big problems into smaller steps",
    ],
  },

  "Computer Engineering": {
    title: "Computer Engineering",
    whatItIs:
      "Computer Engineering focuses on how computers work at a systems level combining hardware, software, and electronics to build and improve computing devices.",
    whatYouStudy: [
      "Computer hardware and digital systems",
      "How software interacts with physical components",
      "Circuits, processors, and embedded systems",
      "Programming alongside engineering concepts",
    ],
    whatProjectsFeelLike: [
      "Working with both code and physical components",
      "Designing or testing small hardware-based systems",
      "Troubleshooting how software and hardware work together",
      "Improving performance, reliability, or efficiency",
    ],
    goodToKnow: [
      "This major sits between electrical engineering and computer science.",
      "It often involves both hands-on building and technical problem-solving.",
    ],
    careerExamples: [
      "Hardware or systems-focused technology roles",
      "Embedded systems or device-related roles",
      "Technical roles that bridge software and hardware",
    ],
    tryItInHS: [
      "Learn basic programming and how computers work internally",
      "Experiment with electronics kits or robotics clubs",
      "Take math, physics, or engineering-focused classes if available",
    ],
  },

  "Biomedical Engineering": {
    title: "Biomedical Engineering",
    whatItIs:
      "Biomedical Engineering combines engineering, science, and medicine to design technologies that help improve health and quality of life.",
    whatYouStudy: [
      "Engineering principles applied to the human body",
      "Biology, chemistry, and medical science basics",
      "How medical devices and technologies are designed",
      "Data, systems, and problem-solving in health contexts",
    ],
    whatProjectsFeelLike: [
      "Designing or analyzing medical-related devices or systems",
      "Solving problems where biology and engineering overlap",
      "Working on team projects with technical and scientific components",
      "Testing and improving designs based on constraints and feedback",
    ],
    goodToKnow: [
      "This major blends multiple subjects, so coursework can feel interdisciplinary.",
      "It focuses on designing solutions, not practicing medicine.",
    ],
    careerExamples: [
      "Medical technology or device-related roles",
      "Research or development support roles",
      "Further study in engineering, health, or science-related fields",
    ],
    tryItInHS: [
      "Take biology, chemistry, physics, and math classes",
      "Explore engineering or science clubs and competitions",
      "Learn about medical technologies and how they are designed",
    ],
  },

  "Chemical Engineering": {
    title: "Chemical Engineering",
    whatItIs:
      "Chemical Engineering focuses on using chemistry, math, and engineering to design processes that turn raw materials into useful products.",
    whatYouStudy: [
      "Chemistry and how materials react and change",
      "Math and science used to model processes",
      "How large-scale systems are designed and controlled",
      "Safety, efficiency, and problem-solving in technical systems",
    ],
    whatProjectsFeelLike: [
      "Analyzing how materials or substances behave",
      "Designing processes that improve efficiency or quality",
      "Solving problems related to production or scaling",
      "Working through calculations and real-world constraints",
    ],
    goodToKnow: [
      "This major is less about lab experiments and more about systems and processes.",
      "Strong math and problem-solving skills are important.",
    ],
    careerExamples: [
      "Process or systems-focused engineering roles",
      "Roles in manufacturing, materials, or technology",
      "Further study in engineering or applied science fields",
    ],
    tryItInHS: [
      "Take chemistry, physics, and math courses",
      "Pay attention to how everyday products are made",
      "Explore science or engineering clubs and competitions",
    ],
  },

  "Aerospace Engineering": {
    title: "Aerospace Engineering",
    whatItIs:
      "Aerospace Engineering focuses on designing and studying aircraft, spacecraft, and other systems that operate in the air or beyond Earth.",
    whatYouStudy: [
      "Physics and math related to motion and forces",
      "How aircraft and spacecraft are designed",
      "Materials and systems used in flight",
      "Testing, safety, and performance considerations",
    ],
    whatProjectsFeelLike: [
      "Designing or analyzing flight-related systems",
      "Solving problems involving motion, forces, and stability",
      "Working on team-based engineering challenges",
      "Testing designs through models or simulations",
    ],
    goodToKnow: [
      "This major builds on strong math and physics foundations.",
      "It focuses on engineering systems, not piloting or flying.",
    ],
    careerExamples: [
      "Engineering roles related to flight or space systems",
      "Research or testing-focused technical roles",
      "Further study in engineering or science fields",
    ],
    tryItInHS: [
      "Take physics and advanced math classes if available",
      "Join robotics, engineering, or aerospace-related clubs",
      "Learn about how aircraft and spacecraft are designed",
    ],
  },

  "Environmental Engineering": {
    title: "Environmental Engineering",
    whatItIs:
      "Environmental Engineering focuses on designing solutions that protect the environment and support healthy, sustainable systems for people and communities.",
    whatYouStudy: [
      "Engineering principles related to water, air, and land systems",
      "Environmental science and sustainability concepts",
      "How infrastructure affects natural systems",
      "Designing solutions that balance impact and efficiency",
    ],
    whatProjectsFeelLike: [
      "Solving problems related to clean water or pollution",
      "Analyzing environmental data and systems",
      "Designing infrastructure with sustainability in mind",
      "Working on real-world environmental challenges",
    ],
    goodToKnow: [
      "This major combines engineering with environmental science.",
      "Solutions often involve tradeoffs between cost, impact, and feasibility.",
    ],
    careerExamples: [
      "Environmental or infrastructure-focused engineering roles",
      "Sustainability or resource management roles",
      "Further study in engineering or environmental fields",
    ],
    tryItInHS: [
      "Take science and math courses related to the environment",
      "Get involved in environmental or sustainability projects",
      "Learn about how engineering can solve environmental challenges",
    ],
  },

  "Accounting": {
    title: "Accounting",
    whatItIs:
      "Accounting focuses on understanding, organizing, and communicating financial information so people and organizations can make informed decisions.",
    whatYouStudy: [
      "Financial records and reporting",
      "How organizations track income, expenses, and budgets",
      "Basic business law and ethics",
      "Analyzing financial information",
    ],
    whatProjectsFeelLike: [
      "Working through real-world financial examples",
      "Organizing and checking data for accuracy",
      "Interpreting numbers to explain what’s happening financially",
      "Applying rules and standards to practical situations",
    ],
    goodToKnow: [
      "Accounting is structured and detail-oriented.",
      "Accuracy and consistency are especially important.",
    ],
    careerExamples: [
      "Accounting or finance-related roles",
      "Business operations or analysis roles",
      "Further study in business or professional fields",
    ],
    tryItInHS: [
      "Take business, economics, or math courses",
      "Practice budgeting or tracking simple financial projects",
      "Pay attention to how money flows in everyday situations",
    ],
  },

  "Behavioral Health & Psychology": {
    title: "Behavioral Health & Psychology",
    whatItIs:
      "Behavioral Health & Psychology focuses on understanding behavior and mental well-being in the context of health, support systems, and helping people navigate challenges.",
    whatYouStudy: [
      "Mental health and well-being concepts",
      "Stress, coping, and emotional regulation",
      "Human development and behavior",
      "How health and behavior influence each other",
    ],
    whatProjectsFeelLike: [
      "Studying case examples related to well-being",
      "Learning how support systems are designed",
      "Reflecting on ethical and practical challenges",
      "Connecting behavior concepts to real-life situations",
    ],
    goodToKnow: [
      "This major does not train you to diagnose or treat patients by itself.",
      "It often serves as a foundation for many different helping or health-related paths.",
    ],
    careerExamples: [
      "Community or support-focused roles",
      "Health education or wellness-related roles",
      "Further study in psychology, counseling, or health fields",
    ],
    tryItInHS: [
      "Volunteer with community or support organizations",
      "Learn about mental health awareness and wellness",
      "Pay attention to how environments affect people’s well-being",
    ],
  },

  "Political Science & Public Policy": {
    title: "Political Science & Public Policy",
    whatItIs:
      "Political Science & Public Policy looks at how public decisions are made — and how laws, policies, and institutions shape communities and everyday life.",
    whatYouStudy: [
      "Public policy and governance",
      "Law, institutions, and civic systems",
      "How policies are designed and evaluated",
      "The role of government in society",
    ],
    whatProjectsFeelLike: [
      "Studying real-world policy examples",
      "Writing or discussing possible solutions to public problems",
      "Analyzing how rules affect people and communities",
      "Comparing policy approaches across places",
    ],
    goodToKnow: [
      "This major focuses on understanding systems, not training lawyers or politicians.",
      "Many students use it as a foundation for a wide range of future paths.",
    ],
    careerExamples: [
      "Policy analysis or program support roles",
      "Public administration or civic organizations",
      "Further study in law, policy, or public affairs",
    ],
    tryItInHS: [
      "Pay attention to how rules and policies affect daily life",
      "Get involved in community or civic activities",
      "Practice researching issues from different perspectives",
    ],
  },

  // Skilled & Applied Technical (split majors)
  "Electrical Technology": {
    title: "Electrical Technology",
    whatItIs:
      "Electrical Technology focuses on learning how electrical systems are installed, maintained, and repaired in real-world settings.",
    whatYouStudy: [
      "Basic electrical systems and components",
      "How power, circuits, and wiring work",
      "Safety standards and procedures",
      "Reading diagrams and technical instructions",
    ],
    whatProjectsFeelLike: [
      "Installing or testing electrical systems",
      "Troubleshooting problems to find what’s not working",
      "Working with tools and equipment in hands-on settings",
      "Following step-by-step procedures to complete tasks",
    ],
    goodToKnow: [
      "This major emphasizes practical skills and safety.",
      "Learning is often hands-on and task-focused.",
    ],
    careerExamples: [
      "Electrical or technical support roles",
      "Maintenance or installation-focused roles",
      "Skilled technical roles across many industries",
    ],
    tryItInHS: [
      "Take shop, technology, or applied science classes",
      "Learn basic electrical concepts through projects or kits",
      "Pay attention to how electrical systems are used every day",
    ],
  },

  "Mechanical Technology": {
    title: "Mechanical Technology",
    whatItIs:
      "Mechanical Technology focuses on learning how mechanical systems work including how to build, maintain, and repair machines and equipment in real-world settings.",
    whatYouStudy: [
      "How machines and mechanical systems function",
      "Tools, materials, and measurement basics",
      "Safety standards and hands-on procedures",
      "Reading diagrams and technical instructions",
    ],
    whatProjectsFeelLike: [
      "Working with equipment to diagnose and fix problems",
      "Assembling, adjusting, or maintaining mechanical systems",
      "Using tools carefully and following step-by-step processes",
      "Testing systems to make sure they work properly",
    ],
    goodToKnow: [
      "Learning is often hands-on and practice-based.",
      "Attention to detail and safety are especially important.",
    ],
    careerExamples: [
      "Mechanical maintenance or repair-focused roles",
      "Equipment or systems support roles",
      "Skilled technical roles across many industries",
    ],
    tryItInHS: [
      "Take shop, technology, or applied science classes",
      "Practice building, fixing, or troubleshooting things",
      "Join a hands-on club like robotics or auto tech if available",
    ],
  },

  "Welding Technology": {
    title: "Welding Technology",
    whatItIs:
      "Welding Technology focuses on joining and shaping metal using specialized tools and techniques to build strong, precise structures and parts.",
    whatYouStudy: [
      "Welding methods and equipment",
      "Metals, materials, and how they behave under heat",
      "Safety practices and protective procedures",
      "Measuring, reading plans, and quality checks",
    ],
    whatProjectsFeelLike: [
      "Practicing welding techniques and improving your precision",
      "Building or repairing metal parts and structures",
      "Following detailed instructions and safety steps",
      "Checking your work for strength, fit, and accuracy",
    ],
    goodToKnow: [
      "Welding requires focus, patience, and careful technique.",
      "Safety and consistency are essential.",
    ],
    careerExamples: [
      "Welding or fabrication-focused roles",
      "Manufacturing or construction support roles",
      "Skilled trade roles in many kinds of industries",
    ],
    tryItInHS: [
      "Take welding, metalworking, or shop classes if available",
      "Practice careful measurement and tool skills",
      "Learn about how metal structures are built and repaired",
    ],
  },

  "Manufacturing Technology": {
    title: "Manufacturing Technology",
    whatItIs:
      "Manufacturing Technology focuses on how products are made using tools, machines, and processes to produce parts and goods efficiently and consistently.",
    whatYouStudy: [
      "How manufacturing systems and processes work",
      "Machines, tools, and production equipment basics",
      "Quality control and process improvement",
      "Safety standards and workplace procedures",
    ],
    whatProjectsFeelLike: [
      "Learning how parts are produced and assembled",
      "Using equipment to create or test products",
      "Checking quality and improving a process step-by-step",
      "Working on hands-on projects that produce real outputs",
    ],
    goodToKnow: [
      "Manufacturing emphasizes consistency, quality, and efficiency.",
      "Many programs focus on practical skills and real-world systems.",
    ],
    careerExamples: [
      "Production or operations support roles",
      "Quality or process-focused technical roles",
      "Skilled technical roles in manufacturing environments",
    ],
    tryItInHS: [
      "Explore engineering, robotics, or makerspace projects",
      "Learn how everyday products are made",
      "Practice organizing steps and improving how a process works",
    ],
  },

  "Plumbing / Pipefitting": {
    title: "Plumbing / Pipefitting",
    whatItIs:
      "Plumbing / Pipefitting focuses on installing and maintaining systems that carry water, gas, or other materials through buildings and infrastructure.",
    whatYouStudy: [
      "How piping systems are designed and installed",
      "Materials, tools, and measurement techniques",
      "Safety practices and building standards",
      "Reading plans and technical drawings",
    ],
    whatProjectsFeelLike: [
      "Assembling and installing piping systems",
      "Measuring, cutting, and fitting materials",
      "Solving practical problems on-site",
      "Working through hands-on, step-by-step tasks",
    ],
    goodToKnow: [
      "Work often involves physical activity and problem-solving.",
      "Precision and safety are important.",
    ],
    careerExamples: [
      "Plumbing or infrastructure-related roles",
      "Construction or maintenance-focused roles",
      "Skilled trade roles across residential or industrial settings",
    ],
    tryItInHS: [
      "Take construction, shop, or technical classes",
      "Practice measuring and working with tools",
      "Learn how building systems function behind the scenes",
    ],
  },

  "Carpentry / Building Trades": {
    title: "Carpentry / Building Trades",
    whatItIs:
      "Carpentry / Building Trades focuses on constructing, repairing, and maintaining structures using hands-on building skills.",
    whatYouStudy: [
      "Construction methods and materials",
      "Reading blueprints and measurements",
      "Tool use and safety practices",
      "How structures are built and maintained",
    ],
    whatProjectsFeelLike: [
      "Building or assembling structures and components",
      "Measuring, cutting, and fitting materials accurately",
      "Working on team-based construction projects",
      "Seeing tangible results from your work",
    ],
    goodToKnow: [
      "This major emphasizes hands-on learning and physical work.",
      "Accuracy, teamwork, and safety are important.",
    ],
    careerExamples: [
      "Construction or building-focused roles",
      "Skilled trade or maintenance roles",
      "Further training in specialized building fields",
    ],
    tryItInHS: [
      "Take woodworking or construction classes",
      "Participate in hands-on projects or makerspaces",
      "Learn how buildings and structures are put together",
    ],
  },
};

function generateMajorInfo(majorName, clusterId) {
  const cluster = clusters.find((c) => c.id === clusterId);
  const clusterTitle = cluster?.title || "this area";

  // Helper to build a consistent structure
  const base = {
    title: majorName,
    whatItIs: `${majorName} is a major students explore within ${clusterTitle}. Here’s what it often looks like in school — in plain language.`,
    whatYouStudy: [
      "Intro basics (the foundation of the field)",
      "Skills that help you solve problems in this area",
      "Projects that apply what you learn",
    ],
    whatProjectsFeelLike: [
      "Learning basics first, then applying them in projects",
      "Practice + feedback + improvement over time",
    ],
    goodToKnow: [
      "Majors can look a little different depending on the school.",
      "You don’t need to decide now — the point is to explore.",
    ],
    careerExamples: [
      "Different roles connect to this major (there are many paths)",
      "People often combine this major with internships, clubs, or projects",
    ],
    tryItInHS: [
      "Look up an intro course description from a college website",
      "Try a small project or club related to this area",
      "Talk to someone who studies or works in this field",
    ],
  };

  // --- Engineering & Technology ---
  if (clusterId === "eng_tech") {
    base.whatItIs =
      "Engineering majors are about designing and improving how physical things work like machines, structures, and systems. You learn to plan, test, and improve designs.";
    base.whatYouStudy = [
      "Math + science used to solve real problems",
      "Design (planning before building)",
      "Materials and how parts behave",
      "Testing, modeling, and improving prototypes",
    ];
    base.whatProjectsFeelLike = [
      "Design → build a model/prototype → test → improve",
      "Team projects with real constraints (time, budget, materials)",
    ];
    base.goodToKnow = [
      "It can be math-heavy, but projects help make it feel real.",
      "A lot of engineering is iteration: you rarely get it perfect on the first try.",
    ];
    base.careerExamples = [
      "Design / product engineering",
      "Manufacturing / production engineering",
      "Quality / testing roles",
      "Field engineering / technical support roles",
    ];
    base.tryItInHS = [
      "Join robotics, engineering, or maker clubs",
      "Try CAD/design tools or build kits",
      "Do a build-and-test project (bridge, launcher, model)",
    ];

    const name = majorName.toLowerCase();
    if (name.includes("electrical")) {
      base.whatItIs =
        "Electrical Engineering focuses on electricity, circuits, and electronics and how power and signals move through devices.";
      base.whatYouStudy = [
        "Circuits and electronics (how devices are built)",
        "Signals, sensors, and control systems",
        "Power and energy systems",
        "Hands-on labs building and testing circuits",
      ];
      base.careerExamples = [
        "Electrical / electronics engineer",
        "Power / energy engineer",
        "Embedded systems / hardware engineer",
        "Automation / controls roles",
      ];
      base.tryItInHS = [
        "Try basic electronics kits (circuits, Arduino)",
        "Join robotics or engineering club",
        "Build a simple sensor or LED project",
      ];
    } else if (name.includes("civil")) {
      base.whatItIs =
        "Civil Engineering focuses on designing and improving the built world like bridges, roads, buildings, and water systems.";
      base.whatYouStudy = [
        "Structures and materials (how things stay strong)",
        "Construction basics and planning",
        "Transportation systems (roads, traffic, transit)",
        "Water and environmental systems",
      ];
      base.careerExamples = [
        "Civil / structural engineer",
        "Construction project roles",
        "Transportation planning/engineering",
        "Environmental engineering roles",
      ];
      base.tryItInHS = [
        "Do a bridge/structure build-and-test challenge",
        "Notice infrastructure around you (roads, drainage, buildings)",
        "Try CAD or model-building projects",
      ];
    } else if (name.includes("industrial")) {
      base.whatItIs =
        "Industrial Engineering focuses on making systems run better by improving processes, reducing waste, and making work more efficient.";
      base.whatYouStudy = [
        "Process improvement and efficiency",
        "Data and decision-making for operations",
        "Supply chain and logistics basics",
        "Quality and systems thinking",
      ];
      base.careerExamples = [
        "Industrial / process engineer",
        "Operations / continuous improvement roles",
        "Supply chain / logistics analyst",
        "Quality / systems roles",
      ];
      base.tryItInHS = [
        "Try optimizing a process (club event, workflow) and measuring improvement",
        "Track steps/time in a routine and redesign it",
        "Learn basic spreadsheets and data thinking",
      ];
    } else if (name.includes("technology")) {
      base.whatItIs =
        "Engineering Technology is more hands-on and applied. You learn engineering ideas while spending more time in labs and practical projects.";
      base.whatYouStudy = [
        "Applied engineering concepts",
        "Hands-on labs and testing",
        "Using tools, equipment, and measurement",
        "Troubleshooting and improving real systems",
      ];
      base.careerExamples = [
        "Engineering technologist",
        "Manufacturing / testing roles",
        "Field technician / field engineer pathways",
        "Quality / lab roles",
      ];
      base.tryItInHS = [
        "Take hands-on STEM electives (shop, engineering, robotics)",
        "Build and test practical projects",
        "Try internships/job-shadowing in technical settings",
      ];
    }
  }

  // --- Computer, Data & Information ---
  if (clusterId === "cs_data") {
    base.whatItIs =
      "Computer and data majors are about using technology to solve problems with code, data, networks, and digital tools.";
    base.whatYouStudy = [
      "Coding and problem-solving",
      "How data is stored, cleaned, and used",
      "How computer systems and networks work",
      "Building and testing digital projects",
    ];
    base.whatProjectsFeelLike = [
      "Building apps, tools, or data projects",
      "Debugging and improving your work",
      "Lots of practice — you learn by doing",
    ];
    base.goodToKnow = [
      "You build skill through repetition and it’s normal to get stuck at first.",
      "Projects matter a lot (they show what you can do).",
    ];
    base.careerExamples = [
      "Software / web developer",
      "Data analyst",
      "Cybersecurity roles",
      "IT / systems roles",
    ];
    base.tryItInHS = [
      "Try a beginner coding course and build a small project",
      "Do a data mini-project (sports stats, music data, etc.)",
      "Join a coding/robotics club",
    ];

    const name = majorName.toLowerCase();
    if (name.includes("information systems")) {
      base.whatItIs =
        "Information Systems mixes business and tech. You learn how organizations use technology to run better.";
      base.whatYouStudy = [
        "Databases and how information is organized",
        "Business processes and how systems support them",
        "Project planning and teamwork",
        "Basic coding or tech tools (varies by program)",
      ];
      base.careerExamples = [
        "Business / systems analyst",
        "IT project roles",
        "Product operations / tech operations",
        "Data / reporting roles",
      ];
    } else if (name.includes("data science")) {
      base.whatItIs =
        "Data Science is about using data to answer questions and make decisions. You learn statistics, coding, and how to find patterns.";
      base.whatYouStudy = [
        "Statistics and probability",
        "Coding for data (often Python/R)",
        "Data cleaning and visualization",
        "Intro machine learning concepts",
      ];
      base.careerExamples = [
        "Data analyst",
        "Data scientist (often with more study)",
        "Business intelligence roles",
        "Analytics roles in many industries",
      ];
      base.tryItInHS = [
        "Analyze a dataset (sports, movies, school survey) in a spreadsheet",
        "Learn basic Python and make simple charts",
        "Try a stats or AP math class if it interests you",
      ];
    } else if (name.includes("cyber")) {
      base.whatItIs =
        "Cybersecurity is about protecting computers, networks, and information. You learn how attacks happen and how to defend systems.";
      base.whatYouStudy = [
        "Networks (how computers connect)",
        "Security basics and common threats",
        "Safe practices and risk thinking",
        "Hands-on labs (finding and fixing issues)",
      ];
      base.careerExamples = [
        "Security analyst / SOC roles",
        "IT security and risk roles",
        "Network/security support roles",
        "Security engineering (later)",
      ];
      base.tryItInHS = [
        "Learn basic online safety and networking concepts",
        "Try beginner cybersecurity labs (CTFs)",
        "Join a tech club and explore security topics",
      ];
    } else if (name.includes("information technology") || name === "it") {
      base.whatItIs =
        "Information Technology is about keeping technology running. Focus in on helping people, managing devices, networks, and systems.";
      base.whatYouStudy = [
        "Computer hardware and software basics",
        "Networks and troubleshooting",
        "User support and problem-solving",
        "Systems setup and maintenance",
      ];
      base.careerExamples = [
        "IT support / help desk",
        "Network technician",
        "Systems administrator (later)",
        "Tech support roles in many settings",
      ];
    }
  }

  // --- Physical & Life Sciences (Tier 1 tailored) ---
  if (clusterId === "sci") {
    base.whatItIs =
      "Science majors are about understanding how the natural world works by asking questions, running experiments, and analyzing results.";
    base.whatYouStudy = [
      "Core science concepts (bio/chem/physics depending on the major)",
      "Lab skills and careful measurement",
      "Data analysis and evidence",
      "Scientific writing and communication",
    ];
    base.whatProjectsFeelLike = [
      "Labs and experiments where results aren’t always predictable",
      "Working carefully and repeating tests",
      "Connecting evidence to conclusions",
    ];
    base.goodToKnow = [
      "Science can be open-ended — patience matters.",
      "Lab work is a big part of many programs.",
    ];

    base.careerExamples = [
      "Laboratory or research assistant roles",
      "Biotechnology or life sciences technician roles",
      "Clinical or biomedical research support roles",
      "Foundations for healthcare, applied science, or graduate study (with further training)",
    ];

    base.tryItInHS = [
      "Do a science fair or research-style project",
      "Ask a teacher about lab opportunities",
      "Join a science club or related volunteer work",
    ];

    const name = majorName.toLowerCase();

    // Tailor the top summary by major (helps majors feel distinct immediately)
    if (name.includes("biology")) {
      base.whatItIs =
        "Biology is about living things. How organisms work, how systems in the body function, and how life adapts and changes.";
    } else if (name.includes("biochem")) {
      base.whatItIs =
        "Biochemistry combines biology and chemistry to understand how life works at a molecular level like DNA, proteins, and cells.";
    } else if (name.includes("physics")) {
      base.whatItIs =
        "Physics is about the rules of the universe including motion, energy, forces, and how systems behave in predictable ways.";
    } else if (name.includes("neuro")) {
      base.whatItIs =
        "Neuroscience explores the brain and nervous system; how we think, learn, feel, and behave.";
    } else if (name.includes("chem")) {
      base.whatItIs =
        "Chemistry is about matter and change; how substances react, combine, and form the materials we use every day.";
    }

    // Tailor career directions by major
    if (name.includes("biology")) {
      base.careerExamples = [
        "Laboratory or research assistant roles",
        "Biotechnology or life sciences technician roles",
        "Environmental or field research support roles",
        "Pre-health foundations (with further study)",
      ];
    } else if (name.includes("biochem")) {
      base.careerExamples = [
        "Biotech or pharmaceutical lab roles",
        "Research assistant or laboratory coordinator roles",
        "Clinical or biomedical research support roles",
        "Foundations for medical, dental, or graduate programs",
      ];
    } else if (name.includes("physics")) {
      base.careerExamples = [
        "Research or lab assistant roles",
        "Engineering-adjacent technical roles",
        "Data, modeling, or simulation support roles",
        "Foundations for engineering or graduate study",
      ];
    } else if (name.includes("neuro")) {
      base.careerExamples = [
        "Research assistant or lab coordinator roles",
        "Clinical research or behavioral science support roles",
        "Health, biotech, or data-adjacent research roles",
        "Foundations for psychology, medicine, or graduate study",
      ];
    } else if (name.includes("chem")) {
      base.careerExamples = [
        "Laboratory technician or quality control roles",
        "Materials, manufacturing, or chemical testing roles",
        "Research assistant roles in industry or academia",
        "Foundations for engineering, healthcare, or graduate study",
      ];
    }

    // Tailor Try-it-in-HS ideas by major
    if (name.includes("biology")) {
      base.tryItInHS = [
        "Do a simple biology observation project (plants, insects, local ecosystem)",
        "Volunteer or join a club connected to health, environment, or animals",
        "Look up a biology lab course description and notice what kinds of labs students do",
      ];
    } else if (name.includes("biochem")) {
      base.tryItInHS = [
        "Explore how biology and chemistry connect (nutrition, medicine, biotech)",
        "Try a beginner lab-skill or data mini-project (safe, school-approved)",
        "Read about a biotech or medical research topic that interests you",
      ];
    } else if (name.includes("physics")) {
      base.tryItInHS = [
        "Do a build-and-test project (ramps, rockets, bridges, simple machines)",
        "Try a physics simulation or experiment demo and explain what you learned",
        "Join robotics/engineering clubs if you like hands-on problem solving",
      ];
    } else if (name.includes("neuro")) {
      base.tryItInHS = [
        "Learn basic brain facts (sleep, memory, attention) and track one habit for a week",
        "Read or watch an intro neuroscience talk and write down questions you still have",
        "Explore a school club related to psychology, health, or research if available",
      ];
    } else if (name.includes("chem")) {
      base.tryItInHS = [
        "Try a safe, school-approved chemistry demo and write what changed and why",
        "Practice careful measurement and note-taking (skills that matter in labs)",
        "Pay attention to chemistry in everyday products (cleaners, food, materials)",
      ];
    }

    // Tailor study topics by major
    if (name.includes("chem")) {
      base.whatYouStudy = [
        "Chemistry reactions and how materials change",
        "Lab experiments with careful measurements",
        "Analyzing substances and results",
        "Math used in chemistry (varies by course)",
      ];
    } else if (name.includes("physics")) {
      base.whatYouStudy = [
        "Motion, energy, forces, and electricity",
        "Problem-solving with equations",
        "Labs and experiments",
        "Modeling how the world works",
      ];
    } else if (name.includes("neuro")) {
      base.whatYouStudy = [
        "Brain and nervous system basics",
        "Biology and behavior connections",
        "Research methods and data",
        "Labs or studies depending on program",
      ];
    }
  }

// --- Business ---
if (clusterId === "biz") {
  // Broad default for the Business cluster (used when major doesn't match a named business major)
  base.whatItIs =
    "Business majors are about how organizations make decisions with people, money, and plans. You learn how ideas turn into real projects.";
  base.whatYouStudy = [
    "How businesses operate (planning, budgeting, teamwork)",
    "Decision-making with tradeoffs",
    "Communication and persuasion",
    "Real-world examples and projects",
  ];
  base.whatProjectsFeelLike = [
    "Group projects, presentations, and case studies",
    "Making a plan and explaining your choices",
  ];
  base.goodToKnow = [
    "Business is broad — different majors feel very different.",
    "Internships and projects help you learn what you like.",
  ];
  base.careerExamples = [
    "Marketing and customer-focused roles",
    "Finance and money-focused roles",
    "Operations and planning roles",
    "Sales, entrepreneurship, or management paths",
  ];
  base.tryItInHS = [
    "Try a small project: plan an event or fundraiser",
    "Learn basic budgeting in a spreadsheet",
    "Join DECA/FBLA or a business club",
  ];

  const name = (majorName || "").trim().toLowerCase();

  // Business Administration (broad + flexible; NOT "Management")
  if (name === "business administration" || name.includes("business administration")) {
    base.whatItIs =
      "Business Administration is a broad business major that introduces how organizations work across people, money, operations, and decision-making.";
    base.whatYouStudy = [
      "Business basics (management, marketing, finance, operations)",
      "How organizations operate day to day",
      "Decision-making and problem-solving with real examples and cases",
      "Teamwork, leadership, communication, and presentations",
    ];
    base.whatProjectsFeelLike = [
      "Working on broad business problems that touch many areas",
      "Analyzing business situations and proposing solutions",
      "Group projects and case examples that simulate running or improving a business",
      "Presentations explaining your recommendations",
      "Balancing people, money, time, and priorities",
    ];
    base.goodToKnow = [
      "It’s intentionally broad. You often specialize later with electives, internships, or a minor.",
      "You gain an understanding of how organizations work.",
      "Communication and teamwork matter as much as analysis.",
    ];
    base.careerExamples = [
      "Business operations or program support roles",
      "Project or coordinator roles",
      "Sales, customer, or team support roles",
      "Many paths depending on internships and interests",
    ];
    base.tryItInHS = [
      "Help run a club, team, or event and track outcomes",
      "Practice explaining a business idea clearly (pitch + plan)",
      "Join DECA/FBLA or a business club",
    ];

  // Management (people + organizing work; distinct from Business Administration)
  } else if (name === "management" || name.includes("management")) {
    base.whatItIs =
      "Management focuses on leading people and organizing work including planning, coordinating teams, and helping a group reach goals.";
    base.whatYouStudy = [
      "Leadership and teamwork",
      "Organizing work, schedules, and responsibilities",
      "Communication, motivation, and feedback",
      "Basics of operations and project management",
    ];
    base.whatProjectsFeelLike = [
      "Coordinating group work and dividing responsibilities",
      "Planning projects with timelines and tradeoffs",
      "Solving people or process problems",
      "Presenting decisions and responding to feedback",
    ];
    base.goodToKnow = [
      "Management focuses on leading people and coordinating work not just making decisions.",
      "Success often depends on communication, trust, and organization.",
      "A lot of management growth happens through real leadership experience, not just classes.",
      "Many people step into formal management after gaining experience in another area or role first.",
    ];
    base.careerExamples = [
      "Project or operations coordination roles",
      "Team lead / supervisor pathways (often later)",
      "People-focused business roles",
      "Consulting-related roles",
      "Foundations for leadership paths in many industries",
    ];
    base.tryItInHS = [
      "Lead a club, team, or group project and reflect on what worked",
      "Organize an event with roles + timeline (practice coordination)",
      "Practice giving clear feedback and instructions",
      "Pay attention to how organizations you’re part of make decisions",
      "Practice project management by tracking costs, time, and outcomes for a small project",
    ];

  // Finance
  } else if (name === "finance" || name.includes("finance")) {
    base.whatItIs =
      "Finance is about how money moves.  It involves budgeting, investing, and making decisions with numbers.";
    base.whatYouStudy = [
      "Budgeting and financial planning",
      "Understanding investments and risk",
      "Using spreadsheets and models",
      "How businesses make money decisions",
    ];
    base.whatProjectsFeelLike = [
      "Evaluating investment, budgeting, or financial decisions",
      "Working with spreadsheets, financial statements, or scenarios",
      "Making recommendations based on risk, return, and constraints",
      "Simulating real-world tradeoffs",
    ];
    base.goodToKnow = [
      "Finance is more applied and decision-oriented than Economics.",
      "Comfort with numbers and tools like spreadsheets helps a lot.",
      "Internships often shape which path you end up in.",
    ];
    base.careerExamples = [
      "Financial analyst",
      "Corporate finance roles",
      "Banking / investing pathways",
      "Insurance / risk roles",
    ];
    base.tryItInHS = [
      "Practice budgeting for a small project or event",
      "Learn basic spreadsheet skills and model simple scenarios",
      "Follow how a company or market decision affects outcomes over time",
    ];

  // Marketing
  } else if (name === "marketing" || name.includes("marketing")) {
    base.whatItIs =
      "Marketing is about connecting products or ideas with people and understanding audiences and communicating value.";
    base.whatYouStudy = [
      "Branding and messaging",
      "Social media and digital marketing basics",
      "Customer psychology and research",
      "Campaign planning and measurement",
    ];
    base.whatProjectsFeelLike = [
      "Designing campaigns or messages for a specific audience",
      "Testing ideas (content, ads, messaging) and seeing what works",
      "Analyzing basic data like engagement, clicks, or responses",
      "Balancing creativity with clear goals and constraints",
    ];
    base.goodToKnow = [
      "Marketing blends creativity with strategy and data.",
      "Ideas get tested in the real world so results matter.",
      "Many roles specialize over time (digital, brand, content, analytics).",
    ];
    base.careerExamples = [
      "Marketing coordinator",
      "Brand / content roles",
      "Digital marketing roles",
      "Sales-support and customer growth roles",
    ];
    base.tryItInHS = [
      "Promote a club/event and track what gets attention",
      "Create social posts or flyers and test different versions",
      "Notice why certain ads or brands catch your eye and others don’t",
    ];

  // Economics
  } else if (name === "economics" || name.includes("economics")) {
    base.whatItIs =
      "Economics is about how choices get made — by people, businesses, and governments; especially when resources are limited.";
    base.whatYouStudy = [
      "How markets work (supply and demand)",
      "Data and graphs to explain trends",
      "How incentives change behavior",
      "Big-picture economic issues",
    ];
    base.whatProjectsFeelLike = [
      "Analyzing data or trends to understand how systems behave",
      "Using models or evidence to explain what’s happening and why",
      "Writing or presenting arguments based on data and reasoning",
      "Comparing outcomes under different assumptions",
    ];
    base.goodToKnow = [
      "Economics focuses more on understanding systems than managing money directly.",
      "It often involves abstract thinking, data, and theory.",
      "Many students pair it with another major or applied skills.",
    ];
    base.careerExamples = [
      "Business / policy analysis roles",
      "Research assistant pathways",
      "Finance or consulting-adjacent paths",
      "Data/analytics roles",
    ];
    base.tryItInHS = [
      "Track a trend (prices, jobs, inflation) and explain why it’s changing",
      "Read an economics-related article and summarize the argument",
      "Run a simple survey and analyze the results",
    ];

  // Entrepreneurship
  } else if (name === "entrepreneurship" || name.includes("entrepreneur")) {
    base.whatItIs =
      "Entrepreneurship is about building something new such as turning an idea into a product, service, or project people actually use.";
    base.whatYouStudy = [
      "Testing ideas with real people",
      "Basic finance and planning",
      "Marketing and communication",
      "Building and improving a product/service",
    ];
    base.whatProjectsFeelLike = [
      "Turning an idea into something real and testing if it works",
      "Building simple plans, pitches, or prototypes",
      "Solving problems with limited time, money, or resources",
      "Learning from failure and adjusting quickly",
    ];
    base.goodToKnow = [
      "Entrepreneurship is about experimentation, not guaranteed success.",
      "Risk and uncertainty are part of the learning process.",
      "Many students pair entrepreneurship with another major or skill set.",
    ];
    base.careerExamples = [
      "Startup founder pathways",
      "Small business roles",
      "Product or project roles",
      "Innovation roles inside companies",
    ];
    base.tryItInHS = [
      "Try a small side project or fundraiser and track results",
      "Interview people about a problem they want solved",
      "Join entrepreneurship or business clubs",
    ];
  }
}


  // --- Communication / Media / Design ---
  if (clusterId === "comm") {
    base.whatItIs =
      "Communication and design majors are about sharing ideas clearly through writing, visuals, media, and storytelling.";
    base.whatYouStudy = [
      "Writing and messaging",
      "Design or media tools (varies by major)",
      "Audience and storytelling",
      "Projects + feedback + revision",
    ];
    base.whatProjectsFeelLike = [
      "Creating content (videos, graphics, writing, campaigns)",
      "Getting feedback and improving multiple versions",
    ];
    base.goodToKnow = [
      "A portfolio (examples of your work) can matter a lot.",
      "You’ll do a lot of creating, revising, and presenting.",
    ];
    base.careerExamples = [
      "Marketing / content roles",
      "Journalism / media roles",
      "Design roles",
      "PR / communications roles",
    ];
    base.tryItInHS = [
      "Run a small project: poster/video/story for a club",
      "Build a portfolio folder (even 6–10 pieces)",
      "Try school newspaper, yearbook, or media clubs",
    ];

    const name = majorName.toLowerCase();

    // Tailor Communication Studies (so it isn't generic)
    if (name.includes("communication studies")) {
      base.whatItIs =
        "Communication Studies is about how people share ideas through speaking, writing, media, and relationships and how messages influence what people think and do.";
      base.whatYouStudy = [
        "Public speaking and presentation",
        "Interpersonal communication and relationships",
        "Media, messaging, and persuasion basics",
        "Research and writing about communication",
      ];
      base.whatProjectsFeelLike = [
        "Presentations, discussions, and group projects",
        "Analyzing messages (ads, speeches, social media) and explaining what works",
        "Practicing how to communicate clearly and confidently",
      ];
      base.careerExamples = [
        "Communications coordinator roles",
        "Marketing or content support roles",
        "HR/people-facing roles (with interest)",
        "Community outreach or nonprofit roles",
      ];
      base.tryItInHS = [
        "Join debate, speech, Model UN, or a club where you present ideas",
        "Run social media or communications for a club or team",
        "Practice explaining something clearly and get feedback",
      ];
    } else if (name.includes("journal")) {
      base.whatItIs =
        "Journalism is about reporting and telling true stories including researching, interviewing, and writing clearly.";
      base.whatYouStudy = [
        "Interviewing and research",
        "Writing and editing",
        "Media ethics and fairness",
        "Story structure and clarity",
      ];
      base.careerExamples = [
        "Reporter / journalist",
        "Editor",
        "Content writer",
        "Media producer roles",
      ];
    } else if (name.includes("public relations") || name.includes("pr")) {
      base.whatItIs =
        "Public Relations is about how organizations communicate with the public including building trust, handling announcements, and responding to issues.";
      base.careerExamples = [
        "PR / communications coordinator",
        "Social / community roles",
        "Event communications",
        "Brand communications roles",
      ];
    } else if (name.includes("advert")) {
      base.whatItIs =
        "Advertising is about creating campaigns that get attention, mixing creativity with strategy.";
      base.careerExamples = [
        "Advertising account roles",
        "Creative / copy roles",
        "Media planning roles",
        "Brand campaign roles",
      ];
    } else if (name.includes("digital")) {
      base.whatItIs =
        "Digital Media focuses on creating and publishing content using modern tools such as video, social media, and digital storytelling.";
      base.careerExamples = [
        "Content creator / producer",
        "Social media roles",
        "Digital marketing roles",
        "Video / media production roles",
      ];
    }
  }

  // --- Arts (Sprint A tailored) ---
  if (clusterId === "arts") {
    base.whatItIs =
      "Arts majors focus on creative expression through performance or making art. You build skill through practice and feedback.";
    base.whatYouStudy = [
      "Technique and practice (lots of repetition)",
      "Creative projects and performance",
      "Feedback and critique",
      "Building a portfolio, reel, or body of work",
    ];
    base.whatProjectsFeelLike = [
      "Practice/rehearsal + performance or presentation",
      "Creating work and improving it over time",
    ];
    base.goodToKnow = [
      "Your work samples (portfolio/reel) matter.",
      "Consistency and practice are a big part of success.",
    ];
    base.careerExamples = [
      "Creative production and support roles",
      "Performance and event-related roles",
      "Design/media roles (depending on the path)",
      "Teaching or coaching arts (with additional training)",
    ];
    base.tryItInHS = [
      "Perform or create regularly (shows, concerts, portfolio pieces)",
      "Ask for feedback and revise",
      "Join school performances or arts clubs",
    ];

    const name = majorName.toLowerCase();

    // Tailor the top summary by major
    if (name.includes("visual")) {
      base.whatItIs =
        "Visual Arts is about creating visual work like drawing, painting, digital art, and building a portfolio of pieces over time.";
    } else if (name === "music") {
      base.whatItIs =
        "Music is about creating and performing sound whether playing, singing, composing, or learning how music works.";
    } else if (name.includes("theater") || name.includes("theatre")) {
      base.whatItIs =
        "Theater is about storytelling through performance; acting, directing, stagecraft, and collaborating on productions.";
    } else if (name.includes("dance")) {
      base.whatItIs =
        "Dance is about movement and performance including training your body, learning technique, and expressing ideas through motion.";
    } else if (name.includes("film")) {
      base.whatItIs =
        "Film Production is about telling stories with video including planning, shooting, editing, and creating a finished project.";
    } else if (name.includes("writing")) {
      base.whatItIs =
        "Creative Writing is about storytelling with words including building characters, scenes, and voice through practice and feedback.";
    }

    // Tailor study topics by major
    if (name.includes("visual")) {
      base.whatYouStudy = [
        "Drawing/visual foundations (shape, color, composition)",
        "Exploring different mediums and styles",
        "Critique and feedback (learning to revise)",
        "Portfolio building and presentation",
      ];
    } else if (name === "music") {
      base.whatYouStudy = [
        "Performance (instrument or voice)",
        "Music theory and ear training (intro to advanced)",
        "Ensemble work and collaboration",
        "Composition or production basics (varies)",
      ];
    } else if (name.includes("theater") || name.includes("theatre")) {
      base.whatYouStudy = [
        "Acting and character work",
        "Voice, movement, and stage presence",
        "Theater history and scripts",
        "Production roles (directing, stage management, design) (varies)",
      ];
    } else if (name.includes("dance")) {
      base.whatYouStudy = [
        "Technique and training (strength, flexibility, control)",
        "Choreography and performance",
        "Working in ensembles and rehearsals",
        "Injury prevention and body awareness",
      ];
    } else if (name.includes("film")) {
      base.whatYouStudy = [
        "Story structure and visual storytelling",
        "Camera, lighting, and sound basics",
        "Editing and post-production",
        "Production teamwork and planning",
      ];
    } else if (name.includes("writing")) {
      base.whatYouStudy = [
        "Writing craft (voice, style, structure)",
        "Workshopping and revision",
        "Reading like a writer (learning from examples)",
        "Building a portfolio of pieces",
      ];
    }

    // Tailor what projects can feel like (optional Sprint A)
    if (name.includes("visual")) {
      base.whatProjectsFeelLike = [
        "Creating pieces, getting critique, and revising",
        "Building a portfolio with different styles and mediums",
        "Working with deadlines but lots of creative choices",
      ];
    } else if (name === "music") {
      base.whatProjectsFeelLike = [
        "Regular practice + performances or recitals",
        "Rehearsing with others (ensemble, band, choir)",
        "Recording or composing projects (sometimes)",
      ];
    } else if (name.includes("theater") || name.includes("theatre")) {
      base.whatProjectsFeelLike = [
        "Auditions, rehearsals, and performance nights",
        "Collaborating with a cast/crew on a production",
        "Taking feedback and adjusting your performance",
      ];
    } else if (name.includes("dance")) {
      base.whatProjectsFeelLike = [
        "Technique training + choreography rehearsals",
        "Performing under pressure and refining details",
        "Working through repetition to improve",
      ];
    } else if (name.includes("film")) {
      base.whatProjectsFeelLike = [
        "Planning a shoot, filming, then editing",
        "Lots of teamwork and problem-solving on set",
        "Iterating edits until the story feels right",
      ];
    } else if (name.includes("writing")) {
      base.whatProjectsFeelLike = [
        "Writing drafts, sharing work, and revising",
        "Workshops where you give and receive feedback",
        "Building a set of pieces over time",
      ];
    }

    // Tailor career directions by major (role-shaped, exploratory)
    if (name.includes("visual")) {
      base.careerExamples = [
        "Visual artist or studio roles",
        "Creative production support roles",
        "Gallery, museum, or community arts roles",
        "Design-adjacent paths (with additional skills)",
      ];
    } else if (name === "music") {
      base.careerExamples = [
        "Performance and ensemble roles",
        "Music teaching or coaching (with training)",
        "Music production or audio-adjacent roles",
        "Event and community music roles",
      ];
    } else if (name.includes("theater") || name.includes("theatre")) {
      base.careerExamples = [
        "Performance and entertainment roles",
        "Stage management or production roles",
        "Arts education or coaching roles (with training)",
        "Event and live production roles",
      ];
    } else if (name.includes("dance")) {
      base.careerExamples = [
        "Performance and choreography roles",
        "Dance teaching or coaching (with training)",
        "Fitness/movement-adjacent roles",
        "Live event and production roles",
      ];
    } else if (name.includes("film")) {
      base.careerExamples = [
        "Video production and editing roles",
        "Content creation roles",
        "Production coordination roles",
        "Media roles across many industries",
      ];
    } else if (name.includes("writing")) {
      base.careerExamples = [
        "Writing and content roles",
        "Editing and publishing support roles",
        "Communications and storytelling roles",
        "Education or tutoring paths (with interest)",
      ];
    }

    // Tailor Try-it-in-HS by major
    if (name.includes("visual")) {
      base.tryItInHS = [
        "Build a small portfolio (8–12 pieces) in different styles",
        "Try a new medium (digital art, painting, sculpture)",
        "Ask a teacher/artist for critique and revise one piece",
      ];
    } else if (name === "music") {
      base.tryItInHS = [
        "Join band/choir or perform regularly",
        "Record yourself and notice what improves with practice",
        "Try composing or producing a simple track (optional)",
      ];
    } else if (name.includes("theater") || name.includes("theatre")) {
      base.tryItInHS = [
        "Audition for a school play or join a theater club",
        "Try a behind-the-scenes role (lights, stage crew, costumes)",
        "Practice short scenes and get feedback",
      ];
    } else if (name.includes("dance")) {
      base.tryItInHS = [
        "Take a class or follow a structured training plan",
        "Learn and perform a short routine, then refine it",
        "Explore choreography by creating a short piece",
      ];
    } else if (name.includes("film")) {
      base.tryItInHS = [
        "Make a 60–90 second video with a clear story",
        "Practice basic editing (cuts, sound, pacing)",
        "Join media/yearbook clubs or help film school events",
      ];
    } else if (name.includes("writing")) {
      base.tryItInHS = [
        "Write regularly (short stories, poems, scripts) and revise",
        "Join a writing club or submit to a school publication",
        "Try writing in a new genre and get feedback",
      ];
    }
  }

  // --- Health ---
  if (clusterId === "health") {
    base.whatItIs =
      "Health and human services majors focus on supporting people’s well-being often with real responsibility and structured environments.";
    base.whatYouStudy = [
      "Health and human development basics",
      "Communication and care",
      "Ethics, safety, and responsibility",
      "Hands-on practice (varies by major)",
    ];
    base.whatProjectsFeelLike = [
      "Learning how to respond in real situations",
      "Practice through labs, simulations, or placements",
    ];
    base.goodToKnow = [
      "People-centered work can be meaningful and emotionally demanding.",
      "Many paths require extra training/licensing.",
    ];
    base.careerExamples = [
      "Healthcare roles (clinical and non-clinical)",
      "Community / public health roles",
      "Human services and support roles",
    ];
    base.tryItInHS = [
      "Volunteer in community or health-related settings",
      "Take science/health classes that interest you",
      "Talk to someone in a helping profession",
    ];

    const name = majorName.toLowerCase();
    if (name.includes("public health")) {
      base.whatItIs =
        "Public Health focuses on keeping communities healthy through prevention, education, and health systems.";
      base.careerExamples = [
        "Community health roles",
        "Health education roles",
        "Program coordination",
        "Public health analyst pathways",
      ];
    } else if (name.includes("kines")) {
      base.whatItIs =
        "Kinesiology is about movement and performance; learning how the body moves, trains, and stays healthy.";
      base.careerExamples = [
        "Sports performance roles",
        "Fitness / coaching pathways",
        "Physical therapy-related paths (with more school)",
        "Wellness and health roles",
      ];
      base.tryItInHS = [
        "Track training and recovery and learn what works",
        "Explore anatomy basics",
        "Volunteer or assist in coaching settings",
      ];
    } else if (name.includes("social work")) {
      base.whatItIs =
        "Social Work is about supporting people through difficult situations and connecting them to resources and helping them navigate challenges.";
      base.careerExamples = [
        "Social worker (often requires licensing)",
        "Case management roles",
        "Community program roles",
        "School or youth support roles",
      ];
    }
  }

  // --- Education & Learning Sciences (Sprint D tailored) ---
  if (clusterId === "edu") {
    base.whatItIs =
      "Education majors focus on helping people learn through teaching, coaching, and supporting different learning needs.";
    base.whatYouStudy = [
      "How people learn (learning science basics)",
      "Planning lessons and activities",
      "Communication and classroom skills",
      "Practice teaching and reflection",
    ];
    base.whatProjectsFeelLike = [
      "Designing lessons and trying them",
      "Getting feedback and improving your approach",
      "Practicing communication and patience",
    ];
    base.goodToKnow = [
      "Many teaching paths have certification steps.",
      "Working with people can be meaningful and requires patience and energy.",
    ];
    base.careerExamples = [
      "Teaching and classroom support roles",
      "Tutoring and coaching roles",
      "Education program support roles",
      "Foundations for specialized education paths (with training)",
    ];
    base.tryItInHS = [
      "Tutor or mentor someone (even informally)",
      "Help coach, lead a club, or run a study group",
      "Try explaining a concept in more than one way and notice what works",
    ];
  
    const name = majorName.toLowerCase();
  
    // Tailor the top summary by major
    if (name.includes("elementary")) {
      base.whatItIs =
        "Elementary Education focuses on teaching younger students; building strong foundations in reading, math, and learning skills.";
    } else if (name.includes("secondary")) {
      base.whatItIs =
        "Secondary Education focuses on teaching middle and high school students; usually in a specific subject like math, English, science, or history.";
    } else if (name.includes("special")) {
      base.whatItIs =
        "Special Education focuses on supporting students with different learning needs and adapting instruction so more students can succeed.";
    } else if (name.includes("educational psychology") || name.includes("ed psych")) {
      base.whatItIs =
        "Educational Psychology explores how people learn and develop including how motivation, memory, and learning differences affect school.";
    } else if (name === "education") {
      base.whatItIs =
        "Education is a broad major about how learning works through teaching, training, and supporting learning in different settings.";
    }
  
    // Tailor study topics by major
    if (name.includes("elementary")) {
      base.whatYouStudy = [
        "Teaching reading, writing, and math foundations",
        "Child development and learning basics",
        "Lesson planning and classroom routines",
        "Student engagement and behavior support (intro level)",
      ];
    } else if (name.includes("secondary")) {
      base.whatYouStudy = [
        "A subject area you teach (math, science, English, etc.)",
        "Lesson planning and assessment",
        "Classroom communication and management",
        "Working with adolescents and motivation",
      ];
    } else if (name.includes("special")) {
      base.whatYouStudy = [
        "Learning differences and inclusive teaching",
        "Adapting lessons and supports",
        "Collaboration with families and support teams",
        "Goals, progress monitoring, and plans (intro level)",
      ];
    } else if (name.includes("educational psychology") || name.includes("ed psych")) {
      base.whatYouStudy = [
        "How learning and motivation work",
        "Memory, attention, and development",
        "Assessment and learning differences (intro level)",
        "Research methods in education",
      ];
    }
  
    // Tailor what projects can feel like (optional Sprint D)
    if (name.includes("elementary")) {
      base.whatProjectsFeelLike = [
        "Planning hands-on lessons and trying them",
        "Practicing explaining ideas simply",
        "Building routines and managing a classroom environment",
      ];
    } else if (name.includes("secondary")) {
      base.whatProjectsFeelLike = [
        "Designing lessons around a subject and assessing learning",
        "Leading discussions and managing a classroom",
        "Adapting lessons when students learn differently",
      ];
    } else if (name.includes("special")) {
      base.whatProjectsFeelLike = [
        "Adapting instruction and supports for different needs",
        "Working closely with a team and tracking progress",
        "Balancing patience, structure, and encouragement",
      ];
    } else if (name.includes("educational psychology") || name.includes("ed psych")) {
      base.whatProjectsFeelLike = [
        "Studying how people learn and applying it to real situations",
        "Analyzing case examples and research",
        "Designing small supports or interventions (conceptually)",
      ];
    }
  
    // Tailor career directions + Try-it-in-HS by major
    if (name.includes("elementary")) {
      base.careerExamples = [
        "Elementary teacher pathways (with certification)",
        "Youth program and tutoring roles",
        "School support roles",
        "Education-related roles in community programs",
      ];
      base.tryItInHS = [
        "Volunteer or assist with younger students (tutoring, camps, clubs)",
        "Practice explaining basic concepts simply",
        "Create a short lesson/activity and try it with someone you know",
      ];
    } else if (name.includes("secondary")) {
      base.careerExamples = [
        "Middle/high school teacher pathways (with certification)",
        "Coaching or academic support roles",
        "Education program support roles",
        "Subject-focused tutoring roles",
      ];
      base.tryItInHS = [
        "Tutor in a subject you enjoy",
        "Lead a study group and try different teaching approaches",
        "Volunteer with clubs/teams where you coach or explain skills",
      ];
    } else if (name.includes("special")) {
      base.careerExamples = [
        "Special education teacher pathways (with certification)",
        "Learning support or aide roles",
        "Behavior or support program roles",
        "Foundations for specialized training (varies)",
      ];
      base.tryItInHS = [
        "Volunteer in programs that support diverse learners (if available)",
        "Learn about learning differences and inclusive practices",
        "Practice patience + clear communication in mentoring roles",
      ];
    } else if (name.includes("educational psychology") || name.includes("ed psych")) {
      base.careerExamples = [
        "Education research or program support roles",
        "Academic advising/support roles (varies)",
        "Learning design or training-adjacent roles",
        "Foundations for school psychology or counseling (with further study)",
      ];
      base.tryItInHS = [
        "Notice what helps you learn best and test small study experiments",
        "Volunteer as a tutor and reflect on what strategies work",
        "Read about learning, motivation, or study habits and try one idea",
      ];
    }
  }


  // --- Environmental & Earth Sciences (Sprint B tailored) ---
  if (clusterId === "env") {
    base.whatItIs =
      "Environmental and earth majors explore the planet including ecosystems, climate, resources, and how people interact with natural systems.";
    base.whatYouStudy = [
      "Ecosystems and environmental change",
      "Earth systems (land, water, climate)",
      "Data and field/lab methods",
      "Sustainability solutions and tradeoffs",
    ];
    base.whatProjectsFeelLike = [
      "A mix of fieldwork (outside) and lab/data work (inside)",
      "Studying real issues and proposing solutions",
      "Connecting science to real-world decisions",
    ];
    base.goodToKnow = [
      "Many programs blend science with policy, communication, or planning.",
      "Some paths are field-heavy; others are more data and analysis-focused.",
    ];
    base.careerExamples = [
      "Environmental consulting/support roles",
      "Conservation and sustainability roles",
      "Field and lab technician pathways",
      "Policy and community program roles (with interest)",
    ];
    base.tryItInHS = [
      "Join an environmental club or community project",
      "Do a local investigation (water quality, biodiversity)",
      "Volunteer with conservation or park organizations",
    ];

    const name = majorName.toLowerCase();

    // Tailor the top summary by major
    if (name.includes("environmental studies")) {
      base.whatItIs =
        "Environmental Studies is a broad, flexible major that blends environment, society, and solutions — often mixing science with policy, communication, or community work.";
    } else if (name.includes("environmental science")) {
      base.whatItIs =
        "Environmental Science focuses on the science of the environment — using biology, chemistry, and data to understand environmental problems and test solutions.";
    } else if (name.includes("earth science")) {
      base.whatItIs =
        "Earth Science explores how the planet works — rocks, water, weather, climate, and the processes that shape Earth over time.";
    } else if (name.includes("geology")) {
      base.whatItIs =
        "Geology is about the Earth — rocks, landforms, and the forces that shape the planet over time.";
    } else if (name.includes("sustainability")) {
      base.whatItIs =
        "Sustainability Studies focuses on designing solutions that reduce environmental impact while balancing people, resources, systems, and long-term tradeoffs.";
    }

    // Tailor study topics by major
    if (name.includes("environmental studies")) {
      base.whatYouStudy = [
        "Environmental issues and how they affect communities",
        "Policy, ethics, and decision-making (varies by program)",
        "Sustainability and systems thinking",
        "Research and communication about real-world problems",
      ];
    } else if (name.includes("environmental science")) {
      base.whatYouStudy = [
        "Environmental biology and chemistry (intro to advanced)",
        "Data collection, sampling, and analysis",
        "Ecosystems, pollution, and environmental change",
        "Lab and field methods",
      ];
    } else if (name.includes("earth science")) {
      base.whatYouStudy = [
        "Weather, climate, oceans, and Earth systems",
        "Rocks, soils, and land processes",
        "Maps, data, and observation",
        "Field and lab investigations",
      ];
    } else if (name.includes("geology")) {
      base.whatYouStudy = [
        "Rocks, minerals, and Earth history",
        "Landforms and natural hazards (intro level)",
        "Field mapping and observation",
        "Lab work analyzing Earth materials",
      ];
    } else if (name.includes("sustainability")) {
      base.whatYouStudy = [
        "Sustainable systems (energy, food, water, cities)",
        "Environmental impact and tradeoffs",
        "Project planning and change-making",
        "Measuring progress with data (varies)",
      ];
    }

    // Tailor what projects can feel like (optional Sprint B)
    if (name.includes("environmental studies")) {
      base.whatProjectsFeelLike = [
        "Researching an issue and presenting solutions",
        "Projects that mix science with community or policy thinking",
        "Writing and discussion-heavy work alongside real examples",
      ];
    } else if (name.includes("environmental science")) {
      base.whatProjectsFeelLike = [
        "Collecting samples and analyzing results",
        "Field/lab projects where evidence matters",
        "Using data to explain what’s happening in an ecosystem",
      ];
    } else if (name.includes("earth science")) {
      base.whatProjectsFeelLike = [
        "Investigating Earth processes through labs or outdoor observations",
        "Using maps and data to explain patterns",
        "Building explanations from evidence",
      ];
    } else if (name.includes("geology")) {
      base.whatProjectsFeelLike = [
        "Field trips and hands-on observation",
        "Collecting samples and interpreting what they tell you",
        "Piecing together Earth’s history like a puzzle",
      ];
    } else if (name.includes("sustainability")) {
      base.whatProjectsFeelLike = [
        "Designing a plan to reduce impact (school, community, or organization)",
        "Working on team projects with real constraints",
        "Measuring outcomes and improving the plan over time",
      ];
    }

    // Tailor career directions by major (role-shaped, exploratory)
    if (name.includes("environmental studies")) {
      base.careerExamples = [
        "Sustainability program support roles",
        "Community/environmental education roles",
        "Policy or nonprofit support roles",
        "Environmental communications or outreach roles",
      ];
    } else if (name.includes("environmental science")) {
      base.careerExamples = [
        "Environmental lab or field technician roles",
        "Environmental compliance or monitoring roles",
        "Conservation science support roles",
        "Research assistant roles",
      ];
    } else if (name.includes("earth science")) {
      base.careerExamples = [
        "Environmental or fieldwork support roles",
        "Research or lab assistant roles",
        "Earth systems and climate-adjacent roles",
        "Education and outreach roles",
      ];
    } else if (name.includes("geology")) {
      base.careerExamples = [
        "Geology field roles",
        "Environmental fieldwork roles",
        "Energy/mining-related roles (varies)",
        "Research and lab roles",
      ];
    } else if (name.includes("sustainability")) {
      base.careerExamples = [
        "Sustainability coordinator or support roles",
        "Energy and resource programs roles",
        "Environmental planning support roles",
        "Operations and impact-measurement roles",
      ];
    }

    // Tailor Try-it-in-HS by major
    if (name.includes("environmental studies")) {
      base.tryItInHS = [
        "Pick a local environmental issue and research different solutions",
        "Volunteer with a community cleanup or conservation project",
        "Practice explaining an issue clearly (poster, short video, presentation)",
      ];
    } else if (name.includes("environmental science")) {
      base.tryItInHS = [
        "Do a water/soil/air quality mini-investigation (safe, school-approved)",
        "Learn basic data collection and graph your results",
        "Join a science or environmental club and take on a project role",
      ];
    } else if (name.includes("earth science")) {
      base.tryItInHS = [
        "Track weather patterns and explain what you notice",
        "Explore local landforms and research how they formed",
        "Try a simple mapping/data project using free online tools",
      ];
    } else if (name.includes("geology")) {
      base.tryItInHS = [
        "Collect and identify rocks (where allowed) and keep a simple field notebook",
        "Visit a natural history museum or geology site and ask ‘why here?’",
        "Learn about natural hazards in your area (earthquakes, floods, landslides)",
      ];
    } else if (name.includes("sustainability")) {
      base.tryItInHS = [
        "Do a small ‘impact audit’ (waste, energy, water) and propose improvements",
        "Join a sustainability project at school and track progress",
        "Research how a product is made and where its impact comes from",
      ];
    }
  }

  // --- Civic / Policy / Law (Sprint C tailored) ---
  if (clusterId === "civic") {
    base.whatItIs =
      "Civic and policy majors focus on how rules and public decisions affect communities covering fairness, law, government, and public systems.";
    base.whatYouStudy = [
      "Government and policy basics",
      "Law and fairness concepts (varies by major)",
      "Writing and argument",
      "Debate and multiple viewpoints",
    ];
    base.whatProjectsFeelLike = [
      "Reading real issues and weighing tradeoffs",
      "Writing, discussion, and building evidence-based arguments",
      "Comparing solutions and explaining your reasoning",
    ];
    base.goodToKnow = [
      "There are rarely simple answers — you weigh tradeoffs.",
      "Communication and critical thinking matter.",
    ];
    base.careerExamples = [
      "Policy and program support roles",
      "Government or nonprofit roles",
      "Legal-adjacent support roles",
      "Civic and community organization roles",
    ];
    base.tryItInHS = [
      "Join debate, mock trial, Model UN, or a civic club",
      "Follow a local issue and summarize different viewpoints",
      "Practice writing a short argument with evidence",
    ];

    const name = majorName.toLowerCase();

    // Tailor the top summary by major
    if (name.includes("public policy")) {
      base.whatItIs =
        "Public Policy is about solving public problems and figuring out what communities need and how programs and rules can help.";
    } else if (name.includes("legal")) {
      base.whatItIs =
        "Legal Studies is about how laws and rules work and how they shape decisions in everyday life and organizations.";
    } else if (name.includes("criminal")) {
      base.whatItIs =
        "Criminal Justice explores how laws are enforced and how legal systems work including policing, courts, and corrections.";
    } else if (name.includes("international")) {
      base.whatItIs =
        "International Relations looks at how countries interact balancing diplomacy, conflict, trade, and global issues.";
    } else if (name.includes("public administration")) {
      base.whatItIs =
        "Public Administration focuses on how government and public organizations run including planning, budgeting, and delivering services.";
    } else if (name.includes("political")) {
      base.whatItIs =
        "Political Science is about how governments and institutions make decisions and how power, policy, and systems shape life.";
    }

    // Tailor study topics by major
    if (name.includes("public policy")) {
      base.whatYouStudy = [
        "How public problems are defined and solved",
        "Policy design and evaluation (what works and why)",
        "Data and evidence for decisions",
        "Writing and communication for real audiences",
      ];
    } else if (name.includes("legal")) {
      base.whatYouStudy = [
        "Legal concepts and how rules are applied",
        "Ethics, rights, and responsibilities",
        "Reading and analyzing cases or examples",
        "Writing clearly and precisely",
      ];
    } else if (name.includes("criminal")) {
      base.whatYouStudy = [
        "Courts, policing, and corrections systems",
        "Law, procedure, and ethics",
        "Crime and society (what influences behavior)",
        "Writing and analysis of real cases",
      ];
    } else if (name.includes("international")) {
      base.whatYouStudy = [
        "Global issues and how countries cooperate or conflict",
        "International organizations and diplomacy",
        "Culture, history, and current events",
        "Research and writing about global problems",
      ];
    } else if (name.includes("public administration")) {
      base.whatYouStudy = [
        "How public organizations operate",
        "Budgeting, planning, and program management",
        "Policy implementation (how ideas become action)",
        "Communication and leadership in public systems",
      ];
    } else if (name.includes("political")) {
      base.whatYouStudy = [
        "Government systems and political behavior",
        "Public policy and civic institutions",
        "Power, rights, and decision-making",
        "Research and writing about real issues",
      ];
    }

    // Tailor what projects can feel like (optional Sprint C)
    if (name.includes("public policy")) {
      base.whatProjectsFeelLike = [
        "Studying a public problem and proposing solutions",
        "Comparing policies and explaining tradeoffs",
        "Using data and evidence to support your ideas",
      ];
    } else if (name.includes("legal")) {
      base.whatProjectsFeelLike = [
        "Reading cases or examples and explaining what’s fair",
        "Writing arguments with clear structure",
        "Debating interpretations and seeing multiple sides",
      ];
    } else if (name.includes("criminal")) {
      base.whatProjectsFeelLike = [
        "Analyzing real situations (courts, policing, community safety)",
        "Discussing ethics and tradeoffs",
        "Writing and research-heavy projects",
      ];
    } else if (name.includes("international")) {
      base.whatProjectsFeelLike = [
        "Following global issues and comparing perspectives",
        "Researching a country/region or a global problem",
        "Writing and discussion with multiple viewpoints",
      ];
    } else if (name.includes("public administration")) {
      base.whatProjectsFeelLike = [
        "Planning a program or service and thinking through logistics",
        "Balancing budgets, constraints, and outcomes",
        "Team projects that mimic real organizations",
      ];
    } else if (name.includes("political")) {
      base.whatProjectsFeelLike = [
        "Debate and discussion about real issues",
        "Researching how decisions get made",
        "Writing persuasive, evidence-based arguments",
      ];
    }

    // Tailor career directions by major (role-shaped, exploratory)
    if (name.includes("public policy")) {
      base.careerExamples = [
        "Policy or legislative assistant roles",
        "Program evaluation or research support roles",
        "Nonprofit or civic organization roles",
        "Public affairs or community program roles",
      ];
      base.tryItInHS = [
        "Pick a local issue and write a one-page policy idea",
        "Join student government or a civic club and track outcomes",
        "Practice summarizing a news story and identifying tradeoffs",
      ];
    } else if (name.includes("legal")) {
      base.careerExamples = [
        "Legal assistant or law office support roles (early-career)",
        "Compliance or policy support roles",
        "Contract/agreements-adjacent roles (varies)",
        "Foundations for law school or public policy study",
      ];
      base.tryItInHS = [
        "Join mock trial or debate and practice evidence-based arguments",
        "Read about a real case and summarize both sides",
        "Practice writing clearly and precisely (it matters in legal work)",
      ];
    } else if (name.includes("criminal")) {
      base.careerExamples = [
        "Public safety and justice system support roles",
        "Corrections/court system support roles",
        "Community program roles connected to safety",
        "Foundations for specialized training (varies by path)",
      ];
      base.tryItInHS = [
        "Explore how your local court or justice system works",
        "Volunteer with community programs that support youth or safety",
        "Discuss ethics and tradeoffs in real-world scenarios",
      ];
    } else if (name.includes("international")) {
      base.careerExamples = [
        "Global nonprofit or program support roles",
        "Research or policy assistant roles",
        "International business/government-adjacent roles",
        "Foundations for diplomacy or global studies (with further study)",
      ];
      base.tryItInHS = [
        "Follow a global issue and compare sources from different perspectives",
        "Join Model UN or a global studies club",
        "Learn a bit of another language/culture and reflect on what you notice",
      ];
    } else if (name.includes("public administration")) {
      base.careerExamples = [
        "Program coordination roles in government/nonprofits",
        "Operations and budgeting support roles",
        "Public service management pathways (later)",
        "Community organization roles",
      ];
      base.tryItInHS = [
        "Organize a small project (club event) and track what worked",
        "Learn basic budgeting for a group project",
        "Volunteer with a community organization and notice how it runs",
      ];
    } else if (name.includes("political")) {
      base.careerExamples = [
        "Policy, legislative, or government assistant roles",
        "Nonprofit, advocacy, or civic organization roles",
        "Program coordination or public affairs support roles",
        "Foundations for law, public administration, or policy study",
      ];
      base.tryItInHS = [
        "Follow a local issue and summarize the different viewpoints",
        "Join debate, mock trial, or student government if it interests you",
        "Practice writing a short argument with evidence (and a counterargument)",
      ];
    }
  }

  // --- Social Sciences (Tier 1 tailored) ---
  if (clusterId === "social") {
    base.whatItIs =
      "Social science majors focus on understanding people and society and how we think, behave, and organize communities.";
    base.whatYouStudy = [
      "Human behavior and social patterns",
      "Research methods (surveys, studies, interviews)",
      "Writing and explaining ideas",
      "Data and evidence (varies by major)",
    ];
    base.whatProjectsFeelLike = [
      "Reading and discussing different viewpoints",
      "Writing papers or projects that explain what you found",
    ];

    base.careerExamples = [
      "Research, policy, or data assistant roles",
      "Community outreach or program support roles",
      "Nonprofit, civic, or public service roles",
      "Foundations for graduate study or certifications (depending on the path)",
    ];

    base.tryItInHS = [
      "Run a small survey or interview project",
      "Join clubs focused on people/issues",
      "Read about society or behavior topics that interest you",
    ];

    const name = majorName.toLowerCase();

    // Tailor the top summary by major (so the first paragraph feels specific)
    if (name.includes("psych")) {
      base.whatItIs =
        "Psychology is about how people think, feel, and behave and how we can study those patterns.";
    } else if (name.includes("sociology")) {
      base.whatItIs =
        "Sociology is about groups and society and how communities work, how culture shapes behavior, and how social change happens.";
    } else if (name.includes("anthrop")) {
      base.whatItIs =
        "Anthropology explores people and culture and how humans live, adapt, and create meaning across different places and times.";
    } else if (name.includes("political")) {
      base.whatItIs =
        "Political Science is about how decisions are made in governments and institutions and how power, policy, and systems shape life.";
    } else if (name.includes("geograph")) {
      base.whatItIs =
        "Human Geography is about people and places and how location, cities, and environments affect how communities live and change.";
    }

    // Tailor study topics by major (so majors don’t feel interchangeable)
    if (name.includes("psych")) {
      base.whatYouStudy = [
        "How people think, feel, and behave (and why)",
        "Brain/behavior basics (intro level)",
        "Research methods and interpreting studies",
        "Development, learning, and mental health concepts",
      ];
    } else if (name.includes("sociology")) {
      base.whatYouStudy = [
        "How groups and institutions shape behavior",
        "Social change, inequality, and culture",
        "Surveys and research methods in society",
        "Reading, discussion, and writing arguments with evidence",
      ];
    } else if (name.includes("anthrop")) {
      base.whatYouStudy = [
        "Culture and how people live in different places",
        "Human history and how societies develop",
        "Fieldwork/observation methods (intro level)",
        "Comparing perspectives and interpreting evidence",
      ];
    } else if (name.includes("political")) {
      base.whatYouStudy = [
        "How governments and political systems work",
        "Public policy and decision-making",
        "Power, rights, and civic institutions",
        "Research and writing about real-world issues",
      ];
    } else if (name.includes("geograph")) {
      base.whatYouStudy = [
        "How people, places, and environments connect",
        "Maps, data, and spatial patterns (intro level)",
        "Cities, regions, and community design",
        "Research on real-world issues tied to place",
      ];
    }

    if (name.includes("psych")) {
      base.careerExamples = [
        "Behavioral health or support roles (with supervision)",
        "Research assistant or study coordinator roles",
        "Human services, youth support, or community roles",
        "Foundations for counseling, therapy, or graduate study",
      ];
      base.tryItInHS = [
        "Take a psychology or social science elective if available",
        "Try a simple observation or reflection project (sleep, habits, motivation)",
        "Read a short psychology article and write down questions you still have",
      ];
    } else if (name.includes("sociology")) {
      base.careerExamples = [
        "Community outreach or program coordinator roles",
        "Nonprofit or social services support roles",
        "Research, policy, or data assistant roles",
        "Foundations for public policy, social work, or advocacy paths",
      ];
      base.tryItInHS = [
        "Notice patterns in school/community life and write what you think causes them",
        "Volunteer with a community organization and reflect on what you observed",
        "Try a short survey project about something students care about",
      ];
    } else if (name.includes("anthrop")) {
      base.careerExamples = [
        "Research or field assistant roles",
        "Community development or cultural program roles",
        "User research or UX foundations (with applied skills)",
        "Education, museum, or nonprofit support roles",
      ];
      base.tryItInHS = [
        "Explore a culture/tradition topic and compare how different groups approach it",
        "Do a mini-interview project (with permission) about routines or traditions",
        "Visit a museum (in person or virtual) and reflect on what stories it tells",
      ];
    } else if (name.includes("political")) {
      base.careerExamples = [
        "Policy, legislative, or government assistant roles",
        "Nonprofit, advocacy, or civic organization roles",
        "Program coordination or public affairs support roles",
        "Foundations for law, public administration, or policy study",
      ];
      base.tryItInHS = [
        "Follow a local issue and summarize the different viewpoints",
        "Join debate, mock trial, or student government if it interests you",
        "Practice writing a short argument with evidence (and a counterargument)",
      ];
    } else if (name.includes("geograph")) {
      base.careerExamples = [
        "Urban planning or GIS-adjacent support roles (with tools)",
        "Environmental, transportation, or regional planning roles",
        "Policy research or data-mapping assistant roles",
        "Sustainability or community planning foundations",
      ];
      base.tryItInHS = [
        "Try a simple mapping project (safe routes, green spaces, transit, local patterns)",
        "Explore basic GIS or mapping tools online and make a small map",
        "Look at how a city/community is designed and note what works or doesn’t",
      ];
    }
  }

  // --- Skilled & Applied Technical ---
  if (clusterId === "skilled") {
    base.whatItIs =
      "Skilled and applied technical programs are hands-on. You learn practical skills to build, fix, install, or maintain real equipment and systems.";
    base.whatYouStudy = [
      "Hands-on skills (tools, equipment, safety)",
      "Step-by-step processes and precision",
      "Troubleshooting (find the problem, fix it)",
      "Work habits and professionalism",
    ];
    base.whatProjectsFeelLike = [
      "Learning by doing in labs/shops/kitchens",
      "Practicing skills until they become natural",
      "Seeing results quickly",
    ];
    base.goodToKnow = [
      "These paths are skill-based — practice matters.",
      "Many programs connect directly to apprenticeships or certifications.",
    ];
    base.careerExamples = [
      "Technician and specialist roles",
      "Apprenticeship and certification pathways",
      "Skilled roles across many industries",
    ];
    base.tryItInHS = [
      "Take hands-on electives (shop, culinary, auto) if available",
      "Try a weekend project with tools (safely)",
      "Job-shadow or talk with someone in a trade",
    ];

    const name = majorName.toLowerCase();
    if (name.includes("culinary")) {
      base.whatItIs =
        "Culinary Arts is about cooking skills, kitchen teamwork, and creating quality food consistently.";
      base.careerExamples = [
        "Cook / chef pathways",
        "Restaurant and kitchen management (later)",
        "Catering and food service roles",
        "Food entrepreneurship paths",
      ];
      base.tryItInHS = [
        "Cook at home and learn one skill at a time",
        "Help with events or catering-like projects",
        "Take culinary classes if offered",
      ];
    } else if (name.includes("hvac")) {
      base.whatItIs =
        "HVAC Technology focuses on heating, cooling, and ventilation systems including installing, maintaining, and troubleshooting.";
    } else if (name.includes("welding")) {
      base.whatItIs =
        "Welding Technology focuses on joining and shaping metal safely and precisely using specialized tools and techniques.";
    } else if (name.includes("manufacturing")) {
      base.whatItIs =
        "Manufacturing Technology focuses on how products are made using tools, machines, and processes to produce consistent results.";
    } else if (name.includes("electrical technology") || (name.includes("electrical") && name.includes("technology"))) {
      base.whatItIs =
        "Electrical Technology focuses on learning how electrical systems are installed, maintained, and repaired in real-world settings.";
    } else if (name.includes("mechanical technology") || (name.includes("mechanical") && name.includes("technology"))) {
      base.whatItIs =
        "Mechanical Technology focuses on learning how mechanical systems work and how to build, maintain, and repair machines and equipment.";
    } else if (name.includes("plumbing") || name.includes("pipefitting")) {
      base.whatItIs =
        "Plumbing / Pipefitting focuses on installing and maintaining piping systems that carry water, gas, or other materials through buildings and infrastructure.";
    } else if (name.includes("carpentry") || name.includes("building trades")) {
      base.whatItIs =
        "Carpentry / Building Trades focuses on constructing, repairing, and maintaining structures using hands-on building skills.";
    } else if (name.includes("automotive")) {
      base.whatItIs =
        "Automotive Technology is about diagnosing, fixing, and maintaining vehicles, using tools, systems knowledge, and troubleshooting.";
    }
  }

  return base;
}

function getMajorInfo(majorName, clusterId) {
  const found = majorCatalog[majorName];
  if (found) return found;
  return generateMajorInfo(majorName, clusterId);
}

// Canonical confusion pairs (cluster ids) (cluster ids)
const canonicalComparisons = [
  ["eng_tech", "skilled"],
  ["sci", "eng_tech"],
  ["biz", "comm"],
  ["arts", "comm"],
  ["health", "edu"],
  ["social", "civic"],
];

// Pass 2 modules (templated). We include detailed content for 3 we prototyped.
// For the rest, we provide solid teen-concrete content (not placeholders).
const pass2Modules = {
  design_better: {
    intro:
      "This area is about noticing how things feel for people — like spaces, apps, events, or products — and thinking about how to improve them.",
    activities: [
      "Noticing when an app, website, or game feels confusing to use",
      "Rearranging a space to make it feel better or work better",
      "Planning events so people have a good experience",
      "Improving something that works but feels awkward",
      "Getting annoyed when things are poorly designed",
    ],
    envStyle: {
      q: "If you were doing something like this, which setting sounds more appealing?",
      options: [
        { key: "team", label: "Working on a team, bouncing ideas around, improving things together" },
        { key: "solo", label: "Working on your own first, then sharing once ideas are formed" },
        { key: "mix", label: "A mix of both" },
      ],
    },
    motivations: [
      "Seeing people enjoy using something you improved",
      "Making something feel simpler or easier to use",
      "Solving a problem that was bothering people",
      "Having creative freedom",
      "Knowing your change actually helped someone",
      "I’m not sure yet",
    ],
    frustrations: [
      "Explaining your ideas to others",
      "Getting feedback and making changes",
      "Not having one right answer",
      "Paying attention to small details",
      "Working within limits (time, rules, budgets)",
      "None of these bother me much",
    ],
  },
  compete_train: {
    intro:
      "This area is about challenging yourself, training to improve, and performing under pressure. You don’t need to be a varsity athlete — just explore what parts feel like you.",
    activities: [
      "Training regularly to get better at something",
      "Competing against others or yourself",
      "Performing well under pressure (games, events)",
      "Pushing through discomfort to improve",
      "Being part of a team working toward a goal",
      "Tracking progress over time",
    ],
    envStyle: {
      q: "Which situation feels more appealing?",
      options: [
        { key: "clear", label: "Clear goals, rules, and feedback (you know how you’re doing)" },
        { key: "open", label: "Open-ended challenges where outcomes aren’t always clear" },
        { key: "mix", label: "A mix of both" },
      ],
    },
    motivations: [
      "Trying to beat a personal best",
      "Winning or performing better than others",
      "Being part of a team",
      "The structure and routine of training",
      "Feeling strong, capable, or disciplined",
      "I’m not sure yet",
    ],
    frustrations: [
      "Strict schedules or routines",
      "Repetitive training",
      "Physical discomfort or fatigue",
      "Losing or not performing well",
      "Pressure to perform in front of others",
      "None of these really bother me",
    ],
  },
  analyze_solve: {
    intro:
      "This area is about figuring things out — noticing patterns, solving puzzles, and breaking problems into parts. You don’t need to be a \"math person\" to explore it.",
    activities: [
      "Solving puzzles, logic problems, or brain teasers",
      "Figuring out why something isn’t working",
      "Looking for patterns in numbers or information",
      "Breaking a big problem into smaller steps",
      "Comparing options to decide what makes sense",
      "Enjoying questions with clear answers",
    ],
    envStyle: {
      q: "Which kind of problem sounds more appealing?",
      options: [
        { key: "rules", label: "Problems with clear rules and right answers" },
        { key: "messy", label: "Messy problems with lots of unknowns" },
        { key: "mix", label: "A mix of both" },
      ],
    },
    motivations: [
      "Reaching a clear solution",
      "Knowing your answer is correct",
      "Understanding how something works",
      "Making decisions based on logic",
      "Finding the most efficient way to do something",
      "I’m not sure yet",
    ],
    frustrations: [
      "Problems with no clear solution",
      "Explaining your thinking to others",
      "Working with incomplete or messy information",
      "Spending a long time on one problem",
      "Having your solution questioned",
      "None of these really bother me",
    ],
  },

  // Remaining modules (solid, concise)
  build_make: {
    intro:
      "This area is about making things — building, putting parts together, and enjoying the satisfaction of something working.",
    activities: [
      "Building a project and seeing it work",
      "Following steps to assemble something",
      "Improving a design after testing it",
      "Using tools (digital or physical) to make something real",
      "Fixing small issues until it works better",
    ],
    envStyle: {
      q: "Which sounds more fun?",
      options: [
        { key: "hands", label: "Hands-on building and testing" },
        { key: "plan", label: "Planning first, then building" },
        { key: "mix", label: "A mix of both" },
      ],
    },
    motivations: [
      "Seeing a finished result",
      "Making something useful",
      "Solving a practical challenge",
      "Working with tools or tech",
      "Learning by doing",
      "I’m not sure yet",
    ],
    frustrations: [
      "Things breaking and needing fixes",
      "Details and measurements",
      "Long projects",
      "Working with rules or safety steps",
      "Not having the right materials",
      "None of these bother me",
    ],
  },
  fix_hands: {
    intro:
      "This area is about hands-on skills — fixing, crafting, cooking, and learning practical ways to make things work.",
    activities: [
      "Fixing something that’s broken",
      "Learning how tools or machines work",
      "Practicing a skill to get better",
      "Following steps to get a clean result",
      "Making something with your hands (food, crafts, repairs)",
    ],
    envStyle: {
      q: "Which setting sounds better?",
      options: [
        { key: "shop", label: "Learning in a lab/shop/kitchen with hands-on practice" },
        { key: "class", label: "Learning mostly in a classroom with notes and tests" },
        { key: "mix", label: "A mix" },
      ],
    },
    motivations: [
      "Seeing results quickly",
      "Feeling skilled and capable",
      "Helping others by fixing real problems",
      "Working with tools or materials",
      "Making something that works",
      "I’m not sure yet",
    ],
    frustrations: [
      "Repetitive practice",
      "Messy work or cleanup",
      "Strict safety rules",
      "Very detailed steps",
      "Working slowly for precision",
      "None of these bother me",
    ],
  },
  create_express: {
    intro:
      "This area is about expressing ideas — through art, writing, music, video, or creative projects.",
    activities: [
      "Making art, writing, music, or videos",
      "Coming up with original ideas",
      "Telling stories or sharing a point of view",
      "Designing something that looks and feels right",
      "Experimenting with style or aesthetics",
    ],
    envStyle: {
      q: "Which feels more like you?",
      options: [
        { key: "freedom", label: "Lots of creative freedom and personal style" },
        { key: "brief", label: "A clear brief or prompt to design around" },
        { key: "mix", label: "A mix" },
      ],
    },
    motivations: [
      "Expressing yourself",
      "Making something beautiful or meaningful",
      "Getting a reaction from an audience",
      "Telling a story",
      "Trying new styles",
      "I’m not sure yet",
    ],
    frustrations: [
      "Creative blocks",
      "Feedback that changes your vision",
      "Deadlines",
      "Not knowing if it’s good",
      "Having to present your work",
      "None of these bother me",
    ],
  },
  perform_entertain: {
    intro:
      "This area is about performing — being on stage, entertaining, and expressing yourself live.",
    activities: [
      "Performing music, acting, dance, or speaking",
      "Rehearsing to improve",
      "Being part of a cast or ensemble",
      "Expressing emotion through performance",
      "Feeding off an audience’s energy",
    ],
    envStyle: {
      q: "Which environment sounds better?",
      options: [
        { key: "spotlight", label: "Being featured (more spotlight)" },
        { key: "group", label: "Being part of a group performance" },
        { key: "mix", label: "A mix" },
      ],
    },
    motivations: [
      "Being on stage",
      "Entertaining people",
      "Improving through practice",
      "Working with a group",
      "Expressing yourself",
      "I’m not sure yet",
    ],
    frustrations: [
      "Stage nerves",
      "Rehearsals and repetition",
      "Critiques",
      "Auditions",
      "Performing when you don’t feel ready",
      "None of these bother me",
    ],
  },
  help_support: {
    intro:
      "This area is about helping people — supporting others and making a positive difference.",
    activities: [
      "Listening and supporting someone",
      "Helping someone solve a problem",
      "Volunteering or serving your community",
      "Being the person others rely on",
      "Working in teams where people matter",
    ],
    envStyle: {
      q: "Which feels better?",
      options: [
        { key: "direct", label: "Helping people directly, one-on-one" },
        { key: "behind", label: "Helping behind the scenes (planning, organizing support)" },
        { key: "mix", label: "A mix" },
      ],
    },
    motivations: [
      "Making a difference",
      "Being needed and helpful",
      "Working with people",
      "Solving real problems",
      "Feeling connected to a mission",
      "I’m not sure yet",
    ],
    frustrations: [
      "Emotionally heavy situations",
      "People not taking advice",
      "Slow progress",
      "Conflict",
      "Lots of rules or paperwork",
      "None of these bother me",
    ],
  },
  teach_coach: {
    intro:
      "This area is about helping others learn — explaining, coaching, mentoring, and helping people improve.",
    activities: [
      "Explaining a concept in a simple way",
      "Helping someone practice and improve",
      "Planning learning activities",
      "Being patient with questions",
      "Giving feedback that helps",
    ],
    envStyle: {
      q: "Which feels better?",
      options: [
        { key: "kids", label: "Working with kids/teens" },
        { key: "peers", label: "Working with peers/adults" },
        { key: "mix", label: "A mix" },
      ],
    },
    motivations: [
      "Seeing someone improve",
      "Explaining things clearly",
      "Leading a group",
      "Building confidence in others",
      "Helping people reach goals",
      "I’m not sure yet",
    ],
    frustrations: [
      "Repeating yourself",
      "People not trying",
      "Managing attention or behavior",
      "Planning lessons",
      "Being responsible for others",
      "None of these bother me",
    ],
  },
  lead_sell: {
    intro:
      "This area is about helping ideas turn into action — getting people on board, organizing efforts, and moving things forward.",
    activities: [
      "Leading a group project or club activity",
      "Getting people excited about an idea or plan",
      "Organizing an event, fundraiser, or team effort",
      "Speaking up to influence a decision",
      "Taking initiative when something needs to happen",
    ],
    envStyle: {
      q: "Which role sounds more like you?",
      options: [
        { key: "front", label: "Being out front (presenting ideas, motivating people)" },
        { key: "ops", label: "Organizing behind the scenes (planning, coordinating)" },
        { key: "mix", label: "A mix of both" },
      ],
    },
    motivations: [
      "Seeing an idea actually happen",
      "Bringing people together",
      "Taking responsibility for outcomes",
      "Solving problems quickly",
      "Building something new",
      "I’m not sure yet",
    ],
    frustrations: [
      "People not following through",
      "Disagreements or pushback",
      "Having to speak up a lot",
      "Slow decision-making",
      "Messy group dynamics",
      "None of these bother me",
    ],
  },
  organize_track: {
    intro:
      "This area is about keeping things running smoothly — organizing details, following steps, and making sure nothing falls through the cracks.",
    activities: [
      "Making checklists and plans",
      "Keeping a group organized",
      "Following a process to get a clean result",
      "Noticing small mistakes and fixing them",
      "Keeping schedules and deadlines on track",
    ],
    envStyle: {
      q: "Which feels better?",
      options: [
        { key: "clear", label: "Clear steps and expectations" },
        { key: "flex", label: "Flexible plans and changing tasks" },
        { key: "mix", label: "A mix" },
      ],
    },
    motivations: [
      "Feeling organized",
      "Making things run smoothly",
      "Helping a team succeed",
      "Clear rules and steps",
      "Being reliable",
      "I’m not sure yet",
    ],
    frustrations: [
      "Disorganization",
      "Last-minute changes",
      "Unclear instructions",
      "People being late or unprepared",
      "Too much chaos",
      "None of these bother me",
    ],
  },
  outdoors_animals: {
    intro:
      "This area is about the outdoors, animals, and the environment — being in nature and learning how it works.",
    activities: [
      "Spending time outdoors",
      "Working with animals",
      "Learning about ecosystems and nature",
      "Helping protect the environment",
      "Doing hands-on outdoor projects",
    ],
    envStyle: {
      q: "Which sounds better?",
      options: [
        { key: "field", label: "Being outside / fieldwork" },
        { key: "lab", label: "Indoor labs / research" },
        { key: "mix", label: "A mix" },
      ],
    },
    motivations: [
      "Being outside",
      "Helping animals or nature",
      "Learning how nature works",
      "Solving environmental problems",
      "Hands-on projects",
      "I’m not sure yet",
    ],
    frustrations: [
      "Bad weather",
      "Long outdoor days",
      "Messy work",
      "Lots of rules or permits",
      "Not seeing results quickly",
      "None of these bother me",
    ],
  },
  explore_research: {
    intro:
      "This area is about curiosity — exploring new ideas, asking big questions, and learning how the world works.",
    activities: [
      "Researching a topic you’re curious about",
      "Asking why questions",
      "Reading and learning about new ideas",
      "Doing experiments or investigations",
      "Exploring big questions with no easy answer",
    ],
    envStyle: {
      q: "Which feels better?",
      options: [
        { key: "deep", label: "Going deep on one topic" },
        { key: "wide", label: "Exploring lots of topics" },
        { key: "mix", label: "A mix" },
      ],
    },
    motivations: [
      "Discovery",
      "Understanding how things work",
      "Asking big questions",
      "Learning for its own sake",
      "Finding evidence",
      "I’m not sure yet",
    ],
    frustrations: [
      "No clear answers",
      "Slow progress",
      "Lots of reading",
      "Too many details",
      "Having to prove everything",
      "None of these bother me",
    ],
  },
};

// Domain → base clusters mapping (non-prescriptive). Pass 2 answers may add nuance.
const domainBaseClusters = {
  build_make: ["eng_tech", "skilled"],
  fix_hands: ["skilled"],
  analyze_solve: ["eng_tech", "cs_data", "sci", "biz"],
  create_express: ["comm", "arts"],
  perform_entertain: ["arts"],
  help_support: ["health", "social"],
  teach_coach: ["edu", "health"],
  lead_sell: ["biz", "comm", "civic"],
  organize_track: ["biz", "skilled", "civic"],
  compete_train: ["health", "edu", "biz"],
  outdoors_animals: ["env", "sci"],
  explore_research: ["sci", "social", "env"],
  design_better: ["comm", "eng_tech", "cs_data"],
};

// Pass 2 nuance rules (simple, transparent)
function applyPass2Nuance(domainId, pass2, clusterSet) {
  const style = pass2?.style;
  const motivations = pass2?.motivations || [];

  // Helper matchers (label-based, lightweight)
  const hasMot = (frag) => motivations.some((m) => (m || "").toLowerCase().includes(frag));

  // 1) Build & Make
  if (domainId === "build_make") {
    if (style === "plan") clusterSet.add("eng_tech");
    if (style === "hands") clusterSet.add("skilled");
    if (hasMot("tools") || hasMot("tech")) clusterSet.add("eng_tech");
  }

  // 2) Fix / Hands-on
  if (domainId === "fix_hands") {
    if (style === "mix" || style === "shop") clusterSet.add("eng_tech");
    if (
    hasMot("help people") ||
    hasMot("help others") ||
    hasMot("helping people")
  ) {
    clusterSet.add("health");
  }
  }

  // 3) Analyze & Solve
  if (domainId === "analyze_solve") {
    if (style === "messy") {
      clusterSet.add("sci");
      clusterSet.add("social");
    }
    if (style === "rules") {
      clusterSet.add("cs_data");
      clusterSet.add("biz");
    }
    if (hasMot("efficient")) clusterSet.add("eng_tech");
  }

  // 4) Create & Express
  if (domainId === "create_express") {
    if (style === "freedom") clusterSet.add("arts");
    if (style === "brief") clusterSet.add("comm");
    if (hasMot("story") || hasMot("telling")) clusterSet.add("comm");
  }

  // 5) Perform & Entertain
  if (domainId === "perform_entertain") {
    if (style === "spotlight") clusterSet.add("comm");
    if (style === "group") clusterSet.add("arts");
  }

  // 6) Help & Support
  if (domainId === "help_support") {
    if (style === "direct") clusterSet.add("health");
    if (style === "behind") clusterSet.add("social");
    if (hasMot("mission") || hasMot("difference")) clusterSet.add("civic");
  }

  // 7) Teach & Coach
  if (domainId === "teach_coach") {
    if (style === "kids") clusterSet.add("edu");
    if (style === "peers") clusterSet.add("biz");
    if (style === "mix") {
      clusterSet.add("edu");
      clusterSet.add("health");
    }
  }

  // 8) Lead & Sell
  if (domainId === "lead_sell") {
    if (style === "front") clusterSet.add("comm");
    if (style === "ops") clusterSet.add("biz");
    if (hasMot("new") || hasMot("build")) clusterSet.add("biz");
  }

  // 9) Organize & Track
  if (domainId === "organize_track") {
    if (style === "clear") clusterSet.add("civic");
    if (style === "flex") clusterSet.add("biz");
    if (hasMot("reliable") || hasMot("run smoothly")) clusterSet.add("skilled");
  }

  // 10) Compete & Train
  if (domainId === "compete_train") {
    if (style === "clear") clusterSet.add("edu");
    if (hasMot("routine") || hasMot("disciplin")) clusterSet.add("health");
  }

  // 11) Outdoors & Animals
  if (domainId === "outdoors_animals") {
    if (style === "lab") clusterSet.add("sci");
    if (style === "field") clusterSet.add("env");
    if (hasMot("environment") || hasMot("nature")) clusterSet.add("civic");
  }

  // 12) Explore & Research
  if (domainId === "explore_research") {
    if (style === "deep") clusterSet.add("sci");
    if (style === "wide") clusterSet.add("social");
    if (hasMot("evidence") || hasMot("prove")) clusterSet.add("sci");
  }

  // 13) Design & Improve
  if (domainId === "design_better") {
    if (hasMot("simpler") || hasMot("easier")) clusterSet.add("cs_data");
    if (hasMot("creative")) clusterSet.add("comm");
    if (style === "team") clusterSet.add("comm");
    if (style === "solo") clusterSet.add("cs_data");
  }

  return clusterSet;
}

// -----------------------------
// Step C: data → explanation mapping
// -----------------------------

// Meta shape per cluster:
// {
//   supportCount: number,            // # of selected domains that map to this cluster (base mapping)
//   reinforced: boolean,             // true if pass2 nuance added or strong pass1 signal supported it
//   reasons: string[]                // human-readable "why" bullets
// }

function computeClusterSurfacing({ pass1Answers, selectedDomains, pass2Answers }) {
  const selected = Array.from(selectedDomains || []);

  const meta = {}; // clusterId → meta
  const ensure = (cid) => {
    if (!meta[cid]) meta[cid] = { supportCount: 0, reinforced: false, reasons: [] };
    return meta[cid];
  };

  const addReason = (cid, text) => {
    const m = ensure(cid);
    if (!m.reasons.includes(text)) m.reasons.push(text);
  };

  const surfaced = new Set();

  // A) Base mapping from selected domains → clusters
  for (const domainId of selected) {
    const baseClusters = domainBaseClusters[domainId] || [];
    const domainMeta = domains.find((d) => d.id === domainId);
    const score = pass1Answers?.[domainId];

    for (const cid of baseClusters) {
      surfaced.add(cid);
      const m = ensure(cid);
      m.supportCount += 1;

      // Domain-based reason (uses the teen-facing title)
      const title = domainMeta?.title || domainId;
      const strength = score === 3 ? "strongly resonated" : score === 2 ? "somewhat resonated" : "";
      addReason(
        cid,
        `Because you chose to explore “${title}”${strength ? ` (it ${strength} in the quick check-in)` : ""}.`
      );

      // Reinforce when the pass1 signal was strong
      if (score === 3) m.reinforced = true;
    }
  }

  // B) Pass 2 nuance mapping → clusters, with explicit reasons
  for (const domainId of selected) {
    const p2 = pass2Answers?.[domainId];
    if (!p2) continue;

    const before = new Set(surfaced);
    const afterRaw = applyPass2Nuance(domainId, p2, new Set(surfaced));
    const after = afterRaw instanceof Set ? afterRaw : new Set(afterRaw || []);


    // Identify what was newly added by nuance
    for (const cid of after) {
      surfaced.add(cid);
      ensure(cid);
    }

    const domainTitle = domains.find((d) => d.id === domainId)?.title || domainId;

    for (const cid of after) {
      if (!before.has(cid)) {
        meta[cid].reinforced = true;

        // Style-based explanation (radio choice)
        if (p2?.style) {
          const styleLabel = (pass2Modules?.[domainId]?.envStyle?.options || []).find(
            (o) => o.key === p2.style
          )?.label;
          if (styleLabel) {
            addReason(cid, `Your “${domainTitle}” answers leaned toward: ${styleLabel}.`);
          }
        }

        // Motivation-based explanation (up to 2)
        if (Array.isArray(p2?.motivations) && p2.motivations.length > 0) {
          const mot = p2.motivations.slice(0, 2).join("; ");
          addReason(cid, `What felt rewarding in “${domainTitle}”: ${mot}.`);
        }
      }
    }

    // Frustration/reflect can still reinforce (even if it didn’t add a new cluster)
    // If a student says "I want to explore this more" we mark reinforcement for clusters already supported by this domain.
    if (p2?.reflect === "I want to explore this more.") {
      const baseClusters = domainBaseClusters[domainId] || [];
      for (const cid of baseClusters) {
        const m = ensure(cid);
        m.reinforced = true;
        addReason(cid, `You said “${domainTitle}” is something you want to explore more.`);
      }
    }
  }

  // Stable ordering (matches the clusters array order)
  const order = Array.isArray(clusters)
  ? clusters.map((c) => c.id)
  : Object.keys(meta);

  const surfacedList = order.filter((cid) => surfaced.has(cid));


  return { surfaced: surfacedList, meta };
}


// Comparison selection logic
function selectComparisons(surfacedClusters, lastClusterId) {
  const set = new Set(surfacedClusters);
  const eligible = [];

  // Trigger A: dual-surfaced canonical pairs where both clusters are present
  for (const [a, b] of canonicalComparisons) {
    if (set.has(a) && set.has(b)) eligible.push({ a, b, reason: "both" });
  }

  // Trigger B: if none, offer optional canonical pair with last cluster
  if (eligible.length === 0 && lastClusterId) {
    for (const [a, b] of canonicalComparisons) {
      if (a === lastClusterId && !set.has(b)) eligible.push({ a, b, reason: "confusion" });
      if (b === lastClusterId && !set.has(a)) eligible.push({ a: b, b: a, reason: "confusion" });
    }
  }

  // Cap at 2, prefer 1
  return eligible.slice(0, 2);
}

// -----------------------------
// UI helpers
// -----------------------------

function Shell({ children, onRestart, onOpenSaved, savedCount }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-md px-4 py-4 md:max-w-2xl">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-600">HS Major Exploration · Prototype</div>
          {onRestart ? (
            <div className="flex items-center gap-2">
              {onOpenSaved ? (
                <button
                  type="button"
                  onClick={onOpenSaved}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Saved{typeof savedCount === "number" ? ` (${savedCount})` : ""}
                </button>
              ) : null}
              <button
                type="button"
                onClick={onRestart}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
              >
                Restart
              </button>
            </div>
          ) : null}
        </div>
        <div className="py-2">{children}</div>
      </div>
    </div>
  );
}

function Title({ title, subtitle }) {
  return (
    <div className="mb-4">
      <div className="text-2xl font-semibold tracking-tight">{title}</div>
      {subtitle ? <div className="mt-1 text-sm text-slate-600">{subtitle}</div> : null}
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
      {children}
    </span>
  );
}

function Stepper({ value, max }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>Progress</span>
        <span>{pct}%</span>
      </div>
      <Progress value={pct} className="mt-2" />
    </div>
  );
}

function OptionRow({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-left hover:bg-slate-50"
    >
      <Checkbox checked={checked} onCheckedChange={() => {}} className="mt-0.5" />
      <div className="text-sm leading-5">{label}</div>
    </button>
  );
}

function ChipButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-3 py-1 text-sm " +
        (active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50")
      }
    >
      {children}
    </button>
  );
}

// -----------------------------
// Screens
// -----------------------------

function Welcome({ onStart, onRestart, onOpenSaved, savedCount }) {
  return (
    <Shell onRestart={onRestart} onOpenSaved={onOpenSaved} savedCount={savedCount}>
      <Title
        title="Let’s Explore What You Enjoy Doing"
        subtitle="No right or wrong answers. This is not about what you’re “good at” — just what feels like you right now."
      />
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="text-sm text-slate-700 leading-6">
            You’ll answer a few quick statements about what you enjoy.
            <br />
            Then you can choose <span className="font-medium">2–4 areas</span> to explore more deeply.
            <br />
            <br />
            <span className="font-medium">It’s normal</span> for more than one area to stand out.
          </div>
          <div className="mt-4">
            <Button className="w-full rounded-xl" onClick={onStart}>
              Start
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 text-xs text-slate-500">
        Prototype v0 · Mobile-first (desktop friendly)
      </div>
    </Shell>
  );
}

function Pass1({ answers, setAnswer, index, setIndex, onFinish, onRestart, onOpenSaved, savedCount }) {
  const d = domains[index];
  const total = domains.length;

  return (
    <Shell onRestart={onRestart} onOpenSaved={onOpenSaved} savedCount={savedCount}>
      <Stepper value={index + 1} max={total} />
      <Title title="Quick Check-In" subtitle="How much does this sound like you right now?" />

      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="mb-2">
            <Pill>
              {index + 1} / {total}
            </Pill>
          </div>
          <div className="text-lg font-semibold leading-snug">{d.title}</div>
          <div className="mt-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
            “{d.prompt}”
          </div>

          <div className="mt-4 grid gap-2">
            {PASS1_SCALE.map((opt) => {
              const selected = answers[d.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAnswer(d.id, opt.value)}
                  className={
                    "w-full rounded-xl border px-3 py-3 text-left text-sm " +
                    (selected
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50")
                  }
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="w-1/2 rounded-xl"
              onClick={() => setIndex(Math.max(0, index - 1))}
              disabled={index === 0}
            >
              Back
            </Button>
            <Button
              className="w-1/2 rounded-xl"
              onClick={() => {
                if (index === total - 1) onFinish();
                else setIndex(index + 1);
              }}
              disabled={answers[d.id] === undefined}
            >
              {index === total - 1 ? "Finish" : "Next"}
            </Button>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Don’t overthink it — your first reaction is usually best.
          </div>
        </CardContent>
      </Card>
    </Shell>
  );
}

function Pass1Results({ answers, selected, setSelected, onContinue, onRestart, onOpenSaved, savedCount }) {

  const strong = domains.filter((d) => answers[d.id] === 3);
  const some = domains.filter((d) => answers[d.id] === 2);

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedCount = selected.size;

  return (
    <Shell onRestart={onRestart} onOpenSaved={onOpenSaved} savedCount={savedCount}>
      <Title
        title="A Few Areas That Stood Out"
        subtitle="It’s normal for more than one area to resonate. Choose 2–4 to explore more deeply right now."
      />

      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-700">
              Selected: <span className="font-semibold">{selectedCount}</span> / 4
            </div>
            <Badge variant={selectedCount >= 2 && selectedCount <= 4 ? "default" : "secondary"}>
              {selectedCount >= 2 && selectedCount <= 4 ? "Ready" : "Pick 2–4"}
            </Badge>
          </div>

          <Separator className="my-4" />

          <div className="text-sm font-semibold">Strongly resonated</div>
          <div className="mt-2 grid gap-2">
            {strong.length === 0 ? (
              <div className="text-sm text-slate-600">
                No worries — that’s common. Check the “Somewhat” section below.
              </div>
            ) : (
              strong.map((d) => (
                <OptionRow
                  key={d.id}
                  checked={selected.has(d.id)}
                  onChange={() => toggle(d.id)}
                  label={d.title}
                />
              ))
            )}
          </div>

          <div className="mt-5 text-sm font-semibold">Somewhat resonated</div>
          <div className="mt-2 grid gap-2">
            {some.length === 0 ? (
              <div className="text-sm text-slate-600">
                That’s okay too — you can pick from any area below.
              </div>
            ) : (
              some.map((d) => (
                <OptionRow
                  key={d.id}
                  checked={selected.has(d.id)}
                  onChange={() => toggle(d.id)}
                  label={d.title}
                />
              ))
            )}
          </div>

          <div className="mt-5">
            <details className="rounded-xl border border-slate-200 bg-white px-3 py-3">
              <summary className="cursor-pointer text-sm font-semibold">See all areas</summary>
              <div className="mt-3 grid gap-2">
                {domains.map((d) => (
                  <OptionRow
                    key={d.id}
                    checked={selected.has(d.id)}
                    onChange={() => toggle(d.id)}
                    label={d.title}
                  />
                ))}
              </div>
            </details>
          </div>

          <div className="mt-4">
            <Button
              className="w-full rounded-xl"
              onClick={onContinue}
              disabled={selectedCount < 2 || selectedCount > 4}
            >
              Continue to deeper exploration
            </Button>
            <div className="mt-2 text-xs text-slate-500">
              You can explore more later — this is just what you want to focus on right now.
            </div>
          </div>
        </CardContent>
      </Card>
    </Shell>
  );
}

function Pass2Module({ domainId, value, setValue, onNext, onBack, stepIndex, stepTotal, onRestart, onOpenSaved, savedCount }) {
  const meta = domains.find((d) => d.id === domainId);
  const mod = pass2Modules[domainId];
  const v = value || { activities: [], style: null, motivations: [], frustrations: null, reflect: null };

  const toggleActivity = (label) => {
    const set = new Set(v.activities);
    set.has(label) ? set.delete(label) : set.add(label);
    setValue({ ...v, activities: Array.from(set) });
  };

  const toggleMotivation = (label) => {
    const set = new Set(v.motivations);
    if (set.has(label)) set.delete(label);
    else {
      if (set.size >= 2) return;
      set.add(label);
    }
    setValue({ ...v, motivations: Array.from(set) });
  };

  const ready = v.activities.length > 0 && v.style && v.motivations.length > 0 && v.frustrations && v.reflect;

  return (
    <Shell onRestart={onRestart} onOpenSaved={onOpenSaved} savedCount={savedCount}>
      <Stepper value={stepIndex + 1} max={stepTotal} />
      <Title
        title={meta.title}
        subtitle="Explore what parts feel interesting — no pressure to decide anything."
      />

      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-800">{mod.intro}</div>

          <div className="mt-4">
            <div className="text-sm font-semibold">1) Which of these sound interesting?</div>
            <div className="mt-2 grid gap-2">
              {mod.activities.map((a) => (
                <OptionRow
                  key={a}
                  checked={v.activities.includes(a)}
                  onChange={() => toggleActivity(a)}
                  label={a}
                />
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="text-sm font-semibold">2) {mod.envStyle.q}</div>
            <div className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-3">
              <RadioGroup
                value={v.style || ""}
                onValueChange={(val) => setValue({ ...v, style: val })}
                className="grid gap-3"
              >
                {mod.envStyle.options.map((o) => (
                  <div key={o.key} className="flex items-start gap-2">
                    <RadioGroupItem value={o.key} id={`${domainId}-style-${o.key}`} className="mt-1" />
                    <Label htmlFor={`${domainId}-style-${o.key}`} className="text-sm leading-5">
                      {o.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <div className="text-sm font-semibold">3) What would feel most rewarding?</div>
              <div className="text-xs text-slate-500">Choose up to 2</div>
            </div>
            <div className="mt-2 grid gap-2">
              {mod.motivations.map((m) => (
                <OptionRow
                  key={m}
                  checked={v.motivations.includes(m)}
                  onChange={() => toggleMotivation(m)}
                  label={m}
                />
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="text-sm font-semibold">4) Which would be most frustrating?</div>
            <div className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-3">
              <RadioGroup
                value={v.frustrations || ""}
                onValueChange={(val) => setValue({ ...v, frustrations: val })}
                className="grid gap-3"
              >
                {mod.frustrations.map((f, idx) => (
                  <div key={f} className="flex items-start gap-2">
                    <RadioGroupItem value={f} id={`${domainId}-fr-${idx}`} className="mt-1" />
                    <Label htmlFor={`${domainId}-fr-${idx}`} className="text-sm leading-5">
                      {f}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-sm font-semibold">5) Which feels closest right now?</div>
            <div className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-3">
              <RadioGroup
                value={v.reflect || ""}
                onValueChange={(val) => setValue({ ...v, reflect: val })}
                className="grid gap-3"
              >
                {[
                  "I want to explore this more.",
                  "Parts of this are interesting, but I’m unsure.",
                  "I don’t think this is for me.",
                  "I’m still figuring it out.",
                ].map((r, idx) => (
                  <div key={r} className="flex items-start gap-2">
                    <RadioGroupItem value={r} id={`${domainId}-rf-${idx}`} className="mt-1" />
                    <Label htmlFor={`${domainId}-rf-${idx}`} className="text-sm leading-5">
                      {r}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <Button variant="outline" className="w-1/2 rounded-xl" onClick={onBack}>
              Back
            </Button>
            <Button className="w-1/2 rounded-xl" onClick={onNext} disabled={!ready}>
              Next
            </Button>
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Tip: It’s okay to be unsure. Exploring helps you learn what you like.
          </div>
        </CardContent>
      </Card>
    </Shell>
  );
}

function ClustersSummary({
  surfaced = [],
  meta = {},
  onExploreCluster,
  comparisons = [],
  onOpenComparison,
  onComparePicker,
  onRestart,
  onOpenSaved,
  savedCount,
}) {
  const [showWhy, setShowWhy] = useState(false);

  // SAFETY: ensure arrays/objects are the right shape
  const safeSurfaced = Array.isArray(surfaced) ? surfaced : [];
  const safeMeta = meta || {};
  const safeComparisons = Array.isArray(comparisons) ? comparisons : [];

  // Canonical order index based on `clusters` array order
  const canonicalIndex = useMemo(() => {
    const m = new Map();
    clusters.forEach((c, i) => m.set(c.id, i));
    return m;
  }, []);

  // Fast lookup by id
  const clustersById = useMemo(() => {
    const m = new Map();
    clusters.forEach((c) => m.set(c.id, c));
    return m;
  }, []);

  // Keep surfaced ids that exist in clusters, then sort in canonical cluster order
  const surfacedCanonical = useMemo(() => {
    return safeSurfaced
      .filter((id) => canonicalIndex.has(id))
      .sort((a, b) => (canonicalIndex.get(a) ?? 1e9) - (canonicalIndex.get(b) ?? 1e9));
  }, [safeSurfaced, canonicalIndex]);

  // Grouping logic (transparent):
  // Group 1 if supportCount>=2 OR (supportCount>=1 AND reinforced)
  // Cap Group 1 to 4, preserving canonical cluster order.
  const group1Ids = useMemo(() => {
    const eligible = surfacedCanonical.filter((cid) => {
      const m = safeMeta?.[cid];
      if (!m) return false;
      return m.supportCount >= 2 || (m.supportCount >= 1 && m.reinforced);
    });
    return eligible.slice(0, 4);
  }, [surfacedCanonical, safeMeta]);

  const group2Ids = useMemo(() => {
    const g1 = new Set(group1Ids);
    return surfacedCanonical.filter((cid) => !g1.has(cid));
  }, [surfacedCanonical, group1Ids]);

  // Map ids -> cluster objects (safe)
  const group1 = useMemo(
    () => group1Ids.map((id) => clustersById.get(id)).filter(Boolean),
    [group1Ids, clustersById]
  );
  const group2 = useMemo(
    () => group2Ids.map((id) => clustersById.get(id)).filter(Boolean),
    [group2Ids, clustersById]
  );

  return (
    <Shell onRestart={onRestart} onOpenSaved={onOpenSaved} savedCount={savedCount}>
      <Title
        title="Where Your Interests Often Show Up"
        subtitle="These aren’t recommendations — just areas students often explore based on similar preferences."
      />

      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="text-sm font-semibold">Start exploring here</div>
          <div className="mt-1 text-xs text-slate-500">
            These areas had the strongest overlap with what you said you enjoy and how you like to work.
          </div>

          <div className="mt-3 grid gap-3">
            {group1.length === 0 ? (
              <div className="text-sm text-slate-600">No worries — you can start anywhere below.</div>
            ) : (
              group1.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onExploreCluster?.(c.id)}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-left hover:bg-slate-50"
                >
                  <div className="text-base font-semibold">{c.title}</div>
                  <div className="mt-1 text-sm text-slate-700 leading-5">{c.about}</div>
                  <div className="mt-2 text-xs text-slate-500">Tap to explore</div>
                </button>
              ))
            )}
          </div>

          <div className="mt-6 text-sm font-semibold">Explore these if you’re curious</div>
          <div className="mt-1 text-xs text-slate-500">
            These also connect to your interests. If you’re curious, they can be worth a look — especially if you want to explore something new.
          </div>

          <div className="mt-3 grid gap-3">
            {group2.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onExploreCluster?.(c.id)}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-left hover:bg-slate-50"
              >
                <div className="text-base font-semibold">{c.title}</div>
                <div className="mt-1 text-sm text-slate-700 leading-5">{c.about}</div>
                <div className="mt-2 text-xs text-slate-500">Tap to explore</div>
              </button>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="mt-2">
            <button
              type="button"
              onClick={() => setShowWhy((s) => !s)}
              className="text-sm font-semibold text-slate-700 underline"
            >
              Why did these areas show up?
            </button>

            {showWhy ? (
              <div className="mt-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 leading-6">
                <p className="mb-2">
                  These areas showed up based on{" "}
                  <span className="font-medium">patterns in what you said you enjoy</span> — especially in the deeper
                  questions you just answered.
                </p>
                <ul className="list-disc pl-5">
                  <li>
                    <span className="font-medium">First</span>, we started with the domains you chose to explore more
                    deeply.
                  </li>
                  <li>
                    <span className="font-medium">Then</span>, your answers helped clarify <em>how</em> you like to work
                    — for example: hands-on vs. planning, clear rules vs. messy problems, or working with people vs.
                    working independently.
                  </li>
                  <li>
                    The areas below are broad academic fields where students with similar preferences often explore
                    majors. It’s not a recommendation or a ranking.
                  </li>
                </ul>
                <p className="mt-2">
                  If something surprises you, that’s okay. The goal is to give you{" "}
                  <span className="font-medium">good places to explore next</span>, not to lock you into anything.
                </p>

                {/* OPTIONAL (safe): if you later decide to show per-cluster reasons, this is where they’d live.
                    Example shape: meta[cid].reasons = ["Picked 'analyze & solve'", "Prefers structured problems", ...]
                    Keeping UI unchanged for now. */}
              </div>
            ) : null}
          </div>

          {safeComparisons.length > 0 ? (
            <div className="mt-4">
              <div className="text-sm font-semibold">Want to compare two areas?</div>
              <div className="mt-2 grid gap-2">
                {safeComparisons.map((p, idx) => {
                  const a = clustersById.get(p.a);
                  const b = clustersById.get(p.b);
                  const label = `${a?.title ?? p.a} vs ${b?.title ?? p.b}`;
                  const hint = p.reason === "both" ? "Both surfaced for you" : "Common comparison";
                  return (
                    <button
                      key={`${p.a}-${p.b}-${idx}`}
                      type="button"
                      onClick={() => onOpenComparison?.(p.a, p.b)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-left hover:bg-slate-50"
                    >
                      <div className="text-sm font-semibold">{label}</div>
                      <div className="text-xs text-slate-500">{hint}</div>
                    </button>
                  );
                })}
              </div>
              <Button variant="outline" className="mt-3 w-full rounded-xl" onClick={onComparePicker}>
                Compare a different pair
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              <div className="text-sm font-semibold">Want to compare two areas?</div>
              <Button variant="outline" className="mt-2 w-full rounded-xl" onClick={onComparePicker}>
                Compare areas
              </Button>
            </div>
          )}

          <div className="mt-4 text-xs text-slate-500">
            Your interests can change — and that’s okay. This is about exploration, not deciding.
          </div>
        </CardContent>
      </Card>
    </Shell>
  );
}



function ComparisonView({ aId, bId, onExploreA, onExploreB, onBack, onRestart, onOpenSaved, savedCount }) {
  const a = clusters.find((c) => c.id === aId);
  const b = clusters.find((c) => c.id === bId);
  if (!a || !b) return null;

  return (
    <Shell onRestart={onRestart} onOpenSaved={onOpenSaved} savedCount={savedCount}>
      <Title
        title="Comparing Two Areas"
        subtitle="Comparison is about how studying can feel — not which one is better."
      />

      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="text-sm text-slate-600">Exploring the difference between:</div>
          <div className="mt-1 text-lg font-semibold leading-snug">
            {a.title} <span className="text-slate-400">vs</span> {b.title}
          </div>

          <Separator className="my-4" />

          <div className="grid gap-4 md:grid-cols-2">
            {[a, b].map((c) => (
              <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-base font-semibold">{c.title}</div>
                <div className="mt-2 text-sm font-semibold">What it often feels like</div>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 leading-6">
                  {c.learningFeels.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <div className="mt-3 text-sm font-semibold">What students often work on</div>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 leading-6">
                  {c.workOn.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="text-sm font-semibold">Want a concrete example next?</div>
          <div className="mt-2 grid gap-2">
            <Button className="w-full rounded-xl" onClick={onExploreA}>
              Explore {a.title}
            </Button>
            <Button className="w-full rounded-xl" variant="outline" onClick={onExploreB}>
              Explore {b.title}
            </Button>
          </div>

          <Button className="mt-3 w-full rounded-xl" variant="ghost" onClick={onBack}>
            Back
          </Button>
        </CardContent>
      </Card>
    </Shell>
  );
}

function ExploreCluster({ clusterId, onBack, onCompareFromHere, onExploreMajor, onRestart, onOpenSaved, savedCount, isSavedCluster, toggleSaveCluster }) {
  const c = clusters.find((x) => x.id === clusterId);
  const [showMore, setShowMore] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(null);
  if (!c) return null;
  const saved = isSavedCluster ? isSavedCluster(clusterId) : false;

  return (
    <Shell onRestart={onRestart} onOpenSaved={onOpenSaved} savedCount={savedCount}>
      <Title title={c.title} subtitle="This is context to help you explore — not a decision." />

      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm text-slate-700 leading-6 flex-1">{c.about}</div>
            {toggleSaveCluster ? (
              <button
                type="button"
                onClick={() => toggleSaveCluster(clusterId)}
                className={
                  "shrink-0 rounded-full border px-3 py-1 text-xs " +
                  (saved
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")
                }
              >
                {saved ? "Saved" : "Save"}
              </button>
            ) : null}
          </div>

          <Separator className="my-4" />

          <div className="text-sm font-semibold">What students often work on</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 leading-6">
            {c.workOn.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>

          <div className="mt-4 text-sm font-semibold">What learning often feels like</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 leading-6">
            {c.learningFeels.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>

          <Separator className="my-4" />
          <div className="text-sm font-semibold">Example majors students explore</div>
          <div className="mt-2 grid gap-2">
            {(showMore ? c.majors : c.majors.slice(0, 5)).map((m) => {
              const active = selectedMajor === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMajor((prev) => (prev === m ? null : m))}
                  className={
                    "rounded-xl border px-3 py-2 text-sm text-left " +
                    (active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50")
                  }
                >
                  {m}
                </button>
              );
            })}
          </div>

          {c.majors.length > 5 ? (
            <Button
              variant="outline"
              className="mt-3 w-full rounded-xl"
              onClick={() => setShowMore((s) => !s)}
            >
              {showMore
                ? "Show fewer examples"
                : `See more examples (${Math.min(5, c.majors.length)} of ${c.majors.length})`}
            </Button>
          ) : null}

          <Button
            className="mt-3 w-full rounded-xl"
            onClick={() => onExploreMajor(selectedMajor)}
            disabled={!selectedMajor}
          >
            Explore this major
          </Button>
          <div className="mt-2 text-xs text-slate-500">You can explore multiple majors — this isn’t a decision.</div>

          <div className="mt-4 grid gap-2">
            <Button className="w-full rounded-xl" variant="outline" onClick={onCompareFromHere}>
              Compare this with another area
            </Button>
            <Button className="w-full rounded-xl" variant="ghost" onClick={onBack}>
              Back
            </Button>
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Liking something is a reason to explore it — not proof you need to be good at it yet.
          </div>
        </CardContent>
      </Card>
    </Shell>
  );
}

function ComparePicker({ surfaced, onPick, onBack, onRestart, onOpenSaved, savedCount }) {
  const surfacedSet = new Set(surfaced);

  // Build suggested (canonical) pairs, surfaced-first
  const suggested = canonicalComparisons
    .map(([a, b]) => ({ a, b }))
    .filter(({ a, b }) => a && b)
    .sort((p1, p2) => {
      const s1 = (surfacedSet.has(p1.a) ? 1 : 0) + (surfacedSet.has(p1.b) ? 1 : 0);
      const s2 = (surfacedSet.has(p2.a) ? 1 : 0) + (surfacedSet.has(p2.b) ? 1 : 0);
      return s2 - s1;
    })
    .slice(0, 6);

  // Custom picker flow state
  const [mode, setMode] = useState("home"); // home | pickA | pickB
  const [showAll, setShowAll] = useState(false);
  const [first, setFirst] = useState(null);

  const orderedClusters = useMemo(() => {
    const surfacedFirst = clusters.filter((c) => surfacedSet.has(c.id));
    const rest = clusters.filter((c) => !surfacedSet.has(c.id));
    return [...surfacedFirst, ...rest];
  }, [surfaced]);

  const listForPick = useMemo(() => {
    if (showAll) return orderedClusters;
    // Default view: surfaced only; if none, show all
    const surfacedOnly = orderedClusters.filter((c) => surfacedSet.has(c.id));
    return surfacedOnly.length ? surfacedOnly : orderedClusters;
  }, [showAll, orderedClusters, surfaced]);

  const headerSubtitle =
    "See how different areas can feel — there’s no ‘better,’ just different.";

  // HOME: suggested + entry to custom
  if (mode === "home") {
    return (
      <Shell onRestart={onRestart} onOpenSaved={onOpenSaved} savedCount={savedCount}>
        <Title title="Compare Areas" subtitle={headerSubtitle} />
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="text-sm font-semibold">Common comparisons students explore</div>
            <div className="mt-2 grid gap-2">
              {suggested.map((p, idx) => {
                const a = clusters.find((c) => c.id === p.a);
                const b = clusters.find((c) => c.id === p.b);
                if (!a || !b) return null;
                const both = surfacedSet.has(p.a) && surfacedSet.has(p.b);
                const hint = both ? "Both surfaced for you" : "Common comparison";
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onPick(p.a, p.b)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-left hover:bg-slate-50"
                  >
                    <div className="text-sm font-semibold">
                      {a.title} vs {b.title}
                    </div>
                    <div className="text-xs text-slate-500">{hint}</div>
                  </button>
                );
              })}
              {suggested.length === 0 ? (
                <div className="text-sm text-slate-600">No suggested comparisons yet.</div>
              ) : null}
            </div>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <div className="text-xs text-slate-500">or</div>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="text-sm font-semibold">Compare two areas you’re curious about</div>
            <div className="mt-1 text-xs text-slate-500">
              You can compare any two areas. This is just for exploration.
            </div>
            <Button
              className="mt-3 w-full rounded-xl"
              variant="outline"
              onClick={() => {
                setFirst(null);
                setShowAll(false);
                setMode("pickA");
              }}
            >
              Choose your own comparison
            </Button>

            <Button className="mt-3 w-full rounded-xl" variant="ghost" onClick={onBack}>
              Back
            </Button>
          </CardContent>
        </Card>
      </Shell>
    );
  }

  // PICK A
  if (mode === "pickA") {
    return (
      <Shell onRestart={onRestart} onOpenSaved={onOpenSaved} savedCount={savedCount}>
        <Title title="Pick the first area" subtitle="Start with the one you’re most curious about." />
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="text-sm font-semibold">Areas</div>
            <div className="mt-2 grid gap-2">
              {listForPick.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setFirst(c.id);
                    setMode("pickB");
                    setShowAll(false);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-left hover:bg-slate-50"
                >
                  <div className="text-sm font-semibold">{c.title}</div>
                  {surfacedSet.has(c.id) ? (
                    <div className="text-xs text-slate-500">Surfaced for you</div>
                  ) : (
                    <div className="text-xs text-slate-500">Explore to learn more</div>
                  )}
                </button>
              ))}
            </div>

            <Button
              className="mt-3 w-full rounded-xl"
              variant="outline"
              onClick={() => setShowAll((s) => !s)}
            >
              {showAll ? "Show surfaced areas" : "See all areas"}
            </Button>

            <Button
              className="mt-3 w-full rounded-xl"
              variant="ghost"
              onClick={() => {
                setFirst(null);
                setMode("home");
              }}
            >
              Back
            </Button>
          </CardContent>
        </Card>
      </Shell>
    );
  }

  // PICK B
  const firstCluster = clusters.find((c) => c.id === first);
  const secondList = listForPick.filter((c) => c.id !== first);

  return (
    <Shell onRestart={onRestart} onOpenSaved={onOpenSaved} savedCount={savedCount}>
      <Title title="Pick the second area" subtitle="Choose something you want to compare it with." />
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="mb-3 text-xs text-slate-600">
            Selected: <span className="font-semibold">{firstCluster?.title || "First area"}</span>
          </div>

          <div className="text-sm font-semibold">Choose the second area</div>
          <div className="mt-2 grid gap-2">
            {secondList.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onPick(first, c.id)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-left hover:bg-slate-50"
              >
                <div className="text-sm font-semibold">{c.title}</div>
                {surfacedSet.has(c.id) ? (
                  <div className="text-xs text-slate-500">Surfaced for you</div>
                ) : (
                  <div className="text-xs text-slate-500">Explore to learn more</div>
                )}
              </button>
            ))}
          </div>

          <Button
            className="mt-3 w-full rounded-xl"
            variant="outline"
            onClick={() => setShowAll((s) => !s)}
          >
            {showAll ? "Show surfaced areas" : "See all areas"}
          </Button>

          <Button
            className="mt-3 w-full rounded-xl"
            variant="ghost"
            onClick={() => setMode("pickA")}
          >
            Back
          </Button>
        </CardContent>
      </Card>
    </Shell>
  );
}
// --- HS Career Abstracts (pilot) ---
const CAREER_ABSTRACTS = {
  "Elementary teacher pathways (with certification)": {
    title: "Teacher (K–12)",
    sections: [
      {
        h: "What is this career?",
        p: "Teachers help students learn skills and ideas—planning lessons, leading class, giving feedback, and supporting different learning needs."
      },
      {
        h: "What do people actually do?",
        bullets: [
          "Plan lessons and activities for different learners",
          "Teach, guide discussions, and check understanding",
          "Create assignments and give feedback",
          "Manage a classroom environment",
          "Communicate with families and support staff"
        ]
      },
      {
        h: "Why it can be interesting",
        bullets: [
          "You shape how students grow and think",
          "Every day is different because people are different",
          "You can teach many subjects and age levels"
        ]
      },
      {
        h: "Reality preview (what can be hard)",
        bullets: [
          "Classroom management can be challenging",
          "Work doesn’t always end when school ends",
          "You’ll adapt for many learning styles and needs"
        ]
      },
      {
        h: "What students study / learn",
        bullets: [
          "Teaching strategies and child development",
          "How to explain ideas clearly",
          "Planning, organization, and patience",
          "Working with diverse learners"
        ]
      },
      {
        h: "Related clusters / majors",
        bullets: [
          "Education",
          "Child Development",
          "Psychology (adjacent)",
          "Subject area major (math, English, science, etc.)"
        ]
      },
      {
        h: "Other careers like this",
        bullets: [
          "School Counselor (adjacent)",
          "Special Education Teacher",
          "Instructional Coach",
          "Tutor / Academic Coach",
          "Youth Program Leader"
        ]
      }
    ]
  },
  "Physical therapy-related paths (with more school)": {
    title: "Physical Therapist",
    sections: [
      {
        h: "What is this career?",
        p: "Physical therapists help people recover movement and reduce pain after injuries, surgeries, or health conditions."
      },
      {
        h: "What do people actually do?",
        bullets: [
          "Evaluate how a patient moves and where pain comes from",
          "Create a step-by-step recovery plan",
          "Teach exercises and correct form",
          "Track progress and adjust the plan",
          "Coach patients to stay consistent at home"
        ]
      },
      {
        h: "Why it can be interesting",
        bullets: [
          "You get to see people improve over time",
          "It’s hands-on and problem-solving heavy",
          "Strong relationships with patients"
        ]
      },
      {
        h: "Reality preview (what can be hard)",
        bullets: [
          "Progress can be slow—patients may get discouraged",
          "You’ll repeat similar exercises often",
          "It can be physically demanding for you too"
        ]
      },
      {
        h: "What students study / learn",
        bullets: [
          "Anatomy and movement science",
          "Patient communication and motivation",
          "Care planning and documentation",
          "How to work with medical teams and insurance rules"
        ]
      },
      {
        h: "Related clusters / majors",
        bullets: [
          "Health & Medicine",
          "Kinesiology / Exercise Science",
          "Biology (adjacent)",
          "Psychology (adjacent)"
        ]
      },
      {
        h: "Other careers like this",
        bullets: [
          "Occupational Therapist",
          "Athletic Trainer",
          "Physical Therapist Assistant",
          "Chiropractor (different path)",
          "Sports Performance Coach (adjacent)"
        ]
      }
    ]
  }, 
  "UI/UX designer (with more focus on experience)": {
    title: "UX/UI Designer",
    sections: [
      {
        h: "What is this career?",
        p: "UX/UI designers shape how apps and websites work and look so they’re easy to use, clear, and (usually) enjoyable."
      },
      {
        h: "What do people actually do?",
        bullets: [
          "Learn what users need (interviews, surveys, observation)",
          "Sketch flows (what happens first, next, last)",
          "Design screens and components (buttons, menus, layouts)",
          "Test designs with users and fix confusing parts",
          "Work closely with engineers and product teams"
        ]
      },
      {
        h: "Why it can be interesting",
        bullets: [
          "You improve real experiences people use every day",
          "It mixes creativity + logic + empathy",
          "You can specialize (mobile apps, games, accessibility, etc.)"
        ]
      },
      {
        h: "Reality preview (what can be hard)",
        bullets: [
          "You’ll balance user needs with business goals",
          "Lots of iteration; your first idea is rarely the final",
          "You may need to explain decisions to many stakeholders"
        ]
      },
      {
        h: "What students study / learn",
        bullets: [
          "Design thinking + basic research skills",
          "Wireframes, prototypes, and usability testing",
          "Tools like Figma (most common), plus others",
          "Clear writing and communication (UX is not just visuals)"
        ]
      },
      {
        h: "Related clusters / majors",
        bullets: [
          "Arts & Design",
          "Computer Science (human-centered track)",
          "Psychology (human behavior)",
          "Communication / Media"
        ]
      },
      {
        h: "Other careers like this",
        bullets: [
          "Product Designer",
          "UX Researcher",
          "Interaction Designer",
          "Front-End Developer (adjacent)",
          "Content Designer"
        ]
      }
    ]
  },
  "Startup founder pathways": {
    title: "Entrepreneur / Small Business Owner",
    sections: [
      {
        h: "What is this career?",
        p: "Entrepreneurs start and run a business—finding a problem to solve, building a product or service, and figuring out how to make it work in the real world."
      },
      {
        h: "What do people actually do?",
        bullets: [
          "Come up with an idea and test if people actually want it",
          "Create a simple first version (a prototype or pilot)",
          "Market, sell, and talk to customers constantly",
          "Handle money basics (pricing, costs, budgeting)",
          "Do lots of “random tasks” until you can hire help"
        ]
      },
      {
        h: "Why it can be interesting",
        bullets: [
          "You get to build something that’s yours",
          "You learn fast because you do many roles",
          "You can turn a passion into a real plan (sometimes)"
        ]
      },
      {
        h: "Reality preview (what can be hard)",
        bullets: [
          "Income can be unstable, especially early",
          "You’ll face rejection and uncertainty a lot",
          "You may work long hours and wear many hats"
        ]
      },
      {
        h: "What students study / learn",
        bullets: [
          "Basic business: marketing, finance, and operations",
          "Sales and communication (huge for founders)",
          "How to test ideas quickly and learn from feedback",
          "Resilience and time management"
        ]
      },
      {
        h: "Related clusters / majors",
        bullets: [
          "Business",
          "Marketing",
          "Computer Science (startup path)",
          "Design (product/brand path)"
        ]
      },
      {
        h: "Other careers like this",
        bullets: [
          "Product Manager (adjacent)",
          "Sales Representative (adjacent)",
          "Social Media Manager (adjacent)",
          "Freelancer / Contractor",
          "Operations Manager (later-stage)"
        ]
      }
    ]
  },
  "Software developer": {
    title: "Software Developer",
    sections: [
      {
        h: "What is this career?",
        p: "Software developers build apps, websites, and systems by writing code—turning ideas into working technology."
      },
      {
        h: "What do people actually do?",
        bullets: [
          "Break a problem into steps and plan a solution",
          "Write and test code (then fix bugs)",
          "Work with teammates using tools like Git (version control)",
          "Review other people’s code and learn from feedback",
          "Keep improving a product after it launches"
        ]
      },
      {
        h: "Why it can be interesting",
        bullets: [
          "You get to build things from nothing (and see them work)",
          "There are many paths: apps, games, AI, cybersecurity, etc.",
          "It rewards persistence and problem-solving"
        ]
      },
      {
        h: "Reality preview (what can be hard)",
        bullets: [
          "Debugging can be frustrating and time-consuming",
          "Tech changes fast—learning never really stops",
          "You’ll spend lots of time reading and thinking, not just typing"
        ]
      },
      {
        h: "What students study / learn",
        bullets: [
          "Programming basics + data structures",
          "How to design systems (how parts work together)",
          "Team workflows (tickets, code reviews, documentation)",
          "Projects/portfolio (proof you can build)"
        ]
      },
      {
        h: "Related clusters / majors",
        bullets: [
          "Computer Science",
          "Software Engineering",
          "Information Technology",
          "Math (adjacent)"
        ]
      },
      {
        h: "Other careers like this",
        bullets: [
          "Web Developer",
          "Mobile App Developer",
          "Game Developer",
          "DevOps / Cloud Engineer",
          "Data Engineer (adjacent)"
        ]
      }
    ]
  },
  "Data analyst": {
    title: "Data Analyst",
    sections: [
      {
        h: "What is this career?",
        p: "Data analysts use data to answer questions—helping teams make smarter decisions in business, health, sports, education, and more."
      },
      {
        h: "What do people actually do?",
        bullets: [
          "Pull data from spreadsheets or databases",
          "Clean it up (fix missing values, messy labels, duplicates)",
          "Find patterns and trends (what changed and why)",
          "Build charts/dashboards to explain results",
          "Present insights in a way non-data people can use"
        ]
      },
      {
        h: "Why it can be interesting",
        bullets: [
          "You get to solve “mysteries” with evidence",
          "Your work can influence real decisions",
          "It’s useful in almost every industry"
        ]
      },
      {
        h: "Reality preview (what can be hard)",
        bullets: [
          "A lot of time goes into cleaning data (not the fun part)",
          "People may ask unclear questions—you’ll need to clarify",
          "You have to be careful: bad assumptions = bad conclusions"
        ]
      },
      {
        h: "What students study / learn",
        bullets: [
          "Statistics basics and data literacy",
          "Excel/Sheets + SQL (common) and sometimes Python",
          "Data visualization and storytelling",
          "How to ask good questions and define metrics"
        ]
      },
      {
        h: "Related clusters / majors",
        bullets: [
          "Data Science / Analytics",
          "Business",
          "Economics",
          "Math / Statistics"
        ]
      },
      {
        h: "Other careers like this",
        bullets: [
          "Business Analyst",
          "Marketing Analyst",
          "Operations Analyst",
          "Data Scientist (more advanced)",
          "Research Assistant"
        ]
      }
    ]
  },
  "Graphic designer": {
    title: "Graphic Designer",
    sections: [
      {
        h: "What is this career?",
        p: "Graphic designers create visuals that communicate ideas such as logos, posters, social media graphics, packaging, websites, and more."
      },
      {
        h: "What do people actually do?",
        bullets: [
          "Turn messy ideas into clear visuals (sketch → draft → final)",
          "Choose fonts, colors, layout, and imagery to match a goal",
          "Make versions for different sizes (phone, web, print)",
          "Get feedback and revise (sometimes a lot)",
          "Organize files and hand off assets correctly"
        ]
      },
      {
        h: "Why it can be interesting",
        bullets: [
          "You get to make things that real people see and use",
          "You combine creativity with problem-solving",
          "Many paths: branding, marketing, product design, motion, etc."
        ]
      },
      {
        h: "Reality preview (what can be hard)",
        bullets: [
          "Feedback cycles can be intense and subjective",
          "Deadlines + last-minute edits happen",
          "You may design for a client’s taste, not yours"
        ]
      },
      {
        h: "What students study / learn",
        bullets: [
          "Design basics: typography, layout, color, composition",
          "Tools: Adobe, Figma, Canva (varies by level)",
          "Communication: presenting and explaining your choices",
          "Portfolio-building (often the #1 hiring factor)"
        ]
      },
      {
        h: "Related clusters / majors",
        bullets: [
          "Arts & Design",
          "Communication / Media",
          "Marketing (creative track)",
          "UX / Product Design (adjacent path)"
        ]
      },
      {
        h: "Other careers like this",
        bullets: [
          "UX/UI Designer",
          "Brand Designer",
          "Motion Graphics Designer",
          "Content Designer",
          "Illustrator"
        ]
      }
    ]
  }
};


function MajorDetail({ majorName, clusterId, clusterTitle, onBack, onRestart, onExploreSchools, onOpenSaved, savedCount, isSavedMajor, toggleSaveMajor }) {
  const info = getMajorInfo(majorName, clusterId);
  const [openCareer, setOpenCareer] = React.useState(null);
  const saved = isSavedMajor ? isSavedMajor(majorName, clusterId) : false;
  return (
    <Shell onRestart={onRestart} onOpenSaved={onOpenSaved} savedCount={savedCount}>
      <Title title={info.title} subtitle="A quick, student-friendly overview to help you explore." />
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-800 flex-1">{info.whatItIs}</div>
            {toggleSaveMajor ? (
              <button
                type="button"
                onClick={() => toggleSaveMajor(majorName, clusterId)}
                className={
                  "shrink-0 rounded-full border px-3 py-1 text-xs " +
                  (saved
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")
                }
              >
                {saved ? "Saved" : "Save"}
              </button>
            ) : null}
          </div>

          <Separator className="my-4" />

          <div className="text-sm font-semibold">What you’ll usually study</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 leading-6">
            {info.whatYouStudy.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>

          <div className="mt-4 text-sm font-semibold">What projects can feel like</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 leading-6">
            {info.whatProjectsFeelLike.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>

          <div className="mt-4 text-sm font-semibold">Good to know</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 leading-6">
            {info.goodToKnow.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>

        <Separator className="my-4" />

          <div className="text-sm font-semibold">Examples of career directions</div>
          <div className="mt-1 text-xs text-slate-500">
            These are examples — not guarantees. People take many different paths.
          </div>
          
          {(() => {
            const raw = info?.careerExamples;
          
            const items =
              Array.isArray(raw)
                ? raw
                    .map((v) => (typeof v === "string" ? v.trim() : ""))
                    .filter(Boolean)
                : [];
          
            // Optional: dedupe + cap
            const unique = Array.from(new Set(items)).slice(0, 8);
          
            if (unique.length === 0) {
              return (
                <div className="mt-2 text-sm text-slate-500 italic">
                  No examples to show yet.
                </div>
              );
            }
          
            return (
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 leading-6">
                {unique.map((label, i) => (
                 // <li key={i}>{label}</li>
                  <li key={i}>
                    {CAREER_ABSTRACTS[label] ? (
                      <button
                        type="button"
                        onClick={() => setOpenCareer(label)}
                        className="underline underline-offset-2 hover:opacity-80"
                      >
                        {label}
                      </button>
                    ) : (
                      label
                    )}
                  </li>

                ))}
              </ul>
            );
          })()}


          <div className="mt-4 text-sm font-semibold">Try it while you’re in high school</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 leading-6">
            {info.tryItInHS.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>

          <div className="mt-5 grid gap-2">
            <Button className="w-full rounded-xl" onClick={onExploreSchools}>
              Explore schools by region
            </Button>
            <Button className="w-full rounded-xl" variant="ghost" onClick={onBack}>
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
      {openCareer && (
  <div className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end">
    {/* backdrop */}
    <button
      className="absolute inset-0 bg-black/40"
      onClick={() => setOpenCareer(null)}
      aria-label="Close"
    />

    {/* drawer */}
    <div className="
      relative w-full max-h-[85vh] bg-white rounded-t-2xl p-5 overflow-auto
      md:max-h-none md:h-full md:w-[420px] md:rounded-none md:rounded-l-2xl
    ">
      <div className="flex items-start justify-between mb-4">
        <div className="text-lg font-semibold">
          {CAREER_ABSTRACTS[openCareer].title}
        </div>
        <button
          onClick={() => setOpenCareer(null)}
          className="text-sm underline"
        >
          Close
        </button>
      </div>

      {CAREER_ABSTRACTS[openCareer].sections.map((s, idx) => (
        <div key={idx} className="mb-4">
          <div className="font-semibold mb-1">{s.h}</div>
          {s.p && <div className="text-sm">{s.p}</div>}
          {s.bullets && (
            <ul className="list-disc pl-5 text-sm mt-1">
              {s.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  </div>
)}
    </Shell>
  );
}

// -----------------------------
// Schools
// -----------------------------

// -----------------------------
// CIP CLEANUP + FULL COVERAGE
// -----------------------------
// Strategy:
// 1) Normalize majors → canonical names
// 2) Prefer 4-digit CIP (no decimal) for Scorecard filtering
// 3) If a specific major is missing, fall back to cluster-level CIP coverage

// normalizeMajor helper (single canonical definition)
const normalizeMajor = (name = "") => name.trim().toLowerCase();


// Canonical major → CIP4 (no decimal)
const majorToCip4 = {
  // Computer / Data
  "Computer Science": "1107",
  "Information Systems": "1101",
  "Data Science": "1107",
  "Cybersecurity": "1110",
  "Information Technology": "1110",
  "Software Engineering": "1409",

  // Engineering
  "Mechanical Engineering": "1419",
  "Electrical Engineering": "1410",
  "Civil Engineering": "1408",
  "Industrial Engineering": "1435",
  "Engineering Technology": "1500",
  "Computer Engineering": "1409",
  "Biomedical Engineering": "1405",
  "Chemical Engineering": "1407",
  "Aerospace Engineering": "1402",
  "Environmental Engineering": "1414",

  // Sciences
  "Biology": "2601",
  "Chemistry": "4005",
  "Physics": "4008",
  "Biochemistry": "2602",
  "Neuroscience": "2609",

  // Business
  "Business Administration": "5202",
  "Economics": "4506",
  "Finance": "5208",
  "Marketing": "5214",
  "Management": "5202",
  "Entrepreneurship": "5207",
  "Accounting": ["5203", "5202"],

  // Social Sciences
  "Psychology": "4201",
  "Sociology": "4501",
  "Anthropology": "4502",
  "Political Science": "4510",
  "Human Geography": "4507",

  // Communication / Media / Design
  "Communication Studies": ["0901", "0907"],
  "Journalism": ["0904", "0901"],
  "Advertising": ["0909", "5214"],
  "Public Relations": ["0909", "0901"],
  "Digital Media": ["0907", "1002", "5007"],
  "Graphic Design": ["5004", "5007"],

  // Arts & Performing
  "Visual Arts": "5007",
  "Music": "5009",
  "Theater": "5005",
  "Dance": "5003",
  "Film Production": "5006",
  "Creative Writing": "2302",

  // Health & Human Services
  "Nursing": "5138",
  "Public Health": "5122",
  "Health Sciences": "5100",
  "Social Work": "4407",
  "Human Services": "4400",
  "Kinesiology": "3105",
  "Behavioral Health & Psychology": ["4201", "5122"],

  // Education
  "Education": "1301",
  "Elementary Education": "1312",
  "Secondary Education": "1312",
  "Special Education": "1310",
  "Educational Psychology": "4228",

  // Environment
  "Environmental Studies": "0301",
  "Environmental Science": "0301",
  "Earth Science": "4006",
  "Geology": "4006",
  "Sustainability Studies": "0301",

  // Policy / Law / Civic
  "Public Policy": "4400",
  "Public Administration": "4404",
  "Legal Studies": "2200",
  "Criminal Justice": "4301",
  "International Relations": "4509",
  "Political Science & Public Policy": ["4510", "4405", "4404"],

  // Skilled & Applied Technical
  "Automotive Technology": "4706",
  "Construction Management": "5219",
  "Electrical Technology": ["4701", "1503"],
  "Mechanical Technology": "1503",
  "Welding Technology": "4805",
  "Manufacturing Technology": "1506",
  "HVAC Technology": "4702",
  "Culinary Arts": "1205",
  "Plumbing / Pipefitting": "4605",
  "Carpentry / Building Trades": "4602",
};

// Normalized lookup (prevents key-mismatch bugs)
const majorToCip4Normalized = Object.fromEntries(
  Object.entries(majorToCip4).map(([k, v]) => [normalizeMajor(k), v])
);

// Cluster-level fallback CIP coverage (broad but safe)
const clusterToCip4Fallback = {
  cs_data: ["1107", "1110", "1409"],
  eng_tech: ["1402", "1405", "1407", "1408", "1409", "1410", "1414", "1419", "1435", "1500"],
  biz: ["5202", "5203", "5208", "5214", "5207"],
  comm: ["0901", "0904", "0909", "1002"],
  arts: ["5004"],
  health: ["5138", "5122", "3105", "4201"],
  sci: ["2601", "4005", "4008"],
  env: ["0301", "4006"],
  edu: ["1301", "1312"],
  civic: ["4301", "4400", "4404", "4405", "4510"],
  social: ["4201", "4501"],
  skilled: ["1503", "1506", "4602", "4605", "4701", "4702", "4706", "4805", "1205"],
};

// Resolve CIP(s) for a given major + cluster
function resolveCip4(majorName, clusterId) {
  // 1) Exact match (major names in the UI should match these keys)
  if (majorToCip4[majorName]) {
    const v = majorToCip4[majorName];
    return Array.isArray(v) ? v : [v];
  }

  // 2) Normalized match (protects against whitespace/case differences)
  const key = normalizeMajor(majorName);
  if (majorToCip4Normalized[key]) {
    const v = majorToCip4Normalized[key];
    return Array.isArray(v) ? v : [v];
  }

  // 3) Fallback: broad cluster-level coverage
  return clusterToCip4Fallback[clusterId] || [];
}

// -----------------------------
// Schools (curated demo lists by major + region)
// -----------------------------

// Major-specific demo lists (a few fully populated examples)
const schoolCatalog = {
  "Computer Science": {
    West: [
      { name: "University of Washington", note: "Large public, strong CS, tech ecosystem" },
      { name: "UC San Diego", note: "Public, strong CS, project-heavy" },
      { name: "Cal Poly San Luis Obispo", note: "Hands-on, applied vibe" },
    ],
    Midwest: [
      { name: "UIUC", note: "Well-known CS program" },
      { name: "Purdue University", note: "Engineering-leaning CS" },
      { name: "University of Wisconsin–Madison", note: "Research + broad electives" },
    ],
    Northeast: [
      { name: "Northeastern University", note: "Co-op focused, applied learning" },
      { name: "University of Maryland", note: "Large public, strong computing" },
      { name: "Rutgers", note: "Broad CS options" },
    ],
    South: [
      { name: "Georgia Tech", note: "Tech-focused, strong computing" },
      { name: "UT Austin", note: "Large public, strong tech scene" },
      { name: "NC State", note: "Applied + engineering environment" },
    ],
  },
  "Mechanical Engineering": {
    West: [
      { name: "Cal Poly San Luis Obispo", note: "Hands-on, learn-by-doing" },
      { name: "University of Colorado Boulder", note: "Engineering + applied projects" },
      { name: "UC Davis", note: "Public, strong engineering options" },
    ],
    Midwest: [
      { name: "Purdue University", note: "Large engineering school" },
      { name: "Iowa State University", note: "Applied engineering" },
      { name: "Michigan State University", note: "Broad engineering" },
    ],
    Northeast: [
      { name: "WPI", note: "Project-based engineering" },
      { name: "Penn State", note: "Broad engineering options" },
      { name: "Northeastern University", note: "Co-op + engineering" },
    ],
    South: [
      { name: "Georgia Tech", note: "Engineering-focused" },
      { name: "Virginia Tech", note: "Large engineering college" },
      { name: "NC State", note: "Strong engineering" },
    ],
  },
  "Nursing": {
    West: [
      { name: "University of Washington", note: "Health system + clinical training" },
      { name: "UC Irvine", note: "Health sciences environment" },
      { name: "Oregon Health & Science University", note: "Health-focused campus" },
    ],
    Midwest: [
      { name: "University of Michigan", note: "Strong health system" },
      { name: "Ohio State", note: "Large public, broad clinical options" },
      { name: "University of Minnesota", note: "Nursing + public health" },
    ],
    Northeast: [
      { name: "Boston University", note: "Urban clinical opportunities" },
      { name: "Rutgers", note: "Large public nursing" },
      { name: "University of Pittsburgh", note: "Strong nursing" },
    ],
    South: [
      { name: "UNC Chapel Hill", note: "Health programs" },
      { name: "University of Florida", note: "Large public" },
      { name: "Emory University", note: "Urban clinical setting" },
    ],
  },
  "Culinary Arts": {
    West: [
      { name: "Local community colleges", note: "Often strong hands-on programs" },
      { name: "Culinary programs near major cities", note: "Industry connections" },
    ],
    Midwest: [
      { name: "Kendall College (Chicago)", note: "Culinary-focused programs" },
      { name: "Community colleges", note: "Applied training" },
    ],
    Northeast: [
      { name: "Culinary Institute of America", note: "Hands-on culinary training" },
      { name: "Johnson & Wales University", note: "Career-focused culinary" },
    ],
    South: [
      { name: "Culinary programs at community colleges", note: "Hands-on + local industry" },
      { name: "Johnson & Wales (Charlotte)", note: "Career-focused culinary" },
    ],
  },
};

// Cluster-level demo lists so students see something for ANY major
const clusterSchoolCatalog = {
  eng_tech: {
    West: [
      { name: "Cal Poly San Luis Obispo", note: "Hands-on engineering" },
      { name: "UC Davis", note: "Public engineering" },
    ],
    Midwest: [
      { name: "Purdue University", note: "Engineering" },
      { name: "Iowa State University", note: "Applied engineering" },
    ],
    Northeast: [
      { name: "WPI", note: "Project-based" },
      { name: "Penn State", note: "Broad options" },
    ],
    South: [
      { name: "Georgia Tech", note: "Engineering" },
      { name: "Virginia Tech", note: "Engineering" },
    ],
  },
  cs_data: {
    West: [
      { name: "University of Washington", note: "Computing" },
      { name: "UC San Diego", note: "Computing" },
    ],
    Midwest: [
      { name: "UIUC", note: "Computing" },
      { name: "Purdue University", note: "Computing" },
    ],
    Northeast: [
      { name: "Northeastern University", note: "Co-op + computing" },
      { name: "University of Maryland", note: "Computing" },
    ],
    South: [
      { name: "Georgia Tech", note: "Computing" },
      { name: "UT Austin", note: "Computing" },
    ],
  },
  biz: {
    West: [
      { name: "Arizona State University", note: "Large business programs" },
      { name: "University of Oregon", note: "Business" },
    ],
    Midwest: [
      { name: "Indiana University", note: "Business" },
      { name: "Michigan State University", note: "Business" },
    ],
    Northeast: [
      { name: "Penn State", note: "Business" },
      { name: "Northeastern University", note: "Co-op + business" },
    ],
    South: [
      { name: "UT Austin", note: "Business" },
      { name: "University of Florida", note: "Business" },
    ],
  },
  comm: {
    West: [
      { name: "University of Oregon", note: "Communication/media" },
      { name: "San Diego State University", note: "Communication" },
    ],
    Midwest: [
      { name: "Michigan State University", note: "Communication" },
      { name: "University of Wisconsin–Madison", note: "Media" },
    ],
    Northeast: [
      { name: "Syracuse University", note: "Communication" },
      { name: "Boston University", note: "Media" },
    ],
    South: [
      { name: "University of Georgia", note: "PR/communication" },
      { name: "University of Florida", note: "Media" },
    ],
  },
  arts: {
    West: [
      { name: "CalArts", note: "Arts-focused" },
      { name: "UCLA", note: "Arts/film" },
    ],
    Midwest: [
      { name: "DePaul University", note: "Theater" },
      { name: "University of Michigan", note: "Arts/performance" },
    ],
    Northeast: [
      { name: "NYU", note: "Arts/performance" },
      { name: "Berklee College of Music", note: "Music" },
    ],
    South: [
      { name: "UNC School of the Arts", note: "Performing arts" },
      { name: "University of Texas", note: "Arts" },
    ],
  },
  sci: {
    West: [
      { name: "UC Davis", note: "Life sciences" },
      { name: "University of Colorado Boulder", note: "Sciences" },
    ],
    Midwest: [
      { name: "University of Wisconsin–Madison", note: "Research" },
      { name: "University of Michigan", note: "Sciences" },
    ],
    Northeast: [
      { name: "Rutgers", note: "Research" },
      { name: "Penn State", note: "Sciences" },
    ],
    South: [
      { name: "UNC Chapel Hill", note: "Sciences" },
      { name: "University of Florida", note: "Research" },
    ],
  },
  env: {
    West: [
      { name: "UC Davis", note: "Environment" },
      { name: "Colorado State University", note: "Environmental science" },
    ],
    Midwest: [
      { name: "University of Wisconsin–Madison", note: "Environment" },
      { name: "Michigan State University", note: "Sustainability" },
    ],
    Northeast: [
      { name: "University of Vermont", note: "Environment" },
      { name: "Rutgers", note: "Environmental science" },
    ],
    South: [
      { name: "University of Florida", note: "Environment" },
      { name: "NC State", note: "Environment" },
    ],
  },
  health: {
    West: [
      { name: "University of Washington", note: "Health" },
      { name: "UC Irvine", note: "Health" },
    ],
    Midwest: [
      { name: "University of Michigan", note: "Health" },
      { name: "Ohio State", note: "Health" },
    ],
    Northeast: [
      { name: "Boston University", note: "Health" },
      { name: "Rutgers", note: "Health" },
    ],
    South: [
      { name: "UNC Chapel Hill", note: "Health" },
      { name: "University of Florida", note: "Health" },
    ],
  },
  edu: {
    West: [
      { name: "Arizona State University", note: "Education" },
      { name: "San Diego State University", note: "Teaching" },
    ],
    Midwest: [
      { name: "Michigan State University", note: "Education" },
      { name: "University of Wisconsin–Madison", note: "Education" },
    ],
    Northeast: [
      { name: "Penn State", note: "Education" },
      { name: "Rutgers", note: "Education" },
    ],
    South: [
      { name: "University of Georgia", note: "Education" },
      { name: "University of Florida", note: "Education" },
    ],
  },
  civic: {
    West: [
      { name: "Arizona State University", note: "Public policy" },
      { name: "UC Berkeley", note: "Policy" },
    ],
    Midwest: [
      { name: "Indiana University", note: "Public affairs" },
      { name: "Ohio State", note: "Civic programs" },
    ],
    Northeast: [
      { name: "Rutgers", note: "Policy / CJ" },
      { name: "Syracuse University", note: "Public affairs" },
    ],
    South: [
      { name: "University of Georgia", note: "Policy" },
      { name: "UT Austin", note: "Public affairs" },
    ],
  },
  social: {
    West: [
      { name: "UC San Diego", note: "Social sciences" },
      { name: "University of Washington", note: "Psych/soc" },
    ],
    Midwest: [
      { name: "University of Michigan", note: "Social sciences" },
      { name: "University of Wisconsin–Madison", note: "Social sciences" },
    ],
    Northeast: [
      { name: "Penn State", note: "Social sciences" },
      { name: "Rutgers", note: "Social sciences" },
    ],
    South: [
      { name: "UNC Chapel Hill", note: "Social sciences" },
      { name: "University of Florida", note: "Social sciences" },
    ],
  },
  skilled: {
    West: [
      { name: "Community colleges", note: "Hands-on programs" },
      { name: "Trade/technical institutes", note: "Certifications + apprenticeships" },
    ],
    Midwest: [
      { name: "Technical colleges", note: "Hands-on labs" },
      { name: "Community colleges", note: "Applied programs" },
    ],
    Northeast: [
      { name: "Community colleges", note: "Applied technical" },
      { name: "Trade schools", note: "Skill-focused" },
    ],
    South: [
      { name: "Community colleges", note: "Hands-on" },
      { name: "Trade/technical institutes", note: "Applied training" },
    ],
  },
};

function SchoolsView({ majorName, clusterId, clusterTitle, onBack, onRestart, onOpenSaved, savedCount, isSavedSchool, toggleSaveSchool }) {
  // Live College Scorecard search (Phase A): ZIP + radius + size filter
  // Note: We intentionally do NOT do distance sorting yet.
  const [mode, setMode] = useState("zip"); // zip | state | region
  const regions = ["West", "Midwest", "South", "Northeast"];

  const STATES = [
    ["Alabama","AL"],["Alaska","AK"],["Arizona","AZ"],["Arkansas","AR"],["California","CA"],["Colorado","CO"],["Connecticut","CT"],["Delaware","DE"],["District of Columbia","DC"],["Florida","FL"],["Georgia","GA"],["Hawaii","HI"],["Idaho","ID"],["Illinois","IL"],["Indiana","IN"],["Iowa","IA"],["Kansas","KS"],["Kentucky","KY"],["Louisiana","LA"],["Maine","ME"],["Maryland","MD"],["Massachusetts","MA"],["Michigan","MI"],["Minnesota","MN"],["Mississippi","MS"],["Missouri","MO"],["Montana","MT"],["Nebraska","NE"],["Nevada","NV"],["New Hampshire","NH"],["New Jersey","NJ"],["New Mexico","NM"],["New York","NY"],["North Carolina","NC"],["North Dakota","ND"],["Ohio","OH"],["Oklahoma","OK"],["Oregon","OR"],["Pennsylvania","PA"],["Rhode Island","RI"],["South Carolina","SC"],["South Dakota","SD"],["Tennessee","TN"],["Texas","TX"],["Utah","UT"],["Vermont","VT"],["Virginia","VA"],["Washington","WA"],["West Virginia","WV"],["Wisconsin","WI"],["Wyoming","WY"],
  ];

  const [stateCode, setStateCode] = useState("");

  // Demo region mode
  const [region, setRegion] = useState(null);

  // Live ZIP mode inputs
  const [apiKey, setApiKey] = useState("");
  const [zip, setZip] = useState("");
  const [radius, setRadius] = useState("25");
  const cip4List = resolveCip4(majorName, clusterId);
  const cipList = cip4List && cip4List.length ? cip4List : null;
  const cipPrimary = cipList ? cipList[0] : null;
  const [useProgramFilter, setUseProgramFilter] = useState(true);
  const [sizeBand, setSizeBand] = useState("All");
  const [campusFilter, setCampusFilter] = useState("All");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [showProgramDebug, setShowProgramDebug] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [cipBundleDebug, setCipBundleDebug] = useState(null); // { used:boolean, cipList:string[], perCipCounts:Record<string,number>, merged:number, deduped:number }

  const demoSchools = schoolCatalog[majorName]?.[region] || clusterSchoolCatalog[clusterId]?.[region] || [];

  const sizeRangeParam = useMemo(() => {
    // These bands are adjustable. Using latest.student.size ranges.
    if (sizeBand === "Small") return "1..4999";
    if (sizeBand === "Medium") return "5000..14999";
    if (sizeBand === "Large") return "15000..";
    return null;
  }, [sizeBand]);

  const sizeLabel = (n) => {
    if (typeof n !== "number") return "";
    if (n < 5000) return "Small";
    if (n < 15000) return "Medium";
    return "Large";
  };

  const campusSetting = (localeCode) => {
    const code = Number(localeCode);
    if ([11, 12, 13].includes(code)) return "City";
    if ([21, 22, 23].includes(code)) return "Suburban";
    if ([31, 32, 33].includes(code)) return "Town";
    if ([41, 42, 43].includes(code)) return "Rural";
    return "Not listed";
  };

  const filteredResults = useMemo(() => {
    if (campusFilter === "All") return results;
    return results.filter((r) => {
      const locale = r?.["school.locale"] ?? r?.school?.locale;
      return campusSetting(locale) === campusFilter;
    });
  }, [results, campusFilter]);

  const fetchSchools = async () => {
    setError(null);
    setResults([]);
    setCipBundleDebug(null);
    setHasSearched(true);

    const z = (zip || "").trim();
    if (!apiKey.trim()) {
      setError("Enter an API key to use live school search.");
      return;
    }
    if (mode === "zip") {
      if (!/^[0-9]{5}$/.test(z)) {
        setError("Enter a valid 5-digit ZIP code.");
        return;
      }
    }
    if (mode === "state") {
      if (!stateCode) {
        setError("Select a state.");
        return;
      }
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("api_key", apiKey.trim());
      if (mode === "zip") {
        params.set("zip", z);
        params.set("distance", `${radius}mi`);
      }
      if (mode === "state") {
        params.set("school.state", stateCode);
      }
      params.set("per_page", "25");

      // CIP program filter: use 4-digit CIP code without decimal (e.g., 09.01 → "0901").
      // This helps handle program name variations across schools.
      // CIP program filter: when ON, we run one request per CIP code and merge schools.
      // (College Scorecard filters are AND-based; multi-call merge gives OR behavior.)
      if (cipPrimary && useProgramFilter) {
        // Nothing here; CIP is applied per-call below.
        params.set("keys_nested", "true");
      }

      params.set(
        "fields",
        [
          "id",
          // When keys_nested=true, these become nested objects (school.name, etc.).
          "school",
          "school.locale",
          "latest.student.size",
          "latest.programs",
          "latest.programs.cip_4_digit.code",
          "latest.programs.cip_4_digit.title",
          "latest.programs.credential.level",
        ].join(",")
      );

      if (sizeRangeParam) params.set("latest.student.size__range", sizeRangeParam);

      const baseUrl = "https://api.data.gov/ed/collegescorecard/v1/schools";

      const runOne = async (cip) => {
        const p = new URLSearchParams(params);
        if (cip) {
          p.set("latest.programs.cip_4_digit.code", cip);
          p.set("all_programs_nested", "true");
          p.set("keys_nested", "true");
        }
        const url = `${baseUrl}?${p.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        return Array.isArray(data?.results) ? data.results : [];
      };

      let rows = [];
      if (cipList && useProgramFilter) {
        const all = await Promise.all(cipList.map((c) => runOne(c)));
        const perCipCounts = {};
        cipList.forEach((c, i) => {
          perCipCounts[c] = Array.isArray(all[i]) ? all[i].length : 0;
        });
        const flat = all.flat();
        const seen = new Set();
        rows = flat.filter((r) => {
          const id = r?.id;
          if (!id) return true;
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        setCipBundleDebug({
          used: true,
          cipList: [...cipList],
          perCipCounts,
          merged: flat.length,
          deduped: rows.length,
        });
      } else {
        rows = await runOne(null);
        setCipBundleDebug({ used: false, cipList: cipList ? [...cipList] : [], perCipCounts: {}, merged: rows.length, deduped: rows.length });
      }

      setResults(rows);
    } catch (e) {
      setError(e?.message || "Something went wrong fetching schools.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh behavior:
  // - Campus setting filter is client-side (instant)
  // - For ZIP/State/Radius/Size/CIP toggles: auto-run search AFTER the user has searched once
  // - Debounce ZIP changes so typing doesn't spam the API
  useEffect(() => {
    if (!hasSearched) return;
    if (loading) return;
    if (!apiKey.trim()) return;

    if (mode !== "zip" && mode !== "state") return;

    const z = (zip || "").trim();
    if (mode === "zip" && !/^[0-9]{5}$/.test(z)) return;
    if (mode === "state" && !stateCode) return;

    const delay = mode === "zip" ? 450 : 0;
    const t = setTimeout(() => {
      fetchSchools();
    }, delay);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, zip, stateCode, radius, sizeBand, useProgramFilter, apiKey]);

  return (
    <Shell onRestart={onRestart} onOpenSaved={onOpenSaved} savedCount={savedCount}>
      <Title title="Schools to Explore" subtitle={`Examples for ${majorName} (not rankings)`} />
      <div className="mb-3 text-xs text-slate-500">
        {majorName} is commonly explored within <span className="font-medium">{clusterTitle}</span>.
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="mb-3 flex gap-2">
            <ChipButton active={mode === "zip"} onClick={() => setMode("zip")}>
              Near a ZIP code
            </ChipButton>
            <ChipButton active={mode === "state"} onClick={() => setMode("state")}>
              Browse by state
            </ChipButton>
            <ChipButton active={mode === "region"} onClick={() => setMode("region")}>
              Browse by region
            </ChipButton>
          </div>

          {mode === "zip" ? (
            <>
              <div className="text-sm font-semibold">Search schools near you</div>
              <div className="mt-1 text-xs text-slate-500">
                Uses the U.S. Dept. of Education College Scorecard API. This is for exploration (not rankings).
              </div>

              <div className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-600">Program filter (CIP)</div>
                    <div className="text-xs text-slate-500">
                      {cipPrimary
                        ? `Filter to schools that offer this major (CIP ${cipList ? cipList.join("/") : cipPrimary}).`
                        : "No CIP mapping yet for this major — showing nearby schools."}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUseProgramFilter((v) => !v)}
                    disabled={!cipPrimary}
                    className={
                      "rounded-full border px-3 py-1 text-xs " +
                      (cipPrimary
                        ? useProgramFilter
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        : "border-slate-200 bg-slate-100 text-slate-400")
                    }
                  >
                    {cipPrimary ? (useProgramFilter ? "On" : "Off") : "N/A"}
                  </button>
                </div>
              </div>

              <div className="mt-3 grid gap-2">
                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <div className="text-xs font-semibold text-slate-600">API key</div>
                  <input
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste your College Scorecard API key"
                    className="mt-1 w-full bg-transparent text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <div className="text-xs font-semibold text-slate-600">ZIP code</div>
                    <input
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="e.g., 94107"
                      className="mt-1 w-full bg-transparent text-sm outline-none"
                      inputMode="numeric"
                      maxLength={5}
                    />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <div className="text-xs font-semibold text-slate-600">Radius</div>
                    <select
                      value={radius}
                      onChange={(e) => setRadius(e.target.value)}
                      className="mt-1 w-full bg-transparent text-sm outline-none"
                    >
                      <option value="10">10 miles</option>
                      <option value="25">25 miles</option>
                      <option value="50">50 miles</option>
                      <option value="100">100 miles</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <div className="text-xs font-semibold text-slate-600">School size</div>
                  <select
                    value={sizeBand}
                    onChange={(e) => setSizeBand(e.target.value)}
                    className="mt-1 w-full bg-transparent text-sm outline-none"
                  >
                    <option value="All">All</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                  <div className="mt-1 text-xs text-slate-500">Small &lt; 5k · Medium 5k–15k · Large 15k+</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <div className="text-xs font-semibold text-slate-600">Campus setting</div>
                  <select
                    value={campusFilter}
                    onChange={(e) => setCampusFilter(e.target.value)}
                    className="mt-1 w-full bg-transparent text-sm outline-none"
                  >
                    <option value="All">All</option>
                    <option value="City">City</option>
                    <option value="Suburban">Suburban</option>
                    <option value="Town">Town</option>
                    <option value="Rural">Rural</option>
                  </select>
                </div>

                <Button className="w-full rounded-xl" onClick={fetchSchools} disabled={loading}>
                  {loading ? "Searching…" : "Find schools"}
                </Button>

                {error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                {results.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">Results</div>
                      <button
                        type="button"
                        onClick={() => setShowProgramDebug((v) => !v)}
                        className="text-xs text-slate-500 underline"
                      >
                        {showProgramDebug ? "Hide debug" : "Show debug"}
                      </button>
                    </div>

                    {showProgramDebug && cipBundleDebug ? (
                      <div className="mt-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
                        <div className="font-semibold">CIP Bundle Debug</div>
                        <div className="mt-1">Major: {majorName}</div>
                        <div>Program filter: {useProgramFilter && cipPrimary ? "ON" : "OFF"}</div>
                        <div>CIP list: {cipBundleDebug.cipList.length ? cipBundleDebug.cipList.join("/") : "(none)"}</div>
                        {cipBundleDebug.used ? (
                          <>
                            <div className="mt-1">Calls made (one per CIP):</div>
                            <ul className="list-disc pl-5">
                              {Object.entries(cipBundleDebug.perCipCounts).map(([c, n]) => (
                                <li key={c}>{c}: {n} results</li>
                              ))}
                            </ul>
                            <div className="mt-1">Merged: {cipBundleDebug.merged} · After dedupe: {cipBundleDebug.deduped}</div>
                          </>
                        ) : (
                          <div className="mt-1">Single call (no CIP bundle merge). Returned: {cipBundleDebug.merged}</div>
                        )}
                      </div>
                    ) : null}

                    <div className="mt-2 grid gap-2">
                      {filteredResults.map((r) => {
                        const name = r?.["school.name"] || r?.school?.name;
                        const city = r?.["school.city"] || r?.school?.city;
                        const state = r?.["school.state"] || r?.school?.state;
                        const locale = r?.["school.locale"] ?? r?.school?.locale;
                        const size = r?.["latest.student.size"] ?? r?.latest?.student?.size;
                        const urlSite = r?.["school.school_url"] || r?.school?.school_url || r?.school?.url;

                        const schoolObjForSave = {
                          id: r?.id,
                          name: name || "School",
                          city: city || "",
                          state: state || "",
                          urlSite: urlSite || "",
                        };
                        const savedSchoolKey = (schoolObjForSave.id ? `id:${String(schoolObjForSave.id)}` : `name:${(schoolObjForSave.name || "").trim()}|${(schoolObjForSave.state || "").trim()}`);
                        const schoolSaved = isSavedSchool ? isSavedSchool(savedSchoolKey) : false;

                        

                        const normCip = (c) => String(c ?? "").replace(/[^0-9]/g, "").padStart(4, "0");
                        let programMatch = "Unknown";
                        const progsForBadge = r?.latest?.programs ?? r?.["latest.programs"];
                        if (cipPrimary && useProgramFilter) {
                          if (Array.isArray(progsForBadge)) {
                            const getProgCode = (p) => p?.cip_4_digit?.code ?? p?.["cip_4_digit.code"] ?? p?.["cip_4_digit"]?.code;
                            const match = progsForBadge.find((p) => cipList ? cipList.some((c) => normCip(getProgCode(p)) === normCip(c)) : normCip(getProgCode(p)) === normCip(cipPrimary));
                            programMatch = match ? "Likely" : "Unknown";
                          } else {
                            programMatch = "Likely";
                          }
                        }

                        let programLine = null;
                        if (cipPrimary && useProgramFilter) {
                          const progs = r?.latest?.programs ?? r?.["latest.programs"];
                          if (Array.isArray(progs)) {
                            const getProgCode = (p) => p?.cip_4_digit?.code ?? p?.["cip_4_digit.code"] ?? p?.["cip_4_digit"]?.code;
                            const getProgTitle = (p) => p?.cip_4_digit?.title ?? p?.["cip_4_digit.title"] ?? p?.["cip_4_digit"]?.title;
                            const match = progs.find((p) =>
                              cipList
                                ? cipList.some((c) => normCip(getProgCode(p)) === normCip(c))
                                : normCip(getProgCode(p)) === normCip(cipPrimary)
                            );
                            const title = getProgTitle(match);
                            programLine = title ? `Matched program: ${title} (CIP ${cipPrimary})` : null;
                          }
                        }

                        return (
                          <div key={r?.id || name} className="rounded-xl border border-slate-200 bg-white px-3 py-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="text-sm font-semibold">{name || "School"}</div>
                              <div className="flex items-center gap-2">
                                {toggleSaveSchool ? (
                                  <button
                                    type="button"
                                    onClick={() => toggleSaveSchool(schoolObjForSave)}
                                    className={
                                      "rounded-full border px-3 py-1 text-xs " +
                                      (schoolSaved
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")
                                    }
                                  >
                                    {schoolSaved ? "Saved" : "Save"}
                                  </button>
                                ) : null}
                                <Badge variant={programMatch === "Likely" ? "default" : "secondary"}>
                                Program match: {programMatch}
                              </Badge>
                              </div>
                            </div>

                            <div className="text-xs text-slate-600">
                              {city ? `${city}, ` : ""}{state || ""}
                              {typeof size === "number" ? ` · ${sizeLabel(size)} (${size.toLocaleString()} students)` : ""}
                              
                            </div>

                            <div className="mt-1 text-xs text-slate-600">📍 Campus setting: {campusSetting(locale)}</div>

                            {programLine ? (
                              <div className="mt-1 text-xs text-slate-500">{programLine}</div>
                            ) : null}

                            {showProgramDebug ? (
                              <div className="mt-2 rounded-lg bg-slate-50 px-2 py-2 text-[11px] text-slate-600">
                                <div><span className="font-semibold">Debug</span>: CIP filter {cipPrimary && useProgramFilter ? "ON" : "OFF"}</div>
                                <div>cipPrimary: {cipPrimary || "(none)"}</div>
                                <div>programs array length: {Array.isArray(r?.latest?.programs ?? r?.["latest.programs"]) ? (r?.latest?.programs ?? r?.["latest.programs"]).length : 0}</div>
                              </div>
                            ) : null}

                            {urlSite && (
                              <div className="mt-1 flex flex-col gap-1">
                                <a
                                  href={urlSite?.startsWith("http") ? urlSite : `https://${urlSite}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block text-xs text-blue-600 underline hover:text-blue-700"
                                >
                                  Visit school website
                                </a>
                                <a
                                  href={`https://collegescorecard.ed.gov/search/?search=${encodeURIComponent(name || "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block text-xs text-slate-600 underline hover:text-slate-800"
                                >
                                  View programs on College Scorecard
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2 text-xs text-slate-500">Note: This is a starting list to explore — not a ranking.</div>
                  </>
                ) : null}

                {!loading && results.length === 0 && !error ? (
                  <div className="text-xs text-slate-500">Enter your API key and ZIP to search.</div>
                ) : null}
              </div>
            </>
          ) : mode === "state" ? (
            <>
              <div className="text-sm font-semibold">Browse schools by state</div>
              <div className="mt-1 text-xs text-slate-500">
                Uses the U.S. Dept. of Education College Scorecard API. This is for exploration (not rankings).
              </div>

              <div className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-600">Program filter (CIP)</div>
                    <div className="text-xs text-slate-500">
                      {cipPrimary
                        ? `Filter to schools that offer this major (CIP ${cipList ? cipList.join("/") : cipPrimary}).`
                        : "No CIP mapping yet for this major — showing schools in the state."}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUseProgramFilter((v) => !v)}
                    disabled={!cipPrimary}
                    className={
                      "rounded-full border px-3 py-1 text-xs " +
                      (cipPrimary
                        ? useProgramFilter
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        : "border-slate-200 bg-slate-100 text-slate-400")
                    }
                  >
                    {cipPrimary ? (useProgramFilter ? "On" : "Off") : "N/A"}
                  </button>
                </div>
              </div>

              <div className="mt-3 grid gap-2">
                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <div className="text-xs font-semibold text-slate-600">API key</div>
                  <input
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste your College Scorecard API key"
                    className="mt-1 w-full bg-transparent text-sm outline-none"
                  />
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <div className="text-xs font-semibold text-slate-600">State</div>
                  <select
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    className="mt-1 w-full bg-transparent text-sm outline-none"
                  >
                    <option value="">Select a state</option>
                    {STATES.map(([name, code]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <div className="text-xs font-semibold text-slate-600">School size</div>
                  <select
                    value={sizeBand}
                    onChange={(e) => setSizeBand(e.target.value)}
                    className="mt-1 w-full bg-transparent text-sm outline-none"
                  >
                    <option value="All">All</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                  <div className="mt-1 text-xs text-slate-500">Small &lt; 5k · Medium 5k–15k · Large 15k+</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <div className="text-xs font-semibold text-slate-600">Campus setting</div>
                  <select
                    value={campusFilter}
                    onChange={(e) => setCampusFilter(e.target.value)}
                    className="mt-1 w-full bg-transparent text-sm outline-none"
                  >
                    <option value="All">All</option>
                    <option value="City">City</option>
                    <option value="Suburban">Suburban</option>
                    <option value="Town">Town</option>
                    <option value="Rural">Rural</option>
                  </select>
                </div>

                <Button className="w-full rounded-xl" onClick={fetchSchools} disabled={loading}>
                  {loading ? "Searching…" : "Find schools"}
                </Button>

                {error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
                ) : null}

                {results.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">Results</div>
                      <button
                        type="button"
                        onClick={() => setShowProgramDebug((v) => !v)}
                        className="text-xs text-slate-500 underline"
                      >
                        {showProgramDebug ? "Hide debug" : "Show debug"}
                      </button>
                    </div>

                    {showProgramDebug && cipBundleDebug ? (
                      <div className="mt-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
                        <div className="font-semibold">CIP Bundle Debug</div>
                        <div className="mt-1">Major: {majorName}</div>
                        <div>Program filter: {useProgramFilter && cipPrimary ? "ON" : "OFF"}</div>
                        <div>CIP list: {cipBundleDebug.cipList.length ? cipBundleDebug.cipList.join("/") : "(none)"}</div>
                        {cipBundleDebug.used ? (
                          <>
                            <div className="mt-1">Calls made (one per CIP):</div>
                            <ul className="list-disc pl-5">
                              {Object.entries(cipBundleDebug.perCipCounts).map(([c, n]) => (
                                <li key={c}>{c}: {n} results</li>
                              ))}
                            </ul>
                            <div className="mt-1">Merged: {cipBundleDebug.merged} · After dedupe: {cipBundleDebug.deduped}</div>
                          </>
                        ) : (
                          <div className="mt-1">Single call (no CIP bundle merge). Returned: {cipBundleDebug.merged}</div>
                        )}
                      </div>
                    ) : null}

                    <div className="mt-2 text-xs text-slate-500">Note: This is a starting list to explore — not a ranking.</div>
                    <div className="mt-2 grid gap-2">
                      {filteredResults.map((r) => {
                        const name = r?.["school.name"] || r?.school?.name;
                        const city = r?.["school.city"] || r?.school?.city;
                        const state = r?.["school.state"] || r?.school?.state;
                        const locale = r?.["school.locale"] ?? r?.school?.locale;
                        const size = r?.["latest.student.size"] ?? r?.latest?.student?.size;
                        const urlSite = r?.["school.school_url"] || r?.school?.school_url || r?.school?.url;
                        const programMatch = (cipPrimary && useProgramFilter) ? "Likely" : "Unknown";
                        return (
                          <div key={r?.id || name} className="rounded-xl border border-slate-200 bg-white px-3 py-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="text-sm font-semibold">{name || "School"}</div>
                              <Badge variant={programMatch === "Likely" ? "default" : "secondary"}>
                                Program match: {programMatch}
                              </Badge>
                            </div>
                            <div className="text-xs text-slate-600">
                              {city ? `${city}, ` : ""}{state || ""}
                              {typeof size === "number" ? ` · ${sizeLabel(size)} (${size.toLocaleString()} students)` : ""}
                            </div>
                            
                            <div className="mt-1 text-xs text-slate-600">📍 Campus setting: {campusSetting(locale)}</div>
                            {urlSite && (
                              <div className="mt-1 flex flex-col gap-1">
                                <a
                                  href={urlSite?.startsWith("http") ? urlSite : `https://${urlSite}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block text-xs text-blue-600 underline hover:text-blue-700"
                                >
                                  Visit school website
                                </a>
                                <a
                                  href={`https://collegescorecard.ed.gov/search/?search=${encodeURIComponent(name || "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block text-xs text-slate-600 underline hover:text-slate-800"
                                >
                                  View programs on College Scorecard
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : null}

                {!loading && results.length === 0 && !error ? (
                  <div className="text-xs text-slate-500">Select a state and click Find schools.</div>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <div className="text-sm font-semibold">Browse by region (demo)</div>
              <div className="mt-1 text-xs text-slate-500">This is a curated demo list used for prototyping.</div>

              {!region ? (
                <>
                  <div className="mt-3 text-sm font-semibold">Choose a region</div>
                  <div className="mt-2 grid gap-2">
                    {regions.map((r) => (
                      <Button key={r} variant="outline" className="rounded-xl" onClick={() => setRegion(r)}>
                        {r}
                      </Button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-3 text-sm font-semibold">{region} programs</div>
                  <div className="mt-2 grid gap-2">
                    {demoSchools.length === 0 ? (
                      <div className="text-sm text-slate-600">No demo schools listed yet for this region.</div>
                    ) : (
                      demoSchools.map((s) => (
                        <div key={s.name} className="rounded-xl border border-slate-200 bg-white px-3 py-3">
                          <div className="text-sm font-semibold">{s.name}</div>
                          <div className="text-xs text-slate-600">{s.note}</div>
                        </div>
                      ))
                    )}
                  </div>
                  <Button className="mt-3 w-full rounded-xl" variant="outline" onClick={() => setRegion(null)}>
                    Change region
                  </Button>
                </>
              )}
            </>
          )}

          <Button className="mt-4 w-full rounded-xl" variant="ghost" onClick={onBack}>
            Back
          </Button>
        </CardContent>
      </Card>
    </Shell>
  );
}

// -----------------------------
// App
// -----------------------------

export default function App() {
  const [audience, setAudience] = useState("student"); // "student" | "counselor"
  // --- Persistence + Diagnostics (prototype hardening) ---
  const STORAGE_KEY = "hs_major_explorer_state_v0";

  // --- Favorites v0 (local-only, single-user demo) ---
  const FAVORITES_KEY = "hs_major_explorer_favorites_v0";
  const loadFavorites = () => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (!raw) return { clusters: [], majors: [], schools: [] };
      const parsed = JSON.parse(raw);
      return {
        clusters: Array.isArray(parsed?.clusters) ? parsed.clusters : [],
        majors: Array.isArray(parsed?.majors) ? parsed.majors : [],
        schools: Array.isArray(parsed?.schools) ? parsed.schools : [],
      };
    } catch {
      return { clusters: [], majors: [], schools: [] };
    }
  };

  const saveFavorites = (fav) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(fav));
    } catch {
      // ignore
    }
  };

  const loadState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const saveState = (stateObj) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateObj));
    } catch {
      // ignore
    }
  };

  const clearSavedState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  function resetAll() {
    setScreen("welcome");
    setP1Index(0);
    setP1Answers({});
    setSelectedDomains(new Set());
    setP2Order([]);
    setP2Index(0);
    setP2Answers({});
    setSurfacedClusters([]);
    setLastClusterId(null);
    setComparePair(null);
    setActiveCluster(null);
    setActiveMajor(null);
    setActiveSchoolsMajor(null);
    setFatalError(null);
    clearSavedState();
  }
  const saved = loadState();
  const favSaved = loadFavorites();
  const [screen, setScreen] = useState(saved?.screen || "welcome");

  const [favorites, setFavorites] = useState({
    clusters: new Set(favSaved.clusters),
    majors: new Set(favSaved.majors), // keys: `${majorName}||${clusterId}`
    schools: new Map(favSaved.schools.map((s) => [s.key, s])),
  });

  const savedCount = favorites.clusters.size + favorites.majors.size + favorites.schools.size;

  const persistFavorites = (next) => {
    saveFavorites({
      clusters: Array.from(next.clusters),
      majors: Array.from(next.majors),
      schools: Array.from(next.schools.values()),
    });
  };

  const majorFavKey = (majorName, clusterId) => `${majorName}||${clusterId}`;

  const isSavedCluster = (clusterId) => favorites.clusters.has(clusterId);
  const toggleSaveCluster = (clusterId) => {
    setFavorites((prev) => {
      const next = { ...prev, clusters: new Set(prev.clusters) };
      if (next.clusters.has(clusterId)) next.clusters.delete(clusterId);
      else next.clusters.add(clusterId);
      persistFavorites(next);
      return next;
    });
  };

  const isSavedMajor = (majorName, clusterId) => favorites.majors.has(majorFavKey(majorName, clusterId));
  const toggleSaveMajor = (majorName, clusterId) => {
    const key = majorFavKey(majorName, clusterId);
    setFavorites((prev) => {
      const next = { ...prev, majors: new Set(prev.majors) };
      if (next.majors.has(key)) next.majors.delete(key);
      else next.majors.add(key);
      persistFavorites(next);
      return next;
    });
  };

  const schoolKey = (s) => {
    const id = s?.id ? String(s.id) : "";
    const name = (s?.name || "").trim();
    const state = (s?.state || "").trim();
    return id ? `id:${id}` : `name:${name}|${state}`;
  };

  const isSavedSchool = (key) => favorites.schools.has(key);
  const toggleSaveSchool = (schoolObj) => {
    const key = schoolKey(schoolObj);
    setFavorites((prev) => {
      const next = { ...prev, schools: new Map(prev.schools) };
      if (next.schools.has(key)) next.schools.delete(key);
      else next.schools.set(key, { ...schoolObj, key });
      persistFavorites(next);
      return next;
    });
  };

  const clearFavorites = () => {
    const next = { clusters: new Set(), majors: new Set(), schools: new Map() };
    setFavorites(next);
    persistFavorites(next);
  };

  const openSaved = () => setScreen("saved");

  // Pass 1 state
  const [p1Index, setP1Index] = useState(saved?.p1Index ?? 0);
  const [p1Answers, setP1Answers] = useState(saved?.p1Answers || {});
  const [selectedDomains, setSelectedDomains] = useState(new Set(saved?.selectedDomains || []));

  // Pass 2 state
  const [p2Order, setP2Order] = useState(saved?.p2Order || []); // domain ids
  const [p2Index, setP2Index] = useState(saved?.p2Index ?? 0);
  const [p2Answers, setP2Answers] = useState(saved?.p2Answers || {});

  // Cluster state
  const [surfacedClusters, setSurfacedClusters] = useState(saved?.surfacedClusters || []);
  const [clusterMeta, setClusterMeta] = useState(saved?.clusterMeta || {}); // { [clusterId]: { supportCount:number, reinforced:boolean } }
  const [lastClusterId, setLastClusterId] = useState(saved?.lastClusterId || null);

  // Comparison state
  const [comparePair, setComparePair] = useState(saved?.comparePair || null); // {a,b}

  // Explore cluster state
  const [activeCluster, setActiveCluster] = useState(saved?.activeCluster || null);

  // Major detail state
  const [activeMajor, setActiveMajor] = useState(saved?.activeMajor || null); // { name, clusterId }

  // Schools view state
  const [activeSchoolsMajor, setActiveSchoolsMajor] = useState(saved?.activeSchoolsMajor || null);

  // Global diagnostics: capture crashes instead of losing session
  const [fatalError, setFatalError] = useState(null);

  useEffect(() => {
    const onError = (event) => {
      try {
        const msg = event?.message || "Unknown error";
        const src = event?.filename || "";
        const line = event?.lineno || "";
        setFatalError(`${msg}${src ? `
${src}:${line}` : ""}`);
      } catch {
        setFatalError("Unknown error");
      }
    };

    const onRejection = (event) => {
      try {
        const reason = event?.reason;
        const msg = typeof reason === "string" ? reason : reason?.message || "Unhandled promise rejection";
        setFatalError(msg);
      } catch {
        setFatalError("Unhandled promise rejection");
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  // Persist key state so a permission prompt / refresh doesn’t wipe progress
  useEffect(() => {
    saveState({
      screen,
      p1Index,
      p1Answers,
      selectedDomains: Array.from(selectedDomains),
      p2Order,
      p2Index,
      p2Answers,
      surfacedClusters,
      clusterMeta,
      lastClusterId,
      comparePair,
      activeCluster,
      activeMajor,
      activeSchoolsMajor,
    });
  }, [
    screen,
    p1Index,
    p1Answers,
    selectedDomains,
    p2Order,
    p2Index,
    p2Answers,
    surfacedClusters,
    clusterMeta,
    lastClusterId,
    comparePair,
    activeCluster,
    activeMajor,
    activeSchoolsMajor,
  ]); // { name, clusterId }

  const comparisons = useMemo(() => selectComparisons(surfacedClusters, lastClusterId), [surfacedClusters, lastClusterId]);

  const setAnswer = (domainId, value) => {
    setP1Answers((prev) => ({ ...prev, [domainId]: value }));
  };

  const startPass1 = () => {
    setScreen("pass1");
  };

  const finishPass1 = () => {
    setScreen("pass1_results");

    // Preselect strong/some as a convenience (student can change)
    const preset = new Set();
    domains.forEach((d) => {
      if (p1Answers[d.id] === 3 || p1Answers[d.id] === 2) preset.add(d.id);
    });
    setSelectedDomains(preset);
  };

  const continueToPass2 = () => {
    const order = Array.from(selectedDomains);
    setP2Order(order);
    setP2Index(0);
    setScreen("pass2");
  };

  const setP2Value = (domainId, val) => {
    setP2Answers((prev) => ({ ...prev, [domainId]: val }));
  };

  const finishPass2 = () => {
    // 1) Base support counts from selected Pass 2 domains
    const supportCount = {};
    const reinforced = new Set();

    // 2) Surface clusters (union of base clusters + nuance)
    const set = new Set();
    for (const domainId of p2Order) {
      const base = domainBaseClusters[domainId] || [];
      base.forEach((c) => {
        set.add(c);
        supportCount[c] = (supportCount[c] || 0) + 1;
      });

     // Track nuance additions as "reinforced" signals
    const before = new Set(set);

    // 1) Apply Pass 2 nuance rules AND capture explanations
    const pass2 = p2Answers?.[domainId] ?? {};
    const result = applyPass2Nuance(domainId, pass2, set, []);

    // support either return style
    const clusterSet = result?.clusterSet ?? set;
    const explain = Array.isArray(result?.explain) ? result.explain : [];

    // 2) Store explanations at the DOMAIN level (once)
    if (explain.length > 0) {
      explainByDomain[domainId] = explain;
    }

    // 3) Track which CLUSTERS were newly added (existing logic)
    for (const cid of clusterSet) {
      if (!before.has(cid)) reinforced.add(cid);
    }

    }

    // Keep stable order by using clusters array order
    const ordered = clusters.map((c) => c.id).filter((id) => set.has(id));

    // Build meta map
    const meta = {};
    ordered.forEach((cid) => {
      meta[cid] = {
        supportCount: supportCount[cid] || 0,
        reinforced: reinforced.has(cid),
      };
    });

    setSurfacedClusters(ordered);
    setClusterMeta(meta);
    setLastClusterId(ordered.length ? ordered[0] : null);
    setScreen("clusters");
  };

  const openComparison = (a, b) => {
    setComparePair({ a, b });
    setScreen("compare");
  };

  const openExploreCluster = (clusterId) => {
    setActiveCluster(clusterId);
    setLastClusterId(clusterId);
    setScreen("explore_cluster");
  };

  const openMajorDetail = (majorName) => {
    if (!majorName || !activeCluster) return;
    setActiveMajor({ name: majorName, clusterId: activeCluster });
    setScreen("major_detail");
  };

  const openSchools = () => {
    if (!activeMajor?.name) return;
    setActiveSchoolsMajor({ name: activeMajor.name, clusterId: activeMajor.clusterId });
    setScreen("schools");
  };

  const resetToClusters = () => {
    setScreen("clusters");
  };

  const goComparePicker = () => setScreen("compare_picker");

  // Screen rendering

  if (screen === "saved") {
    return (
      <Shell onRestart={resetAll} onOpenSaved={openSaved} savedCount={savedCount}>
        <Title title="Saved" subtitle="A personal list you can come back to later." />
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="text-sm font-semibold">Saved clusters</div>
            <div className="mt-2 grid gap-2">
              {Array.from(favorites.clusters).length === 0 ? (
                <div className="text-sm text-slate-600">No saved clusters yet.</div>
              ) : (
                Array.from(favorites.clusters).map((cid) => {
                  const c = clusters.find((x) => x.id === cid);
                  if (!c) return null;
                  return (
                    <div key={cid} className="rounded-xl border border-slate-200 bg-white px-3 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCluster(cid);
                            setLastClusterId(cid);
                            setScreen("explore_cluster");
                          }}
                          className="text-left"
                        >
                          <div className="text-sm font-semibold">{c.title}</div>
                          <div className="text-xs text-slate-500">Tap to open</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSaveCluster(cid)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <Separator className="my-4" />

            <div className="text-sm font-semibold">Saved majors</div>
            <div className="mt-2 grid gap-2">
              {Array.from(favorites.majors).length === 0 ? (
                <div className="text-sm text-slate-600">No saved majors yet.</div>
              ) : (
                Array.from(favorites.majors).map((k) => {
                  const [m, cid] = String(k).split("||");
                  const c = clusters.find((x) => x.id === cid);
                  return (
                    <div key={k} className="rounded-xl border border-slate-200 bg-white px-3 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCluster(cid);
                            setActiveMajor({ name: m, clusterId: cid });
                            setScreen("major_detail");
                          }}
                          className="text-left"
                        >
                          <div className="text-sm font-semibold">{m}</div>
                          <div className="text-xs text-slate-500">{c?.title || ""}</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSaveMajor(m, cid)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <Separator className="my-4" />

            <div className="text-sm font-semibold">Saved schools</div>
            <div className="mt-2 grid gap-2">
              {Array.from(favorites.schools.values()).length === 0 ? (
                <div className="text-sm text-slate-600">No saved schools yet.</div>
              ) : (
                Array.from(favorites.schools.values()).map((s) => (
                  <div key={s.key} className="rounded-xl border border-slate-200 bg-white px-3 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold">{s.name}</div>
                        <div className="text-xs text-slate-600">{s.city ? `${s.city}, ` : ""}{s.state || ""}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSaveSchool(s)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-2 flex flex-col gap-1">
                      {s.urlSite ? (
                        <a
                          href={s.urlSite?.startsWith("http") ? s.urlSite : `https://${s.urlSite}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-xs text-blue-600 underline hover:text-blue-700"
                        >
                          Visit school website
                        </a>
                      ) : null}
                      <a
                        href={`https://collegescorecard.ed.gov/search/?search=${encodeURIComponent(s.name || "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-xs text-slate-600 underline hover:text-slate-800"
                      >
                        View programs on College Scorecard
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 grid gap-2">
              <Button variant="outline" className="w-full rounded-xl" onClick={clearFavorites}>
                Clear saved items
              </Button>
              <Button className="w-full rounded-xl" variant="ghost" onClick={() => setScreen(lastClusterId ? "explore_cluster" : "clusters")}>
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </Shell>
    );
  }

  if (fatalError) {
    return (
      <Shell onRestart={resetAll}>
        <Title title="Something went wrong" subtitle="Your progress may have been interrupted. Here are diagnostics you can share." />
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 whitespace-pre-wrap">{fatalError}</div>
            <div className="mt-3 text-xs text-slate-500">
              Tip: If this happened right after an “Allow network access” prompt, the preview environment may have refreshed. Your state is now saved locally and should restore.
            </div>
            <div className="mt-4 grid gap-2">
              <Button className="w-full rounded-xl" onClick={() => setFatalError(null)}>
                Try to continue
              </Button>
              <Button className="w-full rounded-xl" variant="outline" onClick={resetAll}>
                Restart
              </Button>
            </div>
          </CardContent>
        </Card>
      </Shell>
    );
  }

  if (screen === "welcome") return <Welcome onStart={startPass1} onRestart={resetAll} onOpenSaved={openSaved} savedCount={savedCount} />;

  if (screen === "pass1")
    return (
      <Pass1
        onRestart={resetAll}
        onOpenSaved={openSaved}
        savedCount={savedCount}
        answers={p1Answers}
        setAnswer={setAnswer}
        index={p1Index}
        setIndex={setP1Index}
        onFinish={finishPass1}
      />
    );

  if (screen === "pass1_results")
    return (
      <Pass1Results
        onRestart={resetAll}
        onOpenSaved={openSaved}
        savedCount={savedCount}
        answers={p1Answers}
        selected={selectedDomains}
        setSelected={setSelectedDomains}
        onContinue={continueToPass2}
      />
    );

  if (screen === "pass2") {
    const domainId = p2Order[p2Index];
    return (
      <Pass2Module
        onRestart={resetAll}
        onOpenSaved={openSaved}
        savedCount={savedCount}
        domainId={domainId}
        value={p2Answers[domainId]}
        setValue={(val) => setP2Value(domainId, val)}
        stepIndex={p2Index}
        stepTotal={p2Order.length}
        onBack={() => {
          if (p2Index === 0) setScreen("pass1_results");
          else setP2Index(p2Index - 1);
        }}
        onNext={() => {
          if (p2Index === p2Order.length - 1) finishPass2();
          else setP2Index(p2Index + 1);
        }}
      />
    );
  }

  if (screen === "clusters")
    return (
      <ClustersSummary
        onRestart={resetAll}
        onOpenSaved={openSaved}
        savedCount={savedCount}
        surfaced={surfacedClusters}
        meta={clusterMeta}
        onExploreCluster={openExploreCluster}
        comparisons={comparisons}
        onOpenComparison={openComparison}
        onComparePicker={goComparePicker}
      />
    );

  if (screen === "compare")
    return (
      <ComparisonView
        onRestart={resetAll}
        onOpenSaved={openSaved}
        savedCount={savedCount}
        aId={comparePair?.a}
        bId={comparePair?.b}
        onExploreA={() => openExploreCluster(comparePair?.a)}
        onExploreB={() => openExploreCluster(comparePair?.b)}
        onBack={resetToClusters}
      />
    );

  if (screen === "explore_cluster")
    return (
      <ExploreCluster
        onRestart={resetAll}
        onOpenSaved={openSaved}
        savedCount={savedCount}
        isSavedCluster={isSavedCluster}
        toggleSaveCluster={toggleSaveCluster}
        clusterId={activeCluster}
        onBack={resetToClusters}
        onCompareFromHere={goComparePicker}
        onExploreMajor={openMajorDetail}
      />
    );

  if (screen === "major_detail") {
    const c = clusters.find((x) => x.id === activeMajor?.clusterId);
    return (
      <MajorDetail
        onRestart={resetAll}
        onOpenSaved={openSaved}
        savedCount={savedCount}
        isSavedMajor={isSavedMajor}
        toggleSaveMajor={toggleSaveMajor}
        majorName={activeMajor?.name}
        clusterId={activeMajor?.clusterId}
        clusterTitle={c?.title || "this cluster"}
        onExploreSchools={openSchools}
        onBack={() => setScreen("explore_cluster")}
      />
    );
  }

  if (screen === "schools") {
    return (
      <SchoolsView
        onRestart={resetAll}
        onOpenSaved={openSaved}
        savedCount={savedCount}
        isSavedSchool={isSavedSchool}
        toggleSaveSchool={toggleSaveSchool}
        majorName={activeSchoolsMajor?.name}
        clusterId={activeSchoolsMajor?.clusterId}
        clusterTitle={clusters.find((c) => c.id === activeSchoolsMajor?.clusterId)?.title || "this area"}
        onBack={() => setScreen("major_detail")}
      />
    );
  }

  if (screen === "compare_picker")
    return (
      <ComparePicker
        onRestart={resetAll}
        onOpenSaved={openSaved}
        savedCount={savedCount}
        surfaced={surfacedClusters}
        onPick={(a, b) => openComparison(a, b)}
        onBack={() => {
          // Prefer returning to where user came from
          if (activeCluster) setScreen("explore_cluster");
          else setScreen("clusters");
        }}
      />
    );

  return <Welcome onStart={startPass1} />;
}



