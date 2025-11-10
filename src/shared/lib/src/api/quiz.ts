export interface QuizProgress {
  userId: string;
  sessionId: string;
  currentQuestionIndex: number;
  correctAnswers: number;
  totalQuestions: number;
  isCompleted: boolean;
  answers: number[]; // Array of selected answer indices for each question
  createdAt: string;
  updatedAt: string;
}

export const quizApi = {
  /**
   * Get quiz progress for a specific session
   */
  async getProgress(sessionId: string): Promise<QuizProgress> {
    const response = await fetch(`/api/quiz/progress?sessionId=${sessionId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch quiz progress");
    }

    return response.json();
  },

  /**
   * Update quiz progress for a specific session
   */
  async updateProgress(
    sessionId: string,
    data: {
      currentQuestionIndex?: number;
      correctAnswers?: number;
      totalQuestions?: number;
      isCompleted?: boolean;
      answers?: number[];
    }
  ): Promise<QuizProgress> {
    const response = await fetch("/api/quiz/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, ...data }),
    });

    if (!response.ok) {
      throw new Error("Failed to update quiz progress");
    }

    return response.json();
  },

  /**
   * Reset quiz progress for a specific session
   */
  async resetProgress(sessionId: string): Promise<QuizProgress> {
    const response = await fetch(`/api/quiz/progress?sessionId=${sessionId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to reset quiz progress");
    }

    return response.json();
  },

  /**
   * Delete all quiz progress for the current user
   */
  async resetAllProgress(): Promise<void> {
    const response = await fetch("/api/quiz/progress/reset-all", {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to reset all quiz progress");
    }
  },
};
