import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../Footer";
import Header from "../Header";

// Optimized ContactForm component
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    access_key: "a3f96331-46db-4c42-b288-92b4cd80a61e",
    subject: "New Contact Form Submission from HertzSoft Website",
    from_name: "HertzSoft",
  });
  const [status, setStatus] = useState({
    message: "",
    type: "", // "success" or "error"
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (status.message) {
      setStatus({ message: "", type: "" });
    }
  };

  const validateForm = () => {
    const { name, email, message } = formData;
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({
        message: "Please fill out all fields.",
        type: "error",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setStatus({ message: "Sending your message...", type: "info" });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const jsonResponse = await response.json();
      if (response.status === 200) {
        setStatus({
          message: jsonResponse.message,
          type: "success",
        });
        setFormData((prevData) => ({
          ...prevData,
          name: "",
          email: "",
          message: "",
        }));
      } else {
        console.error("Web3Forms error:", jsonResponse);
        setStatus({
          message: jsonResponse.message || "Something went wrong!",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Submission error:", error.message);
      setStatus({
        message: "Something went wrong! Please try again later.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setStatus({ message: "", type: "" });
      }, 5000);
    }
  };

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border border-blue-200"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">
        Send Us a Message
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden fields are now handled in the state */}
        <input type="hidden" name="to" value="shreyashadawale25@gmail.com" />
        <input type="hidden" name="reply_to" value={formData.email} />
        <div>
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-blue-900 placeholder-gray-500"
            placeholder="John Doe"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-blue-900 placeholder-gray-500"
            placeholder="you@example.com"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-2 rounded-xl border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-blue-900 placeholder-gray-500"
            placeholder="Type your message here..."
            required
            disabled={isLoading}
          ></textarea>
        </div>
        <button
          type="submit"
          className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
          aria-label="Send message"
        >
          {isLoading ? "Sending..." : "Send Message"}
        </button>
        {status.message && (
          <div className="text-center mt-4 font-medium">
            <p
              className={
                status.type === "error"
                  ? "text-red-600"
                  : status.type === "success"
                  ? "text-green-600"
                  : "text-gray-500"
              }
            >
              {status.message}
            </p>
          </div>
        )}
      </form>
    </motion.div>
  );
};

// Full Help component remains largely the same, with the updated ContactForm imported.
const Help = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const handleScroll = useCallback(
    debounce(() => {
      setIsScrolled(window.scrollY > 100);
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          const offset = 100;
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth",
          });
        }, 100);
      } else {
        console.warn(`Element with id '${hash}' not found.`);
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredTopics = [
    {
      id: "order-tracking",
      title: "Order Tracking",
      desc: "Track your order status easily with our step-by-step guide.",
    },
    {
      id: "payment-issues",
      title: "Payment Issues",
      desc: "Resolve payment problems quickly and securely.",
    },
    {
      id: "shipping-info",
      title: "Shipping Information",
      desc: "Details on shipping times and policies.",
    },
    {
      id: "returns-refunds",
      title: "Returns & Refunds",
      desc: "Understand our return and refund process.",
    },
    {
      id: "account-management",
      title: "Account Management",
      desc: "Manage your profile, password, and preferences.",
    },
    {
      id: "product-information",
      title: "Product Information",
      desc: "Find detailed information about our products.",
    },
  ].filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentDateTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <>
      <motion.div
        className="relative w-full min-h-screen bg-gradient-to-br from-white to-gray-50 bg-[url('https://www.transparenttextures.com/patterns/light-paper-fibers.png')] font-inter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
          <motion.div
            className="top-0 bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-6 mb-12 z-10"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 tracking-tight text-center">
              Help Center
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto text-center">
              Get the support you need with our comprehensive resources and
              dedicated team. We're here to help!
            </p>
            <div className="mt-6 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search help topics..."
                className="w-full px-4 py-2 pl-10 bg-white/80 backdrop-blur-md rounded-xl border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-blue-900 placeholder-gray-500"
                aria-label="Search help topics"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </motion.div>

          <section id="help-topics" className="mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
              Popular Help Topics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => (
                  <motion.div
                    key={topic.id}
                    className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    whileHover={{ scale: 1.03, rotateY: 2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 * filteredTopics.indexOf(topic),
                      duration: 0.4,
                    }}
                  >
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">
                      {topic.title}
                    </h3>
                    <p className="mt-2 text-gray-600 line-clamp-3">
                      {topic.desc}
                    </p>
                    <Link
                      to={`/help#${topic.id}`}
                      className="mt-4 inline-block text-blue-600 hover:text-blue-700 underline font-medium"
                    >
                      Learn More &rarr;
                    </Link>
                  </motion.div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-600 text-lg">
                  No topics found for your search...
                </p>
              )}
            </div>
          </section>

          <section id="faq" className="mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  question: "How do I track my order?",
                  answer:
                    "Log into your account and visit the 'Order History' section to track your order status. You will find real-time updates on your shipment there.",
                },
                {
                  question: "What payment methods are accepted?",
                  answer:
                    "We accept a wide range of payment methods including major credit/debit cards (Visa, MasterCard, Amex), UPI, Net Banking, and select digital wallets for your convenience.",
                },
                {
                  question: "Can I cancel my order?",
                  answer:
                    "Yes, cancellations are possible within 24 hours of placing the order, provided it has not yet been processed for shipping. Please contact our support team immediately for assistance.",
                },
                {
                  question: "How do I return a product?",
                  answer:
                    "Our returns policy allows returns within 30 days of purchase. Please visit our 'Returns & Refunds' section for detailed instructions and to initiate a return request.",
                },
                {
                  question: "Is my personal information secure?",
                  answer:
                    "Absolutely. We use advanced encryption and security protocols to protect your personal and payment information. Your privacy is our top priority.",
                },
              ].map((faq, i) => (
                <details
                  key={i}
                  className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-md border border-blue-200"
                >
                  <summary className="text-lg font-semibold text-blue-900 cursor-pointer focus:outline-none flex justify-between items-center">
                    {faq.question}
                    <span className="ml-2">
                      <svg
                        className="w-4 h-4 text-blue-600 transform transition-transform duration-300 group-open:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </span>
                  </summary>
                  <motion.p
                    className="mt-2 text-gray-600"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {faq.answer}
                  </motion.p>
                </details>
              ))}
            </div>
          </section>

          <section
            id="contact-us-section"
            className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <motion.div
              className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border border-blue-200"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                Get In Touch
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Our dedicated support team is here to assist you. Reach out
                through the following channels:
              </p>

              <div className="space-y-4">
                <div className="flex items-center p-3 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm">
                  <svg
                    className="text-blue-600 text-xl mr-4 flex-shrink-0 w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path>
                  </svg>
                  <div>
                    <h4 className="font-semibold text-blue-800">
                      Phone Support
                    </h4>
                    <p className="text-gray-700">
                      <a
                        href="tel:+918657242757"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        +91 86572 42757
                      </a>
                    </p>
                    <p className="text-gray-500 text-sm">
                      Available: Mon-Fri, 9 AM - 6 PM IST
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm">
                  <svg
                    className="text-blue-600 text-xl mr-4 flex-shrink-0 w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                  </svg>
                  <div>
                    <h4 className="font-semibold text-blue-800">
                      Email Support
                    </h4>
                    <p className="text-gray-700">
                      <a
                        href="mailto:shreyashadawale25@gmail.com"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        shreyashadawale25@gmail.com
                      </a>
                    </p>
                    <p className="text-gray-500 text-sm">
                      Response time: Within 24 hours (Mon-Fri)
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm">
                  <svg
                    className="text-blue-600 text-xl mr-4 flex-shrink-0 w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
                  </svg>
                  <div>
                    <h4 className="font-semibold text-blue-800">Our Office</h4>
                    <p className="text-gray-700">
                      Office No. 105, First Floor, Al-Ameer Tower, A-Wing, Jail
                      Rd S, Dongri, Umerkhadi, Mumbai, Maharashtra 400009
                    </p>
                    <p className="text-gray-500 text-sm">
                      Visits by appointment only
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-gray-600 text-sm text-center">
                Current Local Time:{" "}
                <span className="font-medium text-blue-800">
                  {currentDateTime}
                </span>
              </p>
            </motion.div>

            <ContactForm />
          </section>
        </div>
      </motion.div>
      {isScrolled && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to top"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </motion.button>
      )}
    </>
  );
};

export default Help;
