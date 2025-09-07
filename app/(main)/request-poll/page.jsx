import RequestPollForm from "@/components/polls/RequestPollForm";

export default function RequestPollPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800">Request an Election</h1>
        <p className="text-lg text-gray-600 mt-2">
          Want to stand for a position or propose a new election? Fill out the form below. The admin will review your request.
        </p>
      </div>
      
      <div className="mt-8">
        <RequestPollForm />
      </div>
    </div>
  );
}