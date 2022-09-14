import { useEffect, useState } from 'react';

import _supabase from '../../utils/_supabase';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAccount } from '../../components/AccountContext';
import { useRouter } from 'next/router';

const Page_PostAuth = (e) => {
  const { setUserData } = useAccount();
  const [useDetails, setUseDetails] = useState({
    user_handle: '',
    name_given: '',
    name_last: '',
    name_middle: '',
    birthdate: '',
    hasId: false,
    alumniIdNumber: '',
  });
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const submitUserDetails = async (e) => {
    e.preventDefault();

    setIsSaving(true);

    // check if all fields are filled
    if (
      useDetails.name_given === '' ||
      useDetails.name_last === '' ||
      useDetails.birthdate === ''
    ) {
      toast.error('Please fill out all fields');
      setIsSaving(false);
      return;
    }

    toast.loading('Creating your account...');
    const { data, error } = await _supabase.from('user_data').insert([
      {
        id: _supabase.auth.user().id,
        email: _supabase.auth.user().email,
        user_handle: useDetails.user_handle,
        name_given: useDetails.name_given,
        name_last: useDetails.name_last,
        name_middle: useDetails.name_middle,
        birthdate: useDetails.birthdate,
        hasId: useDetails.hasId,
        alumniIdNumber: useDetails.hasId
          ? useDetails.alumniIdNumber
          : 'TEMPORARY',
      },
    ]);

    if (error) {
      toast.dismiss();
      toast(error.message);
      setIsSaving(false);
    }

    if (data) {
      toast.dismiss();
      toast.success('User details saved!');
      setUserData(data[0]);
      router.replace('/feed');
    }
  };

  return (
    <>
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={'flex flex-col'}
      >
        <p className="text-2xl">Welcome to Alumnus Plus</p>
        <p>
          Your alumni network is now at your fingertips. But first, let's get
          you set up.
        </p>

        {/* forms */}
        <div className="form-control mt-10 gap-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <label className="flex flex-col">
              <span>Username</span>
              <input
                type="text"
                className="input input-primary"
                placeholder="juanpoblador"
                value={useDetails.user_handle}
                onChange={(e) => {
                  setUseDetails({
                    ...useDetails,
                    user_handle: e.target.value,
                  });
                }}
              />
              <span className="text-xs">
                We will add the @ symbol for you. You can change this later.
              </span>
            </label>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <label className="flex flex-col">
              <span>Given Name</span>
              <input
                type="text"
                className="input input-primary"
                placeholder="Juan"
                value={useDetails.name_given}
                onChange={(e) => {
                  setUseDetails({ ...useDetails, name_given: e.target.value });
                }}
              />
            </label>
            <label className="flex flex-col">
              <span>Middle Name (Optional)</span>
              <input
                type="text"
                className="input input-primary"
                placeholder="Poblador"
                value={useDetails.name_middle}
                onChange={(e) => {
                  setUseDetails({ ...useDetails, name_middle: e.target.value });
                }}
              />
            </label>
            <label className="flex flex-col">
              <span>Middle Name (Optional)</span>
              <input
                type="text"
                className="input input-primary"
                placeholder="Dela Cruz"
                value={useDetails.name_last}
                onChange={(e) => {
                  setUseDetails({ ...useDetails, name_last: e.target.value });
                }}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <label className="flex flex-col">
              <span>Birth date</span>
              <input
                type="date"
                className="input input-primary"
                placeholder="Juan"
                value={useDetails.birthdate}
                onChange={(e) => {
                  setUseDetails({ ...useDetails, birthdate: e.target.value });
                }}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <label className="flex flex-col">
              <span>Do you have an Alumni ID?</span>
              <input
                type="checkbox"
                onChange={(e) => {
                  setUseDetails({
                    ...useDetails,
                    hasId: e.target.checked,
                  });
                }}
                className="toggle mt-3 ml-3"
                placeholder="Juan"
              />
            </label>
            {useDetails.hasId && (
              <label className="flex flex-col">
                <span>Alumni ID Number</span>
                <input
                  type="text"
                  className="input input-primary"
                  placeholder="Juan"
                />
              </label>
            )}
          </div>

          {/* submit */}
          <button
            disabled={isSaving}
            onClick={submitUserDetails}
            className="btn btn-primary mt-8"
          >
            Submit
          </button>
        </div>
      </motion.main>
    </>
  );
};

export default Page_PostAuth;
