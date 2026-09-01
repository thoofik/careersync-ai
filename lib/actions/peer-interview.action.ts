'use server';

import { db } from "@/firebase/admin";

interface CreatePeerInterviewParams {
  userId: string;
  role: string;
  level: string;
  techstack: string[];
}

interface GetPeerInterviewParams {
  userId: string;
  limit?: number;
}

interface UpdatePeerInterviewParams {
  interviewId: string;
  status?: 'pending' | 'active' | 'completed';
  interviewerId?: string;
  roomId?: string;
}

interface CreatePeerFeedbackParams {
  interviewId: string;
  interviewerId: string;
  intervieweeId: string;
  rating: number;
  strengths: string;
  areasToImprove: string;
  nextSteps: string;
}

export async function createPeerInterview(params: CreatePeerInterviewParams) {
  const { userId, role, level, techstack } = params;

  try {
    // Generate a unique room ID for the video call
    const roomId = `peer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Create the peer interview document
    const peerInterview = {
      userId, // The interviewee/creator
      role,
      level,
      techstack,
      status: 'pending', // pending, active, completed
      interviewerId: null, // Will be populated when someone joins
      roomId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newInterview = await db.collection('peer-interviews')
      .add(peerInterview);

    return { success: true, interviewId: newInterview.id };
  } catch (error) {
    console.error('Error creating peer interview:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

const byNewest = (a: PeerInterview, b: PeerInterview) =>
  (b.createdAt || "").localeCompare(a.createdAt || "");

export async function getPeerInterviews(userId: string): Promise<PeerInterview[] | null> {
  try {
    const interviews = await db
      .collection('peer-interviews')
      .where('status', '==', 'pending')
      .get();

    return interviews.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as PeerInterview)
      .filter((interview) => interview.userId !== userId)
      .sort(byNewest);
  } catch (error) {
    console.error('Error getting peer interviews:', error);
    return null;
  }
}

export async function getUserPeerInterviews(userId: string): Promise<PeerInterview[] | null> {
  try {
    const interviews = await db
      .collection('peer-interviews')
      .where('userId', '==', userId)
      .get();

    return interviews.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as PeerInterview)
      .sort(byNewest);
  } catch (error) {
    console.error('Error getting user peer interviews:', error);
    return null;
  }
}

export async function getPeerInterviewById(id: string): Promise<PeerInterview | null> {
  try {
    const interview = await db
      .collection('peer-interviews')
      .doc(id)
      .get();

    if (!interview.exists) {
      return null;
    }

    return { id: interview.id, ...interview.data() } as PeerInterview;
  } catch (error) {
    console.error('Error getting peer interview by ID:', error);
    return null;
  }
}

export async function updatePeerInterview(params: UpdatePeerInterviewParams) {
  const { interviewId, ...updateData } = params;

  try {
    await db
      .collection('peer-interviews')
      .doc(interviewId)
      .update({
        ...updateData,
        updatedAt: new Date().toISOString()
      });

    return { success: true };
  } catch (error) {
    console.error('Error updating peer interview:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function createPeerFeedback(params: CreatePeerFeedbackParams) {
  const { interviewId, interviewerId, intervieweeId, rating, strengths, areasToImprove, nextSteps } = params;

  try {
    const feedback = [
      `Strengths:\n${strengths}`,
      `Areas to improve:\n${areasToImprove}`,
      `Recommended next steps:\n${nextSteps}`,
    ].join("\n\n");

    const peerFeedback = {
      interviewId,
      interviewerId,
      intervieweeId,
      rating,
      strengths,
      areasToImprove,
      nextSteps,
      feedback,
      createdAt: new Date().toISOString()
    };

    const newFeedback = await db.collection('peer-interview-feedback')
      .add(peerFeedback);

    // Update the interview status
    await updatePeerInterview({
      interviewId,
      status: 'completed'
    });

    return { success: true, feedbackId: newFeedback.id };
  } catch (error) {
    console.error('Error creating peer feedback:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getPeerFeedbackByInterviewId(interviewId: string): Promise<PeerFeedback | null> {
  try {
    const feedback = await db
      .collection('peer-interview-feedback')
      .where('interviewId', '==', interviewId)
      .limit(1)
      .get();

    if (feedback.empty) {
      return null;
    }

    const feedbackDoc = feedback.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() } as PeerFeedback;
  } catch (error) {
    console.error('Error getting peer feedback:', error);
    return null;
  }
}

export const deletePeerInterview = async (interviewId: string, userId: string) => {
  try {
    // Check if the user is the creator of the interview
    const interview = await db
      .collection('peer-interviews')
      .doc(interviewId)
      .get();

    if (!interview.exists) {
      throw new Error("Interview not found");
    }

    const interviewData = interview.data() as PeerInterview;
    if (interviewData.userId !== userId) {
      throw new Error("You are not authorized to delete this interview");
    }

    // Delete the interview
    await db
      .collection('peer-interviews')
      .doc(interviewId)
      .delete();

    return { success: true };
  } catch (error) {
    console.error("Error in deletePeerInterview:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}; 