import {
  HomepageSettings,
  AboutContent,
  SkillCategory,
  Skill,
  Project,
  ExperienceEntry,
  Certification,
  ContactMessage,
  AppearanceSettings,
  SeoSettings,
  WebsiteSettings,
  FooterSettings,
} from "@/types/portfolio";

export const initialHomepageSettings: HomepageSettings = {
  id: "default-homepage",
  name: "Noorul Hassan",
  designation: "Full Stack Developer | AI Engineer",
  hero_intro: "HELLO, I'M NOORUL HASSAN",
  hero_heading: "Building Intelligent Products & Digital Experiences.",
  description:
    "I'm passionate about developing modern web applications and intelligent AI-powered solutions that solve real-world problems.",
  profile_photo_url: "/profile.png",
  profile_photo_position: { x: 50, y: 50, scale: 1 },
  button_explore_label: "Explore My Work",
  button_explore_link: "/projects",
  button_about_label: "About Me",
  button_about_link: "/about",
  button_resume_label: "Download Resume",
  resume_url: "/resume.pdf",
  resume_enabled: true,
  social_github: "https://github.com",
  social_linkedin: "https://linkedin.com",
  social_email: "noorulhassan.ai@gmail.com",
  featured_tags: [
    "Full Stack Development",
    "AI Engineering",
    "Generative AI",
    "Machine Learning",
  ],
  featured_project_ids: ["calquity", "rag-chatbot-voice-emotion", "heart-disease-prediction"],
  sections_enabled: {
    hero: true,
    domains: true,
    featured_projects: true,
    quick_contact: true,
  },
};

export const initialAboutContent: AboutContent = {
  id: "default-about",
  full_name: "Noorul Hassan",
  header_title: "Bridging Artificial Intelligence with Modern Web Architecture.",
  header_description:
    "Discover my background, education, and technical expertise in building scalable software systems and applied AI.",
  photo_url: "/profile.png",
  bio_paragraphs: [
    "I'm a Full Stack Developer and AI Engineer passionate about building scalable applications, intelligent systems and innovative digital experiences using modern web technologies and artificial intelligence.",
    "With a strong foundation in Artificial Intelligence and Data Science, I bridge the gap between machine learning research and production web engineering. I design end-to-end architectures that integrate cutting-edge LLMs, retrieval-augmented generation pipelines, and high-performance vector stores with clean, responsive user interfaces.",
    "My focus centers on delivering resilient backend services, intuitive frontend interfaces, and applied AI systems that solve genuine problems with measurable impact.",
  ],
  education: [
    {
      id: "edu-crescent",
      degree: "B.Tech in Artificial Intelligence and Data Science",
      field: "Artificial Intelligence and Data Science",
      institution: "B.S. Abdur Rahman Crescent Institute of Science and Technology",
      start_year: "2021",
      end_year: "2025",
      grade: "First Class with Distinction",
      description:
        "Comprehensive curriculum emphasizing deep learning, neural networks, machine learning algorithms, database architecture, distributed systems, and modern software engineering.",
      highlights: [
        "Specialized in deep learning architectures and vector information retrieval",
        "Conducted research comparing multi-provider embedding models and hybrid PGVector retrieval",
        "Lead technical projects combining full-stack web platforms with conversational AI models",
      ],
    },
  ],
  technical_interests: [
    "Full Stack Development",
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Generative AI",
    "Large Language Models",
    "Retrieval-Augmented Generation",
    "Backend Engineering",
    "Modern Web Applications",
  ],
  development_philosophy:
    "I believe software should be purposeful, scalable, and meticulously crafted. Code should be clean and maintainable, architecture should anticipate real-world constraints, and AI should augment human capability with transparency, precision, and speed.",
  career_objectives:
    "To architect and deploy cutting-edge AI-native applications and robust full-stack platforms that drive meaningful business transformation and delightful user experiences on a global scale.",
  areas_of_specialization: [
    {
      title: "Full Stack Architecture",
      description:
        "Designing modular, high-throughput web applications using Next.js, React, Node.js, and relational database systems.",
      icon: "Layers",
    },
    {
      title: "Generative AI & LLM Systems",
      description:
        "Developing RAG pipelines, prompt architectures, vector embeddings, and multi-modal conversational agents.",
      icon: "Cpu",
    },
    {
      title: "Machine Learning Engineering",
      description:
        "Training, evaluating, and serving predictive ML models (Random Forests, LSTMs, CNNs) with low latency.",
      icon: "Binary",
    },
    {
      title: "Vector Search & Retrieval",
      description:
        "Implementing hybrid semantic search with FAISS, PGVector, and top-tier embedding benchmarks.",
      icon: "Database",
    },
  ],
  additional_photos: [],
};

