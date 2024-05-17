export type Project = {
    id: number;
    title: string;
    description?: string;
    goal: number;
    current: number;
};

export const data: Project[] = [
    {
        id: 1,
        title: "Developing open-source software for educational purposes",
        description:
            "This project aims to create free, open-source software tools to enhance educational experiences for students and teachers worldwide.",
        goal: 20000,
        current: 5500
    },
    {
        id: 2,
        title: "Creating a low-cost, sustainable tech solution for clean water access in developing countries",
        description:
            "This initiative focuses on designing and implementing affordable technology solutions to provide clean and safe water access in underserved communities, ultimately improving health and sanitation standards.",
        goal: 50000,
        current: 12750
    },
    {
        id: 3,
        title: "Funding research for renewable energy technology",
        description:
            "This project seeks to advance research in renewable energy technologies such as solar, wind, and hydroelectric power, with the goal of accelerating the transition to a sustainable and environmentally friendly energy future.",
        goal: 100000,
        current: 30200
    },
    {
        id: 4,
        title: "Supporting the development of affordable prosthetic limbs using 3D printing technology",
        description:
            "This endeavor aims to utilize 3D printing technology to create customizable and cost-effective prosthetic limbs, providing mobility and independence to individuals with limb differences.",
        goal: 75000,
        current: 18500
    },
    {
        id: 5,
        title: "Building a community tech center in underserved areas",
        description:
            "This initiative aims to establish a community technology center equipped with computers, internet access, and tech resources, empowering residents of underserved areas to develop digital literacy skills and access educational opportunities.",
        goal: 30000,
        current: 8900
    },
    {
        id: 6,
        title: "Providing coding bootcamp scholarships for underrepresented groups in tech",
        description:
            "This project aims to bridge the diversity gap in the tech industry by offering scholarships to individuals from underrepresented groups to attend coding bootcamps, providing them with the skills and opportunities to pursue careers in technology.",
        goal: 40000,
        current: 10300
    },
    {
        id: 7,
        title: "Creating accessible and inclusive tech solutions for people with disabilities",
        description:
            "This initiative focuses on developing inclusive technology solutions, such as assistive devices and accessible software applications, to empower individuals with disabilities and enhance their participation in various aspects of life.",
        goal: 60000,
        current: 15800
    },
    {
        id: 8,
        title: "Developing AI-powered tools for mental health support",
        description:
            "This project aims to harness the power of artificial intelligence to develop innovative tools and platforms for mental health support, providing accessible and personalized resources to individuals seeking assistance with their mental well-being.",
        goal: 80000,
        current: 25600
    },
    {
        id: 9,
        title: "Building a tech platform connecting small farmers with markets for their produce",
        description:
            "This endeavor seeks to create a digital platform that connects small-scale farmers with markets and consumers, facilitating efficient and transparent transactions while empowering farmers to reach broader markets for their produce.",
        goal: 25000,
        current: 6700
    },
    {
        id: 10,
        title: "Developing blockchain-based solutions for supply chain transparency in the food industry",
        description:
            "This project aims to leverage blockchain technology to enhance transparency and traceability in the food supply chain, ensuring food safety, reducing fraud, and building trust between consumers and producers.",
        goal: 70000,
        current: 20400
    }
];
