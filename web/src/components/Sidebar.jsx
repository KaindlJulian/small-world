export function Sidebar({ children }) {
    return (
        <div class='z-90 min-h-100 overflow-y-auto bg-zinc-900 lg:h-full'>
            {children}
        </div>
    );
}