export const initialSkillCategories: SkillCategory[] = [
  { id: "cat-frontend", name: "Frontend", slug: "frontend", sort_order: 1 },
  { id: "cat-backend", name: "Backend", slug: "backend", sort_order: 2 },
  { id: "cat-ai-ml", name: "AI and Machine Learning", slug: "ai-ml", sort_order: 3 },
  { id: "cat-database", name: "Database", slug: "database", sort_order: 4 },
  { id: "cat-tools", name: "Tools", slug: "tools", sort_order: 5 },
];

export const initialSkills: Skill[] = [
  // Frontend
  { id: "s1", name: "HTML", category_id: "cat-frontend", category_name: "Frontend", icon: "Code", sort_order: 1, is_active: true },
  { id: "s2", name: "CSS", category_id: "cat-frontend", category_name: "Frontend", icon: "Palette", sort_order: 2, is_active: true },
  { id: "s3", name: "JavaScript", category_id: "cat-frontend", category_name: "Frontend", icon: "FileCode", sort_order: 3, is_active: true },
  { id: "s4", name: "TypeScript", category_id: "cat-frontend", category_name: "Frontend", icon: "FileType", sort_order: 4, is_active: true },
  { id: "s5", name: "React", category_id: "cat-frontend", category_name: "Frontend", icon: "Atom", sort_order: 5, is_active: true },
  { id: "s6", name: "Next.js", category_id: "cat-frontend", category_name: "Frontend", icon: "Globe", sort_order: 6, is_active: true },
  { id: "s7", name: "Tailwind CSS", category_id: "cat-frontend", category_name: "Frontend", icon: "Sparkles", sort_order: 7, is_active: true },

  // Backend
  { id: "s8", name: "Python", category_id: "cat-backend", category_name: "Backend", icon: "Terminal", sort_order: 1, is_active: true },
  { id: "s9", name: "Node.js", category_id: "cat-backend", category_name: "Backend", icon: "Server", sort_order: 2, is_active: true },
  { id: "s10", name: "FastAPI", category_id: "cat-backend", category_name: "Backend", icon: "Zap", sort_order: 3, is_active: true },
  { id: "s11", name: "REST APIs", category_id: "cat-backend", category_name: "Backend", icon: "Network", sort_order: 4, is_active: true },
  { id: "s12", name: "SQL", category_id: "cat-backend", category_name: "Backend", icon: "Database", sort_order: 5, is_active: true },

  // AI and Machine Learning
  { id: "s13", name: "Machine Learning", category_id: "cat-ai-ml", category_name: "AI and Machine Learning", icon: "Brain", sort_order: 1, is_active: true },
  { id: "s14", name: "Deep Learning", category_id: "cat-ai-ml", category_name: "AI and Machine Learning", icon: "Cpu", sort_order: 2, is_active: true },
  { id: "s15", name: "NLP", category_id: "cat-ai-ml", category_name: "AI and Machine Learning", icon: "MessageSquare", sort_order: 3, is_active: true },
  { id: "s16", name: "Generative AI", category_id: "cat-ai-ml", category_name: "AI and Machine Learning", icon: "Sparkles", sort_order: 4, is_active: true },
  { id: "s17", name: "LLMs", category_id: "cat-ai-ml", category_name: "AI and Machine Learning", icon: "Bot", sort_order: 5, is_active: true },
  { id: "s18", name: "RAG", category_id: "cat-ai-ml", category_name: "AI and Machine Learning", icon: "Workflow", sort_order: 6, is_active: true },
  { id: "s19", name: "Prompt Engineering", category_id: "cat-ai-ml", category_name: "AI and Machine Learning", icon: "Sliders", sort_order: 7, is_active: true },
  { id: "s20", name: "LangChain", category_id: "cat-ai-ml", category_name: "AI and Machine Learning", icon: "Link", sort_order: 8, is_active: true },
  { id: "s21", name: "TensorFlow", category_id: "cat-ai-ml", category_name: "AI and Machine Learning", icon: "Flame", sort_order: 9, is_active: true },
  { id: "s22", name: "PyTorch", category_id: "cat-ai-ml", category_name: "AI and Machine Learning", icon: "FlameKindling", sort_order: 10, is_active: true },
  { id: "s23", name: "Scikit-learn", category_id: "cat-ai-ml", category_name: "AI and Machine Learning", icon: "Activity", sort_order: 11, is_active: true },

  // Database
  { id: "s24", name: "PostgreSQL", category_id: "cat-database", category_name: "Database", icon: "Database", sort_order: 1, is_active: true },
  { id: "s25", name: "Supabase", category_id: "cat-database", category_name: "Database", icon: "ShieldCheck", sort_order: 2, is_active: true },
  { id: "s26", name: "FAISS", category_id: "cat-database", category_name: "Database", icon: "Search", sort_order: 3, is_active: true },
  { id: "s27", name: "Vector Databases", category_id: "cat-database", category_name: "Database", icon: "Layers", sort_order: 4, is_active: true },

  // Tools
  { id: "s28", name: "Git", category_id: "cat-tools", category_name: "Tools", icon: "GitBranch", sort_order: 1, is_active: true },
  { id: "s29", name: "GitHub", category_id: "cat-tools", category_name: "Tools", icon: "GitCommit", sort_order: 2, is_active: true },
  { id: "s30", name: "Docker", category_id: "cat-tools", category_name: "Tools", icon: "Box", sort_order: 3, is_active: true },
  { id: "s31", name: "Vercel", category_id: "cat-tools", category_name: "Tools", icon: "Cloud", sort_order: 4, is_active: true },
  { id: "s32", name: "Hugging Face", category_id: "cat-tools", category_name: "Tools", icon: "Smile", sort_order: 5, is_active: true },
  { id: "s33", name: "VS Code", category_id: "cat-tools", category_name: "Tools", icon: "Code2", sort_order: 6, is_active: true },
];

