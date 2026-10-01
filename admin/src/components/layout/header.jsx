import {
  Menu,
  Bell,
  ChevronDown
} from "lucide-react";

const Header = ({
  user,
  setSidebarOpen
}) => {
  const displayName = !user?.name || user.name === "Admin" ? "Abhi" : user.name;
  const initial = displayName.charAt(0).toUpperCase() || "A";

  return (
    <header className="
      h-[72px]
      bg-gradient-to-r
      from-green-600
      to-green-800
      flex
      items-center
      justify-between
      px-4
      sm:px-6
      sticky
      top-0
      z-30
    ">

      <button
        onClick={() =>
          setSidebarOpen(true)
        }
        className="lg:hidden text-white"
      >
        <Menu size={24} />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">

        <button className="relative text-white/90">
          <Bell size={20} />

          <span className="
            absolute
            -top-1
            -right-1
            w-2
            h-2
            bg-red-500
            rounded-full
          " />
        </button>

        <div className="h-7 w-px bg-white/20" />

        <div className="flex items-center gap-3">

          <div className="
            w-9
            h-9
            rounded-full
            bg-white/20
            flex
            items-center
            justify-center
            text-white
            font-semibold
          ">
            {initial}
          </div>

          <div className="hidden sm:block text-white">

            <p className="text-sm font-medium">
              {displayName}
            </p>

            <p className="text-[11px] text-white/70">
              {user?.role || "ADMIN"}
            </p>

          </div>

          <ChevronDown
            size={16}
            className="text-white/80 hidden sm:block"
          />

        </div>

      </div>

    </header>
  );
};

export default Header;
