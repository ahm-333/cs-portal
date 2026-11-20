"use client";

import React, { useCallback, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, FileText, Terminal } from "lucide-react";
import "katex/dist/katex.min.css";

interface MarkdownViewerProps {
  content: string | null;
}

const LANGUAGE_LABELS: Record<string, string> = {
  cpp: "C++",
  "c++": "C++",
  cc: "C++",
  c: "C",
  py: "Python",
  python: "Python",
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  jsx: "JSX",
  java: "Java",
  cs: "C#",
  csharp: "C#",
  sql: "SQL",
  bash: "Bash",
  sh: "Shell",
  shell: "Shell",
  json: "JSON",
  html: "HTML",
  css: "CSS",
  asm: "Assembly",
  rust: "Rust",
  go: "Go",
  text: "Code",
  plaintext: "Code",
};

function formatLanguageLabel(lang: string): string {
  const key = lang.toLowerCase();
  return LANGUAGE_LABELS[key] ?? lang.toUpperCase();
}

function normalizePrismLanguage(lang: string): string {
  const key = lang.toLowerCase();
  if (key === "c++") return "cpp";
  if (key === "py") return "python";
  if (key === "js") return "javascript";
  if (key === "ts") return "typescript";
  if (key === "sh" || key === "shell") return "bash";
  if (key === "cs") return "csharp";
  return key || "text";
}

function extractTextContent(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractTextContent).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return extractTextContent(node.props.children);
  }
  return "";
}

interface CodeBlockProps {
  code: string;
  language: string;
}

