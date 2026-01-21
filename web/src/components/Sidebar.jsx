export function Sidebar({ children }) {
    return (
        <div class='min-h-100 overflow-y-auto bg-zinc-900 lg:h-full'>
            {children}
        </div>
    );
}
