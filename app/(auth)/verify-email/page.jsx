export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Check Your Inbox!</h1>
      <p className="text-gray-600 mb-6">
        We've sent a verification link to your IITG email address. Please click the link to activate your account.
      </p>
      <div className="bg-white shadow-lg rounded-xl p-6">
        <p className="text-sm text-gray-500 mb-4">
          Didn't receive an email? Check your spam folder or click below to resend.
        </p>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
        >
          Resend Verification Email
        </button>
      </div>
      <p className="text-center text-gray-500 text-sm mt-6">
        Already verified? <a href="/login" className="font-bold text-blue-600 hover:text-blue-800">Log In</a>
      </p>
    </div>
  );
}