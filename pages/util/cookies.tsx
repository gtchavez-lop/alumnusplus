import { AnimPageTransition } from "@/lib/animations";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function CookiePolicyPage() {
	return (
		<>
			<motion.main
				variants={AnimPageTransition}
				initial="initial"
				animate="animate"
				exit="exit"
				className="relative min-h-screen w-full pt-24 pb-36"
			>
				<h1 className="text-4xl font-bold mb-5">Cookie Policy for Wicket</h1>

				<p>
					This is the Cookie Policy for Wicket, accessible from
					wicket.vercel.app
				</p>

				<p className="mt-5 font-bold text-xl text-primary">
					<strong>What Are Cookies</strong>
				</p>

				<p>
					As is common practice with almost all professional websites this site
					uses cookies, which are tiny files that are downloaded to your
					computer, to improve your experience. This page describes what
					information they gather, how we use it and why we sometimes need to
					store these cookies. We will also share how you can prevent these
					cookies from being stored however this may downgrade or
					&apos;break&apos; certain elements of the sites functionality.
				</p>

				<p className="mt-5 font-bold text-xl text-primary">
					<strong>How We Use Cookies</strong>
				</p>

				<p>
					We use cookies for a variety of reasons detailed below. Unfortunately
					in most cases there are no industry standard options for disabling
					cookies without completely disabling the functionality and features
					they add to this site. It is recommended that you leave on all cookies
					if you are not sure whether you need them or not in case they are used
					to provide a service that you use.
				</p>

				<p className="mt-5 font-bold text-xl text-primary">
					<strong>Disabling Cookies</strong>
				</p>

				<p>
					You can prevent the setting of cookies by adjusting the settings on
					your browser (see your browser Help for how to do this). Be aware that
					disabling cookies will affect the functionality of this and many other
					websites that you visit. Disabling cookies will usually result in also
					disabling certain functionality and features of the this site.
					Therefore it is recommended that you do not disable cookies.
				</p>

				<p className="mt-5 font-bold text-xl text-primary">
					<strong>The Cookies We Set</strong>
				</p>

				<ul className="grid grid-cols-1 md:grid-cols-2">
					<li>
						<p className="text-secondary text-lg">Account related cookies</p>
						<p>
							If you create an account with us then we will use cookies for the
							management of the signup process and general administration. These
							cookies will usually be deleted when you log out however in some
							cases they may remain afterwards to remember your site preferences
							when logged out.
						</p>
					</li>

					<li>
						<p className="text-secondary text-lg">Login related cookies</p>
						<p>
							We use cookies when you are logged in so that we can remember this
							fact. This prevents you from having to log in every single time
							you visit a new page. These cookies are typically removed or
							cleared when you log out to ensure that you can only access
							restricted features and areas when logged in.
						</p>
					</li>
				</ul>

				<p className="mt-5 font-bold text-xl text-primary">
					<strong>Third Party Cookies</strong>
				</p>

				<p>
					In some special cases we also use cookies provided by trusted third
					parties. The following section details which third party cookies you
					might encounter through this site.
				</p>

				<ul>
					<li>
						<p>
							Third party analytics are used to track and measure usage of this
							site so that we can continue to produce engaging content. These
							cookies may track things such as how long you spend on the site or
							pages you visit which helps us to understand how we can improve
							the site for you.
						</p>
					</li>

					<li>
						<p>
							From time to time we test new features and make subtle changes to
							the way that the site is delivered. When we are still testing new
							features these cookies may be used to ensure that you receive a
							consistent experience whilst on the site whilst ensuring we
							understand which optimisations our users appreciate the most.
						</p>
					</li>
				</ul>

				<p className="mt-5 font-bold text-xl text-primary">
					<strong>More Information</strong>
				</p>

				<p>
					Hopefully that has clarified things for you and as was previously
					mentioned if there is something that you aren&apos;t sure whether you
					need or not it&apos;s usually safer to leave cookies enabled in case
					it does interact with one of the features you use on our site.
				</p>

				<p>
					For more general information on cookies, please read{" "}
					<a href="https://www.cookiepolicygenerator.com/sample-cookies-policy/">
						the Cookies Policy article
					</a>
					.
				</p>

				<p>
					However if you are still looking for more information then you can
					contact us through one of our preferred contact methods:
				</p>

				<ul className="grid grid-cols-1 md:grid-cols-2">
					<li>Email: </li>
					<li>By visiting this link: </li>
				</ul>
			</motion.main>
			<Footer />
		</>
	);
}
