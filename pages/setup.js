import { AnimatePresence } from 'framer-motion';
import { _Page_Transition } from '../lib/_animations';
import _supabase from '../lib/supabase';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../components/AuthContext';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Page_setup = () => {
  const { user } = useAuth();
  const [hasID, setHasID] = useState(false);
  const router = useRouter();

  const _setupUser = async (e) => {
    e.preventDefault();
    const {
      email,
      username,
      name_first,
      name_middle,
      name_last,
      birthday,
      hasID,
      alumniIdNumber,
    } = e.target.elements;

    const _user = {
      id: user.id,
      email: email.value,
      user_handle: username.value,
      name_given: name_first.value,
      name_middle: name_middle.value,
      name_last: name_last.value,
      birthdate: birthday.value,
      hasId: hasID.checked,
      alumniIdNumber: alumniIdNumber ? alumniIdNumber.value : 'TEMPORARY',
    };

    toast.loading('Setting up your account...');

    for (const key in _user) {
      if (_user[key] === '') {
        toast.dismiss();
        toast.error('Please fill out all fields.');
        return;
      }
    }

    // disable all inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      input.disabled = true;
    });

    const { data, error } = await _supabase
      .from('user_data')
      .insert([_user])
      .single();

    if (error) {
      console.log(error);
    }

    if (data) {
      toast.dismiss();
      toast.success('Account Created!');
      setTimeout(() => {
        router.replace('/feed');
      }, 1000);
    }

    // enable all inputs
    inputs.forEach((input) => {
      input.disabled = false;
    });
  };

  return (
    <>
      <motion.main
        variants={_Page_Transition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center mt-32 pb-32"
      >
        <p className="text-4xl font-thin">Setup your account</p>
        <p>Please fill out the following information to setup your account.</p>
        <p className="text-sm opacity-50">
          *If you are an alumni, please provide your alumni ID number. <br /> If
          you don&apos;t have one, this account will be marked as teporary.
        </p>

        <form
          onSubmit={(e) => _setupUser(e)}
          className=" grid grid-cols-1 md:grid-cols-3 w-full max-w-xl mt-16 gap-5 gap-x-2"
        >
          <label className="flex flex-col col-span-full">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-primary"
              readOnly
              disabled
              value={user && user.email}
            />
          </label>
          <label className="flex flex-col col-span-full">
            <span>Username</span>
            <input
              type="text"
              name="username"
              placeholder="JuanDelaCruz"
              className="input input-primary "
            />
          </label>
          <label className="flex flex-col">
            <span>Given Name</span>
            <input
              type="text"
              name="name_first"
              placeholder="Juan"
              className="input input-primary"
            />
          </label>
          <label className="flex flex-col">
            <span>Middle Name (Optional)</span>
            <input
              type="text"
              name="name_middle"
              placeholder="Paredez"
              className="input input-primary"
            />
          </label>
          <label className="flex flex-col">
            <span>Last Name</span>
            <input
              type="text"
              name="name_last"
              placeholder="Last Name"
              className="input input-primary"
            />
          </label>
          <label className="flex flex-col md:col-span-2">
            <span>Birthday</span>
            <input
              type="date"
              name="birthday"
              placeholder="Birthday"
              className="input input-primary"
            />
          </label>
          <label className="flex flex-col">
            <span>Do you have an Alumni ID?</span>
            <input
              type={'checkbox'}
              className="toggle mt-3 ml-5"
              name="hasID"
              checked={hasID}
              onChange={(e) => setHasID(e.currentTarget.checked)}
            />
          </label>
          <AnimatePresence>
            {hasID && (
              <motion.label
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0, transition: { ease: 'circOut' } }}
                exit={{ opacity: 0, x: -10, transition: { ease: 'circIn' } }}
                className="flex flex-col col-span-full"
              >
                <span>Alumni ID</span>
                <input
                  type={'text'}
                  name="alumniIdNumber"
                  placeholder="Alumni ID"
                  className="input input-primary"
                />
              </motion.label>
            )}
          </AnimatePresence>

          <button type="submit" className="btn btn-primary col-span-full mt-10">
            Submit
          </button>
        </form>
      </motion.main>
    </>
  );
};

export default Page_setup;
