import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#001f54] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-lg font-bold">FIFA World Cup 2026™</p>
            <p className="mt-2 text-sm text-blue-200">Official Hospitality Packages</p>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-300">Matches</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li><Link href="/world-cup" className="hover:text-white">Single Matches</Link></li>
              <li><Link href="/platinum-access" className="hover:text-white">Platinum Access</Link></li>
              <li><Link href="/accommodations" className="hover:text-white">Accommodations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-300">Support</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/guarantee" className="hover:text-white">About</Link></li>
              <li><a href="tel:+18446521685" className="hover:text-white">+1-844-652-1685</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-300">Stores</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>United States (USD)</li>
              <li>Canada (CAD)</li>
              <li>Mexico (MXN)</li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-blue-300">
          © {new Date().getFullYear()} FIFA World Cup 2026™ Hospitality. FIFA World Cup™ is a trademark of FIFA.
        </p>
      </div>
    </footer>
  );
}
