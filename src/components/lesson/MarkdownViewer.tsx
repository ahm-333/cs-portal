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
  embedded?: boolean;
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

function sanitizeMarkdownHref(rawHref?: string): {
  href: string | undefined;
  isExternal: boolean;
} {
  if (!rawHref) return { href: undefined, isExternal: false };
  const trimmed = rawHref.trim();
  if (!trimmed) return { href: undefined, isExternal: false };

  if (trimmed.startsWith("#") || trimmed.startsWith("/")) {
    return { href: trimmed, isExternal: false };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return { href: parsed.toString(), isExternal: true };
    }
  } catch {
    return { href: undefined, isExternal: false };
  }

  return { href: undefined, isExternal: false };
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
      className="my-5 w-full max-w-full overflow-hidden rounded-[16px] border border-white/10 bg-[#0d131d] text-[#e4ebf5] shadow-sm"
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#141d2b] px-3.5 py-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-2 text-xs font-semibold tracking-wide text-slate-300">
          <Terminal className="h-3.5 w-3.5 shrink-0 text-[#66c7a6]" />
          <span className="font-mono-code truncate">{displayLang}</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          dir="rtl"
          className={`inline-flex min-h-[34px] shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all ${
            copied
              ? "border-[#66c7a6]/50 bg-[#173026] text-[#66c7a6]"
              : "border-white/15 bg-white/5 text-slate-200 hover:border-[#e58a62] hover:text-white"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#66c7a6]" />
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

      <div className="max-w-full overflow-x-auto">
        <SyntaxHighlighter
          language={prismLang}
          style={vscDarkPlus}
          showLineNumbers={lineCount > 2}
          lineNumberStyle={{
            minWidth: "2.4em",
            paddingRight: "1em",
            color: "#607288",
            userSelect: "none",
          }}
          customStyle={{
            margin: 0,
            padding: "1rem 1.15rem",
            background: "transparent",
            fontSize: "0.82rem",
            lineHeight: "1.7",
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
      <h1 className="mb-4 mt-2 border-b border-[var(--border-soft)] pb-3 text-[1.45em] font-black leading-snug tracking-tight text-[var(--text-primary)]">
        {children}
      </h1>
    );
  },
  h2({ children }) {
    return (
      <h2 className="mb-3 mt-7 flex items-center gap-2.5 border-b border-[var(--border-soft)] pb-2 text-[1.18em] font-extrabold leading-snug text-[var(--text-primary)] first:mt-0">
        <span
          aria-hidden="true"
          className="h-4 w-1 shrink-0 rounded-full bg-[var(--brand-primary)] opacity-75"
        />
        <span>{children}</span>
      </h2>
    );
  },
  h3({ children }) {
    return (
      <h3 className="mb-2.5 mt-5 text-[1.08em] font-extrabold leading-snug text-[var(--text-primary)]">
        {children}
      </h3>
    );
  },
  h4({ children }) {
    return (
      <h4 className="mb-2 mt-4 text-[1em] font-bold text-[var(--text-primary)]">
        {children}
      </h4>
    );
  },
  p({ children }) {
    return (
      <p className="my-3 text-[0.95em] leading-[1.85] text-[var(--text-secondary)]">
        {children}
      </p>
    );
  },
  ul({ children }) {
    return (
      <ul className="my-3 list-disc space-y-2 ps-6 text-[0.95em] leading-[1.8] text-[var(--text-secondary)] marker:text-[var(--accent-warm)]">
        {children}
      </ul>
    );
  },
  ol({ children }) {
    return (
      <ol className="my-3 list-decimal space-y-2 ps-6 text-[0.95em] leading-[1.8] text-[var(--text-secondary)] marker:font-bold marker:text-[var(--brand-primary)]">
        {children}
      </ol>
    );
  },
  li({ children }) {
    return <li className="leading-[inherit]">{children}</li>;
  },
  strong({ children }) {
    return (
      <strong className="font-extrabold text-[var(--text-primary)]">
        {children}
      </strong>
    );
  },
  em({ children }) {
    return (
      <em className="not-italic font-medium text-[var(--text-muted)]">
        {children}
      </em>
    );
  },
  blockquote({ children }) {
    return (
      <blockquote
        className="my-4 rounded-xl border border-s-[3px] px-4 py-3 text-[0.93em] leading-relaxed text-[var(--text-primary)] [&>p]:my-1 [&>p]:text-[var(--text-primary)]"
        style={{
          background:
            "color-mix(in srgb, var(--brand-soft) 45%, var(--bg-surface))",
          borderColor:
            "color-mix(in srgb, var(--brand-primary) 18%, var(--border-soft))",
          borderInlineStartColor:
            "color-mix(in srgb, var(--brand-primary) 60%, transparent)",
        }}
      >
        {children}
      </blockquote>
    );
  },
  hr() {
    return <hr className="my-6 border-[var(--border-soft)]" />;
  },
  a({ href, children }) {
    const safe = sanitizeMarkdownHref(href);
    if (!safe.href) {
      return <span className="font-semibold text-[var(--text-primary)]">{children}</span>;
    }
    return (
      <a
        href={safe.href}
        target={safe.isExternal ? "_blank" : undefined}
        rel={safe.isExternal ? "noopener noreferrer" : undefined}
        className="font-bold text-[var(--brand-primary)] underline decoration-[var(--brand-primary)]/40 underline-offset-4 transition-colors hover:text-[var(--accent-warm)] hover:decoration-[var(--accent-warm)]"
      >
        {children}
      </a>
    );
  },
  table({ children }) {
    return (
      <div className="my-4 w-full max-w-full overflow-x-auto rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)]">
        <table className="w-full border-collapse text-start text-[12.5px]">
          {children}
        </table>
      </div>
    );
  },
  thead({ children }) {
    return (
      <thead className="border-b border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[12px] font-extrabold text-[var(--text-primary)]">
        {children}
      </thead>
    );
  },
  tbody({ children }) {
    return <tbody className="divide-y divide-[var(--border-soft)]">{children}</tbody>;
  },
  tr({ children }) {
    return (
      <tr className="transition-colors hover:bg-[var(--bg-hover)]">
        {children}
      </tr>
    );
  },
  th({ children }) {
    return (
      <th className="whitespace-nowrap px-3.5 py-2.5 text-start font-extrabold text-[var(--text-primary)]">
        {children}
      </th>
    );
  },
  td({ children }) {
    return (
      <td className="px-3.5 py-2.5 text-[var(--text-secondary)]">{children}</td>
    );
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
        className="code-ltr my-4 max-w-full overflow-x-auto text-[12.5px]"
      >
        {children}
      </pre>
    );
  },
  code({ children, className }) {
    return (
      <code
        dir="ltr"
        className={`inline-block max-w-full break-words rounded-md border px-1.5 py-0.5 align-baseline font-mono-code text-[0.84em] font-semibold ${
          className ?? ""
        }`}
        style={{
          background:
            "color-mix(in srgb, var(--brand-soft) 55%, var(--bg-subtle))",
          borderColor:
            "color-mix(in srgb, var(--brand-primary) 14%, var(--border-soft))",
          color: "var(--brand-soft-text)",
        }}
      >
        {children}
      </code>
    );
  },
};

export default function MarkdownViewer({
  content,
  embedded = false,
}: MarkdownViewerProps) {
  if (!content || !content.trim()) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-2xl border border-[var(--border-soft)] px-6 py-10 text-center ${
          embedded ? "bg-[var(--bg-canvas)]" : "surface-card"
        }`}
      >
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-soft)] bg-[var(--bg-subtle)] text-[var(--brand-primary)]">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
          لا يوجد ملخص مكتوب لهذا الدرس بعد
        </h3>
        <p className="mt-1 max-w-sm text-xs text-[var(--text-muted)]">
          يمكنك الاعتماد على الكود الأساسي وورقة القوانين والمعمل التفاعلي
          والكويز لإتقان الدرس.
        </p>
      </div>
    );
  }

  return (
    <article
      className={`w-full max-w-full overflow-hidden ${
        embedded
          ? "rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-canvas)] p-4 sm:p-6"
          : "surface-card rounded-[22px] p-5 sm:p-7"
      } [&_.katex-display]:my-4 [&_.katex-display]:max-w-full [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:rounded-xl [&_.katex-display]:border [&_.katex-display]:border-[var(--border-soft)] [&_.katex-display]:bg-[var(--bg-surface)] [&_.katex-display]:px-4 [&_.katex-display]:py-3 [&_.katex-display]:text-[var(--text-primary)] [&_.katex-display]:[direction:ltr] [&_.katex-display]:[unicode-bidi:isolate] [&_.katex]:text-[var(--text-primary)] [&_.katex]:[direction:ltr] [&_.katex]:[unicode-bidi:isolate]`}
    >
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