export const initialProjects: Project[] = [
  {
    id: "calquity",
    title: "CalQuity",
    slug: "calquity",
    category: "AI/ML",
    short_description:
      "Embedding model evaluation and comparison framework involving Cohere, Voyage, FAISS and Supabase PGVector hybrid retrieval.",
    full_description:
      "CalQuity is an advanced benchmarking and retrieval evaluation system designed to systematically analyze and compare state-of-the-art embedding models across heterogeneous domain datasets. The system benchmarks Cohere and Voyage embedding representations against high-dimensional dense vector search in FAISS and hybrid sparse/dense PostgreSQL PGVector retrieval pipelines.",
    technologies: [
      "Python",
      "Cohere Embeddings",
      "Voyage AI",
      "FAISS",
      "Supabase PGVector",
      "PostgreSQL",
      "FastAPI",
      "Next.js",
      "TypeScript",
    ],
    thumbnail_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    ],
    architecture_diagram_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    architecture_notes:
      "Bi-encoder embedding extraction feeds parallel indexing workers into local FAISS IVF indices and remote Supabase PGVector tables with HNSW cosine distance indexing, evaluated via Reciprocal Rank Fusion (RRF).",
    github_url: "https://github.com/noorulhassan/calquity",
    live_demo_url: "https://calquity-demo.vercel.app",
    problem_statement:
      "Selecting an optimal embedding model and vector indexing strategy is frequently hindered by lack of empirical multi-provider benchmarks on domain-specific retrieval datasets, leading to sub-optimal RAG performance and excessive compute costs.",
    solution:
      "CalQuity creates an automated evaluation harness that runs identical query-document corpora through Cohere and Voyage embeddings, evaluates FAISS indexing latency vs PGVector accuracy, and generates granular MRR@K, NDCG@10, and latency trade-off graphs.",
    key_features: [
      "Multi-provider embedding generation (Cohere Embed v3 vs Voyage AI)",
      "FAISS vs PGVector indexing benchmarks (latency, memory footprint, recall)",
      "Hybrid retrieval fusing BM25 sparse lexical search with dense vector similarity",
      "Interactive analytics dashboard visualizing recall curves and precision metrics",
      "Configurable chunking strategies and overlap parameters",
    ],
    technical_implementation:
      "Engineered in Python with asynchronous FastAPI pipelines. Utilized FAISS IndexIVFFlat for GPU/CPU acceleration alongside Supabase PostgreSQL running the pgvector extension with HNSW indexing. Created Next.js dashboard with interactive visualizations.",
    challenges_solutions: [
      {
        challenge: "High memory consumption during dense indexing of 500k+ vector corpora.",
        solution: "Implemented batching queues and quantized index formats (IVF-PQ) to reduce RAM overhead by 68% without significant recall degradation.",
      },
      {
        challenge: "Discrepancies in dimensionality between Cohere (1024) and Voyage (1536) models.",
        solution: "Standardized metric evaluation via normalized cosine similarity and decoupled dimensional constraints in the benchmark scoring harness.",
      },
    ],
    results_metrics: [
      "Comprehensive evaluation of 100k+ query pairs across 4 distinct embedding paradigms",
      "Achieved sub-15ms vector retrieval query latency with optimized HNSW indexing",
      "Empirical finding: Hybrid PGVector with RRF outperformed purely dense search by 14.2% MRR@10",
    ],
    is_published: true,
    is_featured: true,
    sort_order: 1,
  },
  {
    id: "rag-chatbot-voice-emotion",
    title: "RAG Chatbot with Voice and Emotion Detection",
    slug: "rag-chatbot-voice-emotion",
    category: "AI/ML",
    short_description:
      "Document-based conversational AI application with voice interaction and emotion detection using Streamlit and GPT-4o mini.",
    full_description:
      "An intelligent multimodal conversational assistant that combines Document Retrieval-Augmented Generation (RAG) with real-time speech input and facial/vocal emotion recognition. The application dynamically adjusts its conversational tone, response brevity, and empathy levels according to the user's emotional state detected during query delivery.",
    technologies: [
      "Python",
      "Streamlit",
      "GPT-4o mini",
      "LangChain",
      "SpeechRecognition",
      "OpenCV",
      "DeepFace",
      "ChromaDB",
      "FAISS",
    ],
    thumbnail_url: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    ],
    architecture_diagram_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    architecture_notes:
      "Multimodal pipeline streaming audio & video frames through DeepFace emotion inference while chunked documents are fetched through LangChain vector retriever into GPT-4o mini context window.",
    github_url: "https://github.com/noorulhassan/rag-voice-emotion-chatbot",
    live_demo_url: "https://rag-voice-emotion.streamlit.app",
    problem_statement:
      "Standard document chatbots are emotionally agnostic and text-only, leading to sterile interactions that fail when users are frustrated, confused, or seeking rapid spoken answers.",
    solution:
      "Integrated audio transcription with frame-level emotion detection that feeds contextual emotional metadata into the system prompt of GPT-4o mini alongside vector-retrieved document passages.",
    key_features: [
      "PDF and DOCX document ingestion with semantic chunking",
      "Real-time voice-to-text input with WebRTC audio capture",
      "Computer vision emotion classification (Neutral, Happy, Frustrated, Confused)",
      "Adaptive prompt steering adjusting tone based on emotion score",
      "Streamlit UI with audio waveform visualization and cited source passages",
    ],
    technical_implementation:
      "Built with Python and Streamlit. Employs LangChain for document splitting, embeddings, and vector store retrieval. Audio processing via SpeechRecognition and Whisper API fallback. Visual emotion detection utilizes lightweight facial landmark analysis.",
    challenges_solutions: [
      {
        challenge: "Latency accumulation between emotion inference, voice transcription, and LLM streaming.",
        solution: "Asynchronously parallelized facial frame inference and voice transcription while pre-warming the vector retrieval cache.",
      },
    ],
    results_metrics: [
      "Full multimodal pipeline latency under 1.8 seconds from voice speech end to stream start",
      "High user satisfaction rating for adaptive empathetic responses",
      "Support for multi-page PDF documents with accurate source attribution",
    ],
    is_published: true,
    is_featured: true,
    sort_order: 2,
  },
  {
    id: "heart-disease-prediction",
    title: "Heart Disease Prediction",
    slug: "heart-disease-prediction",
    category: "AI/ML",
    short_description:
      "Random Forest machine learning classification project with a Streamlit interface and reported accuracy of 98%.",
    full_description:
      "A clinical machine learning decision-support system that predicts the likelihood of coronary heart disease based on patient physiological indicators. The project leverages an optimized Random Forest Classifier trained on cleaned medical datasets with comprehensive feature engineering, achieving 98% test accuracy.",
    technologies: [
      "Python",
      "Scikit-learn",
      "Random Forest",
      "Pandas",
      "NumPy",
      "Streamlit",
      "Matplotlib",
      "Seaborn",
    ],
    thumbnail_url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    ],
    architecture_diagram_url: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80",
    architecture_notes:
      "Raw medical inputs undergo min-max normalization and categorical one-hot encoding, passed into an ensemble of 150 estimator decision trees with SHAP feature contribution breakdowns.",
    github_url: "https://github.com/noorulhassan/heart-disease-prediction",
    live_demo_url: "https://heart-disease-predictor.streamlit.app",
    problem_statement:
      "Early diagnosis of cardiovascular diseases is critical for timely medical intervention, but manual risk factor correlation by clinicians can be time-consuming and vulnerable to edge cases.",
    solution:
      "Constructed a high-accuracy, interpretable predictive model using Random Forest with interactive parameter sliders for blood pressure, cholesterol, ECG results, and heart rate.",
    key_features: [
      "Interactive Streamlit web portal for doctors and patients",
      "98% reported classification accuracy on held-out validation sets",
      "Feature importance charts demonstrating decisive physiological contributors",
      "Confidence intervals and risk category stratifications",
      "Instant risk report generation with preventative lifestyle guidelines",
    ],
    technical_implementation:
      "Trained on Scikit-learn with rigorous K-fold cross-validation, hyperparameter tuning via GridSearchCV, and data preprocessing with Pandas and NumPy. Deployed via Streamlit Cloud.",
    challenges_solutions: [
      {
        challenge: "Class imbalance in patient record categories causing false negative bias.",
        solution: "Applied SMOTE (Synthetic Minority Over-sampling Technique) to balance classes, driving recall on high-risk patients to 97.4%.",
      },
    ],
    results_metrics: [
      "98% reported test set classification accuracy",
      "0.98 ROC-AUC score across clinical validation sets",
      "Real-time inference in less than 50 milliseconds",
    ],
    is_published: true,
    is_featured: true,
    sort_order: 3,
  },
  {
    id: "stock-price-prediction",
    title: "Stock Price Prediction",
    slug: "stock-price-prediction",
    category: "AI/ML",
    short_description:
      "LSTM-based deep learning project for sequence forecasting and financial time series analysis.",
    full_description:
      "A deep learning time-series forecasting model built on Long Short-Term Memory (LSTM) recurrent neural network architectures. The model captures non-linear temporal dependencies across historical equity prices, trading volume, and moving averages to forecast short-term market trends.",
    technologies: [
      "Python",
      "TensorFlow",
      "Keras",
      "LSTM",
      "yfinance",
      "Pandas",
      "Matplotlib",
      "Plotly",
    ],
    thumbnail_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    ],
    architecture_notes:
      "Stacked 2-layer LSTM with Dropout regularization (0.2) and dense linear output, trained on 60-day sliding lookback windows normalized via MinMaxScaler.",
    github_url: "https://github.com/noorulhassan/stock-price-prediction-lstm",
    live_demo_url: "https://github.com/noorulhassan/stock-price-prediction-lstm",
    problem_statement:
      "Financial time series exhibit high volatility, regime changes, and non-linear patterns that standard linear autoregressive models (ARIMA) fail to adequately forecast.",
    solution:
      "Developed a stacked LSTM neural network capable of retaining memory over long temporal horizons, evaluating rolling prediction horizons with interactive Plotly visual charts.",
    key_features: [
      "Live data ingestion via yfinance API for global equities",
      "Sliding window time-series generation with custom lookback configurations",
      "Stacked LSTM architecture with dropout layers preventing overfitting",
      "Interactive candlestick and predicted vs actual trend charts",
      "Root Mean Squared Error (RMSE) and Mean Absolute Error (MAE) reporting",
    ],
    technical_implementation:
      "Implemented using TensorFlow and Keras. Engineered automated data fetching pipelines, sequence normalization, and multi-step ahead recursive forecasting.",
    challenges_solutions: [
      {
        challenge: "Vanishing gradient and overfitting on volatile market swings.",
        solution: "Tuned recurrent dropout rates, introduced EarlyStopping callbacks on validation loss, and normalized prices strictly within window bounds.",
      },
    ],
    results_metrics: [
      "Low RMSE on major indices across rolling 30-day forecast windows",
      "Effective directional trend prediction accuracy for equity movement",
    ],
    is_published: true,
    is_featured: false,
    sort_order: 4,
  },
  {
    id: "mnist-digit-recognition",
    title: "MNIST Digit Recognition",
    slug: "mnist-digit-recognition",
    category: "AI/ML",
    short_description:
      "Deep learning project for handwritten digit classification utilizing Convolutional Neural Networks.",
    full_description:
      "A deep learning computer vision system that classifies handwritten digits (0-9) from the classic MNIST dataset. Implements a multi-layer Convolutional Neural Network (CNN) with convolutional filters, max-pooling, batch normalization, and dropout, coupled with an interactive canvas for real-time user drawing and instant classification.",
    technologies: [
      "Python",
      "PyTorch",
      "CNN",
      "Torchvision",
      "OpenCV",
      "NumPy",
      "Streamlit",
    ],
    thumbnail_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    ],
    architecture_notes:
      "Dual Conv2D layers (32 and 64 filters with 3x3 kernels) with ReLU activations, MaxPool2D, Dropout (0.25 and 0.5), and Softmax classification heads.",
    github_url: "https://github.com/noorulhassan/mnist-digit-recognition",
    live_demo_url: "https://github.com/noorulhassan/mnist-digit-recognition",
    problem_statement:
      "Recognizing handwritten numbers with diverse handwriting styles, strokes, and varying digit thicknesses with near-human accuracy.",
    solution:
      "Trained a robust Convolutional Neural Network in PyTorch with data augmentation, achieving over 99.2% accuracy on the test dataset.",
    key_features: [
      "PyTorch CNN architecture with batch normalization and dropout",
      "Real-time interactive drawing canvas where users draw digits with mouse or touch",
      "Instant probability distribution bar chart across all 10 digit classes",
      "Data augmentation (random rotations, slight shifts) for generalization",
    ],
    technical_implementation:
      "Constructed in PyTorch, utilizing Torchvision transforms for image normalization. Deployed with an interactive frontend allowing live freehand drawing and instant model inference.",
    challenges_solutions: [
      {
        challenge: "Differences in stroke thickness between user mouse drawings and MNIST training images.",
        solution: "Applied OpenCV morphological dilation and centering transformations to normalize user-drawn inputs before passing to the tensor tensor pipeline.",
      },
    ],
    results_metrics: [
      "99.2% validation accuracy on the MNIST benchmark test set",
      "Sub-20 millisecond inference time per canvas drawing",
    ],
    is_published: true,
    is_featured: false,
    sort_order: 5,
  },
];

