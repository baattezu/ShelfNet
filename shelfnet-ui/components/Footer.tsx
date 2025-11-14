export default function Footer() {
  return (
    <footer className="mt-12 border-t border-[#334155] py-10 text-sm text-[#94a3b8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-md bg-[#3b82f6] flex items-center justify-center">
                S
              </div>
              <div className="font-semibold">ShelfNet</div>
            </div>
            <p className="text-xs mt-2 text-[#94a3b8]">
              Where books and people connect.
            </p>
          </div>
          <div className="flex gap-6">
            <div>
              <div className="font-semibold text-white">Platform</div>
              <div className="mt-2 flex flex-col gap-2">
                <a href="#" className="text-[#94a3b8]">
                  Browse Books
                </a>
                <a href="#" className="text-[#94a3b8]">
                  Find Communities
                </a>
              </div>
            </div>
            <div>
              <div className="font-semibold text-white">Company</div>
              <div className="mt-2 flex flex-col gap-2">
                <a href="#" className="text-[#94a3b8]">
                  About
                </a>
                <a href="#" className="text-[#94a3b8]">
                  Careers
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-[#94a3b8]">
          © 2025 ShelfNet. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
