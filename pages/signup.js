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

      // focus on email input
      elements.user_email.focus();
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

  const checkPassword = (e) => {
    const form = e.target.form;

    const p1 = form['user_password'];
    const p2 = form['user_passwordConfirm'];

    // disable submit button

    if (p1.value !== p2.value) {
      p1.classList.add('input-error');
      p2.classList.add('input-error');
      p1.classList.add('ring-error');
      p2.classList.add('ring-error');
      form['submit'].disabled = true;

      // disable form submit method
      form.onsubmit = (e) => {
        e.preventDefault();
      };
    } else {
      p1.classList.remove('input-error');
      p2.classList.remove('input-error');
      p1.classList.remove('ring-error');
      p2.classList.remove('ring-error');
      form['submit'].disabled = false;

      // enable form submit method
      form.onsubmit = (e) => {
        _signUp(e);
      };
    }
  };

  return (
    <>
      <motion.main
        variants={_Page_Transition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center my-32"
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
          id="signup-form"
          method="POST"
          onChange={(e) => checkPassword(e)}
        >
          <label className="flex flex-col w-full">
            <span>Email Address</span>
            <input
              name="user_email"
              type={'email'}
              className="input input-primary w-full"
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <label className="flex flex-col w-full">
              <span>Password</span>
              <input
                name="user_password"
                type={'password'}
                className="input input-primary w-full"
              />
            </label>
            {/* confirm password */}
            <label className="flex flex-col w-full">
              <span>Confirm Password</span>
              <input
                name="user_passwordConfirm"
                type={'password'}
                className="input input-primary w-full "
              />
            </label>
          </div>

          <button type="submit" name="submit" className="btn btn-primary mt-5">
            <span>Sign up</span>
          </button>

          {/* redirect to sign in */}
          <p className="mt-2 text-center">
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
