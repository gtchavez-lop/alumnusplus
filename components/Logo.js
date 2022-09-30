const Logo = () => {
  return (
    <>
      <div className="logo text-xl select-none text-primary flex group font-bold">
        <p className="transition-all duration-500">a</p>
        <p className="w-0 opacity-0 scale-x-0 group-hover:scale-x-100 origin-left group-hover:opacity-100 group-hover:w-[75px] transition-all duration-500">
          lumnus
        </p>
        <p className="-translate-y-2 -translate-x-1 group-hover:-translate-x-0 duration-500 transition-all">
          +
        </p>
      </div>
    </>
  );
};

export default Logo;
