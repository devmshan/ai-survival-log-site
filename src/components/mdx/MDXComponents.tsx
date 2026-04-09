import { MermaidRenderer } from './MermaidRenderer'

export const mdxComponents = {
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement> & { children?: React.ReactNode }) => {
    const child = children as React.ReactElement<{ className?: string; children?: string }>
    if (child?.props?.className === 'language-mermaid') {
      return <MermaidRenderer chart={child.props.children ?? ''} />
    }
    return <pre {...props}>{children}</pre>
  },
  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => {
    return (
      <code
        className={`${className ?? ''} bg-muted px-1 py-0.5 rounded text-sm`}
        {...props}
      >
        {children}
      </code>
    )
  },
}
