export function Sidebar({ children }) {
    return (
        <div class='min-h-100 overflow-y-auto bg-slate-900 lg:h-full'>
            {children}
        </div>
    );
}
