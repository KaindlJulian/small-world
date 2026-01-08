export function Sidebar({ children }) {
    return (
        <div class='min-h-100 overflow-y-scroll bg-slate-800 lg:h-full'>
            {children}
        </div>
    );
}
