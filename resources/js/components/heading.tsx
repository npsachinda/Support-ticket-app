interface HeadingProps {
    children: React.ReactNode;
    className?: string;
}

export default function Heading({ children, className = '' }: HeadingProps) {
    return (
        <h1 className={`text-2xl font-bold tracking-tight ${className}`}>
            {children}
        </h1>
    );
}
