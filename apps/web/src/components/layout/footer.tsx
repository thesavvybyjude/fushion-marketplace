export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-coal text-white/60 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-white">
                Fu<span className="text-ember">sh</span>ion
              </span>
            </a>
            <p className="text-sm leading-relaxed mb-4 max-w-xs">
              Nigeria&apos;s multi-vendor marketplace. Every market, one place.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-market-green/15 rounded-full text-xs text-market-green">
              <span className="text-sm">🇳🇬</span>
              Made in Nigeria
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {['All Products', 'Categories', 'Featured', 'Deals'].map((link) => (
                <li key={link}>
                  <a
                    href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm hover:text-ember transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Vendor */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Sell</h4>
            <ul className="space-y-2.5">
              {['Become a Vendor', 'Vendor Dashboard', 'Pricing', 'Success Stories'].map((link) => (
                <li key={link}>
                  <a
                    href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm hover:text-ember transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Support</h4>
            <ul className="space-y-2.5">
              {['Help Centre', 'Contact Us', 'Returns Policy', 'Privacy Policy', 'Terms of Service'].map(
                (link) => (
                  <li key={link}>
                    <a
                      href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm hover:text-ember transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {currentYear} Fushion. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Payments secured by</span>
            <span className="text-xs font-bold text-white/60">Paystack</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
