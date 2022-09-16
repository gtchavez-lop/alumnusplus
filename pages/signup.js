import Link from 'next/link';
import { _Page_Transition } from '../lib/_animations';
import _supabase from '../lib/supabase';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const Page_SignUp = (e) => {
  const router = useRouter();

  const checkIfUserExistsInDb = async (email) => {
    const { data, error } = await _supabase
      .from('user_data')
      .select('id')
      .eq('email', email)
      .single();

    if (data) {
      return true;
    } else {
      return false;
    }
  };

  const _signUp = async (e) => {
    e.preventDefault();

    const elements = e.target.elements;

    // disable form
    for (let i = 0; i < elements.length; i++) {
      elements[i].disabled = true;
    }

    toast.loading('Signing up...');

    const email = e.target.user_email.value;
    const password = e.target.user_password.value;

    // check if user exists in db
    const userExists = await checkIfUserExistsInDb(email);

    if (userExists) {
      toast.dismiss();
      toast.error('User already exists');
      // enable form
      for (let i = 0; i < elements.length; i++) {
        elements[i].disabled = false;
      }
      return;
    }

    const { error } = await _supabase.auth.signUp({ email, password });

    if (error) {
      toast.dismiss();
      toast.error(error.message);
      // enable form
      for (let i = 0; i < elements.length; i++) {
        elements[i].disabled = false;
      }
      return;
    }

    toast.dismiss();
    toast.success(
      'Sign up successful! Check your email for a confirmation link.'
    );

    router.replace('/signin');
  };

  return (
    <>
      <motion.main
        variants={_Page_Transition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center mt-32"
      >
        <p className="text-4xl font-thin">Sign up to Alumnus Plus</p>
        <p className="mt-5">
          In this initial process, you will be marked as unverified
        </p>
        <p className="text-xs opacity-50 max-w-sm text-center">
          *Unverified users cannot access the app, they must verify their
          initial account by clicking the link the from the email sent to them
        </p>

        <form
          className="form-control w-full max-w-lg mt-16 gap-5"
          method="POST"
          onSubmit={(e) => _signUp(e)}
        >
          <label className="flex flex-col w-full">
            <span>Email Address</span>
            <input
              name="user_email"
              type={'email'}
              className="input input-primary w-full"
            />
          </label>
          <label className="flex flex-col w-full">
            <span>Password</span>
            <input
              name="user_password"
              type={'password'}
              className="input input-primary w-full"
            />
          </label>

          <button type="submit" className="btn btn-primary mt-10">
            <span>Sign up</span>
          </button>

          {/* redirect to sign in */}
          <p className="mt-5 text-center">
            Already have an account?{' '}
            <Link href={'/signin'}>
              <span className="text-primary cursor-pointer">
                Click here to sign in
              </span>
            </Link>
          </p>
        </form>
      </motion.main>
    </>
  );
};

export default Page_SignUp;
