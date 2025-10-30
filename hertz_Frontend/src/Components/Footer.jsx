import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-[#213448] text-white text-base">
      {/* Top Section */}
      <div className="px-4 sm:px-6 py-10 flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-10">
        {/* Easy Returns */}
        <div className="max-w-sm text-center lg:text-left text-lg sm:text-xl">
          <p className="font-medium">
            Easy Returns:{" "}
            <a href="#" className="underline text-blue-300 hover:text-blue-400">
              Free Replacement
            </a>{" "}
            or{" "}
            <a href="#" className="underline text-blue-300 hover:text-blue-400">
              Full Refund
            </a>
          </p>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-center sm:text-left w-full max-w-4xl">
          {/* Let us help */}
          <div>
            <h3 className="font-semibold mb-2">Let us help</h3>
            <ul className="space-y-1 text-gray-300">
              <li>
                <a href="#" className="hover:underline">
                  My Account
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  All Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Bulk Order Inquiry
                </a>
              </li>
            </ul>
          </div>

          {/* Our Company */}
          <div>
            <h3 className="font-semibold mb-2">Our Company</h3>
            <ul className="space-y-1 text-gray-300">
              <li>
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  For investors
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  For media
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Annual Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  CSR
                </a>
              </li>
            </ul>
          </div>

          {/* Our Policies */}
          <div>
            <h3 className="font-semibold mb-2">Our policies</h3>
            <ul className="space-y-1 text-gray-300">
              <li>
                <a href="#" className="hover:underline">
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Copyright
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Patents & trademarks
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black text-gray-300 px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left */}
        <div className="text-sm sm:text-base text-center md:text-left">
          <a href="tel:02522669393" className="hover:underline text-lg">
            +91 8657242757
          </a>
          <span className="mx-2 hidden sm:inline">|</span>
          <a href="/" className="hover:underline text-lg">
            Home
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4 text-white text-2xl">
          <a
            href="https://api.whatsapp.com/send/?phone=919867961600&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-green-600 p-2 rounded-full hover:scale-110 hover:bg-green-100 transition"
          >
            <FaWhatsapp />
          </a>
          <a
            href="https://www.facebook.com/hertzsoft/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-600 p-2 rounded-full hover:scale-110 hover:bg-blue-100 transition"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com/hertzsoft/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-pink-500 p-2 rounded-full hover:scale-110 hover:bg-pink-100 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.youtube.com/hertzsoft"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-red-600 p-2 rounded-full hover:scale-110 hover:bg-red-100 transition"
          >
            <FaYoutube />
          </a>
          <a
            href="https://www.linkedin.com/company/hertzsoft"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-700 p-2 rounded-full hover:scale-110 hover:bg-blue-100 transition"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
