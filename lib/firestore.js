import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, runTransaction, where, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

export async function createPoll(question, candidates, createdBy, startTime, endTime) {
  try {
    const formattedCandidates = candidates
      .filter(candidate => candidate.name && candidate.name.trim() !== '')
      .map(candidate => ({
        name: candidate.name.trim(),
        description: candidate.description ? candidate.description.trim() : '',
        imageUrl: candidate.imageUrl ? candidate.imageUrl.trim() : '',
        votes: 0,
      }));

    if (formattedCandidates.length < 2) {
      throw new Error("Please provide at least two candidates with names.");
    }

    const docRef = await addDoc(collection(db, "polls"), {
      question: question,
      options: formattedCandidates,
      startTime: Timestamp.fromDate(new Date(startTime)),
      endTime: Timestamp.fromDate(new Date(endTime)),
      createdAt: serverTimestamp(),
      createdBy: createdBy,
    });

    console.log("Election created with ID: ", docRef.id);
    return { success: true, error: null };
  } catch (error) {
    console.error("Error creating election: ", error);
    return { success: false, error: error.message };
  }
}

export async function getPolls() {
  try {
    const pollsCollection = collection(db, "polls");
    const q = query(pollsCollection, orderBy("createdAt", "desc"));
    const pollSnapshot = await getDocs(q);
    
    const polls = pollSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { polls, error: null };
  } catch (error) {
    console.error("Error fetching polls: ", error);
    return { polls: [], error: error.message };
  }
}

export async function submitVote(pollId, optionIndex, userId) {
  try {
    const pollRef = doc(db, "polls", pollId);
    const voterRef = doc(db, "polls", pollId, "voters", userId);
    const userRef = doc(db, "users", userId);

    await runTransaction(db, async (transaction) => {
      const voterDoc = await transaction.get(voterRef);
      if (voterDoc.exists()) {
        throw new Error("You have already voted in this poll.");
      }

      const pollDoc = await transaction.get(pollRef);
      if (!pollDoc.exists()) throw new Error("Poll does not exist.");
      
      const pollData = pollDoc.data();
      const newOptions = [...pollData.options];
      newOptions[optionIndex].votes += 1;

      transaction.update(pollRef, { options: newOptions });
      transaction.set(voterRef, { votedAt: serverTimestamp() });
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Error submitting vote: ", error);
    return { success: false, error: error.message };
  }
}

export async function getUserData(userId) {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data: ", error);
    return null;
  }
}

// NEW FUNCTION TO GET A SINGLE POLL
export async function getPollById(pollId) {
  try {
    const pollRef = doc(db, "polls", pollId);
    const pollSnap = await getDoc(pollRef);

    if (pollSnap.exists()) {
      return { poll: { id: pollSnap.id, ...pollSnap.data() }, error: null };
    } else {
      throw new Error("Poll not found.");
    }
  } catch (error) {
    console.error("Error fetching poll by ID: ", error);
    return { poll: null, error: error.message };
  }
}

export async function submitPollRequest(requestDetails) {
  try {
    await addDoc(collection(db, "pollRequests"), {
      ...requestDetails,
      status: 'pending', // Initial status
      requestedAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error) {
    console.error("Error submitting poll request: ", error);
    return { success: false, error: error.message };
  }
}

// NEW FUNCTION FOR ADMIN
export async function getPollRequests() {
  try {
    const requestsCollection = collection(db, "pollRequests");
    const q = query(requestsCollection, orderBy("requestedAt", "desc"));
    const requestsSnapshot = await getDocs(q);
    
    const requests = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { requests, error: null };
  } catch (error) {
    console.error("Error fetching poll requests: ", error);
    return { requests: [], error: error.message };
  }
}