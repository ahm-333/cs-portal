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
      className="my-5 overflow-hidden rounded-xl border border-[var(--code-border)] bg-[var(--code-bg)] text-[#f2f1fc] shadow-[var(--shadow-pill)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--code-border)] bg-[var(--code-header)] px-4 py-2">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#d5d8f0]">
          <Terminal className="h-3.5 w-3.5 text-[#a5b4fc]" />
          <span className="font-mono">{displayLang}</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          dir="rtl"
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
            copied
              ? "border-[#34d399]/50 bg-[#064e3b]/60 text-[#a7f3d0]"
              : "border-[var(--code-border)] bg-[#252a44] text-[#e2e5f8] hover:border-[#818cf8] hover:text-white"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#6ee7b7]" />
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
            color: "#6b7394",
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
      <h1 className="mb-4 mt-2 border-b border-[var(--line)] pb-3 text-[1.55em] font-extrabold leading-snug tracking-tight text-[var(--ink)]">
        {children}
      </h1>
    );
  },
  h2({ children }) {
    return (
      <h2 className="mb-3 mt-8 flex items-center gap-2.5 border-b border-[var(--line)] pb-2 text-[1.28em] font-bold leading-snug text-[var(--ink)]">
        <span
          aria-hidden="true"
          className="h-5 w-1 shrink-0 rounded-full bg-[var(--accent)]"
        />
        <span>{children}</span>
      </h2>
    );
  },
  h3({ children }) {
    return (
      <h3 className="mb-2.5 mt-6 text-[1.12em] font-bold leading-snug text-[var(--ink)]">
        {children}
      </h3>
    );
  },
  h4({ children }) {
    return (
      <h4 className="mb-2 mt-4 text-[1.04em] font-bold text-[var(--ink)]">
        {children}
      </h4>
    );
  },
  p({ children }) {
    return (
      <p className="my-3.5 text-[1em] leading-[inherit] text-[var(--ink)]">
        {children}
      </p>
    );
  },
  ul({ children }) {
    return (
      <ul className="my-3.5 list-disc space-y-2 ps-6 text-[1em] leading-[inherit] text-[var(--ink)] marker:text-[var(--accent)]">
        {children}
      </ul>
    );
  },
  ol({ children }) {
    return (
      <ol className="my-3.5 list-decimal space-y-2 ps-6 text-[1em] leading-[inherit] text-[var(--ink)] marker:font-bold marker:text-[var(--accent)]">
        {children}
      </ol>
    );
  },
  li({ children }) {
    return <li className="leading-[inherit]">{children}</li>;
  },
  strong({ children }) {
    return <strong className="font-extrabold text-[var(--ink)]">{children}</strong>;
  },
  em({ children }) {
    return <em className="italic text-[var(--accent)]">{children}</em>;
  },
  blockquote({ children }) {
    return (
      <blockquote className="my-5 rounded-e-xl border-s-4 border-[var(--accent)] bg-[var(--soft)] px-4 py-3 text-[var(--ink)] [&>p]:my-1.5">
        {children}
      </blockquote>
    );
  },
  hr() {
    return <hr className="my-7 border-[var(--line)]" />;
  },
  a({ href, children }) {
    const isExternal = href ? /^https?:\/\//i.test(href) : false;
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="font-semibold text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-4 transition-colors hover:text-[var(--accent-hover)] hover:decoration-[var(--accent)]"
      >
        {children}
      </a>
    );
  },
  table({ children }) {
    return (
      <div className="my-5 overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--paper)]">
        <table className="w-full border-collapse text-start text-[0.92em]">
          {children}
        </table>
      </div>
    );
  },
  thead({ children }) {
    return (
      <thead className="border-b border-[var(--line)] bg-[var(--soft)] text-[0.88em] font-bold text-[var(--ink)]">
        {children}
      </thead>
    );
  },
  tbody({ children }) {
    return <tbody className="divide-y divide-[var(--line)]">{children}</tbody>;
  },
  tr({ children }) {
    return (
      <tr className="transition-colors hover:bg-[var(--bg)]">{children}</tr>
    );
  },
  th({ children }) {
    return (
      <th className="whitespace-nowrap px-4 py-3 text-start font-bold text-[var(--ink)]">
        {children}
      </th>
    );
  },
  td({ children }) {
    return <td className="px-4 py-3 text-[var(--ink)]">{children}</td>;
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
        className="my-5 overflow-x-auto rounded-xl border border-[var(--code-border)] bg-[var(--code-bg)] p-4 font-mono text-sm text-[#f2f1fc]"
      >
        {children}
      </pre>
    );
  },
  code({ children, className }) {
    return (
      <code
        dir="ltr"
        className={`inline-block rounded-md border border-[var(--line)] bg-[var(--soft)] px-1.5 py-0.5 align-baseline font-mono text-[0.86em] font-medium text-[var(--accent)] ${
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
      <div className="studio-card flex flex-col items-center justify-center px-6 py-14 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--accent)]">
          <FileText className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-[var(--ink)]">
          لا يوجد ملخص مكتوب لهذا الدرس بعد
        </h3>
        <p className="mt-1 max-w-sm text-sm text-[var(--muted)]">
          يمكنك متابعة شرح الفيديو أو تجربة المعمل التفاعلي والكويز.
        </p>
      </div>
    );
  }

  return (
    <article className="studio-card p-5 sm:p-8 [&_.katex-display]:my-4 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:rounded-xl [&_.katex-display]:border [&_.katex-display]:border-[var(--line)] [&_.katex-display]:bg-[var(--bg)] [&_.katex-display]:px-4 [&_.katex-display]:py-3 [&_.katex-display]:text-[var(--ink)] [&_.katex-display]:[direction:ltr] [&_.katex-display]:[unicode-bidi:isolate] [&_.katex]:text-[var(--ink)] [&_.katex]:[direction:ltr] [&_.katex]:[unicode-bidi:isolate]">
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