export const initialExperience: ExperienceEntry[] = [
  {
    id: "exp-1",
    organization: "AI Systems & Full Stack Engineering",
    designation: "AI & Full Stack Developer",
    type: "Internship",
    location: "Chennai, India",
    start_date: "2024-01-01",
    end_date: "Present",
    is_current: true,
    responsibilities: [
      "Engineered full-stack web applications integrating Next.js, Node.js, and Supabase PostgreSQL with real-time subscriptions.",
      "Developed end-to-end RAG workflows connecting LangChain, OpenAI APIs, and FAISS vector databases for document intelligence.",
      "Optimized vector search latency using HNSW indexing and hybrid search combining BM25 keyword matching with dense embeddings.",
      "Implemented secure RESTful API endpoints with JWT authentication, role-based access control, and server-side validation.",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Python", "FastAPI", "Supabase", "PostgreSQL", "LangChain"],
    sort_order: 1,
  },
  {
    id: "exp-2",
    organization: "B.S. Abdur Rahman Crescent Institute of Science and Technology",
    designation: "Machine Learning & AI Researcher",
    type: "Professional Contribution",
    location: "Chennai, India",
    start_date: "2023-06-01",
    end_date: "2023-12-31",
    is_current: false,
    responsibilities: [
      "Researched multi-provider embedding representations (Cohere, Voyage) for domain-specific retrieval benchmarks.",
      "Trained and evaluated deep neural networks for medical diagnostics and financial time-series forecasting.",
      "Authored clean technical documentation, reproducible Jupyter benchmarks, and interactive Streamlit demonstration dashboards.",
    ],
    technologies: ["Python", "PyTorch", "TensorFlow", "Scikit-learn", "FAISS", "Streamlit", "Pandas"],
    sort_order: 2,
  },
];

export const initialCertifications: Certification[] = [
  {
    id: "cert-1",
    title: "Deep Learning Specialization",
    issuing_organization: "DeepLearning.AI",
    issue_date: "2023-11-15",
    credential_id: "DL-AI-994821",
    verification_url: "https://coursera.org/verify/specialization",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    is_published: true,
    sort_order: 1,
  },
  {
    id: "cert-2",
    title: "Full Stack Web Development with React and Node.js",
    issuing_organization: "Meta / Coursera",
    issue_date: "2023-08-20",
    credential_id: "META-FS-84192",
    verification_url: "https://coursera.org/verify/specialization",
    image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    is_published: true,
    sort_order: 2,
  },
  {
    id: "cert-3",
    title: "Machine Learning with Python",
    issuing_organization: "IBM",
    issue_date: "2023-04-10",
    credential_id: "IBM-ML-77210",
    verification_url: "https://coursera.org/verify/professional-cert",
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    is_published: true,
    sort_order: 3,
  },
];

export const initialAppearanceSettings: AppearanceSettings = {
  id: "default-appearance",
  accent_color: "#2563eb",
  accent_name: "blue",
  bg_preset: "clean-white",
  font_preset: "modern-sans",
  logo_text: "Noorul Hassan",
  footer_text: "© 2026 Noorul Hassan. Designed with precision & minimal aesthetics.",
  nav_blur: true,
};

export const initialSeoSettings: SeoSettings = {
  id: "default-seo",
  global_title: "Noorul Hassan | Full Stack Developer & AI Engineer",
  global_description:
    "Portfolio of Noorul Hassan - Full Stack Developer and AI Engineer specializing in scalable web applications, LLMs, RAG architectures, and machine learning systems.",
  og_image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  site_url: "https://noorulhassan.dev",
  page_meta: {
    "/": {
      title: "Noorul Hassan | Full Stack Developer & AI Engineer",
      description: "Building Intelligent Products & Digital Experiences.",
    },
    "/about": {
      title: "About Me | Noorul Hassan",
      description: "Learn more about Noorul Hassan's background in AI & Data Science and software engineering.",
    },
    "/skills": {
      title: "Technical Skills | Noorul Hassan",
      description: "Comprehensive skills across Frontend, Backend, AI/ML, Databases, and Modern Tools.",
    },
    "/projects": {
      title: "Projects Showcase | Noorul Hassan",
      description: "Explore CalQuity, RAG Chatbot, Heart Disease Prediction, Stock Forecasting, and more.",
    },
    "/experience": {
      title: "Experience & Timeline | Noorul Hassan",
      description: "Professional journey, internships, research contributions, and technical training.",
    },
    "/certifications": {
      title: "Certifications | Noorul Hassan",
      description: "Verified certifications in Deep Learning, Full Stack Engineering, and Machine Learning.",
    },
    "/contact": {
      title: "Contact Noorul Hassan",
      description: "Get in touch for software engineering, AI collaborations, or full-stack opportunities.",
    },
  },
};

export const initialWebsiteSettings: WebsiteSettings = {
  id: "default-settings",
  site_name: "Noorul Hassan Portfolio",
  contact_email: "noorulhassan.ai@gmail.com",
  github_url: "https://github.com",
  linkedin_url: "https://linkedin.com",
  twitter_url: "https://twitter.com",
  copyright_text: "© 2026 Noorul Hassan. All rights reserved.",
  contact_form_enabled: true,
  maintenance_mode: false,
  analytics_enabled: false,
};

export const initialContactMessages: ContactMessage[] = [];

export const initialFooterSettings: FooterSettings = {
  id: "default-footer",
  brand_monogram: "NH",
  brand_name: "Noorul Hassan",
  bio_description:
    "Full Stack Developer and AI Engineer passionate about building scalable applications, intelligent systems and innovative digital experiences using modern web technologies and artificial intelligence.",
  status_text: "Available for engineering opportunities & AI collaborations",
  status_enabled: true,
  nav_title: "Navigation",
  connect_title: "Connect",
  github_url: "https://github.com",
  linkedin_url: "https://linkedin.com",
  email: "noorulhassan.ai@gmail.com",
  bottom_left_text: "Noorul Hassan • Full Stack Developer & AI Engineer",
  cta_text: "Get in Touch",
  cta_link: "/contact",
};