function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for restricted clipboard contexts
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  const lineCount = code.split("\n").length;
  const displayLang = formatLanguageLabel(language);
  const prismLang = normalizePrismLanguage(language);

  return (
    <div
      dir="ltr"
      className="my-5 overflow-hidden rounded-xl border border-slate-800 bg-[#14171f] shadow-lg shadow-black/30"
    >
      <div className="flex items-center justify-between border-b border-slate-800/90 bg-slate-900/95 px-4 py-2">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-300">
          <Terminal className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-mono">{displayLang}</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          dir="rtl"
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
            copied
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
              : "border-slate-700 bg-slate-800/80 text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-500/15 hover:text-indigo-200"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>تم النسخ ✓</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>نسخ الكود</span>
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={prismLang}
          style={vscDarkPlus}
          showLineNumbers={lineCount > 2}
          lineNumberStyle={{
            minWidth: "2.4em",
            paddingRight: "1em",
            color: "#475569",
            userSelect: "none",
          }}
          customStyle={{
            margin: 0,
            padding: "1rem 1.25rem",
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.65",
            fontFamily:
              "var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
          codeTagProps={{
            style: {
              fontFamily: "inherit",
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

const markdownComponents: Components = {
  h1({ children }) {
    return (
      <h1 className="mb-4 mt-2 border-b border-slate-800 pb-3 text-2xl font-extrabold tracking-tight text-slate-50 sm:text-3xl">
        {children}
      </h1>
    );
  },
  h2({ children }) {
    return (
      <h2 className="mb-3 mt-8 flex items-center gap-2 border-b border-slate-800/80 pb-2 text-xl font-bold text-slate-100 sm:text-2xl">
        <span
          aria-hidden="true"
          className="h-5 w-1 rounded-full bg-indigo-500"
        />
        <span>{children}</span>
      </h2>
    );
  },
  h3({ children }) {
    return (
      <h3 className="mb-2.5 mt-6 text-lg font-bold text-slate-100">
        {children}
      </h3>
    );
  },
  h4({ children }) {
    return (
      <h4 className="mb-2 mt-4 text-base font-bold text-slate-200">
        {children}
      </h4>
    );
  },
  p({ children }) {
    return (
      <p className="my-3.5 text-[15px] leading-8 text-slate-300 sm:text-base">
        {children}
      </p>
    );
  },
  ul({ children }) {
    return (
      <ul className="my-3.5 list-disc space-y-2 ps-6 text-[15px] leading-7 text-slate-300 marker:text-indigo-400 sm:text-base">
        {children}
      </ul>
    );
  },
  ol({ children }) {
    return (
      <ol className="my-3.5 list-decimal space-y-2 ps-6 text-[15px] leading-7 text-slate-300 marker:font-semibold marker:text-indigo-400 sm:text-base">
        {children}
      </ol>
    );
  },
  li({ children }) {
    return <li className="leading-relaxed">{children}</li>;
  },
  strong({ children }) {
    return <strong className="font-bold text-slate-100">{children}</strong>;
  },
  em({ children }) {
    return <em className="italic text-indigo-200">{children}</em>;
  },
  blockquote({ children }) {
    return (
      <blockquote className="my-5 rounded-e-xl border-s-4 border-indigo-500 bg-indigo-500/10 px-4 py-3 text-slate-200 [&>p]:my-1.5">
        {children}
      </blockquote>
    );
  },
  hr() {
    return <hr className="my-7 border-slate-800" />;
  },
  a({ href, children }) {
    const isExternal = href ? /^https?:\/\//i.test(href) : false;
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="font-medium text-indigo-400 underline decoration-indigo-500/40 underline-offset-4 transition-colors hover:text-indigo-300 hover:decoration-indigo-400"
      >
        {children}
      </a>
    );
  },
  table({ children }) {
    return (
      <div className="my-5 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
        <table className="w-full border-collapse text-start text-sm">
          {children}
        </table>
      </div>
    );
  },
  thead({ children }) {
    return (
      <thead className="border-b border-slate-800 bg-slate-900/90 text-xs font-bold text-slate-200">
        {children}
      </thead>
    );
  },
  tbody({ children }) {
    return <tbody className="divide-y divide-slate-800/80">{children}</tbody>;
  },
  tr({ children }) {
    return (
      <tr className="transition-colors hover:bg-slate-900/60">{children}</tr>
    );
  },
  th({ children }) {
    return (
      <th className="whitespace-nowrap px-4 py-3 text-start font-bold text-slate-100">
        {children}
      </th>
    );
  },
  td({ children }) {
    return <td className="px-4 py-3 text-slate-300">{children}</td>;
  },
  pre({ children }) {
    if (
      React.isValidElement<{ className?: string; children?: React.ReactNode }>(
        children
      )
    ) {
      const codeClassName = children.props.className ?? "";
      const match = /language-([\w#+-]+)/.exec(codeClassName);
      const language = match ? match[1] : "text";
      const rawCode = extractTextContent(children.props.children).replace(
        /\n$/,
        ""
      );
      return <CodeBlock code={rawCode} language={language} />;
    }

    return (
      <pre
        dir="ltr"
        className="my-5 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-sm text-slate-200"
      >
        {children}
      </pre>
    );
  },
  code({ children, className }) {
    return (
      <code
        dir="ltr"
        className={`inline-block rounded-md border border-slate-800 bg-slate-900 px-1.5 py-0.5 align-baseline font-mono text-[0.85em] text-indigo-300 ${
          className ?? ""
        }`}
      >
        {children}
      </code>
    );
  },
};

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  if (!content || !content.trim()) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-14 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-500">
          <FileText className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-200">
          لا يوجد ملخص مكتوب لهذا الدرس بعد
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-400">
          يمكنك متابعة شرح الفيديو أو تجربة المعمل التفاعلي والكويز.
        </p>
      </div>
    );
  }

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-8 [&_.katex-display]:my-4 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:rounded-xl [&_.katex-display]:border [&_.katex-display]:border-slate-800/80 [&_.katex-display]:bg-slate-950/80 [&_.katex-display]:px-4 [&_.katex-display]:py-3 [&_.katex-display]:text-slate-100 [&_.katex-display]:[direction:ltr] [&_.katex-display]:[unicode-bidi:isolate] [&_.katex]:text-slate-100 [&_.katex]:[direction:ltr] [&_.katex]:[unicode-bidi:isolate]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
