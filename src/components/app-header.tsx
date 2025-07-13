
'use client';

export function AppHeader() {
  return (
    <header className="flex flex-col items-center gap-4 py-6 text-center print:hidden">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
            <span className="text-blue-800">ARKA</span>{' '}
            <span className="text-red-600">JAIN</span>{' '}
            <span className="text-blue-800">University</span>
        </h1>
        <p className="text-base text-black font-medium [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
          Jamshedpur, Jharkhand
        </p>
      </div>
    </header>
  );
}
