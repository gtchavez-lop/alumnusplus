import Link from 'next/link';
import { _Page_Transition } from '../lib/_animations';
import _supabase from '../lib/supabase';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

const Page_SignIn = () => {
  const router = useRouter();

  const _signIn = async (e) => {
    e.preventDefault();

    const elements = e.target.elements;

    // disable form
    for (let i = 0; i < elements.length; i++) {
      elements[i].disabled = true;
    }

    toast.loading('Signing in...');

    const { error } = await _supabase.auth.signIn({
      email: e.target.user_email.value,
      password: e.target.user_password.value,
    });

    if (error) {
      toast.dismiss();
      toast.error(error.message);
      // disable form
      for (let i = 0; i < elements.length; i++) {
        elements[i].disabled = false;
      }
    } else {
      toast.dismiss();
      toast.success('Signed in');
      router.push('/feed');
    }
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
        <p className="text-4xl font-thin">Sign in with your account</p>

        <form
          className="form-control w-full max-w-lg mt-16 gap-5"
          method="POST"
          onSubmit={(e) => _signIn(e)}
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

          <button className="btn btn-primary mt-10">
            <span>Sign in</span>
          </button>

          {/* redirect to sign up */}
          <p className="mt-5 text-center">
            Don&apos;t have an account?{' '}
            <Link href={'/signup'}>
              <span className="text-primary cursor-pointer ">
                Click here to Sign up
              </span>
            </Link>
          </p>
        </form>
      </motion.main>
    </>
  );
};

export default Page_SignIn;
