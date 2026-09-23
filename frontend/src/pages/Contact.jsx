import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#f4f7f1] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-[#0b3d20] rounded-[30px] p-8 sm:p-10 text-white mb-6">
          <p className="text-lime-300 text-sm font-semibold uppercase tracking-wider">
            Get In Touch
          </p>

          <h1 className="text-4xl sm:text-5xl font-bold mt-2">Contact Us</h1>

          <p className="text-green-100/70 mt-4 max-w-xl">
            Have a question, suggestion or need help? We would love to hear from
            you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="bg-white rounded-[30px] border border-green-100 p-7 sm:p-9">
            <h2 className="text-2xl font-bold text-[#173c24]">Let’s talk</h2>

            <p className="text-gray-500 text-sm mt-2">
              Reach out to the KisanDirect team.
            </p>

            <div className="space-y-5 mt-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center">
                  <Mail size={21} className="text-green-700" />
                </div>

                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="font-semibold text-[#173c24]">
                    support@kisandirect.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center">
                  <Phone size={21} className="text-green-700" />
                </div>

                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="font-semibold text-[#173c24]">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center">
                  <MapPin size={21} className="text-green-700" />
                </div>

                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="font-semibold text-[#173c24]">India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[30px] border border-green-100 p-7 sm:p-9">
            <h2 className="text-2xl font-bold text-[#173c24]">
              Send us a message
            </h2>

            <div className="space-y-4 mt-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-2xl bg-[#f4f7f1] border border-green-100 outline-none focus:border-green-400"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 rounded-2xl bg-[#f4f7f1] border border-green-100 outline-none focus:border-green-400"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full px-4 py-3 rounded-2xl bg-[#f4f7f1] border border-green-100 outline-none focus:border-green-400 resize-none"
              />

              <button className="w-full flex items-center justify-center gap-2 bg-[#173c24] text-lime-300 py-3.5 rounded-2xl font-semibold hover:bg-[#0b3d20] transition">
                <Send size={18} />
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
