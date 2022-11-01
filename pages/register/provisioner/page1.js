const Provisioner_SignUp_Page1 = ({ setPage }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(2);
  };

  return (
    <main className="relative py-16">
      {/* img background with gradient filter */}
      <div className="fixed w-full h-screen top-0 left-0 ">
        <div className="hidden md:block absolute top-0 left-0 w-1/2 h-full bg-gradient-to-l from-base-100 to-transparent" />
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80"
          className="absolute top-0 left-0 hidden md:block w-1/2 h-full object-cover -z-10 transition-all duration-300"
        />
      </div>

      {/* content */}
      <div className="relative">
        <h1 className="text-3xl md:text-right">Provisioner Account</h1>
        <p className="opacity-50 max-w-md md:ml-auto md:text-right">
          A Provisioner is a person who is looking for a worker. They can be
          freelancers, contractors, or full-time employees.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div />
          {/* form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 ml-auto mt-16 gap-5 gap-y-2 w-full"
          >
            <div className="flex flex-col col-span-full">
              <label htmlFor="name" className="md:text-right">
                Company Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="ABC Company"
                className="input input-primary input-bordered md:text-right"
              />
            </div>
            <div className="flex flex-col col-start-1">
              <label htmlFor="email" className="md:text-right">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="abcompany@mail.com"
                className="input input-primary input-bordered md:text-right"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="md:text-right">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="********"
                className="input input-primary input-bordered md:text-right"
              />
            </div>

            {/* divider */}
            <div className="col-span-full">
              <div className="divider divider-dashed" />
            </div>

            <div className="flex flex-col col-span-full">
              <label htmlFor="description" className="md:text-right">
                Company Description
              </label>
              <textarea
                name="description"
                id="description"
                className="textarea textarea-primary textarea-bordered md:text-right"
                rows="3"
                placeholder="Tell us about your company"
              />
            </div>
            <div className="flex flex-col col-start-1">
              <label htmlFor="website" className="md:text-right">
                Website
              </label>
              <input
                type="text"
                name="website"
                id="website"
                placeholder="https://"
                className="input input-primary input-bordered md:text-right"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone" className="md:text-right">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                placeholder="123-456-7890"
                className="input input-primary input-bordered md:text-right"
              />
            </div>

            {/* divider */}
            <div className="col-span-full">
              <div className="divider opacity-0" />
            </div>

            <div className="flex flex-col col-span-full">
              <label htmlFor="dateEstablished" className="md:text-right">
                Date Established
              </label>
              <input
                type="date"
                name="dateEstablished"
                id="dateEstablished"
                className="input input-primary input-bordered md:text-right"
              />
            </div>

            {/* divider */}
            <div className="col-span-full">
              <div className="divider opacity-0" />
            </div>

            <div className="flex flex-col col-span-full">
              <label htmlFor="address" className="md:text-right">
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="123 Main St, City, State, Zip"
                className="input input-primary input-bordered md:text-right"
              />
            </div>
            <div className="flex flex-col col-start-1">
              <label htmlFor="city" className="md:text-right">
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                placeholder="City"
                className="input input-primary input-bordered md:text-right"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="state" className="md:text-right">
                State
              </label>
              <input
                type="text"
                name="state"
                id="state"
                placeholder="State"
                className="input input-primary input-bordered md:text-right"
              />
            </div>
            <div className="flex flex-col col-start-2">
              <label htmlFor="postalCode" className="md:text-right">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                placeholder="1234"
                className="input input-primary input-bordered md:text-right"
              />
            </div>

            {/* submit */}
            <div className="col-span-full  mt-16">
              <button type="submit" className="btn btn-primary btn-block">
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Provisioner_SignUp_Page1;
