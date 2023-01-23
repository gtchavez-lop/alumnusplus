const Navbar = ({ userType }) => {
  return (
    <>
      <div className="w-full fixed py-7 flex justify-center">
        <div className="w-full max-w-5xl flex items-center justify-between">
          <div>
            <p>{userType}</p>
          </div>
          <div>
            <p>asdhjkasdhjasdhjk</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
