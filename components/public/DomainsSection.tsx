import React from "react";
import { Layers, Cpu, Sparkles, Brain, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const domains = [
  {
    title: "Full Stack Development",
    tagline: "End-to-End Modern Web Engineering",
    description:
      "Crafting scalable, responsive web systems using Next.js, React, Node.js, and TypeScript with robust relational and vector databases.",
    icon: Layers,
    skills: ["Next.js", "React", "TypeScript", "Node.js", "REST APIs", "Tailwind CSS"],
    link: "/skills",
  },
  {
    title: "AI Engineering",
    tagline: "Applied Intelligence & Machine Learning",
    description:
      "Training, fine-tuning, and production deployment of machine learning algorithms, deep neural networks, and computer vision pipelines.",
    icon: Brain,
    skills: ["PyTorch", "TensorFlow", "Scikit-learn", "Classification", "Time-Series", "FastAPI"],
    link: "/skills",
  },
  {
    title: "Generative AI",
    tagline: "LLMs, Multimodal & Reasoning Agents",
    description:
      "Architecting state-of-the-art Retrieval-Augmented Generation (RAG), prompt systems, and multimodal chatbots with voice & vision.",
    icon: Sparkles,
    skills: ["LLMs", "RAG Pipelines", "LangChain", "GPT-4o mini", "Prompt Engineering"],
    link: "/projects",
  },
  {
    title: "Vector Search & Retrieval",
    tagline: "High-Throughput Semantic Information Retrieval",
    description:
      "Evaluating embedding representations (Cohere, Voyage) and benchmarking FAISS vs PostgreSQL PGVector for low-latency similarity search.",
    icon: Cpu,
    skills: ["PGVector", "FAISS", "Cohere", "Voyage AI", "Hybrid Search", "HNSW"],
    link: "/projects/calquity",
  },
];

export default function DomainsSection() {
  return (
    <section className="py-16 md:py-24 border-y border-neutral-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono font-medium mb-3">
              CORE SPECIALIZATIONS
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900">
              Technical Focus Areas
            </h2>
          </div>
          <p className="mt-3 md:mt-0 text-sm text-neutral-500 max-w-md">
            Bridging theoretical artificial intelligence and enterprise-grade full stack
            software architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.map((domain) => {
            const Icon = domain.icon;
            return (
              <div
                key={domain.title}
                className="group relative p-6 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 tracking-tight mb-1">
                    {domain.title}
                  </h3>
                  <p className="text-[11px] font-mono text-blue-600 mb-3">
                    {domain.tagline}
                  </p>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                    {domain.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {domain.skills.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-200/60 text-neutral-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={domain.link}
                    className="inline-flex items-center gap-1 text-xs font-medium text-neutral-900 group-hover:text-blue-600 transition-colors"
                  >
                    <span>Learn more</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
