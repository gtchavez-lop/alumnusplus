const Logo = ({ width, height, className }) => {
  return (
    <>
      <div
        style={{
          width: width || 150,
          height: height || 40,
        }}
        className={`${className} bg-primary [mask: url(/LOGO.svg)]`}
      />
    </>
  );
};

export default Logo;
