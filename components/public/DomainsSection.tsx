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
    <section className="py-16 md:py-24 border-y border-amber-500/20 bg-[#071324] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400 text-amber-300 text-xs font-mono font-bold tracking-wide mb-3">
              CORE SPECIALIZATIONS
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Technical Focus Areas
            </h2>
          </div>
          <p className="mt-3 md:mt-0 text-sm text-slate-300 max-w-md">
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
                className="group relative p-6 rounded-2xl border border-amber-500/30 bg-[#0d1f38] hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#071324] border border-amber-400 text-amber-400 flex items-center justify-center mb-5 group-hover:bg-amber-400 group-hover:text-[#071324] transition-all duration-200 shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight mb-1">
                    {domain.title}
                  </h3>
                  <p className="text-[11px] font-mono text-amber-300 mb-3">
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
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#071324] text-amber-300 border border-amber-500/30"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={domain.link}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:text-amber-300 transition-colors"
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
