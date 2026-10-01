import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Tag, ArrowRight, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Curabitur porttitor orci eget neque accumsan venenatis. Nunc fermentum.",
    summary:
      "Aliquam ac dui vel dui vulputate consectetur. Mauris accumsan, massa non consectetur condimentum.",
    category: "Food",
    author: "By Admin",
    dateDay: "18",
    dateMonth: "NOV",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Eget lobortis lorem lacinia. Vivamus pharetra semper, urna sit amet.",
    summary:
      "Curabitur auctor, urna eget pellentesque mollis, sem neque dictum eros, nec fringilla lorem augue.",
    category: "Healthy",
    author: "By Admin",
    dateDay: "23",
    dateMonth: "JAN",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Maecenas vehicula a justo vitae varius. Nullam in aliquam felis.",
    summary:
      "In hac habitasse platea dictumst. Pellentesque habitant morbi tristique senectus et netus et malesuada.",
    category: "Organic",
    author: "By Admin",
    dateDay: "05",
    dateMonth: "MAR",
    image: "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=600&q=80"
  }
];

const BlogSection = () => {
  return (
    <div className="my-14">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-[#00B207]">
          Blog
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
          Latest News
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
          Read nutrition tips and sustainable organic lifestyle guides
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="group rounded-2xl border border-gray-150 bg-white overflow-hidden shadow-xs hover:border-[#00B207] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image & Date Badge */}
              <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex flex-col items-center justify-center rounded-xl bg-white px-3 py-1.5 shadow-sm text-gray-900 font-bold leading-none">
                  <span className="text-base sm:text-lg">{post.dateDay}</span>
                  <span className="text-[10px] text-gray-400 uppercase mt-0.5">{post.dateMonth}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Tag size={12} className="text-[#00B207]" />
                    <span>{post.category}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={12} className="text-gray-400" />
                    <span>{post.author}</span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-800 leading-snug group-hover:text-[#00B207] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-0">
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00B207] hover:text-[#008f05] group-hover:gap-2 transition-all"
              >
                <span>Read More</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
